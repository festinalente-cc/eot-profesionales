import { CAS_ITEMS, CAS_FOLLOWUP, cas, severity, cumulativeDose, MP_PRESETS, MP_MAX_G, goqol, goqolChange, GOQOL_CHANGE } from '../../src/logic/tools.js';
const $ = (id) => document.getElementById(id);
const check = (name, i, text) => `<label class="opt"><input type="checkbox" name="${name}" value="${i}"><span>${text}</span></label>`;

// CAS
$('cas-base').innerHTML = CAS_ITEMS.map((t, i) => check('cas', i, t)).join('');
$('cas-fu').innerHTML = CAS_FOLLOWUP.map((t, i) => check('casfu', i, t)).join('');
function renderCas() {
  const fu = $('cas-followup').checked;
  $('cas-fu-box').hidden = !fu;
  const marks = (name, n) => Array.from({ length: n }, (_, i) => document.querySelector(`input[name="${name}"][value="${i}"]`).checked);
  const r = cas(marks('cas', 7), fu ? marks('casfu', 3) : null);
  $('cas-out').className = `result ${r.active ? 'N' : 'I'}`;
  $('cas-out').textContent = `CAS ${r.score} de ${r.max}: enfermedad ${r.active ? 'activa' : 'inactiva'} (umbral ≥ ${r.threshold}).`;
}
$('cas-form').addEventListener('change', renderCas); renderCas();

// Gravedad
function renderSev() {
  const c = (id) => $(id).checked;
  const r = severity({ lidRetraction2mm: c('sv-lid'), softTissueModerate: c('sv-soft'), exophthalmos3mm: c('sv-exo'), diplopia: $('sv-dip').value, opticNeuropathy: c('sv-don'), cornealBreakdown: c('sv-cor') });
  const text = { leve: 'Leve', 'moderada-grave': 'Moderada a grave', 'amenaza-vision': 'Con amenaza para la visión: urgencia oftalmológica' }[r.level];
  $('sev-out').className = `result ${r.level === 'leve' ? 'I' : r.level === 'moderada-grave' ? 'A' : 'chip'}`;
  if (r.level === 'amenaza-vision') $('sev-out').style.cssText = 'background:var(--urg-bg);color:var(--urg)'; else $('sev-out').style.cssText = '';
  $('sev-out').textContent = text + (r.count !== null ? ` (${r.count} de 4 criterios; moderada a grave con 2 o más).` : '.');
}
$('sev-form').addEventListener('change', renderSev); renderSev();

// Dosis acumulada
function setPreset(p) { const b = MP_PRESETS[p]; $('d-n1').value = b[0].n; $('d-g1').value = b[0].g * 1000; $('d-n2').value = b[1].n; $('d-g2').value = b[1].g * 1000; renderDose(); }
function renderDose() {
  const n = (id) => Number($(id).value) || 0;
  try {
    const r = cumulativeDose([{ n: n('d-n1'), g: n('d-g1') / 1000 }, { n: n('d-n2'), g: n('d-g2') / 1000 }], n('d-prior'));
    const f = (x) => x.toLocaleString('es-CO', { maximumFractionDigits: 2 });
    $('dose-out').className = 'result';
    $('dose-out').style.cssText = r.exceeds ? 'background:var(--urg-bg);color:var(--urg)' : 'background:var(--nec-bg);color:var(--nec)';
    $('dose-out').textContent = `Este ciclo: ${f(r.course)} g. Acumulado: ${f(r.total)} g. ${r.exceeds ? `Supera el máximo de ${MP_MAX_G} g.` : `Dentro del máximo de ${MP_MAX_G} g.`}`;
  } catch { $('dose-out').textContent = 'Revise los valores.'; }
}
$('dose-form').addEventListener('input', renderDose);
$('p-std').addEventListener('click', () => setPreset('estandar'));
$('p-alta').addEventListener('click', () => setPreset('alta'));
setPreset('estandar');

// GO-QoL
const qSelect = (i) => `<label class="field">Pregunta ${i}<select id="gq-${i}" style="width:100%"><option value="">Sin respuesta o no aplica</option><option value="1">Sí, mucho</option><option value="2">Sí, un poco</option><option value="3">No, nada</option></select></label>`;
$('goqol-v').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(qSelect).join('');
$('goqol-a').innerHTML = [9, 10, 11, 12, 13, 14, 15, 16].map(qSelect).join('');
function renderGoqol() {
  const get = (from) => Array.from({ length: 8 }, (_, k) => { const v = $(`gq-${from + k}`).value; return v === '' ? null : Number(v); });
  const r = goqol(get(1), get(9));
  const f = (x) => x.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  const out = $('goqol-out');
  if (r.n === 0) { out.className = 'result I'; out.textContent = 'Registre las respuestas para ver el puntaje.'; return; }
  const line = (name, s, prevId) => {
    if (s.score === null) return `${name}: sin respuestas.`;
    let t = `${name}: ${f(s.score)} de 100 (${s.n} de 8 respondidas).`;
    const prev = $(prevId).value;
    if (prev !== '' && Number(prev) >= 0 && Number(prev) <= 100) {
      const c = goqolChange(Number(prev), s.score);
      t += c.direction === 'igual' ? ' Sin cambio.' : ` Cambio de ${c.delta > 0 ? '+' : ''}${f(c.delta)} puntos: ${c.direction}${c.meaningful ? ', clínicamente relevante' : `, por debajo del umbral de ${GOQOL_CHANGE} puntos`}.`;
    }
    return t;
  };
  out.className = 'result A';
  out.innerHTML = [line('Función visual', r.visual, 'goqol-pv'), line('Apariencia', r.appearance, 'goqol-pa'), `Total: ${f(r.total)} de 100.`].map((t) => `<div>${t}</div>`).join('');
}
$('goqol-form').addEventListener('input', renderGoqol);
$('goqol-form').addEventListener('reset', () => setTimeout(renderGoqol));
renderGoqol();
