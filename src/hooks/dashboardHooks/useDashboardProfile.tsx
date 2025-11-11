/**
 * useDashboardProfile.tsx - Profile Management Hook
 * =================================================
 * 
 * Custom hook for managing user profile operations in the dashboard.
 * Handles profile fetching, creation, and updates.
 */

import { useState } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

export interface ProfileFormData {
  name: string;
  phone: string;
  is_host: boolean;
}

interface UseDashboardProfileReturn {
  profile: Profile | null;
  profileForm: ProfileFormData;
  profileLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setProfileForm: (form: ProfileFormData) => void;
  setProfileLoading: (loading: boolean) => void;
  fetchProfile: (user: User) => Promise<void>;
  createBasicProfile: (user: User) => Promise<void>;
  handleProfileSubmit: (e: React.FormEvent, user: User, onSuccess: () => void) => Promise<void>;
  handleProfileInputChange: (field: keyof ProfileFormData, value: string) => void;
}

export const useDashboardProfile = (): UseDashboardProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: '',
    phone: '',
    is_host: true
  });

  const fetchProfile = async (user: User): Promise<void> => {
    if (!user) {
      console.error('No user found when trying to fetch profile');
      return;
    }

    console.log('Fetching profile for user:', user.id);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data found:', data);
        setProfile(data as Profile);
        setProfileForm({
          name: (data as Profile).name || '',
          phone: (data as Profile).phone || '',
          is_host: (data as Profile).is_host || true
        });
      } else {
        console.log('No profile data found, creating basic profile for user');
        await createBasicProfile(user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const createBasicProfile = async (user: User): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('Creating basic profile for user:', user.id);
      const basicProfileData = {
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mtumiaji',
        phone: '',
        is_host: true
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(basicProfileData as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating basic profile:', error);
        setProfileForm({
          name: basicProfileData.name,
          phone: '',
          is_host: true
        });
      } else {
        console.log('Basic profile created successfully:', data);
        setProfile(data as Profile);
        setProfileForm({
          name: (data as Profile).name || '',
          phone: (data as Profile).phone || '',
          is_host: (data as Profile).is_host || true
        });
      }
    } catch (error) {
      console.error('Error in createBasicProfile:', error);
      setProfileForm({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mtumiaji',
        phone: '',
        is_host: true
      });
    }
  };

  const handleProfileSubmit = async (
    e: React.FormEvent, 
    user: User,
    onSuccess: () => void
  ): Promise<void> => {
    e.preventDefault();
    if (!user) return;

    try {
      setProfileLoading(true);
      
      const profileData = {
        user_id: user.id,
        name: profileForm.name,
        phone: profileForm.phone,
        is_host: profileForm.is_host
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData as any, { onConflict: 'user_id' });

      if (error) throw error;

      onSuccess();
      await fetchProfile(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileInputChange = (field: keyof ProfileFormData, value: string): void => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    profile,
    profileForm,
    profileLoading,
    setProfile,
    setProfileForm,
    setProfileLoading,
    fetchProfile,
    createBasicProfile,
    handleProfileSubmit,
    handleProfileInputChange
  };
};
