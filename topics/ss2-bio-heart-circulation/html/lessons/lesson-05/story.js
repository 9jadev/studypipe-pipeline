/* Lesson 05 · 3D story: Mama Bisi's swollen ankle at the Oja Oba health-day tent, then Dr Aisha's lab bench with a single capillary */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0.2, 2.3, 6.2], [0.2, 1.1, 0.8]];
  var ANKLE = [[-0.4, 1.0, 3.7], [-0.8, 0.45, 1.0]];
  var MAMA = [[-0.3, 1.7, 3.6], [-0.8, 1.2, 0.9]];
  var BABA = [[2.5, 1.9, 4.4], [2.8, 1.4, 1.2]];
  var LAB = [[40.0, 1.9, 2.4], [39.8, 1.3, -2.2]];
  var LAB2 = [[40.3, 1.7, 1.4], [39.8, 1.3, -2.2]];

  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

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

  // low wooden stool for resting the feet
  function buildStool() {
    var g = new THREE.Group();
    var wood = StoryStage.std("#a8743c", 0.7);
    var top = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 20), wood); top.position.y = 0.3; g.add(top);
    [[-0.15, -0.1], [0.15, -0.1], [0, 0.17]].forEach(function (p) {
      var l = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.3, 8), wood); l.position.set(p[0], 0.15, p[1]); g.add(l);
    });
    return g;
  }

  // blue knotted veins winding up the calf, attached to the person's leg
  function addVeins(person) {
    var mat = StoryStage.std("#3b5ec2", 0.45);
    [-0.11, 0.11].forEach(function (x, k) {
      var pts = [[x, 0.1, 0.085], [x + 0.025, 0.24, 0.09], [x - 0.02, 0.38, 0.09], [x + 0.03, 0.52, 0.085], [x, 0.66, 0.08]].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
      var tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.011, 8, false), mat);
      person.add(tube);
      [0.24, 0.4, 0.55].forEach(function (y, i) {
        var knot = new THREE.Mesh(new THREE.SphereGeometry(0.02 + 0.004 * i, 10, 8), mat);
        knot.position.set(x + (i === 1 ? 0.0 : 0.02), y, 0.092); knot.scale.set(1, 1.3, 0.8); person.add(knot);
      });
    });
  }

  function toMarket(w, who, x, z, rotY) {
    var p = w.people[who];
    if (p.parent !== w.props.market) { p.parent.remove(p); w.props.market.add(p); }
    p.visible = true; p.position.set(x, 0, z); p.rotation.y = rotY || 0;
    p.userData.target = null; p.userData.faceTarget = null;
  }
  function toLab(w, who, x, z, rotY) {
    var p = w.people[who];
    if (p.parent !== w.props.lab) { p.parent.remove(p); w.props.lab.add(p); }
    p.visible = true; p.position.set(x, 0, z); p.rotation.y = rotY || 0;
    p.userData.target = null; p.userData.faceTarget = null;
  }
  function market(w) {
    clearTimers();
    toMarket(w, "ngozi", -0.8, 0.95, 0.15);
    toMarket(w, "amaka", -0.05, 1.45, -0.7);
    toMarket(w, "cust2", 2.7, 1.2, Math.PI * 1.05);
    toMarket(w, "cust1", 1.4, 2.2, Math.PI * 0.9);
    w.people.amaka.userData.faceTarget = new THREE.Vector3(-0.8, 0, 0.95);
    w.people.cust2.userData.faceTarget = new THREE.Vector3(0, 0, 1.0);
    w.people.cust1.userData.faceTarget = new THREE.Vector3(-0.6, 0, 1.0);
    ["ngozi", "amaka", "cust1", "cust2"].forEach(function (k) { w.people[k].set("idle"); });
  }
  function lab(w) {
    clearTimers();
    toLab(w, "amaka", -1.2, -1.2, 0.2);
    w.people.amaka.userData.faceTarget = new THREE.Vector3(39.8, 0, -2.2);
  }

  var beats = [
    {
      caption: "The Oja Oba health-day tent. Mama Bisi props her feet on a stool.",
      shot: WIDE, instant: true, hold: 6.5, who: "amaka",
      text: "Mama Bisi, keep your feet up. See? My thumb leaves a dent, and the dent stays.",
      run: function (w) { market(w); w.people.amaka.set("point"); w.people.ngozi.set("sad"); }
    },
    {
      caption: "Her ankles: a dent that stays, and blue knotted veins up the calves.",
      shot: ANKLE, hold: 5.5, who: "ngozi",
      text: "In the morning they are fine. By evening my sandals are tight.",
      run: function (w) { market(w); w.people.ngozi.set("talk"); w.people.amaka.set("think"); }
    },
    {
      caption: "Baba Sule has an idea about water.",
      shot: BABA, hold: 5.5, who: "cust2",
      text: "Too much water in the blood. Stop drinking water!",
      run: function (w) { market(w); w.people.cust2.set("talk"); w.people.ngozi.set("sad"); }
    },
    {
      caption: "In the teaching lab: a single capillary between leg muscle cells.",
      shot: LAB, instant: true, hold: 6.5, who: "amaka",
      text: "The answer lies in a tube one cell thick, and in two pressures fighting inside it.",
      run: function (w) { lab(w); w.people.amaka.set("point"); }
    },
    {
      caption: "To the vessel bench and the capillary bench.",
      shot: LAB2, hold: 5.5, who: "amaka",
      text: "Come to the vessel bench and the capillary bench. Measure the vessels, then slide the pressure probe.",
      run: function (w) { lab(w); w.people.amaka.set("talk"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Bisi", cust1: "Chidi", cust2: "Baba Sule", amaka: "Dr Aisha" },
    setup: function (api) {
      var P = api.props, S = window.StoryStage;
      function retitle(group, oldSign, text, bg, h) {
        var s = S.sign(text, bg, "#fff", h);
        s.position.copy(oldSign.position); group.remove(oldSign); group.add(s); return s;
      }
      P.mSign = retitle(P.market, P.mSign, "OJA OBA HEALTH DAY · FREE SCREENING", "rgba(210,46,86,0.95)", 0.46);
      P.lSign = retitle(P.lab, P.lSign, "TEACHING LAB · UCH", "rgba(59,108,246,0.95)", 0.42);
      ["bottleA", "bottleB", "can", "balance", "burette", "flask", "vflask"].forEach(function (k) { if (P[k]) P[k].visible = false; });
      (P.jars || []).forEach(function (j) { j.visible = false; });

      P.market.add(buildCanopy());
      var stool = buildStool(); stool.position.set(-0.8, 0, 1.55); P.market.add(stool); P.stool = stool;
      addVeins(api.people.ngozi);

      // the capillary bed on Dr Aisha's bench (one capillary between leg muscle cells)
      if (window.HeartKit && window.HeartKit.capillaryBed) {
        var holder = new THREE.Group();
        var bed = window.HeartKit.capillaryBed({ labels: false });
        bed.scale.setScalar(0.5);
        holder.add(bed); holder.position.set(-0.2, 1.36, -2.3);
        var pad = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.04, 28), S.std("#3b6cf6", 0.4, { emissive: new THREE.Color(0x1a3a9a), emissiveIntensity: 0.8 }));
        pad.position.set(-0.2, 1.01, -2.3);
        P.lab.add(pad); P.lab.add(holder);
        P.bedKit = bed;
      }
    },
    onTick: function (api, dt, t) {
      var P = api.props;
      if (P.bedKit && api.stage.camera.position.x > 20) P.bedKit.userData.update(dt, t);   // animate only while the lab is on screen
    }
  });
})();
