/* Lesson 01 · 3D Ohm's Law & Resistivity Practical Bench — Accumulator, Plug Key, Rheostat, Series Ammeter, Parallel Voltmeter & Constantan Coil */
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
    cond: "std", // "std" (Constantan 2.20 Ω, T=const), "heavy" (Double diameter d=2d0 -> 0.55 Ω), "wide" (Key left closed -> heated wire)
    trialIdx: 2,
    timed: {},
    running: false,
    simElapsed: 0
  };

  // Readings depend on the wire condition:
  //  std   — constantan d0, key opened between readings: R stays 2.20 Ω (ohmic)
  //  heavy — same length, double diameter: A ×4 so R = 2.20 ÷ 4 = 0.55 Ω
  //  wide  — key left closed: Joule heating raises R as I grows (illustrative model R = 2.20(1 + 0.16 I²))
  function reading(idx, cond) {
    var I = DATA.trials[idx].L;
    var R = cond === "heavy" ? 0.55 : cond === "wide" ? 2.20 * (1 + 0.16 * I * I) : 2.20;
    return { I: I, V: I * R, R: R };
  }
  var readoutEl = document.getElementById("bench-readout");
  function paintReadout(rd, tr) {
    if (!readoutEl) return;
    readoutEl.innerHTML =
      '<div><span>Trial</span><b>' + tr.label + '</b></div>' +
      '<div><span>I / A</span><b>' + rd.I.toFixed(2) + '</b></div>' +
      '<div><span>V / V</span><b>' + rd.V.toFixed(2) + '</b></div>' +
      '<div class="' + (state.cond === "wide" ? "hot" : "") + '"><span>V÷I / Ω</span><b>' + rd.R.toFixed(2) + '</b></div>';
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

  var standGroup, clampGroup, fiducialGroup, rulerGroup, bobGroup, wireMesh, sliderMesh, ammeterPivot, voltmeterPivot, hudSprite, bobGlow;
  var chargeBeads = [];

  if (stage) build();
  wireButtons();
  paintHint();
  applyTrialGeometry();

  function build() {
    var scene = stage.rig;

    // 1. Mahogany bench top
    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    var metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 });
    var brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88 });
    var darkCase = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.42, metalness: 0.25 });

    // 2. Accumulator + Brass Plug Key (clampGroup for narrator spotlight)
    clampGroup = new THREE.Group();
    clampGroup.position.set(-1.35, 0, -0.45);
    var cellBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.48, 0.44), darkCase);
    cellBox.position.y = 0.24;
    clampGroup.add(cellBox);
    var keyBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.26), brassMat);
    keyBase.position.set(0, 0.04, 0.55);
    clampGroup.add(keyBase);
    var keyTag = SceneKit.labelTexture("Cell + key K", { size: 32, bg: "rgba(10,15,29,0.88)" });
    var keySpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: keyTag, transparent: true, depthWrite: false }));
    keySpr.scale.set(0.22 * keyTag.userData.aspect, 0.22, 1);
    keySpr.position.set(0, 0.72, 0.15);
    clampGroup.add(keySpr);
    scene.add(clampGroup);

    // 3. Sliding Rheostat (rulerGroup for narrator spotlight)
    rulerGroup = new THREE.Group();
    rulerGroup.position.set(-1.15, 0, 0.65);
    var rheoCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.95, 24),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.75 })
    );
    rheoCyl.rotation.z = Math.PI / 2;
    rheoCyl.position.y = 0.20;
    rulerGroup.add(rheoCyl);
    sliderMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.16), brassMat);
    sliderMesh.position.set(0, 0.34, 0);
    rulerGroup.add(sliderMesh);
    var rTag = SceneKit.labelTexture("Rheostat", { size: 32, bg: "rgba(10,15,29,0.88)" });
    var rSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: rTag, transparent: true, depthWrite: false }));
    rSpr.scale.set(0.21 * rTag.userData.aspect, 0.21, 1);
    rSpr.position.set(0, 0.62, 0);
    rulerGroup.add(rSpr);
    scene.add(rulerGroup);

    // 4. Series Ammeter & Parallel Voltmeter (fiducialGroup for narrator spotlight)
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
    ammeterPivot = buildMeter(1.35, 0.55, "Ammeter (series)", "rgba(13,156,126,0.92)", 0x3ee6c4);
    voltmeterPivot = buildMeter(0.15, -0.58, "Voltmeter (parallel)", "rgba(217,138,0,0.92)", 0xffb23f);
    scene.add(fiducialGroup);

    // 5. Constantan Resistance Wire / Standard Resistor R = 2.20 Ω (bobGroup for narrator spotlight)
    bobGroup = new THREE.Group();
    bobGroup.position.set(0.15, 0, 0.35);
    var board = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.07, 0.38), new THREE.MeshStandardMaterial({ color: 0xf5f2eb, roughness: 0.45 }));
    board.position.y = 0.035;
    bobGroup.add(board);
    var termL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 16), brassMat);
    termL.position.set(-0.45, 0.14, 0);
    var termR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 16), brassMat);
    termR.position.set(0.45, 0.14, 0);
    bobGroup.add(termL, termR);

    wireMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.90, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.85, emissive: 0x000000 })
    );
    wireMesh.rotation.z = Math.PI / 2;
    wireMesh.position.set(0, 0.20, 0);
    bobGroup.add(wireMesh);

    var wTag = SceneKit.labelTexture("Constantan wire", { size: 32, bg: "rgba(59,108,246,0.92)" });
    var wSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: wTag, transparent: true, depthWrite: false }));
    wSpr.scale.set(0.21 * wTag.userData.aspect, 0.21, 1);
    wSpr.position.set(0, 0.48, 0);
    bobGroup.add(wSpr);

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.5), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 0.2;
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    standGroup = clampGroup;

    // Animated electron beads along the test wire
    var beadMat = new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9488, emissiveIntensity: 0.85 });
    for (var i = 0; i < 8; i++) {
      var b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), beadMat);
      b.position.set(-0.40 + (i / 8) * 0.80, 0.20, 0.04);
      bobGroup.add(b);
      chargeBeads.push({ mesh: b, u: i / 8 });
    }

    // 6. Live Digital Readout HUD Sprite
    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.28, 1.32, -0.35);
    // phones get the HTML readout under the canvas instead of this tiny floating HUD
    hudSprite.visible = root.clientWidth >= 560;
    scene.add(hudSprite);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.85);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(0.15, 0.25, 0.35);
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap a current trial A–E");

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
    var rd = reading(state.trialIdx, state.cond);
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

    g.fillStyle = "#3ee6c4";
    g.font = "600 22px JetBrains Mono, monospace";
    var condTxt = state.cond === "heavy" ? "2× Diam (0.55 Ω)" : state.cond === "wide" ? "Heated Wire" : "Standard 2.20 Ω";
    g.fillText("TRIAL " + tr.label + " · I = " + rd.I.toFixed(2) + " A (" + condTxt + ")", 24, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 42px JetBrains Mono, monospace";
    g.fillText("V = " + rd.V.toFixed(2) + " V · I = " + rd.I.toFixed(2) + " A", 24, 102);

    g.fillStyle = "#ffb23f";
    g.font = "600 26px JetBrains Mono, monospace";
    g.fillText("Ratio V ÷ I = R = " + rd.R.toFixed(2) + " Ω", 24, 152);

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
    var tr = DATA.trials[state.trialIdx];
    var rd = reading(state.trialIdx, state.cond);
    paintReadout(rd, tr);
    if (!wireMesh) return;
    if (sliderMesh) sliderMesh.position.x = -0.35 + (state.trialIdx / 4) * 0.70;
    if (ammeterPivot) ammeterPivot.rotation.z = 0.65 - (rd.I / 1.5) * 1.30;
    if (voltmeterPivot) voltmeterPivot.rotation.z = 0.65 - (rd.V / 3.6) * 1.30;

    if (state.cond === "heavy") {
      wireMesh.scale.set(2.0, 1.0, 2.0);
      wireMesh.material.emissive.setHex(0x000000);
    } else if (state.cond === "wide") {
      wireMesh.scale.set(1.0, 1.0, 1.0);
      wireMesh.material.emissive.setHex(0xd97706);
      wireMesh.material.emissiveIntensity = 0.45;
    } else {
      wireMesh.scale.set(1.0, 1.0, 1.0);
      wireMesh.material.emissive.setHex(0x000000);
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
      ? "Doubled diameter (2d): Cross-sectional area A quadruples (4A), so R drops to ¼ (0.55 Ω)!"
      : cond === "wide"
        ? "Key left closed! Wire heats up, lattice vibrations rise, and R drifts upward!"
        : "Standard constantan wire (d = 0.40 mm) with key removed between readings (R = 2.20 Ω).";
    toast(msg);
    updateHudSprite(msg.slice(0, 38));
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.running = false;
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    var rd = reading(idx, state.cond);
    updateHudSprite("Recorded! V/I = " + rd.R.toFixed(2) + " Ω" + (state.cond === "wide" ? " (key left closed)" : " (key opened)"));
    toast("Trial " + tr.label + ": I = " + rd.I.toFixed(2) + " A, V = " + rd.V.toFixed(2) + " V → R = V/I = " + rd.R.toFixed(2) + " Ω");
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
    updateHudSprite("Reset · Ready to record V–I trials");
    toast("Circuit reset. Tap Trials A–E to record I and V.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Recorded <b>" + n + " of 5</b> readings";
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
    var tr = DATA.trials[state.trialIdx];
    var speed = 0.25 * reading(state.trialIdx, state.cond).I * (state.cond === "heavy" ? 0.25 : 1); // drift v = I / (nAe): 4× area → ¼ speed
    for (var i = 0; i < chargeBeads.length; i++) {
      chargeBeads[i].u = (chargeBeads[i].u + speed * dt) % 1;
      chargeBeads[i].mesh.position.x = -0.42 + chargeBeads[i].u * 0.84;
    }

    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
