/* ==========================================================
   StudyPipe — Welcome Hub 3D Interactive Lab (welcome-lab.js)
   Refraction of Light Through a Rectangular Glass Block
   Exposes window.StudyLab for StudyNarrator & welcome.js
   ========================================================== */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  var canvas = document.getElementById("lab-canvas");
  if (!canvas) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1.5, 0.1, 100);
  camera.position.set(0.3, 4.5, 5.2);
  camera.lookAt(0, 0.25, 0);

  // Studio lights
  scene.add(new THREE.AmbientLight(0xdbeafe, 0.72));
  var keyLight = new THREE.DirectionalLight(0xfff7ed, 1.18);
  keyLight.position.set(3.5, 6.2, 4.0);
  keyLight.castShadow = true;
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
  rimLight.position.set(-4.0, 3.2, -3.2);
  scene.add(rimLight);

  var root = new THREE.Group();
  scene.add(root);

  // Softwood Drawing Board + White A4 Tracing Sheet
  var board = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 0.18, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.78 })
  );
  board.position.y = -0.09;
  board.receiveShadow = true;
  root.add(board);

  var sheet = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.02, 3.6),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55 })
  );
  sheet.position.y = 0.01;
  sheet.receiveShadow = true;
  root.add(sheet);

  // Rectangular Crown Glass Block ABCD (width w = 6.0 cm -> 1.8 units in Z)
  var blockW = 1.8;
  var blockL = 3.1;
  var blockH = 0.52;
  var glassBlock = new THREE.Mesh(
    new THREE.BoxGeometry(blockL, blockH, blockW),
    new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.36,
      roughness: 0.12,
      metalness: 0.08
    })
  );
  glassBlock.position.set(0, blockH / 2 + 0.02, 0);
  root.add(glassBlock);

  var blockEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(blockL, blockH, blockW)),
    new THREE.LineBasicMaterial({ color: 0x0284c7 })
  );
  glassBlock.add(blockEdges);

  // Laser source housing
  var laserBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.28, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.38, metalness: 0.55 })
  );
  root.add(laserBox);

  // Dynamic ray & pin group
  var rayGroup = new THREE.Group();
  root.add(rayGroup);

  var pinP1 = new THREE.Group();
  var pinP2 = new THREE.Group();
  var pinP3 = new THREE.Group();
  var pinP4 = new THREE.Group();

  function makePin(headColor) {
    var g = new THREE.Group();
    var shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.014, 0.52, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 })
    );
    shaft.position.y = 0.26;
    var head = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 14, 12),
      new THREE.MeshStandardMaterial({ color: headColor, roughness: 0.25 })
    );
    head.position.y = 0.53;
    g.add(shaft, head);
    return g;
  }

  pinP1 = makePin(0xef4444);
  pinP2 = makePin(0xf97316);
  pinP3 = makePin(0x10b981);
  pinP4 = makePin(0x14b8a6);
  root.add(pinP1, pinP2, pinP3, pinP4);

  // Glow ring for narrator highlight
  var glowMesh = new THREE.Mesh(
    new THREE.RingGeometry(0.28, 0.40, 32),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0 })
  );
  glowMesh.rotation.x = -Math.PI / 2;
  glowMesh.position.y = 0.04;
  root.add(glowMesh);

  var parts = {
    block: glassBlock,
    laser: laserBox,
    pinsInc: pinP1,
    pinsEm: pinP3
  };
  var activePart = null;

  // State: 3 angles of incidence (30°, 45°, 60°) and 2 media (Crown Glass n=1.50, Dense Flint n=1.65)
  var angles = [30, 45, 60];
  var angleIdx = 1; // 45° default
  var media = [
    { name: "Crown Glass", n: 1.50, col: 0x67e8f9 },
    { name: "Dense Flint", n: 1.65, col: 0xa5b4fc }
  ];
  var medIdx = 0;

  function makeBeam(p1, p2, radius, colorHex, opacity) {
    var dir = new THREE.Vector3().subVectors(p2, p1);
    var len = dir.length();
    if (len < 0.001) return new THREE.Group();
    var geom = new THREE.CylinderGeometry(radius, radius, len, 14);
    var mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.45,
      transparent: opacity < 1,
      opacity: opacity || 1,
      roughness: 0.25
    });
    var mesh = new THREE.Mesh(geom, mat);
    var mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function computeState() {
    var iDeg = angles[angleIdx];
    var m = media[medIdx];
    var n = m.n;
    var iRad = iDeg * Math.PI / 180;
    var sinR = Math.sin(iRad) / n;
    var rRad = Math.asin(Math.min(0.999, sinR));
    var rDeg = rRad * 180 / Math.PI;
    var tCm = 6.0;
    var dCm = tCm * Math.sin(iRad - rRad) / Math.cos(rRad);
    var efCm = tCm * Math.tan(rRad);
    return {
      iDeg: iDeg,
      rDeg: rDeg,
      eDeg: iDeg,
      n: n,
      medium: m.name,
      dCm: dCm,
      efCm: efCm,
      iRad: iRad,
      rRad: rRad
    };
  }

  function rebuildOptics(emitEvent) {
    while (rayGroup.children.length) rayGroup.remove(rayGroup.children[0]);
    var st = computeState();
    glassBlock.material.color.setHex(media[medIdx].col);

    var yRay = 0.26;
    var zTop = -blockW / 2;
    var zBot = blockW / 2;
    var xO = -0.42;

    var incLen = 1.65;
    var pIncStart = new THREE.Vector3(
      xO - incLen * Math.sin(st.iRad),
      yRay,
      zTop - incLen * Math.cos(st.iRad)
    );
    var pO = new THREE.Vector3(xO, yRay, zTop);

    var xN = xO + blockW * Math.tan(st.rRad);
    var pN = new THREE.Vector3(xN, yRay, zBot);

    var emLen = 1.65;
    var pEmEnd = new THREE.Vector3(
      xN + emLen * Math.sin(st.iRad),
      yRay,
      zBot + emLen * Math.cos(st.iRad)
    );

    // Original undeviated dashed path
    var extLen = 2.85;
    var pGhostEnd = new THREE.Vector3(
      xO + extLen * Math.sin(st.iRad),
      yRay,
      zTop + extLen * Math.cos(st.iRad)
    );

    // Normals at O and N
    rayGroup.add(makeBeam(
      new THREE.Vector3(xO, yRay, zTop - 0.55),
      new THREE.Vector3(xO, yRay, zTop + 0.55),
      0.012, 0x94a3b8, 0.7
    ));
    rayGroup.add(makeBeam(
      new THREE.Vector3(xN, yRay, zBot - 0.55),
      new THREE.Vector3(xN, yRay, zBot + 0.55),
      0.012, 0x94a3b8, 0.7
    ));

    // Incident, refracted, emergent rays + ghost undeviated path
    rayGroup.add(makeBeam(pIncStart, pO, 0.032, 0xf59e0b, 1.0));
    rayGroup.add(makeBeam(pO, pN, 0.032, 0x38bdf8, 1.0));
    rayGroup.add(makeBeam(pN, pEmEnd, 0.032, 0x10b981, 1.0));
    rayGroup.add(makeBeam(pO, pGhostEnd, 0.014, 0xfbbf24, 0.35));

    // Lateral displacement segment d from N perpendicular to ghost line
    var u = new THREE.Vector3(Math.sin(st.iRad), 0, Math.cos(st.iRad));
    var vON = new THREE.Vector3().subVectors(pN, pO);
    var proj = vON.dot(u);
    var pFoot = new THREE.Vector3().copy(pO).addScaledVector(u, proj);
    rayGroup.add(makeBeam(pN, pFoot, 0.024, 0xf43f5e, 0.95));

    // Position laser box & 4 optical pins P1, P2, P3, P4
    laserBox.position.copy(pIncStart);
    laserBox.position.y = 0.16;
    laserBox.rotation.y = Math.atan2(pO.x - pIncStart.x, pO.z - pIncStart.z);

    pinP1.position.copy(pIncStart).lerp(pO, 0.32); pinP1.position.y = 0.02;
    pinP2.position.copy(pIncStart).lerp(pO, 0.72); pinP2.position.y = 0.02;
    pinP3.position.copy(pN).lerp(pEmEnd, 0.34);    pinP3.position.y = 0.02;
    pinP4.position.copy(pN).lerp(pEmEnd, 0.76);    pinP4.position.y = 0.02;

    // Update HUD readouts
    var elVol = document.getElementById("val-vol");
    var elPh = document.getElementById("val-ph");
    var elStatus = document.getElementById("val-status");
    var toast = document.getElementById("endpoint-toast");

    if (elVol) elVol.textContent = "i = " + st.iDeg + "° · r = " + st.rDeg.toFixed(1) + "° · e = " + st.eDeg + "°";
    if (elPh) elPh.textContent = st.medium + " (n = " + st.n.toFixed(2) + ") · t = 6.0 cm";
    if (elStatus) elStatus.textContent = "Lateral Shift d = " + st.dCm.toFixed(2) + " cm · EF = " + st.efCm.toFixed(2) + " cm";

    if (toast) {
      toast.hidden = false;
      toast.innerHTML =
        "<strong>Ray Trace:</strong> i = <strong>" + st.iDeg + "°</strong> → r = <strong>" +
        st.rDeg.toFixed(1) + "°</strong> → e = <strong>" + st.eDeg + "°</strong> · Shift d = <strong>" +
        st.dCm.toFixed(2) + " cm</strong>";
    }

    if (emitEvent) {
      document.dispatchEvent(new CustomEvent("lab:result", { detail: st }));
    }
  }

  // Orbit drag interaction
  var dragging = false, prevX = 0, prevY = 0, yaw = 0.06, pitch = 0.68, dist = 6.6;
  function updateCam() {
    camera.position.set(
      dist * Math.sin(yaw) * Math.cos(pitch),
      dist * Math.sin(pitch),
      dist * Math.cos(yaw) * Math.cos(pitch)
    );
    camera.lookAt(0, 0.2, 0);
  }
  updateCam();

  canvas.addEventListener("pointerdown", function (e) {
    dragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    yaw -= (e.clientX - prevX) * 0.007;
    pitch = Math.max(0.25, Math.min(1.32, pitch + (e.clientY - prevY) * 0.007));
    prevX = e.clientX;
    prevY = e.clientY;
    updateCam();
  });
  function stopDrag() { dragging = false; }
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  function resize() {
    var p = canvas.parentElement;
    if (!p) return;
    var w = Math.max(260, p.clientWidth || 340);
    var h = Math.max(240, p.clientHeight || 290);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Buttons
  var btnDrop = document.getElementById("btn-drop");
  var btnStream = document.getElementById("btn-stream");
  var btnReset = document.getElementById("btn-reset");

  if (btnDrop) {
    btnDrop.addEventListener("click", function () {
      angleIdx = (angleIdx + 1) % angles.length;
      rebuildOptics(true);
    });
  }
  if (btnStream) {
    btnStream.addEventListener("click", function () {
      medIdx = (medIdx + 1) % media.length;
      rebuildOptics(true);
    });
  }
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      angleIdx = 1;
      medIdx = 0;
      rebuildOptics(false);
    });
  }

  rebuildOptics(false);

  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    if (activePart && parts[activePart]) {
      var targetObj = parts[activePart];
      var wp = new THREE.Vector3();
      targetObj.getWorldPosition(wp);
      glowMesh.position.set(wp.x, 0.04, wp.z);
      glowMesh.material.opacity = 0.55 + 0.3 * Math.sin(t * 5);
    } else {
      glowMesh.material.opacity = 0;
    }
    renderer.render(scene, camera);
  }
  animate();

  // Public API for StudyNarrator and welcome.js
  window.StudyLab = {
    reset: function () {
      angleIdx = 1;
      medIdx = 0;
      rebuildOptics(false);
    },
    drop: function () {
      angleIdx = (angleIdx + 1) % angles.length;
      rebuildOptics(true);
    },
    demoEndpoint: function () {
      angleIdx = 2; // 60°
      medIdx = 0;
      rebuildOptics(true);
    },
    highlight: function (partName) {
      activePart = partName || null;
    },
    rect: function (partName) {
      var obj = parts[partName];
      if (!obj) return canvas.getBoundingClientRect();
      var wp = new THREE.Vector3();
      obj.getWorldPosition(wp);
      wp.project(camera);
      var r = canvas.getBoundingClientRect();
      var cx = r.left + (wp.x * 0.5 + 0.5) * r.width;
      var cy = r.top + (-wp.y * 0.5 + 0.5) * r.height;
      return { left: cx - 36, top: cy - 36, right: cx + 36, bottom: cy + 36, width: 72, height: 72 };
    }
  };
})();
