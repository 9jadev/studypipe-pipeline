/* Lesson 01 · 3D Compound Light Microscope & Cell Magnification Bench — Objective Turret, Stage Clip, Coarse/Fine Knobs & Specimen Viewport */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || !window.L01 || typeof THREE === "undefined") return;

  var DATA = window.L01;
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
    cond: "std", // "std" (Onion cell A = 60 µm = 0.060 mm), "heavy" (Cheek cell A = 30 µm = 0.030 mm), "wide" (Out of focus / uncalibrated)
    trialIdx: 1,
    timed: {}
  };

  function reading(idx, cond) {
    var M = DATA.trials[idx].L; // 40, 100, 200, 400, 600
    var A_mm = cond === "heavy" ? 0.030 : cond === "wide" ? 0.060 * (1 + 0.0005 * M) : 0.060;
    var I_mm = M * A_mm;
    return { I: M, V: I_mm, R: A_mm };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Lens</span><b>' + tr.t + ' obj</b></div>' +
      '<div><span>Total M</span><b>×' + rd.I.toFixed(0) + '</b></div>' +
      '<div><span>Image I</span><b>' + rd.V.toFixed(2) + ' mm</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>A = I÷M</span><b>' + (rd.R * 1000).toFixed(0) + ' µm</b></div>';
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
    target: new THREE.Vector3(0, 0.65, 0),
    pitch: 0.28,
    yaw: 0.12,
    fitWidth: 4.8,
    distance: 4.9,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, scopeApi, cellPreviewGroup, onionPreview, cheekPreview, bobGlow;

  if (stage) build();
  wireButtons();
  paintHint();
  applyTrialGeometry();

  function build() {
    var scene = stage.rig;

    // 1. Lab bench top
    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    // 2. 3D Compound Microscope on the left (using CellKit.microscope)
    if (window.CellKit) {
      scopeApi = CellKit.microscope({ scale: 0.92 });
      scopeApi.group.position.set(-1.05, 0, 0.05);
      scene.add(scopeApi.group);
      clampGroup = scopeApi.parts.eyepiece;
      rulerGroup = scopeApi.parts.turret;
      fiducialGroup = scopeApi.parts.stage;
    } else {
      clampGroup = new THREE.Group();
      rulerGroup = new THREE.Group();
      fiducialGroup = new THREE.Group();
      scene.add(clampGroup, rulerGroup, fiducialGroup);
    }

    // 3. Illuminated Field-of-View Specimen Viewport on the right (bobGroup)
    bobGroup = new THREE.Group();
    bobGroup.position.set(0.95, 0.68, 0.0);
    scene.add(bobGroup);

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.76, 0.055, 18, 48),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 })
    );
    bobGroup.add(ring);

    var fovDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.74, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0ea5e9, emissiveIntensity: 0.14, side: THREE.DoubleSide })
    );
    fovDisc.position.z = -0.02;
    bobGroup.add(fovDisc);

    cellPreviewGroup = new THREE.Group();
    bobGroup.add(cellPreviewGroup);

    if (window.CellKit) {
      onionPreview = CellKit.plantCell({ onion: true, scale: 0.42 }).group;
      onionPreview.rotation.x = 0.65;
      cellPreviewGroup.add(onionPreview);

      cheekPreview = CellKit.animalCell({ cheek: true, scale: 0.34 }).group;
      cheekPreview.rotation.x = 0.65;
      cheekPreview.visible = false;
      cellPreviewGroup.add(cheekPreview);

      var fovTag = CellKit.label("Magnified Field of View (I = M × A)", { bg: "rgba(13,156,126,0.92)" });
      fovTag.position.set(0, 0.96, 0);
      bobGroup.add(fovTag);
    }

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.4), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(62,230,196,0.92)", 0.95);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(0.95, 0.68, 0.1);
    scene.add(bobGlow);

    canvas.addEventListener("click", function (e) {
      var hitObj = stage.pick(e, [bobGroup.userData.hit]);
      if (hitObj) test(state.trialIdx);
    });

    api.rect = function (part) {
      if (part === "bob") return stage.rectOf(bobGroup, 14);
      if (part === "clamp") return stage.rectOf(clampGroup, 12);
      if (part === "fiducial") return stage.rectOf(fiducialGroup, 12);
      if (part === "ruler") return stage.rectOf(rulerGroup, 10);
      return stage.rectOf(bobGroup, 12);
    };

    stage.start();
  }

  function applyTrialGeometry() {
    var tr = DATA.trials[state.trialIdx];
    var rd = reading(state.trialIdx, state.cond);
    paintReadout(rd, tr);
    if (scopeApi && scopeApi.setObjective) scopeApi.setObjective(state.trialIdx);

    if (cellPreviewGroup) {
      var sc = 0.55 + (state.trialIdx / 4) * 0.68;
      cellPreviewGroup.scale.setScalar(sc);
      if (onionPreview && cheekPreview) {
        onionPreview.visible = state.cond !== "heavy";
        cheekPreview.visible = state.cond === "heavy";
      }
    }
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    document.dispatchEvent(new CustomEvent("l1:bench-cond", { detail: { cond: cond } }));
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Cheek Epithelial Cell (A = 30 µm = 0.030 mm): half the actual size of the onion cell, so slope A halves!"
      : cond === "wide"
        ? "Coarse knob used at high power! Spherical distortion warps image measurements."
        : "Onion Epidermal Cell (A = 60 µm = 0.060 mm) in sharp fine-focus.";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " (" + tr.t + " obj → ×" + rd.I + "): Image I = " + rd.V.toFixed(2) + " mm → Actual A = I÷M = " + rd.R.toFixed(3) + " mm (60 µm)");
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
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
    document.dispatchEvent(new CustomEvent("l1:bench-reset"));
    toast("Microscope reset. Tap Trials A–E to measure image size I across magnifications.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> lens readings";
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
    if (cellPreviewGroup) cellPreviewGroup.rotation.z = Math.sin(t * 0.6) * 0.06;
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
