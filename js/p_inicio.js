/* Lumos 1.2.0 · bienvenida, perfil, código y «Hola de nuevo» */
'use strict';
L.LOGO = (s = 96, id = 'lg') => `<svg class="lm-logo" width="${s}" height="${s}" viewBox="0 0 100 100" aria-label="Lumos"><defs><radialGradient id="${id}a" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#F2CB6B"/><stop offset=".55" stop-color="#F2A65A"/><stop offset="1" stop-color="#E9705E"/></radialGradient><clipPath id="${id}c"><rect x="0" y="0" width="100" height="69"/></clipPath></defs><g clip-path="url(#${id}c)"><path class="lm-sol" d="M10 66 A40 40 0 0 1 90 66 Z" fill="url(#${id}a)"/></g><rect class="lm-raya" x="10" y="74" width="80" height="7" rx="3.5" fill="currentColor"/></svg>`;

/* ============================== BIENVENIDA ============================== */
const BV = [
  { t: 'Lumos', s: 'Pon luz a lo que sientes. Un sitio tranquilo para entender cómo estás, día a día.' },
  { t: 'Ponle nombre a lo que sientes', s: 'Más de cien palabras, ordenadas por colores. Desliza, encuentra la que encaja y apunta qué tuvo que ver.' },
  { t: 'Tu ánimo, día a día', s: 'Una escala de cinco niveles con tu sueño y tu medicación. La curva te enseña cómo vas y avisa con calma de tus señales.' },
  { t: 'Ayuda para el momento', s: 'Respirar despacio, volver al cuerpo, mirar lo que te dices. Lumos aprende qué te sirve a ti.' },
  { t: 'Empieza y cierra el día', s: 'Por la mañana, qué quieres cuidar. Por la noche, qué te llevas. Dos preguntas cortas, sin obligación.' },
  { t: 'Guarda lo bueno', s: 'Un tarro de momentos bonitos, con foto si quieres, para volver a ellos cuando lo necesites.' },
  { t: 'Mira tus patrones', s: 'El mes en orbes y el año en colores. Ves qué acompaña a tus días buenos y a los difíciles.' },
  { t: 'Solo para ti', s: 'Todo se queda en este móvil. Sin cuentas ni servidores. Un código si quieres, y sin rachas: si un día no entras, no pasa nada.' }
];
const ilu = i => {
  const C = L.C;
  if (i === 0) return `<div style="position:absolute;inset:0">${[[C.ten, 230, -50, 30], [C.ale, 270, 80, 80], [C.cal, 240, 190, 0], [C.baj, 210, -20, 200], [C.lil, 190, 210, 220]].map(([c, d, x, y]) => L.orb(c, d, `position:absolute;left:${x}px;top:${y}px;opacity:.55`, 'lm-bv-o')).join('')}</div>
    <div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center;color:var(--ink)">${L.LOGO(150, 'bv')}</div>`;
  if (i === 1) {
    const pal = L.palabras(), filas = [['Tenso', 'Agobiado', 'Inquieto', 'Nervioso', 'Irritado'], ['Emocionado', 'Con ganas', 'Decidido', 'Activo', 'Eufórico'], ['Alegre', 'Ilusionado', 'Animado', 'Orgulloso', 'Curioso'], ['A gusto', 'Tranquilo', 'Sereno', 'Agradecido', 'Querido'], ['Cansado', 'Triste', 'Apagado', 'Solo', 'Nostálgico']];
    let o = '';
    filas.forEach((f, r) => f.forEach((w, c) => {
      const p = pal.find(x => x.palabra === w), x = c * 96 - 30 + (r % 2 ? 48 : 0), y = r * 80;
      const big = w === 'Ilusionado', d = big ? 150 : 96;
      o += `<div class="lm-mo" data-e="p" style="position:absolute;left:${x + 48 - d / 2}px;top:${y + 40 - d / 2}px;width:${d}px;height:${d}px;display:flex;align-items:center;justify-content:center;z-index:${big ? 2 : 1}">${L.orb(p.color, d, 'position:absolute;inset:0')}<span style="position:relative;font-family:Gloock;font-size:${big ? 22 : 12.5}px;color:#2B2420;text-align:center">${w}</span></div>`;
    }));
    return `<div class="lm-mini" style="position:absolute;left:0;top:10px;width:520px;height:420px">${o}</div>`;
  }
  if (i === 2) {
    const g = L.grafica({ vals: [0, 0, 1, 1, 0, -1, 0], sueno: [7.5, 7, 6, 5.5, 7, 8.5, 7.5], med: [1, 1, 1, 1, 1, 0, 1], etiquetas: ['L', 'M', 'X', 'J', 'V', 'S', 'D'], W: 346, HP: 230, r: 8, gid: 'gbv' });
    return `<div class="lm-card lm-graf" style="position:absolute;left:22px;right:22px;top:24px">${g.svg}</div>`;
  }
  if (i === 3) return `<div class="lm-bv-resp" style="position:absolute;left:50%;top:200px;width:300px;height:300px;margin:-150px 0 0 -150px;scale:.62">${L.orb(C.baj, 300)}</div>
    <div style="position:absolute;left:50%;top:200px;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;border:1.5px solid ${C.baj}"></div>
    <p class="lm-bv-rt" style="position:absolute;left:0;right:0;top:174px;text-align:center;font-family:Gloock;font-size:40px;height:50px">Inspira</p>`;
  if (i === 4) return `<div class="lm-card" data-e style="position:absolute;left:22px;right:60px;top:40px;height:150px;overflow:hidden"><div class="lm-vis">${L.orb(C.ale, 220, 'right:-70px;top:-70px')}</div>
      <p class="lm-ms" style="position:relative;margin-top:44px">Buenos días</p><p style="position:relative;font-family:Gloock;font-size:25px;line-height:1.05;margin-top:4px">¿Qué quieres cuidar hoy?</p></div>
    <div class="lm-card" data-e style="position:absolute;left:60px;right:22px;top:206px;height:150px;overflow:hidden"><div class="lm-vis">${L.orb(C.lil, 220, 'right:-70px;top:-70px')}${L.orb(C.baj, 160, 'left:-50px;top:-60px')}</div>
      <p class="lm-ms" style="position:relative;margin-top:44px">Cerrar el día</p><p style="position:relative;font-family:Gloock;font-size:25px;line-height:1.05;margin-top:4px">¿Qué te llevas de hoy?</p></div>`;
  if (i === 5) {
    const m = [['La risa de Leo con el vídeo del gato', C.ale, 30, 30, -3], ['Café largo con una amiga', C.cal, 196, 64, 3], ['Me aplaudieron la presentación', C.ene, 40, 196, 2], ['Dormí nueve horas', C.baj, 200, 226, -2]];
    return m.map(([t, c, x, y, r]) => `<div class="lm-mom lm-bv-m" style="position:absolute;left:${x}px;top:${y}px;width:156px;min-height:128px;rotate:${r}deg"><div class="lm-vis">${L.orb(c, 160, 'right:-56px;bottom:-66px')}</div><b>${t}</b></div>`).join('');
  }
  if (i === 6) {
    let f = ''; const meses = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov'];
    meses.forEach((nm, m) => {
      let c = ''; for (let d = 0; d < 31; d++) { const t = .5 + .25 * Math.sin((m * 31 + d) / 9) + .12 * Math.sin(d * 1.7 + m); c += `<i style="background:${L.rampa(Math.max(.03, Math.min(.97, t)))}"></i>`; }
      f += `<div class="lm-af lm-bv-f"><span>${nm}</span><div>${c}</div></div>`;
    });
    return `<div style="position:absolute;left:24px;right:24px;top:70px"><p class="lm-sub" style="margin-bottom:14px">Tus meses en colores</p><div class="lm-anio" style="gap:9px">${f}</div></div>`;
  }
  return `<div style="position:absolute;left:50%;top:190px;margin:-150px 0 0 -150px">${L.orb(C.cal, 300)}</div>
    <div class="lm-bv-cand" style="position:absolute;left:50%;top:190px;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;box-shadow:0 18px 30px -18px var(--sombra)">${L.ic('candado', 36)}</div>`;
};
const animaBV = (i, sl) => {
  if (L.rm) return;
  if (i === 0) {
    const sol = $('.lm-sol', sl), raya = $('.lm-raya', sl);
    sol.animate([{ translate: '0 48px' }, { translate: '0 0' }], { duration: 1300, delay: 250, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' });
    raya.style.transformBox = 'fill-box'; raya.style.transformOrigin = 'center';
    raya.animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 700, easing: L.E, fill: 'backwards' });
    $$('.lm-bv-o', sl).forEach((o, k) => o.animate([{ opacity: 0, scale: .8 }, { opacity: .55, scale: 1 }], { duration: 1200, delay: 500 + k * 90, easing: L.E, fill: 'backwards' }));
  }
  if (i === 1) $$('.lm-mo', sl).forEach(o => { const r = o.getBoundingClientRect(), dx = r.left + r.width / 2 - innerWidth / 2 - innerWidth * 1, dist = Math.hypot(r.left - 160, r.top - 240); o.animate([{ opacity: 0, scale: .6 }, { opacity: 1, scale: 1 }], { duration: 560, delay: 80 + Math.min(dist, 400) * .9, easing: L.M, fill: 'backwards' }); });
  if (i === 2) L.animarGrafica($('svg', sl));
  if (i === 3) {
    const o = $('.lm-bv-resp', sl), t = $('.lm-bv-rt', sl);
    o.getAnimations().forEach(a => a.cancel());
    t.textContent = 'Inspira';
    const a = o.animate([{ scale: .62 }, { scale: 1, offset: .4 }, { scale: .62 }], { duration: 10000, easing: 'ease-in-out' });
    const tm = setTimeout(() => L.rodar(t, 'Suelta', true), 4000); a.finished.then(() => clearTimeout(tm)).catch(() => clearTimeout(tm));
    sl._parar = () => { a.cancel(); clearTimeout(tm); };
  }
  if (i === 4) $$('[data-e]', sl).forEach((c, k) => c.animate([{ opacity: 0, translate: `${k ? 28 : -28}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 620, delay: 120 + k * 160, easing: L.E, fill: 'backwards' }));
  if (i === 5) $$('.lm-bv-m', sl).forEach((m, k) => m.animate([{ opacity: 0, translate: '0 -40px', rotate: `${k % 2 ? 9 : -9}deg` }, { opacity: 1, translate: '0 0', rotate: getComputedStyle(m).rotate }], { duration: 760, delay: 100 + k * 130, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' }));
  if (i === 6) $$('.lm-bv-f i', sl).forEach((d, k) => d.animate([{ opacity: 0, scale: .3 }, { opacity: 1, scale: 1 }], { duration: 380, delay: 60 + Math.floor(k / 31) * 110 + (k % 31) * 14, easing: L.M, fill: 'backwards' }));
  if (i === 7) { const c = $('.lm-bv-cand', sl); c.animate([{ opacity: 0, scale: .7 }, { opacity: 1, scale: 1 }], { duration: 560, delay: 120, easing: L.M, fill: 'backwards' }); }
  $$('.lm-bv-tx > *', sl).forEach((e, k) => e.animate([{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 460, delay: (i === 0 ? 700 : 140) + k * 70, easing: L.E, fill: 'backwards' }));
};
L.montarBienvenida = () => {
  const app = $('#lm-app'); app.innerHTML = '';
  const el = document.createElement('section'); el.className = 'lm-capa'; el.id = 'lm-bienvenida'; el.style.zIndex = 20;
  const N = BV.length;
  el.innerHTML = `<div class="lm-bv"><div class="lm-bv-pista" style="width:${N * 100}vw">${BV.map((b, i) => `<div class="lm-bv-sl" data-i="${i}"><div class="lm-bv-ilu">${ilu(i)}</div>
      <div class="lm-bv-tx">${i === 0 ? `<h1 class="lm-t0" style="font-size:66px;margin-bottom:10px">Lumos</h1><p style="font-family:Gloock;font-size:24px;color:var(--ink);margin-bottom:10px">Pon luz a lo que sientes</p><p>Un sitio tranquilo para entender cómo estás, día a día.</p>` : `<h1>${b.t}</h1><p>${b.s}</p>`}</div></div>`).join('')}</div>
    <button class="lm-saltar tq" data-a="saltar">Saltar</button>
    <div class="lm-bv-pie"><div class="lm-puntos">${BV.map((_, i) => `<i class="${i ? '' : 'lm-on'}"></i>`).join('')}</div>
      <button class="lm-btn tq tq-g" data-a="sig"><span class="lm-bv-bt" style="display:inline-block;position:relative">Siguiente</span></button>
      <div class="lm-bv-demo" style="max-height:0;opacity:0;overflow:hidden;transition:max-height .46s var(--entrar),opacity .36s"><button class="lm-btn lm-sec2 tq tq-g" data-a="demo" style="margin-top:10px">Ver con datos de prueba</button></div></div></div>`;
  app.appendChild(el);
  const pista = $('.lm-bv-pista', el), sls = $$('.lm-bv-sl', el), mini = $('.lm-mini', el);
  let i = 0, W = innerWidth;
  const pos = (x, anim) => { pista.style.transition = anim ? 'transform .46s var(--entrar)' : 'none'; pista.style.transform = `translate3d(${x}px,0,0)`; if (mini) { mini.style.transition = pista.style.transition; mini.style.transform = `translate3d(${(-x - W) * .22}px,0,0)`; } };
  const ir = n => {
    n = Math.max(0, Math.min(N - 1, n)); const cambia = n !== i;
    if (cambia) sls[i]._parar?.();
    i = n; pos(-i * W, true);
    $$('.lm-puntos i', el).forEach((p, k) => p.classList.toggle('lm-on', k === i));
    L.rodar($('.lm-bv-bt', el), i === N - 1 ? 'Crear mi perfil' : 'Siguiente', true);
    const d = $('.lm-bv-demo', el); d.style.maxHeight = i === N - 1 ? '80px' : '0'; d.style.opacity = i === N - 1 ? 1 : 0;
    $('.lm-saltar', el).style.opacity = i === N - 1 ? 0 : 1; $('.lm-saltar', el).style.pointerEvents = i === N - 1 ? 'none' : '';
    if (cambia) setTimeout(() => animaBV(i, sls[i]), 120);
  };
  addEventListener('resize', () => { W = innerWidth; pos(-i * W); });
  /* deslizar */
  let x0 = null, y0 = 0, dx = 0, t0 = 0, horiz = null;
  const bv = $('.lm-bv', el);
  bv.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; t0 = Date.now(); horiz = null; }, { passive: true });
  bv.addEventListener('touchmove', e => {
    if (x0 === null) return; dx = e.touches[0].clientX - x0;
    if (horiz === null && Math.abs(dx) + Math.abs(e.touches[0].clientY - y0) > 8) horiz = Math.abs(dx) > Math.abs(e.touches[0].clientY - y0);
    if (!horiz) return;
    let d = dx; if ((i === 0 && d > 0) || (i === N - 1 && d < 0)) d *= .3;
    pos(-i * W + d);
  }, { passive: true });
  bv.addEventListener('touchend', () => {
    if (x0 === null) return; x0 = null; if (!horiz) return;
    const v = dx / Math.max(1, Date.now() - t0);
    if (dx < -W * .2 || v < -.45) ir(i + 1); else if (dx > W * .2 || v > .45) ir(i - 1); else ir(i);
  });
  el.addEventListener('click', e => {
    const t = e.target.closest('[data-a]'); if (!t) return;
    if (t.dataset.a === 'sig') { if (i < N - 1) ir(i + 1); else L.abrirSobre('perfil', {}); }
    if (t.dataset.a === 'saltar') ir(N - 1);
    if (t.dataset.a === 'demo') L.cargarDemo();
  });
  pos(0); animaBV(0, sls[0]);
};
/* abre una capa encima de la bienvenida (sin raíz montada) */
L.abrirSobre = (n, o) => L.abrir(n, o, 'lado');

/* pasar de la bienvenida a la app */
L.irAApp = async () => {
  const app = $('#lm-app');
  await L.anim(app, [{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: L.S });
  L.capas.length = 0; app.innerHTML = ''; L.tabActual = 'hoy';
  L.aplicarTema(); L.montarRaiz();
  app.style.opacity = 0;
  await L.anim(app, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: L.E });
  app.style.opacity = '';
};

/* ============================== PERFIL ============================== */
L.pantallas.perfil = (el, o, capa) => {
  let conCodigo = false;
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h1 class="lm-t1" data-e>Tu perfil</h1><p class="lm-sub" data-e>Solo se guarda en este móvil. Puedes cambiarlo cuando quieras en Ajustes.</p>
    <h3 class="lm-sec" data-e>¿Cómo te llamas?</h3><input class="lm-input" data-e id="lm-nombre" placeholder="Tu nombre" maxlength="30" autocomplete="given-name" enterkeyhint="done">
    <div class="lm-card lm-fila" data-e style="margin-top:14px">${L.ic('candado')}<div><b>Código para entrar</b><small>Cuatro cifras cada vez que abras Lumos. Es opcional.</small></div>${L.sw(false, 'data-a="codigo"')}</div>
    </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g lm-off" data-a="crear">Entrar en Lumos</button></div>`;
  L.entrar(el, 300);
  const inp = $('#lm-nombre', el), bt = $('[data-a="crear"]', el);
  inp.addEventListener('input', () => bt.classList.toggle('lm-off', !inp.value.trim()));
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
  const crear = codigo => {
    L.d = L.vacio();
    L.d.perfil = { nombre: inp.value.trim(), codigo, tema: 'auto', escala: true, demo: false, ultimaVisita: Date.now(), creado: Date.now() };
    L.guardar(); L.irAApp();
  };
  capa.acc = {
    codigo: t => { conCodigo = !conCodigo; t.classList.toggle('lm-on', conCodigo); t.setAttribute('aria-checked', conCodigo); },
    crear: () => { if (!inp.value.trim()) return; inp.blur(); conCodigo ? L.abrir('codigo', { modo: 'crear', alFin: crear }, 'lado') : crear(null); }
  };
};

/* ============================== CÓDIGO ============================== */
L.pantallas.codigo = (el, o, capa) => {
  const modo = o.modo; let paso = modo === 'entrar' || modo === 'cambiar' || modo === 'quitar' ? 'comprobar' : 'nuevo';
  let pin = '', primero = '';
  const nombre = L.d.perfil?.nombre || '';
  const textos = () => paso === 'comprobar' ? (modo === 'entrar' ? [`Hola, ${nombre}`, 'Escribe tu código'] : ['Tu código actual', 'Escríbelo para seguir']) :
    paso === 'nuevo' ? ['Elige un código', 'Cuatro cifras para abrir Lumos. Así, aunque dejes el móvil, nadie entra.'] : ['Repítelo', 'Para estar seguros de que es el que quieres.'];
  const [t1, t2] = textos();
  el.innerHTML = `${modo === 'entrar' ? '' : L.top('atras')}
    ${modo === 'entrar' ? `<div class="lm-hero" style="height:300px">${L.orb(L.C.ale, 300, 'left:50%;margin-left:-150px;top:-120px')}</div>` : ''}
    <div style="position:absolute;left:24px;right:24px;top:calc(var(--st) + ${modo === 'entrar' ? 150 : 110}px);text-align:center">
      <h1 class="lm-t1 lm-c-t" data-e style="position:relative">${L.esc(t1)}</h1><p class="lm-sub lm-c-s" data-e style="position:relative">${L.esc(t2)}</p>
      <div class="lm-pin" data-e>${'<i></i>'.repeat(4)}</div></div>
    <div class="lm-tecl">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="tq tq-i" data-a="n" data-v="${n}">${n}</button>`).join('')}<span></span><button class="tq tq-i" data-a="n" data-v="0">0</button><button class="tq tq-i lm-v" data-a="borrar" aria-label="Borrar">${L.ic('atras', 26)}</button></div>
    <button class="lm-enlace tq" data-a="olvido" style="position:absolute;left:0;right:0;bottom:calc(var(--sb) + 18px)">${modo === 'entrar' ? 'He olvidado mi código' : 'Si lo olvidas, tendrás que borrar los datos de Lumos'}</button>`;
  L.entrar(el, 120);
  const dots = $$('.lm-pin i', el);
  const pintar = () => dots.forEach((d, k) => { const ll = k < pin.length; if (ll && !d.classList.contains('lm-ll')) d.animate([{ scale: .88 }, { scale: 1.07 }, { scale: 1 }], { duration: 340, easing: 'ease-out' }); d.classList.toggle('lm-ll', ll); });
  const titulo = () => { const [a, b] = textos(); L.rodar($('.lm-c-t', el), a, true); L.rodar($('.lm-c-s', el), b, true, 55); };
  const temblar = async () => { L.vibra(30); await L.anim($('.lm-pin', el), [{ translate: '0 0' }, { translate: '-10px 0' }, { translate: '9px 0' }, { translate: '-6px 0' }, { translate: '4px 0' }, { translate: '0 0' }], { duration: 420, easing: 'ease-out', forzar: true }); pin = ''; pintar(); };
  const completo = async () => {
    await L.espera(160);
    if (paso === 'comprobar') {
      if (pin !== L.d.perfil.codigo) return temblar();
      if (modo === 'entrar') { await L.cerrar(capa); L.alEntrar(); return; }
      if (modo === 'quitar') { L.d.perfil.codigo = null; L.guardar(); L.toast('Código quitado'); L.cerrar(capa); return; }
      paso = 'nuevo'; pin = ''; pintar(); titulo(); return;
    }
    if (paso === 'nuevo') { primero = pin; paso = 'repetir'; pin = ''; pintar(); titulo(); return; }
    if (pin !== primero) { paso = 'nuevo'; primero = ''; await temblar(); titulo(); L.toast('No coincidían. Elige el código otra vez.'); return; }
    if (o.alFin) { o.alFin(pin); return; }
    L.d.perfil.codigo = pin; L.guardar(); L.toast(modo === 'cambiar' ? 'Código cambiado' : 'Código activado'); L.cerrar(capa);
  };
  capa.acc = {
    n: t => { if (pin.length >= 4) return; pin += t.dataset.v; pintar(); if (pin.length === 4) completo(); },
    borrar: () => { pin = pin.slice(0, -1); pintar(); },
    olvido: () => {
      if (modo !== 'entrar') return;
      L.confirmar('¿Has olvidado tu código?', 'En esta versión no hay copia de seguridad. La única forma de volver a entrar es borrar todo lo de Lumos en este móvil y empezar de nuevo.', 'Borrar todo y empezar de nuevo', async () => { await L.borrarTodo(); location.reload(); });
    }
  };
};

/* ============================== HOLA DE NUEVO ============================== */
L.pantallas.holaDeNuevo = (el, o, capa) => {
  el.innerHTML = `<div class="lm-hero" style="height:440px">${L.orb(L.C.cal, 320, 'left:-50px;top:10px')}${L.orb(L.C.baj, 280, 'left:150px;top:90px')}</div>
    <div class="lm-pad" style="position:absolute;left:0;right:0;top:calc(var(--st) + 370px);padding-top:0">
      <h1 class="lm-t1" data-e>Hola de nuevo</h1><p class="lm-sub" data-e style="font-size:17px">Han pasado ${L.enLetra(o.dias)} días. No hace falta ponerse al día: empieza por hoy.</p></div>
    <div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ahora" data-e>¿Cómo estás ahora?</button><button class="lm-enlace tq" data-a="cerrar" data-e>Entrar sin apuntar nada</button></div>`;
  $$('.lm-hero .lm-orb', el).forEach((h, k) => h.animate([{ opacity: 0, translate: '0 46px', rotate: '9deg' }, { opacity: 1, translate: '0 0', rotate: '0deg' }], { duration: 900, delay: k * 120, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' }));
  L.entrar(el, 420);
  capa.acc = { ahora: async () => { await L.cerrar(capa); L.abrir('apuntar', { flujo: 'emo' }, 'sube'); } };
};
