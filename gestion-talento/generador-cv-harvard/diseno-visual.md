# Sistema de diseño visual — CV one-pager

## Tipografía

- Display / nombre / títulos de sección: Fraunces (Google Fonts) — serif variable, pesos 400-700
- Cuerpo: Inter (Google Fonts) — 400, 500, 600
- Técnico / fechas / etiquetas: IBM Plex Mono (Google Fonts)

## Paleta (usar exactamente estos valores hexadecimales)

```
#171717  Negro editorial   — texto principal, fondos oscuros
#F4EFE6  Crema cálida      — fondo principal (nunca blanco puro)
#B85C38  Terracota         — acento primario, títulos de sección, énfasis
#17324D  Marino profundo   — acento secundario, header, contraste
#6F8F72  Salvia            — acento terciario, etiquetas de estado
```

## Principios de layout

- Página tamaño carta (216mm × 279mm), una sola columna o dos columnas asimétricas según convenga al contenido de esa vacante.
- Header con fondo marino (#17324D), nombre en Fraunces grande, datos de contacto incluyendo el enlace al portafolio (portfolio-angel-alvarez.vercel.app) destacado visualmente — es el sustituto funcional de la fotografía.
- Un solo elemento de color por sección para jerarquía — evitar que la pieza se vea "arcoíris".
- Sin sombras duras, sin gradientes, sin bordes redondeados exagerados (máximo 3-4mm de radio en tarjetas y bloques de sección).
- Tipografía nunca menor a 9pt en el cuerpo del documento final impreso.

## CSS de impresión obligatorio (incluir siempre en el `<head>`)

```css
@page { size: 216mm 279mm; margin: 0; }
.page { width: 216mm; height: 279mm; overflow: hidden; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
```

## Nota sobre identidad visual

No se embebe fotografía en el documento. El enlace al portafolio (incluido en el header) es donde vive la imagen completa de Ángel — proyectos, foto profesional y demos funcionales.
