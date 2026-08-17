import { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

type CadreAuthModalProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export function CadreAuthModal({ onSuccess, onBack }: CadreAuthModalProps) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('cadre@isac-mls.com');
  const [password, setPassword] = useState('cadre123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);
    if (!error) {
      onSuccess();
    } else {
      setError(error);
    }
  };

  const handleQuickCadre = async () => {
    setLoading(true);
    const { error } = await signIn('cadre@isac-mls.com', 'cadre123');
    setLoading(false);
    if (!error) onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-4">
      <div className="absolute top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg border border-slate-800">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Espace Réservé aux Cadres</h1>
            <p className="text-xs text-gray-500 mt-1">Accès Restreint aux Comptes Générés par l'Administration</p>
          </div>

          <button
            type="button"
            onClick={handleQuickCadre}
            disabled={loading}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            ⚡ Connexion Rapide Cadre Dirigeant
          </button>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse email Cadre</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-600 outline-none"
                  placeholder="cadre@isac-mls.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mot de passe généré par l'Admin</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-600 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-900 transition-all shadow-md"
            >
              {loading ? 'Connexion en cours...' : 'Accéder au Coffre-Fort Cadre'}
            </button>

            <p className="text-[11px] text-gray-400 text-center pt-2">
              Note : L'accès nécessite un compte Cadre généré par l'Administrateur Général.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
