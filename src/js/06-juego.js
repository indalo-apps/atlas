// ---------- Repaso entre días ----------
// Cada provincia fallada entra en una "caja"; cada acierto a la primera la sube y la aleja en el tiempo
// (hoy, 1, 3, 7 y 14 días). Al superar la última caja se da por aprendida y sale del repaso.
const MEM_KEY = KP + "repaso", DIA = 864e5, CAJAS = [0, 1, 3, 7, 14];
const capOnly = () => $("#capOnly").checked;
function memUpdate(id, bien) {
  if (S.mode === "explore" || S.mode === "time" || S.mode === "duel") return;
  const all = store.get(MEM_KEY) || {}, m = all[S.mode] = all[S.mode] || {};
  if (!m[id] && bien) return; // solo se siguen las que alguna vez se fallaron
  const caja = bien ? (m[id].b + 1) : 0;
  if (caja >= CAJAS.length) delete m[id];
  else m[id] = { b: caja, due: Date.now() + CAJAS[caja] * DIA };
  store.set(MEM_KEY, all);
  renderDue();
}
// El repaso es del último modo de práctica que se haya usado
const PRACTICA = EU ? ["find", "name", "cap", "shape", "flag"] : ["find", "name", "cap", "gent", "shape", "flag"];
let ultimaPractica = PRACTICA.includes(store.get(KP + "practica")) ? store.get(KP + "practica") : "find";
function dueIds(modo = ultimaPractica) {
  const m = (store.get(MEM_KEY) || {})[modo] || {}, ahora = Date.now() + 60e3;
  return Object.keys(m).filter(id => P[id] && m[id].due <= ahora).sort((a, b) => m[a].b - m[b].b);
}
function renderDue() {
  const n = dueIds().length, nombre = $("#m-" + ultimaPractica).querySelector("b").textContent;
  $("#m-due").disabled = !n; $("#m-due").hidden = !n; // 5.1 · solo se ve cuando hay algo que repasar
  $("#dueTxt").innerHTML = n ? numify(n + (n === 1 ? " pendiente" : " pendientes") + " · " + nombre) : "Nada pendiente hoy";
}
// 4.3.2 · ¿Hay algo que una actualización no debe cortar? Una partida empezada o sus resultados en pantalla
// (antes, al terminar, la versión nueva recargaba la app y se perdía la pantalla de resultados)
window.atlasEnPartida = () => typeof S !== "undefined" && S.mode !== "explore" &&
  (S.cur ? (S.hits + S.errors) > 0 : Object.keys(S.results || {}).length > 0);
