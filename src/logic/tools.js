// Herramientas clínicas: CAS, gravedad EUGOGO y dosis acumulada de metilprednisolona IV.
export const CAS_ITEMS = [
  'Dolor retrobulbar espontáneo',
  'Dolor con los movimientos oculares',
  'Enrojecimiento palpebral',
  'Enrojecimiento conjuntival',
  'Edema palpebral',
  'Quemosis',
  'Inflamación de la carúncula o de la plica',
];
export const CAS_FOLLOWUP = [
  'Aumento del exoftalmos ≥ 2 mm',
  'Disminución de la motilidad ocular ≥ 8°',
  'Disminución de la agudeza visual ≥ 1 línea',
];

/** @param {boolean[]} base 7 ítems; @param {boolean[]|null} followup 3 ítems o null en la primera visita */
export function cas(base, followup = null) {
  if (!Array.isArray(base) || base.length !== 7) throw new Error('Se requieren los 7 ítems del CAS');
  if (followup && followup.length !== 3) throw new Error('El seguimiento requiere 3 ítems');
  const score = [...base, ...(followup || [])].filter(Boolean).length;
  const max = followup ? 10 : 7;
  const threshold = followup ? 4 : 3;
  return { score, max, threshold, active: score >= threshold };
}

/** Clasificación de gravedad EUGOGO.
 *  diplopia: 'no' | 'intermitente' | 'inconstante' | 'constante' */
export function severity({ lidRetraction2mm, softTissueModerate, exophthalmos3mm, diplopia, opticNeuropathy, cornealBreakdown }) {
  if (opticNeuropathy || cornealBreakdown) return { level: 'amenaza-vision', count: null };
  const count = [lidRetraction2mm, softTissueModerate, exophthalmos3mm, diplopia === 'inconstante' || diplopia === 'constante'].filter(Boolean).length;
  return { level: count >= 2 ? 'moderada-grave' : 'leve', count };
}

export const MP_MAX_G = 8;
export const MP_PRESETS = {
  estandar: [{ n: 6, g: 0.5 }, { n: 6, g: 0.25 }],
  alta: [{ n: 6, g: 0.75 }, { n: 6, g: 0.5 }],
};

/** Dosis acumulada en gramos. blocks: [{n: infusiones, g: gramos por infusión}], prior: gramos ya recibidos */
export function cumulativeDose(blocks, prior = 0) {
  for (const b of blocks) if (!(b.n >= 0) || !(b.g >= 0)) throw new Error('Valores no válidos');
  if (!(prior >= 0)) throw new Error('Valores no válidos');
  const course = blocks.reduce((t, b) => t + b.n * b.g, 0);
  const total = Math.round((course + prior) * 1000) / 1000;
  return { course: Math.round(course * 1000) / 1000, total, exceeds: total > MP_MAX_G };
}
