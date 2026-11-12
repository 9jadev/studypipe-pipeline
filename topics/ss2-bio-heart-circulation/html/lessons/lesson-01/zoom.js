/* Lesson 01 · 3D circuit zoom (HeartKit.circuitCompare): open (cockroach) → closed single (tilapia) → closed double (Chidi).
   Counters: trips through the heart per circuit (1 / 1 / 2) and pressure reaching the body tissues (low / reduced / high). */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var D = window.L01;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  var noteEl = document.getElementById("zoom-note");
  var ORDER = ["open", "single", "double"];
  var EXAMPLE = { open: "cockroach", single: "tilapia", double: "Chidi" };
  var state = { mode: "open" };
  var highlightPart = null;

  var api = {
    setMode: setMode,
    next: next,
    reset: function () { setMode("open"); },
    rect: function () { return null; },
    highlight: function (p) { highlightPart = p || null; },
    state: function () { return { mode: state.mode }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0.1, 0), pitch: 0.12, yaw: 0.08,
    distance: 6.4, minYaw: -0.7, maxYaw: 0.7, onFrame: frame
  });

  var kit = null, glow = null;
  if (stage && window.HeartKit && window.HeartKit.circuitCompare) build();
  wire();
  paint();

  function build() {
    kit = window.HeartKit.circuitCompare({ mode: state.mode });
    stage.rig.add(kit);
    glow = SceneKit.glowSprite("rgba(255,178,63,0.9)", 1.5);
    glow.material.opacity = 0; glow.userData.noFit = true; stage.rig.add(glow);
    api.rect = function (part) {
      var obj = kit.userData.parts && kit.userData.parts[part];
      return stage.rectOf(obj || kit, 12);
    };
    stage.start();
  }

  function setMode(m, silent) {
    if (ORDER.indexOf(m) < 0) return;
    state.mode = m;
    if (kit) kit.userData.setState({ mode: m });
    if (stage) { stage.refit(); }
    paint();
    if (!silent) { toast(D.circuits[m].label + ": " + D.circuits[m].trips + (D.circuits[m].trips === "1" ? " trip" : " trips") + " through the heart, pressure at the tissues " + D.circuits[m].pressure + "."); }
    emit("l1:zoom", { mode: m });
  }
  function next() { setMode(ORDER[(ORDER.indexOf(state.mode) + 1) % ORDER.length]); }

  function wire() {
    root.querySelectorAll("#zoom-seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var nx = document.getElementById("zoom-next");
    if (nx) nx.addEventListener("click", next);
  }

  function paint() {
    var c = D.circuits[state.mode];
    root.querySelectorAll("#zoom-seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    var t = root.querySelector('[data-c="trips"]'), p = root.querySelector('[data-c="pressure"]'), ex = root.querySelector('[data-c="ex"]');
    if (t) t.textContent = c.trips;
    if (p) p.textContent = c.pressure;
    if (ex) ex.textContent = EXAMPLE[state.mode];
    if (noteEl) noteEl.textContent = c.note;
  }

  var tmpBox, tmpV;
  function frame(dt, t) {
    if (!kit) return;
    kit.userData.update(dt, t);
    if (glow) {
      var target = highlightPart && kit.userData.parts ? kit.userData.parts[highlightPart] : null;
      if (target) {
        tmpBox = tmpBox || new THREE.Box3(); tmpV = tmpV || new THREE.Vector3();
        tmpBox.setFromObject(target); tmpBox.getCenter(glow.position);
        stage.rig.worldToLocal(glow.position);
        glow.scale.setScalar(Math.max(1.6, tmpBox.getSize(tmpV).length() * 0.8));
      }
      glow.material.opacity += ((target ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 8);
    }
  }
})();
