// Tema claro, oscuro o el del sistema. Se carga antes de los estilos para evitar parpadeos.
// Lo único que se recuerda, y solo en este dispositivo, es esta preferencia de apariencia.
(function () {
  var KEY = 'tema';
  function read() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'system'; } catch (e) { return 'system'; } }
  function apply(v) { if (v === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', v); }
  function write(v) { try { if (v === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento: vale solo para esta página */ } apply(v); }
  apply(read());
  window.eotTheme = { get: read, set: write };
})();
