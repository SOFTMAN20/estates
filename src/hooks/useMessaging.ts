import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Conversation, Message, SendMessageData } from '@/types/messaging';
import { useToast } from '@/contexts/ToastContext';

// Type for RPC function responses
interface OtherParticipant {
  user_id: string;
  name: string;
  avatar_url: string | null;
}

// Type for conversation participant data
interface ConversationParticipantData {
  conversation_id: string;
  last_read_at: string | null;
  is_archived: boolean;
  conversations: {
    id: string;
    property_id: string | null;
    created_at: string;
    updated_at: string;
    last_message_at: string | null;
    last_message_preview: string | null;
    properties: { id: string; title: string; images: string[] } | null;
  };
}

// Type for message data from DB
interface MessageData {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  profiles: { id: string; name: string; avatar_url: string | null } | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useMessaging(conversationId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  // Fetch all conversations for the current user
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await db
        .from('conversation_participants')
        .select(`
          conversation_id,
          last_read_at,
          is_archived,
          conversations!inner(
            id,
            property_id,
            created_at,
            updated_at,
            last_message_at,
            last_message_preview,
            properties(id, title, images)
          )
        `)
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('conversations(last_message_at)', { ascending: false });

      if (error) throw error;

      // Get other participants for each conversation using security definer function
      const conversationsWithUsers = await Promise.all(
        ((data || []) as ConversationParticipantData[]).map(async (cp) => {
          const conv = cp.conversations;
          
          // Get other participant using RPC function (bypasses RLS)
          const { data: otherParticipant } = await db
            .rpc('get_other_conversation_participant', {
              p_conversation_id: conv.id,
              p_current_user_id: user.id
            })
            .single();

          // Count unread messages
          const { count } = await db
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .eq('is_read', false);

          const participant = otherParticipant as OtherParticipant | null;

          return {
            id: conv.id,
            property_id: conv.property_id,
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            last_message_at: conv.last_message_at,
            last_message_preview: conv.last_message_preview,
            property: conv.properties,
            other_user: participant ? {
              id: participant.user_id,
              name: participant.name,
              avatar_url: participant.avatar_url,
            } : undefined,
            unread_count: count || 0,
          } as Conversation;
        })
      );

      return conversationsWithUsers;
    },
    enabled: !!user?.id,
  });

  // Fetch messages for a specific conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await db
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey(id, name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return ((data || []) as MessageData[]).map((msg) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: msg.message_type,
        image_url: msg.image_url,
        is_read: msg.is_read,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        sender: msg.profiles,
      })) as Message[];
    },
    enabled: !!conversationId,
  });

  // Get unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { data, error } = await db
        .rpc('get_unread_message_count', { p_user_id: user.id });

      if (error) throw error;
      return (data as number) || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  // Get or create conversation
  const getOrCreateConversation = async (otherUserId: string, propertyId?: string): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    console.log('Getting or creating conversation:', {
      user1: user.id,
      user2: otherUserId,
      propertyId,
    });

    const { data, error } = await db
      .rpc('get_or_create_conversation', {
        p_user1_id: user.id,
        p_user2_id: otherUserId,
        p_property_id: propertyId || null,
      });

    if (error) {
      console.error('get_or_create_conversation error:', error);
      throw error;
    }
    
    console.log('Conversation ID:', data);
    return data as string;
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: SendMessageData) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Sending message:', {
        conversation_id: messageData.conversation_id,
        sender_id: user.id,
        content: messageData.content.substring(0, 50),
      });

      const { data, error } = await db
        .from('messages')
        .insert({
          conversation_id: messageData.conversation_id,
          sender_id: user.id,
          content: messageData.content,
          message_type: messageData.message_type || 'text',
          image_url: messageData.image_url || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Message insert error:', error);
        throw error;
      }
      
      const msgData = data as { id: string };
      console.log('Message sent successfully:', msgData?.id);
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate with the conversation_id from the message data
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
    },
    onError: (error: Error) => {
      console.error('Failed to send message:', error);
      const errorMessage = error?.message || 'Unknown error';
      showError(`Failed to send message: ${errorMessage}`);
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (convId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Marking messages as read for conversation:', convId);

      // Mark all messages in conversation as read
      const { error: msgError, count } = await db
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', convId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (msgError) {
        console.error('Error marking messages as read:', msgError);
        // Don't throw - this is not critical
      } else {
        console.log('Marked messages as read, count:', count);
      }

      // Update last_read_at for participant
      const { error: partError } = await db
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', convId)
        .eq('user_id', user.id);

      if (partError) {
        console.error('Error updating last_read_at:', partError);
        // Don't throw - this is not critical
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
    },
  });

  // Archive conversation
  const archiveConversationMutation = useMutation({
    mutationFn: async (convId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await db
        .from('conversation_participants')
        .update({ is_archived: true })
        .eq('conversation_id', convId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      showSuccess('Conversation archived');
    },
  });

  return {
    conversations,
    messages,
    unreadCount,
    conversationsLoading,
    messagesLoading,
    getOrCreateConversation,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutate,
    archiveConversation: archiveConversationMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}
