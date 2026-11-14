/* Lumos 1.2.0 · contenidos: niveles, síntomas, recursos, trampas, frases y plan */
'use strict';
/* ============================== ESCALA DEL ÁNIMO ============================== */
L.NIV = {
  2: { nombre: 'Muy arriba', clinico: 'Manía', c: L.C.ten, signo: '+2', exp: 'Ánimo muy alto o muy irritable, casi sin dormir, decisiones arriesgadas.' },
  1: { nombre: 'Arriba', clinico: 'Hipomanía', c: L.C.ene, signo: '+1', exp: 'Más energía e ideas de lo habitual, menos sueño, más hablador o irritable.' },
  0: { nombre: 'Estable', clinico: '', c: L.C.cal, signo: '0', exp: 'Ánimo estable, ni acelerado ni hundido: tu día normal.' },
  '-1': { nombre: 'Abajo', clinico: 'Hipotimia', c: L.C.baj, signo: '−1', exp: 'Ánimo bajo, menos ganas y energía, pero sigues con tu día.' },
  '-2': { nombre: 'Muy abajo', clinico: 'Depresión', c: L.C.ind, signo: '−2', exp: 'Ánimo muy bajo casi todo el día, sin interés; cuesta hacer lo básico.' }
};
L.nivelConClinico = n => L.NIV[n].nombre + (L.NIV[n].clinico ? ` (${L.NIV[n].clinico.toLowerCase()})` : '');
/* síntomas propuestos para cada nivel */
L.SINT_NIV = {
  2: ['Casi no duermo y no me canso', 'Pensamiento rápido', 'Hablo sin parar', 'Me siento invencible', 'Gasto de más', 'Decisiones arriesgadas', 'Irritable', 'No puedo estarme quieto', 'Empiezo mil cosas a la vez', 'Me distraigo con todo', 'Mucha energía', 'Siento que tengo una misión especial', 'Más deseo sexual', 'Conduzco o hago cosas peligrosas', 'Otros me dicen que estoy raro'],
  1: ['Duermo menos y no me canso', 'Mucha energía', 'Pensamiento rápido', 'Más hablador', 'Más sociable', 'Muchas ideas y planes', 'Me distraigo', 'Irritable', 'Gasto de más', 'Más seguro de mí', 'Más productivo', 'Impaciente', 'Me cuesta concentrarme', 'Inquieto', 'Más café o alcohol'],
  0: ['Duermo bien', 'Rutina normal', 'Me concentro bien', 'Con ganas normales', 'Algo de ansiedad', 'Algo cansado', 'Un poco irritable', 'Estrés del día a día', 'He hecho ejercicio', 'He estado con gente'],
  '-1': ['Menos ganas', 'Cansancio', 'Me cuesta arrancar', 'Me cuesta concentrarme', 'Duermo de más', 'Duermo mal', 'Más sensible', 'Con ansiedad', 'Sin ganas de ver a nadie', 'Como más o menos de lo normal', 'Me critico más', 'Todo me cuesta más', 'Pensamiento lento', 'Irritable', 'Le doy vueltas a todo'],
  '-2': ['Sin ganas de nada', 'Me cuesta levantarme', 'No disfruto nada', 'Me siento sin valor', 'Mucha culpa', 'Muy cansado', 'Pensamiento muy lento', 'No puedo concentrarme', 'Lloro mucho', 'Me aíslo', 'Duermo muchísimo', 'Casi no duermo', 'No como o como de más', 'Me cuesta hacer lo básico', 'Sin ganas de ver a nadie', 'Con ansiedad', 'Pienso en la muerte']
};
L.SINTOMAS = [...new Set(Object.values(L.SINT_NIV).flat())];
L.SINT_CUIDADO = 'Pienso en la muerte';
L.AVISO_ESCALA = 'Estas palabras sirven para apuntar, no para diagnosticar. Eso es cosa de tu profesional.';

/* ============================== IDEAS PARA EL PLAN ============================== */
/* Basadas en las señales tempranas más citadas en los estudios sobre recaídas (sueño, energía,
   habla, pensamiento rápido, irritabilidad, gasto; cansancio, aislamiento, pérdida de interés, culpa…) */
