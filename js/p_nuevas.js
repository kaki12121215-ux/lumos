/* Lumos 1.1.0 · pantallas nuevas: señales tempranas, lo aprendido, mirar atrás, lo que sí he hecho,
   carta, atajos y Salud, hitos, medicación, tu mes, vaciar la cabeza, lo bueno de la semana… */
'use strict';
const colorFase = t => t === 'arriba' ? L.C.ene : L.C.baj;
const tiraFase = (f, alto = 34) => {
  const m = L.mapaAnimo(); let b = '';
  for (let d = L.deIso(f.inicio); d <= L.deIso(f.finEstable || f.fin); d = L.mas(d, 1)) {
    const a = m[L.iso(d)];
    b += a ? `<i style="height:${[12, 18, 24, 30, 36][a.nivel + 2] / 36 * alto}px;background:${L.NIV[a.nivel].c}"></i>` : `<i style="height:3px;background:var(--lin2)"></i>`;
  }
  return `<div class="lm-mtira" style="height:${alto}px">${b}</div>`;
};
const rangoFase = f => { const a = L.deIso(f.inicio), b = L.deIso(f.fin); return a.getMonth() === b.getMonth() ? `del ${a.getDate()} al ${b.getDate()} de ${L.MESES[b.getMonth()]}` : `del ${L.fechaCorta(a)} al ${L.fechaCorta(b)}`; };

/* ============================== TUS SEÑALES TEMPRANAS ============================== */
L.pantallas.senalesTempranas = (el, o, capa) => {
  const pintar = entrada => {
    const A = L.aprender(), ind = L.indicios(A), act = L.faseActual();
    const ahora = act && act.dias.length >= 3 ? `<div class="lm-card" data-e><b>Ahora estás en una ${L.nombreFase(act.tipo)}</b><small>Desde el ${L.fechaCorta(L.deIso(act.inicio))}. ${act.tipo === 'abajo' ? 'Los días mejores entre medias también cuentan, pero aún no la doy por terminada.' : 'Puede ser buen momento para bajar el ritmo y mirar tu plan.'}</small><button class="lm-pill tq" data-a="plan">Ver mi plan</button></div>`
      : ind.length ? ind.map(i => `<div class="lm-card" data-e style="margin-bottom:9px"><b>${L.tituloIndicio(i.tipo)}</b><small>${i.texto} No es un diagnóstico: míralo con calma.</small><button class="lm-pill tq" data-a="plan">Ver mi plan</button></div>`).join('')
      : `<div class="lm-card lm-fila" data-e>${L.pt(L.C.cal, 36)}<div><b>Ahora no veo nada parecido</b><small>Los últimos siete días no se parecen a lo que pasó antes de tus fases.</small></div></div>`;
    const bloque = t => {
      const n = A.n[t], ls = A[t].filter(s => s.conf !== false), desc = A[t].filter(s => s.conf === false);
      const plural = L.nombreFase(t, true);
      let cuerpo;
      if (!n) cuerpo = `<p class="lm-nota-p" data-e>Aún no hay ninguna ${L.nombreFase(t)} apuntada. Mientras tanto, uso las señales de tu plan${L.d.plan[t].length ? ':' : '.'}</p>${L.d.plan[t].map(x => `<div class="lm-lin" data-e>${L.ic('ok', 17)}<span>${L.esc(x)}</span></div>`).join('')}`;
      else if (!ls.length) cuerpo = `<p class="lm-nota-p" data-e>Antes de tus ${plural} no encuentro nada que se repita y que no pase también otros días. Con más días apuntados lo veré mejor.</p>`;
      else cuerpo = ls.map(s => `<div class="lm-card lm-senal" data-e><div class="lm-fila" style="align-items:flex-start"><div><b>${L.esc(L.textoSenal(s.clave))}</b><small>Antes de ${s.k} de tus ${s.n} ${plural}. En tus días normales, ${s.base < .1 ? 'casi nunca' : `${Math.round(s.base * 10)} de cada 10`}.</small></div></div>
        <div class="lm-bt" style="margin:10px 0 12px"><i style="width:${Math.round(s.tasa * 100)}%;background:${colorFase(t)}"></i></div>
        <div class="lm-chips"><button class="lm-chip tq tq-i ${s.conf === true ? 'lm-si' : ''}" data-a="conf" data-k="${t}|${L.esc(s.clave)}" data-v="si">Sí, me pasa</button><button class="lm-chip tq tq-i" data-a="conf" data-k="${t}|${L.esc(s.clave)}" data-v="no">No es mío</button></div></div>`).join('')
        + (n === 1 ? `<p class="lm-nota-p" data-e style="margin-top:4px">Con una sola ${L.nombreFase(t)} es pronto para sacar conclusiones.</p>` : '');
      return `<h3 class="lm-sec" data-e>Antes de tus ${plural}${n ? ` <span style="font-weight:400;color:var(--mu)">(${n})</span>` : ''}</h3>${cuerpo}
        ${desc.length ? `<p class="lm-nota-p" data-e style="margin-top:8px">Descartadas: ${desc.map(s => `<button class="tq" data-a="conf" data-k="${t}|${L.esc(s.clave)}" data-v="nada" style="text-decoration:underline;color:var(--mu2);font-size:13px">${L.esc(L.textoSenal(s.clave))}</button>`).join(', ')}</p>` : ''}`;
    };
    el.innerHTML = `<div class="lm-hero" style="height:250px">${L.orb(L.C.ene, 220, 'right:-60px;top:-70px')}${L.orb(L.C.baj, 200, 'right:90px;top:-100px')}</div>${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + 110px)">
      <h1 class="lm-t1" data-e>Tus señales tempranas</h1>
      <p class="lm-sub" data-e style="margin-bottom:16px">Lumos mira qué pasó en los siete días antes de cada subida y cada bajada, y lo compara con tus días normales. Lo que se repite antes y casi no pasa el resto del tiempo es una señal tuya.</p>
      <h3 class="lm-sec" data-e style="margin-top:0">Ahora mismo</h3>${ahora}
      ${bloque('arriba')}${bloque('abajo')}
      <div data-e style="margin-top:18px">${L.li(L.pt(L.C.lil, 36), 'Lo que he aprendido', 'Cada fase, cómo empezó y qué te ayudó', 'data-a="aprendido"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('doc')}</span>`, 'Mi plan para días malos', 'Señales escritas por ti y lo que haces', 'data-a="plan"')}</div>
      <p class="lm-nota-p" data-e style="margin-top:8px">Solo cuento como señal lo que tú das por bueno o no has descartado. ${L.AVISO_ESCALA}</p>
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
    if (entrada && !L.rm) $$('.lm-senal .lm-bt i', el).forEach((b, i) => b.animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 800, delay: 350 + i * 60, easing: L.E, fill: 'backwards' }));
  };
  pintar(true);
  capa.refrescar = () => pintar(false);
  capa.acc = {
    conf: t => {
      L.d.senalesConf = L.d.senalesConf || {}; const k = t.dataset.k, v = t.dataset.v;
      if (v === 'nada') delete L.d.senalesConf[k]; else L.d.senalesConf[k] = v === 'si' ? (L.d.senalesConf[k] === true ? undefined : true) : false;
      if (L.d.senalesConf[k] === undefined) delete L.d.senalesConf[k];
      L.guardar();
      if (v === 'no') { const c = t.closest('.lm-senal'); L.anim(c, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: .94 }], { duration: 220, easing: L.S }).then(() => { pintar(false); L.refrescarRaiz(); }); L.toast('Descartada. Ya no la tengo en cuenta.'); }
      else { pintar(false); L.refrescarRaiz(); }
    },
    plan: () => L.abrir('plan'), aprendido: () => L.abrir('aprendido')
  };
};

