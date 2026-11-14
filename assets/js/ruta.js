// Evaluación y ruta en un solo recorrido: CAS, gravedad, calidad de vida, glucocorticoides y resultado.
import { INTERVENTIONS, COLOMBIA, CATEGORIES, SCENARIOS, ratingsFor } from '../../src/logic/scenarios.js';
import { GUIDES } from '../../src/logic/guides.js';
import { SOURCES } from '../../src/logic/criteria.js';
import { CAS_ITEMS } from '../../src/logic/tools.js';
import { GOQOL_ITEMS, GOQOL_VERSION, GOQOL_NOTICE, GOQOL_URL } from '../../src/logic/goqol-items.js';
import { evaluate } from '../../src/logic/flow.js';
import { fullSummary } from '../../src/logic/summary.js';
import { copyButton } from './copiar.js';

const $ = (id) => document.getElementById(id);
const form = $('flow');
const out = $('ruta-out');
let lastSummary = null;
const copy = copyButton(() => lastSummary);

const CLS = { N: 'Necesaria', A: 'Apropiada', U: 'Incierta', D: 'Incierta por desacuerdo', I: 'Inapropiada' };
const TITLES = {
  'moderada-primera-linea': 'EOT moderada activa, sin refractariedad ni contraindicación a glucocorticoides',
  'moderada-refractaria': 'EOT moderada activa, refractaria o con contraindicación a glucocorticoides',
  'grave-neuropatia': 'EOT grave con neuropatía óptica',
  'grave-cornea': 'EOT grave con perforación corneal',
  leve: 'EOT leve activa', inactiva: 'EOT inactiva',
};

// Formulario
$('cas-items').innerHTML = CAS_ITEMS.map((t, i) => `<label class="opt"><input type="checkbox" name="cas" value="${i}"><span>${t}</span></label>`).join('');
const qSel = (i) => `<label class="field">${GOQOL_ITEMS[i - 1] ? `${i}. ${GOQOL_ITEMS[i - 1]}` : `Pregunta ${i}`}<select id="gq-${i}" style="width:100%"><option value="">Sin respuesta o no aplica</option><option value="1">Sí, mucho</option><option value="2">Sí, un poco</option><option value="3">No, nada</option></select></label>`;
$('qol-v').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(qSel).join('');
$('qol-a').innerHTML = [9, 10, 11, 12, 13, 14, 15, 16].map(qSel).join('');
$('qol-notice').innerHTML = `${GOQOL_NOTICE}${GOQOL_VERSION ? ` ${GOQOL_VERSION}.` : ''} <a href="${GOQOL_URL}" target="_blank" rel="noopener">Descargar el formulario en español en el sitio de EUGOGO</a>.`;

const radio = (name) => { const v = form.querySelector(`input[name="${name}"]:checked`)?.value; return v === 'si' ? true : v === 'no' ? false : undefined; };
function read() {
  const c = (id) => $(id).checked;
  const qol = (from) => Array.from({ length: 8 }, (_, k) => { const v = $(`gq-${from + k}`).value; return v === '' ? null : Number(v); });
  return {
    casMarks: Array.from({ length: 7 }, (_, i) => form.querySelector(`input[name="cas"][value="${i}"]`).checked), casOk: c('cas-ok'),
    sev: { lidRetraction2mm: c('sv-lid'), softTissueModerate: c('sv-soft'), exophthalmos3mm: c('sv-exo'), diplopia: $('sv-dip').value, opticNeuropathy: c('sv-don'), cornealBreakdown: c('sv-cor') }, sevOk: c('sv-ok'),
    qolV: qol(1), qolA: qol(9), qolOk: c('qol-ok'), refractory: radio('refractory'), gcContra: radio('gcContra'),
  };
}
function findings(s) {
  return [s.sev.lidRetraction2mm && 'retracción palpebral ≥ 2 mm', s.sev.softTissueModerate && 'tejidos blandos moderado o grave', s.sev.exophthalmos3mm && 'exoftalmos ≥ 3 mm', s.sev.diplopia !== 'no' && `diplopía ${s.sev.diplopia}`, s.sev.opticNeuropathy && 'neuropatía óptica', s.sev.cornealBreakdown && 'perforación corneal'].filter(Boolean);
}

