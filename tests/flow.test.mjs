import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from '../src/logic/flow.js';
import { fullSummary } from '../src/logic/summary.js';

const f = (n) => Array.from({ length: 7 }, (_, i) => i < n);
const sev0 = { lidRetraction2mm: false, softTissueModerate: false, exophthalmos3mm: false, diplopia: 'no', opticNeuropathy: false, cornealBreakdown: false };
const q = (v) => Array(8).fill(v);
const base = { casMarks: f(0), casOk: false, sev: sev0, sevOk: false, qolV: q(null), qolA: q(null), qolOk: false };
const modActiva = { ...base, casMarks: f(4), casOk: true, sev: { ...sev0, lidRetraction2mm: true, diplopia: 'constante' }, sevOk: true };

test('sin tocar nada: sin resultado y sin nota', () => {
  const e = evaluate(base);
  assert.equal(e.ready, false); assert.equal(e.canCopy, false);
  assert.deepEqual(e.steps, { cas: false, sev: false, qol: false, gc: null });
});
test('el CAS y la gravedad definen la rama; faltan las preguntas de glucocorticoides', () => {
  const e = evaluate(modActiva);
  assert.equal(e.needsGc, true); assert.equal(e.ready, false); assert.equal(e.steps.gc, false);
});
test('moderada activa completa: hay resultado, pero la nota exige el GO-QoL', () => {
  const e = evaluate({ ...modActiva, refractory: false, gcContra: false });
  assert.equal(e.result.branch, 'moderada-primera-linea'); assert.equal(e.ready, true);
  assert.equal(e.canCopy, false); assert.deepEqual(e.missing, ['registrar y confirmar el GO-QoL']);
  const sinConfirmar = evaluate({ ...modActiva, refractory: false, gcContra: false, qolV: q(2), qolA: q(3) });
  assert.equal(sinConfirmar.canCopy, false);
  const ok = evaluate({ ...modActiva, refractory: false, gcContra: false, qolV: q(2), qolA: q(3), qolOk: true });
  assert.equal(ok.canCopy, true);
});
test('CAS bajo o gravedad leve: fuera del consenso, sin preguntas de glucocorticoides', () => {
  const inactiva = evaluate({ ...modActiva, casMarks: f(1) });
  assert.equal(inactiva.result.branch, 'inactiva'); assert.equal(inactiva.steps.gc, null);
  const leve = evaluate({ ...modActiva, sev: sev0 });
  assert.equal(leve.result.branch, 'leve');
});
test('urgencia: resultado inmediato y nota sin CAS confirmado ni GO-QoL', () => {
  const don = evaluate({ ...base, sev: { ...sev0, opticNeuropathy: true } });
  assert.equal(don.result.branch, 'grave-neuropatia'); assert.equal(don.ready, true);
  assert.equal(don.canCopy, false); assert.deepEqual(don.missing, ['responder sobre glucocorticoides']);
  const don2 = evaluate({ ...base, sev: { ...sev0, opticNeuropathy: true }, gcContra: true });
  assert.equal(don2.canCopy, true);
  assert.match(fullSummary(don2, ['neuropatía óptica']), /CAS sin completar por urgencia.*GO-QoL no aplicado por urgencia/);
  const perf = evaluate({ ...base, sev: { ...sev0, cornealBreakdown: true } });
  assert.equal(perf.result.branch, 'grave-cornea'); assert.equal(perf.canCopy, true);
  const ambas = evaluate({ ...base, sev: { ...sev0, cornealBreakdown: true, opticNeuropathy: true } });
  assert.equal(ambas.both, true); assert.match(fullSummary(ambas, []), /combinación no evaluada/);
});
test('nota única: incluye las tres medidas y la ruta, en pocas líneas', () => {
  const e = evaluate({ ...modActiva, refractory: true, gcContra: false, qolV: q(2), qolA: [3, 3, 2, 2, 3, null, null, null], qolOk: true });
  const t = fullSummary(e, ['retracción palpebral ≥ 2 mm', 'diplopía constante']);
  assert.match(t, /^EOT\. CAS 4\/7 \(activa\); gravedad EUGOGO moderada a grave \(retracción palpebral ≥ 2 mm, diplopía constante\); GO-QoL función visual 50, apariencia 80\./);
  assert.match(t, /Glucocorticoides: refractaria a GC IV; sin contraindicación a GC\./);
  assert.match(t, /Preferidas: teprotumumab \(con registro en Colombia\), tocilizumab \(sin indicación aprobada en Colombia\)\. Alternativas en casos seleccionados: micofenolato, triamcinolona periocular\./);
  assert.ok(t.split('\n').length <= 5, t);
  assert.ok(t.length < 760, String(t.length));
  assert.equal(fullSummary(evaluate(modActiva)), null);
});
