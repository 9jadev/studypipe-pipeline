/* Lesson 04 · 3D story beats: Mama Titi's Crisp Ugu Leaf, Raw Yam & Salted Fish at Mile 12 → 3D Osmosis & Haemolysis Lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildOsmosisProp(labelText, isPlant, tagBg) {
    var g = new THREE.Group();
    if (window.CellKit) {
      if (isPlant) {
        var pc = CellKit.plantCell({ scale: 0.34 });
        pc.group.position.y = 0.28;
        g.add(pc.group);
      } else {
        var rbc = CellKit.rbc({ scale: 0.38 });
        rbc.group.position.y = 0.28;
        g.add(rbc.group);
      }
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
      caption: "Mile 12 Market, Lagos. Mama Titi splashes fresh water on wilted ugu leaves and salts Tilapia fish.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Mama Titi! Look! The wilted ugu leaves you sprinkled with fresh water stood up crisp and firm in 20 minutes, while the salted fish shrivelled up!",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Alhaji Musa asks why hospital nurses never inject pure water into a patient's vein.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — if pure water makes wilted ugu leaves firm and healthy, why would pure water burst human red blood cells if injected in a hospital drip?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Mama Titi explains Endosmosis, Turgor Pressure, and Haemolysis!",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5.2,
      who: "ngozi",
      text: "Because plant cells have a rigid cellulose cell wall! When water enters the ugu vacuole by osmosis, the cellulose wall pushes back with wall pressure so it becomes turgid without bursting!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Plant Cell (Turgid vs Plasmolysed) vs Red Blood Cell (Haemolysed vs Crenated).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "A red blood cell has NO cell wall — so in pure water it swells and bursts by haemolysis! That is why hospital IV drips use isotonic 0.9% normal saline!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "What about strong salt brine and boiled yam?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "In strong salt brine, water leaves cells by exosmosis, plasmolysing plant cells and spoilage bacteria! And if you boil a yam, heat destroys its living membranes so osmosis stops!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Yaba Lab with Dr. Kunle…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Let's test five sucrose solutions from 0.00 M to 0.70 M on our 3D Osmosis Bench, weigh the yam strips, and find the isotonic concentration on the graph!",
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
      var mSign = StoryStage.sign("OSMOSIS & TURGOR · MILE 12 MARKET", "rgba(13,156,126,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("YABA OSMOSIS & HAEMOLYSIS LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildOsmosisProp("Plant Cell (Turgid in H₂O)", true, "rgba(34,197,94,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildOsmosisProp("RBC (Haemolysis in H₂O!)", false, "rgba(244,63,94,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
