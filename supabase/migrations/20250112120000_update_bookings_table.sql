-- Migration: Update bookings table structure
-- Description: Modify bookings table to include all required fields for the booking system
-- Note: Removes payment fields as payments will be a standalone table

-- First, backup existing data if needed (optional - uncomment if you have important data)
-- CREATE TABLE bookings_backup AS SELECT * FROM public.bookings;

-- Drop existing bookings table and recreate with new structure
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Create bookings table with updated schema
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_months INTEGER NOT NULL,
  monthly_rent NUMERIC(12, 2) NOT NULL,
  service_fee NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  cancellation_reason TEXT,
  cancellation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_dates CHECK (check_out > check_in),
  CONSTRAINT check_months CHECK (total_months > 0),
  CONSTRAINT check_amounts CHECK (monthly_rent > 0 AND service_fee >= 0 AND total_amount > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX idx_bookings_host_id ON public.bookings(host_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings table

-- Policy: Users can view their own bookings (as guest)
CREATE POLICY "Users can view own bookings as guest"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = guest_id);

-- Policy: Users can view bookings for their properties (as host)
CREATE POLICY "Users can view bookings for their properties"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = host_id);

-- Policy: Guests can create bookings
CREATE POLICY "Guests can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = guest_id);

-- Policy: Guests can update their own pending bookings
CREATE POLICY "Guests can update own pending bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = guest_id AND status = 'pending')
  WITH CHECK (auth.uid() = guest_id);

-- Policy: Hosts can update bookings for their properties
CREATE POLICY "Hosts can update bookings for their properties"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Policy: Guests can cancel their own bookings
CREATE POLICY "Guests can cancel own bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = guest_id AND status IN ('pending', 'confirmed'))
  WITH CHECK (auth.uid() = guest_id AND status = 'cancelled');

-- Policy: Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
  ON public.bookings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON public.bookings
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add comments for documentation
COMMENT ON TABLE public.bookings IS 'Stores property booking information without payment details';
COMMENT ON COLUMN public.bookings.id IS 'Unique identifier for the booking';
COMMENT ON COLUMN public.bookings.property_id IS 'Reference to the property being booked';
COMMENT ON COLUMN public.bookings.guest_id IS 'Reference to the user making the booking';
COMMENT ON COLUMN public.bookings.host_id IS 'Reference to the property host/owner';
COMMENT ON COLUMN public.bookings.check_in IS 'Booking start date';
COMMENT ON COLUMN public.bookings.check_out IS 'Booking end date';
COMMENT ON COLUMN public.bookings.total_months IS 'Total number of months for the booking';
COMMENT ON COLUMN public.bookings.monthly_rent IS 'Monthly rent amount';
COMMENT ON COLUMN public.bookings.service_fee IS 'Platform service fee (10% of total)';
COMMENT ON COLUMN public.bookings.total_amount IS 'Total amount including service fee';
COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending, confirmed, cancelled, or completed';
COMMENT ON COLUMN public.bookings.special_requests IS 'Any special requests from the guest';
COMMENT ON COLUMN public.bookings.cancellation_reason IS 'Reason for cancellation if applicable';
COMMENT ON COLUMN public.bookings.cancellation_date IS 'Date when booking was cancelled';
COMMENT ON COLUMN public.bookings.created_at IS 'Timestamp when booking was created';
COMMENT ON COLUMN public.bookings.updated_at IS 'Timestamp when booking was last updated';

-- Recreate the booking_stats view if it existed
CREATE OR REPLACE VIEW public.booking_stats AS
SELECT
  COUNT(*) AS total_bookings,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_bookings,
  COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_bookings,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_bookings,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_bookings,
  COALESCE(SUM(total_amount) FILTER (WHERE status IN ('confirmed', 'completed')), 0) AS total_revenue,
  COALESCE(AVG(total_amount) FILTER (WHERE status IN ('confirmed', 'completed')), 0) AS average_booking_value
FROM public.bookings;

COMMENT ON VIEW public.booking_stats IS 'Aggregated statistics for all bookings';
