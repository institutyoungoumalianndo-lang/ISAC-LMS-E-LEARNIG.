import { useState, useEffect } from 'react';
import { CheckCircle2, FileCheck, Search, Award, MessageSquare, ExternalLink, Filter, Plus, FileText, HelpCircle, X, Clock } from 'lucide-react';
import type { ExamSubmission, Course } from '@/lib/supabase';

type ExamCorrectionModuleProps = {
  courses: Course[];
  userRole: 'admin' | 'formateur';
};

type ExamQuestion = {
  question: string;
  options: string[];
  correct: number;
};

type ExamProcedure = {
  id: string;
  title: string;
  course_id: string;
  time_limit_min: number;
  total_points: number;
  instructions: string;
  questions: ExamQuestion[];
  created_at: string;
};

export function ExamCorrectionModule({ courses, userRole }: ExamCorrectionModuleProps) {
  const [activeTab, setActiveTab] = useState<'submissions' | 'creator'>('submissions');
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [exams, setExams] = useState<ExamProcedure[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState<ExamSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(15);
  const [feedbackInput, setFeedbackInput] = useState('');

  // Exam Creator Form State
  const [showExamModal, setShowExamModal] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examCourseId, setExamCourseId] = useState(courses[0]?.id || '');
  const [examTimeLimit, setExamTimeLimit] = useState(60);
  const [examInstructions, setExamInstructions] = useState('');
  const [qQuestions, setQQuestions] = useState<ExamQuestion[]>([
    { question: '1. Quel est l\'objectif principal du projet certifiant ?', options: ['Valider les compétences pratiques', 'Remplacer le cours', 'Aucune idée'], correct: 0 },
  ]);

  const loadSubmissionsAndExams = () => {
    const savedSubStr = localStorage.getItem('isac_lms_exam_submissions');
    if (savedSubStr) {
      try {
        setSubmissions(JSON.parse(savedSubStr));
      } catch (e) {}
    } else {
      const sample: ExamSubmission[] = [
        {
          id: 'sub-1',
          student_name: 'Alsény Tawel CAMARA',
          student_email: 'alseny.camara@isac-mls.com',
          course_id: courses[0]?.id || '1',
          exam_title: 'Examen Certifiant de Fin de Filière - Étude de Cas & Projet Pratique',
          submission_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        },
      ];
      setSubmissions(sample);
      localStorage.setItem('isac_lms_exam_submissions', JSON.stringify(sample));
    }

    const savedExamsStr = localStorage.getItem('isac_lms_exams');
    if (savedExamsStr) {
      try {
        setExams(JSON.parse(savedExamsStr));
      } catch (e) {}
    } else {
      const sampleExams: ExamProcedure[] = [
        {
          id: 'ex-1',
          title: 'Examen Certifiant National - Synthèse de Fin de Module',
          course_id: courses[0]?.id || '1',
          time_limit_min: 90,
          total_points: 20,
          instructions: 'Répondez à toutes les questions et téléchargez votre projet de synthèse au format PDF.',
          questions: [
            { question: 'Quel outil permet de suivre le budget et le BFR ?', options: ['La comptabilité analytique', 'Un simple bloc-note', 'Aucun'], correct: 0 },
          ],
          created_at: new Date().toISOString(),
        },
      ];
      setExams(sampleExams);
      localStorage.setItem('isac_lms_exams', JSON.stringify(sampleExams));
    }
  };

  useEffect(() => {
    loadSubmissionsAndExams();
  }, [courses]);

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const updated = submissions.map((s) => {
      if (s.id === selectedSub.id) {
        return {
          ...s,
          status: 'graded' as const,
          grade: Number(gradeInput),
          feedback: feedbackInput.trim(),
          graded_at: new Date().toISOString(),
        };
      }
      return s;
    });

    setSubmissions(updated);
    localStorage.setItem('isac_lms_exam_submissions', JSON.stringify(updated));

    // Auto-generate Certificate if grade >= 10
    if (gradeInput >= 10) {
      const existingCertStr = localStorage.getItem('isac_lms_certificates');
      const existingCerts = existingCertStr ? JSON.parse(existingCertStr) : [];
      const certId = 'ISAC-CERT-2026-' + Math.floor(1000 + Math.random() * 9000);

      let mention = 'Passable';
      if (gradeInput >= 16) mention = 'Très Bien';
      else if (gradeInput >= 14) mention = 'Bien';
      else if (gradeInput >= 12) mention = 'Assez Bien';

      existingCerts.push({
        id: certId,
        serial_number: certId,
        student_name: selectedSub.student_name,
        student_email: selectedSub.student_email,
        course_title: courses.find((c) => c.id === selectedSub.course_id)?.title_fr || 'Filière ISAC MLS',
        issue_date: new Date().toISOString(),
        grade_mention: mention,
        qr_code_data: `VERIFIED-ISAC-MLS-${certId}`,
      });
      localStorage.setItem('isac_lms_certificates', JSON.stringify(existingCerts));
    }

    setSelectedSub(null);
    setFeedbackInput('');
  };

  const handleSaveExamProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    const newExam: ExamProcedure = {
      id: 'exam-' + Date.now(),
      title: examTitle.trim(),
      course_id: examCourseId,
      time_limit_min: Number(examTimeLimit),
      total_points: 20,
      instructions: examInstructions.trim(),
      questions: qQuestions,
      created_at: new Date().toISOString(),
    };

    const updatedExams = [newExam, ...exams];
    setExams(updatedExams);
    localStorage.setItem('isac_lms_exams', JSON.stringify(updatedExams));

    setShowExamModal(false);
    setExamTitle('');
    setExamInstructions('');
  };

  const addQuestionField = () => {
    setQQuestions([
      ...qQuestions,
      { question: `${qQuestions.length + 1}. Nouvelle question d'examen...`, options: ['Option A', 'Option B', 'Option C'], correct: 0 },
    ]);
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.student_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_email.toLowerCase().includes(search.toLowerCase()) ||
      s.exam_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Procédure de Suivi, Examens & Quiz Certifiants</h2>
          <p className="text-xs text-gray-500">
            Créez les épreuves d'examen, gérez les quiz et évaluez les copies des apprenants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExamModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Créer un Sujet d'Examen / Quiz
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-200/60 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'submissions' ? 'bg-white text-teal-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Copies Rendues & Notation ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'creator' ? 'bg-white text-teal-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Épreuves & Quiz Créés ({exams.length})
        </button>
      </div>

      {/* Tab 1: Copies Rendues & Notation */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Travaux Rendus par les Étudiants</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Étudiant</th>
                  <th className="px-6 py-4">Sujet d'Examen</th>
                  <th className="px-6 py-4">Travail Rendus</th>
                  <th className="px-6 py-4">Note / 20</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div>{item.student_name}</div>
                      <div className="text-xs text-gray-400">{item.student_email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-teal-700">{item.exam_title}</td>
                    <td className="px-6 py-4">
                      <a
                        href={item.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Voir la copie
                      </a>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900">
                      {item.grade != null ? `${item.grade} / 20` : 'Non noté'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.status === 'graded' ? 'Corrigé & Validé' : 'À Corriger'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSub(item);
                          setGradeInput(item.grade || 15);
                          setFeedbackInput(item.feedback || '');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all"
                      >
                        {item.status === 'graded' ? 'Modifier la Note' : 'Corriger & Noter'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Épreuves & Quiz Créés */}
      {activeTab === 'creator' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {exams.map((ex) => (
            <div key={ex.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                    {courses.find((c) => c.id === ex.course_id)?.title_fr || 'Filière ISAC'}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {ex.time_limit_min} min
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base">{ex.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{ex.instructions}</p>
                <div className="text-xs font-semibold text-teal-800 bg-teal-50/50 p-3 rounded-2xl">
                  {ex.questions.length} Question(s) QCM intégrées sur {ex.total_points} Points
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">Créé le {new Date(ex.created_at).toLocaleDateString('fr-FR')}</span>
                <span className="font-bold text-emerald-700">Épreuve Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Création Épreuve / Quiz */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-xl w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Créer une Épreuve d'Examen / Quiz Certifiant</h3>
              <button onClick={() => setShowExamModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExamProcedure} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titre de l'Épreuve / Sujet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Examen Synthèse de Fin de Filière..."
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Filière / Cours Associé</label>
                  <select
                    value={examCourseId}
                    onChange={(e) => setExamCourseId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title_fr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Durée Limite (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={examTimeLimit}
                    onChange={(e) => setExamTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Consignes & Instructions Pédagogiques</label>
                <textarea
                  rows={2}
                  value={examInstructions}
                  onChange={(e) => setExamInstructions(e.target.value)}
                  placeholder="Directives et modalités d'évaluation..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              {/* Questions QCM Section */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-xs uppercase">Questions QCM d'Évaluation ({qQuestions.length})</h4>
                  <button
                    type="button"
                    onClick={addQuestionField}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    + Ajouter une Question
                  </button>
                </div>

                {qQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const copy = [...qQuestions];
                        copy[idx].question = e.target.value;
                        setQQuestions(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-bold outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <input
                          key={oIdx}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...qQuestions];
                            copy[idx].options[oIdx] = e.target.value;
                            setQQuestions(copy);
                          }}
                          className="px-2 py-1 rounded border border-gray-200 bg-white"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Enregistrer & Publier l'Épreuve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Notation */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Correction & Notation d'Examen</h3>
            <p className="text-xs text-gray-500">Étudiant : {selectedSub.student_name}</p>

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Note sur 20</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-4 py-3 text-lg font-bold rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Commentaires & Remarques Pédagogiques</label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Appréciation globale, points forts et axes d'amélioration..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Valider la Note & Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
