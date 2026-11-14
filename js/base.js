/* Lumos 1.0.0 · base: datos, fechas, colores, iconos, capas y animaciones */
'use strict';
const L = window.L = {};
L.VERSION = '1.0.0';
L.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', e => { L.rm = e.matches; });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
L.$ = $; L.$$ = $$; L.esc = esc;
L.id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
L.espera = ms => new Promise(r => setTimeout(r, ms));
L.raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

/* ============================== DATOS ============================== */
const CLAVE = 'lumos:datos';
L.vacio = () => ({
  perfil: null, emociones: [], animo: [], recursos: [], mananas: [], noches: [], momentos: [],
  personas: [], plan: { arriba: [], abajo: [], hago: [], avisar: true }, palabrasPropias: [], frasesPropias: []
});
L.cargar = () => {
  try { const t = localStorage.getItem(CLAVE); L.d = t ? Object.assign(L.vacio(), JSON.parse(t)) : L.vacio(); }
  catch (e) { L.d = L.vacio(); }
};
L.guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(L.d)); } catch (e) { L.toast('No se ha podido guardar: el móvil no tiene sitio.'); } };
L.borrarTodo = async () => {
  Object.keys(localStorage).filter(k => k.startsWith('lumos:')).forEach(k => localStorage.removeItem(k));
  await L.fotos.borrarTodo();
  L.d = L.vacio();
};

/* Fotos de los momentos, en IndexedDB (base «lumos:fotos») */
L.fotos = (() => {
  let db;
  const abrir = () => db ? Promise.resolve(db) : new Promise((ok, ko) => {
    const r = indexedDB.open('lumos:fotos', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('f');
    r.onsuccess = () => { db = r.result; ok(db); }; r.onerror = () => ko(r.error);
  });
  const op = (modo, fn) => abrir().then(d => new Promise((ok, ko) => {
    const tx = d.transaction('f', modo); const req = fn(tx.objectStore('f'));
    tx.oncomplete = () => ok(req && req.result); tx.onerror = () => ko(tx.error);
  }));
  return {
    poner: (id, dato) => op('readwrite', s => s.put(dato, id)),
    leer: id => op('readonly', s => s.get(id)).catch(() => null),
    quitar: id => op('readwrite', s => s.delete(id)).catch(() => null),
    borrarTodo: () => op('readwrite', s => s.clear()).catch(() => null)
  };
})();

/* ============================== FECHAS ============================== */
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
L.DIAS = DIAS; L.MESES = MESES;
const pad2 = n => String(n).padStart(2, '0');
L.iso = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
L.deIso = s => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
L.mas = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
L.hoy = () => L.iso();
L.difDias = (a, b) => Math.round((L.deIso(L.iso(b)) - L.deIso(L.iso(a))) / 864e5);
L.may = s => s.charAt(0).toUpperCase() + s.slice(1);
L.fechaLarga = d => L.may(`${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`);
L.fechaCorta = d => `${d.getDate()} de ${MESES[d.getMonth()]}`;
L.hora = ts => { const d = new Date(ts); return `${d.getHours()}:${pad2(d.getMinutes())}`; };
L.cuando = d => { // Hoy, Ayer, El miércoles, El 2 de noviembre
  const n = L.difDias(d, new Date());
  if (n === 0) return 'Hoy'; if (n === 1) return 'Ayer';
  if (n > 1 && n < 7) return 'El ' + DIAS[d.getDay()];
  return 'El ' + L.fechaCorta(d) + (d.getFullYear() !== new Date().getFullYear() ? ' de ' + d.getFullYear() : '');
};
L.saludo = () => { const h = new Date().getHours(); return h >= 6 && h < 14 ? 'Buenos días' : h >= 14 && h < 21 ? 'Buenas tardes' : 'Buenas noches'; };
L.franja = () => { const h = new Date().getHours(); return h >= 5 && h < 12 ? 'manana' : h >= 18 || h < 5 ? 'noche' : 'tarde'; };
L.num = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toString().replace('.', ',');
const NUMS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];
L.enLetra = n => NUMS[n] || String(n);

