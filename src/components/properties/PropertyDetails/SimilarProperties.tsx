/**
 * SIMILARPROPERTIES.TSX - RELATED PROPERTIES SECTION
 * ==================================================
 * 
 * Displays similar properties based on location, type, and price range
 * Helps users discover alternative options
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import type { Property } from '@/hooks/useProperties';

interface SimilarPropertiesProps {
  currentPropertyId: string;
  location: string;
  propertyType: string;
  price: number;
  allProperties: Property[];
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentPropertyId,
  location,
  propertyType,
  price,
  allProperties,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Filter and sort similar properties
   * Priority: Same location > Same type > Similar price
   */
  const getSimilarProperties = (): Property[] => {
    // Filter out current property
    const otherProperties = allProperties.filter(p => p.id !== currentPropertyId);

    // Score each property based on similarity
    const scoredProperties = otherProperties.map(property => {
      let score = 0;

      // Same location (highest priority)
      if (property.location === location) {
        score += 100;
      } else if (property.location.toLowerCase().includes(location.toLowerCase()) || 
                 location.toLowerCase().includes(property.location.toLowerCase())) {
        score += 50;
      }

      // Same property type
      if (property.property_type === propertyType) {
        score += 50;
      }

      // Similar price (within 30% range)
      const priceDiff = Math.abs(Number(property.price) - price);
      const priceRange = price * 0.3;
      if (priceDiff <= priceRange) {
        score += 30;
      }

      return { property, score };
    });

    // Sort by score and return top 4
    return scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.property);
  };

  const similarProperties = getSimilarProperties();

  // Don't render if no similar properties found
  if (similarProperties.length === 0) {
    return null;
  }

  /**
   * Format currency
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  /**
   * Handle property card click
   */
  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-8 sm:mt-12">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('propertyDetail.similarProperties.title', 'Similar Properties')}
        </h2>
        <p className="text-gray-600">
          {t('propertyDetail.similarProperties.subtitle', 'You might also be interested in these properties')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {similarProperties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => handlePropertyClick(property.id)}
          >
            {/* Property Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={
                  property.images && property.images.length > 0
                    ? property.images[0]
                    : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'
                }
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Property Type Badge */}
              <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white">
                {property.property_type}
              </Badge>
            </div>

            <CardContent className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {property.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm truncate">{property.location}</span>
              </div>

              {/* Features */}
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.square_meters && (
                  <div className="flex items-center">
                    <Maximize className="h-4 w-4 mr-1" />
                    <span>{property.square_meters}m²</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(Number(property.price))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('propertyDetail.similarProperties.perMonth', 'per month')}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropertyClick(property.id);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/browse')}
          className="group"
        >
          {t('propertyDetail.similarProperties.viewAll', 'View All Properties')}
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default SimilarProperties;
