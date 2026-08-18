-- ====================================================================
-- ACTIVATION DES PERMISSIONS D'ÉCRITURE SUR SUPABASE CLOUD
-- ====================================================================

-- Désactivation/Réinitialisation des politiques d'accès restrictives
DROP POLICY IF EXISTS "Accès complet catégories" ON categories;
DROP POLICY IF EXISTS "Accès complet formateurs" ON instructors;
DROP POLICY IF EXISTS "Accès complet cours" ON courses;
DROP POLICY IF EXISTS "Accès complet cadres" ON cadres;
DROP POLICY IF EXISTS "Accès complet déclarations" ON payment_declarations;
DROP POLICY IF EXISTS "Accès complet inscriptions" ON enrollments;
DROP POLICY IF EXISTS "Accès complet ressources" ON resources;
DROP POLICY IF EXISTS "Accès complet réunions" ON virtual_meetings;
DROP POLICY IF EXISTS "Accès complet réglages" ON site_settings;

-- Activation des permissions totales en lecture, insertion et modification
CREATE POLICY "Accès complet catégories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet formateurs" ON instructors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet cours" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet cadres" ON cadres FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet déclarations" ON payment_declarations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet inscriptions" ON enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet ressources" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet réunions" ON virtual_meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet réglages" ON site_settings FOR ALL USING (true) WITH CHECK (true);