/* ============================== COLORES ============================== */
L.C = { ten: '#E9705E', ene: '#F2A65A', ale: '#F2CB6B', ver: '#B5CF8E', cal: '#86BFA9', baj: '#8DB2DA', lil: '#B3A3D9', ind: '#7C86C9', coral: '#E0613F', ink: '#2B2420' };
const SPEC = [L.C.ten, L.C.ene, L.C.ale, L.C.ver, L.C.cal, L.C.baj, L.C.lil];
const hx = c => { c = c.replace('#', ''); if (c.length === 3) c = [...c].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); };
L.hx = hx;
L.mezcla = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
L.rampa = t => { t = Math.max(0, Math.min(.9999, t)); const n = SPEC.length - 1, i = Math.floor(t * n); return L.mezcla(SPEC[i], SPEC[i + 1], t * n - i); };
L.osc = (c, t = .3) => L.mezcla(c, '#000000', t);
L.oscuro = () => document.documentElement.dataset.tema === 'oscuro';
L.textoDe = c => L.oscuro() ? L.mezcla(c, '#ffffff', .2) : L.osc(c, .38);
L.vars = c => {
  const [r, g, b] = hx(c), cl = hx(L.mezcla(c, '#ffffff', L.oscuro() ? .18 : .25));
  const a = L.oscuro() ? [1, .95, .55] : [1, .9, .5];
  return `--o0:rgba(${cl},${a[0]});--o1:rgba(${r},${g},${b},${a[1]});--o2:rgba(${r},${g},${b},${a[2]});--o3:rgba(${r},${g},${b},0)`;
};
L.orb = (c, d, st = '', cls = '') => `<i class="lm-orb ${cls}" data-c="${c}" style="${L.vars(c)};width:${d}px;height:${d}px;${st}"></i>`;
L.pt = (c, d = 30, st = '') => `<i class="lm-pt" data-c="${c}" style="${L.vars(c)};width:${d}px;height:${d}px;${st}"></i>`;
L.repintarOrbes = (r = document) => $$('.lm-orb[data-c],.lm-pt[data-c]', r).forEach(o => {
  const w = o.style.width, h = o.style.height, rest = o.style.cssText.replace(/--o\d:[^;]+;?/g, '');
  o.style.cssText = L.vars(o.dataset.c) + ';' + rest; o.style.width = w; o.style.height = h;
});

