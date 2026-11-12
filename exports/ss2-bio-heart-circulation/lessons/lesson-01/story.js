/* Lesson 01 · 3D story: Dr Aisha, Chidi and Baba Sule at the Oja Oba health-day tent, then the teaching lab with an Amoeba and the pink agar cubes */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.5, 7.4], [0, 1.3, 0]];
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function glassMat(op) {
    return new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: op == null ? 0.3 : op, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide });
  }

  // health-day gazebo: four poles and a striped roof over the screening table
  function buildCanopy() {
    var g = new THREE.Group();
    var pole = StoryStage.std("#c9ced8", 0.35);
    [[-1.7, -1.5], [1.7, -1.5], [-1.7, 1.3], [1.7, 1.3]].forEach(function (p) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.9, 10), pole);
      m.position.set(p[0], 1.45, p[1]); g.add(m);
    });
    var roof = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.07, 3.1), StoryStage.std("#f6f1e6", 0.8));
    roof.position.set(0, 2.92, -0.1); g.add(roof);
    var stripe = new THREE.Mesh(new THREE.BoxGeometry(3.92, 0.075, 0.5), StoryStage.std("#d22e56", 0.8));
    stripe.position.set(0, 2.925, -0.1); g.add(stripe);
    var valance = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.22, 0.04), StoryStage.std("#d22e56", 0.8));
    valance.position.set(0, 2.78, 1.45); g.add(valance);
    return g;
  }

  // cool box: white body, blue lid, handle
  function buildCoolBox() {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 0.38), StoryStage.std("#f3f5f8", 0.5));
    body.position.y = 0.18; g.add(body);
    var lid = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.07, 0.42), StoryStage.std("#2b6cb0", 0.45));
    lid.position.y = 0.395; g.add(lid);
    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 8, 16, Math.PI), StoryStage.std("#1c2433", 0.5));
    handle.position.set(0, 0.43, 0); g.add(handle);
    return g;
  }

  // microscope for the lab bench
  function buildMicroscope() {
    var g = new THREE.Group();
    var steel = StoryStage.std("#2b3446", 0.4);
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.26), steel); base.position.y = 0.02; g.add(base);
    var arm = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 10, 20, Math.PI * 1.1), steel);
    arm.rotation.z = -Math.PI * 0.55; arm.position.set(-0.04, 0.17, 0); g.add(arm);
    var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 14), StoryStage.std("#c9ced8", 0.3, { metalness: 0.7 }));
    tube.position.set(0.04, 0.3, 0); tube.rotation.z = 0.25; g.add(tube);
    var stage = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.16), steel); stage.position.set(0.02, 0.15, 0); g.add(stage);
    var slide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.008, 0.04), glassMat(0.5)); slide.position.set(0.02, 0.163, 0); g.add(slide);
    return g;
  }

  // beaker of dilute acid holding four pink agar cubes of increasing size
  function buildCubeBeaker() {
    var g = new THREE.Group();
    var pts = [[0, 0], [0.2, 0], [0.22, 0.04], [0.22, 0.46], [0.235, 0.48]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 28), glassMat(0.3)));
    var acid = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.34, 28), StoryStage.std("#cfe8ff", 0.2, { transparent: true, opacity: 0.45 }));
    acid.position.y = 0.19; g.add(acid);
    var pink = StoryStage.std("#e0407f", 0.45, { transparent: true, opacity: 0.88 });
    // [side in units, x, z]: 5, 10, 20 and 30 mm cubes, spread so all four show from the front
    [[0.0375, 0.02, 0.15], [0.075, -0.1, 0.13], [0.15, -0.1, -0.05], [0.21, 0.08, -0.03]].forEach(function (c, i) {
      var s = c[0];
      var m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), pink);
      m.position.set(c[1], 0.045 + s / 2, c[2]); m.rotation.y = i * 0.35; g.add(m);
    });
    return g;
  }

  // a jar of pond water with a green tint
  function buildPondJar() {
    var g = new THREE.Group();
    var pts = [[0, 0], [0.09, 0], [0.095, 0.03], [0.095, 0.2], [0.075, 0.23]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 20), glassMat(0.32)));
    var water = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.15, 20), StoryStage.std("#7fae5e", 0.2, { transparent: true, opacity: 0.6 }));
    water.position.y = 0.1; g.add(water);
    return g;
  }

  function toMarket(w, who, x, z, rotY) {
    var p = w.people[who];
    if (p.parent !== w.props.market) { p.parent.remove(p); w.props.market.add(p); }
    p.position.set(x, 0, z); p.rotation.y = rotY || 0;
    p.userData.target = null; p.userData.faceTarget = null; p.userData.speed = 1.2;
  }
  function toLab(w, who, x, z, rotY) {
    var p = w.people[who];
    if (p.parent !== w.props.lab) { p.parent.remove(p); w.props.lab.add(p); }
    p.position.set(x, 0, z); p.rotation.y = rotY || 0;
    p.userData.target = null; p.userData.faceTarget = null;
  }
  function market(w) {
    clearTimers();
    toMarket(w, "amaka", -0.4, 0.5, 0.5);
    toMarket(w, "cust1", -1.1, 1.8, Math.PI * 0.85);
    toMarket(w, "cust2", 3.6, 1.0, Math.PI * 1.1);
    w.people.cust1.userData.faceTarget = new THREE.Vector3(-0.4, 0, 0.5);
    w.people.cust2.userData.faceTarget = new THREE.Vector3(0, 0, 1);
    w.people.amaka.userData.faceTarget = new THREE.Vector3(-1.1, 0, 1.8);
  }
  function lab(w) {
    clearTimers();
    toLab(w, "amaka", -1.0, -1.3, 0);
    w.people.amaka.userData.faceTarget = null;
  }

  var beats = [
    {
      caption: "The Oja Oba health-day tent. Chidi runs an errand for Dr Aisha.",
      shot: WIDE, instant: true, hold: 6.5,
      who: "amaka",
      text: "Chidi, please fetch that cable from the far end of the market. Quick as you can!",
      run: function (w) {
        market(w);
        var c = w.people.cust1;
        c.userData.speed = 3.4;
        c.walkTo(7.5, 2.2, "idle");
        later(function () { c.walkTo(-1.1, 1.8, "idle"); }, 2600);
        w.people.amaka.set("point");
      }
    },
    {
      caption: "Two fingers on the wrist: the pulse.",
      shot: [[-0.2, 1.9, 4.3], [-0.7, 1.35, 1.2]], hold: 6,
      who: "amaka",
      text: "Your heart has nearly doubled its speed. Why should running make it do that?",
      run: function (w) {
        market(w);
        w.people.cust1.position.set(-0.9, 0, 1.2);
        w.people.cust1.userData.faceTarget = new THREE.Vector3(-0.4, 0, 0.5);
        w.people.cust1.set("sad");
        w.people.amaka.userData.faceTarget = new THREE.Vector3(-0.9, 0, 1.2);
        w.people.amaka.set("think");
      }
    },
    {
      caption: "Baba Sule thinks a small heart means small trouble.",
      shot: [[2.6, 1.9, 4.4], [3.0, 1.4, 1.0]], hold: 5.5,
      who: "cust2",
      text: "A frog in a gutter has no need to run like that. Small heart, small trouble!",
      run: function (w) {
        market(w);
        w.people.cust2.position.set(2.6, 0, 1.3);
        w.people.cust2.userData.faceTarget = new THREE.Vector3(0, 0, 1.2);
        w.people.cust2.set("talk");
      }
    },
    {
      caption: "In the teaching lab: an Amoeba under the microscope.",
      shot: [[40.1, 2.2, 3.0], [39.2, 1.45, -2.2]], hold: 6.5,
      who: "amaka",
      text: "This Amoeba has no heart and no blood. It gets everything by diffusion. Chidi cannot. Today we find out why.",
      run: function (w) { lab(w); w.people.amaka.set("point"); }
    },
    {
      caption: "Pink agar cubes of four sizes go into acid.",
      shot: [[40.6, 2.0, 0.9], [40.5, 1.25, -2.2]], hold: 6,
      who: "amaka",
      text: "Four pink agar cubes, four sizes, one beaker of acid. Watch how far the colour fades from the edge.",
      run: function (w) { lab(w); w.people.amaka.set("talk"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Bisi", cust1: "Chidi", cust2: "Baba Sule", amaka: "Dr Aisha" },
    setup: function (api) {
      // retitle the sign and dress the tent
      var mSign = StoryStage.sign("OJA OBA HEALTH DAY · FREE SCREENING", "rgba(210,46,86,0.95)", "#fff", 0.46);
      api.props.market.remove(api.props.mSign);
      mSign.position.set(0, 3.5, -1.5);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("TEACHING LAB · UCH", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      api.props.bottleA.visible = false; api.props.bottleB.visible = false; api.props.can.visible = false;
      api.props.jars.forEach(function (j) { j.visible = false; });
      api.people.ngozi.visible = false;

      var canopy = buildCanopy(); api.props.market.add(canopy);
      var cool = buildCoolBox(); cool.position.set(1.4, 0, -0.5); cool.rotation.y = -0.3; api.props.market.add(cool);
      api.props.coolBox = cool;

      api.props.flask.visible = false; api.props.vflask.visible = false; api.props.burette.visible = false;
      var mic = buildMicroscope(); mic.position.set(-1.5, 0.99, -2.3); mic.rotation.y = 0.35; api.props.lab.add(mic);
      var jar = buildPondJar(); jar.position.set(-0.85, 0.99, -2.2); api.props.lab.add(jar);
      var beaker = buildCubeBeaker(); beaker.position.set(0.55, 0.99, -2.2); api.props.lab.add(beaker);
      api.props.microscope = mic; api.props.cubeBeaker = beaker;
    }
  });
})();
