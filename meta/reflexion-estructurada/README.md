# reflexion-estructurada

Skill de Claude que define un **modo de trabajo reflexivo para tareas sustantivas** (decisiones, narrativas, estrategia, contenido de varios pasos) — personalizable a cómo tú quieras que Claude trabaje contigo. No produce contenido por sí misma — es una capa de proceso que se activa *antes* de ejecutar cualquier otra skill o tarea, y que decide si conviene pausar a alinear expectativas antes de ejecutar.

**Versión fusionada:** esta skill incorpora el repertorio de 7 lentes expertas que originalmente vivía en una skill separada llamada `council`, pero como paso de análisis interno — no como el debate dramatizado con veredicto y porcentaje de confianza del diseño original. Ese formato de salida desaparece por completo; lo que se conserva es la disciplina de cruzar la solicitud por ángulos genuinamente distintos antes de escribir.

## Qué hace

Tres reglas:

1. **Artifacts, estricta y literal** — nunca crea un archivo/documento descargable salvo que el usuario use literalmente la palabra disparadora acordada (por defecto "archivo" o "documento", personalizable) en el turno, sin importar qué tan claramente lo implique el contexto o la skill activa.
2. **Detección de complejidad** — decide caso por caso (no por lista fija) si una tarea amerita el proceso completo de reflexión o si se ejecuta directo. Narrativa, decisiones con alternativas, tareas multi-paso o ambiguas → proceso completo; correcciones puntuales o preguntas factuales → directo.
3. **El proceso completo**, cuando aplica:
   1. Analiza la solicitud.
   2. **(Nuevo)** Evalúa la solicitud desde 2-4 lentes relevantes de un repertorio de 7 (Adversario, Estratega, Científico, Visionario, Ingeniero, Filósofo, Humanista), elegidas según el tipo de tarea. Este paso es interno e invisible por defecto — solo afila el análisis de huecos que sigue. Se vuelve visible únicamente si dos lentes llevan a recomendaciones genuinamente distintas, y en ese caso se nombra como una nota breve de tensión, nunca como un debate entre "personas".
   3. Expone huecos y supuestos en texto conversacional.
   4. Propone un esquema de fases.
   5. Hace 2-3 preguntas de clarificación en un solo turno, vía widget de opción múltiple.
   6. Espera la respuesta — el turno termina ahí.
   7. Al recibir la respuesta, señala brevemente algún patrón de decisión si lo detecta.
   8. Ejecuta la tarea con el esquema confirmado.

## Archivos

| Archivo | Rol |
|---|---|
| `SKILL.md` | Las tres reglas completas, con la Regla 3 fusionada y la tabla de calibración de lentes por tipo de tarea. Trae un marcador `[PERSONALIZAR: ...]` en la palabra disparadora de la Regla 1 y otro en la tabla de calibración del Paso 2. |
| `references/repertorio-lentes.md` | Las 7 lentes: foco, pregunta que aporta, y sesgo propio a vigilar — condensadas de las personas originales de `council`, sin las secciones de voz/frases/emoji que ya no aplican al no dramatizarse. |

## Cómo se activa

Siempre que la solicitud implique una decisión, una narrativa, una estrategia, un storyboard, un plan, una elección entre opciones, o cualquier tarea de varios pasos — incluso sin pedir explícitamente "reflexión" o "análisis". No se activa el proceso completo para typos, formato, ediciones puntuales o preguntas factuales.

## Cómo instalarla

1. Copia esta carpeta completa (`SKILL.md`, `references/`) a tu directorio de skills de Claude.
2. **Personaliza `SKILL.md`** — tiene marcadores `[PERSONALIZAR: ...]` en la Regla 1 (palabra disparadora para crear archivos) y en la tabla de calibración de lentes del Paso 2. Sigue el protocolo de personalización en [`INSTALACION.md`](../../INSTALACION.md) de la raíz del repositorio, o resuélvelos tú mismo directamente en el archivo.
3. No depende de otras skills para funcionar, pero está pensada para activarse **antes** que las demás (CV, storyboards, evaluación DI, etc.) — no las reemplaza, decide si y cómo se activa la conversación previa a ejecutarlas.
4. Si tu instalación de Claude soporta los widgets `ask_user_input_v0` y `step_card_display_v0` mencionados en `SKILL.md`, la skill los usa para las preguntas de clarificación y el esquema de fases; si no están disponibles, adapta esos dos puntos a texto conversacional equivalente.
