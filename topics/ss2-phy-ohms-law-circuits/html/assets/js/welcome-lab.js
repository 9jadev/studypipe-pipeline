/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab · Ohm's Law & Current Electricity
   Engr. Nkechi's test bench (Aba). Three modes, every number from a physics model:
     ohms   keke battery (E = 12.0 V, r = 1.2 Ω) → plug key → ammeter → 2.20 Ω constantan
            test wire → slide-wire rheostat; voltmeter across the wire. Slide R: V and I
            change, V ÷ I stays 2.20 Ω.
     ir     the same battery with a voltmeter across its terminals. Key open → V = E;
            key closed on a test load → I = E/(R + r), V = E − Ir. Mini V–I plot (intercept E,
            gradient −r) in the canvas corner.
     null   100 cm potentiometer: 24 V driver + rheostat set to k = 0.150 V cm⁻¹; the keke
            battery through a centre-zero galvanometer to the jockey. Balance at 80.0 cm → 12.0 V.
   Apparatus is modelled as real bench kit (extruded battery case with vent caps and lead
   posts, lathe-turned terminals and brass plug, sloping-face meters with printed dials,
   wire-wound rheostat with sliding contact, metre-rule potentiometer, knife-edge jockey,
   tube leads with moving charge).
   Exposes window.StudyLab for StudyNarrator:
     rect(part) · highlight(part) · setMode(m) · setR(ohm) · key(open) · load(ohm) · jockey(cm)
     state() · reset() · openTapFor()
   Emits CustomEvent "lab:result" { mode, ... } after every learner action.
   Classic script, no modules, fully offline.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("lab-canvas");
  var labRoot = document.getElementById("lab");
  if (!canvas || !labRoot) return;

  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    info: $("lab-info"), toast: $("endpoint-toast"), legend: $("lab-legend"), fallback: $("lab-fallback"),
    rSlide: $("lab-r"), rOut: $("lab-r-out"), jSlide: $("lab-l"), jOut: $("lab-l-out"),
    keyBtn: $("lab-key"), mini: $("lab-mini"), miniPts: $("lab-mini-pts"), miniNow: $("lab-mini-now")
  };
  var K = [1, 2, 3, 4].map(function (i) { return { k: $("hud-k" + i), v: $("hud-v" + i) }; });
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- physics model (values from 02-lesson.md) ---------------- */
  var CELL = { E: 12.0, r: 1.2 };            // Emeka's keke battery
  var WIRE = 2.20;                           // constantan test wire, Lesson 01
  var POT = { k: 0.150, len: 100 };          // V per cm along the potentiometer wire
  var LOADS = { "2.8": "starter test load", "6": "headlamp", "12": "parking lamp" };

  function ohms(R) { var I = CELL.E / (CELL.r + R + WIRE); return { R: R, I: I, V: I * WIRE, ratio: WIRE }; }
  function terminal(open, R) {
    if (open) return { open: true, R: R, I: 0, V: CELL.E, lost: 0 };
    var I = CELL.E / (R + CELL.r);
    return { open: false, R: R, I: I, V: CELL.E - I * CELL.r, lost: I * CELL.r };
  }
  function pot(l) {
    var Vw = POT.k * l, diff = CELL.E - Vw;            // > 0: cell pushes, needle one way
    return { l: l, Vw: Vw, diff: diff, balanced: Math.abs(diff) < 0.04 };
  }

  var state = { mode: "ohms", R: 10, open: true, load: 2.8, l: 50, readings: {}, irPts: {}, balanced: false, picked: null };

  function f(v, d) { return v.toFixed(d); }
  function emit(detail) { document.dispatchEvent(new CustomEvent("lab:result", { detail: detail })); }
  function hud(rows) { rows.forEach(function (r, i) { if (K[i].k) { K[i].k.textContent = r[0]; K[i].v.textContent = r[1]; } }); }
  var toastTimer = null;
  function toast(html) {
    if (!ui.toast) return;
    ui.toast.innerHTML = html; ui.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast.classList.remove("show"); }, 3800);
  }

  /* ---------------- UI wiring (works without WebGL too) ---------------- */
  var modeTabs = labRoot.querySelectorAll(".lab-modes [data-mode]");
  var ctrls = labRoot.querySelectorAll(".lab-ctrl");
  modeTabs.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode"), true); }); });
  if (ui.rSlide) {
    ui.rSlide.addEventListener("input", function () { setR(+ui.rSlide.value, false); });
    ui.rSlide.addEventListener("change", function () { setR(+ui.rSlide.value, true); });
  }
  if (ui.jSlide) {
    ui.jSlide.addEventListener("input", function () { setJockey(+ui.jSlide.value, false); });
    ui.jSlide.addEventListener("change", function () { setJockey(+ui.jSlide.value, true); });
  }
  if (ui.keyBtn) ui.keyBtn.addEventListener("click", function () { setKey(!state.open, true); });
  labRoot.querySelectorAll("[data-load]").forEach(function (b) {
    b.addEventListener("click", function () { setLoad(+b.getAttribute("data-load"), true); });
  });
  var readBtn = $("lab-read");
  if (readBtn) readBtn.addEventListener("click", function () { takeReading(true); });

  /* ======================= 3D ======================= */
  var gl = typeof THREE !== "undefined" && window.SceneKit && SceneKit.hasWebGL();
  var renderer, scene, camera, P = {}, leadGroup, flows = [], hi = null;
  var view = { yaw: 0, pitch: 0.62, dist: 4, target: null, lastTouch: -1e9 };
  var visible = true;

  /* build3D() runs at the end of this file, after every var below (M, LAYOUT, SHOW, clock…) is assigned. */

  /* ---- materials & textures ---- */
  var M = {};
  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.6 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function canvasTex(w, h, draw, repeatX) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if ("colorSpace" in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeatX) { t.wrapS = THREE.RepeatWrapping; t.repeat.set(repeatX, 1); }
    return t;
  }
  function noiseBump(w, h, lines) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d");
    g.fillStyle = "#808080"; g.fillRect(0, 0, w, h);
    for (var i = 0; i < lines; i++) {
      var y = Math.random() * h, a = 0.05 + Math.random() * 0.12;
      g.strokeStyle = "rgba(" + (Math.random() < 0.5 ? "0,0,0" : "255,255,255") + "," + a + ")";
      g.lineWidth = 1 + Math.random() * 2;
      g.beginPath(); g.moveTo(0, y);
      for (var x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 3);
      g.stroke();
    }
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  function makeMaterials() {
    var woodMap = canvasTex(512, 256, function (g, w, h) {
      var grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, "#6b4527"); grd.addColorStop(1, "#5a3a20");
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 70; i++) {
        var y = Math.random() * h;
        g.strokeStyle = "rgba(" + (30 + Math.random() * 40 | 0) + ",16,6," + (0.12 + Math.random() * 0.2) + ")";
        g.lineWidth = 0.6 + Math.random() * 2.2;
        g.beginPath(); g.moveTo(0, y);
        for (var x = 0; x <= w; x += 24) g.lineTo(x, y + Math.sin(x * 0.012 + i * 1.7) * 4);
        g.stroke();
      }
    });
    woodMap.wrapS = woodMap.wrapT = THREE.RepeatWrapping;
    M.wood = std(0xffffff, 0.78, 0, { map: woodMap, bumpMap: noiseBump(256, 128, 60), bumpScale: 0.004 });
    M.board = std(0xffffff, 0.7, 0, { map: woodMap });
    M.caseBlack = std(0x22262d, 0.55, 0.05, { bumpMap: noiseBump(128, 128, 40), bumpScale: 0.0015 });
    M.lid = std(0x2e333b, 0.5, 0.05);
    M.vent = std(0x3a3f47, 0.6, 0.02);
    M.lead = std(0x9097a0, 0.42, 0.75);
    M.red = std(0xc5303b, 0.45, 0.05);
    M.blk = std(0x15171b, 0.5, 0.05);
    M.ebonite = std(0x17171b, 0.38, 0.1);
    M.brass = std(0xc9a243, 0.3, 0.9);
    M.copper = std(0xc77a43, 0.32, 0.85);
    M.steel = std(0xb9c0c8, 0.28, 0.9);
    M.bakelite = std(0x2b2724, 0.45, 0.05);
    M.ceramic = std(0xe9e2d2, 0.7, 0);
    M.constantan = std(0xd2c2b2, 0.25, 0.9);
    M.glass = std(0xf4f8ff, 0.05, 0, { transparent: true, opacity: 0.22, depthWrite: false });
    M.leadRed = std(0xd23a3a, 0.5, 0.05);
    M.leadBlack = std(0x22252b, 0.5, 0.05);
    M.leadYellow = std(0xe7b52e, 0.5, 0.05);
    M.leadBlue = std(0x3b6fd6, 0.5, 0.05);
    M.charge = std(0x7cf3ff, 0.3, 0, { emissive: 0x38e1ff, emissiveIntensity: 1.4 });
    M.filament = std(0xffd38a, 0.4, 0.2, { emissive: 0xffa640, emissiveIntensity: 0 });
    var coil = canvasTex(256, 64, function (g, w, h) {
      g.fillStyle = "#e9e2d2"; g.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 4) {
        var grd = g.createLinearGradient(x, 0, x + 3, 0);
        grd.addColorStop(0, "#7d7a74"); grd.addColorStop(0.5, "#d9d4cb"); grd.addColorStop(1, "#6f6c66");
        g.fillStyle = grd; g.fillRect(x, 0, 3, h);
      }
    }, 6);
    M.coil = std(0xffffff, 0.35, 0.6, { map: coil });
  }

  /* ---- geometry helpers ---- */
  function rrShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // rounded block w (x) × h (y) × d (z), base on y = 0, centred in x/z
  function block(w, h, d, r, mat, bevel) {
    var b = bevel == null ? Math.min(0.008, r * 0.5) : bevel;
    var geo = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, d - 2 * b, Math.max(0.001, r - b)), { depth: h - 2 * b, bevelEnabled: b > 0, bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 6 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, b, 0);
    var m = new THREE.Mesh(geo, mat); return m;
  }
  function lathe(profile, mat, seg) {
    var pts = profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    return new THREE.Mesh(new THREE.LatheGeometry(pts, seg || 24), mat);
  }
  function anchor(parent, x, y, z, name) {
    var o = new THREE.Object3D(); o.position.set(x, y, z); o.name = name; parent.add(o);
    parent.userData.anchors = parent.userData.anchors || {}; parent.userData.anchors[name] = o;
    return o;
  }
  function terminalPost(parent, x, y, z, mat, name) {
    var t = lathe([[0, 0], [0.018, 0], [0.018, 0.012], [0.012, 0.016], [0.012, 0.03], [0.02, 0.032], [0.02, 0.05], [0.014, 0.056], [0, 0.058]], mat || M.brass, 18);
    t.position.set(x, y, z); parent.add(t);
    anchor(parent, x, y + 0.045, z, name);
    return t;
  }
  function labelPlane(text, w, h, opts) {
    opts = opts || {};
    var tex = canvasTex(512, Math.round(512 * h / w), function (g, cw, ch) {
      g.fillStyle = opts.bg || "#f2ead8"; g.fillRect(0, 0, cw, ch);
      if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = 6; g.strokeRect(6, 6, cw - 12, ch - 12); }
      g.fillStyle = opts.fg || "#1d1a16";
      g.font = "700 " + Math.round(ch * (opts.size || 0.42)) + "px Manrope, Arial, sans-serif";
      g.textAlign = "center"; g.textBaseline = "middle";
      var lines = String(text).split("\n");
      lines.forEach(function (ln, i) { g.fillText(ln, cw / 2, ch / 2 + (i - (lines.length - 1) / 2) * ch * (opts.lh || 0.42)); });
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), std(0xffffff, 0.7, 0, { map: tex }));
  }

  /* ---- apparatus ---- */
  function battery(label, sub) {
    var g = new THREE.Group();
    var body = block(0.5, 0.3, 0.27, 0.02, M.caseBlack); g.add(body);
    var lid = block(0.52, 0.04, 0.29, 0.02, M.lid); lid.position.y = 0.29; g.add(lid);
    // six vent caps, one per 2 V cell
    for (var i = 0; i < 6; i++) {
      var v = lathe([[0, 0], [0.022, 0], [0.022, 0.012], [0.018, 0.018], [0, 0.02]], M.vent, 16);
      v.position.set(-0.17 + i * 0.068, 0.33, 0.02); g.add(v);
    }
    // lead posts with coloured collars: + on the left (red), − on the right (black)
    [[-0.19, M.red, "pos"], [0.19, M.blk, "neg"]].forEach(function (p) {
      var post = lathe([[0, 0], [0.026, 0], [0.024, 0.03], [0.018, 0.05], [0, 0.052]], M.lead, 20);
      post.position.set(p[0], 0.33, -0.08); g.add(post);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 8, 20), p[1]);
      ring.rotation.x = Math.PI / 2; ring.position.set(p[0], 0.336, -0.08); g.add(ring);
      anchor(g, p[0], 0.37, -0.08, p[2]);
    });
    var lab = labelPlane(label + "\n" + sub, 0.36, 0.13, { bg: "#c8323c", fg: "#ffffff", size: 0.34, lh: 0.42 });
    lab.position.set(0, 0.16, 0.136); g.add(lab);
    var plus = labelPlane("+   −", 0.12, 0.04, { bg: "#2e333b", fg: "#ffffff", size: 0.8 });
    plus.rotation.x = -Math.PI / 2; plus.position.set(0, 0.312, -0.08); plus.scale.x = 3.2; g.add(plus);
    return g;
  }

  function plugKey() {
    var g = new THREE.Group();
    var base = block(0.24, 0.035, 0.12, 0.012, M.ebonite); g.add(base);
    [-0.05, 0.05].forEach(function (x) {
      var b = block(0.085, 0.045, 0.075, 0.006, M.brass); b.position.set(x, 0.035, 0); g.add(b);
    });
    terminalPost(g, -0.095, 0.08, 0.0, M.brass, "a");
    terminalPost(g, 0.095, 0.08, 0.0, M.brass, "b");
    var plug = new THREE.Group();
    plug.add(lathe([[0, 0], [0.006, 0], [0.013, 0.05], [0.015, 0.056], [0.024, 0.06], [0.024, 0.07], [0, 0.07]], M.brass, 20));
    var knob = lathe([[0, 0], [0.026, 0], [0.03, 0.02], [0.026, 0.05], [0.012, 0.062], [0, 0.064]], M.ebonite, 20);
    knob.position.y = 0.07; plug.add(knob);
    g.add(plug); g.userData.plug = plug;
    g.userData.setOpen = function (open) {
      if (open) { plug.position.set(0.0, 0.17, 0.08); plug.rotation.set(0.5, 0, 0.35); }
      else { plug.position.set(0, 0.03, 0); plug.rotation.set(0, 0, 0); }
    };
    g.userData.setOpen(true);
    return g;
  }

  function dialTexture(kind) {
    return canvasTex(512, 320, function (g, w, h) {
      g.fillStyle = "#f3ecdb"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#2a2622"; g.lineWidth = 4; g.strokeRect(8, 8, w - 16, h - 16);
      var cx = w / 2, cy = h * 0.92, R = h * 0.72, a0 = -Math.PI * 0.78, a1 = -Math.PI * 0.22;
      g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke();
      var n = kind === "G" ? 10 : kind === "A" ? 25 : 30, maj = kind === "G" ? 5 : 5, max = kind === "A" ? 5 : 15;
      g.fillStyle = "#2a2622"; g.font = "700 26px Manrope, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n, big = i % maj === 0;
        var r1 = R - (big ? 28 : 15);
        g.lineWidth = big ? 3 : 1.6;
        g.beginPath(); g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke();
        if (big) {
          var val = kind === "G" ? (i - n / 2) / maj * 1 : max * i / n;
          var txt = kind === "G" ? (val === 0 ? "0" : (val > 0 ? "+" : "−") + Math.abs(val)) : String(Math.round(val));
          g.fillText(txt, cx + Math.cos(a) * (R - 50), cy + Math.sin(a) * (R - 50));
        }
      }
      if (kind === "G") { g.fillStyle = "#c8323c"; g.fillRect(cx - 2, cy - R - 6, 4, 34); g.fillStyle = "#2a2622"; }
      g.font = "800 64px Georgia, serif"; g.fillText(kind, cx, cy - R * 0.42);
      g.font = "600 20px Manrope, Arial, sans-serif";
      g.fillText(kind === "A" ? "0 – 5 A  d.c." : kind === "V" ? "0 – 15 V  d.c." : "centre zero", cx, cy - R * 0.2);
    });
  }

  // sloping-face moving-coil meter: kind "A", "V" or "G"
  function meter(kind) {
    var g = new THREE.Group(), W = 0.24;
    var s = new THREE.Shape();
    s.moveTo(-0.11, 0); s.lineTo(0.11, 0); s.lineTo(0.11, 0.2); s.lineTo(0.06, 0.215); s.lineTo(-0.11, 0.075); s.lineTo(-0.11, 0);
    var geo = new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
    geo.rotateY(Math.PI / 2); geo.translate(-W / 2, 0, 0);
    g.add(new THREE.Mesh(geo, M.bakelite));
    // dial on the sloping face
    var slope = Math.atan2(0.215 - 0.075, 0.06 + 0.11);       // rise over run of the face
    var dial = new THREE.Group();
    dial.position.set(0, (0.075 + 0.215) / 2 + 0.004, -((-0.11 + 0.06) / 2) + 0.004);
    dial.rotation.x = -(Math.PI / 2 - slope);
    g.add(dial);
    var face = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.125), std(0xffffff, 0.6, 0, { map: dialTexture(kind) }));
    dial.add(face);
    var needle = new THREE.Group(); needle.position.set(0, -0.0525, 0.003); dial.add(needle);
    var ns = new THREE.Shape(); ns.moveTo(-0.0025, 0); ns.lineTo(0.0025, 0); ns.lineTo(0.0006, 0.088); ns.lineTo(-0.0006, 0.088); ns.lineTo(-0.0025, 0);
    needle.add(new THREE.Mesh(new THREE.ShapeGeometry(ns), std(kind === "G" ? 0x1a1a1a : 0xb3202c, 0.5, 0.1)));
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 16), M.blk); hub.rotation.x = Math.PI / 2; needle.add(hub);
    var glass = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.125), M.glass); glass.position.z = 0.01; dial.add(glass);
    // terminals on the front ledge: + red (left), − black (right)
    terminalPost(g, -0.06, 0.006 + 0.0, 0.135, kind === "G" ? M.brass : M.red, "pos");
    terminalPost(g, 0.06, 0.006, 0.135, kind === "G" ? M.brass : M.blk, "neg");
    var ledge = block(0.24, 0.012, 0.05, 0.006, M.bakelite); ledge.position.set(0, 0, 0.125); g.add(ledge);
    g.userData.target = 0; g.userData.frac = 0;
    // frac: 0..1 for A/V, −1..1 for G
    g.userData.set = function (frac) { g.userData.target = frac; };
    g.userData.tick = function (dt) {
      var u = g.userData; u.frac += (u.target - u.frac) * Math.min(1, dt * 7);
      var span = Math.PI * 0.56, a = kind === "G" ? -u.frac * span / 2 : span / 2 - u.frac * span;
      needle.rotation.z = a;
    };
    return g;
  }

  function rheostat() {
    var g = new THREE.Group(), L = 0.62;
    var base = block(0.72, 0.02, 0.16, 0.01, M.board); g.add(base);
    [-1, 1].forEach(function (sd) {
      var plate = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(0.13, 0.2, 0.025), { depth: 0.022, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 1 }), M.ebonite);
      plate.rotation.y = Math.PI / 2; plate.position.set(sd * (L / 2 + 0.02) - 0.011 * (sd > 0 ? -1 : 1) * 0, 0.12, 0); g.add(plate);
    });
    var former = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, L, 40, 1, true), M.coil);
    former.rotation.z = Math.PI / 2; former.position.y = 0.1; g.add(former);
    var bar = new THREE.Mesh(new THREE.BoxGeometry(L + 0.06, 0.016, 0.016), M.brass); bar.position.set(0, 0.2, 0); g.add(bar);
    var slider = new THREE.Group();
    slider.add(block(0.05, 0.035, 0.04, 0.006, M.ebonite));
    slider.children[0].position.y = 0.194;
    var finger = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.012), M.brass); finger.position.set(0, 0.17, 0); slider.add(finger);
    var knob = lathe([[0, 0], [0.012, 0], [0.014, 0.02], [0, 0.026]], M.ebonite, 14); knob.position.y = 0.229; slider.add(knob);
    g.add(slider); g.userData.slider = slider;
    terminalPost(g, -L / 2 - 0.02, 0.022, 0.06, M.brass, "a");
    terminalPost(g, L / 2 + 0.02, 0.022, 0.06, M.brass, "b");
    terminalPost(g, L / 2 + 0.05, 0.2 - 0.02, 0.0, M.brass, "c");
    g.userData.setFrac = function (u) { slider.position.x = -L / 2 + 0.03 + (L - 0.06) * u; };
    return g;
  }

  function wireBoard() {
    var g = new THREE.Group();
    g.add(block(0.62, 0.025, 0.09, 0.01, M.board));
    var lab = labelPlane("constantan  2.20 Ω", 0.24, 0.035, { size: 0.6 });
    lab.rotation.x = -Math.PI / 2; lab.position.set(0, 0.026, 0.028); g.add(lab);
    terminalPost(g, -0.27, 0.025, -0.01, M.brass, "a");
    terminalPost(g, 0.27, 0.025, -0.01, M.brass, "b");
    var pts = [];
    for (var i = 0; i <= 20; i++) { var u = i / 20; pts.push(new THREE.Vector3(-0.27 + 0.54 * u, 0.062 - Math.sin(u * Math.PI) * 0.006, -0.01)); }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0035, 8), M.constantan));
    return g;
  }

  function lamp() {
    var g = new THREE.Group();
    g.add(block(0.16, 0.04, 0.16, 0.02, M.ebonite));
    var socket = lathe([[0, 0], [0.04, 0], [0.04, 0.05], [0.03, 0.06], [0, 0.06]], M.ebonite, 20); socket.position.y = 0.04; g.add(socket);
    var cap = lathe([[0, 0], [0.024, 0], [0.025, 0.006], [0.023, 0.012], [0.025, 0.018], [0.023, 0.024], [0.025, 0.03], [0.02, 0.036], [0, 0.036]], M.brass, 20);
    cap.position.y = 0.1; g.add(cap);
    var bulbPts = [];
    for (var i = 0; i <= 16; i++) { var t = i / 16, a = -Math.PI / 2 + t * Math.PI; bulbPts.push([Math.max(0.0001, (t < 0.25 ? 0.02 + t * 0.12 : 0.06 * Math.cos(a * 0.9 - 0.1))), 0.136 + t * 0.12]); }
    bulbPts.unshift([0.02, 0.136]); bulbPts.push([0, 0.256]);
    var bulb = lathe(bulbPts, M.glass, 28); g.add(bulb);
    var helix = [];
    for (var j = 0; j <= 60; j++) { var u = j / 60, ang = u * Math.PI * 12; helix.push(new THREE.Vector3(-0.022 + 0.044 * u, 0.19 + Math.sin(ang) * 0.004, Math.cos(ang) * 0.004)); }
    var fil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix), 120, 0.0012, 5), M.filament); g.add(fil);
    [-0.022, 0.022].forEach(function (x) {
      var post = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0012, 0.06, 6), M.steel); post.position.set(x, 0.16, 0); g.add(post);
    });
    terminalPost(g, -0.06, 0.04, 0.05, M.brass, "a");
    terminalPost(g, 0.06, 0.04, 0.05, M.brass, "b");
    var light = new THREE.PointLight(0xffb357, 0, 1.6); light.position.y = 0.19; g.add(light);
    g.userData.setGlow = function (u) { M.filament.emissiveIntensity = 2.6 * u; light.intensity = 1.6 * u; };
    return g;
  }

  function potBoard() {
    var g = new THREE.Group(), L = 1.3;
    g.add(block(L + 0.12, 0.035, 0.16, 0.012, M.board));
    var scaleTex = canvasTex(1024, 64, function (c, w, h) {
      c.fillStyle = "#efe6cf"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#1d1a16"; c.font = "700 22px Manrope, Arial, sans-serif"; c.textAlign = "center";
      for (var i = 0; i <= 100; i++) {
        var x = 12 + (w - 24) * i / 100, len = i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11;
        c.fillRect(x - 1, 0, i % 10 === 0 ? 2.4 : 1.4, len);
        if (i % 10 === 0) c.fillText(String(i), x, 56);
      }
    });
    var scale = new THREE.Mesh(new THREE.PlaneGeometry(L + 0.02, 0.05), std(0xffffff, 0.6, 0, { map: scaleTex }));
    scale.rotation.x = -Math.PI / 2; scale.position.set(0, 0.036, 0.04); g.add(scale);
    [-1, 1].forEach(function (sd) {
      var b = block(0.05, 0.03, 0.08, 0.006, M.copper); b.position.set(sd * (L / 2 + 0.02), 0.035, -0.02); g.add(b);
    });
    terminalPost(g, -L / 2 - 0.03, 0.065, -0.035, M.brass, "a");
    terminalPost(g, L / 2 + 0.03, 0.065, -0.035, M.brass, "b");
    var wire = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, L, 8), M.constantan);
    wire.rotation.z = Math.PI / 2; wire.position.set(0, 0.052, -0.005); g.add(wire);
    g.userData.L = L;
    g.userData.xAt = function (cm) { return -L / 2 + L * cm / 100; };
    return g;
  }

  function jockey() {
    var g = new THREE.Group();
    var body = lathe([[0, 0], [0.003, 0], [0.012, 0.03], [0.016, 0.07], [0.014, 0.11], [0.018, 0.12], [0, 0.125]], M.ebonite, 18);
    body.position.y = 0.012; g.add(body);
    var edge = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.016, 4), M.brass); edge.rotation.x = Math.PI; edge.position.y = 0.008; g.add(edge);
    anchor(g, 0, 0.13, 0, "top");
    return g;
  }

  /* ---- leads with moving charge ---- */
  function lead(a, b, mat, lift, side) {
    var p = a.clone(), q = b.clone(), mid = p.clone().lerp(q, 0.5);
    var d = p.distanceTo(q);
    mid.y += (lift || 0.12) + d * 0.12; mid.z += side || 0;
    var curve = new THREE.CatmullRomCurve3([p, p.clone().add(new THREE.Vector3(0, 0.05, 0)), mid, q.clone().add(new THREE.Vector3(0, 0.05, 0)), q]);
    var m = new THREE.Mesh(new THREE.TubeGeometry(curve, 50, 0.0085, 7), mat);
    leadGroup.add(m);
    // a crocodile-clip sleeve at each end
    [p, q].forEach(function (e) {
      var s = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.03, 10), mat); s.position.copy(e).add(new THREE.Vector3(0, 0.02, 0)); leadGroup.add(s);
    });
    return curve;
  }
  function flow(curve, branch, n) {
    var arr = [];
    for (var i = 0; i < (n || 5); i++) {
      var s = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), M.charge);
      s.userData.u = i / (n || 5); leadGroup.add(s); arr.push(s);
    }
    flows.push({ curve: curve, dots: arr, branch: branch });
  }
  function W(part, name) { var a = P[part].userData.anchors[name]; a.updateWorldMatrix(true, false); return a.getWorldPosition(new THREE.Vector3()); }

  function buildLeads(m) {
    if (leadGroup) {
      leadGroup.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
      scene.remove(leadGroup);
    }
    leadGroup = new THREE.Group(); scene.add(leadGroup); flows = [];
    scene.updateMatrixWorld(true);
    var c;
    if (m === "ohms") {
      c = lead(W("battery", "pos"), W("key", "a"), M.leadRed, 0.08); flow(c, "main");
      c = lead(W("key", "b"), W("ammeter", "pos"), M.leadRed, 0.06); flow(c, "main");
      c = lead(W("ammeter", "neg"), W("wire", "a"), M.leadYellow, 0.05); flow(c, "main");
      c = lead(W("wire", "b"), W("rheostat", "a"), M.leadYellow, 0.06); flow(c, "main");
      c = lead(W("rheostat", "c"), W("battery", "neg"), M.leadBlack, 0.1, -0.05); flow(c, "main", 7);
      lead(W("voltmeter", "pos"), W("wire", "a"), M.leadBlue, 0.07, 0.03);
      lead(W("voltmeter", "neg"), W("wire", "b"), M.leadBlue, 0.07, 0.03);
    } else if (m === "ir") {
      c = lead(W("battery", "pos"), W("key", "a"), M.leadRed, 0.08); flow(c, "main");
      c = lead(W("key", "b"), W("ammeter", "pos"), M.leadRed, 0.06); flow(c, "main");
      c = lead(W("ammeter", "neg"), W("lamp", "a"), M.leadYellow, 0.06); flow(c, "main");
      c = lead(W("lamp", "b"), W("battery", "neg"), M.leadBlack, 0.12, -0.06); flow(c, "main", 7);
      lead(W("voltmeter", "pos"), W("battery", "pos"), M.leadBlue, 0.1, 0.05);
      lead(W("voltmeter", "neg"), W("battery", "neg"), M.leadBlue, 0.1, 0.05);
    } else {
      c = lead(W("driver", "pos"), W("key", "a"), M.leadRed, 0.07); flow(c, "drive");
      c = lead(W("key", "b"), W("board", "a"), M.leadRed, 0.07); flow(c, "drive");
      c = lead(W("board", "b"), W("rheostat", "a"), M.leadBlack, 0.07); flow(c, "drive");
      c = lead(W("rheostat", "c"), W("driver", "neg"), M.leadBlack, 0.1); flow(c, "drive", 6);
      c = lead(W("battery", "pos"), W("board", "a"), M.leadRed, 0.1, 0.04); flow(c, "test", 4);
      c = lead(W("battery", "neg"), W("galv", "pos"), M.leadBlack, 0.05); flow(c, "test", 4);
      c = lead(W("galv", "neg"), W("jockey", "top"), M.leadBlue, 0.08); flow(c, "test", 4);
      state.jockeyLead = c;
    }
  }

  /* ---- layout per mode (bench coordinates, metres-ish) ---- */
  var LAYOUT = {
    ohms: {
      bench: [0, 0, 0], battery: [-0.68, 0.0, -0.36], key: [-0.08, 0, -0.42], rheostat: [0.5, 0, -0.38],
      ammeter: [-0.6, 0, 0.3], wire: [0.12, 0, 0.12], voltmeter: [0.62, 0, 0.36]
    },
    ir: {
      bench: [0, 0, 0], battery: [-0.55, 0, -0.32], key: [0.08, 0, -0.4], lamp: [0.6, 0, -0.18],
      ammeter: [0.25, 0, 0.32], voltmeter: [-0.45, 0, 0.34]
    },
    null: {
      bench: [0, 0, 0], driver: [-0.62, 0, -0.42], key: [-0.08, 0, -0.46], rheostat: [0.5, 0, -0.42],
      board: [0, 0, 0.1], battery: [-0.55, 0, 0.5], galv: [0.25, 0, 0.5], jockey: [0, 0.055, 0.095]
    }
  };

  function build3D() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    canvas.style.touchAction = "pan-y";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1.6, 0.05, 60);
    view.target = new THREE.Vector3();
    scene.add(new THREE.HemisphereLight(0xe6eeff, 0x2a1d14, 0.95));
    var key = new THREE.DirectionalLight(0xfff2de, 1.35); key.position.set(2.2, 4.5, 3.2); scene.add(key);
    var rim = new THREE.DirectionalLight(0x8cc8ff, 0.6); rim.position.set(-3, 2.5, -3); scene.add(rim);

    makeMaterials();
    P.bench = block(1.9, 0.06, 1.45, 0.04, M.wood); P.bench.position.y = -0.06; scene.add(P.bench);
    P.battery = battery("12 V", "KEKE BATTERY");
    P.driver = battery("24 V", "DRIVER (2 × 12 V)");
    P.key = plugKey();
    P.rheostat = rheostat();
    P.ammeter = meter("A");
    P.voltmeter = meter("V");
    P.galv = meter("G");
    P.wire = wireBoard();
    P.lamp = lamp();
    P.board = potBoard();
    P.jockey = jockey();
    ["battery", "driver", "key", "rheostat", "ammeter", "voltmeter", "galv", "wire", "lamp", "board", "jockey"].forEach(function (k) {
      scene.add(P[k]);
      // own material copies, so a highlight glows on this part only
      P[k].traverse(function (o) {
        if (o.isMesh) { o.material = o.material.clone(); o.userData.pk = k; }
      });
    });
    // the lamp filament keeps the shared material so setGlow reaches it
    P.lamp.traverse(function (o) { if (o.isMesh && o.geometry && o.geometry.type === "TubeGeometry") o.material = M.filament; });

    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY, yaw: view.yaw, drag: false }; view.lastTouch = performance.now(); });
    canvas.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.drag && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) down.drag = true;
      if (down.drag) { view.yaw = Math.max(-0.8, Math.min(0.8, down.yaw - dx * 0.008)); view.lastTouch = performance.now(); }
    });
    function up(e) {
      if (!down) return;
      var wasDrag = down.drag || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8;
      down = null;
      if (!wasDrag && e.type === "pointerup") pickAt(e);
    }
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", function () { if (down && down.drag) down = null; });

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
    window.addEventListener("resize", resize);
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
    requestAnimationFrame(frame);
  }

  /* ---- framing ---- */
  var fitBox = null;
  function refit() {
    var box = new THREE.Box3();
    scene.updateMatrixWorld(true);
    Object.keys(P).forEach(function (k) { if (P[k].visible && k !== "bench") box.expandByObject(P[k]); });
    if (leadGroup) box.expandByObject(leadGroup);
    if (box.isEmpty()) return;
    fitBox = box; resize();
  }
  function resize() {
    if (!renderer) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (!fitBox) return;
    var size = fitBox.getSize(new THREE.Vector3()), c = fitBox.getCenter(new THREE.Vector3());
    var vFov = THREE.MathUtils.degToRad(camera.fov), hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    var projH = size.y * Math.cos(view.pitch) + size.z * Math.sin(view.pitch);
    var dH = (projH / 2 + 0.04) / Math.tan(vFov / 2), dW = (size.x / 2 + 0.03) / Math.tan(hFov / 2);
    view.dist = Math.max(dH, dW) * 1.04 + size.z * 0.25;
    view.target.copy(c); view.target.y -= 0.02;
  }

  /* ---- picking: tap a part to name it ---- */
  var INFO = {
    battery: ["Keke battery", "Lead-acid, six 2 V cells in series. Its EMF is 12.0 V; its internal resistance is the hidden suspect."],
    driver: ["Driver battery", "Two 12 V batteries in series (24 V) push a steady current along the potentiometer wire."],
    key: ["Plug key", "Pull the brass plug out to open the circuit. Open it between readings so nothing heats up."],
    rheostat: ["Rheostat", "A sliding contact on a wire-wound tube. Slide it to change the resistance, and so the current."],
    ammeter: ["Ammeter", "Goes in series. It has a very low resistance and reads the current in amperes."],
    voltmeter: ["Voltmeter", "Goes in parallel. It has a very high resistance and reads the potential difference in volts."],
    galv: ["Centre-zero galvanometer", "Swings either way. At the balance point no current flows through it."],
    wire: ["Constantan test wire", "Its resistance stays 2.20 Ω at steady temperature, so it obeys Ohm's law."],
    lamp: ["Test load", "Nkechi's starter test load (relay and headlamp). Brighter means more power delivered."],
    board: ["Potentiometer wire", "A uniform 100 cm wire: the p.d. along it is proportional to the length."],
    jockey: ["Jockey", "Tap, never drag, its knife-edge on the wire to find the balance length."]
  };
  var ray = null, ndc = null;
  function pickAt(e) {
    if (!ray) { ray = new THREE.Raycaster(); ndc = new THREE.Vector2(); }
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    var objs = Object.keys(P).filter(function (k) { return k !== "bench" && P[k].visible; }).map(function (k) { return P[k]; });
    var hit = ray.intersectObjects(objs, true).filter(function (h) { return h.object.userData.pk; })[0];
    if (!hit) return;
    var k = hit.object.userData.pk, inf = INFO[k]; if (!inf) return;
    state.picked = k;
    toast("<b>" + inf[0] + "</b><span class=\"mono\">" + inf[1] + "</span>");
    glow(k);
    emit({ mode: state.mode, part: k, name: inf[0] });
  }

  /* ---- highlight: emissive pulse on one part ---- */
  function glow(part) {
    if (hi && hi.part === part) return;
    if (hi) hi.mats.forEach(function (m) { m.mat.emissive.setHex(m.e); m.mat.emissiveIntensity = m.i; });
    hi = null;
    if (!part || !P[part]) return;
    var mats = [];
    P[part].traverse(function (o) {
      if (o.isMesh && o.material && o.material.emissive && o.material !== M.filament && o.material !== M.charge) mats.push({ mat: o.material, e: o.material.emissive.getHex(), i: o.material.emissiveIntensity });
    });
    hi = { part: part, mats: mats };
  }

  /* ======================= modes & controls ======================= */
  var SHOW = {
    ohms: ["battery", "key", "rheostat", "ammeter", "voltmeter", "wire"],
    ir: ["battery", "key", "ammeter", "voltmeter", "lamp"],
    null: ["driver", "key", "rheostat", "board", "battery", "galv", "jockey"]
  };
  var LEGEND = {
    ohms: '<span><i class="sw sw-charge"></i>Moving charge</span><span><i class="sw sw-v"></i>Voltmeter leads</span>',
    ir: '<span><i class="sw sw-charge"></i>Moving charge</span><span><i class="sw sw-v"></i>Voltmeter across the battery</span>',
    null: '<span><i class="sw sw-charge"></i>Driver current</span><span><i class="sw sw-v"></i>Test branch</span>'
  };

  function setMode(m, fromLearner) {
    if (!SHOW[m]) return;
    state.mode = m;
    modeTabs.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m ? "true" : "false"); });
    ctrls.forEach(function (c) { c.hidden = c.getAttribute("data-for") !== m; });
    if (ui.legend) ui.legend.innerHTML = LEGEND[m];
    if (ui.mini) ui.mini.hidden = m !== "ir";
    if (ui.toast) ui.toast.classList.remove("show");
    if (gl) {
      Object.keys(P).forEach(function (k) { if (k !== "bench") P[k].visible = SHOW[m].indexOf(k) >= 0; });
      var L = LAYOUT[m];
      Object.keys(L).forEach(function (k) { if (P[k]) P[k].position.set(L[k][0], L[k][1], L[k][2]); });
      if (P.bench) P.bench.position.y = -0.06;
      P.rheostat.rotation.y = 0;
      glow(null);
      if (m === "null") placeJockey();
      buildLeads(m);
      refit();
    }
    if (m === "ohms") setR(state.R, false);
    else if (m === "ir") { setKey(state.open, false); }
    else setJockey(state.l, false);
    if (fromLearner) emit({ mode: m, switched: true });
  }

  function setR(R, fromLearner) {
    R = Math.max(2, Math.min(30, Math.round(R)));
    state.R = R;
    if (state.mode !== "ohms") setMode("ohms", false);
    var o = ohms(R);
    if (ui.rSlide) ui.rSlide.value = R;
    if (ui.rOut) ui.rOut.textContent = R + " Ω";
    hud([["Rheostat R", R + " Ω"], ["Current I", f(o.I, 2) + " A"], ["Wire p.d. V", f(o.V, 2) + " V"], ["V ÷ I", f(o.ratio, 2) + " Ω"]]);
    ui.info.innerHTML = "Slide the rheostat. <b>I</b> and <b>V</b> both change, but <b>V ÷ I = " + f(o.ratio, 2) + " Ω</b> every time: the constantan wire obeys Ohm's law. <span class=\"lab-tag\">" + Object.keys(state.readings).length + " readings</span>";
    if (gl) { P.ammeter.userData.set(o.I / 5); P.voltmeter.userData.set(o.V / 15); P.rheostat.userData.setFrac((R - 2) / 28); P.key.userData.setOpen(false); }
    state.current = o.I;
    if (fromLearner) takeReading(true);
  }
  function takeReading(fromLearner) {
    if (state.mode !== "ohms") return;
    var o = ohms(state.R);
    state.readings[state.R] = true;
    var n = Object.keys(state.readings).length;
    setR(state.R, false);
    toast("<b>R = " + state.R + " Ω</b><span class=\"mono\">I = " + f(o.I, 2) + " A · V = " + f(o.V, 2) + " V · V/I = " + f(o.ratio, 2) + " Ω</span>");
    if (fromLearner) emit({ mode: "ohms", R: state.R, I: +f(o.I, 2), V: +f(o.V, 2), ratio: +f(o.ratio, 2), count: n });
  }

  function setKey(open, fromLearner) {
    state.open = !!open;
    if (state.mode !== "ir") setMode("ir", false);
    var o = terminal(state.open, state.load);
    if (ui.keyBtn) { ui.keyBtn.textContent = state.open ? "Close the key" : "Open the key"; ui.keyBtn.setAttribute("aria-pressed", state.open ? "false" : "true"); }
    labRoot.querySelectorAll("[data-load]").forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-load") === state.load ? "true" : "false"); });
    hud([["Key", state.open ? "open" : "closed"], ["Current I", f(o.I, 2) + " A"], ["Terminal V", f(o.V, 1) + " V"], ["Lost volts Ir", f(o.lost, 1) + " V"]]);
    if (state.open) ui.info.innerHTML = "Key <b>open</b>: no current, no lost volts, so the voltmeter shows the EMF, <b>E = 12.0 V</b>. Now close the key.";
    else ui.info.innerHTML = "Key <b>closed</b> on the " + LOADS[String(state.load)] + " (" + state.load + " Ω): <b>I = " + f(o.I, 2) + " A</b>, and <b>Ir = " + f(o.lost, 1) + " V</b> is spent inside the battery, so <b>V = E − Ir = " + f(o.V, 1) + " V</b>.";
    if (gl) {
      P.key.userData.setOpen(state.open);
      P.ammeter.userData.set(o.I / 5); P.voltmeter.userData.set(o.V / 15);
      P.lamp.userData.setGlow(state.open ? 0 : Math.min(1, (o.V * o.V / state.load) / 26));
    }
    state.current = o.I;
    if (!state.open) state.irPts[state.load] = o;
    drawMini(o);
    if (fromLearner) {
      toast(state.open ? "<b>V = 12.0 V</b><span class=\"mono\">open circuit: the EMF</span>" : "<b>V = " + f(o.V, 1) + " V</b><span class=\"mono\">I = " + f(o.I, 2) + " A · lost volts " + f(o.lost, 1) + " V</span>");
      emit({ mode: "ir", open: state.open, R: state.load, I: +f(o.I, 2), V: +f(o.V, 1), lost: +f(o.lost, 1), count: Object.keys(state.irPts).length });
    }
  }
  function setLoad(R, fromLearner) {
    if (!LOADS[String(R)]) return;
    state.load = R;
    setKey(false, fromLearner);
  }
  // mini V–I plot: V 0–13 V (vertical) against I 0–4 A, the line V = 12.0 − 1.2 I
  function drawMini(now) {
    if (!ui.miniPts) return;
    var X = function (I) { return 22 + I / 4 * 100; }, Y = function (V) { return 74 - V / 13 * 64; };
    var html = "";
    Object.keys(state.irPts).forEach(function (k) { var o = state.irPts[k]; html += '<circle cx="' + X(o.I).toFixed(1) + '" cy="' + Y(o.V).toFixed(1) + '" r="2.6"></circle>'; });
    ui.miniPts.innerHTML = html;
    if (ui.miniNow) { ui.miniNow.setAttribute("cx", X(now.I).toFixed(1)); ui.miniNow.setAttribute("cy", Y(now.V).toFixed(1)); }
  }

  function placeJockey() {
    if (!gl) return;
    var L = LAYOUT.null;
    P.jockey.position.set(L.board[0] + P.board.userData.xAt(state.l), L.jockey[1], L.jockey[2]);
  }
  function setJockey(l, fromLearner) {
    l = Math.max(0, Math.min(100, Math.round(l * 2) / 2));
    state.l = l;
    if (state.mode !== "null") setMode("null", false);
    var o = pot(l);
    if (ui.jSlide) ui.jSlide.value = l;
    if (ui.jOut) ui.jOut.textContent = f(l, 1) + " cm";
    var dir = o.balanced ? "no deflection (null)" : o.diff > 0 ? "swings right" : "swings left";
    hud([["Jockey at l", f(l, 1) + " cm"], ["Wire p.d. kl", f(o.Vw, 2) + " V"], ["Galvanometer", o.balanced ? "null" : (o.diff > 0 ? "right" : "left")], ["Battery EMF", o.balanced ? "12.0 V" : "—"]]);
    ui.info.innerHTML = o.balanced
      ? "<b>Balanced at 80.0 cm.</b> No current flows from the keke battery, so there are no lost volts: <b>E = kl = 0.150 × 80.0 = 12.0 V</b>. The EMF is unchanged; the fault must be inside."
      : "The galvanometer " + dir + ": the wire's p.d. up to the jockey (" + f(o.Vw, 2) + " V) is " + (o.diff > 0 ? "less" : "more") + " than the battery's EMF. Move the jockey " + (o.diff > 0 ? "further along" : "back") + ".";
    if (gl) {
      P.key.userData.setOpen(false);
      placeJockey();
      P.galv.userData.set(Math.max(-1, Math.min(1, o.diff / 3)));
      if (state.jockeyLead) { buildLeads("null"); }
    }
    state.current = Math.abs(o.diff) / 4;
    var was = state.balanced; state.balanced = o.balanced;
    if (fromLearner) {
      if (o.balanced && !was) toast("<b>Null point: 80.0 cm</b><span class=\"mono\">E = 0.150 × 80.0 = 12.0 V</span>");
      emit({ mode: "null", l: l, Vw: +f(o.Vw, 2), balanced: o.balanced });
    }
  }

  /* ======================= frame loop ======================= */
  var clock = typeof THREE !== "undefined" ? new THREE.Clock() : null;
  function frame() {
    requestAnimationFrame(frame);
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (!visible || document.hidden) return;
    ["ammeter", "voltmeter", "galv"].forEach(function (k) { if (P[k].visible) P[k].userData.tick(reduceMotion ? 1 : dt); });
    // moving charge: speed follows the current
    var Imain = state.mode === "ohms" ? state.current : state.mode === "ir" ? (state.open ? 0 : state.current) : 1.0;
    flows.forEach(function (fl) {
      var I = fl.branch === "test" ? (state.balanced ? 0 : state.current) : Imain;
      var on = I > 0.001;
      fl.dots.forEach(function (d) {
        d.visible = on;
        if (!on) return;
        if (!reduceMotion) d.userData.u = (d.userData.u + dt * (0.08 + I * 0.12)) % 1;
        fl.curve.getPointAt(d.userData.u, d.position);
      });
    });
    if (hi) {
      var s = 0.35 + 0.35 * Math.sin(t * 5);
      hi.mats.forEach(function (m) { m.mat.emissive.setHex(0xffb23f); m.mat.emissiveIntensity = s; });
    }
    if (!reduceMotion && performance.now() - view.lastTouch > 4000) view.yaw += (Math.sin(t * 0.22) * 0.22 - view.yaw) * Math.min(1, dt * 0.6);
    var d = view.dist, T = view.target;
    camera.position.set(T.x + Math.sin(view.yaw) * Math.cos(view.pitch) * d, T.y + Math.sin(view.pitch) * d, T.z + Math.cos(view.yaw) * Math.cos(view.pitch) * d);
    camera.lookAt(T);
    renderer.render(scene, camera);
  }

  /* ======================= narrator hooks ======================= */
  var MODE_OF = { wire: "ohms", rheostat: null, lamp: "ir", driver: "null", board: "null", jockey: "null", galv: "null" };
  function rect(part) {
    var cr = canvas.getBoundingClientRect();
    var whole = { left: cr.left, top: cr.top, width: cr.width, height: cr.height };
    if (!gl || !part || !P[part] || !P[part].visible) return whole;
    var b = new THREE.Box3().setFromObject(P[part]);
    if (b.isEmpty()) return whole;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, v = new THREE.Vector3();
    for (var i = 0; i < 8; i++) {
      v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera);
      var x = cr.left + (v.x * 0.5 + 0.5) * cr.width, y = cr.top + (-v.y * 0.5 + 0.5) * cr.height;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    minX = Math.max(cr.left, minX - 8); minY = Math.max(cr.top, minY - 8);
    maxX = Math.min(cr.right, maxX + 8); maxY = Math.min(cr.bottom, maxY + 8);
    if (maxX - minX < 44) { var cx = (minX + maxX) / 2; minX = cx - 22; maxX = cx + 22; }
    if (maxY - minY < 44) { var cy = (minY + maxY) / 2; minY = cy - 22; maxY = cy + 22; }
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
  }
  function highlight(part) {
    if (!part) { glow(null); return; }
    if (part === "ohms" || part === "ir" || part === "null") { if (state.mode !== part) setMode(part, false); glow(null); return; }
    var m = MODE_OF[part];
    if (m && m !== state.mode) setMode(m, false);
    if (gl && P[part] && P[part].visible) glow(part); else glow(null);
  }

  window.StudyLab = {
    rect: rect,
    highlight: highlight,
    setMode: function (m) { setMode(m, false); },
    setR: function (r) { setR(r, false); },
    key: function (open) { setKey(open, false); },
    load: function (r) { state.load = r; setKey(false, false); },
    jockey: function (l) { setJockey(l, false); },
    state: function () { return { mode: state.mode, R: state.R, open: state.open, load: state.load, l: state.l, balanced: state.balanced, readings: Object.keys(state.readings).length, phase: "run" }; },
    reset: function () { state.readings = {}; state.irPts = {}; state.R = 10; state.open = true; state.load = 2.8; state.l = 50; state.balanced = false; setMode("ohms", false); },
    openTapFor: function () {}
  };

  if (gl) {
    try { build3D(); } catch (err) { gl = false; if (window.console) console.warn("StudyLab: 3D disabled", err); }
  }
  if (!gl && ui.fallback) { ui.fallback.hidden = false; canvas.style.visibility = "hidden"; }

  setMode("ohms", false);
})();
