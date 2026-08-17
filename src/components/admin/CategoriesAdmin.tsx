import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { supabase, type Category } from '@/lib/supabase';

type Props = { categories: Category[]; onChanged: () => void };

const emptyForm = { name_fr: '', name_en: '', description_fr: '', description_en: '', icon: 'BookOpen', display_order: 0 };

export function CategoriesAdmin({ categories, onChanged }: Props) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (c: Category) => {
    setForm({
      name_fr: c.name_fr, name_en: c.name_en,
      description_fr: c.description_fr || '', description_en: c.description_en || '',
      icon: c.icon || 'BookOpen', display_order: c.display_order,
    });
    setEditing(c); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const data = {
      name_fr: form.name_fr, name_en: form.name_en,
      description_fr: form.description_fr || null, description_en: form.description_en || null,
      icon: form.icon, display_order: Number(form.display_order),
    };
    if (editing) await supabase.from('categories').update(data).eq('id', editing.id);
    else await supabase.from('categories').insert(data);
    setSaving(false); setShowForm(false); onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm(t('admin_confirm_delete'))) return;
    await supabase.from('categories').delete().eq('id', id);
    onChanged();
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5" />{t('admin_add')}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{t('admin_category_name_fr')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">{t('admin_category_name_en')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Icon</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">{t('admin_category_order')}</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">{t('admin_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{c.name_fr}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{c.name_en}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{c.icon}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{c.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-teal-50 text-teal-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">{t('no_data')}</div>}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? t('admin_edit') : t('admin_add')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_category_name_fr')}</label><input type="text" value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_category_name_en')}</label><input type="text" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_category_desc_fr')}</label><textarea rows={2} value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_category_desc_en')}</label><textarea rows={2} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_category_icon')}</label><input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" placeholder="BookOpen" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_category_order')}</label><input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving || !form.name_fr || !form.name_en} className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-60">{t('admin_save')}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">{t('admin_cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
