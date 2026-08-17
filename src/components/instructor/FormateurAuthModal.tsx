import { useState } from 'react';
import { Lock, LogIn, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

type FormateurAuthModalProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export function FormateurAuthModal({ onSuccess, onBack }: FormateurAuthModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recovery Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

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

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSuccess(true);
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

        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white font-serif">Espace Formateur Accrédité</h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
            Portail pédagogique réservé aux enseignants et formateurs référents ISAC MLS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email professionnel Formateur</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="formateur@isac-mls.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 text-sm focus:border-teal-400 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-300">Mot de passe de connexion</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-teal-400 font-semibold hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
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
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Vérification...' : "Accéder à l'Espace Formateur"}
          </button>
        </form>
      </div>

      {/* Forgot Password Recovery Modal for Formateurs */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Récupération de compte Formateur</h3>
              <p className="text-xs text-gray-400">Saisissez votre email professionnel pour recevoir les instructions d'accès.</p>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-2xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="font-bold">Demande transmise avec succès !</p>
                <p>Les instructions de récupération ont été envoyées à l'adresse <b>{resetEmail}</b>. Vérifiez vos spams ou contactez la Direction.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  className="mt-3 px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Email professionnel Formateur</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="formateur@isac-mls.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 outline-none text-xs focus:border-teal-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-500 shadow-md"
                  >
                    Récupérer mon compte
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
