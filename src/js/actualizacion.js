// 5.0 · Un solo sistema de actualización. Hay versión nueva cuando:
//   · la página publicada trae un <meta name="app-version"> mayor (lo comprueba ajustes.js al abrir, al volver y cada 90 s), o
//   · el navegador instala un service worker nuevo.
// Entonces se espera a que no haya nada que cortar (partida empezada o sus resultados, una ventana o la de zonas abiertas),
// se activa el service worker nuevo (para que no queden archivos viejos en la copia guardada) y se recarga.
(function () {
  let reg = null, hayNueva = false, aplicando = false;
  const habiaVersion = "serviceWorker" in navigator && !!navigator.serviceWorker.controller;
  const ocupado = () => {
    const z = document.getElementById("zoneSheet");
    return window.atlasEnPartida() || !!document.getElementById("ik-sheet") || !!(z && !z.hidden);
  };
  function recargar() { location.replace(location.pathname + "?u=" + Date.now()); }
  async function aplicar() {
    if (aplicando) return; aplicando = true;
    const barra = document.createElement("div"); barra.id = "updBar"; barra.setAttribute("role", "status");
    barra.style.cssText = "position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:50;" +
      "padding:10px 16px;border-radius:99px;background:var(--ink);color:var(--bg);font:700 .9rem/1.2 var(--f-body);box-shadow:0 8px 24px rgba(0,0,0,.25)";
    barra.textContent = "Actualizando a la versión nueva…"; document.body.appendChild(barra);
    try { // que el service worker nuevo esté activo antes de recargar (como mucho 5 s)
      if (reg) {
        await reg.update().catch(() => {});
        if (reg.installing || reg.waiting) await new Promise(ok => {
          navigator.serviceWorker.addEventListener("controllerchange", ok, { once: true }); setTimeout(ok, 5000);
        });
      }
    } catch (e) {}
    recargar();
  }
  // Avisa de que hay versión nueva; se aplica en cuanto se pueda
  window.atlasVersionNueva = () => { hayNueva = true; if (!ocupado()) aplicar(); };
  // Al empezar otra partida es buen momento: devuelve true si va a recargar (y la partida no debe empezar)
  window.atlasActualizarSiToca = () => { if (!hayNueva || aplicando) return aplicando; aplicar(); return true; };
  setInterval(() => { if (hayNueva && !ocupado()) aplicar(); }, 3000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && hayNueva && !window.atlasEnPartida()) aplicar(); // al irse, si no corta nada
    else if (document.visibilityState === "visible" && reg) reg.update().catch(() => {});
  });
  if ("serviceWorker" in navigator) addEventListener("load", async () => {
    try { reg = await navigator.serviceWorker.register("sw.js"); } catch (e) { return; }
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (habiaVersion && !aplicando) window.atlasVersionNueva(); });
    addEventListener("pageshow", e => { if (e.persisted) reg.update().catch(() => {}); });
  });
})();
