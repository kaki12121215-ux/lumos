/* Lumos 1.0.0 · Hoy, apuntar una emoción, mañana, noche y momentos */
'use strict';
const nombreInf = e => (e.influencias || []).length ? ', por ' + e.influencias.map(x => L.minus(x)).join(' y ') : '';

/* ============================== HOY ============================== */
L.vistas.hoy = el => {
  const p = L.d.perfil, hoy = L.hoy(), es = L.emocionesDe(hoy).reverse();
  const an = L.mapaAnimo()[hoy], nMom = L.d.momentos.length, fr = L.franja();
  const man = L.d.mananas.find(m => m.fecha === hoy), noc = L.d.noches.find(n => n.fecha === hoy);
  const sen = p.escala !== false && L.d.plan.avisar ? L.senales() : [];
  const cols = es.length ? [...new Set(es.map(e => L.colorDe(e.palabra)))].slice(0, 4) : [L.C.ten, L.C.ene, L.C.ver, L.C.ale];
  while (cols.length < 4) cols.push([L.C.ale, L.C.cal, L.C.ene, L.C.baj][cols.length]);
  const vis = [[-30, -10, 210], [110, 10, 200], [210, -30, 190], [60, 50, 170]].map(([x, y, d], i) => L.orb(cols[i], d, `left:${x}px;top:${y}px`)).join('');
  let dia = '';
  if (fr === 'manana' && !man) dia = L.li(`<span style="color:var(--mu)">${L.ic('sol')}</span>`, 'Empezar el día', '¿Qué quieres cuidar hoy?', 'data-a="manana"');
  else if (fr === 'noche' && !noc) dia = L.li(`<span style="color:var(--mu)">${L.ic('luna')}</span>`, 'Cerrar el día', '¿Qué te llevas de hoy?', 'data-a="noche"');
  else if (fr === 'tarde' && !man && new Date().getHours() < 14) dia = L.li(`<span style="color:var(--mu)">${L.ic('sol')}</span>`, 'Empezar el día', '¿Qué quieres cuidar hoy?', 'data-a="manana"');
  else if (noc) dia = `<p class="lm-nota-p" style="padding:6px 2px">Día cerrado. Que descanses.</p>`;
  el.innerHTML = `<div class="lm-pad">
    <div class="lm-priv" data-e>${L.ic('candado', 15)}<span>Solo lo ves tú</span><button class="lm-rb tq tq-i" data-a="ajustes" aria-label="Ajustes">${L.ic('ajustes', 19)}</button></div>
    <h1 class="lm-t1" data-e>${L.saludo()},<br>${L.esc(p.nombre)}</h1>
    <button class="lm-cta tq tq-g" data-a="apuntar" data-e style="display:block;width:100%;text-align:left"><div class="lm-vis">${vis}</div><p>¿Cómo te sientes ahora?</p><span class="lm-mas">${L.ic('mas', 24)}</span></button>
    <div class="lm-duo" data-e>
      ${p.escala !== false ? `<button class="lm-card tq tq-g" data-a="escala" style="text-align:left">${an ? L.pt(L.NIV[an.nivel].c, 32) : L.pt(L.C.ene, 32)}<div><b>Tu escala</b><small>${an ? 'Hoy, ' + L.NIV[an.nivel].nombre.toLowerCase() : 'Hoy sin apuntar'}</small></div></button>` : `<button class="lm-card tq tq-g" data-a="diario" style="text-align:left"><span style="color:var(--mu)">${L.ic('libro')}</span><div><b>Diario</b><small>Todo lo apuntado</small></div></button>`}
      <button class="lm-card tq tq-g" data-a="momentos" style="text-align:left"><span style="color:var(--mu)">${L.ic('tarro')}</span><div><b>Momentos</b><small>${nMom ? (nMom === 1 ? 'Uno guardado' : nMom + ' guardados') : 'Guarda lo bueno'}</small></div></button>
    </div>
    ${sen.length ? `<div class="lm-card" data-e style="margin-top:12px"><b>${sen[0].titulo}</b><small>${sen[0].texto}</small><button class="lm-pill tq" data-a="plan">Ver mi plan</button></div>` : ''}
    <h3 class="lm-sec" data-e>Hoy</h3>
    <div data-e>${es.length ? es.map(e => `<button class="lm-ent tq tq-g" data-a="entrada" data-id="${e.id}" style="width:100%;text-align:left">${L.pt(L.colorDe(e.palabra), 38)}<div><p>${L.esc(e.palabra)}</p><small>A las ${L.hora(e.ts)}${nombreInf(e)}${e.tipo === 'dia' ? ' · el día' : ''}</small></div></button>`).join('') :
      `<p class="lm-vacia">Aún no has apuntado nada hoy. Cuando quieras, toca el botón de arriba: son veinte segundos.</p>`}</div>
    <div data-e style="margin-top:14px">${dia}</div>
    <div class="lm-ayudas" data-e>
      <button class="lm-card tq tq-g" data-a="diario"><span style="color:var(--mu)">${L.ic('libro', 20)}</span>Diario</button>
      <button class="lm-card tq tq-g" data-a="ayuda"><span style="color:var(--mu)">${L.ic('mano', 20)}</span>Si estás mal</button>
    </div>
  </div>`;
  return {
    ajustes: () => L.abrir('ajustes'), apuntar: () => L.abrir('apuntar', { flujo: 'emo' }, 'sube'),
    escala: () => L.abrir('nivel', { flujo: 'escala' }, 'sube'), momentos: () => L.abrir('momentos'),
    plan: () => L.abrir('plan'), entrada: t => L.abrir('entrada', { id: t.dataset.id }),
    manana: () => L.abrir('manana', {}, 'sube'), noche: () => L.abrir('noche', {}, 'sube'),
    diario: () => L.abrir('diario'), ayuda: () => L.abrir('ayuda')
  };
};

