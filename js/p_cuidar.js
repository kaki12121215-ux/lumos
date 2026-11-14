/* Lumos 1.3.0 · ayuda, plan, informe y ajustes */
'use strict';

/* ============================== SI LO ESTÁS PASANDO MUY MAL ============================== */
L.pantallas.ayuda = (el, o, capa) => {
  const pintar = entrada => { const _sc = $('.lm-scroll', el)?.scrollTop || 0; queueMicrotask(() => { const s = $('.lm-scroll', el); if (s && _sc) s.scrollTop = _sc; });
    const ps = L.ordenPersonas();
    el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Si lo estás pasando muy mal</h1><p class="lm-sub" data-e style="margin-bottom:16px">No tienes que poder con esto a solas.</p>
      <a class="lm-card lm-fuerte tq tq-g" data-e href="tel:024">${L.ic('telefono', 28)}<div><b>Llamar al 024</b><small>Atención a la conducta suicida. Gratis, confidencial y a cualquier hora.</small></div></a>
      <a class="lm-li lm-card tq tq-g" data-e href="tel:112" style="margin-top:10px"><span style="color:var(--mu)">${L.ic('telefono')}</span><div><b>Emergencias, 112</b><small>Si hay peligro inmediato</small></div><span class="lm-fl">${L.ic('flecha', 18)}</span></a>
      <h3 class="lm-sec" data-e>Tus personas</h3>
      ${ps.length ? ps.map(p => `<div data-e>${L.li(`<span class="lm-av">${L.esc(p.nombre[0])}</span>`, L.esc(p.nombre), p.tel ? 'Llamar o escribir' : 'Sin teléfono', `data-a="per" data-i="${L.d.personas.indexOf(p)}"`)}</div>`).join('')
        : `<div class="lm-card" data-e><b>Añade a alguien de confianza</b><small>Para tenerlo a mano en un mal momento.</small><button class="lm-pill tq" data-a="anadir">Añadir una persona</button></div>`}
      <div data-e style="margin-top:12px">${L.li(`<span style="color:var(--mu)">${L.ic('doc')}</span>`, 'Mi plan para días malos', L.d.plan.hago.length ? 'Lo escribiste tú, un día tranquilo' : 'Escríbelo un día tranquilo', 'data-a="plan"')}</div>
      <div data-e style="margin-top:2px">${L.li(L.pt(L.C.baj, 36), 'Respirar despacio', 'Un minuto, ahora', 'data-a="resp"')}</div>
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.refrescar = () => pintar(false);
  capa.acc = {
    per: t => L.hojaPersona(L.d.personas[+t.dataset.i]), anadir: () => L.editarPersona(null, () => pintar(false)),
    plan: () => L.abrir('plan'), resp: () => L.abrirRecurso('respirar-despacio')
  };
};

/* ============================== SEÑALES Y PLAN ============================== */
L.pantallas.plan = (el, o, capa) => {
  let editar = false;
  const pintar = entrada => { const _sc = $('.lm-scroll', el)?.scrollTop || 0; queueMicrotask(() => { const s = $('.lm-scroll', el); if (s && _sc) s.scrollTop = _sc; });
    const P = L.d.plan, vacio = L.SECCIONES_PLAN.every(([k]) => !P[k].length);
    el.innerHTML = `${L.top('atras', '', [editar ? 'listo' : 'editar', editar ? 'ok' : 'editar', editar ? 'Listo' : 'Editar'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Mis señales y mi plan</h1><p class="lm-sub" data-e>${vacio && !editar ? 'Escríbelo un día tranquilo, para cuando cueste pensar. Toca el lápiz para empezar: te propongo ideas.' : editar ? 'Toca una idea para añadirla, o escribe la tuya.' : 'Escrito por ti, para cuando cueste pensar.'}</p>
      ${L.SECCIONES_PLAN.map(([k, t, ph]) => `<h3 class="lm-sec" data-e>${t}</h3><div data-e>${P[k].map((x, i) => `<div class="lm-lin">${L.ic(k === 'mal' ? 'x' : 'ok', 17)}<span>${L.esc(x)}</span>${editar ? `<button class="tq tq-i" data-a="quitar" data-k="${k}" data-i="${i}" aria-label="Borrar" style="color:var(--coral)">${L.ic('borrar', 17)}</button>` : ''}</div>`).join('')}
        ${editar ? `<input class="lm-input lm-vac" data-k="${k}" placeholder="${ph}" maxlength="100" enterkeyhint="done" style="margin-top:6px">
          <p class="lm-nota-p" style="margin:8px 0 6px">Ideas</p><div class="lm-chips lm-ideas" data-k="${k}">${L.IDEAS_PLAN[k].filter(x => !P[k].includes(x)).map(x => `<button class="lm-chip tq tq-i" data-a="idea" data-k="${k}" data-v="${L.esc(x)}" style="font-size:13.5px;min-height:36px;padding:8px 13px">${L.esc(x)}</button>`).join('')}</div>`
        : !P[k].length ? '<p class="lm-nota-p">Aún vacío.</p>' : ''}</div>`).join('')}
      <h3 class="lm-sec" data-e>Para entenderte</h3>
      <div data-e>${L.li(L.pt(L.C.ene, 34), 'Tus señales tempranas', 'Las que Lumos aprende de tus fases', 'data-a="senales"')}</div>
      <div data-e>${L.li(L.pt(L.C.lil, 34), 'Carta para los días malos', L.d.carta ? 'Escrita el ' + L.fechaCorta(new Date(L.d.carta.ts)) : 'Escríbela un día tranquilo', 'data-a="carta"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('pastilla')}</span>`, 'Mi medicación', L.d.medicacion.length ? L.d.medicacion.map(m => m.nombre).join(', ') : 'Tu pauta y sus cambios', 'data-a="medicacion"')}</div>
      <div class="lm-card lm-fila" data-e style="margin-top:14px"><div><b>Avisarme cuando aparezcan</b><small>Lumos mira tu escala y tu sueño y te lo dice con calma en Hoy.</small></div>${L.sw(P.avisar, 'data-a="avisar"')}</div>
    </div></div>`;
    $$('input[data-k]', el).forEach(inp => {
      const add = () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; L.d.plan[inp.dataset.k].push(v); L.guardar(); const k = inp.dataset.k; pintar(false); const n = $(`input[data-k="${k}"]`, el); n?.focus(); };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      inp.addEventListener('blur', add);
    });
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.acc = {
    editar: () => { editar = true; pintar(false); L.entrar(el, 0, 30); },
    listo: () => { document.activeElement?.blur(); editar = false; pintar(false); L.entrar(el, 0, 30); L.refrescarRaiz(); },
    idea: async t => {
      const k = t.dataset.k, v = t.dataset.v; L.d.plan[k].push(v); L.guardar();
      await L.anim(t, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: .9 }], { duration: 200, easing: L.S });
      pintar(false);
      const filas = $$(`.lm-lin`, el).filter(f => f.textContent.trim() === v); const f = filas[filas.length - 1];
      if (f) L.anim(f, [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 420, easing: L.E });
    },
    quitar: t => { const k = t.dataset.k, i = +t.dataset.i, v = L.d.plan[k][i]; L.d.plan[k].splice(i, 1); L.guardar(); pintar(false); L.toast('Borrado', () => { L.d.plan[k].splice(i, 0, v); L.guardar(); pintar(false); }); },
    senales: () => L.abrir('senalesTempranas'), carta: () => L.abrir('carta'), medicacion: () => L.abrir('medicacion'),
    avisar: t => { L.d.plan.avisar = !L.d.plan.avisar; t.classList.toggle('lm-on', L.d.plan.avisar); L.guardar(); L.refrescarRaiz(); }
  };
};

/* ============================== INFORME PARA TU PROFESIONAL ============================== */
const ALTO = { 2: 46, 1: 38, 0: 30, '-1': 22, '-2': 14 };
L.datosInforme = () => {
  const hoy = new Date(), m = L.mapaAnimo(), dias = [...Array(90)].map((_, i) => L.mas(hoy, i - 89)), reg = dias.map(d => m[L.iso(d)]).filter(Boolean);
  const est = reg.filter(a => a.nivel === 0).length, sue = reg.filter(a => a.sueno != null);
  let periodos = 0, en = false; dias.forEach(d => { const a = m[L.iso(d)]; const s = a && a.nivel >= 1; if (s && !en) periodos++; en = !!s; });
  let periodosAbajo = 0; en = false; dias.forEach(d => { const a = m[L.iso(d)]; const s = a && a.nivel <= -1; if (s && !en) periodosAbajo++; en = !!s; });
  const meses = [2, 1, 0].map(k => new Date(hoy.getFullYear(), hoy.getMonth() - k, 1));
  return {
    dias, reg, meses, m,
    estable: reg.length ? Math.round(est / reg.length * 100) : null,
    sueno: sue.length ? sue.reduce((s, a) => s + a.sueno, 0) / sue.length : null,
    fases: L.fases().filter(f => L.deIso(f.finEstable || f.fin) >= dias[0]),
    periodos, periodosAbajo, sinMed: reg.filter(a => a.medicacion === false).length, mixtos: reg.filter(a => a.mixto).length
  };
};
L.pantallas.informe = (el, o, capa) => {
  const D = L.datosInforme();
  const tira = p => { const n = new Date(p.getFullYear(), p.getMonth() + 1, 0).getDate(); let b = ''; for (let d = 1; d <= n; d++) { const a = D.m[L.iso(new Date(p.getFullYear(), p.getMonth(), d))]; b += a ? `<i style="height:${ALTO[a.nivel]}px;background:${L.NIV[a.nivel].c}"></i>` : '<i style="height:4px;background:var(--lin2)"></i>'; } return `<div class="lm-tira" data-e><span>${L.may(L.MESES[p.getMonth()])}</span><div>${b}</div></div>`; };
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop">
    <h1 class="lm-t1" data-e>Informe para tu profesional</h1><p class="lm-sub" data-e>Tres meses de un vistazo, para llevar a la consulta.</p>
    <div class="lm-card" data-e style="margin-top:14px;padding:12px 14px">${D.meses.map(tira).join('')}</div>
    <div class="lm-cifras">
      <div class="lm-card" data-e><b class="lm-num">${D.estable == null ? '—' : D.estable + ' %'}</b><small>de los días, estable</small></div>
      <div class="lm-card" data-e><b class="lm-num">${D.sueno == null ? '—' : L.num(D.sueno) + ' h'}</b><small>de sueño de media</small></div>
      <div class="lm-card" data-e><b class="lm-num">${D.periodos}</b><small>${D.periodos === 1 ? 'periodo' : 'periodos'} por arriba</small></div>
      <div class="lm-card" data-e><b class="lm-num">${D.sinMed}</b><small>${D.sinMed === 1 ? 'día' : 'días'} sin medicación</small></div>
    </div>
    ${D.fases.length ? `<h3 class="lm-sec" data-e>Fases de estos tres meses</h3>${D.fases.map(f => `<div data-e>${L.li(L.pt(f.tipo === 'arriba' ? L.C.ene : L.C.baj, 32), L.may(L.mesFase(f)), `${f.duracion} días desde el ${L.fechaCorta(L.deIso(f.inicio))}${f.terminada ? '' : ', en marcha'}`, `data-a="fase" data-id="${f.id}"`)}</div>`).join('')}` : ''}
    <p class="lm-nota-p" data-e style="margin-top:12px">${D.reg.length} de 90 días apuntados. El PDF incluye también tus señales tempranas, lo que aprendiste de cada fase, tu medicación y los hitos. ${L.AVISO_ESCALA}</p>
  </div></div><div class="lm-abajo"><button class="lm-btn tq tq-g" data-a="pdf">Crear el PDF</button></div>`;
  L.entrar(el, 200, 55);
  if (!L.rm) $$('.lm-tira i', el).forEach((b, i) => b.animate([{ scale: '1 0' }, { scale: '1 1' }], { duration: 520, delay: 300 + (i % 31) * 12 + Math.floor(i / 31) * 90, easing: L.E, fill: 'backwards' }));
  capa.acc = { pdf: () => L.imprimirInforme(), fase: t => L.abrir('ficha', { id: t.dataset.id }) };
};
L.imprimirInforme = () => {
  const D = L.datosInforme(), p = L.d.perfil, P = new L.PDF(), M = P.M, W = P.W - 2 * M;
  P.y -= 6; P.t(M, P.y, 'Informe de Lumos', 22, true); P.y -= 18;
  P.t(M, P.y, `${p.nombre} · del ${L.fechaCorta(D.dias[0])} al ${L.fechaCorta(D.dias[89])} de ${D.dias[89].getFullYear()}`, 10, false, '#6E635A'); P.y -= 6;
  P.titulo('Tres meses de un vistazo');
  D.meses.forEach(mm => {
    P.sitio(30); P.y -= 26; P.t(M, P.y + 4, L.may(L.MESES[mm.getMonth()]), 9.5, false, '#6E635A');
    const n = new Date(mm.getFullYear(), mm.getMonth() + 1, 0).getDate(), x0 = M + 70, bw = (W - 70) / 31;
    for (let d = 1; d <= n; d++) { const a = D.m[L.iso(new Date(mm.getFullYear(), mm.getMonth(), d))]; const h = a ? [5, 9, 13, 17, 21][a.nivel + 2] : 1.5; P.r(x0 + (d - 1) * bw, P.y, bw - 1.4, h, a ? L.NIV[a.nivel].c : '#DDD6CB'); }
  });
  P.y -= 16; let lx = M; [2, 1, 0, -1, -2].forEach(n => { P.r(lx, P.y, 7, 7, L.NIV[n].c); const tx = L.nivelConClinico(n); P.t(lx + 10, P.y + .5, tx, 8, false, '#6E635A'); lx += P.ancho(tx, 8) + 22; });
  P.titulo('Cifras');
  P.parrafo(`Días apuntados: ${D.reg.length} de 90. Estable: ${D.estable ?? '—'} % de los días. Sueño medio: ${D.sueno == null ? '—' : L.num(D.sueno) + ' h'}. Periodos por arriba: ${D.periodos}. Periodos por abajo: ${D.periodosAbajo}. Días sin medicación: ${D.sinMed}. Días mixtos: ${D.mixtos}.`, 10);
  if (D.fases.length) {
    P.titulo('Fases (3 días o más por arriba o por abajo)');
    P.tabla(['Fase', 'Inicio', 'Días', 'Sueño', 'Sin med.', 'Lo que notó primero', 'Lo que ayudó'], D.fases.map(f => { const r = (L.d.reflexiones || {})[f.id] || {}; return [L.may(L.nombreFase(f.tipo)), L.fechaCorta(L.deIso(f.inicio)), String(f.duracion), f.sueno == null ? '' : L.num(f.sueno) + ' h', String(f.sinMed), (r.primero || []).join(', '), (r.ayudo || []).join(', ')]; }), [52, 66, 34, 42, 44, 130, W - 368]);
  }
  const A = L.aprender(), sen = ['arriba', 'abajo'].flatMap(t => A[t].filter(x => x.conf !== false).map(x => `${L.may(L.nombreFase(t))}: ${L.textoSenal(x.clave)} (antes de ${x.k} de ${x.n})`));
  if (sen.length) { P.titulo('Señales tempranas que se repiten'); sen.forEach(x => P.parrafo('· ' + x, 9.5)); }
  const PL = L.d.plan;
  if (PL.arriba.length + PL.abajo.length + PL.mal.length + PL.hago.length) {
    P.titulo('Su plan, escrito por la persona');
    [['Señales hacia arriba', PL.arriba], ['Señales hacia abajo', PL.abajo], ['Lo que le hace mal', PL.mal], ['Lo que hace cuando las ve', PL.hago]].forEach(([t, l]) => { if (!l.length) return; P.parrafo(t, 9.5, true); P.parrafo(l.join('; ') + '.', 9.5, false, '#3A322C'); P.y -= 3; });
  }
  if (L.d.medicacion.length) { P.titulo('Medicación apuntada'); P.parrafo(L.d.medicacion.map(m => [m.nombre, m.dosis, m.cuando].filter(Boolean).join(', ')).join('; ') + '.', 9.5); }
  const hs = L.d.hitos.filter(x => L.deIso(x.fecha) >= D.dias[0]).sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (hs.length) { P.titulo('Hitos y cambios'); hs.forEach(x => P.parrafo(`${L.fechaCorta(L.deIso(x.fecha))}: ${x.texto}`, 9.5)); }
  P.titulo('Día a día');
  P.tabla(['Día', 'Ánimo', 'Sueño', 'Med.', 'Mixto', 'Síntomas', 'Nota'], D.dias.map(d => D.m[L.iso(d)]).filter(Boolean).reverse().map(a => [(x => `${x.getDate()}/${x.getMonth() + 1}`)(L.deIso(a.fecha)), L.NIV[a.nivel].nombre, a.sueno != null ? L.num(a.sueno) + ' h' : '', a.medicacion ? 'Sí' : 'No', a.mixto ? 'Sí' : '', (a.sintomas || []).join(', '), a.nota || '']), [40, 62, 38, 30, 32, 140, W - 342], 8);
  P.y -= 8; P.parrafo(`${L.AVISO_ESCALA} Generado con Lumos ${L.VERSION} el ${L.fechaCorta(new Date())}.`, 8.5, false, '#8A7E73');
  L.entregarPDF(P.salida(), `Lumos_informe_${L.hoy()}.pdf`);
};

