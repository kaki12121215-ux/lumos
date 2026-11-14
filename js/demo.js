/* Lumos 1.2.0 · datos de prueba (botón temporal: se quitará cuando apruebes la app) */
'use strict';
L.cargarDemo = async () => {
  let semilla = 7;
  const rnd = () => { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; };
  const elige = l => l[Math.floor(rnd() * l.length)];
  const D = L.vacio(), hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const N = 124, ini = L.mas(hoy, -N), fecha = i => L.iso(L.mas(ini, i));
  D.perfil = { nombre: 'Alex', codigo: null, tema: 'auto', escala: true, demo: true, ultimaVisita: Date.now(), creado: ini.getTime() };

  /* ---- escala: dos subidas y dos bajadas, con lo que pasó la semana de antes ---- */
  const niv = Array(N + 1).fill(0), suenoF = {}, sintF = {}, palF = {}, sinNoches = new Set();
  const pon = (a, l) => l.forEach((v, k) => niv[a + k] = v);
  const rango = (a, b, f) => { for (let i = a; i <= b; i++) f(i); };
  pon(8, [-1, -1, 0]); pon(46, [-1]);
  /* subida 1 (días 24-29) y su semana de antes: menos sueño, pensamiento rápido, «acelerado» */
  pon(24, [1, 1, 1, 2, 1, 1]);
  Object.assign(suenoF, { 20: 6.5, 21: 5.5, 22: 5.5, 23: 5, 24: 5.5, 25: 5, 26: 4.5, 27: 3.5, 28: 4.5, 29: 5.5, 30: 7 });
  Object.assign(sintF, { 22: ['Pensamiento rápido'], 23: ['Pensamiento rápido', 'Música muy alta'] }); Object.assign(palF, { 22: ['Acelerado', 'Con ganas'], 23: ['Hablador', 'Acelerado'] });
  /* bajada 1 (días 58-67): antes, más sueño, «aislado», deja de cerrar el día */
  pon(58, [-1, -1, -2, -2, -2, -1, -1, -2, -1, -1]);
  rango(54, 57, i => suenoF[i] = 9.5 + (i % 2) * .5); rango(51, 57, i => sinNoches.add(i));
  Object.assign(sintF, { 56: ['Sin ganas de ver a nadie'], 57: ['Sin ganas de ver a nadie'] }); Object.assign(palF, { 55: ['Cansado', 'Aislado'], 56: ['Apagado', 'Aislado'], 57: ['Aislado', 'Desanimado'] });
  /* subida 2 (días 86-89) */
  pon(86, [1, 1, 1, 1]);
  Object.assign(suenoF, { 82: 6.5, 83: 5.5, 84: 5.5, 85: 5, 86: 5, 87: 4.5, 88: 5, 89: 5.5 });
  Object.assign(sintF, { 84: ['Pensamiento rápido'], 85: ['Pensamiento rápido', 'Mucha energía'] }); Object.assign(palF, { 84: ['Acelerado'], 85: ['Hablador', 'Inspirado'] });
  /* bajada 2 (días 101-107), con un día mejor en medio que no la cierra */
  pon(101, [-1, -1, 0, -1, -2, -1, -1]);
  rango(97, 100, i => suenoF[i] = 9.5 + (i % 2) * .5); rango(94, 100, i => sinNoches.add(i));
  Object.assign(sintF, { 99: ['Sin ganas de ver a nadie'], 100: ['Sin ganas de ver a nadie', 'Con ansiedad'] }); Object.assign(palF, { 98: ['Cansado'], 99: ['Aislado', 'Apagado'], 100: ['Aislado', 'Cansado'] });
  /* los últimos días: estables, pero con lo que suele venir antes de una subida (un indicio) */
  pon(N - 1, [1]);
  Object.assign(suenoF, { [N - 4]: 7, [N - 3]: 5.5, [N - 2]: 5.5, [N - 1]: 5 });
  Object.assign(sintF, { [N - 2]: ['Pensamiento rápido'], [N - 1]: ['Pensamiento rápido', 'Mucha energía'] }); Object.assign(palF, { [N - 2]: ['Acelerado', 'Con ganas'], [N - 1]: ['Hablador', 'Inspirado'] });
  const huecos = new Set([5, 13, 33, 41, 47, 71, 76, 93, 115]);
  for (let i = 0; i < N; i++) {
    if (huecos.has(i)) continue;
    const n = niv[i];
    let s = suenoF[i] ?? (n === 2 ? 3.5 : n === 1 ? 5.5 + rnd() : n === -2 ? 9.5 + rnd() * 1.2 : n === -1 ? 8.5 + rnd() : 7 + rnd() * 1.2);
    s = Math.round(s * 2) / 2;
    const med = ![62, 63, 66, 105, 27].includes(i);
    const sint = sintF[i] || (n >= 1 ? [elige(['Pensamiento rápido', 'Mucha energía']), ...(rnd() < .4 ? ['Irritable'] : []), ...(n === 2 ? ['Gasto de más'] : [])] : n <= -1 ? [elige(['Sin ganas de ver a nadie', 'Con ansiedad', 'Me cuesta concentrarme'])] : []);
    const nota = n === 2 ? 'He dormido muy poco y me he comprado cosas que no necesitaba.' : n === -2 && rnd() < .5 ? 'Me ha costado mucho levantarme. No he salido de casa.' : i === N - 2 ? 'Me he despertado a las 5 con muchas ideas a la vez.' : '';
    D.animo.push({ fecha: fecha(i), nivel: n, sueno: s, medicacion: med, mixto: i === 63 || i === 28, sintomas: [...new Set(sint)], nota });
  }

  /* ---- emociones: 2 o 3 al día, según el ánimo ---- */
  const POR = {
    2: ['Eufórico', 'Acelerado', 'Irritado', 'Hablador', 'Impulsivo'], 1: ['Con ganas', 'Animado', 'Emocionado', 'Inspirado', 'Irritado', 'Productivo'],
    0: ['Tranquilo', 'A gusto', 'Contento', 'Agradecido', 'Con ganas', 'Ilusionado', 'Relajado', 'Cansado', 'Agobiado', 'Sereno', 'Querido', 'Satisfecho', 'Nervioso'],
    '-1': ['Desanimado', 'Apagado', 'Agobiado', 'Preocupado', 'Sin energía', 'Solo'], '-2': ['Triste', 'Vacío', 'Agotado', 'Hundido', 'Solo', 'Sin energía']
  };
  const INF_BUENO = ['Descanso', 'Amistades', 'Ejercicio', 'Pareja', 'Tiempo libre', 'Familia'], INF_MALO = ['Trabajo', 'Descanso', 'Salud', 'Familia', 'El tiempo'];
  const NOTAS_B = ['Ha salido muy bien la presentación.', 'Paseo largo al sol después de comer.', 'Cena con amigos, hacía tiempo.', 'He dormido de un tirón.', 'Clase de yoga y luego ducha caliente.'];
  const NOTAS_M = ['Tres reuniones seguidas y el informe sin acabar.', 'Me ha costado mucho arrancar.', 'Discusión tonta por mensajes.', 'Mucho ruido en el trabajo.'];
  const ZONAS = { tension: ['Pecho', 'Hombros', 'Tripa'], bajon: ['Pecho', 'Cabeza', 'Piernas'], energia: ['Cabeza', 'Pecho'], alegria: ['Pecho'], calma: ['Hombros'] };
  for (let i = 0; i <= N; i++) {
    const d = L.mas(ini, i), n = niv[i], esHoy = i === N;
    if (huecos.has(i) && rnd() < .7) continue;
    let horas = [8 + rnd() * 1.5, 13 + rnd() * 2, 19.5 + rnd() * 2.5].filter(() => rnd() < .8);
    if (palF[i]) horas = [9.2, 18.4].slice(0, Math.max(palF[i].length, 1));
    if (!horas.length) horas = [13.5];
    if (esHoy) { const ahora = new Date().getHours() + new Date().getMinutes() / 60; horas = [8.1, 13.66].filter(h => h < ahora - .2); if (!horas.length && ahora > 1) horas = [Math.max(.2, ahora - .4)]; }
    horas.forEach((h, k) => {
      let w = palF[i]?.[k] || elige(POR[n]);
      if (esHoy) w = ['Con ganas', 'Agobiado'][k] || w;
      const p = L.palabra(w), ts = new Date(d); ts.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0);
      const nInf = rnd() < .25 ? 0 : rnd() < .7 ? 1 : 2, base = p.agradable ? INF_BUENO : INF_MALO, inf = [];
      for (let j = 0; j < nInf; j++) inf.push(elige(base));
      if (esHoy && k === 1) { inf.length = 0; inf.push('Trabajo'); }
      const nota = esHoy && k === 1 ? 'Tres reuniones seguidas y el informe sin acabar.' : rnd() < .22 ? elige(p.agradable ? NOTAS_B : NOTAS_M) : '';
      const cuerpo = rnd() < .45 ? [...new Set([elige(ZONAS[p.familia]), ...(rnd() < .3 ? [elige(ZONAS[p.familia])] : [])])] : [];
      D.emociones.push({ id: 'd' + i + '-' + k, ts: ts.getTime(), palabra: w, tipo: k === 2 && rnd() < .3 ? 'dia' : 'ahora', influencias: [...new Set(inf)], nota, intensidad: 1 + Math.floor(rnd() * 3), cuerpo });
    });
  }

  /* ---- recursos con su valoración ---- */
  const usos = [['respirar-despacio', [2, 2, 1, 2, 0, 2, 1, 2, 0]], ['cinco-sentidos', [1, 2, 0, 1]], ['paseo', [2, 1, 2, 0]], ['frases', [1, 0]], ['respirar-cuadrada', [0, 1]], ['hablar', [2, 1, 0]]];
  const malas = D.emociones.filter(e => !L.palabra(e.palabra).agradable);
  usos.forEach(([id, vals]) => vals.forEach(v => { const e = elige(malas); D.recursos.push({ id: 'r' + D.recursos.length, ts: e.ts + 20 * 60000, recurso: id, ayudo: v, antes: e.id, despues: null, nota: null }); }));
  [['No voy a llegar a todo y van a pensar que soy un desastre.', ['Leer la mente', 'Adivinar el futuro'], 'Otras veces he llegado. Y si no llego a algo, puedo avisar.', 2],
   ['Si no me sale perfecto, no vale.', ['Todo o nada'], 'Hecho y bien es mejor que perfecto y sin hacer.', 1],
   ['Seguro que Clara está enfadada porque no me ha contestado.', ['Leer la mente'], 'Puede estar ocupada. Si me preocupa, se lo pregunto.', 2]].forEach(([dice, trampas, otra, v], k) => {
    const e = malas[malas.length - 30 - k * 17]; D.recursos.push({ id: 'rp' + k, ts: e.ts + 25 * 60000, recurso: 'mirar-pensamiento', ayudo: v, antes: e.id, despues: null, nota: { dice, trampas, otra } });
  });
  const hoyAg = D.emociones.find(e => e.id === 'd' + N + '-1');
  if (hoyAg) D.recursos.push({ id: 'rhoy', ts: hoyAg.ts + 15 * 60000, recurso: 'respirar-despacio', ayudo: 2, antes: hoyAg.id, despues: null, nota: null });

  /* ---- mañanas y noches, con tres cosas buenas ---- */
  const BUENAS = [['Paré cinco minutos a media tarde y el resto fue mejor.', 'Me di permiso para parar.', 'Lo decidí yo'], ['Terminé el informe a tiempo.', 'Lo empecé pronto.', 'Me organicé'], ['Cena tranquila en casa con Leo.', '', ''], ['Salí a caminar aunque no me apetecía.', '', 'Salí igual'], ['Me reí mucho con Clara por teléfono.', 'La llamé yo.', 'Di el primer paso'], ['El café de la mañana al sol.', '', '']];
  for (let i = 0; i < N; i++) {
    const f = fecha(i);
    if (rnd() < .55) {
      const c = [elige(L.CUIDAR)]; if (rnd() < .4) c.push(elige(L.CUIDAR));
      D.mananas.push({ fecha: f, cuidar: [...new Set(c)], apetece: elige(['Comer con Leo al mediodía.', 'Leer un rato en el sofá.', 'Ir andando al trabajo.', 'Llamar a mi hermana.', '']) });
    }
    if (!sinNoches.has(i) && rnd() < .5) {
      const nb = niv[i] < 0 ? (rnd() < .5 ? 1 : 0) : 1 + Math.floor(rnd() * 3), buenas = [];
      for (let k = 0; k < nb; k++) { const [que, porque, tu] = elige(BUENAS); if (!buenas.find(b => b.que === que)) buenas.push({ que, porque, tu }); }
      D.noches.push({ fecha: f, bien: buenas[0]?.que || '', buenas, cumplido: elige(L.CUMPLIDO) });
    }
  }
  if (new Date().getHours() >= 9) D.mananas.push({ fecha: L.iso(hoy), cuidar: ['Mi paciencia', 'Ir más despacio'], apetece: 'Comer con Leo al mediodía.' });

  /* ---- lo que sí he hecho, en los días de las bajadas ---- */
  const HECHO = ['Me he levantado', 'Me he duchado', 'He comido algo', 'He tomado la medicación', 'He salido a la calle', 'He contestado un mensaje', 'He pedido ayuda'];
  [...Array(N).keys()].filter(i => niv[i] <= -1 && rnd() < .8).forEach(i => { const c = new Set(); const k = 1 + Math.floor(rnd() * 3); for (let j = 0; j < k; j++) c.add(elige(HECHO)); D.hechos.push({ fecha: fecha(i), cosas: [...c] }); });

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

  /* ---- personas, plan, palabras, síntomas, carta, medicación, hitos, salud ---- */
  D.personas = [{ nombre: 'Clara Ibáñez Soto', tel: '600 000 001' }, { nombre: 'Leo Romero Gil', tel: '600 000 002' }];
  D.plan = {
    arriba: ['Duermo menos de 6 horas dos noches y no estoy cansado', 'Hablo más deprisa y empiezo muchas cosas', 'Gasto en cosas que no necesito'],
    abajo: ['Dejo de contestar mensajes', 'Me cuesta levantarme tres días seguidos', 'No me apetece ni lo que me gusta'],
    mal: ['Redes sociales todo el rato', 'Acostarme tarde viendo series', 'Alcohol', 'Saltarme comidas'],
    hago: ['Aviso a Leo', 'Mantengo mi hora de acostarme', 'Pido cita con mi psiquiatra', 'Dejo las compras grandes para dentro de una semana'],
    avisar: true
  };
  D.palabrasPropias = [{ palabra: 'Revuelto', familia: 'tension', def: 'Como cuando todo se mezcla por dentro.' }, { palabra: 'Domingo', familia: 'calma', def: 'Esa calma lenta de domingo por la tarde.' }];
  D.frasesPropias = ['Mañana lo veré con otros ojos.'];
  D.sintomasPropios = ['Canto solo por la calle', 'Ordeno la casa de madrugada'];
  D.carta = { ts: L.mas(hoy, -20).getTime(), texto: 'Hola. Si estás leyendo esto, hoy cuesta, y está bien que cueste.\n\nAcuérdate de que en agosto también pasó y salió. No tienes que arreglarlo todo hoy: levántate, come algo y escribe a Leo.\n\nUn abrazo de ti mismo, un día tranquilo.' };
  D.medicacion = [{ id: 'md1', nombre: 'Medicación A', dosis: '150 mg', cuando: 'Noche' }];
  D.hitos = [{ id: 'h1', fecha: fecha(40), texto: 'Viaje a Valencia', tipo: 'vida' }, { id: 'h2', fecha: fecha(72), texto: 'Medicación A: 100 mg → 150 mg', tipo: 'medicacion' }, { id: 'h3', fecha: fecha(96), texto: 'Semana de exámenes', tipo: 'vida' }];
  for (let i = N - 30; i <= N; i++) { const a = D.animo.find(x => x.fecha === fecha(i)); D.salud[fecha(i)] = { pasos: Math.round(4000 + rnd() * 8000), ...(i >= N - 6 && a ? { sueno: a.sueno } : {}) }; }
  /* reflexiones de las tres primeras fases (la última bajada queda para «Mirar atrás») */
  D.reflexiones = {
    ['arriba-' + fecha(24)]: { ts: L.mas(ini, 35).getTime(), primero: ['Dormir menos de 6 horas', 'Hablo más deprisa y empiezo muchas cosas'], ayudo: ['Mantener mis horas de sueño', 'Aviso a Leo'], noAyudo: 'Quedarme hasta tarde con el ordenador.', distinto: 'Avisar a Leo el segundo día, no el cuarto.' },
    ['abajo-' + fecha(58)]: { ts: L.mas(ini, 74).getTime(), primero: ['Dejar de cerrar el día', 'Dejo de contestar mensajes'], ayudo: ['Respirar despacio', 'Un paseo corto', 'Hablar con alguien'], noAyudo: 'Pasar el día en la cama.', distinto: 'Pedir cita antes.' },
    ['arriba-' + fecha(86)]: { ts: L.mas(ini, 95).getTime(), primero: ['Dormir menos de 6 horas'], ayudo: ['Mantener mis horas de sueño'], noAyudo: '', distinto: '' }
  };
  D.senalesConf = { 'arriba|sueno-poco': true, 'arriba|sint:Pensamiento rápido': true };
  /* anoche: tres cosas en la caja */
  const anoche = L.mas(hoy, -1); anoche.setHours(23, 30);
  D.vaciados.push({ id: 'v1', ts: anoche.getTime(), items: [{ t: 'El correo de Marta que no he contestado', estado: null }, { t: 'Lo que dije en la reunión', estado: null }, { t: 'Si me dará tiempo a todo el viernes', estado: null }] });
  D.emociones.sort((a, b) => a.ts - b.ts);
  L.d = D; L.guardar();
  await L.irAApp();
};
