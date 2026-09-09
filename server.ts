import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// System catalog context for the AI
const CATALOG_SUMMARY = `
ESTE ES EL LOTE REAL Y ACTUAL DE HARDWARE DISPONIBLE EN ELITECH (URUGUAY / MONTEVIDEO):
- PLACAS DE VIDEO (GPU):
  * XFX Radeon RX 9070 XT Quicksilver 16GB GDDR6 (RDNA 4, PCIe 5.0, 3 fans AXIAL, PSU 800W+): $950 USD (Gama Extrema 4K)
  * Gigabyte RX 7800 XT Gaming OC 16GB GDDR6 (RDNA 3, PCIe 4.0, WINDFORCE 3 fans, PSU 750W+): $799 USD (Gama Media/Alta 1440p)
  * PNY GeForce RTX 5070 OC 12GB GDDR7 (Blackwell, DLSS 3.5/4, PCIe 5.0, PSU 650W+): $800 USD (Gama Alta 1440p/4K)

- MOTHERBOARDS:
  * Gigabyte B840M DS3H (Socket AM5, DDR5 hasta 256GB 8200+ MHz OC, PCIe 5.0 x16, 2x M.2, mATX): $180 USD
  * MSI PRO B650M-P (Socket AM5, Chipset B650, DDR5 nativo, PCIe 5.0 M.2, mATX): $220 USD
  * ASRock B550M-HDV (Socket AM4, Chipset B550, DDR4 hasta 4733+ MHz, PCIe 4.0, mATX): $249 USD
  * Kit Placa + Micro + Memorias 2x16GB: ASRock B550M-HDV + AMD Ryzen 7 5700X + 32GB Samsung DDR4: $650 USD (Excelente combo)

- PROCESADORES (CPU):
  * AMD Ryzen 7 5700X (AM4, 8 núcleos / 16 hilos, 3.4 - 4.6 GHz, 65W TDP, 32MB L3, incluye cooler): $290 USD
  * AMD Athlon X4 950 (AM4, 4c/4t, 3.5 GHz, 65W, blister original): $30 USD

- MEMORIAS RAM:
  * Kingston FURY Beast DDR5 64GB kit (2x32GB 6000MHz CL30/36 RGB, EXPO/XMP): $550 USD
  * KingBank SharpBlade DDR5 16GB (5600MHz, MSI MPOWER Edition, RGB, EXPO): $110 USD
  * Samsung DDR4 2x16GB (32GB Dual-Channel 3200MHz CL22): $75 USD

- REFRIGERACIÓN Y GABINETES:
  * Ventilador DeepCool CF120 — Pack x5 (120mm, 2000 RPM, RGB 16.8M, PWM 4-pin): $50 USD
  * Ventilador Nox Hummer Fan Series — Pack x2 (120mm, 1200-1500 RPM, PWM): $35 USD
  * Gabinete Kolink Void RGB (Vidrio templado, espejo infinito): $68 USD
  * Gabinete DeepCool CC560 V2 Airflow Mesh (4x Fans incluidos): $85 USD
  * Fuente Gigabyte P650B 650W 80+ Bronze: $75 USD
  * Fuente Gigabyte UD750GM 750W 80+ Gold Modular: $95 USD (Ideal para RX 7800 XT)
  * Fuente MSI MAG A750GL 750W 80+ Gold ATX 3.0: $105 USD
  * Fuente Corsair RM750e 750W 80+ Gold ATX 3.0: $109 USD
  * Fuente EVGA 750 BP 750W 80+ Bronze: $79 USD (Económica 750W)
  * Fuente Seasonic Focus GX-750 750W 80+ Gold: $119 USD (Tier A indiscutida)
  * Fuente Thermaltake Toughpower GF1 850W 80+ Gold: $115 USD
  * Fuente Corsair RM850e 850W 80+ Gold ATX 3.0: $149 USD (Recomendada para RX 9070 XT)
  * Fuente Corsair RM1000e 1000W 80+ Gold ATX 3.0: $179 USD (Gama Extrema)
  * SSD Kingston NV2 1TB M.2 PCIe 4.0 NVMe: $75 USD
  * SSD Kingston KC3000 2TB PCIe 4.0 (7000 MB/s): $165 USD
`;

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// AI Diagnostic and Key Verification Endpoint
app.get('/api/ai-status', async (req: Request, res: Response) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
  
  if (!hasKey) {
    res.json({
      configured: false,
      status: 'missing_key',
      envVarName: 'GEMINI_API_KEY',
      message: 'No se detectó la variable GEMINI_API_KEY en las variables de entorno. El chat funciona en modo de contingencia local (con respuestas inteligentes del catálogo). Para activar Google Gemini en producción/Vercel, agrega GEMINI_API_KEY en Environment Variables.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    const ai = getGeminiClient();
    if (!ai) throw new Error('No se pudo inicializar el cliente GoogleGenAI');

    // Quick verification ping to Google Gemini
    const testResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Responde únicamente la palabra "OK".'
    });

    res.json({
      configured: true,
      status: 'ready',
      model: 'gemini-3.8-flash',
      envVarName: 'GEMINI_API_KEY',
      message: 'Variable GEMINI_API_KEY configurada y verificada exitosamente con Google Gemini.',
      pingReply: testResponse.text?.trim().slice(0, 20) || 'OK',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error verifying Gemini API key:', err);
    res.json({
      configured: true,
      status: 'error',
      envVarName: 'GEMINI_API_KEY',
      message: `Se detectó GEMINI_API_KEY pero Google devolvió un error: ${err.message || 'Clave inválida o sin cuota'}. Verificá que la clave en Google AI Studio sea correcta.`,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// AI Chat Endpoint for "Módulo E — Asistente / Encontrá tu PC"
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentBuild } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const ai = getGeminiClient();
    const lastUserMessage = messages[messages.length - 1]?.text || '';

    // If no Gemini API key, use rich rule-based smart assistant
    if (!ai) {
      const lower = lastUserMessage.toLowerCase();
      let replyText = '';
      let suggestedBuild: any = null;

      if (lower.includes('1000') || lower.includes('barata') || lower.includes('economica') || lower.includes('fortnite')) {
        replyText = `¡Buenas! Para un presupuesto de ~$1000 USD o juegos como Fortnite, Valorant y GTA V, te recomiendo fuertemente armarla sobre el combo de nuestro lote:

1. **Kit ASRock B550M + Ryzen 7 5700X (8 núcleos) + 32GB DDR4** ($650) del lote.
2. **Placa de video:** Podemos sumarle una gráfica balanceada o la Gigabyte RX 7800 XT de 16GB si podés estirarte, o cotizarte como **[PEDIDO ESPECIAL]** una RTX 4060 de 8GB (~$380).
3. **Almacenamiento:** SSD Kingston NV2 1TB NVMe ($75) del taller.
4. **Fuente:** Gigabyte 650W 80+ Bronze ($75).
5. **Gabinete:** Kolink Void RGB ($68).

¡Todo armado y testeado en banco de pruebas! Podés tocar el botón abajo para cargar estos componentes en el armador.`;

        suggestedBuild = {
          title: 'Configuración Recomendada 1080p / 1440p (8 Cores)',
          summary: 'Ryzen 7 5700X + 32GB RAM + SSD 1TB + Gabinete Kolink Void',
          componentIds: {
            motherboard: 'combo-kit-asrock-5700x-32gb',
            storage: 'storage-kingston-nv2-1tb',
            psu: 'psu-gigabyte-650w-bronze',
            case: 'case-kolink-void-rgb'
          }
        };
      } else if (lower.includes('1440p') || lower.includes('7800 xt') || lower.includes('media') || lower.includes('gta')) {
        replyText = `Para jugar en 1440p fluido con texturas en Ultra y streaming, la opción reina de nuestro lote es la **PC Gamer Media (8 Cores)**:

- **GPU:** Gigabyte RX 7800 XT Gaming OC 16GB ($799) — 16GB de VRAM garantizan cero tirones en Cyberpunk o GTA.
- **CPU:** AMD Ryzen 7 5700X de 8 núcleos / 16 hilos ($290).
- **Motherboard:** ASRock B550M-HDV ($249).
- **RAM:** 32GB Samsung Dual-Channel ($75).
- **Fuente:** Gigabyte 650W 80+ Bronze ($75).
- **Gabinete:** DeepCool CC560 Airflow Mesh ($85) con excelente ventilación.
- **Almacenamiento:** SSD Kingston NV2 1TB NVMe ($75).

Total estimado: ~$1,548 USD. Es una bestia de rendimiento. ¿Querés que te cargue esta configuración en el armador?`;

        suggestedBuild = {
          title: 'PC Gamer 1440p Ultra (16GB VRAM)',
          summary: 'Ryzen 7 5700X + RX 7800 XT 16GB + 32GB RAM + 1TB NVMe',
          componentIds: {
            cpu: 'cpu-ryzen-7-5700x',
            motherboard: 'mb-asrock-b550m-hdv',
            ram: 'ram-samsung-32gb-ddr4',
            gpu: 'gpu-gigabyte-rx7800xt',
            storage: 'storage-kingston-nv2-1tb',
            psu: 'psu-gigabyte-650w-bronze',
            case: 'case-deepcool-cc560-airflow'
          }
        };
      } else if (lower.includes('extrema') || lower.includes('9070') || lower.includes('4k') || lower.includes('mas potente')) {
        replyText = `Si buscás la máquina más potente del taller para 4K nativo y máxima longevidad:

- **GPU:** XFX Radeon RX 9070 XT Quicksilver 16GB (RDNA 4, PCIe 5.0) — $950.
- **Motherboard:** Gigabyte B840M DS3H (Socket AM5 / DDR5) — $180.
- **RAM:** Kingston FURY Beast 64GB DDR5 (2x32GB 6000MHz) — $550.
- **Fuente:** Corsair RM850e 850W Gold Modular — $149.
- **Almacenamiento:** Kingston NV2 1TB o KC3000 2TB ($165).
- **Gabinete:** DeepCool CC560 Airflow + Pack x5 Fans DeepCool CF120 ($50).

Si querés acompañarla con el rey del gaming (Ryzen 7 7800X3D), te lo cargamos como **[PEDIDO ESPECIAL]** y lo conseguimos directo con nuestro proveedor.`;

        suggestedBuild = {
          title: 'Configuración Extrema RDNA 4 / 64GB DDR5',
          summary: 'RX 9070 XT 16GB + B840M AM5 + 64GB RAM DDR5 + 850W Gold',
          componentIds: {
            motherboard: 'mb-gigabyte-b840m-ds3h',
            ram: 'ram-kingston-fury-64gb-ddr5',
            gpu: 'gpu-xfx-rx9070xt',
            psu: 'psu-corsair-rm850e-gold',
            case: 'case-deepcool-cc560-airflow',
            cooling: 'fan-deepcool-cf120-x5',
            storage: 'storage-kingston-nv2-1tb'
          }
        };
      } else {
        replyText = `¡Hola! Soy el asesor de hardware de **EliTech**. Mi trabajo es armarte la PC justa para tu necesidad y presupuesto.

Contamos con un lote físico verificado en Montevideo que incluye gráficas de última generación (Radeon RX 9070 XT 16GB, RX 7800 XT 16GB, RTX 5070 OC 12GB), combos Ryzen de 8 núcleos, y memorias DDR5 de hasta 64GB. Si te falta alguna pieza específica, la tramitamos como **[PEDIDO ESPECIAL]**.

Contame:
1. ¿Qué juegos o programas querés correr principalmente? (Ej. Fortnite, GTA, CS2, Cyberpunk, Premiere, etc.)
2. ¿Qué resolución buscás? (1080p, 1440p o 4K)
3. ¿Cuál es tu presupuesto aproximado en USD?`;
      }

      res.json({
        reply: replyText,
        suggestedBuild
      });
      return;
    }

    // With Gemini API key available
    const systemPrompt = `Eres el asesor técnico de hardware y armador oficial de "EliTech" (negocio de armado y venta de computadoras gamer en Montevideo, Uruguay).
Tu personalidad es cercana, técnica, honesta ("Hardware real, cero relato de vendedor"), humana y profesional.
Habla en español rioplatense sutil o neutro ("Mirá", "Te recomiendo", "Fijate", "Podemos armarla").

DIRECTIVAS ESENCIALES:
1. TU PRIORIDAD ABSOLUTA ES RECOMENDAR COMPONENTES DEL LOTE REAL DE ELITECH listado a continuación:
${CATALOG_SUMMARY}

2. Si el cliente necesita o pide una pieza que NO está en el lote (por ejemplo: procesador Ryzen 7 7800X3D, Ryzen 5 7600, RTX 4060, etc.), dile con total naturalidad que el negocio la consigue mediante proveedor o importación bajo la modalidad [PEDIDO ESPECIAL — A CONSEGUIR].
3. Presta atención a la compatibilidad:
   - AM5 usa DDR5 (MSI B650, Gigabyte B840M).
   - AM4 usa DDR4 (ASRock B550M, Ryzen 5700X).
   - Placas de video potentes como la RX 9070 XT requieren fuente de 750-850W y gabinete amplio.
4. Responde de manera concisa, clara y amigable. No abrumes con textos interminables.
5. Si puedes armar una propuesta concreta para el usuario, añade al final de tu respuesta un bloque JSON delimitado por <<<JSON y JSON>>> con la siguiente estructura:
<<<JSON
{
  "title": "Nombre de la configuración",
  "summary": "Resumen en una frase",
  "componentIds": {
    "cpu": "id-si-aplica",
    "motherboard": "id-si-aplica",
    "ram": "id-si-aplica",
    "gpu": "id-si-aplica",
    "storage": "id-si-aplica",
    "psu": "id-si-aplica",
    "case": "id-si-aplica",
    "cooling": "id-si-aplica"
  }
}
JSON>>>
(Usa los IDs del catálogo provistos: gpu-xfx-rx9070xt, gpu-gigabyte-rx7800xt, gpu-pny-rtx5070, mb-gigabyte-b840m-ds3h, mb-msi-pro-b650m-p, mb-asrock-b550m-hdv, combo-kit-asrock-5700x-32gb, cpu-ryzen-7-5700x, cpu-athlon-x4-950, ram-kingston-fury-64gb-ddr5, ram-kingbank-16gb-ddr5, ram-samsung-32gb-ddr4, storage-kingston-nv2-1tb, psu-gigabyte-650w-bronze, psu-corsair-rm850e-gold, case-deepcool-cc560-airflow, case-kolink-void-rgb, fan-deepcool-cf120-x5)`;

    const conversation = messages.map((m: any) => `${m.sender === 'user' ? 'Cliente' : 'Asesor EliTech'}: ${m.text}`).join('\n');

    const prompt = `${systemPrompt}\n\nHISTORIAL DE CONVERSACIÓN:\n${conversation}\n\nResponde como Asesor EliTech:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const text = response.text || 'Disculpá, tuve una interrupción técnica. ¿Podrías reiterarme qué juegos o presupuesto tenés en mente?';

    let cleanReply = text;
    let suggestedBuild: any = null;

    const jsonMatch = text.match(/<<<JSON([\s\S]*?)JSON>>>/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        suggestedBuild = JSON.parse(jsonMatch[1].trim());
        cleanReply = text.replace(/<<<JSON[\s\S]*?JSON>>>/, '').trim();
      } catch (e) {
        console.error('Error parsing AI suggested build JSON:', e);
      }
    }

    res.json({
      reply: cleanReply,
      suggestedBuild
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'Error procesando solicitud con IA',
      details: err?.message || String(err)
    });
  }
});

// Hardware Identifier Endpoint for "Módulo D — Pedido Personalizado"
app.post('/api/identify-hardware', async (req: Request, res: Response) => {
  try {
    const { query, category } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const ai = getGeminiClient();

    // Built-in fallback database for common hardware requests if offline or no key
    const knownHardware: Record<string, any> = {
      '7800x3d': {
        suggestedModel: 'AMD Ryzen 7 7800X3D',
        brand: 'AMD',
        category: 'cpu',
        specs: [
          '8 núcleos / 16 hilos · Socket AM5 · 3D V-Cache (96MB L3)',
          'Frecuencia base 4.2 GHz, Boost 5.0 GHz · TDP 120W',
          'Soporte nativo memoria DDR5 · El mejor CPU para gaming puro'
        ],
        compat: { socket: 'AM5', ramType: 'DDR5', tdp: 120 },
        estimatedPriceUSD: 440
      },
      '7600': {
        suggestedModel: 'AMD Ryzen 5 7600',
        brand: 'AMD',
        category: 'cpu',
        specs: [
          '6 núcleos / 12 hilos · Socket AM5 · 32MB L3',
          'Frecuencia base 3.8 GHz, Boost 5.1 GHz · TDP 65W',
          'Soporte DDR5 nativo · Incluye cooler Wraith Stealth'
        ],
        compat: { socket: 'AM5', ramType: 'DDR5', tdp: 65 },
        estimatedPriceUSD: 230
      },
      '4060': {
        suggestedModel: 'NVIDIA GeForce RTX 4060 8GB GDDR6',
        brand: 'NVIDIA',
        category: 'gpu',
        specs: [
          'Arquitectura Ada Lovelace · 3072 CUDA Cores',
          '8GB GDDR6 · 128-bit · DLSS 3 Frame Generation',
          'Consumo ultra bajo 115W · PSU recomendada 550W+'
        ],
        compat: { tdp: 115, recommendedPsuWatts: 550, lengthMm: 245 },
        estimatedPriceUSD: 360
      },
      '4070': {
        suggestedModel: 'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
        brand: 'NVIDIA',
        category: 'gpu',
        specs: [
          'Arquitectura Ada Lovelace · 7168 CUDA Cores',
          '12GB GDDR6X · DLSS 3.5 · Excelente para 1440p Ultra',
          'Consumo 220W · PSU recomendada 650W+'
        ],
        compat: { tdp: 220, recommendedPsuWatts: 650, lengthMm: 270 },
        estimatedPriceUSD: 690
      }
    };

    const qLower = query.toLowerCase();
    for (const key of Object.keys(knownHardware)) {
      if (qLower.includes(key)) {
        res.json({
          identified: true,
          ...knownHardware[key]
        });
        return;
      }
    }

    if (!ai) {
      // General heuristic fallback
      res.json({
        identified: true,
        suggestedModel: query.toUpperCase(),
        brand: query.split(' ')[0] || 'Genérica',
        category: category || 'accessories',
        specs: [
          `Componente identificado: ${query}`,
          'Estado: PEDIDO ESPECIAL — A conseguir por el dueño mediante proveedor',
          'Especificaciones técnicas y compatibilidad serán confirmadas al cotizar'
        ],
        compat: {},
        estimatedPriceUSD: 100
      });
      return;
    }

    const prompt = `Actúa como motor de identificación de componentes de hardware para PC gamer.
El usuario escribió la siguiente búsqueda o nombre de componente: "${query}". Categoría sugerida: "${category || 'auto'}".

Tu tarea es:
1. Identificar el modelo exacto comercial (por ejemplo si escribe "ryzen 7800" sugerir "AMD Ryzen 7 7800X3D", o si escribe "5070" identificar "NVIDIA GeForce RTX 5070").
2. Extraer datos técnicos esenciales de compatibilidad:
   - socket (AM4, AM5, LGA1700, LGA1851 si es CPU o Motherboard)
   - ramType (DDR4 o DDR5)
   - tdp (watts estimados)
   - recommendedPsuWatts (para GPUs)
   - lengthMm (para GPUs)
   - precio aproximado de mercado internacional en USD
3. Devolver ÚNICAMENTE un JSON válido sin texto adicional ni backticks extras, en este formato:
{
  "suggestedModel": "Nombre y modelo exacto formal",
  "brand": "Marca (AMD, Intel, NVIDIA, ASUS, Corsair, etc.)",
  "category": "${category || 'cpu'}",
  "specs": [
    "Punto técnico 1 (arquitectura, núcleos, etc.)",
    "Punto técnico 2 (frecuencias, memorias, bus)",
    "Punto técnico 3 (consumo, conectores, etc.)"
  ],
  "compat": {
    "socket": "AM5",
    "ramType": "DDR5",
    "tdp": 120,
    "recommendedPsuWatts": 650,
    "lengthMm": 280
  },
  "estimatedPriceUSD": 350
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const responseText = (response.text || '{}').trim();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    res.json({
      identified: true,
      ...parsed
    });
  } catch (err: any) {
    console.error('Error in /api/identify-hardware:', err);
    res.status(500).json({
      error: 'No se pudo identificar el componente mediante IA',
      details: err?.message || String(err)
    });
  }
});

// Start server with Vite middleware in dev mode or static files in prod mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EliTech PC Builder Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
