// ---------- Imagen para compartir el resultado ----------
const MODOS = { find: tx("Encuéntrala", "Encuéntralo"), name: "¿Cuál es?", cap: "Capitales", time: "Contrarreloj · 60 segundos", gent: "Gentilicios", shape: "Siluetas", flag: "Banderas" };
function hexRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function mixHex(a, b, t) { const x = hexRgb(a), y = hexRgb(b); return "rgb(" + x.map((v, i) => Math.round(v * t + y[i] * (1 - t))).join(",") + ")"; }
async function makeShareImage() {
  try { await document.fonts.ready; } catch (e) {}
  const v = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const col = { bg: v("--bg"), sea: v("--sea"), land: v("--land"), dim: v("--land-dim"), foreign: v("--foreign"), line: v("--line"),
    ink: v("--ink"), muted: v("--muted"), accent: v("--accent"), ok: v("--ok"), warn: v("--warn"), bad: v("--bad"), ccaa: v("--ccaa"), halo: v("--halo") };
  const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  const DISP = '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif', BODY = '"Atkinson Hyperlegible", system-ui, sans-serif';
  x.fillStyle = col.bg; x.fillRect(0, 0, W, H);
  x.fillStyle = col.ink; x.font = "800 64px " + DISP; x.fillText((M.espana ? (CA ? "Atlas · Comunidades" : "Atlas · Provincias") : "Atlas de " + M.cont), 64, 112);
  x.fillStyle = col.muted; x.font = "700 34px " + BODY;
  x.fillText((MODOS[S.mode] || "") + " · " + ZN(S.region), 64, 164);
  // tarjeta del mapa
  const card = [48, 200, W - 96, 800];
  x.save(); x.beginPath(); x.roundRect(...card, 28); x.fillStyle = col.sea; x.fill(); x.clip();
  const pad = 24, k = Math.min((card[2] - 2 * pad) / HOME[2], (card[3] - 2 * pad) / HOME[3]);
  const ox = card[0] + (card[2] - HOME[2] * k) / 2 - HOME[0] * k, oy = card[1] + (card[3] - HOME[3] * k) / 2 - HOME[1] * k;
  x.translate(ox, oy); x.scale(k, k);
  const lw = px => px / k;
  // patrones para "con fallo" (puntos) y "para repasar" (rayas)
  const pat = (bg, fg, dots) => {
    const c = document.createElement("canvas"); c.width = c.height = 12; const g = c.getContext("2d");
    g.fillStyle = bg; g.fillRect(0, 0, 12, 12); g.fillStyle = fg; g.strokeStyle = fg; g.lineWidth = 3;
    if (dots) { g.beginPath(); g.arc(6, 6, 2.2, 0, 7); g.fill(); } else { g.beginPath(); g.moveTo(-3, 15); g.lineTo(15, -3); g.moveTo(-3, 3); g.lineTo(3, -3); g.moveTo(9, 15); g.lineTo(15, 9); g.stroke(); }
    const p = x.createPattern(c, "repeat"); p.setTransform(new DOMMatrix().scale(1 / k)); return p;
  };
  const fills = { ok: mixHex(col.ok, col.land, .55), meh: pat(mixHex(col.warn, col.land, .4), col.warn, true), bad: pat(mixHex(col.bad, col.land, .4), col.bad, false) };
  const stateOf = id => !S.results[id] ? null : (S.requeued[id] && S.results[id] !== "bad" ? "meh" : S.results[id]);
  const fillOf = id => { const s = stateOf(id); return s ? fills[s] : (P[id] && S.pool.includes(id) ? col.land : EU && !P[id] ? col.foreign : col.dim); };
  const withCan = (fn) => { x.save(); const tr = canT; x.translate(tr[1], tr[2]); x.scale(tr[0], tr[0]); fn(); x.restore(); };
  x.fillStyle = col.foreign; x.strokeStyle = col.line; x.lineWidth = lw(1);
  VECINOS.features.forEach(f => { const p2 = new Path2D(pathVec(f)); x.fill(p2); x.stroke(p2); });
  if (insetBox) withCan(() => { x.fillStyle = col.sea; x.fillRect(...insetBox); });
  features.forEach(f => {
    const draw = () => { const p2 = new Path2D(path(f)); x.fillStyle = fillOf(f.id); x.fill(p2); x.strokeStyle = col.line; x.lineWidth = lw(1); x.stroke(p2); };
    CAN.includes(f.id) ? withCan(draw) : draw();
  });
  x.strokeStyle = col.ccaa; x.lineWidth = lw(2.2); x.stroke(new Path2D(path(bordesGrupos())));
  CM.forEach(f => { const c = dotC(f); x.beginPath(); x.arc(c[0], c[1], HOME[2] * (EU ? 0.005 : 0.008), 0, 7); x.fillStyle = fillOf(f.id); x.fill(); x.strokeStyle = col.ink; x.lineWidth = lw(2); x.stroke(); });
  if (insetBox) withCan(() => { x.setLineDash([lw(8) / canT[0], lw(8) / canT[0]]); x.strokeStyle = col.line; x.lineWidth = lw(2) / canT[0]; x.strokeRect(...insetBox); });
  x.restore();
  // puntuación y resumen
  const ids = Object.keys(S.results), n = ids.length, first = ids.filter(id => stateOf(id) === "ok").length;
  x.fillStyle = col.accent; x.font = "800 132px " + DISP; x.fillText(String(S.score), 64, 1152);
  const sw = x.measureText(String(S.score)).width;
  x.fillStyle = col.muted; x.font = "700 40px " + BODY; x.fillText("puntos", 64 + sw + 18, 1152);
  x.fillStyle = col.ink; x.font = "700 40px " + DISP;
  const nb = ids.filter(id => stateOf(id) === "bad").length;
  x.fillText((S.hits || 0) + " aciertos · " + (S.errors || 0) + " errores", 64, 1222);
  // leyenda
  let lx = 64; x.font = "700 28px " + BODY;
  [["A la primera", fills.ok], ["Con algún fallo", fills.meh], ["Para repasar", fills.bad]].forEach(([txt, f]) => {
    x.save(); x.fillStyle = f; if (typeof f !== "string") f.setTransform(new DOMMatrix()); x.fillRect(lx, 1258, 30, 30); x.restore();
    x.strokeStyle = col.line; x.lineWidth = 1.5; x.strokeRect(lx, 1258, 30, 30);
    x.fillStyle = col.muted; x.fillText(txt, lx + 42, 1283); lx += 42 + x.measureText(txt).width + 36;
  });
  x.fillStyle = col.muted; x.font = "700 26px " + BODY; x.textAlign = "right"; x.fillText("indalo-apps.github.io/atlas", W - 64, 1328);
  return new Promise(res => cv.toBlob(res, "image/png"));
}
async function shareResult() {
  const btn = $("#e-share"); btn.disabled = true;
  try {
    const blob = await makeShareImage();
    const file = new File([blob], "atlas.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Atlas" }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    const url = URL.createObjectURL(blob);
    $("#shareImg").src = url; const dl = $("#shareDl"); if (dl) dl.href = url;
    $("#shareModal").hidden = false; $("#shareClose").focus();
  } finally { btn.disabled = false; }
}
$("#e-share").addEventListener("click", shareResult);
$("#shareClose").addEventListener("click", () => { $("#shareModal").hidden = true; $("#e-share").focus(); });
$("#shareModal").addEventListener("click", e => { if (e.target.id === "shareModal") $("#shareModal").hidden = true; });

