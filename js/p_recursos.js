/* Lumos 1.1.0 · recursos para el momento */
'use strict';
const colorCat = id => L.CATS.find(c => c.id === L.RECURSOS[id].cat).c;
const deCat = cat => Object.entries(L.RECURSOS).filter(([, r]) => r.cat === cat);
const cuantos = (n, cosa) => `${L.may(L.enLetra(n))} ${cosa}${n === 1 ? '' : 's'}`;

L.vistas.recursos = el => {
  const top = L.lasQueAyudan()[0];
  const subCat = c => c.id === 'hablar' ? 'Tus personas' : c.id === 'frases' ? 'Las tuyas y otras' : c.id === 'moverse' ? cuantos(deCat(c.id).length, 'idea') : cuantos(deCat(c.id).length, 'ejercicio');
  el.innerHTML = `<div class="lm-pad">
    <h1 class="lm-t1" data-e style="margin-bottom:14px">Recursos</h1>
    <div data-e>${top ? L.li(L.pt(colorCat(top.id), 40), 'Lo que más te ayuda', `${L.RECURSOS[top.id].nombre} te ha servido ${top.si} de ${top.n} veces`, `data-a="rec" data-v="${top.id}"`)
      : L.li(L.pt(L.C.baj, 40), 'Lo que más te ayuda', 'Cuando pruebes alguno, Lumos aprenderá qué te sirve a ti.', '', 'lm-card', '')}</div>
    <div class="lm-cats" style="margin-top:4px">${L.CATS.map(c => `<button class="lm-cat tq tq-g" data-a="cat" data-v="${c.id}" data-e="p" style="text-align:left"><div class="lm-vis">${L.orb(c.c, 156, 'right:-48px;top:-48px')}</div><b>${c.nombre}</b><small>${subCat(c)}</small></button>`).join('')}</div>
    <div data-e style="margin-top:14px">${L.li(`<span style="color:var(--mu)">${L.ic('telefono', 20)}</span>`, 'Si lo estás pasando muy mal', 'Llamar al 024, tus personas y tu plan', 'data-a="ayuda"')}</div>
    <p class="lm-nota-p" data-e style="margin-top:4px">Después te pregunto si te ha ayudado, para recordar qué te sirve a ti.</p>
  </div>`;
  return {
    rec: t => L.abrirRecurso(t.dataset.v),
    cat: t => { const id = t.dataset.v; id === 'hablar' ? L.abrirRecurso('hablar') : id === 'frases' ? L.abrirRecurso('frases') : L.abrir('categoria', { cat: id }); },
    ayuda: () => L.abrir('ayuda')
  };
};
L.pantallas.categoria = (el, o, capa) => {
  const c = L.CATS.find(x => x.id === o.cat), lista = deCat(o.cat), ay = L.lasQueAyudan();
  el.innerHTML = `<div class="lm-hero" style="height:260px">${L.orb(c.c, 260, 'right:-70px;top:-80px')}</div>${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra" style="padding-top:calc(var(--st) + 110px)">
    <h1 class="lm-t1" data-e>${c.nombre}</h1>
    <p class="lm-sub" data-e style="margin-bottom:16px">${{ respirar: 'Respirar más despacio le dice al cuerpo que puede bajar el ritmo.', cuerpo: 'Cuando la cabeza va muy rápido, el cuerpo te trae al presente.', pensamiento: 'Mirar lo que te dices, sin creértelo del todo.', moverse: 'Mover el cuerpo un poco cambia cómo te sientes.' }[o.cat] || ''}</p>
    ${lista.map(([id, r]) => { const a = ay.find(x => x.id === id); return `<div data-e>${L.li(L.pt(c.c, 38), r.nombre, r.sub + (a ? ` · te ha servido ${a.si} de ${a.n}` : ''), `data-a="rec" data-v="${id}"`)}</div>`; }).join('')}
    ${o.cat === 'pensamiento' ? `<div data-e>${L.li(L.pt(c.c, 38), 'Las trampas del pensamiento', 'Conocerlas para verlas', 'data-a="trampas"')}</div><div data-e>${L.li(L.pt(c.c, 38), 'Tus otras formas de verlo', 'Cómo miraste otras veces lo que te decías', 'data-a="otras"')}</div>` : ''}
  </div></div>`;
  L.entrar(el, 180, 55);
  capa.acc = { rec: t => L.abrirRecurso(t.dataset.v), trampas: () => L.abrir('trampas'), otras: () => L.abrir('otrasFormas') };
};
L.abrirRecurso = (id, op = {}) => {
  const R = L.RECURSOS[id]; if (!R) return;
  const o = { flujo: 'rec', id, antes: op.antes || null };
  if (R.tipo === 'respirar') return L.abrir('respirar', o, 'sube');
  if (R.tipo === 'pasos') return L.abrir('pasos', o, 'sube');
  if (R.tipo === 'pensamiento') return L.abrir('pensamiento', o, 'sube');
  if (R.tipo === 'hecho') return L.abrir('hecho', o, 'sube');
  if (R.tipo === 'hablar') return L.abrir('hablar', o, 'lado');
  if (R.tipo === 'frases') return L.abrir('frases', o, 'lado');
  if (R.tipo === 'vaciar') return L.abrir('vaciar', {}, 'sube');
};

