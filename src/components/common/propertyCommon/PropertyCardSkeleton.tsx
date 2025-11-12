/**
 * PROPERTY CARD SKELETON - AIRBNB-STYLE LOADING STATE
 * ==================================================
 * 
 * Skeleton loading component for property cards with shimmer animation
 * Similar to Airbnb's loading state design
 * 
 * FEATURES:
 * - Shimmer animation effect
 * - Responsive design for grid and list views
 * - Matches PropertyCard dimensions and layout
 * - Smooth loading experience
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const PropertyCardSkeleton: React.FC<PropertyCardSkeletonProps> = ({ 
  viewMode = 'grid' 
}) => {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-0">
        {viewMode === 'grid' ? (
          // Grid View Skeleton
          <>
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Location */}
              <div className="h-4 bg-gray-200 rounded w-2/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Price */}
              <div className="h-6 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Amenities */}
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-16 bg-gray-200 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // List View Skeleton
          <div className="flex">
            {/* Image Skeleton */}
            <div className="w-48 h-32 bg-gray-200 flex-shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="flex-1 p-4 space-y-3">
              {/* Location */}
              <div className="h-4 bg-gray-200 rounded w-1/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Price */}
              <div className="h-6 bg-gray-200 rounded w-1/4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Amenities */}
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * PROPERTY GRID SKELETON
 * =====================
 * 
 * Renders multiple skeleton cards in a grid layout
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
    <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
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
