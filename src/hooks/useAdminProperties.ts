/**
 * Admin Properties Hook
 * Manages property approval and administration
 */

import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import type { PropertyApprovalData, AdminFilters } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

/**
 * Get all properties for admin management
 */
export function useAdminProperties(filters?: AdminFilters) {
  return useQuery({
    queryKey: ['admin', 'properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          profiles:user_id (
            name,
            phone,
            avatar_url,
            created_at
          )
        `);
      
      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }
      
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
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
 * Approve a property
 */
export function useApproveProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { data, error } = await supabase
        .from('properties')
        .update({ 
          status: 'approved',
          rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'approve_property',
        p_target_id: propertyId,
        p_target_type: 'property',
        p_details: { property_id: propertyId }
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast({
        title: 'Property Approved',
        description: 'The property has been approved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve property',
        variant: 'destructive',
      });
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
      const { data, error } = await supabase
        .from('properties')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'reject_property',
        p_target_id: propertyId,
        p_target_type: 'property',
        p_details: { property_id: propertyId, reason }
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast({
        title: 'Property Rejected',
        description: 'The property has been rejected.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject property',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Bulk approve properties
 */
export function useBulkApproveProperties() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyIds: string[]) => {
      const { data, error } = await supabase
        .from('properties')
        .update({ 
          status: 'approved',
          rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .in('id', propertyIds)
        .select();
      
      if (error) throw error;
      
      // Log admin actions
      for (const id of propertyIds) {
        await supabase.rpc('log_admin_action', {
          p_action_type: 'approve_property',
          p_target_id: id,
          p_target_type: 'property',
          p_details: { property_id: id, bulk: true }
        });
      }
      
      return data;
    },
    onSuccess: (_, propertyIds) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast({
        title: 'Properties Approved',
        description: `${propertyIds.length} properties have been approved.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve properties',
        variant: 'destructive',
      });
    },
  });
}
