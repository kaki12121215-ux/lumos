/* Lumos 1.0.0 · datos de prueba (botón temporal: se quitará en la siguiente versión) */
'use strict';
L.cargarDemo = async () => {
  let semilla = 7;
  const rnd = () => { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; };
  const elige = l => l[Math.floor(rnd() * l.length)];
  const D = L.vacio(), hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const N = 124, ini = L.mas(hoy, -N);
  D.perfil = { nombre: 'Alex', codigo: null, tema: 'auto', escala: true, demo: true, ultimaVisita: Date.now(), creado: ini.getTime() };

  /* ---- escala: rachas estables, una subida con un día de manía y una bajada ---- */
  const niv = [];
  for (let i = 0; i <= N; i++) niv.push(0);
  const pon = (a, l) => l.forEach((v, k) => niv[a + k] = v);
  pon(8, [-1, -1, 0]);
  pon(24, [1, 1, 1, 2, 1, 1, 0]);                       /* subida: hipomanía, un día de manía */
  pon(46, [-1]);
  pon(58, [-1, -1, -2, -2, -2, -1, -1, -2, -1, -1, 0]);  /* bajada: hipotimia y depresión */
  pon(84, [-1, -1]);
  pon(96, [1, 0]);
  pon(106, [-1]);
  pon(N - 3, [1, 1, 1]);                                 /* los tres últimos días: señal de aviso */
  const huecos = new Set([5, 17, 33, 41, 52, 71, 78, 90, 99, 112]);
  for (let i = 0; i < N; i++) {                          /* hoy se deja sin apuntar */
    if (huecos.has(i)) continue;
    const d = L.mas(ini, i), n = niv[i];
    let s = n === 2 ? 3.5 : n === 1 ? 5.5 + rnd() * 1 : n === -2 ? 9.5 + rnd() * 1.2 : n === -1 ? 8.5 + rnd() : 7 + rnd() * 1.2;
    if (i >= 24 && i <= 30) s = [6.5, 6, 5, 3.5, 4.5, 5.5, 7][i - 24];
    if (i >= N - 3) s = [6.5, 6, 5.5][i - (N - 3)];
    s = Math.round(s * 2) / 2;
    const med = !([62, 63, 67, 30].includes(i) || (i === N - 1));
    const sint = n >= 1 ? [elige(['Pensamiento rápido', 'Mucha energía']), ...(rnd() < .5 ? ['Irritable'] : []), ...(n === 2 ? ['Gasto de más'] : [])] : n <= -1 ? [elige(['Sin ganas de ver a nadie', 'Con ansiedad'])] : [];
    const nota = n === 2 ? 'He dormido muy poco y me he comprado cosas que no necesitaba.' : n === -2 && rnd() < .5 ? 'Me ha costado mucho levantarme. No he salido de casa.' : i === N - 2 ? 'Me he despertado a las 5 con muchas ideas a la vez.' : '';
    D.animo.push({ fecha: L.iso(d), nivel: n, sueno: s, medicacion: med, mixto: i === 63 || i === 29, sintomas: [...new Set(sint)], nota });
  }

  /* ---- emociones: 2 o 3 al día, según cómo iba el ánimo ---- */
  const POR = {
    2: ['Eufórico', 'Acelerado', 'Irritado', 'Hablador', 'Impulsivo'],
    1: ['Con ganas', 'Animado', 'Acelerado', 'Emocionado', 'Inspirado', 'Irritado', 'Productivo'],
    0: ['Tranquilo', 'A gusto', 'Contento', 'Agradecido', 'Con ganas', 'Ilusionado', 'Relajado', 'Cansado', 'Agobiado', 'Sereno', 'Querido', 'Satisfecho', 'Nervioso'],
    '-1': ['Cansado', 'Desanimado', 'Apagado', 'Agobiado', 'Preocupado', 'Sin energía', 'Tranquilo'],
    '-2': ['Triste', 'Vacío', 'Agotado', 'Hundido', 'Solo', 'Sin energía']
  };
  const INF_BUENO = ['Descanso', 'Amistades', 'Ejercicio', 'Pareja', 'Tiempo libre', 'Familia'], INF_MALO = ['Trabajo', 'Descanso', 'Salud', 'Familia', 'El tiempo'];
  const NOTAS_B = ['Ha salido muy bien la presentación.', 'Paseo largo al sol después de comer.', 'Cena con amigos, hacía tiempo.', 'He dormido de un tirón.', 'Clase de yoga y luego ducha caliente.'];
  const NOTAS_M = ['Tres reuniones seguidas y el informe sin acabar.', 'Me ha costado mucho arrancar.', 'Discusión tonta por mensajes.', 'Mucho ruido en el trabajo.'];
  for (let i = 0; i <= N; i++) {
    const d = L.mas(ini, i), n = niv[i], esHoy = i === N;
    if (huecos.has(i) && rnd() < .7) continue;
    let horas = [8 + rnd() * 1.5, 13 + rnd() * 2, 19.5 + rnd() * 2.5].filter(() => rnd() < .82);
    if (!horas.length) horas = [13.5];
    if (esHoy) { const ahora = new Date().getHours() + new Date().getMinutes() / 60; horas = [8.1, 13.66].filter(h => h < ahora - .2); if (!horas.length && ahora > 1) horas = [Math.max(0.2, ahora - .4)]; }
    horas.forEach((h, k) => {
      let w = elige(POR[n]);
      if (esHoy) w = ['Con ganas', 'Agobiado'][k] || w;
      const p = L.palabra(w), ts = new Date(d); ts.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0);
      const nInf = rnd() < .25 ? 0 : rnd() < .7 ? 1 : 2, base = p.agradable ? INF_BUENO : INF_MALO, inf = [];
      for (let j = 0; j < nInf; j++) inf.push(elige(base));
      if (esHoy && k === 1) { inf.length = 0; inf.push('Trabajo'); }
      const nota = esHoy && k === 1 ? 'Tres reuniones seguidas y el informe sin acabar.' : rnd() < .22 ? elige(p.agradable ? NOTAS_B : NOTAS_M) : '';
      D.emociones.push({ id: 'd' + i + '-' + k, ts: ts.getTime(), palabra: w, tipo: k === 2 && rnd() < .3 ? 'dia' : 'ahora', influencias: [...new Set(inf)], nota });
    });
  }

  /* ---- recursos usados con su valoración ---- */
  const usos = [['respirar-despacio', [2, 2, 1, 2, 0, 2, 1, 2, 0]], ['cinco-sentidos', [1, 2, 0, 1]], ['mirar-pensamiento', [1, 2, 0]], ['paseo', [2, 1, 2, 0]], ['frases', [1, 0]], ['respirar-cuadrada', [0, 1]], ['hablar', [2, 1, 0]]];
  const malas = D.emociones.filter(e => !L.palabra(e.palabra).agradable);
  usos.forEach(([id, vals]) => vals.forEach(v => {
    const e = elige(malas); const ts = e.ts + 20 * 60000;
    D.recursos.push({ id: L.id() + rnd().toString(36).slice(2, 5), ts, recurso: id, ayudo: v, antes: e.id, despues: null, nota: null });
  }));
  /* la entrada de hoy al mediodía tiene un recurso hecho */
  const hoyAg = D.emociones.find(e => e.id === 'd' + N + '-1');
  if (hoyAg) D.recursos.push({ id: 'rhoy', ts: hoyAg.ts + 15 * 60000, recurso: 'respirar-despacio', ayudo: 2, antes: hoyAg.id, despues: null, nota: null });

  /* ---- mañanas y noches ---- */
  for (let i = 0; i < N; i++) {
    const f = L.iso(L.mas(ini, i));
    if (rnd() < .55) {
      const c = [elige(L.CUIDAR)]; if (rnd() < .4) c.push(elige(L.CUIDAR));
      D.mananas.push({ fecha: f, cuidar: [...new Set(c)], apetece: elige(['Comer con Leo al mediodía.', 'Leer un rato en el sofá.', 'Ir andando al trabajo.', 'Llamar a mi hermana.', '']) });
      if (rnd() < .75) D.noches.push({ fecha: f, bien: elige(['Paré cinco minutos a media tarde y el resto fue mejor.', 'Terminé el informe a tiempo.', 'Cena tranquila en casa.', 'Salí a caminar aunque no me apetecía.', '']), cumplido: elige(L.CUMPLIDO) });
    }
  }
  /* hoy por la mañana, si ya es de día */
  if (new Date().getHours() >= 9) D.mananas.push({ fecha: L.iso(hoy), cuidar: ['Mi paciencia', 'Ir más despacio'], apetece: 'Comer con Leo al mediodía.' });

  /* ---- momentos ---- */
  const MOM = [
    [1, 'La risa de Leo con el vídeo del gato', ['Leo'], 'Alegre'], [3, 'Paseo por el parque con sol', ['A solas'], 'Tranquilo'],
    [5, 'Me aplaudieron la presentación', [], 'Orgulloso'], [12, 'Café largo con Clara', ['Clara'], 'A gusto'],
    [13, 'Dormí nueve horas', [], 'Descansado'], [21, 'Cena en la terraza sin mirar el móvil', ['Leo', 'Familia'], 'Querido'],
    [30, 'Primer baño del año en el río', ['Amistades'], 'Vivo'], [38, 'Terminé el puzle de mil piezas', ['A solas'], 'Satisfecho'],
    [49, 'Mi hermana vino por sorpresa', ['Familia'], 'Agradecido'], [66, 'Alguien me cedió el sitio en el autobús', [], 'Contento'],
    [80, 'Tarde de lluvia con mantita y libro', ['A solas'], 'En paz'], [101, 'Concierto pequeño en un bar', ['Amistades', 'Leo'], 'Emocionado']
  ];
  MOM.forEach(([dd, t, con, w], k) => { const ts = L.mas(hoy, -dd); ts.setHours(18 + (k % 4), 10 * k % 60); D.momentos.push({ id: 'm' + k, ts: ts.getTime(), texto: t, con, palabra: w, foto: false }); });

  /* ---- personas, plan y palabras propias ---- */
  D.personas = [{ nombre: 'Clara Ibáñez Soto', tel: '600 000 001' }, { nombre: 'Leo Romero Gil', tel: '600 000 002' }];
  D.plan = {
    arriba: ['Duermo menos de 6 horas dos noches y no estoy cansado', 'Hablo más deprisa y empiezo muchas cosas', 'Gasto en cosas que no necesito'],
    abajo: ['Dejo de contestar mensajes', 'Me cuesta levantarme tres días seguidos', 'No me apetece ni lo que me gusta'],
    hago: ['Aviso a Leo', 'Mantengo mi hora de acostarme', 'Pido cita con mi psiquiatra', 'Dejo las compras grandes para dentro de una semana'],
    avisar: true
  };
  D.palabrasPropias = [{ palabra: 'Revuelto', familia: 'tension', def: 'Como cuando todo se mezcla por dentro.' }, { palabra: 'Domingo', familia: 'calma', def: 'Esa calma lenta de domingo por la tarde.' }];
  D.frasesPropias = ['Mañana lo veré con otros ojos.'];
  D.emociones.sort((a, b) => a.ts - b.ts);
  L.d = D; L.guardar();
  await L.irAApp();
};
