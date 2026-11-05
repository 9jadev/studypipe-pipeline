/* Lesson 05 · 3D story beats: Zainab, Kelechi & Mrs Adebayo at the WAEC Paper 3 Practical Hall & Unit Finale */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildPinBoardProp(labelText, isTilted, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#b4834e", 0.65);
    var paperMat = StoryStage.std("#faf8f2", 0.5);
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.42,
      roughness: 0.14
    });

    var board = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.04, 0.38), wood);
    board.position.set(0, 0.02, 0);
    g.add(board);

    var paper = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.01, 0.33), paperMat);
    paper.position.set(0, 0.045, 0);
    g.add(paper);

    var slab = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.10, 0.16), glassMat);
    slab.position.set(0, 0.10, 0);
    g.add(slab);

    var rayMat = new THREE.MeshStandardMaterial({
      color: isTilted ? 0xf59e0b : 0x10b981,
      emissive: isTilted ? 0xf59e0b : 0x10b981,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    var ray = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.42, 10), rayMat);
    ray.rotation.z = Math.PI / 2;
    ray.rotation.y = -0.62;
    ray.position.set(0, 0.06, 0);
    g.add(ray);
    g.userData.rayMat = rayMat;

    // 4 Optical Pins
    var coords = [
      [-0.18, -0.11, 0],
      [-0.09, -0.06, 0],
      [0.09, 0.06, isTilted ? 0.35 : 0],
      [0.18, 0.11, isTilted ? -0.30 : 0]
    ];
    coords.forEach(function (c, idx) {
      var pG = new THREE.Group();
      pG.position.set(c[0], 0.05, c[1]);
      pG.rotation.z = c[2];
      var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.16, 8), StoryStage.std("#e2e8f0", 0.3));
      shaft.position.y = 0.08;
      pG.add(shaft);
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), StoryStage.std(idx < 2 ? "#f59e0b" : (isTilted ? "#ef4444" : "#10b981"), 0.3));
      head.position.y = 0.16;
      pG.add(head);
      g.add(pG);
    });

    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, 0.56, 0.05);
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
      caption: "WAEC Physics Paper 3 Mock Practical Hall · Surulere Senior High.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust2",
      text: "Zainab! My emergent ray P₃P₄ misses the parallel angle by 4 degrees, even though I lined up the red plastic heads at the tops of pins P₃ and P₄ with P₁ and P₂!",
      run: function (w) { reset(w); w.people.cust2.set("point"); }
    },
    {
      caption: "Zainab spots the tilted pin shaft on Board A.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust1",
      text: "Look at pin P₃ on your drawing board! Because the pin tilted slightly in the softwood board, its plastic top shifted sideways off the ray — you must align the BASES (feet) where the pins pierce the paper!",
      run: function (w) { reset(w); w.people.cust1.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Dr Kunle & Mrs Adebayo emphasize the 3 mandatory WAEC Paper 3 precautions.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Spot on, Zainab! WAEC examiners award marks for three essential precautions: align the pin bases (feet), space consecutive pins at least 4 to 5 cm apart, and keep all pins strictly vertical!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Board A (Tilted Pin-Top Error) vs Board B (Aligned Pin Bases & Triangle LN₀E).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Inside a block of width w, the normal LN₀, back-face offset LE, and refracted path LN form a right-angled triangle! So LE = w tan r, LN = w sec r, and LE / LN = sin r!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Beware Variant C: the curved cos i vs cos r graph!",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "And if Paper 3 asks you to plot cos i against cos r, never take a straight-line slope! It is a curve — read a coordinate pair (x₁, y₁) on the curve and compute n = √[(1 − x₁²)/(1 − y₁²)]!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the 3D WAEC Paper 3 Ray-Tracing Bench with Mrs Adebayo…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's trace all five angles from 20° to 60° on our 3D Four-Pin Workbench, record LE, LN, and LE/LN, and master all 7 WAEC Paper 3 graph variants!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Dr Kunle (Optometry Clinic)",
      cust1: "Zainab (SS2 Student)",
      cust2: "Kelechi (Classmate)",
      amaka: "Mrs Adebayo (Physics Lab)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("WAEC PAPER 3 RAY-TRACING CLINIC", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("INTERNAL TRIANGLE LN₀E & 7 GRAPHS", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var rigA = buildPinBoardProp("Board A · Tilted Pin-Top Error", true, "rgba(217,119,6,0.95)");
      rigA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(rigA);
      api.props.clockA = rigA;
      api.props.bottleA = rigA;

      var rigB = buildPinBoardProp("Board B · Pin Bases + Triangle LN₀E", false, "rgba(13,156,126,0.95)");
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
