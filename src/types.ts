export type ComponentCategory =
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooling'
  | 'monitor'
  | 'accessories';

export type ProductOrigin = 'CATALOGO' | 'PEDIDO_ESPECIAL';
export type ProductStatus = 'DISPONIBLE' | 'A_CONSEGUIR' | 'A_CONFIRMAR' | 'NO_COMPATIBLE';

export interface ProductCompatibility {
  socket?: string;              // 'AM5', 'AM4', 'LGA1700'
  supportedSockets?: string[];  // For coolers
  ramType?: 'DDR4' | 'DDR5';    // RAM or Motherboard supported RAM
  ramSpeed?: string;
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'DIMM' | 'M.2 NVMe' | string; // Motherboard, RAM, Storage or Case support
  tdp?: number;                 // Watts
  recommendedPsuWatts?: number; // For GPUs
  slotsCount?: number;          // RAM slots or expansion slots
  gpuMaxLengthMm?: number;      // Case clearance
  coolerMaxHeightMm?: number;   // Case clearance
  lengthMm?: number;            // GPU length
  integratedGraphics?: boolean;
  maxRamGb?: number;
  m2Slots?: number;
}

export interface Product {
  id: string;
  categoria: ComponentCategory;
  marca: string;
  modelo: string;
  nombre: string;
  precio: number;
  moneda: 'USD';
  imagen: string;
  imagenes?: string[];
  stock: number;
  especificaciones: string[];
  compatibilidad: ProductCompatibility;
  origen: ProductOrigin;
  estado: ProductStatus;
  observaciones?: string;
  enlaceOficial?: string;
  whatsappUrl?: string;
}

export interface PrebuiltPC {
  id: string;
  nombre: string;
  tier: 'basica' | 'media' | 'alta' | 'extrema';
  tagline: string;
  descripcion: string;
  usoRecomendado: string;
  precioEstimado: number;
  imagen: string;
  fpsEstimados: {
    juego: string;
    resolucion: string;
    fps: number;
    calidad: string;
  }[];
  componentes: Partial<Record<ComponentCategory, string>>; // product IDs
  aspectosDestacados: string[];
}

export interface ActiveBuild {
  cpu: Product | null;
  motherboard: Product | null;
  ram: Product | null;
  gpu: Product | null;
  storage: Product | null;
  psu: Product | null;
  case: Product | null;
  cooling: Product | null;
  monitor: Product | null;
  accessories: Product[];
}

export interface CompatibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  components: ComponentCategory[];
}

export interface CompatibilityReport {
  isCompatible: boolean;
  status: 'compatible' | 'warning' | 'error';
  issues: CompatibilityIssue[];
  estimatedWattage: number;
  recommendedPsuWattage: number;
  gamingScore: number; // 0 to 100
  tierLabel: string;
  gamingCapabilities: {
    fhd1080p: boolean;
    qhd1440p: boolean;
    uhd4k: boolean;
    streaming: boolean;
    editing: boolean;
  };
}

export interface CustomerData {
  nombre: string;
  telefono: string;
  documento: string; // CI o RUT para compra real y comprobante de garantía
  email?: string;
  departamento: string;
  ciudad: string;
  direccion?: string;
  metodoPago: string;
  plazoCompra: string;
  observaciones: string;
  confirmacionReal: boolean;
}

export interface SpecialRequestInput {
  categoria: ComponentCategory;
  query: string;
  marca?: string;
  presupuestoAproximado?: number;
  comentario?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedBuild?: {
    title: string;
    summary: string;
    componentIds: Partial<Record<ComponentCategory, string>>;
    specialParts?: {
      category: ComponentCategory;
      name: string;
      estimatedPrice: number;
      specs: string[];
      compat: ProductCompatibility;
    }[];
  };
}
