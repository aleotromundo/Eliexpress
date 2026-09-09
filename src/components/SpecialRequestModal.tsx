import { useState, FormEvent } from 'react';
import { X, Search, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ComponentCategory, Product } from '../types';

interface SpecialRequestModalProps {
  initialCategory?: ComponentCategory;
  onAddSpecialProduct: (product: Product) => void;
  onClose: () => void;
}

const CATEGORY_NAMES: Record<ComponentCategory, string> = {
  cpu: 'Procesador (CPU)',
  motherboard: 'Placa Madre (Motherboard)',
  ram: 'Memoria RAM',
  gpu: 'Placa de Video (GPU)',
  storage: 'Almacenamiento (SSD/HDD)',
  psu: 'Fuente de Poder (PSU)',
  case: 'Gabinete',
  cooling: 'Refrigeración / Fans',
  monitor: 'Monitor',
  accessories: 'Periféricos / Otros'
};

export function SpecialRequestModal({
  initialCategory = 'cpu',
  onAddSpecialProduct,
  onClose
}: SpecialRequestModalProps) {
  const [category, setCategory] = useState<ComponentCategory>(initialCategory);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [identifiedData, setIdentifiedData] = useState<any>(null);
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [userNotes, setUserNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSearch(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/identify-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category })
      });

      if (!res.ok) throw new Error('Error al identificar el componente');
      const data = await res.json();
      setIdentifiedData(data);
      if (data.estimatedPriceUSD) {
        setCustomPrice(data.estimatedPriceUSD);
      }
    } catch (err: any) {
      setErrorMsg('No se pudo identificar automáticamente. Puedes ingresar los datos manualmente.');
      // Manual fallback
      setIdentifiedData({
        suggestedModel: query.toUpperCase(),
        brand: query.split(' ')[0] || 'Genérica',
        category,
        specs: [`Componente solicitado: ${query}`, 'A cotizar por el dueño de EliTech'],
        compat: {},
        estimatedPriceUSD: 100
      });
      setCustomPrice(100);
    } finally {
      setIsSearching(false);
    }
  }

  function handleConfirm() {
    if (!identifiedData) return;

    const finalProduct: Product = {
      id: `special-${Date.now()}`,
      categoria: category,
      marca: identifiedData.brand || 'Especial',
      modelo: identifiedData.suggestedModel || query,
      nombre: identifiedData.suggestedModel || query,
      precio: Number(customPrice) || identifiedData.estimatedPriceUSD || 0,
      moneda: 'USD',
      imagen: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
      stock: 0,
      especificaciones: [
        ...(identifiedData.specs || []),
        userNotes ? `Nota del cliente: ${userNotes}` : 'Solicitud especial a conseguir por el dueño'
      ],
      compatibilidad: identifiedData.compat || {},
      origen: 'PEDIDO_ESPECIAL',
      estado: 'A_CONSEGUIR',
      observaciones: userNotes || 'Pieza fuera de catálogo solicitada especialmente para esta PC.'
    };

    onAddSpecialProduct(finalProduct);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#1E2126] border border-[#33373D] rounded-lg shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#33373D] flex items-center justify-between bg-[#15171B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#4FBDB4]/15 border border-[#4FBDB4]/30 flex items-center justify-center text-[#4FBDB4]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-['JetBrains_Mono'] text-[#4FBDB4] uppercase tracking-widest">
                Módulo D · Solicitud personalizada
              </span>
              <h3 className="text-xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
                Pedir Producto Fuera de Catálogo
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

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] leading-relaxed">
            ¿Buscás una pieza que no está en el lote? (ej. Ryzen 7 7800X3D, RTX 4070 Super, Corsair 750W). Escribí el nombre y nuestra IA identificará los detalles técnicos y compatibilidad para que el dueño la consiga con su proveedor.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5">
                Categoría del componente
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComponentCategory)}
                className="w-full px-3 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#F5C518]"
              >
                {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#9AA0A6] mb-1.5">
                Modelo o nombre que buscás
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej: Ryzen 7 7800X3D, RTX 4070..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  className="w-full pl-3 pr-24 py-2 bg-[#15171B] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#F5C518]"
                />
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  disabled={isSearching || !query.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#F5C518] hover:bg-[#C9A227] disabled:opacity-50 text-[#15171B] text-xs font-bold font-['JetBrains_Mono'] uppercase rounded transition-colors flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  {isSearching ? '...' : 'Buscar'}
                </button>
              </div>
            </div>
          </div>

          {/* Identification Results Card */}
          {identifiedData && (
            <div className="p-4 rounded border border-[#4FBDB4]/40 bg-[#15171B] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4FBDB4]" />
                  <span className="text-xs font-['JetBrains_Mono'] text-[#4FBDB4] uppercase tracking-wider font-bold">
                    Componente Identificado
                  </span>
                </div>
                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
                  🔵 Pedido Especial — A Conseguir
                </span>
              </div>

              <h4 className="text-lg font-['Rajdhani'] font-bold text-[#EDEDE4]">
                {identifiedData.suggestedModel}
              </h4>

              <ul className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] space-y-1 border-t border-[#33373D]/60 pt-2">
                {identifiedData.specs?.map((spec: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#F5C518]">›</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              {/* Price adjustment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#33373D]/60">
                <div>
                  <label className="block text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] mb-1">
                    Presupuesto / Precio Estimado (USD):
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#1E2126] border border-[#33373D] rounded text-sm text-[#F5C518] font-bold font-['JetBrains_Mono'] focus:outline-none focus:border-[#F5C518]"
                  />
                  <span className="text-[10px] text-[#9AA0A6] block mt-0.5">
                    *El dueño confirmará el valor final según disponibilidad.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6] mb-1">
                    Observación o preferencia (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: color blanco, marca MSI, etc."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1E2126] border border-[#33373D] rounded text-sm text-[#EDEDE4] focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#15171B] border-t border-[#33373D] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-['JetBrains_Mono'] text-[#9AA0A6] hover:text-[#EDEDE4] uppercase"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={!identifiedData}
            className="px-5 py-2.5 bg-[#F5C518] hover:bg-[#C9A227] disabled:opacity-40 disabled:cursor-not-allowed text-[#15171B] font-bold text-xs font-['JetBrains_Mono'] uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-lg shadow-[#F5C518]/10"
          >
            <span>Agregar a la PC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
