/**
 * USER & PROFILE TYPES
 * ====================
 * 
 * Type definitions for user profiles, authentication, and user-related data
 * 
 * CURRENT SYSTEM:
 * - Users have roles: 'user' or 'admin'
 * - Users can be hosts via is_host flag (not a separate role)
 * - No tenant/landlord distinction - all users are equal, some choose to host
 */

import type { Tables } from '@/lib/integrations/supabase/types';

/**
 * Profile Type
 * Base profile type from database
 */
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  bio: string;
  location: string;
  avatar_url: string;
  is_host: boolean;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

/**
 * Profile Form Data
 * Form data structure for profile editing
 */
export interface ProfileFormData {
  name: string;
  phone: string;
  bio: string;
  location: string;
  is_host: boolean;
  avatar_url: string;
}

/**
 * Extended Profile Type
 * Profile with additional computed or joined data
 */
export type ExtendedProfile = Tables<'profiles'>;

/**
 * User Role Enum
 * Only two roles in the system
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}
