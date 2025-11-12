/**
 * Profile Hooks Index
 * ===================
 * 
 * Central export point for all profile-related custom hooks.
 * Mahali pa kuexport hooks zote za wasifu.
 * 
 * AVAILABLE HOOKS / HOOKS ZINAZOPATIKANA:
 * - useProfileData: Profile data fetching and management
 * - useProfileForm: Profile form state and operations
 * - useProfileUtils: Utility functions for profile operations
 * 
 * USAGE / MATUMIZI:
 * import { useProfileData, useProfileForm, useProfileUtils } from '@/hooks/profileHooks';
 */

// Export all profile hooks
export { useProfileData } from './useProfileData';
export { useProfileForm } from './useProfileForm';
export { useProfileUtils } from './useProfileUtils';

// Export types
export type { ProfileFormData } from './useProfileData';
