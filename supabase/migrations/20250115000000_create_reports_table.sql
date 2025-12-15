-- Create reports table for storing generated reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  date_range TEXT NOT NULL,
  format TEXT NOT NULL,
  size TEXT DEFAULT '0 KB',
  status TEXT DEFAULT 'completed',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  generated_at TIMESTAMP DEFAULT NOW(),
  generated_by UUID REFERENCES profiles(id),
  download_count INTEGER DEFAULT 0,
  report_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all reports
CREATE POLICY "Admins can view all reports"
ON reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can insert reports
CREATE POLICY "Admins can insert reports"
ON reports FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can update reports
CREATE POLICY "Admins can update reports"
ON reports FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can delete reports
CREATE POLICY "Admins can delete reports"
ON reports FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_reports_updated_at_trigger
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_reports_updated_at();
