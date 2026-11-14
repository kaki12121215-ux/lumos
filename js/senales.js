/* Lumos 1.1.0 · señales tempranas: fases, lo que pasa antes, indicios y aprendizaje */
'use strict';
/* Una fase es una racha de 3 o más días por arriba (+1, +2) o por abajo (−1, −2).
   Un día estable en medio no la corta: solo se da por terminada tras 3 días estables
   seguidos (o una semana sin apuntar). Así, un día mejor entre días malos no cierra la bajada. */
L.fases = () => {
  const m = L.mapaAnimo(), fechas = Object.keys(m).sort(); if (!fechas.length) return [];
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const out = []; let cur = null, est = 0, vac = 0;
  const cerrar = (fin) => { cur.terminada = true; cur.finEstable = fin; out.push(cur); cur = null; est = 0; vac = 0; };
  for (let d = L.deIso(fechas[0]); d <= hoy; d = L.mas(d, 1)) {
    const f = L.iso(d), a = m[f], n = a ? a.nivel : null;
    const t = n == null ? null : n >= 1 ? 'arriba' : n <= -1 ? 'abajo' : 'estable';
    if (cur) {
      if (t === cur.tipo) { cur.dias.push(a); cur.fin = f; est = 0; vac = 0; cur.intermedios.push(...cur._pend); cur._pend = []; }
      else if (t === 'estable') { est++; vac = 0; cur._pend.push(f); if (est >= 3) cerrar(f); }
      else if (t === null) { vac++; if (vac >= 7) cerrar(f); }
      else { cerrar(f); cur = { tipo: t, inicio: f, fin: f, dias: [a], intermedios: [], _pend: [] }; }
    } else if (t === 'arriba' || t === 'abajo') cur = { tipo: t, inicio: f, fin: f, dias: [a], intermedios: [], _pend: [] };
  }
  if (cur) { cur.terminada = false; out.push(cur); }
  return out.filter(x => x.dias.length >= 3).map(x => {
    const s = x.dias.map(a => a.sueno).filter(v => v != null);
    return { ...x, id: x.tipo + '-' + x.inicio, duracion: L.difDias(L.deIso(x.inicio), L.deIso(x.fin)) + 1, max: Math.max(...x.dias.map(a => Math.abs(a.nivel))),
      sueno: s.length ? s.reduce((p, v) => p + v, 0) / s.length : null, sinMed: x.dias.filter(a => a.medicacion === false).length, mixtos: x.dias.filter(a => a.mixto).length };
  });
};
/* La racha que está en marcha ahora (aunque aún tenga menos de 3 días) */
L.faseActual = () => {
  const f = L.fases(), ult = f[f.length - 1];
  if (ult && !ult.terminada) return ult;
  return null;
};
L.nombreFase = (t, plural) => t === 'arriba' ? (plural ? 'subidas' : 'subida') : (plural ? 'bajadas' : 'bajada');

