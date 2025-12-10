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
import type { PropertyFiltersPanelProps } from '@/types/search';

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
              {t('browse.propertyType')}
            </label>
            <Select value={propertyType} onValueChange={onPropertyTypeChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue placeholder={t('browse.allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('browse.allTypes')}</SelectItem>
                <SelectItem value="apartment">🏢 {t('browse.apartment')}</SelectItem>
                <SelectItem value="house">🏡 {t('browse.house')}</SelectItem>
                <SelectItem value="studio">🛋️ {t('browse.studio')}</SelectItem>
                <SelectItem value="room">🚪 {t('browse.room')}</SelectItem>
                <SelectItem value="villa">🏰 {t('browse.villa')}</SelectItem>
                <SelectItem value="commercial">🏪 {t('browse.commercial')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">🛏️</span>
              {t('browse.bedrooms')}
            </label>
            <Select value={bedrooms} onValueChange={onBedroomsChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue placeholder={t('browse.any')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('browse.any')}</SelectItem>
                <SelectItem value="1">{t('browse.bedroomPlus', { count: 1 })}</SelectItem>
                <SelectItem value="2">{t('browse.bedroomsPlus', { count: 2 })}</SelectItem>
                <SelectItem value="3">{t('browse.bedroomsPlus', { count: 3 })}</SelectItem>
                <SelectItem value="4">{t('browse.bedroomsPlus', { count: 4 })}</SelectItem>
                <SelectItem value="5">{t('browse.bedroomsPlus', { count: 5 })}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              <span className="text-lg">🚿</span>
              {t('browse.bathrooms')}
            </label>
            <Select value={bathrooms} onValueChange={onBathroomsChange}>
              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                <SelectValue placeholder={t('browse.any')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('browse.any')}</SelectItem>
                <SelectItem value="1">{t('browse.bathroomPlus', { count: 1 })}</SelectItem>
                <SelectItem value="2">{t('browse.bathroomsPlus', { count: 2 })}</SelectItem>
                <SelectItem value="3">{t('browse.bathroomsPlus', { count: 3 })}</SelectItem>
                <SelectItem value="4">{t('browse.bathroomsPlus', { count: 4 })}</SelectItem>
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
                  {t('browse.minimum')}
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
                  {t('browse.maximum')}
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
          <span className="bg-white px-3 text-xs sm:text-sm font-medium text-gray-500">{t('browse.amenitiesServices')}</span>
        </div>
      </div>

      {/* Utilities and Nearby Services */}
      <div className="space-y-5 sm:space-y-6">
        {/* Amenities & Services Filter */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">{t('browse.amenitiesServices')}</h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { key: 'electricity', translationKey: 'propertyDetail.amenities.electricity', icon: '⚡' },
                { key: 'water', translationKey: 'propertyDetail.amenities.water', icon: '💧' },
                { key: 'furnished', translationKey: 'propertyDetail.amenities.furnished', icon: '🛋️' },
                { key: 'parking', translationKey: 'propertyDetail.amenities.parking', icon: '🚗' },
                { key: 'security', translationKey: 'propertyDetail.amenities.security', icon: '🛡️' },
                { key: 'wifi', translationKey: 'propertyDetail.amenities.wifi', icon: '📶' },
                { key: 'ac', translationKey: 'propertyDetail.amenities.ac', icon: '❄️' },
                { key: 'tv', translationKey: 'propertyDetail.amenities.tv', icon: '📺' }
              ].map(({ key, translationKey, icon }) => (
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
                  <span className="font-medium">{t(translationKey)}</span>
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
                { key: 'market', label: t('browse.market'), icon: '🏪' },
                { key: 'bank', label: t('browse.bank'), icon: '🏦' },
                { key: 'transport', label: t('browse.transport'), icon: '🚌' }
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
