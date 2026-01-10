import { useState } from 'react';
import { MessageCircle, User, Search, Archive, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function Messages() {
  const { user } = useAuth();
  const { conversations, conversationsLoading, archiveConversation } = useMessaging();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.other_user?.name?.toLowerCase().includes(searchLower) ||
      conv.property?.title?.toLowerCase().includes(searchLower) ||
      conv.last_message_preview?.toLowerCase().includes(searchLower)
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view messages</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access your messages.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Your conversations with hosts and guests</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10"
          />
        </div>

        {/* Conversations List */}
        {conversationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try a different search term'
                : 'Start a conversation by contacting a host on a property page'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  'flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors',
                  conversation.unread_count && conversation.unread_count > 0 && 'bg-primary/5'
                )}
                onClick={() => {
                  console.log('Conversation clicked:', conversation);
                  setSelectedConversation(conversation);
                }}
              >
                {/* Avatar */}
                {conversation.other_user?.avatar_url ? (
                  <img
                    src={conversation.other_user.avatar_url}
                    alt={conversation.other_user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {conversation.other_user?.name || 'Unknown User'}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {conversation.property && (
                    <p className="text-xs text-primary font-medium truncate mb-1">
                      {conversation.property.title}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.last_message_preview || 'No messages yet'}
                  </p>
                </div>

                {/* Unread Badge & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {conversation.unread_count && conversation.unread_count > 0 && (
                    <Badge className="bg-primary text-white">
                      {conversation.unread_count}
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
                          archiveConversation(conversation.id);
                        }}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          isOpen={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
          hostId={selectedConversation.other_user?.id || ''}
          hostName={selectedConversation.other_user?.name || 'User'}
          hostAvatar={selectedConversation.other_user?.avatar_url || undefined}
          propertyId={selectedConversation.property_id || undefined}
          propertyTitle={selectedConversation.property?.title}
        />
      )}

      <Footer />
    </div>
  );
}