/* ============================== LO QUE HE APRENDIDO ============================== */
L.pantallas.aprendido = (el, o, capa) => {
  const pintar = entrada => {
    const fs = L.fases().reverse(), r = L.d.reflexiones || {};
    el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Lo que he aprendido</h1><p class="lm-sub" data-e style="margin-bottom:16px">Cada subida y cada bajada, cómo empezó y qué te ayudó. Para entenderte, no para juzgarte.</p>
      ${fs.length ? fs.map(f => `<button class="lm-card tq tq-g" data-a="ver" data-id="${f.id}" data-e style="display:block;width:100%;text-align:left;margin-bottom:10px">
        <div class="lm-fila" style="margin-bottom:10px">${L.pt(colorFase(f.tipo), 34)}<div><b style="font-family:Gloock;font-weight:400;font-size:21px">${L.may(L.mesFase(f))}</b><small>${f.duracion} días, ${rangoFase(f)}${f.terminada ? '' : '. En marcha'}</small></div><span class="lm-fl" style="color:var(--mu)">${L.ic('flecha', 18)}</span></div>
        ${tiraFase(f)}
        <small style="margin-top:10px">${r[f.id] ? 'Ya la miraste' : f.terminada ? 'Aún sin mirar atrás' : 'Cuando termine, podrás mirar atrás'}</small></button>`).join('')
        : `<p class="lm-vacia" data-e>Aún no hay ninguna fase de tres días o más. Cuando la haya, aparecerá aquí con lo que pasó antes y lo que te ayudó.</p>`}
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
    if (entrada && !L.rm) $$('.lm-mtira i', el).forEach((b, i, a) => b.animate([{ scale: '1 0' }, { scale: '1 1' }], { duration: 480, delay: 260 + (i % 30) * 14, easing: L.E, fill: 'backwards' }));
  };
  pintar(true); capa.refrescar = () => pintar(false);
  capa.acc = { ver: t => L.abrir('ficha', { id: t.dataset.id }) };
};
L.pantallas.ficha = (el, o, capa) => {
  const pintar = entrada => {
    const f = L.fases().find(x => x.id === o.id); if (!f) return;
    const r = (L.d.reflexiones || {})[f.id], A = L.aprender();
    const vent = (A.ventanas[f.tipo] || []).find(x => x.f.id === f.id), aprendidas = new Set(A[f.tipo].map(s => s.clave));
    const antes = vent ? [...vent.k].filter(k => aprendidas.has(k)) : [];
    const dias = [], m = L.mapaAnimo();
    for (let d = L.mas(L.deIso(f.inicio), -7); d <= L.deIso(f.finEstable || f.fin); d = L.mas(d, 1)) dias.push(d);
    const G = L.grafica({ vals: dias.map(d => m[L.iso(d)]?.nivel ?? null), sueno: dias.map(d => m[L.iso(d)]?.sueno ?? null), med: dias.map(d => { const a = m[L.iso(d)]; return a ? a.medicacion : null; }), etiquetas: dias.map((d, i) => i === 7 ? 'Empieza' : ''), W: 346, HP: 190, r: 3.6, gid: 'gfi' });
    el.innerHTML = `<div class="lm-hero" style="height:260px">${L.orb(colorFase(f.tipo), 240, 'left:50%;margin-left:-120px;top:calc(var(--st) + 6px)')}</div>${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + 200px)">
      <p class="lm-ms" data-e>${L.may(rangoFase(f))}</p><h1 class="lm-t1" data-e>${L.may(L.mesFase(f))}</h1>
      <div class="lm-cifras" data-e style="margin-top:6px"><div class="lm-card"><b class="lm-num">${f.duracion}</b><small>días${f.intermedios.length ? `, con ${f.intermedios.length} ${f.intermedios.length === 1 ? 'día mejor' : 'días mejores'} entre medias` : ''}</small></div>
        <div class="lm-card"><b class="lm-num">${f.sueno == null ? '—' : L.num(f.sueno) + ' h'}</b><small>de sueño de media</small></div>
        <div class="lm-card"><b style="font-size:26px!important">${L.NIV[f.tipo === 'arriba' ? f.max : -f.max].nombre}</b><small>lo más ${f.tipo === 'arriba' ? 'alto' : 'bajo'}</small></div>
        <div class="lm-card"><b class="lm-num">${f.sinMed}</b><small>${f.sinMed === 1 ? 'día' : 'días'} sin medicación</small></div></div>
      <h3 class="lm-sec" data-e>La semana de antes y la fase</h3><div class="lm-card lm-graf" data-e>${G.svg}</div>
      <h3 class="lm-sec" data-e>Lo que hubo antes</h3>${antes.length ? antes.map(k => `<div class="lm-lin" data-e>${L.ic('ok', 17)}<span>${L.esc(L.may(L.textoSenal(k, true)))}</span></div>`).join('') : '<p class="lm-nota-p" data-e>Ninguna de tus señales aprendidas apareció antes de esta fase.</p>'}
      ${r ? [['Lo que notaste primero', r.primero], ['Lo que te ayudó', r.ayudo], ['Lo que no te ayudó', r.noAyudo], ['Lo que harías distinto', r.distinto]].filter(([, v]) => v && v.length).map(([t, v]) => `<h3 class="lm-sec" data-e>${t}</h3><div class="lm-nota" data-e style="user-select:text;-webkit-user-select:text">${L.esc(Array.isArray(v) ? v.join('. ') : v)}</div>`).join('')
        : f.terminada ? `<button class="lm-btn tq tq-g" data-a="mirar" data-e style="margin-top:22px">Mirar atrás</button>` : ''}
    </div></div>`;
    if (entrada) { L.entrar(el, 200, 55); L.animarGrafica($('.lm-graf svg', el)); }
  };
  pintar(true); capa.refrescar = () => pintar(false);
  capa.acc = { mirar: () => L.abrir('mirarAtras', { id: o.id, flujo: 'mirar' }, 'sube') };
};

