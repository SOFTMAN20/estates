-- Add virtual tour support to properties table
-- This migration adds fields for 360° virtual tours and video tours

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT,
ADD COLUMN IF NOT EXISTS virtual_tour_type VARCHAR(20) CHECK (virtual_tour_type IN ('360', 'video', 'matterport', 'youtube', 'kuula')),
ADD COLUMN IF NOT EXISTS video_tour_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN properties.virtual_tour_url IS 'URL for 360° virtual tour (Matterport, Kuula, etc.)';
COMMENT ON COLUMN properties.virtual_tour_type IS 'Type of virtual tour: 360, video, matterport, youtube, kuula';
COMMENT ON COLUMN properties.video_tour_url IS 'URL for video tour (YouTube, Vimeo, direct video)';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_virtual_tour 
ON properties(virtual_tour_url) 
WHERE virtual_tour_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_properties_video_tour 
ON properties(video_tour_url) 
WHERE video_tour_url IS NOT NULL;

-- Add index for properties with any tour
CREATE INDEX IF NOT EXISTS idx_properties_has_tour 
ON properties((virtual_tour_url IS NOT NULL OR video_tour_url IS NOT NULL)) 
WHERE virtual_tour_url IS NOT NULL OR video_tour_url IS NOT NULL;
