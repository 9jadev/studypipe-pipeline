/* Lesson 07 · 3D story: the cool box of six blood bags at the Oja Oba tent, then Dr Aisha's typing tile in the UCH teaching lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var RIDER_AT = new THREE.Vector3(2.0, 0.2, 0.55);     // feet end; he lies along -x, face up
  var BOX_AT = new THREE.Vector3(-1.5, 0, 1.45);
  var WIDE = [[0.1, 2.4, 6.2], [-0.1, 0.6, 1.0]];
  var BOXSHOT = [[-1.0, 1.45, 3.5], [-1.5, 0.45, 1.45]];
  var TALK = [[-0.6, 1.6, 4.4], [-0.8, 0.9, 1.1]];
  var LAB = [[39.7, 2.3, 2.7], [39.8, 1.5, -2.3]];
  var BAGS = ["O+", "O−", "A−", "B+", "B−", "AB−"];

  function reset(w) {
    var p = w.people, mk = w.props.market, lab = w.props.lab;
    if (p.amaka.parent !== lab) { p.amaka.parent.remove(p.amaka); lab.add(p.amaka); }
    p.amaka.position.set(-1.1, 0, -1.3); p.amaka.rotation.y = 0.15; p.amaka.userData.faceTarget = null;
    if (p.ngozi.parent !== mk) { p.ngozi.parent.remove(p.ngozi); mk.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.position.set(2.9, 0, 2.0); p.ngozi.userData.faceTarget = new THREE.Vector3(0, 0, 0.6);
    var look = new THREE.Vector3(BOX_AT.x, 0, BOX_AT.z);
    p.cust1.userData.target = null; p.cust2.userData.target = null;
    p.cust1.position.set(-2.55, 0, 2.3); p.cust1.userData.faceTarget = look;
    p.cust2.position.set(-0.45, 0, 2.35); p.cust2.userData.faceTarget = look;
    w.props.lidOpen = 1;
  }
  function toTent(w) {
    var a = w.people.amaka, mk = w.props.market;
    if (a.parent !== mk) { a.parent.remove(a); mk.add(a); }
    a.position.set(-1.15, 0, 0.45); a.userData.faceTarget = new THREE.Vector3(BOX_AT.x, 0, BOX_AT.z);
  }

  // the typing tile on Dr Aisha's lab bench (a small AboTypingBench), built the first time the lab scene is reached
  function ensureTile(w) {
    var P = w.props;
    if (P.tileKit || P.tileTried || !window.AboTypingBench) return;
    P.tileTried = true;
    try {
      var holderT = new THREE.Group();
      var tk = window.AboTypingBench.create({ sample: "rider", view: "bench", labels: false });
      tk.scale.setScalar(0.03);
      holderT.add(tk); holderT.position.set(-0.1, 0.99, -2.15);
      P.lab.add(holderT); P.tileKit = tk; P.tileHolder = holderT;
      if (tk.update) tk.update(0.016, 0);
    } catch (er) { P.tileKit = null; }
  }

  var beats = [
    {
      caption: "The Oja Oba tent. The cool box opens on six bags.",
      shot: BOXSHOT, instant: true, hold: 6, who: "cust1",
      text: "The cool box holds O positive, O negative, A negative, B positive, B negative and AB negative. The rider's card reads B, Rh negative.",
      run: function (w) { reset(w); w.props.lidOpen = 0; w.props.lidKick = 1.2; w.people.cust1.set("point"); w.people.cust2.set("think"); }
    },
    {
      caption: "Baba Sule reaches for the AB bag.",
      shot: BOXSHOT, hold: 5, who: "cust2",
      text: "Take the AB! It has both letters, so it suits everybody.",
      run: function (w) { reset(w); w.people.cust2.set("point"); w.people.cust1.set("think"); }
    },
    {
      caption: "Chidi shrugs.",
      shot: WIDE, hold: 5, who: "cust1",
      text: "Blood is blood. Won't any bag do?",
      run: function (w) { reset(w); w.people.cust1.set("talk"); w.people.cust2.set("idle"); }
    },
    {
      caption: "Dr Aisha stops them. Mama Bisi worries about her pressure.",
      shot: TALK, hold: 7, who: "amaka",
      text: "The wrong bag can kill him faster than the crash. We test first. (Mama Bisi: is my 160 over 100 just tiredness?)",
      run: function (w) { reset(w); toTent(w); w.people.amaka.set("talk"); w.people.ngozi.set("think"); w.people.cust2.set("idle"); w.people.cust1.set("idle"); }
    },
    {
      caption: "UCH teaching lab. The typing tile is ready.",
      shot: LAB, instant: true, hold: 5.5, who: "amaka",
      text: "Come to the typing tile. Three sera, five samples, and the tile will tell us which bag is safe.",
      run: function (w) {
        reset(w); ensureTile(w);
        var a = w.people.amaka; a.position.set(-1.45, 0, -1.55); a.userData.faceTarget = new THREE.Vector3(39.8, 0, -2.3); a.set("talk");
      }
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
      P.mSign = retitle(P.market, P.mSign, "OJA OBA HEALTH DAY · SATURDAY", "rgba(200,38,74,0.95)", 0.46);
      P.lSign = retitle(P.lab, P.lSign, "UCH TEACHING LAB · BIOLOGY", "rgba(59,108,246,0.95)", 0.42);
      ["bottleA", "bottleB", "can", "balance", "burette", "flask", "vflask"].forEach(function (k) { if (P[k]) P[k].visible = false; });
      (P.jars || []).forEach(function (j) { j.visible = false; });

      // ---- the okada rider on a mat, with his card ----
      var mat = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.04, 1.0), S.std("#2f7d6b", 0.9));
      mat.position.set(RIDER_AT.x - 0.9, 0.02, RIDER_AT.z); P.market.add(mat);
      var holder = new THREE.Group();
      var rider = S.person({ skin: "#4a2e1f", outfit: "#d97b1a", pants: "#27324a", hair: "short" });
      rider.rotation.x = -Math.PI / 2;
      holder.add(rider); holder.rotation.y = Math.PI / 2; holder.position.copy(RIDER_AT);
      rider.userData.armL.rotation.z = -0.02; rider.userData.armR.rotation.z = 0.02;
      P.market.add(holder); P.rider = holder;
      var card = S.sign("RIDER · B, Rh−", "rgba(27,24,19,0.95)", "#fff", 0.2);
      card.position.set(RIDER_AT.x - 1.0, 0.55, RIDER_AT.z - 0.62); P.market.add(card); P.riderCard = card;

      // ---- the cool box: body, hinged lid, six bags with labels ----
      var box = new THREE.Group();
      var body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.42, 0.5), S.std("#2b6cb0", 0.6));
      body.position.y = 0.21; box.add(body);
      var inner = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.4), S.std("#dce6f2", 0.8));
      inner.position.y = 0.42; box.add(inner);
      var hinge = new THREE.Group(); hinge.position.set(0, 0.43, -0.25); box.add(hinge);
      var lid = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.06, 0.54), S.std("#f4f6f8", 0.55));
      lid.position.set(0, 0.03, 0.27); hinge.add(lid);
      var bagMat = new THREE.MeshPhysicalMaterial({ color: 0xb3142e, roughness: 0.25, clearcoat: 1, transparent: true, opacity: 0.95 });
      var bagMeshes = [];
      BAGS.forEach(function (name, i) {
        var g = new THREE.Group();
        var bag = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.2, 6, 12), bagMat);
        bag.scale.z = 0.35; bag.position.y = 0.17; g.add(bag);
        var tag = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.01), S.std("#f7f4ea", 0.7)); tag.position.set(0, 0.16, 0.026); g.add(tag);
        var lab = S.sign(name, name.indexOf("AB") === 0 ? "rgba(124,58,200,0.96)" : "rgba(27,24,19,0.95)", "#fff", 0.1);
        lab.position.set(0, 0.46, 0.05); g.add(lab);
        g.position.set(-0.38 + i * 0.152, 0.43, 0.02);
        g.userData.name = name; box.add(g); bagMeshes.push(g);
      });
      box.position.copy(BOX_AT); box.rotation.y = 0.18; P.market.add(box);
      P.coolBox = box; P.lidHinge = hinge; P.bagMeshes = bagMeshes; P.lidOpen = 1; P.lidKick = 0;

      P.tileKit = null;
    },
    onTick: function (api, dt, t) {
      var P = api.props; if (!P.lidHinge) return;
      if (P.lidKick > 0) { P.lidKick = Math.max(0, P.lidKick - dt); if (P.lidKick === 0) P.lidOpen = 1; }
      var k = Math.min(1, dt * 5), want = P.lidOpen ? -1.9 : 0;
      P.lidHinge.rotation.x += (want - P.lidHinge.rotation.x) * k;
      if (P.tileKit && api.stage.camera.position.x > 20 && P.tileKit.update) P.tileKit.update(dt, t);
    }
  });
})();
