# Ejemplos

Todos los casos son sintéticos. No se hizo retrieval real al construir este paquete.

positive-negative.json contiene entradas y expectativas de un workflow de prueba de transformación.
tests/runtime.test.cjs construye su workflow después de contestar Q1–Q10 y confirmar Yes en una sesión sintética.
La fixture utiliza fixture.invalid y record_kind=synthetic_fixture; producción la rechaza.

blocked-output.json muestra el contrato completo cuando Q10 C entra en conflicto con atribución.
No hay fuentes recuperadas ni workflows. Sus respuestas son una conversación ficticia, no decisiones del usuario actual.

Para observar el camino feliz ejecutar node tests/runtime.test.cjs. El primer test construye, valida y ejecuta
el workflow de mayúsculas; otros tests comprueban gates, errores, Q5 C, reintentos e idempotencia.
