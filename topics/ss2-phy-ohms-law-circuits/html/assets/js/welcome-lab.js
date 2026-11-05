/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab (Ohm's Law & Internal Resistance Bench)
   Exposes window.StudyLab for StudyNarrator 3D spotlighting & actions
   ========================================================== */
(function () {
  "use strict";
  var canvas = document.getElementById("lab-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0.0, 1.95, 3.35);

  var controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, canvas) : null;
  if (controls) {
    controls.target.set(0, 0.35, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 5.2;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.update();
  }

  // Studio lights
  scene.add(new THREE.HemisphereLight(0xeef6ff, 0x1a2234, 0.92));
  var key = new THREE.DirectionalLight(0xfff5e4, 1.35);
  key.position.set(2.6, 4.2, 3.0);
  key.castShadow = true;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x22d3ee, 0.58);
  rim.position.set(-2.5, 2.2, -2.0);
  scene.add(rim);

  // Materials
  var woodMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.72, metalness: 0.05 });
  var metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 });
  var brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88 });
  var copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.28, metalness: 0.82 });
  var darkCaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.42, metalness: 0.25 });
  var redTermMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35, metalness: 0.2 });
  var blueTermMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35, metalness: 0.2 });
  var dialFaceMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0ea5e9, emissiveIntensity: 0.16 });
  var chargeMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.85, roughness: 0.2 });

  // Bench top
  var table = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 2.0), woodMat);
  table.position.set(0, -0.06, 0);
  table.receiveShadow = true;
  scene.add(table);

  // 1. Lead-Acid 12V Accumulator Cell (back-left: -0.95, 0, -0.35)
  var cellGroup = new THREE.Group();
  cellGroup.position.set(-0.95, 0, -0.35);
  var cellBox = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.48, 0.42), darkCaseMat);
  cellBox.position.y = 0.24;
  cellBox.castShadow = true;
  cellGroup.add(cellBox);
  var cellTop = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.05, 0.44), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
  cellTop.position.y = 0.49;
  cellGroup.add(cellTop);
  var posPost = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 18), redTermMat);
  posPost.position.set(0.18, 0.56, 0);
  var negPost = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 18), blueTermMat);
  negPost.position.set(-0.18, 0.56, 0);
  // Internal resistance indicator core (glows amber when current flows)
  var rCoreMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.2, roughness: 0.3 });
  var rCore = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.04), rCoreMat);
  rCore.position.set(0, 0.26, 0.22);
  cellGroup.add(posPost, negPost, rCore);
  scene.add(cellGroup);

  // 2. Brass Plug Key / Switch (front-left: -0.95, 0, 0.48)
  var switchGroup = new THREE.Group();
  switchGroup.position.set(-0.95, 0, 0.48);
  var swBase = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.26), darkCaseMat);
  swBase.position.y = 0.035;
  var blockL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.14), brassMat);
  blockL.position.set(-0.11, 0.10, 0);
  var blockR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.14), brassMat);
  blockR.position.set(0.11, 0.10, 0);
  var plugPin = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.028, 0.18, 18), brassMat);
  plugPin.position.set(0, 0.18, 0);
  switchGroup.add(swBase, blockL, blockR, plugPin);
  scene.add(switchGroup);

  // 3. Sliding Constantan Rheostat Load R (front-center/right: 0.22, 0, 0.48)
  var rheoGroup = new THREE.Group();
  rheoGroup.position.set(0.22, 0, 0.48);
  var legL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.26), metalMat);
  legL.position.set(-0.48, 0.17, 0);
  var legR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.26), metalMat);
  legR.position.set(0.48, 0.17, 0);
  var coilCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.90, 24), copperMat);
  coilCyl.rotation.z = Math.PI / 2;
  coilCyl.position.set(0, 0.20, 0);
  coilCyl.castShadow = true;
  var slideBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.96, 16), metalMat);
  slideBar.rotation.z = Math.PI / 2;
  slideBar.position.set(0, 0.36, 0);
  var sliderBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.14), brassMat);
  sliderBlock.position.set(0.0, 0.36, 0);
  rheoGroup.add(legL, legR, coilCyl, slideBar, sliderBlock);
  scene.add(rheoGroup);

  // 4. Series Analogue Ammeter (back-right: 0.95, 0, -0.25)
  function createMeter(x, z, needleHex) {
    var g = new THREE.Group();
    g.position.set(x, 0, z);
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.38, 0.32), darkCaseMat);
    body.position.y = 0.19;
    body.castShadow = true;
    var face = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.03), dialFaceMat);
    face.position.set(0, 0.22, 0.155);
    var needlePivot = new THREE.Group();
    needlePivot.position.set(0, 0.12, 0.175);
    var needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.18, 0.015),
      new THREE.MeshStandardMaterial({ color: needleHex, emissive: needleHex, emissiveIntensity: 0.55 })
    );
    needle.position.y = 0.08;
    needlePivot.add(needle);
    g.add(body, face, needlePivot);
    scene.add(g);
    return { group: g, pivot: needlePivot };
  }

  var ammeterObj = createMeter(0.95, -0.25, 0x22d3ee);
  var voltmeterObj = createMeter(-0.08, -0.42, 0xf59e0b);

  // 5. Copper Loop & Animated Charge Spheres
  var wireMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.75 });
  var loopPoints = [
    new THREE.Vector3(-0.95, 0.08, -0.15),
    new THREE.Vector3(-0.95, 0.08, 0.48),
    new THREE.Vector3(0.22, 0.08, 0.48),
    new THREE.Vector3(0.95, 0.08, 0.48),
    new THREE.Vector3(0.95, 0.08, -0.25),
    new THREE.Vector3(-0.95, 0.08, -0.25)
  ];
  for (var i = 0; i < loopPoints.length - 1; i++) {
    var p1 = loopPoints[i];
    var p2 = loopPoints[i + 1];
    var dist = p1.distanceTo(p2);
    var seg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, dist, 10), wireMat);
    seg.position.copy(p1).lerp(p2, 0.5);
    seg.lookAt(p2);
    seg.rotateX(Math.PI / 2);
    scene.add(seg);
  }

  var charges = [];
  var NUM_CHARGES = 18;
  for (var c = 0; c < NUM_CHARGES; c++) {
    var sp = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 10), chargeMat);
    scene.add(sp);
    charges.push({ mesh: sp, u: c / NUM_CHARGES });
  }

  function pointOnLoop(u) {
    var totalSegs = Math.max(1, loopPoints.length - 1);
    var normU = ((u % 1) + 1) % 1;
    if (isNaN(normU)) normU = 0;
    var scaled = normU * totalSegs;
    var idx = Math.floor(scaled);
    if (idx < 0) idx = 0;
    if (idx >= totalSegs) idx = totalSegs - 1;
    var f = scaled - idx;
    var pA = loopPoints[idx] || loopPoints[0];
    var pB = loopPoints[idx + 1] || loopPoints[totalSegs] || pA;
    return new THREE.Vector3().copy(pA).lerp(pB, f);
  }

  var parts = {
    cell: cellGroup,
    switch: switchGroup,
    rheostat: rheoGroup,
    ammeter: ammeterObj.group,
    voltmeter: voltmeterObj.group
  };

  // Simulation state: Aba Workshop 12.0 V battery with r = 1.2 Ω
  var loads = [2.8, 4.8, 10.8]; // R = 2.8 Ω (starter load -> I=3.0A, V=8.4V), 4.8 Ω (I=2.0A, V=9.6V), 10.8 Ω (I=1.0A, V=10.8V)
  var loadIdx = 0;
  var state = {
    E: 12.0,
    r: 1.2,
    R: loads[loadIdx],
    closed: true,
    testedOnce: false
  };

  var elVol = document.getElementById("val-vol");
  var elPh = document.getElementById("val-ph");
  var elStatus = document.getElementById("val-status");
  var elToast = document.getElementById("endpoint-toast");
  var btnSwitch = document.getElementById("btn-drop");
  var btnLoad = document.getElementById("btn-stream");
  var btnReset = document.getElementById("btn-reset");

  function computeMetrics() {
    if (!state.closed) {
      return { I: 0.0, V: state.E, lost: 0.0, eff: 100.0 };
    }
    var I = state.E / (state.R + state.r);
    var V = I * state.R;
    var lost = I * state.r;
    var eff = (state.R / (state.R + state.r)) * 100;
    return { I: I, V: V, lost: lost, eff: eff };
  }

  function syncApparatus() {
    var m = computeMetrics();
    // Plug key height
    plugPin.position.y = state.closed ? 0.13 : 0.25;
    // Rheostat slider position
    var normR = (state.R - 2.8) / 8.0;
    sliderBlock.position.x = -0.32 + normR * 0.64;
    // Ammeter needle angle (-0.65 rad at 0 A to +0.65 rad at 4 A)
    ammeterObj.pivot.rotation.z = 0.65 - (m.I / 4.0) * 1.3;
    // Voltmeter needle angle (-0.65 rad at 0 V to +0.65 rad at 15 V)
    voltmeterObj.pivot.rotation.z = 0.65 - (m.V / 15.0) * 1.3;
    // Internal resistance glow
    rCoreMat.emissiveIntensity = state.closed ? 0.25 + (m.lost / 4.0) * 0.7 : 0.1;

    if (elVol) elVol.textContent = "R = " + state.R.toFixed(1) + " Ω · I = " + m.I.toFixed(2) + " A";
    if (elPh) elPh.textContent = "V = " + m.V.toFixed(1) + " V (lost " + m.lost.toFixed(1) + " V)";
    if (elStatus) {
      if (!state.closed) {
        elStatus.textContent = "Open Circuit: V = E = 12.0 V (I = 0 A)";
        elStatus.className = "hud-v status-near";
      } else {
        elStatus.textContent = "Closed: η = " + m.eff.toFixed(0) + "% · v = Ir = " + m.lost.toFixed(1) + " V";
        elStatus.className = "hud-v status-end";
      }
    }
  }
  syncApparatus();

  function emitResult() {
    var m = computeMetrics();
    state.testedOnce = true;
    if (elToast) {
      elToast.hidden = false;
      elToast.innerHTML = "<strong>Circuit Reading:</strong> I = <strong>" + m.I.toFixed(2) + " A</strong> · Terminal V = <strong>" + m.V.toFixed(1) + " V</strong> · Lost Ir = <strong>" + m.lost.toFixed(1) + " V</strong>";
    }
    document.dispatchEvent(new CustomEvent("lab:result", {
      detail: {
        closed: state.closed,
        R: state.R,
        r: state.r,
        E: state.E,
        I: m.I,
        V: m.V,
        lost: m.lost,
        eff: m.eff
      }
    }));
  }

  function toggleSwitch() {
    state.closed = !state.closed;
    syncApparatus();
    emitResult();
  }

  function cycleLoad() {
    loadIdx = (loadIdx + 1) % loads.length;
    state.R = loads[loadIdx];
    state.closed = true;
    syncApparatus();
    emitResult();
  }

  function resetLab() {
    loadIdx = 0;
    state.R = loads[loadIdx];
    state.closed = true;
    if (elToast) elToast.hidden = true;
    syncApparatus();
  }

  if (btnSwitch) btnSwitch.addEventListener("click", toggleSwitch);
  if (btnLoad) btnLoad.addEventListener("click", cycleLoad);
  if (btnReset) btnReset.addEventListener("click", resetLab);

  // keep the whole bench (about 3.5 units wide) in view on narrow phone canvases
  var lookAt = new THREE.Vector3(0, 0.35, 0), baseDist = camera.position.distanceTo(lookAt);
  function resize() {
    var w = canvas.clientWidth || 480;
    var h = canvas.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    var halfW = 1.8, tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect;
    var d = Math.max(baseDist, halfW / tanH);
    var from = controls ? controls.target : lookAt;
    var dir = camera.position.clone().sub(from).normalize();
    camera.position.copy(from).addScaledVector(dir, d);
    if (controls) { controls.maxDistance = Math.max(5.2, d * 1.35); controls.update(); }
  }
  resize();
  window.addEventListener("resize", resize);

  function setHighlight(partName) {
    Object.keys(parts).forEach(function (k) {
      var obj = parts[k];
      var on = k === partName;
      obj.traverse(function (m) {
        if (m.isMesh && m.material && m.material.emissive && m !== rCore) {
          m.material.emissive.setHex(on ? 0xf59e0b : 0x000000);
          m.material.emissiveIntensity = on ? 0.55 : 0;
        }
      });
    });
  }

  function rectOfPart(partName) {
    var obj = parts[partName];
    if (!obj) return canvas.getBoundingClientRect();
    var box = new THREE.Box3().setFromObject(obj);
    if (box.isEmpty()) return canvas.getBoundingClientRect();
    var cRect = canvas.getBoundingClientRect();
    var pts = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      new THREE.Vector3(box.min.x, box.max.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z)
    ];
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(function (p) {
      p.project(camera);
      var sx = cRect.left + (p.x * 0.5 + 0.5) * cRect.width;
      var sy = cRect.top + (-p.y * 0.5 + 0.5) * cRect.height;
      if (sx < minX) minX = sx;
      if (sy < minY) minY = sy;
      if (sx > maxX) maxX = sx;
      if (sy > maxY) maxY = sy;
    });
    var pad = 16;
    return {
      left: minX - pad,
      top: minY - pad,
      right: maxX + pad,
      bottom: maxY + pad,
      width: Math.max(44, maxX - minX + pad * 2),
      height: Math.max(44, maxY - minY + pad * 2)
    };
  }

  var lastTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    var currentTime = (typeof now === "number" && !isNaN(now)) ? now : performance.now();
    var dt = Math.min(0.05, Math.max(0, (currentTime - lastTime) / 1000));
    lastTime = currentTime;
    if (isNaN(dt)) dt = 0.016;

    var m = computeMetrics();
    var speed = state.closed ? 0.08 * m.I : 0;
    for (var i = 0; i < charges.length; i++) {
      charges[i].u = (charges[i].u + speed * dt) % 1;
      var pos = pointOnLoop(charges[i].u);
      charges[i].mesh.position.copy(pos);
      charges[i].mesh.visible = state.closed;
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  window.StudyLab = {
    rect: rectOfPart,
    highlight: setHighlight,
    reset: resetLab,
    drop: toggleSwitch,
    demoEndpoint: function () {
      state.closed = true;
      syncApparatus();
      emitResult();
    }
  };
})();
