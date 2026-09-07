# Formato de salida: JSON + informe narrativo

Genera SIEMPRE ambas cosas, en este orden: primero el bloque JSON consolidado (para que Ángel pueda copiarlo a otro sistema si lo necesita), después el resumen narrativo en español.

## 1. Esquema JSON consolidado

```json
{
  "modulo_evaluado": "nombre o identificador del módulo/curso",
  "fecha_evaluacion": "YYYY-MM-DD",
  "puntaje_global": 0,
  "categoria": "Insuficiente | Aceptable | Bueno | Excelente",
  "resumen_ejecutivo": "2-4 frases con el diagnóstico general",
  "puntajes_por_criterio": {
    "C1": {"puntaje": 0, "peso": 0.06, "nota": "justificación breve"},
    "C2": {"puntaje": 0, "peso": 0.06, "nota": "..."},
    "C3": {"puntaje": 0, "peso": 0.08, "nota": "..."},
    "P1": {"puntaje": 0, "peso": 0.10, "nota": "..."},
    "P2": {"puntaje": 0, "peso": 0.08, "nota": "..."},
    "P3": {"puntaje": 0, "peso": 0.06, "nota": "..."},
    "P4": {"puntaje": 0, "peso": 0.06, "nota": "..."},
    "A1": {"puntaje": 0, "peso": 0.08, "nota": "..."},
    "A2": {"puntaje": 0, "peso": 0.06, "nota": "..."},
    "A3": {"puntaje": 0, "peso": 0.04, "nota": "..."},
    "A4": {"puntaje": 0, "peso": 0.04, "nota": "..."},
    "U1": {"puntaje": 0, "peso": 0.05, "nota": "..."},
    "U2": {"puntaje": 0, "peso": 0.05, "nota": "..."},
    "U3": {"puntaje": 0, "peso": 0.04, "nota": "..."},
    "U4": {"puntaje": 0, "peso": 0.03, "nota": "..."},
    "AN1": {"puntaje": 0, "peso": 0.03, "nota": "..."},
    "AN2": {"puntaje": 0, "peso": 0.02, "nota": "..."},
    "AN3": {"puntaje": 0, "peso": 0.02, "nota": "..."},
    "H1": {"puntaje": 0, "peso": 0.03, "nota": "..."},
    "H2": {"puntaje": 0, "peso": 0.03, "nota": "..."}
  },
  "hallazgos_criticos": [
    {"criterio": "A1", "hallazgo": "descripción concreta del problema"}
  ],
  "acciones_priorizadas": [
    {"prioridad": "Alta", "criterio": "A2", "accion": "Reescribir rúbrica del proyecto final"},
    {"prioridad": "Media", "criterio": "P3", "accion": "Agregar actividades metacognitivas"},
    {"prioridad": "Baja", "criterio": "U4", "accion": "Optimización opcional de accesibilidad"}
  ],
  "plantillas_humanizadas": [
    {
      "texto_original": "...",
      "version_formal": "...",
      "version_cercana": "...",
      "micro_feedback": "...",
      "justificacion_cambios": "..."
    }
  ],
  "plan_piloto_sugerido": "1-3 frases si A3/AN2 salieron bajos; omitir el campo si no aplica",
  "kpis_y_alertas": [
    {"kpi": "Tasa de finalización", "formula_o_definicion": "...", "umbral_alerta": "..."}
  ]
}
```

**Cálculo del puntaje global:** `100 × [Σ (puntaje_i/4 × peso_i)] / [Σ peso_i de los criterios evaluados]`. Ver SKILL.md (Paso 3) para por qué el denominador no es simplemente 1 — los pesos originales del JSON de Ángel suman 1.02, no 1.00.

**Categoría según el puntaje global:**
| Rango | Categoría |
|---|---|
| < 60 | Insuficiente |
| 60-74 | Aceptable |
| 75-89 | Bueno |
| ≥ 90 | Excelente |

No inventes puntajes: si no hay evidencia suficiente para juzgar un criterio, ponlo en 0-1 y dilo explícitamente en la nota, en vez de asumir un valor intermedio "para no ser injusto". Es preferible que el informe le señale a Ángel qué información falta a que le dé un puntaje optimista sin fundamento.

## 2. Informe narrativo (después del JSON)

Usa esta estructura en Markdown, con prosa natural — no repitas los datos del JSON en tablas idénticas, interprétalos:

```markdown
## Resumen ejecutivo
[2-4 frases de diagnóstico]

## Puntaje global: XX/100 — [Categoría]

## Hallazgos críticos
[Los 2-4 problemas de mayor impacto, explicados con lenguaje llano — por qué importan, no solo qué falló]

## Acciones priorizadas
**Alta prioridad**
- ...
**Media prioridad**
- ...
**Prioridad opcional**
- ...

## Plantillas de texto humanizadas
[Solo si la Fase 6 produjo algo — ver criterio de invocación en SKILL.md]

## Plan piloto sugerido
[Solo si A3 o AN2 salieron por debajo del umbral aceptable]

## KPIs y alertas
[Solo si el módulo llegó lo bastante maduro como para que definir KPIs tenga sentido]
```

Omite cualquier sección que no aplique en vez de rellenarla con contenido genérico — un informe corto y honesto vale más que uno largo y relleno.
