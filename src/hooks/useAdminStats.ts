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
      // Get current date and first day of current month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      // Get first day of previous month for growth calculation
      const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      // Fetch all data in parallel
      const [
        usersResult,
        usersThisMonthResult,
        usersPrevMonthResult,
        propertiesResult,
        propertiesThisMonthResult,
        bookingsResult,
        bookingsThisMonthResult,
        revenueResult,
        revenueThisMonthResult,
        revenuePrevMonthResult,
      ] = await Promise.all([
        // Total users
        supabase.from('profiles').select('id, role', { count: 'exact', head: true }),
        
        // Users this month
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
        
        // Users previous month
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .gte('created_at', firstDayOfPrevMonth)
          .lte('created_at', lastDayOfPrevMonth),
        
        // Properties by status
        supabase.from('properties').select('status', { count: 'exact' }),
        
        // Properties this month
        supabase.from('properties').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
        
        // Bookings by status
        supabase.from('bookings').select('status', { count: 'exact' }),
        
        // Bookings this month
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
        
        // Total revenue (confirmed + completed bookings)
        supabase.from('bookings').select('total_amount, service_fee').in('status', ['confirmed', 'completed']),
        
        // Revenue this month
        supabase.from('bookings').select('total_amount, service_fee')
          .in('status', ['confirmed', 'completed'])
          .gte('created_at', firstDayOfMonth),
        
        // Revenue previous month
        supabase.from('bookings').select('total_amount, service_fee')
          .in('status', ['confirmed', 'completed'])
          .gte('created_at', firstDayOfPrevMonth)
          .lte('created_at', lastDayOfPrevMonth),
      ]);

      // Check for errors
      if (usersResult.error) throw usersResult.error;
      if (propertiesResult.error) throw propertiesResult.error;
      if (bookingsResult.error) throw bookingsResult.error;
      if (revenueResult.error) throw revenueResult.error;

      // Calculate user stats
      const totalUsers = usersResult.count || 0;
      const usersThisMonth = usersThisMonthResult.count || 0;
      const usersPrevMonth = usersPrevMonthResult.count || 0;
      const userGrowth = usersPrevMonth > 0 ? ((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 100 : 0;
      
      // Count admin users (need to fetch actual data for this)
      const { data: allUsers } = await supabase.from('profiles').select('role');
      const adminUsers = allUsers?.filter(u => u.role === 'admin').length || 0;
      const regularUsers = totalUsers - adminUsers;

      // Calculate property stats
      const propertiesData = propertiesResult.data || [];
      const totalProperties = propertiesData.length;
      const pendingProperties = propertiesData.filter(p => p.status === 'pending').length;
      const approvedProperties = propertiesData.filter(p => p.status === 'approved').length;
      const rejectedProperties = propertiesData.filter(p => p.status === 'rejected').length;
      const newPropertiesThisMonth = propertiesThisMonthResult.count || 0;

      // Calculate booking stats
      const bookingsData = bookingsResult.data || [];
      const totalBookings = bookingsData.length;
      const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed').length;
      const completedBookings = bookingsData.filter(b => b.status === 'completed').length;
      const cancelledBookings = bookingsData.filter(b => b.status === 'cancelled').length;
      const bookingsThisMonth = bookingsThisMonthResult.count || 0;

      // Calculate revenue stats
      const totalRevenue = revenueResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const platformCommission = revenueResult.data?.reduce((sum, b) => sum + (b.service_fee || 0), 0) || 0;
      const revenueThisMonth = revenueThisMonthResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const revenuePrevMonth = revenuePrevMonthResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const revenueGrowth = revenuePrevMonth > 0 ? ((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100 : 0;

      return {
        totalUsers,
        userGrowth,
        regularUsers,
        adminUsers,
        
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        newPropertiesThisMonth,
        
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        bookingsThisMonth,
        
        totalRevenue,
        platformCommission,
        revenueThisMonth,
        revenueGrowth,
      };
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
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Initialize all months with zero values
      const monthlyData: Record<string, { revenue: number; commission: number }> = {};
      const now = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthKey] = { revenue: 0, commission: 0 };
      }
      
      // Aggregate data by month
      data?.forEach((booking) => {
        const monthKey = new Date(booking.created_at).toLocaleDateString('en-US', { 
          month: 'short' 
        });
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += booking.total_amount || 0;
          monthlyData[monthKey].commission += booking.service_fee || 0;
        }
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
 * Get user growth data (cumulative)
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
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Initialize all months with zero values
      const monthlyData: Record<string, { users: number; hosts: number }> = {};
      const now = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthKey] = { users: 0, hosts: 0 };
      }
      
      // Count cumulative users by month
      let cumulativeUsers = 0;
      let cumulativeHosts = 0;
      
      data?.forEach((profile) => {
        const monthKey = new Date(profile.created_at).toLocaleDateString('en-US', { 
          month: 'short' 
        });
        
        if (monthlyData[monthKey] !== undefined) {
          cumulativeUsers += 1;
          if (profile.is_host) {
            cumulativeHosts += 1;
          }
          monthlyData[monthKey].users = cumulativeUsers;
          monthlyData[monthKey].hosts = cumulativeHosts;
        }
      });
      
      // Fill in cumulative values for months with no new users
      let lastUsers = 0;
      let lastHosts = 0;
      
      return Object.entries(monthlyData).map(([month, data]) => {
        if (data.users === 0 && lastUsers > 0) {
          data.users = lastUsers;
          data.hosts = lastHosts;
        }
        lastUsers = data.users;
        lastHosts = data.hosts;
        
        return {
          month,
          users: data.users,
          hosts: data.hosts,
        };
      });
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
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Initialize all months with zero values
      const monthlyData: Record<string, { bookings: number; revenue: number }> = {};
      const now = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthKey] = { bookings: 0, revenue: 0 };
      }
      
      // Aggregate data by month
      data?.forEach((booking) => {
        const monthKey = new Date(booking.created_at).toLocaleDateString('en-US', { 
          month: 'short' 
        });
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].bookings += 1;
          monthlyData[monthKey].revenue += booking.total_amount || 0;
        }
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