/* ---------- qué hay en una ventana de días ---------- */
const ventana = (finIso, dias = 7) => {
  const m = L.mapaAnimo(), fin = L.deIso(finIso), out = { reg: [], emo: [], noches: 0, fechas: [] };
  const ini = L.mas(fin, -(dias - 1)).getTime(), finTs = L.mas(fin, 1).getTime();
  for (let i = dias - 1; i >= 0; i--) { const f = L.iso(L.mas(fin, -i)); out.fechas.push(f); if (m[f]) out.reg.push(m[f]); }
  out.emo = L.d.emociones.filter(e => e.ts >= ini && e.ts < finTs);
  const fs = new Set(out.fechas); out.noches = L.d.noches.filter(n => fs.has(n.fecha)).length;
  return out;
};
const clavesDe = (v, base) => {
  const k = new Set(), r = v.reg;
  if (r.filter(a => a.sueno != null && a.sueno < 6).length >= 2) k.add('sueno-poco');
  if (r.filter(a => a.sueno != null && a.sueno > 9).length >= 2) k.add('sueno-mucho');
  const s = r.map(a => a.sueno).filter(x => x != null).slice(-3);
  if (s.length === 3 && s[0] > s[1] && s[1] > s[2] && s[0] - s[2] >= 1.5) k.add('sueno-bajando');
  r.forEach(a => (a.sintomas || []).forEach(x => k.add('sint:' + x)));
  if (r.some(a => a.mixto)) k.add('mixto');
  if (r.some(a => a.medicacion === false)) k.add('sin-med');
  const fam = {}, inf = {};
  v.emo.forEach(e => { k.add('pal:' + e.palabra); const f = L.palabra(e.palabra).familia; fam[f] = (fam[f] || 0) + 1; (e.influencias || []).forEach(i => inf[i] = (inf[i] || 0) + 1); });
  ['tension', 'bajon', 'energia'].forEach(f => { if ((fam[f] || 0) >= 3) k.add('fam:' + f); });
  Object.entries(inf).forEach(([i, n]) => { if (n >= 2) k.add('inf:' + i); });
  if (base && base.nochesHab && v.noches === 0) k.add('sin-noches');
  if (base && base.emoDia >= 1 && v.emo.length <= 2) k.add('menos-apuntes');
  return k;
};
L.textoSenal = (k, corto) => {
  const [t, v] = k.includes(':') ? [k.slice(0, k.indexOf(':')), k.slice(k.indexOf(':') + 1)] : [k, ''];
  const T = {
    'sueno-poco': ['Dormir menos de 6 horas', 'dormiste menos de 6 horas dos noches o más'],
    'sueno-mucho': ['Dormir más de 9 horas', 'dormiste más de 9 horas varias noches'],
    'sueno-bajando': ['El sueño baja noche a noche', 'el sueño fue bajando noche a noche'],
    mixto: ['Algún día mixto', 'tuviste algún día mixto'], 'sin-med': ['Algún día sin medicación', 'algún día no tomaste la medicación'],
    'sin-noches': ['Dejar de cerrar el día', 'dejaste de cerrar el día'], 'menos-apuntes': ['Apuntar mucho menos', 'apuntaste mucho menos que de costumbre']
  };
  if (T[t]) return T[t][corto ? 1 : 0];
  if (t === 'sint') return corto ? `apareció «${v.toLowerCase()}»` : v;
  if (t === 'pal') return corto ? `apuntaste «${L.minus(v)}»` : `Sentirte ${L.minus(v)}`;
  if (t === 'fam') return corto ? { tension: 'apuntaste mucha tensión', bajon: 'apuntaste muchas emociones de bajón', energia: 'apuntaste mucha energía' }[v] : { tension: 'Mucha tensión', bajon: 'Muchas emociones de bajón', energia: 'Mucha energía' }[v];
  if (t === 'inf') return corto ? `«${v.toLowerCase()}» salió varias veces` : `${v}, varias veces`;
  return k;
};
const unir = l => l.length > 1 ? l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1] : (l[0] || '');
L.unir = unir;

