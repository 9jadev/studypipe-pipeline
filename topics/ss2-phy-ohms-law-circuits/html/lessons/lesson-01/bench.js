/* Lesson 01 · 3D Ohm's Law practical bench (window.StudyScenes.bench).
   Mounts the shared dc-circuit-bench kit (mode "ohms-law") on a SceneKit stage.
   Every reading comes from the kit's physics model: default constantan, L = 40 cm, d = 0.30 mm → R = 2.77 Ω,
   giving the Expected points (0.20, 0.55) … (1.00, 2.77); the filament lamp gives a smooth rising curve. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");
  var TARGETS = [0.20, 0.40, 0.60, 0.80, 1.00];   // the five currents the rheostat steps through

  var state = { comp: "constantan", L: 40, d: 0.30, notch: 2 };

  // ---------- kit + stage ----------
  var kit = window.DcCircuitBench ? window.DcCircuitBench.create({
    mode: "ohms-law",
    labels: root.clientWidth >= 560,
    onEvent: onKitEvent
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.3, 0), pitch: 0.5, yaw: 0.05,
    minYaw: -0.9, maxYaw: 0.9, minHeight: 320, maxHeight: 460,
    onFrame: function (dt, t) { if (kit) kit.update(dt, t); }
  });
  if (stage && kit) { stage.rig.add(kit); stage.start(); }

  function rhFor(targetI) {
    if (!kit) return 4.0;
    var r = kit.reading();
    var E = r.E || 4.0, rInt = r.r || 0.1;
    var Rw = (r.R_wire != null ? r.R_wire : r.R_component) || 1.0;
    return Math.max(0.5, Math.min(30, E / targetI - Rw - rInt));
  }
  function applyNotch() { if (kit) kit.setState({ Rh: rhFor(TARGETS[state.notch]) }); paintReadout(); }

  // ---------- readout (one compact row) ----------
  function compName(c) { return c === "lamp" ? "Lamp" : c === "copper" ? "Copper" : "Constantan"; }
  function paintReadout() {
    if (!readoutEl || !kit) return;
    var r = kit.reading();
    var ratio = (r.ratio == null) ? "–" : r.ratio.toFixed(2);
    var hot = r.comp === "lamp";
    readoutEl.innerHTML =
      '<div><span>Component</span><b class="sm">' + compName(r.comp) + "</b></div>" +
      '<div><span>I / A</span><b>' + (r.I || 0).toFixed(2) + "</b></div>" +
      '<div><span>V / V</span><b>' + (r.V || 0).toFixed(2) + "</b></div>" +
      '<div class="' + (hot ? "hot" : "") + '"><span>V ÷ I / Ω</span><b>' + ratio + "</b></div>";
  }

  // ---------- kit events → lesson events ----------
  var recorded = 0;
  function onKitEvent(name, detail) {
    if (name === "reading") { recorded = countRows(); emit("l1:bench", detail); paintReadout(); paintHint(); }
    else if (name === "done") { emit("l1:bench-done", { count: countRows() }); }
    else if (name === "reset") { recorded = 0; emit("l1:bench-reset"); paintReadout(); paintHint(); }
    else if (name === "state") { paintReadout(); }
  }
  function countRows() { var r = kit ? kit.reading() : null; return r && r.rows ? r.rows.filter(function (x) { return x.comp === state.comp; }).length : 0; }
  function paintHint() {
    if (hintEl) hintEl.innerHTML = "Recorded <b>" + countRows() + " of 5</b> on the " + compName(state.comp).toLowerCase();
  }

  // ---------- controls ----------
  function setComp(c) {
    state.comp = c;
    if (kit) kit.setState({ comp: c });
    root.querySelectorAll("#bench-comp [data-comp]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-comp") === c)); });
    applyNotch(); paintHint();
  }
  function setD(d) {
    state.d = d;
    if (kit) kit.setState({ d: d });
    root.querySelectorAll("#bench-d [data-d]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-d") === d)); });
    applyNotch();
  }
  function setL(L) {
    state.L = L;
    if (kit) kit.setState({ L: L });
    root.querySelectorAll("#bench-l [data-l]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-l") === L)); });
    applyNotch();
  }
  function setNotch(n) {
    state.notch = Math.max(0, Math.min(4, n));
    var sl = document.getElementById("bench-rheo"); if (sl) sl.value = state.notch;
    applyNotch();
  }
  function take() { if (kit) kit.takeReading(); }
  function reset() { state.comp = "constantan"; state.L = 40; state.d = 0.30; state.notch = 2; syncButtons(); if (kit) { kit.reset(); } applyNotch(); }

  function syncButtons() {
    root.querySelectorAll("#bench-comp [data-comp]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-comp") === state.comp)); });
    root.querySelectorAll("#bench-d [data-d]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-d") === state.d)); });
    root.querySelectorAll("#bench-l [data-l]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-l") === state.L)); });
    var sl = document.getElementById("bench-rheo"); if (sl) sl.value = state.notch;
  }

  function wire() {
    root.querySelectorAll("#bench-comp [data-comp]").forEach(function (b) { b.addEventListener("click", function () { setComp(b.getAttribute("data-comp")); }); });
    root.querySelectorAll("#bench-d [data-d]").forEach(function (b) { b.addEventListener("click", function () { setD(+b.getAttribute("data-d")); }); });
    root.querySelectorAll("#bench-l [data-l]").forEach(function (b) { b.addEventListener("click", function () { setL(+b.getAttribute("data-l")); }); });
    var sl = document.getElementById("bench-rheo"); if (sl) sl.addEventListener("input", function () { setNotch(+sl.value); });
    var tk = document.getElementById("bench-take"); if (tk) tk.addEventListener("click", take);
    var rs = document.getElementById("bench-reset"); if (rs) rs.addEventListener("click", reset);
  }

  // ---------- public API for narration + widgets ----------
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setComp: setComp, setD: setD, setL: setL, setNotch: setNotch, take: take, reset: reset,
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) { return (stage && kit && kit.parts && kit.parts[p]) ? stage.rectOf(kit.parts[p], 14) : null; },
    reading: function () { return kit ? kit.reading() : null; }
  };

  wire(); syncButtons(); applyNotch(); paintHint();
})();
