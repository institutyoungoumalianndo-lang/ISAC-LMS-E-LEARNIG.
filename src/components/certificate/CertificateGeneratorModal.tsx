import { useRef, useState, useEffect } from 'react';
import { Award, Download, Printer, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import type { Certificate } from '@/lib/supabase';

type CertificateGeneratorModalProps = {
  certificate: Certificate;
  onClose: () => void;
};

export function CertificateGeneratorModal({ certificate, onClose }: CertificateGeneratorModalProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [ministryLogoUrl, setMinistryLogoUrl] = useState<string>('/logo_ministere_guinee.jpg');
  const [creationNum, setCreationNum] = useState<string>('N°070/METFP-ET/DNETPP/14');
  const [openingNum, setOpeningNum] = useState<string>('N°2014/3942/CAB/DNETPP');
  const [sigDgUrl, setSigDgUrl] = useState<string | null>(null);
  const [sigCoUrl, setSigCoUrl] = useState<string | null>(null);
  const [stampUrl, setStampUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedStr = localStorage.getItem('isac_lms_settings');
    if (savedStr) {
      try {
        const s = JSON.parse(savedStr);
        if (s.logo_url) setLogoUrl(s.logo_url);
        if (s.ministry_logo_url) setMinistryLogoUrl(s.ministry_logo_url);
        if (s.creation_approval_num) setCreationNum(s.creation_approval_num);
        if (s.opening_approval_num) setOpeningNum(s.opening_approval_num);
        if (s.signature_dg_url) setSigDgUrl(s.signature_dg_url);
        if (s.signature_cofondateur_url) setSigCoUrl(s.signature_cofondateur_url);
        if (s.stamp_url) setStampUrl(s.stamp_url);
      } catch (e) {}
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    certificate.qr_code_data || `ISAC-MLS-VERIFY-${certificate.serial_number}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:block">
      {/* Embedded CSS Style for 1-Page A4 Landscape Print */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-hidden {
            display: none !important;
          }
          .a4-landscape-page {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 6mm 10mm !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-gray-200 print:shadow-none print:border-none print:m-0 print:max-w-none print:w-full">
        {/* Actions Bar Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Diplôme Certifiant Officiel - Format A4 Paysage Luxe</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" /> Imprimer / Exporter PDF (A4 Paysage)
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Frame Body (Printable A4 Landscape Page) */}
        <div ref={certRef} className="a4-landscape-page p-4 sm:p-6 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/40 text-gray-900 border-[8px] border-amber-600 outline outline-4 outline-teal-950 rounded-xl m-3 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Inner Decorative Golden Line */}
          <div className="absolute inset-2 border border-amber-400/80 rounded-lg pointer-events-none" />

          {/* Watermark Logo Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            {logoUrl ? (
              <img src={logoUrl} alt="Watermark" className="w-[450px] h-[450px] object-contain" />
            ) : (
              <Award className="w-[450px] h-[450px] text-teal-900" />
            )}
          </div>

          <div className="relative z-10 text-center space-y-3 flex-1 flex flex-col justify-between px-4 py-2">
            {/* Top State Ministry Banner Header */}
            <div className="border-b-2 border-teal-900/50 pb-2">
              <div className="flex items-center justify-between gap-4 text-xs font-serif font-bold text-teal-950">
                <div className="flex items-center gap-3">
                  <img src={ministryLogoUrl} alt="Sceau du Ministère GUINÉE" className="h-16 w-auto object-contain rounded-full shadow-sm bg-white p-0.5 border border-amber-300" />
                  <div className="text-left leading-tight space-y-0.5">
                    <span className="text-xs uppercase font-black text-red-700 tracking-widest block">RÉPUBLIQUE DE GUINÉE</span>
                    <span className="text-[9px] italic text-gray-700 font-semibold block">Travail - Justice - Solidarité</span>
                    <h3 className="font-black text-[11px] uppercase text-teal-950 max-w-md tracking-tight">
                      MINISTÈRE DE L'ENSEIGNEMENT TECHNIQUE ET DE LA FORMATION PROFESSIONNELLE
                    </h3>
                  </div>
                </div>

                <div className="text-right space-y-0.5 text-[9px] font-mono text-slate-900">
                  <div className="font-black text-teal-950 uppercase text-[11px]">
                    INSTITUT YOUNGOU MALIANNDO « I.YMA »
                  </div>
                  <div className="text-teal-900 font-bold">« École de Commerce et de Gestion »</div>
                  <div className="pt-0.5">Création : <strong className="text-teal-950 font-bold">{creationNum}</strong></div>
                  <div>Ouverture : <strong className="text-teal-950 font-bold">{openingNum}</strong></div>
                </div>
              </div>
            </div>

            {/* Header / Logo Officiel Établissement */}
            <div className="space-y-0.5">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo ISAC" className="h-12 mx-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-teal-950 text-amber-300 flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-6 h-6" />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-teal-950 font-serif uppercase">
                ISAC MLS E-LEARNING
              </h1>
            </div>

            <div className="w-36 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 mx-auto rounded-full shadow-sm" />

            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase font-serif tracking-widest border-b-2 border-amber-500/80 inline-block px-8 pb-1">
                DIPLÔME DE FIN DE FORMATION
              </h2>
              <p className="text-xs text-gray-700 italic font-medium">
                Attribué sous la tutelle ministérielle et les félicitations du Conseil Académique et de la Direction Générale
              </p>
            </div>

            {/* Student Name */}
            <div className="py-1">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest block mb-0.5">Le présent diplôme certifiant est décerné à :</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-950 font-serif border-b-2 border-dashed border-amber-700 pb-1 px-8 inline-block drop-shadow-sm">
                {certificate.student_name}
              </span>
            </div>

            {/* Filière & Details */}
            <div className="max-w-2xl mx-auto space-y-1.5 text-xs text-gray-900 leading-relaxed">
              <p className="font-medium text-gray-700">
                Pour avoir suivi avec succès et validé l'ensemble des modules d'évaluation et exigences pratiques de la filière de formation professionnelle :
              </p>
              <div className="py-0.5">
                <span className="text-xl font-black text-teal-950 font-serif bg-amber-100/80 py-1.5 px-6 rounded-2xl border border-amber-300/80 shadow-sm inline-block">
                  « {certificate.course_title} »
                </span>
              </div>
              <div className="flex justify-center gap-6 text-xs font-bold text-gray-800 pt-0.5">
                <span>Mention : <strong className="text-teal-950 font-black uppercase">{certificate.grade_mention}</strong></span>
                <span>•</span>
                <span>Délivré le : <strong className="text-slate-950">{new Date(certificate.issue_date).toLocaleDateString('fr-FR')}</strong></span>
              </div>
            </div>

            {/* Signatures & QR Code Securisé */}
            <div className="pt-3 grid grid-cols-3 items-end text-left text-xs gap-4 border-t-2 border-teal-900/40 relative">
              {/* Cachet & Sceau Officiel */}
              {stampUrl && (
                <div className="absolute inset-x-0 bottom-1 flex items-center justify-center opacity-35 pointer-events-none">
                  <img src={stampUrl} alt="Sceau Officiel" className="w-28 h-28 object-contain" />
                </div>
              )}

              {/* Signataire 1: Co-fondateur */}
              <div className="space-y-0.5 z-10">
                <div className="font-extrabold text-slate-950 text-[11px]">Le Directeur des Campus & Co-fondateur</div>
                {sigCoUrl ? (
                  <img src={sigCoUrl} alt="Signature Idrissa Souaré" className="h-11 w-auto object-contain py-0.5" />
                ) : (
                  <div className="font-serif italic text-teal-950 text-sm font-bold pt-1">M. Idrissa Souaré</div>
                )}
                <div className="text-[9px] font-mono text-gray-600 font-bold">Signé Numériquement</div>
              </div>

              {/* QR Code & Verification Badge */}
              <div className="text-center space-y-0.5 z-10">
                <div className="w-16 h-16 bg-white border-2 border-amber-400 p-1 rounded-xl mx-auto shadow-md flex items-center justify-center">
                  <img src={qrDataUrl} alt="QR Code d'Authenticité" className="w-full h-full object-contain" />
                </div>
                <div className="text-[10px] font-mono font-bold text-teal-950">
                  N° {certificate.serial_number}
                </div>
                <div className="text-[9px] text-emerald-800 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Certifié METFP / GUINÉE
                </div>
              </div>

              {/* Signataire 2: Directeur Général */}
              <div className="text-right space-y-0.5 z-10">
                <div className="font-extrabold text-slate-950 text-[11px]">Le Directeur Général & Fondateur</div>
                {sigDgUrl ? (
                  <img src={sigDgUrl} alt="Signature Alseny Tawel Camara" className="h-11 w-auto object-contain ml-auto py-0.5" />
                ) : (
                  <div className="font-serif italic text-teal-950 text-sm font-bold pt-1">M. Camara Alseny Tawel</div>
                )}
                <div className="text-[9px] font-mono text-gray-600 font-bold">Sceau Officiel ISAC MLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
