import { useState } from 'react';
import { Lock, LogIn, ShieldAlert, ArrowLeft, KeyRound, UserCheck, Zap } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

type FormateurAuthModalProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export function FormateurAuthModal({ onSuccess, onBack }: FormateurAuthModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('dr.barry@isac-mls.com');
  const [password, setPassword] = useState('formateur123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onSuccess();
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    const res = await signIn('dr.barry@isac-mls.com', 'formateur123');
    setLoading(false);
    if (!res.error) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'Accueil
        </button>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white font-serif">Espace Formateur Accrédité</h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
            Portail pédagogique réservé aux enseignants et formateurs référents ISAC MLS.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          ⚡ Connexion Rapide Formateur Référent
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email professionnel Formateur</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dr.barry@isac-mls.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 text-sm focus:border-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Mot de passe de connexion</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-400 outline-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Vérification...' : "Accéder à l'Espace Formateur"}
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-gray-400 text-center space-y-1">
          <p className="font-semibold text-teal-300">Formateurs Accrédités ISAC MLS</p>
          <p>Professeurs Référents : Dr. Barry, M. Camara Alseny, Mme Diallo Fatoumata, M. Idrissa Souaré.</p>
        </div>
      </div>
    </div>
  );
}
