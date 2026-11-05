/* Lesson 02 · 3D story beats: Zainab, Kelechi & Dr Kunle investigating parallel emergence (e = i), lateral shift d = 1.98 cm, and block vs prism dispersion */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildOpticProp(labelText, isPrism, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#2d3748", 0.65);
    var glassMat = new THREE.MeshStandardMaterial({
      color: isPrism ? 0xa5b4fc : 0x67e8f9,
      transparent: true,
      opacity: 0.44,
      roughness: 0.14,
      metalness: 0.1
    });

    var pad = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.05, 0.36), wood);
    pad.position.set(0, 0.025, 0);
    g.add(pad);

    var shapeMesh;
    if (isPrism) {
      shapeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.24, 3), glassMat);
      shapeMesh.position.set(0, 0.15, 0);
    } else {
      shapeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.26), glassMat);
      shapeMesh.position.set(0, 0.14, 0);
    }
    g.add(shapeMesh);

    var rayMat = new THREE.MeshStandardMaterial({
      color: isPrism ? 0xf43f5e : 0x10b981,
      emissive: isPrism ? 0xf43f5e : 0x10b981,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    var ray = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.48, 12), rayMat);
    ray.rotation.z = isPrism ? 1.15 : 0.85;
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
      caption: "Surulere Optometry Clinic: The 1.98 cm Laser Target Miss!",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Dr Kunle! I aimed the laser at 45 degrees towards the bullseye behind this 6.0 cm rectangular glass block — why did the emergent beam miss the bullseye by 1.98 cm sideways, yet stay completely parallel?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Kelechi wonders why white light doesn't fan out into a rainbow.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "And when we shine a white torch through this rectangular block, why doesn't it spread into a wide rainbow on the wall like a 60-degree triangular prism?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Dr Kunle explains parallel normals (r₁ = i₂) and zero net angular deviation.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Because the opposite faces of a rectangular block are parallel! The normals at entry and exit are parallel, so alternate angles r₁ and i₂ are equal, forcing emergent angle e to equal incident angle i!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Rig A (Rectangular Block · e = i, Shift d) vs Rig B (Triangular Prism · Angular Fan).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Look at Rig A vs Rig B: in a rectangular block, red and violet both return to e = i in air and travel parallel to each other. In a prism, non-parallel faces bend rays towards the base twice!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Deriving lateral displacement d = t sin(i − r) / cos r.",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Inside a block of thickness t, the ray travels hypotenuse ON = t / cos r and shifts sideways by d = ON sin(i − r) = t sin(i − r) / cos r!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the SS2 Physics Lab with Mrs Adebayo…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's test five angles from 15° to 75° on our 3D Rectangular Block Bench and measure both lateral displacement d and far-face shift EF = t tan r!",
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
      var mSign = StoryStage.sign("SURULERE OPTOMETRY · LATERAL SHIFT LAB", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("WAEC RECTANGULAR BLOCK BENCH", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var rigA = buildOpticProp("Rig A · Rect Block (e=i, d=1.98 cm)", false, "rgba(13,156,126,0.95)");
      rigA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(rigA);
      api.props.clockA = rigA;
      api.props.bottleA = rigA;

      var rigB = buildOpticProp("Rig B · 60° Prism (Angular Fan)", true, "rgba(200,38,74,0.95)");
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
