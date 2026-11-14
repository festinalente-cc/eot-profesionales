import test from 'node:test';
import assert from 'node:assert/strict';
import { route } from '../src/logic/route.js';
import { NECESSARY, ratingsFor } from '../src/logic/scenarios.js';

const drugs = (r, tier) => r.steps.filter((s) => s.tier === tier).flatMap((s) => s.drugs || []);

test('moderada sin refractariedad: GC IV y teprotumumab en primera línea', () => {
  const r = route({ active: true, severity: 'moderada', refractory: false, gcContra: false });
  assert.equal(r.branch, 'moderada-primera-linea');
  assert.deepEqual(drugs(r, 'necesaria'), ['ivgc', 'tepro']);
  assert.deepEqual(drugs(r, 'apropiada'), ['toci', 'mmf', 'triam']);
  assert.deepEqual(r.scenarios.sort((a, b) => a - b), [1, 2, 8, 11]);
});
test('moderada refractaria o con contraindicación: biológicos, sin GC IV', () => {
  for (const i of [{ refractory: true, gcContra: false }, { refractory: false, gcContra: true }, { refractory: true, gcContra: true }]) {
    const r = route({ active: true, severity: 'moderada', ...i });
    assert.equal(r.branch, 'moderada-refractaria');
    assert.deepEqual(drugs(r, 'necesaria'), ['tepro', 'toci']);
    assert.ok(!r.steps.some((s) => (s.drugs || []).includes('ivgc')));
  }
});
test('neuropatía óptica: GC IV inmediatos salvo contraindicación', () => {
  const a = route({ active: true, severity: 'neuropatia', gcContra: false, refractory: false });
  assert.deepEqual(drugs(a, 'urgente'), ['ivgc']);
  assert.deepEqual(drugs(a, 'necesaria'), []);
  const b = route({ active: true, severity: 'neuropatia', gcContra: true });
  assert.deepEqual(drugs(b, 'urgente'), []);
  assert.deepEqual(drugs(b, 'necesaria'), ['tepro', 'toci']);
  const c = route({ active: true, severity: 'neuropatia', gcContra: false, refractory: true });
  assert.deepEqual(drugs(c, 'urgente'), ['ivgc']);
  assert.deepEqual(drugs(c, 'necesaria'), ['tepro', 'toci']);
  for (const r of [a, b, c]) assert.ok(r.steps.at(-1).items[0].includes('descompresión'));
});
test('lo que amenaza la visión no depende del CAS', () => {
  assert.equal(route({ active: false, severity: 'neuropatia', gcContra: false }).branch, 'grave-neuropatia');
  assert.equal(route({ active: false, severity: 'perforacion' }).branch, 'grave-cornea');
});
test('perforación corneal: manejo quirúrgico, sin fármacos sistémicos de entrada', () => {
  const r = route({ active: true, severity: 'perforacion' });
  assert.equal(r.steps[0].tier, 'urgente');
  assert.ok(r.steps.every((s) => !s.drugs));
});
test('leve e inactiva quedan fuera del consenso y remiten a guías', () => {
  assert.equal(route({ active: true, severity: 'leve' }).scope, 'guias');
  assert.equal(route({ active: false, severity: 'moderada' }).scope, 'guias');
  assert.equal(route({ active: false, severity: 'leve' }).branch, 'inactiva');
});
test('entradas incompletas no producen recomendación', () => {
  assert.equal(route({}).branch, 'incompleta');
  assert.equal(route({ active: true, severity: 'moderada' }).branch, 'incompleta');
  assert.equal(route({ active: true, severity: 'moderada', refractory: true }).branch, 'incompleta');
});
test('cada fármaco "necesario" de la ruta lo es en algún escenario de su rama; los "apropiados", al menos apropiados', () => {
  const cases = [
    { active: true, severity: 'moderada', refractory: false, gcContra: false },
    { active: true, severity: 'moderada', refractory: true, gcContra: false },
    { active: true, severity: 'neuropatia', gcContra: true },
  ];
  for (const c of cases) {
    const r = route(c);
    for (const d of drugs(r, 'necesaria')) assert.ok(r.scenarios.some((s) => NECESSARY[s].includes(d)), `${r.branch}: ${d}`);
    for (const d of drugs(r, 'apropiada')) assert.ok(r.scenarios.some((s) => ratingsFor(s).some((x) => x.id === d && (x.cls === 'A' || x.cls === 'N'))), `${r.branch}: ${d}`);
  }
});
