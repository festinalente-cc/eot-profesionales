// Escenarios, categorías, intervenciones y calificaciones de necesidad.
// Fuente: Cabarcas-Solano et al. 2026 (doi:10.53853/encr.13.1.994):
// tabla suplementaria 1 (escenarios), tabla 3 (necesidad), figura 3 (ruta simplificada).
import { RATINGS } from './ratings.js';

export const INTERVENTIONS = {
  ivgc: { name: 'Glucocorticoides intravenosos', short: 'GC IV' },
  tepro: { name: 'Teprotumumab', short: 'Teprotumumab', colombia: 'registro' },
  toci: { name: 'Tocilizumab', short: 'Tocilizumab', colombia: 'sin-indicacion' },
  mmf: { name: 'Micofenolato mofetilo', short: 'Micofenolato' },
  triam: { name: 'Triamcinolona periocular', short: 'Triamcinolona periocular' },
  btx: { name: 'Toxina botulínica', short: 'Toxina botulínica' },
  rtx: { name: 'Rituximab', short: 'Rituximab', colombia: 'sin-indicacion' },
  ogc: { name: 'Glucocorticoides orales', short: 'GC orales' },
  ada: { name: 'Adalimumab', short: 'Adalimumab' },
  ssa: { name: 'Análogos de somatostatina', short: 'Análogos de somatostatina' },
  cyc: { name: 'Ciclofosfamida', short: 'Ciclofosfamida' },
  csa: { name: 'Ciclosporina', short: 'Ciclosporina' },
  ivig: { name: 'Inmunoglobulina intravenosa', short: 'Inmunoglobulina IV' },
  plex: { name: 'Plasmaféresis', short: 'Plasmaféresis' },
  sir: { name: 'Sirolimus', short: 'Sirolimus' },
  col: { name: 'Colchicina', short: 'Colchicina' },
  mtx: { name: 'Metotrexato', short: 'Metotrexato' },
};

// Estado regulatorio en Colombia para EOT. Dato aportado por el grupo (nov. 2026);
// debe revisarse periódicamente contra el registro sanitario vigente.
export const COLOMBIA = {
  registro: 'Con registro en Colombia para EOT activa moderada a grave',
  'sin-indicacion': 'Sin indicación aprobada para EOT en Colombia',
};

export const CATEGORIES = {
  1: 'EOT moderada sin urgencia funcional ni refractariedad',
  2: 'EOT moderada con refractariedad, comorbilidades o factores de riesgo',
  3: 'EOT grave con compromiso visual agudo o neuropatía óptica',
  4: 'EOT grave con complicaciones corneales mayores',
};

export const SCENARIOS = {
  1: { cat: 1, text: 'EOT moderada activa, menos de 6 meses de evolución, diplopía intermitente, sin neuropatía óptica, sin factores de riesgo, función tiroidea estabilizada.' },
  2: { cat: 1, text: 'EOT moderada activa, más de 6 meses de evolución, exoftalmos progresivo (> 24 mm), sin diplopía ni neuropatía, fumador activo.' },
  8: { cat: 1, text: 'EOT moderada activa, sin exoftalmos relevante pero con diplopía persistente y CAS = 3, sin otras comorbilidades.' },
  11: { cat: 1, text: 'EOT moderada activa, sin síntomas funcionales o visuales significativos, con exoftalmos o edema palpebral que afecta la calidad de vida por razones estéticas. CAS = 3, no fumador, eutiroideo.' },
  4: { cat: 2, text: 'EOT moderada activa, diplopía significativa y CAS alto, sin respuesta tras 12 semanas de glucocorticoides IV.' },
  5: { cat: 2, text: 'EOT moderada activa, respuesta parcial a glucocorticoides IV y diabetes mellitus no controlada.' },
  7: { cat: 2, text: 'EOT moderada activa, exoftalmos y dolor orbitario, fumador activo, sin respuesta al tratamiento inicial con glucocorticoides.' },
  9: { cat: 2, text: 'EOT activa moderada a grave con contraindicación absoluta o intolerancia documentada a glucocorticoides sistémicos.' },
  12: { cat: 2, text: 'EOT moderada activa con adelgazamiento corneal unilateral o bilateral por exposición.' },
  3: { cat: 3, text: 'EOT grave activa con neuropatía óptica incipiente, menos de 6 meses de evolución, sin contraindicaciones para glucocorticoides.' },
  6: { cat: 3, text: 'EOT grave activa con neuropatía óptica establecida y contraindicación absoluta para glucocorticoides IV.' },
  10: { cat: 3, text: 'EOT grave activa, neuropatía óptica bilateral con pérdida visual rápida (días) e imágenes sugestivas de compresión orbitaria. Sin contraindicación para glucocorticoides IV.' },
  14: { cat: 3, text: 'EOT grave con luxación del globo ocular y neuropatía óptica aguda por estiramiento.' },
  13: { cat: 4, text: 'EOT grave activa con perforación corneal unilateral o bilateral.' },
};

// Intervenciones calificadas como necesarias (ronda 3), por escenario. Tabla 3.
export const NECESSARY = {
  1: ['ivgc', 'tepro'], 2: ['ivgc', 'tepro', 'triam'], 8: ['ivgc', 'tepro', 'toci', 'triam'],
  11: ['ivgc', 'tepro', 'triam'], 4: ['tepro', 'toci'], 5: ['tepro', 'toci'],
  7: ['tepro', 'toci', 'triam'], 9: ['tepro', 'toci'], 12: ['ivgc', 'tepro', 'toci', 'btx'],
  3: ['ivgc', 'tepro', 'toci'], 6: ['tepro', 'toci'], 10: ['ivgc', 'tepro'], 14: ['ivgc'], 13: [],
};

/** Calificaciones de un escenario, con la clase final:
 *  N necesaria, A apropiada, U incierta, D incierta por desacuerdo, I inapropiada. */
export function ratingsFor(scenario) {
  const nec = NECESSARY[scenario] || [];
  return RATINGS.filter((r) => r[0] === scenario).map(([, id, median, ipras, disagreement, c]) => ({
    id, median, ipras, disagreement,
    cls: c === 'A' ? (nec.includes(id) ? 'N' : 'A') : c === 'U' && disagreement ? 'D' : c,
  }));
}

export function scenariosIn(cat) {
  return Object.keys(SCENARIOS).map(Number).filter((s) => SCENARIOS[s].cat === cat);
}
