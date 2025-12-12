/**
 * Admin Users Hook
 * Manages user administration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import type { UserManagementData, AdminFilters } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

/**
 * Get all users for admin management
 */
export function useAdminUsers(filters?: AdminFilters) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*');
      
      // Apply filters
      if (filters?.role) {
        query = query.eq('role', filters.role);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }
      
      // Apply sorting
      const sortBy = filters?.sortBy || 'created_at';
      const sortOrder = filters?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    },
  });
}

/**
 * Update user role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'user' | 'admin' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'change_user_role',
        p_target_id: userId,
        p_target_type: 'user',
        p_details: { user_id: userId, new_role: role }
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully.',
      });
    },
  });
}

/**
 * Suspend user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_suspended: true,
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
          suspended_by: user?.id
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'suspend_user',
        p_target_id: userId,
        p_target_type: 'user',
        p_details: { user_id: userId, reason }
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'User Suspended',
        description: 'The user has been suspended.',
      });
    },
  });
}

/**
 * Activate user
 */
export function useActivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_suspended: false,
          suspension_reason: null,
          suspended_at: null,
          suspended_by: null
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'activate_user',
        p_target_id: userId,
        p_target_type: 'user',
        p_details: { user_id: userId }
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'User Activated',
        description: 'The user has been activated.',
      });
    },
  });
}
