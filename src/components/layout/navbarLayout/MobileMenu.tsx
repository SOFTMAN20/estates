/**
 * MOBILEMENU.TSX - MOBILE NAVIGATION MENU COMPONENT
 * =================================================
 * 
 * Kipengele cha menyu ya uongozaji wa simu - Mobile navigation menu component
 * 
 * MAIN FUNCTIONALITY / KAZI KEKUU:
 * - Mobile-specific navigation menu (Menyu ya uongozaji maalum kwa simu)
 * - Slide-down animation (Mchoro wa kushuka)
 * - Overlay background (Mandhari ya nyuma)
 * - Quick access to all pages (Ufikiaji wa haraka kwa kurasa zote)
 * 
 * KEY FEATURES / VIPENGELE VIKUU:
 * - Responsive mobile menu
 * - Smooth animations
 * - User authentication state
 * - Language toggle
 * - Sign in/out functionality
 * 
 * BENEFITS / FAIDA:
 * - Modularity: Separate component for mobile menu
 * - Reusability: Can be used in different layouts
 * - Maintainability: Changes isolated to this component
 * - Readability: Clean and focused code
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, User, X, Globe, Building2, LogOut, Bell, PlusCircle, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ModeToggle from '@/components/layout/navbarLayout/ModeToggle';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

/**
 * MobileMenu Component Props Interface
 * Muundo wa props za kipengele cha MobileMenu
 */
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  profile: Profile | null;
  onSignOut: () => void;
  onLanguageToggle: () => void;
}

/**
 * MobileMenu Component
 * ====================
 * 
 * Displays a mobile navigation menu with slide-down animation.
 * Inaonyesha menyu ya uongozaji wa simu na mchoro wa kushuka.
 * 
 * @param isOpen - Whether the menu is open
 * @param onClose - Callback to close the menu
 * @param user - Authenticated user object
 * @param profile - User profile data
 * @param onSignOut - Callback for sign out
 * @param onLanguageToggle - Callback for language toggle
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user,
  profile,
  onSignOut,
  onLanguageToggle
}) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  /**
   * Handle link click - closes menu after navigation
   * Simamia kubofya kiungo - inafunga menyu baada ya uongozaji
   */
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile Menu Overlay - Background overlay for mobile menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Sidebar - Slides from right */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white 
                   shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-primary to-serengeti-500 rounded-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent">
              NyumbaLink
            </span>
          </div>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Mobile Menu Content - Maudhui ya menyu ya simu */}
        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)] bg-white">
              {/* Home Link */}
              <Link
                to="/"
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-lg text-sm transition-all duration-300 ${
                  location.pathname === '/' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.home')}
                </div>
              </Link>

              {/* Browse Link */}
              <Link
                to="/browse"
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-lg text-sm transition-all duration-300 ${
                  location.pathname === '/browse' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center">
                  <Search className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.browse')}
                </div>
              </Link>

              {/* About Link */}
              <Link
                to="/about"
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-lg text-sm transition-all duration-300 ${
                  location.pathname === '/about' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.about')}
                </div>
              </Link>

              {/* Dashboard Link - Only for authenticated users */}
              {user && (
                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                             rounded-lg text-sm transition-all duration-300 ${
                    location.pathname === '/dashboard' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <PlusCircle className="h-5 w-5 mr-3 text-gray-400" />
                    {t('navigation.dashboard')}
                  </div>
                </Link>
              )}

              {/* Notifications Link - Only for authenticated users */}
              {user && (
                <Link
                  to="/notifications"
                  className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                             rounded-lg text-sm transition-all duration-300 ${
                    location.pathname === '/notifications' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-gray-400" />
                    {t('navigation.notifications', 'Notifications')}
                  </div>
                </Link>
              )}

              {/* Messages Link - Only for authenticated users */}
              {user && (
                <Link
                  to="/messages"
                  className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                             rounded-lg text-sm transition-all duration-300 ${
                    location.pathname === '/messages' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-3 text-gray-400" />
                    Messages
                  </div>
                </Link>
              )}

              {/* Mode Toggle for mobile - only show for authenticated users */}
              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2 px-4">Switch Mode</p>
                  <ModeToggle />
                </div>
              )}

              {/* User Actions Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {/* Language Toggle */}
                <Button
                  variant="ghost"
                  onClick={onLanguageToggle}
                  className="w-full justify-start px-4 py-3 hover:bg-gray-100 rounded-lg text-sm
                             transition-all duration-300"
                >
                  <Globe className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.language')} ({i18n.language.toUpperCase()})
                </Button>

                {/* Sign Out / Sign In */}
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={onSignOut}
                    className="w-full justify-start px-4 py-3 hover:bg-red-50 hover:text-red-600 
                               rounded-lg mt-2 text-sm transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5 mr-3 text-gray-400" />
                    {t('navigation.signOut')}
                  </Button>
                ) : (
                  <Link to="/signin" className="block mt-2" onClick={handleLinkClick}>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-serengeti-500 
                                 hover:from-primary/90 hover:to-serengeti-400 text-sm 
                                 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <User className="h-5 w-5 mr-3 text-white" />
                      {t('navigation.signIn')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
      </div>
    </>
  );
};

export default MobileMenu;