L.IDEAS_PLAN = {
  arriba: ['Necesito dormir menos y no me canso', 'Me acuesto cada vez más tarde', 'Hablo más deprisa y más rato', 'Las ideas van muy rápido', 'Empiezo muchos proyectos a la vez', 'Me siento más seguro de mí que nunca', 'Me irrito con facilidad', 'Me cuesta concentrarme', 'Estoy inquieto, no paro', 'Gasto más dinero', 'Hago planes muy grandes', 'Más deseo sexual de lo habitual', 'Escribo a todo el mundo', 'Pongo la música muy alta', 'Tomo más café o alcohol', 'Me visto distinto, más llamativo', 'Tomo decisiones sin pensar', 'Me noto especial o con una misión', 'Otros me dicen que estoy acelerado', 'Me cuesta escuchar a los demás'],
  abajo: ['Me noto sin energía, muy cansado', 'Me cuesta levantarme', 'Duermo mucho más', 'Duermo mal o me despierto muy pronto', 'Pierdo interés por lo que me gusta', 'Dejo de contestar mensajes', 'Me aíslo y cancelo planes', 'Me cuesta concentrarme', 'Le doy muchas vueltas a todo', 'Me siento culpable', 'Me critico más', 'Como mucho menos o mucho más', 'Estoy más ansioso o inquieto', 'Me irrito con facilidad', 'Lloro con más facilidad', 'Descuido la ducha o la ropa', 'Todo me cuesta el doble', 'Veo el futuro negro', 'Rindo menos en el trabajo', 'Solo me apetece estar en la cama'],
  mal: ['Ver mucho la tele', 'Redes sociales todo el rato', 'Dormir de más', 'Acostarme tarde', 'Saltarme comidas', 'Comer mal', 'Alcohol', 'Mucho café', 'Quedarme en la cama', 'Aislarme', 'Pantallas antes de dormir', 'Discutir por mensajes', 'Leer noticias sin parar', 'Comprar por internet de noche', 'Llenar la agenda', 'Compararme con otros', 'No salir de casa', 'Saltarme la medicación'],
  hago: ['Aviso a una persona de confianza', 'Pido cita con mi psiquiatra o psicóloga', 'Mantengo mi hora de acostarme y levantarme', 'Tomo la medicación como está pautada', 'Reduzco planes y estímulos', 'Dejo las decisiones grandes para más adelante', 'Dejo la tarjeta en casa', 'Evito alcohol y café', 'Salgo a caminar cada día, aunque sea poco', 'Como a mis horas', 'Apunto mi escala cada día', 'Pido ayuda con las tareas', 'Me doy permiso para bajar el ritmo', 'Hago una cosa pequeña cada día', 'Llamo al 024 si me desbordo']
};
L.SECCIONES_PLAN = [['arriba', 'Señales de que voy hacia arriba', 'Escribe otra señal'], ['abajo', 'Señales de que voy hacia abajo', 'Escribe otra señal'], ['mal', 'Lo que me hace mal o no me ayuda', 'Escribe otra cosa'], ['hago', 'Lo que hago cuando las veo', 'Escribe otra cosa']];

