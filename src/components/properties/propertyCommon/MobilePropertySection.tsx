/**
 * MOBILE PROPERTY SECTION - Horizontal Scroll by Property Type
 * ============================================================
 * 
 * Component for displaying properties grouped by type with horizontal scroll
 * Designed specifically for mobile/tablet screens
 */

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { useTranslation } from 'react-i18next';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  profiles?: { phone?: string };
  contact_phone?: string;
  contact_whatsapp_phone?: string;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  square_meters?: number;
  average_rating?: number;
  total_reviews?: number;
  property_type?: string;
}

interface MobilePropertySectionProps {
  title: string;
  icon: string;
  properties: Property[];
  isFavorited: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

const MobilePropertySection: React.FC<MobilePropertySectionProps> = ({
  title,
  icon,
  properties,
  isFavorited,
  onToggleFavorite,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (properties.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {properties.length}
          </span>
        </div>
        
        {/* Scroll Buttons - Only show if more than 2 properties */}
        {properties.length > 2 && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex-shrink-0 w-[260px] snap-start"
          >
            <PropertyCard
              id={property.id}
              title={property.title}
              price={Number(property.price)}
              location={property.location}
              images={property.images || []}
              bedrooms={property.bedrooms || undefined}
              bathrooms={property.bathrooms || undefined}
              squareMeters={property.square_meters || undefined}
              isFavorited={isFavorited(property.id)}
              onToggleFavorite={onToggleFavorite}
              viewMode="grid"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobilePropertySection;
