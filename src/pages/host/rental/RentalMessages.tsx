/**
 * RENTAL MESSAGES PAGE - Communication with tenants
 */

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, User, MessageCircle, Archive, MoreVertical, Send, Paperclip, Phone, Video, Check, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { ChatModal } from '@/components/messaging/ChatModal';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/messaging';

const RentalMessages = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    conversations, 
    messages, 
    conversationsLoading, 
    messagesLoading,
    archiveConversation,
    sendMessage,
    markAsRead,
    isSending
  } = useMessaging(selectedConversation?.id);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && !isMobile) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMobile]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.other_user?.name?.toLowerCase().includes(searchLower) ||
      conv.property?.title?.toLowerCase().includes(searchLower) ||
      conv.last_message_preview?.toLowerCase().includes(searchLower)
    );
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  // Handle conversation selection
  const handleConversationClick = (conv: Conversation) => {
    setSelectedConversation(conv);
    if (isMobile) {
      setShowMobileModal(true);
    } else {
      // Mark as read when opening on desktop
      if (conv.unread_count && conv.unread_count > 0) {
        markAsRead(conv.id);
      }
    }
  };

  // Handle sending message on desktop
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;
    
    console.log('Sending message:', {
      conversation_id: selectedConversation.id,
      content: newMessage.trim()
    });
    
    try {
      await sendMessage({
        conversation_id: selectedConversation.id,
        content: newMessage.trim(),
        message_type: 'text'
      });
      
      setNewMessage('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <RentalManagerLayout 
      title="Messages" 
      subtitle={totalUnread > 0 ? `${totalUnread} unread message${totalUnread !== 1 ? 's' : ''}` : 'No unread messages'}
    >
      {conversationsLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try a different search term'
                : 'Messages with your tenants will appear here'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversations List */}
          <Card className="w-full lg:w-80 flex-shrink-0 border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className={cn(
                    'w-full p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50',
                    selectedConversation?.id === conv.id && 'bg-blue-50',
                    conv.unread_count && conv.unread_count > 0 && 'bg-primary/5'
                  )}
                >
                  {/* Avatar */}
                  {conv.other_user?.avatar_url ? (
                    <img
                      src={conv.other_user.avatar_url}
                      alt={conv.other_user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 truncate text-sm">
                        {conv.other_user?.name || 'Unknown User'}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                      </span>
                    </div>
                    {conv.property && (
                      <p className="text-xs text-primary font-medium truncate">
                        {conv.property.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 truncate mt-0.5">
                      {conv.last_message_preview || 'No messages yet'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {conv.unread_count && conv.unread_count > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs px-1.5 min-w-[20px] h-5">
                        {conv.unread_count}
                      </Badge>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveConversation(conv.id);
                          }}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Desktop Chat Area */}
          {selectedConversation ? (
            <Card className="flex-1 border-gray-200 hidden lg:flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedConversation.other_user?.avatar_url ? (
                    <img
                      src={selectedConversation.other_user.avatar_url}
                      alt={selectedConversation.other_user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation.other_user?.name || 'Unknown User'}
                    </h3>
                    {selectedConversation.property && (
                      <p className="text-xs text-gray-500">{selectedConversation.property.title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            msg.sender_id === user?.id
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <p className={`text-sm ${msg.sender_id === user?.id ? 'text-white' : 'text-gray-900'}`}>
                            {msg.content}
                          </p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            msg.sender_id === user?.id ? 'text-white opacity-80' : 'text-gray-400'
                          }`}>
                            <span className="text-xs">
                              {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                            </span>
                            {msg.sender_id === user?.id && (
                              msg.is_read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <Paperclip className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                    disabled={isSending}
                  />
                  <Button 
                    size="sm" 
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex-1 hidden lg:flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Chat Modal */}
      {selectedConversation && showMobileModal && (
        <ChatModal
          isOpen={showMobileModal}
          onClose={() => {
            setShowMobileModal(false);
            setSelectedConversation(null);
          }}
          hostId={selectedConversation.other_user?.id || ''}
          hostName={selectedConversation.other_user?.name || 'User'}
          hostAvatar={selectedConversation.other_user?.avatar_url || undefined}
          propertyId={selectedConversation.property_id || undefined}
          propertyTitle={selectedConversation.property?.title}
        />
      )}
    </RentalManagerLayout>
  );
};

export default RentalMessages;
