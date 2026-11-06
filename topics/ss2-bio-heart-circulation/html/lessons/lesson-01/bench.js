/* Lesson 01 · 3D SA/V Cube & Circulatory System Bench — Tests side length L (0.2 mm to 10 mm) and compares Amoeba diffusion, Fish Single Circulation, and Mammalian Double Circulation */
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
    cond: "std", // "std" = Subdivided capillary cube, "heavy" = Single solid cube, "wide" = Low-pressure open haemocoel
    trialIdx: 1,
    timed: {}
  };

  function reading(idx, cond) {
    var L = DATA.trials[idx].L; // 0.2, 1.0, 2.0, 5.0, 10.0 mm
    var sav = 6 / L;
    if (cond === "heavy") sav = 3 / L; // Half effective exchange surface
    if (cond === "wide") sav = (6 / L) * 0.45; // Sluggish open sinus stagnation
    var sa = 6 * L * L;
    var vol = L * L * L;
    return { I: L, V: sav, R: sa, vol: vol };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Side L</span><b>' + tr.L + ' mm</b></div>' +
      '<div><span>SA (6L²)</span><b>' + tr.t + ' mm²</b></div>' +
      '<div><span>Vol (L³)</span><b>' + tr.T + ' mm³</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>SA/V (6÷L)</span><b>' + rd.V.toFixed(2) + ' mm⁻¹</b></div>';
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
    pitch: 0.16,
    portraitPitch: 0.08,
    yaw: 0.12,
    fitWidth: 4.8,
    minHeight: 340,
    distance: 4.9,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, cubeApi, heartPreview, bobGlow;

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

    clampGroup = new THREE.Group();
    clampGroup.position.set(-1.05, 0.98, 0);
    scene.add(clampGroup);

    if (window.HeartKit) {
      cubeApi = HeartKit.cube({ size: 0.6 });
      clampGroup.add(cubeApi.group);
      var cTag = HeartKit.label("Tissue cube · side L", { bg: "rgba(37,99,235,0.92)", h: 0.15 });
      cTag.position.set(0, 0.86, 0);
      clampGroup.add(cTag);
      var coreTag = HeartKit.label("purple core = no O₂ by diffusion", { bg: "rgba(76,29,149,0.92)", h: 0.11 });
      coreTag.position.set(0, -0.82, 0.3);
      clampGroup.add(coreTag);
    }

    rulerGroup = clampGroup;
    fiducialGroup = clampGroup;

    bobGroup = new THREE.Group();
    bobGroup.position.set(1.1, 0.72, 0.0);
    scene.add(bobGroup);

    if (window.HeartKit) {
      heartPreview = HeartKit.heart({ bpm: 78, mode: "both", scale: 0.85, labels: false });
      bobGroup.add(heartPreview.group);
      var hTag = HeartKit.label("Heart: pumps blood in bulk (mass flow)", { bg: "rgba(225,29,72,0.92)", h: 0.15 });
      hTag.position.set(0, 1.32, 0);
      bobGroup.add(hTag);
    }

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(251,113,133,0.92)", 0.95);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(1.1, 0.95, 0.1);
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
    if (cubeApi && cubeApi.userData && cubeApi.userData.setState) {
      cubeApi.userData.setState({ L: tr.L });
    }
    if (heartPreview && heartPreview.userData && heartPreview.userData.setState) {
      heartPreview.userData.setState({ bpm: 65 + state.trialIdx * 18 });
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
      ? "Half-Exposed Cube (3/L): only half the surface touches water, halving SA/V at every size L!"
      : cond === "wide"
        ? "Stagnant Open Sinus: without continuous vessels, boundary layers slow exchange dramatically."
        : "Standard Cube (SA = 6L², V = L³ ⇒ SA/V = 6 ÷ L): watch how SA/V plummets as L grows!";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " (L = " + tr.L + " mm): SA = " + tr.t + " mm², V = " + tr.T + " mm³ → SA/V = 6÷L = " + rd.V.toFixed(2) + " mm⁻¹");
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
    toast("Bench reset. Tap Trials A–E to measure SA, V, and SA/V across organism sizes.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> cube sizes";
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
    if (cubeApi && cubeApi.tick) cubeApi.tick(dt, t);
    if (heartPreview && heartPreview.tick) heartPreview.tick(dt, t);
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
