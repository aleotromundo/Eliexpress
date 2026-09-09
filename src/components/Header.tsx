import { Wrench, Sparkles, Box, Bot, ShoppingCart, MessageSquare } from 'lucide-react';
import { ActiveBuild, CompatibilityReport } from '../types';

interface HeaderProps {
  activeTab: 'builder' | 'prebuilts' | 'catalog' | 'ai';
  setActiveTab: (tab: 'builder' | 'prebuilts' | 'catalog' | 'ai') => void;
  build: ActiveBuild;
  compatReport: CompatibilityReport;
  onOpenOrderModal: () => void;
  onOpenAiModal: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  build,
  compatReport,
  onOpenOrderModal,
  onOpenAiModal
}: HeaderProps) {
  // Calculate total price and selected items count with quantities
  const rawSlots = [
    { key: 'cpu', item: build.cpu },
    { key: 'motherboard', item: build.motherboard },
    { key: 'ram', item: build.ram },
    { key: 'gpu', item: build.gpu },
    { key: 'storage', item: build.storage },
    { key: 'psu', item: build.psu },
    { key: 'case', item: build.case },
    { key: 'cooling', item: build.cooling },
    { key: 'monitor', item: build.monitor },
    ...build.accessories.map((acc, idx) => ({ key: `acc-${idx}`, item: acc }))
  ];

  const selectedSlots = rawSlots.filter(s => s.item !== null);

  const totalPrice = selectedSlots.reduce((sum, s) => {
    const qty = (build.quantities && build.quantities[s.key]) || 1;
    return sum + (s.item!.precio * qty);
  }, 0);

  const totalUnits = selectedSlots.reduce((sum, s) => {
    return sum + ((build.quantities && build.quantities[s.key]) || 1);
  }, 0);

  const coreItemCount = [
    build.cpu,
    build.motherboard,
    build.ram,
    build.gpu,
    build.storage,
    build.psu,
    build.case
  ].filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 bg-[#15171B]/95 backdrop-blur-md border-b border-[#33373D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Dino Pill */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <svg className="w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="9" fill="#F5C518" />
              <circle cx="20" cy="4" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="30.9" cy="9.1" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="36" cy="20" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="30.9" cy="30.9" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="20" cy="36" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="9.1" cy="30.9" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="4" cy="20" r="2" fill="#F5C518" opacity="0.55" />
              <circle cx="9.1" cy="9.1" r="2" fill="#F5C518" opacity="0.55" />
            </svg>
            <div>
              <span className="font-['Rajdhani'] font-bold text-2xl tracking-wide text-[#EDEDE4]">
                Eli<b className="text-[#F5C518]">Tech</b>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-['JetBrains_Mono'] tracking-widest text-[#4FBDB4] uppercase px-1.5 py-0.5 rounded border border-[#4FBDB4]/30 bg-[#4FBDB4]/10">
                Lote 01-A
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#C9A227]/30 bg-[#1E2126]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5C518] animate-pulse" />
            <span className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
              Hardware físico testeado y garantizado
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            id="tab-builder-btn"
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'builder'
                ? 'bg-[#F5C518] text-[#15171B] font-bold shadow-md shadow-[#F5C518]/20'
                : 'text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#1E2126]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Armá tu PC
          </button>

          <button
            id="tab-prebuilts-btn"
            onClick={() => setActiveTab('prebuilts')}
            className={`px-3.5 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'prebuilts'
                ? 'bg-[#F5C518] text-[#15171B] font-bold shadow-md shadow-[#F5C518]/20'
                : 'text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#1E2126]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            PCs Armadas
          </button>

          <button
            id="tab-catalog-btn"
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-[#F5C518] text-[#15171B] font-bold shadow-md shadow-[#F5C518]/20'
                : 'text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#1E2126]'
            }`}
          >
            <Box className="w-4 h-4" />
            Catálogo Real
          </button>

          <button
            id="tab-ai-btn"
            onClick={onOpenAiModal}
            className="px-3.5 py-2 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap text-[#4FBDB4] hover:bg-[#4FBDB4]/15 border border-[#4FBDB4]/30 hover:border-[#4FBDB4] shadow-sm"
          >
            <Bot className="w-4 h-4" />
            Asistente IA
          </button>
        </nav>

        {/* Current Build Status Pill & Solicitar PC */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="header-order-summary-btn"
            onClick={onOpenOrderModal}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded bg-[#1E2126] border border-[#33373D] hover:border-[#C9A227] transition-all group"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase tracking-wider flex items-center gap-1 justify-end">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  compatReport.status === 'error' ? 'bg-rose-500' :
                  compatReport.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                {selectedSlots.length} {selectedSlots.length === 1 ? 'pieza' : 'piezas'}
                {totalUnits > selectedSlots.length ? ` (${totalUnits} un.)` : ''} · {compatReport.tierLabel}
              </span>
              <span className="font-['JetBrains_Mono'] font-bold text-sm text-[#F5C518]">
                US$ {totalPrice}
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-[#25D366]/15 text-[#25D366] flex items-center justify-center border border-[#25D366]/30 group-hover:bg-[#25D366] group-hover:text-black transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
