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
 */
const filterProperties = (properties: Property[], filters: FilterState): Property[] => {
  return properties.filter(property => {
    // Location filtering
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const location = property.location.toLowerCase();
      if (!location.includes(query)) return false;
    }

    // Custom price range filtering
    if (filters.minPrice && parseInt(filters.minPrice) > Number(property.price)) {
      return false;
    }
    if (filters.maxPrice && parseInt(filters.maxPrice) < Number(property.price)) {
      return false;
    }

    // Predefined price range filtering
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const minPriceRange = parseInt(min);
      const maxPriceRange = max ? parseInt(max) : Infinity;

      if (Number(property.price) < minPriceRange || Number(property.price) > maxPriceRange) {
        return false;
      }
    }

    // Amenities filtering
    if (filters.utilities.length > 0) {
      const hasAllUtilities = filters.utilities.every(utility =>
        property.amenities?.includes(utility)
      );
      if (!hasAllUtilities) return false;
    }

    // Nearby services filtering
    if (filters.nearbyServices.length > 0) {
      const hasAllServices = filters.nearbyServices.every(service =>
        property.nearby_services?.includes(service)
      );
      if (!hasAllServices) return false;
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
