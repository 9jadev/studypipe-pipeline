/* Lesson 03 · 2D concept zoom (window.StudyScenes.zoom) — Paper.js, ShmKinematics2D v2 "circle" scene:
   an abstract reference circle on the left, three synchronised x, v and a traces on the right, and a cursor
   linking them. The "okada" preset uses the story model (ω² = k/m = 158 s⁻², ω ≈ 12.6 rad s⁻¹) and overlays
   a g line on the a trace: drag A from 2 cm to 8 cm and a_max crosses g at g/ω² = 6.2 cm.
   Counters come from the kit's reading() only. Emits l3:zoom ({ mode, A_cm, lift }). */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas) return;

  var $ = function (s) { return root.querySelector(s); };
  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };

  var kit = null;
  if (window.paper && window.ShmKinematics2D) {
    try { kit = ShmKinematics2D.create({ canvas: canvas, scene: "circle", preset: "lab", labels: true, surface: "ink", onChange: function () { paint(); } }); }
    catch (e) { kit = null; if (window.console) console.warn("ShmKinematics2D zoom failed:", e); }
  }
  if (!kit) {
    /* FALLBACK (no Paper.js kit): never throws; the counters stay blank and the fallback note shows */
    var fb = root.querySelector(".stage-fallback"); if (fb) fb.style.display = "flex";
  }

  var mode = "lab";
  var presetBtns = Array.prototype.slice.call(root.querySelectorAll("#zoom-preset [data-preset]"));
  var aIn = $("#zoom-A"), aOut = $("#zoom-A-val"), gBtn = $("#zoom-g"), aRow = $("#zoom-arow"), playBtn = $("#zoom-play");

  function set(c, v) { var e = root.querySelector('#zoom-counters [data-c="' + c + '"]'); if (e) e.textContent = v; }
  function paint() {
    if (!kit) return;
    var r = kit.reading(), d = r.display || {};
    var cm = mode === "okada";
    set("x", cm ? (r.x * 100).toFixed(1) + " cm" : d.x + " m");
    set("v", d.v + " m/s");
    set("a", d.a + " m/s²");
    set("amax", d.a_max + (cm ? (r.lift ? " > g" : " < g") : ""));
    set("th", d.g_over_w2_cm + " cm");
    var am = root.querySelector('#zoom-counters [data-c="amax"]');
    if (am) am.classList.toggle("lift", cm && !!r.lift);
  }
  setInterval(function () { if (kit && kit.isPlaying() && !document.hidden) paint(); }, 200);

  function setMode(m) {
    if (m !== "okada") m = "lab";
    mode = m;
    presetBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-preset") === m)); });
    if (aRow) aRow.hidden = m !== "okada";
    if (kit) {
      kit.setState({ scene: "circle", preset: m });
      kit.play();
      if (m === "okada") setA(3, true);
    }
    if (gBtn) { gBtn.disabled = m !== "okada"; gBtn.setAttribute("aria-pressed", String(m === "okada")); }
    if (playBtn) playBtn.textContent = "❚❚ Pause";
    paint();
    toast(m === "okada" ? "Okada numbers: ω ≈ 12.6 rad/s. Drag A and watch a_max against g." : "Lab circle: A = 0.30 m, T = 2.0 s (ω = π rad/s).");
    emit("l3:zoom", { mode: m });
  }
  function setA(cm, quiet) {
    if (mode !== "okada") setMode("okada");
    cm = Math.max(2, Math.min(8, +cm));
    if (aIn) aIn.value = cm;
    if (aOut) aOut.textContent = cm.toFixed(1) + " cm";
    if (kit) kit.setState({ A: cm / 100, Amax: 0.08 });
    paint();
    var r = kit ? kit.reading() : null;
    if (!quiet && r) toast("A = " + cm.toFixed(1) + " cm → a_max = " + r.display.a_max + " m/s² " + (r.lift ? "> g: the crate lifts off" : "< g: the crate stays on"));
    emit("l3:zoom", { mode: "okada", A_cm: cm, lift: r ? !!r.lift : cm >= 6.2, a_max: r ? r.a_max : null });
    return r;
  }
  function setG(on) {
    if (!kit || mode !== "okada") return;
    kit.setState({ gLine: !!on });
    if (gBtn) gBtn.setAttribute("aria-pressed", String(!!on));
  }

  presetBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-preset")); }); });
  if (aIn) aIn.addEventListener("input", function () { setA(+aIn.value, true); });
  if (aIn) aIn.addEventListener("change", function () { setA(+aIn.value, false); });
  if (gBtn) gBtn.addEventListener("click", function () { setG(gBtn.getAttribute("aria-pressed") !== "true"); });
  if (playBtn) playBtn.addEventListener("click", function () {
    if (!kit) return;
    kit.toggle(); playBtn.textContent = kit.isPlaying() ? "❚❚ Pause" : "▶ Play"; paint();
  });
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", function () { setMode("lab"); if (kit) kit.reset(); });

  var api = {
    setMode: setMode,
    setA: setA,
    gLine: setG,
    reset: function () { setMode("lab"); if (kit) kit.reset(); },
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) {
      if (kit) return kit.rect(p);
      var b = canvas.getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height };
    },
    reading: function () { return kit ? kit.reading() : null; },
    kit: kit
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  mode = "lab";
  if (aRow) aRow.hidden = true;
  if (gBtn) gBtn.disabled = true;
  paint();
})();
