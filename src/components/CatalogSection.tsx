import { useState } from 'react';
import { Search, ExternalLink, Plus, Check, MessageSquare, ZoomIn, X, Globe, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { ComponentCategory, Product } from '../types';
import { CATALOG_PRODUCTS } from '../data/catalog';

interface CatalogSectionProps {
  onAddToBuild: (product: Product) => void;
  onOrderDirectProduct?: (product: Product) => void;
  equippedIds: string[];
}

export function CatalogSection({
  onAddToBuild,
  onOrderDirectProduct,
  equippedIds
}: CatalogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'stock' | 'recommended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomProduct, setZoomProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'Todas las Categorías' },
    { id: 'gpu', label: 'Placas de Video' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'cpu', label: 'Procesadores' },
    { id: 'ram', label: 'Memoria RAM' },
    { id: 'cooling', label: 'Ventiladores / Cooling' },
    { id: 'storage', label: 'Almacenamiento' },
    { id: 'psu', label: 'Fuentes de Poder' },
    { id: 'case', label: 'Gabinetes' }
  ];

  const stockCount = CATALOG_PRODUCTS.filter(p => p.origen === 'CATALOGO').length;
  const recommendedCount = CATALOG_PRODUCTS.filter(p => p.origen === 'PEDIDO_ESPECIAL').length;

  const filteredProducts = CATALOG_PRODUCTS.filter(prod => {
    const matchesCat = selectedCategory === 'all' || prod.categoria === selectedCategory;
    const matchesSource = 
      sourceFilter === 'all' ||
      (sourceFilter === 'stock' && prod.origen === 'CATALOGO') ||
      (sourceFilter === 'recommended' && prod.origen === 'PEDIDO_ESPECIAL');
    const matchesSearch = 
      prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.especificaciones.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSource && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-5 rounded-lg bg-[#1E2126] border border-[#33373D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-['JetBrains_Mono'] text-[#4FBDB4] uppercase tracking-widest font-bold block mb-1">
            Módulo A · Hardware Físico en Stock + Recomendaciones Gamer
          </span>
          <h2 className="text-2xl sm:text-3xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
            Catálogo & Guía de Componentes
          </h2>
          <p className="text-xs font-['Inter'] text-[#9AA0A6] max-w-2xl mt-1">
            Combina piezas que tenemos <b>en mano en Montevideo</b> (Lote 01-A) con <b>recomendaciones de la comunidad gamer internacional</b> listas para pedir o traer de importación.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-['JetBrains_Mono'] text-xs text-[#9AA0A6]">
          <span className="text-emerald-400"><b>{stockCount}</b> en stock local</span>
          <span className="text-[#F5C518]">·</span>
          <span className="text-blue-400"><b>{recommendedCount}</b> gamer pedidos</span>
          <span className="text-[#F5C518]">·</span>
          <span className="text-[#EDEDE4]"><b>{CATALOG_PRODUCTS.length}</b> en total</span>
        </div>
      </div>

      {/* Gamer Reference Sites Guide Banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#1B222D] via-[#1E2126] to-[#1A2522] border border-[#4FBDB4]/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#4FBDB4]" />
            <h3 className="font-['Rajdhani'] font-bold text-sm sm:text-base text-[#EDEDE4] uppercase tracking-wider">
              Guía de Sitios de Referencia para Jugadores & Armadores
            </h3>
          </div>
          <span className="text-[11px] font-['JetBrains_Mono'] text-[#9AA0A6]">
            Páginas recomendadas para verificar con gente que juega
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <a
            href="https://pcpartpicker.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#15171B]/90 hover:bg-[#15171B] border border-[#33373D] hover:border-[#F5C518] rounded transition-all group block"
          >
            <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] font-bold text-[#F5C518] mb-1">
              <span>PCPartPicker.com</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA0A6] leading-relaxed">
              El estándar mundial para armar builds, verificar compatibilidad estricta de sockets y ver combinaciones populares de la comunidad gamer.
            </p>
          </a>

          <a
            href="https://www.techpowerup.com/gpu-specs/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#15171B]/90 hover:bg-[#15171B] border border-[#33373D] hover:border-[#4FBDB4] rounded transition-all group block"
          >
            <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] font-bold text-[#4FBDB4] mb-1">
              <span>TechPowerUp GPU Specs</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA0A6] leading-relaxed">
              Base de datos técnica exhaustiva de placas de video: consumo real (TDP), rendimiento relativo porcentual y medidas exactas.
            </p>
          </a>

          <a
            href="https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#15171B]/90 hover:bg-[#15171B] border border-[#33373D] hover:border-emerald-400 rounded transition-all group block"
          >
            <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] font-bold text-emerald-400 mb-1">
              <span>Tom's Hardware Hierarchy</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#9AA0A6] leading-relaxed">
              Ranking medido en pruebas de laboratorio reales: tablas de FPS promedio en juegos en resoluciones 1080p, 1440p y 4K Ultra.
            </p>
          </a>
        </div>
      </div>

      {/* Source & Category Filter Bar */}
      <div className="space-y-3 border-b border-[#33373D] pb-4">
        {/* Source Toggle */}
        <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] flex-wrap">
          <span className="text-[#9AA0A6] text-[11px] uppercase mr-1">Disponibilidad:</span>
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              sourceFilter === 'all'
                ? 'bg-[#EDEDE4] text-[#15171B] font-bold'
                : 'bg-[#1E2126] text-[#9AA0A6] hover:text-[#EDEDE4]'
            }`}
          >
            Todos ({CATALOG_PRODUCTS.length})
          </button>
          <button
            onClick={() => setSourceFilter('stock')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              sourceFilter === 'stock'
                ? 'bg-emerald-500 text-[#15171B] font-bold'
                : 'bg-[#1E2126] text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span>🟢 Stock Físico Montevideo</span>
            <span className="text-[10px]">({stockCount})</span>
          </button>
          <button
            onClick={() => setSourceFilter('recommended')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              sourceFilter === 'recommended'
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-[#1E2126] text-blue-400 hover:text-blue-300'
            }`}
          >
            <span>🔵 Recomendaciones Gamer (A Conseguir)</span>
            <span className="text-[10px]">({recommendedCount})</span>
          </button>
        </div>

        {/* Categories and Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-['JetBrains_Mono'] uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#F5C518] text-[#15171B] font-bold'
                    : 'text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#1E2126]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
            <input
              type="text"
              placeholder="Buscar por modelo, marca, spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#1E2126] border border-[#33373D] rounded text-xs font-['JetBrains_Mono'] text-[#EDEDE4] placeholder-[#9AA0A6] focus:outline-none focus:border-[#F5C518]"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const isEquipped = equippedIds.includes(product.id);
          const isSpecial = product.origen === 'PEDIDO_ESPECIAL';
          const whatsappText = encodeURIComponent(`Hola, me interesa el componente ${product.nombre} (${isSpecial ? 'Recomendación Gamer a Conseguir' : 'Lote Físico en Stock'}).`);

          return (
            <article 
              key={product.id}
              className={`bg-[#1E2126] border rounded hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden group shadow-md ${
                isSpecial
                  ? 'border-blue-500/30 hover:border-blue-400'
                  : 'border-[#33373D] hover:border-[#C9A227]'
              }`}
            >
              {/* Rivet corners aesthetic homage */}
              <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#3A3E44] shadow-inner" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#3A3E44] shadow-inner" />
              <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#3A3E44] shadow-inner" />
              <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#3A3E44] shadow-inner" />

              {/* Media with zoom cursor */}
              <div 
                onClick={() => setZoomProduct(product)}
                className="aspect-video bg-gradient-to-b from-[#23262B] to-[#1A1C20] border-b border-[#33373D] flex items-center justify-center p-4 relative cursor-zoom-in group/media"
              >
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-full h-full object-contain transition-transform group-hover/media:scale-105"
                />
                <span className="absolute bottom-2 right-2 p-1 rounded-full bg-[#15171B]/80 text-[#EDEDE4] border border-[#33373D] opacity-0 group-hover/media:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded border uppercase font-semibold ${
                      isSpecial
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {isSpecial ? '🔵 Recomendación Gamer · A Conseguir' : '🟢 Lote Físico en Stock'}
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase">
                      {product.marca}
                    </span>
                  </div>

                  <h3 className="text-lg font-['Rajdhani'] font-bold text-[#EDEDE4] leading-tight">
                    {product.nombre}
                  </h3>

                  <ul className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] space-y-1 mt-3 border-t border-dashed border-[#33373D] pt-2.5">
                    {product.especificaciones.map((spec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#C9A227] flex-shrink-0">›</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Foot */}
                <div className="pt-3 border-t border-[#33373D] flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="font-['JetBrains_Mono'] font-bold text-lg text-[#EDEDE4]">
                      US$ {product.precio}
                    </div>
                    <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] block">
                      {isSpecial ? 'Estimado Importación' : 'Stock Inmediato MVD'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {product.enlaceOficial && (
                      <a
                        href={product.enlaceOficial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 rounded text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        title="Ver referencia en PCPartPicker o web del fabricante"
                      >
                        <span>Ficha</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {onOrderDirectProduct ? (
                      <button
                        onClick={() => onOrderDirectProduct(product)}
                        className="px-2 py-1 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 rounded text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        title="Confirmar compra real y pedir por WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Pedir</span>
                      </button>
                    ) : (
                      <a
                        href={`https://wa.me/59894691690?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 rounded text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Pedir</span>
                      </a>
                    )}

                    <button
                      onClick={() => onAddToBuild(product)}
                      className={`px-3 py-1 rounded text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1 transition-colors ${
                        isEquipped
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] font-bold'
                      }`}
                    >
                      {isEquipped ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{isEquipped ? 'En mi PC' : 'Usar en PC'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {zoomProduct && (
        <div 
          onClick={() => setZoomProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#1E2126] border border-[#33373D] rounded-lg overflow-hidden p-6 text-center space-y-4"
          >
            <button
              onClick={() => setZoomProduct(null)}
              className="absolute top-4 right-4 p-2 rounded text-[#9AA0A6] hover:text-[#EDEDE4] hover:bg-[#33373D]"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={zoomProduct.imagen}
              alt={zoomProduct.nombre}
              className="max-h-[65vh] w-auto mx-auto object-contain"
            />

            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className={`text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded border uppercase font-semibold ${
                  zoomProduct.origen === 'PEDIDO_ESPECIAL'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {zoomProduct.origen === 'PEDIDO_ESPECIAL' ? '🔵 Recomendación Gamer · A Conseguir' : '🟢 Lote Físico en Stock (Montevideo)'}
                </span>
                <span className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6]">
                  US$ {zoomProduct.precio}
                </span>
              </div>
              <h3 className="text-xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
                {zoomProduct.nombre}
              </h3>
              <p className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] mt-1">
                {zoomProduct.origen === 'PEDIDO_ESPECIAL'
                  ? 'Pieza estándar de la comunidad gamer verificable en PCPartPicker · Gestionable a pedido'
                  : 'Hardware verificado físicamente en Montevideo · EliTech Lote 01-A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
