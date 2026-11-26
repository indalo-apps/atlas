// ---------- Zoom: rueda con Ctrl/⌘ o pellizco en el ordenador, dos dedos en el móvil, botones y teclado ----------
let curK = 1;
const zoom = d3.zoom().scaleExtent([1, 8]).clickDistance(6)
  .extent(() => [[vb[0], vb[1]], [vb[0] + vb[2], vb[1] + vb[3]]])
  .filter(e => {
    if (e.type === "wheel") return e.ctrlKey || e.metaKey;
    if (e.type === "touchstart") return e.touches.length > 1 || curK > 1.01; // con un dedo y sin zoom, la página se desplaza
    return !e.button;
  })
  .on("zoom", e => {
    gZoom.attr("transform", e.transform);
    curK = e.transform.k;
    gLbl.selectAll("text").style("font-size", fontSize() + "px");
    svg.classed("zoomed", curK >= 1.8);
    if (curK >= 1.8 && document.body.classList.contains("mode-explore")) { placeNames(); sizePaises(); }
    sizePaises();
    $("#z-out").disabled = curK <= 1.01; $("#z-reset").disabled = curK <= 1.01; $("#z-in").disabled = curK >= 7.99;
  });
svg.call(zoom).on("dblclick.zoom", null);
sizePaises();
function zoomBy(f) { svg.transition("z").duration(reduceMotion() ? 0 : 250).call(zoom.scaleBy, f); }
function zoomReset() { svg.transition("z").duration(reduceMotion() ? 0 : 300).call(zoom.transform, d3.zoomIdentity); }
$("#z-in").addEventListener("click", () => zoomBy(1.6));
$("#z-out").addEventListener("click", () => zoomBy(1 / 1.6));
$("#z-reset").addEventListener("click", zoomReset);

function sizePaises() {
  if (!HOME || !vb) return;
  const f = fontSize();
  paisText.style("font-size", d => f * 0.62 * (d[2] || 1) + "px");
  insetLbl.style("font-size", f * 0.58 + "px");
  cmLbl.style("font-size", f * 0.7 + "px");
  cmLbl.style("visibility", AM && curK < 3.5 ? "hidden" : null); // América: las Antillas Menores se rotulan al acercar, si no se amontonan
  rioLbl.style("font-size", f * 0.62 + "px");
  if (provNames) provNames.style("font-size", f * 0.62 + "px");
  capLbl.style("font-size", f * 0.78 + "px");
}
function fontSize() { return vb[2] / HOME[2] * 15 / curK; }
function label(id, text, cls, ms) {
  const c = id === M.islasCentro ? path.centroid(featById[id]) : centroidOf(id);
  const t = gLbl.append("text").attr("class", "lbl " + (cls || "")).attr("x", c[0]).attr("y", c[1])
    .style("font-size", fontSize() + "px").text(text);
  if (ms) setTimeout(() => t.remove(), ms);
  return t;
}
function centroidOf(id) {
  // Para provincias con islas, usar el polígono más grande
  const f = featById[id];
  if (EU && DOTS.includes(id)) return dotC(f);
  if (EU && id === "RU") return projection([39.5, 56.8]);
  let c;
  if (f.geometry.type !== "MultiPolygon") c = path.centroid(f);
  else {
    let best = null, area = -1;
    f.geometry.coordinates.forEach(poly => { const g = { type: "Polygon", coordinates: poly }; const a = path.area(g); if (a > area) { area = a; best = g; } });
    c = path.centroid(best);
  }
  return CAN.includes(id) ? tCan(c) : c;
}
function clearMarks() {
  provAll.classed("target selected flash-bad flash-ok reveal done-ok r-ok r-meh r-bad", false);
  gHint.selectAll("*").remove(); gLbl.selectAll("*").remove();
}
function cls(id, c, on = true) { if (byId[id]) byId[id].classList.toggle(c, on); if (dotById[id]) dotById[id].classList.toggle(c, on); }

