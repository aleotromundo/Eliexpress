import { ActiveBuild, CompatibilityIssue, CompatibilityReport, Product } from '../types';

export function evaluateCompatibility(build: ActiveBuild): CompatibilityReport {
  const issues: CompatibilityIssue[] = [];
  const { cpu, motherboard, ram, gpu, psu, case: pcCase } = build;

  // 1. CPU <-> Motherboard Socket
  if (cpu && motherboard) {
    const cpuSocket = cpu.compatibilidad.socket;
    const mbSocket = motherboard.compatibilidad.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        id: 'socket-mismatch',
        type: 'error',
        title: 'Incompatibilidad de Socket',
        message: `El procesador (${cpu.nombre}) requiere socket ${cpuSocket}, pero la placa madre (${motherboard.nombre}) cuenta con socket ${mbSocket}. No encajarán físicamente.`,
        components: ['cpu', 'motherboard']
      });
    }
  }

  // 2. Motherboard <-> RAM Type (DDR4 vs DDR5)
  if (motherboard && ram) {
    const mbRam = motherboard.compatibilidad.ramType;
    const ramType = ram.compatibilidad.ramType;
    if (mbRam && ramType && mbRam !== ramType) {
      issues.push({
        id: 'ram-type-mismatch',
        type: 'error',
        title: 'Incompatibilidad de Tipo de Memoria RAM',
        message: `La placa madre (${motherboard.nombre}) utiliza slots para ${mbRam}, mientras que la memoria seleccionada (${ram.nombre}) es ${ramType}.`,
        components: ['motherboard', 'ram']
      });
    }
  }

  // 3. Power calculation
  const baseSystemWattage = 75; // Motherboard, SSDs, Fans, Chipset
  const cpuWatts = cpu?.compatibilidad.tdp || 65;
  const gpuWatts = gpu?.compatibilidad.tdp || (gpu ? 220 : 0);
  const estimatedWattage = Math.round(baseSystemWattage + cpuWatts + gpuWatts);

  // Recommended PSU takes GPU manufacturer guidelines or estimated draw * 1.35
  let recommendedPsuWattage = Math.round(estimatedWattage * 1.35);
  if (gpu?.compatibilidad.recommendedPsuWatts) {
    recommendedPsuWattage = Math.max(recommendedPsuWattage, gpu.compatibilidad.recommendedPsuWatts);
  } else if (!gpu) {
    recommendedPsuWattage = 450;
  }

  if (psu) {
    const psuWatts = psu.compatibilidad.tdp || 650;
    if (psuWatts < recommendedPsuWattage - 50) {
      issues.push({
        id: 'psu-power-low',
        type: 'warning',
        title: 'Fuente de Poder Ajustada',
        message: `La fuente seleccionada entrega ${psuWatts}W, mientras que la configuración (especialmente por la placa de video ${gpu?.nombre || ''}) recomienda al menos ${recommendedPsuWattage}W para evitar apagados por picos de consumo.`,
        components: ['psu', 'gpu']
      });
    }
  }

  // 4. GPU Length <-> Case Clearance
  if (gpu && pcCase) {
    const gpuLength = gpu.compatibilidad.lengthMm;
    const caseMaxGpu = pcCase.compatibilidad.gpuMaxLengthMm;
    if (gpuLength && caseMaxGpu && gpuLength > caseMaxGpu) {
      issues.push({
        id: 'gpu-case-clearance',
        type: 'error',
        title: 'Longitud de Placa de Video Excede el Gabinete',
        message: `La placa de video mide ${gpuLength}mm de largo y el gabinete seleccionado solo admite hasta ${caseMaxGpu}mm. Te recomendamos elegir un gabinete más espacioso como el DeepCool CC560 (370mm).`,
        components: ['gpu', 'case']
      });
    }
  }

  // 5. Missing Essential Components Notice
  const missingEssentials: string[] = [];
  if (!cpu && !build.motherboard?.id.includes('kit')) missingEssentials.push('Procesador (CPU)');
  if (!motherboard) missingEssentials.push('Placa Madre (Motherboard)');
  if (!ram && !build.motherboard?.id.includes('kit')) missingEssentials.push('Memoria RAM');
  if (!gpu) missingEssentials.push('Placa de Video (GPU)');
  if (!build.storage) missingEssentials.push('Almacenamiento (SSD)');
  if (!psu) missingEssentials.push('Fuente de Poder (PSU)');
  if (!pcCase) missingEssentials.push('Gabinete');

  if (missingEssentials.length > 0) {
    issues.push({
      id: 'missing-components',
      type: 'info',
      title: 'Piezas pendientes para completar la PC',
      message: `Aún faltan seleccionar: ${missingEssentials.join(', ')}.`,
      components: []
    });
  }

  // 6. Calculate Gaming Score (0 to 100)
  let gpuScore = 0;
  if (gpu) {
    if (gpu.id.includes('9070xt')) gpuScore = 96;
    else if (gpu.id.includes('5070')) gpuScore = 88;
    else if (gpu.id.includes('7800xt')) gpuScore = 85;
    else if (gpu.precio > 500) gpuScore = 80;
    else if (gpu.precio > 300) gpuScore = 65;
    else gpuScore = 45;
  }

  let cpuScore = 0;
  if (cpu) {
    if (cpu.nombre.includes('7800X3D') || cpu.nombre.includes('9800X3D')) cpuScore = 98;
    else if (cpu.nombre.includes('5700X') || cpu.nombre.includes('7600')) cpuScore = 82;
    else if (cpu.nombre.includes('Athlon')) cpuScore = 35;
    else cpuScore = 70;
  } else if (motherboard?.id.includes('kit')) {
    cpuScore = 82; // Kit includes 5700X
  }

  let ramScore = 0;
  if (ram) {
    if (ram.nombre.includes('64GB')) ramScore = 95;
    else if (ram.nombre.includes('32GB')) ramScore = 85;
    else ramScore = 68;
  } else if (motherboard?.id.includes('kit')) {
    ramScore = 85; // Kit includes 32GB
  }

  let gamingScore = 0;
  if (gpuScore > 0 || cpuScore > 0) {
    // Weighted: 60% GPU, 25% CPU, 15% RAM
    gamingScore = Math.round((gpuScore * 0.6) + (cpuScore * 0.25) + (ramScore * 0.15));
  }

  let tierLabel = 'Sin configurar';
  if (gamingScore >= 90) tierLabel = '4K Master / Entusiasta';
  else if (gamingScore >= 80) tierLabel = '1440p Ultra Competitiva';
  else if (gamingScore >= 65) tierLabel = '1080p Ultra / 1440p High';
  else if (gamingScore >= 40) tierLabel = '1080p Entrada / eSports';
  else if (gamingScore > 0) tierLabel = 'Básica Oficina / Casual';

  const hasErrors = issues.some(i => i.type === 'error');
  const hasWarnings = issues.some(i => i.type === 'warning');

  return {
    isCompatible: !hasErrors,
    status: hasErrors ? 'error' : hasWarnings ? 'warning' : 'compatible',
    issues,
    estimatedWattage,
    recommendedPsuWattage,
    gamingScore,
    tierLabel,
    gamingCapabilities: {
      fhd1080p: gamingScore >= 40,
      qhd1440p: gamingScore >= 70,
      uhd4k: gamingScore >= 85,
      streaming: gamingScore >= 65,
      editing: gamingScore >= 70
    }
  };
}
