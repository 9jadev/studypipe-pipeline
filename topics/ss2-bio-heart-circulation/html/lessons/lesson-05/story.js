/* Lesson 05 · 3D story beats: Tunde, Amaka, Nurse Chidinma & Dr Bamidele at LUTH Haematology Lab & WAEC Paper 3 Practical Hall — Blood Cells, Clotting, ABO Groups & Dissection */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildHaemProp(labelText, isHeart, tagBg) {
    var g = new THREE.Group();
    if (isHeart && window.HeartKit) {
      var ht = window.HeartKit.heart({ scale: 0.44, mode: "dissect" });
      ht.position.y = 0.28;
      g.add(ht);
    } else if (window.HeartKit) {
      var sm = window.HeartKit.bloodSmear({ scale: 0.44, clot: true, labels: false });
      sm.position.y = 0.28;
      g.add(sm);
    }
    var tag = StoryStage.sign(labelText, tagBg || "rgba(225,29,72,0.95)", "#fff", 0.16);
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
      caption: "LUTH Haematology Lab & Blood Bank, Idi-Araba. Nurse Chidinma holds up a centrifuged tube of mammalian blood.",
      shot: WIDE, instant: true, hold: 5,
      who: "ngozi",
      text: "Welcome to our final station! When whole blood is spun in a centrifuge, 55% rises as straw-coloured liquid plasma and 45% settles as cellular elements — erythrocytes, leucocytes, and platelets!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Tunde inspects the biconcave red blood cells and nucleated white blood cells on the 3D microscope smear.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust1",
      text: "Look! Mature mammalian red blood cells are biconcave discs with NO nucleus so they can pack millions of haemoglobin molecules — while phagocytes have lobed nuclei and lymphocytes make antibodies!",
      run: function (w) { reset(w); w.people.cust1.set("point"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Amaka traces the 4-Step Enzymatic Blood Clotting Cascade over a cut vessel.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5.5,
      who: "cust2",
      text: "And when a vessel is cut, ruptured platelets release thromboplastin! With calcium ions (Ca²⁺) and hepatic Vitamin K, prothrombin becomes thrombin, which turns soluble fibrinogen into an insoluble fibrin mesh!",
      run: function (w) { reset(w); w.people.cust2.set("talk"); }
    },
    {
      caption: "Nurse Chidinma demonstrates ABO & Rhesus cross-matching at the LUTH Blood Bank.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Never let donor RBC antigens meet matching recipient plasma antibodies, or fatal agglutination occurs! Group O⁻ lacks A, B, and Rh-D antigens (Universal Donor); Group AB⁺ lacks anti-A and anti-B antibodies (Universal Recipient)!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "WAEC Paper 3 Mammalian Heart Dissection & 9 Chief Examiner Drawing Rules.",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5.5,
      who: "cust2",
      text: "For WAEC Paper 3, we orient the goat heart by the diagonal coronary groove, pinch the 3× thicker left ventricle, and draw our 80 mm specimen at 120 mm for M = 120 ÷ 80 = ×1.5 magnification with zero shading!",
      run: function (w) { reset(w); w.people.cust2.set("point"); }
    },
    {
      caption: "At the 3D Haematology, Fibrin Clot & Paper 3 Bench with Dr Bamidele…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to our 3D Haematology & Paper 3 Bench! Let's test haemoglobin concentrations from 8.0 to 18.0 g/100 mL, plot oxygen capacity C_O2 = 1.34 × [Hb], and calculate Paper 3 magnification!",
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
      var mSign = StoryStage.sign("LUTH HAEMATOLOGY & BLOOD BANK", "rgba(225,29,72,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("WAEC PAPER 3 HEART DISSECTION LAB", "rgba(13,156,126,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildHaemProp("Blood Smear & Fibrin Clot", false, "rgba(225,29,72,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildHaemProp("WAEC Paper 3 Heart (80 mm)", true, "rgba(37,99,235,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
