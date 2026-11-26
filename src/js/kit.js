/* ===== Kit común de las apps de indalo-apps (copiado de la Tabla periódica) =====
   Ayuda para instalar según el móvil, aviso para instalar y búsqueda de versión.
   Uso: IK.init({nombre, clave, version, onBuscar, esInicio})                        */
const IK = (function(){
  const UA = navigator.userAgent;
  const IS_IPAD = /iPad/.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const IS_IOS = /iPhone|iPad|iPod/.test(UA) || IS_IPAD;
  const IS_ANDROID = /Android/.test(UA);
  const IN_APP = /FBAN|FBAV|Instagram|WhatsApp|Line\/|; wv\)|GSA\//.test(UA);
  const IOS_OTHER = IS_IOS && /CriOS|FxiOS|EdgiOS/.test(UA);
  const EN_WEB = /\.github\.io$/.test(location.hostname) || location.hostname === "localhost";
  let cfg = {nombre: document.title, clave: "app", version: "dev"};
  let deferred = null;
  const st = {
    get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
    set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  };
  // Versión de iOS: Safari 26 deja fija la del sistema en 18_x, así que se usa «Version/NN» cuando está
  function iosVersion(){
    const sv = UA.match(/Version\/(\d+)(?:\.(\d+))?.*Safari/);
    if (sv && !IOS_OTHER) return [+sv[1], +(sv[2] || 0)];
    const os = UA.match(/OS (\d+)_(\d+)/); return os ? [+os[1], +os[2]] : [0, 0];
  }
  function instalada(){ try { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch(e){ return false; } }
  const SHARE = '<svg class="ik-ic" viewBox="0 0 24 24"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
  const DOTS = '<svg class="ik-ic" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
  const MENU3='<svg class="ik-ic" viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h10"/></svg>';
  const HDOTS = '<svg class="ik-ic" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>';
  const PLUS = '<svg class="ik-ic" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';

  function pasos(){
    const n = cfg.nombre;
    if (IN_APP) return `<p>Has abierto el enlace dentro de otra app. Para instalarla, ábrela primero en el navegador:</p>
      <ol class="ik-steps"><li>Toca el menú ${DOTS} o el botón ${SHARE} de esta pantalla.</li>
      <li>Elige <b>«Abrir en ${IS_IOS ? "Safari" : "Chrome"}»</b> (o «Abrir en el navegador»).</li>
      <li>Allí, vuelve a <b>Ajustes → Cómo añadirla a la pantalla de inicio</b>.</li></ol>`;
    if (IS_IOS){
      const [maj, min] = iosVersion(), dev = IS_IPAD ? "iPad" : "iPhone";
      const ver = maj ? `<p class="ik-nota">Tu ${dev} tiene <b>iOS ${maj}${min ? "." + min : ""}</b>. Estos son los pasos para esa versión.</p>` : "";
      const fin = `<li>Si aparece <b>«Abrir como app web»</b>, déjalo activado y pulsa <span class="ik-kbd">Añadir</span> (arriba a la derecha).</li>
        <li>Listo: el icono <b>${n}</b> aparecerá en tu pantalla de inicio. Ábrela siempre desde ahí.</li>`;
      if (maj && (maj < 16 || (maj === 16 && min < 4)) && IOS_OTHER)
        return ver + `<p>En esta versión de iOS solo se puede instalar desde <b>Safari</b>:</p>
          <ol class="ik-steps"><li>Copia el enlace y ábrelo en <b>Safari</b>. <button class="ik-btn ik-ghost" data-ik="copiar">Copiar enlace</button></li>
          <li>Toca el botón <b>Compartir</b> ${SHARE} de la barra de abajo.</li>
          <li>Elige <b>«Añadir a pantalla de inicio»</b> ${PLUS}.</li>${fin}</ol>`;
      if (IOS_OTHER)
        return ver + `<p>Desde este navegador (o desde Safari):</p>
          <ol class="ik-steps"><li>Toca el botón <b>Compartir</b> ${SHARE}, en la barra de direcciones (arriba a la derecha) o en el menú del navegador.</li>
          <li>Elige <b>«Añadir a pantalla de inicio»</b> ${PLUS}. Si no está, toca <b>«Más»</b> o baja en la lista.</li>${fin}</ol>`;
      if (maj >= 26)
        return ver + `<ol class="ik-steps">
          <li>${maj>=27&&!IS_IPAD?`Toca el botón ${MENU3} de tres rayas que está a la izquierda, dentro de la barra de la dirección (abajo).`:`Toca el botón ${HDOTS} que está a la derecha de la barra de la dirección${IS_IPAD ? " (arriba)" : " (abajo)"}.`}</li>
          <li>Toca <b>«Compartir»</b> ${SHARE}.</li>
          <li>Toca <b>«Ver más»</b> si hace falta, baja en la lista y elige <b>«Añadir a pantalla de inicio»</b> ${PLUS}.</li>${fin}</ol>`;
      return ver + `<ol class="ik-steps">
        <li>Toca el botón <b>Compartir</b> ${SHARE}${IS_IPAD ? ", arriba a la derecha." : ", en el centro de la barra de abajo. Si no ves la barra, desliza un poco la página hacia arriba."}</li>
        <li>Baja en la lista y elige <b>«Añadir a pantalla de inicio»</b> ${PLUS}.</li>${fin}</ol>`;
    }
    if (IS_ANDROID) return `<p>En el móvil o la tablet Android, con Chrome:</p>
      <ol class="ik-steps"><li>Toca el menú ${DOTS} (arriba a la derecha).</li>
      <li>Elige <b>«Añadir a pantalla de inicio»</b> o <b>«Instalar aplicación»</b>.</li>
      <li>Pulsa <span class="ik-kbd">Instalar</span>. El icono aparecerá en tu pantalla de inicio.</li></ol>`;
    return `<p>Está pensada para el móvil o la tablet: abre este mismo enlace allí y sigue los pasos que salen.</p>
      <ol class="ik-steps"><li>En el ordenador también se puede instalar con Chrome o Edge: busca el icono de instalar ${PLUS} a la derecha de la barra de direcciones.</li></ol>`;
  }

  function cerrar(){ const s = document.getElementById("ik-sheet"); if (s) s.remove(); }
  function abrir(html, etiqueta){
    cerrar();
    const s = document.createElement("div");
    s.id = "ik-sheet"; s.className = "ik-bg";
    s.innerHTML = `<div class="ik-sheet" role="dialog" aria-modal="true" aria-label="${etiqueta}"><button class="ik-x" data-ik="cerrar" aria-label="Cerrar">✕</button>${html}</div>`;
    s.addEventListener("click", ev => {
      if (ev.target === s || ev.target.closest('[data-ik="cerrar"]')) { cerrar(); return; }
      const b = ev.target.closest("[data-ik]"); if (!b) return;
      if (b.dataset.ik === "ya") instalarYa();
      if (b.dataset.ik === "copiar"){
        const u = location.origin + location.pathname;
        (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => { b.textContent = "✓ Enlace copiado"; }).catch(() => { b.textContent = u; });
      }
    });
    document.addEventListener("keydown", function esc(e){ if (e.key === "Escape"){ cerrar(); document.removeEventListener("keydown", esc); } });
    document.body.appendChild(s);
    const x = s.querySelector(".ik-x"); if (x) x.focus();
  }
  async function instalarYa(){
    if (!deferred) return;
    deferred.prompt(); try { await deferred.userChoice; } catch(e){}
    deferred = null; cerrar();
  }
  function abrirInstalar(){
    if (instalada()){ abrir(`<h2>Ya está instalada</h2><p>✓ Ya la estás usando como app instalada. Ábrela siempre desde su icono.</p><div class="ik-nav"><button class="ik-btn" data-ik="cerrar">Entendido</button></div>`, "Instalar"); return; }
    if (deferred && !IS_IOS && !IN_APP){ instalarYa(); return; }
    abrir(`<div class="ik-head"><img src="icon-192.png" alt=""><div><h2>Instalar la app</h2><span class="ik-muted">Gratis, sin tienda y sin registrarse</span></div></div>
      ${pasos()}
      <p class="ik-muted">Una vez instalada se abre a pantalla completa, funciona sin conexión y se actualiza sola.</p>
      <div class="ik-nav">${deferred ? '<button class="ik-btn" data-ik="ya">Instalar ahora</button>' : '<button class="ik-btn" data-ik="cerrar">Entendido</button>'}</div>`, "Instalar en el móvil");
  }

  // Aviso amarillo «Instálala en tu móvil» (solo en móvil o tablet, si no está instalada y no se ha cerrado)
  function pintarAviso(){
    const viejo = document.getElementById("ik-banner");
    const toca = !instalada() && !st.get(cfg.clave + "-install-hide", 0) && (IS_IOS || IS_ANDROID || deferred)
      && (!cfg.esInicio || cfg.esInicio());
    if (!toca){ if (viejo) viejo.remove(); return; }
    if (viejo) return;
    const b = document.createElement("div");
    b.id = "ik-banner"; b.className = "ik-banner"; b.setAttribute("role", "region"); b.setAttribute("aria-label", "Instalar la app");
    b.innerHTML = `<img src="icon-192.png" alt=""><div><b>📲 Instálala en tu ${IS_IPAD ? "iPad" : "móvil"}</b>Tenla en la pantalla de inicio, como una app.</div>
      <button class="ik-btn" data-b="ver">${deferred && !IS_IOS ? "Instalar" : "Ver cómo"}</button><button class="ik-bx" data-b="x" aria-label="No mostrar más">×</button>`;
    b.addEventListener("click", ev => {
      const t = ev.target.closest("[data-b]"); if (!t) return;
      if (t.dataset.b === "ver") abrirInstalar();
      else { st.set(cfg.clave + "-install-hide", 1); b.remove(); }
    });
    const dentro = cfg.dentro && document.querySelector(cfg.dentro);
    if (dentro){ b.classList.add("ik-inline"); dentro.insertAdjacentElement(cfg.dentroPos || "afterbegin", b); }
    else document.body.appendChild(b);
  }

  // Comprueba la versión publicada leyendo el <meta name="app-version"> de la página
  const verCmp = (a, b) => { const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
    for (let i = 0; i < 3; i++){ const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
  async function versionPublicada(){
    if (!EN_WEB) return null;
    try {
      const txt = await (await fetch(location.pathname + "?v=" + Date.now(), {cache: "no-store"})).text();
      const m = txt.match(/name="app-version" content="([^"]+)"/);
      return m ? m[1] : null;
    } catch(e){ return null; }
  }
  // Botón «Buscar actualizaciones»: escribe el resultado en el elemento msg
  async function buscar(boton, msg){
    if (boton) boton.disabled = true;
    if (msg) msg.textContent = "Comprobando…";
    const v = await versionPublicada();
    if (boton) boton.disabled = false;
    if (!msg) return v;
    if (!EN_WEB) msg.textContent = "Solo se puede comprobar en la app publicada.";
    else if (v == null) msg.textContent = "No se ha podido comprobar. ¿Tienes conexión a internet?";
    else if (verCmp(v, cfg.version) > 0){ msg.textContent = `Hay una versión nueva (${v}). Se instalará en cuanto cierres esta ventana.`; if (cfg.onNueva) cfg.onNueva(v); }
    else msg.textContent = `✓ Tienes la última versión (${cfg.version}).`;
    return v;
  }

  function init(c){
    Object.assign(cfg, c);
    addEventListener("beforeinstallprompt", ev => { ev.preventDefault(); deferred = ev; pintarAviso(); });
    addEventListener("appinstalled", () => { deferred = null; st.set(cfg.clave + "-install-hide", 1); pintarAviso(); cerrar(); });
    let pend = false;
    if (cfg.esInicio) new MutationObserver(() => { if (pend) return; pend = true; setTimeout(() => { pend = false; pintarAviso(); }, 250); }).observe(document.body, {subtree: true, attributes: true, attributeFilter: ["class", "hidden"]});
    setTimeout(pintarAviso, 1200);
    // Enlace directo a las instrucciones: …/?instalar
    if (/[?&]instalar\b/.test(location.search)){ history.replaceState(history.state, "", location.pathname); if (!instalada()) setTimeout(abrirInstalar, 500); }
  }
  return {init, abrirInstalar, buscar, versionPublicada, verCmp, instalada, EN_WEB, hoja: abrir, cerrar};
})();
