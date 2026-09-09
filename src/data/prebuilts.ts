import { PrebuiltPC } from '../types';

export const PREBUILT_PCS: PrebuiltPC[] = [
  {
    id: 'pc-gamer-basica',
    nombre: 'PC Gamer Básica — Rey Calidad/Precio 1080p',
    tier: 'basica',
    tagline: 'El ensamble de entrada gamer más recomendado mundialmente (Ryzen 5 5600 + RX 6600 8GB)',
    descripcion: 'La configuración estándar que cualquier jugador competitivo y reviewer recomienda como punto de partida: procesador Ryzen 5 5600 de 6 núcleos / 12 hilos emparejado con la placa Sapphire Pulse RX 6600 de 8GB. Corre todos los juegos modernos en 1080p con más de 100 FPS y consumo mínimo.',
    usoRecomendado: 'Gaming 1080p Competitivo · Valorant / CS2 a 200+ FPS · Fortnite · GTA V · Warzone',
    precioEstimado: 702,
    imagen: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    fpsEstimados: [
      { juego: 'Valorant / CS2', resolucion: '1080p Competitivo', fps: 240, calidad: 'Alta' },
      { juego: 'Fortnite (Modo Rendimiento)', resolucion: '1080p Competitivo', fps: 165, calidad: 'Media/Alta' },
      { juego: 'GTA V / GTA Online', resolucion: '1080p Muy Alta', fps: 105, calidad: 'Muy Alta' },
      { juego: 'Call of Duty: Warzone', resolucion: '1080p Calidad FSR', fps: 85, calidad: 'Normal' }
    ],
    aspectosDestacados: [
      'Ryzen 5 5600 (6 Cores / 12 Hilos) sin cuellos de botella',
      'Placa de video dedicada Sapphire Pulse RX 6600 8GB GDDR6',
      '16GB RAM Dual Channel Kingston Fury Beast 3200MHz',
      'SSD M.2 NVMe de 1TB ultrarrápido (hasta 3500 MB/s)'
    ],
    componentes: {
      cpu: 'cpu-ryzen-5-5600',
      motherboard: 'mb-asrock-b550m-hdv',
      ram: 'ram-kingston-fury-16gb-ddr4-3200',
      gpu: 'gpu-amd-rx-6600-8gb',
      storage: 'storage-kingston-nv2-1tb',
      psu: 'psu-gigabyte-650w-bronze',
      case: 'case-kolink-void-rgb'
    }
  },
  {
    id: 'pc-gamer-media',
    nombre: 'PC Gamer Media — Competitiva 1440p (Lote 01-A)',
    tier: 'media',
    tagline: '8 núcleos de alto rendimiento y 16GB de VRAM para jugar todo en Ultra (Piezas en Stock)',
    descripcion: 'La opción más equilibrada y recomendada del lote físico: procesador AMD Ryzen 7 5700X de 8 núcleos junto a la potente Gigabyte RX 7800 XT de 16GB. Excelente para jugar en 1440p con configuraciones gráficas en Ultra y multitarea pesada.',
    usoRecomendado: 'Gaming 1440p Ultra · Streaming Twitch/YouTube · Edición de Video Premiere/DaVinci',
    precioEstimado: 1498,
    imagen: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    fpsEstimados: [
      { juego: 'Cyberpunk 2077', resolucion: '1440p Ultra FSR', fps: 88, calidad: 'Ultra' },
      { juego: 'Call of Duty: Warzone', resolucion: '1440p Competitivo', fps: 140, calidad: 'Alta' },
      { juego: 'Fortnite (Unreal Engine 5)', resolucion: '1440p Epic', fps: 110, calidad: 'Épica' },
      { juego: 'Forza Horizon 5', resolucion: '1440p Ultra', fps: 125, calidad: 'Extrema' }
    ],
    aspectosDestacados: [
      'Combo de hardware real del Lote 01-A listo para entrega',
      'Placa Gigabyte RX 7800 XT con 16GB VRAM (sin límites de memoria)',
      'Fuente Gigabyte UD750GM 750W 80+ Gold para respaldo energético óptimo',
      '32GB RAM Samsung dual-channel + Gabinete Mesh de alto flujo'
    ],
    componentes: {
      cpu: 'cpu-ryzen-7-5700x',
      motherboard: 'mb-asrock-b550m-hdv',
      ram: 'ram-samsung-32gb-ddr4',
      gpu: 'gpu-gigabyte-rx7800xt',
      storage: 'storage-kingston-nv2-1tb',
      psu: 'psu-gigabyte-ud750gm-gold',
      case: 'case-deepcool-cc560-airflow'
    }
  },
  {
    id: 'pc-gamer-esports-am5',
    nombre: 'PC Gamer E-Sports AM5 — Máximos FPS (Ryzen 7 7800X3D + RTX 4070 Super)',
    tier: 'alta',
    tagline: 'El setup definitivo de los pro gamers: la CPU más rápida del mundo con RTX 4070 Super y DDR5 CL30',
    descripcion: 'Diseñada específicamente para quienes compiten al máximo nivel o quieren monitores de 240Hz/360Hz. La memoria 3D V-Cache del Ryzen 7 7800X3D elimina microtirones (1% lows) y la Gigabyte RTX 4070 SUPER 12GB con DLSS 3.5 asegura fluidez extrema en 1440p con Ray Tracing.',
    usoRecomendado: 'E-Sports Profesionales (CS2, Valorant, Apex) · 1440p Ultra 165Hz · Sim Racing · VR',
    precioEstimado: 1711,
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    fpsEstimados: [
      { juego: 'Counter-Strike 2 / Valorant', resolucion: '1440p Competitivo', fps: 380, calidad: 'Máxima' },
      { juego: 'Call of Duty: Warzone', resolucion: '1440p DLSS', fps: 190, calidad: 'Alta' },
      { juego: 'Cyberpunk 2077 (Ray Tracing)', resolucion: '1440p DLSS 3.5', fps: 115, calidad: 'Ultra RT' },
      { juego: 'Apex Legends', resolucion: '1440p', fps: 240, calidad: 'Competitiva' }
    ],
    aspectosDestacados: [
      'Procesador AMD Ryzen 7 7800X3D (El rey de FPS en benchmarks mundiales)',
      'Placa Gigabyte RTX 4070 SUPER 12GB GDDR6X con DLSS 3.5',
      '32GB Corsair DDR5 6000MHz CL30 (Latencia ultra baja con AMD EXPO)',
      'SSD Kingston KC3000 1TB (7000 MB/s con DRAM) + Cooler Peerless Assassin'
    ],
    componentes: {
      cpu: 'cpu-ryzen-7-7800x3d',
      motherboard: 'mb-msi-pro-b650m-a-wifi',
      ram: 'ram-corsair-vengeance-32gb-ddr5-6000',
      gpu: 'gpu-nvidia-rtx-4070-super-12gb',
      storage: 'storage-kingston-kc3000-1tb',
      psu: 'psu-corsair-rm750e-gold',
      case: 'case-montech-air-903-max',
      cooling: 'cooling-thermalright-peerless-assassin'
    }
  },
  {
    id: 'pc-gamer-alta',
    nombre: 'PC Gamer Alta — Blackwell RTX 5070 (DDR5)',
    tier: 'alta',
    tagline: 'Nueva arquitectura NVIDIA RTX 5070 con GDDR7 y plataforma AM5 DDR5 nativa',
    descripcion: 'Equipada con la moderna arquitectura NVIDIA Blackwell (PNY RTX 5070 OC con memorias GDDR7 de última generación) y plataforma socket AM5. Preparada para ray tracing avanzado, DLSS 3.5/4 y soporte de futuros procesadores Ryzen serie 9000.',
    usoRecomendado: 'Gaming 1440p Ultra / 4K DLSS · Ray Tracing Extremo · IA Local / Machine Learning',
    precioEstimado: 1983,
    imagen: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    fpsEstimados: [
      { juego: 'Cyberpunk 2077 (Path Tracing)', resolucion: '1440p DLSS 3.5', fps: 95, calidad: 'Path Tracing' },
      { juego: 'Alan Wake 2', resolucion: '1440p High RT', fps: 85, calidad: 'Alta RT' },
      { juego: 'GTA V / GTA VI Ready', resolucion: '1440p Ultra', fps: 145, calidad: 'Ultra' },
      { juego: 'Black Myth: Wukong', resolucion: '1440p Cinematográfica', fps: 92, calidad: 'Cinemática' }
    ],
    aspectosDestacados: [
      'GPU PNY RTX 5070 OC 12GB con veloces memorias GDDR7',
      'CPU Ryzen 7 7800X3D tope de gama en socket AM5',
      'Placa madre MSI PRO B650M-P con VRM reforzado',
      'Gabinete con 4 ventiladores incluidos para refrigeración total'
    ],
    componentes: {
      cpu: 'cpu-ryzen-7-7800x3d',
      motherboard: 'mb-msi-pro-b650m-p',
      ram: 'ram-kingbank-16gb-ddr5',
      gpu: 'gpu-pny-rtx5070',
      storage: 'storage-kingston-nv2-1tb',
      psu: 'psu-corsair-rm850e-gold',
      case: 'case-deepcool-cc560-airflow'
    }
  },
  {
    id: 'pc-gamer-extrema',
    nombre: 'PC Gamer Extrema — RDNA 4 Beast 4K (64GB DDR5)',
    tier: 'extrema',
    tagline: 'El tope de gama absoluto: XFX Radeon RX 9070 XT 16GB Quicksilver + 64GB RAM DDR5',
    descripcion: 'La máquina definitiva para entusiastas. Monta la joya del Lote 01: la XFX Radeon RX 9070 XT Quicksilver con arquitectura RDNA 4, 64GB de memoria RAM Kingston FURY Beast DDR5 a 6000MHz, procesador Ryzen 7 7800X3D, placa base Gigabyte B840M y fuente Corsair Gold ATX 3.0 de 850W.',
    usoRecomendado: 'Gaming 4K Ultra Nativo · Render 3D Blender/Unreal 5 · Simulación de Vuelo · Creadores Pro',
    precioEstimado: 2646,
    imagen: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    fpsEstimados: [
      { juego: 'Cyberpunk 2077', resolucion: '4K Ultra Nativo', fps: 78, calidad: 'Ultra' },
      { juego: 'Microsoft Flight Simulator', resolucion: '4K Ultra', fps: 72, calidad: 'Ultra' },
      { juego: 'Starfield', resolucion: '4K Ultra', fps: 84, calidad: 'Ultra' },
      { juego: 'Red Dead Redemption 2', resolucion: '4K Maxed Out', fps: 95, calidad: 'Máxima' }
    ],
    aspectosDestacados: [
      'XFX RX 9070 XT Quicksilver 16GB con disipador masivo de 3.5 slots',
      'CPU Ryzen 7 7800X3D con 3D V-Cache de 96MB',
      'Kit masivo de 64GB Kingston FURY Beast DDR5 6000MHz CL30',
      'Fuente Corsair RM850e 80+ Gold Modular ATX 3.0 con 850W reales',
      'Pack de 5 ventiladores DeepCool CF120 ARGB para túnel de viento'
    ],
    componentes: {
      cpu: 'cpu-ryzen-7-7800x3d',
      motherboard: 'mb-gigabyte-b840m-ds3h',
      ram: 'ram-kingston-fury-64gb-ddr5',
      gpu: 'gpu-xfx-rx9070xt',
      storage: 'storage-kingston-kc3000-1tb',
      psu: 'psu-corsair-rm850e-gold',
      case: 'case-deepcool-cc560-airflow',
      cooling: 'fan-deepcool-cf120-x5'
    }
  }
];
