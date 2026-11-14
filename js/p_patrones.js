/* Lumos 1.0.0 · patrones y diario */
'use strict';
L.estPat = { vista: 'Mes', mes: 0, anio: 0, q: '', dias: 45 };
const COLOR_INF = { Descanso: L.C.cal, Amistades: L.C.ale, Ejercicio: L.C.ver, Pareja: L.C.ene, Familia: L.C.lil, 'Tiempo libre': L.C.baj, Salud: L.C.cal, Comida: L.C.ver, 'El tiempo': L.C.baj, Trabajo: L.C.ene, 'Dormir poco': L.C.ten };

/* ============================== DIARIO (lista) ============================== */
L.htmlDiario = (q, dias) => {
  const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const t = norm(q);
  let es = [...L.d.emociones].sort((a, b) => b.ts - a.ts);
  if (t) es = es.filter(e => norm(e.palabra).includes(t) || norm(e.nota).includes(t) || (e.influencias || []).some(i => norm(i).includes(t)));
  else { const lim = L.mas(new Date(), -dias).getTime(); es = es.filter(e => e.ts >= lim); }
  if (!es.length) return `<p class="lm-vacia">${t ? 'No hay nada con esa palabra.' : 'Aquí irá todo lo que apuntes, día a día.'}</p>`;
  const grupos = []; let k = null;
  es.forEach(e => { const f = L.iso(new Date(e.ts)); if (f !== k) { grupos.push([f, []]); k = f; } grupos[grupos.length - 1][1].push(e); });
  const total = L.d.emociones.length;
  return grupos.map(([f, l]) => `<h3 class="lm-sec" data-e>${L.cuando(L.deIso(f))}</h3><div data-e>${l.map(e => `<button class="lm-ent tq tq-g" data-a="entrada" data-id="${e.id}" style="width:100%;text-align:left">${L.pt(L.colorDe(e.palabra), 36)}<div><p>${L.esc(e.palabra)}</p><small>A las ${L.hora(e.ts)}${(e.influencias || []).length ? ', por ' + e.influencias.map(L.minus).join(' y ') : ''}</small></div></button>`).join('')}</div>`).join('')
    + (!t && es.length < total ? `<button class="lm-btn lm-sec2 tq tq-g" data-a="mas" style="margin-top:20px">Ver días anteriores</button>` : '');
};
L.pantallas.diario = (el, o, capa) => {
  let q = '', dias = 45;
  el.innerHTML = `${L.top('atras', '', ['buscar', 'lupa', 'Buscar'])}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
    <h1 class="lm-t1" data-e style="margin-bottom:4px">Diario</h1>
    <div id="lm-dbz" style="overflow:hidden;max-height:0;transition:max-height .42s var(--entrar)"><div class="lm-busca" style="margin:10px 0 4px">${L.ic('lupa', 18)}<input id="lm-dq" placeholder="Buscar en el diario" autocomplete="off" enterkeyhint="search"></div></div>
    <div id="lm-dl">${L.htmlDiario('', dias)}</div></div></div>`;
  L.entrar(el, 200, 55);
  const lista = $('#lm-dl', el);
  const pintar = () => { lista.innerHTML = L.htmlDiario(q, dias); };
  $('#lm-dq', el).addEventListener('input', e => { q = e.target.value.trim(); pintar(); });
  capa.refrescar = pintar;
  capa.acc = {
    buscar: () => { const z = $('#lm-dbz', el); const ab = z.style.maxHeight !== '80px'; z.style.maxHeight = ab ? '80px' : '0'; if (ab) setTimeout(() => $('#lm-dq', el).focus(), 300); else { $('#lm-dq', el).value = ''; q = ''; pintar(); } },
    entrada: t => L.abrir('entrada', { id: t.dataset.id }),
    mas: () => { dias += 60; pintar(); }
  };
};

