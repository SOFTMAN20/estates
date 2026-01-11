/**
 * USEPAGINATEDPROPERTIES.TSX - PAGINATION HOOK FOR PROPERTIES
 * ===========================================================
 * 
 * Custom hook for paginated property loading with "Load More" functionality
 * Implements client-side pagination on filtered/sorted results
 * 
 * FEATURES:
 * - Initial page load with configurable page size
 * - Load more functionality
 * - Tracks loading state and whether more items exist
 * - Resets pagination when filters change
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Property } from '@/hooks/useProperties';

interface UsePaginatedPropertiesOptions {
  pageSize?: number;
}

interface UsePaginatedPropertiesReturn {
  displayedProperties: Property[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  totalCount: number;
  displayedCount: number;
  resetPagination: () => void;
}

const DEFAULT_PAGE_SIZE = 12;

export const usePaginatedProperties = (
  properties: Property[],
  options: UsePaginatedPropertiesOptions = {}
): UsePaginatedPropertiesReturn => {
  const { pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset pagination when properties array changes (filters applied)
  useEffect(() => {
    setDisplayCount(pageSize);
  }, [properties.length, pageSize]);

  // Get the currently displayed properties
  const displayedProperties = useMemo(() => {
    return properties.slice(0, displayCount);
  }, [properties, displayCount]);

  // Check if there are more properties to load
  const hasMore = useMemo(() => {
    return displayCount < properties.length;
  }, [displayCount, properties.length]);

  // Load more properties with simulated delay for smooth UX
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // Small delay for smooth loading animation
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + pageSize, properties.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, pageSize, properties.length]);

  // Reset pagination to initial state
  const resetPagination = useCallback(() => {
    setDisplayCount(pageSize);
  }, [pageSize]);

  return {
    displayedProperties,
    hasMore,
    isLoadingMore,
    loadMore,
    totalCount: properties.length,
    displayedCount: displayedProperties.length,
    resetPagination
  };
};

export default usePaginatedProperties;
