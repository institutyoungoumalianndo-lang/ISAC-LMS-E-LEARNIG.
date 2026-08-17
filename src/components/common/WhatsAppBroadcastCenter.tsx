import { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, Share2, PhoneCall, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { SiteSettings } from '@/lib/supabase';

export function WhatsAppBroadcastCenter() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    whatsapp_contact_phone: '+224 620 00 00 00',
    whatsapp_group_url: 'https://chat.whatsapp.com/ISAC-MLS-Guinee-Official-2026',
  });

  const [message, setMessage] = useState('');
  const [targetPhone, setTargetPhone] = useState('');

  useEffect(() => {
    const savedStr = localStorage.getItem('isac_lms_settings');
    if (savedStr) {
      try {
        setSettings(JSON.parse(savedStr));
      } catch (e) {}
    }
  }, []);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Clean phone number or default to cell phone
    const cleanPhone = (targetPhone || settings.whatsapp_contact_phone || '224620000000').replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(`[COMMUNIQUÉ OFFICIEL ISAC MLS]\n\n${message.trim()}`);

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodedMsg}`
      : `https://api.whatsapp.com/send?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur">
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            Cellule de Communication WhatsApp
          </div>
          <h2 className="text-2xl font-extrabold">Diffusion & Annonces WhatsApp</h2>
          <p className="text-xs text-white/80 max-w-lg leading-relaxed">
            Communiquez en direct avec la communauté ISAC MLS, envoyez des notifications à tous et rejoignez le groupe officiel.
          </p>
        </div>

        {settings.whatsapp_group_url && (
          <a
            href={settings.whatsapp_group_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-xl transition-all flex-shrink-0"
          >
            <Users className="w-4 h-4" /> Rejoindre le Groupe WhatsApp Officiel
          </a>
        )}
      </div>

      {/* Broadcast Message Form */}
      <form onSubmit={handleSendWhatsApp} className="space-y-4 text-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Numéro Destinataire (Optionnel - Laisser vide pour diffusion)</label>
            <input
              type="text"
              placeholder="Ex: 224620000000 ou laisser vide pour tous"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Numéro Cellule Com WhatsApp Admin</label>
            <input
              type="text"
              readOnly
              value={settings.whatsapp_contact_phone || '+224 620 00 00 00'}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Message du Communiqué à diffuser sur WhatsApp</label>
          <textarea
            rows={3}
            required
            placeholder="Rédigez l'annonce officielle de la filière, les dates d'examens ou la confirmation de paiement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Cliquez ci-dessous pour ouvrir WhatsApp Web ou l'application WhatsApp avec le message pré-rempli.
          </p>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Send className="w-4 h-4" /> Envoyer / Diffuser sur WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
