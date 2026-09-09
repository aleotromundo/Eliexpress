import { ActiveBuild, CustomerData } from '../types';

export function formatWhatsAppMessage(build: ActiveBuild, customer: CustomerData): string {
  const dateStr = new Date().toLocaleDateString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const slots = [
    { label: 'Procesador (CPU)', item: build.cpu },
    { label: 'Placa Madre (Motherboard)', item: build.motherboard },
    { label: 'Memoria RAM', item: build.ram },
    { label: 'Placa de Video (GPU)', item: build.gpu },
    { label: 'Almacenamiento (SSD)', item: build.storage },
    { label: 'Fuente de Poder (PSU)', item: build.psu },
    { label: 'Gabinete', item: build.case },
    { label: 'Refrigeración', item: build.cooling },
    { label: 'Monitor', item: build.monitor },
    ...build.accessories.map((acc, idx) => ({ label: `Accesorio ${idx + 1}`, item: acc }))
  ].filter(s => s.item !== null);

  let totalCatalogo = 0;
  let totalEspecial = 0;

  const componentsText = slots.map(({ label, item }) => {
    if (!item) return '';
    const isEspecial = item.origen === 'PEDIDO_ESPECIAL';
    if (isEspecial) totalEspecial += item.precio;
    else totalCatalogo += item.precio;

    const originTag = isEspecial ? '🔵 [PEDIDO ESPECIAL — A CONSEGUIR]' : '🟢 [LOTE REAL DISPONIBLE]';
    return `▪ *${label}*: ${item.nombre} - US$ ${item.precio}\n  ${originTag}`;
  }).join('\n\n');

  const totalGeneral = totalCatalogo + totalEspecial;

  const message = `👋 *HOLA ELITECH, SOLICITO CONFIRMACIÓN DE COMPRA REAL DE PC GAMER*

📋 *DATOS VERIFICADOS DEL COMPRADOR:*
• *Nombre y Apellido:* ${customer.nombre || 'A coordinar'}
• *C.I. / Documento:* ${customer.documento || 'A presentar al retirar'}
• *Teléfono / Celular:* ${customer.telefono || 'Sin especificar'}
${customer.email ? `• *Email:* ${customer.email}\n` : ''}• *Ubicación / Entrega:* ${customer.departamento ? `${customer.departamento} - ` : ''}${customer.ciudad || 'Montevideo'}
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
