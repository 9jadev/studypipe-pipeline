/* Lesson 01 · 3D Snell's Law Laser & Multi-Media Refraction Bench */
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
    cond: "std", // "std" = Crown Glass (n=1.50), "heavy" = Diamond (n=2.42), "wide" = 90° Reflected ⊥ Refracted (i=56.3°)
    trialIdx: 2,
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

  var clampGroup, rulerGroup, fiducialGroup, bobGroup, rayGroup, glassSlab, hudSprite, bobGlow;
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
      emissiveIntensity: 0.65,
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

    // 1. Optical bench table
    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.22, 3.6),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.72 })
    );
    bench.position.y = -0.11;
    scene.add(bench);

    // 2. Protractor Disc on Bench (rulerGroup for narrator spotlight)
    rulerGroup = new THREE.Group();
    var disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.75, 1.75, 0.03, 48),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 })
    );
    disc.position.y = 0.015;
    rulerGroup.add(disc);

    var ring = new THREE.Mesh(
      new THREE.RingGeometry(1.58, 1.72, 48),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.032;
    rulerGroup.add(ring);

    var pTag = SceneKit.labelTexture("360° Protractor & Normal NN′", { size: 30, bg: "rgba(10,15,29,0.88)" });
    var pSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: pTag, transparent: true, depthWrite: false }));
    pSpr.scale.set(0.21 * pTag.userData.aspect, 0.21, 1);
    pSpr.position.set(-1.35, 0.52, -0.85);
    rulerGroup.add(pSpr);
    scene.add(rulerGroup);

    // 3. Glass Block Medium (bobGroup for narrator spotlight)
    bobGroup = new THREE.Group();
    glassSlab = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.44, 1.35),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.38,
        roughness: 0.12,
        metalness: 0.08
      })
    );
    glassSlab.position.set(0, 0.25, 0.675);
    bobGroup.add(glassSlab);

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 0.44, 1.35)),
      new THREE.LineBasicMaterial({ color: 0x0284c7 })
    );
    glassSlab.add(edges);

    var gTag = SceneKit.labelTexture("Glass Block (n = 1.50)", { size: 32, bg: "rgba(59,108,246,0.92)" });
    var gSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTag, transparent: true, depthWrite: false }));
    gSpr.scale.set(0.21 * gTag.userData.aspect, 0.21, 1);
    gSpr.position.set(0, 0.68, 0.68);
    bobGroup.add(gSpr);

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.6, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(0, 0.25, 0.65);
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    // 4. Laser Emitter Housing (clampGroup for narrator spotlight)
    clampGroup = new THREE.Group();
    var laserHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.24, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.6 })
    );
    laserHousing.position.y = 0.22;
    clampGroup.add(laserHousing);
    var lTag = SceneKit.labelTexture("Ray Box Laser (λ = 600 nm)", { size: 30, bg: "rgba(13,156,126,0.92)" });
    var lSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTag, transparent: true, depthWrite: false }));
    lSpr.scale.set(0.20 * lTag.userData.aspect, 0.20, 1);
    lSpr.position.set(0, 0.56, 0);
    clampGroup.add(lSpr);
    scene.add(clampGroup);

    // 5. Refracted & Reflected Rays Group (fiducialGroup for narrator spotlight)
    fiducialGroup = new THREE.Group();
    rayGroup = new THREE.Group();
    fiducialGroup.add(rayGroup);
    scene.add(fiducialGroup);

    // Photon wave-packet beads
    var beadMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.9 });
    for (var i = 0; i < 6; i++) {
      var b = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), beadMat);
      scene.add(b);
      photonBeads.push({ mesh: b, u: i / 6 });
    }

    // 6. Live Digital Readout HUD Sprite
    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.28, 1.32, -0.45);
    scene.add(hudSprite);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.85);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(0, 0.25, 0.35);
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap an angle trial A–E");

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

  function currentOptics() {
    var tr = DATA.trials[state.trialIdx];
    var iDeg = state.cond === "wide" ? 56.3 : tr.L;
    var n = state.cond === "heavy" ? 2.42 : 1.50;
    var iRad = iDeg * Math.PI / 180;
    var sinR = Math.sin(iRad) / n;
    var rRad = Math.asin(Math.min(0.999, sinR));
    var rDeg = rRad * 180 / Math.PI;
    return {
      iDeg: iDeg,
      rDeg: rDeg,
      n: n,
      iRad: iRad,
      rRad: rRad,
      sinI: Math.sin(iRad).toFixed(3),
      sinR: sinR.toFixed(3),
      sepDeg: (180 - (iDeg + rDeg)).toFixed(1)
    };
  }

  function updateHudSprite(statusLine) {
    if (!hudSprite) return;
    var op = currentOptics();
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
    var condTxt = state.cond === "heavy" ? "Diamond n=2.42" : state.cond === "wide" ? "90° Refl⊥Refr (n=tan i)" : "Crown Glass n=1.50";
    g.fillText(condTxt + " · g = " + (90 - op.iDeg).toFixed(1) + "°", 22, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 38px JetBrains Mono, monospace";
    g.fillText("i = " + op.iDeg.toFixed(1) + "° → r = " + op.rDeg.toFixed(1) + "°", 22, 100);

    g.fillStyle = "#ffb23f";
    g.font = "600 24px JetBrains Mono, monospace";
    g.fillText("sin i=" + op.sinI + " · sin r=" + op.sinR + " · n=" + op.n.toFixed(2), 22, 150);

    g.fillStyle = "#a5b0c9";
    g.font = "500 20px Manrope, sans-serif";
    g.fillText(statusLine || ("Refl–Refr Angle = " + op.sepDeg + "°"), 22, 200);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    if (hudSprite.material.map) hudSprite.material.map.dispose();
    hudSprite.material.map = tex;
    hudSprite.material.needsUpdate = true;
    hudSprite.scale.set(1.55, 1.55 * (240 / 460), 1);
  }

  function applyTrialGeometry() {
    if (!rayGroup) return;
    while (rayGroup.children.length) rayGroup.remove(rayGroup.children[0]);
    var op = currentOptics();
    glassSlab.material.color.setHex(state.cond === "heavy" ? 0xa5b4fc : 0x38bdf8);

    var yRay = 0.24;
    var pO = new THREE.Vector3(0, yRay, 0);
    var incLen = 1.55;
    var pInc = new THREE.Vector3(-incLen * Math.sin(op.iRad), yRay, -incLen * Math.cos(op.iRad));
    var pRefl = new THREE.Vector3(incLen * Math.sin(op.iRad), yRay, -incLen * Math.cos(op.iRad));
    var refrLen = 1.35 / Math.cos(op.rRad);
    var pRefr = new THREE.Vector3(refrLen * Math.sin(op.rRad), yRay, refrLen * Math.cos(op.rRad));

    // Normal line NN'
    rayGroup.add(makeBeam(new THREE.Vector3(0, yRay, -1.5), new THREE.Vector3(0, yRay, 1.5), 0.012, 0x94a3b8, 0.75));
    // Incident ray (amber)
    rayGroup.add(makeBeam(pInc, pO, 0.032, 0xf59e0b, 1.0));
    // Partially reflected ray (violet)
    rayGroup.add(makeBeam(pO, pRefl, 0.020, 0xa855f7, 0.72));
    // Refracted ray inside glass (cyan/green)
    rayGroup.add(makeBeam(pO, pRefr, 0.032, 0x10b981, 1.0));

    clampGroup.position.copy(pInc);
    clampGroup.position.y = 0;
    clampGroup.rotation.y = Math.atan2(-pInc.x, -pInc.z);

    rayGroup.userData.pInc = pInc;
    rayGroup.userData.pO = pO;
    rayGroup.userData.pRefr = pRefr;
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Switched to Diamond (n = 2.42): v drops to 1.24 × 10⁸ m s⁻¹ and ray bends sharply to the normal!"
      : cond === "wide"
        ? "90° Perpendicular Mode (i = 56.3°, r = 33.7°): Reflected ⊥ Refracted so n = tan i = 1.50!"
        : "Standard Crown Glass (n = 1.50): v = 2.0 × 10⁸ m s⁻¹.";
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
    updateHudSprite("Recorded Trial " + tr.label + ": sin i/sin r = " + tr.T2);
    toast("Trial " + tr.label + " (i = " + tr.L + "°): sin i = " + tr.t + ", sin r = " + tr.T + " → n = " + tr.T2);
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
    updateHudSprite("Reset · Ready to record Snell's law trials");
    toast("Optical bench reset. Tap Trials A–E to record sin i and sin r.");
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
    var pRefr = rayGroup.userData.pRefr;
    for (var i = 0; i < photonBeads.length; i++) {
      photonBeads[i].u = (photonBeads[i].u + dt * 0.42) % 1;
      var u = photonBeads[i].u;
      if (u < 0.5) {
        photonBeads[i].mesh.position.copy(pInc).lerp(pO, u * 2);
      } else {
        photonBeads[i].mesh.position.copy(pO).lerp(pRefr, (u - 0.5) * 2);
      }
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
