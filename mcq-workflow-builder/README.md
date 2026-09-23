# Paquete de desarrollo: MCQ Workflow Builder

Contiene una skill portable, contratos, núcleo de referencia JavaScript, prompts y pruebas.
No instala servicios ni configura credenciales. Copiar la carpeta completa al directorio de skills del agente para descubrir SKILL.md.

## Inicio

Requiere Node.js con soporte de CommonJS, campos privados y Object.hasOwn (Node 22 o posterior recomendado para este paquete).
Desde esta carpeta:

```sh
node tests/runtime.test.cjs
```

La suite no usa red ni dependencias npm. Los ejemplos producen evidencia sintética solo bajo test_mode.
La ejecución real requiere implementar los adaptadores descritos en references/adapters.md.
El runner no acepta un archivo JSON arbitrario marcado ready: requiere emisión validada en la misma instancia.

## Contenido

- SKILL.md: comportamiento de la skill y entrevista bloqueante.
- references/questions.json: Q1–Q10 copiadas del prompt maestro.
- references/master-prompt.md: texto de origen recuperado.
- schemas/: input, interview, workflow y output en JSON Schema.
- scripts/runtime.cjs: máquina de entrevista, preprocessor, RAG híbrido, QA, gates y runner.
- integrations/: contexto de ejecución Node y puente MCP independiente de SDK.
- prompts/: seis prompts internos versionados.
- tests/: casos positivos y negativos sin servicios externos.
- examples/: casos sintéticos y salida bloqueada sin evidencia.
- validation-report.json: resultados de la comprobación entregada.

Se eligió JSON Schema como contrato canónico; no se mantiene una copia Zod que pueda divergir.
El evaluador integrado cubre el subconjunto cerrado utilizado por el paquete, no la especificación completa.
Para contratos externos, integrar un validador completo y conservar las comprobaciones semánticas.

## Alcance comprobado

Se probaron las funciones JavaScript en un entorno V8 con adaptadores sintéticos.
No había Node/Python accesible en el entorno de construcción; no se ejecutó el CLI Node ni el validador Python de skills.
No se conectó un servidor MCP, un modelo ni un buscador real. El wiring Node/MCP debe verificarse en el entorno de desarrollo.
Los hooks de atribución, privacidad y autorización son fronteras de confianza obligatorias, no verificaciones reales preinstaladas.
