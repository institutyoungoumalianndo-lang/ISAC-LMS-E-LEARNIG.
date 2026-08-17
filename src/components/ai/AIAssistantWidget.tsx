import { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
};

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Bonjour ! Je suis l'Assistant Virtuel IA de la plateforme ISAC MLS. Comment puis-je vous aider dans vos cours, révisions ou démarches académiques ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setLoading(true);

    // AI Response simulation logic
    setTimeout(() => {
      let replyText = "C'est une excellente question ! Dans le cadre du programme professionnel ISAC MLS, ce concept s'articule autour de la maîtrise des méthodologies pratiques et du respect des standards professionnels.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('examen') || lower.includes('épreuve') || lower.includes('diplôme')) {
        replyText = "Pour les examens et diplômes : Assurez-vous d'avoir validé l'ensemble des 3 tranches de paiement auprès de l'administration et d'avoir soumis vos travaux pratiques pour correction par votre Formateur Référent.";
      } else if (lower.includes('paiement') || lower.includes('tranche') || lower.includes('gnf')) {
        replyText = "Les paiements s'effectuent en 3 tranches par dépôt Orange Money (+224 620 00 00 00) ou MTN Mobile Money (+224 660 00 00 00). N'oubliez pas de déclarer le n° de transaction dans votre Espace Étudiant.";
      } else if (lower.includes('réunion') || lower.includes('classe') || lower.includes('visio')) {
        replyText = "Vous pouvez rejoindre la Classe Virtuelle en direct depuis l'onglet 'Classe Virtuelle' de votre tableau de bord !";
      }

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-bold text-sm border-2 border-white/20"
      >
        <Bot className="w-6 h-6 animate-bounce" />
        <span className="hidden sm:inline">Assistant IA ISAC</span>
      </button>

      {/* Chat Modal / Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[520px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant Virtuel Pédagogique IA</h3>
                <p className="text-[11px] text-white/80">Disponible 24h/7d pour vous guider</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl hover:bg-white/10 text-white/80">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-teal-50/50 border-b border-teal-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend("Comment se déroulent les examens ?")}
              className="px-2.5 py-1 rounded-full bg-white border border-teal-200 text-teal-800 font-semibold whitespace-nowrap hover:bg-teal-100"
            >
              🎓 Procédure d'Examen
            </button>
            <button
              onClick={() => handleSend("Comment déclarer mon paiement en GNF ?")}
              className="px-2.5 py-1 rounded-full bg-white border border-teal-200 text-teal-800 font-semibold whitespace-nowrap hover:bg-teal-100"
            >
              💳 Paiement Tranches GNF
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                L'IA analyse votre demande...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Posez votre question à l'assistant IA..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
