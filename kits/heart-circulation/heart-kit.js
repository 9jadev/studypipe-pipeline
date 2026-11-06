/* =========================================================
   StudyPipe · HeartKit v2 — anatomical 3D cardiovascular & haematology builders
   Classic script (no modules), 100% offline, uses window.THREE (+ window.SceneKit for labels).

   Every builder returns a THREE.Group g with:
     g.group                      -> g (self reference for compatibility)
     g.parts / g.userData.parts   -> { name: Object3D }  (use for spotlight rects / highlights)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState / g.userData.setState(obj)

   heart(o)          o: { bpm, mode, cutaway, labels, scale }
       modes: "both"|"heart"|"flow" (live section + blood flow), "pace" (conduction wave),
              "sys"|"wall" (section + 5 mm vs 15 mm wall callouts), "exterior" (outside view),
              "dissect" (Paper 3 specimen, longitudinal section, not beating), "specimen" (exterior specimen)
       setState({ bpm, mode, cutaway:false→exterior, labels, hold: 0..1 phase | null })
       g.userData.phase (0..1), g.userData.beat = { aSys, vSys, avOpen, slOpen }
   circuitCompare(o) setState({ mode: "double"|"single"|"incomplete"|"open"|"both" })
   cube(o)           setState({ L (mm), spread })
   valve(o)          setState({ open: 0..1 | "open"|"closed"|"systole", cusps: 2|3 })
   vessels(o)        setState({ focus: "artery"|"vein"|"capillary"|null })
   capillaryBed(o)   setState({ mode: "normal"|"kwash"|"congest"|"blocked", probe: 0..1|null, nfp })
   bloodSmear(o)     setState({ clot, sickle, hb })  · setClot(bool)
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  var TAU = Math.PI * 2;
  var V3 = THREE.Vector3;

  /* ---------------- shared helpers ---------------- */
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.42 : rough, metalness: 0.04 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function glass(color, opacity) {
    return new THREE.MeshStandardMaterial({
      color: color, roughness: 0.2, metalness: 0.0, transparent: true,
      opacity: opacity == null ? 0.3 : opacity, depthWrite: false, side: THREE.DoubleSide
    });
  }
  function glowMat(color, intensity) {
    return new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: intensity == null ? 0.5 : intensity, roughness: 0.35 });
  }
  function basic(color, opacity) {
    return new THREE.MeshBasicMaterial({ color: color, transparent: opacity != null, opacity: opacity == null ? 1 : opacity, depthWrite: opacity == null });
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

  // deterministic RNG so every student sees the same specimen
  function rng(seed) {
    var s = seed || 1;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  var _muscleTex = null;
  function muscleTex() {
    if (_muscleTex) return _muscleTex;
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = "rgb(232,232,232)"; g.fillRect(0, 0, 256, 256);
    var r = rng(7);
    for (var i = 0; i < 520; i++) {
      var x = r() * 256, y = r() * 256, L = 18 + r() * 60, a = -0.55 + (r() - 0.5) * 0.5;
      g.strokeStyle = r() < 0.5 ? "rgba(255,255,255," + (0.18 + r() * 0.25) + ")" : "rgba(150,150,150," + (0.12 + r() * 0.22) + ")";
      g.lineWidth = 0.8 + r() * 2.2;
      g.beginPath(); g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(a) * L * 0.5 + (r() - 0.5) * 8, y + Math.sin(a) * L * 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L);
      g.stroke();
    }
    for (var j = 0; j < 40; j++) {
      g.fillStyle = "rgba(255,255,255," + (0.05 + r() * 0.08) + ")";
      g.beginPath(); g.arc(r() * 256, r() * 256, 6 + r() * 18, 0, TAU); g.fill();
    }
    _muscleTex = srgb(new THREE.CanvasTexture(c));
    _muscleTex.wrapS = _muscleTex.wrapT = THREE.RepeatWrapping;
    _muscleTex.repeat.set(2, 2);
    return _muscleTex;
  }
  var _poolTex = null;
  function poolTex() {
    if (_poolTex) return _poolTex;
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(64, 58, 4, 64, 64, 66);
    grd.addColorStop(0, "#ffffff"); grd.addColorStop(0.55, "#d6d6d6"); grd.addColorStop(1, "#6a6a6a");
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    _poolTex = srgb(new THREE.CanvasTexture(c));
    return _poolTex;
  }
  function muscleMat(color, rough) {
    var m = std(color, rough == null ? 0.58 : rough);
    m.map = muscleTex(); m.bumpMap = muscleTex(); m.bumpScale = 1.2;
    return m;
  }

  // place a unit-height cylinder mesh between two points
  var _up = new V3(0, 1, 0), _dir = new V3();
  function between(mesh, a, b) {
    _dir.subVectors(b, a);
    var len = _dir.length() || 1e-4;
    mesh.position.copy(a).addScaledVector(_dir, 0.5);
    mesh.scale.set(1, len, 1);
    mesh.quaternion.setFromUnitVectors(_up, _dir.multiplyScalar(1 / len));
  }
  function bake(mesh) {
    mesh.updateMatrix();
    mesh.geometry.applyMatrix4(mesh.matrix);
    mesh.position.set(0, 0, 0); mesh.rotation.set(0, 0, 0); mesh.scale.set(1, 1, 1);
    return mesh;
  }
  function tube(points, radius, mat, segs, radial, closed) {
    var curve = new THREE.CatmullRomCurve3(points.map(function (p) { return p.isVector3 ? p : new V3(p[0], p[1], p[2] || 0); }), !!closed, "centripetal");
    var m = new THREE.Mesh(new THREE.TubeGeometry(curve, segs || 40, radius, radial || 12, !!closed), mat);
    m.userData.curve = curve;
    return m;
  }
  function capEnds(group, curve, radius, mat) {
    [0, 1].forEach(function (u) {
      var cap = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.98, 14, 10), mat);
      cap.position.copy(curve.getPointAt(u));
      group.add(cap);
    });
  }
  function attachCompat(g, o) {
    if (o && o.scale) g.scale.setScalar(o.scale);
    g.group = g;
    g.parts = g.userData.parts || {};
    var upd = g.userData.update || function () {};
    g.tick = upd; g.update = upd;
    if (!g.userData.setState) g.userData.setState = function () {};
    g.setState = g.userData.setState;
    return g;
  }

  /* ---------- biconcave RBC (outward-facing normals) ---------- */
  var _rbcCache = {};
  function rbcGeo(scale) {
    var s = scale || 1;
    if (_rbcCache[s]) return _rbcCache[s];
    var top = [];
    for (var i = 0; i <= 22; i++) {
      var x = i / 22;
      var y = 0.22 * s * Math.sqrt(Math.max(0, 1 - x * x)) * (0.16 + 0.98 * x * x - 0.68 * x * x * x * x);
      top.push(new THREE.Vector2(Math.max(1e-4, x * 0.22 * s), y));
    }
    var pts = [];
    for (var b = 0; b < top.length; b++) pts.push(new THREE.Vector2(top[b].x, -top[b].y)); // bottom: centre → rim
    for (var t = top.length - 1; t >= 0; t--) pts.push(new THREE.Vector2(top[t].x, top[t].y)); // top: rim → centre
    _rbcCache[s] = new THREE.LatheGeometry(pts, 30);
    return _rbcCache[s];
  }

  /* =====================================================================
     1. ANATOMICAL MAMMALIAN HEART (exterior + frontal longitudinal section)
     Viewer faces the front (sternocostal) surface: the heart's RIGHT side is
     on the viewer's LEFT (as in every textbook diagram).
     ===================================================================== */
  var HW = 0.62, HH = 0.65, HD = 0.46, HYC = -0.1;
  function fOf(ys) {
    var r = Math.sqrt(Math.max(0, 1 - ys * ys));
    return ys < 0 ? r * 0.45 + (1 + ys) * 0.55 : Math.pow(r, 0.7);
  }
  function place(x0, ys, z0, out) {
    var X = x0 * HW + (ys < 0 ? 0.22 * Math.pow(-ys, 1.5) : 0) + (x0 < 0 && ys > 0 ? x0 * 0.12 * ys : 0);
    var Y = ys * HH + HYC;
    var Z = z0 * HD * (z0 > 0 ? 0.9 : 1);
    return (out || new V3()).set(X, Y, Z);
  }
  function surf(ys, phi, lift) {
    var f = fOf(ys) * (1 + (lift || 0));
    return place(-Math.cos(phi) * f, ys, Math.sin(phi) * f);
  }
  function shellGeo(phiStart, phiLen) {
    var geo = new THREE.SphereGeometry(1, 72, 48, phiStart, phiLen);
    var p = geo.attributes.position, v = new V3();
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var r = Math.hypot(x, z), k = r > 1e-6 ? fOf(y) / r : 0;
      place(x * k, y, z * k, v);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // shared ventricle/atrium squeeze, mirrored in GLSL + JS so overlays follow the wall
  var SQ_GLSL = [
    "float hkY = transformed.y;",
    "float hkWv = smoothstep(0.16, -0.06, hkY);",
    "float hkWa = smoothstep(0.08, 0.22, hkY) * (1.0 - smoothstep(0.5, 0.62, hkY));",
    "float hkSv = 1.0 - 0.085 * uHkV * hkWv;",
    "transformed.x = 0.06 + (transformed.x - 0.06) * hkSv;",
    "transformed.z *= 1.0 - 0.07 * uHkV * hkWv;",
    "transformed.y += 0.07 * uHkV * hkWv * (0.12 - hkY);",
    "float hkSa = 1.0 - 0.08 * uHkA * hkWa;",
    "transformed.x *= hkSa;",
    "transformed.z *= hkSa;"
  ].join("\n");
  function squeezeJS(v, uV, uA, out) {
    out = out || new V3();
    var y = v.y;
    var wv = smooth(0.16, -0.06, y);
    var wa = smooth(0.08, 0.22, y) * (1 - smooth(0.5, 0.62, y));
    var sv = 1 - 0.085 * uV * wv;
    var x = 0.06 + (v.x - 0.06) * sv, z = v.z * (1 - 0.07 * uV * wv);
    var ny = y + 0.07 * uV * wv * (0.12 - y);
    var sa = 1 - 0.08 * uA * wa;
    return out.set(x * sa, ny, z * sa);
  }
  function smooth(e0, e1, x) {
    var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }
  function squeezable(mat, U) {
    mat.onBeforeCompile = function (shader) {
      shader.uniforms.uHkV = U.uHkV;
      shader.uniforms.uHkA = U.uHkA;
      shader.vertexShader = "uniform float uHkV;\nuniform float uHkA;\n" +
        shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n" + SQ_GLSL);
    };
    mat.customProgramCacheKey = function () { return "hk-squeeze-v2"; };
    return mat;
  }

  // Sutherland–Hodgman clip of a polygon against y >= cut (keepAbove) or y <= cut
  function clipY(poly, cut, keepAbove) {
    var out = [];
    function inside(p) { return keepAbove ? p.y >= cut : p.y <= cut; }
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length];
      var ia = inside(a), ib = inside(b);
      if (ia) out.push(a);
      if (ia !== ib) {
        var t = (cut - a.y) / (b.y - a.y);
        out.push(new THREE.Vector2(a.x + (b.x - a.x) * t, cut));
      }
    }
    return out;
  }
  function polyGeo(pts) {
    var geo = new THREE.ShapeGeometry(new THREE.Shape(pts), 1);
    geo.computeBoundingBox();
    var bb = geo.boundingBox, uv = geo.attributes.uv, p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      uv.setXY(i, (p.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (p.getY(i) - bb.min.y) / (bb.max.y - bb.min.y));
    }
    return geo;
  }
  function centroid(pts) {
    var c = new THREE.Vector2();
    pts.forEach(function (p) { c.add(p); });
    return c.multiplyScalar(1 / pts.length);
  }

  var BLUE = 0x2f5bd3, RED = 0xd92b3a, BLUE_V = 0x3a5fc8, RED_A = 0xc8202f;
  var SPEC = { shell: 0x6b2027, slab: 0x9a4a48, cavity: 0x2a0a0d, fat: 0xeedcae, artery: 0xd8b9ab, vein: 0x7a5468 };

  function heart(o) {
    o = o || {};
    var g = new THREE.Group();
    var parts = {};
    var U = { uHkV: { value: 0 }, uHkA: { value: 0 } };

    var body = new THREE.Group();   // squeezed tissue
    var vessels = new THREE.Group();
    var overlay = new THREE.Group(); // valves, chordae, particles, labels
    g.add(body, vessels, overlay);

    var M = {
      shell: squeezable(muscleMat(0xa3202f, 0.55), U),
      inner: squeezable(std(0x5a0f18, 0.7, { side: THREE.BackSide }), U),
      slab: squeezable(muscleMat(0xdc6470, 0.62), U),
      fat: squeezable(std(0xeed9a0, 0.6), U),
      coronaryA: squeezable(std(0xe0303c, 0.4), U),
      coronaryV: squeezable(std(0x5b3d8f, 0.45), U),
      auricle: squeezable(muscleMat(0xa52435, 0.6), U),
      poolR: squeezable(std(BLUE, 0.35, { map: poolTex(), emissive: new THREE.Color(BLUE), emissiveIntensity: 0.28 }), U),
      poolL: squeezable(std(RED, 0.35, { map: poolTex(), emissive: new THREE.Color(RED), emissiveIntensity: 0.28 }), U),
      papillary: squeezable(muscleMat(0xb8404c, 0.6), U),
      cond: squeezable(glowMat(0xffd84a, 0.25), U),
      aorta: std(RED_A, 0.38),
      pa: std(BLUE_V, 0.4),
      vc: std(0x2c4aa8, 0.42),
      pv: std(0xd23545, 0.4),
      leaflet: std(0xfff3dc, 0.45, { side: THREE.DoubleSide, emissive: new THREE.Color(0xc9b27a), emissiveIntensity: 0.45 }),
      chord: std(0xffffff, 0.35, { emissive: new THREE.Color(0x777777), emissiveIntensity: 0.4 })
    };
    var origColors = {};
    Object.keys(M).forEach(function (k) { origColors[k] = M[k].color.getHex(); });

    /* --- shells: full exterior + back half for the section --- */
    var shellFull = new THREE.Mesh(shellGeo(0, TAU), M.shell);
    var shellBack = new THREE.Mesh(shellGeo(Math.PI, Math.PI), M.shell);
    var shellBackInner = new THREE.Mesh(shellBack.geometry, M.inner);
    body.add(shellFull, shellBack, shellBackInner);
    parts.pericardium = shellFull;

    /* --- auricles (atrial appendages): ear-like flaps at the base --- */
    function auricle(ys, phi, sx, sy, rotZ, seed) {
      var geo = new THREE.SphereGeometry(1, 22, 14);
      var r = rng(seed), p = geo.attributes.position;
      for (var i = 0; i < p.count; i++) {
        var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        var crinkle = 1 + 0.12 * Math.sin(x * 9 + y * 5) * (y < 0 ? 1 : 0.4) + (r() - 0.5) * 0.04;
        p.setXYZ(i, x * crinkle, y * crinkle, z * 0.45);
      }
      geo.computeVertexNormals();
      var m = new THREE.Mesh(geo, M.auricle);
      m.scale.set(sx, sy, 1);
      m.rotation.z = rotZ;
      var at = surf(ys, phi, 0.02);
      m.position.copy(at);
      m.lookAt(at.clone().add(new V3(at.x * 0.6, 0.15, Math.max(0.2, at.z))));
      m.rotateZ(rotZ);
      m.scale.multiplyScalar(0.19);
      return bake(m);
    }
    var raAur = auricle(0.66, 0.55, 1.1, 0.75, 0.5, 3);
    var laAur = auricle(0.72, 2.45, 0.9, 0.6, -0.6, 5);
    body.add(raAur, laAur);
    parts.auricles = raAur;

    /* --- surface grooves: fat + coronary vessels (exterior only) --- */
    var exteriorOnly = new THREE.Group();
    body.add(exteriorOnly);
    var lad = [], sulcusR = [], sulcusL = [], vein = [];
    for (var i = 0; i <= 14; i++) {
      var ys = 0.72 - (i / 14) * 1.62;
      lad.push(surf(ys, 1.62 - 0.3 * ys, 0.0));
      vein.push(surf(ys * 0.92, 1.72 - 0.3 * ys, 0.012));
    }
    for (var j = 0; j <= 14; j++) {
      sulcusR.push(surf(0.52 - j * 0.004, 0.25 + (j / 14) * 1.15, 0.0));
      sulcusL.push(surf(0.55 + j * 0.002, 1.9 + (j / 14) * 0.95, 0.0));
    }
    var fat1 = tube(lad, 0.026, M.fat, 40, 8); exteriorOnly.add(fat1);
    var fat2 = tube(sulcusR, 0.02, M.fat, 30, 8); exteriorOnly.add(fat2);
    var fat3 = tube(sulcusL, 0.02, M.fat, 30, 8); exteriorOnly.add(fat3);
    var corA = tube(lad.map(function (p) { return p.clone().multiplyScalar(1.035); }), 0.016, M.coronaryA, 48, 6);
    var corR = tube(sulcusR.map(function (p) { return p.clone().multiplyScalar(1.04); }), 0.015, M.coronaryA, 30, 6);
    var corV = tube(vein, 0.014, M.coronaryV, 40, 6);
    exteriorOnly.add(corA, corR, corV);
    // small diagonal branches of the coronary artery
    [[0.3, 1.35, 0.0, 2.0], [-0.1, 1.55, -0.4, 2.15], [0.15, 1.45, -0.15, 1.05]].forEach(function (b) {
      var pts = [];
      for (var k = 0; k <= 6; k++) {
        var u = k / 6;
        pts.push(surf(b[0] + (b[2] - b[0]) * u, b[1] + (b[3] - b[1]) * u, 0.012));
      }
      exteriorOnly.add(tube(pts, 0.008, M.coronaryA, 16, 5));
    });
    parts.coronary = corA;

    /* --- longitudinal section slab with real cavities --- */
    var section = new THREE.Group();
    body.add(section);
    var outline = [];
    var N = 72;
    for (var a = 0; a <= N; a++) { var ya = 1 - 2 * a / N; var pa = place(fOf(ya), ya, 0); outline.push(new THREE.Vector2(pa.x, pa.y)); }
    for (var b2 = N - 1; b2 >= 1; b2--) { var yb = 1 - 2 * b2 / N; var pb = place(-fOf(yb), yb, 0); outline.push(new THREE.Vector2(pb.x, pb.y)); }

    function cavity(ctrl) {
      var sh = new THREE.Shape();
      sh.moveTo(ctrl[0][0], ctrl[0][1]);
      sh.splineThru(ctrl.slice(1).concat([ctrl[0]]).map(function (c) { return new THREE.Vector2(c[0], c[1]); }));
      var pts = sh.getSpacedPoints(180);
      pts.pop();
      return pts;
    }
    var rightCav = cavity([
      [-0.20, 0.47], [-0.36, 0.46], [-0.50, 0.36], [-0.53, 0.22], [-0.46, 0.12], [-0.50, 0.0], [-0.535, -0.14],
      [-0.40, -0.30], [-0.27, -0.42], [-0.15, -0.36], [-0.09, -0.20], [-0.085, -0.02], [-0.15, 0.10], [-0.11, 0.22], [-0.11, 0.38]
    ]);
    var leftCav = cavity([
      [0.12, 0.40], [0.25, 0.46], [0.40, 0.42], [0.47, 0.30], [0.41, 0.14], [0.385, -0.04], [0.355, -0.25],
      [0.27, -0.44], [0.20, -0.50], [0.13, -0.42], [0.08, -0.22], [0.07, -0.02], [0.14, 0.12], [0.10, 0.22], [0.10, 0.34]
    ]);
    var slabShape = new THREE.Shape(outline);
    slabShape.holes.push(new THREE.Path(rightCav), new THREE.Path(leftCav));
    var slabGeo = new THREE.ExtrudeGeometry(slabShape, { depth: 0.035, bevelEnabled: false, curveSegments: 4 });
    slabGeo.translate(0, 0, -0.035);
    // UVs from extrude are raw x/y — fine for the repeating muscle texture
    var slab = new THREE.Mesh(slabGeo, M.slab);
    section.add(slab);

    // blood pools split at the AV ring so atria & ventricles can be addressed separately
    function pool(pts, cut, above, mat) {
      var poly = clipY(pts, cut, above);
      var m = new THREE.Mesh(polyGeo(poly), mat);
      m.position.z = -0.02;
      m.userData.center = centroid(poly);
      return m;
    }
    var ra = pool(rightCav, 0.11, true, M.poolR);
    var rv = pool(rightCav, 0.11, false, M.poolR.clone());
    var la = pool(leftCav, 0.13, true, M.poolL);
    var lv = pool(leftCav, 0.13, false, M.poolL.clone());
    [rv, lv].forEach(function (m) { squeezable(m.material, U); });
    section.add(ra, rv, la, lv);
    parts.ra = ra; parts.rv = rv; parts.la = la; parts.lv = lv;

    // endocardium outline
    [rightCav, leftCav].forEach(function (pts) {
      var geo = new THREE.BufferGeometry().setFromPoints(pts.map(function (p) { return new V3(p.x, p.y, 0.002); }));
      var line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: 0xffd0d6, transparent: true, opacity: 0.55 }));
      section.add(line);
    });

    // papillary muscles
    var papTips = [];
    [[-0.37, -0.35, -0.36, -0.205], [-0.15, -0.33, -0.165, -0.20], [0.145, -0.40, 0.155, -0.245], [0.315, -0.37, 0.305, -0.225]].forEach(function (pp) {
      var base = new V3(pp[0], pp[1], 0.004), tip = new V3(pp[2], pp[3], 0.004);
      var cone = new THREE.Mesh(new THREE.ConeGeometry(0.038, 1, 12), M.papillary);
      between(cone, base, tip);
      section.add(bake(cone));
      papTips.push(tip);
    });
    parts.papillary = section;

    // wall / septum anchors for spotlights (invisible)
    function anchor(x, y, w, h) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), new THREE.MeshBasicMaterial({ visible: false }));
      m.position.set(x, y, 0);
      section.add(m);
      return m;
    }
    parts.rvWall = anchor(-0.57, -0.12, 0.08, 0.4);
    parts.lvWall = anchor(0.49, -0.15, 0.2, 0.45);
    parts.septum = anchor(-0.005, -0.18, 0.15, 0.5);

    /* --- conduction system on the cut face --- */
    var condGroup = new THREE.Group();
    section.add(condGroup);
    var SAN = new V3(-0.43, 0.43, 0.012), AVN = new V3(-0.02, 0.115, 0.012);
    var pathAtria = new THREE.CatmullRomCurve3([SAN, new V3(-0.30, 0.48, 0.012), new V3(-0.05, 0.42, 0.012), new V3(-0.02, 0.26, 0.012), AVN]);
    var pathR = new THREE.CatmullRomCurve3([AVN, new V3(-0.01, -0.02, 0.012), new V3(-0.035, -0.30, 0.012), new V3(-0.03, -0.52, 0.012),
      new V3(-0.14, -0.53, 0.012), new V3(-0.33, -0.41, 0.012), new V3(-0.565, -0.18, 0.012), new V3(-0.575, 0.0, 0.012)]);
    var pathL = new THREE.CatmullRomCurve3([AVN, new V3(0.01, -0.02, 0.012), new V3(0.04, -0.30, 0.012), new V3(0.11, -0.56, 0.012),
      new V3(0.28, -0.60, 0.012), new V3(0.41, -0.41, 0.012), new V3(0.49, -0.15, 0.012), new V3(0.52, 0.05, 0.012)]);
    var condMatA = M.cond, condMatV = M.cond.clone(); squeezable(condMatV, U);
    var tAtria = new THREE.Mesh(new THREE.TubeGeometry(pathAtria, 30, 0.007, 6), condMatA);
    var tR = new THREE.Mesh(new THREE.TubeGeometry(pathR, 60, 0.011, 6), condMatV);
    var tL = new THREE.Mesh(new THREE.TubeGeometry(pathL, 60, 0.011, 6), condMatV);
    var sanMat = squeezable(glowMat(0xffe14d, 0.6), U), avnMat = squeezable(glowMat(0xffc531, 0.6), U);
    var san = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 12), sanMat); san.position.copy(SAN);
    var avn = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 12), avnMat); avn.position.copy(AVN);
    condGroup.add(tAtria, tR, tL, bake(san), bake(avn));
    parts.san = san; parts.avn = avn; parts.his = tR; parts.purkinje = condGroup;

    var sparkTex = window.SceneKit ? SceneKit.glowSprite("rgba(255,236,120,1)", 1) : null;
    function spark() {
      var s = sparkTex ? sparkTex.clone() : new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffee88 }));
      s.material = s.material.clone();
      s.material.depthTest = false; s.material.blending = THREE.AdditiveBlending;
      s.scale.setScalar(0.16); s.renderOrder = 12;
      overlay.add(s);
      return s;
    }
    var sparkA = spark(), sparkR = spark(), sparkL = spark();
    var waveRing = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 40), new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0, depthWrite: false }));
    waveRing.position.copy(SAN); waveRing.position.z = 0.02;
    overlay.add(waveRing);

    /* --- AV valves (section) --- */
    function leafletGeo(len) {
      var s = new THREE.Shape();
      s.moveTo(-0.018, 0); s.lineTo(0.018, 0);
      s.quadraticCurveTo(0.03, -len * 0.6, 0.008, -len);
      s.lineTo(-0.008, -len);
      s.quadraticCurveTo(-0.03, -len * 0.6, -0.018, 0);
      var geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
      geo.translate(0, 0, 0.008);
      return geo;
    }
    var avValves = [];
    function avValve(h1, h2, len, papA, papB, name) {
      var grp = new THREE.Group();
      var l1 = new THREE.Mesh(leafletGeo(len), M.leaflet), l2 = new THREE.Mesh(leafletGeo(len), M.leaflet);
      grp.add(l1, l2);
      var c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 1, 5), M.chord);
      var c2 = c1.clone(), c3 = c1.clone(), c4 = c1.clone();
      grp.add(c1, c2, c3, c4);
      overlay.add(grp);
      var v = { grp: grp, l1: l1, l2: l2, h1: new V3(h1[0], h1[1], 0.01), h2: new V3(h2[0], h2[1], 0.01), len: len, pa: papA, pb: papB, chords: [c1, c2, c3, c4] };
      avValves.push(v);
      parts[name] = grp;
      return v;
    }
    avValve([-0.455, 0.125], [-0.155, 0.10], 0.165, papTips[0], papTips[1], "tricuspid");
    avValve([0.145, 0.125], [0.405, 0.145], 0.145, papTips[2], papTips[3], "bicuspid");
    parts.chordae = overlay;

    /* --- great vessels --- */
    var aortaPts = [[-0.02, 0.30, -0.02], [-0.08, 0.66, 0.0], [-0.06, 0.95, -0.04], [0.12, 1.10, -0.12], [0.34, 1.05, -0.22], [0.44, 0.82, -0.30], [0.45, 0.42, -0.33]];
    var aorta = tube(aortaPts, 0.105, M.aorta, 60, 16);
    vessels.add(aorta);
    capEnds(vessels, aorta.userData.curve, 0.105, M.aorta);
    var aortaGroup = new THREE.Group();
    aortaGroup.add(aorta);
    [0.36, 0.45, 0.54].forEach(function (u, i) {
      var base = aorta.userData.curve.getPointAt(u);
      var br = tube([base, base.clone().add(new V3(-0.02 + i * 0.02, 0.16, 0.0)), base.clone().add(new V3(-0.04 + i * 0.05, 0.3, 0.02))], 0.04 - i * 0.004, M.aorta, 10, 8);
      aortaGroup.add(br);
    });
    vessels.add(aortaGroup);
    parts.aorta = aortaGroup;

    var ptTrunk = tube([[0.07, 0.28, 0.2], [0.10, 0.56, 0.17], [0.16, 0.76, 0.06]], 0.092, M.pa, 24, 14);
    var lpa = tube([[0.16, 0.76, 0.06], [0.36, 0.80, 0.0], [0.60, 0.78, -0.07]], 0.072, M.pa, 20, 12);
    var rpa = tube([[0.14, 0.76, 0.03], [-0.10, 0.80, -0.20], [-0.52, 0.80, -0.24]], 0.07, M.pa, 24, 12);
    var paGroup = new THREE.Group();
    paGroup.add(ptTrunk, lpa, rpa);
    capEnds(paGroup, lpa.userData.curve, 0.072, M.pa);
    vessels.add(paGroup);
    parts.pulmonaryArtery = paGroup; parts.pulmArtery = paGroup;

    var svc = tube([[-0.36, 1.08, -0.04], [-0.36, 0.75, -0.03], [-0.35, 0.42, -0.02]], 0.085, M.vc, 16, 12);
    var ivc = tube([[-0.40, 0.10, -0.24], [-0.47, -0.22, -0.26], [-0.53, -0.46, -0.26]], 0.085, M.vc, 16, 12);
    var vcGroup = new THREE.Group(); vcGroup.add(svc, ivc);
    capEnds(vcGroup, svc.userData.curve, 0.085, M.vc);
    vessels.add(vcGroup);
    parts.venaCava = vcGroup;

    var pvGroup = new THREE.Group();
    [[[0.30, 0.37, -0.2], [0.50, 0.40, -0.22], [0.70, 0.42, -0.24]], [[0.30, 0.25, -0.22], [0.50, 0.24, -0.24], [0.70, 0.22, -0.26]],
     [[0.0, 0.36, -0.3], [-0.3, 0.38, -0.34], [-0.62, 0.40, -0.34]]].forEach(function (pp) {
      var t = tube(pp, 0.05, M.pv, 12, 10);
      pvGroup.add(t);
    });
    vessels.add(pvGroup);
    parts.pulmonaryVeins = pvGroup;

    // semilunar valves: three-cusp rings at the aortic & pulmonary roots
    function semilunar(pos, r, tilt) {
      var grp = new THREE.Group();
      grp.position.copy(pos);
      grp.rotation.x = tilt;
      var ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 28), M.leaflet);
      ring.rotation.x = Math.PI / 2;
      grp.add(ring);
      var cusps = [];
      for (var c = 0; c < 3; c++) {
        var piv = new THREE.Group();
        piv.rotation.y = c * TAU / 3;
        var flap = new THREE.Mesh(new THREE.CircleGeometry(r * 0.95, 14, 0, Math.PI), M.leaflet);
        flap.rotation.x = -Math.PI / 2;
        flap.position.set(0, 0, 0);
        var hinge = new THREE.Group();
        hinge.position.set(0, 0, r * 0.0);
        hinge.add(flap);
        piv.add(hinge);
        grp.add(piv);
        cusps.push(hinge);
      }
      grp.userData.cusps = cusps;
      vessels.add(grp);
      return grp;
    }
    var aorticValve = semilunar(new V3(-0.03, 0.40, -0.01), 0.085, 0.0);
    var pulmValve = semilunar(new V3(0.08, 0.37, 0.19), 0.075, -0.15);
    parts.aorticValve = aorticValve; parts.pulmValve = pulmValve;

    /* --- blood flow (section) --- */
    var flowGroup = new THREE.Group();
    overlay.add(flowGroup);
    var rightPath = new THREE.CatmullRomCurve3([[-0.36, 1.02, 0.03], [-0.36, 0.62, 0.04], [-0.33, 0.33, 0.03], [-0.30, 0.13, 0.03], [-0.33, -0.08, 0.03],
      [-0.27, -0.32, 0.03], [-0.16, -0.28, 0.04], [-0.11, -0.04, 0.06], [-0.02, 0.18, 0.13], [0.08, 0.42, 0.2], [0.13, 0.64, 0.15], [0.20, 0.78, 0.04], [0.40, 0.80, -0.01], [0.62, 0.78, -0.07]]
      .map(function (p) { return new V3(p[0], p[1], p[2]); }), false, "centripetal");
    var leftPath = new THREE.CatmullRomCurve3([[0.70, 0.40, 0.03], [0.46, 0.36, 0.03], [0.28, 0.32, 0.03], [0.27, 0.14, 0.03], [0.28, -0.10, 0.03], [0.23, -0.40, 0.03],
      [0.13, -0.32, 0.04], [0.10, -0.06, 0.04], [0.02, 0.22, 0.03], [-0.07, 0.62, 0.02], [-0.06, 0.95, -0.02], [0.12, 1.10, -0.12], [0.34, 1.05, -0.22], [0.45, 0.62, -0.33]]
      .map(function (p) { return new V3(p[0], p[1], p[2]); }), false, "centripetal");
    var rbcG = rbcGeo(0.17);
    var cellMatR = std(0x6f8dff, 0.35, { emissive: new THREE.Color(0x2440b8), emissiveIntensity: 0.45 });
    var cellMatL = std(0xff6b76, 0.35, { emissive: new THREE.Color(0xb3101f), emissiveIntensity: 0.45 });
    var cells = [];
    for (var k = 0; k < 30; k++) {
      var right = k < 15;
      var cm = new THREE.Mesh(rbcG, right ? cellMatR : cellMatL);
      cm.userData = { path: right ? rightPath : leftPath, u: (k % 15) / 15, spin: k * 0.7 };
      cm.rotation.x = Math.PI / 2;
      flowGroup.add(cm);
      cells.push(cm);
    }
    parts.flow = flowGroup;

    /* --- wall-thickness callouts --- */
    var wallGroup = new THREE.Group();
    overlay.add(wallGroup);
    function bracket(x1, x2, y, color) {
      var m = basic(color);
      var bar = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x2 - x1), 0.012, 0.01), m);
      bar.position.set((x1 + x2) / 2, y, 0.03);
      var t1 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.07, 0.01), m); t1.position.set(x1, y, 0.03);
      var t2 = t1.clone(); t2.position.x = x2;
      wallGroup.add(bar, t1, t2);
    }
    bracket(-0.59, -0.535, -0.12, 0xffd166);
    bracket(0.385, 0.6, -0.12, 0xffd166);
    var wl1 = label("RV wall ≈ 5 mm", { bg: "rgba(37,99,235,0.95)", h: 0.085 }); wl1.position.set(-0.62, -0.25, 0.1);
    var wl2 = label("LV wall ≈ 15 mm", { bg: "rgba(200,30,50,0.95)", h: 0.085 }); wl2.position.set(0.6, -0.25, 0.1);
    wallGroup.add(wl1, wl2);
    wallGroup.visible = false;

    /* --- labels --- */
    var secLabels = new THREE.Group(), extLabels = new THREE.Group();
    overlay.add(secLabels, extLabels);
    var LH = 0.075;
    function L(grp, text, x, y, z, bg) { var s = label(text, { h: LH, bg: bg }); s.position.set(x, y, z); grp.add(s); return s; }
    var cBlue = "rgba(37,72,190,0.92)", cRed = "rgba(190,24,45,0.92)", cDark = "rgba(10,15,29,0.85)";
    L(secLabels, "RA", -0.32, 0.30, 0.08, cBlue);
    L(secLabels, "RV", -0.30, -0.16, 0.08, cBlue);
    L(secLabels, "LA", 0.30, 0.32, 0.08, cRed);
    L(secLabels, "LV", 0.24, -0.18, 0.08, cRed);
    L(secLabels, "Septum", 0.0, -0.3, 0.1, cDark);
    L(secLabels, "Aorta", 0.58, 1.2, 0.05, cRed);
    L(secLabels, "Pulmonary artery", 0.86, 0.72, 0.05, cBlue);
    L(secLabels, "Vena cava", -0.62, 0.96, 0.05, cBlue);
    L(secLabels, "Pulmonary vein", 0.86, 0.28, 0.05, cRed);
    L(extLabels, "Aorta", 0.58, 1.2, 0.05, cRed);
    L(extLabels, "Pulmonary artery", 0.86, 0.72, 0.05, cBlue);
    L(extLabels, "Vena cava", -0.62, 0.96, 0.05, cBlue);
    L(extLabels, "Right atrium", -0.66, 0.42, 0.3, cDark);
    L(extLabels, "Right ventricle", -0.42, -0.30, 0.42, cDark);
    L(extLabels, "Left ventricle", 0.55, -0.42, 0.3, cDark);
    L(extLabels, "Coronary artery", 0.25, 0.08, 0.5, "rgba(200,40,60,0.9)");
    var showLabels = o.labels != null ? !!o.labels : (o.scale == null || o.scale >= 0.6);

    /* --- state --- */
    var state = { bpm: o.bpm || 72, mode: "both", view: "section", live: true, flow: true, pace: false, walls: false, specimen: false, hold: null, phase: 0, hi: -1 };
    g.userData.parts = parts;
    g.userData.beat = { aSys: 0, vSys: 0, avOpen: 1, slOpen: 0 };

    function setSpecimen(on) {
      var map = { shell: SPEC.shell, slab: SPEC.slab, fat: SPEC.fat, aorta: SPEC.artery, pa: SPEC.artery, vc: SPEC.vein, pv: SPEC.vein, auricle: 0x5a1a22, papillary: 0x8a3e3e, coronaryA: 0x9b5050, coronaryV: 0x5a4060 };
      Object.keys(M).forEach(function (k) {
        if (on && map[k] != null) M[k].color.setHex(map[k]);
        else if (!on) M[k].color.setHex(origColors[k]);
      });
      [ra, rv, la, lv].forEach(function (p, i) {
        var right = i < 2;
        p.material.color.setHex(on ? SPEC.cavity : right ? BLUE : RED);
        p.material.emissiveIntensity = on ? 0 : 0.28;
      });
    }
    function applyMode() {
      var m = state.mode;
      state.specimen = m === "dissect" || m === "specimen";
      state.live = !state.specimen;
      state.view = m === "exterior" || m === "specimen" || state.forceExterior ? "exterior" : "section";
      state.pace = m === "pace";
      state.walls = m === "sys" || m === "wall";
      state.flow = state.live && state.view === "section";
      shellFull.visible = state.view === "exterior";
      exteriorOnly.visible = state.view === "exterior";
      shellBack.visible = shellBackInner.visible = section.visible = state.view === "section";
      raAur.visible = laAur.visible = state.view === "exterior";
      flowGroup.visible = state.flow;
      avValves.forEach(function (v) { v.grp.visible = state.view === "section"; });
      condGroup.visible = state.view === "section" && (state.pace || state.mode === "heart");
      sparkA.visible = sparkR.visible = sparkL.visible = waveRing.visible = condGroup.visible && state.live;
      wallGroup.visible = state.walls && state.view === "section";
      secLabels.visible = showLabels && state.view === "section" && !state.walls;
      extLabels.visible = showLabels && state.view === "exterior";
      // vessels in front of the cut face would hide the chambers: the PA trunk sits anterior
      ptTrunk.visible = pulmValve.visible = true;
      setSpecimen(state.specimen);
    }

    g.setBpm = function (b) { state.bpm = Math.max(30, Math.min(220, +b || 72)); };
    g.setMode = function (m) { state.mode = m || "both"; applyMode(); };
    g.setLabels = function (on) { showLabels = !!on; applyMode(); };
    g.highlightChamber = function (idx) { state.hi = idx; };
    g.userData.setState = function (st) {
      if (st == null) return;
      if (typeof st === "string") { g.setMode(st); return; }
      if (st.bpm != null) g.setBpm(st.bpm);
      if (st.labels != null) showLabels = !!st.labels;
      if (st.cutaway != null) state.forceExterior = st.cutaway === false;
      if ("hold" in st) state.hold = st.hold == null ? null : +st.hold;
      if (st.mode != null) state.mode = st.mode;
      applyMode();
    };
    if (o.cutaway === false) state.forceExterior = true;
    state.mode = o.mode || "both";
    applyMode();

    var tmp = new V3(), tmp2 = new V3(), tmp3 = new V3();
    var down = new V3(0, -1, 0);
    function placeLeaflet(mesh, hinge, angle, uV, uA) {
      squeezeJS(hinge, uV, uA, mesh.position);
      mesh.rotation.z = angle;
    }
    function leafTip(hinge, angle, len, out) {
      return out.set(hinge.x + Math.sin(angle) * len, hinge.y - Math.cos(angle) * len, hinge.z);
    }

    g.userData.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.05);
      var freq = state.bpm / 60;
      if (state.hold != null) state.phase = state.hold;
      else if (state.live) state.phase = (state.phase + dt * freq) % 1;
      var ph = state.phase;
      var aSys = state.live || state.hold != null ? (ph >= 0.02 && ph < 0.17 ? Math.sin(((ph - 0.02) / 0.15) * Math.PI) : 0) : 0;
      var vSys = state.live || state.hold != null ? (ph >= 0.2 && ph < 0.56 ? Math.sin(((ph - 0.2) / 0.36) * Math.PI) : 0) : 0;
      if (state.specimen) { aSys = 0; vSys = 0; }
      U.uHkV.value = vSys; U.uHkA.value = aSys;
      var avOpen = state.specimen ? 0.6 : (ph >= 0.2 && ph < 0.58 ? 0 : 1);
      var slOpen = state.specimen ? 0 : (ph >= 0.24 && ph < 0.54 ? 1 : 0);
      var b = g.userData.beat; b.aSys = aSys; b.vSys = vSys;
      b.avOpen += (avOpen - b.avOpen) * Math.min(1, dt * 18);
      b.slOpen += (slOpen - b.slOpen) * Math.min(1, dt * 18);
      g.userData.phase = ph;

      // AV valves: open = hanging into ventricle, closed = horizontal, edges meeting
      avValves.forEach(function (v) {
        if (!v.grp.visible) return;
        var open = b.avOpen;
        var a1 = (1 - open) * (Math.PI / 2 - 0.06) + open * (-0.12);
        var a2 = -((1 - open) * (Math.PI / 2 - 0.06) + open * (-0.12));
        placeLeaflet(v.l1, v.h1, a1, vSys, aSys);
        placeLeaflet(v.l2, v.h2, a2, vSys, aSys);
        var tip1 = leafTip(v.l1.position, a1, v.len, tmp), tip2 = leafTip(v.l2.position, a2, v.len, tmp2);
        var pA = squeezeJS(v.pa, vSys, aSys, tmp3);
        between(v.chords[0], tip1, pA);
        var mid1 = leafTip(v.l1.position, a1, v.len * 0.6, new V3());
        between(v.chords[1], mid1, pA);
        var pB = squeezeJS(v.pb, vSys, aSys, new V3());
        between(v.chords[2], tip2, pB);
        var mid2 = leafTip(v.l2.position, a2, v.len * 0.6, new V3());
        between(v.chords[3], mid2, pB);
        var taut = 1 - open;
        v.chords.forEach(function (c) { c.material.emissiveIntensity = 0.3 + 0.5 * taut; });
      });

      // semilunar cusps fold open against the vessel wall during ventricular systole
      [aorticValve, pulmValve].forEach(function (sv) {
        sv.userData.cusps.forEach(function (h) { h.rotation.x = -b.slOpen * 1.25; });
      });

      // blood pools glow with contraction
      var hiBoost = function (i) { return state.hi === i || (state.hi === 4 && i === 3) ? 0.45 : 0; };
      if (!state.specimen) {
        ra.material.emissiveIntensity = 0.24 + 0.3 * aSys + hiBoost(0);
        la.material.emissiveIntensity = 0.24 + 0.3 * aSys + hiBoost(1);
        rv.material.emissiveIntensity = 0.24 + 0.35 * vSys + hiBoost(2);
        lv.material.emissiveIntensity = 0.24 + 0.35 * vSys + hiBoost(3);
      }

      // conduction: SAN → atria → AVN (delay) → His → bundle branches → Purkinje
      if (condGroup.visible) {
        var on = state.live || state.hold != null;
        sanMat.emissiveIntensity = on && ph < 0.1 ? 1.6 : 0.35;
        avnMat.emissiveIntensity = on && ph >= 0.08 && ph < 0.2 ? 1.6 : 0.35;
        condMatA.emissiveIntensity = on && ph < 0.12 ? 1.2 : 0.3;
        condMatV.emissiveIntensity = on && ph >= 0.18 && ph < 0.36 ? 1.3 : 0.3;
        var ua = Math.min(1, ph / 0.1);
        sparkA.visible = on && ph < 0.12;
        if (sparkA.visible) squeezeJS(pathAtria.getPointAt(ua), vSys, aSys, sparkA.position);
        var uv = (ph - 0.18) / 0.18;
        sparkR.visible = sparkL.visible = on && uv >= 0 && uv <= 1;
        if (sparkR.visible) {
          squeezeJS(pathR.getPointAt(uv), vSys, aSys, sparkR.position);
          squeezeJS(pathL.getPointAt(uv), vSys, aSys, sparkL.position);
        }
        var wr = ph / 0.12;
        waveRing.visible = on && wr < 1;
        if (waveRing.visible) { waveRing.scale.setScalar(0.03 + wr * 0.42); waveRing.material.opacity = 0.65 * (1 - wr); }
      }

      // pulsatile flow: blood surges out of the ventricles during systole
      if (state.flow) {
        var push = 0.16 + 0.55 * vSys + 0.2 * aSys;
        for (var i = 0; i < cells.length; i++) {
          var c = cells[i];
          c.userData.u = (c.userData.u + dt * freq * push * 0.42) % 1;
          squeezeJS(c.userData.path.getPointAt(c.userData.u), vSys, aSys, c.position);
          c.rotation.y = t * 1.5 + c.userData.spin;
        }
      }
    };

    return attachCompat(g, o);
  }

  /* =====================================================================
     2. CIRCULATION MAPS: single (fish), incomplete double (amphibian),
        complete double (mammal), open (insect), or single + double side by side
     ===================================================================== */
  var DEOXY = new THREE.Color(0x3b6ee8), OXY = new THREE.Color(0xe8323f), MIXED = new THREE.Color(0x9b4fd6), HAEMO = new THREE.Color(0xc9e27a);
  function oxyColor(v, out) {
    out = out || new THREE.Color();
    if (v === "mix") return out.copy(MIXED);
    if (v < 0.5) return out.copy(DEOXY).lerp(MIXED, v * 2);
    return out.copy(MIXED).lerp(OXY, (v - 0.5) * 2);
  }
  // pts: [x, y, z, oxy(0..1), speed]
  function circuit(pts, closed, nCells) {
    var grp = new THREE.Group();
    var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3(p[0], p[1], p[2] || 0); }), closed, "centripetal");
    var n = pts.length, segs = closed ? n : n - 1;
    function attr(u, idx) {
      var tt = curve.getUtoTmapping(u) * segs, i0 = Math.floor(tt) % n, i1 = (i0 + 1) % n, f = tt - Math.floor(tt);
      if (!closed && i0 >= n - 1) return pts[n - 1][idx];
      return pts[i0][idx] + (pts[i1][idx] - pts[i0][idx]) * f;
    }
    var tubeSegs = 160, radial = 10;
    var geo = new THREE.TubeGeometry(curve, tubeSegs, 0.034, radial, closed);
    var cols = new Float32Array(geo.attributes.position.count * 3), col = new THREE.Color();
    for (var s = 0; s <= tubeSegs; s++) {
      oxyColor(attr(s / tubeSegs, 3), col);
      for (var r = 0; r <= radial; r++) { var vi = (s * (radial + 1) + r) * 3; cols[vi] = col.r; cols[vi + 1] = col.g; cols[vi + 2] = col.b; }
    }
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    var vesselMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, transparent: true, opacity: 0.55, depthWrite: false });
    grp.add(new THREE.Mesh(geo, vesselMat));
    var cellGeo = rbcGeo(0.2);
    var cells = [];
    for (var k = 0; k < (nCells || 22); k++) {
      var m = new THREE.Mesh(cellGeo, new THREE.MeshStandardMaterial({ roughness: 0.35, emissiveIntensity: 0.45 }));
      m.userData.u = k / (nCells || 22);
      m.rotation.x = Math.PI / 2;
      grp.add(m);
      cells.push(m);
    }
    grp.userData.update = function (dt, t, rate) {
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i], u = c.userData.u;
        var spd = attr(u, 4);
        c.userData.u = (u + dt * 0.075 * spd * rate) % 1;
        c.position.copy(curve.getPointAt(c.userData.u));
        var v = attr(c.userData.u, 3);
        oxyColor(v, c.material.color);
        c.material.emissive.copy(c.material.color);
        c.rotation.y = t * 1.3 + i;
      }
    };
    return grp;
  }
  function chamberBlob(x, y, sx, sy, color, txt) {
    var grp = new THREE.Group();
    var m = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 16), std(color, 0.4, { emissive: new THREE.Color(color), emissiveIntensity: 0.3 }));
    m.scale.set(sx, sy, 0.1);
    grp.add(m);
    grp.position.set(x, y, 0);
    if (txt) { var l = label(txt, { h: 0.075, bg: "rgba(10,15,29,0.75)" }); l.position.set(0, 0, 0.14); grp.add(l); }
    grp.userData.blob = m;
    return grp;
  }
  function lungs() {
    var grp = new THREE.Group();
    [-1, 1].forEach(function (sgn, i) {
      var geo = new THREE.SphereGeometry(1, 26, 18), p = geo.attributes.position, r = rng(11 + i);
      for (var k = 0; k < p.count; k++) {
        var n = 1 + 0.06 * Math.sin(p.getX(k) * 13 + p.getY(k) * 9) + (r() - 0.5) * 0.03;
        p.setXYZ(k, p.getX(k) * n, p.getY(k) * n, p.getZ(k) * n);
      }
      geo.computeVertexNormals();
      var lobe = new THREE.Mesh(geo, std(0xf5a3b5, 0.75));
      lobe.scale.set(0.25, 0.2, 0.1);
      lobe.position.set(sgn * 0.27, 0, -0.12);
      grp.add(lobe);
    });
    return grp;
  }
  function gills() {
    var grp = new THREE.Group();
    var mat = std(0xf0607a, 0.55);
    for (var i = 0; i < 4; i++) {
      var arch = new THREE.Mesh(new THREE.TorusGeometry(0.34 - i * 0.05, 0.012, 6, 30, Math.PI), std(0xc9a27e, 0.6));
      arch.position.set(0, -0.12, -0.1 - i * 0.03);
      grp.add(arch);
      for (var f = 0; f <= 14; f++) {
        var a = (f / 14) * Math.PI, rad = 0.34 - i * 0.05;
        var fil = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.004, 0.12, 4), mat);
        fil.position.set(Math.cos(a) * (rad + 0.06), -0.12 + Math.sin(a) * (rad + 0.06), -0.1 - i * 0.03);
        fil.rotation.z = a - Math.PI / 2;
        grp.add(fil);
      }
    }
    return grp;
  }
  function bodyTissue() {
    var grp = new THREE.Group(), r = rng(21);
    for (var i = 0; i < 7; i++) {
      var c = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), std(0xf2b46a, 0.6));
      c.scale.set(0.09 + r() * 0.04, 0.07 + r() * 0.03, 0.06);
      c.position.set(-0.36 + i * 0.12, (r() - 0.5) * 0.1, -0.12);
      grp.add(c);
      var nuc = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), std(0x7c4a1a, 0.5));
      nuc.position.copy(c.position).add(new V3(0, 0, 0.06));
      grp.add(nuc);
    }
    return grp;
  }
  function tag(grp, text, x, y, bg) { var l = label(text, { h: 0.09, bg: bg || "rgba(10,15,29,0.85)" }); l.position.set(x, y, 0.2); grp.add(l); return l; }

  function circuitCompare(o) {
    o = o || {};
    var g = new THREE.Group();
    var parts = {};
    var views = {};

    // --- complete double (mammal / bird / crocodile) — figure of eight, heart passed twice ---
    function buildDouble(incomplete) {
      var v = new THREE.Group();
      var lu = lungs(); lu.position.set(0, 0.98, 0); v.add(lu);
      var bt = bodyTissue(); bt.position.set(0, -1.02, 0); v.add(bt);
      var mixV = incomplete ? 0.5 : null;
      var c = circuit([
        [-0.13, 0.12, 0.02, 0.0, 0.6],               // RA
        [-0.13, -0.12, 0.02, incomplete ? 0.5 : 0.0, 0.7], // RV / shared V
        [-0.36, -0.06, 0.1, incomplete ? 0.5 : 0.0, 1.1],
        [-0.62, 0.36, 0.08, incomplete ? 0.5 : 0.0, 1.0],
        [-0.42, 0.92, 0.03, incomplete ? 0.5 : 0.05, 0.8],
        [0.0, 1.02, 0.0, 0.6, 0.5],                    // lung capillaries
        [0.42, 0.92, 0.03, 1.0, 0.8],
        [0.62, 0.36, 0.05, 1.0, 0.9],
        [0.34, 0.14, 0.03, 1.0, 0.8],
        [0.13, 0.12, 0.02, 1.0, 0.6],                  // LA
        [0.13, -0.12, 0.02, incomplete ? 0.5 : 1.0, 0.7], // LV / shared V
        [0.38, -0.26, 0.03, incomplete ? 0.5 : 1.0, 1.6],
        [0.70, -0.48, 0.03, incomplete ? 0.5 : 1.0, 1.6],
        [0.42, -0.96, 0.02, incomplete ? 0.5 : 0.95, 1.2],
        [0.0, -1.04, 0.0, 0.35, 0.6],                  // body capillaries
        [-0.42, -0.96, -0.04, 0.0, 0.8],
        [-0.76, -0.40, -0.1, 0.0, 0.8],
        [-0.70, 0.22, -0.12, 0.0, 0.8],
        [-0.34, 0.30, -0.06, 0.0, 0.7]
      ], true, 34);
      v.add(c);
      var shellMat = glass(0xf0a0aa, 0.18);
      var sh = new THREE.Mesh(shellGeo(0, TAU), shellMat); sh.scale.setScalar(0.42); sh.position.set(0.0, 0.03, -0.02); v.add(sh);
      var ch = new THREE.Group();
      ch.add(chamberBlob(-0.13, 0.12, 0.11, 0.09, BLUE, "RA"));
      ch.add(chamberBlob(0.13, 0.12, 0.11, 0.09, RED, "LA"));
      if (incomplete) {
        ch.add(chamberBlob(0.0, -0.13, 0.25, 0.12, 0x8c3fc9, "V (mixed)"));
      } else {
        ch.add(chamberBlob(-0.13, -0.13, 0.11, 0.12, BLUE, "RV"));
        ch.add(chamberBlob(0.13, -0.13, 0.12, 0.13, RED, "LV"));
        var sep = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.46, 0.14), std(0xfff3c4, 0.4)); sep.position.set(0, -0.02, 0.0); ch.add(sep);
      }
      v.add(ch);
      tag(v, incomplete ? "Lungs + skin" : "Lungs", 0, 1.26, "rgba(190,60,90,0.9)");
      tag(v, "Body tissues", 0, -1.26, "rgba(160,95,20,0.92)");
      tag(v, "Pulmonary circuit", -0.95, 0.72, "rgba(37,72,190,0.9)");
      tag(v, "Systemic circuit", 0.95, -0.72, "rgba(190,24,45,0.9)");
      v.userData.circ = c; v.userData.pump = ch;
      return v;
    }
    // --- single (fish): heart → gills → body → heart, heart passed once ---
    function buildSingle() {
      var v = new THREE.Group();
      var gi = gills(); gi.position.set(0, 1.0, 0); v.add(gi);
      var bt = bodyTissue(); bt.position.set(0, -1.02, 0); v.add(bt);
      var c = circuit([
        [-0.70, -0.16, 0.02, 0.0, 0.6],  // atrium
        [-0.70, 0.12, 0.02, 0.0, 1.4],   // ventricle
        [-0.62, 0.55, 0.02, 0.0, 1.4],
        [-0.32, 0.92, 0.02, 0.1, 1.0],
        [0.0, 1.02, 0.0, 0.7, 0.6],      // gill capillaries
        [0.32, 0.92, 0.02, 1.0, 0.45],   // pressure lost → slow
        [0.66, 0.42, 0.02, 1.0, 0.4],
        [0.70, -0.30, 0.02, 1.0, 0.4],
        [0.38, -0.92, 0.02, 0.95, 0.35],
        [0.0, -1.04, 0.0, 0.35, 0.3],    // body capillaries
        [-0.40, -0.92, 0.02, 0.0, 0.35],
        [-0.66, -0.56, 0.02, 0.0, 0.45]
      ], true, 26);
      v.add(c);
      var ch = new THREE.Group();
      ch.add(chamberBlob(-0.70, -0.16, 0.12, 0.09, BLUE, "A"));
      ch.add(chamberBlob(-0.70, 0.12, 0.14, 0.12, 0x3352c4, "V"));
      v.add(ch);
      tag(v, "Gills", 0, 1.28, "rgba(190,60,90,0.9)");
      tag(v, "Body tissues", 0, -1.26, "rgba(160,95,20,0.92)");
      tag(v, "2-chamber heart", -0.70, -0.42, "rgba(37,72,190,0.9)");
      tag(v, "Slow, low pressure", 0.8, -0.62, "rgba(10,15,29,0.85)");
      v.userData.circ = c; v.userData.pump = ch;
      return v;
    }
    // --- open (insect): dorsal tube heart pumps haemolymph into the haemocoel ---
    function buildOpen() {
      var v = new THREE.Group();
      var cav = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 20), glass(0xd9f99d, 0.16));
      cav.scale.set(1.0, 0.62, 0.3); cav.position.set(0, 0.05, -0.05); v.add(cav);
      var heartTube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 16), std(0x9ccc65, 0.4, { emissive: new THREE.Color(0x4d7c0f), emissiveIntensity: 0.25 }));
      heartTube.rotation.z = Math.PI / 2; heartTube.position.set(0.1, 0.45, 0.05); v.add(heartTube);
      for (var i = 0; i < 5; i++) {
        var ost = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 6, 16), std(0x3f6212, 0.4));
        ost.position.set(-0.4 + i * 0.25, 0.45, 0.11); v.add(ost);
      }
      [[-0.3, -0.05], [0.25, -0.12], [0.6, 0.08]].forEach(function (p, i) {
        var org = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), std(i === 1 ? 0xf2b46a : 0xe9a3c9, 0.6));
        org.scale.set(0.2, 0.13, 0.08); org.position.set(p[0], p[1], -0.04); v.add(org);
      });
      var drops = [], dg = new THREE.SphereGeometry(0.028, 10, 8), dm = std(0xd4ea8a, 0.4, { emissive: HAEMO, emissiveIntensity: 0.45 });
      var path = new THREE.CatmullRomCurve3([[0.75, 0.45, 0.05], [0.1, 0.45, 0.05], [-0.55, 0.45, 0.05], [-0.85, 0.2, 0.06], [-0.7, -0.25, 0.08], [-0.2, -0.38, 0.08],
        [0.3, -0.36, 0.08], [0.75, -0.2, 0.08], [0.9, 0.15, 0.08]].map(function (p) { return new V3(p[0], p[1], p[2]); }), true, "centripetal");
      for (var d = 0; d < 26; d++) { var m = new THREE.Mesh(dg, dm); m.userData.u = d / 26; m.userData.j = new V3((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12, 0); v.add(m); drops.push(m); }
      tag(v, "Dorsal tube heart (ostia)", 0.1, 0.72, "rgba(77,124,15,0.95)");
      tag(v, "Haemocoel: blood bathes organs", 0, -0.75, "rgba(10,15,29,0.85)");
      v.userData.update = function (dt, t) {
        drops.forEach(function (m) {
          var u = m.userData.u, inTube = u < 0.3;
          m.userData.u = (u + dt * (inTube ? 0.16 : 0.035)) % 1;
          m.position.copy(path.getPointAt(m.userData.u));
          if (!inTube) m.position.add(m.userData.j);
        });
        heartTube.scale.x = 1 + 0.12 * Math.max(0, Math.sin(t * 4));
        heartTube.scale.z = heartTube.scale.x;
      };
      return v;
    }

    views.double = buildDouble(false);
    views.incomplete = buildDouble(true);
    views.single = buildSingle();
    views.open = buildOpen();
    var both = new THREE.Group();
    var bS = buildSingle(), bD = buildDouble(false);
    bS.scale.setScalar(0.8); bS.position.x = -1.0;
    bD.scale.setScalar(0.8); bD.position.x = 1.0;
    tag(bS, "FISH · single", 0, 1.55, "rgba(37,72,190,0.95)");
    tag(bD, "MAMMAL · double", 0, 1.55, "rgba(190,24,45,0.95)");
    both.add(bS, bD);
    views.both = both;
    Object.keys(views).forEach(function (k) { g.add(views[k]); });

    var state = { mode: o.mode || "double" };
    parts.pump = views.double.userData.pump; parts.lungs = views.double; parts.systemic = views.double;
    g.userData.parts = parts;
    g.setMode = function (m) {
      if (m === "mix" || m === "side") m = "both";
      state.mode = views[m] ? m : "double";
      Object.keys(views).forEach(function (k) { views[k].visible = k === state.mode; });
      var cur = views[state.mode];
      parts.pump = cur.userData.pump || cur;
    };
    g.userData.setState = function (st) { if (st == null) return; g.setMode(typeof st === "string" ? st : st.mode); };
    g.setMode(state.mode);

    g.userData.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.05);
      var beat = Math.max(0, Math.sin(t * 6));
      function run(v, rate) {
        if (v.userData.circ) v.userData.circ.userData.update(dt, t, rate);
        if (v.userData.pump) v.userData.pump.scale.setScalar(1 + 0.07 * beat);
        if (v.userData.update) v.userData.update(dt, t);
      }
      var cur = views[state.mode];
      if (state.mode === "both") { run(bS, 1); run(bD, 1); }
      else run(cur, 1);
    };
    return attachCompat(g, o);
  }

  /* =====================================================================
     3. SA/V TISSUE CUBE — oxygen diffuses a fixed depth; the core starves as L grows
     ===================================================================== */
  function cube(L, o) {
    if (typeof L === "object" && L !== null) { o = L; L = null; }
    o = o || {};
    var g = new THREE.Group();
    var inner = new THREE.Group();
    g.add(inner);
    var S = o.size || 0.68;
    var shell = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x38d6c4, roughness: 0.3, transparent: true, opacity: 0.32, depthWrite: false }));
    var edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), new THREE.LineBasicMaterial({ color: 0x9ff5ea }));
    var core = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), std(0x4c1d95, 0.55, { emissive: new THREE.Color(0x2e1065), emissiveIntensity: 0.4 }));
    inner.add(core, shell, edges);
    var o2 = [], og = new THREE.SphereGeometry(0.018, 8, 6), om = glowMat(0x7dd3fc, 0.9), r = rng(5);
    for (var i = 0; i < 36; i++) {
      var m = new THREE.Mesh(og, om);
      m.userData = { face: Math.floor(r() * 6), a: r() - 0.5, b: r() - 0.5, ph: r() };
      inner.add(m); o2.push(m);
    }
    var state = { L: L || 1, spread: o.spread || 0, size: S };
    function visSize() { return S * Math.max(0.45, Math.min(1.9, 0.55 + Math.log(1 + state.L) * 0.55)); }
    function apply() {
      var s = visSize();
      inner.scale.setScalar(s);
      // diffusion reaches ≈0.5 mm into the tissue whatever the size → core fraction grows with L
      var frac = Math.max(0, 1 - (2 * 0.5) / Math.max(state.L, 0.01));
      core.visible = frac > 0.02;
      core.scale.setScalar(Math.max(0.02, frac * 0.97));
      core.material.emissiveIntensity = 0.2 + 0.6 * frac;
    }
    g.userData.parts = { cube: shell, core: core };
    g.setL = function (newL) { state.L = +newL || 1; apply(); };
    g.userData.setState = function (st) {
      if (!st) return;
      if (st.L != null) state.L = +st.L;
      if (st.spread != null) state.spread = +st.spread;
      apply();
    };
    g.userData.update = function (dt, t) {
      var depth = Math.min(0.5, 0.5 / Math.max(state.L, 0.5)) * 0.5; // in unit-cube space
      o2.forEach(function (m) {
        var d = m.userData;
        d.ph = (d.ph + (dt || 0.016) * 0.35) % 1;
        var inward = 0.5 - d.ph * (depth + 0.02) * 1.0 - 0.01;
        var a = d.a * 0.9, b = d.b * 0.9;
        var p = [[inward, a, b], [-inward, a, b], [a, inward, b], [a, -inward, b], [a, b, inward], [a, b, -inward]][d.face];
        m.position.set(p[0] + (d.face === 0 ? 0.06 : d.face === 1 ? -0.06 : 0) * (1 - d.ph), p[1], p[2]);
        m.scale.setScalar(1 - d.ph * 0.6);
      });
    };
    apply();
    return attachCompat(g, o);
  }

  /* =====================================================================
     4. AV VALVE CLOSE-UP — curved cusps, chordae tendineae, papillary muscles
     ===================================================================== */
  function valve(o) {
    o = o || {};
    var g = new THREE.Group();
    var parts = {};
    var R = 0.5, RY = 0.32;

    // ventricle wall (front cut away so the inside is visible)
    var wallMat = muscleMat(0xb1263a, 0.6); wallMat.side = THREE.DoubleSide;
    var cutA = 0.75;
    var wallIn = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.48, 1.0, 40, 1, true, cutA, TAU - 2 * cutA), wallMat);
    wallIn.position.y = RY - 0.5;
    var wallOut = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.6, 1.0, 40, 1, true, cutA, TAU - 2 * cutA), muscleMat(0x9c1b30, 0.6));
    wallOut.position.y = RY - 0.5;
    var rim = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.74, 40, 1, cutA, TAU - 2 * cutA), muscleMat(0xd0606a, 0.6));
    rim.material.side = THREE.DoubleSide;
    rim.geometry.dispose();
    rim.geometry = new THREE.RingGeometry(0.6, 0.74, 40, 1, 1.5 * Math.PI + cutA, TAU - 2 * cutA);
    rim.rotation.x = -Math.PI / 2; rim.position.y = RY;
    // the two cut faces of the wall, so it reads as solid muscle
    [cutA, TAU - cutA].forEach(function (th) {
      var sx = Math.sin(th), cz = Math.cos(th);
      var verts = new Float32Array([0.6 * sx, RY, 0.6 * cz, 0.74 * sx, RY, 0.74 * cz, 0.6 * sx, RY - 1.0, 0.6 * cz, 0.48 * sx, RY - 1.0, 0.48 * cz]);
      var fg = new THREE.BufferGeometry();
      fg.setAttribute("position", new THREE.BufferAttribute(verts, 3));
      fg.setIndex([0, 1, 2, 0, 2, 3]);
      fg.computeVertexNormals();
      g.add(new THREE.Mesh(fg, rim.material));
    });
    var floor = new THREE.Mesh(new THREE.CircleGeometry(0.54, 30), muscleMat(0x8f1c2e, 0.7));
    floor.rotation.x = -Math.PI / 2; floor.position.y = RY - 1.0;
    g.add(wallIn, wallOut, rim, floor);
    parts.wall = wallIn;

    // annulus ring + translucent atrium dome above
    var ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.04, 12, 48), std(0xf2e0c0, 0.5));
    ring.rotation.x = Math.PI / 2; ring.position.y = RY;
    g.add(ring);
    parts.ring = ring;
    var atrium = new THREE.Mesh(new THREE.SphereGeometry(0.58, 30, 14, 0, TAU, 0, Math.PI / 2), glass(0xf9a8b8, 0.16));
    atrium.position.y = RY; atrium.scale.y = 0.75;
    g.add(atrium);

    var leafMat = std(0xfff0cf, 0.5, { side: THREE.DoubleSide, emissive: new THREE.Color(0x7a6332), emissiveIntensity: 0.3, transparent: true, opacity: 0.94 });
    var chordMat = std(0xffffff, 0.35, { emissive: new THREE.Color(0x888888), emissiveIntensity: 0.4 });
    var papMat = muscleMat(0xc23a4a, 0.6);
    var NS = 14, NT = 7;
    var leafGroup = new THREE.Group(), chordGroup = new THREE.Group(), papGroup = new THREE.Group();
    g.add(leafGroup, chordGroup, papGroup);
    parts.flaps = leafGroup; parts.chordae = chordGroup; parts.papillary = papGroup;
    var cusps = [], chords = [], paps = [];

    function build(n) {
      [leafGroup, chordGroup, papGroup].forEach(function (grp) { while (grp.children.length) grp.remove(grp.children[0]); });
      cusps = []; chords = []; paps = [];
      var hw = Math.PI / n;
      for (var c = 0; c < n; c++) {
        var m = (n === 2 ? 0 : Math.PI / 2) + c * TAU / n;
        var geo = new THREE.BufferGeometry();
        var pos = new Float32Array((NS + 1) * (NT + 1) * 3), idx = [];
        for (var i = 0; i < NS; i++) for (var j = 0; j < NT; j++) {
          var a = i * (NT + 1) + j, b = a + 1, cc = a + NT + 1, d = cc + 1;
          idx.push(a, cc, b, b, cc, d);
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setIndex(idx);
        var mesh = new THREE.Mesh(geo, leafMat);
        leafGroup.add(mesh);
        cusps.push({ mesh: mesh, m: m, hw: hw });
      }
      // papillary muscles below each commissure
      for (var p = 0; p < n; p++) {
        var ang = (n === 2 ? 0 : Math.PI / 2) + p * TAU / n - hw;
        var base = new V3(Math.cos(ang) * 0.42, RY - 0.98, Math.sin(ang) * 0.42);
        var tip = new V3(Math.cos(ang) * 0.34, RY - 0.62, Math.sin(ang) * 0.34);
        var cone = new THREE.Mesh(new THREE.ConeGeometry(0.075, 1, 14), papMat);
        between(cone, base, tip);
        papGroup.add(cone);
        paps.push({ tip: tip, ang: ang });
      }
      // chordae: free edge of every cusp → the papillary muscle at each of its commissures
      cusps.forEach(function (cu, ci) {
        [0.12, 0.32, 0.68, 0.88].forEach(function (s) {
          var pi = s < 0.5 ? ci : (ci + 1) % n;
          var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 1, 5), chordMat);
          chordGroup.add(cyl);
          chords.push({ mesh: cyl, cusp: cu, s: s, pap: paps[pi] });
        });
      });
      bloodMat.color.setHex(n === 3 ? 0x5b7cff : 0xff5a66);
      bloodMat.emissive.setHex(n === 3 ? 0x1d3bb3 : 0xa30d1d);
    }
    function cuspPoint(cu, s, tt, open, out) {
      var th = cu.m + (s * 2 - 1) * cu.hw * (1 - 0.32 * open * tt);
      var rx = Math.cos(th) * R, rz = Math.sin(th) * R;
      // closed: free edges meet along the commissure lines (Y shape for 3 cusps)
      var lineAng = th < cu.m ? cu.m - cu.hw : cu.m + cu.hw;
      var dist = R * Math.abs(th - cu.m) / cu.hw;
      var cx = Math.cos(lineAng) * dist, cz = Math.sin(lineAng) * dist;
      var px = rx + (cx - rx) * tt, pz = rz + (cz - rz) * tt;
      var py = RY + 0.07 * Math.sin(Math.PI * tt);
      // open: hanging down along the ventricle wall
      var orad = R * (1 - 0.12 * tt) * (1 - 0.1 * Math.cos((s * 2 - 1) * Math.PI / 2));
      var ox = Math.cos(th) * orad, oz = Math.sin(th) * orad, oy = RY - 0.52 * tt * (0.75 + 0.25 * Math.sin(s * Math.PI));
      return out.set(px + (ox - px) * open, py + (oy - py) * open, pz + (oz - pz) * open);
    }

    // blood cells passing through when open
    var bloodMat = new THREE.MeshStandardMaterial({ color: 0xff5a66, roughness: 0.35, emissive: 0xa30d1d, emissiveIntensity: 0.4 });
    var blood = [], bg = rbcGeo(0.32), br = rng(9);
    for (var k = 0; k < 18; k++) {
      var bm = new THREE.Mesh(bg, bloodMat);
      var a = br() * TAU, rr = Math.sqrt(br()) * 0.28;
      bm.userData = { x: Math.cos(a) * rr, z: Math.sin(a) * rr, y: RY + 0.5 - br() * 1.2, spin: br() * 6 };
      g.add(bm); blood.push(bm);
    }
    var state = { cusps: o.cusps || 2, mode: "auto", open: o.open != null ? +o.open : 0.5 };
    build(state.cusps);

    g.userData.parts = parts;
    g.setCusps = function (n) { state.cusps = n === 3 ? 3 : 2; build(state.cusps); };
    g.userData.setState = function (st) {
      if (st == null) return;
      if (typeof st === "string") { state.mode = st; return; }
      if (typeof st === "number") { state.mode = "manual"; state.open = st; return; }
      if (st.cusps != null && st.cusps !== state.cusps) g.setCusps(st.cusps);
      if (st.open != null) {
        if (typeof st.open === "number") { state.mode = "manual"; state.open = Math.max(0, Math.min(1, st.open)); }
        else state.mode = st.open ? "open" : "closed";
      }
    };
    var tv = new V3(), tw = new V3(), curOpen = 0.5;
    g.userData.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.05);
      var target = state.mode === "open" ? 1 : state.mode === "closed" ? 0 : state.mode === "manual" ? state.open : (Math.sin(t * 3) > 0 ? 1 : 0);
      curOpen += (target - curOpen) * Math.min(1, dt * 10);
      var op = curOpen;
      cusps.forEach(function (cu) {
        var pos = cu.mesh.geometry.attributes.position;
        for (var i = 0; i <= NS; i++) for (var j = 0; j <= NT; j++) {
          cuspPoint(cu, i / NS, j / NT, op, tv);
          pos.setXYZ(i * (NT + 1) + j, tv.x, tv.y, tv.z);
        }
        pos.needsUpdate = true;
        cu.mesh.geometry.computeVertexNormals();
        cu.mesh.geometry.computeBoundingSphere();
      });
      chords.forEach(function (c) {
        cuspPoint(c.cusp, c.s, 1, op, tv);
        between(c.mesh, tv, c.pap.tip);
      });
      chordMat.emissiveIntensity = 0.3 + 0.6 * (1 - op);
      blood.forEach(function (b) {
        var d = b.userData;
        if (d.y > RY + 0.02 && op < 0.35) d.y = Math.max(RY + 0.1, d.y - dt * 0.05);
        else d.y -= dt * (0.15 + 0.55 * op);
        if (d.y < RY - 0.9) d.y = RY + 0.55;
        b.position.set(d.x * (d.y < RY ? 1.3 : 1), d.y, d.z * (d.y < RY ? 1.3 : 1));
        b.rotation.set(d.spin + t, d.spin, 0);
      });
      g.userData.open = op;
    };
    return attachCompat(g, o);
  }

  /* =====================================================================
     5. BLOOD VESSELS — artery & vein in cross-section, capillary lengthwise
     ===================================================================== */
  function layeredVessel(layers, lumenColor, oval) {
    var grp = new THREE.Group();
    var len = 0.8, front = 0.12;
    layers.forEach(function (Ly, i) {
      var mat = std(Ly[2], 0.55);
      if (i === 1) { mat.map = muscleTex(); }
      var outer = new THREE.Mesh(new THREE.CylinderGeometry(Ly[0], Ly[0], len, 40, 1, true), mat);
      outer.rotation.x = Math.PI / 2; outer.position.z = front - len / 2;
      var cap = new THREE.Mesh(new THREE.RingGeometry(Ly[1], Ly[0], 48), std(Ly[2], 0.6, { side: THREE.DoubleSide }));
      cap.position.z = front + 0.001 * i;
      grp.add(outer, cap);
    });
    var rl = layers[layers.length - 1][1];
    var lumen = new THREE.Mesh(new THREE.CircleGeometry(rl, 40), std(lumenColor, 0.3, { map: poolTex(), emissive: new THREE.Color(lumenColor), emissiveIntensity: 0.25 }));
    lumen.position.z = front - 0.06;
    grp.add(lumen);
    var lumenWall = new THREE.Mesh(new THREE.CylinderGeometry(rl, rl, 0.06, 40, 1, true), std(0xf5d0d6, 0.5, { side: THREE.BackSide }));
    lumenWall.rotation.x = Math.PI / 2; lumenWall.position.z = front - 0.03;
    grp.add(lumenWall);
    if (oval) grp.scale.y = oval;
    grp.userData.lumen = lumen;
    return grp;
  }
  function vessels(o) {
    o = o || {};
    var g = new THREE.Group();
    var parts = {};
    var LBL = o.labels !== false;

    // ARTERY: thick tunica media (smooth muscle + elastic fibres), small round lumen
    var art = layeredVessel([[0.36, 0.325, 0xf1d9bf], [0.325, 0.17, 0xc8384a], [0.17, 0.155, 0xfbe7ea]], 0xd8262f);
    var elastic = std(0xf7d58b, 0.4);
    [0.21, 0.255, 0.3].forEach(function (rr) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.006, 6, 48), elastic);
      ring.position.z = 0.126; art.add(ring);
    });
    art.position.set(-0.95, 0.05, 0);
    g.add(art);
    parts.artery = art;

    // VEIN: thin wall, wide (often oval) lumen, pocket valve
    var vein = layeredVessel([[0.36, 0.335, 0xe9d6c8], [0.335, 0.305, 0x8e6fb8], [0.305, 0.295, 0xf5e9f3]], 0x3a56b8, 0.82);
    var cuspMat = std(0xe9e3ff, 0.45, { side: THREE.DoubleSide, transparent: true, opacity: 0.8, depthWrite: false });
    var vCusps = [], vr = 0.292;
    [-1, 1].forEach(function (sg) {
      var piv = new THREE.Group();
      piv.position.set(sg * vr, 0, 0.09);
      var fgeo = new THREE.CircleGeometry(vr, 28, sg < 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI);
      fgeo.translate(-sg * vr, 0, 0);
      var flap = new THREE.Mesh(fgeo, cuspMat);
      piv.add(flap);
      var edge = new THREE.Mesh(new THREE.TorusGeometry(vr, 0.008, 6, 28, Math.PI), std(0xc4b5fd, 0.4));
      edge.rotation.z = sg < 0 ? Math.PI / 2 : -Math.PI / 2;
      edge.position.x = -sg * vr;
      piv.add(edge);
      vein.add(piv);
      vCusps.push({ piv: piv, sg: sg });
    });
    vein.position.set(0.0, 0.05, 0);
    g.add(vein);
    parts.vein = vein;
    parts.valve = vCusps[0].piv;

    // CAPILLARY: wall one endothelial cell thick, RBCs in single file
    var cap = new THREE.Group();
    cap.position.set(0.95, 0.05, 0);
    var capTube = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.78, 28, 1, true), glass(0xfda4af, 0.32));
    capTube.rotation.z = Math.PI / 2;
    cap.add(capTube);
    var nucMat = std(0x9d4edd, 0.5);
    for (var e = 0; e < 4; e++) {
      var nuc = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), nucMat);
      nuc.scale.set(1.8, 0.5, 1);
      var ang = e * 1.9;
      nuc.position.set(-0.3 + e * 0.2, Math.cos(ang) * 0.092, Math.sin(ang) * 0.092);
      cap.add(nuc);
    }
    var rbcs = [], rg = rbcGeo(0.33), rm = std(0xdc2f3a, 0.35, { emissive: new THREE.Color(0x7f1d1d), emissiveIntensity: 0.3 });
    for (var k = 0; k < 6; k++) {
      var cell = new THREE.Mesh(rg, rm);
      cell.rotation.set(0.5, 0, Math.PI / 2 + 0.35);
      cell.userData.x = -0.39 + k * 0.14;
      cap.add(cell); rbcs.push(cell);
    }
    g.add(cap);
    parts.capillary = cap;

    if (LBL) {
      var a = label("Artery", { h: 0.11, bg: "rgba(190,24,45,0.92)" }); a.position.set(-0.95, -0.46, 0.2);
      var a2 = label("thick muscle wall", { h: 0.08, bg: "rgba(10,15,29,0.8)" }); a2.position.set(-0.95, -0.58, 0.2);
      var v = label("Vein", { h: 0.11, bg: "rgba(37,72,190,0.92)" }); v.position.set(0.0, -0.46, 0.2);
      var v2 = label("wide lumen + valve", { h: 0.08, bg: "rgba(10,15,29,0.8)" }); v2.position.set(0.0, -0.58, 0.2);
      var c = label("Capillary", { h: 0.11, bg: "rgba(160,60,200,0.92)" }); c.position.set(0.95, -0.46, 0.2);
      var c2 = label("wall 1 cell thick", { h: 0.08, bg: "rgba(10,15,29,0.8)" }); c2.position.set(0.95, -0.58, 0.2);
      g.add(a, a2, v, v2, c, c2);
    }

    g.userData.parts = parts;
    g.userData.setState = function () {};
    g.userData.update = function (dt, t) {
      var pulse = 1 + 0.045 * Math.max(0, Math.sin(t * 6));
      art.scale.set(pulse, pulse, 1);
      // vein valve: open while blood moves toward the heart, closes when it tries to flow back
      var open = Math.sin(t * 1.6) > -0.2 ? 1 : 0;
      vCusps.forEach(function (c) {
        var target = open ? 1.35 : 0.0;
        c.piv.rotation.y += (-c.sg * target - c.piv.rotation.y) * Math.min(1, (dt || 0.016) * 6);
      });
      rbcs.forEach(function (r) {
        r.userData.x += (dt || 0.016) * 0.12;
        if (r.userData.x > 0.42) r.userData.x -= 0.84;
        r.position.x = r.userData.x;
        r.rotation.x = 0.5 + Math.sin(t * 2 + r.userData.x * 9) * 0.3;
      });
    };
    return attachCompat(g, o);
  }

  /* =====================================================================
     6. CAPILLARY BED — ultrafiltration, reabsorption, lymph drainage, oedema
     ===================================================================== */
  function capillaryBed(o) {
    o = o || {};
    var g = new THREE.Group();
    var parts = {};
    var LBL = o.labels !== false;
    var CY = 0.22, X0 = -1.0, X1 = 1.0;

    // tissue fluid space
    var fluid = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.25, 0.45), glass(0x7dd3fc, 0.1));
    fluid.position.set(0, 0.0, -0.08);
    g.add(fluid);
    parts.fluid = fluid;

    // capillary: red at arterial end → blue at venous end
    var capGeo = new THREE.CylinderGeometry(0.13, 0.13, 2.0, 32, 40, true);
    capGeo.rotateZ(Math.PI / 2);
    var cc = new Float32Array(capGeo.attributes.position.count * 3), col = new THREE.Color();
    for (var i = 0; i < capGeo.attributes.position.count; i++) {
      var u = (capGeo.attributes.position.getX(i) - X0) / (X1 - X0);
      col.copy(OXY).lerp(DEOXY, u);
      cc[i * 3] = col.r; cc[i * 3 + 1] = col.g; cc[i * 3 + 2] = col.b;
    }
    capGeo.setAttribute("color", new THREE.BufferAttribute(cc, 3));
    var cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.42, roughness: 0.25, side: THREE.DoubleSide, depthWrite: false }));
    cap.position.y = CY;
    g.add(cap);
    parts.capillary = cap;
    var arteriole = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.3, 24, 1, true), std(0xd2283a, 0.45, { side: THREE.DoubleSide }));
    arteriole.rotation.z = Math.PI / 2; arteriole.position.set(X0 - 0.14, CY, 0);
    var venule = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.3, 24, 1, true), std(0x3352c4, 0.45, { side: THREE.DoubleSide }));
    venule.rotation.z = Math.PI / 2; venule.position.set(X1 + 0.14, CY, 0);
    g.add(arteriole, venule);
    parts.arteriole = arteriole; parts.venule = venule;

    // RBCs and plasma proteins stay inside
    var rbcs = [], rg = rbcGeo(0.4);
    for (var r = 0; r < 9; r++) {
      var rm = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ roughness: 0.35, emissiveIntensity: 0.35 }));
      rm.rotation.z = Math.PI / 2; rm.userData.x = X0 + r * 0.23;
      g.add(rm); rbcs.push(rm);
    }
    var proteins = [], pg = new THREE.IcosahedronGeometry(0.022, 0), pmat = glowMat(0xc084fc, 0.6);
    for (var pr = 0; pr < 10; pr++) {
      var pm = new THREE.Mesh(pg, pmat); pm.userData = { x: X0 + pr * 0.2, a: pr * 1.7 };
      g.add(pm); proteins.push(pm);
    }

    // tissue cells
    var cells = new THREE.Group(), cr = rng(31);
    [[-0.7, -0.22], [-0.15, -0.2], [0.45, -0.22], [-0.45, 0.6], [0.15, 0.62], [0.72, 0.58]].forEach(function (p) {
      var cg = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), std(0xf6c37a, 0.6));
      cg.scale.set(0.2 + cr() * 0.04, 0.12, 0.1);
      cg.position.set(p[0], p[1], -0.12);
      cg.userData.base = cg.position.clone();
      var n = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), std(0x8a4b12, 0.5));
      n.position.set(0, 0, 0.9); cg.add(n);
      n.scale.set(1 / cg.scale.x * 0.2, 1 / cg.scale.y * 0.2, 1 / cg.scale.z * 0.2);
      cells.add(cg);
    });
    g.add(cells);
    parts.tissueCells = cells;

    // blind-ended lymph capillary with flap valves
    var LY = -0.5;
    var lymph = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.5, 24, 1, true), glass(0x22c55e, 0.38));
    lymph.rotation.z = Math.PI / 2; lymph.position.set(0.35, LY, 0);
    var blind = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 12, 0, TAU, 0, Math.PI / 2), glass(0x22c55e, 0.38));
    blind.rotation.z = Math.PI / 2; blind.position.set(-0.4, LY, 0);
    g.add(lymph, blind);
    for (var fv = 0; fv < 4; fv++) {
      var flap = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.05), std(0x86efac, 0.5, { side: THREE.DoubleSide }));
      flap.position.set(-0.25 + fv * 0.3, LY + 0.11, 0.02); flap.rotation.z = -0.5;
      g.add(flap);
    }
    var worm = tube([[0.55, LY - 0.03, 0.02], [0.62, LY + 0.04, 0.03], [0.70, LY - 0.04, 0.02], [0.78, LY + 0.03, 0.0]], 0.022, std(0xf8fafc, 0.4), 20, 6);
    worm.visible = false;
    g.add(worm);
    parts.lymph = lymph;
    parts.worm = worm;

    // fluid droplets: out at arterial end, back in at venous end, ≈10 % into lymph
    var drops = [], dg = new THREE.SphereGeometry(0.026, 8, 6), dmat = glowMat(0x38bdf8, 0.8), dr = rng(41);
    for (var d = 0; d < 30; d++) {
      var dm = new THREE.Mesh(dg, dmat);
      var x0 = -0.85 + dr() * 0.45, up = dr() < 0.5 ? 1 : -1, toLymph = d % 7 === 0;
      var pts;
      if (toLymph) pts = [[x0, CY, 0.05], [x0 + 0.1, CY - 0.3, 0.1], [x0 + 0.35, LY + 0.15, 0.1], [x0 + 0.45, LY, 0.02], [1.1, LY, 0.02]];
      else {
        var x1 = 0.35 + dr() * 0.45, yy = CY + up * (0.32 + dr() * 0.12);
        pts = [[x0, CY, 0.05], [x0 + 0.08, yy, 0.12], [(x0 + x1) / 2, yy + up * 0.04, 0.12], [x1 - 0.08, yy, 0.12], [x1, CY, 0.05], [1.05, CY, 0.02]];
      }
      var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3(p[0], p[1], p[2]); }), false, "centripetal");
      dm.userData = { curve: curve, u: dr(), lymph: toLymph, stuck: 0 };
      g.add(dm); drops.push(dm);
    }

    // probe marker for bench trials
    var probe = new THREE.Group();
    var pring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.014, 8, 32), glowMat(0xffb23f, 0.9));
    pring.rotation.y = Math.PI / 2;
    var arrow = new THREE.Group();
    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 8), glowMat(0xffb23f, 0.9)); shaft.position.y = 0.11;
    var head = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 12), glowMat(0xffb23f, 0.9)); head.position.y = 0.26;
    arrow.add(shaft, head);
    arrow.position.y = 0.16;
    probe.add(pring, arrow);
    probe.visible = false;
    g.add(probe);
    parts.probe = probe;

    if (LBL) {
      var l1 = label("Arterial end: fluid pushed out", { h: 0.085, bg: "rgba(190,24,45,0.92)" }); l1.position.set(-0.62, 0.95, 0.2);
      var l2 = label("Venous end: fluid drawn back", { h: 0.085, bg: "rgba(37,72,190,0.92)" }); l2.position.set(0.62, 0.82, 0.2);
      var l3 = label("Lymph capillary (blind end)", { h: 0.085, bg: "rgba(22,128,61,0.92)" }); l3.position.set(0.35, -0.78, 0.2);
      g.add(l1, l2, l3);
    }

    var state = { mode: "normal", probe: null, nfp: 10, swell: 0 };
    g.userData.parts = parts;
    g.userData.setState = function (st) {
      if (!st) return;
      if (typeof st === "string") st = { mode: st };
      if (st.mode != null) state.mode = st.mode;
      if ("probe" in st) state.probe = st.probe;
      if (st.nfp != null) state.nfp = +st.nfp;
      worm.visible = state.mode === "blocked";
    };
    g.userData.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.05);
      var oedema = state.mode !== "normal" ? 1 : 0;
      state.swell += (oedema - state.swell) * Math.min(1, dt * 1.2);
      fluid.scale.set(1, 1 + 0.35 * state.swell, 1 + 0.6 * state.swell);
      fluid.material.opacity = 0.1 + 0.12 * state.swell;
      cells.children.forEach(function (c) {
        var b = c.userData.base;
        c.position.set(b.x * (1 + 0.08 * state.swell), b.y + Math.sign(b.y - CY) * 0.12 * state.swell, b.z);
      });
      rbcs.forEach(function (rr) {
        rr.userData.x += dt * 0.2;
        if (rr.userData.x > X1) rr.userData.x = X0;
        rr.position.set(rr.userData.x, CY, 0);
        var u = (rr.userData.x - X0) / (X1 - X0);
        rr.material.color.copy(OXY).lerp(DEOXY, u); rr.material.emissive.copy(rr.material.color);
        rr.rotation.x = t * 2;
      });
      proteins.forEach(function (p) {
        p.userData.x += dt * 0.2; if (p.userData.x > X1) p.userData.x = X0;
        p.position.set(p.userData.x, CY + Math.sin(p.userData.a + t * 2) * 0.07, Math.cos(p.userData.a + t * 2) * 0.07);
      });
      var lowReturn = state.mode === "kwash" || state.mode === "congest";
      drops.forEach(function (dm, i) {
        var d = dm.userData;
        var speed = 0.12;
        // when re-absorption fails, droplets linger in the tissue (oedema)
        if (!d.lymph && lowReturn && d.u > 0.45 && d.u < 0.6 && i % 3 !== 0) speed = 0.004;
        if (d.lymph && state.mode === "blocked" && d.u > 0.55) speed = 0.0;
        d.u += dt * speed;
        if (d.u >= 1) d.u = 0;
        dm.position.copy(d.curve.getPointAt(Math.min(1, d.u)));
      });
      if (state.probe != null) {
        probe.visible = true;
        var px = X0 + (X1 - X0) * Math.max(0, Math.min(1, state.probe));
        probe.position.set(px, CY, 0);
        var out = state.nfp >= 0;
        arrow.rotation.z = out ? 0 : Math.PI;
        arrow.position.y = out ? 0.16 : 0.62;
        var mag = Math.min(1.4, 0.35 + Math.abs(state.nfp) / 12);
        arrow.scale.set(1, mag, 1);
        pring.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 6);
      } else probe.visible = false;
    };
    return attachCompat(g, o);
  }

  /* =====================================================================
     7. BLOOD SMEAR (microscope field) — RBCs, neutrophil, lymphocyte, platelets, fibrin clot
     ===================================================================== */
  function bloodSmear(o) {
    o = o || {};
    var g = new THREE.Group();
    var parts = {};
    var FR = 0.95;
    var field = new THREE.Mesh(new THREE.CircleGeometry(FR, 64), new THREE.MeshStandardMaterial({ color: 0xf7e7ea, roughness: 0.8, emissive: 0xf3d9de, emissiveIntensity: 0.35 }));
    field.position.z = -0.06;
    var rimRing = new THREE.Mesh(new THREE.TorusGeometry(FR + 0.03, 0.05, 12, 64), std(0x111827, 0.4, { metalness: 0.6 }));
    rimRing.position.z = -0.04;
    g.add(field, rimRing);
    parts.field = field;

    var R = rng(o.seed || 17);
    var rbcG = rbcGeo(0.62);
    var rbcMat = std(0xd94450, 0.42, { emissive: new THREE.Color(0x6b0f17), emissiveIntensity: 0.25 });
    var pallorMat = new THREE.MeshBasicMaterial({ color: 0xf2a0a6, transparent: true, opacity: 0.65, depthWrite: false });
    var sickleGeo = new THREE.TorusGeometry(0.09, 0.03, 8, 20, Math.PI * 1.1);
    var sickleMat = std(0xa3263a, 0.45);
    var rbcGroup = new THREE.Group();
    var rbcs = [];
    var spots = [];
    function free(x, y, rr) {
      for (var s = 0; s < spots.length; s++) if (Math.hypot(spots[s][0] - x, spots[s][1] - y) < rr + spots[s][2]) return false;
      return Math.hypot(x, y) < FR - rr - 0.02;
    }
    // reserve the white cells' spots first
    spots.push([-0.42, 0.18, 0.22], [0.36, -0.3, 0.2], [0.45, 0.42, 0.1]);
    var tries = 0;
    while (rbcs.length < 30 && tries < 2000) {
      tries++;
      var x = (R() * 2 - 1) * FR, y = (R() * 2 - 1) * FR;
      if (!free(x, y, 0.15)) continue;
      spots.push([x, y, 0.13]);
      var cell = new THREE.Group();
      var disc = new THREE.Mesh(rbcG, rbcMat); disc.rotation.x = Math.PI / 2;
      var pal = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), pallorMat); pal.position.z = 0.012;
      var sk = new THREE.Mesh(sickleGeo, sickleMat); sk.visible = false; sk.scale.z = 0.5; sk.rotation.z = R() * TAU;
      cell.add(disc, pal, sk);
      cell.position.set(x, y, 0);
      cell.userData = { home: new V3(x, y, 0), ph: R() * TAU, disc: disc, pal: pal, sk: sk, sickle: R() < 0.45 };
      rbcGroup.add(cell); rbcs.push(cell);
    }
    g.add(rbcGroup);
    parts.rbc = rbcGroup;

    // neutrophil (phagocyte): granular cytoplasm + 3-lobed nucleus
    var neut = new THREE.Group(); neut.position.set(-0.42, 0.18, 0.01);
    var nb = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 16), std(0xe9d5f5, 0.6)); nb.scale.z = 0.35; neut.add(nb);
    var lobeMat = std(0x5b21b6, 0.45, { emissive: new THREE.Color(0x2e1065), emissiveIntensity: 0.3 });
    [[-0.07, 0.04], [0.02, 0.07], [0.08, -0.03], [-0.01, -0.06]].forEach(function (p, i) {
      var lb = new THREE.Mesh(new THREE.SphereGeometry(0.055 - i * 0.003, 14, 10), lobeMat);
      lb.position.set(p[0], p[1], 0.05); lb.scale.z = 0.6; neut.add(lb);
    });
    for (var gr = 0; gr < 14; gr++) {
      var gn = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 4), std(0xc084fc, 0.5));
      var ga = R() * TAU, grr = 0.08 + R() * 0.08; gn.position.set(Math.cos(ga) * grr, Math.sin(ga) * grr, 0.06); neut.add(gn);
    }
    g.add(neut);
    parts.phagocyte = neut;

    // lymphocyte: large round nucleus, thin rim of cytoplasm
    var lym = new THREE.Group(); lym.position.set(0.36, -0.3, 0.01);
    var lbd = new THREE.Mesh(new THREE.SphereGeometry(0.15, 22, 16), std(0xbfdbfe, 0.5)); lbd.scale.z = 0.4; lym.add(lbd);
    var lnu = new THREE.Mesh(new THREE.SphereGeometry(0.125, 22, 16), std(0x312e81, 0.45, { emissive: new THREE.Color(0x1e1b4b), emissiveIntensity: 0.3 })); lnu.position.set(0.012, 0.0, 0.03); lnu.scale.z = 0.45; lym.add(lnu);
    g.add(lym);
    parts.lymphocyte = lym;

    // platelets: small purple fragments
    var platGroup = new THREE.Group();
    var plMat = std(0x8b5cf6, 0.5, { emissive: new THREE.Color(0x4c1d95), emissiveIntensity: 0.3 });
    var plats = [];
    [[0.45, 0.42], [0.5, 0.38], [0.41, 0.36], [-0.1, -0.62], [-0.62, -0.32], [0.12, 0.7], [0.72, 0.05]].forEach(function (p) {
      var pl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.022, 0), plMat);
      pl.scale.set(1.3, 0.9, 0.5); pl.position.set(p[0], p[1], 0.02);
      pl.userData.home = pl.position.clone();
      platGroup.add(pl); plats.push(pl);
    });
    g.add(platGroup);
    parts.platelets = platGroup;

    // fibrin mesh
    var fibrinGroup = new THREE.Group();
    var fibMat = std(0xfde68a, 0.4, { emissive: new THREE.Color(0xca8a04), emissiveIntensity: 0.35 });
    for (var f = 0; f < 18; f++) {
      var a0 = R() * TAU, a1 = a0 + Math.PI * (0.6 + R() * 0.8), r0 = 0.5 + R() * 0.35, r1 = 0.5 + R() * 0.35;
      var p0 = new V3(Math.cos(a0) * r0, Math.sin(a0) * r0, 0.07), p1 = new V3(Math.cos(a1) * r1, Math.sin(a1) * r1, 0.07);
      var mid = p0.clone().lerp(p1, 0.5).add(new V3((R() - 0.5) * 0.25, (R() - 0.5) * 0.25, 0.02));
      fibrinGroup.add(tube([p0, mid, p0.clone().lerp(p1, 0.75).add(new V3((R() - 0.5) * 0.15, (R() - 0.5) * 0.15, 0)), p1], 0.0045, fibMat, 24, 4));
    }
    fibrinGroup.visible = false;
    g.add(fibrinGroup);
    parts.fibrin = fibrinGroup;

    if (o.labels !== false && rbcs.length) {
      var h0 = rbcs[0].userData.home;
      [["Red blood cell (no nucleus)", h0.x, h0.y + 0.17, "rgba(190,24,45,0.92)"],
       ["Phagocyte (lobed nucleus)", -0.42, 0.45, "rgba(91,33,182,0.92)"],
       ["Lymphocyte", 0.36, -0.55, "rgba(49,46,129,0.92)"],
       ["Platelets", 0.47, 0.58, "rgba(124,58,237,0.92)"]].forEach(function (L) {
        var s = label(L[0], { h: 0.085, bg: L[3] }); s.position.set(L[1], L[2], 0.2); g.add(s);
      });
    }
    var state = { clot: !!o.clot, sickle: false, hb: 15, k: o.clot ? 1 : 0 };
    function apply() {
      fibrinGroup.visible = state.clot;
      rbcs.forEach(function (c) {
        var s = state.sickle && c.userData.sickle;
        c.userData.disc.visible = !s; c.userData.pal.visible = !s; c.userData.sk.visible = s;
      });
      var shade = Math.max(0.45, Math.min(1.15, state.hb / 15));
      rbcMat.color.setRGB(0.85 * shade, 0.27 * shade, 0.31 * shade);
    }
    g.userData.parts = parts;
    g.setClot = function (on) { state.clot = !!on; apply(); };
    g.userData.setState = function (st) {
      if (!st) return;
      if (st.clot != null) state.clot = !!st.clot;
      if (st.sickle != null) state.sickle = !!st.sickle;
      if (st.hb != null) state.hb = +st.hb;
      apply();
    };
    g.userData.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.05);
      state.k += ((state.clot ? 1 : 0) - state.k) * Math.min(1, dt * 2);
      rbcs.forEach(function (c, i) {
        var h = c.userData.home;
        var jx = Math.sin(t * 0.7 + c.userData.ph) * 0.012, jy = Math.cos(t * 0.6 + c.userData.ph) * 0.012;
        // clot: cells get pulled into the fibrin mesh and stack together
        var pull = 0.55 * state.k;
        c.position.set(h.x * (1 - pull) + jx * (1 - state.k), h.y * (1 - pull) + jy * (1 - state.k), 0.01 * (i % 3) * state.k);
      });
      plats.forEach(function (p, i) {
        var h = p.userData.home;
        p.position.set(h.x * (1 - 0.7 * state.k), h.y * (1 - 0.7 * state.k), 0.03);
      });
      neut.position.x = -0.42 + Math.sin(t * 0.4) * 0.02;
    };
    apply();
    return attachCompat(g, o);
  }

  /* ---------- highlight helper ---------- */
  function makeHighlighter(scene) {
    var glow = window.SceneKit ? SceneKit.glowSprite("rgba(255,178,63,0.9)", 1) : null;
    if (glow && scene) { glow.material.opacity = 0; glow.material.depthTest = false; glow.renderOrder = 9; scene.add(glow); }
    var cur = null, box = new THREE.Box3(), size = new V3();
    return {
      set: function (obj) { cur = obj || null; },
      update: function (dt, t) {
        if (!glow) return;
        if (cur) {
          box.setFromObject(cur); box.getCenter(glow.position); box.getSize(size);
          glow.scale.setScalar(Math.max(0.4, Math.max(size.x, size.y) * 1.6));
        }
        var target = cur ? 0.5 + 0.2 * Math.sin(t * 5) : 0;
        glow.material.opacity += (target - glow.material.opacity) * Math.min(1, dt * 6);
      }
    };
  }

  window.HeartKit = {
    std: std, glass: glass, glowMat: glowMat, label: label,
    heart: heart, circuitCompare: circuitCompare, cube: cube, valve: valve,
    vessels: vessels, capillaryBed: capillaryBed, bloodSmear: bloodSmear,
    makeHighlighter: makeHighlighter, rbcGeo: rbcGeo,
    version: 2
  };
})();
