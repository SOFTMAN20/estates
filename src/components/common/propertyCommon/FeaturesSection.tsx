
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Shield, Heart, MapPin, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Search,
      titleKey: 'features.easySearch.title',
      descriptionKey: 'features.easySearch.description'
    },
    {
      icon: Shield,
      titleKey: 'features.highSecurity.title',
      descriptionKey: 'features.highSecurity.description'
    },
    {
      icon: Heart,
      titleKey: 'features.saveFavorites.title',
      descriptionKey: 'features.saveFavorites.description'
    },
    {
      icon: MapPin,
      titleKey: 'features.modernMaps.title',
      descriptionKey: 'features.modernMaps.description'
    },
    {
      icon: Zap,
      titleKey: 'features.basicUtilities.title',
      descriptionKey: 'features.basicUtilities.description'
    },
    {
      icon: Users,
      titleKey: 'features.largeCommunity.title',
      descriptionKey: 'features.largeCommunity.description'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-safari-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.whyChoose')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-serengeti-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('features.readyToStart')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('features.joinThousands')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup?type=landlord"
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block text-center"
              >
                {t('features.registerAsLandlord')}
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors inline-block text-center"
              >
                {t('features.searchHouses')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
