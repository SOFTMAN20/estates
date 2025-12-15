/**
 * Admin Users Hook
 * Fetches and manages users for admin user management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string;
  is_host: boolean | null;
  is_suspended: boolean | null;
  suspension_reason: string | null;
  created_at: string;
  user_id: string | null;
  // Computed fields (will be fetched separately)
  properties_count?: number;
  bookings_count?: number;
  total_spent?: number;
  total_earned?: number;
}

interface UserFilters {
  role?: 'all' | 'user' | 'admin';
  status?: 'all' | 'active' | 'suspended';
  search?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalHosts: number;
  totalAdmins: number;
}

/**
 * Fetch users with filters
 */
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async (): Promise<AdminUser[]> => {
      // Use database function to get users with auth data
      const { data: usersWithAuth, error: usersError } = await supabase
        .rpc('get_users_with_auth_data');

      if (usersError) {
        console.error('Failed to fetch users with auth data:', usersError);
        console.error('Error details:', {
          message: usersError.message,
          code: usersError.code,
          details: usersError.details,
          hint: usersError.hint
        });
        
        // If it's an access denied error, show a helpful message
        if (usersError.message?.includes('Access denied') || 
            usersError.message?.includes('Not authenticated') ||
            usersError.message?.includes('Only admins')) {
          toast.error('You must be logged in as an admin to view this page');
        }
        
        throw usersError;
      }

      if (!usersWithAuth || usersWithAuth.length === 0) {
        return [];
      }

      // Apply role filter
      let filteredUsers = usersWithAuth;
      if (filters.role && filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      // Apply status filter
      if (filters.status === 'active') {
        filteredUsers = filteredUsers.filter(user => !user.is_suspended);
      } else if (filters.status === 'suspended') {
        filteredUsers = filteredUsers.filter(user => user.is_suspended);
      }

      // Apply search filter (name, phone, email)
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      }

      // Fetch properties count for all users
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('host_id');

      const propertiesCountMap = new Map<string, number>();
      propertiesData?.forEach(property => {
        const count = propertiesCountMap.get(property.host_id) || 0;
        propertiesCountMap.set(property.host_id, count + 1);
      });

      // Fetch bookings count for all users
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('guest_id');

      const bookingsCountMap = new Map<string, number>();
      bookingsData?.forEach(booking => {
        const count = bookingsCountMap.get(booking.guest_id) || 0;
        bookingsCountMap.set(booking.guest_id, count + 1);
      });

      // Add counts to users
      const usersWithCounts = filteredUsers.map(user => ({
        ...user,
        properties_count: propertiesCountMap.get(user.id) || 0,
        bookings_count: bookingsCountMap.get(user.id) || 0,
      }));

      return usersWithCounts as AdminUser[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get user statistics
 */
export function useUserStats() {
  return useQuery({
    queryKey: ['admin', 'user-stats'],
    queryFn: async (): Promise<UserStats> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_suspended, is_host');

      if (error) throw error;

      const stats: UserStats = {
        totalUsers: data?.length || 0,
        activeUsers: data?.filter(u => !u.is_suspended).length || 0,
        suspendedUsers: data?.filter(u => u.is_suspended).length || 0,
        totalHosts: data?.filter(u => u.is_host).length || 0,
        totalAdmins: data?.filter(u => u.role === 'admin').length || 0,
      };

      return stats;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Suspend a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspension_reason: reason,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success(`User "${data.name}" has been suspended`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to suspend user: ${error.message}`);
    },
  });
}

/**
 * Activate a user (remove suspension)
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
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success(`User "${data.name}" has been activated`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate user: ${error.message}`);
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
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success(`User role updated to "${data.role}"`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });
}

/**
 * Get detailed user information with statistics
 */
export function useUserDetails(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'user-details', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Use database function to get user with auth data
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_with_auth_data', { user_id_param: userId });

      if (userError) throw userError;

      if (!userData || userData.length === 0) {
        throw new Error('User not found');
      }

      const profile = userData[0];

      // Fetch properties count (as host)
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('host_id', userId);

      // Fetch bookings count (as guest)
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('guest_id', userId);

      // Fetch total spent (as guest)
      const { data: guestBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('guest_id', userId)
        .in('status', ['confirmed', 'completed']);

      const totalSpent = guestBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Fetch total earned (as host)
      const { data: hostBookings } = await supabase
        .from('bookings')
        .select('total_amount, service_fee')
        .eq('host_id', userId)
        .in('status', ['confirmed', 'completed']);

      const totalEarned = hostBookings?.reduce((sum, b) => sum + ((b.total_amount || 0) - (b.service_fee || 0)), 0) || 0;

      return {
        ...profile,
        properties_count: propertiesCount || 0,
        bookings_count: bookingsCount || 0,
        total_spent: totalSpent,
        total_earned: totalEarned,
      };
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Delete a user (admin only, use with caution)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success('User has been deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
}
