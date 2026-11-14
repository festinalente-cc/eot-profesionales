import test from 'node:test';
import assert from 'node:assert/strict';
import { route } from '../src/logic/route.js';
import { routeSummary, casSummary, severitySummary, goqolSummary } from '../src/logic/summary.js';
import { casState, severityState, goqol } from '../src/logic/tools.js';

const sum = (i) => routeSummary(i, route(i));

test('ruta: moderada sin refractariedad', () => {
  const t = sum({ active: true, severity: 'moderada', refractory: false, gcContra: false });
  assert.match(t, /Evaluación: enfermedad activa \(CAS ≥ 3\); moderada a grave.*sin refractariedad.*sin contraindicación/);
  assert.match(t, /- Primera línea \(necesarias\): glucocorticoides intravenosos; teprotumumab \(con registro en Colombia para EOT activa/);
  assert.match(t, /- Casos seleccionados \(apropiadas\): tocilizumab \(sin indicación aprobada/);
  assert.match(t, /no sustituye el juicio del médico tratante/);
  assert.match(t, /Cabarcas-Solano/);
});
test('ruta: refractaria no menciona glucocorticoides IV como opción', () => {
  const t = sum({ active: true, severity: 'moderada', refractory: true, gcContra: false });
  assert.match(t, /Preferidas \(necesarias\): teprotumumab.*; tocilizumab/);
  assert.ok(!/: glucocorticoides intravenosos/.test(t));
});
test('ruta: neuropatía con contraindicación y perforación corneal', () => {
  const a = sum({ active: true, severity: 'neuropatia', gcContra: true });
  assert.match(a, /con neuropatía óptica; con contraindicación/);
  assert.match(a, /considerar descompresión orbitaria urgente/);
  assert.ok(!/Inmediato/.test(a));
  const b = sum({ active: true, severity: 'perforacion' });
  assert.match(b, /Manejo urgente quirúrgico o local: adhesivo tisular; queratoplastia; tarsorrafia/);
});
test('ruta: fuera del consenso remite a guías; incompleta no produce texto', () => {
  assert.match(sum({ active: true, severity: 'leve' }), /Fuera del alcance del consenso/);
  assert.match(sum({ active: false, severity: 'moderada' }), /enfermedad inactiva.*EOT inactiva/s);
  assert.equal(sum({ active: true, severity: 'moderada' }), null);
});
test('ningún resumen incluye campos de identificación del paciente', () => {
  const t = sum({ active: true, severity: 'moderada', refractory: false, gcContra: false });
  assert.ok(!/nombre|documento|cédula|fecha de nacimiento/i.test(t));
});
test('CAS, gravedad y GO-QoL: solo con evaluación completa', () => {
  const f = (n) => Array.from({ length: 7 }, (_, i) => i < n);
  assert.equal(casSummary(casState(false, f(3)), ['a']), null);
  assert.equal(casSummary(casState(true, f(2)), ['Dolor retrobulbar espontáneo', 'Quemosis']), 'CAS: 2 de 7, enfermedad inactiva (umbral ≥ 3). Presentes: dolor retrobulbar espontáneo; quemosis.');
  assert.equal(casSummary(casState(true, f(0)), []), 'CAS: 0 de 7, enfermedad inactiva (umbral ≥ 3). Ningún ítem presente.');
  const base = { lidRetraction2mm: true, softTissueModerate: false, exophthalmos3mm: true, diplopia: 'no', opticNeuropathy: false, cornealBreakdown: false };
  assert.equal(severitySummary(severityState(false, base), []), null);
  assert.equal(severitySummary(severityState(true, base), ['retracción palpebral ≥ 2 mm', 'exoftalmos ≥ 3 mm']), 'Gravedad (EUGOGO): moderada a grave (2 de 4 criterios). Hallazgos: retracción palpebral ≥ 2 mm; exoftalmos ≥ 3 mm.');
  assert.match(severitySummary(severityState(false, { ...base, opticNeuropathy: true }), ['neuropatía óptica distiroidea']), /con amenaza para la visión\. Hallazgos/);
  assert.equal(goqolSummary(goqol(Array(8).fill(null), Array(8).fill(null))), null);
  assert.equal(goqolSummary(goqol(Array(8).fill(2), [3, 3, 3, null, null, null, null, null])), 'GO-QoL (0 a 100; mayor es mejor): función visual 50 (8 de 8 respondidas); apariencia 100 (3 de 8 respondidas); total 63,6.');
});
