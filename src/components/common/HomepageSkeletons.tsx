/**
 * HOMEPAGE SKELETONS - CONTENT-SHAPED LOADING STATES
 * ==================================================
 * 
 * Skeleton loaders that match the actual content shapes for a better UX.
 * Each skeleton mimics the exact layout of its corresponding component.
 */

import React from 'react';

// Shimmer effect component for reuse
const Shimmer = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
);

/**
 * Property Type Filters Skeleton
 * Matches the PropertyTypeFilters component layout
 */
export const PropertyTypeFiltersSkeleton: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-safari-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
          <div className="h-5 bg-gray-200 rounded w-80 mx-auto relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md animate-pulse">
              {/* Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-xl mx-auto mb-3 sm:mb-4 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Label */}
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Featured Properties Skeleton
 * Matches the FeaturedProperties component layout
 */
export const FeaturedPropertiesSkeleton: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-7 sm:h-8 bg-gray-200 rounded-lg w-48 mb-2 relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
          <div className="h-4 bg-gray-200 rounded w-72 relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              {/* Image */}
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Content */}
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="flex gap-2 pt-1">
                  <div className="h-4 w-10 bg-gray-200 rounded relative overflow-hidden">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-10 bg-gray-200 rounded relative overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-2/3 pt-1 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-4">
          <div className="h-12 w-48 bg-gray-200 rounded-full mx-auto relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Popular Destinations Skeleton
 * Matches the PopularDestinations component layout
 */
export const PopularDestinationsSkeleton: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-kilimanjaro-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-10">
          <div className="h-8 bg-gray-200 rounded-lg w-40 mx-auto mb-3 relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-5 bg-gray-300/50 rounded w-24 mb-2 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-3 bg-gray-300/50 rounded w-16 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * How It Works Skeleton
 * Matches the HowItWorks component layout
 */
export const HowItWorksSkeleton: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-safari-50/50 via-white to-serengeti-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-4 relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
          <div className="h-4 bg-gray-200 rounded w-96 max-w-full mx-auto relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>

        {/* Tab Buttons Skeleton */}
        <div className="flex justify-center gap-4 mb-10">
          <div className="h-12 w-40 bg-gray-200 rounded-full relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded-full relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center animate-pulse">
              {/* Step Number */}
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Icon */}
              <div className="w-20 h-20 bg-gray-200 rounded-2xl mx-auto mb-4 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-3 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Testimonials Skeleton
 * Matches the Testimonials component layout
 */
export const TestimonialsSkeleton: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-primary/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-56 mx-auto mb-4 relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
          <div className="h-4 bg-gray-200 rounded w-80 mx-auto relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-6 shadow-lg animate-pulse ${
                index === 1 ? 'md:scale-105' : ''
              }`}
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-gray-200 rounded-full mb-4 relative overflow-hidden">
                <Shimmer />
              </div>
              {/* Review Text */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 relative overflow-hidden">
                    <Shimmer />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-16 relative overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index} 
              className={`bg-gray-200 rounded-full animate-pulse ${
                index === 0 ? 'w-8 h-3' : 'w-3 h-3'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Newsletter Skeleton
 * Matches the Newsletter component layout
 */
export const NewsletterSkeleton: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-serengeti-50/50 to-kilimanjaro-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-2xl relative overflow-hidden animate-pulse">
              <Shimmer />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-72 mx-auto mb-4 relative overflow-hidden animate-pulse">
              <Shimmer />
            </div>
            <div className="h-4 bg-gray-200 rounded w-96 max-w-full mx-auto mb-2 relative overflow-hidden animate-pulse">
              <Shimmer />
            </div>
            <div className="h-4 bg-gray-200 rounded w-80 max-w-full mx-auto relative overflow-hidden animate-pulse">
              <Shimmer />
            </div>
          </div>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 h-14 bg-gray-200 rounded-xl relative overflow-hidden animate-pulse">
                <Shimmer />
              </div>
              <div className="h-14 w-full sm:w-32 bg-gray-200 rounded-xl relative overflow-hidden animate-pulse">
                <Shimmer />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto mt-4 relative overflow-hidden animate-pulse">
              <Shimmer />
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 justify-center animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Footer Skeleton
 * Matches the Footer component layout
 */
export const FooterSkeleton: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <div key={colIndex} className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-24 mb-4 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="h-4 bg-gray-200 rounded w-20 relative overflow-hidden">
                    <Shimmer />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto relative overflow-hidden animate-pulse">
            <Shimmer />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default {
  PropertyTypeFiltersSkeleton,
  FeaturedPropertiesSkeleton,
  PopularDestinationsSkeleton,
  HowItWorksSkeleton,
  TestimonialsSkeleton,
  NewsletterSkeleton,
  FooterSkeleton,
};
