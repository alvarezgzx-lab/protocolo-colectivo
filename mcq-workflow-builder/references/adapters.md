# Contratos de adaptadores

makeRuntime(schemas, questions, adapters, config) requiere adaptadores confiables del host.
No exponerlos como objetos editables por el LLM ni como flags enviados por un cliente.
La suite contiene implementaciones sintéticas deliberadamente permisivas; nunca importarlas en producción.

## Configuración vinculada a la entrevista

config: test_mode=false, author, prompt_version, prompt_bundle (texto completo), output_reserve_tokens,
safety_tokens, domain_filters, local_region, local_applicability (applicable/not_applicable),
requested_roles (derivado de input.preferred_roles), custom_format_resolved.
Resolver y mostrar decisiones de configuración en el encargo antes del Yes. Una modificación exige crear/reconfirmar sesión.
La aplicación debe inmovilizar esta configuración durante build/run.

## Funciones y responsabilidades

| Función | Entrada / retorno | Obligación |
|---|---|---|
| now() | ISO-8601 UTC string | Reloj del servidor |
| countTokens(text) | entero | Tokenizer del modelo; nunca aproximación en producción |
| audit(event) | Promise<void> | Registro durable, acceso restringido, sin secretos ni PII innecesaria |
| safety(input) | {allowed:boolean} | Política real; no aceptar automáticamente |
| queries({input,answers,policy}) | string[3..5] | Consultas derivadas de MCQ, sin ejecutarlas aquí |
| retrieval.sparse(query,opts) | source[] | Búsqueda léxica en índice/servicio real |
| retrieval.dense(query,opts) | source[] | Embeddings con modelo e índice versionados |
| verifySource(source,policy) | {authorized,content_matches,identity_verified} | Comprobación independiente; valores booleanos reales |
| verifyCanonicalCitation(old,review) | boolean | Revisión reciente cita la fuente canónica |
| plan({input,answers,provenance}) | objeto | Plan con inventario factual inicial |
| attribute({draft,provenance}) | {complete_inventory,claims} | Inventario completo, entailment, referencias y ubicación |
| generate(context) | workflow[1..3] | Borradores conforme a schema; sin inventar provenance |
| privacyAndFairness({input,drafts}) | {pii_pass,bias_pass,risk} | Riesgo low/med/high, revisión contextual |
| critique({input,drafts,claims}) | {risk,mitigation}[0..3] | Riesgos hallucination/ambiguity/bias |
| resolveCritique(critique,drafts) | boolean | Verifica resolución; no muta borradores |
| validateRunOutput({workflow,result}) | boolean | Repite atribución/PII/fairness/longitud sobre la salida real |
| handlers[versioned_name](args,ctx) | objeto | Handler allowlisted, valida permisos, aplica AbortSignal y timeout |

retrieval tiene además id, mode=online/offline, index_version. opts contiene allowed_types,
domain_filters, local_region, local_preference, allow_network, limit. En offline, el host debe bloquear acceso
de red también para embeddings. No basta con pasar allow_network=false.

source sigue $defs/source: id, title, author, year, domain, url, snippet, passage, score,
source_type, region, content_hash, retrieved_at, record_kind, verified, canonical, recent_review_id.
Calcular content_hash como SHA-256 del contenido canónico. Agrupar versiones/republicaciones.
El runtime aplica fusión RRF con k=60, deduplica IDs y conserva top-5 como máximo, priorizando locales con Q4 A.
Los resultados rechazados se auditan; no se convierten en hits válidos.

claims sigue $defs/claim. json_pointer identifica el texto factual dentro del array final, por ejemplo /0/description.
En el pase de plan la ubicación puede referirse al plan. El pase final debe incluir todas las afirmaciones
factuales de descripciones, acciones, prompts y ejemplos, excluyendo cadenas de provenance que son evidencia.
SUPPORTED exige source_ids y passage_quotes correspondientes; UNSUPPORTED requiere inference y explanation si la política lo permite.
El chequeo local confirma presencia del pasaje, no entailment: esa responsabilidad recae en attribute.
No fabricar claims vacíos para conseguir complete_inventory=true.

## Auditoría y persistencia

Persistir historial de respuestas literales, revisiones, resumen mostrado, Yes/No autenticado, encargo y configuración,
consultas y resultados brutos, pasajes, hashes, decisiones de fuentes, modelo/prompt/tokenizer, resultados de QA y paquete final.
El runtime emite eventos operativos con identificadores. Los adaptadores deben guardar snapshots de las entradas/salidas
de sus llamadas en un almacén durable restringido y asociarlos al session_id/run_id del host.
No poner credenciales en JSON. auth_ref/model_ref son referencias a configuración del servidor.

## Fallos

Lanzar excepción en ausencia de servicio o evidencia. Nunca retornar PASS por defecto.
Solo errores operativos transitorios llevan code TRANSIENT o RATE_LIMIT. Permisos, schemas, atribución y revisión humana no se reintentan.
Cuando el modelo supera contexto, pedir recorte o resumen, mostrar qué se perdió y reconfirmar. El runtime se bloquea; no resume silenciosamente.
