/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab · Simple Harmonic Motion
   One live stage, three rigs (02-lesson.md Part I § 1):
     spring    helical spiral spring (CatmullRomCurve3 helix + TubeGeometry, pitch stretches with load)
               on a retort stand, slotted-mass hanger (extruded discs with a real slot), pointer
               and vertical metre rule.  x0 = mg/k, T = 2π√(m/k).
     pendulum  split cork (two extruded half-cylinders) gripped in a clamp, thread, brass / wooden bob
               with a centre band, rest marker, stopwatch with a live display. Exact large-angle
               motion (RK4 on θ'' = −(g/l) sin θ); times 5 oscillations from the rest mark, counting "zero".
     ridge     okada on Ridge Road: spoked wheels, frame, tank, seat, twin rear coil-over shocks,
               carrier with an egg crate, concrete drainage ridges 2.5 m apart on laterite.
               Story model: m 200 / 250 kg, k = 3.16 × 10⁴ N m⁻¹, ζ 0.30 healthy / 0.05 leaking,
               Y = 1.0 cm, A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²), r = f/f0, f = v/d.
               Lift-off when A ≥ g/ω² with the DRIVING ω = 2πf; the crate is simulated as a free body
               that leaves the carrier when the carrier accelerates downwards faster than g.
   Exposes window.StudyLab for StudyNarrator:
     rect(part) · highlight(part) · setMode(m) · state() · reset()
     spring:   setMass(kg) · setK(Npm) · release()
     pendulum: setLength(m) · setG(9.8|1.6) · setBob(50|100) · setAngle(deg) · time()
     ridge:    setSpeed(kmh) · setLoad(200|250) · setDamper("healthy"|"leaking")
   Parts: spring, hanger, pointer, ruler, stand · cork, thread, bob, marker, stopwatch ·
          okada, rear-shock, carrier, crate, ridges.
   Emits CustomEvent "lab:result" { mode, ... } after every learner action.
   Classic script, no modules, fully offline. Needs three.min.js + scene-kit.js before it.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("lab-canvas");
  var labRoot = document.getElementById("lab");
  if (!canvas || !labRoot) return;

  var $ = function (id) { return document.getElementById(id); };
  var ui = { info: $("lab-info"), toast: $("endpoint-toast"), fallback: $("lab-fallback") };
  var K = [1, 2, 3, 4].map(function (i) { return { k: $("hud-k" + i), v: $("hud-v" + i) }; });

  /* ======================= physics models ======================= */
  var G_EARTH = 9.8;
  // f0 = 2.00 Hz exactly for 200 kg: k = 4π²·2.00²·200 ≈ 31 583 N m⁻¹ (labelled 3.16 × 10⁴)
  var STORY = { k: 4 * Math.PI * Math.PI * 2.00 * 2.00 * 200, d: 2.5, Y: 0.010, zeta: { healthy: 0.30, leaking: 0.05 } };

  function springModel(m, k) {
    var w = Math.sqrt(k / m), T = 2 * Math.PI / w;
    return { m: m, k: k, x0: m * G_EARTH / k, w: w, T: T, f: 1 / T };
  }
  function pendulumFormula(l, g) { return 2 * Math.PI * Math.sqrt(l / g); }
  function ridgeModel(kmh, mass, damper) {
    var v = kmh / 3.6, f = v / STORY.d, w0 = Math.sqrt(STORY.k / mass), f0 = w0 / (2 * Math.PI);
    var z = STORY.zeta[damper] || 0.05, r = f / f0;
    var A = STORY.Y * Math.sqrt(1 + Math.pow(2 * z * r, 2)) / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * z * r, 2));
    var wd = 2 * Math.PI * f, th = wd > 0 ? G_EARTH / (wd * wd) : Infinity;
    var phase = Math.atan2(2 * z * r * r * r, 1 - r * r + Math.pow(2 * z * r, 2));
    return { kmh: kmh, v: v, f: f, f0: f0, w0: w0, zeta: z, r: r, A: A, th: th, lift: A >= th, phase: phase, mass: mass, damper: damper };
  }

  var state = {
    mode: "spring",
    spring: { m: 0.20, k: 24.5, amp: 0.025, t0: 0 },
    pend: { l: 0.80, g: 9.8, bob: 100, angle: 10, th: 0, om: 0, running: false, timing: false, t: 0, n: 0, lastSign: 0, startDir: 0, done: null },
    ridge: { kmh: 10, mass: 200, damper: "leaking", s: 0, Acur: 0, crate: { y: 0, v: 0, on: true }, cracks: 0, lastCrack: -9 }
  };

  function fx(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); }
  function emit(detail) { document.dispatchEvent(new CustomEvent("lab:result", { detail: detail })); }
  function hud(rows) { rows.forEach(function (r, i) { if (K[i] && K[i].k) { K[i].k.textContent = r[0]; K[i].v.textContent = r[1]; } }); }
  function info(html) { if (ui.info) ui.info.innerHTML = html; }
  var toastTimer = null;
  function toast(html, bad) {
    if (!ui.toast) return;
    ui.toast.innerHTML = html;
    ui.toast.classList.toggle("is-bad", !!bad);
    ui.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast.classList.remove("show"); }, 3600);
  }

  /* ======================= UI wiring (works without WebGL) ======================= */
  var modeTabs = labRoot.querySelectorAll(".lab-modes [data-mode]");
  var ctrls = labRoot.querySelectorAll(".lab-ctrl");
  modeTabs.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode"), true); }); });

  function bindRange(id, outId, fmt, onInput, onChange) {
    var el = $(id), out = $(outId);
    if (!el) return null;
    function show() { if (out) out.textContent = fmt(+el.value); }
    el.addEventListener("input", function () { show(); onInput(+el.value); });
    el.addEventListener("change", function () { onChange(+el.value); });
    show();
    return { el: el, set: function (v) { el.value = v; show(); } };
  }
  var R = {
    m: bindRange("lab-m", "lab-m-out", function (v) { return fx(v, 2) + " kg"; }, function (v) { setMass(v, false); }, function (v) { setMass(v, true); }),
    k: bindRange("lab-k", "lab-k-out", function (v) { return fx(v, 1) + " N/m"; }, function (v) { setK(v, false); }, function (v) { setK(v, true); }),
    l: bindRange("lab-l", "lab-l-out", function (v) { return fx(v, 2) + " m"; }, function (v) { setLength(v, false); }, function (v) { setLength(v, true); }),
    a: bindRange("lab-a", "lab-a-out", function (v) { return fx(v, 0) + "°"; }, function (v) { setAngle(v, false); }, function (v) { setAngle(v, true); }),
    v: bindRange("lab-v", "lab-v-out", function (v) { return fx(v, 0) + " km/h"; }, function (v) { setSpeed(v, false); }, function (v) { setSpeed(v, true); })
  };
  function pressGroup(attr, handler) {
    labRoot.querySelectorAll("[" + attr + "]").forEach(function (b) {
      b.addEventListener("click", function () { handler(b.getAttribute(attr), true); });
    });
  }
  function markPressed(attr, val) {
    labRoot.querySelectorAll("[" + attr + "]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute(attr) === String(val) ? "true" : "false"); });
  }
  pressGroup("data-g", function (v, l) { setG(+v, l); });
  pressGroup("data-bob", function (v, l) { setBob(+v, l); });
  pressGroup("data-load", function (v, l) { setLoad(+v, l); });
  pressGroup("data-damper", function (v, l) { setDamper(v, l); });
  if ($("lab-release")) $("lab-release").addEventListener("click", function () { release(true); });
  if ($("lab-time")) $("lab-time").addEventListener("click", function () { timePendulum(true); });

  /* ======================= 3D ======================= */
  var gl = typeof THREE !== "undefined" && window.SceneKit && SceneKit.hasWebGL();
  var stage = null, P = {}, RIG = {}, M = {}, hi = null;
  var dyn = {};          // live geometry handles

  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.6 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function canvasTex(w, h, draw, rx, ry) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if ("colorSpace" in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace; else if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    if (rx || ry) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); }
    t.userData = { canvas: c };
    return t;
  }
  function grain(g, w, h, base, dark, n, seed, vertical) {
    var r = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var i = 0; i < n; i++) {
      g.strokeStyle = dark; g.globalAlpha = 0.08 + r() * 0.22; g.lineWidth = 0.6 + r() * 2.2;
      var p = r() * (vertical ? w : h), a = r() * 6;
      g.beginPath();
      for (var q = 0; q <= (vertical ? h : w); q += 12) {
        var off = Math.sin(q * 0.013 + a) * 4 + Math.sin(q * 0.05 + a * 2) * 1.2;
        if (vertical) { if (!q) g.moveTo(p + off, q); else g.lineTo(p + off, q); } else { if (!q) g.moveTo(q, p + off); else g.lineTo(q, p + off); }
      }
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  function speckle(g, w, h, base, cols, n, seed, size) {
    var r = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var i = 0; i < n; i++) {
      g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = 0.25 + r() * 0.6;
      var s = (size || 2) * (0.4 + r());
      g.beginPath(); g.arc(r() * w, r() * h, s, 0, 6.283); g.fill();
    }
    g.globalAlpha = 1;
  }

  function makeMaterials() {
    M.bench = std(0xffffff, 0.75, 0, { map: canvasTex(512, 256, function (g, w, h) { grain(g, w, h, "#8a5a33", "#3d2312", 70, 7); }, 2, 1) });
    M.steel = std(0xc8ced8, 0.28, 0.9);
    M.darkSteel = std(0x3a3f48, 0.45, 0.7);
    M.paint = std(0x1f3550, 0.55, 0.3);
    M.springSteel = std(0xb8bec9, 0.25, 0.95);
    M.brass = std(0xc9a14a, 0.3, 0.9);
    M.blackPlastic = std(0x16181d, 0.5, 0.1);
    M.thread = std(0xf2efe6, 0.9, 0);
    M.cork = std(0xffffff, 0.95, 0, { map: canvasTex(128, 128, function (g, w, h) { speckle(g, w, h, "#b98b55", ["#7a5530", "#d9b27e", "#5d3e20"], 520, 3, 1.6); }) });
    M.wood = std(0xffffff, 0.7, 0, { map: canvasTex(256, 128, function (g, w, h) { grain(g, w, h, "#a8743f", "#4a2a12", 46, 11); }) });
    M.chalk = std(0xf7f5ee, 0.95, 0);
    M.rule = std(0xffffff, 0.6, 0, { map: ruleTexture() });
    M.pointer = std(0xd22e56, 0.4, 0.2);
    M.laterite = std(0xffffff, 0.95, 0, { map: canvasTex(512, 256, function (g, w, h) { speckle(g, w, h, "#9c4a22", ["#6e2e12", "#c06a3a", "#7d3a1a", "#b8794a"], 2600, 21, 2.2); }, 3, 1) });
    M.concrete = std(0xffffff, 0.9, 0, { map: canvasTex(256, 128, function (g, w, h) { speckle(g, w, h, "#9a9a92", ["#6f6f69", "#c1c1b8", "#85857d"], 900, 5, 1.4); }) });
    M.grass = std(0x3d6b2a, 1, 0);
    M.tyre = std(0x111214, 0.85, 0);
    M.chrome = std(0xe4e8ee, 0.15, 1);
    M.redPaint = std(0xa3141f, 0.35, 0.35);
    M.seat = std(0x1a1a1c, 0.7, 0.05);
    M.engine = std(0x5b616b, 0.5, 0.6);
    M.springRed = std(0xd23a1d, 0.4, 0.5);
    M.oil = std(0x2a1a0a, 0.2, 0.1);
    M.crate = std(0xffffff, 0.8, 0, { map: canvasTex(256, 64, function (g, w, h) { grain(g, w, h, "#c89a5c", "#6a4320", 26, 31); }) });
    M.tray = std(0xd8cdb4, 0.95, 0);
    M.egg = std(0xf1e2c6, 0.6, 0);
    M.glass = std(0xdfe8f0, 0.05, 0, { transparent: true, opacity: 0.35 });
  }

  function ruleTexture() {
    return canvasTex(96, 2048, function (g, w, h) {
      g.fillStyle = "#f4ead0"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#1b1813"; g.font = "bold 26px sans-serif"; g.textAlign = "left";
      for (var mm = 0; mm <= 1000; mm += 5) {
        var y = 24 + mm / 1000 * (h - 48);
        var len = mm % 100 === 0 ? 52 : mm % 50 === 0 ? 38 : mm % 10 === 0 ? 26 : 14;
        g.fillRect(0, y - 1, len, mm % 10 === 0 ? 3 : 2);
        if (mm % 100 === 0) g.fillText(String(mm / 10), 56, y + 9);
      }
    });
  }

  /* ---------- geometry helpers ---------- */
  function roundedRect(w, d, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function slab(w, h, d, r, mat) {      // rounded, bevelled block (extruded along y)
    var g = new THREE.ExtrudeGeometry(roundedRect(w, d, r), { depth: h, bevelEnabled: true, bevelThickness: Math.min(0.004, h / 4), bevelSize: Math.min(0.004, r / 2), bevelSegments: 2, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(0, 0, 0);
    return new THREE.Mesh(g, mat);
  }
  function tube(points, r, mat, seg, closed) {
    var c = new THREE.CatmullRomCurve3(points, !!closed, "catmullrom", 0.2);
    return new THREE.Mesh(new THREE.TubeGeometry(c, seg || 40, r, 10, !!closed), mat);
  }
  function rod(a, b, r, mat, seg) {
    var dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg || 12), mat);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return m;
  }
  function v3(x, y, z) { return new THREE.Vector3(x, y, z || 0); }

  /* helix: top at y = 0, hanging down by `len`; hook loops at both ends */
  function helixPoints(radius, turns, len, wire) {
    var pts = [], N = Math.round(turns * 14), lead = 0.012;
    pts.push(v3(0, lead + 0.006, 0), v3(0, lead, 0), v3(radius * 0.6, lead * 0.35, 0));
    var coil = Math.max(len - 0.004, turns * wire * 2.05);
    for (var i = 0; i <= N; i++) {
      var u = i / N, a = u * turns * Math.PI * 2;
      pts.push(v3(Math.cos(a) * radius, -u * coil, Math.sin(a) * radius));
    }
    pts.push(v3(radius * 0.6, -coil - lead * 0.35, 0), v3(0, -coil - lead, 0), v3(0, -coil - lead - 0.006, 0));
    return { pts: pts, total: coil + lead * 2, bottom: coil + lead + 0.006 };
  }
  function helixGeometry(radius, turns, len, wire, segs) {
    var h = helixPoints(radius, turns, len, wire);
    var curve = new THREE.CatmullRomCurve3(h.pts, false, "centripetal");
    var g = new THREE.TubeGeometry(curve, segs || Math.round(turns * 16), wire, 6, false);
    g.userData = { total: h.total, bottom: h.bottom };
    return g;
  }

  /* ---------- shared: retort stand ---------- */
  function retortStand(height) {
    var g = new THREE.Group();
    var base = slab(0.34, 0.022, 0.2, 0.025, M.paint); base.position.set(0.04, 0, 0); g.add(base);
    var rodM = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, height, 18), M.steel);
    rodM.position.set(-0.08, height / 2 + 0.02, 0); g.add(rodM);
    var cap = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 12, 8), M.steel); cap.position.set(-0.08, height + 0.02, 0); g.add(cap);
    // threaded foot boss
    var foot = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.03, 18), M.darkSteel); foot.position.set(-0.08, 0.035, 0); g.add(foot);
    return g;
  }
  function bossHead(y, armLen) {      // boss head + clamp arm reaching +x from the rod
    var g = new THREE.Group();
    var boss = slab(0.034, 0.03, 0.03, 0.006, M.darkSteel); boss.position.set(-0.08, y - 0.015, 0); g.add(boss);
    var screw = rod(v3(-0.08, y, 0.015), v3(-0.08, y, 0.045), 0.0035, M.steel); g.add(screw);
    var knob = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 14), M.blackPlastic); knob.rotation.x = Math.PI / 2; knob.position.set(-0.08, y, 0.05); g.add(knob);
    var arm = rod(v3(-0.065, y, 0), v3(-0.065 + armLen, y, 0), 0.0055, M.steel); g.add(arm);
    return g;
  }

  /* ======================= rig 1: loaded spiral spring ======================= */
  var SP = { top: 1.02, r: 0.017, turns: 22, wire: 0.0017, L0: 0.10, hangerLen: 0.10 };
  function buildSpringRig() {
    var rig = new THREE.Group(); rig.name = "spring-rig";
    var stand = retortStand(1.08); rig.add(stand);
    stand.add(bossHead(SP.top + 0.01, 0.17));
    // hook at the clamp end
    var hook = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0014, 8, 18, Math.PI * 1.4), M.steel);
    hook.position.set(0.1, SP.top + 0.002, 0); hook.rotation.z = Math.PI * 0.8; stand.add(hook);
    P.stand = stand;

    // the spring (geometry rebuilt as it stretches)
    var spring = new THREE.Mesh(helixGeometry(SP.r, SP.turns, SP.L0, SP.wire), M.springSteel);
    spring.position.set(0.1, SP.top - 0.008, 0);
    var springG = new THREE.Group(); springG.add(spring); rig.add(springG);
    P.spring = springG; dyn.spring = spring;

    // hanger: hook, stem, base disc + slotted masses (extruded discs with a slot)
    var hanger = new THREE.Group();
    var hk = new THREE.Mesh(new THREE.TorusGeometry(0.007, 0.0015, 8, 18, Math.PI * 1.5), M.steel); hk.rotation.z = -Math.PI * 0.25; hk.position.y = -0.004; hanger.add(hk);
    var stem = rod(v3(0, -0.01, 0), v3(0, -SP.hangerLen, 0), 0.0028, M.steel); hanger.add(stem);
    var plate = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.006, 28), M.darkSteel); plate.position.y = -SP.hangerLen - 0.003; hanger.add(plate);
    // pointer (thin red needle) on the stem, pointing at the metre rule
    var ptr = new THREE.Group();
    var needle = rod(v3(0, 0, 0), v3(-0.14, 0, 0), 0.0016, M.pointer); ptr.add(needle);
    var tip = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.014, 10), M.pointer); tip.rotation.z = Math.PI / 2; tip.position.set(-0.145, 0, 0); ptr.add(tip);
    ptr.position.y = -0.03; hanger.add(ptr);
    P.pointer = ptr;
    var discGeo = slottedDiscGeometry(0.026, 0.0075);
    dyn.discs = [];
    for (var i = 0; i < 9; i++) {
      var d = new THREE.Mesh(discGeo, M.brass);
      d.position.y = -SP.hangerLen + 0.0005 + i * 0.008; d.rotation.y = i * 0.5;
      d.visible = false; hanger.add(d); dyn.discs.push(d);
    }
    hanger.position.set(0.1, SP.top - SP.L0, 0);
    rig.add(hanger); P.hanger = hanger; dyn.hanger = hanger;

    // vertical metre rule clamped beside the spring (0 cm at the top)
    var ruleG = new THREE.Group();
    var rule = new THREE.Mesh(new THREE.BoxGeometry(0.032, 1.0, 0.006), [M.wood, M.wood, M.wood, M.wood, M.rule, M.wood]);
    rule.position.set(-0.045, 0.535, -0.012); ruleG.add(rule);
    rig.add(ruleG); P.ruler = ruleG;
    // little clamp holding the rule
    var rc = slab(0.05, 0.02, 0.02, 0.004, M.darkSteel); rc.position.set(-0.045, 0.99, -0.02); rig.add(rc);

    rig.add(benchTop(0.9, 0.5));
    // frame the spring's whole travel (lightest load to 0.50 kg on 10 N/m), not the tall stand
    stand.userData.noFit = true; ruleG.userData.noFit = true; rc.userData.noFit = true;
    rig.add(fitHelper(-0.07, 0.14, 0.3, 1.06));
    return rig;
  }
  function slottedDiscGeometry(R, h) {
    var s = new THREE.Shape(), slot = 0.0042, a0 = Math.asin(slot / R);
    s.absarc(0, 0, R, a0, Math.PI * 2 - a0, false);
    s.lineTo(0.004, -slot); s.absarc(0.004, 0, slot, -Math.PI / 2, -Math.PI * 1.5, true); s.lineTo(R * Math.cos(a0), slot);
    var g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.0008, bevelSize: 0.0008, bevelSegments: 1, curveSegments: 28 });
    g.rotateX(-Math.PI / 2);
    return g;
  }
  function fitHelper(x0, x1, y0, y1) {   // invisible box that tells SceneKit what to frame
    var m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, 0.06), new THREE.MeshBasicMaterial({ visible: false }));
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0);
    return m;
  }
  function benchTop(w, d) {
    var b = slab(w, 0.04, d, 0.02, M.bench); b.position.y = -0.045; b.userData.noFit = true;
    return b;
  }

  /* ======================= rig 2: simple pendulum ======================= */
  var PD = { pivotY: 1.42, x: 0.12 };
  function buildPendulumRig() {
    var rig = new THREE.Group(); rig.name = "pendulum-rig";
    var stand = retortStand(1.52); rig.add(stand);
    stand.add(bossHead(PD.pivotY + 0.022, 0.17));
    // clamp jaws gripping the split cork
    var cork = new THREE.Group();
    var half = new THREE.Shape(); half.absarc(0, 0, 0.011, -Math.PI / 2, Math.PI / 2, false); half.lineTo(0, -0.011);
    var hg = new THREE.ExtrudeGeometry(half, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.001, bevelSegments: 2, curveSegments: 16 });
    hg.rotateX(Math.PI / 2); hg.translate(0, 0.04, 0);
    var c1 = new THREE.Mesh(hg, M.cork); c1.position.x = 0.0007;
    var c2 = new THREE.Mesh(hg, M.cork); c2.rotation.y = Math.PI; c2.position.x = -0.0007;
    cork.add(c1, c2);
    var jawGeo = new THREE.BoxGeometry(0.006, 0.026, 0.026);
    var j1 = new THREE.Mesh(jawGeo, M.darkSteel); j1.position.set(0.0145, 0.022, 0); cork.add(j1);
    var j2 = new THREE.Mesh(jawGeo, M.darkSteel); j2.position.set(-0.0145, 0.022, 0); cork.add(j2);
    var screw = rod(v3(0.017, 0.022, 0), v3(0.04, 0.022, 0), 0.0025, M.steel); cork.add(screw);
    cork.position.set(PD.x, PD.pivotY, 0); rig.add(cork); P.cork = cork;

    // swinging part: thread + bob hang from the cork's lower edge
    var pivot = new THREE.Group(); pivot.position.set(PD.x, PD.pivotY, 0); rig.add(pivot);
    var thread = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 1, 6), M.thread);
    pivot.add(thread); P.thread = thread;
    var bobG = new THREE.Group();
    var prof = [];
    for (var i = 0; i <= 16; i++) { var a = -Math.PI / 2 + Math.PI * i / 16; prof.push(new THREE.Vector2(Math.max(0.0005, Math.cos(a) * 0.02), Math.sin(a) * 0.02)); }
    dyn.bobBrass = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), M.brass);
    dyn.bobWood = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), M.wood);
    var band = new THREE.Mesh(new THREE.TorusGeometry(0.0201, 0.0009, 6, 40), M.blackPlastic); band.rotation.x = Math.PI / 2;
    var eye = new THREE.Mesh(new THREE.TorusGeometry(0.004, 0.0011, 6, 14), M.steel); eye.position.y = 0.022;
    bobG.add(dyn.bobBrass, dyn.bobWood, band, eye);
    pivot.add(bobG); P.bob = bobG;
    dyn.pivot = pivot; dyn.thread = thread; dyn.bob = bobG;

    // rest marker: a pin on a small stand behind the rest position, with a chalk tip
    var marker = new THREE.Group();
    var mb = slab(0.06, 0.01, 0.04, 0.006, M.darkSteel); marker.add(mb);
    dyn.markerPost = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 1, 8), M.steel); marker.add(dyn.markerPost);
    dyn.markerTip = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.03, 0.003), M.chalk); marker.add(dyn.markerTip);
    marker.position.set(PD.x, 0, -0.06); rig.add(marker); P.marker = marker;

    // stopwatch on the bench
    var sw = new THREE.Group();
    var swProf = [new THREE.Vector2(0.0005, -0.007), new THREE.Vector2(0.034, -0.007), new THREE.Vector2(0.038, -0.003), new THREE.Vector2(0.038, 0.003), new THREE.Vector2(0.034, 0.007), new THREE.Vector2(0.0005, 0.007)];
    var body = new THREE.Mesh(new THREE.LatheGeometry(swProf, 40), M.blackPlastic); body.rotation.x = Math.PI / 2; sw.add(body);
    var crown = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.012, 14), M.chrome); crown.position.y = 0.044; sw.add(crown);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0016, 6, 16), M.chrome); ring.position.y = 0.054; sw.add(ring);
    dyn.swTex = canvasTex(256, 128, drawWatch);
    var face = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.025), new THREE.MeshBasicMaterial({ map: dyn.swTex }));
    face.position.z = 0.0075; sw.add(face);
    sw.position.set(0.3, 0.035, 0.08); sw.rotation.x = -0.35; sw.rotation.y = -0.35; rig.add(sw); P.stopwatch = sw;

    rig.add(benchTop(0.95, 0.5));
    rig.add(fitHelper(-0.12, 0.36, 0.0, 1.5));     // widest swing at 1.20 m and 30°, plus the stopwatch
    return rig;
  }
  function drawWatch(g, w, h) {
    var p = state.pend;
    g.fillStyle = "#c9d6c1"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#18200f"; g.font = "bold 62px monospace"; g.textAlign = "center";
    g.fillText(fx(p.t, 2), w / 2, 74);
    g.font = "bold 24px monospace"; g.fillText("n = " + p.n + (p.timing ? "  RUN" : ""), w / 2, 112);
  }
  var lastWatch = "";
  function updateWatch() {
    if (!dyn.swTex) return;
    var key = fx(state.pend.t, 2) + "|" + state.pend.n + "|" + state.pend.timing;
    if (key === lastWatch) return;
    lastWatch = key;
    drawWatch(dyn.swTex.userData.canvas.getContext("2d"), 256, 128);
    dyn.swTex.needsUpdate = true;
  }

  /* ======================= rig 3: okada on Ridge Road ======================= */
  var OK = { rearX: -0.66, frontX: 0.66, wheelR: 0.3, ridgeH: 0.03, ridgeW: 0.36, roadLen: 10 };
  function wheel() {
    var g = new THREE.Group();
    var tyre = new THREE.Mesh(new THREE.TorusGeometry(OK.wheelR - 0.045, 0.045, 14, 48), M.tyre); g.add(tyre);
    var rim = new THREE.Mesh(new THREE.TorusGeometry(OK.wheelR - 0.085, 0.011, 8, 48), M.chrome); g.add(rim);
    var hubProf = [new THREE.Vector2(0.0005, -0.05), new THREE.Vector2(0.03, -0.05), new THREE.Vector2(0.045, -0.03), new THREE.Vector2(0.05, 0), new THREE.Vector2(0.045, 0.03), new THREE.Vector2(0.03, 0.05), new THREE.Vector2(0.0005, 0.05)];
    var hub = new THREE.Mesh(new THREE.LatheGeometry(hubProf, 20), M.engine); hub.rotation.x = Math.PI / 2; g.add(hub);
    for (var i = 0; i < 18; i++) {
      var a = i / 18 * Math.PI * 2, side = i % 2 ? 0.035 : -0.035;
      g.add(rod(v3(Math.cos(a) * 0.035, Math.sin(a) * 0.035, side), v3(Math.cos(a + 0.35) * (OK.wheelR - 0.09), Math.sin(a + 0.35) * (OK.wheelR - 0.09), 0), 0.0018, M.chrome, 5));
    }
    return g;
  }
  function buildRidgeRig() {
    var rig = new THREE.Group(); rig.name = "ridge-rig";
    // road, verges and moving ridges (not used for framing)
    var road = new THREE.Group(); road.userData.noFit = true;
    var lat = new THREE.Mesh(new THREE.PlaneGeometry(OK.roadLen, 2.2), M.laterite); lat.rotation.x = -Math.PI / 2; road.add(lat);
    dyn.roadTex = M.laterite.map;
    [-1.35, 1.35].forEach(function (z) { var v = new THREE.Mesh(new THREE.PlaneGeometry(OK.roadLen, 0.5), M.grass); v.rotation.x = -Math.PI / 2; v.position.set(0, -0.005, z); road.add(v); });
    rig.add(road);
    var prof = new THREE.Shape(), w = OK.ridgeW, H = OK.ridgeH;
    prof.moveTo(-w / 2, 0);
    for (var i = 0; i <= 16; i++) { var u = -w / 2 + w * i / 16; prof.lineTo(u, H * Math.pow(Math.cos(Math.PI * u / w), 2)); }
    prof.lineTo(w / 2, 0); prof.lineTo(-w / 2, 0);
    var rg = new THREE.ExtrudeGeometry(prof, { depth: 1.9, bevelEnabled: false });
    rg.translate(0, 0, -0.95);
    var ridges = new THREE.Group(); ridges.userData.noFit = true; dyn.ridges = [];
    for (var r = 0; r < 4; r++) { var m = new THREE.Mesh(rg, M.concrete); ridges.add(m); dyn.ridges.push(m); }
    rig.add(ridges); P.ridges = ridges;

    // the okada
    var okada = new THREE.Group(); rig.add(okada); P.okada = okada;
    var front = wheel(); front.position.set(OK.frontX, OK.wheelR, 0); okada.add(front); dyn.frontWheel = front;
    var rear = wheel(); rear.position.set(OK.rearX, OK.wheelR, 0); okada.add(rear); dyn.rearWheel = rear;

    // sprung body pivots about the front axle (only the rear spring is modelled)
    var body = new THREE.Group(); body.position.set(OK.frontX, OK.wheelR, 0); okada.add(body); dyn.body = body;
    function B(x, y, z) { return v3(x - OK.frontX, y - OK.wheelR, z || 0); }       // world-ish → body local
    // fork, headstock, handlebar, headlamp
    [-0.06, 0.06].forEach(function (z) { body.add(rod(B(0.66, 0.3, z), B(0.5, 0.92, z * 0.8), 0.016, M.chrome)); });
    body.add(rod(B(0.5, 0.92, 0), B(0.47, 1.02, 0), 0.03, M.redPaint));
    body.add(tube([B(0.43, 1.05, -0.34), B(0.47, 1.05, -0.18), B(0.49, 1.03, 0), B(0.47, 1.05, 0.18), B(0.43, 1.05, 0.34)], 0.011, M.chrome, 30));
    [-0.34, 0.34].forEach(function (z) { var gr = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.1, 12), M.seat); gr.rotation.x = Math.PI / 2; gr.position.copy(B(0.42, 1.05, z + (z > 0 ? 0.03 : -0.03))); body.add(gr); });
    var lampProf = [new THREE.Vector2(0.0005, 0), new THREE.Vector2(0.07, 0.01), new THREE.Vector2(0.075, 0.05), new THREE.Vector2(0.065, 0.07), new THREE.Vector2(0.0005, 0.07)];
    var lamp = new THREE.Mesh(new THREE.LatheGeometry(lampProf, 24), M.chrome); lamp.rotation.z = -Math.PI / 2; lamp.position.copy(B(0.53, 0.9, 0)); body.add(lamp);
    var lens = new THREE.Mesh(new THREE.CircleGeometry(0.064, 24), std(0xfff4c8, 0.1, 0, { emissive: 0x332a10 })); lens.rotation.y = Math.PI / 2; lens.position.copy(B(0.602, 0.9, 0)); body.add(lens);
    // frame tubes
    body.add(tube([B(0.48, 0.95, 0), B(0.3, 0.85, 0), B(0.05, 0.62, 0), B(-0.15, 0.45, 0)], 0.022, M.redPaint, 30));
    [-0.07, 0.07].forEach(function (z) { body.add(tube([B(0.05, 0.78, z), B(-0.3, 0.8, z), B(-0.62, 0.84, z)], 0.013, M.darkSteel, 20)); });
    // tank (extruded side profile, rounded)
    var tk = new THREE.Shape(); tk.moveTo(0.42, 0.9); tk.quadraticCurveTo(0.3, 1.0, 0.1, 0.96); tk.quadraticCurveTo(0.0, 0.93, 0.02, 0.84); tk.lineTo(0.36, 0.82); tk.quadraticCurveTo(0.44, 0.84, 0.42, 0.9);
    var tank = new THREE.Mesh(new THREE.ExtrudeGeometry(tk, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 4, curveSegments: 16 }), M.redPaint);
    tank.position.set(-OK.frontX, -OK.wheelR, -0.08); body.add(tank);
    // seat
    var st = new THREE.Shape(); st.moveTo(0.05, 0.86); st.quadraticCurveTo(-0.1, 0.92, -0.4, 0.9); st.lineTo(-0.48, 0.86); st.lineTo(0.05, 0.84);
    var seat = new THREE.Mesh(new THREE.ExtrudeGeometry(st, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 4, curveSegments: 12 }), M.seat);
    seat.position.set(-OK.frontX, -OK.wheelR, -0.09); body.add(seat);
    // engine block with cooling fins
    var eng = new THREE.Group();
    var crank = slab(0.26, 0.16, 0.2, 0.04, M.engine); crank.position.set(0.0, 0.3, 0); eng.add(crank);
    for (var f = 0; f < 6; f++) { var fin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.008, 20), M.engine); fin.rotation.z = -0.35; fin.position.set(0.08 + f * 0.014, 0.5 + f * 0.032, 0); eng.add(fin); }
    eng.position.copy(B(0.0, 0, 0)); body.add(eng);
    body.add(tube([B(0.16, 0.48, 0.1), B(0.2, 0.3, 0.14), B(0.0, 0.2, 0.16), B(-0.45, 0.28, 0.16), B(-0.75, 0.38, 0.15)], 0.022, M.chrome, 40));
    // carrier rack behind the seat
    var carrier = new THREE.Group();
    [-0.13, 0.13].forEach(function (z) { carrier.add(tube([B(-0.4, 0.9, z), B(-0.6, 0.92, z), B(-0.98, 0.92, z)], 0.009, M.darkSteel, 16)); });
    for (var c = 0; c < 4; c++) carrier.add(rod(B(-0.55 - c * 0.13, 0.92, -0.13), B(-0.55 - c * 0.13, 0.92, 0.13), 0.007, M.darkSteel, 8));
    carrier.add(rod(B(-0.98, 0.92, -0.13), B(-0.98, 0.92, 0.13), 0.009, M.darkSteel, 8));
    [-0.13, 0.13].forEach(function (z) { carrier.add(rod(B(-0.9, 0.92, z), B(-0.62, 0.8, z), 0.007, M.darkSteel, 8)); });
    body.add(carrier); P.carrier = carrier;
    dyn.carrierTop = B(-0.77, 0.93, 0);
    // tail lamp
    var tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.08), std(0xc0101a, 0.3, 0, { emissive: 0x400005 })); tail.position.copy(B(-1.0, 0.88, 0)); body.add(tail);

    // crate with egg trays (separate group: it can leave the carrier)
    var crate = new THREE.Group();
    var CW = 0.44, CH = 0.24, CD = 0.34;
    for (var s = 0; s < 3; s++) {
      [-1, 1].forEach(function (sz) { var sl = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.05, 0.012), M.crate); sl.position.set(0, 0.03 + s * 0.08, sz * CD / 2); crate.add(sl); });
      [-1, 1].forEach(function (sx) { var sl = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, CD), M.crate); sl.position.set(sx * CW / 2, 0.03 + s * 0.08, 0); crate.add(sl); });
    }
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (p) { var post = new THREE.Mesh(new THREE.BoxGeometry(0.025, CH, 0.025), M.crate); post.position.set(p[0] * (CW / 2 - 0.01), CH / 2, p[1] * (CD / 2 - 0.01)); crate.add(post); });
    var floor = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.01, CD), M.crate); floor.position.y = 0.005; crate.add(floor);
    var tray = new THREE.Mesh(new THREE.BoxGeometry(CW - 0.03, 0.015, CD - 0.03), M.tray); tray.position.y = CH - 0.01; crate.add(tray);
    var eggProf = [];
    for (var e = 0; e <= 10; e++) { var t = e / 10, ang = -Math.PI / 2 + Math.PI * t; eggProf.push(new THREE.Vector2(Math.max(0.0004, Math.cos(ang) * 0.019 * (1 - 0.12 * Math.sin(ang))), Math.sin(ang) * 0.025)); }
    var eggGeo = new THREE.LatheGeometry(eggProf, 12);
    var eggs = new THREE.InstancedMesh(eggGeo, M.egg, 30), mtx = new THREE.Matrix4();
    for (var ex = 0; ex < 6; ex++) for (var ez = 0; ez < 5; ez++) { mtx.makeTranslation(-0.175 + ex * 0.07, CH + 0.02, -0.12 + ez * 0.06); eggs.setMatrixAt(ex * 5 + ez, mtx); }
    crate.add(eggs);
    rig.add(crate); P.crate = crate; dyn.crate = crate;

    // twin rear coil-over shocks (spring geometry rebuilt with length)
    var shock = new THREE.Group();
    dyn.shocks = [];
    [-0.11, 0.11].forEach(function (z) {
      var sg = new THREE.Group();
      var bodyM = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.17, 16), M.darkSteel); sg.add(bodyM);
      var rodM = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.2, 10), M.chrome); sg.add(rodM);
      var eyeT = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.006, 8, 16), M.darkSteel); sg.add(eyeT);
      var eyeB = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.006, 8, 16), M.darkSteel); sg.add(eyeB);
      var coil = new THREE.Mesh(helixGeometry(0.03, 8, 0.28, 0.0055, 110), M.springRed); sg.add(coil);
      var oilStreak = new THREE.Mesh(new THREE.CylinderGeometry(0.0195, 0.0195, 0.06, 16, 1, true, 0, 1.2), M.oil); sg.add(oilStreak);
      shock.add(sg);
      dyn.shocks.push({ g: sg, z: z, body: bodyM, rod: rodM, eyeT: eyeT, eyeB: eyeB, coil: coil, oil: oilStreak, len: 0 });
    });
    okada.add(shock); P["rear-shock"] = shock;
    // swingarm (oriented each frame)
    dyn.swing = [];
    [-0.08, 0.08].forEach(function (z) { var sa = new THREE.Mesh(new THREE.BoxGeometry(1, 0.035, 0.022), M.darkSteel); okada.add(sa); dyn.swing.push({ m: sa, z: z }); });
    return rig;
  }

  function placeSegment(obj, a, b) {   // stretch a unit-length box/cylinder along a → b
    var dir = new THREE.Vector3().subVectors(b, a);
    obj.position.copy(a).addScaledVector(dir, 0.5);
    return dir;
  }

  /* ======================= build ======================= */
  function build3D() {
    makeMaterials();
    stage = SceneKit.createStage({ root: labRoot, canvas: canvas, fov: 32, yaw: 0.32, pitch: 0.16, distance: 3, target: new THREE.Vector3(0, 0.6, 0), onFrame: frame, portraitPitch: 0.12, adaptiveHeight: false });
    if (!stage) throw new Error("no stage");
    RIG.spring = buildSpringRig();
    RIG.pendulum = buildPendulumRig();
    RIG.ridge = buildRidgeRig();
    Object.keys(RIG).forEach(function (k) { stage.rig.add(RIG[k]); RIG[k].visible = k === state.mode; });
    // own material copies per part, so a highlight glows on that part only
    Object.keys(P).forEach(function (k) {
      P[k].traverse(function (o) { if (o.isMesh && o.material && !Array.isArray(o.material)) { o.material = o.material.clone(); o.userData.pk = o.userData.pk || k; } });
    });
    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8) pickAt(e);
      down = null;
    });
    stage.start();
  }

  /* ---------- picking ---------- */
  var INFO = {
    spring: ["Spiral spring", "Close-coiled steel. Each extra 50 g stretches it by the same amount: Hooke's law."],
    hanger: ["Slotted-mass hanger", "Each brass disc is 50 g; the slot lets it slide on past the hook."],
    pointer: ["Pointer", "Read it with your eye level with it, to avoid parallax."],
    ruler: ["Metre rule", "Reads the pointer position; the extension is the change in reading."],
    stand: ["Retort stand", "Clamp and boss hold the spring firmly so the support does not move."],
    cork: ["Split cork", "Two halves grip the thread so the point of suspension is fixed and sharp."],
    thread: ["Light thread", "Inextensible, so the length l stays the same during the swing."],
    bob: ["Bob", "l is measured to its centre (the dark band). Brass 100 g or wood 50 g, same size."],
    marker: ["Rest marker", "Start and stop timing as the bob passes here, where it moves fastest."],
    stopwatch: ["Stopwatch", "Counts from zero at the mark; time many oscillations to beat reaction time."],
    okada: ["Dayo's okada", "Its loaded rear rocks on the coil springs at its own natural frequency."],
    "rear-shock": ["Rear coil-over shock", "A spring (stores energy) around an oil damper (turns energy into heat)."],
    carrier: ["Carrier", "It can push the crate up, but it cannot pull it down."],
    crate: ["Egg crate", "Leaves the carrier when the carrier falls away faster than g."],
    ridges: ["Drainage ridges", "Concrete humps 2.5 m apart: each one gives the rear a push."]
  };
  var ray = null, ndc = null;
  function pickAt(e) {
    if (!stage) return;
    if (!ray) { ray = new THREE.Raycaster(); ndc = new THREE.Vector2(); }
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, stage.camera);
    var hit = ray.intersectObject(RIG[state.mode], true).filter(function (h) { return h.object.userData.pk; })[0];
    if (!hit) return;
    var k = hit.object.userData.pk, inf = INFO[k]; if (!inf) return;
    toast("<b>" + inf[0] + "</b><span class=\"mono\">" + inf[1] + "</span>");
    glow(k);
    emit({ mode: state.mode, part: k, name: inf[0] });
  }

  /* ---------- highlight: emissive pulse ---------- */
  function glow(part) {
    if (hi && hi.part === part) return;
    if (hi) hi.mats.forEach(function (m) { m.mat.emissive.setHex(m.e); m.mat.emissiveIntensity = m.i; });
    hi = null;
    if (!part || !P[part]) return;
    var mats = [];
    P[part].traverse(function (o) { if (o.isMesh && o.material && o.material.emissive) mats.push({ mat: o.material, e: o.material.emissive.getHex(), i: o.material.emissiveIntensity }); });
    hi = { part: part, mats: mats };
  }

  /* ======================= per-frame ======================= */
  var frames = 0;
  function frame(dt, t) {
    frames++;
    if (hi) { var p = 0.35 + 0.35 * Math.sin(t * 6); hi.mats.forEach(function (m) { m.mat.emissive.setHex(0xffb23f); m.mat.emissiveIntensity = p; }); }
    if (state.mode === "spring") stepSpring(t);
    else if (state.mode === "pendulum") stepPendulum(dt);
    else stepRidge(dt, t);
  }

  /* ---- spring ---- */
  var lastSpringLen = -1;
  function stepSpring(t) {
    var s = state.spring, mod = springModel(s.m, s.k);
    var tt = t - s.t0;
    var amp = s.amp * Math.exp(-0.04 * Math.max(0, tt));            // a little air damping
    var disp = amp * Math.cos(mod.w * Math.max(0, tt));
    var len = SP.L0 + mod.x0 + disp;
    if (Math.abs(len - lastSpringLen) > 0.0004) {
      lastSpringLen = len;
      var g = helixGeometry(SP.r, SP.turns, len, SP.wire);
      dyn.spring.geometry.dispose(); dyn.spring.geometry = g;
      dyn.hanger.position.y = SP.top - 0.008 - g.userData.bottom + 0.004;
    }
    var n = Math.max(0, Math.round(s.m / 0.05) - 1);
    for (var i = 0; i < dyn.discs.length; i++) dyn.discs[i].visible = i < n;
  }
  function springReadout() {
    var s = state.spring, mod = springModel(s.m, s.k);
    hud([["x₀ = mg/k", fx(mod.x0 * 100, 1) + " cm"], ["T = 2π√(m/k)", fx(mod.T, 3) + " s"], ["f = 1/T", fx(mod.f, 2) + " Hz"], ["ω = 2π/T", fx(mod.w, 1) + " rad/s"]]);
    return mod;
  }

  /* ---- pendulum (exact large-angle motion, RK4) ---- */
  function accel(th, p) { return -(p.g / p.l) * Math.sin(th); }
  function stepPendulum(dt) {
    var p = state.pend;
    if (p.running) {
      var sub = 6, h = dt / sub;
      for (var i = 0; i < sub; i++) {
        var th = p.th, om = p.om;
        var k1t = om, k1o = accel(th, p);
        var k2t = om + k1o * h / 2, k2o = accel(th + k1t * h / 2, p);
        var k3t = om + k2o * h / 2, k3o = accel(th + k2t * h / 2, p);
        var k4t = om + k3o * h, k4o = accel(th + k3t * h, p);
        p.th = th + h / 6 * (k1t + 2 * k2t + 2 * k3t + k4t);
        p.om = om + h / 6 * (k1o + 2 * k2o + 2 * k3o + k4o);
        if (p.timing) p.t += h;
        if (p.timing || p.armed) {
          var sign = p.th >= 0 ? 1 : -1;
          if (p.lastSign && sign !== p.lastSign) {         // passing the rest mark
            var dir = p.om > 0 ? 1 : -1;
            var frac = Math.abs(th) / ((Math.abs(th) + Math.abs(p.th)) || 1);   // share of this sub-step before the crossing
            if (p.armed) { p.armed = false; p.timing = true; p.startDir = dir; p.t = (1 - frac) * h; p.n = 0; }
            else if (dir === p.startDir) {
              p.n++;
              if (p.n >= 5) { p.t -= (1 - frac) * h; finishTiming(); }
            }
          }
          p.lastSign = sign;
        }
      }
    }
    var l = p.l;
    dyn.thread.scale.y = l - 0.02; dyn.thread.position.y = -(l - 0.02) / 2;
    dyn.bob.position.y = -l;
    dyn.pivot.rotation.z = p.th;
    dyn.bobBrass.visible = p.bob === 100; dyn.bobWood.visible = p.bob !== 100;
    var restY = PD.pivotY - l;
    dyn.markerPost.scale.y = Math.max(0.05, restY - 0.01); dyn.markerPost.position.y = Math.max(0.05, restY - 0.01) / 2;
    dyn.markerTip.position.y = Math.max(0.05, restY - 0.01);
    updateWatch();
  }
  function finishTiming() {
    var p = state.pend;
    p.timing = false;
    var T = p.t / 5, Tf = pendulumFormula(p.l, p.g);
    p.done = { t: p.t, T: T };
    pendReadout();
    info("5 oscillations took <b>" + fx(p.t, 2) + " s</b>, so T = " + fx(p.t, 2) + " ÷ 5 = <b>" + fx(T, 3) + " s</b>. The formula 2π√(l/g) gives " + fx(Tf, 3) + " s" + (p.angle > 15 ? " (a wide swing runs a little slow)." : "."));
    emit({ mode: "pendulum", l: p.l, g: p.g, bob: p.bob, angle: p.angle, n: 5, t: p.t, T: T, Tformula: Tf });
  }
  function pendReadout() {
    var p = state.pend, Tf = pendulumFormula(p.l, p.g);
    hud([["T = 2π√(l/g)", fx(Tf, 3) + " s"], ["Stopwatch", fx(p.t, 2) + " s"], ["Counted n", String(p.n) + " / 5"], ["Timed T", p.done ? fx(p.done.T, 3) + " s" : "—"]]);
    return Tf;
  }

  /* ---- ridge ---- */
  var lastShockLen = -1;
  function stepRidge(dt, t) {
    var r = state.ridge, mod = ridgeModel(r.kmh, r.mass, r.damper);
    var v = mod.v;
    r.s += v * dt;
    // amplitude builds up / dies away with the damper's time constant
    var tau = 1 / Math.max(0.05, mod.zeta * mod.w0);
    r.Acur += (mod.A - r.Acur) * Math.min(1, dt / tau);
    var ph = 2 * Math.PI * r.s / STORY.d - mod.phase;
    var wd = 2 * Math.PI * mod.f;
    var yBody = r.Acur * Math.sin(ph);
    var vBody = r.Acur * wd * Math.cos(ph);
    var aBody = -r.Acur * wd * wd * Math.sin(ph);
    // ridges scroll under the bike
    if (dyn.roadTex) dyn.roadTex.offset.x = (r.s / (OK.roadLen / 3)) % 1;
    var span = STORY.d * 4;
    function wrapX(x) { return ((x % span) + span) % span - span / 2; }
    dyn.ridges.forEach(function (m, i) { m.position.x = wrapX(OK.rearX - r.s + i * STORY.d + 0.0001); });
    function bumpAt(x) {
      var h = 0;
      dyn.ridges.forEach(function (m) { var u = x - m.position.x; if (Math.abs(u) < OK.ridgeW / 2) h = Math.max(h, OK.ridgeH * Math.pow(Math.cos(Math.PI * u / OK.ridgeW), 2)); });
      return h;
    }
    var yRearWheel = bumpAt(OK.rearX), yFrontWheel = bumpAt(OK.frontX);
    dyn.rearWheel.position.y = OK.wheelR + yRearWheel;
    dyn.frontWheel.position.y = OK.wheelR + yFrontWheel;
    var spin = -r.s / OK.wheelR;
    dyn.rearWheel.rotation.z = spin; dyn.frontWheel.rotation.z = spin;
    // body: rises at the rear by (wheel bump + sprung motion), pivoting about the front axle
    var wb = OK.frontX - OK.rearX;
    dyn.body.position.y = OK.wheelR + yFrontWheel;
    // the carrier (1.43 m behind the front axle) follows the sprung motion yBody exactly
    dyn.body.rotation.z = -Math.atan2(yBody + yRearWheel * 0.4 - yFrontWheel, OK.frontX + 0.77);
    dyn.body.updateMatrixWorld(true);
    // swingarm from the body pivot to the rear axle
    var pivotW = new THREE.Vector3(-0.15 - OK.frontX, 0.45 - OK.wheelR, 0).applyMatrix4(dyn.body.matrix);
    var axle = new THREE.Vector3(OK.rearX, OK.wheelR + yRearWheel, 0);
    dyn.swing.forEach(function (s) {
      var a = pivotW.clone(); a.z = s.z; var b = axle.clone(); b.z = s.z;
      var dir = placeSegment(s.m, a, b);
      s.m.scale.x = dir.length(); s.m.rotation.set(0, 0, Math.atan2(dir.y, dir.x));
    });
    // shocks: lower eye on the swingarm near the axle, upper eye on the body frame
    var lowW = axle.clone().lerp(pivotW, 0.12); lowW.y += 0.04;
    var upW = new THREE.Vector3(-0.5 - OK.frontX, 0.84 - OK.wheelR, 0).applyMatrix4(dyn.body.matrix);
    var len = upW.distanceTo(lowW);
    dyn.shocks.forEach(function (sh) {
      var a = lowW.clone(); a.z = sh.z; var b = upW.clone(); b.z = sh.z;
      sh.g.position.copy(a);
      var dir = new THREE.Vector3().subVectors(b, a).normalize();
      sh.g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      sh.eyeB.position.set(0, 0, 0); sh.eyeT.position.set(0, len, 0);
      sh.body.position.y = len - 0.1; sh.rod.position.y = 0.1;
      sh.oil.position.y = len - 0.16; sh.oil.visible = r.damper === "leaking";
    });
    if (Math.abs(len - lastShockLen) > 0.002) {
      lastShockLen = len;
      dyn.shocks.forEach(function (sh) {
        var g = helixGeometry(0.03, 8, len - 0.07, 0.0055, 110);
        sh.coil.geometry.dispose(); sh.coil.geometry = g; sh.coil.position.y = len - 0.045;
      });
    }
    // crate: a free body that the carrier can push up but never pull down
    var top = dyn.carrierTop.clone().applyMatrix4(dyn.body.matrix);
    var c = r.crate, sub = 4, h = dt / sub;
    for (var i = 0; i < sub; i++) {
      if (c.on) {
        c.y = top.y; c.v = vBody;
        if (aBody < -G_EARTH) c.on = false;        // carrier falls away faster than g
      } else {
        c.v -= G_EARTH * h; c.y += c.v * h;
        if (c.y <= top.y) {
          var rel = vBody - c.v;
          c.y = top.y; c.on = true;
          if (rel > 0.12 && t - r.lastCrack > 0.6) { r.cracks++; r.lastCrack = t; toast("<b>CRACK!</b><span class=\"mono\">The crate left the carrier and slammed back down.</span>", true); }
        }
      }
    }
    dyn.crate.position.set(top.x, c.y, 0);
    dyn.crate.rotation.z = dyn.body.rotation.z;
    // live HUD at ~8 Hz
    if (!r._hudT || t - r._hudT > 0.12) { r._hudT = t; ridgeReadout(); }
  }
  function ridgeReadout() {
    var r = state.ridge, mod = ridgeModel(r.kmh, r.mass, r.damper);
    var Ashow = gl ? r.Acur : mod.A;
    hud([["f = v/d", fx(mod.f, 2) + " Hz"], ["f₀", fx(mod.f0, 2) + " Hz"], ["Amplitude A", fx(Ashow * 100, 1) + " cm"], ["g/ω² (lift-off)", fx(mod.th * 100, 1) + " cm"]]);
    return mod;
  }

  /* ======================= controls ======================= */
  var CTRL_FOR = { spring: "ctrl-spring", pendulum: "ctrl-pendulum", ridge: "ctrl-ridge" };
  var INTRO = {
    spring: "Add load or change the spring, then tap <b>Pull &amp; release</b>. The extension is <b>mg/k</b>; the period is <b>2π√(m/k)</b>.",
    pendulum: "Pick a length, bob and planet, then tap <b>Release &amp; time 5</b>. Timing starts at the rest mark, counting zero.",
    ridge: "Slide the speed over the ridges. Watch the amplitude against the <b>lift-off line g/ω²</b>, and try the leaking damper."
  };
  function setMode(m, fromLearner) {
    if (!CTRL_FOR[m]) return;
    state.mode = m;
    modeTabs.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m ? "true" : "false"); });
    ctrls.forEach(function (c) { c.hidden = c.id !== CTRL_FOR[m]; });
    labRoot.setAttribute("data-mode", m);
    if (stage) {
      Object.keys(RIG).forEach(function (k) { RIG[k].visible = k === m; });
      if (m === "ridge") { stage.yaw = 0.42; } else { stage.yaw = 0.3; }
      glow(null);
      lastSpringLen = -1; lastShockLen = -1;
      // pose the rig once before framing it (thread, spring and shocks are sized in the step functions)
      var now = stage.clock.elapsedTime;
      if (m === "spring") stepSpring(now); else if (m === "pendulum") stepPendulum(0); else stepRidge(0, now);
      stage.refit();
    }
    if (m === "spring") springReadout(); else if (m === "pendulum") pendReadout(); else ridgeReadout();
    info(INTRO[m]);
    if (fromLearner) emit({ mode: m, switched: true });
  }

  /* spring */
  function setMass(kg, commit) {
    var s = state.spring; s.m = Math.max(0.05, Math.min(0.5, Math.round(kg * 20) / 20));
    if (R.m) R.m.set(s.m);
    var mod = springReadout();
    if (commit) {
      info("With <b>" + fx(s.m, 2) + " kg</b> on k = " + fx(s.k, 1) + " N/m: extension x₀ = mg/k = <b>" + fx(mod.x0 * 100, 1) + " cm</b>, period T = <b>" + fx(mod.T, 3) + " s</b>. More mass, longer period.");
      emit({ mode: "spring", m: s.m, k: s.k, x0: mod.x0, T: mod.T, f: mod.f });
    }
  }
  function setK(k, commit) {
    var s = state.spring; s.k = Math.max(10, Math.min(60, Math.round(k * 2) / 2));
    if (R.k) R.k.set(s.k);
    var mod = springReadout();
    if (commit) {
      info("Stiffer springs stretch less and bounce faster: k = <b>" + fx(s.k, 1) + " N/m</b> gives x₀ = <b>" + fx(mod.x0 * 100, 1) + " cm</b> and f = <b>" + fx(mod.f, 2) + " Hz</b>.");
      emit({ mode: "spring", m: s.m, k: s.k, x0: mod.x0, T: mod.T, f: mod.f });
    }
  }
  function release(fromLearner) {
    if (state.mode === "pendulum") return timePendulum(fromLearner);
    var s = state.spring; s.amp = 0.03; s.t0 = stage ? stage.clock.elapsedTime : 0;
    var mod = springReadout();
    info("Pulled down 3.0 cm and released: it bounces about the stretched position with <b>T = " + fx(mod.T, 3) + " s</b>, whatever the pull.");
    emit({ mode: "spring", m: s.m, k: s.k, x0: mod.x0, T: mod.T, f: mod.f, released: true });
  }

  /* pendulum */
  function resetSwing() { var p = state.pend; p.running = false; p.timing = false; p.armed = false; p.th = 0; p.om = 0; p.t = 0; p.n = 0; p.lastSign = 0; p.done = null; }
  function setLength(l, commit) {
    var p = state.pend; p.l = Math.max(0.2, Math.min(1.2, Math.round(l * 20) / 20));
    if (R.l) R.l.set(p.l);
    resetSwing(); var Tf = pendReadout();
    if (commit) { info("l = <b>" + fx(p.l, 2) + " m</b>: T = 2π√(l/g) = <b>" + fx(Tf, 3) + " s</b>. Four times the length, twice the period."); emit({ mode: "pendulum", l: p.l, g: p.g, bob: p.bob, angle: p.angle, Tformula: Tf }); }
  }
  function setG(g, commit) {
    var p = state.pend; p.g = g < 5 ? 1.6 : 9.8; markPressed("data-g", p.g === 1.6 ? "1.6" : "9.8");
    resetSwing(); var Tf = pendReadout();
    if (commit) { info((p.g < 5 ? "On the Moon" : "On Earth") + ", g = <b>" + p.g + " m/s²</b>: T = <b>" + fx(Tf, 2) + " s</b>. Weaker gravity, slower swing."); emit({ mode: "pendulum", l: p.l, g: p.g, bob: p.bob, angle: p.angle, Tformula: Tf }); }
  }
  function setBob(b, commit) {
    var p = state.pend; p.bob = b === 50 ? 50 : 100; markPressed("data-bob", String(p.bob));
    resetSwing(); var Tf = pendReadout();
    if (commit) { info("Bob changed to <b>" + (p.bob === 100 ? "100 g brass" : "50 g wood") + "</b>. T is still <b>" + fx(Tf, 3) + " s</b>: the mass cancels out."); emit({ mode: "pendulum", l: p.l, g: p.g, bob: p.bob, angle: p.angle, Tformula: Tf }); }
  }
  function setAngle(a, commit) {
    var p = state.pend; p.angle = Math.max(5, Math.min(30, Math.round(a)));
    if (R.a) R.a.set(p.angle);
    resetSwing(); pendReadout();
    if (commit) info("Release angle <b>" + p.angle + "°</b>." + (p.angle > 15 ? " Wide swings are no longer quite simple harmonic: the period grows a little." : " Small swings keep the motion simple harmonic."));
  }
  function timePendulum(fromLearner) {
    var p = state.pend;
    resetSwing();
    p.th = p.angle * Math.PI / 180; p.om = 0; p.running = true; p.armed = true; p.lastSign = 1;
    pendReadout();
    info("Released from " + p.angle + "°. The watch starts as the bob first passes the rest mark (\"zero\") and stops after 5 complete oscillations.");
    if (!stage) {   // no 3D: compute the timing from the model directly
      var Tf = pendulumFormula(p.l, p.g) * (1 + Math.pow(p.angle * Math.PI / 180, 2) / 16);
      p.running = false; p.armed = false; p.t = 5 * Tf; p.n = 5; finishTiming();
    }
  }

  /* ridge */
  function ridgeCommit(lead) {
    var r = state.ridge, mod = ridgeReadout();
    var verdict = mod.lift ? "<b class=\"lab-bad\">crates lift off</b>" : "crates stay on";
    info(lead + " f = v/d = " + fx(mod.v, 2) + " ÷ 2.5 = <b>" + fx(mod.f, 2) + " Hz</b> against f₀ = " + fx(mod.f0, 2) + " Hz. Steady amplitude <b>" + fx(mod.A * 100, 1) + " cm</b>, lift-off line " + fx(mod.th * 100, 1) + " cm: " + verdict + ".");
    emit({ mode: "ridge", kmh: r.kmh, v: mod.v, f: mod.f, f0: mod.f0, A: mod.A, th: mod.th, lift: mod.lift, mass: r.mass, damper: r.damper });
  }
  function setSpeed(kmh, commit) {
    var r = state.ridge; r.kmh = Math.max(5, Math.min(35, Math.round(kmh)));
    if (R.v) R.v.set(r.kmh);
    if (!stage) ridgeReadout();
    if (commit) ridgeCommit("At <b>" + r.kmh + " km/h</b>:");
  }
  function setLoad(kg, commit) {
    var r = state.ridge; r.mass = kg >= 225 ? 250 : 200; markPressed("data-load", String(r.mass));
    if (!stage) ridgeReadout();
    if (commit) ridgeCommit("Load <b>" + r.mass + " kg</b>:");
  }
  function setDamper(d, commit) {
    var r = state.ridge; r.damper = d === "healthy" ? "healthy" : "leaking"; markPressed("data-damper", r.damper);
    if (!stage) ridgeReadout();
    if (commit) ridgeCommit((r.damper === "healthy" ? "Healthy" : "Leaking") + " damper:");
  }

  /* ======================= narrator hooks ======================= */
  var MODE_OF = { spring: "spring", hanger: "spring", pointer: "spring", ruler: "spring", stand: "spring", cork: "pendulum", thread: "pendulum", bob: "pendulum", marker: "pendulum", stopwatch: "pendulum", okada: "ridge", "rear-shock": "ridge", carrier: "ridge", crate: "ridge", ridges: "ridge" };
  function rect(part) {
    var cr = canvas.getBoundingClientRect();
    var whole = { left: cr.left, top: cr.top, width: cr.width, height: cr.height };
    if (!stage || !part || !P[part] || !RIG[state.mode].visible) return whole;
    var rr = stage.rectOf(P[part], 8);
    if (!rr) return whole;
    var l = Math.max(cr.left, rr.left), t = Math.max(cr.top, rr.top), r2 = Math.min(cr.right, rr.left + rr.width), b = Math.min(cr.bottom, rr.top + rr.height);
    if (r2 - l < 44) { var cx = (l + r2) / 2; l = cx - 22; r2 = cx + 22; }
    if (b - t < 44) { var cy = (t + b) / 2; t = cy - 22; b = cy + 22; }
    return { left: l, top: t, width: r2 - l, height: b - t };
  }
  function highlight(part) {
    if (!part) { glow(null); return; }
    if (CTRL_FOR[part]) { if (state.mode !== part) setMode(part, false); glow(null); return; }
    var m = MODE_OF[part];
    if (m && m !== state.mode) setMode(m, false);
    if (stage && P[part]) glow(part); else glow(null);
  }

  window.StudyLab = {
    rect: rect,
    highlight: highlight,
    setMode: function (m) { setMode(m, false); },
    setMass: function (kg) { setMass(kg, true); },
    setK: function (k) { setK(k, true); },
    release: function () { release(false); },
    setLength: function (l) { setLength(l, true); },
    setG: function (g) { setG(g, true); },
    setBob: function (b) { setBob(b, true); },
    setAngle: function (a) { setAngle(a, true); },
    time: function () { timePendulum(false); },
    setSpeed: function (k) { setSpeed(k, true); },
    setLoad: function (kg) { setLoad(kg, true); },
    setDamper: function (d) { setDamper(d, true); },
    model: { spring: springModel, pendulum: pendulumFormula, ridge: ridgeModel },
    state: function () { return { mode: state.mode, m: state.spring.m, k: state.spring.k, l: state.pend.l, g: state.pend.g, kmh: state.ridge.kmh, load: state.ridge.mass, damper: state.ridge.damper, cracks: state.ridge.cracks, frames: frames, phase: "run" }; },
    reset: function () {
      state.spring.m = 0.2; state.spring.k = 24.5; state.spring.amp = 0.025;
      resetSwing(); state.pend.l = 0.8; state.pend.g = 9.8; state.pend.bob = 100; state.pend.angle = 10;
      state.ridge.kmh = 10; state.ridge.mass = 200; state.ridge.damper = "leaking"; state.ridge.Acur = 0;
      if (R.m) R.m.set(0.2); if (R.k) R.k.set(24.5); if (R.l) R.l.set(0.8); if (R.a) R.a.set(10); if (R.v) R.v.set(10);
      markPressed("data-g", "9.8"); markPressed("data-bob", "100"); markPressed("data-load", "200"); markPressed("data-damper", "leaking");
      setMode("spring", false);
    },
    openTapFor: function () {}
  };

  if (gl) {
    try { build3D(); } catch (err) { gl = false; stage = null; if (window.console) console.warn("StudyLab: 3D disabled", err); }
  }
  if (!gl && ui.fallback) { ui.fallback.hidden = false; canvas.style.visibility = "hidden"; }
  markPressed("data-g", "9.8"); markPressed("data-bob", "100"); markPressed("data-load", "200"); markPressed("data-damper", "leaking");
  setMode("spring", false);
})();
