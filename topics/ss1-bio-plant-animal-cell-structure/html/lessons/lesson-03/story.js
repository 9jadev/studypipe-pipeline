/* Lesson 03 · 3D story: green drain water at Mile 12 Market, then the pond organisms under Dr Amaka's microscope */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  // a glass jar of green drain water, held by Chinedu
  function buildJar() {
    var g = new THREE.Group();
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide });
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.24, 20, 1, true), glass); body.position.y = 0.12; g.add(body);
    var water = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.17, 20), StoryStage.std("#4f9a3a", 0.25, { transparent: true, opacity: 0.88 })); water.position.y = 0.09; g.add(water);
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.012, 20), glass); g.add(base);
    g.userData.water = water;
    return g;
  }

  // a watch-glass dish of pond water with four animated protists (the "microscope view")
  function buildDish() {
    var g = new THREE.Group(), live = [];
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.28, clearcoat: 1, depthWrite: false });
    var rim = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 40), glass); rim.position.y = 0.025; g.add(rim);
    var water = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.036, 40), StoryStage.std("#7fbf6a", 0.2, { transparent: true, opacity: 0.55 })); water.position.y = 0.032; g.add(water);
    if (window.CellKit) {
      [["amoeba", -0.34, 0.12, 0.2, 0.33], ["paramecium", 0.18, 0.22, 0.2, 0.24], ["euglena", -0.12, -0.26, 0.2, 0.2], ["volvox", 0.32, -0.16, 0.2, 0.2]].forEach(function (c) {
        var o = window.CellKit.protist(c[0]);
        o.scale.setScalar(c[4]);
        o.position.set(c[1], 0.15, c[2]);
        g.add(o); live.push(o);
      });
    }
    g.userData.live = live;
    return g;
  }

  var beats = [
    {
      caption: "Mile 12 Market, Lagos. A drain runs beside the stalls.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Coach, look what I scooped from the drain beside the market! The water is green.",
      run: function (w) { w.people.cust1.hold(w.props.jarProp, "right"); w.people.cust1.set("talk"); }
    },
    {
      caption: "Coach Danjuma is not impressed.",
      shot: [[0.3, 2.0, 5.0], [0.3, 1.2, 1.4]], hold: 4.8,
      who: "cust2",
      text: "Nothing lives in that. It is just dirty water. Throw it away!",
      run: function (w) { w.people.cust2.set("talk"); w.people.cust1.set("think"); }
    },
    {
      caption: "At the LUTH lab: four organisms in one drop.",
      shot: [[40.9, 2.3, 1.0], [40.05, 1.05, -2.1]], instant: true, hold: 6,
      who: "amaka",
      text: "Look: a blob that keeps changing shape, a slipper covered in hairs, a green spindle with a whip, and a hollow green ball.",
      run: function (w) { w.people.amaka.userData.faceTarget = new THREE.Vector3(0, 0, -2.1); w.people.amaka.set("talk"); }
    },
    {
      caption: "A puzzle about size and cells.",
      shot: [[40.4, 2.2, 3.2], [40.2, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Each of these is a whole living thing. Yet Chinedu is billions of cells working together. Why the difference?",
      run: function (w) { w.people.amaka.set("think"); }
    },
    {
      caption: "Your turn: the pond survey and the cube bench.",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5, 
      who: "amaka",
      text: "Come, let us survey the pond and then cut some agar cubes. The numbers will tell the story.",
      run: function (w) { w.people.amaka.set("talk"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Ngozi", cust1: "Chinedu", cust2: "Coach Danjuma", amaka: "Dr Amaka" },
    setup: function (api) {
      var mSign = StoryStage.sign("MILE 12 MARKET · LAGOS", "rgba(13,156,126,0.95)", "#fff", 0.5);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign); api.props.market.add(mSign); api.props.mSign = mSign;
      var lSign = StoryStage.sign("LUTH BIOLOGY LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign); api.props.lab.add(lSign); api.props.lSign = lSign;

      // chemistry-lab props are not needed in a biology lab
      ["bottleA", "bottleB", "can", "balance", "burette", "flask", "vflask"].forEach(function (k) { if (api.props[k]) api.props[k].visible = false; });

      var jar = buildJar();
      api.props.jarProp = jar;
      api.props.jar = jar;
      var dish = buildDish();
      dish.position.set(0, 1.0, -2.1);
      api.props.lab.add(dish);
      api.props.dish = dish;
    },
    onTick: function (api, dt, t) {
      var live = api.props.dish && api.props.dish.userData.live;
      if (!live) return;
      live.forEach(function (o, i) {
        if (o.userData.update) o.userData.update(dt, t);
        o.position.y = 0.15 + 0.03 * Math.sin(t * 1.2 + i);
        o.rotation.y = Math.sin(t * 0.4 + i * 2) * 0.4;
      });
    }
  });
})();
