/**
 * BOOKING TYPES
 * =============
 * 
 * Type definitions for bookings and booking-related data
 * Matches the updated bookings table structure (without payment fields)
 */

import type { Tables } from '@/lib/integrations/supabase/types';

/**
 * Booking Status Enum
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * Booking Type from Database
 */
export type Booking = Tables<'bookings'>;

/**
 * Extended Booking Type with Relations
 * Includes property and user profile information
 */
export interface ExtendedBooking extends Omit<Booking, 'property_id' | 'guest_id' | 'host_id'> {
  property_id: string;
  guest_id: string;
  host_id: string;
  properties?: {
    id: string;
    title: string;
    location: string;
    images: string[];
    property_type: string;
    price: number;
  };
  guest_profile?: {
    id: string;
    name: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  host_profile?: {
    id: string;
    name: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
}

/**
 * Booking Form Data
 * Data structure for creating a new booking
 */
export interface BookingFormData {
  property_id: string;
  guest_id: string;
  host_id: string;
  check_in: string; // ISO date string (YYYY-MM-DD)
  check_out: string; // ISO date string (YYYY-MM-DD)
  total_months: number;
  monthly_rent: number;
  service_fee: number;
  total_amount: number;
  special_requests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

/**
 * Booking Creation Data
 * Data returned from BookingForm component
 */
export interface BookingCreationData {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  months: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
}

/**
 * Booking Filters
 * Filter criteria for booking queries
 */
export interface BookingFilters {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_id?: string;
  host_id?: string;
  property_id?: string;
  from_date?: string;
  to_date?: string;
}

/**
 * Booking Statistics
 * Aggregated booking data for analytics
 */
export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
  total_revenue: number;
  average_booking_value: number;
}

/**
 * Booking Update Data
 * Data for updating an existing booking
 */
export interface BookingUpdateData {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  check_in?: string;
  check_out?: string;
  total_months?: number;
  monthly_rent?: number;
  service_fee?: number;
  total_amount?: number;
  cancellation_reason?: string;
  cancellation_date?: string;
}
