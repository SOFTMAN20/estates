/**
 * PROTECTED ADMIN ROUTE COMPONENT
 * ===============================
 * 
 * Wrapper component that protects admin routes from unauthorized access
 */

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, logUnauthorizedAccess } from '@/lib/adminAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    async function checkAdminAccess() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setIsCheckingAdmin(false);
        setHasAdminAccess(false);
        return;
      }

      try {
        const adminStatus = await isAdmin();
        setHasAdminAccess(adminStatus);

        // Log unauthorized access attempt
        if (!adminStatus) {
          await logUnauthorizedAccess(
            user.id,
            location.pathname,
            // IP address would need to be fetched from a service
            undefined
          );

          toast.error('Access Denied', {
            description: 'You do not have permission to access the admin panel.'
          });
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setHasAdminAccess(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    }

    checkAdminAccess();
  }, [user, authLoading, location.pathname]);

  // Show loading spinner while checking authentication and admin status
  if (authLoading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect to home if not admin
  if (!hasAdminAccess) {
    return <Navigate to="/" replace />;
  }

  // Render protected content
  return <>{children}</>;
}
