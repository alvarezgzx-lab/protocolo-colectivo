# Integración con custom runner y MCP

## Flujo mínimo

1. Cargar los cuatro schemas, questions.json y los prompts versionados.
2. Crear adaptadores reales conforme a adapters.md. Mantener handlers en un registro del servidor.
3. Crear Interview(input, questions). Renderizar las diez preguntas exactas, registrar respuestas y presentar summary().text.
4. Recibir Yes/No del usuario autenticado y llamar confirm(respuesta, digest mostrado). digest es una instantánea canónica, **no una firma criptográfica**.
5. Crear makeRuntime(...) con la configuración confirmada y llamar build(input, session).
6. Si status=manual_review, mostrar el reporte y no registrar triggers. Si ready, conservar el objeto emitido y los snapshots.
7. Ante un trigger autorizado, llamar runtime.run(packet, workflowId, payload, context). Validar permisos del usuario en el host.

Ver integrations/node-context.cjs para timeout, cancelación y almacenamiento idempotente en memoria de desarrollo.
En producción sustituir executeOnce por almacén transaccional durable con bloqueo por clave y recuperación de lease.
La clave es run_id + workflow_id + workflow_version + step_id. Reintentos del mismo evento reutilizan run_id.
Eventos diferentes reciben IDs distintos. Rechazar reutilizar run_id con payload distinto.
El proveedor externo debe admitir la misma clave de idempotencia; el runner solo no garantiza exactly-once.
Un handler debe respetar AbortSignal: una Promise cancelada no deshace un efecto externo.

## Triggers

- manual: API autenticada con payload conforme a mcp_schema.
- scheduled: scheduler del host valida cron y zona IANA, crea run_id por instante programado; definir política de solapamiento y backfill.
- webhook: ruta registrada por el host, auth_ref resuelta en vault, verificar firma y deduplicar event_id antes de invocar el runner.

El paquete describe triggers, pero no abre endpoints ni instala agendas por sí solo.
Se puede envolver este servicio en una tarea de Airflow o Prefect: conservar run_id y versiones y desactivar los retries
del orquestador cuando el runner es dueño de los retries. Un único responsable evita multiplicar intentos.
El adaptador específico de Airflow/Prefect no está incluido ni probado; el custom runner es la implementación de referencia.

## Puente MCP

integrations/mcp-tool.cjs proporciona descriptor y función de invocación independientes del SDK.
Registrar el descriptor como herramienta en el SDK MCP del host y retornar el resultado estructurado según su versión negociada.
inputSchema identifica user_instruction/topic y los campos opcionales; outputSchema valida el paquete completo.
El servidor obtiene Interview del contexto autenticado; no acepta un confirmation=true suministrado por el modelo.
La UI de entrevista se aloja fuera de tools/call. Una entrevista pendiente retorna error recuperable y no genera JSON ejecutable.
Errores posteriores a la confirmación retornan el contrato manual_review.
Antes de publicar al cliente, validar output con un validador JSON Schema completo si el host admite esquemas externos.

## Persistencia entre procesos

Por diseño, run() acepta únicamente objetos emitidos y no modificados por la misma instancia.
No confiar en status=ready de un JSON cargado desde disco. Para distribuir:
implementar un servicio emisor que guarde paquete inmutable y recibo firmado (hash, sesión, configuración, gates, versiones y expiración);
el servicio ejecutor verifica firma y vigencia y vuelve a comprobar handlers/permisos/gates requeridas.
Esta extensión distribuida queda como trabajo de integración; no hay bypass para archivos sin recibo.
Para el runner incluido, mantener la instancia emisora como servicio de larga duración.

## Contratos y documentación técnica consultada

Los archivos utilizan la estructura de [JSON Schema 2020-12](https://json-schema.org/draft/2020-12).
La distinción entre schemas de herramientas y contenido estructurado está descrita en las
[herramientas MCP](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx).
Estas referencias técnicas no son resultados de RAG de un workflow y no se añaden a retrieval_provenance.
