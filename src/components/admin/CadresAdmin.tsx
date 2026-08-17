import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Mail, Lock, User, Briefcase, Phone } from 'lucide-react';
import type { Cadre } from '@/lib/supabase';

export function CadresAdmin() {
  const [cadres, setCadres] = useState<Cadre[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCadre, setEditingCadre] = useState<Cadre | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTitle, setRoleTitle] = useState('Directeur des Études');
  const [department, setDepartment] = useState('Direction Pédagogique');
  const [phone, setPhone] = useState('+224 ');

  const loadCadres = () => {
    const savedStr = localStorage.getItem('isac_lms_cadres');
    if (savedStr) {
      try {
        setCadres(JSON.parse(savedStr));
        return;
      } catch (e) {}
    }

    const defaultCadres: Cadre[] = [
      {
        id: 'c-1',
        name: 'M. Camara Alseny Tawel',
        email: 'admin@isac-mls.com',
        password: 'admin123',
        role_title: 'Administrateur Général & Fondateur',
        department: 'Direction Générale',
        phone: '+224 620 00 00 00',
        created_at: new Date().toISOString(),
      },
      {
        id: 'c-2',
        name: 'Dr. Barry Kante',
        email: 'cadre@isac-mls.com',
        password: 'cadre123',
        role_title: 'Directeur de la Pédagogie',
        department: 'Direction Pédagogique',
        phone: '+224 622 00 00 00',
        created_at: new Date().toISOString(),
      },
    ];

    setCadres(defaultCadres);
    localStorage.setItem('isac_lms_cadres', JSON.stringify(defaultCadres));
  };

  useEffect(() => {
    loadCadres();
  }, []);

  const handleOpenAdd = () => {
    setEditingCadre(null);
    setName('');
    setEmail('');
    setPassword('cadre' + Math.floor(100 + Math.random() * 900));
    setRoleTitle('Directeur des Études');
    setDepartment('Direction Pédagogique');
    setPhone('+224 ');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Cadre) => {
    setEditingCadre(c);
    setName(c.name);
    setEmail(c.email);
    setPassword(c.password || 'cadre123');
    setRoleTitle(c.role_title);
    setDepartment(c.department);
    setPhone(c.phone || '+224 ');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newCadre: Cadre = {
      id: editingCadre ? editingCadre.id : 'cadre-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim() || 'cadre123',
      role_title: roleTitle.trim(),
      department: department.trim(),
      phone: phone.trim(),
      created_at: editingCadre ? editingCadre.created_at : new Date().toISOString(),
    };

    let updated: Cadre[] = [];
    if (editingCadre) {
      updated = cadres.map((c) => (c.id === editingCadre.id ? newCadre : c));
    } else {
      updated = [newCadre, ...cadres];
    }

    setCadres(updated);
    localStorage.setItem('isac_lms_cadres', JSON.stringify(updated));
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce compte Cadre ?')) return;
    const updated = cadres.filter((c) => c.id !== id);
    setCadres(updated);
    localStorage.setItem('isac_lms_cadres', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Comptes Cadres & Direction</h2>
          <p className="text-xs text-gray-500">
            Créez les identifiants d'accès exclusifs (email & mot de passe) pour les Cadres et Directeurs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Générer un Nouveau Compte Cadre
        </button>
      </div>

      {/* Grid des Cadres */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cadres.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{c.name}</h3>
                  <p className="text-xs text-teal-700 font-semibold">{c.role_title}</p>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100 font-mono">
                <div>Email : <span className="font-bold text-gray-900">{c.email}</span></div>
                <div>Mot de passe : <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{c.password || 'cadre123'}</span></div>
                <div>Département : <span className="font-semibold text-gray-800">{c.department}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Accès Cadre Actif
              </span>

              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(c)} className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Génération Compte Cadre */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900">
              {editingCadre ? 'Modifier le Compte Cadre' : 'Générer un Compte Cadre Dirigeant'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nom Complet du Cadre</label>
                <input
                  type="text"
                  required
                  placeholder="Mme. Camara Aminata"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fonction / Titre</label>
                  <input
                    type="text"
                    required
                    placeholder="Directrice Financière"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    required
                    placeholder="Administration"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Adresse Email Cadre</label>
                  <input
                    type="email"
                    required
                    placeholder="cadre.finance@isac-mls.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mot de Passe Généré</label>
                  <input
                    type="text"
                    required
                    placeholder="cadre123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none font-mono text-amber-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Téléphone de contact (+224)</label>
                <input
                  type="text"
                  placeholder="+224 620 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Enregistrer les Identifiants
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
