/* Lesson 04 · 3D Capillary Starling Filtration & Blood Vessel Bench — Measures P_c, π_c, and NFP = P_c − π_c from arterial end (0%) to venous end (100%) */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || !window.L04 || typeof THREE === "undefined") return;

  var DATA = window.L04;
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
    cond: "std", // "std" = Normal plasma albumin (π_c = 25 mmHg), "heavy" = Kwashiorkor low albumin (π_c = 15 mmHg), "wide" = Venous hypertension (high P_c)
    trialIdx: 0,
    timed: {}
  };

  function reading(idx, cond) {
    var pos = DATA.trials[idx].L; // 0, 25, 50, 75, 100 %
    var pc = 35.0 - 0.20 * pos;
    if (cond === "wide") pc = 38.0 - 0.12 * pos;
    var pic = cond === "heavy" ? 15.0 : 25.0;
    var nfp = pc - pic;
    return { I: pos, V: nfp, R: pc, pic: pic };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    var sign = rd.V > 0 ? "+" : "";
    readoutEl.innerHTML =
      '<div><span>Position</span><b>' + tr.L + '%</b></div>' +
      '<div><span>P_c (out)</span><b>' + rd.R.toFixed(1) + ' mmHg</b></div>' +
      '<div><span>π_c (in)</span><b>' + rd.pic.toFixed(1) + ' mmHg</b></div>' +
      '<div class="' + (state.cond !== "std" ? "hot" : "") + '"><span>NFP (P_c−π_c)</span><b>' + sign + rd.V.toFixed(1) + ' mmHg</b></div>';
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

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, capApi, vesselsApi, bobGlow;

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
    clampGroup.position.set(-1.1, 0.8, 0.05);
    scene.add(clampGroup);

    if (window.HeartKit) {
      capApi = HeartKit.capillaryBed({ scale: 0.95 });
      clampGroup.add(capApi.group);
      var cTag = HeartKit.label("Amber ring = your probe position", { bg: "rgba(217,138,0,0.92)", h: 0.12 });
      cTag.position.set(0, 1.15, 0);
      clampGroup.add(cTag);

      var parts = capApi.parts || {};
      rulerGroup = parts.arteriole || clampGroup;
      fiducialGroup = parts.venule || clampGroup;
    } else {
      rulerGroup = clampGroup;
      fiducialGroup = clampGroup;
    }

    bobGroup = new THREE.Group();
    bobGroup.position.set(1.5, 0.66, 0.0);
    scene.add(bobGroup);

    if (window.HeartKit) {
      vesselsApi = HeartKit.vessels({ scale: 0.72 });
      bobGroup.add(vesselsApi.group);
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
    paintReadout(rd, tr);
    if (capApi) capApi.userData.setState({
      mode: state.cond === "heavy" ? "kwash" : state.cond === "wide" ? "congest" : "normal",
      probe: tr.L / 100,
      nfp: rd.V
    });
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
      ? "Kwashiorkor (low plasma albumin, π_c = 15 mmHg): NFP stays positive (+20 to 0 mmHg), so fluid is not drawn back. Watch the tissue space swell (oedema)."
      : cond === "wide"
        ? "Venous congestion: high pressure at the venous end stops fluid being drawn back in, so tissue fluid piles up (oedema)."
        : "Normal Capillary Starling Balance (π_c = 25 mmHg): +10 mmHg ultrafiltration at 0%, 0 mmHg at 50%, −10 mmHg reabsorption at 100%!";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    var dir = rd.V > 0.1 ? "Ultrafiltration OUT" : rd.V < -0.1 ? "Reabsorption IN" : "Dynamic Equilibrium";
    toast("Trial " + tr.label + " (" + tr.L + "% along capillary): P_c = " + rd.R.toFixed(1) + " mmHg, π_c = " + rd.pic.toFixed(1) + " mmHg → NFP = " + (rd.V >= 0 ? "+" : "") + rd.V.toFixed(1) + " mmHg (" + dir + ")");
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 0;
    state.cond = "std";
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === "std" ? "true" : "false");
    });
    applyTrialGeometry();
    paintHint();
    document.dispatchEvent(new CustomEvent("l1:bench-reset"));
    toast("Capillary bench reset. Tap Trials A–E to measure P_c and NFP from arterial to venous end.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> capillary positions";
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
    if (capApi && capApi.tick) capApi.tick(dt, t);
    if (vesselsApi && vesselsApi.tick) vesselsApi.tick(dt, t);
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
