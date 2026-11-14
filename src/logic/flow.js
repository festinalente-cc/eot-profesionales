// Evaluación integrada: actividad (CAS), gravedad, calidad de vida y ruta en un solo recorrido.
import { casState, severityState, goqol } from './tools.js';
import { route } from './route.js';

/**
 * @param {object} s estado del formulario
 * casMarks[7], casOk, sev {lidRetraction2mm, softTissueModerate, exophthalmos3mm, diplopia, opticNeuropathy, cornealBreakdown},
 * sevOk, qolV[8], qolA[8], qolOk, refractory?, gcContra?
 */
export function evaluate(s) {
  const cas = casState(!!s.casOk, s.casMarks);
  const don = !!s.sev.opticNeuropathy, perf = !!s.sev.cornealBreakdown;
  const urgent = don || perf;
  const sv = severityState(!!s.sevOk, s.sev);
  const q = goqol(s.qolV, s.qolA);

  let severity;
  if (perf) severity = 'perforacion';
  else if (don) severity = 'neuropatia';
  else if (sv.status === 'completa') severity = sv.level === 'leve' ? 'leve' : 'moderada';

  // Lo que amenaza la visión no espera a que se confirme el CAS.
  const active = cas.status === 'completa' ? cas.active : urgent ? true : undefined;
  const needsGc = severity === 'neuropatia' || (severity === 'moderada' && active === true);
  const input = { active, severity };
  if (needsGc) { input.refractory = s.refractory; input.gcContra = s.gcContra; }

  const steps = {
    cas: cas.status === 'completa',
    sev: urgent || sv.status === 'completa',
    qol: !!s.qolOk && q.n > 0,
    gc: !needsGc ? null : severity === 'neuropatia' ? typeof s.gcContra === 'boolean' : typeof s.refractory === 'boolean' && typeof s.gcContra === 'boolean',
  };
  const result = severity && typeof active === 'boolean' ? route(input) : { branch: 'incompleta' };
  const ready = result.branch !== 'incompleta';
  // La nota para la historia exige las tres medidas; en urgencia se permite sin CAS confirmado ni GO-QoL.
  const missing = [];
  if (!urgent && !steps.cas) missing.push('confirmar el CAS');
  if (!urgent && !steps.qol) missing.push('registrar y confirmar el GO-QoL');
  if (steps.gc === false) missing.push('responder sobre glucocorticoides');
  return { cas, sv, q, urgent, both: don && perf, needsGc, input, steps, result, ready, canCopy: ready && missing.length === 0, missing };
}
