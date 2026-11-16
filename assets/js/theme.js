// Tema claro, oscuro o el del sistema. Se carga antes de los estilos para evitar parpadeos.
// Lo único que se recuerda, y solo en este dispositivo, es esta preferencia de apariencia.
(function () {
  var KEY = 'tema';
  function read() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'system'; } catch (e) { return 'system'; } }
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function apply(v) {
    if (v === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', v);
    document.documentElement.setAttribute('data-resolved', v === 'system' ? (mq && mq.matches ? 'dark' : 'light') : v);
  }
  function write(v) { try { if (v === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento: vale solo para esta página */ } apply(v); }
  apply(read());
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { apply(read()); });
  window.eotTheme = { get: read, set: write };
})();