/* ============================== ICONOS ============================== */
const IC = {
  candado: '<rect x="5" y="10.5" width="14" height="9.5" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>', x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  lupa: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>', mas: '<path d="M12 5v14M5 12h14"/>', menos: '<path d="M5 12h14"/>',
  hoy: '<circle cx="12" cy="12" r="7.5"/><path d="M12 8v4l2.5 2"/>', animo: '<path d="M3 13c3-7 5-7 8 0s5 7 8 0"/>',
  recursos: '<path d="M12 20s-7-4.3-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.7 12 20 12 20z"/>',
  patrones: '<rect x="4" y="4" width="6" height="6" rx="3"/><rect x="14" y="4" width="6" height="6" rx="3"/><rect x="4" y="14" width="6" height="6" rx="3"/><rect x="14" y="14" width="6" height="6" rx="3"/>',
  flecha: '<path d="M9 6l6 6-6 6"/>', atras: '<path d="M15 6l-6 6 6 6"/>', luna: '<path d="M18 14.5A7 7 0 0 1 9.5 6a7 7 0 1 0 8.5 8.5z"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  telefono: '<path d="M7 4h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 5 6a2 2 0 0 1 2-2z"/>',
  ajustes: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', foto: '<rect x="4" y="6" width="16" height="13" rx="3"/><circle cx="12" cy="12.5" r="3.2"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  pastilla: '<rect x="3" y="9" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.5 8.5l5 7"/>',
  cama: '<path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>', persona: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  editar: '<path d="M5 19l1-4L16 5l3 3L9 18z"/>', borrar: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>', tarro: '<path d="M8 4h8M7 7h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z"/>',
  libro: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19v3H7.5"/>',
  mano: '<path d="M12 21c-4.5-2.5-8-6-8-10a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 4-3.5 7.5-8 10z"/><path d="M8.5 11.5h7"/>',
  calendario: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>', paleta: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" stroke="none"/>',
  palabra: '<path d="M5 18h14M7 14l5-10 5 10M9 10h6"/>', salir: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
  info: '<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8v.5"/>', escala: '<path d="M4 18h16M7 15V9M12 15V5M17 15v-4"/>',
  mensaje: '<path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3V6a1 1 0 0 1 1-1z"/>', frase: '<path d="M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6"/>'
};
L.ic = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ============================== PIEZAS ============================== */
L.sw = (on, a = '') => `<button class="lm-sw tq tq-i ${on ? 'lm-on' : ''}" ${a} role="switch" aria-checked="${!!on}"><i></i></button>`;
L.chips = (lista, sel = [], a = 'chip', extra = '') => `<div class="lm-chips" ${extra}>` + lista.map(n => `<button class="lm-chip tq tq-i ${sel.includes(n) ? 'lm-si' : ''}" data-a="${a}" data-v="${esc(n)}">${esc(n)}</button>`).join('') + '</div>';
L.top = (izq, tit = '', der) => `<div class="lm-top">${izq ? `<button class="lm-rb tq tq-i" data-a="${izq === 'x' ? 'cerrar' : izq === 'atras' ? 'atras' : izq}" aria-label="${izq === 'x' ? 'Cerrar' : 'Volver'}">${L.ic(izq === 'x' ? 'x' : 'atras', 20)}</button>` : '<span class="lm-rb lm-vacio"></span>'}<span class="lm-tq">${esc(tit)}</span>${der ? `<button class="lm-rb tq tq-i" data-a="${der[0]}" aria-label="${der[2] || ''}">${L.ic(der[1], 20)}</button>` : '<span class="lm-rb lm-vacio"></span>'}</div><div class="lm-topfade"></div>`;
L.li = (marca, t, s = '', a = '', cls = 'lm-card', der = L.ic('flecha', 18)) => `<${a ? 'button' : 'div'} class="lm-li ${cls} ${a ? 'tq tq-g' : ''}" ${a} style="width:100%;text-align:left">${marca}<div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div>${der ? `<span class="lm-fl">${der}</span>` : ''}</${a ? 'button' : 'div'}>`;

/* ============================== TOQUE ============================== */
(() => {
  let act = null;
  const sol = () => { if (act) { act.classList.remove('lm-pul'); act = null; } };
  document.addEventListener('pointerdown', e => { const t = e.target.closest('.tq'); if (!t) return; act = t; t.classList.add('lm-pul'); }, { passive: true });
  document.addEventListener('pointerup', sol, { passive: true });
  document.addEventListener('pointercancel', sol, { passive: true });
  document.addEventListener('pointermove', e => { if (act && (Math.abs(e.movementX) + Math.abs(e.movementY) > 6)) sol(); }, { passive: true });
})();

