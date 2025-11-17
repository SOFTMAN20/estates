/**
 * PROPERTYFILTERSPANEL.TSX - ADVANCED FILTERS COMPONENT
 * =====================================================
 * 
 * Reusable advanced filters panel for property filtering
 * Handles custom price range, utilities, nearby services, and sorting
 * 
 * FEATURES:
 * - Custom price range (min/max)
 * - Utilities filter (electricity, water)
 * - Nearby services filter (school, hospital, market)
 * - Sort options
 * - Clear all filters button
 * 
 * BENEFITS:
 * - Modularity: Separate component for filters
 * - Reusability: Can be used in different contexts
 * - Maintainability: Easy to update filter options
 * - Readability: Clean, focused component
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PropertyFiltersPanelProps {
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

const PropertyFiltersPanel: React.FC<PropertyFiltersPanelProps> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  propertyType = 'all',
  onPropertyTypeChange,
  bedrooms = 'all',
  onBedroomsChange,
  bathrooms = 'all',
  onBathroomsChange,
  utilities,
  onUtilityToggle,
  nearbyServices,
  onNearbyServiceToggle,
  sortBy,
  onSortChange,
  onClearAll,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`space-y-5 sm:space-y-6 ${className}`}>
      <div className="space-y-5 sm:space-y-6">
          {/* Property Type */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">🏠</span>
              Property Type
            </label>
            <Select value={propertyType} onValueChange={onPropertyTypeChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">🏢 Apartment</SelectItem>
                <SelectItem value="house">🏡 House</SelectItem>
                <SelectItem value="studio">🛋️ Studio</SelectItem>
                <SelectItem value="room">🚪 Room</SelectItem>
                <SelectItem value="villa">🏰 Villa</SelectItem>
                <SelectItem value="commercial">🏪 Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">🛏️</span>
              Bedrooms
            </label>
            <Select value={bedrooms} onValueChange={onBedroomsChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1+ Bedroom</SelectItem>
                <SelectItem value="2">2+ Bedrooms</SelectItem>
                <SelectItem value="3">3+ Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
                <SelectItem value="5">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">🚿</span>
              Bathrooms
            </label>
            <Select value={bathrooms} onValueChange={onBathroomsChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1+ Bathroom</SelectItem>
                <SelectItem value="2">2+ Bathrooms</SelectItem>
                <SelectItem value="3">3+ Bathrooms</SelectItem>
                <SelectItem value="4">4+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Price Range */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">💰</span>
              {t('browse.customPrice')}
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Minimum (TZS)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 30,000"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                  className="w-full text-sm sm:text-base h-10 sm:h-11"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Maximum (TZS)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 500,000"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  className="w-full text-sm sm:text-base h-10 sm:h-11"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">📊</span>
              {t('browse.sortBy')}
            </label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">🆕 {t('browse.newest')}</SelectItem>
                <SelectItem value="price-low">💵 {t('browse.priceLow')}</SelectItem>
                <SelectItem value="price-high">💎 {t('browse.priceHigh')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs sm:text-sm font-medium text-gray-500">Amenities & Services</span>
        </div>
      </div>

      {/* Utilities and Nearby Services */}
      <div className="space-y-5 sm:space-y-6">
        {/* Utilities Filter */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">{t('browse.basicUtilities')}</h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { key: 'electricity', label: t('browse.electricity'), icon: '⚡' },
                { key: 'water', label: t('browse.water'), icon: '💧' }
              ].map(({ key, label, icon }) => (
                <label 
                  key={key} 
                  className={`flex items-center cursor-pointer px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                    utilities.includes(key) 
                      ? 'border-primary bg-primary text-white shadow-md scale-105' 
                      : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={utilities.includes(key)}
                    onChange={() => onUtilityToggle(key)}
                    className="sr-only"
                  />
                  <span className="mr-2 text-base sm:text-lg">{icon}</span>
                  <span className="font-medium">{label}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Nearby Services Filter */}
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">{t('browse.nearbyServices')}</h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { key: 'school', label: t('browse.school'), icon: '🏫' },
                { key: 'hospital', label: t('browse.hospital'), icon: '🏥' },
                { key: 'market', label: t('browse.market'), icon: '🏪' }
              ].map(({ key, label, icon }) => (
                <label 
                  key={key} 
                  className={`flex items-center cursor-pointer px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                    nearbyServices.includes(key) 
                      ? 'border-primary bg-primary text-white shadow-md scale-105' 
                      : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={nearbyServices.includes(key)}
                    onChange={() => onNearbyServiceToggle(key)}
                    className="sr-only"
                  />
                  <span className="mr-2 text-base sm:text-lg">{icon}</span>
                  <span className="font-medium">{label}</span>
                </label>
              ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onClearAll} 
          className="w-full text-sm sm:text-base h-11 sm:h-12 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500 transition-all duration-200 font-semibold"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {t('browse.clearFilters')}
        </Button>
      </div>
    </div>
  );
};

export default PropertyFiltersPanel;
