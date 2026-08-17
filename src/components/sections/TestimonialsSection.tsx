import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { Testimonial } from '@/lib/supabase';

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t, lang, localized } = useLanguage();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t('section_testimonials_title')}
          </h2>
          <p className="text-lg text-teal-100/70">{t('section_testimonials_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Quote className="w-10 h-10 text-teal-400/50 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-200 leading-relaxed mb-6 italic">
                "{lang === 'fr' ? testimonial.content_fr : testimonial.content_en}"
              </p>
              <div className="flex items-center gap-3">
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white">{testimonial.author_name}</div>
                  <div className="text-sm text-teal-200/70">
                    {localized(testimonial.author_title_fr, testimonial.author_title_en)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
