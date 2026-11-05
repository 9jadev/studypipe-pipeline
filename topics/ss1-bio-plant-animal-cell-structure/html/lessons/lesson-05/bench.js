/* Lesson 05 · 3D Wet-Mount Slide Preparation (45° Coverslip & Iodine/Methylene Blue Dropper) & Field-of-View Cell Counting Bench */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || !window.L05 || typeof THREE === "undefined") return;

  var DATA = window.L05;
  var toastEl = document.getElementById("bench-toast");
  var hint = document.getElementById("bench-hint");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var state = {
    cond: "std", // "std" (Iodine-stained Onion Epidermis: A = 75 µm), "heavy" (Methylene-blue Cheek Cell: A = 45 µm), "wide" (Dropped Coverslip -> Air Bubbles!)
    trialIdx: 1,
    timed: {}
  };

  function reading(idx, cond) {
    var M = DATA.trials[idx].L; // 40, 100, 200, 400, 600
    var D_fov = 180000 / M;     // 4500, 1800, 900, 450, 300 µm
    var A_cell = cond === "heavy" ? 45.0 : 75.0;
    var N_cells = D_fov / A_cell;
    return { I: M, V: D_fov, R: N_cells, A: A_cell };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Total M</span><b>×' + rd.I.toFixed(0) + '</b></div>' +
      '<div><span>FOV D</span><b>' + rd.V.toFixed(0) + ' µm</b></div>' +
      '<div><span>Cells N</span><b>' + rd.R.toFixed(1) + ' cells</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>A = D÷N</span><b>' + rd.A.toFixed(0) + ' µm</b></div>';
  }

  var highlightPart = null;
  var api = {
    setCond: setCond,
    test: test,
    reset: reset,
    rect: function () { return null; },
    highlight: function (p) { highlightPart = p || null; },
    state: function () { return { cond: state.cond, timedCount: Object.keys(state.timed).length }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new THREE.Vector3(0, 0.68, 0),
    pitch: 0.30,
    yaw: 0.10,
    fitWidth: 5.0,
    distance: 5.0,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, slideApi, onionView, cheekView, bubbleRing, bobGlow;

  if (stage) build();
  wireButtons();
  paintHint();
  applyTrialGeometry();

  function build() {
    var scene = stage.rig;

    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    // Left: 3D Wet-Mount Glass Slide + 45° Coverslip + Dropper (clampGroup)
    clampGroup = new THREE.Group();
    clampGroup.position.set(-1.12, 0.45, 0);
    scene.add(clampGroup);

    if (window.CellKit) {
      slideApi = CellKit.slide({ scale: 0.88 });
      clampGroup.add(slideApi.group);
      var sTag = CellKit.label("Wet-Mount Slide (45° Coverslip + Stain Dropper)", { bg: "rgba(217,138,0,0.92)" });
      sTag.position.set(0, 0.88, 0);
      clampGroup.add(sTag);
    }

    // Right: Stained Specimen Viewport & Field-of-View Ruler (bobGroup)
    bobGroup = new THREE.Group();
    bobGroup.position.set(1.12, 0.72, 0);
    scene.add(bobGroup);

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.76, 0.05, 18, 48),
      new THREE.MeshStandardMaterial({ color: 0x3ee6c4, roughness: 0.25, metalness: 0.75 })
    );
    bobGroup.add(ring);

    if (window.CellKit) {
      onionView = CellKit.plantCell({ onion: true, scale: 0.46 }).group;
      onionView.rotation.x = 0.65;
      bobGroup.add(onionView);

      cheekView = CellKit.animalCell({ cheek: true, scale: 0.42 }).group;
      cheekView.rotation.x = 0.65;
      cheekView.visible = false;
      bobGroup.add(cheekView);

      var bTag = CellKit.label("Calibrated Field of View (D₂ = D₁ · M₁/M₂)", { bg: "rgba(13,156,126,0.92)" });
      bTag.position.set(0, 0.96, 0);
      bobGroup.add(bTag);
    }

    // Dark-rimmed air bubble artefact ring (hidden unless cond === "wide")
    bubbleRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.06, 16, 36),
      new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1 })
    );
    bubbleRing.position.set(0.15, 0.1, 0.22);
    bubbleRing.visible = false;
    bobGroup.add(bubbleRing);

    rulerGroup = clampGroup;
    fiducialGroup = bobGroup;

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(62,230,196,0.92)", 0.95);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(1.12, 0.72, 0.1);
    scene.add(bobGlow);

    canvas.addEventListener("click", function (e) {
      var hitObj = stage.pick(e, [bobGroup.userData.hit]);
      if (hitObj) test(state.trialIdx);
    });

    api.rect = function (part) {
      if (part === "bob") return stage.rectOf(bobGroup, 14);
      if (part === "clamp") return stage.rectOf(clampGroup, 14);
      if (part === "fiducial") return stage.rectOf(fiducialGroup, 12);
      if (part === "ruler") return stage.rectOf(rulerGroup, 12);
      return stage.rectOf(bobGroup, 12);
    };

    stage.start();
  }

  function applyTrialGeometry() {
    var tr = DATA.trials[state.trialIdx];
    var rd = reading(state.trialIdx, state.cond);
    paintReadout(rd, tr);

    if (slideApi && slideApi.setStep) {
      slideApi.setStep(state.trialIdx >= 2 ? 2 : state.trialIdx);
    }
    if (onionView && cheekView) {
      onionView.visible = state.cond !== "heavy";
      cheekView.visible = state.cond === "heavy";
      var sc = 0.55 + (state.trialIdx / 4) * 0.55;
      onionView.scale.setScalar(0.46 * sc);
      cheekView.scale.setScalar(0.42 * sc);
    }
    if (bubbleRing) bubbleRing.visible = state.cond === "wide";
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    document.dispatchEvent(new CustomEvent("l5:bench-cond", { detail: { cond: cond } }));
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Human Cheek Smear + Methylene Blue: Irregular shape, single-line plasma membrane, dark-blue central nucleus (A = 45 µm)!"
      : cond === "wide"
        ? "Coverslip Dropped Flat! Dark-rimmed circular air bubble trapped over the specimen!"
        : "Onion Epidermis + Iodine Solution (45° coverslip): Brick-shaped cells, double-line cellulose wall, amber nucleus (A = 75 µm).";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " (×" + rd.I + "): FOV D = " + rd.V.toFixed(0) + " µm, N = " + rd.R.toFixed(1) + " cells → A = D÷N = " + rd.A.toFixed(0) + " µm");
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l5:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l5:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 1;
    state.cond = "std";
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === "std" ? "true" : "false");
    });
    applyTrialGeometry();
    paintHint();
    document.dispatchEvent(new CustomEvent("l5:bench-reset"));
    toast("Wet-mount bench reset. Tap Trials A–E to calibrate FOV diameter and cell count.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> FOV calibrations";
    root.querySelectorAll("#bench-trials [data-trial]").forEach(function (b) {
      var k = +b.getAttribute("data-trial");
      b.setAttribute("aria-pressed", state.timed[k] ? "true" : "false");
    });
  }

  function wireButtons() {
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.addEventListener("click", function () { setCond(b.getAttribute("data-cond")); });
    });
    root.querySelectorAll("#bench-trials [data-trial]").forEach(function (b) {
      b.addEventListener("click", function () { test(+b.getAttribute("data-trial")); });
    });
    var r = document.getElementById("bench-reset");
    if (r) r.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!bobGroup) return;
    if (slideApi && slideApi.tick) slideApi.tick(dt, t);
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