/* ============================== APUNTAR: AHORA O EL DÍA ============================== */
L.pantallas.apuntar = (el, o, capa) => {
  el.innerHTML = `${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h1 class="lm-t1" data-e>¿Qué quieres apuntar?</h1>
    <button class="lm-card tq tq-g" data-a="tipo" data-v="ahora" data-e style="display:flex;flex-direction:column;justify-content:flex-end;height:150px;width:100%;text-align:left;overflow:hidden;margin-top:14px"><div class="lm-vis">${L.orb(L.C.ale, 220, 'right:-56px;top:-56px')}</div><span style="position:relative;font-family:Gloock;font-size:27px">Cómo estoy ahora</span><small style="position:relative;font-size:14px">Una emoción de este momento.</small></button>
    <button class="lm-card tq tq-g" data-a="tipo" data-v="dia" data-e style="display:flex;flex-direction:column;justify-content:flex-end;height:150px;width:100%;text-align:left;overflow:hidden;margin-top:10px"><div class="lm-vis">${L.orb(L.C.baj, 220, 'right:-56px;top:-56px')}</div><span style="position:relative;font-family:Gloock;font-size:27px">Cómo ha ido el día</span><small style="position:relative;font-size:14px">El ánimo de fondo, mirando el día entero.</small></button>
    <p class="lm-sub" data-e style="margin-top:18px">Las emociones van y vienen en minutos. El ánimo es lo que queda de fondo.</p>
  </div></div>`;
  L.entrar(el, 280);
  capa.acc = { tipo: t => L.abrir('campo', { flujo: 'emo', tipo: t.dataset.v }, 'fundido') };
};

