/* Lesson 03 · 3D No-Parallax Search-Pin & Layered Apparent Depth Bench */
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
    cond: "std", // "std" = Crown Glass n=1.50 (No-Parallax locked), "heavy" = 2-Layer (Glass + Water), "wide" = Parallax Misaligned (Search pin too high)
    trialIdx: 1, // R = 6.0 cm default
    timed: {}
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
    target: new THREE.Vector3(0, 0.65, 0),
    pitch: 0.32,
    yaw: 0.12,
    fitWidth: 4.8,
    distance: 4.9,
    minYaw: -0.8,
    maxYaw: 0.8,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, glassMesh, waterLayerMesh, realObjMesh, virtImgMesh, searchPinGroup, hudSprite, bobGlow;

  if (stage) build();
  wireButtons();
  paintHint();

  function build() {
    var scene = stage.rig;

    // 1. Bench base
    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.6),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    var metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 });
    var brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 });

    // 2. Retort Stand & Vertical Millimetre Scale (clampGroup & rulerGroup)
    clampGroup = new THREE.Group();
    clampGroup.position.set(-1.05, 0, 0);
    var basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 0.55), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }));
    basePlate.position.y = 0.04;
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.75, 16), metalMat);
    rod.position.y = 0.88;
    clampGroup.add(basePlate, rod);

    searchPinGroup = new THREE.Group();
    var boss = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), brassMat);
    var sPin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.65, 12), new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.5 }));
    sPin.rotation.z = Math.PI / 2;
    sPin.position.x = 0.36;
    searchPinGroup.add(boss, sPin);
    searchPinGroup.position.y = 0.35;
    clampGroup.add(searchPinGroup);

    var sTag = SceneKit.labelTexture("Retort Stand & Search Pin P₂", { size: 28, bg: "rgba(200,38,74,0.92)" });
    var sSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: sTag, transparent: true, depthWrite: false }));
    sSpr.scale.set(0.20 * sTag.userData.aspect, 0.20, 1);
    sSpr.position.set(-0.15, 1.85, 0);
    clampGroup.add(sSpr);
    scene.add(clampGroup);

    rulerGroup = new THREE.Group();
    rulerGroup.position.set(-0.55, 0, -0.35);
    var rulerBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.5, 0.03), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 }));
    rulerBar.position.y = 0.75;
    rulerGroup.add(rulerBar);
    scene.add(rulerGroup);

    // 3. Glass Block standing over Object Pin P₁ (bobGroup & fiducialGroup)
    bobGroup = new THREE.Group();
    bobGroup.position.set(0.10, 0, 0);

    // Real Object Pin O at bottom (y = 0.03)
    realObjMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.75, 14),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6 })
    );
    realObjMesh.rotation.x = Math.PI / 2;
    realObjMesh.position.set(0, 0.03, 0);
    bobGroup.add(realObjMesh);

    // Virtual Image I at height d_v = R - A
    virtImgMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.75, 14),
      new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9c7e, emissiveIntensity: 0.85 })
    );
    virtImgMesh.rotation.x = Math.PI / 2;
    virtImgMesh.position.set(0, 0.32, 0);
    bobGroup.add(virtImgMesh);

    glassMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.0, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.34, roughness: 0.12, depthWrite: false })
    );
    glassMesh.position.set(0, 0.5, 0);
    bobGroup.add(glassMesh);

    waterLayerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.45, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, transparent: true, opacity: 0.30, roughness: 0.14, depthWrite: false })
    );
    waterLayerMesh.visible = false;
    bobGroup.add(waterLayerMesh);

    var bTag = SceneKit.labelTexture("Glass Block (R) · Virtual Image I at Depth A", { size: 28, bg: "rgba(59,108,246,0.92)" });
    var bSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: bTag, transparent: true, depthWrite: false }));
    bSpr.scale.set(0.20 * bTag.userData.aspect, 0.20, 1);
    bSpr.position.set(0.05, 1.62, 0);
    bobGroup.add(bSpr);

    var hit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 1.0), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 0.65;
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    fiducialGroup = virtImgMesh;

    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.38, 1.25, -0.25);
    scene.add(hudSprite);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.85);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(0.10, 0.45, 0);
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap Trials A–E (R = 3 to 15 cm)");

    canvas.addEventListener("click", function (e) {
      var hitObj = stage.pick(e, [bobGroup.userData.hit]);
      if (hitObj) test(state.trialIdx);
    });

    api.rect = function (part) {
      if (part === "bob") return stage.rectOf(bobGroup, 14);
      if (part === "clamp") return stage.rectOf(clampGroup, 12);
      if (part === "fiducial") return stage.rectOf(virtImgMesh, 12);
      if (part === "ruler") return stage.rectOf(rulerGroup, 10);
      return stage.rectOf(bobGroup, 12);
    };

    stage.start();
  }

  function applyTrialGeometry() {
    if (!glassMesh) return;
    var tr = DATA.trials[state.trialIdx];
    var R = tr.L; // 3, 6, 9, 12, 15 cm
    var hScale = 0.35 + (R / 15.0) * 0.95;
    glassMesh.scale.y = hScale;
    glassMesh.position.y = hScale * 0.5;

    // Virtual image height from bottom = d_v = R/3 -> 1/3 of block height
    var virtY = hScale * (1 / 3);
    virtImgMesh.position.y = virtY;

    if (state.cond === "heavy") {
      waterLayerMesh.visible = true;
      waterLayerMesh.position.y = hScale + 0.225;
      searchPinGroup.position.y = virtY + 0.11;
    } else if (state.cond === "wide") {
      waterLayerMesh.visible = false;
      searchPinGroup.position.y = virtY + 0.22; // Deliberately misaligned!
    } else {
      waterLayerMesh.visible = false;
      searchPinGroup.position.y = virtY; // Exact no-parallax lock!
    }
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

    g.fillStyle = "#3ee6c4";
    g.font = "600 21px JetBrains Mono, monospace";
    var modeTxt = state.cond === "heavy" ? "2-Layer (Glass+Water)" : state.cond === "wide" ? "Parallax Error (Too High!)" : "No-Parallax Locked!";
    g.fillText("TRIAL " + tr.label + " · " + modeTxt, 22, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 36px JetBrains Mono, monospace";
    g.fillText("R = " + tr.L.toFixed(1) + " cm → A = " + tr.t + " cm", 22, 98);

    g.fillStyle = "#ffb23f";
    g.font = "600 24px JetBrains Mono, monospace";
    g.fillText("Raised d_v = " + tr.T + " cm · n = R/A = " + tr.T2, 22, 148);

    g.fillStyle = "#a5b0c9";
    g.font = "500 20px Manrope, sans-serif";
    g.fillText(statusLine || "A = R/n · d_v = R(1 − 1/n)", 22, 198);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    if (hudSprite.material.map) hudSprite.material.map.dispose();
    hudSprite.material.map = tex;
    hudSprite.material.needsUpdate = true;
    hudSprite.scale.set(1.55, 1.55 * (240 / 460), 1);
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "2-Layer Slab (Glass + 4 cm Water): Total apparent depth is A_total = t₁/n₁ + t₂/n₂!"
      : cond === "wide"
        ? "Search pin too high! Notice how the search pin and virtual image separate when the camera sways (Parallax)!"
        : "No-Parallax Locked! Search pin P₂ is at exact height d_v = R − A so image and pin move together.";
    toast(msg);
    updateHudSprite(msg.slice(0, 40));
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    state.cond = "std";
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === "std" ? "true" : "false");
    });
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    updateHudSprite("Recorded Trial " + tr.label + ": A = " + tr.t + " cm, d_v = " + tr.T + " cm");
    toast("Trial " + tr.label + " (R = " + tr.L.toFixed(1) + " cm): Apparent Depth A = " + tr.t + " cm, Raised d_v = " + tr.T + " cm → n = " + tr.T2);
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 1;
    state.cond = "std";
    applyTrialGeometry();
    paintHint();
    updateHudSprite("Reset · Ready to record No-Parallax trials");
    toast("Bench reset. Tap Trials A–E to record Apparent Depth A and Upward Shift d_v.");
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
    // Gentle parallax sway when in "wide" (misaligned) mode to demonstrate parallax visibly!
    if (state.cond === "wide" && searchPinGroup) {
      searchPinGroup.position.z = Math.sin(t * 3.5) * 0.14;
    } else if (searchPinGroup) {
      searchPinGroup.position.z = 0;
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
