/* =========================================================
   StudyPipe · StoryStage — animated 3D story scenes (offline)
   A small world with two sets: a Lagos market stall (x≈0) and
   a quality-control laboratory (x≈40). Characters are built
   from simple shapes and can idle, talk, wave, walk, look sad,
   hold things, and point. Lessons drive it with "beats".
   Depends on: three.min.js, scene-kit.js
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  // ---------- textures ----------
  function ankara(c1, c2, c3) {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = c1; g.fillRect(0, 0, 256, 256);
    for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
      var cx = x * 64 + 32 + (y % 2) * 32, cy = y * 64 + 32;
      g.fillStyle = c2; g.beginPath(); g.arc(cx, cy, 22, 0, Math.PI * 2); g.fill();
      g.fillStyle = c3; g.beginPath(); g.arc(cx, cy, 11, 0, Math.PI * 2); g.fill();
      g.strokeStyle = c3; g.lineWidth = 4; g.beginPath(); g.moveTo(cx - 32, cy + 32); g.lineTo(cx, cy + 10); g.lineTo(cx + 32, cy + 32); g.stroke();
    }
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2);
    return t;
  }
  function stripes(a, b, n) {
    var c = document.createElement("canvas"); c.width = 256; c.height = 16;
    var g = c.getContext("2d");
    for (var i = 0; i < n; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(i * 256 / n, 0, 256 / n + 1, 16); }
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  }
  function skyTexture(top, bottom) {
    var c = document.createElement("canvas"); c.width = 4; c.height = 256;
    var g = c.getContext("2d"); var gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, top); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  }
  function std(color, rough, extra) {
    var o = { color: color, roughness: rough == null ? 0.7 : rough, metalness: 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function sign(text, bg, color, h) {
    var tex = SceneKit.labelTexture(text, { size: 64, bg: bg || "rgba(27,24,19,0.92)", color: color || "#fff", font: "Fraunces, Georgia, serif", weight: 700 });
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    h = h || 0.5; s.scale.set(h * tex.userData.aspect, h, 1);
    return s;
  }

  // ---------- people ----------
  var SKIN = ["#5a3825", "#6e4630", "#4a2e1f", "#7a5236", "#3d2618"];
  function person(o) {
    o = o || {};
    var root = new THREE.Group();
    var skin = std(o.skin || SKIN[0], 0.6);
    var outfitMat = o.pattern ? new THREE.MeshStandardMaterial({ map: o.pattern, roughness: 0.75 }) : std(o.outfit || "#2a5db0", 0.75);
    var coat = o.coat ? std("#f4f6f8", 0.6) : null;
    var body = new THREE.Group(); root.add(body);

    // legs / wrapper
    var legL, legR;
    if (o.wrapper) {
      var skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.36, 0.85, 20), outfitMat);
      skirt.position.y = 0.48; body.add(skirt);
      legL = new THREE.Group(); legR = new THREE.Group();
    } else {
      var pants = std(o.pants || "#23314f", 0.8);
      legL = new THREE.Group(); legR = new THREE.Group();
      [legL, legR].forEach(function (lg, i) {
        var m = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.82, 10), pants);
        m.position.y = -0.41; lg.add(m);
        lg.position.set(i ? 0.11 : -0.11, 0.86, 0); body.add(lg);
      });
    }
    // shoes
    [-0.11, 0.11].forEach(function (x) {
      var s = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.24), std("#1d1a17", 0.5));
      s.position.set(x, 0.035, 0.04); body.add(s);
    });
    // torso
    var torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.42, 6, 16), coat || outfitMat);
    torso.position.y = 1.18; torso.scale.set(1, 1, 0.78); body.add(torso);
    if (coat) {
      var coatTail = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.32, 0.5, 16, 1, true), coat);
      coatTail.position.y = 0.78; coatTail.material.side = THREE.DoubleSide; body.add(coatTail);
      var shirt = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.05), outfitMat); shirt.position.set(0, 1.3, 0.19); body.add(shirt);
    }
    // arms (pivot at shoulder)
    function arm(side) {
      var p = new THREE.Group(); p.position.set(side * 0.31, 1.44, 0);
      var upper = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.56, 10), coat || outfitMat);
      upper.position.y = -0.28; p.add(upper);
      var hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), skin); hand.position.y = -0.59; p.add(hand);
      p.rotation.z = side * 0.12;
      p.userData.hand = hand;
      body.add(p); return p;
    }
    var armL = arm(-1), armR = arm(1);
    // neck + head
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 10), skin); neck.position.y = 1.62; body.add(neck);
    var head = new THREE.Group(); head.position.y = 1.82; body.add(head);
    var skull = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 18), skin); skull.scale.set(0.95, 1.08, 1); head.add(skull);
    var eyeM = std("#111", 0.3);
    [-0.065, 0.065].forEach(function (x) {
      var w = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), std("#fff", 0.3)); w.position.set(x, 0.03, 0.165); w.scale.z = 0.5; head.add(w);
      var e = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), eyeM); e.position.set(x, 0.03, 0.18); head.add(e);
    });
    var mouth = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.014, 0.02), std("#3a1410", 0.5)); mouth.position.set(0, -0.07, 0.175); head.add(mouth);
    // headwear / hair
    if (o.gele) {
      var gm = new THREE.MeshStandardMaterial({ map: o.gele, roughness: 0.6, side: THREE.DoubleSide });
      var wrap = new THREE.Mesh(new THREE.SphereGeometry(0.205, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), gm); wrap.position.y = 0.04; head.add(wrap);
      var fan = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.32, 20, 1, true), gm); fan.position.set(0, 0.26, -0.03); fan.rotation.x = Math.PI; fan.scale.set(1, 1, 0.7); head.add(fan);
      var knot = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.045, 10, 20), gm); knot.position.set(0.09, 0.32, 0.02); knot.rotation.set(0.4, 0.6, 0.3); head.add(knot);
    } else if (o.hair === "bun") {
      var hm = std("#1a1311", 0.9);
      var cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), hm); cap.position.y = 0.035; head.add(cap);
      var bun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), hm); bun.position.set(0, 0.17, -0.12); head.add(bun);
    } else if (o.hair === "short") {
      var hs = new THREE.Mesh(new THREE.SphereGeometry(0.197, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.45), std("#141010", 0.95)); hs.position.y = 0.03; head.add(hs);
    } else if (o.cap) {
      var cm = std(o.cap, 0.8);
      var cp = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.17, 20), cm); cp.position.y = 0.18; head.add(cp);
    }
    if (o.goggles) {
      var gg = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 8, 24, Math.PI), std("#7cc4ff", 0.2, { transparent: true, opacity: 0.85 }));
      gg.position.set(0, 0.11, 0.02); gg.rotation.set(-0.35, 0, 0); head.add(gg);
    }

    root.userData = {
      body: body, head: head, mouth: mouth, armL: armL, armR: armR, legL: legL, legR: legR,
      state: "idle", t: Math.random() * 10, target: null, speed: 1.2, holding: null, faceTarget: null
    };
    root.set = function (s) { root.userData.state = s; return root; };
    root.walkTo = function (x, z, then) { root.userData.target = new THREE.Vector3(x, 0, z); root.userData.after = then || "idle"; root.userData.state = "walk"; return root; };
    root.hold = function (obj, side) {
      var hand = (side === "left" ? armL : armR).userData.hand;
      if (root.userData.holding) root.userData.holding.parent && root.userData.holding.parent.remove(root.userData.holding);
      if (obj) { obj.position.set(0, -0.12, 0.06); obj.rotation.set(0, 0, 0); hand.add(obj); }
      root.userData.holding = obj || null; root.userData.holdSide = side || "right";
      return root;
    };
    root.update = function (dt) { animatePerson(root, dt); };
    return root;
  }

  function damp(a, b, k, dt) { return a + (b - a) * Math.min(1, dt * k); }
  function animatePerson(p, dt) {
    var u = p.userData; u.t += dt;
    var t = u.t, s = u.state;
    var armLz = -0.12, armRz = 0.12, armLx = 0, armRx = 0, headX = 0, headY = 0, headZ = 0, bob = 0, mouthS = 1, legSwing = 0;
    bob = Math.sin(t * 2) * 0.006;
    if (s === "talk") { mouthS = 1 + Math.abs(Math.sin(t * 14)) * 2.6; headY = Math.sin(t * 1.7) * 0.12; armRx = -0.5 + Math.sin(t * 3) * 0.25; armRz = 0.25; }
    if (s === "wave") { armRz = 2.6 + Math.sin(t * 9) * 0.35; mouthS = 1.8; headZ = 0.08; }
    if (s === "sad") { headX = 0.35; armLz = -0.05; armRz = 0.05; bob = Math.sin(t * 1.2) * 0.004; }
    if (s === "point") { armRx = -1.45; armRz = 0.15; mouthS = 1 + Math.abs(Math.sin(t * 12)) * 2; }
    if (s === "think") { armRx = -2.1; armRz = -0.65; headZ = 0.15; headX = -0.1; }
    if (s === "cheer") { armRz = 2.7 + Math.sin(t * 10) * 0.2; armLz = -2.7 - Math.sin(t * 10) * 0.2; bob = Math.abs(Math.sin(t * 7)) * 0.08; mouthS = 3; }
    if (s === "work") { armRx = -0.9 + Math.sin(t * 4) * 0.15; armLx = -0.8 + Math.cos(t * 4) * 0.15; headX = 0.25; }
    if (u.holding && s !== "wave" && s !== "cheer") { if (u.holdSide === "left") { armLx = -0.85; } else { armRx = Math.min(armRx, -0.85); } }
    if (s === "walk" && u.target) {
      var d = new THREE.Vector3(u.target.x - p.position.x, 0, u.target.z - p.position.z);
      var dist = d.length();
      if (dist < 0.05) { u.state = u.after || "idle"; }
      else {
        d.normalize();
        var step = Math.min(dist, u.speed * dt);
        p.position.x += d.x * step; p.position.z += d.z * step;
        var ang = Math.atan2(d.x, d.z);
        p.rotation.y = damp(p.rotation.y, ang, 8, dt);
        legSwing = Math.sin(t * 9) * 0.5; bob = Math.abs(Math.sin(t * 9)) * 0.04;
        armLx = Math.sin(t * 9) * 0.4; armRx = u.holding ? -0.85 : -Math.sin(t * 9) * 0.4;
      }
    } else if (u.faceTarget) {
      var fd = new THREE.Vector3(u.faceTarget.x - p.position.x, 0, u.faceTarget.z - p.position.z);
      p.rotation.y = damp(p.rotation.y, Math.atan2(fd.x, fd.z), 4, dt);
    }
    u.body.position.y = bob;
    u.armL.rotation.z = damp(u.armL.rotation.z, armLz, 10, dt); u.armR.rotation.z = damp(u.armR.rotation.z, armRz, 10, dt);
    u.armL.rotation.x = damp(u.armL.rotation.x, armLx, 10, dt); u.armR.rotation.x = damp(u.armR.rotation.x, armRx, 10, dt);
    u.head.rotation.x = damp(u.head.rotation.x, headX, 6, dt); u.head.rotation.y = damp(u.head.rotation.y, headY, 6, dt); u.head.rotation.z = damp(u.head.rotation.z, headZ, 6, dt);
    u.mouth.scale.y = damp(u.mouth.scale.y, mouthS, 20, dt);
    u.legL.rotation.x = legSwing; u.legR.rotation.x = -legSwing;
  }

  // ---------- props ----------
  function bottle(liquid, labelText) {
    var g = new THREE.Group();
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1, depthWrite: false });
    var b = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.26, 16), glass); b.position.y = 0.13; g.add(b);
    var n = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.08, 12), glass); n.position.y = 0.3; g.add(n);
    var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.04, 12), std("#c8264a", 0.4)); cap.position.y = 0.355; g.add(cap);
    var liq = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.067, 0.2, 16), std(liquid || "#f0d58a", 0.2, { transparent: true, opacity: 0.85 })); liq.position.y = 0.11; g.add(liq);
    var lab = new THREE.Mesh(new THREE.CylinderGeometry(0.077, 0.077, 0.08, 16, 1, true), std("#fffaf2", 0.6)); lab.position.y = 0.14; g.add(lab);
    if (labelText) { var s = sign(labelText, "rgba(200,38,74,0.95)", "#fff", 0.16); s.position.y = 0.52; g.add(s); g.userData.tag = s; }
    g.userData.liquid = liq;
    return g;
  }
  function jar() {
    var g = new THREE.Group();
    var j = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 16), std("#c0201a", 0.25, { transparent: true, opacity: 0.92 })); j.position.y = 0.09; g.add(j);
    var l = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.04, 16), std("#f4f1ea", 0.4)); l.position.y = 0.2; g.add(l);
    return g;
  }
  function jerrycan() {
    var g = new THREE.Group();
    var m = std("#f2c230", 0.45);
    var b = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.22), m); b.position.y = 0.28; g.add(b);
    var h = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI), m); h.position.set(-0.05, 0.58, 0); g.add(h);
    var sp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.1, 10), std("#d1442b", 0.5)); sp.position.set(0.14, 0.6, 0); g.add(sp);
    var lab = sign("VINEGAR 5%", "rgba(255,255,255,0.95)", "#1b1813", 0.12); lab.position.set(0, 0.3, 0.16); g.add(lab);
    return g;
  }
  function stall(canopyA, canopyB) {
    var g = new THREE.Group();
    var wood = std("#7a5230", 0.85);
    var top = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.1), wood); top.position.y = 0.9; g.add(top);
    var cloth = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.5, 0.02), new THREE.MeshStandardMaterial({ map: ankara("#1f6f5c", "#f2c230", "#c8264a"), roughness: 0.8 }));
    cloth.position.set(0, 0.62, 0.56); g.add(cloth);
    [[-1.2, -0.48], [1.2, -0.48], [-1.2, 0.48], [1.2, 0.48]].forEach(function (p) {
      var l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), wood); l.position.set(p[0], 0.45, p[1]); g.add(l);
    });
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 8), std("#ddd", 0.4)); pole.position.set(0, 1.15, -0.2); g.add(pole);
    var um = new THREE.Mesh(new THREE.ConeGeometry(1.9, 0.6, 16, 1, true), new THREE.MeshStandardMaterial({ map: stripes(canopyA || "#c8264a", canopyB || "#fff4e0", 16), side: THREE.DoubleSide, roughness: 0.8 }));
    um.position.set(0, 2.45, -0.2); g.add(um);
    return g;
  }
  function building(w, h, d, color) {
    var g = new THREE.Group();
    var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std(color, 0.9)); b.position.y = h / 2; g.add(b);
    var roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.12, d + 0.3), std("#6b6f78", 0.6)); roof.position.y = h + 0.06; g.add(roof);
    for (var i = 0; i < Math.floor(w / 1.2); i++) {
      var win = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.02), std("#1e2b40", 0.2)); win.position.set(-w / 2 + 0.7 + i * 1.2, h * 0.6, d / 2 + 0.01); g.add(win);
    }
    return g;
  }

  // ---------- lab props ----------
  function labBench(w) {
    var g = new THREE.Group();
    var top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 1.1), std("#2b3446", 0.35)); top.position.y = 0.95; g.add(top);
    var body = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.9, 1.0), std("#e9e4da", 0.8)); body.position.y = 0.46; g.add(body);
    return g;
  }
  function balanceProp() {
    var g = new THREE.Group();
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.42), std("#f2f2f2", 0.4)); base.position.y = 0.05; g.add(base);
    var pan = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.015, 24), std("#b8c0cc", 0.25, { metalness: 0.8 })); pan.position.set(0, 0.12, -0.03); g.add(pan);
    var disp = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.07), new THREE.MeshBasicMaterial({ color: 0x6fe3a8 })); disp.position.set(0, 0.07, 0.212); disp.rotation.x = -0.2; g.add(disp);
    return g;
  }
  function flaskProp(color) {
    var g = new THREE.Group();
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.3, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide });
    var pts = [[0, 0], [0.16, 0], [0.17, 0.03], [0.05, 0.24], [0.05, 0.34]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 24), glass));
    var liq = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.12, 24), std(color || "#ff3d8b", 0.2, { transparent: true, opacity: 0.85 }));
    liq.position.y = 0.06; liq.rotation.x = Math.PI; liq.scale.y = -1; g.add(liq);
    g.userData.liquid = liq;
    return g;
  }
  function buretteProp() {
    var g = new THREE.Group();
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), std("#9aa3b8", 0.3, { metalness: 0.8 })); rod.position.set(-0.25, 0.7, 0); g.add(rod);
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.35), std("#23293a", 0.5)); base.position.set(-0.1, 0.02, 0); g.add(base);
    var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6), std("#9aa3b8", 0.3, { metalness: 0.8 })); arm.rotation.z = Math.PI / 2; arm.position.set(-0.12, 1.1, 0); g.add(arm);
    var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 12), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, roughness: 0.05 })); tube.position.set(0, 0.9, 0); g.add(tube);
    return g;
  }

  // =========================================================
  // createStory({ root, canvas, bubble, beats, onBeat })
  // =========================================================
  function createStory(o) {
    var stage = SceneKit.createStage({ root: o.root, canvas: o.canvas, fov: 38, target: new THREE.Vector3(0, 1.2, 0), noOrbit: true, distance: 8, onFrame: frame });
    if (!stage) return null;
    var scene = stage.scene, world = stage.rig;
    stage.renderer.toneMappingExposure = 0.82;
    scene.environment = null; stage.envOff = true; // keep the story colours rich and saturated (no env map)
    var reduce = stage.reduceMotion;

    // sky + ground
    var sky = new THREE.Mesh(new THREE.SphereGeometry(90, 24, 16), new THREE.MeshBasicMaterial({ map: skyTexture("#5aa7e8", "#ffd9a3"), side: THREE.BackSide, depthWrite: false }));
    scene.add(sky);
    var sun = new THREE.DirectionalLight(0xfff1d6, 1.1); sun.position.set(-8, 14, 10); scene.add(sun);
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 60), std("#c7a272", 0.95)); ground.rotation.x = -Math.PI / 2; world.add(ground);
    var road = new THREE.Mesh(new THREE.PlaneGeometry(140, 3), std("#5b5650", 0.9)); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, 4.5); world.add(road);

    // ---- MARKET SET (x≈0) ----
    var market = new THREE.Group(); world.add(market);
    var mainStall = stall("#c8264a", "#fff4e0"); market.add(mainStall);
    var jars = [];
    for (var i = 0; i < 9; i++) { var jj = jar(); jj.position.set(-1.0 + (i % 5) * 0.28, 0.94, -0.25 + Math.floor(i / 5) * 0.28); market.add(jj); jars.push(jj); }
    var can = jerrycan(); can.position.set(1.65, 0, 0.2); can.rotation.y = -0.4; market.add(can);
    var bottleA = bottle("#f0d58a", "A"), bottleB = bottle("#f4e3b0", "B");
    bottleA.position.set(0.55, 0.94, 0.1); bottleB.position.set(0.85, 0.94, 0.1); market.add(bottleA); market.add(bottleB);
    [[-4.2, -1.5, "#2b6cb0", "#ffe9a8"], [4.3, -1.2, "#0d9c7e", "#fff"], [-7.5, -0.5, "#d98a00", "#fff4e0"], [7.8, -0.8, "#7b4dd8", "#ffe9a8"]].forEach(function (p) {
      var s = stall(p[2], p[3]); s.position.set(p[0], 0, p[1]); s.scale.setScalar(0.95); market.add(s);
      for (var k = 0; k < 6; k++) {
        var produce = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), std(["#e2372b", "#f2a71b", "#3f9a3a", "#c8264a"][k % 4], 0.6));
        produce.position.set(p[0] - 0.8 + k * 0.3, 0.98, p[1]); market.add(produce);
      }
    });
    [[-9, -6, 5, 3.5, "#e8d6b8"], [-3, -7, 6, 4.5, "#f1c9a5"], [4, -6.5, 5, 3.2, "#cfe0e8"], [10, -6, 6, 4, "#e9e1cf"]].forEach(function (b) {
      var bd = building(b[2], b[3], 3, b[4]); bd.position.set(b[0], 0, b[1]); market.add(bd);
    });
    var mSign = sign("MILE 12 MARKET · LAGOS", "rgba(13,156,126,0.95)", "#fff", 0.55); mSign.position.set(0, 3.6, -1.6); market.add(mSign);

    // ---- LAB SET (x≈40) ----
    var lab = new THREE.Group(); lab.position.x = 40; world.add(lab);
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 9), std("#dfe4ea", 0.6)); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.012; lab.add(floor);
    var wallM = std("#f3f5f8", 0.85);
    var back = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallM); back.position.set(0, 2.1, -3.2); lab.add(back);
    var left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 6.5), wallM); left.position.set(-6, 2.1, 0); lab.add(left);
    var win = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), new THREE.MeshBasicMaterial({ map: skyTexture("#7cc4ff", "#e8f4ff") })); win.position.set(2.8, 2.5, -3.09); lab.add(win);
    var bench = labBench(5); bench.position.set(-0.5, 0, -2.3); lab.add(bench);
    var bal = balanceProp(); bal.position.set(-2.2, 0.99, -2.2); lab.add(bal);
    var bur = buretteProp(); bur.position.set(0.6, 0.99, -2.35); lab.add(bur);
    var labFlask = flaskProp("#ff3d8b"); labFlask.position.set(0.6, 0.99, -2.25); lab.add(labFlask);
    for (var r = 0; r < 4; r++) { var rb = bottle(["#dfeeff", "#ffe9c2", "#e6ffe9", "#ffdfe8"][r]); rb.position.set(1.6 + r * 0.25, 0.99, -2.55); rb.scale.setScalar(1.3); lab.add(rb); }
    var vflask = new THREE.Group();
    var vglass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.3, clearcoat: 1, depthWrite: false });
    var vb = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 14), vglass); vb.position.y = 0.17; vflask.add(vb);
    var vn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 12), vglass); vn.position.y = 0.52; vflask.add(vn);
    var vl = new THREE.Mesh(new THREE.SphereGeometry(0.155, 20, 14), std("#dff1ff", 0.2, { transparent: true, opacity: 0.7 })); vl.position.y = 0.16; vl.scale.y = 0.9; vflask.add(vl);
    vflask.position.set(-1.2, 0.99, -2.2); lab.add(vflask);
    var lSign = sign("FOOD & DRUG QUALITY LAB", "rgba(59,108,246,0.95)", "#fff", 0.42); lSign.position.set(-1.5, 3.4, -3.05); lab.add(lSign);
    var outside = new THREE.Mesh(new THREE.PlaneGeometry(14, 4.5), std("#cfd8e3", 0.9)); outside.position.set(0, 2.25, 3.4); outside.rotation.y = Math.PI; lab.add(outside);

    // ---- CHARACTERS ----
    var ngozi = person({ skin: SKIN[1], pattern: ankara("#c8264a", "#f2c230", "#1f6f5c"), wrapper: true, gele: ankara("#f2c230", "#c8264a", "#ffffff") });
    ngozi.position.set(0, 0, -1.0); market.add(ngozi);
    var cust1 = person({ skin: SKIN[2], outfit: "#2b6cb0", pants: "#1c2433", hair: "short" });
    cust1.position.set(-1.1, 0, 1.6); cust1.rotation.y = Math.PI * 0.85; market.add(cust1);
    var cust2 = person({ skin: SKIN[3], pattern: ankara("#7b4dd8", "#3ee6c4", "#fff"), wrapper: true, hair: "bun" });
    cust2.position.set(0.9, 0, 1.7); cust2.rotation.y = Math.PI * 1.1; market.add(cust2);
    var amaka = person({ skin: SKIN[0], outfit: "#0d9c7e", coat: true, hair: "bun", goggles: true, pants: "#2b3446" });
    amaka.position.set(-1.0, 0, -1.3); lab.add(amaka);
    var people = { ngozi: ngozi, cust1: cust1, cust2: cust2, amaka: amaka };
    cust1.userData.faceTarget = new THREE.Vector3(0, 0, -1); cust2.userData.faceTarget = new THREE.Vector3(0, 0, -1);
    ngozi.rotation.y = 0;

    var props = { bottleA: bottleA, bottleB: bottleB, jars: jars, can: can, balance: bal, burette: bur, flask: labFlask, vflask: vflask, market: market, lab: lab, mSign: mSign, lSign: lSign, bench: bench };

    // ---- camera shots ----
    var cam = { pos: new THREE.Vector3(0, 2.4, 6.5), look: new THREE.Vector3(0, 1.2, 0) };
    var camNow = { pos: cam.pos.clone(), look: cam.look.clone() };
    function shot(pos, look, instant) {
      cam.pos.set(pos[0], pos[1], pos[2]); cam.look.set(look[0], look[1], look[2]);
      // a long jump (e.g. market → lab) is a cut, not a fly-through walls
      if (instant || reduce || camNow.pos.distanceTo(cam.pos) > 12) { camNow.pos.copy(cam.pos); camNow.look.copy(cam.look); }
    }

    // ---- speech bubble (HTML) ----
    var bubble = o.bubble, bubbleWho = null, bubbleOffset = 2.35;
    var headPos = new THREE.Vector3();
    function say(who, text) {
      if (!bubble) return;
      if (!who || !text) { bubble.classList.remove("on"); bubbleWho = null; return; }
      bubbleWho = people[who];
      var NAMES = { ngozi: "Mama Ngozi", cust1: "Customer", cust2: "Customer", amaka: "Dr Amaka" };
      if (o.names) for (var nk in o.names) NAMES[nk] = o.names[nk];
      bubble.innerHTML = "<b>" + NAMES[who] + "</b>" + text;
      bubble.classList.remove("on"); void bubble.offsetWidth; bubble.classList.add("on");
    }

    // ---- beats ----
    var beats = o.beats || [];
    var beatIndex = -1, beatTimer = null, autoplay = false;
    var api = {
      stage: stage, people: people, props: props, shot: shot, say: say, person: person, bottle: bottle,
      beat: function (i) {
        if (!beats.length) return;
        i = Math.max(0, Math.min(beats.length - 1, i));
        beatIndex = i;
        var b = beats[i];
        Object.keys(people).forEach(function (k) { if (people[k].userData.state !== "walk") people[k].set("idle"); });
        if (b.shot) shot(b.shot[0], b.shot[1], b.instant);
        if (b.run) b.run(api);
        say(b.who, b.text);
        if (o.onBeat) o.onBeat(i, b);
        document.dispatchEvent(new CustomEvent("story:beat", { detail: { story: o.name, index: i, last: i === beats.length - 1 } }));
        clearTimeout(beatTimer);
        if (autoplay && i < beats.length - 1) beatTimer = setTimeout(function () { api.beat(i + 1); }, (b.hold || 5) * 1000);
        else if (autoplay) { autoplay = false; if (o.onAutoEnd) o.onAutoEnd(); }
      },
      next: function () { api.beat(beatIndex + 1); },
      prev: function () { api.beat(beatIndex - 1); },
      play: function () { autoplay = true; api.beat(beatIndex < 0 || beatIndex >= beats.length - 1 ? 0 : beatIndex + 1); },
      stop: function () { autoplay = false; clearTimeout(beatTimer); },
      playing: function () { return autoplay; },
      index: function () { return beatIndex; },
      count: function () { return beats.length; },
      rect: function (who) {
        var p = people[who] || props[who];
        return p ? stage.rectOf(p, 16) : null;
      },
      highlight: function (who) { highlightWho = who || null; },
      world: world, sign: sign, std: std
    };
    if (o.setup) o.setup(api);

    var highlightWho = null;
    var glow = SceneKit.glowSprite("rgba(255,178,63,0.85)", 2.4); glow.material.opacity = 0; world.add(glow);

    function frame(dt, t) {
      // camera follows the current shot (overrides the stage orbit)
      var k = Math.min(1, dt * 1.8);
      camNow.pos.lerp(cam.pos, k); camNow.look.lerp(cam.look, k);
      stage.camera.position.copy(camNow.pos);
      stage.camera.lookAt(camNow.look);
      Object.keys(people).forEach(function (n) { people[n].update(dt); });
      if (o.onTick) o.onTick(api, dt, t);
      // gentle market life
      if (!reduce && props.bottleA && props.bottleA.userData.tag) props.bottleA.userData.tag.position.y = 0.52 + Math.sin(t * 2) * 0.02;
      // bubble follows the speaker's head
      if (bubbleWho && bubble) {
        bubbleWho.updateWorldMatrix(true, false);
        headPos.set(0, bubbleOffset, 0).applyMatrix4(bubbleWho.matrixWorld).project(stage.camera);
        var rect = o.canvas.getBoundingClientRect();
        var x = (headPos.x * 0.5 + 0.5) * rect.width, y = (-headPos.y * 0.5 + 0.5) * rect.height;
        var hw = bubble.offsetWidth / 2 + 10, bh = bubble.offsetHeight + 24;
        bubble.style.left = Math.max(hw, Math.min(rect.width - hw, x)) + "px";
        bubble.style.top = Math.max(bh + 8, Math.min(rect.height - 20, y)) + "px";
      }
      // narrator highlight glow
      var target = highlightWho && (people[highlightWho] || props[highlightWho]);
      if (target) { target.getWorldPosition(glow.position); glow.position.y += 1.0; }
      glow.material.opacity = damp(glow.material.opacity, target ? 0.55 + 0.25 * Math.sin(t * 5) : 0, 6, dt);
    }

    stage.start();
    return api;
  }

  /**
   * wire(rootId, name, beats): builds a story inside a .stage element that contains
   * canvas, .story-bubble, [data-story-prev|next|play], .story-count and .story-dots.
   * Registers it as window.StudyScenes[name] so the narrator can drive and point at it.
   */
  function wire(rootId, name, beats, opts) {
    opts = opts || {};
    var root = document.getElementById(rootId);
    if (!root) return null;
    var canvas = root.querySelector("canvas");
    var bubble = root.querySelector(".story-bubble");
    var count = root.querySelector(".story-count");
    var dots = root.querySelector(".story-dots");
    var playBtn = root.querySelector("[data-story-play]");
    if (dots) beats.forEach(function (b, i) {
      var d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", "Scene " + (i + 1));
      d.addEventListener("click", function () { story && (story.stop(), story.beat(i)); });
      dots.appendChild(d);
    });
    function paint(i) {
      if (count) count.textContent = "Scene " + (i + 1) + " of " + beats.length;
      if (dots) Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle("on", k === i); d.classList.toggle("seen", k < i); });
      var cap = root.querySelector(".story-caption");
      if (cap) cap.textContent = beats[i].caption || "";
    }
    var story = createStory({
      root: root, canvas: canvas, bubble: bubble, beats: beats, name: name, names: opts.names, setup: opts.setup, onTick: opts.onTick,
      onBeat: paint,
      onAutoEnd: function () { if (playBtn) playBtn.textContent = "▶ Play story"; }
    });
    var api = window.StudyScenes[name] = {
      beat: function (i) { if (story) { story.stop(); story.beat(i); } else paint(i); },
      play: function () { if (story) { story.play(); if (playBtn) playBtn.textContent = "❚❚ Pause"; } },
      stop: function () { if (story) story.stop(); if (playBtn) playBtn.textContent = "▶ Play story"; },
      rect: function (who) { return story ? story.rect(who) : null; },
      highlight: function (who) { if (story) story.highlight(who); },
      story: story
    };
    var prev = root.querySelector("[data-story-prev]"), next = root.querySelector("[data-story-next]");
    if (prev) prev.addEventListener("click", function () { if (story) { story.stop(); story.prev(); } });
    if (next) next.addEventListener("click", function () { if (story) { story.stop(); story.next(); } });
    if (playBtn) playBtn.addEventListener("click", function () {
      if (!story) return;
      if (story.playing()) api.stop(); else api.play();
    });
    if (story) story.beat(0); else paint(0);
    return api;
  }

  window.StoryStage = { create: createStory, wire: wire, person: person, ankara: ankara, sign: sign, std: std, labBench: labBench };
})();
