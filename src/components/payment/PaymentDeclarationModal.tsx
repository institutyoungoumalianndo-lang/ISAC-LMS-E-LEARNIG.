import { useState, useEffect } from 'react';
import { X, CreditCard, Send, CheckCircle2, AlertCircle, Info, ShieldCheck, Phone } from 'lucide-react';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';
import type { Course, PaymentTrancheNumber, PaymentDeclaration, SiteSettings } from '@/lib/supabase';

type PaymentDeclarationModalProps = {
  course: Course;
  studentName: string;
  studentEmail: string;
  onClose: () => void;
  onSubmitted: (declaration: Partial<PaymentDeclaration>) => void;
};

export function PaymentDeclarationModal({
  course,
  studentName,
  studentEmail,
  onClose,
  onSubmitted,
}: PaymentDeclarationModalProps) {
  const totalPriceGnf = course.price_gnf || (course.price ? course.price * 10000 : 1500000);
  const trancheAmountGnf = Math.round(totalPriceGnf / 3);

  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    admin_orange_money: '+224 620 00 00 00',
    admin_mtn_money: '+224 660 00 00 00',
    admin_kulu_money: '+224 625 00 00 00',
    admin_paycard_money: '+224 657 00 00 00',
    admin_cashmoov_money: '+224 628 00 00 00',
  });

  useEffect(() => {
    const savedStr = localStorage.getItem('isac_lms_settings');
    if (savedStr) {
      try {
        setSettings(JSON.parse(savedStr));
      } catch (e) {}
    }
  }, []);

  const [tranche, setTranche] = useState<PaymentTrancheNumber>(1);
  const [amountGnf, setAmountGnf] = useState<number>(trancheAmountGnf);
  const [studentPhone, setStudentPhone] = useState('+224 ');
  const [paymentMethod, setPaymentMethod] = useState<'Orange Money' | 'MTN Mobile Money' | 'Kulu' | 'PayCard' | 'Cash Moov' | 'Virement' | 'Autre'>('Orange Money');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatGnf = (val: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(val) + ' GNF';
  };

  const handleTrancheSelect = (num: PaymentTrancheNumber) => {
    setTranche(num);
    setAmountGnf(trancheAmountGnf);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setError("Veuillez saisir la référence ou le numéro de transaction du dépôt.");
      return;
    }

    setLoading(true);
    setError(null);

    const declaration: Partial<PaymentDeclaration> = {
      id: 'pay-' + Date.now(),
      student_id: studentEmail,
      student_name: studentName,
      student_email: studentEmail,
      student_phone: studentPhone.trim(),
      course_id: course.id,
      tranche,
      amount_gnf: Number(amountGnf),
      transaction_ref: transactionRef.trim(),
      payment_method: paymentMethod,
      receipt_url: receiptUrl,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Store in localStorage
    const existingStr = localStorage.getItem('isac_lms_payment_declarations');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.push(declaration);
    localStorage.setItem('isac_lms_payment_declarations', JSON.stringify(existing));

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSubmitted(declaration);
      }, 1500);
    }, 800);
  };

  const paymentNumbers = [
    { name: 'Orange Money (+224)', number: settings.admin_orange_money || '+224 620 00 00 00', badgeColor: 'bg-orange-50 text-orange-900 border-orange-200' },
    { name: 'MTN Mobile Money (+224)', number: settings.admin_mtn_money || '+224 660 00 00 00', badgeColor: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
    { name: 'Kulu (+224)', number: settings.admin_kulu_money || '+224 625 00 00 00', badgeColor: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
    { name: 'PayCard (+224)', number: settings.admin_paycard_money || '+224 657 00 00 00', badgeColor: 'bg-blue-50 text-blue-900 border-blue-200' },
    { name: 'Cash Moov (+224)', number: settings.admin_cashmoov_money || '+224 628 00 00 00', badgeColor: 'bg-purple-50 text-purple-900 border-purple-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Déclaration de Paiement par Mobile Money</h3>
              <p className="text-xs text-teal-300">Filière : {course.title_fr} ({course.diploma_type || 'CQP'})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-gray-900">Déclaration Transmise avec Succès !</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Votre déclaration de virement a été transmise à l'Administration. L'accès aux cours HD et au formateur de votre filière s'ouvrira automatiquement dès validation.
              </p>
            </div>
          ) : (
            <>
              {/* Consignes & Numéros Admin */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-xs text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                  <Phone className="w-4 h-4 text-amber-600" />
                  1. Effectuez votre versement GNF sur l'un des numéros officiels ci-dessous :
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {paymentNumbers.map((p) => (
                    <div key={p.name} className={`p-2.5 rounded-xl border flex items-center justify-between ${p.badgeColor}`}>
                      <span className="text-xs font-bold">{p.name}</span>
                      <span className="font-mono font-bold text-xs">{p.number}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Choix des Tranches */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. Sélectionnez la Tranche de paiement à déclarer :
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([1, 2, 3] as PaymentTrancheNumber[]).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleTrancheSelect(num)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tranche === num
                          ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase text-gray-500">Tranche {num}</div>
                      <div className="text-base font-bold text-teal-700 mt-1">{formatGnf(trancheAmountGnf)}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Coût total filière : <span className="font-semibold text-gray-700">{formatGnf(totalPriceGnf)}</span> (3 × {formatGnf(trancheAmountGnf)})
                </p>
              </div>

              {/* Inputs Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Moyen de paiement utilisé</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-teal-500 outline-none"
                    >
                      <option value="Orange Money">Orange Money (Guinée)</option>
                      <option value="MTN Mobile Money">MTN Mobile Money (Guinée)</option>
                      <option value="Kulu">Kulu (Guinée)</option>
                      <option value="PayCard">PayCard (Guinée)</option>
                      <option value="Cash Moov">Cash Moov (Guinée)</option>
                      <option value="Virement">Virement bancaire</option>
                      <option value="Autre">Espèces / Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Montant versé (GNF)</label>
                    <input
                      type="number"
                      required
                      value={amountGnf}
                      onChange={(e) => setAmountGnf(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-teal-500 outline-none font-bold text-teal-900"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Numéro de Téléphone Mobile Money / Contact (+224)</label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+224 620 00 00 00"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-teal-500 outline-none font-semibold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">N° de Référence ou SMS de Transaction</label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="Ex: PP260815.1830.A12345"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-teal-500 outline-none font-mono uppercase font-bold text-teal-900"
                    />
                  </div>
                </div>

                <FileUploadZone
                  label="Capture d'Écran ou Reçu de Versement (Drag & Drop)"
                  acceptType="photo"
                  currentUrl={receiptUrl || undefined}
                  onFileSelected={(res: FileUploadResult) => setReceiptUrl(res.url)}
                />

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Transmissions...' : 'Soumettre ma Déclaration de Paiement'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
