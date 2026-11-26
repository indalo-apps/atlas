// ---------- Duelo ----------
const jug = i => (($(i ? "#p2n" : "#p1n").value || "").trim() || ("Jugador " + (i + 1)));
function answerDuel(id) {
  S.locked = true;
  const yo = S.turn, nm = name(S.cur);
  if (id === S.cur) {
    S.pts[yo]++; S.hits++;
    if (!S.results[S.cur]) S.results[S.cur] = "ok";
    Sound.play("ok");
    cls(S.cur, "p" + (yo + 1));
    toast(S.cur, "✓ " + nm + " · <b>" + jug(yo) + "</b>", "ok", 1000);
    later(next, 1100);
  } else {
    S.errors++;
    S.results[S.cur] = "bad";
    Sound.play("bad");
    const qc = $("#qcard"); qc.classList.remove("shake"); void qc.offsetWidth; qc.classList.add("shake");
    if (id) { cls(id, "flash-bad"); later(() => cls(id, "flash-bad", false), 1500); }
    cls(S.cur, "reveal"); label(S.cur, nm);
    toast(null, (id ? "Eso es " + name(id) + ". " : "") + "Era <b>" + nm + "</b>", "warn", 1700);
    later(next, 1900);
  }
  renderStats();
}
function skipTimed() {
  if (S.locked || !S.cur) return;
  S.errors++; S.streak = 0;
  if (!S.results[S.cur]) S.results[S.cur] = "bad";
  toast(null, "Era <b>" + name(S.cur) + "</b>", "warn", 1000);
  next();
}
function answer(id, btn) {
  if (S.locked || !S.cur || S.mode === "explore") return;
  if (!S.pool.includes(id)) return;
  if (S.mode === "time") return answerTimed(id);
  if (S.mode === "duel") return answerDuel(id);
  const fb = $("#feedback");
  if (id === S.cur) {
    S.locked = true;
    const pts = [10, 5, 2][S.tries] || 0;
    S.score += pts; S.streak++; S.hits++; S.best = Math.max(S.best, S.streak);
    const racha = S.streak;
    if ([5, 10, 20, 30, 40, 50].includes(racha)) later(() => {
      toast(null, "¡Racha de <b>" + racha + "</b> seguidas!", "ok", 1800);
      Sound.play("streak");
      const b = $("#streak"); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    }, 350);
    S.results[S.cur] = S.tries === 0 ? "ok" : "meh";
    memUpdate(S.cur, S.tries === 0 && !S.requeued[S.cur]);
    Sound.play("ok");
    cls(S.cur, "target", false); cls(S.cur, "flash-ok"); cls(S.cur, "done-ok");
    $("#shapebox").hidden = true; $("#flagbox").hidden = true; // en Siluetas y Banderas se descubre el mapa para ver dónde está
    gHint.selectAll(".ring").remove();
    const oc = C(S.cur);
    const rp = gLbl.append("circle").attr("class", "ripple").attr("cx", oc[0]).attr("cy", oc[1]).attr("r", HOME[2] * 0.035 / curK);
    setTimeout(() => rp.remove(), 800);
    if (btn) btn.classList.add("ok");
    const cap = P[S.cur][2], nm = name(S.cur);
    toast(S.cur, "✓ " + (S.mode === "cap" ? cap + " · " + nm : S.mode === "gent" ? nm + " · " + gents(S.cur).join(" o ") : nm) + " <b>+" + pts + "</b>", "ok", 1200);
    fb.className = "feedback ok";
    fb.innerHTML = numify((S.tries === 0 ? "¡Correcto! +" : "Bien, a la " + (S.tries + 1) + "ª. +") + pts +
      (S.mode === "cap" ? ". " + cap + " es la capital de " + nm + "." : (nm !== cap && !FCA() ? ". Capital: " + cap + "." : ".")));
    if (S.mode === "flag") { const ft = document.createElement("span"); ft.className = "flagtxt"; ft.textContent = "Bandera de " + nm + ": " + bandera(S.cur) + "."; fb.appendChild(ft); }
    if (btn) $("#options").querySelectorAll("button").forEach(b => b.disabled = true);
    later(next, S.tries === 0 ? 1100 : 1600);
    return;
  }
  S.tries++; S.streak = 0; S.errors++;
  if (S.tries < 3) Sound.play("bad");
  const qc = $("#qcard"); qc.classList.remove("shake"); void qc.offsetWidth; qc.classList.add("shake");
  if (btn) { btn.classList.add("bad"); btn.disabled = true; }
  else { avisoZoom(); cls(id, "flash-bad"); toast(id, "Eso es " + name(id) + (S.mode === "gent" && (CA ? GENT_CA : GENT)[id] ? " (" + gents(id).join(" o ") + ")" : ""), "bad", 1400); setTimeout(() => cls(id, "flash-bad", false), 1400); }
  if (S.tries === 1) memUpdate(S.cur, false);
  if (S.tries >= 3) return reveal();
  fb.className = "feedback bad";
  if (S.tries === 1) fb.textContent = btn ? "No es " + name(id) + ". Prueba otra vez." : "Eso es " + name(id) + ". Prueba otra vez.";
  else if (FCA()) { fb.className = "feedback bad"; fb.textContent = "Tampoco. Te queda un intento."; }
  else { const c = hintRegion(); fb.className = "feedback warn"; fb.textContent = "Pista: está en " + (CA ? "la zona " : "") + c + " (marcada en el mapa)."; later(() => toast(null, "Pista: está en " + (CA ? "la zona " : "") + "<b>" + c + "</b>", "warn", 2400), btn ? 0 : 900); }
  renderStats();
}

