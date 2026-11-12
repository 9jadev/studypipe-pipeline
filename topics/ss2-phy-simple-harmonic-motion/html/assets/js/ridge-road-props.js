/* =========================================================
   StudyPipe · RidgeRoadProps v1 — shared story props for the Simple Harmonic Motion unit
   ("The Cracked Crates of Ridge Road", a laterite farm road near Ogbomoso).
   Classic script (no modules), 100% offline, uses window.THREE only
   (window.StoryStage is optional: used only when a rider person is requested).

   Scale: 1 unit = 1 metre, y up, the StoryStage scale (people are about 1.75 m tall,
   lab bench top y = 0.99 in lab-local space). Every prop stands on y = 0 at its own
   origin. The okada's nose is +x, its right-hand side (exhaust, kick-start) faces +z.

   RidgeRoadProps.
     okada(opts)            motorcycle: frame, tank, seat, engine with fins, exhaust, spoked wheels,
                            fork with gaiters, handlebar + speedometer, headlamp, swing-arm, chain,
                            twin rear coil-overs, carrier rack with egg crates + trays (instanced eggs).
                            setBounce(y) setWheelBump(yF, yR) setSpeed(kmh) liftCrate(dy) crack()
                            setCrates(n) setMud(on) setCentreStand(on) seatRider(person) anchorLocal(name)
     road(opts)             laterite road with concrete drainage ridges every d = 2.5 m, verges, ditch;
                            bumpAt(x), scroll(s) (treadmill mode for the L07 bench)
     createCrate / createEggTray / createShock / createGate / createPoultryPen / createShed /
     createBarton / createPendulumStand / createSpringStand
     dressRoad(api, opts)   StoryStage Set 1 -> Ridge Road (gate, pen, Sule's shed, okada, ridges)
     dressLab(api, opts)    StoryStage Set 2 -> school physics lab (pendulum, loaded spring, Barton frame)
     model                  story-model formulas (same numbers as 02-lesson.md and welcome-lab.js)
     makeHighlighter(scene) pulse named parts (userData.partId)
   Every builder returns a THREE.Group g with g.parts, g.update(dt, t), g.setState(o), g.reading().
   ========================================================= */
