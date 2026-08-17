import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, FileText, Video, Plus, LogOut, Download, Trash2, Key, Users, Eye, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';
import type { VaultDocument, VirtualMeeting, Cadre } from '@/lib/supabase';

type CadreDashboardProps = {
  onExit: () => void;
};

type CadreTab = 'vault' | 'meetings' | 'registry';

export function CadreDashboard({ onExit }: CadreDashboardProps) {
  const { session, signOut } = useAuth();

  const [tab, setTab] = useState<CadreTab>('vault');
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [meetings, setMeetings] = useState<VirtualMeeting[]>([]);
  const [cadres, setCadres] = useState<Cadre[]>([]);
  const [showAddVaultModal, setShowAddVaultModal] = useState(false);

  // Vault form state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'Administratif' | 'Financier' | 'Pédagogique' | 'Décisions Bureau' | 'Procès-Verbal'>('Administratif');
  const [docDesc, setDocDesc] = useState('');
  const [fileResult, setFileResult] = useState<FileUploadResult | null>(null);

  const loadData = () => {
    // 1. Vault docs
    const savedVaultStr = localStorage.getItem('isac_lms_vault_docs');
    if (savedVaultStr) {
      try {
        setVaultDocs(JSON.parse(savedVaultStr));
      } catch (e) {}
    } else {
      const initialVault: VaultDocument[] = [
        {
          id: 'v-1',
          title: 'Procès-Verbal du Conseil de Direction - Révision des Modalités',
          category: 'Procès-Verbal',
          description: 'Document officiel de cadrage académique et financier pour l\'année académique 2026-2027.',
          file_url: '#',
          file_name: 'PV_Conseil_Direction_2026.pdf',
          file_size: '2.4 MB',
          uploaded_by: 'Direction Générale',
          is_encrypted: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 'v-2',
          title: 'Bilan Financier Global & Encaissements Tranches GNF',
          category: 'Financier',
          description: 'État récapitulatif comptable des versements reçus par Mobile Money et virement.',
          file_url: '#',
          file_name: 'Bilan_Financier_Encaissements_GNF.xlsx',
          file_size: '1.8 MB',
          uploaded_by: 'Direction Financière',
          is_encrypted: true,
          created_at: new Date().toISOString(),
        },
      ];
      setVaultDocs(initialVault);
      localStorage.setItem('isac_lms_vault_docs', JSON.stringify(initialVault));
    }

    // 2. Private meetings
    const savedMeetingsStr = localStorage.getItem('isac_lms_cadre_meetings');
    if (savedMeetingsStr) {
      try {
        setMeetings(JSON.parse(savedMeetingsStr));
      } catch (e) {}
    } else {
      const initialMeetings: VirtualMeeting[] = [
        {
          id: 'cm-1',
          title: 'Réunion Sécrète du Bureau Executif & Validation des Diplômes',
          description: 'Ordre du jour : Validation des relevés de notes et signature des diplômes certifiants.',
          course_id: 'cadres-exclusive',
          meeting_url: 'https://meet.jit.si/ISAC-MLS-Reunion-Secrete-Cadres-Executifs-2026',
          start_time: new Date(Date.now() + 1800000).toISOString(),
          duration_minutes: 90,
          is_private_cadre: true,
          status: 'live',
          created_at: new Date().toISOString(),
        },
      ];
      setMeetings(initialMeetings);
      localStorage.setItem('isac_lms_cadre_meetings', JSON.stringify(initialMeetings));
    }

    // 3. Cadre registry
    const savedCadresStr = localStorage.getItem('isac_lms_cadres');
    if (savedCadresStr) {
      try {
        setCadres(JSON.parse(savedCadresStr));
      } catch (e) {}
    } else {
      const initialCadres: Cadre[] = [
        {
          id: 'c-1',
          name: 'M. Camara Alseny Tawel',
          email: 'admin@isac-mls.com',
          role_title: 'Administrateur Général & Fondateur',
          department: 'Direction Générale',
          created_at: new Date().toISOString(),
        },
        {
          id: 'c-2',
          name: 'Dr. Barry Kante',
          email: 'cadre.direction@isac-mls.com',
          role_title: 'Directeur de la Pédagogie',
          department: 'Direction Pédagogique',
          created_at: new Date().toISOString(),
        },
      ];
      setCadres(initialCadres);
      localStorage.setItem('isac_lms_cadres', JSON.stringify(initialCadres));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddVaultDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !fileResult?.url) return;

    const newDoc: VaultDocument = {
      id: 'v-' + Date.now(),
      title: docTitle.trim(),
      category: docCategory,
      description: docDesc.trim(),
      file_url: fileResult.url,
      file_name: fileResult.name,
      file_size: fileResult.size,
      uploaded_by: session?.user?.user_metadata?.full_name || session?.user?.email || 'Cadre Dirigeant',
      is_encrypted: true,
      created_at: new Date().toISOString(),
    };

    const updated = [newDoc, ...vaultDocs];
    setVaultDocs(updated);
    localStorage.setItem('isac_lms_vault_docs', JSON.stringify(updated));

    setShowAddVaultModal(false);
    setDocTitle('');
    setDocDesc('');
    setFileResult(null);
  };

  const handleDeleteVaultDoc = (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce document du coffre-fort ?')) return;
    const updated = vaultDocs.filter((d) => d.id !== id);
    setVaultDocs(updated);
    localStorage.setItem('isac_lms_vault_docs', JSON.stringify(updated));
  };

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Espace Cadres & Executive Suite</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ACCÈS RESTREINT
                </span>
              </div>
              <p className="text-xs text-slate-400">{session?.user?.email || 'Cadre Dirigeant ISAC MLS'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-all border border-slate-700"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto pt-2">
          {[
            { id: 'vault', label: 'Coffre-Fort Secrétisé (Vault)', icon: Lock },
            { id: 'meetings', label: 'Réunions Privées / Conseil', icon: Video },
            { id: 'registry', label: 'Registre des Cadres & Bureau', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-slate-950 text-teal-400 border-t-2 border-teal-500 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Coffre-Fort Numérique */}
        {tab === 'vault' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" /> Coffre-Fort Crypté Réservé aux Cadres
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Échange Sécurisé de Documents Confidentiels</h2>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Déposez et consultez les comptes-rendus du bureau, bilans financiers, directives administratives et décisions stratégiques.
                </p>
              </div>

              <button
                onClick={() => setShowAddVaultModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl transition-all flex-shrink-0"
              >
                <Plus className="w-5 h-5" /> Déposer un Document Secrétisé
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vaultDocs.map((doc) => (
                <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-teal-400 border border-slate-700">
                        {doc.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <Key className="w-3 h-3" /> Secrétisé
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">{doc.title}</h3>
                    {doc.description && <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{doc.description}</p>}
                    
                    <div className="text-[11px] text-slate-500 font-mono space-y-0.5 pt-1">
                      <div>Fichier : {doc.file_name} {doc.file_size && `(${doc.file_size})`}</div>
                      <div>Déposé par : {doc.uploaded_by}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    {doc.file_url && doc.file_url !== '#' ? (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Télécharger / Consulter
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">Document crypté</span>
                    )}

                    <button
                      onClick={() => handleDeleteVaultDoc(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Réunions Privées */}
        {tab === 'meetings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Réunions Privées du Conseil d'Administration</h2>
              <p className="text-xs text-slate-400">
                Salon de visio-conférence hautement sécurisé réservé aux réunions stratégiques de la Direction et des Cadres.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {meetings.map((m) => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      🔒 Séance Confidentielle
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      EN DIRECT
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>

                  <div className="pt-2">
                    <a
                      href={m.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl transition-all"
                    >
                      <Video className="w-5 h-5" /> Entrer dans la Salle Sécrète des Cadres
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Registre des Cadres */}
        {tab === 'registry' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Registre Officiel des Cadres & de la Direction</h2>
              <p className="text-xs text-slate-400">
                Répertoire des membres accrédités au sein de l'Executive Suite ISAC MLS.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cadres.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{c.name}</h3>
                      <p className="text-xs text-teal-400 font-semibold">{c.role_title}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                    <div>Département : <span className="text-slate-200">{c.department}</span></div>
                    <div>Email : <span className="text-slate-200 font-mono">{c.email}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Ajout Document Vault */}
      {showAddVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-white">Déposer un Document dans le Coffre-Fort</h3>

            <form onSubmit={handleAddVaultDoc} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre du document</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Procès-verbal du conseil / Bilan comptable"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Catégorie</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-teal-500 outline-none"
                >
                  <option value="Administratif">Administratif</option>
                  <option value="Financier">Financier</option>
                  <option value="Pédagogique">Pédagogique</option>
                  <option value="Décisions Bureau">Décisions Bureau</option>
                  <option value="Procès-Verbal">Procès-Verbal</option>
                </select>
              </div>

              <FileUploadZone
                label="Charger le fichier secrétisé (Drag & Drop)"
                acceptType="document"
                onFileSelected={(res: FileUploadResult) => setFileResult(res)}
              />

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Notes confidentielles</label>
                <textarea
                  rows={2}
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVaultModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg"
                >
                  Cryptage & Enregistrement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
