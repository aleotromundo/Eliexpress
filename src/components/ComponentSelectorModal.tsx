import { useState } from 'react';
import { X, Check, AlertTriangle, Search, PlusCircle, Layers, Cpu, CircuitBoard, Monitor, HardDrive, Zap, Box, Fan, ExternalLink } from 'lucide-react';
import { ComponentCategory, Product, ActiveBuild } from '../types';
import { CATALOG_PRODUCTS } from '../data/catalog';

interface ComponentSelectorModalProps {
  category: ComponentCategory | 'all';
  categoryLabel: string;
  currentBuild: ActiveBuild;
  onSelectProduct: (product: Product) => void;
  onOpenSpecialRequest: (cat: ComponentCategory) => void;
  onClose: () => void;
}

const CATEGORY_TABS: { id: ComponentCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'Todas las piezas', icon: Layers },
  { id: 'cpu', label: 'Procesadores', icon: Cpu },
  { id: 'motherboard', label: 'Motherboards', icon: CircuitBoard },
  { id: 'ram', label: 'Memorias RAM', icon: Layers },
  { id: 'gpu', label: 'Placas de Video', icon: Monitor },
  { id: 'storage', label: 'Almacenamiento', icon: HardDrive },
  { id: 'psu', label: 'Fuentes de Poder', icon: Zap },
  { id: 'case', label: 'Gabinetes', icon: Box },
  { id: 'cooling', label: 'Ventiladores', icon: Fan },
  { id: 'monitor', label: 'Monitores', icon: Monitor }
];

