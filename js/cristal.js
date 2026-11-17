/* Lumos 1.4.3 · cristal líquido
   Barra de pestañas, selectores, interruptores, escala del ánimo y deslizador de sueño con una lente
   de cristal transparente que se arrastra (sin copias del contenido, para que en Safari se vea siempre
   lo de verdad); botones redondos y hojas de cristal que se hinchan, se inclinan y
   vuelven con muelle. Versión propia en JavaScript, a partir de la técnica de
   @zakisheriff/liquid-glass (licencia MIT, Copyright (c) 2026 Zaki Sheriff).
   Con «Reducir movimiento» se queda el aspecto de cristal sin lentes ni temblores. */
(() => {
const D = document;

/* ---------- muelles (forma cerrada, como el original) ---------- */
const desde = (resp, z) => { const k = (2 * Math.PI / resp) ** 2; return { k, c: 2 * z * Math.sqrt(k) }; };
const muelles = new Set(); let raf = 0, last = 0;
const bucle = t => {
  const dt = Math.min(.032, (t - last) / 1000 || .016); last = t;
  muelles.forEach(s => {
    const x = s.v - s.t, k = s.k, c = s.c, n = 4, h = dt / n; let p = x, vel = s.vel;
    for (let i = 0; i < n; i++) { const a = -k * p - c * vel; vel += a * h; p += vel * h; }
    s.v = s.t + p; s.vel = vel; s.on(s.v, s.vel);
    if (Math.abs(p) < .01 && Math.abs(vel) < .1) { s.v = s.t; s.vel = 0; s.on(s.v, 0); muelles.delete(s); const f = s.fin; s.fin = null; f?.(); }
  });
  raf = muelles.size ? requestAnimationFrame(bucle) : 0;
};
const muelle = (v, cfg, on) => {
  const s = { v, t: v, vel: 0, ...cfg, on, set(t, inst) { this.t = t; if (inst) { this.v = t; this.vel = 0; this.on(t, 0); return; } muelles.add(this); if (!raf) { last = performance.now(); raf = requestAnimationFrame(bucle); } }, tune(c) { this.k = c.k; this.c = c.c; }, kick(v) { this.vel += v; this.set(this.t); } };
  return s;
};
const SIGUE = desde(.2, .82), TEMBLOR = desde(.32, .3), SUBE = desde(.26, .62), BAJA = desde(.34, .9), HINCHA = desde(.3, .45), HOJA = desde(.42, .62);
const RIM = '<div class="lm-cr-tint"></div><div class="lm-cr-rim"></div>';

/* ---------- lente arrastrable sobre una fila de opciones ---------- */
const pista = (cont, sel, opt) => {
  let lente = null, gesto = null, sup = false, deja = false;
  const items = () => [...cont.querySelectorAll(sel)];
  const cx = el => el.offsetLeft + el.offsetWidth / 2;
  const S = { x: 0, lift: 0, sx: 1, swell: 0, w: 0 };
  let W = 0, H = 0, top = 0;
  const pinta = () => {
    if (!lente) return;
    const s = .9 + .1 * S.lift, sx = S.sx, sy = 1 / Math.sqrt(sx), w = Math.max(H * 1.1, S.w);
    lente.el.style.width = w + 'px';
    lente.el.style.transform = `translate(${S.x - w / 2}px,${top}px) scale(${s * sx},${s * sy})`;
    lente.el.style.opacity = Math.min(1, S.lift * 1.5);
    const m = cont.querySelector(':scope > .lm-mancha'); if (m) m.style.opacity = Math.max(0, 1 - S.lift * 1.6);
    cont.style.scale = opt.swell ? `${1 + S.swell * opt.swell} ${1 + S.swell * opt.swell * .6}` : '';
  };
  const mx = muelle(0, SIGUE, v => { S.x = v; pinta(); });
  const ml = muelle(0, SUBE, v => { S.lift = v; pinta(); });
  const ms = muelle(1, TEMBLOR, v => { S.sx = v; pinta(); });
  const mw = muelle(0, HINCHA, v => { S.swell = v; pinta(); });
  const mW = muelle(0, SIGUE, v => { S.w = v; pinta(); });
  const anchoDe = it => it.offsetWidth + opt.spread;
  const crear = it => {
    H = Math.round(it.offsetHeight + opt.over * 2); top = it.offsetTop - opt.over;
    const el = D.createElement('div'); el.className = 'lm-cr-lens'; el.style.height = H + 'px'; el.style.left = '0px'; el.style.top = '0px'; el.style.transformOrigin = '50% 50%';
    el.innerHTML = '<div class="lm-cr-tint"></div><div class="lm-cr-rim"></div>'; cont.appendChild(el);
    lente = { el }; mW.set(anchoDe(it), true);
  };
  const quitar = () => { lente?.el.remove(); lente = null; const m = cont.querySelector(':scope > .lm-mancha'); if (m) m.style.opacity = ''; cont.style.scale = ''; };
  const masCerca = x => { let b = null, d = 1e9; items().forEach(i => { const dd = Math.abs(cx(i) - x); if (dd < d) { d = dd; b = i; } }); return b; };
  const xLocal = e => { const r = cont.getBoundingClientRect(); return (e.clientX - r.left) / (r.width / cont.offsetWidth); };
  cont.addEventListener('pointerdown', e => {
    const it = e.target.closest(sel); if (!it || !cont.contains(it)) return;
    e.preventDefault();
    const on = cont.querySelector(sel + '.lm-on') || it;
    if (!lente) { crear(on); mx.set(cx(on), true); }
    gesto = { id: e.pointerId, x0: xLocal(e), a: S.x, lx: xLocal(e), t: performance.now(), movido: false, desde: on, item: it };
    cont.setPointerCapture?.(e.pointerId);
    ml.tune(SUBE); ml.set(1); mw.set(1);
    if (it !== on) { mx.tune(SIGUE); mx.set(cx(it)); mW.set(anchoDe(it)); }
  }, true);
  cont.addEventListener('pointermove', e => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const x = xLocal(e), now = performance.now(), dt = Math.max(1, now - gesto.t) / 1000, v = (x - gesto.lx) / dt; gesto.lx = x; gesto.t = now;
    if (Math.abs(x - gesto.x0) > 4) gesto.movido = true;
    const minX = cx(items()[0]), maxX = cx(items().at(-1));
    let tx = gesto.a + (x - gesto.x0); if (tx < minX) tx = minX - Math.sqrt(minX - tx) * 3; if (tx > maxX) tx = maxX + Math.sqrt(tx - maxX) * 3;
    mx.tune(SIGUE); mx.set(tx); mW.set(anchoDe(masCerca(tx)));
    ms.tune(TEMBLOR); ms.set(1 + Math.min(.22, Math.abs(v) / 5200));
  }, true);
  const soltar = e => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const g = gesto; gesto = null; sup = true; setTimeout(() => sup = false, 60);
    const dest = g.movido ? masCerca(S.x) : g.item;
    mw.set(0); ms.tune(TEMBLOR); ms.set(1); ms.kick(1.6);
    if (dest && !dest.classList.contains('lm-on')) { deja = true; opt.elegir(dest); deja = false; }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const d2 = dest && dest.isConnected ? dest : cont.querySelector(sel + '.lm-on');
      mx.tune(TEMBLOR); mx.set(cx(d2)); mW.set(anchoDe(d2)); setTimeout(() => { if (lente && d2.isConnected) { mx.set(cx(d2)); mW.set(anchoDe(d2)); } }, 380);
      setTimeout(() => { if (gesto) return; ml.tune(BAJA); ml.set(0); ml.fin = () => { if (!gesto && S.lift < .02) quitar(); ml.fin = null; }; }, 260);
    }));
  };
  cont.addEventListener('pointerup', soltar, true); cont.addEventListener('pointercancel', soltar, true);
  cont.addEventListener('click', e => { if (!deja && (sup || gesto)) { e.stopPropagation(); e.preventDefault(); } }, true);
};

