/* Lesson 01 · 3D story beats: Mama Titi at Mile 12 Market & Dr. Kunle at Yaba Diagnostic Lab — Discovery of the Cell & Prokaryotes vs Eukaryotes */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildCorkAndScopeProp(labelText, isScope, tagBg) {
    var g = new THREE.Group();
    if (isScope && window.CellKit) {
      var sc = window.CellKit.microscope({ scale: 0.48 });
      g.add(sc.group);
    } else {
      var corkMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.78 });
      var hex = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.26, 6), corkMat);
      hex.position.y = 0.13;
      g.add(hex);
      var rim = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 6), new THREE.MeshStandardMaterial({ color: 0xfef08a, wireframe: true }));
      rim.position.y = 0.26;
      g.add(rim);
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
      caption: "Mile 12 Market, Lagos. Tunde inspects Mama Titi's crisp ugu leaves and purple onion bulbs.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Mama Titi! How can a tiny onion bulb, a giant iroko tree, and a human being all be built from microscopic units we cannot even see with our naked eyes?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Bystander recalls Robert Hooke's 1665 bottle-cork observation.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — when Robert Hooke looked at bottle cork in 1665 and called the little boxes 'cells', wasn't he looking at living cells?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Mama Titi explains the difference between dead cork walls and living protoplasm.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5,
      who: "ngozi",
      text: "Aha! Bottle cork is dead bark! Hooke saw only empty cell walls. It took Leeuwenhoek, Dujardin, and Purkinje to show that a living cell is filled with jelly-like protoplasm!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Schleiden (1838), Schwann (1839) & Virchow (1855) build the classical Cell Theory.",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Schleiden proved all plants are made of cells, Schwann proved all animals are made of cells, and Virchow added 'Omnis cellula e cellula' — every cell comes from a pre-existing cell!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "What about bacteria in pond water and viruses?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Bacteria are tiny prokaryotic cells with naked circular DNA and 70S ribosomes, while plants and animals are eukaryotic with a true nucleus — and viruses aren't even cells at all!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Yaba Microscopy Lab with Dr. Kunle…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to the compound microscope! Let's switch objective lenses from ×4 to ×40, measure our onion cell image I in millimetres, and verify M = I ÷ A!",
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
      var mSign = StoryStage.sign("MAMA TITI FRESH PRODUCE · MILE 12", "rgba(13,156,126,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("YABA CYTOLOGY & MICROSCOPY LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildCorkAndScopeProp("Hooke's Cork (Dead Walls)", false, "rgba(217,138,0,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildCorkAndScopeProp("Compound Microscope (M = I/A)", true, "rgba(13,156,126,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
