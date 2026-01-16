/**
 * PROPERTYCARD.TSX - REUSABLE PROPERTY DISPLAY COMPONENT
 * =====================================================
 * 
 * Kipengele cha kuonyesha nyumba - Reusable property display component
 * Modern Airbnb-inspired design with smooth animations
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReliableImage from '@/components/common/ReliableImage';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  images,
  bedrooms,
  bathrooms,
  squareMeters,
  isFavorited = false,
  onToggleFavorite,
  viewMode = 'grid'
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden transition-all duration-300 border border-gray-100 
                       hover:border-gray-200 hover:shadow-xl bg-white rounded-2xl">
        <Link to={`/property/${id}`} className="block">
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="w-full sm:w-80 h-52 sm:h-56 flex-shrink-0 relative overflow-hidden">
              <ReliableImage
                src={images[0] || `https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop`}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={400}
                height={300}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 
                  ${isFavorited 
                    ? 'bg-white text-red-500' 
                    : 'bg-white/80 text-gray-600 hover:text-red-500'
                  } hover:bg-white hover:scale-110 shadow-sm`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium line-clamp-1">{location}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
                  {title}
                </h3>

                {/* Amenities */}
                {(bedrooms || bathrooms || squareMeters) && (
                  <div className="flex items-center gap-4 text-gray-600">
                    {bedrooms && (
                      <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{bedrooms} bed</span>
                      </div>
                    )}
                    {bathrooms && (
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{bathrooms} bath</span>
                      </div>
                    )}
                    {squareMeters && (
                      <div className="flex items-center gap-1.5">
                        <Maximize className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{squareMeters}m²</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900">
                    TZS {price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // GRID VIEW (Default) - Modern Airbnb-style
  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/property/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          <ReliableImage
            src={images[currentImageIndex] || `https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={400}
            height={300}
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button - Always visible */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-300 z-10
              ${isFavorited 
                ? 'bg-white text-red-500 shadow-md' 
                : 'bg-white/90 text-gray-700 hover:text-red-500 shadow-sm'
              } hover:bg-white hover:scale-110`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>

          {/* Image Navigation - Show on hover when multiple images */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/95 
                           shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              >
                <ChevronLeft className="h-4 w-4 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/95 
                           shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              >
                <ChevronRight className="h-4 w-4 text-gray-800" />
              </button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
                    ${index === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/60 hover:bg-white/80'
                    }`}
                />
              ))}
              {images.length > 5 && (
                <span className="text-white text-xs ml-1">+{images.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="pt-3 space-y-1.5">
          {/* Location & Title Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-1 leading-tight">
                {title}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm line-clamp-1">{location}</span>
              </div>
            </div>
          </div>

          {/* Amenities Row */}
          {(bedrooms || bathrooms || squareMeters) && (
            <div className="flex items-center gap-3 text-gray-500">
              {bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{bedrooms}</span>
                </div>
              )}
              {bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{bathrooms}</span>
                </div>
              )}
              {squareMeters && (
                <div className="flex items-center gap-1">
                  <Maximize className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{squareMeters}m²</span>
                </div>
              )}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-base font-bold text-gray-900">
              TZS {price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">
              {t('propertyCard.perMonth')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
