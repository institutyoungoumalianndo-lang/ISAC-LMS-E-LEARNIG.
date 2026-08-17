import { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

type CadreAuthModalProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export function CadreAuthModal({ onSuccess, onBack }: CadreAuthModalProps) {
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

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSuccess(true);
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">Mot de passe Cadre</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-teal-600 font-semibold hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
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
          </form>
        </div>
      </div>

      {/* Forgot Password Modal for Cadres */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Récupération de compte Cadre</h3>
              <p className="text-xs text-gray-500">Saisissez votre email professionnel Cadre pour recevoir le lien de réinitialisation.</p>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="font-bold">Message envoyé avec succès !</p>
                <p>Un lien de récupération a été transmis à l'adresse <b>{resetEmail}</b>.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Cadre</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="cadre@isac-mls.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-600 outline-none text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-900 shadow-md"
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
