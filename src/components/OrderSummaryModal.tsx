import { useState, useEffect } from 'react';
import { 
  X, Check, Copy, Printer, Send, 
  AlertTriangle, ShieldCheck, UserCheck, 
  FileText, ArrowRight, ArrowLeft, RefreshCw, 
  Trash2, Plus, Minus, ShoppingCart, Sparkles
} from 'lucide-react';
import { ActiveBuild, CustomerData, CompatibilityReport, ComponentCategory, Product } from '../types';
import { formatWhatsAppMessage } from '../utils/whatsapp';

interface OrderSummaryModalProps {
  build: ActiveBuild;
  compatReport: CompatibilityReport;
  onClose: () => void;
  initialStep?: 'summary' | 'verification';
  onRemoveComponent?: (category: ComponentCategory, accessoryIndex?: number) => void;
  onChangeComponent?: (category: ComponentCategory, label: string) => void;
  onUpdateQuantity?: (key: string, qty: number) => void;
  onOpenAddPiece?: () => void;
  onResetBuild?: () => void;
}

const STORAGE_KEY = 'elitech_customer_verification_v1';

interface SlotEntry {
  key: string;
  category: ComponentCategory;
  label: string;
  item: Product;
  accIndex?: number;
}

export function OrderSummaryModal({
  build,
  compatReport,
  onClose,
  initialStep = 'summary',
  onRemoveComponent,
  onChangeComponent,
  onUpdateQuantity,
  onOpenAddPiece,
  onResetBuild
}: OrderSummaryModalProps) {
  // Step state: 'summary' (piezas y presupuesto) or 'verification' (datos de compra)
  const [step, setStep] = useState<'summary' | 'verification'>(initialStep);

  // Customer verification form state
  const [customer, setCustomer] = useState<CustomerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return {
      nombre: '',
      telefono: '',
      documento: '',
      email: '',
      departamento: 'Retiro en mano / Local',
      ciudad: '',
      direccion: '',
      metodoPago: 'Efectivo en mano al retirar (USD o Pesos)',
      plazoCompra: 'Inmediata (Tengo el dinero listo hoy/mañana)',
      observaciones: '',
      confirmacionReal: false
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    } catch (e) {
      // ignore
    }
  }, [customer]);

  const rawSlots: { key: string; category: ComponentCategory; label: string; item: Product | null; accIndex?: number }[] = [
    { key: 'cpu', category: 'cpu', label: 'Procesador (CPU)', item: build.cpu },
    { key: 'motherboard', category: 'motherboard', label: 'Placa Madre (Motherboard)', item: build.motherboard },
    { key: 'ram', category: 'ram', label: 'Memoria RAM', item: build.ram },
    { key: 'gpu', category: 'gpu', label: 'Placa de Video (GPU)', item: build.gpu },
    { key: 'storage', category: 'storage', label: 'Almacenamiento (SSD)', item: build.storage },
    { key: 'psu', category: 'psu', label: 'Fuente de Poder (PSU)', item: build.psu },
    { key: 'case', category: 'case', label: 'Gabinete', item: build.case },
    { key: 'cooling', category: 'cooling', label: 'Refrigeración / Fans', item: build.cooling },
    { key: 'monitor', category: 'monitor', label: 'Monitor', item: build.monitor },
    ...build.accessories.map((acc, idx) => ({
      key: `acc-${idx}`,
      category: 'accessories' as ComponentCategory,
      label: `Accesorio ${idx + 1}`,
      item: acc,
      accIndex: idx
    }))
  ];

  const slots: SlotEntry[] = rawSlots.filter((s): s is SlotEntry => s.item !== null);

  // Missing components helper for quick-add pills
  const missingCoreCategories: { category: ComponentCategory; label: string }[] = [
    { category: 'cpu' as const, label: 'CPU' },
    { category: 'motherboard' as const, label: 'Motherboard' },
    { category: 'ram' as const, label: 'RAM' },
    { category: 'gpu' as const, label: 'Placa de Video' },
    { category: 'storage' as const, label: 'SSD' },
    { category: 'psu' as const, label: 'Fuente' },
    { category: 'case' as const, label: 'Gabinete' },
    { category: 'cooling' as const, label: 'Refrigeración' }
  ].filter(c => !build[c.category]);

  const totalCatalogo = slots.reduce((acc, s) => {
    const qty = (build.quantities && build.quantities[s.key]) || 1;
    return s.item && s.item.origen === 'CATALOGO' ? acc + (s.item.precio * qty) : acc;
  }, 0);

  const totalEspecial = slots.reduce((acc, s) => {
    const qty = (build.quantities && build.quantities[s.key]) || 1;
    return s.item && s.item.origen === 'PEDIDO_ESPECIAL' ? acc + (s.item.precio * qty) : acc;
  }, 0);

  const totalGeneral = totalCatalogo + totalEspecial;
  const totalUnits = slots.reduce((acc, s) => {
    return acc + ((build.quantities && build.quantities[s.key]) || 1);
  }, 0);

  // Validation function for real purchase
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!customer.nombre.trim() || customer.nombre.trim().length < 3) {
      errors.nombre = 'Ingresá tu nombre y apellido completo para registrar la reserva.';
    }

    if (!customer.documento.trim() || customer.documento.trim().length < 6) {
      errors.documento = 'Ingresá tu Cédula de Identidad (C.I.) o RUT para verificar la compra real y la garantía.';
    }

    if (!customer.telefono.trim() || customer.telefono.trim().length < 7) {
      errors.telefono = 'Ingresá un número de celular/WhatsApp válido (ej: 094 691 690).';
    }

    if (!customer.confirmacionReal) {
      errors.confirmacionReal = 'Debes marcar la casilla confirmando que es una solicitud de compra real.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSendWhatsApp() {
    if (slots.length === 0) return;

    if (!validateForm()) {
      setStep('verification');
      return;
    }

    const encoded = formatWhatsAppMessage(build, customer);
    const waUrl = `https://wa.me/59894691690?text=${encoded}`;
    window.open(waUrl, '_blank');
    setSubmittedSuccess(true);
  }

  function handleCopyText() {
    const rawText = decodeURIComponent(formatWhatsAppMessage(build, customer));
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#1E2126] border border-[#33373D] rounded-lg shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#33373D] flex items-center justify-between bg-[#15171B] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-['JetBrains_Mono'] text-[#F5C518] uppercase tracking-widest font-bold">
                  EliTech · Carrito y Presupuesto
                </span>
                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                  {slots.length} {slots.length === 1 ? 'Pieza' : 'Piezas'}
                  {totalUnits > slots.length ? ` · ${totalUnits} unidades` : ''}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
                {step === 'summary' ? 'Detalle de la Configuración y Presupuesto' : 'Formulario de Confirmación de Compra Real'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#33373D] transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-[#33373D] bg-[#1a1c20] flex-shrink-0">
          <button
            onClick={() => setStep('summary')}
            className={`flex-1 py-3 px-4 text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              step === 'summary'
                ? 'border-[#F5C518] text-[#F5C518] font-bold bg-[#F5C518]/5'
                : 'border-transparent text-[#9AA0A6] hover:text-[#EDEDE4]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Ver Piezas y Presupuesto ({slots.length}{totalUnits > slots.length ? ` · ${totalUnits} un.` : ''})</span>
          </button>

          <button
            onClick={() => setStep('verification')}
            className={`flex-1 py-3 px-4 text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              step === 'verification'
                ? 'border-[#25D366] text-[#25D366] font-bold bg-[#25D366]/5'
                : 'border-transparent text-[#9AA0A6] hover:text-[#EDEDE4]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Datos de Compra / WhatsApp</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-6">
          
          {submittedSuccess && (
            <div className="p-4 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-['Rajdhani'] font-bold text-base uppercase">
                  ¡Solicitud Verificada Abierta en WhatsApp!
                </h4>
                <p className="text-xs font-['Inter'] mt-0.5 leading-relaxed text-emerald-200">
                  Si tu navegador bloqueó la ventana emergente, hacé click en el botón verde inferior para abrir la conversación con EliTech (+598 94 691 690).
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: SUMMARY & BREAKDOWN (PRIMARY) */}
          {step === 'summary' && (
            <div className="space-y-5">
              
              {/* Compatibility Status Banner */}
              <div className={`p-3.5 rounded border flex items-center gap-3 ${
                compatReport.status === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : compatReport.status === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                {compatReport.status === 'error' ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                )}
                <div className="text-xs font-['JetBrains_Mono']">
                  <span className="font-bold uppercase tracking-wider block">
                    {compatReport.status === 'error' ? 'Atención: Advertencias de Compatibilidad' : 'Verificación de Hardware'}
                  </span>
                  <span className="text-opacity-90">
                    {compatReport.status === 'error'
                      ? 'Hay componentes con posibles diferencias. Podés cambiar piezas directamente aquí con el botón "Cambiar".'
                      : `Configuración balanceada para ${compatReport.tierLabel}. Consumo estimado: ~${compatReport.estimatedWattage}W.`}
                  </span>
                </div>
              </div>

              {/* Component Breakdown List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] flex items-center gap-2">
                    <span>Componentes en el Carrito ({slots.length})</span>
                    <span className="text-[10px] text-[#4FBDB4] font-normal hidden sm:inline">
                      · Podés cambiar o quitar piezas libremente
                    </span>
                  </h4>
                  <span className="text-xs text-[#F5C518] font-['JetBrains_Mono']">
                    Precios en USD
                  </span>
                </div>

                <div className="border border-[#33373D] rounded-lg divide-y divide-[#33373D] bg-[#15171B] overflow-hidden shadow-inner">
                  {slots.length === 0 ? (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#1E2126] border border-[#33373D] flex items-center justify-center mx-auto text-[#9AA0A6]">
                        <ShoppingCart className="w-6 h-6 opacity-40" />
                      </div>
                      <h5 className="font-['Rajdhani'] text-base font-bold text-[#EDEDE4] uppercase">
                        El carrito está vacío
                      </h5>
                      <p className="text-xs text-[#9AA0A6] max-w-sm mx-auto leading-relaxed">
                        No tenés piezas seleccionadas en este momento. Podés elegir componentes desde el catálogo para armar tu presupuesto a medida.
                      </p>
                      {onOpenAddPiece && (
                        <button
                          onClick={onOpenAddPiece}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#F5C518] hover:bg-[#E5B515] text-[#15171B] font-['JetBrains_Mono'] text-xs font-bold uppercase transition-all shadow-md active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Componentes</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    slots.map(({ key, category, label, item, accIndex }) => {
                      const isEspecial = item.origen === 'PEDIDO_ESPECIAL';
                      const qty = (build.quantities && build.quantities[key]) || 1;
                      const itemTotal = item.precio * qty;

                      return (
                        <div 
                          key={key} 
                          className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:bg-[#1E2126]/60 transition-colors group"
                        >
                          {/* Left: Component Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase font-bold">
                                {label}:
                              </span>
                              <span className={`text-[9px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded border uppercase font-semibold tracking-wide ${
                                isEspecial
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}>
                                {isEspecial ? '🔵 PEDIDO ESPECIAL' : '🟢 EN STOCK'}
                              </span>
                              {qty > 1 && (
                                <span className="text-[9px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-[#F5C518]/15 text-[#F5C518] border border-[#F5C518]/40 uppercase font-bold tracking-wide">
                                  x{qty} UNIDADES
                                </span>
                              )}
                              {item.marca && (
                                <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6]/70 uppercase">
                                  {item.marca}
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-[#EDEDE4] leading-snug">
                              {item.nombre}
                            </p>
                          </div>

                          {/* Right: Stepper, Price & Actions */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#33373D]/40">
                            
                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-[#15171B] border border-[#33373D] rounded overflow-hidden shadow-inner">
                              <button
                                type="button"
                                onClick={() => {
                                  if (qty > 1) {
                                    onUpdateQuantity?.(key, qty - 1);
                                  } else if (onRemoveComponent) {
                                    onRemoveComponent(category, accIndex);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#25282F] transition-colors"
                                title={qty > 1 ? "Reducir cantidad" : "Quitar del carrito"}
                                aria-label="Menos cantidad"
                              >
                                <Minus className="w-3 h-3" />
                              </button>

                              <span className="w-7 text-center font-['JetBrains_Mono'] font-bold text-xs text-[#EDEDE4] select-none">
                                {qty}
                              </span>

                              <button
                                type="button"
                                onClick={() => onUpdateQuantity?.(key, qty + 1)}
                                className="w-7 h-7 flex items-center justify-center text-[#9AA0A6] hover:text-[#F5C518] hover:bg-[#25282F] transition-colors"
                                title="Pedir más de una unidad de esta pieza"
                                aria-label="Más cantidad"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price display: Total for this item and unit price breakdown */}
                            <div className="text-right min-w-[75px]">
                              <span className="font-['JetBrains_Mono'] font-bold text-base text-[#F5C518] whitespace-nowrap block">
                                US$ {itemTotal}
                              </span>
                              {qty > 1 && (
                                <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] whitespace-nowrap block">
                                  US$ {item.precio} c/u
                                </span>
                              )}
                            </div>

                            {/* Actions (Cambiar / Quitar) */}
                            <div className="flex items-center gap-1.5">
                              {onChangeComponent && (
                                <button
                                  type="button"
                                  onClick={() => onChangeComponent(category, label)}
                                  className="px-2.5 py-1.5 rounded bg-[#1E2126] hover:bg-[#2A2E35] text-[#4FBDB4] border border-[#4FBDB4]/30 hover:border-[#4FBDB4] text-xs font-['JetBrains_Mono'] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                                  title={`Cambiar ${label}`}
                                >
                                  <RefreshCw className="w-3 h-3 text-[#4FBDB4]" />
                                  <span className="font-semibold">Cambiar</span>
                                </button>
                              )}

                              {onRemoveComponent && (
                                <button
                                  type="button"
                                  onClick={() => onRemoveComponent(category, accIndex)}
                                  className="p-1.5 rounded bg-[#1E2126] hover:bg-rose-500/20 text-[#9AA0A6] hover:text-rose-400 border border-[#33373D] hover:border-rose-500/40 transition-all active:scale-95"
                                  title={`Quitar ${label} del carrito`}
                                  aria-label={`Quitar ${label}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* List Actions Toolbar */}
                  {slots.length > 0 && (
                    <div className="p-3 bg-[#181B1F] flex flex-wrap items-center justify-between gap-2 border-t border-[#33373D]">
                      {onOpenAddPiece && (
                        <button
                          type="button"
                          onClick={onOpenAddPiece}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1E2126] hover:bg-[#25282F] text-[#EDEDE4] border border-[#33373D] hover:border-[#4FBDB4] text-xs font-['JetBrains_Mono'] uppercase transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#4FBDB4]" />
                          <span>+ Agregar otra pieza</span>
                        </button>
                      )}

                      {onResetBuild && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('¿Seguro que querés vaciar todos los componentes del carrito?')) {
                              onResetBuild();
                            }
                          }}
                          className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] hover:text-rose-400 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Vaciar carrito</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Add Suggestions for Missing Core Components */}
                {missingCoreCategories.length > 0 && onChangeComponent && (
                  <div className="mt-3 p-3 rounded bg-[#15171B] border border-[#33373D]/60 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#F5C518]" />
                      <span>Piezas faltantes en la PC:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {missingCoreCategories.map(missing => (
                        <button
                          key={missing.category}
                          type="button"
                          onClick={() => onChangeComponent(missing.category, missing.label)}
                          className="px-2 py-0.5 rounded bg-[#1E2126] hover:bg-[#2A2E35] border border-[#33373D] hover:border-[#F5C518] text-[10px] font-['JetBrains_Mono'] text-[#EDEDE4] hover:text-[#F5C518] transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>{missing.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Subtotals & Total Box */}
              <div className="p-4 rounded-lg bg-[#15171B] border border-[#33373D] space-y-2">
                <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                  <span>Total Unidades:</span>
                  <span className="text-[#EDEDE4] font-semibold">
                    {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'} ({slots.length} {slots.length === 1 ? 'pieza distinta' : 'piezas distintas'})
                  </span>
                </div>
                <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                  <span>Subtotal Piezas del Lote en Stock:</span>
                  <span className="text-[#EDEDE4] font-semibold">US$ {totalCatalogo}</span>
                </div>
                {totalEspecial > 0 && (
                  <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                    <span>Subtotal Piezas Especiales a Conseguir:</span>
                    <span className="text-blue-400 font-semibold">US$ {totalEspecial}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-['JetBrains_Mono'] font-bold text-[#EDEDE4] pt-2 border-t border-[#33373D]">
                  <span className="text-[#F5C518]">PRESUPUESTO TOTAL ESTIMADO:</span>
                  <span className="text-2xl text-[#F5C518] tracking-tight">US$ {totalGeneral}</span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: VERIFICATION FORM */}
          {step === 'verification' && (
            <div className="space-y-5">
              
              {/* Security Notice */}
              <div className="p-4 rounded-lg bg-[#15171B] border border-[#25D366]/30 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-['JetBrains_Mono'] font-bold text-[#EDEDE4] uppercase tracking-wider block">
                    Confirmación de Compra Real y Reserva de Hardware Físico
                  </span>
                  <p className="text-[#9AA0A6] leading-relaxed">
                    Para evitar consultas ficticias, asegurar stock del lote físico y emitir la garantía formal de tu equipo, te pedimos completar los siguientes datos antes de enviar tu pedido al WhatsApp del dueño.
                  </p>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="p-3 rounded bg-[#15171B] border border-[#33373D] flex items-center justify-between text-xs font-['JetBrains_Mono']">
                <span className="text-[#9AA0A6]">
                  Presupuesto Total ({slots.length} piezas{totalUnits > slots.length ? ` · ${totalUnits} unidades` : ''}):
                </span>
                <span className="text-base font-bold text-[#F5C518]">
                  US$ {totalGeneral}
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                
                {/* Nombre y Apellido */}
                <div>
                  <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                    Nombre y Apellido Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Martín Rodríguez"
                    value={customer.nombre}
                    onChange={(e) => {
                      setCustomer({ ...customer, nombre: e.target.value });
                      if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: '' });
                    }}
                    className={`w-full px-3 py-2 bg-[#15171B] border rounded text-sm text-[#EDEDE4] focus:outline-none transition-colors ${
                      formErrors.nombre ? 'border-rose-500 focus:border-rose-400' : 'border-[#33373D] focus:border-[#25D366]'
                    }`}
                  />
                  {formErrors.nombre && (
                    <span className="text-[11px] text-rose-400 font-['JetBrains_Mono'] mt-1 block">
                      ⚠️ {formErrors.nombre}
                    </span>
                  )}
                </div>

                {/* C.I. y Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                      Cédula de Identidad (C.I.) o RUT *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 4.892.123-5"
                      value={customer.documento}
                      onChange={(e) => {
                        setCustomer({ ...customer, documento: e.target.value });
                        if (formErrors.documento) setFormErrors({ ...formErrors, documento: '' });
                      }}
                      className={`w-full px-3 py-2 bg-[#15171B] border rounded text-sm text-[#EDEDE4] focus:outline-none transition-colors ${
                        formErrors.documento ? 'border-rose-500 focus:border-rose-400' : 'border-[#33373D] focus:border-[#25D366]'
                      }`}
                    />
                    {formErrors.documento && (
                      <span className="text-[11px] text-rose-400 font-['JetBrains_Mono'] mt-1 block">
                        ⚠️ {formErrors.documento}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 094 691 690"
                      value={customer.telefono}
                      onChange={(e) => {
                        setCustomer({ ...customer, telefono: e.target.value });
                        if (formErrors.telefono) setFormErrors({ ...formErrors, telefono: '' });
                      }}
                      className={`w-full px-3 py-2 bg-[#15171B] border rounded text-sm text-[#EDEDE4] focus:outline-none transition-colors ${
                        formErrors.telefono ? 'border-rose-500 focus:border-rose-400' : 'border-[#33373D] focus:border-[#25D366]'
                      }`}
                    />
                    {formErrors.telefono && (
                      <span className="text-[11px] text-rose-400 font-['JetBrains_Mono'] mt-1 block">
                        ⚠️ {formErrors.telefono}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email (opcional) */}
                <div>
                  <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5">
                    Email de contacto (opcional, para envío de comprobante de garantía)
                  </label>
                  <input
                    type="email"
                    placeholder="Ej: usuario@gmail.com"
                    value={customer.email || ''}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                  />
                </div>

                {/* Modalidad de Entrega */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                      Modalidad y Zona de Entrega
                    </label>
                    <select
                      value={customer.departamento}
                      onChange={(e) => setCustomer({ ...customer, departamento: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                    >
                      <option value="Retiro en mano / Local">Retiro en mano / Local EliTech</option>
                      <option value="Envío a domicilio">Envío a domicilio</option>
                      <option value="Envío por Agencia">Envío por Agencia</option>
                      <option value="A coordinar con el vendedor">A coordinar con el vendedor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5">
                      Dirección o Barrio (si aplica)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Dirección particular o agencia de retiro"
                      value={customer.direccion || ''}
                      onChange={(e) => setCustomer({ ...customer, direccion: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                    />
                  </div>
                </div>

                {/* Método de Pago y Plazo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                      Forma de pago prevista
                    </label>
                    <select
                      value={customer.metodoPago}
                      onChange={(e) => setCustomer({ ...customer, metodoPago: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                    >
                      <option value="Efectivo en mano al retirar (USD o Pesos)">Efectivo en mano al retirar (USD o Pesos)</option>
                      <option value="Transferencia Bancaria (BROU / Santander / Itaú / BBVA)">Transferencia Bancaria (BROU, Santander, Itaú, BBVA)</option>
                      <option value="Prex / Midinero">Prex / Midinero</option>
                      <option value="Tarjeta de Crédito en cuotas (Mercado Pago)">Tarjeta de Crédito en cuotas (Mercado Pago)</option>
                      <option value="Combinado (Parte efectivo + Parte transferencia)">Combinado (Parte efectivo + Parte transferencia)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                      Plazo en que deseás concretar
                    </label>
                    <select
                      value={customer.plazoCompra}
                      onChange={(e) => setCustomer({ ...customer, plazoCompra: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                    >
                      <option value="Inmediata (Tengo el dinero listo hoy/mañana)">Inmediata (Tengo el dinero listo hoy/mañana)</option>
                      <option value="En los próximos 3 a 5 días">En los próximos 3 a 5 días</option>
                      <option value="Fin de mes / Próxima quincena">Fin de mes / Próxima quincena</option>
                    </select>
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5">
                    Observaciones o dudas técnicas (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: ¿Pueden instalar Windows 11 de prueba? ¿Puedo llevar mi disco duro anterior para que lo conecten?"
                    value={customer.observaciones}
                    onChange={(e) => setCustomer({ ...customer, observaciones: e.target.value })}
                    className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                  />
                </div>

                {/* Compra Real Declaration Checkbox */}
                <div className={`p-3.5 rounded border transition-colors ${
                  formErrors.confirmacionReal
                    ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                    : 'bg-[#15171B] border-[#33373D] text-[#EDEDE4]'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={customer.confirmacionReal}
                      onChange={(e) => {
                        setCustomer({ ...customer, confirmacionReal: e.target.checked });
                        if (formErrors.confirmacionReal) setFormErrors({ ...formErrors, confirmacionReal: '' });
                      }}
                      className="w-4 h-4 mt-0.5 accent-[#25D366] rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold font-['JetBrains_Mono'] uppercase block">
                        Confirmo que es una solicitud de compra real *
                      </span>
                      <span className="text-[#9AA0A6] text-[11px] block mt-0.5">
                        Declaro que mis datos son verdaderos y solicito formalmente la cotización y reserva del hardware al dueño de EliTech.
                      </span>
                    </div>
                  </label>
                  {formErrors.confirmacionReal && (
                    <span className="text-[11px] text-rose-400 font-bold block mt-1.5 pl-7">
                      ⚠️ {formErrors.confirmacionReal}
                    </span>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-[#15171B] border-t border-[#33373D] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {step === 'verification' ? (
              <button
                type="button"
                onClick={() => setStep('summary')}
                className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a las Piezas</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep('verification')}
                className="px-3.5 py-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/40 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-bold"
              >
                <span>Cargar Datos de Compra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyText}
              disabled={slots.length === 0}
              className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] disabled:opacity-40 text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              title="Copiar texto del pedido"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={slots.length === 0}
              className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] disabled:opacity-40 text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              title="Imprimir resumen"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="confirmar-y-abrir-whatsapp-btn"
            type="button"
            onClick={handleSendWhatsApp}
            disabled={slots.length === 0}
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] disabled:opacity-40 text-black font-['Rajdhani'] font-bold text-base uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 group"
          >
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span>Confirmar Compra Real y Abrir WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
