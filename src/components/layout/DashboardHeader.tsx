/**
 * DASHBOARDHEADER.TSX - DASHBOARD HEADER COMPONENT
 * ===============================================
 * 
 * Kipengele cha kichwa cha dashibodi - Dashboard header component
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays welcome banner for users (Kuonyesha ujumbe wa kukaribisha)
 * - Shows user profile information (Kuonyesha maelezo ya mtumiaji)
 * - Provides quick profile editing access (Kutoa ufikiaji wa haraka wa kuhariri profaili)
 * - Handles new user onboarding experience (Kushughulikia uzoefu wa watumiaji wapya)
 * 
 * PROPS INTERFACE / KIOLESURA CHA PROPS:
 * - profile: User profile data from database
 * - user: Authentication user object
 * - isNewUser: Boolean indicating if user is new
 * - onProfileEdit: Callback to open profile edit dialog
 * - onDismissWelcome: Callback to dismiss welcome banner
 * - propertiesCount: Number of user's properties
 */

import React from 'react';
import WelcomeBanner from '@/components/host/dashboard/dashboardCommon/WelcomeBanner';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

interface DashboardHeaderProps {
  profile: Profile | null;
  user: User | null;
  isNewUser: boolean;
  onProfileEdit: () => void;
  onDismissWelcome: () => void;
  propertiesCount: number;
}

/**
 * DASHBOARD HEADER COMPONENT
 * =========================
 * 
 * Renders the top section of the dashboard including welcome banner
 * and user profile information.
 * 
 * Inaonyesha sehemu ya juu ya dashibodi ikijumuisha banner ya kukaribisha
 * na maelezo ya profaili ya mtumiaji.
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  user,
  isNewUser,
  onProfileEdit,
  onDismissWelcome,
  propertiesCount
}) => {
  return (
    <WelcomeBanner
      profile={profile}
      user={user}
      isNewUser={isNewUser}
      onProfileEdit={onProfileEdit}
      onDismissWelcome={onDismissWelcome}
      propertiesCount={propertiesCount}
    />
  );
};

export default DashboardHeader;