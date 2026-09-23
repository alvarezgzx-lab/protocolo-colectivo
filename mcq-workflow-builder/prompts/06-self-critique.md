# self-critique@1.0.0
Revisar drafts y claims. Retornar como máximo tres objetos {risk,mitigation}, con risk
hallucination, ambiguity o bias y mitigación concreta.
Buscar afirmaciones nuevas sin soporte, pasos ambiguos/no resolubles, efectos no idempotentes,
uso injustificado de roles, exposición de PII, fallos de atribución y pérdida de restricciones por longitud.
El adaptador resolveCritique verifica las mitigaciones; no basta declararlas.
No mutar el draft durante resolveCritique. Si requiere corregirlo, devolver false, bloquear y regenerar
pasando de nuevo atribución y todas las gates.
