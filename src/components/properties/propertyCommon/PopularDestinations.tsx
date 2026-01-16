import { MapPin, ArrowRight, Building2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PopularDestinations = () => {
  const { t } = useTranslation();
  
  const destinations = [
    {
      name: 'Dar es Salaam',
      properties: '120+',
      image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&auto=format&fit=crop&q=80',
      price: 'TSh 300,000',
      trending: true,
    },
    {
      name: 'Arusha',
      properties: '85+',
      image: 'https://images.unsplash.com/photo-1621414050946-1b936a78491d?w=800&auto=format&fit=crop&q=80',
      price: 'TSh 250,000',
      trending: true,
    },
    {
      name: 'Mwanza',
      properties: '60+',
      image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80',
      price: 'TSh 200,000',
      trending: false,
    },
    {
      name: 'Mbeya',
      properties: '40+',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
      price: 'TSh 150,000',
      trending: false,
    },
    {
      name: 'Dodoma',
      properties: '45+',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
      price: 'TSh 180,000',
      trending: false,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-serengeti-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            <span>{t('popularDestinations.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('popularDestinations.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('popularDestinations.subtitle')}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Primary Large Card - Dar es Salaam */}
          <Link
            to={`/browse?location=${destinations[0].name}`}
            className="group relative overflow-hidden rounded-3xl lg:row-span-2"
          >
            <div className="relative h-[300px] sm:h-[400px] lg:h-full lg:min-h-[500px]">
              <img
                src={destinations[0].image}
                alt={destinations[0].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {destinations[0].trending && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trending</span>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                  {destinations[0].name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Building2 className="w-5 h-5" />
                    <span className="text-base font-medium">{destinations[0].properties} {t('popularDestinations.properties')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">{t('popularDestinations.startingFrom')} {destinations[0].price}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary/50 rounded-3xl transition-colors duration-300" />
            </div>
          </Link>

          {/* Right Side - 4 Smaller Cards in 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {destinations.slice(1).map((destination) => (
              <Link
                key={destination.name}
                to={`/browse?location=${destination.name}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative h-[150px] sm:h-[200px] lg:h-[235px]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {destination.trending && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{destination.properties} {t('popularDestinations.properties')}</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