/* ============================== CAMPO DE EMOCIONES ============================== */
L.pantallas.campo = (el, o, capa) => {
  const pal = L.palabras(), COL = 9, SX = 116, SY = 101, R = 59;
  const W = () => el.clientWidth || innerWidth, H = () => el.clientHeight || innerHeight;
  el.innerHTML = `<div class="lm-campo"></div><div class="lm-campo-velo"></div>
    ${L.top(o.elegir ? 'atras' : 'x', o.tipo === 'dia' ? '¿Qué palabra resume el día?' : '¿Qué palabra encaja?', ['buscar', 'lupa', 'Buscar'])}
    <div class="lm-pista">Desliza para ver más y toca la que encaje</div>`;
  const campo = $('.lm-campo', el);
  /* rejilla hexagonal, fila a fila por el espectro */
  const nodos = pal.map((p, i) => {
    const f = Math.floor(i / COL), c = i % COL;
    const d = document.createElement('div'); d.className = 'lm-eo'; d.style.cssText = L.vars(p.color) + ';background:radial-gradient(circle,var(--o0) 0%,var(--o1) 38%,var(--o2) 58%,var(--o3) 72%)';
    d.innerHTML = `<span style="font-size:${p.palabra.length > 11 ? 12.5 : p.palabra.length > 9 ? 13.5 : 15}px">${L.esc(p.palabra)}</span>`; d.dataset.i = i;
    campo.appendChild(d);
    return { el: d, p, wx: c * SX + (f % 2 ? SX / 2 : 0), wy: f * SY };
  });
  const maxX = (COL - 1) * SX + SX / 2, maxY = Math.floor((pal.length - 1) / COL) * SY;
  /* empieza centrado en «Tranquilo» o en la mitad */
  const ini = nodos.find(n => n.p.palabra === (o.inicio || 'Ilusionado')) || nodos[Math.floor(nodos.length / 2)];
  let ox = W() / 2 - ini.wx, oy = H() * .5 - ini.wy, vx = 0, vy = 0, anim = null;
  const lim = () => ({ x0: W() / 2 - maxX, x1: W() / 2, y0: H() * .5 - maxY, y1: H() * .5 });
  const pintar = () => {
    const w = W(), h = H(), cx = w / 2, cy = h * .5;
    for (const n of nodos) {
      let x = n.wx + ox, y = n.wy + oy;
      const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy);
      if (r > 900) { n.el.style.visibility = 'hidden'; continue; }
      n.el.style.visibility = '';
      const k = 1 + .55 * Math.exp(-((r / 165) ** 2));
      x = cx + dx * k; y = cy + dy * k;
      let s = .74 + 1.16 * Math.exp(-((r / 118) ** 2));
      /* más pequeños al acercarse a los bordes */
      const bx = Math.min(x, w - x), by = Math.min(y, h - y);
      if (bx < 40) s *= Math.max(.55, .7 + bx / 140); if (by < 60) s *= Math.max(.55, .72 + by / 220);
      n.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(3)})`;
      n.el.style.zIndex = Math.round(s * 10);
      n.s = s; n.x = x; n.y = y;
    }
  };
  const centrar = (n, ms = 420) => {
    cancelAnimationFrame(anim);
    const sx = ox, sy = oy, tx = W() / 2 - n.wx, ty = H() * .5 - n.wy, t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3.2);
    const paso = now => { const t = Math.min(1, (now - t0) / (L.rm ? 1 : ms)); ox = sx + (tx - sx) * ease(t); oy = sy + (ty - sy) * ease(t); pintar(); if (t < 1) anim = requestAnimationFrame(paso); };
    anim = requestAnimationFrame(paso);
  };
  const masCercano = () => { let m = null, dm = 1e9; const cx = W() / 2, cy = H() * .5; for (const n of nodos) { const d = Math.hypot(n.wx + ox - cx, n.wy + oy - cy); if (d < dm) { dm = d; m = n; } } return m; };
  const inercia = () => {
    cancelAnimationFrame(anim);
    let last = performance.now();
    const paso = now => {
      const dt = Math.min(32, now - last) / 16.67; last = now;
      const l = lim();
      ox += vx * dt; oy += vy * dt; vx *= Math.pow(.94, dt); vy *= Math.pow(.94, dt);
      if (ox < l.x0 || ox > l.x1) { vx *= .6; ox += ((ox < l.x0 ? l.x0 : l.x1) - ox) * .18; }
      if (oy < l.y0 || oy > l.y1) { vy *= .6; oy += ((oy < l.y0 ? l.y0 : l.y1) - oy) * .18; }
      pintar();
      if (Math.hypot(vx, vy) > .35) anim = requestAnimationFrame(paso); else centrar(masCercano(), 380);
    };
    anim = requestAnimationFrame(paso);
  };
  /* arrastre */
  let pid = null, px = 0, py = 0, mov = 0, hist = [], quitoPista = false;
  campo.addEventListener('pointerdown', e => {
    pid = e.pointerId; campo.setPointerCapture(pid); cancelAnimationFrame(anim);
    px = e.clientX; py = e.clientY; mov = 0; hist = [[e.clientX, e.clientY, performance.now()]]; vx = vy = 0;
  });
  campo.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; mov += Math.abs(dx) + Math.abs(dy);
    const l = lim(), nx = ox + dx, ny = oy + dy;
    ox = (nx < l.x0 || nx > l.x1) ? ox + dx * .35 : nx; oy = (ny < l.y0 || ny > l.y1) ? oy + dy * .35 : ny;
    hist.push([e.clientX, e.clientY, performance.now()]); if (hist.length > 5) hist.shift();
    pintar();
    if (mov > 30 && !quitoPista) { quitoPista = true; $('.lm-pista', el).classList.add('lm-fuera'); }
  });
  const soltar = e => {
    if (e.pointerId !== pid) return; pid = null;
    if (mov < 9) { /* toque */
      const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('.lm-eo');
      if (t) return elegir(nodos[+t.dataset.i]);
    }
    const a = hist[0], b = hist[hist.length - 1], dt = Math.max(16, b[2] - a[2]);
    vx = (b[0] - a[0]) / dt * 16.67; vy = (b[1] - a[1]) / dt * 16.67;
    if (performance.now() - b[2] > 90) { vx = vy = 0; }
    inercia();
  };
  campo.addEventListener('pointerup', soltar); campo.addEventListener('pointercancel', soltar);
  /* elegir: el orbe crece y viaja al detalle */
  let eligiendo = false;
  const elegir = async n => {
    if (eligiendo) return; eligiendo = true; L.vibra(6);
    if (o.elegir) { n.el.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 340, easing: 'ease-out', composite: 'add' }); await L.espera(180); await L.cerrar(capa); o.elegir(n.p.palabra); return; }
    const r = n.el.getBoundingClientRect();
    const cl = document.createElement('div'); cl.className = 'lm-clon';
    cl.style.cssText = n.el.style.cssText.replace(/transform:[^;]+;?/, '') + `;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;transform:none;margin:0`;
    document.body.appendChild(cl);
    n.el.style.opacity = 0;
    const nueva = L.abrir('registro', { flujo: 'emo', palabra: n.p.palabra, tipo: o.tipo || 'ahora', heroOculto: true }, 'fundido');
    await L.raf();
    const h = $('.lm-reg-hero', L.arriba().el), hr = h.getBoundingClientRect();
    await L.anim(cl, [{ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }, { left: hr.left + 'px', top: hr.top + 'px', width: hr.width + 'px', height: hr.height + 'px' }], { duration: 700, easing: L.E });
    h.style.visibility = ''; cl.remove(); await nueva;
    n.el.style.opacity = ''; eligiendo = false;
  };
  capa.acc = { buscar: () => L.abrir('buscar', { flujo: o.flujo, tipo: o.tipo, elegir: o.elegir ? w => { L.cerrar(capa, true); o.elegir(w); } : null }, 'lado') };
  capa.refrescar = () => { eligiendo = false; };
  requestAnimationFrame(() => {
    pintar();
    /* entrada en onda desde el centro */
    if (!L.rm) {
      const cx = W() / 2, cy = H() * .5;
      nodos.forEach(n => { if (n.el.style.visibility === 'hidden') return; const d = Math.hypot(n.x - cx, n.y - cy); n.el.animate([{ opacity: 0, scale: .5 }, { opacity: 1, scale: 1 }], { duration: 620, delay: 40 + d * .75, easing: L.M, fill: 'backwards', composite: 'add' }); });
    }
  });
  addEventListener('resize', pintar);
  capa.alCerrar = () => removeEventListener('resize', pintar);
};

/* ============================== BUSCAR ============================== */
L.pantallas.buscar = (el, o, capa) => {
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <div class="lm-busca" data-e>${L.ic('lupa', 19)}<input id="lm-q" placeholder="Busca una palabra" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></div>
    <div id="lm-res"></div></div></div>`;
  L.entrar(el, 300);
  const q = $('#lm-q', el), res = $('#lm-res', el);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const pintar = () => {
    const t = norm(q.value.trim()), pal = L.palabras();
    const l = t ? pal.filter(p => norm(p.palabra).includes(t)).sort((a, b) => norm(a.palabra).indexOf(t) - norm(b.palabra).indexOf(t)).slice(0, 30) : [];
    res.innerHTML = l.map(p => `<button class="lm-li lm-sep tq" data-a="ok" data-v="${L.esc(p.palabra)}" style="width:100%;text-align:left">${L.pt(p.color, 40)}<div><b style="font-family:Gloock;font-weight:400;font-size:22px">${L.esc(p.palabra)}</b><small>${L.esc(p.def)}</small></div></button>`).join('') +
      `<div class="lm-card" style="margin-top:18px"><b>¿No está tu palabra?</b><small>Añade la tuya y elige dónde va.</small><button class="lm-pill tq" data-a="nueva">Añadir palabra</button></div>`;
    $$('.lm-li', res).forEach((e, i) => e.animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: L.rm ? 120 : 320, delay: Math.min(i, 6) * 35, easing: L.E, fill: 'backwards' }));
  };
  q.addEventListener('input', pintar); pintar();
  setTimeout(() => q.focus(), 560);
  const usar = async w => {
    q.blur();
    if (o.elegir) { o.elegir(w); L.cerrar(capa); return; }
    await L.abrir('registro', { flujo: 'emo', palabra: w, tipo: o.tipo || 'ahora' }, 'lado');
  };
  capa.acc = {
    ok: t => usar(t.dataset.v),
    nueva: () => L.hojaPalabra(q.value.trim(), w => { pintar(); usar(w); })
  };
};
/* hoja para añadir una palabra propia */
L.hojaPalabra = (inicial, alFin) => {
  let fam = 'calma';
  const h = L.hoja(`<h2 data-e>Una palabra tuya</h2><p class="lm-sub" data-e style="margin-bottom:14px">Elige dónde va en el campo: así toma su color.</p>
    <input class="lm-input" id="lm-np" data-e placeholder="La palabra" maxlength="22" value="${L.esc(L.may(inicial || ''))}">
    <input class="lm-input" id="lm-nd" data-e placeholder="Qué significa para ti (opcional)" maxlength="70">
    <div class="lm-chips" data-e style="margin:6px 0 20px">${Object.entries(L.FAM).map(([k, f]) => `<button class="lm-chip tq tq-i ${k === fam ? 'lm-si' : ''}" data-a="fam" data-v="${k}" style="gap:8px">${L.pt(L.rampa((f.t[0] + f.t[1]) / 2), 18)}${f.nombre}</button>`).join('')}</div>
    <button class="lm-btn tq tq-g" data-a="ok" data-e>Añadir palabra</button>`, {
    fam: t => { fam = t.dataset.v; $$('[data-a="fam"]', h.el).forEach(c => c.classList.toggle('lm-si', c === t)); },
    ok: (t, e, cerrar) => {
      const w = L.may($('#lm-np', h.el).value.trim()); if (!w) return;
      if (!L.palabras().find(p => p.palabra.toLowerCase() === w.toLowerCase())) { L.d.palabrasPropias.push({ palabra: w, familia: fam, def: $('#lm-nd', h.el).value.trim() }); L.guardar(); }
      cerrar(); alFin?.(w);
    }
  });
  return h;
};

