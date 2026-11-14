// Texto para copiar a la historia clínica. No incluye datos del paciente:
// registra lo evaluado, la clasificación y lo que dice la fuente.
import { INTERVENTIONS, COLOMBIA } from './scenarios.js';

export const SITE = 'GCEOT, herramientas para profesionales';
const CONSENSO = 'Consenso RAND/UCLA (Cabarcas-Solano et al., Rev Colomb Endocrinol Diabet Metab 2026;13(1):e994)';
const AVISO = 'Apoyo a la decisión clínica; no sustituye el juicio del médico tratante.';

const TITLES = {
  'moderada-primera-linea': 'EOT moderada activa, sin refractariedad ni contraindicación a glucocorticoides',
  'moderada-refractaria': 'EOT moderada activa, refractaria o con contraindicación a glucocorticoides',
  'grave-neuropatia': 'EOT grave con neuropatía óptica',
  'grave-cornea': 'EOT grave con perforación corneal',
  leve: 'EOT leve activa',
  inactiva: 'EOT inactiva',
};
const TIER = { necesaria: 'necesarias', apropiada: 'apropiadas' };

function drug(id) {
  const d = INTERVENTIONS[id];
  return d.name.toLowerCase() + (d.colombia ? ` (${COLOMBIA[d.colombia].charAt(0).toLowerCase() + COLOMBIA[d.colombia].slice(1)})` : '');
}
function inputs(i) {
  const out = [];
  if (typeof i.active === 'boolean') out.push(i.active ? 'enfermedad activa (CAS ≥ 3)' : 'enfermedad inactiva (CAS < 3)');
  out.push({ leve: 'leve', moderada: 'moderada a grave, sin neuropatía óptica ni perforación corneal', neuropatia: 'con neuropatía óptica', perforacion: 'con perforación corneal' }[i.severity]);
  if (i.severity === 'moderada' || i.severity === 'neuropatia') {
    if (typeof i.refractory === 'boolean') out.push(i.refractory ? 'refractaria a glucocorticoides IV' : 'sin refractariedad a glucocorticoides IV');
    if (typeof i.gcContra === 'boolean') out.push(i.gcContra ? 'con contraindicación a glucocorticoides' : 'sin contraindicación a glucocorticoides');
  }
  return out.join('; ');
}

/** @param {object} i entradas de la ruta  @param {object} r resultado de route(i) */
export function routeSummary(i, r) {
  if (!r || r.branch === 'incompleta') return null;
  const lines = ['Enfermedad ocular tiroidea: ruta de tratamiento', `Evaluación: ${inputs(i)}.`, `Clasificación: ${TITLES[r.branch]}.`];
  if (r.scope === 'guias') {
    lines.push('Fuera del alcance del consenso del grupo, que cubre la enfermedad activa moderada a grave. Referencia: guía EUGOGO 2021.');
  } else {
    lines.push(`${CONSENSO}:`);
    for (const s of r.steps) {
      const body = s.drugs ? s.drugs.map(drug).join('; ') : s.items.map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join('; ');
      lines.push(`- ${s.label}${TIER[s.tier] ? ` (${TIER[s.tier]})` : ''}: ${body}.`);
    }
  }
  lines.push(AVISO, `Fuente: ${SITE}.`);
  return lines.join('\n');
}

export function casSummary(state, present) {
  if (!state || state.status !== 'completa') return null;
  return `CAS: ${state.score} de ${state.max}, enfermedad ${state.active ? 'activa' : 'inactiva'} (umbral ≥ ${state.threshold}). ` +
    (present.length ? `Presentes: ${present.map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join('; ')}.` : 'Ningún ítem presente.');
}

export function severitySummary(state, present) {
  if (!state || state.status !== 'completa') return null;
  const name = { leve: 'leve', 'moderada-grave': 'moderada a grave', 'amenaza-vision': 'con amenaza para la visión' }[state.level];
  return `Gravedad (EUGOGO): ${name}` + (state.count !== null && state.count !== undefined ? ` (${state.count} de 4 criterios)` : '') + '. ' +
    (present.length ? `Hallazgos: ${present.join('; ')}.` : 'Sin hallazgos.');
}

export function goqolSummary(r) {
  if (!r || r.n === 0) return null;
  const f = (x) => String(x).replace('.', ',');
  const part = (name, s) => (s.score === null ? `${name} sin respuestas` : `${name} ${f(s.score)} (${s.n} de 8 respondidas)`);
  return `GO-QoL (0 a 100; mayor es mejor): ${part('función visual', r.visual)}; ${part('apariencia', r.appearance)}; total ${f(r.total)}.`;
}

// Nota breve única para la historia clínica: actividad, gravedad, calidad de vida y ruta.
const SHORT_REG = { registro: 'con registro en Colombia', 'sin-indicacion': 'sin indicación aprobada en Colombia' };
const shortDrug = (id) => INTERVENTIONS[id].short.charAt(0).toLowerCase() + INTERVENTIONS[id].short.slice(1) + (INTERVENTIONS[id].colombia ? ` (${SHORT_REG[INTERVENTIONS[id].colombia]})` : '');
const num = (x) => String(x).replace('.', ',');

/** @param {object} ev resultado de evaluate()  @param {string[]} findings hallazgos de gravedad marcados */
export function fullSummary(ev, findings = []) {
  if (!ev || !ev.canCopy) return null;
  const r = ev.result;
  const casTxt = ev.cas.status === 'completa' ? `CAS ${ev.cas.score}/${ev.cas.max} (${ev.cas.active ? 'activa' : 'inactiva'})` : 'CAS sin completar por urgencia';
  const level = ev.urgent ? 'con amenaza para la visión' : ev.sv.level === 'leve' ? 'leve' : 'moderada a grave';
  const sevTxt = `gravedad EUGOGO ${level}` + (findings.length ? ` (${findings.join(', ')})` : '');
  const qolTxt = ev.steps.qol ? `GO-QoL función visual ${ev.q.visual.score === null ? 'sin datos' : num(ev.q.visual.score)}, apariencia ${ev.q.appearance.score === null ? 'sin datos' : num(ev.q.appearance.score)}` : 'GO-QoL no aplicado por urgencia';
  const lines = [`EOT. ${casTxt}; ${sevTxt}; ${qolTxt}.`];
  if (ev.needsGc) {
    const gc = [];
    if (typeof ev.input.refractory === 'boolean') gc.push(ev.input.refractory ? 'refractaria a GC IV' : 'sin refractariedad a GC IV');
    if (typeof ev.input.gcContra === 'boolean') gc.push(ev.input.gcContra ? 'con contraindicación a GC' : 'sin contraindicación a GC');
    if (gc.length) lines.push(`Glucocorticoides: ${gc.join('; ')}.`);
  }
  lines.push(`Clasificación: ${TITLES[r.branch]}.`);
  if (r.scope === 'guias') lines.push('Fuera del alcance del consenso del grupo; referencia: guía EUGOGO 2021.');
  else lines.push('Consenso RAND/UCLA (Cabarcas-Solano 2026). ' + r.steps.map((s) => `${s.label}: ${s.drugs ? s.drugs.map(shortDrug).join(', ') : s.items.map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join(', ')}`).join('. ') + '.');
  if (ev.both) lines.push('Coexisten neuropatía óptica y perforación corneal: combinación no evaluada por el consenso.');
  lines.push('Apoyo a la decisión; no sustituye el juicio clínico. Fuente: GCEOT.');
  return lines.join('\n');
}
