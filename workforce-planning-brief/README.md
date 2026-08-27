# workforce-planning-brief

Skill de Claude para construir un **Strategic Workforce Planning Brief**: Scope, Assumptions & Constraints, Risks & Mitigations, y Success Criteria — conectado explícitamente a la estrategia de negocio mediante el puente Business Strategy → Required Capabilities → Workforce Plan.

## Qué hace

No es un "llenar cuatro secciones en un solo paso". Es un proceso **gated** (con puntos de control) de 7 fases, pensado para evitar los dos errores típicos de un brief hecho de un tirón:

1. Perder la lógica que conecta el plan con la estrategia real de la empresa (el "bridge").
2. Saltarse categorías canónicas que un revisor espera ver cubiertas (los 4 riesgos canónicos, un success criterion SMART por cada brecha de capacidad, etc.).

Fases, en orden:

1. `00-intake/` — Captura de datos mínimos del caso (extraídos de un documento adjunto o preguntados directamente).
2. `01-bridge/` — Business Strategy → Required Capabilities → Workforce Plan. El gate más importante; nada se redacta antes de confirmarlo.
3. `02-scope/` — Redacción de la sección Scope.
4. `03-assumptions-risks/` — Assumptions, Constraints, Risks y Mitigations (los 4 riesgos canónicos: escasez de talento, recortes de presupuesto, baja adopción tecnológica, y attrition inesperado de personas clave).
5. `04-success-criteria/` — Success Criteria SMART, uno por cada brecha de capacidad.
6. `05-audit/` — Matriz de cobertura + lectura adversarial + chequeo de fidelidad al template, antes de generar nada.
7. `06-generate/` — Generación del documento final (usa la skill `docx` si hay un template `.docx`).

## Cómo se activa

- **Arranque en frío**: si no hay `workforce-plan-status.json` en el directorio de trabajo, la skill empieza desde `00-intake/`.
- **Retomando por archivo de estado**: si `workforce-plan-status.json` existe, la skill lo lee, identifica en qué fase quedó (`phase`) y salta directo a esa fase — sin re-ejecutar fases ya marcadas `confirmed: true`.
- **Fase indicada explícitamente por el usuario** (ej. "ya tengo el scope, ayúdame con riesgos"): la skill salta a esa fase, pero si `bridge.confirmed` no es `true` en el archivo de estado, avisa antes de continuar, ya que todo lo demás depende del bridge.

El archivo de estado se crea/actualiza después de cada fase y nunca borra el historial de fases anteriores.

## Cómo instalarla

1. Copia la carpeta `workforce-planning-brief/` (con `SKILL.md`, las subcarpetas `00-intake/` a `06-generate/`, y `reference/`) al directorio de skills de tu instalación de Claude.
2. Verifica que `SKILL.md` mantenga su frontmatter (`name`, `description`) intacto — es lo que permite que Claude la detecte automáticamente.
3. No hace falta configuración adicional; la skill se activa sola cuando el pedido coincide con su `description` (crear/redactar un workforce plan, un planning brief de fuerza laboral, etc.).

## Referencia interna

- `reference/prompts-base.md` — prompts originales sin modificar, punto de partida de cada fase.
- `reference/prompts-amplified.md` — versiones estructuradas que cierran los gaps de cobertura; son las que se usan para generar contenido.
- `reference/framework-checklist.md` — el framework teórico completo en forma de checklist, útil antes de la fase de auditoría.