/* ============================== MIRAR ATRÁS ============================== */
L.pantallas.mirarAtras = (el, o, capa) => {
  const f = L.fases().find(x => x.id === o.id); if (!f) return;
  const A = L.aprender(), vent = (A.ventanas[f.tipo] || []).find(x => x.f.id === f.id);
  const candPrimero = [...new Set([...(vent ? [...vent.k].filter(k => /^(sueno|sint|mixto|sin-med|sin-noches|menos)/.test(k)).map(k => L.may(L.textoSenal(k))) : []), ...L.d.plan[f.tipo]])].slice(0, 8);
  const usados = [...new Set(L.d.recursos.filter(r => r.ts >= L.deIso(f.inicio).getTime() && r.ts <= L.mas(L.deIso(f.fin), 1).getTime() && r.ayudo >= 1).map(r => L.RECURSOS[r.recurso]?.nombre).filter(Boolean))];
  const candAyudo = [...new Set([...usados, ...L.d.plan.hago, 'Hablar con alguien', 'Mantener mis horas de sueño', 'Ir más despacio'])].slice(0, 9);
  const R = { primero: [], ayudo: [], noAyudo: '', distinto: '', primeroTxt: '', ayudoTxt: '' };
  const PASOS = [
    { t: `Tu ${L.mesFase(f)}`, s: `${f.duracion} días, ${rangoFase(f)}. Vamos a mirarla con calma, sin juzgar. Son cinco preguntas cortas y puedes saltar las que quieras.`, cuerpo: () => `<div class="lm-card" style="margin-top:6px">${tiraFase(f, 46)}</div>` },
    { t: '¿Qué notaste primero?', s: 'Lo primero que cambió, aunque entonces no le dieras importancia.', cuerpo: () => L.chips(candPrimero, R.primero, 'cp') + `<input class="lm-input" id="lm-mp" placeholder="Otra cosa que notaste" maxlength="100" style="margin-top:12px" value="${L.esc(R.primeroTxt)}">` },
    { t: '¿Qué te ayudó?', s: 'Aunque fuera un poco.', cuerpo: () => L.chips(candAyudo, R.ayudo, 'ca') + `<input class="lm-input" id="lm-ma" placeholder="Otra cosa que te ayudó" maxlength="100" style="margin-top:12px" value="${L.esc(R.ayudoTxt)}">` },
    { t: '¿Qué no te ayudó?', s: 'También es información útil.', cuerpo: () => `<textarea class="lm-nota" id="lm-mn" rows="4" placeholder="Lo que quieras">${L.esc(R.noAyudo)}</textarea>` },
    { t: '¿Qué harías distinto la próxima vez?', s: 'Una cosa pequeña basta.', cuerpo: () => `<textarea class="lm-nota" id="lm-md" rows="4" placeholder="Por ejemplo: avisar antes a alguien">${L.esc(R.distinto)}</textarea>` },
    { t: '¿Lo añado a tu plan?', s: 'Marca lo que quieras guardar. Así la próxima vez lo tendrás a mano.', cuerpo: () => sugerencias().map((x, i) => `<button class="lm-hecho tq tq-g lm-sug" data-a="sug" data-i="${i}" style="width:100%;text-align:left">${checkSvg()}<span><small style="display:block;color:var(--mu);font-size:12.5px">${x.donde}</small>${L.esc(x.txt)}</span></button>`).join('') || '<p class="lm-nota-p">No hay nada nuevo que añadir. Lo guardo tal cual en Lo que he aprendido.</p>' }
  ];
  let i = 0, elegidas = new Set();
  const sugerencias = () => {
    const s = [], destino = f.tipo === 'arriba' ? 'Señales de que voy hacia arriba' : 'Señales de que voy hacia abajo';
    [...R.primero, R.primeroTxt].filter(Boolean).forEach(x => { if (!L.d.plan[f.tipo].includes(x)) s.push({ k: f.tipo, txt: x, donde: destino }); });
    [...R.ayudo, R.ayudoTxt, R.distinto].filter(Boolean).forEach(x => { if (!L.d.plan.hago.includes(x)) s.push({ k: 'hago', txt: x, donde: 'Lo que hago cuando las veo' }); });
    return s;
  };
  const leer = () => {
    const v = id => $(id, el)?.value.trim();
    if (i === 1) R.primeroTxt = v('#lm-mp') ?? R.primeroTxt; if (i === 2) R.ayudoTxt = v('#lm-ma') ?? R.ayudoTxt;
    if (i === 3) R.noAyudo = v('#lm-mn') ?? R.noAyudo; if (i === 4) R.distinto = v('#lm-md') ?? R.distinto;
  };
  const cuerpo = k => `<h1 class="lm-t1">${PASOS[k].t}</h1><p class="lm-sub" style="margin-bottom:16px">${PASOS[k].s}</p>${PASOS[k].cuerpo()}`;
  el.innerHTML = `${L.top('atras', 'Mirar atrás', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <div class="lm-pasos" data-e>${PASOS.map((_, k) => `<i class="${k === 0 ? 'lm-h' : ''}"></i>`).join('')}</div><div id="lm-paso" data-e>${cuerpo(0)}</div></div></div>
    <div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="sig"><span id="lm-pb" style="display:inline-block;position:relative">Empezar</span></button><button class="lm-enlace tq" data-a="omitir" id="lm-om">Ahora no</button></div>`;
  L.entrar(el, 300);
  const ir = async (n, dir) => {
    leer(); const c = $('#lm-paso', el);
    await L.anim(c, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `${-22 * dir}px 0` }], { duration: 200, easing: L.S });
    i = n; c.innerHTML = cuerpo(i);
    $$('.lm-pasos i', el).forEach((s, k) => s.classList.toggle('lm-h', k <= i));
    L.rodar($('#lm-pb', el), i === 0 ? 'Empezar' : i === PASOS.length - 1 ? 'Guardar' : 'Siguiente', true);
    $('#lm-om', el).style.visibility = i === 0 ? '' : 'hidden';
    await L.anim(c, [{ opacity: 0, translate: `${22 * dir}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 420, easing: L.E });
    c.style.opacity = ''; c.style.translate = ''; $('.lm-scroll', el).scrollTop = 0;
  };
  const tog = (arr, t) => { const v = t.dataset.v, k = arr.indexOf(v); k < 0 ? arr.push(v) : arr.splice(k, 1); t.classList.toggle('lm-si'); };
  capa.acc = {
    cp: t => tog(R.primero, t), ca: t => tog(R.ayudo, t),
    sug: t => { const k = +t.dataset.i, on = !elegidas.has(k); on ? elegidas.add(k) : elegidas.delete(k); marcarCheck(t, on); },
    atras: () => i > 0 ? ir(i - 1, -1) : L.cerrar(capa),
    omitir: () => { L.d.reflexionesOmitidas = [...(L.d.reflexionesOmitidas || []), f.id]; L.guardar(); L.cerrar(capa); L.refrescarRaiz(); },
    sig: async () => {
      document.activeElement?.blur();
      if (i < PASOS.length - 1) return ir(i + 1, 1);
      const sug = sugerencias(); elegidas.forEach(k => { const x = sug[k]; if (x) L.d.plan[x.k].push(x.txt); });
      L.d.reflexiones = L.d.reflexiones || {};
      L.d.reflexiones[f.id] = { ts: Date.now(), primero: [...R.primero, R.primeroTxt].filter(Boolean), ayudo: [...R.ayudo, R.ayudoTxt].filter(Boolean), noAyudo: R.noAyudo, distinto: R.distinto };
      L.guardar(); await L.cerrar(capa); L.refrescarRaiz(); L.capas.forEach(c => c.refrescar?.());
      L.toast(elegidas.size ? 'Guardado, y añadido a tu plan' : 'Guardado en Lo que he aprendido');
    }
  };
};

/* ============================== CASILLA ANIMADA ============================== */
const checkSvg = (on) => `<span class="lm-check ${on ? 'lm-on' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg></span>`;
L.checkSvg = checkSvg;
const marcarCheck = (fila, on) => {
  const c = $('.lm-check', fila); c.classList.toggle('lm-on', on); fila.classList.toggle('lm-hecha', on);
  if (on && !L.rm) {
    c.animate([{ scale: .88 }, { scale: 1.07 }, { scale: 1 }], { duration: 340, easing: 'ease-out' });
    $('path', c).animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 260, delay: 90, easing: L.E, fill: 'backwards' });
  }
};
L.marcarCheck = marcarCheck;

/* ============================== LO QUE SÍ HE HECHO ============================== */
const IDEAS_HECHO = ['Me he levantado', 'Me he duchado', 'He comido algo', 'He tomado la medicación', 'He salido a la calle', 'He contestado un mensaje', 'He descansado', 'He pedido ayuda', 'He ido a trabajar', 'He cuidado de alguien'];
L.pantallas.hechos = (el, o, capa) => {
  const f = o.fecha || L.hoy();
  const reg = () => { let r = L.d.hechos.find(h => h.fecha === f); if (!r) { r = { fecha: f, cosas: [] }; L.d.hechos.push(r); } return r; };
  const fila = (t, k) => `<div class="lm-hecho lm-hecha" data-k="${k}">${checkSvg(true)}<span>${L.esc(t)}</span><button class="tq tq-i" data-a="quitar" data-k="${k}" aria-label="Quitar" style="color:var(--mu);padding:6px">${L.ic('x', 16)}</button></div>`;
  const pintar = () => {
    const r = L.d.hechos.find(h => h.fecha === f) || { cosas: [] };
    el.innerHTML = `<div class="lm-hero" style="height:250px">${L.orb(L.C.ver, 240, 'left:-60px;top:-80px')}${L.orb(L.C.cal, 200, 'left:140px;top:-90px')}</div>
      ${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 120px)">
      <p class="lm-ms" data-e>${f === L.hoy() ? 'Hoy' : L.fechaLarga(L.deIso(f))}</p><h1 class="lm-t1" data-e>Lo que sí he hecho</h1>
      <p class="lm-sub" data-e style="margin-bottom:16px">En los días difíciles, lo pequeño también cuenta. No hace falta que sea mucho.</p>
      <div id="lm-hl" data-e>${r.cosas.map(fila).join('')}</div>
      <div class="lm-fila" data-e style="gap:8px;margin:8px 0 18px"><input class="lm-input" id="lm-hn" placeholder="Algo que has hecho" maxlength="80" enterkeyhint="done" style="margin:0;flex:1"><button class="lm-rb tq tq-i" data-a="anadir" aria-label="Añadir" style="width:52px;height:52px">${L.ic('mas', 20)}</button></div>
      <h3 class="lm-sec" data-e style="margin-top:0">Por si te sirve alguna</h3><div data-e>${L.chips(IDEAS_HECHO.filter(x => !r.cosas.includes(x)), [], 'idea')}</div>
      </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="cerrar">Listo</button></div>`;
    $('#lm-hn', el).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add($('#lm-hn', el).value.trim()); $('#lm-hn', el).value = ''; } });
  };
  const add = t => {
    if (!t) return; const r = reg(); if (r.cosas.includes(t)) return; r.cosas.push(t); L.guardar(); L.refrescarRaiz();
    const l = $('#lm-hl', el); l.insertAdjacentHTML('beforeend', fila(t, r.cosas.length - 1)); const n = l.lastElementChild;
    L.anim(n, [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: L.E });
    marcarCheck(n, true); L.vibra(6);
  };
  pintar(); L.entrar(el, 220);
  capa.acc = {
    anadir: () => { add($('#lm-hn', el).value.trim()); $('#lm-hn', el).value = ''; },
    idea: t => { add(t.dataset.v); L.anim(t, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: .94 }], { duration: 220, easing: L.S }).then(() => t.remove()); },
    quitar: t => { const r = reg(), k = +t.dataset.k; r.cosas.splice(k, 1); L.guardar(); L.refrescarRaiz(); const fl = t.closest('.lm-hecho'); L.anim(fl, [{ opacity: 1 }, { opacity: 0, scale: .94 }], { duration: 220, easing: L.S }).then(() => { $('#lm-hl', el).innerHTML = r.cosas.map(fila).join(''); }); }
  };
};

