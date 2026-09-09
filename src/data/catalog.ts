import { Product } from '../types';

export const CATALOG_PRODUCTS: Product[] = [
  // ==================== PLACAS DE VIDEO (LOTE REAL 01-A) ====================
  {
    id: 'gpu-xfx-rx9070xt',
    categoria: 'gpu',
    marca: 'XFX',
    modelo: 'Radeon RX 9070 XT Quicksilver 16GB',
    nombre: 'XFX Radeon RX 9070 XT Quicksilver 16GB',
    precio: 950,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Arquitectura RDNA 4 · 64 CU / 4096 stream processors',
      '16GB GDDR6 · bus 256-bit · 640 GB/s ancho de banda',
      'PCIe 5.0 · GPU clock base 2250 MHz, boost 2970 MHz',
      '3 fans AXIAL · Longitud 3.5 slots · 1x 8-pin + 1x 6-pin',
      'Ray tracing acelerado · FSR 3/4 compatible · PSU recomendado 800W+'
    ],
    compatibilidad: {
      tdp: 300,
      recommendedPsuWatts: 800,
      lengthMm: 330
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.xfxforce.com/shop/xfx-quicksilver-amd-radeon-rx-9070xt-gaming-edition',
    observaciones: 'Pieza confirmada físicamente del lote 01-A. Nueva en caja sellada.'
  },
  {
    id: 'gpu-gigabyte-rx7800xt',
    categoria: 'gpu',
    marca: 'Gigabyte',
    modelo: 'RX 7800 XT Gaming OC 16GB',
    nombre: 'Gigabyte RX 7800 XT Gaming OC 16GB',
    precio: 799,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Arquitectura RDNA 3 · 60 CU / 3840 stream processors',
      '16GB GDDR6 · bus 256-bit · 624 GB/s ancho de banda',
      'PCIe 4.0 · clock base 2105 MHz, boost hasta 2565 MHz',
      'WINDFORCE 3 ventiladores alternados · backplate metálico reforzado',
      'Ray tracing · FSR compatible · PSU recomendado 750W+'
    ],
    compatibilidad: {
      tdp: 263,
      recommendedPsuWatts: 750,
      lengthMm: 302
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.gigabyte.com/uy/Graphics-Card/GV-R78XTGAMING-OC-16GD',
    observaciones: 'Lote 01-A verificado. Óptima para 1440p Ultra con 16GB VRAM.'
  },
  {
    id: 'gpu-pny-rtx5070',
    categoria: 'gpu',
    marca: 'PNY',
    modelo: 'GeForce RTX 5070 OC 12GB',
    nombre: 'PNY GeForce RTX 5070 OC 12GB',
    precio: 800,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Arquitectura Blackwell · 6144 CUDA cores · 192 Tensor cores',
      '12GB GDDR7 · bus 192-bit · 864 GB/s ancho de banda de última gen',
      'PCIe 5.0 · Boost clock 2557 MHz · TGP 250W',
      'Variante OC de fábrica · conectores 1x 8-pin · PSU 650W+',
      'NVIDIA DLSS 3.5 / 4 · Ray tracing de 4ta generación optimizado'
    ],
    compatibilidad: {
      tdp: 250,
      recommendedPsuWatts: 650,
      lengthMm: 285
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.pny.com/geforce-rtx-5070-models',
    observaciones: 'Lote 01-A verificado. Última arquitectura Blackwell con memorias GDDR7.'
  },

  // ==================== MOTHERBOARDS (LOTE REAL 01-A) ====================
  {
    id: 'mb-gigabyte-b840m-ds3h',
    categoria: 'motherboard',
    marca: 'Gigabyte',
    modelo: 'B840M DS3H',
    nombre: 'Gigabyte B840M DS3H (AM5 / DDR5)',
    precio: 180,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Socket AM5 · compatible con Ryzen 7000 / 8000 / 9000 series',
      'Chipset AMD B840 · 4x slots DDR5 hasta 256GB (8200+ MHz OC)',
      '1x PCIe 5.0 x16 (GPU) · 2x ranuras M.2 PCIe 5.0/4.0 · 6x SATA3',
      'VRM 18+2+1 fases con disipador · LAN 2.5G ethernet · Audio 7.1',
      'Formato Micro-ATX · soporte para CPUs hasta 170W TDP'
    ],
    compatibilidad: {
      socket: 'AM5',
      ramType: 'DDR5',
      formFactor: 'Micro-ATX',
      slotsCount: 4
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.gigabyte.com/Motherboard/B840M-DS3H-rev-10',
    observaciones: 'Lote 01-A. Preparada para CPUs AM5 serie 9000 con DDR5 ultra rápida.'
  },
  {
    id: 'mb-msi-pro-b650m-p',
    categoria: 'motherboard',
    marca: 'MSI',
    modelo: 'PRO B650M-P',
    nombre: 'MSI PRO B650M-P (AM5 / DDR5)',
    precio: 220,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Socket AM5 · Chipset B650 · compatible Ryzen 7000/8000/9000',
      'Soporte DDR5 nativo · hasta 192GB (OC) · PCIe 5.0 M.2',
      'VRM 16+2+1 fases de grado profesional',
      'Serie PRO - diseñada para máxima estabilidad operativa',
      '2.5G Ethernet · Audio estéreo HD · Formato Micro-ATX'
    ],
    compatibilidad: {
      socket: 'AM5',
      ramType: 'DDR5',
      formFactor: 'Micro-ATX',
      slotsCount: 4
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Lote 01-A verificado. Construcción reforzada para jornadas intensas.'
  },
  {
    id: 'mb-asrock-b550m-hdv',
    categoria: 'motherboard',
    marca: 'ASRock',
    modelo: 'B550M-HDV',
    nombre: 'ASRock B550M-HDV (AM4 / DDR4)',
    precio: 249,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Socket AM4 · compatible Ryzen 3000 / 4000G / 5000 series',
      'Chipset B550 · soporte DDR4 hasta 4733+ MHz (OC)',
      '1x PCIe 4.0 x16 (GPU) + 1x PCIe 3.0 x1 · 4x SATA3 · 1x M.2',
      'VRM 12+2 fases · Audio 7.1 Realtek ALC887',
      'Formato Micro-ATX · mejor relación costo/beneficio en AM4'
    ],
    compatibilidad: {
      socket: 'AM4',
      ramType: 'DDR4',
      formFactor: 'Micro-ATX',
      slotsCount: 2
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.asrock.com/mb/AMD/B550M-HDV/index.es.asp',
    observaciones: 'Lote 01-A. Solución económica para socket AM4 con DDR4.'
  },
  {
    id: 'combo-kit-asrock-5700x-32gb',
    categoria: 'motherboard',
    marca: 'Combo EliTech',
    modelo: 'Kit ASRock B550M + Ryzen 7 5700X + 32GB DDR4',
    nombre: 'Kit Placa + Micro + Memorias 2x16GB (AM4 / 32GB)',
    precio: 650,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Placa ASRock B550M-HDV + CPU Ryzen 7 5700X combo 8 núcleos',
      '2x Samsung DDR4 de 16GB cada una · 32GB dual-channel incluidos',
      'Configuración lista para armar · socket AM4 · chipset B550',
      'Rendimiento gaming 1080p/1440p probado y garantizado',
      'Combo testeado contra hardware físico en banco de pruebas'
    ],
    compatibilidad: {
      socket: 'AM4',
      ramType: 'DDR4',
      formFactor: 'Micro-ATX',
      tdp: 65
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Combo estrella del Lote 01-A. Ahorra tiempo y costo de armado.'
  },

  // ==================== PROCESADORES (LOTE REAL 01-A) ====================
  {
    id: 'cpu-ryzen-7-5700x',
    categoria: 'cpu',
    marca: 'AMD',
    modelo: 'Ryzen 7 5700X',
    nombre: 'AMD Ryzen 7 5700X (8c/16t AM4)',
    precio: 290,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Zen 3 · Socket AM4 · 8 núcleos / 16 hilos',
      'Base 3.4 GHz · Boost hasta 4.6 GHz · TDP 65W (bajo consumo)',
      'Caché L3 32MB · Litografía 7nm FinFET · excelente eficiencia térmica',
      'Arquitectura probada con compatibilidad total DDR4',
      'Incluye cooler Wraith Stealth en combo · ideal productividad y gaming'
    ],
    compatibilidad: {
      socket: 'AM4',
      ramType: 'DDR4',
      tdp: 65
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://pcparts.com.uy/product/cpu-amd-ryzen-7-5700x-am4/',
    observaciones: 'Lote 01-A. Gran equilibrio para jugar y trabajar sin calentar.'
  },
  {
    id: 'cpu-athlon-x4-950',
    categoria: 'cpu',
    marca: 'AMD',
    modelo: 'Athlon X4 950',
    nombre: 'AMD Athlon X4 950 (AM4)',
    precio: 30,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      '4 núcleos / 4 hilos · Socket AM4 · TDP 65W',
      'Base 3.5 GHz · arquitectura Excavator 28nm',
      'Blister original sin abrir · raro de encontrar',
      'Coleccionable · compatible con placas base AM4',
      'Ideal para retro-build, servidor básico o prueba de banco'
    ],
    compatibilidad: {
      socket: 'AM4',
      ramType: 'DDR4',
      tdp: 65
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.techpowerup.com/cpu-specs/athlon-x4-950.c1962',
    observaciones: 'Lote 01-A. Entrada ultra económica en AM4.'
  },

  // ==================== MEMORIA RAM (LOTE REAL 01-A) ====================
  {
    id: 'ram-kingston-fury-64gb-ddr5',
    categoria: 'ram',
    marca: 'Kingston',
    modelo: 'FURY Beast DDR5 64GB kit (2x32GB)',
    nombre: 'Kingston FURY Beast DDR5 64GB kit (2x32GB 6000MHz)',
    precio: 550,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Kit 2x32GB · DDR5-6000 MHz · CAS Latency 30/36',
      'Capacidad total: 64GB · configuración dual-channel optimizada',
      'RGB con efectos personalizables · perfiles Intel XMP 3.0 / AMD EXPO',
      'Disipadores de calor pasivo de aluminio anodizado',
      'Compatible con sockets AM5 y LGA1700 · rendimiento sin cuello de botella'
    ],
    compatibilidad: {
      ramType: 'DDR5'
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.mercadolibre.com.uy/kit-memoria-ram-kingston-fury-beast-ddr5-64gb-5200mts-udimm/p/MLU29367972',
    observaciones: 'Lote 01-A verificado. Capacidad extrema para render, edición 4K y gaming pesado.'
  },
  {
    id: 'ram-kingbank-16gb-ddr5',
    categoria: 'ram',
    marca: 'KingBank',
    modelo: 'SharpBlade DDR5 16GB 5600MHz',
    nombre: 'KingBank SharpBlade DDR5 16GB (MSI MPOWER Edition)',
    precio: 110,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      '16GB módulo individual · DDR5-5600 MHz · CAS Latency 28-38',
      'Edición especial MSI MPOWER · diseño gamer plateado y negro',
      'RGB efecto dinámico · perfil EXPO preconfigurado para AM5',
      'Logo MSI y edición confirmados visualmente contra la pieza física',
      'Compatibilidad total con placas base AM5 B650 y B840'
    ],
    compatibilidad: {
      ramType: 'DDR5'
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.kingbank.com/en/MemoryProduct/410.html',
    observaciones: 'Lote 01-A. Módulo DDR5 estético y veloz.'
  },
  {
    id: 'ram-samsung-32gb-ddr4',
    categoria: 'ram',
    marca: 'Samsung',
    modelo: 'DDR4 2x16GB 3200MHz',
    nombre: 'Samsung DDR4 2x16GB (32GB Dual-Channel)',
    precio: 75,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      '2 módulos Samsung originales · 16GB cada uno · DDR4-3200',
      'Capacidad total: 32GB configuración dual-channel balanceada',
      'Tipo DDR4 · latencia CAS 22 · voltaje 1.2V estándar JEDEC',
      'Compatibilidad certificada ASRock B550 + Ryzen 5700X',
      'Garantía de estabilidad total para uso intensivo'
    ],
    compatibilidad: {
      ramType: 'DDR4'
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Lote 01-A. Excelente confiabilidad Samsung en DDR4.'
  },

  // ==================== ACCESORIOS Y VENTILADORES (LOTE REAL 01-A) ====================
  {
    id: 'fan-deepcool-cf120-x5',
    categoria: 'cooling',
    marca: 'DeepCool',
    modelo: 'CF120 RGB (Pack x5)',
    nombre: 'Ventilador DeepCool CF120 — Pack x5',
    precio: 50,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Modelo DF1202512CL007 · 120mm · hasta 2000 RPM máx',
      'Flujo de aire 47.3 CFM · presión estática 2.56 mmH₂O',
      'RGB direccionable 16.8M colores · conector PWM 4-pin estándar',
      'Bajo nivel de ruido 20.9 dB · vida útil 50,000 horas',
      'Set de 5 unidades · flujo de aire masivo para cualquier gabinete'
    ],
    compatibilidad: {},
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://es.deepcool.com/products/Cooling/fans/CF120-RGB-PWM-Fan-Single/2021/12581.shtml',
    observaciones: 'Lote 01-A. 5 ventiladores completos para refrigerar todo el chasis.'
  },
  {
    id: 'fan-nox-hummer-x2',
    categoria: 'cooling',
    marca: 'Nox',
    modelo: 'Hummer Fan Series (Pack x2)',
    nombre: 'Ventilador Nox Hummer Fan Series — Pack x2',
    precio: 35,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Hummer Fan Series · 120mm · 1200-1500 RPM',
      'Diseño aerodinámico optimizado para presión de salida',
      'Conector PWM 4-pin · compatible con cualquier motherboard',
      'Silencioso y confiable para gabinete medio o frontal',
      'Set de 2 unidades verificado físicamente'
    ],
    compatibilidad: {},
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.nox-xtreme.com/refrigeracion/a-fan',
    observaciones: 'Lote 01-A. Ventiladores de apoyo silenciosos.'
  },

  // ==================== ALMACENAMIENTO (STOCK COMPLEMENTARIO DEL NEGOCIO) ====================
  {
    id: 'storage-kingston-nv2-1tb',
    categoria: 'storage',
    marca: 'Kingston',
    modelo: 'NV2 1TB NVMe PCIe 4.0',
    nombre: 'Kingston NV2 1TB M.2 PCIe 4.0 NVMe',
    precio: 75,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    stock: 4,
    especificaciones: [
      'Formato M.2 2280 · Interfaz PCIe 4.0 x4 NVMe',
      'Velocidad de lectura hasta 3500 MB/s · escritura 2100 MB/s',
      'Consumo mínimo y formato compacto sin cables',
      'Capacidad: 1TB (1000GB) para Windows y 10+ juegos AAA'
    ],
    compatibilidad: {},
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Stock disponible en taller de armado.'
  },
  {
    id: 'storage-kc3000-2tb',
    categoria: 'storage',
    marca: 'Kingston',
    modelo: 'KC3000 2TB PCIe 4.0 Pro',
    nombre: 'Kingston KC3000 2TB NVMe PCIe 4.0 (7000 MB/s)',
    precio: 165,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    stock: 2,
    especificaciones: [
      'Lectura 7000 MB/s · escritura 7000 MB/s · controlador Phison E18',
      'Disipador de aluminio y grafeno incluido',
      'Capacidad: 2TB para máxima velocidad en juegos y edición 4K'
    ],
    compatibilidad: {},
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Stock disponible en taller.'
  },

  // ==================== FUENTES DE PODER (STOCK COMPLEMENTARIO DEL NEGOCIO) ====================
  {
    id: 'psu-gigabyte-650w-bronze',
    categoria: 'psu',
    marca: 'Gigabyte',
    modelo: 'P650B 650W 80 Plus Bronze',
    nombre: 'Gigabyte P650B 650W 80+ Bronze',
    precio: 75,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    stock: 3,
    especificaciones: [
      'Certificación 80 Plus Bronze (hasta 89% de eficiencia)',
      'Condensadores 100% japoneses · riel único de +12V',
      'Ventilador hidráulico de 120mm silencioso',
      'Conectores: 2x PCIe 8-pin, 6x SATA, 1x CPU 4+4 pin'
    ],
    compatibilidad: {
      tdp: 650
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Ideal para configuraciones con RTX 5070 o RX 7600.'
  },
  {
    id: 'psu-gigabyte-ud750gm-gold',
    categoria: 'psu',
    marca: 'Gigabyte',
    modelo: 'UD750GM 750W 80 Plus Gold Modular',
    nombre: 'Gigabyte UD750GM 750W 80+ Gold Modular',
    precio: 95,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    stock: 2,
    especificaciones: [
      'Potencia continua real de 750W con certificación 80 PLUS Gold',
      'Ultra Durable: Condensadores 100% japoneses principales',
      'Ventilador hidráulico de 120mm inteligente (parada silenciosa)',
      'Diseño totalmente modular para mantener el gabinete despejado',
      'Protecciones completas OVP/OPP/SCP/UVP/OCP/OTP'
    ],
    compatibilidad: {
      tdp: 750,
      formFactor: 'ATX'
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://www.gigabyte.com/es/Power-Supply/GP-UD750GM',
    observaciones: 'Stock disponible en taller. Pareja perfecta y recomendada para la Gigabyte RX 7800 XT.'
  },
  {
    id: 'psu-msi-mag-a750gl-gold',
    categoria: 'psu',
    marca: 'MSI',
    modelo: 'MAG A750GL PCIE5 750W 80+ Gold Modular ATX 3.0',
    nombre: 'MSI MAG A750GL PCIE5 750W 80+ Gold Modular (ATX 3.0)',
    precio: 105,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=80',
    stock: 2,
    especificaciones: [
      'Estándar ATX 3.0 y soporte nativo PCIe 5.0 con conector 12VHPWR',
      'Eficiencia 80 PLUS Gold certificada',
      'Diseño compacto de 140mm de profundidad (entra en cualquier gabinete)',
      'Totalmente modular con cables planos negros de fácil ordenamiento'
    ],
    compatibilidad: {
      tdp: 750,
      formFactor: 'ATX'
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    enlaceOficial: 'https://latam.msi.com/Power-Supply/MAG-A750GL-PCIE5',
    observaciones: 'Stock disponible en taller. Ideal para GPUs modernas con picos transitorios.'
  },
  {
    id: 'psu-corsair-rm850e-gold',
    categoria: 'psu',
    marca: 'Corsair',
    modelo: 'RM850e 850W 80 Plus Gold ATX 3.0',
    nombre: 'Corsair RM850e 850W 80+ Gold (ATX 3.0 Modular)',
    precio: 149,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    stock: 2,
    especificaciones: [
      'Certificación 80 Plus Gold · Totalmente modular',
      'Estándar ATX 3.0 con conector nativo PCIe 5.0 12VHPWR',
      'Potencia continua de 850W para placas de alto consumo',
      'Modo Zero RPM silencioso en cargas medias y bajas'
    ],
    compatibilidad: {
      tdp: 850,
      formFactor: 'ATX'
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Recomendada para XFX RX 9070 XT y configuraciones tope de gama.'
  },

  // ==================== GABINETES (STOCK COMPLEMENTARIO DEL NEGOCIO) ====================
  {
    id: 'case-kolink-void-rgb',
    categoria: 'case',
    marca: 'Kolink',
    modelo: 'Void RGB Espejo Infinito',
    nombre: 'Gabinete Kolink Void RGB (Vidrio Templado)',
    precio: 68,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    stock: 3,
    especificaciones: [
      'Panel frontal con efecto de espejo infinito ARGB',
      'Panel lateral de vidrio templado transparente',
      'Soporte para placas Micro-ATX y ATX estándar',
      'Soporte para placas de video hasta 310mm de largo',
      'Espacio para 5 ventiladores de 120mm y radiador frontal'
    ],
    compatibilidad: {
      formFactor: 'ATX',
      gpuMaxLengthMm: 310,
      coolerMaxHeightMm: 160
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'Estética gamer con iluminación frontal impactante.'
  },
  {
    id: 'case-deepcool-cc560-airflow',
    categoria: 'case',
    marca: 'DeepCool',
    modelo: 'CC560 V2 Airflow Mesh 4x Fans',
    nombre: 'Gabinete DeepCool CC560 V2 Airflow (4x Fans incluidos)',
    precio: 85,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    stock: 2,
    especificaciones: [
      'Frontal en mesh perforado de alto flujo de aire',
      'Incluye 4 ventiladores LED de 120mm preinstalados',
      'Soporta placas de video de hasta 370mm (entra cualquier GPU grande)',
      'Vidrio templado lateral con soporte para radiadores de hasta 360mm'
    ],
    compatibilidad: {
      formFactor: 'ATX',
      gpuMaxLengthMm: 370,
      coolerMaxHeightMm: 163
    },
    origen: 'CATALOGO',
    estado: 'DISPONIBLE',
    observaciones: 'El chasis más recomendado por ventilación para la RX 9070 XT.'
  },

  // ==================== MONITORES (OPCIONALES) ====================
  {
    id: 'mon-asus-tuf-24-165hz',
    categoria: 'monitor',
    marca: 'Asus',
    modelo: 'TUF Gaming VG249Q1A 24" 165Hz IPS',
    nombre: 'Monitor Asus TUF 24" 165Hz IPS FHD 1ms',
    precio: 190,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    stock: 2,
    especificaciones: [
      'Panel IPS de 23.8" Full HD (1920x1080)',
      'Tasa de refresco 165Hz · Tiempo de respuesta 1ms MPRT',
      'FreeSync Premium · 100% sRGB · DisplayPort + 2x HDMI'
    ],
    compatibilidad: {},
    origen: 'CATALOGO',
    estado: 'DISPONIBLE'
  },
  {
    id: 'mon-gigabyte-27-170hz-qhd',
    categoria: 'monitor',
    marca: 'Gigabyte',
    modelo: 'M27Q 27" 170Hz IPS 1440p',
    nombre: 'Monitor Gigabyte 27" 170Hz IPS QHD 1440p KVM',
    precio: 299,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80',
    stock: 1,
    especificaciones: [
      'Resolución 2K QHD (2560x1440) · Panel SuperSpeed IPS',
      '170Hz overclockeable · 0.5ms respuesta · 92% DCI-P3 / 140% sRGB',
      'KVM integrado para controlar dos equipos con un solo teclado/mouse'
    ],
    compatibilidad: {},
    origen: 'CATALOGO',
    estado: 'DISPONIBLE'
  },

  // ==================== RECOMENDACIONES GAMER POPULARES (A CONSEGUIR / IMPORTABLES) ====================
  // Componentes estándar de referencia en la comunidad gamer mundial (PCPartPicker, TechPowerUp)
  {
    id: 'cpu-ryzen-5-5600',
    categoria: 'cpu',
    marca: 'AMD',
    modelo: 'Ryzen 5 5600 6-Core 4.4GHz Boost AM4',
    nombre: 'AMD Ryzen 5 5600 (6 Cores / 12 Hilos · 4.4GHz)',
    precio: 139,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '6 núcleos físicos / 12 hilos multithreading (Zen 3)',
      'Frecuencia base 3.5GHz con Boost automático hasta 4.4GHz',
      '35MB GameCache · Consumo eficiente de 65W TDP',
      'Incluye disipador original Wraith Stealth de fábrica',
      'Socket AM4 · Compatible con motherboards A520, B450 y B550'
    ],
    compatibilidad: {
      socket: 'AM4',
      tdp: 65,
      integratedGraphics: false
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/PgcG3C/amd-ryzen-5-5600-35-ghz-6-core-processor-100-100000927box',
    observaciones: '⭐ Recomendación Gamer: El procesador rey indiscutido en relación calidad/precio para 1080p competitivo.'
  },
  {
    id: 'cpu-ryzen-7-7800x3d',
    categoria: 'cpu',
    marca: 'AMD',
    modelo: 'Ryzen 7 7800X3D 8-Core con 3D V-Cache AM5',
    nombre: 'AMD Ryzen 7 7800X3D (8 Cores / 16 Hilos · 3D V-Cache 96MB)',
    precio: 449,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '8 núcleos / 16 hilos con arquitectura Zen 4 y tecnología 3D V-Cache',
      '96MB L3 Cache masiva para máximos FPS en e-sports',
      'Frecuencia hasta 5.0GHz · Plataforma moderna Socket AM5 (DDR5 + PCIe 5.0)',
      'Gráficos integrados Radeon RDNA 2 para video de emergencia',
      'Considerada la CPU #1 del mundo para gaming puro'
    ],
    compatibilidad: {
      socket: 'AM5',
      tdp: 120,
      integratedGraphics: true
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/3hyH99/amd-ryzen-7-7800x3d-42-ghz-8-core-processor-100-100000910wof',
    observaciones: '⭐ Recomendación Gamer: La CPU más veloz para CS2, Valorant, Warzone y simuladores. El estándar de los torneos e-sports.'
  },
  {
    id: 'cpu-intel-core-i5-13400f',
    categoria: 'cpu',
    marca: 'Intel',
    modelo: 'Core i5-13400F 10 Cores (6P + 4E) LGA1700',
    nombre: 'Intel Core i5-13400F (10 Cores / 16 Hilos · 4.6GHz)',
    precio: 189,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '10 núcleos (6 Performance Cores + 4 Efficient Cores) / 16 hilos',
      'Turbo Boost hasta 4.6GHz · 20MB Intel Smart Cache',
      'Socket LGA1700 · Soporta memorias DDR4 y DDR5',
      'TDP base 65W · Excelente para jugar y trabajar en simultáneo'
    ],
    compatibilidad: {
      socket: 'LGA1700',
      tdp: 65,
      integratedGraphics: false
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/VNkWGX/intel-core-i5-13400f-25-ghz-10-core-processor-bx8071513400f',
    observaciones: '⭐ Recomendación Gamer: Alternativa Intel de alta demanda para usuarios que buscan multitarea equilibrada.'
  },
  {
    id: 'gpu-nvidia-rtx-4060-8gb',
    categoria: 'gpu',
    marca: 'MSI',
    modelo: 'GeForce RTX 4060 Ventus 2X Black 8GB GDDR6',
    nombre: 'MSI GeForce RTX 4060 Ventus 2X 8GB (DLSS 3)',
    precio: 339,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Arquitectura Ada Lovelace · 3072 CUDA Cores',
      '8GB GDDR6 · DLSS 3 con generación de fotogramas por IA (Frame Generation)',
      'Ray Tracing de 3ra generación · NVENC de 8va generación para streaming',
      'Consumo bajísimo de apenas 115W (funciona con fuentes de 500W)',
      'Diseño compacto dual fan de 199mm compatible con cualquier gabinete'
    ],
    compatibilidad: {
      tdp: 115,
      recommendedPsuWatts: 500,
      lengthMm: 199
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/4QtLrH/msi-ventus-2x-black-oc-geforce-rtx-4060-8-gb-video-card-rtx-4060-ventus-2x-black-8g-oc',
    observaciones: '⭐ Recomendación Gamer: La tarjeta gráfica NVIDIA más popular para 1080p con DLSS 3 y streaming en Twitch.'
  },
  {
    id: 'gpu-nvidia-rtx-4070-super-12gb',
    categoria: 'gpu',
    marca: 'Gigabyte',
    modelo: 'GeForce RTX 4070 SUPER Windforce OC 12GB GDDR6X',
    nombre: 'Gigabyte GeForce RTX 4070 SUPER Windforce OC 12GB',
    precio: 649,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '7168 CUDA Cores · 12GB GDDR6X ultra rápida · bus 192-bit',
      'DLSS 3.5 con Ray Reconstruction y Frame Generation',
      'Rendimiento sobresaliente en 1440p Ultra con más de 120 FPS en casi todo',
      'Sistema de disipación WINDFORCE con 3 ventiladores alternados',
      'Consumo eficiente de 220W TDP · Conector 16-pin 12VHPWR'
    ],
    compatibilidad: {
      tdp: 220,
      recommendedPsuWatts: 650,
      lengthMm: 261
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/7LkH99/gigabyte-windforce-oc-geforce-rtx-4070-super-12-gb-video-card-gv-n407swf3oc-12gd',
    observaciones: '⭐ Recomendación Gamer: El punto dulce indiscutido de gama alta para monitores 1440p de 144Hz o 165Hz.'
  },
  {
    id: 'gpu-amd-rx-6600-8gb',
    categoria: 'gpu',
    marca: 'Sapphire',
    modelo: 'Pulse Radeon RX 6600 8GB GDDR6',
    nombre: 'Sapphire Pulse Radeon RX 6600 8GB GDDR6',
    precio: 219,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Arquitectura RDNA 2 · 1792 Stream Processors · 32MB Infinity Cache',
      '8GB GDDR6 · 1080p con gráficos altos/ultra en todos los juegos',
      'Disipador Dual-X con rodamientos dobles y control inteligente de fans',
      'Consumo muy bajo de 132W TDP (funciona con fuente de 450W o 500W)',
      'Soporte FSR 3 con generación de cuadros'
    ],
    compatibilidad: {
      tdp: 132,
      recommendedPsuWatts: 500,
      lengthMm: 193
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/gS92FT/sapphire-radeon-rx-6600-8-gb-pulse-video-card-11310-01-20g',
    observaciones: '⭐ Recomendación Gamer: La placa más recomendada para armar una PC gamer de entrada económica sin sacrificar FPS.'
  },
  {
    id: 'mb-msi-pro-b650m-a-wifi',
    categoria: 'motherboard',
    marca: 'MSI',
    modelo: 'PRO B650M-A WiFi Micro-ATX Socket AM5',
    nombre: 'MSI PRO B650M-A WiFi (Socket AM5 · DDR5)',
    precio: 159,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Socket AM5 compatible con AMD Ryzen series 7000, 8000 y 9000',
      'Soporta memorias DDR5 hasta 6400+ MHz (OC) con perfiles EXPO',
      'Wi-Fi 6E y Bluetooth 5.3 integrados de fábrica',
      '2 ranuras M.2 PCIe 4.0 x4 con disipador Shield Frozr',
      'VRM de 8+2+1 fases para soportar hasta Ryzen 9 sin sobrecalentamiento'
    ],
    compatibilidad: {
      socket: 'AM5',
      ramType: 'DDR5',
      maxRamGb: 192,
      m2Slots: 2,
      formFactor: 'Micro-ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/cRQcCJ/msi-pro-b650m-a-wifi-micro-atx-am5-motherboard-pro-b650m-a-wifi',
    observaciones: '⭐ Recomendación Gamer: La placa AM5 con WiFi más confiable para armados con Ryzen 5 7600 o Ryzen 7 7800X3D.'
  },
  {
    id: 'mb-asus-prime-b550m-a-wifi',
    categoria: 'motherboard',
    marca: 'ASUS',
    modelo: 'Prime B550M-A WiFi II Micro-ATX Socket AM4',
    nombre: 'ASUS Prime B550M-A WiFi II (Socket AM4 · DDR4)',
    precio: 119,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Socket AM4 para procesadores Ryzen 3000, 4000 y 5000',
      '4 slots de memoria DDR4 hasta 128GB a 4866MHz (OC)',
      'Wi-Fi 6 (802.11ax) y Bluetooth integrados',
      'Ranura PCIe 4.0 x16 reforzada y 2 slots M.2 (uno PCIe 4.0)',
      'Salidas HDMI 2.1, DVI y D-Sub con soporte para múltiples monitores'
    ],
    compatibilidad: {
      socket: 'AM4',
      ramType: 'DDR4',
      maxRamGb: 128,
      m2Slots: 2,
      formFactor: 'Micro-ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/pZ3NnQ/asus-prime-b550m-a-wifi-ii-micro-atx-am4-motherboard-prime-b550m-a-wifi-ii',
    observaciones: '⭐ Recomendación Gamer: La base perfecta para una build económica con Ryzen 5 5600 y conexión inalámbrica.'
  },
  {
    id: 'ram-corsair-vengeance-32gb-ddr5-6000',
    categoria: 'ram',
    marca: 'Corsair',
    modelo: 'Vengeance 32GB (2x16GB) DDR5 6000MHz CL30 AMD EXPO',
    nombre: 'RAM Corsair Vengeance 32GB (2x16GB) DDR5-6000MHz CL30',
    precio: 119,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Kit Dual Channel 32GB (2 módulos de 16GB)',
      'Frecuencia 6000 MHz con latencias ultra bajas CL30 (30-36-36-76)',
      'El "punto dulce" (sweet spot) de máxima eficiencia para CPUs AMD AM5',
      'Soporte AMD EXPO e Intel XMP 3.0 con activación en 1 click',
      'Disipador de aluminio negro de perfil bajo'
    ],
    compatibilidad: {
      ramType: 'DDR5',
      ramSpeed: '6000MHz CL30',
      formFactor: 'DIMM'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/JkfxFT/corsair-vengeance-32-gb-2-x-16-gb-ddr5-6000-cl30-memory-cmk32gx5m2b6000z30',
    observaciones: '⭐ Recomendación Gamer: La memoria DDR5 más recomendada en Reddit por su bajísima latencia CL30.'
  },
  {
    id: 'ram-kingston-fury-16gb-ddr4-3200',
    categoria: 'ram',
    marca: 'Kingston',
    modelo: 'Fury Beast 16GB (2x8GB) DDR4 3200MHz CL16',
    nombre: 'RAM Kingston Fury Beast 16GB (2x8GB) DDR4-3200MHz CL16',
    precio: 49,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Kit Dual Channel 16GB (2 módulos de 8GB)',
      'Velocidad estándar gamer 3200MHz con latencia CL16',
      'Disipador térmico negro de bajo perfil (entra bajo cualquier cooler)',
      'Plug N Play a 2666MHz con perfil Intel XMP / AMD Ready a 3200MHz',
      'Garantía de por vida de Kingston'
    ],
    compatibilidad: {
      ramType: 'DDR4',
      ramSpeed: '3200MHz CL16',
      formFactor: 'DIMM'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/6YfnTW/kingston-fury-beast-16-gb-2-x-8-gb-ddr4-3200-cl16-memory-kf432c16bbk216',
    observaciones: '⭐ Recomendación Gamer: El kit DDR4 estándar básico para cualquier setup gamer accesible.'
  },
  {
    id: 'storage-kingston-kc3000-1tb',
    categoria: 'storage',
    marca: 'Kingston',
    modelo: 'KC3000 PCIe 4.0 NVMe M.2 1TB 7000MB/s con DRAM',
    nombre: 'SSD Kingston KC3000 1TB NVMe M.2 (7000 MB/s con DRAM)',
    precio: 95,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Velocidad de lectura secuencial hasta 7000 MB/s y escritura 6000 MB/s',
      'Controlador Phison PS5018-E18 con DRAM caché DDR4 dedicada',
      'Disipador de calor plano de aluminio con grafeno',
      'Durabilidad de 800 TBW (Terabytes Escritos) y 5 años de garantía',
      'Ideal para tiempos de carga inmediatos con Microsoft DirectStorage'
    ],
    compatibilidad: {
      formFactor: 'M.2 NVMe'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/ccFbt6/kingston-kc3000-1024-tb-m2-2280-nvme-solid-state-drive-skc3000s1024g',
    observaciones: '⭐ Recomendación Gamer: Disco NVMe gama alta con DRAM que no baja de velocidad ni con transferencias gigantes.'
  },
  {
    id: 'storage-crucial-p3-plus-1tb',
    categoria: 'storage',
    marca: 'Crucial',
    modelo: 'P3 Plus 1TB PCIe 4.0 3D NAND NVMe M.2 5000MB/s',
    nombre: 'SSD Crucial P3 Plus 1TB NVMe M.2 PCIe 4.0 (5000 MB/s)',
    precio: 68,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Lecturas de hasta 5000 MB/s · Casi 10x más veloz que un SSD SATA',
      'Tecnología Micron Advanced 3D NAND Gen4 x4',
      'Formato M.2 2280 estándar compatible con cualquier motherboard moderna',
      'Excelente relación costo por gigabyte para instalar bibliotecas de juegos pesados'
    ],
    compatibilidad: {
      formFactor: 'M.2 NVMe'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/chzhP6/crucial-p3-plus-1-tb-m2-2280-nvme-solid-state-drive-ct1000p3pssd8',
    observaciones: '⭐ Recomendación Gamer: El SSD M.2 PCIe 4.0 más vendido para armados con presupuesto ajustado.'
  },
  {
    id: 'psu-corsair-rm750e-gold',
    categoria: 'psu',
    marca: 'Corsair',
    modelo: 'RM750e (2023) 750W 80+ Gold Full Modular ATX 3.0',
    nombre: 'Fuente Corsair RM750e 750W 80+ Gold Modular (ATX 3.0)',
    precio: 109,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Potencia real continua de 750W con certificación 80 PLUS Gold y Cybenetics Gold',
      'Cumple estándar ATX 3.0 y PCIe 5.0 con conector 12VHPWR nativo',
      '100% modular: conectás solo los cables que necesitás',
      'Ventilador de 120mm con modo Zero RPM para silencio absoluto en reposo',
      'Clasificada como Tier A (Gama Alta) en la PSU Tier List de Cultists Network'
    ],
    compatibilidad: {
      tdp: 750,
      formFactor: 'ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/YRJp99/corsair-rm750e-2023-750-w-80-gold-certified-fully-modular-atx-power-supply-cp-9020262-na',
    observaciones: '⭐ Recomendación Gamer: La fuente de poder más sugerida para alimentar GPUs RTX 4070 / RX 7800 XT con seguridad total.'
  },
  {
    id: 'psu-evga-750-bp-bronze',
    categoria: 'psu',
    marca: 'EVGA',
    modelo: '750 BP 750W 80+ Bronze',
    nombre: 'EVGA 750 BP 750W 80+ Bronze',
    precio: 79,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '750W continuos con certificación 80 PLUS Bronze (hasta 85% de eficiencia)',
      'La opción de 750W más accesible para cuidar el presupuesto sin sacrificar potencia',
      'Protecciones completas OVP, UVP, OCP, OPP, SCP',
      'Ventilador silencioso de 120mm con control térmico automático'
    ],
    compatibilidad: {
      tdp: 750,
      formFactor: 'ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/tkjNnQ/evga-750-bp-750-w-80-bronze-certified-atx-power-supply-100-bp-0750-k1',
    observaciones: '⭐ Recomendación Gamer: La 750W más económica para RX 7800 XT o RTX 4070 cuando el presupuesto es ajustado.'
  },
  {
    id: 'psu-seasonic-focus-gx750',
    categoria: 'psu',
    marca: 'Seasonic',
    modelo: 'Focus GX-750 750W 80+ Gold Full Modular',
    nombre: 'Seasonic Focus GX-750 750W 80+ Gold Modular',
    precio: 119,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'La marca de fuentes más legendaria y respetada por técnicos e ingenieros',
      'Certificación 80 PLUS Gold con condensadores japoneses a 105°C',
      'Regulación de voltaje estricta (Tight Voltage Regulation < 3%)',
      'Control de ventilador silencioso híbrido S3FC y 10 años de garantía de fábrica'
    ],
    compatibilidad: {
      tdp: 750,
      formFactor: 'ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/97848d/seasonic-focus-gx-750-w-80-gold-certified-fully-modular-atx-power-supply-focus-gx-750',
    observaciones: '⭐ Recomendación Gamer: Tier A dorada. Componentes internos indestructibles para una PC que dure 10 años.'
  },
  {
    id: 'psu-thermaltake-gf1-850w',
    categoria: 'psu',
    marca: 'Thermaltake',
    modelo: 'Toughpower GF1 850W 80+ Gold Full Modular',
    nombre: 'Thermaltake Toughpower GF1 850W 80+ Gold Modular',
    precio: 115,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '850W continuo de potencia pura con certificación 80 PLUS Gold',
      'Riel único de +12V y diseño LLC de alta eficiencia',
      'Condensadores 100% japoneses de alta calidad',
      'Ventilador Smart Zero Fan con botón trasero para modo pasivo'
    ],
    compatibilidad: {
      tdp: 850,
      formFactor: 'ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/P7pmP6/thermaltake-toughpower-gf1-pe-850-w-80-gold-certified-fully-modular-atx-power-supply-ps-tpd-0850fnfagu-1',
    observaciones: '⭐ Recomendación Gamer: 850W reales de alto rendimiento a un precio muy conveniente.'
  },
  {
    id: 'psu-corsair-rm1000e-gold',
    categoria: 'psu',
    marca: 'Corsair',
    modelo: 'RM1000e 1000W 80+ Gold Full Modular ATX 3.0',
    nombre: 'Corsair RM1000e 1000W 80+ Gold Modular (ATX 3.0)',
    precio: 179,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      '1000W de potencia masiva continua para builds extremas y overclocking',
      'Estándar ATX 3.0 con cable 12VHPWR para placas de video de nueva generación',
      'Certificación Cybenetics Platinum y 80 PLUS Gold',
      'Ventilador de 120mm con rodamiento rifle y modo de reposo silencioso'
    ],
    compatibilidad: {
      tdp: 1000,
      formFactor: 'ATX'
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/fxGhP6/corsair-rm1000e-2023-1000-w-80-gold-certified-fully-modular-atx-power-supply-cp-9020264-na',
    observaciones: '⭐ Recomendación Gamer: Potencia de sobra para placas tope de gama como RX 9070 XT o setups multi-disco.'
  },
  {
    id: 'cooling-thermalright-peerless-assassin',
    categoria: 'cooling',
    marca: 'Thermalright',
    modelo: 'Peerless Assassin 120 SE Dual Tower 6 Heatpipes',
    nombre: 'Cooler CPU Thermalright Peerless Assassin 120 SE (Doble Torre)',
    precio: 42,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Doble torre de aletas de aluminio con 6 heatpipes de cobre puro de 6mm',
      '2 ventiladores TL-C12C PWM de 120mm con rodamientos S-FDB ultra silenciosos',
      'Rendimiento térmico que iguala o supera a refrigeraciones líquidas de 240mm',
      'Altura de 155mm compatible con la mayoría de los gabinetes ATX',
      'Compatible con sockets AMD AM4/AM5 e Intel LGA1700/1200'
    ],
    compatibilidad: {
      coolerMaxHeightMm: 155
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/hYxRsY/thermalright-peerless-assassin-120-se-6617-cfm-cpu-cooler-pa120-se-d3',
    observaciones: '⭐ Recomendación Gamer: El disipador por aire más premiado por reviewers en YouTube (Hardware Canucks, Gamers Nexus).'
  },
  {
    id: 'case-montech-air-903-max',
    categoria: 'case',
    marca: 'Montech',
    modelo: 'AIR 903 MAX Black High Airflow 4x 140mm Fans',
    nombre: 'Gabinete Montech AIR 903 MAX (4x Fans 140mm PWM + ARGB)',
    precio: 89,
    moneda: 'USD',
    imagen: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    stock: 0,
    especificaciones: [
      'Panel frontal ultra-mesh con 51% de porosidad para flujo de aire extremo',
      'Incluye 4 ventiladores de 140mm de fábrica (3 frontales ARGB + 1 trasero PWM)',
      'Espacio gigante para placas de video de hasta 400mm y coolers de 180mm',
      'Puerto USB Type-C 3.2 Gen 2 en el panel superior',
      'Panel lateral de vidrio templado sin tornillos a la vista'
    ],
    compatibilidad: {
      formFactor: 'ATX',
      gpuMaxLengthMm: 400,
      coolerMaxHeightMm: 180
    },
    origen: 'PEDIDO_ESPECIAL',
    estado: 'A_CONSEGUIR',
    enlaceOficial: 'https://pcpartpicker.com/product/2MwmP6/montech-air-903-max-atx-mid-tower-case-air-903-max-b',
    observaciones: '⭐ Recomendación Gamer: El gabinete ATX #1 en relación calidad/precio en PCPartPicker por sus ventiladores de 140mm.'
  }
];
