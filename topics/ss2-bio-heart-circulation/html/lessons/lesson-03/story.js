/* Lesson 03 · 3D story beats: Tunde, Amaka, Nurse Chidinma & Dr Bamidele at LUTH ECG & Blood Pressure Bay — Cardiac Cycle, Myogenic Pacemaker, Lub-Dub Sounds & Blood Pressure */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildPaceProp(labelText, isValve, tagBg) {
    var g = new THREE.Group();
    if (isValve && window.HeartKit) {
      var v = window.HeartKit.valve({ open: 0.2, scale: 0.46 });
      v.position.y = 0.28;
      g.add(v);
    } else if (window.HeartKit) {
      var h = window.HeartKit.heart({ bpm: 75, cutaway: true, mode: "pace", scale: 0.44 });
      h.position.y = 0.28;
      g.add(h);
    }
    var tag = StoryStage.sign(labelText, tagBg || "rgba(217,138,0,0.95)", "#fff", 0.16);
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
      caption: "LUTH ECG & Haemodynamics Bay, Idi-Araba. Tunde listens to his own chest with Dr Bamidele's stethoscope.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "LUB-DUB… LUB-DUB! Nurse Chidinma, I can hear two clear beats every 0.8 second — what inside my chest is making that 'Lub-Dub' sound, and what tells my heart when to beat?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Amaka asks whether the brain sends a nerve signal for every single heartbeat.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — if a surgeon disconnects all nerves to a donor heart during a transplant, why does the heart keep beating in a dish of warm oxygenated Ringer's solution?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Nurse Chidinma explains the Myogenic Pacemaker (Sinoatrial Node, SAN).",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Because cardiac muscle is MYOGENIC! The Sinoatrial Node (SAN) in the upper right atrium generates its own electrical wave — SAN → Atria → AVN (0.1 s delay) → Bundle of His → Purkinje fibres!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Decoding 'LUB' (AV valves close) vs 'DUB' (Semilunar valves close).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "And the sounds come from valve doors slamming shut! 'LUB' is the bicuspid and tricuspid valves snapping shut as ventricular systole begins; 'DUB' is the semilunar valves snapping shut as diastole begins!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Measuring brachial blood pressure (120/80 mmHg) with a sphygmomanometer.",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "With the sphygmomanometer cuff on Tunde's upper arm, we read 120 over 80 mmHg: 120 is systolic contraction pressure, 80 is diastolic relaxation pressure, and the 40 mmHg difference is Pulse Pressure!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the 3D Pacemaker & Cardiac Cycle Bench with Dr Bamidele…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to the 3D Cardiac Cycle Bench! Let's step heart rate from 60 to 150 bpm, watch the golden SAN-to-Purkinje wave, and plot Cardiac Output CO = HR × SV!",
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
      var mSign = StoryStage.sign("LUTH ECG, STETHOSCOPE & BP CLINIC", "rgba(217,138,0,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("LUTH 3D PACEMAKER & HAEMODYNAMICS LAB", "rgba(13,156,126,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildPaceProp("SAN → AVN → Purkinje Wave", false, "rgba(217,138,0,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildPaceProp("LUB (AV) & DUB (Semilunar)", true, "rgba(225,29,72,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
