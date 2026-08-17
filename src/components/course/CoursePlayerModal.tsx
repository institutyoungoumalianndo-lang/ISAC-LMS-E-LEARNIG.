import { useState, useEffect } from 'react';
import { Play, CheckCircle2, Circle, FileText, HelpCircle, MessageSquare, Award, ArrowLeft, ArrowRight, Download, Check, Volume2, ChevronRight, X, Film, File } from 'lucide-react';
import type { Course } from '@/lib/supabase';

type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'quiz';
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  content?: string;
  completed: boolean;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Props = {
  course: Course;
  studentName: string;
  onClose: () => void;
  onCompleteCourse?: () => void;
};

export function CoursePlayerModal({ course, studentName, onClose, onCompleteCourse }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'forum'>('content');

  // Quiz State
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Q&A Forum State
  const [questions, setQuestions] = useState<Array<{ id: string; author: string; text: string; date: string; reply?: string }>>([
    {
      id: 'q-1',
      author: studentName || 'Étudiant ISAC',
      text: `Bonjour Formateur Référent, quelles sont les étapes clés pour valider la certification ${course.diploma_type || 'CQP'} de cette filière ?`,
      date: 'Récemment',
      reply: `Bonjour ! Il vous suffit de compléter tous les modules vidéo, télécharger les supports PDF/Word et réussir le quiz final avec une note supérieure à 70%.`,
    },
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    // 1. Load custom resources uploaded by Formateur for this course
    const savedResStr = localStorage.getItem('isac_lms_resources');
    let customLessons: Lesson[] = [];
    if (savedResStr) {
      try {
        const allRes = JSON.parse(savedResStr);
        const courseRes = allRes.filter((r: any) => r.course_id === course.id || !r.course_id);
        customLessons = courseRes.map((r: any, idx: number) => ({
          id: `custom-res-${r.id || idx}`,
          title: r.title || `Fichier ${idx + 1}`,
          duration: r.file_size || 'Disponible',
          type: r.type === 'video' ? 'video' : 'pdf',
          videoUrl: r.type === 'video' ? r.file_url : undefined,
          fileUrl: r.file_url || '#',
          fileName: r.file_name || r.title,
          content: `${r.description || 'Support de cours et fichier de formation transmis par votre Formateur Référent.'}\n\nFichier : ${r.file_name || r.title}\nTéléchargement immédiat disponible ci-dessous.`,
          completed: false,
        }));
      } catch (e) {}
    }

    // 2. Default curriculum
    const baseCurriculum: Module[] = [
      {
        id: 'm-1',
        title: 'Module 1 : Fondamentaux & Présentation Certifiante',
        lessons: [
          {
            id: 'l-1',
            title: `1.1 Vue d'ensemble de la Filière « ${course.title_fr} »`,
            duration: '15 min',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: `Bienvenue dans le programme certifiant « ${course.title_fr} » (${course.diploma_type || 'CQP'}).\n\nCe module vous donne les clés théoriques et pratiques nécessaires pour maîtriser le programme et obtenir votre diplôme officiel de fin d'études.`,
            completed: true,
          },
          {
            id: 'l-2',
            title: '1.2 Cadre Général & Standards Professionnels',
            duration: '20 min',
            type: 'pdf',
            content: `Document de Synthèse Pédagogique :\n\n- Principes directeurs de la spécialité.\n- Normes et réglementation applicables en République de Guinée.\n- Exercices guidés et cas pratiques d'entreprise.`,
            completed: false,
          },
        ],
      },
      {
        id: 'm-2',
        title: 'Module 2 : Déploiement Pratique & Évaluation',
        lessons: [
          {
            id: 'l-3',
            title: '2.1 Démonstration Pas à Pas par le Formateur Référent',
            duration: '30 min',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: `Dans cette leçon vidéo pratique, le Formateur Référent réalise une étude de cas concrète d'entreprise.`,
            completed: false,
          },
          {
            id: 'l-4',
            title: '2.2 Évaluation de Fin de Module (Quiz QCM)',
            duration: '10 min',
            type: 'quiz',
            completed: false,
          },
        ],
      },
    ];

    if (customLessons.length > 0) {
      baseCurriculum.push({
        id: 'm-custom',
        title: 'Module 3 : Fichiers, Supports & Transmissions du Formateur',
        lessons: customLessons,
      });
    }

    setModules(baseCurriculum);
    if (baseCurriculum[0]?.lessons[0]) {
      setActiveLessonId(baseCurriculum[0].lessons[0].id);
    }
  }, [course]);

  // Find active lesson
  const allLessons = modules.flatMap((m) => m.lessons);
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  // Progress %
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const toggleLessonComplete = (lessonId: string) => {
    const updated = modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l)),
    }));
    setModules(updated);
  };

  // Sample Quiz Questions
  const sampleQuiz = [
    {
      question: `1. Quel est l'objectif certifiant de la filière ${course.title_fr} ?`,
      options: [
        'Acquérir les compétences professionnelles et valider le diplôme ' + (course.diploma_type || 'CQP'),
        'Suivre des leçons sans appliquer les connaissances',
        'Consulter uniquement le calendrier',
      ],
      correct: 0,
    },
    {
      question: '2. Comment valider le déblocage des tranches suivantes de formation ?',
      options: [
        'Par la déclaration de paiement validée par l\'Administration et le suivi des modules',
        'En sautant la première tranche',
        'Uniquement après 2 ans sans évaluation',
      ],
      correct: 0,
    },
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    sampleQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 50;
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70 && onCompleteCourse) {
      onCompleteCourse();
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const q = {
      id: 'q-' + Date.now(),
      author: studentName || 'Étudiant ISAC',
      text: newQuestion.trim(),
      date: 'À l\'instant',
    };
    setQuestions([q, ...questions]);
    setNewQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header Bar */}
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                {course.diploma_type || 'CQP'} — {course.duration_fr || 'Formation Certifiante'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">{course.title_fr}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-xs text-gray-400 font-medium">Progression :</span>
              <span className="text-xs font-bold text-teal-400">{progressPercent}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Left / Top: Main Player Stage */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto min-h-0">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeLesson?.type === 'video' ? (
                activeLesson.videoUrl && activeLesson.videoUrl.includes('mp4') ? (
                  <video controls className="w-full h-full object-contain" src={activeLesson.videoUrl} autoPlay />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={activeLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    title={activeLesson?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
                    {activeLesson?.type === 'quiz' ? <HelpCircle className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                  </div>
                  <h3 className="text-lg font-bold text-white">{activeLesson?.title}</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    {activeLesson?.type === 'quiz' ? 'Évaluation interactive QCM en ligne' : 'Document de formation & Support transmis par le formateur'}
                  </p>
                </div>
              )}
            </div>

            {/* Stage Footer & Tabs */}
            <div className="p-6 space-y-6 bg-white text-gray-900 flex-1">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{activeLesson?.title}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Formateur Référent : Dr. Barry / M. Camara</p>
                </div>

                <button
                  onClick={() => activeLesson && toggleLessonComplete(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
                    activeLesson?.completed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {activeLesson?.completed ? 'Leçon Terminée' : 'Marquer comme Términée'}
                </button>
              </div>

              {/* Tabs for Lesson Info */}
              <div className="flex border-b border-gray-200 gap-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`pb-3 border-b-2 transition-all ${activeTab === 'content' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                >
                  Supports & Description
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-3 border-b-2 transition-all ${activeTab === 'quiz' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                >
                  Quiz & Évaluation ({sampleQuiz.length} Questions)
                </button>
                <button
                  onClick={() => setActiveTab('forum')}
                  className={`pb-3 border-b-2 transition-all ${activeTab === 'forum' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                >
                  Questions au Formateur ({questions.length})
                </button>
              </div>

              {/* Tab 1: Content */}
              {activeTab === 'content' && (
                <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                  <div className="whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100 font-sans text-xs">
                    {activeLesson?.content || 'Contenu et directives transmis par votre formateur.'}
                  </div>

                  {activeLesson?.fileUrl && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-gray-900">{activeLesson.fileName || 'Fichier de cours'}</p>
                          <p className="text-[10px] text-gray-500 font-mono">Transmis par le Formateur Référent</p>
                        </div>
                      </div>
                      <a
                        href={activeLesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md"
                      >
                        Télécharger
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Quiz */}
              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  {quizSubmitted ? (
                    <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-3">
                      <Award className="w-12 h-12 text-teal-600 mx-auto" />
                      <h4 className="font-bold text-lg text-gray-900">Résultat de l'Évaluation QCM</h4>
                      <p className="text-2xl font-black text-teal-700">{quizScore} / 100</p>
                      <p className="text-xs text-gray-600">
                        {quizScore && quizScore >= 70
                          ? 'Félicitations ! Vous avez validé le contrôle de connaissances avec succès.'
                          : 'Révisez le support du formateur et réessayez pour atteindre 70%.'}
                      </p>
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizScore(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                      >
                        Repasser le Quiz
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleQuizSubmit} className="space-y-6">
                      {sampleQuiz.map((q, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                          <p className="font-bold text-xs text-gray-900">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 cursor-pointer text-xs">
                                <input
                                  type="radio"
                                  name={`q-${idx}`}
                                  checked={selectedAnswers[idx] === optIdx}
                                  onChange={() => setSelectedAnswers({ ...selectedAnswers, [idx]: optIdx })}
                                  className="text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-gray-800 font-medium">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md"
                      >
                        Soumettre les Réponses au Formateur
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 3: Q&A Forum */}
              {activeTab === 'forum' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddQuestion} className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Posez votre question à votre formateur référent..."
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                    />
                    <button type="submit" className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-extrabold text-xs">
                      Envoyer
                    </button>
                  </form>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {questions.map((q) => (
                      <div key={q.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{q.author}</span>
                          <span className="text-[10px] text-gray-400">{q.date}</span>
                        </div>
                        <p className="text-gray-700">{q.text}</p>
                        {q.reply && (
                          <div className="mt-2 p-2 bg-teal-50 border border-teal-100 rounded-lg text-teal-900 font-medium">
                            <span className="font-bold text-teal-700">Formateur Référent :</span> {q.reply}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right / Sidebar: Curriculum List */}
          <div className="w-full md:w-80 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Programme de la Filière</h3>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{allLessons.length} leçons au total</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {modules.map((m) => (
                <div key={m.id} className="space-y-2">
                  <h4 className="font-extrabold text-xs text-gray-900 px-1">{m.title}</h4>
                  <div className="space-y-1">
                    {m.lessons.map((l) => {
                      const isActive = l.id === activeLessonId;
                      return (
                        <button
                          key={l.id}
                          onClick={() => setActiveLessonId(l.id)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-teal-600 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {l.completed ? (
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                            ) : (
                              <Circle className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            )}
                            <span className="truncate">{l.title}</span>
                          </div>
                          <span className={`text-[10px] font-mono ml-2 flex-shrink-0 ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                            {l.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
