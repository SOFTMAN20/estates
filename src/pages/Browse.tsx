/**
 * BROWSE.TSX - PROPERTY LISTING AND SEARCH PAGE
 * =============================================
 * 
 * Ukurasa wa kutazama na kutafuta nyumba - Property browsing and search page
 * 
 * ARCHITECTURE OVERVIEW / MUHTASARI WA MUUNDO:
 * This is the main property discovery page that handles complex filtering,
 * search functionality, and property display. It serves as the primary
 * interface for users to find approved properties that match their criteria.
 * 
 * DESIGN PATTERNS / MIFUMO YA MUUNDO:
 * - URL-driven state management for shareable searches
 * - Compound filtering with multiple criteria (location, price, amenities, nearby services)
 * - Responsive grid/list view switching
 * - Client-side filtering for instant results
 * - React Query for efficient data fetching and caching
 * 
 * DATA FETCHING / KUPATA DATA:
 * - Fetches properties with status='approved' from Supabase
 * - Joins with profiles table to get host information
 * - Uses React Query for caching and background updates
 * - Filters properties by amenities array (electricity, water)
 * - Filters by nearby_services array (school, hospital, market)
 * 
 * MAIN FUNCTIONALITY / KAZI KEKUU:
 * - Display all approved properties (Kuonyesha nyumba zote zilizoidhinishwa)
 * - Advanced filtering by location, price, amenities, nearby services
 * - Property search by location name
 * - Sorting options (newest, price low-to-high, price high-to-low)
 * - Grid view mode for property display
 * - Favorites management (Usimamizi wa vipendwa)
 * - Active filter badges with remove functionality
 * 
 * FILTERING SYSTEM / MFUMO WA KUCHUJA:
 * - Location search: Case-insensitive partial match
 * - Price range: Predefined ranges or custom min/max
 * - Amenities: Checks amenities array for electricity, water
 * - Nearby services: Checks nearby_services array
 * - All filters work together (AND logic)
 */

import React, { useState } from 'react';
import { useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import PropertyCard from '@/components/common/PropertyCard';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { PropertyGridSkeleton } from '@/components/common/PropertyCardSkeleton';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import type { Property } from '@/hooks/useProperties';
import { useTranslation } from 'react-i18next';

/**
 * FILTER STATE INTERFACE
 * ======================
 * 
 * Defines the structure for all filter-related state.
 * Centralizes filter management for better maintainability.
 */
interface FilterState {
  searchQuery: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  utilities: string[];
  nearbyServices: string[];
  sortBy: string;
}

/**
 * UI STATE INTERFACE
 * ==================
 * 
 * Defines the structure for UI-related state.
 * Separates UI state from business logic.
 */
interface UIState {
  showFilters: boolean;
  favoriteIds: string[];
  viewMode: 'grid' | 'list';
}

/**
 * INITIAL FILTER STATE
 * ====================
 * 
 * Default values for all filters.
 * Extracted for reusability and consistency.
 */
const getInitialFilterState = (searchParams: URLSearchParams): FilterState => ({
  searchQuery: searchParams.get('location') || '',
  priceRange: searchParams.get('price') || 'all',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  utilities: [],
  nearbyServices: [],
  sortBy: 'newest'
});

/**
 * INITIAL UI STATE
 * ================
 * 
 * Default values for UI-related state.
 */
const getInitialUIState = (): UIState => ({
  showFilters: false,
  favoriteIds: [],
  viewMode: 'grid'
});

/**
 * PROPERTY FILTERING LOGIC
 * ========================
 * 
 * Pure function that filters properties based on current filter state.
 * Implements client-side filtering for instant results without API calls.
 * All filters use AND logic - property must match ALL active filters.
 * 
 * FILTER TYPES / AINA ZA VICHUJIO:
 * 1. Location Search: Case-insensitive partial match on location field
 * 2. Custom Price Range: User-defined min and max price
 * 3. Predefined Price Range: Quick select price brackets
 * 4. Amenities: Checks amenities array (electricity, water)
 * 5. Nearby Services: Checks nearby_services array (school, hospital, market)
 * 
 * @param properties - Array of properties to filter (from Supabase)
 * @param filters - Current filter state from component
 * @returns Filtered array of properties matching all criteria
 */
const filterProperties = (properties: Property[], filters: FilterState): Property[] => {
  return properties.filter(property => {
    // Location filtering - case insensitive partial match
    // Searches within the location string for the query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const location = property.location.toLowerCase();

      if (!location.includes(query)) {
        return false;
      }
    }

    // Custom price range filtering - user-defined min/max
    // Checks if property price falls within specified range
    if (filters.minPrice && parseInt(filters.minPrice) > Number(property.price)) {
      return false;
    }
    if (filters.maxPrice && parseInt(filters.maxPrice) < Number(property.price)) {
      return false;
    }

    // Predefined price range filtering - quick select brackets
    // Parses range string (e.g., "100000-500000") and checks bounds
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const minPriceRange = parseInt(min);
      const maxPriceRange = max ? parseInt(max) : Infinity;

      if (Number(property.price) < minPriceRange || Number(property.price) > maxPriceRange) {
        return false;
      }
    }

    // Amenities filtering - checks amenities array
    // Property must have ALL selected amenities (electricity, water)
    // Uses Array.every() to ensure all utilities are present
    if (filters.utilities.length > 0) {
      const hasAllUtilities = filters.utilities.every(utility =>
        property.amenities?.includes(utility)
      );
      if (!hasAllUtilities) return false;
    }

    // Nearby services filtering - checks nearby_services array
    // Property must have ALL selected services (school, hospital, market)
    // Uses Array.every() to ensure all services are present
    if (filters.nearbyServices.length > 0) {
      const hasAllServices = filters.nearbyServices.every(service =>
        property.nearby_services?.includes(service)
      );
      if (!hasAllServices) return false;
    }

    // Property passed all filters
    return true;
  });
};

