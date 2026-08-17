import { useState, useEffect } from 'react';
import { BookOpen, Search, Download, Plus, Trash2, Edit2, FileText, Filter, Star, ExternalLink, Bookmark, X } from 'lucide-react';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';
import type { LibraryBook } from '@/lib/supabase';

type DigitalLibraryProps = {
  isAdmin?: boolean;
  canUpload?: boolean;
  defaultCategory?: string;
  studentCourseTitle?: string;
};

export function DigitalLibrary({
  isAdmin = false,
  canUpload = false,
  defaultCategory,
  studentCourseTitle,
}: DigitalLibraryProps) {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || 'Toutes');
  const [showAddModal, setShowAddModal] = useState(false);

  const isUploader = isAdmin || canUpload;

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'Gestion de Projet');
  const [format, setFormat] = useState<'PDF' | 'ePub' | 'Audio'>('PDF');
  const [description, setDescription] = useState('');
  const [fileResult, setFileResult] = useState<FileUploadResult | null>(null);

  const loadBooks = () => {
    const savedStr = localStorage.getItem('isac_lms_library');
    if (savedStr) {
      try {
        setBooks(JSON.parse(savedStr));
        return;
      } catch (e) {}
    }

    const sampleBooks: LibraryBook[] = [
      {
        id: 'b-1',
        title: 'Guide Pratique de la Gestion de Projet selon le PMI & PMBOK',
        author: 'Dr. Jean-Marc Dupont',
        category: 'Gestion de Projet',
        description: 'Manuel complet traitant du cycle de vie des projets, du suivi budgétaire et du contrôle qualité.',
        format: 'PDF',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b-2',
        title: 'Fondamentaux de la Finance d\'Entreprise & Comptabilité Analytique',
        author: 'Prof. Mamadou Diallo',
        category: 'Finance & Comptabilité',
        description: 'Analyse des états financiers, calcul du BFR et rentabilité des investissements.',
        format: 'PDF',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b-3',
        title: 'Architecture des Systèmes d\'Information & Cybersécurité',
        author: 'Ing. Ousmane Sylla',
        category: 'Technologies de l\'Information',
        description: 'Principes de base du réseau, sécurité des données et administration système.',
        format: 'PDF',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        created_at: new Date().toISOString(),
      },
    ];

    setBooks(sampleBooks);
    localStorage.setItem('isac_lms_library', JSON.stringify(sampleBooks));
  };

  useEffect(() => {
    loadBooks();
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !fileResult?.url) return;

    const newBook: LibraryBook = {
      id: 'book-' + Date.now(),
      title: title.trim(),
      author: author.trim(),
      category,
      format,
      description: description.trim(),
      file_url: fileResult.url,
      created_at: new Date().toISOString(),
    };

    const updated = [newBook, ...books];
    setBooks(updated);
    localStorage.setItem('isac_lms_library', JSON.stringify(updated));

    setShowAddModal(false);
    setTitle('');
    setAuthor('');
    setDescription('');
    setFileResult(null);
  };

  const handleDeleteBook = (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet ouvrage de la bibliothèque ?')) return;
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    localStorage.setItem('isac_lms_library', JSON.stringify(updated));
  };

  const categories = ['Toutes', 'Gestion de Projet', 'Finance & Comptabilité', 'Technologies de l\'Information', 'Management & Leadership', 'Marketing Digital'];

  const filtered = books.filter((b) => {
    const matchCat = selectedCategory === 'Toutes' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur">
            <BookOpen className="w-4 h-4 text-teal-300" />
            Bibliothèque Numérique ISAC MLS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">E-Library & Ressources Académiques</h2>
          <p className="text-sm text-white/80 max-w-xl leading-relaxed">
            {studentCourseTitle ? (
              <>Ouvrages et manuels recommandés pour votre filière : <strong className="text-teal-300">{studentCourseTitle}</strong></>
            ) : (
              'Consultez et téléchargez les manuels de référence, mémoires et guides pratiques certifiants.'
            )}
          </p>
        </div>

        {isUploader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex-shrink-0"
          >
            <Plus className="w-5 h-5" /> Charger un Document / Ouvrage
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un ouvrage, auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-teal-500 outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700">
                  {b.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-gray-100 text-gray-600">
                  {b.format}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-base leading-snug">{b.title}</h3>
              <p className="text-xs font-semibold text-teal-600">Auteur / Formateur : {b.author}</p>
              {b.description && <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{b.description}</p>}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href={b.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Télécharger / Lire
              </a>

              {isUploader && (
                <button
                  onClick={() => handleDeleteBook(b.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-3xl border border-gray-100">
          Aucun ouvrage trouvé dans cette catégorie.
        </div>
      )}

      {/* Modal Ajout Document / Ouvrage par Admin ou Formateur */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Charger un Document dans la Bibliothèque</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titre de l'Ouvrage / Document</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Manuel complet de Gestion Financière..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Auteur / Enseignant</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Kante / Formateur"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="ePub">ePub</option>
                    <option value="Audio">Audiobook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Catégorie / Filière</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                >
                  <option value="Gestion de Projet">Gestion de Projet</option>
                  <option value="Finance & Comptabilité">Finance & Comptabilité</option>
                  <option value="Technologies de l'Information">Technologies de l'Information</option>
                  <option value="Management & Leadership">Management & Leadership</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                </select>
              </div>

              <FileUploadZone
                label="Charger le fichier PDF ou document (Drag & Drop)"
                acceptType="document"
                onFileSelected={(res: FileUploadResult) => setFileResult(res)}
              />

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Résumé / Description</label>
                <textarea
                  rows={3}
                  placeholder="Brève description du contenu et des objectifs du document..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Publier dans la Bibliothèque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
