/**
 * USERMENU.TSX - USER DROPDOWN MENU COMPONENT
 * ===========================================
 * 
 * Kipengele cha menyu ya mtumiaji - User dropdown menu component
 * 
 * MAIN FUNCTIONALITY / KAZI KEKUU:
 * - User profile dropdown menu (Menyu ya wasifu wa mtumiaji)
 * - Quick access to user features (Ufikiaji wa haraka kwa vipengele vya mtumiaji)
 * - Avatar display with user info (Onyesho la picha ya wasifu na taarifa za mtumiaji)
 * - Navigation to key pages (Uongozaji kwa kurasa muhimu)
 * 
 * KEY FEATURES / VIPENGELE VIKUU:
 * - User avatar and profile info display
 * - Favorites with count badge
 * - Profile page access
 * - Dashboard access
 * - Notifications (disabled for now)
 * - Settings (disabled for now)
 * - Sign out functionality
 * 
 * BENEFITS / FAIDA:
 * - Modularity: Separate component for easy maintenance
 * - Reusability: Can be used in different parts of the app
 * - Maintainability: Changes isolated to this component
 * - Readability: Clean and focused code
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, Building2, LogOut, Heart, Bell, Settings, Calendar, Home as HomeIcon, Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useModeToggle } from '@/hooks/useModeToggle';
import { useNotifications } from '@/hooks/useNotifications';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

/**
 * UserMenu Component Props Interface
 * Muundo wa props za kipengele cha UserMenu
 */
interface UserMenuProps {
  user: SupabaseUser;
  profile: Profile | null;
  favoritesCount: number;
  onSignOut: () => void;
}

/**
 * UserMenu Component
 * ==================
 * 
 * Displays a dropdown menu with user options when clicking the hamburger icon.
 * Inaonyesha menyu ya kushuka na chaguo za mtumiaji wakati wa kubofya aikoni ya hamburger.
 * 
 * @param user - Authenticated user object
 * @param profile - User profile data from database
 * @param favoritesCount - Number of favorited properties
 * @param onSignOut - Callback function for sign out
 */
const UserMenu: React.FC<UserMenuProps> = ({
  user,
  profile,
  favoritesCount,
  onSignOut
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentMode } = useModeToggle();
  const { unreadCount } = useNotifications();

  /**
   * Toggle language between English and Swahili
   */
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'sw' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  /**
   * Get user initials from name or email
   * Pata herufi za kwanza za jina au barua pepe
   * 
   * @returns Uppercase initials (max 2 characters)
   */
  const getUserInitials = (): string => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0)?.toUpperCase() || 'U';
  };

  /**
   * Handle sign out action
   * Simamia kitendo cha kutoka
   */
  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    onSignOut();
  };

  return (
    <DropdownMenu>
      {/* Hamburger Menu Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 rounded-full hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300"
          aria-label="User menu"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Menu Content */}
      <DropdownMenuContent align="start" side="bottom" className="w-56">
        {/* User Profile Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center">
                <span className="text-white text-base font-semibold">
                  {getUserInitials()}
                </span>
              </div>
            )}

            {/* User Info */}
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.name || 'Mtumiaji'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs leading-none text-primary font-medium mt-1">
                {currentMode === 'guest' ? '👤 Guest Mode' : '🏠 Host Mode'}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Mode-specific menu items */}
        {currentMode === 'guest' ? (
          <DropdownMenuItem asChild>
            <Link to="/bookings" className="flex items-center cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{t('userMenu.myBookings', 'My Bookings')}</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/host/properties" className="flex items-center cursor-pointer">
              <HomeIcon className="mr-2 h-4 w-4" />
              <span>{t('userMenu.myListings', 'My Listings')}</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Favorites Link */}
        <DropdownMenuItem asChild>
          <Link to="/favorites" className="flex items-center cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Vipendwa</span>
            {favoritesCount > 0 && (
              <Badge className="ml-auto bg-primary text-white text-xs px-1.5 py-0.5">
                {favoritesCount}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>

        {/* Profile Link */}
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Wasifu</span>
          </Link>
        </DropdownMenuItem>

        {/* Notifications */}
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="flex items-center cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Arifa</span>
            {unreadCount > 0 && (
              <Badge className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Mipangilio</span>
          </Link>
        </DropdownMenuItem>

        {/* Admin link - only visible if role='admin' or 'super_admin' */}
        {(profile?.role === 'admin' || profile?.role === 'super_admin') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Language Toggle */}
        <DropdownMenuItem
          onClick={toggleLanguage}
          className="cursor-pointer"
        >
          <Globe className="mr-2 h-4 w-4" />
          <span>{i18n.language === 'en' ? 'Swahili' : 'English'}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {i18n.language === 'en' ? 'EN' : 'SW'}
          </Badge>
        </DropdownMenuItem>

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('navigation.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
