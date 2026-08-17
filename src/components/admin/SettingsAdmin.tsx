import { useState } from 'react';
import { Save, Check, Phone, MessageSquare, CreditCard, Image, Key, Lock, Mail, Stamp, FileCheck, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';

type Props = { settings: SiteSettings | null; onChanged: () => void };

export function SettingsAdmin({ settings, onChanged }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState<Partial<SiteSettings>>({
    site_name: 'ISAC MLS',
    admin_email: 'admin@isac-mls.com',
    admin_password: 'admin123',
    contact_email: 'ecoledegestiondecommerce@gmail.com',
    contact_phone: '+224 620 00 00 00',
    address_fr: 'Conakry, République de Guinée',
    address_en: 'Conakry, Republic of Guinea',
    ministry_logo_url: '/logo_ministere_guinee.jpg',
    creation_approval_num: 'N°070/METFP-ET/DNETPP/14',
    opening_approval_num: 'N°2014/3942/CAB/DNETPP',
    admin_orange_money: '+224 620 00 00 00',
    admin_mtn_money: '+224 660 00 00 00',
    admin_kulu_money: '+224 625 00 00 00',
    admin_paycard_money: '+224 657 00 00 00',
    admin_cashmoov_money: '+224 628 00 00 00',
    whatsapp_contact_phone: '+224 620 00 00 00',
    whatsapp_group_url: 'https://chat.whatsapp.com/ISAC-MLS-Guinee-Official-2026',
    tagline_fr: 'Institut Supérieur Agréé & Centre de Formation Professionnelle',
    hero_title_fr: 'Formations Professionnelles & Certifiantes en Guinée',
    ...(settings || {}),
  });

  const [adminEmail, setAdminEmail] = useState(form.admin_email || 'admin@isac-mls.com');
  const [adminPassword, setAdminPassword] = useState(form.admin_password || 'admin123');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);

    const updatedForm = {
      ...form,
      admin_email: adminEmail.trim(),
      admin_password: adminPassword.trim(),
    };

    // Save admin credentials locally for resilient offline auth
    localStorage.setItem(
      'isac_lms_admin_credentials',
      JSON.stringify({ email: adminEmail.trim(), password: adminPassword.trim() })
    );

    // Save site settings locally
    localStorage.setItem('isac_lms_settings', JSON.stringify(updatedForm));

    if (settings?.id) {
      await supabase.from('site_settings').update({ ...updatedForm, updated_at: new Date().toISOString() }).eq('id', settings.id);
    } else {
      await supabase.from('site_settings').insert(updatedForm);
    }
    setSaving(false);
    setSaved(true);

    // Dispatch global event so App.tsx and all components update instantly!
    window.dispatchEvent(new Event('isac_settings_updated'));

    setTimeout(() => setSaved(false), 3000);
    onChanged();
  };

  const cls = "w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all";

  return (
    <div className="max-w-3xl space-y-8">
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl p-4 border border-green-200 font-semibold shadow-sm">
          <Check className="w-5 h-5 text-green-600" /> {t('admin_settings_saved')}
        </div>
      )}

      {/* Section 0: Identifiants Administrateur */}
      <Section title="Modification de l'Accès Administrateur (Email & Mot de Passe)">
        <p className="text-xs text-gray-500 mb-2">
          Modifiez l'adresse email et le mot de passe d'accès au Tableau de Bord Administrateur Général.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Administrateur</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className={cls}
              placeholder="admin@isac-mls.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nouveau Mot de Passe Administrateur</label>
            <input
              type="text"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className={`${cls} font-mono font-bold text-amber-700`}
              placeholder="Mot de passe sécurisé"
            />
          </div>
        </div>
      </Section>

      {/* Section 1: Tutelle Ministérielle & Agréments de l'État (METFP / MENA-ETFP) */}
      <Section title="Tutelle Ministérielle & Agréments Officiels (METFP / MENA-ETFP)">
        <p className="text-xs text-gray-500 mb-2">
          Ces références ministérielles et le sceau de l'État guinéen s'affichent en en-tête de tous les diplômes et documents administratifs certifiés.
        </p>

        <div className="space-y-4">
          <FileUploadZone
            label="Sceau / Logo Officiel du Ministère (MENA-ETFP / METFP)"
            acceptType="photo"
            currentUrl={form.ministry_logo_url || '/logo_ministere_guinee.jpg'}
            onFileSelected={(res: FileUploadResult) => setForm({ ...form, ministry_logo_url: res.url })}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="N° Arrêté de Création (Ministère)"
              value={form.creation_approval_num || 'N°070/METFP-ET/DNETPP/14'}
              onChange={(v) => setForm({ ...form, creation_approval_num: v })}
              cls={cls}
              placeholder="N°070/METFP-ET/DNETPP/14"
            />
            <Input
              label="N° Autorisation d'Ouverture (Ministère)"
              value={form.opening_approval_num || 'N°2014/3942/CAB/DNETPP'}
              onChange={(v) => setForm({ ...form, opening_approval_num: v })}
              cls={cls}
              placeholder="N°2014/3942/CAB/DNETPP"
            />
          </div>
        </div>
      </Section>

      {/* Section 2: Signatures Officielles & Cachet des Signataires */}
      <Section title="Signatures Officielles & Cachet de l'Établissement (Diplômes & Documents)">
        <p className="text-xs text-gray-500 mb-2">
          Chargez les images transparentes des signatures de la Direction et le Cachet Officiel. Ils s'afficheront automatiquement au bas des diplômes.
        </p>

        <div className="space-y-4">
          <FileUploadZone
            label="Signature Officielle du Directeur Général & Fondateur (M. Camara Alseny Tawel)"
            acceptType="photo"
            currentUrl={form.signature_dg_url || undefined}
            onFileSelected={(res: FileUploadResult) => setForm({ ...form, signature_dg_url: res.url })}
          />

          <FileUploadZone
            label="Signature Officielle du Directeur des Campus & Co-fondateur (M. Idrissa Souaré)"
            acceptType="photo"
            currentUrl={form.signature_cofondateur_url || undefined}
            onFileSelected={(res: FileUploadResult) => setForm({ ...form, signature_cofondateur_url: res.url })}
          />

          <FileUploadZone
            label="Cachet & Sceau Officiel de l'Établissement (Sceau Circulaire)"
            acceptType="photo"
            currentUrl={form.stamp_url || undefined}
            onFileSelected={(res: FileUploadResult) => setForm({ ...form, stamp_url: res.url })}
          />
        </div>
      </Section>

      {/* Section 3: Logo & Image d'Arrière-Plan du Site */}
      <Section title="Identité Visuelle & Image d'Arrière-Plan du Site (Hero Background)">
        <p className="text-xs text-gray-500 mb-2">
          Téléchargez le logo officiel de l'école et choisissez une jolie photo d'arrière-plan pour la page d'accueil.
        </p>

        <div className="space-y-4">
          <FileUploadZone
            label="Logo Officiel de l'Établissement (PNG/SVG transparent)"
            acceptType="photo"
            currentUrl={form.logo_url || undefined}
            onFileSelected={(res: FileUploadResult) => setForm({ ...form, logo_url: res.url })}
          />

          <FileUploadZone
            label="Image d'Arrière-Plan du Site / Section Héro (Format HD / Décoratif)"
            acceptType="photo"
            currentUrl={form.hero_background_url || undefined}
            onFileSelected={(res: FileUploadResult) => setForm({ ...form, hero_background_url: res.url })}
          />
        </div>
      </Section>

      {/* Section 4: Numéros de Paiement Officiels GNF */}
      <Section title="Numéros de Paiement Officiels en Guinée (Au vu de tous)">
        <p className="text-xs text-gray-500 mb-2">
          Ces numéros s'affichent publiquement dans l'Espace Étudiant et les fiches d'inscription pour effectuer les versements.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Orange Money (+224)" value={form.admin_orange_money || ''} onChange={(v) => setForm({ ...form, admin_orange_money: v })} cls={cls} placeholder="+224 620 00 00 00" />
          <Input label="MTN Mobile Money (+224)" value={form.admin_mtn_money || ''} onChange={(v) => setForm({ ...form, admin_mtn_money: v })} cls={cls} placeholder="+224 660 00 00 00" />
          <Input label="Kulu (+224)" value={form.admin_kulu_money || ''} onChange={(v) => setForm({ ...form, admin_kulu_money: v })} cls={cls} placeholder="+224 625 00 00 00" />
          <Input label="PayCard (+224)" value={form.admin_paycard_money || ''} onChange={(v) => setForm({ ...form, admin_paycard_money: v })} cls={cls} placeholder="+224 657 00 00 00" />
          <Input label="Cash Moov (+224)" value={form.admin_cashmoov_money || ''} onChange={(v) => setForm({ ...form, admin_cashmoov_money: v })} cls={cls} placeholder="+224 628 00 00 00" />
        </div>
      </Section>

      {/* Section 5: Cellule de Communication WhatsApp & Réseaux Sociaux */}
      <Section title="Cellule de Communication WhatsApp & Réseaux Sociaux">
        <p className="text-xs text-gray-500 mb-2">
          Configurez les canaux officiels de communication s'affichant dans le pied de page et la cellule Com.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Numéro WhatsApp Officiel (+224)" value={form.whatsapp_contact_phone || ''} onChange={(v) => setForm({ ...form, whatsapp_contact_phone: v })} cls={cls} placeholder="+224 620 00 00 00" />
          <Input label="Lien du Groupe WhatsApp Officiel" value={form.whatsapp_group_url || ''} onChange={(v) => setForm({ ...form, whatsapp_group_url: v })} cls={cls} placeholder="https://chat.whatsapp.com/..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <Input label="Page Facebook Officielle" value={form.facebook_url || ''} onChange={(v) => setForm({ ...form, facebook_url: v })} cls={cls} placeholder="https://facebook.com/..." />
          <Input label="Compte Twitter / X" value={form.twitter_url || ''} onChange={(v) => setForm({ ...form, twitter_url: v })} cls={cls} placeholder="https://twitter.com/..." />
          <Input label="Page LinkedIn Officielle" value={form.linkedin_url || ''} onChange={(v) => setForm({ ...form, linkedin_url: v })} cls={cls} placeholder="https://linkedin.com/company/..." />
          <Input label="Compte Instagram" value={form.instagram_url || ''} onChange={(v) => setForm({ ...form, instagram_url: v })} cls={cls} placeholder="https://instagram.com/..." />
        </div>
      </Section>

      <Section title={t('admin_settings_site_name')}>
        <Input label={t('admin_settings_site_name')} value={form.site_name || ''} onChange={(v) => setForm({ ...form, site_name: v })} cls={cls} />
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin_settings_tagline_fr')} value={form.tagline_fr || ''} onChange={(v) => setForm({ ...form, tagline_fr: v })} cls={cls} />
          <Input label={t('admin_settings_tagline_en')} value={form.tagline_en || ''} onChange={(v) => setForm({ ...form, tagline_en: v })} cls={cls} />
        </div>
      </Section>

      <Section title="Hero & Présentation Textuelle">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin_settings_hero_title_fr')} value={form.hero_title_fr || ''} onChange={(v) => setForm({ ...form, hero_title_fr: v })} cls={cls} />
          <Input label={t('admin_settings_hero_title_en')} value={form.hero_title_en || ''} onChange={(v) => setForm({ ...form, hero_title_en: v })} cls={cls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin_settings_hero_subtitle_fr')} value={form.hero_subtitle_fr || ''} onChange={(v) => setForm({ ...form, hero_subtitle_fr: v })} cls={cls} textarea />
          <Input label={t('admin_settings_hero_subtitle_en')} value={form.hero_subtitle_en || ''} onChange={(v) => setForm({ ...form, hero_subtitle_en: v })} cls={cls} textarea />
        </div>
      </Section>

      <Section title={t('section_contact_title')}>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin_settings_contact_email')} value={form.contact_email || ''} onChange={(v) => setForm({ ...form, contact_email: v })} cls={cls} placeholder="ecoledegestiondecommerce@gmail.com" />
          <Input label={t('admin_settings_contact_phone')} value={form.contact_phone || ''} onChange={(v) => setForm({ ...form, contact_phone: v })} cls={cls} placeholder="+224 620 00 00 00" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin_settings_address_fr')} value={form.address_fr || ''} onChange={(v) => setForm({ ...form, address_fr: v })} cls={cls} placeholder="Conakry, République de Guinée" />
          <Input label={t('admin_settings_address_en')} value={form.address_en || ''} onChange={(v) => setForm({ ...form, address_en: v })} cls={cls} placeholder="Conakry, Republic of Guinea" />
        </div>
      </Section>

      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60">
        <Save className="w-5 h-5" /> Enregistrer Toutes les Modifications
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
      <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, cls, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; cls: string; textarea?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {textarea ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}
