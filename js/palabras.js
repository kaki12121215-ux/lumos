/* Lumos 1.0.0 · contenidos: palabras, niveles del ánimo, recursos */
'use strict';
/* Familias, de arriba abajo en el campo: tensión, energía, alegría, calma, bajón.
   Cada familia ocupa un tramo del espectro de color (t de 0 a 1). */
L.FAM = {
  tension: { nombre: 'Tensión', t: [0, .12], agradable: false },
  energia: { nombre: 'Energía', t: [.13, .29], agradable: true },
  alegria: { nombre: 'Alegría', t: [.30, .46], agradable: true },
  calma: { nombre: 'Calma', t: [.48, .71], agradable: true },
  bajon: { nombre: 'Bajón', t: [.73, 1], agradable: false }
};
const P = (fam, lista) => lista.map(([p, def, ag]) => ({ palabra: p, def, familia: fam, agradable: ag ?? L.FAM[fam].agradable }));
L.PALABRAS_BASE = [
  ...P('tension', [
    ['Furioso', 'Una rabia fuerte que cuesta frenar.'], ['Enfadado', 'Algo te ha molestado y lo notas en el cuerpo.'],
    ['Harto', 'Ya no te queda paciencia para esto.'], ['Irritado', 'Todo te roza más de la cuenta.'],
    ['Frustrado', 'Querías algo y no sale como esperabas.'], ['Resentido', 'Te dura una herida de algo que pasó.'],
    ['Celoso', 'Temes perder algo o a alguien que te importa.'], ['Molesto', 'Una incomodidad que no termina de irse.'],
    ['Alterado', 'Te ha removido algo y estás revuelto.'], ['Tenso', 'El cuerpo en guardia, como esperando un golpe.'],
    ['Presionado', 'Sientes que te exigen más de lo que puedes dar.'], ['Estresado', 'Demasiadas cosas a la vez y poco margen.'],
    ['Agobiado', 'Sientes que es demasiado y que no llegas.'], ['Desbordado', 'Lo que pasa supera lo que puedes sostener.'],
    ['Nervioso', 'Inquietud en el cuerpo ante algo que llega.'], ['Inquieto', 'No consigues estarte quieto por dentro.'],
    ['Impaciente', 'Quieres que algo pase ya.'], ['Preocupado', 'Le das vueltas a algo que podría salir mal.'],
    ['Angustiado', 'Un nudo que aprieta y no sabes soltar.'], ['Asustado', 'Algo te parece una amenaza.'],
    ['Inseguro', 'Dudas de ti o de lo que va a pasar.'], ['Confuso', 'No terminas de entender qué te pasa.'],
    ['Desconfiado', 'Te cuesta fiarte de lo que ves o de quien tienes delante.'], ['Avergonzado', 'Quisieras que no te hubieran visto así.'],
    ['Culpable', 'Sientes que has hecho daño o has fallado.'], ['Atrapado', 'No ves salida a lo que te pasa.']
  ]),
  ...P('energia', [
    ['Acelerado', 'Vas más rápido de lo habitual, por dentro y por fuera.', false], ['Eufórico', 'Una alegría enorme, casi desbordada.'],
    ['Emocionado', 'Algo te ilusiona y lo notas en el pecho.'], ['Entusiasmado', 'Te lanzas a algo con muchas ganas.'],
    ['Sorprendido', 'Ha pasado algo que no esperabas.'], ['Impulsivo', 'Te salen las cosas antes de pensarlas.', false],
    ['Enérgico', 'Tienes fuerza para lo que venga.'], ['Activo', 'Con ganas de moverte y hacer.'],
    ['Motivado', 'Tienes un porqué y te empuja.'], ['Decidido', 'Sabes lo que quieres hacer y vas.'],
    ['Con ganas', 'Te apetece hacer cosas y empezar.'], ['Hablador', 'Te salen muchas palabras y muchas ideas.', false], ['Valiente', 'Te atreves aunque dé un poco de miedo.'], ['Atrevido', 'Te ves capaz de probar algo nuevo.'],
    ['Productivo', 'Las cosas salen y avanzas.'], ['Concentrado', 'Toda tu atención en una sola cosa.'],
    ['Despierto', 'Atento y con la cabeza clara.'], ['Expectante', 'Esperas algo con atención.'],
    ['Juguetón', 'Con ganas de broma y de jugar.']
  ]),
  ...P('alegria', [
    ['Ilusionado', 'Con ganas de que llegue algo que esperas.'], ['Alegre', 'Una alegría ligera que se nota.'],
    ['Contento', 'Las cosas están bien y lo sabes.'], ['Feliz', 'Una alegría que llena.'], ['Animado', 'Con buen ánimo y buen tono.'],
    ['Radiante', 'Brillas y se te nota en la cara.'], ['Orgulloso', 'Valoras algo que has hecho tú.'],
    ['Optimista', 'Confías en que irá bien.'], ['Esperanzado', 'Ves una salida o algo bueno por delante.'],
    ['Curioso', 'Con ganas de saber y descubrir.'], ['Inspirado', 'Te vienen ideas y ganas de crear.'],
    ['Creativo', 'Te salen ideas nuevas con facilidad.'], ['Vivo', 'Notas la vida con intensidad.'],
    ['Divertido', 'Te lo estás pasando bien.'], ['Afortunado', 'Sientes que tienes suerte.'],
    ['Satisfecho', 'Lo que has hecho te deja bien.'], ['Confiado', 'Te fías de ti y de lo que viene.'],
    ['Ligero', 'Sin peso encima, con soltura.'], ['Encantado', 'Algo te ha gustado mucho.']
  ]),
  ...P('calma', [
    ['Agradecido', 'Valoras algo bueno que has recibido.'], ['A gusto', 'Cómodo donde estás y con quien estás.'],
    ['Querido', 'Sientes el cariño de alguien.'], ['Acompañado', 'No estás solo con lo que te pasa.'],
    ['Comprendido', 'Alguien ha entendido lo que sientes.'], ['Apoyado', 'Tienes a quien recurrir.'],
    ['Conectado', 'Te sientes cerca de alguien o de algo.'], ['Respetado', 'Te tratan como mereces.'],
    ['Incluido', 'Formas parte, cuentan contigo.'], ['Compasivo', 'Miras con cariño el dolor de otro o el tuyo.'],
    ['Tierno', 'Con ganas de cuidar y de dar cariño.'], ['Seguro', 'Nada te amenaza ahora mismo.'],
    ['Cómodo', 'Bien en tu sitio, sin esfuerzo.'], ['Equilibrado', 'Ni arriba ni abajo, en tu centro.'],
    ['Centrado', 'Con la cabeza en su sitio.'], ['Aliviado', 'Se ha ido un peso que llevabas.'],
    ['Tranquilo', 'Sin prisa ni preocupación ahora.'], ['Relajado', 'El cuerpo suelto y sin tensión.'],
    ['Sereno', 'Una calma profunda y estable.'], ['En paz', 'Contigo y con lo que te rodea.'],
    ['Descansado', 'Has recuperado fuerzas.'], ['Paciente', 'Puedes esperar sin que te pese.'],
    ['Reflexivo', 'Pensando las cosas con calma.'], ['Arropado', 'Rodeado de gente que te cuida.'], ['Contemplativo', 'Mirando sin prisa lo que tienes delante.'], ['Libre', 'Sin ataduras, con margen para elegir.']
  ]),
  ...P('bajon', [
    ['Cansado', 'Te falta energía para seguir igual.'], ['Agotado', 'Sin fuerzas después de mucho esfuerzo.'],
    ['Sin energía', 'Cuesta ponerse en marcha.'], ['Pesado', 'El cuerpo y la cabeza van lentos.'],
    ['Aburrido', 'Nada te llama la atención ahora.'], ['Apagado', 'Con poca luz por dentro.'],
    ['Desmotivado', 'Has perdido el porqué de lo que haces.'], ['Bloqueado', 'Quieres avanzar y no te sale.'],
    ['Distante', 'Lejos de los demás, aunque estén cerca.'], ['Desconectado', 'Como si miraras todo desde fuera.'],
    ['Indiferente', 'Nada te importa demasiado ahora.'], ['Desanimado', 'Se te han ido las ganas.'],
    ['Decepcionado', 'Esperabas otra cosa y no ha llegado.'], ['Triste', 'Una pena que pide su sitio.'],
    ['Nostálgico', 'Echas de menos algo que ya pasó.'], ['Melancólico', 'Una tristeza suave y larga.'],
    ['Solo', 'Te falta compañía de verdad.'], ['Aislado', 'Separado de la gente, sin puentes.'],
    ['Herido', 'Algo o alguien te ha hecho daño.'], ['Dolido', 'Te ha dolido algo que alguien dijo o hizo.'], ['Rechazado', 'Sientes que no te quieren cerca.'],
    ['Vulnerable', 'Expuesto, con poca protección.'], ['Frágil', 'Como si cualquier cosa te pudiera romper.'],
    ['Perdido', 'No sabes bien hacia dónde ir.'], ['Vacío', 'Un hueco donde antes había algo.'],
    ['Abatido', 'Derrotado, sin fuerza para levantarte.'], ['Hundido', 'Muy abajo, todo pesa.'],
    ['Desesperanzado', 'No ves cómo podría mejorar.']
  ])
];
/* Todas las palabras (base + propias) con su color fijo */
L.palabras = () => {
  const lista = [...L.PALABRAS_BASE, ...((L.d && L.d.palabrasPropias) || []).map(p => ({ palabra: p.palabra, def: p.def || 'Una palabra tuya.', familia: p.familia, agradable: L.FAM[p.familia].agradable, propia: true }))];
  const porFam = {};
  lista.forEach(p => (porFam[p.familia] = porFam[p.familia] || []).push(p));
  Object.entries(porFam).forEach(([f, ps]) => {
    const [a, b] = L.FAM[f].t;
    ps.forEach((p, i) => { p.t = a + (b - a) * (ps.length > 1 ? i / (ps.length - 1) : .5); p.color = L.rampa(p.t); });
  });
  return Object.keys(L.FAM).flatMap(f => porFam[f] || []);
};
L.palabra = w => { const p = L.palabras().find(x => x.palabra === w); return p || { palabra: w, def: '', familia: 'calma', agradable: true, t: .6, color: L.C.cal }; };
L.colorDe = w => L.palabra(w).color;
L.minus = w => w.charAt(0).toLowerCase() + w.slice(1);

