/* Lesson 03 · 3D Pond Micro-Safari (Amoeba, Paramecium, Euglena, Volvox, Spirogyra) & Surface-Area-to-Volume (SA/V = 6/L) Scaling Bench */
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
    cond: "std", // "std" (SA/V = 6/L ratio), "heavy" (Folded/villi membrane -> 2× SA/V = 12/L), "wide" (Spherical sluggish diffusion)
    trialIdx: 0,
    timed: {}
  };

  var PROTIST_TYPES = ["euglena", "paramecium", "amoeba", "volvox", "spirogyra"];

  function reading(idx, cond) {
    var L = DATA.trials[idx].L; // 1, 2, 3, 4, 6 mm
    var SA = 6 * L * L * (cond === "heavy" ? 2.0 : 1.0);
    var V = L * L * L;
    var ratio = SA / V;
    return { I: L, V: ratio, R: SA, vol: V };
  }

  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Side L</span><b>' + rd.I.toFixed(1) + ' mm</b></div>' +
      '<div><span>SA = 6L²</span><b>' + rd.R.toFixed(0) + ' mm²</b></div>' +
      '<div><span>V = L³</span><b>' + rd.vol.toFixed(0) + ' mm³</b></div>' +
      '<div class="' + (rd.V < 2.0 ? "hot" : "") + '"><span>SA÷V = 6÷L</span><b>' + rd.V.toFixed(2) + ' mm⁻¹</b></div>';
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

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, protistModels = [], cubeApi, bobGlow;

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

    // Left: 3D Pond Protist Safari Carousel (clampGroup)
    clampGroup = new THREE.Group();
    clampGroup.position.set(-1.15, 0.70, 0);
    scene.add(clampGroup);

    if (window.CellKit) {
      PROTIST_TYPES.forEach(function (tp, k) {
        var pr = CellKit.protist({ type: tp, scale: 0.78 });
        pr.group.visible = k === 0;
        clampGroup.add(pr.group);
        protistModels.push(pr);
      });
      var pTag = CellKit.label("3D Cell Form Specimen (Euglena · Volvox · Spirogyra)", { bg: "rgba(34,197,94,0.92)" });
      pTag.position.set(0, 0.94, 0);
      clampGroup.add(pTag);
    }

    // Right: 3D Scaling Cube SA/V = 6/L (bobGroup)
    bobGroup = new THREE.Group();
    bobGroup.position.set(1.10, 0.70, 0);
    scene.add(bobGroup);

    if (window.CellKit) {
      cubeApi = CellKit.cube({ size: 0.65 });
      bobGroup.add(cubeApi.group);
      var cTag = CellKit.label("3D Scaling Cube (SA = 6L² · V = L³ · SA/V = 6/L)", { bg: "rgba(13,156,126,0.92)" });
      cTag.position.set(0, 0.96, 0);
      bobGroup.add(cTag);
    }

    rulerGroup = clampGroup;
    fiducialGroup = bobGroup;

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;

    bobGlow = SceneKit.glowSprite("rgba(62,230,196,0.92)", 0.95);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(1.10, 0.70, 0.1);
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

    protistModels.forEach(function (pr, k) {
      pr.group.visible = k === state.trialIdx;
    });
    if (cubeApi && cubeApi.setL) {
      cubeApi.setL(tr.L);
    }
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    document.dispatchEvent(new CustomEvent("l3:bench-cond", { detail: { cond: cond } }));
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Microvilli / Folded Surface (2× Surface Area): doubles SA/V at every size L, explaining why intestinal and root-hair cells fold or extend!"
      : cond === "wide"
        ? "Thick Unfolded Body: core starves of oxygen once L exceeds 2 mm without a circulatory system!"
        : "Standard Cube (SA = 6L², V = L³): Surface-area-to-volume ratio follows SA/V = 6/L.";
    toast(msg);
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    var pNames = ["Euglena (Free-Living)", "Paramecium (Ciliate)", "Amoeba (Rhizopod)", "Volvox (Colony)", "Spirogyra (Filament)"];
    toast("Trial " + tr.label + " (" + pNames[idx] + " · L = " + rd.I + " mm): SA = " + rd.R + " mm², V = " + rd.vol + " mm³ → SA/V = " + rd.V.toFixed(2) + " mm⁻¹");
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l3:bench", { detail: { trial: idx, count: n, cond: state.cond, I: rd.I, V: rd.V, R: rd.R } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l3:bench-done", { detail: { count: n } }));
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
    document.dispatchEvent(new CustomEvent("l3:bench-reset"));
    toast("Bench reset. Tap Trials A–E to inspect protist forms and SA/V scaling.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> cube &amp; protist trials";
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
    protistModels.forEach(function (pr) {
      if (pr.group.visible && pr.tick) pr.tick(dt, t);
    });
    if (clampGroup) clampGroup.rotation.y = Math.sin(t * 0.5) * 0.22;
    if (bobGroup) bobGroup.rotation.y = Math.cos(t * 0.45) * 0.22;
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
