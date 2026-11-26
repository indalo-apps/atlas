// ---------- Mensajes flotantes sobre el mapa ----------
let toastTimer = null;
function toast(id, html, kind, ms) {
  const box = $("#toasts"); box.innerHTML = "";
  const el = document.createElement("div");
  el.className = "toast " + (kind || ""); el.innerHTML = html; box.appendChild(el);
  const sr = $("#stage").getBoundingClientRect();
  if (id) {
    const c = d3.zoomTransform(svg.node()).apply(C(id));
    const pt = svg.node().createSVGPoint(); pt.x = c[0]; pt.y = c[1];
    const s = pt.matrixTransform(svg.node().getScreenCTM());
    const x = s.x - sr.left, w = el.offsetWidth, h = el.offsetHeight;
    let y = s.y - sr.top;
    const left = Math.min(Math.max(x, w / 2 + 8), sr.width - w / 2 - 8);
    el.style.setProperty("--tip", Math.min(90, Math.max(10, 50 + (x - left) / w * 100)) + "%");
    if (y - h - 14 < 6) y = h + 20; // sin sitio encima: se baja un poco
    el.style.left = left + "px"; el.style.top = y + "px";
  } else { el.classList.add("top"); el.style.left = "50%"; el.style.top = "12px"; }
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, ms);
}

// ---------- Toques precisos: si el dedo cae en el mar o en una frontera, vale la provincia más cercana ----------
function nearestAt(x, y) {
  const radii = matchMedia("(pointer: coarse)").matches ? [8, 16, 24] : [5, 10];
  for (const r of radii) for (let a = 0; a < 8; a++) {
    const el = document.elementFromPoint(x + r * Math.cos(a * Math.PI / 4), y + r * Math.sin(a * Math.PI / 4));
    if (!el || !el.classList) continue;
    if ((el.classList.contains("prov") || el.classList.contains("marker")) && !el.classList.contains("off") && !el.classList.contains("nogame")) {
      const id = el.getAttribute("data-id");
      if (S.pool.includes(id)) return id;
    }
  }
  return null;
}
svg.on("click.near", e => {
  const c = e.target.classList;
  if (c && ((c.contains("prov") && !c.contains("off") && !c.contains("nogame")) || c.contains("marker"))) return;
  const id = nearestAt(e.clientX, e.clientY);
  if (id) onMapClick(id);
});

