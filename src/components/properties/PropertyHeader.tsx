/**
 * PROPERTYHEADER.TSX - PROPERTY HEADER COMPONENT
 * ==============================================
 * 
 * Displays property title, location, price, and amenity badges
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Droplets, Shield, Wifi, Car, Wind, Tv, Sofa, Sparkles } from 'lucide-react';

interface PropertyHeaderProps {
  title: string;
  location: string;
  fullAddress?: string | null;
  price: number;
  amenities?: string[] | null;
  nearbyServices?: string[] | null;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  location,
  fullAddress,
  price,
  amenities,
  nearbyServices,
}) => {
  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower === 'electricity' || lower === 'umeme') return { Icon: Zap, label: 'Umeme', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    if (lower === 'water' || lower === 'maji') return { Icon: Droplets, label: 'Maji', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (lower === 'furnished' || lower === 'samani') return { Icon: Sofa, label: 'Samani', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (lower === 'parking' || lower === 'maegesho') return { Icon: Car, label: 'Maegesho', color: 'bg-green-50 text-green-700 border-green-200' };
    if (lower === 'security' || lower === 'usalama') return { Icon: Shield, label: 'Usalama', color: 'bg-red-50 text-red-700 border-red-200' };
    if (lower === 'wifi') return { Icon: Wifi, label: 'WiFi', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (lower === 'ac') return { Icon: Wind, label: 'AC', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    if (lower === 'tv') return { Icon: Tv, label: 'TV', color: 'bg-pink-50 text-pink-700 border-pink-200' };
    return { Icon: Sparkles, label: amenity, color: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words overflow-hidden">
          {title}
        </h1>
        <div className="text-left sm:text-right">
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            TZS {price.toLocaleString()}
          </div>
          <div className="text-sm sm:text-base text-gray-600">per month</div>
        </div>
      </div>

      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
        <span className="text-sm sm:text-base break-words overflow-hidden">
          {fullAddress || location}
        </span>
      </div>

      {/* Amenity Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {amenities?.slice(0, 6).map((amenity) => {
          const { Icon, label, color } = getAmenityIcon(amenity);
          return (
            <Badge key={amenity} className={`${color} text-xs sm:text-sm px-3 py-1.5 flex items-center gap-1.5 border`}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyHeader;
