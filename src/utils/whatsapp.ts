import { ActiveBuild, CustomerData } from '../types';

export function formatWhatsAppMessage(build: ActiveBuild, customer: CustomerData): string {
  const dateStr = new Date().toLocaleDateString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const rawSlots = [
    { key: 'cpu', label: 'Procesador (CPU)', item: build.cpu },
    { key: 'motherboard', label: 'Placa Madre (Motherboard)', item: build.motherboard },
    { key: 'ram', label: 'Memoria RAM', item: build.ram },
    { key: 'gpu', label: 'Placa de Video (GPU)', item: build.gpu },
    { key: 'storage', label: 'Almacenamiento (SSD)', item: build.storage },
    { key: 'psu', label: 'Fuente de Poder (PSU)', item: build.psu },
    { key: 'case', label: 'Gabinete', item: build.case },
    { key: 'cooling', label: 'Refrigeración', item: build.cooling },
    { key: 'monitor', label: 'Monitor', item: build.monitor },
    ...build.accessories.map((acc, idx) => ({ key: `acc-${idx}`, label: `Accesorio ${idx + 1}`, item: acc }))
  ];

  const slots = rawSlots.filter(s => s.item !== null);

  let totalCatalogo = 0;
  let totalEspecial = 0;

  const componentsText = slots.map(({ key, label, item }) => {
    if (!item) return '';
    const qty = (build.quantities && build.quantities[key]) || 1;
    const itemTotal = item.precio * qty;
    const isEspecial = item.origen === 'PEDIDO_ESPECIAL';
    if (isEspecial) totalEspecial += itemTotal;
    else totalCatalogo += itemTotal;

    const originTag = isEspecial ? '🔵 [PEDIDO ESPECIAL — A CONSEGUIR]' : '🟢 [LOTE REAL DISPONIBLE]';
    const qtyTag = qty > 1 ? ` (x${qty} unidades · US$ ${item.precio} c/u)` : '';
    return `▪ *${label}*${qty > 1 ? ` (x${qty})` : ''}: ${item.nombre} - US$ ${itemTotal}${qtyTag}\n  ${originTag}`;
  }).join('\n\n');

  const totalGeneral = totalCatalogo + totalEspecial;

  const message = `👋 *HOLA ELITECH, SOLICITO CONFIRMACIÓN DE COMPRA REAL DE PC GAMER*

📋 *DATOS VERIFICADOS DEL COMPRADOR:*
• *Nombre y Apellido:* ${customer.nombre || 'A coordinar'}
• *C.I. / Documento:* ${customer.documento || 'A presentar al retirar'}
• *Teléfono / Celular:* ${customer.telefono || 'Sin especificar'}
${customer.email ? `• *Email:* ${customer.email}\n` : ''}• *Ubicación / Entrega:* ${customer.departamento ? `${customer.departamento}` : 'A coordinar'}${customer.ciudad ? ` - ${customer.ciudad}` : ''}
${customer.direccion ? `• *Dirección:* ${customer.direccion}\n` : ''}• *Forma de Pago Prevista:* ${customer.metodoPago || 'Efectivo / Transferencia'}
• *Plazo de Compra:* ${customer.plazoCompra || 'Inmediata'}
${customer.observaciones ? `• *Observaciones:* ${customer.observaciones}\n` : ''}• *Estado:* Solicitud formal de compra verificada
📅 *Fecha:* ${dateStr}

🛠️ *CONFIGURACIÓN SELECCIONADA:*
${componentsText || 'No se han seleccionado piezas aún.'}

💰 *PRESUPUESTO ESTIMADO:*
• Componentes del Lote en Stock: US$ ${totalCatalogo}
${totalEspecial > 0 ? `• Componentes a Conseguir (Especiales): US$ ${totalEspecial}\n` : ''}• *TOTAL ESTIMADO: US$ ${totalGeneral}*

Confirmame disponibilidad física de las piezas del lote y plazo para el armado y entrega. ¡Muchas gracias!`;

  return encodeURIComponent(message);
}