/* ============================== RESUMEN DE LA SEMANA ============================== */
L.resumenSemana = () => {
  const l = L.lunes(new Date()), ini = l.getTime(), antes = L.mas(l, -7).getTime();
  const esta = L.d.emociones.filter(e => e.ts >= ini), pasada = L.d.emociones.filter(e => e.ts >= antes && e.ts < ini);
  if (!esta.length) return 'Esta semana aún no has apuntado nada. No pasa nada: empieza cuando quieras.';
  const rat = l => l.filter(e => L.palabra(e.palabra).agradable).length / Math.max(1, l.length);
  const fr = [];
  if (pasada.length >= 3) { const d = rat(esta) - rat(pasada); fr.push(d > .1 ? 'Más calma que la semana pasada.' : d < -.1 ? 'Una semana algo más difícil que la anterior.' : 'Bastante parecida a la semana pasada.'); }
  else fr.push(rat(esta) >= .5 ? 'Una semana con más días agradables que difíciles.' : 'Una semana con bastantes momentos difíciles.');
  const dif = esta.filter(e => !L.palabra(e.palabra).agradable);
  if (dif.length >= 2) {
    const c = {}; dif.forEach(e => { const h = new Date(e.ts).getHours(); const f = h < 12 ? 'por la mañana' : h < 16 ? 'a mediodía' : h < 20 ? 'por la tarde' : 'por la noche'; c[f] = (c[f] || 0) + 1; });
    const [f] = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
    const w = {}; dif.forEach(e => w[e.palabra] = (w[e.palabra] || 0) + 1);
    const top = Object.entries(w).sort((a, b) => b[1] - a[1])[0][0];
    fr.push(`Lo difícil aparece sobre todo ${f}, y la palabra que más se repite es «${L.minus(top)}».`);
  }
  return fr.join(' ');
};

