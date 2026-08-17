import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { CourseCard } from '@/components/sections/CourseCard';
import type { Course, Category } from '@/lib/supabase';

type CoursesPageProps = {
  courses: Course[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onEnrollLogin: () => void;
};

export function CoursesPage({ courses, categories, selectedCategory, onSelectCategory, onEnrollLogin }: CoursesPageProps) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (!c.is_published) return false;
      if (selectedCategory && c.category_id !== selectedCategory) return false;
      if (level !== 'all' && c.level !== level) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.title_fr.toLowerCase().includes(q) && !c.title_en.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [courses, selectedCategory, level, search]);

  return (
    <div className="pt-24 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('section_all_courses_title')}</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 mb-8 border border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('filter_search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="pl-11 pr-8 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="all">{t('filter_all_levels')}</option>
                <option value="beginner">{t('course_level_beginner')}</option>
                <option value="intermediate">{t('course_level_intermediate')}</option>
                <option value="advanced">{t('course_level_advanced')}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('filter_all_categories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang === 'fr' ? cat.name_fr : cat.name_en}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">{t('no_data')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} onEnrollLogin={onEnrollLogin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