export function ComponentSelectorModal({
  category: initialCategory,
  categoryLabel: initialLabel,
  currentBuild,
  onSelectProduct,
  onOpenSpecialRequest,
  onClose
}: ComponentSelectorModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>(initialCategory);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'stock' | 'recommended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products by selected category or all
  const categoryProducts = selectedCategory === 'all'
    ? CATALOG_PRODUCTS
    : CATALOG_PRODUCTS.filter(p => p.categoria === selectedCategory);

  // Filter by source and search term
  const filteredProducts = categoryProducts.filter(p => {
    const matchesSource = 
      sourceFilter === 'all' ||
      (sourceFilter === 'stock' && p.origen === 'CATALOGO') ||
      (sourceFilter === 'recommended' && p.origen === 'PEDIDO_ESPECIAL');

    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.especificaciones.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSource && matchesSearch;
  });

  // Check compatibility per item with current build
  function getCompatibilityTag(prod: Product): { isCompatible: boolean; reason?: string } {
    if (prod.categoria === 'ram' && currentBuild.motherboard) {
      const mbRam = currentBuild.motherboard.compatibilidad.ramType;
      const itemRam = prod.compatibilidad.ramType;
      if (mbRam && itemRam && mbRam !== itemRam) {
        return { isCompatible: false, reason: `Incompatible: Tu motherboard usa ${mbRam}` };
      }
    }

    if (prod.categoria === 'motherboard' && currentBuild.cpu) {
      const cpuSocket = currentBuild.cpu.compatibilidad.socket;
      const mbSocket = prod.compatibilidad.socket;
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        return { isCompatible: false, reason: `Incompatible: Tu procesador es ${cpuSocket}` };
      }
    }

    if (prod.categoria === 'cpu' && currentBuild.motherboard) {
      const mbSocket = currentBuild.motherboard.compatibilidad.socket;
      const cpuSocket = prod.compatibilidad.socket;
      if (mbSocket && cpuSocket && mbSocket !== cpuSocket) {
        return { isCompatible: false, reason: `Incompatible: Tu motherboard tiene socket ${mbSocket}` };
      }
    }

    if (prod.categoria === 'gpu' && currentBuild.psu) {
      const psuWatts = currentBuild.psu.compatibilidad.tdp || 650;
      const recWatts = prod.compatibilidad.recommendedPsuWatts || 600;
      if (psuWatts < recWatts - 50) {
        return { isCompatible: true, reason: `Recomendado ${recWatts}W (tu fuente es ${psuWatts}W)` };
      }
    }

    if (prod.categoria === 'psu' && currentBuild.gpu) {
      const psuWatts = prod.compatibilidad.tdp || 650;
      const recWatts = currentBuild.gpu.compatibilidad.recommendedPsuWatts || 600;
      if (psuWatts < recWatts - 50) {
        return { isCompatible: false, reason: `Ajustada: Tu placa (${currentBuild.gpu.nombre}) recomienda ${recWatts}W` };
      }
    }

    return { isCompatible: true };
  }

  const currentCategoryLabel = CATEGORY_TABS.find(t => t.id === selectedCategory)?.label || initialLabel;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#1E2126] border border-[#33373D] rounded-lg shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#33373D] flex items-center justify-between bg-[#15171B]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-['JetBrains_Mono'] text-[#F5C518] uppercase tracking-widest font-bold">
                Catálogo de Hardware EliTech · Lote 01-A
              </span>
              <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#4FBDB4]/15 text-[#4FBDB4] border border-[#4FBDB4]/30 uppercase">
                {filteredProducts.length} disponibles
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
              Elegir Componente: {currentCategoryLabel}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#33373D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Switcher Tabs - Allows viewing ALL pieces or filtering */}
        <div className="border-b border-[#33373D] bg-[#1a1c20] px-3 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'all' 
              ? CATALOG_PRODUCTS.length 
              : CATALOG_PRODUCTS.filter(p => p.categoria === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-[#F5C518] text-[#15171B] font-bold shadow-sm'
                    : 'text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#24282E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === tab.id ? 'bg-[#15171B]/20 text-[#15171B]' : 'bg-[#15171B] text-[#9AA0A6]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Source Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-[#33373D] bg-[#15171B] space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
              <input
                type="text"
                placeholder={`Buscar en ${currentCategoryLabel.toLowerCase()} (ej: Ryzen, 7800 XT, Kingston, 32GB)...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#1E2126] border border-[#33373D] rounded text-sm text-[#EDEDE4] placeholder-[#9AA0A6] focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <button
              onClick={() => {
                onClose();
                const catToRequest = selectedCategory === 'all' ? 'cpu' : selectedCategory;
                onOpenSpecialRequest(catToRequest);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-[#4FBDB4]/15 hover:bg-[#4FBDB4]/25 text-[#4FBDB4] border border-[#4FBDB4]/40 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>¿No está acá? Pedir otro modelo especial</span>
            </button>
          </div>

          {/* Source Tabs */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#33373D]/50 text-xs font-['JetBrains_Mono'] flex-wrap">
            <span className="text-[#9AA0A6] text-[11px] uppercase mr-1">Filtrar por origen:</span>
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sourceFilter === 'all'
                  ? 'bg-[#EDEDE4] text-[#15171B] font-bold'
                  : 'bg-[#1E2126] text-[#9AA0A6] hover:text-[#EDEDE4]'
              }`}
            >
              Todas ({categoryProducts.length})
            </button>
            <button
              onClick={() => setSourceFilter('stock')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                sourceFilter === 'stock'
                  ? 'bg-emerald-500 text-[#15171B] font-bold'
                  : 'bg-[#1E2126] text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span>🟢 En Stock Inmediato</span>
              <span className="text-[10px]">({categoryProducts.filter(p => p.origen === 'CATALOGO').length})</span>
            </button>
            <button
              onClick={() => setSourceFilter('recommended')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                sourceFilter === 'recommended'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-[#1E2126] text-blue-400 hover:text-blue-300'
              }`}
            >
              <span>🔵 Recomendadas Gamer (A Conseguir)</span>
              <span className="text-[10px]">({categoryProducts.filter(p => p.origen === 'PEDIDO_ESPECIAL').length})</span>
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-[#33373D]/60 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-[#9AA0A6]">
                No hay productos en esta categoría con ese filtro.
              </p>
              <button
                onClick={() => {
                  onClose();
                  const catToRequest = selectedCategory === 'all' ? 'cpu' : selectedCategory;
                  onOpenSpecialRequest(catToRequest);
                }}
                className="px-4 py-2 bg-[#F5C518] text-[#15171B] font-bold text-xs font-['JetBrains_Mono'] uppercase rounded hover:bg-[#C9A227] transition-colors inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Pedir esta pieza a conseguir con el dueño
              </button>
            </div>
          ) : (
            filteredProducts.map(product => {
              const compat = getCompatibilityTag(product);
              const isSpecial = product.origen === 'PEDIDO_ESPECIAL';
              const isEquippedInBuild = 
                currentBuild.cpu?.id === product.id ||
                currentBuild.motherboard?.id === product.id ||
                currentBuild.ram?.id === product.id ||
                currentBuild.gpu?.id === product.id ||
                currentBuild.storage?.id === product.id ||
                currentBuild.psu?.id === product.id ||
                currentBuild.case?.id === product.id ||
                currentBuild.cooling?.id === product.id ||
                currentBuild.monitor?.id === product.id;

              return (
                <div 
                  key={product.id}
                  className={`pt-3 pb-3 px-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isEquippedInBuild
                      ? 'bg-[#F5C518]/10 border border-[#F5C518]/40'
                      : 'hover:bg-[#24282E]/60 border border-transparent hover:border-[#33373D]'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-[#15171B] border border-[#33373D] rounded p-1.5 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded border uppercase font-semibold ${
                          isSpecial
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isSpecial ? '🔵 Recomendación Gamer · A Conseguir' : '🟢 Lote en Stock Inmediato'}
                        </span>

                        <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase">
                          {product.marca}
                        </span>

                        {isEquippedInBuild && (
                          <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#F5C518]/20 text-[#F5C518] border border-[#F5C518]/50 uppercase font-bold">
                            Actualmente en tu PC
                          </span>
                        )}

                        {!compat.isCompatible && (
                          <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/40 flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            {compat.reason}
                          </span>
                        )}

                        {compat.isCompatible && compat.reason && (
                          <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {compat.reason}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-['Rajdhani'] font-bold text-[#EDEDE4] leading-tight">
                        {product.nombre}
                      </h4>

                      <ul className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] mt-1 space-y-0.5">
                        {product.especificaciones.slice(0, 3).map((spec, i) => (
                          <li key={i} className="line-clamp-1">› {spec}</li>
                        ))}
                      </ul>

                      {product.enlaceOficial && (
                        <div className="mt-1.5">
                          <a
                            href={product.enlaceOficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-[#4FBDB4] hover:underline"
                          >
                            <span>Ver ficha técnica y benchmarks en PCPartPicker / Fabricante</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Selection Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#33373D]/50">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] block uppercase">
                        {isSpecial ? 'Precio Estimado' : 'Precio Lote'}
                      </span>
                      <span className="text-xl font-['JetBrains_Mono'] font-bold text-[#F5C518]">
                        US$ {product.precio}
                      </span>
                    </div>

                    <button
                      id={`btn-select-${product.id}`}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className={`px-4 py-2.5 rounded font-['Rajdhani'] font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-md ${
                        isEquippedInBuild
                          ? 'bg-[#15171B] text-[#EDEDE4] border border-[#33373D] hover:border-[#F5C518]'
                          : 'bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] shadow-[#F5C518]/20'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isEquippedInBuild ? 'Reasignar / Mantener' : 'Elegir esta pieza'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-[#15171B] border-t border-[#33373D] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
          <span>
            Hardware real testeado físicamente · EliTech Lote 01-A
          </span>
          <button
            onClick={() => {
              onClose();
              const catToRequest = selectedCategory === 'all' ? 'cpu' : selectedCategory;
              onOpenSpecialRequest(catToRequest);
            }}
            className="text-[#4FBDB4] hover:underline font-bold"
          >
            + Solicitar pieza fuera de catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
