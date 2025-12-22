/**
 * NAVBARSEARCHBAR.TSX - YOUTUBE-STYLE SEARCH BAR
 * ==============================================
 * 
 * YouTube-inspired search bar for the main navigation
 * Centered, prominent search with clean design
 * 
 * SEARCH CAPABILITIES:
 * - Search by location (area, town, city, region)
 * - Search by price (e.g., "500000", "under 1000000")
 * - Intelligent parsing of search queries
 * - URL parameter passing to Browse page
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavbarSearchBarProps {
  className?: string;
}

interface SearchSuggestion {
  icon: React.ReactNode;
  text: string;
  description: string;
  category: 'location' | 'price' | 'combined';
}

/**
 * Parse search query to extract location and price information
 * Supports queries like:
 * - "Dar es Salaam" (location only)
 * - "500000" (price only)
 * - "Kinondoni under 800000" (location + price)
 * - "price 1000000" (price with keyword)
 */
const parseSearchQuery = (query: string): { location?: string; minPrice?: string; maxPrice?: string } => {
  const trimmedQuery = query.trim();
  
  // Check if query contains only numbers (price search)
  if (/^\d+$/.test(trimmedQuery)) {
    return { maxPrice: trimmedQuery };
  }
  
  // Check for price keywords with numbers
  const priceMatch = trimmedQuery.match(/(?:price|under|below|max|up to)\s*(\d+)/i);
  const minPriceMatch = trimmedQuery.match(/(?:above|over|min|from)\s*(\d+)/i);
  
  let location = trimmedQuery;
  let maxPrice: string | undefined;
  let minPrice: string | undefined;
  
  if (priceMatch) {
    maxPrice = priceMatch[1];
    // Remove price part from location
    location = location.replace(priceMatch[0], '').trim();
  }
  
  if (minPriceMatch) {
    minPrice = minPriceMatch[1];
    // Remove price part from location
    location = location.replace(minPriceMatch[0], '').trim();
  }
  
  return {
    location: location || undefined,
    minPrice,
    maxPrice
  };
};

const NavbarSearchBar: React.FC<NavbarSearchBarProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Search suggestions with popular searches
  const suggestions: SearchSuggestion[] = [
    {
      icon: <MapPin className="h-4 w-4 text-orange-500" />,
      text: 'Kinondoni',
      description: 'Popular area in Dar es Salaam',
      category: 'location'
    },
    {
      icon: <MapPin className="h-4 w-4 text-orange-500" />,
      text: 'Ilala',
      description: 'Central district',
      category: 'location'
    },
    {
      icon: <MapPin className="h-4 w-4 text-orange-500" />,
      text: 'Temeke',
      description: 'Industrial area',
      category: 'location'
    },
    {
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      text: '500000',
      description: 'Under TZS 500,000',
      category: 'price'
    },
    {
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      text: 'under 1000000',
      description: 'Under TZS 1,000,000',
      category: 'price'
    },
    {
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      text: 'above 800000',
      description: 'Above TZS 800,000',
      category: 'price'
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      text: 'Kinondoni under 800000',
      description: 'Area + price range',
      category: 'combined'
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      text: 'Ilala above 500000',
      description: 'Area + minimum price',
      category: 'combined'
    }
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query?: string) => {
    const searchText = query || searchQuery;
    if (searchText.trim()) {
      const { location, minPrice, maxPrice } = parseSearchQuery(searchText);
      
      // Build URL parameters
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      
      navigate(`/browse?${params.toString()}`);
      setShowSuggestions(false);
    } else {
      navigate('/browse');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setSearchQuery(suggestionText);
    handleSearch(suggestionText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative flex items-center w-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isFocused 
          ? 'max-w-[280px] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl' 
          : 'max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl'
      } ${className}`}
    >
      {/* Search Input Container with Button Inside */}
      <div className={`flex items-center flex-1 border border-gray-300 rounded-full overflow-hidden bg-white hover:border-gray-400 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300/50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isFocused ? 'shadow-xl scale-[1.02]' : 'shadow-sm'
      }`}>
        <Input
          type="text"
          placeholder={t('browse.cityPlaceholder') || 'Search by location, price, property...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowSuggestions(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            // Small delay to allow suggestion clicks
            setTimeout(() => setIsFocused(false), 150);
          }}
          className={`flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 transition-all duration-150 ${
            isFocused ? 'text-sm md:text-base' : 'text-sm'
          }`}
        />
        
        {/* Search Button - Circular Icon Inside */}
        <Button
          onClick={() => handleSearch()}
          className="rounded-full w-9 h-9 p-0 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 mr-1.5 flex items-center justify-center transition-all duration-200"
          variant="ghost"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          <div className="p-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
              Search Examples
            </div>
            
            {/* Location Suggestions */}
            <div className="mb-2">
              <div className="text-xs font-medium text-gray-400 px-3 py-1">By Location</div>
              {suggestions.filter(s => s.category === 'location').map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors text-left group"
                >
                  <div className="flex-shrink-0">{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500">{suggestion.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Price Suggestions */}
            <div className="mb-2">
              <div className="text-xs font-medium text-gray-400 px-3 py-1">By Price</div>
              {suggestions.filter(s => s.category === 'price').map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-lg transition-colors text-left group"
                >
                  <div className="flex-shrink-0">{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-green-600">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500">{suggestion.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Combined Suggestions */}
            <div>
              <div className="text-xs font-medium text-gray-400 px-3 py-1">Combined Search</div>
              {suggestions.filter(s => s.category === 'combined').map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                >
                  <div className="flex-shrink-0">{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500">{suggestion.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarSearchBar;
