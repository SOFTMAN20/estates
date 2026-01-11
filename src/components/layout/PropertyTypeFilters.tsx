/**
 * PROPERTYTYPEFILTERS.TSX - QUICK PROPERTY TYPE FILTER CARDS
 * ===========================================================
 * 
 * Vichujio vya haraka vya aina ya nyumba - Quick filters for property types
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays clickable cards for quick property type filtering
 * - Links to browse page with pre-selected property type
 * - Responsive grid layout with hover animations
 * - Full i18n support for English and Swahili
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Building2, Home, Bed, Users, Castle, DoorOpen } from 'lucide-react';

interface PropertyTypeCard {
  type: string;
  icon: React.ReactNode;
  translationKey: string;
  gradient: string;
  count?: string;
}

const PropertyTypeFilters = () => {
  const { t } = useTranslation();

  const propertyTypes: PropertyTypeCard[] = [
    {
      type: 'apartment',
      icon: <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />,
      translationKey: 'propertyTypeFilters.apartment',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      type: 'house',
      icon: <Home className="w-8 h-8 sm:w-10 sm:h-10" />,
      translationKey: 'propertyTypeFilters.house',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      type: 'studio',
      icon: <DoorOpen className="w-8 h-8 sm:w-10 sm:h-10" />,
      translationKey: 'propertyTypeFilters.studio',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      type: 'room',
      icon: <Bed className="w-8 h-8 sm:w-10 sm:h-10" />,
      translationKey: 'propertyTypeFilters.room',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      type: 'villa',
      icon: <Castle className="w-8 h-8 sm:w-10 sm:h-10" />,
      translationKey: 'propertyTypeFilters.villa',
      gradient: 'from-rose-500 to-rose-600',
    },
    {
      type: 'bedsitter',
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
      translationKey: 'propertyTypeFilters.bedsitter',
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white via-safari-50/30 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-serengeti-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('propertyTypeFilters.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('propertyTypeFilters.subtitle')}
          </p>
        </div>

        {/* Property Type Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {propertyTypes.map((property) => (
            <Link
              key={property.type}
              to={`/browse?type=${property.type}`}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl 
                            transition-all duration-300 transform hover:-translate-y-2 hover:scale-105
                            border border-gray-100 hover:border-primary/30 text-center">
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 
                                rounded-xl bg-gradient-to-br ${property.gradient} text-white mb-3 sm:mb-4
                                group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {property.icon}
                </div>
                
                {/* Property Type Name */}
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary 
                              transition-colors duration-300">
                  {t(property.translationKey)}
                </h3>
                
                {/* Hover indicator */}
                <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-primary font-medium">
                    {t('propertyTypeFilters.viewAll')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse All Link */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 
                      font-semibold text-base sm:text-lg transition-colors duration-300
                      hover:underline underline-offset-4"
          >
            {t('propertyTypeFilters.browseAll')}
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyTypeFilters;
