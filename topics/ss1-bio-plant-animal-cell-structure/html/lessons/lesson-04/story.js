/* Lesson 04 · 3D story: limp ugu at Mile 12 Market, then Dr Amaka's saline drip at the LUTH lab (5 beats) */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];
  var LAB = [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]];

  function std(c, r, extra) { return StoryStage.std(c, r, extra); }

  // a bowl of salty water with limp ugu leaves draped over the rim
  function uguBowl() {
    var g = new THREE.Group();
    var prof = [[0, 0], [0.07, 0], [0.12, 0.04], [0.155, 0.11], [0.15, 0.115], [0.118, 0.055], [0.07, 0.025], [0, 0.025]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var bowl = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), std("#f4f1ea", 0.35, { side: THREE.DoubleSide }));
    g.add(bowl);
    var water = new THREE.Mesh(new THREE.CircleGeometry(0.128, 28), std("#cfe6ee", 0.1, { transparent: true, opacity: 0.8 }));
    water.rotation.x = -Math.PI / 2; water.position.y = 0.085; g.add(water);
    var shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.bezierCurveTo(0.055, 0.03, 0.065, 0.11, 0, 0.19); shape.bezierCurveTo(-0.065, 0.11, -0.055, 0.03, 0, 0);
    var leafGeo = new THREE.ShapeGeometry(shape, 8);
    var leafMat = std("#2f8f3a", 0.7, { side: THREE.DoubleSide });
    var leafMat2 = std("#3da34a", 0.7, { side: THREE.DoubleSide });
    for (var i = 0; i < 9; i++) {
      var arm = new THREE.Group();
      arm.rotation.y = i / 9 * Math.PI * 2;
      var leaf = new THREE.Mesh(leafGeo, i % 2 ? leafMat : leafMat2);
      leaf.position.set(0, 0.07, 0.03);
      leaf.rotation.x = 1.15 + (i % 3) * 0.12;           // drooping outward: limp
      arm.add(leaf); g.add(arm);
    }
    g.scale.setScalar(1.5);
    return g;
  }

  // drip stand with a bag of 0.9% saline
  function dripStand() {
    var g = new THREE.Group();
    var metal = std("#aeb7c6", 0.3, { metalness: 0.8 });
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 24), metal); base.position.y = 0.02; g.add(base);
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.9, 10), metal); pole.position.y = 0.97; g.add(pole);
    var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8), metal); arm.rotation.z = Math.PI / 2; arm.position.set(0.15, 1.9, 0); g.add(arm);
    var plastic = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, transparent: true, opacity: 0.4, clearcoat: 1, depthWrite: false });
    var bag = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.34, 0.05), plastic); bag.position.set(0.3, 1.66, 0); g.add(bag);
    var fluid = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.26, 0.035), std("#dff1ff", 0.2, { transparent: true, opacity: 0.8 })); fluid.position.set(0.3, 1.63, 0); g.add(fluid);
    var tag = StoryStage.sign("0.9% SALINE", "rgba(13,156,126,0.95)", "#fff", 0.1); tag.position.set(0.3, 1.64, 0.07); g.add(tag);
    var chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 12), plastic); chamber.position.set(0.3, 1.38, 0); g.add(chamber);
    var drop = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), std("#9ad4ff", 0.1, { emissive: 0x2a6f9a })); drop.position.set(0.3, 1.4, 0); g.add(drop);
    g.userData.drop = drop;
    var curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.3, 1.31, 0), new THREE.Vector3(0.3, 1.1, 0.03), new THREE.Vector3(0.4, 0.95, 0.12), new THREE.Vector3(0.5, 1.0, 0.22)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.008, 6, false), std("#e8f3f7", 0.3, { transparent: true, opacity: 0.8 })));
    return g;
  }

  function put(p, group, x, z, faceX, faceZ) {
    if (p.parent && p.parent !== group) p.parent.remove(p);
    if (p.parent !== group) group.add(p);
    p.userData.target = null; p.hold(null);
    p.position.set(x, 0, z);
    p.userData.faceTarget = new THREE.Vector3((group.position.x || 0) + faceX, 0, faceZ);
  }
  function reset(w) {
    var p = w.people, m = w.props.market, l = w.props.lab;
    put(p.ngozi, m, 0, -1.0, 0, 3);
    put(p.cust1, m, -1.1, 1.6, 0, -1);
    put(p.cust2, m, 0.9, 1.7, 0, -1);
    put(p.amaka, l, -1.0, -1.3, 0.4, -1.2);
    p.ngozi.rotation.y = 0;
  }
  function labScene(w, chinedu) {
    var p = w.people, l = w.props.lab;
    put(p.amaka, l, -0.6, -1.0, 0.4, -1.2);
    if (chinedu) put(p.cust1, l, 1.2, -0.5, -0.6, -1.0);
  }

  var beats = [
    {
      caption: "Mile 12 Market. An hour after the salty wash.",
      shot: WIDE, instant: true, hold: 5,
      who: "ngozi",
      text: "Ah-ah! My nephew washed my ugu in salty water, “against flies”. One hour later, look at it: limp, limp, limp!",
      run: function (w) { reset(w); w.people.ngozi.set("sad"); w.people.cust1.set("think"); }
    },
    {
      caption: "Coach Danjuma has a theory.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "It is simple, Mama. The salt soaked into the leaves and made them heavy.",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "LUTH lab. A drip for a dehydrated patient.",
      shot: LAB, hold: 5.5,
      who: "amaka",
      text: "A drip for a dehydrated patient. Plain water? Never. I reach for the 0.9% saline.",
      run: function (w) { reset(w); labScene(w, false); w.people.amaka.userData.faceTarget = new THREE.Vector3(40.4, 0, -1.2); w.people.amaka.set("point"); }
    },
    {
      caption: "Chinedu is not convinced.",
      shot: LAB, hold: 5,
      who: "cust1",
      text: "But the patient is thirsty, Doctor. Why not just use water?",
      run: function (w) { reset(w); labScene(w, true); w.people.cust1.set("talk"); w.people.amaka.userData.faceTarget = new THREE.Vector3(41.2, 0, -0.5); }
    },
    {
      caption: "Time for the bench.",
      shot: [[40.4, 2.2, 3.2], [40.3, 1.3, -1.6]], hold: 5.5,
      who: "amaka",
      text: "Water always moves. Today you will measure which way it goes, with a potato.",
      run: function (w) { reset(w); labScene(w, true); w.people.amaka.set("talk"); w.people.cust1.set("think"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Ngozi", cust1: "Chinedu", cust2: "Coach Danjuma", amaka: "Dr Amaka" },
    setup: function (api) {
      var m = api.props.market, l = api.props.lab;
      var mSign = StoryStage.sign("MILE 12 MARKET · LAGOS", "rgba(13,156,126,0.95)", "#fff", 0.46);
      mSign.position.copy(api.props.mSign.position); m.remove(api.props.mSign); m.add(mSign); api.props.mSign = mSign;
      var lSign = StoryStage.sign("LUTH TEACHING LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position); l.remove(api.props.lSign); l.add(lSign); api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;
      if (api.props.flask) api.props.flask.visible = false;
      if (api.props.burette) api.props.burette.visible = false;

      var bowl = uguBowl(); bowl.position.set(0.7, 0.94, 0.12); m.add(bowl);
      var bt = StoryStage.sign("Ugu in salty water", "rgba(200,38,74,0.95)", "#fff", 0.13); bt.position.set(0.7, 1.45, 0.12); m.add(bt);
      api.props.bowl = bowl;

      var drip = dripStand(); drip.position.set(0.5, 0, -1.2); l.add(drip);
      api.props.drip = drip;
      var water = api.bottle("#dff1ff", "Plain water"); water.position.set(-0.1, 0.99, -2.4); water.scale.setScalar(1.3); l.add(water);
      api.props.waterBottle = water;
    },
    onTick: function (api, dt, t) {
      var d = api.props.drip && api.props.drip.userData.drop;
      if (d) { var u = (t * 0.9) % 1; d.position.y = 1.43 - u * 0.1; d.visible = u < 0.9; }
    }
  });
})();
