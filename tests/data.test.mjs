import test from 'node:test';
import assert from 'node:assert/strict';
import { RATINGS } from '../src/logic/ratings.js';
import { INTERVENTIONS, SCENARIOS, NECESSARY, ratingsFor, scenariosIn } from '../src/logic/scenarios.js';

const count = (c) => RATINGS.filter((r) => r[5] === c).length;

test('238 pares: 14 escenarios por 17 intervenciones, sin duplicados', () => {
  assert.equal(RATINGS.length, 238);
  assert.equal(new Set(RATINGS.map((r) => r[0] + r[1])).size, 238);
  assert.equal(Object.keys(SCENARIOS).length, 14);
  assert.equal(Object.keys(INTERVENTIONS).length, 17);
  for (const r of RATINGS) assert.ok(INTERVENTIONS[r[1]] && SCENARIOS[r[0]]);
});
test('totales publicados: 49 apropiadas, 145 inapropiadas, 44 inciertas (4 por desacuerdo)', () => {
  assert.equal(count('A'), 49);
  assert.equal(count('I'), 145);
  assert.equal(count('U'), 44);
  assert.equal(RATINGS.filter((r) => r[4]).length, 4);
});
test('clasificación coherente con la mediana y el desacuerdo (reglas RAND/UCLA)', () => {
  for (const [s, id, m, ipras, d, c] of RATINGS) {
    const expected = d ? 'U' : m >= 7 ? 'A' : m <= 3 ? 'I' : 'U';
    assert.equal(c, expected, `escenario ${s}, ${id}`);
    assert.ok(m >= 1 && m <= 9 && ipras > 0);
  }
});
test('desacuerdos publicados: MMF 11 y 14, triamcinolona 5, teprotumumab 14', () => {
  const d = RATINGS.filter((r) => r[4]).map((r) => `${r[1]}${r[0]}`).sort();
  assert.deepEqual(d, ['mmf11', 'mmf14', 'tepro14', 'triam5']);
});
test('33 necesarias, todas dentro de las apropiadas', () => {
  let n = 0;
  for (const [s, list] of Object.entries(NECESSARY)) {
    for (const id of list) {
      n++;
      const r = RATINGS.find((x) => x[0] === Number(s) && x[1] === id);
      assert.equal(r[5], 'A', `escenario ${s}, ${id}`);
    }
  }
  assert.equal(n, 33);
});
test('perforación corneal: ninguna terapia sistémica apropiada', () => {
  assert.equal(ratingsFor(13).filter((r) => r.cls === 'A' || r.cls === 'N').length, 0);
});
test('GC IV necesarios en todos los escenarios sin refractariedad ni contraindicación', () => {
  for (const s of [1, 2, 8, 11, 3, 10]) assert.ok(NECESSARY[s].includes('ivgc'));
  for (const s of [4, 5, 6, 7, 9]) assert.ok(!NECESSARY[s].includes('ivgc'));
});
test('categorías: 4, 5, 4 y 1 escenarios', () => {
  assert.deepEqual([1, 2, 3, 4].map((c) => scenariosIn(c).length), [4, 5, 4, 1]);
});
test('rituximab nunca apropiado; micofenolato nunca necesario', () => {
  assert.equal(RATINGS.filter((r) => r[1] === 'rtx' && r[5] === 'A').length, 0);
  assert.ok(Object.values(NECESSARY).every((l) => !l.includes('mmf')));
});
