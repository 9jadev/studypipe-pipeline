/* Lesson 04 · 3D Critical Angle, Total Internal Reflection & Optical Fibre Bench */
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
    cond: "std", // "std" = Crown Glass -> Air (c=41.8°), "heavy" = Diamond -> Air (c=24.4°), "wide" = Optical Fibre Core/Cladding Guide
    trialIdx: 2, // 41.8° critical angle default
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
    target: new THREE.Vector3(0, 0.45, 0),
    pitch: 0.42,
    yaw: 0.08,
    fitWidth: 4.8,
    distance: 4.9,
    minYaw: -0.8,
    maxYaw: 0.8,
    onFrame: frame
  });

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, rayGroup, glassSlab, fibreGroup, hudSprite, bobGlow;
  var photonBeads = [];

  if (stage) build();
  wireButtons();
  paintHint();

  function makeBeam(p1, p2, radius, colorHex, opacity) {
    var dir = new THREE.Vector3().subVectors(p2, p1);
    var len = dir.length();
    if (len < 0.001) return new THREE.Group();
    var geom = new THREE.CylinderGeometry(radius, radius, len, 14);
    var mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.68,
      transparent: opacity < 1,
      opacity: opacity || 1,
      roughness: 0.2
    });
    var mesh = new THREE.Mesh(geom, mat);
    var mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function build() {
    var scene = stage.rig;

    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    // Protractor Disc (rulerGroup)
    rulerGroup = new THREE.Group();
    var disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.75, 1.75, 0.03, 48),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 })
    );
    disc.position.y = 0.015;
    rulerGroup.add(disc);
    scene.add(rulerGroup);

    // Denser Glass Block on NEAR half (z < 0) so light goes from Glass (z < 0) to Air (z > 0)
    bobGroup = new THREE.Group();
    glassSlab = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.44, 1.35),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.38, roughness: 0.12 })
    );
    glassSlab.position.set(0, 0.25, -0.675);
    bobGroup.add(glassSlab);

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 0.44, 1.35)),
      new THREE.LineBasicMaterial({ color: 0x0284c7 })
    );
    glassSlab.add(edges);

    var gTag = SceneKit.labelTexture("Denser Medium: Glass (n₁ = 1.50, c = 41.8°)", { size: 28, bg: "rgba(59,108,246,0.92)" });
    var gSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTag, transparent: true, depthWrite: false }));
    gSpr.scale.set(0.21 * gTag.userData.aspect, 0.21, 1);
    gSpr.position.set(0, 0.68, -0.68);
    bobGroup.add(gSpr);

    // Optical Fibre Core + Cladding Waveguide (shown in "wide" mode)
    fibreGroup = new THREE.Group();
    fibreGroup.position.set(0, 0.35, 0);
    var cladCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 2.8, 28, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x64748b, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false })
    );
    cladCyl.rotation.z = Math.PI / 2;
    var coreCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.20, 2.8, 28, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false })
    );
    coreCyl.rotation.z = Math.PI / 2;
    fibreGroup.add(cladCyl, coreCyl);
    // Multi-bounce TIR zigzag inside core
    var pts = [
      new THREE.Vector3(-1.35, -0.10, 0),
      new THREE.Vector3(-0.70, 0.18, 0),
      new THREE.Vector3(0.0, -0.18, 0),
      new THREE.Vector3(0.70, 0.18, 0),
      new THREE.Vector3(1.35, -0.10, 0)
    ];
    for (var k = 0; k < pts.length - 1; k++) {
      fibreGroup.add(makeBeam(pts[k], pts[k + 1], 0.028, 0x10b981, 1.0));
    }
    fibreGroup.visible = false;
    bobGroup.add(fibreGroup);

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.6, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(0, 0.25, -0.5);
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    clampGroup = new THREE.Group();
    var laserHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.24, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.6 })
    );
    laserHousing.position.y = 0.22;
    clampGroup.add(laserHousing);
    scene.add(clampGroup);

    fiducialGroup = new THREE.Group();
    rayGroup = new THREE.Group();
    fiducialGroup.add(rayGroup);
    scene.add(fiducialGroup);

    var beadMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.9 });
    for (var i = 0; i < 6; i++) {
      var b = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), beadMat);
      scene.add(b);
      photonBeads.push({ mesh: b, u: i / 6 });
    }

    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.25, 1.32, -0.45);
    scene.add(hudSprite);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.85);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(0, 0.25, 0);
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap Trials A–E (20° to 60°)");

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
    if (!rayGroup) return;
    while (rayGroup.children.length) rayGroup.remove(rayGroup.children[0]);

    var isFibre = state.cond === "wide";
    fibreGroup.visible = isFibre;
    glassSlab.visible = !isFibre;
    clampGroup.visible = !isFibre;

    var tr = DATA.trials[state.trialIdx];
    var iDeg = tr.L;
    var n = state.cond === "heavy" ? 2.42 : 1.50;
    var cDeg = Math.asin(1 / n) * 180 / Math.PI;
    var iRad = iDeg * Math.PI / 180;

    var yRay = 0.24;
    var pO = new THREE.Vector3(0, yRay, 0);
    var pInc = new THREE.Vector3(-1.45 * Math.sin(iRad), yRay, -1.45 * Math.cos(iRad));
    var pTIR = new THREE.Vector3(1.45 * Math.sin(iRad), yRay, -1.45 * Math.cos(iRad));

    if (!isFibre) {
      rayGroup.add(makeBeam(new THREE.Vector3(0, yRay, -1.5), new THREE.Vector3(0, yRay, 1.5), 0.012, 0x94a3b8, 0.75));
      rayGroup.add(makeBeam(pInc, pO, 0.032, 0xf59e0b, 1.0));

      var pOut;
      if (Math.abs(iDeg - cDeg) < 0.35) {
        // Grazing critical angle (r = 90° along surface!)
        pOut = new THREE.Vector3(1.55, yRay, 0);
        rayGroup.add(makeBeam(pO, pOut, 0.032, 0xfbbf24, 1.0));
        rayGroup.add(makeBeam(pO, pTIR, 0.022, 0x10b981, 0.65));
      } else if (iDeg > cDeg) {
        // 100% Total Internal Reflection!
        pOut = pTIR;
        rayGroup.add(makeBeam(pO, pTIR, 0.036, 0x10b981, 1.0));
      } else {
        // Refraction out into air (away from normal)
        var rRad = Math.asin(Math.min(0.999, n * Math.sin(iRad)));
        pOut = new THREE.Vector3(1.55 * Math.sin(rRad), yRay, 1.55 * Math.cos(rRad));
        rayGroup.add(makeBeam(pO, pOut, 0.032, 0x38bdf8, 1.0));
        rayGroup.add(makeBeam(pO, pTIR, 0.016, 0xa855f7, 0.45));
      }

      clampGroup.position.copy(pInc);
      clampGroup.position.y = 0;
      clampGroup.rotation.y = Math.atan2(-pInc.x, -pInc.z);

      rayGroup.userData.pInc = pInc;
      rayGroup.userData.pO = pO;
      rayGroup.userData.pOut = pOut;
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
    var mTxt = state.cond === "heavy" ? "Diamond (c = 24.4°)" : state.cond === "wide" ? "Fibre Core > Cladding" : "Crown Glass (c = 41.8°)";
    g.fillText("TRIAL " + tr.label + " · " + mTxt, 22, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 34px JetBrains Mono, monospace";
    g.fillText("i = " + tr.L.toFixed(1) + "° → r = " + tr.t, 22, 98);

    g.fillStyle = "#ffb23f";
    g.font = "600 24px JetBrains Mono, monospace";
    g.fillText("Regime: " + tr.T, 22, 148);

    g.fillStyle = "#a5b0c9";
    g.font = "500 20px Manrope, sans-serif";
    g.fillText(statusLine || "sin c = 1/n · v = c₀ sin c", 22, 198);

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
      ? "Diamond (n = 2.42, c = 24.4°): Even at i = 30°, the ray exceeds 24.4° and undergoes Total Internal Reflection!"
      : cond === "wide"
        ? "Yaba Step-Index Optical Fibre (n_core > n_cladding): Laser bounces along the core by repeated TIR!"
        : "Crown Glass to Air (n = 1.50, c = 41.8°).";
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
    updateHudSprite("Recorded Trial " + tr.label + ": " + tr.T);
    toast("Trial " + tr.label + " (i = " + tr.L.toFixed(1) + "°): r = " + tr.t + " → " + tr.T);
    paintHint();

    var n = Object.keys(state.timed).length;
    document.dispatchEvent(new CustomEvent("l1:bench", { detail: { trial: idx, count: n, cond: state.cond } }));
    if (n >= 4) {
      document.dispatchEvent(new CustomEvent("l1:bench-done", { detail: { count: n } }));
    }
  }

  function reset() {
    state.timed = {};
    state.trialIdx = 2;
    state.cond = "std";
    applyTrialGeometry();
    paintHint();
    updateHudSprite("Reset · Ready to sweep internal angle i");
    toast("Bench reset. Tap Trials A–E to sweep i across c = 41.8°.");
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
    if (!rayGroup || !rayGroup.userData.pInc) return;
    var pInc = rayGroup.userData.pInc;
    var pO = rayGroup.userData.pO;
    var pOut = rayGroup.userData.pOut;
    for (var i = 0; i < photonBeads.length; i++) {
      photonBeads[i].u = (photonBeads[i].u + dt * 0.42) % 1;
      var u = photonBeads[i].u;
      if (u < 0.5) {
        photonBeads[i].mesh.position.copy(pInc).lerp(pO, u * 2);
      } else if (pOut) {
        photonBeads[i].mesh.position.copy(pO).lerp(pOut, (u - 0.5) * 2);
      }
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
