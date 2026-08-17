import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Plus, ExternalLink, Users, Play, X, MessageSquare } from 'lucide-react';
import type { VirtualMeeting, Course } from '@/lib/supabase';

type VirtualClassroomProps = {
  courses: Course[];
  userRole: 'admin' | 'formateur' | 'student';
  currentUserId?: string;
};

export function VirtualClassroom({ courses, userRole, currentUserId }: VirtualClassroomProps) {
  const [meetings, setMeetings] = useState<VirtualMeeting[]>([]);
  const [activeLiveRoom, setActiveLiveRoom] = useState<VirtualMeeting | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState(60);

  const loadMeetings = () => {
    const savedStr = localStorage.getItem('isac_lms_virtual_meetings');
    if (savedStr) {
      try {
        setMeetings(JSON.parse(savedStr));
        return;
      } catch (e) {}
    }
    // Default initial sample meeting
    if (courses.length > 0) {
      const initial: VirtualMeeting[] = [
        {
          id: 'meet-1',
          title: 'Classe Virtuelle en direct : Introduction & Directives Académiques',
          description: 'Session de bienvenue, présentation du programme et questions-réponses en direct.',
          course_id: courses[0].id,
          meeting_url: 'https://meet.jit.si/ISAC-MLS-Classe-Virtuelle-Live',
          start_time: new Date(Date.now() + 3600000).toISOString(),
          duration_minutes: 60,
          status: 'live',
          created_at: new Date().toISOString(),
        },
      ];
      setMeetings(initial);
      localStorage.setItem('isac_lms_virtual_meetings', JSON.stringify(initial));
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [courses]);

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = meetingUrl.trim() || `https://meet.jit.si/ISAC-MLS-${title.replace(/[^a-zA-Z0-9]/g, '-')}`;

    const newMeeting: VirtualMeeting = {
      id: 'meet-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      course_id: selectedCourseId,
      meeting_url: finalUrl,
      start_time: startTime,
      duration_minutes: Number(duration),
      status: 'upcoming',
      created_at: new Date().toISOString(),
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    localStorage.setItem('isac_lms_virtual_meetings', JSON.stringify(updated));

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setMeetingUrl('');
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur">
            <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
            Espace Classe Virtuelle & Visio-conférence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Rubrique Réunion & Cours en Direct</h2>
          <p className="text-sm text-white/80 max-w-xl leading-relaxed">
            Rejoignez les sessions interactives en direct avec les formateurs et vos camarades de filière.
          </p>
        </div>

        {(userRole === 'admin' || userRole === 'formateur') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-teal-800 font-bold text-sm shadow-lg hover:bg-teal-50 transition-all flex-shrink-0"
          >
            <Plus className="w-5 h-5 text-teal-600" />
            Programmer une Réunion
          </button>
        )}
      </div>

      {/* Embedded Live Iframe Player */}
      {activeLiveRoom && (
        <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
          <div className="p-4 bg-gray-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <h3 className="font-bold text-sm sm:text-base">{activeLiveRoom.title}</h3>
            </div>
            <button
              onClick={() => setActiveLiveRoom(null)}
              className="p-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative w-full aspect-video min-h-[450px]">
            <iframe
              src={activeLiveRoom.meeting_url}
              allow="camera; microphone; display-capture; autoplay; clipboard-write"
              className="w-full h-full border-0"
              title="Session Live Jitsi"
            />
          </div>
        </div>
      )}

      {/* Meetings Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((m) => {
          const course = courses.find((c) => c.id === m.course_id);
          return (
            <div key={m.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                    {course?.title_fr || 'Toutes filières'}
                  </span>
                  {m.status === 'live' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> EN DIRECT
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      Programmé
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug">{m.title}</h3>
                {m.description && <p className="text-xs text-gray-500 line-clamp-2">{m.description}</p>}

                <div className="space-y-1.5 pt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>{formatDateTime(m.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Durée : {m.duration_minutes} minutes</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveLiveRoom(m)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Play className="w-4 h-4" /> Rejoindre la Classe
                </button>
                <a
                  href={m.meeting_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  title="Ouvrir dans une nouvelle fenêtre"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Création Réunion */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Programmer une Réunion Virtuelle</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titre de la réunion</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Séance de révision / Cours magistral"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Filière / Formation</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title_fr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date & Heure de début</label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Lien de visio (Optionnel)</label>
                <input
                  type="url"
                  placeholder="Laisser vide pour générer une salle Jitsi Meet"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Ordre du jour</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Créer la Réunion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
