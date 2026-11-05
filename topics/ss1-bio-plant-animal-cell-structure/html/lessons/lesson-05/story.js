/* Lesson 05 · 3D story beats: Wet-Mount Slide Preparation & WAEC Biological Drawing Clinic at Yaba Lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildSlideAndScopeProp(labelText, isSlide, tagBg) {
    var g = new THREE.Group();
    if (window.CellKit) {
      if (isSlide) {
        var sl = CellKit.slide({ scale: 0.44 });
        sl.group.position.y = 0.22;
        g.add(sl.group);
      } else {
        var sc = CellKit.microscope({ scale: 0.48 });
        g.add(sc.group);
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
      caption: "Mile 12 Market → Yaba Practical Prep. Tunde brings fresh purple onions to practice for WAEC Paper 3.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Mama Titi! Tomorrow is our mock WAEC Biology Paper 3 Practical! When I mounted an onion peel yesterday, all I saw were giant black circles and my drawing lost half its marks!",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Alhaji Musa admits he shaded his drawing like Fine Art class.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "Wait — shouldn't you shade the nucleus dark with your pencil and put neat arrowheads on your label lines so the examiner sees where they point?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Mama Titi warns against air bubbles, shading, and arrowheads!",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 5.2,
      who: "ngozi",
      text: "Never! Those black circles were trapped air bubbles from dropping the coverslip flat! And in WAEC Biology, shading and arrowheads on label lines cost you precious marks!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "45° Coverslip Lowering + Iodine (Plant) vs Methylene Blue (Animal).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "Lower the coverslip gently at a 45° angle with a mounting needle! Use iodine solution for onion cells and methylene blue for cheek cells!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "How do we estimate cell size from the microscope's Field of View?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "When you switch from ×100 to ×400, the field-of-view diameter shrinks four times from 1800 µm to 450 µm — divide that diameter by the number of cells across to get actual cell length A!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Yaba Practical Clinic with Dr. Kunle…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to the 3D Wet-Mount Bench! Let's lower the coverslip at 45°, calibrate the field of view across five magnifications, and audit our WAEC biological drawing!",
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
      var mSign = StoryStage.sign("WAEC PAPER 3 PREP · MILE 12", "rgba(13,156,126,0.95)", "#fff", 0.44);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("YABA WET-MOUNT & DRAWING CLINIC", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var propA = buildSlideAndScopeProp("Wet-Mount Slide (45° Angle)", true, "rgba(217,138,0,0.95)");
      propA.position.set(0.38, 0.94, 0.08);
      api.props.market.add(propA);
      api.props.clockA = propA;
      api.props.bottleA = propA;

      var propB = buildSlideAndScopeProp("Field of View (D₂ = D₁·M₁/M₂)", false, "rgba(13,156,126,0.95)");
      propB.position.set(0.92, 0.94, 0.08);
      api.props.market.add(propB);
      api.props.clockB = propB;
      api.props.bottleB = propB;
    }
  });
})();
