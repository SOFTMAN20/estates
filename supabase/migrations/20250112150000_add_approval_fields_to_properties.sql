-- Migration: Add approval fields to properties table
-- Description: Adds rejection_reason and updates status constraint for admin approval workflow
-- Date: 2025-01-12

-- Drop existing status constraint if it exists
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Update status column to include pending, approved, rejected
ALTER TABLE properties 
  ALTER COLUMN status TYPE TEXT,
  ALTER COLUMN status SET DEFAULT 'pending';

-- Add new constraint with approval statuses
ALTER TABLE properties 
  ADD CONSTRAINT properties_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive', 'rented'));

-- Add rejection_reason column
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add approved_at and approved_by columns for audit trail
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Add comment to explain the columns
COMMENT ON COLUMN properties.rejection_reason IS 'Reason provided by admin when rejecting a property listing';
COMMENT ON COLUMN properties.approved_at IS 'Timestamp when property was approved by admin';
COMMENT ON COLUMN properties.approved_by IS 'Admin user who approved the property';

-- Update existing properties to have pending status if they are active
UPDATE properties 
SET status = 'pending' 
WHERE status = 'active' AND approved_at IS NULL;

-- Create index for faster queries on approval status
CREATE INDEX IF NOT EXISTS idx_properties_status_pending ON properties(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_properties_approved_by ON properties(approved_by);

-- Update RLS policy for admins to manage all properties
CREATE POLICY "Admins can view all properties"
ON properties FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all properties"
ON properties FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
