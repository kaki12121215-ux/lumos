/* Lumos 1.3.1 · escala del ánimo */
'use strict';
L.estAnimo = { rango: 'Semana', off: 0 };
const signo = n => L.NIV[n].signo;

L.vistas.animo = (el, { primera }) => {
  const E = L.estAnimo, hoy = L.hoy(), an = L.mapaAnimo()[hoy], A = L.aprender(), act = L.faseActual();
  const sen = act && act.dias.length >= 3 ? [{ titulo: `Estás en una ${L.nombreFase(act.tipo)} desde el ${L.fechaCorta(L.deIso(act.inicio))}`, texto: act.tipo === 'abajo' ? 'Un día mejor entre medias no la cierra: la doy por terminada tras tres días estables seguidos.' : 'Puede ser buen momento para bajar el ritmo y cuidar el sueño.' }]
    : [...L.indicios(A).map(i => ({ titulo: L.tituloIndicio(i.tipo), texto: i.texto })), ...L.senales().filter(s => s.tipo === 'med')];
  const cs = L.cruceSueno(), nA = A.n.arriba, nB = A.n.abajo;
  const datos = L.datosPeriodo(E.rango, E.off), rep = L.reparto(datos.vals);
  const ley = rep.por.filter(([, k]) => k).map(([n, k]) => [k, `${k} ${L.NIV[n].nombre.toLowerCase()}`, L.NIV[n].c]);
  el.innerHTML = `<div class="lm-pad">
    <h1 class="lm-t1" data-e style="margin-bottom:14px">Tu ánimo</h1>
    <div data-e>${an ? L.li(L.pt(L.NIV[an.nivel].c, 40), `Hoy, ${L.NIV[an.nivel].nombre.toLowerCase()}`, [an.sueno != null ? `${L.num(an.sueno)} h de sueño` : '', an.medicacion ? 'medicación tomada' : 'sin medicación', an.mixto ? 'día mixto' : ''].filter(Boolean).join(', '), 'data-a="apuntar"', 'lm-card', L.ic('editar', 18))
      : `<button class="lm-card tq tq-g" data-a="apuntar" style="display:flex;align-items:center;gap:14px;width:100%;text-align:left;overflow:hidden;min-height:88px"><div class="lm-vis">${L.orb(L.C.cal, 170, 'right:-50px;top:-60px')}</div>${L.pt(L.C.ene, 40, 'position:relative')}<div style="position:relative;flex:1"><b>¿Cómo ha sido tu ánimo hoy?</b><small>Un minuto: nivel, sueño y medicación</small></div><span class="lm-mas" style="position:relative;width:40px;height:40px;border-radius:50%;background:var(--boton);color:var(--boton-t);display:flex;align-items:center;justify-content:center">${L.ic('mas', 20)}</span></button>`}</div>
    <div data-e style="margin-top:16px">${L.segmentado(['Semana', 'Mes', '3 meses', 'Año'], E.rango, 'rango')}</div>
    <div class="lm-periodo" data-e><button class="tq tq-i" data-a="per" data-v="-1" aria-label="Anterior">${L.ic('atras', 20)}</button><p class="lm-sub" id="lm-pt" style="text-align:center">${datos.titulo}</p><button class="tq tq-i" data-a="per" data-v="1" aria-label="Siguiente" style="${E.off >= 0 ? 'opacity:.25;pointer-events:none' : ''}">${L.ic('flecha', 20)}</button></div>
    <div class="lm-card lm-graf" data-e id="lm-graf"></div>
    <div id="lm-tipz"></div>
    ${sen.map(s => `<div class="lm-card" data-e style="margin-top:10px"><b>${s.titulo}</b><small>${s.texto}</small><button class="lm-pill tq" data-a="plan">Ver mi plan</button></div>`).join('')}
    <h3 class="lm-sec" data-e>Cómo se ha repartido</h3>
    <div data-e>${rep.total ? `<div class="lm-repb">${rep.por.filter(([, k]) => k).map(([n, k]) => `<i style="flex:${k};background:${L.NIV[n].c}"></i>`).join('')}</div>
      <div class="lm-ley">${ley.map(([, t, c]) => `<span>${L.pt(c, 16)}${t}</span>`).join('')}</div>`
      : '<p class="lm-nota-p">En este periodo no hay días apuntados. Los huecos también cuentan: no pasa nada.</p>'}</div>
    ${cs && (cs.poco >= 3 || cs.mucho >= 3) ? `<h3 class="lm-sec" data-e>Sueño y ánimo</h3><div class="lm-card" data-e>${cs.poco >= 3 && cs.arribaPoco != null ? `<p style="font-size:15px;line-height:1.45">Los días que duermes <strong>menos de 6 horas</strong>, estás por arriba el <strong class="lm-num">${cs.arribaPoco} %</strong> de las veces. Con un sueño normal, el ${cs.arribaResto} %.</p>` : ''}
      ${cs.mucho >= 3 && cs.abajoMucho != null ? `<p style="font-size:15px;line-height:1.45;margin-top:8px">Los días que duermes <strong>más de 9 horas</strong>, estás por abajo el <strong class="lm-num">${cs.abajoMucho} %</strong> de las veces. Con un sueño normal, el ${cs.abajoResto} %.</p>` : ''}
      <small style="margin-top:8px">Es lo que suele ir junto en tus datos, no causa y efecto.</small></div>` : ''}
    <div data-e style="margin-top:20px">${L.li(L.pt(L.C.ene, 36), 'Tus señales tempranas', nA + nB ? `Aprendidas de ${nA} ${nA === 1 ? 'subida' : 'subidas'} y ${nB} ${nB === 1 ? 'bajada' : 'bajadas'}` : 'Lo que suele pasar antes de una subida o una bajada', 'data-a="senales"')}</div>
    <div data-e>${L.li(L.pt(L.C.lil, 36), 'Lo que he aprendido', 'Cada fase, cómo empezó y qué te ayudó', 'data-a="aprendido"')}</div>
    <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('calendario')}</span>`, 'Hitos', 'Cambios de medicación, viajes… en la gráfica', 'data-a="hitos"')}</div>
    <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('info')}</span>`, 'Qué significa cada nivel', 'De muy arriba a muy abajo', 'data-a="sig"')}</div>
    <p class="lm-nota-p" data-e style="margin-top:6px">${L.AVISO_ESCALA}</p>
  </div>`;
  L.mancha($('[data-seg]', el), true);
  pintarGrafica(el, datos, primera);
  return {
    apuntar: () => L.abrir('nivel', { flujo: 'escala' }, 'sube'),
    plan: () => L.abrir('plan'), sig: () => L.abrir('significado'), senales: () => L.abrir('senalesTempranas'), aprendido: () => L.abrir('aprendido'), hitos: () => L.abrir('hitos'),
    rango: t => { if (E.rango === t.dataset.v) return; E.rango = t.dataset.v; E.off = 0; L.elegirSeg(t); cambiar(el, 0); },
    per: t => { E.off += +t.dataset.v; cambiar(el, +t.dataset.v); }
  };
};
/* cambia de rango o de periodo sin repintar toda la pantalla */
async function cambiar(el, dir) {
  const E = L.estAnimo, datos = L.datosPeriodo(E.rango, E.off), g = $('#lm-graf', el), pt = $('#lm-pt', el);
  $('#lm-tipz', el).innerHTML = '';
  const sig = $('[data-a="per"][data-v="1"]', el); sig.style.opacity = E.off >= 0 ? .25 : 1; sig.style.pointerEvents = E.off >= 0 ? 'none' : '';
  if (dir) {
    await Promise.all([L.anim(g, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `${-22 * dir}px 0` }], { duration: 200, easing: L.S }), L.anim(pt, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: L.S })]);
    pt.textContent = datos.titulo; pintarGrafica(el, datos, false);
    L.anim(pt, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: L.E });
    await L.anim(g, [{ opacity: 0, translate: `${22 * dir}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 420, easing: L.E });
  } else {
    await L.anim(g, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: L.S });
    L.rodar(pt, datos.titulo, true); pintarGrafica(el, datos, true);
    await L.anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: L.E });
  }
  g.style.opacity = ''; g.style.translate = '';
  /* reparto: se repinta la pestaña sin entrada para no rehacerlo a mano */
  const top = $('#lm-vista').scrollTop; L.pintarVista(false); $('#lm-vista').scrollTop = top;
}
function pintarGrafica(el, datos, animar) {
  const g = $('#lm-graf', el), E = L.estAnimo;
  const W = 346, HP = E.rango === 'Semana' ? 250 : 220;
  const hitosI = [];
  L.d.hitos.forEach(h => { const i = datos.semanal ? datos.dias.findIndex(d => h.fecha >= L.iso(d) && h.fecha < L.iso(L.mas(d, 7))) : datos.dias.findIndex(d => L.iso(d) === h.fecha); if (i >= 0) hitosI.push({ i, tipo: h.tipo, texto: h.texto }); });
  const G = L.grafica({ vals: datos.vals, sueno: datos.sueno, med: datos.med, etiquetas: datos.et, W, HP, r: datos.r, gid: 'gan', hitos: hitosI });
  g.innerHTML = G.svg;
  const svg = $('svg', g);
  if (animar) L.animarGrafica(svg);
  /* tocar un día */
  const elegir = cx => {
    const r = svg.getBoundingClientRect(), x = (cx - r.left) * (W / r.width);
    let mi = -1, md = 1e9; G.xs.forEach((xx, i) => { const d = Math.abs(xx - x); if (d < md) { md = d; mi = i; } });
    if (mi < 0 || x < G.G - 20) return;
    marcar(mi);
  };
  const marcar = i => {
    const ln = $('.lm-g-sel', svg); ln.setAttribute('x1', G.xs[i]); ln.setAttribute('x2', G.xs[i]); ln.style.opacity = 1;
    $$('.lm-g-halo', svg).forEach(h => h.style.opacity = 0);
    const h = $(`.lm-g-puntos g[data-i="${i}"] .lm-g-halo`, svg); if (h) { h.style.opacity = 1; h.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 }); }
    $$('.lm-g-et', svg).forEach(t => t.setAttribute('font-weight', +t.dataset.i === i ? 700 : 400));
    const d = datos.dias[i], v = datos.vals[i], s = datos.sueno[i], m = datos.med[i];
    let tit, txt, accion = '';
    if (datos.semanal) {
      tit = `Semana del ${L.fechaCorta(d)}`;
      txt = v == null ? 'Sin días apuntados' : `De media, ${L.NIV[L.nivelRed(v)].nombre.toLowerCase()}${s != null ? `, ${L.num(s)} horas de sueño` : ''}${m === false ? ', algún día sin medicación' : ''}`;
    } else {
      tit = L.fechaLarga(d);
      const fut = d > new Date();
      txt = v == null ? (fut ? 'Todavía no ha llegado' : 'Sin apuntar. Los huecos también cuentan.') : `${L.NIV[v].nombre}${s != null ? `, ${L.num(s)} horas de sueño` : ''}, ${m ? 'medicación tomada' : 'medicación sin tomar'}`;
      if (!fut) accion = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="lm-pill lm-claro tq" data-a="dia" data-f="${L.iso(d)}" style="margin:0">${v == null ? 'Apuntar este día' : 'Editar este día'}</button><button class="lm-pill lm-claro tq" data-a="hito" data-f="${L.iso(d)}" style="margin:0">Añadir un hito</button></div>`;
    }
    const z = $('#lm-tipz', el), viejo = $('.lm-tip', z);
    const hs = hitosI.filter(h => h.i === i);
    z.innerHTML = `<div class="lm-tip"><b>${tit}</b><span>${txt}</span>${hs.map(h => `<span style="opacity:.8">Hito: ${L.esc(h.texto)}</span>`).join('')}${accion}</div>`;
    if (!viejo) L.anim($('.lm-tip', z), [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 320, easing: L.E });
    const b = $('[data-a="dia"]', z); if (b) b.onclick = () => L.abrir('nivel', { flujo: 'escala', fecha: b.dataset.f }, 'sube');
    const bh = $('[data-a="hito"]', z); if (bh) bh.onclick = () => L.hojaHito(bh.dataset.f);
  };
  let activo = false;
  svg.addEventListener('pointerdown', e => { activo = true; elegir(e.clientX); });
  svg.addEventListener('pointermove', e => { if (activo) elegir(e.clientX); });
  svg.addEventListener('pointerup', () => activo = false); svg.addEventListener('pointerleave', () => activo = false);
  svg.style.touchAction = 'pan-y';
}

