/* ==========================================================
   StudyPipe Kit: agar-cube-bench (v1)  ·  window.AgarCubeKit
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

  global.AgarCubeKit = {
    version: 1, LEVELS: LEVELS, TAU_MIN: TAU_MIN,
    create: create, model: model, makeHighlighter: makeHighlighter
  };
})(window);
