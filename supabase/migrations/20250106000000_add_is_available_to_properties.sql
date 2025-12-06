-- Migration: Add is_available column to properties table
-- Description: Allows hosts to toggle property availability without admin re-approval
-- Date: 2025-01-06

-- Add is_available column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Add comment to explain the column
COMMENT ON COLUMN properties.is_available IS 'Indicates if the property is currently available for booking. Hosts can toggle this without requiring admin re-approval.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_is_available 
ON properties(is_available) 
WHERE status = 'approved';

-- Update existing properties to be available by default
UPDATE properties 
SET is_available = true 
WHERE is_available IS NULL;

-- Update RLS policies to include is_available check

-- Drop existing policy for viewing approved properties
DROP POLICY IF EXISTS "Anyone can view approved properties" ON properties;

-- Create new policy that checks both status and availability
CREATE POLICY "Anyone can view approved and available properties"
ON properties FOR SELECT
USING (status = 'approved' AND is_available = true);

-- Create policy for hosts to view their own properties regardless of availability
CREATE POLICY "Hosts can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = host_id);

-- Update policy for hosts to update their properties (including is_available)
DROP POLICY IF EXISTS "Hosts can update own properties" ON properties;

CREATE POLICY "Hosts can update own properties"
ON properties FOR UPDATE
USING (auth.uid() = host_id)
WITH CHECK (auth.uid() = host_id);

-- Grant necessary permissions
GRANT SELECT, UPDATE ON properties TO authenticated;

-- Add trigger to update updated_at timestamp when is_available changes
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at_trigger ON properties;

CREATE TRIGGER properties_updated_at_trigger
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_properties_updated_at();
