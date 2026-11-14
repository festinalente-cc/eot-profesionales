// Encabezado, navegación y pie comunes.
const root = document.body.dataset.root || './';
const page = document.body.dataset.page || '';
const NAV = [
  ['ruta', 'Ruta de tratamiento', 'ruta/'],
  ['herramientas', 'Herramientas', 'herramientas/'],
  ['evidencia', 'Evidencia', 'evidencia/'],
  ['directorio', 'Directorio', 'directorio/'],
  ['grupo', 'El grupo', 'grupo/'],
];
const logo = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#06313a"/><circle cx="32" cy="32" r="23.5" fill="#22998f"/><circle cx="32" cy="32" r="14" fill="#2f6577" stroke="#e8b23a" stroke-width="2.5"/><circle cx="32" cy="32" r="7.5" fill="#05090a"/></svg>';

document.getElementById('site-header').innerHTML = `
  <div class="preview">Versión preliminar para revisión del grupo. No difundir.</div>
  <header class="site-header"><div class="container">
    <a class="brand" href="${root}">${logo}<span>GCEOT<small>Enfermedad ocular tiroidea · Profesionales</small></span></a>
    <nav class="nav" aria-label="Principal">
      ${NAV.map(([id, label, href]) => `<a href="${root}${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <button type="button" class="theme-btn" id="theme-btn"></button>
  </div></header>`;

document.getElementById('site-footer').innerHTML = `
  <footer class="site-footer"><div class="container">
    <p><strong>Grupo Colombiano de Enfermedad Ocular Tiroidea (GCEOT).</strong> Contenido para profesionales de la salud. Apoya la decisión clínica y no la sustituye. Este sitio no recoge ni envía datos.</p>
    <p>Financiación y conflictos de interés: ver <a href="${root}grupo/">El grupo</a>. Secretaría técnica: Festina Lente.</p>
    <p>Versión 0.3 · noviembre de 2026</p>
  </div></footer>`;

// Selector de tema: sistema → claro → oscuro.
const THEMES = ['system', 'light', 'dark'];
const THEME_LABEL = { system: 'del sistema', light: 'claro', dark: 'oscuro' };
const themeBtn = document.getElementById('theme-btn');
function paintTheme() {
  const t = window.eotTheme ? window.eotTheme.get() : 'system';
  themeBtn.textContent = `Tema: ${THEME_LABEL[t]}`;
  themeBtn.setAttribute('aria-label', `Tema actual: ${THEME_LABEL[t]}. Pulse para cambiar.`);
}
themeBtn.addEventListener('click', () => {
  const t = window.eotTheme.get();
  window.eotTheme.set(THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);
  paintTheme();
});
if (window.eotTheme) paintTheme(); else themeBtn.hidden = true;
