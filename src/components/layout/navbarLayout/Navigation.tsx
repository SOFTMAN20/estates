
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
import { Home, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import UserMenu from '@/components/layout/navbarLayout/UserMenu';
import MobileMenu from '@/components/layout/navbarLayout/MobileMenu';
import ModeToggle from '@/components/layout/navbarLayout/ModeToggle';
import NavbarSearchBar from '@/components/layout/navbarLayout/NavbarSearchBar';
import { NotificationBell } from '@/components/Notifications/NotificationBell';

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
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll for header height
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

  // Track scroll to expand header when second row scrolls away
  useEffect(() => {
    const handleScroll = () => {
      // Expand header after scrolling past 50px (roughly when second row disappears)
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      {/* TOP ROW: YouTube-style Layout: Logo | Search | Actions - Sticky on desktop */}
      <div className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className={`flex items-center justify-between px-2 sm:px-4 border-b border-gray-100 transition-all duration-300 ${isScrolled ? 'h-16 md:h-[72px]' : 'h-14'}`}>
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className={`bg-gradient-to-br from-primary to-serengeti-500 rounded-lg transition-all duration-300 ${isScrolled ? 'p-1.5 sm:p-2' : 'p-1 sm:p-1.5'}`}>
              <Home className={`text-white transition-all duration-300 ${isScrolled ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
            </div>
            <span className={`hidden sm:inline font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent transition-all duration-300 ${isScrolled ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
              NyumbaLink
            </span>
          </Link>
        </div>

        {/* CENTER: Search Bar (YouTube-style) - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <NavbarSearchBar />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

          {/* Notification Bell - Only for logged in users - Now visible on mobile too */}
          {user && <NotificationBell />}

          {/* Mode Toggle - Hidden on small mobile */}
          {user && (
            <div className="hidden sm:block">
              <ModeToggle />
            </div>
          )}

          {/* Mobile Menu Toggle - On the right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* User Actions */}
          {user ? (
            <>
              {/* User Menu - Hidden on mobile, shown on desktop */}
              <div className="hidden sm:block">
                <UserMenu
                  user={user}
                  profile={profile}
                  favoritesCount={getFavoritesCount()}
                  onSignOut={() => signOut(navigate)}
                />
              </div>
              
              {/* User Avatar */}
              <Link to="/account" className="hover:opacity-80">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              {/* Become a Host - Hidden on small mobile */}
              <Link to="/signup" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                  Become a Host
                </Button>
              </Link>
              
              {/* Sign In Button */}
              <Link to="/signin">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4">
                  {t('navigation.signIn')}
                </Button>
              </Link>
            </>
          )}
        </div>
        </div>
      </div>

      {/* SECOND ROW: Navigation Items (YouTube-style category tabs) - Desktop only, scrolls with page */}
      <div className="hidden md:flex items-center justify-center gap-1 px-4 py-2 overflow-x-auto bg-white border-b border-gray-200">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-primary/15 text-primary hover:bg-primary/20 border border-primary/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('navigation.home')}
          </Button>
        </Link>

        <Link to="/browse">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              location.pathname === '/browse'
                ? 'bg-primary/15 text-primary hover:bg-primary/20 border border-primary/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('navigation.browse')}
          </Button>
        </Link>

        <Link to="/about">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              location.pathname === '/about'
                ? 'bg-primary/15 text-primary hover:bg-primary/20 border border-primary/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('navigation.about')}
          </Button>
        </Link>

        {user && (
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-primary/15 text-primary hover:bg-primary/20 border border-primary/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('navigation.dashboard')}
            </Button>
          </Link>
        )}
      </div>

      {/* MOBILE SEARCH BAR - Sticky on mobile, scrolls away on desktop */}
      <div className="md:hidden sticky top-0 z-50 bg-white px-2 py-2 border-b border-gray-200 shadow-sm flex justify-center">
        <NavbarSearchBar />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        profile={profile}
        onSignOut={() => signOut(navigate)}
        onLanguageToggle={toggleLanguage}
      />
    </>
  );
};

export default Navigation;

