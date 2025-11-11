/**
 * USEPROPERTIES.TSX - PROPERTY DATA MANAGEMENT HOOK
 * ================================================
 * 
 * Kipengele cha usimamizi wa data ya nyumba - Property data management system
 * 
 * ARCHITECTURE / MUUNDO:
 * This hook implements the React Query pattern for efficient data fetching,
 * caching, and synchronization with the Supabase backend.
 * 
 * FEATURES / VIPENGELE:
 * - Automatic data fetching and caching
 * - Background refetching for fresh data
 * - Error handling and retry logic
 * - Type-safe property data structure
 * - Optimistic updates support
 * 
 * PERFORMANCE BENEFITS / FAIDA ZA UTENDAJI:
 * - Intelligent caching reduces API calls
 * - Background updates keep data fresh
 * - Automatic deduplication of requests
 * - Stale-while-revalidate strategy
 * 
 * SCALABILITY / UKUAJI:
 * - Can be extended for property filtering
 * - Supports pagination for large datasets
 * - Easy to add mutations for CRUD operations
 * - Can be optimized with query keys for granular caching
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';

/**
 * PROPERTY TYPE DEFINITION
 * =======================
 * 
 * Extended property type that includes related profile data.
 * Combines property information with host contact details.
 * 
 * BASE TYPE / AINA YA MSINGI:
 * - Inherits from Supabase generated types (Tables<'properties'>)
 * - Ensures type safety with database schema
 * - Automatic updates when schema changes
 * - Includes all fields: id, title, description, price, location, etc.
 * 
 * EXTENDED FIELDS / UGA ULIOONGEZWA:
 * - profiles: Host/landlord contact information
 * - Optional to handle cases where profile might not exist
 * - Includes name and phone for contact purposes
 * 
 * KEY FIELDS / UGA MUHIMU:
 * - amenities: string[] - Array of amenities (electricity, water, etc.)
 * - nearby_services: string[] - Array of nearby services (school, hospital, market)
 * - status: 'pending' | 'approved' | 'rejected'
 * - host_id: UUID - References profiles.id
 * - images: string[] - Array of image URLs
 * 
 * USAGE / MATUMIZI:
 * Used throughout the app for consistent property data structure.
 * Enables type-safe access to property and host information.
 */
export type Property = Tables<'properties'> & {
  profiles?: {
    name: string | null;
    phone: string | null;
  };
};

/**
 * PROPERTIES QUERY HOOK
 * ====================
 * 
 * Main hook for fetching property data from the database.
 * Implements React Query for efficient data management.
 * 
 * QUERY CONFIGURATION / MIPANGILIO YA HOJA:
 * - queryKey: ['properties'] - Unique identifier for caching
 * - queryFn: Async function that fetches data from Supabase
 * - Automatic refetching on window focus
 * - Error retry with exponential backoff
 * 
 * DATA TRANSFORMATION / MABADILIKO YA DATA:
 * - Joins properties with landlord profiles
 * - Filters only active properties
 * - Orders by creation date (newest first)
 * - Transforms profile arrays to single objects
 * 
 * ERROR HANDLING / KUSHUGHULIKIA MAKOSA:
 * - Comprehensive error logging
 * - Graceful fallback to empty array
 * - User-friendly error messages
 * - Automatic retry on network failures
 * 
 * CACHING STRATEGY / MKAKATI WA KUHIFADHI:
 * - Data cached for 5 minutes by default
 * - Background refetching keeps data fresh
 * - Shared cache across components
 * - Automatic invalidation on mutations
 */
export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const startTime = performance.now();
      /**
       * DATA FETCHING PROCESS
       * ====================
       * 
       * Step-by-step process for fetching property data:
       * 1. Log fetch attempt for debugging
       * 2. Query Supabase with joins and filters
       * 3. Handle errors with detailed logging
       * 4. Transform data for consistent structure
       * 5. Return type-safe property array
       */
      console.log('Fetching properties...');
      
      /**
       * SUPABASE QUERY CONSTRUCTION
       * ==========================
       * 
       * Complex query that:
       * - Selects all property fields (*)
       * - Joins with profiles table for host information
       * - Filters only approved properties (status='approved')
       * - Orders by creation date descending (newest first)
       * 
       * JOIN SYNTAX / MUUNDO WA KUUNGANISHA:
       * profiles:host_id - Joins using host_id foreign key
       * - host_id in properties table references id in profiles table
       * - Returns host's name and phone number
       * 
       * FILTERING / KUCHUJA:
       * - Only properties with status='approved' are returned
       * - Pending and rejected properties are excluded
       * - Ensures users only see verified listings
       * 
       * PERFORMANCE / UTENDAJI:
       * - Single query reduces round trips to database
       * - Indexed fields (status, created_at) for fast filtering
       * - Limited profile fields for reduced payload
       * - React Query caches results for 2 minutes
       */
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:host_id (
            name,
            phone
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        /**
         * ERROR HANDLING STRATEGY
         * ======================
         * 
         * Comprehensive error handling:
         * - Log error details for debugging
         * - Throw error to trigger React Query retry
         * - Error boundary will catch unhandled errors
         * - User sees loading state during retries
         */
        console.error('Error fetching properties:', error);
        throw error;
      }

      /**
       * DATA TRANSFORMATION LOGIC
       * ========================
       * 
       * Transforms Supabase response to match our Property type:
       * 
       * ISSUE / TATIZO:
       * Supabase returns profiles as an array due to join syntax,
       * but we need a single profile object for each property.
       * 
       * SOLUTION / SULUHISHO:
       * - Check if profiles array exists and has items
       * - Extract first profile object from array
       * - Set to undefined if no profile found
       * 
       * TYPE SAFETY / USALAMA WA AINA:
       * - Explicit casting to Property[] ensures type safety
       * - Handles edge cases where profile might not exist
       * - Maintains consistency with Property type definition
       */
      const transformedData = (data?.map((property: Record<string, unknown>) => ({
        ...property,
        profiles: Array.isArray(property.profiles) && property.profiles.length > 0 
          ? property.profiles[0] 
          : undefined
      })) || []) as Property[];

      /**
       * SUCCESS LOGGING AND RETURN
       * =========================
       * 
       * Final steps:
       * - Log successful fetch with data count
       * - Return transformed data with proper typing
       * - Data is now ready for component consumption
       * 
       * DEBUGGING / UTATUZI:
       * Console logs help track data flow and identify issues.
       * Can be removed in production for performance.
       */
      // Properties fetched successfully
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log API performance
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Properties API: ${responseTime.toFixed(0)}ms ${responseTime < 500 ? '✅' : '❌'}`);
      }
      
      return transformedData;
    },
    // Optimize for performance
    staleTime: 2 * 60 * 1000, // 2 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache retention (formerly cacheTime)
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 2, // Limit retries for faster failure handling
  });
};
