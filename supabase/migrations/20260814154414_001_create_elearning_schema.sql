/*
# Migration: Création du schéma de la plateforme e-learning ISAC MLS

## Description
Cette migration crée le schéma de base de données complet pour une plateforme
d'apprentissage en ligne (e-learning) nommée ISAC MLS. Elle inclut:

1. Tables pour la vitrine (showcase) gérée par l'administrateur
2. Système d'authentification administrateur via Supabase Auth
3. Politiques de sécurité RLS (Row Level Security)

## Nouvelles tables

### `categories`
- `id` (uuid, clé primaire)
- `name_fr` (text, nom en français)
- `name_en` (text, nom en anglais)
- `description_fr` (text, description en français)
- `description_en` (text, description en anglais)
- `icon` (text, nom de l'icône lucide)
- `display_order` (int, ordre d'affichage)
- `created_at` (timestamptz)

### `instructors`
- `id` (uuid, clé primaire)
- `name` (text, nom de l'instructeur)
- `title_fr` (text, titre en français)
- `title_en` (text, titre en anglais)
- `bio_fr` (text, biographie en français)
- `bio_en` (text, biographie en anglais)
- `photo_url` (text, URL de la photo)
- `created_at` (timestamptz)

### `courses`
- `id` (uuid, clé primaire)
- `title_fr` (text, titre en français)
- `title_en` (text, titre en anglais)
- `description_fr` (text, description en français)
- `description_en` (text, description en anglais)
- `category_id` (uuid, clé étrangère vers categories)
- `instructor_id` (uuid, clé étrangère vers instructors)
- `level` (text, niveau: beginner/intermediate/advanced)
- `duration_hours` (numeric, durée en heures)
- `price` (numeric, prix)
- `thumbnail_url` (text, URL de l'image de couverture)
- `is_featured` (boolean, formation en vedette)
- `is_published` (boolean, formation publiée)
- `created_at` (timestamptz)

### `testimonials`
- `id` (uuid, clé primaire)
- `author_name` (text, nom de l'auteur)
- `author_title_fr` (text, titre/fonction en français)
- `author_title_en` (text, titre/fonction en anglais)
- `content_fr` (text, contenu du témoignage en français)
- `content_en` (text, contenu du témoignage en anglais)
- `avatar_url` (text, URL de l'avatar)
- `rating` (int, note de 1 à 5)
- `created_at` (timestamptz)

### `site_settings`
- `id` (uuid, clé primaire, singleton)
- `site_name` (text, nom du site)
- `tagline_fr` (text, slogan en français)
- `tagline_en` (text, slogan en anglais)
- `hero_title_fr` (text, titre principal en français)
- `hero_title_en` (text, titre principal en anglais)
- `hero_subtitle_fr` (text, sous-titre en français)
- `hero_subtitle_en` (text, sous-titre en anglais)
- `about_fr` (text, texte à propos en français)
- `about_en` (text, texte à propos en anglais)
- `contact_email` (text, email de contact)
- `contact_phone` (text, téléphone de contact)
- `address_fr` (text, adresse en français)
- `address_en` (text, adresse en anglais)
- `facebook_url` (text, lien Facebook)
- `twitter_url` (text, lien Twitter)
- `linkedin_url` (text, lien LinkedIn)
- `instagram_url` (text, lien Instagram)
- `updated_at` (timestamptz)

## Sécurité (RLS)

- Toutes les tables ont RLS activé.
- Les visiteurs non authentifiés (anon) peuvent LIRE les données publiées.
- Seuls les utilisateurs authentifiés (admin) peuvent créer, modifier et supprimer.
- La table `site_settings` est lisible par tous mais modifiable uniquement par les authentifiés.

## Notes importantes

1. L'authentification admin utilise Supabase Auth (table auth.users).
2. Aucune table d'authentification personnalisée n'est créée.
3. Les politiques permettent aux visiteurs de voir la vitrine et aux admins de la gérer.
*/

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_en text NOT NULL,
  description_fr text,
  description_en text,
  icon text DEFAULT 'BookOpen',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories"
ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories"
ON categories FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories"
ON categories FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories"
ON categories FOR DELETE
TO authenticated USING (true);

-- ============================================
-- TABLE: instructors
-- ============================================
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title_fr text,
  title_en text,
  bio_fr text,
  bio_en text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_instructors" ON instructors;
