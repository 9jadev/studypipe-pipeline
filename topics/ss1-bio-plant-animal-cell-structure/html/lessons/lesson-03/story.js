/* Lesson 03 · 3D story beats: Ogun River Pond Water & Onion Bulb at Mile 12 Market → 3D Protist & SA/V Lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildSafariProp(labelText, kind, tagBg) {
    var g = new THREE.Group();
    if (window.CellKit) {
      var pr = CellKit.protist({ type: kind, scale: 0.44 });
      pr.group.position.y = 0.28;
      g.add(pr.group);
    }
    var tag = StoryStage.sign(labelText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, 0.68, 0.05);
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
      caption: "Ogun River bank near Mile 12 Market. Tunde scoops green pond water and holds an onion bulb.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Mama Titi! In this jar of green Ogun River water, single cells swim on their own — so why do humans and onion plants need millions of cells arranged into tissues and organs?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Alhaji Musa calls the whole onion bulb a 'plant tissue'.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "And look at this purple onion bulb on the table — isn't an onion bulb just a single storage tissue?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Mama Titi explains the 4 forms of living cells and why an onion bulb is an ORGAN!",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5.2,
      who: "ngozi",
      text: "Careful! The peeling skin is an epidermal tissue, but the whole onion bulb combines epidermis, storage parenchyma, xylem, and phloem — so an onion bulb is a complete ORGAN!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Four forms of living cells: Free-Living (Euglena), Colony (Volvox), Filament (Spirogyra), and Tissue/Organ.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "And in your pond jar live the other three forms: single free-living Euglena and Amoeba, spherical Volvox colonies, and unbranched Spirogyra filaments!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "Why can't a single Amoeba grow as large as a catfish?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "As a cell grows bigger, its volume L³ grows much faster than its surface area 6L² — so its surface-area-to-volume ratio 6 over L plummets and simple diffusion can no longer feed its centre!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Yaba Microscopy Lab with Dr. Kunle…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's inspect the 3D pond protists on the bench and test how surface-area-to-volume ratio SA ÷ V = 6 ÷ L changes across five cube sizes!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Mama Titi",
      cust1: "Tunde (SS1 Student)",
      cust2: "Alhaji Musa",
      amaka: "Dr. Kunle (Yaba Lab)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("OGUN RIVER POND SAFARI · MILE 12", "rgba(13,156,126,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("YABA CELL FORMS & SA/V LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildSafariProp("Volvox (Hollow Colony)", "volvox", "rgba(34,197,94,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildSafariProp("Spirogyra (Filament)", "spirogyra", "rgba(13,156,126,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
