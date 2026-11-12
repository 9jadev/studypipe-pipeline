/* =========================================================
   StudyPipe · AutoWorkshopProps v1 — shared story props for the Ohm's Law unit
   (Nkechi's auto-electric workshop, Ngwa Road, Aba + her test bench).
   Classic script (no modules), 100% offline, uses window.THREE only
   (window.SceneKit is optional: used for the glow sprite / label texture when present).

   Scale: 1 unit = 1 metre, y up, the StoryStage scale (people are about 1.75 m tall,
   the market table top is y = 0.94, the lab bench top is y = 0.99 in lab-local space).
   Every prop sits on y = 0 at its own origin, front towards +z (the keke's nose is +x).

   AutoWorkshopProps.
     createKeke(opts)        three-wheeler: canopy, windscreen, handlebar, headlamp (setLamp 0-1),
                             battery box under the driver's seat (setBatteryBox 0-1 opens the lid)
     createBattery(opts)     12 V lead-acid battery: vent caps, lead posts, clamps, corrosion, setHeat,
                             model E, r, setLoad(R) -> reading() { E, r, R, I, V, lost, P_r }
     createJumperSet(opts)   red + black jumper leads with alligator clamps (thin | thick), setHeat,
                             model R = rho L / A, setCurrent(I) -> heat from P = I^2 R
     createJumperCable(opts) one lead of the set
     createBulb(opts)        B22 filament bulb (+ batten holder), setVoltage(V) -> lamp law I ~ V^0.55, glow
     createWireCoil(opts)    spool of bare resistance wire (constantan 0.30 mm by default), R per metre
     createMultimeter(opts)  digital multimeter, LCD drawn from setValue(v) / setSource(fn), clipTo(battery)
     createToolBoard(opts)   pegboard on legs with spanners, screwdriver, pliers, wire hanks
     createCellPack(opts)    n identical D-size cells, series | parallel, model E_t, r_t, I
     createPump(opts)        small 12 V DC water pump (backup pump), setRunning
     dressWorkshop(api, o)   puts the props into StoryStage Set 1 (market group) and api.props
     dressBench(api, o)      puts the props on StoryStage Set 2 (lab bench) and api.props
     model                   the formulas the readings come from
     makeHighlighter(scene)  pulse named parts (userData.partId)
   Every create* returns a THREE.Group g with g.parts, g.update(dt, t), g.setState(o), g.reading().
   ========================================================= */
