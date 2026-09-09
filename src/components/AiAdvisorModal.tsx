import { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Bot, User, Sparkles, ArrowRight, Loader2, 
  CheckCircle2, AlertTriangle, RefreshCw, Key, ChevronDown, ChevronUp, ExternalLink 
} from 'lucide-react';
import { ChatMessage, ComponentCategory, ActiveBuild } from '../types';
import { CATALOG_PRODUCTS } from '../data/catalog';

interface AiAdvisorModalProps {
  currentBuild: ActiveBuild;
  onApplySuggestedBuild: (componentIds: Partial<Record<ComponentCategory, string>>) => void;
  onClose: () => void;
}

interface AiStatusState {
  checking: boolean;
  configured: boolean;
  status: 'ready' | 'missing_key' | 'error' | 'loading';
  message: string;
  model?: string;
  envVarName?: string;
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
      text: '¡Buenas! Soy el asesor de hardware de **EliTech**. Conozco cada componente físico de nuestro lote en stock y las piezas complementarias disponibles.\n\nContame: ¿qué presupuesto tenés en mente, o qué juegos querés jugar y en qué resolución (1080p, 1440p o 4K)? Te armo la mejor propuesta cuidando cada peso.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Live AI Key Health / Diagnostic state
  const [aiStatus, setAiStatus] = useState<AiStatusState>({
    checking: true,
    configured: false,
    status: 'loading',
    message: 'Verificando clave GEMINI_API_KEY...'
  });
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  async function checkAiHealth() {
    setAiStatus(prev => ({ ...prev, checking: true }));
    try {
      const res = await fetch('/api/ai-status');
      if (!res.ok) throw new Error('Endpoint no disponible');
      const data = await res.json();
      setAiStatus({
        checking: false,
        configured: !!data.configured,
        status: data.status || (data.configured ? 'ready' : 'missing_key'),
        message: data.message || '',
        model: data.model,
        envVarName: data.envVarName || 'GEMINI_API_KEY'
      });
    } catch (err: any) {
      setAiStatus({
        checking: false,
        configured: false,
        status: 'missing_key',
        message: 'No se pudo contactar el endpoint /api/ai-status. El asesor responderá con su catálogo offline.'
      });
    }
  }

  useEffect(() => {
    checkAiHealth();
  }, []);

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

        {/* Live GEMINI_API_KEY Diagnostic Bar */}
        {aiStatus.status === 'ready' && (
          <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/30 flex items-center justify-between gap-2 text-xs font-['JetBrains_Mono']">
            <div className="flex items-center gap-2 text-emerald-400 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">
                <b>GEMINI_API_KEY Activa:</b> Conectado con Google Gemini ({aiStatus.model || 'gemini-3.8-flash'})
              </span>
            </div>
            <button
              onClick={checkAiHealth}
              disabled={aiStatus.checking}
              className="px-2 py-0.5 rounded bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 text-[11px] flex items-center gap-1 transition-colors flex-shrink-0"
              title="Volver a verificar conexión"
            >
              <RefreshCw className={`w-3 h-3 ${aiStatus.checking ? 'animate-spin' : ''}`} />
              <span>Verificar</span>
            </button>
          </div>
        )}

        {aiStatus.status === 'missing_key' && (
          <div className="px-4 py-2 bg-[#1C1E23] border-b border-[#F5C518]/30 text-xs font-['JetBrains_Mono']">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-[#F5C518]">
                <AlertTriangle className="w-4 h-4 text-[#F5C518] flex-shrink-0" />
                <span>
                  <b>Modo Local (Offline):</b> Falta <code className="bg-[#15171B] px-1.5 py-0.5 rounded text-[#EDEDE4] border border-[#33373D]">GEMINI_API_KEY</code> en Vercel / hosting.
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowConfigGuide(!showConfigGuide)}
                  className="text-[11px] underline text-[#4FBDB4] hover:text-[#EDEDE4] flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showConfigGuide ? 'Ocultar pasos Vercel' : '¿Cómo activarla en Vercel?'}</span>
                  {showConfigGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button
                  onClick={checkAiHealth}
                  disabled={aiStatus.checking}
                  className="px-2.5 py-1 bg-[#2A2E35] hover:bg-[#33373D] text-[#EDEDE4] rounded text-[11px] flex items-center gap-1 transition-colors"
                  title="Comprobar si ya la agregaste a las variables de entorno"
                >
                  <RefreshCw className={`w-3 h-3 ${aiStatus.checking ? 'animate-spin' : ''}`} />
                  <span>Chequear ahora</span>
                </button>
              </div>
            </div>

            {showConfigGuide && (
              <div className="mt-2.5 p-3 rounded bg-[#15171B] border border-[#33373D] text-[11px] font-['Inter'] text-[#9AA0A6] space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-[#EDEDE4] font-bold font-['JetBrains_Mono']">
                  <span>Pasos para poner la API en Vercel (Gratuito):</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#4FBDB4] hover:underline"
                  >
                    <span>Abrir Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    Generá tu clave gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[#4FBDB4] underline font-['JetBrains_Mono']">Google AI Studio</a> (comienza con <code>AIzaSy...</code>).
                  </li>
                  <li>
                    En tu panel de <strong>Vercel</strong>, seleccioná tu proyecto y entrá a: <strong>Settings &gt; Environment Variables</strong>.
                  </li>
                  <li>
                    En <strong>Key</strong> escribí exactamente: <strong className="text-[#F5C518] font-mono">GEMINI_API_KEY</strong>
                  </li>
                  <li>
                    En <strong>Value</strong> pegá tu clave de Google y hacé clic en <strong>Save</strong>.
                  </li>
                  <li>
                    Hacé un <strong>Redeploy</strong> (o nuevo deploy) en Vercel para que tome los cambios. Al abrir este chat, se pondrá en verde automáticamente.
                  </li>
                </ol>
                <p className="text-[10px] text-[#4FBDB4]">
                  💡 <em>Mientras tanto, el chat funciona igual de manera inteligente con las reglas y productos de tu lote en stock.</em>
                </p>
              </div>
            )}
          </div>
        )}

        {aiStatus.status === 'error' && (
          <div className="px-4 py-2 bg-red-950/30 border-b border-red-500/30 flex items-center justify-between gap-2 text-xs font-['JetBrains_Mono']">
            <div className="flex items-center gap-2 text-red-400 min-w-0">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="truncate">
                <b>Error en GEMINI_API_KEY:</b> {aiStatus.message}
              </span>
            </div>
            <button
              onClick={checkAiHealth}
              disabled={aiStatus.checking}
              className="px-2 py-0.5 rounded bg-red-900/40 hover:bg-red-800/60 text-red-200 text-[11px] flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${aiStatus.checking ? 'animate-spin' : ''}`} />
              <span>Reintentar</span>
            </button>
          </div>
        )}

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
