// ---------- Mapa ----------
const W = 960, H = 600;
const svg = d3.select("#map");
const features = topojson.feature(TOPO, TOPO.objects.provinces).features;
const gameFeatures = features.filter(f => P[f.id]);
let projection, composite = false;
if (AM) projection = d3.geoAzimuthalEqualArea().rotate(CF.rot).fitExtent([[10, 10], [W - 10, H - 10]], { type: "FeatureCollection", features: gameFeatures.map(principal) });
else if (EU) projection = d3.geoAzimuthalEqualArea().rotate([-10, -52]).fitExtent([[10, 10], [W - 10, H - 10]], { type: "FeatureCollection", features: gameFeatures.filter(f => f.id !== "RU") });
else try {
  projection = d3.geoConicConformalSpain().fitExtent([[10, 10], [W - 10, H - 10]], { type: "FeatureCollection", features: gameFeatures });
  composite = true;
} catch (e) {
  projection = d3.geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], { type: "FeatureCollection", features: gameFeatures });
}
const path = d3.geoPath(projection);

svg.append("defs").html(
  '<pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect width="5" height="5" class="pat-bad-bg"/><line x1="1" y1="0" x2="1" y2="5" class="pat-bad-ln"/></pattern>' +
  '<pattern id="dots" patternUnits="userSpaceOnUse" width="5" height="5"><rect width="5" height="5" class="pat-meh-bg"/><circle cx="2.5" cy="2.5" r="0.9" class="pat-meh-dot"/></pattern>');
const gZoom = d3.select("#map").append("g");
// Los vecinos se dibujan con la misma proyección de la península pero sin el recorte del mapa compuesto
const projVec = composite
  ? d3.geoConicConformal().rotate([5, -38.6]).parallels([0, 60]).scale(projection.scale()).translate(projection.translate())
  : projection;
const CAN = M.can;
// Rusia: para encuadrar y rotular solo cuenta su parte europea, hasta el Volga
const RU_GEO = [[19.5, 54.3], [30, 69.8], [48, 69.8], [48, 44], [37, 44]];
const geomsMain = TOPO.objects.provinces.geometries.filter(g => !CAN.includes(g.id));
const geomsCan = TOPO.objects.provinces.geometries.filter(g => CAN.includes(g.id));
const exterior = geoms => topojson.mesh(TOPO, { type: "GeometryCollection", geometries: geoms }, (a, b) => a === b);
// Halo de costa debajo de los países vecinos: así solo asoma sobre el mar
gZoom.append("path").attr("class", "coast").attr("d", path(exterior(geomsMain)));
const gVec = gZoom.append("g");
gVec.selectAll("path").data(VECINOS.features).join("path").attr("class", "vecino").attr("d", d3.geoPath(projVec));
if (composite) { // el recuadro de Canarias tapa lo que quede debajo
  const k = projection.scale(), [tx, ty] = projection.translate();
  gVec.append("rect").attr("class", "insetbg")
    .attr("x", tx - 0.1331 * k).attr("y", ty + 0.053457 * k).attr("width", (0.1331 - 0.0354) * k).attr("height", (0.08969 - 0.053457) * k);
}
const canCoast = gZoom.append("path").attr("class", "coast").attr("d", path(exterior(geomsCan)));
gZoom.append("path").attr("class", "landshadow").attr("transform", "translate(1.5,2.5)").attr("d", path(topojson.merge(TOPO, geomsMain)));
const canShadow = gZoom.append("path").attr("class", "landshadow").attr("d", path(topojson.merge(TOPO, geomsCan)));
const gLand = gZoom.append("g");
const provPaths = gLand.selectAll("path").data(features).join("path")
  .attr("class", f => "prov" + (P[f.id] ? "" : " nogame"))
  .attr("d", path)
  .attr("data-id", f => f.id);
// Ríos (solo se ven en Explorar)
const gRios = gZoom.append("g").attr("aria-hidden", "true");
const pathVec = d3.geoPath(projVec);
gRios.selectAll("path").data(RIOS.features).join("path").attr("class", "rio").attr("d", pathVec);
const rioLbl = gRios.selectAll("text").data(RIOS.features).join("text").attr("class", "rio-lbl").text(f => f.properties.name)
  .each(function (f) {
    const linea = f.geometry.coordinates.reduce((a, b) => b.length > a.length ? b : a);
    const p = projVec(linea[Math.floor(linea.length * 0.45)]);
    d3.select(this).attr("x", p[0]).attr("y", p[1]);
  });
// Bordes entre comunidades (España) o entre regiones de Europa, más marcados
const bordesGrupos = () => EU ? topojson.mesh(TOPO, TOPO.objects.provinces, (a, b) => a !== b && P[a.id] && P[b.id] && P[a.id][3] !== P[b.id][3])
  : topojson.mesh(TOPO, TOPO.objects.autonomous_regions, (a, b) => a !== b);
