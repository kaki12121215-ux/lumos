/* Lumos 1.2.0 · gráfica del ánimo y cálculos */
'use strict';
L.spline = pts => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};
L.nivelRed = v => Math.max(-2, Math.min(2, Math.round(v)));

/* vals: niveles (o null). Devuelve el SVG y las x de cada punto */
L.grafica = ({ vals, sueno, med, etiquetas, W = 346, HP = 260, r = 5, gid = 'g', sel = null, hitos = null }) => {
  const G = 84, pw = W - G - 12, bh = HP / 5, n = vals.length, y = v => (2 - v) * bh + bh / 2;
  const xs = vals.map((_, i) => G + (n > 1 ? pw * i / (n - 1) : pw / 2));
  const C = L.C, osc = L.oscuro();
  const o = [`<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y(2)}" x2="0" y2="${y(-2)}"><stop offset="0" stop-color="${C.ten}"/><stop offset=".25" stop-color="${C.ene}"/><stop offset=".5" stop-color="${C.cal}"/><stop offset=".75" stop-color="${C.baj}"/><stop offset="1" stop-color="${C.ind}"/></linearGradient></defs>`];
  for (const v of [2, 1, 0, -1, -2]) {
    const N = L.NIV[v];
    o.push(`<rect x="0" y="${((2 - v) * bh + 2).toFixed(1)}" width="${W}" height="${(bh - 4).toFixed(1)}" rx="12" fill="${N.c}" fill-opacity="${v === 0 ? (osc ? .3 : .26) : (osc ? .15 : .13)}"/>`);
    o.push(`<text x="10" y="${(y(v) + (N.clinico ? -1 : 4)).toFixed(1)}" font-size="11.5" fill="${L.textoDe(N.c)}" font-family="Work" font-weight="${v === 0 ? 700 : 400}">${N.nombre}</text>`);
    if (N.clinico) o.push(`<text x="10" y="${(y(v) + 11).toFixed(1)}" font-size="8.5" fill="${L.textoDe(N.c)}" fill-opacity=".7" font-family="Work">${N.clinico.toLowerCase()}</text>`);
  }
  /* tramos continuos (los huecos cortan la curva) */
  const tramos = []; let t = [];
  vals.forEach((v, i) => { if (v == null) { if (t.length) tramos.push(t); t = []; } else t.push([xs[i], y(v)]); });
  if (t.length) tramos.push(t);
  o.push('<g class="lm-g-area">');
  tramos.forEach(pts => { if (pts.length > 1) { const c = L.spline(pts); o.push(`<path d="${c} L${pts[pts.length - 1][0].toFixed(1)} ${y(0).toFixed(1)} L${pts[0][0].toFixed(1)} ${y(0).toFixed(1)}Z" fill="url(#${gid})" fill-opacity="${osc ? .26 : .3}"/>`); } });
  o.push('</g><g class="lm-g-linea">');
  tramos.forEach(pts => { if (pts.length > 1) o.push(`<path d="${L.spline(pts)}" pathLength="1" fill="none" stroke="url(#${gid})" stroke-width="${r > 6 ? 3.2 : 2.6}" stroke-linecap="round"/>`); });
  o.push('</g>');
  if (hitos) hitos.forEach(h => { const c = h.tipo === 'medicacion' ? L.C.lil : h.tipo === 'vida' ? L.C.ale : L.C.cal; o.push(`<g class="lm-g-hito"><line x1="${xs[h.i].toFixed(1)}" x2="${xs[h.i].toFixed(1)}" y1="8" y2="${HP - 2}" stroke="${c}" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="${xs[h.i].toFixed(1)}" cy="6" r="4.2" fill="${c}"/></g>`); });
  o.push(`<line class="lm-g-sel" x1="0" x2="0" y1="4" y2="${HP + (sueno ? 60 : 0) + (med ? 20 : 0)}" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="2 4" style="opacity:0"/>`);
  o.push('<g class="lm-g-puntos">');
  vals.forEach((v, i) => {
    if (v == null) return; const c = L.NIV[L.nivelRed(v)].c;
    o.push(`<g data-i="${i}"><circle class="lm-g-halo" cx="${xs[i].toFixed(1)}" cy="${y(v).toFixed(1)}" r="${r + 9}" fill="${c}" fill-opacity=".28" style="opacity:0"/><circle cx="${xs[i].toFixed(1)}" cy="${y(v).toFixed(1)}" r="${r}" fill="${c}" style="stroke:var(--card)" stroke-width="${r > 3 ? 2 : 1}"/></g>`);
  });
  o.push('</g>');
  let alto = HP;
  if (sueno) {
    alto += 14;
    o.push(`<text x="10" y="${alto + 26}" font-size="11.5" style="fill:var(--mu)" font-family="Work">Sueño</text><g class="lm-g-sueno">`);
    const bw = Math.max(2.5, Math.min(18, pw / n * .55));
    sueno.forEach((h, i) => {
      if (h == null) return; const hh = Math.min(h, 11) / 11 * 40, poco = h < 6;
      o.push(`<rect x="${(xs[i] - bw / 2).toFixed(1)}" y="${(alto + 40 - hh).toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="${(bw / 2.4).toFixed(1)}" fill="${poco ? C.ene : 'currentColor'}" fill-opacity="${poco ? .95 : .22}"/>`);
    });
    o.push('</g>'); alto += 46;
  }
  if (med) {
    o.push(`<text x="10" y="${alto + 17}" font-size="11.5" style="fill:var(--mu)" font-family="Work">Medicación</text>`);
    const rr = Math.min(4.2, Math.max(1.6, pw / n * .3));
    med.forEach((m, i) => {
      if (m == null) return;
      o.push(m ? `<circle cx="${xs[i].toFixed(1)}" cy="${alto + 13}" r="${rr.toFixed(1)}" fill="currentColor" fill-opacity=".55"/>` : `<circle cx="${xs[i].toFixed(1)}" cy="${alto + 13}" r="${rr.toFixed(1)}" fill="none" stroke="${L.C.coral}" stroke-width="1.6"/>`);
    });
    alto += 26;
  }
  if (etiquetas) {
    etiquetas.forEach((e, i) => { if (e) o.push(`<text class="lm-g-et" data-i="${i}" x="${xs[i].toFixed(1)}" y="${alto + 16}" font-size="11" style="fill:var(--mu)" font-family="Work" text-anchor="middle">${e}</text>`); });
    alto += 22;
  }
  return { svg: `<svg viewBox="0 0 ${W} ${alto}" style="color:var(--ink)">${o.join('')}</svg>`, xs, y, W, alto, G };
};
/* dibuja la curva y los puntos al entrar */
L.animarGrafica = svg => {
  if (L.rm) return;
  $$('.lm-g-linea path', svg).forEach(p => p.animate([{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], { duration: 900, easing: L.E, fill: 'backwards' }));
  $$('.lm-g-area path', svg).forEach(p => p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 380, easing: L.E, fill: 'backwards' }));
  const pts = $$('.lm-g-puntos > g', svg), n = pts.length;
  pts.forEach((g, i) => g.animate([{ opacity: 0, scale: .4 }, { opacity: 1, scale: 1 }], { duration: 420, delay: 160 + (n > 1 ? i / (n - 1) : 0) * 760, easing: L.M, fill: 'backwards' }));
  $$('.lm-g-sueno rect', svg).forEach((b, i, a) => { b.style.transformBox = 'fill-box'; b.style.transformOrigin = 'bottom'; b.animate([{ scale: '1 0' }, { scale: '1 1' }], { duration: 520, delay: 200 + (a.length > 1 ? i / (a.length - 1) : 0) * 500, easing: L.E, fill: 'backwards' }); });
};

