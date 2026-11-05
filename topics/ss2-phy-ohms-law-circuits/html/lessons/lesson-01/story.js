/* Lesson 01 · 3D story beats: Kelechi & Chinedu at the Aba Workshop testing thick copper vs thin constantan wires */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildWireRigProp(labelText, wireRadius, wireColor, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#3b2618", 0.68);
    var brass = new THREE.MeshStandardMaterial({ color: 0xffb23f, roughness: 0.25, metalness: 0.85 });
    var wireMat = new THREE.MeshStandardMaterial({ color: wireColor, roughness: 0.3, metalness: 0.75 });

    // Wooden test board
    var board = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.06, 0.24), wood);
    board.position.set(0, 0.03, 0);
    g.add(board);

    // Two brass terminal posts
    var postL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 16), brass);
    postL.position.set(-0.18, 0.14, 0);
    var postR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 16), brass);
    postR.position.set(0.18, 0.14, 0);
    g.add(postL, postR);

    // Test wire stretched between posts
    var wire = new THREE.Mesh(new THREE.CylinderGeometry(wireRadius, wireRadius, 0.36, 16), wireMat);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0, 0.20, 0);
    g.add(wire);

    // Indicator lamp dome
    var bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: wireRadius > 0.015 ? 0xf59e0b : 0x78350f,
      emissiveIntensity: wireRadius > 0.015 ? 0.9 : 0.25,
      roughness: 0.2
    });
    var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 16), bulbMat);
    bulb.position.set(0, 0.34, 0);
    g.add(bulb);
    g.userData.bulbMat = bulbMat;
    g.userData.isThick = wireRadius > 0.015;

    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, 0.62, 0.05);
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
      caption: "Ngwa Road, Aba. Chinedu's Auto-Electric & Garment Workshop.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Oga Chinedu! Why did the thin jumper wire get red-hot and barely crank the machine, while the thick copper cable spun it immediately?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Bystander blames the battery voltage alone.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Both cables are one metre long and connected to the same 2-volt test cell! Shouldn't any one-metre metal wire carry the exact same current?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Chinedu points to the wire thickness and alloy material.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 4.8,
      who: "ngozi",
      text: "Not at all! Even at the same voltage V, current I depends on the electrical resistance R of the wire — and thickness changes everything.",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Rig A (Thick Copper · Low R) vs Rig B (Thin Constantan · High R) on the bench.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Look at Rig A and Rig B side by side: doubling the diameter quadruples the cross-sectional area and slashes resistance to one-quarter!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "What happens if we leave the current running and the wire heats up?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "And watch out: if you leave the key closed so the wire gets hot, its resistance rises and the V-against-I graph stops being a straight line!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Physics Laboratory with Engr. Nkechi…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's wire the WAEC Ohm's law circuit — ammeter in series, voltmeter in parallel, rheostat and plug key — and plot V against I!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Oga Chinedu",
      cust1: "Kelechi (Apprentice)",
      cust2: "Papa Nnamdi",
      amaka: "Engr. Nkechi (Physics Lab)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("CHINEDU AUTO-ELECTRIC WORKSHOP · ABA", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("WAEC ELECTRICITY PRACTICAL LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var rigA = buildWireRigProp("Rig A · Thick (0.5 Ω)", 0.024, 0xd97706, "rgba(13,156,126,0.95)");
      rigA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(rigA);
      api.props.clockA = rigA;
      api.props.bottleA = rigA;

      var rigB = buildWireRigProp("Rig B · Thin (4.0 Ω)", 0.008, 0x94a3b8, "rgba(200,38,74,0.95)");
      rigB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(rigB);
      api.props.clockB = rigB;
      api.props.bottleB = rigB;
    },
    onTick: function (api, dt, t) {
      if (api.props.clockA && api.props.clockA.userData.bulbMat) {
        api.props.clockA.userData.bulbMat.emissiveIntensity = 0.8 + 0.25 * Math.sin(t * 4);
      }
      if (api.props.clockB && api.props.clockB.userData.bulbMat) {
        api.props.clockB.userData.bulbMat.emissiveIntensity = 0.22 + 0.06 * Math.sin(t * 4);
      }
    }
  });
})();
