/* Lesson 02 · 3D zoom inside the cell (window.StudyScenes.zoom)
   DcConceptZoom "cell" mode: ions crossing the electrolyte and the energy-per-coulomb bar
   splitting E into IR (external) and Ir (internal). Every number from the kit's model. */
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

  var small = root.clientWidth < 560;
  var state = { R: 10.5, closed: true };

  var kit = DcConceptZoom.create({ mode: "cell", labels: !small });
  kit.setState({ E: 6.0, r: 1.5, R: state.R, closed: state.closed });

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0, 1, 0), pitch: 0.12, yaw: 0.05, distance: 8,
    minYaw: -0.9, maxYaw: 0.9, portraitPitch: 0.18, onFrame: frame
  });
  if (stage) { stage.rig.add(kit); stage.start(); }
  function frame(dt, t) { kit.update(dt, t); }

  // ---------- DOM ----------
  var readoutEl = $("#zoom-readout");
  var keyBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-key [data-key]"));
  var loadBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-loads [data-r]"));
  var resetBtn = $("#zoom-reset");

  function paint() {
    if (!readoutEl) return;
    var r = kit.reading();
    readoutEl.innerHTML =
      '<div><span>EMF E / V</span><b>' + r.E.toFixed(1) + '</b></div>' +
      '<div><span>Useful IR / V</span><b>' + (r.V_check != null ? r.V_check : r.V).toFixed(2) + '</b></div>' +
      '<div class="hot"><span>Lost Ir / V</span><b>' + r.lost.toFixed(2) + '</b></div>' +
      '<div><span>Terminal V / V</span><b>' + r.V.toFixed(2) + '</b></div>';
  }
  function paintBtns() {
    keyBtns.forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-key") === "closed") === state.closed)); });
    loadBtns.forEach(function (b) { b.classList.toggle("zobo", state.closed && +b.getAttribute("data-r") === state.R); });
  }

  function setKey(closed) {
    state.closed = !!closed;
    kit.setState({ closed: state.closed });
    paintBtns(); paint();
    toast(state.closed ? "Key closed: current flows, so some energy is spent on r before it leaves the terminals." : "Key open: no current, so no lost volts — the terminals show the full EMF.");
    emit("l2:zoom", { mode: "cell", closed: state.closed });
  }
  function setLoad(R) {
    state.R = +R; state.closed = true;
    kit.setState({ R: state.R, closed: true });
    paintBtns(); paint();
    toast("Heavier load (" + state.R.toFixed(1) + " Ω) → more current → a bigger Ir slice taken inside.");
    emit("l2:zoom", { mode: "cell", R: state.R });
  }
  function reset() {
    state.R = 10.5; state.closed = true;
    kit.setState({ E: 6.0, r: 1.5, R: state.R, closed: true });
    paintBtns(); paint();
  }

  keyBtns.forEach(function (b) { b.addEventListener("click", function () { setKey(b.getAttribute("data-key") === "closed"); }); });
  loadBtns.forEach(function (b) { b.addEventListener("click", function () { setLoad(b.getAttribute("data-r")); }); });
  if (resetBtn) resetBtn.addEventListener("click", reset);

  var api = {
    setMode: function () {},
    key: setKey, load: setLoad, reset: reset,
    highlight: function (p) { if (!p) kit.highlight(null); else kit.highlight(p); },
    rect: function (p) {
      if (!stage) return null;
      var o = kit.parts && kit.parts[p];
      return stage.rectOf(o || kit, 12);
    },
    reading: function () { return kit.reading(); },
    kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  paintBtns(); paint();
  setInterval(paint, 500);
})();
