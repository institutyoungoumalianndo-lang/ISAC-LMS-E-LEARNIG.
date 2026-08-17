import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { SiteSettings } from '@/lib/supabase';

type ContactSectionProps = {
  settings: SiteSettings | null;
};

export function ContactSection({ settings }: ContactSectionProps) {
  const { t, localized } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const email = settings?.contact_email || 'contact@isac-mls.com';
  const phone = settings?.contact_phone || settings?.whatsapp_contact_phone || '+224 620 00 00 00';
  const addressFr = settings?.address_fr || 'Conakry, République de Guinée';
  const addressEn = settings?.address_en || 'Conakry, Republic of Guinea';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {t('section_contact_title')}
          </h2>
          <p className="text-lg text-gray-500">{t('section_contact_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('contact_email')}</h3>
                <a href={`mailto:${email}`} className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('contact_phone')}</h3>
                <span className="text-gray-600 font-medium font-mono">{phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('contact_address')}</h3>
                <span className="text-gray-600 font-medium">{localized(addressFr, addressEn)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact_name')}</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                placeholder="Votre nom complet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact_email')}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                placeholder="votre.email@domaine.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact_message')}</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                placeholder="Votre message ou demande d'information..."
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all shadow-md"
            >
              {t('contact_send')}
              <Send className="w-4 h-4" />
            </button>
            {sent && (
              <div className="text-center text-sm text-green-600 font-medium bg-green-50 rounded-xl py-3 border border-green-200">
                {t('contact_sent')}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
