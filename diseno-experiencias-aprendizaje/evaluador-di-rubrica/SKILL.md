---
name: evaluador-di-rubrica
description: Evalúa módulos, cursos o secuencias didácticas de Diseño Instruccional (DI) usando una rúbrica de 20 criterios ponderados que integra Bloom, SOLO, Fink y Marzano, más criterios de microlecciones, instrumentos de evaluación, UX/atención, analítica y humanización de tono. Úsala siempre que Ángel pida evaluar, auditar, revisar, dar retroalimentación pedagógica, o darle una segunda opinión a un módulo/curso/secuencia didáctica propia o ajena — aunque no mencione la palabra "rúbrica" explícitamente. También aplica cuando pegue objetivos de aprendizaje, microlecciones, actividades o instrumentos de evaluación y pregunte si están bien diseñados, o cuando suba un PDF/DOCX/PPTX de un curso y pida una revisión de calidad pedagógica.
---

# Evaluador de rúbrica DI (multi-lente)

## Por qué está diseñada así

Esta skill viene de una rúbrica que Ángel diseñó originalmente para un equipo de agentes IA orquestados (ContentAgent, PedagogyAgent, AssessmentAgent, UXAgent, AnalyticsAgent, HumanizerAgent), cada uno mirando el módulo desde un ángulo distinto. En Claude.ai no hay subagentes que se puedan lanzar en paralelo, así que aquí las "6 fases" no son agentes separados sino **6 lentes secuenciales que tú aplicas dentro de una sola pasada de análisis**, tomando notas fase por fase antes de consolidar. El rigor de mirar el módulo desde 6 ángulos distintos es lo que hace que la evaluación no se quede solo en "¿está bien escrito?" — cubre desde la claridad de objetivos hasta si el instrumento de evaluación realmente mide lo que dice medir.

## Paso 0 — Reunir el paquete del módulo

Antes de evaluar necesitas, en la medida de lo posible: objetivos de aprendizaje, microlecciones/actividades, materiales, instrumentos de evaluación (pruebas, rúbricas, listas de cotejo) y metadatos básicos (público objetivo, duración estimada).

- **Si Ángel pega texto**, trabaja directamente sobre eso.
- **Si sube archivos** (PDF/DOCX/PPTX), usa la skill correspondiente (`pdf`, `pdf-reading`, `docx` o `pptx`) para extraer el contenido antes de empezar a evaluar — no adivines el contenido de un archivo que no has leído.
- **Si falta algo crítico** para juzgar una fase completa (por ejemplo, no hay ningún instrumento de evaluación visible, así que la Fase 3 no se puede calificar con fundamento), dilo explícitamente y pregunta antes de inventar una calificación. Es mejor evaluar con menos fases pero honestamente, dejando claro qué falta, que rellenar huecos con suposiciones. Si el hueco es menor, evalúa igual y anótalo como limitación en la nota del criterio en vez de detener todo el proceso.

## Paso 1 — Ejecutar las 6 fases en orden

Lee `references/criterios-completos.md` para el detalle de cada criterio (descripción, evidencia requerida y qué recomendar si el puntaje sale bajo). Ejecuta las fases en este orden porque las fases 2-5 se apoyan en lo que la Fase 1 normaliza:

1. **Contenido y microlecciones (C1-C3)** — objetivos observables, unidad mínima de microlección, progresión pedagógica.
2. **Taxonomías pedagógicas (P1-P4)** — Bloom, SOLO, Fink, Marzano.
3. **Instrumentos de evaluación (A1-A4)** — adecuación, calidad de rúbrica, validez/confiabilidad, diversidad de evidencias.
4. **UX y atención (U1-U4)** — diseño centrado en el usuario, estrategias de atención, técnicas de recuperación, accesibilidad.
5. **Métricas y analítica (AN1-AN3)** — KPIs, plan de recolección, detección de sesgos.
6. **Humanización de tono (H1-H2)** — ver la sección dedicada más abajo, es la única fase con un paso mecánico distinto.

Para cada criterio: asigna un puntaje 0-4 con base en la evidencia real que tengas delante (no en cómo "debería" ser un buen curso en general), y anota una justificación de una frase. Si vas a recomendar una acción, básate en el "si el puntaje es bajo" de la referencia en vez de inventar una desde cero — están pensadas para ser accionables, no genéricas.