/* ============================== ELEGIR EL NIVEL ============================== */
L.pantallas.nivel = (el, o, capa) => {
  const fecha = o.fecha || L.hoy(), prev = L.mapaAnimo()[fecha];
  let sel = prev ? prev.nivel : null;
  const esHoy = fecha === L.hoy();
  el.innerHTML = `${L.top('x', L.fechaLarga(L.deIso(fecha)))}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h1 class="lm-t1" data-e>¿Cómo ha sido tu ánimo ${esHoy ? 'hoy' : 'ese día'}?</h1><p class="lm-sub" data-e style="margin-bottom:14px">Mira el día entero, no un momento.</p>
    ${[2, 1, 0, -1, -2].map(n => `<button class="lm-nv tq tq-g ${sel === n ? 'lm-on' : ''}" data-a="n" data-v="${n}" data-e style="width:100%;text-align:left;${sel === n ? `border-color:${L.NIV[n].c}` : ''}">${L.orb(L.NIV[n].c, sel === n ? 86 : 44, sel === n ? 'margin:-14px -8px -14px -14px' : 'margin:0 0 0 -2px')}<div><b>${L.NIV[n].nombre}</b><small>${L.NIV[n].exp}</small></div><span class="lm-ng">${signo(n)}</span></button>`).join('')}
    <p class="lm-nota-p" data-e style="margin-top:10px">${L.AVISO_ESCALA}</p>
  </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g ${sel == null ? 'lm-off' : ''}" data-a="seguir">Seguir</button></div>`;
  L.entrar(el, 280, 55);
  capa.acc = {
    n: t => {
      sel = +t.dataset.v; L.vibra(5);
      $$('.lm-nv', el).forEach(r => {
        const on = r === t, orb = $('.lm-orb', r);
        r.classList.toggle('lm-on', on); r.style.borderColor = on ? L.NIV[r.dataset.v].c : 'transparent';
        orb.style.width = orb.style.height = (on ? 86 : 44) + 'px'; orb.style.margin = on ? '-14px -8px -14px -14px' : '0 0 0 -2px';
      });
      $('[data-a="seguir"]', el).classList.remove('lm-off');
    },
    seguir: () => { if (sel != null) L.abrir('completar', { flujo: 'escala', fecha, nivel: sel }, 'lado'); }
  };
};
/* ============================== COMPLETAR EL DÍA ============================== */
L.pantallas.completar = (el, o, capa) => {
  const prev = L.mapaAnimo()[o.fecha], ult = [...L.d.animo].sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  const deSalud = prev?.sueno == null && L.d.salud?.[o.fecha]?.sueno != null;
  let sueno = prev?.sueno ?? L.d.salud?.[o.fecha]?.sueno ?? ult?.sueno ?? 7.5, med = prev ? prev.medicacion : true, mixto = prev?.mixto || false, sint = [...(prev?.sintomas || [])];
  el.innerHTML = `${L.top('atras', L.NIV[o.nivel].nombre, ['cerrar', 'x', 'Cerrar'])}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h1 class="lm-t1" data-e>Completa el día</h1>
    <div class="lm-card lm-fila" data-e style="margin-top:12px"><span style="color:var(--mu)">${L.ic('cama')}</span><div><b>Horas de sueño</b><small>${deSalud ? 'Desde Salud. Puedes cambiarlo' : 'La noche de antes'}</small></div><div class="lm-step"><button class="tq tq-i" data-a="s" data-v="-.5" aria-label="Menos">${L.ic('menos', 16)}</button><b class="lm-num" id="lm-su">${L.num(sueno)}</b><button class="tq tq-i" data-a="s" data-v=".5" aria-label="Más">${L.ic('mas', 16)}</button></div></div>
    <div class="lm-card lm-fila" data-e style="margin-top:10px"><span style="color:var(--mu)">${L.ic('pastilla')}</span><div><b>Medicación tomada</b><small>Como te la han pautado</small></div>${L.sw(med, 'data-a="med"')}</div>
    <div class="lm-card lm-fila" data-e style="margin-top:10px"><span style="color:var(--mu)">${L.ic('animo')}</span><div><b>Día mixto</b><small>Acelerado y hundido el mismo día</small></div>${L.sw(mixto, 'data-a="mix"')}</div>
    <h3 class="lm-sec" data-e>¿Algo de esto ${o.fecha === L.hoy() ? 'hoy' : 'ese día'}?</h3><div data-e id="lm-sintz"></div>
    <div id="lm-sintcuid"></div>
    <div class="lm-fila" data-e style="gap:14px;margin-top:4px"><button class="lm-enlace tq" data-a="nuevoSint" style="margin:0;padding:8px 2px">Añadir un síntoma tuyo</button><button class="lm-enlace tq" data-a="otrosSint" id="lm-otros" style="margin:0 0 0 auto;padding:8px 2px">Ver los de otros niveles</button></div>
    <h3 class="lm-sec" data-e>Nota para tu profesional</h3><textarea class="lm-nota" data-e id="lm-np" rows="3" placeholder="Lo que quieras contar en la consulta">${L.esc(prev?.nota || '')}</textarea>
  </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="ok">Guardar el día</button></div>`;
  let otros = false;
  const pintarSint = () => {
    const base = L.SINT_NIV[o.nivel], resto = L.SINTOMAS.filter(x => !base.includes(x));
    const z = $('#lm-sintz', el);
    z.innerHTML = L.chips([...base, ...L.d.sintomasPropios.filter(x => !base.includes(x)), ...sint.filter(x => !base.includes(x) && !L.d.sintomasPropios.includes(x))], sint, 'si')
      + (otros ? `<p class="lm-nota-p" style="margin:14px 0 8px">De otros niveles</p>${L.chips(resto.filter(x => !sint.includes(x) && !L.d.sintomasPropios.includes(x)), [], 'si')}` : '');
    cuidado();
  };
  const cuidado = () => {
    const z = $('#lm-sintcuid', el), on = sint.includes(L.SINT_CUIDADO);
    if (on && !z.innerHTML) { z.innerHTML = `<div class="lm-card" style="margin-top:12px"><b>Gracias por apuntarlo</b><small>No tienes que pasar esto a solas. Puedes llamar al 024, gratis y a cualquier hora, o hablar con alguien de confianza ahora.</small><div class="lm-chips" style="margin-top:4px"><a class="lm-pill tq" href="tel:024">Llamar al 024</a><button class="lm-pill lm-claro tq" data-a="ayuda">Tus personas</button></div></div>`; L.anim(z.firstChild, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: L.E }); }
    if (!on) z.innerHTML = '';
  };
  pintarSint();
  L.entrar(el, 300, 55);
  capa.acc = {
    otrosSint: t => { otros = !otros; L.rodar(t, otros ? 'Ver solo los de este nivel' : 'Ver los de otros niveles', true); pintarSint(); },
    ayuda: () => L.abrir('ayuda'),
    s: t => { const n = Math.max(0, Math.min(16, sueno + +t.dataset.v)); if (n === sueno) return; const sube = n > sueno; sueno = n; L.rodar($('#lm-su', el), L.num(sueno), sube); },
    med: t => { med = !med; t.classList.toggle('lm-on', med); },
    mix: t => { mixto = !mixto; t.classList.toggle('lm-on', mixto); },
    nuevoSint: () => L.hojaSintoma(v => { if (!sint.includes(v)) sint.push(v); pintarSint(); const c = $(`#lm-sintz [data-v="${CSS.escape(v)}"]`, el); if (c) L.anim(c, [{ opacity: 0, scale: .86 }, { opacity: 1, scale: 1 }], { duration: 480, easing: L.M }); }),
    si: t => { const v = t.dataset.v; sint = sint.includes(v) ? sint.filter(x => x !== v) : [...sint, v]; $$(`#lm-sintz [data-v="${CSS.escape(v)}"]`, el).forEach(c => c.classList.toggle('lm-si', sint.includes(v))); cuidado(); },
    ok: async () => {
      L.d.animo = L.d.animo.filter(a => a.fecha !== o.fecha);
      L.d.animo.push({ fecha: o.fecha, nivel: o.nivel, sueno, medicacion: med, mixto, sintomas: sint, nota: $('#lm-np', el).value.trim() });
      L.d.animo.sort((a, b) => a.fecha.localeCompare(b.fecha)); L.guardar();
      await L.cerrarFlujo('escala'); L.refrescarRaiz(); L.toast('Día guardado');
    }
  };
};
/* ============================== QUÉ SIGNIFICA CADA NIVEL ============================== */
L.pantallas.significado = (el, o, capa) => {
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
    <h1 class="lm-t1" data-e style="margin-bottom:14px">Qué significa cada nivel</h1>
    ${[2, 1, 0, -1, -2].map(n => `<div class="lm-gl" data-e>${L.orb(L.NIV[n].c, 76, 'margin:-12px -6px -12px -12px')}<div><b>${L.NIV[n].nombre} <span style="font-family:Work;font-size:14px;color:var(--mu)">${signo(n)}</span></b><small>${L.NIV[n].exp}</small></div></div>`).join('')}
    <p class="lm-sub" data-e style="margin-top:12px;font-size:14px">${L.AVISO_ESCALA}</p>
    <p class="lm-nota-p" data-e style="margin-top:10px">Cada día apuntas también las horas de sueño, si has tomado la medicación, si ha sido un día mixto y los síntomas que notes. Lumos te avisa con calma si ve tres días seguidos por arriba con el sueño bajando, tres días por abajo o dos días sin medicación.</p>
  </div></div>`;
  L.entrar(el, 200, 60);
};