const peso = s => /^(sueno|sint|mixto|sin-med)/.test(s.clave) ? 0 : /^(sin-noches|menos)/.test(s.clave) ? 1 : 2;
/* ---------- aprender: qué aparece antes de cada tipo de fase y poco el resto del tiempo ---------- */
L.aprender = () => {
  const fases = L.fases(), m = L.mapaAnimo(), fechas = Object.keys(m).sort();
  if (!fechas.length) return { arriba: [], abajo: [], n: { arriba: 0, abajo: 0 } };
  /* días que pertenecen a una fase o a los 10 días anteriores: no cuentan como «normales» */
  const ocupado = new Set();
  fases.forEach(f => { for (let d = L.mas(L.deIso(f.inicio), -10); d <= L.deIso(f.finEstable || f.fin); d = L.mas(d, 1)) ocupado.add(L.iso(d)); });
  const dias = L.difDias(L.deIso(fechas[0]), new Date()) + 1;
  const base = { nochesHab: L.d.noches.length / Math.max(1, dias) >= .35, emoDia: L.d.emociones.length / Math.max(1, dias) };
  const normales = []; for (let d = L.mas(L.deIso(fechas[0]), 6); d <= new Date(); d = L.mas(d, 3)) { const f = L.iso(d); if (!ocupado.has(f)) { const v = ventana(f); if (v.reg.length >= 3) normales.push(clavesDe(v, base)); } }
  const conteo = l => { const c = {}; l.forEach(s => s.forEach(k => c[k] = (c[k] || 0) + 1)); return c; };
  const cb = conteo(normales), B = normales.length;
  const res = { n: {}, base, ventanas: {} };
  ['arriba', 'abajo'].forEach(t => {
    const fs = fases.filter(f => f.tipo === t), vs = fs.map(f => ({ f, k: clavesDe(ventana(L.iso(L.mas(L.deIso(f.inicio), -1))), base) })).filter(x => x.k.size);
    res.ventanas[t] = vs; res.n[t] = vs.length;
    const c = conteo(vs.map(x => x.k)), n = vs.length;
    res[t] = Object.entries(c).map(([k, kk]) => {
      const tasa = kk / n, tb = ((cb[k] || 0) + .5) / (B + 1);
      return { clave: k, k: kk, n, tasa, lift: tasa / tb, base: (cb[k] || 0) / Math.max(1, B), tipo: t, conf: L.d.senalesConf?.[t + '|' + k] };
    }).filter(s => {
      if (!((n >= 2 ? s.k >= 2 : s.k >= 1) && s.tasa >= .5 && s.lift >= 1.6)) return false;
      if (s.clave.startsWith('pal:')) { const p = L.palabra(s.clave.slice(4)); if (!(p.familia === 'tension' || p.familia === 'bajon' || (p.familia === 'energia' && t === 'arriba'))) return false; return s.lift >= 2.5; }
      if (s.clave.startsWith('inf:')) return s.lift >= 3.5;
      if (s.clave.startsWith('fam:')) return s.lift >= 2.5;
      return true;
    }).sort((a, b) => peso(a) - peso(b) || b.tasa - a.tasa || b.lift - a.lift).slice(0, 7);
  });
  return res;
};
/* ¿Hay ahora un indicio? Compara los últimos 7 días con lo aprendido */
L.indicios = (A = L.aprender()) => {
  const act = L.faseActual(), out = [];
  const v = clavesDe(ventana(L.hoy()), A.base);
  ['arriba', 'abajo'].forEach(t => {
    if (act && act.tipo === t) return;
    const ss = A[t].filter(s => s.conf !== false && v.has(s.clave));
    const fuerte = ss.some(s => s.conf === true && s.tasa >= .75);
    if (ss.length >= 2 || (ss.length === 1 && fuerte && A.n[t] >= 2)) {
      const top = ss.slice().sort((a, b) => b.k - a.k)[0];
      const cuantas = top.k === top.n ? `de tus ${top.n === 2 ? 'dos' : L.enLetra(top.n)} ${L.nombreFase(t, true)}` : `de ${top.k} de tus ${top.n} ${L.nombreFase(t, true)}`;
      out.push({ tipo: t, senales: ss, texto: `Viendo tu patrón: ${unir(ss.slice(0, 3).map(s => L.textoSenal(s.clave, true)))}. Lo mismo pasó antes ${cuantas}.` });
    }
  });
  return out;
};
L.tituloIndicio = t => `Puede ser un indicio de que empieza una ${L.nombreFase(t)}`;
/* Fase terminada hace poco y sin mirar atrás */
L.faseParaMirar = () => {
  const r = L.d.reflexiones || {};
  return L.fases().filter(f => f.terminada && !r[f.id] && !(L.d.reflexionesOmitidas || []).includes(f.id) && L.difDias(L.deIso(f.finEstable), new Date()) <= 45).pop() || null;
};
/* ¿Estamos en una racha baja? (incluye días neutros entre días malos) */
L.enBajada = () => {
  const act = L.faseActual(), m = L.mapaAnimo();
  if (act && act.tipo === 'abajo') return true;
  const a = m[L.hoy()] || m[L.iso(L.mas(new Date(), -1))];
  return !!(a && a.nivel <= -1);
};
L.mesFase = f => { const a = L.deIso(f.inicio); return `${L.nombreFase(f.tipo)} de ${L.MESES[a.getMonth()]}`; };