/* ============================== RECURSOS ============================== */
L.CATS = [
  { id: 'respirar', nombre: 'Respirar', c: L.C.baj, sub: 'Respirar más despacio le dice al cuerpo que puede bajar el ritmo.' },
  { id: 'cuerpo', nombre: 'Volver al cuerpo', c: L.C.ver, sub: 'Cuando la cabeza va muy rápido, el cuerpo te trae al presente.' },
  { id: 'pensamiento', nombre: 'Mirar el pensamiento', c: L.C.lil, sub: 'Mirar lo que te dices, sin creértelo del todo.' },
  { id: 'moverse', nombre: 'Moverse', c: L.C.ale, sub: 'Mover el cuerpo un poco cambia cómo te sientes. Si cuesta mucho, empieza por lo más pequeño.' },
  { id: 'subida', nombre: 'Bajar revoluciones', c: L.C.ten, sub: 'Para los días en que vas por arriba: menos estímulos, más calma y nada de decisiones grandes.' },
  { id: 'dormir', nombre: 'Para dormir', c: L.C.ind, sub: 'El sueño es lo primero que se mueve y lo que más protege. Pequeñas cosas cada noche.' },
  { id: 'hablar', nombre: 'Hablar con alguien', c: L.C.ene },
  { id: 'frases', nombre: 'Frases que ayudan', c: L.C.cal }
];
const R_ = (cat, nombre, sub, tipo, extra = {}) => ({ cat, nombre, sub, tipo, ...extra });
const P_ = (...pasos) => pasos.map(([t, s, n]) => ({ t, s, n }));
L.RECURSOS = {
  /* ---- respirar ---- */
  'respirar-despacio': R_('respirar', 'Respirar despacio', 'Un minuto, inspira en 4 y suelta en 6', 'respirar', { fases: [['Inspira', 4], ['Suelta', 6]], dur: 60 }),
  'respirar-cuadrada': R_('respirar', 'Respiración cuadrada', 'Un minuto, 4, 4, 4 y 4', 'respirar', { fases: [['Inspira', 4], ['Aguanta', 4], ['Suelta', 4], ['Aguanta', 4]], dur: 64 }),
  'respirar-larga': R_('respirar', 'Soltar más largo', 'Un minuto, inspira en 4 y suelta en 8', 'respirar', { fases: [['Inspira', 4], ['Suelta', 8]], dur: 60 }),
  'respirar-478': R_('respirar', 'Cuatro, siete, ocho', 'Un minuto y algo, para soltar tensión', 'respirar', { fases: [['Inspira', 4], ['Aguanta', 7], ['Suelta', 8]], dur: 76 }),
  'respirar-ola': R_('respirar', 'Como una ola', 'Dos minutos, cinco y cinco, sin pausas', 'respirar', { fases: [['Inspira', 5], ['Suelta', 5]], dur: 120 }),
  'respirar-suspiro': R_('respirar', 'El suspiro doble', 'Medio minuto, dos tomas de aire y una salida larga', 'respirar', { fases: [['Inspira', 2], ['Un poco más', 1], ['Suelta', 6]], dur: 36 }),
  'respirar-tres': R_('respirar', 'Tres minutos para ti', 'Tres minutos, inspira en 4 y suelta en 6', 'respirar', { fases: [['Inspira', 4], ['Suelta', 6]], dur: 180 }),
  'respirar-tripa': R_('respirar', 'Respirar con la tripa', 'Dos minutos, una mano en el pecho y otra en la tripa', 'pasos', { pasos: P_(['Las manos', 'Pon una mano en el pecho y otra en la tripa.'], ['Que suba la tripa', 'Al coger aire, que se mueva sobre todo la mano de la tripa.'], ['Suelta despacio', 'Deja salir el aire por la boca, como si soplaras una vela sin apagarla.'], ['Diez veces', 'Repite diez respiraciones así, sin prisa.']) }),
  'respirar-contar': R_('respirar', 'Contar respiraciones', 'Dos minutos, del uno al diez', 'pasos', { pasos: P_(['Cuenta al soltar', 'Cada vez que sueltes el aire, cuenta un número: uno, dos, tres…'], ['Hasta diez', 'Al llegar a diez, vuelve a empezar.'], ['Si te pierdes', 'No pasa nada. Vuelve al uno sin juzgarte. Perderse es parte del ejercicio.']) }),
  'respirar-mano': R_('respirar', 'Los cinco dedos', 'Un minuto, recorriendo tu mano', 'pasos', { pasos: P_(['Abre una mano', 'Con el índice de la otra, vas a recorrer el contorno de los dedos.'], ['Sube y baja', 'Al subir por un dedo, coge aire. Al bajar, suéltalo.'], ['Los cinco', 'Recorre los cinco dedos y vuelve, despacio.']) }),
  /* ---- volver al cuerpo ---- */
  'cinco-sentidos': R_('cuerpo', 'Los cinco sentidos', 'Tres minutos para volver al presente', 'pasos', { pasos: P_(['Cinco cosas que ves', 'Míralas despacio, una a una.', 5], ['Cuatro cosas que puedas tocar', 'Tócalas de verdad y fíjate en cómo son.', 4], ['Tres cosas que oyes', 'Las que están cerca y las que están lejos.', 3], ['Dos cosas que hueles', 'Si no hueles nada, recuerda dos olores que te gustan.', 2], ['Una cosa que saboreas', 'Aunque sea el sabor de tu boca ahora.', 1]) }),
  'pies-suelo': R_('cuerpo', 'Los pies en el suelo', 'Un minuto, notar dónde estás', 'pasos', { pasos: P_(['Apoya los pies', 'Siéntate y apoya bien los dos pies en el suelo.'], ['Empuja un poco', 'Empuja el suelo con los pies cinco segundos y suelta.'], ['Nota el apoyo', 'Nota la silla en la espalda y el suelo debajo. Estás aquí.']) }),
  'recorrer-cuerpo': R_('cuerpo', 'Recorrer el cuerpo', 'Cuatro minutos, de los pies a la cabeza', 'pasos', { pasos: P_(['Los pies', 'Nota el suelo debajo. El peso, la temperatura, los dedos.'], ['Las piernas', 'Fíjate si hay tensión. No hace falta cambiar nada.'], ['La tripa y el pecho', 'Mira cómo suben y bajan con el aire.'], ['Los hombros', 'Súbelos un poco y déjalos caer.'], ['La cara', 'Afloja la mandíbula y la frente.']) }),
  'apretar-soltar': R_('cuerpo', 'Apretar y soltar', 'Dos minutos para la tensión del cuerpo', 'pasos', { pasos: P_(['Cierra los puños', 'Aprieta cinco segundos. Suelta y nota la diferencia.'], ['Sube los hombros', 'Hacia las orejas, cinco segundos. Déjalos caer.'], ['Aprieta la cara', 'Ojos y boca, cinco segundos. Suelta.'], ['Estira las piernas', 'Tensa, cinco segundos, y suelta.']) }),
  'mariposa': R_('cuerpo', 'El abrazo de mariposa', 'Dos minutos, para calmarte tú solo', 'pasos', { pasos: P_(['Cruza los brazos', 'Cruza los brazos sobre el pecho, con las manos en los hombros.'], ['Toques lentos', 'Da golpecitos suaves alternando una mano y otra, como un aleteo.'], ['Respira', 'Sigue un minuto mientras respiras despacio. Puedes cerrar los ojos.']) }),
  'agua-fria': R_('cuerpo', 'Agua fresca', 'Un minuto para bajar el ritmo', 'pasos', { pasos: P_(['Ve al grifo', 'Moja las manos y las muñecas con agua fresca.'], ['Lávate la cara', 'Despacio. Nota el cambio de temperatura.'], ['Respira tres veces', 'Con la cara aún húmeda, más lento que antes.']) }),
  'objeto': R_('cuerpo', 'Un objeto en la mano', 'Dos minutos, mirar como si fuera la primera vez', 'pasos', { pasos: P_(['Coge algo', 'Lo que tengas cerca: unas llaves, una taza, una piedra.'], ['Descríbelo', 'Su peso, su temperatura, su textura, sus colores.', 3], ['Quédate ahí', 'Si la cabeza se va, vuelve al objeto.']) }),
  'sonidos': R_('cuerpo', 'Tres capas de sonido', 'Dos minutos, escuchar lejos y cerca', 'pasos', { pasos: P_(['Lo más lejano', 'Escucha el sonido más lejano que puedas oír.'], ['Lo de en medio', 'Ahora algo más cerca: la casa, la calle.'], ['Lo más cercano', 'Tu respiración, la ropa al moverte.']) }),
  'manos-calor': R_('cuerpo', 'Manos calientes', 'Un minuto, calor en la cara', 'pasos', { pasos: P_(['Frota las manos', 'Frótalas fuerte unos segundos, hasta que se calienten.'], ['A la cara', 'Ponlas sobre los ojos cerrados y nota el calor.'], ['Otra vez', 'Repite dos o tres veces.']) }),
  'automasaje': R_('cuerpo', 'Masaje en hombros y manos', 'Tres minutos para soltar', 'pasos', { pasos: P_(['Hombros', 'Aprieta con la mano contraria el hombro, con círculos lentos.'], ['Cuello', 'Baja la cabeza un poco y masajea la nuca.'], ['Manos', 'Presiona la palma de una mano con el pulgar de la otra.']) }),
  'temperatura': R_('cuerpo', 'Frío o calor', 'Un minuto, algo que se note', 'hecho', { texto: 'Sostén algo frío (un hielo envuelto, una lata) o algo caliente (una taza). Fíjate solo en lo que notas en las manos durante un minuto.' }),
  'peso': R_('cuerpo', 'Algo de peso encima', 'Cinco minutos, mantita o cojín', 'hecho', { texto: 'Túmbate o siéntate con una manta gruesa, un cojín o una bolsa de agua tibia encima del pecho o las piernas. El peso suave ayuda a que el cuerpo se calme.' }),
  'mirar-lejos': R_('cuerpo', 'Mirar lejos', 'Un minuto en la ventana', 'hecho', { texto: 'Asómate a una ventana y mira lo más lejos que puedas: un edificio, el cielo, un árbol. Deja los ojos ahí un minuto, sin pantalla.' }),
  'tumbarse': R_('cuerpo', 'Tumbarte tres minutos', 'Descanso de verdad, sin móvil', 'hecho', { texto: 'Túmbate boca arriba, brazos a los lados. Tres minutos sin hacer nada más que notar cómo apoya el cuerpo. Si te ayuda, pon una alarma.' }),
  /* ---- mirar el pensamiento ---- */
  'mirar-pensamiento': R_('pensamiento', 'Mirar el pensamiento', 'Cinco minutos: ¿qué me estoy diciendo?', 'pensamiento'),
  'amigo': R_('pensamiento', 'Qué le dirías a un amigo', 'Tres minutos para cambiar de sitio', 'pasos', { pasos: P_(['¿Qué te está pasando?', 'Escríbelo en una frase.', 1], ['Si le pasara a un amigo', '¿Qué le dirías tú? Escríbelo como se lo dirías.', 1], ['Ahora, para ti', 'Léelo otra vez, pero dirigido a ti.']) }),
  'hechos': R_('pensamiento', 'Hechos e ideas', 'Cuatro minutos para separar lo que pasó de lo que piensas', 'pasos', { pasos: P_(['Lo que ha pasado', 'Solo lo que vería una cámara.', 2], ['Lo que pienso de ello', 'Las ideas que te vienen.', 2], ['Otra explicación posible', 'No tiene que ser la buena, solo posible.', 1]) }),
  'peor-mejor': R_('pensamiento', 'Lo peor, lo mejor y lo más probable', 'Tres minutos para bajar el volumen a la catástrofe', 'pasos', { pasos: P_(['Lo peor que podría pasar', 'Escríbelo sin miedo. Ponerlo fuera le quita fuerza.', 1], ['Lo mejor que podría pasar', 'Igual de exagerado, pero hacia el otro lado.', 1], ['Lo más probable', 'Seguramente esté en medio. ¿Qué es lo más probable?', 1], ['Si pasara lo peor', '¿Qué harías? ¿A quién pedirías ayuda?', 1]) }),
  'pruebas': R_('pensamiento', 'Pruebas a favor y en contra', 'Cuatro minutos, como un juez', 'pasos', { pasos: P_(['El pensamiento', 'Escribe la idea que te pesa.', 1], ['Pruebas a favor', 'Hechos que lo apoyan, no sensaciones.', 2], ['Pruebas en contra', 'Hechos que no encajan con esa idea.', 2], ['Una idea más justa', 'Con todo eso, ¿cómo lo dirías de forma más justa?', 1]) }),
  'cinco-anos': R_('pensamiento', '¿Importará dentro de un año?', 'Dos minutos para ver las cosas de lejos', 'pasos', { pasos: P_(['Lo que te preocupa', 'Escríbelo.', 1], ['Dentro de una semana', '¿Cuánto te importará? ¿Y dentro de un año?'], ['Lo que sí importa', 'Si hay algo que importa de verdad, ¿qué pequeño paso puedes dar?', 1]) }),
  'nombrar': R_('pensamiento', 'Ponerle nombre', 'Un minuto: nombrarlo lo calma', 'pasos', { pasos: P_(['¿Qué sientes?', 'Ponle una palabra, o dos. Puedes usar el campo de emociones.', 1], ['¿Dónde lo notas?', 'En qué parte del cuerpo.', 1], ['Dilo así', '«Estoy notando…». No eres la emoción: la estás notando.']) }),
  'problema': R_('pensamiento', 'Resolver un problema paso a paso', 'Cinco minutos para salir del bucle', 'pasos', { pasos: P_(['El problema', 'En una frase concreta.', 1], ['Tres opciones', 'Sin juzgarlas todavía, aunque parezcan raras.', 3], ['La menos mala', 'Elige una. No hace falta que sea perfecta.', 1], ['El primer paso', '¿Qué es lo más pequeño que puedes hacer hoy?', 1]) }),
  'controlo': R_('pensamiento', 'Lo que depende de mí', 'Tres minutos, dos columnas', 'pasos', { pasos: P_(['Lo que no depende de ti', 'Escríbelo para poder soltarlo.', 2], ['Lo que sí depende de ti', 'Aunque sea poco.', 2], ['Una cosa', 'Elige una de lo que sí depende de ti y hazla hoy.']) }),
  'hojas-rio': R_('pensamiento', 'Hojas en el río', 'Tres minutos para dejar pasar pensamientos', 'pasos', { pasos: P_(['Imagina un río', 'Con hojas que bajan despacio por el agua.'], ['Pon cada pensamiento en una hoja', 'Cuando llegue un pensamiento, colócalo en una hoja y deja que se lo lleve el río.'], ['Sin pelearte', 'No hace falta que se vayan rápido. Solo míralos pasar.']) }),
  'estoy-pensando': R_('pensamiento', '«Estoy teniendo el pensamiento de que…»', 'Un minuto para tomar distancia', 'pasos', { pasos: P_(['El pensamiento', 'Escríbelo tal cual, por ejemplo: «soy un desastre».', 1], ['Añade delante', '«Estoy teniendo el pensamiento de que soy un desastre». Léelo despacio.'], ['Nota la diferencia', 'Sigue siendo un pensamiento, pero ya no eres tú hablando.']) }),
  'escribir-cinco': R_('pensamiento', 'Escribir cinco minutos', 'Sin parar y sin corregir', 'pasos', { pasos: P_(['Escribe sin parar', 'Todo lo que te pasa por la cabeza, aunque no tenga sentido.', 1], ['Léelo', '¿Hay algo que se repite? ¿Algo que necesitas?', 1]) }),
  'preocupacion': R_('pensamiento', 'Un rato para preocuparse', 'Diez minutos, y luego se cierra', 'pasos', { pasos: P_(['Escribe lo que te preocupa', 'Todo, sin ordenar.', 3], ['¿Qué depende de ti?', 'Marca una cosa que sí puedes hacer.', 1], ['Ciérralo', 'Lo has apuntado. Puedes volver mañana a la misma hora.']) }),
  'compasion': R_('pensamiento', 'Hablarte con cariño', 'Dos minutos, en vez de exigirte', 'pasos', { pasos: P_(['Esto es difícil', 'Dilo así, sin adornos. Reconocerlo ya ayuda.'], ['No eres el único', 'Mucha gente se siente así a veces.'], ['¿Qué necesitas ahora?', 'Escríbelo como se lo dirías a alguien que quieres.', 1]) }),
  'algo-agradable': R_('pensamiento', 'Planear algo pequeño y agradable', 'Dos minutos, para tener algo esperando', 'pasos', { pasos: P_(['Algo que te guste', 'Pequeño: un café fuera, una serie, una llamada, un baño.', 1], ['Cuándo', 'Ponle día y hora.', 1], ['Quedártelo', 'Ya tienes algo esperando. No hace falta más.']) }),
  'vaciar': R_('pensamiento', 'Vaciar la cabeza', 'Antes de dormir, a una caja hasta mañana', 'vaciar'),
  /* ---- moverse ---- */
  'zapatillas': R_('moverse', 'Solo ponerte las zapatillas', 'Para los días que cuesta todo', 'hecho', { texto: 'No hace falta salir. Solo ponte las zapatillas y quédate un minuto de pie. Si te apetece, da una vuelta por casa. Si no, ya has hecho algo.' }),
  'paseo': R_('moverse', 'Un paseo corto', 'Cinco minutos, a la calle o por casa', 'hecho', { texto: 'Sal a caminar cinco minutos. Sin móvil si puedes. Fíjate en tres cosas del camino.' }),
  'sol': R_('moverse', 'Luz del día', 'Diez minutos fuera, mejor por la mañana', 'hecho', { texto: 'Sal a la calle o a la ventana diez minutos con luz natural, mejor por la mañana. La luz del día ayuda a ordenar el sueño y el ánimo.' }),
  'paseo-fotos': R_('moverse', 'Paseo de tres fotos', 'Quince minutos buscando algo bonito', 'hecho', { texto: 'Sal a caminar con una misión: hacer tres fotos de cosas que te parezcan bonitas o curiosas. Una sombra, un color, una puerta.' }),
  'caminar-atento': R_('moverse', 'Caminar despacio', 'Cinco minutos notando cada paso', 'pasos', { pasos: P_(['Más despacio de lo normal', 'Camina por casa o por la calle a la mitad de tu ritmo.'], ['Los pies', 'Nota cómo apoya el talón, luego la planta, luego los dedos.'], ['Respira con los pasos', 'Tres pasos cogiendo aire, tres soltándolo.']) }),
  'estirar': R_('moverse', 'Estirarte', 'Dos minutos: cuello, espalda y brazos', 'pasos', { pasos: P_(['Brazos arriba', 'Estírate hacia el techo como al despertar.'], ['A los lados', 'Inclínate a un lado y al otro, despacio.'], ['El cuello', 'Gira la cabeza en círculos lentos, hacia los dos lados.'], ['Hacia los pies', 'Baja hacia los pies sin forzar y sube vértebra a vértebra.']) }),
  'yoga': R_('moverse', 'Yoga suave', 'Cinco minutos, tres posturas', 'pasos', { pasos: P_(['Gato y vaca', 'A cuatro patas: arquea la espalda hacia arriba y luego hacia abajo, con la respiración. Seis veces.'], ['Postura del niño', 'Siéntate sobre los talones y baja el pecho hacia el suelo, brazos delante. Un minuto.'], ['Piernas en la pared', 'Túmbate y apoya las piernas en la pared. Dos minutos.']) }),
  'circuito': R_('moverse', 'Siete minutos de movimiento', 'Un circuito suave en casa', 'pasos', { pasos: P_(['Marcha en el sitio', 'Un minuto, subiendo un poco las rodillas.'], ['Sentadillas suaves', 'Diez, hasta donde te sea cómodo. Puedes usar una silla.'], ['Flexiones en la pared', 'Diez, con las manos en la pared.'], ['Puntillas', 'Sube y baja de puntillas veinte veces.'], ['Estira', 'Termina estirando brazos y piernas un minuto.']) }),
  'escaleras': R_('moverse', 'Subir y bajar escaleras', 'Tres minutos para gastar la energía de más', 'hecho', { texto: 'Sube y baja un tramo de escaleras tres veces, a tu ritmo.' }),
  'bailar': R_('moverse', 'Una canción', 'Tres minutos, muévete como quieras', 'hecho', { texto: 'Pon una canción que te guste y muévete, aunque sea poco. Nadie mira.' }),
  'sacudir': R_('moverse', 'Sacudir el cuerpo', 'Un minuto: manos, brazos y piernas', 'hecho', { texto: 'Sacude las manos, luego los brazos, luego cada pierna. Termina con tres respiraciones.' }),
  'ordenar': R_('moverse', 'Ordenar una cosa', 'Diez minutos, solo un cajón o una mesa', 'hecho', { texto: 'Elige un sitio pequeño: un cajón, la mesilla, el fregadero. Ordénalo solo a él. Terminar algo pequeño ayuda más de lo que parece.' }),
  'cocinar': R_('moverse', 'Cocinar algo sencillo', 'Quince minutos con las manos ocupadas', 'hecho', { texto: 'Prepara algo fácil: una tostada bien hecha, una fruta cortada, una sopa. Fíjate en los olores y los colores mientras lo haces.' }),
  'plantas': R_('moverse', 'Cuidar las plantas', 'Cinco minutos de algo vivo', 'hecho', { texto: 'Riega las plantas, quita las hojas secas o cambia una de sitio. Si no tienes, mira un árbol de cerca en la calle.' }),
  'bici': R_('moverse', 'Bici, nadar o correr suave', 'Veinte minutos, si tienes fuerzas', 'hecho', { texto: 'Si hoy tienes energía, un rato de bici, piscina o carrera suave. Ritmo en el que puedas hablar. En los días por arriba, mejor suave que intenso.' }),
  'pared': R_('moverse', 'Estiramiento en la pared', 'Dos minutos para el pecho y la espalda', 'pasos', { pasos: P_(['Mano en la pared', 'Pon una mano en la pared a la altura del hombro.'], ['Gira suave', 'Gira el cuerpo hacia el otro lado hasta notar el pecho estirado. Treinta segundos.'], ['Cambia de lado', 'Repite con la otra mano.']) }),
  /* ---- bajar revoluciones ---- */
  'regla-48': R_('subida', 'Esperar 48 horas', 'Para compras y decisiones grandes', 'hecho', { texto: 'Si vas por arriba, apunta la compra o la decisión y espera 48 horas. Si dentro de dos días sigue pareciéndote buena idea, la hablas con alguien de confianza.' }),
  'tarjeta': R_('subida', 'Dejar la tarjeta en casa', 'Un freno sencillo al gasto', 'hecho', { texto: 'Sal solo con el dinero justo. Quita la tarjeta de las apps de compra estos días. Es un freno, no un castigo.' }),
  'una-cosa': R_('subida', 'Una sola cosa a la vez', 'Elegir tres cosas para hoy, y ya', 'pasos', { pasos: P_(['Todo lo que quieres hacer', 'Escríbelo, sin filtro.', 3], ['Elige tres', 'Solo tres para hoy. El resto, a otro día.'], ['De una en una', 'Empieza por la primera y no pases a la siguiente hasta acabarla.']) }),
  'menos-estimulos': R_('subida', 'Menos estímulos', 'Bajar luces, música y planes', 'hecho', { texto: 'Baja la música, las luces y el ritmo de planes. Nada de café después de comer ni alcohol. Menos pantallas, sobre todo por la noche.' }),
  'apuntar-ideas': R_('subida', 'Apuntar las ideas para mañana', 'En vez de hacerlas todas ya', 'vaciar'),
  'avisar': R_('subida', 'Contárselo a alguien', 'Que alguien de confianza lo sepa', 'hablar'),
  'respirar-subida': R_('subida', 'Respirar más largo', 'Soltar el aire el doble de lento', 'respirar', { fases: [['Inspira', 4], ['Suelta', 8]], dur: 90 }),
  'hora-cama': R_('subida', 'Acostarte a tu hora aunque no tengas sueño', 'El sueño protege mucho en las subidas', 'hecho', { texto: 'Aunque no tengas sueño, métete en la cama a tu hora con la luz apagada y sin móvil. Descansar tumbado ya cuenta.' }),
  /* ---- para dormir ---- */
  'pantallas-fuera': R_('dormir', 'Pantallas fuera una hora antes', 'Móvil a cargar lejos de la cama', 'hecho', { texto: 'Una hora antes de dormir, deja el móvil cargando fuera del dormitorio. Lee algo en papel, escucha algo tranquilo o habla con alguien.' }),
  'horario': R_('dormir', 'Misma hora cada día', 'Acostarte y levantarte igual, también el fin de semana', 'hecho', { texto: 'Levántate a la misma hora todos los días, aunque hayas dormido mal. Es lo que más ordena el sueño.' }),
  'relajar-noche': R_('dormir', 'Soltar el cuerpo en la cama', 'Cinco minutos, ya tumbado', 'pasos', { pasos: P_(['Boca arriba', 'Brazos a los lados y respira despacio.'], ['De abajo arriba', 'Afloja pies, piernas, tripa, pecho, hombros y cara, uno a uno.'], ['Pesado', 'Imagina que el cuerpo pesa y se hunde en el colchón.']) }),
  'contar-atras': R_('dormir', 'Contar hacia atrás', 'De cien, de tres en tres', 'hecho', { texto: 'Cuenta hacia atrás desde cien, de tres en tres: cien, noventa y siete, noventa y cuatro… Si te pierdes, vuelve a empezar. Ocupa la cabeza sin activarla.' }),
  'si-no-duermes': R_('dormir', 'Si no te duermes en veinte minutos', 'Levántate y vuelve con sueño', 'hecho', { texto: 'Si llevas un rato largo dando vueltas, levántate, ve a otra habitación con luz tenue y haz algo aburrido. Vuelve a la cama cuando notes sueño.' }),
  'cuarto': R_('dormir', 'Un cuarto para dormir', 'Oscuro, fresco y silencioso', 'hecho', { texto: 'Habitación oscura, algo fresca y en silencio. Si hay ruido, prueba con tapones o un sonido suave de fondo.' }),
  'respirar-noche': R_('dormir', 'Respirar para dormir', 'Cuatro, siete, ocho, tres minutos', 'respirar', { fases: [['Inspira', 4], ['Aguanta', 7], ['Suelta', 8]], dur: 180 }),
  'vaciar-noche': R_('dormir', 'Vaciar la cabeza', 'Lo que da vueltas, a la caja', 'vaciar'),
  /* ---- hablar y frases ---- */
  'hablar': R_('hablar', 'Hablar con alguien', 'Tus personas de confianza', 'hablar'),
  'frases': R_('frases', 'Frases que ayudan', 'Las tuyas y muchas más', 'frases')
};
L.RECURSOS.trampas = R_('pensamiento', 'Las trampas del pensamiento', 'Conocerlas para verlas', 'lista');