/* ============================== CARTA PARA LOS DÍAS MALOS ============================== */
L.pantallas.carta = (el, o, capa) => {
  let editar = !L.d.carta;
  const pintar = entrada => {
    const c = L.d.carta;
    el.innerHTML = `<div class="lm-hero" style="height:250px">${L.orb(L.C.lil, 240, 'right:-60px;top:-80px')}</div>${L.top('atras', '', c && !editar ? ['editar', 'editar', 'Editar'] : null)}<div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + 110px)">
      <h1 class="lm-t1" data-e>Carta para los días malos</h1>
      ${editar ? `<p class="lm-sub" data-e style="margin-bottom:16px">Escríbela un día tranquilo, a tu «yo» de los días difíciles. Lumos te la enseñará cuando la escala marque varios días por abajo.</p>
        <textarea class="lm-nota lm-gloock" id="lm-ct" data-e rows="10" placeholder="Hola. Si estás leyendo esto, es que hoy cuesta. Te recuerdo que…" style="min-height:260px">${L.esc(c?.texto || '')}</textarea>
        <button class="lm-btn tq tq-g" data-a="guardar" data-e style="margin-top:16px">Guardar la carta</button>`
        : `<p class="lm-sub" data-e style="margin-bottom:16px">La escribiste el ${L.fechaCorta(new Date(c.ts))}. Te la enseño cuando la escala marca dos días o más por abajo.</p>
        <div class="lm-card lm-frase" data-e style="white-space:pre-wrap;user-select:text;-webkit-user-select:text">${L.esc(c.texto)}</div>
        <button class="lm-enlace lm-borrar tq" data-a="borrar" data-e style="margin-top:14px">Borrar la carta</button>`}
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.acc = {
    editar: () => { editar = true; pintar(false); L.entrar(el, 0, 30); },
    guardar: () => { const v = $('#lm-ct', el).value.trim(); if (!v) return; L.d.carta = { ts: Date.now(), texto: v }; L.guardar(); editar = false; document.activeElement?.blur(); pintar(false); L.entrar(el, 0, 30); L.toast('Carta guardada'); },
    borrar: () => L.confirmar('¿Borrar la carta?', 'Podrás escribir otra cuando quieras.', 'Borrar la carta', () => { const c = L.d.carta; L.d.carta = null; L.guardar(); editar = true; pintar(false); L.toast('Carta borrada', () => { L.d.carta = c; L.guardar(); editar = false; pintar(false); }); })
  };
};
L.pantallas.cartaLeer = (el, o, capa) => {
  const c = L.d.carta; if (!c) return;
  L.d.cartaVista = L.hoy(); L.guardar();
  el.innerHTML = `<div class="lm-hero" style="height:300px">${L.orb(L.C.lil, 280, 'left:50%;margin-left:-140px;top:calc(var(--st) - 20px)')}</div>${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 200px)">
    <p class="lm-ms" data-e>Del ${L.fechaCorta(new Date(c.ts))}</p><h1 class="lm-t1" data-e>Una carta tuya</h1>
    <div class="lm-frase" data-e style="padding:6px 0 0;white-space:pre-wrap;font-size:23px;line-height:1.32;user-select:text;-webkit-user-select:text">${L.esc(c.texto)}</div>
    </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="plan">Ver mi plan</button><button class="lm-enlace tq" data-a="cerrar">Gracias</button></div>`;
  $('.lm-hero .lm-orb', el).animate([{ opacity: 0, scale: .85 }, { opacity: 1, scale: 1 }], { duration: 1100, easing: 'cubic-bezier(.16,.8,.2,1)' });
  L.entrar(el, 320, 90);
  capa.acc = { plan: async () => { await L.cerrar(capa); L.abrir('plan'); } };
};

/* ============================== ATAJOS Y SALUD ============================== */
L.baseURL = () => location.origin + location.pathname.replace(/index\.html$/, '');
L.pantallas.atajos = (el, o, capa) => {
  const b = L.baseURL(), w = 'webapp://' + b;
  const enlaces = [['Empezar el día', 'manana'], ['Cerrar el día', 'noche'], ['Apuntar cómo estoy', 'apuntar'], ['La escala de hoy', 'escala'], ['Vaciar la cabeza', 'vaciar'], ['Si lo estoy pasando mal', 'ayuda']];
  const s = L.d.salud || {}, ult = Object.keys(s).sort().pop();
  const urlSalud = `${w}?sueno=HORAS&pasos=PASOS`;
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
    <h1 class="lm-t1" data-e>Atajos y Salud</h1>
    <p class="lm-sub" data-e style="margin-bottom:6px">Con la app Atajos del iPhone puedes abrir Lumos a una hora en la pantalla justa, y pasarle el sueño y los pasos de Salud. Lumos los guarda sin avisarte: solo verás que se abre. Hace falta iOS 18 o posterior.</p>
    <h3 class="lm-sec" data-e>Enlaces para abrir Lumos</h3>
    ${enlaces.map(([t, k]) => `<div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('flecha', 18)}</span>`, t, `<span style="word-break:break-all">${L.esc(w)}?abrir=${k}</span>`, `data-a="copiar" data-v="${L.esc(w)}?abrir=${k}"`, 'lm-card', `<span style="font-size:13px;font-weight:700;color:var(--ink)">Copiar</span>`)}</div>`).join('')}
    <h3 class="lm-sec" data-e>Un aviso a las 9:00 que abre «Empezar el día»</h3>
    <div class="lm-card" data-e><ol class="lm-ol">
      <li>Abre Atajos y ve a la pestaña Automatización. Pulsa Nueva automatización.</li>
      <li>Elige Hora del día: 9:00, Diariamente. Marca Ejecutar inmediatamente.</li>
      <li>Pulsa Nueva automatización en blanco y añade la acción Abrir URL.</li>
      <li>Pega el enlace de «Empezar el día» que has copiado aquí arriba.</li>
      <li>Repite lo mismo a las 22:00 con el enlace de «Cerrar el día».</li></ol></div>
    <h3 class="lm-sec" data-e>El sueño y los pasos desde Salud</h3>
    <div class="lm-card" data-e><ol class="lm-ol">
      <li>En la misma automatización de las 9:00, antes de Abrir URL, añade Buscar muestras de salud: tipo Análisis del sueño, de las últimas 24 horas.</li>
      <li>Añade Calcular estadísticas: Suma de la Duración. Convierte el resultado a horas.</li>
      <li>Añade otra vez Buscar muestras de salud: tipo Pasos, de hoy, y Calcular estadísticas: Suma.</li>
      <li>En Abrir URL usa este enlace y cambia HORAS y PASOS por los resultados (variables):</li></ol>
      <button class="lm-pill lm-claro tq" data-a="copiar" data-v="${L.esc(urlSalud)}" style="word-break:break-all;text-align:left">${L.esc(urlSalud)}</button></div>
    <p class="lm-nota-p" data-e style="margin-top:12px">${ult ? `Últimos datos recibidos, ${L.cuando(L.deIso(ult)).toLowerCase()}: ${s[ult].sueno != null ? L.num(s[ult].sueno) + ' h de sueño' : ''}${s[ult].sueno != null && s[ult].pasos != null ? ' y ' : ''}${s[ult].pasos != null ? s[ult].pasos.toLocaleString('es-ES') + ' pasos' : ''}.` : 'Aún no ha llegado nada desde Salud.'} El sueño que llega se pone solo en la escala de ese día; si ya lo habías apuntado tú, manda lo tuyo.</p>
  </div></div>`;
  L.entrar(el, 200, 50);
  capa.acc = { copiar: async t => { try { await navigator.clipboard.writeText(t.dataset.v); L.toast('Copiado'); } catch (e) { L.toast('No se ha podido copiar'); } } };
};

/* ============================== HITOS ============================== */
const TIPO_HITO = { medicacion: ['Medicación', L.C.lil], vida: ['Algo que pasó', L.C.ale], otro: ['Otro', L.C.cal] };
L.hojaHito = (fecha, alFin) => {
  let tipo = 'vida';
  const h = L.hoja(`<h2 data-e>Un hito</h2><p class="lm-sub" data-e style="margin-bottom:14px">Algo que quieras ver en la gráfica: un cambio de medicación, un viaje, exámenes…</p>
    <input class="lm-input" id="lm-hf" data-e type="date" value="${fecha || L.hoy()}" max="${L.hoy()}">
    <input class="lm-input" id="lm-ht" data-e placeholder="Qué pasó" maxlength="70">
    <div class="lm-chips" data-e style="margin:6px 0 18px">${Object.entries(TIPO_HITO).map(([k, [n, c]]) => `<button class="lm-chip tq tq-i ${k === tipo ? 'lm-si' : ''}" data-a="tipo" data-v="${k}" style="gap:8px">${L.pt(c, 16)}${n}</button>`).join('')}</div>
    <button class="lm-btn tq tq-g" data-a="ok" data-e>Guardar el hito</button>`, {
    tipo: t => { tipo = t.dataset.v; $$('[data-a="tipo"]', h.el).forEach(c => c.classList.toggle('lm-si', c === t)); },
    ok: (t, e, c) => { const tx = $('#lm-ht', h.el).value.trim(), f = $('#lm-hf', h.el).value || L.hoy(); if (!tx) return; L.d.hitos.push({ id: L.id(), fecha: f, texto: tx, tipo }); L.guardar(); c(); alFin?.(); L.refrescarRaiz(); L.toast('Hito guardado'); }
  });
};
L.pantallas.hitos = (el, o, capa) => {
  const pintar = entrada => {
    const hs = [...L.d.hitos].sort((a, b) => b.fecha.localeCompare(a.fecha));
    el.innerHTML = `${L.top('atras', '', ['anadir', 'mas', 'Añadir'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Hitos</h1><p class="lm-sub" data-e style="margin-bottom:16px">Salen en la gráfica del ánimo como una línea, para ver qué coincidió con qué.</p>
      ${hs.length ? hs.map(x => `<div class="lm-li lm-card" data-e>${L.pt(TIPO_HITO[x.tipo]?.[1] || L.C.cal, 34)}<div><b>${L.esc(x.texto)}</b><small>${L.fechaLarga(L.deIso(x.fecha))}. ${TIPO_HITO[x.tipo]?.[0] || ''}</small></div><button class="tq tq-i" data-a="quitar" data-id="${x.id}" aria-label="Borrar" style="color:var(--coral);padding:8px">${L.ic('borrar', 19)}</button></div>`).join('')
        : `<p class="lm-vacia" data-e>Aún no hay hitos.</p><button class="lm-btn tq tq-g" data-a="anadir" data-e>Añadir un hito</button>`}
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true); capa.refrescar = () => pintar(false);
  capa.acc = {
    anadir: () => L.hojaHito(null, () => pintar(false)),
    quitar: t => { const i = L.d.hitos.findIndex(h => h.id === t.dataset.id), h = L.d.hitos[i]; L.d.hitos.splice(i, 1); L.guardar(); pintar(false); L.refrescarRaiz(); L.toast('Hito borrado', () => { L.d.hitos.splice(i, 0, h); L.guardar(); pintar(false); L.refrescarRaiz(); }); }
  };
};

/* ============================== MEDICACIÓN ============================== */
L.editarMedicacion = (m, alFin) => {
  const h = L.hoja(`<h2 data-e>${m ? 'Cambiar' : 'Añadir medicación'}</h2><p class="lm-sub" data-e style="margin-bottom:14px">Cada cambio se guarda como hito en la gráfica y sale en el informe.</p>
    <input class="lm-input" id="lm-mn2" data-e placeholder="Nombre" maxlength="40" value="${L.esc(m?.nombre || '')}">
    <input class="lm-input" id="lm-md2" data-e placeholder="Dosis (por ejemplo, 150 mg)" maxlength="30" value="${L.esc(m?.dosis || '')}">
    <input class="lm-input" id="lm-mc2" data-e placeholder="Cuándo (mañana, noche…)" maxlength="30" value="${L.esc(m?.cuando || '')}">
    <button class="lm-btn tq tq-g" data-a="ok" data-e style="margin-top:6px">Guardar</button>
    ${m ? `<button class="lm-enlace lm-borrar tq" data-a="borrar" data-e>Ya no la tomo</button>` : ''}`, {
    ok: (t, e, c) => {
      const n = $('#lm-mn2', h.el).value.trim(), d = $('#lm-md2', h.el).value.trim(), cu = $('#lm-mc2', h.el).value.trim(); if (!n) return;
      let tx;
      if (m) { if (m.dosis !== d || m.nombre !== n) tx = `${n}: ${m.dosis || 'sin dosis'} → ${d || 'sin dosis'}`; Object.assign(m, { nombre: n, dosis: d, cuando: cu }); }
      else { L.d.medicacion.push({ id: L.id(), nombre: n, dosis: d, cuando: cu }); tx = `Empiezo ${n}${d ? ' ' + d : ''}`; }
      if (tx) L.d.hitos.push({ id: L.id(), fecha: L.hoy(), texto: tx, tipo: 'medicacion' });
      L.guardar(); c(); alFin?.(); L.refrescarRaiz();
    },
    borrar: (t, e, c) => { L.d.medicacion = L.d.medicacion.filter(x => x !== m); L.d.hitos.push({ id: L.id(), fecha: L.hoy(), texto: `Dejo ${m.nombre}`, tipo: 'medicacion' }); L.guardar(); c(); alFin?.(); L.refrescarRaiz(); }
  });
};
L.pantallas.medicacion = (el, o, capa) => {
  const pintar = entrada => {
    const ms = L.d.medicacion, cambios = L.d.hitos.filter(h => h.tipo === 'medicacion').sort((a, b) => b.fecha.localeCompare(a.fecha));
    el.innerHTML = `${L.top('atras', '', ['anadir', 'mas', 'Añadir'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Mi medicación</h1><p class="lm-sub" data-e style="margin-bottom:16px">Para apuntar tu pauta y sus cambios. Lumos no te recuerda tomarla y no da consejos sobre ella: eso es cosa de tu profesional.</p>
      ${ms.length ? ms.map(m => `<div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('pastilla')}</span>`, L.esc(m.nombre), [m.dosis, m.cuando].filter(Boolean).map(L.esc).join(', ') || 'Sin dosis apuntada', `data-a="ed" data-id="${m.id}"`, 'lm-card', L.ic('editar', 18))}</div>`).join('')
        : `<button class="lm-btn tq tq-g" data-a="anadir" data-e>Añadir medicación</button>`}
      ${cambios.length ? `<h3 class="lm-sec" data-e>Cambios</h3>${cambios.map(h => `<div class="lm-lin" data-e>${L.pt(L.C.lil, 14, 'margin-top:3px')}<span>${L.esc(h.texto)}<small style="display:block;color:var(--mu);font-size:12.5px">${L.fechaLarga(L.deIso(h.fecha))}</small></span></div>`).join('')}` : ''}
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true); capa.refrescar = () => pintar(false);
  capa.acc = { anadir: () => L.editarMedicacion(null, () => pintar(false)), ed: t => L.editarMedicacion(L.d.medicacion.find(m => m.id === t.dataset.id), () => pintar(false)) };
};

