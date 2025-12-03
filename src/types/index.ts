/**
 * TYPES INDEX
 * ===========
 * 
 * Central export point for all type definitions
 * Import from specific type files for better organization
 */

// Re-export Supabase types
export type { Tables } from '@/lib/integrations/supabase/types';

// User & Profile types
export * from './user';

// Property types
export * from './property';

// Authentication types
export * from './auth';

// Analytics types
export * from './analytics';

// Search & Filter types
export * from './search';