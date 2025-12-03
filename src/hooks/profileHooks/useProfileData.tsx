/**
 * useProfileData.tsx - Profile Data Management Hook
 * =================================================
 * 
 * Custom hook for managing user profile data operations.
 * Handles profile fetching, creation, and state management.
 * 
 * FEATURES / VIPENGELE:
 * - Fetch user profile from database
 * - Create basic profile for new users
 * - Manage profile state
 * - Handle loading states
 * 
 * USAGE / MATUMIZI:
 * const { profile, loading, fetchProfile, createBasicProfile } = useProfileData(user);
 */

import { useState } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

import type { ProfileFormData } from '@/types/user';

/**
 * Hook return type interface
 * Muundo wa matokeo ya hook
 */
interface UseProfileDataReturn {
  profile: Profile | null;
  loading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: (user: User) => Promise<void>;
  createBasicProfile: (user: User) => Promise<Profile | null>;
}

/**
 * useProfileData Hook
 * ===================
 * 
 * Manages profile data fetching and creation.
 * Inasimamia kupata na kuunda data ya wasifu.
 */
export const useProfileData = (): UseProfileDataReturn => {
  // Profile state - Hali ya wasifu
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Loading state - Hali ya kupakia
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user profile from database
   * Pata wasifu wa mtumiaji kutoka database
   * 
   * @param user - Authenticated user object
   * @throws Error if profile fetch fails
   */
  const fetchProfile = async (user: User): Promise<void> => {
    if (!user) {
      console.error('No user found when trying to fetch profile');
      return;
    }

    console.log('Fetching profile for user:', user.id);

    try {
      setLoading(true);
      
      // Query profile from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Profile fetch result:', { data, error });

      // Handle errors (ignore PGRST116 which means no rows found)
      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        throw error;
      }

      // Set profile if found
      if (data) {
        console.log('Profile data found:', data);
        setProfile(data);
      } else {
        console.log('No profile data found');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create basic profile for new users
   * Unda wasifu wa msingi kwa watumiaji wapya
   * 
   * @param user - Authenticated user object
   * @returns Created profile or null if failed
   */
  const createBasicProfile = async (user: User): Promise<Profile | null> => {
    if (!user) return null;

    try {
      console.log('Creating basic profile for user:', user.id);
      
      // Prepare basic profile data
      const basicProfile: {
        user_id: string;
        name: string;
        phone: string;
        is_host: boolean;
      } = {
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mtumiaji',
        phone: '',
        is_host: false
      };

      // Insert profile into database
      const { data, error } = await supabase
        .from('profiles')
        .insert([basicProfile as never])
        .select()
        .single();

      if (error) {
        console.error('Error creating basic profile:', error);
        throw error;
      }

      console.log('Basic profile created successfully:', data);
      
      // Update profile state
      if (data) {
        setProfile(data);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error in createBasicProfile:', error);
      return null;
    }
  };

  return {
    profile,
    loading,
    setProfile,
    setLoading,
    fetchProfile,
    createBasicProfile
  };
};
