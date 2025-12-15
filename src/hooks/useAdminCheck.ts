/**
 * ADMIN CHECK HOOK
 * ================
 * 
 * React hook for checking admin status in components
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, isSuperAdmin, getUserRole } from '@/lib/adminAuth';

interface AdminCheckResult {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string | null;
  loading: boolean;
}

/**
 * Hook to check if current user has admin privileges
 * @returns AdminCheckResult object with admin status and loading state
 */
export function useAdminCheck(): AdminCheckResult {
  const { user, loading: authLoading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setIsAdminUser(false);
        setIsSuperAdminUser(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const [adminStatus, superAdminStatus, role] = await Promise.all([
          isAdmin(),
          isSuperAdmin(),
          getUserRole()
        ]);

        setIsAdminUser(adminStatus);
        setIsSuperAdminUser(superAdminStatus);
        setUserRole(role);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminUser(false);
        setIsSuperAdminUser(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user, authLoading]);

  return {
    isAdmin: isAdminUser,
    isSuperAdmin: isSuperAdminUser,
    role: userRole,
    loading
  };
}
