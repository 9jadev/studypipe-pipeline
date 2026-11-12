/* Lesson 03 · 3D concept zoom (window.StudyScenes.zoom): DcConceptZoom "node" mode.
   Charge beads split at junction A by branch resistance (I₁ : I₂ = R₂ : R₁) and rejoin at B;
   a power bar partitions total power EI into useful I²R and wasted I²r. Numbers from the kit model. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3000);
  }

  var labels = root.clientWidth >= 560;
  var kit = window.DcConceptZoom ? DcConceptZoom.create({ mode: "node", labels: labels, onEvent: function () {} }) : null;

  var stage = null;
  if (kit && window.SceneKit) {
    var v = kit.viewFor ? kit.viewFor("all") : { target: [0, 0, 0], dist: 6, pitch: 0.2 };
    stage = SceneKit.createStage({
      root: root, canvas: canvas, fov: 34,
      target: new THREE.Vector3(v.target[0], v.target[1], v.target[2]),
      pitch: v.pitch || 0.2, yaw: 0.04, distance: v.dist || 6,
      minYaw: -0.8, maxYaw: 0.8, onFrame: frame
    });
    stage.rig.add(kit);
    if (stage.addPart) Object.keys(kit.parts || {}).forEach(function (id) { stage.addPart(id, kit.parts[id], id); });
    stage.start();
  } else if (window.SceneKit) {
    stage = SceneKit.createStage({ root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0, 0), distance: 6, onFrame: frame });
    stage.start();
  }
  function frame(dt, t) { if (kit && kit.update) kit.update(dt, t); updateCounters(); }

  function set(c, v) { var e = document.querySelector('#zoom-counters [data-c="' + c + '"]'); if (e) e.textContent = v; }
  function updateCounters() {
    if (!kit || !kit.reading) return;
    var r = kit.reading();
    set("i", r.I != null ? r.I.toFixed(2) : "–");
    set("i1", r.I1 != null ? r.I1.toFixed(2) : "–");
    set("i2", r.I2 != null ? r.I2.toFixed(2) : "–");
    set("pt", r.P_total != null ? r.P_total.toFixed(2) : "–");
    set("pr", r.P_int != null ? (r.P_total - r.P_int).toFixed(2) : "–");
    set("pi", r.P_int != null ? r.P_int.toFixed(2) : "–");
  }

  var ratio = "61";                                  // 6 Ω ∥ 12 Ω by default
  function setRatio(key) {
    ratio = key;
    root.querySelectorAll("#zoom-ratio [data-ratio]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-ratio") === key)); });
    if (!kit) return;
    if (key === "equal") { kit.setState({ R1: 6.0, R2: 6.0 }); toast("Equal branches (6 Ω ∥ 6 Ω): the current splits 50 : 50."); }
    else { kit.setState({ R1: 6.0, R2: 12.0 }); toast("6 Ω ∥ 12 Ω: more current takes the smaller resistance, so I₁ : I₂ = 2 : 1."); }
    updateCounters();
  }

  var api = {
    setMode: function () { if (kit) kit.setMode("node"); },
    ratio: setRatio,
    reset: function () { if (kit) kit.reset(); setRatio("61"); toast("Node reset: E = 5.0 V, r = 0.5 Ω, 6 Ω ∥ 12 Ω."); },
    highlight: function (p) { if (kit && kit.highlight) kit.highlight(p || null); },
    rect: function (p) { if (!stage) return null; var o = (kit && kit.parts && kit.parts[p]) || kit; return stage.rectOf(o, 14); },
    reading: function () { return kit ? kit.reading() : null; },
    kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  root.querySelectorAll("#zoom-ratio [data-ratio]").forEach(function (b) {
    b.addEventListener("click", function () { setRatio(b.getAttribute("data-ratio")); });
  });
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", api.reset);

  updateCounters();
})();
