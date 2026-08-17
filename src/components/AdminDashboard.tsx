import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, BookOpen, FolderTree, Users, MessageSquare, Settings, LogOut, Menu, X, CreditCard, Video, ShieldCheck, FileCheck, Library, Printer } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase, type Course, type Category, type Instructor, type Testimonial, type SiteSettings } from '@/lib/supabase';
import { CoursesAdmin } from './admin/CoursesAdmin';
import { CategoriesAdmin } from './admin/CategoriesAdmin';
import { InstructorsAdmin } from './admin/InstructorsAdmin';
import { TestimonialsAdmin } from './admin/TestimonialsAdmin';
import { SettingsAdmin } from './admin/SettingsAdmin';
import { PaymentValidationAdmin } from './admin/PaymentValidationAdmin';
import { VirtualClassroom } from './classroom/VirtualClassroom';
import { DocumentReportGenerator } from './admin/DocumentReportGenerator';
import { DigitalLibrary } from './library/DigitalLibrary';
import { ExamCorrectionModule } from './exam/ExamCorrectionModule';
import { WhatsAppBroadcastCenter } from './common/WhatsAppBroadcastCenter';
import { ArticlesAdmin } from './admin/ArticlesAdmin';
import { CadresAdmin } from './admin/CadresAdmin';

type AdminDashboardProps = {
  onExit: () => void;
};

type Tab = 'overview' | 'payments' | 'articles' | 'whatsapp' | 'courses' | 'instructors' | 'cadres' | 'exam-correction' | 'docs' | 'library' | 'meetings' | 'categories' | 'testimonials' | 'settings';

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const { t } = useLanguage();
  const { signOut, session } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

    if (coursesRes.data) setCourses(coursesRes.data);
    if (catRes.data) setCategories(catRes.data);

    // Merge with local instructors if any
    const savedInstStr = localStorage.getItem('isac_lms_instructors');
    let mergedInst = instRes.data || [];
    if (savedInstStr) {
      try {
        const localList = JSON.parse(savedInstStr);
        const ids = new Set(mergedInst.map((i) => i.id));
        localList.forEach((li: any) => {
          if (!ids.has(li.id)) mergedInst.push(li);
        });
      } catch (e) {}
    }
    setInstructors(mergedInst);

    if (testRes.data) setTestimonials(testRes.data);
    if (settingsRes.data) setSettings(settingsRes.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  const navItems = [
    { id: 'overview' as Tab, icon: LayoutDashboard, label: t('admin_dashboard') },
    { id: 'payments' as Tab, icon: CreditCard, label: 'Validation Paiements GNF' },
    { id: 'articles' as Tab, icon: MessageSquare, label: 'Articles & Posts Médias' },
    { id: 'whatsapp' as Tab, icon: MessageSquare, label: 'Cellule Com WhatsApp' },
    { id: 'exam-correction' as Tab, icon: FileCheck, label: 'Correction & Notes Examens' },
    { id: 'docs' as Tab, icon: Printer, label: 'Générateur de Documents' },
    { id: 'courses' as Tab, icon: BookOpen, label: 'Filières & Formations' },
    { id: 'instructors' as Tab, icon: Users, label: 'Formateurs & Comptes' },
    { id: 'cadres' as Tab, icon: ShieldCheck, label: 'Comptes Cadres & Direction' },
    { id: 'library' as Tab, icon: Library, label: 'Bibliothèque Numérique' },
    { id: 'meetings' as Tab, icon: Video, label: 'Classe Virtuelle & Réunions' },
    { id: 'categories' as Tab, icon: FolderTree, label: t('admin_tab_categories') },
    { id: 'testimonials' as Tab, icon: MessageSquare, label: t('admin_tab_testimonials') },
    { id: 'settings' as Tab, icon: Settings, label: t('admin_tab_settings') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-gray-900 text-white z-40 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">ISAC MLS</h2>
              <p className="text-xs text-gray-400">{t('admin_dashboard')}</p>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  tab === item.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-2 truncate">
            {t('admin_welcome')}, {session?.user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('nav_logout')}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {navItems.find((n) => n.id === tab)?.label}
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {tab === 'overview' && <Overview courses={courses} categories={categories} instructors={instructors} testimonials={testimonials} />}
          {tab === 'payments' && <PaymentValidationAdmin />}
          {tab === 'articles' && <ArticlesAdmin />}
          {tab === 'whatsapp' && <WhatsAppBroadcastCenter />}
          {tab === 'exam-correction' && <ExamCorrectionModule courses={courses} userRole="admin" />}
          {tab === 'docs' && <DocumentReportGenerator courses={courses} />}
          {tab === 'courses' && <CoursesAdmin courses={courses} categories={categories} instructors={instructors} onChanged={loadData} />}
          {tab === 'instructors' && <InstructorsAdmin instructors={instructors} courses={courses} onChanged={loadData} />}
          {tab === 'cadres' && <CadresAdmin />}
          {tab === 'library' && <DigitalLibrary isAdmin={true} />}
          {tab === 'categories' && <CategoriesAdmin categories={categories} onChanged={loadData} />}
          {tab === 'meetings' && <VirtualClassroom courses={courses} userRole="admin" />}
          {tab === 'testimonials' && <TestimonialsAdmin testimonials={testimonials} onChanged={loadData} />}
          {tab === 'settings' && <SettingsAdmin settings={settings} onChanged={loadData} />}
        </main>
      </div>
    </div>
  );
}

function Overview({ courses, categories, instructors, testimonials }: {
  courses: Course[];
  categories: Category[];
  instructors: Instructor[];
  testimonials: Testimonial[];
}) {
  const { t } = useLanguage();
  const stats = [
    { label: 'Filières & Cours', value: courses.length, color: 'from-teal-500 to-cyan-600' },
    { label: t('admin_tab_categories'), value: categories.length, color: 'from-blue-500 to-indigo-600' },
    { label: 'Formateurs Référents', value: instructors.length, color: 'from-amber-500 to-orange-600' },
    { label: t('admin_tab_testimonials'), value: testimonials.length, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4`} />
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">
          Filières & Formations Récentes
        </h3>
        <div className="space-y-2">
          {courses.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700 font-medium">{c.title_fr}</span>
              <div className="flex items-center gap-2">
                {c.is_published && <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-bold">Publié</span>}
                {c.is_featured && <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700 font-bold">Vedette</span>}
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="text-gray-400 text-sm py-4">{t('no_data')}</p>}
        </div>
      </div>
    </div>
  );
}
