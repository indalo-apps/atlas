# Atlas de Provincias

© 2026 **Adela Moreno Vega** y **Carlos Moreno Otto**. Todos los derechos reservados (ver [LICENSE](LICENSE)).

App para aprender las provincias de España, sus capitales y comunidades jugando con el mapa: explorar, repasar, practicar (dónde está, cuál es, capitales, gentilicios, siluetas) y retos (contrarreloj y duelo). Desde la 3.7 tiene también el mapa de **Europa** (45 países, con zonas Unión Europea y regiones de la ONU) y el modo **Banderas**; se elige arriba, «España / Europa». Se puede instalar en el móvil y funciona sin conexión.

Se publica con GitHub Pages: https://indalo-apps.github.io/atlas-provincias/

Para sacar una versión nueva: subir el número en `<meta name="app-version">` (index.html) y en `CACHE` (sw.js), y añadir sus novedades en `NOVEDADES`.

El mapa de Europa está en `europa.js` (países, capitales y fronteras) y las banderas en `banderas/`. Enlace directo a cada mapa: `?mapa=europa` o `?mapa=espana`. Los móviles que la tengan abierta se actualizan solos, sin cortar una partida a medias.

## Autores
Adela Moreno Vega y Carlos Moreno Otto.

## Fuentes
- Mapa de Europa: [Natural Earth](https://www.naturalearthdata.com/) 1:50m (dominio público), vía world-atlas; Crimea dentro de Ucrania y Chipre entero. Kosovo se dibuja aparte y no se pregunta.
- Regiones de Europa: geoesquema de la ONU (M49); Chipre, en Europa del Sur.
- Banderas: [flag-icons](https://github.com/lipis/flag-icons) de Panayiotis Lipiridis, licencia MIT (`banderas/LICENSE-flag-icons.txt`).

## Licencia
Todos los derechos reservados. Se permite usar la app publicada con fines personales y educativos; no se permite copiar, modificar ni distribuir el código o los contenidos sin autorización de los autores. Texto completo en [LICENSE](LICENSE).

## Aviso
Esta app es una ayuda para repasar y puede contener errores. En caso de error o duda, la fuente fiable es el material oficial de la asignatura (libro de texto y apuntes del profesorado).