/**
 * PROPERTY SORTING LOGIC
 * ======================
 * 
 * Pure function that sorts properties based on sort criteria.
 * Separated for clarity and reusability.
 * 
 * @param properties - Array of properties to sort
 * @param sortBy - Sort criteria
 * @returns Sorted array of properties
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

/**
 * FILTER UTILITIES
 * ================
 * 
 * Helper functions for filter management.
 */
const FilterUtils = {
  /**
   * Clears all filters to their default state
   */
  clearAll: (): FilterState => ({
    searchQuery: '',
    priceRange: 'all',
    minPrice: '',
    maxPrice: '',
    utilities: [],
    nearbyServices: [],
    sortBy: 'newest'
  }),

  /**
   * Checks if any filters are currently active
   */
  hasActiveFilters: (filters: FilterState): boolean => {
    return !!(
      filters.searchQuery ||
      (filters.priceRange && filters.priceRange !== 'all') ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.utilities.length > 0 ||
      filters.nearbyServices.length > 0
    );
  },

  /**
   * Toggles a utility filter on/off
   */
  toggleUtility: (utilities: string[], utility: string): string[] => {
    return utilities.includes(utility)
      ? utilities.filter(u => u !== utility)
      : [...utilities, utility];
  },

  /**
   * Toggles a nearby service filter on/off
   */
  toggleNearbyService: (services: string[], service: string): string[] => {
    return services.includes(service)
      ? services.filter(s => s !== service)
      : [...services, service];
  }
};

/**
 * BROWSE COMPONENT
 * ===============
 * 
 * Main component for property browsing and search functionality.
 * Handles all filtering, sorting, and display logic for approved properties.
 * 
 * DATA FLOW / MTIRIRIKO WA DATA:
 * 1. useProperties hook fetches approved properties from Supabase
 * 2. Properties are joined with profiles table for host info
 * 3. Client-side filtering applies all active filters
 * 4. Client-side sorting arranges filtered results
 * 5. PropertyCard components display final results
 * 
 * STATE MANAGEMENT / USIMAMIZI WA HALI:
 * - filters: All filter criteria (location, price, amenities, services)
 * - uiState: UI-related state (showFilters, favoriteIds, viewMode)
 * - URL params: Initial filter state from URL for shareable searches
 * 
 * PERFORMANCE / UTENDAJI:
 * - React Query caches property data
 * - Client-side filtering for instant results
 * - Memoized filter and sort functions
 * - Efficient re-renders with proper state structure
 */
