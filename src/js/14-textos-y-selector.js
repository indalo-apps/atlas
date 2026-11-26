// ---------- 5.0 · Textos de cada mapa, sacados de su ficha (M), y selector de mapas ----------
// El HTML trae los textos de las provincias; aquí se ponen los de comunidades o países, uno a uno (nada se cambia a ciegas)
const U = M.pal;
$(".brand").innerHTML = M.brand;
$("#m-find").querySelector("b").textContent = U.busca; $("#m-find").querySelector("span").textContent = U.toca;
$("#shapeSvg").setAttribute("aria-label", "Silueta de " + (U.art === "el" ? "un " : "una ") + U.uno); $("#shapebox p").textContent = "¿Qué " + U.uno + " tiene esta forma?";
$("#i-eyebrow").textContent = U.Uno;
$(".tally").setAttribute("aria-label", "Resultado por " + U.unos);
$("#m-flag").querySelector("span").textContent = "¿De qué " + U.uno + " es?";
if (M.capTxt) $("#capOnlyTxt").textContent = M.capTxt + (M.sinCap ? ". Israel y Palestina no salen: su capital está en disputa" : "");
$("#shareDl").setAttribute("download", M.archivo);
if (EU) {
  $("#m-gent").hidden = true;
  $("#duelReglas").textContent = "Por turnos: cada uno busca el suyo en el mapa y pasa el móvil al otro. Gana quien acierte más.";
  $(".mapwrap").setAttribute("aria-label", "Mapa de " + M.cont);
  $("#map").setAttribute("aria-label", "Mapa de países de " + M.cont + ". Flechas para moverte entre países, Intro para elegir, más y menos para acercar o alejar.");
  $("#regionLabel").textContent = $("#regionChip").textContent = M.cont;
  $("#i-ccaa-l").textContent = "Región";
  $("#infocard .note").textContent = "Pasa el ratón o toca el mapa para ver cada país, su capital y su bandera. Cuando te sientas preparado, elige un modo de juego.";
  $(".zs-note").textContent = "Vale para todos los modos y se recuerda para la próxima vez. El número es cuántos países tiene. Las regiones son las de la ONU.";
}
if (CA) {
  $("#map").setAttribute("aria-label", "Mapa de comunidades. Flechas para moverte entre comunidades, Intro para elegir, más y menos para acercar o alejar.");
  $("#i-ccaa-l").textContent = "Zona";
  $("#infocard .note").textContent = "Pasa el ratón o toca el mapa para ver cada comunidad. Cuando te sientas preparado, elige un modo de juego.";
  $(".zs-note").textContent = "Vale para todos los modos y se recuerda para la próxima vez. El número es cuántas comunidades tiene.";
}
$("#m-flag").hidden = false;
// Las banderas del mapa se guardan en el móvil para poder jugar sin conexión
setTimeout(() => {
  const urls = EU || CA ? ALL.map(flagSrc) : ALL.filter(id => !SIN_BANDERA.includes(id)).map(flagSrc).concat(Object.values(CA_N).map(n => "banderas/es/ca-" + n + ".webp"));
  urls.forEach(u => { try { fetch(u).catch(() => {}); } catch (e) {} });
}, 4000);
document.querySelectorAll(".mapseg button[data-mapa]").forEach(b => {
  const on = b.dataset.mapa === MAPA || (b.dataset.mapa === "es" && CA);
  b.setAttribute("aria-pressed", on);
  b.addEventListener("click", () => { if (!on) cambiarMapa(b.dataset.mapa === "es" ? (store.get("atlas:espana") === "ca" ? "ca" : "es") : b.dataset.mapa); });
});
document.querySelectorAll(".mapsub").forEach(g => g.hidden = EU); // la fila Provincias / Comunidades, solo en España
document.querySelectorAll(".mapsub button").forEach(b => {
  b.setAttribute("aria-pressed", b.dataset.sub === MAPA);
  b.addEventListener("click", () => { store.set("atlas:espana", b.dataset.sub); cambiarMapa(b.dataset.sub); });
});
if (!EU) store.set("atlas:espana", MAPA);
function cambiarMapa(m) {
  if (m === MAPA) return;
  const ir = () => { // 5.1.1 · se recuerda por dónde ibas en la portada, para que al recargar no salte arriba
    try { sessionStorage.setItem("atlas:scroll", String($("#setcard").scrollTop)); } catch (e) {}
    store.set("atlas:mapa", m); location.replace(location.pathname);
  };
  if (!enCurso()) return ir();
  IK.hoja(`<div class="aj"><h2>¿Cambiar a ${{ eu: "Europa", am: "América", as: "Asia", af: "África", oc: "Oceanía", es: "las provincias de España", ca: "las comunidades de España" }[m]}?</h2><p>Perderás lo que llevas en esta partida. Tus récords y tu repaso de cada mapa se guardan aparte.</p>
    <div class="ajrow"><button class="ik-btn ik-ghost" data-ik="cerrar">Seguir jugando</button><button class="ik-btn" id="mapaYes">Cambiar de mapa</button></div></div>`, "Cambiar de mapa");
  $("#mapaYes").onclick = ir;
}
if (/[?&]mapa=/.test(location.search)) history.replaceState(history.state, "", location.pathname);

// Arranque: recuerda el último modo y zona
const savedMode = store.get("atlas:mode"), savedRegion = store.get(KP + "region");
if (savedMode && document.querySelector('[data-mode="' + savedMode + '"]:not([hidden])')) {
  S.mode = savedMode;
  pressMode(savedMode);
}
if (savedRegion && REGIONS.some(r => r[0] === savedRegion)) { S.region = savedRegion; sel.value = savedRegion; }
// 5.1 · Primera visita, en el móvil y en el ordenador por igual: se empieza explorando el mapa, con «Empezar a jugar» a la vista
if (!savedMode) { S.mode = "explore"; pressMode("explore"); }
renderModeExtras();
newGame();
// En el móvil en vertical la app se abre siempre en la pantalla de inicio; en el resto, solo la primera vez
// 5.1.1 · Al abrir la app (y al cambiar de mapa, que recarga), la portada ya está puesta: sin subir desde abajo
document.body.classList.add("arranque");
if (mqHome.matches || (!savedMode && mqMobile.matches)) openSheet(true);
try {
  const y = +sessionStorage.getItem("atlas:scroll"); sessionStorage.removeItem("atlas:scroll");
  if (y) $("#setcard").scrollTop = y;
} catch (e) {}
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("arranque")));
