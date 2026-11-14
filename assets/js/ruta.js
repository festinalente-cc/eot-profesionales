import { route } from '../../src/logic/route.js';
import { INTERVENTIONS, COLOMBIA, CATEGORIES, SCENARIOS, ratingsFor } from '../../src/logic/scenarios.js';
import { GUIDES } from '../../src/logic/guides.js';
import { SOURCES } from '../../src/logic/criteria.js';

const form = document.getElementById('ruta-form');
const out = document.getElementById('ruta-out');
const CLS = { N: 'Necesaria', A: 'Apropiada', U: 'Incierta', D: 'Incierta por desacuerdo', I: 'Inapropiada' };
const TITLES = {
  'moderada-primera-linea': 'EOT moderada activa, sin refractariedad ni contraindicación a glucocorticoides',
  'moderada-refractaria': 'EOT moderada activa, refractaria o con contraindicación a glucocorticoides',
  'grave-neuropatia': 'EOT grave con neuropatía óptica',
  'grave-cornea': 'EOT grave con perforación corneal',
  leve: 'EOT leve activa', inactiva: 'EOT inactiva',
};
const val = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value;
const bool = (v) => (v === 'si' ? true : v === 'no' ? false : undefined);

function chip(id, cls) {
  const d = INTERVENTIONS[id];
  const reg = d.colombia ? `<small>${COLOMBIA[d.colombia]}</small>` : '';
  return `<li class="chip ${cls}">${d.name}${reg}</li>`;
}
function scenarioBlock(s) {
  const rs = ratingsFor(s);
  const pick = (c) => rs.filter((r) => r.cls === c);
  const row = (c) => pick(c).length ? `<tr><th scope="row">${CLS[c]}</th><td>${pick(c).map((r) => `${INTERVENTIONS[r.id].short} <span class="muted">(${r.median})</span>`).join(' · ')}</td></tr>` : '';
  return `<details><summary>Escenario ${s}. ${SCENARIOS[s].text}</summary><div>
    <div class="table-wrap"><table><tbody>${['N', 'A', 'D', 'U', 'I'].map(row).join('')}</tbody></table></div>
    <p class="small muted" style="margin-top:.6rem">Entre paréntesis, la mediana del panel en la escala de 1 a 9.</p></div></details>`;
}
function guides(branch) {
  const g = GUIDES[branch] || [];
  if (!g.length) return '';
  return `<h2>Qué dicen las guías</h2>${g.map((x) => `<div class="note${x.diff ? ' warn' : ''}"><p><strong>${x.src === 'eugogo' ? 'EUGOGO 2021' : x.src === 'ataeta' ? 'ATA/ETA 2022' : 'Consenso del grupo'}.</strong> ${x.text}${x.verified ? '' : ' <span class="tag draft">Por verificar contra el texto de la guía</span>'}</p></div>`).join('')}
  <p class="small muted">Fuentes: ${Object.values(SOURCES).filter((s) => s.url && (s.cite.includes('EUGOGO') || s.cite.includes('ATA'))).map((s) => `<a href="${s.url}">${s.cite}</a>`).join(' ')}</p>`;
}

function render() {
  const severity = val('severity');
  const sight = severity === 'neuropatia' || severity === 'perforacion';
  document.getElementById('q-mod').hidden = severity !== 'moderada' || val('active') !== 'si';
  document.getElementById('q-don').hidden = severity !== 'neuropatia';
  const input = { active: bool(val('active')), severity };
  if (severity === 'moderada') { input.refractory = bool(val('refractory')); input.gcContra = bool(val('gcContra')); }
  if (severity === 'neuropatia') { input.refractory = bool(val('donRefractory')); input.gcContra = bool(val('donContra')); }
  if (sight && input.active === undefined) input.active = true; // la urgencia no espera al CAS
  const r = route(input);

  if (r.branch === 'incompleta') { out.innerHTML = '<p class="muted">Responda las preguntas para ver la ruta.</p>'; return; }
  let html = `<h2>${TITLES[r.branch]}</h2>`;
  if (r.scope === 'guias') {
    html += `<div class="note"><p><strong>Fuera del alcance del consenso.</strong> El consenso del grupo evaluó solo el manejo médico de la enfermedad activa (CAS ≥ 3) moderada a grave. Para esta situación la ruta remite a las guías.</p></div>${guides(r.branch)}`;
    out.innerHTML = html; return;
  }
  if (sight) html += '<div class="note urgent"><p><strong>Urgencia oftalmológica.</strong> Requiere valoración inmediata por oftalmología.</p></div>';
  html += '<div class="legend"><span class="N">Necesaria</span><span class="A">Apropiada en casos seleccionados</span></div>';
  for (const s of r.steps) {
    const cls = s.tier === 'necesaria' ? 'N' : s.tier === 'apropiada' ? 'A' : s.tier === 'urgente' ? 'N' : 'I';
    html += `<div class="step ${s.tier}"><h3>${s.label}</h3>${s.drugs ? `<ul class="chips">${s.drugs.map((d) => chip(d, cls)).join('')}</ul>` : `<ul>${s.items.map((x) => `<li>${x}</li>`).join('')}</ul>`}</div>`;
  }
  if (severity === 'neuropatia' && input.gcContra === undefined) html += '<p class="small muted">Indique si hay contraindicación o refractariedad para ver las alternativas.</p>';
  html += `<p class="small muted">Ruta simplificada del consenso (figura 3). Las calificaciones no consideraron costos ni disponibilidad. <a href="${SOURCES.consenso.url}">${SOURCES.consenso.cite}</a></p>`;
  html += `<h2>Escenarios del consenso en esta rama</h2><p class="muted">Categoría ${r.category}: ${CATEGORIES[r.category]}. Busque el escenario más parecido a su paciente; las calificaciones varían entre escenarios.</p>${r.scenarios.map(scenarioBlock).join('')}`;
  html += guides(r.branch);
  out.innerHTML = html;
}
form.addEventListener('change', render);
form.addEventListener('reset', () => setTimeout(render));
render();