const Browse = () => {
  // URL parameter handling for search state persistence
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // State management - separated into logical groups
  const [filters, setFilters] = useState<FilterState>(() => getInitialFilterState(searchParams));
  const [uiState, setUIState] = useState<UIState>(() => getInitialUIState());

  // Data fetching from Supabase via React Query
  // Fetches properties with status='approved' and joins with profiles
  const { data: properties = [], isLoading, error } = useProperties();

  // Favorites functionality - manages user's favorite properties
  const { isFavorited, toggleFavorite } = useFavorites();

  // Scroll to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * FILTER UPDATE HANDLERS
   * =====================
   * 
   * Generic handlers for updating filter and UI state.
   * Uses TypeScript generics for type-safe state updates.
   */
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateUIState = <K extends keyof UIState>(key: K, value: UIState[K]) => {
    setUIState(prev => ({ ...prev, [key]: value }));
  };

  /**
   * UTILITY TOGGLE HANDLER
   * =====================
   * 
   * Handles toggling of amenity filters (electricity, water).
   * Checks/unchecks amenities in the amenities array filter.
   * Uses FilterUtils helper for array manipulation.
   */
  const handleUtilityToggle = (utility: string) => {
    const newUtilities = FilterUtils.toggleUtility(filters.utilities, utility);
    updateFilter('utilities', newUtilities);
  };

  /**
   * NEARBY SERVICE TOGGLE HANDLER
   * ============================
   * 
   * Handles toggling of nearby service filters (school, hospital, market).
   * Checks/unchecks services in the nearby_services array filter.
   * Uses FilterUtils helper for array manipulation.
   */
  const handleNearbyServiceToggle = (service: string) => {
    const newServices = FilterUtils.toggleNearbyService(filters.nearbyServices, service);
    updateFilter('nearbyServices', newServices);
  };

  /**
   * FAVORITE TOGGLE HANDLER
   * ======================
   * 
   * Manages adding/removing properties from favorites list.
   * Note: This is local state only. For persistent favorites,
   * integrate with useFavorites hook and Supabase.
   */
  const handleToggleFavorite = (propertyId: string) => {
    const newFavorites = uiState.favoriteIds.includes(propertyId)
      ? uiState.favoriteIds.filter(id => id !== propertyId)
      : [...uiState.favoriteIds, propertyId];

    updateUIState('favoriteIds', newFavorites);
  };

  /**
   * CLEAR ALL FILTERS HANDLER
   * ========================
   * 
   * Resets all filters to their default state.
   * Useful when user wants to start fresh search.
   */
  const handleClearAllFilters = () => {
    setFilters(FilterUtils.clearAll());
  };

  /**
   * APPLY FILTERING AND SORTING
   * ==========================
   * 
   * Two-step process:
   * 1. Filter properties based on all active filters
   * 2. Sort filtered results based on sort criteria
   * 
   * Both operations are client-side for instant results.
   */
  const filteredProperties = filterProperties(properties as Property[], filters);
  const sortedProperties = sortProperties(filteredProperties, filters.sortBy);

  /**
   * ERROR STATE RENDERING
   * ====================
   * 
   * Displays error message if data fetching fails.
   */
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('browse.errorLoading')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('browse.tryAgainLater')}
            </p>
            <Button onClick={() => window.location.reload()}>
              {t('browse.tryAgain')}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /**
   * MAIN COMPONENT RENDERING
   * =======================
   * 
   * Renders the complete browse page with all sections.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />

      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-primary/5 to-serengeti-50 border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Main Search Interface */}
          <Card className="shadow-xl border-0 rounded-xl lg:rounded-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6 xl:p-8">
              <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4">
                {/* Location Search Input */}
                <div className="flex-1">
                  <div className="relative border-2 border-gray-300 rounded-full hover:border-primary/50 transition-colors duration-200 focus-within:border-primary shadow-sm">
                    <Input
                      placeholder={t('browse.cityPlaceholder')}
                      value={filters.searchQuery}
                      onChange={(e) => updateFilter('searchQuery', e.target.value)}
                      className="pl-4 sm:pl-5 lg:pl-6 pr-14 sm:pr-16 lg:pr-20 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2 sm:p-2.5 lg:p-3 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </button>
                  </div>
                </div>

                {/* Price Range Selector */}
                <div className="flex flex-row gap-2 sm:gap-4">
                  <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                    <SelectTrigger className="flex-1 h-10 sm:h-12 lg:h-14 border-2 border-gray-300 rounded-full hover:border-primary/50 min-w-0 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white">
                      <SelectValue placeholder={t('browse.priceLabel')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('browse.anyPrice')}</SelectItem>
                      <SelectItem value="0-100000">{t('browse.under100k')}</SelectItem>
                      <SelectItem value="100000-500000">{t('browse.100kTo500k')}</SelectItem>
                      <SelectItem value="500000-1000000">{t('browse.500kTo1m')}</SelectItem>
                      <SelectItem value="1000000-2000000">{t('browse.1mTo2m')}</SelectItem>
                      <SelectItem value="2000000+">{t('browse.over2m')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Toggle Button */}
                  <Button
                    variant="outline"
                    onClick={() => updateUIState('showFilters', !uiState.showFilters)}
                    className="flex-1 h-10 sm:h-12 lg:h-14 min-w-0 border-2 border-gray-300 rounded-full hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center px-3 sm:px-4 transition-all duration-200 bg-white"
                  >
                    <SlidersHorizontal className="h-4 w-4 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-sm sm:text-sm whitespace-nowrap">{t('browse.filters')}</span>
                  </Button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {uiState.showFilters && (
                <div className="border-t mt-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Custom Price Range */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.customPrice')}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('browse.minPriceLabel')}
                          </label>
                          <Input
                            type="number"
                            placeholder="30,000"
                            value={filters.minPrice}
                            onChange={(e) => updateFilter('minPrice', e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('browse.maxPriceLabel')}
                          </label>
                          <Input
                            type="number"
                            placeholder="500,000"
                            value={filters.maxPrice}
                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                            className="w-full"
                          />!
                        </div>
                      </div>
                    </div>

                    {/* Utilities Filter */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.basicUtilities')}</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'electricity', label: t('browse.electricity') },
                          { key: 'water', label: t('browse.water') }
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.utilities.includes(key)}
                              onChange={() => handleUtilityToggle(key)}
                              className="mr-3 w-4 h-4 text-primary"
                            />
                            <span className="text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nearby Services Filter */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.nearbyServices')}</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'school', label: t('browse.school') },
                          { key: 'hospital', label: t('browse.hospital') },
                          { key: 'market', label: t('browse.market') }
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.nearbyServices.includes(key)}
                              onChange={() => handleNearbyServiceToggle(key)}
                              className="mr-3 w-4 h-4 text-primary"
                            />
                            <span className="text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.sortBy')}</h4>
                      <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">{t('browse.newest')}</SelectItem>
                          <SelectItem value="price-low">{t('browse.priceLow')}</SelectItem>
                          <SelectItem value="price-high">{t('browse.priceHigh')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" onClick={handleClearAllFilters} className="text-gray-600">
                      <X className="h-4 w-4 mr-2" />
                      {t('browse.clearFilters')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              Available Properties
            </h2>
            {
              filters.searchQuery && sortedProperties.length > 0 && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Showing results for "{filters.searchQuery}"
                </p>
              )
            }
          </div >
        </div >

        {/* Active Filters Display */}
        {
          FilterUtils.hasActiveFilters(filters) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {/* Search Query Badge */}
                {filters.searchQuery && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {filters.searchQuery}
                    <button
                      onClick={() => updateFilter('searchQuery', '')}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Price Range Badge */}
                {filters.priceRange && filters.priceRange !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1">
                    TZS {filters.priceRange}
                    <button
                      onClick={() => updateFilter('priceRange', 'all')}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Min Price Badge */}
                {filters.minPrice && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Min: TZS {parseInt(filters.minPrice).toLocaleString()}
                    <button
                      onClick={() => updateFilter('minPrice', '')}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Max Price Badge */}
                {filters.maxPrice && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Max: TZS {parseInt(filters.maxPrice).toLocaleString()}
                    <button
                      onClick={() => updateFilter('maxPrice', '')}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Utility Badges */}
                {filters.utilities.map(utility => (
                  <Badge key={utility} variant="secondary" className="px-3 py-1">
                    {utility === 'electricity' ? 'Umeme' : 'Maji'}
                    {utility === 'electricity' ? t('browse.electricity') : t('browse.water')}
                    <button
                      onClick={() => handleUtilityToggle(utility)}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {/* Nearby Service Badges */}
                {filters.nearbyServices.map(service => (
                  <Badge key={service} variant="secondary" className="px-3 py-1">
                    {service === 'school' ? t('browse.school') : service === 'hospital' ? t('browse.hospital') : t('browse.market')}
                    <button
                      onClick={() => handleNearbyServiceToggle(service)}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )
        }

        {/* Loading State */}
        {
          isLoading && (
            <div className="py-16">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-center text-gray-600">{t('browse.loadingProperties')}</p>
            </div>
          )
        }

        {/* Properties Grid/List Display */}
        {
          isLoading ? (
            /* Skeleton Loading State - Airbnb Style */
            <PropertyGridSkeleton
              count={12}
              viewMode={uiState.viewMode}
            />
          ) : sortedProperties.length > 0 ? (
            <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${uiState.viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
              }`}>
              {sortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  price={Number(property.price)}
                  location={property.location}
                  images={property.images || []}
                  phone={property.profiles?.phone || undefined}
                  contactPhone={property.contact_phone || undefined}
                  contactWhatsappPhone={property.contact_whatsapp_phone || undefined}
                  electricity={property.amenities?.includes('electricity') || false}
                  water={property.amenities?.includes('water') || false}
                  bedrooms={property.bedrooms || undefined}
                  isFavorited={isFavorited(property.id)}
                  onToggleFavorite={toggleFavorite}
                  viewMode={uiState.viewMode}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('browse.noPropertiesFound')}
                </h3>
                <p className="text-gray-600 mb-8">
                  {t('browse.tryChangingFilters')}
                </p>
                <Button onClick={handleClearAllFilters} size="lg">
                  {t('browse.clearFilters')}
                </Button>
              </div>
            </div>
          )
        }
      </div >

      <Footer />
    </div >
  );
};

export default Browse;