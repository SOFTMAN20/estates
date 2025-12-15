/**
 * Admin Properties Hook
 * Fetches and manages properties for admin approval workflow
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminProperty {
  id: string;
  title: string;
  description: string | null;
  location: string;
  price: number;
  property_type: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  square_meters: number | null;
  amenities: string[] | null;
  host_id: string;
  approved_at: string | null;
  approved_by: string | null;
  profiles: {
    name: string | null;
    phone: string | null;
    created_at: string | null;
  } | null;
}

interface PropertyFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  search?: string;
}

/**
 * Fetch properties with filters
 */
export function useAdminProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'properties', filters],
    queryFn: async (): Promise<AdminProperty[]> => {
      let query = supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          location,
          price,
          property_type,
          status,
          rejection_reason,
          created_at,
          images,
          bedrooms,
          bathrooms,
          square_meters,
          amenities,
          host_id,
          approved_at,
          approved_by,
          profiles!properties_host_id_fkey(name, phone, created_at)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as AdminProperty[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get property counts by status
 */
export function usePropertyCounts() {
  return useQuery({
    queryKey: ['admin', 'property-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('status');

      if (error) throw error;

      const counts = {
        all: data?.length || 0,
        pending: data?.filter(p => p.status === 'pending').length || 0,
        approved: data?.filter(p => p.status === 'approved').length || 0,
        rejected: data?.filter(p => p.status === 'rejected').length || 0,
      };

      return counts;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Approve a property
 */
export function useApproveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      // Get current user (admin)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user.id,
          rejection_reason: null,
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'property-counts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success(`Property "${data.title}" has been approved`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve property: ${error.message}`);
    },
  });
}

/**
 * Reject a property
 */
export function useRejectProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, reason }: { propertyId: string; reason: string }) => {
      if (!reason.trim()) {
        throw new Error('Rejection reason is required');
      }

      const { data, error } = await supabase
        .from('properties')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          approved_at: null,
          approved_by: null,
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'property-counts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success(`Property "${data.title}" has been rejected`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject property: ${error.message}`);
    },
  });
}

/**
 * Delete a property (admin only)
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      return propertyId;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'property-counts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      
      toast.success('Property has been deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete property: ${error.message}`);
    },
  });
}
