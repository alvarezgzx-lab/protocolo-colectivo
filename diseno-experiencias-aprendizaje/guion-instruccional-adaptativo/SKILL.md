---
name: guion-instruccional-adaptativo
description: Genera el guion instruccional completo (storyboard bloque por bloque) de un módulo o curso e-learning adaptativo, integrando el marco LXD de 7 fases para cursos adaptativos (Backward Design, checkpoints y rutas de decisión/nextBlockId, etapas de Merrill, diccionario xAPI, banco de evaluación, assets y checklist UDL por ruta) con los criterios del Agente eLearning Agéntico de Ángel (estándar CONOCER/EC1691, DUA, plan de abordaje en 3 opciones, máximo 3 preguntas estratégicas). Úsala siempre que Ángel pida escribir, diseñar o redactar un guion instruccional, storyboard, guion de curso, secuencia didáctica bloque por bloque, o cuando mencione checkpoints, rutas adaptativas, nextBlockId, branching, decisionEngine o Adapt Framework — aunque no diga la palabra "guion" explícitamente. También aplica cuando pida avanzar de fase dentro de un curso adaptativo ya iniciado (ej. "ya tengo los objetivos, ayúdame con el storyboard").
---

# Guion instruccional para cursos adaptativos

## Por qué está diseñada así

Esta skill nace de cruzar dos documentos de Ángel: el system prompt de su "Agente eLearning Agéntico" (el marco general de diseño instruccional — CONOCER, DUA, plan de abordaje, rúbricas) y el roadmap de LXD de 7 fases que usa específicamente para construir **cursos adaptativos** sobre Adapt Framework, con xAPI y un middleware que llama a Claude para decidir, en tiempo real, qué bloque (`nextBlockId`) ve cada alumno según su historial.

Un guion instruccional para este tipo de curso no es solo "el texto que lee el alumno" — es el documento que además define qué bloques existen, a qué ruta pertenecen, cómo se trackean y cómo se evalúan, porque todo eso se traduce directamente en código (`course.json` de Adapt, `middleware/src/claude.js`, el diccionario de verbos xAPI). Un guion incompleto o con IDs inconsistentes no es solo un problema pedagógico: rompe el sistema de branching en producción.

Por eso esta skill no salta directo a "escribir el guion" — sigue las fases en orden, porque cada una es prerrequisito de la siguiente (el mismo principio de Backward Design del roadmap: no se puede escribir contenido antes de saber qué se evalúa, ni evaluar antes de saber el objetivo).

## Paso 0 — Aclarar el alcance antes de empezar

Haz como máximo 3 preguntas estratégicas (igual que el Agente eLearning — después de eso, avanza con supuestos documentados en vez de seguir preguntando):

1. **¿El curso es adaptativo (con branching/`nextBlockId`) o lineal?** Si es lineal, la Fase 2 (checkpoints), la columna de rutas en el storyboard y el checklist UDL por ruta no aplican — simplifica todo a una sola ruta `default`. No asumas branching solo porque la skill se llama "adaptativo".
2. **¿Ya existe un glosario de IDs (`checkpointId`/`blockId`) o un `course.json` previo?** Si existe, pide que lo comparta o lo pegue — nunca inventes IDs nuevos que puedan chocar con los ya usados en Adapt, `decisionEngine.js` o `middleware/src/claude.js`. Si no existe, créalo desde cero con `assets/plantilla-glosario-ids.json`.
3. **¿Hay un estándar de competencia formal (CONOCER/EC1691 u otro) al que alinear el curso?** Si sí, aplica además los criterios de `references/criterios-agente-elearning.md` (declaratoria de uso de IAGen, ficha descriptiva, etc.). Si no, trabaja solo con el marco pedagógico (Bloom, DUA, Merrill).

Si Ángel ya respondió esto en su mensaje o en archivos adjuntos, no repitas las preguntas — confirma tu interpretación en una línea y avanza.

## Paso 1 — Fase 1: objetivos con Backward Design

Antes de escribir una sola línea de guion, resuelve (Wiggins & McTighe: primero resultados y evidencia, después actividades):

- Público objetivo, prerrequisitos, duración total.
- Objetivos de aprendizaje: **verbo medible + condición + criterio** (Bloom revisado: recordar, comprender, aplicar, analizar, evaluar, crear — nunca "entender" o "conocer", no son observables).
- Mapa de evidencia: para cada objetivo, qué comportamiento observable lo demuestra y cómo se captura (qué interacción de Adapt produce qué statement xAPI).

**No avances a la Fase 2 sin esto resuelto.** Si Ángel no tiene esta información completa, no te quedes pidiéndola indefinidamente — propón un borrador razonable basado en el título/descripción del curso y márcalo explícitamente como supuesto a validar.

## Paso 2 — Fase 2: checkpoints y rutas de decisión (solo si el curso es adaptativo)

Por cada punto de decisión del curso, especifica (usa `assets/plantilla-checkpoints-decision.json` como esqueleto):

- **`checkpointId`** en kebab-case descriptivo (ej. `chk-conceptos-basicos`).
- **Qué se evalúa antes de ese punto**: actividades previas + señales xAPI que el middleware necesita leer.
- **Rutas posibles**: cada una con un `nextBlockId` (kebab-case; que el nombre ya sugiera si es refuerzo o avance, ej. `b-refuerzo-x` vs `b-avanzado-x`) y un **criterio de selección en lenguaje claro y accionable** — nada de pseudocódigo. Ejemplo: "si el alumno falló 2+ veces el ejercicio X, ir a `b-refuerzo-x`". Este texto alimenta literalmente el system prompt del middleware, así que tiene que ser inequívoco.
- **`casoSinHistorialPrevio`**: qué ruta toma un alumno que llega por primera vez, sin statements previos. No es opcional — sin esta regla el middleware no sabe qué hacer con el primer alumno que llega a cada checkpoint, y es el hueco más común en estos proyectos.

