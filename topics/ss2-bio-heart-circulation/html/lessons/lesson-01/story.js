/* Lesson 01 · 3D story beats: Tunde, Amaka & Coach Musa at Surulere National Stadium → Dr Bamidele at LUTH Cardiac Lab — Need for Transport, Open vs Closed & Single vs Double Circulation */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildTransportProp(labelText, isHeart, tagBg) {
    var g = new THREE.Group();
    if (isHeart && window.HeartKit) {
      var h = window.HeartKit.heart({ bpm: 84, cutaway: false, mode: "both", scale: 0.44 });
      h.position.y = 0.28;
      g.add(h);
    } else if (window.HeartKit) {
      var c = window.HeartKit.cube({ size: 0.28, split: 2, spread: 0.14 });
      c.position.y = 0.24;
      g.add(c);
    }
    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, isHeart ? 1.02 : 0.6, 0.05);
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
      caption: "Surulere National Stadium, Lagos. Tunde finishes a blistering 400 m sprint as his heart pounds at 150 bpm.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Coach Musa! My heart is hammering at 150 beats per minute after that 400 m race — why can't oxygen just diffuse straight through my skin into my leg muscles like it does in a pond Amoeba?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Amaka points out the Surface-Area-to-Volume (SA/V = 6/L) mathematical trap.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Think about SA/V = 6 ÷ L, Tunde! As an organism grows 1,000 times wider, its volume grows a billion-fold while its surface area grows only a million-fold — simple diffusion is way too slow!",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Coach Musa asks why a cockroach scurrying by the track doesn't have red blood or arteries.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Aha! Look at that cockroach by the stadium bench — if you crush an insect, no red blood spurts out! It has an open circulatory system with colourless haemolymph in a haemocoel!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Why insect haemolymph does NOT transport oxygen.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Even better for WAEC: cockroach haemolymph has no haemoglobin and carries zero oxygen! Instead, air tubes called tracheae and tracheoles pipe oxygen straight to its flight muscles.",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Comparing Tilapia (2 chambers), Toad (3 chambers), and Mammals/Crocodiles (4 chambers).",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Vertebrates use closed vessels! A tilapia fish has a 2-chamber heart (single circulation), a toad has 3 chambers, and birds, mammals, and crocodiles have a 4-chamber double pump!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the LUTH Cardiovascular Lab with Dr Bamidele…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Welcome to LUTH! Step up to our 3D SA/V Cube & Circulation Bench — let's measure how SA/V = 6 ÷ L drops from L = 0.2 mm to 10 mm and see why double circulation wins!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Coach Musa",
      cust1: "Tunde (400 m Sprinter)",
      cust2: "Amaka (SS2 Student)",
      amaka: "Dr Bamidele (LUTH)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("SURULERE NATIONAL STADIUM · TRACK SIDE", "rgba(225,29,72,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("LUTH CARDIOVASCULAR & TRANSPORT LAB", "rgba(37,99,235,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildTransportProp("SA/V Cube (6 ÷ L)", false, "rgba(217,138,0,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildTransportProp("4-Chamber Double Pump", true, "rgba(225,29,72,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
