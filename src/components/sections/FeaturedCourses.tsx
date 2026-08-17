import { useLanguage } from '@/lib/LanguageContext';
import { CourseCard } from './CourseCard';
import type { Course } from '@/lib/supabase';

type FeaturedCoursesProps = {
  courses: Course[];
  onViewAll: () => void;
  onEnrollLogin: () => void;
};

export function FeaturedCourses({ courses, onViewAll, onEnrollLogin }: FeaturedCoursesProps) {
  const { t } = useLanguage();

  const featured = courses.filter((c) => c.is_featured && c.is_published).slice(0, 6);
  if (featured.length === 0) {
    const published = courses.filter((c) => c.is_published).slice(0, 6);
    if (published.length === 0) return null;
    return <SectionContent courses={published} onViewAll={onViewAll} onEnrollLogin={onEnrollLogin} />;
  }

  return <SectionContent courses={featured} onViewAll={onViewAll} onEnrollLogin={onEnrollLogin} />;
}

function SectionContent({ courses, onViewAll, onEnrollLogin }: { courses: Course[]; onViewAll: () => void; onEnrollLogin: () => void }) {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {t('section_courses_title')}
            </h2>
            <p className="text-lg text-gray-500">{t('section_courses_subtitle')}</p>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-teal-600 text-teal-600 font-semibold hover:bg-teal-600 hover:text-white transition-all"
          >
            {t('section_all_courses_title')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onEnrollLogin={onEnrollLogin} />
          ))}
        </div>
      </div>
    </section>
  );
}