/* ---------- interruptor: la bola se levanta como una lente ---------- */
const interruptor = sw => {
  const i = sw.querySelector('i'); let sx = 1, sy = 1, lift = 0;
  const pinta = () => { i.style.scale = `${sx} ${sy}`; };
  const mx = muelle(1, HINCHA, v => { sx = v; pinta(); }), my = muelle(1, HINCHA, v => { sy = v; pinta(); });
  sw.addEventListener('pointerdown', () => { i.classList.add('lm-cr-up'); mx.tune(SUBE); my.tune(SUBE); mx.set(1.55); my.set(1.32); }, true);
  const up = () => { mx.tune(TEMBLOR); my.tune(TEMBLOR); mx.set(1.3); my.set(1.18); setTimeout(() => { mx.tune(BAJA); my.tune(BAJA); mx.set(1); my.set(1); mx.kick(-1.2); setTimeout(() => i.classList.remove('lm-cr-up'), 160); }, 320); };
  sw.addEventListener('pointerup', up, true); sw.addEventListener('pointercancel', up, true);
};


/* ---------- 1. botones de cristal: se hinchan, se inclinan hacia el dedo y tiemblan al soltar ---------- */
const boton = b => {
  let sx = 1, sy = 1, tx = 0, ty = 0, g = null;
  const pinta = () => { b.style.scale = `${sx} ${sy}`; b.style.translate = `${tx}px ${ty}px`; };
  const ms = muelle(1, HINCHA, v => { sx = v * (1 + (Math.abs(tx) - Math.abs(ty)) * .006); sy = v * (1 + (Math.abs(ty) - Math.abs(tx)) * .006); pinta(); });
  const mx = muelle(0, SIGUE, v => { tx = v; pinta(); }), my = muelle(0, SIGUE, v => { ty = v; pinta(); });
  b.addEventListener('pointerdown', e => { g = { x: e.clientX, y: e.clientY }; ms.tune(SUBE); ms.set(1.14); b.classList.remove('tq'); }, true);
  b.addEventListener('pointermove', e => { if (!g) return; const r = b.getBoundingClientRect(); const dx = (e.clientX - g.x) / (r.width / b.offsetWidth), dy = (e.clientY - g.y) / (r.height / b.offsetHeight); mx.set(Math.tanh(dx / 30) * 7); my.set(Math.tanh(dy / 30) * 7); }, true);
  const up = () => { if (!g) return; g = null; ms.tune(TEMBLOR); ms.set(1); ms.kick(-2.4); mx.tune(TEMBLOR); my.tune(TEMBLOR); mx.set(0); my.set(0); };
  b.addEventListener('pointerup', up, true); b.addEventListener('pointercancel', up, true); b.addEventListener('pointerleave', up, true);
};

