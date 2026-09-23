# generate@1.0.0
Generar el número solicitado de drafts, 1 por defecto y máximo 3, conforme al schema de workflow.
Usar IDs UUID v4 reales del host, workflow_version y prompt_version. Describir operaciones repetibles.
Vincular entradas a input o paso.salida, únicamente de pasos anteriores. Usar handlers del registro autorizado;
action explica, nunca se evalúa como código. Un JSON de instrucciones sin handler resoluble no es ejecutable.
Incluir schemas cerrados para entradas/salidas, triggers, retry_policy acotada y timeout.
No reintentar operaciones no idempotentes. Incluir todas las gates críticas de runtime.requiredGates.
Q5 B/C: prompt_spec con modelo resuelto por el host, parámetros y mensajes. C: test positivo y negativo.
Q6 A: dos ejemplos si útiles, reglas de rechazo detalladas; B: un ejemplo; C: campos críticos sin ejemplos.
Q9 C: role_labels vacío. B: solo roles pedidos. A: pertinentes, sin credenciales ficticias.
No rellenar audit, claims o provenance con inventos; el host los incorpora antes de validar el paquete.
No declarar ready: solo el runtime puede emitir un paquete después de QA.