/* ============================== MIS SÍNTOMAS ============================== */
L.hojaSintoma = alFin => {
  const h = L.hoja(`<h2 data-e>Un síntoma o señal tuya</h2><p class="lm-sub" data-e style="margin-bottom:14px">Saldrá con los demás al completar el día, y Lumos lo tendrá en cuenta para tus señales tempranas.</p>
    <input class="lm-input" id="lm-sn" data-e placeholder="Por ejemplo, música muy alta" maxlength="40"><button class="lm-btn tq tq-g" data-a="ok" data-e style="margin-top:8px">Añadir</button>`,
    { ok: (t, e, c) => { const v = L.may($('#lm-sn', h.el).value.trim()); if (!v) return; if (![...L.SINTOMAS, ...L.d.sintomasPropios].some(x => x.toLowerCase() === v.toLowerCase())) { L.d.sintomasPropios.push(v); L.guardar(); } c(); alFin?.(v); } });
  setTimeout(() => $('#lm-sn', h.el)?.focus(), 450);
};
L.pantallas.misSintomas = (el, o, capa) => {
  const pintar = entrada => {
    el.innerHTML = `${L.top('atras', '', ['anadir', 'mas', 'Añadir'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Mis síntomas</h1><p class="lm-sub" data-e style="margin-bottom:16px">Los que eliges al completar el día. Añade todos los tuyos.</p>
      <h3 class="lm-sec" data-e style="margin-top:0">Los tuyos</h3>
      ${L.d.sintomasPropios.length ? L.d.sintomasPropios.map((s, i) => `<div class="lm-li lm-card" data-e><span style="color:var(--mu)">${L.ic('ok', 18)}</span><div><b>${L.esc(s)}</b></div><button class="tq tq-i" data-a="quitar" data-i="${i}" aria-label="Borrar" style="color:var(--coral);padding:8px">${L.ic('borrar', 19)}</button></div>`).join('') : '<p class="lm-nota-p" data-e>Aún no has añadido ninguno.</p>'}
      <button class="lm-btn lm-sec2 tq tq-g" data-a="anadir" data-e style="margin-top:12px">Añadir un síntoma</button>
      <h3 class="lm-sec" data-e>Los de Lumos</h3><div data-e>${L.chips(L.SINTOMAS, [], 'x')}</div>
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.acc = {
    anadir: () => L.hojaSintoma(() => pintar(false)),
    quitar: t => { const i = +t.dataset.i, s = L.d.sintomasPropios[i]; L.d.sintomasPropios.splice(i, 1); L.guardar(); pintar(false); L.toast('Síntoma borrado', () => { L.d.sintomasPropios.splice(i, 0, s); L.guardar(); pintar(false); }); }
  };
};

/* ============================== DÓNDE LO NOTAS ============================== */
L.ZONAS = [['Cabeza', [[100, 34]]], ['Garganta', [[100, 78]]], ['Hombros', [[70, 92], [130, 92]]], ['Pecho', [[100, 120]]], ['Tripa', [[100, 168]]], ['Brazos y manos', [[50, 172], [150, 172]]], ['Piernas', [[80, 268], [120, 268]]]];
L.hojaCuerpo = (sel, color, alFin) => {
  sel = [...sel];
  const svg = () => `<svg viewBox="0 0 200 330" class="lm-cuerpo" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="100" cy="36" r="24"/><path d="M88 60v10M112 60v10M66 82c10-8 58-8 68 0l8 98c-12 10-72 10-84 0z"/><path d="M66 86 44 186M134 86l22 100"/><path d="M80 192 74 316M120 192l6 124"/></g>
    ${L.ZONAS.map(([n, ps]) => ps.map(([x, y]) => `<g class="lm-zona ${sel.includes(n) ? 'lm-on' : ''}" data-z="${n}"><circle cx="${x}" cy="${y}" r="30" fill="url(#lmzg)" class="lm-zg"/><circle cx="${x}" cy="${y}" r="5" class="lm-zp"/><circle cx="${x}" cy="${y}" r="24" fill="transparent"/></g>`).join('')).join('')}
    <defs><radialGradient id="lmzg"><stop offset="0" stop-color="${color}"/><stop offset=".55" stop-color="${color}" stop-opacity=".55"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs></svg>`;
  const h = L.hoja(`<h2 data-e>¿Dónde lo notas?</h2><p class="lm-sub" data-e style="margin-bottom:6px">Toca las zonas. Puede ser más de una, o ninguna.</p>
    <div data-e style="display:flex;justify-content:center">${svg()}</div><div data-e id="lm-zc">${L.chips(L.ZONAS.map(z => z[0]), sel, 'z')}</div>
    <button class="lm-btn tq tq-g" data-a="ok" data-e style="margin-top:18px">Listo</button>`, {
    z: t => tog(t.dataset.v), ok: (t, e, c) => { c(); alFin(sel); }
  });
  const tog = n => {
    const i = sel.indexOf(n); i < 0 ? sel.push(n) : sel.splice(i, 1); const on = sel.includes(n);
    $$(`.lm-zona[data-z="${n}"]`, h.el).forEach(g => { g.classList.toggle('lm-on', on); if (on && !L.rm) $('.lm-zg', g).animate([{ opacity: 0, scale: .4 }, { opacity: 1, scale: 1 }], { duration: 480, easing: L.M }); });
    $$(`#lm-zc [data-v="${n}"]`, h.el).forEach(c => c.classList.toggle('lm-si', on));
  };
  $$('.lm-zona', h.el).forEach(g => g.addEventListener('click', () => tog(g.dataset.z)));
};

