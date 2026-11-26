// ---------- Teclado en el mapa: flechas para moverse entre provincias, Intro para elegir ----------
let kf = null;
const C = id => cCache[id] || (cCache[id] = centroidOf(id));
function setKFocus(id, quiet) {
  if (kf && byId[kf]) byId[kf].classList.remove("kfocus");
  kf = id;
  markers.classed("kfocus", f => f.id === id);
  if (!id) return;
  d3.select(byId[id]).classed("kfocus", true).raise();
  if (curK > 1.01) svg.transition("z").duration(reduceMotion() ? 0 : 250).call(zoom.translateTo, C(id)[0], C(id)[1]);
  if (S.mode === "explore") showInfo(id);
  else if (!quiet) Sound.play("tick");
}
function nearestToCenter() {
  const t = d3.zoomTransform(svg.node());
  const [x, y] = t.invert([vb[0] + vb[2] / 2, vb[1] + vb[3] / 2]);
  let best = null, bd = Infinity;
  S.pool.forEach(id => { const c = C(id), d = (c[0] - x) ** 2 + (c[1] - y) ** 2; if (d < bd) { bd = d; best = id; } });
  return best;
}
function moveFocus(dir) {
  if (!kf || !S.pool.includes(kf)) return setKFocus(nearestToCenter());
  const [cx, cy] = C(kf);
  let best = null, bs = Infinity;
  S.pool.forEach(id => {
    if (id === kf) return;
    const [x, y] = C(id), dx = x - cx, dy = y - cy;
    const along = dx * dir[0] + dy * dir[1];
    if (along <= 0) return;
    const s = along + Math.abs(dx * dir[1] - dy * dir[0]) * 2.5;
    if (s < bs) { bs = s; best = id; }
  });
  if (best) setKFocus(best);
}
svg.on("focus", () => { if (!kf && svg.node().matches(":focus-visible")) setKFocus(nearestToCenter(), true); });
svg.on("keydown", e => {
  const dirs = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  if (dirs[e.key]) { e.preventDefault(); moveFocus(dirs[e.key]); }
  else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (kf) onMapClick(kf); }
  else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomBy(1.6); }
  else if (e.key === "-") { e.preventDefault(); zoomBy(1 / 1.6); }
  else if (e.key === "0") { e.preventDefault(); zoomReset(); }
  else if (e.key === "Escape") setKFocus(null);
});
svg.on("pointerdown", () => setKFocus(null));

$("#m-due").addEventListener("click", () => {
  const ids = dueIds(); if (!ids.length) return;
  S.mode = ultimaPractica; pressMode(S.mode); renderModeExtras();
  S.region = "all"; sel.value = "all"; // el repaso puede incluir provincias de cualquier zona
  closeSheet(); newGame(ids);
  toast(null, "Repaso del día: <b>" + ids.length + "</b> " + tx("provincias", "países") + " que se te resisten", "ok", 2600);
});
$("#flagCa").checked = store.get("atlas:flagCa") === true;
$("#flagCa").addEventListener("change", () => { store.set("atlas:flagCa", $("#flagCa").checked); if (S.mode === "flag") newGame(); });
$("#capOnly").checked = store.get("atlas:capOnly") !== false;
$("#capOnly").addEventListener("change", () => { store.set("atlas:capOnly", capOnly()); if (S.mode === "cap") newGame(); });
function renderModeExtras() {
  $("#capOnlyRow").hidden = S.mode !== "cap"; $("#duelRow").hidden = S.mode !== "duel"; $("#flagCaRow").hidden = EU || CA || S.mode !== "flag";
  $("#modeOpts").hidden = S.mode !== "cap" && S.mode !== "duel" && (EU || CA || S.mode !== "flag"); // la zona ya va arriba
  if (TAB_OF[S.mode]) showTab(TAB_OF[S.mode]);
  renderTopTabs();
  const b = $('.modes button[data-mode="' + S.mode + '"]');
  $("#optsTitle").textContent = "Opciones · " + (b ? b.querySelector("b").textContent : "");
  // si acabas de tocar un modo con opciones (Duelo, Capitales…), que se vean: en el móvil salían fuera de la pantalla
  if (!$("#modeOpts").hidden && document.activeElement && document.activeElement.closest && document.activeElement.closest(".modes"))
    requestAnimationFrame(() => $("#modeOpts").scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  renderDue();
}
["#p1n", "#p2n"].forEach((sel, i) => {
  $(sel).value = store.get("atlas:jug" + (i + 1)) || "";
  $(sel).addEventListener("change", () => { store.set("atlas:jug" + (i + 1), $(sel).value.trim()); if (S.mode === "duel") newGame(); });
});
$("#sound").addEventListener("click", () => {
  Sound.mode = SOUND_MODES[(SOUND_MODES.indexOf(Sound.mode) + 1) % SOUND_MODES.length];
  store.set("atlas:sound", Sound.mode); Sound.session(); renderSound();
  Sound.play("ok");
});
renderSound();

