/**
 * USE BOOKINGS HOOK
 * =================
 * 
 * Custom hook for managing bookings with React Query
 * Provides functions to create, read, update, and delete bookings
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import type { 
  BookingFormData, 
  BookingUpdateData, 
  BookingFilters
} from '@/types/booking';

/**
 * Fetch bookings with optional filters
 */
async function fetchBookings(filters?: BookingFilters): Promise<any[]> {
  let query = supabase
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
      ),
      host_profile:profiles!bookings_host_id_fkey (
        id,
        name,
        phone,
        avatar_url
      )
    `) as any;

  query = query.order('created_at', { ascending: false });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.guest_id) {
    query = query.eq('guest_id', filters.guest_id);
  }
  if (filters?.host_id) {
    query = query.eq('host_id', filters.host_id);
  }
  if (filters?.property_id) {
    query = query.eq('property_id', filters.property_id);
  }
  if (filters?.from_date) {
    query = query.gte('check_in', filters.from_date);
  }
  if (filters?.to_date) {
    query = query.lte('check_out', filters.to_date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bookings:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch a single booking by ID
 */
async function fetchBookingById(bookingId: string): Promise<any> {
  const { data, error } = await (supabase
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
      ),
      host_profile:profiles!bookings_host_id_fkey (
        id,
        name,
        phone,
        avatar_url
      )
    `)
    .eq('id', bookingId)
    .single() as any);

  if (error) {
    console.error('Error fetching booking:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Create a new booking
 */
async function createBooking(bookingData: BookingFormData): Promise<any> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      property_id: bookingData.property_id,
      guest_id: bookingData.guest_id,
      host_id: bookingData.host_id,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      total_months: bookingData.total_months,
      monthly_rent: bookingData.monthly_rent,
      service_fee: bookingData.service_fee,
      total_amount: bookingData.total_amount,
      special_requests: bookingData.special_requests || null,
      status: bookingData.status || 'pending',
    } as any)
    .select(`
      *,
      properties:property_id (
        id,
        title,
        location,
        images,
        property_type,
        price
      )
    `)
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update an existing booking
 */
async function updateBooking(
  bookingId: string, 
  updates: BookingUpdateData
): Promise<any> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates as any)
    .eq('id', bookingId)
    .select(`
      *,
      properties:property_id (
        id,
        title,
        location,
        images,
        property_type,
        price
      )
    `)
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Cancel a booking
 */
async function cancelBooking(
  bookingId: string, 
  reason?: string
): Promise<any> {
  const updates: any = { 
    status: 'cancelled',
    cancellation_reason: reason || null,
    cancellation_date: new Date().toISOString(),
  };

  return updateBooking(bookingId, updates);
}

/**
 * Delete a booking (admin only)
 */
async function deleteBooking(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error('Error deleting booking:', error);
    throw new Error(error.message);
  }
}

/**
 * Hook: useBookings
 * Fetch bookings with optional filters
 */
export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => fetchBookings(filters),
  });
}

/**
 * Hook: useBooking
 * Fetch a single booking by ID
 */
export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => fetchBookingById(bookingId),
    enabled: !!bookingId,
  });
}

/**
 * Hook: useCreateBooking
 * Create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Invalidate bookings queries to refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

/**
 * Hook: useUpdateBooking
 * Update an existing booking
 */
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, updates }: { bookingId: string; updates: BookingUpdateData }) =>
      updateBooking(bookingId, updates),
    onSuccess: (_, variables) => {
      // Invalidate specific booking and all bookings queries
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

/**
 * Hook: useCancelBooking
 * Cancel a booking
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      cancelBooking(bookingId, reason),
    onSuccess: (_, variables) => {
      // Invalidate specific booking and all bookings queries
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

/**
 * Hook: useDeleteBooking
 * Delete a booking (admin only)
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      // Invalidate all bookings queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