/* ============================== VACIAR LA CABEZA ============================== */
L.pantallas.vaciar = (el, o, capa) => {
  el.innerHTML = `<div class="lm-hero" style="height:260px">${L.orb(L.C.baj, 250, 'left:-70px;top:-90px')}${L.orb(L.C.lil, 220, 'left:150px;top:-100px')}</div>
    ${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad" style="padding-top:calc(var(--st) + 120px)">
    <p class="lm-ms" data-e>Antes de dormir</p><h1 class="lm-t1" data-e>Vaciar la cabeza</h1>
    <p class="lm-sub" data-e style="margin-bottom:16px">Escribe lo que te da vueltas, una cosa por línea. Lo guardo en una caja y mañana decides si sigue importando.</p>
    <textarea class="lm-nota" id="lm-vt" data-e rows="7" placeholder="El correo que no he contestado&#10;Lo que dije en la reunión&#10;…" style="min-height:190px"></textarea>
    <div id="lm-vz" style="position:relative;min-height:10px"></div>
    </div></div>
    <div class="lm-caja" id="lm-caja" style="opacity:0">${L.ic('tarro', 34)}</div>
    <div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok">Guardar en la caja</button></div>`;
  L.entrar(el, 260);
  capa.acc = {
    ok: async () => {
      const items = $('#lm-vt', el).value.split('\n').map(x => x.trim()).filter(Boolean); if (!items.length) { $('#lm-vt', el).focus(); return; }
      document.activeElement?.blur();
      L.d.vaciados.push({ id: L.id(), ts: Date.now(), items: items.map(t => ({ t, estado: null })) }); L.guardar(); L.refrescarRaiz();
      const ta = $('#lm-vt', el), caja = $('#lm-caja', el), z = $('#lm-vz', el), bt = $('.lm-abajo', el);
      L.anim(bt, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: L.S });
      await L.anim(ta, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: L.S }); ta.style.display = 'none';
      z.innerHTML = `<div class="lm-chips">${items.map(t => `<span class="lm-chip">${L.esc(t)}</span>`).join('')}</div>`;
      const chips = $$('.lm-chip', z);
      chips.forEach((c, i) => c.animate([{ opacity: 0, scale: .86 }, { opacity: 1, scale: 1 }], { duration: 420, delay: i * 50, easing: L.M, fill: 'backwards' }));
      await L.anim(caja, [{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 420, delay: 200, easing: L.E });
      await L.espera(L.rm ? 100 : 500);
      const cr = caja.getBoundingClientRect();
      await Promise.all(chips.map((c, i) => { const r = c.getBoundingClientRect(); return L.anim(c, [{ translate: '0 0', scale: 1, opacity: 1 }, { translate: `${cr.left + cr.width / 2 - r.left - r.width / 2}px ${cr.top + cr.height / 2 - r.top - r.height / 2}px`, scale: .2, opacity: 0 }], { duration: 640, delay: i * 70, easing: 'cubic-bezier(.4,0,.6,1)' }); }));
      caja.animate([{ scale: 1 }, { scale: .9 }, { scale: 1.06 }, { scale: 1 }], { duration: 420, easing: 'ease-out' });
      z.innerHTML = `<p class="lm-t2" style="text-align:center;margin-top:20px">Guardado. Hasta mañana.</p>`;
      L.anim(z.firstChild, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: L.E });
      await L.espera(1500); L.cerrar(capa);
    }
  };
};
L.cajaPendiente = () => {
  const v = [...L.d.vaciados].reverse().find(x => x.items.some(i => !i.estado)); if (!v) return null;
  return L.iso(new Date(v.ts)) !== L.hoy() || new Date().getHours() >= 5 && new Date(v.ts).getHours() < 5 ? v : null;
};
L.pantallas.caja = (el, o, capa) => {
  const v = L.d.vaciados.find(x => x.id === o.id); if (!v) return;
  el.innerHTML = `${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <p class="lm-ms" data-e>${L.cuando(new Date(v.ts))} por la noche</p><h1 class="lm-t1" data-e>Lo que dejaste en la caja</h1>
    <p class="lm-sub" data-e style="margin-bottom:16px">Míralo con la cabeza de hoy. ¿Sigue importando?</p>
    ${v.items.map((it, i) => `<div class="lm-card lm-cajai" data-i="${i}" data-e style="margin-bottom:9px;${it.estado === 'soltado' ? 'display:none' : ''}"><p style="font-family:Gloock;font-size:20px;line-height:1.2;margin-bottom:12px">${L.esc(it.t)}</p>
      <div class="lm-chips"><button class="lm-chip tq tq-i ${it.estado === 'sigue' ? 'lm-si' : ''}" data-a="sigue" data-i="${i}">Sigue importando</button><button class="lm-chip tq tq-i" data-a="suelto" data-i="${i}">Ya no</button></div></div>`).join('')}
    <p class="lm-t2" id="lm-cfin" style="text-align:center;margin-top:24px;opacity:0">Hecho.</p></div></div>`;
  L.entrar(el, 200, 55);
  const fin = () => { if (v.items.every(i => i.estado)) { const p = $('#lm-cfin', el); L.anim(p, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: L.E }); setTimeout(() => L.cerrar(capa), 1300); } };
  capa.acc = {
    sigue: t => { v.items[+t.dataset.i].estado = 'sigue'; t.classList.add('lm-si'); L.guardar(); L.refrescarRaiz(); fin(); },
    suelto: async t => { v.items[+t.dataset.i].estado = 'soltado'; L.guardar(); L.refrescarRaiz(); const c = t.closest('.lm-cajai'); await L.anim(c, [{ opacity: 1, scale: 1, translate: '0 0' }, { opacity: 0, scale: .94, translate: '0 -8px' }], { duration: 260, easing: L.S }); c.style.display = 'none'; fin(); }
  };
};

