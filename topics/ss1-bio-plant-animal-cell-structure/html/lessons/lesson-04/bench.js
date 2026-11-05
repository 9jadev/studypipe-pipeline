/* Lesson 04 · 3D Osmosis, Turgidity, Plasmolysis & Haemolysis Chamber — Plant Cell & Mammalian RBC + Yam Strip Mass Change across 0.00–0.70 M Sucrose */
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
    cond: "std", // "std" (Raw living yam & cells: isotonic at 0.30 M), "heavy" (Salt-adapted halophyte: isotonic at 0.50 M), "wide" (Boiled yam: membranes denatured -> 0% change!)
    trialIdx: 2,
    timed: {}
  };

  function reading(idx, cond) {
    var M = DATA.trials[idx].L; // 0.00, 0.15, 0.30, 0.50, 0.70
    var pct = 0;
    if (cond === "wide") {
      pct = 0.0;
    } else if (cond === "heavy") {
      pct = (0.50 - M) * 52.0;
    } else {
      pct = +DATA.trials[idx].T;
    }
    var mf = 2.50 * (1 + pct / 100);
    return { I: M, V: pct, R: mf };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    var sign = rd.V > 0 ? "+" : "";
    readoutEl.innerHTML =
      '<div><span>Sucrose M</span><b>' + rd.I.toFixed(2) + ' M</b></div>' +
      '<div><span>Final m_f</span><b>' + rd.R.toFixed(2) + ' g</b></div>' +
      '<div><span>%Δm</span><b>' + sign + rd.V.toFixed(1) + '%</b></div>' +
      '<div class="' + (rd.V < 0 ? "hot" : "") + '"><span>Cell State</span><b>' + (rd.V > 1 ? "Turgid/Lysis" : rd.V < -1 ? "Plasmolysed" : "Isotonic") + '</b></div>';
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
    pitch: 0.28,
    yaw: 0.10,
    fitWidth: 5.0,
    distance: 5.0,
    minYaw: -0.85,
    maxYaw: 0.85,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, plantApi, rbcApi, bobGlow;

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
      var pTag = CellKit.label("Plant Cell (Turgid ↔ Flaccid ↔ Plasmolysed)", { bg: "rgba(34,197,94,0.92)" });
      pTag.position.set(0, 0.92, 0);
      clampGroup.add(pTag);

      rbcApi = CellKit.rbc({ scale: 0.82 });
      bobGroup.add(rbcApi.group);
      var rTag = CellKit.label("Mammalian RBC (Haemolysis ↔ Disc ↔ Crenated)", { bg: "rgba(244,63,94,0.92)" });
      rTag.position.set(0, 0.92, 0);
      bobGroup.add(rTag);
    }

    rulerGroup = clampGroup;
    fiducialGroup = bobGroup;

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(244,63,94,0.92)", 0.95);
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

    var ton = 0.5;
    if (state.cond === "wide") ton = 0.5;
    else if (rd.V > 12) ton = 1.0;
    else if (rd.V > 4) ton = 0.75;
    else if (rd.V < -12) ton = 0.0;
    else if (rd.V < -4) ton = 0.22;
    else ton = 0.5;

    if (plantApi && plantApi.setTonicity) plantApi.setTonicity(ton);
    if (rbcApi && rbcApi.setTonicity) rbcApi.setTonicity(ton);
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    document.dispatchEvent(new CustomEvent("l4:bench-cond", { detail: { cond: cond } }));
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Halophyte / Salt-Adapted Tissue (Cell sap = 0.50 M): Isotonic point shifts right to 0.50 M!"
      : cond === "wide"
        ? "Boiled Yam Control: Heat denatured the plasma membrane and tonoplast — selective permeability lost, so %Δm = 0% everywhere!"
        : "Fresh Living Yam & RBCs (Cell sap = 0.30 M): Endosmosis below 0.30 M, Isotonic at 0.30 M, Exosmosis above 0.30 M.";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    var sign = rd.V > 0 ? "+" : "";
    toast("Trial " + tr.label + " (" + rd.I.toFixed(2) + " M sucrose): m_f = " + rd.R.toFixed(2) + " g (" + sign + rd.V.toFixed(1) + "%) — " + tr.T2);
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l4:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l4:bench-done", { detail: { count: n } }));
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
    document.dispatchEvent(new CustomEvent("l4:bench-reset"));
    toast("Osmosis chamber reset. Tap Trials A–E from 0.00 M to 0.70 M.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> sucrose baths";
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
    if (plantApi && plantApi.tick) plantApi.tick(dt, t);
    if (rbcApi && rbcApi.tick) rbcApi.tick(dt, t);
    if (clampGroup) clampGroup.rotation.y = Math.sin(t * 0.45) * 0.16;
    if (bobGroup) bobGroup.rotation.y = Math.cos(t * 0.45) * 0.16;
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
