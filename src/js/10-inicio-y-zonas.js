// ---------- 3.3 · Inicio en el móvil: copia del mapa con la zona elegida ----------
const mqHome = matchMedia("(max-width: 599px) and (min-height: 521px)");
function pintarMiniMapa() {
  const box = $("#miniMap");
  if (!mqHome.matches || !document.body.classList.contains("sheet-open")) { box.textContent = ""; return; }
  const c = svg.node().cloneNode(true);
  c.removeAttribute("id"); c.removeAttribute("tabindex"); c.removeAttribute("role"); c.removeAttribute("aria-label"); c.removeAttribute("aria-roledescription");
  c.setAttribute("aria-hidden", "true"); c.setAttribute("focusable", "false");
  c.querySelectorAll(".kfocus,.hit,.miss,.flash").forEach(e => e.classList.remove("kfocus", "hit", "miss", "flash"));
  box.replaceChildren(c);
  // Encuadra las provincias de la zona, medidas sobre la propia copia
  try {
    const m = c.getScreenCTM().inverse(); let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    c.querySelectorAll(".prov:not(.off):not(.nogame)").forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const a = new DOMPoint(r.left, r.top).matrixTransform(m), b = new DOMPoint(r.right, r.bottom).matrixTransform(m);
      x0 = Math.min(x0, a.x); y0 = Math.min(y0, a.y); x1 = Math.max(x1, b.x); y1 = Math.max(y1, b.y);
    });
    if (isFinite(x0)) { const px = (x1 - x0) * 0.05, py = (y1 - y0) * 0.05; c.setAttribute("viewBox", [x0 - px, y0 - py, x1 - x0 + 2 * px, y1 - y0 + 2 * py].join(" ")); c.setAttribute("preserveAspectRatio", "xMidYMid meet");
      box.style.height = Math.round(Math.min(280, Math.max(170, box.clientWidth * (y1 - y0) / (x1 - x0)))) + "px"; }
  } catch (e) {}
}

// ---------- 3.2 · Pestañas Aprender / Practicar / Jugar ----------
const TAB_OF = { explore: "aprender", find: "practicar", name: "practicar", cap: "practicar", gent: "practicar", shape: "practicar", flag: "practicar", time: "jugar", duel: "jugar" };
const tabs = [...document.querySelectorAll('.seg [role="tab"]')];
function showTab(t, focus) {
  tabs.forEach(b => {
    const on = b.dataset.tab === t;
    b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
    $("#grp-" + b.dataset.tab).hidden = !on;
    if (on && focus) b.focus();
  });
}
tabs.forEach((b, i) => {
  b.addEventListener("click", () => showTab(b.dataset.tab));
  b.addEventListener("keydown", e => {
    const k = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (k) { e.preventDefault(); showTab(tabs[(i + k + tabs.length) % tabs.length].dataset.tab, true); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); showTab(tabs[e.key === "Home" ? 0 : tabs.length - 1].dataset.tab, true); }
  });
});