/* ============================== TRAMPAS DEL PENSAMIENTO ============================== */
L.TRAMPAS = [
  ['Adivinar el futuro', 'Das por hecho que algo va a salir mal antes de que pase.'],
  ['Leer la mente', 'Das por hecho lo que piensan los demás sin tener pruebas.'],
  ['Todo o nada', 'Si no es perfecto, es un desastre. No ves los grises.'],
  ['Catastrofizar', 'Imaginas lo peor y lo tratas como si fuera seguro.'],
  ['Ponerte etiquetas', 'Pasas de «me he equivocado» a «soy un desastre».'],
  ['Culparte de todo', 'Cargas con lo que no depende solo de ti.'],
  ['Generalizar', 'Una vez sale mal y piensas «siempre me pasa» o «nunca me sale».'],
  ['Filtro negativo', 'Solo ves lo malo del día y lo bueno se queda fuera.'],
  ['Quitar valor a lo bueno', 'Si algo sale bien, piensas que fue suerte o que no cuenta.'],
  ['Los «debería»', 'Te exiges cómo tendrías que ser o sentirte, y te castigas si no.'],
  ['Razonamiento emocional', 'Lo sientes, luego es verdad: «me siento inútil, así que lo soy».'],
  ['Compararte', 'Comparas tu peor momento con lo mejor que enseñan los demás.'],
  ['Lupa y prismáticos', 'Agrandas tus fallos y haces pequeños tus logros.'],
  ['Tomártelo todo como personal', 'Crees que lo que hacen los demás va por ti.'],
  ['Culpar a los demás', 'Todo lo malo es por otros, y así no ves lo que sí puedes cambiar.'],
  ['Exigir que todo sea justo', 'Te enfadas porque las cosas no son como deberían ser.'],
  ['Saltar a conclusiones', 'Con muy pocos datos decides lo que significa.'],
  ['Creer que nunca cambiará', 'Piensas que estarás así siempre. Los estados de ánimo cambian.'],
  ['Necesitar tener razón', 'Discutir hasta ganar pesa más que entenderte con el otro.'],
  ['Perfeccionismo', 'Nada es suficiente. Hecho y bien es mejor que perfecto y sin hacer.'],
  ['Tener que poder con todo', 'Pedir ayuda te parece un fallo. No lo es.'],
  ['Sentirse capaz de todo', 'En las subidas: «no necesito dormir, puedo con todo, ya lo arreglo luego».'],
  ['Urgencia', 'Todo tiene que ser ya. Casi nada es tan urgente como parece.']
];
L.trampas = () => [...L.TRAMPAS, ...((L.d && L.d.trampasPropias) || []).map(t => [t.nombre, t.def || 'Una trampa tuya.', true])];

