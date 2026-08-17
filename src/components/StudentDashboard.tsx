import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, LogOut, BookOpen, Calendar, Trash2, ArrowRight, CreditCard, Video, FileText, Lock, CheckCircle2, AlertCircle, Clock, ShieldCheck, UserCheck, Award, Library, MessageSquare, Send, User } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase, type Course, type PaymentDeclaration, type CourseResource, type Certificate } from '@/lib/supabase';
import { PaymentDeclarationModal } from './payment/PaymentDeclarationModal';
import { VirtualClassroom } from './classroom/VirtualClassroom';
import { DigitalLibrary } from './library/DigitalLibrary';
import { CertificateGeneratorModal } from './certificate/CertificateGeneratorModal';
import { AIAssistantWidget } from './ai/AIAssistantWidget';
import { CoursePlayerModal } from './course/CoursePlayerModal';
import { WhatsAppBroadcastCenter } from './common/WhatsAppBroadcastCenter';

type StudentDashboardProps = {
  onExit: () => void;
  onBrowse: () => void;
};

type Enrollment = {
  id: string;
  student_id: string;
  course_id: string;
  status: 'active' | 'locked' | 'completed';
  created_at: string;
  course: Course;
};

type StudentTab = 'courses' | 'resources' | 'library' | 'whatsapp' | 'exams' | 'meetings';

