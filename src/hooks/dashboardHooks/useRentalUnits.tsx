/**
 * useRentalUnits.tsx - Rental Units/Rooms Management Hook
 * =======================================================
 * 
 * Custom hook for managing rental units (properties with tenant info).
 * Supports both single-unit properties and multi-unit properties (hostels, hotels, etc.)
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type Property = Tables<'properties'>;
type Tenant = Tables<'tenants'>;
type RentPayment = Tables<'rent_payments'>;
type Profile = Tables<'profiles'>;

// Unit type - represents a rentable unit (property or room)
export interface RentalUnit {
  id: string;
  name: string;
  unitNumber?: string;
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  unitType: string;
  location: string;
  rent: number;
  pricePeriod: string;
  status: 'rented' | 'vacant';
  isMultiUnit: boolean;
  tenant: {
    id: string;
    name: string;
    phone: string | null;
    avatarUrl: string | null;
    leaseStart: string;
    leaseEnd: string;
    paymentStatus: 'paid' | 'pending' | 'overdue';
  } | null;
  bedrooms: number;
  bathrooms: number;
  floorNumber?: number;
  image: string | null;
}

// Property option for filter dropdown
export interface PropertyOption {
  id: string;
  name: string;
}

// Stats summary
export interface UnitStats {
  total: number;
  rented: number;
  vacant: number;
  monthlyIncome: number;
  overdueCount: number;
  pendingCount: number;
}

interface UseRentalUnitsReturn {
  units: RentalUnit[];
  properties: PropertyOption[];
  stats: UnitStats;
  loading: boolean;
  error: string | null;
  fetchUnits: (user: User) => Promise<void>;
  refreshUnits: () => Promise<void>;
  getUnitById: (id: string) => RentalUnit | undefined;
}


export const useRentalUnits = (): UseRentalUnitsReturn => {
  const [units, setUnits] = useState<RentalUnit[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [stats, setStats] = useState<UnitStats>({
    total: 0, rented: 0, vacant: 0, monthlyIncome: 0, overdueCount: 0, pendingCount: 0
  });

  const calculateStats = useCallback((unitList: RentalUnit[]): UnitStats => {
    const rented = unitList.filter(u => u.status === 'rented').length;
    const vacant = unitList.filter(u => u.status === 'vacant').length;
    const monthlyIncome = unitList.filter(u => u.status === 'rented').reduce((sum, u) => sum + u.rent, 0);
    const overdueCount = unitList.filter(u => u.tenant?.paymentStatus === 'overdue').length;
    const pendingCount = unitList.filter(u => u.tenant?.paymentStatus === 'pending').length;
    return { total: unitList.length, rented, vacant, monthlyIncome, overdueCount, pendingCount };
  }, []);

  const fetchUnits = useCallback(async (user: User): Promise<void> => {
    if (!user) { setError('User not authenticated'); return; }
    setCurrentUser(user);
    setLoading(true);
    setError(null);

    try {
      // Fetch approved properties owned by the user
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', user.id)
        .eq('status', 'approved')
        .order('title', { ascending: true });

      if (propertiesError) throw propertiesError;
      if (!propertiesData || propertiesData.length === 0) {
        setUnits([]);
        setProperties([{ id: 'all', name: 'All Properties' }]);
        setStats(calculateStats([]));
        return;
      }

      // Build property options for filter
      const propertyOptions: PropertyOption[] = [
        { id: 'all', name: 'All Properties' },
        ...propertiesData.map(p => ({ id: p.id, name: p.title }))
      ];
      setProperties(propertyOptions);

      // Fetch property units for multi-unit properties
      const propertyIds = propertiesData.map(p => p.id);
      const { data: propertyUnitsData, error: unitsError } = await supabase
        .from('property_units')
        .select('*')
        .in('property_id', propertyIds)
        .eq('status', 'active');

      if (unitsError) console.error('Error fetching property units:', unitsError);

      // Fetch tenants for these properties
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select(`*, user:profiles!tenants_user_id_fkey(id, name, phone, avatar_url)`)
        .in('property_id', propertyIds);

      if (tenantsError) console.error('Error fetching tenants:', tenantsError);

      // Fetch latest rent payments
      const tenantIds = tenantsData?.map(t => t.id) || [];
      let paymentsData: RentPayment[] = [];
      if (tenantIds.length > 0) {
        const { data: payments, error: paymentsError } = await supabase
          .from('rent_payments')
          .select('*')
          .in('tenant_id', tenantIds)
          .order('payment_month', { ascending: false });
        if (!paymentsError) paymentsData = payments || [];
      }

      // Build units list
      const unitsList: RentalUnit[] = [];

      for (const property of propertiesData) {
        const isMultiUnit = (property as Property & { is_multi_unit?: boolean }).is_multi_unit || false;
        const propertyUnits = (propertyUnitsData || []).filter(u => u.property_id === property.id);

        if (isMultiUnit && propertyUnits.length > 0) {
          // Multi-unit property: add each unit as a separate rental unit
          for (const unit of propertyUnits) {
            // TODO: In future, tenants should be linked to property_units, not just properties
            // For now, we'll show units as vacant unless there's a tenant for the property
            const activeTenant = (tenantsData || []).find(t => t.property_id === property.id && t.status === 'active');
            const latestPayment = activeTenant ? paymentsData.find(p => p.tenant_id === activeTenant.id) : null;
            
            let paymentStatus: 'paid' | 'pending' | 'overdue' = 'paid';
            if (latestPayment) {
              if (latestPayment.status === 'late') paymentStatus = 'overdue';
              else if (latestPayment.status === 'pending') paymentStatus = 'pending';
            }

            const tenantUser = activeTenant?.user as Profile | null;
            unitsList.push({
              id: unit.id,
              name: unit.unit_name,
              unitNumber: unit.unit_number || undefined,
              propertyId: property.id,
              propertyTitle: property.title,
              propertyType: property.property_type || 'Apartment',
              unitType: unit.unit_type || 'room',
              location: property.location,
              rent: Number(unit.price) || 0,
              pricePeriod: unit.price_period || 'per_month',
              status: unit.is_available ? 'vacant' : 'rented',
              isMultiUnit: true,
              tenant: !unit.is_available && activeTenant ? {
                id: activeTenant.id,
                name: tenantUser?.name || 'Unknown Tenant',
                phone: tenantUser?.phone || null,
                avatarUrl: tenantUser?.avatar_url || null,
                leaseStart: activeTenant.lease_start_date,
                leaseEnd: activeTenant.lease_end_date,
                paymentStatus
              } : null,
              bedrooms: unit.bedrooms || 1,
              bathrooms: unit.bathrooms || 1,
              floorNumber: unit.floor_number || undefined,
              image: (unit.images as string[])?.[0] || property.images?.[0] || null
            });
          }
        } else {
          // Single-unit property: treat the property itself as a unit
          const activeTenant = (tenantsData || []).find(t => t.property_id === property.id && t.status === 'active');
          const latestPayment = activeTenant ? paymentsData.find(p => p.tenant_id === activeTenant.id) : null;
          
          let paymentStatus: 'paid' | 'pending' | 'overdue' = 'paid';
          if (latestPayment) {
            if (latestPayment.status === 'late') paymentStatus = 'overdue';
            else if (latestPayment.status === 'pending') paymentStatus = 'pending';
          }

          const tenantUser = activeTenant?.user as Profile | null;
          unitsList.push({
            id: property.id,
            name: property.title,
            propertyId: property.id,
            propertyTitle: property.title,
            propertyType: property.property_type || 'Apartment',
            unitType: 'property',
            location: property.location,
            rent: Number(property.price) || 0,
            pricePeriod: property.price_period || 'per_month',
            status: activeTenant ? 'rented' : 'vacant',
            isMultiUnit: false,
            tenant: activeTenant ? {
              id: activeTenant.id,
              name: tenantUser?.name || 'Unknown Tenant',
              phone: tenantUser?.phone || null,
              avatarUrl: tenantUser?.avatar_url || null,
              leaseStart: activeTenant.lease_start_date,
              leaseEnd: activeTenant.lease_end_date,
              paymentStatus
            } : null,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 1,
            image: property.images?.[0] || null
          });
        }
      }

      setUnits(unitsList);
      setStats(calculateStats(unitsList));
    } catch (err) {
      console.error('Error fetching units:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch units');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const refreshUnits = useCallback(async (): Promise<void> => {
    if (currentUser) await fetchUnits(currentUser);
  }, [currentUser, fetchUnits]);

  const getUnitById = useCallback((id: string): RentalUnit | undefined => {
    return units.find(u => u.id === id);
  }, [units]);

  return { units, properties, stats, loading, error, fetchUnits, refreshUnits, getUnitById };
};

export default useRentalUnits;