/* ---------- 2. hojas de cristal: se arrastran y vuelven con muelle; bajándolas con fuerza se cierran ---------- */
const hoja = h => {
  let g = null, y = 0;
  const velo = () => h.parentElement?.querySelector('.lm-velo');
  const my = muelle(0, HOJA, v => { y = v; h.style.translate = `0 ${v}px`; const ve = velo(); if (ve) ve.style.opacity = Math.max(0, Math.min(1, 1 - v / 520)); });
  const larga = () => h.scrollHeight > h.clientHeight + 2;
  h.style.touchAction = larga() ? '' : 'none';
  h.addEventListener('pointerdown', e => { if (h.scrollTop > 0 || e.target.closest('input,textarea,button,select,.lm-chips')) return; if (larga() && e.clientY - h.getBoundingClientRect().top > 44) return; g = { y0: e.clientY, a: y, ly: e.clientY, t: performance.now(), v: 0 }; }, true);
  h.addEventListener('pointermove', e => { if (!g) return; let d = e.clientY - g.y0 + g.a; if (Math.abs(e.clientY - g.y0) < 4 && !g.va) return; g.va = true; h.style.transition = 'none'; if (d < 0) d = -Math.sqrt(-d) * 3; const now = performance.now(); g.v = (e.clientY - g.ly) / Math.max(.001, (now - g.t) / 1000); g.ly = e.clientY; g.t = now; my.tune(SIGUE); my.set(d); }, true);
  const up = () => { if (!g) return; const { v, va } = g; g = null; if (!va) return;
    if (y > 120 || v > 900) { my.tune(desde(.3, 1)); my.vel = Math.max(v, 600); my.set(h.offsetHeight + 40); my.fin = () => { h.style.transition = 'none'; h.style.opacity = 0; velo()?.click(); }; }
    else { my.tune(HOJA); my.vel = v; my.set(0); my.fin = () => { h.style.translate = ''; h.style.transition = ''; const ve = velo(); if (ve) ve.style.opacity = 1; }; } };
  h.addEventListener('pointerup', up, true); h.addEventListener('pointercancel', up, true);
};

