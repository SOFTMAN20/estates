/**
 * ADMIN AUTHENTICATION UTILITIES
 * ==============================
 * 
 * Utilities for checking admin permissions and protecting admin routes
 */

import { supabase } from '@/lib/integrations/supabase/client';

/**
 * Check if the current user is an admin
 * @returns Promise<boolean> - true if user is admin or super_admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data.role === 'admin' || data.role === 'super_admin';
  } catch (error) {
    console.error('Error in isAdmin check:', error);
    return false;
  }
}

/**
 * Check if the current user is a super admin
 * @returns Promise<boolean> - true if user is super_admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error checking super admin status:', error);
      return false;
    }

    return data.role === 'super_admin';
  } catch (error) {
    console.error('Error in isSuperAdmin check:', error);
    return false;
  }
}

/**
 * Get the current user's role
 * @returns Promise<string | null> - user role or null
 */
export async function getUserRole(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data.role;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Log unauthorized access attempt
 * @param userId - User ID attempting access
 * @param attemptedRoute - Route they tried to access
 * @param ipAddress - IP address (optional)
 */
export async function logUnauthorizedAccess(
  userId: string,
  attemptedRoute: string,
  ipAddress?: string
): Promise<void> {
  try {
    await supabase.from('admin_actions').insert({
      admin_id: userId,
      action_type: 'unauthorized_access_attempt',
      target_id: userId, // Use user ID as target since they're the one attempting access
      target_type: 'route',
      details: {
        attempted_route: attemptedRoute,
        ip_address: ipAddress,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error logging unauthorized access:', error);
  }
}
