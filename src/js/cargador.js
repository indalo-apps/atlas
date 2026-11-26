// 5.0 · Cargador: decide el mapa y descarga SOLO sus datos (antes se cargaban los siete, unos 700 KB, en cada arranque).
// Va antes del juego y usa document.write para que los datos estén listos cuando el juego empiece, sin esperas.
// ¿Ya había usado la app? Se mira antes de que la app guarde nada (si no, a quien llega nuevo le salían las novedades)
try { window.ATLAS_YA_JUGABA = localStorage.length > 0; } catch (e) { window.ATLAS_YA_JUGABA = false; }
window.ATLAS_MAPA = (function () {
  try {
    var q = new URLSearchParams(location.search).get("mapa");
    var Q = { europa: "eu", espana: "es", provincias: "es", comunidades: "ca", america: "am", asia: "as", africa: "af", oceania: "oc" };
    if (Q[q]) localStorage.setItem("atlas:mapa", JSON.stringify(Q[q]));
    var m = JSON.parse(localStorage.getItem("atlas:mapa"));
    return ["eu", "am", "as", "af", "oc", "ca"].indexOf(m) >= 0 ? m : "es";
  } catch (e) { return "es"; }
})();
window.ATLAS_DATOS = { es: "espana.js", ca: "espana.js", eu: "europa.js", am: "america.js", as: "asia.js", af: "africa.js", oc: "oceania.js" };
document.write('<script src="' + window.ATLAS_DATOS[window.ATLAS_MAPA] + '"><\/script>');
