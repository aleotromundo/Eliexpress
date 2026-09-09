import { useState, useMemo } from 'react';
import { CircuitBackground } from './components/CircuitBackground';
import { Header } from './components/Header';
import { PCBuilder } from './components/PCBuilder';
import { PrebuiltSection } from './components/PrebuiltSection';
import { CatalogSection } from './components/CatalogSection';
import { ComponentSelectorModal } from './components/ComponentSelectorModal';
import { SpecialRequestModal } from './components/SpecialRequestModal';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { ActiveBuild, ComponentCategory, Product, PrebuiltPC } from './types';
import { CATALOG_PRODUCTS } from './data/catalog';
import { evaluateCompatibility } from './utils/compatibility';

// Initial state with a balanced Gamer build
function getInitialBuild(): ActiveBuild {
  const findProd = (id: string) => CATALOG_PRODUCTS.find(p => p.id === id) || null;

  return {
    cpu: findProd('cpu-ryzen-7-5700x'),
    motherboard: findProd('mb-asrock-b550m-hdv'),
    ram: findProd('ram-samsung-32gb-ddr4'),
    gpu: findProd('gpu-gigabyte-rx7800xt'),
    storage: findProd('storage-kingston-nv2-1tb'),
    psu: findProd('psu-gigabyte-650w-bronze'),
    case: findProd('case-deepcool-cc560-airflow'),
    cooling: findProd('fan-deepcool-cf120-x5'),
    monitor: null,
    accessories: []
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'prebuilts' | 'catalog' | 'ai'>('builder');
  const [build, setBuild] = useState<ActiveBuild>(getInitialBuild());

  // Modals state
  const [selectorModal, setSelectorModal] = useState<{
    isOpen: boolean;
    category: ComponentCategory | 'all';
    label: string;
  }>({
    isOpen: false,
    category: 'cpu',
    label: 'Procesador'
  });

  const [specialRequestModal, setSpecialRequestModal] = useState<{
    isOpen: boolean;
    category: ComponentCategory;
  }>({
    isOpen: false,
    category: 'cpu'
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Compute live compatibility report
  const compatReport = useMemo(() => evaluateCompatibility(build), [build]);

  // Set or replace a component in the build
  function handleSelectProduct(product: Product) {
    // Special kit handling
    if (product.id === 'combo-kit-asrock-5700x-32gb') {
      const cpu = CATALOG_PRODUCTS.find(p => p.id === 'cpu-ryzen-7-5700x') || null;
      const ram = CATALOG_PRODUCTS.find(p => p.id === 'ram-samsung-32gb-ddr4') || null;
      setBuild(prev => ({
        ...prev,
        motherboard: product,
        cpu: cpu,
        ram: ram
      }));
      return;
    }

    setBuild(prev => {
      if (product.categoria === 'accessories') {
        return {
          ...prev,
          accessories: [...prev.accessories, product]
        };
      }
      return {
        ...prev,
        [product.categoria]: product
      };
    });
  }

  function handleRemoveComponent(category: ComponentCategory) {
    setBuild(prev => ({
      ...prev,
      [category]: null
    }));
  }

  function handleResetBuild() {
    setBuild({
      cpu: null,
      motherboard: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
      monitor: null,
      accessories: []
    });
  }

  function handleCustomizePrebuilt(prebuilt: PrebuiltPC) {
    const newBuild: ActiveBuild = {
      cpu: null,
      motherboard: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
      monitor: null,
      accessories: []
    };

    Object.entries(prebuilt.componentes).forEach(([cat, prodId]) => {
      const found = CATALOG_PRODUCTS.find(p => p.id === prodId);
      if (found) {
        (newBuild as any)[cat] = found;
      }
    });

    setBuild(newBuild);
    setActiveTab('builder');
  }

  function handleOrderDirectPrebuilt(prebuilt: PrebuiltPC) {
    handleCustomizePrebuilt(prebuilt);
    setIsOrderModalOpen(true);
  }

  function handleOrderDirectProduct(product: Product) {
    handleSelectProduct(product);
    setIsOrderModalOpen(true);
  }

  function handleApplyAiBuild(componentIds: Partial<Record<ComponentCategory, string>>) {
    const newBuild = { ...build };
    Object.entries(componentIds).forEach(([cat, prodId]) => {
      if (!prodId) return;
      const found = CATALOG_PRODUCTS.find(p => p.id === prodId);
      if (found) {
        (newBuild as any)[cat] = found;
      }
    });
    setBuild(newBuild);
    setActiveTab('builder');
  }

  // Get array of equipped product IDs for catalog badges
  const equippedIds = useMemo(() => {
    return [
      build.cpu?.id,
      build.motherboard?.id,
      build.ram?.id,
      build.gpu?.id,
      build.storage?.id,
      build.psu?.id,
      build.case?.id,
      build.cooling?.id,
      build.monitor?.id,
      ...build.accessories.map(a => a.id)
    ].filter(Boolean) as string[];
  }, [build]);

  return (
    <div className="min-h-screen bg-[#15171B] text-[#EDEDE4] font-['Inter'] relative flex flex-col justify-between selection:bg-[#F5C518] selection:text-[#15171B]">
      
      {/* Circuit Background animation */}
      <CircuitBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'ai') {
              setIsAiModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          build={build}
          compatReport={compatReport}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
          onOpenAiModal={() => setIsAiModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
          {activeTab === 'builder' && (
            <PCBuilder
              build={build}
              compatReport={compatReport}
              onOpenSelector={(category, label) => {
                setSelectorModal({ isOpen: true, category, label });
              }}
              onOpenSpecialRequest={(category) => {
                setSpecialRequestModal({ isOpen: true, category });
              }}
              onRemoveComponent={handleRemoveComponent}
              onResetBuild={handleResetBuild}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onGoToPrebuilts={() => setActiveTab('prebuilts')}
            />
          )}

          {activeTab === 'prebuilts' && (
            <PrebuiltSection
              onCustomizePrebuilt={handleCustomizePrebuilt}
              onOrderDirectPrebuilt={handleOrderDirectPrebuilt}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogSection
              onAddToBuild={handleSelectProduct}
              onOrderDirectProduct={handleOrderDirectProduct}
              equippedIds={equippedIds}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#33373D] bg-[#15171B]/90 mt-12 py-8 px-4 sm:px-6 text-center text-xs font-['JetBrains_Mono'] text-[#9AA0A6] space-y-2">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-[#EDEDE4] font-bold">EliTech Montevideo</span>
            <span>·</span>
            <span>Hardware físico verificado Lote 01-A</span>
            <span>·</span>
            <span>Contacto y WhatsApp: +598 94 691 690</span>
          </div>
          <p className="text-[11px] text-[#9AA0A6]/70 max-w-xl mx-auto">
            "Hardware real. Cero relato de vendedor." Armamos y testeamos cada computadora gamer asegurando compatibilidad, refrigeración y rendimiento óptimo.
          </p>
        </footer>
      </div>

      {/* MODALS */}

      {/* Component Selector Modal */}
      {selectorModal.isOpen && (
        <ComponentSelectorModal
          category={selectorModal.category}
          categoryLabel={selectorModal.label}
          currentBuild={build}
          onSelectProduct={handleSelectProduct}
          onOpenSpecialRequest={(cat) => setSpecialRequestModal({ isOpen: true, category: cat })}
          onClose={() => setSelectorModal(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Special Request Modal */}
      {specialRequestModal.isOpen && (
        <SpecialRequestModal
          initialCategory={specialRequestModal.category}
          onAddSpecialProduct={handleSelectProduct}
          onClose={() => setSpecialRequestModal(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Order Summary / WhatsApp Modal */}
      {isOrderModalOpen && (
        <OrderSummaryModal
          build={build}
          compatReport={compatReport}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}

      {/* AI Advisor Modal */}
      {isAiModalOpen && (
        <AiAdvisorModal
          currentBuild={build}
          onApplySuggestedBuild={handleApplyAiBuild}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

    </div>
  );
}
