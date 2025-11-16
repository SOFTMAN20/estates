/**
 * USEPROPERTYFILTERS.TSX - PROPERTY FILTERING HOOK
 * ================================================
 * 
 * Custom hook for managing property filter state and logic
 * Handles all filtering operations for property browsing
 * 
 * FEATURES:
 * - Filter state management
 * - URL parameter synchronization
 * - Filter operations (toggle, clear, update)
 * - Active filters detection
 * 
 * BENEFITS:
 * - Reusability: Can be used in any component needing property filters
 * - Modularity: Separates filter logic from UI
 * - Maintainability: Single source of truth for filter operations
 * - Testability: Easy to unit test filter logic
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterState {
  searchQuery: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  utilities: string[];
  nearbyServices: string[];
  sortBy: string;
}

const getInitialFilterState = (searchParams: URLSearchParams): FilterState => ({
  searchQuery: searchParams.get('location') || '',
  priceRange: searchParams.get('price') || 'all',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  utilities: [],
  nearbyServices: [],
  sortBy: 'newest'
});

export const usePropertyFilters = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => getInitialFilterState(searchParams));

  /**
   * Update a single filter value
   */
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Toggle a utility filter on/off
   */
  const toggleUtility = (utility: string) => {
    setFilters(prev => ({
      ...prev,
      utilities: prev.utilities.includes(utility)
        ? prev.utilities.filter(u => u !== utility)
        : [...prev.utilities, utility]
    }));
  };

  /**
   * Toggle a nearby service filter on/off
   */
  const toggleNearbyService = (service: string) => {
    setFilters(prev => ({
      ...prev,
      nearbyServices: prev.nearbyServices.includes(service)
        ? prev.nearbyServices.filter(s => s !== service)
        : [...prev.nearbyServices, service]
    }));
  };

  /**
   * Clear all filters to default state
   */
  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      priceRange: 'all',
      minPrice: '',
      maxPrice: '',
      utilities: [],
      nearbyServices: [],
      sortBy: 'newest'
    });
  };

  /**
   * Check if any filters are currently active
   */
  const hasActiveFilters = (): boolean => {
    return !!(
      filters.searchQuery ||
      (filters.priceRange && filters.priceRange !== 'all') ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.utilities.length > 0 ||
      filters.nearbyServices.length > 0
    );
  };

  return {
    filters,
    updateFilter,
    toggleUtility,
    toggleNearbyService,
    clearAllFilters,
    hasActiveFilters
  };
};

export default usePropertyFilters;
