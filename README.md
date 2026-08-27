# Mis Skills de Claude

Repositorio personal donde se guardan todas las skills de Claude que voy creando. Cada skill vive en su propia carpeta, con su propio `SKILL.md` y su propio `README.md` explicando qué hace y cómo se usa.

## Skills incluidas

| Skill | Carpeta | Descripción |
|---|---|---|
| workforce-planning-brief | [`workforce-planning-brief/`](./workforce-planning-brief/) | Genera un Strategic Workforce Planning Brief (Scope, Assumptions & Constraints, Risks & Mitigations, Success Criteria) mediante un proceso secuencial "gated" de 7 fases, con soporte para retomar el trabajo entre sesiones vía archivo de estado. |

<!-- Nueva skill: agregar una fila arriba con el mismo formato. -->

## Estructura del repo

```
mis-skills-de-claude/
├── README.md                      ← este archivo
├── workforce-planning-brief/      ← una carpeta por skill
│   ├── README.md
│   ├── SKILL.md
│   └── ...
└── <siguiente-skill>/
    ├── README.md
    ├── SKILL.md
    └── ...
```

## Cómo instalar una skill desde este repo

Cada carpeta de skill contiene su propio `README.md` con instrucciones de instalación específicas.
