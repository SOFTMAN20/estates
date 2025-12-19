export type NotificationType = 'booking' | 'payment' | 'property' | 'system' | 'message';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  related_id?: string;
  related_type?: string;
  is_read: boolean;
  priority: NotificationPriority;
  read_at?: string;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  
  // Email preferences
  email_bookings: boolean;
  email_payments: boolean;
  email_properties: boolean;
  email_messages: boolean;
  email_marketing: boolean;
  
  // In-app preferences
  inapp_bookings: boolean;
  inapp_payments: boolean;
  inapp_properties: boolean;
  inapp_messages: boolean;
  inapp_system: boolean;
  
  // Sound preferences
  sound_enabled: boolean;
  
  // Digest preferences
  daily_digest: boolean;
  weekly_summary: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  thisWeek: Notification[];
  older: Notification[];
}

export type NotificationFilter = 'all' | 'unread' | 'booking' | 'payment' | 'property' | 'system' | 'message';
