/**
 * NEARBYSERVICES.TSX - NEARBY SERVICES DISPLAY COMPONENT
 * ======================================================
 * 
 * A reusable component for displaying nearby services and amenities
 * around the property location.
 * 
 * FEATURES:
 * - Icon-based service display
 * - Grid layout
 * - Color-coded categories
 * - Responsive design
 * 
 * USAGE:
 * <NearbyServices services={property.nearby_services} />
 */

import React from 'react';
import { 
  School, 
  Building2, 
  ShoppingCart, 
  Bus,
  Hospital,
  LucideIcon 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NearbyServicesProps {
  services?: string[] | null;
  className?: string;
}

interface ServiceConfig {
  icon: LucideIcon;
  label: string;
  colorClass: string;
}

/**
 * SERVICE ICON MAPPING
 * ===================
 * Maps service keys to their icons and colors
 * Labels are now handled via translations
 */
const getServiceIconConfig = (service: string): { icon: LucideIcon; colorClass: string } => {
  const serviceMap: Record<string, { icon: LucideIcon; colorClass: string }> = {
    school: {
      icon: School,
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    hospital: {
      icon: Hospital,
      colorClass: 'bg-red-50 text-red-700 border-red-200',
    },
    market: {
      icon: ShoppingCart,
      colorClass: 'bg-green-50 text-green-700 border-green-200',
    },
    bank: {
      icon: Building2,
      colorClass: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    transport: {
      icon: Bus,
      colorClass: 'bg-orange-50 text-orange-700 border-orange-200',
    },
  };

  const lowerService = service.toLowerCase();
  
  // Check for exact match
  if (serviceMap[lowerService]) {
    return serviceMap[lowerService];
  }

  // Check for partial match
  for (const [key, config] of Object.entries(serviceMap)) {
    if (lowerService.includes(key) || key.includes(lowerService)) {
      return config;
    }
  }

  // Default configuration
  return {
    icon: Building2,
    colorClass: 'bg-gray-50 text-gray-700 border-gray-200',
  };
};

/**
 * NEARBY SERVICES COMPONENT
 * ========================
 */
const NearbyServices: React.FC<NearbyServicesProps> = ({
  services,
  className = '',
}) => {
  const { t } = useTranslation();

  // Handle empty state
  if (!services || services.length === 0) {
    return null;
  }

  /**
   * Get translated label for service
   * Uses translation keys from propertyDetail.nearbyServices
   */
  const getServiceLabel = (service: string): string => {
    const lowerService = service.toLowerCase();
    
    // Map service keys to translation keys
    const translationMap: Record<string, string> = {
      school: 'propertyDetail.nearbyServices.school',
      hospital: 'propertyDetail.nearbyServices.hospital',
      market: 'propertyDetail.nearbyServices.market',
      bank: 'propertyDetail.nearbyServices.bank',
      transport: 'propertyDetail.nearbyServices.transport',
    };

    // Return translated label or fallback to original service name
    return translationMap[lowerService] ? t(translationMap[lowerService]) : service;
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Nearby Services</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {services.map((service, index) => {
          const iconConfig = getServiceIconConfig(service);
          const Icon = iconConfig.icon;
          const label = getServiceLabel(service);

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:shadow-md ${iconConfig.colorClass}`}
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium text-center break-words">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyServices;
