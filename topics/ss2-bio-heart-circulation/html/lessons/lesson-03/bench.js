/* Lesson 03 · 3D Cardiac Cycle, Myogenic Pacemaker & Cardiac Output Bench — Tests HR (60 to 150 bpm), Cycle Time T = 60/HR, and Cardiac Output CO = HR × SV */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || !window.L03 || typeof THREE === "undefined") return;

  var DATA = window.L03;
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
    cond: "std", // "std" = Normal SV (75 mL = 0.075 L), "heavy" = Sympathetic Adrenaline SV (110 mL = 0.110 L), "wide" = Vagal / Heart Block arrhythmia
    trialIdx: 1,
    timed: {}
  };

  function reading(idx, cond) {
    var hr = DATA.trials[idx].L; // 60, 75, 100, 120, 150 bpm
    var svL = cond === "heavy" ? 0.110 : cond === "wide" ? 0.075 * (1 - 0.002 * hr) : 0.075;
    var co = hr * svL;
    var T = 60 / hr;
    return { I: hr, V: co, R: svL, T: T };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Rate HR</span><b>' + tr.L + ' bpm</b></div>' +
      '<div><span>Cycle T</span><b>' + rd.T.toFixed(2) + ' s</b></div>' +
      '<div><span>SV</span><b>' + Math.round(rd.R * 1000) + ' mL</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>CO = HR×SV</span><b>' + rd.V.toFixed(2) + ' L/min</b></div>';
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
    distance: 4.8,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, heartApi, valveApi, bobGlow;

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
    clampGroup.position.set(-0.95, 0.84, 0.05);
    scene.add(clampGroup);

    if (window.HeartKit) {
      heartApi = HeartKit.heart({ bpm: 75, mode: "pace", scale: 1.02, labels: true });
      clampGroup.add(heartApi.group);
      var hTag = HeartKit.label("Yellow spark: SAN → AVN → His → Purkinje", { bg: "rgba(217,138,0,0.92)", h: 0.14 });
      hTag.position.set(0, 1.62, 0);
      clampGroup.add(hTag);

      var parts = heartApi.parts || {};
      rulerGroup = parts.san || clampGroup;
      fiducialGroup = parts.lv || clampGroup;
    } else {
      rulerGroup = clampGroup;
      fiducialGroup = clampGroup;
    }

    bobGroup = new THREE.Group();
    bobGroup.position.set(1.3, 0.62, 0.0);
    scene.add(bobGroup);

    if (window.HeartKit) {
      valveApi = HeartKit.valve({ open: 0.5, scale: 0.88, cusps: 2 });
      bobGroup.add(valveApi.group);
      var vTag = HeartKit.label("AV valve snapping shut = 'LUB'", { bg: "rgba(225,29,72,0.92)", h: 0.13 });
      vTag.position.set(0, 0.98, 0);
      bobGroup.add(vTag);
    }

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(251,191,36,0.92)", 0.95);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(1.3, 0.62, 0.1);
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
    if (heartApi && heartApi.userData && heartApi.userData.setState) {
      heartApi.userData.setState({ bpm: tr.L, cutaway: true, mode: "pace" });
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
      ? "Adrenaline + Sympathetic Surge (SV = 110 mL = 0.110 L): steeper slope on the CO vs HR graph!"
      : cond === "wide"
        ? "Incomplete Diastolic Filling: when AVN delay is disrupted, stroke volume drops at high HR!"
        : "Standard Stroke Volume (SV = 75 mL = 0.075 L/beat): CO = HR × 0.075 L/min.";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " (HR = " + tr.L + " bpm): Cycle T = " + rd.T.toFixed(2) + " s · Cardiac Output CO = " + rd.V.toFixed(2) + " L/min");
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
    toast("Pacemaker bench reset. Tap Trials A–E to step heart rate from 60 to 150 bpm.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> heart rates";
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
    if (heartApi && heartApi.tick) heartApi.tick(dt, t);
    if (valveApi && valveApi.tick) {
      // the valve shuts exactly when the heart's ventricles contract ('LUB') at the trial's heart rate
      valveApi.userData.setState({ open: heartApi && heartApi.userData.beat ? heartApi.userData.beat.avOpen : 0.5 });
      valveApi.tick(dt, t);
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
