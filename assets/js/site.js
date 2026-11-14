// Encabezado, navegación y pie comunes.
const root = document.body.dataset.root || './';
const page = document.body.dataset.page || '';
const NAV = [
  ['ruta', 'Ruta de tratamiento', 'ruta/'],
  ['herramientas', 'Herramientas', 'herramientas/'],
  ['evidencia', 'Evidencia', 'evidencia/'],
  ['estandares', 'Estándares', 'estandares/'],
  ['directorio', 'Directorio', 'directorio/'],
  ['grupo', 'El grupo', 'grupo/'],
];
const logo = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="var(--teal)"/><path d="M8 32c7-11 15-16 24-16s17 5 24 16c-7 11-15 16-24 16S15 43 8 32z" fill="none" stroke="var(--bg)" stroke-width="4"/><circle cx="32" cy="32" r="8" fill="var(--bg)"/></svg>';

document.getElementById('site-header').innerHTML = `
  <div class="preview">Versión preliminar para revisión del grupo. No difundir.</div>
  <header class="site-header"><div class="container">
    <a class="brand" href="${root}">${logo}<span>GCEOT<small>Enfermedad ocular tiroidea · Profesionales</small></span></a>
    <nav class="nav" aria-label="Principal">
      ${NAV.map(([id, label, href]) => `<a href="${root}${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
  </div></header>`;

document.getElementById('site-footer').innerHTML = `
  <footer class="site-footer"><div class="container">
    <p><strong>Grupo Colombiano de Enfermedad Ocular Tiroidea (GCEOT).</strong> Contenido para profesionales de la salud. Apoya la decisión clínica y no la sustituye. Este sitio no recoge ni almacena datos.</p>
    <p>Financiación y conflictos de interés: ver <a href="${root}grupo/">El grupo</a>. Secretaría técnica: Festina Lente.</p>
    <p>Versión 0.1 · noviembre de 2026</p>
  </div></footer>`;
