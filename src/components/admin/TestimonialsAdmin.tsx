import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { supabase, type Testimonial } from '@/lib/supabase';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';

type Props = { testimonials: Testimonial[]; onChanged: () => void };

const emptyForm = { author_name: '', author_title_fr: '', author_title_en: '', content_fr: '', content_en: '', avatar_url: '', rating: 5 };

export function TestimonialsAdmin({ testimonials, onChanged }: Props) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => {
    setForm({ author_name: t.author_name, author_title_fr: t.author_title_fr || '', author_title_en: t.author_title_en || '', content_fr: t.content_fr, content_en: t.content_en || '', avatar_url: t.avatar_url || '', rating: t.rating });
    setEditing(t); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const data = {
      author_name: form.author_name, author_title_fr: form.author_title_fr || null, author_title_en: form.author_title_en || null,
      content_fr: form.content_fr, content_en: form.content_en || form.content_fr, avatar_url: form.avatar_url || null, rating: Number(form.rating),
    };
    if (editing) await supabase.from('testimonials').update(data).eq('id', editing.id);
    else await supabase.from('testimonials').insert(data);
    setSaving(false); setShowForm(false); onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm(t('admin_confirm_delete'))) return;
    await supabase.from('testimonials').delete().eq('id', id);
    onChanged();
  };

  const cls = "w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm";

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5" />{t('admin_add')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.author_name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">{t.author_name.charAt(0)}</div>
                )}
                <div>
                  <div className="font-bold text-gray-900">{t.author_name}</div>
                  <div className="text-sm text-gray-500">{t.author_title_fr}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-teal-50 text-teal-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-600 italic line-clamp-3">"{t.content_fr}"</p>
          </div>
        ))}
      </div>
      {testimonials.length === 0 && <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">{t('no_data')}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">{editing ? t('admin_edit') : t('admin_add')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_testimonial_author')}</label><input type="text" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className={cls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_testimonial_author_title_fr')}</label><input type="text" value={form.author_title_fr} onChange={(e) => setForm({ ...form, author_title_fr: e.target.value })} className={cls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_testimonial_author_title_en')}</label><input type="text" value={form.author_title_en} onChange={(e) => setForm({ ...form, author_title_en: e.target.value })} className={cls} /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_testimonial_content_fr')}</label><textarea rows={3} value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} className={cls} /></div>

              <FileUploadZone
                label="Chargement de l'Avatar / Photo Témoignage (Drag & Drop)"
                acceptType="photo"
                currentUrl={form.avatar_url || undefined}
                onFileSelected={(res: FileUploadResult) => setForm({ ...form, avatar_url: res.url })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_testimonial_rating')} (sur 5 étoiles)</label>
                <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={cls} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving || !form.author_name || !form.content_fr} className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-60">{t('admin_save')}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">{t('admin_cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