/* ============================== REGISTRO: DETALLE DE LA PALABRA ============================== */
L.pantallas.registro = (el, o, capa) => {
  const p = L.palabra(o.palabra); let inf = [];
  el.innerHTML = `<div class="lm-hero" style="height:330px">${L.orb(p.color, 270, `left:50%;margin-left:-135px;top:calc(var(--st) + 26px);${o.heroOculto ? 'visibility:hidden' : ''}`, 'lm-reg-hero')}</div>
    ${L.top('atras', '', ['cerrar', 'x', 'Cerrar'])}
    <div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 262px)">
      <p class="lm-ms" data-e>${o.tipo === 'dia' ? 'Hoy me he sentido' : 'Me siento'}</p>
      <h1 class="lm-t1 lm-grande" data-e style="color:${L.textoDe(p.color)};font-size:${L.tamGrande(p.palabra)}px">${L.esc(L.minus(p.palabra))}</h1>
      <p class="lm-sub" data-e>${L.esc(p.def)}</p>
      <h3 class="lm-sec" data-e>¿Qué tiene que ver?</h3><div data-e>${L.chips(L.INFLUENCIAS, [], 'inf')}</div>
      <h3 class="lm-sec" data-e>¿Quieres apuntar algo?</h3><textarea class="lm-nota" data-e id="lm-nota" placeholder="Lo que quieras, o nada" rows="3"></textarea>
    </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="guardar">Guardar</button></div>`;
  L.entrar(el, o.heroOculto ? 330 : 200, 45);
  capa.acc = {
    inf: t => { const v = t.dataset.v; inf = inf.includes(v) ? inf.filter(x => x !== v) : [...inf, v]; t.classList.toggle('lm-si'); },
    guardar: async () => {
      const e = { id: L.id(), ts: Date.now(), palabra: p.palabra, tipo: o.tipo || 'ahora', influencias: inf, nota: $('#lm-nota', el).value.trim() };
      L.d.emociones.push(e); L.guardar(); L.refrescarRaiz();
      L.abrir(p.agradable ? 'saborear' : 'guardado', { flujo: 'emo', entrada: e }, 'fundido');
    }
  };
};

