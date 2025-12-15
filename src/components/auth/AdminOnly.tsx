/**
 * ADMIN ONLY COMPONENT
 * ====================
 * 
 * Wrapper component that only renders children if user is admin
 * Useful for conditionally showing admin-only features in any component
 */

import { useAdminCheck } from '@/hooks/useAdminCheck';

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireSuperAdmin?: boolean;
}

/**
 * AdminOnly Component
 * 
 * Conditionally renders children based on admin status
 * 
 * @param children - Content to show if user is admin
 * @param fallback - Optional content to show if user is not admin
 * @param requireSuperAdmin - If true, requires super_admin role instead of just admin
 * 
 * @example
 * // Show button only to admins
 * <AdminOnly>
 *   <Button onClick={approveProperty}>Approve</Button>
 * </AdminOnly>
 * 
 * @example
 * // Show different content for non-admins
 * <AdminOnly fallback={<p>Access denied</p>}>
 *   <AdminPanel />
 * </AdminOnly>
 * 
 * @example
 * // Require super admin
 * <AdminOnly requireSuperAdmin>
 *   <DangerousAction />
 * </AdminOnly>
 */
export function AdminOnly({ 
  children, 
  fallback = null,
  requireSuperAdmin = false 
}: AdminOnlyProps) {
  const { isAdmin, isSuperAdmin, loading } = useAdminCheck();

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Check appropriate permission level
  const hasPermission = requireSuperAdmin ? isSuperAdmin : isAdmin;

  // Render children if has permission, otherwise render fallback
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
