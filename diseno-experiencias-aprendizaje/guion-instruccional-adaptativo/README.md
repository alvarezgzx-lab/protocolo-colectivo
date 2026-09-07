# guion-instruccional-adaptativo

Skill de Claude que genera el **guion instruccional completo (storyboard bloque por bloque)** de un módulo o curso e-learning adaptativo — integrando el marco de Diseño de Experiencias de Aprendizaje (LXD) de 7 fases con los criterios del estándar CONOCER/EC1691 y Diseño Universal para el Aprendizaje (DUA).

## Qué hace

Este guion no es solo "el texto que lee el alumno": es el documento que define qué bloques existen, a qué ruta de decisión pertenecen, cómo se trackean (xAPI) y cómo se evalúan — porque todo eso se traduce directamente en código de un curso adaptativo real (`course.json` de Adapt Framework, middleware de decisión). Un guion incompleto o con IDs inconsistentes no es solo un problema pedagógico: rompe el sistema de branching en producción.

Por eso la skill sigue fases en orden estricto (principio de Backward Design: no se escribe contenido antes de saber qué se evalúa):

0. **Alcance** — hasta 3 preguntas estratégicas: ¿el curso es adaptativo o lineal?, ¿existe ya un glosario de IDs?, ¿hay un estándar de competencia formal al que alinear el curso?
1. **Objetivos (Backward Design)** — verbo medible + condición + criterio (Bloom revisado), con mapa de evidencia por objetivo.
2. **Checkpoints y rutas de decisión** *(solo cursos adaptativos)* — cada punto de decisión con sus rutas, criterios de selección en lenguaje claro, y la ruta obligatoria para un alumno sin historial previo.
3. **Guion instruccional bloque por bloque** — el entregable central: cada bloque estructurado según las 5 etapas de Merrill (problema, activación, demostración, aplicación, integración), con contenido real (no placeholders), objetivos Bloom, alternativas DUA específicas al bloque, y verbo xAPI.
4. **Trazabilidad a evaluación y assets** — banco de evaluación y registro de assets multimedia enlazados a cada bloque.
5. **Checklist UDL** — repetido una vez por cada ruta de decisión, no uno solo para todo el curso.
6. **Empaquetado** — guion + JSON de checkpoints + tabla de trazabilidad + supuestos documentados, en ese orden.

## Archivos

| Archivo | Rol |
|---|---|
| `SKILL.md` | Definición completa de la skill: las 6 fases del proceso, reglas duras (todo `nextBlockId` debe existir como bloque real, etc.). |
| `references/marco-lxd-7-fases.md` | Detalle completo del roadmap LXD de 7 fases, convención de nombres de IDs y lista de verbos xAPI. |
| `references/criterios-agente-elearning.md` | Criterios de alineación a CONOCER/EC1691, reglas DUA, plan de abordaje en 3 opciones. |
| `assets/plantilla-guion-instruccional.md` | Plantilla exacta de salida del storyboard (Fase 3 + DUA + xAPI + evaluación). |
| `assets/plantilla-glosario-ids.json` | Plantilla del glosario de `checkpointId`/`blockId`. |
| `assets/plantilla-checkpoints-decision.json` | Plantilla de especificación de checkpoints y rutas (Fase 2). |

## Cómo se activa

Cuando pides escribir, diseñar o redactar un guion instruccional, storyboard, o secuencia didáctica bloque por bloque — o cuando mencionas checkpoints, rutas adaptativas, `nextBlockId`, branching, `decisionEngine` o Adapt Framework, incluso sin decir la palabra "guion". También se activa para retomar un curso adaptativo ya iniciado (ej. "ya tengo los objetivos, ayúdame con el storyboard").

## Cómo instalarla

1. Copia esta carpeta completa (`SKILL.md`, `assets/`, `references/`) a tu directorio de skills de Claude.
2. Si ya tienes un `course.json` o glosario de IDs previo de un curso en Adapt Framework, ten el archivo a la mano — la skill lo pide en el Paso 0 para no generar IDs que choquen con los existentes.
3. No requiere configuración adicional; se activa sola cuando el pedido coincide con su `description`.
