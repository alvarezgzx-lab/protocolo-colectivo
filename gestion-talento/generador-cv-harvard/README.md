# generador-cv-harvard

Skill de Claude que genera un **CV de una página adaptado a una vacante específica**, siguiendo el estándar Harvard OCS (Office of Career Services) y optimizado para sistemas de rastreo de candidatos (ATS).

## Qué hace

A partir de la descripción de una vacante pegada en el chat, la skill:

1. Identifica el track profesional de la vacante dentro de tu campo (los tracks se personalizan a tu profesión — ver `SKILL.md`) y pregunta si es ambiguo.
2. Extrae 5-8 requisitos/palabras clave de la vacante.
3. Cruza esos requisitos contra un **CV maestro** (fuente única de verdad, nunca inventa datos) para decidir qué logros, experiencia y habilidades son relevantes.
4. Reescribe el perfil profesional, filtra logros y viñetas de experiencia, y ajusta el orden de secciones según lo que más pese para esa vacante.
5. Entrega el CV como un único **HTML autocontenido** de una página, listo para imprimir a PDF, sin fotografía ni elementos gráficos que comprometan la extracción de texto por ATS.
6. Cierra con un resumen de qué track detectó, qué enfatizó, qué recortó, y qué requisitos de la vacante no tienen respaldo real en el CV maestro (para entrevista, nunca para inventar en el documento).

Reglas duras que aplica siempre: una sola página, orden cronológico inverso, estilo telegráfico en viñetas (sin pronombres, verbo de acción fuerte, tiempo verbal correcto), todo logro cuantificado solo si el CV maestro lo respalda, sin objetivo genérico, selección por relevancia (nunca pega el CV maestro completo).

## Archivos

| Archivo | Rol |
|---|---|
| `SKILL.md` | Definición de la skill: reglas Harvard OCS, proceso de trabajo paso a paso, formato de entrega. |
| `diseno-visual.md` | Sistema de diseño para la versión HTML (tipografía, paleta de color, CSS de impresión obligatorio). |
| `cv-maestro.example.md` | **Plantilla de ejemplo con datos ficticios** — muestra la estructura esperada del CV maestro. |
| `cv-maestro.md` | **No incluido en este repo.** Es tu CV maestro real (nombre, contacto, historial completo) — contiene datos personales y por eso está excluido vía `.gitignore`. Créalo localmente a partir de `cv-maestro.example.md`. |

## Cómo se activa

Se activa cuando pegas la descripción de una vacante y pides un CV, un resumé, o una adaptación de tu currículum a esa vacante. También responde al comando rápido `/reajustar [instrucción]` para aplicar un ajuste puntual sin regenerar el documento completo.

## Cómo instalarla

1. Copia esta carpeta completa a tu directorio de skills de Claude.
2. **Personaliza `SKILL.md`** — tiene un marcador `[PERSONALIZAR: ...]` en el paso 1 del proceso de trabajo (los tracks profesionales de tu vacante). Sigue el protocolo de personalización en [`INSTALACION.md`](../../INSTALACION.md) de la raíz del repositorio, o resuélvelo tú mismo directamente en el archivo.
3. Duplica `cv-maestro.example.md` como `cv-maestro.md` en la misma carpeta y reemplaza cada sección con tus datos reales — esta skill lo carga como fuente de verdad al activarse.
4. Ajusta `diseno-visual.md` si quieres otra tipografía o paleta de color (por defecto: Fraunces + Inter + IBM Plex Mono, paleta editorial crema/terracota/marino), y completa el marcador del enlace a tu portafolio si tienes uno.
5. **Importante:** no elimines la entrada de `cv-maestro.md` en el `.gitignore` de la raíz del repo si vas a hacer fork o clonar este proyecto — evita subir tus datos personales por accidente.
