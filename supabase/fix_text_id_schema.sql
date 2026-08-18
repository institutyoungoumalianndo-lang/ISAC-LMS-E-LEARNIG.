-- ====================================================================
-- MIGRATION SÉCURISÉE : Remplacement des UUID par TEXT (Compatibilité Totale)
-- Permet d'insérer aussi bien des IDs textes (ex: 'cat-1', 'inst-1') que des UUID.
-- ====================================================================

-- 1. Table Categories
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  description_fr text,
  description_en text,
  icon text DEFAULT 'BookOpen',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Table Instructors
CREATE TABLE IF NOT EXISTS instructors (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text,
  password text DEFAULT 'formateur123',
  title_fr text,
  title_en text,
  bio_fr text,
  bio_en text,
  photo_url text,
  assigned_course_id text,
  created_at timestamptz DEFAULT now()
);

-- 3. Table Courses
CREATE TABLE IF NOT EXISTS courses (
  id text PRIMARY KEY,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  description_fr text,
  description_en text,
  diploma_type text DEFAULT 'CQP',
  price_gnf numeric DEFAULT 1500000,
  duration_fr text DEFAULT '6 Mois',
  duration_en text DEFAULT '6 Months',
  category_id text,
  instructor_id text,
  level text DEFAULT 'beginner',
  duration_hours numeric DEFAULT 6,
  price numeric DEFAULT 150,
  thumbnail_url text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Table Cadres
CREATE TABLE IF NOT EXISTS cadres (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text DEFAULT 'cadre123',
  role_title text DEFAULT 'Cadre Dirigeant',
  created_at timestamptz DEFAULT now()
);

-- Active RLS sur toutes les tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadres ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture et écriture totale
DROP POLICY IF EXISTS "Accès complet catégories" ON categories;
DROP POLICY IF EXISTS "Accès complet formateurs" ON instructors;
DROP POLICY IF EXISTS "Accès complet cours" ON courses;
DROP POLICY IF EXISTS "Accès complet cadres" ON cadres;

CREATE POLICY "Accès complet catégories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet formateurs" ON instructors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet cours" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet cadres" ON cadres FOR ALL USING (true) WITH CHECK (true);
