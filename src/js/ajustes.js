// ===== Ajustes, novedades y búsqueda de versión (como en las demás apps de indalo-apps) =====
(function () {
  const VERSION = document.querySelector('meta[name="app-version"]').content;
  const NOVEDADES = [
    ["5.0", ["⚡ Abre más rápido: cada mapa carga solo sus datos",
             "🪶 Banderas más ligeras",
             "🛠️ Por dentro, la app está ordenada en piezas y se prueba sola antes de publicarse"]],
    ["4.3.2", ["🛠️ Arreglado: al terminar una partida, si había una versión nueva, la app se recargaba y desaparecían los resultados. Ahora espera a que empieces otra"]],
    ["4.3.1", ["🛠️ Arreglado: en Oceanía las partidas se cortaban al empezar",
             "🛠️ Siluetas en Micronesia y Polinesia: sus islas son diminutas, así que se juega con toda Oceanía",
             "🛠️ Gentilicios con la zona Canarias: como sus provincias no tienen gentilicio propio, se juega con toda España (y te lo avisa)"]],
    ["4.3", ["🔗 Nueva dirección: indalo-apps.github.io/atlas. La antigua te trae aquí sola; si la tenías instalada, vuelve a añadirla a la pantalla de inicio desde la nueva"]],
    ["4.2", ["🗺️ ¡Comunidades autónomas! En España, elige «Provincias» o «Comunidades»: encuéntralas, sus capitales, siluetas, gentilicios y banderas",
             "✨ La app se llama ahora «Atlas»: España, Europa y el resto del mundo",
             "🏳️ Explorar avisa de las banderas provinciales que no son oficiales o ya no se usan (Girona, Lleida, Tarragona, Zamora…); esas tres primeras ya no se preguntan"]],
    ["4.1", ["🏳️ Banderas también en España: ¿de qué provincia es? Y, marcando la casilla, las de las 17 comunidades autónomas, Ceuta y Melilla",
             "🔎 En Explorar, al tocar una provincia sale su bandera",
             "ℹ️ Alicante, Castellón, Valencia y A Coruña no tienen bandera provincial y no se preguntan"]],
    ["4.0", ["🏝️ Nuevo en «Elige zona»: «Sin países pequeños» quita los países e islas diminutos (Andorra, Malta, las islas del Caribe y del Pacífico…), si no quieres que salgan"]],
    ["3.9", ["🌍 ¡El mundo entero! Nuevos mapas de Asia (47 países), África (54) y Oceanía (14), con capitales y banderas",
             "🗺️ Cada continente con sus regiones de la ONU como zonas para jugar",
             "🧭 Arriba eliges el mapa: España, Europa, América, Asia, África u Oceanía"]],
    ["3.8", ["🌎 ¡Nuevo mapa de América! Arriba, elige España, Europa o América: 35 países con sus capitales y banderas",
             "🗺️ Zonas de América: toda América, los países de habla hispana (18) o cada región de la ONU (Norte, Central, Caribe y Sur)",
             "💾 Los récords y el repaso de América se guardan aparte"]],
    ["3.7", ["🇪🇺 ¡Nuevo mapa de Europa! Arriba, elige España o Europa: 45 países con sus capitales",
             "🗺️ Zonas de Europa: toda Europa, la Unión Europea (27) o cada región (Norte, Sur, Este y Occidental)",
             "🏳️ Nuevo modo Banderas: ¿de qué país es? Cada bandera se describe también con palabras",
             "💾 Los récords y el repaso de España y de Europa se guardan por separado"]],
    ["3.6.1",["📲 Ayuda para instalar al día con iOS 27: el botón de tres rayas dentro de la barra de la dirección"]],
  ["3.6", ["▶️ Si dejas una partida a medias, el inicio te la muestra arriba con su progreso para seguir con un toque",
             "↻ «Empezar de nuevo» está ahora en la partida y pregunta antes de borrar lo que llevas",
             "⚔️ Duelo tiene su propio botón «Empezar duelo»"]],
    ["3.5", ["👆 Tocar un modo lo empieza directamente",
             "🛟 Si cambias de zona a mitad de partida, te pregunta antes de empezar de nuevo",
             "🏠 Arriba, durante la partida: la zona, el modo en que estás y un botón «Inicio»",
             "🧹 Menos botones repetidos y el aviso de instalar ya no empuja el inicio"]],
    ["3.4", ["📌 La zona y las pestañas se quedan siempre arriba: en el inicio al desplazarte y también durante la partida"]],
    ["3.3", ["🏠 En el móvil, la app se abre en una pantalla de inicio: zona y pestañas arriba, el mapa de la zona y los modos debajo"]],
    ["3.2", ["📍 La zona va arriba del todo: tócala para elegir Toda España o una comunidad",
             "🗂️ Menú más claro con tres pestañas: Aprender, Practicar y Jugar"]],
    ["3.1", ["⚙️ Nuevos Ajustes: instalar la app, autores, aviso y «Buscar actualizaciones»",
             "📲 Ayuda para instalarla con los pasos de tu móvil (iPhone, iPad o Android)",
             "🔄 Comprueba sola si hay versión nueva y te cuenta las novedades, sin cortar una partida",
             "🖼️ Iconos para todos los tamaños e imagen al compartir el enlace"]],
    ["3", ["🎨 Mejoras de diseño y accesibilidad"]]
  ];
  const $ = s => document.querySelector(s);
  $("#verNum").textContent = VERSION;
  const lista = desde => NOVEDADES.filter(([v]) => !desde || IK.verCmp(v, desde) > 0).slice(0, 4)
    .map(([v, it]) => `<h4>Versión ${v}</h4><ul>${it.map(i => `<li>${i}</li>`).join("")}</ul>`).join("");
  function verNovedades(desde) {
    IK.hoja(`<div class="aj"><h2>${desde ? "¡La app se ha actualizado!" : "Novedades"}</h2><div class="nov">${lista(desde)}</div>
      <div class="ik-nav"><button class="ik-btn" data-ik="cerrar">Entendido</button></div></div>`, "Novedades");
  }
  function ajustes() {
    IK.hoja(`<div class="aj"><h2>Ajustes</h2>
      <h3>Instalar en el móvil</h3>
      ${IK.instalada() ? '<p class="ik-muted">✓ Ya la estás usando como app instalada.</p>' : '<button class="ik-btn" id="ajInst">📲 Cómo añadirla a la pantalla de inicio</button>'}
      <h3>Acerca de</h3>
      <div class="ajabout"><img src="icon-192.png" alt=""><div><b>Atlas</b><br><span class="ik-muted">Versión ${VERSION}</span></div></div>
      <p>Creada por <b>Adela Moreno Vega</b> y <b>Carlos Moreno Otto</b>.</p>
      <p class="ik-muted">© ${new Date().getFullYear()} Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados. Uso personal y educativo gratuito.</p>
      <h3>Fuentes</h3>
      <p class="ik-muted">Mapa de Europa: Natural Earth (dominio público), con Crimea dentro de Ucrania y Chipre entero. Regiones de Europa: geoesquema de la ONU (M49), con Chipre en el sur. Banderas: flag-icons, de Panayiotis Lipiridis (licencia MIT). Mapa de América: Natural Earth (dominio público), sin Hawái; Groenlandia, Guayana Francesa, Puerto Rico y las Malvinas, de fondo. Regiones de América: geoesquema de la ONU (M49), con México en América Central. Bolivia: capital constitucional Sucre (el Gobierno está en La Paz). Mapas de Asia, África y Oceanía: Natural Earth (dominio público), con Somalilandia dentro de Somalia; Taiwán, el Sáhara Occidental y los territorios no independientes, de fondo. Regiones: geoesquema de la ONU (M49). Israel y Palestina no salen en Capitales porque su capital está en disputa. Guinea Ecuatorial: Ciudad de la Paz, capital desde enero de 2026. Banderas de las provincias y comunidades de España: Wikimedia Commons, vía iso3166-flag-icons de Andrew McKenna (licencia MIT); algunas provincias usan como bandera la de su diputación provincial.</p>
      <h3>Aviso</h3>
      <p class="ik-muted">Esta app es una ayuda para repasar y puede contener errores. <b>En caso de error o duda, la fuente fiable es el material oficial de la asignatura</b> (libro de texto y apuntes del profesorado).</p>
      <h3>Versión</h3>
      <p class="ik-muted">Atlas · versión ${VERSION}. Se actualiza sola cuando hay una versión nueva.</p>
      <div class="ajrow"><button class="ik-btn ik-ghost" id="ajBuscar">🔄 Buscar actualizaciones</button><button class="ik-btn ik-ghost" id="ajNov">Ver novedades</button></div>
      <p class="ik-muted" id="ajMsg" role="status">La app lo comprueba sola cada vez que la abres o vuelves a ella.</p></div>`, "Ajustes");
    const i = $("#ajInst"); if (i) i.onclick = () => IK.abrirInstalar();
    $("#ajBuscar").onclick = () => IK.buscar($("#ajBuscar"), $("#ajMsg"));
    $("#ajNov").onclick = () => verNovedades(null);
  }
  $("#verLine").addEventListener("click", ajustes);
  // Al abrir una versión nueva por primera vez, se enseñan sus novedades (una sola vez)
  try {
    const vista = localStorage.getItem("atlas-version");
    localStorage.setItem("atlas-version", VERSION);
    if (vista && IK.verCmp(VERSION, vista) > 0) setTimeout(() => verNovedades(vista), 700);
    else if (!vista && window.ATLAS_YA_JUGABA) setTimeout(() => verNovedades("3"), 700); // ya jugaba antes de la 3.1
  } catch (e) {}
  // Comprueba la página publicada (<meta name="app-version">) al abrir, al volver y cada 90 s; lo demás lo hace actualizacion.js
  const nueva = () => window.atlasVersionNueva();
  async function comprobar() { const v = await IK.versionPublicada(); if (v && IK.verCmp(v, VERSION) > 0) nueva(); }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") comprobar(); });
  addEventListener("focus", comprobar); setInterval(comprobar, 90e3); setTimeout(comprobar, 2000);
  if (/[?&]u=/.test(location.search)) history.replaceState(history.state, "", location.pathname);
  IK.init({ nombre: "Atlas", clave: "atlas", version: VERSION, onNueva: nueva, dentro: "#setcard .menufoot", dentroPos: "beforebegin" });
})();
