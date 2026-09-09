import { useState } from 'react';
import { X, ExternalLink, Copy, Check, Globe, HelpCircle, ShieldCheck } from 'lucide-react';
import { ActiveBuild } from '../types';

interface PCPartPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  build: ActiveBuild;
}

export function PCPartPickerModal({ isOpen, onClose, build }: PCPartPickerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const items = [
    { label: 'CPU (Procesador)', product: build.cpu, searchKey: build.cpu?.nombre },
    { label: 'Motherboard (Placa Madre)', product: build.motherboard, searchKey: build.motherboard?.nombre },
    { label: 'RAM (Memoria)', product: build.ram, searchKey: build.ram?.nombre },
    { label: 'GPU (Placa de Video)', product: build.gpu, searchKey: build.gpu?.nombre },
    { label: 'Almacenamiento (SSD)', product: build.storage, searchKey: build.storage?.nombre },
    { label: 'Fuente (PSU)', product: build.psu, searchKey: build.psu?.nombre },
    { label: 'Gabinete', product: build.case, searchKey: build.case?.nombre },
    { label: 'Cooling / Cooler', product: build.cooling, searchKey: build.cooling?.nombre },
    { label: 'Monitor', product: build.monitor, searchKey: build.monitor?.nombre },
  ].filter(item => item.product !== null && item.product !== undefined);

  // Generate plain text formatted list
  const formattedText = `🖥️ MI BUILD ELITECH PARA COMPARAR EN PCPARTPICKER:
${items.map(i => `• ${i.label}: ${i.product?.nombre} (US$ ${i.product?.precio})`).join('\n')}

🔗 Verificar en PCPartPicker: https://pcpartpicker.com/list/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#1E2126] border border-[#33373D] rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#33373D] bg-[#15171B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#F5C518]/15 border border-[#F5C518]/40 flex items-center justify-center text-[#F5C518]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
                  Verificar con PCPartPicker.com
                </h3>
                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                  Estándar Gamer
                </span>
              </div>
              <p className="text-xs font-['Inter'] text-[#9AA0A6]">
                Compará compatibilidad, precios internacionales y reseñas de usuarios reales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#33373D] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Info Banner */}
          <div className="p-3.5 rounded bg-[#15171B] border border-[#33373D] space-y-2 text-xs font-['Inter'] text-[#9AA0A6]">
            <div className="flex items-center gap-2 text-[#EDEDE4] font-bold font-['JetBrains_Mono']">
              <ShieldCheck className="w-4 h-4 text-[#4FBDB4]" />
              <span>¿Para qué sirve verificar en PCPartPicker?</span>
            </div>
            <p className="leading-relaxed">
              <strong>PCPartPicker.com</strong> es la herramienta más utilizada en el mundo por comunidades como Reddit (r/buildapc) y foros de gaming. Podés cargar esta misma lista en su System Builder para chequear que los sockets, voltajes de fuentes y dimensiones de gabinete coincidan a la perfección.
            </p>
          </div>

          {/* Components List with 1-click PCPartPicker search */}
          <div>
            <span className="text-xs font-['JetBrains_Mono'] text-[#4FBDB4] uppercase tracking-wider font-bold block mb-2">
              Componentes de tu PC actual ({items.length})
            </span>

            {items.length === 0 ? (
              <p className="text-xs text-[#9AA0A6] italic py-4 text-center">
                Aún no has agregado componentes a tu armado.
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const p = item.product!;
                  const isSpecial = p.origen === 'PEDIDO_ESPECIAL';
                  const pcppSearchUrl = `https://pcpartpicker.com/search/?q=${encodeURIComponent(p.nombre)}`;

                  return (
                    <div 
                      key={idx}
                      className="p-2.5 rounded bg-[#15171B] border border-[#33373D] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase">
                            {item.label}
                          </span>
                          <span className={`text-[9px] font-['JetBrains_Mono'] px-1.5 py-0.2 rounded border uppercase font-semibold ${
                            isSpecial 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {isSpecial ? 'A Conseguir' : 'Stock Local'}
                          </span>
                        </div>
                        <p className="text-xs font-['Rajdhani'] font-bold text-[#EDEDE4] truncate">
                          {p.nombre}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-['JetBrains_Mono'] text-[#F5C518] font-bold">
                          US$ {p.precio}
                        </span>

                        <a
                          href={p.enlaceOficial || pcppSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-[#1E2126] hover:bg-[#2A2E35] border border-[#4FBDB4]/40 hover:border-[#4FBDB4] text-[#4FBDB4] text-[11px] font-['JetBrains_Mono'] rounded flex items-center gap-1 transition-colors"
                          title="Buscar este componente en PCPartPicker"
                        >
                          <span>Buscar en PCPartPicker</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Copy Box */}
          <div className="p-3 bg-[#15171B] border border-[#33373D] rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-['JetBrains_Mono'] text-[#EDEDE4] font-bold">
                Texto para compartir en foros / Discord
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-[#33373D] hover:bg-[#4FBDB4] hover:text-[#15171B] text-[#EDEDE4] rounded text-xs font-['JetBrains_Mono'] flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Lista</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] bg-[#0E1013] p-2.5 rounded overflow-x-auto whitespace-pre-wrap max-h-24">
              {formattedText}
            </pre>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 border-t border-[#33373D] bg-[#15171B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="https://pcpartpicker.com/list/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] font-['Rajdhani'] font-bold text-sm uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors shadow"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir PCPartPicker System Builder</span>
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-[#1E2126] hover:bg-[#2A2E35] border border-[#33373D] text-[#EDEDE4] text-xs font-['JetBrains_Mono'] uppercase tracking-wider rounded transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
