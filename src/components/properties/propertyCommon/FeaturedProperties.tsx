import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Bed, Bath, Maximize, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties, type Property } from '@/hooks/useProperties';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { PropertyGridSkeleton } from '@/components/properties/propertyCommon/PropertyCardSkeleton';
import { useTranslation } from 'react-i18next';

/**
 * INDIVIDUAL PROPERTY CARD COMPONENT WITH MOBILE TOUCH
 * ===================================================
 * 
 * Wrapper component that handles mobile touch functionality
 * for each individual property card in the featured section.
 */
interface FeaturedPropertyCardProps {
  property: Property;
  index: number;
  t: (key: string) => string;
}

const FeaturedPropertyCard = ({ property, index, t }: FeaturedPropertyCardProps) => {
  const [showMobileActions, setShowMobileActions] = useState(false);

  /**
   * MOBILE TOUCH HANDLER
   * ===================
   * 
   * Shows action buttons when user taps on mobile devices.
   * Auto-hides after 3 seconds for clean UX.
   * Does NOT prevent navigation - allows clicking anywhere to go to details.
   */
  const handleMobileTouch = (e: React.TouchEvent | React.MouseEvent) => {
    // Don't prevent default - allow navigation to work
    setShowMobileActions(true);

    // Auto-hide buttons after 3 seconds
    setTimeout(() => {
      setShowMobileActions(false);
    }, 3000);
  };

  return (
    <Card key={property.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 
                       bg-white hover:border-primary/30 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-serengeti-500/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 rounded-xl">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-t-xl"
            onTouchStart={handleMobileTouch}
            onClick={handleMobileTouch}
          >
            <img
              src={property.images && property.images.length > 0
                ? property.images[0]
                : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop'
              }
              alt={property.title}
              className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Enhanced Featured Badge */}
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 text-white z-20 shadow-lg border border-white/20 backdrop-blur-sm font-bold text-xs px-3 py-1 transform group-hover:scale-105 transition-transform duration-300">
            ⭐ {t('featuredProperties.featured')}
          </Badge>
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center z-20 shadow-lg border border-yellow-200/50 transform group-hover:scale-105 transition-transform duration-300">
            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
            <span className="text-xs font-bold text-gray-800">4.8</span>
          </div>

          {/* Enhanced hover overlay with quick view icon - shows on hover OR mobile touch */}
          <div className={`absolute inset-0 transition-all duration-500 z-10 ${showMobileActions
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100'
            }`}>
            <div className="absolute bottom-3 right-3">
              <div className="bg-white/95 rounded-full p-1.5 transform hover:scale-110 transition-all duration-300 shadow-lg">
                <Eye className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-2 sm:p-4">
          <div className="space-y-1.5 sm:space-y-2">
            {/* TITLE */}
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            
            {/* LOCATION */}
            <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>

            {/* AMENITIES */}
            {(property.bedrooms || property.bathrooms || property.square_meters) && (
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Bed className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="text-xs sm:text-sm font-medium">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Bath className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="text-xs sm:text-sm font-medium">{property.bathrooms}</span>
                  </div>
                )}
                {property.square_meters && (
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Maximize className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="text-xs sm:text-sm font-medium">{property.square_meters}m²</span>
                  </div>
                )}
              </div>
            )}

            {/* PRICE */}
            <div className="pt-0.5 sm:pt-1">
              <div className="flex items-baseline flex-nowrap whitespace-nowrap">
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  TZS {Number(property.price).toLocaleString()}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm ml-1">/month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const { data: allProperties = [], isLoading, error } = useProperties();

  // Get featured properties - 8 for mobile, 16 for desktop
  const isMobile = window.innerWidth < 768; // md breakpoint
  const propertyLimit = isMobile ? 8 : 16;
  const typedProperties = allProperties as Property[];
  const properties = typedProperties.slice(0, propertyLimit);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('featuredProperties.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('featuredProperties.subtitle')}
            </p>
          </div>

          {/* Skeleton Loading Grid */}
          <PropertyGridSkeleton
            count={8}
            viewMode="grid"
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('featuredProperties.loadingError')}
            </h2>
            <p className="text-gray-600">
              {t('featuredProperties.tryAgain')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50 relative overflow-hidden">
      {/* Background Pattern for Visual Interest */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-serengeti-100 to-transparent rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent mb-2">
            {t('featuredProperties.title')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t('featuredProperties.subtitle')}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {properties.map((property, index) => (
              <FeaturedPropertyCard
                key={property.id}
                property={property}
                index={index}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t('featuredProperties.noProperties')}
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/browse">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              {t('featuredProperties.viewMore')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;