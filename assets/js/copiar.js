// Botón "Copiar para la historia clínica". Solo copia al portapapeles; no guarda ni envía nada.
export function copyButton(getText) {
  const wrap = document.createElement('div');
  wrap.className = 'copy-row no-print';
  wrap.innerHTML = '<button type="button" class="btn btn-ghost copy-btn">Copiar para la historia clínica</button><span class="copy-msg" role="status" aria-live="polite"></span>';
  const btn = wrap.querySelector('button'), msg = wrap.querySelector('.copy-msg');
  btn.addEventListener('click', async () => {
    const text = getText();
    if (!text) return;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
    }
    msg.textContent = ok ? 'Copiado. Péguelo en la historia y ajústelo a su paciente.' : 'No se pudo copiar. Seleccione el texto y cópielo manualmente.';
    if (!ok) { const pre = document.createElement('pre'); pre.className = 'copy-fallback'; pre.textContent = text; wrap.appendChild(pre); }
  });
  return { el: wrap, reset() { msg.textContent = ''; wrap.querySelectorAll('.copy-fallback').forEach((n) => n.remove()); } };
}