const pending = [];
function later(fn, ms) { pending.push(setTimeout(fn, ms)); }
// 5.1 · Las preguntas de un juego en la zona elegida (también sirve para decir cuántas son antes de empezar)
function preguntasDe(modo, onlyIds) {
  let pool = poolFor(S.region), base = (onlyIds || pool).slice(), capAviso = false, gentAviso = false, shapeAviso = false;
  if (modo === "gent") { // Las dos provincias de Canarias no tienen gentilicio propio: esa zona se juega con toda España
    const conG = id => (CA ? GENT_CA : GENT)[id], g = base.filter(conG);
    if (g.length) base = g; else { base = ALL.filter(conG); pool = base.slice(); gentAviso = true; }
  }
  if (modo === "shape" && NO_SHAPE.length) { // islas diminutas: sin silueta; si la zona solo tiene de esas, se juega con todo el mapa
    const b2 = base.filter(id => !NO_SHAPE.includes(id));
    if (b2.length) base = b2; else if (!onlyIds) { base = ALL.filter(id => !NO_SHAPE.includes(id)); pool = base.slice(); shapeAviso = true; }
  }
  if (modo === "duel") { // 10 rondas por jugador como mucho, alternando turnos
    const rondas = Math.max(1, Math.min(10, Math.floor(base.length / 2)));
    base = shuffle(base).slice(0, rondas * 2);
    if (base.length < rondas * 2) base = base.concat(shuffle(ALL.filter(id => pool.includes(id))).slice(0, rondas * 2 - base.length));
  }
  if (modo === "flag" && !EU) {
    if (CA) {} else if (flagCa()) { // una provincia por comunidad (la que haga de comunidad en la pregunta)
      const vistas = {}; base = shuffle(base).filter(id => !vistas[P[id][3]] && (vistas[P[id][3]] = true));
    } else { const b2 = base.filter(id => !SIN_BANDERA.includes(id) && !NO_SE_PREGUNTA.includes(id)); if (b2.length) base = b2; }
  }
  if (modo === "cap" && M.sinCap) { const b2 = base.filter(id => !M.sinCap.includes(id)); if (b2.length) base = b2; } // capitales en disputa: no se preguntan
  if (modo === "cap" && capOnly() && !onlyIds) {
    const distintas = base.filter(id => M.capIgual ? !M.capIgual.includes(id) : !P[id][2].startsWith(P[id][0]));
    if (distintas.length) base = distintas; else capAviso = true;
  }
  return { pool, base, capAviso, gentAviso, shapeAviso };
}
function newGame(onlyIds) {
  if (window.atlasActualizarSiToca && window.atlasActualizarSiToca()) return; // versión nueva esperando: se estrena ya, antes de empezar
  clearInterval(S.timer);
  pending.splice(0).forEach(clearTimeout); // lo que quedara de la partida anterior (pasar de pregunta, mensajes)
  $("#toasts").innerHTML = "";
  clearMarks();
  const q = preguntasDe(S.mode, onlyIds);
  S.pool = q.pool; let base = q.base;
  const { capAviso, gentAviso, shapeAviso } = q;
  S.queue = shuffle(base);
  S.total = S.n0 = S.queue.length;
  if (S.mode === "duel") S.rounds = Math.max(1, Math.round(S.total / 2));
  S.pts = [0, 0]; S.turn = 0; S.qn = 0;
  provAll.classed("p1 p2", false); $("#shapebox").hidden = true; $("#flagbox").hidden = true;
  S.results = {}; S.requeued = {}; S.errors = 0; S.hits = 0; S.score = 0; S.streak = 0; S.best = 0; S.cur = null; S.review = !!onlyIds;
  applyRegionView();
  $("#legend").hidden = true;
  $("#endcard").hidden = true;
  const explore = S.mode === "explore";
  $("#qcard").hidden = explore; $("#statcard").hidden = explore; $("#infocard").hidden = !explore;
  document.body.classList.toggle("mode-explore", explore);
  if (typeof onResize === "function") onResize();
  if (typeof renderCuantas === "function") renderCuantas();
  if (explore) { $("#i-name").textContent = tx("Toca una provincia", "Toca un país"); $("#i-cap").textContent = "—"; $("#i-ccaa").textContent = "—"; $("#i-flag").hidden = true; $("#i-fnote").hidden = true; return; }
  S.t0 = Date.now();
  const timed = S.mode === "time";
  const duel = S.mode === "duel";
  $("#clock").hidden = !timed; $("#turn").hidden = !duel;
  $("#s-done-l").textContent = timed ? "Aciertos" : duel ? jug(0) : "Hechas";
  $("#s-score-l").textContent = duel ? jug(1) : "Puntos";
  $("#s-streak-l").textContent = duel ? "Ronda" : "Racha";
  $("#skip").textContent = $("#skip2").textContent = timed ? "Saltar" : duel ? "Pasar" : "Ver respuesta";
  $(".bigscore").hidden = duel; $("#e-share").hidden = duel;
  $("#t-ok").parentNode.classList.toggle("duel1", duel); $("#t-bad").parentNode.classList.toggle("duel2", duel);
  if (timed) cuentaAtras(); // 5 · 3, 2, 1 antes de que empiece a correr el reloj
  else next();
  explicar();
  if (shapeAviso) toast(null, "Las islas de esta zona son tan pequeñas que no tienen silueta: juegas con todo el mapa", "warn", 3600);
  if (gentAviso) toast(null, "Las provincias de Canarias no tienen gentilicio propio: juegas con toda España", "warn", 3600);
  if (capAviso) toast(null, tx("En esta zona todas las capitales se llaman como su provincia", "En esta zona todas las capitales se llaman como su país"), "warn", 3200);
  renderDue();
}

