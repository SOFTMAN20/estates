/**
 * Admin Statistics Hook
 * Fetches dashboard statistics and analytics data
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import type { DashboardStats, RevenueDataPoint, UserGrowthDataPoint, BookingTrendDataPoint, PropertyTypeDistribution } from '@/types/admin';

/**
 * Get dashboard statistics
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      
      if (error) throw error;
      
      return data as DashboardStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get revenue data for charts
 */
export function useRevenueData(months: number = 6) {
  return useQuery({
    queryKey: ['admin', 'revenue', months],
    queryFn: async (): Promise<RevenueDataPoint[]> => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('total_amount, service_fee, created_at')
        .in('status', ['confirmed', 'completed'])
        .gte('created_at', startDate.toISOString());
      
      if (error) throw error;
      
      // Group by month
      const monthlyData: Record<string, { revenue: number; commission: number }> = {};
      
      data?.forEach((booking) => {
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, commission: 0 };
        }
        
        monthlyData[month].revenue += booking.total_amount;
        monthlyData[month].commission += booking.service_fee;
      });
      
      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        commission: data.commission,
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get user growth data
 */
export function useUserGrowthData(months: number = 6) {
  return useQuery({
    queryKey: ['admin', 'user-growth', months],
    queryFn: async (): Promise<UserGrowthDataPoint[]> => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at, is_host')
        .gte('created_at', startDate.toISOString());
      
      if (error) throw error;
      
      // Group by month
      const monthlyData: Record<string, { users: number; hosts: number }> = {};
      
      data?.forEach((profile) => {
        const month = new Date(profile.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { users: 0, hosts: 0 };
        }
        
        monthlyData[month].users += 1;
        if (profile.is_host) {
          monthlyData[month].hosts += 1;
        }
      });
      
      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        users: data.users,
        hosts: data.hosts,
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get booking trends
 */
export function useBookingTrends(months: number = 6) {
  return useQuery({
    queryKey: ['admin', 'booking-trends', months],
    queryFn: async (): Promise<BookingTrendDataPoint[]> => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, total_amount')
        .gte('created_at', startDate.toISOString());
      
      if (error) throw error;
      
      // Group by month
      const monthlyData: Record<string, { bookings: number; revenue: number }> = {};
      
      data?.forEach((booking) => {
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { bookings: 0, revenue: 0 };
        }
        
        monthlyData[month].bookings += 1;
        monthlyData[month].revenue += booking.total_amount;
      });
      
      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        bookings: data.bookings,
        revenue: data.revenue,
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get property type distribution
 */
export function usePropertyTypeDistribution() {
  return useQuery({
    queryKey: ['admin', 'property-types'],
    queryFn: async (): Promise<PropertyTypeDistribution[]> => {
      const { data, error } = await supabase
        .from('properties')
        .select('property_type')
        .eq('status', 'approved');
      
      if (error) throw error;
      
      // Count by type
      const typeCounts: Record<string, number> = {};
      const total = data?.length || 0;
      
      data?.forEach((property) => {
        const type = property.property_type || 'other';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      
      return Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }));
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
