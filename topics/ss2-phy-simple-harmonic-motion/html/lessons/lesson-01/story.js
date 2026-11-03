/* Lesson 01 · 3D story beats: the slow school clock at Yaba Market & UNILAG Metrology Lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildClockProp(labelText, rodLen, tagBg) {
    var g = new THREE.Group();
    var wood = StoryStage.std("#4a2c18", 0.65);
    var brass = new THREE.MeshStandardMaterial({ color: 0xffb23f, roughness: 0.25, metalness: 0.85 });
    var faceMat = StoryStage.std("#fffaf2", 0.4);

    // Tall wooden regulator case on the table
    var back = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.82, 0.06), wood);
    back.position.set(0, 0.42, -0.05);
    g.add(back);
    var topCap = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.06, 0.16), wood);
    topCap.position.set(0, 0.84, 0);
    g.add(topCap);
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.05, 0.18), wood);
    base.position.set(0, 0.025, 0);
    g.add(base);

    // Clock dial
    var dial = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24), faceMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, 0.68, 0.02);
    g.add(dial);

    // Swinging pendulum pivot
    var pivot = new THREE.Group();
    pivot.position.set(0, 0.54, 0.03);
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, rodLen, 10), brass);
    rod.position.y = -rodLen / 2;
    pivot.add(rod);
    var bob = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.025, 24), brass);
    bob.rotation.x = Math.PI / 2;
    bob.position.y = -rodLen;
    pivot.add(bob);
    g.add(pivot);
    g.userData.pivot = pivot;

    // Label sprite above clock
    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, 1.02, 0.05);
    g.add(tag);
    g.userData.tag = tag;
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
      caption: "Yaba Market, Lagos. Mama Ngozi's school-clock & instrument stall.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Mama! This regulator wall clock we bought for our school assembly hall loses eight minutes every single hour!",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Mrs Adeyemi blames the weight of the brass bob.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "I told them! The brass bob is too light. Tie a heavier lead weight on it so gravity pulls it faster!",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Mama Ngozi wonders if the starting angle is the culprit.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 4.8,
      who: "ngozi",
      text: "Ah-ah! Or maybe you didn't pull the pendulum wide enough when starting it? Both clocks came from the same workshop!",
      run: function (w) { reset(w); w.people.ngozi.set("sad"); }
    },
    {
      caption: "Clock A (accurate, L = 0.99 m) and Clock B (slow, L = 1.15 m) side by side on the stall.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Look closely at Clock A and Clock B. Same brass bob, yet Clock B swings noticeably slower!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Three suspects: bob mass, starting angle, or pendulum length?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Is it the weight of the bob, the starting angle, or the position of the nut on the rod? How can we be sure?",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "Across town, at the UNILAG Metrology & Physics Laboratory…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Don't guess! Put a pendulum on the retort stand, time twenty swings, and let the data speak!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Mama Ngozi",
      cust1: "Kunle (School Prefect)",
      cust2: "Mrs Adeyemi",
      amaka: "Dr Amaka (Physics Lab)"
    },
    setup: function (api) {
      // Customize market and lab signs for Physics
      var mSign = StoryStage.sign("YABA CLOCK & INSTRUMENT STALL · LAGOS", "rgba(13,156,126,0.95)", "#fff", 0.48);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("UNILAG METROLOGY & PHYSICS LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      // Replace bottles A & B with two animated 3D Regulator Clocks A & B
      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var clockA = buildClockProp("Clock A · 2.00 s", 0.34, "rgba(13,156,126,0.95)");
      clockA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(clockA);
      api.props.clockA = clockA;
      api.props.bottleA = clockA;

      var clockB = buildClockProp("Clock B · Slow!", 0.42, "rgba(200,38,74,0.95)");
      clockB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(clockB);
      api.props.clockB = clockB;
      api.props.bottleB = clockB;
    },
    onTick: function (api, dt, t) {
      if (api.props.clockA && api.props.clockA.userData.pivot) {
        api.props.clockA.userData.pivot.rotation.z = 0.24 * Math.sin(t * Math.PI);
      }
      if (api.props.clockB && api.props.clockB.userData.pivot) {
        api.props.clockB.userData.pivot.rotation.z = 0.24 * Math.sin(t * (Math.PI / 1.08));
      }
    }
  });
})();