(function (global) {
  "use strict";
  var THREE = global.THREE;
  if (!THREE) return;
  var TAU = Math.PI * 2, V3 = THREE.Vector3;

  /* ---------------------------------------------------------------- helpers */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if ("encoding" in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function canvasTex(w, h, draw, color) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (color !== false) srgb(t);
    t.anisotropy = 4;
    return t;
  }
  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.6 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function damp(a, b, k, dt) { return a + (b - a) * (1 - Math.exp(-k * dt)); }
  function v3(a) { return Array.isArray(a) ? new V3(a[0], a[1], a[2]) : a.clone(); }
  function mesh(geo, mat, x, y, z) { var m = new THREE.Mesh(geo, mat); if (x != null) m.position.set(x, y, z); return m; }

  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData.partId = key;
    obj.traverse(function (c) { if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData.parts = parts; g.userData.update = updateFn; g.userData.setState = setStateFn || function () {};
    g.group = g; g.parts = parts; g.tick = updateFn; g.update = updateFn; g.setState = g.userData.setState;
    return g;
  }
  function makeHighlighter(scene) {
    var saved = [];
    function clear() {
      for (var i = 0; i < saved.length; i++) saved[i].mesh.material = saved[i].orig;
      saved.length = 0;
    }
    function highlight(partName, colorHex) {
      clear();
      if (!partName || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (!o.isMesh || !o.material || o.userData.partId !== partName) return;
        var m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (!m || !m.emissive) return;
        var c = m.clone(); c.emissive = col.clone(); c.emissiveIntensity = 0.65;
        saved.push({ mesh: o, orig: o.material }); o.material = c;
      });
    }
    return { highlight: highlight, clear: clear };
  }
  function pickPartFrom(g) {
    return function (raycaster) {
      var hits = raycaster.intersectObject(g, true);
      for (var i = 0; i < hits.length; i++) { var o = hits[i].object; if (o.visible && o.userData.partId) return o.userData.partId; }
      return null;
    };
  }

  /* lathe from [[r, y], ...] around the y axis */
  function lathe(profile, segs, mat, phi0, phiLen) {
    var pts = profile.map(function (p) { return new THREE.Vector2(Math.max(0, p[0]), p[1]); });
    return new THREE.Mesh(new THREE.LatheGeometry(pts, segs || 24, phi0 || 0, phiLen || TAU), mat);
  }
  /* spline tube through points */
  function tubeGeo(pts, r, segs, rad, closed) {
    var curve = new THREE.CatmullRomCurve3(pts.map(v3), !!closed, "catmullrom", 0.5);
    var geo = new THREE.TubeGeometry(curve, segs || 32, r, rad || 8, !!closed);
    geo.userData = { curve: curve };
    return geo;
  }
  var _up = new V3(0, 1, 0), _d = new V3();
  function between(m, a, b) {
    _d.subVectors(b, a); var len = _d.length();
    m.position.addVectors(a, b).multiplyScalar(0.5);
    m.scale.set(1, Math.max(1e-4, len), 1);
    if (len > 1e-6) m.quaternion.setFromUnitVectors(_up, _d.divideScalar(len));
    return m;
  }
  function helixPts(r, pitch, turns, n, z0) {
    var out = [];
    for (var i = 0; i <= n; i++) { var a = i / n * turns * TAU; out.push(new V3(Math.cos(a) * r, Math.sin(a) * r, (z0 || 0) + i / n * turns * pitch)); }
    return out;
  }
  /* rounded box with analytic normals; BoxGeometry face groups kept (+x,-x,+y,-y,+z,-z) */
  function rboxGeo(w, h, d, r, k) {
    k = k || 3;
    var n = 2 * (k + 1), g = new THREE.BoxGeometry(1, 1, 1, n, n, n);
    var P = g.attributes.position, N = g.attributes.normal, UV = g.attributes.uv, half = [w / 2, h / 2, d / 2];
    r = Math.min(r, half[0] - 1e-4, half[1] - 1e-4, half[2] - 1e-4);
    var o = [0, 0, 0], inn = [0, 0, 0];
    for (var i = 0; i < P.count; i++) {
      for (var c = 0; c < 3; c++) {
        var u = P.array[i * 3 + c], j = Math.round((u + 0.5) * n) - n / 2, s = j < 0 ? -1 : 1, a = Math.abs(j), lim = half[c] - r;
        if (a <= 1) { o[c] = s * a * lim; inn[c] = o[c]; }
        else { var f = (a - 1) / k; o[c] = s * (lim + r * Math.sin(f * Math.PI / 2)); inn[c] = s * lim; }
      }
      var dx = o[0] - inn[0], dy = o[1] - inn[1], dz = o[2] - inn[2], L = Math.sqrt(dx * dx + dy * dy + dz * dz);
      var nx = N.getX(i), ny = N.getY(i), nz = N.getZ(i), px, py, pz;
      if (L < 1e-9) { px = o[0]; py = o[1]; pz = o[2]; }
      else {
        dx /= L; dy /= L; dz /= L;
        px = inn[0] + dx * r; py = inn[1] + dy * r; pz = inn[2] + dz * r;
        N.setXYZ(i, dx, dy, dz);
      }
      P.setXYZ(i, px, py, pz);
      // planar UVs per face so a label fills the whole flat face
      var U = px / w + 0.5, Vv = py / h + 0.5, Zz = pz / d + 0.5;
      if (Math.abs(nz) > 0.5) UV.setXY(i, nz > 0 ? U : 1 - U, Vv);
      else if (Math.abs(nx) > 0.5) UV.setXY(i, nx > 0 ? 1 - Zz : Zz, Vv);
      else UV.setXY(i, U, ny > 0 ? 1 - Zz : Zz);
    }
    return g;
  }
  function rbox(w, h, d, r, mat, k) { return new THREE.Mesh(rboxGeo(w, h, d, r, k), mat); }

  var _glowTex = null;
  function glowTex() {
    if (_glowTex) return _glowTex;
    _glowTex = canvasTex(64, 64, function (g) {
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.45)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    });
    return _glowTex;
  }
  function glowSprite(color, size) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(size, size, 1);
    return s;
  }
  /* rising heat shimmer: soft additive wisps above a set of base points */
  var _wispTex = null;
  function wispTex() {
    if (_wispTex) return _wispTex;
    _wispTex = canvasTex(32, 96, function (g) {
      var gr = g.createRadialGradient(16, 48, 0, 16, 48, 44);
      gr.addColorStop(0, "rgba(255,170,90,0.9)"); gr.addColorStop(1, "rgba(255,120,40,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 32, 96);
    });
    return _wispTex;
  }
  function shimmer(bases, size, rise) {
    var grp = new THREE.Group(), sp = [];
    bases.forEach(function (b, i) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: wispTex(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.set(size * 0.5, size * 1.4, 1);
      s.userData = { base: b.clone(), ph: (i * 0.37) % 1 };
      grp.add(s); sp.push(s);
    });
    grp.userData.update = function (dt, t, level) {
      for (var i = 0; i < sp.length; i++) {
        var s = sp[i], u = (t * 0.45 + s.userData.ph) % 1;
        s.position.copy(s.userData.base); s.position.y += u * rise; s.position.x += Math.sin(t * 3 + i) * size * 0.15;
        s.material.opacity = level * Math.sin(Math.PI * u) * 0.55;
        s.visible = level > 0.02;
      }
    };
    grp.userData.setBases = function (pts) { for (var i = 0; i < sp.length && i < pts.length; i++) sp[i].userData.base.copy(pts[i]); };
    return grp;
  }
  function textSprite(text, h, bg, fg) {
    var tex = null;
    if (global.SceneKit && SceneKit.labelTexture) tex = SceneKit.labelTexture(text, { size: 48, bg: bg || "rgba(20,24,32,0.9)", color: fg || "#fff", weight: 700 });
    if (!tex) {
      tex = canvasTex(512, 96, function (g, w, hh) {
        g.font = "700 52px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillStyle = bg || "rgba(20,24,32,0.9)"; g.fillRect(0, 0, w, hh); g.fillStyle = fg || "#fff"; g.fillText(text, w / 2, hh / 2 + 2);
      });
      tex.userData = { aspect: 512 / 96 };
    }
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.scale.set(h * (tex.userData.aspect || 4), h, 1);
    return s;
  }

  /* ---------------------------------------------------------------- model */
  var model = {
    RHO: { copper: 1.7e-8, constantan: 4.9e-7, nichrome: 1.1e-6 },   // ohm metre (constantan matches the unit's 4.9 x 10^-7)
    /* cell / battery with internal resistance; R = null means open circuit */
    cell: function (E, r, R) {
      if (R == null || !(R >= 0)) return { E: E, r: r, R: null, I: 0, V: E, lost: 0, P_r: 0, P_R: 0 };
      var I = E / (R + r), lost = I * r;
      return { E: E, r: r, R: R, I: I, V: E - lost, lost: lost, P_r: I * I * r, P_R: I * I * R };
    },
    /* n identical cells in series or in parallel, driving load R */
    cellArray: function (n, E, r, arrangement, R) {
      var Et = arrangement === "parallel" ? E : n * E, rt = arrangement === "parallel" ? r / n : n * r;
      var o = model.cell(Et, rt, R); o.n = n; o.arrangement = arrangement; o.E_cell = E; o.r_cell = r; o.E_total = Et; o.r_total = rt;
      return o;
    },
    /* resistance of a uniform wire: R = rho L / (pi d^2 / 4) */
    wireR: function (rho, L_m, d_mm) { var d = d_mm / 1000; return rho * L_m / (Math.PI * d * d / 4); },
    /* filament lamp: empirical I = I_rated (V / V_rated)^0.55 (non-ohmic: R rises with V) */
    lamp: function (V, V_rated, P_rated) {
      var Ir = P_rated / V_rated, v = Math.max(0, V), I = v > 0 ? Ir * Math.pow(v / V_rated, 0.55) : 0;
      var P = v * I;
      return { V: v, I: I, R: I > 0 ? v / I : null, P: P, glow: clamp(P / P_rated, 0, 1.2) };
    }
  };

  /* ================================================================ BATTERY */
  function batteryLabelTex(o) {
    return canvasTex(512, 256, function (g, w, h) {
      g.fillStyle = o.caseColor; g.fillRect(0, 0, w, h);
      g.fillStyle = o.bandColor; g.fillRect(0, 44, w, 120);
      g.fillStyle = "rgba(255,255,255,0.92)"; g.fillRect(0, 44, w, 6); g.fillRect(0, 158, w, 6);
      g.fillStyle = "#fff"; g.font = "800 64px system-ui, sans-serif"; g.textBaseline = "middle"; g.textAlign = "left";
      g.fillText(o.voltText, 28, 106);
      g.font = "700 30px system-ui, sans-serif"; g.textAlign = "right";
      g.fillText(o.ahText, w - 28, 88); g.fillText("LEAD-ACID", w - 28, 126);
      g.fillStyle = "rgba(255,255,255,0.75)"; g.font = "600 20px system-ui, sans-serif"; g.textAlign = "left";
      g.fillText("KEEP UPRIGHT · CHARGE IN OPEN AIR", 28, 200);
      for (var i = 0; i < 4; i++) { g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 3; g.beginPath(); g.arc(300 + i * 52, 226, 16, 0, TAU); g.stroke(); }
      g.fillStyle = "rgba(0,0,0,0.25)"; for (var y = 0; y < h; y += 4) g.fillRect(0, y, w, 1);
    });
  }
  function createBattery(opts) {
    opts = opts || {};
    var st = { E: opts.E != null ? opts.E : 12.0, r: opts.r != null ? opts.r : 0.05, R: opts.R != null ? opts.R : null,
               heat: 0, heatShown: 0, corrosion: opts.corrosion || 0, clamps: opts.clamps !== false };
    var g = new THREE.Group(), parts = {};
    var W = 0.24, D = 0.17, H = 0.165;
    var caseCol = opts.caseColor || "#1d232b";
    var lab = batteryLabelTex({ caseColor: caseCol, bandColor: opts.bandColor || "#b71c1c",
      voltText: (opts.labelV || st.E.toFixed(0) + " V"), ahText: (opts.ah || 45) + " Ah" });
    var caseMat = std(caseCol, 0.55, 0, { emissive: new THREE.Color(0xff4a10), emissiveIntensity: 0 });
    var faceMat = std("#ffffff", 0.5, 0, { map: lab, emissive: new THREE.Color(0xff4a10), emissiveIntensity: 0 });
    var body = new THREE.Mesh(rboxGeo(W, H, D, 0.009, 2), [caseMat, caseMat, caseMat, caseMat, faceMat, faceMat]);
    body.position.y = H / 2; g.add(body);
    // hold-down ledges along the base
    [-1, 1].forEach(function (s) { var l = rbox(W + 0.01, 0.012, 0.012, 0.004, caseMat, 1); l.position.set(0, 0.008, s * (D / 2 + 0.003)); g.add(l); });
    // vertical case ribs on the ends
    var i;
    if (!opts.lite) for (i = -2; i <= 2; i++) [-1, 1].forEach(function (s) { var rb = mesh(new THREE.BoxGeometry(0.004, H * 0.8, 0.008), caseMat); rb.position.set(s * (W / 2 + 0.001), H * 0.48, i * 0.03); g.add(rb); });
    parts.case = tagPart(body, "case");
    var lidMat = std(opts.lidColor || "#2a313b", 0.5);
    var lid = rbox(W + 0.006, 0.02, D + 0.006, 0.006, lidMat, 2); lid.position.y = H + 0.008; g.add(lid);
    parts.lid = tagPart(lid, "lid");
    // six vent caps, ribbed
    var capMat = std(opts.capColor || "#e6c229", 0.45);
    var vents = new THREE.Group();
    for (i = 0; i < 6; i++) {
      var vc = lathe([[0, 0], [0.0115, 0], [0.0115, 0.004], [0.0105, 0.0075], [0.009, 0.009], [0, 0.0095]], 14, capMat);
      vc.position.set(-0.075 + i * 0.03, H + 0.018, -0.02); vents.add(vc);
      var slot = mesh(new THREE.BoxGeometry(0.014, 0.002, 0.003), std("#222", 0.6), vc.position.x, H + 0.0285, -0.02); vents.add(slot);
    }
    g.add(vents); parts.ventCaps = tagPart(vents, "ventCaps");
    // carry handle along the back edge
    var handle = new THREE.Mesh(tubeGeo([[-0.075, H + 0.016, -0.072], [-0.055, H + 0.045, -0.072], [0.055, H + 0.045, -0.072], [0.075, H + 0.016, -0.072]], 0.0035, 20, 6), std("#111", 0.6));
    g.add(handle); parts.handle = tagPart(handle, "handle");
    // lead posts (tapered), polarity collars and embossed signs
    var leadMat = std("#8e9399", 0.45, 0.45);
    var postX = W / 2 - 0.035, postZ = 0.045, postY = H + 0.018;
    function post(sx, col, key) {
      var p = new THREE.Group();
      var collar = lathe([[0.016, 0], [0.016, 0.004], [0.013, 0.005], [0.012, 0.0055]], 18, std(col, 0.5)); p.add(collar);
      var stem = lathe([[0, 0], [0.0105, 0], [0.0105, 0.004], [0.0092, 0.024], [0.0075, 0.0255], [0, 0.0255]], 18, leadMat); stem.position.y = 0.004; p.add(stem);
      p.position.set(sx, postY, postZ); g.add(p);
      parts[key] = tagPart(p, key);
      return p;
    }
    var pPos = post(postX, "#c62828", "posPost"), pNeg = post(-postX, "#1b1b1b", "negPost");
    var signRed = std("#d32f2f", 0.5), signBlk = std("#f2f2f2", 0.5);
    var plusA = mesh(new THREE.BoxGeometry(0.02, 0.002, 0.005), signRed, postX - 0.002, H + 0.0185, postZ - 0.035); g.add(plusA);
    var plusB = mesh(new THREE.BoxGeometry(0.005, 0.002, 0.02), signRed, postX - 0.002, H + 0.0185, postZ - 0.035); g.add(plusB);
    var minus = mesh(new THREE.BoxGeometry(0.02, 0.002, 0.005), signBlk, -postX + 0.002, H + 0.0185, postZ - 0.035); g.add(minus);
    // terminal clamps with bolts and short cable tails
    var clampMat = std("#b9a27a", 0.4, 0.55);
    function clampOn(p, sx, col, key) {
      var c = new THREE.Group();
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.0125, 0.0042, 8, 20), clampMat); ring.rotation.x = Math.PI / 2; c.add(ring);
      var ear = rbox(0.014, 0.012, 0.03, 0.003, clampMat, 1); ear.position.set(0, 0, 0.02); c.add(ear);
      var bolt = mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.03, 8), std("#c8ccd0", 0.35, 0.6), 0, 0, 0.022); bolt.rotation.z = Math.PI / 2; c.add(bolt);
      var nut = mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.005, 6), std("#c8ccd0", 0.35, 0.6), 0.017, 0, 0.022); nut.rotation.z = Math.PI / 2; c.add(nut);
      var tail = new THREE.Mesh(tubeGeo([[0, 0.002, 0.03], [0, 0.004, 0.06], [sx * 0.03, -0.02, 0.085], [sx * 0.05, -0.07, 0.095]], 0.0065, 16, 8), std(col, 0.5));
      c.add(tail);
      c.position.set(p.position.x, postY + 0.016, p.position.z); g.add(c);
      parts[key] = tagPart(c, key);
      return c;
    }
    var cPos = opts.lite ? new THREE.Group() : clampOn(pPos, 1, "#c62828", "posClamp"), cNeg = opts.lite ? new THREE.Group() : clampOn(pNeg, -1, "#1f1f1f", "negClamp");
    // white-green sulphate crust on the terminals (corrosion 0..1)
    var crustGeo = new THREE.IcosahedronGeometry(1, 0), crustMat = std("#dfe8d6", 0.95), crust = new THREE.Group(), R = rng(7);
    if (!opts.lite) [pPos, pNeg].forEach(function (p) {
      for (var k = 0; k < 14; k++) {
        var a = R() * TAU, rr = 0.012 + R() * 0.008, m = new THREE.Mesh(crustGeo, k % 3 ? crustMat : std("#9fc7a8", 0.95));
        var s = 0.002 + R() * 0.004; m.scale.set(s, s * 0.7, s);
        m.position.set(p.position.x + Math.cos(a) * rr, postY + 0.002 + R() * 0.012, p.position.z + Math.sin(a) * rr); crust.add(m);
      }
    });
    g.add(crust); parts.corrosion = tagPart(crust, "corrosion");
    var heat = shimmer([new V3(-0.06, H + 0.04, 0), new V3(0.04, H + 0.05, 0.02), new V3(0.09, H + 0.03, -0.03), new V3(-0.01, H + 0.06, -0.04)], 0.06, 0.16);
    g.add(heat);

    function apply() {
      cPos.visible = cNeg.visible = !!st.clamps;
      crust.visible = st.corrosion > 0.01;
      crust.children.forEach(function (m, i) { m.visible = i % 14 < Math.round(st.corrosion * 14); });
    }
    function reading() { var o = model.cell(st.E, st.r, st.R); o.heat = st.heat; o.corrosion = st.corrosion; return o; }
    function update(dt, t) {
      st.heatShown = damp(st.heatShown, st.heat, 3, dt || 0.016);
      caseMat.emissiveIntensity = faceMat.emissiveIntensity = st.heatShown * 0.32;
      heat.userData.update(dt, t || 0, st.heatShown);
    }
    function setState(o) {
      o = o || {};
      ["E", "r", "corrosion", "clamps"].forEach(function (k) { if (o[k] != null) st[k] = o[k]; });
      if ("R" in o) st.R = o.R;
      if (o.heat != null) st.heat = clamp(o.heat, 0, 1);
      apply();
    }
    g.setLoad = function (R) { st.R = R; return reading(); };
    g.setHeat = function (h) { st.heat = clamp(h, 0, 1); };
    /* world positions of the + and - terminal tops (for leads and meter probes) */
    g.terminal = function (sign, target) {
      target = target || new V3();
      (sign > 0 ? pPos : pNeg).localToWorld(target.set(0, 0.03, 0));
      return target;
    };
    g.reading = reading; g.pickPart = pickPartFrom(g);
    apply();
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ ALLIGATOR CLAMP (jump-lead clip)
     Built along +x: jaws at +x, cable enters at x = -0.095. Upper/lower levers are
     extruded side profiles with teeth, rubber sleeves on the handles, coil spring at the pivot. */
  function leverGeo(sign, depth) {
    var p = [[0.074, 0.0005]];
    for (var x = 0.068; x > 0.012; x -= 0.007) { p.push([x, 0.0045]); p.push([x - 0.0035, 0.0005]); }
    p.push([0.006, 0.003], [-0.02, -0.004], [-0.086, -0.014], [-0.092, -0.019], [-0.088, -0.026], [-0.02, -0.0135], [0.0, -0.0125], [0.035, -0.009], [0.074, -0.0045]);
    if (sign < 0) p = p.map(function (q) { return [q[0], -q[1]]; }).reverse();
    var s = new THREE.Shape(); s.moveTo(p[0][0], p[0][1]); for (var i = 1; i < p.length; i++) s.lineTo(p[i][0], p[i][1]);
    var geo = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.0008, bevelSegments: 1, curveSegments: 4 });
    geo.translate(0, 0, -depth / 2);
    return geo;
  }
  var _clipGeo = null;
  function clipGeos() {
    if (_clipGeo) return _clipGeo;
    _clipGeo = {
      lo: leverGeo(1, 0.018), hi: leverGeo(-1, 0.016),
      sleeve: rboxGeo(0.07, 0.016, 0.026, 0.006, 2),
      spring: tubeGeo(helixPts(0.0065, 0.0026, 7, 70, -0.0095), 0.0011, 70, 5),
      pin: new THREE.CylinderGeometry(0.0022, 0.0022, 0.03, 8)
    };
    return _clipGeo;
  }
  function createClip(color) {
    var G = clipGeos(), c = new THREE.Group();
    var jawMat = std("#c27a43", 0.38, 0.55), sleeveMat = std(color, 0.55);
    var lo = new THREE.Mesh(G.lo, jawMat); c.add(lo);
    var hi = new THREE.Group(), hiM = new THREE.Mesh(G.hi, jawMat); hi.add(hiM); c.add(hi);
    var s1 = new THREE.Mesh(G.sleeve, sleeveMat); s1.position.set(-0.058, -0.016, 0); s1.rotation.z = Math.atan2(-0.01, 0.066); c.add(s1);
    var s2 = new THREE.Mesh(G.sleeve, sleeveMat); s2.position.set(-0.058, 0.016, 0); s2.rotation.z = -Math.atan2(-0.01, 0.066); hi.add(s2);
    var spring = new THREE.Mesh(G.spring, std("#c9ced4", 0.3, 0.7)); spring.position.x = -0.002; c.add(spring);
    var pin = new THREE.Mesh(G.pin, std("#d7dbe0", 0.3, 0.7)); pin.rotation.x = Math.PI / 2; pin.position.x = -0.002; c.add(pin);
    c.userData.setOpen = function (a) { hi.rotation.z = a; };
    hi.rotation.z = 0.06;
    return c;
  }

  /* ================================================================ JUMPER CABLES */
  function createJumperCable(opts) {
    opts = opts || {};
    var thick = (opts.gauge || "thin") === "thick";
    var st = {
      gauge: thick ? "thick" : "thin",
      r: opts.radius || (thick ? 0.0105 : 0.0042),
      d_mm: opts.d_mm != null ? opts.d_mm : (thick ? 1.20 : 0.30),
      L: opts.length_m || 1.0,
      rho: opts.rho || model.RHO.copper,
      I: 0, heat: 0, heatShown: 0, auto: false,
      heatRef: opts.heatRef_W_per_m || 1.1,
      color: opts.color || "#c62828",
      from: v3(opts.from || [-0.5, 0, 0]), to: v3(opts.to || [0.5, 0, 0]),
      sag: opts.sag != null ? opts.sag : 0.0, bend: opts.bend != null ? opts.bend : 0.12,
      floorY: opts.floorY != null ? opts.floorY : null
    };
    var g = new THREE.Group(), parts = {};
    var base = new THREE.Color(st.color), hot = new THREE.Color("#ff7a2a");
    var insMat = std(st.color, 0.5, 0, { emissive: new THREE.Color(0xff5a14), emissiveIntensity: 0 });
    var ins = new THREE.Mesh(new THREE.BufferGeometry(), insMat); g.add(ins);
    parts.insulation = tagPart(ins, "insulation");
    var clipA = createClip(st.color), clipB = createClip(st.color);
    var sc = thick ? 1.15 : 0.9; clipA.scale.setScalar(sc); clipB.scale.setScalar(sc);
    g.add(clipA); g.add(clipB);
    parts.clipA = tagPart(clipA, "clipA"); parts.clipB = tagPart(clipB, "clipB");
    var ferMat = std("#c98a4b", 0.35, 0.6);
    var ferA = mesh(new THREE.CylinderGeometry(st.r * 1.15, st.r * 1.3, 0.025, 10), ferMat), ferB = ferA.clone(); g.add(ferA); g.add(ferB);
    var heat = shimmer([new V3(), new V3(), new V3(), new V3(), new V3()], thick ? 0.08 : 0.06, 0.18); g.add(heat);
    var curve = null;
    function path() {
      var a = st.from, b = st.to, side = new V3().subVectors(b, a).cross(_up).normalize(), pts = [];
      if (side.lengthSq() < 1e-6) side.set(0, 0, 1);
      for (var i = 0; i <= 8; i++) {
        var t = i / 8, p = new V3().lerpVectors(a, b, t);
        p.y -= st.sag * 4 * t * (1 - t);
        p.addScaledVector(side, st.bend * Math.sin(TAU * t) * 0.5 * (1 - Math.abs(0.5 - t)));
        if (st.floorY != null) p.y = Math.max(p.y, st.floorY + st.r);
        pts.push(p);
      }
      return pts;
    }
    function orientClip(clip, fer, u) {
      var p = curve.getPoint(u), tan = curve.getTangent(u).normalize();
      if (u === 0) tan.negate();                      // outwards, away from the cable
      var q = new THREE.Quaternion().setFromUnitVectors(new V3(1, 0, 0), tan);
      clip.quaternion.copy(q);
      clip.position.copy(p).addScaledVector(tan, 0.095 * clip.scale.x);
      if (st.floorY != null) clip.position.y = Math.max(clip.position.y, st.floorY + 0.012 * clip.scale.x);
      fer.position.copy(p).addScaledVector(tan, 0.006);
      fer.quaternion.setFromUnitVectors(_up, tan);
    }
    function rebuild() {
      var pts = path();
      curve = new THREE.CatmullRomCurve3(pts);
      ins.geometry.dispose();
      ins.geometry = new THREE.TubeGeometry(curve, thick ? 48 : 40, st.r, thick ? 10 : 7, false);
      orientClip(clipA, ferA, 0); orientClip(clipB, ferB, 1);
      heat.userData.setBases([0.15, 0.32, 0.5, 0.68, 0.85].map(function (u) { var p = curve.getPoint(u); p.y += st.r + 0.01; return p; }));
    }
    function reading() {
      var R = model.wireR(st.rho, st.L, st.d_mm), P = st.I * st.I * R;
      return { gauge: st.gauge, d_mm: st.d_mm, L_m: st.L, rho: st.rho, R_ohm: R, I: st.I, P_W: P, heat: st.heat };
    }
    function update(dt, t) {
      st.heatShown = damp(st.heatShown, st.heat, 2.5, dt || 0.016);
      insMat.color.copy(base).lerp(hot, st.heatShown * 0.55);
      insMat.emissiveIntensity = st.heatShown * 0.45;
      heat.userData.update(dt, t || 0, st.heatShown);
    }
    function setState(o) {
      o = o || {};
      if (o.from) st.from = v3(o.from); if (o.to) st.to = v3(o.to);
      ["sag", "bend", "floorY", "d_mm", "rho", "heatRef"].forEach(function (k) { if (o[k] !== undefined) st[k] = o[k]; });
      if (o.length_m != null) st.L = o.length_m;
      if (o.heat != null) { st.heat = clamp(o.heat, 0, 1); st.auto = false; }
      if (o.I != null) g.setCurrent(o.I);
      if (o.from || o.to || o.sag != null || o.bend != null || o.floorY !== undefined) rebuild();
    }
    g.setEnds = function (a, b, o) { o = o || {}; o.from = a; o.to = b; setState(o); };
    g.setHeat = function (h) { st.heat = clamp(h, 0, 1); st.auto = false; };
    /* heat follows the model: P per metre = I^2 R / L, heat = 1 - exp(-P/L / heatRef) */
    g.setCurrent = function (I) { st.I = I; var r = reading(); st.heat = 1 - Math.exp(-(r.P_W / st.L) / st.heatRef); st.auto = true; return reading(); };
    g.setClipOpen = function (a) { clipA.userData.setOpen(a); clipB.userData.setOpen(a); };
    g.curve = function () { return curve; };
    g.reading = reading; g.pickPart = pickPartFrom(g);
    rebuild();
    return attachCompat(g, parts, update, setState);
  }
  /* a red + black pair laid side by side */
  function createJumperSet(opts) {
    opts = opts || {};
    var g = new THREE.Group(), parts = {};
    var gap = opts.gap != null ? opts.gap : ((opts.gauge === "thick") ? 0.045 : 0.03);
    var from = v3(opts.from || [-0.5, 0, 0]), to = v3(opts.to || [0.5, 0, 0]);
    var side = new V3().subVectors(to, from).cross(_up).normalize();
    function mk(color, s, key, bend) {
      var o = {}; for (var k in opts) o[k] = opts[k];
      o.color = color; o.from = from.clone().addScaledVector(side, s * gap); o.to = to.clone().addScaledVector(side, s * gap);
      o.bend = bend;
      var c = createJumperCable(o); g.add(c); parts[key] = tagPart(c, key);
      return c;
    }
    var bend = opts.bend != null ? opts.bend : 0.12;
    var red = mk("#c62828", 1, "red", bend), black = mk("#1e1e1e", -1, "black", bend * 0.8);
    parts.insulation = red.parts.insulation; parts.clips = red.parts.clipA;
    function update(dt, t) { red.update(dt, t); black.update(dt, t); }
    function setState(o) { red.setState(o); black.setState(o); }
    g.setHeat = function (h) { red.setHeat(h); black.setHeat(h); };
    g.setCurrent = function (I) { black.setCurrent(I); return red.setCurrent(I); };
    g.reading = function () { return red.reading(); };
    g.red = red; g.black = black; g.pickPart = pickPartFrom(g);
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ FILAMENT BULB (B22 bayonet, 12 V) */
  function createBulb(opts) {
    opts = opts || {};
    var st = { V_rated: opts.V_rated || 12, P_rated: opts.P_rated || 15, V: opts.V != null ? opts.V : 0, glow: 0, glowShown: 0, manual: null };
    var g = new THREE.Group(), parts = {};
    var y0 = 0;
    if (opts.holder !== false) {           // white batten lamp-holder on a round block
      var bak = std("#efeee9", 0.45);
      var block = lathe([[0, 0], [0.042, 0], [0.044, 0.004], [0.044, 0.016], [0.04, 0.02], [0.022, 0.024], [0.02, 0.05], [0.0175, 0.052], [0, 0.052]], 28, bak);
      g.add(block); parts.holder = tagPart(block, "holder");
      [-1, 1].forEach(function (s) { var sc = lathe([[0, 0], [0.004, 0], [0.004, 0.002], [0, 0.0025]], 8, std("#9aa0a6", 0.3, 0.7)); sc.position.set(s * 0.03, 0.02, 0); g.add(sc); });
      y0 = 0.046;
    }
    var bulb = new THREE.Group(); bulb.position.y = y0; g.add(bulb);
    // B22 cap: brass skirt, two bayonet pins, black glass insulator, two solder contacts
    var brass = std("#c9a54a", 0.32, 0.65);
    var cap = lathe([[0.0118, 0], [0.0125, 0.002], [0.0125, 0.024], [0.0132, 0.026], [0.0118, 0.028]], 24, brass); bulb.add(cap);
    var ins = lathe([[0, -0.003], [0.009, -0.003], [0.0115, 0], [0.0115, 0.001]], 20, std("#161616", 0.4)); bulb.add(ins);
    [-1, 1].forEach(function (s) {
      var pin = mesh(new THREE.CylinderGeometry(0.0019, 0.0019, 0.006, 8), brass, s * 0.0145, 0.008, 0); pin.rotation.z = Math.PI / 2; bulb.add(pin);
      var dot = mesh(new THREE.SphereGeometry(0.0022, 8, 6), std("#c8c8c8", 0.3, 0.8), s * 0.0045, -0.003, 0); dot.scale.y = 0.5; bulb.add(dot);
    });
    parts.cap = tagPart(cap, "cap");
    // A60 pear envelope (lathe, thin glass)
    var prof = [], n = 26;
    for (var i = 0; i <= n; i++) {
      var t = i / n, y = 0.027 + t * 0.078, r;
      if (y < 0.042) r = 0.0128 + (y - 0.027) * 0.15;
      else { var cy = 0.075, R = 0.030, dy = (y - cy) / R; r = dy >= 1 ? 0 : Math.sqrt(Math.max(0, 1 - dy * dy)) * R; if (y < cy) r = Math.max(r, 0.015 + (y - 0.042) * 0.55); r = Math.min(r, R); }
      prof.push([r, y]);
    }
    prof.push([0, 0.105]);
    var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, metalness: 0, transmission: 0, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide, emissive: new THREE.Color(0xffc46b), emissiveIntensity: 0 });
    var env = lathe(prof, 32, glassMat); env.renderOrder = 2; bulb.add(env);
    parts.envelope = tagPart(env, "envelope");
    // glass stem (flare), lead-in wires, support hooks and the coiled filament
    var stemMat = new THREE.MeshPhysicalMaterial({ color: 0xdfeaf0, roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false });
    var stem = lathe([[0.0085, 0.028], [0.006, 0.036], [0.0028, 0.05], [0.0028, 0.062], [0.0045, 0.064], [0, 0.065]], 16, stemMat); bulb.add(stem);
    var wireMat = std("#b8bcc2", 0.35, 0.7);
    var fA = new V3(-0.011, 0.079, 0), fB = new V3(0.011, 0.079, 0);
    [[[-0.003, 0.032, 0], [-0.006, 0.055, 0], [-0.0095, 0.072, 0], fA], [[0.003, 0.032, 0], [0.006, 0.055, 0], [0.0095, 0.072, 0], fB]].forEach(function (pp) {
      bulb.add(new THREE.Mesh(tubeGeo(pp, 0.00045, 14, 4), wireMat));
    });
    var sup = new THREE.Mesh(tubeGeo([[0, 0.064, 0], [0, 0.074, 0], [0, 0.0835, 0.0005]], 0.0004, 8, 4), wireMat); bulb.add(sup);
    // coiled filament: a helix wound along a shallow arc from fA to fB
    var arc = new THREE.QuadraticBezierCurve3(fA, new V3(0, 0.088, 0), fB), fp = [], turns = 26, N = 220;
    for (i = 0; i <= N; i++) {
      var u = i / N, p = arc.getPoint(u), tg = arc.getTangent(u).normalize();
      var nrm = new V3(0, 0, 1), bin = new V3().crossVectors(tg, nrm).normalize(), a = u * turns * TAU;
      fp.push(p.clone().addScaledVector(nrm, Math.cos(a) * 0.0011).addScaledVector(bin, Math.sin(a) * 0.0011));
    }
    var filMat = std("#3a3430", 0.5, 0.3, { emissive: new THREE.Color(0xff6a00), emissiveIntensity: 0 });
    var fil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fp), N, 0.00028, 4, false), filMat); bulb.add(fil);
    parts.filament = tagPart(fil, "filament");
    var halo = glowSprite(0xffc46b, 0.26); halo.position.y = y0 + 0.08; g.add(halo);
    var core = glowSprite(0xfff1c8, 0.07); core.position.y = y0 + 0.081; g.add(core);
    var cDim = new THREE.Color(0xff3a00), cHot = new THREE.Color(0xffe2a0);
    function reading() { var o = model.lamp(st.V, st.V_rated, st.P_rated); o.V_rated = st.V_rated; o.P_rated = st.P_rated; return o; }
    function target() { return st.manual != null ? st.manual : Math.min(1, reading().glow); }
    function update(dt) {
      st.glowShown = damp(st.glowShown, target(), 8, dt || 0.016);
      var k = st.glowShown;
      filMat.emissive.copy(cDim).lerp(cHot, smooth(0.15, 0.9, k));
      filMat.emissiveIntensity = k * 3.2;
      glassMat.emissiveIntensity = k * 0.5;
      halo.material.opacity = k * 0.85; core.material.opacity = Math.min(1, k * 1.4);
    }
    function setState(o) {
      o = o || {};
      if (o.V != null) { st.V = o.V; st.manual = null; }
      if (o.V_rated != null) st.V_rated = o.V_rated; if (o.P_rated != null) st.P_rated = o.P_rated;
      if (o.glow != null) st.manual = clamp(o.glow, 0, 1);
    }
    g.setVoltage = function (V) { st.V = V; st.manual = null; return reading(); };
    g.setGlow = function (k) { st.manual = k == null ? null : clamp(k, 0, 1); };
    g.reading = reading; g.pickPart = pickPartFrom(g);
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ SPOOL OF RESISTANCE WIRE */
  function createWireCoil(opts) {
    opts = opts || {};
    var st = { d_mm: opts.d_mm || 0.30, material: opts.material || "constantan" };
    st.rho = opts.rho || model.RHO[st.material] || model.RHO.constantan;
    var g = new THREE.Group(), parts = {};
    var wireCol = st.material === "copper" ? "#c8743f" : "#c4b8a6";
    var spoolMat = std(opts.spoolColor || "#1f4f8f", 0.45);
    var Rf = 0.045, Rc = 0.018, Hs = 0.05;
    var spool = lathe([[0.006, 0], [Rf, 0], [Rf, 0.004], [Rc, 0.004], [Rc, Hs - 0.004], [Rf, Hs - 0.004], [Rf, Hs], [0.006, Hs], [0.006, 0]], 40, spoolMat);
    g.add(spool); parts.spool = tagPart(spool, "spool");
    var wound = canvasTex(64, 256, function (c, w, h) {
      c.fillStyle = wireCol; c.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 3) { c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(0, y, w, 1); c.fillStyle = "rgba(0,0,0,0.28)"; c.fillRect(0, y + 2, w, 1); }
    });
    wound.wrapS = wound.wrapT = THREE.RepeatWrapping; wound.repeat.set(6, 1);
    var bump = canvasTex(16, 256, function (c, w, h) { for (var y = 0; y < h; y++) { var v = 128 + 120 * Math.sin(y / 3 * TAU); c.fillStyle = "rgb(" + (v | 0) + "," + (v | 0) + "," + (v | 0) + ")"; c.fillRect(0, y, w, 1); } }, false);
    bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
    var windMat = std("#ffffff", 0.32, 0.75, { map: wound, bumpMap: bump, bumpScale: 0.6 });
    var Rw = 0.036;
    var wind = lathe([[Rw - 0.001, 0.0045], [Rw, 0.007], [Rw + 0.0006, Hs / 2], [Rw, Hs - 0.007], [Rw - 0.001, Hs - 0.0045]], 40, windMat);
    g.add(wind); parts.winding = tagPart(wind, "winding");
    // loose end: leaves the winding tangentially and curls on the table
    var endMat = std(wireCol, 0.3, 0.75);
    var tail = new THREE.Mesh(tubeGeo([[Rw, Hs * 0.6, 0], [Rw + 0.01, Hs * 0.62, 0.03], [0.07, 0.03, 0.07], [0.11, 0.004, 0.08], [0.15, 0.0025, 0.045], [0.14, 0.0025, 0.01], [0.115, 0.0025, 0.03]], 0.0012, 60, 5), endMat);
    g.add(tail); parts.wireEnd = tagPart(tail, "wireEnd");
    var lbl = canvasTex(256, 256, function (c, w, h) {
      c.fillStyle = "#f4efe2"; c.beginPath(); c.arc(128, 128, 126, 0, TAU); c.fill();
      c.fillStyle = "#1f4f8f"; c.beginPath(); c.arc(128, 128, 30, 0, TAU); c.fill();
      c.fillStyle = "#1b1b1b"; c.textAlign = "center"; c.font = "800 34px system-ui, sans-serif";
      c.fillText(st.material.toUpperCase(), 128, 74);
      c.font = "700 40px system-ui, sans-serif"; c.fillText(st.d_mm.toFixed(2) + " mm", 128, 206);
    });
    var top = mesh(new THREE.CircleGeometry(Rf - 0.002, 40), std("#ffffff", 0.6, 0, { map: lbl }), 0, Hs + 0.0005, 0);
    top.rotation.x = -Math.PI / 2; g.add(top); parts.label = tagPart(top, "label");
    function reading() { var R1 = model.wireR(st.rho, 1, st.d_mm); return { material: st.material, d_mm: st.d_mm, rho: st.rho, R_per_m: R1, R_40cm: R1 * 0.4 }; }
    g.reading = reading; g.pickPart = pickPartFrom(g);
    return attachCompat(g, parts, function () {}, function () {});
  }

  /* ================================================================ DIGITAL MULTIMETER */
  function createMultimeter(opts) {
    opts = opts || {};
    var st = { mode: opts.mode || "V", unit: opts.unit || "V", value: opts.value != null ? opts.value : null, decimals: opts.decimals != null ? opts.decimals : 1, source: null, last: "" };
    var g = new THREE.Group(), parts = {};
    var tilt = new THREE.Group(); tilt.rotation.x = -0.32; tilt.position.set(0, 0.0, 0); g.add(tilt);
    var W = 0.085, H = 0.17, D = 0.034;
    var holster = rbox(W + 0.012, H + 0.012, D, 0.01, std(opts.color || "#f2b51d", 0.6), 3); holster.position.y = H / 2 + 0.006; tilt.add(holster);
    var faceTex = canvasTex(256, 512, function (c, w, h) {
      c.fillStyle = "#2a2e33"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#3a4047"; c.fillRect(10, 10, w - 20, 170);
      // rotary dial ring markings
      var cx = w / 2, cy = 318; c.strokeStyle = "#e9edf1"; c.fillStyle = "#e9edf1"; c.lineWidth = 3;
      var labels = ["OFF", "V⎓", "V~", "Ω", "•))", "A", "mA"];
      for (var i = 0; i < labels.length; i++) {
        var a = -Math.PI * 0.85 + i * (Math.PI * 1.7 / (labels.length - 1)) - Math.PI / 2;
        c.beginPath(); c.moveTo(cx + Math.cos(a) * 74, cy + Math.sin(a) * 74); c.lineTo(cx + Math.cos(a) * 86, cy + Math.sin(a) * 86); c.stroke();
        c.font = "700 20px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(labels[i], cx + Math.cos(a) * 106, cy + Math.sin(a) * 106);
      }
      // jack labels
      c.font = "700 18px system-ui, sans-serif"; ["10A", "COM", "VΩ"].forEach(function (s, i) { c.fillStyle = i === 2 ? "#ff6b6b" : "#e9edf1"; c.fillText(s, 52 + i * 76, 482); });
    });
    var face = rbox(W, H, D + 0.004, 0.008, [std("#2a2e33", 0.5), std("#2a2e33", 0.5), std("#2a2e33", 0.5), std("#2a2e33", 0.5), std("#ffffff", 0.55, 0, { map: faceTex }), std("#2a2e33", 0.5)], 2);
    face.position.y = H / 2 + 0.006; tilt.add(face);
    parts.body = tagPart(holster, "body"); tagPart(face, "body");
    // LCD
    var lcdCan = document.createElement("canvas"); lcdCan.width = 256; lcdCan.height = 128;
    var lcdTex = srgb(new THREE.CanvasTexture(lcdCan));
    var lcd = mesh(new THREE.PlaneGeometry(0.066, 0.033), new THREE.MeshBasicMaterial({ map: lcdTex, toneMapped: false }), 0, 0.006 + H - 0.03, D / 2 + 0.0026);
    tilt.add(lcd); parts.display = tagPart(lcd, "display");
    // rotary knob
    var knob = new THREE.Group(); knob.position.set(0, 0.006 + H - 0.104, D / 2 + 0.002);
    var kb = lathe([[0, 0], [0.019, 0], [0.019, 0.006], [0.016, 0.009], [0, 0.009]], 28, std("#1b1d20", 0.45)); kb.rotation.x = Math.PI / 2; knob.add(kb);
    var ridge = rbox(0.034, 0.008, 0.008, 0.003, std("#26292d", 0.4), 1); ridge.position.z = 0.012; knob.add(ridge);
    var tick = mesh(new THREE.BoxGeometry(0.003, 0.012, 0.002), std("#ffffff", 0.4), 0, 0.009, 0.0165); knob.add(tick);
    tilt.add(knob); parts.dial = tagPart(knob, "dial");
    // three input jacks
    var jacks = [];
    for (var j = 0; j < 3; j++) {
      var jk = lathe([[0.0035, 0], [0.0062, 0], [0.0062, 0.005], [0.0035, 0.005], [0.0035, 0.002], [0, 0.002]], 16, std(j === 2 ? "#b71c1c" : "#141414", 0.4));
      jk.rotation.x = Math.PI / 2; jk.position.set(-0.026 + j * 0.026, 0.006 + 0.024, D / 2 + 0.0005); tilt.add(jk); jacks.push(jk);
    }
    parts.jacks = tagPart(jacks[1], "jacks"); tagPart(jacks[0], "jacks"); tagPart(jacks[2], "jacks");
    // tilt stand behind
    var stand = rbox(0.06, 0.1, 0.004, 0.002, std("#22262b", 0.6), 1); stand.position.set(0, 0.06, -0.035); stand.rotation.x = 0.35; g.add(stand);
    // probe leads (red from VΩ, black from COM) with pen probes
    var leadRed = new THREE.Mesh(new THREE.BufferGeometry(), std("#c62828", 0.5)), leadBlk = new THREE.Mesh(new THREE.BufferGeometry(), std("#1e1e1e", 0.5));
    g.add(leadRed); g.add(leadBlk);
    function probe(col) {
      var p = new THREE.Group();
      // tip end at y = 0, finger guard just behind it, long grip, lead enters at y = 0.074
      var body = lathe([[0, 0], [0.0036, 0], [0.0036, 0.004], [0.0062, 0.006], [0.0062, 0.010], [0.0042, 0.014], [0.0048, 0.062], [0.0042, 0.071], [0, 0.074]], 14, std(col, 0.45));
      p.add(body);
      var tip = lathe([[0, -0.018], [0.0009, -0.017], [0.0011, 0], [0, 0]], 8, std("#d7dbe0", 0.25, 0.8)); p.add(tip);
      return p;
    }
    var prRed = probe("#c62828"), prBlk = probe("#1e1e1e"); g.add(prRed); g.add(prBlk);
    parts.probes = tagPart(prRed, "probes"); tagPart(prBlk, "probes"); tagPart(leadRed, "probes"); tagPart(leadBlk, "probes");
    var tips = { red: new V3(0.12, 0.004, 0.06), black: new V3(0.1, 0.004, 0.1) };
    function placeProbe(pr, tipPos) {
      // the metal tip touches tipPos; the probe leans back up towards the meter
      var lean = new V3(-tipPos.x * 0.6, 1, -tipPos.z * 0.6 + 0.1).normalize();
      if (tipPos.y < 0.02) lean.set(-tipPos.x, 0.12, -tipPos.z).normalize();   // lying on the table
      pr.quaternion.setFromUnitVectors(_up, lean);
      pr.position.copy(tipPos).addScaledVector(lean, 0.018);
      if (tipPos.y < 0.02) pr.position.y = Math.max(pr.position.y, 0.006);
      return lean;
    }
    function jackWorldLocal(jk) { g.updateMatrixWorld(true); var p = new V3(); jk.getWorldPosition(p); return g.worldToLocal(p); }
    function leadPath(jk, pr, tipPos, lean) {
      var a = jackWorldLocal(jk), back = tipPos.clone().addScaledVector(lean, 0.018 + 0.078);
      var mid = new V3().lerpVectors(a, back, 0.5); mid.y = Math.min(a.y, back.y) - 0.02;
      var a2 = a.clone().add(new V3(0, -0.01, 0.03));
      var pts = [a, a2, mid, back].map(function (p) { p.y = Math.max(p.y, 0.005); return p; });
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, 0.0022, 6, false);
    }
    function relead() {
      var lr = placeProbe(prRed, tips.red), lb = placeProbe(prBlk, tips.black);
      leadRed.geometry.dispose(); leadRed.geometry = leadPath(jacks[2], prRed, tips.red, lr);
      leadBlk.geometry.dispose(); leadBlk.geometry = leadPath(jacks[1], prBlk, tips.black, lb);
    }
    function text() {
      if (st.value == null || isNaN(st.value)) return st.mode === "OFF" ? "" : "- - . -";
      return st.value.toFixed(st.decimals);
    }
    function paintLCD(s) {
      var c = lcdCan.getContext("2d");
      c.fillStyle = "#b9c7a3"; c.fillRect(0, 0, 256, 128);
      c.fillStyle = "rgba(0,0,0,0.06)"; c.fillRect(0, 96, 256, 32);
      c.fillStyle = "#1a2214"; c.textAlign = "right"; c.textBaseline = "middle";
      c.font = "700 76px 'JetBrains Mono', ui-monospace, monospace"; c.fillText(s, 206, 62);
      c.font = "800 34px system-ui, sans-serif"; c.textAlign = "left"; c.fillText(st.mode === "OFF" ? "" : st.unit, 210, 78);
      c.font = "700 20px system-ui, sans-serif"; c.fillText(st.mode === "V" ? "DC" : "", 12, 20);
      lcdTex.needsUpdate = true;
    }
    var dialAngle = { OFF: 0.85, V: 0.567, "V~": 0.283, R: 0, A: -0.567 };
    function update() {
      if (st.source) { var v = st.source(); st.value = (v == null ? null : +v); }
      var s = text() + "|" + st.unit + st.mode;
      if (s !== st.last) { st.last = s; paintLCD(text()); }
      knob.rotation.z = (dialAngle[st.mode] != null ? dialAngle[st.mode] : 0.567) * Math.PI;
    }
    function setState(o) {
      o = o || {};
      if (o.mode) st.mode = o.mode; if (o.unit) st.unit = o.unit; if (o.decimals != null) st.decimals = o.decimals;
      if ("value" in o) { st.value = o.value; st.source = null; }
      if (o.redTip) tips.red = v3(o.redTip); if (o.blackTip) tips.black = v3(o.blackTip);
      if (o.redTip || o.blackTip) relead();
    }
    g.setValue = function (v) { st.value = v; st.source = null; update(); };
    /* fn() returns the number to display, read every frame (e.g. function () { return battery.reading().V; }) */
    g.setSource = function (fn) { st.source = fn; update(); };
    g.setProbes = function (redTip, blackTip) { setState({ redTip: redTip, blackTip: blackTip }); };
    /* touch the probes on a battery's + and - posts and display its terminal p.d. from its model */
    g.clipTo = function (battery) {
      if (!battery) { st.source = null; st.value = null; setState({ redTip: [0.12, 0.004, 0.06], blackTip: [0.1, 0.004, 0.1] }); return; }
      g.updateMatrixWorld(true); battery.updateMatrixWorld(true);
      var a = g.worldToLocal(battery.terminal(1)), b = g.worldToLocal(battery.terminal(-1));
      setState({ redTip: a, blackTip: b });
      g.setSource(function () { return battery.reading().V; });
    };
    g.reading = function () { return { mode: st.mode, unit: st.unit, value: st.value, text: text() }; };
    g.pickPart = pickPartFrom(g);
    relead(); update();
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ KEKE (auto-rickshaw tricycle)
     Length along x (nose at +x), width along z, wheels on y = 0. About 2.7 m long, 1.3 m wide, 1.8 m tall.
     Body tub = extruded side profile (wheel arches cut into it) whose width is
     analytically tapered from the wide passenger cabin to the narrow nose. */
  function tyreTex() {
    return canvasTex(256, 32, function (c, w, h) {
      c.fillStyle = "#222"; c.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 8) { c.fillStyle = "#0c0c0c"; c.fillRect(x, 0, 3, h); }
    });
  }
  function createWheel(tex, rimCol) {
    var w = new THREE.Group();
    var tyre = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.06, 12, 36), std("#ffffff", 0.9, 0, { map: tex, bumpMap: tex, bumpScale: 0.8 }));
    w.add(tyre);
    var rim = lathe([[0, 0.034], [0.03, 0.034], [0.045, 0.024], [0.088, 0.018], [0.098, 0.034], [0.104, 0.04], [0.104, -0.04], [0.098, -0.034], [0.088, -0.026], [0.045, -0.02], [0, -0.02]], 28, std(rimCol || "#c3c7cc", 0.35, 0.6, { side: THREE.DoubleSide }));
    rim.rotation.x = Math.PI / 2; w.add(rim);
    var hub = lathe([[0, 0.05], [0.022, 0.05], [0.026, 0.04], [0.026, 0.03], [0.03, 0.03]], 18, std("#8a8f96", 0.35, 0.6)); hub.rotation.x = Math.PI / 2; w.add(hub);
    for (var i = 0; i < 4; i++) {
      var a = i / 4 * TAU, nut = mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.012, 6), std("#d0d4d9", 0.3, 0.7), Math.cos(a) * 0.038, Math.sin(a) * 0.038, 0.038);
      nut.rotation.x = Math.PI / 2; w.add(nut);
    }
    return w;
  }
  function kekeSideTex(paint, stripe) {
    var t = canvasTex(1024, 440, function (c, w, h) {
      function X(x) { return (x + 1.4) / 2.8 * w; } function Y(y) { return (1 - y / 1.2) * h; }
      c.fillStyle = paint; c.fillRect(0, 0, w, h);
      c.fillStyle = stripe; c.fillRect(0, Y(0.60), w, Y(0.50) - Y(0.60));
      c.fillStyle = "#111"; c.fillRect(0, Y(0.585), w, 3); c.fillRect(0, Y(0.515), w, 3);
      c.fillStyle = "#1b1b1b"; c.fillRect(0, Y(0.37), w, Y(0.28) - Y(0.37));
      c.fillStyle = "rgba(0,0,0,0.22)"; c.fillRect(X(-0.42), Y(0.70), 2, Y(0.38) - Y(0.70));    // body seam
      c.fillStyle = "#111"; c.font = "800 34px system-ui, sans-serif"; c.textAlign = "center"; c.fillText("AB 214", X(1.0), Y(0.70));
    });
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(1 / 2.8, 1 / 1.2); t.offset.set(0.5, 0);
    return t;
  }
  function vinylTex(col, vertical) {
    var t = canvasTex(128, 128, function (c, w, h) {
      c.fillStyle = col; c.fillRect(0, 0, w, h);
      for (var i = 16; i < (vertical ? w : h); i += 32) {
        c.fillStyle = "rgba(0,0,0,0.45)"; if (vertical) c.fillRect(i, 0, 3, h); else c.fillRect(0, i, w, 3);
        c.fillStyle = "rgba(255,255,255,0.12)"; if (vertical) c.fillRect(i + 4, 0, 2, h); else c.fillRect(0, i + 4, w, 2);
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function createKeke(opts) {
    opts = opts || {};
    var st = { lamp: opts.lamp != null ? opts.lamp : 1, lampShown: 0, lampSource: null, box: opts.boxOpen || 0, boxShown: 0, wheelSpeed: 0, wheelAngle: 0 };
    var g = new THREE.Group(), parts = {};
    var paintCol = opts.color || "#f2b705", stripeCol = opts.stripe || "#1e7d3a";
    var steel = std("#2b2f34", 0.45, 0.4), chrome = std("#d5d9de", 0.25, 0.75), rubber = std("#141414", 0.8);

    /* ---- body tub ---- */
    var P = [];
    function arch(cx, cy, R, yl) {
      var dy = yl - cy, dx = Math.sqrt(R * R - dy * dy), a0 = Math.atan2(dy, -dx), a1 = Math.atan2(dy, dx);
      for (var i = 0; i <= 14; i++) { var a = a0 + (a1 - a0) * i / 14; P.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
    }
    P.push([-1.30, 0.38], [-1.28, 0.36]);
    arch(-0.80, 0.215, 0.27, 0.36);
    P.push([-0.50, 0.36], [-0.44, 0.30], [0.72, 0.30]);
    arch(1.02, 0.215, 0.255, 0.30);
    var nose = [[1.30, 0.34], [1.33, 0.46], [1.338, 0.60], [1.325, 0.76], [1.29, 0.90], [1.22, 1.00], [1.12, 1.07], [1.00, 1.09]];
    var dash = [[0.90, 1.07], [0.82, 0.98], [0.76, 0.80], [0.71, 0.58], [0.66, 0.44], [0.60, 0.42]];
    var rear = [[-0.36, 0.42], [-0.40, 0.62], [-1.02, 0.64], [-1.08, 0.72], [-1.12, 0.92], [-1.18, 0.975], [-1.30, 0.98], [-1.335, 0.95], [-1.345, 0.80], [-1.34, 0.55]];
    var shape = new THREE.Shape(); shape.moveTo(P[0][0], P[0][1]);
    for (var i = 1; i < P.length; i++) shape.lineTo(P[i][0], P[i][1]);
    shape.splineThru(nose.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
    dash.concat(rear).forEach(function (p) { shape.lineTo(p[0], p[1]); });
    var tubGeo = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.02, bevelSegments: 2, curveSegments: 10 });
    tubGeo.translate(0, 0, -1);
    function hw(x) { return 0.60 - 0.25 * smooth(0.40, 1.15, x) - 0.07 * smooth(1.10, 1.36, x); }
    var tp = tubGeo.attributes.position;
    for (i = 0; i < tp.count; i++) tp.setZ(i, tp.getZ(i) * hw(tp.getX(i)));
    tubGeo.computeVertexNormals();
    var paint = std(paintCol, 0.38, 0.1);
    var sideMat = std("#ffffff", 0.38, 0.1, { map: kekeSideTex(paintCol, stripeCol) });
    var tub = new THREE.Mesh(tubGeo, [sideMat, paint]); g.add(tub);
    parts.body = tagPart(tub, "body");
    // rubber floor mat
    var matTex = vinylTex("#1d1d1d", true); matTex.repeat.set(8, 1);
    var floorMat = mesh(new THREE.PlaneGeometry(0.98, 1.1), std("#ffffff", 0.9, 0, { map: matTex }), 0.13, 0.4215, 0); floorMat.rotation.x = -Math.PI / 2; g.add(floorMat);

    /* ---- wheels ---- */
    var tTex = tyreTex(); tTex.wrapS = THREE.RepeatWrapping; tTex.repeat.set(6, 1);
    var fw = createWheel(tTex); fw.position.set(1.02, 0.215, 0); g.add(fw);
    var rwL = createWheel(tTex), rwR = createWheel(tTex);
    rwL.position.set(-0.80, 0.215, 0.52); rwR.position.set(-0.80, 0.215, -0.52); rwR.rotation.y = Math.PI;
    g.add(rwL); g.add(rwR);
    parts.frontWheel = tagPart(fw, "frontWheel"); tagPart(rwL, "rearWheels"); tagPart(rwR, "rearWheels"); parts.rearWheels = rwL;
    // front fork with spring
    [-1, 1].forEach(function (s) {
      var leg = new THREE.Mesh(tubeGeo([[1.13, 0.62, s * 0.085], [1.10, 0.45, s * 0.085], [1.02, 0.215, s * 0.085]], 0.016, 12, 8), chrome); g.add(leg);
      var spr = new THREE.Mesh(tubeGeo(helixPts(0.024, 0.016, 7, 84, 0).map(function (p) { return new V3(1.115 + p.x * 0.6, 0.47 + p.z, s * 0.085 + p.y); }), 0.0035, 84, 5), std("#b71c1c", 0.4, 0.3));
      g.add(spr);
    });
    // exhaust with silencer
    var exh = new THREE.Mesh(tubeGeo([[-0.40, 0.33, -0.36], [-0.70, 0.29, -0.40], [-1.10, 0.27, -0.42], [-1.30, 0.28, -0.42]], 0.02, 20, 8), std("#5b5f66", 0.5, 0.5)); g.add(exh);
    var sil = lathe([[0, 0], [0.04, 0.0], [0.045, 0.03], [0.045, 0.22], [0.035, 0.25], [0.02, 0.26], [0.02, 0.29], [0, 0.29]], 18, std("#7a7f86", 0.4, 0.55));
    sil.rotation.z = Math.PI / 2; sil.position.set(-1.12, 0.29, -0.42); g.add(sil);

    /* ---- seats + battery box ---- */
    var vin = std("#ffffff", 0.55, 0, { map: vinylTex(opts.seatColor || "#6d1b1b", false) });
    var pCush = rbox(0.56, 0.11, 1.10, 0.04, vin, 3); pCush.position.set(-0.72, 0.695, 0); g.add(pCush);
    var pBack = rbox(0.11, 0.44, 1.10, 0.04, vin, 3); pBack.position.set(-1.07, 0.95, 0); pBack.rotation.z = 0.14; g.add(pBack);
    var pSeat = new THREE.Group(); pSeat.add(pCush); pSeat.add(pBack); g.add(pSeat);
    parts.passengerSeat = tagPart(pSeat, "passengerSeat");
    var boxMat = std("#26292e", 0.55, 0.15);
    var bx = 0.24, bw = 0.40, bd = 0.42, by0 = 0.42, bh = 0.30, th = 0.014;
    var box = new THREE.Group(); g.add(box);
    var bTop = rbox(bw, th, bd, 0.005, boxMat, 1); bTop.position.set(bx, by0 + bh - th / 2, 0); box.add(bTop);
    var bBack = rbox(bw, bh, th, 0.005, boxMat, 1); bBack.position.set(bx, by0 + bh / 2, -bd / 2 + th / 2); box.add(bBack);
    [-1, 1].forEach(function (s) { var e = rbox(th, bh, bd, 0.005, boxMat, 1); e.position.set(bx + s * (bw / 2 - th / 2), by0 + bh / 2, 0); box.add(e); });
    var inner = mesh(new THREE.PlaneGeometry(bw - 2 * th, bd - th), std("#121417", 0.9), bx, by0 + 0.002, 0); inner.rotation.x = -Math.PI / 2; box.add(inner);
    parts.batteryBox = tagPart(box, "batteryBox");
    var lidPivot = new THREE.Group(); lidPivot.position.set(bx, by0 + 0.005, bd / 2); g.add(lidPivot);
    var lid = rbox(bw + 0.004, bh - 0.004, th, 0.006, std(paintCol, 0.4, 0.1), 1); lid.position.set(0, (bh - 0.004) / 2, 0); lidPivot.add(lid);
    for (i = 0; i < 4; i++) { var lv = rbox(0.22, 0.012, 0.008, 0.003, std("#1b1b1b", 0.6), 1); lv.position.set(-0.02, 0.07 + i * 0.03, 0.009); lidPivot.add(lv); }
    var latch = mesh(new THREE.BoxGeometry(0.05, 0.02, 0.012), chrome, 0.12, bh - 0.04, 0.012); lidPivot.add(latch);
    parts.batteryLid = tagPart(lidPivot, "batteryLid");
    var kbat = createBattery(opts.battery || { E: 12.0, r: 1.2, corrosion: 0.6 });
    kbat.position.set(bx, by0 + 0.005, 0.03); g.add(kbat);
    parts.battery = tagPart(kbat, "battery");
    var dSeat = rbox(0.42, 0.09, 0.40, 0.035, vin, 3); dSeat.position.set(bx - 0.02, by0 + bh + 0.045, 0); g.add(dSeat);
    parts.driverSeat = tagPart(dSeat, "driverSeat");

    /* ---- windscreen ---- */
    var ws = new THREE.PlaneGeometry(1, 1, 10, 4), wp = ws.attributes.position;
    function wsPt(u, s) { var w = u * 2; return new V3(1.04 + (0.90 - 1.04) * s - 0.07 * w * w, 1.09 + 0.61 * s, w * (0.36 + 0.19 * s)); }
    for (i = 0; i < wp.count; i++) { var q = wsPt(wp.getX(i), wp.getY(i) + 0.5); wp.setXYZ(i, q.x, q.y, q.z); }
    ws.computeVertexNormals();
    var glass = new THREE.MeshPhysicalMaterial({ color: 0xbfd9e8, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
    var wsm = new THREE.Mesh(ws, glass); wsm.renderOrder = 3; g.add(wsm);
    parts.windscreen = tagPart(wsm, "windscreen");
    function edge(fn) { var pts = []; for (var k = 0; k <= 10; k++) pts.push(fn(k / 10)); return pts; }
    var frame = new THREE.Group();
    [edge(function (s) { return wsPt(-0.5, s); }), edge(function (s) { return wsPt(0.5, s); }), edge(function (u) { return wsPt(u - 0.5, 1); }), edge(function (u) { return wsPt(u - 0.5, 0); })].forEach(function (pts, k) {
      frame.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, k < 2 ? 0.016 : 0.012, 6, false), k < 2 ? steel : rubber));
    });
    g.add(frame); tagPart(frame, "windscreen");
    // wiper
    var wiper = new THREE.Mesh(tubeGeo([wsPt(0.0, 0.03), wsPt(-0.22, 0.42)], 0.005, 4, 4), rubber); g.add(wiper);

    /* ---- canopy: rexine roof, fringe, rolled side curtains, rear panel ---- */
    var rexTex = canvasTex(256, 256, function (c, w, h) {
      c.fillStyle = opts.canopyColor || "#1c1d20"; c.fillRect(0, 0, w, h);
      var R = rng(3); for (var k = 0; k < 900; k++) { c.fillStyle = "rgba(255,255,255," + (R() * 0.05) + ")"; c.fillRect(R() * w, R() * h, 2, 2); }
      c.strokeStyle = "rgba(255,255,255,0.18)"; c.setLineDash([6, 5]); c.lineWidth = 2;
      [64, 192].forEach(function (y) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); });
    });
    var rex = std("#ffffff", 0.75, 0, { map: rexTex, side: THREE.DoubleSide });
    var roofG = new THREE.PlaneGeometry(2.32, 1.36, 22, 12); roofG.rotateX(-Math.PI / 2);
    var rp = roofG.attributes.position;
    for (i = 0; i < rp.count; i++) {
      var x = rp.getX(i) - 0.21, z = rp.getZ(i), az = Math.abs(z);
      var y = 1.74 + 0.06 * (1 - Math.pow(z / 0.68, 2)) - 0.035 * smooth(0.70, 0.95, x) - 0.02 * smooth(-1.1, -1.37, x);
      if (az > 0.6) y -= (az - 0.6) * 1.1;
      rp.setXYZ(i, x, y, z);
    }
    roofG.computeVertexNormals();
    var roof = new THREE.Mesh(roofG, rex); g.add(roof);
    var canopy = new THREE.Group(); g.add(canopy); canopy.add(roof);
    var fringeMat = std(stripeCol, 0.6, 0, { side: THREE.DoubleSide });
    [-1, 1].forEach(function (s) {
      var fr = mesh(new THREE.PlaneGeometry(2.28, 0.09), fringeMat, -0.21, 1.665, s * 0.682); canopy.add(fr);
      var curtain = new THREE.Mesh(tubeGeo([[-1.22, 1.615, s * 0.655], [-0.4, 1.60, s * 0.665], [0.5, 1.61, s * 0.66], [0.78, 1.62, s * 0.65]], 0.034, 24, 10), std("#3a3328", 0.8)); canopy.add(curtain);
      for (var k = 0; k < 3; k++) { var tie = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.006, 6, 14), rubber); tie.rotation.y = Math.PI / 2; tie.position.set(-0.9 + k * 0.7, 1.612, s * 0.66); canopy.add(tie); }
    });
    var valance = mesh(new THREE.PlaneGeometry(1.12, 0.07), fringeMat, 0.935, 1.705, 0); valance.rotation.y = Math.PI / 2; valance.rotation.x = 0; canopy.add(valance);
    var rpShape = new THREE.Shape(); rpShape.moveTo(-0.6, 0.98); rpShape.lineTo(0.6, 0.98); rpShape.lineTo(0.64, 1.70); rpShape.quadraticCurveTo(0, 1.80, -0.64, 1.70); rpShape.lineTo(-0.6, 0.98);
    var hole = new THREE.Path(); hole.moveTo(-0.34, 1.42); hole.lineTo(0.34, 1.42); hole.lineTo(0.34, 1.64); hole.lineTo(-0.34, 1.64); hole.lineTo(-0.34, 1.42); rpShape.holes.push(hole);
    var rpanel = new THREE.Mesh(new THREE.ShapeGeometry(rpShape, 8), rex); rpanel.rotation.y = Math.PI / 2; rpanel.position.x = -1.335; canopy.add(rpanel);
    var rwin = mesh(new THREE.PlaneGeometry(0.68, 0.22), new THREE.MeshPhysicalMaterial({ color: 0x223040, roughness: 0.1, transparent: true, opacity: 0.6, side: THREE.DoubleSide }), -1.333, 1.53, 0);
    rwin.rotation.y = Math.PI / 2; canopy.add(rwin);
    parts.canopy = tagPart(canopy, "canopy");
    // pillars and passenger grab bar (steel tube)
    var frameG = new THREE.Group(); g.add(frameG);
    [-1, 1].forEach(function (s) {
      frameG.add(new THREE.Mesh(tubeGeo([[-0.36, 0.64, s * 0.585], [-0.37, 1.20, s * 0.615], [-0.36, 1.74, s * 0.635]], 0.017, 16, 8), steel));
      frameG.add(new THREE.Mesh(tubeGeo([[-1.30, 0.98, s * 0.585], [-1.31, 1.40, s * 0.62], [-1.30, 1.71, s * 0.635]], 0.017, 12, 8), steel));
    });
    frameG.add(new THREE.Mesh(tubeGeo([[-0.355, 1.15, -0.60], [-0.31, 1.16, -0.3], [-0.30, 1.16, 0.3], [-0.355, 1.15, 0.60]], 0.015, 18, 8), chrome));
    tagPart(frameG, "canopy");

    /* ---- handlebar, speedometer, mirrors ---- */
    var hb = new THREE.Group(); g.add(hb);
    hb.add(new THREE.Mesh(tubeGeo([[0.98, 0.78, 0], [0.92, 0.98, 0], [0.86, 1.08, 0]], 0.022, 10, 10), steel));
    hb.add(new THREE.Mesh(tubeGeo([[0.74, 1.12, -0.36], [0.82, 1.14, -0.24], [0.865, 1.135, -0.08], [0.865, 1.135, 0.08], [0.82, 1.14, 0.24], [0.74, 1.12, 0.36]], 0.012, 30, 8), chrome));
    [-1, 1].forEach(function (s) {
      var grip = lathe([[0.0, 0], [0.019, 0.0], [0.019, 0.01], [0.017, 0.02], [0.018, 0.11], [0.02, 0.12], [0, 0.125]], 14, rubber);
      grip.position.set(0.765, 1.125, s * 0.32); grip.quaternion.setFromUnitVectors(_up, new V3(-0.55, -0.05, s * 0.83).normalize()); hb.add(grip);
      hb.add(new THREE.Mesh(tubeGeo([[0.80, 1.15, s * 0.27], [0.72, 1.13, s * 0.30], [0.68, 1.11, s * 0.36]], 0.005, 8, 4), chrome));   // brake / clutch levers
    });
    var speedo = lathe([[0, 0], [0.05, 0], [0.055, 0.01], [0.055, 0.04], [0.05, 0.045], [0, 0.045]], 20, std("#15171a", 0.5));
    speedo.position.set(0.9, 1.15, 0); speedo.quaternion.setFromUnitVectors(_up, new V3(-0.75, 0.66, 0).normalize()); hb.add(speedo);
    var dial = mesh(new THREE.CircleGeometry(0.044, 24), new THREE.MeshBasicMaterial({ color: 0xe9f0e0 }), 0, 0.0455, 0); dial.rotation.x = -Math.PI / 2; speedo.add(dial);
    parts.handlebar = tagPart(hb, "handlebar");
    [-1, 1].forEach(function (s) {
      var a = wsPt(s * 0.5, 0.55);
      hb.add(new THREE.Mesh(tubeGeo([a, a.clone().add(new V3(0.05, 0.10, s * 0.10)), a.clone().add(new V3(0.06, 0.16, s * 0.15))], 0.007, 8, 5), steel));
      var mir = mesh(new THREE.SphereGeometry(1, 14, 10), std("#121417", 0.4), a.x + 0.06, a.y + 0.2, a.z + s * 0.18); mir.scale.set(0.015, 0.05, 0.07); hb.add(mir);
      var glassM = mesh(new THREE.CircleGeometry(1, 16), std("#c5d3de", 0.05, 0.9), a.x + 0.044, a.y + 0.2, a.z + s * 0.18); glassM.scale.set(0.045, 0.062, 1); glassM.rotation.y = -Math.PI / 2; hb.add(glassM);
    });

    /* ---- headlamp, indicators, tail lamps, plate, spare wheel ---- */
    var lamp = new THREE.Group(); lamp.position.set(1.322, 0.80, 0); lamp.rotation.z = -Math.PI / 2; g.add(lamp);
    var housing = lathe([[0.075, -0.035], [0.09, -0.02], [0.098, 0.0], [0.1, 0.014], [0.092, 0.022]], 28, chrome); lamp.add(housing);
    var reflMat = std("#f4f1e8", 0.2, 0.6, { emissive: new THREE.Color(0xfff2c4), emissiveIntensity: 0 });
    var refl = lathe([[0.0, -0.03], [0.03, -0.025], [0.06, -0.008], [0.083, 0.014]], 24, reflMat); lamp.add(refl);
    var lensMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.45, depthWrite: false, emissive: new THREE.Color(0xfff4d0), emissiveIntensity: 0 });
    var lens = lathe([[0.086, 0.014], [0.07, 0.024], [0.04, 0.031], [0, 0.033]], 24, lensMat); lamp.add(lens);
    var bulbDot = mesh(new THREE.SphereGeometry(0.012, 10, 8), std("#fffbe8", 0.3, 0, { emissive: new THREE.Color(0xfff2c4), emissiveIntensity: 0 }), 0, -0.008, 0); lamp.add(bulbDot);
    parts.headlamp = tagPart(lamp, "headlamp");
    var lampGlow = glowSprite(0xfff0c0, 0.55); lampGlow.position.set(1.37, 0.80, 0); g.add(lampGlow);
    var beamTex = canvasTex(8, 128, function (c, w, h) { var gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,240,200,0)"); gr.addColorStop(1, "rgba(255,240,200,1)"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    var beam = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.6, 20, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, color: 0xfff0c8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    beam.rotation.z = Math.PI / 2; beam.position.set(1.33 + 0.8, 0.74, 0); g.add(beam);
    var amber = std("#ff9d1a", 0.3, 0, { emissive: new THREE.Color(0xff8a00), emissiveIntensity: 0.25 });
    [-1, 1].forEach(function (s) { var ind = lathe([[0.022, 0], [0.022, 0.006], [0.014, 0.018], [0, 0.021]], 12, amber); ind.position.set(1.285, 0.93, s * 0.16); ind.rotation.z = -Math.PI / 2 + 0.5; g.add(ind); });
    var tails = new THREE.Group(); g.add(tails);
    [-1, 1].forEach(function (s) { var tl = rbox(0.03, 0.09, 0.07, 0.01, std("#b3121b", 0.3, 0, { emissive: new THREE.Color(0xff1a1a), emissiveIntensity: 0.3 }), 1); tl.position.set(-1.345, 0.82, s * 0.44); tails.add(tl); });
    parts.tailLamps = tagPart(tails, "tailLamps");
    var plateTex = canvasTex(256, 96, function (c, w, h) {
      c.fillStyle = "#f4f6f8"; c.fillRect(0, 0, w, h); c.strokeStyle = "#1b1b1b"; c.lineWidth = 4; c.strokeRect(3, 3, w - 6, h - 6);
      c.fillStyle = "#16611f"; c.font = "800 20px system-ui, sans-serif"; c.textAlign = "center"; c.fillText("ABIA", w / 2, 24);
      c.fillStyle = "#b71c1c"; c.font = "800 44px system-ui, sans-serif"; c.fillText("ABA 214 KK", w / 2, 72);
    });
    var plate = mesh(new THREE.PlaneGeometry(0.30, 0.11), std("#ffffff", 0.5, 0, { map: plateTex }), -1.352, 0.62, 0); plate.rotation.y = -Math.PI / 2; g.add(plate);
    var spare = createWheel(tTex, "#2b2f34"); spare.position.set(-1.43, 1.14, 0); spare.rotation.y = Math.PI / 2; g.add(spare);
    var spareMount = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), steel, -1.38, 1.14, 0); spareMount.rotation.z = Math.PI / 2; g.add(spareMount);
    parts.spareWheel = tagPart(spare, "spareWheel");

    function lampLevel() { return st.lampSource ? clamp(+st.lampSource() || 0, 0, 1) : st.lamp; }
    function update(dt, t) {
      dt = dt || 0.016;
      st.lampShown = damp(st.lampShown, lampLevel(), 6, dt);
      var k = st.lampShown;
      reflMat.emissiveIntensity = k * 1.4; lensMat.emissiveIntensity = k * 0.9; bulbDot.material.emissiveIntensity = k * 3;
      lampGlow.material.opacity = k * 0.9; beam.material.opacity = k * 0.14;
      st.boxShown = damp(st.boxShown, st.box, 5, dt);
      lidPivot.rotation.x = st.boxShown * 1.45;
      st.wheelAngle -= st.wheelSpeed * dt / 0.215;
      fw.rotation.z = rwL.rotation.z = st.wheelAngle; rwR.rotation.z = -st.wheelAngle;
      kbat.update(dt, t);
    }
    function setState(o) {
      o = o || {};
      if (o.lamp != null) { st.lamp = clamp(o.lamp, 0, 1); st.lampSource = null; }
      if (o.boxOpen != null) st.box = clamp(+o.boxOpen, 0, 1);
      if (o.speed != null) st.wheelSpeed = o.speed;
      if (o.battery) kbat.setState(o.battery);
    }
    g.setLamp = function (k) { st.lamp = clamp(k, 0, 1); st.lampSource = null; };
    /* fn() -> 0..1 each frame, e.g. function () { return bulbModel.glow; } */
    g.setLampSource = function (fn) { st.lampSource = fn; };
    g.setBatteryBox = function (k) { st.box = clamp(k === true ? 1 : k === false ? 0 : k, 0, 1); };
    g.battery = kbat;
    g.reading = function () { return { lamp: lampLevel(), boxOpen: st.box, speed: st.wheelSpeed, battery: kbat.reading() }; };
    g.pickPart = pickPartFrom(g);
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ TOOL BOARD */
  function spannerGeo(L, s) {
    var R = 0.014 * s, w = 0.0055 * s, sl = 0.0058 * s, hx = L / 2, a = Math.asin(w / R), b = Math.asin(sl / R), cw = Math.sqrt(R * R - w * w);
    var sh = new THREE.Shape();
    sh.moveTo(-hx + cw, w); sh.lineTo(hx - cw, w);
    sh.absarc(hx, 0, R, Math.PI - a, b, true);
    sh.lineTo(hx - 0.002 * s, sl);
    sh.absarc(hx - 0.002 * s, 0, sl, Math.PI / 2, Math.PI * 1.5, false);
    sh.lineTo(hx + R * Math.cos(b), -sl);
    sh.absarc(hx, 0, R, -b, -Math.PI + a, true);
    sh.lineTo(-hx + cw, -w);
    sh.absarc(-hx, 0, R, -a, -TAU + a, true);
    var hex = new THREE.Path(), hr = 0.0072 * s;
    for (var i = 0; i <= 6; i++) { var ang = i / 6 * TAU + Math.PI / 6, x = -hx + Math.cos(ang) * hr, y = Math.sin(ang) * hr; if (i) hex.lineTo(x, y); else hex.moveTo(x, y); }
    sh.holes.push(hex);
    return new THREE.ExtrudeGeometry(sh, { depth: 0.004 * s, bevelEnabled: true, bevelThickness: 0.0008, bevelSize: 0.0008, bevelSegments: 1, curveSegments: 10 });
  }
  function createToolBoard(opts) {
    opts = opts || {};
    var g = new THREE.Group(), parts = {};
    var W = opts.width || 1.2, H = opts.height || 0.8, y0 = opts.legs === false ? 0 : (opts.bottom || 1.0);
    var holeTex = canvasTex(256, 256, function (c, w, h) {
      c.fillStyle = "#a9794a"; c.fillRect(0, 0, w, h);
      var R = rng(11); for (var k = 0; k < 1200; k++) { c.fillStyle = "rgba(60,30,10," + (R() * 0.12) + ")"; c.fillRect(R() * w, R() * h, 3, 1); }
      c.fillStyle = "#2a1a0e"; for (var y = 16; y < h; y += 32) for (var x = 16; x < w; x += 32) { c.beginPath(); c.arc(x, y, 4.5, 0, TAU); c.fill(); }
    });
    holeTex.wrapS = holeTex.wrapT = THREE.RepeatWrapping; holeTex.repeat.set(W / 0.2, H / 0.2);
    var board = mesh(new THREE.BoxGeometry(W, H, 0.012), std("#ffffff", 0.85, 0, { map: holeTex, bumpMap: holeTex, bumpScale: 0.5 }), 0, y0 + H / 2, 0); g.add(board);
    parts.board = tagPart(board, "board");
    var wood = std("#6b4423", 0.8);
    [[0, y0 + H + 0.02, W + 0.08, 0.04], [0, y0 - 0.02, W + 0.08, 0.04]].forEach(function (f) { var m = rbox(f[2], f[3], 0.04, 0.008, wood, 1); m.position.set(f[0], f[1], 0.004); g.add(m); });
    [-1, 1].forEach(function (s) {
      var post = rbox(0.05, y0 + H + 0.06, 0.05, 0.008, wood, 1); post.position.set(s * (W / 2 + 0.03), (y0 + H + 0.06) / 2, 0); g.add(post);
      if (opts.legs !== false) { var foot = rbox(0.07, 0.04, 0.45, 0.01, wood, 1); foot.position.set(s * (W / 2 + 0.03), 0.02, 0.05); g.add(foot); }
    });
    var TS = opts.toolScale || 1.6, tools = new THREE.Group(); tools.scale.setScalar(TS); g.add(tools); parts.tools = tagPart(tools, "tools");
    var Wb = W, Hb = H, yb = y0; W = Wb / TS; H = Hb / TS; y0 = yb / TS;     // tool coordinates (scaled up by TS for readability at story distance)
    var chromeM = std("#cfd4da", 0.28, 0.75), steelM = std("#a7adb5", 0.35, 0.7);
    function peg(x, y) { tools.add(new THREE.Mesh(tubeGeo([[x, y, 0.006], [x, y, 0.04], [x, y + 0.015, 0.05]], 0.003, 6, 5), steelM)); }
    // combination spanners (open end down)
    [0.8, 0.95, 1.1].forEach(function (s, i) {
      var L = 0.17 * s, sp = new THREE.Mesh(spannerGeo(L, s), chromeM);
      sp.rotation.z = Math.PI / 2; sp.position.set(-W / 2 + 0.1 + i * 0.07, y0 + H - 0.14 - L / 2 * 0.2, 0.012); tools.add(sp);
      peg(-W / 2 + 0.1 + i * 0.07, y0 + H - 0.06);
    });
    // screwdrivers (lathe handles)
    ["#d32f2f", "#f9a825"].forEach(function (col, i) {
      var sd = new THREE.Group();
      var hdl = lathe([[0, 0], [0.012, 0.002], [0.015, 0.02], [0.014, 0.07], [0.016, 0.085], [0.01, 0.1], [0.004, 0.102], [0, 0.102]], 16, std(col, 0.3, 0, { transparent: true, opacity: 0.92 }));
      sd.add(hdl);
      var shaft = mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.12, 8), chromeM, 0, -0.06, 0); sd.add(shaft);
      var tip = mesh(new THREE.BoxGeometry(0.008, 0.012, 0.0015), chromeM, 0, -0.125, 0); sd.add(tip);
      sd.position.set(-W / 2 + 0.36 + i * 0.06, y0 + H - 0.2, 0.03); tools.add(sd);
      peg(-W / 2 + 0.36 + i * 0.06, y0 + H - 0.095);
    });
    // pliers: dipped grips as curved tubes, steel jaws
    var pl = new THREE.Group();
    [-1, 1].forEach(function (s) {
      pl.add(new THREE.Mesh(tubeGeo([[s * 0.006, 0.0, 0], [s * 0.018, -0.06, 0], [s * 0.026, -0.13, 0]], 0.0065, 12, 6), std("#c62828", 0.5)));
      pl.add(new THREE.Mesh(tubeGeo([[-s * 0.006, 0.0, 0.003], [-s * 0.004, 0.03, 0.003], [0.0, 0.055, 0.003]], 0.0045, 8, 5), steelM));
    });
    var rivet = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.012, 10), chromeM, 0, 0, 0.002); rivet.rotation.x = Math.PI / 2; pl.add(rivet);
    pl.position.set(-W / 2 + 0.56, y0 + H - 0.2, 0.025); tools.add(pl); peg(-W / 2 + 0.56, y0 + H - 0.13);
    // hanks of insulated wire on pegs
    ["#c62828", "#1e1e1e", "#f9a825"].forEach(function (col, i) {
      var hk = new THREE.Group();
      for (var k = 0; k < 5; k++) {
        var ring = new THREE.Mesh(new THREE.TorusGeometry(0.05 + k * 0.002, 0.003, 5, 30), std(col, 0.5));
        ring.position.set(k * 0.002, -0.05 - k * 0.002, 0.03 + k * 0.004); ring.rotation.x = 0.1 * k; hk.add(ring);
      }
      hk.position.set(-W / 2 + 0.09 + i * 0.13, y0 + H - 0.3, 0); tools.add(hk); peg(-W / 2 + 0.09 + i * 0.13, y0 + H - 0.3);
    });
    // a small 12 V test lamp (probe with a crocodile lead)
    var tl = new THREE.Group();
    tl.add(lathe([[0, 0], [0.008, 0.002], [0.009, 0.1], [0.006, 0.11], [0, 0.112]], 12, std("#e0e0e0", 0.2, 0, { transparent: true, opacity: 0.7 })));
    tl.add(mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.05, 6), chromeM, 0, -0.025, 0));
    tl.add(new THREE.Mesh(tubeGeo([[0, 0.112, 0], [0.03, 0.1, 0.01], [0.05, -0.05, 0.02], [0.02, -0.15, 0.02]], 0.0025, 20, 5), std("#1e1e1e", 0.5)));
    tl.position.set(-W / 2 + 0.68, y0 + H - 0.24, 0.03); tools.add(tl); peg(-W / 2 + 0.68, y0 + H - 0.115);
    // a hacksaw on the lower right
    var saw = new THREE.Group();
    saw.add(new THREE.Mesh(tubeGeo([[-0.12, 0, 0], [-0.12, 0.05, 0], [0.12, 0.05, 0], [0.12, 0, 0]], 0.004, 16, 6), std("#3b5bd6", 0.4, 0.4)));
    saw.add(mesh(new THREE.BoxGeometry(0.24, 0.012, 0.001), steelM, 0, 0.002, 0));
    saw.add(new THREE.Mesh(tubeGeo([[-0.12, 0.0, 0], [-0.15, -0.02, 0], [-0.15, -0.07, 0]], 0.009, 8, 6), std("#1b1b1b", 0.6)));
    saw.position.set(W / 2 - 0.19, y0 + 0.09, 0.02); tools.add(saw); peg(W / 2 - 0.19, y0 + 0.15);
    W = Wb; H = Hb; y0 = yb;
    g.reading = function () { return { tools: tools.children.length }; };
    g.pickPart = pickPartFrom(g);
    return attachCompat(g, parts, function () {}, function () {});
  }

  /* ================================================================ D-SIZE CELLS (series / parallel) */
  function cellLabelTex(E) {
    var t = canvasTex(256, 128, function (c, w, h) {
      c.fillStyle = "#1b5e20"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#111"; c.fillRect(0, 0, w * 0.32, h);
      c.fillStyle = "#f2c230"; c.fillRect(0, 54, w, 6);
      c.fillStyle = "#fff"; c.font = "800 34px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(E.toFixed(1) + " V", w * 0.66, 30); c.font = "700 22px system-ui, sans-serif"; c.fillText("SIZE D", w * 0.66, 92);
      c.fillText("+", w * 0.16, 30); c.fillText("+", w * 0.16 + 128, 30);
    });
    return t;
  }
  function createCellPack(opts) {
    opts = opts || {};
    var st = { n: opts.n || 3, E: opts.E || 1.5, r: opts.r != null ? opts.r : 2.0, arrangement: opts.arrangement || "series", R: opts.R != null ? opts.R : 1.0, blend: 0 };
    st.blend = st.arrangement === "parallel" ? 1 : 0;
    var g = new THREE.Group(), parts = {}, cells = [];
    var labelMat = std("#ffffff", 0.45, 0.1, { map: cellLabelTex(st.E) }), steelM = std("#c3c8ce", 0.3, 0.75);
    var Lc = 0.0615, Rc = 0.0171;
    for (var i = 0; i < st.n; i++) {
      var c = new THREE.Group();
      var can = lathe([[0, 0], [0.0155, 0], [0.0168, 0.0015], [0.0168, 0.06], [0.0155, 0.0612], [0.0048, 0.0612], [0.0048, 0.0638], [0.0042, 0.0645], [0, 0.0645]], 24, steelM); c.add(can);
      var sleeve = mesh(new THREE.CylinderGeometry(Rc, Rc, 0.056, 28, 1, true), labelMat, 0, 0.0305, 0); c.add(sleeve);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(Rc - 0.0008, 0.0009, 6, 28), std("#0f3d14", 0.5)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.0585; c.add(ring);
      c.rotation.z = -Math.PI / 2; c.position.x = -0.0645 / 2;   // lying down, centred, + nub towards +x
      var holder = new THREE.Group(); holder.add(c); holder.position.y = Rc; g.add(holder);
      cells.push(holder); parts["cell" + String.fromCharCode(65 + i)] = tagPart(holder, "cell" + String.fromCharCode(65 + i));
    }
    var copper = std("#c27a43", 0.35, 0.6);
    var span = (st.n - 1) * 0.04;
    var busP = rbox(0.006, 0.03, span + 0.03, 0.002, copper, 1), busN = busP.clone(); g.add(busP); g.add(busN);
    busP.position.set(Lc / 2 + 0.0035, Rc, 0); busN.position.set(-Lc / 2 - 0.003, Rc, 0);
    parts.bus = tagPart(busP, "bus"); tagPart(busN, "bus");
    var leadR = new THREE.Mesh(new THREE.BufferGeometry(), std("#c62828", 0.5)), leadB = new THREE.Mesh(new THREE.BufferGeometry(), std("#1e1e1e", 0.5));
    g.add(leadR); g.add(leadB); parts.leads = tagPart(leadR, "leads"); tagPart(leadB, "leads");
    function pos(i, b) {
      var sx = (i - (st.n - 1) / 2) * (Lc + 0.0025), pz = (i - (st.n - 1) / 2) * 0.04;
      return new V3(sx * (1 - b), Rc, pz * b);
    }
    function relead(b) {
      var plusEnd = b > 0.5 ? new V3(busP.position.x, Rc, span / 2) : pos(st.n - 1, b).add(new V3(Lc / 2 + 0.003, 0, 0));
      var minusEnd = b > 0.5 ? new V3(busN.position.x, Rc, span / 2) : pos(0, b).add(new V3(-Lc / 2 - 0.001, 0, 0));
      var outR = plusEnd.clone().add(new V3(0.07, -Rc + 0.004, 0.06)), outB = minusEnd.clone().add(new V3(-0.07, -Rc + 0.004, 0.06));
      leadR.geometry.dispose(); leadR.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([plusEnd, plusEnd.clone().add(new V3(0.02, 0.01, 0.01)), outR]), 12, 0.0022, 5);
      leadB.geometry.dispose(); leadB.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([minusEnd, minusEnd.clone().add(new V3(-0.02, 0.01, 0.01)), outB]), 12, 0.0022, 5);
    }
    var lastB = -1;
    function update(dt) {
      st.blend = damp(st.blend, st.arrangement === "parallel" ? 1 : 0, 4, dt || 0.016);
      if (Math.abs(st.blend - (st.arrangement === "parallel" ? 1 : 0)) < 1e-3) st.blend = st.arrangement === "parallel" ? 1 : 0;
      for (var i = 0; i < cells.length; i++) cells[i].position.copy(pos(i, st.blend));
      busP.visible = busN.visible = st.blend > 0.95;
      if (Math.abs(st.blend - lastB) > 0.02 || (st.blend !== lastB && (st.blend === 0 || st.blend === 1))) { relead(st.blend); lastB = st.blend; }
    }
    function reading() { return model.cellArray(st.n, st.E, st.r, st.arrangement, st.R); }
    function setState(o) {
      o = o || {};
      if (o.arrangement) st.arrangement = o.arrangement === "parallel" ? "parallel" : "series";
      if ("R" in o) st.R = o.R; if (o.r != null) st.r = o.r; if (o.E != null) st.E = o.E;
      if (o.instant) { st.blend = st.arrangement === "parallel" ? 1 : 0; lastB = -1; update(0); }
    }
    g.setArrangement = function (a, instant) { setState({ arrangement: a, instant: instant }); return reading(); };
    g.setLoad = function (R) { st.R = R; return reading(); };
    g.reading = reading; g.pickPart = pickPartFrom(g);
    update(1);
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ 12 V DC WATER PUMP (backup pump) */
  function createPump(opts) {
    opts = opts || {};
    var st = { running: !!opts.running, R: opts.R != null ? opts.R : 1.0, flow: 0 };
    var g = new THREE.Group(), parts = {};
    var body = new THREE.Group(); body.position.y = 0.05; g.add(body);
    var motor = lathe([[0, 0], [0.026, 0], [0.03, 0.004], [0.03, 0.07], [0.027, 0.075], [0.01, 0.077], [0.01, 0.083], [0, 0.083]], 26, std("#b9bec5", 0.35, 0.65));
    motor.rotation.z = Math.PI / 2; motor.position.x = 0.0; body.add(motor);           // axis along -x
    for (var i = 0; i < 8; i++) { var rib = new THREE.Mesh(new THREE.TorusGeometry(0.0302, 0.0012, 4, 26), std("#9aa0a8", 0.4, 0.6)); rib.rotation.y = Math.PI / 2; rib.position.x = -0.012 - i * 0.007; body.add(rib); }
    parts.motor = tagPart(motor, "motor");
    var vol = lathe([[0, 0], [0.042, 0], [0.046, 0.005], [0.046, 0.026], [0.042, 0.03], [0.013, 0.032], [0.013, 0.05], [0.0105, 0.052], [0.0105, 0.056], [0, 0.056]], 28, std("#1d2b3a", 0.45));
    vol.rotation.z = -Math.PI / 2; vol.position.x = 0.0; body.add(vol);                   // inlet towards +x
    var outlet = new THREE.Mesh(tubeGeo([[0.015, 0.04, 0.0], [0.015, 0.07, 0.0], [0.02, 0.085, 0.0]], 0.009, 8, 10), std("#1d2b3a", 0.45)); body.add(outlet);
    parts.housing = tagPart(vol, "housing"); tagPart(outlet, "housing");
    [-1, 1].forEach(function (s) {
      var tab = mesh(new THREE.BoxGeometry(0.004, 0.012, 0.006), std("#c9a54a", 0.3, 0.7), -0.085, 0.0, s * 0.01); body.add(tab);
      body.add(new THREE.Mesh(tubeGeo([[-0.087, 0.0, s * 0.01], [-0.11, -0.01, s * 0.02], [-0.16, -0.045, s * 0.05]], 0.0025, 10, 5), std(s > 0 ? "#c62828" : "#1e1e1e", 0.5)));
    });
    var bracket = new THREE.Shape(); bracket.moveTo(-0.07, -0.05); bracket.lineTo(0.03, -0.05); bracket.lineTo(0.03, -0.045); bracket.lineTo(-0.02, -0.045); bracket.lineTo(-0.02, -0.02); bracket.lineTo(-0.026, -0.02); bracket.lineTo(-0.026, -0.045); bracket.lineTo(-0.07, -0.045);
    var br = new THREE.Mesh(new THREE.ExtrudeGeometry(bracket, { depth: 0.07, bevelEnabled: false }), std("#7c838b", 0.4, 0.6)); br.position.z = -0.035; body.add(br);
    var waterTex = canvasTex(16, 64, function (c, w, h) { for (var y = 0; y < h; y++) { c.fillStyle = "rgba(170,215,255," + (0.35 + 0.35 * Math.sin(y / h * TAU * 3)) + ")"; c.fillRect(0, y, w, 1); } });
    waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
    var water = new THREE.Mesh(tubeGeo([[0.02, 0.087, 0], [0.06, 0.1, 0], [0.12, 0.06, 0], [0.16, -0.05, 0]], 0.006, 16, 6), new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0.8, depthWrite: false }));
    body.add(water); parts.water = tagPart(water, "water");
    function update(dt, t) {
      st.flow = damp(st.flow, st.running ? 1 : 0, 4, dt || 0.016);
      water.visible = st.flow > 0.05; water.scale.setScalar(Math.max(0.05, st.flow));
      waterTex.offset.y -= (dt || 0.016) * 2.5;
      body.position.y = 0.05 + (st.running ? Math.sin((t || 0) * 90) * 0.0006 : 0);
    }
    function setState(o) { o = o || {}; if (o.running != null) st.running = !!o.running; if (o.R != null) st.R = o.R; }
    g.setRunning = function (on) { st.running = !!on; };
    g.reading = function () { return { running: st.running, R: st.R }; };
    g.pickPart = pickPartFrom(g);
    return attachCompat(g, parts, update, setState);
  }

  /* ================================================================ SET DRESSING FOR StoryStage */
  var DEFAULT_SHOP = ["keke", "battery", "cablesThin", "cablesThick", "meter", "toolBoard", "coil", "bulb"];
  function hide(o) { if (o) o.visible = false; }
  function scaleProps(out, o) {
    var ps = (o && o.propScale) || 1;
    if (ps !== 1) ["battery", "meter", "bulb", "coil", "cells", "pump"].forEach(function (k) { if (out[k]) out[k].scale.setScalar(ps); });
  }
  function finishDress(api, group, out, keys) {
    keys.forEach(function (k) { if (out[k]) api.props[k] = out[k]; });
    out.update = function (dt, t) { keys.forEach(function (k) { if (out[k] && out[k].update) out[k].update(dt, t); }); };
    out.highlighter = function (scene) { return makeHighlighter(scene || group); };
    return out;
  }
  /* Set 1: Nkechi's auto-electric workshop (market group, world origin, table top y = 0.94) */
  function dressWorkshop(api, o) {
    o = o || {};
    var M = api.props.market, P = api.props, out = {}, inc = o.include || DEFAULT_SHOP;
    function want(k) { return inc.indexOf(k) >= 0; }
    if (!o.keepMarketProps) {
      (P.jars || []).forEach(hide); hide(P.bottleA); hide(P.bottleB);
      if (P.can) P.can.position.set(-1.75, 0, 0.45);
    }
    var TY = 0.94;
    if (want("keke")) { out.keke = createKeke(o.keke); out.keke.position.set(2.9, 0, 1.5); out.keke.rotation.y = -0.45; M.add(out.keke); }
    if (want("battery")) { out.battery = createBattery(o.battery || { E: 12.0, r: 1.2, corrosion: 0.6 }); out.battery.position.set(0.72, TY, 0.02); out.battery.rotation.y = -0.2; M.add(out.battery); }
    if (want("cablesThick")) { out.cablesThick = createJumperSet({ gauge: "thick", from: [-1.18, TY, 0.04], to: [0.02, TY, 0.14], floorY: TY, bend: 0.12 }); M.add(out.cablesThick); }
    if (want("cablesThin")) { out.cablesThin = createJumperSet({ gauge: "thin", from: [-1.18, TY, 0.36], to: [0.02, TY, 0.44], floorY: TY, bend: 0.1 }); M.add(out.cablesThin); }
    if (want("meter")) { out.meter = createMultimeter(); out.meter.position.set(0.30, TY, 0.30); out.meter.rotation.y = 0.15; M.add(out.meter); }
    if (want("coil")) { out.coil = createWireCoil(o.coil); out.coil.position.set(-0.55, TY, -0.28); M.add(out.coil); }
    if (want("bulb")) { out.bulb = createBulb(o.bulb); out.bulb.position.set(-0.2, TY, -0.30); M.add(out.bulb); }
    if (want("cells")) { out.cells = createCellPack(o.cells); out.cells.position.set(-0.95, TY, -0.30); M.add(out.cells); }
    if (want("pump")) { out.pump = createPump(o.pump); out.pump.position.set(1.05, TY, -0.32); out.pump.rotation.y = 0.3; M.add(out.pump); }
    if (want("toolBoard")) { out.toolBoard = createToolBoard(o.toolBoard); out.toolBoard.position.set(-1.35, 0, -1.55); out.toolBoard.rotation.y = 0.25; M.add(out.toolBoard); }
    if (o.tobeStall) {      // Tobe's battery stall: the produce on the stall at x = 4.3 becomes a row of batteries
      M.children.forEach(function (c) { if (c.isMesh && c.geometry && c.geometry.type === "SphereGeometry" && Math.abs(c.position.z + 1.2) < 0.05 && c.position.x > 3.3 && c.position.x < 5.2) c.visible = false; });
      var stack = new THREE.Group();
      for (var i = 0; i < 5; i++) { var b = createBattery({ E: 12.0, r: 0.05, clamps: false, lite: true, bandColor: i % 2 ? "#1565c0" : "#b71c1c" }); b.position.set(3.55 + i * 0.36, 0.893, -1.15); b.rotation.y = (i % 2 ? 0.1 : -0.08); stack.add(b); }
      var sign = textSprite("TOBE BATTERIES", 0.22, "rgba(21,101,192,0.95)", "#fff"); sign.position.set(4.3, 1.55, -0.75); stack.add(sign);
      M.add(stack); out.tobeStall = stack;
    }
    scaleProps(out, o); M.updateMatrixWorld(true);
    if (o.meterOnBattery && out.meter && out.battery) out.meter.clipTo(out.battery);
    out.spots = { emeka: [1.75, 0, 2.45], tobe: [3.6, 0, -0.25], chinedu: [1.0, 0, 0.95], nkechi: [0.1, 0, -0.95] };
    out.shots = { wide: [[1.2, 2.6, 9.6], [1.2, 1.0, 0.3]], table: [[0.25, 1.75, 2.1], [0.25, 0.98, 0.05]], battery: [[0.95, 1.3, 0.95], [0.72, 1.02, 0.02]],
      cables: [[-0.55, 1.45, 1.35], [-0.55, 0.95, 0.25]], keke: [[3.6, 1.7, 5.0], [2.8, 0.9, 1.4]], kekeLamp: [[5.4, 1.2, 3.4], [4.0, 0.8, 1.0]] };
    if (out.keke) {
      var bb = out.keke.localToWorld(new V3(0.24, 0.57, 0.21)), cam = out.keke.localToWorld(new V3(0.6, 1.05, 1.35));
      out.shots.batteryBox = [[cam.x, cam.y, cam.z], [bb.x, bb.y, bb.z]];
    }
    return finishDress(api, M, out, ["keke", "battery", "cablesThick", "cablesThin", "meter", "coil", "bulb", "cells", "pump", "toolBoard"], o);
  }
  /* Set 2: Nkechi's test bench (lab group at world x = 40, bench top y = 0.99, bench front z = -1.75) */
  function dressBench(api, o) {
    o = o || {};
    var L = api.props.lab, P = api.props, out = {}, inc = o.include || ["battery", "meter", "cablesThin", "cablesThick", "coil", "bulb"];
    function want(k) { return inc.indexOf(k) >= 0; }
    if (!o.keepLabProps) { hide(P.balance); hide(P.burette); hide(P.flask); hide(P.vflask); }
    var TY = 0.99;
    if (want("battery")) { out.battery = createBattery(o.battery || { E: 12.0, r: 1.2, corrosion: 0.6 }); out.battery.position.set(-0.35, TY, -2.15); L.add(out.battery); }
    if (want("meter")) { out.meter = createMultimeter(); out.meter.position.set(0.12, TY, -1.98); out.meter.rotation.y = -0.1; L.add(out.meter); }
    if (want("bulb")) { out.bulb = createBulb(o.bulb); out.bulb.position.set(0.62, TY, -2.2); L.add(out.bulb); }
    if (want("coil")) { out.coil = createWireCoil(o.coil); out.coil.position.set(0.95, TY, -2.35); L.add(out.coil); }
    if (want("cablesThin")) { out.cablesThin = createJumperSet({ gauge: "thin", from: [-2.75, TY, -2.02], to: [-1.55, TY, -1.97], floorY: TY, bend: 0.08 }); L.add(out.cablesThin); }
    if (want("cablesThick")) { out.cablesThick = createJumperSet({ gauge: "thick", from: [-2.75, TY, -2.38], to: [-1.55, TY, -2.33], floorY: TY, bend: 0.08 }); L.add(out.cablesThick); }
    if (want("cells")) { out.cells = createCellPack(o.cells); out.cells.position.set(-1.05, TY, -2.45); L.add(out.cells); }
    if (want("pump")) { out.pump = createPump(o.pump); out.pump.position.set(1.4, TY, -2.1); L.add(out.pump); }
    if (want("keke")) { out.keke = createKeke(o.keke); out.keke.position.set(3.6, 0, 0.6); out.keke.rotation.y = -1.2; L.add(out.keke); }
    scaleProps(out, o); L.updateMatrixWorld(true);
    if (o.meterOnBattery && out.meter && out.battery) out.meter.clipTo(out.battery);
    out.spots = { nkechi: [-1.0, 0, -1.3], chinedu: [0.9, 0, -0.9], tobe: [1.9, 0, -1.0] };
    out.shots = { bench: [[41.2, 1.8, 0.4], [39.8, 1.05, -2.15]], battery: [[39.75, 1.4, -1.15], [39.65, 1.05, -2.15]], cables: [[37.85, 1.45, -1.0], [37.85, 1.0, -2.2]] };
    return finishDress(api, L, out, ["battery", "meter", "bulb", "coil", "cablesThin", "cablesThick", "cells", "pump", "keke"], o);
  }

  global.AutoWorkshopProps = {
    version: 1,
    createKeke: createKeke, createBattery: createBattery, createJumperCable: createJumperCable, createJumperSet: createJumperSet,
    createClip: createClip, createBulb: createBulb, createWireCoil: createWireCoil, createMultimeter: createMultimeter,
    createToolBoard: createToolBoard, createCellPack: createCellPack, createPump: createPump, createWheel: function () { return createWheel(tyreTex()); },
    dressWorkshop: dressWorkshop, dressBench: dressBench,
    model: model, makeHighlighter: makeHighlighter, tagPart: tagPart,
    triangles: function (obj) {
      var n = 0;
      obj.traverse(function (o) { if (o.isMesh && o.geometry && o.visible !== false) { var gg = o.geometry; n += (gg.index ? gg.index.count : gg.attributes.position.count) / 3; } });
      return Math.round(n);
    }
  };
})(window);