function next() {
  gLbl.selectAll("*").remove(); gHint.selectAll("*").remove();
  provAll.classed("target selected flash-bad flash-ok reveal", false);
  if (S.mode === "time" && !S.queue.length) { // contrarreloj: se baraja otra vez, sin repetir la última
    const last = S.cur; S.queue = shuffle(S.pool.slice());
    if (S.queue.length > 1 && S.queue[0] === last) S.queue.push(S.queue.shift());
  }
  if (!S.queue.length) return finish();
  S.cur = S.queue.shift(); S.tries = 0; S.locked = false;
  const [nm, alt, cap, ccaa] = P[S.cur];
  $("#feedback").textContent = ""; $("#feedback").className = "feedback";
  $("#options").hidden = !OPT_MODES.includes(S.mode);
  $("#shapebox").hidden = S.mode !== "shape";
  $("#flagbox").hidden = S.mode !== "flag";
  const seeking = ["find", "cap", "time", "gent", "duel"].includes(S.mode);
  $("#qcard").classList.toggle("seeking", seeking); $("#qcard").classList.toggle("capmode", S.mode === "cap");
  if (S.mode === "duel") {
    S.turn = S.qn % 2; S.qn++;
    const pc = S.turn ? "var(--p2)" : "var(--p1)";
    $("#turn").textContent = jug(S.turn); $("#turn").style.setProperty("--pc", pc);
    $("#prompt").textContent = "Turno de " + jug(S.turn) + " · busca";
    $("#target").textContent = nm;
    $("#sub").textContent = "";
    $("#target").style.background = pc;
    if (S.qn > 1) toast(null, "Turno de <b>" + jug(S.turn) + "</b>", "ok", 1100);
  } else if (S.mode === "gent") {
    $("#prompt").textContent = "¿Dónde viven los…";
    const g = gents(S.cur); S.gentTxt = g[Math.floor(Math.random() * g.length)];
    $("#target").textContent = S.gentTxt;
    $("#sub").textContent = tx("Toca su provincia en el mapa", "Toca su país en el mapa");
  } else if (S.mode === "shape") {
    $("#prompt").textContent = tx("¿Qué provincia tiene esta forma?", "¿Qué país tiene esta forma?");
    $("#target").textContent = "¿?";
    $("#sub").textContent = "";
    const f = featById[S.cur], b = path.bounds(f), pad = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]) * 0.08;
    $("#shapePath").setAttribute("d", path(f));
    $("#shapeSvg").setAttribute("viewBox", [b[0][0] - pad, b[0][1] - pad, b[1][0] - b[0][0] + 2 * pad, b[1][1] - b[0][1] + 2 * pad].join(" "));
    buildOptions();
  } else if (S.mode === "flag") {
    $("#prompt").textContent = tx(FCA() ? "¿De qué comunidad es esta bandera?" : "¿De qué provincia es esta bandera?", "¿De qué país es esta bandera?");
    $("#flagbox p").textContent = $("#prompt").textContent; // debajo de la bandera, la misma pregunta (antes decía siempre «país»)
    $("#target").textContent = "¿?";
    $("#sub").textContent = "";
    $("#flagImg").src = flagSrc(S.cur);
    $("#flagImg").alt = "Bandera " + bandera(S.cur);
    buildOptions();
  } else if (S.mode === "find" || S.mode === "time") {
    $("#prompt").textContent = "Busca en el mapa";
    $("#target").textContent = nm;
    $("#sub").textContent = alt ? "También: " + alt : "";
  } else if (S.mode === "cap") {
    $("#prompt").textContent = tx("¿De qué provincia es capital…", "¿De qué país es capital…");
    $("#target").textContent = cap;
    $("#sub").textContent = tx("Toca su provincia en el mapa", "Toca su país en el mapa");
  } else {
    $("#prompt").textContent = tx("¿Qué provincia está marcada?", "¿Qué país está marcado?");
    $("#target").textContent = "¿?";
    $("#sub").textContent = "";
    cls(S.cur, "target");
    const rc = C(S.cur);
    gHint.append("circle").attr("class", "ring").attr("cx", rc[0]).attr("cy", rc[1]).attr("r", HOME[2] * 0.04);
    buildOptions();
  }
  if (S.mode !== "duel") $("#target").style.background = "";
  const tg = $("#target"); tg.classList.remove("swap"); void tg.offsetWidth; tg.classList.add("swap");
  $("#skip2").textContent = S.mode === "time" ? "Saltar" : S.mode === "duel" ? "Pasar" : "Ver respuesta";
  const n = hechas() + 1;
  if (S.mode === "time") { announce("Encuentra " + nm); renderStats(); return; }
  if (S.mode === "duel") { announce("Turno de " + jug(S.turn) + ". Encuentra " + nm); renderStats(); return; }
  if (S.mode === "gent") { announce("¿Dónde viven los " + S.gentTxt + "?"); renderStats(); return; }
  if (S.mode === "shape") { announce(tx("¿Qué provincia", "¿Qué país") + " tiene esta forma? Opciones con las teclas 1 a 4."); renderStats(); return; }
  if (S.mode === "flag") { announce($("#prompt").textContent + " Bandera " + bandera(S.cur) + ". Opciones con las teclas 1 a 4."); renderStats(); return; }
  announce("Pregunta " + Math.min(n, S.n0) + " de " + S.n0 + ". " + (S.mode === "find" ? "Encuentra " + nm :
    S.mode === "cap" ? tx("¿En qué provincia está ", "¿En qué país está ") + cap + "?" : tx("¿Qué provincia está marcada?", "¿Qué país está marcado?") + " Opciones con las teclas 1 a 4."));
  renderStats();
}

