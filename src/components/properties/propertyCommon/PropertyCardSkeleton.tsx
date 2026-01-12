/**
 * PROPERTY CARD SKELETON - MATCHING PROPERTYCARD LAYOUT
 * =====================================================
 * 
 * Skeleton loading component that exactly matches PropertyCard dimensions
 * Provides smooth loading experience with shimmer animation
 * 
 * FEATURES:
 * - Exact match to PropertyCard layout and dimensions
 * - Shimmer animation effect
 * - Responsive design for grid and list views
 * - Price badge and favorite button placeholders
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const PropertyCardSkeleton: React.FC<PropertyCardSkeletonProps> = ({ 
  viewMode = 'grid' 
}) => {
  if (viewMode === 'list') {
    // List View Skeleton - matches PropertyCard list layout
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-xl">
        <div className="flex flex-col sm:flex-row">
          {/* Image Section - matches sm:w-80 h-48 sm:h-60 */}
          <div className="w-full sm:w-80 h-48 sm:h-60 flex-shrink-0 relative overflow-hidden sm:rounded-l-xl bg-gray-200">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            
            {/* Favorite button placeholder */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300/50" />
            
            {/* Price badge placeholder */}
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 h-7 sm:h-8 w-32 sm:w-40 rounded bg-gray-300/50" />
          </div>

          {/* Content Section - matches p-3 sm:p-4 lg:p-6 */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="space-y-2 sm:space-y-3">
              {/* Title */}
              <div className="h-6 sm:h-7 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded" />
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded" />
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded" />
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View Skeleton - matches PropertyCard grid layout exactly
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-xl">
      <div className="relative">
        {/* Image Section - matches aspect-[4/3] rounded-t-xl */}
        <div className="aspect-[4/3] overflow-hidden relative rounded-t-xl bg-gray-200">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          
          {/* Price badge placeholder - top left */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 h-6 sm:h-7 w-20 sm:w-24 rounded bg-gray-300/50" />
          
          {/* Favorite button placeholder - top right */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300/50" />
          
          {/* Image carousel dots placeholder */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-300/50" />
            <div className="w-2 h-2 rounded-full bg-gray-300/30" />
            <div className="w-2 h-2 rounded-full bg-gray-300/30" />
          </div>
        </div>
      </div>

      {/* Content Section - matches p-3 sm:p-4 */}
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Title */}
          <div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-1 mt-1.5">
              <div className="h-3 w-3 bg-gray-200 rounded flex-shrink-0" />
              <div className="h-3 sm:h-3.5 bg-gray-200 rounded w-2/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Amenities - bedrooms, bathrooms, sqm */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 bg-gray-200 rounded" />
              <div className="h-3 sm:h-3.5 w-4 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 bg-gray-200 rounded" />
              <div className="h-3 sm:h-3.5 w-4 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 bg-gray-200 rounded" />
              <div className="h-3 sm:h-3.5 w-8 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Price Section */}
          <div className="pt-1">
            <div className="flex items-baseline gap-1">
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <div className="h-3 sm:h-3.5 bg-gray-200 rounded w-10" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * PROPERTY GRID SKELETON
 * =====================
 * 
 * Renders multiple skeleton cards in a grid layout
 * Grid columns match the Browse page layout (3 cols on lg with sidebar)
 */
interface PropertyGridSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export const PropertyGridSkeleton: React.FC<PropertyGridSkeletonProps> = ({ 
  count = 12, 
  viewMode = 'grid' 
}) => {
  return (
    <div className={`grid gap-3 sm:gap-4 lg:gap-5 ${
      viewMode === 'grid' 
        ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1'
    }`}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton 
          key={index} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default PropertyCardSkeleton;