/* ============================== ANIMACIONES ============================== */
L.E = 'cubic-bezier(.2,0,0,1)'; L.M = 'cubic-bezier(.3,1.2,.4,1)'; L.S = 'cubic-bezier(.4,0,1,1)';
L.anim = (el, kf, o) => {
  if (!el) return Promise.resolve();
  if (L.rm && !o.forzar) {
    const fin = kf[kf.length - 1]; const op = fin.opacity ?? 1; const ini = kf[0].opacity ?? op;
    if (ini === op) { return Promise.resolve(); }
    kf = [{ opacity: ini }, { opacity: op }]; o = { ...o, duration: 150, easing: 'linear', delay: Math.min(o.delay || 0, 100) };
  }
  const a = el.animate(kf, { fill: 'both', ...o });
  return a.finished.then(() => { try { a.commitStyles(); } catch (e) { } a.cancel(); }).catch(() => { });
};
/* entrada escalonada: bloques [data-e] */
L.entrar = (raiz, retraso = 0, paso = 62) => {
  const els = $$('[data-e]', raiz);
  els.forEach((el, i) => {
    const pequeno = el.dataset.e === 'p';
    const d = retraso + Math.min(i, 6) * paso;
    if (L.rm) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, delay: Math.min(d, 120), fill: 'backwards' }); return; }
    el.animate(pequeno ? [{ opacity: 0, scale: .86 }, { opacity: 1, scale: 1 }] : [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }],
      { duration: pequeno ? 480 : 460, delay: d, easing: pequeno ? L.M : L.E, fill: 'backwards' });
  });
};
/* número o texto que cambia: el viejo sube y se va, el nuevo llega de abajo */
L.rodar = (el, nuevo, sube = true, dl = 0) => {
  nuevo = String(nuevo); if (!el) return;
  const viejo = el.dataset.v ?? el.textContent; if (viejo === nuevo) return; el.dataset.v = nuevo;
  if (L.rm) { el.textContent = nuevo; return; }
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.innerHTML = `<span style="position:absolute;left:0;right:0;top:0">${esc(viejo)}</span><span style="display:inline-block">${esc(nuevo)}</span>`;
  const [v, n] = el.children, dy = sube ? -7 : 7;
  v.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `0 ${dy}px` }], { duration: 130, delay: dl, easing: L.S, fill: 'both' }).finished.then(() => v.remove()).catch(() => { });
  n.animate([{ opacity: 0, translate: `0 ${-dy}px` }, { opacity: 1, translate: '0 0' }], { duration: 260, delay: dl + 50, easing: L.E, fill: 'backwards' });
};
/* mancha que se desliza en un segmentado */
L.mancha = (cont, instant) => {
  let m = $('.lm-mancha', cont); if (!m) { m = document.createElement('i'); m.className = 'lm-mancha'; cont.prepend(m); }
  const on = $('.lm-on', cont); if (!on) return;
  if (instant) m.style.transition = 'none';
  m.style.left = on.offsetLeft + 'px'; m.style.width = on.offsetWidth + 'px';
  if (instant) { m.offsetWidth; m.style.transition = ''; }
};
L.segmentado = (opciones, actual, a) => `<div class="lm-seg" data-seg>${opciones.map(o => `<span class="tq tq-i ${o === actual ? 'lm-on' : ''}" data-a="${a}" data-v="${esc(o)}">${esc(o)}</span>`).join('')}</div>`;
L.elegirSeg = (span) => { const c = span.parentElement; $$('span', c).forEach(s => s.classList.toggle('lm-on', s === span)); L.mancha(c); };

/* ============================== CAPAS ============================== */
L.capas = [];
L.pantallas = {};
let zCapa = 100;
/* modo: 'lado' (entra desde la derecha, se vuelve deslizando), 'sube' (pantalla completa que sube), 'fundido' */
L.abrir = async (nombre, opts = {}, modo = 'lado') => {
  const app = $('#lm-app');
  const el = document.createElement('section');
  el.className = 'lm-capa'; el.style.zIndex = ++zCapa; el.dataset.modo = modo; el.dataset.nombre = nombre;
  if (opts.flujo) el.dataset.flujo = opts.flujo;
  const debEl = L.capas[L.capas.length - 1]?.el || $('#lm-raiz') || $('#lm-bienvenida');
  app.appendChild(el);
  const capa = { el, nombre, opts, modo };
  L.capas.push(capa);
  L.pantallas[nombre](el, opts, capa);
  conectar(el, capa);
  L.barra(false);
  if (modo === 'lado') {
    const v = document.createElement('div'); v.className = 'lm-velo'; v.style.zIndex = 60; debEl.appendChild(v); capa.veloDebajo = v;
    requestAnimationFrame(() => v.style.opacity = .6);
    L.anim(debEl, [{ translate: '0 0' }, { translate: '-28% 0' }], { duration: 520, easing: L.E });
    await L.anim(el, [{ translate: '100% 0' }, { translate: '0 0' }], { duration: 520, easing: L.E });
  } else if (modo === 'sube') {
    await L.anim(el, [{ translate: '0 100%' }, { translate: '0 0' }], { duration: 620, easing: L.E });
  } else {
    await L.anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: L.E });
  }
  if (L.capas.includes(capa)) debEl.classList.add('lm-debajo');
  return capa;
};
L.cerrar = async (capa, sinAnim) => {
  capa = capa || L.capas[L.capas.length - 1]; if (!capa) return;
  const i = L.capas.indexOf(capa); if (i < 0) return;
  L.capas.splice(i, 1);
  const debajo = L.capas[i - 1] || null;
  const debEl = debajo ? debajo.el : ($('#lm-raiz') || $('#lm-bienvenida'));
  debEl.classList.remove('lm-debajo');
  capa.alCerrar?.();
  if (!L.capas.length) L.barra(true);
  if (!sinAnim) {
    if (capa.modo === 'lado') {
      if (capa.veloDebajo) capa.veloDebajo.style.opacity = 0;
      L.anim(debEl, [{ translate: getComputedStyle(debEl).translate === 'none' ? '-28% 0' : getComputedStyle(debEl).translate }, { translate: '0 0' }], { duration: 420, easing: L.E });
      await L.anim(capa.el, [{ translate: getComputedStyle(capa.el).translate === 'none' ? '0 0' : getComputedStyle(capa.el).translate }, { translate: '100% 0' }], { duration: 380, easing: 'cubic-bezier(.4,0,.6,1)' });
    } else if (capa.modo === 'sube') {
      await L.anim(capa.el, [{ translate: '0 0' }, { translate: '0 100%' }], { duration: 460, easing: 'cubic-bezier(.4,0,.6,1)' });
    } else {
      await L.anim(capa.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: L.S });
    }
  }
  capa.veloDebajo?.remove();
  debEl.style.translate = '';
  capa.el.remove();
  debajo?.refrescar?.();
  if (!debajo) L.refrescarRaiz();
};
/* cierra todas las capas de un flujo (el registro de una emoción, por ejemplo) */
L.cerrarFlujo = async flujo => {
  const del = L.capas.filter(c => c.opts.flujo === flujo); if (!del.length) return;
  const arriba = del[del.length - 1];
  del.slice(0, -1).forEach(c => { c.el.style.visibility = 'hidden'; });
  await L.cerrar(arriba);
  for (const c of del.slice(0, -1)) await L.cerrar(c, true);
};
L.cerrarTodo = async () => { while (L.capas.length) await L.cerrar(L.capas[L.capas.length - 1], L.capas.length > 1); };
L.arriba = () => L.capas[L.capas.length - 1];

