import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://isaclearning.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.dummyanonkeyisac';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Category = {
  id: string;
  name_fr: string;
  name_en: string;
  description_fr: string | null;
  description_en: string | null;
  icon: string | null;
  display_order: number;
  created_at: string;
};

export type Instructor = {
  id: string;
  name: string;
  email?: string | null;
  password?: string | null;
  title_fr: string | null;
  title_en: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  photo_url: string | null;
  assigned_course_id?: string | null;
  created_at: string;
};

export type Cadre = {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  role_title: string;
  department: string;
  phone?: string | null;
  avatar_url?: string | null;
  created_at: string;
};

export type Course = {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string | null;
  description_en: string | null;
  category_id: string | null;
  instructor_id: string | null;
  level: string;
  duration_hours: number | null;
  duration_fr?: string | null;
  duration_en?: string | null;
  price: number | null;
  price_gnf?: number | null;
  diploma_type?: 'ATTESTATION' | 'CQP' | 'DQP' | 'CAP' | string | null;
  tranche_1_deadline?: string | null;
  tranche_2_deadline?: string | null;
  tranche_3_deadline?: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  category?: Category | null;
  instructor?: Instructor | null;
};

export type CourseCategory = Category;

export type PaymentTrancheNumber = 1 | 2 | 3;
export type PaymentStatus = 'pending' | 'validated' | 'rejected';

export type PaymentDeclaration = {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone?: string | null;
  course_id: string;
  tranche: PaymentTrancheNumber;
  amount_gnf: number;
  transaction_ref: string;
  payment_method: 'Orange Money' | 'MTN Mobile Money' | 'Kulu' | 'PayCard' | 'Cash Moov' | 'Virement' | 'Autre';
  receipt_url?: string | null;
  status: PaymentStatus;
  admin_notes?: string | null;
  created_at: string;
  validated_at?: string | null;
  course?: Course | null;
};

export type VirtualMeeting = {
  id: string;
  title: string;
  description?: string | null;
  course_id: string;
  instructor_id?: string | null;
  meeting_url: string;
  start_time: string;
  duration_minutes: number;
  is_private_cadre?: boolean;
  status: 'upcoming' | 'live' | 'completed';
  created_at: string;
  course?: Course | null;
  instructor?: Instructor | null;
};

export type ResourceType = 'video' | 'photo' | 'document' | 'exam';

export type CourseResource = {
  id: string;
  course_id: string;
  instructor_id?: string | null;
  title: string;
  description?: string | null;
  type: ResourceType;
  file_url: string;
  file_name?: string | null;
  file_size?: string | null;
  unlocked_at_tranche: PaymentTrancheNumber;
  created_at: string;
};

export type VaultDocument = {
  id: string;
  title: string;
  category: 'Administratif' | 'Financier' | 'Pédagogique' | 'Décisions Bureau' | 'Procès-Verbal';
  description?: string | null;
  file_url: string;
  file_name: string;
  file_size?: string | null;
  uploaded_by: string;
  is_encrypted: boolean;
  created_at: string;
};

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  cover_url?: string | null;
  file_url: string;
  description?: string | null;
  format: 'PDF' | 'ePub' | 'Audio';
  created_at: string;
};

export type ExamSubmission = {
  id: string;
  student_name: string;
  student_email: string;
  course_id: string;
  exam_title: string;
  submission_url: string;
  status: 'submitted' | 'graded' | 'revision';
  grade?: number | null; // Note sur 20
  feedback?: string | null;
  submitted_at: string;
  graded_at?: string | null;
};

export type Certificate = {
  id: string;
  serial_number: string;
  student_id?: string;
  student_name: string;
  student_email?: string;
  course_id?: string;
  course_title: string;
  issue_date: string;
  grade_mention: 'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien' | 'Excellence' | string;
  signature_url?: string | null;
  qr_code_data: string;
};

export type Article = {
  id: string;
  title_fr: string;
  title_en?: string | null;
  content_fr: string;
  content_en?: string | null;
  cover_image_url?: string | null;
  media_url?: string | null;
  media_type?: 'photo' | 'video';
  published_at: string;
  author_name: string;
  facebook_share_url?: string | null;
  linkedin_share_url?: string | null;
  twitter_share_url?: string | null;
  whatsapp_share_url?: string | null;
  is_published: boolean;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_title_fr: string | null;
  author_title_en: string | null;
  content_fr: string;
  content_en: string;
  avatar_url: string | null;
  rating: number;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  site_name: string;
  logo_url?: string | null;
  ministry_logo_url?: string | null;
  creation_approval_num?: string | null;
  opening_approval_num?: string | null;
  hero_background_url?: string | null;
  signature_dg_url?: string | null;
  signature_cofondateur_url?: string | null;
  stamp_url?: string | null;
  admin_email?: string | null;
  admin_password?: string | null;
  tagline_fr: string;
  tagline_en: string;
  hero_title_fr: string | null;
  hero_title_en: string | null;
  hero_subtitle_fr: string | null;
  hero_subtitle_en: string | null;
  about_fr: string | null;
  about_en: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  admin_orange_money?: string | null;
  admin_mtn_money?: string | null;
  admin_kulu_money?: string | null;
  admin_paycard_money?: string | null;
  admin_cashmoov_money?: string | null;
  whatsapp_group_url?: string | null;
  whatsapp_contact_phone?: string | null;
  address_fr: string | null;
  address_en: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  updated_at: string;
};
