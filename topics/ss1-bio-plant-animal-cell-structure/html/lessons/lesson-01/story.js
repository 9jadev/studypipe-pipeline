/* Lesson 01 · 3D story: two ugu leaves at Mile 12 Market, then a microscope in Dr Amaka's lab (5 beats, set 1 -> set 2) */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.4, 6.5], [0, 1.2, 0]];

  /* an ugu leaf: a bent plane. crisp = cupped upwards and stiff, limp = drooping over its own tip */
  function leaf(limp) {
    var geo = new THREE.PlaneGeometry(0.26, 0.5, 6, 10);
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), u = (y + 0.25) / 0.5;           /* u: 0 at the stalk, 1 at the tip */
      var taper = Math.sin(Math.PI * Math.min(1, u * 0.95 + 0.04));
      p.setX(i, x * (0.25 + 0.75 * taper));
      p.setZ(i, limp ? -0.32 * u * u - 0.02 * Math.abs(x) : 0.05 * Math.abs(x) * 6 * (1 - u * 0.4) + 0.02 * u);
    }
    geo.computeVertexNormals();
    var mat = StoryStage.std(limp ? "#5f8f3a" : "#2f9d3f", 0.7, { side: THREE.DoubleSide });
    var m = new THREE.Mesh(geo, mat);
    m.rotation.x = limp ? -1.1 : -0.55;
    var g = new THREE.Group();
    g.add(m);
    var vein = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.48, 6), StoryStage.std("#d8e8a8", 0.6));
    vein.rotation.x = Math.PI / 2 - (limp ? 1.1 : 0.55);
    vein.position.set(0, limp ? -0.02 : 0.1, limp ? -0.04 : 0.06);
    g.add(vein);
    return g;
  }

  function bowl() {
    var g = new THREE.Group();
    var pts = [[0, 0], [0.13, 0], [0.2, 0.05], [0.24, 0.14], [0.235, 0.15], [0.19, 0.06], [0, 0.025]].map(function (a) { return new THREE.Vector2(a[0], a[1]); });
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xf4efe6, roughness: 0.35, side: THREE.DoubleSide });
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 28), glass));
    var water = new THREE.Mesh(new THREE.CircleGeometry(0.2, 28), StoryStage.std("#b9d9e8", 0.2, { transparent: true, opacity: 0.85 }));
    water.rotation.x = -Math.PI / 2; water.position.y = 0.11;
    g.add(water);
    return g;
  }

  /* a split eyepiece view drawn from the microscope-bench model: ugu peel (left) and blood smear (right) */
  function eyeMonitor() {
    var c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = "#10151f"; g.fillRect(0, 0, 512, 256);
    if (window.MicroscopeBench && MicroscopeBench.renderView) {
      [["onion", 0], ["blood", 256]].forEach(function (s) {
        var d = document.createElement("canvas"); d.width = d.height = 256;
        MicroscopeBench.renderView(d.getContext("2d"), 256, { slide: s[0], objective: 2, eyepiece: 10, blur: 0, brightness: 1, guide: false });
        g.drawImage(d, s[1], 0);
      });
    }
    var tex = new THREE.CanvasTexture(c);
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace; else tex.encoding = THREE.sRGBEncoding;
    var grp = new THREE.Group();
    var frame = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.56, 0.04), StoryStage.std("#1b2230", 0.5));
    grp.add(frame);
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    scr.position.z = 0.022;
    grp.add(scr);
    return grp;
  }

  function reset(w) {
    var p = w.people;
    if (p.ngozi.parent !== w.props.market) { p.ngozi.parent.remove(p.ngozi); w.props.market.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.userData.faceTarget = null; p.ngozi.hold(null);
    p.ngozi.position.set(0, 0, -1.0); p.ngozi.rotation.y = 0;
  }

  var beats = [
    {
      caption: "Mile 12 Market, Lagos. Two ugu leaves, same morning.",
      shot: WIDE, instant: true, hold: 5.5,
      who: "ngozi",
      text: "Look at these two bunches, Chinedu. Same ugu, same morning. One was washed in salty water and look how limp it went.",
      run: function (w) { reset(w); w.people.ngozi.set("point"); w.people.cust1.set("think"); }
    },
    {
      caption: "Coach Danjuma has a quick explanation.",
      shot: [[-0.3, 2.0, 5.0], [0.3, 1.2, 0.4]], hold: 5.5,
      who: "cust2",
      text: "Simple! The salt soaks into the leaf and makes it heavy, so it droops.",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.cust1.set("think"); }
    },
    {
      caption: "At LUTH, Dr Amaka thinks of a patient on a drip.",
      shot: [[39.6, 2.2, 3.4], [39.6, 1.3, -1.6]], hold: 6,
      who: "amaka",
      text: "A patient must never get plain water through a drip. Leaves and blood obey the same rule. To see why, we start with what they are both made of.",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(40.0, 0, 1.5);
        a.set("talk");
      }
    },
    {
      caption: "A thin ugu peel and a blood smear under the microscope.",
      shot: [[40.7, 2.0, 0.6], [40.6, 1.55, -2.2]], hold: 6.5,
      who: "amaka",
      text: "Here is a thin ugu peel on one side and a smear of blood on the other. Different, yes? But both show tiny compartments.",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(40.6, 0, -2.3);
        a.set("point");
      }
    },
    {
      caption: "1665: a man looked at cork and named shapes like these.",
      shot: [[40.4, 2.1, 2.6], [40.4, 1.4, -2.0]], hold: 6.5,
      who: "amaka",
      text: "In 1665 a man looking at cork named shapes like these. Today you will see them yourselves. Come to the microscope bench!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(40.4, 0, -2.3);
        a.set("point");
      }
    }
  ];

  var wired = window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Ngozi", cust1: "Chinedu", cust2: "Coach Danjuma", amaka: "Dr Amaka" },
    setup: function (api) {
      var mSign = StoryStage.sign("MILE 12 MARKET · LAGOS", "rgba(13,156,126,0.95)", "#fff", 0.55);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign); api.props.market.add(mSign); api.props.mSign = mSign;

      var lSign = StoryStage.sign("LUTH TEACHING LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign); api.props.lab.add(lSign); api.props.lSign = lSign;

      /* market: hide the bottles, put a crisp and a limp ugu leaf and the salty-water bowl on the stall */
      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      var crisp = leaf(false); crisp.position.set(0.5, 0.99, 0.12); api.props.market.add(crisp);
      var limp = leaf(true); limp.position.set(0.92, 0.99, 0.12); api.props.market.add(limp);
      var t1 = StoryStage.sign("fresh", "rgba(13,156,126,0.95)", "#fff", 0.1); t1.position.set(0.5, 1.5, 0.12); api.props.market.add(t1);
      var t2 = StoryStage.sign("salty wash", "rgba(200,38,74,0.95)", "#fff", 0.1); t2.position.set(0.92, 1.5, 0.12); api.props.market.add(t2);
      var b = bowl(); b.position.set(1.3, 0.94, 0.1); api.props.market.add(b);
      api.props.crisp = crisp; api.props.limp = limp;

      /* lab: a real microscope prop (kit model, small) + the split eyepiece monitor */
      var lab = api.props.lab;
      if (window.CellKit && CellKit.microscope) {
        var sc = CellKit.microscope({ objective: 2, mirror: true });
        sc.scale.setScalar(0.34);
        sc.position.set(0.55, 0.99, -2.2);
        sc.rotation.y = -0.5;
        lab.add(sc);
        api.props.scope = sc;
      }
      var mon = eyeMonitor();
      mon.position.set(0.7, 1.9, -2.55);
      lab.add(mon);
      api.props.monitor = mon;
    },
    onTick: function (api, dt, t) {
      if (api.props.scope && api.props.scope.update) api.props.scope.update(dt, t);
      if (api.props.limp) api.props.limp.rotation.z = Math.sin(t * 1.4) * 0.03;
    }
  });
  /* sleep until scrolled into view (SceneKit's IntersectionObserver wakes it): keeps page load light on phones */
  if (wired && wired.story && wired.story.stage) wired.story.stage.visible = false;
})();