/* ============================== AJUSTES ============================== */
L.pantallas.ajustes = (el, o, capa) => {
  const pintar = entrada => { const _sc = $('.lm-scroll', el)?.scrollTop || 0; queueMicrotask(() => { const s = $('.lm-scroll', el); if (s && _sc) s.scrollTop = _sc; });
    const p = L.d.perfil, np = L.d.palabrasPropias.length, ps = L.d.personas.length;
    const temas = { auto: 'Automático', claro: 'Claro', oscuro: 'Oscuro' };
    el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra lm-ajustes">
      <h1 class="lm-t1" data-e style="margin-bottom:14px">Ajustes de Lumos</h1>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('persona')}</span>`, 'Nombre', L.esc(p.nombre), 'data-a="nombre"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('candado')}</span>`, 'Código para entrar', p.codigo ? 'Activado' : 'Desactivado', 'data-a="codigo"')}</div>
      <div class="lm-card" data-e style="margin-bottom:9px"><div class="lm-fila" style="margin-bottom:12px"><span style="color:var(--mu)">${L.ic('paleta')}</span><div><b>Tema</b><small>Automático sigue al iPhone</small></div></div>${L.segmentado(Object.values(temas), temas[p.tema || 'auto'], 'tema')}</div>
      <div class="lm-card lm-fila" data-e style="margin-bottom:9px"><span style="color:var(--mu)">${L.ic('animo')}</span><div><b>Escala del ánimo</b><small>Con sueño y medicación</small></div>${L.sw(p.escala !== false, 'data-a="escala"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('palabra')}</span>`, 'Mis palabras', np ? `${np <= 20 ? L.may(L.enLetra(np)) : np} ${np === 1 ? 'añadida' : 'añadidas'} por ti` : 'Añade las tuyas al campo', 'data-a="palabras"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('persona')}</span>`, 'Mis personas de confianza', ps ? `${ps <= 20 ? L.may(L.enLetra(ps)) : ps}` : 'Nadie todavía', 'data-a="personas"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('doc')}</span>`, 'Mi plan para días malos', 'Señales y lo que hago', 'data-a="plan"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('escala')}</span>`, 'Informe para tu profesional', 'En PDF', 'data-a="informe"')}</div>
      <div class="lm-card lm-fila" data-e style="margin-bottom:9px"><span style="color:var(--mu)">${L.ic('mano')}</span><div><b>Modo cuidado</b><small>Hoy solo enseña tu plan, tus personas y lo básico</small></div>${L.sw(!!p.cuidado, 'data-a="cuidado"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('ok')}</span>`, 'Mis síntomas', L.d.sintomasPropios.length ? `${L.d.sintomasPropios.length} ${L.d.sintomasPropios.length === 1 ? 'añadido' : 'añadidos'} por ti` : 'Añade los tuyos', 'data-a="sintomas"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('pastilla')}</span>`, 'Mi medicación', 'Pauta y cambios', 'data-a="medicacion"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('calendario')}</span>`, 'Hitos', 'Lo que sale en la gráfica', 'data-a="hitos"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('frase')}</span>`, 'Carta para los días malos', L.d.carta ? 'Escrita' : 'Sin escribir', 'data-a="carta"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.MARCA('aj', 22, 16)}</span>`, 'Animación al abrir', (L.INTROS.find(x => x[0] === (p.intro || 'amanecer')) || L.INTROS[0])[1], 'data-a="intro"')}</div>
      <div data-e>${L.li(`<span style="color:var(--mu)">${L.ic('flecha')}</span>`, 'Atajos y Salud', 'Abrir Lumos a una hora y pasarle el sueño', 'data-a="atajos"')}</div>
      ${p.demo ? `<div data-e style="margin-top:8px">${L.li(`<span style="color:var(--mu)">${L.ic('salir')}</span>`, 'Salir de los datos de prueba', 'Vuelve a la bienvenida con Lumos vacía', 'data-a="salirdemo"')}</div>` : ''}
      <button class="lm-enlace lm-borrar tq" data-a="borrar" data-e style="margin-top:12px">Borrar todo lo de Lumos</button>
      <p class="lm-version" data-e>Lumos ${L.VERSION}</p>
      <p class="lm-nota-p" data-e style="text-align:center;margin-top:4px">Tus datos solo están en este móvil.</p>
    </div></div>`;
    L.mancha($('[data-seg]', el), true);
    if (entrada) L.entrar(el, 200, 50);
  };
  pintar(true);
  capa.refrescar = () => pintar(false);
  capa.acc = {
    intro: () => L.hojaIntro(() => pintar(false)),
    nombre: () => {
      const h = L.hoja(`<h2 data-e>Tu nombre</h2><input class="lm-input" id="lm-nn" data-e maxlength="30" value="${L.esc(L.d.perfil.nombre)}" style="margin:8px 0 16px"><button class="lm-btn tq tq-g" data-a="ok" data-e>Guardar</button>`,
        { ok: (t, e, c) => { const v = $('#lm-nn', h.el).value.trim(); if (!v) return; L.d.perfil.nombre = v; L.guardar(); c(); pintar(false); L.refrescarRaiz(); } });
    },
    codigo: () => {
      const tiene = !!L.d.perfil.codigo;
      L.hoja(`<h2 data-e>Código para entrar</h2><p class="lm-sub" data-e style="margin-bottom:18px">${tiene ? 'Lumos te pide cuatro cifras al abrirla.' : 'Cuatro cifras al abrir Lumos, para que nadie más entre.'}</p>
        ${tiene ? `<button class="lm-btn tq tq-g" data-a="cambiar" data-e>Cambiar el código</button><button class="lm-btn lm-sec2 tq tq-g" data-a="quitar" data-e style="margin-top:10px">Quitar el código</button>` : `<button class="lm-btn tq tq-g" data-a="activar" data-e>Activar el código</button>`}`, {
        cambiar: (t, e, c) => { c(); L.abrir('codigo', { modo: 'cambiar' }); },
        quitar: (t, e, c) => { c(); L.abrir('codigo', { modo: 'quitar' }); },
        activar: (t, e, c) => { c(); L.abrir('codigo', { modo: 'crear' }); }
      });
    },
    tema: t => { L.elegirSeg(t); const v = { Automático: 'auto', Claro: 'claro', Oscuro: 'oscuro' }[t.dataset.v]; L.d.perfil.tema = v; L.guardar(); setTimeout(L.aplicarTema, 260); },
    escala: t => { const on = !(L.d.perfil.escala !== false); L.d.perfil.escala = on; t.classList.toggle('lm-on', on); L.guardar(); L.pintarBarra(true); L.refrescarRaiz(); },
    palabras: () => L.abrir('misPalabras'), personas: () => L.abrir('personas'), plan: () => L.abrir('plan'), informe: () => L.abrir('informe'),
    cuidado: t => { L.d.perfil.cuidado = !L.d.perfil.cuidado; t.classList.toggle('lm-on', L.d.perfil.cuidado); L.guardar(); L.refrescarRaiz(); },
    sintomas: () => L.abrir('misSintomas'), medicacion: () => L.abrir('medicacion'), hitos: () => L.abrir('hitos'), carta: () => L.abrir('carta'), atajos: () => L.abrir('atajos'),
    salirdemo: () => L.confirmar('Salir de los datos de prueba', 'Se borran los datos de prueba y vuelves a la bienvenida, con Lumos vacía, para crear tu perfil.', 'Salir y empezar vacía', async () => { await L.borrarTodo(); location.reload(); }, false),
    borrar: () => L.confirmar('¿Borrar todo lo de Lumos?', 'Se borran tus emociones, tu escala, tus momentos con sus fotos, tus personas y tu plan. No se puede deshacer.', 'Borrar todo', async () => { await L.borrarTodo(); location.reload(); })
  };
};

