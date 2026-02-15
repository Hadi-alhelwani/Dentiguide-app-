-- ============================================
-- Dentiguide MDR System — Database Schema
-- Paste ALL of this into Supabase SQL Editor → Click "Run"
-- ============================================

-- 1. Company settings (one row per user)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT DEFAULT 'Dentiguide GmbH',
  street TEXT DEFAULT '',
  postal TEXT DEFAULT '',
  city TEXT DEFAULT '',
  country TEXT DEFAULT 'Germany',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  site2_name TEXT DEFAULT '',
  site2_address TEXT DEFAULT '',
  prrc_name TEXT DEFAULT '',
  prrc_qual TEXT DEFAULT '',
  signer_name TEXT DEFAULT '',
  signer_title TEXT DEFAULT 'Managing Director',
  signer_credentials TEXT DEFAULT '',
  doc_counter INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Clinics / Prescribers
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  big TEXT DEFAULT '',
  practice TEXT DEFAULT '',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Materials library
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  manufacturer TEXT DEFAULT '',
  reference TEXT DEFAULT '',
  ce_class TEXT DEFAULT '',
  biocompat TEXT DEFAULT '',
  ifu TEXT DEFAULT '',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Cases / MDR documents
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doc_ref TEXT NOT NULL,
  clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own settings" ON settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own clinics" ON clinics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own materials" ON materials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own cases" ON cases FOR ALL USING (auth.uid() = user_id);

-- 6. Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_ts BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clinics_ts BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cases_ts BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
