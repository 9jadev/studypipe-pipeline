/* ==========================================================
   StudyPipe Kit: refraction-glass-block (v1)
   Parametric 3D Rectangular Glass Block, Optical Pins, Laser
   Ray Segment & Protractor/Normal builder for Three.js + SceneKit
   ========================================================== */
(function () {
  "use strict";

  function createGlassSlab(THREE, opts) {
    opts = opts || {};
    var w = opts.width || 2.4;
    var h = opts.height || 0.36;
    var d = opts.depth || 1.5;
    var g = new THREE.Group();

    var glassMat = new THREE.MeshPhysicalMaterial({
      color: opts.color || 0x67e8f9,
      transparent: true,
      opacity: opts.opacity || 0.36,
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.55
    });
    var slab = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat);
    slab.position.y = h / 2;
    g.add(slab);

    var edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
    var edgeMat = new THREE.LineBasicMaterial({ color: opts.edgeColor || 0x3ee6c4, transparent: true, opacity: 0.78 });
    var edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.y = h / 2;
    g.add(edges);

    g.userData.slab = slab;
    g.userData.edges = edges;
    g.userData.glassMat = glassMat;
    return g;
  }

  function createOpticalPin(THREE, opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var headCol = opts.color || 0xffb23f;
    var shaftMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
    var headMat = new THREE.MeshStandardMaterial({ color: headCol, emissive: headCol, emissiveIntensity: 0.4, roughness: 0.25 });
    var baseMat = new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x3ee6c4, emissiveIntensity: 0.55 });

    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.008, 0.46, 14), shaftMat);
    shaft.position.y = 0.23;
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), headMat);
    head.position.y = 0.47;
    var baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 10, 24), baseMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.012;

    g.add(shaft, head, baseRing);
    return g;
  }

  window.RefractionBlockKit = {
    version: 1,
    createGlassSlab: createGlassSlab,
    createOpticalPin: createOpticalPin
  };
})();