/* ============================== MIS PERSONAS ============================== */
L.editarPersona = (p, alFin) => {
  const h = L.hoja(`<h2 data-e>${p ? 'Editar persona' : 'Persona de confianza'}</h2><p class="lm-sub" data-e style="margin-bottom:14px">Nombre y apellidos, y su teléfono para llamar o escribir.</p>
    <input class="lm-input" id="lm-pn" data-e placeholder="Nombre y apellidos" maxlength="50" value="${L.esc(p?.nombre || '')}" autocomplete="off">
    <input class="lm-input" id="lm-ptel" data-e placeholder="Teléfono" type="tel" maxlength="20" value="${L.esc(p?.tel || '')}" autocomplete="off">
    <button class="lm-btn tq tq-g" data-a="ok" data-e style="margin-top:8px">Guardar</button>
    ${p ? `<button class="lm-enlace lm-borrar tq" data-a="borrar" data-e>Borrar a ${L.esc(p.nombre.split(' ')[0])}</button>` : ''}`, {
    ok: (t, e, c) => {
      const n = $('#lm-pn', h.el).value.trim(), tel = $('#lm-ptel', h.el).value.trim(); if (!n) return;
      if (p) { p.nombre = n; p.tel = tel; } else L.d.personas.push({ nombre: n, tel });
      L.guardar(); c(); alFin?.(); L.capas.forEach(x => x.refrescar?.());
    },
    borrar: (t, e, c) => {
      const i = L.d.personas.indexOf(p); L.d.personas.splice(i, 1); L.guardar(); c(); alFin?.(); L.capas.forEach(x => x.refrescar?.());
      L.toast('Persona borrada', () => { L.d.personas.splice(i, 0, p); L.guardar(); alFin?.(); L.capas.forEach(x => x.refrescar?.()); });
    }
  });
};
L.pantallas.personas = (el, o, capa) => {
  const pintar = entrada => { const _sc = $('.lm-scroll', el)?.scrollTop || 0; queueMicrotask(() => { const s = $('.lm-scroll', el); if (s && _sc) s.scrollTop = _sc; });
    const ps = L.ordenPersonas();
    el.innerHTML = `${L.top('atras', '', ['anadir', 'mas', 'Añadir'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Mis personas de confianza</h1><p class="lm-sub" data-e style="margin-bottom:16px">Aparecen en Hablar con alguien y en Si lo estás pasando muy mal. Ordenadas por apellido.</p>
      ${ps.length ? ps.map(p => `<div data-e>${L.li(`<span class="lm-av">${L.esc(p.nombre[0])}</span>`, L.esc(p.nombre), L.esc(p.tel || 'Sin teléfono'), `data-a="ed" data-i="${L.d.personas.indexOf(p)}"`, 'lm-card', L.ic('editar', 18))}</div>`).join('')
        : `<button class="lm-btn tq tq-g" data-a="anadir" data-e>Añadir una persona</button>`}
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.refrescar = () => pintar(false);
  capa.acc = { anadir: () => L.editarPersona(null, () => pintar(false)), ed: t => L.editarPersona(L.d.personas[+t.dataset.i], () => pintar(false)) };
};

/* ============================== MIS PALABRAS ============================== */
L.pantallas.misPalabras = (el, o, capa) => {
  const pintar = entrada => { const _sc = $('.lm-scroll', el)?.scrollTop || 0; queueMicrotask(() => { const s = $('.lm-scroll', el); if (s && _sc) s.scrollTop = _sc; });
    const ps = L.d.palabrasPropias;
    el.innerHTML = `${L.top('atras', '', ['anadir', 'mas', 'Añadir'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
      <h1 class="lm-t1" data-e>Mis palabras</h1><p class="lm-sub" data-e style="margin-bottom:16px">Las que has añadido al campo de emociones, con el color de su familia.</p>
      ${ps.length ? ps.map((p, i) => `<div class="lm-li lm-card" data-e>${L.pt(L.colorDe(p.palabra), 38)}<div><b style="font-family:Gloock;font-weight:400;font-size:21px">${L.esc(p.palabra)}</b><small>${L.FAM[p.familia].nombre}${p.def ? ' · ' + L.esc(p.def) : ''}</small></div><button class="tq tq-i" data-a="quitar" data-i="${i}" aria-label="Borrar" style="color:var(--coral);padding:8px">${L.ic('borrar', 19)}</button></div>`).join('')
        : `<p class="lm-vacia" data-e>Aún no has añadido ninguna. Si al buscar no encuentras la tuya, la puedes añadir.</p><button class="lm-btn tq tq-g" data-a="anadir" data-e>Añadir palabra</button>`}
    </div></div>`;
    if (entrada) L.entrar(el, 200, 55);
  };
  pintar(true);
  capa.acc = {
    anadir: () => L.hojaPalabra('', () => pintar(false)),
    quitar: t => { const i = +t.dataset.i, p = L.d.palabrasPropias[i]; L.d.palabrasPropias.splice(i, 1); L.guardar(); pintar(false); L.toast('Palabra borrada', () => { L.d.palabrasPropias.splice(i, 0, p); L.guardar(); pintar(false); }); }
  };
};