/* ============================== LO BUENO DE LA SEMANA ============================== */
L.datosSemana = off => {
  const l = L.mas(L.lunes(new Date()), (off || 0) * 7), fin = L.mas(l, 7), fs = new Set([...Array(7)].map((_, i) => L.iso(L.mas(l, i))));
  const buenas = L.d.noches.filter(n => fs.has(n.fecha)).flatMap(n => (n.buenas && n.buenas.length ? n.buenas : n.bien ? [{ que: n.bien }] : []).map(b => ({ ...b, fecha: n.fecha })));
  const momentos = L.d.momentos.filter(m => m.ts >= l.getTime() && m.ts < fin.getTime());
  const ag = L.d.emociones.filter(e => e.ts >= l.getTime() && e.ts < fin.getTime() && L.palabra(e.palabra).agradable);
  const c = {}; ag.forEach(e => c[e.palabra] = (c[e.palabra] || 0) + 1);
  const hechos = L.d.hechos.filter(h => fs.has(h.fecha)).flatMap(h => h.cosas);
  return { l, buenas, momentos, palabras: Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6), hechos };
};
L.pantallas.semana = (el, o, capa) => {
  const D = L.datosSemana(o.off), f = L.mas(D.l, 6);
  const vacio = !D.buenas.length && !D.momentos.length && !D.palabras.length && !D.hechos.length;
  el.innerHTML = `<div class="lm-hero" style="height:250px">${L.orb(L.C.ale, 240, 'right:-60px;top:-80px')}</div>${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-sinbarra" style="padding-top:calc(var(--st) + 110px)">
    <p class="lm-ms" data-e>Del ${D.l.getDate()} al ${L.fechaCorta(f)}</p><h1 class="lm-t1" data-e>Lo bueno de la semana</h1>
    ${vacio ? `<p class="lm-sub" data-e>Esta semana no hay nada apuntado como bueno. No pasa nada: hay semanas así.</p>` : ''}
    ${D.buenas.length ? `<h3 class="lm-sec" data-e>Cosas buenas que apuntaste</h3>${D.buenas.map(b => `<div class="lm-card" data-e style="margin-bottom:9px"><p style="font-family:Gloock;font-size:19px;line-height:1.25">${L.esc(b.que)}</p>${b.tu ? `<small style="margin-top:6px">Lo que pusiste tú: ${L.esc(b.tu)}</small>` : ''}<small style="margin-top:4px">${L.cuando(L.deIso(b.fecha))}</small></div>`).join('')}` : ''}
    ${D.momentos.length ? `<h3 class="lm-sec" data-e>Momentos</h3>${D.momentos.map(m => `<div data-e>${L.li(L.pt(m.palabra ? L.colorDe(m.palabra) : L.C.ale, 34), L.esc(m.texto), L.cuando(new Date(m.ts)), `data-a="mom" data-id="${m.id}"`)}</div>`).join('')}` : ''}
    ${D.palabras.length ? `<h3 class="lm-sec" data-e>Lo agradable que sentiste</h3><div class="lm-nube" data-e>${D.palabras.map(([w, n]) => `<span style="font-size:${16 + n * 4}px;color:${L.textoDe(L.colorDe(w))}">${L.esc(w)}</span>`).join('')}</div>` : ''}
    ${D.hechos.length ? `<h3 class="lm-sec" data-e>Lo que sí hiciste en los días difíciles</h3><div data-e>${L.chips([...new Set(D.hechos)], [], 'x')}</div>` : ''}
  </div></div>`;
  L.entrar(el, 200, 55);
  capa.acc = { mom: t => L.abrir('momento', { id: t.dataset.id }) };
};

