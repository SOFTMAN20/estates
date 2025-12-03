/**
 * PROPERTYFEATURES.TSX - PROPERTY FEATURES DISPLAY COMPONENT
 * ==========================================================
 * 
 * A reusable component for displaying property features like
 * property type, bedrooms, bathrooms, and size.
 * 
 * FEATURES:
 * - Clean grid layout
 * - Icon-based visual representation
 * - Proper property type display
 * - Responsive design
 * 
 * USAGE:
 * <PropertyFeatures 
 *   propertyType={property.property_type}
 *   bedrooms={property.bedrooms}
 *   bathrooms={property.bathrooms}
 *   areaSqm={property.square_meters}
 * />
 */

import React from 'react';
import { Home, Bed, Bath, Maximize } from 'lucide-react';

interface PropertyFeaturesProps {
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number | null;
  className?: string;
}

/**
 * Property type labels mapping
 */
const propertyTypeLabels: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  studio: 'Studio',
  villa: 'Villa',
  condo: 'Condo',
  townhouse: 'Townhouse',
  room: 'Room',
  hostel: 'Hostel',
};

/**
 * PROPERTY FEATURES COMPONENT
 * ===========================
 */
const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({
  propertyType,
  bedrooms,
  bathrooms,
  areaSqm,
  className = '',
}) => {
  // Handle empty state
  if (!propertyType && !bedrooms && !bathrooms && !areaSqm) {
    return null;
  }

  const getPropertyTypeLabel = (type: string): string => {
    return propertyTypeLabels[type.toLowerCase()] || type;
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Property Features</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {propertyType && (
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Home className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs text-gray-500 mb-1">Property Type</span>
            <span className="text-sm font-semibold text-gray-900">
              {getPropertyTypeLabel(propertyType)}
            </span>
          </div>
        )}
        
        {bedrooms !== undefined && bedrooms !== null && (
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Bed className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs text-gray-500 mb-1">Bedrooms</span>
            <span className="text-sm font-semibold text-gray-900">
              {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
            </span>
          </div>
        )}
        
        {bathrooms !== undefined && bathrooms !== null && (
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Bath className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs text-gray-500 mb-1">Bathrooms</span>
            <span className="text-sm font-semibold text-gray-900">
              {bathrooms} {bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
            </span>
          </div>
        )}
        
        {areaSqm && (
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Maximize className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs text-gray-500 mb-1">Size</span>
            <span className="text-sm font-semibold text-gray-900">
              {areaSqm} m²
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFeatures;
