import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ExternalLink, Sparkles, X, ChevronRight } from 'lucide-react';

export function FloatingWhatsApp() {
  // 'right' initially, moves to 'left' after 33s, stays 11s, returns to 'right' and repeats
  const [position, setPosition] = useState<'right' | 'left'>('right');
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissedTooltip, setIsDismissedTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isRight = position === 'right';

  // Refs for tracking active interaction so oscillation pauses cleanly
  const isInteractingRef = useRef(false);
  isInteractingRef.current = isHovered || isOpen;

  // Oscillation timer (33s right, 11s left)
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const scheduleNextMove = () => {
      const duration = position === 'right' ? 33000 : 11000;

      timerId = setTimeout(() => {
        // If user is hovering or has the card opened (especially on mobile), pause and re-check in 4s
        if (isInteractingRef.current) {
          scheduleNextMove();
          return;
        }

        setPosition(prev => (prev === 'right' ? 'left' : 'right'));
      }, duration);
    };

    scheduleNextMove();

    return () => clearTimeout(timerId);
  }, [position]);

  // Click outside listener to dismiss the card on mobile / desktop
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, []);

  const sellerPhone = '59894691690';
  const message = encodeURIComponent(
    '¡Hola EliTech! Tengo una consulta directa para el vendedor sobre el stock de componentes y armado de PC.'
  );
  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${message}`;

  // On mobile & click: 1st click opens the message card; 2nd click opens WhatsApp
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isOpen) {
      // 1st click: show explanatory message card without opening WhatsApp
      e.preventDefault();
      setIsOpen(true);
      setIsDismissedTooltip(false);
      return;
    }

    // 2nd click while already open: let default link navigation proceed to WhatsApp!
    setIsOpen(false);
  };

  const isCardVisible = (isOpen || isHovered) && !isDismissedTooltip;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 z-40 pointer-events-none transition-all duration-1000 ease-in-out select-none"
      style={{
        left: isRight ? 'calc(100% - 4.5rem)' : '1.25rem',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pointer-events-auto flex items-end">
        {/* EXPLANATORY HOVER / ACTIVE TOOLTIP CARD */}
        <div
          className={`absolute bottom-full mb-3 w-[calc(100vw-3rem)] sm:w-80 max-w-sm p-4 rounded-xl bg-[#1E2126] border-2 border-[#25D366] shadow-[0_12px_36px_rgba(0,0,0,0.75)] transition-all duration-300 origin-bottom ${
            isRight ? 'right-0' : 'left-0'
          } ${
            isCardVisible
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Header with online indicator & close button */}
          <div className="flex items-center justify-between pb-2 border-b border-[#33373D]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-[#25D366] font-bold uppercase tracking-wider">
                Vendedor en línea
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsDismissedTooltip(true);
                setTimeout(() => setIsDismissedTooltip(false), 8000);
              }}
              className="text-[#9AA0A6] hover:text-[#EDEDE4] p-1 rounded transition-colors"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="pt-2.5 space-y-2 text-left">
            <h4 className="text-sm font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase tracking-wide flex items-center gap-1.5">
              <span>Hablá directo con el vendedor</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" />
            </h4>
            <p className="text-xs font-['Inter'] text-[#9AA0A6] leading-relaxed">
              Atención directa sin intermediarios. Consultá disponibilidad de stock, cotizaciones de armado o asesoramiento técnico en tiempo real.
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#EDEDE4]/70">
              <span>EliTech Gamer</span>
              <span className="text-[#F5C518]">+598 94 691 690</span>
            </div>

            {/* Direct WhatsApp Action Button inside the card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white flex-shrink-0" />
              <span>Abrir chat por WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-80" />
            </a>

            {/* Mobile helpful note */}
            <div className="sm:hidden text-center pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6]">
                <span>O volvé a tocar el botón verde para abrir</span>
                <ChevronRight className="w-3 h-3 text-[#25D366]" />
              </span>
            </div>
          </div>

          {/* Little arrow at bottom */}
          <div
            className={`absolute -bottom-2 w-4 h-4 bg-[#1E2126] border-r-2 border-b-2 border-[#25D366] rotate-45 ${
              isRight ? 'right-5' : 'left-5'
            }`}
          />
        </div>

        {/* FLOATING CIRCLE BUTTON */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleButtonClick}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen ? 'ring-4 ring-[#25D366]/40 scale-105' : ''
          }`}
          aria-label={isOpen ? 'Tocar para abrir WhatsApp' : 'Hablar con el vendedor'}
          title={isOpen ? 'Tocar para abrir WhatsApp' : 'Hablar directamente con el vendedor'}
        >
          {/* Pulsating outer halo */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Official WhatsApp icon SVG for crisp fidelity */}
          <svg
            className="w-8 h-8 fill-white relative z-10 drop-shadow-sm"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Mini pulse notification badge (vendedor activo) */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F5C518] text-[#15171B] text-[9px] font-bold items-center justify-center font-['JetBrains_Mono']">
              {isOpen ? '2' : '1'}
            </span>
          </span>
        </a>

        {/* Constant subtle mini-pill tag when not hovered or opened */}
        <div
          className={`absolute bottom-2 ${
            isRight ? 'right-16 text-right' : 'left-16 text-left'
          } whitespace-nowrap hidden sm:block pointer-events-auto cursor-pointer transition-all duration-300 ${
            isCardVisible ? 'opacity-0 translate-y-1 pointer-events-none' : 'opacity-90 hover:opacity-100'
          }`}
          onClick={() => {
            setIsOpen(true);
            setIsDismissedTooltip(false);
          }}
        >
          <div className="px-2.5 py-1 rounded-full bg-[#1E2126]/90 backdrop-blur-md border border-[#25D366]/50 text-[11px] font-['JetBrains_Mono'] text-[#EDEDE4] shadow-md flex items-center gap-1.5 hover:border-[#25D366]">
            <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse"></span>
            <span>Vendedor directo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
