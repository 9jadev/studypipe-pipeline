/* =========================================================
   StudyPipe · Apparatus Kit — realistic school-lab DC apparatus for three.js
   Meters with printed dials, dry cells, accumulators, colour-banded resistors,
   plug keys, shunts, multiplier coils, resistance boxes, metre-bridge board,
   jockey, PVC connecting wires, flowing-charge dots and label tags.
   Every builder returns a THREE.Group whose origin sits on the bench (y = 0),
   facing +z (towards the camera). Connection points live in group.userData.ports.
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  var V3 = THREE.Vector3;
  var SRGB = THREE.SRGBColorSpace;

  /* ---------- small helpers ---------- */
  function canvasTex(w, h, draw) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    t.colorSpace = SRGB;
    t.anisotropy = 4;
    t.userData = { canvas: c };
    return t;
  }
  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.5 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  var MAT = {};
  function m(key) {
    if (MAT[key]) return MAT[key];
    var map = {
      brass: function () { return std(0xd4a843, 0.3, 0.9); },
      copper: function () { return std(0xc8743a, 0.32, 0.9); },
      manganin: function () { return std(0xe0a060, 0.3, 0.75); },
      chrome: function () { return std(0xdfe4ea, 0.2, 1.0); },
      steel: function () { return std(0x9aa3ad, 0.35, 0.8); },
      bakelite: function () { return std(0x17171b, 0.42, 0.1); },
      blackPlastic: function () { return std(0x1d1d22, 0.5, 0.05); },
      redPlastic: function () { return std(0xc0392b, 0.4, 0.05); },
      ceramic: function () { return std(0xf1ede4, 0.55, 0.0); },
      lead: function () { return std(0x7b8088, 0.5, 0.6); },
      glass: function () { return std(0xffffff, 0.05, 0.0, { transparent: true, opacity: 0.1, depthWrite: false }); },
      wood: function () { return std(0xffffff, 0.7, 0.0, { map: woodTex("#9a643a", "#7a4a26", 11) }); },
      darkWood: function () { return std(0xffffff, 0.78, 0.0, { map: woodTex("#3b2a1e", "#2a1d14", 3) }); },
      resistorBody: function () { return std(0xd8c49a, 0.6, 0.0); }
    };
    MAT[key] = map[key]();
    return MAT[key];
  }

  // seeded random so wood grain looks the same every load
  function rng(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function woodTex(base, grain, seed) {
    var r = rng(seed);
    var t = canvasTex(1024, 256, function (g, w, h) {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 70; i++) {
        var y = r() * h, amp = 2 + r() * 6, f = 0.004 + r() * 0.01;
        g.strokeStyle = grain; g.globalAlpha = 0.15 + r() * 0.3; g.lineWidth = 0.6 + r() * 2.2;
        g.beginPath();
        for (var x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x * f + i) * amp);
        g.stroke();
      }
      g.globalAlpha = 1;
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  function roundedRectShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // box with rounded corners (in x/y) and bevelled front/back edges
  function roundedBox(w, h, d, r) {
    r = Math.min(r, w / 2, h / 2);
    var bev = Math.min(r * 0.6, d * 0.25);
    var geo = new THREE.ExtrudeGeometry(roundedRectShape(w - 2 * bev, h - 2 * bev, Math.max(0.002, r - bev)), {
      depth: Math.max(0.001, d - 2 * bev), bevelEnabled: true, bevelThickness: bev, bevelSize: bev,
      bevelSegments: 3, curveSegments: 8
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }
  function mesh(geo, mat, x, y, z) {
    var o = new THREE.Mesh(geo, mat);
    o.position.set(x || 0, y || 0, z || 0);
    return o;
  }
  function box(w, h, d, mat, x, y, z) { return mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z); }
  function cyl(rt, rb, h, mat, seg, x, y, z) { return mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 24), mat, x, y, z); }
  function lathe(profile, mat, seg) {
    return new THREE.Mesh(new THREE.LatheGeometry(profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 32), mat);
  }

  /* ---------- rich text: draws "I_g" as I with a real subscript g ---------- */
  var SUB_RE = /([A-Za-zηρΔ])_(\{([^}]+)\}|[A-Za-z0-9]+)/g;
  function richParts(text) {
    var parts = [], last = 0, m;
    SUB_RE.lastIndex = 0;
    while ((m = SUB_RE.exec(text))) {
      parts.push({ t: text.slice(last, m.index + 1), sub: false });
      parts.push({ t: m[3] || m[2], sub: true });
      last = m.index + m[0].length;
    }
    parts.push({ t: text.slice(last), sub: false });
    return parts;
  }
  function richWidth(g, text, fs, weight) {
    var w = 0;
    richParts(text).forEach(function (p) {
      g.font = weight + " " + Math.round(p.sub ? fs * 0.68 : fs) + "px Manrope, sans-serif";
      w += g.measureText(p.t).width;
    });
    return w;
  }
  // draws centred on (cx, cy) with textBaseline "middle"
  function drawRich(g, text, cx, cy, fs, weight) {
    weight = weight || 700;
    var x = cx - richWidth(g, text, fs, weight) / 2;
    g.textAlign = "left"; g.textBaseline = "middle";
    richParts(text).forEach(function (p) {
      var size = p.sub ? fs * 0.68 : fs;
      g.font = weight + " " + Math.round(size) + "px Manrope, sans-serif";
      g.fillText(p.t, x, cy + (p.sub ? fs * 0.28 : 0));
      x += g.measureText(p.t).width;
    });
  }

  /* ---------- label tags (always readable sprites) ---------- */
  function labelCanvasTex(text, o) {
    var fs = o.size || 44;
    var meas = document.createElement("canvas").getContext("2d");
    meas.font = "700 " + fs + "px Manrope, sans-serif";
    var w = Math.ceil(richWidth(meas, text, fs, 700)) + fs * 1.1;
    var h = Math.round(fs * 1.7);
    var t = canvasTex(Math.max(64, w), h, function (g, W, H) {
      var r = H / 2;
      g.fillStyle = o.bg || "rgba(12,18,32,0.88)";
      g.beginPath();
      g.moveTo(r, 0); g.lineTo(W - r, 0); g.arc(W - r, r, r, -Math.PI / 2, Math.PI / 2);
      g.lineTo(r, H); g.arc(r, r, r, Math.PI / 2, Math.PI * 1.5); g.fill();
      if (o.border) { g.strokeStyle = o.border; g.lineWidth = 4; g.stroke(); }
      g.fillStyle = o.color || "#ffffff";
      drawRich(g, text, W / 2, H / 2 + 2, fs, 700);
    });
    t.userData.aspect = t.userData.canvas.width / t.userData.canvas.height;
    return t;
  }
  function tag(text, o) {
    o = o || {};
    var tex = labelCanvasTex(text, o);
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
    var h = o.h || 0.12;
    s.scale.set(h * tex.userData.aspect, h, 1);
    s.renderOrder = 20;
    s.userData.text = text;
    s.userData.setText = function (t) {
      if (t === s.userData.text) return;
      s.userData.text = t;
      var nt = labelCanvasTex(t, o);
      s.material.map.dispose();
      s.material.map = nt;
      s.material.needsUpdate = true;
      s.scale.set(h * nt.userData.aspect, h, 1);
    };
    return s;
  }

  /* ---------- binding post (terminal) ---------- */
  function bindingPost(color, scale) {
    var g = new THREE.Group();
    var s = scale || 1;
    var capMat = color === "brass" ? m("brass") : (color === "black" ? m("blackPlastic") : m("redPlastic"));
    g.add(cyl(0.034 * s, 0.034 * s, 0.02 * s, m("brass"), 6, 0, 0.01 * s, 0));      // hex nut
    g.add(cyl(0.017 * s, 0.017 * s, 0.05 * s, m("brass"), 16, 0, 0.04 * s, 0));    // threaded stud
    g.add(cyl(0.03 * s, 0.032 * s, 0.05 * s, capMat, 18, 0, 0.085 * s, 0));         // knurled cap
    g.add(cyl(0.022 * s, 0.03 * s, 0.012 * s, capMat, 18, 0, 0.116 * s, 0));        // domed top
    g.userData.top = new V3(0, 0.122 * s, 0);
    return g;
  }
  function addPost(parent, name, color, x, y, z, scale) {
    var p = bindingPost(color, scale);
    p.position.set(x, y, z);
    parent.add(p);
    parent.userData.ports = parent.userData.ports || {};
    parent.userData.ports[name] = p.userData.top.clone().add(p.position);
    return p;
  }

  /* ---------- analog meter (ammeter / voltmeter / galvanometer) ---------- */
  function drawDial(g, W, H, o) {
    var grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, "#fcf8ee"); grd.addColorStop(1, "#ece3cf");
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    var cx = W / 2, cy = H * 0.9, R = H * 0.66, a0 = -0.87, a1 = 0.87;
    function arc(r, from, to) { g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2 + from, -Math.PI / 2 + to); }
    // mirror strip (anti-parallax)
    g.strokeStyle = "rgba(140,150,165,0.55)"; g.lineWidth = H * 0.04; arc(R * 0.86, a0, a1); g.stroke();
    if (o.zero) { // green null zone
      g.strokeStyle = "rgba(47,179,68,0.55)"; g.lineWidth = H * 0.035; arc(R * 0.95, -0.06, 0.06); g.stroke();
    }
    g.strokeStyle = "#1b1b1b"; g.lineWidth = Math.max(2, H * 0.008); arc(R, a0, a1); g.stroke();
    var majors = o.majors, n = majors.length - 1, per = o.minor || 5;
    g.fillStyle = "#1b1b1b"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "700 " + Math.round(H * 0.078) + "px Manrope, sans-serif";
    for (var i = 0; i <= n * per; i++) {
      var f = i / (n * per), a = a0 + (a1 - a0) * f, major = i % per === 0;
      var half = per % 2 === 0 && i % (per / 2) === 0;
      var len = major ? H * 0.08 : (half ? H * 0.055 : H * 0.035);
      g.lineWidth = major ? Math.max(2, H * 0.008) : Math.max(1, H * 0.004);
      g.beginPath();
      g.moveTo(cx + Math.sin(a) * R, cy - Math.cos(a) * R);
      g.lineTo(cx + Math.sin(a) * (R + len), cy - Math.cos(a) * (R + len));
      g.stroke();
      if (major) {
        var rr = R + H * 0.14;
        g.fillText(String(majors[i / per]), cx + Math.sin(a) * rr, cy - Math.cos(a) * rr);
      }
    }
    g.font = "700 " + Math.round(H * 0.25) + "px Georgia, serif";
    g.fillText(o.unit, cx, cy - R * 0.42);
    if (o.sub) {
      g.fillStyle = "#5b5345";
      drawRich(g, o.sub, cx, cy - R * 0.12, H * 0.062, 600);
      g.textAlign = "center";
    }
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; g.strokeRect(1.5, 1.5, W - 3, H - 3);
  }

  function meter(o) {
    o = o || {};
    var s = o.size || 1;
    var g = new THREE.Group();
    var W = 0.74 * s, H = 0.6 * s, D = 0.3 * s;
    // plinth that carries the terminals
    var plinth = mesh(roundedBox(W + 0.06 * s, 0.07 * s, D + 0.24 * s, 0.03 * s), m("bakelite"), 0, 0.035 * s, 0.1 * s);
    plinth.rotation.x = 0;
    g.add(plinth);
    var body = new THREE.Group();
    body.position.set(0, 0.07 * s + H / 2, -0.02 * s);
    body.rotation.x = -0.16;
    g.add(body);
    body.add(mesh(roundedBox(W, H, D, 0.07 * s), m("bakelite")));
    // dial window
    var dW = W * 0.84, dH = H * 0.66, dY = H * 0.08;
    body.add(mesh(roundedBox(dW + 0.04 * s, dH + 0.04 * s, 0.02 * s, 0.025 * s), m("chrome"), 0, dY, D / 2 + 0.002));
    var cw = 512, ch = Math.round(512 * dH / dW);
    var dialTex = canvasTex(cw, ch, function (gg, w, h) { drawDial(gg, w, h, o); });
    var dial = mesh(new THREE.PlaneGeometry(dW, dH), new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.6 }), 0, dY, D / 2 + 0.014 * s);
    body.add(dial);
    // needle on its pivot (pivot at canvas (0.5, 0.9))
    var pivot = new THREE.Group();
    pivot.position.set(0, dY + dH * (0.5 - 0.9), D / 2 + 0.02 * s);
    var nLen = dH * 0.66 * 1.06;
    var needleMat = std(o.needle || 0x111111, 0.4, 0.2);
    var ng = new THREE.BoxGeometry(0.008 * s, nLen, 0.004 * s); ng.translate(0, nLen / 2, 0);
    pivot.add(new THREE.Mesh(ng, needleMat));
    var cw2 = new THREE.BoxGeometry(0.03 * s, 0.05 * s, 0.006 * s); cw2.translate(0, -0.025 * s, 0);
    pivot.add(new THREE.Mesh(cw2, m("bakelite")));
    var cap = cyl(0.022 * s, 0.022 * s, 0.012 * s, m("chrome"), 20); cap.rotation.x = Math.PI / 2; pivot.add(cap);
    body.add(pivot);
    var glass = mesh(new THREE.PlaneGeometry(dW, dH), m("glass"), 0, dY, D / 2 + 0.03 * s);
    body.add(glass);
    // zero-adjust screw
    var screw = cyl(0.025 * s, 0.025 * s, 0.015 * s, m("blackPlastic"), 20, 0, -H * 0.36, D / 2 + 0.005);
    screw.rotation.x = Math.PI / 2; body.add(screw);
    // terminals on the plinth: black (−) left, red (+) right
    var tz = D / 2 + 0.12 * s;
    addPost(g, "neg", "black", -W * 0.3, 0.07 * s, tz, s);
    addPost(g, "pos", o.zero ? "black" : "red", W * 0.3, 0.07 * s, tz, s);
    if (o.label) {
      var plate = canvasTex(256, 48, function (gg, w, h) {
        gg.fillStyle = "#e9e2d0"; gg.fillRect(0, 0, w, h);
        gg.fillStyle = "#1b1b1b"; gg.font = "800 28px Manrope, sans-serif"; gg.textAlign = "center"; gg.textBaseline = "middle";
        gg.fillText(o.label, w / 2, h / 2 + 1);
      });
      var pl = mesh(new THREE.PlaneGeometry(0.22 * s, 0.042 * s), new THREE.MeshStandardMaterial({ map: plate, roughness: 0.5 }), 0, 0.071 * s, tz);
      pl.rotation.x = -Math.PI / 2;
      g.add(pl);
    }
    var target = 0, cur = 0;
    g.userData.needleMat = needleMat;
    g.userData.setFraction = function (f) {
      target = o.zero ? Math.max(-1.08, Math.min(1.08, f)) : Math.max(-0.02, Math.min(1.1, f));
    };
    g.userData.update = function (dt) {
      cur += (target - cur) * Math.min(1, (dt || 0.016) * 7);
      var a = o.zero ? cur * 0.87 : -0.87 + cur * 1.74;
      pivot.rotation.z = -a;
    };
    g.userData.redraw = function (no) {
      for (var k in no) o[k] = no[k];
      var c = dialTex.userData.canvas;
      drawDial(c.getContext("2d"), c.width, c.height, o);
      dialTex.needsUpdate = true;
    };
    g.userData.setFraction(o.zero ? 0 : 0);
    g.userData.update(1);
    return g;
  }

  /* ---------- dry cell + holder ---------- */
  function dryCell(o) {
    o = o || {};
    var g = new THREE.Group();
    var r = 0.095, h = 0.36;
    var tex = canvasTex(512, 256, function (gg, w, hh) {
      gg.fillStyle = o.color || "#1f4fd1"; gg.fillRect(0, 0, w, hh);
      gg.fillStyle = "#f3c13a"; gg.fillRect(0, 0, w, hh * 0.18);           // gold top band
      gg.fillStyle = "rgba(255,255,255,0.12)"; gg.fillRect(0, hh * 0.18, w, 6);
      gg.save(); gg.translate(w * 0.5, hh * 0.58); gg.rotate(-Math.PI / 2);
      gg.fillStyle = "#ffffff"; gg.textAlign = "center"; gg.textBaseline = "middle";
      gg.font = "800 46px Manrope, sans-serif"; gg.fillText(o.text || "2.0 V", 0, -36);
      gg.font = "800 54px Manrope, sans-serif"; gg.fillText("+", 82, 30);
      gg.font = "700 26px Manrope, sans-serif"; gg.fillText("CELL", 0, 32);
      gg.restore();
    });
    var bodyGeo = new THREE.CylinderGeometry(r, r, h, 40, 1, false, -Math.PI, Math.PI * 2);
    g.add(mesh(bodyGeo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.15 }), 0, 0.01 + h / 2, 0));
    g.add(cyl(r * 0.97, r * 0.97, 0.012, m("chrome"), 40, 0, 0.01 + h + 0.006, 0));
    g.add(cyl(0.032, 0.034, 0.028, m("chrome"), 24, 0, 0.01 + h + 0.026, 0));
    g.add(cyl(r * 0.97, r * 0.97, 0.01, m("chrome"), 40, 0, 0.005, 0));
    g.userData.length = h + 0.05;
    return g;
  }
  // a single-cell holder lying along x: (−) at −x, (+) at +x
  function cellHolder(o) {
    o = o || {};
    var g = new THREE.Group();
    var L = 0.5;
    g.add(mesh(roundedBox(L, 0.05, 0.24, 0.02), m("blackPlastic"), 0, 0.025, 0));
    g.add(box(L - 0.04, 0.05, 0.03, m("blackPlastic"), 0, 0.07, 0.105));
    g.add(box(L - 0.04, 0.05, 0.03, m("blackPlastic"), 0, 0.07, -0.105));
    g.add(box(0.014, 0.21, 0.16, m("chrome"), -L / 2 + 0.02, 0.105, 0));
    g.add(box(0.014, 0.21, 0.16, m("chrome"), L / 2 - 0.02, 0.105, 0));
    var cell = dryCell(o);
    cell.rotation.z = -Math.PI / 2;
    cell.position.set(-0.205, 0.13, 0);
    g.add(cell);
    g.userData.ports = { neg: new V3(-L / 2 + 0.02, 0.21, 0), pos: new V3(L / 2 - 0.02, 0.21, 0) };
    g.userData.cell = cell;
    return g;
  }

  /* ---------- accumulator (lead-acid driver cell) ---------- */
  function accumulator(o) {
    o = o || {};
    var g = new THREE.Group();
    var W = 0.58, H = 0.4, D = 0.34;
    g.add(mesh(roundedBox(W, H, D, 0.03), std(0x2a3038, 0.35, 0.1), 0, H / 2, 0));
    g.add(mesh(roundedBox(W + 0.02, 0.045, D + 0.02, 0.015), m("bakelite"), 0, H + 0.02, 0));
    for (var i = -1; i <= 1; i++) g.add(cyl(0.03, 0.034, 0.03, std(0xf3c13a, 0.45), 16, i * 0.1, H + 0.055, -0.06));
    function drawLab(gg, w, h, txt) {
      gg.fillStyle = "#e9e2d0"; gg.fillRect(0, 0, w, h);
      gg.fillStyle = "#c0392b"; gg.fillRect(0, 0, w, 40);
      gg.fillStyle = "#fff"; gg.font = "800 28px Manrope, sans-serif"; gg.textAlign = "center"; gg.textBaseline = "middle";
      gg.fillText("ACCUMULATOR", w / 2, 21);
      gg.fillStyle = "#1b1b1b"; gg.font = "800 110px Manrope, sans-serif";
      gg.fillText(txt, w / 2, 150);
    }
    var lab = canvasTex(512, 256, function (gg, w, h) { drawLab(gg, w, h, o.text || "2 V"); });
    g.userData.setText = function (t) { var c = lab.userData.canvas; drawLab(c.getContext("2d"), c.width, c.height, t); lab.needsUpdate = true; };
    g.add(mesh(new THREE.PlaneGeometry(W * 0.8, H * 0.6), new THREE.MeshStandardMaterial({ map: lab, roughness: 0.6 }), 0, H * 0.48, D / 2 + 0.002));
    addPost(g, "neg", "black", -W * 0.36, H + 0.04, 0.06, 1.2);
    addPost(g, "pos", "red", W * 0.36, H + 0.04, 0.06, 1.2);
    return g;
  }

  /* ---------- colour-banded resistor on a terminal board ---------- */
  var BAND = ["#111111", "#7a3b12", "#d22d2d", "#f07b16", "#f2c516", "#2e9d3c", "#2f62d6", "#7d3fc4", "#8a8a8a", "#f5f5f5"];
  function bandColors(ohms) {
    var v = Math.max(0.1, ohms), d1, d2, mult;
    if (v < 10) { d1 = Math.floor(v); d2 = Math.round((v - d1) * 10); mult = "#c9a227"; }
    else if (v < 100) { d1 = Math.floor(v / 10); d2 = Math.round(v) % 10; mult = BAND[0]; }
    else { var e = Math.floor(Math.log10(v)) - 1; var mant = Math.round(v / Math.pow(10, e)); d1 = Math.floor(mant / 10); d2 = mant % 10; mult = BAND[Math.min(9, e)]; }
    if (d2 > 9) { d2 = 0; d1++; }
    return [BAND[d1 % 10], BAND[d2], mult, "#c9a227"];
  }
  function resistorBody(ohms, len) {
    var g = new THREE.Group();
    var L = len || 0.34, hl = L / 2;
    var body = lathe([[0.008, -hl], [0.045, -hl + 0.003], [0.056, -hl + 0.025], [0.056, -hl + 0.065], [0.047, -hl + 0.09],
      [0.047, hl - 0.09], [0.056, hl - 0.065], [0.056, hl - 0.025], [0.045, hl - 0.003], [0.008, hl]], m("resistorBody"), 36);
    g.add(body);
    var bands = new THREE.Group();
    g.add(bands);
    function setOhms(v) {
      while (bands.children.length) { var c = bands.children.pop(); c.material.dispose(); }
      var cols = bandColors(v), ys = [-hl + 0.045, -0.04, 0.0, hl - 0.045], rs = [0.058, 0.049, 0.049, 0.058];
      for (var i = 0; i < 4; i++) bands.add(cyl(rs[i], rs[i], 0.024, std(cols[i], 0.45, cols[i] === "#c9a227" ? 0.8 : 0), 36, 0, ys[i] + (i === 3 ? 0 : 0), 0));
    }
    setOhms(ohms);
    g.rotation.z = -Math.PI / 2;  // axis along x
    g.userData.setOhms = setOhms;
    return g;
  }
  function leadWire(points, r) {
    var c = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.05);
    return new THREE.Mesh(new THREE.TubeGeometry(c, 24, r || 0.006, 6, false), m("chrome"));
  }
  function resistorBoard(o) {
    o = o || {};
    var g = new THREE.Group();
    var BL = 0.74;
    g.add(box(BL, 0.05, 0.26, m("wood"), 0, 0.025, 0));
    addPost(g, "a", "brass", -0.29, 0.05, 0, 1);
    addPost(g, "b", "brass", 0.29, 0.05, 0, 1);
    var res = resistorBody(o.ohms || 4, 0.34);
    res.position.set(0, 0.24, 0);
    g.add(res);
    g.add(leadWire([new V3(-0.17, 0.24, 0), new V3(-0.26, 0.24, 0), new V3(-0.29, 0.2, 0), new V3(-0.29, 0.168, 0)]));
    g.add(leadWire([new V3(0.17, 0.24, 0), new V3(0.26, 0.24, 0), new V3(0.29, 0.2, 0), new V3(0.29, 0.168, 0)]));
    g.userData.setOhms = res.userData.setOhms;
    g.userData.bodyPath = [new V3(-0.29, 0.24, 0), new V3(0.29, 0.24, 0)];
    return g;
  }

  /* ---------- plug key ---------- */
  function plugKey() {
    var g = new THREE.Group();
    g.add(box(0.46, 0.05, 0.26, m("wood"), 0, 0.025, 0));
    g.add(mesh(roundedBox(0.17, 0.07, 0.15, 0.015), m("brass"), -0.105, 0.085, 0));
    g.add(mesh(roundedBox(0.17, 0.07, 0.15, 0.015), m("brass"), 0.105, 0.085, 0));
    addPost(g, "a", "brass", -0.15, 0.12, 0.0, 0.9);
    addPost(g, "b", "brass", 0.15, 0.12, 0.0, 0.9);
    var plug = new THREE.Group();
    var taper = lathe([[0.001, -0.06], [0.02, -0.06], [0.03, 0.0], [0.03, 0.01], [0.001, 0.01]], m("brass"), 24);
    var handle = lathe([[0.001, 0.01], [0.026, 0.01], [0.03, 0.03], [0.022, 0.06], [0.03, 0.09], [0.04, 0.11], [0.034, 0.13], [0.001, 0.135]], m("bakelite"), 24);
    plug.add(taper, handle);
    g.add(plug);
    g.userData.setClosed = function (closed) {
      if (closed) { plug.position.set(0, 0.12, 0); plug.rotation.set(0, 0, 0); }
      else { plug.position.set(0.02, 0.21, 0.07); plug.rotation.set(0.35, 0, -0.5); }
    };
    g.userData.setClosed(true);
    return g;
  }

  /* ---------- ammeter shunt (manganin strips between brass blocks) ---------- */
  function shunt() {
    var g = new THREE.Group();
    g.add(mesh(roundedBox(0.84, 0.05, 0.26, 0.02), m("bakelite"), 0, 0.025, 0));
    g.add(mesh(roundedBox(0.13, 0.11, 0.2, 0.015), m("brass"), -0.33, 0.105, 0));
    g.add(mesh(roundedBox(0.13, 0.11, 0.2, 0.015), m("brass"), 0.33, 0.105, 0));
    for (var i = -1; i <= 1; i++) g.add(box(0.54, 0.1, 0.008, m("manganin"), 0, 0.14, i * 0.055));
    addPost(g, "a", "brass", -0.33, 0.16, 0, 1.25);
    addPost(g, "b", "brass", 0.33, 0.16, 0, 1.25);
    g.userData.bodyPath = [new V3(-0.33, 0.12, 0.0), new V3(0.33, 0.12, 0.0)];
    return g;
  }

  /* ---------- multiplier coil (fine wire wound on a ceramic bobbin) ---------- */
  function helixCurve(x0, x1, r, turns) {
    var c = new THREE.Curve();
    c.getPoint = function (t, target) {
      var a = t * turns * Math.PI * 2;
      return (target || new V3()).set(x0 + (x1 - x0) * t, Math.sin(a) * r, Math.cos(a) * r);
    };
    return c;
  }
  function multiplierCoil() {
    var g = new THREE.Group();
    g.add(box(0.96, 0.05, 0.28, m("wood"), 0, 0.025, 0));
    g.add(box(0.07, 0.16, 0.16, m("wood"), -0.3, 0.13, 0));
    g.add(box(0.07, 0.16, 0.16, m("wood"), 0.3, 0.13, 0));
    var former = cyl(0.08, 0.08, 0.64, m("ceramic"), 28); former.rotation.z = Math.PI / 2; former.position.y = 0.26; g.add(former);
    [-0.25, 0.25].forEach(function (x) { var f = cyl(0.125, 0.125, 0.025, m("ceramic"), 32); f.rotation.z = Math.PI / 2; f.position.set(x, 0.26, 0); g.add(f); });
    var coil = new THREE.Mesh(new THREE.TubeGeometry(helixCurve(-0.23, 0.23, 0.088, 34), 34 * 14, 0.0065, 5, false), m("copper"));
    coil.position.y = 0.26; g.add(coil);
    addPost(g, "a", "brass", -0.42, 0.05, 0, 1);
    addPost(g, "b", "brass", 0.42, 0.05, 0, 1);
    g.add(leadWire([new V3(-0.23, 0.26, 0.088), new V3(-0.36, 0.26, 0.06), new V3(-0.42, 0.2, 0), new V3(-0.42, 0.168, 0)], 0.005));
    g.add(leadWire([new V3(0.23, 0.26, 0.088), new V3(0.36, 0.26, 0.06), new V3(0.42, 0.2, 0), new V3(0.42, 0.168, 0)], 0.005));
    g.userData.bodyPath = [new V3(-0.42, 0.26, 0.1), new V3(0.42, 0.26, 0.1)];
    return g;
  }

  /* ---------- unknown resistance coil (for a metre-bridge gap) ---------- */
  function resistanceCoil(o) {
    o = o || {};
    var g = new THREE.Group();
    var len = o.length || 0.5;
    var former = cyl(0.05, 0.05, len, m("ceramic"), 24); former.rotation.z = Math.PI / 2; g.add(former);
    var coil = new THREE.Mesh(new THREE.TubeGeometry(helixCurve(-len / 2 + 0.03, len / 2 - 0.03, 0.056, 22), 22 * 14, 0.006, 5, false), m("copper"));
    g.add(coil);
    return g;
  }

  /* ---------- resistance box (plug type) ---------- */
  function resistanceBox(o) {
    o = o || {};
    var g = new THREE.Group();
    var W = 0.86, H = 0.22, D = 0.4;
    g.add(box(W, H, D, m("wood"), 0, H / 2, 0));
    g.add(box(W - 0.04, 0.012, D - 0.06, m("bakelite"), 0, H + 0.006, 0));
    var n = 6, bw = 0.09, gap = 0.035, x0 = -((n * bw + (n - 1) * gap) / 2) + bw / 2;
    for (var i = 0; i < n; i++) {
      g.add(mesh(roundedBox(bw, 0.03, 0.09, 0.01), m("brass"), x0 + i * (bw + gap), H + 0.027, -0.03));
      if (i < n - 1) {
        var plug = lathe([[0.001, 0], [0.018, 0], [0.022, 0.03], [0.028, 0.05], [0.022, 0.07], [0.001, 0.072]], m("bakelite"), 18);
        plug.position.set(x0 + i * (bw + gap) + (bw + gap) / 2, H + 0.035, -0.03);
        if (i !== 1) g.add(plug);   // one plug pulled out = resistance in circuit
      }
    }
    var plate = canvasTex(512, 96, function (gg, w, h) {
      gg.fillStyle = "#e9e2d0"; gg.fillRect(0, 0, w, h);
      gg.fillStyle = "#1b1b1b"; gg.font = "800 46px Manrope, sans-serif"; gg.textAlign = "center"; gg.textBaseline = "middle";
      gg.fillText(o.text || "RESISTANCE BOX", w / 2, h / 2 + 2);
    });
    g.add(mesh(new THREE.PlaneGeometry(W * 0.62, 0.11), new THREE.MeshStandardMaterial({ map: plate, roughness: 0.5 }), 0, H * 0.5, D / 2 + 0.002));
    addPost(g, "a", "brass", -W / 2 + 0.07, H + 0.012, 0.12, 1);
    addPost(g, "b", "brass", W / 2 - 0.07, H + 0.012, 0.12, 1);
    g.userData.setText = function (t) {
      var c = plate.userData.canvas, gg = c.getContext("2d");
      gg.fillStyle = "#e9e2d0"; gg.fillRect(0, 0, c.width, c.height);
      gg.fillStyle = "#1b1b1b"; gg.font = "800 46px Manrope, sans-serif"; gg.textAlign = "center"; gg.textBaseline = "middle";
      gg.fillText(t, c.width / 2, c.height / 2 + 2);
      plate.needsUpdate = true;
    };
    return g;
  }

  /* ---------- knife-edge jockey (origin = blade tip) ---------- */
  function jockey() {
    var g = new THREE.Group();
    var sh = new THREE.Shape();
    sh.moveTo(0, 0); sh.lineTo(0.03, 0.07); sh.lineTo(-0.03, 0.07); sh.lineTo(0, 0);
    var blade = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false }), m("brass"));
    blade.position.z = -0.003; g.add(blade);
    g.add(cyl(0.026, 0.026, 0.03, m("brass"), 20, 0, 0.085, 0));
    var handle = lathe([[0.001, 0.1], [0.026, 0.1], [0.03, 0.14], [0.034, 0.2], [0.03, 0.24], [0.036, 0.3], [0.03, 0.34], [0.001, 0.345]], m("bakelite"), 28);
    g.add(handle);
    g.userData.ports = { top: new V3(0, 0.345, 0) };
    return g;
  }

  /* ---------- metre bridge / potentiometer board ---------- */
  function rulerTex() {
    return canvasTex(2048, 110, function (g, w, h) {
      g.fillStyle = "#f4eedb"; g.fillRect(0, 0, w, h);
      var m0 = 44, span = w - 2 * m0;
      g.strokeStyle = "#1b1b1b"; g.fillStyle = "#1b1b1b";
      g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = "700 30px Manrope, sans-serif";
      for (var i = 0; i <= 100; i++) {
        var x = m0 + span * i / 100, big = i % 10 === 0, mid = i % 5 === 0;
        g.lineWidth = big ? 3 : 1.6;
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, big ? 44 : (mid ? 32 : 20)); g.stroke();
        if (big) g.fillText(String(i), x, 86);
      }
      g.font = "600 20px Manrope, sans-serif"; g.textAlign = "right"; g.fillText("cm", w - 8, 100);
    });
  }
  function metreBridgeBoard() {
    var g = new THREE.Group();
    var y0 = 0.08;
    g.add(box(3.9, y0, 1.25, m("wood"), 0, y0 / 2, 0.05));
    var ruler = mesh(new THREE.PlaneGeometry(3.2 * 2048 / (2048 - 88), 0.17), new THREE.MeshStandardMaterial({ map: rulerTex(), roughness: 0.6 }), 0, y0 + 0.002, 0.46);
    ruler.rotation.x = -Math.PI / 2; g.add(ruler);
    var wireY = y0 + 0.03, wireZ = 0.27;
    var w = cyl(0.008, 0.008, 3.2, m("chrome"), 10, 0, wireY, wireZ); w.rotation.z = Math.PI / 2; g.add(w);
    var B = m("brass"), t = 0.025, sy = y0 + t / 2;
    // L-shaped end strips + middle strip (two gaps between them)
    g.add(box(0.12, t, 0.74, B, -1.7, sy, -0.03));
    g.add(box(0.72, t, 0.12, B, -1.4, sy, -0.36));
    g.add(box(0.12, t, 0.74, B, 1.7, sy, -0.03));
    g.add(box(0.72, t, 0.12, B, 1.4, sy, -0.36));
    g.add(box(1.1, t, 0.12, B, 0, sy, -0.36));
    // wire clamps
    g.add(box(0.14, 0.04, 0.08, B, -1.66, y0 + 0.03, wireZ));
    g.add(box(0.14, 0.04, 0.08, B, 1.66, y0 + 0.03, wireZ));
    var py = y0 + t;
    addPost(g, "A", "brass", -1.7, py, 0.15, 1);
    addPost(g, "C", "brass", 1.7, py, 0.15, 1);
    addPost(g, "L1", "brass", -1.15, py, -0.36, 1);
    addPost(g, "L2", "brass", -0.45, py, -0.36, 1);
    addPost(g, "B", "brass", 0, py, -0.36, 1);
    addPost(g, "R1", "brass", 0.45, py, -0.36, 1);
    addPost(g, "R2", "brass", 1.15, py, -0.36, 1);
    addPost(g, "A2", "brass", -1.7, py, -0.2, 1);
    g.userData.wire = { y: wireY + 0.008, z: wireZ, x0: -1.6, x1: 1.6 };
    g.userData.xAt = function (l) { return -1.6 + 3.2 * l / 100; };
    return g;
  }

  /* ---------- wiring ---------- */
  function worldPort(obj, name) {
    obj.updateWorldMatrix(true, false);
    return obj.userData.ports[name].clone().applyMatrix4(obj.matrixWorld);
  }
  var PVC = {};
  function pvc(color) { return PVC[color] || (PVC[color] = std(color, 0.42, 0.0)); }
  function wire(a, b, o) {
    o = o || {};
    var lift = o.lift != null ? o.lift : 0.22;
    var pts = [a.clone()];
    if (lift > 0) pts.push(a.clone().add(new V3(0, lift * 0.55, 0)));
    if (o.via) o.via.forEach(function (p) { pts.push(p.clone()); });
    else {
      var mid = a.clone().lerp(b, 0.5);
      mid.y = Math.max(a.y, b.y) + lift;
      if (o.bend) mid.add(o.bend);
      pts.push(mid);
    }
    if (lift > 0) pts.push(b.clone().add(new V3(0, lift * 0.55, 0)));
    pts.push(b.clone());
    var curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
    var len = curve.getLength();
    var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, Math.round(len * 48)), o.r || 0.014, 8, false), pvc(o.color || 0xc0392b));
    tube.userData.curve = curve;
    return tube;
  }
  // a group that can be emptied and rebuilt when the circuit changes
  function wireSet(parent) {
    var g = new THREE.Group();
    parent.add(g);
    return {
      group: g,
      clear: function () {
        while (g.children.length) {
          var c = g.children.pop();
          if (c.geometry) c.geometry.dispose();
          if (c.userData.dispose) c.userData.dispose();
        }
      },
      add: function (o) { g.add(o); return o; }
    };
  }

  /* ---------- flowing charge dots along a curve ---------- */
  var DOT_GEO = null;
  function flow(curveOrPoints, o) {
    o = o || {};
    var curve = curveOrPoints.getPointAt ? curveOrPoints : new THREE.CatmullRomCurve3(curveOrPoints, false, "catmullrom", 0);
    var len = curve.getLength();
    var n = Math.max(3, Math.round(len / (o.spacing || 0.2)));
    DOT_GEO = DOT_GEO || new THREE.SphereGeometry(0.017, 10, 8);
    var matl = new THREE.MeshStandardMaterial({ color: o.color || 0x7cf7d4, emissive: o.color || 0x7cf7d4, emissiveIntensity: 0.9 });
    var g = new THREE.Group();
    var u = [];
    for (var i = 0; i < n; i++) { var d = new THREE.Mesh(DOT_GEO, matl); d.renderOrder = 5; g.add(d); u.push(i / n); }
    var tmp = new V3();
    function place() { for (var i = 0; i < n; i++) { curve.getPointAt(u[i], tmp); g.children[i].position.copy(tmp); } }
    place();
    g.userData.dispose = function () { matl.dispose(); };
    g.userData.update = function (dt, speed) {
      if (!speed) return;
      var du = (dt * speed) / len;
      for (var i = 0; i < n; i++) { u[i] = ((u[i] + du) % 1 + 1) % 1; }
      place();
    };
    g.userData.setColor = function (c) { matl.color.setHex(c); matl.emissive.setHex(c); };
    return g;
  }

  /* ---------- bench top ---------- */
  function benchTop(w, d) {
    var t = box(w || 6, 0.1, d || 3.6, m("darkWood"), 0, -0.05, 0);
    return t;
  }

  window.Apparatus = {
    tag: tag, meter: meter, dryCell: dryCell, cellHolder: cellHolder, accumulator: accumulator,
    resistorBody: resistorBody, resistorBoard: resistorBoard, plugKey: plugKey, shunt: shunt,
    multiplierCoil: multiplierCoil, resistanceCoil: resistanceCoil, resistanceBox: resistanceBox,
    jockey: jockey, metreBridgeBoard: metreBridgeBoard, bindingPost: bindingPost,
    wire: wire, wireSet: wireSet, flow: flow, worldPort: worldPort, benchTop: benchTop,
    roundedBox: roundedBox, helixCurve: helixCurve, mat: m, std: std, canvasTex: canvasTex
  };
})();
