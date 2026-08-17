import { useState, useEffect } from 'react';
import { ArrowRight, GraduationCap, Users, Star, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { SiteSettings } from '@/lib/supabase';

type HeroProps = {
  settings: SiteSettings | null;
  onExplore: () => void;
  onAbout: () => void;
};

export function Hero({ settings, onExplore, onAbout }: HeroProps) {
  const { t, localized } = useLanguage();
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.hero_background_url) {
      setBgUrl(settings.hero_background_url);
    } else {
      const savedStr = localStorage.getItem('isac_lms_settings');
      if (savedStr) {
        try {
          const s = JSON.parse(savedStr);
          if (s.hero_background_url) setBgUrl(s.hero_background_url);
        } catch (e) {}
      }
    }
  }, [settings]);

  const stats = [
    { icon: GraduationCap, value: '50+', label: t('stats_courses') },
    { icon: Users, value: '5000+', label: t('stats_students') },
    { icon: Star, value: '98%', label: t('stats_satisfaction') },
    { icon: Clock, value: '24/7', label: t('stats_courses') },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950">
      {/* Background Image Overlay if set by Admin */}
      {bgUrl && (
        <div className="absolute inset-0 z-0">
          <img src={bgUrl} alt="Arrière-plan du site" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-teal-950/80 to-slate-950/90 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
            <span className="text-white text-sm font-medium">
              {localized(settings?.tagline_fr, settings?.tagline_en)}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            {localized(settings?.hero_title_fr, settings?.hero_title_en)}
          </h1>

          <p className="text-lg sm:text-xl text-teal-50/90 leading-relaxed mb-8 max-w-2xl">
            {localized(settings?.hero_subtitle_fr, settings?.hero_subtitle_en)}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onExplore}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              {t('hero_cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onAbout}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              {t('hero_secondary')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <Icon className="w-8 h-8 text-teal-300 mb-3" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-teal-100/80">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
