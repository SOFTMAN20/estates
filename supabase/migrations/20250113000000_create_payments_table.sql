-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card', 'bank_transfer')),
  transaction_id TEXT UNIQUE,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Create updated_at trigger (using existing handle_updated_at function)
CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own payments (as guest or host)
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT b.guest_id FROM bookings b WHERE b.id = payments.booking_id
      UNION
      SELECT b.host_id FROM bookings b WHERE b.id = payments.booking_id
    )
  );

-- Only the guest who made the booking can create payment
CREATE POLICY "Guests can create payment for own booking"
  ON payments
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT b.guest_id FROM bookings b WHERE b.id = booking_id
    )
  );

-- Only system/admin can update payment status (via Edge Functions)
CREATE POLICY "System can update payments"
  ON payments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can manage all payments
CREATE POLICY "Admins can manage all payments"
  ON payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Add comment for documentation
COMMENT ON TABLE payments IS 'Stores payment information for bookings with support for multiple payment methods';
COMMENT ON COLUMN payments.booking_id IS 'One-to-one relationship with bookings table';
COMMENT ON COLUMN payments.payment_method IS 'Payment method: mpesa, card, or bank_transfer';
COMMENT ON COLUMN payments.transaction_id IS 'Unique transaction ID from payment provider';
COMMENT ON COLUMN payments.phone_number IS 'Phone number for M-Pesa payments (format: +254...)';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, completed, failed, or refunded';
COMMENT ON COLUMN payments.payment_provider_response IS 'Raw response from payment provider for debugging';
