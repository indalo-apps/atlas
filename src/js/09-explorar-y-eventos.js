// ---------- Explorar ----------
function showInfo(id) {
  const [nm, alt, cap, ccaa] = P[id];
  $("#i-name").textContent = nm + (alt ? " / " + alt : "");
  $("#i-cap").textContent = cap; $("#i-ccaa").textContent = EU ? ccaa + (P[id][4] && EXTRA ? EXTRA.info : "") : ccaa;
  if (EU || CA || !SIN_BANDERA.includes(id)) { $("#i-flag").src = flagSrc(id); $("#i-flag").alt = "Bandera de " + nm + ": " + bandera(id); $("#i-flag").hidden = false; }
  else $("#i-flag").hidden = true; // sin bandera provincial oficial
  const nota = !EU && !CA && (SIN_BANDERA.includes(id) ? "No tiene bandera provincial." : NOTA_BANDERA[id]);
  $("#i-fnote").textContent = nota || ""; $("#i-fnote").hidden = !nota;
  provAll.classed("selected", f => f.id === id);
  gLbl.selectAll("*").remove();
  if (!dotById[id] || (AM && curK < 3.5)) label(id, nm); // Ceuta y Melilla ya tienen su rótulo junto al punto
  capDots.classed("on", d => d.id === id);
  const cd = capData.find(d => d.id === id);
  if (cd && cap !== nm) {
    const xy = CAN.includes(id) ? tCan(cd.xy) : cd.xy;
    capLbl.attr("x", xy[0] + HOME[2] * 0.009).attr("y", xy[1]).text(cap);
  } else capLbl.text("");
  announce(nm + ". Capital: " + cap + ". " + ccaa + "." + (EU && P[id][4] && EXTRA ? EXTRA.voz : ""));
}

// ---------- Eventos ----------
function onMapClick(id) {
  if (!P[id]) return;
  if (S.mode === "explore") return showInfo(id);
  if (TAP_MODES.includes(S.mode)) answer(id);
}
provPaths.on("click", (e, f) => onMapClick(f.id));
markers.on("click", (e, f) => onMapClick(f.id));
provPaths.on("mouseenter", (e, f) => { if (S.mode === "explore" && P[f.id] && matchMedia("(hover: hover)").matches) showInfo(f.id); });

function pressMode(m) { document.querySelectorAll(".modes button[data-mode]").forEach(x => x.setAttribute("aria-pressed", x.dataset.mode === m)); }
document.querySelectorAll(".modes button[data-mode]").forEach(b => b.addEventListener("click", () => {
  // El mismo modo con una partida empezada: se sigue jugando, sin reiniciar
  if (b.dataset.mode === S.mode && enCurso()) { closeSheet(); return; }
  pressMode(b.dataset.mode);
  S.mode = b.dataset.mode; store.set("atlas:mode", S.mode);
  if (PRACTICA.includes(S.mode)) { ultimaPractica = S.mode; store.set(KP + "practica", S.mode); }
  if (JUEGOS.includes(S.mode)) store.set("atlas:juego", S.mode); // lo que empezará el botón grande la próxima vez
  renderModeExtras(); newGame();
  // En el móvil, tocar un modo lo empieza (Duelo espera a que se pongan los nombres)
  if (S.mode === "duel") { $("#sheetPlay").textContent = "Empezar"; $("#restart2").hidden = true; }
  else closeSheet();
}));
const sel = $("#region");
REGIONS.forEach(([v, t]) => { const o = document.createElement("option"); o.value = v; o.textContent = t; sel.appendChild(o); });
sel.addEventListener("change", () => { S.region = sel.value; store.set(KP + "region", S.region); newGame(); });

