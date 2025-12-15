-- =====================================================
-- ADMIN VERIFICATION FUNCTIONS
-- =====================================================
-- 
-- Database-level functions to verify admin permissions
-- These provide an additional security layer beyond RLS policies
--
-- Created: 2025-01-15
-- Purpose: Centralized admin permission checking

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify admin access and log unauthorized attempts
CREATE OR REPLACE FUNCTION verify_admin_access(
  action_description TEXT DEFAULT 'admin_action'
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Check if user is admin
  has_access := is_admin();
  
  -- Log unauthorized access attempt
  IF NOT has_access THEN
    INSERT INTO admin_actions (
      admin_id,
      action_type,
      target_type,
      details
    ) VALUES (
      auth.uid(),
      'unauthorized_access_attempt',
      'system',
      jsonb_build_object(
        'action', action_description,
        'timestamp', NOW(),
        'user_role', get_user_role()
      )
    );
  END IF;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_access(TEXT) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION is_admin() IS 'Returns true if current user has admin or super_admin role';
COMMENT ON FUNCTION is_super_admin() IS 'Returns true if current user has super_admin role';
COMMENT ON FUNCTION get_user_role() IS 'Returns the role of the current user';
COMMENT ON FUNCTION verify_admin_access(TEXT) IS 'Verifies admin access and logs unauthorized attempts';
