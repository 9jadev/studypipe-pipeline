/* Lesson 04 · 3D story beats: Tunde, Amaka, Nurse Chidinma & Dr Bamidele at LUTH Vascular & Lymphatic Clinic — Blood Vessels, Capillary Exchange, Lymph & Oedema */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildVesselProp(labelText, isCapBed, tagBg) {
    var g = new THREE.Group();
    if (isCapBed && window.HeartKit) {
      var cb = window.HeartKit.capillaryBed({ scale: 0.44, labels: false });
      cb.position.y = 0.28;
      g.add(cb);
    } else if (window.HeartKit) {
      var vs = window.HeartKit.vessels({ scale: 0.44, labels: false });
      vs.position.y = 0.28;
      g.add(vs);
    }
    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, isCapBed ? 1.02 : 0.6, 0.05);
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
      caption: "LUTH Vascular Clinic, Idi-Araba. Tunde looks at the prominent blue veins on his lower leg after his sprint.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Dr Bamidele, if blood pressure in my aorta is 120 mmHg but drops below 10 mmHg by the time blood reaches my ankle veins, how does blood climb a full metre uphill back to my heart?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Amaka compares the thick elastic wall of an artery with the wide lumen and pocket valves of a vein.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Look at the cross-sections: arteries have thick muscular and elastic walls with a narrow lumen, while veins have thin walls, a wide lumen, and semilunar pocket valves!",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Nurse Chidinma explains the Skeletal Muscle Pump & Venous Pocket Valves.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Exactly! Every time your calf muscles contract, they squeeze the thin-walled veins and push blood upward — and when the muscle relaxes, the pocket valves snap shut so blood cannot fall back!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "How blood exchanges oxygen and glucose with cells across one-cell-thick capillaries (Ultrafiltration).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "In the capillary bed, hydrostatic pressure P_c = 35 mmHg beats osmotic pull π_c = 25 mmHg at the arterial end (+10 mmHg), forcing water, glucose, and O₂ out as tissue fluid — leaving RBCs and albumin behind!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Venous reabsorption (−10 mmHg), lymphatic return (3 L/day), elephantiasis & kwashiorkor oedema.",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "At the venous end, P_c drops to 15 mmHg so −10 mmHg pulls 85% back in, while 15% drains into green lymph vessels! If filarial worms block lymphatics, elephantiasis oedema results!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the 3D Starling Capillary & Vessel Bench with Dr Bamidele…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to our 3D Capillary & Vessel Bench! Let's measure hydrostatic pressure P_c from 0% to 100% along the capillary bed and plot Net Filtration Pressure NFP = P_c − π_c!",
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
      var mSign = StoryStage.sign("LUTH VASCULAR & LYMPHATIC CLINIC", "rgba(13,156,126,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("LUTH 3D CAPILLARY FILTRATION LAB", "rgba(37,99,235,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildVesselProp("Artery vs Vein vs Capillary", false, "rgba(225,29,72,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildVesselProp("Starling Capillary & Lymph Bed", true, "rgba(22,163,74,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
