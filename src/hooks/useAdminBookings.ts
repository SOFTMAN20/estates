/**
 * Admin Bookings Hook
 * Fetches and manages bookings for admin booking management
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

export interface AdminBooking {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  check_in: string;
  check_out: string;
  total_months: number;
  monthly_rent: number;
  service_fee: number;
  total_amount: number;
  status: string;
  special_requests: string | null;
  cancellation_reason: string | null;
  cancellation_date: string | null;
  created_at: string;
  updated_at: string | null;
  // Joined data
  property_title?: string;
  property_location?: string;
  guest_name?: string;
  guest_email?: string;
  host_name?: string;
  host_email?: string;
  payment_status?: string;
  payment_method?: string;
}

interface BookingFilters {
  status?: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  search?: string;
}

interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalCommission: number;
}

/**
 * Fetch all bookings with property, guest, and host details
 */
export function useAdminBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'bookings', filters],
    queryFn: async (): Promise<AdminBooking[]> => {
      // Fetch bookings with related data
      let query = supabase
        .from('bookings')
        .select(`
          *,
          properties(title, location),
          guest:profiles!bookings_guest_id_fkey(name),
          host:profiles!bookings_host_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data: bookings, error: bookingsError } = await query;

      if (bookingsError) {
        console.error('Failed to fetch bookings:', bookingsError);
        console.error('Error details:', {
          message: bookingsError.message,
          code: bookingsError.code,
          details: bookingsError.details,
        });
        throw bookingsError;
      }

      if (!bookings || bookings.length === 0) {
        return [];
      }

      // Fetch payment status for each booking
      const bookingIds = bookings.map(b => b.id);
      const { data: payments } = await supabase
        .from('payments')
        .select('booking_id, status, payment_method')
        .in('booking_id', bookingIds);

      // Create payment map
      const paymentMap = new Map(
        payments?.map(p => [p.booking_id, { status: p.status, method: p.payment_method }]) || []
      );

      // Transform bookings with joined data
      const transformedBookings = bookings.map((booking: any) => ({
        ...booking,
        property_title: booking.properties?.title || 'Unknown Property',
        property_location: booking.properties?.location || 'Unknown Location',
        guest_name: booking.guest?.name || 'Unknown Guest',
        guest_email: null, // Email not available in profiles
        host_name: booking.host?.name || 'Unknown Host',
        host_email: null, // Email not available in profiles
        payment_status: paymentMap.get(booking.id)?.status || 'pending',
        payment_method: paymentMap.get(booking.id)?.method || null,
      }));

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        return transformedBookings.filter(booking =>
          booking.id.toLowerCase().includes(searchLower) ||
          booking.property_title?.toLowerCase().includes(searchLower) ||
          booking.guest_name?.toLowerCase().includes(searchLower) ||
          booking.host_name?.toLowerCase().includes(searchLower) ||
          booking.property_location?.toLowerCase().includes(searchLower)
        );
      }

      return transformedBookings as AdminBooking[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get booking statistics
 */
export function useBookingStats() {
  return useQuery({
    queryKey: ['admin', 'booking-stats'],
    queryFn: async (): Promise<BookingStats> => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('status, total_amount, service_fee');

      if (error) throw error;

      const stats: BookingStats = {
        totalBookings: bookings?.length || 0,
        pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
        confirmedBookings: bookings?.filter(b => b.status === 'confirmed').length || 0,
        completedBookings: bookings?.filter(b => b.status === 'completed').length || 0,
        cancelledBookings: bookings?.filter(b => b.status === 'cancelled').length || 0,
        totalRevenue: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        totalCommission: bookings?.reduce((sum, b) => sum + (b.service_fee || 0), 0) || 0,
      };

      return stats;
    },
    staleTime: 2 * 60 * 1000,
  });
}
