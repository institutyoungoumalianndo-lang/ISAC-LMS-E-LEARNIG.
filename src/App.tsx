import { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { supabase, type Course, type Category, type Instructor, type Testimonial, type SiteSettings } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { FeaturedCourses } from '@/components/sections/FeaturedCourses';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { CoursesPage } from '@/components/CoursesPage';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { StudentAuth } from '@/components/StudentAuth';
import { StudentDashboard } from '@/components/StudentDashboard';
import { InstructorDashboard } from '@/components/instructor/InstructorDashboard';
import { FormateurAuthModal } from '@/components/instructor/FormateurAuthModal';
import { CadreAuthModal } from '@/components/cadre/CadreAuthModal';
import { CadreDashboard } from '@/components/cadre/CadreDashboard';
import { ArticlesSection } from '@/components/sections/ArticlesSection';
import { initializeRealSeedData } from '@/lib/seedData';

type Page = 'home' | 'courses' | 'about' | 'contact' | 'login' | 'admin' | 'formateur' | 'cadre' | 'student' | 'student-dashboard';

function AppContent() {
  const { t } = useLanguage();
  const { session, loading, isAdmin, isFormateur, isCadre } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const loadData = useCallback(async () => {
    const [coursesRes, catRes, instRes, testRes, settingsRes] = await Promise.all([
      supabase.from('courses').select('*, category:categories(*), instructor:instructors(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
      supabase.from('instructors').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('*').maybeSingle(),
    ]);

    // Courses fallback
    let cList: Course[] = [];
    if (coursesRes.data && coursesRes.data.length > 0) {
      cList = coursesRes.data;
    } else {
      const savedStr = localStorage.getItem('isac_lms_courses');
      if (savedStr) {
        try { cList = JSON.parse(savedStr); } catch (e) {}
      }
    }
    setCourses(cList);

    // Categories fallback
    let catList: Category[] = [];
    if (catRes.data && catRes.data.length > 0) {
      catList = catRes.data;
    } else {
      const savedStr = localStorage.getItem('isac_lms_categories');
      if (savedStr) {
        try { catList = JSON.parse(savedStr); } catch (e) {}
      }
    }
    setCategories(catList);

    // Instructors fallback
    let iList: Instructor[] = [];
    if (instRes.data && instRes.data.length > 0) {
      iList = instRes.data;
    } else {
      const savedStr = localStorage.getItem('isac_lms_instructors');
      if (savedStr) {
        try { iList = JSON.parse(savedStr); } catch (e) {}
      }
    }
    setInstructors(iList);

    // Testimonials fallback
    if (testRes.data) setTestimonials(testRes.data);

    // Settings fallback
    const defaultSettings: Partial<SiteSettings> = {
      site_name: 'ISAC MLS',
      contact_email: 'contact@isac-mls.com',
      contact_phone: '+224 620 00 00 00',
      address_fr: 'Conakry, République de Guinée',
      address_en: 'Conakry, Republic of Guinea',
      admin_orange_money: '+224 620 00 00 00',
      admin_mtn_money: '+224 660 00 00 00',
      admin_kulu_money: '+224 625 00 00 00',
      admin_paycard_money: '+224 657 00 00 00',
      admin_cashmoov_money: '+224 628 00 00 00',
      whatsapp_contact_phone: '+224 620 00 00 00',
      whatsapp_group_url: 'https://chat.whatsapp.com/ISAC-MLS-Guinee-Official-2026',
      tagline_fr: 'Institut Supérieur Agréé & Centre de Formation Professionnelle',
      hero_title_fr: 'Formations Professionnelles & Certifiantes en Guinée',
    };

    let activeSettings: any = { ...defaultSettings };
    if (settingsRes.data) activeSettings = { ...activeSettings, ...settingsRes.data };

    const savedLocalStr = localStorage.getItem('isac_lms_settings');
    if (savedLocalStr) {
      try {
        const parsed = JSON.parse(savedLocalStr);
        activeSettings = { ...activeSettings, ...parsed };
      } catch (e) {}
    }

    setSettings(activeSettings);
  }, []);

  useEffect(() => {
    initializeRealSeedData();
    loadData();
    window.addEventListener('isac_settings_updated', loadData);
    return () => window.removeEventListener('isac_settings_updated', loadData);
  }, [loadData]);

  const handleNavigate = (target: string) => {
    setSelectedCategory(null);
    if (target === 'home') {
      setPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'courses') {
      setPage('courses');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'about') {
      setPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'contact') {
      setPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'login') {
      setPage('login');
    } else if (target === 'formateur') {
      setPage('formateur');
    } else if (target === 'cadre') {
      setPage('cadre');
    } else if (target === 'student') {
      setPage('student');
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStudentAuth = () => setPage('student');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  // 1. Explicit Formateur Page Route
  if (page === 'formateur') {
    if (session && (isFormateur || session?.user?.user_metadata?.role === 'formateur')) {
      return <InstructorDashboard onExit={() => setPage('home')} />;
    }
    return <FormateurAuthModal onSuccess={() => setPage('formateur')} onBack={() => setPage('home')} />;
  }

  // 2. Explicit Cadre Page Route
  if (page === 'cadre') {
    if (session && (isCadre || session?.user?.user_metadata?.role === 'cadre')) {
      return <CadreDashboard onExit={() => setPage('home')} />;
    }
    return <CadreAuthModal onSuccess={() => setPage('cadre')} onBack={() => setPage('home')} />;
  }

  // 3. Admin View
  if (page === 'login' || page === 'admin') {
    if (session && isAdmin) {
      return <AdminDashboard onExit={() => setPage('home')} />;
    }
    if (page === 'login') {
      return <AdminLogin onSuccess={() => setPage('admin')} onBack={() => setPage('home')} />;
    }
  }

  // 4. Student Auth & Dashboard Views
  if (page === 'student' && !session) {
    return <StudentAuth onSuccess={() => setPage('student-dashboard')} onBack={() => setPage('home')} />;
  }

  if (page === 'student-dashboard' && session) {
    return <StudentDashboard onExit={() => setPage('home')} onBrowse={() => handleNavigate('courses')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} currentPage={page} />

      {page === 'home' && (
        <main>
          <Hero settings={settings} onExplore={() => handleNavigate('courses')} onAbout={() => handleNavigate('about')} />
          <CategoriesSection categories={categories} onSelectCategory={handleSelectCategory} />
          <FeaturedCourses courses={courses} onViewAll={() => handleNavigate('courses')} onEnrollLogin={goToStudentAuth} />
          <ArticlesSection />
          <TestimonialsSection testimonials={testimonials} />
        </main>
      )}

      {page === 'courses' && (
        <CoursesPage
          courses={courses}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onEnrollLogin={goToStudentAuth}
        />
      )}

      {page === 'about' && <AboutSection settings={settings} instructors={instructors} />}
      {page === 'contact' && <ContactSection settings={settings} />}

      <Footer onNavigate={handleNavigate} settings={settings} categories={categories} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
