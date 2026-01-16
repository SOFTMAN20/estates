-- ============================================
-- MAINTENANCE REQUESTS SYSTEM
-- ============================================

-- Create maintenance category enum
CREATE TYPE maintenance_category AS ENUM (
  'plumbing',
  'electrical',
  'hvac',
  'appliance',
  'structural',
  'pest_control',
  'other'
);

-- Create maintenance priority enum
CREATE TYPE maintenance_priority AS ENUM (
  'low',
  'medium',
  'high',
  'emergency'
);

-- Create maintenance status enum
CREATE TYPE maintenance_status AS ENUM (
  'pending',
  'assigned',
  'scheduled',
  'in_progress',
  'pending_parts',
  'completed',
  'cancelled'
);

-- ============================================
-- MAINTENANCE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Request Details
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category maintenance_category NOT NULL DEFAULT 'other',
  priority maintenance_priority NOT NULL DEFAULT 'medium',
  status maintenance_status NOT NULL DEFAULT 'pending',
  
  -- Location
  location_in_property VARCHAR(100),
  
  -- Images
  images TEXT[] DEFAULT '{}',
  
  -- Assignment
  assigned_to VARCHAR(200),
  assigned_contact VARCHAR(50),
  
  -- Scheduling
  scheduled_date TIMESTAMPTZ,
  tenant_available_times TEXT,
  access_instructions TEXT,
  
  -- Costs
  estimated_cost DECIMAL(12, 2),
  actual_cost DECIMAL(12, 2),
  
  -- Resolution
  resolution_notes TEXT,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MAINTENANCE COMMENTS TABLE (for communication)
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_tenant ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_landlord ON maintenance_requests(landlord_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);
CREATE INDEX idx_maintenance_category ON maintenance_requests(category);
CREATE INDEX idx_maintenance_created ON maintenance_requests(created_at DESC);
CREATE INDEX idx_maintenance_comments ON maintenance_comments(maintenance_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_comments ENABLE ROW LEVEL SECURITY;

-- Landlords can manage their maintenance requests
CREATE POLICY "Landlords can manage own maintenance"
ON maintenance_requests FOR ALL
USING (auth.uid() = landlord_id);

-- Tenants can view and create requests for their properties
CREATE POLICY "Tenants can view own maintenance"
ON maintenance_requests FOR SELECT
USING (
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Tenants can create maintenance requests"
ON maintenance_requests FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = auth.uid()
  )
);

-- Comments policies
CREATE POLICY "Users can view comments on their maintenance"
ON maintenance_comments FOR SELECT
USING (
  maintenance_id IN (
    SELECT id FROM maintenance_requests 
    WHERE landlord_id = auth.uid() 
    OR tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can add comments"
ON maintenance_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_maintenance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintenance_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_maintenance_updated_at();

-- ============================================
-- AUTO-SET COMPLETED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION set_maintenance_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintenance_completed_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_maintenance_completed_at();
