/**
 * USE HOST BOOKINGS HOOK
 * ======================
 * 
 * Custom hook for fetching and managing bookings for a host
 * Provides pending bookings count and booking management functions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

export interface HostBooking {
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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests?: string;
  created_at: string;
  properties: {
    id: string;
    title: string;
    location: string;
    images: string[];
    property_type: string;
    price: number;
  };
  guest_profile: {
    id: string;
    name: string;
    phone: string;
    avatar_url: string;
  };
}

/**
 * Fetch all bookings for a host
 */
async function fetchHostBookings(hostId: string): Promise<HostBooking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      properties:property_id (
        id,
        title,
        location,
        images,
        property_type,
        price
      ),
      guest_profile:profiles!bookings_guest_id_fkey (
        id,
        name,
        phone,
        avatar_url
      )
    `)
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching host bookings:', error);
    throw new Error(error.message);
  }

  return (data || []) as unknown as HostBooking[];
}

/**
 * Update booking status (approve/reject)
 */
async function updateBookingStatus(
  bookingId: string, 
  status: 'confirmed' | 'cancelled',
  cancellationReason?: string
): Promise<void> {
  const updates: Record<string, unknown> = { status };
  
  if (status === 'cancelled' && cancellationReason) {
    updates.cancellation_reason = cancellationReason;
    updates.cancellation_date = new Date().toISOString();
  }

  const { error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId);

  if (error) {
    console.error('Error updating booking status:', error);
    throw new Error(error.message);
  }
}

/**
 * Hook: useHostBookings
 * Fetch all bookings for a host with filtering capabilities
 */
export function useHostBookings(hostId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['host-bookings', hostId],
    queryFn: () => fetchHostBookings(hostId!),
    enabled: !!hostId,
  });

  // Derived data
  const bookings = query.data || [];
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const upcomingBookings = confirmedBookings.filter(b => new Date(b.check_in) >= new Date());

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (bookingId: string) => updateBookingStatus(bookingId, 'confirmed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-bookings', hostId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) => 
      updateBookingStatus(bookingId, 'cancelled', reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-bookings', hostId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return {
    bookings,
    pendingBookings,
    confirmedBookings,
    upcomingBookings,
    pendingCount: pendingBookings.length,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    approveBooking: approveMutation.mutate,
    rejectBooking: rejectMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}

export default useHostBookings;
