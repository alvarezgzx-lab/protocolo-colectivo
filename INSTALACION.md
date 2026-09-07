# Instalación y personalización de skills

Todas las skills de este repositorio se distribuyen como **plantillas genéricas**: no contienen nombres, historiales laborales, ni preferencias de trabajo de nadie en particular. Donde la skill original necesitaba ese tipo de contexto para funcionar bien, queda un marcador explícito:

```
[PERSONALIZAR: descripción de qué información falta]
```

Antes de usar una skill en serio, tienes que resolver sus marcadores. Hay dos formas de hacerlo.

## Opción A — Resolverlos tú mismo

Abre el `SKILL.md` de la skill, busca cada `[PERSONALIZAR: ...]` y reemplázalo directamente con tu información real. Es la vía más rápida si son uno o dos marcadores simples (ver la tabla de cada skill en su propio `README.md`, sección "Cómo instalarla").

## Opción B — Protocolo de personalización con Claude (recomendado)

Para skills con varios marcadores, o cuando quieres que la personalización sea consistente en todo el archivo (tono, ejemplos, terminología), es mejor pedirle a Claude que lo haga por ti mediante una entrevista corta. Usa el siguiente protocolo:

1. Abre una conversación nueva con Claude (Claude.ai, Claude Code, o donde vayas a instalar la skill).
2. Copia el contenido completo del `SKILL.md` de la skill que quieres personalizar (y de cualquier archivo en su carpeta `references/` que también tenga marcadores — revisa el README de la skill para saber cuáles).
3. Pega el prompt de abajo, con el contenido del archivo al final.
4. Responde las preguntas que Claude te haga en un solo turno.
5. Guarda el archivo que Claude te devuelva como `SKILL.md` (sobrescribiendo la plantilla), en la misma carpeta.

### El prompt

```
Eres un asistente experto en ingeniería de prompts. Te voy a compartir el
contenido completo de un archivo SKILL.md (y, si aplica, sus archivos de
references/) de una skill de Claude que es una plantilla genérica. Quiero
que la personalices a mi contexto real siguiendo este protocolo:

1. Lee el archivo completo antes de proponer ningún cambio. No asumas su
   contenido a partir del nombre de la skill.
2. Localiza cada marcador de personalización, escrito como
   [PERSONALIZAR: descripción], y cualquier otro punto donde el texto
   asuma un contexto, preferencia o campo profesional específico que no
   es el mío.
3. Ejecuta un protocolo de investigación breve: hazme, en un solo turno,
   las preguntas mínimas necesarias para resolver cada marcador que
   encontraste — nunca más de lo necesario, y agrupadas, no una por una.
   Para cada pregunta, indica a qué marcador o sección corresponde.
   Ejemplos de lo que normalmente hace falta preguntar (ajusta a lo que
   realmente encuentres en el archivo):
   - Cómo quiero que se me llame o refiera dentro de la skill.
   - Mi campo profesional o rol, y las categorías/"tracks" relevantes a
     mi trabajo (si la skill asume categorías de otro campo).
   - Preferencias de trabajo que la skill fija como regla (ej. palabra
     disparadora para crear archivos, tono, idioma).
   - Cualquier estándar, marco teórico o herramienta específica que la
     skill asuma y que yo no uso.
4. Espera mis respuestas antes de reescribir nada.
5. Reescribe el archivo completo reemplazando cada marcador con mi
   información real, preservando intacta toda la lógica, reglas y
   estructura que no dependen de contexto personal. No agregues secciones
   nuevas ni cambies el comportamiento de la skill más allá de lo que
   pedí personalizar.
6. Entrega el archivo final listo para guardar como SKILL.md (y los
   archivos de referencia que hayas actualizado), y señala en una lista
   breve qué cambiaste.

Aquí está el archivo a personalizar:

[pega aquí el contenido completo de SKILL.md de la skill]
```

## Por qué funciona así

- **El `SKILL.md` es el artefacto funcional** que Claude lee para saber cómo comportarse — no es solo documentación. Un marcador sin resolver (`[PERSONALIZAR: ...]` visible en el texto) hace que la skill se comporte de forma extraña o genérica hasta que se completa.
- **Cada skill declara sus propios marcadores** en su `README.md` (sección "Cómo instalarla"), así que no necesitas adivinar cuáles tiene una skill nueva.
- **Los datos verdaderamente sensibles no van en marcadores de texto**, van en archivos separados excluidos del repo vía `.gitignore` — ver `gestion-talento/generador-cv-harvard/cv-maestro.md` como ejemplo (tu CV real nunca se sube; se construye localmente a partir de `cv-maestro.example.md`).

## Para instalar una skill una vez personalizada

Copia su carpeta completa (con `SKILL.md` ya personalizado, y `references/`/`assets/` si los tiene) al directorio de skills de tu instalación de Claude. No hace falta ningún paso adicional — Claude detecta la skill por su frontmatter (`name` + `description`).
