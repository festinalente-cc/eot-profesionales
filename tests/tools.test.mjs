import test from 'node:test';
import assert from 'node:assert/strict';
import { cas, severity, cumulativeDose, MP_PRESETS } from '../src/logic/tools.js';

const f = (n, len) => Array.from({ length: len }, (_, i) => i < n);

test('CAS: activa con 3 o más de 7', () => {
  assert.equal(cas(f(2, 7)).active, false);
  assert.equal(cas(f(3, 7)).active, true);
  assert.deepEqual(cas(f(7, 7)), { score: 7, max: 7, threshold: 3, active: true });
});
test('CAS de seguimiento: activa con 4 o más de 10', () => {
  assert.equal(cas(f(3, 7), f(0, 3)).active, false);
  assert.equal(cas(f(3, 7), f(1, 3)).active, true);
  assert.equal(cas(f(0, 7), f(3, 3)).score, 3);
});
test('CAS rechaza entradas incompletas', () => {
  assert.throws(() => cas(f(1, 6)));
  assert.throws(() => cas(f(1, 7), f(1, 2)));
});
test('gravedad EUGOGO', () => {
  const base = { lidRetraction2mm: false, softTissueModerate: false, exophthalmos3mm: false, diplopia: 'no', opticNeuropathy: false, cornealBreakdown: false };
  assert.equal(severity(base).level, 'leve');
  assert.equal(severity({ ...base, lidRetraction2mm: true }).level, 'leve');
  assert.equal(severity({ ...base, diplopia: 'intermitente', exophthalmos3mm: true }).level, 'leve');
  assert.equal(severity({ ...base, diplopia: 'inconstante', exophthalmos3mm: true }).level, 'moderada-grave');
  assert.equal(severity({ ...base, lidRetraction2mm: true, softTissueModerate: true }).level, 'moderada-grave');
  assert.equal(severity({ ...base, opticNeuropathy: true }).level, 'amenaza-vision');
  assert.equal(severity({ ...base, cornealBreakdown: true }).level, 'amenaza-vision');
});
test('dosis acumulada: esquemas de 4,5 g y 7,5 g; alerta por encima de 8 g', () => {
  assert.equal(cumulativeDose(MP_PRESETS.estandar).total, 4.5);
  assert.equal(cumulativeDose(MP_PRESETS.alta).total, 7.5);
  assert.equal(cumulativeDose(MP_PRESETS.alta).exceeds, false);
  assert.equal(cumulativeDose(MP_PRESETS.estandar, 3.5).exceeds, false);
  assert.equal(cumulativeDose(MP_PRESETS.estandar, 4).exceeds, true);
  assert.throws(() => cumulativeDose([{ n: -1, g: 0.5 }]));
});
