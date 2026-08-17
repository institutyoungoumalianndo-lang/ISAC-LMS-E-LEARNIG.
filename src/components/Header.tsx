import { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';

type HeaderProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { t } = useLanguage();
  const { session, isAdmin, isFormateur, isCadre } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav_home') },
    { id: 'courses', label: t('nav_courses') },
    { id: 'about', label: t('nav_about') },
    { id: 'contact', label: t('nav_contact') },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const studentButtonLabel = session && !isAdmin && !isFormateur && !isCadre ? t('nav_student_dashboard') : t('nav_student_login');

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedStr = localStorage.getItem('isac_lms_settings');
    if (savedStr) {
      try {
        const s = JSON.parse(savedStr);
        if (s.logo_url) setLogoUrl(s.logo_url);
      } catch (e) {}
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo École" className="h-10 w-auto object-contain rounded-lg" />
            ) : (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                scrolled ? 'bg-teal-600' : 'bg-white/10 backdrop-blur'
              }`}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            )}
            <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              ISAC MLS
            </span>
          </button>

          {/* Sceau Officiel du Ministère (METFP) */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-white/20">
            <img src="/logo_ministere_guinee.jpg" alt="Sceau Ministère GUINÉE" className="h-9 w-9 object-contain rounded-full shadow-sm" />
            <div className="text-[9px] font-mono leading-tight">
              <span className={`font-bold block uppercase ${scrolled ? 'text-teal-950' : 'text-amber-300'}`}>AGRÉÉ PAR LE MINISTÈRE (METFP)</span>
              <span className={scrolled ? 'text-gray-500' : 'text-white/80'}>Création N°070 • Ouverture N°2014/3942</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? currentPage === item.id
                    ? 'text-teal-600'
                    : 'text-gray-700 hover:text-teal-600'
                  : currentPage === item.id
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher className={scrolled ? '' : 'opacity-90'} />
          
          <button
            onClick={() => handleNav('cadre')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              scrolled
                ? 'text-slate-800 bg-slate-100 hover:bg-slate-200'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Espace Cadres
          </button>

          <button
            onClick={() => handleNav('formateur')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              scrolled
                ? 'text-teal-700 hover:bg-teal-50'
                : 'text-white/90 hover:text-white'
            }`}
          >
            Espace Formateur
          </button>

          <button
            onClick={() => handleNav('student')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              scrolled
                ? 'text-teal-600 hover:bg-teal-50'
                : 'text-white/90 hover:text-white'
            }`}
          >
            {studentButtonLabel}
          </button>

          <button
            onClick={() => handleNav('login')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              scrolled
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-white text-teal-700 hover:bg-teal-50'
            }`}
          >
            {t('nav_login')}
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white shadow-xl mt-3 mx-4 rounded-xl overflow-hidden">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-6 py-3 text-left text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-6 py-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => handleNav('cadre')}
                className="w-full px-4 py-2 rounded-lg text-xs font-bold text-slate-900 bg-slate-100 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Espace Cadres
              </button>
              <button
                onClick={() => handleNav('formateur')}
                className="w-full px-4 py-2 rounded-lg text-xs font-medium text-teal-700 bg-teal-50"
              >
                Espace Formateur
              </button>
              <button
                onClick={() => handleNav('student')}
                className="w-full px-4 py-2 rounded-lg text-xs font-medium text-teal-600 bg-teal-50"
              >
                {studentButtonLabel}
              </button>
              <button
                onClick={() => handleNav('login')}
                className="w-full px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 text-white"
              >
                {t('nav_login')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
