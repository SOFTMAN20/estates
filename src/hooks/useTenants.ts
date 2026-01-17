/**
 * USE TENANTS HOOK
 * ================
 * Hook for managing tenants, leases, and rent payments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type {
  Tenant,
  LeaseAgreement,
  RentPayment,
  CreateTenantData,
  UpdateTenantData,
  RecordPaymentData,
  EndTenancyData,
  TenantStats,
  TenantFilters,
} from '@/types/tenant';

// Query keys
const TENANTS_KEY = 'tenants';
const TENANT_KEY = 'tenant';
const TENANT_STATS_KEY = 'tenant-stats';
const TENANT_PAYMENTS_KEY = 'tenant-payments';
const LEASE_KEY = 'lease';

export function useTenants(filters?: TenantFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [TENANTS_KEY, user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      // Query without the user join to avoid issues with null user_id
      let query = supabase
        .from('tenants')
        .select(`
          *,
          property:properties(id, title, location, images)
        `)
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.property_id) {
        query = query.eq('property_id', filters.property_id);
      }
      if (filters?.payment_status === 'overdue') {
        query = query.eq('is_late_on_rent', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      
      // Map tenant data - create user object from tenant fields if no user_id
      return (data || []).map(tenant => ({
        ...tenant,
        user: {
          id: tenant.user_id,
          full_name: tenant.tenant_name || null,
          email: tenant.tenant_email || null,
          phone: tenant.tenant_phone || null,
          avatar_url: null,
        }
      })) as Tenant[];
    },
    enabled: !!user?.id,
  });
}

export function useTenant(tenantId: string | undefined) {
  return useQuery({
    queryKey: [TENANT_KEY, tenantId],
    queryFn: async () => {
      if (!tenantId) return null;

      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          property:properties!tenants_property_id_fkey(id, title, location, images)
        `)
        .eq('id', tenantId)
        .single();

      if (error) throw error;
      
      // Map tenant data - create user object from tenant fields if no user_id
      return {
        ...data,
        user: {
          id: data.user_id,
          full_name: data.tenant_name || null,
          email: data.tenant_email || null,
          phone: data.tenant_phone || null,
          avatar_url: null,
        }
      } as Tenant;
    },
    enabled: !!tenantId,
  });
}


export function useTenantStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [TENANT_STATS_KEY, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .rpc('get_landlord_tenant_stats', { p_landlord_id: user.id });

      if (error) {
        // Fallback to manual calculation if function doesn't exist
        const { data: tenants } = await supabase
          .from('tenants')
          .select('*, rent_payments(*)')
          .eq('landlord_id', user.id);

        if (!tenants) return null;

        const activeTenants = tenants.filter(t => t.status === 'active');
        const allPayments = tenants.flatMap(t => t.rent_payments || []);
        const paidOnTime = allPayments.filter(p => p.status === 'paid' && !p.is_late);
        const latePayments = allPayments.filter(p => p.status === 'late');

        return {
          total_tenants: tenants.length,
          active_tenants: activeTenants.length,
          total_monthly_rent: activeTenants.reduce((sum, t) => sum + (t.monthly_rent || 0), 0),
          on_time_payment_rate: allPayments.length > 0 
            ? Math.round((paidOnTime.length / allPayments.length) * 100) 
            : 100,
          late_payments_count: latePayments.length,
        } as TenantStats;
      }

      return data?.[0] as TenantStats;
    },
    enabled: !!user?.id,
  });
}

export function useTenantPayments(tenantId: string | undefined) {
  return useQuery({
    queryKey: [TENANT_PAYMENTS_KEY, tenantId],
    queryFn: async () => {
      if (!tenantId) return [];

      const { data, error } = await supabase
        .from('rent_payments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('payment_month', { ascending: false });

      if (error) throw error;
      return data as RentPayment[];
    },
    enabled: !!tenantId,
  });
}

export function useTenantLease(tenantId: string | undefined) {
  return useQuery({
    queryKey: [LEASE_KEY, tenantId],
    queryFn: async () => {
      if (!tenantId) return null;

      const { data, error } = await supabase
        .from('lease_agreements')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as LeaseAgreement | null;
    },
    enabled: !!tenantId,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTenantData) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Create tenant record - user_id is optional for independent tenants
      // Tenants can be created without linking to profiles (using tenant_name, tenant_phone, tenant_email)
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          property_id: data.property_id,
          user_id: data.user_id || null, // NULL for independent tenants (not linked to profiles)
          landlord_id: user.id,
          tenant_name: data.tenant_name || null, // For independent tenants
          tenant_phone: data.tenant_phone || null, // For independent tenants
          tenant_email: data.tenant_email || null, // For independent tenants
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_phone: data.emergency_contact_phone,
          emergency_contact_relationship: data.emergency_contact_relationship,
          lease_start_date: data.lease_start_date,
          lease_end_date: data.lease_end_date,
          monthly_rent: data.monthly_rent,
          security_deposit: data.security_deposit || 0,
          move_in_date: data.move_in_date,
          move_in_condition_notes: data.move_in_condition_notes,
          move_in_photos: data.move_in_photos || [],
          status: 'active',
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Create lease agreement
      const { error: leaseError } = await supabase
        .from('lease_agreements')
        .insert({
          tenant_id: tenant.id,
          property_id: data.property_id,
          landlord_id: user.id,
          start_date: data.lease_start_date,
          end_date: data.lease_end_date,
          monthly_rent: data.monthly_rent,
          security_deposit: data.security_deposit || 0,
          rent_due_day: data.rent_due_day || 1,
          late_fee_amount: data.late_fee_amount || 0,
          late_fee_grace_period: data.late_fee_grace_period || 5,
          status: 'draft',
        });

      if (leaseError) throw leaseError;

      // Create rent payment schedule
      const { error: scheduleError } = await supabase.rpc('create_rent_payment_schedule', {
        p_tenant_id: tenant.id,
        p_property_id: data.property_id,
        p_landlord_id: user.id,
        p_monthly_rent: data.monthly_rent,
        p_lease_start: data.lease_start_date,
        p_lease_end: data.lease_end_date,
        p_rent_due_day: data.rent_due_day || 1,
      });

      // If RPC fails, create payments manually
      if (scheduleError) {
        console.warn('RPC failed, creating payments manually:', scheduleError);
        // Manual payment creation would go here
      }

      return tenant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TENANTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TENANT_STATS_KEY] });
      toast.success('Tenant added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add tenant: ${error.message}`);
    },
  });
}


export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantId, data }: { tenantId: string; data: UpdateTenantData }) => {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .update(data)
        .eq('id', tenantId)
        .select()
        .single();

      if (error) throw error;
      return tenant;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TENANTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TENANT_KEY, variables.tenantId] });
      toast.success('Tenant updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update tenant: ${error.message}`);
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecordPaymentData) => {
      // Find the payment record for this month
      const { data: existingPayment, error: findError } = await supabase
        .from('rent_payments')
        .select('*')
        .eq('tenant_id', data.tenant_id)
        .eq('payment_month', data.payment_month)
        .single();

      if (findError && findError.code !== 'PGRST116') throw findError;

      if (existingPayment) {
        // Update existing payment
        const newAmountPaid = (existingPayment.amount_paid || 0) + data.amount_paid;
        const isPaid = newAmountPaid >= existingPayment.amount_due;
        
        const { data: payment, error } = await supabase
          .from('rent_payments')
          .update({
            amount_paid: newAmountPaid,
            payment_method: data.payment_method,
            transaction_id: data.transaction_id,
            payment_date: data.payment_date || new Date().toISOString(),
            notes: data.notes,
            late_fee: data.late_fee || existingPayment.late_fee,
            status: isPaid ? 'paid' : 'partial',
          })
          .eq('id', existingPayment.id)
          .select()
          .single();

        if (error) throw error;
        return payment;
      } else {
        throw new Error('Payment record not found for this month');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TENANT_PAYMENTS_KEY, variables.tenant_id] });
      queryClient.invalidateQueries({ queryKey: [TENANTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TENANT_STATS_KEY] });
      toast.success('Payment recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to record payment: ${error.message}`);
    },
  });
}

export function useEndTenancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EndTenancyData) => {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .update({
          status: 'ended',
          move_out_date: data.move_out_date,
          move_out_condition_notes: data.move_out_condition_notes,
          move_out_photos: data.move_out_photos || [],
        })
        .eq('id', data.tenant_id)
        .select()
        .single();

      if (error) throw error;

      // Update lease agreement status
      await supabase
        .from('lease_agreements')
        .update({ status: 'terminated' })
        .eq('tenant_id', data.tenant_id)
        .eq('status', 'active');

      return tenant;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TENANTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TENANT_KEY, variables.tenant_id] });
      queryClient.invalidateQueries({ queryKey: [TENANT_STATS_KEY] });
      toast.success('Tenancy ended successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to end tenancy: ${error.message}`);
    },
  });
}

// Hook to get landlord's properties for tenant assignment
export function useLandlordProperties() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['landlord-properties', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('properties')
        .select('id, title, location, images, price')
        .eq('host_id', user.id)
        .eq('status', 'approved')
        .order('title');

      if (error) {
        throw error;
      }
      
      // Map price to price_per_month for compatibility
      return (data || []).map(p => ({
        ...p,
        price_per_month: p.price
      }));
    },
    enabled: !!user?.id,
  });
}


// ============================================
// LEASE AGREEMENT HOOKS
// ============================================

const LEASES_KEY = 'leases';

export function useLeases(filters?: { status?: string; property_id?: string }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [LEASES_KEY, user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('lease_agreements')
        .select(`
          *,
          tenant:tenants!lease_agreements_tenant_id_fkey(
            id,
            tenant_name,
            tenant_email,
            tenant_phone,
            user_id,
            property:properties!tenants_property_id_fkey(id, title, location, images)
          )
        `)
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.property_id) {
        query = query.eq('property_id', filters.property_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useLeaseStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lease-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('lease_agreements')
        .select('status, end_date')
        .eq('landlord_id', user.id);

      if (error) throw error;

      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      return {
        total: data.length,
        active: data.filter(l => l.status === 'active').length,
        draft: data.filter(l => l.status === 'draft').length,
        pending_signature: data.filter(l => l.status === 'pending_signature').length,
        expiring_soon: data.filter(l => {
          const endDate = new Date(l.end_date);
          return l.status === 'active' && endDate <= thirtyDaysFromNow && endDate > today;
        }).length,
        expired: data.filter(l => l.status === 'expired' || l.status === 'terminated').length,
      };
    },
    enabled: !!user?.id,
  });
}

export interface CreateLeaseData {
  tenant_id: string;
  property_id: string;
  agreement_type: 'standard' | 'month-to-month' | 'fixed-term';
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit?: number;
  terms_and_conditions?: string;
  special_clauses?: string;
  utilities_included?: string[];
  tenant_responsibilities?: string;
  landlord_responsibilities?: string;
  rent_due_day?: number;
  late_fee_amount?: number;
  late_fee_grace_period?: number;
}

export function useCreateLease() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateLeaseData) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: lease, error } = await supabase
        .from('lease_agreements')
        .insert({
          ...data,
          landlord_id: user.id,
          utilities_included: data.utilities_included || [],
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return lease;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEASES_KEY] });
      queryClient.invalidateQueries({ queryKey: ['lease-stats'] });
      toast.success('Lease agreement created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create lease: ${error.message}`);
    },
  });
}

export function useUpdateLease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leaseId, data }: { leaseId: string; data: Partial<CreateLeaseData & { status: string }> }) => {
      const { data: lease, error } = await supabase
        .from('lease_agreements')
        .update(data)
        .eq('id', leaseId)
        .select()
        .single();

      if (error) throw error;
      return lease;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEASES_KEY] });
      queryClient.invalidateQueries({ queryKey: ['lease-stats'] });
      toast.success('Lease agreement updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update lease: ${error.message}`);
    },
  });
}

// ============================================
// LEASE AGREEMENT HOOKS
// ============================================

export function useLeaseAgreements(filters?: { status?: string; property_id?: string }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lease-agreements', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('lease_agreements')
        .select(`
          *,
          tenant:tenants!lease_agreements_tenant_id_fkey(
            id,
            tenant_name,
            tenant_email,
            tenant_phone,
            user_id,
            property:properties!tenants_property_id_fkey(id, title, location, images)
          )
        `)
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.property_id) {
        query = query.eq('property_id', filters.property_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useLeaseAgreement(leaseId: string | undefined) {
  return useQuery({
    queryKey: ['lease-agreement', leaseId],
    queryFn: async () => {
      if (!leaseId) return null;

      const { data, error } = await supabase
        .from('lease_agreements')
        .select(`
          *,
          tenant:tenants!lease_agreements_tenant_id_fkey(
            id,
            tenant_name,
            tenant_email,
            tenant_phone,
            user_id,
            property:properties!tenants_property_id_fkey(id, title, location, images)
          )
        `)
        .eq('id', leaseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!leaseId,
  });
}

export function useCreateLeaseAgreement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      tenant_id: string;
      property_id: string;
      agreement_type: string;
      start_date: string;
      end_date: string;
      monthly_rent: number;
      security_deposit?: number;
      terms_and_conditions?: string;
      special_clauses?: string;
      utilities_included?: string[];
      tenant_responsibilities?: string;
      landlord_responsibilities?: string;
      rent_due_day?: number;
      late_fee_amount?: number;
      late_fee_grace_period?: number;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: lease, error } = await supabase
        .from('lease_agreements')
        .insert({
          ...data,
          landlord_id: user.id,
          utilities_included: data.utilities_included || [],
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return lease;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lease-agreements'] });
      toast.success('Lease agreement created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create lease: ${error.message}`);
    },
  });
}

export function useUpdateLeaseAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leaseId, data }: { 
      leaseId: string; 
      data: Partial<LeaseAgreement> 
    }) => {
      const { data: lease, error } = await supabase
        .from('lease_agreements')
        .update(data)
        .eq('id', leaseId)
        .select()
        .single();

      if (error) throw error;
      return lease;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lease-agreements'] });
      queryClient.invalidateQueries({ queryKey: ['lease-agreement', variables.leaseId] });
      toast.success('Lease agreement updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update lease: ${error.message}`);
    },
  });
}

export function useSignLease() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ leaseId, role }: { leaseId: string; role: 'landlord' | 'tenant' }) => {
      const updateData = role === 'landlord' 
        ? { landlord_signed: true, landlord_signature_date: new Date().toISOString() }
        : { tenant_signed: true, tenant_signature_date: new Date().toISOString() };

      const { data: lease, error } = await supabase
        .from('lease_agreements')
        .update(updateData)
        .eq('id', leaseId)
        .select()
        .single();

      if (error) throw error;

      // If both signed, activate the lease
      if (lease.landlord_signed && lease.tenant_signed) {
        await supabase
          .from('lease_agreements')
          .update({ status: 'active' })
          .eq('id', leaseId);
      } else if (lease.landlord_signed || lease.tenant_signed) {
        await supabase
          .from('lease_agreements')
          .update({ status: 'pending_signature' })
          .eq('id', leaseId);
      }

      return lease;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lease-agreements'] });
      queryClient.invalidateQueries({ queryKey: ['lease-agreement', variables.leaseId] });
      toast.success('Lease signed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to sign lease: ${error.message}`);
    },
  });
}

export function useTerminateLease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leaseId: string) => {
      const { data: lease, error } = await supabase
        .from('lease_agreements')
        .update({ status: 'terminated' })
        .eq('id', leaseId)
        .select()
        .single();

      if (error) throw error;
      return lease;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lease-agreements'] });
      toast.success('Lease terminated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to terminate lease: ${error.message}`);
    },
  });
}


// ============================================
// RENT PAYMENT HOOKS
// ============================================

export function useRentPayments(filters?: { 
  status?: string; 
  property_id?: string;
  tenant_id?: string;
  month?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['rent-payments', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('rent_payments')
        .select(`
          *,
          tenant:tenants!rent_payments_tenant_id_fkey(
            id,
            tenant_name,
            tenant_email,
            tenant_phone,
            user_id,
            user:profiles!tenants_user_id_fkey(id, name, phone, avatar_url),
            property:properties!tenants_property_id_fkey(id, title, location, images)
          )
        `)
        .eq('landlord_id', user.id)
        .order('payment_month', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.property_id) {
        query = query.eq('property_id', filters.property_id);
      }
      if (filters?.tenant_id) {
        query = query.eq('tenant_id', filters.tenant_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (RentPayment & { tenant: Tenant })[];
    },
    enabled: !!user?.id,
  });
}

export function useRentPaymentStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['rent-payment-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: payments, error } = await supabase
        .from('rent_payments')
        .select('*')
        .eq('landlord_id', user.id);

      if (error) throw error;

      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

      const stats = {
        totalCollected: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount_paid || 0), 0),
        totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount_due || 0), 0),
        totalOverdue: payments.filter(p => p.status === 'late').reduce((sum, p) => sum + (p.amount_due - (p.amount_paid || 0)), 0),
        totalLateFees: payments.reduce((sum, p) => sum + (p.late_fee || 0), 0),
        paidCount: payments.filter(p => p.status === 'paid').length,
        pendingCount: payments.filter(p => p.status === 'pending').length,
        lateCount: payments.filter(p => p.status === 'late').length,
        partialCount: payments.filter(p => p.status === 'partial').length,
        waivedCount: payments.filter(p => p.status === 'waived').length,
        currentMonthCollected: payments
          .filter(p => p.payment_month === currentMonth && p.status === 'paid')
          .reduce((sum, p) => sum + (p.amount_paid || 0), 0),
        currentMonthExpected: payments
          .filter(p => p.payment_month === currentMonth)
          .reduce((sum, p) => sum + (p.amount_due || 0), 0),
      };

      return stats;
    },
    enabled: !!user?.id,
  });
}

export function useUpdateRentPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, data }: { 
      paymentId: string; 
      data: Partial<RentPayment> 
    }) => {
      const { data: payment, error } = await supabase
        .from('rent_payments')
        .update(data)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      queryClient.invalidateQueries({ queryKey: ['rent-payment-stats'] });
      queryClient.invalidateQueries({ queryKey: [TENANT_PAYMENTS_KEY] });
      toast.success('Payment updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment: ${error.message}`);
    },
  });
}

export function useWaivePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, notes }: { paymentId: string; notes?: string }) => {
      const { data: payment, error } = await supabase
        .from('rent_payments')
        .update({ 
          status: 'waived',
          notes: notes || 'Payment waived',
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      queryClient.invalidateQueries({ queryKey: ['rent-payment-stats'] });
      toast.success('Payment waived');
    },
    onError: (error: Error) => {
      toast.error(`Failed to waive payment: ${error.message}`);
    },
  });
}

export function useAddLateFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, lateFee }: { paymentId: string; lateFee: number }) => {
      const { data: payment, error } = await supabase
        .from('rent_payments')
        .update({ 
          late_fee: lateFee,
          is_late: true,
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      queryClient.invalidateQueries({ queryKey: ['rent-payment-stats'] });
      toast.success('Late fee added');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add late fee: ${error.message}`);
    },
  });
}
