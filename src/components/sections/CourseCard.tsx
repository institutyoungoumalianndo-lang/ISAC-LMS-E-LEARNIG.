import { Clock, Star, CheckCircle2, LogIn, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase, type Course } from '@/lib/supabase';
import { PaymentDeclarationModal } from '../payment/PaymentDeclarationModal';

type CourseCardProps = {
  course: Course;
  onClick?: () => void;
  onEnrollLogin?: () => void;
};

export function CourseCard({ course, onClick, onEnrollLogin }: CourseCardProps) {
  const { t, lang, localized } = useLanguage();
  const { session, isAdmin } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const levelLabel = (() => {
    if (course.level === 'beginner') return t('course_level_beginner');
    if (course.level === 'intermediate') return t('course_level_intermediate');
    return t('course_level_advanced');
  })();

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session || isAdmin) {
      onEnrollLogin?.();
      return;
    }
    // Automatically open Payment Declaration Modal upon clicking S'inscrire!
    setShowPaymentModal(true);
  };

  const handlePaymentSubmitted = async () => {
    setShowPaymentModal(false);
    setEnrolled(true);
    setMsg("Déclaration de paiement transmise ! Votre espace filière s'ouvrira dès validation par l'Administration.");

    // Create enrollment record
    if (session?.user?.id || session?.user?.email) {
      const userKey = session.user.id || session.user.email;
      await supabase.from('enrollments').insert({
        student_id: userKey,
        course_id: course.id,
        status: 'pending',
      });
    }
  };

  const currentStudentEmail = session?.user?.email || 'etudiant@isac-mls.com';
  const currentStudentName = session?.user?.user_metadata?.full_name || currentStudentEmail.split('@')[0] || 'Étudiant ISAC';

  return (
    <>
      <div
        onClick={onClick}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      >
        <div className="relative h-48 bg-gradient-to-br from-teal-500 to-cyan-600 overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={lang === 'fr' ? course.title_fr : course.title_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">
                {lang === 'fr' ? course.title_fr.charAt(0) : course.title_en.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level] || levelColors.beginner}`}>
              {levelLabel}
            </span>
            {course.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-600 text-white flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md uppercase font-mono tracking-wider">
              {course.diploma_type || 'CQP'}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          {course.category && (
            <span className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-2">
              {lang === 'fr' ? course.category.name_fr : course.category.name_en}
            </span>
          )}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
            {lang === 'fr' ? course.title_fr : course.title_en}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
            {localized(course.description_fr, course.description_en)}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-3">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5 font-bold text-gray-800 text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {course.duration_fr || '6 Mois'}
              </span>
            </div>
            <div className="text-right">
              {course.price_gnf != null && course.price_gnf > 0 ? (
                <span className="text-base sm:text-lg font-bold text-teal-700">
                  {new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(course.price_gnf)} GNF
                </span>
              ) : course.price != null && course.price > 0 ? (
                <span className="text-base sm:text-lg font-bold text-teal-700">
                  {new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(course.price * 10000)} GNF
                </span>
              ) : (
                <span className="text-sm font-semibold text-green-600">{t('course_free')}</span>
              )}
            </div>
          </div>

          {msg && (
            <div className="text-xs rounded-xl p-3 mb-2 bg-amber-50 text-amber-900 border border-amber-200 font-medium">
              {msg}
            </div>
          )}

          <button
            onClick={handleEnrollClick}
            disabled={enrolled}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              enrolled
                ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-default'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
            }`}
          >
            {enrolled ? (
              <>
                <Clock className="w-4 h-4 text-amber-700" /> En Attente de Validation Admin
              </>
            ) : !session || isAdmin ? (
              <>
                <LogIn className="w-4 h-4" /> Se Connecter pour S'inscrire
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-amber-300" /> S'inscrire & Déclarer le Paiement
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auto-Open Modal Déclaration de Paiement */}
      {showPaymentModal && (
        <PaymentDeclarationModal
          course={course}
          studentName={currentStudentName}
          studentEmail={currentStudentEmail}
          onClose={() => setShowPaymentModal(false)}
          onSubmitted={handlePaymentSubmitted}
        />
      )}
    </>
  );
}
