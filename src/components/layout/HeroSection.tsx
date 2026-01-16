/**
 * HEROSECTION.TSX - MAIN SEARCH AND HERO COMPONENT
 * ================================================
 * 
 * Sehemu ya utafutaji mkuu wa Nyumba Link - Main search section for Nyumba Link
 * 
 * FUNCTIONALITY / KAZI:
 * - Primary landing section with search capabilities (Sehemu ya kwanza na utafutaji)
 * - Location-based property search (Utafutaji wa nyumba kulingana na eneo)
 * - Price range filtering (Kichujio cha bei)
 * - Hero banner with motivational messaging (Ujumbe wa kuhamasisha)
 * - Platform statistics display (Onyesho la takwimu za jukwaa)
 * - Mobile-optimized expandable search form
 * 
 * STATE MANAGEMENT / USIMAMIZI WA HALI:
 * - searchLocation: User's location input (Ingizo la eneo la mtumiaji)
 * - minPrice: Minimum price filter (Kichujio cha bei ya chini)
 * - maxPrice: Maximum price filter (Kichujio cha bei ya juu)
 * - isExpanded: Mobile search form expansion state
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, ChevronDown, ChevronUp, SlidersHorizontal, Building2, Home, Bed, DoorOpen, Castle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Property types for dropdown
  const propertyTypes = [
    { value: 'apartment', labelKey: 'propertyTypeFilters.apartment', icon: Building2 },
    { value: 'house', labelKey: 'propertyTypeFilters.house', icon: Home },
    { value: 'studio', labelKey: 'propertyTypeFilters.studio', icon: DoorOpen },
    { value: 'room', labelKey: 'propertyTypeFilters.room', icon: Bed },
    { value: 'villa', labelKey: 'propertyTypeFilters.villa', icon: Castle },
    { value: 'bedsitter', labelKey: 'propertyTypeFilters.bedsitter', icon: Users },
  ];

  // Build search URL with parameters
  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    // Only add propertyType if it's not empty and not "all"
    if (propertyType && propertyType !== 'all') params.append('propertyType', propertyType);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    return `/browse${params.toString() ? '?' + params.toString() : ''}`;
  };

  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-serengeti-400/30 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-primary/15 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        {/* Main Hero Content */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 animate-fade-in pt-8 sm:pt-12 lg:pt-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight px-2 sm:px-4">
            {t('homepage.heroTitle')}
            <span className="block text-primary drop-shadow-lg">{t('homepage.heroTitleHighlight')}</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-2 sm:px-4 drop-shadow-md">
            {t('homepage.heroSubtitle')}
          </p>
        </div>

        {/* Search Interface Card */}
        <div className="max-w-5xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-md rounded-3xl
                           transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              
              {/* ========== MOBILE LAYOUT - Expandable Search ========== */}
              <div className="lg:hidden">
                {/* Collapsed State - Single Search Bar */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder={t('homepage.locationPlaceholder')}
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        className="pl-11 pr-4 h-14 text-base border-2 border-border focus:border-primary 
                                   hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 
                                   focus-visible:ring-offset-0 rounded-2xl"
                      />
                    </div>
                    
                    {/* Quick Search Button (when collapsed) */}
                    {!isExpanded && (
                      <Link to={buildSearchUrl()}>
                        <Button 
                          className="h-14 w-14 bg-primary hover:bg-primary/90 text-white shadow-lg 
                                     rounded-2xl transition-all duration-300 flex-shrink-0">
                          <Search className="h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                    
                    {/* Expand/Collapse Toggle */}
                    <Button
                      variant="outline"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className={`h-14 w-14 border-2 rounded-2xl transition-all duration-300 flex-shrink-0
                                  ${isExpanded ? 'border-primary bg-primary/5 text-primary' : 'border-border text-gray-500'}`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <SlidersHorizontal className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Filter indicator badge */}
                  {(minPrice || maxPrice) && !isExpanded && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold 
                                    w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                      {(minPrice ? 1 : 0) + (maxPrice ? 1 : 0)}
                    </div>
                  )}
                </div>

                {/* Expanded State - Property Type & Price Filters */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    {/* Price Range Header */}
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>{t('homepage.mobileFilters')}</span>
                    </div>
                    
                    {/* Property Type Dropdown */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        {t('homepage.propertyType')}
                      </label>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger className="h-12 text-sm border-2 border-border focus:border-primary 
                                                   hover:border-primary/50 transition-all duration-300 rounded-xl">
                          <SelectValue placeholder={t('homepage.allTypes')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('homepage.allTypes')}</SelectItem>
                          {propertyTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{t(type.labelKey)}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Price Range Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {t('homepage.minPrice')}
                        </label>
                        <Input
                          type="number"
                          placeholder="30,000"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="h-12 text-sm border-2 border-border focus:border-primary 
                                     hover:border-primary/50 transition-all duration-300 
                                     focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {t('homepage.maxPrice')}
                        </label>
                        <Input
                          type="number"
                          placeholder="1,000,000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="h-12 text-sm border-2 border-border focus:border-primary 
                                     hover:border-primary/50 transition-all duration-300 
                                     focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <Link to={buildSearchUrl()} className="block">
                      <Button 
                        className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 
                                   text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300">
                        <Search className="h-5 w-5 mr-2" />
                        {t('homepage.searchButton')}
                      </Button>
                    </Link>
                    
                    {/* Clear Filters */}
                    {(minPrice || maxPrice || propertyType) && (
                      <button
                        onClick={() => { setMinPrice(''); setMaxPrice(''); setPropertyType(''); }}
                        className="w-full text-sm text-gray-500 hover:text-primary transition-colors py-1"
                      >
                        {t('homepage.clearFilters')}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ========== DESKTOP LAYOUT - Horizontal Row ========== */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-end">
                {/* Location Search Input */}
                <div className="lg:col-span-4 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('homepage.searchLocation')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t('homepage.locationPlaceholder')}
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-11 h-14 text-sm border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 
                                 focus-visible:ring-offset-0 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Property Type Dropdown */}
                <div className="lg:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('homepage.propertyType')}
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-14 text-sm border-2 border-border focus:border-primary 
                                               hover:border-primary/50 transition-all duration-300 rounded-2xl">
                      <SelectValue placeholder={t('homepage.allTypes')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('homepage.allTypes')}</SelectItem>
                      {propertyTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{t(type.labelKey)}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Minimum Price */}
                <div className="lg:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('homepage.minPrice')}
                  </label>
                  <Input
                    type="number"
                    placeholder="30,000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-14 text-sm border-2 border-border focus:border-primary 
                               hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 
                               focus-visible:ring-offset-0 rounded-2xl"
                  />
                </div>

                {/* Maximum Price */}
                <div className="lg:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('homepage.maxPrice')}
                  </label>
                  <Input
                    type="number"
                    placeholder="1,000,000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-14 text-sm border-2 border-border focus:border-primary 
                               hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 
                               focus-visible:ring-offset-0 rounded-2xl"
                  />
                </div>

                {/* Search Button */}
                <div className="lg:col-span-2">
                  <Link to={buildSearchUrl()} className="w-full block">
                    <Button 
                      className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 
                                 text-white shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300">
                      <Search className="h-5 w-5 mr-2" />
                      {t('homepage.searchButton')}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 text-center px-2 sm:px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.availableProperties')}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-serengeti-400 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.majorCities')}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              1000+
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.happyCustomers')}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-serengeti-400 bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.quickSupport')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
