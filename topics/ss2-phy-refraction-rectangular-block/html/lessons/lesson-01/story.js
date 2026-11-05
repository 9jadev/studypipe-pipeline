/* Lesson 01 · 3D story beats: Zainab, Kelechi & Dr Kunle at the Surulere Optometry Clinic testing oblique vs normal laser refraction */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildLaserSlabProp(labelText, isOblique, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#2d3748", 0.65);
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.42,
      roughness: 0.15,
      metalness: 0.1
    });

    // Optical base pad
    var pad = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.05, 0.36), wood);
    pad.position.set(0, 0.025, 0);
    g.add(pad);

    // Crown glass block
    var block = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.26), glassMat);
    block.position.set(0, 0.14, 0);
    g.add(block);

    // Laser ray visual
    var rayMat = new THREE.MeshStandardMaterial({
      color: isOblique ? 0x10b981 : 0xf59e0b,
      emissive: isOblique ? 0x10b981 : 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    var ray = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.48, 12), rayMat);
    ray.rotation.z = isOblique ? 0.95 : Math.PI / 2;
    ray.position.set(0, 0.26, 0);
    g.add(ray);
    g.userData.rayMat = rayMat;

    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, 0.58, 0.05);
    g.add(tag);
    return g;
  }

  function reset(w) {
    var p = w.people;
    if (p.ngozi.parent !== w.props.market) { p.ngozi.parent.remove(p.ngozi); w.props.market.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.userData.faceTarget = null; p.ngozi.hold(null);
    p.ngozi.position.set(0, 0, -1.0); p.ngozi.rotation.y = 0;
  }

  var beats = [
    {
      caption: "Surulere, Lagos. Dr Kunle's Eye & Optical Calibration Clinic.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Dr Kunle! Look at the green alignment laser entering this crown-glass block at 45 degrees — why did the beam suddenly bend down to 28.1 degrees inside the glass?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Kelechi guesses that the glass changes the laser's frequency.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Maybe the glass slows down the oscillations of the laser so its frequency drops, or maybe only curved lenses can bend light!",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Dr Kunle explains wavefront slowing at constant frequency.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Frequency never changes! The laser stays green at 5.0 × 10¹⁴ Hz, but its speed drops from 3.0 × 10⁸ to 2.0 × 10⁸ m s⁻¹ — compressing wavelength and pivoting the wavefront!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Rig A (Normal Incidence i = 0°) vs Rig B (Oblique Incidence i = 45°) on the bench.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Compare Rig A and Rig B: at normal incidence (i = 0°), the whole wavefront slows together so r = 0°. At oblique incidence (i = 45°), one edge slows first and obeys Snell's law: sin i / sin r = n!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Watch out for the glancing-angle trap and the 90° reflected–refracted angle!",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "And remember: always measure angles from the normal! Plus, at i = 56.3°, the reflected and refracted rays are 90° apart so n = tan i = 1.50!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the SS2 Physics Optics Lab with Mrs Adebayo…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's test five angles on our 3D Snell's law laser bench, record sin i and sin r to 3 decimal places, and verify that sin i divided by sin r equals 1.50!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Dr Kunle (Optometrist)",
      cust1: "Zainab (SS2 Student)",
      cust2: "Kelechi (Classmate)",
      amaka: "Mrs Adebayo (Physics Lab)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("SURULERE OPTOMETRY & LASER CLINIC", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("WAEC GEOMETRICAL OPTICS LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var rigA = buildLaserSlabProp("Rig A · Normal (i=0°, r=0°)", false, "rgba(217,119,6,0.95)");
      rigA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(rigA);
      api.props.clockA = rigA;
      api.props.bottleA = rigA;

      var rigB = buildLaserSlabProp("Rig B · Oblique (i=45°, r=28.1°)", true, "rgba(13,156,126,0.95)");
      rigB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(rigB);
      api.props.clockB = rigB;
      api.props.bottleB = rigB;
    },
    onTick: function (api, dt, t) {
      if (api.props.clockA && api.props.clockA.userData.rayMat) {
        api.props.clockA.userData.rayMat.emissiveIntensity = 0.75 + 0.25 * Math.sin(t * 4);
      }
      if (api.props.clockB && api.props.clockB.userData.rayMat) {
        api.props.clockB.userData.rayMat.emissiveIntensity = 0.75 + 0.25 * Math.cos(t * 4);
      }
    }
  });
})();
