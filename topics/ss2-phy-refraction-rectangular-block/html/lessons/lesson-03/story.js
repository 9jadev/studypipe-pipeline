/* Lesson 03 · 3D story beats: Zainab, Kelechi & Dr Kunle investigating why a patient chart under a 6.0 cm glass block appears raised by 2.0 cm */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildDepthProp(labelText, isMultiLayer, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#2d3748", 0.65);

    var pad = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.05, 0.36), wood);
    pad.position.set(0, 0.025, 0);
    g.add(pad);

    // Bottom real coin/chart marker (amber)
    var realCoin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.02, 20),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.45 })
    );
    realCoin.position.set(0, 0.06, 0);
    g.add(realCoin);

    // Raised virtual image marker (cyan glowing disc at 2/3 height)
    var virtCoin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.02, 20),
      new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9c7e, emissiveIntensity: 0.85 })
    );
    virtCoin.position.set(0, 0.16, 0);
    g.add(virtCoin);
    g.userData.virtMat = virtCoin.material;

    // Glass slab(s)
    var slab1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, isMultiLayer ? 0.14 : 0.24, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.36, roughness: 0.14 })
    );
    slab1.position.set(0, isMultiLayer ? 0.12 : 0.17, 0);
    g.add(slab1);

    if (isMultiLayer) {
      var slab2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.14, 0.28),
        new THREE.MeshStandardMaterial({ color: 0x818cf8, transparent: true, opacity: 0.34, roughness: 0.14 })
      );
      slab2.position.set(0, 0.26, 0);
      g.add(slab2);
    }

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
      caption: "Surulere Optometry Clinic: The Floating Eye-Chart Puzzle!",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Dr Kunle! When you place this 6.0 cm glass paperweight over the printed calibration letters, the letters look as if they are floating 2.0 cm above the table!",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Kelechi confuses upward shift d_v with apparent depth A.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — if the letters appear raised by 2.0 cm under a 6.0 cm block, does that mean the apparent depth A is 2.0 cm, so n = 6.0 / 2.0 = 3.0?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Dr Kunle busts the #1 WAEC Real/Apparent Depth trap!",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Careful, Kelechi! 'Appears raised by 2.0 cm' is the upward vertical shift d_v = 2.0 cm! Apparent depth from the top surface is A = R − d_v = 6.0 − 2.0 = 4.0 cm, so n = R / A = 6.0 / 4.0 = 1.50!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Rig A (Single 6 cm Glass Block) vs Rig B (Layered Glass + Water).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Look at Rig A and Rig B: rays leaving the bottom bend AWAY from the normal into air, so our eyes trace them back to virtual image I at A = R / n — and for multiple layers, we simply add t₁/n₁ + t₂/n₂!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "How do we measure apparent depth without a travelling microscope?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "In the school lab, we clamp a search pin on a retort stand beside the block and adjust its height until there is NO PARALLAX between the search pin and the virtual image when we sway our head!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the SS2 Physics Lab with Mrs Adebayo…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's test five glass thicknesses from 3.0 cm to 15.0 cm on our 3D No-Parallax Bench, align the search pin, and plot Real Depth R against Apparent Depth A!",
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
      var mSign = StoryStage.sign("SURULERE CLINIC · APPARENT DEPTH LAB", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("WAEC NO-PARALLAX OPTICS BENCH", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var rigA = buildDepthProp("Rig A · R=6 cm, A=4 cm, d_v=2 cm", false, "rgba(13,156,126,0.95)");
      rigA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(rigA);
      api.props.clockA = rigA;
      api.props.bottleA = rigA;

      var rigB = buildDepthProp("Rig B · Layered A = Σ(t_i/n_i)", true, "rgba(59,108,246,0.95)");
      rigB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(rigB);
      api.props.clockB = rigB;
      api.props.bottleB = rigB;
    },
    onTick: function (api, dt, t) {
      if (api.props.clockA && api.props.clockA.userData.virtMat) {
        api.props.clockA.userData.virtMat.emissiveIntensity = 0.7 + 0.3 * Math.sin(t * 4);
      }
      if (api.props.clockB && api.props.clockB.userData.virtMat) {
        api.props.clockB.userData.virtMat.emissiveIntensity = 0.7 + 0.3 * Math.cos(t * 4);
      }
    }
  });
})();