function buildOptions() {
  // Opciones trampa: dos de alrededor (vecinas o de la misma comunidad) y una de cualquier sitio,
  // para que no se pueda adivinar por descarte
  // (en Banderas, primero las banderas que se parecen)
  const pareja = id => PARECIDAS.some(g => g.includes(id) && g.includes(S.cur));
  const cerca = S.mode === "flag" ? id => pareja(id) ? 0 : (NB[S.cur] && NB[S.cur].has(id)) || P[id][3] === P[S.cur][3] ? 1 : 2
    : id => (NB[S.cur] && NB[S.cur].has(id)) ? 0 : P[id][3] === P[S.cur][3] ? 1 : 2;
  if (FCA()) { // comunidades: tres comunidades distintas de la buena, primero las de bandera parecida
    const una = {}; ALL.forEach(id => { if (!una[P[id][3]]) una[P[id][3]] = id; });
    const par = c => PARECIDAS_CA.some(g => g.includes(CA_N[c]) && g.includes(CA_N[P[S.cur][3]]));
    const otras = shuffle(Object.keys(una).filter(c => c !== P[S.cur][3])).sort((a, b) => par(b) - par(a)).slice(0, 3).map(c => una[c]);
    return pintarOpciones(shuffle(otras.concat(S.cur)));
  }
  const rank = ids => shuffle(ids.filter(id => id !== S.cur)).sort((a, b) => cerca(a) - cerca(b));
  const enZona = rank(S.pool);
  let opts = enZona.filter(id => cerca(id) < 2).slice(0, 2);
  const resto = shuffle(enZona.filter(id => !opts.includes(id)));
  opts = opts.concat(resto.slice(0, 3 - opts.length));
  if (opts.length < 3) { // zonas pequeñas: completar con provincias de alrededor de toda España
    opts = opts.concat(rank(ALL).filter(id => !opts.includes(id)).slice(0, 3 - opts.length));
  }
  pintarOpciones(shuffle(opts.concat(S.cur)));
}
function pintarOpciones(opts) {
  const box = $("#options"); box.innerHTML = "";
  opts.forEach((id, i) => {
    const b = document.createElement("button");
    b.className = "opt"; b.id = "opt-" + i; b.dataset.id = id;
    b.innerHTML = "<kbd>" + (i + 1) + "</kbd>" + name(id);
    b.addEventListener("click", () => answer(id, b));
    box.appendChild(b);
  });
}

function hintRegion() {
  const ccaa = P[S.cur][3];
  const ids = ALL.filter(id => P[id][3] === ccaa);
  const geom = { type: "FeatureCollection", features: ids.map(id => featById[id]) };
  const hp = gHint.append("path").attr("class", "hintline")
    .attr("d", path(topojson.merge(TOPO, TOPO.objects.provinces.geometries.filter(g => ids.includes(g.id)))));
  if (ccaa === "Canarias" && canTransform()) hp.attr("transform", canTransform());
  return ccaa;
}