/* acciones con data-a dentro de cada capa */
function conectar(el, capa) {
  el.addEventListener('click', e => {
    const t = e.target.closest('[data-a]'); if (!t || !el.contains(t)) return;
    const a = t.dataset.a;
    if ((a === 'cerrar' || a === 'atras') && capa.acc?.[a]) { capa.acc[a](t, e); return; }
    if (a === 'cerrar') { capa.opts.flujo ? L.cerrarFlujo(capa.opts.flujo) : L.cerrar(capa); return; }
    if (a === 'atras') { L.cerrar(capa); return; }
    capa.acc?.[a]?.(t, e);
  });
  /* fundido de la cabecera al desplazar */
  const sc = $('.lm-scroll', el), tf = $('.lm-topfade', el);
  if (sc && tf) sc.addEventListener('scroll', () => tf.classList.toggle('lm-ver', sc.scrollTop > 12), { passive: true });
  /* volver deslizando desde el borde izquierdo */
  if (capa.modo === 'lado') bordeAtras(el, capa);
}
function bordeAtras(el, capa) {
  let x0 = null, y0, dx = 0, w, activo = false;
  el.addEventListener('touchstart', e => {
    const t = e.touches[0]; if (t.clientX > 24) return;
    x0 = t.clientX; y0 = t.clientY; dx = 0; w = el.offsetWidth; activo = false;
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    if (x0 === null) return; const t = e.touches[0]; dx = Math.max(0, t.clientX - x0);
    if (!activo && Math.abs(t.clientY - y0) > Math.abs(dx)) { x0 = null; return; }
    activo = true; el.style.translate = dx + 'px 0';
    const deb = L.capas[L.capas.indexOf(capa) - 1]?.el || $('#lm-raiz') || $('#lm-bienvenida');
    deb.style.translate = (-28 + 28 * dx / w) + '% 0';
    if (capa.veloDebajo) { capa.veloDebajo.style.transition = 'none'; capa.veloDebajo.style.opacity = .6 * (1 - dx / w); }
  }, { passive: true });
  el.addEventListener('touchend', () => {
    if (x0 === null || !activo) { x0 = null; return; } x0 = null;
    if (capa.veloDebajo) capa.veloDebajo.style.transition = '';
    if (dx > w * .3) L.cerrar(capa);
    else {
      const deb = L.capas[L.capas.indexOf(capa) - 1]?.el || $('#lm-raiz') || $('#lm-bienvenida');
      L.anim(el, [{ translate: dx + 'px 0' }, { translate: '0 0' }], { duration: 300, easing: L.E }).then(() => el.style.translate = '');
      L.anim(deb, [{ translate: deb.style.translate }, { translate: '-28% 0' }], { duration: 300, easing: L.E });
      if (capa.veloDebajo) capa.veloDebajo.style.opacity = .6;
    }
  });
}

