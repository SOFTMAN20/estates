/**
 * Admin Activity Log Hook
 * Manages activity log fetching and statistics for admin activity log page
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

export interface ActivityLog {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_email?: string;
  action_type: string;
  target_type: string;
  target_id: string | null;
  description: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  status: 'success' | 'failed';
}

interface ActivityLogFilters {
  searchQuery?: string;
  actionFilter?: string;
  adminFilter?: string;
  targetTypeFilter?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Fetch admin activity logs with filters
 */
export function useAdminActivityLogs(filters?: ActivityLogFilters) {
  return useQuery({
    queryKey: ['admin', 'activity-logs', filters],
    queryFn: async (): Promise<ActivityLog[]> => {
      let query = supabase
        .from('admin_actions')
        .select(`
          id,
          admin_id,
          action_type,
          target_type,
          target_id,
          details,
          ip_address,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply filters
      if (filters?.actionFilter && filters.actionFilter !== 'all') {
        query = query.eq('action_type', filters.actionFilter);
      }

      if (filters?.adminFilter && filters.adminFilter !== 'all') {
        query = query.eq('admin_id', filters.adminFilter);
      }

      if (filters?.targetTypeFilter && filters.targetTypeFilter !== 'all') {
        query = query.eq('target_type', filters.targetTypeFilter);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
      }

      const { data: actions, error } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }

      if (!actions || actions.length === 0) {
        return [];
      }

      // Get unique admin IDs
      const adminIds = [...new Set(actions.map(a => a.admin_id))];

      // Fetch admin profiles using the database function
      const { data: admins, error: adminsError } = await supabase
        .rpc('get_users_with_auth_data')
        .in('id', adminIds);

      if (adminsError) {
        console.error('Error fetching admin profiles:', adminsError);
      }

      // Create admin lookup map
      const adminMap = new Map(
        admins?.map(admin => [
          admin.id,
          {
            name: admin.name || 'Unknown Admin',
            email: admin.email || '',
          }
        ]) || []
      );

      // Transform actions to activity logs
      const logs: ActivityLog[] = actions.map(action => {
        const admin = adminMap.get(action.admin_id);
        const description = generateDescription(
          action.action_type,
          action.target_type,
          action.details
        );

        return {
          id: action.id,
          admin_id: action.admin_id,
          admin_name: admin?.name || 'Unknown Admin',
          admin_email: admin?.email,
          action_type: action.action_type,
          target_type: action.target_type,
          target_id: action.target_id,
          description,
          details: action.details as Record<string, unknown>,
          ip_address: action.ip_address || undefined,
          created_at: action.created_at,
          status: 'success',
        };
      });

      // Apply search filter on the client side
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return logs.filter(log =>
          log.description.toLowerCase().includes(query) ||
          log.admin_name.toLowerCase().includes(query) ||
          log.admin_email?.toLowerCase().includes(query)
        );
      }

      return logs;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Fetch activity log statistics
 */
export function useActivityLogStatistics() {
  return useQuery({
    queryKey: ['admin', 'activity-logs', 'statistics'],
    queryFn: async () => {
      const { data: actions, error } = await supabase
        .from('admin_actions')
        .select('id, admin_id, created_at');

      if (error) {
        console.error('Error fetching activity statistics:', error);
        throw error;
      }

      const totalActions = actions?.length || 0;

      // Calculate today's actions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayActions = actions?.filter(a =>
        new Date(a.created_at) >= today
      ).length || 0;

      // Calculate unique admins
      const uniqueAdmins = new Set(actions?.map(a => a.admin_id)).size;

      return {
        totalActions,
        todayActions,
        uniqueAdmins,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch unique admins for filter dropdown
 */
export function useAdminsList() {
  return useQuery({
    queryKey: ['admin', 'admins-list'],
    queryFn: async () => {
      // Get all admin actions to find unique admin IDs
      const { data: actions, error } = await supabase
        .from('admin_actions')
        .select('admin_id');

      if (error) {
        console.error('Error fetching admins list:', error);
        throw error;
      }

      if (!actions || actions.length === 0) {
        return [];
      }

      // Get unique admin IDs
      const adminIds = [...new Set(actions.map(a => a.admin_id))];

      // Fetch admin profiles
      const { data: admins, error: adminsError } = await supabase
        .rpc('get_users_with_auth_data')
        .in('id', adminIds);

      if (adminsError) {
        console.error('Error fetching admin profiles:', adminsError);
        return [];
      }

      return admins?.map(admin => ({
        id: admin.id,
        name: admin.name || 'Unknown Admin',
        email: admin.email || '',
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Generate human-readable description from action details
 */
function generateDescription(
  actionType: string,
  targetType: string,
  details?: Record<string, unknown>
): string {
  const detailsObj = details || {};

  switch (actionType) {
    case 'approve_property':
      return `Approved property "${detailsObj.property_title || 'Unknown Property'}"`;
    
    case 'reject_property':
      return `Rejected property "${detailsObj.property_title || 'Unknown Property'}"${
        detailsObj.reason ? ` - ${detailsObj.reason}` : ''
      }`;
    
    case 'suspend_user':
      return `Suspended user account "${detailsObj.user_email || 'Unknown User'}"${
        detailsObj.reason ? ` - ${detailsObj.reason}` : ''
      }`;
    
    case 'activate_user':
      return `Activated user account "${detailsObj.user_email || 'Unknown User'}"`;
    
    case 'change_user_role':
      return `Changed user role for "${detailsObj.user_email || 'Unknown User'}" to ${detailsObj.new_role || 'unknown'}`;
    
    case 'delete_property':
      return `Deleted property "${detailsObj.property_title || 'Unknown Property'}"`;
    
    case 'cancel_booking':
      return `Cancelled booking #${detailsObj.booking_id || 'unknown'}${
        detailsObj.reason ? ` - ${detailsObj.reason}` : ''
      }`;
    
    case 'update_settings':
      return `Updated platform settings${
        detailsObj.setting_key ? `: ${detailsObj.setting_key}` : ''
      }`;
    
    case 'process_refund':
      return `Processed refund of TZS ${
        detailsObj.amount ? Number(detailsObj.amount).toLocaleString() : '0'
      } for booking #${detailsObj.booking_id || 'unknown'}`;
    
    default:
      return `Performed ${actionType.replace(/_/g, ' ')} on ${targetType}`;
  }
}
