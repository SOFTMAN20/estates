/**
 * ADMIN NOTIFICATIONS HOOK
 * ========================
 * 
 * Manages admin notifications with real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'property_submission' | 'user_report' | 'payment_failed' | 'system_error' | 'unusual_activity' | 'daily_summary' | 'booking_issue' | 'review_flagged';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  read_at: string | null;
  read_by: string | null;
  related_type: 'property' | 'user' | 'booking' | 'payment' | 'review' | 'report' | null;
  related_id: string | null;
  action_data: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  expires_at: string | null;
}

/**
 * Fetch all admin notifications
 */
export function useAdminNotifications(filters?: {
  type?: string;
  priority?: string;
  is_read?: boolean;
}) {
  return useQuery({
    queryKey: ['admin-notifications', filters],
    queryFn: async (): Promise<AdminNotification[]> => {
      let query = supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Get unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['admin-notifications-unread-count'],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;
      return data || 0;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

/**
 * Mark notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('admin_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          read_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('admin_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          read_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark notifications as read');
    },
  });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });
}

/**
 * Create notification (for testing/manual creation)
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Partial<AdminNotification>) => {
      const { error } = await supabase
        .from('admin_notifications')
        .insert(notification);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      toast.success('Notification created');
    },
  });
}