// Resultado
function chip(id, cls) {
  const d = INTERVENTIONS[id];
  return `<li class="chip ${cls}">${d.name}${d.colombia ? `<small>${COLOMBIA[d.colombia]}</small>` : ''}</li>`;
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
  return `<h3>Qué dicen las guías</h3>${g.map((x) => `<div class="note${x.diff ? ' warn' : ''}"><p><strong>${x.src === 'eugogo' ? 'EUGOGO 2021' : x.src === 'ataeta' ? 'ATA/ETA 2022' : 'Consenso del grupo'}.</strong> ${x.text}${x.verified ? '' : ' <span class="tag draft">Por verificar contra el texto de la guía</span>'}</p></div>`).join('')}
  <p class="small muted">Fuentes: ${Object.values(SOURCES).filter((s) => s.url && (s.cite.includes('EUGOGO') || s.cite.includes('ATA'))).map((s) => `<a href="${s.url}">${s.cite}</a>`).join(' ')}</p>`;
}
function measures(ev) {
  const f = (x) => x.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  const cas = ev.cas.status === 'completa' ? `CAS ${ev.cas.score} de ${ev.cas.max}: ${ev.cas.active ? 'activa' : 'inactiva'}` : 'CAS sin confirmar';
  const sev = ev.urgent ? 'Con amenaza para la visión' : ev.sv.status === 'completa' ? (ev.sv.level === 'leve' ? 'Leve' : 'Moderada a grave') : 'Gravedad sin confirmar';
  const qol = ev.steps.qol ? `GO-QoL: visual ${ev.q.visual.score === null ? '–' : f(ev.q.visual.score)}, apariencia ${ev.q.appearance.score === null ? '–' : f(ev.q.appearance.score)}` : 'GO-QoL pendiente';
  return `<ul class="chips measures"><li class="chip ${ev.cas.status === 'completa' ? 'I' : 'pend'}">${cas}</li><li class="chip ${ev.steps.sev ? 'I' : 'pend'}">${sev}</li><li class="chip ${ev.steps.qol ? 'I' : 'pend'}">${qol}</li></ul>`;
}

function step(id, done, optional = false) {
  const li = $(`p-${id}`);
  li.dataset.state = done ? 'ok' : 'pend';
  li.querySelector('span').textContent = done ? 'Completo' : optional ? 'Opcional en urgencia' : 'Pendiente';
}

function render() {
  const s = read();
  const ev = evaluate(s);
  $('s-gc').hidden = !ev.needsGc;
  $('q-refractory').hidden = !ev.needsGc;
  $('p-gc').hidden = !ev.needsGc;
  step('cas', ev.steps.cas, ev.urgent); step('sev', ev.steps.sev); step('qol', ev.steps.qol, ev.urgent);
  if (ev.needsGc) step('gc', ev.steps.gc);
  lastSummary = fullSummary(ev, findings(s));
  copy.reset();

  if (!ev.ready) {
    const todo = [!ev.steps.cas && 'el CAS', !ev.steps.sev && 'la gravedad', ev.steps.gc === false && 'las preguntas sobre glucocorticoides'].filter(Boolean);
    out.innerHTML = `<h2>Resultado</h2><div class="result pending">Pendiente. Complete y confirme ${todo.join(', ').replace(/, ([^,]*)$/, ' y $1')}.</div>`;
    return;
  }
  const r = ev.result;
  let html = `<h2>Resultado</h2>${measures(ev)}<h3 class="branch">${TITLES[r.branch]}</h3>`;
  if (ev.urgent) html += '<div class="note urgent"><p><strong>Urgencia oftalmológica.</strong> Requiere valoración inmediata por oftalmología.</p></div>';
  if (ev.both) html += '<div class="note urgent"><p>Coexisten neuropatía óptica y perforación corneal. El consenso no evaluó esta combinación: se muestra la rama de perforación corneal; la neuropatía requiere manejo simultáneo.</p></div>';
  if (r.scope === 'guias') {
    html += '<div class="note"><p><strong>Fuera del alcance del consenso.</strong> El consenso del grupo evaluó solo el manejo médico de la enfermedad activa (CAS ≥ 3) moderada a grave. Para esta situación la ruta remite a las guías.</p></div>';
  } else {
    html += '<div class="legend"><span class="N">Necesaria</span><span class="A">Apropiada en casos seleccionados</span></div>';
    for (const st of r.steps) {
      const cls = st.tier === 'necesaria' || st.tier === 'urgente' ? 'N' : st.tier === 'apropiada' ? 'A' : 'I';
      html += `<div class="step ${st.tier}"><h3>${st.label}</h3>${st.drugs ? `<ul class="chips">${st.drugs.map((d) => chip(d, cls)).join('')}</ul>` : `<ul>${st.items.map((x) => `<li>${x}</li>`).join('')}</ul>`}</div>`;
    }
    html += `<p class="small muted">Ruta simplificada del consenso (figura 3). Las calificaciones no consideraron costos ni disponibilidad. <a href="${SOURCES.consenso.url}">${SOURCES.consenso.cite}</a></p>`;
  }
  html += '<div id="copy-slot"></div>';
  if (r.scope !== 'guias') html += `<h3>Escenarios del consenso en esta rama</h3><p class="muted">Categoría ${r.category}: ${CATEGORIES[r.category]}. Busque el escenario más parecido a su paciente; las calificaciones varían entre escenarios.</p>${r.scenarios.map(scenarioBlock).join('')}`;
  html += guides(r.branch);
  out.innerHTML = html;
  const slot = $('copy-slot');
  if (ev.canCopy) slot.appendChild(copy.el);
  else slot.innerHTML = `<p class="copy-missing no-print">Para copiar la nota a la historia clínica falta ${ev.missing.join(' y ')}.</p>`;
}
form.addEventListener('input', render);
form.addEventListener('reset', () => setTimeout(render));
render();
