/**
 * useProfileForm.tsx - Profile Form Management Hook
 * =================================================
 * 
 * Custom hook for managing profile form state and operations.
 * Handles form data, editing state, and save/cancel operations.
 * 
 * FEATURES / VIPENGELE:
 * - Manage form data state
 * - Handle form editing mode
 * - Save profile updates
 * - Cancel and reset form
 * 
 * USAGE / MATUMIZI:
 * const { formData, editing, saving, handleSave, handleCancel, ... } = useProfileForm(user, profile);
 */

import { useState } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';
import type { ProfileFormData } from './useProfileData';

type Profile = Tables<'profiles'>;

/**
 * Hook return type interface
 * Muundo wa matokeo ya hook
 */
interface UseProfileFormReturn {
  formData: ProfileFormData;
  editing: boolean;
  saving: boolean;
  setFormData: (data: ProfileFormData) => void;
  setEditing: (editing: boolean) => void;
  setSaving: (saving: boolean) => void;
  handleInputChange: (field: keyof ProfileFormData, value: string | boolean) => void;
  handleSave: (user: User, onSuccess: () => void, onError: (message: string) => void) => Promise<void>;
  handleCancel: (profile: Profile | null) => void;
  initializeFormData: (profile: Profile) => void;
  handleAvatarUploadSuccess: (url: string, onRefresh: () => void) => void;
}

/**
 * useProfileForm Hook
 * ===================
 * 
 * Manages profile form state and operations.
 * Inasimamia hali na shughuli za fomu ya wasifu.
 */
export const useProfileForm = (): UseProfileFormReturn => {
  // Form data state - Hali ya data ya fomu
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    bio: '',
    location: '',
    is_host: false,
    avatar_url: ''
  });

  // Editing state - Hali ya kuhariri
  const [editing, setEditing] = useState(false);
  
  // Saving state - Hali ya kuhifadhi
  const [saving, setSaving] = useState(false);

  /**
   * Initialize form data from profile
   * Anzisha data ya fomu kutoka kwa wasifu
   * 
   * @param profile - Profile object to initialize from
   */
  const initializeFormData = (profile: Profile): void => {
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      location: profile.location || '',
      is_host: profile.is_host || false,
      avatar_url: profile.avatar_url || ''
    });
  };

  /**
   * Handle input field changes
   * Simamia mabadiliko ya sehemu za kuingiza
   * 
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field: keyof ProfileFormData, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handle avatar upload success
   * Simamia mafanikio ya kupakia picha ya wasifu
   * 
   * @param url - New avatar URL
   * @param onRefresh - Callback to refresh profile data
   */
  const handleAvatarUploadSuccess = (url: string, onRefresh: () => void): void => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    onRefresh();
  };

  /**
   * Save profile updates to database
   * Hifadhi mabadiliko ya wasifu kwenye database
   * 
   * @param user - Authenticated user object
   * @param onSuccess - Success callback
   * @param onError - Error callback with message
   */
  const handleSave = async (
    user: User,
    onSuccess: () => void,
    onError: (message: string) => void
  ): Promise<void> => {
    if (!user) return;

    try {
      setSaving(true);

      // Prepare update data
      const updateData: {
        name: string;
        phone: string;
        bio: string;
        location: string;
        is_host: boolean;
        profile_completed: boolean;
      } = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        is_host: formData.is_host,
        profile_completed: true
      };

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update(updateData as never)
        .eq('user_id', user.id);

      if (error) throw error;

      // Exit editing mode
      setEditing(false);
      
      // Call success callback
      onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Call error callback with message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Imeshindikana kubadilisha wasifu';
      onError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancel editing and reset form
   * Ghairi kuhariri na rudisha fomu
   * 
   * @param profile - Profile object to reset to
   */
  const handleCancel = (profile: Profile | null): void => {
    if (profile) {
      initializeFormData(profile);
    }
    setEditing(false);
  };

  return {
    formData,
    editing,
    saving,
    setFormData,
    setEditing,
    setSaving,
    handleInputChange,
    handleSave,
    handleCancel,
    initializeFormData,
    handleAvatarUploadSuccess
  };
};
