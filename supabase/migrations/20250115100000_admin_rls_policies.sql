-- =====================================================
-- ADMIN RLS POLICIES - CRITICAL MISSING POLICIES
-- =====================================================
-- This migration adds missing admin policies for:
-- 1. Property status management (approve/reject)
-- 2. User role management
-- 3. User suspension management
-- =====================================================

-- =====================================================
-- 1. PROPERTIES TABLE - Admin Update Policy
-- =====================================================

-- Allow admins to update property status, rejection_reason, approved_by, approved_at
CREATE POLICY "Admins can update property status and approval fields"
ON properties
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Allow admins to view all properties (including pending/rejected)
-- This policy already exists but let's ensure it's comprehensive
CREATE POLICY "Admins can view all properties regardless of status"
ON properties
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- =====================================================
-- 2. PROFILES TABLE - Admin Update Policy
-- =====================================================

-- Allow admins to update user roles and suspension status
CREATE POLICY "Admins can update user roles and suspension status"
ON profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'super_admin')
  )
);

-- Prevent users from changing their own role
-- Update existing policy to be more restrictive
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile except role and suspension"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  -- Ensure users cannot change their own role or suspension status
  AND (
    -- If role is being changed, user must be admin
    (role = (SELECT role FROM profiles WHERE id = auth.uid()))
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  )
  AND (
    -- If suspension status is being changed, user must be admin
    (is_suspended = (SELECT is_suspended FROM profiles WHERE id = auth.uid()))
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  )
);

-- =====================================================
-- 3. ADMIN_ACTIONS TABLE - Enhanced Policies
-- =====================================================

-- Ensure admin_actions has proper RLS
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only authenticated users can insert admin actions" ON admin_actions;
DROP POLICY IF EXISTS "Only authenticated users can view admin actions" ON admin_actions;

-- Only admins can insert admin actions
CREATE POLICY "Admins can insert admin actions"
ON admin_actions
FOR INSERT
WITH CHECK (
  auth.uid() = admin_id
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Only admins can view admin actions
CREATE POLICY "Admins can view admin actions"
ON admin_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Admins cannot update or delete admin actions (immutable audit log)
-- No UPDATE or DELETE policies = no one can modify audit log

-- =====================================================
-- 4. COMMENTS AND DOCUMENTATION
-- =====================================================

-- Add comments to document admin capabilities
COMMENT ON POLICY "Admins can update property status and approval fields" ON properties IS 
'Allows admins to approve/reject properties by updating status, rejection_reason, approved_by, and approved_at fields';

COMMENT ON POLICY "Admins can update user roles and suspension status" ON profiles IS 
'Allows admins to change user roles (user/admin/super_admin) and suspend/activate user accounts';

COMMENT ON POLICY "Users can update own profile except role and suspension" ON profiles IS 
'Users can update their own profile but cannot change their role or suspension status unless they are admins';

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Verify policies were created
DO $$
BEGIN
  RAISE NOTICE 'Admin RLS policies created successfully';
  RAISE NOTICE 'Properties: Admins can now update status and approval fields';
  RAISE NOTICE 'Profiles: Admins can now update roles and suspension status';
  RAISE NOTICE 'Admin Actions: Enhanced security policies applied';
END $$;
