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

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import PropertyCard from '@/components/properties/propertyCommon/PropertyCard';
import PropertyFiltersPanel from '@/components/search/PropertyFiltersPanel';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyGridSkeleton } from '@/components/properties/propertyCommon/PropertyCardSkeleton';
import { Search, Loader2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { usePropertyFilters } from '@/hooks/browseHooks/usePropertyFilters';
import { usePropertySearch } from '@/hooks/browseHooks/usePropertySearch';
import { usePaginatedProperties } from '@/hooks/browseHooks/usePaginatedProperties';
import { useTranslation } from 'react-i18next';

import type { UIState } from '@/types/search';

/**
 * UI STATE INTERFACE
 * ==================
 * 
 * Defines the structure for UI-related state.
 * Separates UI state from business logic.
 */

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
  const { t } = useTranslation();

  // Custom hooks for filter management
  const {
    filters,
    updateFilter,
    toggleUtility,
    toggleNearbyService,
    clearAllFilters,
    hasActiveFilters
  } = usePropertyFilters();

  // UI state management
  const [uiState, setUIState] = useState<UIState>({
    showFilters: false,
    viewMode: 'grid'
  });

  // Data fetching from Supabase
  const { data: properties = [], isLoading, error } = useProperties();

  // Property search and filtering with custom hook
  const { sortedProperties } = usePropertySearch(properties, filters);

  // Pagination with "Load More" functionality
  const {
    displayedProperties,
    hasMore,
    isLoadingMore,
    loadMore,
    totalCount,
    displayedCount
  } = usePaginatedProperties(sortedProperties, { pageSize: 12 });

  // Favorites functionality
  const { isFavorited, toggleFavorite } = useFavorites();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // UI state update helper
  const updateUIState = <K extends keyof UIState>(key: K, value: UIState[K]) => {
    setUIState(prev => ({ ...prev, [key]: value }));
  };

  // Count active filters for badge display
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.priceRange && filters.priceRange !== 'all') count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.propertyType && filters.propertyType !== 'all') count++;
    if (filters.bedrooms && filters.bedrooms !== 'all') count++;
    if (filters.bathrooms && filters.bathrooms !== 'all') count++;
    count += filters.utilities.length;
    count += filters.nearbyServices.length;
    return count;
  };

  // Helper to get utility label
  const getUtilityLabel = (utility: string): string => {
    const labels: Record<string, string> = {
      electricity: '⚡ ' + t('browse.electricity'),
      water: '💧 ' + t('browse.water'),
      furnished: '🛋️ Furnished',
      parking: '🚗 Parking',
      security: '🛡️ Security',
      wifi: '📶 WiFi',
      ac: '❄️ AC',
      tv: '📺 TV'
    };
    return labels[utility] || utility;
  };

  // Helper to get nearby service label
  const getNearbyServiceLabel = (service: string): string => {
    const labels: Record<string, string> = {
      school: '🏫 ' + t('browse.school'),
      hospital: '🏥 ' + t('browse.hospital'),
      market: '🏪 ' + t('browse.market'),
      bank: '🏦 ' + t('browse.bank'),
      transport: '🚌 ' + t('browse.transport')
    };
    return labels[service] || service;
  };

  // Helper to get property type label
  const getPropertyTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      Apartment: '🏢 ' + t('browse.apartment'),
      House: '🏡 ' + t('browse.house'),
      Studio: '🛋️ ' + t('browse.studio'),
      'Shared Room': '🚪 ' + t('browse.room'),
      Bedsitter: '🛏️ ' + t('browse.bedsitter'),
      Lodge: '🏨 ' + t('browse.lodge'),
      Hotel: '🏩 ' + t('browse.hotel'),
      Hostel: '🏠 ' + t('browse.hostel'),
      Office: '🏢 ' + t('browse.office')
    };
    return labels[type] || type;
  };

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

      {/* Sidebar Overlay - Click to close */}
      {uiState.showFilters && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => updateUIState('showFilters', false)}
          aria-label="Close filters"
        />
      )}

      {/* Filters Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        uiState.showFilters ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={() => updateUIState('showFilters', false)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          <div className="px-4 py-4">
            <PropertyFiltersPanel
              propertyType={filters.propertyType}
              onPropertyTypeChange={(value) => updateFilter('propertyType', value)}
              bedrooms={filters.bedrooms}
              onBedroomsChange={(value) => updateFilter('bedrooms', value)}
              bathrooms={filters.bathrooms}
              onBathroomsChange={(value) => updateFilter('bathrooms', value)}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onMinPriceChange={(value) => updateFilter('minPrice', value)}
              onMaxPriceChange={(value) => updateFilter('maxPrice', value)}
              utilities={filters.utilities}
              onUtilityToggle={toggleUtility}
              nearbyServices={filters.nearbyServices}
              onNearbyServiceToggle={toggleNearbyService}
              sortBy={filters.sortBy}
              onSortChange={(value) => updateFilter('sortBy', value)}
              onClearAll={clearAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              Available Properties
            </h2>
            {/* Results count */}
            <p className="text-gray-500 text-sm mt-0.5">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  Showing {displayedCount} of {totalCount} {totalCount === 1 ? 'property' : 'properties'}
                  {filters.searchQuery && ` for "${filters.searchQuery}"`}
                </>
              )}
            </p>
          </div>
          
          {/* Controls: Sort + Filter */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500 hidden sm:block" />
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-[140px] sm:w-[160px] h-9 sm:h-10 text-sm border-gray-200">
                  <SelectValue placeholder={t('browse.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('browse.newest')}</SelectItem>
                  <SelectItem value="price-low">{t('browse.priceLow')}</SelectItem>
                  <SelectItem value="price-high">{t('browse.priceHigh')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => updateUIState('showFilters', !uiState.showFilters)}
              className="flex items-center gap-2 flex-shrink-0 h-9 sm:h-10 relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('browse.filters')}
              </span>
              {/* Active filters count badge */}
              {hasActiveFilters() && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {
          hasActiveFilters() && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Query Badge */}
                {filters.searchQuery && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200">
                    🔍 {filters.searchQuery}
                    <button
                      onClick={() => updateFilter('searchQuery', '')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Property Type Badge */}
                {filters.propertyType && filters.propertyType !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 border border-purple-200">
                    {getPropertyTypeLabel(filters.propertyType)}
                    <button
                      onClick={() => updateFilter('propertyType', 'all')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Bedrooms Badge */}
                {filters.bedrooms && filters.bedrooms !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                    🛏️ {filters.bedrooms}+ {t('browse.bedrooms')}
                    <button
                      onClick={() => updateFilter('bedrooms', 'all')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Bathrooms Badge */}
                {filters.bathrooms && filters.bathrooms !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-cyan-50 text-cyan-700 border border-cyan-200">
                    🚿 {filters.bathrooms}+ {t('browse.bathrooms')}
                    <button
                      onClick={() => updateFilter('bathrooms', 'all')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Price Range Badge */}
                {filters.priceRange && filters.priceRange !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200">
                    💰 TZS {filters.priceRange}
                    <button
                      onClick={() => updateFilter('priceRange', 'all')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Min Price Badge */}
                {filters.minPrice && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200">
                    Min: TZS {parseInt(filters.minPrice).toLocaleString()}
                    <button
                      onClick={() => updateFilter('minPrice', '')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Max Price Badge */}
                {filters.maxPrice && (
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200">
                    Max: TZS {parseInt(filters.maxPrice).toLocaleString()}
                    <button
                      onClick={() => updateFilter('maxPrice', '')}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {/* Utility Badges */}
                {filters.utilities.map(utility => (
                  <Badge key={utility} variant="secondary" className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                    {getUtilityLabel(utility)}
                    <button
                      onClick={() => toggleUtility(utility)}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {/* Nearby Service Badges */}
                {filters.nearbyServices.map(service => (
                  <Badge key={service} variant="secondary" className="px-3 py-1.5 text-sm bg-orange-50 text-orange-700 border border-orange-200">
                    {getNearbyServiceLabel(service)}
                    <button
                      onClick={() => toggleNearbyService(service)}
                      className="ml-2 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {/* Clear All Button */}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-md transition-colors"
                >
                  {t('browse.clearFilters')}
                </button>
              </div>
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
          ) : displayedProperties.length > 0 ? (
            <>
              <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${uiState.viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {displayedProperties.map((property) => (
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
                    bathrooms={property.bathrooms || undefined}
                    squareMeters={property.square_meters || undefined}
                    averageRating={property.average_rating || 0}
                    totalReviews={property.total_reviews || 0}
                    isFavorited={isFavorited(property.id)}
                    onToggleFavorite={toggleFavorite}
                    viewMode={uiState.viewMode}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 sm:mt-10">
                  <Button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px] h-12 text-base font-medium border-2 border-primary/20 
                               hover:border-primary hover:bg-primary/5 transition-all duration-300
                               rounded-full shadow-sm hover:shadow-md"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t('browse.loading')}
                      </>
                    ) : (
                      <>
                        {t('browse.loadMore')}
                        <span className="ml-2 text-gray-500">
                          ({totalCount - displayedCount} more)
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* End of Results Indicator */}
              {!hasMore && totalCount > 12 && (
                <div className="text-center mt-8 sm:mt-10">
                  <p className="text-gray-500 text-sm">
                    {t('browse.endOfResults')}
                  </p>
                </div>
              )}
            </>
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
                <Button onClick={clearAllFilters} size="lg">
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