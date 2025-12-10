/**
 * PROPERTYAMENITIES.TSX - PROPERTY AMENITIES DISPLAY COMPONENT
 * ===========================================================
 * 
 * A reusable component for displaying property amenities in a clean,
 * organized grid layout with icons and proper styling.
 * 
 * FEATURES:
 * - Displays all property amenities from database
 * - Responsive grid layout
 * - Icon-based visual representation
 * - "Show all amenities" modal dialog
 * - Handles empty state gracefully
 * - Fully translatable
 * 
 * USAGE:
 * <PropertyAmenities amenities={property.amenities} />
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Wifi,
  Tv,
  Wind,
  Zap,
  Droplets,
  Sofa,
  Car,
  Shield,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PropertyAmenitiesProps {
  amenities?: string[] | null;
  className?: string;
}

interface AmenityConfig {
  icon: LucideIcon;
  label: string;
  colorClass: string;
}

/**
 * AMENITY ICON MAPPING
 * ===================
 * Maps amenity keys to their icons and colors
 * Labels are now handled via translations
 */
const getAmenityIconConfig = (amenity: string): { icon: LucideIcon; colorClass: string } => {
  const amenityMap: Record<string, { icon: LucideIcon; colorClass: string }> = {
    electricity: {
      icon: Zap,
      colorClass: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    },
    water: {
      icon: Droplets,
      colorClass: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    furnished: {
      icon: Sofa,
      colorClass: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    parking: {
      icon: Car,
      colorClass: 'bg-green-50 text-green-600 border-green-200',
    },
    security: {
      icon: Shield,
      colorClass: 'bg-red-50 text-red-600 border-red-200',
    },
    wifi: {
      icon: Wifi,
      colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    ac: {
      icon: Wind,
      colorClass: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    tv: {
      icon: Tv,
      colorClass: 'bg-pink-50 text-pink-600 border-pink-200',
    },
  };

  const lowerAmenity = amenity.toLowerCase();

  // Check for exact match
  if (amenityMap[lowerAmenity]) {
    return amenityMap[lowerAmenity];
  }

  // Check for partial match
  for (const [key, config] of Object.entries(amenityMap)) {
    if (lowerAmenity.includes(key) || key.includes(lowerAmenity)) {
      return config;
    }
  }

  // Default configuration
  return {
    icon: Sparkles,
    colorClass: 'bg-gray-50 text-gray-600 border-gray-200',
  };
};

/**
 * PROPERTY AMENITIES COMPONENT
 * ===========================
 */
const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({
  amenities,
  className = '',
}) => {
  const { t } = useTranslation();
  const [showAllModal, setShowAllModal] = useState(false);
  const PREVIEW_LIMIT = 10;

  // Handle empty state
  if (!amenities || amenities.length === 0) {
    return null;
  }

  /**
   * Get translated label for amenity
   * Uses translation keys from propertyDetail.amenities
   */
  const getAmenityLabel = (amenity: string): string => {
    const lowerAmenity = amenity.toLowerCase();
    
    // Map amenity keys to translation keys
    const translationMap: Record<string, string> = {
      electricity: 'propertyDetail.amenities.electricity',
      water: 'propertyDetail.amenities.water',
      furnished: 'propertyDetail.amenities.furnished',
      parking: 'propertyDetail.amenities.parking',
      security: 'propertyDetail.amenities.security',
      wifi: 'propertyDetail.amenities.wifi',
      ac: 'propertyDetail.amenities.ac',
      tv: 'propertyDetail.amenities.tv',
    };

    // Return translated label or fallback to original amenity name
    return translationMap[lowerAmenity] ? t(translationMap[lowerAmenity]) : amenity;
  };

  const previewAmenities = amenities.slice(0, PREVIEW_LIMIT);
  const hasMore = amenities.length > PREVIEW_LIMIT;

  return (
    <>
      <div className={`overflow-hidden ${className}`}>
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          What this place offers
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {previewAmenities.map((amenity, index) => {
            const iconConfig = getAmenityIconConfig(amenity);
            const Icon = iconConfig.icon;
            const label = getAmenityLabel(amenity);

            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md ${iconConfig.colorClass}`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium break-words">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <Button
            variant="outline"
            onClick={() => setShowAllModal(true)}
            className="border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold px-6 py-5 rounded-lg"
          >
            Show all {amenities.length} amenities
          </Button>
        )}
      </div>

      {/* All Amenities Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              What this place offers
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            {amenities.map((amenity, index) => {
              const iconConfig = getAmenityIconConfig(amenity);
              const Icon = iconConfig.icon;
              const label = getAmenityLabel(amenity);

              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md ${iconConfig.colorClass}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium break-words">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyAmenities;
