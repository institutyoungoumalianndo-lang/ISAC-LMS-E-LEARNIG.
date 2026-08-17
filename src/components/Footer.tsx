import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { SiteSettings, Category } from '@/lib/supabase';

type FooterProps = {
  settings: SiteSettings | null;
  categories: Category[];
  onNavigate: (page: string) => void;
};

export function Footer({ settings, categories, onNavigate }: FooterProps) {
  const { t, lang, localized } = useLanguage();

  const email = settings?.contact_email || 'contact@isac-mls.com';
  const phone = settings?.contact_phone || settings?.whatsapp_contact_phone || '+224 620 00 00 00';
  const addressFr = settings?.address_fr || 'Conakry, République de Guinée';
  const addressEn = settings?.address_en || 'Conakry, Republic of Guinea';

  const socialLinks = [
    { name: 'Facebook', url: settings?.facebook_url || 'https://facebook.com/isac.mls.guinee', icon: Facebook },
    { name: 'Twitter', url: settings?.twitter_url || 'https://twitter.com/isac_mls', icon: Twitter },
    { name: 'LinkedIn', url: settings?.linkedin_url || 'https://linkedin.com/company/isac-mls', icon: Linkedin },
    { name: 'Instagram', url: settings?.instagram_url || 'https://instagram.com/isac_mls', icon: Instagram },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-white">{settings?.site_name || 'ISAC MLS'}</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {localized(settings?.tagline_fr, settings?.tagline_en) || 'Institut Supérieur Agréé & Centre de Formation Professionnelle en Guinée'}
            </p>

            {/* Accreditation Badge METFP / MENA-ETFP */}
            <div className="p-3 bg-gray-800/80 rounded-2xl border border-gray-700 flex items-center gap-3 mb-6 text-xs">
              <img src="/logo_ministere_guinee.jpg" alt="Ministère GUINÉE" className="w-10 h-10 object-contain rounded-full bg-white p-0.5" />
              <div className="space-y-0.5 font-mono text-[10px]">
                <div className="font-bold text-amber-400">MINISTÈRE DE L'ENSEIGNEMENT TECHNIQUE</div>
                <div className="text-gray-300">Création : N°070/METFP-ET/DNETPP/14</div>
                <div className="text-gray-300">Ouverture : N°2014/3942/CAB/DNETPP</div>
              </div>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ url, icon: Icon }, i) => (
                  <a
                    key={i}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors text-white"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">{t('nav_home')}</button></li>
              <li><button onClick={() => onNavigate('courses')} className="hover:text-teal-400 transition-colors">{t('nav_courses')}</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors">{t('nav_about')}</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors">{t('nav_contact')}</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_categories')}</h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('courses')}
                    className="hover:text-teal-400 transition-colors text-left"
                  >
                    {lang === 'fr' ? cat.name_fr : cat.name_en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                <a href={`mailto:${email}`} className="hover:text-teal-400 transition-colors">{email}</a>
              </li>

              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                <span className="font-mono text-gray-300">{phone}</span>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                <span>{localized(addressFr, addressEn)}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} {settings?.site_name || 'ISAC MLS'}. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
}
