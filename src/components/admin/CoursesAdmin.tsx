import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Award, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { supabase, type Course, type Category } from '@/lib/supabase';
import { FileUploadZone } from '../common/FileUploadZone';

type CoursesAdminProps = {
  courses?: Course[];
  categories?: Category[];
  instructors?: any[];
  onChanged?: () => void;
};

export function CoursesAdmin({ onChanged }: CoursesAdminProps = {}) {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<{ id: string; name: string }[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [form, setForm] = useState<Partial<Course>>({
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    diploma_type: 'CQP',
    price_gnf: 1500000,
    duration_fr: '6 Mois',
    duration_en: '6 Months',
    duration_hours: 6,
    level: 'beginner',
    is_featured: false,
    is_published: true,
  });

  const load = async () => {
    let savedCoursesStr = localStorage.getItem('isac_lms_courses');
    if (savedCoursesStr) {
      try {
        setCourses(JSON.parse(savedCoursesStr));
      } catch (e) {}
    }

    const { data: cData } = await supabase.from('courses').select('*, category:course_categories(*)');
    if (cData && cData.length > 0) {
      setCourses(cData);
      localStorage.setItem('isac_lms_courses', JSON.stringify(cData));
    }
    const { data: catData } = await supabase.from('course_categories').select('*');
    if (catData) setCategories(catData);
    const { data: iData } = await supabase.from('profiles').select('id, full_name').eq('role', 'formateur');
    if (iData) setInstructors(iData.map((i) => ({ id: i.id, name: i.full_name || 'Formateur' })));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title_fr: '',
      title_en: '',
      description_fr: '',
      description_en: '',
      diploma_type: 'CQP',
      price_gnf: 1500000,
      duration_fr: '6 Mois',
      duration_en: '6 Months',
      duration_hours: 6,
      level: 'beginner',
      is_featured: false,
      is_published: true,
    });
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      ...c,
      diploma_type: c.diploma_type || 'CQP',
      price_gnf: c.price_gnf || (c.price ? c.price * 10000 : 1500000),
      duration_fr: c.duration_fr || '6 Mois',
      duration_en: c.duration_en || '6 Months',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title_fr) return;
    const payload = {
      ...form,
      price_gnf: form.price_gnf || 1500000,
      duration_fr: form.duration_fr || '6 Mois',
      duration_en: form.duration_fr || '6 Months',
      price: Math.round((form.price_gnf || 1500000) / 10000),
      updated_at: new Date().toISOString(),
    };

    let updatedList = [...courses];

    if (editing) {
      updatedList = updatedList.map((item) => (item.id === editing.id ? { ...item, ...payload } : item));
      await supabase.from('courses').update(payload).eq('id', editing.id);
    } else {
      const newCourseObj = { id: `course_${Date.now()}`, ...payload } as Course;
      updatedList.unshift(newCourseObj);
      await supabase.from('courses').insert(payload);
    }

    setCourses(updatedList);
    localStorage.setItem('isac_lms_courses', JSON.stringify(updatedList));

    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette filière ?')) return;
    const updatedList = courses.filter((c) => c.id !== id);
    setCourses(updatedList);
    localStorage.setItem('isac_lms_courses', JSON.stringify(updatedList));
    await supabase.from('courses').delete().eq('id', id);
  };

  const formatGnf = (val: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(val) + ' GNF';
  };

  const filtered = filterCategory === 'all' ? courses : courses.filter((c) => c.category_id === filterCategory);
  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Filières de Formation & Diplômes Certifiants</h2>
          <p className="text-xs text-gray-500">
            Définissez les niveaux de qualification (ATTESTATION, CQP, DQP, CAP), la durée en mois/années et les tarifs en GNF.
          </p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5" />
          Ajouter une Filière
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Filière / Formation</th>
                <th className="px-4 py-3">Diplôme / Qualification</th>
                <th className="px-4 py-3">Durée</th>
                <th className="px-4 py-3 hidden lg:table-cell">Tarif (GNF)</th>
                <th className="px-4 py-3">Statut</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900">{c.title_fr}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                      {c.diploma_type || 'CQP'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-teal-800">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {c.duration_fr || '6 Mois'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-teal-800 hidden lg:table-cell">
                    {formatGnf(c.price_gnf || (c.price ? c.price * 10000 : 1500000))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.is_published && <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-bold">Publié</span>}
                      {c.is_featured && <span className="px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-700 font-bold">Vedette</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">Aucune filière trouvée</div>}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 my-8 shadow-2xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Modifier la Filière" : "Ajouter une Filière de Formation"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm max-h-[75vh] overflow-y-auto pr-1">
              <Field label="Intitulé de la Filière / Formation (Français)">
                <input type="text" required value={form.title_fr || ''} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} className={inputCls} placeholder="Ex: Spécialisation en Gestion de Projet..." />
              </Field>

              <Field label="Intitulé de la Formation (Anglais)">
                <input type="text" required value={form.title_en || ''} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={inputCls} placeholder="Ex: Professional Project Management..." />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Type de Diplôme Certifiant Délivré">
                  <select value={form.diploma_type || 'CQP'} onChange={(e) => setForm({ ...form, diploma_type: e.target.value })} className={`${inputCls} font-bold text-amber-900 bg-amber-50/50`}>
                    <option value="ATTESTATION">ATTESTATION — Attestation de Formation Professionnelle</option>
                    <option value="CQP">CQP — Certificat de Qualification Professionnelle</option>
                    <option value="DQP">DQP — Diplôme de Qualification Professionnelle</option>
                    <option value="CAP">CAP — Certificat d'Aptitude Professionnelle</option>
                  </select>
                </Field>

                <Field label="Tarif Global de la Formation en Francs Guinéens (GNF)">
                  <input
                    type="number"
                    step="50000"
                    required
                    value={form.price_gnf || 1500000}
                    onChange={(e) => setForm({ ...form, price_gnf: Number(e.target.value) })}
                    className={`${inputCls} font-bold text-teal-900 text-base`}
                    placeholder="1500000"
                  />
                </Field>
              </div>

              {/* Durée de formation exprimée en Mois et Années */}
              <Field label="Durée de la Formation (Exprimée en Mois & Années)">
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={form.duration_fr || '6 Mois'}
                    onChange={(e) => setForm({ ...form, duration_fr: e.target.value, duration_en: e.target.value })}
                    className={`${inputCls} font-bold text-teal-900 bg-teal-50/40`}
                  >
                    <option value="3 Mois">3 Mois (Trimestriel)</option>
                    <option value="6 Mois">6 Mois (Semestriel)</option>
                    <option value="9 Mois">9 Mois (Session Complète)</option>
                    <option value="1 An">1 An (12 Mois)</option>
                    <option value="18 Mois">18 Mois (1 An & Demi)</option>
                    <option value="2 Ans">2 Ans (24 Mois)</option>
                    <option value="3 Ans">3 Ans (36 Mois)</option>
                    <option value="Sur Mesure">Sur Mesure (Personnalisé)</option>
                  </select>

                  <input
                    type="text"
                    value={form.duration_fr || '6 Mois'}
                    onChange={(e) => setForm({ ...form, duration_fr: e.target.value, duration_en: e.target.value })}
                    placeholder="Saisie libre (Ex: 6 Mois)"
                    className={inputCls}
                  />
                </div>
              </Field>

              <Field label="Description & Programme (Français)">
                <textarea rows={2} value={form.description_fr || ''} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} className={inputCls} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Catégorie de Spécialité">
                  <select value={form.category_id || ''} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
                    <option value="">— Sélectionner —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
                  </select>
                </Field>

                <Field label="Formateur Référent">
                  <select value={form.instructor_id || ''} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} className={inputCls}>
                    <option value="">— Aucun attribué —</option>
                    {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </Field>
              </div>

              <FileUploadZone
                label="Image d'illustration de la Filière (Drag & Drop)"
                acceptType="photo"
                currentUrl={form.thumbnail_url || undefined}
                onFileSelected={(res) => setForm({ ...form, thumbnail_url: res.url })}
              />

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured || false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded text-teal-600" />
                  Mettre en Vedette sur l'Accueil
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.is_published || false} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 rounded text-teal-600" />
                  Publier Immédiatement
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100">
                Annuler
              </button>
              <button onClick={save} className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700">
                {editing ? "Enregistrer" : "Ajouter la Filière"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
