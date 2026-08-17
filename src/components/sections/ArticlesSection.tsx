import { useState, useEffect } from 'react';
import { Newspaper, Share2, Facebook, Linkedin, Twitter, MessageSquare, ArrowRight, Play } from 'lucide-react';
import type { Article } from '@/lib/supabase';

export function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const savedStr = localStorage.getItem('isac_lms_articles');
    if (savedStr) {
      try {
        const list: Article[] = JSON.parse(savedStr);
        setArticles(list.filter((a) => a.is_published));
        return;
      } catch (e) {}
    }

    const defaultList: Article[] = [
      {
        id: 'art-1',
        title_fr: 'Ouverture des Inscriptions pour la Session Certifiante 2026-2027',
        content_fr: 'ISAC MLS annonce le lancement officiel des inscriptions pour les filières professionnelles certifiantes en e-learning avec versement en 3 tranches (GNF).',
        cover_image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        media_type: 'photo',
        published_at: new Date().toISOString(),
        author_name: 'Direction de la Communication',
        facebook_share_url: 'https://www.facebook.com/sharer/sharer.php?u=https://isac-mls.com',
        linkedin_share_url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://isac-mls.com',
        twitter_share_url: 'https://twitter.com/intent/tweet?url=https://isac-mls.com',
        whatsapp_share_url: 'https://api.whatsapp.com/send?text=ISAC%20MLS%20Nouvelle%20Session',
        is_published: true,
      },
      {
        id: 'art-2',
        title_fr: 'Lancement du Coffre-Fort Numérique Secrétisé pour les Cadres & la Direction',
        content_fr: 'Un nouvel espace restreint avec visio-conférence privée et coffre-fort de documents administratifs est ouvert pour les cadres dirigeants.',
        cover_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        media_type: 'photo',
        published_at: new Date().toISOString(),
        author_name: 'Bureau Executif ISAC MLS',
        facebook_share_url: 'https://www.facebook.com/sharer/sharer.php?u=https://isac-mls.com',
        linkedin_share_url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://isac-mls.com',
        twitter_share_url: 'https://twitter.com/intent/tweet?url=https://isac-mls.com',
        whatsapp_share_url: 'https://api.whatsapp.com/send?text=ISAC%20MLS%20Coffre%20Fort',
        is_published: true,
      },
    ];

    setArticles(defaultList);
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 font-bold text-xs">
            <Newspaper className="w-4 h-4" /> Actualités & Publications Médias
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Articles, Posts & Vie de l'Établissement</h2>
          <p className="text-sm text-gray-500">
            Suivez les annonces officielles, photos, vidéos de cours et partagez nos publications sur vos réseaux sociaux.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <article key={art.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-3">
                {art.cover_image_url && (
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900 group">
                    <img src={art.cover_image_url} alt={art.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {art.media_type === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-mono text-gray-400">
                    {new Date(art.published_at).toLocaleDateString('fr-FR')} • {art.author_name}
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg leading-snug">{art.title_fr}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{art.content_fr}</p>
                </div>
              </div>

              {/* Social Links Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-teal-600" /> Partager
                </span>

                <div className="flex items-center gap-2">
                  {art.facebook_share_url && (
                    <a href={art.facebook_share_url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white border text-blue-600 hover:bg-blue-50 shadow-sm transition-colors">
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {art.linkedin_share_url && (
                    <a href={art.linkedin_share_url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white border text-sky-700 hover:bg-sky-50 shadow-sm transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {art.twitter_share_url && (
                    <a href={art.twitter_share_url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white border text-slate-800 hover:bg-slate-100 shadow-sm transition-colors">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {art.whatsapp_share_url && (
                    <a href={art.whatsapp_share_url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white border text-emerald-600 hover:bg-emerald-50 shadow-sm transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
