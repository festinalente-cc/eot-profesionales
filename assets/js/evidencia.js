import { INTERVENTIONS, SCENARIOS, CATEGORIES, ratingsFor } from '../../src/logic/scenarios.js';
import { CRITERIA, SOURCES } from '../../src/logic/criteria.js';
import { SYNTHESIS } from '../../src/logic/evidence.js';
const $ = (id) => document.getElementById(id);

$('synthesis').innerHTML = SYNTHESIS.map(([id, ...c]) => `<tr><th scope="row">${INTERVENTIONS[id].name}</th>${c.slice(0, 4).map((x) => `<td class="c">${x === '-' ? '–' : x}</td>`).join('')}<td>${c[4]}</td></tr>`).join('');

const order = [1, 2, 8, 11, 4, 5, 7, 9, 12, 3, 6, 10, 14, 13];
const ids = Object.keys(INTERVENTIONS);
const by = Object.fromEntries(order.map((s) => [s, Object.fromEntries(ratingsFor(s).map((r) => [r.id, r]))]));
const L = { N: 'necesaria', A: 'apropiada', U: 'incierta', D: 'incierta por desacuerdo', I: 'inapropiada' };
$('matrix-head').innerHTML = `<tr><th scope="col">Intervención</th>${order.map((s) => `<th scope="col" class="c" title="${SCENARIOS[s].text}">${s}</th>`).join('')}</tr>`;
$('matrix').innerHTML = ids.map((id) => `<tr><th scope="row">${INTERVENTIONS[id].short}</th>${order.map((s) => { const r = by[s][id]; return `<td class="c ${r.cls}" title="Escenario ${s}: ${L[r.cls]}, mediana ${r.median}">${r.median}${r.cls === 'N' ? '*' : r.cls === 'D' ? '†' : ''}</td>`; }).join('')}</tr>`).join('');
$('scenario-list').innerHTML = [1, 2, 3, 4].map((c) => `<h3>Categoría ${c}. ${CATEGORIES[c]}</h3><ul>${order.filter((s) => SCENARIOS[s].cat === c).map((s) => `<li><strong>${s}.</strong> ${SCENARIOS[s].text}</li>`).join('')}</ul>`).join('');

const ST = { publicado: 'Publicado por el grupo', guia: 'Guía; pendiente de revisión por el grupo', grupo: 'Dato del grupo (nov. 2026)' };
$('criteria').innerHTML = CRITERIA.map((c) => `<tr><th scope="row">${c.label}</th><td>${c.value}</td><td>${c.source ? (SOURCES[c.source].url ? `<a href="${SOURCES[c.source].url}">${SOURCES[c.source].cite}</a>` : SOURCES[c.source].cite) : '—'}</td><td><span class="tag${c.status === 'publicado' ? '' : ' draft'}">${ST[c.status]}</span></td><td>${c.used}</td></tr>`).join('');