/* ---------- 3. lente fija que recorre una lista vertical (escala del ánimo) ---------- */
const escala = capa => {
  let lente = null, g = null, Y = 0, lift = 0, sy = 1;
  const lista = () => capa.querySelector('.lm-nv')?.parentElement;
  const orbes = () => [...capa.querySelectorAll('.lm-nv')].map(b => { const o = b.querySelector('.lm-orb') || b; const r = o.getBoundingClientRect(), rb = b.getBoundingClientRect(); return { b, x: rb.left + 14 + 22, y: rb.top + rb.height / 2 }; });
  const S = 64, X = () => orbes()[0]?.x || 50;
  const orbEl = b => b.querySelector('.lm-orb') || b.firstElementChild;
  const pinta = () => { if (!lente) return; const s = .5 + .5 * lift; lente.el.style.transform = `translate(${X() - S / 2}px,${Y - S / 2}px) scale(${s / Math.sqrt(sy)},${s * sy})`; lente.el.style.opacity = Math.min(1, lift * 2);
    orbes().forEach(o => { const e = orbEl(o.b); if (e) e.style.scale = 1 + .32 * lift * Math.max(0, 1 - Math.abs(o.y - Y) / 46); }); };
  const mY = muelle(0, SIGUE, v => { Y = v; pinta(); }), mL = muelle(0, SUBE, v => { lift = v; pinta(); }), mS = muelle(1, TEMBLOR, v => { sy = v; pinta(); });
  const crear = () => { const el = D.createElement('div'); el.className = 'lm-cr-flens'; el.style.cssText += `;left:0;top:0;width:${S}px;height:${S}px`;

    el.innerHTML = RIM; D.body.appendChild(el); lente = { el }; };
  const cerca = y => orbes().reduce((a, o) => Math.abs(o.y - y) < Math.abs(a.y - y) ? o : a);
  capa.addEventListener('pointerdown', e => { const b = e.target.closest('.lm-nv'); if (!b) return; e.preventDefault(); if (!lente) crear(); const o = orbes().find(o => o.b === b); mY.set(o.y, !g && lift < .05); g = { y0: e.clientY, a: o.y, ly: e.clientY, t: performance.now() }; mL.tune(SUBE); mL.set(1); }, true);
  capa.addEventListener('pointermove', e => { if (!g) return; const now = performance.now(), v = (e.clientY - g.ly) / Math.max(.001, (now - g.t) / 1000); g.ly = e.clientY; g.t = now; const os = orbes(); let y = g.a + (e.clientY - g.y0); const a = os[0].y, z = os.at(-1).y; if (y < a) y = a - Math.sqrt(a - y) * 3; if (y > z) y = z + Math.sqrt(y - z) * 3; mY.tune(SIGUE); mY.set(y); mS.tune(TEMBLOR); mS.set(1 + Math.min(.2, Math.abs(v) / 5000)); }, true);
  const up = e => { if (!g) return; g = null; sup = true; setTimeout(() => sup = false, 80); const o = cerca(Y); mS.set(1); mS.kick(1.4); permite = true; o.b.click(); permite = false;
    requestAnimationFrame(() => requestAnimationFrame(() => { const n = cerca(Y); mY.tune(TEMBLOR); mY.set(n.y); setTimeout(() => { if (g) return; mL.tune(BAJA); mL.set(0); mL.fin = () => { if (!g) { lente?.el.remove(); lente = null; capa.querySelectorAll('.lm-nv').forEach(b => { const e = orbEl(b); if (e) e.style.scale = ''; }); } }; }, 380); })); };
  let permite = false, sup = false;
  capa.addEventListener('pointerup', up, true);
  capa.addEventListener('click', e => { if (e.target.closest('.lm-nv') && !permite && (sup || g)) { e.stopPropagation(); e.preventDefault(); } }, true);
};

