/**
 * AUTHENTICATION TYPES
 * ====================
 * 
 * Type definitions for authentication, sign-in, sign-up, and auth-related data
 */

import type { User, Session } from '@supabase/supabase-js';

/**
 * Sign Up Metadata
 * User metadata for registration
 * Note: All new users start as 'user' role, can become hosts via profile settings
 */
export interface SignUpMetadata {
  full_name: string;
  role?: 'user' | 'admin'; // Defaults to 'user'
}

/**
 * Auth Error
 * Error structure for authentication operations
 */
export interface AuthError {
  message?: string;
}

/**
 * Auth Context Type
 * Type definition for authentication context
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: (navigate?: (path: string, options?: Record<string, unknown>) => void) => Promise<void>;
  checkUserTypeAndRedirect: (navigate: (path: string, options?: Record<string, unknown>) => void) => Promise<void>;
}

/**
 * Login Form Data
 * Form data structure for login
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Register Form Data
 * Form data structure for registration
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
}

/**
 * Auth State
 * Current authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

/**
 * Auth Action Types
 * Action types for auth state management
 */
export enum AuthActionType {
  SIGN_IN_START = 'SIGN_IN_START',
  SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
  SIGN_IN_ERROR = 'SIGN_IN_ERROR',
  SIGN_UP_START = 'SIGN_UP_START',
  SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
  SIGN_UP_ERROR = 'SIGN_UP_ERROR',
  SIGN_OUT = 'SIGN_OUT',
  SET_USER = 'SET_USER',
  SET_SESSION = 'SET_SESSION',
  SET_LOADING = 'SET_LOADING'
}
