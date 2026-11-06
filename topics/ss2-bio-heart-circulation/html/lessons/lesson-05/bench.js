/* Lesson 05 · 3D Haematology, Fibrin Clotting & WAEC Paper 3 Heart Bench — Measures Oxygen Capacity C_O2 = 1.34 × [Hb] and Paper 3 Drawing Magnification M = I ÷ O */
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
    cond: "std", // "std" = Normal Saturation (100%), "heavy" = Fibrin Clot Active, "wide" = Low O2 Sickle / CO Poisoning (60% sat)
    trialIdx: 3, // default 15.0 g/100 mL
    timed: {}
  };

  function reading(idx, cond) {
    var hb = DATA.trials[idx].L; // 8.0, 10.0, 12.0, 15.0, 18.0 g/100 mL
    var sat = cond === "wide" ? 0.60 : 1.00;
    var cap = 1.34 * hb * sat;
    var totO2 = cap * 50; // in 5.0 L = 50 dL
    var drawMm = [96, 104, 112, 120, 136][idx] || 120;
    var mag = drawMm / 80.0;
    return { I: hb, V: cap, R: totO2, mag: mag, drawMm: drawMm };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>[Hb] (g/dL)</span><b>' + tr.L.toFixed(1) + ' g/100 mL</b></div>' +
      '<div><span>C_O₂ (per dL)</span><b>' + rd.V.toFixed(1) + ' mL O₂/dL</b></div>' +
      '<div><span>Total O₂ (5 L)</span><b>' + Math.round(rd.R) + ' mL O₂</b></div>' +
      '<div class="' + (state.cond !== "std" ? "hot" : "") + '"><span>Paper 3 Mag (M)</span><b>' + rd.drawMm + '÷80 = ×' + rd.mag.toFixed(1) + '</b></div>';
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
    pitch: 0.14,
    portraitPitch: 0.06,
    yaw: 0.08,
    fitWidth: 4.8,
    minHeight: 340,
    distance: 4.9,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, smearApi, heartApi, bobGlow;

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
    clampGroup.position.set(-1.0, 0.95, 0.05);
    scene.add(clampGroup);

    if (window.HeartKit) {
      smearApi = HeartKit.bloodSmear({ scale: 0.86, clot: false });
      clampGroup.add(smearApi.group);
      var cTag = HeartKit.label("Stained blood smear (microscope view)", { bg: "rgba(225,29,72,0.92)", h: 0.13 });
      cTag.position.set(0, 1.0, 0);
      clampGroup.add(cTag);

      var parts = smearApi.parts || {};
      rulerGroup = parts.rbc || clampGroup;
      fiducialGroup = parts.fibrin || clampGroup;
    } else {
      rulerGroup = clampGroup;
      fiducialGroup = clampGroup;
    }

    bobGroup = new THREE.Group();
    bobGroup.position.set(1.2, 0.68, 0.0);
    scene.add(bobGroup);

    if (window.HeartKit) {
      heartApi = HeartKit.heart({ scale: 0.8, mode: "dissect", labels: true });
      bobGroup.add(heartApi.group);
      var vTag = HeartKit.label("Paper 3 specimen: sheep heart, cut open", { bg: "rgba(13,156,126,0.92)", h: 0.13 });
      vTag.position.set(0, 1.25, 0);
      bobGroup.add(vTag);
    }

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(62,230,196,0.92)", 0.95);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(1.18, 0.68, 0.1);
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
    if (smearApi) smearApi.userData.setState({ clot: state.cond === "heavy", sickle: state.cond === "wide", hb: tr.L });
    paintReadout(rd, tr);
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
      ? "Fibrin Clotting Cascade Active: Thromboplastin + Ca²⁺ + Vitamin K → Thrombin → Golden Insoluble Fibrin Meshwork!"
      : cond === "wide"
        ? "Low O₂ / Sickle-Cell Crisis (60% Saturation): Reduced oxyhaemoglobin lowers oxygen delivery to tissues!"
        : "Normal Arterial Blood Smear (100% O₂ Saturation): Each 1 g of haemoglobin binds 1.34 mL of O₂!";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " ([Hb] = " + tr.L.toFixed(1) + " g/100 mL): C_O₂ = " + rd.V.toFixed(1) + " mL O₂/100 mL, Total O₂ in 5 L = " + Math.round(rd.R) + " mL · Paper 3 Mag = ×" + rd.mag.toFixed(1));
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 3;
    state.cond = "std";
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === "std" ? "true" : "false");
    });
    applyTrialGeometry();
    paintHint();
    document.dispatchEvent(new CustomEvent("l1:bench-reset"));
    toast("Haematology & Paper 3 bench reset. Tap Trials A–E to measure C_O₂ = 1.34 × [Hb] and drawing magnification.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> haemoglobin &amp; Paper 3 trials";
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
    if (smearApi && smearApi.tick) smearApi.tick(dt, t);
    if (heartApi && heartApi.tick) heartApi.tick(dt, t);
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
