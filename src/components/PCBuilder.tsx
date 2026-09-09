import { useState } from 'react';
import { 
  Cpu, CircuitBoard, Layers, Monitor, HardDrive, Zap, 
  Box, Fan, Plus, RefreshCw, Trash2, ShieldCheck, AlertTriangle, 
  Sparkles, ShoppingCart, HelpCircle, Bot, ArrowRight, Globe, ExternalLink
} from 'lucide-react';
import { ActiveBuild, ComponentCategory, Product, CompatibilityReport } from '../types';
import { PCPartPickerModal } from './PCPartPickerModal';

interface PCBuilderProps {
  build: ActiveBuild;
  compatReport: CompatibilityReport;
  onOpenSelector: (category: ComponentCategory | 'all', label: string) => void;
  onOpenSpecialRequest: (category: ComponentCategory) => void;
  onRemoveComponent: (category: ComponentCategory) => void;
  onResetBuild: () => void;
  onOpenOrderModal: () => void;
  onOpenAiModal: () => void;
  onGoToPrebuilts: () => void;
}

type BuilderSlotKey = Exclude<ComponentCategory, 'accessories'>;

interface SlotConfig {
  key: BuilderSlotKey;
  label: string;
  icon: any;
  required: boolean;
  description: string;
}

const BUILDER_SLOTS: SlotConfig[] = [
  { key: 'cpu', label: 'Procesador (CPU)', icon: Cpu, required: true, description: 'El cerebro de la PC para gaming y tareas' },
  { key: 'motherboard', label: 'Placa Madre (Motherboard)', icon: CircuitBoard, required: true, description: 'Conecta todos los componentes y determina el socket (AM4/AM5)' },
  { key: 'ram', label: 'Memoria RAM', icon: Layers, required: true, description: 'Memoria rápida DDR4 o DDR5 para multitarea y juegos fluidos' },
  { key: 'gpu', label: 'Placa de Video (GPU)', icon: Monitor, required: true, description: 'Determina los FPS y la resolución gráfica (1080p, 1440p o 4K)' },
  { key: 'storage', label: 'Almacenamiento (SSD)', icon: HardDrive, required: true, description: 'SSD NVMe para arranque veloz de Windows y carga rápida de juegos' },
  { key: 'psu', label: 'Fuente de Poder (PSU)', icon: Zap, required: true, description: 'Suministra energía limpia y protegida a todo el equipo' },
  { key: 'case', label: 'Gabinete (Chasis)', icon: Box, required: true, description: 'Estructura estética con flujo de aire y soporte para placas' },
  { key: 'cooling', label: 'Refrigeración / Ventiladores', icon: Fan, required: false, description: 'Ventilación adicional para mantener bajas temperaturas' },
  { key: 'monitor', label: 'Monitor (Opcional)', icon: Monitor, required: false, description: 'Pantalla gamer de alta tasa de refresco' }
];