/* ============================== DATOS DEL ÁNIMO ============================== */
L.mapaAnimo = () => { const m = {}; (L.d.animo || []).forEach(a => m[a.fecha] = a); return m; };
L.lunes = d => { const x = new Date(d); const k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); x.setHours(0, 0, 0, 0); return x; };
L.datosPeriodo = (rango, off = 0) => {
  const m = L.mapaAnimo(), hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const diario = dias => ({ dias, vals: dias.map(d => m[L.iso(d)]?.nivel ?? null), sueno: dias.map(d => m[L.iso(d)]?.sueno ?? null), med: dias.map(d => { const a = m[L.iso(d)]; return a ? a.medicacion : null; }) });
  if (rango === 'Semana') {
    const l = L.mas(L.lunes(hoy), off * 7), dias = [...Array(7)].map((_, i) => L.mas(l, i)), o = diario(dias);
    const f = dias[6];
    o.titulo = l.getMonth() === f.getMonth() ? `Del ${l.getDate()} al ${f.getDate()} de ${L.MESES[f.getMonth()]}` : `Del ${L.fechaCorta(l)} al ${L.fechaCorta(f)}`;
    o.et = ['L', 'M', 'X', 'J', 'V', 'S', 'D']; o.r = 9; return o;
  }
  if (rango === 'Mes') {
    const p = new Date(hoy.getFullYear(), hoy.getMonth() + off, 1), n = new Date(p.getFullYear(), p.getMonth() + 1, 0).getDate();
    const dias = [...Array(n)].map((_, i) => new Date(p.getFullYear(), p.getMonth(), i + 1)), o = diario(dias);
    o.titulo = L.may(L.MESES[p.getMonth()]) + (p.getFullYear() !== hoy.getFullYear() ? ' de ' + p.getFullYear() : '');
    o.et = dias.map(d => [1, 8, 15, 22, 29].includes(d.getDate()) ? String(d.getDate()) : ''); o.r = 4; return o;
  }
  if (rango === '3 meses') {
    const fin = L.mas(hoy, off * 91), dias = [...Array(91)].map((_, i) => L.mas(fin, i - 90)), o = diario(dias);
    o.titulo = `Del ${L.fechaCorta(dias[0])} al ${L.fechaCorta(dias[90])}`;
    o.et = dias.map(d => d.getDate() === 1 ? L.may(L.MESES[d.getMonth()].slice(0, 3)) : ''); o.r = 2.6; return o;
  }
  /* Año: medias por semana */
  const finL = L.mas(L.lunes(hoy), off * 364), semanas = [...Array(52)].map((_, i) => L.mas(finL, (i - 51) * 7));
  const o = { dias: semanas, vals: [], sueno: [], med: [], semanal: true };
  semanas.forEach(l => {
    const ds = [...Array(7)].map((_, i) => m[L.iso(L.mas(l, i))]).filter(Boolean);
    o.vals.push(ds.length ? ds.reduce((s, a) => s + a.nivel, 0) / ds.length : null);
    const ss = ds.filter(a => a.sueno != null); o.sueno.push(ss.length ? ss.reduce((s, a) => s + a.sueno, 0) / ss.length : null);
    o.med.push(ds.length ? ds.every(a => a.medicacion) : null);
  });
  o.titulo = `De ${L.MESES[semanas[0].getMonth()]} de ${semanas[0].getFullYear()} a ${L.MESES[L.mas(semanas[51], 6).getMonth()]} de ${L.mas(semanas[51], 6).getFullYear()}`;
  let ult = -1; o.et = semanas.map(d => { const mm = L.mas(d, 3).getMonth(); if (mm !== ult) { ult = mm; return L.MESES[mm][0].toUpperCase(); } return ''; });
  o.r = 2.8; return o;
};
L.reparto = vals => {
  const v = vals.filter(x => x != null).map(L.nivelRed);
  return { total: v.length, estable: v.filter(x => x === 0).length, arriba: v.filter(x => x > 0).length, abajo: v.filter(x => x < 0).length, por: [2, 1, 0, -1, -2].map(n => [n, v.filter(x => x === n).length]) };
};
/* Señales de aviso: dichas con calma */
L.senales = () => {
  const m = L.mapaAnimo(), hoy = new Date(), out = [];
  const racha = cond => {
    let d = hoy, k = 0;
    if (!m[L.iso(d)]) d = L.mas(d, -1);
    const dias = [];
    while (m[L.iso(d)] && cond(m[L.iso(d)].nivel)) { dias.unshift(m[L.iso(d)]); d = L.mas(d, -1); k++; }
    return dias;
  };
  const sube = racha(n => n >= 1);
  if (sube.length >= 3) {
    const s = sube.map(a => a.sueno).filter(x => x != null);
    const bajaSueno = s.length >= 2 && s[s.length - 1] < s[0];
    const nom = 'por arriba';
    out.push({ tipo: 'arriba', titulo: `${L.may(L.enLetra(sube.length))} días seguidos ${nom}`, texto: bajaSueno ? 'Y cada noche duermes menos. Es una de tus señales de aviso.' : 'Es una de tus señales de aviso. Míralo con calma.' });
  }
  const baja = racha(n => n <= -1);
  if (baja.length >= 3) out.push({ tipo: 'abajo', titulo: `${L.may(L.enLetra(baja.length))} días seguidos por abajo`, texto: 'Puede ser buen momento para mirar tu plan y cuidarte un poco más.' });
  let sin = 0; for (let i = 0; i < 7; i++) { const a = m[L.iso(L.mas(hoy, -i))]; if (a && a.medicacion === false) sin++; }
  if (sin >= 2) out.push({ tipo: 'med', titulo: `${L.may(L.enLetra(sin))} días sin medicación esta semana`, texto: 'Si te cuesta acordarte, puedes contarlo en la consulta. Sin culpa.' });
  return out;
};

