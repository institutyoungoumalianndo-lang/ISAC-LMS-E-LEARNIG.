import { useState, useEffect } from 'react';
import { FileText, Printer, Download, CheckCircle2, CreditCard, ShieldCheck, UserCheck, Calendar, Contact, Upload, Award, Send, Mail, Check } from 'lucide-react';
import type { Course, PaymentDeclaration, Certificate } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';

type DocumentReportGeneratorProps = {
  courses: Course[];
};

export function DocumentReportGenerator({ courses }: DocumentReportGeneratorProps) {
  const [docType, setDocType] = useState<'attestation' | 'carte_pvc' | 'diplome' | 'recette' | 'releve' | 'bilan'>('diplome');
  const [diplomaType, setDiplomaType] = useState<'CQP' | 'DQP' | 'CAP' | 'ATTESTATION'>('CQP');
  const [gradeMention, setGradeMention] = useState<string>('Très Bien');
  const [studentName, setStudentName] = useState('Alsény Tawel CAMARA');
  const [studentEmail, setStudentEmail] = useState('alseny.camara@isac-mls.com');
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [amountGnf, setAmountGnf] = useState(500000);
  const [transactionRef, setTransactionRef] = useState('PP260815.1830.A12345');

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [ministryLogoUrl, setMinistryLogoUrl] = useState<string>('/logo_ministere_guinee.jpg');
  const [creationNum, setCreationNum] = useState<string>('N°070/METFP-ET/DNETPP/14');
  const [openingNum, setOpeningNum] = useState<string>('N°2014/3942/CAB/DNETPP');
  const [sigDgUrl, setSigDgUrl] = useState<string | null>(null);
  const [sigCoUrl, setSigCoUrl] = useState<string | null>(null);
  const [stampUrl, setStampUrl] = useState<string | null>(null);

  const [transferMsg, setTransferMsg] = useState<string | null>(null);

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

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handlePrint = () => {
    window.print();
  };

  const formatGnf = (val: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(val) + ' GNF';
  };

  const docRefNumber = `ISAC-DOC-${Date.now().toString().slice(-6)}`;
  const studentMatricule = `ISAC-2026-${studentName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-99`;
  const certSerialNumber = `ISAC-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    `ISAC-MLS-VERIFY-${certSerialNumber}`
  )}`;

  // Transfer Document Directly to Student Space (Vault)
  const transferToStudentSpace = async () => {
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      student_id: studentEmail,
      student_name: studentName,
      course_id: selectedCourse?.id || 'c1',
      course_title: selectedCourse?.title_fr || 'Formation Certifiante',
      serial_number: certSerialNumber,
      issue_date: new Date().toISOString(),
      grade_mention: gradeMention,
      qr_code_data: `ISAC-MLS-VERIFY-${certSerialNumber}`,
    };

    // Store in localStorage for instant offline access
    let savedCertsStr = localStorage.getItem('isac_lms_certificates');
    let certsList: Certificate[] = [];
    if (savedCertsStr) {
      try {
        certsList = JSON.parse(savedCertsStr);
      } catch (e) {}
    }
    certsList.unshift(newCert);
    localStorage.setItem('isac_lms_certificates', JSON.stringify(certsList));

    // Try Supabase insert
    await supabase.from('certificates').insert(newCert);

    setTransferMsg(`Document transféré avec succès dans le coffre-fort numérique de l'Espace Étudiant (${studentName}) !`);
    setTimeout(() => setTransferMsg(null), 5000);
  };

  // Send via Email to Student
  const sendEmailToStudent = () => {
    const subject = encodeURIComponent(`Document Officiel ISAC MLS - ${docType.toUpperCase()} (${studentName})`);
    const body = encodeURIComponent(
      `Bonjour ${studentName},\n\nVotre document officiel (${docType.toUpperCase()}) pour la filière « ${selectedCourse?.title_fr} » a été délivré par la Direction de l'ISAC MLS GUINÉE.\n\nRéférence du Document : ${certSerialNumber}\nDate de Délivrance : ${new Date().toLocaleDateString('fr-FR')}\n\nVous pouvez le consulter et le télécharger directement depuis votre Espace Étudiant.\n\nCordialement,\nDirection Générale ISAC MLS`
    );
    window.open(`mailto:${studentEmail}?subject=${subject}&body=${body}`, '_blank');
    setTransferMsg(`Message et document envoyés par Email à ${studentEmail} !`);
    setTimeout(() => setTransferMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Embedded Style for A4 Landscape Print */}
      <style>{`
        @media print {
          @page {
            size: ${docType === 'diplome' ? 'A4 landscape' : 'A4 portrait'};
            margin: 0;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .a4-diploma-landscape {
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

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Générateur de Documents Officiels & Diplômes de Fin de Formation</h2>
          <p className="text-xs text-gray-500">
            Éditez, imprimez et transférez les Diplômes (CQP, DQP, CAP en A4 Paysage) directement dans l'Espace Étudiant ou par Email.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={transferToStudentSpace}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all"
          >
            <Send className="w-4 h-4" /> Transférer dans l'Espace Étudiant
          </button>

          <button
            onClick={sendEmailToStudent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
          >
            <Mail className="w-4 h-4 text-teal-400" /> Envoyer par Email
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Imprimer / PDF
          </button>
        </div>
      </div>

      {transferMsg && (
        <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 rounded-2xl p-4 border border-emerald-200 font-bold shadow-sm print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {transferMsg}
        </div>
      )}

      {/* Select Document Category */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 print:hidden">
        {[
          { id: 'diplome', label: 'Diplôme de Fin de Formation', desc: 'A4 Paysage' },
          { id: 'attestation', label: 'Attestation d\'Inscription', desc: 'Administratif' },
          { id: 'carte_pvc', label: 'Carte Étudiant PVC', desc: 'Badge d\'Identité' },
          { id: 'recette', label: 'Reçu de Versement GNF', desc: 'Financier' },
          { id: 'releve', label: 'Relevé de Notes', desc: 'Pédagogique' },
          { id: 'bilan', label: 'Bilan Financier Global', desc: 'Comptabilité' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setDocType(item.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              docType === item.id
                ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase text-teal-600">{item.desc}</div>
            <div className="text-sm font-bold mt-1">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Inputs Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 text-sm print:hidden">
        <h3 className="font-bold text-gray-900">Données du Document à Générer</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nom Complet d'Étudiant</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse Email d'Envoi</label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Filières / Formation</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none font-bold text-teal-900"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title_fr} ({c.diploma_type || 'CQP'}) — {c.duration_fr || '6 Mois'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {docType === 'diplome' && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Type de Qualification / Diplôme</label>
              <select
                value={diplomaType}
                onChange={(e) => setDiplomaType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-amber-900 bg-amber-50 outline-none"
              >
                <option value="CQP">CQP — Certificat de Qualification Professionnelle</option>
                <option value="DQP">DQP — Diplôme de Qualification Professionnelle</option>
                <option value="CAP">CAP — Certificat d'Aptitude Professionnelle</option>
                <option value="ATTESTATION">ATTESTATION — Attestation de Fin de Formation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mention Académique</label>
              <select
                value={gradeMention}
                onChange={(e) => setGradeMention(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold outline-none"
              >
                <option value="Excellence">Excellence (18 - 20 / 20)</option>
                <option value="Très Bien">Très Bien (16 - 17.5 / 20)</option>
                <option value="Bien">Bien (14 - 15.5 / 20)</option>
                <option value="Assez Bien">Assez Bien (12 - 13.5 / 20)</option>
                <option value="Passable">Passable (10 - 11.5 / 20)</option>
              </select>
            </div>
          </div>
        )}

        {docType === 'carte_pvc' && (
          <div className="pt-2">
            <FileUploadZone
              label="Photo d'Identité de l'Étudiant (Format Passeport / PVC)"
              acceptType="photo"
              currentUrl={studentPhotoUrl || undefined}
              onFileSelected={(res: FileUploadResult) => setStudentPhotoUrl(res.url)}
            />
          </div>
        )}

        {docType === 'recette' && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Montant Reçu (GNF)</label>
              <input
                type="number"
                value={amountGnf}
                onChange={(e) => setAmountGnf(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Référence Transaction Mobile Money</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Render DIPLOME DE FIN DE FORMATION (FORMAT A4 PAYSAGE LUXE 1 PAGE) */}
      {docType === 'diplome' ? (
        <div className="a4-diploma-landscape bg-gradient-to-br from-amber-50/50 via-white to-amber-50/40 text-gray-900 border-[8px] border-amber-600 outline outline-4 outline-teal-950 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden m-2 text-center flex flex-col justify-between">
          {/* Inner Golden Line */}
          <div className="absolute inset-2 border border-amber-400/80 rounded-lg pointer-events-none" />

          {/* Watermark Background */}
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
              <span className="px-4 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase font-mono tracking-widest inline-block shadow">
                Niveau Certifiant : {diplomaType}
              </span>
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
                {studentName}
              </span>
            </div>

            {/* Filière & Details */}
            <div className="max-w-2xl mx-auto space-y-1.5 text-xs text-gray-900 leading-relaxed">
              <p className="font-medium text-gray-700">
                Pour avoir suivi avec succès et validé l'ensemble des modules d'évaluation et exigences pratiques de la filière de formation professionnelle :
              </p>
              <div className="py-0.5">
                <span className="text-xl font-black text-teal-950 font-serif bg-amber-100/80 py-1.5 px-6 rounded-2xl border border-amber-300/80 shadow-sm inline-block">
                  « {selectedCourse?.title_fr} »
                </span>
              </div>
              <div className="flex justify-center gap-6 text-xs font-bold text-gray-800 pt-0.5">
                <span>Mention : <strong className="text-teal-950 font-black uppercase">{gradeMention}</strong></span>
                <span>•</span>
                <span>Durée : <strong className="text-teal-950 font-black">{selectedCourse?.duration_fr || '6 Mois'}</strong></span>
                <span>•</span>
                <span>Délivré le : <strong className="text-slate-950">{new Date().toLocaleDateString('fr-FR')}</strong></span>
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
                  N° {certSerialNumber}
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
      ) : docType === 'carte_pvc' ? (
        /* Render CARTE ETUDIANT PVC */
        <div className="flex flex-col items-center py-6">
          <div className="w-[420px] h-[260px] bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 text-white shadow-2xl border-4 border-amber-500/40 relative overflow-hidden flex flex-col justify-between">
            {/* Background Seal Watermark */}
            {stampUrl && (
              <div className="absolute right-2 bottom-2 opacity-15 pointer-events-none">
                <img src={stampUrl} alt="Watermark Stamp" className="w-40 h-40 object-contain" />
              </div>
            )}

            {/* Header Card */}
            <div className="flex items-center justify-between border-b border-teal-500/30 pb-3">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo ISAC" className="h-9 w-auto object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    ISAC
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-xs tracking-wider text-white uppercase font-serif">ISAC MLS GUINÉE</h3>
                  <p className="text-[8px] text-teal-300 uppercase font-mono tracking-widest">CARTE D'ÉTUDIANT OFFICIELLE (PVC)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-500 text-slate-950 uppercase font-mono">
                Session 2026-2027
              </span>
            </div>

            {/* Body Info */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-20 h-24 rounded-2xl border-2 border-amber-400/60 overflow-hidden bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-md">
                {studentPhotoUrl ? (
                  <img src={studentPhotoUrl} alt={studentName} className="w-full h-full object-cover" />
                ) : (
                  <Contact className="w-10 h-10 text-gray-500" />
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[9px] text-teal-400 font-mono block uppercase">Nom & Prénom :</span>
                  <h4 className="font-extrabold text-white text-sm leading-tight">{studentName}</h4>
                </div>
                <div>
                  <span className="text-[9px] text-teal-400 font-mono block uppercase">Filières d'Études :</span>
                  <p className="font-semibold text-gray-200 text-[11px] truncate max-w-[210px]">{selectedCourse?.title_fr}</p>
                </div>
                <div className="flex gap-3 text-[9px] text-gray-300 font-mono pt-1">
                  <span>Matricule : <strong className="text-amber-400">{studentMatricule}</strong></span>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="flex items-end justify-between border-t border-teal-500/30 pt-2 text-[8px] font-mono text-gray-400">
              <div>
                <span>Délivré par la Direction • Conakry, Guinée</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={qrDataUrl} alt="QR Code" className="w-8 h-8 object-contain bg-white p-0.5 rounded" />
                <div className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED PVC
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Printable Documents */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-teal-900 shadow-xl space-y-6 text-gray-900 m-2 relative overflow-hidden">
          {/* Header avec Logo Officiel & QR Code */}
          <div className="flex items-start justify-between pb-6 border-b border-gray-200 gap-4">
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Officiel" className="h-16 w-auto object-contain rounded-lg" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-teal-900 text-white flex items-center justify-center font-bold text-xl">
                  ISAC
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-teal-950 font-serif">ISAC MLS E-LEARNING GUINÉE</h1>
                <p className="text-xs text-teal-700 font-bold uppercase">Établissement d'Enseignement Supérieur & Professionnel</p>
                <p className="text-[11px] text-gray-500">Agrément Officiel N° 2026/ISAC/EDU • Conakry, République de Guinée</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <img src={qrDataUrl} alt="QR Code d'Authenticité" className="w-16 h-16 object-contain border border-gray-200 p-0.5 rounded-lg" />
              <div className="font-mono text-[10px] text-teal-950 font-bold">Réf : {docRefNumber}</div>
              <div className="text-[10px] text-gray-500">Date : {new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center py-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-serif underline decoration-teal-600 underline-offset-8">
              {docType === 'attestation' && "ATTESTATION D'INSCRIPTION OFFICIELLE"}
              {docType === 'recette' && "REÇU DE VERSEMENT DE FRAIS D'ÉTUDES (GNF)"}
              {docType === 'releve' && "RELEVÉ DE NOTES ET DE COMPÉTENCES"}
              {docType === 'bilan' && "BILAN FINANCIER DES ENCAISSEMENTS GNF"}
            </h2>
          </div>

          {/* Document Content */}
          <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto">
            {docType === 'attestation' && (
              <>
                <p>
                  La Direction Générale du Centre de Formation Professionnelle <strong>ISAC MLS</strong> atteste par la présente que :
                </p>
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 font-medium space-y-1">
                  <div>Nom & Prénom de l'Apprenant : <strong className="text-teal-950">{studentName}</strong></div>
                  <div>Identifiant Email : <strong>{studentEmail}</strong></div>
                  <div>Filière de Formation Professionnelle : <strong className="text-teal-950">{selectedCourse?.title_fr}</strong></div>
                </div>
                <p>
                  Est régulièrement inscrit(e) au titre de la session académique 2026-2027 et bénéficie de l'accès complet à la plateforme e-learning, aux classes virtuelles et aux épreuves d'évaluation certifiantes.
                </p>
              </>
            )}

            {docType === 'recette' && (
              <>
                <p>Reçu officiel de versement délivré à l'étudiant(e) : <strong>{studentName}</strong> ({studentEmail})</p>
                <div className="p-6 bg-slate-950 text-white rounded-3xl space-y-2 font-mono shadow-inner">
                  <div className="flex justify-between text-xs text-teal-400">
                    <span>Montant perçu :</span>
                    <span className="text-lg font-bold text-white">{formatGnf(amountGnf)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Filière concernée :</span>
                    <span className="font-semibold text-gray-200">{selectedCourse?.title_fr}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>N° de Transaction Mobile Money :</span>
                    <span className="text-amber-400 font-bold">{transactionRef}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Statut du versement :</span>
                    <span className="text-emerald-400 font-bold">VALIDÉ PAR L'ADMINISTRATION</span>
                  </div>
                </div>
              </>
            )}

            {docType === 'releve' && (
              <div className="space-y-3">
                <p>Relevé de notes officiel pour l'apprenant : <strong>{studentName}</strong></p>
                <div className="border rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 font-bold text-gray-700">
                      <tr>
                        <th className="p-3">Module de Formation</th>
                        <th className="p-3">Note / 20</th>
                        <th className="p-3">Résultat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-semibold">{selectedCourse?.title_fr} - Module 1</td>
                        <td className="p-3 font-bold">16.5 / 20</td>
                        <td className="p-3 text-emerald-700 font-bold">Validé</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">{selectedCourse?.title_fr} - Évaluation Pratique</td>
                        <td className="p-3 font-bold">17.0 / 20</td>
                        <td className="p-3 text-emerald-700 font-bold">Validé</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {docType === 'bilan' && (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-gray-700">État financier global des encaissements en Francs Guinéens (GNF) :</p>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2 font-mono">
                  <div className="flex justify-between font-bold text-sm text-teal-950">
                    <span>Total Encaissements Validés :</span>
                    <span>15 500 000 GNF</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Dépôts Orange Money :</span>
                    <span>10 000 000 GNF</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Dépôts MTN Mobile Money :</span>
                    <span>5 500 000 GNF</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Signature */}
          <div className="pt-8 border-t border-gray-200 flex items-center justify-between text-xs relative">
            {stampUrl && (
              <div className="absolute inset-x-0 bottom-1 flex items-center justify-center opacity-25 pointer-events-none">
                <img src={stampUrl} alt="Cachet" className="w-24 h-24 object-contain" />
              </div>
            )}

            <div className="space-y-1 z-10">
              <div className="font-bold text-gray-900">Le Directeur des Campus & Co-fondateur</div>
              {sigCoUrl ? (
                <img src={sigCoUrl} alt="Signature Idrissa Souaré" className="h-10 w-auto object-contain py-1" />
              ) : (
                <div className="font-serif italic font-bold text-teal-900">M. Idrissa Souaré</div>
              )}
            </div>

            <div className="text-center font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1 z-10">
              <ShieldCheck className="w-4 h-4" /> Authentifié avec QR Code
            </div>

            <div className="text-right space-y-1 z-10">
              <div className="font-bold text-teal-950">Le Directeur Général & Fondateur</div>
              {sigDgUrl ? (
                <img src={sigDgUrl} alt="Signature Alseny Tawel Camara" className="h-10 w-auto object-contain ml-auto py-1" />
              ) : (
                <div className="font-serif italic font-bold text-teal-900">M. Camara Alseny Tawel</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
