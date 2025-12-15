/**
 * ADMIN ROUTE GUARD
 * =================
 * 
 * Protects admin routes by checking user role
 * Redirects non-admin users to home page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Check if user is logged in
    if (!user) {
      toast.error('Please sign in to access admin panel');
      navigate('/signin', { replace: true });
      return;
    }

    // Check if user has admin role
    if (profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
      toast.error('You do not have permission to access the admin panel');
      navigate('/', { replace: true });
      return;
    }
  }, [user, profile, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show loading if profile not loaded yet
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    return null; // Will redirect in useEffect
  }

  // User is admin, render children
  return <>{children}</>;
}
