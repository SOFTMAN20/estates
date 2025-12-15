-- =====================================================
-- ADMIN NOTIFICATIONS TABLE
-- =====================================================
-- Stores notifications specifically for admin users
-- Includes quick actions and priority levels
-- =====================================================

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Notification details
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'property_submission',
    'user_report',
    'payment_failed',
    'system_error',
    'unusual_activity',
    'daily_summary',
    'booking_issue',
    'review_flagged'
  )),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES profiles(id),
  
  -- Related entities
  related_type TEXT CHECK (related_type IN ('property', 'user', 'booking', 'payment', 'review', 'report')),
  related_id UUID,
  
  -- Quick actions data
  action_data JSONB DEFAULT '{}',
  -- Example: { "property_id": "uuid", "actions": ["approve", "reject"] }
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Indexes
  CONSTRAINT valid_related_data CHECK (
    (related_type IS NULL AND related_id IS NULL) OR
    (related_type IS NOT NULL AND related_id IS NOT NULL)
  )
);

-- Create indexes for performance
CREATE INDEX idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX idx_admin_notifications_priority ON admin_notifications(priority);
CREATE INDEX idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX idx_admin_notifications_related ON admin_notifications(related_type, related_id);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view notifications
CREATE POLICY "Admins can view all notifications"
ON admin_notifications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Policy: Only admins can mark as read
CREATE POLICY "Admins can update notifications"
ON admin_notifications
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

-- Policy: System can insert notifications
CREATE POLICY "System can insert notifications"
ON admin_notifications
FOR INSERT
WITH CHECK (true);

-- =====================================================
-- TRIGGER: Create notification on property submission
-- =====================================================

CREATE OR REPLACE FUNCTION notify_admin_property_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify on new pending properties
  IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
    INSERT INTO admin_notifications (
      title,
      message,
      type,
      priority,
      related_type,
      related_id,
      action_data
    ) VALUES (
      'New Property Submission',
      'Property "' || NEW.title || '" requires approval',
      'property_submission',
      'normal',
      'property',
      NEW.id,
      jsonb_build_object(
        'property_id', NEW.id,
        'property_title', NEW.title,
        'actions', ARRAY['approve', 'reject']
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_property_submission
AFTER INSERT OR UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION notify_admin_property_submission();

-- =====================================================
-- TRIGGER: Create notification on payment failure
-- =====================================================

CREATE OR REPLACE FUNCTION notify_admin_payment_failed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify on failed payments over a certain amount
  IF NEW.status = 'failed' AND NEW.amount > 100000 THEN
    INSERT INTO admin_notifications (
      title,
      message,
      type,
      priority,
      related_type,
      related_id,
      metadata
    ) VALUES (
      'High-Value Payment Failed',
      'Payment of TZS ' || NEW.amount || ' failed',
      'payment_failed',
      'high',
      'payment',
      NEW.id,
      jsonb_build_object(
        'amount', NEW.amount,
        'booking_id', NEW.booking_id,
        'payment_method', NEW.payment_method
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_payment_failed
AFTER UPDATE ON payments
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'failed')
EXECUTE FUNCTION notify_admin_payment_failed();

-- =====================================================
-- FUNCTION: Create notification manually
-- =====================================================

CREATE OR REPLACE FUNCTION create_admin_notification(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_priority TEXT DEFAULT 'normal',
  p_related_type TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL,
  p_action_data JSONB DEFAULT '{}'::jsonb,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO admin_notifications (
    title,
    message,
    type,
    priority,
    related_type,
    related_id,
    action_data,
    metadata
  ) VALUES (
    p_title,
    p_message,
    p_type,
    p_priority,
    p_related_type,
    p_related_id,
    p_action_data,
    p_metadata
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Mark notification as read
-- =====================================================

CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE admin_notifications
  SET 
    is_read = true,
    read_at = NOW(),
    read_by = auth.uid()
  WHERE id = notification_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get unread notification count
-- =====================================================

CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count
  FROM admin_notifications
  WHERE is_read = false
  AND (expires_at IS NULL OR expires_at > NOW());
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Insert sample notifications for testing
-- =====================================================

-- Sample property submission notification
INSERT INTO admin_notifications (
  title,
  message,
  type,
  priority,
  related_type,
  related_id,
  action_data
)
SELECT 
  'New Property Submission',
  'Property "' || title || '" requires approval',
  'property_submission',
  'normal',
  'property',
  id,
  jsonb_build_object(
    'property_id', id,
    'property_title', title,
    'actions', ARRAY['approve', 'reject']
  )
FROM properties
WHERE status = 'pending'
LIMIT 3;

-- Sample system notification
INSERT INTO admin_notifications (
  title,
  message,
  type,
  priority,
  metadata
) VALUES (
  'System Health Check',
  'All systems operational. Database backup completed successfully.',
  'daily_summary',
  'low',
  jsonb_build_object(
    'backup_size', '2.5 GB',
    'backup_time', '2 minutes',
    'status', 'success'
  )
);

-- Add comments
COMMENT ON TABLE admin_notifications IS 'Stores notifications for admin users with quick actions and priority levels';
COMMENT ON COLUMN admin_notifications.type IS 'Type of notification: property_submission, user_report, payment_failed, system_error, unusual_activity, daily_summary';
COMMENT ON COLUMN admin_notifications.priority IS 'Priority level: low, normal, high, urgent';
COMMENT ON COLUMN admin_notifications.action_data IS 'JSON data for quick actions (e.g., approve/reject buttons)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin notifications system created successfully';
  RAISE NOTICE '📊 Sample notifications inserted';
  RAISE NOTICE '🔔 Triggers enabled for property submissions and payment failures';
END $$;
