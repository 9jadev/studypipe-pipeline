/* Lesson 02 · 3D Rectangular Glass Block Lateral Shift d & Far-Face Shift EF Bench */
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
    cond: "std", // "std" = t=6.0 cm, n=1.50; "heavy" = Thick Block t=9.0 cm; "wide" = Dense Flint n=1.65
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
    target: new THREE.Vector3(0, 0.42, 0),
    pitch: 0.46,
    yaw: 0.06,
    fitWidth: 5.0,
    distance: 5.1,
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
      emissiveIntensity: 0.6,
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

    // 1. Drawing board & white sheet
    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.20, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 0.75 })
    );
    bench.position.y = -0.10;
    scene.add(bench);

    var sheet = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 0.02, 3.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55 })
    );
    sheet.position.y = 0.01;
    scene.add(sheet);

    // 2. Rectangular Glass Block ABCD (bobGroup for narrator spotlight)
    bobGroup = new THREE.Group();
    glassSlab = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.45, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.36,
        roughness: 0.12,
        metalness: 0.08
      })
    );
    glassSlab.position.set(0, 0.24, 0);
    bobGroup.add(glassSlab);

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.8, 0.45, 1.5)),
      new THREE.LineBasicMaterial({ color: 0x0284c7 })
    );
    glassSlab.add(edges);

    var gTag = SceneKit.labelTexture("Rectangular Block (t = 6.0 cm, n = 1.50)", { size: 30, bg: "rgba(59,108,246,0.92)" });
    var gSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTag, transparent: true, depthWrite: false }));
    gSpr.scale.set(0.21 * gTag.userData.aspect, 0.21, 1);
    gSpr.position.set(0, 0.66, 0);
    bobGroup.add(gSpr);

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.6, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(0, 0.24, 0);
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    // 3. Laser Source (clampGroup)
    clampGroup = new THREE.Group();
    var laserBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.24, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.6 })
    );
    laserBox.position.y = 0.22;
    clampGroup.add(laserBox);
    var lTag = SceneKit.labelTexture("Incident Ray (Angle i)", { size: 28, bg: "rgba(217,119,6,0.92)" });
    var lSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTag, transparent: true, depthWrite: false }));
    lSpr.scale.set(0.19 * lTag.userData.aspect, 0.19, 1);
    lSpr.position.set(0, 0.54, 0);
    clampGroup.add(lSpr);
    scene.add(clampGroup);

    // 4. Lateral Shift & Far-Face Scale Group (rulerGroup & fiducialGroup)
    rulerGroup = new THREE.Group();
    rulerGroup.position.set(0.4, 0.25, 0.75);
    scene.add(rulerGroup);

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
    hudSprite.position.set(1.25, 1.30, -0.55);
    scene.add(hudSprite);

    bobGlow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 0.85);
    bobGlow.material.opacity = 0;
    bobGlow.position.set(0, 0.25, 0);
    scene.add(bobGlow);

    applyTrialGeometry();
    updateHudSprite("Ready · Tap Trials A–E (15° to 75°)");

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
    var iDeg = tr.L;
    var tCm = state.cond === "heavy" ? 9.0 : 6.0;
    var n = state.cond === "wide" ? 1.65 : 1.50;
    var iRad = iDeg * Math.PI / 180;
    var sinR = Math.sin(iRad) / n;
    var rRad = Math.asin(Math.min(0.999, sinR));
    var rDeg = rRad * 180 / Math.PI;
    var dCm = tCm * Math.sin(iRad - rRad) / Math.cos(rRad);
    var efCm = tCm * Math.tan(rRad);
    return {
      iDeg: iDeg,
      rDeg: rDeg,
      eDeg: iDeg,
      tCm: tCm,
      n: n,
      dCm: dCm,
      efCm: efCm,
      iRad: iRad,
      rRad: rRad
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
    g.fillText("t = " + op.tCm.toFixed(1) + " cm · n = " + op.n.toFixed(2) + " · e = i = " + op.eDeg + "°", 22, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 36px JetBrains Mono, monospace";
    g.fillText("Shift d = " + op.dCm.toFixed(2) + " cm", 22, 98);

    g.fillStyle = "#ffb23f";
    g.font = "600 24px JetBrains Mono, monospace";
    g.fillText("r = " + op.rDeg.toFixed(1) + "° · Far-Face EF = " + op.efCm.toFixed(2) + " cm", 22, 148);

    g.fillStyle = "#a5b0c9";
    g.font = "500 20px Manrope, sans-serif";
    g.fillText(statusLine || "Net angular deviation D = 0°", 22, 198);

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

    var zScale = state.cond === "heavy" ? 1.32 : 1.0;
    glassSlab.scale.set(1, 1, zScale);
    glassSlab.material.color.setHex(state.cond === "wide" ? 0xa5b4fc : 0x38bdf8);

    var halfW = 0.75 * zScale;
    var yRay = 0.24;
    var xO = -0.52;
    var pO = new THREE.Vector3(xO, yRay, -halfW);
    var incLen = 1.45;
    var pInc = new THREE.Vector3(xO - incLen * Math.sin(op.iRad), yRay, -halfW - incLen * Math.cos(op.iRad));

    var xN = xO + (2 * halfW) * Math.tan(op.rRad);
    var pN = new THREE.Vector3(xN, yRay, halfW);
    var pEm = new THREE.Vector3(xN + incLen * Math.sin(op.iRad), yRay, halfW + incLen * Math.cos(op.iRad));

    // Ghost undeviated ray
    var extLen = 2.75;
    var pGhost = new THREE.Vector3(xO + extLen * Math.sin(op.iRad), yRay, -halfW + extLen * Math.cos(op.iRad));

    // Normals at O and N
    rayGroup.add(makeBeam(new THREE.Vector3(xO, yRay, -halfW - 0.5), new THREE.Vector3(xO, yRay, -halfW + 0.5), 0.011, 0x94a3b8, 0.75));
    rayGroup.add(makeBeam(new THREE.Vector3(xN, yRay, halfW - 0.5), new THREE.Vector3(xN, yRay, halfW + 0.5), 0.011, 0x94a3b8, 0.75));

    // Rays
    rayGroup.add(makeBeam(pInc, pO, 0.032, 0xf59e0b, 1.0));
    rayGroup.add(makeBeam(pO, pN, 0.032, 0x38bdf8, 1.0));
    rayGroup.add(makeBeam(pN, pEm, 0.032, 0x10b981, 1.0));
    rayGroup.add(makeBeam(pO, pGhost, 0.014, 0xfbbf24, 0.36));

    // Perpendicular lateral shift segment d (pink/red)
    var u = new THREE.Vector3(Math.sin(op.iRad), 0, Math.cos(op.iRad));
    var vON = new THREE.Vector3().subVectors(pN, pO);
    var pFoot = new THREE.Vector3().copy(pO).addScaledVector(u, vON.dot(u));
    rayGroup.add(makeBeam(pN, pFoot, 0.025, 0xf43f5e, 0.95));

    // Far-face shift EF along bottom face (violet)
    rayGroup.add(makeBeam(new THREE.Vector3(xO, yRay + 0.02, halfW), new THREE.Vector3(xN, yRay + 0.02, halfW), 0.022, 0xa855f7, 0.9));

    clampGroup.position.copy(pInc);
    clampGroup.position.y = 0;
    clampGroup.rotation.y = Math.atan2(pO.x - pInc.x, pO.z - pInc.z);
    rulerGroup.position.copy(pN);

    rayGroup.userData.pInc = pInc;
    rayGroup.userData.pO = pO;
    rayGroup.userData.pN = pN;
    rayGroup.userData.pEm = pEm;
  }

  function setCond(cond) {
    if (!cond) return;
    state.cond = cond;
    root.querySelectorAll("#bench-cond [data-cond]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cond") === cond ? "true" : "false");
    });
    applyTrialGeometry();
    var msg = cond === "heavy"
      ? "Thick Block (t = 9.0 cm): Increasing thickness by 1.5× increases lateral displacement d by 1.5×!"
      : cond === "wide"
        ? "Dense Flint Glass (n = 1.65): Smaller r increases (i − r) and boosts lateral shift d!"
        : "Standard Crown Glass Block (t = 6.0 cm, n = 1.50).";
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
    updateHudSprite("Recorded Trial " + tr.label + ": d = " + tr.T + " cm, EF = " + tr.T2 + " cm");
    toast("Trial " + tr.label + " (i = " + tr.L + "°): r = " + tr.t + ", Lateral Shift d = " + tr.T + " cm, EF = " + tr.T2 + " cm");
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
    updateHudSprite("Reset · Ready to record Lateral Shift trials");
    toast("Bench reset. Tap Trials A–E to record r, d, and EF.");
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
    var pN = rayGroup.userData.pN;
    var pEm = rayGroup.userData.pEm;
    for (var i = 0; i < photonBeads.length; i++) {
      photonBeads[i].u = (photonBeads[i].u + dt * 0.36) % 1;
      var u = photonBeads[i].u;
      if (u < 0.33) {
        photonBeads[i].mesh.position.copy(pInc).lerp(pO, u / 0.33);
      } else if (u < 0.67) {
        photonBeads[i].mesh.position.copy(pO).lerp(pN, (u - 0.33) / 0.34);
      } else {
        photonBeads[i].mesh.position.copy(pN).lerp(pEm, (u - 0.67) / 0.33);
      }
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
