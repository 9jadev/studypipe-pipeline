/* =========================================================
   StudyPipe · ProteinRouteKit v1 — the secretory pathway in 3D
   ribosome on rough ER -> ER lumen -> transport vesicle -> Golgi (cis -> trans)
   -> secretory vesicle -> fusion with the cell membrane (exocytosis).

   Classic script (no modules), fully offline, needs window.THREE only.
   ProteinRouteKit.create(opts) returns a THREE.Group with the universal kit contract:
     g.userData.parts, g.parts   named Object3D map (see README)
     g.update(dt, t) / g.tick    advance the animation
     g.setState(obj)             { step, t, play, speed, autoAdvance, labels }
     g.reading()                 values computed from the model (never typed text)
   ========================================================= */
(function (global) {
  "use strict";
  if (typeof THREE === "undefined") return;
  var TAU = Math.PI * 2;

  /* ---------- helpers (kit-contract patterns) ---------- */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) { if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace; else if ("encoding" in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding; return tex; }
  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData = obj.userData || {}; obj.userData.partId = key;
    obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData = g.userData || {};
    g.userData.parts = parts; g.userData.update = updateFn; g.userData.setState = setStateFn || function () {};
    g.group = g; g.parts = parts; g.tick = updateFn; g.update = updateFn; g.setState = g.userData.setState;
    return g;
  }
  function makeHighlighter(scene) {
    var saved = [];
    function clear() {
      for (var i = 0; i < saved.length; i++) { var s = saved[i]; if (s.mat && s.mat.emissive) { s.mesh.material = s.orig; } }
      saved.length = 0;
    }
    function highlight(partName, colorHex) {
      clear(); if (!partName || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === partName && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); c.emissive.copy(col); c.emissiveIntensity = 0.65;
          saved.push({ mesh: o, orig: o.material, mat: c }); o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function v3(x, y, z) { return new THREE.Vector3(x, y, z); }

  /* grainy diffuse + bump texture (offline, seeded) */
  function grainTex(seed, base, speck, size, repeat) {
    var c = document.createElement("canvas"); c.width = c.height = size || 128;
    var g = c.getContext("2d"), R = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, c.width, c.height);
    for (var i = 0; i < c.width * 3; i++) {
      g.fillStyle = speck; g.globalAlpha = 0.05 + R() * 0.12;
      g.beginPath(); g.arc(R() * c.width, R() * c.height, 0.6 + R() * 2.2, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat || 2, repeat || 2);
    return srgb(t);
  }
  function bumpTex(seed, size, repeat) {
    var c = document.createElement("canvas"); c.width = c.height = size || 128;
    var g = c.getContext("2d"), R = rng(seed);
    g.fillStyle = "#808080"; g.fillRect(0, 0, c.width, c.height);
    for (var i = 0; i < c.width * 4; i++) {
      var v = Math.floor(90 + R() * 80); g.fillStyle = "rgb(" + v + "," + v + "," + v + ")";
      g.beginPath(); g.arc(R() * c.width, R() * c.height, 0.8 + R() * 2.4, 0, TAU); g.fill();
    }
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat || 2, repeat || 2);
    return t;
  }

  /* label sprite (own canvas, no SceneKit dependency) */
  function label(text, h) {
    var c = document.createElement("canvas"), g = c.getContext("2d"), f = "700 40px sans-serif";
    g.font = f; var w = Math.ceil(g.measureText(text).width) + 36; c.width = w; c.height = 64;
    g.font = f; g.fillStyle = "rgba(14,20,34,0.82)";
    g.beginPath(); if (g.roundRect) g.roundRect(0, 4, w, 56, 28); else g.rect(0, 4, w, 56); g.fill();
    g.fillStyle = "#fff"; g.textBaseline = "middle"; g.textAlign = "center"; g.fillText(text, w / 2, 33);
    var tex = srgb(new THREE.CanvasTexture(c));
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }));
    s.scale.set(h * w / 64, h, 1); s.renderOrder = 20; s.userData.isLabel = true;
    return s;
  }

  /* lumpy sphere (ribosome subunits, cargo) */
  function lumpy(radius, sx, sy, sz, seed, amp, wSeg, hSeg) {
    var geo = new THREE.SphereGeometry(1, wSeg || 16, hSeg || 12), p = geo.attributes.position, R = rng(seed), ph = [R() * 6, R() * 6, R() * 6];
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var n = 1 + amp * (Math.sin(x * 5 + ph[0]) * Math.cos(y * 4 + ph[1]) + Math.sin(z * 6 + ph[2]) * 0.6);
      p.setXYZ(i, x * radius * sx * n, y * radius * sy * n, z * radius * sz * n);
    }
    geo.computeVertexNormals(); return geo;
  }

  /* closed flat sac (cisterna): pillow with rounded rim. Returns geometry + exact surface sampler. */
  function pillow(a, b, t, bend, ruf, seg, seed) {
    var R = rng(seed || 1), ph1 = R() * 6, ph2 = R() * 6, N = seg;
    function surf(X, Z) { // lumen mid-surface height and half thickness at world-local (X,Z)
      var x = X / a, z = Z / b, r = Math.min(1, Math.sqrt(x * x + z * z));
      return { y0: bend * (X * X + Z * Z) + ruf * Math.sin(X * 4 + ph1) * Math.cos(Z * 5 + ph2) * r * r, h: t * Math.pow(Math.max(0, 1 - Math.pow(r, 6)), 0.35) };
    }
    var pos = [], uv = [], idx = [];
    [1, -1].forEach(function (side) {
      var base = pos.length / 3;
      for (var j = 0; j <= N; j++) for (var i = 0; i <= N; i++) {
        var u = -1 + 2 * i / N, v = -1 + 2 * j / N;
        var x = u * Math.sqrt(1 - v * v / 2), z = v * Math.sqrt(1 - u * u / 2), s = surf(x * a, z * b);
        pos.push(x * a, s.y0 + side * s.h, z * b); uv.push(u * 0.5 + 0.5, v * 0.5 + 0.5);
      }
      for (var jj = 0; jj < N; jj++) for (var ii = 0; ii < N; ii++) {
        var A = base + jj * (N + 1) + ii, B = A + 1, C = A + N + 1, D = C + 1;
        if (side > 0) idx.push(A, C, B, B, C, D); else idx.push(A, B, C, B, D, C);
      }
    });
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    return { geo: geo, surf: surf };
  }

  /* vesicle: translucent lipid shell with a darker inner leaflet ring */
  function makeVesicle(r, color, name) {
    var g = new THREE.Group();
    var shell = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.35, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false, emissive: color, emissiveIntensity: 0.08 }));
    var inner = new THREE.Mesh(new THREE.SphereGeometry(r * 0.86, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xfff3d6, roughness: 0.6, transparent: true, opacity: 0.55, depthWrite: false }));
    g.add(inner); g.add(shell);
    tagPart(g, name); g.userData.baseOpacity = 0.5; g.userData.shell = shell; g.userData.inner = inner;
    return g;
  }

  /* hourglass protein channel (translocon / membrane protein) */
  function channel(h, rOut, rIn, color) {
    var pts = [], n = 10, i;
    for (i = 0; i <= n; i++) { var u = i / n, w = 1 - 0.55 * Math.exp(-Math.pow((u - 0.5) * 4, 2)); pts.push(new THREE.Vector2(rIn + (rOut - rIn) * w, (u - 0.5) * h)); }
    var m = new THREE.Mesh(new THREE.LatheGeometry(pts, 14), new THREE.MeshStandardMaterial({ color: color, roughness: 0.5, side: THREE.DoubleSide }));
    return m;
  }

  /* =======================================================
     create()
     ======================================================= */
  var STEP_NAMES = ["Ribosome builds the protein", "Protein enters the rough ER", "Transport vesicle buds off", "Golgi body sorts and packs", "Secretory vesicle fuses (exocytosis)"];
  var COL = { er: 0x5fa8c9, golgiCis: 0xf0a23c, golgiTrans: 0xd9526b, ribL: 0xc99a2e, ribS: 0xf0d27c, cargo: 0xff7b1c, cargoMod: 0xd1447a, wall: 0xe6c28a, head: 0xf7e3cf, tail: 0xb98a4a, mrna: 0x2e5fa8, chain: 0xf2a33a };

  function create(opts) {
    opts = opts || {};
    var S = {
      step: Math.max(0, Math.min(4, opts.step | 0)), t: opts.t != null ? clamp01(opts.t) : 0,
      play: opts.play !== false, speed: opts.speed || 1, autoAdvance: !!opts.autoAdvance, labels: opts.labels !== false,
      aaTotal: opts.aaTotal || 120, stepSeconds: opts.stepSeconds || 6
    };
    var onEvent = opts.onEvent || null;
    var root = new THREE.Group(), parts = {};
    var memTex = grainTex(11, "#ffffff", "#7aa6bb", 128, 3), memBump = bumpTex(12, 128, 3);

    /* ---------- rough ER : three stacked cisternae, ribosomes on the cytosolic faces ---------- */
    var ER = { cx: -2.6, cz: 0, a: 1.3, b: 0.9, t: 0.09, ys: [0.5, 0.16, -0.18] };
    var erGroup = new THREE.Group(), erSheets = [];
    var erMat = new THREE.MeshStandardMaterial({ color: COL.er, roughness: 0.45, transparent: true, opacity: 0.45, depthWrite: false, map: memTex, bumpMap: memBump, bumpScale: 0.6, emissive: COL.er, emissiveIntensity: 0.06 });
    var lumenMat = new THREE.MeshStandardMaterial({ color: 0xfff1d0, roughness: 0.7, emissive: 0xfff1d0, emissiveIntensity: 0.1, transparent: true, opacity: 0.3, depthWrite: false });
    ER.ys.forEach(function (y, i) {
      var pl = pillow(ER.a, ER.b, ER.t, 0.0, 0.03, 36, 20 + i), lu = pillow(ER.a * 0.97, ER.b * 0.97, ER.t * 0.55, 0.0, 0.03, 24, 20 + i);
      var sh = new THREE.Mesh(pl.geo, erMat), ln = new THREE.Mesh(lu.geo, lumenMat);
      var grp = new THREE.Group(); grp.add(ln); grp.add(sh); grp.position.set(ER.cx, y, ER.cz); grp.rotation.y = 0;
      grp.userData.surf = pl.surf; erGroup.add(grp); erSheets.push(grp);
    });
    root.add(erGroup); parts.roughER = tagPart(erGroup, "roughER");
    erSheets.forEach(function (g) { g.children[0].userData.partId = "lumen"; });
    parts.lumen = erSheets[0].children[0];

    // ribosomes studding the cytosolic faces: two InstancedMeshes (large + small subunit)
    var HERO = v3(-3.0, 0.0, 0.15), R = rng(7), placed = [];
    var largeG = lumpy(0.052, 1.15, 0.8, 1, 3, 0.1, 10, 8), smallG = lumpy(0.036, 1, 0.75, 0.9, 4, 0.1, 8, 6);
    var maxInst = 120;
    var iL = new THREE.InstancedMesh(largeG, new THREE.MeshStandardMaterial({ color: COL.ribL, roughness: 0.65, map: grainTex(5, "#ffffff", "#7a5a10", 64, 1) }), maxInst);
    var iS = new THREE.InstancedMesh(smallG, new THREE.MeshStandardMaterial({ color: COL.ribS, roughness: 0.65 }), maxInst);
    var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), cnt = 0, tries = 0;
    var perSheet = [34, 26, 22];
    erSheets.forEach(function (sh, si) {
      var n = 0;
      while (n < perSheet[si] && tries++ < 3000 && cnt < maxInst) {
        var ux = (R() * 2 - 1) * 0.86, uz = (R() * 2 - 1) * 0.86;
        if (ux * ux + uz * uz > 0.78) continue;
        var X = ux * ER.a, Z = uz * ER.b, wx = ER.cx + X, wz = Z;
        if (si === 0 && Math.hypot(wx - HERO.x, wz - HERO.z) < 0.34) continue;
        var dup = false; for (var k = 0; k < placed.length; k++) if (placed[k][3] === si && Math.hypot(placed[k][0] - wx, placed[k][1] - wz) < 0.17) { dup = true; break; }
        if (dup) continue;
        placed.push([wx, wz, 0, si]);
        var sf = sh.userData.surf(X, Z), y = ER.ys[si] + sf.y0 + sf.h + 0.036;
        e.set(0, R() * TAU, (R() - 0.5) * 0.3); q.setFromEuler(e);
        m4.compose(v3(wx, y, wz), q, v3(1, 1, 1)); iL.setMatrixAt(cnt, m4);
        m4.compose(v3(wx, y + 0.052, wz), q, v3(1, 1, 1)); iS.setMatrixAt(cnt, m4);
        cnt++; n++;
      }
    });
    iL.count = iS.count = cnt; iL.instanceMatrix.needsUpdate = iS.instanceMatrix.needsUpdate = true;
    var studs = new THREE.Group(); studs.add(iL); studs.add(iS); root.add(studs); parts.ribosomes = tagPart(studs, "ribosomes");

    // hero ribosome translating on the top sheet, with mRNA, codon beads and a translocon
    var hsf = erSheets[0].userData.surf(HERO.x - ER.cx, HERO.z), topY = ER.ys[0] + hsf.y0 + hsf.h;
    HERO.y = topY + 0.125;
    var hero = new THREE.Group(); hero.position.copy(HERO);
    var hL = new THREE.Mesh(lumpy(0.15, 1.15, 0.8, 1, 31, 0.07, 22, 16), new THREE.MeshStandardMaterial({ color: COL.ribL, roughness: 0.6, map: grainTex(6, "#ffffff", "#7a5a10", 64, 1), bumpMap: bumpTex(9, 64, 2), bumpScale: 0.5 }));
    var hS = new THREE.Mesh(lumpy(0.098, 1, 0.75, 0.92, 32, 0.07, 18, 12), new THREE.MeshStandardMaterial({ color: COL.ribS, roughness: 0.6, bumpMap: bumpTex(10, 64, 2), bumpScale: 0.5 }));
    hS.position.y = 0.135; hero.add(hL); hero.add(hS);
    var mpts = []; for (var mi = 0; mi <= 14; mi++) mpts.push(v3(-0.42 + 0.84 * mi / 14, 0.088 + Math.sin(mi * 1.3) * 0.012, Math.cos(mi * 0.9) * 0.02));
    var mrna = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mpts), 40, 0.011, 6, false), new THREE.MeshStandardMaterial({ color: COL.mrna, roughness: 0.5 }));
    hero.add(mrna);
    var beads = new THREE.Group(), beadMat = new THREE.MeshStandardMaterial({ color: 0x6e93d6, roughness: 0.5 });
    for (var bi = 0; bi < 9; bi++) { var bd = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), beadMat); bd.position.set(0, 0.088, 0); beads.add(bd); }
    hero.add(beads);
    root.add(hero); parts.ribosome = tagPart(hero, "ribosome"); parts.mRNA = tagPart(mrna, "mRNA");
    var heroMotion = { rock: 0 };
    var transloc = channel(0.22, 0.062, 0.02, 0x3f7f9e); transloc.position.set(HERO.x, topY - 0.04, HERO.z);
    root.add(transloc); parts.translocon = tagPart(transloc, "translocon");

    // growing polypeptide: one tube, revealed with drawRange
    var chainPts = [v3(-3.0, topY + 0.0, 0.15), v3(-3.0, 0.52, 0.15), v3(-2.94, 0.47, 0.2), v3(-2.86, 0.52, 0.12), v3(-2.83, 0.46, 0.19), v3(-2.78, 0.52, 0.1), v3(-2.76, 0.47, 0.17), v3(-2.73, 0.5, 0.15)];
    var chainCurve = new THREE.CatmullRomCurve3(chainPts), CH_SEG = 90, CH_RAD = 6;
    var chainMesh = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, CH_SEG, 0.013, CH_RAD, false), new THREE.MeshStandardMaterial({ color: COL.chain, roughness: 0.4, emissive: COL.chain, emissiveIntensity: 0.12 }));
    root.add(chainMesh); parts.polypeptide = tagPart(chainMesh, "polypeptide");
    var L0 = chainPts[chainPts.length - 1].clone();

    /* ---------- Golgi body : five curved cisternae, cis (ER side) -> trans (membrane side) ---------- */
    var GO = { x0: -0.2, dx: 0.28, yc: 0.1, zc: 0.0, bend: 0.22 };
    var golgi = new THREE.Group(), golgiPlates = [], golgiMats = [];
    var cisC = new THREE.Color(COL.golgiCis), trC = new THREE.Color(COL.golgiTrans);
    for (var gi = 0; gi < 5; gi++) {
      var fr = gi / 4, A = 0.78 - 0.05 * gi, B = 0.7 - 0.04 * gi, th = 0.04 + 0.0125 * gi;
      var col = cisC.clone().lerp(trC, fr);
      var mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.4, transparent: true, opacity: 0.66, depthWrite: false, bumpMap: memBump, bumpScale: 0.5, emissive: col, emissiveIntensity: 0.08 });
      golgiMats.push(mat);
      var gp = pillow(A, B, th, GO.bend * (1 - 0.0 * fr), 0.012, 30, 40 + gi), gl = pillow(A * 0.96, B * 0.96, th * 0.5, GO.bend, 0.012, 20, 40 + gi);
      var pg = new THREE.Group(); pg.add(new THREE.Mesh(gl.geo, lumenMat)); pg.add(new THREE.Mesh(gp.geo, mat));
      pg.rotation.z = -Math.PI / 2; // local y -> world +x, local x -> world -y
      pg.position.set(GO.x0 + GO.dx * gi, GO.yc, GO.zc);
      pg.userData = { surf: gp.surf, A: A, B: B, th: th, mat: mat, base: col.clone() };
      golgi.add(pg); golgiPlates.push(pg);
      // dilated rim blebs on the trans cisternae
      if (gi >= 3) {
        var bl = new THREE.Mesh(new THREE.SphereGeometry(0.045 + 0.01 * (gi - 3), 10, 8), mat);
        bl.position.set(pg.position.x + GO.bend * A * A + 0.005, GO.yc + A * 0.97, 0.05); golgi.add(bl);
      }
    }
    // plate k world point inside its lumen at height-offset dy, depth dz (matches the rotated pillow exactly)
    function plateLumen(k, dy, dz) { var pg = golgiPlates[k]; var s = pg.userData.surf(-dy, dz); return v3(pg.position.x + s.y0, GO.yc + dy, GO.zc + dz); }
    var gy = 0.22, gz = 0.1, C = [0, 1, 2, 3, 4].map(function (k) { return plateLumen(k, gy + (k % 2 ? 0.05 : -0.04), gz); });
    root.add(golgi);
    parts.golgi = tagPart(golgi, "golgi");
    parts.cis = tagPart(golgiPlates[0], "cis"); parts.trans = tagPart(golgiPlates[4], "trans");

    /* ---------- cell membrane (bilayer slab) with exocytosis bulge ---------- */
    var WM = { x0: 3.35, k: 0.05, y0: -1.0, y1: 1.3, z0: -0.5, z1: 0.5, ny: 24, nz: 10, h: 0.05, My: 0.32, Mz: 0.1 };
    function wallX(y, z, f) { return WM.x0 - WM.k * (y * y + z * z) + f * 0.2 * Math.exp(-((y - WM.My) * (y - WM.My) + (z - WM.Mz) * (z - WM.Mz)) / 0.075); }
    var slabN = (WM.ny + 1) * (WM.nz + 1), slab = new THREE.BufferGeometry(), sPos = new Float32Array(slabN * 3 * 2), sIdx = [], gridYZ = [];
    for (var jz = 0; jz <= WM.nz; jz++) for (var jy = 0; jy <= WM.ny; jy++) gridYZ.push([lerp(WM.y0, WM.y1, jy / WM.ny), lerp(WM.z0, WM.z1, jz / WM.nz)]);
    function gi2(j, i) { return j * (WM.ny + 1) + i; }
    for (var sj = 0; sj < WM.nz; sj++) for (var si2 = 0; si2 < WM.ny; si2++) {
      var a0 = gi2(sj, si2), b0 = a0 + 1, c0 = a0 + WM.ny + 1, d0 = c0 + 1, o = slabN;
      sIdx.push(a0, b0, c0, b0, d0, c0);                    // outer face (+x)
      sIdx.push(a0 + o, c0 + o, b0 + o, b0 + o, c0 + o, d0 + o); // inner face (-x)
    }
    function rim(i0, i1, j0, j1) { // side wall strip along a border
      var A0 = gi2(j0, i0), A1 = gi2(j1, i1); sIdx.push(A0, A0 + slabN, A1, A1, A0 + slabN, A1 + slabN);
    }
    for (var ri = 0; ri < WM.ny; ri++) { rim(ri, ri + 1, 0, 0); rim(ri + 1, ri, WM.nz, WM.nz); }
    for (var rj = 0; rj < WM.nz; rj++) { rim(0, 0, rj + 1, rj); rim(WM.ny, WM.ny, rj, rj + 1); }
    slab.setIndex(sIdx); slab.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    var slabMesh = new THREE.Mesh(slab, new THREE.MeshStandardMaterial({ color: COL.tail, roughness: 0.6, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
    var headG = new THREE.SphereGeometry(0.02, 6, 5), HEADS = 2 * 10 * 24;
    var heads = new THREE.InstancedMesh(headG, new THREE.MeshStandardMaterial({ color: COL.head, roughness: 0.45 }), HEADS);
    var headYZ = [], RH = rng(77);
    for (var side = -1; side <= 1; side += 2) for (var hz = 0; hz < 10; hz++) for (var hy = 0; hy < 24; hy++)
      headYZ.push([lerp(WM.y0, WM.y1, (hy + 0.5 + (RH() - 0.5) * 0.4 + (hz % 2) * 0.5) / 24.5), lerp(WM.z0, WM.z1, (hz + 0.5 + (RH() - 0.5) * 0.4) / 10), side]);
    var wallGroup = new THREE.Group(); wallGroup.add(slabMesh); wallGroup.add(heads);
    var wallProteins = [];
    [[-0.6, -0.25], [0.95, -0.2], [-0.1, 0.3], [0.75, 0.3]].forEach(function (p) {
      var ch = channel(0.2, 0.05, 0.016, 0x9a6d33); ch.rotation.z = Math.PI / 2; ch.userData.yz = p; wallGroup.add(ch); wallProteins.push(ch);
    });
    var lastBulge = -1;
    function setBulge(f) {
      if (Math.abs(f - lastBulge) < 0.002) return; lastBulge = f;
      var i, p = slab.attributes.position.array;
      for (i = 0; i < slabN; i++) {
        var x = wallX(gridYZ[i][0], gridYZ[i][1], f);
        p[i * 3] = x + WM.h; p[i * 3 + 1] = gridYZ[i][0]; p[i * 3 + 2] = gridYZ[i][1];
        p[(i + slabN) * 3] = x - WM.h; p[(i + slabN) * 3 + 1] = gridYZ[i][0]; p[(i + slabN) * 3 + 2] = gridYZ[i][1];
      }
      slab.attributes.position.needsUpdate = true; slab.computeVertexNormals(); slab.computeBoundingSphere();
      for (i = 0; i < HEADS; i++) {
        var h = headYZ[i], xx = wallX(h[0], h[1], f) + h[2] * (WM.h + 0.012);
        m4.compose(v3(xx, h[0], h[1]), q.identity(), v3(1, 1, 1)); heads.setMatrixAt(i, m4);
      }
      heads.instanceMatrix.needsUpdate = true;
      wallProteins.forEach(function (ch) { ch.position.set(wallX(ch.userData.yz[0], ch.userData.yz[1], f), ch.userData.yz[0], ch.userData.yz[1]); });
    }
    setBulge(0);
    root.add(wallGroup); parts.membrane = tagPart(wallGroup, "membrane");
    var M_IN = v3(wallX(WM.My, WM.Mz, 0) - WM.h - 0.17, WM.My, WM.Mz);

    /* ---------- cargo (the protein) and the three vesicles ---------- */
    var cargo = new THREE.Group(), cargoMat = new THREE.MeshStandardMaterial({ color: COL.cargo, roughness: 0.4, emissive: COL.cargo, emissiveIntensity: 0.25, depthTest: false });
    var dirs = [];
    for (var cI = 0; cI < 7; cI++) {
      var cm = new THREE.Mesh(lumpy(1, 1, 1, 1, 90 + cI, 0.12, 10, 8), cargoMat), rr = 0.042 + (cI % 3) * 0.008;
      var ang = cI / 7 * TAU, dv = v3(Math.cos(ang) * 0.045, Math.sin(ang * 1.7) * 0.035, Math.sin(ang) * 0.045);
      cm.scale.setScalar(rr); cm.renderOrder = 12; cm.position.copy(dv); cargo.add(cm); dirs.push(dv.clone());
    }
    root.add(cargo); parts.cargo = tagPart(cargo, "cargo");
    var vesT = makeVesicle(0.15, COL.er, "transportVesicle"), vesH = makeVesicle(0.09, COL.golgiCis, "hopVesicle"), vesS = makeVesicle(0.155, COL.golgiTrans, "secretoryVesicle");
    [vesT, vesH, vesS].forEach(function (v) { v.visible = false; root.add(v); });
    parts.transportVesicle = vesT; parts.secretoryVesicle = vesS; parts.hopVesicle = vesH;

    // vesicle paths (CatmullRomCurve3)
    var B0 = v3(ER.cx + ER.a * 0.84, ER.ys[0], 0.1);
    var curveA = new THREE.CatmullRomCurve3([L0, v3(-2.42, 0.51, 0.06), v3(-2.05, 0.5, 0.1), v3(-1.7, 0.5, 0.1), B0.clone()]);
    var G0 = v3(GO.x0 - 0.14, gy + 0.1, gz);
    var curveB = new THREE.CatmullRomCurve3([B0.clone(), v3(-1.25, 0.66, 0.12), v3(-0.95, 0.74, 0.1), v3(-0.65, 0.62, 0.1), G0.clone()]);
    var T0 = v3(C[4].x + 0.17, C[4].y, C[4].z);
    var curveD = new THREE.CatmullRomCurve3([T0.clone(), v3(1.55, 0.5, 0.15), v3(2.15, 0.62, 0.2), v3(2.7, 0.45, 0.15), M_IN.clone()]);
    var pathParts = new THREE.Group();
    [curveA, curveB, curveD].forEach(function (cv, i) {
      var tb = new THREE.Mesh(new THREE.TubeGeometry(cv, 30, 0.0035, 4, false), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 }));
      pathParts.add(tb);
    });
    pathParts.visible = false; root.add(pathParts); parts.paths = pathParts;

    /* ---------- labels ---------- */
    var labels = new THREE.Group();
    function addLab(txt, x, y, z, h) { var s = label(txt, h || 0.19); s.position.set(x, y, z); labels.add(s); return s; }
    addLab("Ribosome", -3.0, 1.22, 0.15); addLab("Rough ER", -2.6, -0.62, 0.5);
    addLab("Golgi body", 0.4, -0.92, 0.3); addLab("cis", -0.2, 1.08, 0.1, 0.16); addLab("trans", 0.92, 1.08, 0.1, 0.16);
    addLab("Cell membrane", 3.3, 1.55, 0.1); addLab("Outside", 3.9, -0.35, 0.1, 0.16);
    root.add(labels);

    /* ---------- the model ---------- */
    var pNow = 0, flags = { golgi: false, membrane: false, done: false }, lastStepEmitted = -1;
    var tmpA = v3(0, 0, 0);
    function ease(x) { return x * x * (3 - 2 * x); }
    function modelAt(p) {
      var o = { p: p, pos: L0.clone(), cargoScale: 0, chain: Math.min(1, p / 0.85), vesicle: null, vs: 0, squash: 0, vesPos: null, modified: 0, release: 0, bulge: smooth(4.8, 5.0, p), comp: "cytosol", plate: -1 };
      if (p < 0.75) { o.comp = "ribosome on rough ER"; }
      else if (p < 1.0) { o.cargoScale = smooth(0.75, 1.0, p); o.comp = "rough ER lumen"; }
      else if (p < 1.75) { o.cargoScale = 1; curveA.getPoint(ease((p - 1) / 0.75), o.pos); o.comp = "rough ER lumen"; }
      else if (p < 2.0) { o.cargoScale = 1; o.pos.copy(B0); o.vesicle = "T"; o.vs = smooth(1.75, 2.0, p); o.comp = "transport vesicle (budding)"; }
      else if (p < 2.85) { o.cargoScale = 1; curveB.getPoint(ease((p - 2) / 0.85), o.pos); o.vesicle = "T"; o.vs = 1; o.comp = "transport vesicle"; }
      else if (p < 3.0) { var f1 = (p - 2.85) / 0.15; o.cargoScale = 1; o.pos.copy(G0).lerp(C[0], ease(f1)); o.vesicle = "T"; o.vs = 1 - f1; o.squash = f1; o.vesPos = G0.clone().lerp(C[0], 0.4 * f1); o.comp = "fusing with Golgi (cis face)"; o.plate = 0; }
      else if (p < 3.9) {
        var u = (p - 3) / 0.9 * 4, k = Math.min(3, Math.floor(u)), f = u - k, ff = smooth(0.35, 0.85, f);
        o.cargoScale = 1; o.pos.copy(C[k]).lerp(C[k + 1], ff); o.modified = clamp01((p - 3) / 0.9);
        o.plate = ff < 0.5 ? k : k + 1; o.comp = "Golgi body, cisterna " + (o.plate + 1) + " of 5";
        var hs = Math.sin(Math.PI * clamp01((f - 0.3) / 0.6)); if (hs > 0.02) { o.vesicle = "H"; o.vs = hs; }
      }
      else if (p < 4.0) { var f2 = smooth(3.9, 4.0, p); o.cargoScale = 1; o.modified = 1; o.pos.copy(C[4]).lerp(T0, f2); o.vesicle = "S"; o.vs = f2; o.plate = 4; o.comp = "secretory vesicle (budding from trans face)"; }
      else if (p < 4.85) { o.cargoScale = 1; o.modified = 1; curveD.getPoint(ease((p - 4) / 0.85), o.pos); o.vesicle = "S"; o.vs = 1; o.comp = "secretory vesicle"; }
      else {
        var f3 = clamp01((p - 4.85) / 0.15); o.cargoScale = 1; o.modified = 1; o.release = f3;
        o.pos.copy(M_IN); o.pos.x = lerp(M_IN.x, M_IN.x + 0.62, ease(f3)); o.vesicle = "S"; o.vs = 1 - f3 * 0.9; o.squash = f3; o.vesPos = M_IN.clone().add(v3(0.06 * f3, 0, 0));
        o.comp = f3 >= 1 ? "outside the cell (secreted)" : "fusing with the cell membrane";
      }
      return o;
    }
    var chainIdxTotal = CH_SEG * CH_RAD * 6;

    function apply(p, dt, time) {
      var m = modelAt(p);
      // chain
      chainMesh.visible = p < 1.02; var cf = m.chain;
      chainMesh.geometry.setDrawRange(0, Math.floor(cf * CH_SEG) * CH_RAD * 6);
      // hero ribosome motion while translating
      var translating = S.step === 0 && S.play && S.t < 1;
      heroMotion.rock = translating ? Math.sin(time * 6) * 0.025 : heroMotion.rock * 0.9;
      hero.rotation.z = heroMotion.rock; hero.position.y = HERO.y + (translating ? Math.sin(time * 9) * 0.004 : 0);
      var bs = ((time * 0.05) % 0.09);
      beads.children.forEach(function (b, i) { b.position.x = -0.38 + i * 0.09 + (translating ? bs : 0); b.visible = b.position.x < 0.4; });
      // cargo
      cargo.visible = m.cargoScale > 0.01; cargo.position.copy(m.pos); cargo.scale.setScalar(m.cargoScale * (1 + 0.04 * Math.sin(time * 5)));
      cargoMat.color.setHex(COL.cargo).lerp(new THREE.Color(COL.cargoMod), m.modified); cargoMat.emissive.copy(cargoMat.color);
      var spread = 1 + m.release * 3.2;
      for (var i = 0; i < cargo.children.length; i++) cargo.children[i].position.copy(dirs[i]).multiplyScalar(spread);
      // vesicles
      vesT.visible = vesS.visible = vesH.visible = false;
      if (m.vesicle) {
        var vv = m.vesicle === "T" ? vesT : m.vesicle === "S" ? vesS : vesH;
        vv.visible = true; vv.position.copy(m.vesPos || m.pos);
        var s = Math.max(0.001, m.vs), sq = m.squash;
        vv.scale.set(s * (1 - 0.8 * sq), s * (1 + 0.25 * sq), s * (1 + 0.25 * sq));
        var wob = 1 + 0.04 * Math.sin(time * 7 + p * 9); vv.scale.multiplyScalar(wob);
        var op = vv.userData.baseOpacity * (1 - sq * sq);
        vv.userData.shell.material.opacity = op; vv.userData.inner.material.opacity = op * 1.1;
        if (m.vesicle === "T" && p < 2.0) vv.position.x += 0.03 * (1 - m.vs);
      }
      // Golgi plates glow where the cargo is
      for (var gi3 = 0; gi3 < 5; gi3++) { var mt = golgiMats[gi3]; var on = gi3 === m.plate ? 0.55 : 0.08; mt.emissiveIntensity += (on - mt.emissiveIntensity) * Math.min(1, dt * 8 + 0.01); }
      // ER sheet 0 glows while protein is in the lumen
      erMat.emissiveIntensity = (p >= 0.75 && p < 2.0) ? 0.2 + 0.1 * Math.sin(time * 4) : 0.06;
      setBulge(m.bulge);
      pNow = p; return m;
    }

    /* ---------- state, events, reading ---------- */
    function fire(name, detail) {
      if (onEvent) { try { onEvent(name, detail); } catch (e) {} }
      if (typeof document !== "undefined" && document.dispatchEvent) { try { document.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e2) {} }
    }
    var last = null;
    function reading() {
      var m = last || modelAt(S.step + S.t), p = m.p;
      var released = p >= 5.0 - 1e-6 && m.release >= 1;
      return {
        step: S.step, stepName: STEP_NAMES[S.step], t: +S.t.toFixed(3), p: +p.toFixed(3),
        compartment: m.comp,
        aaBuilt: Math.round(S.aaTotal * Math.min(1, p / 0.85)), aaTotal: S.aaTotal,
        fusionEvents: (p >= 3.0 ? 1 : 0) + (p >= 5.0 ? 1 : 0),
        bilayersCrossed: p >= 0.05 ? 1 : 0,            // the only bilayer the chain threads through is the ER membrane (translocon)
        vesicleSteps: (p >= 2.0 ? 1 : 0) + (p >= 4.0 ? 1 : 0),
        golgiCisterna: m.plate >= 0 ? m.plate + 1 : 0, modified: +m.modified.toFixed(3),
        secreted: released
      };
    }
    function setState(n) {
      n = n || {};
      if (n.autoAdvance != null) S.autoAdvance = !!n.autoAdvance;
      if (n.speed != null) S.speed = Math.max(0.1, +n.speed);
      if (n.labels != null) { S.labels = !!n.labels; labels.visible = S.labels; }
      if (n.paths != null) pathParts.visible = !!n.paths;
      if (n.step != null) { var st = Math.max(0, Math.min(4, n.step | 0)); if (st !== S.step || n.t == null) { S.step = st; S.t = 0; flags.done = false; } if (n.play == null) S.play = true; }
      if (n.t != null) { S.t = clamp01(n.t); if (n.play == null) S.play = false; }
      if (n.play != null) S.play = !!n.play;
      flags.golgi = S.step + S.t >= 3; flags.membrane = S.step + S.t >= 5; if (S.step + S.t < 5) flags.done = false;
      last = apply(S.step + S.t, 0.016, performance.now() / 1000);
      if (S.step !== lastStepEmitted) { lastStepEmitted = S.step; fire("protein-route:step", { step: S.step, name: STEP_NAMES[S.step], reading: reading() }); }
    }
    function update(dt, time) {
      dt = Math.min(dt || 0.016, 0.05);
      if (S.play && S.t < 1) {
        var before = S.step + S.t;
        S.t = Math.min(1, S.t + dt * S.speed / S.stepSeconds);
        var after = S.step + S.t;
        if (before < 3 && after >= 3 && !flags.golgi) { flags.golgi = true; fire("protein-route:fusion", { site: "golgi", reading: reading() }); }
        if (before < 5 && after >= 5 && !flags.membrane) { flags.membrane = true; fire("protein-route:fusion", { site: "membrane", reading: reading() }); }
        if (S.t >= 1) {
          fire("protein-route:step-done", { step: S.step, reading: reading() });
          if (S.step === 4) { if (!flags.done) { flags.done = true; fire("protein-route:done", { reading: reading() }); } }
          else if (S.autoAdvance) { S.step++; S.t = 0; lastStepEmitted = S.step; fire("protein-route:step", { step: S.step, name: STEP_NAMES[S.step], reading: reading() }); }
        }
      }
      last = apply(S.step + S.t, dt, time || 0);
    }
    function resetFlags() { flags.golgi = flags.membrane = flags.done = false; }

    var g = attachCompat(root, parts, update, setState);
    g.reading = reading;
    g.userData.reading = reading;
    g.userData.stepNames = STEP_NAMES.slice();
    g.userData.camera = { target: [0.2, 0.25, 0], span: 9.0, yaw: 0.45, pitch: 0.4 };
    // per-step close-up framing (target + horizontal span in scene units) so a 360 px phone can follow the action
    var FOCUS = [{ target: [-2.85, 0.45, 0.1], span: 2.1 }, { target: [-2.3, 0.35, 0.1], span: 3.5 }, { target: [-1.0, 0.5, 0.1], span: 3.4 }, { target: [0.4, 0.3, 0.1], span: 2.8 }, { target: [2.75, 0.35, 0.1], span: 3.2 }];
    g.userData.focusFor = function (st) { return FOCUS[Math.max(0, Math.min(4, st | 0))]; };
    g.userData.api = {
      play: function () { setState({ play: true }); }, pause: function () { setState({ play: false }); },
      goTo: function (s) { resetFlags(); setState({ step: s, play: true }); }, reset: function () { resetFlags(); setState({ step: 0, t: 0, play: false }); }
    };
    labels.visible = S.labels;
    flags.golgi = S.step * 1 + S.t >= 3; flags.membrane = S.step + S.t >= 5;
    last = apply(S.step + S.t, 0.016, 0);
    lastStepEmitted = S.step;
    return g;
  }

  global.ProteinRouteKit = { version: 1, create: create, makeHighlighter: makeHighlighter, stepNames: STEP_NAMES.slice() };
})(window);
