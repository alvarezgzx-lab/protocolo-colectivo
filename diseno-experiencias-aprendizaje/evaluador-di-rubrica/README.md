# evaluador-di-rubrica

Skill de Claude que audita módulos, cursos o secuencias didácticas de Diseño Instruccional mediante una **rúbrica de 20 criterios ponderados** que integra las taxonomías de Bloom, SOLO, Fink y Marzano, junto con criterios de instrumentos de evaluación, UX/atención, analítica y humanización de tono.

## Qué hace

La rúbrica nace de un diseño original pensado para un equipo de agentes IA orquestados en paralelo (ContentAgent, PedagogyAgent, AssessmentAgent, UXAgent, AnalyticsAgent, HumanizerAgent). Como Claude.ai no lanza subagentes en paralelo, esta skill convierte esas 6 fases en **6 lentes secuenciales aplicadas dentro de una sola pasada de análisis**:

1. **Contenido y microlecciones (C1-C3)** — objetivos observables, unidad mínima de microlección, progresión pedagógica.
2. **Taxonomías pedagógicas (P1-P4)** — Bloom, SOLO, Fink, Marzano.
3. **Instrumentos de evaluación (A1-A4)** — adecuación, calidad de rúbrica, validez/confiabilidad, diversidad de evidencias.
4. **UX y atención (U1-U4)** — diseño centrado en el usuario, estrategias de atención, técnicas de recuperación, accesibilidad.
5. **Métricas y analítica (AN1-AN3)** — KPIs, plan de recolección, detección de sesgos.
6. **Humanización de tono (H1-H2)** — con una bifurcación según el volumen de texto a revisar (invoca la skill `humanizar-texto-es` para documentos sustanciales, o genera variantes directamente para fragmentos cortos).

Cada criterio recibe un puntaje 0-4 con justificación de una frase, basado en evidencia real disponible — nunca en cómo "debería" ser un buen curso en general. Si falta evidencia crítica para calificar una fase completa, la skill lo dice explícitamente en vez de inventar una nota.

El puntaje global se calcula con la fórmula `100 × [Σ (puntaje/4 × peso)] / [Σ pesos evaluados]`, con umbrales: <60 Insuficiente · 60-74 Aceptable · 75-89 Bueno · ≥90 Excelente. Las recomendaciones se priorizan en Alta (validez de evaluación, alineación pedagógica, accesibilidad), Media (humanización, KPIs) y Baja/opcional.

La salida siempre incluye un JSON estructurado (para llevar a otro sistema) seguido de un informe narrativo, y se presenta siempre como **propuesta a revisar**, nunca como veredicto final ni cambio aplicado automáticamente.

## Archivos

| Archivo | Rol |
|---|---|
| `SKILL.md` | Proceso completo: cuándo se activa, las 6 fases en orden, fórmula de puntaje, priorización de recomendaciones. |
| `references/criterios-completos.md` | Detalle de cada uno de los 20 criterios: descripción, evidencia requerida, qué recomendar si el puntaje sale bajo. |
| `references/formato-salida.md` | Esquema JSON exacto y plantilla del informe narrativo. |

## Cómo se activa

Cuando pides evaluar, auditar, revisar, dar retroalimentación pedagógica, o una segunda opinión sobre un módulo/curso/secuencia didáctica — propia o ajena — aunque no menciones la palabra "rúbrica". También cuando pegas objetivos de aprendizaje, microlecciones o instrumentos de evaluación preguntando si están bien diseñados, o subes un PDF/DOCX/PPTX de un curso pidiendo revisión de calidad pedagógica.

## Cómo instalarla

1. Copia esta carpeta completa (`SKILL.md`, `references/`) a tu directorio de skills de Claude.
2. Si vas a evaluar archivos (PDF/DOCX/PPTX) en vez de texto pegado, asegúrate de tener disponibles las skills de lectura de documentos correspondientes (`pdf`, `docx`, `pptx`) — `evaluador-di-rubrica` las invoca para extraer contenido antes de evaluar.
3. Opcional: si quieres que la Fase 6 (humanización de tono) use la skill dedicada `humanizar-texto-es` sobre documentos largos, instálala también; si no está disponible, la skill genera las variantes de tono directamente.
