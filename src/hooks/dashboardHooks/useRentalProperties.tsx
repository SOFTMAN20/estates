/**
 * useRentalProperties.tsx - Rental Management Properties Hook
 * ===========================================================
 * 
 * Custom hook for managing rental properties with tenant and payment data.
 * Used in the Host Rental Management dashboard.
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type Property = Tables<'properties'>;
type Tenant = Tables<'tenants'>;
type RentPayment = Tables<'rent_payments'>;
type Profile = Tables<'profiles'>;

// Extended property type with tenant and payment info
export interface RentalProperty extends Property {
  tenants: (Tenant & {
    user: Profile | null;
    latestPayment: RentPayment | null;
  })[];
  totalUnits: number;
  rentedUnits: number;
  vacantUnits: number;
  monthlyIncome: number;
  potentialIncome: number;
  hasOverduePayments: boolean;
  hasPendingPayments: boolean;
}

// Stats summary
export interface RentalStats {
  totalProperties: number;
  totalUnits: number;
  rentedUnits: number;
  vacantUnits: number;
  monthlyIncome: number;
  potentialIncome: number;
  overduePayments: number;
  pendingPayments: number;
  occupancyRate: number;
}

interface UseRentalPropertiesReturn {
  properties: RentalProperty[];
  stats: RentalStats;
  loading: boolean;
  error: string | null;
  fetchRentalProperties: (user: User) => Promise<void>;
  refreshProperties: () => Promise<void>;
  getPropertyById: (id: string) => RentalProperty | undefined;
}

export const useRentalProperties = (): UseRentalPropertiesReturn => {
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Calculate stats from properties
  const calculateStats = useCallback((props: RentalProperty[]): RentalStats => {
    const totalProperties = props.length;
    let totalUnits = 0;
    let rentedUnits = 0;
    let monthlyIncome = 0;
    let potentialIncome = 0;
    let overduePayments = 0;
    let pendingPayments = 0;

    props.forEach(property => {
      // Each property counts as at least 1 unit
      const propertyUnits = property.tenants.length > 0 ? property.tenants.length : 1;
      totalUnits += propertyUnits;
      
      // Count rented units and income
      const activeTenants = property.tenants.filter(t => t.status === 'active');
      rentedUnits += activeTenants.length;
      
      // Calculate income
      activeTenants.forEach(tenant => {
        monthlyIncome += Number(tenant.monthly_rent) || 0;
        
        // Check payment status
        if (tenant.latestPayment) {
          if (tenant.latestPayment.status === 'late') {
            overduePayments++;
          } else if (tenant.latestPayment.status === 'pending') {
            pendingPayments++;
          }
        }
      });
      
      // Potential income (if all units were rented)
      potentialIncome += Number(property.price) || 0;
    });

    const vacantUnits = totalUnits - rentedUnits;
    const occupancyRate = totalUnits > 0 ? (rentedUnits / totalUnits) * 100 : 0;

    return {
      totalProperties,
      totalUnits,
      rentedUnits,
      vacantUnits,
      monthlyIncome,
      potentialIncome,
      overduePayments,
      pendingPayments,
      occupancyRate
    };
  }, []);

  const [stats, setStats] = useState<RentalStats>({
    totalProperties: 0,
    totalUnits: 0,
    rentedUnits: 0,
    vacantUnits: 0,
    monthlyIncome: 0,
    potentialIncome: 0,
    overduePayments: 0,
    pendingPayments: 0,
    occupancyRate: 0
  });

  /**
   * Fetch rental properties with tenant and payment data
   */
  const fetchRentalProperties = useCallback(async (user: User): Promise<void> => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setCurrentUser(user);
    setLoading(true);
    setError(null);

    try {
      // Fetch properties owned by the user
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      if (!propertiesData || propertiesData.length === 0) {
        setProperties([]);
        setStats(calculateStats([]));
        return;
      }

      // Fetch tenants for these properties
      const propertyIds = propertiesData.map(p => p.id);
      
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select(`
          *,
          user:profiles!tenants_user_id_fkey(id, name, phone, avatar_url)
        `)
        .in('property_id', propertyIds)
        .eq('status', 'active');

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
      }

      // Fetch latest rent payments for active tenants
      const tenantIds = tenantsData?.map(t => t.id) || [];
      let paymentsData: RentPayment[] = [];
      
      if (tenantIds.length > 0) {
        const { data: payments, error: paymentsError } = await supabase
          .from('rent_payments')
          .select('*')
          .in('tenant_id', tenantIds)
          .order('payment_month', { ascending: false });

        if (paymentsError) {
          console.error('Error fetching payments:', paymentsError);
        } else {
          paymentsData = payments || [];
        }
      }

      // Build rental properties with tenant and payment info
      const rentalProperties: RentalProperty[] = propertiesData.map(property => {
        const propertyTenants = (tenantsData || [])
          .filter(t => t.property_id === property.id)
          .map(tenant => {
            // Get latest payment for this tenant
            const latestPayment = paymentsData.find(p => p.tenant_id === tenant.id) || null;
            
            return {
              ...tenant,
              user: tenant.user as Profile | null,
              latestPayment
            };
          });

        const activeTenants = propertyTenants.filter(t => t.status === 'active');
        const rentedCount = activeTenants.length;
        const totalUnits = rentedCount > 0 ? rentedCount : 1;
        const vacantCount = totalUnits - rentedCount;
        
        const monthlyIncome = activeTenants.reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0);
        const hasOverdue = activeTenants.some(t => t.latestPayment?.status === 'late');
        const hasPending = activeTenants.some(t => t.latestPayment?.status === 'pending');

        return {
          ...property,
          tenants: propertyTenants,
          totalUnits,
          rentedUnits: rentedCount,
          vacantUnits: vacantCount,
          monthlyIncome,
          potentialIncome: Number(property.price) || 0,
          hasOverduePayments: hasOverdue,
          hasPendingPayments: hasPending
        };
      });

      setProperties(rentalProperties);
      setStats(calculateStats(rentalProperties));
    } catch (err) {
      console.error('Error fetching rental properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  /**
   * Refresh properties using the current user
   */
  const refreshProperties = useCallback(async (): Promise<void> => {
    if (currentUser) {
      await fetchRentalProperties(currentUser);
    }
  }, [currentUser, fetchRentalProperties]);

  /**
   * Get a single property by ID
   */
  const getPropertyById = useCallback((id: string): RentalProperty | undefined => {
    return properties.find(p => p.id === id);
  }, [properties]);

  return {
    properties,
    stats,
    loading,
    error,
    fetchRentalProperties,
    refreshProperties,
    getPropertyById
  };
};

export default useRentalProperties;