/* ============================== EMOCIONES ============================== */
L.emocionesDe = iso => L.d.emociones.filter(e => L.iso(new Date(e.ts)) === iso).sort((a, b) => a.ts - b.ts);
L.colorDia = iso => {
  const es = L.emocionesDe(iso); if (!es.length) return null;
  const dia = es.filter(e => e.tipo === 'dia').pop(); if (dia) return L.colorDe(dia.palabra);
  const cuenta = {}; es.forEach(e => { const f = L.palabra(e.palabra).familia; cuenta[f] = (cuenta[f] || 0) + 1; });
  const fam = Object.entries(cuenta).sort((a, b) => b[1] - a[1])[0][0];
  const ts = es.filter(e => L.palabra(e.palabra).familia === fam).map(e => L.palabra(e.palabra).t);
  return L.rampa(ts.reduce((a, b) => a + b, 0) / ts.length);
};
L.diasConDatos = () => new Set(L.d.emociones.map(e => L.iso(new Date(e.ts)))).size;
/* qué acompaña a los días agradables y a los difíciles */
L.acompana = (desde) => {
  const dias = {};
  L.d.emociones.filter(e => !desde || e.ts >= desde).forEach(e => {
    const k = L.iso(new Date(e.ts)); const d = dias[k] = dias[k] || { ag: 0, de: 0, inf: new Set() };
    L.palabra(e.palabra).agradable ? d.ag++ : d.de++; (e.influencias || []).forEach(i => d.inf.add(i));
  });
  const m = L.mapaAnimo();
  Object.entries(dias).forEach(([k, d]) => { const a = m[k]; if (a && a.sueno != null && a.sueno < 6) d.inf.add('Dormir poco'); });
  const buenos = Object.values(dias).filter(d => d.ag > d.de), malos = Object.values(dias).filter(d => d.de > d.ag);
  const contar = lista => { const c = {}; lista.forEach(d => d.inf.forEach(i => c[i] = (c[i] || 0) + 1)); return Object.entries(c).map(([k, v]) => [k, v / Math.max(1, lista.length)]).sort((a, b) => b[1] - a[1]); };
  return { buenos: contar(buenos).slice(0, 4), malos: contar(malos).slice(0, 3), nb: buenos.length, nm: malos.length };
};
L.lasQueAyudan = () => {
  const c = {};
  L.d.recursos.forEach(r => { const x = c[r.recurso] = c[r.recurso] || { n: 0, si: 0 }; x.n++; if (r.ayudo >= 1) x.si++; if (r.ayudo === 2) x.si += .001; });
  return Object.entries(c).filter(([, v]) => v.n >= 2).map(([k, v]) => ({ id: k, n: v.n, si: Math.floor(v.si), punt: v.si / v.n + v.n / 100 })).sort((a, b) => b.punt - a.punt);
};
