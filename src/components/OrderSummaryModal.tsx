import { useState, useEffect } from 'react';
import { 
  X, Check, Copy, Printer, MessageSquare, Send, 
  AlertTriangle, ShieldCheck, UserCheck, CreditCard, 
  MapPin, Calendar, FileText, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { ActiveBuild, CustomerData, CompatibilityReport } from '../types';
import { formatWhatsAppMessage } from '../utils/whatsapp';

interface OrderSummaryModalProps {
  build: ActiveBuild;
  compatReport: CompatibilityReport;
  onClose: () => void;
  initialStep?: 'summary' | 'verification';
}

const STORAGE_KEY = 'elitech_customer_verification_v1';

export function OrderSummaryModal({
  build,
  compatReport,
  onClose,
  initialStep = 'verification'
}: OrderSummaryModalProps) {
  // Step state: 'summary' or 'verification'
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
      departamento: 'Montevideo (Retiro en mano / Local)',
      ciudad: 'Montevideo',
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

  const slots = [
    { key: 'cpu', label: 'Procesador (CPU)', item: build.cpu },
    { key: 'motherboard', label: 'Placa Madre (Motherboard)', item: build.motherboard },
    { key: 'ram', label: 'Memoria RAM', item: build.ram },
    { key: 'gpu', label: 'Placa de Video (GPU)', item: build.gpu },
    { key: 'storage', label: 'Almacenamiento (SSD)', item: build.storage },
    { key: 'psu', label: 'Fuente de Poder (PSU)', item: build.psu },
    { key: 'case', label: 'Gabinete', item: build.case },
    { key: 'cooling', label: 'Refrigeración / Fans', item: build.cooling },
    { key: 'monitor', label: 'Monitor', item: build.monitor },
    ...build.accessories.map((acc, idx) => ({ key: `acc-${idx}`, label: `Accesorio ${idx + 1}`, item: acc }))
  ].filter(s => s.item !== null);

  const totalCatalogo = slots.reduce((acc, s) => {
    return s.item && s.item.origen === 'CATALOGO' ? acc + s.item.precio : acc;
  }, 0);

  const totalEspecial = slots.reduce((acc, s) => {
    return s.item && s.item.origen === 'PEDIDO_ESPECIAL' ? acc + s.item.precio : acc;
  }, 0);

  const totalGeneral = totalCatalogo + totalEspecial;

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
        className="relative w-full max-w-3xl bg-[#1E2126] border border-[#33373D] rounded-lg shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top */}
        <div className="p-4 sm:p-5 border-b border-[#33373D] flex items-center justify-between bg-[#15171B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-['JetBrains_Mono'] text-[#F5C518] uppercase tracking-widest font-bold">
                  EliTech Montevideo · WhatsApp Directo
                </span>
                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                  Verificación de Compra Real
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
                {step === 'verification' ? 'Formulario de Confirmación de Compra Real' : 'Detalle de la Configuración de PC'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#33373D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-[#33373D] bg-[#1a1c20]">
          <button
            onClick={() => setStep('verification')}
            className={`flex-1 py-3 px-4 text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              step === 'verification'
                ? 'border-[#25D366] text-[#25D366] font-bold bg-[#25D366]/5'
                : 'border-transparent text-[#9AA0A6] hover:text-[#EDEDE4]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. Datos de Compra Real (Requerido)</span>
          </button>

          <button
            onClick={() => setStep('summary')}
            className={`flex-1 py-3 px-4 text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              step === 'summary'
                ? 'border-[#F5C518] text-[#F5C518] font-bold bg-[#F5C518]/5'
                : 'border-transparent text-[#9AA0A6] hover:text-[#EDEDE4]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Ver Piezas y Presupuesto ({slots.length})</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 max-h-[68vh] overflow-y-auto space-y-6">
          
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

          {/* STEP 1: VERIFICATION FORM */}
          {step === 'verification' && (
            <div className="space-y-5">
              
              {/* Security & Anti-Fraud Notice */}
              <div className="p-4 rounded-lg bg-[#15171B] border border-[#25D366]/30 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-['JetBrains_Mono'] font-bold text-[#EDEDE4] uppercase tracking-wider block">
                    Confirmación de Compra Real y Reserva de Hardware Físico
                  </span>
                  <p className="text-[#9AA0A6] leading-relaxed">
                    Para evitar consultas ficticias, asegurar stock del lote físico en Montevideo y emitir la garantía formal de tu equipo, te pedimos completar los siguientes datos antes de enviar tu pedido al WhatsApp del dueño.
                  </p>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="p-3 rounded bg-[#15171B] border border-[#33373D] flex items-center justify-between text-xs font-['JetBrains_Mono']">
                <span className="text-[#9AA0A6]">
                  Presupuesto Total Estimado ({slots.length} piezas):
                </span>
                <span className="text-base font-bold text-[#F5C518]">
                  US$ {totalGeneral}
                </span>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                
                {/* Nombre y Documento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5 flex items-center justify-between">
                      <span>Nombre y Apellido completo *</span>
                      <span className="text-[10px] text-rose-400">Requerido</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Martín Rodríguez"
                      value={customer.nombre}
                      onChange={(e) => {
                        setCustomer({ ...customer, nombre: e.target.value });
                        if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: '' });
                      }}
                      className={`w-full px-3 py-2 bg-[#15171B] border rounded text-sm text-[#EDEDE4] focus:outline-none ${
                        formErrors.nombre ? 'border-rose-500' : 'border-[#33373D] focus:border-[#25D366]'
                      }`}
                    />
                    {formErrors.nombre && (
                      <span className="text-[11px] text-rose-400 block mt-1">
                        {formErrors.nombre}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5 flex items-center justify-between">
                      <span>Cédula de Identidad (C.I.) o RUT *</span>
                      <span className="text-[10px] text-rose-400">Garantía oficial</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 4.892.123-4 o RUT de empresa"
                      value={customer.documento}
                      onChange={(e) => {
                        setCustomer({ ...customer, documento: e.target.value });
                        if (formErrors.documento) setFormErrors({ ...formErrors, documento: '' });
                      }}
                      className={`w-full px-3 py-2 bg-[#15171B] border rounded text-sm text-[#EDEDE4] focus:outline-none ${
                        formErrors.documento ? 'border-rose-500' : 'border-[#33373D] focus:border-[#25D366]'
                      }`}
                    />
                    {formErrors.documento && (
                      <span className="text-[11px] text-rose-400 block mt-1">
                        {formErrors.documento}
                      </span>
                    )}
                  </div>
                </div>

                {/* Teléfono y Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5 flex items-center justify-between">
                      <span>Celular / WhatsApp activo *</span>
                      <span className="text-[10px] text-rose-400">Requerido</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 094 123 456"
                      value={customer.telefono}
                      onChange={(e) => {
                        setCustomer({ ...customer, telefono: e.target.value });
                        if (formErrors.telefono) setFormErrors({ ...formErrors, telefono: '' });
                      }}
                      className={`w-full px-3 py-2 bg-[#15171B] border rounded text-sm text-[#EDEDE4] focus:outline-none ${
                        formErrors.telefono ? 'border-rose-500' : 'border-[#33373D] focus:border-[#25D366]'
                      }`}
                    />
                    {formErrors.telefono && (
                      <span className="text-[11px] text-rose-400 block mt-1">
                        {formErrors.telefono}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5 flex items-center justify-between">
                      <span>Correo Electrónico</span>
                      <span className="text-[10px] text-[#9AA0A6]">Opcional</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Ej: martin@gmail.com"
                      value={customer.email || ''}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                    />
                  </div>
                </div>

                {/* Ubicación y Entrega */}
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
                      <option value="Montevideo (Retiro en mano / Local)">Montevideo (Retiro en mano / Local EliTech)</option>
                      <option value="Montevideo (Envío a domicilio)">Montevideo (Envío a domicilio)</option>
                      <option value="Canelones / Ciudad de la Costa">Canelones / Ciudad de la Costa</option>
                      <option value="Maldonado / Punta del Este">Maldonado / Punta del Este</option>
                      <option value="Interior del país (Envío por DAC / Agencia Central)">Interior del país (Envío por DAC / Agencia)</option>
                      <option value="Otro departamento">Otro departamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5">
                      Dirección o Barrio (si aplica)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Pocitos, Cordón, o agencia de retiro"
                      value={customer.direccion || ''}
                      onChange={(e) => setCustomer({ ...customer, direccion: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#25D366]"
                    />
                  </div>
                </div>

                {/* Forma de Pago y Plazo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#EDEDE4] mb-1.5">
                      Forma de Pago Prevista
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

          {/* STEP 2: SUMMARY & BREAKDOWN */}
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
                      ? 'Hay componentes con posibles diferencias. El dueño revisará la viabilidad técnica antes del armado.'
                      : `Configuración balanceada para ${compatReport.tierLabel}. Consumo estimado: ~${compatReport.estimatedWattage}W.`}
                  </span>
                </div>
              </div>

              {/* Component Breakdown List */}
              <div>
                <h4 className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-2 flex items-center justify-between">
                  <span>Piezas Seleccionadas ({slots.length})</span>
                  <span className="text-xs text-[#F5C518]">Precios en USD</span>
                </h4>

                <div className="border border-[#33373D] rounded divide-y divide-[#33373D] bg-[#15171B]">
                  {slots.length === 0 ? (
                    <div className="p-6 text-center text-sm text-[#9AA0A6]">
                      Aún no has agregado componentes a la PC.
                    </div>
                  ) : (
                    slots.map(({ key, label, item }) => {
                      if (!item) return null;
                      const isEspecial = item.origen === 'PEDIDO_ESPECIAL';

                      return (
                        <div key={key} className="p-3 flex items-center justify-between gap-3 text-sm">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase">
                                {label}:
                              </span>
                              <span className={`text-[9px] font-['JetBrains_Mono'] px-1.5 py-0.2 rounded border ${
                                isEspecial
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}>
                                {isEspecial ? '🔵 PEDIDO ESPECIAL' : '🟢 LOTE DISPONIBLE'}
                              </span>
                            </div>
                            <p className="font-medium text-[#EDEDE4] truncate">
                              {item.nombre}
                            </p>
                          </div>

                          <span className="font-['JetBrains_Mono'] font-bold text-sm text-[#F5C518] whitespace-nowrap">
                            US$ {item.precio}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Subtotals Box */}
              <div className="p-4 rounded bg-[#15171B] border border-[#33373D] space-y-1.5">
                <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                  <span>Subtotal Piezas del Lote en Stock:</span>
                  <span className="text-[#EDEDE4]">US$ {totalCatalogo}</span>
                </div>
                {totalEspecial > 0 && (
                  <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                    <span>Subtotal Piezas Especiales a Conseguir:</span>
                    <span className="text-blue-400">US$ {totalEspecial}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-['JetBrains_Mono'] font-bold text-[#EDEDE4] pt-2 border-t border-[#33373D]">
                  <span className="text-[#F5C518]">PRESUPUESTO TOTAL ESTIMADO:</span>
                  <span className="text-xl text-[#F5C518]">US$ {totalGeneral}</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-[#15171B] border-t border-[#33373D] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {step === 'verification' ? (
              <button
                onClick={() => setStep('summary')}
                className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Revisar Piezas</span>
              </button>
            ) : (
              <button
                onClick={() => setStep('verification')}
                className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Formulario</span>
              </button>
            )}

            <button
              onClick={handleCopyText}
              className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-[#1E2126] hover:bg-[#24282E] text-[#EDEDE4] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="confirmar-y-abrir-whatsapp-btn"
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
