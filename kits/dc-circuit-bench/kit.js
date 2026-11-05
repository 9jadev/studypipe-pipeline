/* ==========================================================
   StudyPipe Kit: dc-circuit-bench (v1)
   Parametric 3D DC Circuit, Internal Resistance, Shunt/Multiplier
   & Metre-Bridge/Potentiometer apparatus builder for Three.js + SceneKit
   ========================================================== */
(function () {
  "use strict";

  function createAccumulatorCell(THREE, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var caseMat = new THREE.MeshStandardMaterial({ color: opts.caseColor || 0x1e293b, roughness: 0.42, metalness: 0.25 });
    var topMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    var redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35, metalness: 0.25 });
    var blueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35, metalness: 0.25 });
    var rGlowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.25, roughness: 0.3 });

    var box = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.52, 0.44), caseMat);
    box.position.y = 0.26;
    g.add(box);

    var lid = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.05, 0.46), topMat);
    lid.position.y = 0.54;
    g.add(lid);

    var pos = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.14, 18), redMat);
    pos.position.set(0.20, 0.62, 0);
    var neg = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.14, 18), blueMat);
    neg.position.set(-0.20, 0.62, 0);
    var rBar = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.15, 0.04), rGlowMat);
    rBar.position.set(0, 0.28, 0.23);
    g.add(pos, neg, rBar);
    g.userData.rGlowMat = rGlowMat;
    return g;
  }

  function createAnalogMeter(THREE, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var caseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 });
    var faceMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: opts.faceEmissive || 0x0ea5e9, emissiveIntensity: 0.18 });
    var needleHex = opts.needleColor || 0x3ee6c4;

    var body = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.44, 0.34), caseMat);
    body.position.y = 0.22;
    g.add(body);

    var face = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.30, 0.03), faceMat);
    face.position.set(0, 0.25, 0.165);
    g.add(face);

    var pivot = new THREE.Group();
    pivot.position.set(0, 0.14, 0.185);
    var needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.21, 0.015),
      new THREE.MeshStandardMaterial({ color: needleHex, emissive: needleHex, emissiveIntensity: 0.6 })
    );
    needle.position.y = 0.095;
    pivot.add(needle);
    g.add(pivot);
    g.userData.pivot = pivot;
    g.userData.setFraction = function (frac) {
      var clamped = Math.max(-1, Math.min(1, frac));
      pivot.rotation.z = 0.65 - clamped * 1.30;
    };
    return g;
  }

  window.DCCircuitKit = {
    version: 1,
    createAccumulatorCell: createAccumulatorCell,
    createAnalogMeter: createAnalogMeter
  };
})();
