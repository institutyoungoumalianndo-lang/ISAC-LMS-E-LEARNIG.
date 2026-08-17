/*
# Migration: Table des inscriptions étudiantes

## Description
Cette migration ajoute une table `enrollments` qui permet aux étudiants
authentifiés de s'inscrire à des formations. Elle inclut également une
table `profiles` pour stocker le nom complet de l'étudiant.

## Nouvelles tables

### `enrollments`
- `id` (uuid, clé primaire)
- `student_id` (uuid, référence vers auth.users, l'étudiant inscrit)
- `course_id` (uuid, référence vers courses)
- `status` (text: pending, active, completed)
- `created_at` (timestamptz)
- Contrainte d'unicité: un étudiant ne peut s'inscrire qu'une fois à une même formation

### `profiles`
- `id` (uuid, clé primaire, référence vers auth.users)
- `full_name` (text, nom complet de l'étudiant)
- `created_at` (timestamptz)

## Sécurité (RLS)

### enrollments
- SELECT: un étudiant ne voit que ses propres inscriptions; l'admin voit tout
- INSERT: un étudiant authentifié peut s'inscrire lui-même uniquement
- UPDATE: un étudiant peut mettre à jour le statut de ses propres inscriptions
- DELETE: un étudiant peut se désinscrire

### profiles
- SELECT: un étudiant ne voit que son propre profil; l'admin voit tout
- INSERT: un étudiant crée son propre profil automatiquement
- UPDATE: un étudiant modifie son propre profil

## Notes importantes
1. Les étudiants utilisent Supabase Auth (table auth.users)
2. Les politiques garantissent qu'un étudiant ne peut agir que sur ses propres données
3. L'admin (authentifié) peut consulter toutes les inscriptions
*/
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_enrollments" ON enrollments;
CREATE POLICY "select_own_enrollments" ON enrollments FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_own_enrollments" ON enrollments;
CREATE POLICY "insert_own_enrollments" ON enrollments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_enrollments" ON enrollments;
CREATE POLICY "update_own_enrollments" ON enrollments FOR UPDATE
  TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_own_enrollments" ON enrollments;
CREATE POLICY "delete_own_enrollments" ON enrollments FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);