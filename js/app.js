/* Lumos 1.0.0 · arranque, pestañas y tema */
'use strict';
L.TABS = [['hoy', 'Hoy'], ['animo', 'Ánimo'], ['recursos', 'Recursos'], ['patrones', 'Patrones']];
L.vistas = {};      /* render de cada pestaña: (el, {primera}) => acciones */
L.tabActual = 'hoy';

/* ============================== TEMA ============================== */
const mqOsc = matchMedia('(prefers-color-scheme: dark)');
L.aplicarTema = () => {
  const pref = L.d?.perfil?.tema || 'auto';
  const t = pref === 'auto' ? (mqOsc.matches ? 'oscuro' : 'claro') : pref;
  const antes = document.documentElement.dataset.tema;
  document.documentElement.dataset.tema = t;
  const bg = t === 'oscuro' ? '#17120F' : '#F4EEE4';
  $$('meta[name="theme-color"]').forEach(m => m.setAttribute('content', bg));
  if (antes && antes !== t) { L.repintarOrbes(); L.refrescarRaiz(); L.capas.forEach(c => c.refrescar?.()); }
};
mqOsc.addEventListener?.('change', L.aplicarTema);

/* ============================== RAÍZ Y PESTAÑAS ============================== */
L.montarRaiz = () => {
  const app = $('#lm-app');
  $$('#lm-raiz,.lm-barra', app).forEach(e => e.remove());
  const raiz = document.createElement('section'); raiz.id = 'lm-raiz'; raiz.className = 'lm-capa'; raiz.style.zIndex = 10;
  raiz.innerHTML = '<div class="lm-scroll" id="lm-vista"></div>';
  app.appendChild(raiz);
  const barra = document.createElement('nav'); barra.className = 'lm-barra'; barra.setAttribute('aria-label', 'Secciones');
  app.appendChild(barra);
  L.pintarBarra(true);
  raiz.addEventListener('click', e => {
    const t = e.target.closest('[data-a]'); if (!t) return;
    L.accRaiz?.[t.dataset.a]?.(t, e);
  });
  L.tab(L.tabActual, true);
};
L.pintarBarra = (instant) => {
  const barra = $('.lm-barra'); if (!barra) return;
  const tabs = L.TABS.filter(([k]) => k !== 'animo' || L.d.perfil?.escala !== false);
  if (!tabs.find(([k]) => k === L.tabActual)) L.tabActual = 'hoy';
  barra.innerHTML = '<i class="lm-mancha"></i>' + tabs.map(([k, n]) => `<button class="lm-tab tq tq-i ${k === L.tabActual ? 'lm-on' : ''}" data-tab="${k}" aria-label="${n}">${L.ic(k, 21)}<b>${n}</b></button>`).join('');
  $$('.lm-tab', barra).forEach(b => b.addEventListener('click', () => L.tab(b.dataset.tab)));
  requestAnimationFrame(() => L.moverMancha(true));
};
L.moverMancha = (instant) => {
  const barra = $('.lm-barra'), m = $('.lm-mancha', barra), on = $('.lm-tab.lm-on', barra); if (!on) return;
  if (instant) { m.classList.add('lm-sintr'); $$('.lm-tab', barra).forEach(t => t.classList.add('lm-sintr')); }
  m.style.left = on.offsetLeft + 'px'; m.style.width = on.offsetWidth + 'px';
  if (instant) { m.offsetWidth; m.classList.remove('lm-sintr'); $$('.lm-tab', barra).forEach(t => t.classList.remove('lm-sintr')); }
};
L.tab = async (k, primera) => {
  const barra = $('.lm-barra'), vista = $('#lm-vista');
  if (!primera && k === L.tabActual) { vista.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const vieja = L.tabActual; L.tabActual = k;
  /* la mancha: medir el destino sin transiciones, restaurar y animar */
  const tabs = $$('.lm-tab', barra), m = $('.lm-mancha', barra);
  if (!primera && m) {
    const desde = { l: m.style.left, w: m.style.width };
    tabs.forEach(t => { t.classList.add('lm-sintr'); t.classList.toggle('lm-on', t.dataset.tab === k); });
    const on = $('.lm-tab.lm-on', barra); const dest = { l: on.offsetLeft, w: on.offsetWidth };
    tabs.forEach(t => t.classList.toggle('lm-on', t.dataset.tab === vieja));
    barra.offsetWidth; tabs.forEach(t => t.classList.remove('lm-sintr'));
    requestAnimationFrame(() => { tabs.forEach(t => t.classList.toggle('lm-on', t.dataset.tab === k)); m.style.left = dest.l + 'px'; m.style.width = dest.w + 'px'; });
  } else tabs.forEach(t => t.classList.toggle('lm-on', t.dataset.tab === k));
  if (!primera) await L.anim(vista, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 -6px' }], { duration: 200, easing: L.S });
  vista.scrollTop = 0;
  L.pintarVista(true, primera ? 0 : 160);
  vista.style.opacity = ''; vista.style.translate = '';
};
/* pinta la pestaña actual; con entrada solo al llegar, no al refrescar */
L.pintarVista = (conEntrada, retraso = 0) => {
  const vista = $('#lm-vista'); if (!vista) return;
  const top = vista.scrollTop;
  L.accRaiz = L.vistas[L.tabActual](vista, { primera: conEntrada }) || {};
  if (conEntrada) L.entrar(vista, retraso); else vista.scrollTop = top;
};
L.refrescarRaiz = () => { if ($('#lm-vista')) L.pintarVista(false); };
L.barra = v => $('.lm-barra')?.classList.toggle('lm-oculta', !v);

/* ============================== ARRANQUE ============================== */
L.iniciar = async () => {
  L.cargar(); L.aplicarTema();
  const app = $('#lm-app');
  const p = L.d.perfil;
  if (!p) { L.montarBienvenida(); }
  else if (p.codigo) { L.montarRaiz(); L.barra(false); L.abrir('codigo', { modo: 'entrar' }, 'fundido'); }
  else { L.montarRaiz(); L.alEntrar(); }
  requestAnimationFrame(() => app.classList.add('lm-listo'));
};
/* después de entrar: «Hola de nuevo» si han pasado 7 días o más */
L.alEntrar = () => {
  const p = L.d.perfil, ult = p.ultimaVisita ? new Date(p.ultimaVisita) : null;
  const dias = ult ? L.difDias(ult, new Date()) : 0;
  p.ultimaVisita = Date.now(); L.guardar();
  if (dias >= 7) L.abrir('holaDeNuevo', { dias }, 'fundido');
};
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && L.d?.perfil) { L.refrescarRaiz(); } });

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => { });
}
window.addEventListener('DOMContentLoaded', L.iniciar);
