-- Create admin_activity_log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_log_action_type ON admin_activity_log(action_type);
CREATE INDEX idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX idx_admin_activity_log_target ON admin_activity_log(target_type, target_id);

-- Enable RLS
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin can view all activity logs
CREATE POLICY "Admins can view all activity logs"
ON admin_activity_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
ON admin_activity_log FOR INSERT
WITH CHECK (true);

-- Add comments
COMMENT ON TABLE admin_activity_log IS 'Tracks all admin actions for audit purposes';
COMMENT ON COLUMN admin_activity_log.action_type IS 'Type of action: approve_property, reject_property, suspend_user, etc.';
COMMENT ON COLUMN admin_activity_log.target_type IS 'Type of target: property, user, booking, settings';
COMMENT ON COLUMN admin_activity_log.details IS 'Additional details about the action in JSON format';
