/* Lesson 03 · 3D zoom: Volvox colony beside Hydra, inside Hydra's two layers, and an organelle / cell / tissue-level organism ladder */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.CellKit) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  var hintEl = document.getElementById("zoom-hint");
  var HINT = {
    colony: "Volvox: alike cells, each self-sufficient = colony. Hydra: two layers, different jobs = tissue level.",
    tissue: "Hydra: outer ectoderm (covers, catches food) and inner endoderm (digests). The cells cannot live apart.",
    ladder: "Organelle (nucleus) → cell (Euglena) → tissue-level organism (Hydra). Then organ, system and organism above."
  };

  var state = { mode: "colony" };
  var highlightPart = null;
  var api = {
    setMode: setMode, reset: function () { setMode("colony"); },
    rect: function () { return null; }, highlight: function (p) { highlightPart = p || null; },
    state: function () { return { mode: state.mode }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0.6, 0), pitch: 0.2, yaw: 0.1,
    fitWidth: 5.4, distance: 6, minHeight: 340, labelBoost: 1.3, minYaw: -0.8, maxYaw: 0.8, onFrame: frame
  });

  var volvox, hydra, nucleus, euglena, lbl = [], glow;
  var objs = {};

  if (stage) build();
  wireButtons();

  function lab(text) {
    var s = CellKit.label(text, { h: 0.26, depthTest: false });
    stage.rig.add(s); lbl.push(s);
    return s;
  }

  function build() {
    var scene = stage.rig;
    volvox = CellKit.protist("volvox"); scene.add(volvox);
    hydra = CellKit.protist("hydra"); scene.add(hydra);
    euglena = CellKit.protist("euglena"); scene.add(euglena);
    nucleus = CellKit.nucleusMesh(0.5); scene.add(nucleus);
    objs = { volvox: volvox, hydra: hydra, euglena: euglena, nucleus: nucleus };
    [0, 1, 2].forEach(function () { lab(" "); });
    glow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 1.4);
    glow.material.opacity = 0; glow.userData.noFit = true; scene.add(glow);
    layout(true);

    api.rect = function (part) {
      if (part === "ectoderm" && hydra.parts.ectoderm) return stage.rectOf(hydra.parts.ectoderm, 10);
      if (part === "endoderm" && hydra.parts.endoderm) return stage.rectOf(hydra.parts.endoderm, 10);
      var o = objs[part];
      if (o && o.visible) return stage.rectOf(o, 12);
      return stage.rectOf([volvox, hydra].filter(function (v) { return v.visible; }), 10);
    };
    stage.start();
  }

  function setLabels(list) {
    list.forEach(function (it, i) {
      var s = lbl[i];
      CellKit.setLabelText(s, it[0], { h: 0.26 });
      s.position.set(it[1], it[2], 0.1);
      s.visible = true;
    });
    for (var i = list.length; i < lbl.length; i++) lbl[i].visible = false;
  }

  function layout(first) {
    if (!stage) return;
    var m = state.mode;
    volvox.visible = m === "colony";
    nucleus.visible = euglena.visible = m === "ladder";
    hydra.visible = true;
    var ecto = hydra.parts.ectoderm && hydra.parts.ectoderm.material;
    if (ecto) ecto.opacity = m === "tissue" ? 0.22 : 0.6;
    if (m === "colony") {
      volvox.scale.setScalar(1.3); volvox.position.set(-1.25, 0.75, 0);
      hydra.scale.setScalar(1.15); hydra.position.set(1.25, -0.25, 0);
      setLabels([["Volvox · colony", -1.25, 1.75], ["Hydra · tissue level", 1.25, 1.45]]);
    } else if (m === "tissue") {
      hydra.scale.setScalar(1.9); hydra.position.set(0, -0.7, 0);
      setLabels([["ectoderm (outer)", -1.15, 0.55], ["endoderm (inner)", 1.1, 0.0], ["basal disc", 0, -0.82]]);
    } else {
      nucleus.scale.setScalar(1.0); nucleus.position.set(-1.9, 0.55, 0);
      euglena.scale.setScalar(0.85); euglena.position.set(0, 0.55, 0);
      hydra.scale.setScalar(0.85); hydra.position.set(1.95, 0.0, 0);
      setLabels([["organelle", -1.9, 1.3], ["cell · Euglena", 0, 1.3], ["tissue level · Hydra", 1.95, 1.3]]);
    }
    stage.refit();
    if (!first) stage.recentre();
  }

  function setMode(m) {
    if (["colony", "tissue", "ladder"].indexOf(m) < 0) return;
    state.mode = m;
    root.querySelectorAll(".stage-bar [data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false"); });
    if (hintEl) hintEl.textContent = HINT[m];
    layout(false);
    emit("l3:zoom", { mode: m });
  }

  function wireButtons() {
    root.querySelectorAll(".stage-bar [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    if (hintEl) hintEl.textContent = HINT.colony;
  }

  var tb, tv;
  function frame(dt, t) {
    [volvox, hydra, euglena].forEach(function (o) { if (o && o.visible && o.update) o.update(dt, t); });
    if (nucleus && nucleus.visible) nucleus.rotation.y += dt * 0.35;
    var target = highlightPart && (highlightPart === "ectoderm" ? hydra.parts.ectoderm : highlightPart === "endoderm" ? hydra.parts.endoderm : objs[highlightPart]);
    if (target && target.visible === false) target = null;
    if (glow) {
      if (target) {
        tb = tb || new THREE.Box3(); tv = tv || new THREE.Vector3();
        tb.setFromObject(target); tb.getCenter(glow.position);
        glow.scale.setScalar(Math.max(1.8, tb.getSize(tv).length() * 0.9));
      }
      glow.material.opacity += ((target ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 8);
    }
  }
})();
