/* Lesson 03 · 3D story: the okada rider's drip at the Oja Oba health tent, then Dr Aisha's glowing 3D body in the UCH teaching lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0.3, 2.3, 5.6], [0.3, 0.7, 0.8]];
  var DRIP = [[0.9, 1.5, 3.3], [0.4, 0.55, 0.9]];
  var HAND = [[-0.1, 1.0, 2.2], [0.8, 0.35, 0.9]];
  var LABBODY = [[39.5, 2.5, 2.4], [39.8, 1.9, -2.2]];
  var RIDER_AT = new THREE.Vector3(1.9, 0.2, 0.95);   // feet end; he lies along -x, head to the left, face up

  function reset(w) {
    var p = w.people, mk = w.props.market, lab = w.props.lab;
    // Dr Aisha lives in the lab; she is only ever shown there in this lesson
    if (p.amaka.parent !== lab) { p.amaka.parent.remove(p.amaka); lab.add(p.amaka); }
    p.amaka.position.set(-1.1, 0, -1.3); p.amaka.rotation.y = 0.15; p.amaka.userData.faceTarget = null;
    if (p.ngozi.parent !== mk) { p.ngozi.parent.remove(p.ngozi); mk.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.position.set(-1.9, 0, -1.0);
    var look = new THREE.Vector3(RIDER_AT.x - 0.9, 0, RIDER_AT.z);
    p.cust1.position.set(-0.3, 0, 2.2); p.cust1.userData.faceTarget = look;
    p.cust2.position.set(1.5, 0, 2.3); p.cust2.userData.faceTarget = look;
  }

  var beats = [
    {
      caption: "The Oja Oba health-day tent. The okada rider lies on a mat.",
      shot: WIDE, instant: true, hold: 5.5, who: "cust1",
      text: "They have laid the rider on a mat. The nurse is putting a drip line into a vein in his forearm.",
      run: function (w) { reset(w); w.props.dripGlow = 1; w.people.cust1.set("point"); w.people.cust2.set("think"); }
    },
    {
      caption: "Chidi looks at the drip bag, then at the rider's head.",
      shot: DRIP, hold: 5.5, who: "cust1",
      text: "The arm is close to the head. Will the new blood reach his brain in a second?",
      run: function (w) { reset(w); w.props.dripGlow = 1; w.people.cust1.set("talk"); w.people.cust2.set("idle"); }
    },
    {
      caption: "Baba Sule is sure.",
      shot: WIDE, hold: 5, who: "cust2",
      text: "Of course. Vein to brain, straight up!",
      run: function (w) { reset(w); w.props.dripGlow = 1; w.people.cust2.set("point"); w.people.cust1.set("think"); }
    },
    {
      caption: "UCH teaching lab. Dr Aisha switches on a glowing 3D body.",
      shot: LABBODY, instant: true, hold: 6.5, who: "amaka",
      text: "It has a much longer journey, and it must pass one organ you have forgotten.",
      run: function (w) {
        reset(w);
        var a = w.people.amaka; a.position.set(-1.5, 0, -1.6); a.userData.faceTarget = new THREE.Vector3(39.8, 0, -2.2); a.set("point");
        var b = w.props.bodyKit; if (b) { b.reset && b.reset(); b.trace && b.trace("armBrain"); }
      }
    },
    {
      caption: "To the route-tracer bench.",
      shot: [[40.2, 2.4, 3.0], [39.8, 1.9, -2.2]], hold: 5, who: "amaka",
      text: "Come to the route-tracer bench. Tap each vessel in order and see where the blood really goes.",
      run: function (w) { reset(w); var a = w.people.amaka; a.position.set(-1.5, 0, -1.6); a.userData.faceTarget = new THREE.Vector3(39.8, 0, -2.2); a.set("talk"); }
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

      // ---- the drip: stand, bag and a line to the forearm vein ----
      var steel = S.std("#c9ced6", 0.35, { metalness: 0.6 });
      var drip = new THREE.Group();
      var px = RIDER_AT.x - 0.95, pz = RIDER_AT.z + 0.62;
      var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.7, 10), steel); pole.position.set(px, 0.85, pz); drip.add(pole);
      var foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 18), steel); foot.position.set(px, 0.015, pz); drip.add(foot);
      var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), steel); arm.rotation.z = Math.PI / 2; arm.position.set(px + 0.13, 1.68, pz); drip.add(arm);
      var bagMat = new THREE.MeshPhysicalMaterial({ color: 0xdff4ff, roughness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false });
      var bag = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.22, 6, 14), bagMat); bag.position.set(px + 0.26, 1.5, pz); bag.scale.z = 0.5; drip.add(bag);
      var fluid = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.12, 6, 12), S.std("#bfe8ff", 0.2, { transparent: true, opacity: 0.8 })); fluid.position.set(px + 0.26, 1.46, pz); fluid.scale.z = 0.45; drip.add(fluid);
      var chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.09, 10), S.std("#e8f4ff", 0.2, { transparent: true, opacity: 0.7 })); chamber.position.set(px + 0.26, 1.3, pz); drip.add(chamber);
      var hand = new THREE.Vector3(RIDER_AT.x - 0.86, 0.27, RIDER_AT.z + 0.32);
      var line = new THREE.CatmullRomCurve3([
        new THREE.Vector3(px + 0.26, 1.28, pz), new THREE.Vector3(px + 0.22, 0.9, pz - 0.05),
        new THREE.Vector3(px + 0.1, 0.5, pz - 0.2), new THREE.Vector3(hand.x - 0.05, 0.33, hand.z + 0.06), hand
      ]);
      var tube = new THREE.Mesh(new THREE.TubeGeometry(line, 40, 0.009, 8, false), S.std("#e6f7ff", 0.2, { transparent: true, opacity: 0.8 })); drip.add(tube);
      var cannula = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.07, 8), S.std("#3aa6ff", 0.4)); cannula.position.copy(hand); cannula.rotation.z = Math.PI / 2; drip.add(cannula);
      var tape = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.05), S.std("#f4f1e8", 0.9)); tape.position.set(hand.x, hand.y + 0.03, hand.z); drip.add(tape);
      P.market.add(drip); P.drip = drip; P.dripBag = fluid;

      // ---- the glowing 3D body on Dr Aisha's lab bench ----
      if (window.BodyCircuit) {
        var holderB = new THREE.Group();
        var kit = BodyCircuit.create({ labels: false, bpm: 72 });
        kit.scale.setScalar(0.52);
        holderB.add(kit); holderB.position.set(-0.2, 0.99, -2.2);
        var glowDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.04, 28), S.std("#3b6cf6", 0.4, { emissive: new THREE.Color(0x1a3a9a), emissiveIntensity: 0.9 }));
        glowDisc.position.y = -0.02; holderB.add(glowDisc);
        P.lab.add(holderB); P.bodyHolder = holderB; P.bodyKit = kit;
        holderB.visible = true;
      }
      P.dripGlow = 0;
    },
    onTick: function (api, dt, t) {
      var P = api.props;
      if (P.bodyKit && api.stage.camera.position.x > 20) P.bodyKit.update(dt, t);    // animate only while the lab is on screen
      if (P.dripBag) P.dripBag.material.emissiveIntensity = 0.1 + 0.08 * Math.sin(t * 3);
    }
  });
})();
