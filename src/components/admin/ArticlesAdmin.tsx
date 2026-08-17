import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Share2, Facebook, Linkedin, Twitter, MessageSquare, Image, Film, Eye } from 'lucide-react';
import { FileUploadZone, FileUploadResult } from '../common/FileUploadZone';
import type { Article } from '@/lib/supabase';

export function ArticlesAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form State
  const [titleFr, setTitleFr] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  const loadArticles = () => {
    const savedStr = localStorage.getItem('isac_lms_articles');
    if (savedStr) {
      try {
        setArticles(JSON.parse(savedStr));
        return;
      } catch (e) {}
    }

    const defaultArticles: Article[] = [
      {
        id: 'art-1',
        title_fr: 'Ouverture des Inscriptions pour la Nouvelle Session Certifiante 2026-2027',
        content_fr: 'ISAC MLS annonce le lancement officiel des inscriptions pour les filières professionnelles en e-learning. Profitez du paiement facilité en 3 tranches (GNF).',
        cover_image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        media_type: 'photo',
        published_at: new Date().toISOString(),
        author_name: 'Direction de la Communication',
        facebook_share_url: 'https://facebook.com/sharer/sharer.php?u=https://isac-mls.com',
        linkedin_share_url: 'https://linkedin.com/shareArticle?url=https://isac-mls.com',
        twitter_share_url: 'https://twitter.com/intent/tweet?url=https://isac-mls.com',
        whatsapp_share_url: 'https://api.whatsapp.com/send?text=ISAC%20MLS%20Nouvelle%20Session',
        is_published: true,
      },
    ];
    setArticles(defaultArticles);
    localStorage.setItem('isac_lms_articles', JSON.stringify(defaultArticles));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setTitleFr('');
    setContentFr('');
    setMediaType('photo');
    setCoverUrl(null);
    setMediaUrl(null);
    setIsPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setTitleFr(art.title_fr);
    setContentFr(art.content_fr);
    setMediaType(art.media_type || 'photo');
    setCoverUrl(art.cover_image_url || null);
    setMediaUrl(art.media_url || null);
    setIsPublished(art.is_published);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFr.trim() || !contentFr.trim()) return;

    const encodedTitle = encodeURIComponent(titleFr);
    const siteUrl = encodeURIComponent('https://isac-mls.com');

    const newArticle: Article = {
      id: editingArticle ? editingArticle.id : 'art-' + Date.now(),
      title_fr: titleFr.trim(),
      content_fr: contentFr.trim(),
      cover_image_url: coverUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      media_url: mediaUrl,
      media_type: mediaType,
      published_at: editingArticle ? editingArticle.published_at : new Date().toISOString(),
      author_name: 'Direction ISAC MLS',
      facebook_share_url: `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}&quote=${encodedTitle}`,
      linkedin_share_url: `https://www.linkedin.com/sharing/share-offsite/?url=${siteUrl}`,
      twitter_share_url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${siteUrl}`,
      whatsapp_share_url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${siteUrl}`,
      is_published: isPublished,
    };

    let updated: Article[] = [];
    if (editingArticle) {
      updated = articles.map((a) => (a.id === editingArticle.id ? newArticle : a));
    } else {
      updated = [newArticle, ...articles];
    }

    setArticles(updated);
    localStorage.setItem('isac_lms_articles', JSON.stringify(updated));
    window.dispatchEvent(new Event('isac_settings_updated'));
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    localStorage.setItem('isac_lms_articles', JSON.stringify(updated));
    window.dispatchEvent(new Event('isac_settings_updated'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Articles, Posts & Publications Médias</h2>
          <p className="text-xs text-gray-500">
            Publiez des actualités, photos et vidéos reliées directement aux réseaux sociaux (Facebook, LinkedIn, X, WhatsApp).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Publier un Nouveau Post / Article
        </button>
      </div>

      {/* Grid des Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((art) => (
          <div key={art.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              {art.cover_image_url && (
                <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                  <img src={art.cover_image_url} alt={art.title_fr} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur">
                    {art.media_type === 'video' ? '📹 Vidéo' : '📷 Photo / Article'}
                  </span>
                </div>
              )}

              <div className="p-5 space-y-2">
                <div className="text-[11px] text-gray-400 font-mono">
                  {new Date(art.published_at).toLocaleDateString('fr-FR')} • {art.author_name}
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug">{art.title_fr}</h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{art.content_fr}</p>

                {/* Social Share Buttons Bar */}
                <div className="pt-3 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> Partager :
                  </span>
                  {art.facebook_share_url && (
                    <a href={art.facebook_share_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {art.linkedin_share_url && (
                    <a href={art.linkedin_share_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {art.twitter_share_url && (
                    <a href={art.twitter_share_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {art.whatsapp_share_url && (
                    <a href={art.whatsapp_share_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${art.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {art.is_published ? 'Publié sur le site' : 'Brouillon'}
              </span>

              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(art)} className="p-1.5 rounded-lg hover:bg-teal-100 text-teal-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(art.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajout/Édition Post */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900">
              {editingArticle ? 'Modifier l\'Article' : 'Nouveau Post / Publication Réseaux Sociaux'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titre de l'Article / Publication</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cérémonie de remise des diplômes 2026..."
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Contenu / Texte de la publication</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Rédigez le texte du post..."
                  value={contentFr}
                  onChange={(e) => setContentFr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Type de Média</label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                >
                  <option value="photo">Photo / Image illustrative</option>
                  <option value="video">Vidéo de présentation (MP4/URL)</option>
                </select>
              </div>

              <FileUploadZone
                label="Charger l'Image de Couverture ou Vidéo (Drag & Drop)"
                acceptType={mediaType}
                currentUrl={coverUrl || undefined}
                onFileSelected={(res: FileUploadResult) => setCoverUrl(res.url)}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="pub-check" className="text-xs font-semibold text-gray-700">
                  Publier immédiatement sur le site web
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Enregistrer & Générer Liens Réseaux Sociaux
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