/* ============================== MOMENTO QUE VUELVE ============================== */
const LOGRO = ['Orgulloso', 'Satisfecho', 'Productivo', 'Decidido', 'Motivado', 'Valiente', 'Confiado', 'Atrevido'];
const DESCANSO = ['Descansado', 'Relajado', 'Ligero', 'En paz', 'Sereno', 'Libre'];
L.tipoMomento = m => {
  const t = new Set(), p = m.palabra ? L.palabra(m.palabra) : null;
  if ((m.con || []).some(c => c !== 'A solas')) t.add('conexion');
  if (p && LOGRO.includes(p.palabra)) t.add('logro');
  if (p && DESCANSO.includes(p.palabra)) t.add('descanso');
  if (p && p.familia === 'calma') t.add('calma');
  if (p && (p.familia === 'alegria' || p.familia === 'energia')) t.add('alegria');
  if (!t.size) t.add('alegria');
  return t;
};
const NECESITA = [
  [['Solo', 'Aislado', 'Rechazado', 'Distante', 'Desconectado', 'Vacío'], ['conexion'], 'te sientes {p}'],
  [['Agobiado', 'Estresado', 'Tenso', 'Nervioso', 'Inquieto', 'Desbordado', 'Presionado', 'Angustiado', 'Preocupado', 'Asustado', 'Atrapado', 'Abrumado'], ['calma', 'descanso'], 'te sientes {p}'],
  [['Desanimado', 'Desmotivado', 'Inseguro', 'Culpable', 'Avergonzado', 'Bloqueado', 'Decepcionado', 'Perdido', 'Abatido', 'Frágil', 'Vulnerable'], ['logro', 'conexion'], 'te sientes {p}'],
  [['Triste', 'Melancólico', 'Nostálgico', 'Herido', 'Dolido', 'Hundido', 'Desesperanzado'], ['conexion', 'alegria'], 'te sientes {p}'],
  [['Cansado', 'Agotado', 'Sin energía', 'Pesado', 'Apagado', 'Aburrido', 'Indiferente'], ['descanso', 'alegria'], 'te sientes {p}'],
  [['Enfadado', 'Irritado', 'Frustrado', 'Harto', 'Furioso', 'Molesto', 'Resentido', 'Alterado', 'Impaciente'], ['calma'], 'te sientes {p}']
];
const PORQUE = { conexion: 'esto lo viviste con {con}', logro: 'esto te salió bien a ti', calma: 'aquí estabas en calma', descanso: 'aquí habías descansado', alegria: 'esto te hizo sentir {m}' };
/* elige el momento que mejor encaja con lo que sientes y explica por qué */
L.momentoOportuno = palabra => {
  const ms = L.d.momentos; if (!ms.length) return null;
  const fila = NECESITA.find(([l]) => l.includes(palabra)) || [[], L.palabra(palabra).familia === 'bajon' ? ['conexion', 'alegria'] : ['calma', 'alegria'], 'te sientes {p}'];
  const fb = L.d.momentoFeedback || {};
  const punt = ms.map(m => {
    const t = L.tipoMomento(m); let s = 0, motivo = null;
    fila[1].forEach((n, i) => { if (t.has(n)) { s += 3 - i; motivo = motivo || n; } });
    s += (fb[m.id] || 0) * 1.5 + Math.random() * .6;
    return { m, s, motivo };
  }).filter(x => x.motivo).sort((a, b) => b.s - a.s);
  const x = punt[0] || { m: ms[Math.floor(Math.random() * ms.length)], motivo: 'alegria' };
  const con = (x.m.con || []).filter(c => c !== 'A solas');
  const porque = `Te lo enseño porque ${fila[2].replace('{p}', L.minus(palabra))} y ${PORQUE[x.motivo].replace('{con}', con.length ? unir(con) : 'alguien').replace('{m}', x.m.palabra ? L.minus(x.m.palabra) : 'bien')}.`;
  return { momento: x.m, porque };
};
/* un momento al azar para hoy, sin repetir hasta que salgan todos */
L.momentoDelDia = () => {
  const ms = L.d.momentos; if (ms.length < 2) return null;
  const v = L.d.momentoDia || (L.d.momentoDia = { fecha: null, id: null, vistos: [] });
  if (v.fecha === L.hoy() && ms.find(m => m.id === v.id)) return ms.find(m => m.id === v.id);
  let libres = ms.filter(m => !v.vistos.includes(m.id)); if (!libres.length) { v.vistos = []; libres = ms; }
  const m = libres[Math.floor(Math.random() * libres.length)];
  v.fecha = L.hoy(); v.id = m.id; v.vistos.push(m.id); L.guardar();
  return m;
};

/* ============================== SUEÑO Y ÁNIMO ============================== */
L.cruceSueno = () => {
  const a = L.d.animo.filter(x => x.sueno != null); if (a.length < 14) return null;
  const pct = (l, f) => l.length ? Math.round(l.filter(f).length / l.length * 100) : null;
  const poco = a.filter(x => x.sueno < 6), resto = a.filter(x => x.sueno >= 6 && x.sueno <= 9), mucho = a.filter(x => x.sueno > 9);
  return { poco: poco.length, mucho: mucho.length, arribaPoco: pct(poco, x => x.nivel >= 1), arribaResto: pct(resto, x => x.nivel >= 1), abajoMucho: pct(mucho, x => x.nivel <= -1), abajoResto: pct(resto, x => x.nivel <= -1) };
};
