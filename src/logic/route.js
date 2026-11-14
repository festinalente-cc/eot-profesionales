// Ruta de tratamiento. Reproduce la ruta simplificada del consenso (figura 3)
// y remite a las guías para lo que el consenso no cubre (EOT leve o inactiva).
import { scenariosIn } from './scenarios.js';

/**
 * @param {object} i
 * @param {boolean} i.active       CAS >= 3
 * @param {'leve'|'moderada'|'neuropatia'|'perforacion'} i.severity
 * @param {boolean} [i.refractory] sin respuesta o respuesta parcial tras 12 semanas de GC IV
 * @param {boolean} [i.gcContra]   contraindicación absoluta o intolerancia a GC sistémicos
 */
export function route(i) {
  if (!i || typeof i.active !== 'boolean' || !i.severity) return { branch: 'incompleta' };

  // Lo que amenaza la visión se atiende primero, con independencia del CAS.
  if (i.severity === 'perforacion') {
    return {
      branch: 'grave-cornea', scope: 'consenso', category: 4, scenarios: scenariosIn(4),
      steps: [
        { tier: 'urgente', label: 'Manejo urgente quirúrgico o local', items: ['Adhesivo tisular', 'Queratoplastia', 'Tarsorrafia'] },
        { tier: 'despues', label: 'Tras la estabilización', items: ['Iniciar inmunoterapia sistémica: no es el tratamiento primario en la fase aguda'] },
      ],
    };
  }
  if (i.severity === 'neuropatia') {
    const alt = i.gcContra === true || i.refractory === true;
    const steps = [];
    if (i.gcContra !== true) steps.push({ tier: 'urgente', label: 'Inmediato, salvo contraindicación', drugs: ['ivgc'] });
    if (alt) steps.push({ tier: 'necesaria', label: 'Si es refractaria o los GC están contraindicados', drugs: ['tepro', 'toci'] });
    steps.push({ tier: 'decision', label: 'Si la respuesta es inadecuada', items: ['Considerar descompresión orbitaria urgente'] });
    return { branch: 'grave-neuropatia', scope: 'consenso', category: 3, scenarios: scenariosIn(3), steps };
  }

  if (!i.active) return { branch: 'inactiva', scope: 'guias', scenarios: [], steps: [] };
  if (i.severity === 'leve') return { branch: 'leve', scope: 'guias', scenarios: [], steps: [] };

  if (i.severity === 'moderada') {
    if (typeof i.refractory !== 'boolean' || typeof i.gcContra !== 'boolean') return { branch: 'incompleta' };
    if (i.refractory || i.gcContra) {
      return {
        branch: 'moderada-refractaria', scope: 'consenso', category: 2, scenarios: scenariosIn(2),
        steps: [
          { tier: 'necesaria', label: 'Preferidas', drugs: ['tepro', 'toci'] },
          { tier: 'apropiada', label: 'Alternativas en casos seleccionados', drugs: ['mmf', 'triam'] },
        ],
      };
    }
    return {
      branch: 'moderada-primera-linea', scope: 'consenso', category: 1, scenarios: scenariosIn(1),
      steps: [
        { tier: 'necesaria', label: 'Primera línea', drugs: ['ivgc', 'tepro'] },
        { tier: 'apropiada', label: 'Casos seleccionados', drugs: ['toci', 'mmf', 'triam'] },
      ],
    };
  }
  return { branch: 'incompleta' };
}
