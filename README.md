# Lumos

Pon luz a lo que sientes. App web privada de bienestar emocional (PWA) para instalar en el iPhone desde Safari.

- Versión 1.4.0
- Funciona sin conexión. Los datos solo se guardan en el móvil (claves `lumos:`).
- Abrir: https://kaki12121215-ux.github.io/lumos/

## Qué hay dentro

- `index.html`: la página que se abre.
- `sw.js`: el service worker, que guarda la app para usarla sin conexión (caché `lumos-1.4.0`).
- `manifest.webmanifest`: nombre, colores e iconos para instalarla en el iPhone.
- `css/lumos.css`: todo el diseño, en claro y en oscuro.
- `js/`: el código, sin librerías externas.
  - `base.js`: datos, guardado, iconos y animaciones comunes.
  - `palabras.js`: las palabras del mapa de emociones.
  - `contenidos.js`: niveles, síntomas, ideas del plan, recursos, trampas y frases.
  - `pdf.js`: crea el informe en PDF.
  - `graficas.js`: gráficas del ánimo.
  - `senales.js`: señales tempranas, fases y lo aprendido.
  - `app.js`: arranque, pestañas y navegación entre pantallas.
  - `intro.js`: la animación al abrir y el logo de la cabecera.
  - `cristal.js`: el cristal líquido (lentes, botones y hojas de cristal), a partir de la técnica de @zakisheriff/liquid-glass (MIT).
  - `p_*.js`: las pantallas (inicio, hoy, ánimo, recursos, patrones, cuidarte y las nuevas).
  - `demo.js`: los datos de prueba.
- `fuentes/`: Gloock y Work Sans, con sus licencias OFL.
- `iconos/`: iconos de la app.
- `.nojekyll`: hace que GitHub Pages sirva los archivos tal cual.

El repositorio solo tiene datos de ejemplo. Los datos reales nunca salen del móvil.