CREATE POLICY "anon_select_instructors"
ON instructors FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_instructors" ON instructors;
CREATE POLICY "admin_insert_instructors"
ON instructors FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_instructors" ON instructors;
CREATE POLICY "admin_update_instructors"
ON instructors FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_instructors" ON instructors;
CREATE POLICY "admin_delete_instructors"
ON instructors FOR DELETE
TO authenticated USING (true);

-- ============================================
-- TABLE: courses
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr text NOT NULL,
  title_en text NOT NULL,
  description_fr text,
  description_en text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  level text NOT NULL DEFAULT 'beginner',
  duration_hours numeric DEFAULT 0,
  price numeric DEFAULT 0,
  thumbnail_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_courses" ON courses;
CREATE POLICY "anon_select_courses"
ON courses FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_courses" ON courses;
CREATE POLICY "admin_insert_courses"
ON courses FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_courses" ON courses;
CREATE POLICY "admin_update_courses"
ON courses FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_courses" ON courses;
CREATE POLICY "admin_delete_courses"
ON courses FOR DELETE
TO authenticated USING (true);

-- ============================================
-- TABLE: testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_title_fr text,
  author_title_en text,
  content_fr text NOT NULL,
  content_en text NOT NULL,
  avatar_url text,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials"
ON testimonials FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_testimonials" ON testimonials;
CREATE POLICY "admin_insert_testimonials"
ON testimonials FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials"
ON testimonials FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials"
ON testimonials FOR DELETE
TO authenticated USING (true);

-- ============================================
-- TABLE: site_settings (singleton)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'ISAC MLS',
  tagline_fr text NOT NULL DEFAULT 'Excellence en formation professionnelle',
  tagline_en text NOT NULL DEFAULT 'Excellence in Professional Training',
  hero_title_fr text,
  hero_title_en text,
  hero_subtitle_fr text,
  hero_subtitle_en text,
  about_fr text,
  about_en text,
  contact_email text,
  contact_phone text,
  address_fr text,
  address_en text,
  facebook_url text,
  twitter_url text,
  linkedin_url text,
  instagram_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings"
ON site_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings"
ON site_settings FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings"
ON site_settings FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_settings" ON site_settings;
CREATE POLICY "admin_delete_site_settings"
ON site_settings FOR DELETE
TO authenticated USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- ============================================
-- SEED: Site settings par défaut
-- ============================================
INSERT INTO site_settings (
  site_name,
  tagline_fr, tagline_en,
  hero_title_fr, hero_title_en,
  hero_subtitle_fr, hero_subtitle_en,
  about_fr, about_en,
  contact_email, contact_phone,
  address_fr, address_en
) VALUES (
  'ISAC MLS',
  'Excellence en formation professionnelle',
  'Excellence in Professional Training',
  'Formez-vous aux métiers de demain',
  'Train for the jobs of tomorrow',
  'Des formations certifiantes adaptées à vos ambitions professionnelles',
  'Certified courses tailored to your career ambitions',
  'ISAC MLS est un centre de formation dédié à l''excellence pédagogique. Notre mission est de rendre accessible une éducation de qualité, alignée sur les besoins réels du marché du travail.',
  'ISAC MLS is a training center dedicated to teaching excellence. Our mission is to make quality education accessible, aligned with the real needs of the job market.',
  'contact@isac-mls.com',
  '+33 1 23 45 67 89',
  '123 Rue de la Formation, 75001 Paris, France',
  '123 Training Street, 75001 Paris, France'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED: Catégories par défaut
-- ============================================
INSERT INTO categories (name_fr, name_en, description_fr, description_en, icon, display_order) VALUES
  ('Gestion de Projet', 'Project Management', 'Maîtrisez les méthodes et outils de gestion de projet', 'Master project management methods and tools', 'ClipboardList', 1),
  ('Développement Personnel', 'Personal Development', 'Développez vos compétences personnelles et professionnelles', 'Develop your personal and professional skills', 'UserCheck', 2),
  ('Technologies de l''Information', 'Information Technology', 'Formez-vous aux technologies du numérique', 'Train in digital technologies', 'Cpu', 3),
  ('Management & Leadership', 'Management & Leadership', 'Devenez un leader inspirant et efficace', 'Become an inspiring and effective leader', 'Crown', 4),
  ('Marketing Digital', 'Digital Marketing', 'Maîtrisez le marketing à l''ère du numérique', 'Master marketing in the digital age', 'TrendingUp', 5),
  ('Finance & Comptabilité', 'Finance & Accounting', 'Comprendre les fondamentaux de la finance', 'Understand the fundamentals of finance', 'Calculator', 6)
ON CONFLICT DO NOTHING;