function reveal() {
  if (S.tries < 3) S.errors++; // pedir la respuesta cuenta como un error (tras 3 fallos ya están contados)
  S.locked = true; S.streak = 0;
  S.results[S.cur] = "bad";
  memUpdate(S.cur, false);
  Sound.play("reveal");
  cls(S.cur, "target", false); cls(S.cur, "reveal");
  gHint.selectAll(".ring").remove();
  label(S.cur, name(S.cur));
  toast(null, "Era <b>" + name(S.cur) + "</b> · volverá a salir", "warn", 2400);
  if (OPT_MODES.includes(S.mode)) $("#options").querySelectorAll("button").forEach(b => { b.disabled = true; if (b.dataset.id === S.cur) b.classList.add("ok"); });
  $("#shapebox").hidden = true; $("#flagbox").hidden = true;
  const cap = P[S.cur][2], nm = name(S.cur);
  $("#feedback").className = "feedback warn";
  $("#feedback").textContent = "Era " + nm + (nm !== cap && !FCA() ? " (capital: " + cap + ")" : "") + ". Volverá a salir más adelante." +
    (S.mode === "flag" ? " Su bandera: " + bandera(S.cur) + "." : "");
  // Repetición: vuelve a la cola unas preguntas más tarde, una sola vez
  if (!S.requeued[S.cur]) { S.requeued[S.cur] = true; S.queue.splice(Math.min(3, S.queue.length), 0, S.cur); S.total++; } // S.total cuenta preguntas; lo que se ve es S.n0
  renderStats();
  later(next, 2600);
}