// ---------- 3.2 · Zona arriba, con su propia ventana para elegirla ----------
const zoneName = ZN;
const zoneCount = r => poolFor(r).length;
REGIONS.forEach(([v]) => {
  const b = document.createElement("button");
  b.type = "button"; b.dataset.zone = v;
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span class="zn"></span><span class="zc"></span><span class="sr-only"></span>';
  b.querySelector(".zn").textContent = zoneName(v);
  b.querySelector(".zc").textContent = zoneCount(v);
  b.querySelector(".sr-only").textContent = EU ? " países" : CA ? " comunidades" : v === "all" ? " provincias y ciudades" : " provincias";
  b.addEventListener("click", () => {
    if (S.region === v) return closeZones();
    if (enCurso()) { // se perdería lo respondido: se pregunta antes
      const n = Object.keys(S.results).length;
      $("#zcTxt").innerHTML = (n ? "Llevas <b>" + n + "</b> " + (n === 1 ? tx("provincia respondida", "país respondido") : tx("provincias respondidas", "países respondidos")) + " en esta partida." : "Tienes una partida empezada.") + " Si cambias a <b></b>, empieza una partida nueva.";
      $("#zcTxt").querySelector("b:last-child").textContent = zoneName(v);
      zonaPendiente = v; $("#zoneGrid").hidden = true; $("#zoneDone").hidden = true; $("#zoneConfirm").hidden = false; $("#zcYes").focus();
      return;
    }
    cambiarZona(v);
  });
  $("#zoneGrid").appendChild(b);
});
let zonaPendiente = null;
function cambiarZona(v) {
  sel.value = v; sel.dispatchEvent(new Event("change")); setTimeout(pintarMiniMapa, 50); setTimeout(pintarMiniMapa, 900);
  closeZones();
}
function resetConfirm() { zonaPendiente = null; $("#zoneConfirm").hidden = true; $("#zoneGrid").hidden = false; $("#zoneDone").hidden = false; }
$("#zcYes").addEventListener("click", () => { const v = zonaPendiente; resetConfirm(); cambiarZona(v); });
$("#zcNo").addEventListener("click", () => { resetConfirm(); closeZones(); });
function renderZone() {
  $("#zoneName").textContent = zoneName(S.region);
  $("#tbZoneName").textContent = zoneName(S.region);
  $("#tbZone").setAttribute("aria-label", "Zona: " + zoneName(S.region) + ". Cambiar de zona");
  $("#zoneGrid").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.zone === S.region));
}
let zoneFocus = null;
function openZones() {
  renderZone(); zoneFocus = document.activeElement;
  $("#zoneSheet").hidden = false; $("#zoneBackdrop").hidden = false;
  setTimeout(() => { const b = $('#zoneGrid [aria-pressed="true"]') || $("#zoneGrid button"); if (b) b.focus({ preventScroll: true }); }, 60);
}
function closeZones() {
  if ($("#zoneSheet").hidden) return false;
  resetConfirm();
  $("#zoneSheet").hidden = true; $("#zoneBackdrop").hidden = true;
  if (zoneFocus && zoneFocus.focus) zoneFocus.focus({ preventScroll: true });
  return true;
}
$("#zoneBtn").addEventListener("click", openZones);
if (EU) {
  const lista = DOTS.map(id => P[id] && (id === "VA" ? "Vaticano" : P[id][0])).filter(Boolean);
  $(".zs-peq").hidden = false;
  $("#sinPeqTxt").textContent = "Quita " + lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1] + ". Si la partida ya ha empezado, se nota en la siguiente.";
  $("#sinPeq").checked = sinPeq();
  $("#sinPeq").addEventListener("change", e => {
    store.set(KP + "sinPeq", e.target.checked);
    $("#zoneGrid").querySelectorAll("button").forEach(b => b.querySelector(".zc").textContent = zoneCount(b.dataset.zone));
    if (!enCurso()) newGame();
    setTimeout(pintarMiniMapa, 50);
    announce(e.target.checked ? "Sin países pequeños." : "Con todos los países.");
  });
}
$("#setcard").addEventListener("transitionend", e => { if (e.target.id === "setcard" && e.propertyName === "transform") pintarMiniMapa(); });
$("#tbZone").addEventListener("click", openZones);
// Barra superior de la partida: «Inicio» vuelve a la pantalla de inicio; al lado, el modo en que estás
$("#tbHome").addEventListener("click", () => openSheet(false));
function renderTopTabs() { const b = $('.modes button[data-mode="' + S.mode + '"]'); $("#tbMode").textContent = b ? b.querySelector("b").textContent : ""; }
// ---------- 3.6 · Partida a medias: tarjeta «Seguir», progreso en su modo y «Empezar de nuevo» con aviso ----------
function progreso() {
  const n = Object.keys(S.results).length;
  if (S.mode === "time") return { txt: S.hits + (S.hits === 1 ? " acierto" : " aciertos"), f: 0 };
  if (S.mode === "duel") return { txt: "Ronda " + Math.min(S.rounds, Math.ceil(S.qn / 2)) + " de " + S.rounds, f: S.rounds ? Math.min(1, Math.ceil(S.qn / 2) / S.rounds) : 0 };
  const done = Math.max(0, S.total - S.queue.length - (S.cur && !S.locked ? 1 : 0));
  return { txt: done + "/" + S.total, f: S.total ? done / S.total : 0, n };
}
function renderResume() {
  const on = enCurso();
  document.querySelectorAll(".modes .prog").forEach(e => e.remove());
  $("#resumeCard").hidden = !on || !mqMobile.matches;
  $("#restartLink").hidden = !on || !mqMobile.matches || mqHome.matches; // en el móvil vertical ya está en la barra de arriba
  if (!on) return;
  const p = progreso(), b = $('.modes button[data-mode="' + S.mode + '"]'), modo = b ? b.querySelector("b").textContent : "";
  $("#resumeTxt").textContent = modo + " · " + zoneName(S.region) + " · " + p.txt;
  $("#resumeBar").style.width = Math.round(p.f * 100) + "%";
  $("#resumeCard").setAttribute("aria-label", "Seguir con tu partida: " + $("#resumeTxt").textContent);
  if (b) { const t = document.createElement("span"); t.className = "prog"; t.textContent = p.txt + " · Seguir"; b.appendChild(t); }
}
$("#resumeCard").addEventListener("click", () => closeSheet());
function pedirReinicio() {
  if (!enCurso()) { newGame(); closeSheet(); return; }
  const p = progreso(), b = $('.modes button[data-mode="' + S.mode + '"]');
  IK.hoja(`<div class="aj"><h2>¿Empezar de nuevo?</h2><p>Perderás lo que llevas en esta partida: <b id="rsInfo"></b>.</p>
    <div class="ajrow"><button class="ik-btn ik-ghost" data-ik="cerrar">Seguir jugando</button><button class="ik-btn" id="rsYes">Empezar de nuevo</button></div></div>`, "Empezar de nuevo");
  $("#rsInfo").textContent = (b ? b.querySelector("b").textContent + ", " : "") + zoneName(S.region) + ", " + p.txt;
  $("#rsYes").onclick = () => { IK.cerrar(); newGame(); closeSheet(); };
}
$("#tbRestart").addEventListener("click", pedirReinicio);
$("#restartLink").addEventListener("click", pedirReinicio);
$("#duelGo").addEventListener("click", () => { closeSheet(); });

// ¿Hay una partida empezada (con alguna respuesta) que se perdería?
function enCurso() { return S.mode !== "explore" && !!S.cur && (Object.keys(S.results).length > 0 || S.tries > 0); }
$("#zoneClose").addEventListener("click", closeZones);
$("#zoneDone").addEventListener("click", closeZones);
$("#zoneBackdrop").addEventListener("click", closeZones);
// La ventana retiene el foco con el tabulador
$("#zoneSheet").addEventListener("keydown", e => {
  if (e.key !== "Tab") return;
  const f = [...$("#zoneSheet").querySelectorAll("button")], first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
$("#skip").addEventListener("click", () => { if (S.mode === "time") return skipTimed(); if (S.mode === "duel") { if (!S.locked && S.cur) answerDuel(null); return; } if (!S.locked && S.cur) reveal(); });
$("#restart").addEventListener("click", () => newGame());
$("#e-again").addEventListener("click", () => newGame());
document.addEventListener("keydown", e => {
  if (!OPT_MODES.includes(S.mode) || ["SELECT", "INPUT"].includes(e.target.tagName)) return;
  const b = document.getElementById("opt-" + (parseInt(e.key, 10) - 1));
  if (b && !b.disabled) b.click();
});

