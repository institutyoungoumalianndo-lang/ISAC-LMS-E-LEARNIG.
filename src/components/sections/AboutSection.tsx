import { useLanguage } from '@/lib/LanguageContext';
import type { SiteSettings, Instructor } from '@/lib/supabase';

type AboutSectionProps = {
  settings: SiteSettings | null;
  instructors: Instructor[];
};

export function AboutSection({ settings, instructors }: AboutSectionProps) {
  const { t, lang, localized } = useLanguage();

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t('section_about_title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {localized(settings?.about_fr, settings?.about_en)}
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-xl">✓</span>
                </div>
                <span className="text-gray-700 font-medium">
                  {lang === 'fr' ? 'Formations certifiantes' : 'Certified courses'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-xl">✓</span>
                </div>
                <span className="text-gray-700 font-medium">
                  {lang === 'fr' ? 'Accès à vie' : 'Lifetime access'}
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 p-1">
              <div className="w-full h-full rounded-[20px] bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white/90 mb-2">ISAC MLS</div>
                  <div className="text-teal-100">
                    {localized(settings?.tagline_fr, settings?.tagline_en)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {instructors.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              {lang === 'fr' ? 'Nos Instructeurs' : 'Our Instructors'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((inst) => (
                <div
                  key={inst.id}
                  className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  {inst.photo_url ? (
                    <img
                      src={inst.photo_url}
                      alt={inst.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                      {inst.name.charAt(0)}
                    </div>
                  )}
                  <h4 className="font-bold text-gray-900">{inst.name}</h4>
                  <p className="text-sm text-teal-600 mb-3">
                    {localized(inst.title_fr, inst.title_en)}
                  </p>
                  {inst.bio_fr && inst.bio_en && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {localized(inst.bio_fr, inst.bio_en)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