/* ============================== RESPIRAR ============================== */
L.pantallas.respirar = (el, o, capa) => {
  const R = L.RECURSOS[o.id], c = L.C.baj;
  const ciclo = R.fases.reduce((s, f) => s + f[1], 0);
  el.innerHTML = `<div style="position:absolute;inset:0;overflow:hidden">${L.orb(c, 520, '', 'lm-resp-orb')}<i class="lm-resp-aro" style="border-color:${c}"></i></div>
    ${L.top('x', R.nombre)}
    <div class="lm-centro"><h1 id="lm-rf">Cuando quieras</h1><p class="lm-cuenta lm-num" id="lm-rc">&nbsp;</p></div>
    <div class="lm-abajo" style="text-align:center"><div id="lm-rprog" style="opacity:0"><div class="lm-prog"><i></i></div><p class="lm-sub lm-num" style="margin-top:12px">Quedan <span id="lm-rq" style="display:inline-block;min-width:18px">${R.dur}</span> segundos</p></div>
      <button class="lm-btn tq tq-g" data-a="empezar" id="lm-rb" style="position:absolute;left:0;right:0;bottom:0">Empezar</button></div>`;
  const orb = $('.lm-resp-orb', el), prog = $('.lm-prog i', el), S0 = .54, S1 = 1;
  orb.style.transform = `scale(${S0})`;
  if (!L.rm) orb.animate([{ opacity: 0, scale: .8 }, { opacity: 1, scale: 1 }], { duration: 900, easing: L.E });
  let t0 = null, raf = null, ultF = -1, ultS = '', ultQ = -1, fin = false;
  const ease = t => .5 - .5 * Math.cos(Math.PI * t);
  const FIN = []; { let cur = S0; R.fases.forEach(([n], i) => { const e = n === 'Inspira' ? (R.fases[i + 1]?.[0] === 'Un poco más' ? .88 : S1) : n === 'Un poco más' ? S1 : n === 'Suelta' ? S0 : cur; FIN.push(e); cur = e; }); }
  const paso = now => {
    const t = (now - t0) / 1000;
    if (t >= R.dur) { terminar(); return; }
    let k = t % ciclo, i = 0; while (k >= R.fases[i][1]) { k -= R.fases[i][1]; i++; }
    const [nom, dur] = R.fases[i], p = k / dur;
    const ini = FIN[(i - 1 + FIN.length) % FIN.length], s = ini + (FIN[i] - ini) * ease(p);
    orb.style.transform = `scale(${s.toFixed(4)})`;
    const fid = Math.floor(t / ciclo) * 10 + i, seg = Math.ceil(dur - k);
    if (fid !== ultF) { ultF = fid; L.rodar($('#lm-rf', el), nom, true); }
    if (fid + '-' + seg !== ultS) { ultS = fid + '-' + seg; L.rodar($('#lm-rc', el), String(seg), false); }
    prog.style.scale = `${(t / R.dur).toFixed(4)} 1`;
    const q = Math.ceil(R.dur - t); if (q !== ultQ) { ultQ = q; L.rodar($('#lm-rq', el), String(q), false); }
    raf = requestAnimationFrame(paso);
  };
  const terminar = () => {
    if (fin) return; fin = true; cancelAnimationFrame(raf);
    prog.style.scale = '1 1';
    L.rodar($('#lm-rf', el), 'Bien hecho', true); L.rodar($('#lm-rc', el), ' ', true);
    L.anim(orb, [{ transform: orb.style.transform }, { transform: `scale(${(S0 + S1) / 2})` }], { duration: 1200, easing: L.E });
    const b = $('#lm-rb', el); b.style.pointerEvents = ''; b.dataset.a = 'seguir'; b.textContent = 'Seguir';
    L.anim($('#lm-rprog', el), [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: L.S });
    L.anim(b, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: L.E });
  };
  capa.acc = {
    empezar: async t => {
      L.anim(t, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: L.S }).then(() => t.style.pointerEvents = 'none');
      L.anim($('#lm-rprog', el), [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 460, delay: 120, easing: L.E });
      prog.animate([{ scale: '0 1' }, { scale: '0 1' }], { duration: 10 });
      t0 = performance.now(); raf = requestAnimationFrame(paso);
    },
    seguir: () => L.abrir('ayudo', o, 'fundido')
  };
  capa.alCerrar = () => cancelAnimationFrame(raf);
};

