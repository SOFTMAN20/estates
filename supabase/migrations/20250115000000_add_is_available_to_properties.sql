-- Migration: Add is_available column to properties table
-- Description: Adds a boolean field to control property availability and updates RLS policy

-- Add is_available column
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN public.properties.is_available IS 'Whether the property is currently available for booking';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_is_available ON public.properties(is_available);

-- Update the public SELECT policy to include is_available check
DROP POLICY IF EXISTS "Approved properties are viewable by everyone" ON public.properties;

CREATE POLICY "Approved properties are viewable by everyone"
  ON public.properties
  FOR SELECT
  USING (status = 'approved' AND is_available = true);

-- Add comment to explain the policy
COMMENT ON POLICY "Approved properties are viewable by everyone" ON public.properties IS 
  'Public users can only view properties that are both approved by admin and marked as available';

-- Set existing approved properties to available by default
UPDATE public.properties 
SET is_available = true 
WHERE status = 'approved' AND is_available IS NULL;