export function PCBuilder({
  build,
  compatReport,
  onOpenSelector,
  onOpenSpecialRequest,
  onRemoveComponent,
  onResetBuild,
  onOpenOrderModal,
  onOpenAiModal,
  onGoToPrebuilts
}: PCBuilderProps) {
  const [isPcppModalOpen, setIsPcppModalOpen] = useState(false);

  // Calculate pricing breakdown
  const selectedItems = [
    build.cpu,
    build.motherboard,
    build.ram,
    build.gpu,
    build.storage,
    build.psu,
    build.case,
    build.cooling,
    build.monitor,
    ...build.accessories
  ].filter(Boolean) as Product[];

  const totalStock = selectedItems
    .filter(i => i.origen === 'CATALOGO')
    .reduce((sum, i) => sum + i.precio, 0);

  const totalSpecial = selectedItems
    .filter(i => i.origen === 'PEDIDO_ESPECIAL')
    .reduce((sum, i) => sum + i.precio, 0);

  const totalGeneral = totalStock + totalSpecial;

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg bg-[#1E2126] border border-[#33373D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-['JetBrains_Mono'] text-[#F5C518] uppercase tracking-widest font-bold">
              Módulo B · Armá tu PC pieza por pieza
            </span>
            <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#4FBDB4]/10 text-[#4FBDB4] border border-[#4FBDB4]/30 uppercase">
              Lote Real + Pedidos Especiales
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
            Configurador de Hardware
          </h2>
          <p className="text-xs font-['Inter'] text-[#9AA0A6] max-w-2xl mt-1">
            Armá tu equipo combinando piezas físicas disponibles en nuestro lote de Montevideo y pedidos especiales que conseguimos para vos. El sistema comprueba compatibilidad y potencia en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <button
            onClick={onOpenAiModal}
            className="px-3.5 py-2 rounded bg-[#4FBDB4]/15 hover:bg-[#4FBDB4]/25 text-[#4FBDB4] border border-[#4FBDB4]/40 text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Ayuda con IA</span>
          </button>

          <button
            onClick={onGoToPrebuilts}
            className="px-3.5 py-2 rounded bg-[#15171B] hover:bg-[#24282E] text-[#9AA0A6] hover:text-[#EDEDE4] border border-[#33373D] text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#F5C518]" />
            <span>Ver Prearmadas</span>
          </button>

          <button
            onClick={() => setIsPcppModalOpen(true)}
            className="px-3.5 py-2 rounded bg-[#15171B] hover:bg-[#24282E] text-[#4FBDB4] hover:text-[#EDEDE4] border border-[#4FBDB4]/40 text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-2 transition-colors"
            title="Comparar esta combinación en PCPartPicker"
          >
            <Globe className="w-4 h-4 text-[#4FBDB4]" />
            <span>PCPartPicker</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Slots on Left, Metrics & Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Component Slots (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          {/* Interactive Guide Banner */}
          <div className="p-4 rounded-lg bg-[#1a1c20] border border-[#F5C518]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F5C518]/15 border border-[#F5C518]/40 flex items-center justify-center text-[#F5C518] flex-shrink-0 mt-0.5">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-['JetBrains_Mono'] font-bold text-[#EDEDE4] uppercase tracking-wider block">
                  Personalización Activa: Cambiá cualquier componente
                </span>
                <p className="text-[#9AA0A6] mt-0.5">
                  Cada componente tiene su botón <strong className="text-[#F5C518]">«Cambiar pieza»</strong> o <strong className="text-[#F5C518]">«Elegir»</strong>. Al tocarlo se abrirá el catálogo completo con todas las opciones disponibles.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenSelector('all' as any, 'Todas las piezas del catálogo')}
              className="w-full sm:w-auto px-4 py-2 bg-[#F5C518]/15 hover:bg-[#F5C518]/25 text-[#F5C518] border border-[#F5C518]/40 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Explorar Todas las Piezas</span>
            </button>
          </div>

          {BUILDER_SLOTS.map(slot => {
            const currentItem = build[slot.key];
            const Icon = slot.icon;
            const isSpecial = currentItem?.origen === 'PEDIDO_ESPECIAL';

            return (
              <div 
                key={slot.key}
                id={`slot-${slot.key}`}
                className={`p-4 rounded-lg border transition-all ${
                  currentItem 
                    ? 'bg-[#1E2126] border-[#33373D] hover:border-[#C9A227]/60' 
                    : 'bg-[#15171B]/80 border-dashed border-[#33373D] hover:border-[#F5C518]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Slot Icon & Title */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      currentItem
                        ? isSpecial ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-[#F5C518]/15 text-[#F5C518] border border-[#F5C518]/30'
                        : 'bg-[#24282E] text-[#9AA0A6] border border-[#33373D]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] font-semibold">
                          {slot.label}
                        </span>

                        {currentItem && (
                          <span className={`text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded border ${
                            isSpecial 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {isSpecial ? '🔵 PEDIDO ESPECIAL — A CONSEGUIR' : '🟢 LOTE EN STOCK'}
                          </span>
                        )}
                      </div>

                      {currentItem ? (
                        <div>
                          <h4 className="text-base font-['Rajdhani'] font-bold text-[#EDEDE4] leading-tight">
                            {currentItem.nombre}
                          </h4>
                          <p className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] mt-1 line-clamp-1">
                            {currentItem.especificaciones[0]}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-['Inter'] text-[#9AA0A6]/80">
                          {slot.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#33373D]/60 flex-shrink-0">
                    {currentItem ? (
                      <div className="flex items-center sm:items-end justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="sm:text-right">
                          <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] block uppercase">
                            Precio
                          </span>
                          <span className="text-lg font-['JetBrains_Mono'] font-bold text-[#F5C518]">
                            US$ {currentItem.precio}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-cambiar-${slot.key}`}
                            onClick={() => onOpenSelector(slot.key, slot.label)}
                            className="px-3 py-2 bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] font-bold rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                            title={`Cambiar o elegir otro ${slot.label}`}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Cambiar pieza</span>
                          </button>

                          <button
                            onClick={() => onOpenSpecialRequest(slot.key)}
                            className="p-2 rounded text-[#4FBDB4] hover:bg-[#4FBDB4]/10 border border-[#4FBDB4]/30 text-xs font-['JetBrains_Mono'] transition-colors"
                            title="Pedir otro modelo especial fuera de catálogo"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onRemoveComponent(slot.key)}
                            className="p-2 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 text-xs font-['JetBrains_Mono'] transition-colors"
                            title="Quitar de la PC"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          id={`btn-elegir-${slot.key}`}
                          onClick={() => onOpenSelector(slot.key, slot.label)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] font-bold rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Elegir {slot.label}</span>
                        </button>

                        <button
                          onClick={() => onOpenSpecialRequest(slot.key)}
                          className="px-3 py-2 bg-[#15171B] hover:bg-[#24282E] text-[#4FBDB4] border border-[#4FBDB4]/30 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="Pedir modelo fuera de catálogo"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pedir especial</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reset Build Option */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onResetBuild}
              className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar configuración / Empezar de cero</span>
            </button>
          </div>
        </div>

        {/* Right Column: Performance, Compatibility & Final Order (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Potencia Gamer Card (MÓDULO 9) */}
          <div className="p-5 rounded-lg bg-[#1E2126] border border-[#33373D] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-['JetBrains_Mono'] text-[#4FBDB4] uppercase tracking-widest font-bold">
                Módulo 9 · Potencia Gamer
              </span>
              <span className="text-xs font-['JetBrains_Mono'] font-bold text-[#F5C518]">
                {compatReport.gamingScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#15171B] rounded-full h-3.5 p-0.5 border border-[#33373D] overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#4FBDB4] via-[#F5C518] to-amber-500"
                style={{ width: `${Math.max(compatReport.gamingScore, 5)}%` }}
              />
            </div>

            <div className="text-sm font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase flex justify-between">
              <span>Nivel estimado:</span>
              <span className="text-[#F5C518]">{compatReport.tierLabel}</span>
            </div>

            {/* Capability Pills */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className={`p-2 rounded text-center text-xs font-['JetBrains_Mono'] border ${
                compatReport.gamingCapabilities.fhd1080p
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                  : 'bg-[#15171B] border-[#33373D] text-[#9AA0A6]'
              }`}>
                1080p Ultra
              </div>

              <div className={`p-2 rounded text-center text-xs font-['JetBrains_Mono'] border ${
                compatReport.gamingCapabilities.qhd1440p
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                  : 'bg-[#15171B] border-[#33373D] text-[#9AA0A6]'
              }`}>
                1440p Gaming
              </div>

              <div className={`p-2 rounded text-center text-xs font-['JetBrains_Mono'] border ${
                compatReport.gamingCapabilities.uhd4k
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                  : 'bg-[#15171B] border-[#33373D] text-[#9AA0A6]'
              }`}>
                4K Ultra
              </div>

              <div className={`p-2 rounded text-center text-xs font-['JetBrains_Mono'] border ${
                compatReport.gamingCapabilities.streaming
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                  : 'bg-[#15171B] border-[#33373D] text-[#9AA0A6]'
              }`}>
                Streaming / Edición
              </div>
            </div>

            {/* Wattage estimate */}
            <div className="pt-2 border-t border-[#33373D]/60 flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
              <span>Consumo estimado:</span>
              <span className="text-[#EDEDE4] font-bold">~{compatReport.estimatedWattage}W (PSU recomendada: {compatReport.recommendedPsuWattage}W)</span>
            </div>
          </div>

          {/* Compatibility Alerts Box (MÓDULO 6) */}
          <div className="p-4 rounded-lg bg-[#1E2126] border border-[#33373D] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] uppercase tracking-wider font-bold">
                Módulo 6 · Compatibilidad
              </span>
              <span className={`text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded font-bold uppercase ${
                compatReport.status === 'compatible'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : compatReport.status === 'warning'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {compatReport.status === 'compatible' ? '🟢 Compatible' : compatReport.status === 'warning' ? '🟡 Advertencia' : '🔴 Incompatible'}
              </span>
            </div>

            {compatReport.issues.length === 0 ? (
              <p className="text-xs font-['Inter'] text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Excelente: todos los componentes seleccionados son 100% compatibles entre sí.</span>
              </p>
            ) : (
              <div className="space-y-2">
                {compatReport.issues.map(issue => (
                  <div
                    key={issue.id}
                    className={`p-2.5 rounded text-xs font-['Inter'] flex items-start gap-2 ${
                      issue.type === 'error'
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                        : issue.type === 'warning'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                        : 'bg-[#15171B] border border-[#33373D] text-[#9AA0A6]'
                    }`}
                  >
                    {issue.type === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <strong className="block font-['JetBrains_Mono'] text-[11px] uppercase">
                        {issue.title}
                      </strong>
                      <span className="text-[11px] opacity-90 leading-tight block mt-0.5">
                        {issue.message}
                      </span>
                      {issue.id === 'psu-power-low' && (
                        <button
                          type="button"
                          onClick={() => onOpenSelector('psu', 'Fuentes de Poder (750W+)')}
                          className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5C518]/15 hover:bg-[#F5C518]/25 text-[#F5C518] border border-[#F5C518]/40 font-['JetBrains_Mono'] text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Ver Fuentes de 750W / 850W publicadas</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget & Order CTA (MÓDULO 5) */}
          <div className="p-5 rounded-lg bg-gradient-to-b from-[#1E2126] to-[#15171B] border border-[#F5C518]/30 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                <span>Piezas Lote en Stock:</span>
                <span className="text-[#EDEDE4] font-bold">US$ {totalStock}</span>
              </div>

              {totalSpecial > 0 && (
                <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-blue-400">
                  <span>Piezas Especiales a Conseguir:</span>
                  <span className="font-bold">US$ {totalSpecial}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-['JetBrains_Mono'] font-bold text-[#EDEDE4] pt-2 border-t border-[#33373D]">
                <span className="text-[#F5C518]">PRESUPUESTO TOTAL:</span>
                <span className="text-2xl text-[#F5C518]">US$ {totalGeneral}</span>
              </div>
            </div>

            <button
              id="solicitar-pc-btn"
              onClick={onOpenOrderModal}
              disabled={selectedItems.length === 0}
              className="w-full py-3.5 px-4 bg-[#F5C518] hover:bg-[#C9A227] disabled:opacity-40 disabled:cursor-not-allowed text-[#15171B] font-['Rajdhani'] font-bold text-lg uppercase tracking-wider rounded transition-all shadow-lg shadow-[#F5C518]/20 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Solicitar esta PC al Dueño</span>
            </button>

            <p className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] text-center leading-relaxed">
              No es un cobro automático: genera un pedido formal por WhatsApp con piezas verificadas para coordinar armado y entrega.
            </p>

            <button
              onClick={() => setIsPcppModalOpen(true)}
              className="w-full py-2.5 px-3 bg-[#15171B] hover:bg-[#1E2126] border border-[#33373D] hover:border-[#4FBDB4] text-[#4FBDB4] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#4FBDB4]" />
              <span>Verificar / Exportar a PCPartPicker</span>
            </button>
          </div>

        </div>

      </div>

      {/* PCPartPicker Comparison Modal */}
      <PCPartPickerModal
        isOpen={isPcppModalOpen}
        onClose={() => setIsPcppModalOpen(false)}
        build={build}
      />
    </div>
  );
}
