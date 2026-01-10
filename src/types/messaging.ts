export interface Conversation {
  id: string;
  property_id: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_message_preview: string | null;
  // Joined data
  property?: {
    id: string;
    title: string;
    images: string[];
  };
  participants?: ConversationParticipant[];
  other_user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  is_archived: boolean;
  // Joined data
  user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'system';
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  sender?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export interface SendMessageData {
  conversation_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'system';
  image_url?: string;
}