gZoom.append("path").attr("class", "ccaa").attr("d", path(bordesGrupos()));
if (composite && projection.getCompositionBorders) gZoom.append("path").attr("class", "inset").attr("d", projection.getCompositionBorders());
const gHint = gZoom.append("g");
// Ceuta y Melilla son diminutas: un punto las hace visibles y un círculo invisible amplía la zona que se puede tocar
const CM = features.filter(f => DOTS.includes(f.id));
// En Europa el punto va en la capital (el Vaticano no tiene superficie en el mapa); Malta y Luxemburgo, en su centro
const dotC = f => EU && !["MT", "LU"].includes(f.id) ? projection(CAPXY[f.id]) : path.centroid(f);
const cmDots = gZoom.append("g").selectAll("circle").data(CM).join("circle")
  .attr("class", "prov cm-dot").attr("data-dot", f => f.id)
  .attr("cx", f => dotC(f)[0]).attr("cy", f => dotC(f)[1]);
const cmLbl = gZoom.append("g").attr("aria-hidden", "true").selectAll("text").data(CM).join("text").attr("class", "cm-lbl")
  .attr("y", f => dotC(f)[1]).text(f => f.id === "VA" ? "Vaticano" : P[f.id][0]);
const markers = gZoom.append("g").selectAll("circle").data(CM).join("circle")
  .attr("class", "marker").attr("r", 11)
  .attr("cx", f => dotC(f)[0]).attr("cy", f => dotC(f)[1])
  .attr("data-id", f => f.id);
const provAll = gZoom.selectAll(".prov");
const dotById = {}; cmDots.each(function (f) { dotById[f.id] = this; });
const gPais = gZoom.append("g").attr("aria-hidden", "true");
const PAISES = AM ? CF.paises
  : EU ? [["Turquía", [34, 39.3]], ["Kazajistán", [55, 48.6], 0.8], ["Georgia", [43.6, 42.2], 0.6], ["Marruecos", [-5.2, 34.4], 0.7], ["Argelia", [3, 34.6], 0.7], ["Túnez", [9.4, 34.6], 0.6], ["Kosovo", [20.9, 42.62], 0.45]]
  : [["Portugal", [-7.75, 40.6]], ["Francia", [0.4, 43.65]], ["Andorra", [1.55, 42.75], 0.6], ["Marruecos", [-4.6, 34.95]], ["Argelia", [-0.4, 35.0]]];
const paisText = gPais.selectAll("text").data(PAISES).join("text").attr("class", "pais")
  .attr("x", d => projVec(d[1])[0]).attr("y", d => projVec(d[1])[1]).text(d => d[0]);
// Capitales (solo en Explorar); Ceuta y Melilla ya tienen su punto
const capData = Object.keys(CAPXY).filter(id => !EU || !DOTS.includes(id)).map(id => ({ id, xy: (composite && projection(CAPXY[id])) || projVec(CAPXY[id]) }));
const capDots = gZoom.append("g").attr("aria-hidden", "true").selectAll("circle").data(capData).join("circle").attr("class", "capdot");
const capLbl = gZoom.append("text").attr("class", "cap-lbl").attr("aria-hidden", "true");
let provNames = null;
function placeNames() {
  if (!provNames) provNames = gNames.selectAll("text").data(ALL.filter(id => !dotById[id])).join("text").attr("class", "provname").text(id => P[id][0]);
  provNames.attr("x", id => C(id)[0]).attr("y", id => C(id)[1]);
}
function placeCaps() {
  capDots.attr("cx", d => (CAN.includes(d.id) ? tCan(d.xy) : d.xy)[0]).attr("cy", d => (CAN.includes(d.id) ? tCan(d.xy) : d.xy)[1])
    .attr("r", HOME[2] * 0.0045);
}
const insetLbl = gPais.append("text").attr("class", "inset-lbl").text(EU ? "" : "Islas Canarias");
// Nombres de todas las provincias: solo se ven en Explorar con el mapa acercado
const gNames = gZoom.append("g").attr("aria-hidden", "true");
const gLbl = gZoom.append("g");
const byId = {}; provPaths.each(function (f) { byId[f.id] = this; });
const featById = {}; features.forEach(f => featById[f.id] = f);
const NB = {}; // provincias vecinas (comparten frontera)
(function colorearComunidades() {
  const geoms = TOPO.objects.provinces.geometries, vec = topojson.neighbors(geoms), adj = {};
  geoms.forEach((g, i) => {
    if (!P[g.id]) return;
    NB[g.id] = new Set(vec[i].map(j => geoms[j].id).filter(id => P[id]));
    const grp = id => CA ? id : P[id][3];
    const a = grp(g.id); adj[a] = adj[a] || new Set();
    vec[i].forEach(j => { const h = geoms[j]; if (P[h.id] && grp(h.id) !== a) adj[a].add(grp(h.id)); });
  });
  const color = {};
  Object.keys(adj).sort((a, b) => adj[b].size - adj[a].size).forEach(a => {
    const usados = new Set([...adj[a]].map(b => color[b]));
    let c = 0; while (usados.has(c)) c++;
    color[a] = c % 6;
  });
  if (EU) Object.keys(adj).sort().forEach((a, i) => color[a] = [0, 2, 4, 1, 3, 5][i] ?? i); // en Europa, cada región con su color
  provAll.attr("data-c", f => P[f.id] ? color[CA ? f.id : P[f.id][3]] : null);
})();

