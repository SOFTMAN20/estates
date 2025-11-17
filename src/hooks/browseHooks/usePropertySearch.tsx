/**
 * USEPROPERTYSEARCH.TSX - PROPERTY SEARCH HOOK
 * ============================================
 * 
 * Custom hook for property filtering and sorting operations
 * Handles client-side filtering and sorting of properties
 * 
 * FEATURES:
 * - Property filtering by multiple criteria
 * - Property sorting (newest, price low-to-high, price high-to-low)
 * - Memoized operations for performance
 * 
 * BENEFITS:
 * - Reusability: Can be used anywhere properties need filtering
 * - Performance: Efficient filtering and sorting
 * - Maintainability: Centralized search logic
 * - Testability: Pure functions easy to test
 */

import { useMemo } from 'react';
import type { Property } from '@/hooks/useProperties';
import type { FilterState } from './usePropertyFilters';

/**
 * Filter properties based on current filter state
 * Supports searching by:
 * - Location (area, town, city, region) - case-insensitive partial match
 * - Price range (min/max or predefined ranges)
 * - Amenities (electricity, water)
 * - Nearby services (school, hospital, market)
 */
const filterProperties = (properties: Property[], filters: FilterState): Property[] => {
  return properties.filter(property => {
    // Location filtering - searches in location field
    // Supports partial matches for area, town, city names
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const location = (property.location || '').toLowerCase();
      const title = (property.title || '').toLowerCase();
      const description = (property.description || '').toLowerCase();
      
      // Search in location, title, and description for better results
      const matchesSearch = location.includes(query) || 
                           title.includes(query) || 
                           description.includes(query);
      
      if (!matchesSearch) return false;
    }

    // Custom price range filtering (min/max from search or filters)
    const propertyPrice = Number(property.price);
    
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      if (!isNaN(minPrice) && propertyPrice < minPrice) {
        return false;
      }
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      if (!isNaN(maxPrice) && propertyPrice > maxPrice) {
        return false;
      }
    }

    // Predefined price range filtering (from dropdown)
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const minPriceRange = parseInt(min);
      const maxPriceRange = max ? parseInt(max) : Infinity;

      if (propertyPrice < minPriceRange || propertyPrice > maxPriceRange) {
        return false;
      }
    }

    // Amenities filtering (electricity, water)
    if (filters.utilities.length > 0) {
      const hasAllUtilities = filters.utilities.every(utility =>
        property.amenities?.includes(utility)
      );
      if (!hasAllUtilities) return false;
    }

    // Nearby services filtering (school, hospital, market)
    if (filters.nearbyServices.length > 0) {
      const hasAllServices = filters.nearbyServices.every(service =>
        property.nearby_services?.includes(service)
      );
      if (!hasAllServices) return false;
    }

    // Property type filtering
    if (filters.propertyType && filters.propertyType !== 'all') {
      if (property.property_type?.toLowerCase() !== filters.propertyType.toLowerCase()) {
        return false;
      }
    }

    // Bedrooms filtering
    if (filters.bedrooms && filters.bedrooms !== 'all') {
      const minBedrooms = parseInt(filters.bedrooms);
      if (!isNaN(minBedrooms) && (property.bedrooms || 0) < minBedrooms) {
        return false;
      }
    }

    // Bathrooms filtering
    if (filters.bathrooms && filters.bathrooms !== 'all') {
      const minBathrooms = parseInt(filters.bathrooms);
      if (!isNaN(minBathrooms) && (property.bathrooms || 0) < minBathrooms) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort properties based on sort criteria
 */
const sortProperties = (properties: Property[], sortBy: string): Property[] => {
  return [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
};

export const usePropertySearch = (properties: Property[], filters: FilterState) => {
  /**
   * Memoized filtered properties
   * Only recalculates when properties or filters change
   */
  const filteredProperties = useMemo(() => {
    return filterProperties(properties, filters);
  }, [properties, filters]);

  /**
   * Memoized sorted properties
   * Only recalculates when filtered properties or sort criteria change
   */
  const sortedProperties = useMemo(() => {
    return sortProperties(filteredProperties, filters.sortBy);
  }, [filteredProperties, filters.sortBy]);

  return {
    filteredProperties,
    sortedProperties,
    resultCount: sortedProperties.length
  };
};

export default usePropertySearch;