/* ============================== FRASES QUE AYUDAN ============================== */
L.FRASES_CAT = {
  'Para la calma': ['Esto que siento es intenso, pero pasará.', 'Ahora mismo, solo esta respiración.', 'No tengo que resolverlo todo hoy.', 'Puedo ir paso a paso.', 'Puedo bajar el ritmo. Nada se rompe por parar cinco minutos.', 'Aquí y ahora estoy a salvo.', 'Una cosa cada vez.', 'Respiro, noto los pies, sigo.'],
  'Cuando hay ansiedad': ['La ansiedad sube, llega a un punto y baja. Siempre baja.', 'Es una alarma, no un peligro.', 'Mi cuerpo está intentando protegerme, aunque se pase.', 'No tengo que creerme todo lo que me dice el miedo.', 'Puedo sentir esto y seguir haciendo lo que estaba haciendo.', 'Ya he pasado por esto y salí.', 'Lo que imagino casi nunca es lo que pasa.'],
  'Para los días bajos': ['Hoy cuenta aunque haga poco.', 'Levantarme ya es algo.', 'He salido de días difíciles otras veces.', 'Este estado no es para siempre, aunque ahora lo parezca.', 'No me tengo que sentir bien para dar un paso pequeño.', 'Descansar también es hacer algo.', 'Lo pequeño también cuenta.', 'Mañana puede ser un poco distinto.'],
  'Para los días por arriba': ['Que una idea sea emocionante no significa que tenga que hacerla ya.', 'Puedo esperar 48 horas antes de decidir.', 'Dormir es parte del plan, no una pérdida de tiempo.', 'Bajar el ritmo es cuidarme, no perder oportunidades.', 'Si todo es urgente, nada lo es.', 'Mis personas de confianza me ven desde fuera. Puedo escucharlas.', 'Lo que hoy parece brillante, mañana lo miraré con calma.'],
  'Para hablarte con cariño': ['Sentirme así no dice nada malo de mí.', 'Me trato como trataría a alguien que quiero.', 'Hago lo que puedo con lo que tengo hoy.', 'Puedo pedir ayuda. No es un fallo.', 'Me merezco paciencia, también la mía.', 'Estoy aprendiendo a cuidarme, y eso lleva tiempo.', 'No tengo que ganarme el descanso.'],
  'Sobre los pensamientos': ['Los pensamientos no son hechos.', 'Estoy teniendo un pensamiento, no soy ese pensamiento.', 'Que lo piense no lo hace verdad.', 'Puedo dejar que este pensamiento pase sin seguirlo.', '¿Qué le diría a un amigo que piensa esto?', 'Mi cabeza cuenta historias. Esta es una más.'],
  'Para seguir': ['Un día a la vez.', 'No hace falta ver todo el camino, solo el siguiente paso.', 'Mi valor no depende de lo que haga hoy.', 'Hay gente que me quiere aunque yo hoy no me vea bien.', 'Pedir ayuda a tiempo es una forma de fuerza.', 'Todo lo que siento tiene sentido, aunque no lo entienda aún.']
};
L.FRASES = Object.values(L.FRASES_CAT).flat();
L.CUIDAR = ['Mi descanso', 'Mi paciencia', 'Moverme', 'Estar con alguien', 'Ir más despacio', 'Comer bien'];
L.CUMPLIDO = ['Lo he conseguido', 'A ratos', 'Hoy no'];
L.CON = ['Pareja', 'Familia', 'Amistades', 'A solas'];
