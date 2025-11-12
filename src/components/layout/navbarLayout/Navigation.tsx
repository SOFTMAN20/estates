
/**
 * NAVIGATION.TSX - GLOBAL NAVIGATION COMPONENT
 * ===========================================
 * 
 * Kipengele cha uongozaji wa kimataifa - Global navigation component
 * 
 * MAIN FUNCTIONALITY / KAZI KEKUU:
 * - Global navigation across all pages (Uongozaji wa kimataifa kwa kurasa zote)
 * - Multi-language support (English/Swahili) (Msaada wa lugha nyingi)
 * - Responsive design for mobile and desktop (Muundo unaojibu kwa simu na kompyuta)
 * - User authentication state display (Onyesho la hali ya uthibitisho wa mtumiaji)
 * - Active page highlighting (Kuangazia ukurasa unaotumika)
 * 
 * KEY FEATURES / VIPENGELE VIKUU:
 * - Brand logo with home link (Nembo ya chapa na kiungo cha nyumbani)
 * - Primary navigation menu (Menyu ya uongozaji wa msingi)
 * - Language toggle (Kubadili lugha)
 * - Mobile hamburger menu (Menyu ya simu)
 * - User account access (Ufikiaji wa akaunti ya mtumiaji)
 * - Enhanced visual appeal and animations
 * 
 * NAVIGATION STRUCTURE / MUUNDO WA UONGOZAJI:
 * - Home: Landing page (Ukurasa wa kwanza)
 * - Browse: Property listings (Orodha ya nyumba)
 * - Dashboard: Host/Landlord panel (Dashibodi ya mwenye nyumba)
 * - Authentication: Sign in/up (Kuingia/Kujisajili)
 * 
 * RESPONSIVE BEHAVIOR / TABIA YA KUJIBU:
 * - Desktop: Horizontal navigation bar
 * - Mobile: Collapsible hamburger menu
 * - Tablet: Adaptive layout
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, User, Menu, X, Globe, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import UserMenu from '@/components/layout/navbarLayout/UserMenu';
import MobileMenu from '@/components/layout/navbarLayout/MobileMenu';

import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';

type Profile = Tables<'profiles'>;

/**
 * Global Navigation Component
 * Kipengele cha uongozaji wa kimataifa
 * 
 * This component appears on every page and provides the main navigation
 * structure for the entire application with multi-language support.
 * 
 * Kipengele hiki kinaonekana kila ukurasa na kinatoa muundo wa uongozaji
 * wa msingi kwa programu nzima na msaada wa lugha nyingi.
 */
const Navigation = () => {
  // Component state management
  // Usimamizi wa hali ya kipengee
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu visibility
  const [profile, setProfile] = useState<Profile | null>(null); // User profile
  const location = useLocation(); // Current page location for active states
  const navigate = useNavigate(); // Navigation function
  const { user, signOut } = useAuth(); // Authentication state
  const { getFavoritesCount } = useFavorites(); // Favorites functionality
  const { t, i18n } = useTranslation();

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error);
          return;
        }

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  /**
   * Language Toggle Function
   * Utendakazi wa kubadilisha lugha
   * 
   * Switches between English and Swahili interface languages
   * Inabadilisha kati ya lugha za Kiingereza na Kiswahili
   */
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'sw' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          
          {/* Enhanced Brand Logo Section - Sehemu ya nembo ya chapa */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="p-1 sm:p-1.5 lg:p-2 bg-gradient-to-br from-primary to-serengeti-500 
                              rounded-md sm:rounded-lg lg:rounded-xl transform group-hover:scale-110 transition-all duration-300 
                              shadow-lg group-hover:shadow-xl">
                <Home className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                {/* Mobile label: NyLink */}
                <span className="md:hidden text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 
                                bg-clip-text text-transparent">NyLink</span>
                <span className="md:hidden text-base sm:text-lg lg:text-2xl font-bold text-serengeti-600"></span>

                {/* Desktop/large label: NyumbaLink Tz */}
                <span className="hidden md:inline text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 
                                bg-clip-text text-transparent">NyumbaLink</span>
                <span className="hidden md:inline text-base sm:text-lg lg:text-2xl font-bold text-serengeti-600"> </span>
              </div>
            </Link>
            
            {/* Removed "Become a Host" button - All users can access dashboard */}
          </div>

          {/* Enhanced Desktop Navigation Menu - Menyu ya uongozaji wa kompyuta */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Home Link - Kiungo cha nyumbani */}
            <Link to="/">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                           hover:bg-primary/10 hover:text-primary hover:scale-105 ${
                  location.pathname === '/' 
                    ? 'bg-primary/15 text-primary font-semibold shadow-md border border-primary/20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {t('navigation.home')}
              </Button>
            </Link>
            
            {/* Browse Properties Link - Kiungo cha kutazama nyumba */}
            <Link to="/browse">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                           hover:bg-primary/10 hover:text-primary hover:scale-105 ${
                  location.pathname === '/browse' 
                    ? 'bg-primary/15 text-primary font-semibold shadow-md border border-primary/20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {t('navigation.browse')}
              </Button>
            </Link>
            
            {/* About Us Link - Kiungo cha kuhusu */}
            <Link to="/about">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                           hover:bg-primary/10 hover:text-primary hover:scale-105 ${
                  location.pathname === '/about' 
                    ? 'bg-primary/15 text-primary font-semibold shadow-md border border-primary/20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {t('navigation.about')}
              </Button>
            </Link>
          </div>

          {/* Enhanced Desktop Right Side Controls - Vidhibiti vya upande wa kulia vya kompyuta */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            {/* Search Icon - Aikoni ya kutafuta */}
            <Link to="/browse">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-primary/10 
                           hover:text-primary hover:scale-105 transition-all duration-300"
                title={t('navigation.browse')}
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-sm font-medium">{t('common.search')}</span>
              </Button>
            </Link>

            {/* Enhanced User Account Menu - Menyu ya akaunti ya mtumiaji */}
            {user ? (
              <>
                {/* User Menu Component (Hamburger with Dropdown) */}
                <UserMenu
                  user={user}
                  profile={profile}
                  favoritesCount={getFavoritesCount()}
                  onSignOut={() => signOut(navigate)}
                />
                
                {/* User Avatar Display - Clickable to navigate to profile */}
                <Link to="/profile" className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-colors duration-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-primary transition-colors duration-200">
                      <span className="text-white text-base font-semibold">
                        {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <Link to="/signin">
                <Button size="sm" className="bg-gradient-to-r from-primary to-serengeti-500 
                                            hover:from-primary/90 hover:to-serengeti-400 text-sm px-4 py-2
                                            shadow-lg hover:shadow-xl transform hover:scale-105 
                                            transition-all duration-300">
                  {t('navigation.signIn')}
                </Button>
              </Link>
            )}

            {/* Enhanced Language Toggle Button - Kitufe cha kubadilisha lugha (RIGHT SIDE) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 
                         hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-primary/30"
            >
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{i18n.language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Enhanced Mobile Menu Toggle Button - Kitufe cha menyu ya simu */}
          <div className="md:hidden flex items-center space-x-1">
            {/* Mobile Search Button - Takes user to browse page */}
            <Link to="/browse">
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300 hover:scale-105"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Component */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          user={user}
          profile={profile}
          onSignOut={() => signOut(navigate)}
          onLanguageToggle={toggleLanguage}
        />
      </div>
    </nav>
  );
};

export default Navigation;

