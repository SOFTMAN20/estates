/**
 * PROPERTYCARD.TSX - REUSABLE PROPERTY DISPLAY COMPONENT
 * =====================================================
 * 
 * Kipengele cha kuonyesha nyumba - Reusable property display component
 * 
 * ARCHITECTURE / MUUNDO:
 * This is a highly reusable component that can display property information
 * in multiple formats (grid/list) across different pages of the application.
 * 
 * DESIGN PATTERNS / MIFUMO YA MUUNDO:
 * - Compound component pattern for flexible layouts
 * - Prop-based configuration for different use cases
 * - Event delegation for user interactions
 * - Responsive design with mobile-first approach
 * 
 * FEATURES / VIPENGELE:
 * - Dual view modes (grid and list)
 * - Interactive image carousel
 * - Favorite toggle functionality
 * - Direct WhatsApp integration
 * - Responsive design for all devices
 * - Accessibility features
 * - Enhanced hover effects and visual appeal
 * 
 * SCALABILITY / UKUAJI:
 * - Easy to extend with new view modes
 * - Configurable through props
 * - Reusable across different pages
 * - Can be enhanced with additional features
 * 
 * PERFORMANCE / UTENDAJI:
 * - Optimized image loading
 * - Minimal re-renders through proper state management
 * - Efficient event handling
 * - Lazy loading support ready
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Zap, Droplets, Bed, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReliableImage from '@/components/common/ReliableImage';

/**
 * PROPERTY CARD PROPS INTERFACE
 * ============================
 * 
 * Defines the contract for PropertyCard component props.
 * Ensures type safety and clear API for component usage.
 * 
 * REQUIRED PROPS / VIPENGELE VINAVYOHITAJIKA:
 * - id: Unique property identifier for routing
 * - title: Property name/title for display
 * - price: Monthly rent amount in TZS
 * - location: Property location string
 * - images: Array of image URLs
 * 
 * OPTIONAL PROPS / VIPENGELE VYA HIARI:
 * - phone: Landlord contact number
 * - isFavorited: Current favorite status
 * - onToggleFavorite: Callback for favorite toggle
 * - viewMode: Display format (grid or list)
 * 
 * EXTENSIBILITY / UWEZEKANO WA KUONGEZA:
 * - Easy to add new props without breaking existing usage
 * - Optional props provide flexibility
 * - Type safety prevents runtime errors
 */
interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  phone?: string;
  contactPhone?: string;
  contactWhatsappPhone?: string;
  electricity?: boolean;
  water?: boolean;
  bedrooms?: number;
  averageRating?: number;
  totalReviews?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

/**
 * PROPERTY CARD COMPONENT
 * ======================
 * 
 * Main component function that renders property information
 * in either grid or list format based on viewMode prop.
 * 
 * STATE MANAGEMENT / USIMAMIZI WA HALI:
 * - currentImageIndex: Tracks which image is currently displayed
 * - Local state for image carousel functionality
 * 
 * CONDITIONAL RENDERING / UONYESHAJI WA MASHARTI:
 * - Different layouts based on viewMode prop
 * - Responsive behavior for different screen sizes
 * - Graceful handling of missing data
 * 
 * USER INTERACTIONS / MWINGILIANO WA MTUMIAJI:
 * - Image carousel navigation
 * - Favorite toggle with callback
 * - WhatsApp contact integration
 * - Navigation to property details
 */
