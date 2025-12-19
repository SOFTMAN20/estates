-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Ratings
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
  accuracy INTEGER CHECK (accuracy >= 1 AND accuracy <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value INTEGER CHECK (value >= 1 AND value <= 5),
  
  -- Content
  comment TEXT NOT NULL CHECK (length(comment) >= 20),
  images TEXT[],
  
  -- Host response
  host_response TEXT CHECK (length(host_response) <= 500),
  host_response_date TIMESTAMPTZ,
  
  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Create review_helpful table for voting
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Create index
CREATE INDEX idx_review_helpful_review_id ON review_helpful(review_id);
CREATE INDEX idx_review_helpful_user_id ON review_helpful(user_id);

-- Add review statistics to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Guests can create reviews for completed bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.guest_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

CREATE POLICY "Review authors can update within 7 days"
  ON reviews FOR UPDATE
  USING (
    auth.uid() = user_id AND
    created_at > now() - INTERVAL '7 days'
  );

CREATE POLICY "Hosts can update their responses"
  ON reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = reviews.property_id
      AND properties.host_id = auth.uid()
    )
  );

CREATE POLICY "Review authors can delete within 7 days"
  ON reviews FOR DELETE
  USING (
    auth.uid() = user_id AND
    created_at > now() - INTERVAL '7 days'
  );

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for review_helpful
CREATE POLICY "Anyone can view helpful votes"
  ON review_helpful FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote helpful"
  ON review_helpful FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their helpful votes"
  ON review_helpful FOR DELETE
  USING (auth.uid() = user_id);

-- Function to calculate property rating
CREATE OR REPLACE FUNCTION calculate_property_rating(p_property_id UUID)
RETURNS TABLE (
  average_rating NUMERIC,
  total_reviews INT,
  cleanliness_avg NUMERIC,
  communication_avg NUMERIC,
  value_avg NUMERIC,
  location_avg NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(rating), 2),
    COUNT(*)::INT,
    ROUND(AVG(cleanliness), 2),
    ROUND(AVG(communication), 2),
    ROUND(AVG(value), 2),
    ROUND(AVG(location_rating), 2)
  FROM reviews
  WHERE property_id = p_property_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update property rating
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating NUMERIC;
  v_total_reviews INT;
BEGIN
  -- Calculate new average rating
  SELECT 
    ROUND(AVG(rating), 2),
    COUNT(*)::INT
  INTO v_avg_rating, v_total_reviews
  FROM reviews
  WHERE property_id = COALESCE(NEW.property_id, OLD.property_id);
  
  -- Update property
  UPDATE properties
  SET 
    average_rating = COALESCE(v_avg_rating, 0),
    total_reviews = COALESCE(v_total_reviews, 0),
    updated_at = now()
  WHERE id = COALESCE(NEW.property_id, OLD.property_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update property rating
CREATE TRIGGER trigger_update_property_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_rating();

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update helpful count
CREATE TRIGGER trigger_update_review_helpful_count
  AFTER INSERT OR DELETE ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Function to check if user can review
CREATE OR REPLACE FUNCTION can_user_review_booking(p_booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_can_review BOOLEAN;
BEGIN
  SELECT 
    b.guest_id = auth.uid() AND
    b.status = 'completed' AND
    NOT EXISTS (
      SELECT 1 FROM reviews WHERE booking_id = p_booking_id
    )
  INTO v_can_review
  FROM bookings b
  WHERE b.id = p_booking_id;
  
  RETURN COALESCE(v_can_review, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get review statistics
CREATE OR REPLACE FUNCTION get_review_statistics(p_property_id UUID)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'average_rating', ROUND(AVG(rating), 2),
    'total_reviews', COUNT(*),
    'rating_distribution', json_build_object(
      '5_star', COUNT(*) FILTER (WHERE rating = 5),
      '4_star', COUNT(*) FILTER (WHERE rating = 4),
      '3_star', COUNT(*) FILTER (WHERE rating = 3),
      '2_star', COUNT(*) FILTER (WHERE rating = 2),
      '1_star', COUNT(*) FILTER (WHERE rating = 1)
    ),
    'category_averages', json_build_object(
      'cleanliness', ROUND(AVG(cleanliness), 2),
      'communication', ROUND(AVG(communication), 2),
      'value', ROUND(AVG(value), 2),
      'location', ROUND(AVG(location_rating), 2)
    ),
    'recommendation_rate', ROUND(
      (COUNT(*) FILTER (WHERE rating >= 4)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 
      0
    )
  )
  INTO v_stats
  FROM reviews
  WHERE property_id = p_property_id;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Notify host of new review
CREATE OR REPLACE FUNCTION notify_host_new_review()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
  v_guest_name TEXT;
BEGIN
  -- Get property and host details
  SELECT p.*, p.host_id
  INTO v_property
  FROM properties p
  WHERE p.id = NEW.property_id;
  
  -- Get guest name
  SELECT name INTO v_guest_name
  FROM profiles
  WHERE id = NEW.user_id;
  
  -- Create notification for host
  PERFORM create_notification(
    v_property.host_id,
    'property',
    'New Review Received',
    v_guest_name || ' left a ' || NEW.rating || '-star review for ' || v_property.title,
    '/host/reviews',
    NEW.id,
    'review',
    'normal'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_host_new_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_host_new_review();

-- Trigger: Notify guest of host response
CREATE OR REPLACE FUNCTION notify_guest_host_response()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
BEGIN
  -- Only notify if host_response was just added
  IF OLD.host_response IS NULL AND NEW.host_response IS NOT NULL THEN
    -- Get property details
    SELECT title INTO v_property
    FROM properties
    WHERE id = NEW.property_id;
    
    -- Create notification for guest
    PERFORM create_notification(
      NEW.user_id,
      'property',
      'Host Responded to Your Review',
      'The host responded to your review of ' || v_property.title,
      '/reviews',
      NEW.id,
      'review',
      'normal'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_guest_host_response
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_guest_host_response();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_property_rating TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_review_booking TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_statistics TO authenticated;
