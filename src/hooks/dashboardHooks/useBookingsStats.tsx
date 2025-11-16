/**
 * USEBOOKINGSSTATS.TSX - BOOKINGS STATISTICS HOOK
 * ===============================================
 * 
 * Custom hook for fetching bookings statistics for the dashboard
 * 
 * FEATURES:
 * - Fetches total bookings count for a host
 * - Ready for when bookings table is created
 * - Returns 0 as placeholder for now
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';

interface BookingsStats {
  totalBookings: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch bookings statistics
 * 
 * @param hostId - The ID of the host/landlord
 * @returns BookingsStats object with total bookings count
 */
export const useBookingsStats = (hostId?: string): BookingsStats => {
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookingsStats = async () => {
      if (!hostId) {
        setTotalBookings(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch bookings count for properties owned by this host
        const { data: properties, error: propsError } = await supabase
          .from('properties')
          .select('id')
          .eq('host_id', hostId);

        if (propsError) throw propsError;

        if (!properties || properties.length === 0) {
          setTotalBookings(0);
          return;
        }

        const propertyIds = properties.map(p => p.id);

        // Count bookings for these properties
        const { count, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .in('property_id', propertyIds);

        if (bookingsError) throw bookingsError;

        setTotalBookings(count || 0);
      } catch (err) {
        console.error('Error fetching bookings stats:', err);
        setError(err as Error);
        setTotalBookings(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingsStats();
  }, [hostId]);

  return {
    totalBookings,
    isLoading,
    error,
  };
};

export default useBookingsStats;
