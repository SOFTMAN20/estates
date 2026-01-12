/**
 * PROPERTYFILTERSPANEL.TSX - COMPACT FILTERS COMPONENT
 * ====================================================
 * 
 * Compact, user-friendly filters panel for property filtering
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
    <div className={`space-y-4 ${className}`}>
      {/* Property Type */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          {t('browse.propertyType')}
        </label>
        <Select value={propertyType} onValueChange={onPropertyTypeChange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('browse.allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('browse.allTypes')}</SelectItem>
            <SelectItem value="Apartment">🏢 {t('browse.apartment')}</SelectItem>
            <SelectItem value="House">🏡 {t('browse.house')}</SelectItem>
            <SelectItem value="Studio">🛋️ {t('browse.studio')}</SelectItem>
            <SelectItem value="Shared Room">🚪 {t('browse.room')}</SelectItem>
            <SelectItem value="Bedsitter">🛏️ {t('browse.bedsitter')}</SelectItem>
            <SelectItem value="Lodge">🏨 {t('browse.lodge')}</SelectItem>
            <SelectItem value="Hotel">🏩 {t('browse.hotel')}</SelectItem>
            <SelectItem value="Hostel">🏠 {t('browse.hostel')}</SelectItem>
            <SelectItem value="Office">🏢 {t('browse.office')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms & Bathrooms - Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            {t('browse.bedrooms')}
          </label>
          <Select value={bedrooms} onValueChange={onBedroomsChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={t('browse.any')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('browse.any')}</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            {t('browse.bathrooms')}
          </label>
          <Select value={bathrooms} onValueChange={onBathroomsChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={t('browse.any')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('browse.any')}</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          💰 {t('browse.customPrice')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          {t('browse.sortBy')}
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('browse.newest')}</SelectItem>
            <SelectItem value="price-low">{t('browse.priceLow')}</SelectItem>
            <SelectItem value="price-high">{t('browse.priceHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3">
        <p className="text-xs font-medium text-gray-500 mb-2">{t('browse.amenitiesServices')}</p>
      </div>

      {/* Amenities - Compact Chips */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          Amenities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'electricity', label: '⚡ Electricity' },
            { key: 'water', label: '💧 Water' },
            { key: 'furnished', label: '🛋️ Furnished' },
            { key: 'parking', label: '🚗 Parking' },
            { key: 'security', label: '🛡️ Security' },
            { key: 'wifi', label: '📶 WiFi' },
            { key: 'ac', label: '❄️ AC' },
            { key: 'tv', label: '📺 TV' }
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onUtilityToggle(key)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                utilities.includes(key)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Services - Compact Chips */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          {t('browse.nearbyServices')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'school', label: '🏫 School' },
            { key: 'hospital', label: '🏥 Hospital' },
            { key: 'market', label: '🏪 Market' },
            { key: 'bank', label: '🏦 Bank' },
            { key: 'transport', label: '🚌 Transport' }
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNearbyServiceToggle(key)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                nearbyServices.includes(key)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Near University - For Students */}
      <div className="border-t border-gray-200 pt-3">
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          🎓 {t('browse.nearUniversity')}
        </label>
        <p className="text-[10px] text-gray-400 mb-2">{t('browse.nearUniversityHint')}</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'udsm', label: '🎓 UDSM' },
            { key: 'ardhi', label: '🎓 Ardhi' },
            { key: 'duce', label: '🎓 DUCE' },
            { key: 'kcmc', label: '🎓 KCMC' },
            { key: 'sua', label: '🎓 SUA' },
            { key: 'udom', label: '🎓 UDOM' },
            { key: 'must', label: '🎓 MUST' },
            { key: 'cbe', label: '🎓 CBE' },
            { key: 'ims', label: '🎓 IMS' },
            { key: 'out', label: '🎓 OUT' },
            { key: 'ifm', label: '🎓 IFM' },
            { key: 'cuom', label: '🎓 CUOM' },
            { key: 'dit', label: '🎓 DIT' },
            { key: 'atc', label: '🎓 ATC' },
            { key: 'muce', label: '🎓 MUCE' },
            { key: 'saut', label: '🎓 SAUT' },
            { key: 'tudarco', label: '🎓 TUDARCo' },
            { key: 'sjut', label: '🎓 SJUT' },
            { key: 'hkmu', label: '🎓 HKMU' },
            { key: 'irdp', label: '🎓 IRDP' },
            { key: 'mwecau', label: '🎓 MWECAU' },
            { key: 'rucu', label: '🎓 RUCU' }
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNearbyServiceToggle(key)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                nearbyServices.includes(key)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button - Sticky at bottom */}
      <div className="pt-3 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onClearAll} 
          className="w-full h-9 text-sm text-red-600 border-red-200 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1.5" />
          {t('browse.clearFilters')}
        </Button>
      </div>
    </div>
  );
};

export default PropertyFiltersPanel;
