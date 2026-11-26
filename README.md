# Atlas

© 2026 **Adela Moreno Vega** y **Carlos Moreno Otto**. Todos los derechos reservados (ver [LICENSE](LICENSE)).

App para aprender las provincias de España, sus capitales y comunidades jugando con el mapa: explorar, repasar, practicar (dónde está, cuál es, capitales, gentilicios, siluetas) y retos (contrarreloj y duelo). Desde la 3.7 tiene también el mapa de **Europa** (45 países, con zonas Unión Europea y regiones de la ONU) y el modo **Banderas**; se elige arriba, «España / Europa». Desde la 3.8, también el mapa de **América** (35 países: Norte, Central, Caribe y Sur, con la zona «Habla hispana»). Desde la 3.9, también **Asia** (47 países), **África** (54) y **Oceanía** (14). Desde la 4.2 se llama **Atlas** y España se puede jugar por **provincias** o por **comunidades autónomas** (`?mapa=comunidades`). Se puede instalar en el móvil y funciona sin conexión.

Se publica con GitHub Pages: https://indalo-apps.github.io/atlas/

Para sacar una versión nueva: subir el número en `<meta name="app-version">` (index.html) y en `CACHE` (sw.js), y añadir sus novedades en `NOVEDADES`.

El mapa de Europa está en `europa.js` (países, capitales y fronteras) y las banderas en `banderas/`. El de América está en `america.js`. Enlace directo a cada mapa: `?mapa=espana`, `europa`, `america`, `asia`, `africa` u `oceania` (datos en `asia.js`, `africa.js` y `oceania.js`). Los móviles que la tengan abierta se actualizan solos, sin cortar una partida a medias.

## Autores
Adela Moreno Vega y Carlos Moreno Otto.

## Fuentes
- Mapa de Europa: [Natural Earth](https://www.naturalearthdata.com/) 1:50m (dominio público), vía world-atlas; Crimea dentro de Ucrania y Chipre entero. Kosovo se dibuja aparte y no se pregunta.
- Mapa de América: Natural Earth 1:50m (dominio público), vía world-atlas, sin Hawái. Groenlandia, Guayana Francesa, Puerto Rico, las Malvinas y los demás territorios no independientes se dibujan de fondo y no se preguntan.
- Regiones de América: geoesquema de la ONU (M49), con México en América Central. Bolivia: se pregunta Sucre (capital constitucional); el Gobierno está en La Paz.
- Mapas de Asia, África y Oceanía: Natural Earth 1:50m (dominio público), vía world-atlas; Somalilandia dentro de Somalia; Taiwán, el Sáhara Occidental y los territorios no independientes se dibujan de fondo y no se preguntan. Regiones: geoesquema de la ONU (M49). Israel y Palestina no salen en el modo Capitales (capital en disputa). Guinea Ecuatorial: Ciudad de la Paz (capital desde enero de 2026).
- Banderas de las provincias y comunidades de España (`banderas/es/`, en WebP): Wikimedia Commons, vía [iso3166-flag-icons](https://github.com/amckenna41/iso3166-flag-icons) de Andrew McKenna (MIT). Alicante, Castellón, Valencia y A Coruña no tienen bandera provincial y no se preguntan; algunas provincias usan la bandera de su diputación.
- Regiones de Europa: geoesquema de la ONU (M49); Chipre, en Europa del Sur.
- Banderas: [flag-icons](https://github.com/lipis/flag-icons) de Panayiotis Lipiridis, licencia MIT (`banderas/LICENSE-flag-icons.txt`).

## Licencia
Todos los derechos reservados. Se permite usar la app publicada con fines personales y educativos; no se permite copiar, modificar ni distribuir el código o los contenidos sin autorización de los autores. Texto completo en [LICENSE](LICENSE).

## Aviso
Esta app es una ayuda para repasar y puede contener errores. En caso de error o duda, la fuente fiable es el material oficial de la asignatura (libro de texto y apuntes del profesorado).
