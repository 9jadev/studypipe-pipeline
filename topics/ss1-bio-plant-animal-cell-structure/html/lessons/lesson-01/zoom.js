/* Lesson 01 · 3D zoom: a bacterium beside a plant cell (CellKit v2), with toggles for nucleus / organelles / ribosomes
   and a membrane-bound-organelle counter (0 vs many). "True size" shrinks the bacterium to 2 µm against the plant cell's 50 µm. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.CellKit || !window.SceneKit) return;

  var PLANT_UM = 50, BACT_UM = 2;               /* sizes from the lesson (onion cell 50 µm; bacterium about 2 µm) */
  var TRUE_SCALE = BACT_UM / PLANT_UM;          /* the bacterium against the plant cell, computed */

  var toastEl = document.getElementById("zoom-toast");
  var hintEl = document.getElementById("zoom-hint");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  function emit(n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); }

  var state = { mode: "structure", nucleus: true, organelles: true, ribosomes: true };
  var plant, bact, plantLab, bactLab, hi = null, stage;
  var scaleNow = 1, posNow = new THREE.Vector3(0, -1.2, 0);
  var targetPos = new THREE.Vector3(0, -1.2, 0), targetScale = 1;
  var NUC_KINDS = 1, ORG_KINDS = 5;             /* nucleus; mitochondria, chloroplasts, ER, Golgi, vacuole */

  var api = {
    setMode: setMode, toggle: toggle, set: set, reset: reset,
    rect: function (part) {
      if (!stage || !plant) return null;
      var o = part === "plant" ? plant : part === "bacterium" ? bact :
        part === "nucleus" ? plant.parts.nucleus : part === "nucleoid" ? bact.parts.nucleoid :
        part === "ribosomes" ? [plant.parts.ribosome, bact.parts.ribosome] : [plant, bact];
      return stage.rectOf(o, 14);
    },
    highlight: function (p) {
      if (!hi) return;
      var o = !p ? null : p === "plant" ? plant : p === "bacterium" ? bact :
        p === "nucleus" ? plant.parts.nucleus : p === "nucleoid" ? bact.parts.nucleoid : null;
      hi.set(o);
    },
    state: function () { return { mode: state.mode, nucleus: state.nucleus, organelles: state.organelles, ribosomes: state.ribosomes }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  stage = SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0, 0), pitch: 0.1, yaw: 0.0,
    distance: 8, minYaw: -0.8, maxYaw: 0.8, onFrame: frame
  });
  if (stage) { stage.visible = false; build(); }
  wireButtons();
  paint();

  function build() {
    var scene = stage.rig;
    plant = CellKit.plantCell({ onion: false });
    plant.position.set(0, 0.55, 0);
    scene.add(plant);

    bact = CellKit.bacterium({});
    bact.rotation.y = Math.PI;                       /* flagellum swings round to the right-hand side */
    bact.position.copy(posNow);
    scene.add(bact);
    if (bact.parts.flagellum) bact.parts.flagellum.scale.x = 0.45;   /* keep the picture compact on a phone */

    plantLab = CellKit.label("Plant cell · 50 µm", { h: 0.2, bg: "rgba(13,156,126,0.92)" });
    plantLab.position.set(0, 1.58, 0.3); scene.add(plantLab);
    bactLab = CellKit.label("Bacterium (enlarged)", { h: 0.2, bg: "rgba(200,38,74,0.92)" });
    bactLab.position.set(0, -0.28, 0.3); scene.add(bactLab);

    hi = CellKit.makeHighlighter(scene);
    stage.start();
    apply();
  }

  function setMode(m) {
    if (m !== "structure" && m !== "true") return;
    state.mode = m;
    if (m === "true") {
      targetScale = TRUE_SCALE; targetPos.set(1.45, -0.7, 0.5);
      toast("True size: the bacterium is about 2 µm, a plant cell about 50 µm. That is " + Math.round(PLANT_UM / BACT_UM) + " times shorter.");
      if (window.CellKit && bactLab) CellKit.setLabelText(bactLab, "Bacterium · 2 µm", { h: 0.2, bg: "rgba(200,38,74,0.92)" });
    } else {
      targetScale = 1; targetPos.set(0, -1.2, 0);
      if (bactLab) CellKit.setLabelText(bactLab, "Bacterium (enlarged)", { h: 0.2, bg: "rgba(200,38,74,0.92)" });
    }
    emit("l1:zoom", { mode: m });
    paint();
  }

  function toggle(k) { set(k, !state[k]); }
  function set(k, on) {
    if (!(k in state) || k === "mode") return;
    state[k] = !!on;
    apply();
    var msgs = {
      nucleus: on ? "Nucleus on: the plant cell's DNA sits inside a double membrane. The bacterium's DNA is a loose loop with no membrane." : "Nucleus off.",
      organelles: on ? "Organelles on: mitochondria, chloroplasts, ER, Golgi and a vacuole, each wrapped in membrane. The bacterium has none." : "Organelles off.",
      ribosomes: on ? "Ribosomes on: both cells have them. Bacterial ribosomes are smaller." : "Ribosomes off."
    };
    toast(msgs[k]);
    emit("l1:zoom", { mode: state.mode, toggle: k, on: !!on });
    paint();
  }

  function vis(o, v) { if (o) o.visible = v; }
  function apply() {
    if (!plant) return;
    var P = plant.parts, B = bact.parts;
    vis(P.nucleus, state.nucleus); vis(B.nucleoid, state.nucleus);
    ["mitochondrion", "chloroplast", "er", "golgi", "vacuole"].forEach(function (k) { vis(P[k], state.organelles); });
    vis(P.ribosome, state.ribosomes); vis(B.ribosome, state.ribosomes);
  }

  function reset() {
    state.nucleus = state.organelles = state.ribosomes = true;
    apply(); setMode("structure"); paint();
    toast("Zoom reset: both cells shown with every part on.");
  }

  function paint() {
    root.querySelectorAll("[data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === state.mode)); });
    root.querySelectorAll("[data-tog]").forEach(function (b) { b.setAttribute("aria-pressed", String(!!state[b.getAttribute("data-tog")])); });
    /* the counter is computed from what is switched on, never typed */
    var kinds = (state.nucleus ? NUC_KINDS : 0) + (state.organelles ? ORG_KINDS : 0);
    var cp = root.querySelector('[data-c="plant"]'), cb = root.querySelector('[data-c="bact"]');
    if (cp) cp.textContent = kinds ? "many · " + kinds + " kinds" : "none shown";
    if (cb) cb.textContent = "0";
    if (hintEl) hintEl.textContent = state.mode === "true" ? "True size: 2 µm against 50 µm" : "Bacterium enlarged to compare parts";
  }

  function wireButtons() {
    root.querySelectorAll("[data-mode]").forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
    root.querySelectorAll("[data-tog]").forEach(function (b) { b.addEventListener("click", function () { toggle(b.getAttribute("data-tog")); }); });
    var rs = document.getElementById("zoom-reset"); if (rs) rs.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!plant) return;
    plant.update(dt, t);
    bact.update(dt, t);
    var k = Math.min(1, dt * 3.2);
    scaleNow += (targetScale - scaleNow) * k;
    posNow.lerp(targetPos, k);
    bact.scale.setScalar(scaleNow);
    bact.position.copy(posNow);
    if (bactLab) {
      bactLab.position.set(posNow.x, state.mode === "true" ? posNow.y + 0.3 : posNow.y + 0.9, 0.35);
    }
    if (hi) hi.update(dt, t);
  }
})();
