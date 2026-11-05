/* Lesson 02 · 3D Plant & Animal Cell Organelle Dissector & Mitochondrial Energetics Bench */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || !window.L02 || typeof THREE === "undefined") return;

  var DATA = window.L02;
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
    cond: "std", // "std" (Aerobic O2 present: 38 ATP/glucose, k = 0.45), "heavy" (High cristae folding ×1.5 -> k = 0.675), "wide" (Cyanide/Anaerobic block -> low ATP)
    trialIdx: 2,
    timed: {}
  };

  function reading(idx, cond) {
    var C = DATA.trials[idx].L; // Cristae density index 100..500
    var k = cond === "heavy" ? 0.675 : cond === "wide" ? 0.45 / (1 + 0.003 * C) : 0.45;
    var atp = C * k;
    return { I: C, V: atp, R: k };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Tissue</span><b>' + tr.t + '</b></div>' +
      '<div><span>Cristae C</span><b>' + rd.I.toFixed(0) + ' µm²</b></div>' +
      '<div><span>ATP Rate</span><b>' + rd.V.toFixed(1) + ' units</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>Ratio ATP÷C</span><b>' + rd.R.toFixed(2) + '</b></div>';
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
    target: new THREE.Vector3(0, 0.72, 0),
    pitch: 0.30,
    yaw: 0.10,
    fitWidth: 4.9,
    distance: 5.0,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, plantApi, animalApi, bobGlow;

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
    clampGroup.position.set(-1.12, 0.72, 0);
    scene.add(clampGroup);

    bobGroup = new THREE.Group();
    bobGroup.position.set(1.12, 0.72, 0);
    scene.add(bobGroup);

    if (window.CellKit) {
      plantApi = CellKit.plantCell({ scale: 0.78 });
      clampGroup.add(plantApi.group);
      var pTag = CellKit.label("Plant Cell (Cellulose Wall · Vacuole · Chloroplast)", { bg: "rgba(34,197,94,0.92)" });
      pTag.position.set(0, 0.92, 0);
      clampGroup.add(pTag);

      animalApi = CellKit.animalCell({ scale: 0.80 });
      bobGroup.add(animalApi.group);
      var aTag = CellKit.label("Animal Cell (Flexible Membrane · Centrioles · Lysosomes)", { bg: "rgba(244,63,94,0.92)" });
      aTag.position.set(0, 0.92, 0);
      bobGroup.add(aTag);

      rulerGroup = plantApi.parts.vacuole || clampGroup;
      fiducialGroup = plantApi.parts.chloroplast || clampGroup;
    } else {
      rulerGroup = clampGroup;
      fiducialGroup = clampGroup;
    }

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.95);
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
    var sc = 0.88 + (state.trialIdx / 4) * 0.24;
    if (bobGroup) bobGroup.scale.setScalar(sc);
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    document.dispatchEvent(new CustomEvent("l2:bench-cond", { detail: { cond: cond } }));
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Dense Cristae Folding (1.5× ATP Synthase density): slope rises from 0.45 to 0.68!"
      : cond === "wide"
        ? "Oxygen-starved / Cyanide-inhibited mitochondria: electron transport stalls at high demand!"
        : "Normal Aerobic Respiration (38 ATP per glucose): ATP output is directly proportional to cristae area (k = 0.45).";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " (" + tr.t + ", C = " + rd.I + " µm²): ATP Rate = " + rd.V.toFixed(1) + " units → Ratio = " + rd.R.toFixed(2));
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l2:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l2:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 2;
    state.cond = "std";
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === "std" ? "true" : "false");
    });
    applyTrialGeometry();
    paintHint();
    document.dispatchEvent(new CustomEvent("l2:bench-reset"));
    toast("Organelle bench reset. Tap Trials A–E to compare tissue mitochondrial cristae area and ATP output.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> tissue trials";
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
    if (clampGroup) clampGroup.rotation.y = Math.sin(t * 0.45) * 0.16;
    if (bobGroup) bobGroup.rotation.y = Math.cos(t * 0.45) * 0.16;
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
