/* Lesson 05 · 3D WAEC Paper 3 Four-Pin Ray-Tracing & Internal Triangle LN₀E Bench */
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
    cond: "std", // "std" = Pin Bases Aligned (≥ 4 cm), "heavy" = Triangle LN₀E Highlight, "wide" = Tilted Pin-Top Error
    trialIdx: 1, // 30° default
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
    target: new THREE.Vector3(0, 0.35, 0),
    pitch: 0.48,
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

  function makeOpticalPin(headHex, tiltZ) {
    var g = new THREE.Group();
    g.rotation.z = tiltZ || 0;
    var shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.010, 0.44, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.25 })
    );
    shaft.position.y = 0.22;
    g.add(shaft);
    var head = new THREE.Mesh(
      new THREE.SphereGeometry(0.046, 14, 12),
      new THREE.MeshStandardMaterial({ color: headHex, roughness: 0.3 })
    );
    head.position.y = 0.44;
    g.add(head);
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(0.032, 0.056, 20),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.85, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    g.add(ring);
    return g;
  }

  function build() {
    var scene = stage.rig;

    // Softwood Drawing Board + White A4 Paper Sheet
    var board = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.16, 3.4),
      new THREE.MeshStandardMaterial({ color: 0xb4834e, roughness: 0.72 })
    );
    board.position.y = -0.08;
    scene.add(board);

    rulerGroup = new THREE.Group();
    var sheet = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.02, 2.85),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 })
    );
    sheet.position.y = 0.01;
    rulerGroup.add(sheet);
    scene.add(rulerGroup);

    // Rectangular Glass Block (width w = 6.0 cm -> 1.20 units in 3D)
    bobGroup = new THREE.Group();
    glassSlab = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.38, 1.20),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.36, roughness: 0.12 })
    );
    glassSlab.position.set(0, 0.21, 0);
    bobGroup.add(glassSlab);

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 0.38, 1.20)),
      new THREE.LineBasicMaterial({ color: 0x0284c7 })
    );
    glassSlab.add(edges);

    var gTag = SceneKit.labelTexture("Glass Block Outline ABCD (w = LN₀ = 6.0 cm, n = 1.50)", { size: 26, bg: "rgba(59,108,246,0.92)" });
    var gSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTag, transparent: true, depthWrite: false }));
    gSpr.scale.set(0.20 * gTag.userData.aspect, 0.20, 1);
    gSpr.position.set(0, 0.66, 0);
    bobGroup.add(gSpr);

    var hit = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 1.4), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(0, 0.22, 0);
    bobGroup.add(hit);
    bobGroup.userData.hit = hit;
    scene.add(bobGroup);

    clampGroup = new THREE.Group();
    scene.add(clampGroup);

    fiducialGroup = new THREE.Group();
    rayGroup = new THREE.Group();
    fiducialGroup.add(rayGroup);
    scene.add(fiducialGroup);

    var beadMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.9 });
    for (var i = 0; i < 6; i++) {
      var b = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), beadMat);
      scene.add(b);
      photonBeads.push({ mesh: b, u: i / 6 });
    }

    hudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    hudSprite.position.set(1.25, 1.28, -0.45);
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
    if (!rayGroup || !clampGroup) return;
    while (rayGroup.children.length) rayGroup.remove(rayGroup.children[0]);
    while (clampGroup.children.length) clampGroup.remove(clampGroup.children[0]);

    var tr = DATA.trials[state.trialIdx];
    var iDeg = tr.L;
    var rDeg = tr.r;
    var iRad = iDeg * Math.PI / 180;
    var rRad = rDeg * Math.PI / 180;

    var W_3D = 1.20;
    var zTop = -W_3D / 2;
    var zBot = W_3D / 2;
    var yRay = 0.04;

    var xE = W_3D * Math.tan(rRad);
    var pL = new THREE.Vector3(0, yRay, zTop);
    var pN0 = new THREE.Vector3(0, yRay, zBot);
    var pE = new THREE.Vector3(xE, yRay, zBot);

    var pInc = new THREE.Vector3(-1.10 * Math.sin(iRad), yRay, zTop - 1.10 * Math.cos(iRad));
    var pEmg = new THREE.Vector3(xE + 1.10 * Math.sin(iRad), yRay, zBot + 1.10 * Math.cos(iRad));

    // Normal LN0 (width w = 6.0 cm)
    rayGroup.add(makeBeam(new THREE.Vector3(0, yRay, zTop - 0.55), new THREE.Vector3(0, yRay, zBot + 0.55), 0.010, 0x64748b, 0.7));
    rayGroup.add(makeBeam(pL, pN0, 0.022, 0x38bdf8, 1.0)); // Side w = LN0
    rayGroup.add(makeBeam(pN0, pE, 0.024, 0xf59e0b, 1.0)); // Side LE = w tan r
    rayGroup.add(makeBeam(pL, pE, 0.028, 0x10b981, 1.0));  // Hypotenuse LN = w sec r

    // Incident & Emergent Ray traces on paper
    rayGroup.add(makeBeam(pInc, pL, 0.022, 0xf59e0b, 1.0));
    rayGroup.add(makeBeam(pE, pEmg, 0.022, 0x38bdf8, 1.0));

    // 4 Optical Pins (P1, P2 on incident ray; P3, P4 on emergent ray)
    var p1 = makeOpticalPin(0xf59e0b, 0);
    p1.position.set(-0.88 * Math.sin(iRad), 0.02, zTop - 0.88 * Math.cos(iRad));
    var p2 = makeOpticalPin(0xf59e0b, 0);
    p2.position.set(-0.40 * Math.sin(iRad), 0.02, zTop - 0.40 * Math.cos(iRad));

    var isTilted = state.cond === "wide";
    var p3 = makeOpticalPin(0xef4444, isTilted ? 0.34 : 0);
    p3.position.set(xE + 0.40 * Math.sin(iRad), 0.02, zBot + 0.40 * Math.cos(iRad));
    var p4 = makeOpticalPin(0xef4444, isTilted ? -0.28 : 0);
    p4.position.set(xE + 0.88 * Math.sin(iRad), 0.02, zBot + 0.88 * Math.cos(iRad));

    clampGroup.add(p1, p2, p3, p4);

    glassSlab.material.opacity = state.cond === "heavy" ? 0.22 : 0.36;

    rayGroup.userData.pInc = pInc;
    rayGroup.userData.pO = pL;
    rayGroup.userData.pE = pE;
    rayGroup.userData.pOut = pEmg;
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
    var mTxt = state.cond === "heavy" ? "Triangle LN₀E (w = 6.0 cm)" : state.cond === "wide" ? "Tilted Pin-Top Error!" : "4 Pins Aligned (Bases)";
    g.fillText("TRIAL " + tr.label + " · " + mTxt, 22, 42);

    g.fillStyle = "#f5efe4";
    g.font = "700 32px JetBrains Mono, monospace";
    g.fillText("i=" + tr.L.toFixed(0) + "° r=" + tr.r.toFixed(1) + "° · LE=" + tr.t, 22, 98);

    g.fillStyle = "#ffb23f";
    g.font = "600 24px JetBrains Mono, monospace";
    g.fillText("LN = " + tr.T + " · LE/LN = " + tr.T2, 22, 148);

    g.fillStyle = "#a5b0c9";
    g.font = "500 20px Manrope, sans-serif";
    g.fillText(statusLine || "LE = w tan r · LN = w sec r", 22, 198);

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
      ? "Internal Triangle LN₀E: Cyan w = 6.0 cm, Amber LE = w tan r, Emerald LN = w sec r!"
      : cond === "wide"
        ? "Tilted Pin-Top Trap: Notice how the red pin heads shift sideways while the green pin bases stay on the ray!"
        : "Four-Pin Ray-Tracing: Pin bases P₁, P₂, P₃, P₄ aligned at ≥ 4 cm spacing.";
    toast(msg);
    updateHudSprite(msg.slice(0, 40));
  }

  function test(idx) {
    if (idx < 0 || idx >= DATA.trials.length) return;
    state.trialIdx = idx;
    applyTrialGeometry();
    state.timed[idx] = true;
    var tr = DATA.trials[idx];
    updateHudSprite("Recorded Trial " + tr.label + ": LE=" + tr.t + ", LN=" + tr.T);
    toast("Trial " + tr.label + " (i = " + tr.L.toFixed(0) + "°): LE = " + tr.t + ", LN = " + tr.T + ", LE/LN = " + tr.T2);
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
    updateHudSprite("Reset · Ready to trace 4-pin trials A–E");
    toast("Bench reset. Tap Trials A–E to trace rays and measure LE and LN.");
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
    var pE = rayGroup.userData.pE;
    var pOut = rayGroup.userData.pOut;
    for (var i = 0; i < photonBeads.length; i++) {
      photonBeads[i].u = (photonBeads[i].u + dt * 0.38) % 1;
      var u = photonBeads[i].u;
      if (u < 0.33) {
        photonBeads[i].mesh.position.copy(pInc).lerp(pO, u * 3);
      } else if (u < 0.66) {
        photonBeads[i].mesh.position.copy(pO).lerp(pE, (u - 0.33) * 3);
      } else {
        photonBeads[i].mesh.position.copy(pE).lerp(pOut, (u - 0.66) * 3);
      }
    }
    var pulse = 0.45 + 0.25 * Math.sin(t * 5);
    var showGlow = highlightPart === "bob";
    bobGlow.material.opacity += ((showGlow ? pulse : 0) - bobGlow.material.opacity) * Math.min(1, dt * 8);
  }
})();
