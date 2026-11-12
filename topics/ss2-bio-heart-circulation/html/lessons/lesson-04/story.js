/* Lesson 04 · 3D story: Chidi, breathless after his sprint, has his pulse counted in the Oja Oba health tent (33 beats in 15 s),
   then Dr Aisha shows a beating heart model in the UCH teaching lab. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0.3, 2.3, 5.6], [0.3, 0.8, 0.8]];
  var PAIR = [[0.5, 1.9, 4.2], [0.3, 1.15, 1.4]];
  var WRIST = [[0.4, 1.5, 3.3], [0.3, 1.0, 1.5]];
  var LAB = [[39.6, 2.4, 3.2], [39.6, 1.5, -1.8]];
  var HEARTLAB = [[40.0, 2.0, 2.4], [39.7, 1.6, -2.1]];

  function reset(w) {
    var p = w.people, mk = w.props.market, lab = w.props.lab;
    if (p.ngozi.parent !== mk) { p.ngozi.parent.remove(p.ngozi); mk.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.position.set(-1.9, 0, -1.0);
    // Dr Aisha counts pulses in the tent first, then walks into the lab
    if (p.amaka.parent !== mk) { p.amaka.parent.remove(p.amaka); mk.add(p.amaka); }
    p.amaka.position.set(1.0, 0, 2.15); p.amaka.rotation.y = -0.5; p.amaka.userData.faceTarget = new THREE.Vector3(0.1, 0, 2.2);
    p.cust1.position.set(0.1, 0, 2.2); p.cust1.userData.faceTarget = new THREE.Vector3(1.0, 0, 2.15);
    p.cust2.position.set(-1.0, 0, 2.5); p.cust2.userData.faceTarget = new THREE.Vector3(0.1, 0, 2.2);
    w.props.watchGlow = 0;
  }
  function toLab(w) {
    var p = w.people, lab = w.props.lab;
    if (p.amaka.parent !== lab) { p.amaka.parent.remove(p.amaka); lab.add(p.amaka); }
    p.amaka.position.set(-1.6, 0, -1.4); p.amaka.userData.faceTarget = new THREE.Vector3(39.7, 0, -2.1);
  }

  var beats = [
    {
      caption: "The Oja Oba health tent. Dr Aisha counts Chidi's pulse for 15 seconds.",
      shot: WIDE, instant: true, hold: 6, who: "amaka",
      text: "Chidi is back from his sprint, panting. Dr Aisha holds his wrist and counts for fifteen seconds: thirty-three beats.",
      run: function (w) { reset(w); w.props.watchGlow = 1; w.people.amaka.set("point"); w.people.cust1.set("sad"); w.people.cust2.set("idle"); }
    },
    {
      caption: "The stethoscope: lub-dub, lub-dub, racing.",
      shot: PAIR, hold: 5.5, who: "cust1",
      text: "She hands him the stethoscope. Lub-dub, lub-dub, lub-dub: it is racing in his ears.",
      run: function (w) { reset(w); w.props.watchGlow = 0; w.people.cust1.set("think"); w.people.amaka.set("talk"); w.people.cust2.set("idle"); }
    },
    {
      caption: "Baba Sule has an explanation.",
      shot: WIDE, hold: 6, who: "cust2",
      text: "That is his brain kicking the heart. And the noise is the heart muscle clapping.",
      run: function (w) { reset(w); w.people.cust2.set("point"); w.people.cust1.set("think"); w.people.amaka.set("idle"); }
    },
    {
      caption: "Dr Aisha is not so sure.",
      shot: PAIR, hold: 6, who: "amaka",
      text: "Five minutes from now it will be back near sixty-eight. Let's see why, and what that knocking really is.",
      run: function (w) { reset(w); w.people.amaka.set("talk"); w.people.cust1.set("idle"); w.people.cust2.set("think"); }
    },
    {
      caption: "UCH teaching lab. A model heart beats on the bench.",
      shot: HEARTLAB, instant: true, hold: 6, who: "amaka",
      text: "Come to the pulse bench. We will count, run, count again, and watch the heart behind every beat.",
      run: function (w) { reset(w); toLab(w); w.people.amaka.set("talk"); }
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

      // ---- tent: a small table with a stopwatch and a stethoscope ----
      var steel = S.std("#c9ced6", 0.3, { metalness: 0.7 });
      var tbl = new THREE.Group();
      var top = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.5), S.std("#8a5a2b", 0.8)); top.position.set(0, 0.8, 0); tbl.add(top);
      [[-0.4, -0.2], [0.4, -0.2], [-0.4, 0.2], [0.4, 0.2]].forEach(function (q) {
        var l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.78, 0.05), S.std("#6d4520", 0.8)); l.position.set(q[0], 0.39, q[1]); tbl.add(l);
      });
      var sw = new THREE.Group();
      var caseM = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 24), steel); caseM.rotation.x = Math.PI / 2; sw.add(caseM);
      var faceM = new THREE.Mesh(new THREE.CircleGeometry(0.063, 24), new THREE.MeshStandardMaterial({ color: 0xfff8e8, roughness: 0.5, emissive: 0xffb02e, emissiveIntensity: 0 }));
      faceM.position.z = 0.017; sw.add(faceM);
      var hand = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.05, 0.004), S.std("#c8264a", 0.5)); hand.position.set(0, 0.022, 0.02); hand.geometry.translate(0, 0.0, 0); sw.add(hand);
      sw.position.set(0.15, 0.89, 0.02); sw.rotation.x = -1.2; tbl.add(sw);
      var tube = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 28, Math.PI * 1.6), S.std("#222a38", 0.6)); tube.position.set(-0.2, 0.9, 0.05); tube.rotation.x = -Math.PI / 2; tbl.add(tube);
      var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 16), steel); disc.position.set(-0.2, 0.83, 0.17); tbl.add(disc);
      tbl.position.set(0.55, 0, 1.3); P.market.add(tbl);
      P.watchFace = faceM; P.watchHand = hand;

      // ---- lab: a beating heart on the bench, built the first time the camera reaches the lab (about 120 000 triangles) ----
      var light = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 4) <= 2;
      P.labHeartWanted = !!window.HeartKit && !light;
      if (P.labHeartWanted) {
        var stand = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.07, 28), S.std("#3b6cf6", 0.4, { emissive: new THREE.Color(0x1a3a9a), emissiveIntensity: 0.8 }));
        stand.position.set(-0.1, 1.0, -2.2); P.lab.add(stand);
      }
      P.watchGlow = 0;
    },
    onTick: function (api, dt, t) {
      var P = api.props;
      if (P.labHeartWanted && !P.labHeart && api.stage.camera.position.x > 20) {
        var heart = HeartKit.heart({ mode: "pace", bpm: 72, labels: false });
        heart.scale.setScalar(0.52); heart.position.set(-0.1, 1.45, -2.2); P.lab.add(heart); P.labHeart = heart;
      }
      if (P.labHeart && api.stage.camera.position.x > 20 && P.labHeart.userData.update) P.labHeart.userData.update(dt, t);
      if (P.watchFace) P.watchFace.material.emissiveIntensity = (P.watchGlow || 0) * (0.35 + 0.25 * Math.sin(t * 6));
      if (P.watchHand) P.watchHand.rotation.z = -t * 1.2;
    }
  });
})();