Regla dura: **todo `nextBlockId` que definas aquí tiene que terminar existiendo como bloque real en la Fase 3.** Si no puedes escribir ese bloque todavía, no lo prometas como ruta.

## Paso 3 — Fase 3: el guion instruccional (storyboard bloque por bloque)

Este es el entregable central — usa `assets/plantilla-guion-instruccional.md` como formato de salida. Estructura cada bloque según **Merrill's First Principles** (problema real → activación de conocimiento previo → demostración → aplicación → integración; no todos los bloques necesitan las 5 etapas, pero cada uno debe poder ubicarse en una).

Por cada bloque (fila de la tabla), completa:

| Campo | Qué va ahí |
|---|---|
| `id` (= `blockId`) | El mismo ID usado en el glosario y, si aplica, como `nextBlockId` de algún checkpoint. |
| Tipo de componente | `text / graphic / mcq / video / narrative / etc.` (o el tipo genérico si no usan Adapt). |
| **Contenido / guion** | El texto real que verá o escuchará el alumno — instrucciones, narración, preguntas, redactado de verdad, no un placeholder tipo "aquí va una explicación". Esto es lo que diferencia un guion de un esquema. Instrucciones de actividad en ≤60 palabras (criterio de claridad). |
| Objetivo(s) Bloom | De la Fase 1 (O1, O2...). Todo bloque necesita al menos uno. |
| Etapa Merrill | problema / activación / demostración / aplicación / integración. |
| Ruta adaptativa | `default` o el `checkpointId`/`nextBlockId` al que pertenece. |
| Alternativas DUA (mínimo 3) | Representación, acción/expresión, compromiso — específicas a ESE bloque, no genéricas ("subtítulos" solo si hay video en ese bloque en concreto). |
| Verbo xAPI | Preferir vocabulario ADL estándar (`experienced`, `attempted`, `answered`, `completed`, `mastered`, `passed`, `failed`). Los 3 verbos custom de la capa de decisión (`checkpoint-reached`, `decision-requested`, `route-assigned`) son solo para bloques que SON checkpoints, no para contenido normal. Un verbo custom nuevo solo se justifica si ningún verbo ADL cubre el caso — y hay que decir explícitamente por qué. |

Si la duración total del curso es menor a 5 horas, o el público es de nivel básico, diseña actividades de 5-12 minutos (microlearning) en vez de bloques largos. Apunta a que al menos 30% de las actividades sean activas (respuesta, producción, práctica), no solo lectura/visualización pasiva.

**Gate antes de seguir:** todo `nextBlockId` de la Fase 2 tiene una fila aquí. Todo bloque tiene al menos un objetivo asociado.

## Paso 4 — Trazabilidad a evaluación y assets

Por cada bloque evaluable, genera una entrada de banco de evaluación (ID pregunta, tipo, enunciado, respuesta correcta, distractores, rúbrica de puntaje) enlazada al mismo `blockId` y, si alimenta un checkpoint, al `checkpointId`. Por cada asset multimedia que el guion menciona (video, imagen, audio), regístralo con tipo, bloque donde se usa, formato/specs y estado de producción — así nadie descubre en producción que faltaba un asset que el guion daba por hecho.

## Paso 5 — Fase 6: checklist UDL final

Repite el checklist de accesibilidad **una vez por cada ruta/`nextBlockId` definida en la Fase 2, incluida la ruta `default`** — no es un checklist único para todo el curso. Cada rama del árbol de decisión es una obligación de accesibilidad aparte, no un extra opcional: un alumno que cae en la ruta de refuerzo tiene el mismo derecho a alternativas DUA que uno que sigue la ruta default. Para cada ruta verifica representación múltiple, acción/expresión múltiple y compromiso múltiple (ver la plantilla para el detalle exacto de cada bloque).

## Paso 6 — Empaquetar y entregar

Entrega en este orden:

1. **Guion instruccional** completo (Markdown, tabla de la Fase 3) — el documento principal.
2. **JSON de checkpoints actualizado** (si el curso es adaptativo) — listo para que desarrollo lo traduzca al system prompt del middleware.
3. **Tabla de trazabilidad**: actividad → objetivo → checkpoint/estándar → criterio de evaluación. Es la prueba de que nada quedó suelto.
4. **Supuestos documentados**: cualquier decisión que tomaste sin confirmación explícita de Ángel, para que las valide antes de pasar a producción.
5. Si aplica un estándar CONOCER/EC1691, incluye la declaratoria de uso de IAGen (ver `references/criterios-agente-elearning.md`).

No generes archivos binarios ni recursos finales protegidos por copyright sin permiso — el entregable de esta skill es el diseño y el guion, no el empaquetado técnico final para producción.

## Referencias

- `references/marco-lxd-7-fases.md` — detalle completo de las 7 fases del roadmap LXD, convención de nombres de IDs, y la lista completa de verbos xAPI. Consúltalo si necesitas el detalle exacto de una fase.
- `references/criterios-agente-elearning.md` — criterios del Agente eLearning Agéntico: estándar CONOCER/EC1691, reglas DUA, esquema de entrada JSON, plan de abordaje en 3 opciones, métricas de calidad. Consúltalo cuando el curso deba alinearse a un estándar de competencia formal.
- `assets/plantilla-guion-instruccional.md` — plantilla exacta de salida para el guion (Fase 3 + DUA + xAPI + evaluación).
- `assets/plantilla-glosario-ids.json` — plantilla del glosario de IDs (`checkpointId`/`blockId`).
- `assets/plantilla-checkpoints-decision.json` — plantilla de especificación de checkpoints y rutas (Fase 2).
