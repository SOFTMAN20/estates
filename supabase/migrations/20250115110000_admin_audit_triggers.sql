-- =====================================================
-- ADMIN AUDIT LOGGING TRIGGERS
-- =====================================================
-- Automatically log admin actions to admin_actions table
-- Tracks: property approvals, role changes, suspensions, booking cancellations
-- =====================================================

-- =====================================================
-- 1. PROPERTY STATUS CHANGE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION log_property_status_change()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  ) INTO is_admin;

  -- Only log if status changed and user is admin
  IF OLD.status IS DISTINCT FROM NEW.status AND is_admin THEN
    INSERT INTO admin_actions (
      admin_id,
      action_type,
      target_type,
      target_id,
      details
    ) VALUES (
      auth.uid(),
      CASE 
        WHEN NEW.status = 'approved' THEN 'approve_property'
        WHEN NEW.status = 'rejected' THEN 'reject_property'
        ELSE 'update_property_status'
      END,
      'property',
      NEW.id,
      jsonb_build_object(
        'property_title', NEW.title,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'rejection_reason', NEW.rejection_reason,
        'approved_at', NEW.approved_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS log_property_status_changes ON properties;
CREATE TRIGGER log_property_status_changes
AFTER UPDATE ON properties
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_property_status_change();

COMMENT ON FUNCTION log_property_status_change() IS 
'Automatically logs property approval/rejection actions to admin_actions table';

-- =====================================================
-- 2. USER ROLE CHANGE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION log_user_role_change()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
  target_user_name TEXT;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  ) INTO is_admin;

  -- Get target user's name
  SELECT name INTO target_user_name FROM profiles WHERE id = NEW.id;

  -- Only log if role changed and user is admin
  IF OLD.role IS DISTINCT FROM NEW.role AND is_admin THEN
    INSERT INTO admin_actions (
      admin_id,
      action_type,
      target_type,
      target_id,
      details
    ) VALUES (
      auth.uid(),
      'change_user_role',
      'user',
      NEW.id,
      jsonb_build_object(
        'user_name', target_user_name,
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_at', NOW()
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS log_user_role_changes ON profiles;
CREATE TRIGGER log_user_role_changes
AFTER UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role)
EXECUTE FUNCTION log_user_role_change();

COMMENT ON FUNCTION log_user_role_change() IS 
'Automatically logs user role changes to admin_actions table';

-- =====================================================
-- 3. USER SUSPENSION TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION log_user_suspension()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
  target_user_name TEXT;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  ) INTO is_admin;

  -- Get target user's name
  SELECT name INTO target_user_name FROM profiles WHERE id = NEW.id;

  -- Only log if suspension status changed and user is admin
  IF OLD.is_suspended IS DISTINCT FROM NEW.is_suspended AND is_admin THEN
    INSERT INTO admin_actions (
      admin_id,
      action_type,
      target_type,
      target_id,
      details
    ) VALUES (
      auth.uid(),
      CASE 
        WHEN NEW.is_suspended = true THEN 'suspend_user'
        ELSE 'activate_user'
      END,
      'user',
      NEW.id,
      jsonb_build_object(
        'user_name', target_user_name,
        'is_suspended', NEW.is_suspended,
        'suspension_reason', NEW.suspension_reason,
        'changed_at', NOW()
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS log_user_suspensions ON profiles;
CREATE TRIGGER log_user_suspensions
AFTER UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.is_suspended IS DISTINCT FROM NEW.is_suspended)
EXECUTE FUNCTION log_user_suspension();

COMMENT ON FUNCTION log_user_suspension() IS 
'Automatically logs user suspension/activation to admin_actions table';

-- =====================================================
-- 4. BOOKING CANCELLATION BY ADMIN TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION log_booking_admin_action()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
  property_title TEXT;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  ) INTO is_admin;

  -- Get property title
  SELECT title INTO property_title 
  FROM properties 
  WHERE id = NEW.property_id;

  -- Only log if status changed to cancelled by admin
  IF OLD.status IS DISTINCT FROM NEW.status 
     AND NEW.status = 'cancelled' 
     AND is_admin THEN
    INSERT INTO admin_actions (
      admin_id,
      action_type,
      target_type,
      target_id,
      details
    ) VALUES (
      auth.uid(),
      'cancel_booking',
      'booking',
      NEW.id,
      jsonb_build_object(
        'property_title', property_title,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'cancellation_reason', NEW.cancellation_reason,
        'guest_id', NEW.guest_id,
        'host_id', NEW.host_id,
        'cancelled_at', NOW()
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS log_booking_admin_actions ON bookings;
CREATE TRIGGER log_booking_admin_actions
AFTER UPDATE ON bookings
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'cancelled')
EXECUTE FUNCTION log_booking_admin_action();

COMMENT ON FUNCTION log_booking_admin_action() IS 
'Automatically logs booking cancellations by admins to admin_actions table';

-- =====================================================
-- 5. SETTINGS UPDATE TRIGGER (Already exists in code)
-- =====================================================
-- Note: Settings updates are already logged in the useAdminSettings hook
-- No trigger needed as it's handled in application code

-- =====================================================
-- 6. VERIFICATION AND SUMMARY
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'ADMIN AUDIT TRIGGERS CREATED SUCCESSFULLY';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '1. Property Status Changes - LOGGED';
  RAISE NOTICE '2. User Role Changes - LOGGED';
  RAISE NOTICE '3. User Suspensions - LOGGED';
  RAISE NOTICE '4. Booking Cancellations by Admin - LOGGED';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'All admin actions will now be automatically logged';
  RAISE NOTICE 'to the admin_actions table for audit trail';
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- 7. CREATE HELPER VIEW FOR ADMIN ACTIVITY
-- =====================================================

CREATE OR REPLACE VIEW admin_activity_summary AS
SELECT 
  aa.id,
  aa.admin_id,
  p.name as admin_name,
  p.role as admin_role,
  aa.action_type,
  aa.target_type,
  aa.target_id,
  aa.details,
  aa.ip_address,
  aa.created_at,
  -- Extract useful info from details
  aa.details->>'property_title' as property_title,
  aa.details->>'user_name' as target_user_name,
  aa.details->>'old_status' as old_status,
  aa.details->>'new_status' as new_status,
  aa.details->>'rejection_reason' as rejection_reason,
  aa.details->>'suspension_reason' as suspension_reason
FROM admin_actions aa
LEFT JOIN profiles p ON p.id = aa.admin_id
ORDER BY aa.created_at DESC;

COMMENT ON VIEW admin_activity_summary IS 
'Provides a comprehensive view of all admin actions with extracted details for easy reporting';

-- Grant access to authenticated users (admins will see via RLS)
GRANT SELECT ON admin_activity_summary TO authenticated;