L.INFLUENCIAS = ['Trabajo', 'Familia', 'Pareja', 'Descanso', 'Amistades', 'Salud', 'Ejercicio', 'Tiempo libre', 'Comida', 'El tiempo'];

/* ============================== ESCALA DEL ÁNIMO ============================== */
L.NIV = {
  2: { nombre: 'Manía', c: L.C.ten, signo: '+2', exp: 'Ánimo muy alto o muy irritable, casi sin dormir, decisiones arriesgadas.' },
  1: { nombre: 'Hipomanía', c: L.C.ene, signo: '+1', exp: 'Más energía e ideas de lo habitual, menos sueño, más hablador o irritable.' },
  0: { nombre: 'Estable', c: L.C.cal, signo: '0', exp: 'Ánimo estable, ni acelerado ni hundido: tu día normal.' },
  '-1': { nombre: 'Hipotimia', c: L.C.baj, signo: '−1', exp: 'Ánimo bajo, menos ganas y energía, pero sigues con tu día.' },
  '-2': { nombre: 'Depresión', c: L.C.ind, signo: '−2', exp: 'Ánimo muy bajo casi todo el día, sin interés; cuesta hacer lo básico.' }
};
L.SINTOMAS = ['Irritable', 'Con ansiedad', 'Pensamiento rápido', 'Gasto de más', 'Sin ganas de ver a nadie', 'Mucha energía'];
L.AVISO_ESCALA = 'Estas palabras sirven para apuntar, no para diagnosticar. Eso es cosa de tu profesional.';

