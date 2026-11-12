/* Lesson 01 · 3D Simple Pendulum Practical Bench — retort stand, split cork, metre rule, fiducial mark, stopwatch */
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
    cond: "std", // "std" (50g, 6°), "heavy" (100g, 6°), "wide" (50g, 10°)
    trialIdx: 2, // default 0.80 m
    timed: {},
    running: false,
    simElapsed: 0,
    targetSwings: 20
  };

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
    target: new THREE.Vector3(0, 1.15, 0),
    pitch: 0.22,
    yaw: 0.12,
    fitWidth: 4.8,
    distance: 5.2,
    minYaw: -0.8,
    maxYaw: 0.8,
    onFrame: frame
  });

  var pivotGroup, stringMesh, bobGroup, bobMesh, clampGroup, fiducialGroup, rulerGroup, standGroup, hudSprite, glowRing, bobGlow;
  var PIVOT_Y = 2.25;
  var SCALE_M_TO_WORLD = 1.45; // 1.00 m = 1.45 world units

  if (stage) build();
  wireButtons();
  paintHint();

  function build() {
    var scene = stage.rig;

    // 1. Laboratory wooden bench top + white base tile
    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.24, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.72 })
    );
    bench.position.y = -0.12;
    scene.add(bench);

    var tile = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.03, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xf5f2eb, roughness: 0.45 })
    );
    tile.position.set(0, 0.015, 0);
    scene.add(tile);

    // 2. Heavy iron retort stand
    standGroup = new THREE.Group();
    var metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.35, metalness: 0.78 });
    var basePlate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.85), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6 }));
    basePlate.position.set(-0.65, 0.04, -0.35);
    standGroup.add(basePlate);

    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.45, 20), metalMat);
    rod.position.set(-0.65, 1.25, -0.35);
    standGroup.add(rod);

    var bosshead = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.14), metalMat);
    bosshead.position.set(-0.65, PIVOT_Y, -0.35);
    standGroup.add(bosshead);

    var crossArm = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.82, 16), metalMat);
    crossArm.rotation.z = Math.PI / 2;
    crossArm.position.set(-0.30, PIVOT_Y, -0.18);
    standGroup.add(crossArm);

    var forwardArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 16), metalMat);
    forwardArm.rotation.x = Math.PI / 2;
    forwardArm.position.set(0, PIVOT_Y, -0.18);
    standGroup.add(forwardArm);
    scene.add(standGroup);

    // 3. Split cork clamp at (0, PIVOT_Y, 0)
    clampGroup = new THREE.Group();
    clampGroup.position.set(0, PIVOT_Y, 0);
    var corkMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });
    var corkL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.12), corkMat);
    corkL.position.set(-0.048, 0.04, 0);
    var corkR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.12), corkMat);
    corkR.position.set(0.048, 0.04, 0);
    clampGroup.add(corkL, corkR);

    var corkTag = SceneKit.labelTexture("Split cork clamp", { size: 34, bg: "rgba(10,15,29,0.85)" });
    var corkSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: corkTag, transparent: true, depthWrite: false }));
    corkSpr.scale.set(0.22 * corkTag.userData.aspect, 0.22, 1);
    corkSpr.position.set(0.58, 0.08, 0.1);
    clampGroup.add(corkSpr);
    scene.add(clampGroup);

    // 4. Vertical metre rule beside the pendulum
    rulerGroup = new THREE.Group();
    rulerGroup.position.set(-1.18, 0.03, 0);
    var rulerTex = makeRulerTexture();
    var rulerMat = new THREE.MeshStandardMaterial({ map: rulerTex, roughness: 0.55 });
    var rulerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.25 * SCALE_M_TO_WORLD, 0.03), rulerMat);
    rulerMesh.position.y = PIVOT_Y - (1.25 * SCALE_M_TO_WORLD) / 2;
    rulerGroup.add(rulerMesh);

    var rTag = SceneKit.labelTexture("Metre rule (L)", { size: 34, bg: "rgba(10,15,29,0.85)" });
    var rSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: rTag, transparent: true, depthWrite: false }));
    rSpr.scale.set(0.22 * rTag.userData.aspect, 0.22, 1);
    rSpr.position.set(-0.35, 1.35, 0.1);
    rulerGroup.add(rSpr);
    scene.add(rulerGroup);

    // 5. Fiducial reference pointer at equilibrium (x = 0)
    fiducialGroup = new THREE.Group();
    fiducialGroup.position.set(0, 0.03, -0.22);
    var fidBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.05, 20), metalMat);
    fidBase.position.y = 0.025;
    fiducialGroup.add(fidBase);
    var fidStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.65, 12), metalMat);
    fidStem.position.y = 0.35;
    fiducialGroup.add(fidStem);
    var fidCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.065, 0.22, 20),
      new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9c7e, emissiveIntensity: 0.4, roughness: 0.3 })
    );
    fidCone.position.set(0, 0.72, 0.12);
    fiducialGroup.add(fidCone);

    var fTag = SceneKit.labelTexture("Fiducial mark (x = 0)", { size: 34, bg: "rgba(13,156,126,0.92)" });
    var fSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: fTag, transparent: true, depthWrite: false }));
    fSpr.scale.set(0.22 * fTag.userData.aspect, 0.22, 1);
    fSpr.position.set(0, 0.25, 0.38);
    fiducialGroup.add(fSpr);
    scene.add(fiducialGroup);

    // 6. Swinging Pendulum Pivot + Thread + Brass Bob
    pivotGroup = new THREE.Group();
    pivotGroup.position.set(0, PIVOT_Y, 0);
    scene.add(pivotGroup);

    var strGeo = new THREE.CylinderGeometry(0.008, 0.008, 1, 10);
    strGeo.translate(0, -0.5, 0);
    stringMesh = new THREE.Mesh(strGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }));
    pivotGroup.add(stringMesh);

    bobGroup = new THREE.Group();
    var brassMat = new THREE.MeshStandardMaterial({ color: 0xffb23f, roughness: 0.18, metalness: 0.88, envMapIntensity: 1.5 });
    bobMesh = new THREE.Mesh(new THREE.SphereGeometry(0.135, 32, 24), brassMat);
    bobGroup.add(bobMesh);
    var hook = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 10, 20), brassMat);
    hook.position.y = 0.135;
    bobGroup.add(hook);

    // Invisible larger tap hitbox on bob
    var hit = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), new THREE.MeshBasicMaterial({ visible: false }));
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    pivotGroup.add(bobGroup);

    // 7. Live Stopwatch HUD Sprite
    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.38, 1.55, 0.1);
    scene.add(hudSprite);

    // 8. Narrator Highlight Glows
    glowRing = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.32, 48),
      new THREE.MeshBasicMaterial({ color: 0xffb23f, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.04;
    scene.add(glowRing);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.75);
    bobGlow.material.opacity = 0;
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap a length to time 20 swings");

    canvas.addEventListener("click", function (e) {
      var hitObj = stage.pick(e, [bobGroup.userData.hit]);
      if (hitObj) test(state.trialIdx);
    });

    api.rect = function (part) {
      if (part === "bob") return stage.rectOf(bobGroup, 14);
      if (part === "clamp") return stage.rectOf(clampGroup, 12);
      if (part === "fiducial") return stage.rectOf(fiducialGroup, 12);
      if (part === "ruler") return stage.rectOf(rulerGroup, 10);
      if (part === "stand") return stage.rectOf(standGroup, 8);
      return stage.rectOf(pivotGroup, 10);
    };

    stage.start();
  }

  function makeRulerTexture() {
    var c = document.createElement("canvas");
    c.width = 128;
    c.height = 512;
    var g = c.getContext("2d");
    g.fillStyle = "#f6d379";
    g.fillRect(0, 0, 128, 512);
    g.fillStyle = "#1b1813";
    g.font = "bold 20px JetBrains Mono, monospace";
    for (var cm = 0; cm <= 120; cm += 10) {
      var y = (cm / 125) * 512;
      g.fillRect(80, y, 48, 3);
      if (cm > 0) g.fillText((cm / 100).toFixed(1) + "m", 8, y + 7);
    }
    for (var m5 = 5; m5 <= 120; m5 += 10) {
      var y5 = (m5 / 125) * 512;
      g.fillRect(98, y5, 30, 2);
    }
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function updateHudSprite(statusLine) {
    if (!hudSprite) return;
    var tr = DATA.trials[state.trialIdx];
    var c = document.createElement("canvas");
    c.width = 460;
    c.height = 240;
    var g = c.getContext("2d");
    g.fillStyle = "rgba(10,15,29,0.9)";
    g.strokeStyle = "rgba(62,230,196,0.65)";
    g.lineWidth = 4;
    g.beginPath();
    if (g.roundRect) g.roundRect(4, 4, 452, 232, 22);
    else g.rect(4, 4, 452, 232);
    g.fill();
    g.stroke();

    g.fillStyle = "#3ee6c4";
    g.font = "600 22px JetBrains Mono, monospace";
    var condTxt = state.cond === "heavy" ? "100 g · 6°" : state.cond === "wide" ? "50 g · 10°" : "50 g · 6°";
    g.fillText("TRIAL " + tr.label + " · L = " + tr.L.toFixed(2) + " m (" + condTxt + ")", 24, 42);

    var T_num = +tr.T;
    var shownSwings = state.running ? Math.min(20, Math.floor(state.simElapsed / T_num)) : (state.timed[state.trialIdx] ? 20 : 0);
    var shownTime = state.running ? state.simElapsed.toFixed(2) : (state.timed[state.trialIdx] ? tr.t : "0.00");

    g.fillStyle = "#f5efe4";
    g.font = "700 44px JetBrains Mono, monospace";
    g.fillText("t = " + shownTime + " s", 24, 102);

    g.fillStyle = "#ffb23f";
    g.font = "600 26px JetBrains Mono, monospace";
    g.fillText("Swings: " + shownSwings + " / 20   T = " + (state.timed[state.trialIdx] && !state.running ? tr.T + " s" : "—"), 24, 152);

    g.fillStyle = "#a5b0c9";
    g.font = "500 21px Manrope, sans-serif";
    g.fillText(statusLine || "", 24, 202);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    if (hudSprite.material.map) hudSprite.material.map.dispose();
    hudSprite.material.map = tex;
    hudSprite.material.needsUpdate = true;
    hudSprite.scale.set(1.55, 1.55 * (240 / 460), 1);
  }

  function applyTrialGeometry() {
    if (!stringMesh || !bobGroup) return;
    var tr = DATA.trials[state.trialIdx];
    var worldLen = tr.L * SCALE_M_TO_WORLD;
    stringMesh.scale.y = worldLen;
    bobGroup.position.y = -worldLen;

    // Bob visual size/colour reflects 50g brass vs 100g lead-brass
    if (state.cond === "heavy") {
      bobMesh.scale.setScalar(1.22);
      bobMesh.material.color.setHex(0x94a3b8);
    } else {
      bobMesh.scale.setScalar(1.0);
      bobMesh.material.color.setHex(0xffb23f);
    }
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Switched to 100 g heavy bob. Time a trial to see if T changes!"
      : cond === "wide"
        ? "Release angle set to 10° (still small). Watch if T changes!"
        : "Standard 50 g brass bob at 6° release angle.";
    toast(msg);
    updateHudSprite(msg.slice(0, 38));
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    var tr = DATA.trials[idx];
    state.running = true;
    state.simElapsed = 0;

    if (!stage) {
      finishTrial(idx);
      return;
    }
    toast("Timing 20 oscillations for Trial " + tr.label + " (L = " + tr.L.toFixed(2) + " m)…");
  }

  function finishTrial(idx) {
    state.running = false;
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    updateHudSprite("Done! T = " + tr.T + " s · T² = " + tr.T2 + " s²");
    toast("Trial " + tr.label + " (L = " + tr.L.toFixed(2) + " m): t = " + tr.t + " s → T = " + tr.T + " s, T² = " + tr.T2 + " s²");
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.running = false;
    state.simElapsed = 0;
    state.trialIdx = 2;
    applyTrialGeometry();
    paintHint();
    updateHudSprite("Reset · Ready to time 20 swings");
    toast("Stopwatch reset. Pick a length L to begin.");
  }

  function paintHint() {
    var n = Object.keys(state.timed).length;
    if (hint) hint.innerHTML = "Timed <b>" + n + " of 5</b> lengths";
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

  var hudTick = 0;
  function frame(dt, t) {
    if (!pivotGroup) return;
    var tr = DATA.trials[state.trialIdx];
    var T_num = +tr.T;
    var omega = (2 * Math.PI) / T_num;
    var maxAngleRad = (state.cond === "wide" ? 10 : 6) * (Math.PI / 180) * 2.2; // slightly amplified visually so 6° vs 10° is clear

    if (state.running) {
      // Fast-forward 20 oscillations in ~2.2 real seconds so the student sees crisp swings without waiting 40s
      var speedUp = (+tr.t) / 2.2;
      state.simElapsed += dt * speedUp;
      var angle = maxAngleRad * Math.cos(omega * state.simElapsed);
      pivotGroup.rotation.z = angle;

      hudTick += dt;
      if (hudTick > 0.09) {
        hudTick = 0;
        updateHudSprite("Timing 20 swings at 15× speed…");
      }
      if (state.simElapsed >= +tr.t) {
        finishTrial(state.trialIdx);
      }
    } else {
      // Gentle continuous harmonic swing at the real physical period T!
      pivotGroup.rotation.z = maxAngleRad * Math.sin(omega * t);
    }

    // Narrator highlight glow
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var worldBob = new THREE.Vector3();
    bobGroup.getWorldPosition(worldBob);
    bobGlow.position.copy(worldBob);

    var showBobGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showBobGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);

    if (highlightPart === "fiducial") {
      glowRing.position.set(0, 0.05, -0.1);
      glowRing.material.opacity = pulse;
    } else if (highlightPart === "ruler") {
      glowRing.position.set(-1.18, 0.05, 0);
      glowRing.material.opacity = pulse;
    } else {
      glowRing.material.opacity *= 0.85;
    }
  }
})();
