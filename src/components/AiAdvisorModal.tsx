import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { ChatMessage, ComponentCategory, ActiveBuild } from '../types';
import { CATALOG_PRODUCTS } from '../data/catalog';

interface AiAdvisorModalProps {
  currentBuild: ActiveBuild;
  onApplySuggestedBuild: (componentIds: Partial<Record<ComponentCategory, string>>) => void;
  onClose: () => void;
}

export function AiAdvisorModal({
  currentBuild,
  onApplySuggestedBuild,
  onClose
}: AiAdvisorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Buenas! Soy el asesor de hardware de **EliTech**. Conozco cada componente físico de nuestro lote en Montevideo y las piezas complementarias disponibles.\n\nContame: ¿qué presupuesto tenés en mente, o qué juegos querés jugar y en qué resolución (1080p, 1440p o 4K)? Te armo la mejor propuesta cuidando cada peso.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Tengo $1000 USD y quiero jugar Fortnite y GTA',
    'Quiero jugar en 1440p Ultra y hacer streaming',
    'Armame la PC más potente posible con la RX 9070 XT',
    'No sé de hardware, recomendame una opción equilibrada'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(textToSend?: string) {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          currentBuild
        })
      });

      if (!res.ok) throw new Error('Error al conectar con el asesor IA');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedBuild: data.suggestedBuild
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Disculpá, hubo un pequeño corte de red. Sin embargo, te puedo recomendar revisar la PC Gamer Media con Ryzen 7 5700X y RX 7800 XT de nuestro lote: es la opción más equilibrada para 1440p Ultra.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleLoadConfig(componentIds: Partial<Record<ComponentCategory, string>>) {
    onApplySuggestedBuild(componentIds);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#1E2126] border border-[#33373D] rounded-lg shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[750px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#33373D] flex items-center justify-between bg-[#15171B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#4FBDB4]/20 border border-[#4FBDB4]/40 flex items-center justify-center text-[#4FBDB4]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
                  Asesor de Hardware EliTech
                </h3>
                <span className="text-[9px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-[#4FBDB4]/15 text-[#4FBDB4] border border-[#4FBDB4]/30 uppercase">
                  IA Conectada al Lote Real
                </span>
              </div>
              <p className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6]">
                Prioriza componentes reales en stock antes de sugerir pedidos especiales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#33373D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#15171B]/60">
          {messages.map(msg => {
            const isAI = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#4FBDB4]/20 border border-[#4FBDB4]/40 flex items-center justify-center text-[#4FBDB4] flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-lg p-3.5 space-y-3 ${
                  isAI
                    ? 'bg-[#1E2126] border border-[#33373D] text-[#EDEDE4]'
                    : 'bg-[#F5C518] text-[#15171B] font-medium'
                }`}>
                  <div className="text-xs font-['Inter'] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* AI Suggested Build Interactive Action */}
                  {msg.suggestedBuild && (
                    <div className="mt-3 p-3 rounded bg-[#15171B] border border-[#F5C518]/40 space-y-2">
                      <div className="flex items-center gap-2 text-[#F5C518]">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wide">
                          {msg.suggestedBuild.title}
                        </span>
                      </div>
                      <p className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6]">
                        {msg.suggestedBuild.summary}
                      </p>

                      <button
                        onClick={() => handleLoadConfig(msg.suggestedBuild!.componentIds)}
                        className="w-full mt-2 py-2 px-3 bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] font-bold text-xs font-['JetBrains_Mono'] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Usar esta configuración en el Armador</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <span className={`text-[9px] block text-right font-['JetBrains_Mono'] ${
                    isAI ? 'text-[#9AA0A6]' : 'text-[#15171B]/70'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#F5C518]/20 border border-[#F5C518]/40 flex items-center justify-center text-[#F5C518] flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs font-['JetBrains_Mono'] text-[#4FBDB4] p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>El asesor de EliTech está analizando el catálogo...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2 border-t border-[#33373D] bg-[#1a1c20] overflow-x-auto flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded bg-[#15171B] hover:bg-[#24282E] text-[#9AA0A6] hover:text-[#EDEDE4] border border-[#33373D] text-[11px] font-['JetBrains_Mono'] whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#15171B] border-t border-[#33373D] flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribí tu consulta (ej: Quiero una PC para jugar CS2 y editar video con $1200)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#1E2126] border border-[#33373D] rounded text-sm text-[#EDEDE4] placeholder-[#9AA0A6] focus:outline-none focus:border-[#4FBDB4]"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-[#4FBDB4] hover:bg-[#3ea89f] disabled:opacity-40 text-[#15171B] font-bold rounded transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