export function StudentDashboard({ onExit, onBrowse }: StudentDashboardProps) {
  const { t, lang } = useLanguage();
  const { session, signOut } = useAuth();

  const [tab, setTab] = useState<StudentTab>('courses');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [declarations, setDeclarations] = useState<PaymentDeclaration[]>([]);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModalCourse, setPayModalCourse] = useState<Course | null>(null);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [activePlayerCourse, setActivePlayerCourse] = useState<Course | null>(null);

  const currentStudentEmail = session?.user?.email || 'etudiant@isac-mls.com';
  const currentStudentName = session?.user?.user_metadata?.full_name || currentStudentEmail.split('@')[0] || 'Étudiant ISAC';

  const loadData = useCallback(async () => {
    // 1. Fetch catalog courses
    let loadedCourses: Course[] = [];
    const savedCoursesStr = localStorage.getItem('isac_lms_courses');
    if (savedCoursesStr) {
      try {
        loadedCourses = JSON.parse(savedCoursesStr);
      } catch (e) {}
    }

    const { data: coursesData } = await supabase
      .from('courses')
      .select('*, category:course_categories(*), instructor:profiles(*)')
      .order('created_at', { ascending: false });

    if (coursesData && coursesData.length > 0) {
      loadedCourses = coursesData;
    }

    setAllCourses(loadedCourses);

    // Load saved instructors for mapping fallback
    let savedInstructors: any[] = [];
    const savedInstStr = localStorage.getItem('isac_lms_instructors');
    if (savedInstStr) {
      try {
        savedInstructors = JSON.parse(savedInstStr);
      } catch (e) {}
    }

    // Enrich courses with instructor fallback if missing
    const enrichedCoursesMap: Record<string, Course> = {};
    loadedCourses.forEach((c, idx) => {
      let inst = c.instructor;
      if (!inst && savedInstructors.length > 0) {
        inst = savedInstructors[idx % savedInstructors.length];
      }
      enrichedCoursesMap[c.id] = { ...c, instructor: inst };
    });

    const userKey = session?.user?.id || session?.user?.email || 'student-user';
    const userEmail = session?.user?.email?.toLowerCase() || '';

    // Merge Supabase enrollments & LocalStorage enrollments
    const { data: sbEnrollments } = await supabase
      .from('enrollments')
      .select('*, course:courses(*, category:course_categories(*), instructor:profiles(*))')
      .eq('student_id', userKey)
      .order('created_at', { ascending: false });

    let localEnrollments: any[] = [];
    const savedEnrStr = localStorage.getItem('isac_lms_enrollments');
    if (savedEnrStr) {
      try {
        localEnrollments = JSON.parse(savedEnrStr);
      } catch (e) {}
    }

    const mergedEnrollmentsMap: Record<string, Enrollment> = {};

    // Add Supabase enrollments
    if (sbEnrollments && sbEnrollments.length > 0) {
      sbEnrollments.forEach((e: any) => {
        const matchedCourse = enrichedCoursesMap[e.course_id] || e.course;
        if (matchedCourse) {
          mergedEnrollmentsMap[e.course_id] = {
            id: e.id || `enr-${e.course_id}`,
            student_id: userKey,
            course_id: e.course_id,
            status: e.status || 'active',
            created_at: e.created_at || new Date().toISOString(),
            course: matchedCourse,
          };
        }
      });
    }

    // Add LocalStorage enrollments
    localEnrollments.forEach((e: any) => {
      if ((e.student_id === userKey || e.student_email === userEmail) && e.course_id) {
        const matchedCourse = enrichedCoursesMap[e.course_id];
        if (matchedCourse && !mergedEnrollmentsMap[e.course_id]) {
          mergedEnrollmentsMap[e.course_id] = {
            id: e.id || `enr-${e.course_id}`,
            student_id: userKey,
            course_id: e.course_id,
            status: e.status || 'active',
            created_at: e.created_at || new Date().toISOString(),
            course: matchedCourse,
          };
        }
      }
    });

    // If no explicit enrollments found yet, default to first course
    if (Object.keys(mergedEnrollmentsMap).length === 0 && loadedCourses.length > 0) {
      const firstCourse = Object.values(enrichedCoursesMap)[0];
      mergedEnrollmentsMap[firstCourse.id] = {
        id: 'enr-default',
        student_id: userKey,
        course_id: firstCourse.id,
        status: 'active',
        created_at: new Date().toISOString(),
        course: firstCourse,
      };
    }

    setEnrollments(Object.values(mergedEnrollmentsMap));

    // 2. Load payment declarations
    const savedDecsStr = localStorage.getItem('isac_lms_payment_declarations');
    if (savedDecsStr) {
      try {
        setDeclarations(JSON.parse(savedDecsStr));
      } catch (e) {}
    }

    // 3. Load resources
    const savedResStr = localStorage.getItem('isac_lms_resources');
    if (savedResStr) {
      try {
        setResources(JSON.parse(savedResStr));
      } catch (e) {}
    }

    // 4. Load certificates (Transferred exclusively by Admin)
    const savedCertsStr = localStorage.getItem('isac_lms_certificates');
    if (savedCertsStr) {
      try {
        const certsList: Certificate[] = JSON.parse(savedCertsStr);
        const myCerts = certsList.filter(
          (c) =>
            (c.student_email && c.student_email.toLowerCase() === userEmail) ||
            (c.student_id && c.student_id === userKey) ||
            (c.student_name && userEmail && c.student_name.toLowerCase().includes(userEmail.split('@')[0]))
        );
        setCertificates(myCerts);
      } catch (e) {}
    }

    setLoading(false);
  }, [session?.user?.id, session?.user?.email]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('isac_payment_validated', handleUpdate);
    window.addEventListener('isac_resources_updated', handleUpdate);
    return () => {
      window.removeEventListener('isac_payment_validated', handleUpdate);
      window.removeEventListener('isac_resources_updated', handleUpdate);
    };
  }, [loadData]);

  // Check Tranche Payment Status for a specific course
  const getTrancheStatus = (courseId: string, trancheNum: 1 | 2 | 3) => {
    const studentEmail = session?.user?.email?.toLowerCase() || '';
    const match = declarations.find(
      (d) => d.course_id === courseId && d.tranche === trancheNum && d.student_email?.toLowerCase() === studentEmail
    );
    if (!match) return 'unpaid';
    return match.status; // 'pending' | 'validated' | 'rejected'
  };

  // Check if course access is unlocked (Tranche 1 must be validated by Admin)
  const isCourseUnlocked = (courseId: string, enrollmentStatus?: string) => {
    if (enrollmentStatus === 'locked') return false;
    const t1Status = getTrancheStatus(courseId, 1);
    return t1Status === 'validated';
  };

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  const formatGnf = (val: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(val) + ' GNF';
  };

  // Extract enrolled courses
  const enrolledCourses = enrollments.map((e) => e.course).filter(Boolean);
  // Extract instructors assigned to student's enrolled courses ONLY
  const assignedInstructors = enrolledCourses
    .map((c) => c.instructor)
    .filter((inst, idx, self) => inst && self.findIndex((i) => i?.id === inst.id) === idx);

  // Filter resources to enrolled courses ONLY
  const studentResources = resources.filter((r) =>
    enrolledCourses.some((c) => c.id === r.course_id)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Floating AI Tutor Assistant */}
      <AIAssistantWidget />

      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Espace Étudiant ISAC MLS</h1>
              <p className="text-xs text-teal-300">Bienvenue, {currentStudentName} ({currentStudentEmail})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBrowse}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors hidden sm:block"
            >
              Parcourir le Catalogue des Filières
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2">
          {[
            { id: 'courses', label: `Mes Filières Inscrites (${enrollments.length})`, icon: BookOpen },
            { id: 'resources', label: 'Ressources de mes Cours', icon: FileText },
            { id: 'meetings', label: 'Classes Virtuelles avec mes Formateurs', icon: Video },
            { id: 'library', label: 'Bibliothèque Numérique', icon: Library },
            { id: 'whatsapp', label: 'Cellule WhatsApp', icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as StudentTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  active
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement de votre espace...</div>
        ) : (
          <>
            {/* Tab 1: Mes Filières & Condition d'Accès par Paiement Validé */}
            {tab === 'courses' && (
              <div className="space-y-8">
                {/* Status Alert Banner */}
                <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-teal-800/40 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span className="font-mono text-xs uppercase text-amber-300 font-bold tracking-wider">
                          Accès Intégral à vos Formations & Formateurs
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold font-serif">Mes Filières d'Études Enregistrées ({enrollments.length})</h2>
                      <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                        Consultez vos filières choisies, vos vidéos HD, quiz QCM, supports de cours PDF et interagissez directement avec vos formateurs attitrés.
                      </p>
                    </div>

                    <button
                      onClick={onBrowse}
                      className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all self-start sm:self-auto"
                    >
                      + Inscrire une Nouvelle Filière
                    </button>
                  </div>
                </div>

                {/* List of Enrolled Courses */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Toutes mes Filières & Cours d'Études</h3>

                  {enrollments.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                      <BookOpen className="w-12 h-12 text-teal-600 mx-auto" />
                      <h4 className="font-bold text-gray-900">Vous n'êtes inscrit à aucune filière pour le moment.</h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">
                        Parcourez notre catalogue et choisissez une formation professionnelle adaptée à vos objectifs.
                      </p>
                      <button
                        onClick={onBrowse}
                        className="px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs shadow hover:bg-teal-700"
                      >
                        Explorer les Formations
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {enrollments.map((enr) => {
                        const c = enr.course;
                        if (!c) return null;
                        const t1Status = getTrancheStatus(c.id, 1);
                        const t2Status = getTrancheStatus(c.id, 2);
                        const t3Status = getTrancheStatus(c.id, 3);
                        const unlocked = isCourseUnlocked(c.id, enr.status);
                        const coursePriceGnf = c.price_gnf || (c.price ? c.price * 10000 : 1500000);
                        const instructorName = c.instructor?.name || (c.instructor as any)?.full_name || 'Dr. Barry / M. Camara';

                        return (
                          <div
                            key={enr.id}
                            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between ${
                              unlocked
                                ? 'border-teal-200 hover:shadow-lg'
                                : 'border-amber-200 bg-amber-50/20'
                            }`}
                          >
                            <div className="p-6 space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase font-mono tracking-wider">
                                    {c.diploma_type || 'CQP'}
                                  </span>
                                  <h4 className="text-lg font-extrabold text-gray-900 mt-2 font-serif">{c.title_fr}</h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Durée : <strong className="text-teal-900 font-bold">{c.duration_fr || '6 Mois'}</strong>
                                  </p>
                                </div>

                                {unlocked ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Accès Validé
                                  </span>
                                ) : t1Status === 'pending' ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> En attente Admin
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
                                    <Lock className="w-3.5 h-3.5" /> Verrouillé
                                  </span>
                                )}
                              </div>

                              {/* Formateur Affecté Card Badge */}
                              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-xs shadow">
                                    {instructorName.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">Formateur Référent Affecté</span>
                                    <span className="font-bold text-gray-900">{instructorName}</span>
                                  </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-[10px] font-bold">Accrédité ISAC</span>
                              </div>

                              {/* Payment Tranches Grid */}
                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs">
                                <div className="font-bold text-gray-700 flex justify-between">
                                  <span>Frais d'Études : <strong className="text-teal-900">{formatGnf(coursePriceGnf)}</strong></span>
                                  <span>Tranches (1/3, 2/3, 3/3)</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                                  <div className={`p-2 rounded-xl border text-center font-bold ${t1Status === 'validated' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : t1Status === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    Tranche 1 : {t1Status === 'validated' ? 'VALIDÉ' : t1Status === 'pending' ? 'EN ATTENTE' : 'À PAYER'}
                                  </div>
                                  <div className={`p-2 rounded-xl border text-center font-bold ${t2Status === 'validated' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : t2Status === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    Tranche 2 : {t2Status === 'validated' ? 'VALIDÉ' : t2Status === 'pending' ? 'EN ATTENTE' : 'À PAYER'}
                                  </div>
                                  <div className={`p-2 rounded-xl border text-center font-bold ${t3Status === 'validated' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : t3Status === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    Tranche 3 : {t3Status === 'validated' ? 'VALIDÉ' : t3Status === 'pending' ? 'EN ATTENTE' : 'À PAYER'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                              <button
                                onClick={() => setPayModalCourse(c)}
                                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                              >
                                <CreditCard className="w-4 h-4 text-amber-400" /> Déclarer un Paiement (GNF)
                              </button>

                              {unlocked ? (
                                <button
                                  onClick={() => setActivePlayerCourse(c)}
                                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow transition-all flex items-center gap-1.5"
                                >
                                  Accéder aux Cours HD & Quiz <ArrowRight className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-500 font-bold text-xs cursor-not-allowed flex items-center gap-1.5"
                                >
                                  <Lock className="w-3.5 h-3.5" /> Accès Bloqué (Attente Admin)
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section Diplômes Transférés exclusivement par l'Admin */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" /> Mon Coffre-fort de Diplômes Certifiants
                      </h3>
                      <p className="text-xs text-gray-500">
                        Vos diplômes certifiants (CQP, DQP, CAP, Attestations A4 Paysage) sont transférés ici par l'Administration après validation finale de vos épreuves.
                      </p>
                    </div>
                  </div>

                  {certificates.length === 0 ? (
                    <div className="p-8 bg-amber-50/50 rounded-2xl border border-amber-200 text-center space-y-2">
                      <Award className="w-10 h-10 text-amber-600 mx-auto" />
                      <h4 className="font-bold text-amber-950 text-sm">Aucun Diplôme Transféré pour le Moment</h4>
                      <p className="text-xs text-amber-800 max-w-lg mx-auto">
                        Votre diplôme officiel sera disponible et téléchargeable dans cet espace dès que l'Administration aura validé le transfert après la correction de vos examens finaux et le règlement complet de votre formation.
                      </p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-teal-900 block">N° {cert.serial_number}</span>
                            <h4 className="font-bold text-gray-900 text-sm font-serif">{cert.course_title}</h4>
                            <p className="text-xs text-gray-500">Mention : <strong className="text-teal-950 font-bold">{cert.grade_mention}</strong></p>
                          </div>
                          <button
                            onClick={() => setActiveCert(cert)}
                            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow"
                          >
                            Afficher / PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Ressources de mes cours (Filtré aux cours déverrouillés) */}
            {tab === 'resources' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ressources & Supports de Cours (Filières Inscrites)</h3>
                  <p className="text-xs text-gray-500">Téléchargez les supports PDF, exercices et guides transmis par les formateurs de vos filières.</p>
                </div>

                {studentResources.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Aucune ressource disponible pour le moment.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {studentResources.map((res) => (
                      <div key={res.id} className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-teal-300 transition-all flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-teal-600 uppercase">{res.type}</span>
                          <h4 className="font-bold text-gray-900 text-sm">{res.title}</h4>
                          <p className="text-xs text-gray-500">{res.description}</p>
                        </div>
                        <a
                          href={res.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-xs transition-colors"
                        >
                          Télécharger
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Classes Virtuelles avec les Formateurs Affectés */}
            {tab === 'meetings' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Formateurs Affectés à vos Filières</h3>
                  <p className="text-xs text-gray-500">Vous pouvez interagir uniquement avec les enseignants référents de vos formations choisies.</p>
                  <div className="flex gap-3 pt-2 flex-wrap">
                    {assignedInstructors.map((inst) => (
                      <div key={inst?.id || 'inst'} className="flex items-center gap-2 px-3.5 py-2 bg-teal-50 rounded-xl border border-teal-200 text-xs font-bold text-teal-950">
                        <UserCheck className="w-4 h-4 text-teal-600" />
                        {inst?.name || (inst as any)?.full_name || 'Professeur Référent ISAC'}
                      </div>
                    ))}
                  </div>
                </div>

                <VirtualClassroom courses={enrolledCourses} userRole="student" currentUserId={session?.user?.id} />
              </div>
            )}

            {/* Tab 4: Bibliothèque Numérique */}
            {tab === 'library' && <DigitalLibrary isAdmin={false} />}

            {/* Tab 5: WhatsApp Cellule Com */}
            {tab === 'whatsapp' && <WhatsAppBroadcastCenter />}
          </>
        )}
      </main>

      {/* Modal Déclaration de Paiement */}
      {payModalCourse && (
        <PaymentDeclarationModal
          course={payModalCourse}
          studentName={currentStudentName}
          studentEmail={currentStudentEmail}
          onClose={() => setPayModalCourse(null)}
          onSubmitted={() => {
            setPayModalCourse(null);
            loadData();
          }}
        />
      )}

      {/* Modal Visualisation du Diplôme */}
      {activeCert && (
        <CertificateGeneratorModal
          certificate={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}

      {/* Modal Lecteur de Cours HD & Quiz */}
      {activePlayerCourse && (
        <CoursePlayerModal
          course={activePlayerCourse}
          studentName={currentStudentName}
          onClose={() => setActivePlayerCourse(null)}
        />
      )}
    </div>
  );
}
