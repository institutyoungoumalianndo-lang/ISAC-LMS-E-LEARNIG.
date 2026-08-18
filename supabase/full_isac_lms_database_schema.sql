-- ====================================================================
-- SCHÉMA DE BASE DE DONNÉES COMPLET ET OFFICIEL - ISAC MLS E-LEARNING
-- Institut Supérieur Agréé & Centre de Formation Professionnelle « ISAC MLS »
-- ====================================================================

-- 1. Table des Catégories de Spécialités
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_en text NOT NULL,
  description_fr text,
  description_en text,
  icon text DEFAULT 'BookOpen',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Table des Formateurs Accrédités ISAC MLS
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  password text DEFAULT 'formateur123',
  title_fr text,
  title_en text,
  bio_fr text,
  bio_en text,
  photo_url text,
  assigned_course_id text,
  created_at timestamptz DEFAULT now()
);

-- 3. Table des Filières de Formation Professionnelle & Diplômes
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr text NOT NULL,
  title_en text NOT NULL,
  description_fr text,
  description_en text,
  diploma_type text DEFAULT 'CQP',
  price_gnf numeric DEFAULT 1500000,
  duration_fr text DEFAULT '6 Mois',
  duration_en text DEFAULT '6 Months',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  level text DEFAULT 'beginner',
  duration_hours numeric DEFAULT 6,
  price numeric DEFAULT 150,
  thumbnail_url text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Table des Cadres Dirigeants & Coffre-Fort Secrétisé
CREATE TABLE IF NOT EXISTS cadres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text DEFAULT 'cadre123',
  role_title text DEFAULT 'Cadre Dirigeant',
  created_at timestamptz DEFAULT now()
);

-- 5. Table des Déclarations de Paiement Mobile Money (+224)
CREATE TABLE IF NOT EXISTS payment_declarations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  student_email text NOT NULL,
  student_phone text NOT NULL,
  course_id text NOT NULL,
  course_title text NOT NULL,
  payment_method text NOT NULL,
  transaction_ref text NOT NULL,
  amount_gnf numeric NOT NULL,
  receipt_url text,
  status text DEFAULT 'pending',
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 6. Table des Inscriptions & Diplômes Étudiants
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  student_email text NOT NULL,
  course_id text NOT NULL,
  course_title text NOT NULL,
  assigned_instructor_id text,
  status text DEFAULT 'active',
  certificate_issued boolean DEFAULT false,
  certificate_url text,
  created_at timestamptz DEFAULT now()
);

-- 7. Table des Supports de Cours Multi-Formats (Formateur)
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  instructor_id text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 8. Table des Réunions & Classes Virtuelles Live
CREATE TABLE IF NOT EXISTS virtual_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  course_id text NOT NULL,
  meeting_url text NOT NULL,
  start_time timestamptz NOT NULL,
  duration_minutes int DEFAULT 60,
  status text DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now()
);

-- 9. Table des Réglages Généraux & Agréments Ministériels
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'ISAC MLS',
  admin_email text DEFAULT 'admin@isac-mls.com',
  admin_password text DEFAULT 'admin123',
  tagline_fr text,
  tagline_en text,
  hero_title_fr text,
  hero_title_en text,
  hero_subtitle_fr text,
  hero_subtitle_en text,
  contact_email text DEFAULT 'ecoledegestiondecommerce@gmail.com',
  contact_phone text DEFAULT '+224 620 00 00 00',
  address_fr text DEFAULT 'Conakry, République de Guinée',
  address_en text DEFAULT 'Conakry, Republic of Guinea',
  ministry_logo_url text DEFAULT '/logo_ministere_guinee.jpg',
  creation_approval_num text DEFAULT 'N°070/METFP-ET/DNETPP/14',
  opening_approval_num text DEFAULT 'N°2014/3942/CAB/DNETPP',
  admin_orange_money text DEFAULT '+224 620 00 00 00',
  admin_mtn_money text DEFAULT '+224 660 00 00 00',
  admin_kulu_money text DEFAULT '+224 625 00 00 00',
  admin_paycard_money text DEFAULT '+224 657 00 00 00',
  admin_cashmoov_money text DEFAULT '+224 628 00 00 00',
  whatsapp_contact_phone text DEFAULT '+224 620 00 00 00',
  whatsapp_group_url text DEFAULT 'https://chat.whatsapp.com/ISAC-MLS-Guinee-Official-2026',
  updated_at timestamptz DEFAULT now()
);

-- Active RLS sur toutes les tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadres ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour l'accès aux cours
CREATE POLICY "Lecture publique des catégories" ON categories FOR SELECT USING (true);
CREATE POLICY "Lecture publique des formateurs" ON instructors FOR SELECT USING (true);
CREATE POLICY "Lecture publique des cours" ON courses FOR SELECT USING (true);
CREATE POLICY "Lecture publique des réglages" ON site_settings FOR SELECT USING (true);
