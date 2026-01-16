import { useState, useEffect, useRef } from 'react';
import { Send, X, User, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  propertyId?: string;
  propertyTitle?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  hostId,
  hostName,
  hostAvatar,
  propertyId,
  propertyTitle,
}: ChatModalProps) {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    messagesLoading,
    getOrCreateConversation,
    sendMessage,
    markAsRead,
    isSending,
  } = useMessaging(conversationId || undefined);

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen && user?.id && hostId) {
      setIsInitializing(true);
      console.log('Initializing conversation with host:', hostId, 'for property:', propertyId);
      
      getOrCreateConversation(hostId, propertyId)
        .then((convId) => {
          console.log('Conversation initialized:', convId);
          setConversationId(convId);
          markAsRead(convId);
        })
        .catch((error) => {
          console.error('Failed to initialize conversation:', error);
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, [isOpen, user?.id, hostId, propertyId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when viewing
  useEffect(() => {
    if (conversationId && isOpen) {
      markAsRead(conversationId);
    }
  }, [conversationId, isOpen, messages.length]);

  const handleSend = () => {
    console.log('handleSend called', { 
      messageText: messageText.trim(),
      conversationId,
      isSending,
      isInitializing
    });
    
    if (!messageText.trim() || !conversationId) {
      console.log('Cannot send: missing text or conversationId', { 
        hasText: !!messageText.trim(), 
        conversationId 
      });
      return;
    }

    console.log('Sending message to conversation:', conversationId);
    sendMessage({
      conversation_id: conversationId,
      content: messageText.trim(),
    });
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  };

  const groupMessagesByDate = (msgs: typeof messages) => {
    const groups: { date: string; messages: typeof messages }[] = [];
    let currentDate = '';

    msgs.forEach((msg) => {
      const msgDate = format(new Date(msg.created_at), 'yyyy-MM-dd');
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-lg h-[80vh] sm:h-[600px] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="sm:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {hostAvatar ? (
            <img
              src={hostAvatar}
              alt={hostName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{hostName}</h3>
            {propertyTitle && (
              <p className="text-xs text-gray-500 truncate">
                Re: {propertyTitle}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hidden sm:flex"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {isInitializing || messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="md" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Start a conversation</h4>
              <p className="text-sm text-gray-500">
                Send a message to {hostName} about{' '}
                {propertyTitle ? `"${propertyTitle}"` : 'this property'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupMessagesByDate(messages).map((group) => (
                <div key={group.date}>
                  {/* Date Header */}
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                      {formatDateHeader(group.date)}
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-2">
                    {group.messages.map((message) => {
                      const isOwn = message.sender_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex',
                            isOwn ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] rounded-2xl px-4 py-2 shadow-sm',
                              isOwn
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
                            )}
                          >
                            {message.message_type === 'image' && message.image_url && (
                              <img
                                src={message.image_url}
                                alt="Shared image"
                                className="rounded-lg mb-2 max-w-full"
                              />
                            )}
                            <p className={cn(
                              'text-sm whitespace-pre-wrap break-words',
                              isOwn ? 'text-white' : 'text-gray-800'
                            )}>
                              {message.content}
                            </p>
                            <p
                              className={cn(
                                'text-xs mt-1',
                                isOwn ? 'text-blue-100' : 'text-gray-400'
                              )}
                            >
                              {formatMessageDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isSending || isInitializing || !conversationId}
            />
            <Button
              onClick={handleSend}
              disabled={!messageText.trim() || !conversationId || isSending || isInitializing}
              size="icon"
              className="flex-shrink-0"
              type="button"
            >
              {isSending ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Messages are private between you and {hostName}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