/* ============================== RECURSOS ============================== */
L.CATS = [
  { id: 'respirar', nombre: 'Respirar', c: L.C.baj },
  { id: 'cuerpo', nombre: 'Volver al cuerpo', c: L.C.ver },
  { id: 'pensamiento', nombre: 'Mirar el pensamiento', c: L.C.lil },
  { id: 'moverse', nombre: 'Moverse', c: L.C.ale },
  { id: 'hablar', nombre: 'Hablar con alguien', c: L.C.ene },
  { id: 'frases', nombre: 'Frases que ayudan', c: L.C.cal }
];
L.RECURSOS = {
  'respirar-despacio': { cat: 'respirar', nombre: 'Respirar despacio', sub: 'Un minuto · inspira en 4, suelta en 6', tipo: 'respirar', fases: [['Inspira', 4], ['Suelta', 6]], dur: 60 },
  'respirar-cuadrada': { cat: 'respirar', nombre: 'Respiración cuadrada', sub: 'Un minuto · 4, 4, 4 y 4', tipo: 'respirar', fases: [['Inspira', 4], ['Aguanta', 4], ['Suelta', 4], ['Aguanta', 4]], dur: 64 },
  'respirar-larga': { cat: 'respirar', nombre: 'Soltar más largo', sub: 'Un minuto · inspira en 4, suelta en 8', tipo: 'respirar', fases: [['Inspira', 4], ['Suelta', 8]], dur: 60 },
  'respirar-suspiro': { cat: 'respirar', nombre: 'El suspiro doble', sub: 'Medio minuto · dos tomas de aire y una salida larga', tipo: 'respirar', fases: [['Inspira', 2], ['Un poco más', 1], ['Suelta', 6]], dur: 36 },
  'respirar-tres': { cat: 'respirar', nombre: 'Tres minutos para ti', sub: 'Tres minutos · inspira en 4, suelta en 6', tipo: 'respirar', fases: [['Inspira', 4], ['Suelta', 6]], dur: 180 },
  'cinco-sentidos': {
    cat: 'cuerpo', nombre: 'Los cinco sentidos', sub: 'Tres minutos · volver al presente', tipo: 'pasos', pasos: [
      { t: 'Cinco cosas que ves', s: 'Míralas despacio, una a una.', n: 5 }, { t: 'Cuatro cosas que puedas tocar', s: 'Tócalas de verdad y fíjate en cómo son.', n: 4 },
      { t: 'Tres cosas que oyes', s: 'Las que están cerca y las que están lejos.', n: 3 }, { t: 'Dos cosas que hueles', s: 'Si no hueles nada, recuerda dos olores que te gustan.', n: 2 },
      { t: 'Una cosa que saboreas', s: 'Aunque sea el sabor de tu boca ahora.', n: 1 }]
  },
  'recorrer-cuerpo': {
    cat: 'cuerpo', nombre: 'Recorrer el cuerpo', sub: 'Cuatro minutos · de los pies a la cabeza', tipo: 'pasos', pasos: [
      { t: 'Los pies', s: 'Nota el suelo debajo. El peso, la temperatura, los dedos.' }, { t: 'Las piernas', s: 'Fíjate si hay tensión. No hace falta cambiar nada.' },
      { t: 'La tripa y el pecho', s: 'Mira cómo suben y bajan con el aire.' }, { t: 'Los hombros', s: 'Súbelos un poco y déjalos caer.' },
      { t: 'La cara', s: 'Afloja la mandíbula y la frente.' }]
  },
  'apretar-soltar': {
    cat: 'cuerpo', nombre: 'Apretar y soltar', sub: 'Dos minutos · para la tensión del cuerpo', tipo: 'pasos', pasos: [
      { t: 'Cierra los puños', s: 'Aprieta cinco segundos. Suelta y nota la diferencia.' }, { t: 'Sube los hombros', s: 'Hacia las orejas, cinco segundos. Déjalos caer.' },
      { t: 'Aprieta la cara', s: 'Ojos y boca, cinco segundos. Suelta.' }, { t: 'Estira las piernas', s: 'Tensa, cinco segundos, y suelta.' }]
  },
  'agua-fria': {
    cat: 'cuerpo', nombre: 'Agua fresca', sub: 'Un minuto · para bajar el ritmo', tipo: 'pasos', pasos: [
      { t: 'Ve al grifo', s: 'Moja las manos y las muñecas con agua fresca.' }, { t: 'Lávate la cara', s: 'Despacio. Nota el cambio de temperatura.' },
      { t: 'Respira tres veces', s: 'Con la cara aún húmeda, más lento que antes.' }]
  },
  'mirar-pensamiento': { cat: 'pensamiento', nombre: 'Mirar el pensamiento', sub: 'Cinco minutos · ¿qué me estoy diciendo?', tipo: 'pensamiento' },
  'amigo': {
    cat: 'pensamiento', nombre: 'Qué le dirías a un amigo', sub: 'Tres minutos · cambiar de sitio', tipo: 'pasos', pasos: [
      { t: '¿Qué te está pasando?', s: 'Escríbelo en una frase.', n: 1 }, { t: 'Si le pasara a un amigo', s: '¿Qué le dirías tú? Escríbelo como se lo dirías.', n: 1 },
      { t: 'Ahora, para ti', s: 'Léelo otra vez, pero dirigido a ti.' }]
  },
  'hechos': {
    cat: 'pensamiento', nombre: 'Hechos e ideas', sub: 'Cuatro minutos · separar lo que pasó de lo que piensas', tipo: 'pasos', pasos: [
      { t: 'Lo que ha pasado', s: 'Solo lo que vería una cámara.', n: 2 }, { t: 'Lo que pienso de ello', s: 'Las ideas que te vienen.', n: 2 },
      { t: 'Otra explicación posible', s: 'No tiene que ser la buena, solo posible.', n: 1 }]
  },
  'preocupacion': {
    cat: 'pensamiento', nombre: 'Un rato para preocuparse', sub: 'Diez minutos · y luego se cierra', tipo: 'pasos', pasos: [
      { t: 'Escribe lo que te preocupa', s: 'Todo, sin ordenar.', n: 3 }, { t: '¿Qué depende de ti?', s: 'Marca una cosa que sí puedes hacer.', n: 1 },
      { t: 'Ciérralo', s: 'Lo has apuntado. Puedes volver mañana a la misma hora.' }]
  },
  'trampas': { cat: 'pensamiento', nombre: 'Las trampas del pensamiento', sub: 'Dos minutos · conocerlas para verlas', tipo: 'lista', items: [] },
  'compasion': {
    cat: 'pensamiento', nombre: 'Hablarte con cariño', sub: 'Dos minutos · en vez de exigirte', tipo: 'pasos', pasos: [
      { t: 'Esto es difícil', s: 'Dilo así, sin adornos. Reconocerlo ya ayuda.' }, { t: 'No eres el único', s: 'Mucha gente se siente así a veces.' },
      { t: '¿Qué necesitas ahora?', s: 'Escríbelo como se lo dirías a alguien que quieres.', n: 1 }]
  },
  'paseo': { cat: 'moverse', nombre: 'Un paseo corto', sub: 'Cinco minutos · a la calle o por casa', tipo: 'hecho', texto: 'Sal a caminar cinco minutos. Sin móvil si puedes. Fíjate en tres cosas del camino.' },
  'estirar': { cat: 'moverse', nombre: 'Estirarte', sub: 'Dos minutos · cuello, espalda y brazos', tipo: 'hecho', texto: 'Brazos arriba, inclínate a un lado y al otro. Gira el cuello despacio. Toca las puntas de los pies sin forzar.' },
  'escaleras': { cat: 'moverse', nombre: 'Subir y bajar escaleras', sub: 'Tres minutos · para gastar la energía de más', tipo: 'hecho', texto: 'Sube y baja un tramo de escaleras tres veces, a tu ritmo.' },
  'bailar': { cat: 'moverse', nombre: 'Una canción', sub: 'Tres minutos · muévete como quieras', tipo: 'hecho', texto: 'Pon una canción que te guste y muévete, aunque sea poco.' },
  'sacudir': { cat: 'moverse', nombre: 'Sacudir el cuerpo', sub: 'Un minuto · manos, brazos y piernas', tipo: 'hecho', texto: 'Sacude las manos, luego los brazos, luego cada pierna. Termina con tres respiraciones.' },
  'hablar': { cat: 'hablar', nombre: 'Hablar con alguien', sub: 'Tus personas de confianza', tipo: 'hablar' },
  'frases': { cat: 'frases', nombre: 'Frases que ayudan', sub: 'Las tuyas y otras', tipo: 'frases' }
};
L.TRAMPAS = [
  ['Adivinar el futuro', 'Das por hecho que algo va a salir mal antes de que pase.'],
  ['Leer la mente', 'Das por hecho lo que piensan los demás sin tener pruebas.'],
  ['Todo o nada', 'Si no es perfecto, es un desastre. No ves los grises.'],
  ['Catastrofizar', 'Imaginas lo peor y lo tratas como si fuera seguro.'],
  ['Ponerte etiquetas', 'Pasas de «me he equivocado» a «soy un desastre».'],
  ['Culparte de todo', 'Cargas con lo que no depende solo de ti.']
];
L.FRASES = [
  'Esto que siento es intenso, pero pasará.', 'No tengo que resolverlo todo hoy.', 'Puedo ir paso a paso.',
  'Sentirme así no dice nada malo de mí.', 'He salido de días difíciles otras veces.', 'Ahora mismo, solo esta respiración.',
  'Puedo pedir ayuda. No es un fallo.', 'Hago lo que puedo con lo que tengo hoy.', 'Los pensamientos no son hechos.',
  'Me trato como trataría a alguien que quiero.'
];
L.CUIDAR = ['Mi descanso', 'Mi paciencia', 'Moverme', 'Estar con alguien', 'Ir más despacio', 'Comer bien'];
L.CUMPLIDO = ['Lo he conseguido', 'A ratos', 'Hoy no'];
L.CON = ['Pareja', 'Familia', 'Amistades', 'A solas'];