const cCache = {};
// Canarias: en pantallas verticales (móvil) el recuadro va bajo la península y crece hasta llenar el hueco
let canT = [1, 0, 0], canLayout = null, canKey = "";
const tCan = p => [p[0] * canT[0] + canT[1], p[1] * canT[0] + canT[2]];
const canTransform = () => canT[0] === 1 && !canT[1] && !canT[2] ? null : `translate(${canT[1]},${canT[2]}) scale(${canT[0]})`;
const insetRect = document.querySelector("rect.insetbg");
const insetBox = insetRect ? [+insetRect.getAttribute("x"), +insetRect.getAttribute("y"), +insetRect.getAttribute("width"), +insetRect.getAttribute("height")] : null;
// Europa: para encuadrar no cuentan Svalbard, Azores, Madeira ni Canarias
const bCache = {};
// América: solo cuentan las islas cercanas al territorio principal (fuera Alaska, Galápagos, Pascua, el Ártico lejano…)
function principal(f) {
  if (f.geometry.type !== "MultiPolygon") return f;
  const cajas = f.geometry.coordinates.map(p => d3.geoBounds({ type: "Polygon", coordinates: p }));
  const areas = f.geometry.coordinates.map(p => d3.geoArea({ type: "Polygon", coordinates: p }));
  const m = cajas[areas.indexOf(Math.max(...areas))], g = 3;
  const ps = f.geometry.coordinates.filter((p, i) => { const b = cajas[i]; return b[1][0] >= m[0][0] - g && b[0][0] <= m[1][0] + g && b[1][1] >= m[0][1] - g && b[0][1] <= m[1][1] + g; });
  return { type: "Feature", id: f.id, geometry: { type: "MultiPolygon", coordinates: ps } };
}
function continental(f) {
  if (AM) return principal(f);
  if (f.geometry.type !== "MultiPolygon") return f;
  const dentro = p => { const c = d3.geoCentroid({ type: "Polygon", coordinates: p }); return c[0] > -25.5 && c[0] < 50 && c[1] > 34 && c[1] < 71.5; };
  const ps = f.geometry.coordinates.filter(dentro);
  return ps.length ? { type: "Feature", geometry: { type: "MultiPolygon", coordinates: ps } } : f;
}
function bOf(id) {
  if (EU && id === "RU") { const p = RU_GEO.map(projection); return [[d3.min(p, q => q[0]), d3.min(p, q => q[1])], [d3.max(p, q => q[0]), d3.max(p, q => q[1])]]; }
  if (EU && DOTS.includes(id)) { const c = dotC(featById[id]); return [c, c]; }
  if (EU) return bCache[id] || (bCache[id] = path.bounds(continental(featById[id])));
  const b = path.bounds(featById[id]);
  return CAN.includes(id) ? [tCan(b[0]), tCan(b[1])] : b;
}
function boundsOf(ids, padK, extra) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const boxes = ids.map(bOf).concat(extra || []);
  boxes.forEach(b => { x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1]); x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1]); });
  const pad = Math.max(x1 - x0, y1 - y0) * padK;
  return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
}
let HOME, vb;
function setCanaryLayout(below) {
  const mode = below && composite && insetBox ? "below" : "side";
  let s = 1, dx = 0, dy = 0;
  if (mode === "below") {
    const mb = boundsOf(ALL.filter(id => !CAN.includes(id)), 0); // no depende de Canarias
    const gap = mb[3] * 0.06;
    const st = document.getElementById("stage"), A = st.clientWidth / Math.max(1, st.clientHeight);
    // escala que hace que península + Canarias tengan la misma proporción que la pantalla
    const fill = (mb[2] / (A * 0.98) - mb[3] - gap) / insetBox[3];
    s = Math.max(1, Math.min(mb[2] / insetBox[2], fill));
    dx = mb[0] - insetBox[0] * s;
    dy = mb[1] + mb[3] + gap - insetBox[1] * s;
  }
  const key = mode + s.toFixed(2) + (EU ? "|" + Math.round(document.getElementById("stage").clientWidth / Math.max(1, document.getElementById("stage").clientHeight) * 20) : "");
  if (key === canKey) return false;
  canKey = key; canLayout = mode; canT = [s, dx, dy];
  const tr = canTransform();
  [...CAN.map(id => byId[id]), document.querySelector("path.inset"), insetRect, canCoast.node(), canShadow.node()].forEach(el => {
    if (!el) return; tr ? el.setAttribute("transform", tr) : el.removeAttribute("transform");
  });
  if (tr) canShadow.attr("transform", tr + " translate(1.5,2.5)"); else canShadow.attr("transform", "translate(1.5,2.5)");
  Object.keys(cCache).forEach(k => delete cCache[k]);
  const extra = insetBox ? [[tCan([insetBox[0], insetBox[1]]), tCan([insetBox[0] + insetBox[2], insetBox[1] + insetBox[3]])]] : [];
  HOME = boundsOf(ALL, mode === "below" ? 0.016 : 0.03, mode === "below" ? extra : []);
  if (mode === "side" && !EU) HOME[3] += HOME[3] * 0.05; // un poco más de costa africana bajo Ceuta y Melilla
  if (EU) { // Europa es casi cuadrada: en pantallas apaisadas se ensancha el encuadre para que quepa entera
    const st = document.getElementById("stage"), A = st.clientWidth / Math.max(1, st.clientHeight);
    if (A > 0.3 && HOME[2] / HOME[3] < A) { const w = HOME[3] * Math.min(A, 2); HOME[0] -= (w - HOME[2]) / 2; HOME[2] = w; }
  }
  svg.style("aspect-ratio", String(HOME[2] / HOME[3]));
  markers.attr("r", HOME[2] * (EU ? 0.011 : 0.022));
  cmDots.attr("r", HOME[2] * (EU ? 0.0045 : 0.0075));
  cmLbl.attr("x", f => dotC(f)[0] + HOME[2] * (EU ? 0.008 : 0.012));
  // con el recuadro debajo, los rótulos de África quedarían tapados
  paisText.attr("display", d => mode === "below" && (d[0] === "Marruecos" || d[0] === "Argelia") ? "none" : null);
  if (insetBox) {
    const [lx, ly] = tCan([insetBox[0] + insetBox[2] * 0.03, insetBox[1] + insetBox[3] * 0.12]);
    insetLbl.attr("x", lx).attr("y", ly);
  }
  placeCaps();
  sizePaises();
  return true;
}
const mqMobile = matchMedia("(max-width: 860px), (max-height: 520px)");
const mqTablet = matchMedia("(hover: none) and (pointer: coarse) and (min-width: 861px) and (min-height: 521px)");
document.body.classList.toggle("tablet", mqTablet.matches);
mqTablet.addEventListener("change", () => { document.body.classList.toggle("tablet", mqTablet.matches); onResize(); });
function stageIsPortrait() {
  const s = document.getElementById("stage");
  return mqMobile.matches && s.clientWidth / Math.max(1, s.clientHeight) < 1.15;
}
let vistaZona = false; // true cuando se está viendo una zona concreta
function layoutMap() {
  const app = $(".app"), st = $("#stage");
  app.classList.remove("fitted");
  let changed = setCanaryLayout(stageIsPortrait());
  if (canLayout === "below" && !document.body.classList.contains("mode-explore") &&
      st.clientWidth * HOME[3] / HOME[2] < st.clientHeight - 60) {
    app.classList.add("fitted");
    changed = setCanaryLayout(stageIsPortrait()) || changed;
  }
  alinearMapa();
  return changed;
}
layoutMap();
vb = HOME.slice();
svg.attr("viewBox", HOME.join(" "));
// Con España entera en vertical, el mapa se pega arriba (el mar que sobre queda abajo);
// al acercar una zona (Andalucía, Canarias…) se centra, para que no quede un hueco vacío debajo
function alinearMapa() {
  svg.attr("preserveAspectRatio", canLayout === "below" && !vistaZona ? "xMidYMin meet" : null);
}
function zoomTo(ids) {
  const target = ids ? boundsOf(ids, 0.1) : HOME;
  vistaZona = !!ids; alinearMapa();
  const from = vb.join(" "), to = target.join(" ");
  vb = target;
  zoom.translateExtent([[target[0], target[1]], [target[0] + target[2], target[1] + target[3]]]);
  svg.call(zoom.transform, d3.zoomIdentity);
  svg.transition("vb").duration(reduceMotion() ? 0 : 600).attrTween("viewBox", () => d3.interpolateString(from, to));
}
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

