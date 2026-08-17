import { useLanguage } from '@/lib/LanguageContext';
import { DynamicIcon } from '@/components/DynamicIcon';
import type { Category } from '@/lib/supabase';

type CategoriesSectionProps = {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
};

export function CategoriesSection({ categories, onSelectCategory }: CategoriesSectionProps) {
  const { t, lang, localized } = useLanguage();

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {t('section_categories_title')}
          </h2>
          <p className="text-lg text-gray-500">{t('section_categories_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group text-left bg-white rounded-2xl p-7 border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <DynamicIcon name={cat.icon || 'BookOpen'} className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                {lang === 'fr' ? cat.name_fr : cat.name_en}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {localized(cat.description_fr, cat.description_en)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
