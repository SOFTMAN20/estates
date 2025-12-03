/**
 * SEARCH TYPES
 * ============
 * 
 * Type definitions for search, filtering, and property discovery
 */

/**
 * Filter State
 * Complete state for property filtering
 */
export interface FilterState {
  searchQuery: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  utilities: string[];
  nearbyServices: string[];
  sortBy: string;
}

/**
 * Property Search Bar Props
 * Props for the search bar component
 */
export interface PropertySearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onSearch?: () => void;
  className?: string;
}

/**
 * Property Filters Panel Props
 * Props for the advanced filters panel
 */
export interface PropertyFiltersPanelProps {
  // Price filters
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  
  // Property type filter
  propertyType?: string;
  onPropertyTypeChange?: (value: string) => void;
  
  // Bedrooms filter
  bedrooms?: string;
  onBedroomsChange?: (value: string) => void;
  
  // Bathrooms filter
  bathrooms?: string;
  onBathroomsChange?: (value: string) => void;
  
  // Utilities filters
  utilities: string[];
  onUtilityToggle: (utility: string) => void;
  
  // Nearby services filters
  nearbyServices: string[];
  onNearbyServiceToggle: (service: string) => void;
  
  // Sort
  sortBy: string;
  onSortChange: (value: string) => void;
  
  // Actions
  onClearAll: () => void;
  
  className?: string;
}

/**
 * UI State
 * UI-related state for browse/search pages
 */
export interface UIState {
  showFilters: boolean;
  viewMode: 'grid' | 'list';
}

/**
 * Search Suggestion
 * Structure for search autocomplete suggestions
 */
export interface SearchSuggestion {
  icon: React.ReactNode;
  text: string;
  category?: string;
}

/**
 * Sort Option
 * Available sorting options for properties
 */
export enum SortOption {
  NEWEST = 'newest',
  PRICE_LOW_HIGH = 'price_low_high',
  PRICE_HIGH_LOW = 'price_high_low',
  MOST_VIEWED = 'most_viewed',
  RATING = 'rating'
}

/**
 * Price Range Option
 * Predefined price range options
 */
export interface PriceRangeOption {
  value: string;
  label: string;
  min?: number;
  max?: number;
}

/**
 * Filter Badge
 * Active filter badge for display
 */
export interface FilterBadge {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}
