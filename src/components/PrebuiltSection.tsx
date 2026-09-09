import { Wrench, CheckCircle2, ShoppingCart, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';
import { PrebuiltPC } from '../types';
import { PREBUILT_PCS } from '../data/prebuilts';

interface PrebuiltSectionProps {
  onCustomizePrebuilt: (prebuilt: PrebuiltPC) => void;
  onOrderDirectPrebuilt: (prebuilt: PrebuiltPC) => void;
}

export function PrebuiltSection({
  onCustomizePrebuilt,
  onOrderDirectPrebuilt
}: PrebuiltSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="p-5 rounded-lg bg-[#1E2126] border border-[#33373D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-['JetBrains_Mono'] text-[#F5C518] uppercase tracking-widest font-bold block mb-1">
            Módulo C · Computadoras Completas Preparadas
          </span>
          <h2 className="text-2xl sm:text-3xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase">
            PCs Gamer Ya Armadas
          </h2>
          <p className="text-xs font-['Inter'] text-[#9AA0A6] max-w-2xl mt-1">
            Configuraciones probadas, testeadas térmicamente y listas para jugar. Podés pedir cualquiera de ellas tal cual está o tocar «Personalizar esta PC» para modificar piezas en el configurador.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#15171B] border border-[#33373D] text-xs font-['JetBrains_Mono'] text-[#4FBDB4]">
          <Sparkles className="w-4 h-4 text-[#F5C518]" />
          <span>4 Niveles Calibrados</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PREBUILT_PCS.map(pc => {
          const tierColor = 
            pc.tier === 'extrema' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
            pc.tier === 'alta' ? 'text-[#4FBDB4] border-[#4FBDB4]/30 bg-[#4FBDB4]/10' :
            pc.tier === 'media' ? 'text-[#F5C518] border-[#F5C518]/30 bg-[#F5C518]/10' :
            'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

          return (
            <div 
              key={pc.id}
              className="p-5 rounded-lg bg-[#1E2126] border border-[#33373D] hover:border-[#C9A227]/50 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              {/* Top Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${tierColor}`}>
                      Gama {pc.tier}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-['Rajdhani'] font-bold text-[#EDEDE4] uppercase mt-1">
                      {pc.nombre}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-['JetBrains_Mono'] text-[#9AA0A6] uppercase block">
                      Precio estimado
                    </span>
                    <span className="text-2xl font-['JetBrains_Mono'] font-bold text-[#F5C518]">
                      US$ {pc.precioEstimado}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-['Inter'] text-[#9AA0A6] leading-relaxed">
                  {pc.descripcion}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-[#33373D]/60">
                  <span className="text-[11px] font-['JetBrains_Mono'] text-[#4FBDB4] uppercase tracking-wider block font-semibold">
                    Ventajas Clave del Ensamble:
                  </span>
                  <ul className="text-xs font-['Inter'] text-[#EDEDE4] space-y-1">
                    {pc.aspectosDestacados.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F5C518] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FPS Estimates Widget */}
                <div className="p-3 rounded bg-[#15171B] border border-[#33373D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-['JetBrains_Mono'] text-[#9AA0A6] uppercase tracking-wider flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5 text-[#F5C518]" />
                      Rendimiento Estimado en Juegos
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono'] text-[#4FBDB4]">
                      {pc.usoRecomendado.split('·')[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {pc.fpsEstimados.map((item, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#1E2126] border border-[#33373D]/60 flex items-center justify-between text-xs font-['JetBrains_Mono']">
                        <span className="text-[#9AA0A6] truncate mr-2">{item.juego}:</span>
                        <span className="text-[#F5C518] font-bold whitespace-nowrap">~{item.fps} FPS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#33373D] flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onCustomizePrebuilt(pc)}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-[#F5C518] hover:bg-[#C9A227] text-[#15171B] font-['Rajdhani'] font-bold text-base uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#F5C518]/10"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Personalizar esta PC</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => onOrderDirectPrebuilt(pc)}
                  className="w-full sm:w-auto py-2.5 px-4 bg-[#15171B] hover:bg-[#24282E] text-[#EDEDE4] hover:text-[#25D366] border border-[#33373D] hover:border-[#25D366]/40 text-xs font-['JetBrains_Mono'] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-[#25D366]" />
                  <span>Pedir así</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
