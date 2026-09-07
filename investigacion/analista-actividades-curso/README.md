# analista-actividades-curso

Skill de Claude que procesa una actividad práctica de un curso o bootcamp (página web, lectura, PDF) y siempre entrega **5 salidas en el mismo orden**, sin mezclarlas entre sí.

## Qué hace

1. **Transcripción literal** — el contenido tal cual aparece, del título al último punto, sin resumir, analizar ni corregir. Conserva listas, subtítulos, tablas y bloques de código. Si hay contenido que no se puede ver completo (imagen cortada, tabla incompleta) o inconsistencias en el material original, lo señala explícitamente en vez de inventarlo. Encabezada con `## TRANSCRIPCIÓN LITERAL` y cerrada con `--- FIN DE TRANSCRIPCIÓN ---`.
2. **Resumen ejecutivo** (máx. 150 palabras) — objetivo de la actividad, entregable esperado, criterios de evaluación, herramientas requeridas, tiempo estimado.
3. **Prompts avanzados para resolver la actividad con Claude** — en tres bloques: patrones de persona (2-3 prompts con un rol experto relevante al tipo de actividad), metodología RAG (qué documentos anclar como contexto y en qué orden), y MCP/herramientas conectadas (qué conectores de Claude sirven para esa actividad específica).
4. **Ideas de skills personalizadas** — 1-3 propuestas de skills a la medida de esa actividad, con nombre, qué automatizan y cuándo se activarían.
5. **Recursos descargables** — enlaces directos y funcionales a datasets, plantillas o notebooks que la actividad requiera, verificando que carguen antes de entregarlos; si no puede confirmar que un enlace es real, lo dice en vez de inventarlo.

## Archivos

| Archivo | Rol |
|---|---|
| `SKILL.md` | Definición completa de la skill: rol, reglas globales, y el detalle de cada una de las 5 fases. |

## Cómo se activa

Cuando pides analizar o preparar una actividad, tarea o proyecto de un curso o bootcamp — pegando el enlace, el texto, o adjuntando un PDF.

## Cómo instalarla

1. Copia esta carpeta completa (`SKILL.md`) a tu directorio de skills de Claude.
2. No requiere archivos de referencia adicionales ni configuración; se activa sola cuando el pedido coincide con su `description`.
3. Si la actividad está en un PDF, ten instalada la skill `pdf`/`pdf-reading` correspondiente para la extracción de contenido antes de la transcripción.