/* ============================== GUARDADO, CON AYUDA ============================== */
L.sugerir = palabra => {
  const fam = L.palabra(palabra).familia, ayudan = L.lasQueAyudan().filter(r => L.RECURSOS[r.id]).map(r => r.id);
  const base = fam === 'bajon' ? ['paseo', 'frases', 'hablar', 'respirar-despacio'] : ['respirar-despacio', 'cinco-sentidos', 'mirar-pensamiento'];
  return [...new Set([...ayudan.slice(0, 1), ...base])].slice(0, 3);
};
L.pantallas.guardado = (el, o, capa) => {
  const e = o.entrada, p = L.palabra(e.palabra), sug = L.sugerir(e.palabra);
  el.innerHTML = `<div class="lm-hero" style="height:300px">${L.orb(p.color, 250, 'left:50%;margin-left:-125px;top:calc(var(--st) + 20px)')}</div>
    ${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 244px)">
    <h1 class="lm-t1" data-e>Guardado</h1><p class="lm-sub" data-e style="font-size:16px;margin-bottom:16px">Sentirse ${L.esc(L.minus(p.palabra))} es una señal, no un fallo. ¿Te apetece probar algo ahora?</p>
    ${sug.map(id => { const r = L.RECURSOS[id], c = L.CATS.find(x => x.id === r.cat).c; return `<div data-e>${L.li(L.pt(c, 38), r.nombre, r.sub, `data-a="rec" data-v="${id}"`)}</div>`; }).join('')}
    <button class="lm-enlace tq" data-a="cerrar" data-e style="margin-top:6px">Ahora no, gracias</button></div></div>`;
  $('.lm-hero .lm-orb', el).animate([{ scale: .9 }, { scale: 1 }], { duration: 700, easing: L.E });
  L.entrar(el, 160);
  capa.acc = { rec: async t => { const id = t.dataset.v; await L.cerrarFlujo('emo'); L.abrirRecurso(id, { antes: e }); } };
};
/* ============================== SABOREAR LO AGRADABLE ============================== */
L.pantallas.saborear = (el, o, capa) => {
  const e = o.entrada, p = L.palabra(e.palabra);
  el.innerHTML = `<div class="lm-hero" style="height:460px">${L.orb(p.color, 390, 'left:50%;margin-left:-195px;top:calc(var(--st) + 30px)')}</div>
    ${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}
    <div class="lm-pad" style="position:absolute;left:0;right:0;top:calc(var(--st) + 410px);padding-top:0">
      <h1 class="lm-t1" data-e>Quédate un momento con esto</h1><p class="lm-sub" data-e style="font-size:16px">Las emociones agradables duran más si les haces sitio. Respira tres veces pensando en ello.</p></div>
    <div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="mom" data-e>Guardarlo en Momentos</button><button class="lm-enlace tq" data-a="cerrar" data-e>Seguir con mi día</button></div>`;
  $('.lm-hero .lm-orb', el).animate([{ scale: .82, opacity: .4 }, { scale: 1, opacity: 1 }], { duration: 1100, easing: 'cubic-bezier(.16,.8,.2,1)' });
  L.entrar(el, 260);
  capa.acc = { mom: async () => { await L.cerrarFlujo('emo'); L.abrir('momentoNuevo', { palabra: e.palabra, texto: e.nota }, 'sube'); } };
};

