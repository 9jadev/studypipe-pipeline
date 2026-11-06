/* Lesson 02 · 3D story beats: Tunde, Amaka & Dr Bamidele at LUTH Echocardiogram & Dissection Clinic — Structure of the Mammalian Heart & Double-Circulation Pathway */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildHeartProp(labelText, isValve, tagBg) {
    var g = new THREE.Group();
    if (isValve && window.HeartKit) {
      var v = window.HeartKit.valve({ open: 0.65, scale: 0.46 });
      v.position.y = 0.28;
      g.add(v);
    } else if (window.HeartKit) {
      var h = window.HeartKit.heart({ bpm: 72, cutaway: true, mode: "both", scale: 0.44 });
      h.position.y = 0.28;
      g.add(h);
    }
    var tag = StoryStage.sign(labelText, tagBg || "rgba(225,29,72,0.95)", "#fff", 0.16);
    tag.position.set(0, isValve ? 1.02 : 0.6, 0.05);
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
      caption: "LUTH Sports Medicine Reception, Idi-Araba. Tunde and Amaka examine a 3D longitudinal section of a mammalian heart.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Look at my echocardiogram printout, Amaka! Why is the muscular wall of my left ventricle 15 millimetres thick while my right ventricle is only 5 millimetres thick?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Amaka wonders if the thicker left ventricle pumps three times more volume per beat.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — does a 3-times thicker wall mean the left ventricle pumps three times more blood per beat than the right ventricle?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Nurse Chidinma busts the volume myth: both ventricles pump the exact same 70 mL stroke volume!",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Never fall for that WAEC trap! Both ventricles eject the exact same 70 mL stroke volume! The left wall is 3× thicker because it needs 120 mmHg pressure to reach your brain and toes!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Inspecting the Tricuspid (right, 3 flaps) and Bicuspid/Mitral (left, 2 flaps) valves and chordae tendineae.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "And look at those tough collagen 'heart strings' — chordae tendineae anchored to papillary muscles stop the tricuspid and bicuspid valves from flipping inside out into the atria!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "The Pulmonary Artery & Pulmonary Vein oxygen exception.",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Remember: every artery goes AWAY from the heart and every vein comes TOWARDS the heart — so the pulmonary artery carries deoxygenated blood and the pulmonary vein carries oxygenated blood!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "Inside the LUTH Dissection Lab with Dr Bamidele…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to our 3D Heart Dissector Bench! Let's measure chamber wall thickness w from 1.5 mm to 15 mm and trace a red blood cell through all four chambers and four valves!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Nurse Chidinma",
      cust1: "Tunde (Sprinter)",
      cust2: "Amaka (SS2 Student)",
      amaka: "Dr Bamidele (Cardiologist)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("LUTH CARDIAC ECHO & SPECIMEN DESK", "rgba(225,29,72,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("LUTH 3D HEART DISSECTION LAB", "rgba(37,99,235,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildHeartProp("Cut-Away 4-Chamber Heart", false, "rgba(225,29,72,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildHeartProp("AV Valve & Chordae Tendineae", true, "rgba(13,156,126,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
