// ---------- Sonido (sintetizado, sin archivos) ----------
// "always": suena también con el iPhone en silencio (sesión de audio de reproducción, iOS 16.4+)
// "ambient": respeta el interruptor de silencio y no corta la música · "off": sin sonido
const SOUND_MODES = ["ambient", "always", "off"];
const SOUND_TXT = { always: "Sonido: siempre (también en silencio)", ambient: "Sonido: respeta el modo silencio", off: "Sonido: desactivado" };
const Sound = {
  mode: (v => v === false ? "off" : v === "ambient" || v === "off" ? v : "ambient")(store.get("atlas:sound")), ctx: null, closeT: null,
  // iOS muestra un reproductor (como si sonara música) mientras el audio sigue abierto en modo reproducción:
  // se cierra al terminar cada sonido y se vuelve a abrir en el siguiente
  release() {
    if (!this.ctx) return;
    const c = this.ctx; this.ctx = null;
    try { c.close().catch(() => {}); } catch (e) {}
    try { if (navigator.audioSession) navigator.audioSession.type = "auto"; } catch (e) {}
  },
  session() { try { if (navigator.audioSession) navigator.audioSession.type = this.mode === "always" ? "playback" : "ambient"; } catch (e) {} },
  tone(f, t, dur, type, vol) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + dur + 0.03);
  },
  play(kind) {
    if (this.mode === "off") return;
    try {
      if (!this.ctx) this.session();
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
      const t = this.ctx.currentTime + 0.01;
      if (kind === "ok") { this.tone(659, t, 0.12); this.tone(988, t + 0.09, 0.2); }
      else if (kind === "bad") { this.tone(196, t, 0.2, "triangle", 0.16); }
      else if (kind === "reveal") { this.tone(392, t, 0.16, "triangle"); this.tone(294, t + 0.15, 0.28, "triangle"); }
      else if (kind === "end") { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, t + i * 0.11, 0.25)); }
      else if (kind === "streak") { [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, t + i * 0.07, 0.16, "sine", 0.1)); }
      else if (kind === "tick") { this.tone(880, t, 0.05, "sine", 0.05); }
      clearTimeout(this.closeT);
      this.closeT = setTimeout(() => this.release(), 900);
    } catch (e) {}
  },
};
const SOUND_CORTO = { always: "Sonido: siempre", ambient: "Sonido", off: "Sin sonido" };
function renderSound() {
  $("#sound").setAttribute("aria-pressed", Sound.mode !== "off");
  $("#sound").setAttribute("aria-label", SOUND_TXT[Sound.mode] + ". Pulsa para cambiar");
  $("#sound").title = SOUND_TXT[Sound.mode];
  $("#soundTxt").textContent = SOUND_CORTO[Sound.mode];
}
function announce(msg) { const a = $("#announce"); a.textContent = ""; setTimeout(() => a.textContent = msg, 30); }

