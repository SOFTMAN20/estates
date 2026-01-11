
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
 * 
 * STATE MANAGEMENT / USIMAMIZI WA HALI:
 * - searchLocation: User's location input (Ingizo la eneo la mtumiaji)
 * - minPrice: Minimu=m price filter (Kichujio cha bei ya chini)
 * - maxPrice: Maximum price filter (Kichujio cha bei ya juu)
 * 
 * USER JOURNEY / SAFARI YA MTUMIAJI:
 * 1. User lands on homepage (Mtumiaji anafika ukurasa wa kwanza)
 * 2. Enters search criteria (Anaingiza vigezo vya utafutaji)
 * 3. Clicks search button (Anabonyeza kitufe cha utafutaji)
 * 4. Navigates to Browse page with filters (Anaenda ukurasa wa Browse na vichujio)
 * 
 * DESIGN FEATURES / VIPENGELE VYA MUUNDO:
 * - Background hero image (Picha ya nyuma ya kishujaa)
 * - Glassmorphism search card (Kadi ya utafutaji ya miwani)
 * - Responsive grid layout (Muundo wa gridi unaojibu)
 * - Animated statistics (Takwimu zenye mchoro)
 * - Enhanced visual hierarchy and animations
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';
import { useTranslation } from 'react-i18next';

/**
 * Hero Section Component
 * Kipengele cha sehemu ya kishujaa
 * 
 * This is the primary component that users see when they land on the homepage.
 * It combines search functionality with inspirational messaging and platform statistics.
 * 
 * Hiki ni kipengele kikuu ambacho watumiaji wanaona wanapofikia ukurasa wa kwanza.
 * Kinaunganisha utendakazi wa utafutaji na ujumbe wa kuhamasisha na takwimu za jukwaa.
 */
const HeroSection = () => {
  // Search form state management
  // Usimamizi wa hali ya fomu ya utafutaji
  const { t } = useTranslation();
  const [searchLocation, setSearchLocation] = useState(''); // Location search input
  const [minPrice, setMinPrice] = useState('');           // Minimum price filter
  const [maxPrice, setMaxPrice] = useState('');           // Maximum price filter

  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
      {/* Hero Background Image - Picha ya nyuma ya kishujaa */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Dark overlay for text readability - Uwazi wa giza kwa kusoma vizuri */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Animated background elements for visual interest */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-serengeti-400/30 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-primary/15 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        {/* Main Hero Content - Maudhui makuu ya kishujaa */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 animate-fade-in pt-8 sm:pt-12 lg:pt-16">
          {/* Primary headline - Kichwa kikuu */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight px-2 sm:px-4">
            {t('homepage.heroTitle')}
            <span className="block text-primary drop-shadow-lg">{t('homepage.heroTitleHighlight')}</span>
          </h1>
          
          {/* Supporting message - Ujumbe wa kusaidia */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-2 sm:px-4 drop-shadow-md">
            {t('homepage.heroSubtitle')}
          </p>
        </div>

        {/* Enhanced Search Interface Card - Kadi ya kiolesura cha utafutaji */}
        <div className="max-w-5xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-md rounded-3xl
                           transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              {/* Mobile Layout - Vertical Stack */}
              <div className="lg:hidden space-y-5">
                {/* Location Search Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Tafuta eneo
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t('homepage.locationPlaceholder')}
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10 h-12 text-sm border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Price Range Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                      Bei ya chini
                    </label>
                    <Input
                      type="number"
                      placeholder="30,000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-12 text-sm border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                      Bei ya juu
                    </label>
                    <Input
                      type="number"
                      placeholder="1,000,000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-12 text-sm border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="pt-2">
                  <Link 
                    to={`/browse${searchLocation || minPrice || maxPrice ? '?' : ''}${searchLocation ? `location=${encodeURIComponent(searchLocation)}` : ''}${searchLocation && (minPrice || maxPrice) ? '&' : ''}${minPrice ? `minPrice=${minPrice}` : ''}${minPrice && maxPrice ? '&' : ''}${maxPrice ? `maxPrice=${maxPrice}` : ''}`}
                    className="w-full block"
                  >
                    <Button 
                      className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 
                                 text-white shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300">
                      <Search className="h-5 w-5 mr-2" />
                      Tafuta Nyumba
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Desktop Layout - Horizontal Row */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-end">
                {/* Location Search Input - Takes more space */}
                <div className="lg:col-span-5 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tafuta eneo
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t('homepage.locationPlaceholder')}
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-11 h-14 text-sm border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Minimum Price */}
                <div className="lg:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bei ya chini
                  </label>
                  <Input
                    type="number"
                    placeholder="30,000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-14 text-sm border-2 border-border focus:border-primary 
                               hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                  />
                </div>

                {/* Maximum Price */}
                <div className="lg:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bei ya juu
                  </label>
                  <Input
                    type="number"
                    placeholder="1,000,000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-14 text-sm border-2 border-border focus:border-primary 
                               hover:border-primary/50 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                  />
                </div>

                {/* Search Button */}
                <div className="lg:col-span-3">
                  <Link 
                    to={`/browse${searchLocation || minPrice || maxPrice ? '?' : ''}${searchLocation ? `location=${encodeURIComponent(searchLocation)}` : ''}${searchLocation && (minPrice || maxPrice) ? '&' : ''}${minPrice ? `minPrice=${minPrice}` : ''}${minPrice && maxPrice ? '&' : ''}${maxPrice ? `maxPrice=${maxPrice}` : ''}`}
                    className="w-full block"
                  >
                    <Button 
                      className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 
                                 text-white shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300">
                      <Search className="h-5 w-5 mr-2" />
                      Tafuta Nyumba
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Platform Statistics - Takwimu za jukwaa */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 text-center px-2 sm:px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Available Properties - Nyumba zinazopatikana */}
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.availableProperties')}</div>
          </div>
          
          {/* Major Cities Coverage - Miji mikuu */}
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-serengeti-400 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.majorCities')}</div>
          </div>
          
          {/* Happy Customers - Wateja wenye furaha */}
          <div className="bg-white/10 backdrop-blur-md rounded-md sm:rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 
                            bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              1000+
            </div>
            <div className="text-xs sm:text-sm text-white/80">{t('homepage.happyCustomers')}</div>
          </div>
          
          {/* Customer Support - Msaada wa wateja */}
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