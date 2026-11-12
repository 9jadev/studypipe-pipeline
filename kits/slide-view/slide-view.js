/* =========================================================
   StudyPipe · SlideViewKit v1 — "what you can really see on a school slide"
   An eyepiece disc (stained onion epidermis or cheek cells) beside a textbook cell diagram.
   Structures that cannot be seen on a stained school slide fade out with a short reason.
   Visibility is COMPUTED (present? resolvable at 0.2 um? image big enough for the eye? stained?) never typed.

   Classic script, offline, needs window.THREE only.
   SlideViewKit.create(opts) -> THREE.Group with userData.parts, update(dt,t), setState(obj), reading().
   ========================================================= */
(function (global) {
  "use strict";
  if (typeof THREE === "undefined") return;
  var TAU = Math.PI * 2;

  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) { if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace; else if ("encoding" in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding; return tex; }
  function tagPart(obj, key) { obj.userData = obj.userData || {}; obj.userData.partId = key; obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; }); return obj; }
  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData = g.userData || {}; g.userData.parts = parts; g.userData.update = updateFn; g.userData.setState = setStateFn;
    g.group = g; g.parts = parts; g.tick = updateFn; g.update = updateFn; g.setState = setStateFn; return g;
  }
  function makeHighlighter(scene) {
    var saved = [];
    function clear() { saved.forEach(function (s) { s.mesh.material = s.orig; }); saved.length = 0; }
    function highlight(name, hex) {
      clear(); if (!name || !scene) return; var col = new THREE.Color(hex != null ? hex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === name && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); c.emissive.copy(col); c.emissiveIntensity = 0.65; saved.push({ mesh: o, orig: o.material }); o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* ---------------- the visibility model ---------------- */
  var LIMIT_UM = 0.2;     // resolving limit of a school light microscope (um), as in 02-lesson L02
  var EYE_MM = 0.1;       // smallest detail the unaided eye can make out (mm)
  var SPECIMENS = {
    onion: {
      title: "plant cell", stain: "iodine", cellWidth_um: 50, cellLength_um: 130, short: "onion epidermis",
      items: [
        { id: "wall", name: "Cell wall", size_um: 50, present: true, contrast: true, stained: true, why: "Cellulose walls show as the box-like outlines." },
        { id: "membrane", name: "Cell membrane", size_um: 0.008, present: true, contrast: false, stained: false, override: "Pressed on wall", why: "A membrane is about 8 nm thick and lies pressed against the wall, so it cannot be seen unless the cell is plasmolysed." },
        { id: "cytoplasm", name: "Cytoplasm", size_um: 2, present: true, contrast: false, stained: true, why: "Iodine tints the thin cytoplasm layer yellow-brown." },
        { id: "nucleus", name: "Nucleus", size_um: 7, present: true, contrast: false, stained: true, why: "Iodine stains the nucleus darker; it sits at the side." },
        { id: "vacuole", name: "Large vacuole", size_um: 35, present: true, contrast: true, stained: false, why: "A big clear sap space; the nucleus is pushed to the side." },
        { id: "chloroplast", name: "Chloroplasts", size_um: 5, present: false, contrast: false, stained: false, override: "Absent in onion", why: "An onion bulb grows underground, so its cells have no chloroplasts." },
        { id: "mitochondrion", name: "Mitochondria", size_um: 1, present: true, contrast: false, stained: false, why: "Large enough to resolve, but iodine does not stain them." },
        { id: "er", name: "Rough ER", size_um: 0.05, present: true, contrast: false, stained: false, why: "Membrane channels thinner than 0.2 um cannot be resolved." },
        { id: "golgi", name: "Golgi body", size_um: 0.03, present: true, contrast: false, stained: false, why: "Its flat pouches are far below 0.2 um." },
        { id: "ribosome", name: "Ribosomes", size_um: 0.025, present: true, contrast: false, stained: false, why: "About 0.025 um: eight times smaller than the 0.2 um limit." }
      ]
    },
    cheek: {
      title: "animal cell", stain: "methylene blue", cellWidth_um: 60, cellLength_um: 60, short: "cheek cells",
      items: [
        { id: "membrane", name: "Cell membrane", size_um: 60, present: true, contrast: true, stained: true, why: "Seen only as the edge of the cell." },
        { id: "cytoplasm", name: "Cytoplasm", size_um: 5, present: true, contrast: false, stained: true, why: "Methylene blue tints it pale blue." },
        { id: "nucleus", name: "Nucleus", size_um: 7, present: true, contrast: false, stained: true, why: "Methylene blue stains it deep blue, near the centre." },
        { id: "mitochondrion", name: "Mitochondria", size_um: 1, present: true, contrast: false, stained: false, why: "Large enough to resolve, but not stained." },
        { id: "lysosome", name: "Lysosomes", size_um: 0.5, present: true, contrast: false, stained: false, why: "Small, colourless and not stained." },
        { id: "centrioles", name: "Centrioles", size_um: 0.2, present: true, contrast: false, stained: false, why: "At the resolving limit and not stained." },
        { id: "er", name: "Rough ER", size_um: 0.05, present: true, contrast: false, stained: false, why: "Thinner than 0.2 um." },
        { id: "golgi", name: "Golgi body", size_um: 0.03, present: true, contrast: false, stained: false, why: "Flat pouches far below 0.2 um." },
        { id: "ribosome", name: "Ribosomes", size_um: 0.025, present: true, contrast: false, stained: false, why: "Eight times below the resolving limit." }
      ]
    }
  };
  var ALL_IDS = ["wall", "membrane", "cytoplasm", "nucleus", "vacuole", "chloroplast", "mitochondrion", "lysosome", "centrioles", "er", "golgi", "ribosome"];

  function judge(item, M, spec) {
    var image_mm = item.size_um * M / 1000, out = { id: item.id, name: item.name, size_um: item.size_um, image_mm: +image_mm.toFixed(4), visible: false, reason: "", why: item.why };
    if (!item.present) { out.reason = item.override || "Not in this cell"; return out; }
    if (item.size_um < LIMIT_UM) { out.reason = item.override || "Too small"; return out; }
    if (image_mm < EYE_MM) { out.reason = "Too small at ×" + M; return out; }
    if (!item.contrast && !item.stained) { out.reason = item.override || "Not stained"; return out; }
    out.visible = true; return out;
  }

  /* ---------------- canvases ---------------- */
  var CS = 640;
  function mkCanvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

  function drawDiagram(g, specKey, alpha, rows) {
    var spec = SPECIMENS[specKey];
    g.clearRect(0, 0, CS, CS);
    g.fillStyle = "#fbf6e9"; g.fillRect(0, 0, CS, CS);
    g.fillStyle = "#3a2e1a"; g.font = "700 28px sans-serif"; g.textBaseline = "alphabetic"; g.textAlign = "left";
    g.fillText("Textbook diagram: " + spec.title, 18, 40);
    g.strokeStyle = "rgba(58,46,26,0.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(18, 54); g.lineTo(CS - 18, 54); g.stroke();
    var A = function (id) { return alpha[id] == null ? 1 : alpha[id]; };
    var dot = function (x, y, r) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
    if (specKey === "onion") {
      var X0 = 22, Y0 = 130, W = 270, H = 420, R = 30;
      function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
      g.globalAlpha = A("cytoplasm"); rr(X0, Y0, W, H, R); g.fillStyle = "#f3e6a6"; g.fill();
      g.globalAlpha = A("vacuole"); g.beginPath(); g.ellipse(190, 350, 78, 135, 0, 0, TAU); g.fillStyle = "#cfe6ee"; g.fill(); g.strokeStyle = "#7aa6b5"; g.lineWidth = 3; g.stroke();
      g.globalAlpha = A("wall"); rr(X0, Y0, W, H, R); g.strokeStyle = "#6f8f45"; g.lineWidth = 14; g.stroke();
      rr(X0 + 7, Y0 + 7, W - 14, H - 14, R - 6); g.strokeStyle = "#b9cf8f"; g.lineWidth = 2; g.stroke();
      g.globalAlpha = A("membrane"); rr(X0 + 14, Y0 + 14, W - 28, H - 28, R - 12); g.strokeStyle = "#c0562a"; g.lineWidth = 3; g.stroke();
      g.globalAlpha = A("chloroplast"); [[62, 360], [58, 470], [236, 200]].forEach(function (c) { g.fillStyle = "#4f9a3c"; g.beginPath(); g.ellipse(c[0], c[1], 24, 12, 0.4, 0, TAU); g.fill(); g.strokeStyle = "#2f6a24"; g.lineWidth = 2; for (var k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(c[0] - 10, c[1] + k * 4); g.lineTo(c[0] + 10, c[1] + k * 4); g.stroke(); } });
      g.globalAlpha = A("mitochondrion"); [[88, 300, 0.5], [205, 520, -0.3]].forEach(function (c) { g.save(); g.translate(c[0], c[1]); g.rotate(c[2]); g.fillStyle = "#e0894a"; g.beginPath(); g.ellipse(0, 0, 24, 11, 0, 0, TAU); g.fill(); g.strokeStyle = "#8f4a1c"; g.lineWidth = 1.5; for (var k = -14; k <= 14; k += 7) { g.beginPath(); g.moveTo(k, -9); g.lineTo(k, 5); g.stroke(); } g.restore(); });
      g.globalAlpha = A("nucleus"); g.fillStyle = "#c9a3d6"; dot(112, 205, 42); g.strokeStyle = "#7a4d8c"; g.lineWidth = 4; g.beginPath(); g.arc(112, 205, 42, 0, TAU); g.stroke(); g.fillStyle = "#6a3f7a"; dot(104, 200, 11);
      g.globalAlpha = A("er"); g.strokeStyle = "#4a8fb5"; g.lineWidth = 3; for (var e = 0; e < 3; e++) { g.beginPath(); g.moveTo(150, 235 + e * 11); for (var q = 0; q < 6; q++) g.quadraticCurveTo(160 + q * 12, 225 + e * 11 + (q % 2 ? 8 : -8), 166 + q * 12, 235 + e * 11); g.stroke(); }
      g.globalAlpha = A("golgi"); g.strokeStyle = "#d98d2b"; g.lineWidth = 5; for (var gq = 0; gq < 4; gq++) { g.beginPath(); g.arc(240 - gq * 7, 272, 22 + gq * 3, 2.4, 3.9); g.stroke(); }
      g.globalAlpha = A("ribosome"); g.fillStyle = "#2d2d2d"; [[160, 255], [172, 262], [184, 252], [120, 300], [135, 312], [150, 300], [70, 250], [80, 262], [250, 330], [260, 345]].forEach(function (p) { dot(p[0], p[1], 3); });
      g.globalAlpha = 1;
    } else {
      // animal cell: irregular outline
      var cx = 158, cy = 340, N = 48, pts = [];
      for (var i = 0; i < N; i++) { var a = i / N * TAU, r = 1 + 0.07 * Math.sin(a * 3 + 0.6) + 0.04 * Math.sin(a * 5); pts.push([cx + Math.cos(a) * 138 * r, cy + Math.sin(a) * 180 * r]); }
      function outline() { g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath(); }
      g.globalAlpha = A("cytoplasm"); outline(); g.fillStyle = "#e5eefb"; g.fill();
      g.globalAlpha = A("membrane"); outline(); g.strokeStyle = "#c0562a"; g.lineWidth = 6; g.stroke();
      g.globalAlpha = A("nucleus"); g.fillStyle = "#c9a3d6"; dot(158, 330, 52); g.strokeStyle = "#7a4d8c"; g.lineWidth = 4; g.beginPath(); g.arc(158, 330, 52, 0, TAU); g.stroke(); g.fillStyle = "#6a3f7a"; dot(150, 322, 13);
      g.globalAlpha = A("centrioles"); g.strokeStyle = "#2d6a4f"; g.lineWidth = 6; g.beginPath(); g.moveTo(98, 252); g.lineTo(118, 258); g.moveTo(104, 238); g.lineTo(108, 262); g.stroke();
      g.globalAlpha = A("mitochondrion"); [[88, 420, 0.4], [225, 280, -0.5], [220, 440, 0.2]].forEach(function (c) { g.save(); g.translate(c[0], c[1]); g.rotate(c[2]); g.fillStyle = "#e0894a"; g.beginPath(); g.ellipse(0, 0, 25, 11, 0, 0, TAU); g.fill(); g.strokeStyle = "#8f4a1c"; g.lineWidth = 1.5; for (var k = -14; k <= 14; k += 7) { g.beginPath(); g.moveTo(k, -9); g.lineTo(k, 5); g.stroke(); } g.restore(); });
      g.globalAlpha = A("er"); g.strokeStyle = "#4a8fb5"; g.lineWidth = 3; for (var e2 = 0; e2 < 3; e2++) { g.beginPath(); g.moveTo(90, 360 + e2 * 11); for (var q2 = 0; q2 < 4; q2++) g.quadraticCurveTo(98 + q2 * 12, 350 + e2 * 11 + (q2 % 2 ? 8 : -8), 106 + q2 * 12, 360 + e2 * 11); g.stroke(); }
      g.globalAlpha = A("golgi"); g.strokeStyle = "#d98d2b"; g.lineWidth = 5; for (var g2 = 0; g2 < 4; g2++) { g.beginPath(); g.arc(112 - g2 * 7 + 90, 205, 22 + g2 * 3, 3.6, 5.2); g.stroke(); }
      g.globalAlpha = A("lysosome"); g.fillStyle = "#9b6fd0"; dot(70, 330, 11); dot(250, 360, 10); dot(130, 470, 9);
      g.globalAlpha = A("ribosome"); g.fillStyle = "#2d2d2d"; [[200, 400], [212, 410], [190, 415], [108, 280], [120, 288], [235, 330], [60, 380], [180, 270]].forEach(function (p) { dot(p[0], p[1], 3); });
      g.globalAlpha = 1;
    }
    // label column + leader lines (rows already sorted top to bottom by anchor height)
    rows.forEach(function (r, i) {
      var vis = r.vis, a = alpha[r.id] == null ? 1 : alpha[r.id], faded = clamp01((1 - a) / 0.82);
      g.globalAlpha = 0.3 + 0.7 * (1 - faded);
      g.strokeStyle = "rgba(58,46,26,0.55)"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(r.ax, r.ay); g.lineTo(326, r.y - 6); g.stroke();
      g.fillStyle = "#3a2e1a"; g.beginPath(); g.arc(r.ax, r.ay, 3.5, 0, TAU); g.fill();
      g.globalAlpha = 1;
      g.fillStyle = faded > 0.5 ? "#8b8170" : "#2c2210"; g.font = "700 27px sans-serif"; g.textAlign = "left";
      g.fillText(r.name, 332, r.y);
      if (faded > 0.02) {
        var w = g.measureText(r.name).width; g.strokeStyle = "rgba(139,129,112," + faded + ")"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(330, r.y - 9); g.lineTo(334 + w, r.y - 9); g.stroke();
        g.globalAlpha = faded; g.fillStyle = "#b3361f"; g.font = "italic 600 20px sans-serif"; g.fillText("✖ " + r.reason, 332, r.y + 21); g.globalAlpha = 1;
      } else { g.fillStyle = "#2f7d3a"; g.font = "700 18px sans-serif"; g.fillText("✔ visible", 332, r.y + 21); }
    });
  }

  var ANCHORS = {
    onion: { wall: [290, 215], membrane: [272, 330], cytoplasm: [262, 500], nucleus: [150, 205], vacuole: [205, 345], chloroplast: [236, 200], mitochondrion: [205, 520], er: [190, 245], golgi: [240, 272], ribosome: [250, 330] },
    cheek: { membrane: [286, 250], cytoplasm: [250, 420], nucleus: [200, 330], mitochondrion: [225, 280], lysosome: [250, 360], centrioles: [112, 250], er: [106, 370], golgi: [205, 190], ribosome: [212, 410] }
  };

  function drawEyepiece(c, specKey, M, vis, seed) {
    var g = c.getContext("2d"), D = c.width, R = D / 2, spec = SPECIMENS[specKey];
    var field = 160 / M, across = field * 1000 / spec.cellWidth_um; // field in mm: 160/M reproduces 4.0 / 1.6 / 0.40 mm at x40 / x100 / x400
    g.clearRect(0, 0, D, D); g.save(); g.beginPath(); g.arc(R, R, R - 2, 0, TAU); g.clip();
    var w = D / across, rnd = rng(seed || 5);
    if (specKey === "onion") {
      g.fillStyle = "#f6e7b8"; g.fillRect(0, 0, D, D);
      var h = w * spec.cellLength_um / spec.cellWidth_um, rows = Math.ceil(D / h) + 2, lw = Math.max(0.8, w * 0.07);
      for (var row = -1; row < rows; row++) {
        var y = row * h, off = (row % 2) * w * 0.5;
        for (var x = -w + off; x < D + w; x += w) {
          if (vis.cytoplasm) { g.fillStyle = "rgba(226,190,96,0.35)"; g.fillRect(x, y, w, h); }
          if (vis.vacuole && w > 6) { g.fillStyle = "rgba(255,251,230,0.6)"; g.fillRect(x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.84); }
          if (vis.nucleus) { var nx = x + w * (0.22 + rnd() * 0.12), ny = y + h * (0.18 + rnd() * 0.5); g.fillStyle = "#6b3f12"; g.beginPath(); g.ellipse(nx, ny, Math.max(1.2, w * 0.13), Math.max(1.1, w * 0.11), 0, 0, TAU); g.fill(); if (w > 40) { g.fillStyle = "#c79a4a"; g.beginPath(); g.arc(nx - w * 0.02, ny - w * 0.02, w * 0.035, 0, TAU); g.fill(); } }
          else rnd(), rnd();
          if (vis.wall) { g.strokeStyle = "#8a5a1c"; g.lineWidth = lw; g.strokeRect(x, y, w, h); }
        }
      }
    } else {
      g.fillStyle = "#eef3f8"; g.fillRect(0, 0, D, D);
      var step = w * 1.25, cols = Math.ceil(D / step) + 2;
      for (var j = -1; j < cols; j++) for (var i = -1; i < cols; i++) {
        if (rnd() < 0.3) { rnd(); rnd(); rnd(); continue; }
        var px = i * step + (rnd() - 0.5) * step * 0.55, py = j * step + (rnd() - 0.5) * step * 0.55, rr = w * (0.46 + rnd() * 0.12), rot = rnd() * TAU;
        g.beginPath(); for (var k = 0; k < 9; k++) { var a = k / 9 * TAU, rj = rr * (0.9 + 0.12 * Math.sin(a * 3 + rot)); g.lineTo(px + Math.cos(a) * rj, py + Math.sin(a) * rj * 0.92); } g.closePath();
        if (vis.cytoplasm) { g.fillStyle = "rgba(150,185,230,0.5)"; g.fill(); }
        if (vis.membrane) { g.strokeStyle = "#5878ad"; g.lineWidth = Math.max(0.8, w * 0.05); g.stroke(); }
        if (vis.nucleus) { g.fillStyle = "#2b3f8c"; g.beginPath(); g.arc(px, py, Math.max(1.3, w * 0.17), 0, TAU); g.fill(); }
      }
    }
    var vg = g.createRadialGradient(R, R, R * 0.6, R, R, R); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)"); g.fillStyle = vg; g.fillRect(0, 0, D, D);
    // scale bar (0.1 mm) + magnification tag
    var bar = 0.1 / field * D; g.fillStyle = "rgba(10,14,24,0.75)"; g.fillRect(D * 0.5 - bar / 2 - 6, D - 58, bar + 12, 30);
    g.fillStyle = "#fff"; g.fillRect(D * 0.5 - bar / 2, D - 46, bar, 5); g.font = "600 17px sans-serif"; g.textAlign = "center"; g.fillText("0.1 mm", D * 0.5, D - 52);
    g.restore();
    g.fillStyle = "rgba(10,14,24,0.82)"; var tag = "×" + Math.round(M); g.font = "700 30px sans-serif"; var tw = g.measureText(tag).width + 26;
    g.beginPath(); g.rect(D / 2 - tw / 2, 22, tw, 42); g.fill(); g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText(tag, D / 2, 54);
    return { field_mm: field, across: across };
  }

  /* ---------------- create ---------------- */
  function create(opts) {
    opts = opts || {};
    var S = { M: opts.M || 400, specimen: SPECIMENS[opts.specimen] ? opts.specimen : "onion", showTextbook: opts.showTextbook !== false, labels: true };
    var Mcur = S.M, aspect = opts.aspect || 0.8, onEvent = opts.onEvent || null;
    var root = new THREE.Group(), parts = {};

    /* eyepiece: lathe barrel with knurled collar + rubber eye cup + metal bezel ring around the field disc */
    var ey = new THREE.Group();
    var metalTex = (function () { var c = mkCanvas(128, 128), g = c.getContext("2d"), R = rng(3); g.fillStyle = "#7d8794"; g.fillRect(0, 0, 128, 128); for (var i = 0; i < 400; i++) { g.strokeStyle = "rgba(" + (R() < 0.5 ? "255,255,255" : "0,0,0") + "," + (0.04 + R() * 0.08) + ")"; g.beginPath(); var y = R() * 128; g.moveTo(0, y); g.lineTo(128, y + (R() - 0.5) * 3); g.stroke(); } var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 1); return srgb(t); })();
    var metal = new THREE.MeshStandardMaterial({ color: 0xffffff, map: metalTex, roughness: 0.38, metalness: 0.75 }), rubber = new THREE.MeshStandardMaterial({ color: 0x1a1d24, roughness: 0.85 });
    var prof = [[0.98, 0], [1.02, 0.02], [1.06, 0.1], [1.06, 0.5], [1.12, 0.56], [1.12, 0.7], [1.06, 0.76], [1.06, 1.2], [0.96, 1.26], [0.96, 1.5]].map(function (p) { return new THREE.Vector2(p[0], -p[1]); });
    var barrel = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), metal); barrel.rotation.x = Math.PI / 2; ey.add(barrel);
    var ridges = new THREE.Mesh(new THREE.CylinderGeometry(1.125, 1.125, 0.14, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0x2b2f38, roughness: 0.7, metalness: 0.3, bumpMap: (function () { var c = mkCanvas(256, 8), g = c.getContext("2d"); g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 8); for (var i = 0; i < 64; i++) { g.fillStyle = "#e0e0e0"; g.fillRect(i * 4, 0, 2, 8); } var t = new THREE.CanvasTexture(c); return t; })(), bumpScale: 2 }));
    ridges.rotation.x = Math.PI / 2; ridges.position.z = -0.63; ey.add(ridges);
    var bezel = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.075, 16, 64), metal); bezel.position.z = 0.0; ey.add(bezel);
    var cup = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 10, 48), rubber); cup.position.z = 0.06; ey.add(cup);
    var evCanvas = mkCanvas(512, 512), evTex = srgb(new THREE.CanvasTexture(evCanvas));
    var view = new THREE.Mesh(new THREE.CircleGeometry(0.97, 64), new THREE.MeshBasicMaterial({ map: evTex, toneMapped: false })); view.position.z = 0.02; ey.add(view);
    var shine = new THREE.Mesh(new THREE.CircleGeometry(0.97, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, depthWrite: false })); shine.position.z = 0.03; ey.add(shine);
    ey.rotation.y = 0.26; root.add(ey);
    parts.eyepiece = tagPart(ey, "eyepiece"); parts.view = tagPart(view, "view"); parts.bezel = tagPart(bezel, "bezel");

    /* textbook: navy cover + cream page block (bevelled extrusion) + the diagram plane */
    var book = new THREE.Group();
    function rrShape(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
    var cover = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(3.06, 3.06, 0.1), { depth: 0.07, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 10 }), new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.6 }));
    cover.position.z = -0.16; book.add(cover);
    var pages = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(2.96, 2.96, 0.06), { depth: 0.1, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 8 }), new THREE.MeshStandardMaterial({ color: 0xf4ecd6, roughness: 0.9 }));
    pages.position.z = -0.08; book.add(pages);
    var pgCanvas = mkCanvas(CS, CS), pgTex = srgb(new THREE.CanvasTexture(pgCanvas)); pgTex.anisotropy = 4;
    var PG = 2.8, pgScale = PG / CS;
    var diagram = new THREE.Mesh(new THREE.PlaneGeometry(PG, PG), new THREE.MeshBasicMaterial({ map: pgTex, toneMapped: false })); diagram.position.z = 0.04; book.add(diagram);
    book.rotation.y = -0.1; root.add(book);
    parts.book = tagPart(book, "book"); parts.diagram = tagPart(diagram, "diagram");

    // invisible hit quads, one per structure (so narrator rect()/highlight() and taps work per row)
    var hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    var hits = {};
    ALL_IDS.forEach(function (id) { var m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hitMat); m.position.z = 0.06; m.visible = true; book.add(m); hits[id] = m; parts[id] = tagPart(m, id); });

    /* state: per-item displayed alpha eases toward target */
    var alpha = {}, rows = [], judged = [], visMap = {}, dirtyPage = true, dirtyEye = true, evInfo = { field_mm: 0, across: 0 };
    function judgeAll() {
      var spec = SPECIMENS[S.specimen]; judged = spec.items.map(function (it) { return judge(it, S.M, spec); });
      visMap = {}; judged.forEach(function (j) { visMap[j.id] = j.visible; });
      var an = ANCHORS[S.specimen];
      rows = judged.map(function (j) { return { id: j.id, name: j.name, vis: j.visible, reason: j.reason, ax: an[j.id][0], ay: an[j.id][1] }; }).sort(function (a, b) { return a.ay - b.ay; });
      var rh = 470 / rows.length; rows.forEach(function (r, i) { r.y = 100 + rh * (i + 0.5) + 6; });
      ALL_IDS.forEach(function (id) { var h = hits[id], r = null; for (var i = 0; i < rows.length; i++) if (rows[i].id === id) r = rows[i];
        if (!r) { h.visible = false; return; } h.visible = true; h.scale.set(300 * pgScale, rh * pgScale, 1); h.position.set((330 + 150 - CS / 2) * pgScale, (CS / 2 - (r.y - 8)) * pgScale, 0.06); });
      rows.forEach(function (r) { if (alpha[r.id] == null) alpha[r.id] = r.vis ? 1 : 0.18; });
      dirtyPage = true; dirtyEye = true;
    }
    function reading() {
      var spec = SPECIMENS[S.specimen], field = 160 / S.M;
      var vis = judged.filter(function (j) { return j.visible; });
      return {
        M: S.M, eyepiece: 10, objective: S.M / 10, specimen: S.specimen, stain: spec.stain, field_mm: +field.toFixed(3),
        cellWidth_um: spec.cellWidth_um, cells_across: +(field * 1000 / spec.cellWidth_um).toFixed(1),
        resolvingLimit_um: LIMIT_UM, eyeLimit_mm: EYE_MM,
        items: judged.map(function (j) { return { id: j.id, name: j.name, size_um: j.size_um, image_mm: j.image_mm, visible: j.visible, reason: j.reason, why: j.why }; }),
        visibleCount: vis.length, hiddenCount: judged.length - vis.length, visible: vis.map(function (j) { return j.id; }),
        hidden: judged.filter(function (j) { return !j.visible; }).map(function (j) { return j.id; })
      };
    }
    function fire(name, detail) {
      if (onEvent) { try { onEvent(name, detail); } catch (e) {} }
      if (typeof document !== "undefined") { try { document.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e2) {} }
    }
    function layout(a) {
      if (a != null) aspect = a;
      var portrait = aspect < 0.95, tb = S.showTextbook;
      book.visible = tb; var fit;
      if (!tb) { ey.position.set(0, 0, 0); fit = { target: [0, 0, 0], w: 2.9, h: 2.9 }; }
      else if (portrait) { ey.position.set(0, 2.0, 0); book.position.set(0, -1.15, 0); fit = { target: [0, 0.15, 0], w: 3.3, h: 6.1 }; }
      else { ey.position.set(-2.1, 0, 0); book.position.set(1.9, 0, 0); fit = { target: [0.15, 0, 0], w: 7.2, h: 3.4 }; }
      g.userData.fit = fit; return fit;
    }
    function setState(n) {
      n = n || {}; var changed = false;
      if (n.specimen != null && SPECIMENS[n.specimen] && n.specimen !== S.specimen) { S.specimen = n.specimen; changed = true; alpha = {}; }
      if (n.M != null && +n.M !== S.M) { S.M = +n.M; changed = true; }
      if (n.showTextbook != null) { S.showTextbook = !!n.showTextbook; layout(); }
      if (n.aspect != null) layout(n.aspect);
      if (changed || n.force) { judgeAll(); fire("slide-view:change", reading()); }
    }
    function pickItem(id) { var r = reading().items.filter(function (i) { return i.id === id; })[0]; if (r) fire("slide-view:item", r); return r || null; }

    var evSeed = 5;
    function update(dt, t) {
      dt = Math.min(dt || 0.016, 0.05);
      var k = 1 - Math.exp(-dt * 6);
      if (Math.abs(Mcur - S.M) > 0.5) { Mcur = Math.exp(Math.log(Mcur) + (Math.log(S.M) - Math.log(Mcur)) * k); dirtyEye = true; } else if (Mcur !== S.M) { Mcur = S.M; dirtyEye = true; }
      rows.forEach(function (r) { var target = r.vis ? 1 : 0.18, cur = alpha[r.id]; if (Math.abs(cur - target) > 0.003) { alpha[r.id] = cur + (target - cur) * k; dirtyPage = true; } else if (cur !== target) { alpha[r.id] = target; dirtyPage = true; } });
      if (dirtyEye) { dirtyEye = false; evInfo = drawEyepiece(evCanvas, S.specimen, Mcur, visMap, evSeed); evTex.needsUpdate = true; }
      if (dirtyPage && S.showTextbook) { dirtyPage = false; drawDiagram(pgCanvas.getContext("2d"), S.specimen, alpha, rows); pgTex.needsUpdate = true; }
    }

    var g = attachCompat(root, parts, update, setState);
    g.reading = reading; g.pickItem = pickItem; g.layout = layout;
    g.userData.reading = reading; g.userData.layout = layout; g.userData.pickItem = pickItem; g.userData.itemIds = ALL_IDS.slice();
    judgeAll(); layout(aspect);
    // start from the settled state (no initial fade)
    rows.forEach(function (r) { alpha[r.id] = r.vis ? 1 : 0.18; }); Mcur = S.M;
    update(0.016, 0);
    return g;
  }

  global.SlideViewKit = { version: 1, create: create, makeHighlighter: makeHighlighter, specimens: Object.keys(SPECIMENS), resolvingLimit_um: LIMIT_UM };
})(window);
