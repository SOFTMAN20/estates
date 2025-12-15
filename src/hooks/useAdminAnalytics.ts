/**
 * Admin Analytics Hook
 * Fetches analytics data from Supabase for admin analytics page
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

interface RevenueByMonth {
  month: string;
  revenue: number;
  bookings: number;
  properties: number;
}

interface PropertyTypePerformance {
  type: string;
  bookings: number;
  revenue: number;
  avgRating: number;
}

interface LocationAnalytics {
  location: string;
  properties: number;
  bookings: number;
  revenue: number;
}

interface UserGrowthData {
  month: string;
  guests: number;
  hosts: number;
}

interface BookingDurationData {
  duration: string;
  count: number;
  percentage: number;
}

interface KeyMetrics {
  totalRevenue: number;
  avgBookingValue: number;
  occupancyRate: number;
  avgRating: number;
  revenueGrowth: number;
  bookingValueGrowth: number;
  occupancyGrowth: number;
  ratingGrowth: number;
}

/**
 * Fetch key metrics
 */
export function useKeyMetrics() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'key-metrics'],
    queryFn: async (): Promise<KeyMetrics> => {
      // Fetch all bookings with payments
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_amount, status, created_at');

      if (bookingsError) throw bookingsError;

      // Fetch all properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, status');

      if (propertiesError) throw propertiesError;

      // Fetch reviews for average rating
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('overall_rating');

      if (reviewsError) throw reviewsError;

      // Calculate total revenue
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Calculate average booking value
      const completedBookings = bookings?.filter(b => b.status === 'completed') || [];
      const avgBookingValue = completedBookings.length > 0
        ? totalRevenue / completedBookings.length
        : 0;

      // Calculate occupancy rate (simplified: booked properties / total properties)
      const approvedProperties = properties?.filter(p => p.status === 'approved') || [];
      const bookedProperties = new Set(bookings?.map(b => b.property_id) || []);
      const occupancyRate = approvedProperties.length > 0
        ? (bookedProperties.size / approvedProperties.length) * 100
        : 0;

      // Calculate average rating
      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviews.length
        : 0;

      // For growth calculations, we'll use simplified mock data for now
      // In production, you'd compare with previous period
      return {
        totalRevenue,
        avgBookingValue,
        occupancyRate,
        avgRating,
        revenueGrowth: 12.5,
        bookingValueGrowth: 8.2,
        occupancyGrowth: 5.3,
        ratingGrowth: 0.2,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch revenue by month
 */
export function useRevenueByMonth() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'revenue-by-month'],
    queryFn: async (): Promise<RevenueByMonth[]> => {
      // Fetch bookings from last 8 months
      const eightMonthsAgo = new Date();
      eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_amount, created_at, property_id')
        .gte('created_at', eightMonthsAgo.toISOString());

      if (error) throw error;

      // Group by month
      const monthlyData: Record<string, { revenue: number; bookings: number; properties: Set<string> }> = {};
      
      bookings?.forEach(booking => {
        const date = new Date(booking.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, bookings: 0, properties: new Set() };
        }
        
        monthlyData[monthKey].revenue += booking.total_amount || 0;
        monthlyData[monthKey].bookings += 1;
        monthlyData[monthKey].properties.add(booking.property_id);
      });

      // Convert to array format
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const result: RevenueByMonth[] = [];

      for (let i = 7; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const month = months[monthIndex];
        const data = monthlyData[month] || { revenue: 0, bookings: 0, properties: new Set() };
        
        result.push({
          month,
          revenue: data.revenue,
          bookings: data.bookings,
          properties: data.properties.size,
        });
      }

      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch property type performance
 */
export function usePropertyTypePerformance() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'property-type-performance'],
    queryFn: async (): Promise<PropertyTypePerformance[]> => {
      // Fetch all properties with their bookings
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, property_type');

      if (propertiesError) throw propertiesError;

      // Fetch all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('property_id, total_amount');

      if (bookingsError) throw bookingsError;

      // Fetch reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('property_id, overall_rating');

      if (reviewsError) throw reviewsError;

      // Group by property type
      const typeData: Record<string, { bookings: number; revenue: number; ratings: number[] }> = {};

      properties?.forEach(property => {
        const type = property.property_type || 'Other';
        if (!typeData[type]) {
          typeData[type] = { bookings: 0, revenue: 0, ratings: [] };
        }

        // Count bookings and revenue for this property
        const propertyBookings = bookings?.filter(b => b.property_id === property.id) || [];
        typeData[type].bookings += propertyBookings.length;
        typeData[type].revenue += propertyBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

        // Get ratings for this property
        const propertyReviews = reviews?.filter(r => r.property_id === property.id) || [];
        typeData[type].ratings.push(...propertyReviews.map(r => r.overall_rating || 0));
      });

      // Convert to array format
      return Object.entries(typeData).map(([type, data]) => ({
        type,
        bookings: data.bookings,
        revenue: data.revenue,
        avgRating: data.ratings.length > 0
          ? data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length
          : 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch location analytics
 */
export function useLocationAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'location-analytics'],
    queryFn: async (): Promise<LocationAnalytics[]> => {
      // Fetch all properties with location
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, city');

      if (propertiesError) throw propertiesError;

      // Fetch all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('property_id, total_amount');

      if (bookingsError) throw bookingsError;

      // Group by location
      const locationData: Record<string, { properties: number; bookings: number; revenue: number }> = {};

      properties?.forEach(property => {
        const location = property.city || 'Unknown';
        if (!locationData[location]) {
          locationData[location] = { properties: 0, bookings: 0, revenue: 0 };
        }

        locationData[location].properties += 1;

        // Count bookings and revenue for this property
        const propertyBookings = bookings?.filter(b => b.property_id === property.id) || [];
        locationData[location].bookings += propertyBookings.length;
        locationData[location].revenue += propertyBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      });

      // Convert to array and sort by revenue
      return Object.entries(locationData)
        .map(([location, data]) => ({
          location,
          ...data,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // Top 5 locations
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch user growth data
 */
export function useUserGrowthData() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'user-growth'],
    queryFn: async (): Promise<UserGrowthData[]> => {
      // Fetch users from last 8 months
      const eightMonthsAgo = new Date();
      eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

      const { data: users, error } = await supabase
        .from('profiles')
        .select('created_at, is_host')
        .gte('created_at', eightMonthsAgo.toISOString());

      if (error) throw error;

      // Group by month
      const monthlyData: Record<string, { guests: number; hosts: number }> = {};

      users?.forEach(user => {
        const date = new Date(user.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { guests: 0, hosts: 0 };
        }

        if (user.is_host) {
          monthlyData[monthKey].hosts += 1;
        } else {
          monthlyData[monthKey].guests += 1;
        }
      });

      // Convert to cumulative array format
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const result: UserGrowthData[] = [];
      let cumulativeGuests = 0;
      let cumulativeHosts = 0;

      for (let i = 7; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const month = months[monthIndex];
        const data = monthlyData[month] || { guests: 0, hosts: 0 };

        cumulativeGuests += data.guests;
        cumulativeHosts += data.hosts;

        result.push({
          month,
          guests: cumulativeGuests,
          hosts: cumulativeHosts,
        });
      }

      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch booking duration data
 */
export function useBookingDurationData() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'booking-duration'],
    queryFn: async (): Promise<BookingDurationData[]> => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_months');

      if (error) throw error;

      // Group by duration ranges
      const durations = {
        '1 month': 0,
        '2-3 months': 0,
        '4-6 months': 0,
        '6+ months': 0,
      };

      bookings?.forEach(booking => {
        const months = booking.total_months || 0;
        if (months === 1) {
          durations['1 month'] += 1;
        } else if (months >= 2 && months <= 3) {
          durations['2-3 months'] += 1;
        } else if (months >= 4 && months <= 6) {
          durations['4-6 months'] += 1;
        } else if (months > 6) {
          durations['6+ months'] += 1;
        }
      });

      const total = Object.values(durations).reduce((sum, count) => sum + count, 0);

      return Object.entries(durations).map(([duration, count]) => ({
        duration,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

interface UserStatistics {
  totalUsers: number;
  activeHosts: number;
  guestRetention: number;
  newUsersThisMonth: number;
  newHostsThisMonth: number;
}

/**
 * Fetch user statistics
 */
export function useUserStatistics() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'user-statistics'],
    queryFn: async (): Promise<UserStatistics> => {
      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, is_host, created_at');

      if (usersError) throw usersError;

      // Calculate total users
      const totalUsers = users?.length || 0;

      // Calculate active hosts (users who have properties)
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('host_id');

      if (propertiesError) throw propertiesError;

      const uniqueHosts = new Set(properties?.map(p => p.host_id) || []);
      const activeHosts = uniqueHosts.size;

      // Calculate new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newUsersThisMonth = users?.filter(u => 
        new Date(u.created_at) >= startOfMonth
      ).length || 0;

      const newHostsThisMonth = users?.filter(u => 
        u.is_host && new Date(u.created_at) >= startOfMonth
      ).length || 0;

      // Calculate guest retention (guests with multiple bookings)
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('guest_id');

      if (bookingsError) throw bookingsError;

      // Count bookings per guest
      const guestBookingCounts: Record<string, number> = {};
      bookings?.forEach(booking => {
        guestBookingCounts[booking.guest_id] = (guestBookingCounts[booking.guest_id] || 0) + 1;
      });

      // Calculate retention (guests with 2+ bookings)
      const totalGuests = Object.keys(guestBookingCounts).length;
      const repeatGuests = Object.values(guestBookingCounts).filter(count => count >= 2).length;
      const guestRetention = totalGuests > 0 ? (repeatGuests / totalGuests) * 100 : 0;

      return {
        totalUsers,
        activeHosts,
        guestRetention,
        newUsersThisMonth,
        newHostsThisMonth,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