/* ============================== PATRONES ============================== */
L.vistas.patrones = (el, { primera }) => {
  const E = L.estPat;
  let cuerpo = '';
  if (E.vista === 'Mes') {
    const hoy = new Date(), p = new Date(hoy.getFullYear(), hoy.getMonth() + E.mes, 1), n = new Date(p.getFullYear(), p.getMonth() + 1, 0).getDate();
    const blancos = (p.getDay() + 6) % 7; let dias = '<span class="lm-dia"></span>'.repeat(blancos), con = 0;
    for (let d = 1; d <= n; d++) {
      const f = L.iso(new Date(p.getFullYear(), p.getMonth(), d)), c = L.colorDia(f), esHoy = f === L.hoy();
      if (c) con++;
      dias += `<button class="lm-dia tq tq-i ${esHoy ? 'lm-hoy' : ''}" data-a="dia" data-f="${f}" data-e="p">${c ? L.pt(c, 34) : '<i class="lm-hueco"></i>'}<small>${d}</small></button>`;
    }
    cuerpo = `<div class="lm-periodo" data-e><button class="tq tq-i" data-a="mes" data-v="-1" aria-label="Mes anterior">${L.ic('atras', 20)}</button><p class="lm-sub" style="text-align:center">${L.may(L.MESES[p.getMonth()])}${p.getFullYear() !== hoy.getFullYear() ? ' de ' + p.getFullYear() : ''}. ${con ? (con === 1 ? 'Un día' : (con <= 20 ? L.may(L.enLetra(con)) : con) + ' días') + ' con algo apuntado' : 'Sin nada apuntado'}.</p><button class="tq tq-i" data-a="mes" data-v="1" aria-label="Mes siguiente" style="${E.mes >= 0 ? 'opacity:.25;pointer-events:none' : ''}">${L.ic('flecha', 20)}</button></div>
      <div class="lm-sem" data-e>${'LMXJVSD'.split('').map(x => `<span>${x}</span>`).join('')}</div><div class="lm-cal">${dias}</div>
      <p class="lm-nota-p" data-e style="margin-top:6px">Los huecos también cuentan: no pasa nada.</p>
      <div class="lm-card" data-e style="margin-top:14px"><b>Esta semana</b><small>${L.resumenSemana()}</small></div>`;
  } else if (E.vista === 'Año') {
    const a = new Date().getFullYear() + E.anio; let filas = '';
    for (let m = 0; m < 12; m++) {
      const n = new Date(a, m + 1, 0).getDate(); let c = '';
      for (let d = 1; d <= 31; d++) { if (d > n) { c += '<i></i>'; continue; } const col = L.colorDia(L.iso(new Date(a, m, d))); c += col ? `<i style="background:${col}"></i>` : '<i class="lm-va"></i>'; }
      filas += `<div class="lm-af"><span>${L.may(L.MESES[m].slice(0, 3))}</span><div>${c}</div></div>`;
    }
    cuerpo = `<div class="lm-periodo" data-e><button class="tq tq-i" data-a="anio" data-v="-1" aria-label="Año anterior">${L.ic('atras', 20)}</button><p class="lm-sub" style="text-align:center">Tu ${a} en colores</p><button class="tq tq-i" data-a="anio" data-v="1" aria-label="Año siguiente" style="${E.anio >= 0 ? 'opacity:.25;pointer-events:none' : ''}">${L.ic('flecha', 20)}</button></div>
      <div class="lm-anio" data-e id="lm-anio">${filas}</div>
      <div class="lm-ley" data-e style="margin-top:14px">${[['Tensión', L.C.ten], ['Energía', L.C.ene], ['Alegría', L.C.ale], ['Calma', L.C.cal], ['Bajón', L.C.baj]].map(([n, c]) => `<span>${L.pt(c, 16)}${n}</span>`).join('')}</div>`;
  } else {
    cuerpo = `<div class="lm-busca" data-e style="margin-top:14px">${L.ic('lupa', 18)}<input id="lm-pq" placeholder="Buscar en el diario" autocomplete="off" enterkeyhint="search" value="${L.esc(E.q)}"></div><div id="lm-pdl">${L.htmlDiario(E.q, E.dias)}</div>`;
  }
  el.innerHTML = `<div class="lm-pad">
    <h1 class="lm-t1" data-e style="margin-bottom:14px">Patrones</h1>
    <div data-e>${L.segmentado(['Mes', 'Año', 'Diario'], E.vista, 'vista')}</div>
    <div id="lm-pc">${cuerpo}</div>
    ${E.vista !== 'Diario' ? `<div data-e style="margin-top:12px">${L.li(L.pt(L.C.ver, 38), 'Qué acompaña tus días', 'Lo que suele estar en los días agradables y en los difíciles', 'data-a="acomp"')}</div>` : ''}
  </div>`;
  L.mancha($('[data-seg]', el), true);
  const pq = $('#lm-pq', el); if (pq) pq.addEventListener('input', () => { E.q = pq.value.trim(); $('#lm-pdl', el).innerHTML = L.htmlDiario(E.q, E.dias); });
  if (primera && E.vista === 'Año' && !L.rm) $$('#lm-anio i', el).forEach((d, k) => d.animate([{ opacity: 0, scale: .3 }, { opacity: 1, scale: 1 }], { duration: 360, delay: 120 + Math.floor(k / 31) * 60 + (k % 31) * 8, easing: L.M, fill: 'backwards' }));
  const cambiar = async () => {
    const top = $('#lm-vista').scrollTop;
    await L.anim($('#lm-pc', el), [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 -6px' }], { duration: 180, easing: L.S });
    L.accRaiz = L.vistas.patrones(el, { primera: true }) || {};
    $('#lm-vista').scrollTop = top;
    L.entrar($('#lm-pc', el), 0, 45);
  };
  return {
    vista: t => { if (E.vista === t.dataset.v) return; L.elegirSeg(t); E.vista = t.dataset.v; setTimeout(cambiar, 60); },
    mes: t => { E.mes += +t.dataset.v; cambiar(); }, anio: t => { E.anio += +t.dataset.v; cambiar(); },
    dia: t => L.hojaDia(t.dataset.f), acomp: () => L.abrir('acompana'),
    entrada: t => L.abrir('entrada', { id: t.dataset.id }),
    mas: () => { E.dias += 60; $('#lm-pdl', el).innerHTML = L.htmlDiario(E.q, E.dias); }
  };
};
L.hojaDia = f => {
  const es = L.emocionesDe(f), an = L.mapaAnimo()[f], d = L.deIso(f);
  const h = L.hoja(`<h2 data-e>${L.fechaLarga(d)}</h2>
    ${an ? `<div class="lm-fila" data-e style="margin:8px 0 6px">${L.pt(L.NIV[an.nivel].c, 34)}<div><b>${L.NIV[an.nivel].nombre}</b><small class="lm-nota-p">${an.sueno != null ? L.num(an.sueno) + ' h de sueño, ' : ''}${an.medicacion ? 'medicación tomada' : 'sin medicación'}</small></div></div>` : ''}
    ${es.length ? es.map(e => `<button class="lm-ent tq tq-g" data-a="ver" data-id="${e.id}" data-e style="width:100%;text-align:left">${L.pt(L.colorDe(e.palabra), 34)}<div><p>${L.esc(e.palabra)}</p><small>A las ${L.hora(e.ts)}${(e.influencias || []).length ? ', por ' + e.influencias.map(L.minus).join(' y ') : ''}</small></div></button>`).join('')
      : `<p class="lm-sub" data-e style="margin:6px 0 10px">${an ? 'Ninguna emoción apuntada.' : 'Un día sin nada apuntado. También vale.'}</p>`}
    <div style="height:8px"></div>`, { ver: (t, e, c) => { c(); L.abrir('entrada', { id: t.dataset.id }); } });
};

/* ============================== QUÉ ACOMPAÑA TUS DÍAS ============================== */
L.pantallas.acompana = (el, o, capa) => {
  const ok = L.diasConDatos() >= 7, a = L.acompana(Date.now() - 90 * 864e5);
  const ini = new Date(); ini.setDate(1); ini.setHours(0, 0, 0, 0);
  let del = L.d.emociones.filter(e => e.ts >= ini.getTime()); if (del.length < 6) del = L.d.emociones.filter(e => e.ts >= Date.now() - 30 * 864e5);
  const cnt = {}; del.forEach(e => cnt[e.palabra] = (cnt[e.palabra] || 0) + 1);
  const top = Object.entries(cnt).sort((x, y) => y[1] - x[1]).slice(0, 9), mx = top[0]?.[1] || 1;
  const barras = l => l.map(([k, v]) => `<div class="lm-br" data-e><span>${k}</span><div class="lm-bt"><i style="width:${Math.round(Math.max(.08, v) * 100)}%;background:${COLOR_INF[k] || L.C.cal}"></i></div></div>`).join('');
  el.innerHTML = `${L.top('atras')}<div class="lm-scroll"><div class="lm-pad lm-contop lm-sinbarra">
    <h1 class="lm-t1" data-e>Qué acompaña tus días</h1>
    ${ok ? `<p class="lm-sub" data-e style="margin-bottom:6px">De los últimos tres meses. No es causa y efecto: solo lo que suele ir junto.</p>
      <h3 class="lm-sec" data-e>Suele estar en tus días agradables</h3>${a.buenos.length ? barras(a.buenos) : '<p class="lm-nota-p" data-e>Aún no hay bastantes días agradables con algo apuntado.</p>'}
      <h3 class="lm-sec" data-e>Suele estar en los difíciles</h3>${a.malos.length ? barras(a.malos) : '<p class="lm-nota-p" data-e>Aún no hay bastantes días difíciles con algo apuntado.</p>'}
      <h3 class="lm-sec" data-e>Tus palabras del mes</h3><div class="lm-nube" data-e>${top.map(([w, n], i) => `<span style="font-size:${Math.round(15 + 21 * n / mx)}px;color:${L.textoDe(L.colorDe(w))}">${L.esc(w)}</span>`).join('')}</div>`
      : `<p class="lm-sub" data-e>Lo calculo cuando hay al menos una semana apuntada. Llevas ${L.enLetra(L.diasConDatos())} ${L.diasConDatos() === 1 ? 'día' : 'días'}.</p>`}
    ${ok ? '<p class="lm-nota-p" data-e style="margin-top:14px">Lo calculo cuando hay al menos una semana apuntada.</p>' : ''}
  </div></div>`;
  L.entrar(el, 200, 55);
  if (!L.rm) $$('.lm-bt i', el).forEach((b, i) => b.animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 800, delay: 300 + i * 60, easing: L.E, fill: 'backwards' }));
};
