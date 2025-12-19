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
import LoadingSpinner from '@/components/ui/loading-spinner';
import { PropertyGridSkeleton } from '@/components/properties/propertyCommon/PropertyCardSkeleton';
import { Search } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { usePropertyFilters } from '@/hooks/browseHooks/usePropertyFilters';
import { usePropertySearch } from '@/hooks/browseHooks/usePropertySearch';
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
      <div className={`fixed top-0 left-0 h-full w-full sm:w-96 md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        uiState.showFilters ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header - Sticky */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/5 to-orange-50 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filters</h2>
                <p className="text-xs sm:text-sm text-gray-500">Refine your search</p>
              </div>
            </div>
            <button
              onClick={() => updateUIState('showFilters', false)}
              className="p-2 hover:bg-white/80 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Close filters"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100%-80px)] sm:h-[calc(100%-88px)]">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
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
        <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
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
          </div>
          
          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => updateUIState('showFilters', !uiState.showFilters)}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">
              {uiState.showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
          </Button>
        </div>

        {/* Active Filters Display */}
        {
          hasActiveFilters() && (
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
                    {utility === 'electricity' ? t('browse.electricity') : t('browse.water')}
                    <button
                      onClick={() => toggleUtility(utility)}
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
                      onClick={() => toggleNearbyService(service)}
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
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
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