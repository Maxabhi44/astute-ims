-- ============================================
-- ASTUTE IMS - Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SURVEYORS TABLE
-- ============================================
CREATE TABLE surveyors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialty TEXT DEFAULT 'All Lines',
  status TEXT DEFAULT 'available' CHECK (status IN ('available','in_field','office','leave')),
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLAIMS TABLE
-- ============================================
CREATE TABLE claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_number TEXT UNIQUE NOT NULL,
  insured_name TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  insurance_company TEXT NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('Fire','Motor','Marine','Health','Burglary','Engineering','Miscellaneous')),
  incident_date DATE,
  claim_amount DECIMAL(15,2) DEFAULT 0,
  surveyor_id UUID REFERENCES surveyors(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','under_survey','report_submitted','approved','closed','rejected')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal','high','urgent')),
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FOLLOWUPS TABLE
-- ============================================
CREATE TABLE followups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_type TEXT DEFAULT 'call' CHECK (contact_type IN ('call','email','visit','letter')),
  due_date DATE NOT NULL,
  notes TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal','high','urgent')),
  is_done BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('survey','policy','claim','settlement','other')),
  file_size_bytes BIGINT DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL LOGS TABLE
-- ============================================
CREATE TABLE email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id TEXT,
  party_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  direction TEXT DEFAULT 'sent' CHECK (direction IN ('sent','received')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- IMPORTANT: This prevents unauthorized access
-- ============================================
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveyors ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all data
CREATE POLICY "Authenticated users can view claims"
  ON claims FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert claims"
  ON claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update claims"
  ON claims FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view surveyors"
  ON surveyors FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage surveyors"
  ON surveyors FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view followups"
  ON followups FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage followups"
  ON followups FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can upload documents"
  ON documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can view email logs"
  ON email_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can log emails"
  ON email_logs FOR ALL TO authenticated USING (true);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX idx_claims_insurance_company ON claims(insurance_company);
CREATE INDEX idx_followups_due_date ON followups(due_date);
CREATE INDEX idx_followups_is_done ON followups(is_done);
CREATE INDEX idx_documents_claim_id ON documents(claim_id);
CREATE INDEX idx_email_logs_claim_id ON email_logs(claim_id);

-- ============================================
-- SEED DATA (optional - remove in production)
-- ============================================
INSERT INTO surveyors (name, email, phone, specialty, status, rating) VALUES
  ('Rajesh Kumar', 'rajesh@astute.com', '9876543210', 'Fire & Engineering', 'in_field', 4.8),
  ('Priya Sharma', 'priya@astute.com', '9765432109', 'Motor & Health', 'office', 4.9),
  ('Amit Verma', 'amit@astute.com', '9654321098', 'Marine & Burglary', 'available', 4.6),
  ('Sunita Joshi', 'sunita@astute.com', '9543210987', 'All Lines', 'in_field', 4.7);

-- Done! Your database is ready.