const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  images,
  phone,
  contactPhone,
  contactWhatsappPhone,
  electricity,
  water,
  bedrooms,
  averageRating,
  totalReviews,
  isFavorited = false,
  onToggleFavorite,
  viewMode = 'grid'
}) => {
  const { t } = useTranslation();

  /**
   * IMAGE CAROUSEL STATE
   * ===================
   * 
   * Manages which image is currently displayed in the carousel.
   * Starts at index 0 and cycles through available images.
   * 
   * USAGE / MATUMIZI:
   * - Updated by image navigation buttons
   * - Used to display current image
   * - Enables smooth image transitions
   */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  /**
   * FAVORITE TOGGLE HANDLER
   * ======================
   * 
   * Handles favorite button clicks with proper event handling.
   * 
   * EVENT HANDLING / KUSHUGHULIKIA MATUKIO:
   * - preventDefault: Stops link navigation
   * - stopPropagation: Prevents event bubbling
   * - Calls parent callback if provided
   * 
   * ACCESSIBILITY / UFIKIVU:
   * - Keyboard accessible
   * - Screen reader friendly
   * - Clear visual feedback
   */
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  /**
   * LIST VIEW RENDERING
   * ==================
   * 
   * Renders property card in horizontal list format.
   * Optimized for desktop viewing with more details.
   * 
   * LAYOUT / MPANGILIO:
   * - Horizontal flex layout
   * - Fixed image width (320px)
   * - Expanded content area
   * - Enhanced information display
   * 
   * FEATURES / VIPENGELE:
   * - Larger image display
   * - More detailed information
   * - Better for comparison viewing
   * - Desktop-optimized layout
   */
  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white">
        <Link to={`/property/${id}`} className="block touch-manipulation">
          <div className="flex flex-col sm:flex-row">
            {/* LIST VIEW IMAGE SECTION */}
            <div 
              className="w-full sm:w-80 h-48 sm:h-60 flex-shrink-0 relative overflow-hidden"
            >
              <ReliableImage
                src={images[0] || `https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop`}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                width={400}
                height={300}
              />
              
              {/* Enhanced overlay with quick view icon - shows on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/95 rounded-full p-1.5 transform hover:scale-110 transition-all duration-300 shadow-lg">
                    <Eye className="w-4 h-4 text-gray-900" />
                  </div>
                </div>
              </div>
              
              {/* FAVORITE BUTTON - LIST VIEW */}
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                  isFavorited ? 'text-red-500 bg-white/95' : 'text-white bg-black/30'
                } hover:text-red-500 hover:bg-white/95 transform hover:scale-110`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>

              {/* PRICE OVERLAY - LIST VIEW */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                <Badge className="bg-white/95 text-gray-900 font-bold text-sm sm:text-base px-2 sm:px-3 py-1 shadow-lg 
                                  border border-gray-200 transform group-hover:scale-105 transition-transform duration-300">
                  TZS {price.toLocaleString()}/mwezi
                </Badge>
              </div>
            </div>

            {/* LIST VIEW CONTENT SECTION */}
            <div className="flex-1 p-3 sm:p-4 lg:p-6">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-primary group-hover:text-gray-900 transition-colors duration-300 line-clamp-1">
                    {title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1 group-hover:text-gray-700 transition-colors duration-300">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="line-clamp-1">{location}</span>
                  </div>
                </div>

                {/* RATING AND AMENITIES SECTION */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {averageRating && totalReviews && totalReviews > 0 && (
                    <div className="flex items-center text-yellow-600 group-hover:text-yellow-700 transition-colors duration-300">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 fill-current" />
                      <span className="text-xs sm:text-sm font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">({totalReviews})</span>
                    </div>
                  )}
                  {electricity && (
                    <div className="flex items-center text-green-600 group-hover:text-green-700 transition-colors duration-300" title="Umeme">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm font-medium">{t('propertyCard.electricity')}</span>
                    </div>
                  )}
                  {water && (
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300" title="Maji">
                      <Droplets className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm font-medium">{t('propertyCard.water')}</span>
                    </div>
                  )}
                  {bedrooms && bedrooms > 0 && (
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300" title="Vyumba vya kulala">
                      <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm">{bedrooms} {t('propertyCard.bedrooms')}</span>
                    </div>
                  )}
                </div>



               
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  /**
   * GRID VIEW RENDERING (DEFAULT)
   * =============================
   * 
   * Renders property card in vertical grid format.
   * Optimized for mobile and grid layouts.
   * 
   * LAYOUT / MPANGILIO:
   * - Vertical card layout
   * - Square aspect ratio image
   * - Compact information display
   * - Mobile-first design
   * 
   * FEATURES / VIPENGELE:
   * - Image carousel with indicators
   * - Hover effects and animations
   * - Responsive design
   * - Touch-friendly interactions
   */
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 
                     border-0 shadow-lg bg-white hover:border-primary/20">
      <Link to={`/property/${id}`} className="block touch-manipulation">
        <div className="relative">
          {/* GRID VIEW IMAGE SECTION */}
          <div 
            className="aspect-[4/3] overflow-hidden relative"
          >
            <ReliableImage
              src={images[currentImageIndex] || `https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              width={400}
              height={300}
            />
            
            {/* Enhanced overlay with quick view icon - shows on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute bottom-3 right-3">
                <div className="bg-white/95 rounded-full p-1.5 transform hover:scale-110 transition-all duration-300 shadow-lg">
                  <Eye className="w-4 h-4 text-gray-900" />
                </div>
              </div>
            </div>
          </div>

          {/* IMAGE CAROUSEL INDICATORS */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* FAVORITE BUTTON - GRID VIEW */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
              isFavorited ? 'text-red-500 bg-white/95' : 'text-white bg-black/30'
            } hover:text-red-500 hover:bg-white/95 transform hover:scale-110`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Price badge overlay */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <Badge className="bg-white/95 text-gray-900 font-bold text-xs sm:text-sm px-2 py-1 shadow-lg 
                              border border-gray-200 transform group-hover:scale-105 transition-transform duration-300">
              TZS {price.toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* GRID VIEW CONTENT SECTION */}
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* TITLE AND LOCATION */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base line-clamp-1 text-primary group-hover:text-gray-900 transition-colors duration-300">
                {title}
              </h3>
              <div className="flex items-center text-gray-500 text-xs sm:text-sm group-hover:text-gray-600 transition-colors duration-300">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>

            {/* RATING AND AMENITIES DISPLAY */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {averageRating && totalReviews && totalReviews > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-50 text-yellow-800 
                                                     border border-yellow-200 group-hover:bg-yellow-100 transition-colors duration-300">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 fill-current" />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="ml-0.5 text-gray-600">({totalReviews})</span>
                </Badge>
              )}
              {electricity && (
                <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 
                                                     border border-green-200 group-hover:bg-green-200 transition-colors duration-300">
                  <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden sm:inline">{t('browse.electricity')}</span>
                  <span className="sm:hidden">⚡</span>
                </Badge>
              )}
              {water && (
                <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 
                                                     border border-blue-200 group-hover:bg-blue-200 transition-colors duration-300">
                  <Droplets className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden sm:inline">{t('browse.water')}</span>
                  <span className="sm:hidden">💧</span>
                </Badge>
              )}
              {bedrooms && bedrooms > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-800 
                                                     border border-gray-200 group-hover:bg-gray-200 transition-colors duration-300">
                  <Bed className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span>{bedrooms}</span>
                </Badge>
              )}
            </div>

            {/* PRICE SECTION */}
            <div className="pt-1">
              <div className="flex items-baseline">
                <span className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  TZS {price.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1 text-sm group-hover:text-gray-600 transition-colors duration-300">
                  {t('propertyCard.perMonth')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PropertyCard;