/* ============================== UNA ENTRADA DEL DIARIO ============================== */
L.pantallas.entrada = (el, o, capa) => {
  const pintar = (editando) => {
    const e = L.d.emociones.find(x => x.id === o.id); if (!e) { L.cerrar(capa); return; }
    const p = L.palabra(e.palabra), d = new Date(e.ts);
    const hechos = L.d.recursos.filter(r => r.antes === e.id);
    el.innerHTML = `<div class="lm-hero" style="height:320px">${L.orb(p.color, 260, 'left:50%;margin-left:-130px;top:calc(var(--st) + 14px)')}</div>
      ${L.top('atras', '', editando ? null : ['editar', 'editar', 'Editar'])}
      <div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + 246px)">
        <p class="lm-ms" data-e>${L.cuando(d)} a las ${L.hora(e.ts)}${e.tipo === 'dia' ? ', el día' : ''}</p>
        <h1 class="lm-t1 lm-grande" data-e style="font-size:${L.tamGrande(p.palabra)}px">${L.esc(p.palabra)}</h1>
        <p class="lm-sub" data-e>${L.esc(p.def)}</p>
        <h3 class="lm-sec" data-e>Qué tuvo que ver</h3>
        <div data-e>${editando ? L.chips(L.INFLUENCIAS, e.influencias || [], 'inf') : (e.influencias || []).length ? L.chips(e.influencias, e.influencias, 'x') : '<p class="lm-nota-p">No apuntaste nada.</p>'}</div>
        <h3 class="lm-sec" data-e>Lo que apuntaste</h3>
        <div data-e>${editando ? `<textarea class="lm-nota" id="lm-nota" rows="3" placeholder="Lo que quieras">${L.esc(e.nota || '')}</textarea>` : e.nota ? `<div class="lm-nota" style="user-select:text;-webkit-user-select:text">${L.esc(e.nota)}</div>` : '<p class="lm-nota-p">Sin nota.</p>'}</div>
        ${hechos.length ? `<h3 class="lm-sec" data-e>Lo que hiciste</h3>${hechos.map(r => { const R = L.RECURSOS[r.recurso]; if (!R) return ''; return `<div data-e>${L.li(L.pt(L.CATS.find(c => c.id === R.cat).c, 36), R.nombre, ['No te ayudó', 'Te ayudó un poco', 'Te ayudó bastante'][r.ayudo] || '', '', 'lm-card', '')}</div>`; }).join('')}` : ''}
        ${editando ? `<button class="lm-btn tq tq-g" data-a="guardar" data-e style="margin-top:22px">Guardar los cambios</button>` : `<button class="lm-enlace lm-borrar tq" data-a="borrar" data-e style="margin-top:18px">Borrar esta entrada</button>`}
      </div></div>`;
    capa.e = e;
  };
  pintar(false); L.entrar(el, 180);
  let inf;
  capa.acc = {
    editar: () => { inf = [...(capa.e.influencias || [])]; pintar(true); L.entrar(el, 0, 30); },
    inf: t => { const v = t.dataset.v; inf = inf.includes(v) ? inf.filter(x => x !== v) : [...inf, v]; t.classList.toggle('lm-si'); },
    guardar: () => { capa.e.influencias = inf; capa.e.nota = $('#lm-nota', el).value.trim(); L.guardar(); pintar(false); L.entrar(el, 0, 30); L.toast('Cambios guardados'); },
    borrar: async () => {
      const e = capa.e, i = L.d.emociones.indexOf(e);
      L.d.emociones.splice(i, 1); L.guardar();
      await L.cerrar(capa);
      L.toast('Entrada borrada', () => { L.d.emociones.splice(i, 0, e); L.guardar(); L.refrescarRaiz(); L.capas.forEach(c => c.refrescar?.()); });
    }
  };
};