(function (global) {
  "use strict";
  var THREE = global.THREE;
  if (!THREE) return;
  var TAU = Math.PI * 2, V3 = THREE.Vector3, G = 9.8;

  /* ================================================================ quality (level of detail) */
  /* 'auto' -> low when the viewport's shorter side < 600 px or navigator.deviceMemory <= 4 */
  var QL = false, QD = 0;
  function autoLow() {
    var w = global.innerWidth || 1024, h = global.innerHeight || 768, mem = global.navigator && global.navigator.deviceMemory;
    return Math.min(w, h) < 600 || (mem != null && mem <= 4);
  }
  function resolveQ(q) { if (q === "low") return true; if (q === "high") return false; if (q == null && QD > 0) return QL; return autoLow(); }
  function withQ(q, fn) { var prev = QL; QL = resolveQ(q); QD++; try { return fn(); } finally { QD--; QL = prev; } }
  function S(high, low) { return QL ? low : high; }

  /* ================================================================ helpers */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if ("encoding" in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function canvasTex(w, h, draw, opts) {
    opts = opts || {};
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (opts.color !== false) srgb(t);
    t.anisotropy = 4;
    if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(opts.repeat[0], opts.repeat[1]); }
    t.userData = { canvas: c };
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
  function v3(x, y, z) { return Array.isArray(x) ? new V3(x[0], x[1], x[2]) : new V3(x, y, z || 0); }

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
    function clear() { for (var i = 0; i < saved.length; i++) saved[i].mesh.material = saved[i].orig; saved.length = 0; }
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

  /* ---------- geometry builders (return BufferGeometry, no mesh) ---------- */
  function gLathe(profile, segs, phi0, phiLen) {
    segs = segs || 24; if (QL) segs = Math.min(segs, Math.max(6, Math.round(segs * 0.55)));
    var pts = profile.map(function (p) { return new THREE.Vector2(Math.max(0.0004, p[0]), p[1]); });
    return new THREE.LatheGeometry(pts, segs || 24, phi0 || 0, phiLen || TAU);
  }
  function gTube(pts, r, segs, rad, closed, tension) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return Array.isArray(p) ? v3(p) : p; }), !!closed, "catmullrom", tension == null ? 0.5 : tension);
    segs = segs || 32; rad = rad || 8;
    if (QL) { segs = Math.max(4, Math.round(segs * 0.5)); rad = Math.max(4, Math.round(rad * 0.67)); }
    var g = new THREE.TubeGeometry(curve, segs || 32, r, rad || 8, !!closed);
    g.userData.curve = curve;
    return g;
  }
  var _up = new V3(0, 1, 0);
  function mAxis(p, dir) {           // matrix that moves +y onto dir, origin to p
    var q = new THREE.Quaternion().setFromUnitVectors(_up, dir.clone().normalize());
    return new THREE.Matrix4().compose(p, q, new V3(1, 1, 1));
  }
  function mT(x, y, z) { return new THREE.Matrix4().makeTranslation(x, y, z); }
  function mTR(x, y, z, rx, ry, rz) { return new THREE.Matrix4().compose(new V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new V3(1, 1, 1)); }
  function gRod(a, b, r, seg, open) {
    a = Array.isArray(a) ? v3(a) : a; b = Array.isArray(b) ? v3(b) : b;
    var d = new V3().subVectors(b, a), len = d.length();
    seg = seg || 10; if (QL) seg = Math.max(4, Math.round(seg * 0.6));
    var g = new THREE.CylinderGeometry(r, r, len, seg, 1, !!open);
    g.applyMatrix4(mAxis(a.clone().addScaledVector(d, 0.5), d));
    return g;
  }
  /* ExtrudeGeometry with fewer curve/bevel/step segments at low quality */
  function Extrude(shape, o) {
    o = o || {};
    if (QL) {
      var q = {}; for (var k in o) q[k] = o[k];
      q.curveSegments = Math.max(3, Math.round((o.curveSegments || 12) * 0.4));
      if (q.bevelEnabled) q.bevelSegments = 1;
      if (q.steps) q.steps = Math.max(4, Math.round(q.steps * 0.45));
      o = q;
    }
    return new THREE.ExtrudeGeometry(shape, o);
  }
  function roundedRectShape(w, h, r, cx, cy) {
    var s = new THREE.Shape(), x = (cx || 0) - w / 2, y = (cy || 0) - h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function roundedRectPath(w, h, r, cx, cy) {
    var s = new THREE.Path(), x = (cx || 0) - w / 2, y = (cy || 0) - h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function splineShape(pts) {
    var v = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var s = new THREE.Shape(); s.moveTo(v[0].x, v[0].y); s.splineThru(v.slice(1).concat([v[0]]));
    return s;
  }
  function circlePath(cx, cy, r, ccw) { var p = new THREE.Path(); p.absarc(cx, cy, r, 0, TAU, !ccw); return p; }
  /* plank / slat: chamfered rectangle extruded (centred), long axis = x */
  function gPlank(len, h, t, ch) {
    ch = ch == null ? Math.min(h, t) * 0.18 : ch;
    var s = new THREE.Shape();
    s.moveTo(-t / 2 + ch, -h / 2); s.lineTo(t / 2 - ch, -h / 2); s.lineTo(t / 2, -h / 2 + ch); s.lineTo(t / 2, h / 2 - ch);
    s.lineTo(t / 2 - ch, h / 2); s.lineTo(-t / 2 + ch, h / 2); s.lineTo(-t / 2, h / 2 - ch); s.lineTo(-t / 2, -h / 2 + ch); s.lineTo(-t / 2 + ch, -h / 2);
    var g = Extrude(s, { depth: len, bevelEnabled: false });
    g.translate(0, 0, -len / 2); g.rotateY(Math.PI / 2);
    // planar UVs along the length so wood grain runs the right way
    var p = g.attributes.position, uv = g.attributes.uv;
    for (var i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 2.2 + 0.5, (p.getY(i) + p.getZ(i)) * 6 + 0.5);
    return g;
  }
  function helixPts(r, len, turns, n, close) {
    var pts = [], i;
    n = n || Math.round(turns * 14);
    for (i = 0; i <= n; i++) {
      var u = i / n, a = u * turns * TAU;
      var y = close ? len * (u - 0.9 * Math.sin(TAU * u) / TAU) : u * len;
      pts.push(new V3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return pts;
  }

  /* ---------- merge many geometries into one (fewer draw calls) ---------- */
  function mergeGeos(list) {
    var hasColor = list.some(function (g) { return !!g.attributes.color; });
    var parts = [], total = 0;
    list.forEach(function (g) {
      var ng = g.index ? g.toNonIndexed() : g;
      if (!ng.attributes.normal) ng.computeVertexNormals();
      parts.push(ng); total += ng.attributes.position.count;
    });
    var pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), uv = new Float32Array(total * 2), col = hasColor ? new Float32Array(total * 3) : null;
    var o = 0;
    parts.forEach(function (g) {
      var n = g.attributes.position.count;
      pos.set(g.attributes.position.array.subarray(0, n * 3), o * 3);
      nor.set(g.attributes.normal.array.subarray(0, n * 3), o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array.subarray(0, n * 2), o * 2);
      if (col) { if (g.attributes.color) col.set(g.attributes.color.array.subarray(0, n * 3), o * 3); else col.fill(1, o * 3, (o + n) * 3); }
      o += n;
    });
    var out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    if (col) out.setAttribute("color", new THREE.BufferAttribute(col, 3));
    out.computeBoundingSphere();
    return out;
  }
  /* Batch: collect (part, material, geometry) and build one mesh per part+material */
  function Batch() { this.map = {}; this.keys = []; }
  Batch.prototype.add = function (part, mat, geo, mtx) {
    var key = part + "|" + mat.uuid;
    if (!this.map[key]) { this.map[key] = { part: part, mat: mat, geos: [] }; this.keys.push(key); }
    var g = geo.clone(); if (mtx) g.applyMatrix4(mtx);
    this.map[key].geos.push(g);
    return this;
  };
  Batch.prototype.flush = function (parent, inv, parts) {
    var self = this; parts = parts || {};
    this.keys.forEach(function (k) {
      var it = self.map[k];
      var geo = mergeGeos(it.geos);
      if (inv) geo.applyMatrix4(inv);
      var m = new THREE.Mesh(geo, it.mat);
      tagPart(m, it.part); parent.add(m);
      if (!parts[it.part]) parts[it.part] = m;       // first mesh stands for the part (highlight uses partId on all)
    });
    this.map = {}; this.keys = [];
    return parts;
  };
  /* bakeStatic: merge the static meshes under root into one mesh per material (or into ONE vertex-coloured
     mesh with vertexColor: true). keep(obj) skips a subtree; shallow: only direct children. Low quality only. */
  var BAKE_MAT = null;
  function bakeMat() { return BAKE_MAT || (BAKE_MAT = std(0xffffff, 0.5, 0.3, { vertexColors: true })); }
  function colourise(g, col) {
    var n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
  }
  function bakeStatic(root, o) {
    o = o || {};
    root.updateMatrixWorld(true);
    var inv = root.matrixWorld.clone().invert(), groups = {}, keys = [], victims = [], rel = new THREE.Matrix4();
    function visit(obj) {
      if (o.keep && o.keep(obj)) return;
      if (obj.isMesh && !obj.isInstancedMesh && !Array.isArray(obj.material) && obj.visible && obj.geometry && obj.children.length === 0) {
        var m = obj.material;
        if (!(o.vertexColor && m.transparent)) {
          var key = o.vertexColor ? "vc" : m.uuid;
          if (!groups[key]) { groups[key] = { mat: o.vertexColor ? bakeMat() : m, geos: [] }; keys.push(key); }
          var g = obj.geometry.clone(); g.applyMatrix4(rel.multiplyMatrices(inv, obj.matrixWorld));
          if (o.vertexColor) { g.deleteAttribute("color"); colourise(g, m.userData.avg != null ? new THREE.Color(m.userData.avg) : m.color); }
          groups[key].geos.push(g); victims.push(obj);
          return;
        }
      }
      if (!o.shallow) obj.children.slice().forEach(visit);
    }
    root.children.slice().forEach(visit);
    victims.forEach(function (v) { if (v.parent) v.parent.remove(v); });
    var first = null, part = o.part || root.userData.partId;
    keys.forEach(function (k) {
      var gr = groups[k], mesh = new THREE.Mesh(mergeGeos(gr.geos), gr.mat);
      if (part) mesh.userData.partId = part;
      root.add(mesh); if (!first) first = mesh;
    });
    if (o.parts) Object.keys(o.parts).forEach(function (k) { if (victims.indexOf(o.parts[k]) >= 0) o.parts[k] = first; });
    return { mesh: first, victims: victims };
  }

  /* a part handle that may stand for several meshes: return an Object3D usable for rects */
  function partProxy(parts, key) {
    var p = parts[key];
    return p;
  }

  /* ================================================================ textures */
  var TEX = {};
  function once(key, make) { return TEX[key] || (TEX[key] = make()); }
  function speckle(g, w, h, cols, n, seed, size, alpha) {
    var r = rng(seed);
    for (var i = 0; i < n; i++) {
      g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = (alpha || 0.25) + r() * 0.55;
      var s = (size || 2) * (0.35 + r());
      g.beginPath(); g.arc(r() * w, r() * h, s, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
  }
  function grainLines(g, w, h, dark, n, seed, vertical) {
    var r = rng(seed);
    for (var i = 0; i < n; i++) {
      g.strokeStyle = dark; g.globalAlpha = 0.08 + r() * 0.22; g.lineWidth = 0.6 + r() * 2.2;
      var p = r() * (vertical ? w : h), a = r() * 6;
      g.beginPath();
      var L = vertical ? h : w;
      for (var q = 0; q <= L; q += 8) {
        var off = Math.sin(q * 0.013 + a) * 4 + Math.sin(q * 0.05 + a * 2) * 1.2;
        if (vertical) { if (!q) g.moveTo(p + off, q); else g.lineTo(p + off, q); } else { if (!q) g.moveTo(q, p + off); else g.lineTo(q, p + off); }
      }
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  function cracks(g, w, h, n, seed, col, alpha) {
    var r = rng(seed);
    g.strokeStyle = col; g.lineWidth = 1;
    for (var i = 0; i < n; i++) {
      var x = r() * w, y = r() * h; g.globalAlpha = (alpha || 0.4) * (0.5 + r() * 0.5);
      g.beginPath(); g.moveTo(x, y);
      for (var k = 0; k < 6; k++) { x += (r() - 0.5) * 22; y += (r() - 0.5) * 22; g.lineTo(x, y); }
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  /* laterite road: red-brown earth, two tyre ruts, pebbles, tread prints */
  function lateriteDraw(gray) {
    return function (g, w, h) {
      var C = gray ? ["#7a7a7a", "#5d5d5d", "#9a9a9a", "#6c6c6c", "#a8a8a8"] : ["#7d3517", "#c4683a", "#8e3f1c", "#b8794a", "#6b2c12"];
      g.fillStyle = gray ? "#808080" : "#a5512a"; g.fillRect(0, 0, w, h);
      speckle(g, w, h, C, 5200, 21, 2.4);
      // tyre ruts along the road (u = length, v = across)
      [0.36, 0.64].forEach(function (v, k) {
        var grd = g.createLinearGradient(0, h * (v - 0.07), 0, h * (v + 0.07));
        grd.addColorStop(0, "rgba(0,0,0,0)"); grd.addColorStop(0.5, gray ? "rgba(30,30,30,0.35)" : "rgba(70,25,8,0.38)"); grd.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = grd; g.fillRect(0, h * (v - 0.07), w, h * 0.14);
        g.fillStyle = gray ? "rgba(40,40,40,0.35)" : "rgba(60,20,6,0.35)";
        for (var x = 0; x < w; x += 9) { g.fillRect(x, h * v - 6 + ((x / 9) % 2) * 3, 4, 9); }
      });
      // pebbles with a little shadow
      var r = rng(77);
      for (var i = 0; i < 260; i++) {
        var px = r() * w, py = r() * h, s = 1.5 + r() * 4;
        g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(px + 1, py + 1.5, s, s * 0.7, 0, 0, TAU); g.fill();
        g.fillStyle = gray ? (r() < 0.5 ? "#bdbdbd" : "#9d9d9d") : ["#d9a273", "#e1c7a1", "#8c5a3c", "#c98d5a"][Math.floor(r() * 4)];
        g.beginPath(); g.ellipse(px, py, s, s * 0.7, r() * 3, 0, TAU); g.fill();
      }
      cracks(g, w, h, 40, 9, gray ? "#333" : "#4a1a08", 0.35);
    };
  }
  function texLaterite() { return once("lat", function () { return canvasTex(1024, 512, lateriteDraw(false), { repeat: [5, 1] }); }); }
  function texLateriteBump() { return once("latB", function () { return canvasTex(1024, 512, lateriteDraw(true), { color: false, repeat: [5, 1] }); }); }
  function texConcrete() {
    return once("conc", function () {
      return canvasTex(512, 128, function (g, w, h) {
        g.fillStyle = "#a3a199"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["#76746c", "#c9c6bb", "#8b887f", "#5f5d57", "#b7a891"], 2600, 5, 1.5);
        cracks(g, w, h, 16, 3, "#3b3a36", 0.6);
        // red laterite dust settled at the toes, tyre scuffs on the crest
        var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(150,70,35,0.55)"); gr.addColorStop(0.22, "rgba(150,70,35,0)"); gr.addColorStop(0.78, "rgba(150,70,35,0)"); gr.addColorStop(1, "rgba(150,70,35,0.55)");
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = "rgba(25,25,25,0.28)"; g.fillRect(w * 0.3, h * 0.42, w * 0.12, h * 0.16); g.fillRect(w * 0.58, h * 0.44, w * 0.1, h * 0.12);
        // old white paint band, mostly worn
        var r = rng(13); g.fillStyle = "rgba(240,240,232,0.55)";
        for (var x = 0; x < w; x += 2) if (r() < 0.45) g.fillRect(x, h * 0.46, 2, h * 0.08 * (0.4 + r()));
      }, { repeat: [1, 1] });
    });
  }
  function texGrass() {
    return once("grass", function () {
      return canvasTex(512, 512, function (g, w, h) {
        g.fillStyle = "#6f7d33"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["#8a8f3c", "#4f5e22", "#a39a4a", "#5f6e28", "#b59d5a"], 3000, 31, 3);
        var r = rng(32);
        for (var i = 0; i < 2200; i++) {
          var x = r() * w, y = r() * h, l = 4 + r() * 10;
          g.strokeStyle = ["#3f5219", "#9aa04a", "#c8b46a", "#56671f"][Math.floor(r() * 4)]; g.globalAlpha = 0.5 + r() * 0.5; g.lineWidth = 1;
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 5, y - l); g.stroke();
        }
        g.globalAlpha = 1;
        // dusty laterite patches
        for (var k = 0; k < 14; k++) { var gr = g.createRadialGradient(r() * w, r() * h, 2, r() * w, r() * h, 40 + r() * 50); gr.addColorStop(0, "rgba(165,85,45,0.45)"); gr.addColorStop(1, "rgba(165,85,45,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
      }, { repeat: [10, 5] });
    });
  }
  function texWood(seed, base, dark) {
    return once("wood" + seed + base, function () {
      return canvasTex(256, 128, function (g, w, h) { g.fillStyle = base; g.fillRect(0, 0, w, h); grainLines(g, w, h, dark, 60, seed); speckle(g, w, h, [dark], 60, seed + 1, 1.2, 0.1); }, { repeat: [1, 1] });
    });
  }
  function texPlanks() {
    return once("planks", function () {
      return canvasTex(512, 256, function (g, w, h) {
        var r = rng(41), cols = ["#7a5634", "#6a4a2c", "#86603a", "#5e4128"];
        for (var i = 0; i < 8; i++) {
          g.fillStyle = cols[i % 4]; g.fillRect(i * w / 8, 0, w / 8, h);
          g.save(); g.beginPath(); g.rect(i * w / 8, 0, w / 8, h); g.clip(); grainLines(g, w, h, "#2e1d0e", 40, 50 + i, true); g.restore();
          g.fillStyle = "rgba(20,12,5,0.7)"; g.fillRect(i * w / 8, 0, 2, h);
          g.fillStyle = "#3a3a3a"; g.beginPath(); g.arc(i * w / 8 + w / 16, h * 0.15, 2.2, 0, TAU); g.arc(i * w / 8 + w / 16, h * 0.85, 2.2, 0, TAU); g.fill();
        }
        // grime at the bottom
        var gr = g.createLinearGradient(0, h * 0.7, 0, h); gr.addColorStop(0, "rgba(120,55,25,0)"); gr.addColorStop(1, "rgba(120,55,25,0.55)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      });
    });
  }
  function texZinc() {
    return once("zinc", function () {
      return canvasTex(512, 256, function (g, w, h) {
        g.fillStyle = "#9aa0a3"; g.fillRect(0, 0, w, h);
        for (var x = 0; x < w; x += 16) { var gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(0.5, "rgba(0,0,0,0.15)"); gr.addColorStop(1, "rgba(255,255,255,0.18)"); g.fillStyle = gr; g.fillRect(x, 0, 16, h); }
        var r = rng(61);
        for (var i = 0; i < 90; i++) { var x0 = r() * w, y0 = r() * h * 0.6, l = 30 + r() * 120; var gr2 = g.createLinearGradient(0, y0, 0, y0 + l); gr2.addColorStop(0, "rgba(140,62,22,0.75)"); gr2.addColorStop(1, "rgba(140,62,22,0)"); g.fillStyle = gr2; g.fillRect(x0, y0, 3 + r() * 8, l); }
        speckle(g, w, h, ["#7a3a14", "#5b2c10", "#b06a35"], 500, 62, 2.5);
        g.fillStyle = "#555"; for (var y = 12; y < h; y += 80) for (var xx = 8; xx < w; xx += 32) { g.beginPath(); g.arc(xx, y, 2.2, 0, TAU); g.fill(); }
      });
    });
  }
  function texBlockWall() {
    return once("block", function () {
      return canvasTex(512, 256, function (g, w, h) {
        g.fillStyle = "#d9cfb8"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["#bfb49b", "#e8e0cc", "#a8987a"], 1600, 71, 1.6);
        g.strokeStyle = "rgba(90,80,60,0.55)"; g.lineWidth = 2;
        for (var row = 0; row < 4; row++) { var y = row * h / 4; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (var c = 0; c < 4; c++) { var x = c * w / 4 + (row % 2 ? w / 8 : 0); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h / 4); g.stroke(); } }
        var gr = g.createLinearGradient(0, h * 0.55, 0, h); gr.addColorStop(0, "rgba(150,70,35,0)"); gr.addColorStop(1, "rgba(150,70,35,0.6)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      }, { repeat: [1, 1] });
    });
  }
  function texDirtFloor() {
    return once("dirt", function () {
      return canvasTex(512, 512, function (g, w, h) {
        g.fillStyle = "#8a5634"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["#6e3f22", "#a8704a", "#5a3420", "#9c6440"], 3200, 81, 2.2);
        var r = rng(82);
        for (var i = 0; i < 6; i++) { var x = r() * w, y = r() * h, rr = 30 + r() * 70; var gr = g.createRadialGradient(x, y, 2, x, y, rr); gr.addColorStop(0, "rgba(15,10,5,0.85)"); gr.addColorStop(0.6, "rgba(25,15,8,0.5)"); gr.addColorStop(1, "rgba(25,15,8,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rr, rr * 0.7, r() * 3, 0, TAU); g.fill(); }
      });
    });
  }
  function texTread() {
    return once("tread", function () {
      return canvasTex(64, 64, function (g, w, h) {
        g.fillStyle = "#1c1c1e"; g.fillRect(0, 0, w, h);
        // block tread across the crown (profile v = 0.3 .. 0.7)
        g.fillStyle = "#0b0b0c";
        g.fillRect(0, h * 0.28, w * 0.3, h * 0.18); g.fillRect(w * 0.5, h * 0.28, w * 0.3, h * 0.18);
        g.fillRect(w * 0.25, h * 0.54, w * 0.3, h * 0.18); g.fillRect(w * 0.75, h * 0.54, w * 0.25, h * 0.18); g.fillRect(0, h * 0.54, w * 0.05, h * 0.18);
        g.fillStyle = "rgba(160,80,40,0.35)"; g.fillRect(0, 0, w, h * 0.12); g.fillRect(0, h * 0.88, w, h * 0.12);   // laterite dust on the sidewalls
      }, { repeat: [28, 1] });
    });
  }
  function texVinyl() {
    return once("vinyl", function () {
      return canvasTex(128, 128, function (g, w, h) {
        g.fillStyle = "#1b1b1d"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["#2a2a2e", "#111"], 500, 91, 1.2);
        var gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, "rgba(255,255,255,0.08)"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(0,0,0,0.25)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = "rgba(180,180,180,0.55)"; g.setLineDash([3, 3]); g.lineWidth = 1.2; g.beginPath(); g.moveTo(3, 0); g.lineTo(3, h); g.stroke();
      }, { repeat: [14, 3] });
    });
  }
  function texTank() {
    return once("tank", function () {
      return canvasTex(512, 256, function (g, w, h) {
        g.fillStyle = "#a3121c"; g.fillRect(0, 0, w, h);
        var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(0.4, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(0,0,0,0.3)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        // gold pinstripes running along both sides
        g.fillStyle = "#e9c25a"; g.fillRect(0, h * 0.47, w, 3); g.fillRect(0, h * 0.53, w, 1.5);
        // rubber knee pads + side badges (u = 0.25 right side, 0.75 left side)
        [0.17, 0.83].forEach(function (u) { g.fillStyle = "#1a1a1a"; g.beginPath(); g.ellipse(u * w, h * 0.62, w * 0.04, h * 0.09, 0, 0, TAU); g.fill(); g.strokeStyle = "#333"; for (var k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(u * w - w * 0.035, h * 0.62 + k * 5); g.lineTo(u * w + w * 0.035, h * 0.62 + k * 5); g.stroke(); } });
        [0.25, 0.75].forEach(function (u) { g.fillStyle = "#f4f1ea"; g.font = "italic bold 26px Georgia, serif"; g.textAlign = "center"; g.fillText("125", u * w, h * 0.43); });
        // a few chips and laterite dust
        speckle(g, w, h, ["#c28a68", "#5c0a10"], 120, 95, 1.4, 0.2);
      });
    });
  }
  function texCast() {
    return once("cast", function () {
      return canvasTex(128, 128, function (g, w, h) { g.fillStyle = "#9aa0a6"; g.fillRect(0, 0, w, h); speckle(g, w, h, ["#7c8288", "#b7bcc1", "#5d6166", "#8a5a3a"], 900, 101, 1.2); }, { repeat: [2, 2] });
    });
  }
  function texPerforated() {
    return once("perf", function () {
      return canvasTex(128, 128, function (g, w, h) {
        g.fillStyle = "#d9dde2"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#111"; for (var y = 6; y < h; y += 12) for (var x = 6 + ((y / 12) % 2) * 6; x < w; x += 12) { g.beginPath(); g.arc(x, y, 3.2, 0, TAU); g.fill(); }
      }, { repeat: [3, 2] });
    });
  }
  function texPlate() {
    return once("plate", function () {
      return canvasTex(256, 96, function (g, w, h) {
        g.fillStyle = "#f6f6f2"; g.fillRect(0, 0, w, h);
        g.strokeStyle = "#1f6d3a"; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
        g.fillStyle = "#1f6d3a"; g.font = "bold 16px Arial, sans-serif"; g.textAlign = "center"; g.fillText("OYO", w / 2, 22);
        g.fillStyle = "#b21e2a"; g.font = "bold 40px Arial, sans-serif"; g.fillText("OGB 214 QA", w / 2, 66);
        g.fillStyle = "#1f6d3a"; g.font = "10px Arial, sans-serif"; g.fillText("PACE SETTER", w / 2, 86);
      });
    });
  }
  function texCrateLabel() {
    return once("crateLabel", function () {
      return canvasTex(512, 160, function (g, w, h) {
        g.fillStyle = "#d6b07a"; g.fillRect(0, 0, w, h);
        grainLines(g, w, h, "#7a5228", 30, 121);
        g.fillStyle = "rgba(30,20,10,0.85)"; g.textAlign = "center";
        g.font = "bold 46px Arial, sans-serif"; g.fillText("RAMATU FARMS", w / 2, 58);
        g.font = "bold 30px Arial, sans-serif"; g.fillText("FRESH EGGS · OGBOMOSO", w / 2, 102);
        g.fillStyle = "rgba(170,20,20,0.9)"; g.font = "bold 24px Arial, sans-serif"; g.fillText("HANDLE WITH CARE  ↑", w / 2, 140);
      });
    });
  }
  function texPulp() {
    return once("pulp", function () {
      return canvasTex(128, 128, function (g, w, h) { g.fillStyle = "#c9c1ae"; g.fillRect(0, 0, w, h); speckle(g, w, h, ["#a59c88", "#ddd6c4", "#8f8774"], 1400, 131, 1); }, { repeat: [2, 2] });
    });
  }
  function texSign(lines, bg, fg, w, h, border) {
    return once("sign" + lines.join("|") + bg, function () {
      return canvasTex(w || 512, h || 192, function (g, W, H) {
        g.fillStyle = bg; g.fillRect(0, 0, W, H);
        speckle(g, W, H, ["rgba(0,0,0,0.5)", "rgba(255,255,255,0.4)"], 300, 141, 1.2, 0.1);
        if (border) { g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(6, 6, W - 12, H - 12); }
        g.fillStyle = fg; g.textAlign = "center";
        var n = lines.length;
        lines.forEach(function (ln, i) {
          var big = i === 0, size = big ? Math.round(H * (n > 2 ? 0.26 : 0.34)) : Math.round(H * 0.15);
          g.font = "bold " + size + "px Georgia, 'Times New Roman', serif";
          var y = n === 1 ? H * 0.62 : big ? H * (n > 2 ? 0.36 : 0.45) : H * (0.36 + 0.22 * i + (n > 2 ? 0 : 0.12));
          g.fillText(ln, W / 2, y, W - 30);
        });
        // weathering: a rust run and fading at the bottom
        var gr = g.createLinearGradient(0, H * 0.7, 0, H); gr.addColorStop(0, "rgba(120,60,20,0)"); gr.addColorStop(1, "rgba(120,60,20,0.35)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      });
    });
  }
  function texWire() {
    return once("wire", function () {
      var t = canvasTex(128, 128, function (g, w, h) {
        g.clearRect(0, 0, w, h); g.strokeStyle = "#c9ccd0"; g.lineWidth = 2.2;
        for (var y = -16; y < h + 16; y += 22) for (var x = -16; x < w + 16; x += 26) {
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + 13, y + 7); g.lineTo(x + 26, y); g.moveTo(x + 13, y + 7); g.lineTo(x + 13, y + 22); g.stroke();
        }
      }, { repeat: [8, 3] });
      return t;
    });
  }
  function texFlash() {
    return once("flash", function () {
      return canvasTex(128, 128, function (g, w, h) {
        g.clearRect(0, 0, w, h);
        var gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.35, "rgba(255,210,90,0.8)"); gr.addColorStop(1, "rgba(255,180,60,0)");
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = "rgba(60,30,10,0.95)"; g.lineWidth = 3;
        var r = rng(151);
        for (var i = 0; i < 9; i++) { var a = i / 9 * TAU + r() * 0.4, x = w / 2, y = h / 2; g.beginPath(); g.moveTo(x, y); for (var k = 1; k <= 4; k++) { x = w / 2 + Math.cos(a + (r() - 0.5) * 0.5) * k * 13; y = h / 2 + Math.sin(a + (r() - 0.5) * 0.5) * k * 13; g.lineTo(x, y); } g.stroke(); }
      });
    });
  }
  function texYolk() {
    return once("yolk", function () {
      return canvasTex(128, 128, function (g, w, h) {
        g.clearRect(0, 0, w, h);
        g.fillStyle = "rgba(245,240,215,0.75)"; g.beginPath(); g.ellipse(w * 0.5, h * 0.5, w * 0.46, h * 0.36, 0.3, 0, TAU); g.fill();
        g.fillStyle = "rgba(240,160,20,0.95)"; g.beginPath(); g.ellipse(w * 0.46, h * 0.52, w * 0.18, h * 0.16, 0, 0, TAU); g.fill();
        g.fillStyle = "rgba(255,230,160,0.9)"; g.beginPath(); g.ellipse(w * 0.42, h * 0.47, w * 0.05, h * 0.04, 0, 0, TAU); g.fill();
      });
    });
  }
  function texOilStain() {
    return once("oilstain", function () {
      return canvasTex(128, 128, function (g, w, h) {
        g.clearRect(0, 0, w, h);
        var r = rng(171);
        for (var i = 0; i < 7; i++) { var x = w * (0.3 + r() * 0.4), y = h * (0.3 + r() * 0.4), rr = 12 + r() * 30; var gr = g.createRadialGradient(x, y, 1, x, y, rr); gr.addColorStop(0, "rgba(10,8,5,0.85)"); gr.addColorStop(1, "rgba(10,8,5,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
      });
    });
  }
  function texOilStreak() {
    return once("oilstreak", function () {
      return canvasTex(64, 128, function (g, w, h) {
        g.clearRect(0, 0, w, h);
        var r = rng(181);
        for (var i = 0; i < 9; i++) { var x = r() * w, l = h * (0.3 + r() * 0.7); var gr = g.createLinearGradient(0, h - l, 0, h); gr.addColorStop(0, "rgba(20,12,4,0)"); gr.addColorStop(0.3, "rgba(30,18,6,0.85)"); gr.addColorStop(1, "rgba(15,8,2,0.95)"); g.fillStyle = gr; g.fillRect(x, h - l, 3 + r() * 9, l); }
      });
    });
  }
  function texRule() {
    return once("rule", function () {
      return canvasTex(64, 1024, function (g, w, h) {
        g.fillStyle = "#f4ead0"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#1b1813"; g.font = "bold 15px Arial, sans-serif";
        for (var mm = 0; mm <= 1000; mm += 5) {
          var y = 10 + mm / 1000 * (h - 20);
          var len = mm % 100 === 0 ? 30 : mm % 50 === 0 ? 22 : mm % 10 === 0 ? 15 : 8;
          g.fillRect(0, y - 0.5, len, mm % 10 === 0 ? 2 : 1);
          if (mm % 100 === 0) g.fillText(String(mm / 10), 33, y + 5);
        }
      });
    });
  }
  function texTape() {
    return once("tape", function () {
      return canvasTex(1024, 32, function (g, w, h) {
        g.fillStyle = "#f2c230"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#1b1813"; g.font = "bold 13px Arial, sans-serif"; g.textAlign = "center";
        for (var cm = 0; cm <= 250; cm += 1) {
          var x = 6 + cm / 250 * (w - 12), L = cm % 50 === 0 ? 14 : cm % 10 === 0 ? 10 : 5;
          g.fillRect(x, 0, cm % 10 === 0 ? 1.6 : 1, L);
          if (cm % 50 === 0 && cm > 0) g.fillText((cm / 100).toFixed(1) + " m", x, 28);
        }
      });
    });
  }
  function texChalkboard() {
    return once("chalk", function () {
      return canvasTex(512, 256, function (g, w, h) {
        g.fillStyle = "#24392c"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["rgba(255,255,255,0.05)", "rgba(0,0,0,0.2)"], 900, 191, 2, 0.05);
        g.fillStyle = "rgba(240,240,230,0.9)"; g.font = "30px 'Comic Sans MS', 'Segoe Print', cursive"; g.textAlign = "left";
        g.fillText("T = 2π√(l / g)", 24, 60); g.fillText("T = 2π√(m / k)", 24, 112); g.fillText("f = 1 / T", 24, 164);
        g.font = "22px 'Comic Sans MS', cursive"; g.fillText("a = −ω²x", 300, 60); g.fillText("Count 20 oscillations", 270, 220);
        // spring sketch
        g.strokeStyle = "rgba(240,240,230,0.85)"; g.lineWidth = 2; g.beginPath(); g.moveTo(420, 80);
        for (var i = 0; i < 9; i++) g.lineTo(i % 2 ? 405 : 435, 92 + i * 9); g.lineTo(420, 175); g.stroke(); g.strokeRect(405, 175, 30, 20);
      });
    });
  }
  function texPaper() {
    return once("paper", function () { return canvasTex(64, 64, function (g, w, h) { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, w, h); speckle(g, w, h, ["#d8ccae", "#fff8e6"], 200, 201, 1); g.strokeStyle = "rgba(120,100,70,0.35)"; for (var i = 0; i < w; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } }); });
  }
  function texPlaster() {
    return once("plaster", function () {
      return canvasTex(256, 256, function (g, w, h) {
        g.fillStyle = "#e8dcc0"; g.fillRect(0, 0, w, h);
        speckle(g, w, h, ["#d4c6a4", "#f2ead6", "#c9b48c"], 900, 211, 1.5);
        g.fillStyle = "#3f7d4a"; g.fillRect(0, h * 0.82, w, h * 0.18);       // painted green dado band
        var gr = g.createLinearGradient(0, h * 0.6, 0, h); gr.addColorStop(0, "rgba(150,70,35,0)"); gr.addColorStop(1, "rgba(150,70,35,0.5)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        cracks(g, w, h, 6, 212, "#8a7a5a", 0.5);
      }, { repeat: [1, 1] });
    });
  }

  /* ================================================================ materials */
  var MAT = null;
  function mats() {
    if (MAT) return MAT;
    MAT = {
      paint: std(0xa3141f, 0.32, 0.35),
      tank: std(0xffffff, 0.28, 0.3, { map: texTank() }),
      chrome: std(0xe8ecf2, 0.16, 0.6),
      darkSteel: std(0x2f3238, 0.45, 0.55),
      black: std(0x17181b, 0.55, 0.2),
      rubber: std(0x1a1a1c, 0.88, 0),
      tyre: std(0xffffff, 0.9, 0, { map: texTread(), bumpMap: texTread(), bumpScale: 1.2 }),
      vinyl: std(0xffffff, 0.55, 0.05, { map: texVinyl() }),
      cast: std(0xffffff, 0.45, 0.45, { map: texCast() }),
      engineDark: std(0x3b3f45, 0.5, 0.5),
      muffler: std(0xd9dde2, 0.2, 0.6),
      perf: std(0xffffff, 0.3, 0.5, { map: texPerforated() }),
      lampLens: std(0xfff6d2, 0.08, 0, { emissive: 0xfff0b0, emissiveIntensity: 0.25 }),
      amber: std(0xf2a51a, 0.2, 0, { emissive: 0x4a2a00 }),
      tailRed: std(0xc0101a, 0.25, 0, { emissive: 0x500006 }),
      plate: std(0xffffff, 0.6, 0, { map: texPlate() }),
      mirror: std(0xcfe0ee, 0.05, 0.6),
      chain: std(0x4a4b50, 0.5, 0.7),
      mud: std(0x8a3a18, 0.95, 0),
      crate: std(0xffffff, 0.8, 0, { map: texWood(31, "#c89a5c", "#6a4320") }),
      crateLabel: std(0xffffff, 0.8, 0, { map: texCrateLabel() }),
      pulp: std(0xffffff, 0.95, 0, { map: texPulp() }),
      egg: std(0xffffff, 0.55, 0),
      strap: std(0x1d1d1f, 0.8, 0),
      springRed: std(0xc8361c, 0.38, 0.45),
      oilStreak: std(0xffffff, 0.15, 0.2, { map: texOilStreak(), transparent: true, depthWrite: false }),
      laterite: std(0xffffff, 0.96, 0, { map: texLaterite(), bumpMap: texLateriteBump(), bumpScale: 2.2 }),
      concrete: std(0xffffff, 0.9, 0, { map: texConcrete() }),
      grass: std(0xffffff, 1, 0, { map: texGrass() }),
      blade: std(0xffffff, 0.95, 0, { side: THREE.DoubleSide }),
      timber: std(0xffffff, 0.8, 0, { map: texWood(221, "#7a5634", "#2e1d0e") }),
      planks: std(0xffffff, 0.85, 0, { map: texPlanks() }),
      zinc: std(0xffffff, 0.55, 0.45, { map: texZinc(), side: THREE.DoubleSide }),
      block: std(0xffffff, 0.92, 0, { map: texBlockWall() }),
      plaster: std(0xffffff, 0.92, 0, { map: texPlaster() }),
      gateGreen: std(0x2f6b3e, 0.5, 0.35),
      rust: std(0x8a4a22, 0.8, 0.3),
      wire: std(0xffffff, 0.5, 0.5, { map: texWire(), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }),
      dirt: std(0xffffff, 0.95, 0, { map: texDirtFloor() }),
      oilStain: new THREE.MeshBasicMaterial({ map: texOilStain(), transparent: true, depthWrite: false, opacity: 0.85 }),
      drum: std(0x1f4f8a, 0.55, 0.4),
      leaf: std(0x3e6b2a, 0.9, 0, { flatShading: true }),
      leafDark: std(0x2c5320, 0.9, 0, { flatShading: true }),
      bark: std(0x5a4030, 0.95, 0),
      pole: std(0x6e5640, 0.9, 0),
      cable: std(0x111111, 0.6, 0),
      hill: std(0x6d7a3a, 1, 0, { flatShading: true }),
      hillFar: std(0x8d9a62, 1, 0, { flatShading: true }),
      chicken: std(0xffffff, 0.8, 0, { vertexColors: true }),
      steel: std(0xc0c6cf, 0.3, 0.6),
      brass: std(0xc9a14a, 0.3, 0.6),
      bluePaint: std(0x1f3550, 0.55, 0.3),
      cork: std(0xb98b55, 0.95, 0),
      thread: std(0xf2efe6, 0.9, 0),
      rule: std(0xffffff, 0.6, 0, { map: texRule() }),
      tape: std(0xffffff, 0.5, 0, { map: texTape() }),
      tapeCase: std(0xf2c230, 0.45, 0.1),
      chalkboard: std(0xffffff, 0.9, 0, { map: texChalkboard() }),
      paper: std(0xffffff, 0.9, 0, { map: texPaper(), side: THREE.DoubleSide }),
      benchWood: std(0xffffff, 0.75, 0, { map: texWood(231, "#8a5a33", "#3d2312") }),
      pointer: std(0xd22e56, 0.4, 0.2),
      lcd: std(0x9fc9a0, 0.4, 0, { emissive: 0x1a2a1a })
    };
    var AVG = { tank: 0xa3141f, vinyl: 0x1e1e20, cast: 0x9aa0a6, tyre: 0x1c1c1e, perf: 0xc4c8cc, plate: 0xf0f0ea, crate: 0xc89a5c, crateLabel: 0xd0a670, pulp: 0xc9c1ae, timber: 0x6e4e30, planks: 0x6f4f30, zinc: 0x8f8f8c, block: 0xd2c7ae, plaster: 0xd9cdb0, benchWood: 0x7e5432, rule: 0xf0e6cc, paper: 0xece2c8, chalkboard: 0x2a3d30, grass: 0x737f37, laterite: 0x9c4c28, concrete: 0xa09e96, dirt: 0x7e4e30, tape: 0xf2c230 };
    Object.keys(AVG).forEach(function (k) { MAT[k].userData.avg = AVG[k]; });
    return MAT;
  }

  /* ================================================================ model */
  /* k is built from f0 = 2.00 Hz exactly with m = 200 kg: k = 4 pi^2 f0^2 m = 31 583 N/m ("3.16 x 10^4" is only a label) */
  var STORY = { f0: 2.00, mass: 200, k: 4 * Math.PI * Math.PI * 2.00 * 2.00 * 200, kLabel: "3.16 × 10⁴ N m⁻¹", d: 2.5, Y: 0.010, zeta: { healthy: 0.30, leaking: 0.05 } };
  function zetaOf(z) { return typeof z === "number" ? z : (STORY.zeta[z] != null ? STORY.zeta[z] : STORY.zeta.leaking); }
  var model = {
    g: G, STORY: STORY,
    /* steady-state response of the sprung rear to evenly spaced ridges (base excitation) */
    ridge: function (kmh, mass, damper) {
      mass = mass || STORY.mass;
      var v = kmh / 3.6, f = v / STORY.d, w0 = Math.sqrt(STORY.k / mass), f0 = w0 / TAU, z = zetaOf(damper), r = f / f0;
      var A = STORY.Y * Math.sqrt(1 + Math.pow(2 * z * r, 2)) / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * z * r, 2));
      var wd = TAU * f, th = wd > 0 ? G / (wd * wd) : Infinity;
      var phase = Math.atan2(2 * z * r * r * r, 1 - r * r + Math.pow(2 * z * r, 2));
      return { kmh: kmh, v: v, f: f, f0: f0, w0: w0, T0: 1 / f0, zeta: z, r: r, A: A, A_cm: A * 100, th: th, th_cm: th * 100, lift: A >= th, phase: phase, mass: mass };
    },
    /* parked: press the carrier and let go */
    parked: function (mass) {
      mass = mass || STORY.mass;
      var w0 = Math.sqrt(STORY.k / mass), T = TAU / w0;
      return { mass: mass, w0: w0, f0: 1 / T, T0: T, t20: 20 * T, sag: mass * G / STORY.k, sag_cm: mass * G / STORY.k * 100 };
    },
    resonantSpeed: function (mass) { return model.parked(mass).f0 * STORY.d * 3.6; },
    pendulumT: function (l, g) { return TAU * Math.sqrt(l / (g || G)); },
    springT: function (m, k) { return TAU * Math.sqrt(m / k); },
    /* Barton's pendulums: steady-state amplitude of each cone driven at the driver's frequency */
    barton: function (driverL, lengths, zeta) {
      lengths = lengths || [0.30, 0.45, 0.60, 0.75, 0.90]; zeta = zeta == null ? 0.05 : zeta;
      var wd = Math.sqrt(G / driverL), raw = lengths.map(function (L) {
        var wi = Math.sqrt(G / L);
        return { amp: 1 / Math.sqrt(Math.pow(wi * wi - wd * wd, 2) + Math.pow(2 * zeta * wi * wd, 2)), phase: Math.atan2(2 * zeta * wi * wd, wi * wi - wd * wd) };
      });
      var mx = Math.max.apply(null, raw.map(function (r) { return r.amp; }));
      var amps = raw.map(function (r) { return r.amp / mx; }), widest = amps.indexOf(1);
      return { driverL: driverL, T: TAU / wd, fDriver: wd / TAU, amps: amps, phases: raw.map(function (r) { return r.phase; }), widest: widest, widestCone: "cone-" + (widest + 1) };
    }
  };

  /* ================================================================ wheel */
  var OK = { R: 0.31, FX: 0.65, RX: -0.65 };
  function buildWheel(rear) {
    var M = mats(), g = new THREE.Group(), b = new Batch();
    var R = OK.R;
    // tyre: lathe of the tyre cross-section about the axle (y), then turned so the axle is z
    var prof = [], i;
    var tp0 = S(10, 5);
    for (i = 0; i <= tp0; i++) { var a = -Math.PI / 2 + Math.PI * i / tp0; prof.push([0.272 + Math.cos(a) * 0.04 * (1 + 0.08 * Math.cos(a * 2)), Math.sin(a) * 0.046]); }
    prof.unshift([0.238, -0.03]); prof.push([0.238, 0.03]);
    var tyre = gLathe(prof, 40); tyre.rotateX(Math.PI / 2);
    b.add(rear ? "rearWheel" : "frontWheel", M.tyre, tyre);
    // rim: dropped-centre channel
    var rim = gLathe([[0.236, -0.026], [0.246, -0.026], [0.246, -0.019], [0.232, -0.014], [0.226, 0], [0.232, 0.014], [0.246, 0.019], [0.246, 0.026], [0.236, 0.026], [0.222, 0.01], [0.222, -0.01], [0.236, -0.026]], 36);
    rim.rotateX(Math.PI / 2);
    b.add(rear ? "rearWheel" : "frontWheel", M.chrome, rim);
    // hub with drum brake (rear drum is bigger), flanges
    var hr = rear ? 0.085 : 0.065;
    var hub = gLathe([[0.012, -0.075], [0.03, -0.075], [0.035, -0.06], [hr, -0.055], [hr, -0.01], [0.05, -0.005], [0.045, 0.03], [0.055, 0.04], [0.055, 0.045], [0.03, 0.05], [0.03, 0.075], [0.012, 0.075]], 20);
    hub.rotateX(Math.PI / 2);
    b.add(rear ? "rearWheel" : "frontWheel", M.cast, hub);
    // 36 laced spokes (tangential), merged
    var NS = S(36, 18);
    for (i = 0; i < NS; i++) {
      var side = i % 2 ? 1 : -1, ang = i / NS * TAU, z0 = side * 0.04;
      var hubP = new V3(Math.cos(ang) * 0.045, Math.sin(ang) * 0.045, z0);
      var a2 = ang + (i % 4 < 2 ? 0.55 : -0.55);
      var rimP = new V3(Math.cos(a2) * 0.226, Math.sin(a2) * 0.226, side * 0.006);
      b.add(rear ? "rearWheel" : "frontWheel", M.chrome, gRod(hubP, rimP, 0.0017, 4, true));
    }
    // axle nut
    var nut = new THREE.CylinderGeometry(0.014, 0.014, 0.17, 6); nut.rotateX(Math.PI / 2);
    b.add(rear ? "rearWheel" : "frontWheel", M.darkSteel, nut);
    if (rear) {
      // rear sprocket: extruded 36-tooth gear with five lightening holes, on the left (-z) side
      var sp = new THREE.Shape(), N = S(36, 18), Ro = 0.1, Ri = 0.092;
      for (i = 0; i <= N * 4; i++) { var aa = i / (N * 4) * TAU, k = i % 4, rr = k === 0 || k === 3 ? Ri : Ro; if (i === 0) sp.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr); else sp.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); }
      for (i = 0; i < 5; i++) { var ha = i / 5 * TAU + 0.3; sp.holes.push(circlePath(Math.cos(ha) * 0.062, Math.sin(ha) * 0.062, 0.017)); }
      sp.holes.push(circlePath(0, 0, 0.02));
      var spg = Extrude(sp, { depth: 0.005, bevelEnabled: false, curveSegments: 4 });
      spg.translate(0, 0, -0.068);
      b.add("chain", M.chain, spg);
      // brake arm on the drum (+z)
      b.add("rearWheel", M.darkSteel, gRod([0, 0, 0.06], [-0.02, 0.1, 0.06], 0.007, 6));
    } else {
      b.add("frontWheel", M.darkSteel, gRod([0, 0, -0.06], [0.06, 0.06, -0.06], 0.007, 6));
    }
    var parts = b.flush(g);
    // mud lump (rear: the L03 "red mud on the tyre"); hidden until setMud(true)
    var mudG = new THREE.IcosahedronGeometry(0.035, 1), mp = mudG.attributes.position, r = rng(rear ? 5 : 6);
    for (i = 0; i < mp.count; i++) { var s = 0.75 + r() * 0.5; mp.setXYZ(i, mp.getX(i) * s * 1.3, mp.getY(i) * s * 0.7, mp.getZ(i) * s * 1.2); }
    mudG.computeVertexNormals();
    if (QL) bakeStatic(g, { vertexColor: true, shallow: true, part: rear ? "rearWheel" : "frontWheel" });
    var mud = new THREE.Mesh(mudG, M.mud); mud.position.set(0, R + 0.006, 0.0); mud.visible = false; tagPart(mud, "mud"); g.add(mud);
    g.userData.mud = mud;
    return g;
  }

  /* ================================================================ crate + egg tray */
  var EGG_GEO = null, EGG_LOW = null;
  function eggGeo() {
    if (QL ? EGG_LOW : EGG_GEO) return QL ? EGG_LOW : EGG_GEO;
    var prof = [], ne = S(7, 4);
    for (var e = 0; e <= ne; e++) { var t = e / ne, ang = -Math.PI / 2 + Math.PI * t; prof.push([Math.max(0.0004, Math.cos(ang) * 0.021 * (1 - 0.14 * Math.sin(ang))), Math.sin(ang) * 0.028 + 0.028]); }
    var eg = gLathe(prof, S(8, 6));
    if (QL) EGG_LOW = eg; else EGG_GEO = eg;
    return eg;
  }
  /* pulp tray with 30 moulded cups (6 x 5), cups pressed by vertex displacement */
  function trayGeo(W, D, res) {
    var g = new THREE.PlaneGeometry(W, D, res === true ? 12 : res === 2 ? 24 : 36, res === true ? 10 : res === 2 ? 20 : 30); g.rotateX(-Math.PI / 2);
    var p = g.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), z = p.getZ(i);
      var cx = (x / W + 0.5) * 6, cz = (z / D + 0.5) * 5;
      var fx = cx - Math.floor(cx) - 0.5, fz = cz - Math.floor(cz) - 0.5;
      var d = Math.sqrt(fx * fx + fz * fz);
      var y = -0.016 * Math.pow(Math.max(0, 1 - d / 0.45), 1.5);
      // raised cones between the cups
      if (Math.abs(fx) > 0.38 && Math.abs(fz) > 0.38) y += 0.008;
      if (Math.abs(x) > W / 2 - 0.004 || Math.abs(z) > D / 2 - 0.004) y += 0.006;
      p.setY(i, y);
    }
    g.computeVertexNormals();
    return g;
  }
  function createEggTray(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), W = 0.30, D = 0.30;
    var tray = new THREE.Mesh(trayGeo(W, D), M.pulp); tray.position.y = 0.018; g.add(tray);
    var eggs = new THREE.InstancedMesh(eggGeo(), M.egg, 30), mtx = new THREE.Matrix4(), r = rng(opts.seed || 7), col = new THREE.Color();
    var cracked = opts.cracked || 0;
    for (var ex = 0; ex < 6; ex++) for (var ez = 0; ez < 5; ez++) {
      var k = ex * 5 + ez;
      mtx.compose(new V3(-W / 2 + (ex + 0.5) * W / 6, 0.006, -D / 2 + (ez + 0.5) * D / 5), new THREE.Quaternion().setFromEuler(new THREE.Euler((r() - 0.5) * 0.2, r() * 3, (r() - 0.5) * 0.2)), new V3(1, 1, 1));
      eggs.setMatrixAt(k, mtx);
      col.setHSL(0.08 + r() * 0.02, 0.45, 0.78 + r() * 0.1); eggs.setColorAt(k, col);
    }
    g.add(eggs);
    if (cracked) {
      var yolkM = new THREE.MeshBasicMaterial({ map: texYolk(), transparent: true, depthWrite: false });
      for (var c = 0; c < cracked; c++) {
        var idx = (c * 7 + 3) % 30; eggs.setColorAt(idx, new THREE.Color(0x9c8a5a));
        var yk = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.06), yolkM); yk.rotation.x = -Math.PI / 2;
        yk.position.set(-W / 2 + (Math.floor(idx / 5) + 0.5) * W / 6, 0.05, -D / 2 + (idx % 5 + 0.5) * D / 5); g.add(yk);
      }
    }
    if (eggs.instanceColor) eggs.instanceColor.needsUpdate = true;
    tagPart(g, "tray");
    g.userData.eggs = eggs;
    return g;
  }
  /* wooden crate holding a stack of pulp trays; top tray full of eggs */
  function createCrate(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch();
    var W = 0.36, D = 0.36, H = 0.27, sl = 0.012, i;
    // slatted sides: 3 slats each side with gaps
    for (i = 0; i < 3; i++) {
      var y = 0.035 + i * 0.09;
      [-1, 1].forEach(function (s) {
        b.add("crate", M.crate, gPlank(W, 0.06, sl), mT(0, y, s * (D / 2 - sl / 2)));
        b.add("crate", M.crate, gPlank(D - 2 * sl, 0.06, sl), mTR(s * (W / 2 - sl / 2), y, 0, 0, Math.PI / 2, 0));
      });
    }
    // corner posts and floor battens
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (p) { b.add("crate", M.crate, gPlank(H, 0.026, 0.026), mTR(p[0] * (W / 2 - 0.02), H / 2, p[1] * (D / 2 - 0.02), 0, 0, Math.PI / 2)); });
    for (i = 0; i < 4; i++) b.add("crate", M.crate, gPlank(W - 0.02, 0.012, 0.07), mT(0, 0.006, -D / 2 + 0.05 + i * 0.087));
    // tray stack visible through the gaps (edges of 7 trays)
    var tray = trayGeo(W - 0.04, D - 0.04, true);
    var lite = opts.lite || QL;
    for (i = 0; i < (lite ? (QL ? 1 : 3) : 6); i++) b.add("crate", M.pulp, tray, mT(0, 0.035 + i * (lite ? 0.066 : 0.033), 0));
    b.add("crate", M.pulp, trayGeo(W - 0.04, D - 0.04, lite ? true : 2), mT(0, 0.035 + 6 * 0.033, 0));
    var parts = b.flush(g);
    // stencilled label on the front (+z) and back
    [1, -1].forEach(function (s) {
      var lab = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, 0.06), M.crateLabel);
      lab.position.set(0, 0.125, s * (D / 2 + 0.0015)); if (s < 0) lab.rotation.y = Math.PI; tagPart(lab, "crate"); g.add(lab);
    });
    // eggs on the top tray (a lite crate hidden under another one carries none)
    var eggs = new THREE.InstancedMesh(eggGeo(), M.egg, 30), mtx = new THREE.Matrix4(), r = rng(opts.seed || 3), col = new THREE.Color();
    for (var ex = 0; ex < 6; ex++) for (var ez = 0; ez < 5; ez++) {
      mtx.compose(new V3(-0.16 + 0.32 * (ex + 0.5) / 6, 0.035 + 6 * 0.033 + 0.004, -0.16 + 0.32 * (ez + 0.5) / 5), new THREE.Quaternion().setFromEuler(new THREE.Euler((r() - 0.5) * 0.25, r() * 3, (r() - 0.5) * 0.25)), new V3(1, 1, 1));
      eggs.setMatrixAt(ex * 5 + ez, mtx);
      col.setHSL(0.075 + r() * 0.025, 0.45, 0.76 + r() * 0.12); eggs.setColorAt(ex * 5 + ez, col);
    }
    tagPart(eggs, "eggs"); g.add(eggs); if (opts.eggs === false) eggs.visible = false;
    if (QL) bakeStatic(g, { vertexColor: true, shallow: true, part: "crate" });
    g.userData.eggs = eggs; g.userData.H = H;
    g.userData.crack = function (n) {
      for (var c = 0; c < (n || 3); c++) { var idx = Math.floor(r() * 30); eggs.setColorAt(idx, new THREE.Color(0xd9a21e)); }
      if (eggs.instanceColor) eggs.instanceColor.needsUpdate = true;
    };
    g.userData.resetEggs = function () {
      var rr = rng(opts.seed || 3); for (var k = 0; k < 30; k++) { rr(); rr(); rr(); col.setHSL(0.075 + rr() * 0.025, 0.45, 0.76 + rr() * 0.12); eggs.setColorAt(k, col); }
      if (eggs.instanceColor) eggs.instanceColor.needsUpdate = true;
    };
    g.parts = parts;
    return g;
  }

  /* ================================================================ coil-over shock */
  /* built along +y from the lower eye (y = 0) to the upper eye (y = len); setLength(len) */
  function createShock(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), len0 = opts.length || 0.335, key = opts.part || "rear-shock";
    var low = new THREE.Group(), top = new THREE.Group(); g.add(low); g.add(top);
    var bl = new Batch(), bt = new Batch();
    // lower: eye + damper body + lower spring seat
    var eye = new THREE.TorusGeometry(0.013, 0.006, 6, 10); eye.rotateY(0);
    bl.add(key, M.darkSteel, eye, mT(0, 0, 0));
    bl.add(key, M.darkSteel, gLathe([[0.012, 0.012], [0.017, 0.016], [0.02, 0.03], [0.02, 0.17], [0.018, 0.178], [0.008, 0.18]], 18));
    bl.add(key, M.chrome, gLathe([[0.019, 0.05], [0.032, 0.052], [0.032, 0.058], [0.019, 0.06]], 20));
    // upper: rod + cap + top spring seat + eye  (in top-local, y = 0 is the upper eye, rod points down)
    bt.add(key, M.chrome, gRod([0, -0.03, 0], [0, -0.2, 0], 0.0065, 10));
    bt.add(key, M.chrome, gLathe([[0.006, -0.05], [0.032, -0.048], [0.034, -0.04], [0.026, -0.03], [0.014, -0.022], [0.006, -0.02]], 20));
    bt.add(key, M.darkSteel, new THREE.TorusGeometry(0.013, 0.006, 6, 10));
    bl.flush(low); bt.flush(top);
    if (QL) { bakeStatic(low, { vertexColor: true, shallow: true, part: key }); bakeStatic(top, { vertexColor: true, shallow: true, part: key }); }
    // spring between the seats (scaled with length)
    var springLen0 = len0 - 0.058 - 0.048;
    var spr = new THREE.Mesh(gTube(helixPts(0.027, springLen0, 7.5, 90, true), 0.0055, 105, 5, false, 0.3), opts.springMat || M.springRed);
    tagPart(spr, key); g.add(spr);
    // weeping oil streak on the damper body
    var streak = new THREE.Mesh(gLathe([[0.0205, 0.03], [0.0205, 0.17]], 18, -0.6, 1.4), M.oilStreak); streak.visible = !!opts.leak; low.add(streak);
    function setLength(len) {
      top.position.y = len;
      spr.position.y = 0.058;
      spr.scale.y = Math.max(0.3, (len - 0.058 - 0.048) / springLen0);
    }
    setLength(len0);
    g.setLength = setLength; g.setLeak = function (on) { streak.visible = !!on; };
    g.userData.len0 = len0;
    tagPart(g, key);
    return g;
  }

  /* ================================================================ okada */
  function createOkada(opts) {
    opts = opts || {};
    var M = mats(), okada = new THREE.Group(); okada.name = "okada";
    var R = OK.R, FX = OK.FX, RX = OK.RX, i;
    var parts = {};
    var st = { bounce: 0, yF: 0, yR: 0, kmh: 0, lift: 0, crates: opts.crates || 1, mud: false, stand: false, flash: 0, cracks: 0, shocks: opts.shocks !== false, leak: opts.leak !== false, autoBump: true, road: null, spin: 0, lastSpeedo: -1, rider: null };

    /* ---- wheels ---- */
    var front = buildWheel(false); front.position.set(FX, R, 0); okada.add(front);
    var rear = buildWheel(true); rear.position.set(RX, R, 0); okada.add(rear);
    parts.frontWheel = front; parts.rearWheel = rear; parts.mud = rear.userData.mud;

    /* ---- sprung body, pivoting about the front axle ---- */
    var body = new THREE.Group(); body.position.set(FX, R, 0); okada.add(body);
    var bodyInv = new THREE.Matrix4().makeTranslation(-FX, -R, 0);
    var b = new Batch();
    // fork: sliders + gaiters + chrome stanchions, raked back to the headstock
    var axle = v3(FX, R, 0), top = v3(0.40, 0.93, 0), fdir = new V3().subVectors(top, axle).normalize(), flen = axle.distanceTo(top);
    [-0.075, 0.075].forEach(function (z) {
      var a = axle.clone().setZ(z);
      b.add("fork", M.cast, gLathe([[0.016, 0], [0.024, 0.01], [0.024, 0.2], [0.021, 0.22], [0.016, 0.225]], 16), mAxis(a, fdir));
      // rubber gaiter: ribbed lathe bellows
      var gp = []; for (var k = 0; k <= 14; k++) gp.push([0.019 + (k % 2 ? 0.006 : 0), 0.225 + k * 0.012]);
      b.add("fork", M.rubber, gLathe(gp, 16), mAxis(a, fdir));
      b.add("fork", M.chrome, gLathe([[0.0155, 0.39], [0.0155, flen - 0.05], [0.0175, flen - 0.04], [0.0175, flen], [0.006, flen + 0.004]], 14), mAxis(a, fdir));
    });
    // triple clamps (extruded yoke plates with stanchion holes)
    [0.62, 0.95].forEach(function (u, k) {
      var c = axle.clone().lerp(top, u);
      var ys = roundedRectShape(0.07, 0.21, 0.03); ys.holes.push(circlePath(0, -0.075, 0.016), circlePath(0, 0.075, 0.016), circlePath(0, 0, 0.012));
      var yg = Extrude(ys, { depth: 0.022, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2, curveSegments: 8 });
      yg.translate(0, 0, -0.011); yg.rotateX(Math.PI / 2);
      var q = new THREE.Quaternion().setFromUnitVectors(_up, fdir);
      b.add("fork", k ? M.chrome : M.darkSteel, yg, new THREE.Matrix4().compose(c, q, new V3(1, 1, 1)));
    });
    // front mudguard: U-channel swept along an arc over the front tyre
    function guard(cx, cy, rad, a0, a1, w) {
      var sh = new THREE.Shape(); sh.moveTo(0, -w / 2); sh.lineTo(0.018, -w / 2); sh.lineTo(0.018, -w / 2 + 0.004); sh.lineTo(0.004, -w / 2 + 0.006); sh.lineTo(0.004, w / 2 - 0.006); sh.lineTo(0.018, w / 2 - 0.004); sh.lineTo(0.018, w / 2); sh.lineTo(0, w / 2); sh.lineTo(0, -w / 2);
      var pts = []; for (var k2 = 0; k2 <= 24; k2++) { var aa = a0 + (a1 - a0) * k2 / 24; pts.push(new V3(cx + Math.cos(aa) * rad, cy + Math.sin(aa) * rad, 0)); }
      return Extrude(sh, { steps: 22, bevelEnabled: false, extrudePath: new THREE.CatmullRomCurve3(pts) });
    }
    b.add("mudguards", M.paint, guard(FX, R, 0.345, 0.55, 2.05, 0.1));
    b.add("fork", M.darkSteel, gRod([FX + 0.02, R + 0.31, -0.075], [FX + 0.02, R + 0.31, 0.075], 0.006, 6));
    // headlamp: lathe bucket + chrome rim + lens, on brackets, with two indicators
    var lampC = v3(0.47, 0.87, 0), xdir = new V3(1, 0, 0);
    b.add("headlamp", M.black, gLathe([[0.004, -0.07], [0.04, -0.068], [0.068, -0.05], [0.078, -0.02], [0.08, 0.005]], 24), mAxis(lampC, xdir));
    b.add("headlamp", M.chrome, gLathe([[0.08, 0.0], [0.084, 0.006], [0.082, 0.014], [0.074, 0.016]], 28), mAxis(lampC, xdir));
    b.add("headlamp", M.lampLens, gLathe([[0.0004, 0.022], [0.04, 0.019], [0.074, 0.012]], 28), mAxis(lampC, xdir));
    [-0.075, 0.075].forEach(function (z) { b.add("headlamp", M.darkSteel, gRod([0.43, 0.87, z * 1.05], [0.47, 0.87, z * 1.05], 0.006, 6)); });
    [-1, 1].forEach(function (s) {
      b.add("headlamp", M.black, gRod([0.45, 0.84, s * 0.06], [0.45, 0.84, s * 0.15], 0.006, 6));
      b.add("headlamp", M.amber, gLathe([[0.0004, 0], [0.018, 0.004], [0.02, 0.02], [0.014, 0.034], [0.0004, 0.036]], 14), mAxis(v3(0.44, 0.84, s * 0.15), xdir));
    });
    // handlebar, grips, levers, mirrors
    var hb = [[0.33, 1.05, -0.37], [0.36, 1.05, -0.26], [0.39, 1.0, -0.12], [0.40, 0.99, 0], [0.39, 1.0, 0.12], [0.36, 1.05, 0.26], [0.33, 1.05, 0.37]];
    b.add("handlebar", M.chrome, gTube(hb, 0.011, 40, 10));
    [-1, 1].forEach(function (s) {
      var gp2 = []; for (var k = 0; k <= 10; k++) gp2.push([0.017 + (k % 2 ? 0.0025 : 0), k * 0.012]);
      gp2.push([0.019, 0.125], [0.006, 0.128]);
      b.add("handlebar", M.rubber, gLathe(gp2, 14), mAxis(v3(0.345, 1.05, s * 0.29), new V3(-0.15, 0, s)));
      b.add("handlebar", M.black, gLathe([[0.026, 0], [0.03, 0.02], [0.026, 0.04], [0.008, 0.045]], 12), mAxis(v3(0.36, 1.05, s * 0.255), new V3(0, 0, s)));
      b.add("handlebar", M.chrome, gTube([[0.37, 1.05, s * 0.26], [0.42, 1.06, s * 0.31], [0.43, 1.05, s * 0.36]], 0.005, 10, 6));
      b.add("handlebar", M.black, gTube([[0.37, 1.055, s * 0.23], [0.36, 1.13, s * 0.27], [0.34, 1.2, s * 0.31]], 0.0055, 12, 6));
      var mir = gLathe([[0.0004, 0], [0.045, 0.002], [0.05, 0.012], [0.0004, 0.016]], 20); mir.scale(1, 1, 0.7);
      b.add("handlebar", M.black, mir, mAxis(v3(0.34, 1.22, s * 0.32), new V3(-1, 0.05, 0)));
      b.add("handlebar", M.mirror, new THREE.CircleGeometry(0.043, 18).scale(1, 1, 0.7), mTR(0.336, 1.22, s * 0.32, 0, -Math.PI / 2, Math.PI / 2));
    });
    // fuel tank: analytically deformed shell (taper, knee recesses, tunnel underside)
    var tk = new THREE.SphereGeometry(1, S(32, 18), S(20, 12)), tp = tk.attributes.position;
    for (i = 0; i < tp.count; i++) {
      var x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i);
      var X = 0.17 + x * 0.25;
      var hw = 0.155 * (1 - 0.38 * smooth(0.1, -1, x)) * (1 - 0.1 * smooth(0.6, 1, x));
      var Z = z * hw;
      var knee = smooth(-0.15, -0.65, x) * smooth(-0.9, -0.25, y) * smooth(0.55, 0.95, Math.abs(z));
      Z -= Math.sign(z) * 0.03 * knee;
      var Y = y > 0 ? y * (0.105 + 0.03 * x) : Math.max(y * 0.085, -0.06);
      Y += 0.84 + 0.035 * x;
      if (y < 0) Y += 0.035 * Math.max(0, 1 - Math.abs(z) / 0.45);           // tunnel over the frame backbone
      tp.setXYZ(i, X, Y, Z);
    }
    tk.computeVertexNormals();
    b.add("tank", M.tank, tk);
    b.add("tank", M.chrome, gLathe([[0.0004, 0.012], [0.028, 0.01], [0.032, 0.004], [0.03, 0]], 20), mT(0.24, 0.96, 0));
    // frame: steel tubes (diamond frame with cradle) + seat rails
    b.add("frame", M.paint, gRod([0.40, 0.93, 0], [0.38, 1.01, 0], 0.03, 16));
    b.add("frame", M.paint, gTube([[0.39, 0.95, 0], [0.25, 0.86, 0], [0.05, 0.8, 0], [-0.08, 0.76, 0]], 0.022, 20, 8));
    b.add("frame", M.paint, gTube([[0.39, 0.92, 0], [0.33, 0.68, 0], [0.28, 0.42, 0], [0.24, 0.24, 0], [0.12, 0.15, 0], [-0.08, 0.17, 0], [-0.14, 0.3, 0], [-0.1, 0.44, 0]], 0.018, 36, 8));
    [-1, 1].forEach(function (s) {
      b.add("frame", M.paint, gTube([[-0.06, 0.76, s * 0.04], [-0.3, 0.73, s * 0.09], [-0.62, 0.72, s * 0.095], [-0.8, 0.74, s * 0.08]], 0.014, 20, 6));
      b.add("frame", M.paint, gTube([[-0.1, 0.43, s * 0.07], [-0.3, 0.56, s * 0.09], [-0.52, 0.71, s * 0.097]], 0.014, 12, 6));
    });
    b.add("frame", M.paint, gRod([-0.1, 0.43, -0.075], [-0.1, 0.43, 0.075], 0.02, 12));
    // side covers: extruded panels under the seat (both sides)
    var sc = splineShape([[-0.08, 0.72], [-0.36, 0.71], [-0.3, 0.6], [-0.16, 0.52], [-0.06, 0.6]]);
    [-1, 1].forEach(function (s) {
      var sg = Extrude(sc, { depth: 0.02, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1, curveSegments: 6 });
      sg.translate(0, 0, s > 0 ? 0.085 : -0.105);
      b.add("frame", M.black, sg);
    });
    b.add("frame", M.black, (function () { var ab = Extrude(roundedRectShape(0.2, 0.14, 0.03, -0.2, 0.62), { depth: 0.16, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }); ab.translate(0, 0, -0.08); return ab; })());
    // seat: extruded side profile, bevelled, then tapered + crowned
    var ss = new THREE.Shape(); ss.moveTo(0.06, 0.8); ss.quadraticCurveTo(0.0, 0.85, -0.14, 0.855); ss.lineTo(-0.5, 0.86); ss.quadraticCurveTo(-0.62, 0.86, -0.64, 0.82); ss.lineTo(-0.62, 0.765); ss.lineTo(0.04, 0.775); ss.lineTo(0.06, 0.8);
    var sgeo = Extrude(ss, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.028, bevelSize: 0.024, bevelSegments: 5, curveSegments: 14 });
    sgeo.translate(0, 0, -0.1);
    var spos = sgeo.attributes.position;
    for (i = 0; i < spos.count; i++) {
      var sx = spos.getX(i), sz = spos.getZ(i), sy = spos.getY(i);
      var taper = 0.68 + 0.32 * smooth(0.05, -0.2, sx);
      spos.setZ(i, sz * taper);
      if (sy > 0.82) spos.setY(i, sy - 0.03 * Math.pow(sz / 0.13, 2));
    }
    sgeo.computeVertexNormals();
    b.add("seat", M.vinyl, sgeo);
    b.add("seat", M.chrome, gTube([[-0.36, 0.79, -0.15], [-0.6, 0.8, -0.15], [-0.66, 0.8, 0], [-0.6, 0.8, 0.15], [-0.36, 0.79, 0.15]], 0.01, 30, 8));
    // engine: extruded crankcase, finned barrel + head (lathe), clutch & magneto covers
    var cc = splineShape([[0.21, 0.36], [0.24, 0.28], [0.22, 0.19], [0.1, 0.15], [-0.05, 0.16], [-0.12, 0.23], [-0.11, 0.34], [-0.01, 0.4], [0.13, 0.42]]);
    var ccg = Extrude(cc, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.014, bevelSegments: S(2, 1), curveSegments: S(8, 4) });
    ccg.translate(0, 0, -0.08);
    b.add("engine", M.cast, ccg);
    var finP = [[0.04, 0]];
    for (var f = 0; f < 9; f++) { var y0 = 0.012 + f * 0.0135; finP.push([0.042, y0], [0.074 - f * 0.001, y0 + 0.002], [0.074 - f * 0.001, y0 + 0.006], [0.042, y0 + 0.008]); }
    finP.push([0.05, 0.135], [0.082, 0.14], [0.082, 0.146], [0.05, 0.15], [0.082, 0.156], [0.082, 0.162], [0.05, 0.168], [0.08, 0.172], [0.08, 0.178], [0.055, 0.19], [0.045, 0.205], [0.0004, 0.21]);
    var cyl = gLathe(finP, 16);
    var cdir = new V3(Math.sin(0.3), Math.cos(0.3), 0);
    b.add("engine", M.cast, cyl, mAxis(v3(0.13, 0.38, 0), cdir));
    b.add("engine", M.chrome, gLathe([[0.0004, 0.004], [0.075, 0], [0.08, 0.012], [0.07, 0.03], [0.04, 0.04], [0.0004, 0.042]], 28), mTR(0.06, 0.28, 0.096, Math.PI / 2, 0, 0));
    b.add("engine", M.cast, gLathe([[0.0004, 0.004], [0.06, 0], [0.065, 0.012], [0.05, 0.028], [0.0004, 0.032]], 24), mTR(-0.02, 0.27, -0.096, -Math.PI / 2, 0, 0));
    // carburettor + intake, kick-start, gear lever, footpegs
    b.add("engine", M.engineDark, gLathe([[0.0004, 0], [0.024, 0], [0.026, 0.03], [0.02, 0.06], [0.0004, 0.062]], 14), mAxis(v3(0.06, 0.5, 0.02), new V3(-1, 0.3, 0)));
    b.add("engine", M.rubber, gTube([[-0.01, 0.52, 0.02], [-0.08, 0.56, 0.02], [-0.13, 0.6, 0.0]], 0.02, 12, 10));
    b.add("engine", M.chrome, gTube([[-0.02, 0.3, 0.13], [-0.06, 0.24, 0.15], [-0.14, 0.2, 0.16]], 0.008, 12, 6));
    b.add("engine", M.rubber, gRod([-0.14, 0.2, 0.15], [-0.14, 0.2, 0.2], 0.012, 8));
    b.add("engine", M.darkSteel, gTube([[0.0, 0.26, -0.11], [0.08, 0.24, -0.15], [0.12, 0.26, -0.16]], 0.007, 10, 6));
    [-1, 1].forEach(function (s) {
      b.add("frame", M.darkSteel, gRod([0.02, 0.28, s * 0.08], [0.02, 0.28, s * 0.16], 0.008, 8));
      b.add("frame", M.rubber, gLathe([[0.014, 0], [0.016, 0.006], [0.016, 0.056], [0.0004, 0.06]], 10), mAxis(v3(0.02, 0.28, s * 0.155), new V3(0, 0, s)));
      b.add("frame", M.darkSteel, gTube([[-0.42, 0.72, s * 0.09], [-0.42, 0.5, s * 0.11], [-0.38, 0.34, s * 0.13]], 0.007, 10, 6));
      b.add("frame", M.rubber, gLathe([[0.012, 0], [0.013, 0.05], [0.0004, 0.052]], 8), mAxis(v3(-0.38, 0.34, s * 0.13), new V3(0, 0, s)));
    });
    // exhaust: header pipe + muffler (lathe) + perforated heat shield, right side (+z)
    b.add("exhaust", M.chrome, gTube([[0.2, 0.52, 0.03], [0.29, 0.44, 0.06], [0.3, 0.3, 0.1], [0.22, 0.19, 0.13], [0.0, 0.17, 0.15], [-0.25, 0.25, 0.16], [-0.34, 0.29, 0.16]], 0.017, 50, 10));
    var mA = v3(-0.33, 0.29, 0.16), mB = v3(-0.86, 0.41, 0.16), mdir = new V3().subVectors(mB, mA), mlen = mdir.length();
    b.add("exhaust", M.muffler, gLathe([[0.017, 0], [0.03, 0.03], [0.05, 0.08], [0.054, 0.12], [0.054, mlen - 0.08], [0.046, mlen - 0.03], [0.02, mlen - 0.015], [0.016, mlen + 0.02], [0.012, mlen + 0.02]], 22), mAxis(mA, mdir));
    b.add("exhaust", M.perf, gLathe([[0.06, 0.06], [0.06, 0.3]], 16, -0.4, 1.6), mAxis(mA, mdir));
    // rear mudguard, tail lamp, number plate, carrier rack
    b.add("mudguards", M.paint, guard(RX, R + 0.02, 0.37, 0.35, 1.75, 0.13));
    var tl = v3(-0.99, 0.72, 0);
    b.add("tailLamp", M.black, gLathe([[0.0004, -0.04], [0.035, -0.035], [0.045, 0], [0.04, 0.012]], 18).scale(1, 1, 1.5), mAxis(tl, new V3(-1, 0, 0)));
    b.add("tailLamp", M.tailRed, gLathe([[0.04, 0.012], [0.03, 0.022], [0.0004, 0.026]], 18).scale(1, 1, 1.5), mAxis(tl, new V3(-1, 0, 0)));
    [-1, 1].forEach(function (s) { b.add("tailLamp", M.amber, gLathe([[0.0004, 0], [0.016, 0.004], [0.018, 0.018], [0.0004, 0.03]], 12), mAxis(v3(-0.98, 0.68, s * 0.13), new V3(-1, 0, 0))); b.add("tailLamp", M.black, gRod([-0.96, 0.68, s * 0.05], [-0.97, 0.68, s * 0.13], 0.005, 6)); });
    b.add("plate", M.black, gRod([-0.95, 0.66, 0], [-1.0, 0.55, 0], 0.006, 6));
    // carrier rack (welded steel tube grid) behind the seat
    var CY = 0.815;
    [-1, 1].forEach(function (s) {
      b.add("carrier", M.darkSteel, gTube([[-0.5, 0.79, s * 0.12], [-0.56, CY, s * 0.17], [-0.98, CY, s * 0.17], [-1.02, CY - 0.005, s * 0.12]], 0.011, 20, 6));
      b.add("carrier", M.darkSteel, gRod([-0.6, CY - 0.01, s * 0.165], [-0.55, 0.72, s * 0.1], 0.008, 6));
      b.add("carrier", M.darkSteel, gRod([-0.94, CY - 0.01, s * 0.165], [-0.8, 0.735, s * 0.085], 0.008, 6));
    });
    b.add("carrier", M.darkSteel, gTube([[-1.02, CY - 0.005, -0.12], [-1.04, CY - 0.005, 0], [-1.02, CY - 0.005, 0.12]], 0.011, 12, 8));
    for (i = 0; i < 6; i++) b.add("carrier", M.darkSteel, gRod([-0.6 - i * 0.075, CY, -0.17], [-0.6 - i * 0.075, CY, 0.17], 0.0065, 6));
    b.add("carrier", M.darkSteel, gRod([-0.98, CY, 0], [-0.58, CY, 0], 0.0065, 6));
    // rubber strap over the crate (simple loop, hidden when no crate)
    parts = b.flush(body, bodyInv, parts);
    // number plate with its own texture (planar UVs)
    var plate = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.064), M.plate); plate.position.set(-1.005 - FX, 0.54 - R, 0); plate.rotation.y = -Math.PI / 2; plate.rotation.z = 0.12; tagPart(plate, "plate"); body.add(plate); parts.plate = plate;
    // speedometer pod with a live dial (CanvasTexture)
    var spC = document.createElement("canvas"); spC.width = spC.height = 128;
    var spTex = srgb(new THREE.CanvasTexture(spC));
    function drawSpeedo(kmh) {
      var g2 = spC.getContext("2d"), w = 128, c = w / 2;
      g2.fillStyle = "#101114"; g2.fillRect(0, 0, w, w);
      g2.fillStyle = "#f2efe6"; g2.beginPath(); g2.arc(c, c, 58, 0, TAU); g2.fill();
      g2.fillStyle = "#101114"; g2.beginPath(); g2.arc(c, c, 54, 0, TAU); g2.fill();
      g2.strokeStyle = "#f2efe6"; g2.fillStyle = "#f2efe6"; g2.font = "bold 11px Arial"; g2.textAlign = "center";
      for (var v = 0; v <= 120; v += 10) {
        var a = Math.PI * 0.75 + v / 120 * Math.PI * 1.5;
        g2.lineWidth = v % 20 ? 1 : 2.5; g2.beginPath(); g2.moveTo(c + Math.cos(a) * 52, c + Math.sin(a) * 52); g2.lineTo(c + Math.cos(a) * (v % 20 ? 46 : 42), c + Math.sin(a) * (v % 20 ? 46 : 42)); g2.stroke();
        if (!(v % 20)) g2.fillText(String(v), c + Math.cos(a) * 32, c + Math.sin(a) * 32 + 4);
      }
      g2.font = "9px Arial"; g2.fillText("km/h", c, c + 30);
      var an = Math.PI * 0.75 + clamp(kmh, 0, 120) / 120 * Math.PI * 1.5;
      g2.strokeStyle = "#ff5a2a"; g2.lineWidth = 3; g2.beginPath(); g2.moveTo(c, c); g2.lineTo(c + Math.cos(an) * 48, c + Math.sin(an) * 48); g2.stroke();
      g2.fillStyle = "#ccc"; g2.beginPath(); g2.arc(c, c, 5, 0, TAU); g2.fill();
      spTex.needsUpdate = true;
    }
    drawSpeedo(0);
    var speedo = new THREE.Group();
    var pod = new THREE.Mesh(gLathe([[0.0004, -0.03], [0.04, -0.028], [0.05, -0.01], [0.052, 0.006], [0.046, 0.008]], 24), M.black);
    var face = new THREE.Mesh(new THREE.CircleGeometry(0.045, 28), new THREE.MeshBasicMaterial({ map: spTex })); face.rotation.x = -Math.PI / 2; face.position.y = 0.0;
    face.rotation.z = Math.PI / 2;
    speedo.add(pod); speedo.add(face);
    speedo.position.set(0.40 - FX, 1.08 - R, 0); speedo.rotation.z = 0.75;     // tilted towards the rider
    tagPart(speedo, "speedometer"); body.add(speedo); parts.speedometer = speedo;

    /* ---- swing-arm (pivots at the frame; carries the chain) ---- */
    var PIV = v3(-0.1, 0.43, 0), AX0 = v3(RX, R, 0);
    var sw = new THREE.Group(); okada.add(sw);
    var swDir0 = new V3().subVectors(AX0, PIV), swLen0 = swDir0.length(), swAng0 = Math.atan2(-swDir0.y, -swDir0.x);
    sw.position.copy(PIV); sw.rotation.z = swAng0; sw.updateMatrix();
    var swInv = sw.matrix.clone().invert();
    var bs = new Batch();
    var arm = new THREE.Shape(); arm.moveTo(0.02, -0.028); arm.lineTo(-swLen0 + 0.03, -0.02); arm.quadraticCurveTo(-swLen0 - 0.035, -0.02, -swLen0 - 0.035, 0); arm.quadraticCurveTo(-swLen0 - 0.035, 0.02, -swLen0 + 0.03, 0.02); arm.lineTo(0.02, 0.03); arm.quadraticCurveTo(0.045, 0, 0.02, -0.028);
    arm.holes.push(roundedRectPath(0.05, 0.012, 0.006, -swLen0 + 0.0, 0));     // axle adjuster slot
    [-1, 1].forEach(function (s) {
      var ag = Extrude(arm, { depth: 0.022, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 1, curveSegments: 5 });
      ag.translate(0, 0, s > 0 ? 0.075 : -0.097);
      ag.applyMatrix4(sw.matrix);       // author in okada space, flushed back through swInv
      bs.add("swingarm", M.darkSteel, ag);
    });
    bs.add("swingarm", M.darkSteel, gRod([PIV.x, PIV.y, -0.1], [PIV.x, PIV.y, 0.1], 0.016, 12));
    bs.add("swingarm", M.darkSteel, gRod(new V3(-0.32, 0.385, -0.085), new V3(-0.32, 0.385, 0.085), 0.012, 10));
    // chain loop round the engine sprocket and the wheel sprocket + chain guard
    var fs = v3(-0.02, 0.27, -0.068), chainPts = [], cR = 0.098, fR = 0.034;
    for (i = 0; i <= 12; i++) { var aa2 = Math.PI / 2 + i / 12 * Math.PI; chainPts.push(new V3(RX + Math.cos(aa2) * cR, R + Math.sin(aa2) * cR, -0.068)); }
    for (i = 0; i <= 10; i++) { var aa3 = -Math.PI / 2 + i / 10 * Math.PI; chainPts.push(new V3(fs.x + Math.cos(aa3) * fR, fs.y + Math.sin(aa3) * fR, -0.068)); }
    bs.add("chain", M.chain, gTube(chainPts, 0.0055, 60, 4, true, 0.3));
    var cg = new THREE.Shape(); cg.moveTo(0.02, 0.29); cg.lineTo(-0.6, 0.39); cg.quadraticCurveTo(-0.66, 0.39, -0.66, 0.36); cg.lineTo(-0.6, 0.355); cg.lineTo(0.0, 0.27); cg.lineTo(0.02, 0.29);
    var cgg = Extrude(cg, { depth: 0.04, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 1 }); cgg.translate(0, 0.03, -0.095);
    bs.add("chain", M.black, cgg);
    bs.flush(sw, swInv, parts);

    /* ---- anchors (mass-spring v2 hangs its own coil-overs on these) ---- */
    var anchors = {};
    function anchor(name, parent, p, inv) { var o = new THREE.Object3D(); o.name = name; o.position.copy(p).applyMatrix4(inv); parent.add(o); anchors[name] = o; return o; }
    var SHZ = 0.108;
    anchor("shockTopL", body, v3(-0.52, 0.715, -SHZ), bodyInv); anchor("shockTopR", body, v3(-0.52, 0.715, SHZ), bodyInv);
    anchor("shockBottomL", sw, v3(-0.585, 0.375, -SHZ), swInv); anchor("shockBottomR", sw, v3(-0.585, 0.375, SHZ), swInv);
    anchor("carrierTop", body, v3(-0.79, CY + 0.012, 0), bodyInv);
    anchor("swingPivot", body, PIV, bodyInv);
    anchor("seat", body, v3(-0.22, 0.86, 0), bodyInv);
    anchor("handlebarL", body, v3(0.34, 1.05, -0.3), bodyInv); anchor("handlebarR", body, v3(0.34, 1.05, 0.3), bodyInv);
    anchor("headlamp", body, v3(0.55, 0.87, 0), bodyInv);
    anchors.frontAxle = front; anchors.rearAxle = rear;

    /* ---- twin rear coil-overs (optional) ---- */
    var shocks = new THREE.Group(); okada.add(shocks); tagPart(shocks, "rear-shock");
    var shockL = createShock({ leak: st.leak }), shockR = createShock({ leak: st.leak });
    shocks.add(shockL); shocks.add(shockR); shocks.visible = st.shocks;
    parts["rear-shock"] = shocks;

    /* ---- centre stand + side stand (rotate about their pivots) ---- */
    var stand = new THREE.Group(); stand.position.set(-0.13 - FX, 0.2 - R, 0); body.add(stand);
    var bst = new Batch();
    [-1, 1].forEach(function (s) { bst.add("stand", M.darkSteel, gTube([[0, 0, s * 0.09], [-0.05, -0.1, s * 0.11], [-0.07, -0.17, s * 0.12]], 0.01, 10, 6)); bst.add("stand", M.rubber, gRod([-0.07, -0.175, s * 0.09], [-0.07, -0.175, s * 0.15], 0.012, 8)); });
    bst.add("stand", M.darkSteel, gRod([-0.055, -0.13, -0.11], [-0.055, -0.13, 0.11], 0.008, 6));
    bst.flush(stand, null, parts);
    var side = new THREE.Group(); side.position.set(-0.02 - FX, 0.2 - R, -0.1); body.add(side);
    var bsd = new Batch(); bsd.add("stand", M.darkSteel, gRod([0, 0, 0], [-0.03, -0.2, -0.06], 0.009, 6)); bsd.add("stand", M.darkSteel, gRod([-0.05, -0.2, -0.06], [0.0, -0.2, -0.06], 0.012, 6)); bsd.flush(side, null, parts);

    /* ---- crates (free body, child of the okada so it can leave the carrier) ---- */
    var crateG = new THREE.Group(); okada.add(crateG); tagPart(crateG, "crate");
    var crates = [];
    for (i = 0; i < 3; i++) { var c = createCrate({ seed: 3 + i, lite: i > 0 }); c.position.y = i * 0.275; c.rotation.y = (i - 1) * 0.04; crateG.add(c); crates.push(c); }
    var strap = new THREE.Mesh(gTube([[-0.186, -0.01, 0.1], [-0.186, 0.25, 0.1], [-0.17, 0.272, 0.1], [0, 0.274, 0.1], [0.17, 0.272, 0.1], [0.186, 0.25, 0.1], [0.186, -0.01, 0.1]], 0.006, 40, 5, false, 0.1), M.strap);
    var strap2 = strap.clone(); strap2.position.z = -0.2; crateG.add(strap); crateG.add(strap2);
    tagPart(crateG, "crate"); parts.crate = crateG;
    parts.eggs = crates[0].userData.eggs;
    okada.topCrate = function () { return crates[Math.max(0, st.crates - 1)]; };
    // crack flash (sprite) + yolk drip on the top tray
    var flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: texFlash(), transparent: true, depthWrite: false, depthTest: false, opacity: 0 }));
    flash.scale.set(0.5, 0.5, 1); flash.renderOrder = 5; crateG.add(flash);
    // mud shadow (the "sun shadow" of the lump, L03): soft ellipse on the ground
    var shC = canvasTex(64, 32, function (g2, w, h) { var gr = g2.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2); gr.addColorStop(0, "rgba(0,0,0,0.75)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); });
    var mudShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06), new THREE.MeshBasicMaterial({ map: shC, transparent: true, depthWrite: false }));
    mudShadow.rotation.x = -Math.PI / 2; mudShadow.position.set(RX, 0.03, -0.3); mudShadow.visible = false; tagPart(mudShadow, "shadow"); okada.add(mudShadow);
    parts.shadow = mudShadow;
    parts.body = body; parts.swingarmGroup = sw;

    /* ================= state ================= */
    var tmpA = new V3(), tmpB = new V3(), dir = new V3(), q = new THREE.Quaternion();
    var Lc = FX - (-0.79);              // front axle -> carrier distance (1.44 m)
    function pose() {
      var standLift = st.stand ? 0.035 : 0;
      var yF = st.yF, yR = st.yR + standLift;
      front.position.y = R + yF; rear.position.y = R + yR;
      body.position.y = R + yF;
      // absolute carrier displacement = st.bounce (+ stand lift), pivoting about the front axle
      body.rotation.z = -Math.atan2(st.bounce + standLift - yF, Lc);
      body.updateMatrix(); body.updateMatrixWorld(true);
      // swing-arm from the frame pivot to the rear axle
      tmpA.copy(anchors.swingPivot.position).applyMatrix4(body.matrix);
      dir.set(rear.position.x - tmpA.x, rear.position.y - tmpA.y, 0);
      sw.position.copy(tmpA); sw.rotation.z = Math.atan2(-dir.y, -dir.x); sw.scale.x = dir.length() / swLen0;
      sw.updateMatrix(); sw.updateMatrixWorld(true);
      // coil-overs between the anchors
      [[shockL, "shockBottomL", "shockTopL"], [shockR, "shockBottomR", "shockTopR"]].forEach(function (e) {
        tmpA.copy(anchors[e[1]].position).applyMatrix4(sw.matrix);
        tmpB.copy(anchors[e[2]].position).applyMatrix4(body.matrix);
        dir.subVectors(tmpB, tmpA); var len = dir.length();
        e[0].position.copy(tmpA); e[0].quaternion.copy(q.setFromUnitVectors(_up, dir.normalize()));
        e[0].setLength(len);
      });
      // crate(s) ride on the carrier, plus any lift
      tmpA.copy(anchors.carrierTop.position).applyMatrix4(body.matrix);
      crateG.position.set(tmpA.x, tmpA.y + st.lift, tmpA.z);
      crateG.rotation.z = body.rotation.z + (st.lift > 0.01 ? Math.sin(st.lift * 30) * 0.06 : 0);
      stand.rotation.z = st.stand ? 0.0 : -1.15;
      side.rotation.z = st.kmh > 0.5 || st.stand || st.rider ? -1.25 : 0;
      side.visible = !st.stand;
    }
    function setCrates(n) {
      st.crates = clamp(Math.round(n), 0, 3);
      crates.forEach(function (c, k) { c.visible = k < st.crates; c.userData.eggs.visible = k === st.crates - 1; });
      strap.visible = strap2.visible = st.crates > 0;
      strap.scale.y = strap2.scale.y = Math.max(1, st.crates);
      flash.position.set(0, st.crates * 0.275 + 0.05, 0);
    }
    function crack(n) {
      st.cracks++; st.flash = 1;
      var topC = crates[Math.max(0, st.crates - 1)]; if (topC) topC.userData.crack(n || 4);
    }

    /* ---- rider (a StoryStage person seated on the okada) ---- */
    var riderSave = null;
    function seatRider(p) {
      dismount();
      if (!p && global.StoryStage) p = global.StoryStage.person({ skin: "#4a2e1f", outfit: "#2b6cb0", pants: "#1c2433", hair: "short" });
      if (!p || !p.userData || !p.userData.legL) return null;
      var u = p.userData;
      riderSave = { p: p, parent: p.parent, pos: p.position.clone(), rot: p.rotation.clone(), shoes: [] };
      if (p.parent) p.parent.remove(p);
      // move the shoes onto the feet (they belong to the body group in StoryStage people)
      u.body.children.slice().forEach(function (c) {
        if (c.isMesh && c.geometry && c.geometry.type === "BoxGeometry" && c.position.y < 0.05) {
          riderSave.shoes.push({ m: c, pos: c.position.clone() });
          var leg = c.position.x < 0 ? u.legL : u.legR; leg.add(c); c.position.set(0, -0.84, 0.04);
        }
      });
      anchors.seat.add(p);
      p.position.set(0.04, -0.86, 0); p.rotation.set(0, Math.PI / 2, 0);
      st.rider = p; parts.rider = p; tagPart(p, "rider");
      return p;
    }
    function dismount() {
      if (!riderSave) return null;
      var p = riderSave.p, u = p.userData;
      anchors.seat.remove(p);
      riderSave.shoes.forEach(function (s) { u.body.add(s.m); s.m.position.copy(s.pos); });
      u.legL.rotation.x = u.legR.rotation.x = 0; u.legL.rotation.z = u.legR.rotation.z = 0; u.body.rotation.x = 0;
      if (riderSave.parent) riderSave.parent.add(p);
      p.position.copy(riderSave.pos); p.rotation.copy(riderSave.rot);
      st.rider = null; delete parts.rider; riderSave = null;
      return p;
    }
    function poseRider() {
      var p = st.rider; if (!p) return;
      var u = p.userData;
      p.rotation.set(0, Math.PI / 2, 0); p.position.set(0.04, -0.86, 0);
      u.legL.rotation.x = u.legR.rotation.x = -1.05;       // thighs forward, feet on the pegs
      u.legL.rotation.z = 0.08; u.legR.rotation.z = -0.08;
      u.body.rotation.x = 0.16; u.body.position.y = 0;
      u.armL.rotation.x = u.armR.rotation.x = -1.05;
      u.armL.rotation.z = -0.1; u.armR.rotation.z = 0.1;
    }

    /* ---- per frame ---- */
    var speedoT = 0;
    function update(dt, t) {
      dt = Math.min(dt || 0, 0.05);
      var v = st.kmh / 3.6;
      if (st.road && st.autoBump) {          // treadmill road: scroll it and read the bumps under each wheel
        st.road.scroll(st.road.userData.s + v * dt);
        okada.updateMatrixWorld(true);
        tmpA.set(RX, 0, 0); okada.localToWorld(tmpA); st.road.worldToLocal(tmpA);
        tmpB.set(FX, 0, 0); okada.localToWorld(tmpB); st.road.worldToLocal(tmpB);
        st.yR = st.road.bumpAt(tmpA.x); st.yF = st.road.bumpAt(tmpB.x);
      }
      st.spin -= v / R * dt + (st.stand && st.kmh <= 0 ? st.standSpin * dt : 0);
      front.rotation.z = st.stand ? 0 : st.spin; rear.rotation.z = st.spin;
      if (st.mud) {
        tmpA.set(0, R + 0.006, 0).applyAxisAngle(new V3(0, 0, 1), rear.rotation.z);
        mudShadow.position.set(rear.position.x + tmpA.x, 0.03, -0.3);
      }
      pose();
      poseRider();
      if (st.flash > 0) { st.flash = Math.max(0, st.flash - dt * 2.2); flash.material.opacity = st.flash; flash.scale.setScalar(0.35 + (1 - st.flash) * 0.4); }
      speedoT += dt;
      if (Math.abs(st.kmh - st.lastSpeedo) > 0.4 && speedoT > 0.1) { st.lastSpeedo = st.kmh; speedoT = 0; drawSpeedo(st.kmh); }
    }
    function setState(o) {
      o = o || {};
      if (o.bounce != null) st.bounce = o.bounce;
      if (o.yF != null) st.yF = o.yF; if (o.yR != null) st.yR = o.yR;
      if (o.speed_kmh != null) st.kmh = Math.max(0, o.speed_kmh);
      if (o.crates != null) setCrates(o.crates);
      if (o.lift != null) st.lift = Math.max(0, o.lift);
      if (o.mud != null) setMud(o.mud);
      if (o.centreStand != null) st.stand = !!o.centreStand;
      if (o.leak != null) { st.leak = !!o.leak; shockL.setLeak(st.leak); shockR.setLeak(st.leak); }
      if (o.shocks != null) { st.shocks = !!o.shocks; shocks.visible = st.shocks; }
      pose();
    }
    function setMud(on) { st.mud = !!on; rear.userData.mud.visible = st.mud; mudShadow.visible = st.mud; }
    st.standSpin = 0;

    okada.setBounce = function (y) { st.bounce = y || 0; pose(); return okada; };
    okada.setWheelBump = function (yF, yR) { st.yF = yF || 0; st.yR = yR || 0; st.autoBump = false; pose(); return okada; };
    okada.setSpeed = function (kmh) { st.kmh = Math.max(0, kmh || 0); return okada; };
    okada.liftCrate = function (dy) { st.lift = Math.max(0, dy || 0); pose(); return okada; };
    okada.crack = crack;
    okada.setCrates = setCrates;
    okada.setMud = setMud;
    okada.setCentreStand = function (on, spinRadPerS) { st.stand = !!on; st.standSpin = spinRadPerS || 0; pose(); return okada; };
    okada.spinRear = function (radPerS) { st.standSpin = radPerS || 0; return okada; };
    okada.setLeak = function (on) { setState({ leak: on }); return okada; };
    okada.setShocksVisible = function (on) { setState({ shocks: on }); return okada; };
    okada.attachRoad = function (road, auto) { st.road = road; st.autoBump = auto !== false; return okada; };
    okada.seatRider = seatRider; okada.dismount = dismount;
    okada.resetEggs = function () { crates.forEach(function (c) { c.userData.resetEggs(); }); st.cracks = 0; };
    okada.anchors = anchors;
    okada.anchorLocal = function (name, target) {        // anchor position in okada-local space (call after update/pose)
      target = target || new V3(); var a = anchors[name]; if (!a) return null;
      okada.updateMatrixWorld(true); a.getWorldPosition(target); return okada.worldToLocal(target);
    };
    okada.anchorWorld = function (name, target) { target = target || new V3(); var a = anchors[name]; if (!a) return null; okada.updateMatrixWorld(true); return a.getWorldPosition(target); };
    okada.mudAngle = function () { return -rear.rotation.z; };
    okada.reading = function () { return { speed_kmh: st.kmh, bounce: st.bounce, bounce_cm: st.bounce * 100, yF: st.yF, yR: st.yR, lift: st.lift, crates: st.crates, cracks: st.cracks, mud: st.mud, centreStand: st.stand, leak: st.leak, rider: !!st.rider }; };
    okada.viewFor = function (part) {
      var V = { okada: [0, 0.6, 0, 3.2], "rear-shock": [-0.55, 0.55, 0.1, 1.1], carrier: [-0.78, 0.9, 0, 1.4], crate: [-0.78, 1.0, 0, 1.4], eggs: [-0.78, 1.05, 0, 0.9], rearWheel: [RX, R, 0, 1.3], mud: [RX, R, 0, 1.3], shadow: [RX, 0.2, 0.2, 1.5], frontWheel: [FX, R, 0, 1.3], engine: [0.05, 0.35, 0, 1.0], exhaust: [-0.3, 0.3, 0.15, 1.4], tank: [0.17, 0.88, 0, 0.9], seat: [-0.25, 0.85, 0, 1.1], speedometer: [0.4, 1.08, 0, 0.5], headlamp: [0.5, 0.87, 0, 0.7], swingarm: [-0.38, 0.38, 0, 1.0], chain: [-0.35, 0.3, -0.07, 1.0], fork: [0.52, 0.62, 0, 1.2] };
      var v = V[part] || V.okada; return { target: [v[0], v[1], v[2]], dist: v[3] };
    };
    if (QL) {        // low: one vertex-coloured mesh for the sprung body (carrier + speedometer stay separate for spotlights)
      bakeStatic(body, { vertexColor: true, shallow: true, part: "okada", parts: parts, keep: function (o) { return o.userData.partId === "carrier"; } });
      bakeStatic(sw, { vertexColor: true, shallow: true, part: "swingarm", parts: parts });
      crateG.remove(strap2);             // one strap is enough at phone size
    }
    setCrates(st.crates);
    attachCompat(okada, parts, update, setState);
    okada.userData.state = st;
    tagPart(okada, "okada");
    // tagPart above only fills untagged children; the root keeps "okada"
    pose();
    if (opts.rider) seatRider(opts.rider === true ? null : opts.rider);
    if (opts.mud) setMud(true);
    return okada;
  }

  /* ================================================================ road */
  /* laterite strip along x (centred on z = 0) with concrete drainage ridges every d metres */
  function createRoad(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(); g.name = "ridge-road";
    var L = opts.length || 40, W = opts.width || 4.0, d = opts.d || STORY.d, H = opts.ridgeH || 0.045, RW = opts.ridgeW || 0.5;
    var x0 = opts.x0 != null ? opts.x0 : d / 2;          // a ridge crest at x0 + k d
    var parts = {};
    // road surface: camber, two ruts, erosion noise
    var sg = new THREE.PlaneGeometry(L, W, Math.round(L * S(2, 0.8)), S(12, 6)); sg.rotateX(-Math.PI / 2);
    var p = sg.attributes.position, r = rng(17);
    for (var i = 0; i < p.count; i++) {
      var z = p.getZ(i), x = p.getX(i), u = z / (W / 2);
      var y = 0.012 * (1 - u * u) - 0.01 * Math.exp(-Math.pow((Math.abs(z) - W * 0.14) / 0.12, 2)) + 0.004 * Math.sin(x * 1.7 + z * 3) * Math.sin(x * 0.6);
      y -= 0.03 * smooth(0.85, 1.0, Math.abs(u));
      p.setY(i, y + 0.018);
    }
    sg.computeVertexNormals();
    var uvA = sg.attributes.uv; for (i = 0; i < uvA.count; i++) uvA.setX(i, uvA.getX(i) * L / 8);
    var surf = new THREE.Mesh(sg, M.laterite); tagPart(surf, "road"); g.add(surf); parts.road = surf;
    var texs = [M.laterite.map, M.laterite.bumpMap];
    texs.forEach(function (t) { t.repeat.set(1, 1); });
    // verges (grass) and a shallow ditch with a concrete-lined drain on the far side
    var b = new Batch();
    [-1, 1].forEach(function (s) {
      var vg = new THREE.PlaneGeometry(L, 1.6, Math.round(L * S(1, 0.25)), S(4, 1)); vg.rotateX(-Math.PI / 2);
      var vp = vg.attributes.position; for (var k = 0; k < vp.count; k++) vp.setY(k, 0.012 + 0.02 * Math.sin(vp.getX(k) * 0.9 + s) * (vp.getZ(k) + 0.8) / 1.6);
      vg.computeVertexNormals(); vg.translate(0, 0, s * (W / 2 + 0.75));
      var vu = vg.attributes.uv; for (k = 0; k < vu.count; k++) vu.setXY(k, vu.getX(k) * L / 6, vu.getY(k) * 0.4);
      b.add("verge", M.grass, vg);
    });
    var drain = new THREE.Shape(); drain.moveTo(-0.22, 0.02); drain.lineTo(-0.16, -0.14); drain.lineTo(0.16, -0.14); drain.lineTo(0.22, 0.02); drain.lineTo(0.26, 0.02); drain.lineTo(0.2, -0.18); drain.lineTo(-0.2, -0.18); drain.lineTo(-0.26, 0.02); drain.lineTo(-0.22, 0.02);
    var dg = Extrude(drain, { depth: L, bevelEnabled: false }); dg.translate(0, 0.01, -L / 2); dg.rotateY(Math.PI / 2); dg.translate(0, 0, -W / 2 - 0.3);
    b.add("drain", M.concrete, dg);
    b.flush(g, null, parts);
    // concrete drainage ridges: cos^2 hump + toes, extruded across the road; instanced (one draw call)
    var prof = new THREE.Shape();
    prof.moveTo(-RW / 2 - 0.04, 0);
    var NRP = S(20, 10); for (i = 0; i <= NRP; i++) { var uu = -RW / 2 + RW * i / NRP; prof.lineTo(uu, 0.006 + H * Math.pow(Math.cos(Math.PI * uu / RW), 2)); }
    prof.lineTo(RW / 2 + 0.04, 0); prof.lineTo(-RW / 2 - 0.04, 0);
    var rg = Extrude(prof, { depth: W + 0.5, bevelEnabled: !QL, bevelSize: 0.006, bevelThickness: 0.01, bevelSegments: 2 });
    rg.translate(0, 0.012, -(W + 0.5) / 2);
    var rp = rg.attributes.position, ruv = rg.attributes.uv;
    for (i = 0; i < rp.count; i++) ruv.setXY(i, (rp.getZ(i) + W / 2) / W, (rp.getX(i) + RW / 2 + 0.04) / (RW + 0.08));
    var nR = Math.floor(L / d) + 1, list = [];
    for (i = 0; i < nR; i++) { var xx = x0 + (i - Math.floor(nR / 2)) * d; if (Math.abs(xx) <= L / 2 - 0.3) list.push(xx); }
    var ridges = new THREE.InstancedMesh(rg, M.concrete, list.length + 4), mtx = new THREE.Matrix4();
    ridges.userData.xs = list.slice();
    ridges.count = list.length;
    function placeRidges() {
      for (var k = 0; k < ridges.count; k++) { mtx.makeTranslation(ridges.userData.xs[k], 0, 0); ridges.setMatrixAt(k, mtx); }
      ridges.instanceMatrix.needsUpdate = true;
      ridges.computeBoundingSphere && ridges.computeBoundingSphere();
    }
    placeRidges();
    ridges.frustumCulled = false;
    tagPart(ridges, "ridges"); g.add(ridges); parts.ridges = ridges;
    // grass tufts on the verges (instanced, 3 crossed blades each)
    if (opts.tufts !== false) {
      var bl = [], k2;
      for (k2 = 0; k2 < 6; k2++) { var a = k2 / 6 * TAU, ca = Math.cos(a), sa = Math.sin(a), lean = 0.05 + (k2 % 2) * 0.04; bl.push(-sa * 0.008, 0, ca * 0.008, sa * 0.008, 0, -ca * 0.008, ca * lean, 0.12 + (k2 % 3) * 0.04, sa * lean); }
      var bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(bl, 3)); bg.computeVertexNormals();
      var nT = opts.tufts || Math.round(L * S(7, 3)), tufts = new THREE.InstancedMesh(bg, M.blade, nT), rr = rng(23), col = new THREE.Color();
      for (k2 = 0; k2 < nT; k2++) {
        var side = rr() < 0.5 ? -1 : 1, tz = side * (W / 2 + 0.05 + rr() * 1.45), tx = (rr() - 0.5) * L;
        if (side < 0 && Math.abs(tz + W / 2 + 0.3) < 0.3) tz -= 0.6 * side * -1;
        mtx.compose(new V3(tx, 0, tz), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rr() * 3, (rr() - 0.5) * 0.3)), new V3(1, 0.7 + rr() * 0.9, 1));
        tufts.setMatrixAt(k2, mtx); col.setHSL(0.14 + rr() * 0.07, 0.4, 0.34 + rr() * 0.22); tufts.setColorAt(k2, col);
      }
      tagPart(tufts, "verge"); g.add(tufts);
    }
    // optional tape measure from one crest to the next (shows d = 2.5 m)
    if (opts.tape) {
      var tx0 = opts.tapeX != null ? opts.tapeX : list[Math.floor(list.length / 2)], tzz = opts.tapeZ != null ? opts.tapeZ : -W * 0.3;
      var tg = new THREE.PlaneGeometry(d, 0.045, 120, 1); tg.rotateX(-Math.PI / 2); tg.translate(tx0 + d / 2, 0, tzz);
      var tpp = tg.attributes.position;
      for (i = 0; i < tpp.count; i++) tpp.setY(i, 0.018 + 0.012 * (1 - Math.pow(tzz / (W / 2), 2)) + bumpFn(tpp.getX(i)) + 0.012);
      tg.computeVertexNormals();
      var tape = new THREE.Mesh(tg, M.tape); tagPart(tape, "tape"); g.add(tape);
      var tc = new THREE.Mesh(Extrude(roundedRectShape(0.09, 0.09, 0.025), { depth: 0.04, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, bevelSegments: 2 }), M.tapeCase);
      tc.rotation.x = -Math.PI / 2; tc.position.set(tx0 - 0.06, 0.04, tzz + 0.02); tagPart(tc, "tape"); g.add(tc);
      parts.tape = tape;
    }
    function bumpFn(x) {
      var h = 0, xs = ridges.userData.xs;
      for (var k = 0; k < ridges.count; k++) { var uu2 = x - xs[k]; if (Math.abs(uu2) < RW / 2) h = Math.max(h, H * Math.pow(Math.cos(Math.PI * uu2 / RW), 2)); }
      return h;
    }
    g.userData.s = 0;
    var span = Math.max(d, Math.floor(L / d) * d);
    g.scroll = function (s) {                  // treadmill: ridges and texture slide by -s (bike stays put)
      g.userData.s = s;
      var xs = ridges.userData.xs, base = list;
      for (var k = 0; k < xs.length; k++) { var xx2 = base[k] - s; xx2 = ((xx2 + span / 2) % span + span) % span - span / 2; xs[k] = xx2; }
      placeRidges();
      texs.forEach(function (t) { t.offset.x = (s / 8) % 1; });
      M.grass.map.offset.x = (s / 6) % 1;
    };
    g.bumpAt = function (x) { return bumpFn(x); };
    g.ridgeXs = function () { return ridges.userData.xs.slice(); };
    g.reading = function () { return { d: d, ridgeH: H, ridgeW: RW, count: ridges.count, s: g.userData.s }; };
    attachCompat(g, parts, function () {}, function (o) { if (o && o.s != null) g.scroll(o.s); });
    return g;
  }

  /* ================================================================ farm gate + wall */
  function createGate(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch(), gap = opts.gap || 3.2, wallLen = opts.wallLen || 4.4, wallH = opts.wallH || 0.95, i;
    // plastered pillars with caps
    [-1, 1].forEach(function (s) {
      var px = s * (gap / 2 + 0.2);
      var pil = Extrude(roundedRectShape(0.4, 0.4, 0.02), { depth: 1.9, bevelEnabled: false }); pil.rotateX(-Math.PI / 2);
      var pu = pil.attributes.uv, pp = pil.attributes.position; for (var k = 0; k < pu.count; k++) pu.setXY(k, (pp.getX(k) + pp.getZ(k)) * 1.2, pp.getY(k) / 1.9);
      b.add("gate", M.plaster, pil, mT(px, 0, 0));
      b.add("gate", M.plaster, gLathe([[0.0004, 0], [0.3, 0], [0.3, 0.05], [0.25, 0.08], [0.12, 0.2], [0.0004, 0.24]], 4, Math.PI / 4), mT(px, 1.9, 0));
      // low block wall + coping
      var wx = s * (gap / 2 + 0.4 + wallLen / 2);
      var wl = new THREE.BoxGeometry(wallLen, wallH, 0.2, 1, 1, 1); var wu = wl.attributes.uv; for (k = 0; k < wu.count; k++) wu.setX(k, wu.getX(k) * wallLen / 1.6);
      b.add("wall", M.block, wl, mT(wx, wallH / 2, 0));
      b.add("wall", M.plaster, gPlank(wallLen + 0.04, 0.05, 0.26), mT(wx, wallH + 0.025, 0));
      for (k = 1; k < 3; k++) b.add("wall", M.plaster, new THREE.BoxGeometry(0.26, wallH + 0.15, 0.26), mT(s * (gap / 2 + 0.4 + k * wallLen / 3), (wallH + 0.15) / 2, 0));
    });
    // steel double gate, leaves half open (inward), green with rust spots
    function leaf(w) {
      var lb = [];
      lb.push(gTube([[0, 0.08, 0], [0, 1.65, 0], [w * 0.5, 1.78, 0], [w, 1.65, 0], [w, 0.08, 0]], 0.022, 40, 8, false, 0.2));
      lb.push(gRod([0, 0.08, 0], [w, 0.08, 0], 0.022, 8)); lb.push(gRod([0, 0.9, 0], [w, 0.9, 0], 0.018, 8));
      for (var k = 1; k < 9; k++) { var x = w * k / 9, yt = 1.65 + 0.13 * Math.sin(Math.PI * k / 9); lb.push(gRod([x, 0.08, 0], [x, yt, 0], 0.009, 6)); }
      return lb;
    }
    [-1, 1].forEach(function (s) {
      var w = gap / 2 - 0.02, open = opts.open == null ? 0.9 : opts.open;
      var m = new THREE.Matrix4().compose(new V3(s * gap / 2, 0, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, s > 0 ? Math.PI - open : open, 0)), new V3(1, 1, 1));
      leaf(w).forEach(function (lg) { b.add("gate", M.gateGreen, lg, m); });
      b.add("gate", M.darkSteel, gRod([0, 0.3, 0], [0, 1.5, 0], 0.02, 8), mT(s * gap / 2, 0, 0));
    });
    var parts = b.flush(g);
    // signboard on two posts
    var sign = new THREE.Group(), sb = new Batch();
    sb.add("sign", M.timber, gPlank(1.7, 0.08, 0.08), mTR(-0.75, 1.0, 0, 0, 0, Math.PI / 2));
    sb.add("sign", M.timber, gPlank(1.7, 0.08, 0.08), mTR(0.75, 1.0, 0, 0, 0, Math.PI / 2));
    sb.flush(sign);
    var board = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.62, 0.03), [M.timber, M.timber, M.timber, M.timber,
      std(0xffffff, 0.7, 0, { map: texSign(["HAJIA RAMATU FARMS", "POULTRY & FRESH EGGS", "OGBOMOSO · OYO STATE"], "#f4ead0", "#7a1b1b", 512, 192, "#2f6b3e") }), M.timber]);
    board.position.set(0, 1.62, 0.05); sign.add(board);
    tagPart(sign, "farmSign");
    sign.position.set(opts.signX != null ? opts.signX : gap / 2 + 1.5, 0, 0.45); sign.rotation.y = -0.15; g.add(sign);
    parts.farmSign = sign;
    tagPart(g, "gate");
    if (QL) bakeStatic(g, { parts: parts, part: "gate" });
    attachCompat(g, parts, function () {}, null);
    return g;
  }

  /* ================================================================ chicken (vertex-coloured, merged) */
  var CHICK = null;
  function chickenGeo() {
    if (CHICK) return CHICK;
    function coloured(geo, hex) { var c = new THREE.Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3); for (var i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } geo.setAttribute("color", new THREE.BufferAttribute(a, 3)); return geo; }
    var body = new THREE.SphereGeometry(1, 10, 7), p = body.attributes.position;
    for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setXYZ(i, x * 0.13 * (x < 0 ? 1.15 : 0.9), y * 0.1 + (x < -0.5 ? (x + 0.5) * -0.08 : 0) + 0.2, z * 0.085); }
    body.computeVertexNormals();
    var head = new THREE.SphereGeometry(0.045, 7, 5); head.translate(0.12, 0.33, 0);
    var comb = new THREE.SphereGeometry(0.025, 5, 4); comb.scale(1.2, 1, 0.4); comb.translate(0.12, 0.38, 0);
    var beak = new THREE.ConeGeometry(0.014, 0.035, 6); beak.rotateZ(-Math.PI / 2); beak.translate(0.175, 0.33, 0);
    var tail = new THREE.SphereGeometry(0.06, 6, 4); tail.scale(0.8, 1.4, 0.35); tail.translate(-0.13, 0.3, 0);
    var legs = mergeGeos([gRod([0.0, 0.12, 0.03], [0.01, 0, 0.03], 0.007, 5), gRod([0.0, 0.12, -0.03], [0.01, 0, -0.03], 0.007, 5)]);
    CHICK = mergeGeos([coloured(body, 0xf0ece2), coloured(head, 0xf0ece2), coloured(comb, 0xc81e1e), coloured(beak, 0xe8a020), coloured(tail, 0xe4dccb), coloured(legs, 0xd99a2a)]);
    return CHICK;
  }
  function createChickens(n, area, seed) {
    var M = mats(), mesh = new THREE.InstancedMesh(chickenGeo(), M.chicken, n), r = rng(seed || 5), list = [];
    for (var i = 0; i < n; i++) list.push({ x: area[0] + r() * (area[2] - area[0]), z: area[1] + r() * (area[3] - area[1]), a: r() * TAU, ph: r() * 10, col: r() < 0.3 ? 0x9a5a2a : 0xffffff });
    var mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
    list.forEach(function (c, k) { col.set(c.col); mesh.setColorAt(k, col); });
    mesh.update = function (dt, t) {
      list.forEach(function (c, k) {
        var peck = Math.max(0, Math.sin(t * 3 + c.ph)) > 0.92 ? 0.5 : 0;
        e.set(0, c.a + Math.sin(t * 0.3 + c.ph) * 0.6, -peck); q.setFromEuler(e);
        mtx.compose(new V3(c.x, 0, c.z), q, new V3(1, 1, 1)); mesh.setMatrixAt(k, mtx);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    mesh.update(0, 0);
    tagPart(mesh, "chickens");
    return mesh;
  }

  /* ================================================================ poultry pen */
  function corrugated(w, d, amp, pitch) {
    var g = new THREE.PlaneGeometry(w, d, Math.round(w / pitch * 6), 2), p = g.attributes.position;
    for (var i = 0; i < p.count; i++) p.setZ(i, amp * Math.sin(p.getX(i) / pitch * TAU));
    g.computeVertexNormals(); g.rotateX(-Math.PI / 2);
    return g;
  }
  function createPoultryPen(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch(), W = opts.w || 3.0, D = opts.d || 2.0;
    // low block wall + timber posts + chicken wire + sloped zinc roof
    [[0, -D / 2, W, 0], [0, D / 2, W, 0], [-W / 2, 0, D, Math.PI / 2], [W / 2, 0, D, Math.PI / 2]].forEach(function (s) {
      var wl = new THREE.BoxGeometry(s[2], 0.5, 0.15); var wu = wl.attributes.uv; for (var k = 0; k < wu.count; k++) wu.setXY(k, wu.getX(k) * s[2] / 1.6, wu.getY(k) * 0.5);
      b.add("pen", M.block, wl, mTR(s[0], 0.25, s[1], 0, s[3], 0));
      var mw = new THREE.PlaneGeometry(s[2], 1.2); b.add("pen", M.wire, mw, mTR(s[0], 1.1, s[1], 0, s[3], 0));
    });
    [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, -1], [0, 1]].forEach(function (c) { b.add("pen", M.timber, gPlank(c[1] < 0 ? 2.05 : 1.75, 0.08, 0.08), mTR(c[0] * W / 2, (c[1] < 0 ? 2.05 : 1.75) / 2, c[1] * D / 2, 0, 0, Math.PI / 2)); });
    var roof = corrugated(W + 0.5, D + 0.6, 0.015, 0.076);
    var tilt = Math.atan2(0.3, D);
    b.add("pen", M.zinc, roof, mTR(0, 1.92, 0, tilt, 0, 0));
    // feeder trough + water drum
    b.add("pen", M.timber, gPlank(1.2, 0.08, 0.16), mT(-0.4, 0.06, 0.2));
    b.add("pen", M.drum, gLathe([[0.0004, 0], [0.2, 0], [0.21, 0.02], [0.21, 0.2], [0.215, 0.21], [0.21, 0.22], [0.21, 0.45], [0.2, 0.48], [0.0004, 0.48]], 20), mT(1.0, 0, -0.5));
    var parts = b.flush(g);
    var hens = createChickens(opts.hens || S(7, 4), [-W / 2 + 0.3, -D / 2 + 0.3, W / 2 - 0.3, D / 2 - 0.3], 9);
    g.add(hens); parts.chickens = hens;
    tagPart(g, "pen");
    if (QL) bakeStatic(g, { parts: parts, part: "pen" });
    attachCompat(g, parts, function (dt, t) { hens.update(dt, t); }, null);
    return g;
  }

  /* ================================================================ Mallam Sule's roadside shed */
  function createShed(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch(), W = 3.2, D = 2.3, i;
    // compacted dirt floor with oil stains
    var fl = new THREE.Mesh(new THREE.CircleGeometry(2.3, 32), M.dirt); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.014; fl.scale.set(1, 0.8, 1); g.add(fl);
    // four timber posts, rafters, corrugated zinc roof (higher at the front)
    [[-W / 2, D / 2, 2.45], [W / 2, D / 2, 2.45], [-W / 2, -D / 2, 2.15], [W / 2, -D / 2, 2.15]].forEach(function (c) { b.add("shed", M.timber, gPlank(c[2], 0.1, 0.1), mTR(c[0], c[2] / 2, c[1], 0, 0, Math.PI / 2)); });
    [-W / 2, 0, W / 2].forEach(function (x) { b.add("shed", M.timber, gPlank(D + 0.5, 0.08, 0.06), mTR(x, 2.32, 0, -Math.atan2(0.3, D), Math.PI / 2, 0)); });
    b.add("shed", M.timber, gPlank(W + 0.3, 0.1, 0.08), mT(0, 2.4, D / 2));
    b.add("shed", M.zinc, corrugated(W + 0.6, D + 0.7, 0.016, 0.076), mTR(0, 2.37, 0, -Math.atan2(0.3, D), 0, 0));
    // back wall of planks
    var bw = new THREE.PlaneGeometry(W, 2.1); b.add("shed", M.planks, bw, mT(0, 1.05, -D / 2 - 0.05));
    var bw2 = new THREE.PlaneGeometry(W, 2.1); bw2.rotateY(Math.PI); b.add("shed", M.planks, bw2, mT(0, 1.05, -D / 2 - 0.07));
    // workbench: grain top on legs, vice
    b.add("bench", M.timber, gPlank(2.2, 0.06, 0.6), mT(-0.3, 0.86, -D / 2 + 0.38));
    [[-1.35, -0.77], [0.75, -0.77], [-1.35, -0.27], [0.75, -0.27]].forEach(function (c) { b.add("bench", M.timber, gPlank(0.83, 0.07, 0.07), mTR(c[0], 0.415, c[1] - D / 2 + 0.9, 0, 0, Math.PI / 2)); });
    b.add("bench", M.timber, gPlank(2.1, 0.04, 0.5), mT(-0.3, 0.2, -D / 2 + 0.38));
    var vice = Extrude(splineShape([[0, 0], [0.16, 0], [0.16, 0.08], [0.1, 0.13], [0.0, 0.13]]), { depth: 0.12, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
    b.add("bench", M.bluePaint, vice, mT(0.5, 0.89, -D / 2 + 0.55));
    b.add("bench", M.chrome, gRod([0.66, 0.97, -D / 2 + 0.61], [0.82, 0.97, -D / 2 + 0.61], 0.008, 8));
    // tools on the back wall: combination spanners (extruded, with ring holes), screwdrivers, hacksaw
    for (i = 0; i < 5; i++) {
      var sl = 0.16 + i * 0.03, sp = new THREE.Shape();
      sp.moveTo(-0.012, -sl / 2 + 0.02); sp.lineTo(0.012, -sl / 2 + 0.02); sp.lineTo(0.012, sl / 2 - 0.02); sp.lineTo(-0.012, sl / 2 - 0.02); sp.lineTo(-0.012, -sl / 2 + 0.02);
      var rgS = new THREE.Shape(); rgS.absarc(0, sl / 2 - 0.01, 0.024, 0, TAU, false); rgS.holes.push(circlePath(0, sl / 2 - 0.01, 0.013));
      var opS = new THREE.Shape(); opS.absarc(0, -sl / 2 + 0.015, 0.022, 0, TAU, false); opS.holes.push(roundedRectPath(0.016, 0.02, 0.003, 0, -sl / 2 + 0.01));
      [sp, rgS, opS].forEach(function (shp) { var eg = Extrude(shp, { depth: 0.006, bevelEnabled: false, curveSegments: 7 }); b.add("tools", M.chrome, eg, mT(-1.3 + i * 0.12, 1.45, -D / 2 - 0.02)); });
    }
    for (i = 0; i < 3; i++) {
      b.add("tools", [M.springRed, M.drum, M.amber][i], gLathe([[0.0004, 0], [0.014, 0.004], [0.016, 0.02], [0.016, 0.08], [0.012, 0.095], [0.0004, 0.1]], 10), mT(-0.55 + i * 0.07, 1.42, -D / 2 - 0.02));
      b.add("tools", M.chrome, gRod([-0.55 + i * 0.07, 1.42, -D / 2 - 0.02], [-0.55 + i * 0.07, 1.27, -D / 2 - 0.02], 0.004, 6));
    }
    b.add("tools", M.bluePaint, gTube([[0.0, 1.62, -D / 2 - 0.02], [0.05, 1.7, -D / 2 - 0.02], [0.4, 1.7, -D / 2 - 0.02], [0.45, 1.62, -D / 2 - 0.02]], 0.01, 20, 6));
    b.add("tools", M.chrome, gRod([0.0, 1.6, -D / 2 - 0.02], [0.45, 1.6, -D / 2 - 0.02], 0.012, 4));
    // oil drum (lathe with rolling hoops), engine-oil tins, a spare tyre leaning on a post
    b.add("shed", M.drum, gLathe([[0.0004, 0], [0.28, 0], [0.29, 0.02], [0.29, 0.28], [0.3, 0.29], [0.29, 0.3], [0.29, 0.58], [0.3, 0.59], [0.29, 0.6], [0.29, 0.86], [0.28, 0.88], [0.0004, 0.88]], 24), mT(W / 2 - 0.45, 0, -D / 2 + 0.45));
    for (i = 0; i < 3; i++) b.add("shed", M.amber, gLathe([[0.0004, 0], [0.06, 0], [0.06, 0.16], [0.045, 0.18], [0.015, 0.2], [0.015, 0.22], [0.0004, 0.22]], 12), mT(-1.1 + i * 0.15, 0.89, -D / 2 + 0.25));
    var tyreProf = []; for (i = 0; i <= 12; i++) { var a = -Math.PI / 2 + Math.PI * i / 12; tyreProf.push([0.27 + Math.cos(a) * 0.04, Math.sin(a) * 0.045]); }
    b.add("shed", M.tyre, gLathe(tyreProf, 32), mTR(-W / 2 + 0.12, 0.32, D / 2 - 0.35, Math.PI / 2 - 0.25, 0, Math.PI / 2));
    var parts = b.flush(g);
    // oil stains on the floor
    [[0.3, 0.2, 0.9], [-0.8, -0.3, 0.7], [1.0, -0.5, 0.6]].forEach(function (s) { var st = new THREE.Mesh(new THREE.PlaneGeometry(s[2], s[2] * 0.7), M.oilStain); st.rotation.x = -Math.PI / 2; st.position.set(s[0], 0.018, s[1]); g.add(st); });
    // the two shock absorbers on the bench: old one weeping oil, new one clean
    var oldS = createShock({ leak: true, part: "shock" }), newS = createShock({ leak: false, part: "newShock", springMat: std(0x2a2d33, 0.4, 0.5) });
    oldS.rotation.z = -Math.PI / 2; oldS.position.set(-0.9, 0.93, -D / 2 + 0.55);
    newS.rotation.z = -Math.PI / 2; newS.position.set(-0.9, 0.93, -D / 2 + 0.38);
    g.add(oldS); g.add(newS);
    var streak = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.16), M.oilStain); streak.rotation.x = -Math.PI / 2; streak.position.set(-0.75, 0.892, -D / 2 + 0.56); g.add(streak);
    parts.shock = oldS; parts.newShock = newS;
    // painted signboard on the roof front
    var sb = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.5), std(0xffffff, 0.7, 0, { map: texSign(["MALLAM SULE", "MOTOR & OKADA MECHANIC"], "#1f3550", "#f2c230", 512, 128, "#f2c230"), side: THREE.DoubleSide }));
    sb.position.set(0, 2.72, D / 2 + 0.07); tagPart(sb, "shedSign"); g.add(sb); parts.shedSign = sb;
    // pushing test: the new damper resists (slow), the old one slides freely (fast)
    var push = { on: false, t: 0 };
    function update(dt, t) {
      if (!push.on) return;
      push.t += dt;
      var cyc = (push.t % 1.6) / 1.6, pressed = cyc < 0.5;
      var newL = 0.335 - 0.07 * (pressed ? smooth(0, 0.5, cyc) : 1 - smooth(0.5, 1.0, cyc));
      var oldL = 0.335 - 0.07 * (pressed ? smooth(0, 0.08, cyc) : 1 - smooth(0.5, 0.56, cyc));
      newS.setLength(newL); oldS.setLength(oldL);
    }
    g.pushDampers = function (on) { push.on = !!on; push.t = 0; if (!on) { newS.setLength(0.335); oldS.setLength(0.335); } };
    tagPart(g, "shed");
    if (QL) bakeStatic(g, { parts: parts, part: "shed", keep: function (o) { return o === oldS || o === newS; } });
    attachCompat(g, parts, update, function (o) { if (o && o.push != null) g.pushDampers(o.push); });
    return g;
  }

  /* ================================================================ trees, pole, hills */
  function createTree(seed, scale) {
    var M = mats(), g = new THREE.Group(), r = rng(seed || 1), b = new Batch();
    b.add("tree", M.bark, gTube([[0, 0, 0], [0.05, 0.9, 0.02], [-0.04, 1.8, 0.0], [0.1, 2.4, 0.05]], 0.14, 16, 8));
    b.add("tree", M.bark, gTube([[0.0, 1.6, 0], [0.5, 2.2, 0.2], [0.8, 2.6, 0.3]], 0.07, 10, 6));
    b.add("tree", M.bark, gTube([[0.0, 1.8, 0], [-0.5, 2.4, -0.2], [-0.7, 2.8, -0.1]], 0.06, 10, 6));
    for (var i = 0; i < S(7, 5); i++) {
      var ic = new THREE.IcosahedronGeometry(0.75 + r() * 0.35, S(1, 0)), ip = ic.attributes.position;
      for (var k = 0; k < ip.count; k++) { var s = 0.85 + r() * 0.3; ip.setXYZ(k, ip.getX(k) * s, ip.getY(k) * s * 0.75, ip.getZ(k) * s); }
      ic.computeVertexNormals();
      b.add("tree", i % 2 ? M.leaf : M.leafDark, ic, mT((r() - 0.5) * 1.8, 2.7 + r() * 0.9, (r() - 0.5) * 1.4));
    }
    b.flush(g);
    g.scale.setScalar(scale || 1);
    return g;
  }
  function createPole(len) {
    var M = mats(), g = new THREE.Group(), b = new Batch();
    b.add("pole", M.pole, gLathe([[0.11, 0], [0.09, 7.5], [0.0004, 7.52]], 10));
    b.add("pole", M.timber, gPlank(1.2, 0.08, 0.1), mT(0, 7.0, 0));
    [-0.5, 0, 0.5].forEach(function (z) { b.add("pole", M.lcd, gLathe([[0.0004, 0], [0.04, 0.0], [0.05, 0.06], [0.03, 0.1], [0.0004, 0.12]], 8), mT(z, 7.06, 0)); });
    b.flush(g); g.rotation.y = Math.PI / 2;
    return g;
  }
  function createHills() {
    var M = mats(), g = new THREE.Group(), r = rng(301);
    [[-30, 60, 7, M.hillFar], [-24, 50, 4.5, M.hill]].forEach(function (h) {
      var geo = new THREE.PlaneGeometry(140, 16, 40, 4), p = geo.attributes.position;
      for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i); p.setY(i, y < 7.9 ? 0 : h[2] * (0.5 + 0.5 * Math.sin(x * 0.07 + h[0]) * Math.sin(x * 0.031 + 1)) + r() * 0.4); }
      // rebuild as a ridge strip: top row raised, bottom row on the ground
      for (i = 0; i < p.count; i++) if (p.getY(i) === 0) p.setY(i, -0.2);
      geo.computeVertexNormals();
      var m = new THREE.Mesh(geo, h[3]); m.position.set(0, 0, h[0]); g.add(m);
    });
    tagPart(g, "hills");
    return g;
  }

  /* ================================================================ lab: stands, pendulum, spring, Barton */
  function retortStand(b, part, x, z, h) {
    var M = mats();
    var base = Extrude(roundedRectShape(0.34, 0.2, 0.025), { depth: 0.022, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2 }); base.rotateX(-Math.PI / 2);
    b.add(part, M.bluePaint, base, mT(x + 0.06, 0, z));
    b.add(part, M.steel, gRod([x - 0.08, 0.02, z], [x - 0.08, h, z], 0.0075, 14));
    b.add(part, M.darkSteel, gLathe([[0.016, 0], [0.02, 0.01], [0.016, 0.035], [0.008, 0.04]], 14), mT(x - 0.08, 0.02, z));
  }
  function bossClamp(b, part, x, y, z, armLen) {
    var M = mats();
    b.add(part, M.darkSteel, Extrude(roundedRectShape(0.045, 0.045, 0.008), { depth: 0.04, bevelEnabled: false }), mT(x - 0.08, y, z - 0.02));
    b.add(part, M.brass, gRod([x - 0.08, y, z + 0.02], [x - 0.08, y, z + 0.055], 0.006, 8));
    b.add(part, M.steel, gRod([x - 0.06, y, z], [x - 0.06 + armLen, y, z], 0.006, 10));
  }
  function createPendulumStand(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch(), l = opts.l || 0.80, H = l + 0.24;
    retortStand(b, "stand", 0, 0, H + 0.05);
    bossClamp(b, "clamp", 0, H, 0, 0.16);
    // split cork: two extruded half-discs gripping the thread
    [-1, 1].forEach(function (s) {
      var hs = new THREE.Shape(); hs.absarc(0, 0, 0.012, -Math.PI / 2, Math.PI / 2, false); hs.lineTo(0, -0.012);
      var cg = Extrude(hs, { depth: 0.03, bevelEnabled: false, curveSegments: 10 }); cg.translate(0, 0, -0.015);
      b.add("cork", M.cork, cg, mTR(0.1, H - 0.004, s * 0.0012, Math.PI / 2, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0));
    });
    var parts = b.flush(g);
    var swing = new THREE.Group(); swing.position.set(0.1, H - 0.02, 0); g.add(swing);
    var th = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, l - 0.02, 4), M.thread); th.position.y = -(l - 0.02) / 2; tagPart(th, "thread"); swing.add(th);
    var bob = new THREE.Mesh(gLathe([[0.0004, -0.02], [0.012, -0.0175], [0.019, -0.008], [0.02, 0], [0.019, 0.008], [0.012, 0.0175], [0.003, 0.02], [0.003, 0.026], [0.0004, 0.026]], 20), M.brass);
    bob.position.y = -l; tagPart(bob, "bob"); swing.add(bob);
    parts.thread = th; parts.bob = bob;
    var stt = { on: false, A: opts.angle || 0.17, t: 0 }, T = model.pendulumT(l);
    attachCompat(g, parts, function (dt) { if (!stt.on) return; stt.t += dt; swing.rotation.x = stt.A * Math.cos(TAU * stt.t / T); }, null);
    if (QL) bakeStatic(g, { vertexColor: true, shallow: true, part: "pendulum" });
    g.swing = function (on) { stt.on = !!on; stt.t = 0; if (!on) swing.rotation.x = 0; };
    g.reading = function () { return { l: l, T: T, t20: 20 * T }; };
    tagPart(g, "pendulum");
    return g;
  }
  function createSpringStand(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch(), k = opts.k || 24.5, H = 0.95, L0 = 0.16, i;
    retortStand(b, "stand", 0, 0, H + 0.05);
    bossClamp(b, "clamp", 0, H, 0, 0.14);
    // vertical metre-rule section on its own foot, beside the spring
    b.add("ruler", M.rule, (function () { var rg = new THREE.BoxGeometry(0.028, 0.6, 0.004); return rg; })(), mT(0.15, H - 0.38, 0.03));
    b.add("ruler", M.bluePaint, Extrude(roundedRectShape(0.08, 0.06, 0.01), { depth: 0.015, bevelEnabled: false }).rotateX(-Math.PI / 2), mT(0.15, 0, 0.03));
    b.add("ruler", M.steel, gRod([0.15, 0.01, 0.025], [0.15, H - 0.68, 0.025], 0.004, 6));
    var parts = b.flush(g);
    var hang = new THREE.Group(); hang.position.set(0.06, H - 0.01, 0); g.add(hang);
    var spr = new THREE.Mesh(gTube(helixPts(0.012, L0, 18, 260, true), 0.0012, 300, 5, false, 0.2), M.steel); spr.rotation.x = Math.PI; tagPart(spr, "spring"); hang.add(spr);
    var hanger = new THREE.Group(); hang.add(hanger);
    var hb = new Batch();
    hb.add("hanger", M.steel, gRod([0, 0, 0], [0, -0.1, 0], 0.0025, 6));
    hb.add("hanger", M.steel, new THREE.CylinderGeometry(0.022, 0.022, 0.006, 20), mT(0, -0.1, 0));
    // slotted 50 g masses: extruded discs with a real slot
    var sR = 0.022, sw2 = 0.004, aG = Math.asin(sw2 / sR), ds = new THREE.Shape();
    ds.moveTo(sw2, Math.sqrt(sR * sR - sw2 * sw2));
    ds.absarc(0, 0, sR, Math.PI / 2 - aG, -1.5 * Math.PI + aG, true);       // the rim, leaving the slot mouth open
    ds.lineTo(-sw2, 0); ds.absarc(0, 0, sw2, Math.PI, TAU, false); ds.lineTo(sw2, Math.sqrt(sR * sR - sw2 * sw2));
    var dg = Extrude(ds, { depth: 0.007, bevelEnabled: true, bevelSize: 0.0008, bevelThickness: 0.0008, bevelSegments: 1, curveSegments: 18 }); dg.rotateX(Math.PI / 2);
    var discs = [];
    hb.flush(hanger, null, parts);
    for (i = 0; i < 4; i++) { var dm = new THREE.Mesh(dg, M.brass); dm.position.y = -0.09 + i * 0.0085; dm.rotation.y = i * 0.6; tagPart(dm, "slotted-mass"); hanger.add(dm); discs.push(dm); }
    var ptr = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.09, 6).rotateZ(-Math.PI / 2), M.pointer); ptr.position.set(0.05, -0.02, 0.02); tagPart(ptr, "pointer"); hanger.add(ptr);
    parts.spring = spr; parts.hanger = hanger; parts.pointer = ptr; parts["slotted-mass"] = discs[0];
    var stt = { n: 1, on: false, t: 0, A: 0.02 };
    function layout(extra) {
      var m = stt.n * 0.05, x0 = m * G / k, len = L0 + x0 + (extra || 0);
      spr.scale.y = len / L0; hanger.position.y = -len;
      discs.forEach(function (d, j) { d.visible = j < stt.n - 1; });
    }
    layout(0);
    if (QL) bakeStatic(g, { vertexColor: true, shallow: true, part: "springStand" });
    attachCompat(g, parts, function (dt) { if (!stt.on) return; stt.t += dt; var T = model.springT(stt.n * 0.05, k); layout(stt.A * Math.cos(TAU * stt.t / T) * Math.exp(-0.08 * stt.t)); }, null);
    g.setLoad = function (n) { stt.n = clamp(Math.round(n), 1, 5); layout(0); };
    g.bounce = function (on, A) { stt.on = !!on; stt.t = 0; stt.A = A || 0.02; if (!on) layout(0); };
    g.reading = function () { var m = stt.n * 0.05; return { m: m, k: k, x_cm: m * G / k * 100, T: model.springT(m, k) }; };
    tagPart(g, "springStand");
    return g;
  }
  function createBarton(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(), b = new Batch(), lengths = opts.cones || [0.30, 0.45, 0.60, 0.75, 0.90], i;
    var Y = 1.85, X0 = -0.95, X1 = 0.95;
    // two wooden uprights on cross feet; taut cord between their tops
    [X0, X1].forEach(function (x) {
      b.add("frame", M.benchWood, gPlank(Y + 0.05, 0.05, 0.05), mTR(x, (Y + 0.05) / 2, 0, 0, 0, Math.PI / 2));
      b.add("frame", M.benchWood, gPlank(0.6, 0.05, 0.07), mTR(x, 0.025, 0, 0, Math.PI / 2, 0));
      b.add("frame", M.benchWood, gPlank(0.25, 0.04, 0.05), mTR(x + (x < 0 ? 0.08 : -0.08), 0.12, 0, 0, 0, x < 0 ? -0.8 : 0.8));
      b.add("frame", M.brass, gLathe([[0.0004, 0], [0.014, 0.002], [0.016, 0.02], [0.0004, 0.025]], 10), mT(x, Y - 0.01, 0.03).multiply(mTR(0, 0, 0, Math.PI / 2, 0, 0)));
    });
    var parts = b.flush(g);
    var cord = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, X1 - X0, 5).rotateZ(Math.PI / 2), M.thread); cord.position.set(0, Y, 0); tagPart(cord, "cord"); g.add(cord); parts.cord = cord;
    var dL = opts.driverL || 0.60;
    var pend = [];
    function hang(x, L, kind, key) {
      var p = new THREE.Group(); p.position.set(x, Y, 0); g.add(p);
      var th = new THREE.Mesh(new THREE.CylinderGeometry(0.0008, 0.0008, 1, 4), M.thread); p.add(th);
      var bobM;
      if (kind === "driver") bobM = new THREE.Mesh(gLathe([[0.0004, -0.045], [0.03, -0.04], [0.045, -0.015], [0.047, 0], [0.045, 0.015], [0.03, 0.04], [0.006, 0.045], [0.006, 0.055], [0.0004, 0.055]], 22), M.brass);
      else bobM = new THREE.Mesh(gLathe([[0.0004, -0.05], [0.004, -0.048], [0.04, 0.0], [0.042, 0.004], [0.0004, 0.004]], 18), M.paper);
      p.add(bobM); tagPart(p, key); parts[key] = p;
      var e = { g: p, th: th, bob: bobM, L: L, key: key };
      e.setL = function (L2) { e.L = L2; th.scale.y = L2; th.position.y = -L2 / 2; bobM.position.y = -L2; };
      e.setL(L); pend.push(e); return e;
    }
    var driver = hang(X0 + 0.22, dL, "driver", "driver");
    var cones = lengths.map(function (L, k) { return hang(X0 + 0.55 + k * 0.29, L, "cone", "cone-" + (k + 1)); });
    var ruler = new THREE.Mesh(new THREE.BoxGeometry(0.028, 1.0, 0.004), M.rule); ruler.position.set(X1 - 0.08, Y - 0.52, 0.03); tagPart(ruler, "ruler"); g.add(ruler); parts.ruler = ruler;
    if (QL) bakeStatic(g, { vertexColor: true, shallow: true, part: "barton", keep: function (o) { return o === cord; } });
    var stt = { on: !!opts.running, t: 0, A: 0.22, rd: null };
    function recompute() { stt.rd = model.barton(driver.L, cones.map(function (c) { return c.L; }), opts.zeta); }
    recompute();
    function update(dt) {
      if (!stt.on) return;
      stt.t += dt;
      var wd = TAU / stt.rd.T, build = 1 - Math.exp(-stt.t / 6);
      driver.g.rotation.x = stt.A * Math.sin(wd * stt.t);
      cones.forEach(function (c, k) { c.g.rotation.x = 0.32 * build * stt.rd.amps[k] * Math.sin(wd * stt.t - stt.rd.phases[k]); });
      cord.position.z = 0.004 * Math.sin(wd * stt.t);
    }
    g.start = function () { stt.on = true; stt.t = 0; };
    g.stop = function () { stt.on = false; pend.forEach(function (p) { p.g.rotation.x = 0; }); };
    g.setDriverLength = function (L) { driver.setL(clamp(L, 0.3, 0.9)); recompute(); stt.t = 0; };
    g.reading = function () { return stt.rd; };
    attachCompat(g, parts, update, function (o) { if (o && o.driverL != null) g.setDriverLength(o.driverL); if (o && o.running != null) (o.running ? g.start() : g.stop()); });
    tagPart(g, "barton");
    return g;
  }

  /* ================================================================ StoryStage dressing */
  function hide(o) { if (o) o.visible = false; }
  function collectPeople(api) { var s = []; Object.keys(api.people || {}).forEach(function (k) { s.push(api.people[k]); }); return s; }
  /* the ridge ride and parked-bounce state machine used by dressRoad */
  function makeRider(okada, road, opts) {
    var st = { mode: "park", mass: opts.mass || 200, damper: opts.damper || "leaking", kmh: 0, x: okada.position.x, from: -11, to: 11, Acur: 0, s: 0,
      press: { A: 0, t: 0 }, crate: { y: 0, v: 0, on: true, lastCrack: -9 }, t: 0, cracks: 0, home: okada.position.clone(), homeZ: okada.position.z, lane: opts.lane, treadmill: !!opts.treadmill };
    var tmp = new V3();
    function carrierY() { tmp.copy(okada.anchors.carrierTop.position).applyMatrix4(okada.parts.body.matrix); return tmp.y; }
    function step(dt) {
      st.t += dt;
      if (st.mode === "ride") {
        var mod = model.ridge(st.kmh, st.mass, st.damper), v = mod.v;
        st.x += v * dt;
        if (st.treadmill) { if (road) road.scroll(st.x); }
        else { if (st.x > st.to) st.x = st.from + (st.x - st.to); okada.position.x = st.x; }
        var tau = 1 / Math.max(0.05, mod.zeta * mod.w0);
        st.Acur += (mod.A - st.Acur) * Math.min(1, dt / tau);
        var ph = TAU * st.x / STORY.d - mod.phase, wd = TAU * mod.f;
        var y = st.Acur * Math.sin(ph), vy = st.Acur * wd * Math.cos(ph), ay = -st.Acur * wd * wd * Math.sin(ph);
        var yR = road ? road.bumpAt(okada.position.x + OK.RX - road.position.x) : 0, yF = road ? road.bumpAt(okada.position.x + OK.FX - road.position.x) : 0;
        okada.setWheelBump(yF, yR); okada.setBounce(y); okada.setSpeed(st.kmh);
        // the crate is a free body: the carrier can push it up but never pull it down
        var top = carrierY(), c = st.crate, sub = 4, h = dt / sub;
        for (var i = 0; i < sub; i++) {
          if (c.on) { c.y = top; c.v = vy; if (ay < -G) c.on = false; }
          else {
            c.v -= G * h; c.y += c.v * h;
            if (c.y <= top) { var rel = vy - c.v; c.y = top; c.on = true; if (rel > 0.12 && st.t - c.lastCrack > 0.6) { c.lastCrack = st.t; st.cracks++; okada.crack(3); } }
          }
        }
        okada.liftCrate(Math.max(0, c.y - top));
        st.last = { A: st.Acur, target: mod.A, th: mod.th, lift: mod.lift, f: mod.f, f0: mod.f0 };
      } else {
        // parked: press-and-release, free decay at f0 with the damper's zeta
        var pm = model.parked(st.mass), z = zetaOf(st.damper), w = pm.w0, wdp = w * Math.sqrt(1 - z * z);
        st.press.t += dt;
        var yp = st.press.A * Math.exp(-z * w * st.press.t) * Math.cos(wdp * st.press.t);
        okada.setSpeed(0); okada.setWheelBump(0, 0); okada.setBounce(yp); okada.liftCrate(0);
      }
    }
    return {
      st: st, step: step,
      ride: function (kmh, o) { o = o || {}; st.mode = "ride"; st.kmh = kmh; if (o.mass) st.mass = o.mass; if (o.damper) st.damper = o.damper; if (o.from != null) st.from = o.from; if (o.to != null) st.to = o.to; if (o.restart !== false) { st.x = st.treadmill ? 0 : st.from; st.Acur = 0; } if (st.lane != null) okada.position.z = st.lane; okada.setCentreStand(false); },
      park: function (x, z) { st.mode = "park"; st.kmh = 0; st.Acur = 0; if (!st.treadmill) { okada.position.x = x != null ? x : st.home.x; okada.position.z = z != null ? z : st.homeZ; } st.press.A = 0; okada.liftCrate(0); },
      press: function (depth) { st.press.A = -(depth == null ? 0.04 : depth); st.press.t = 0; },
      set: function (o) { if (o.mass) st.mass = o.mass; if (o.damper) st.damper = o.damper; if (o.kmh != null) st.kmh = o.kmh; },
      reading: function () { var m = model.ridge(st.kmh || 0.0001, st.mass, st.damper), p = model.parked(st.mass); return { mode: st.mode, kmh: st.kmh, mass: st.mass, damper: st.damper, A_cm: (st.mode === "ride" ? st.Acur : 0) * 100, A_target_cm: st.mode === "ride" ? m.A_cm : 0, th_cm: st.mode === "ride" ? m.th_cm : p.sag_cm, lift: st.mode === "ride" && m.lift, f0: p.f0, T0: p.T0, t20: p.t20, cracks: st.cracks }; }
    };
  }

  function finish(api, out, keys) {
    keys.forEach(function (k) { if (out[k]) api.props[k] = out[k]; });
    return out;
  }

  /* Set 1: Ridge Road outside Hajia Ramatu's farm (market group, world origin) */
  function dressRoad(api, o) {
    o = o || {};
    var Mk = api.props.market, P = api.props, out = {}, people = collectPeople(api);
    // hide the stock market (stalls, produce, jars, bottles, buildings) but keep people + sign
    out.hidden = [];
    if (!o.keepMarketProps) Mk.children.forEach(function (c) { if (people.indexOf(c) < 0 && c !== P.mSign && c.visible) { c.visible = false; out.hidden.push(c); } });
    if (api.world && o.hideStockRoad !== false) api.world.children.forEach(function (c) { var pr = c.geometry && c.geometry.parameters; if (c.isMesh && pr && pr.width === 140 && pr.height === 3) { c.visible = false; out.hidden.push(c); } });
    if (P.mSign && o.sign !== false && api.sign) {
      var s = api.sign(o.signText || "RIDGE ROAD · OGBOMOSO", "rgba(156,74,34,0.95)", "#fff", 0.5); s.position.copy(P.mSign.position); Mk.remove(P.mSign); Mk.add(s); P.mSign = s; out.sign = s;
    }
    var set = new THREE.Group(); set.name = "ridge-road-set"; Mk.add(set); out.set = set;
    // savanna ground under the set
    var gg = new THREE.PlaneGeometry(64, 26, 1, 1); gg.rotateX(-Math.PI / 2); var gu = gg.attributes.uv; for (var i = 0; i < gu.count; i++) gu.setXY(i, gu.getX(i) * 1.0, gu.getY(i) * 0.6);
    var ground = new THREE.Mesh(gg, mats().grass); ground.position.set(0, 0.004, -5); set.add(ground); out.ground = ground;
    // road with ridges every 2.5 m (one crest each side of the parked okada)
    var ROADZ = o.roadZ != null ? o.roadZ : 2.4;
    out.road = createRoad({ length: 50, width: 4.0, x0: 1.25, tape: o.tape, tapeX: o.tapeX != null ? o.tapeX : 3.75, tapeZ: o.tapeZ != null ? o.tapeZ : -1.2 });
    out.road.position.set(0, 0, ROADZ); set.add(out.road);
    out.ridges = out.road.parts.ridges;
    // Hajia Ramatu's gate and wall, poultry pen behind, crates waiting by the gate
    out.gate = createGate({ open: 0.85 }); out.gate.position.set(0, 0, -1.9); set.add(out.gate);
    out.pen = createPoultryPen({ hens: 7 }); out.pen.position.set(-3.3, 0, -4.0); set.add(out.pen);
    out.yardHens = createChickens(S(4, 2), [-1.2, -3.2, 1.6, -2.3], 12); set.add(out.yardHens);
    out.crateStack = new THREE.Group();
    for (i = 0; i < 3; i++) { var cs = createCrate({ seed: 20 + i, lite: true, eggs: i === 2 }); cs.position.set((i % 2) * 0.4, Math.floor(i / 2) * 0.275, 0); cs.rotation.y = i * 0.1; out.crateStack.add(cs); }
    out.crateStack.position.set(1.15, 0, -1.25); set.add(out.crateStack); tagPart(out.crateStack, "crates");
    if (QL) bakeStatic(out.crateStack, { vertexColor: true, part: "crates" });
    // Mallam Sule's shed on the roadside
    out.shed = createShed(); out.shed.position.set(o.shedX != null ? o.shedX : -5.6, 0, -0.9); out.shed.rotation.y = 0.12; set.add(out.shed);
    out.shock = out.shed.parts.shock; out.newShock = out.shed.parts.newShock;
    // trees, electricity pole, hills
    var scen = new THREE.Group(); scen.name = "scenery"; tagPart(scen, "scenery"); set.add(scen); out.scenery = scen;
    var t1 = createTree(3, 1.15); t1.position.set(-2.3, 0, -3.1); scen.add(t1);
    var t2 = createTree(7, 1.0); t2.position.set(5.6, 0, -3.6); scen.add(t2);
    var t3 = createTree(11, 0.9); t3.position.set(-9.5, 0, -2.4); scen.add(t3);
    var pole = createPole(); pole.position.set(3.8, 0, -1.2); scen.add(pole);
    var wire = new THREE.Mesh(gTube([[3.8, 7.06, -1.2], [8, 6.5, -1.4], [13, 7.0, -1.6]], 0.01, 20, 4), mats().cable); scen.add(wire);
    var wire2 = new THREE.Mesh(gTube([[3.8, 7.06, -1.2], [-1, 6.4, -1.5], [-6, 7.0, -1.7]], 0.01, 20, 4), mats().cable); scen.add(wire2);
    var hills = createHills(); hills.position.set(0, 0, 0); scen.add(hills);
    if (QL) bakeStatic(scen, { vertexColor: true, part: "scenery" });
    // the okada, parked on the near edge of the road, nose +x
    out.okada = createOkada({ crates: o.crates || 1, leak: o.leak !== false, rider: false });
    var OX = o.okadaX != null ? o.okadaX : 0.1, OZ = o.okadaZ != null ? o.okadaZ : ROADZ - 1.55;
    out.okada.position.set(OX, 0, OZ); set.add(out.okada);
    out.crate = out.okada.parts.crate;
    out.sim = makeRider(out.okada, out.road, { mass: o.mass || 200, damper: o.damper || "leaking", lane: ROADZ - 0.4 });
    out.road.position.x = 0;
    // story helpers
    out.ride = function (kmh, opt) { out.sim.ride(kmh, opt); return out; };
    out.park = function (x, z) { out.sim.park(x, z); return out; };
    out.press = function (depth) { out.sim.park(); out.sim.press(depth); return out; };
    out.setLoad = function (mass) { out.sim.set({ mass: mass }); out.okada.setCrates(mass >= 250 ? 3 : 1); return out; };
    out.setDamper = function (d) { out.sim.set({ damper: d }); out.okada.setLeak(d !== "healthy"); return out; };
    out.reading = function () { return out.sim.reading(); };
    out.followShot = function (dist, height) {           // [camPos, lookAt] that tracks the riding okada
      var x = out.okada.position.x, z = out.okada.position.z;
      return [[x + 1.2, height || 1.6, z + (dist || 4.2)], [x, 0.65, z]];
    };
    out.mount = function (person) { var p = out.okada.seatRider(person); return p; };
    out.dismount = function () { return out.okada.dismount(); };
    // StoryStage spots (market-group space) and shots ([camPos, lookAt], world space)
    out.spots = { ramatu: [0, 0, -1.0], dayo: [-1.05, 0, 1.3], zainab: [2.3, 0, -0.85], tunde: [3.1, 0, -0.55], sule: [-6.75, 0, -0.35], okafor: [1.55, 0, 1.75], gate: [0, 0, -1.3], shedFront: [-4.6, 0, 0.6] };
    out.shots = {
      wide: [[0, 2.6, 10.5], [0, 0.9, 0.3]],
      gate: [[0.5, 2.0, 5.4], [0, 1.25, -1.2]],
      okada: [[1.9, 1.35, OZ + 2.75], [OX - 0.15, 0.68, OZ]],
      carrier: [[0.2, 1.55, OZ + 1.9], [OX - 0.75, 0.95, OZ]],
      stand: [[OX - 0.2, 0.8, OZ - 1.5], [OX - 0.6, 0.3, OZ]],
      ridges: [[5.0, 1.65, ROADZ + 2.8], [5.0, 0.05, ROADZ - 1.0]],
      ride: [[0, 2.3, ROADZ + 8.0], [0, 0.6, ROADZ - 0.4]],
      shed: [[-4.6, 1.95, 4.4], [-5.6, 1.3, -0.9]],
      shock: [[-6.2, 1.5, 0.45], [-6.45, 0.95, -1.75]],
      pen: [[-1.6, 2.4, 1.8], [-3.3, 1.0, -4.0]]
    };
    if (o.mountDayo && api.people.cust1) out.mount(api.people.cust1);
    var hl = null;
    out.highlighter = function (scene) { return hl || (hl = makeHighlighter(scene || set)); };
    out.update = function (dt, t) {
      dt = Math.min(dt || 0, 0.05);
      out.sim.step(dt);
      out.okada.update(dt, t); out.pen.update(dt, t); out.shed.update(dt, t); out.yardHens.update(dt, t);
    };
    out.update(0, 0);
    out.props = { okada: out.okada, crate: out.crate, ridges: out.ridges, road: out.road, shed: out.shed, shock: out.shock, newShock: out.newShock, gate: out.gate, pen: out.pen, crates: out.crateStack, farmSign: out.gate.parts.farmSign, rearShock: out.okada.parts["rear-shock"], "rear-shock": out.okada.parts["rear-shock"], carrier: partProxy(out.okada.parts, "carrier"), rearWheel: out.okada.parts.rearWheel, mud: out.okada.parts.mud, shadow: out.okada.parts.shadow, speedometer: out.okada.parts.speedometer, tape: out.road.parts.tape };
    finish(api, out.props, Object.keys(out.props));
    return out;
  }

  /* Set 2: the school physics laboratory (lab group at world x = 40, bench top y = 0.99) */
  function dressLab(api, o) {
    o = o || {};
    var L = api.props.lab, P = api.props, out = {}, people = collectPeople(api), TY = 0.99;
    out.hidden = [];
    if (!o.keepLabProps) {
      [P.balance, P.burette, P.flask, P.vflask].forEach(function (x) { if (x && x.visible) { hide(x); out.hidden.push(x); } });
      L.children.forEach(function (c) { if (c.isGroup && people.indexOf(c) < 0 && Math.abs(c.position.y - TY) < 0.01 && c.position.x > 1.4 && c.position.x < 2.6 && c.visible) { c.visible = false; out.hidden.push(c); } });
    }
    if (P.lSign && o.sign !== false && api.sign) {
      var s = api.sign(o.signText || "PHYSICS LABORATORY", "rgba(31,53,80,0.95)", "#fff", 0.42); s.position.copy(P.lSign.position); L.remove(P.lSign); L.add(s); P.lSign = s; out.sign = s;
    }
    var set = new THREE.Group(); set.name = "physics-lab-set"; L.add(set); out.set = set;
    out.pendulum = createPendulumStand({ l: o.l || 0.80 }); out.pendulum.position.set(-1.9, TY, -2.35); set.add(out.pendulum);
    out.spring = createSpringStand({ k: 24.5 }); out.spring.position.set(-0.75, TY, -2.35); set.add(out.spring);
    out.spring.setLoad(o.springLoad || 4);
    // stopwatch + metre rule lying on the bench
    var M = mats(), b = new Batch();
    b.add("stopwatch", M.chrome, gLathe([[0.0004, 0], [0.03, 0], [0.034, 0.006], [0.034, 0.016], [0.03, 0.02], [0.0004, 0.02]], 22), mT(0.25, TY, -2.05));
    b.add("stopwatch", M.chrome, gRod([0.25, TY + 0.01, -2.085], [0.25, TY + 0.01, -2.1], 0.006, 8));
    b.add("ruler", M.rule, new THREE.BoxGeometry(0.028, 1.0, 0.004).rotateX(-Math.PI / 2).rotateY(Math.PI / 2), mT(0.6, TY + 0.003, -1.95));
    // chalkboard on the back wall
    b.add("board", M.timber, gPlank(2.3, 0.06, 0.04), mT(0.9, 1.35, -3.07));
    b.add("board", M.timber, gPlank(2.3, 0.06, 0.04), mT(0.9, 2.55, -3.07));
    b.flush(set);
    var lcd = new THREE.Mesh(new THREE.CircleGeometry(0.024, 20), M.lcd); lcd.rotation.x = -Math.PI / 2; lcd.position.set(0.25, TY + 0.0215, -2.05); set.add(lcd);
    var board = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.15), M.chalkboard); board.position.set(0.9, 1.95, -3.08); tagPart(board, "board"); set.add(board);
    if (QL) bakeStatic(set, { shallow: true, part: "labBench", keep: function (o) { return o === board; } });
    // Barton's pendulums on the floor beside the bench
    out.barton = createBarton({ driverL: 0.60 }); out.barton.position.set(o.bartonX != null ? o.bartonX : 3.4, 0, -1.7); set.add(out.barton);
    out.spots = { okafor: [-1.0, 0, -1.3], zainab: [0.35, 0, -1.15], tunde: [1.25, 0, -1.0], okaforBarton: [2.15, 0, -1.0], zainabBarton: [4.6, 0, -0.9], tundeBarton: [4.9, 0, -0.3] };
    var X = 40;
    out.shots = {
      lab: [[X + 0.3, 2.2, 6.0], [X + 0.3, 1.2, -1.2]],
      bench: [[X - 0.9, 1.75, 1.2], [X - 1.1, 1.2, -2.3]],
      pendulum: [[X - 1.75, 1.45, -0.6], [X - 1.8, 1.4, -2.35]],
      spring: [[X - 0.65, 1.55, -1.1], [X - 0.7, 1.55, -2.35]],
      barton: [[X + 3.4, 1.65, 2.2], [X + 3.4, 1.35, -1.7]],
      board: [[X + 0.9, 1.9, 0.4], [X + 0.9, 1.9, -3.0]]
    };
    out.update = function (dt, t) { dt = Math.min(dt || 0, 0.05); out.pendulum.update(dt, t); out.spring.update(dt, t); out.barton.update(dt, t); };
    out.highlighter = function (scene) { return makeHighlighter(scene || set); };
    out.props = { pendulum: out.pendulum, springStand: out.spring, spring: out.spring.parts.spring, barton: out.barton, driver: out.barton.parts.driver, "cone-1": out.barton.parts["cone-1"], "cone-2": out.barton.parts["cone-2"], "cone-3": out.barton.parts["cone-3"], "cone-4": out.barton.parts["cone-4"], "cone-5": out.barton.parts["cone-5"], board: board };
    finish(api, out.props, Object.keys(out.props));
    return out;
  }

  /* ================================================================ counting */
  function triangles(obj) {
    var n = 0;
    obj.traverseVisible(function (o) {
      if (!o.isMesh || !o.geometry) return;
      var gg = o.geometry, t = (gg.index ? gg.index.count : gg.attributes.position.count) / 3;
      n += o.isInstancedMesh ? t * o.count : t;
    });
    return Math.round(n);
  }
  function drawCalls(obj) { var n = 0; obj.traverseVisible(function (o) { if (o.isMesh || o.isSprite) n++; }); return n; }

  function q1(fn) { return function (o) { var a = arguments; return withQ(o && o.quality, function () { return fn.apply(null, a); }); }; }
  function q2(fn) { return function (api, o) { var a = arguments; return withQ(o && o.quality, function () { var out = fn.apply(null, a); out.quality = QL ? "low" : "high"; return out; }); }; }
  createOkada = q1(createOkada); createRoad = q1(createRoad); createCrate = q1(createCrate); createEggTray = q1(createEggTray);
  createShock = q1(createShock); createGate = q1(createGate); createPoultryPen = q1(createPoultryPen); createShed = q1(createShed);
  createBarton = q1(createBarton); createPendulumStand = q1(createPendulumStand); createSpringStand = q1(createSpringStand);
  dressRoad = q2(dressRoad); dressLab = q2(dressLab);
  var createTreeQ = function (seed, scale, o) { return withQ(o && o.quality, function () { return createTree(seed, scale); }); };
  var createChickensQ = function (n, area, seed, o) { return withQ(o && o.quality, function () { return createChickens(n, area, seed); }); };

  global.RidgeRoadProps = {
    version: 1,
    quality: function (q) { return resolveQ(q === "auto" ? undefined : q) ? "low" : "high"; },
    okada: createOkada, createOkada: createOkada,
    road: createRoad, createRoad: createRoad,
    createCrate: createCrate, createEggTray: createEggTray, createShock: createShock,
    createGate: createGate, createPoultryPen: createPoultryPen, createShed: createShed,
    createBarton: createBarton, createPendulumStand: createPendulumStand, createSpringStand: createSpringStand,
    createTree: createTreeQ, createChickens: createChickensQ,
    dressRoad: dressRoad, dressLab: dressLab,
    rideController: makeRider,
    model: model,
    defaults: { R: OK.R, wheelbase: OK.FX - OK.RX, frontX: OK.FX, rearX: OK.RX, carrierX: -0.79, carrierY: 0.827, d: STORY.d, ridgeH: 0.045, ridgeW: 0.5 },
    modes: ["park", "press", "ride"],
    makeHighlighter: makeHighlighter, tagPart: tagPart,
    triangles: triangles, drawCalls: drawCalls
  };
})(window);
