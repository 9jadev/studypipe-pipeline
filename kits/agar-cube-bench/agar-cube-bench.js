/* ==========================================================
   StudyPipe Kit: agar-cube-bench (v2)  ·  window.AgarCubeKit
   Surface area : volume practical. A translucent agar cube is cut open
   (one octant removed) so the dye front and the undyed core can be read
   against a ruler. Readings come from a model, never from typed text.

   Classic script, fully offline, needs window.THREE (+ window.SceneKit
   only for the optional 3D labels).

   AgarCubeKit.create(opts) -> THREE.Group with
     g.parts / g.userData.parts   { cube, dye, core, front, tile, ruler, scalpel, dish, labelL, labelCore }
     g.update(dt, t)  g.setState(obj)  g.play()  g.reset()  g.reading()
     events (g.addEventListener): "change", "diffusion-start", "diffusion-done"  (event.reading)
   AgarCubeKit.model(L_mm, t_min, dyeDepth_mm, tau_min) -> reading (pure maths)
   v2: create({ mode: "acid" }) = phenolphthalein-agar cubes in dilute HCl (pink -> colourless);
       AgarCubeKit.acidModel(L_mm, opts) -> reading. Default mode ("dye") is unchanged from v1. See README.
   ========================================================== */
(function (global) {
  "use strict";

  var LEVELS = [1, 2, 3, 4, 6];
  var TAU_MIN = 3;           // time constant of dye uptake, minutes
  var PLAY_SECONDS = 4;      // real seconds a play() takes

  /* ---------- the model ---------- */
  function model(L, t, d, tau) {
    L = Math.max(0.1, +L || 1);
    t = Math.max(0, t == null ? 30 : +t);
    d = Math.max(0, d == null ? 1 : +d);
    tau = tau || TAU_MIN;
    var depth = Math.min(d * (1 - Math.exp(-t / tau)), L / 2);
    var core = Math.max(0, L - 2 * depth);               // side of the undyed core, mm
    var undyed = Math.pow(core / L, 3);
    var SA = 6 * L * L, V = L * L * L;
    return {
      L_mm: L, SA: SA, V: V, ratio: SA / V,               // ratio = 6 / L, mm^-1
      t_min: t, dyeDepth_mm: d, depth_mm: depth,
      core_mm: core, undyedFraction: undyed, dyedFraction: 1 - undyed
    };
  }

  /* ---------- helpers ---------- */
  function rng(seed) {
    var s = (seed || 1) >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function srgb(tex) {
    if (global.THREE.SRGBColorSpace && "colorSpace" in tex) tex.colorSpace = global.THREE.SRGBColorSpace;
    else if (global.THREE.sRGBEncoding) tex.encoding = global.THREE.sRGBEncoding;
    return tex;
  }
  function tagPart(obj, key) {
    obj.userData = obj.userData || {};
    obj.userData.partId = key;
    obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData = g.userData || {};
    g.userData.parts = parts; g.userData.update = updateFn; g.userData.setState = setStateFn;
    g.group = g; g.parts = parts; g.tick = updateFn; g.update = updateFn; g.setState = setStateFn;
    return g;
  }
  function disposeTree(o) {
    o.traverse(function (c) {
      if (c.geometry) c.geometry.dispose();
      if (c.material && c.userData && c.userData.ownMat) {
        if (c.material.map) c.material.map.dispose();
        c.material.dispose();
      }
    });
  }
  function clear(group) {
    while (group.children.length) { var c = group.children[0]; group.remove(c); disposeTree(c); }
  }

  function makeHighlighter(scene) {
    var saved = [];
    function clearAll() {
      saved.forEach(function (s) { s.mesh.material = s.orig; s.mat.dispose(); });
      saved.length = 0;
    }
    function highlight(partName, colorHex) {
      clearAll();
      if (!partName || !scene) return;
      var col = new global.THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === partName && o.material && o.material.emissive) {
          var c = o.material.clone();
          saved.push({ mesh: o, orig: o.material, mat: c });
          c.emissive.copy(col); c.emissiveIntensity = 0.55;
          o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clearAll };
  }

  /* ---------- procedural textures (seeded, offline) ---------- */
  function agarTexture(seed) {
    var T = global.THREE, R = rng(seed), S = 128;
    var c = document.createElement("canvas"); c.width = c.height = S;
    var x = c.getContext("2d");
    x.fillStyle = "#f4f4f4"; x.fillRect(0, 0, S, S);
    var i, a;
    for (i = 0; i < 700; i++) {                          // soft mottling of the gel
      a = R() * 0.07;
      x.fillStyle = "rgba(" + (R() < 0.5 ? "255,255,255" : "120,120,120") + "," + a + ")";
      x.beginPath(); x.arc(R() * S, R() * S, 1 + R() * 5, 0, 6.2832); x.fill();
    }
    x.strokeStyle = "rgba(90,90,90,0.07)"; x.lineWidth = 1;   // faint knife scores
    for (i = 0; i < 14; i++) { var y = R() * S; x.beginPath(); x.moveTo(0, y); x.lineTo(S, y + (R() - 0.5) * 6); x.stroke(); }
    var t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    return srgb(t);
  }
  function glazeTexture() {
    var T = global.THREE, R = rng(7), S = 128;
    var c = document.createElement("canvas"); c.width = c.height = S;
    var x = c.getContext("2d");
    x.fillStyle = "#f6f4ee"; x.fillRect(0, 0, S, S);
    for (var i = 0; i < 260; i++) {
      x.fillStyle = "rgba(120,110,95," + (0.03 + R() * 0.06) + ")";
      x.fillRect(R() * S, R() * S, 1, 1);
    }
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 3);
    return srgb(t);
  }
  function rulerTexture(Rmm) {
    var T = global.THREE, pxmm = 64, w = Math.round((Rmm + 1) * pxmm), h = 112;
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d");
    x.fillStyle = "#f2e7bf"; x.fillRect(0, 0, w, h);
    x.fillStyle = "rgba(255,255,255,0.18)"; x.fillRect(0, 0, w, 6);
    x.strokeStyle = "#1b1b1b"; x.fillStyle = "#1b1b1b"; x.lineWidth = 2;
    x.font = "700 30px sans-serif"; x.textAlign = "center"; x.textBaseline = "top";
    for (var i = 0; i <= Rmm; i++) {
      var px = (i + 0.5) * pxmm;
      x.beginPath(); x.moveTo(px, 0); x.lineTo(px, 44); x.stroke();
      x.fillText(String(i), px, 52);
      if (i < Rmm) { x.beginPath(); x.moveTo(px + pxmm / 2, 0); x.lineTo(px + pxmm / 2, 26); x.stroke(); }
    }
    x.font = "600 20px sans-serif"; x.textAlign = "right"; x.fillText("mm", w - 8, 86);
    var t = new T.CanvasTexture(c); t.anisotropy = 4;
    return srgb(t);
  }

  /* ---------- polygons for the cut cube (cube-local, centred, y up, z to viewer) ---------- */
  function sq(a) { return [[-a, -a], [a, -a], [a, a], [-a, a]]; }
  function lShape(a) { return [[-a, -a], [a, -a], [a, 0], [0, 0], [0, a], [-a, a]]; }   // square minus the x>0,y>0 quadrant
  function cShape(h, c) {                                                               // shell band of the L slab
    return [[-h, -h], [h, -h], [h, 0], [c, 0], [c, -c], [-c, -c], [-c, c], [0, c], [0, h], [-h, h]];
  }
  function shapeOf(pts, holePts) {
    var T = global.THREE, s = new T.Shape();
    pts.forEach(function (p, i) { if (i) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); });
    s.closePath();
    if (holePts) {
      var hp = new T.Path();
      holePts.slice().reverse().forEach(function (p, i) { if (i) hp.lineTo(p[0], p[1]); else hp.moveTo(p[0], p[1]); });
      hp.closePath(); s.holes.push(hp);
    }
    return s;
  }
  function boxUV(geo) {                                  // dominant-axis projection, so sides are not stretched
    var p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv, k = 1.6;
    for (var i = 0; i < p.count; i++) {
      var ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
      if (az >= ax && az >= ay) uv.setXY(i, p.getX(i) * k, p.getY(i) * k);
      else if (ax >= ay) uv.setXY(i, p.getZ(i) * k, p.getY(i) * k);
      else uv.setXY(i, p.getX(i) * k, p.getZ(i) * k);
    }
    uv.needsUpdate = true;
  }
  function slab(pts, hole, z0, z1, mat) {
    var T = global.THREE;
    var geo = new T.ExtrudeGeometry(shapeOf(pts, hole), { depth: Math.max(0.0005, z1 - z0), bevelEnabled: false, curveSegments: 1 });
    geo.translate(0, 0, z0);
    boxUV(geo);
    var m = new T.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
    return m;
  }

  /* ---------- glass dish, scalpel, tile, ruler ---------- */
  function buildDish(mats) {
    var T = global.THREE, g = new T.Group();
    var prof = [[0, 0], [0.30, 0], [0.33, 0.015], [0.345, 0.13], [0.335, 0.135], [0.322, 0.03], [0, 0.028]]
      .map(function (p) { return new T.Vector2(p[0], p[1]); });
    var dish = new T.Mesh(new T.LatheGeometry(prof, 36), mats.glass);
    var liq = [[0, 0.03], [0.31, 0.031], [0.318, 0.075], [0.30, 0.071], [0, 0.066]]
      .map(function (p) { return new T.Vector2(p[0], p[1]); });
    var liquid = new T.Mesh(new T.LatheGeometry(liq, 36), mats.liquid);
    g.add(dish, liquid);
    return g;
  }
  function buildScalpel(mats) {
    var T = global.THREE, g = new T.Group();
    var prof = [[0, 0], [0.03, 0], [0.034, 0.08], [0.03, 0.2], [0.036, 0.46], [0.03, 0.66], [0.018, 0.74], [0, 0.76]]
      .map(function (p) { return new T.Vector2(p[0], p[1]); });
    var handle = new T.Mesh(new T.LatheGeometry(prof, 16), mats.steel);
    handle.rotation.z = -Math.PI / 2; handle.scale.set(1, 1, 0.5);        // lies along +x, flattened
    var bs = new T.Shape();
    bs.moveTo(0, 0.03); bs.lineTo(0, -0.03); bs.lineTo(-0.1, -0.03);
    bs.quadraticCurveTo(-0.3, -0.032, -0.42, 0.0);
    bs.quadraticCurveTo(-0.3, 0.05, -0.1, 0.034); bs.lineTo(0, 0.03);
    var bg = new T.ExtrudeGeometry(bs, { depth: 0.006, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 1, curveSegments: 12 });
    var blade = new T.Mesh(bg, mats.steel);
    blade.rotation.x = -Math.PI / 2; blade.position.y = 0.012;
    g.add(handle, blade);
    return g;
  }
  function roundedRect(w, h, r) {
    var T = global.THREE, s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  /* ---------- the kit ---------- */
  function create(opts) {
    var T = global.THREE;
    if (!T) throw new Error("AgarCubeKit needs window.THREE");
    opts = opts || {};
    var st = {
      L_mm: Math.min(6, Math.max(1, +opts.L_mm || 3)),
      t_min: opts.t_min != null ? +opts.t_min : 30,
      dyeDepth_mm: opts.dyeDepth_mm != null ? +opts.dyeDepth_mm : 1.0,
      tau_min: opts.tau_min || TAU_MIN,
      cutaway: opts.cutaway !== false,
      labels: opts.labels !== false
    };
    var tNow = st.t_min, playing = false, playRate = 0, dirty = true, lastBuild = -1;

    var root = new T.Group();
    var content = new T.Group(); root.add(content);
    var cubeHolder = new T.Group();      // rebuilt when L, depth or cut changes
    var rulerHolder = new T.Group();     // rebuilt when L changes
    var labelHolder = new T.Group();

    var agar = agarTexture(11);
    var mats = {
      shell: new T.MeshStandardMaterial({ color: 0xea4a93, roughness: 0.32, metalness: 0, map: agar, bumpMap: agar, bumpScale: 0.25, transparent: true, opacity: 0.93 }),
      core: new T.MeshStandardMaterial({ color: 0xe9f1e6, roughness: 0.3, metalness: 0, map: agar, bumpMap: agar, bumpScale: 0.25, transparent: true, opacity: 0.82 }),
      front: new T.LineBasicMaterial({ color: 0x9d0f55 }),
      steel: new T.MeshStandardMaterial({ color: 0xc9ced3, roughness: 0.22, metalness: 0.85 }),
      glass: new T.MeshStandardMaterial({ color: 0xcfe6f0, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.32, side: T.DoubleSide, depthWrite: false }),
      liquid: new T.MeshStandardMaterial({ color: 0xe9407f, roughness: 0.2, transparent: true, opacity: 0.85 })
    };

    /* tile (white ceramic, bevelled) */
    var tileGeo = new T.ExtrudeGeometry(roundedRect(3.3, 2.7, 0.14), { depth: 0.08, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 6 });
    var glaze = glazeTexture();
    var tile = new T.Mesh(tileGeo, new T.MeshStandardMaterial({ color: 0xfaf8f2, roughness: 0.28, metalness: 0, map: glaze }));
    tile.rotation.x = -Math.PI / 2; tile.position.set(0, -0.1, 0.1); tile.receiveShadow = true;

    /* ruler body */
    var ruler = new T.Group();
    var dish = buildDish(mats); dish.position.set(1.1, 0, -0.75);
    var scalpel = buildScalpel(mats); scalpel.position.set(-1.65 + 0.45, 0.034, -0.78); scalpel.rotation.y = 0.22;
    var cubeGroup = new T.Group(); cubeGroup.add(cubeHolder);

    content.add(tile, cubeGroup, ruler, dish, scalpel, labelHolder);
    ruler.add(rulerHolder);

    var parts = {
      tile: tagPart(tile, "tile"), ruler: tagPart(ruler, "ruler"), dish: tagPart(dish, "dish"), scalpel: tagPart(scalpel, "scalpel"),
      cube: cubeGroup, dye: null, core: null, front: null, labelL: null, labelCore: null
    };
    tagPart(cubeGroup, "cube");

    function mmToUnit() { var R = Math.max(4, Math.round(st.L_mm) + 2); return 2.0 / R; }
    function rulerLen() { return Math.max(4, Math.round(st.L_mm) + 2); }

    function label(text, h) {
      if (!global.SceneKit || !global.SceneKit.labelTexture) return new T.Group();
      var tex = global.SceneKit.labelTexture(text, { size: 34, bg: "rgba(10,15,29,0.88)", color: "#ffffff" });
      var sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
      sp.scale.set(h * tex.userData.aspect, h, 1); sp.renderOrder = 10; sp.userData.isLabel = true; sp.userData.ownMat = true;
      return sp;
    }

    function build() {
      var s = mmToUnit(), L = st.L_mm, rd = model(L, tNow, st.dyeDepth_mm, st.tau_min);
      var h = L * s / 2, c = Math.max(0, h - rd.depth_mm * s), cut = st.cutaway, eps = 1e-4;
      clear(cubeHolder);
      var dye = new T.Group(), core = new T.Group(), front = new T.Group();
      var hasCore = c > eps;

      if (!hasCore) {
        dye.add(slab(sq(h), null, -h, 0, mats.shell), slab(cut ? lShape(h) : sq(h), null, 0, h, mats.shell));
      } else {
        dye.add(
          slab(sq(h), null, -h, -c, mats.shell),
          slab(sq(h), sq(c), -c, 0, mats.shell),
          slab(cut ? cShape(h, c) : sq(h), cut ? null : sq(c), 0, c, mats.shell),
          slab(cut ? lShape(h) : sq(h), null, c, h, mats.shell)
        );
        var cm1 = slab(sq(c), null, -c, 0, mats.core), cm2 = slab(cut ? lShape(c) : sq(c), null, 0, c, mats.core);
        core.add(cm1, cm2);
        [cm1, cm2].forEach(function (m) {
          var ln = new T.LineSegments(new T.EdgesGeometry(m.geometry, 30), mats.front);
          front.add(ln);
        });
      }
      cubeHolder.add(core, dye, front);
      parts.dye = tagPart(dye, "dye"); parts.core = tagPart(core, "core"); parts.front = tagPart(front, "front");

      var x0 = -rulerLen() * s / 2;
      cubeGroup.position.set(x0 + h, h, 0);              // left edge on the ruler's zero, base on the tile

      /* ruler */
      clear(rulerHolder);
      var R = rulerLen(), rw = (R + 1) * s, rh = 0.34;
      var body = new T.Mesh(
        new T.ExtrudeGeometry(roundedRect(rw, rh, 0.03), { depth: 0.03, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 1, curveSegments: 3 }),
        new T.MeshStandardMaterial({ color: 0xf2e7bf, roughness: 0.45 })
      );
      body.rotation.x = -Math.PI / 2; body.userData.ownMat = true;
      var face = new T.Mesh(new T.PlaneGeometry(rw - 0.02, rh - 0.02), new T.MeshBasicMaterial({ map: rulerTexture(R) }));
      face.rotation.x = -Math.PI / 2; face.position.y = 0.0405; face.userData.ownMat = true;
      rulerHolder.add(body, face);
      ruler.position.set(x0 + R * s / 2, 0, h + 0.32 + 0.0 * s);
      ruler.position.z = Math.max(0.55, h + 0.3);

      /* labels */
      clear(labelHolder);
      parts.labelL = parts.labelCore = null;
      if (st.labels) {
        var lL = label("L = " + (Math.round(L * 10) / 10) + " mm", 0.15);
        lL.position.set(x0 + h, 2 * h + 0.2, 0); labelHolder.add(lL); parts.labelL = lL;
        if (hasCore) {
          var lc = label("undyed core", 0.14);
          lc.position.set(x0 + h + h * 0.3, h * 1.55, h + 0.02); labelHolder.add(lc); parts.labelCore = lc;
        }
      }
      lastBuild = performance.now();
      dirty = false;
    }

    function reading() { return model(st.L_mm, tNow, st.dyeDepth_mm, st.tau_min); }
    function emit(type) {
      var ev = { type: type, reading: reading() };
      root.dispatchEvent(ev);
      if (typeof opts.emit === "function") opts.emit(type, ev.reading);
    }

    function setState(o) {
      if (!o) return;
      var changed = false;
      if (o.L_mm != null) { st.L_mm = Math.min(6, Math.max(1, +o.L_mm)); changed = true; }
      if (o.dyeDepth_mm != null) { st.dyeDepth_mm = Math.max(0, +o.dyeDepth_mm); changed = true; }
      if (o.cutaway != null) { st.cutaway = !!o.cutaway; changed = true; }
      if (o.labels != null) { st.labels = !!o.labels; changed = true; }
      if (o.t_min != null) { st.t_min = Math.max(0, +o.t_min); tNow = st.t_min; playing = false; changed = true; }
      else if (changed && (o.L_mm != null)) { tNow = st.t_min; playing = false; }
      if (changed) { dirty = true; emit("change"); }
    }
    function play() {
      tNow = 0; playing = true; playRate = Math.max(0.1, st.t_min) / PLAY_SECONDS;
      dirty = true; emit("diffusion-start");
    }
    function reset() { playing = false; tNow = st.t_min; dirty = true; emit("change"); }

    function update(dt) {
      if (playing) {
        tNow = Math.min(st.t_min, tNow + dt * playRate);
        dirty = true;
        if (tNow >= st.t_min) { playing = false; build(); emit("diffusion-done"); return; }
      }
      if (dirty && (!playing || performance.now() - lastBuild > 45)) build();
    }

    build();
    attachCompat(root, parts, update, setState);
    root.play = play; root.reset = reset; root.reading = reading;
    root.getState = function () { var o = {}; for (var k in st) o[k] = st[k]; o.t_now = tNow; o.mmToUnit = mmToUnit(); return o; };
    root.isPlaying = function () { return playing; };
    return root;
  }

  /* ==========================================================
     v2  ·  mode: "acid"  (surface area : volume, phenolphthalein agar in dilute HCl)
     Alkali agar + phenolphthalein is PINK; where acid has diffused in it is COLOURLESS.
     So the pink core is what is left unreached. Four cubes sit in one beaker.
     ========================================================== */
  var ACID_SIDES = [5, 10, 20, 30];
  var ACID_DEPTH = 3.0;          // mm, depth on every face after ACID_TREF minutes
  var ACID_TREF = 8;             // minutes at which acidDepth_mm is reached (diffusion depth grows as sqrt(t))
  var LATE_MIN = 4;              // extra minutes in the acid when errors.lateLift is on
  var OVERSIZE_MM = 1;           // mm added to every side when errors.oversizedCube is on
  var ACID_S = 0.034;            // scene units per mm in the beaker
  var ACID_PLAY_SECONDS = 5;

  /* pure maths. L_mm is the nominal side the student writes down (1-30 mm). */
  function acidModel(L, o) {
    o = o || {};
    var e = o.errors || {};
    L = Math.min(30, Math.max(1, +L || 1));
    var dd = o.acidDepth_mm != null ? Math.max(0, +o.acidDepth_mm) : ACID_DEPTH;
    var t = Math.max(0, o.t_min != null ? +o.t_min : ACID_TREF);
    var Lp = L + (e.oversizedCube ? (o.oversize_mm != null ? +o.oversize_mm : OVERSIZE_MM) : 0);   // side actually cut
    var depth = Math.min(dd * Math.sqrt(t / ACID_TREF), Lp / 2);
    var core = Math.max(0, Lp - 2 * depth);                       // pink core, horizontal side, mm
    var coreH = core > 0 ? (e.flatOnFloor ? Lp - depth : core) : 0; // lying flat: the floor face gets no acid
    var pink = core * core * coreH;                                // = core^3 in the normal case
    var Vp = Lp * Lp * Lp;
    var SA = 6 * L * L, V = L * L * L;
    return {
      L_mm: L, L_actual_mm: Lp, SA: SA, V: V, ratio: SA / V,        // SA : V as the student works it out from L
      t_min: t, acidDepth_mm: dd, depth_mm: depth, core_mm: core, coreHeight_mm: coreH,
      pinkVolume: pink, colourlessVolume: Vp - pink, pctColourless: (Vp - pink) / Vp * 100
    };
  }

  function rectCutPoly(x0, x1, y0, y1, cutE) {                      // rectangle, minus the x>e,y>e quadrant when cutE is a number
    if (cutE == null || x1 <= cutE || y1 <= cutE) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    return [[x0, y0], [x1, y0], [x1, cutE], [cutE, cutE], [cutE, y1], [x0, y1]];
  }
  function cubeEdges(h, cut) {                                       // outline of the cube, with the octant notch
    var p = [], n = [-h, h], i, j;
    function seg(a, b) { p.push(a[0], a[1], a[2], b[0], b[1], b[2]); }
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) {
      var u = n[i], v = n[j], gone = cut && u > 0 && v > 0, end = gone ? 0 : h;
      seg([-h, u, v], [end, u, v]);                                  // edges along x at (y, z)
      seg([u, -h, v], [u, end, v]);                                  // edges along y at (x, z)
      seg([u, v, -h], [u, v, end]);                                  // edges along z at (x, y)
    }
    if (cut) {
      seg([0, 0, 0], [h, 0, 0]); seg([0, 0, 0], [0, h, 0]); seg([0, 0, 0], [0, 0, h]);
      seg([h, 0, 0], [h, h, 0]); seg([h, 0, 0], [h, 0, h]); seg([0, h, 0], [h, h, 0]);
      seg([0, h, 0], [0, h, h]); seg([0, 0, h], [h, 0, h]); seg([0, 0, h], [0, h, h]);
    }
    return p;
  }
  function acidTileTexture() {
    var T = global.THREE, W = 1024, H = 748, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d"), R = rng(5), i;
    x.fillStyle = "#f8f7f2"; x.fillRect(0, 0, W, H);
    for (i = 0; i < 500; i++) { x.fillStyle = "rgba(120,110,95," + (0.03 + R() * 0.05) + ")"; x.fillRect(R() * W, R() * H, 1, 1); }
    var cell = 0.34 / 5.2 * W;                                        // one grid square = 10 mm
    x.strokeStyle = "rgba(70,110,150,0.26)"; x.lineWidth = 1.5;
    for (i = 0; i * cell <= W; i++) { x.beginPath(); x.moveTo(i * cell, 0); x.lineTo(i * cell, H); x.stroke(); }
    for (i = 0; i * cell <= H; i++) { x.beginPath(); x.moveTo(0, i * cell); x.lineTo(W, i * cell); x.stroke(); }
    var t = new T.CanvasTexture(c); t.anisotropy = 4; return srgb(t);
  }
  function acidRulerTexture(Rmm, aspect) {
    var T = global.THREE, px = 22, w = (Rmm + 1) * px, h = Math.round(w / aspect), c = document.createElement("canvas");
    c.width = w; c.height = h;
    var x = c.getContext("2d"), i;
    x.fillStyle = "#f2e7bf"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "#1b1b1b"; x.fillStyle = "#1b1b1b"; x.lineWidth = 1.6;
    x.font = "700 " + Math.round(h * 0.26) + "px sans-serif"; x.textAlign = "center"; x.textBaseline = "top";
    for (i = 0; i <= Rmm; i++) {
      var X = (i + 0.5) * px, len = i % 10 === 0 ? h * 0.46 : (i % 5 === 0 ? h * 0.34 : h * 0.22);
      x.beginPath(); x.moveTo(X, 0); x.lineTo(X, len); x.stroke();
      if (i % 5 === 0) x.fillText(String(i), X, h * 0.5);
    }
    x.font = "600 " + Math.round(h * 0.2) + "px sans-serif"; x.textAlign = "right"; x.fillText("mm", w - 6, h * 0.72);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; return srgb(t);
  }
  function beakerLabelTexture() {
    var T = global.THREE, c = document.createElement("canvas"); c.width = 512; c.height = 512;
    var x = c.getContext("2d"), i;
    x.clearRect(0, 0, 512, 512);
    x.strokeStyle = "rgba(255,255,255,0.85)"; x.fillStyle = "rgba(255,255,255,0.9)"; x.lineWidth = 3;   // graduation lines
    x.font = "700 26px sans-serif"; x.textAlign = "right";
    for (i = 0; i < 9; i++) {
      var y = 470 - i * 48, big = i % 2 === 0;
      x.beginPath(); x.moveTo(430, y); x.lineTo(430 + (big ? 56 : 32), y); x.stroke();
      if (big && i > 0) x.fillText(String(i * 25 + 25), 420, y + 9);
    }
    x.fillStyle = "rgba(255,255,255,0.93)";                                    // printed label panel
    x.fillRect(40, 150, 300, 150);
    x.strokeStyle = "#c0392b"; x.lineWidth = 6; x.strokeRect(46, 156, 288, 138);
    x.fillStyle = "#222"; x.textAlign = "center"; x.font = "800 48px sans-serif"; x.fillText("HCl", 190, 214);
    x.font = "700 27px sans-serif"; x.fillText("dilute hydrochloric", 190, 254); x.fillText("acid", 190, 284);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; return srgb(t);
  }
  function clockFaceTexture() {                                                // dial: one turn = 15 minutes, the 8 min mark in red
    var T = global.THREE, S = 256, c = document.createElement("canvas"); c.width = c.height = S;
    var x = c.getContext("2d"), i, a;
    x.fillStyle = "#fbfaf5"; x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, 6.2832); x.fill();
    x.textAlign = "center"; x.textBaseline = "middle";
    for (i = 0; i < 60; i++) {
      a = i / 60 * 6.2832; var maj = i % 4 === 0, r1 = S / 2 - 8, r2 = r1 - (maj ? 18 : 9);
      x.strokeStyle = (i === 32) ? "#d8312a" : "#1b1b1b"; x.lineWidth = maj ? 3.5 : 1.5;
      x.beginPath(); x.moveTo(S / 2 + Math.sin(a) * r1, S / 2 - Math.cos(a) * r1); x.lineTo(S / 2 + Math.sin(a) * r2, S / 2 - Math.cos(a) * r2); x.stroke();
    }
    x.font = "700 26px sans-serif";
    [0, 2, 4, 6, 8, 10, 12, 14].forEach(function (m) {
      a = m / 15 * 6.2832; x.fillStyle = m === 8 ? "#d8312a" : "#1b1b1b";
      x.fillText(String(m), S / 2 + Math.sin(a) * (S / 2 - 46), S / 2 - Math.cos(a) * (S / 2 - 46));
    });
    x.fillStyle = "#333"; x.font = "600 20px sans-serif"; x.fillText("min", S / 2, S / 2 + 46);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; return srgb(t);
  }
  function armShape(len, sign) {
    var T = global.THREE, cl = [[0, 0.0], [0.18, 0.05], [0.45, 0.075], [0.8, 0.05], [len, 0.014]], top = [], bot = [], i, w;
    for (i = 0; i < cl.length; i++) {
      w = 0.034 - 0.022 * (cl[i][0] / len) + (i === 0 ? 0.01 : 0);       // thinner toward the tip
      top.push([cl[i][0], sign * (cl[i][1] + w / 2)]); bot.push([cl[i][0], sign * (cl[i][1] - w / 2)]);
    }
    var s = new T.Shape(), pts = top.concat(bot.reverse());
    pts.forEach(function (p, k) { if (k) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); });
    s.closePath(); return s;
  }
  function buildForceps(mats, len) {
    var T = global.THREE, g = new T.Group(), flat = new T.Group(), i;
    [1, -1].forEach(function (sg) {
      var geo = new T.ExtrudeGeometry(armShape(len, sg), { depth: 0.03, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 1, curveSegments: 3 });
      flat.add(new T.Mesh(geo, mats.steel));
      var pad = new T.Mesh(new T.BoxGeometry(0.16, 0.02, 0.04), mats.steel);               // serrated tip pad
      pad.position.set(len - 0.08, sg * 0.0155, 0.015); flat.add(pad);
      for (i = 0; i < 4; i++) {                                                           // finger grip ridges
        var rg = new T.Mesh(new T.BoxGeometry(0.014, 0.012, 0.036), mats.steel);
        rg.position.set(0.3 + i * 0.05, sg * (0.075 + 0.02), 0.015); flat.add(rg);
      }
    });
    var piv = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.05, 14), mats.steel);        // pivot / rivet at the back
    piv.rotation.x = Math.PI / 2; piv.position.set(0.04, 0, 0.015); flat.add(piv);
    var cap = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.058, 12), mats.steelDark);
    cap.rotation.x = Math.PI / 2; cap.position.set(0.04, 0, 0.015); flat.add(cap);
    flat.rotation.x = -Math.PI / 2;                                                        // lies flat on the tile
    g.add(flat); return g;
  }

  function createAcid(opts) {
    var T = global.THREE, s = ACID_S;
    function cl(v) { return Math.min(30, Math.max(1, +v || 1)); }
    function cleanSides(a) {
      var o = []; (a || []).forEach(function (v) { v = cl(v); if (o.indexOf(v) < 0) o.push(v); });
      return o.slice(0, 4);
    }
    var st = {
      mode: "acid",
      sides: cleanSides(opts.sides && opts.sides.length ? opts.sides : (opts.L_mm != null ? [opts.L_mm] : ACID_SIDES)),
      acidDepth_mm: opts.acidDepth_mm != null ? Math.max(0, +opts.acidDepth_mm) : ACID_DEPTH,
      t_min: opts.t_min != null ? Math.max(0, +opts.t_min) : ACID_TREF,
      errors: { lateLift: false, flatOnFloor: false, oversizedCube: false },
      cutaway: opts.cutaway !== false,
      labels: opts.labels !== false,
      selected: null
    };
    mergeErr(opts.errors);
    if (!st.sides.length) st.sides = ACID_SIDES.slice();
    st.selected = (opts.L_mm != null && st.sides.indexOf(cl(opts.L_mm)) >= 0) ? cl(opts.L_mm) : st.sides[0];
    function mergeErr(e) { if (!e) return; for (var k in st.errors) if (e[k] != null) st.errors[k] = !!e[k]; }
    function tEnd() { return st.t_min + (st.errors.lateLift ? LATE_MIN : 0); }

    var tNow = tEnd(), playing = false, playRate = 0, dirty = true, lastBuild = -1, fu = 1, measured = [];
    var root = new T.Group(), content = new T.Group(); root.add(content);
    var cubesHolder = new T.Group(), labelHolder = new T.Group();
    var BX = -0.7, BZ = -0.15, FLOOR = 0.06, RI = 1.3, LEVEL = 1.5;

    var agar = agarTexture(11);
    var mats = {
      clear: new T.MeshStandardMaterial({ color: 0xd4eaf0, roughness: 0.12, metalness: 0, transparent: true, opacity: 0.4, depthWrite: false }),
      pink: new T.MeshStandardMaterial({ color: 0xde2f86, roughness: 0.36, metalness: 0, map: agar, bumpMap: agar, bumpScale: 0.25 }),
      steel: new T.MeshStandardMaterial({ color: 0xc9ced3, roughness: 0.22, metalness: 0.85 }),
      steelDark: new T.MeshStandardMaterial({ color: 0x5b6169, roughness: 0.4, metalness: 0.7 }),
      glass: new T.MeshStandardMaterial({ color: 0xcfe6f0, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.3, side: T.DoubleSide, depthWrite: false }),
      acid: new T.MeshStandardMaterial({ color: 0xcfe9f2, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.2, side: T.DoubleSide, depthWrite: false }),
      edge: new T.LineBasicMaterial({ color: 0xdff4f7, transparent: true, opacity: 0.8 }),
      edgeSel: new T.LineBasicMaterial({ color: 0xffd166 }),
      face: new T.MeshBasicMaterial({ transparent: true, depthWrite: false })
    };

    /* tile (white ceramic, 10 mm grid) */
    var TW = 5.2, TH = 3.8;
    var tileGeo = new T.ExtrudeGeometry(roundedRect(TW, TH, 0.16), { depth: 0.08, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 6 });
    (function () { var p = tileGeo.attributes.position, uv = tileGeo.attributes.uv; for (var i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / TW + 0.5, p.getY(i) / TH + 0.5); uv.needsUpdate = true; })();
    var tile = new T.Mesh(tileGeo, new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0, map: acidTileTexture() }));
    tile.rotation.x = -Math.PI / 2; tile.position.set(0, -0.1, 0.2); tile.receiveShadow = true;

    /* beaker: glass lathe with rolled rim, graduations and an acid label */
    var beaker = new T.Group(), BH = 2.3;
    var bp = [[0, 0], [1.25, 0], [1.33, 0.02], [1.36, 0.08], [1.365, BH - 0.02], [1.38, BH + 0.01], [1.395, BH + 0.03], [1.37, BH + 0.045], [1.33, BH + 0.03], [1.32, BH], [RI, BH - 0.02], [RI, 0.1], [1.25, 0.065], [0, FLOOR]]
      .map(function (p) { return new T.Vector2(p[0], p[1]); });
    var glassMesh = new T.Mesh(new T.LatheGeometry(bp, 40), mats.glass); glassMesh.renderOrder = 4;
    beaker.add(glassMesh);
    var spout = new T.Mesh(new T.ConeGeometry(0.1, 0.12, 4), mats.glass); spout.rotation.set(0, Math.PI / 4, Math.PI); spout.position.set(-0.0, BH + 0.0, -1.42); spout.visible = false;
    var plate = new T.Mesh(new T.CylinderGeometry(1.372, 1.372, 1.6, 28, 1, true, -0.9, 1.8),
      (function () { var m = mats.face.clone(); m.map = beakerLabelTexture(); return m; })());
    plate.position.y = 1.2; plate.renderOrder = 5; beaker.add(plate);
    beaker.position.set(BX, 0, BZ);
    var lp = [[0, FLOOR + 0.002], [RI - 0.005, FLOOR + 0.002], [RI - 0.005, LEVEL - 0.05], [RI + 0.0, LEVEL + 0.04], [RI - 0.05, LEVEL + 0.012], [RI - 0.16, LEVEL], [0, LEVEL]]
      .map(function (p) { return new T.Vector2(p[0], p[1]); });
    var acid = new T.Mesh(new T.LatheGeometry(lp, 40), mats.acid); acid.renderOrder = 1;
    acid.position.set(BX, 0, BZ);

    /* ruler (0-40 mm, to scale) */
    var ruler = new T.Group(), R = 40, rw = (R + 1) * s, rh = 0.3;
    var rbody = new T.Mesh(new T.ExtrudeGeometry(roundedRect(rw, rh, 0.03), { depth: 0.03, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 1, curveSegments: 3 }), new T.MeshStandardMaterial({ color: 0xf2e7bf, roughness: 0.45 }));
    rbody.rotation.x = -Math.PI / 2;
    var rface = new T.Mesh(new T.PlaneGeometry(rw - 0.02, rh - 0.02), new T.MeshBasicMaterial({ map: acidRulerTexture(R, (rw - 0.02) / (rh - 0.02)) }));
    rface.rotation.x = -Math.PI / 2; rface.position.y = 0.0405;
    ruler.add(rbody, rface); ruler.position.set(-1.6, 0.0, 1.5);

    /* scalpel blade */
    var blade = buildScalpel(mats); blade.position.set(1.55, 0.034, 0.85); blade.rotation.y = 0.5;

    /* forceps */
    var FLEN = 1.25, forceps = buildForceps(mats, FLEN);
    var REST = { x: 0.35, y: 0.026, z: 1.5, ry: 0.12, rz: 0 }, READY = { x: 1.55, y: 3.0, z: 0.9, ry: 0, rz: -2.5 };
    function poseForceps(u) {
      forceps.position.set(REST.x + (READY.x - REST.x) * u, REST.y + (READY.y - REST.y) * u, REST.z + (READY.z - REST.z) * u);
      forceps.rotation.set(0, REST.ry + (READY.ry - REST.ry) * u, REST.rz + (READY.rz - REST.rz) * u);
    }

    /* clock (one turn = 15 min; red mark at 8 min) */
    var clock = new T.Group();
    var foot = new T.Mesh(new T.LatheGeometry([[0, 0], [0.42, 0], [0.46, 0.04], [0.4, 0.09], [0.12, 0.13], [0.09, 0.4]].map(function (p) { return new T.Vector2(p[0], p[1]); }), 24), mats.steel);
    var bezel = new T.Mesh(new T.LatheGeometry([[0.55, -0.05], [0.63, -0.05], [0.66, 0.0], [0.63, 0.06], [0.55, 0.075]].map(function (p) { return new T.Vector2(p[0], p[1]); }), 36), mats.steel);
    bezel.rotation.x = Math.PI / 2; bezel.position.y = 1.0;
    var dial = new T.Mesh(new T.CircleGeometry(0.56, 40), new T.MeshBasicMaterial({ map: clockFaceTexture() })); dial.position.set(0, 1.0, 0.0);
    var hand = new T.Group();
    var hm = new T.Mesh(new T.BoxGeometry(0.026, 0.4, 0.012), new T.MeshBasicMaterial({ color: 0xd8312a })); hm.position.y = 0.16;
    var hub = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.02, 14), mats.steelDark); hub.rotation.x = Math.PI / 2;
    hand.add(hm, hub); hand.position.set(0, 1.0, 0.02);
    clock.add(foot, bezel, dial, hand); clock.position.set(1.9, 0, -0.85); clock.rotation.y = -0.45;

    content.add(tile, beaker, acid, cubesHolder, labelHolder, ruler, blade, forceps, clock);

    var parts = {
      tile: tagPart(tile, "tile"), beaker: tagPart(beaker, "beaker"), acid: tagPart(acid, "acid"), forceps: tagPart(forceps, "forceps"),
      ruler: tagPart(ruler, "ruler"), blade: tagPart(blade, "blade"), clock: tagPart(clock, "clock"),
      cube: cubesHolder, cubes: {}, core: null, labelL: null, labelCore: null
    };

    var SLOTS = [[-0.45, -0.2], [0.55, -0.1], [0.1, 0.65], [-0.62, 0.7]];
    var YAW = [0, 0.1, -0.2, 0.3];

    function label(text, h, sel) {
      if (!global.SceneKit || !global.SceneKit.labelTexture) return new T.Group();
      var tex = global.SceneKit.labelTexture(text, { size: 34, bg: sel ? "rgba(150,100,0,0.92)" : "rgba(10,15,29,0.88)", color: "#ffffff" });
      var sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
      sp.scale.set(h * tex.userData.aspect, h, 1); sp.renderOrder = 10; sp.userData.isLabel = true; sp.userData.ownMat = true;
      return sp;
    }
    function modelOpts(t) { return { acidDepth_mm: st.acidDepth_mm, t_min: t, errors: st.errors }; }

    function buildCube(rd, sel) {
      var g = new T.Group(), shell = new T.Group(), core = new T.Group();
      var Lp = rd.L_actual_mm, h = Lp * s / 2, cut = st.cutaway, e = 0.004;
      shell.add(slab(sq(h), null, -h, 0, mats.clear), slab(cut ? lShape(h) : sq(h), null, 0, h, mats.clear));
      shell.children.forEach(function (m) { m.renderOrder = 2; });
      var cx = rd.core_mm * s / 2;
      if (cx > e * 2) {
        var flat = rd.coreHeight_mm !== rd.core_mm, ya = flat ? -h : -cx, yb = flat ? h - rd.depth_mm * s : cx;
        var cE = cut ? e : null;
        core.add(slab(rectCutPoly(-cx, cx, ya, yb, null), null, -cx, cut ? e : 0, mats.pink));
        core.add(slab(rectCutPoly(-cx, cx, ya, yb, cE), null, cut ? e : 0, cx, mats.pink));
      }
      var eg = new T.BufferGeometry();
      eg.setAttribute("position", new T.Float32BufferAttribute(cubeEdges(h, cut), 3));
      var edges = new T.LineSegments(eg, sel ? mats.edgeSel : mats.edge);
      g.add(core, shell, edges);
      g.userData.ownMat = false;
      return { group: g, core: core, h: h };
    }

    function build() {
      clear(cubesHolder); clear(labelHolder);
      parts.cubes = {}; parts.core = null; parts.labelL = null; parts.labelCore = null;
      var order = st.sides.slice().sort(function (a, b) { return b - a; });
      order.forEach(function (L, i) {
        var rd = acidModel(L, modelOpts(tNow)), c = buildCube(rd, L === st.selected), slot = SLOTS[Math.min(i, 3)];
        if (order.length === 1) slot = [0, 0];
        c.group.position.set(BX + slot[0], FLOOR + c.h, BZ + slot[1]);
        c.group.rotation.y = YAW[Math.min(i, 3)];
        tagPart(c.group, "cube"); tagPart(c.core, "core");
        c.group.userData.side = L; cubesHolder.add(c.group);
        parts.cubes[String(L)] = c.group;
        if (L === st.selected) parts.core = c.core;
        if (st.labels) {
          var lb = label(L + " mm", 0.15, L === st.selected);
          lb.position.set(BX + slot[0], BH + 0.3 + (i % 2) * 0.2, BZ + slot[1]); labelHolder.add(lb);
          if (L === st.selected) parts.labelL = lb;
        }
      });
      lastBuild = performance.now(); dirty = false;
    }

    function reading(L) { return acidModel(L != null ? cl(L) : st.selected, modelOpts(tNow)); }
    function readings() { return st.sides.slice().sort(function (a, b) { return a - b; }).map(function (L) { return reading(L); }); }
    function emit(type, extra) {
      var ev = { type: type, reading: reading() };
      if (extra) for (var k in extra) ev[k] = extra[k];
      root.dispatchEvent(ev);
      if (typeof opts.emit === "function") opts.emit(type, ev.reading);
    }

    function setState(o) {
      if (!o) return;
      var changed = false, timeChanged = false;
      if (o.sides && o.sides.length) { st.sides = cleanSides(o.sides); if (st.sides.indexOf(st.selected) < 0) st.selected = st.sides[0]; measured = []; changed = true; }
      if (o.L_mm != null) {
        var L = cl(o.L_mm);
        if (st.sides.indexOf(L) < 0) { st.sides = [L]; measured = []; }
        st.selected = L; changed = true;
      }
      if (o.selected != null && st.sides.indexOf(cl(o.selected)) >= 0) { st.selected = cl(o.selected); changed = true; }
      if (o.acidDepth_mm != null) { st.acidDepth_mm = Math.max(0, +o.acidDepth_mm); changed = true; }
      if (o.cutaway != null) { st.cutaway = !!o.cutaway; changed = true; }
      if (o.labels != null) { st.labels = !!o.labels; changed = true; }
      if (o.errors) { mergeErr(o.errors); changed = timeChanged = true; }
      if (o.t_min != null) { st.t_min = Math.max(0, +o.t_min); changed = timeChanged = true; }
      if (timeChanged) { tNow = tEnd(); playing = false; }
      if (changed) { dirty = true; emit("change"); }
    }
    function select(L) { setState({ selected: L }); emit("select"); }
    function measure(L) {
      if (L != null) select(L);
      if (measured.indexOf(st.selected) < 0) measured.push(st.selected);
      emit("measure", { measured: measured.slice() });
      if (measured.length >= st.sides.length) emit("measure-done", { measured: measured.slice() });
      return reading();
    }
    function play() { tNow = 0; playing = true; playRate = Math.max(0.1, tEnd()) / ACID_PLAY_SECONDS; dirty = true; emit("acid-start"); }
    function reset() { playing = false; tNow = tEnd(); measured = []; dirty = true; emit("change"); }

    function update(dt) {
      if (playing) {
        tNow = Math.min(tEnd(), tNow + dt * playRate); dirty = true;
        if (tNow >= tEnd()) { playing = false; build(); emit("acid-done"); }
      }
      hand.rotation.z = -(tNow / 15) * Math.PI * 2;
      var target = playing ? 0 : 1; fu += (target - fu) * Math.min(1, dt * 3); poseForceps(fu);
      if (dirty && (!playing || performance.now() - lastBuild > 60)) build();
    }

    build(); poseForceps(fu);
    attachCompat(root, parts, update, setState);
    root.play = play; root.reset = reset; root.reading = reading; root.readings = readings; root.select = select; root.measure = measure;
    root.getState = function () {
      var o = {}; for (var k in st) o[k] = st[k];
      o.errors = {}; for (var j in st.errors) o.errors[j] = st.errors[j];
      o.sides = st.sides.slice(); o.t_now = tNow; o.t_end = tEnd(); o.measured = measured.slice(); o.mmToUnit = s; return o;
    };
    root.isPlaying = function () { return playing; };
    return root;
  }

  global.AgarCubeKit = {
    version: 2, LEVELS: LEVELS, TAU_MIN: TAU_MIN, ACID_SIDES: ACID_SIDES, ACID_DEPTH_MM: ACID_DEPTH, ACID_TREF_MIN: ACID_TREF,
    create: function (opts) { return (opts && opts.mode === "acid") ? createAcid(opts) : create(opts); },
    model: model, acidModel: acidModel, makeHighlighter: makeHighlighter
  };
})(window);
