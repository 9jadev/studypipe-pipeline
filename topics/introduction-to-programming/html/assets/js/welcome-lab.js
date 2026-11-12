/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab · Introduction to Computer Programming
   Ikogosi Microcontroller, ALU & 8-Slot RAM Architecture Stage.
   Three deterministic modes:
     high-level        Parse & run high-level statements:
                         0: energy = units * 68.0       → 8160.0 (float, OK)
                         1: total = "150" + 20          → TypeError (str + int trap)
                         2: total = int("150") + 20     → 170 (int, OK)
     assembly-machine  Step 4 CPU machine cycles (FETCH, DECODE, EXECUTE ALU, STORE)
                       with assembly mnemonics and 8-bit binary / hex codes (0x7E).
     memory-slots      Inspect 8 contiguous RAM slots (0x00 .. 0x07, indices 0..7)
                       holding Ikogosi telemetry variables (bool, int, float, str, byte).
   Apparatus is modelled with extruded bevelled PCB, QFP CPU package with gull-wing pins,
   Control Unit (CU), V-chevron Arithmetic Logic Unit (ALU), lathe-turned quartz crystal
   clock oscillator, 8-trace glowing copper bus with moving binary packets, 8-slot DIMM RAM
   rack, and angled OLED diagnostic terminal.
   Exposes window.StudyLab for StudyNarrator:
     rect(part) · highlight(part) · setMode(m) · setStmt(i) · parse() · setCycle(c) · step()
     setSlot(s) · state() · reset() · openTapFor()
   Emits CustomEvent "lab:result" { mode, ... } after every learner action.
   Classic script, no modules, 100% offline.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("lab-canvas");
  var labRoot = document.getElementById("lab");
  if (!canvas || !labRoot) return;

  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    info: $("lab-info"), toast: $("endpoint-toast"), legend: $("lab-legend"), fallback: $("lab-fallback"),
    cSlide: $("lab-cycle"), cOut: $("lab-cycle-out"), sSlide: $("lab-slot"), sOut: $("lab-slot-out"),
    parseBtn: $("lab-parse"), stepBtn: $("lab-step"), allocBtn: $("lab-alloc")
  };
  var K = [1, 2, 3, 4].map(function (i) { return { k: $("hud-k" + i), v: $("hud-v" + i) }; });
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- deterministic computer architecture model ---------------- */
  var STMTS = [
    {
      code: "energy = units * 68.0",
      tokens: "IDENT · ASSIGN · IDENT · MULT · FLOAT",
      acc: "8160.0 (float)",
      bus: "0x01 → ALU → 0x02",
      status: "4 cycles · OK",
      ok: true,
      slot: 2,
      explain: "<b>Valid arithmetic:</b> <code>units</code> (120 at <code>0x01</code>) × <code>68.0</code> evaluates in the ALU to <b>8160.0</b> and stores in <code>0x02</code>."
    },
    {
      code: 'total = "150" + 20',
      tokens: "IDENT · ASSIGN · STR · PLUS · INT",
      acc: "TypeError!",
      bus: "ALU FAULT (0x7E)",
      status: "HALT · TypeError",
      ok: false,
      slot: 1,
      explain: "<b>The String Trap (Clue 1):</b> quotes make <code>\"150\"</code> a text string. Python refuses to add <code>str + int</code> (or joins two strings into <code>\"15020\"</code>)."
    },
    {
      code: 'total = int("150") + 20',
      tokens: "IDENT · ASSIGN · CAST(int) · PLUS · INT",
      acc: "170 (int)",
      bus: "CAST → ALU → 0x01",
      status: "4 cycles · OK",
      ok: true,
      slot: 1,
      explain: "<b>Type casting fix:</b> <code>int(\"150\")</code> converts the text digits into integer <code>150</code> first, so the ALU computes <b>150 + 20 = 170 kWh</b>."
    }
  ];

  var CYCLES = [
    {
      stage: "1 · FETCH",
      pc: "PC = 0x10",
      asm: "LOAD R1, [0x01]",
      bin: "10110001 (0xB1)",
      part: "cu",
      slot: 1,
      explain: "<b>Cycle 1 (Fetch):</b> the Control Unit reads instruction <code>10110001₂</code> at <code>PC = 0x10</code> and fetches <code>units = 120</code> from RAM slot <code>0x01</code>."
    },
    {
      stage: "2 · DECODE",
      pc: "PC = 0x11",
      asm: "MULT R1, 68.0",
      bin: "11000100 (0xC4)",
      part: "cu",
      slot: 3,
      explain: "<b>Cycle 2 (Decode):</b> the Instruction Decoder translates opcode <code>11000100₂</code> and pulls constant <code>tariff = 68.0</code> from slot <code>0x03</code>."
    },
    {
      stage: "3 · EXECUTE",
      pc: "PC = 0x12",
      asm: "ALU: 120 × 68.0",
      bin: "01111110 (0x7E)",
      part: "alu",
      slot: 2,
      explain: "<b>Cycle 3 (Execute):</b> the Arithmetic Logic Unit multiplies <code>120 × 68.0 = 8160.0</code> and sets status byte <code>0x7E = 01111110₂</code>."
    },
    {
      stage: "4 · STORE",
      pc: "PC = 0x13",
      asm: "STORE [0x02], R1",
      bin: "10010010 (0x92)",
      part: "ram",
      slot: 2,
      explain: "<b>Cycle 4 (Store):</b> the result <code>8160.0</code> travels across the data bus into RAM address <code>0x02</code> (variable <code>energy</code>)."
    }
  ];

  var SLOTS = [
    { addr: "0x00", idx: 0, name: "grid_online", type: "bool (1 B)", val: "False (0)", note: "Mains grid sensor flag. False during the Ikogosi storm." },
    { addr: "0x01", idx: 1, name: "units", type: "int (2 B)", val: "120", note: "Consumed energy units stored as a 16-bit whole number." },
    { addr: "0x02", idx: 2, name: "energy", type: "float (4 B)", val: "8160.0", note: "Calculated energy charge (120 × 68.0) in floating-point." },
    { addr: "0x03", idx: 3, name: "tariff", type: "float (4 B)", val: "68.0", note: "Constant microgrid tariff rate in Naira per kWh." },
    { addr: "0x04", idx: 4, name: "site", type: "str (7 B)", val: '"Ikogosi"', note: "Text string literal enclosed in quotes (7 ASCII bytes)." },
    { addr: "0x05", idx: 5, name: "cells[0]", type: "float (4 B)", val: "3.25 V", note: "First lithium battery cell at zero-based index 0." },
    { addr: "0x06", idx: 6, name: "cells[7]", type: "float (4 B)", val: "3.20 V", note: "Eighth (last) battery cell at index N − 1 = 7." },
    { addr: "0x07", idx: 7, name: "status_reg", type: "byte (1 B)", val: "0x7E (01111110₂)", note: "8-bit hardware register: hex 7 = 0111₂, hex E = 1110₂ (126₁₀)." }
  ];

  var state = { mode: "high-level", stmt: 0, cycle: 0, slot: 0, runs: 0, picked: null };

  function emit(detail) { document.dispatchEvent(new CustomEvent("lab:result", { detail: detail })); }
  function hud(rows) { rows.forEach(function (r, i) { if (K[i] && K[i].k) { K[i].k.textContent = r[0]; K[i].v.textContent = r[1]; } }); }
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
  labRoot.querySelectorAll("[data-stmt]").forEach(function (b) {
    b.addEventListener("click", function () { setStmt(+b.getAttribute("data-stmt"), true); });
  });
  if (ui.parseBtn) ui.parseBtn.addEventListener("click", function () { parseStmt(true); });
  if (ui.cSlide) {
    ui.cSlide.addEventListener("input", function () { setCycle(+ui.cSlide.value, false); });
    ui.cSlide.addEventListener("change", function () { setCycle(+ui.cSlide.value, true); });
  }
  if (ui.stepBtn) ui.stepBtn.addEventListener("click", function () { setCycle((state.cycle + 1) % 4, true); });
  if (ui.sSlide) {
    ui.sSlide.addEventListener("input", function () { setSlot(+ui.sSlide.value, false); });
    ui.sSlide.addEventListener("change", function () { setSlot(+ui.sSlide.value, true); });
  }
  if (ui.allocBtn) ui.allocBtn.addEventListener("click", function () { inspectSlot(true); });

  /* ======================= 3D SceneKit / THREE ======================= */
  var gl = typeof THREE !== "undefined" && window.SceneKit && SceneKit.hasWebGL();
  var renderer, scene, camera, P = {}, ramModules = [], flows = [], hi = null;
  var view = { yaw: 0.12, pitch: 0.64, dist: 3.6, target: null, lastTouch: -1e9 };
  var visible = true;

  var M = {};
  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.55 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function canvasTex(w, h, draw) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if ("colorSpace" in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }
  function rrShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function block(w, h, d, r, mat, bevel) {
    var b = bevel == null ? Math.min(0.008, r * 0.5) : bevel;
    var geo = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, d - 2 * b, Math.max(0.001, r - b)), {
      depth: h - 2 * b, bevelEnabled: b > 0, bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 6
    });
    geo.rotateX(-Math.PI / 2); geo.translate(0, b, 0);
    return new THREE.Mesh(geo, mat);
  }
  function lathe(profile, mat, seg) {
    var pts = profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    return new THREE.Mesh(new THREE.LatheGeometry(pts, seg || 20), mat);
  }
  function labelPlane(text, w, h, opts) {
    opts = opts || {};
    var tex = canvasTex(512, Math.max(64, Math.round(512 * h / w)), function (g, cw, ch) {
      g.fillStyle = opts.bg || "#0c1f17"; g.fillRect(0, 0, cw, ch);
      if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = 6; g.strokeRect(4, 4, cw - 8, ch - 8); }
      g.fillStyle = opts.fg || "#e6f7ef";
      g.font = "700 " + Math.round(ch * (opts.size || 0.42)) + "px monospace";
      g.textAlign = "center"; g.textBaseline = "middle";
      var lines = String(text).split("\n");
      lines.forEach(function (ln, i) {
        g.fillText(ln, cw / 2, ch / 2 + (i - (lines.length - 1) / 2) * ch * (opts.lh || 0.42));
      });
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), std(0xffffff, 0.5, 0, { map: tex }));
  }

  function makeMaterials() {
    var pcbTex = canvasTex(512, 512, function (g, w, h) {
      g.fillStyle = "#0b3b24"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(46, 213, 115, 0.14)"; g.lineWidth = 2;
      for (var i = 16; i < w; i += 24) {
        g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke();
        g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke();
      }
      g.fillStyle = "rgba(212, 175, 55, 0.35)";
      for (var k = 24; k < w; k += 48) {
        g.beginPath(); g.arc(k, 24, 4, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(k, h - 24, 4, 0, Math.PI * 2); g.fill();
      }
    });
    M.pcb = std(0xffffff, 0.62, 0.1, { map: pcbTex });
    M.silicon = std(0x161b22, 0.35, 0.45);
    M.lid = std(0x2a313c, 0.28, 0.75);
    M.gold = std(0xd9a441, 0.25, 0.92);
    M.copper = std(0xc87d46, 0.3, 0.85);
    M.steel = std(0xb8c2cc, 0.22, 0.9);
    M.slotBody = std(0x1b2430, 0.45, 0.2);
    M.ramChip = std(0x123524, 0.4, 0.25);
    M.ramActive = std(0x2ed573, 0.25, 0.2, { emissive: 0x10b981, emissiveIntensity: 0.65 });
    M.aluBody = std(0x1e293b, 0.32, 0.55);
    M.cuBody = std(0x172554, 0.35, 0.5);
    M.busTrace = std(0x10b981, 0.3, 0.4, { emissive: 0x059669, emissiveIntensity: 0.45 });
    M.packet = std(0x7cf3ff, 0.2, 0, { emissive: 0x38e1ff, emissiveIntensity: 1.5 });
    M.packetErr = std(0xff4757, 0.2, 0, { emissive: 0xff3838, emissiveIntensity: 1.6 });
  }

  function buildBoard() {
    var g = new THREE.Group();
    var base = block(1.92, 0.055, 1.32, 0.04, M.pcb);
    base.position.y = -0.055;
    g.add(base);
    // 4 brass corner standoffs
    [[-0.88, -0.58], [0.88, -0.58], [-0.88, 0.58], [0.88, 0.58]].forEach(function (p) {
      var post = lathe([[0, 0], [0.028, 0], [0.028, 0.06], [0.018, 0.065], [0.018, 0.08], [0, 0.08]], M.gold, 16);
      post.position.set(p[0], -0.06, p[1]);
      g.add(post);
    });
    var silk = labelPlane("IKOGOSI-GRID MCU REV 4.2 · 8-BIT BUS", 0.72, 0.055, { bg: "#092b1a", fg: "#7bed9f", size: 0.55 });
    silk.rotation.x = -Math.PI / 2;
    silk.position.set(0, 0.002, 0.56);
    g.add(silk);
    return g;
  }

  function buildCPU() {
    var g = new THREE.Group();
    var pkg = block(0.68, 0.07, 0.68, 0.025, M.silicon);
    g.add(pkg);
    var spreader = block(0.50, 0.025, 0.50, 0.02, M.lid);
    spreader.position.y = 0.07;
    g.add(spreader);
    var lbl = labelPlane("IKOGOSI-MCU\n32-BIT CORE", 0.42, 0.16, { bg: "#1b222c", fg: "#f1f5f9", border: "#d9a441", size: 0.34 });
    lbl.rotation.x = -Math.PI / 2;
    lbl.position.set(0, 0.096, 0.14);
    g.add(lbl);
    // Gold QFP gull-wing pins on all 4 sides
    var pinGeo = new THREE.BoxGeometry(0.014, 0.018, 0.045);
    for (var i = -5; i <= 5; i++) {
      var offset = i * 0.052;
      var pN = new THREE.Mesh(pinGeo, M.gold); pN.position.set(offset, 0.015, -0.355); g.add(pN);
      var pS = new THREE.Mesh(pinGeo, M.gold); pS.position.set(offset, 0.015, 0.355); g.add(pS);
      var pW = new THREE.Mesh(pinGeo, M.gold); pW.rotation.y = Math.PI / 2; pW.position.set(-0.355, 0.015, offset); g.add(pW);
      var pE = new THREE.Mesh(pinGeo, M.gold); pE.rotation.y = Math.PI / 2; pE.position.set(0.355, 0.015, offset); g.add(pE);
    }
    g.position.set(-0.48, 0, 0.06);
    return g;
  }

  function buildCU() {
    var g = new THREE.Group();
    var body = block(0.28, 0.065, 0.22, 0.012, M.cuBody);
    g.add(body);
    var top = labelPlane("CONTROL UNIT\nPC · DECODER", 0.25, 0.18, { bg: "#0f172a", fg: "#38bdf8", border: "#38bdf8", size: 0.32 });
    top.rotation.x = -Math.PI / 2;
    top.position.y = 0.067;
    g.add(top);
    g.position.set(-0.48, 0.095, -0.08);
    return g;
  }

  function buildALU() {
    var g = new THREE.Group();
    // Classic V-notched ALU chevron shape
    var s = new THREE.Shape();
    s.moveTo(-0.18, -0.14);
    s.lineTo(0.18, -0.08);
    s.lineTo(0.18, 0.08);
    s.lineTo(-0.18, 0.14);
    s.lineTo(-0.18, 0.04);
    s.lineTo(-0.08, 0);
    s.lineTo(-0.18, -0.04);
    s.closePath();
    var geo = new THREE.ExtrudeGeometry(s, { depth: 0.075, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
    geo.rotateX(-Math.PI / 2);
    var mesh = new THREE.Mesh(geo, M.aluBody);
    g.add(mesh);
    var tag = labelPlane("ALU · + − × ÷\nAND · OR · NOT", 0.24, 0.12, { bg: "#1e293b", fg: "#fbbf24", border: "#fbbf24", size: 0.30 });
    tag.rotation.x = -Math.PI / 2;
    tag.position.set(0.02, 0.082, 0);
    g.add(tag);
    g.position.set(-0.02, 0.02, 0.06);
    return g;
  }

  function buildClock() {
    var g = new THREE.Group();
    var can = lathe([[0, 0], [0.065, 0], [0.065, 0.12], [0.058, 0.135], [0, 0.138]], M.steel, 24);
    can.position.y = 0.02;
    g.add(can);
    [-0.03, 0.03].forEach(function (x) {
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.03, 8), M.gold);
      leg.position.set(x, 0.01, 0);
      g.add(leg);
    });
    var badge = labelPlane("CLK 16MHz", 0.14, 0.045, { bg: "#1e293b", fg: "#a3e635", size: 0.5 });
    badge.position.set(0, 0.17, 0);
    g.add(badge);
    g.position.set(-0.74, 0, -0.38);
    return g;
  }

  function buildRAM() {
    var g = new THREE.Group();
    var rackBase = block(0.58, 0.035, 0.94, 0.016, M.slotBody);
    g.add(rackBase);
    ramModules = [];
    for (var i = 0; i < 8; i++) {
      var slotG = new THREE.Group();
      var z = -0.385 + i * 0.11;
      var dimm = block(0.48, 0.13, 0.068, 0.008, M.ramChip.clone());
      dimm.position.y = 0.035;
      slotG.add(dimm);
      // Gold edge fingers
      var edge = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.018, 0.072), M.gold);
      edge.position.y = 0.032;
      slotG.add(edge);
      // Address & index label on top of each DIMM
      var info = SLOTS[i];
      var topLbl = labelPlane(info.addr + " [" + i + "]  " + info.name, 0.44, 0.052, {
        bg: "#092618", fg: "#a7f3d0", size: 0.52
      });
      topLbl.rotation.x = -Math.PI / 2;
      topLbl.position.set(0, 0.168, 0);
      slotG.add(topLbl);
      slotG.position.set(0, 0, z);
      slotG.userData.dimm = dimm;
      slotG.userData.baseY = 0;
      g.add(slotG);
      ramModules.push(slotG);
    }
    g.position.set(0.54, 0, 0.04);
    return g;
  }

  function buildBus() {
    var g = new THREE.Group();
    flows = [];
    for (var i = 0; i < 4; i++) {
      var z = -0.10 + i * 0.07;
      var p0 = new THREE.Vector3(-0.18, 0.025, z + 0.06);
      var p1 = new THREE.Vector3(0.05, 0.045, z + 0.04);
      var p2 = new THREE.Vector3(0.26, 0.025, z);
      var curve = new THREE.CatmullRomCurve3([p0, p1, p2]);
      var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.007, 8, false), M.busTrace);
      g.add(tube);
      var dots = [];
      for (var d = 0; d < 3; d++) {
        var sp = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 8), M.packet);
        sp.userData.u = (d / 3 + i * 0.12) % 1;
        g.add(sp);
        dots.push(sp);
      }
      flows.push({ curve: curve, dots: dots });
    }
    return g;
  }

  var termMesh = null;
  function updateTerminalScreen(line1, line2, line3, isErr) {
    if (!termMesh) return;
    var tex = canvasTex(512, 192, function (g, w, h) {
      g.fillStyle = isErr ? "#2b0912" : "#071a12";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = isErr ? "#ff4757" : "#2ed573";
      g.lineWidth = 6;
      g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = isErr ? "#ff6b81" : "#7bed9f";
      g.font = "700 26px monospace";
      g.fillText(line1 || "", 24, 48);
      g.fillStyle = "#f1f5f9";
      g.font = "600 24px monospace";
      g.fillText(line2 || "", 24, 98);
      g.fillStyle = isErr ? "#ffa502" : "#38bdf8";
      g.font = "600 22px monospace";
      g.fillText(line3 || "", 24, 148);
    });
    termMesh.material.map = tex;
    termMesh.material.needsUpdate = true;
  }

  function buildTerminal() {
    var g = new THREE.Group();
    var stand = block(0.76, 0.24, 0.08, 0.015, M.slotBody);
    g.add(stand);
    termMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.20), std(0xffffff, 0.35, 0));
    termMesh.position.set(0, 0.125, 0.042);
    g.add(termMesh);
    g.position.set(-0.22, 0, -0.46);
    g.rotation.x = -0.18;
    return g;
  }

  function build3D() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    canvas.style.touchAction = "pan-y";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1.6, 0.05, 50);
    view.target = new THREE.Vector3();
    scene.add(new THREE.HemisphereLight(0xe2f8ee, 0x0b1711, 0.95));
    var key = new THREE.DirectionalLight(0xfff6e5, 1.35); key.position.set(2.2, 4.2, 3.0); scene.add(key);
    var rim = new THREE.DirectionalLight(0x38bdf8, 0.65); rim.position.set(-2.8, 2.4, -2.5); scene.add(rim);

    makeMaterials();
    P.board = buildBoard();
    P.cpu = buildCPU();
    P.cu = buildCU();
    P.alu = buildALU();
    P.clock = buildClock();
    P.bus = buildBus();
    P.ram = buildRAM();
    P.terminal = buildTerminal();

    scene.userData.parts = P;

    ["board", "cpu", "cu", "alu", "clock", "bus", "ram", "terminal"].forEach(function (k) {
      scene.add(P[k]);
      P[k].traverse(function (o) {
        if (o.isMesh) {
          if (o.material !== M.packet && o.material !== M.packetErr && o !== termMesh) {
            o.material = o.material.clone();
          }
          o.userData.pk = k;
        }
      });
    });

    var down = null;
    canvas.addEventListener("pointerdown", function (e) {
      down = { x: e.clientX, y: e.clientY, yaw: view.yaw, drag: false };
      view.lastTouch = performance.now();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.drag && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) down.drag = true;
      if (down.drag) {
        view.yaw = Math.max(-0.85, Math.min(0.85, down.yaw - dx * 0.008));
        view.lastTouch = performance.now();
      }
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
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
    }
    refit();
    requestAnimationFrame(frame);
  }

  var fitBox = null;
  function refit() {
    if (!scene) return;
    var box = new THREE.Box3();
    scene.updateMatrixWorld(true);
    Object.keys(P).forEach(function (k) { if (P[k].visible) box.expandByObject(P[k]); });
    if (box.isEmpty()) return;
    fitBox = box;
    resize();
  }
  function resize() {
    if (!renderer) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!fitBox) return;
    var size = fitBox.getSize(new THREE.Vector3()), c = fitBox.getCenter(new THREE.Vector3());
    var vFov = THREE.MathUtils.degToRad(camera.fov), hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    var projH = size.y * Math.cos(view.pitch) + size.z * Math.sin(view.pitch);
    var dH = (projH / 2 + 0.05) / Math.tan(vFov / 2), dW = (size.x / 2 + 0.05) / Math.tan(hFov / 2);
    view.dist = Math.max(dH, dW) * 1.06 + size.z * 0.22;
    view.target.copy(c);
    view.target.y -= 0.02;
  }

  var INFO = {
    cpu: ["32-bit Microcontroller (CPU)", "Executes binary machine instructions fetched from memory on every clock tick."],
    cu: ["Control Unit & Decoder", "Tracks the Program Counter (PC) and decodes instructions into control signals."],
    alu: ["Arithmetic Logic Unit (ALU)", "Performs arithmetic (+, −, ×, //, %) and boolean logic (AND, OR, NOT, ==, <)."],
    clock: ["16 MHz Quartz Crystal Clock", "Generates steady voltage pulses that synchronise every fetch-decode-execute step."],
    bus: ["8-Bit Address & Data Bus", "Copper traces carrying binary voltage packets (0 V and +3.3 V) between CPU and RAM."],
    ram: ["8-Slot Physical RAM Array", "Volatile memory slots (0x00 to 0x07, indices 0..7) holding typed program variables."],
    terminal: ["OLED Diagnostic Console", "Displays the active Python statement, disassembled mnemonic, or hex register state."],
    board: ["FR-4 Microcontroller Board", "The Ikogosi microgrid embedded controller board."]
  };

  var ray = null, ndc = null;
  function pickAt(e) {
    if (!ray) { ray = new THREE.Raycaster(); ndc = new THREE.Vector2(); }
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    var objs = Object.keys(P).map(function (k) { return P[k]; });
    var hit = ray.intersectObjects(objs, true).filter(function (h) { return h.object.userData.pk; })[0];
    if (!hit) return;
    var k = hit.object.userData.pk, inf = INFO[k];
    if (!inf) return;
    state.picked = k;
    toast("<b>" + inf[0] + "</b><span class=\"mono\">" + inf[1] + "</span>");
    glow(k);
    emit({ mode: state.mode, part: k, name: inf[0] });
  }

  function glow(part) {
    if (hi && hi.part === part) return;
    if (hi) hi.mats.forEach(function (m) { m.mat.emissive.setHex(m.e); m.mat.emissiveIntensity = m.i; });
    hi = null;
    if (!part || !P[part]) return;
    var mats = [];
    P[part].traverse(function (o) {
      if (o.isMesh && o.material && o.material.emissive && o.material !== M.packet && o.material !== M.packetErr) {
        mats.push({ mat: o.material, e: o.material.emissive.getHex(), i: o.material.emissiveIntensity });
      }
    });
    hi = { part: part, mats: mats };
  }

  function highlightActiveSlot(idx) {
    if (!gl) return;
    ramModules.forEach(function (m, i) {
      var active = i === idx;
      m.position.y = active ? 0.055 : 0;
      m.userData.dimm.material.emissive.setHex(active ? 0x10b981 : 0x000000);
      m.userData.dimm.material.emissiveIntensity = active ? 0.65 : 0;
    });
  }

  /* ======================= modes & deterministic controls ======================= */
  function setMode(m, fromLearner) {
    if (m !== "high-level" && m !== "assembly-machine" && m !== "memory-slots") return;
    state.mode = m;
    modeTabs.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m ? "true" : "false"); });
    ctrls.forEach(function (c) { c.hidden = c.getAttribute("data-for") !== m; });
    if (ui.toast) ui.toast.classList.remove("show");

    if (m === "high-level") setStmt(state.stmt, false);
    else if (m === "assembly-machine") setCycle(state.cycle, false);
    else setSlot(state.slot, false);

    if (fromLearner) emit({ mode: m, switched: true });
  }

  function setStmt(idx, fromLearner) {
    idx = Math.max(0, Math.min(STMTS.length - 1, idx | 0));
    state.stmt = idx;
    if (state.mode !== "high-level") setMode("high-level", false);
    var s = STMTS[idx];
    labRoot.querySelectorAll("[data-stmt]").forEach(function (b) {
      b.setAttribute("aria-pressed", +b.getAttribute("data-stmt") === idx ? "true" : "false");
    });
    hud([
      ["Statement", s.code],
      ["Accumulator", s.acc],
      ["Bus Route", s.bus],
      ["Status", s.status]
    ]);
    if (ui.info) ui.info.innerHTML = s.explain;
    if (gl) {
      highlightActiveSlot(s.slot);
      updateTerminalScreen("PYTHON · " + s.code, "TOKENS: " + s.tokens, "RESULT: " + s.acc, !s.ok);
      flows.forEach(function (fl) {
        fl.dots.forEach(function (d) { d.material = s.ok ? M.packet : M.packetErr; });
      });
      glow(s.ok ? "alu" : "cpu");
    }
    if (fromLearner) parseStmt(true);
  }

  function parseStmt(fromLearner) {
    var s = STMTS[state.stmt];
    state.runs++;
    toast("<b>" + s.code + "</b><span class=\"mono\">" + s.acc + " · " + s.status + "</span>");
    if (fromLearner) emit({ mode: "high-level", stmt: state.stmt, code: s.code, ok: s.ok, acc: s.acc, count: state.runs });
  }

  function setCycle(c, fromLearner) {
    c = Math.max(0, Math.min(3, Math.round(c)));
    state.cycle = c;
    if (state.mode !== "assembly-machine") setMode("assembly-machine", false);
    var cy = CYCLES[c];
    if (ui.cSlide) ui.cSlide.value = c;
    if (ui.cOut) ui.cOut.textContent = "Cycle " + (c + 1) + "/4";
    hud([
      ["Stage / PC", cy.stage + " (" + cy.pc + ")"],
      ["Assembly", cy.asm],
      ["Machine Binary", cy.bin],
      ["Target RAM", SLOTS[cy.slot].addr + " [" + cy.slot + "]"]
    ]);
    if (ui.info) ui.info.innerHTML = cy.explain;
    if (gl) {
      highlightActiveSlot(cy.slot);
      updateTerminalScreen(cy.stage + " · " + cy.pc, "ASM: " + cy.asm, "BIN: " + cy.bin, false);
      flows.forEach(function (fl) { fl.dots.forEach(function (d) { d.material = M.packet; }); });
      glow(cy.part);
    }
    if (fromLearner) {
      toast("<b>" + cy.stage + "</b><span class=\"mono\">" + cy.asm + " → " + cy.bin + "</span>");
      emit({ mode: "assembly-machine", cycle: c, stage: cy.stage, asm: cy.asm, bin: cy.bin });
    }
  }

  function setSlot(idx, fromLearner) {
    idx = Math.max(0, Math.min(7, Math.round(idx)));
    state.slot = idx;
    if (state.mode !== "memory-slots") setMode("memory-slots", false);
    var sl = SLOTS[idx];
    if (ui.sSlide) ui.sSlide.value = idx;
    if (ui.sOut) ui.sOut.textContent = sl.addr + " [" + idx + "]";
    hud([
      ["Address / Idx", sl.addr + " (index " + idx + ")"],
      ["Identifier", sl.name],
      ["Data Type", sl.type],
      ["Stored Value", sl.val]
    ]);
    if (ui.info) {
      ui.info.innerHTML = "<b>Slot " + sl.addr + " (0-based index " + idx + "):</b> variable <code>" + sl.name + "</code> holds <b>" + sl.val + "</b> (" + sl.type + "). " + sl.note;
    }
    if (gl) {
      highlightActiveSlot(idx);
      updateTerminalScreen("RAM " + sl.addr + " · INDEX [" + idx + "]", sl.name + " = " + sl.val, "TYPE: " + sl.type, false);
      glow("ram");
    }
    if (fromLearner) inspectSlot(true);
  }

  function inspectSlot(fromLearner) {
    var sl = SLOTS[state.slot];
    toast("<b>" + sl.addr + " · " + sl.name + "</b><span class=\"mono\">" + sl.val + " (" + sl.type + ")</span>");
    if (fromLearner) emit({ mode: "memory-slots", slot: state.slot, addr: sl.addr, name: sl.name, type: sl.type, val: sl.val });
  }

  /* ======================= frame loop ======================= */
  var clock = typeof THREE !== "undefined" ? new THREE.Clock() : null;
  function frame() {
    requestAnimationFrame(frame);
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (!visible || document.hidden) return;

    var speed = state.mode === "assembly-machine" ? 0.35 : 0.25;
    flows.forEach(function (fl) {
      fl.dots.forEach(function (d) {
        if (!reduceMotion) d.userData.u = (d.userData.u + dt * speed) % 1;
        fl.curve.getPointAt(d.userData.u, d.position);
      });
    });

    if (hi) {
      var s = 0.35 + 0.35 * Math.sin(t * 5);
      hi.mats.forEach(function (m) { m.mat.emissive.setHex(0x2ed573); m.mat.emissiveIntensity = s; });
    }
    if (!reduceMotion && performance.now() - view.lastTouch > 4000) {
      view.yaw += (Math.sin(t * 0.22) * 0.24 - view.yaw) * Math.min(1, dt * 0.6);
    }
    var d = view.dist, T = view.target;
    camera.position.set(
      T.x + Math.sin(view.yaw) * Math.cos(view.pitch) * d,
      T.y + Math.sin(view.pitch) * d,
      T.z + Math.cos(view.yaw) * Math.cos(view.pitch) * d
    );
    camera.lookAt(T);
    renderer.render(scene, camera);
  }

  /* ======================= narrator hooks ======================= */
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
    if (part === "high-level" || part === "assembly-machine" || part === "memory-slots") {
      if (state.mode !== part) setMode(part, false);
      glow(null);
      return;
    }
    if (gl && P[part] && P[part].visible) glow(part); else glow(null);
  }

  window.StudyLab = {
    rect: rect,
    highlight: highlight,
    setMode: function (m) { setMode(m, false); },
    setStmt: function (i) { setStmt(i, false); },
    parse: function () { parseStmt(true); },
    setCycle: function (c) { setCycle(c, false); },
    step: function () { setCycle((state.cycle + 1) % 4, true); },
    setSlot: function (s) { setSlot(s, false); },
    state: function () {
      return { mode: state.mode, stmt: state.stmt, cycle: state.cycle, slot: state.slot, runs: state.runs, phase: "run" };
    },
    reset: function () {
      state.stmt = 0; state.cycle = 0; state.slot = 0; state.runs = 0;
      setMode("high-level", false);
    },
    openTapFor: function () {}
  };

  if (gl) {
    try { build3D(); } catch (err) { gl = false; if (window.console) console.warn("StudyLab: 3D disabled", err); }
  }
  if (!gl && ui.fallback) { ui.fallback.hidden = false; canvas.style.visibility = "hidden"; }

  setMode("high-level", false);
})();