const numify = s => String(s).replace(/\d+([:.,]\d+)*/g, '<span class="num">$&</span>');
function countUp(el, to, ms) {
  if (!ms) { el.textContent = to; return; }
  const t0 = performance.now();
  const tick = now => { const k = Math.min(1, (now - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function fmt(ms) { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
// 5.1 · Hechas: las que ya no van a volver a salir. El total no cambia aunque una provincia fallada vuelva a la cola
function hechas() {
  const quedan = new Set(S.queue); if (S.cur && !S.locked) quedan.add(S.cur);
  return Math.max(0, (S.n0 || 0) - quedan.size);
}
function renderStats() {
  const done = hechas();
  $("#s-done").textContent = S.mode === "time" ? S.hits : done + "/" + S.n0;
  $("#s-score").textContent = S.mode === "duel" ? S.pts[1] : S.score;
  $("#s-streak").textContent = S.mode === "duel" ? Math.min(S.rounds, Math.ceil(S.qn / 2)) + "/" + S.rounds : S.streak;
  if (S.mode === "duel") $("#s-done").textContent = S.pts[0];
  const sb = $("#streak");
  sb.hidden = S.streak < 3 || !S.cur || S.mode === "time" || S.mode === "duel";
  $("#streakN").textContent = S.streak;
  sb.classList.toggle("hot", S.streak >= 10);
  const pct = S.n0 ? Math.round(done / S.n0 * 100) : 0;
  if (S.mode !== "time") $("#bar").style.width = pct + "%";
  $("#progress").setAttribute("aria-valuenow", pct);
  if (S.hits + S.errors > 0 || (S.mode === "duel" && S.qn > 1)) $("#howto").hidden = true; // tras la primera respuesta ya no hace falta
  $("#restart").hidden = !(S.hits + S.errors > 0 || Object.keys(S.results).length > 0 || (S.mode === "duel" && S.qn > 1));
}

// Confeti para celebrar partidas perfectas, récords y victorias (no se lanza si se pide menos movimiento)
let confetiActivo = false;
function confeti() {
  if (confetiActivo || reduceMotion()) return;
  confetiActivo = true;
  const cv = document.createElement("canvas"), dpr = Math.min(2, devicePixelRatio || 1);
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60";
  cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr, x = cv.getContext("2d");
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const cols = [css("--accent"), css("--ok"), css("--warn"), css("--bad"), "#ffcc4d"];
  const ps = Array.from({ length: 140 }, () => ({
    x: W * (0.2 + Math.random() * 0.6), y: H * 0.35, vx: (Math.random() - .5) * 18 * dpr, vy: (-10 - Math.random() * 14) * dpr,
    w: (6 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[Math.floor(Math.random() * cols.length)],
  }));
  const t0 = performance.now();
  (function cuadro(now) {
    const k = (now - t0) / 1800;
    x.clearRect(0, 0, W, H);
    ps.forEach(p => {
      p.vy += 0.45 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.globalAlpha = Math.max(0, 1 - k * k); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); x.restore();
    });
    if (k < 1) requestAnimationFrame(cuadro); else { cv.remove(); confetiActivo = false; }
  })(t0);
}
function finishDuel() {
  const [a, b] = S.pts;
  $("#e-title").textContent = a === b ? "¡Empate!" : "¡Gana " + jug(a > b ? 0 : 1) + "!";
  if (a !== b) confeti();
  [["#t-ok", a, 0], ["#t-bad", b, 1]].forEach(([sel, v, i]) => {
    $(sel).textContent = v; $(sel + "-l").textContent = jug(i) + " · " + (v === 1 ? "acierto" : "aciertos");
    $(sel).parentNode.classList.toggle("zero", !v);
  });
  $("#e-summary").innerHTML = numify(S.rounds + (S.rounds === 1 ? " ronda" : " rondas") + " cada uno");
  $("#e-best").textContent = "";
  $("#e-fails").innerHTML = ""; $("#e-review").hidden = true;
  $("#turn").hidden = true;
  $("#qcard").hidden = true; $("#endcard").hidden = false;
  setTimeout(() => $("#e-again").focus({ preventScroll: true }), 400);
  announce("Duelo terminado. " + $("#e-title").textContent + " " + jug(0) + " " + a + ", " + jug(1) + " " + b + ".");
}
function finish() {
  clearInterval(S.timer); S.cur = null; renderStats();
  if (S.mode === "duel") { setKFocus(null); Sound.play("end"); $("#skip2").textContent = "Ver resultados"; return finishDuel(); }
  setKFocus(null);
  Sound.play("end");
  const ms = Date.now() - S.t0; S.endMs = ms;
  const ids = Object.keys(S.results);
  // Resultado final por provincia: si se falló alguna vez pero luego se acertó, queda "con fallo"
  const fails = ids.filter(id => S.results[id] === "bad");
  const firstTry = ids.filter(id => S.results[id] === "ok" && !S.requeued[id]).length;
  provAll.classed("target selected flash-bad flash-ok reveal done-ok", false); gLbl.selectAll("*").remove(); gHint.selectAll("*").remove();
  const order = ids.slice().sort((a, b) => C(a)[0] - C(b)[0]);
  const step = reduceMotion() ? 0 : Math.min(28, 1100 / Math.max(1, order.length));
  order.forEach((id, i) => {
    byId[id].style.setProperty("--d", (i * step) + "ms");
    byId[id].classList.add("pop");
    cls(id, S.requeued[id] && S.results[id] !== "bad" ? "r-meh" : "r-" + S.results[id]);
  });
  setTimeout(() => order.forEach(id => byId[id].classList.remove("pop")), order.length * step + 700);
  countUp($("#e-score"), S.score, reduceMotion() ? 0 : 900);
  $("#skip2").textContent = "Ver resultados";
  $("#legend").hidden = false;
  const n = ids.length;
  const pct = n ? Math.round(firstTry / n * 100) : 0;
  if (S.mode !== "time" && n >= 3 && pct === 100) confeti();
  $("#e-title").textContent = S.mode === "time"
    ? (S.hits >= 30 ? "¡Imparable!" : S.hits >= 20 ? "¡Muy rápido!" : S.hits >= 10 ? "¡Bien hecho!" : "¡Se acabó el tiempo!")
    : pct === 100 ? "¡Perfecto!" : pct >= 80 ? "¡Muy bien!" : pct >= 50 ? "Vas por buen camino" : "Sigue practicando";
  $("#clock").hidden = true;
  const nOk = firstTry, nBad = ids.filter(id => S.results[id] === "bad").length, nMeh = n - nOk - nBad;
  // Aciertos: respuestas correctas. Errores: respuestas equivocadas y veces que se pidió la respuesta
  [["#t-ok", S.hits, "Acierto", "Aciertos"], ["#t-bad", S.errors, "Error", "Errores"]].forEach(([sel, v, uno, varios]) => {
    $(sel).textContent = v; $(sel + "-l").textContent = v === 1 ? uno : varios; $(sel).parentNode.classList.toggle("zero", !v);
  });
  $("#e-summary").innerHTML = numify((S.mode === "time" ? "En 60 segundos · " : "") + "Racha máxima: " + S.best);
  const key = KP + S.mode + (S.mode === "cap" && capOnly() ? "-distintas" : "") + (FCA() ? "-comunidades" : "") + ":" + S.region;
  let rec = S.review ? null : store.get(key);
  if (!S.review) {
    const better = !rec || S.score > rec.score || (S.score === rec.score && ms < rec.ms);
    if (better) { store.set(key, { score: S.score, ms }); $("#e-best").textContent = rec ? "¡Nuevo récord en esta zona y modo!" : "Primer récord guardado para esta zona y modo."; if (rec) confeti(); }
    else $("#e-best").innerHTML = numify("Tu récord aquí: " + (S.mode === "time" ? rec.score / 10 + " aciertos." : rec.score + " puntos."));
  } else $("#e-best").textContent = "Partida de repaso (no cuenta para el récord).";
  const toReview = ids.filter(id => S.results[id] !== "ok" || S.requeued[id]);
  const box = $("#e-fails"); box.innerHTML = "";
  toReview.forEach(id => { const s = document.createElement("span"); s.textContent = name(id); box.appendChild(s); });
  $("#e-review").hidden = !toReview.length || S.mode === "time"; // en contrarreloj se vuelve a jugar entero
  $("#e-review").onclick = () => newGame(toReview);
  $("#qcard").hidden = true; $("#endcard").hidden = false;
  setTimeout(() => ($("#e-review").hidden ? $("#e-again") : $("#e-review")).focus({ preventScroll: true }), 400);
  announce("Partida terminada. " + $("#e-title").textContent + " " + S.hits + " aciertos y " + S.errors + " errores.");
  $("#streak").hidden = true;
  renderDue();
}

