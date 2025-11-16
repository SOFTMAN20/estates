/**
 * PROPERTYSEARCHBAR.TSX - PROPERTY SEARCH COMPONENT
 * =================================================
 * 
 * Reusable search bar component for property filtering
 * Modular, maintainable, and easy to use across different pages
 * 
 * FEATURES:
 * - Location search with icon
 * - Price range selector
 * - Advanced filters toggle
 * - Responsive design
 * - Customizable styling
 * 
 * BENEFITS:
 * - Modularity: Can be used in Browse, Home, or any page
 * - Reusability: Single source of truth for search UI
 * - Maintainability: Changes in one place affect all uses
 * - Readability: Clean, focused component
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PropertySearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onSearch?: () => void;
  className?: string;
}

const PropertySearchBar: React.FC<PropertySearchBarProps> = ({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  showFilters,
  onToggleFilters,
  onSearch,
  className = ''
}) => {
  const { t } = useTranslation();

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <Card className={`shadow-xl border-0 rounded-xl lg:rounded-2xl bg-white/95 backdrop-blur-sm ${className}`}>
      <CardContent className="p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4">
          {/* Location Search Input */}
          <div className="flex-1">
            <div className="relative border-2 border-gray-300 rounded-full hover:border-primary/50 transition-colors duration-200 focus-within:border-primary shadow-sm">
              <Input
                placeholder={t('browse.cityPlaceholder')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-4 sm:pl-5 lg:pl-6 pr-14 sm:pr-16 lg:pr-20 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
              />
              <button
                type="button"
                onClick={handleSearchClick}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2 sm:p-2.5 lg:p-3 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </button>
            </div>
          </div>

          {/* Price Range and Filters */}
          <div className="flex flex-row gap-2 sm:gap-4">
            {/* Price Range Selector */}
            <Select value={priceRange} onValueChange={onPriceRangeChange}>
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
              onClick={onToggleFilters}
              className="flex-1 h-10 sm:h-12 lg:h-14 min-w-0 border-2 border-gray-300 rounded-full hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center px-3 sm:px-4 transition-all duration-200 bg-white"
            >
              <SlidersHorizontal className="h-4 w-4 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-sm whitespace-nowrap">{t('browse.filters')}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySearchBar;
