/* Lesson 02 · 3D story beats: Mama Titi's Ugu Leaf vs Catfish Fillet at Mile 12 Market & Organelle Dissection at Yaba Lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildCellModelProp(labelText, isPlant, tagBg) {
    var g = new THREE.Group();
    if (window.CellKit) {
      var model = isPlant ? CellKit.plantCell({ scale: 0.34 }) : CellKit.animalCell({ scale: 0.36 });
      model.group.position.y = 0.28;
      g.add(model.group);
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
      caption: "Mile 12 Market, Lagos. Tunde compares a stiff green ugu leaf with a soft catfish fillet.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Mama Titi! Why does a green ugu leaf stand firm and make its own sugar in sunlight, while a catfish muscle cell is soft, flexible, and must eat food to survive?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Alhaji Musa wonders if plant cells have chloroplasts INSTEAD of mitochondria.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — don't plant cells have chloroplasts for energy while animal cells have mitochondria instead?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Mama Titi corrects the #1 WAEC misconception!",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5.2,
      who: "ngozi",
      text: "Careful! That is a classic exam trap! Plant cells have BOTH chloroplasts AND mitochondria — chloroplasts make glucose in sunlight, and mitochondria burn that glucose into ATP day and night!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Plant Cell (Cellulose Wall, Chloroplasts, Sap Vacuole) vs Animal Cell (Flexible Membrane, Centrioles, Lysosomes).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Look at the 3D models: the plant cell has a rigid cellulose wall, green chloroplasts, and a giant sap vacuole that pushes the nucleus to the side!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "How do organelles cooperate like a factory inside the cell?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Inside both cells, the nucleus sends mRNA to 80S ribosomes on the Rough ER, and the Golgi body packages the finished proteins into vesicles!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Yaba Cytology Lab with Dr. Kunle…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's dissect our 3D plant and animal cells on the bench and measure how mitochondrial cristae surface area drives ATP production across five tissues!",
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
      var mSign = StoryStage.sign("UGU LEAF vs CATFISH · MILE 12", "rgba(13,156,126,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("YABA EUKARYOTIC ORGANELLE LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildCellModelProp("Plant Cell (Wall + Vacuole)", true, "rgba(34,197,94,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildCellModelProp("Animal Cell (Centrioles)", false, "rgba(244,63,94,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
