/**
 * USE BOOKINGS HOOK
 * =================
 * 
 * Custom hook for managing bookings with React Query
 * Provides functions to create, read, update, and delete bookings
 * 
 * ⚠️ IMPORTANT: This file uses 'any' types temporarily until the database migration is applied.
 * After applying the migration and regenerating TypeScript types, these can be replaced with proper types.
 * See: docs/BOOKINGS_SETUP_GUIDE.md for migration instructions.
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
 * 
 * ⚠️ Note: This function uses type assertions to work with the current database schema.
 * After applying the migration and regenerating types, these assertions can be removed.
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
      )
    `)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.guest_id) {
    // Note: Current schema uses 'user_id', will be 'guest_id' after migration
    query = query.eq('user_id', filters.guest_id);
  }
  if (filters?.host_id) {
    // Note: host_id will be available after migration
    // For now, filter by property owner
  }
  if (filters?.property_id) {
    query = query.eq('property_id', filters.property_id);
  }
  if (filters?.from_date) {
    // Note: Current schema uses 'start_date', will be 'check_in' after migration
    query = query.gte('start_date', filters.from_date);
  }
  if (filters?.to_date) {
    // Note: Current schema uses 'end_date', will be 'check_out' after migration
    query = query.lte('end_date', filters.to_date);
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
      )
    `)
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Create a new booking
 * 
 * ⚠️ Note: This function maps new field names to current database schema.
 * After migration, this mapping can be removed.
 */
async function createBooking(bookingData: BookingFormData): Promise<any> {
  // Map new field names to current database schema
  const dbData = {
    property_id: bookingData.property_id,
    user_id: bookingData.guest_id, // Maps to current 'user_id' field
    start_date: bookingData.check_in, // Maps to current 'start_date' field
    end_date: bookingData.check_out, // Maps to current 'end_date' field
    total_price: bookingData.total_amount, // Maps to current 'total_price' field
    status: bookingData.status || 'pending',
    // Note: special_requests, total_months, monthly_rent, service_fee, host_id
    // will be available after migration
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(dbData as any)
    .select()
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
  // Map new field names to current database schema if needed
  const dbUpdates: any = {};
  
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.check_in) dbUpdates.start_date = updates.check_in;
  if (updates.check_out) dbUpdates.end_date = updates.check_out;
  if (updates.total_amount) dbUpdates.total_price = updates.total_amount;
  // Note: Other fields will be available after migration

  const { data, error } = await supabase
    .from('bookings')
    .update(dbUpdates)
    .eq('id', bookingId)
    .select()
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
    status: 'cancelled'
  };
  
  // Note: cancellation_reason and cancellation_date will be available after migration
  if (reason) {
    updates.cancellation_date = new Date().toISOString();
  }

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
