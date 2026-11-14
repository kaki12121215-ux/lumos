/* Lumos 1.2.0 · contenidos: palabras, niveles del ánimo, recursos */
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
/* Niveles, síntomas, recursos, trampas y frases: en contenidos.js */
