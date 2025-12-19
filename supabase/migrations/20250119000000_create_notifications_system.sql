-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'property', 'system', 'message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  related_id UUID,
  related_type TEXT,
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications"
  ON notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Email preferences
  email_bookings BOOLEAN DEFAULT true,
  email_payments BOOLEAN DEFAULT true,
  email_properties BOOLEAN DEFAULT true,
  email_messages BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  
  -- In-app preferences
  inapp_bookings BOOLEAN DEFAULT true,
  inapp_payments BOOLEAN DEFAULT true,
  inapp_properties BOOLEAN DEFAULT true,
  inapp_messages BOOLEAN DEFAULT true,
  inapp_system BOOLEAN DEFAULT true,
  
  -- Sound preferences
  sound_enabled BOOLEAN DEFAULT true,
  
  -- Digest preferences
  daily_digest BOOLEAN DEFAULT false,
  weekly_summary BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index
CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);

-- Enable RLS
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, type, title, message, action_url, 
    related_id, related_type, priority
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_action_url,
    p_related_id, p_related_type, p_priority
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = now()
  WHERE id = p_notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: New booking notification for host
CREATE OR REPLACE FUNCTION notify_host_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
  v_guest RECORD;
BEGIN
  -- Get property and host details
  SELECT p.*, u.name as host_name
  INTO v_property
  FROM properties p
  JOIN profiles u ON u.id = p.host_id
  WHERE p.id = NEW.property_id;
  
  -- Get guest details
  SELECT name INTO v_guest
  FROM profiles
  WHERE id = NEW.guest_id;
  
  -- Create notification for host
  PERFORM create_notification(
    v_property.host_id,
    'booking',
    'New Booking Received',
    v_guest.full_name || ' booked ' || v_property.title || ' from ' || 
    to_char(NEW.check_in, 'Mon DD') || ' to ' || to_char(NEW.check_out, 'Mon DD, YYYY'),
    '/host/bookings/' || NEW.id,
    NEW.id,
    'booking',
    'high'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_host_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_host_new_booking();

-- Trigger: Booking status change notification for guest
CREATE OR REPLACE FUNCTION notify_guest_booking_status()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
  v_title TEXT;
  v_message TEXT;
BEGIN
  -- Only notify on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get property details
  SELECT title INTO v_property
  FROM properties
  WHERE id = NEW.property_id;
  
  -- Determine notification content based on status
  CASE NEW.status
    WHEN 'confirmed' THEN
      v_title := 'Booking Confirmed!';
      v_message := 'Your booking for ' || v_property.title || ' is confirmed';
    WHEN 'completed' THEN
      v_title := 'How Was Your Stay?';
      v_message := 'Leave a review for ' || v_property.title;
    WHEN 'cancelled' THEN
      v_title := 'Booking Cancelled';
      v_message := 'Your booking for ' || v_property.title || ' was cancelled';
    ELSE
      RETURN NEW;
  END CASE;
  
  -- Create notification for guest
  PERFORM create_notification(
    NEW.guest_id,
    'booking',
    v_title,
    v_message,
    '/bookings/' || NEW.id,
    NEW.id,
    'booking',
    'normal'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_guest_booking_status
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_guest_booking_status();

-- Trigger: Payment success notification
CREATE OR REPLACE FUNCTION notify_payment_success()
RETURNS TRIGGER AS $$
DECLARE
  v_booking RECORD;
  v_property RECORD;
BEGIN
  -- Only notify on status change to completed
  IF OLD.status = 'completed' OR NEW.status != 'completed' THEN
    RETURN NEW;
  END IF;
  
  -- Get booking and property details
  SELECT b.*, p.title as property_title, p.host_id
  INTO v_booking
  FROM bookings b
  JOIN properties p ON p.id = b.property_id
  WHERE b.id = NEW.booking_id;
  
  -- Notify guest
  PERFORM create_notification(
    v_booking.guest_id,
    'payment',
    'Payment Confirmed',
    'Your payment of TZS ' || to_char(NEW.amount, 'FM999,999,999') || ' was successful',
    '/bookings/' || v_booking.id,
    NEW.id,
    'payment',
    'normal'
  );
  
  -- Notify host
  PERFORM create_notification(
    v_booking.host_id,
    'payment',
    'Payment Received',
    'You received TZS ' || to_char(NEW.amount, 'FM999,999,999') || ' from ' || 
    (SELECT name FROM profiles WHERE id = v_booking.guest_id),
    '/host/bookings/' || v_booking.id,
    NEW.id,
    'payment',
    'normal'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_payment_success
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_success();

-- Trigger: Property status change notification for host
CREATE OR REPLACE FUNCTION notify_property_status()
RETURNS TRIGGER AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_priority TEXT;
BEGIN
  -- Only notify on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Determine notification content based on status
  CASE NEW.status
    WHEN 'approved' THEN
      v_title := 'Property Approved! 🎉';
      v_message := NEW.title || ' is now live and visible to guests';
      v_priority := 'high';
    WHEN 'rejected' THEN
      v_title := 'Property Needs Revision';
      v_message := NEW.title || ' was rejected. Please review and resubmit.';
      v_priority := 'high';
    WHEN 'pending' THEN
      v_title := 'Property Submitted';
      v_message := 'Your property ' || NEW.title || ' is under review';
      v_priority := 'normal';
    ELSE
      RETURN NEW;
  END CASE;
  
  -- Create notification for host
  PERFORM create_notification(
    NEW.host_id,
    'property',
    v_title,
    v_message,
    '/host/properties/' || NEW.id,
    NEW.id,
    'property',
    v_priority
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_property_status
  AFTER UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_status();

-- Trigger: New property submission notification for admins
CREATE OR REPLACE FUNCTION notify_admin_new_property()
RETURNS TRIGGER AS $$
DECLARE
  v_admin RECORD;
  v_host_name TEXT;
BEGIN
  -- Get host name
  SELECT name INTO v_host_name
  FROM profiles
  WHERE id = NEW.host_id;
  
  -- Notify all admins
  FOR v_admin IN 
    SELECT id FROM profiles WHERE role = 'admin'
  LOOP
    PERFORM create_notification(
      v_admin.id,
      'property',
      'New Property Submitted',
      v_host_name || ' submitted ' || NEW.title || ' for approval',
      '/admin/properties?status=pending',
      NEW.id,
      'property',
      'high'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_admin_new_property
  AFTER INSERT ON properties
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION notify_admin_new_property();

-- Function to create welcome notification for new users
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NEW.id,
    'system',
    'Welcome to NyumbaLink! 🏠',
    'Start exploring amazing properties or list your own',
    '/properties',
    NULL,
    NULL,
    'normal'
  );
  
  -- Create default notification preferences
  INSERT INTO user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_welcome_notification
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_welcome_notification();

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = auth.uid() AND is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notification_count TO authenticated;
