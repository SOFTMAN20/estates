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
 * Maps service keys to their icons, labels, and colors
 */
const serviceConfig: Record<string, ServiceConfig> = {
  school: {
    icon: School,
    label: 'Shule',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  hospital: {
    icon: Hospital,
    label: 'Hospitali',
    colorClass: 'bg-red-50 text-red-700 border-red-200',
  },
  market: {
    icon: ShoppingCart,
    label: 'Soko',
    colorClass: 'bg-green-50 text-green-700 border-green-200',
  },
  bank: {
    icon: Building2,
    label: 'Benki',
    colorClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  transport: {
    icon: Bus,
    label: 'Usafiri',
    colorClass: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

/**
 * Get service configuration based on key
 */
const getServiceConfig = (service: string): ServiceConfig => {
  const lowerService = service.toLowerCase();

  // Check for exact match
  if (serviceConfig[lowerService]) {
    return serviceConfig[lowerService];
  }

  // Check for partial match
  for (const [key, config] of Object.entries(serviceConfig)) {
    if (lowerService.includes(key) || key.includes(lowerService)) {
      return config;
    }
  }

  // Default configuration
  return {
    icon: Building2,
    label: service,
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
  // Handle empty state
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Nearby Services</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {services.map((service, index) => {
          const config = getServiceConfig(service);
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:shadow-md ${config.colorClass}`}
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium text-center break-words">
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyServices;
