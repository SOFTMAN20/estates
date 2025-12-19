-- Trigger: New booking notification for host
CREATE OR REPLACE FUNCTION notify_host_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
  v_guest RECORD;
BEGIN
  SELECT p.*, u.name as host_name
  INTO v_property
  FROM properties p
  JOIN profiles u ON u.id = p.host_id
  WHERE p.id = NEW.property_id;
  
  SELECT name INTO v_guest
  FROM profiles
  WHERE id = NEW.guest_id;
  
  PERFORM create_notification(
    v_property.host_id,
    'booking',
    'New Booking Received',
    v_guest.name || ' booked ' || v_property.title,
    '/host/bookings/' || NEW.id,
    NEW.id,
    'booking',
    'high'
  );
  
  PERFORM create_notification(
    NEW.guest_id,
    'booking',
    'Booking Request Sent',
    'Your booking for ' || v_property.title || ' is pending confirmation',
    '/bookings/' || NEW.id,
    NEW.id,
    'booking',
    'normal'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_host_new_booking();
