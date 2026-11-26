# Atlas

© 2026 **Adela Moreno Vega** y **Carlos Moreno Otto**. Todos los derechos reservados (ver [LICENSE](LICENSE)).

App para aprender las provincias de España, sus capitales y comunidades jugando con el mapa: explorar, repasar, practicar (dónde está, cuál es, capitales, gentilicios, siluetas) y retos (contrarreloj y duelo). Desde la 3.7 tiene también el mapa de **Europa** (45 países, con zonas Unión Europea y regiones de la ONU) y el modo **Banderas**; se elige arriba, «España / Europa». Desde la 3.8, también el mapa de **América** (35 países: Norte, Central, Caribe y Sur, con la zona «Habla hispana»). Desde la 3.9, también **Asia** (47 países), **África** (54) y **Oceanía** (14). Desde la 4.2 se llama **Atlas** y España se puede jugar por **provincias** o por **comunidades autónomas** (`?mapa=comunidades`). Se puede instalar en el móvil y funciona sin conexión.

Se publica con GitHub Pages: https://indalo-apps.github.io/atlas/

## Cómo está hecha (desde la 5.0)
- **`src/`** son las piezas de la app: `plantilla.html`, `cuerpo.html`, `css/` y `js/` (numerados en el orden en que se cargan). **No se edita `index.html` a mano**: se construye con `node herramientas/construir.js` (y `--ver` comprueba que está al día).
- **Cada mapa carga solo sus datos** (`src/js/cargador.js`): `espana.js` (provincias y comunidades), `europa.js`, `america.js`, `asia.js`, `africa.js` y `oceania.js`. Lo propio de cada mapa (textos, zonas, puntos, capitales…) está en su **ficha**, en `FICHAS` (`src/js/01-datos.js`).
- **Datos de los mapas**: `herramientas/continente.js` genera Europa y los continentes (países en `herramientas/paises.js`; Europa: `node herramientas/continente.js eu 0.2 europa.js EU Europa`); `herramientas/espana.js` genera `espana.js` (los ríos se conservan del archivo anterior, porque su fuente no está en npm). Necesitan `npm i world-atlas es-atlas topojson-client topojson-server topojson-simplify polygon-clipping d3-geo flag-icons`.
- **Versión nueva**, en un paso: `node herramientas/version.js 5.0.1 "🛠️ Arreglado…" "✨ Nuevo…"` (cambia `app-version`, `CACHE` de `sw.js` y `NOVEDADES`, y reconstruye).
- **Pruebas**: `pruebas/partidas.py` (juega todos los modos en los 7 mapas) y `pruebas/actualizacion.py` (una versión nueva no corta una partida ni sus resultados); con un servidor local `python3 -m http.server 8765`. Deben acabar en «TOTAL ERRORES: 0».
- **Publicar**: al subir a `main`, GitHub Actions (`.github/workflows/publicar.yml`) comprueba `index.html`, pasa las dos pruebas y, solo si salen bien, publica en GitHub Pages.

Enlace directo a cada mapa: `?mapa=provincias`, `comunidades`, `europa`, `america`, `asia`, `africa` u `oceania`. Los móviles que la tengan abierta se actualizan solos, sin cortar una partida a medias.

## Autores
Adela Moreno Vega y Carlos Moreno Otto.

## Fuentes
- Mapa de Europa: [Natural Earth](https://www.naturalearthdata.com/) 1:50m (dominio público), vía world-atlas; Crimea dentro de Ucrania y Chipre entero. Kosovo se dibuja aparte y no se pregunta.
- Mapa de América: Natural Earth 1:50m (dominio público), vía world-atlas, sin Hawái. Groenlandia, Guayana Francesa, Puerto Rico, las Malvinas y los demás territorios no independientes se dibujan de fondo y no se preguntan.
- Regiones de América: geoesquema de la ONU (M49), con México en América Central. Bolivia: se pregunta Sucre (capital constitucional); el Gobierno está en La Paz.
- Mapas de Asia, África y Oceanía: Natural Earth 1:50m (dominio público), vía world-atlas; Somalilandia dentro de Somalia; Taiwán, el Sáhara Occidental y los territorios no independientes se dibujan de fondo y no se preguntan. Regiones: geoesquema de la ONU (M49). Israel y Palestina no salen en el modo Capitales (capital en disputa). Guinea Ecuatorial: Ciudad de la Paz (capital desde enero de 2026).
- Banderas de las provincias y comunidades de España (`banderas/es/`, en WebP): Wikimedia Commons, vía [iso3166-flag-icons](https://github.com/amckenna41/iso3166-flag-icons) de Andrew McKenna (MIT). Alicante, Castellón, Valencia y A Coruña no tienen bandera provincial y no se preguntan; algunas provincias usan la bandera de su diputación.
- Regiones de Europa: geoesquema de la ONU (M49); Chipre, en Europa del Sur.
- Mapa de España: [es-atlas](https://github.com/martgnz/es-atlas) (IGN); países vecinos y ríos, Natural Earth.
- Banderas: [flag-icons](https://github.com/lipis/flag-icons) de Panayiotis Lipiridis, licencia MIT (`banderas/LICENSE-flag-icons.txt`); las 16 con escudo detallado, convertidas a WebP para que pesen menos.

## Licencia
Todos los derechos reservados. Se permite usar la app publicada con fines personales y educativos; no se permite copiar, modificar ni distribuir el código o los contenidos sin autorización de los autores. Texto completo en [LICENSE](LICENSE).

## Aviso
Esta app es una ayuda para repasar y puede contener errores. En caso de error o duda, la fuente fiable es el material oficial de la asignatura (libro de texto y apuntes del profesorado).
