// ---------- Estado ----------
const S = { mode: "find", region: "all", pool: [], queue: [], cur: null, tries: 0, results: {}, score: 0, streak: 0, best: 0, t0: 0, timer: null, locked: false, requeued: {} };

// 4.0 · «Sin países pequeños»: quita los países e islas diminutos (los que llevan punto en el mapa), a elección
const sinPeq = () => EU && store.get(KP + "sinPeq") === true;
function poolFor(region) {
  const z = ALL.filter(id => enZona(id, region));
  if (!sinPeq()) return z;
  const g = z.filter(id => !DOTS.includes(id));
  return g.length ? g : z; // si en la zona solo hay islas pequeñas (Micronesia, Polinesia), se quedan
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function applyRegionView() {
  const ids = S.pool;
  if (typeof setKFocus === "function") setKFocus(null);
  provAll.classed("off", f => P[f.id] && !ids.includes(f.id));
  markers.classed("off", f => !ids.includes(f.id));
  cmDots.classed("off", f => !ids.includes(f.id));
  zoomTo(S.region === "all" ? null : ids);
  $("#regionLabel").textContent = S.region === "all" ? M.cont : ZN(S.region);
  $("#regionChip").textContent = S.region === "all" ? M.cont : ZN(S.region);
  $("#regionChip").hidden = S.region === "all"; // con España entera, el rótulo solo tapaba Galicia
  if (typeof renderZone === "function") renderZone();
}

