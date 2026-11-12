/* Lesson 06 · 3D story: the okada rider's gash at the Oja Oba health tent, then Dr Aisha's microscope in the UCH teaching lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0.3, 2.3, 5.6], [0.3, 0.7, 0.8]];
  var LEG = [[1.3, 1.9, 3.5], [1.55, 0.25, 0.95]];
  var LEG2 = [[1.0, 2.0, 3.6], [1.2, 0.3, 1.0]];
  var LABSCOPE = [[39.9, 2.1, 1.0], [39.9, 1.4, -2.3]];
  var RIDER_AT = new THREE.Vector3(1.9, 0.2, 0.95);   // feet end; he lies along -x, head to the left, face up
  var GASH_AT = new THREE.Vector3(1.55, 0.26, 0.95);  // on the shin
  var SCOPE_AT = new THREE.Vector3(-0.2, 0.99, -2.2);

  // what Dr Aisha sees through the eyepiece: discs, one lobed cell, a few platelets
  function smearTexture() {
    var c = document.createElement("canvas"); c.width = 384; c.height = 384;
    var x = c.getContext("2d"), r = 0;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    x.fillStyle = "#f6e3e6"; x.fillRect(0, 0, 384, 384);
    for (var i = 0; i < 60; i++) {
      var px = 30 + rnd() * 324, py = 30 + rnd() * 324, rr = 17 + rnd() * 3;
      if (Math.hypot(px - 192, py - 192) > 172) continue;
      x.fillStyle = "#d9535f"; x.beginPath(); x.arc(px, py, rr, 0, 6.283); x.fill();
      x.fillStyle = "#f0a2a8"; x.beginPath(); x.arc(px, py, rr * 0.4, 0, 6.283); x.fill();
    }
    x.fillStyle = "#6c4fb3";
    [[150, 170], [184, 158], [206, 188], [176, 206]].forEach(function (p) { x.beginPath(); x.arc(p[0], p[1], 15, 0, 6.283); x.fill(); });
    x.fillStyle = "#4a2f8a"; x.beginPath(); x.arc(250, 250, 24, 0, 6.283); x.fill();
    x.fillStyle = "#c9a0e6";
    for (var k = 0; k < 14; k++) { x.beginPath(); x.arc(110 + rnd() * 170, 90 + rnd() * 200, 3.2, 0, 6.283); x.fill(); }
    var t = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    return t;
  }

  function reset(w) {
    var p = w.people, mk = w.props.market, lab = w.props.lab;
    // Dr Aisha lives in the lab; she visits the tent in scenes 1-3
    if (p.amaka.parent !== lab) { p.amaka.parent.remove(p.amaka); lab.add(p.amaka); }
    p.amaka.position.set(-1.1, 0, -1.3); p.amaka.rotation.y = 0.15; p.amaka.userData.faceTarget = null;
    if (p.ngozi.parent !== mk) { p.ngozi.parent.remove(p.ngozi); mk.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.position.set(-1.9, 0, -1.0);
    var look = new THREE.Vector3(GASH_AT.x, 0, GASH_AT.z);
    p.cust1.position.set(-0.9, 0, 2.3); p.cust1.userData.faceTarget = look;
    p.cust2.position.set(2.7, 0, 2.3); p.cust2.userData.faceTarget = look;
    w.props.salt && (w.props.salt.visible = false);
  }
  function toTent(w) {
    var a = w.people.amaka, mk = w.props.market;
    if (a.parent !== mk) { a.parent.remove(a); mk.add(a); }
    a.position.set(0.5, 0, 1.75); a.userData.faceTarget = new THREE.Vector3(GASH_AT.x, 0, GASH_AT.z);
  }
  function gash(w, level, pad) {
    var P = w.props;
    if (!P.gashMesh) return;
    var cols = [[0xd01a2e, 0x7a0510, 1.0], [0x7a0c18, 0x300206, 0.5], [0x4a1a14, 0x1a0805, 0.25]];
    var c = cols[level];
    P.gashMesh.material.color.setHex(c[0]); P.gashMesh.material.emissive.setHex(c[1]); P.gashMesh.material.emissiveIntensity = c[2];
    P.gashMesh.scale.set(1, 1, level === 0 ? 1 : level === 1 ? 0.8 : 0.6);
    P.gashPad.visible = !!pad;
    P.gashDrops.visible = level === 0 && !pad;
  }

  var beats = [
    {
      caption: "The Oja Oba health-day tent. Dr Aisha presses a pad on the rider's gash.",
      shot: LEG2, instant: true, hold: 6, who: "amaka",
      text: "Keep the pressure on. After some minutes the bleeding slows to a seep, and then it stops.",
      run: function (w) { reset(w); toTent(w); gash(w, 0, true); w.people.amaka.set("point"); w.people.cust1.set("think"); w.people.cust2.set("idle"); }
    },
    {
      caption: "Chidi looks at the cut.",
      shot: LEG, hold: 5.5, who: "cust1",
      text: "Nobody stitched it yet. What closed it?",
      run: function (w) { reset(w); gash(w, 1, false); w.people.cust1.set("talk"); w.people.amaka.set("idle"); }
    },
    {
      caption: "Baba Sule has an idea.",
      shot: WIDE, hold: 6, who: "cust2",
      text: "Blood dries in the air like palm oil. Rub some salt in.",
      run: function (w) { reset(w); gash(w, 2, false); w.props.salt.visible = true; w.people.cust2.set("point"); w.people.cust1.set("think"); w.people.cust2.position.set(1.7, 0, 2.3); }
    },
    {
      caption: "UCH teaching lab. Dr Aisha puts a drop of blood under the microscope.",
      shot: LABSCOPE, instant: true, hold: 6.5, who: "amaka",
      text: "Look: discs, a few large cells with odd nuclei, and tiny specks. Each of these did a job at that wound.",
      run: function (w) {
        reset(w);
        var a = w.people.amaka; a.position.set(-0.8, 0, -1.2); a.userData.faceTarget = new THREE.Vector3(SCOPE_AT.x + 40, 0, -2.2); a.set("point");
        w.props.scopeScreen && (w.props.scopeScreen.visible = true);
      }
    },
    {
      caption: "To the smear and haemocytometer bench.",
      shot: [[40.4, 2.2, 2.6], [40.0, 1.3, -2.2]], hold: 5, who: "amaka",
      text: "Come to the bench. We will look at the cells, and then count them.",
      run: function (w) { reset(w); var a = w.people.amaka; a.position.set(-0.8, 0, -1.2); a.userData.faceTarget = new THREE.Vector3(SCOPE_AT.x + 40, 0, -2.2); a.set("talk"); w.props.scopeScreen && (w.props.scopeScreen.visible = true); }
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

      // ---- the okada rider, lying face up on a mat ----
      var mat = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.04, 1.0), S.std("#2f7d6b", 0.9));
      mat.position.set(RIDER_AT.x - 0.9, 0.02, RIDER_AT.z); P.market.add(mat);
      var holder = new THREE.Group();
      var rider = S.person({ skin: "#4a2e1f", outfit: "#d97b1a", pants: "#27324a", hair: "short" });
      rider.rotation.x = -Math.PI / 2;
      holder.add(rider); holder.rotation.y = Math.PI / 2; holder.position.copy(RIDER_AT);
      rider.userData.armL.rotation.z = -0.02; rider.userData.armR.rotation.z = 0.02;
      P.market.add(holder); P.rider = holder;

      // ---- the gash (a flat oval on the shin), the pad and the drops ----
      var gm = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), new THREE.MeshStandardMaterial({ color: 0xd01a2e, roughness: 0.35, emissive: 0x7a0510, emissiveIntensity: 1 }));
      gm.scale.set(1.5, 0.35, 1); gm.position.copy(GASH_AT); gm.position.y += 0.07; P.market.add(gm); P.gashMesh = gm;
      var pad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.16), S.std("#f4f1e8", 0.9));
      pad.position.copy(GASH_AT); pad.position.y += 0.13; P.market.add(pad); P.gashPad = pad;
      var drops = new THREE.Group();
      for (var d = 0; d < 3; d++) {
        var dr = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), new THREE.MeshStandardMaterial({ color: 0xc0182a, roughness: 0.3 }));
        dr.position.set(GASH_AT.x - 0.1 - d * 0.07, 0.07, GASH_AT.z + 0.17 + d * 0.05); dr.scale.y = 0.4; drops.add(dr);
      }
      P.market.add(drops); P.gashDrops = drops;

      // ---- Baba Sule's salt ----
      var salt = new THREE.Group();
      var bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.07, 18), S.std("#d9d2c2", 0.6));
      var heap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), S.std("#ffffff", 0.9)); heap.scale.y = 0.55; heap.position.y = 0.05;
      salt.add(bowl, heap); salt.position.set(1.15, 0.99, 0.2); salt.visible = false; P.market.add(salt); P.salt = salt;

      // ---- the microscope on Dr Aisha's lab bench, and its screen ----
      var steel = S.std("#c9ced6", 0.35, { metalness: 0.6 }), dark = S.std("#23262e", 0.5);
      var ms = new THREE.Group();
      var base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.4), dark); base.position.y = 0.02; ms.add(base);
      var pil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 12), dark); pil.position.set(0, 0.22, -0.12); ms.add(pil);
      var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.34, 14), steel); tube.position.set(0, 0.37, -0.02); tube.rotation.x = 0.5; ms.add(tube);
      var eye = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.1, 12), dark); eye.position.set(0, 0.5, 0.07); eye.rotation.x = 0.5; ms.add(eye);
      var stg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.015, 0.2), steel); stg.position.set(0, 0.2, 0.04); ms.add(stg);
      var obj = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.07, 10), steel); obj.position.set(0, 0.26, -0.1 + 0.14 * 0.5); ms.add(obj);
      var sl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.006, 0.05), S.std("#e8f4ff", 0.2, { transparent: true, opacity: 0.8 })); sl.position.set(0, 0.212, 0.04); ms.add(sl);
      var dropM = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), new THREE.MeshStandardMaterial({ color: 0xc0182a, roughness: 0.3 })); dropM.position.set(0, 0.22, 0.04); dropM.scale.y = 0.5; ms.add(dropM);
      ms.position.copy(SCOPE_AT); ms.position.x += 0.0; P.lab.add(ms); P.scope = ms;
      var scr = new THREE.Group();
      var frame = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.98, 0.04), S.std("#2b2f3a", 0.5));
      var face = new THREE.Mesh(new THREE.CircleGeometry(0.44, 40), new THREE.MeshBasicMaterial({ map: smearTexture() }));
      face.position.z = 0.025; scr.add(frame, face);
      scr.position.set(0.95, 1.95, -2.9); P.lab.add(scr); P.scopeScreen = scr; scr.visible = false;
    }
  });
})();
