/* Lesson 02 · 3D 4-Chamber Mammalian Heart Cut-Away Dissector Bench — Inspects wall thickness w (mm), peak systolic pressure P (mmHg), and right vs left circulation pathways */
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
    cond: "std", // "std" = Normal healthy heart (P = 8w), "heavy" = Athletic hypertrophy (P = 10w), "wide" = Valve prolapse regurgitation
    trialIdx: 2,
    timed: {}
  };

  function reading(idx, cond) {
    var w = DATA.trials[idx].L; // 1.5, 2.0, 5.0, 10.0, 15.0 mm
    var P = cond === "heavy" ? 10 * w : cond === "wide" ? 8 * w * (1 - 0.025 * w) : 8 * w;
    var ratio = w / 5.0;
    return { I: w, V: P, R: ratio };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Chamber</span><b>' + tr.t + '</b></div>' +
      '<div><span>Wall w</span><b>' + tr.L.toFixed(1) + ' mm</b></div>' +
      '<div><span>Peak P</span><b>' + rd.V.toFixed(1) + ' mmHg</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>w ÷ w_RV</span><b>' + rd.R.toFixed(2) + '×</b></div>';
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
      heartApi = HeartKit.heart({ bpm: 72, mode: "both", scale: 1.02, labels: true });
      clampGroup.add(heartApi.group);
      var hTag = HeartKit.label("Heart cut open front to back", { bg: "rgba(225,29,72,0.92)", h: 0.15 });
      hTag.position.set(0, 1.62, 0);
      clampGroup.add(hTag);

      var parts = heartApi.parts || {};
      rulerGroup = parts.rv || clampGroup;
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
      var vTag = HeartKit.label("Bicuspid valve (in step with the heart)", { bg: "rgba(13,156,126,0.92)", h: 0.13 });
      vTag.position.set(0, 0.98, 0);
      bobGroup.add(vTag);
    }

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(62,230,196,0.92)", 0.95);
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
      // A RA · B LA · C RV · D septum · E LV — the measured part glows; walls get mm callouts
      heartApi.userData.setState({ mode: state.trialIdx >= 2 ? "sys" : "both", bpm: state.cond === "heavy" ? 52 : 72 });
      if (heartApi.highlightChamber) heartApi.highlightChamber([0, 1, 2, -1, 3][state.trialIdx]);
      var parts = heartApi.parts || {};
      var focus = [parts.ra, parts.la, parts.rvWall, parts.septum, parts.lvWall][state.trialIdx];
      rulerGroup = focus || clampGroup;
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
      ? "Athlete heart: stronger muscle gives about 10 mmHg per mm of wall, and the resting beat slows to about 52 bpm."
      : cond === "wide"
        ? "Leaky valve (torn chordae tendineae): watch the valve flaps fail to seal during systole, so blood leaks back into the atrium."
        : "Normal heart (bench model P = 8 × w): the 15 mm left ventricle wall gives about 120 mmHg. The glowing part is the one you are measuring.";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    toast("Trial " + tr.label + " (" + tr.t + ", w = " + tr.L + " mm): Peak Pressure P = " + rd.V.toFixed(1) + " mmHg · Wall Ratio w/w_RV = " + rd.R.toFixed(2) + "×");
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
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
    document.dispatchEvent(new CustomEvent("l1:bench-reset"));
    toast("Heart Dissector reset. Tap Trials A–E to measure chamber wall thickness and peak pressure.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> chamber walls";
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
      // valve copies the beating heart; a regurgitating valve never seals during systole
      var av = heartApi && heartApi.userData.beat ? heartApi.userData.beat.avOpen : 0.5 + 0.5 * Math.sin(t * 4.5);
      if (state.cond === "wide") av = Math.max(av, 0.32);
      valveApi.userData.setState({ open: av });
      valveApi.tick(dt, t);
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
