/* =========================================================
   StudyPipe · CellKit — parametric 3D cell-biology builders
   Classic script (no modules), fully offline, needs window.THREE + window.SceneKit.

   Every builder returns a THREE.Group with:
     g.userData.parts  -> { name: Object3D }  (for narrator rect()/highlight())
     g.userData.update(dt, t)                 (optional per-frame animation)
     g.userData.setState(obj)                 (optional live state, e.g. { tonicity: -1..1 })

   Builders:
     CellKit.plantCell(o)     turgid/flaccid/plasmolysed palisade or onion cell
     CellKit.animalCell(o)    cheek / liver cell (swell → haemolysis, shrink → crenation)
     CellKit.rbc(o)           biconcave red blood cell (haemolysis / crenation)
     CellKit.bacterium(o)     prokaryote: nucleoid, plasmids, 70S ribosomes, wall, capsule, flagellum
     CellKit.microscope(o)    compound light microscope (eyepiece, nosepiece, objectives, stage, knobs, lamp)
     CellKit.protist(type,o)  amoeba | paramecium | euglena | chlamydomonas | volvox | spirogyra | hydra
     CellKit.cube(L,o)        SA/V scaling cube with live label
     CellKit.slide(o)         glass slide + drop + coverslip (angle) + air bubbles
     CellKit.mitochondrion(o) cut-away: outer membrane, cristae, matrix
     CellKit.chloroplast(o)   cut-away: envelope, grana stacks, stroma, starch grain
     CellKit.bilayer(o)       phospholipid bilayer patch + protein channels (aquaporin, ATP pump)
     CellKit.label(text,o)    crisp sprite label pill
     CellKit.glowOn(stage, parts, name) helper for highlight rings
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  var TAU = Math.PI * 2;

  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.45 : rough, metalness: 0.02 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function glass(color, opacity) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: 0.18, metalness: 0, transparent: true, opacity: opacity == null ? 0.25 : opacity, depthWrite: false, side: THREE.DoubleSide });
  }
  function glowMat(color, intensity) {
    return new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: intensity == null ? 0.45 : intensity, roughness: 0.35 });
  }

  function label(text, o) {
    o = o || {};
    var tex = window.SceneKit ? SceneKit.labelTexture(text, { size: o.size || 34, bg: o.bg || "rgba(10,15,29,0.88)", color: o.color || "#ffffff" }) : null;
    if (!tex) return new THREE.Group();
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: o.depthTest === true }));
    var h = o.h || 0.16;
    s.scale.set(h * tex.userData.aspect, h, 1);
    s.renderOrder = 10;
    s.userData.isLabel = true;
    return s;
  }
  function setLabelText(sprite, text, o) {
    if (!sprite || !sprite.material || !window.SceneKit) return;
    o = o || {};
    var tex = SceneKit.labelTexture(text, { size: o.size || 34, bg: o.bg || "rgba(10,15,29,0.88)", color: o.color || "#ffffff" });
    if (sprite.material.map) sprite.material.map.dispose();
    sprite.material.map = tex; sprite.material.needsUpdate = true;
    var h = o.h || sprite.scale.y;
    sprite.scale.set(h * tex.userData.aspect, h, 1);
  }

  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  /* ---------- small organelle meshes ---------- */
  function mitochondrionMesh(len, color) {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CapsuleGeometry(len * 0.28, len * 0.7, 6, 12), glowMat(color || 0xff6b4a, 0.28));
    body.rotation.z = Math.PI / 2;
    g.add(body);
    // cristae hint: thin rings
    var rm = std(0xffd0c2, 0.5);
    for (var i = -2; i <= 2; i++) {
      var r = new THREE.Mesh(new THREE.TorusGeometry(len * 0.2, len * 0.025, 6, 16), rm);
      r.rotation.y = Math.PI / 2; r.position.x = i * len * 0.16;
      g.add(r);
    }
    return g;
  }
  function chloroplastMesh(size) {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 12), glowMat(0x2fb344, 0.32));
    body.scale.set(1.5, 0.6, 1);
    g.add(body);
    var gm = std(0x145c22, 0.4);
    for (var i = -1; i <= 1; i++) {
      var stack = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.28, size * 0.28, size * 0.5, 12), gm);
      stack.position.set(i * size * 0.6, 0, 0);
      g.add(stack);
    }
    return g;
  }
  function golgiMesh(r) {
    var g = new THREE.Group();
    var m = glowMat(0xffc94a, 0.3);
    for (var i = 0; i < 4; i++) {
      var arc = new THREE.Mesh(new THREE.TorusGeometry(r - i * r * 0.12, r * 0.05, 6, 24, Math.PI * 0.9), m);
      arc.position.y = i * r * 0.16;
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = Math.PI * 0.05;
      g.add(arc);
    }
    for (var v = 0; v < 3; v++) {
      var ves = new THREE.Mesh(new THREE.SphereGeometry(r * 0.09, 10, 8), m);
      ves.position.set(r * (0.9 + v * 0.18), r * 0.2 * v, r * 0.2);
      g.add(ves);
    }
    return g;
  }
  function erMesh(r, rough) {
    var g = new THREE.Group();
    var m = glowMat(0x7cc4ff, 0.22);
    for (var i = 0; i < 4; i++) {
      var arc = new THREE.Mesh(new THREE.TorusGeometry(r + i * r * 0.18, r * 0.045, 6, 28, Math.PI * 1.1), m);
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = Math.PI * 0.55;
      arc.position.y = (i % 2) * r * 0.06;
      g.add(arc);
    }
    if (rough) {
      var pts = [], R = rnd(7);
      for (var k = 0; k < 90; k++) {
        var a = Math.PI * 0.55 + R() * Math.PI * 1.1, rr = r + Math.floor(R() * 4) * r * 0.18;
        pts.push(Math.cos(a) * rr, (R() - 0.5) * r * 0.12, -Math.sin(a) * rr);
      }
      var geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x1e3a8a, size: r * 0.09 })));
    }
    return g;
  }
  function ribosomeCloud(n, sx, sy, sz, seed, color) {
    var pts = [], R = rnd(seed || 3);
    for (var i = 0; i < n; i++) pts.push((R() - 0.5) * sx, (R() - 0.5) * sy, (R() - 0.5) * sz);
    var geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color: color || 0x334155, size: 0.025 }));
  }
  function nucleusMesh(r) {
    var g = new THREE.Group();
    var env = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), glass(0x9b6bff, 0.55));
    g.add(env);
    var nl = new THREE.Mesh(new THREE.SphereGeometry(r * 0.38, 16, 12), glowMat(0x5b21b6, 0.4));
    nl.position.set(r * 0.25, r * 0.1, 0.05);
    g.add(nl);
    g.userData.nucleolus = nl;
    return g;
  }

  /* ---------- PLANT CELL ---------- */
  function plantCell(o) {
    o = o || {};
    var W = o.w || 2.4, H = o.h || 1.4, D = o.d || 1.2;
    var g = new THREE.Group();
    var parts = {};

    // cellulose wall: translucent box + bold green edges (double line look)
    var wallGeo = new THREE.BoxGeometry(W, H, D);
    var wall = new THREE.Mesh(wallGeo, glass(0x3f9a3a, o.onion ? 0.12 : 0.16));
    g.add(wall);
    var edges = new THREE.LineSegments(new THREE.EdgesGeometry(wallGeo), new THREE.LineBasicMaterial({ color: 0x86efac }));
    g.add(edges);
    var inner = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W * 0.96, H * 0.94, D * 0.94)), new THREE.LineBasicMaterial({ color: 0x22c55e }));
    g.add(inner);
    parts.cellWall = wall;

    // protoplast group (shrinks on plasmolysis)
    var proto = new THREE.Group(); g.add(proto);
    var memGeo = new THREE.BoxGeometry(W * 0.94, H * 0.92, D * 0.92, 6, 6, 6);
    // round the membrane box corners a little
    var pos = memGeo.attributes.position, v = new THREE.Vector3();
    for (var i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      var nx = v.x / (W * 0.47), ny = v.y / (H * 0.46), nz = v.z / (D * 0.46);
      var k = 1 - 0.08 * (Math.abs(nx * ny) + Math.abs(ny * nz) + Math.abs(nx * nz));
      pos.setXYZ(i, v.x * k, v.y * k, v.z * k);
    }
    memGeo.computeVertexNormals();
    var membrane = new THREE.Mesh(memGeo, glass(0xfff1c7, 0.22));
    proto.add(membrane);
    parts.membrane = membrane;
    parts.cytoplasm = membrane;

    var vac = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), glass(0x60a5fa, 0.38));
    vac.scale.set(W * 0.34, H * 0.3, D * 0.3);
    vac.position.x = -W * 0.04;
    proto.add(vac);
    parts.vacuole = vac; parts.tonoplast = vac;

    var nuc = nucleusMesh(Math.min(H, D) * 0.17);
    nuc.position.set(W * 0.36, -H * 0.18, D * 0.18);
    proto.add(nuc);
    parts.nucleus = nuc; parts.nucleolus = nuc.userData.nucleolus;

    var chl = new THREE.Group(); proto.add(chl);
    var chlList = [];
    if (!o.onion) {
      var n = o.chloroplasts || 12;
      for (var c = 0; c < n; c++) {
        var cp = chloroplastMesh(Math.min(H, D) * 0.075);
        var a = (c / n) * TAU;
        cp.position.set(Math.cos(a) * W * 0.42, Math.sin(a) * H * 0.38, (c % 2 ? 1 : -1) * D * 0.36);
        cp.rotation.set(c * 0.7, c * 1.3, a);
        cp.userData.a = a;
        chl.add(cp); chlList.push(cp);
      }
    }
    parts.chloroplast = chl;

    var mito = new THREE.Group(); proto.add(mito);
    [[-0.4, 0.36, 0.3], [0.1, -0.38, -0.34], [0.38, 0.32, -0.32], [-0.36, -0.34, 0.34]].forEach(function (p, i) {
      var m = mitochondrionMesh(Math.min(H, D) * 0.14);
      m.position.set(p[0] * W, p[1] * H, p[2] * D);
      m.rotation.set(i, i * 0.6, i * 1.1);
      mito.add(m);
    });
    parts.mitochondrion = mito;

    var er = erMesh(Math.min(H, D) * 0.18, true);
    er.position.copy(nuc.position); er.position.x -= 0.02;
    proto.add(er);
    parts.er = er;

    var golgi = golgiMesh(Math.min(H, D) * 0.12);
    golgi.position.set(W * 0.2, H * 0.28, -D * 0.2);
    proto.add(golgi);
    parts.golgi = golgi;

    var rib = ribosomeCloud(140, W * 0.86, H * 0.8, D * 0.8, 11);
    proto.add(rib);
    parts.ribosome = rib;

    var state = { tonicity: o.tonicity == null ? 1 : o.tonicity, cur: o.tonicity == null ? 1 : o.tonicity };
    function apply(t) {
      // t: +1 turgid, 0 flaccid/incipient, -1 fully plasmolysed
      var s = t >= 0 ? 0.985 + 0.015 * t : 0.985 + 0.385 * t; // protoplast scale
      proto.scale.set(s, Math.max(0.55, s + 0.04 * Math.min(0, t)), s);
      var vs = t >= 0 ? 1 + 0.18 * t : 1 + 0.55 * t;
      vac.scale.set(W * 0.34 * vs, H * 0.3 * vs, D * 0.3 * vs);
      wall.scale.set(1 + 0.012 * Math.max(0, t), 1 + 0.012 * Math.max(0, t), 1);
      membrane.material.opacity = 0.22 + (t < 0 ? 0.12 * -t : 0);
    }
    apply(state.cur);

    g.userData.parts = parts;
    g.userData.proto = proto;
    g.userData.setState = function (st) { if (st && st.tonicity != null) state.tonicity = st.tonicity; };
    g.setTonicity = function (ton01) { state.tonicity = (ton01 - 0.5) * 2; };
    g.userData.update = function (dt, t) {
      state.cur += (state.tonicity - state.cur) * Math.min(1, dt * 1.6);
      apply(state.cur);
      // cytoplasmic streaming (cyclosis): chloroplasts glide round the edge
      for (var i = 0; i < chlList.length; i++) {
        var cp = chlList[i]; cp.userData.a += dt * 0.12;
        var a = cp.userData.a;
        cp.position.x = Math.cos(a) * W * 0.42; cp.position.y = Math.sin(a) * H * 0.38;
      }
      nuc.userData.nucleolus.material.emissiveIntensity = 0.35 + 0.1 * Math.sin(t * 2);
    };
    return attachCompat(g, o);
  }

  /* ---------- ANIMAL CELL ---------- */
  function blobGeometry(r, seed, amp) {
    var geo = new THREE.IcosahedronGeometry(r, 4);
    var p = geo.attributes.position, v = new THREE.Vector3();
    var base = new Float32Array(p.array.length); base.set(p.array);
    var R = rnd(seed || 5), f1 = 1 + R() * 2, f2 = 1 + R() * 3;
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      var n = 1 + (amp || 0.08) * (Math.sin(v.x * f1 * 3) * Math.cos(v.y * f2 * 3) + Math.sin(v.z * 4));
      p.setXYZ(i, v.x * n, v.y * n * 0.82, v.z * n);
    }
    geo.computeVertexNormals();
    geo.userData.base = new Float32Array(p.array);
    return geo;
  }
  function animalCell(o) {
    o = o || {};
    var R0 = o.r || 0.9;
    var g = new THREE.Group(), parts = {};
    var geo = blobGeometry(R0, o.seed || 9, o.cheek ? 0.12 : 0.07);
    var mem = new THREE.Mesh(geo, glass(o.color || 0xff9ec4, 0.28));
    if (o.cheek) mem.scale.set(1.25, 0.55, 1.1);
    g.add(mem);
    parts.membrane = mem; parts.cytoplasm = mem;
    var inside = new THREE.Group(); g.add(inside);
    var nuc = nucleusMesh(R0 * 0.27);
    inside.add(nuc);
    parts.nucleus = nuc; parts.nucleolus = nuc.userData.nucleolus;
    if (!o.simple) {
      var mito = new THREE.Group(); inside.add(mito);
      for (var i = 0; i < 6; i++) {
        var m = mitochondrionMesh(R0 * 0.17);
        var a = i / 6 * TAU;
        m.position.set(Math.cos(a) * R0 * 0.6, Math.sin(a * 2) * R0 * 0.22, Math.sin(a) * R0 * 0.55);
        m.rotation.set(a, a * 0.5, a * 1.3);
        mito.add(m);
      }
      parts.mitochondrion = mito;
      var cen = new THREE.Group();
      var cm = glowMat(0x3ee6c4, 0.5);
      var c1 = new THREE.Mesh(new THREE.CylinderGeometry(R0 * 0.045, R0 * 0.045, R0 * 0.2, 9), cm);
      var c2 = c1.clone(); c2.rotation.z = Math.PI / 2; c2.position.set(R0 * 0.1, R0 * 0.08, 0);
      cen.add(c1, c2); cen.position.set(R0 * 0.36, R0 * 0.3, R0 * 0.1);
      inside.add(cen);
      parts.centrioles = cen;
      var lys = new THREE.Group(); var lm = glowMat(0xa3e635, 0.4);
      [[-0.45, 0.25, 0.3], [0.2, -0.4, 0.35], [-0.2, -0.3, -0.45]].forEach(function (p) {
        var s = new THREE.Mesh(new THREE.SphereGeometry(R0 * 0.07, 10, 8), lm); s.position.set(p[0] * R0, p[1] * R0, p[2] * R0); lys.add(s);
      });
      inside.add(lys); parts.lysosome = lys;
      var vac = new THREE.Group(); var vm = glass(0x60a5fa, 0.45);
      [[0.5, -0.1, -0.3], [-0.55, 0.05, -0.15]].forEach(function (p) {
        var s = new THREE.Mesh(new THREE.SphereGeometry(R0 * 0.09, 12, 10), vm); s.position.set(p[0] * R0, p[1] * R0, p[2] * R0); vac.add(s);
      });
      inside.add(vac); parts.vacuole = vac;
      var golgi = golgiMesh(R0 * 0.16); golgi.position.set(-R0 * 0.35, R0 * 0.32, R0 * 0.05); inside.add(golgi); parts.golgi = golgi;
      var er = erMesh(R0 * 0.32, true); inside.add(er); parts.er = er;
      var gly = ribosomeCloud(40, R0 * 1.1, R0 * 0.6, R0 * 1.0, 21, 0xfbbf24); inside.add(gly); parts.glycogen = gly;
      var rib = ribosomeCloud(120, R0 * 1.3, R0 * 0.9, R0 * 1.3, 17); inside.add(rib); parts.ribosome = rib;
    }
    if (o.cheek) inside.scale.set(1.1, 0.6, 1);

    var base = geo.userData.base, p = geo.attributes.position, vv = new THREE.Vector3();
    var state = { tonicity: 0, cur: 0, burst: false, burstT: 0 };
    function apply(t, time) {
      // t: +1 strongly hypotonic (swell), 0 isotonic, -1 hypertonic (crenate)
      var sw = t > 0 ? 1 + 0.28 * t : 1 + 0.18 * t;
      for (var i = 0; i < p.count; i++) {
        vv.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
        var spike = t < 0 ? 1 + (-t) * 0.12 * Math.max(0, Math.sin(vv.x * 18) * Math.sin(vv.y * 18) * Math.sin(vv.z * 18 + 1)) * 3 : 1;
        var k = sw * spike;
        p.setXYZ(i, vv.x * k, vv.y * k, vv.z * k);
      }
      p.needsUpdate = true; geo.computeVertexNormals();
      inside.scale.setScalar((o.cheek ? 1 : 1) * (1 + 0.12 * t));
      if (o.cheek) inside.scale.y *= 0.6;
    }
    apply(0, 0);
    g.userData.parts = parts;
    g.userData.setState = function (st) {
      if (!st) return;
      if (st.tonicity != null) { state.tonicity = st.tonicity; if (st.tonicity < 0.95) { state.burst = false; mem.visible = true; mem.material.opacity = 0.28; } }
    };
    g.setTonicity = function (ton01) { g.userData.setState({ tonicity: (ton01 - 0.5) * 2 }); };
    g.userData.update = function (dt, t) {
      state.cur += (state.tonicity - state.cur) * Math.min(1, dt * 1.4);
      if (state.tonicity >= 0.95 && state.cur > 0.9 && !state.burst) { state.burst = true; state.burstT = 0; }
      if (state.burst) {
        state.burstT += dt;
        mem.material.opacity = Math.max(0.03, 0.28 - state.burstT * 0.25);
      }
      apply(state.cur, t);
      if (parts.nucleolus) parts.nucleolus.material.emissiveIntensity = 0.35 + 0.1 * Math.sin(t * 2.2);
    };
    g.userData.isBurst = function () { return state.burst; };
    return attachCompat(g, o);
  }

  /* ---------- RED BLOOD CELL ---------- */
  function rbcGeometry() {
    var pts = [];
    for (var i = 0; i <= 24; i++) {
      var x = i / 24; // 0..1 radius
      var r = x * 0.5;
      var y = 0.5 * Math.sqrt(Math.max(0, 1 - x * x)) * (0.1 + 1.0 * x * x - 0.72 * x * x * x * x) ;
      pts.push(new THREE.Vector2(r, y));
    }
    for (var j = 24; j >= 0; j--) pts.push(new THREE.Vector2(pts[j].x, -pts[j].y));
    return new THREE.LatheGeometry(pts, 40);
  }
  function rbc(o) {
    o = o || {};
    var g = new THREE.Group();
    var geo = rbcGeometry();
    var base = new Float32Array(geo.attributes.position.array);
    var mat = std(0xd62839, 0.42, { emissive: 0x5a0a10, emissiveIntensity: 0.25, transparent: true, opacity: 1 });
    var m = new THREE.Mesh(geo, mat);
    m.scale.setScalar(o.size || 1);
    m.rotation.x = Math.PI / 2.4;
    g.add(m);
    var p = geo.attributes.position, v = new THREE.Vector3();
    var state = { tonicity: 0, cur: 0, burst: false, t: 0 };
    function apply(t) {
      for (var i = 0; i < p.count; i++) {
        v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
        if (t > 0) { // swell to a sphere
          var r = Math.sqrt(v.x * v.x + v.z * v.z);
          var sph = Math.sqrt(Math.max(0, 0.25 - r * r)) * Math.sign(v.y || 1);
          v.y = v.y + (sph - v.y) * t;
          v.x *= 1 - 0.1 * t; v.z *= 1 - 0.1 * t;
        } else if (t < 0) { // crenate: spiky rim, shrink
          var ang = Math.atan2(v.z, v.x);
          var sp = 1 + (-t) * 0.18 * Math.max(0, Math.sin(ang * 11));
          v.x *= (1 + 0.15 * t) * sp; v.z *= (1 + 0.15 * t) * sp; v.y *= 1 + 0.3 * t;
        }
        p.setXYZ(i, v.x, v.y, v.z);
      }
      p.needsUpdate = true; geo.computeVertexNormals();
    }
    g.userData.parts = { rbc: m, membrane: m };
    g.userData.setState = function (st) { if (st && st.tonicity != null) { state.tonicity = st.tonicity; if (st.tonicity < 0.95) { state.burst = false; mat.opacity = 1; m.visible = true; } } };
    g.setTonicity = function (ton01) { g.userData.setState({ tonicity: (ton01 - 0.5) * 2 }); };
    g.userData.update = function (dt, t) {
      state.cur += (state.tonicity - state.cur) * Math.min(1, dt * 1.4);
      apply(state.cur);
      if (state.tonicity >= 0.95 && state.cur > 0.88 && !state.burst) { state.burst = true; state.t = 0; }
      if (state.burst) { state.t += dt; mat.opacity = Math.max(0.08, 1 - state.t * 0.9); }
      m.rotation.z += dt * 0.25;
    };
    g.userData.isBurst = function () { return state.burst; };
    return attachCompat(g, o);
  }

  /* ---------- BACTERIUM (prokaryote) ---------- */
  function bacterium(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var L = o.len || 1.6, r = o.r || 0.36;
    var capsule = new THREE.Mesh(new THREE.CapsuleGeometry(r * 1.18, L, 8, 20), glass(0xc4b5fd, 0.14));
    capsule.rotation.z = Math.PI / 2; g.add(capsule); parts.capsule = capsule;
    var wall = new THREE.Mesh(new THREE.CapsuleGeometry(r * 1.06, L, 8, 20), glass(0xf59e0b, 0.22));
    wall.rotation.z = Math.PI / 2; g.add(wall); parts.cellWall = wall;
    var mem = new THREE.Mesh(new THREE.CapsuleGeometry(r, L, 8, 20), glass(0xfde68a, 0.3));
    mem.rotation.z = Math.PI / 2; g.add(mem); parts.membrane = mem;
    // nucleoid: tangled circular DNA loop
    var curvePts = [];
    for (var i = 0; i < 80; i++) {
      var a = i / 80 * TAU;
      curvePts.push(new THREE.Vector3(Math.cos(a) * L * 0.28 + Math.sin(a * 5) * 0.08, Math.sin(a * 3) * r * 0.35, Math.sin(a) * r * 0.45 + Math.cos(a * 4) * 0.05));
    }
    var dna = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts, true), 160, 0.018, 6, true), glowMat(0x3ee6c4, 0.6));
    g.add(dna); parts.nucleoid = dna;
    var plas = new THREE.Group(); var pm = glowMat(0xff3d8b, 0.6);
    [[-L * 0.42, 0.12, 0.1], [L * 0.45, -0.1, -0.12]].forEach(function (p) {
      var t = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 20), pm); t.position.set(p[0], p[1], p[2]); t.rotation.x = 1; plas.add(t);
    });
    g.add(plas); parts.plasmid = plas;
    var rib = ribosomeCloud(160, L * 1.1, r * 1.3, r * 1.3, 31, 0x1e293b); g.add(rib); parts.ribosome = rib;
    var fpts = [];
    for (var k = 0; k < 30; k++) fpts.push(new THREE.Vector3(-L * 0.5 - r - k * 0.06, Math.sin(k * 0.7) * 0.1, Math.cos(k * 0.5) * 0.05));
    var flag = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fpts), 60, 0.014, 5), std(0xe2e8f0, 0.5));
    g.add(flag); parts.flagellum = flag;
    g.userData.parts = parts;
    g.userData.update = function (dt, t) {
      flag.rotation.x = t * 6;
      dna.rotation.x = Math.sin(t * 0.7) * 0.15;
    };
    return attachCompat(g, o);
  }

  /* ---------- COMPOUND LIGHT MICROSCOPE ---------- */
  function microscope(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var black = std(0x1f2937, 0.35, { metalness: 0.35 });
    var cream = std(0xf5efe4, 0.4, { metalness: 0.15 });
    var chrome = std(0xcbd5e1, 0.18, { metalness: 0.9 });
    var base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.8), cream); base.position.y = 0.06; g.add(base);
    var lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.06, 20), glowMat(0xfff7c2, 0.9)); lamp.position.set(0.05, 0.15, 0); g.add(lamp); parts.lamp = lamp;
    var arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 0.22), cream); arm.position.set(-0.38, 0.72, 0); arm.rotation.z = -0.12; g.add(arm); parts.arm = arm;
    var stage = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.56), black); stage.position.set(0.05, 0.62, 0); g.add(stage); parts.stage = stage;
    var clip1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, 0.2), chrome); clip1.position.set(-0.12, 0.65, 0.12); g.add(clip1);
    var clip2 = clip1.clone(); clip2.position.x = 0.22; g.add(clip2);
    var sl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.012, 0.14), glass(0xe0f2fe, 0.55)); sl.position.set(0.05, 0.652, 0); g.add(sl); parts.slide = sl;
    var spec = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.006, 0.1), glowMat(0xfbbf24, 0.4)); spec.position.set(0.05, 0.661, 0); g.add(spec); parts.specimen = spec;
    var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.62, 24), cream); tube.position.set(0.0, 1.27, 0); tube.rotation.z = -0.12; g.add(tube); parts.tube = tube;
    var eye = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.2, 20), black); eye.position.set(-0.06, 1.66, 0); eye.rotation.z = -0.12; g.add(eye); parts.eyepiece = eye;
    var nose = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.08, 24), chrome); nose.position.set(0.06, 0.95, 0); g.add(nose); parts.nosepiece = nose; parts.turret = nose;
    var objs = new THREE.Group(); objs.position.copy(nose.position); g.add(objs);
    var objList = [];
    [[0.18, 0x22c55e, "×4"], [0.24, 0xfbbf24, "×10"], [0.3, 0x3b82f6, "×40"]].forEach(function (d, i) {
      var holder = new THREE.Group();
      var ob = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, d[0], 16), chrome);
      ob.position.y = -d[0] / 2 - 0.03;
      var band = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.02, 16), glowMat(d[1], 0.6));
      band.position.y = -0.06;
      holder.add(ob, band);
      holder.rotation.z = 0.32; // tilted out
      var wrap = new THREE.Group(); wrap.add(holder); wrap.rotation.y = i * TAU / 3;
      objs.add(wrap); objList.push(wrap);
    });
    parts.objective = objs;
    var coarse = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 24), black); coarse.rotation.x = Math.PI / 2; coarse.position.set(-0.38, 0.75, 0.15); g.add(coarse); parts.coarse = coarse;
    var fine = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20), chrome); fine.rotation.x = Math.PI / 2; fine.position.set(-0.38, 0.75, 0.2); g.add(fine); parts.fine = fine;
    parts.knob = coarse;
    var beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.45, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff7c2, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
    beam.position.set(0.05, 0.4, 0); g.add(beam); parts.beam = beam;
    var curObj = 1, target = 0;
    function selectObjective(i) { curObj = i; target = -(i % 3) * TAU / 3; objs.rotation.y = target; }
    selectObjective(o.objective == null ? 1 : o.objective);
    g.userData.parts = parts;
    g.userData.selectObjective = selectObjective;
    g.setObjective = selectObjective;
    g.userData.update = function (dt, t) {
      objs.rotation.y += (target - objs.rotation.y) * Math.min(1, dt * 4);
      beam.material.opacity = 0.18 + 0.06 * Math.sin(t * 3);
    };
    return attachCompat(g, o);
  }

  /* ---------- PROTISTS & SIMPLE ORGANISMS ---------- */
  function protist(type, o) {
    if (typeof type === "object" && type !== null) { o = type; type = o.type || "euglena"; }
    o = o || {};
    var g = new THREE.Group(), parts = {}, upd = null;
    if (type === "amoeba") {
      var geo = blobGeometry(0.55, 4, 0.22);
      var base = new Float32Array(geo.attributes.position.array);
      var body = new THREE.Mesh(geo, glass(0xa5b4fc, 0.45)); body.scale.y = 0.5; g.add(body); parts.body = body; parts.pseudopodia = body;
      var n = nucleusMesh(0.12); n.position.set(0.1, 0, 0.05); g.add(n); parts.nucleus = n;
      var cv = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10), glass(0x38bdf8, 0.7)); cv.position.set(-0.25, 0.02, 0.1); g.add(cv); parts.contractileVacuole = cv;
      var fv = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glowMat(0xfbbf24, 0.4)); fv.position.set(0.25, 0.02, -0.12); g.add(fv); parts.foodVacuole = fv;
      var p = geo.attributes.position, v = new THREE.Vector3();
      upd = function (dt, t) {
        for (var i = 0; i < p.count; i++) {
          v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
          var k = 1 + 0.18 * Math.sin(Math.atan2(v.z, v.x) * 3 + t * 1.2) * Math.max(0, 1 - Math.abs(v.y) * 3);
          p.setXYZ(i, v.x * k, v.y, v.z * k);
        }
        p.needsUpdate = true; geo.computeVertexNormals();
        var c = (t * 0.5) % 1; cv.scale.setScalar(c < 0.85 ? 0.5 + c * 0.7 : 0.3);
      };
    } else if (type === "paramecium") {
      var bodyP = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.75, 8, 18), glass(0xfde68a, 0.42));
      bodyP.rotation.z = Math.PI / 2; bodyP.scale.set(1, 1, 0.75); g.add(bodyP); parts.body = bodyP; parts.pellicle = bodyP;
      var cil = new THREE.Group(); var cm = std(0xfef3c7, 0.5);
      for (var i = 0; i < 70; i++) {
        var a = i / 70 * TAU * 3, x = -0.55 + (i / 70) * 1.1;
        var hair = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 3), cm);
        var ang = a;
        hair.position.set(x, Math.cos(ang) * 0.23, Math.sin(ang) * 0.17);
        hair.lookAt(new THREE.Vector3(x, Math.cos(ang) * 0.5, Math.sin(ang) * 0.4)); hair.rotateX(Math.PI / 2);
        cil.add(hair);
      }
      g.add(cil); parts.cilia = cil;
      var mac = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), glass(0x9b6bff, 0.7)); mac.scale.set(1.4, 0.8, 0.8); g.add(mac); parts.macronucleus = mac;
      var mic = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat(0x5b21b6, 0.5)); mic.position.set(0.13, 0.05, 0.05); g.add(mic); parts.micronucleus = mic;
      var cvs = new THREE.Group();
      [-0.35, 0.35].forEach(function (x) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glass(0x38bdf8, 0.75)); s.position.set(x, 0.08, 0); cvs.add(s); });
      g.add(cvs); parts.contractileVacuole = cvs;
      var og = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 16, Math.PI), std(0xd97706, 0.5)); og.position.set(-0.05, -0.15, 0.08); g.add(og); parts.oralGroove = og;
      upd = function (dt, t) { cil.rotation.x = Math.sin(t * 8) * 0.06; cvs.children.forEach(function (c, k) { var ph = (t * 0.6 + k * 0.5) % 1; c.scale.setScalar(ph < 0.8 ? 0.5 + ph * 0.7 : 0.25); }); };
    } else if (type === "euglena") {
      var bodyE = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), glass(0x86efac, 0.5)); bodyE.scale.set(3, 1, 1); g.add(bodyE); parts.body = bodyE; parts.pellicle = bodyE;
      var chlE = new THREE.Group();
      for (var c = 0; c < 9; c++) { var cp = chloroplastMesh(0.04); cp.position.set(-0.35 + c * 0.09, (c % 2 ? 0.06 : -0.06), (c % 3 - 1) * 0.06); chlE.add(cp); }
      g.add(chlE); parts.chloroplast = chlE;
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat(0xef4444, 0.9)); eye.position.set(0.48, 0.06, 0.06); g.add(eye); parts.eyespot = eye;
      var nE = nucleusMesh(0.07); nE.position.set(0.0, 0, 0.02); g.add(nE); parts.nucleus = nE;
      var cvE = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), glass(0x38bdf8, 0.8)); cvE.position.set(0.42, -0.04, 0); g.add(cvE); parts.contractileVacuole = cvE;
      var fpts = []; for (var k = 0; k < 24; k++) fpts.push(new THREE.Vector3(0.58 + k * 0.035, Math.sin(k * 0.6) * 0.05, 0));
      var flE = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fpts), 40, 0.01, 5), std(0xdcfce7, 0.5)); g.add(flE); parts.flagellum = flE;
      upd = function (dt, t) { flE.rotation.x = t * 5; flE.rotation.z = Math.sin(t * 6) * 0.2; bodyE.scale.y = 1 + 0.06 * Math.sin(t * 2); };
    } else if (type === "chlamydomonas") {
      var wallC = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), glass(0x4ade80, 0.25)); wallC.scale.set(1, 1.3, 1); g.add(wallC); parts.cellWall = wallC; parts.body = wallC;
      var cup = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14, 0, TAU, Math.PI * 0.35, Math.PI * 0.65), glowMat(0x16a34a, 0.35)); cup.material.side = THREE.DoubleSide; cup.scale.set(1, 1.3, 1); g.add(cup); parts.chloroplast = cup;
      var pyr = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glowMat(0xfef08a, 0.5)); pyr.position.y = -0.22; g.add(pyr); parts.pyrenoid = pyr;
      var nC = nucleusMesh(0.07); nC.position.y = 0.05; g.add(nC); parts.nucleus = nC;
      var eyeC = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glowMat(0xef4444, 0.9)); eyeC.position.set(0.2, 0.18, 0.12); g.add(eyeC); parts.eyespot = eyeC;
      var fl = new THREE.Group();
      [-1, 1].forEach(function (s) { var pts = []; for (var k = 0; k < 18; k++) pts.push(new THREE.Vector3(s * (0.04 + k * 0.03), 0.4 + Math.sin(k * 0.4) * 0.08 + k * 0.02, 0)); fl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.008, 5), std(0xdcfce7, 0.5))); });
      g.add(fl); parts.flagellum = fl;
      upd = function (dt, t) { fl.children[0].rotation.z = Math.sin(t * 7) * 0.3; fl.children[1].rotation.z = -Math.sin(t * 7) * 0.3; };
    } else if (type === "volvox") {
      var sph = new THREE.Mesh(new THREE.SphereGeometry(0.6, 28, 20), glass(0x86efac, 0.16)); g.add(sph); parts.body = sph; parts.colony = sph;
      var cells = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), glowMat(0x16a34a, 0.45), 160);
      var dummy = new THREE.Object3D();
      for (var i2 = 0; i2 < 160; i2++) {
        var phi = Math.acos(1 - 2 * (i2 + 0.5) / 160), th = Math.PI * (1 + Math.sqrt(5)) * i2;
        dummy.position.set(Math.cos(th) * Math.sin(phi) * 0.6, Math.cos(phi) * 0.6, Math.sin(th) * Math.sin(phi) * 0.6);
        dummy.updateMatrix(); cells.setMatrixAt(i2, dummy.matrix);
      }
      g.add(cells); parts.cells = cells;
      var dau = new THREE.Group();
      [[0.18, 0.1, 0.05], [-0.15, -0.12, 0.1], [0.02, 0.2, -0.2]].forEach(function (p) { var d = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), glowMat(0x22c55e, 0.3)); d.position.set(p[0], p[1], p[2]); dau.add(d); });
      g.add(dau); parts.daughterColony = dau;
      upd = function (dt) { g.rotation.y += dt * 0.35; g.rotation.x += dt * 0.12; };
    } else if (type === "spirogyra") {
      var fil = new THREE.Group(), cellsS = o.cells || 5;
      for (var s = 0; s < cellsS; s++) {
        var cell = new THREE.Group(); cell.position.x = (s - (cellsS - 1) / 2) * 0.5;
        var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.48, 18, 1, true), glass(0x4ade80, 0.25)); cyl.rotation.z = Math.PI / 2; cell.add(cyl);
        var cw = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.152, 0.012, 18), std(0x166534, 0.5)); cw.rotation.z = Math.PI / 2; cw.position.x = 0.245; cell.add(cw);
        var hpts = []; for (var k2 = 0; k2 <= 40; k2++) { var a2 = k2 / 40 * TAU * 1.5; hpts.push(new THREE.Vector3(-0.22 + k2 / 40 * 0.44, Math.cos(a2) * 0.12, Math.sin(a2) * 0.12)); }
        var rib2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hpts), 60, 0.022, 6), glowMat(0x15803d, 0.4)); cell.add(rib2);
        var nS = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glowMat(0x7c3aed, 0.5)); cell.add(nS);
        fil.add(cell);
        if (s === 1) { parts.chloroplast = rib2; parts.nucleus = nS; parts.cell = cell; }
      }
      var sheath = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, cellsS * 0.5, 18, 1, true), glass(0xd1fae5, 0.1)); sheath.rotation.z = Math.PI / 2; fil.add(sheath); parts.sheath = sheath;
      g.add(fil); parts.body = fil; parts.filament = fil;
      upd = function (dt, t) { fil.rotation.x = Math.sin(t * 0.5) * 0.2; };
    } else if (type === "hydra") {
      var col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 18), glass(0xfdba74, 0.6)); col.position.y = 0.45; g.add(col); parts.body = col;
      var endo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.86, 14), glowMat(0xc2410c, 0.25)); endo.position.y = 0.45; g.add(endo); parts.endoderm = endo; parts.ectoderm = col;
      var tent = new THREE.Group();
      for (var tt = 0; tt < 6; tt++) {
        var tpts = []; var ta = tt / 6 * TAU;
        for (var k3 = 0; k3 < 14; k3++) tpts.push(new THREE.Vector3(Math.cos(ta) * (0.1 + k3 * 0.035), 0.9 + k3 * 0.04 - k3 * k3 * 0.004, Math.sin(ta) * (0.1 + k3 * 0.035)));
        tent.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tpts), 24, 0.02, 5), glass(0xfdba74, 0.75)));
      }
      g.add(tent); parts.tentacles = tent;
      var foot = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), std(0x9a3412, 0.5)); foot.scale.y = 0.4; g.add(foot); parts.basalDisc = foot;
      upd = function (dt, t) { tent.rotation.y = Math.sin(t * 0.8) * 0.2; tent.children.forEach(function (c, k) { c.rotation.x = Math.sin(t * 1.5 + k) * 0.08; }); };
    }
    g.userData.parts = parts;
    g.userData.update = upd || function () {};
    return attachCompat(g, o);
  }

  /* ---------- SA/V CUBE ---------- */
  function cube(L, o) {
    if (typeof L === "object" && L !== null) { o = L; L = o.size || 0.65; }
    o = o || {};
    var g = new THREE.Group();
    var size = o.size || L || 0.65;
    var geo = new THREE.BoxGeometry(size, size, size);
    var m = new THREE.Mesh(geo, glass(o.color || 0xffb23f, 0.4));
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: o.edge || 0xffd36b }));
    var core = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), std(0x1e293b, 0.6));
    core.scale.setScalar(0.001);
    g.add(core, m, e);
    g.userData.parts = { cube: m, core: core };
    g.userData.setDiffusion = function (frac) { // fraction of volume reached by diffusion (0..1)
      var unreached = Math.max(0.001, Math.cbrt(Math.max(0, 1 - frac)));
      core.scale.setScalar(unreached);
    };
    g.setL = function (newL) {
      var s = Math.max(0.45, Math.min(1.35, 0.55 + newL * 0.12));
      g.scale.setScalar(s);
      g.userData.setDiffusion(Math.min(1, 2.0 / Math.max(1, newL)));
    };
    return attachCompat(g, o);
  }

  /* ---------- WET-MOUNT SLIDE ---------- */
  function slide(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var s = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 0.75), glass(0xe0f2fe, 0.45)); g.add(s); parts.slide = s;
    var drop = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 12, 0, TAU, 0, Math.PI / 2), glass(o.stain || 0xb45309, 0.55)); drop.scale.y = 0.35; drop.position.y = 0.025; g.add(drop); parts.drop = drop;
    var spec = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.004, 0.24), glass(o.specimen || 0xfde68a, 0.75)); spec.position.y = 0.03; g.add(spec); parts.specimen = spec;
    var pivot = new THREE.Group(); pivot.position.set(-0.3, 0.035, 0); g.add(pivot);
    var cs = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.008, 0.6), glass(0xffffff, 0.35)); cs.position.x = 0.3; pivot.add(cs); parts.coverslip = cs;
    var needle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.8, 8), std(0xcbd5e1, 0.2, { metalness: 0.9 })); needle.position.set(0.62, 0.3, 0); needle.rotation.z = 0.6; pivot.add(needle); parts.needle = needle;
    var bubbles = new THREE.Group();
    [[0.1, 0.05], [-0.08, -0.08], [0.02, 0.12]].forEach(function (p) {
      var b = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 20), std(0x0f172a, 0.3)); b.rotation.x = Math.PI / 2; b.position.set(p[0], 0.038, p[1]); bubbles.add(b);
    });
    bubbles.visible = false; g.add(bubbles); parts.bubbles = bubbles;
    var state = { angle: 0.8, target: 0.8 };
    g.userData.parts = parts;
    g.userData.lower = function (flat) { state.target = 0; bubbles.visible = false; g.userData._flat = !!flat; };
    g.userData.raise = function () { state.target = 0.8; bubbles.visible = false; };
    g.setStep = function (st) { if (st >= 2) g.userData.lower(false); else g.userData.raise(); };
    g.userData.update = function (dt) {
      var sp = g.userData._flat ? 8 : 1.6;
      state.angle += (state.target - state.angle) * Math.min(1, dt * sp);
      pivot.rotation.z = state.angle;
      needle.visible = state.angle > 0.05 || !g.userData._flat;
      if (state.target === 0 && state.angle < 0.02 && g.userData._flat) bubbles.visible = true;
      drop.scale.x = drop.scale.z = 1 + (0.8 - state.angle) * 0.6;
    };
    return attachCompat(g, o);
  }

  /* ---------- ULTRASTRUCTURE CUT-AWAYS ---------- */
  function mitochondrion(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var outer = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.4, 10, 32, ), glass(0xff6b4a, 0.22));
    outer.rotation.z = Math.PI / 2; g.add(outer); parts.outer = outer;
    var matrix = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.3, 10, 28), glass(0xfca5a5, 0.32));
    matrix.rotation.z = Math.PI / 2; g.add(matrix); parts.matrix = matrix;
    var cr = new THREE.Group(); var cm = glowMat(0xf97316, 0.35);
    for (var i = 0; i < 9; i++) {
      var fold = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.7), cm);
      fold.position.x = -0.8 + i * 0.2; fold.position.y = (i % 2 ? 0.14 : -0.14);
      cr.add(fold);
    }
    g.add(cr); parts.cristae = cr;
    var atp = new THREE.Group(); var am = glowMat(0xfde047, 0.9);
    for (var k = 0; k < 24; k++) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), am); s.userData.ph = k / 24; atp.add(s); }
    g.add(atp); parts.atp = atp;
    g.userData.parts = parts;
    g.userData.update = function (dt, t) {
      atp.children.forEach(function (s, k) { var ph = (s.userData.ph + t * 0.15) % 1; s.position.set(-1.1 + ph * 2.2, Math.sin(ph * 20 + k) * 0.32, Math.cos(ph * 15 + k) * 0.32); s.scale.setScalar(0.6 + 0.4 * Math.sin(t * 4 + k)); });
    };
    return attachCompat(g, o);
  }
  function chloroplast(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var env = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 20), glass(0x4ade80, 0.2)); env.scale.set(1.6, 0.6, 1); g.add(env); parts.envelope = env;
    var stroma = new THREE.Mesh(new THREE.SphereGeometry(0.74, 28, 18), glass(0xbbf7d0, 0.25)); stroma.scale.set(1.6, 0.56, 0.95); g.add(stroma); parts.stroma = stroma;
    var grana = new THREE.Group(); var gm = glowMat(0x15803d, 0.4);
    [[-0.75, 0], [-0.25, 0.15], [0.25, -0.1], [0.75, 0.05], [0, -0.3]].forEach(function (p) {
      var stack = new THREE.Group();
      for (var i = 0; i < 6; i++) { var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 20), gm); disc.position.y = -0.11 + i * 0.045; stack.add(disc); }
      stack.position.set(p[0], 0, p[1]); grana.add(stack);
    });
    g.add(grana); parts.grana = grana; parts.thylakoid = grana;
    var lam = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.012, 0.06), gm); g.add(lam);
    var starch = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), std(0xfef9c3, 0.6)); starch.scale.set(1.3, 0.7, 1); starch.position.set(0.5, -0.05, 0.35); g.add(starch); parts.starch = starch;
    var photons = new THREE.Group(); var pm = glowMat(0xfde047, 1.0);
    for (var k = 0; k < 10; k++) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), pm); s.userData.ph = k / 10; photons.add(s); }
    g.add(photons); parts.light = photons;
    g.userData.parts = parts;
    g.userData.update = function (dt, t) {
      photons.children.forEach(function (s, k) { var ph = (s.userData.ph + t * 0.3) % 1; s.position.set(-1 + (k % 5) * 0.5, 1.2 - ph * 1.2, (k < 5 ? 0.2 : -0.2)); s.visible = ph < 0.92; });
    };
    return attachCompat(g, o);
  }
  function bilayer(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), std(0x60a5fa, 0.4), 2 * 15 * 7);
    var tails = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 4), std(0xfde68a, 0.6), 2 * 15 * 7 * 2);
    var d = new THREE.Object3D(), hi = 0, ti = 0;
    for (var x = 0; x < 15; x++) for (var z = 0; z < 7; z++) {
      [1, -1].forEach(function (s) {
        var px = -1.4 + x * 0.2, pz = -0.6 + z * 0.2;
        if (Math.abs(px) < 0.25 && Math.abs(pz) < 0.25) return;
        if (Math.abs(px - 0.9) < 0.25 && Math.abs(pz) < 0.25) return;
        d.position.set(px, s * 0.3, pz); d.rotation.set(0, 0, 0); d.scale.setScalar(1); d.updateMatrix(); heads.setMatrixAt(hi++, d.matrix);
        [-0.025, 0.025].forEach(function (off) { d.position.set(px + off, s * 0.15, pz); d.updateMatrix(); tails.setMatrixAt(ti++, d.matrix); });
      });
    }
    heads.count = hi; tails.count = ti;
    g.add(heads, tails); parts.bilayer = heads;
    var aqua = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16, 1, true), glowMat(0x3ee6c4, 0.35)); aqua.material.side = THREE.DoubleSide; g.add(aqua); parts.aquaporin = aqua;
    var pump = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.85, 14), glowMat(0xff3d8b, 0.35)); pump.position.x = 0.9; g.add(pump); parts.atpPump = pump;
    var water = new THREE.Group(); var wm = std(0x38bdf8, 0.3);
    for (var k = 0; k < 14; k++) { var w = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), wm); w.userData.ph = k / 14; water.add(w); }
    g.add(water); parts.water = water;
    var ions = new THREE.Group(); var im = glowMat(0xa855f7, 0.6);
    for (var j = 0; j < 6; j++) { var io = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), im); io.userData.ph = j / 6; ions.add(io); }
    g.add(ions); parts.ions = ions;
    var flow = { dir: 1, rate: 1, pumpOn: true };
    g.userData.parts = parts;
    g.userData.setFlow = function (dir, rate) { flow.dir = dir; flow.rate = rate == null ? 1 : rate; };
    g.userData.setPump = function (on) { flow.pumpOn = !!on; };
    g.setMode = function (m) {
      if (m === "active") { g.userData.setPump(true); g.userData.setFlow(1, 0.6); }
      else if (m === "diffusion") { g.userData.setPump(false); g.userData.setFlow(1, 0.3); }
      else { g.userData.setPump(false); g.userData.setFlow(1, 1.0); }
    };
    g.userData.update = function (dt, t) {
      water.children.forEach(function (w, k) {
        w.userData.ph = (w.userData.ph + dt * 0.25 * flow.rate) % 1;
        var ph = w.userData.ph, y = flow.dir >= 0 ? 0.9 - ph * 1.8 : -0.9 + ph * 1.8;
        var inChan = Math.abs(y) < 0.4;
        w.position.set(inChan ? Math.sin(k) * 0.06 : Math.sin(k * 2.3) * 0.5, y, inChan ? Math.cos(k) * 0.06 : Math.cos(k * 1.7) * 0.4);
        w.visible = flow.rate > 0.02;
      });
      ions.children.forEach(function (io, k) {
        if (flow.pumpOn) io.userData.ph = (io.userData.ph + dt * 0.18) % 1;
        var ph = io.userData.ph, y = -0.9 + ph * 1.8, inC = Math.abs(y) < 0.42;
        io.position.set(0.9 + (inC ? 0 : Math.sin(k * 3) * 0.3), y, inC ? 0 : Math.cos(k * 2) * 0.3);
      });
      pump.material.emissiveIntensity = flow.pumpOn ? 0.35 + 0.25 * Math.sin(t * 6) : 0.08;
    };
    return attachCompat(g, o);
  }

  function attachCompat(g, o) {
    if (o && o.scale) g.scale.setScalar(o.scale);
    g.group = g;
    g.parts = g.userData.parts || {};
    g.tick = g.userData.update || function () {};
    g.update = g.userData.update || function () {};
    if (g.userData.setState) g.setState = g.userData.setState;
    return g;
  }

  /* ---------- highlight helper ---------- */
  function makeHighlighter(scene) {
    var glow = window.SceneKit ? SceneKit.glowSprite("rgba(255,178,63,0.9)", 1) : null;
    if (glow) { glow.material.opacity = 0; scene.add(glow); }
    var cur = null, box = new THREE.Box3(), size = new THREE.Vector3();
    return {
      set: function (obj) { cur = obj || null; },
      update: function (dt, t) {
        if (!glow) return;
        if (cur) {
          box.setFromObject(cur); box.getCenter(glow.position); box.getSize(size);
          glow.scale.setScalar(Math.max(0.4, Math.max(size.x, size.y, size.z) * 1.8));
        }
        var target = cur ? 0.55 + 0.25 * Math.sin(t * 5) : 0;
        glow.material.opacity += (target - glow.material.opacity) * Math.min(1, dt * 6);
      }
    };
  }

  window.CellKit = {
    std: std, glass: glass, glowMat: glowMat, label: label, setLabelText: setLabelText,
    plantCell: plantCell, animalCell: animalCell, rbc: rbc, bacterium: bacterium, microscope: microscope,
    protist: protist, cube: cube, slide: slide, mitochondrion: mitochondrion, chloroplast: chloroplast, bilayer: bilayer,
    mitochondrionMesh: mitochondrionMesh, chloroplastMesh: chloroplastMesh, nucleusMesh: nucleusMesh,
    makeHighlighter: makeHighlighter, version: 1
  };
})();