/* ============================== PASOS ============================== */
L.pantallas.pasos = (el, o, capa) => {
  const R = L.RECURSOS[o.id], N = R.pasos.length; let i = 0;
  const cuerpo = k => { const p = R.pasos[k]; return `<h1 class="lm-t1">${p.t}</h1><p class="lm-sub" style="margin-bottom:18px">${p.s}</p>${p.n ? [...Array(p.n)].map((_, j) => `<input class="lm-input ${j ? 'lm-vac' : ''}" placeholder="${j === 0 ? 'Escribe aquí' : j === p.n - 1 && p.n > 1 ? 'Y otra más' : 'Escribe otra'}" maxlength="80">`).join('') : ''}`; };
  el.innerHTML = `${L.top('atras', R.nombre, ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <div class="lm-pasos" data-e>${R.pasos.map((_, k) => `<i class="${k === 0 ? 'lm-h' : ''}"></i>`).join('')}</div>
    <div id="lm-paso" data-e>${cuerpo(0)}</div></div></div>
    <div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="sig"><span id="lm-pb" style="display:inline-block;position:relative">${N > 1 ? 'Siguiente' : 'Terminar'}</span></button></div>`;
  L.entrar(el, 300);
  $$('.lm-input', el).forEach(inp => inp.addEventListener('input', () => inp.classList.toggle('lm-vac', !inp.value && inp !== $('.lm-input', el))));
  const ir = async (n, dir) => {
    const c = $('#lm-paso', el);
    await L.anim(c, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `${-22 * dir}px 0` }], { duration: 200, easing: L.S });
    i = n; c.innerHTML = cuerpo(i);
    $$('.lm-input', c).forEach((inp, j) => inp.addEventListener('input', () => { if (j) inp.classList.toggle('lm-vac', !inp.value); }));
    $$('.lm-pasos i', el).forEach((s, k) => s.classList.toggle('lm-h', k <= i));
    L.rodar($('#lm-pb', el), i === N - 1 ? 'Terminar' : 'Siguiente', true);
    await L.anim(c, [{ opacity: 0, translate: `${22 * dir}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 420, easing: L.E });
    c.style.opacity = ''; c.style.translate = '';
    $('.lm-scroll', el).scrollTop = 0;
  };
  capa.acc = {
    sig: () => { document.activeElement?.blur(); i < N - 1 ? ir(i + 1, 1) : L.abrir('ayudo', o, 'fundido'); },
    atras: () => i > 0 ? ir(i - 1, -1) : L.cerrar(capa)
  };
};

/* ============================== MIRAR EL PENSAMIENTO ============================== */
L.pantallas.pensamiento = (el, o, capa) => {
  let sel = [];
  el.innerHTML = `${L.top('atras', 'Mirar el pensamiento', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h3 class="lm-sec" data-e style="margin-top:0">Lo que te estás diciendo</h3><textarea class="lm-nota lm-gloock" data-e id="lm-dice" rows="3" placeholder="Escríbelo tal cual te suena por dentro"></textarea>
    <h3 class="lm-sec" data-e>¿Reconoces alguna trampa?</h3><div data-e>${L.chips(L.TRAMPAS.map(t => t[0]), [], 'tr')}</div>
    <div id="lm-trx"></div>
    <h3 class="lm-sec" data-e>Otra forma de verlo</h3><textarea class="lm-nota" data-e id="lm-otra" rows="3" placeholder="¿Qué le dirías a un amigo que piensa esto?"></textarea>
  </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok">Guardar</button></div>`;
  L.entrar(el, 300);
  capa.acc = {
    tr: t => {
      const v = t.dataset.v, on = !sel.includes(v); sel = on ? [...sel, v] : sel.filter(x => x !== v); t.classList.toggle('lm-si', on);
      const z = $('#lm-trx', el), ult = sel[sel.length - 1];
      if (!ult) { const c = $('.lm-card', z); if (c) L.anim(c, [{ opacity: 1 }, { opacity: 0, scale: .94 }], { duration: 220, easing: L.S }).then(() => z.innerHTML = ''); return; }
      const def = L.TRAMPAS.find(x => x[0] === ult)[1];
      const otra = L.otrasFormas(ult)[0];
      z.innerHTML = `<div class="lm-card" style="margin-top:12px"><b>${ult}</b><small>${def}</small></div>${otra ? `<div class="lm-card" style="margin-top:8px"><b>La otra vez que viste esta trampa</b><small>Lo miraste así:</small><p style="font-family:Gloock;font-size:19px;line-height:1.25;margin-top:6px">${L.esc(otra.nota.otra)}</p><small style="margin-top:6px">${L.cuando(new Date(otra.ts))}</small></div>` : ''}`;
      $$('.lm-card', z).forEach((c, k) => L.anim(c, [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 460, delay: k * 60, easing: L.E }));
      if (false) L.anim($('.lm-card', z), [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: L.E });
    },
    ok: () => { o.nota = { dice: $('#lm-dice', el).value.trim(), trampas: sel, otra: $('#lm-otra', el).value.trim() }; document.activeElement?.blur(); L.abrir('ayudo', o, 'fundido'); }
  };
};
L.pantallas.trampas = (el, o, capa) => {
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
    <h1 class="lm-t1" data-e>Las trampas del pensamiento</h1><p class="lm-sub" data-e style="margin-bottom:16px">Todos caemos en ellas. Ponerles nombre ayuda a no creérselas del todo.</p>
    ${L.TRAMPAS.map(([n, d]) => `<div class="lm-card" data-e style="margin-bottom:9px"><b>${n}</b><small>${d}</small></div>`).join('')}
    <button class="lm-btn tq tq-g" data-a="probar" data-e style="margin-top:14px">Mirar un pensamiento</button></div></div>`;
  L.entrar(el, 200, 55);
  capa.acc = { probar: () => L.abrirRecurso('mirar-pensamiento') };
};

/* ============================== HACERLO (moverse) ============================== */
L.pantallas.hecho = (el, o, capa) => {
  const R = L.RECURSOS[o.id], c = colorCat(o.id);
  el.innerHTML = `<div class="lm-hero" style="height:420px">${L.orb(c, 360, 'left:50%;margin-left:-180px;top:calc(var(--st) + 20px)')}</div>${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}
    <div class="lm-pad" style="position:absolute;left:0;right:0;top:calc(var(--st) + 360px);padding-top:0">
    <p class="lm-ms" data-e>${R.sub.split(' · ')[0]}</p><h1 class="lm-t1" data-e>${R.nombre}</h1><p class="lm-sub" data-e style="font-size:17px">${R.texto}</p></div>
    <div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok" data-e>Lo he hecho</button><button class="lm-enlace tq" data-a="cerrar" data-e>Ahora no</button></div>`;
  $('.lm-hero .lm-orb', el).animate([{ opacity: 0, translate: '0 46px', rotate: '9deg' }, { opacity: 1, translate: '0 0', rotate: '0deg' }], { duration: 900, easing: 'cubic-bezier(.16,.8,.2,1)' });
  L.entrar(el, 300);
  capa.acc = { ok: () => L.abrir('ayudo', o, 'fundido') };
};

/* ============================== HABLAR CON ALGUIEN ============================== */
L.ordenPersonas = () => [...L.d.personas].sort((a, b) => L.apellido(a.nombre).localeCompare(L.apellido(b.nombre), 'es'));
L.telLimpio = t => (t || '').replace(/[^\d+]/g, '');
L.pantallas.hablar = (el, o, capa) => {
  const pintar = entrada => {
    const ps = L.ordenPersonas();
    el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Hablar con alguien</h1><p class="lm-sub" data-e style="margin-bottom:16px">No hace falta contarlo todo. A veces basta con un «¿tienes un rato?».</p>
      ${ps.length ? ps.map((p, i) => `<div data-e>${L.li(`<span class="lm-av">${L.esc(p.nombre[0] || '?')}</span>`, L.esc(p.nombre), p.tel ? 'Llamar o escribir' : 'Sin teléfono', `data-a="per" data-i="${L.d.personas.indexOf(p)}"`)}</div>`).join('')
        : `<div class="lm-card" data-e><b>Aún no tienes personas de confianza</b><small>Añade a quien te gustaría tener a mano en un mal momento.</small><button class="lm-pill tq" data-a="anadir">Añadir una persona</button></div>`}
      ${ps.length ? `<button class="lm-enlace tq" data-a="anadir" data-e>Añadir otra persona</button>` : ''}
      <h3 class="lm-sec" data-e>Para empezar la conversación</h3>
      ${['¿Tienes un rato para hablar?', 'Hoy no estoy muy bien. ¿Me llamas cuando puedas?', 'No necesito que me arregles nada, solo charlar un poco.'].map(f => `<div class="lm-card" data-e style="margin-bottom:8px;font-family:Gloock;font-size:19px;line-height:1.25">${f}</div>`).join('')}
      <button class="lm-btn tq tq-g" data-a="hecho" data-e style="margin-top:16px">Ya he hablado con alguien</button>
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.refrescar = () => pintar(false);
  capa.acc = {
    per: t => L.hojaPersona(L.d.personas[+t.dataset.i]),
    anadir: () => L.editarPersona(null, () => pintar(false)),
    hecho: () => L.abrir('ayudo', o, 'fundido')
  };
};
L.hojaPersona = p => {
  const tel = L.telLimpio(p.tel), msj = encodeURIComponent('Hola, ¿tienes un rato para hablar?');
  L.hoja(`<div class="lm-fila" data-e style="margin-bottom:18px"><span class="lm-av" style="width:54px;height:54px;font-size:24px">${L.esc(p.nombre[0])}</span><div><h2 style="margin:0">${L.esc(p.nombre)}</h2><p class="lm-sub">${L.esc(p.tel || 'Sin teléfono')}</p></div></div>
    ${tel ? `<a class="lm-btn tq tq-g" data-e href="tel:${tel}">${L.ic('telefono', 20)}Llamar</a>
    <a class="lm-btn lm-sec2 tq tq-g" data-e href="sms:${tel}&body=${msj}" style="margin-top:10px">${L.ic('mensaje', 20)}Escribir un mensaje</a>` : `<p class="lm-sub" data-e>Añade su teléfono en Ajustes, en Mis personas.</p>`}`);
};

/* ============================== FRASES ============================== */
L.pantallas.frases = (el, o, capa) => {
  const pintar = entrada => {
    const propias = L.d.frasesPropias || [];
    el.innerHTML = `<div class="lm-hero" style="height:260px">${L.orb(L.C.cal, 260, 'right:-70px;top:-80px')}</div>${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + 110px)">
      <h1 class="lm-t1" data-e>Frases que ayudan</h1><p class="lm-sub" data-e style="margin-bottom:16px">Léelas despacio. Quédate con la que hoy te sirva.</p>
      ${propias.length ? `<h3 class="lm-sec" data-e style="margin-top:0">Las tuyas</h3>${propias.map((f, i) => `<div class="lm-card lm-frase" data-e style="margin-bottom:9px;display:flex;gap:10px;align-items:flex-start"><span style="flex:1">${L.esc(f)}</span><button class="tq tq-i" data-a="quitar" data-i="${i}" aria-label="Borrar" style="color:var(--coral);padding:4px">${L.ic('borrar', 18)}</button></div>`).join('')}<h3 class="lm-sec" data-e>Otras</h3>` : ''}
      ${L.FRASES.map(f => `<div class="lm-card lm-frase" data-e style="margin-bottom:9px">${f}</div>`).join('')}
      <button class="lm-btn lm-sec2 tq tq-g" data-a="nueva" data-e style="margin-top:14px">Añadir una frase tuya</button>
      <button class="lm-btn tq tq-g" data-a="hecho" data-e style="margin-top:10px">Me han ayudado a parar</button>
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.acc = {
    nueva: () => { const h = L.hoja(`<h2 data-e>Una frase tuya</h2><p class="lm-sub" data-e style="margin-bottom:14px">Algo que te diría alguien que te quiere, o que te dices tú en un buen día.</p><textarea class="lm-nota lm-gloock" id="lm-fr" data-e rows="3" maxlength="140"></textarea><button class="lm-btn tq tq-g" data-a="ok" data-e style="margin-top:16px">Añadir frase</button>`, { ok: (t, e, c) => { const v = $('#lm-fr', h.el).value.trim(); if (!v) return; L.d.frasesPropias = [v, ...(L.d.frasesPropias || [])]; L.guardar(); c(); pintar(false); } }); },
    quitar: t => { const i = +t.dataset.i, f = L.d.frasesPropias[i]; L.d.frasesPropias.splice(i, 1); L.guardar(); pintar(false); L.toast('Frase borrada', () => { L.d.frasesPropias.splice(i, 0, f); L.guardar(); pintar(false); }); },
    hecho: () => L.abrir('ayudo', o, 'fundido')
  };
};

/* ============================== ¿TE HA AYUDADO? ============================== */
L.pantallas.ayudo = (el, o, capa) => {
  let antes = o.antes;
  if (!antes) { const ult = [...L.d.emociones].sort((a, b) => b.ts - a.ts)[0]; if (ult && Date.now() - ult.ts < 3 * 36e5) antes = ult; }
  let ayudo = null, ahora = null;
  const orbAhora = () => ahora ? L.orb(L.colorDe(ahora), 130) : `<button class="tq tq-g" data-a="ahora" style="width:110px;height:110px;margin:10px;border-radius:50%;border:1.5px dashed var(--lin2);color:var(--mu);font-size:13.5px;line-height:1.25">¿Y ahora?</button>`;
  el.innerHTML = `${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop" style="text-align:center">
    <h1 class="lm-t1" data-e>¿Te ha ayudado?</h1><p class="lm-sub" data-e>Así recuerdo qué te sirve a ti.</p>
    <div class="lm-antes" data-e>${antes ? L.orb(L.colorDe(antes.palabra), 130) : ''}${antes ? `<span style="color:var(--mu)">${L.ic('flecha', 22)}</span>` : ''}<span id="lm-ah">${orbAhora()}</span></div>
    <div class="lm-antes-t" data-e style="${antes ? '' : 'justify-content:center'}">${antes ? `<span>Antes, ${L.esc(L.minus(antes.palabra))}</span>` : ''}<span id="lm-aht">${ahora ? 'Ahora, ' + L.minus(ahora) : 'Toca para elegir'}</span></div>
    <div class="lm-tres" data-e>${['Nada', 'Un poco', 'Bastante'].map((t, i) => `<button class="tq tq-g" data-a="ay" data-v="${i}">${t}</button>`).join('')}</div>
  </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g lm-off" data-a="ok">Hecho</button><button class="lm-enlace tq" data-a="ahora">Cambiar cómo estoy ahora</button></div>`;
  L.entrar(el, 120, 60);
  capa.acc = {
    ay: t => { ayudo = +t.dataset.v; $$('[data-a="ay"]', el).forEach(b => b.classList.toggle('lm-on', b === t)); $('[data-a="ok"]', el).classList.remove('lm-off'); },
    ahora: () => L.abrir('campo', {
      inicio: 'Tranquilo', elegir: w => {
        ahora = w; const z = $('#lm-ah', el); z.innerHTML = orbAhora();
        L.anim(z.firstElementChild, [{ opacity: 0, scale: .7 }, { opacity: 1, scale: 1 }], { duration: 520, easing: L.M });
        L.rodar($('#lm-aht', el), 'Ahora, ' + L.minus(w), true);
      }
    }, 'fundido'),
    ok: async () => {
      if (ayudo == null) return;
      let despues = null;
      if (ahora) { const e = { id: L.id(), ts: Date.now(), palabra: ahora, tipo: 'ahora', influencias: [], nota: '' }; L.d.emociones.push(e); despues = e.id; }
      L.d.recursos.push({ id: L.id(), ts: Date.now(), recurso: o.id, ayudo, antes: antes?.id || null, despues, nota: o.nota || null });
      L.guardar(); await L.cerrarFlujo('rec'); L.refrescarRaiz(); L.capas.forEach(c => c.refrescar?.());
      L.toast(ayudo ? 'Apuntado. Gracias por cuidarte.' : 'Apuntado. Otro día probamos otra cosa.');
    }
  };
};
