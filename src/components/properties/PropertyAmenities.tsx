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
 * Maps amenity keys to their icons, labels, and colors
 * Matches the AmenitiesSelector configuration
 */
const amenityConfig: Record<string, AmenityConfig> = {
  electricity: {
    icon: Zap,
    label: 'Umeme',
    colorClass: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  },
  water: {
    icon: Droplets,
    label: 'Maji',
    colorClass: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  furnished: {
    icon: Sofa,
    label: 'Samani',
    colorClass: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  parking: {
    icon: Car,
    label: 'Maegesho',
    colorClass: 'bg-green-50 text-green-600 border-green-200',
  },
  security: {
    icon: Shield,
    label: 'Usalama',
    colorClass: 'bg-red-50 text-red-600 border-red-200',
  },
  wifi: {
    icon: Wifi,
    label: 'WiFi',
    colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  ac: {
    icon: Wind,
    label: 'AC',
    colorClass: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  tv: {
    icon: Tv,
    label: 'TV',
    colorClass: 'bg-pink-50 text-pink-600 border-pink-200',
  },
};

/**
 * Get amenity configuration based on key
 */
const getAmenityConfig = (amenity: string): AmenityConfig => {
  const lowerAmenity = amenity.toLowerCase();

  // Check for exact match
  if (amenityConfig[lowerAmenity]) {
    return amenityConfig[lowerAmenity];
  }

  // Check for partial match
  for (const [key, config] of Object.entries(amenityConfig)) {
    if (lowerAmenity.includes(key) || key.includes(lowerAmenity)) {
      return config;
    }
  }

  // Default configuration
  return {
    icon: Sparkles,
    label: amenity,
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
  const [showAllModal, setShowAllModal] = useState(false);
  const PREVIEW_LIMIT = 10;

  // Handle empty state
  if (!amenities || amenities.length === 0) {
    return null;
  }

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
            const config = getAmenityConfig(amenity);
            const Icon = config.icon;

            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md ${config.colorClass}`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium break-words">
                  {config.label}
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
              const config = getAmenityConfig(amenity);
              const Icon = config.icon;

              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md ${config.colorClass}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium break-words">
                    {config.label}
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
