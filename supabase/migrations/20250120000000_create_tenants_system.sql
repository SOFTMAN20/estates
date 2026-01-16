-- ============================================
-- TENANT MANAGEMENT SYSTEM
-- ============================================

-- 1. TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Lease Information
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  security_deposit NUMERIC DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'evicted')),
  is_late_on_rent BOOLEAN DEFAULT false,
  
  -- Move-in/Move-out
  move_in_date DATE,
  move_out_date DATE,
  move_in_condition_notes TEXT,
  move_out_condition_notes TEXT,
  move_in_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  move_out_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LEASE AGREEMENTS TABLE
CREATE TABLE IF NOT EXISTS lease_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Agreement Details
  agreement_type TEXT DEFAULT 'standard' CHECK (agreement_type IN ('standard', 'month-to-month', 'fixed-term')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  security_deposit NUMERIC DEFAULT 0,

  -- Terms
  terms_and_conditions TEXT,
  special_clauses TEXT,
  utilities_included JSONB DEFAULT '[]'::jsonb,
  tenant_responsibilities TEXT,
  landlord_responsibilities TEXT,
  
  -- Payment Terms
  rent_due_day INTEGER DEFAULT 1 CHECK (rent_due_day >= 1 AND rent_due_day <= 31),
  late_fee_amount NUMERIC DEFAULT 0,
  late_fee_grace_period INTEGER DEFAULT 5,
  
  -- Signatures
  landlord_signed BOOLEAN DEFAULT false,
  landlord_signature_date TIMESTAMP WITH TIME ZONE,
  tenant_signed BOOLEAN DEFAULT false,
  tenant_signature_date TIMESTAMP WITH TIME ZONE,
  
  -- Documents
  document_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'active', 'expired', 'terminated')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RENT PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment Details
  payment_month DATE NOT NULL,
  amount_due NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  late_fee NUMERIC DEFAULT 0,
  
  -- Payment Information
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'bank_transfer', 'cash', 'card')),
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'partial', 'late', 'waived')),
  is_late BOOLEAN DEFAULT false,
  
  -- Due Date
  due_date DATE NOT NULL,
  
  -- Notes
  notes TEXT,
  receipt_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_landlord_id ON tenants(landlord_id);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

CREATE INDEX IF NOT EXISTS idx_lease_agreements_tenant_id ON lease_agreements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_property_id ON lease_agreements(property_id);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_status ON lease_agreements(status);

CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant_id ON rent_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_property_id ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_payment_month ON rent_payments(payment_month);


-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at 
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lease_agreements_updated_at ON lease_agreements;
CREATE TRIGGER update_lease_agreements_updated_at 
  BEFORE UPDATE ON lease_agreements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rent_payments_updated_at ON rent_payments;
CREATE TRIGGER update_rent_payments_updated_at 
  BEFORE UPDATE ON rent_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

-- TENANTS POLICIES
DROP POLICY IF EXISTS "Landlords can view their tenants" ON tenants;
CREATE POLICY "Landlords can view their tenants" ON tenants 
  FOR SELECT USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Tenants can view their own records" ON tenants;
