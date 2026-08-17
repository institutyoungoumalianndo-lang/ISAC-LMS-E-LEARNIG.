import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Key, Mail, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { supabase, type Instructor, type Course } from '@/lib/supabase';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';

type Props = { instructors: Instructor[]; courses?: Course[]; onChanged: () => void };

const emptyForm = {
  name: '',
  email: '',
  password: '',
  title_fr: '',
  title_en: '',
  bio_fr: '',
  bio_en: '',
  photo_url: '',
  assigned_course_id: '',
};

export function InstructorsAdmin({ instructors, courses = [], onChanged }: Props) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (i: Instructor) => {
    setForm({
      name: i.name,
      email: i.email || `formateur.${i.name.toLowerCase().replace(/\s+/g, '')}@isac-mls.com`,
      password: i.password || 'formateur123',
      title_fr: i.title_fr || '',
      title_en: i.title_en || '',
      bio_fr: i.bio_fr || '',
      bio_en: i.bio_en || '',
      photo_url: i.photo_url || '',
      assigned_course_id: i.assigned_course_id || '',
    });
    setEditing(i);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const data = {
      name: form.name,
      email: form.email || `formateur.${form.name.toLowerCase().replace(/\s+/g, '')}@isac-mls.com`,
      password: form.password || 'formateur123',
      title_fr: form.title_fr || null,
      title_en: form.title_en || null,
      bio_fr: form.bio_fr || null,
      bio_en: form.bio_en || null,
      photo_url: form.photo_url || null,
      assigned_course_id: form.assigned_course_id || null,
    };

    try {
      if (editing) {
        await supabase.from('instructors').update(data).eq('id', editing.id);
      } else {
        await supabase.from('instructors').insert(data);
      }
    } catch (err) {}

    // Save local instructor list for quick auth
    const updatedLocal = instructors.map((inst) => (inst.id === editing?.id ? { ...inst, ...data } : inst));
    if (!editing) updatedLocal.push({ id: 'inst-' + Date.now(), created_at: new Date().toISOString(), ...data });
    localStorage.setItem('isac_lms_instructors', JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('isac_settings_updated'));

    setSaving(false);
    setShowForm(false);
    onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm(t('admin_confirm_delete'))) return;
    try {
      await supabase.from('instructors').delete().eq('id', id);
    } catch (err) {}
    
    const updatedLocal = instructors.filter((inst) => inst.id !== id);
    localStorage.setItem('isac_lms_instructors', JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('isac_settings_updated'));
    onChanged();
  };

  const cls = "w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Formateurs & Comptes d'Accès</h2>
          <p className="text-xs text-gray-500">
            Créez les accès des formateurs et affectez-les aux filières de formation.
          </p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5" /> Ajouter un Formateur
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {instructors.map((i) => (
          <div key={i.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-4 shadow-sm">
            {i.photo_url ? (
              <img src={i.photo_url} alt={i.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {i.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{i.name}</h3>
              <p className="text-xs font-semibold text-teal-600 truncate">{i.title_fr || 'Formateur ISAC'}</p>
              
              <div className="mt-2 text-[11px] text-gray-500 space-y-0.5 font-mono">
                <div className="flex items-center gap-1 truncate text-gray-700">
                  <Mail className="w-3 h-3 text-teal-600" />
                  {i.email || `formateur.${i.name.toLowerCase().replace(/\s+/g, '')}@isac-mls.com`}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Key className="w-3 h-3 text-amber-500" />
                  Pass: {i.password || 'formateur123'}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(i)} className="p-2 rounded-lg hover:bg-teal-50 text-teal-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(i.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
          Aucun formateur enregistré pour le moment.
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Modifier le Formateur' : 'Ajouter un Formateur'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet du Formateur</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cls} placeholder="Dr. Alpha Diallo" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email d'accès Formateur</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={cls} placeholder="formateur@isac-mls.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mot de passe</label>
                  <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={cls} placeholder="formateur123" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Filière / Formation affectée</label>
                <select value={form.assigned_course_id} onChange={(e) => setForm({ ...form, assigned_course_id: e.target.value })} className={cls}>
                  <option value="">-- Sélectionner une filière --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title_fr}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Titre (Français)</label>
                  <input type="text" value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} className={cls} placeholder="Expert en Gestion de Projet" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Titre (Anglais)</label>
                  <input type="text" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={cls} placeholder="Project Management Expert" />
                </div>
              </div>

              <FileUploadZone
                label="Photo / Portrait du Formateur"
                acceptType="photo"
                currentUrl={form.photo_url}
                onFileSelected={(res: FileUploadResult) => setForm({ ...form, photo_url: res.url })}
              />

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving || !form.name} className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-60">{t('admin_save')}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">{t('admin_cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
