/* Lesson 02 · 3D Internal Resistance & Lost Volts Bench — 12.0 V Cell (r = 1.2 Ω), Plug Key, Resistance Box R, Series Ammeter & Parallel Voltmeter */
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
    cond: "std", // "std" (key closed: V = E − Ir), "heavy" (key open: I = 0 so V = E = 12.0 V), "wide" (key closed + two-readings working for r)
    trialIdx: 4, // default R = 2.8 Ω (I = 3.0 A, V = 8.4 V)
    timed: {},
    running: false
  };

  // One cell throughout: E = 12.0 V, r = 1.20 Ω (data.js). Every reading is computed from
  // I = E ÷ (R + r), V = IR = E − Ir, lost volts v = Ir — identical to the data.js table.
  var EMF = 12.0, R_INT = 1.2;
  function reading(idx, cond) {
    var R = DATA.trials[idx].L;
    if (cond === "heavy") return { R: R, I: 0, V: EMF, lost: 0, open: true };
    var I = EMF / (R + R_INT);
    return { R: R, I: I, V: I * R, lost: I * R_INT, open: false };
  }
  // Two-readings check: pair the chosen load with Trial A (or Trial E when A itself is chosen).
  // r = (V₁ − V₂) ÷ (I₂ − I₁), then E = V₁ + I₁r.
  function twoReadings(idx) {
    var j = idx === 0 ? 4 : 0;
    var a = reading(Math.min(idx, j), "std"), b = reading(Math.max(idx, j), "std");
    var r = (a.V - b.V) / (b.I - a.I);
    return { i1: Math.min(idx, j), i2: Math.max(idx, j), a: a, b: b, r: r, E: a.V + a.I * r };
  }
  var readoutEl = document.getElementById("bench-readout");
  function paintReadout() {
    if (!readoutEl) return;
    var tr = DATA.trials[state.trialIdx], rd = reading(state.trialIdx, state.cond);
    var h =
      '<div><span>' + (rd.open ? "Key K" : "Trial " + tr.label) + '</span><b>' + (rd.open ? "OPEN" : rd.R.toFixed(1) + " Ω") + '</b></div>' +
      '<div><span>I / A</span><b>' + rd.I.toFixed(2) + '</b></div>' +
      '<div><span>V / V</span><b>' + rd.V.toFixed(2) + '</b></div>' +
      '<div class="hot"><span>Ir / V</span><b>' + rd.lost.toFixed(2) + '</b></div>';
    if (state.cond === "wide") {
      var w = twoReadings(state.trialIdx), A = DATA.trials[w.i1].label, B = DATA.trials[w.i2].label;
      h += '<div style="grid-column:1/-1"><span>Two readings · ' + A + ' &amp; ' + B + '</span><b style="white-space:normal;font-size:13px">r = (' +
        w.a.V.toFixed(2) + ' − ' + w.b.V.toFixed(2) + ') ÷ (' + w.b.I.toFixed(2) + ' − ' + w.a.I.toFixed(2) + ') = ' + w.r.toFixed(2) + ' Ω · E = ' + w.E.toFixed(1) + ' V</b></div>';
    }
    readoutEl.innerHTML = h;
  }
  function emit(name, extra) {
    var rd = reading(state.trialIdx, state.cond);
    var d = { trial: state.trialIdx, cond: state.cond, I: rd.I, V: rd.V, R: rd.R, lost: rd.lost, E: EMF, open: rd.open, count: Object.keys(state.timed).length };
    if (state.cond === "wide") { var w = twoReadings(state.trialIdx); d.pair = [w.i1, w.i2]; d.rTwo = w.r; }
    for (var k in extra) d[k] = extra[k];
    document.dispatchEvent(new CustomEvent(name, { detail: d }));
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
    target: new THREE.Vector3(0, 0.55, 0),
    pitch: 0.34,
    yaw: 0.08,
    fitWidth: 4.8,
    distance: 4.9,
    minYaw: -0.8,
    maxYaw: 0.8,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, rGlowMat, plugPin, ammeterPivot, voltmeterPivot, hudSprite, bobGlow;
  var chargeBeads = [];

  if (stage) build();
  wireButtons();
  paintHint();
  paintReadout();

  function build() {
    var scene = stage.rig;

    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    var brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88 });
    var darkCase = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.42, metalness: 0.25 });

    // 1. 12.0 V Accumulator with visible internal resistance r = 1.2 Ω (bobGroup for spotlight)
    bobGroup = new THREE.Group();
    bobGroup.position.set(-1.15, 0, -0.25);
    var cellBox = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.54, 0.48), darkCase);
    cellBox.position.y = 0.27;
    bobGroup.add(cellBox);
    rGlowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xef4444, emissiveIntensity: 0.5, roughness: 0.3 });
    var rBar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.05), rGlowMat);
    rBar.position.set(0, 0.28, 0.25);
    bobGroup.add(rBar);
    var cTag = SceneKit.labelTexture("Cell E, r", { size: 32, bg: "rgba(200,38,74,0.92)" });
    var cSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: cTag, transparent: true, depthWrite: false }));
    cSpr.scale.set(0.22 * cTag.userData.aspect, 0.22, 1);
    cSpr.position.set(0, 0.78, 0);
    bobGroup.add(cSpr);
    var hit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.6), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 0.3;
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    // 2. Brass Plug Key K (clampGroup)
    clampGroup = new THREE.Group();
    clampGroup.position.set(-1.15, 0, 0.55);
    var swBase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.26), darkCase);
    swBase.position.y = 0.04;
    plugPin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.18, 16), brassMat);
    plugPin.position.set(0, 0.14, 0);
    clampGroup.add(swBase, plugPin);
    var kTag = SceneKit.labelTexture("Plug Key K", { size: 30, bg: "rgba(10,15,29,0.88)" });
    var kSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: kTag, transparent: true, depthWrite: false }));
    kSpr.scale.set(0.20 * kTag.userData.aspect, 0.20, 1);
    kSpr.position.set(0, 0.45, 0);
    clampGroup.add(kSpr);
    scene.add(clampGroup);

    // 3. Decade Resistance Box R (rulerGroup)
    rulerGroup = new THREE.Group();
    rulerGroup.position.set(0.20, 0, 0.55);
    var rBox = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.42), new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.6 }));
    rBox.position.y = 0.14;
    rulerGroup.add(rBox);
    for (var p = -2; p <= 2; p++) {
      var peg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.10, 14), brassMat);
      peg.position.set(p * 0.16, 0.32, 0);
      rulerGroup.add(peg);
    }
    var rbTag = SceneKit.labelTexture("Resistance box R", { size: 32, bg: "rgba(59,108,246,0.92)" });
    var rbSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: rbTag, transparent: true, depthWrite: false }));
    rbSpr.scale.set(0.21 * rbTag.userData.aspect, 0.21, 1);
    rbSpr.position.set(0, 0.58, 0);
    rulerGroup.add(rbSpr);
    scene.add(rulerGroup);

    // 4. Voltmeter across Cell & Series Ammeter (fiducialGroup)
    fiducialGroup = new THREE.Group();
    function buildMeter(x, z, labelText, tagBg, needleColor) {
      var g = new THREE.Group();
      g.position.set(x, 0, z);
      var box = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.42, 0.32), darkCase);
      box.position.y = 0.21;
      g.add(box);
      var face = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.28, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0ea5e9, emissiveIntensity: 0.18 })
      );
      face.position.set(0, 0.24, 0.155);
      g.add(face);
      var piv = new THREE.Group();
      piv.position.set(0, 0.14, 0.175);
      var ndl = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.20, 0.015),
        new THREE.MeshStandardMaterial({ color: needleColor, emissive: needleColor, emissiveIntensity: 0.6 })
      );
      ndl.position.y = 0.09;
      piv.add(ndl);
      g.add(piv);
      var mTag = SceneKit.labelTexture(labelText, { size: 30, bg: tagBg });
      var mSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: mTag, transparent: true, depthWrite: false }));
      mSpr.scale.set(0.20 * mTag.userData.aspect, 0.20, 1);
      mSpr.position.set(0, 0.60, 0);
      g.add(mSpr);
      fiducialGroup.add(g);
      return piv;
    }
    voltmeterPivot = buildMeter(-0.05, -0.52, "Voltmeter V", "rgba(217,138,0,0.92)", 0xffb23f);
    ammeterPivot = buildMeter(1.32, 0.20, "Ammeter I", "rgba(13,156,126,0.92)", 0x3ee6c4);
    scene.add(fiducialGroup);

    // 5. HUD Sprite
    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.28, 1.32, -0.35);
    // phones get the HTML readout under the canvas instead of this tiny floating HUD
    hudSprite.visible = root.clientWidth >= 560;
    scene.add(hudSprite);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.85);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(-1.15, 0.3, -0.25);
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap Loads A–E to measure V & Ir");

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

  function updateHudSprite(statusLine) {
    if (!hudSprite) return;
    var tr = DATA.trials[state.trialIdx];
    var c = document.createElement("canvas");
    c.width = 460;
    c.height = 240;
    var g = c.getContext("2d");
    g.fillStyle = "rgba(10,15,29,0.92)";
    g.strokeStyle = "rgba(62,230,196,0.65)";
    g.lineWidth = 4;
    g.beginPath();
    if (g.roundRect) g.roundRect(4, 4, 452, 232, 22);
    else g.rect(4, 4, 452, 232);
    g.fill();
    g.stroke();

    var rd = reading(state.trialIdx, state.cond);
    var isOpen = rd.open;
    var shownI = rd.I.toFixed(2);
    var shownV = rd.V.toFixed(2);
    var shownLost = rd.lost.toFixed(2);

    g.fillStyle = "#3ee6c4";
    g.font = "600 22px JetBrains Mono, monospace";
    g.fillText("TRIAL " + tr.label + " · R = " + tr.L.toFixed(1) + " Ω (" + (isOpen ? "Key OPEN" : "Key CLOSED") + ")", 24, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 40px JetBrains Mono, monospace";
    g.fillText("I = " + shownI + " A · V = " + shownV + " V", 24, 102);

    g.fillStyle = "#ffb23f";
    g.font = "600 25px JetBrains Mono, monospace";
    g.fillText("Lost Volts v = Ir = " + shownLost + " V", 24, 152);

    g.fillStyle = "#a5b0c9";
    g.font = "500 20px Manrope, sans-serif";
    g.fillText(statusLine || "", 24, 202);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    if (hudSprite.material.map) hudSprite.material.map.dispose();
    hudSprite.material.map = tex;
    hudSprite.material.needsUpdate = true;
    hudSprite.scale.set(1.55, 1.55 * (240 / 460), 1);
  }

  function applyTrialGeometry() {
    var rd = reading(state.trialIdx, state.cond);
    var isOpen = rd.open;
    var I_val = rd.I;
    var V_val = rd.V;
    if (plugPin) plugPin.position.y = isOpen ? 0.24 : 0.13;
    if (ammeterPivot) ammeterPivot.rotation.z = 0.65 - (I_val / 3.5) * 1.30;
    if (voltmeterPivot) voltmeterPivot.rotation.z = 0.65 - (V_val / 14.0) * 1.30;
    if (rGlowMat) rGlowMat.emissiveIntensity = isOpen ? 0.1 : 0.25 + (I_val / 3.5) * 0.75;
    paintReadout();
  }

  function pressCond() {
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === state.cond ? "true" : "false");
    });
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    pressCond();
    applyTrialGeometry();
    var w = twoReadings(state.trialIdx), rd = reading(state.trialIdx, cond);
    var msg = cond === "heavy"
      ? "Plug Key OPEN (I = 0 A): lost volts Ir = 0, so the voltmeter reads the full EMF E = 12.00 V."
      : cond === "wide"
        ? "Two readings, same cell: Trials " + DATA.trials[w.i1].label + " & " + DATA.trials[w.i2].label + " give r = " + w.r.toFixed(2) + " Ω. Tap another trial to pair it with " + (state.trialIdx === 0 ? "E" : "A") + "."
        : "Plug Key CLOSED: I = " + rd.I.toFixed(2) + " A, terminal p.d. V = E − Ir = " + rd.V.toFixed(2) + " V.";
    toast(msg);
    updateHudSprite(cond === "heavy" ? "Key OPEN · I = 0 so V = E" : cond === "wide" ? "Two readings → r = " + w.r.toFixed(2) + " Ω" : "Key CLOSED · V = E − Ir");
    emit("l1:bench-cond");
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    // a reading needs current, so tapping a load closes the key (two-readings mode keeps its working)
    if (state.cond === "heavy") { state.cond = "std"; pressCond(); emit("l1:bench-cond"); }
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx], rd = reading(idx, state.cond);
    updateHudSprite("V " + rd.V.toFixed(2) + " + Ir " + rd.lost.toFixed(2) + " = " + EMF.toFixed(1) + " V");
    toast("Trial " + tr.label + " (R = " + rd.R.toFixed(1) + " Ω): I = " + rd.I.toFixed(2) + " A, terminal V = " + rd.V.toFixed(2) + " V, lost volts Ir = " + rd.lost.toFixed(2) + " V");
    paintHint();

    var n = Object.keys(state.timed).length;
    emit("l1:bench");
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 4;
    state.cond = "std";
    pressCond();
    applyTrialGeometry();
    paintHint();
    updateHudSprite("Reset · Ready to record Trials A–E");
    document.dispatchEvent(new CustomEvent("l1:bench-reset"));
    toast("Bench reset. Tap Trials A–E to measure I, V, and Lost Volts Ir.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> loads";
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
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
