/* Lesson 04 · 3D story beats: Zainab, Kelechi & Tunde at the Yaba Fibre-Optic Splice Hub testing Critical Angle c = 41.8° and TIR */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildFibreProp(labelText, isTIR, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#1e293b", 0.6);
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.38,
      roughness: 0.14
    });

    var pad = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.05, 0.34), wood);
    pad.position.set(0, 0.025, 0);
    g.add(pad);

    var core = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.48, 20), glassMat);
    core.rotation.z = Math.PI / 2;
    core.position.set(0, 0.18, 0);
    g.add(core);

    var rayMat = new THREE.MeshStandardMaterial({
      color: isTIR ? 0x10b981 : 0xf59e0b,
      emissive: isTIR ? 0x10b981 : 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    var ray1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24, 12), rayMat);
    ray1.rotation.z = 1.05;
    ray1.position.set(-0.10, 0.18, 0);
    var ray2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24, 12), rayMat);
    ray2.rotation.z = isTIR ? -1.05 : 1.35;
    ray2.position.set(0.10, isTIR ? 0.18 : 0.28, 0);
    g.add(ray1, ray2);
    g.userData.rayMat = rayMat;

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
      caption: "Yaba Tech Corridor, Lagos: Tunde's Fibre-Optic Splice Hub.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Broda Tunde! Why did the laser beam inside this crown-glass block suddenly refuse to exit into the air when you tilted it past 41.8 degrees, bouncing off the clear top surface like a mirror?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Kelechi wonders if any ray at 45° will reflect totally — even from air into glass.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Does that mean if I shine a torch from air into a glass window at 45 degrees, it will also undergo Total Internal Reflection?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Tunde states the TWO mandatory conditions for Total Internal Reflection.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Never from air into glass! Total Internal Reflection requires TWO strict conditions: light must travel from an optically denser to a less dense medium, AND angle i must exceed the critical angle c!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Rig A (i = c = 41.8° · Grazing 90°) vs Rig B (i = 45° > c · 100% TIR).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Look at Rig A and Rig B: at the critical angle c (sin c = 1/n = 1/1.50), the refracted ray grazes the surface at r = 90°. Beyond 41.8°, 100% of the light reflects internally!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Why Yaba optical fibres use n_core > n_cladding and periscopes use 45° prisms.",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "That's how our Yaba internet fibres carry gigabits of data using a high-index core inside a lower-index cladding — and why 45° glass prisms beat silvered mirrors without ghost images!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the SS2 Physics Lab with Mrs Adebayo…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's sweep our internal laser from 20° to 60° on the 3D Critical Angle & Optical Fibre Bench and observe all three regimes: i < c, i = c, and i > c!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Engr. Tunde (Fibre Hub)",
      cust1: "Zainab (SS2 Student)",
      cust2: "Kelechi (Classmate)",
      amaka: "Mrs Adebayo (Physics Lab)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("YABA FIBRE-OPTIC SPLICE & TIR HUB", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("WAEC CRITICAL ANGLE & PRISM LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var rigA = buildFibreProp("Rig A · Critical c=41.8° (r=90°)", false, "rgba(217,119,6,0.95)");
      rigA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(rigA);
      api.props.clockA = rigA;
      api.props.bottleA = rigA;

      var rigB = buildFibreProp("Rig B · TIR (i=45° > c, 100% Refl)", true, "rgba(13,156,126,0.95)");
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
