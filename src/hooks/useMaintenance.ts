/**
 * USE MAINTENANCE HOOK
 * ====================
 * Hook for managing maintenance requests
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type {
  MaintenanceRequest,
  MaintenanceComment,
  CreateMaintenanceData,
  UpdateMaintenanceData,
  MaintenanceStats,
  MaintenanceFilters,
} from '@/types/tenant';

// Query keys
const MAINTENANCE_KEY = 'maintenance-requests';
const MAINTENANCE_STATS_KEY = 'maintenance-stats';
const MAINTENANCE_COMMENTS_KEY = 'maintenance-comments';

export function useMaintenanceRequests(filters?: MaintenanceFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [MAINTENANCE_KEY, user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenant:tenants!maintenance_requests_tenant_id_fkey(
            id,
            tenant_name,
            tenant_email,
            tenant_phone,
            user_id,
            property:properties!tenants_property_id_fkey(id, title, location, images)
          ),
          property:properties!maintenance_requests_property_id_fkey(id, title, location, images)
        `)
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.property_id) {
        query = query.eq('property_id', filters.property_id);
      }
      if (filters?.tenant_id) {
        query = query.eq('tenant_id', filters.tenant_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MaintenanceRequest[];
    },
    enabled: !!user?.id,
  });
}

export function useMaintenanceRequest(requestId: string | undefined) {
  return useQuery({
    queryKey: [MAINTENANCE_KEY, requestId],
    queryFn: async () => {
      if (!requestId) return null;

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenant:tenants!maintenance_requests_tenant_id_fkey(
            id,
            tenant_name,
            tenant_email,
            tenant_phone,
            user_id,
            property:properties!tenants_property_id_fkey(id, title, location, images)
          ),
          property:properties!maintenance_requests_property_id_fkey(id, title, location, images)
        `)
        .eq('id', requestId)
        .single();

      if (error) throw error;
      return data as MaintenanceRequest;
    },
    enabled: !!requestId,
  });
}

export function useMaintenanceStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [MAINTENANCE_STATS_KEY, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('status, priority')
        .eq('landlord_id', user.id);

      if (error) throw error;

      const stats: MaintenanceStats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        in_progress: data.filter(r => r.status === 'in_progress' || r.status === 'assigned').length,
        scheduled: data.filter(r => r.status === 'scheduled').length,
        pending_parts: data.filter(r => r.status === 'pending_parts').length,
        completed: data.filter(r => r.status === 'completed').length,
        high_priority: data.filter(r => r.priority === 'high').length,
        emergency: data.filter(r => r.priority === 'emergency').length,
      };

      return stats;
    },
    enabled: !!user?.id,
  });
}

export function useMaintenanceComments(maintenanceId: string | undefined) {
  return useQuery({
    queryKey: [MAINTENANCE_COMMENTS_KEY, maintenanceId],
    queryFn: async () => {
      if (!maintenanceId) return [];

      const { data, error } = await supabase
        .from('maintenance_comments')
        .select(`
          *,
          user:profiles!maintenance_comments_user_id_fkey(id, full_name, avatar_url)
        `)
        .eq('maintenance_id', maintenanceId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as MaintenanceComment[];
    },
    enabled: !!maintenanceId,
  });
}

export function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateMaintenanceData) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: request, error } = await supabase
        .from('maintenance_requests')
        .insert({
          ...data,
          landlord_id: user.id,
          images: data.images || [],
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_STATS_KEY] });
      toast.success('Maintenance request created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create request: ${error.message}`);
    },
  });
}

export function useUpdateMaintenanceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, data }: { requestId: string; data: UpdateMaintenanceData }) => {
      const { data: request, error } = await supabase
        .from('maintenance_requests')
        .update(data)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return request;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY, variables.requestId] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_STATS_KEY] });
      toast.success('Maintenance request updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update request: ${error.message}`);
    },
  });
}

export function useAssignMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      assignedTo, 
      assignedContact 
    }: { 
      requestId: string; 
      assignedTo: string; 
      assignedContact?: string;
    }) => {
      const { data: request, error } = await supabase
        .from('maintenance_requests')
        .update({
          assigned_to: assignedTo,
          assigned_contact: assignedContact,
          status: 'assigned',
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_STATS_KEY] });
      toast.success('Vendor assigned');
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign vendor: ${error.message}`);
    },
  });
}

export function useScheduleMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      scheduledDate,
      estimatedCost,
    }: { 
      requestId: string; 
      scheduledDate: string;
      estimatedCost?: number;
    }) => {
      const { data: request, error } = await supabase
        .from('maintenance_requests')
        .update({
          scheduled_date: scheduledDate,
          estimated_cost: estimatedCost,
          status: 'scheduled',
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_STATS_KEY] });
      toast.success('Maintenance scheduled');
    },
    onError: (error: Error) => {
      toast.error(`Failed to schedule: ${error.message}`);
    },
  });
}

export function useCompleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      resolutionNotes,
      actualCost,
    }: { 
      requestId: string; 
      resolutionNotes?: string;
      actualCost?: number;
    }) => {
      const { data: request, error } = await supabase
        .from('maintenance_requests')
        .update({
          status: 'completed',
          resolution_notes: resolutionNotes,
          actual_cost: actualCost,
          completed_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_STATS_KEY] });
      toast.success('Maintenance completed');
    },
    onError: (error: Error) => {
      toast.error(`Failed to complete: ${error.message}`);
    },
  });
}

export function useAddMaintenanceComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      maintenanceId, 
      comment,
      isInternal = false,
    }: { 
      maintenanceId: string; 
      comment: string;
      isInternal?: boolean;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('maintenance_comments')
        .insert({
          maintenance_id: maintenanceId,
          user_id: user.id,
          comment,
          is_internal: isInternal,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_COMMENTS_KEY, variables.maintenanceId] });
      toast.success('Comment added');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });
}

export function useDeleteMaintenanceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_STATS_KEY] });
      toast.success('Request deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}