/* ============================== TUS OTRAS FORMAS DE VERLO ============================== */
L.otrasFormas = trampa => L.d.recursos.filter(r => r.nota && r.nota.otra && (!trampa || (r.nota.trampas || []).includes(trampa))).sort((a, b) => b.ts - a.ts);
L.pantallas.otrasFormas = (el, o, capa) => {
  const l = L.otrasFormas();
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
    <h1 class="lm-t1" data-e>Tus otras formas de verlo</h1><p class="lm-sub" data-e style="margin-bottom:16px">Lo que escribiste en Mirar el pensamiento. Cuando vuelve una trampa, te recuerdo cómo la miraste la otra vez.</p>
    ${l.length ? l.map(r => `<div class="lm-card" data-e style="margin-bottom:10px">${r.nota.dice ? `<p style="font-family:Gloock;font-size:18px;line-height:1.25;color:var(--mu2)">«${L.esc(r.nota.dice)}»</p>` : ''}
      ${(r.nota.trampas || []).length ? `<div style="margin:10px 0">${L.chips(r.nota.trampas, [], 'x')}</div>` : ''}<p style="font-family:Gloock;font-size:20px;line-height:1.25">${L.esc(r.nota.otra)}</p><small style="margin-top:8px">${L.cuando(new Date(r.ts))}</small></div>`).join('')
      : `<p class="lm-vacia" data-e>Aún no hay ninguna. Aparecerán cuando uses Mirar el pensamiento.</p><button class="lm-btn tq tq-g" data-a="probar" data-e>Mirar un pensamiento</button>`}
  </div></div>`;
  L.entrar(el, 200, 55);
  capa.acc = { probar: () => L.abrirRecurso('mirar-pensamiento') };
};

/* ============================== TU MES EN UNA HISTORIA ============================== */
L.datosMes = ym => {
  const [a, m] = ym.split('-').map(Number), ini = new Date(a, m - 1, 1), fin = new Date(a, m, 1);
  const es = L.d.emociones.filter(e => e.ts >= ini.getTime() && e.ts < fin.getTime());
  const c = {}; es.forEach(e => c[e.palabra] = (c[e.palabra] || 0) + 1);
  const pal = Object.entries(c).sort((x, y) => y[1] - x[1]);
  const dias = new Set(es.map(e => L.iso(new Date(e.ts)))).size;
  const an = L.d.animo.filter(x => x.fecha.startsWith(ym));
  const rec = {}; L.d.recursos.filter(r => r.ts >= ini.getTime() && r.ts < fin.getTime() && r.ayudo >= 1).forEach(r => rec[r.recurso] = (rec[r.recurso] || 0) + 1);
  const moms = L.d.momentos.filter(x => x.ts >= ini.getTime() && x.ts < fin.getTime());
  const buenas = L.d.noches.filter(n => n.fecha.startsWith(ym)).flatMap(n => n.buenas && n.buenas.length ? n.buenas.map(b => b.que) : n.bien ? [n.bien] : []);
  const hechos = L.d.hechos.filter(h => h.fecha.startsWith(ym)).flatMap(h => h.cosas);
  return { a, m, nombre: L.MESES[m - 1], pal, dias, an, rec: Object.entries(rec).sort((x, y) => y[1] - x[1]), moms, buenas, hechos, total: es.length };
};
L.mesAnterior = () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
L.pantallas.historia = (el, o, capa) => {
  const D = L.datosMes(o.mes), cols = D.pal.slice(0, 5).map(([w]) => L.colorDe(w));
  while (cols.length < 4) cols.push([L.C.ale, L.C.cal, L.C.baj, L.C.ene][cols.length]);
  const S = [];
  S.push(`<div class="lm-hist-ilu">${[[-40, 40, 260, 0], [130, 0, 240, 1], [40, 170, 230, 2], [190, 190, 200, 3]].map(([x, y, d, i]) => L.orb(cols[i], d, `position:absolute;left:${x}px;top:${y}px`, 'lm-ho')).join('')}</div>
    <div class="lm-hist-tx"><p class="lm-ms">Tu mes</p><h1 class="lm-t0" style="font-size:64px">${L.may(D.nombre)}</h1><p class="lm-sub" style="font-size:17px">${D.dias ? `${D.dias} ${D.dias === 1 ? 'día' : 'días'} con algo apuntado.` : 'Un mes con poco apuntado. También vale.'}</p></div>`);
  if (D.pal.length) { const mx = D.pal[0][1]; S.push(`<div class="lm-hist-tx" style="top:calc(var(--st) + 120px)"><p class="lm-ms">Tus palabras</p><h1 class="lm-t1">Lo que más sentiste</h1><div class="lm-nube" style="margin-top:20px">${D.pal.slice(0, 10).map(([w, n]) => `<span class="lm-hw" style="font-size:${Math.round(16 + 26 * n / mx)}px;color:${L.textoDe(L.colorDe(w))}">${L.esc(w)}</span>`).join('')}</div></div>`); }
  if (D.an.length && L.d.perfil.escala !== false) {
    const n = new Date(D.a, D.m, 0).getDate(), mp = {}; D.an.forEach(x => mp[x.fecha] = x);
    const dias = [...Array(n)].map((_, i) => `${D.a}-${String(D.m).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
    const G = L.grafica({ vals: dias.map(f => mp[f]?.nivel ?? null), sueno: null, med: null, etiquetas: dias.map((f, i) => [0, 7, 14, 21, 28].includes(i) ? String(i + 1) : ''), W: 346, HP: 200, r: 3.6, gid: 'ghi' }), rp = L.reparto(dias.map(f => mp[f]?.nivel ?? null));
    S.push(`<div class="lm-hist-tx" style="top:calc(var(--st) + 120px)"><p class="lm-ms">Tu ánimo</p><h1 class="lm-t1">${rp.estable >= rp.arriba + rp.abajo ? 'Más días estable que no' : 'Un mes con movimiento'}</h1><div class="lm-card lm-graf" style="margin-top:16px">${G.svg}</div><p class="lm-sub" style="margin-top:12px">${[rp.estable && `${rp.estable} días estable`, rp.arriba && `${rp.arriba} por arriba`, rp.abajo && `${rp.abajo} por abajo`].filter(Boolean).join(', ')}.</p></div>`);
  }
  if (D.rec.length) S.push(`<div class="lm-hist-tx" style="top:calc(var(--st) + 120px)"><p class="lm-ms">Lo que te ayudó</p><h1 class="lm-t1">Cuando apretó, esto sirvió</h1>${D.rec.slice(0, 4).map(([id, k]) => { const R = L.RECURSOS[id]; if (!R) return ''; return `<div class="lm-li lm-card lm-hi" style="margin-top:9px">${L.pt(L.CATS.find(c => c.id === R.cat).c, 36)}<div><b>${R.nombre}</b><small>${k} ${k === 1 ? 'vez' : 'veces'}</small></div></div>`; }).join('')}</div>`);
  if (D.moms.length) S.push(`<div class="lm-hist-tx" style="top:calc(var(--st) + 120px)"><p class="lm-ms">Tus momentos</p><h1 class="lm-t1">Lo que guardaste</h1><div style="margin-top:16px">${D.moms.slice(0, 4).map((x, i) => `<div class="lm-mom lm-hi" style="margin-bottom:10px;rotate:${[-2, 2, -1, 1][i]}deg"><div class="lm-vis">${L.orb(x.palabra ? L.colorDe(x.palabra) : L.C.ale, 150, 'right:-50px;bottom:-60px')}</div><b>${L.esc(x.texto)}</b></div>`).join('')}</div></div>`);
  if (D.buenas.length || D.hechos.length) S.push(`<div class="lm-hist-tx" style="top:calc(var(--st) + 120px)"><p class="lm-ms">Lo bueno</p><h1 class="lm-t1">${D.buenas.length ? `${D.buenas.length} ${D.buenas.length === 1 ? 'cosa buena apuntada' : 'cosas buenas apuntadas'}` : 'Lo que sí hiciste'}</h1>${D.buenas.slice(0, 3).map(b => `<p class="lm-hi" style="font-family:Gloock;font-size:22px;line-height:1.25;margin-top:16px">${L.esc(b)}</p>`).join('')}${D.hechos.length ? `<p class="lm-sub lm-hi" style="margin-top:18px">En los días difíciles apuntaste ${D.hechos.length} ${D.hechos.length === 1 ? 'cosa que sí hiciste' : 'cosas que sí hiciste'}.</p>` : ''}</div>`);
  S.push(`<div class="lm-hist-ilu">${L.orb(cols[0], 300, 'position:absolute;left:45px;top:40px', 'lm-ho')}</div><div class="lm-hist-tx"><h1 class="lm-t1" style="font-size:40px">Así fue tu ${D.nombre}</h1><p class="lm-sub" style="font-size:17px">No hace falta sacar conclusiones. Solo mirarlo.</p></div>`);
  let i = 0, t0 = 0, raf;
  el.innerHTML = `<div class="lm-hist-segs">${S.map(() => '<i><b></b></i>').join('')}</div>${L.top(null, '', ['cerrar', 'x', 'Cerrar'])}
    <div class="lm-hist-sl"></div><div class="lm-hist-zonas"><span data-z="-1"></span><span data-z="1"></span></div>`;
  $('.lm-top', el).style.top = 'calc(var(--st) + 22px)';
  const sl = $('.lm-hist-sl', el), segs = $$('.lm-hist-segs b', el), DUR = 6500;
  const ir = async (n, dir) => {
    if (n < 0) n = 0; if (n >= S.length) { L.cerrar(capa); return; }
    if (sl.innerHTML) await L.anim(sl, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `${-22 * dir}px 0` }], { duration: 200, easing: L.S });
    i = n; sl.innerHTML = S[i]; sl.style.opacity = ''; sl.style.translate = '';
    segs.forEach((s, k) => { s.style.scale = k < i ? '1 1' : '0 1'; });
    L.repintarOrbes(sl);
    if (!L.rm) {
      $$('.lm-ho', sl).forEach((x, k) => x.animate([{ opacity: 0, scale: .7 }, { opacity: 1, scale: 1 }], { duration: 1100, delay: k * 120, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' }));
      $$('.lm-hist-tx > *', sl).forEach((x, k) => x.animate([{ opacity: 0, translate: `${22 * dir}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 460, delay: 120 + k * 70, easing: L.E, fill: 'backwards' }));
      $$('.lm-hw, .lm-hi', sl).forEach((x, k) => x.animate([{ opacity: 0, scale: .86 }, { opacity: 1, scale: 1 }], { duration: 480, delay: 300 + k * 60, easing: L.M, fill: 'backwards' }));
      const g = $('svg', sl); if (g) L.animarGrafica(g);
    }
    t0 = performance.now();
  };
  const paso = now => { const p = Math.min(1, (now - t0) / DUR); if (segs[i]) segs[i].style.scale = `${p.toFixed(4)} 1`; if (p >= 1) ir(i + 1, 1); raf = requestAnimationFrame(paso); };
  $$('.lm-hist-zonas span', el).forEach(z => z.addEventListener('click', () => ir(i + +z.dataset.z, +z.dataset.z)));
  ir(0, 1); raf = requestAnimationFrame(paso);
  capa.alCerrar = () => cancelAnimationFrame(raf);
  L.d.historiaVista = o.mes; L.guardar();
};
