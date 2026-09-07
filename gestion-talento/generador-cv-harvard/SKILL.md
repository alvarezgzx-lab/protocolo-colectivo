---
name: Generador CV Harvard
description: Genera un CV de una pagina adaptado a una vacante, con el CV maestro de Angel Alvarez y estandar Harvard OCS. Usar cuando pegue una descripcion de vacante y pida un CV o resume.
---

# Generador de CV — Estándar Harvard OCS + Diseño Visual Moderno

## Cuándo se activa este skill

Cuando el usuario pegue la descripción de una vacante y pida un CV, resume, o adaptación de su currículum a esa vacante específica.

## Fuentes que este skill usa

- `cv-maestro.md` — CV completo de Ángel Álvarez (fuente única de verdad; nunca inventar datos fuera de este archivo).
- `diseno-visual.md` — sistema de diseño (tipografía, paleta, CSS de impresión) para la versión HTML de una página.

Carga estos dos archivos al activarse el skill.

## Advertencia sobre fotografía

Este CV sigue el estándar Harvard OCS **sin fotografía** — es la convención correcta para maximizar compatibilidad ATS y evitar sesgos de evaluación. El enlace al portafolio (incluido en el CV maestro) es el sustituto funcional: ahí vive la imagen completa de Ángel.

## Principios Harvard OCS — reglas duras

1. Una sola página, sin excepción.
2. Orden cronológico inverso dentro de cada sección con fechas.
3. Estilo telegráfico en viñetas: sin pronombres personales, verbo de acción fuerte al inicio, tiempo correcto (presente para rol actual, pasado para roles anteriores).
4. Todo logro cuantificado cuando `cv-maestro.md` lo permita — nunca agregar cifras que no existan ahí.
5. Formato consistente: mismo estilo de fecha, misma viñeta, misma tipografía por nivel jerárquico.
6. Sin objetivo genérico — el perfil profesional lo reemplaza.
7. Selección por relevancia, no por volumen — filtrar `cv-maestro.md`, nunca pegarlo completo.
8. Espejear el lenguaje de la vacante solo cuando el hecho subyacente ya existe en `cv-maestro.md`.

## Proceso de trabajo

1. Identifica el track de la vacante: docencia, coordinación/innovación educativa, o capacitación y desarrollo corporativo (L&D). Si es ambiguo, pregunta antes de generar.
2. Extrae 5-8 requisitos/palabras clave de la vacante.
3. Cruza esos requisitos contra `cv-maestro.md` — identifica qué logros, experiencia y habilidades son relevantes; ignora el resto.
4. Decide el orden de secciones según qué le da más peso a esta vacante (el orden por defecto en `cv-maestro.md` es Perfil → Formación → Logros → Experiencia → Habilidades → Idiomas, pero puede reordenarse).
5. Reescribe el Perfil Profesional (3-4 líneas) para esa vacante específica, sin inventar nada.
6. Filtra Logros clave a los 4-5 más relevantes.
7. Filtra y comprime viñetas de Experiencia — cada rol puede bajar de 4-6 viñetas a 2-4; roles menos relevantes se comprimen a una línea.
8. Filtra Habilidades a las 15-20 más relevantes a la vacante.
9. Verifica que todo quepa en una página antes de entregar. Si no cabe, filtra más — nunca reducir tipografía por debajo de 9pt como solución primaria.
10. Genera el documento como HTML autocontenido usando las especificaciones de `diseno-visual.md`.

## Formato de entrega

- Un único archivo HTML, listo para imprimir a PDF (Ctrl+P → tamaño Carta, sin márgenes, gráficos de fondo activados).
- Sin imágenes ni elementos gráficos que comprometan la extracción de texto por ATS.
- Después del documento, entrega un resumen de 3-4 líneas: qué track detectaste, qué enfatizaste, qué recortaste, y si algún requisito de la vacante no tiene respaldo real en `cv-maestro.md` (para carta de presentación o entrevista, nunca para inventar en el CV).

## Comandos rápidos

- `/reajustar [instrucción]` — aplica un ajuste puntual sin regenerar desde cero.
