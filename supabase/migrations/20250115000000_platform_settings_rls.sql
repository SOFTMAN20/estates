-- Enable RLS on platform_settings table
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read platform settings (needed for public access to commission rates, etc.)
CREATE POLICY "Anyone can read platform settings"
ON platform_settings
FOR SELECT
USING (true);

-- Policy: Only admins can insert platform settings
CREATE POLICY "Admins can insert platform settings"
ON platform_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Policy: Only admins can update platform settings
CREATE POLICY "Admins can update platform settings"
ON platform_settings
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

-- Policy: Only admins can delete platform settings
CREATE POLICY "Admins can delete platform settings"
ON platform_settings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Insert default platform settings if they don't exist
INSERT INTO platform_settings (key, value, data_type, updated_by)
VALUES
  ('platform_name', 'NyumbaLink', 'string', NULL),
  ('support_email', 'support@nyumbalink.com', 'string', NULL),
  ('commission_rate', '10', 'number', NULL),
  ('service_fee_percentage', '10', 'number', NULL),
  ('min_booking_months', '1', 'number', NULL),
  ('max_advance_booking_months', '12', 'number', NULL),
  ('currency', 'TZS', 'string', NULL),
  ('mpesa_enabled', 'false', 'boolean', NULL),
  ('card_payments_enabled', 'false', 'boolean', NULL),
  ('bank_transfer_enabled', 'false', 'boolean', NULL),
  ('auto_approve_properties', 'false', 'boolean', NULL),
  ('require_property_verification', 'true', 'boolean', NULL),
  ('max_images_per_property', '10', 'number', NULL),
  ('email_notifications_enabled', 'true', 'boolean', NULL),
  ('admin_alerts_enabled', 'true', 'boolean', NULL),
  ('auto_approve_after_days_enabled', 'false', 'boolean', NULL),
  ('auto_approve_days', '7', 'number', NULL),
  ('auto_approve_verified_hosts', 'false', 'boolean', NULL),
  ('content_guidelines', 'All property listings must include accurate information. Photos must be recent and represent the actual property. Misleading information will result in listing removal.', 'string', NULL),
  ('prohibited_words', '', 'string', NULL),
  ('maintenance_mode_enabled', 'false', 'boolean', NULL),
  ('maintenance_message', 'We''re currently performing maintenance. Please check back soon.', 'string', NULL)
ON CONFLICT (key) DO NOTHING;