CREATE POLICY "Tenants can view their own records" ON tenants 
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can create tenants" ON tenants;
CREATE POLICY "Landlords can create tenants" ON tenants 
  FOR INSERT WITH CHECK (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can update their tenants" ON tenants;
CREATE POLICY "Landlords can update their tenants" ON tenants 
  FOR UPDATE USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can delete their tenants" ON tenants;
CREATE POLICY "Landlords can delete their tenants" ON tenants 
  FOR DELETE USING (landlord_id = auth.uid());

-- LEASE AGREEMENTS POLICIES
DROP POLICY IF EXISTS "Landlords can view their lease agreements" ON lease_agreements;
CREATE POLICY "Landlords can view their lease agreements" ON lease_agreements 
  FOR SELECT USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Tenants can view their lease agreements" ON lease_agreements;
CREATE POLICY "Tenants can view their lease agreements" ON lease_agreements 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = lease_agreements.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Landlords can create lease agreements" ON lease_agreements;
CREATE POLICY "Landlords can create lease agreements" ON lease_agreements 
  FOR INSERT WITH CHECK (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can update lease agreements" ON lease_agreements;
CREATE POLICY "Landlords can update lease agreements" ON lease_agreements 
  FOR UPDATE USING (landlord_id = auth.uid());


-- RENT PAYMENTS POLICIES
DROP POLICY IF EXISTS "Landlords can view rent payments" ON rent_payments;
CREATE POLICY "Landlords can view rent payments" ON rent_payments 
  FOR SELECT USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Tenants can view their rent payments" ON rent_payments;
CREATE POLICY "Tenants can view their rent payments" ON rent_payments 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = rent_payments.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Landlords can create rent payments" ON rent_payments;
CREATE POLICY "Landlords can create rent payments" ON rent_payments 
  FOR INSERT WITH CHECK (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can update rent payments" ON rent_payments;
CREATE POLICY "Landlords can update rent payments" ON rent_payments 
  FOR UPDATE USING (landlord_id = auth.uid());

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to create rent payment schedule for a tenant
CREATE OR REPLACE FUNCTION create_rent_payment_schedule(
  p_tenant_id UUID,
  p_property_id UUID,
  p_landlord_id UUID,
  p_monthly_rent NUMERIC,
  p_lease_start DATE,
  p_lease_end DATE,
  p_rent_due_day INTEGER DEFAULT 1
)
RETURNS void AS $$
DECLARE
  current_month DATE;
  end_month DATE;
  due_date DATE;
BEGIN
  current_month := DATE_TRUNC('month', p_lease_start);
  end_month := DATE_TRUNC('month', p_lease_end);
  
  WHILE current_month <= end_month LOOP
    due_date := current_month + (p_rent_due_day - 1) * INTERVAL '1 day';
    
    INSERT INTO rent_payments (
      tenant_id,
      property_id,
      landlord_id,
      payment_month,
      amount_due,
      due_date,
      status
    ) VALUES (
      p_tenant_id,
      p_property_id,
      p_landlord_id,
      current_month,
      p_monthly_rent,
      due_date,
      'pending'
    );
    
    current_month := current_month + INTERVAL '1 month';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to mark late rent payments
CREATE OR REPLACE FUNCTION mark_late_rent_payments()
RETURNS void AS $$
BEGIN
  UPDATE rent_payments
  SET 
    is_late = true,
    status = 'late'
  WHERE status = 'pending'
  AND due_date < CURRENT_DATE;
  
  UPDATE tenants
  SET is_late_on_rent = true
  WHERE id IN (
    SELECT DISTINCT tenant_id
    FROM rent_payments
    WHERE is_late = true AND status IN ('late', 'pending')
  );
  
  UPDATE tenants
  SET is_late_on_rent = false
  WHERE id NOT IN (
    SELECT DISTINCT tenant_id
    FROM rent_payments
    WHERE is_late = true AND status IN ('late', 'pending')
  )
  AND is_late_on_rent = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tenant statistics for a landlord
CREATE OR REPLACE FUNCTION get_landlord_tenant_stats(p_landlord_id UUID)
RETURNS TABLE (
  total_tenants BIGINT,
  active_tenants BIGINT,
  total_monthly_rent NUMERIC,
  on_time_payment_rate NUMERIC,
  late_payments_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_tenants,
    COUNT(*) FILTER (WHERE t.status = 'active')::BIGINT as active_tenants,
    COALESCE(SUM(t.monthly_rent) FILTER (WHERE t.status = 'active'), 0) as total_monthly_rent,
    CASE 
      WHEN COUNT(rp.id) > 0 THEN
        ROUND((COUNT(rp.id) FILTER (WHERE rp.status = 'paid' AND rp.is_late = false)::NUMERIC / COUNT(rp.id)::NUMERIC) * 100, 1)
      ELSE 100
    END as on_time_payment_rate,
    COUNT(rp.id) FILTER (WHERE rp.status = 'late')::BIGINT as late_payments_count
  FROM tenants t
  LEFT JOIN rent_payments rp ON rp.tenant_id = t.id
  WHERE t.landlord_id = p_landlord_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
