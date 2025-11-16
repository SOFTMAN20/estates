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
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className={`mt-4 shadow-xl border-0 rounded-xl bg-white/95 backdrop-blur-sm ${className}`}>
      <CardContent className="p-3 sm:p-4 lg:p-6">
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
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
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
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  className="w-full"
                />
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
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={utilities.includes(key)}
                    onChange={() => onUtilityToggle(key)}
                    className="mr-3 w-4 h-4 text-primary cursor-pointer"
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
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nearbyServices.includes(key)}
                    onChange={() => onNearbyServiceToggle(key)}
                    className="mr-3 w-4 h-4 text-primary cursor-pointer"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">{t('browse.sortBy')}</h4>
            <Select value={sortBy} onValueChange={onSortChange}>
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
          <Button 
            variant="ghost" 
            onClick={onClearAll} 
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            {t('browse.clearFilters')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFiltersPanel;