## Paso 2 — Fase 6: humanización de tono

Esta fase tiene una bifurcación según cuánto texto haya que revisar:

- **Si el módulo tiene un documento sustancial de instrucciones/guías para estudiantes** (varios párrafos o más, no solo un par de frases sueltas), invoca la skill `humanizar-texto-es` sobre ese documento en **Modo Informal/divulgativo** — el público son estudiantes, no investigadores. Usa su salida (texto humanizado + análisis de patrones IA) como base real para las plantillas humanizadas del informe y para justificar el puntaje de H1/H2.
- **Si lo que hay son fragmentos cortos** (una instrucción de actividad de una o dos frases, un mensaje de retroalimentación automática), `humanizar-texto-es` no aplica bien — esa skill está pensada para textos de 100+ palabras. En ese caso, genera tú mismo las 3 variantes (formal, cercana, micro-feedback de 1-2 frases) siguiendo el criterio H1/H2, sin invocar la otra skill.
- Si el módulo no trae ningún texto instruccional o de retroalimentación redactado todavía (solo una lista de temas, por ejemplo), la Fase 6 no se puede calificar — dilo y omite H1/H2 del puntaje global en vez de forzar una nota.

## Paso 3 — Consolidar puntaje y priorizar

Usa esta tabla de pesos (ya normalizados, suman 1.0) para el cálculo:

| Criterio | Peso | Criterio | Peso | Criterio | Peso |
|---|---|---|---|---|---|
| C1 | 0.06 | A1 | 0.08 | AN1 | 0.03 |
| C2 | 0.06 | A2 | 0.06 | AN2 | 0.02 |
| C3 | 0.08 | A3 | 0.04 | AN3 | 0.02 |
| P1 | 0.10 | A4 | 0.04 | H1 | 0.03 |
| P2 | 0.08 | U1 | 0.05 | H2 | 0.03 |
| P3 | 0.06 | U2 | 0.05 | | |
| P4 | 0.06 | U3 | 0.04 | | |
| | | U4 | 0.03 | | |

**Fórmula:** `puntaje_global = 100 × [Σ (puntaje_i/4 × peso_i)] / [Σ peso_i de los criterios evaluados]`.

El denominador es intencional y no es solo por si falta algún criterio: si sumas los 20 pesos de la tabla de arriba, el total da 1.02 (no 1.00) — es un desajuste heredado del JSON original de Ángel, probablemente un error de redondeo al distribuir los pesos entre 20 criterios en vez de los ~19 que parece haber tenido en mente. Dividir entre la suma real de pesos usados corrige esto automáticamente sin tener que retocar los pesos individuales de cada criterio (que sí reflejan las prioridades relativas que definió: P1 con más peso que H2, por ejemplo). La misma división resuelve también el caso de fases incompletas: si algún criterio queda sin calificar por falta de evidencia (Paso 0), simplemente no entra en ninguna de las dos sumas — no hace falta un paso de renormalización aparte. Menciona en el resumen ejecutivo si el puntaje se calculó con menos de los 20 criterios.

**Umbrales:** <60 Insuficiente · 60-74 Aceptable · 75-89 Bueno · ≥90 Excelente.

**Prioriza las acciones recomendadas así** (mismo criterio que el diseño original):
- **Alta:** todo lo que afecte validez de la evaluación (A1, A3), alineación pedagógica (P1, P2), o pérdida de atención/accesibilidad (U2, U4).
- **Media:** humanización y claridad (H1), KPIs y análisis (AN1, AN2).
- **Baja/opcional:** el resto — mejoras que suman pero no bloquean nada.

## Paso 4 — Generar la salida

Lee `references/formato-salida.md` para el esquema JSON exacto y la plantilla del informe narrativo. Genera siempre ambos, JSON primero y narrativa después — el JSON es el registro estructurado por si Ángel quiere llevarlo a otro sistema; la narrativa es lo que realmente se lee.

## Antes de dar por cerrada la evaluación

Presenta siempre las recomendaciones como propuestas para que Ángel las apruebe o ajuste — esta skill no debe presentarse como un veredicto final ni aplicar cambios automáticamente al contenido original. Si detectas que el módulo es de otra persona (un compañero, un curso ajeno que está auditando), mantén el tono constructivo: el objetivo es una segunda opinión experta, no una descalificación.
