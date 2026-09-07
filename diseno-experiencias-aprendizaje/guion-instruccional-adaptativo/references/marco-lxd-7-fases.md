# Marco LXD — 7 fases para cursos adaptativos

Este es el roadmap completo usado para construir cursos adaptativos sobre
Adapt Framework, con tracking xAPI y un middleware que llama a Claude
(`middleware/src/claude.js`) para decidir en tiempo real qué bloque ve cada alumno.
Cada fase tiene un gate ("Definition of Done") que impide avanzar a la siguiente sin
resolver lo anterior — esto no es burocracia, es lo que evita que el guion prometa
bloques o rutas que nunca se construyen.

## Fase 0 — Glosario de IDs

Fuente única de verdad de identificadores. Todo `checkpointId` y `blockId` usado en
cualquier fase posterior debe coincidir **literalmente** con:

- `course.json` (Adapt)
- el `checkpointId` que envía la extensión `decisionEngine.js`
- el `nextBlockId` que devuelve `middleware/src/claude.js`

No duplicar IDs entre listas. Convención de nombres sugerida (ajustable si el
proyecto ya tiene otra): `checkpointId` en kebab-case descriptivo (ej.
`chk-conceptos-basicos`); `blockId` igual, con el nombre sugiriendo si es ruta de
refuerzo o de avance (`b-refuerzo-conceptos-basicos`, `b-avanzado-conceptos-basicos`)
— así se puede leer la Fase 2 sin saltar constantemente de documento.

## Fase 1 — Análisis y objetivos

Backward Design (Wiggins & McTighe): define primero resultados y evidencia, recién
después actividades. Diseñar pantallas antes de saber qué se evalúa es el error más
común en estos proyectos.

Contenido de la fase:
- Público objetivo (quién toma el curso, rol/contexto, motivación).
- Prerrequisitos (qué debe saber/poder hacer el alumno antes de empezar).
- Duración total estimada.
- Objetivos de aprendizaje (Bloom revisado): formato **verbo medible + condición +
  criterio**. Evitar verbos no observables ("entender", "conocer") — usar recordar,
  comprender, aplicar, analizar, evaluar, crear.
- Mapa de evidencia: por objetivo, qué comportamiento/respuesta observable demuestra
  que se logró, y cómo se captura (qué interacción Adapt → qué statement xAPI). Esto
  alimenta directamente el diseño de los checkpoints de la Fase 2 — no se puede
  llenar esa especificación sin esta tabla resuelta primero.

**Gate:** todo objetivo tiene al menos una fila de evidencia; toda evidencia tiene
claro en qué checkpoint (del glosario de la Fase 0) se observa.

## Fase 2 — Especificación de checkpoints y rutas de decisión

Este archivo es el que desarrollo traduce directamente al system prompt y a los
guardrails de `middleware/src/claude.js`. Por cada `checkpointId` (que debe existir
en el glosario de la Fase 0):

- **Qué se evalúa antes de ese punto**: actividades previas + señales xAPI.
- **Rutas posibles**: lista de `nextBlockId` candidatos, cada uno con un
  `criterioDeSeleccion` en lenguaje claro, no pseudocódigo — ej. "si el alumno falló
  2+ veces el ejercicio X, ir aquí". Todo `nextBlockId` candidato debe terminar
  existiendo como fila en la Fase 3 (Definition of Done del proyecto completo).
- **`casoSinHistorialPrevio`**: qué ruta toma un alumno que llega a este checkpoint
  por primera vez, sin statements previos que evaluar. Ningún checkpoint puede
  quedar sin esta regla.

Nota para desarrollo: con este archivo completo, el system prompt de `claude.js`
debe (1) recibir la lista de `nextBlockId` válidos para el checkpoint actual, no
solo el historial crudo, (2) recibir el criterio en lenguaje claro como parte del
contexto, (3) tener instrucción explícita de nunca devolver un `nextBlockId` fuera de
esa lista, (4) manejar el caso sin historial devolviendo el `nextBlockId` de
`casoSinHistorialPrevio` sin necesidad de llamar a Claude para ese caso trivial
(ahorra latencia y costo).

## Fase 3 — Storyboard / mapa de contenido (el guion instruccional)

Estructura interna de cada bloque según **Merrill's First Principles**: problema
real → activación de conocimiento previo → demostración → aplicación →
integración. No todos los bloques necesitan las 5 etapas completas, pero cada uno
debería poder ubicarse en una de ellas.

Tabla por bloque: `contentObject id` (= `blockId` del glosario), tipo de componente
Adapt (text / graphic / mcq / video / narrative / etc.), contenido/guion real,
objetivo(s) Bloom que sirve, etapa Merrill, y si es parte de una ruta adaptativa
específica (ruta default o `nextBlockId` de un checkpoint).

**Gate (Definition of Done del proyecto completo):** todo `nextBlockId` mencionado
en la Fase 2 debe existir como fila aquí. Todo bloque tiene al menos un objetivo de
la Fase 1 asociado.

## Fase 4 — Diccionario de tracking xAPI

Extiende el diccionario de verbos de la capa de decisión, que ya define 3 verbos
custom: `checkpoint-reached`, `decision-requested`, `route-assigned`. Esta fase
cubre las interacciones de *contenido*, no las de decisión.

Preferir siempre vocabulario ADL estándar sobre inventar un verbo custom:
`experienced`, `attempted`, `answered`, `completed`, `mastered`, `passed`, `failed`.
Un verbo custom nuevo solo se justifica si ningún verbo ADL cubre el caso — y hay
que decir explícitamente por qué.

Tabla: interacción (bloque/componente), verbo, objeto/actividad, resultado
(`result.success`/`score`/`completion`), extensiones necesarias.

**Gate:** todo verbo usado es ADL estándar o está justificado como custom. Toda
interacción trackeable del storyboard (Fase 3) tiene fila aquí.

## Fase 5a — Banco de evaluación

Tabla: ID pregunta, bloque (`contentObject`) al que pertenece, tipo (mcq /
short-answer / etc.), enunciado, respuesta correcta, distractores, rúbrica de
puntaje, objetivo Bloom. Cada ítem debe trazarse a un objetivo de la Fase 1 y, si
alimenta un checkpoint, al `checkpointId` correspondiente.

## Fase 5b — Lista de assets

Tabla: asset, tipo (imagen/video/audio), bloque donde se usa, formato,
resolución/specs, duración máxima, estado (pendiente / en producción / listo).

## Fase 6 — Checklist UDL / accesibilidad

Aplicar esta checklist a **cada variante de ruta adaptativa**, no solo a la ruta
default — cada rama del árbol de decisión es una obligación de accesibilidad
aparte, no un extra opcional. Repetir el bloque de abajo una vez por cada
`nextBlockId` (incluida la ruta default) definido en la Fase 2.

Por ruta:
- **Representación múltiple**: alternativa de texto para todo contenido no
  textual (imágenes, video); subtítulos/transcripción en todo audio y video;
  contraste de color suficiente (no depender solo del color para transmitir
  significado).
- **Acción y expresión múltiple**: navegación completa por teclado sin trampas de
  foco; tiempo suficiente o ajustable para completar interacciones.
- **Motivación (compromiso) múltiple**: opciones de dificultad o ritmo dentro de la
  ruta, si aplica; retroalimentación clara e inmediata en cada interacción
  evaluable.

**Checklist global:** cada ruta definida en la Fase 2 tiene su bloque de checklist
completo.
