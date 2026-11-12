/* Lesson 05 · 3D zoom (window.StudyScenes.zoom): DcConceptZoom "ramp" — the potential falling along the
   slide wire, the jockey, the EMF level line and the galvanometer current fading to zero at the null point.
   School scenario: k = 0.0200 V cm⁻¹, 1.50 V cell → null at 75.0 cm.
   Emeka scenario: k = 0.150 V cm⁻¹, 12.0 V battery → null at 80.0 cm.
   Every reading comes from DcConceptZoom.model. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.DcConceptZoom) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var SCN = {
    school: { k: 0.0200, E_cell: 1.50, r_cell: 1.0, label: "school cell · 1.50 V", lbal: 75.0 },
    keke: { k: 0.150, E_cell: 12.0, r_cell: 1.2, label: "Emeka's battery · 12.0 V", lbal: 80.0 }
  };
  var narrow = window.innerWidth < 560;
  var state = { scn: "school", labels: !narrow };

  var z = DcConceptZoom.create({ mode: "ramp", labels: state.labels, onEvent: onZoomEvent });
  function applyScenario(s) {
    var c = SCN[s]; if (!c) return;
    z.setState({ k: c.k, E_cell: c.E_cell, r_cell: c.r_cell, l: 50 });
  }
  applyScenario(state.scn);

  var goal = { target: new THREE.Vector3(), dist: 6 };
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36, autoFit: false, zoomUi: true,
    target: new THREE.Vector3(0, 1, 0), pitch: 0.18, yaw: 0, distance: 6,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  if (stage) { stage.rig.add(z); stage.start(); aim(); snap(); }
  function aim() { var v = z.viewFor("all"); goal.target.fromArray(v.target); goal.dist = v.dist; }
  var snapped = false;
  function snap() { snapped = false; }
  function frame(dt, t) {
    z.update(dt, t);
    if (stage) {
      var a = stage.camera.aspect || 1, d = goal.dist * Math.max(1, Math.min(1.9, 0.62 / a));
      if (!snapped) { stage.target.copy(goal.target); stage.dist = d; snapped = true; }
      var k = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, k); stage.dist += (d - stage.dist) * k;
    }
  }

  // ---------- DOM ----------
  var readoutEl = $("#zoom-readout"), hintEl = $("#zoom-hint");
  var slider = $("#zoom-jockey"), lVal = $("#zoom-l-val");
  var balanceBtn = $("#zoom-balance"), resetBtn = $("#zoom-reset");
  var scnBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-scenario [data-scn]"));

  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }

  function paint() {
    if (!readoutEl) return;
    var r = z.reading(), balanced = !!r.balanced;
    readoutEl.innerHTML =
      '<div><span>Jockey l</span><b>' + f1(r.l) + ' cm</b></div>' +
      '<div><span>V_AJ = kl</span><b>' + f2(r.V_l) + ' V</b></div>' +
      '<div><span>Gap E − kl</span><b>' + f2(r.diff) + ' V</b></div>' +
      '<div class="' + (balanced ? "is-null" : "") + '"><span>Galvanometer</span><b>' + (balanced ? "0.0 · NULL" : f1(r.I_g_mA) + " mA") + '</b></div>';
    if (slider && document.activeElement !== slider) slider.value = String(r.l);
    if (lVal) lVal.textContent = f1(r.l) + " cm";
  }

  function onZoomEvent(name) {
    if (name === "state") paint();
    else if (name === "balance") { paint(); toast("Null point: E − kl = 0, so no current flows and the wire p.d. equals the EMF."); }
  }

  function setScenario(s) {
    if (!SCN[s]) return;
    state.scn = s;
    scnBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-scn") === s)); });
    applyScenario(s); aim(); snap(); paint();
    if (hintEl) hintEl.textContent = "Slide until the red gap E − kl closes (" + SCN[s].label + ", null at " + f1(SCN[s].lbal) + " cm).";
    emit("l5:zoom", { mode: "ramp", scenario: s });
  }
  function findNull() { if (z.findBalance) { z.findBalance(); } }

  scnBtns.forEach(function (b) { b.addEventListener("click", function () { setScenario(b.getAttribute("data-scn")); }); });
  if (slider) slider.addEventListener("input", function () { z.setState({ l: +slider.value }); if (lVal) lVal.textContent = f1(+slider.value) + " cm"; });
  if (balanceBtn) balanceBtn.addEventListener("click", findNull);
  if (resetBtn) resetBtn.addEventListener("click", function () { setScenario("school"); });

  // ---------- scene API ----------
  var api = {
    setMode: function (m) { if (SCN[m]) setScenario(m); },
    scenario: setScenario, findBalance: findNull,
    highlight: function (p) { z.highlight(p || null); },
    rect: function (p) {
      if (!stage) return null;
      var o = (p && z.parts && z.parts[p]) || z;
      return stage.rectOf(o, 12);
    },
    reading: function () { return z.reading(); },
    kit: z, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  setScenario("school");
  setInterval(paint, 300);
})();
