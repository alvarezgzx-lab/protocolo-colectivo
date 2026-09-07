# Protocolo CoLectivo

**Skills y flujos de trabajo con IA para la investigación, gestión estratégica del talento, diseño de experiencias de aprendizaje y analítica de datos.**

[![Licencia: CC BY-NC 4.0](https://img.shields.io/badge/Licencia-CC%20BY--NC%204.0-lightgrey.svg)](./LICENSE.md)
[![Hecho para Claude](https://img.shields.io/badge/Hecho%20para-Claude-D97757.svg)](https://claude.com)

Repositorio de herramientas construidas sobre modelos de lenguaje (Claude) que codifican metodologías propias en economía de la educación, gestión del talento y diseño instruccional. Cada skill automatiza un flujo de trabajo específico, combinando marcos teóricos reconocidos con estándares técnicos del sector.

Parte del ecosistema de proyectos de **Casa CoLectiva**.

---

## Índice

- [Estructura del repositorio](#estructura-del-repositorio)
- [Skills disponibles](#skills-disponibles)
  - [Gestión Estratégica del Talento](#gestión-estratégica-del-talento)
  - [Diseño de Experiencias de Aprendizaje](#diseño-de-experiencias-de-aprendizaje)
  - [Investigación](#investigación)
  - [Analítica de Datos](#analítica-de-datos)
- [Convenciones de este repositorio](#convenciones-de-este-repositorio)
- [Cómo instalar una skill](#cómo-instalar-una-skill)
- [Cómo se agregan nuevas skills](#cómo-se-agregan-nuevas-skills)
- [Licencia](#licencia)

## Estructura del repositorio

Las skills se agrupan por dominio funcional. Cada dominio es una carpeta en la raíz con su propio índice; cada skill vive en su propia subcarpeta con su `SKILL.md` (la definición que Claude consume) y un `README.md` (documentación para humanos).

```
protocolo-colectivo/
├── README.md                              ← este archivo (índice general)
├── LICENSE.md
├── gestion-talento/
│   ├── README.md
│   ├── workforce-planning-brief/
│   │   ├── README.md
│   │   ├── SKILL.md
│   │   └── ...
│   └── generador-cv-harvard/
│       ├── README.md
│       ├── SKILL.md
│       └── ...
├── diseno-experiencias-aprendizaje/
│   ├── README.md
│   ├── guion-instruccional-adaptativo/
│   │   ├── README.md
│   │   ├── SKILL.md
│   │   └── ...
│   └── evaluador-di-rubrica/
│       ├── README.md
│       ├── SKILL.md
│       └── ...
├── investigacion/
│   ├── README.md
│   └── analista-actividades-curso/
│       ├── README.md
│       └── SKILL.md
└── analitica-datos/
    └── README.md                          ← categoría reservada, aún sin skills
```

## Skills disponibles

### Gestión Estratégica del Talento

Conectan la estrategia de negocio con decisiones de talento, desde planeación organizacional hasta la presentación de una candidatura individual.

| Skill | Descripción |
|---|---|
| [`workforce-planning-brief`](./gestion-talento/workforce-planning-brief/) | Construye un Strategic Workforce Planning Brief (Scope, Assumptions & Constraints, Risks & Mitigations, Success Criteria) mediante un proceso gated de 7 fases, con soporte para retomar el trabajo entre sesiones vía archivo de estado. |
| [`generador-cv-harvard`](./gestion-talento/generador-cv-harvard/) | Genera un CV de una página adaptado a una vacante específica, siguiendo el estándar Harvard OCS y optimizado para sistemas ATS. |

### Diseño de Experiencias de Aprendizaje

Codifican metodología de Learning Experience Design (LXD): del storyboard de un curso adaptativo a la auditoría pedagógica de un módulo ya construido.

| Skill | Descripción |
|---|---|
| [`guion-instruccional-adaptativo`](./diseno-experiencias-aprendizaje/guion-instruccional-adaptativo/) | Diseña storyboards completos de cursos e-learning adaptativos: marco LXD de 7 fases, rutas de decisión y checkpoints, etapas de Merrill, analítica xAPI y estándares CONOCER/EC1691 con enfoque DUA. |
| [`evaluador-di-rubrica`](./diseno-experiencias-aprendizaje/evaluador-di-rubrica/) | Audita módulos y secuencias didácticas mediante una rúbrica de 20 criterios ponderados que integra Bloom, SOLO, Fink y Marzano, junto con criterios de microaprendizaje, evaluación, UX y analítica. |

### Investigación

Procesan material de origen para producir salidas estructuradas: transcripción fiel, síntesis y prompts derivados.

| Skill | Descripción |
|---|---|
| [`analista-actividades-curso`](./investigacion/analista-actividades-curso/) | Procesa actividades prácticas de cursos o bootcamps (lecturas, proyectos, PDFs) y entrega transcripción, resumen ejecutivo, prompts avanzados de IA e ideas de extensión. |

### Analítica de Datos

_Categoría reservada — ver [`analitica-datos/README.md`](./analitica-datos/README.md). Aún no tiene skills publicadas._

## Convenciones de este repositorio

- **Una carpeta por skill**, dentro de la carpeta de su dominio funcional.
- **`SKILL.md` es la fuente de verdad para Claude** (frontmatter `name` + `description`, seguido de las instrucciones). No se edita su formato para "verse mejor" en GitHub — es un artefacto funcional, no solo documentación.
- **`README.md` es para humanos**: qué hace la skill, cómo se activa, qué archivos la componen, cómo instalarla.
- **Datos personales o sensibles nunca se commitean.** Si una skill requiere un archivo con datos reales del usuario (ver `generador-cv-harvard/cv-maestro.md`), ese archivo va al `.gitignore` y se documenta con un `*.example.md` de plantilla.
- **Sin carpetas de evaluación/datos de curso** (`evals/`, casos de estudio con PDFs de terceros, etc.) salvo que se indique explícitamente — este repo distribuye las skills, no el material de los cursos donde se diseñaron.

## Cómo instalar una skill

Cada skill es independiente y se instala copiando su carpeta completa al directorio de skills de tu instalación de Claude. Los detalles específicos (archivos de configuración, dependencias entre skills, comandos rápidos) están en el `README.md` de cada una — consulta las tablas de arriba.

## Cómo se agregan nuevas skills

1. Nueva carpeta dentro del dominio funcional que corresponda (o un nuevo dominio, si ninguno de los cuatro aplica).
2. `SKILL.md` + `README.md` propios, siguiendo el patrón de las skills existentes.
3. Fila nueva en la tabla del dominio correspondiente (`<dominio>/README.md`) y en este README general.
4. Si la skill maneja datos personales o sensibles, exclusión explícita vía `.gitignore` + plantilla de ejemplo, igual que `generador-cv-harvard`.

## Licencia

Este repositorio está licenciado bajo **CC BY-NC 4.0** — ver [`LICENSE.md`](./LICENSE.md). Puedes usar y adaptar estas skills dando crédito, pero no con fines comerciales sin autorización expresa.
