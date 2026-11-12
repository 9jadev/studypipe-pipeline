/* Lesson 01 · 3D concept zoom (window.StudyScenes.zoom): the metal lattice.
   Free electrons drift against the current and collide with vibrating positive ions; a thin wire crowds
   them and heats more, a thick wire lets them through, and raising the temperature raises the resistance.
   Mounts the shared dc-concept-zoom kit (mode "lattice") on a SceneKit stage. Numbers come from its model. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var small = root.clientWidth < 560;
  var state = { d: 0.30, T: 20 };

  var kit = window.DcConceptZoom ? window.DcConceptZoom.create({ mode: "lattice", labels: !small }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.9, 0), pitch: 0.16, yaw: 0.12,
    minYaw: -1.0, maxYaw: 1.0, minHeight: 300, maxHeight: 440,
    onFrame: function (dt, t) { if (kit) kit.update(dt, t); }
  });
  if (stage && kit) { stage.rig.add(kit); stage.start(); }

  // ---------- counters ----------
  var countEl = document.getElementById("zoom-counters");
  function sci(x) {
    if (!x || !isFinite(x)) return "–";
    var e = Math.floor(Math.log10(x)); var m = x / Math.pow(10, e);
    return m.toFixed(1) + " ×10" + supr(e);
  }
  function supr(n) { var s = String(n), map = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }; return s.split("").map(function (c) { return map[c] || c; }).join(""); }
  function paint() {
    if (!countEl || !kit) return;
    var r = kit.reading();
    countEl.innerHTML =
      '<span class="counter"><i style="--c:#3ee6c4"></i>Drift v<b>' + (r.drift_mm_s != null ? r.drift_mm_s.toFixed(2) + " mm/s" : "–") + "</b></span>" +
      '<span class="counter"><i style="--c:#f43f5e"></i>Collisions/s<b>' + sci(r.collisions_per_s) + "</b></span>" +
      '<span class="counter"><i style="--c:#ffb23f"></i>Temp<b>' + Math.round(r.T_C) + " °C</b></span>" +
      '<span class="counter"><i style="--c:#7cc4ff"></i>R (relative)<b>' + (r.R_rel != null ? r.R_rel.toFixed(2) + "×" : "–") + "</b></span>";
  }

  // ---------- controls ----------
  function setD(d) {
    state.d = d;
    if (kit) kit.setState({ d_mm: d });
    root.querySelectorAll("#zoom-d [data-d]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-d") === d)); });
    paint();
    document.dispatchEvent(new CustomEvent("l1:zoom", { detail: { mode: "lattice", d_mm: d } }));
  }
  function setT(T) {
    state.T = T;
    if (kit) kit.setState({ T_C: T });
    var lbl = document.getElementById("zoom-t-val"); if (lbl) lbl.textContent = Math.round(T) + " °C";
    paint();
  }
  function reset() {
    state.d = 0.30; state.T = 20;
    if (kit) kit.setState({ d_mm: 0.30, T_C: 20 });
    var sl = document.getElementById("zoom-t"); if (sl) sl.value = 20;
    var lbl = document.getElementById("zoom-t-val"); if (lbl) lbl.textContent = "20 °C";
    root.querySelectorAll("#zoom-d [data-d]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-d") === 0.30)); });
    paint();
  }

  root.querySelectorAll("#zoom-d [data-d]").forEach(function (b) { b.addEventListener("click", function () { setD(+b.getAttribute("data-d")); }); });
  var tsl = document.getElementById("zoom-t"); if (tsl) tsl.addEventListener("input", function () { setT(+tsl.value); });
  var rst = document.getElementById("zoom-reset"); if (rst) rst.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function () {}, setD: setD, setT: setT, reset: reset,
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) { return (stage && kit && kit.parts && kit.parts[p]) ? stage.rectOf(kit.parts[p], 14) : null; }
  };

  paint();
})();
