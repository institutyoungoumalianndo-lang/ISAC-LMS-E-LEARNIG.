import { useState, useEffect, useCallback } from 'react';
import { Users, BookOpen, Video, FileText, Plus, LogOut, Trash2, Calendar, Film, Image as ImageIcon, File, ShieldCheck, CheckCircle2, MessageSquare, Send, Phone, Download, Eye, Sparkles, UploadCloud, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase, type Course, type CourseResource, type PaymentDeclaration } from '@/lib/supabase';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';
import { VirtualClassroom } from '../classroom/VirtualClassroom';
import { AIAssistantWidget } from '../ai/AIAssistantWidget';
import { DigitalLibrary } from '../library/DigitalLibrary';
import { ExamCorrectionModule } from '../exam/ExamCorrectionModule';

type InstructorDashboardProps = {
  onExit: () => void;
};

type InstructorTab = 'students' | 'resources' | 'library' | 'exams' | 'meetings' | 'discussions';

export function InstructorDashboard({ onExit }: InstructorDashboardProps) {
  const { t, lang } = useLanguage();
  const { session, signOut } = useAuth();

  const [tab, setTab] = useState<InstructorTab>('students');
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [declarations, setDeclarations] = useState<PaymentDeclaration[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New resource form state
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resCourseId, setResCourseId] = useState('');
  const [resTranche, setResTranche] = useState<1 | 2 | 3>(1);
  const [resType, setResType] = useState<'video' | 'photo' | 'document' | 'exam'>('document');
  const [resFileResult, setResFileResult] = useState<FileUploadResult | null>(null);

  // Discussion state
  const [messages, setMessages] = useState<{ id: string; sender: string; role: string; text: string; time: string }[]>([
    { id: 'm-1', sender: 'Mamadou Bah', role: 'Étudiant (Génie Informatique)', text: 'Bonjour Professeur, concernant le TP React, doit-on soumettre le fichier ZIP ici ?', time: '10:15' },
    { id: 'm-2', sender: 'Dr. Barry Kante', role: 'Formateur Référent', text: 'Bonjour Mamadou, oui déposez l\'archive ZIP dans l\'espace supports. Je vais valider la correction.', time: '10:20' },
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  const loadInstructorData = useCallback(async () => {
    let loadedCourses: Course[] = [];
    const savedCoursesStr = localStorage.getItem('isac_lms_courses');
    if (savedCoursesStr) {
      try { loadedCourses = JSON.parse(savedCoursesStr); } catch (e) {}
    }

    const { data: coursesData } = await supabase
      .from('courses')
      .select('*, category:course_categories(*), instructor:profiles(*)')
      .order('created_at', { ascending: false });

    if (coursesData && coursesData.length > 0) {
      loadedCourses = coursesData;
    }

    setCourses(loadedCourses);
    if (loadedCourses.length > 0 && !resCourseId) {
      setResCourseId(loadedCourses[0].id);
    }

    // Load resources from localStorage
    const savedResStr = localStorage.getItem('isac_lms_resources');
    if (savedResStr) {
      try {
        setResources(JSON.parse(savedResStr));
      } catch (e) {}
    }

    // Load declarations (students)
    const decsStr = localStorage.getItem('isac_lms_payment_declarations');
    if (decsStr) {
      try {
        setDeclarations(JSON.parse(decsStr));
      } catch (e) {}
    }
  }, [resCourseId]);

  useEffect(() => {
    loadInstructorData();
  }, [loadInstructorData]);

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resFileResult?.url && !resTitle) return;

    const newRes: CourseResource = {
      id: 'res-' + Date.now(),
      course_id: resCourseId || courses[0]?.id || '1',
      title: resTitle.trim(),
      description: resDesc.trim(),
      type: resType,
      file_url: resFileResult?.url || '#',
      file_name: resFileResult?.name,
      file_size: resFileResult?.size,
      unlocked_at_tranche: resTranche,
      created_at: new Date().toISOString(),
    };

    const updated = [newRes, ...resources];
    setResources(updated);
    localStorage.setItem('isac_lms_resources', JSON.stringify(updated));

    // Save to Supabase database
    supabase.from('course_resources').insert(newRes).then(() => {});

    // Dispatch global real-time event so student space updates instantly
    window.dispatchEvent(new Event('isac_resources_updated'));

    setShowAddModal(false);
    setResTitle('');
    setResDesc('');
    setResFileResult(null);
  };

  const handleDeleteResource = (id: string) => {
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    localStorage.setItem('isac_lms_resources', JSON.stringify(updated));
    window.dispatchEvent(new Event('isac_resources_updated'));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    const msg = {
      id: 'm-' + Date.now(),
      sender: session?.user?.user_metadata?.full_name || session?.user?.email || 'Formateur Référent',
      role: 'Formateur Référent (ISAC MLS)',
      text: newMsgText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, msg]);
    setNewMsgText('');
  };

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  const currentInstructorName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Professeur Référent ISAC';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Floating AI Tutor Assistant */}
      <AIAssistantWidget />

      {/* Top Header Navigation Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Espace Pédagogique Formateur</h1>
              <p className="text-xs text-teal-300">Bienvenue, {currentInstructorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setResType('document');
                setShowAddModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Publier un Fichier / Support (Tout Format)
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

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2">
          {[
            { id: 'students', label: `Mes Étudiants Inscrit (${declarations.length})`, icon: Users },
            { id: 'resources', label: `Fichiers & Supports Publiés (${resources.length})`, icon: BookOpen },
            { id: 'discussions', label: 'Espace Échanges & Forum Étudiants', icon: MessageSquare },
            { id: 'meetings', label: 'Classes Virtuelles en Direct', icon: Video },
            { id: 'exams', label: 'Procédures & Sujets d\'Examen', icon: FileText },
            { id: 'library', label: 'Bibliothèque Numérique', icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  active ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tab 1: Mes Étudiants */}
        {tab === 'students' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono tracking-wider font-bold text-amber-400">Accréditation Pédagogique ISAC MLS</span>
                <h2 className="text-xl font-extrabold font-serif">Gestion Pédagogique de vos Étudiants d'Affectation</h2>
                <p className="text-xs text-gray-300">
                  Consultez la liste des apprenants inscrits dans vos filières, vérifiez leur statut de paiement et transmettez-leur des cours ou messages.
                </p>
              </div>

              <button
                onClick={() => {
                  setResType('document');
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all whitespace-nowrap"
              >
                + Transmettre un Support de Cours (Tous Formats)
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Nom de l'Étudiant</th>
                      <th className="px-6 py-4">Email & Téléphone</th>
                      <th className="px-6 py-4">Filière / Cours</th>
                      <th className="px-6 py-4">Tranche & Paiement</th>
                      <th className="px-6 py-4 text-right">Statut d'Accès</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {declarations.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-900">{d.student_name}</td>
                        <td className="px-6 py-4 text-xs font-mono">
                          <div className="font-semibold text-gray-800">{d.student_email}</div>
                          {d.student_phone && <div className="text-teal-700 font-bold">{d.student_phone}</div>}
                        </td>
                        <td className="px-6 py-4 font-semibold text-teal-700">
                          {courses.find((c) => c.id === d.course_id)?.title_fr || 'Filière ISAC'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              d.status === 'validated'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            Tranche {d.tranche} - {d.status === 'validated' ? 'Validé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-xs font-bold ${d.status === 'validated' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {d.status === 'validated' ? `Accès Tranche ${d.tranche} Débloqué` : 'Accès Restreint'}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {declarations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          Aucun étudiant inscrit dans vos filières pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fichiers & Supports de Cours (Tous Formats) */}
        {tab === 'resources' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bibliothèque des Supports de Cours & Fichiers</h2>
                <p className="text-xs text-gray-500">
                  Déposez des fichiers PDF, Word (.docx), Excel, PowerPoint, Vidéos MP4, Audios MP3 ou Zip pour vos étudiants.
                </p>
              </div>
              <button
                onClick={() => {
                  setResType('document');
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Publier un Fichier / Support
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources
                .filter((r) => r.type !== 'exam')
                .map((r) => (
                  <div key={r.id} className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                          {r.type === 'video' ? <Film className="w-5 h-5" /> : r.type === 'photo' ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-100 text-teal-800">
                          Débloqué Tranche {r.unlocked_at_tranche}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base leading-snug">{r.title}</h3>
                      {r.description && <p className="text-xs text-gray-500 line-clamp-2">{r.description}</p>}
                      <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] font-mono text-gray-600 flex items-center justify-between">
                        <span>Format : {r.file_name?.split('.').pop()?.toUpperCase() || 'DOCUMENT'}</span>
                        {r.file_size && <span className="font-bold text-teal-800">{r.file_size}</span>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-700 hover:text-teal-800"
                      >
                        <Download className="w-4 h-4" /> Télécharger / Aperçu
                      </a>
                      <button
                        onClick={() => handleDeleteResource(r.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 3: Espace Échanges & Forum Étudiants */}
        {tab === 'discussions' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Espace Échanges & Forum Pédagogique</h2>
              <p className="text-xs text-gray-500">Posez des consignes, répondez aux questions des étudiants et animez la discussion de vos filières.</p>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {messages.map((m) => (
                <div key={m.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-900">{m.sender} <span className="text-[10px] font-normal text-gray-500">({m.role})</span></span>
                    <span className="text-[10px] text-gray-400 font-mono">{m.time}</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                placeholder="Rédigez votre réponse ou consigne pour les étudiants..."
                className="flex-1 px-4 py-3 text-sm rounded-2xl border border-gray-200 focus:border-teal-500 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Envoyer
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Classes Virtuelles */}
        {tab === 'meetings' && <VirtualClassroom courses={courses} userRole="formateur" />}

        {/* Tab 5: Procédures d'Examen */}
        {tab === 'exams' && <ExamCorrectionModule courses={courses} userRole="formateur" />}

        {/* Tab 6: Bibliothèque Numérique */}
        {tab === 'library' && <DigitalLibrary isAdmin={false} />}
      </main>

      {/* Modal Ajout Support / Procédure (Tout Format de Fichier) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 my-8 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">
              Publier un Fichier / Support de Cours pour ma Filière
            </h3>

            <form onSubmit={handleCreateResource} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Filière d'Affectation</label>
                <select
                  value={resCourseId}
                  onChange={(e) => setResCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none font-bold text-teal-900 bg-teal-50/30"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title_fr} ({c.diploma_type || 'CQP'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titre du Support</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chapitre 1 - Guide Pratique & Fichier d'Exercices"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Niveau d'accès (Tranche requise)</label>
                <select
                  value={resTranche}
                  onChange={(e) => setResTranche(Number(e.target.value) as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                >
                  <option value={1}>Accessible dès la Tranche 1 (Premier versement)</option>
                  <option value={2}>Accessible après la Tranche 2 (Deuxième versement)</option>
                  <option value={3}>Accessible après la Tranche 3 (Examen & Certification)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Type de Contenu</label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                >
                  <option value="document">Document PDF, Word (.docx), Excel, Zip</option>
                  <option value="video">Vidéo HD (MP4 ou YouTube/Drive)</option>
                  <option value="photo">Photo / Schéma explicatif</option>
                  <option value="exam">Procédure & Sujet d'Examen</option>
                </select>
              </div>

              <FileUploadZone
                label="Glissez-déposez TOUT FORMAT de Fichier (PDF, Word, Zip, MP4, MP3...)"
                acceptType="all"
                onFileSelected={(res: FileUploadResult) => setResFileResult(res)}
              />

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Consignes pour les étudiants</label>
                <textarea
                  rows={2}
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  placeholder="Lisez ce support avant la prochaine classe virtuelle..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 text-white font-extrabold hover:bg-teal-700 shadow-md text-xs"
                >
                  Publier pour mes Étudiants
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
