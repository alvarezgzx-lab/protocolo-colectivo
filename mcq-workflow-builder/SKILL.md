---
name: mcq-workflow-builder
description: Convierte instrucciones vagas en 1–3 workflows JSON repetibles mediante entrevista Q1–Q10 y confirmación Yes/No, recuperación autorizada, atribución y gates bloqueantes. Úsala para diseñar flujos ejecutables, no para redactar únicamente artefactos estáticos.
---

# MCQ Workflow Builder

Versión de skill y prompts: 1.0.0. Contratos: JSON Schema 2020-12.
Construir esta skill no equivale a contestar la entrevista para un workflow real.

## Entrevista obligatoria

1. Leer [questions.json](references/questions.json). Mostrar Q1–Q10 **literalmente**, con todas sus opciones, en orden. Puede dividirse en tandas; no sustituirlas por preguntas genéricas ni omitir opciones.
2. Guardar cada elección, respuesta literal, texto de Otro y confidence high/med/low. Confidence describe certeza de interpretación, no confiabilidad factual. Nunca inventar respuestas.
3. Presentar el resumen completo y preguntar: **¿Confirmas este resumen? Yes/No**. Un No permite editar. Cualquier edición de respuestas o del encargo invalida el Yes. No aceptar el silencio como confirmación.
4. Antes del Yes vigente: solo conversación, estado de entrevista y aclaraciones. No llamar retrieval ni generación, ni emitir workflows JSON ejecutables. La API de entrevista es infraestructura interna.
5. Q3 D requiere sugerir un nivel y que el usuario seleccione A/B/C antes del nuevo resumen. Mantener la respuesta original en el historial de auditoría. Q10 C se conserva como opción exacta pero entra en conflicto con atribución obligatoria: explicar el conflicto, pedir A/B y reconfirmar.
6. Si faltan región local, aplicabilidad o especificación de Otro, aclararlas sin modificar Q1–Q10. No asumir México. Confirmar esas decisiones junto al encargo.

El host conserva la sesión y recibe la confirmación de la UI autenticada. El modelo nunca puede llamar confirm() en nombre del usuario. [runtime.cjs](scripts/runtime.cjs) implementa el bloqueo.

## Pipeline posterior al Yes

Leer [policies.md](references/policies.md) y [adapters.md](references/adapters.md).
Usar los prompts versionados de [prompts/](prompts/).

1. **MCP preprocessor:** validar input y MCQ. Contar tokens con tokenizer del modelo, incluyendo instrucciones, evidencia y reserva de salida. Si excede, pedir recorte o proponer summarization_mode; confirmar de nuevo cualquier cambio de alcance. Generar 3–5 queries distintas.
2. **RAG:** búsqueda sparse y dense en conector autorizado, fusión RRF y hasta cinco hits reales por query. Conservar consultas, rankings, pasajes, identidad, fecha y hash. No llenar cinco resultados con inventos. Offline exige índice local real.
3. **Attribution QA:** inventariar claims del plan, enlazar pasajes y verificar entailment. Volver a hacerlo sobre el texto final después de generar: el primer pase no cubre afirmaciones nuevas.
4. **Generación:** crear 1–3 workflows internos según workflow_count (1 por defecto). Usar handlers registrados, referencias resolubles, entradas/salidas tipadas, triggers, retry_policy, timeout, versiones, auditoría y gates. Q5 B/C incluye prompt_spec dentro del wrapper; nunca devolver solo un prompt.
5. **QA:** PII, fairness, roles, hasta tres riesgos de self-critique con mitigación, calibración de longitud y validación estructural/semántica. Resolver riesgos antes de publicar.
6. **Publicación:** solo si todas las gates críticas pasan, entregar status ready con 1–3 workflows. Ante fallo, descartar los borradores ejecutables del paquete y devolver status manual_review, workflows [] y reporte accionable. Nunca presentar un placeholder como evidencia verificada.

## Contrato y ejecución

Los ocho campos solicitados están presentes siempre después de la entrevista: mcq_responses, verification_summary, workflows, retrieval_provenance, validation_flags, manual_review_report, confidence_note y manual_review_template.
confidence_note es un array de 3–5 líneas. report es null en ready. Ver [output.schema.json](schemas/output.schema.json).
Los tests solicitados por Q5 C incluyen caso positivo y negativo por workflow.

El runner de referencia ejecuta secuencialmente solo paquetes emitidos por su instancia y no modificados.
No ejecutar automáticamente por el hecho de generar un paquete: los permisos operativos pertenecen al host.
Leer [integration.md](references/integration.md) para el custom runner y el puente MCP; ahí se explican los límites de producción.
Las muestras son sintéticas, no resultados de retrieval real. Consultar [ejemplos](examples/README.md) y ejecutar [tests](tests/runtime.test.cjs).
