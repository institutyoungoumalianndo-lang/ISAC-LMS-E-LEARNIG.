import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, Eye, Filter, Check, CreditCard, ShieldCheck, Phone } from 'lucide-react';
import type { PaymentDeclaration, PaymentStatus } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export function PaymentValidationAdmin() {
  const [declarations, setDeclarations] = useState<PaymentDeclaration[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const loadDeclarations = () => {
    const savedStr = localStorage.getItem('isac_lms_payment_declarations');
    if (savedStr) {
      try {
        setDeclarations(JSON.parse(savedStr));
        return;
      } catch (e) {
        setDeclarations([]);
      }
    }
  };

  useEffect(() => {
    loadDeclarations();
  }, []);

  const updateStatus = async (id: string, newStatus: PaymentStatus) => {
    const updated = declarations.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status: newStatus,
          validated_at: newStatus === 'validated' ? new Date().toISOString() : undefined,
        };
      }
      return d;
    });

    const targetDec = declarations.find((d) => d.id === id);

    setDeclarations(updated);
    localStorage.setItem('isac_lms_payment_declarations', JSON.stringify(updated));

    // Update enrollment status in local storage & Supabase
    if (targetDec && newStatus === 'validated') {
      let savedEnrollmentsStr = localStorage.getItem('isac_lms_enrollments');
      let enrollmentsList: any[] = [];
      if (savedEnrollmentsStr) {
        try {
          enrollmentsList = JSON.parse(savedEnrollmentsStr);
        } catch (e) {}
      }

      enrollmentsList = enrollmentsList.map((e) => {
        if (e.course_id === targetDec.course_id && (e.student_id === targetDec.student_id || e.student_email === targetDec.student_email)) {
          return { ...e, status: 'active' };
        }
        return e;
      });

      localStorage.setItem('isac_lms_enrollments', JSON.stringify(enrollmentsList));

      await supabase
        .from('enrollments')
        .update({ status: 'active' })
        .eq('course_id', targetDec.course_id)
        .eq('student_id', targetDec.student_id);

      await supabase
        .from('payment_declarations')
        .update({ status: 'validated', updated_at: new Date().toISOString() })
        .eq('id', id);
    }

    // Trigger instant global event update
    window.dispatchEvent(new Event('isac_payment_validated'));
  };

  const filtered = declarations.filter((d) => {
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchSearch =
      d.student_name.toLowerCase().includes(search.toLowerCase()) ||
      d.student_email.toLowerCase().includes(search.toLowerCase()) ||
      d.transaction_ref.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatGnf = (val: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(val) + ' GNF';
  };

  const statusBadge = (status: PaymentStatus) => {
    if (status === 'validated') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">
          <Check className="w-3.5 h-3.5" /> Validé — Accès Déverrouillé
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
          <XCircle className="w-3.5 h-3.5" /> Rejeté
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <Clock className="w-3.5 h-3.5" /> En attente de validation
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Validation Manuelle des Paiements & Déverrouillage des Filières</h2>
          <p className="text-xs text-gray-500">
            Dès qu'un paiement est validé, l'espace d'études et le formateur de la filière deviennent instantanément accessibles pour l'étudiant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher étudiant, n° ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl">
            {(['all', 'pending', 'validated', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterStatus === st ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st === 'all' ? 'Tous' : st === 'pending' ? 'En attente' : st === 'validated' ? 'Validés' : 'Rejetés'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Étudiant</th>
                <th className="px-6 py-4">Tranche</th>
                <th className="px-6 py-4">Montant GNF</th>
                <th className="px-6 py-4">Moyen & N° Réf</th>
                <th className="px-6 py-4">Reçu</th>
                <th className="px-6 py-4">Statut d'Accès</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="font-bold text-gray-900">{item.student_name}</div>
                    <div className="text-xs text-gray-400">{item.student_email}</div>
                    {item.student_phone && (
                      <div className="text-xs text-teal-800 font-bold font-mono mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-teal-600" />
                        {item.student_phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-teal-700">
                    Tranche {item.tranche}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatGnf(item.amount_gnf)}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <div className="font-semibold text-gray-700">{item.payment_method}</div>
                    <div className="text-teal-600 font-bold">{item.transaction_ref}</div>
                  </td>
                  <td className="px-6 py-4">
                    {item.receipt_url ? (
                      <button
                        onClick={() => setSelectedReceipt(item.receipt_url!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-600 hover:bg-teal-100"
                      >
                        <Eye className="w-3.5 h-3.5" /> Voir reçu
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Aucun</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{statusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(item.id, 'validated')}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Valider & Ouvrir Accès
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          Rejeter
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateStatus(item.id, 'pending')}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Aucune déclaration de paiement trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal aperçu reçu */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-xl w-full bg-white rounded-3xl p-4 overflow-hidden">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="font-bold text-gray-900 mb-4 p-2">Aperçu du reçu de versement</h3>
            <img src={selectedReceipt} alt="Reçu" className="w-full max-h-[70vh] object-contain rounded-2xl border" />
          </div>
        </div>
      )}
    </div>
  );
}