/* ============================== HOJA ============================== */
L.hoja = (html, acc = {}, alCerrar) => {
  const capa = document.createElement('div'); capa.className = 'lm-hoja-capa';
  capa.innerHTML = `<div class="lm-velo"></div><div class="lm-hoja" role="dialog"><div class="lm-asa"></div>${html}</div>`;
  $('#lm-app').appendChild(capa);
  const velo = $('.lm-velo', capa), hoja = $('.lm-hoja', capa);
  velo.style.pointerEvents = 'auto';
  requestAnimationFrame(() => requestAnimationFrame(() => { velo.style.opacity = 1; hoja.classList.add('lm-ver'); }));
  $$('[data-e]', hoja).forEach((el, i) => el.animate([{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: L.rm ? 150 : 380, delay: 200 + Math.min(i, 6) * 60, easing: L.E, fill: 'backwards' }));
  let cerrada = false;
  const cerrar = async () => {
    if (cerrada) return; cerrada = true;
    hoja.classList.add('lm-sale'); hoja.classList.remove('lm-ver'); velo.style.transition = 'opacity .38s'; velo.style.opacity = 0;
    await L.espera(L.rm ? 160 : 430); capa.remove(); alCerrar?.();
  };
  velo.addEventListener('click', cerrar);
  capa.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (!t) return; if (t.dataset.a === 'cerrar') return cerrar(); acc[t.dataset.a]?.(t, e, cerrar); });
  /* arrastrar el asa hacia abajo */
  let y0 = null, dy = 0;
  hoja.addEventListener('touchstart', e => { if (hoja.scrollTop > 0) return; y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
  hoja.addEventListener('touchmove', e => { if (y0 === null) return; dy = Math.max(0, e.touches[0].clientY - y0); if (dy > 4) { hoja.style.transition = 'none'; hoja.style.translate = `0 ${dy}px`; } }, { passive: true });
  hoja.addEventListener('touchend', () => { if (y0 === null) return; y0 = null; hoja.style.transition = ''; if (dy > 110) { hoja.style.translate = ''; cerrar(); } else hoja.style.translate = ''; });
  return { el: hoja, cerrar };
};
L.confirmar = (titulo, texto, boton, fn, coral = true) => L.hoja(`<h2 data-e>${esc(titulo)}</h2><p class="lm-sub" data-e style="margin-bottom:22px">${esc(texto)}</p>
  <button class="lm-btn tq tq-g ${coral ? 'lm-coral' : ''}" data-a="si" data-e>${esc(boton)}</button><button class="lm-enlace tq" data-a="cerrar" data-e>Cancelar</button>`,
  { si: (t, e, c) => { c(); fn(); } });

/* ============================== AVISO ============================== */
L.toast = (texto, deshacer) => {
  $$('.lm-toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'lm-toast';
  t.innerHTML = `<span>${esc(texto)}</span>${deshacer ? '<b class="tq" role="button">Deshacer</b>' : ''}`;
  $('#lm-app').appendChild(t);
  L.anim(t, [{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }], { duration: 420, easing: L.E });
  let fuera = false;
  const quitar = async () => { if (fuera) return; fuera = true; await L.anim(t, [{ opacity: 1 }, { opacity: 0, translate: '0 10px' }], { duration: 260, easing: L.S }); t.remove(); };
  if (deshacer) $('b', t).addEventListener('click', () => { deshacer(); quitar(); });
  setTimeout(quitar, deshacer ? 5200 : 2600);
};

/* ============================== VIBRACIÓN LIGERA (si existe) ============================== */
L.vibra = (ms = 8) => { try { navigator.vibrate?.(ms); } catch (e) { } };
