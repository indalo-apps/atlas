// ---------- Panel de ajustes (móvil) ----------
let lastFocus = null;
function openSheet(first) {
  if (!mqMobile.matches) return;
  $("#setTitle").innerHTML = mqHome.matches ? M.brand : "¿Qué quieres hacer?";
  requestAnimationFrame(pintarMiniMapa); setTimeout(pintarMiniMapa, 700);
  const seguir = !first && enCurso();
  $("#sheetPlay").textContent = seguir ? "Seguir jugando" : "Empezar";
  $("#restart2").hidden = !seguir;
  if (TAB_OF[S.mode]) showTab(TAB_OF[S.mode]);
  renderResume();
  lastFocus = document.activeElement;
  document.body.classList.add("sheet-open"); $("#backdrop").hidden = false;
  setTimeout(() => { const b = $("#setcard").querySelector('.modes [aria-pressed="true"]'); if (b) b.focus({ preventScroll: true }); }, 60);
}
function closeSheet() {
  if (!document.body.classList.contains("sheet-open")) return;
  document.body.classList.remove("sheet-open"); $("#backdrop").hidden = true;
  store.set("atlas:mode", S.mode); // ya no es la primera visita
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
$("#openSettings").addEventListener("click", () => openSheet(false));
$("#openSettings2").addEventListener("click", () => openSheet(false));
$("#sheetClose").addEventListener("click", closeSheet);
$("#sheetPlay").addEventListener("click", closeSheet);
$("#backdrop").addEventListener("click", closeSheet);
$("#restart2").addEventListener("click", () => { newGame(); closeSheet(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { if (closeZones()) return; closeSheet(); $("#shareModal").hidden = true; } });
$("#skip2").addEventListener("click", () => {
  if (!S.cur && Object.keys(S.results).length && S.mode !== "explore") { $("#endcard").hidden = false; return; }
  if (S.mode === "time") return skipTimed();
  if (S.mode === "duel") { if (!S.locked && S.cur) answerDuel(null); return; }
  if (!S.locked && S.cur) reveal();
});
$("#e-map").addEventListener("click", () => { $("#endcard").hidden = true; });

// En el móvil, las opciones de "¿Cuál es?" van en la barra inferior, al alcance del pulgar
function placeOptions() {
  const o = $("#options");
  if (mqMobile.matches) $("#statcard").insertBefore(o, $("#barrow"));
  else $("#qcard").insertBefore(o, $("#feedback"));
}
placeOptions();
let resizeT = null;
function onResize() {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (layoutMap()) {
      gLbl.selectAll("*").remove();
      zoomTo(S.region === "all" ? null : S.pool);
    }
  }, 150);
}
addEventListener("resize", onResize);
if (window.ResizeObserver) { const ro = new ResizeObserver(onResize); ro.observe($("#qcard")); ro.observe($("#statcard")); }
mqMobile.addEventListener("change", () => { placeOptions(); closeSheet(); onResize(); });