/* ---------- 4. deslizador de horas de sueño con bola de cristal ---------- */
const sueno = fila => {
  const su = fila.querySelector('#lm-su'); if (!su) return;
  const MIN = 3, MAX = 12; let val = parseFloat(su.textContent.replace(',', '.')) || 7.5;
  const sl = D.createElement('div'); sl.className = 'lm-cr-slider';
  sl.innerHTML = `<div class="lm-cr-track"></div><div class="lm-cr-fill"></div><div class="lm-cr-ticks"><span>3 h</span><span>6 h</span><span>9 h</span><span>12 h</span></div><div class="lm-cr-knob"><div class="lm-cr-rim"></div></div>`;
  fila.after(sl);
  const knob = sl.querySelector('.lm-cr-knob'), rim = knob.querySelector('.lm-cr-rim'), fill = sl.querySelector('.lm-cr-fill');
  let x = 0, lift = 0, sx = 1, g = null;
  const W = () => sl.offsetWidth, aX = v => (v - MIN) / (MAX - MIN) * W();
  const pinta = () => { knob.style.left = x + 'px'; fill.style.width = x + 'px'; const s = 1 + .55 * lift; knob.style.transform = `scale(${s * sx},${s / Math.sqrt(sx)})`; knob.style.background = `rgba(255,255,255,${1 - .82 * lift})`; rim.style.opacity = lift; };
  const mX = muelle(aX(val), SIGUE, v => { x = v; pinta(); }), mL = muelle(0, SUBE, v => { lift = v; pinta(); }), mS = muelle(1, TEMBLOR, v => { sx = v; pinta(); });
  requestAnimationFrame(() => mX.set(aX(Math.min(MAX, Math.max(MIN, val))), true));
  const aplicar = nv => { nv = Math.round(nv * 2) / 2; nv = Math.min(MAX, Math.max(MIN, nv)); const d = Math.round((nv - val) * 2); const btn = fila.querySelector(`[data-a="s"][data-v="${d > 0 ? '.5' : '-.5'}"]`); for (let i = 0; i < Math.abs(d); i++) btn?.click(); val = nv; };
  sl.addEventListener('pointerdown', e => { e.preventDefault(); sl.setPointerCapture(e.pointerId); const r = sl.getBoundingClientRect(), s = r.width / W(); g = { x0: e.clientX, a: x, s, lx: e.clientX, t: performance.now() }; mL.tune(SUBE); mL.set(1); });
  sl.addEventListener('pointermove', e => { if (!g) return; const now = performance.now(), v = (e.clientX - g.lx) / g.s / Math.max(.001, (now - g.t) / 1000); g.lx = e.clientX; g.t = now; let nx = g.a + (e.clientX - g.x0) / g.s; if (nx < 0) nx = -Math.sqrt(-nx) * 3; if (nx > W()) nx = W() + Math.sqrt(nx - W()) * 3; mX.tune(SIGUE); mX.set(nx); mS.set(1 + Math.min(.25, Math.abs(v) / 3000)); aplicar(MIN + Math.min(W(), Math.max(0, nx)) / W() * (MAX - MIN)); });
  const up = () => { if (!g) return; g = null; mX.tune(TEMBLOR); mX.set(aX(val)); mS.set(1); mS.kick(1.5); setTimeout(() => { if (!g) { mL.tune(BAJA); mL.set(0); } }, 300); };
  sl.addEventListener('pointerup', up); sl.addEventListener('pointercancel', up);
  fila.addEventListener('click', e => { if (!e.target.closest('[data-a="s"]') || g) return; requestAnimationFrame(() => { val = parseFloat((su.dataset.v ?? su.textContent).replace(',', '.')) || val; mX.tune(TEMBLOR); mX.set(aX(Math.min(MAX, Math.max(MIN, val)))); }); });
};


/* ---------- montaje: cada vez que aparece algo nuevo en la app ---------- */
const montar = () => {
  if (L.rm) return;
  const barra = D.querySelector('.lm-barra');
  if (barra && !barra.dataset.lg) { barra.dataset.lg = 1; pista(barra, '.lm-tab', { over: 3, spread: 8, zoom: .16, swell: .035, elegir: t => t.click() }); }
  D.querySelectorAll('.lm-seg').forEach(s => { if (s.dataset.lg) return; s.dataset.lg = 1; pista(s, 'span', { over: 3, spread: 8, zoom: .14, swell: .03, elegir: t => t.click() }); });
  D.querySelectorAll('.lm-sw').forEach(s => { if (s.dataset.lg) return; s.dataset.lg = 1; interruptor(s); });
  D.querySelectorAll('.lm-top .lm-rb:not(.lm-vacio),.lm-top-campo .lm-rb,.lm-cta .lm-mas,[data-a="apuntar"] .lm-mas').forEach(b => { if (b.dataset.lg) return; b.dataset.lg = 1; boton(b); });
  D.querySelectorAll('.lm-hoja').forEach(h => { if (h.dataset.lg) return; h.dataset.lg = 1; hoja(h); });
  D.querySelectorAll('.lm-capa').forEach(c => { if (c.dataset.lge || !c.querySelector('.lm-nv')) return; c.dataset.lge = 1; escala(c); });
  const su = D.getElementById('lm-su'); if (su && !su.dataset.lg) { su.dataset.lg = 1; sueno(su.closest('.lm-card')); }
};
let pend = 0;
L.cristal = () => { const app = D.getElementById('lm-app'); if (!app) return; new MutationObserver(() => { if (!pend) pend = requestAnimationFrame(() => { pend = 0; montar(); }); }).observe(app, { childList: true, subtree: true }); montar(); };
})();