/* ============================== POR LA MAÑANA ============================== */
L.pantallas.manana = (el, o, capa) => {
  let sel = [];
  el.innerHTML = `<div class="lm-hero" style="height:330px">${L.orb(L.C.ale, 300, 'left:45px;top:-90px')}${L.orb(L.C.ene, 220, 'left:-70px;top:60px')}</div>
    ${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 210px)">
    <p class="lm-ms" data-e>${L.saludo()}</p><h1 class="lm-t1" data-e>¿Qué quieres cuidar hoy?</h1>
    <div data-e style="margin-top:12px">${L.chips(L.CUIDAR, [], 'c')}</div>
    <h3 class="lm-sec" data-e>Una cosa que te apetece de hoy</h3><input class="lm-input" data-e id="lm-ap" placeholder="Por ejemplo, comer con alguien" maxlength="90" enterkeyhint="done">
    </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok">Empezar el día</button></div>`;
  $$('.lm-hero .lm-orb', el).forEach((h, k) => h.animate([{ opacity: 0, translate: '0 46px', rotate: '8deg' }, { opacity: 1, translate: '0 0', rotate: '0deg' }], { duration: 900, delay: k * 120, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' }));
  L.entrar(el, 260);
  capa.acc = {
    c: t => { const v = t.dataset.v; sel = sel.includes(v) ? sel.filter(x => x !== v) : [...sel, v]; t.classList.toggle('lm-si'); },
    ok: () => {
      const f = L.hoy(); L.d.mananas = L.d.mananas.filter(m => m.fecha !== f);
      L.d.mananas.push({ fecha: f, cuidar: sel, apetece: $('#lm-ap', el).value.trim() }); L.guardar(); L.refrescarRaiz();
      L.cerrar(capa); L.toast('Que vaya bonito el día');
    }
  };
};
/* ============================== CERRAR EL DÍA ============================== */
L.pantallas.noche = (el, o, capa) => {
  const f = L.hoy(), es = L.emocionesDe(f), man = L.d.mananas.find(m => m.fecha === f);
  let cumplido = null;
  const listaPal = es.map(e => L.minus(e.palabra));
  const frase = listaPal.length > 1 ? L.may(listaPal.slice(0, -1).join(', ') + ' y ' + listaPal[listaPal.length - 1]) : listaPal.length ? L.may(listaPal[0]) : '';
  el.innerHTML = `<div class="lm-hero" style="height:310px">${L.orb(L.C.lil, 290, 'left:120px;top:-80px')}${L.orb(L.C.baj, 250, 'left:-60px;top:20px')}</div>
    ${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 200px)">
    <p class="lm-ms" data-e>Cerrar el día</p><h1 class="lm-t1" data-e>¿Qué te llevas de hoy?</h1>
    ${es.length ? `<div class="lm-card lm-fila" data-e style="margin-top:12px"><div><b>Tu día en ${es.length === 1 ? 'un momento' : L.enLetra(es.length) + ' momentos'}</b><small>${L.esc(frase)}</small></div><div style="display:flex">${es.slice(-5).map((e, i) => L.pt(L.colorDe(e.palabra), 44, i ? 'margin-left:-12px' : '')).join('')}</div></div>` : ''}
    <h3 class="lm-sec" data-e>Algo que ha salido bien</h3><textarea class="lm-nota" data-e id="lm-bien" rows="3" placeholder="Aunque sea pequeño"></textarea>
    ${man && man.cuidar.length ? `<h3 class="lm-sec" data-e>Por la mañana querías cuidar ${L.esc(man.cuidar.map(L.minus).join(' y '))}</h3><div data-e>${L.chips(L.CUMPLIDO, [], 'cu')}</div>` : ''}
    </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok">Cerrar el día</button></div>`;
  $$('.lm-hero .lm-orb', el).forEach((h, k) => h.animate([{ opacity: 0, translate: '0 46px', rotate: '-8deg' }, { opacity: 1, translate: '0 0', rotate: '0deg' }], { duration: 900, delay: k * 120, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' }));
  L.entrar(el, 260);
  capa.acc = {
    cu: t => { cumplido = t.dataset.v; $$('[data-a="cu"]', el).forEach(c => c.classList.toggle('lm-si', c === t)); },
    ok: () => {
      L.d.noches = L.d.noches.filter(n => n.fecha !== f);
      L.d.noches.push({ fecha: f, bien: $('#lm-bien', el).value.trim(), cumplido }); L.guardar(); L.refrescarRaiz();
      L.cerrar(capa); L.toast('Día cerrado. Que descanses.');
    }
  };
};

/* ============================== MOMENTOS ============================== */
L.pantallas.momentos = (el, o, capa) => {
  const pintar = entrada => {
    const ms = [...L.d.momentos].sort((a, b) => b.ts - a.ts), n = ms.length;
    el.innerHTML = `${L.top('atras', '', ['nuevo', 'mas', 'Momento nuevo'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Momentos</h1>
      <p class="lm-sub" data-e>${n ? `${L.may(n <= 20 ? L.enLetra(n) : String(n))} ${n === 1 ? 'cosa buena guardada' : 'cosas buenas guardadas'}. Vuelve a ellas cuando lo necesites.` : 'Aquí guardas lo bueno: una risa, un paseo, algo que salió bien. Para volver cuando lo necesites.'}</p>
      ${n ? `<div class="lm-moms">${[0, 1].map(col => `<div>${ms.filter((_, k) => k % 2 === col).map(m => { const c = m.palabra ? L.colorDe(m.palabra) : L.C.ale; return `<button class="lm-mom tq tq-g" data-a="ver" data-id="${m.id}" data-e="p" style="width:100%;text-align:left;min-height:${110 + (m.texto.length > 40 ? 30 : 0)}px">${m.foto ? `<img alt="" data-foto="${m.id}">` : `<div class="lm-vis">${L.orb(c, 170, 'right:-60px;bottom:-70px')}</div>`}<b>${L.esc(m.texto)}</b><small>${L.cuando(new Date(m.ts))}</small></button>`; }).join('')}</div>`).join('')}</div>`
        : `<button class="lm-btn tq tq-g" data-a="nuevo" data-e style="margin-top:24px">Guardar un momento</button>`}
    </div></div>`;
    $$('img[data-foto]', el).forEach(async im => { const d = await L.fotos.leer(im.dataset.foto); if (d) im.src = d; else im.remove(); });
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.refrescar = () => pintar(false);
  capa.acc = { nuevo: () => L.abrir('momentoNuevo', {}, 'sube'), ver: t => L.abrir('momento', { id: t.dataset.id }) };
};
L.pantallas.momento = (el, o, capa) => {
  const m = L.d.momentos.find(x => x.id === o.id); if (!m) return;
  const c = m.palabra ? L.colorDe(m.palabra) : L.C.ale;
  el.innerHTML = `${m.foto ? '' : `<div class="lm-hero" style="height:320px">${L.orb(c, 280, 'left:50%;margin-left:-140px;top:calc(var(--st) + 10px)')}</div>`}
    ${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + ${m.foto ? 76 : 240}px)">
    ${m.foto ? `<img data-e alt="" id="lm-mf" style="display:block;width:100%;border-radius:28px;margin-bottom:20px;aspect-ratio:4/3;object-fit:cover;background:var(--bg2)">` : ''}
    <p class="lm-ms" data-e>${L.cuando(new Date(m.ts))}</p>
    <h1 class="lm-t1" data-e style="font-size:34px;margin-top:8px;user-select:text;-webkit-user-select:text">${L.esc(m.texto)}</h1>
    ${(m.con || []).length ? `<h3 class="lm-sec" data-e>Con quién</h3><div data-e>${L.chips(m.con, m.con, 'x')}</div>` : ''}
    ${m.palabra ? `<h3 class="lm-sec" data-e>Cómo te hizo sentir</h3><div class="lm-fila" data-e>${L.pt(c, 40)}<b style="font-family:Gloock;font-weight:400;font-size:22px">${L.esc(m.palabra)}</b></div>` : ''}
    <button class="lm-enlace lm-borrar tq" data-a="borrar" data-e style="margin-top:26px">Borrar este momento</button></div></div>`;
  if (m.foto) L.fotos.leer(m.id).then(d => { if (d) $('#lm-mf', el).src = d; });
  L.entrar(el, 200);
  capa.acc = {
    borrar: async () => {
      const i = L.d.momentos.indexOf(m); L.d.momentos.splice(i, 1); L.guardar();
      await L.cerrar(capa);
      let deshecho = false;
      L.toast('Momento borrado', () => { deshecho = true; L.d.momentos.splice(i, 0, m); L.guardar(); L.refrescarRaiz(); L.capas.forEach(c => c.refrescar?.()); });
      setTimeout(() => { if (!deshecho && m.foto) L.fotos.quitar(m.id); }, 6000);
    }
  };
};
/* reduce la foto a 1000 px en JPEG */
L.reducirFoto = file => new Promise((ok, ko) => {
  const url = URL.createObjectURL(file), im = new Image();
  im.onload = () => {
    const k = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas');
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    ok(c.toDataURL('image/jpeg', .82));
  };
  im.onerror = ko; im.src = url;
});
L.pantallas.momentoNuevo = (el, o, capa) => {
  let con = [], palabra = o.palabra || 'A gusto', foto = null;
  const nombres = [...L.d.personas].sort((a, b) => L.apellido(a.nombre).localeCompare(L.apellido(b.nombre), 'es')).map(p => p.nombre.split(' ')[0]);
  el.innerHTML = `${L.top(null, 'Momento nuevo', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h1 class="lm-t1" data-e>¿Qué ha sido bonito?</h1>
    <textarea class="lm-nota lm-gloock" data-e id="lm-mt" rows="3" placeholder="Escríbelo como lo recordarías" maxlength="160">${L.esc(o.texto || '')}</textarea>
    <label class="lm-fotoz tq tq-g" data-e id="lm-fz">${L.ic('foto', 24)}<span>Añadir una foto</span><input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0"></label>
    <h3 class="lm-sec" data-e>¿Con quién?</h3><div data-e>${L.chips([...new Set([...nombres, ...L.CON])], [], 'con')}</div>
    <h3 class="lm-sec" data-e>¿Cómo te hizo sentir?</h3>
    <div class="lm-fila" data-e id="lm-ps">${L.pt(L.colorDe(palabra), 40)}<b style="font-family:Gloock;font-weight:400;font-size:22px">${L.esc(palabra)}</b><button class="lm-pill tq" data-a="cambiar" style="margin:0">Cambiar</button></div>
    </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok">Guardar momento</button></div>`;
  L.entrar(el, 300);
  const inp = $('#lm-fz input', el);
  inp.addEventListener('change', async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      foto = await L.reducirFoto(f);
      const z = $('#lm-fz', el); z.querySelectorAll('svg,span,img').forEach(x => x.remove());
      const im = document.createElement('img'); im.src = foto; z.prepend(im);
      im.animate([{ opacity: 0, scale: .96 }, { opacity: 1, scale: 1 }], { duration: 460, easing: L.E });
    } catch (e) { L.toast('No se ha podido abrir esa foto.'); }
  });
  capa.acc = {
    con: t => { const v = t.dataset.v; con = con.includes(v) ? con.filter(x => x !== v) : [...con, v]; t.classList.toggle('lm-si'); },
    cambiar: () => L.abrir('campo', { elegir: w => { palabra = w; const r = $('#lm-ps', el); r.firstElementChild.outerHTML = L.pt(L.colorDe(w), 40); L.rodar(r.querySelector('b'), w, true); }, inicio: palabra }, 'fundido'),
    ok: async () => {
      const texto = $('#lm-mt', el).value.trim(); if (!texto) { $('#lm-mt', el).focus(); return; }
      const m = { id: L.id(), ts: Date.now(), texto, con, palabra, foto: !!foto };
      if (foto) { try { await L.fotos.poner(m.id, foto); } catch (e) { m.foto = false; L.toast('La foto no se ha podido guardar.'); } }
      L.d.momentos.push(m); L.guardar(); L.refrescarRaiz();
      await L.cerrar(capa); L.toast('Guardado en Momentos');
    }
  };
};
L.tamGrande = w => Math.round(Math.min(58, 338 / (w.length * .55)));
/* para ordenar personas por apellido */
L.apellido = n => { const p = n.trim().split(/\s+/); return (p.length > 1 ? p.slice(1).join(' ') : p[0]).toLowerCase(); };
