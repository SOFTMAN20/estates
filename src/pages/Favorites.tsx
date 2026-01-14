/**
 * FAVORITES.TSX - USER FAVORITES/WISHLIST PAGE
 * ===========================================
 * 
 * Ukurasa wa vipendwa vya mtumiaji - User favorites/wishlist page
 * 
 * FUNCTIONALITY / KAZI:
 * - Display user's favorited properties (Kuonyesha nyumba za vipendwa vya mtumiaji)
 * - Allow removing properties from favorites (Kuruhusu kuondoa nyumba kutoka vipendwa)
 * - Handle authentication state (Kushughulikia hali ya uthibitisho)
 * - Show empty state when no favorites (Kuonyesha hali tupu wakati hakuna vipendwa)
 */

import { useEffect } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import PropertyCard from '@/components/properties/propertyCommon/PropertyCard';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useProperties, type Property } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useTranslation } from 'react-i18next';

const Favorites = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { favorites, loading: favoritesLoading, toggleFavorite, isFavorited } = useFavorites();
  const { data: allProperties = [], isLoading: propertiesLoading } = useProperties();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter properties to show only favorited ones
  const typedProperties = allProperties as Property[];
  const favoriteProperties = typedProperties.filter(property => 
    favorites.some(fav => fav.property_id === property.id)
  );

  const isLoading = favoritesLoading || propertiesLoading;

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ingia kwanza
            </h2>
            <p className="text-gray-600 mb-8">
              Unahitaji kuingia ili kuona vipendwa vyako.
            </p>
            <div className="space-x-4">
              <Link to="/signin">
                <Button>
                  {t('navigation.signIn')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">
                  {t('navigation.signUp')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vipendwa Vyangu
          </h1>
          <p className="text-gray-600">
            Nyumba ulizoziweka kwenye vipendwa vyako
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : favoriteProperties.length > 0 ? (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={Number(property.price)}
                location={property.location}
                images={property.images || []}
                bedrooms={property.bedrooms || undefined}
                bathrooms={property.bathrooms || undefined}
                squareMeters={property.square_meters || undefined}
                isFavorited={isFavorited(property.id)}
                onToggleFavorite={toggleFavorite}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hakuna Vipendwa
            </h2>
            <p className="text-gray-600 mb-8">
              Hujaweka nyumba yoyote kwenye vipendwa vyako bado. Anza kutazama nyumba na uweke zile unazozipenda.
            </p>
            <Link to="/browse">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Tazama Nyumba
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;