const TIEMPO = 60000;
// 5.1 · Contrarreloj: cuenta atrás de 3 segundos; el reloj y la primera pregunta llegan después
function cuentaAtras() {
  S.locked = true; S.cur = null;
  $("#clockN").textContent = TIEMPO / 1000; $("#clock").classList.remove("low"); $("#bar").style.width = "100%";
  $("#prompt").textContent = "Prepárate"; $("#target").textContent = "3"; $("#sub").textContent = "";
  $("#s-done").textContent = "0"; $("#s-score").textContent = "0"; $("#s-streak").textContent = "0";
  const pon = n => { $("#cuentaN").textContent = n; $("#target").textContent = n; announce(String(n)); };
  $("#cuenta").hidden = false; pon(3);
  later(() => pon(2), 1000); later(() => pon(1), 2000); later(empezarReloj, 3000);
}
function empezarReloj() {
  $("#cuenta").hidden = true;
  S.tEnd = Date.now() + TIEMPO;
  clearInterval(S.timer); S.timer = setInterval(tickClock, 200); tickClock();
  next();
}
// 5.1 · «Cómo se juega», con un ejemplo de la propia partida: las tres primeras veces de cada juego, hasta la primera respuesta
function explicar() {
  const k = "atlas:howto:" + S.mode, veces = store.get(k) || 0, el = $("#howto");
  el.hidden = true;
  if (S.mode === "explore" || veces >= 3) return;
  const lo = U.art === "el" ? "lo" : "la", cur = S.cur && P[S.cur];
  const t = {
    find: "toca en el mapa " + U.art + " " + U.uno + " que te pedimos" + (cur ? " (ahora, " + cur[0] + ")" : "") + ". Si no " + lo + " encuentras, pulsa «Ver respuesta».",
    name: "mira " + U.art + " " + U.uno + " marcad" + (U.art === "el" ? "o" : "a") + " en el mapa y elige su nombre en los botones de abajo.",
    cap: "te decimos una capital" + (cur ? " (ahora, " + cur[2] + ")" : "") + " y tocas su " + U.uno + " en el mapa.",
    gent: "te decimos cómo se llaman sus habitantes" + (S.gentTxt ? " (ahora, «" + S.gentTxt + "»)" : "") + " y tocas su " + U.uno + " en el mapa.",
    shape: "mira la silueta y elige abajo de qué " + U.uno + " es.",
    flag: "mira la bandera y elige abajo de qué " + U.uno + " es.",
    time: "toca en el mapa todas " + (U.art === "el" ? "los que puedas" : "las que puedas") + " en 60 segundos. Si no ves " + (U.art === "el" ? "uno" : "una") + ", pulsa «Saltar».",
    duel: "por turnos, cada uno busca " + (U.art === "el" ? "el suyo" : "la suya") + " en el mapa y pasa el móvil al otro. " + S.rounds + (S.rounds === 1 ? " ronda" : " rondas") + " cada uno; gana quien acierte más."
  }[S.mode];
  if (!t) return;
  $("#howtoTxt").textContent = t; el.hidden = false;
  store.set(k, veces + 1);
}
// 10 · La primera vez que se falla una provincia pequeña en una pantalla táctil, se explica cómo acercar el mapa
function avisoZoom() {
  if (store.get("atlas:avisoZoom") || !matchMedia("(pointer: coarse)").matches || !S.cur || !byId[S.cur] || curK > 1.8) return;
  const r = byId[S.cur].getBoundingClientRect();
  if (Math.max(r.width, r.height) > 32) return;
  store.set("atlas:avisoZoom", true);
  later(() => toast(null, "Consejo: <b>pellizca el mapa con dos dedos</b> para acercarlo", "warn", 4200), 1500);
}
function tickClock() {
  const left = Math.max(0, S.tEnd - Date.now()), s = Math.ceil(left / 1000);
  $("#clockN").textContent = s;
  $("#clock").classList.toggle("low", s <= 10);
  $("#bar").style.width = (left / TIEMPO * 100) + "%";
  if (left <= 0) { clearInterval(S.timer); pending.splice(0).forEach(clearTimeout); S.locked = true; finish(); }
}
function answerTimed(id) {
  if (id === S.cur) {
    S.locked = true; S.hits++; S.score += 10; S.streak++; S.best = Math.max(S.best, S.streak);
    if (!S.results[id]) S.results[id] = "ok";
    if (S.results[id] === "bad") S.results[id] = "meh";
    Sound.play("ok");
    cls(id, "target", false); cls(id, "flash-ok"); cls(id, "done-ok");
    toast(id, "✓ " + name(id), "ok", 600);
    later(next, 350);
  } else {
    S.errors++; S.streak = 0; avisoZoom();
    if (!S.results[S.cur]) S.results[S.cur] = "bad";
    Sound.play("bad");
    const qc = $("#qcard"); qc.classList.remove("shake"); void qc.offsetWidth; qc.classList.add("shake");
    cls(id, "flash-bad"); toast(id, "Eso es " + name(id), "bad", 900); later(() => cls(id, "flash-bad", false), 900);
  }
  renderStats();
}
