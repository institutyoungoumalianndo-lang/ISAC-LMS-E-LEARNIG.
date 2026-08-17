import type { Course, Category, Instructor, Cadre, PaymentDeclaration, CourseResource, VirtualMeeting } from './supabase';

export function initializeRealSeedData() {
  // 1. Categories
  const categories: Category[] = [
    { id: 'cat-1', name_fr: 'Informatique & Technologies', name_en: 'IT & Software', description_fr: 'Filières axées sur le développement web, mobile, génie logiciel et réseaux.', description_en: 'Software engineering, web development and networks.', icon: 'Code', display_order: 1, created_at: new Date().toISOString() },
    { id: 'cat-2', name_fr: 'Gestion, Comptabilité & Finance', name_en: 'Management & Finance', description_fr: 'Gestion d\'entreprise, comptabilité générale OHADA et gestion financière.', description_en: 'Business management and finance.', icon: 'Briefcase', display_order: 2, created_at: new Date().toISOString() },
    { id: 'cat-3', name_fr: 'Transit, Douane & Logistique', name_en: 'Logistics & Customs', description_fr: 'Logistique internationale, procédures douanières et commerce international.', description_en: 'International trade and customs procedures.', icon: 'Truck', display_order: 3, created_at: new Date().toISOString() },
    { id: 'cat-4', name_fr: 'Secrétariat & Assistariat de Direction', name_en: 'Executive Administration', description_fr: 'Bureautique avancée, secrétariat bilingue et gestion administrative.', description_en: 'Executive assistance and administration.', icon: 'FileText', display_order: 4, created_at: new Date().toISOString() },
  ];

  // 2. Instructors (Formateurs Accrédités ISAC MLS)
  const instructors: Instructor[] = [
    {
      id: 'inst-1',
      name: 'Idrissa Souaré',
      email: 'idrissa.souare@isac-mls.com',
      password: 'formateur123',
      title_fr: 'Directeur des Campus & Co-fondateur',
      title_en: 'Campus Director & Co-Founder',
      bio_fr: 'Directeur des Campus ISAC MLS, expert en gouvernance et stratégie éducative.',
      bio_en: 'Campus Director & Educational Strategy Expert.',
      photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'inst-2',
      name: 'Dr. Barry Kante',
      email: 'dr.barry@isac-mls.com',
      password: 'formateur123',
      title_fr: 'Directeur des Études & Expert Informatique',
      title_en: 'Director of Studies & IT Expert',
      bio_fr: 'Docteur en Génie Logiciel, spécialiste des architectures web et bases de données.',
      bio_en: 'PhD in Software Engineering and Cloud Computing.',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'inst-3',
      name: 'M. Camara Alseny',
      email: 'alseny.camara@isac-mls.com',
      password: 'formateur123',
      title_fr: 'Formateur Référent Comptabilité OHADA & Finance',
      title_en: 'Accounting & Finance Senior Lecturer',
      bio_fr: 'Expert-comptable agréé, consultant en gestion financière d\'entreprise.',
      bio_en: 'Certified Public Accountant and Financial Advisor.',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'inst-4',
      name: 'Mme Diallo Fatoumata',
      email: 'fatoumata.diallo@isac-mls.com',
      password: 'formateur123',
      title_fr: 'Formatrice Senior en Transit & Douane',
      title_en: 'Customs & International Logistics Expert',
      bio_fr: 'Spécialiste du commerce transfrontalier et des procédures d\'import-export au Port Autonome de Conakry.',
      bio_en: 'International Trade and Port Logistics Specialist.',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      created_at: new Date().toISOString(),
    },
  ];

  // 3. Cadres Dirigeants
  const cadres: Cadre[] = [
    { id: 'cadre-1', name: 'M. Idrissa Souaré', email: 'idrissa.souare@isac-mls.com', role_title: 'Directeur des Campus & Co-fondateur', department: 'Direction Générale', phone: '+224 620 00 00 00', created_at: new Date().toISOString() },
    { id: 'cadre-2', name: 'Dr. Barry Kante', email: 'dr.barry@isac-mls.com', role_title: 'Directeur des Études', department: 'Direction Pédagogique', phone: '+224 660 00 00 00', created_at: new Date().toISOString() },
    { id: 'cadre-3', name: 'Secrétariat Académique', email: 'secretariat@isac-mls.com', role_title: 'Secrétaire Général', department: 'Administration', phone: '+224 625 00 00 00', created_at: new Date().toISOString() },
  ];

  // 4. Courses / Filières
  const courses: Course[] = [
    {
      id: 'course-1',
      title_fr: 'Génie Informatique & Développement Web/Mobile',
      title_en: 'Software Engineering & Web/Mobile Development',
      description_fr: 'Formation certifiante complète couvrant HTML5, CSS3, JavaScript, React, Node.js, et la conception d\'applications mobiles multi-plateformes.',
      description_en: 'Comprehensive professional training in modern web and mobile software development.',
      category_id: 'cat-1',
      instructor_id: 'inst-2',
      instructor: instructors[1],
      level: 'intermediate',
      duration_hours: 600,
      duration_fr: '6 Mois',
      duration_en: '6 Months',
      diploma_type: 'CQP',
      price_gnf: 1500000,
      price: 150,
      is_featured: true,
      is_published: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'course-2',
      title_fr: 'Comptabilité, Gestion & Finance d\'Entreprise',
      title_en: 'Corporate Accounting & Financial Management',
      description_fr: 'Maîtrisez le système comptable OHADA, le bilan financier, la gestion de la paie et la fiscalité guinéenne.',
      description_en: 'Master OHADA accounting standards, corporate financial statements, and taxation.',
      category_id: 'cat-2',
      instructor_id: 'inst-3',
      instructor: instructors[2],
      level: 'intermediate',
      duration_hours: 1200,
      duration_fr: '1 An',
      duration_en: '1 Year',
      diploma_type: 'DQP',
      price_gnf: 2500000,
      price: 250,
      is_featured: true,
      is_published: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'course-3',
      title_fr: 'Transit, Douane & Logistique Internationale',
      title_en: 'Customs Transit & International Logistics',
      description_fr: 'Apprenez les déclarations en douane, les règles d\'incoterms, la gestion du fret et le dédouanement portuaire.',
      description_en: 'Learn customs declarations, incoterms, freight forwarding and port clearance.',
      category_id: 'cat-3',
      instructor_id: 'inst-4',
      instructor: instructors[3],
      level: 'beginner',
      duration_hours: 900,
      duration_fr: '9 Mois',
      duration_en: '9 Months',
      diploma_type: 'CAP',
      price_gnf: 2000000,
      price: 200,
      is_featured: true,
      is_published: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 'course-4',
      title_fr: 'Secrétariat Bureautique & Assistariat de Direction',
      title_en: 'Executive Administration & Office Automation',
      description_fr: 'Maîtrise complète de la suite Office (Word, Excel, PowerPoint), rédaction administrative et accueil professionnel.',
      description_en: 'Master Microsoft Office tools, business writing, and executive assistance.',
      category_id: 'cat-4',
      instructor_id: 'inst-1',
      instructor: instructors[0],
      level: 'beginner',
      duration_hours: 300,
      duration_fr: '3 Mois',
      duration_en: '3 Months',
      diploma_type: 'ATTESTATION',
      price_gnf: 1000000,
      price: 100,
      is_featured: false,
      is_published: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      created_at: new Date().toISOString(),
    },
  ];

  // 5. Payment Declarations (Pour tester l'interactivité dans l'Admin Dashboard)
  const declarations: PaymentDeclaration[] = [
    {
      id: 'pay-101',
      student_id: 'mamadou.bah@gmail.com',
      student_name: 'Mamadou Bah',
      student_email: 'mamadou.bah@gmail.com',
      student_phone: '+224 621 12 34 56',
      course_id: 'course-1',
      tranche: 1,
      amount_gnf: 500000,
      transaction_ref: 'OM260817.1045.B9821',
      payment_method: 'Orange Money',
      receipt_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80',
      status: 'validated',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'pay-102',
      student_id: 'aissatou.sow@gmail.com',
      student_name: 'Aïssatou Sow',
      student_email: 'aissatou.sow@gmail.com',
      student_phone: '+224 664 98 76 54',
      course_id: 'course-2',
      tranche: 1,
      amount_gnf: 833333,
      transaction_ref: 'MTN260817.1420.C3312',
      payment_method: 'MTN Mobile Money',
      receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
      status: 'pending',
      created_at: new Date(Date.now() - 36000000).toISOString(),
    },
    {
      id: 'pay-103',
      student_id: 'karamoko.toure@gmail.com',
      student_name: 'Karamoko Touré',
      student_email: 'karamoko.toure@gmail.com',
      student_phone: '+224 628 45 67 89',
      course_id: 'course-3',
      tranche: 1,
      amount_gnf: 666666,
      transaction_ref: 'KL260817.0915.D7741',
      payment_method: 'Kulu',
      receipt_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
      status: 'validated',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  // 6. Enrolled Courses for Student View
  const enrollments = [
    { id: 'enr-1', student_id: 'mamadou.bah@gmail.com', student_email: 'mamadou.bah@gmail.com', course_id: 'course-1', status: 'active', created_at: new Date().toISOString() },
    { id: 'enr-2', student_id: 'aissatou.sow@gmail.com', student_email: 'aissatou.sow@gmail.com', course_id: 'course-2', status: 'pending', created_at: new Date().toISOString() },
    { id: 'enr-3', student_id: 'karamoko.toure@gmail.com', student_email: 'karamoko.toure@gmail.com', course_id: 'course-3', status: 'active', created_at: new Date().toISOString() },
    { id: 'enr-default', student_id: 'etudiant@isac-mls.com', student_email: 'etudiant@isac-mls.com', course_id: 'course-1', status: 'active', created_at: new Date().toISOString() },
  ];

  // 7. Course Resources
  const resources: CourseResource[] = [
    {
      id: 'res-101',
      course_id: 'course-1',
      title: 'Module 1 : HTML5, CSS3 & Architecture Web Moderne',
      description: 'Support de cours théorique, guide d\'exercices et code source du projet pratique.',
      type: 'video',
      file_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      unlocked_at_tranche: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'res-102',
      course_id: 'course-2',
      title: 'Guide Officiel du Système Comptable OHADA II (PDF)',
      description: 'Manuel officiel de comptabilité générale et exercices corrigés du plan comptable.',
      type: 'document',
      file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      unlocked_at_tranche: 1,
      created_at: new Date().toISOString(),
    },
  ];

  // 8. Virtual Meetings
  const meetings: VirtualMeeting[] = [
    {
      id: 'meet-101',
      title: 'Classe Virtuelle en direct : Architecture des Applications Web avec React',
      description: 'Session de cours interactif avec Dr. Barry Kante, présentation des projets et questions-réponses.',
      course_id: 'course-1',
      meeting_url: 'https://meet.jit.si/ISAC-MLS-Genie-Informatique-Live',
      start_time: new Date(Date.now() + 7200000).toISOString(),
      duration_minutes: 90,
      status: 'live',
      created_at: new Date().toISOString(),
    },
    {
      id: 'meet-102',
      title: 'Atelier Pratique : Procédures de Dédouanement au Port Autonome de Conakry',
      description: 'Session en direct avec Mme Diallo Fatoumata sur le calcul des droits de douane et incoterms.',
      course_id: 'course-3',
      meeting_url: 'https://meet.jit.si/ISAC-MLS-Transit-Douane-Live',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 60,
      status: 'upcoming',
      created_at: new Date().toISOString(),
    },
  ];

  // Save to localStorage ONLY IF NOT ALREADY POPULATED (Preserves user & admin edits until modified)
  if (!localStorage.getItem('isac_lms_courses')) localStorage.setItem('isac_lms_courses', JSON.stringify(courses));
  if (!localStorage.getItem('isac_lms_categories')) localStorage.setItem('isac_lms_categories', JSON.stringify(categories));
  if (!localStorage.getItem('isac_lms_instructors')) localStorage.setItem('isac_lms_instructors', JSON.stringify(instructors));
  if (!localStorage.getItem('isac_lms_cadres')) localStorage.setItem('isac_lms_cadres', JSON.stringify(cadres));
  if (!localStorage.getItem('isac_lms_payment_declarations')) localStorage.setItem('isac_lms_payment_declarations', JSON.stringify(declarations));
  if (!localStorage.getItem('isac_lms_enrollments')) localStorage.setItem('isac_lms_enrollments', JSON.stringify(enrollments));
  if (!localStorage.getItem('isac_lms_resources')) localStorage.setItem('isac_lms_resources', JSON.stringify(resources));
  if (!localStorage.getItem('isac_lms_virtual_meetings')) localStorage.setItem('isac_lms_virtual_meetings', JSON.stringify(meetings));
}
