/* ==========================================================
   StudyPipe Kit: programming-zoom (v1)
   Six 3D SceneKit concept close-ups for Introduction to Programming (Lessons 01–06).
   Classic script (no modules), 100 % offline, no fetch, no external textures.
   Needs window.THREE (r160 bundle); window.SceneKit is optional (mount the group on stage.rig).

   window.ProgrammingZoom.create(opts) -> THREE.Group g with:
     g.group / g.parts / g.userData.parts   named parts of the CURRENT mode (each mesh tagged userData.partId)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(obj)        { mode, labels, speed, onEvent, reset, ...mode params }
     g.setMode(mode)        "translation-pipeline" | "decision-tree" | "loop-jump" | "memory-offset" | "stack-frame" | "silicon-bridge"
     g.reading()            numbers & state of the current mode, computed from ProgrammingZoom.model (never fixed text)
     g.highlight(part)      pulsing emissive highlight (null clears)
     g.viewFor(part)        { target:[x,y,z], dist, pitch } camera framing
     g.pickPart(raycaster)  -> partId | null
     g.triangles()          triangle count of the visible mode
     g.reset()              reset current mode to defaults
   ========================================================== */
(function (global) {
  "use strict";

  /* ===================================================================
     1. THE COMPUTATIONAL MODEL (pure functions; single source of readings)
     =================================================================== */
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function rd(x, d) { var p = Math.pow(10, d || 2); return Math.round(x * p) / p; }
  function toHex(n, pad) {
    var v = Math.max(0, Math.floor(n)) >>> 0;
    var s = v.toString(16).toUpperCase();
    while (s.length < (pad || 2)) s = "0" + s;
    return "0x" + s;
  }
  function toBin8(n) {
    var v = (Math.floor(n) & 0xFF) >>> 0;
    var s = v.toString(2);
    while (s.length < 8) s = "0" + s;
    return s;
  }

  /* Lesson 01: translation-pipeline */
  var STAGE_NAMES_L01 = ["source_code", "lexer_parser_ast", "translator_gate", "alu_silicon_die"];
  function solveTranslationPipeline(p) {
    var step = clamp(Math.round(p.step || 0), 0, 3);
    var translator = p.translator === "interpreter" ? "interpreter" : "compiler";
    var rawVal = parseInt(String(p.raw_str != null ? p.raw_str : "85"), 10);
    if (isNaN(rawVal)) rawVal = 85;
    var addend = p.addend != null ? +p.addend : 20;
    var totalKwh = rawVal + addend;
    var binOut = toBin8(totalKwh);
    var hexOut = toHex(totalKwh, 2);
    var tokens = ["IDENT(total_kwh)", "ASSIGN(=)", "CALL(int)", "ARG(raw_str)", "OP(+)", "LIT(" + addend + ")"];
    var passes = translator === "compiler" ? 1 : 4;
    var latencyMs = translator === "compiler" ? rd(0.45 * (step + 1), 2) : rd(1.85 * (step + 1), 2);
    var outputForm = translator === "compiler" ? "Native Machine Binary (.exe / ELF)" : "Line-by-Line Bytecode (.pyc -> PVM)";
    return {
      mode: "translation-pipeline",
      step: step,
      stageName: STAGE_NAMES_L01[step],
      translator: translator,
      sourceExpr: "total_kwh = int(\"" + rawVal + "\") + " + addend,
      tokenCount: tokens.length,
      tokens: tokens,
      passes: passes,
      outputForm: outputForm,
      rawInt: rawVal,
      addend: addend,
      total_kwh: totalKwh,
      binaryPulse: binOut,
      hexOpcode: hexOut,
      latency_ms: latencyMs,
      aluActive: step === 3
    };
  }

  /* Lesson 02: decision-tree */
  var STAGE_NAMES_L02 = ["sensor_input", "root_battery_check", "second_grid_check", "action_terminal"];
  function solveDecisionTree(p) {
    var step = clamp(Math.round(p.step || 0), 0, 3);
    var battery = clamp(p.battery != null ? +p.battery : 15, 0, 100);
    var gridOnline = Boolean(p.grid_online);
    var cond1 = battery < 20;
    var cond2 = !gridOnline;
    var compoundTrue = cond1 && cond2;
    var activeAction = compoundTrue ? "activate_generator()" : "maintain_solar_charge()";
    var branchPath = !cond1
      ? ["rootDiamond", "falseBranch", "solarAction"]
      : (cond2
        ? ["rootDiamond", "trueBranch", "secondDiamond", "genAction"]
        : ["rootDiamond", "trueBranch", "secondDiamond", "falseBranch", "solarAction"]);
    return {
      mode: "decision-tree",
      step: step,
      stageName: STAGE_NAMES_L02[step],
      battery: battery,
      grid_online: gridOnline,
      cond1_expr: "battery < 20",
      cond1_val: cond1,
      cond2_expr: "not grid_online",
      cond2_val: cond2,
      compound_expr: "(battery < 20) and (not grid_online)",
      compound_val: compoundTrue,
      activeAction: activeAction,
      generatorRelayOn: compoundTrue,
      branchPath: branchPath
    };
  }

  /* Lesson 03: loop-jump */
  var STAGE_NAMES_L03 = ["init_i", "test_condition", "loop_body_accumulate", "step_and_back_jump"];
  var DEFAULT_KWH = [0, 45, 52, 60, 58, 49];
  function solveLoopJump(p) {
    var step = clamp(Math.round(p.step || 0), 0, 3);
    var stop = clamp(Math.round(p.stop || 6), 2, 8);
    var iter = clamp(Math.round(p.iter != null ? p.iter : 1), 1, stop);
    var kwhArr = Array.isArray(p.kwh) && p.kwh.length >= stop ? p.kwh : DEFAULT_KWH;
    var condTrue = iter < stop;
    var totalBefore = 0;
    for (var k = 1; k < iter && k < stop; k++) {
      totalBefore += (kwhArr[k] || 50);
    }
    var curReading = condTrue ? (kwhArr[iter] || 50) : 0;
    var totalAfter = condTrue && step >= 2 ? totalBefore + curReading : totalBefore;
    var jumpingBack = condTrue && step === 3;
    var exitingLoop = !condTrue;
    return {
      mode: "loop-jump",
      step: step,
      stageName: exitingLoop ? "loop_terminated_exit" : STAGE_NAMES_L03[step],
      iter: iter,
      stop: stop,
      conditionExpr: "i < " + stop,
      conditionResult: condTrue,
      currentKwh: curReading,
      totalBefore: totalBefore,
      total: totalAfter,
      nextIter: condTrue ? iter + 1 : iter,
      backEdgeActive: jumpingBack,
      exitChuteActive: exitingLoop
    };
  }

  /* Lesson 04: memory-offset */
  var DEFAULT_CELLS = [3.2, 3.3, 3.1, 3.2, 3.4, 3.0, 3.3, 3.2];
  function solveMemoryOffset(p) {
    var base = p.base != null ? +p.base : 0x1000;
    var elemSize = p.elemSize != null ? +p.elemSize : 4;
    var len = p.length != null ? +p.length : 8;
    var idx = clamp(Math.round(p.index != null ? p.index : 0), 0, len);
    var vals = Array.isArray(p.values) && p.values.length >= len ? p.values : DEFAULT_CELLS;
    var offsetBytes = idx * elemSize;
    var address = base + offsetBytes;
    var inBounds = idx >= 0 && idx < len;
    var value = inBounds ? vals[idx] : null;
    return {
      mode: "memory-offset",
      index: idx,
      length: len,
      maxValidIndex: len - 1,
      baseAddress: toHex(base, 4),
      baseDec: base,
      elemSizeBytes: elemSize,
      offsetBytes: offsetBytes,
      addressHex: toHex(address, 4),
      addressDec: address,
      formula: toHex(base, 4) + " + (" + idx + " × " + elemSize + ") = " + toHex(address, 4),
      inBounds: inBounds,
      elementValue: value,
      status: inBounds ? "VALID_READ (" + value.toFixed(1) + " V)" : "IndexError: list index 8 out of range (0..7)"
    };
  }

  /* Lesson 05: stack-frame */
  var STAGE_NAMES_L05 = ["idle", "push", "execute", "return_pop"];
  function solveStackFrame(p) {
    var step = clamp(Math.round(p.step || 0), 0, 3);
    var units = p.units != null ? +p.units : 85;
    var tariff = p.tariff_rate != null ? +p.tariff_rate : 68.0;
    var vatRate = p.vat_rate != null ? +p.vat_rate : 0.075;
    var fixed = p.fixed_charge != null ? +p.fixed_charge : 1500.0;
    var globalRevBefore = p.global_revenue != null ? +p.global_revenue : 42000.0;

    var energyCost = rd(units * tariff, 2);
    var vatAmount = rd(energyCost * vatRate, 2);
    var totalBill = rd(energyCost + vatAmount + fixed, 2);
    var frameAllocated = step === 1 || step === 2;
    var returnEmitted = step === 3;
    var globalRevAfter = returnEmitted ? rd(globalRevBefore + totalBill, 2) : globalRevBefore;

    return {
      mode: "stack-frame",
      step: step,
      phase: STAGE_NAMES_L05[step],
      frameAllocated: frameAllocated,
      localAccessibleOutside: false,
      global_TARIFF: tariff,
      global_total_revenue: globalRevAfter,
      arg_units: units,
      local_energy_cost: step >= 2 ? energyCost : null,
      local_vat_amount: step >= 2 ? vatAmount : null,
      local_fixed_charge: step >= 2 ? fixed : null,
      local_total_bill: step >= 2 ? totalBill : null,
      returnValue: step >= 2 ? totalBill : null,
      returnDelivered: returnEmitted
    };
  }

  /* Lesson 06: silicon-bridge */
  var TIER_NAMES_L06 = ["python_high_level", "assembly_isa", "hex_binary_register", "cmos_silicon_gate"];
  function solveSiliconBridge(p) {
    var tier = clamp(Math.round(p.tier || 0), 0, 3);
    var byteVal = clamp(Math.round(p.byteVal != null ? p.byteVal : 0x7E), 0, 255);
    var total = p.total != null ? +p.total : 36;
    var threshold = p.threshold != null ? +p.threshold : 30;
    var condMet = total >= threshold;
    var binStr = toBin8(byteVal);
    var hexStr = toHex(byteVal, 2);
    var highNib = (byteVal >> 4) & 0xF;
    var lowNib = byteVal & 0xF;
    var bits = binStr.split("").map(function (b) { return +b; });
    var onesCount = bits.reduce(function (a, b) { return a + b; }, 0);
    var lsb = byteVal & 1;
    var msb = (byteVal >> 7) & 1;
    var gateInputBit = condMet ? 1 : 0;
    var vdd = p.vdd != null ? +p.vdd : 3.3;
    var gateVoltage = gateInputBit ? vdd : 0.0;
    var pmosConducting = !gateInputBit;
    var nmosConducting = Boolean(gateInputBit);
    return {
      mode: "silicon-bridge",
      tier: tier,
      tierName: TIER_NAMES_L06[tier],
      pythonCode: "if total >= " + threshold + ": unlock_inverter(" + hexStr + ")",
      asmCode: "CMP R0, #" + threshold + " ; BGE 0x04 ; MOV R1, #" + hexStr,
      byteVal: byteVal,
      hexCode: hexStr,
      binary8: binStr,
      highNibbleBin: binStr.slice(0, 4),
      lowNibbleBin: binStr.slice(4, 8),
      highNibbleHex: highNib.toString(16).toUpperCase(),
      lowNibbleHex: lowNib.toString(16).toUpperCase(),
      onesCount: onesCount,
      msb: msb,
      lsb: lsb,
      total: total,
      threshold: threshold,
      conditionMet: condMet,
      vdd_V: vdd,
      railVoltage_V: rd(gateVoltage, 2),
      logicState: gateInputBit ? "HIGH (1)" : "LOW (0)",
      pmosState: pmosConducting ? "ON (Pull-Up)" : "OFF (Open)",
      nmosState: nmosConducting ? "ON (Conducting)" : "OFF (Cut-off)"
    };
  }

  var MODEL = {
    solveTranslationPipeline: solveTranslationPipeline,
    solveDecisionTree: solveDecisionTree,
    solveLoopJump: solveLoopJump,
    solveMemoryOffset: solveMemoryOffset,
    solveStackFrame: solveStackFrame,
    solveSiliconBridge: solveSiliconBridge
  };

  var DEFAULTS = {
    "translation-pipeline": { step: 0, translator: "compiler", raw_str: "85", addend: 20 },
    "decision-tree": { step: 0, battery: 15, grid_online: false },
    "loop-jump": { step: 0, iter: 1, stop: 6, kwh: [0, 45, 52, 60, 58, 49] },
    "memory-offset": { index: 0, base: 0x1000, elemSize: 4, length: 8, values: [3.2, 3.3, 3.1, 3.2, 3.4, 3.0, 3.3, 3.2] },
    "stack-frame": { step: 0, units: 85, tariff_rate: 68.0, vat_rate: 0.075, fixed_charge: 1500.0, global_revenue: 42000.0 },
    "silicon-bridge": { tier: 0, byteVal: 0x7E, total: 36, threshold: 30, vdd: 3.3 }
  };

  var SOLVE = {
    "translation-pipeline": solveTranslationPipeline,
    "decision-tree": solveDecisionTree,
    "loop-jump": solveLoopJump,
    "memory-offset": solveMemoryOffset,
    "stack-frame": solveStackFrame,
    "silicon-bridge": solveSiliconBridge
  };

  var MODE_LIST = Object.keys(DEFAULTS);

  if (typeof global !== "undefined") {
    global.ProgrammingZoom = { model: MODEL, defaults: DEFAULTS, modes: MODE_LIST, version: 1 };
  }
  if (typeof THREE === "undefined") return;

  var V3 = THREE.Vector3, TAU = Math.PI * 2;

  /* ===================================================================
     2. GEOMETRY, PROCEDURAL CANVAS TEXTURES & COMPAT HELPERS
     =================================================================== */
  function rng(seed) {
    var s = (seed || 1) >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if ("encoding" in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function cnv(w, h) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function ctex(c, rx, ry) {
    var t = srgb(new THREE.CanvasTexture(c));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (rx) t.repeat.set(rx, ry || rx);
    return t;
  }

  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.45 : rough, metalness: 0.08 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }

  function metal(color, rough, extra) {
    var m = std(color, rough == null ? 0.28 : rough, extra);
    m.metalness = 0.82;
    return m;
  }

  function glass(color, op, extra) {
    var m = new THREE.MeshStandardMaterial({
      color: color || 0x8be9fd,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: op == null ? 0.28 : op,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }

  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData = obj.userData || {};
    obj.userData.partId = key;
    if (obj.traverse) {
      obj.traverse(function (c) {
        c.userData = c.userData || {};
        if (!c.userData.partId) c.userData.partId = key;
      });
    }
    return obj;
  }

  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData = g.userData || {};
    g.userData.parts = parts;
    g.userData.update = updateFn;
    g.userData.setState = setStateFn || function () {};
    g.group = g;
    g.parts = parts;
    g.tick = updateFn;
    g.update = updateFn;
    g.setState = g.userData.setState;
    return g;
  }

  function mesh(geo, mat, x, y, z) {
    var m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    if (x != null) m.position.set(x, y, z);
    return m;
  }

  /* Rounded rectangle 2D shape with optional rectangular/circular cavity holes */
  function rrPath(P, cx, cy, w, h, r) {
    var x = cx - w / 2, y = cy - h / 2;
    P.moveTo(x + r, y);
    P.lineTo(x + w - r, y);
    P.quadraticCurveTo(x + w, y, x + w, y + r);
    P.lineTo(x + w, y + h - r);
    P.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    P.lineTo(x + r, y + h);
    P.quadraticCurveTo(x, y + h, x, y + h - r);
    P.lineTo(x, y + r);
    P.quadraticCurveTo(x, y, x + r, y);
    return P;
  }

  function rrShape(w, h, r) {
    return rrPath(new THREE.Shape(), 0, 0, w, h, r || 0.08);
  }

  function frameShape(w, h, r, wall) {
    var s = rrShape(w, h, r);
    var hole = rrPath(new THREE.Path(), 0, 0, w - 2 * wall, h - 2 * wall, Math.max(0.02, r - wall * 0.6));
    s.holes.push(hole);
    return s;
  }

  function diamondShape(w, h, holeScale) {
    var s = new THREE.Shape();
    s.moveTo(0, h / 2);
    s.lineTo(w / 2, 0);
    s.lineTo(0, -h / 2);
    s.lineTo(-w / 2, 0);
    s.closePath();
    if (holeScale && holeScale > 0) {
      var p = new THREE.Path();
      p.moveTo(0, (h / 2) * holeScale);
      p.lineTo((w / 2) * holeScale, 0);
      p.lineTo(0, (-h / 2) * holeScale);
      p.lineTo((-w / 2) * holeScale, 0);
      p.closePath();
      s.holes.push(p);
    }
    return s;
  }

  function extrudeSlab(shape, thick, bevel) {
    var b = bevel == null ? 0.02 : bevel;
    var g = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.005, thick - 2 * b),
      bevelEnabled: b > 0,
      bevelSize: b,
      bevelThickness: b,
      bevelSegments: 2,
      curveSegments: 20
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, b, 0);
    return g;
  }

  function extrudePlate(shape, depth, bevel) {
    var b = bevel == null ? 0.02 : bevel;
    var g = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.005, depth - 2 * b),
      bevelEnabled: b > 0,
      bevelSize: b,
      bevelThickness: b,
      bevelSegments: 2,
      curveSegments: 20
    });
    g.translate(0, 0, -depth / 2 + b);
    return g;
  }

  function v3(a) {
    return Array.isArray(a) ? new V3(a[0], a[1], a[2]) : a;
  }

  function splineTube(pts, r, segs, radSegs, mat) {
    var curve = new THREE.CatmullRomCurve3(pts.map(v3));
    var geo = new THREE.TubeGeometry(curve, segs || 40, r || 0.06, radSegs || 14, false);
    var m = mesh(geo, mat);
    m.userData.curve = curve;
    m.userData.radius = r || 0.06;
    return m;
  }

  function latheGeo(profile, segs) {
    var pts = profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    return new THREE.LatheGeometry(pts, segs || 28);
  }

  /* Optical biconvex lens profile via LatheGeometry */
  function biconvexLensGeo(radius, edgeThick, bulge) {
    var pts = [];
    var N = 16;
    for (var i = 0; i <= N; i++) {
      var u = i / N;
      var r = u * radius;
      var h = (edgeThick / 2) + bulge * (1 - u * u);
      pts.push([r, h]);
    }
    for (var j = N; j >= 0; j--) {
      var u2 = j / N;
      var r2 = u2 * radius;
      var h2 = -(edgeThick / 2) - bulge * (1 - u2 * u2);
      pts.push([r2, h2]);
    }
    var g = latheGeo(pts, 32);
    g.rotateZ(Math.PI / 2);
    return g;
  }

  /* Deterministic procedural textures */
  var TEX = {};
  function once(key, fn) { return TEX[key] || (TEX[key] = fn()); }

  function pcbTex(seed) {
    return once("pcb_" + (seed || 1), function () {
      var c = cnv(512, 256), x = c.getContext("2d"), R = rng(seed || 7);
      x.fillStyle = "#0b2e22";
      x.fillRect(0, 0, 512, 256);
      x.strokeStyle = "rgba(46, 213, 115, 0.22)";
      x.lineWidth = 2;
      for (var i = 0; i < 28; i++) {
        var y0 = 12 + (i * 8.5) % 236;
        x.beginPath();
        x.moveTo(0, y0);
        var cx = 40 + R() * 140;
        x.lineTo(cx, y0);
        x.lineTo(cx + 18, y0 + (R() < 0.5 ? 14 : -14));
        x.lineTo(512, y0 + (R() < 0.5 ? 14 : -14));
        x.stroke();
      }
      x.fillStyle = "#d4af37";
      for (var j = 0; j < 45; j++) {
        var px = 16 + R() * 480, py = 16 + R() * 224;
        x.beginPath();
        x.arc(px, py, 3.2, 0, TAU);
        x.fill();
      }
      return ctex(c, 1, 1);
    });
  }

  function siliconWaferTex() {
    return once("wafer", function () {
      var c = cnv(256, 256), x = c.getContext("2d"), R = rng(19);
      var grd = x.createLinearGradient(0, 0, 256, 256);
      grd.addColorStop(0, "#1a2942");
      grd.addColorStop(0.5, "#2b4268");
      grd.addColorStop(1, "#121c2e");
      x.fillStyle = grd;
      x.fillRect(0, 0, 256, 256);
      x.strokeStyle = "rgba(100, 220, 255, 0.28)";
      x.lineWidth = 1;
      for (var i = 0; i <= 256; i += 16) {
        x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 256); x.stroke();
        x.beginPath(); x.moveTo(0, i); x.lineTo(256, i); x.stroke();
      }
      for (var k = 0; k < 40; k++) {
        x.fillStyle = R() < 0.5 ? "rgba(0, 255, 190, 0.22)" : "rgba(255, 180, 60, 0.18)";
        x.fillRect((R() * 16 | 0) * 16 + 2, (R() * 16 | 0) * 16 + 2, 12, 12);
      }
      return ctex(c, 1, 1);
    });
  }

  function brushedMetalTex(hexBg, seed) {
    return once("metal_" + hexBg + "_" + (seed || 1), function () {
      var c = cnv(256, 64), x = c.getContext("2d"), R = rng(seed || 5);
      x.fillStyle = hexBg || "#4a5568";
      x.fillRect(0, 0, 256, 64);
      for (var i = 0; i < 180; i++) {
        var y = R() * 64;
        x.strokeStyle = R() < 0.5 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
        x.lineWidth = 0.7 + R();
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(256, y + (R() - 0.5) * 1.5);
        x.stroke();
      }
      return ctex(c, 1, 1);
    });
  }

  function drawPanelCanvas(c, title, lines, accentHex, bgHex) {
    var x = c.getContext("2d"), w = c.width, h = c.height;
    x.fillStyle = bgHex || "#0d1824";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = accentHex || "#2ee59d";
    x.lineWidth = 5;
    x.strokeRect(4, 4, w - 8, h - 8);
    if (title) {
      x.fillStyle = accentHex || "#2ee59d";
      x.font = "700 22px ui-monospace, Menlo, monospace";
      x.fillText(title, 18, 34);
    }
    x.fillStyle = "#e8f4fc";
    x.font = "600 20px ui-monospace, Menlo, monospace";
    for (var i = 0; i < lines.length; i++) {
      x.fillText(lines[i], 18, (title ? 66 : 36) + i * 28);
    }
  }

  function makeDynamicPanel(w3d, h3d, cw, ch) {
    var c = cnv(cw || 512, ch || 160);
    var tex = srgb(new THREE.CanvasTexture(c));
    var mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w3d, h3d), mat);
    m.userData.updateText = function (title, lines, accent, bg) {
      drawPanelCanvas(c, title, lines, accent, bg);
      tex.needsUpdate = true;
    };
    return m;
  }

  function makeLabel(ctx, text, x, y, z, colorHex) {
    var c = cnv(256, 56), g = c.getContext("2d");
    var tex = srgb(new THREE.CanvasTexture(c));
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    var sp = new THREE.Sprite(mat);
    sp.scale.set(1.55, 0.34, 1);
    sp.position.set(x || 0, y || 0, z || 0);
    sp.userData.partId = "label";
    sp.userData.setText = function (t, col) {
      g.clearRect(0, 0, 256, 56);
      g.fillStyle = "rgba(10, 18, 28, 0.86)";
      g.beginPath();
      g.roundRect ? g.roundRect(4, 4, 248, 48, 12) : g.rect(4, 4, 248, 48);
      g.fill();
      g.strokeStyle = col || colorHex || "#38ef7d";
      g.lineWidth = 2.5;
      g.stroke();
      g.fillStyle = "#f1f7fc";
      g.font = "700 20px ui-monospace, Menlo, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(String(t).slice(0, 22), 128, 28);
      tex.needsUpdate = true;
    };
    sp.userData.setText(text, colorHex);
    ctx.labels.push(sp);
    return sp;
  }

  function countTris(root) {
    var n = 0;
    root.traverse(function (o) {
      if (o.isMesh && o.visible && o.geometry) {
        var g = o.geometry;
        var k = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0);
        n += k * (o.isInstancedMesh ? o.count : 1);
      }
    });
    return Math.round(n);
  }

  /* ===================================================================
     3. MODE 1: "translation-pipeline" (Lesson 01)
     4-stage 3D conveyor & optical lens pipeline:
       sourceStage -> lexerStage -> translatorGate -> siliconDie + pulseStream
     =================================================================== */
  function buildTranslationPipeline(ctx) {
    var G = new THREE.Group();
    var parts = {};
    var P = null, M = null;

    /* Base PCB conveyor rail with cut-out cooling slots */
    var baseShape = frameShape(8.6, 2.7, 0.22, 0.25);
    var baseRail = mesh(extrudeSlab(baseShape, 0.14, 0.02), std(0x132a23, 0.55, { map: pcbTex(11) }), 0, -0.08, 0);
    var innerDeck = mesh(extrudeSlab(rrShape(8.2, 2.3, 0.14), 0.06, 0.01), std(0x0b1622, 0.65), 0, -0.06, 0);
    G.add(baseRail, innerDeck);

    /* Stage 1: Source Code Block (x = -3.1) */
    var sourceStage = new THREE.Group();
    sourceStage.position.set(-3.1, 0.55, 0);
    var srcFrame = mesh(extrudePlate(frameShape(1.85, 1.25, 0.12, 0.11), 0.24, 0.02), metal(0x284b63, 0.3));
    var srcScreen = makeDynamicPanel(1.62, 1.02, 512, 320);
    srcScreen.position.z = 0.13;
    var srcPedestal = mesh(latheGeo([[0, -0.5], [0.42, -0.5], [0.32, -0.15], [0.22, 0]], 24), metal(0x3a506b, 0.35), 0, -0.12, 0);
    sourceStage.add(srcFrame, srcScreen, srcPedestal);
    G.add(sourceStage);

    /* Stage 2: Lexer/Parser Optical Lens & AST Token Tree (x = -1.05) */
    var lexerStage = new THREE.Group();
    lexerStage.position.set(-1.05, 0.55, 0);
    var lensRing = mesh(extrudePlate(frameShape(1.4, 1.4, 0.68, 0.14), 0.22, 0.025), metal(0xd4af37, 0.25));
    lensRing.rotation.y = Math.PI / 2;
    lensRing.position.x = -0.45;
    var opticalLens = mesh(biconvexLensGeo(0.56, 0.06, 0.14), glass(0x64dfdf, 0.38));
    opticalLens.position.x = -0.45;
    /* Syntax tree nodes connected by curved spline tubes */
    var astGroup = new THREE.Group();
    astGroup.position.x = 0.22;
    var nodePositions = [
      [0, 0.42, 0],
      [-0.36, 0.02, 0.22],
      [0.36, 0.02, -0.22],
      [0.12, -0.36, 0.26],
      [0.54, -0.36, -0.26]
    ];
    var astEdges = [
      [nodePositions[0], nodePositions[1]],
      [nodePositions[0], nodePositions[2]],
      [nodePositions[2], nodePositions[3]],
      [nodePositions[2], nodePositions[4]]
    ];
    astEdges.forEach(function (pair) {
      astGroup.add(splineTube([pair[0], pair[1]], 0.032, 16, 10, std(0x48bfe3, 0.3, { emissive: new THREE.Color(0x0077b6), emissiveIntensity: 0.35 })));
    });
    var tokenNodes = nodePositions.map(function (pt, idx) {
      var m = mesh(new THREE.OctahedronGeometry(0.14, 1), std(idx === 0 ? 0xffb703 : 0x56cfe1, 0.25, {
        emissive: new THREE.Color(idx === 0 ? 0xfb8500 : 0x0096c7),
        emissiveIntensity: 0.35
      }), pt[0], pt[1], pt[2]);
      astGroup.add(m);
      return m;
    });
    lexerStage.add(lensRing, opticalLens, astGroup);
    G.add(lexerStage);

    /* Stage 3: Translator Gate — Compiler (Batch Arch) vs Interpreter (Line-by-Line Scanner) (x = 1.05) */
    var translatorGate = new THREE.Group();
    translatorGate.position.set(1.05, 0.55, 0);
    var gateHousing = mesh(extrudePlate(frameShape(1.55, 1.5, 0.16, 0.15), 0.55, 0.03), metal(0x3d5a80, 0.3, { map: brushedMetalTex("#3d5a80", 9) }));
    var batchChamber = mesh(extrudePlate(rrShape(1.15, 0.44, 0.08), 0.38, 0.015), std(0x06d6a0, 0.25, { emissive: new THREE.Color(0x06d6a0), emissiveIntensity: 0.4 }), 0, 0.26, 0);
    var lineScanBar = mesh(extrudePlate(rrShape(1.15, 0.18, 0.05), 0.42, 0.015), std(0xff9f1c, 0.25, { emissive: new THREE.Color(0xff9f1c), emissiveIntensity: 0.4 }), 0, -0.22, 0);
    var gateBadge = makeDynamicPanel(1.3, 0.46, 384, 140);
    gateBadge.position.set(0, 0.96, 0);
    translatorGate.add(gateHousing, batchChamber, lineScanBar, gateBadge);
    G.add(translatorGate);

    /* Stage 4: ALU Silicon Die (x = 3.15) */
    var siliconDie = new THREE.Group();
    siliconDie.position.set(3.15, 0.42, 0);
    var pkgSubstrate = mesh(extrudeSlab(rrShape(1.75, 1.75, 0.12), 0.14, 0.02), std(0x0f3d2e, 0.45, { map: pcbTex(23) }), 0, -0.35, 0);
    var dieCore = mesh(extrudeSlab(rrShape(1.18, 1.18, 0.06), 0.22, 0.02), std(0x2b4268, 0.2, { map: siliconWaferTex(), metalness: 0.55 }), 0, -0.21, 0);
    /* Gold gull-wing IC pins along package edges */
    var pinGeo = extrudeSlab(rrShape(0.08, 0.22, 0.015), 0.04, 0.005);
    var pinMat = metal(0xffd166, 0.22);
    for (var pIdx = -3; pIdx <= 3; pIdx++) {
      siliconDie.add(mesh(pinGeo, pinMat, pIdx * 0.2, -0.32, 0.92));
      siliconDie.add(mesh(pinGeo, pinMat, pIdx * 0.2, -0.32, -0.92));
    }
    var aluScreen = makeDynamicPanel(1.35, 0.72, 384, 200);
    aluScreen.position.set(0, 0.48, 0);
    siliconDie.add(pkgSubstrate, dieCore, aluScreen);
    G.add(siliconDie);

    /* Pulse Stream: Curved optical bus tube + 8 binary 0/1 voltage pulses */
    var pulseStream = new THREE.Group();
    var busCurve = new THREE.CatmullRomCurve3([
      new V3(-2.2, 0.45, 0),
      new V3(-1.05, 0.45, 0),
      new V3(1.05, 0.45, 0),
      new V3(3.15, 0.35, 0)
    ]);
    var busTube = mesh(new THREE.TubeGeometry(busCurve, 48, 0.075, 14, false), glass(0x48bfe3, 0.22));
    pulseStream.add(busTube);

    var pulseMeshes = [];
    for (var b = 0; b < 8; b++) {
      var pm = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.16, 14), std(0x38ef7d, 0.2, {
        emissive: new THREE.Color(0x38ef7d),
        emissiveIntensity: 0.75
      }));
      pm.rotation.z = Math.PI / 2;
      pulseStream.add(pm);
      pulseMeshes.push(pm);
    }
    G.add(pulseStream);

    /* Stage labels */
    var lbSrc = makeLabel(ctx, "1. Source Code", -3.1, 1.48, 0, "#56cfe1");
    var lbLex = makeLabel(ctx, "2. Lexer / AST", -1.05, 1.48, 0, "#ffb703");
    var lbGate = makeLabel(ctx, "3. Compiler Gate", 1.05, 1.85, 0, "#06d6a0");
    var lbAlu = makeLabel(ctx, "4. ALU 0/1 Die", 3.15, 1.48, 0, "#38ef7d");
    G.add(lbSrc, lbLex, lbGate, lbAlu);

    function apply(p) {
      P = p;
      M = solveTranslationPipeline(p);
      srcScreen.userData.updateText("SOURCE (.py)", [
        "raw_str = \"" + M.rawInt + "\"",
        "total_kwh = int(raw_str) + " + M.addend,
        "Step: " + M.step + " (" + M.stageName + ")"
      ], "#56cfe1", "#0b1929");

      var isComp = M.translator === "compiler";
      batchChamber.material.emissiveIntensity = isComp ? 0.75 : 0.1;
      lineScanBar.material.emissiveIntensity = !isComp ? 0.85 : 0.1;
      gateBadge.userData.updateText(isComp ? "COMPILER (1 PASS)" : "INTERPRETER (LINE)", [
        isComp ? "Batch -> Native Binary" : "Line-by-Line Bytecode",
        "Latency: " + M.latency_ms + " ms"
      ], isComp ? "#06d6a0" : "#ff9f1c", "#101b29");
      lbGate.userData.setText(isComp ? "3. Compiler Gate" : "3. Interpreter", isComp ? "#06d6a0" : "#ff9f1c");

      aluScreen.userData.updateText("ALU SILICON DIE", [
        "Dec: " + M.total_kwh + " kWh | " + M.hexOpcode,
        "Bits: " + M.binaryPulse
      ], M.aluActive ? "#38ef7d" : "#8ecae6", "#0b2027");

      var bits = M.binaryPulse.split("");
      for (var i = 0; i < 8; i++) {
        var isOne = bits[i] === "1";
        var col = isOne ? 0x38ef7d : 0x3a86ff;
        pulseMeshes[i].material.color.setHex(col);
        pulseMeshes[i].material.emissive.setHex(col);
        pulseMeshes[i].scale.y = isOne ? 1.35 : 0.65;
      }
    }

    function update(dt, t) {
      if (!M) return;
      var step = M.step;
      opticalLens.rotation.x = t * 0.8;
      tokenNodes.forEach(function (n, idx) {
        n.position.y = nodePositions[idx][1] + Math.sin(t * 3.2 + idx) * (step >= 1 ? 0.045 : 0.012);
        n.material.emissiveIntensity = step === 1 ? 0.85 : 0.3;
      });
      if (M.translator === "interpreter") {
        lineScanBar.position.y = -0.22 + Math.sin(t * 4.5) * 0.22;
      } else {
        lineScanBar.position.y = -0.22;
      }
      var maxU = clamp((step + 1) / 4, 0.25, 1.0);
      for (var i = 0; i < 8; i++) {
        var u = ((t * (M.translator === "compiler" ? 0.42 : 0.24) + i / 8) % 1) * maxU;
        var pt = busCurve.getPointAt(u);
        pulseMeshes[i].position.copy(pt);
      }
    }

    parts.sourceStage = tagPart(sourceStage, "sourceStage");
    parts.lexerStage = tagPart(lexerStage, "lexerStage");
    parts.translatorGate = tagPart(translatorGate, "translatorGate");
    parts.siliconDie = tagPart(siliconDie, "siliconDie");
    parts.pulseStream = tagPart(pulseStream, "pulseStream");

    return {
      group: G,
      parts: parts,
      apply: apply,
      update: update,
      reading: function () { return solveTranslationPipeline(P); },
      views: {
        all: [0, 0.5, 0, 8.8],
        sourceStage: [-3.1, 0.55, 0, 3.4],
        lexerStage: [-1.05, 0.55, 0, 3.4],
        translatorGate: [1.05, 0.65, 0, 3.6],
        siliconDie: [3.15, 0.5, 0, 3.4],
        pulseStream: [0.5, 0.45, 0, 5.5]
      }
    };
  }

  /* ===================================================================
     4. MODE 2: "decision-tree" (Lesson 02)
     3D illuminated branching railway / logic conduit with diamond decision nodes:
       rootDiamond, secondDiamond, trueBranch, falseBranch, genAction, solarAction
     =================================================================== */
  function buildDecisionTree(ctx) {
    var G = new THREE.Group();
    var parts = {};
    var P = null, M = null;

    var baseBoard = mesh(extrudeSlab(rrShape(7.6, 4.6, 0.25), 0.12, 0.02), std(0x0f241d, 0.6, { map: pcbTex(31) }), 0, -0.1, 0);
    G.add(baseBoard);

    /* Root Diamond: battery < 20? */
    var rootDiamond = new THREE.Group();
    rootDiamond.position.set(0, 0.55, -1.55);
    var d1Frame = mesh(extrudeSlab(diamondShape(1.75, 1.15, 0.65), 0.22, 0.025), metal(0xffb703, 0.28));
    var d1Panel = makeDynamicPanel(1.15, 0.52, 384, 160);
    d1Panel.rotation.x = -Math.PI / 3;
    d1Panel.position.set(0, 0.34, 0.12);
    rootDiamond.add(d1Frame, d1Panel);
    G.add(rootDiamond);

    /* Second Diamond: not grid_online? */
    var secondDiamond = new THREE.Group();
    secondDiamond.position.set(-1.85, 0.55, 0.05);
    var d2Frame = mesh(extrudeSlab(diamondShape(1.75, 1.15, 0.65), 0.22, 0.025), metal(0x4cc9f0, 0.28));
    var d2Panel = makeDynamicPanel(1.15, 0.52, 384, 160);
    d2Panel.rotation.x = -Math.PI / 3;
    d2Panel.position.set(0, 0.34, 0.12);
    secondDiamond.add(d2Frame, d2Panel);
    G.add(secondDiamond);

    /* True Branch conduits (green) */
    var trueBranch = new THREE.Group();
    var matTrue = std(0x2ec4b6, 0.25, { emissive: new THREE.Color(0x2ec4b6), emissiveIntensity: 0.45 });
    var curveT1 = splineTube([[0, 0.35, -1.55], [-1.1, 0.35, -0.95], [-1.85, 0.35, 0.05]], 0.075, 32, 12, matTrue.clone());
    var curveT2 = splineTube([[-1.85, 0.35, 0.05], [-2.35, 0.35, 0.85], [-2.35, 0.35, 1.55]], 0.075, 32, 12, matTrue.clone());
    trueBranch.add(curveT1, curveT2);
    G.add(trueBranch);

    /* False Branch conduits (crimson/red) */
    var falseBranch = new THREE.Group();
    var matFalse = std(0xe63946, 0.25, { emissive: new THREE.Color(0xe63946), emissiveIntensity: 0.45 });
    var curveF1 = splineTube([[0, 0.35, -1.55], [1.45, 0.35, -0.6], [2.15, 0.35, 1.55]], 0.075, 36, 12, matFalse.clone());
    var curveF2 = splineTube([[-1.85, 0.35, 0.05], [-0.2, 0.35, 0.75], [2.15, 0.35, 1.55]], 0.075, 36, 12, matFalse.clone());
    falseBranch.add(curveF1, curveF2);
    G.add(falseBranch);

    /* Generator Action Terminal (left front) */
    var genAction = new THREE.Group();
    genAction.position.set(-2.35, 0.45, 1.65);
    var genBase = mesh(extrudeSlab(rrShape(1.9, 0.95, 0.14), 0.28, 0.02), metal(0x1d3557, 0.32));
    var genBeacon = mesh(latheGeo([[0, 0], [0.24, 0], [0.2, 0.38], [0, 0.44]], 24), std(0x38ef7d, 0.2, { emissive: new THREE.Color(0x38ef7d), emissiveIntensity: 0.5 }), -0.58, 0.28, 0);
    var genPanel = makeDynamicPanel(1.35, 0.55, 384, 160);
    genPanel.rotation.x = -Math.PI / 4;
    genPanel.position.set(0.18, 0.48, 0.08);
    genAction.add(genBase, genBeacon, genPanel);
    G.add(genAction);

    /* Solar Action Terminal (right front) */
    var solarAction = new THREE.Group();
    solarAction.position.set(2.15, 0.45, 1.65);
    var solBase = mesh(extrudeSlab(rrShape(1.9, 0.95, 0.14), 0.28, 0.02), metal(0x264653, 0.32));
    var solPanel = makeDynamicPanel(1.5, 0.55, 384, 160);
    solPanel.rotation.x = -Math.PI / 4;
    solPanel.position.set(0, 0.48, 0.08);
    solarAction.add(solBase, solPanel);
    G.add(solarAction);

    /* Energy routing beads along active path */
    var beads = [];
    for (var i = 0; i < 10; i++) {
      var b = mesh(new THREE.SphereGeometry(0.095, 14, 12), std(0xffd166, 0.15, { emissive: new THREE.Color(0xffd166), emissiveIntensity: 0.9 }));
      G.add(b);
      beads.push(b);
    }

    var lbRoot = makeLabel(ctx, "battery < 20?", 0, 1.35, -1.55, "#ffb703");
    var lbSec = makeLabel(ctx, "not grid_online?", -1.85, 1.35, 0.05, "#4cc9f0");
    var lbGen = makeLabel(ctx, "Start Generator", -2.35, 1.35, 1.65, "#38ef7d");
    var lbSol = makeLabel(ctx, "Keep Solar Charge", 2.15, 1.35, 1.65, "#e63946");
    G.add(lbRoot, lbSec, lbGen, lbSol);

    var activeCurve = null;

    function apply(p) {
      P = p;
      M = solveDecisionTree(p);
      d1Panel.userData.updateText("IF battery < 20:", [
        "battery = " + M.battery + "%",
        "Result: " + (M.cond1_val ? "TRUE" : "FALSE")
      ], M.cond1_val ? "#38ef7d" : "#e63946", "#0e1d2b");

      d2Panel.userData.updateText("AND NOT grid_online:", [
        "grid_online = " + M.grid_online,
        "not grid = " + (M.cond2_val ? "TRUE" : "FALSE")
      ], M.cond2_val ? "#38ef7d" : "#e63946", "#0e1d2b");

      genPanel.userData.updateText("TRUE ACTION", [
        "activate_generator()",
        M.generatorRelayOn ? "STATUS: RUNNING" : "STATUS: STANDBY"
      ], M.generatorRelayOn ? "#38ef7d" : "#6c757d", "#0b1a24");

      solPanel.userData.updateText("ELSE ACTION", [
        "maintain_solar_charge()",
        !M.generatorRelayOn ? "STATUS: ACTIVE" : "STATUS: BYPASSED"
      ], !M.generatorRelayOn ? "#ffb703" : "#6c757d", "#0b1a24");

      genBeacon.material.emissiveIntensity = M.generatorRelayOn ? 1.0 : 0.1;
      curveT1.material.emissiveIntensity = M.cond1_val ? 0.85 : 0.12;
      curveT2.material.emissiveIntensity = (M.cond1_val && M.cond2_val) ? 0.9 : 0.12;
      curveF1.material.emissiveIntensity = !M.cond1_val ? 0.85 : 0.12;
      curveF2.material.emissiveIntensity = (M.cond1_val && !M.cond2_val) ? 0.85 : 0.12;

      if (!M.cond1_val) {
        activeCurve = curveF1.userData.curve;
      } else if (M.cond2_val) {
        activeCurve = new THREE.CatmullRomCurve3([
          new V3(0, 0.35, -1.55), new V3(-1.1, 0.35, -0.95),
          new V3(-1.85, 0.35, 0.05), new V3(-2.35, 0.35, 0.85), new V3(-2.35, 0.35, 1.55)
        ]);
      } else {
        activeCurve = new THREE.CatmullRomCurve3([
          new V3(0, 0.35, -1.55), new V3(-1.1, 0.35, -0.95),
          new V3(-1.85, 0.35, 0.05), new V3(-0.2, 0.35, 0.75), new V3(2.15, 0.35, 1.55)
        ]);
      }
    }

    function update(dt, t) {
      if (!M || !activeCurve) return;
      var maxFrac = clamp((M.step + 1) / 4, 0.25, 1.0);
      for (var i = 0; i < beads.length; i++) {
        var u = ((t * 0.35 + i / beads.length) % 1) * maxFrac;
        var pt = activeCurve.getPointAt(u);
        beads[i].position.set(pt.x, pt.y + 0.11, pt.z);
      }
    }

    parts.rootDiamond = tagPart(rootDiamond, "rootDiamond");
    parts.secondDiamond = tagPart(secondDiamond, "secondDiamond");
    parts.trueBranch = tagPart(trueBranch, "trueBranch");
    parts.falseBranch = tagPart(falseBranch, "falseBranch");
    parts.genAction = tagPart(genAction, "genAction");
    parts.solarAction = tagPart(solarAction, "solarAction");

    return {
      group: G,
      parts: parts,
      apply: apply,
      update: update,
      reading: function () { return solveDecisionTree(P); },
      views: {
        all: [0, 0.5, 0.1, 7.8],
        rootDiamond: [0, 0.6, -1.55, 3.4],
        secondDiamond: [-1.85, 0.6, 0.05, 3.4],
        trueBranch: [-1.4, 0.4, 0, 4.6],
        falseBranch: [0.8, 0.4, 0.2, 5.0],
        genAction: [-2.35, 0.55, 1.65, 3.2],
        solarAction: [2.15, 0.55, 1.65, 3.2]
      }
    };
  }

  /* ===================================================================
     5. MODE 3: "loop-jump" (Lesson 03)
     3D vertical execution pipeline with 4 instruction stages + arched back-edge tube:
       initNode, condNode, bodyNode, stepNode, backEdgeArc, exitChute, pulseOrb
     =================================================================== */
  function buildLoopJump(ctx) {
    var G = new THREE.Group();
    var parts = {};
    var P = null, M = null;

    /* Vertical support spine */
    var spine = mesh(extrudePlate(frameShape(0.55, 4.4, 0.1, 0.08), 0.18, 0.015), metal(0x2b3a4a, 0.4), 0, 1.6, -0.35);
    G.add(spine);

    /* Stage 1: Init Node (y = 3.3) */
    var initNode = new THREE.Group();
    initNode.position.set(0, 3.3, 0);
    var initFrame = mesh(extrudePlate(rrShape(2.3, 0.62, 0.1), 0.24, 0.02), metal(0x3a506b, 0.32));
    var initPanel = makeDynamicPanel(2.1, 0.48, 440, 110);
    initPanel.position.z = 0.13;
    initNode.add(initFrame, initPanel);
    G.add(initNode);

    /* Stage 2: Condition Diamond Node (y = 2.25) */
    var condNode = new THREE.Group();
    condNode.position.set(0, 2.25, 0);
    var condFrame = mesh(extrudePlate(diamondShape(2.4, 0.95, 0.0), 0.24, 0.02), metal(0xffb703, 0.28));
    var condPanel = makeDynamicPanel(1.65, 0.46, 384, 110);
    condPanel.position.z = 0.13;
    condNode.add(condFrame, condPanel);
    G.add(condNode);

    /* Stage 3: Body Accumulator Node (y = 1.15) */
    var bodyNode = new THREE.Group();
    bodyNode.position.set(0, 1.15, 0);
    var bodyFrame = mesh(extrudePlate(rrShape(2.5, 0.72, 0.12), 0.26, 0.02), metal(0x118ab2, 0.3));
    var bodyPanel = makeDynamicPanel(2.3, 0.56, 480, 130);
    bodyPanel.position.z = 0.14;
    bodyNode.add(bodyFrame, bodyPanel);
    G.add(bodyNode);

    /* Stage 4: Step Increment Node (y = 0.1) */
    var stepNode = new THREE.Group();
    stepNode.position.set(0, 0.1, 0);
    var stepFrame = mesh(extrudePlate(rrShape(2.3, 0.62, 0.1), 0.24, 0.02), metal(0x06d6a0, 0.3));
    var stepPanel = makeDynamicPanel(2.1, 0.48, 440, 110);
    stepPanel.position.z = 0.13;
    stepNode.add(stepFrame, stepPanel);
    G.add(stepNode);

    /* Dramatic glowing arched feedback tube (Back-Edge Jump from Step -> Cond) */
    var backCurve = new THREE.CatmullRomCurve3([
      new V3(-1.15, 0.1, 0),
      new V3(-2.25, 0.45, 0.35),
      new V3(-2.45, 1.2, 0.5),
      new V3(-2.25, 1.95, 0.35),
      new V3(-1.2, 2.25, 0)
    ]);
    var backEdgeArc = mesh(new THREE.TubeGeometry(backCurve, 44, 0.085, 14, false), std(0x38ef7d, 0.2, {
      emissive: new THREE.Color(0x38ef7d),
      emissiveIntensity: 0.6
    }));
    G.add(backEdgeArc);

    /* Termination Exit Chute (from Cond right -> Exit platform) */
    var exitChute = new THREE.Group();
    var exitCurve = new THREE.CatmullRomCurve3([
      new V3(1.2, 2.25, 0),
      new V3(2.25, 2.15, 0.2),
      new V3(2.55, 1.25, 0.2),
      new V3(2.55, 0.35, 0)
    ]);
    var exitTube = mesh(new THREE.TubeGeometry(exitCurve, 36, 0.085, 14, false), std(0xe63946, 0.22, {
      emissive: new THREE.Color(0xe63946),
      emissiveIntensity: 0.35
    }));
    var exitPod = mesh(extrudeSlab(rrShape(1.4, 0.8, 0.12), 0.2, 0.02), metal(0x6a040f, 0.35), 2.55, 0.0, 0);
    exitChute.add(exitTube, exitPod);
    G.add(exitChute);

    /* Execution Pulse Orb */
    var pulseOrb = new THREE.Group();
    var orbCore = mesh(new THREE.SphereGeometry(0.18, 20, 16), std(0xffd166, 0.1, {
      emissive: new THREE.Color(0xffd166),
      emissiveIntensity: 1.0
    }));
    var orbHalo = mesh(new THREE.TorusGeometry(0.26, 0.03, 12, 28), std(0x38ef7d, 0.2, {
      emissive: new THREE.Color(0x38ef7d),
      emissiveIntensity: 0.8
    }));
    pulseOrb.add(orbCore, orbHalo);
    G.add(pulseOrb);

    var lbBack = makeLabel(ctx, "Back-Edge Jump", -2.55, 1.2, 0.55, "#38ef7d");
    var lbExit = makeLabel(ctx, "Exit (i == 6)", 2.55, 2.55, 0.2, "#e63946");
    G.add(lbBack, lbExit);

    function apply(p) {
      P = p;
      M = solveLoopJump(p);
      initPanel.userData.updateText("1. INIT", ["i = 1, total = 0"], "#8ecae6", "#0d1b2a");
      condPanel.userData.updateText("2. TEST: i < " + M.stop + "?", [
        "i = " + M.iter + " -> " + (M.conditionResult ? "TRUE (Enter)" : "FALSE (Exit)")
      ], M.conditionResult ? "#ffb703" : "#e63946", "#141e28");
      bodyPanel.userData.updateText("3. BODY (Accumulate)", [
        "kwh[" + M.iter + "] = " + M.currentKwh + " | total = " + M.total
      ], "#56cfe1", "#0c1f2e");
      stepPanel.userData.updateText("4. STEP & JUMP", [
        "i = i + 1 -> " + M.nextIter
      ], "#06d6a0", "#0b2420");

      backEdgeArc.material.emissiveIntensity = M.backEdgeActive ? 1.0 : 0.25;
      exitTube.material.emissiveIntensity = M.exitChuteActive ? 1.0 : 0.2;
    }

    function update(dt, t) {
      if (!M) return;
      orbHalo.rotation.x = t * 3.0;
      orbHalo.rotation.y = t * 2.2;
      if (M.exitChuteActive) {
        var uExit = (t * 0.55) % 1;
        pulseOrb.position.copy(exitCurve.getPointAt(uExit));
      } else if (M.step === 0) {
        pulseOrb.position.set(0, 3.3, 0.28);
      } else if (M.step === 1) {
        pulseOrb.position.set(0, 2.25, 0.28);
      } else if (M.step === 2) {
        pulseOrb.position.set(0, 1.15, 0.28);
      } else {
        var uBack = (t * 0.65) % 1;
        pulseOrb.position.copy(backCurve.getPointAt(uBack));
      }
    }

    parts.initNode = tagPart(initNode, "initNode");
    parts.condNode = tagPart(condNode, "condNode");
    parts.bodyNode = tagPart(bodyNode, "bodyNode");
    parts.stepNode = tagPart(stepNode, "stepNode");
    parts.backEdgeArc = tagPart(backEdgeArc, "backEdgeArc");
    parts.exitChute = tagPart(exitChute, "exitChute");
    parts.pulseOrb = tagPart(pulseOrb, "pulseOrb");

    return {
      group: G,
      parts: parts,
      apply: apply,
      update: update,
      reading: function () { return solveLoopJump(P); },
      views: {
        all: [0, 1.65, 0, 7.6],
        initNode: [0, 3.3, 0, 3.2],
        condNode: [0, 2.25, 0, 3.4],
        bodyNode: [0, 1.15, 0, 3.4],
        stepNode: [0, 0.1, 0, 3.2],
        backEdgeArc: [-1.8, 1.2, 0.2, 4.2],
        exitChute: [2.1, 1.3, 0.1, 4.2],
        pulseOrb: [0, 1.65, 0.2, 4.0]
      }
    };
  }

  /* ===================================================================
     6. MODE 4: "memory-offset" (Lesson 04)
     3D microscopic RAM bus inspector:
       baseMarker, caliper, byteBlocks, addressLaser, boundaryWall
     =================================================================== */
  function buildMemoryOffset(ctx) {
    var G = new THREE.Group();
    var parts = {};
    var P = null, M = null;

    var slotPitch = 0.86;
    var xStart = -3.2;

    /* RAM PCB Bus Board */
    var ramBoard = mesh(extrudeSlab(rrShape(8.8, 2.5, 0.18), 0.14, 0.02), std(0x0c2d21, 0.5, { map: pcbTex(41) }), 0.2, -0.14, 0);
    G.add(ramBoard);

    /* Base Marker at Index 0 (0x1000) */
    var baseMarker = new THREE.Group();
    baseMarker.position.set(xStart - 0.42, 0.55, -0.65);
    var pillar = mesh(latheGeo([[0, -0.55], [0.16, -0.55], [0.11, 0.45], [0.2, 0.55], [0, 0.65]], 20), metal(0xffb703, 0.25));
    var baseFlag = makeDynamicPanel(1.35, 0.46, 320, 110);
    baseFlag.position.set(0, 0.9, 0);
    baseMarker.add(pillar, baseFlag);
    baseFlag.userData.updateText("BASE ADDR", ["0x1000 (Idx 0)"], "#ffb703", "#141e2b");
    G.add(baseMarker);

    /* 8 Contiguous 4-Byte Memory Blocks (Indices 0..7) */
    var byteBlocks = new THREE.Group();
    var blockCaps = [];
    for (var i = 0; i < 8; i++) {
      var bx = xStart + i * slotPitch;
      var slotG = new THREE.Group();
      slotG.position.set(bx, 0.22, 0);
      var housing = mesh(extrudeSlab(frameShape(0.78, 1.25, 0.08, 0.07), 0.28, 0.015), metal(0x2b4158, 0.35));
      slotG.add(housing);
      /* 4 individual 1-byte sub-lanes inside each 32-bit float block */
      for (var lane = 0; lane < 4; lane++) {
        var lx = -0.24 + lane * 0.16;
        var byteStick = mesh(extrudeSlab(rrShape(0.12, 0.96, 0.02), 0.22, 0.01), std(0x48bfe3, 0.3, {
          emissive: new THREE.Color(0x0077b6),
          emissiveIntensity: 0.25
        }), lx, 0.06, 0);
        slotG.add(byteStick);
      }
      var cap = makeDynamicPanel(0.74, 0.52, 220, 150);
      cap.rotation.x = -Math.PI / 2.3;
      cap.position.set(0, 0.36, 0.32);
      slotG.add(cap);
      blockCaps.push({ group: slotG, housing: housing, cap: cap });
      byteBlocks.add(slotG);
    }
    G.add(byteBlocks);

    /* Red Boundary Wall at Index 8 (0x1020 Out-of-Bounds) */
    var boundaryWall = new THREE.Group();
    var wallX = xStart + 8 * slotPitch;
    boundaryWall.position.set(wallX, 0.65, 0);
    var barrier = mesh(extrudePlate(frameShape(0.84, 1.55, 0.1, 0.1), 0.32, 0.02), std(0xe63946, 0.25, {
      emissive: new THREE.Color(0xe63946),
      emissiveIntensity: 0.65
    }));
    var hazardGlass = mesh(new THREE.BoxGeometry(0.68, 1.38, 0.12), glass(0xff2a55, 0.42));
    var wallSign = makeDynamicPanel(1.3, 0.5, 320, 120);
    wallSign.position.set(0, 1.08, 0);
    wallSign.userData.updateText("INDEX 8 (0x1020)", ["OUT OF BOUNDS!"], "#ff4d6d", "#2b0912");
    boundaryWall.add(barrier, hazardGlass, wallSign);
    G.add(boundaryWall);

    /* Glowing Caliper / Bracket spanning Offset = Index * 4 bytes */
    var caliper = new THREE.Group();
    caliper.position.set(xStart, 0.05, 0.85);
    var calBar = mesh(new THREE.BoxGeometry(1, 0.08, 0.08), std(0x38ef7d, 0.2, {
      emissive: new THREE.Color(0x38ef7d),
      emissiveIntensity: 0.7
    }));
    var calLeftJaw = mesh(new THREE.BoxGeometry(0.08, 0.28, 0.24), metal(0x38ef7d, 0.2));
    var calRightJaw = mesh(new THREE.BoxGeometry(0.08, 0.28, 0.24), metal(0x38ef7d, 0.2));
    var calReadout = makeDynamicPanel(2.35, 0.52, 480, 110);
    calReadout.position.set(0, -0.38, 0.15);
    caliper.add(calBar, calLeftJaw, calRightJaw, calReadout);
    G.add(caliper);

    /* Address Laser Pointer overhead gantry */
    var addressLaser = new THREE.Group();
    addressLaser.position.set(xStart, 1.85, 0);
    var nozzle = mesh(latheGeo([[0, -0.35], [0.09, -0.35], [0.22, 0.05], [0.18, 0.28], [0, 0.28]], 24), metal(0x90e0ef, 0.2));
    var beam = mesh(new THREE.CylinderGeometry(0.035, 0.09, 1.35, 16), std(0x38ef7d, 0.1, {
      emissive: new THREE.Color(0x38ef7d),
      emissiveIntensity: 0.95,
      transparent: true,
      opacity: 0.82
    }), 0, -0.95, 0);
    var laserHud = makeDynamicPanel(2.2, 0.52, 460, 110);
    laserHud.position.set(0, 0.58, 0);
    addressLaser.add(nozzle, beam, laserHud);
    G.add(addressLaser);

    var targetX = xStart;

    function apply(p) {
      P = p;
      M = solveMemoryOffset(p);
      targetX = xStart + M.index * slotPitch;

      for (var i = 0; i < 8; i++) {
        var active = (i === M.index);
        var addrHex = toHex(M.baseDec + i * M.elemSizeBytes, 4);
        var v = (P.values && P.values[i] != null) ? P.values[i] : DEFAULT_CELLS[i];
        blockCaps[i].cap.userData.updateText("[" + i + "] " + addrHex, [
          v.toFixed(1) + " V (4 B)"
        ], active ? "#38ef7d" : "#8ecae6", active ? "#0e2f24" : "#0d1824");
      }

      var span = Math.max(0.08, M.index * slotPitch);
      calBar.scale.x = span;
      calBar.position.x = span / 2;
      calLeftJaw.position.x = 0;
      calRightJaw.position.x = span;
      calReadout.position.x = span / 2;
      calReadout.userData.updateText("OFFSET = " + M.index + " × 4 B = " + M.offsetBytes + " Bytes", [
        M.formula
      ], M.inBounds ? "#38ef7d" : "#ff4d6d", "#0b1926");

      var colHex = M.inBounds ? 0x38ef7d : 0xff2a55;
      beam.material.color.setHex(colHex);
      beam.material.emissive.setHex(colHex);
      calBar.material.color.setHex(colHex);
      calBar.material.emissive.setHex(colHex);

      laserHud.userData.updateText(M.inBounds ? "ADDR: " + M.addressHex : "INDEX ERROR!", [
        M.inBounds ? "Value: " + M.elementValue.toFixed(1) + " V" : "0x1020 Unallocated!"
      ], M.inBounds ? "#38ef7d" : "#ff4d6d", M.inBounds ? "#0b221e" : "#2d0912");
    }

    function update(dt, t) {
      if (!M) return;
      addressLaser.position.x += (targetX - addressLaser.position.x) * Math.min(1, dt * 8);
      if (!M.inBounds) {
        barrier.material.emissiveIntensity = 0.55 + 0.45 * Math.sin(t * 10);
      } else {
        barrier.material.emissiveIntensity = 0.35;
      }
    }

    parts.baseMarker = tagPart(baseMarker, "baseMarker");
    parts.caliper = tagPart(caliper, "caliper");
    parts.byteBlocks = tagPart(byteBlocks, "byteBlocks");
    parts.addressLaser = tagPart(addressLaser, "addressLaser");
    parts.boundaryWall = tagPart(boundaryWall, "boundaryWall");

    return {
      group: G,
      parts: parts,
      apply: apply,
      update: update,
      reading: function () { return solveMemoryOffset(P); },
      views: {
        all: [0.2, 0.65, 0.2, 8.8],
        baseMarker: [xStart - 0.3, 0.6, 0, 3.4],
        caliper: [0, 0.0, 0.85, 5.2],
        byteBlocks: [0, 0.4, 0, 6.2],
        addressLaser: [0, 1.5, 0, 4.8],
        boundaryWall: [wallX, 0.7, 0, 3.6]
      }
    };
  }

  /* ===================================================================
     7. MODE 5: "stack-frame" (Lesson 05)
     3D Call Stack tower with Global Scope base + translucent Stack Frame elevator:
       globalBase, stackFrame, oneWayGlass, localVars, returnOrb
     =================================================================== */
  function buildStackFrame(ctx) {
    var G = new THREE.Group();
    var parts = {};
    var P = null, M = null;

    /* Guide elevator columns */
    var colGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.4, 16);
    var colMat = metal(0x4a5568, 0.3);
    G.add(mesh(colGeo, colMat, -1.75, 1.6, -1.05));
    G.add(mesh(colGeo, colMat, 1.75, 1.6, -1.05));

    /* Global Scope Base Platform (permanent) */
    var globalBase = new THREE.Group();
    globalBase.position.set(0, 0.15, 0);
    var gSlab = mesh(extrudeSlab(rrShape(4.2, 2.6, 0.2), 0.28, 0.025), metal(0x1b4332, 0.35, { map: pcbTex(55) }));
    var gPanel = makeDynamicPanel(3.6, 0.75, 512, 130);
    gPanel.rotation.x = -Math.PI / 6;
    gPanel.position.set(0, 0.52, 0.88);
    globalBase.add(gSlab, gPanel);
    G.add(globalBase);

    /* Animated Stack Frame Elevator Box (calculate_nepa_bill) */
    var stackFrame = new THREE.Group();
    stackFrame.position.set(0, 1.95, 0);
    var frameFloor = mesh(extrudeSlab(frameShape(3.5, 2.1, 0.16, 0.16), 0.14, 0.02), metal(0x2b6cb0, 0.3));
    var frameRoof = mesh(extrudeSlab(frameShape(3.5, 2.1, 0.16, 0.16), 0.12, 0.015), metal(0x2b6cb0, 0.3), 0, 1.25, 0);
    var frameHeader = makeDynamicPanel(3.1, 0.42, 480, 96);
    frameHeader.position.set(0, 1.55, 0);
    stackFrame.add(frameFloor, frameRoof, frameHeader);

    /* One-Way Glass Shield enclosing the Stack Frame */
    var oneWayGlass = new THREE.Group();
    var glassBox = mesh(new THREE.BoxGeometry(3.35, 1.15, 1.95), glass(0x48bfe3, 0.26), 0, 0.66, 0);
    oneWayGlass.add(glassBox);
    stackFrame.add(oneWayGlass);

    /* Local Variable Modules inside the Stack Frame */
    var localVars = new THREE.Group();
    localVars.position.set(0, 0.58, 0);
    var lvCoords = [
      [-0.82, 0.24, 0],
      [0.82, 0.24, 0],
      [-0.82, -0.24, 0],
      [0.82, -0.24, 0]
    ];
    var lvCards = lvCoords.map(function (pt) {
      var holder = mesh(extrudePlate(rrShape(1.42, 0.38, 0.06), 0.12, 0.01), metal(0x1d3557, 0.3), pt[0], pt[1], pt[2]);
      var card = makeDynamicPanel(1.34, 0.32, 320, 84);
      card.position.z = 0.07;
      holder.add(card);
      localVars.add(holder);
      return card;
    });
    stackFrame.add(localVars);
    G.add(stackFrame);

    /* Return Chute & Return Value Orb */
    var returnOrb = new THREE.Group();
    var chuteCurve = new THREE.CatmullRomCurve3([
      new V3(1.65, 2.2, 0.2),
      new V3(2.35, 1.7, 0.35),
      new V3(2.35, 0.85, 0.35),
      new V3(1.55, 0.45, 0.2)
    ]);
    var chuteTube = mesh(new THREE.TubeGeometry(chuteCurve, 32, 0.075, 12, false), glass(0xffd166, 0.35));
    var orbMesh = mesh(new THREE.SphereGeometry(0.18, 20, 16), std(0xffd166, 0.12, {
      emissive: new THREE.Color(0xffd166),
      emissiveIntensity: 0.95
    }));
    returnOrb.add(chuteTube, orbMesh);
    G.add(returnOrb);

    var lbGlass = makeLabel(ctx, "One-Way Scope Glass", -1.9, 2.6, 0, "#48bfe3");
    var lbRet = makeLabel(ctx, "return total_bill", 2.45, 1.4, 0.35, "#ffd166");
    G.add(lbGlass, lbRet);

    var targetY = 1.95, targetScale = 1;

    function apply(p) {
      P = p;
      M = solveStackFrame(p);

      gPanel.userData.updateText("GLOBAL SCOPE (Permanent)", [
        "TARIFF = " + M.global_TARIFF.toFixed(1) + " | total_revenue = N" + M.global_total_revenue.toFixed(2)
      ], "#38ef7d", "#0b221a");

      frameHeader.userData.updateText("STACK FRAME: calculate_nepa_bill(" + M.arg_units + ")", [
        "Phase: " + M.phase.toUpperCase()
      ], "#48bfe3", "#0d1f33");

      var eCost = M.local_energy_cost != null ? "N" + M.local_energy_cost : "---";
      var vat = M.local_vat_amount != null ? "N" + M.local_vat_amount : "---";
      var fix = M.local_fixed_charge != null ? "N" + M.local_fixed_charge : "---";
      var tot = M.local_total_bill != null ? "N" + M.local_total_bill : "---";

      lvCards[0].userData.updateText("units = " + M.arg_units, ["Param (Local)"], "#90e0ef", "#102538");
      lvCards[1].userData.updateText("energy = " + eCost, ["units * 68.0"], "#90e0ef", "#102538");
      lvCards[2].userData.updateText("vat = " + vat, ["7.5% + Fixed " + fix], "#90e0ef", "#102538");
      lvCards[3].userData.updateText("total = " + tot, ["Isolated Local"], "#ffd166", "#1a2520");

      if (M.step === 0) {
        targetY = 3.2;
        targetScale = 0.001;
      } else if (M.step === 1 || M.step === 2) {
        targetY = 1.65;
        targetScale = 1.0;
      } else {
        targetY = 2.85;
        targetScale = 0.15;
      }
      glassBox.material.opacity = M.step === 3 ? 0.08 : 0.28;
      orbMesh.visible = M.step >= 2;
    }

    function update(dt, t) {
      if (!M) return;
      stackFrame.position.y += (targetY - stackFrame.position.y) * Math.min(1, dt * 6);
      var s = stackFrame.scale.x + (targetScale - stackFrame.scale.x) * Math.min(1, dt * 6);
      stackFrame.scale.setScalar(Math.max(0.001, s));
      stackFrame.visible = s > 0.02;

      if (M.step === 2) {
        orbMesh.position.copy(chuteCurve.getPointAt(0.08));
      } else if (M.step === 3) {
        var u = (t * 0.7) % 1;
        orbMesh.position.copy(chuteCurve.getPointAt(u));
      }
    }

    parts.globalBase = tagPart(globalBase, "globalBase");
    parts.stackFrame = tagPart(stackFrame, "stackFrame");
    parts.oneWayGlass = tagPart(oneWayGlass, "oneWayGlass");
    parts.localVars = tagPart(localVars, "localVars");
    parts.returnOrb = tagPart(returnOrb, "returnOrb");

    return {
      group: G,
      parts: parts,
      apply: apply,
      update: update,
      reading: function () { return solveStackFrame(P); },
      views: {
        all: [0.1, 1.5, 0.2, 7.2],
        globalBase: [0, 0.35, 0.3, 4.4],
        stackFrame: [0, 2.0, 0, 4.6],
        oneWayGlass: [0, 2.0, 0.4, 4.2],
        localVars: [0, 2.0, 0, 3.6],
        returnOrb: [1.9, 1.3, 0.2, 3.8]
      }
    };
  }

  /* ===================================================================
     8. MODE 6: "silicon-bridge" (Lesson 06)
     4-tier vertical architecture tower:
       pythonTier, asmTier, hexTier, cmosTier, voltageProbe
     =================================================================== */
  function buildSiliconBridge(ctx) {
    var G = new THREE.Group();
    var parts = {};
    var P = null, M = null;

    /* Corner bus pillars */
    var pGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.9, 14);
    var pMat = metal(0x3a506b, 0.35);
    [[-2.1, -0.8], [2.1, -0.8], [-2.1, 0.8], [2.1, 0.8]].forEach(function (xz) {
      G.add(mesh(pGeo, pMat, xz[0], 1.85, xz[1]));
    });

    /* Tier 1 (top, y = 3.45): Python High-Level Code */
    var pythonTier = new THREE.Group();
    pythonTier.position.set(0, 3.45, 0);
    var pySlab = mesh(extrudeSlab(rrShape(4.4, 1.65, 0.14), 0.14, 0.015), metal(0x1d3557, 0.32));
    var pyPanel = makeDynamicPanel(3.9, 0.56, 512, 96);
    pyPanel.position.set(0, 0.42, 0.55);
    pythonTier.add(pySlab, pyPanel);
    G.add(pythonTier);

    /* Tier 2 (y = 2.35): Assembly ISA */
    var asmTier = new THREE.Group();
    asmTier.position.set(0, 2.35, 0);
    var asmSlab = mesh(extrudeSlab(rrShape(4.4, 1.65, 0.14), 0.14, 0.015), metal(0x284b63, 0.32));
    var asmPanel = makeDynamicPanel(3.9, 0.56, 512, 96);
    asmPanel.position.set(0, 0.42, 0.55);
    asmTier.add(asmSlab, asmPanel);
    G.add(asmTier);

    /* Tier 3 (y = 1.25): Hex / 8-bit Binary Register */
    var hexTier = new THREE.Group();
    hexTier.position.set(0, 1.25, 0);
    var hexSlab = mesh(extrudeSlab(rrShape(4.4, 1.65, 0.14), 0.14, 0.015), std(0x123524, 0.45, { map: pcbTex(63) }));
    var hexPanel = makeDynamicPanel(3.9, 0.44, 512, 84);
    hexPanel.position.set(0, 0.5, -0.35);
    hexTier.add(hexSlab, hexPanel);

    var bitCells = [];
    for (var b = 0; b < 8; b++) {
      var bx = -1.68 + b * 0.48;
      var cell = mesh(extrudeSlab(rrShape(0.38, 0.48, 0.05), 0.16, 0.01), std(0x38ef7d, 0.22, {
        emissive: new THREE.Color(0x38ef7d),
        emissiveIntensity: 0.6
      }), bx, 0.14, 0.38);
      hexTier.add(cell);
      bitCells.push(cell);
    }
    G.add(hexTier);

    /* Tier 4 (bottom, y = 0.05): 3D CMOS Silicon Logic Gate (P-channel & N-channel MOSFETs) */
    var cmosTier = new THREE.Group();
    cmosTier.position.set(0, 0.05, 0);
    var waferBase = mesh(extrudeSlab(rrShape(4.6, 1.85, 0.16), 0.18, 0.02), std(0x1f324d, 0.25, { map: siliconWaferTex(), metalness: 0.5 }));
    /* P-channel MOSFET (left) & N-channel MOSFET (right) with polysilicon gate bridges */
    var pmosWell = mesh(extrudeSlab(rrShape(1.35, 0.95, 0.08), 0.14, 0.015), std(0xe76f51, 0.35), -1.05, 0.18, 0);
    var nmosWell = mesh(extrudeSlab(rrShape(1.35, 0.95, 0.08), 0.14, 0.015), std(0x2a9d8f, 0.35), 1.05, 0.18, 0);
    var polyGateP = mesh(extrudeSlab(rrShape(0.36, 1.1, 0.04), 0.22, 0.015), metal(0xffb703, 0.25), -1.05, 0.3, 0);
    var polyGateN = mesh(extrudeSlab(rrShape(0.36, 1.1, 0.04), 0.22, 0.015), metal(0xffb703, 0.25), 1.05, 0.3, 0);
    var cmosChannel = splineTube([[-1.05, 0.38, 0], [0, 0.42, 0.35], [1.05, 0.38, 0]], 0.055, 24, 12, std(0x38ef7d, 0.2, {
      emissive: new THREE.Color(0x38ef7d),
      emissiveIntensity: 0.75
    }));
    cmosTier.add(waferBase, pmosWell, nmosWell, polyGateP, polyGateN, cmosChannel);
    G.add(cmosTier);

    /* Voltage Probe & Rail Meter (right side of CMOS tier) */
    var voltageProbe = new THREE.Group();
    voltageProbe.position.set(1.95, 0.55, 0.55);
    var probeBody = mesh(latheGeo([[0, -0.35], [0.03, -0.15], [0.11, 0.1], [0.11, 0.55], [0, 0.6]], 20), metal(0xe63946, 0.25));
    probeBody.rotation.z = 0.28;
    var probeScreen = makeDynamicPanel(1.75, 0.52, 384, 120);
    probeScreen.position.set(-0.35, 0.48, 0.2);
    voltageProbe.add(probeBody, probeScreen);
    G.add(voltageProbe);

    function apply(p) {
      P = p;
      M = solveSiliconBridge(p);

      pyPanel.userData.updateText("TIER 1 · PYTHON", [M.pythonCode], M.tier === 0 ? "#38ef7d" : "#8ecae6", "#0b1929");
      asmPanel.userData.updateText("TIER 2 · ASSEMBLY ISA", [M.asmCode], M.tier === 1 ? "#ffb703" : "#8ecae6", "#101e2e");
      hexPanel.userData.updateText("TIER 3 · HEX " + M.hexCode + " = " + M.binary8 + "₂ (" + M.byteVal + "₁₀)", [
        "High Nibble: " + M.highNibbleHex + " (" + M.highNibbleBin + ") | Low: " + M.lowNibbleHex + " (" + M.lowNibbleBin + ")"
      ], M.tier === 2 ? "#38ef7d" : "#90e0ef", "#0a2118");

      var bits = M.binary8.split("");
      for (var i = 0; i < 8; i++) {
        var b1 = bits[i] === "1";
        var col = b1 ? 0x38ef7d : 0x2b4158;
        bitCells[i].material.color.setHex(col);
        bitCells[i].material.emissive.setHex(b1 ? 0x38ef7d : 0x000000);
        bitCells[i].material.emissiveIntensity = b1 ? 0.75 : 0.05;
        bitCells[i].scale.y = b1 ? 1.4 : 0.75;
      }

      var high = M.conditionMet;
      cmosChannel.material.color.setHex(high ? 0x38ef7d : 0x3a86ff);
      cmosChannel.material.emissive.setHex(high ? 0x38ef7d : 0x1d3557);
      cmosChannel.material.emissiveIntensity = high ? 0.9 : 0.25;

      probeScreen.userData.updateText("TIER 4 · CMOS GATE", [
        M.railVoltage_V.toFixed(1) + " V (" + M.logicState + ")",
        "NMOS: " + M.nmosState
      ], high ? "#38ef7d" : "#ff4d6d", "#0e1b26");
    }

    function update(dt, t) {
      if (!M) return;
      voltageProbe.position.y = 0.55 + Math.sin(t * 3.0) * 0.03;
    }

    parts.pythonTier = tagPart(pythonTier, "pythonTier");
    parts.asmTier = tagPart(asmTier, "asmTier");
    parts.hexTier = tagPart(hexTier, "hexTier");
    parts.cmosTier = tagPart(cmosTier, "cmosTier");
    parts.voltageProbe = tagPart(voltageProbe, "voltageProbe");

    return {
      group: G,
      parts: parts,
      apply: apply,
      update: update,
      reading: function () { return solveSiliconBridge(P); },
      views: {
        all: [0, 1.85, 0.2, 7.8],
        pythonTier: [0, 3.45, 0.2, 4.2],
        asmTier: [0, 2.35, 0.2, 4.2],
        hexTier: [0, 1.25, 0.3, 4.2],
        cmosTier: [0, 0.25, 0.3, 4.4],
        voltageProbe: [1.5, 0.55, 0.5, 3.4]
      }
    };
  }

  /* ===================================================================
     9. create(): Master Group with Lazy Mode Builders & Full Contract
     =================================================================== */
  var BUILDERS = {
    "translation-pipeline": buildTranslationPipeline,
    "decision-tree": buildDecisionTree,
    "loop-jump": buildLoopJump,
    "memory-offset": buildMemoryOffset,
    "stack-frame": buildStackFrame,
    "silicon-bridge": buildSiliconBridge
  };

  function copyP(m, extra) {
    var o = {}, k;
    for (k in DEFAULTS[m]) {
      o[k] = Array.isArray(DEFAULTS[m][k]) ? DEFAULTS[m][k].slice() : DEFAULTS[m][k];
    }
    if (extra) {
      for (k in extra) o[k] = extra[k];
    }
    return o;
  }

  function create(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    g.name = "ProgrammingZoom";
    var S = {
      mode: null,
      labels: opts.labels !== false,
      speed: opts.speed != null ? +opts.speed : 1,
      onEvent: opts.onEvent || null,
      t: 0
    };
    var base = opts.params || {}, params = {}, built = {}, cur = null, listeners = {}, allLabels = [];
    MODE_LIST.forEach(function (m) { params[m] = copyP(m, base[m]); });
    var startMode = BUILDERS[opts.mode] ? opts.mode : "translation-pipeline";
    Object.keys(opts).forEach(function (k) {
      if (k in DEFAULTS[startMode] && k !== "mode") params[startMode][k] = opts[k];
    });

    function emit(name, detail) {
      if (S.onEvent) {
        try { S.onEvent(name, detail); } catch (e) {}
      }
      (listeners[name] || []).forEach(function (fn) {
        try { fn(detail); } catch (e) {}
      });
    }

    function syncParts() {
      if (!cur) return;
      g.parts = cur.parts;
      g.userData.parts = cur.parts;
    }

    function ensure(m) {
      if (built[m]) return built[m];
      var ctx = { S: S, labels: [], emit: emit, partsChanged: syncParts };
      var b = BUILDERS[m](ctx);
      b.ctx = ctx;
      b.group.name = "mode-" + m;
      b.group.visible = false;
      g.add(b.group);
      ctx.labels.forEach(function (l) {
        l.visible = S.labels;
        allLabels.push(l);
      });
      built[m] = b;
      return b;
    }

    var hl = [];
    function clearHL() {
      hl.forEach(function (h) { h.mesh.material = h.orig; });
      hl.length = 0;
    }

    function highlight(name) {
      clearHL();
      if (!name || !cur) return;
      var found = [];
      cur.group.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === name) found.push(o);
      });
      if (!found.length && cur.parts[name]) {
        cur.parts[name].traverse(function (o) { if (o.isMesh) found.push(o); });
      }
      found.forEach(function (o) {
        if (!o.material || Array.isArray(o.material) || !o.material.emissive) return;
        var c = o.material.clone();
        hl.push({ mesh: o, orig: o.material, mat: c });
        c.emissive = new THREE.Color(0xffd166);
        c.emissiveIntensity = 0.65;
        o.material = c;
      });
    }

    function setMode(m) {
      if (!BUILDERS[m]) return false;
      clearHL();
      Object.keys(built).forEach(function (k) { built[k].group.visible = false; });
      var b = ensure(m);
      S.mode = m;
      cur = b;
      b.group.visible = true;
      syncParts();
      b.apply(params[m]);
      syncParts();
      b.update(0.016, S.t);
      emit("mode", { mode: m });
      return true;
    }

    function reading() {
      return cur ? cur.reading() : null;
    }

    function reset() {
      params[S.mode] = copyP(S.mode, base[S.mode]);
      cur.apply(params[S.mode]);
      clearHL();
      emit("reset", { mode: S.mode });
      return reading();
    }

    function setState(o) {
      o = o || {};
      if (o.onEvent) S.onEvent = o.onEvent;
      if (o.speed != null) S.speed = clamp(+o.speed, 0, 4);
      if (o.labels != null) {
        S.labels = Boolean(o.labels);
        allLabels.forEach(function (l) { l.visible = S.labels; });
      }
      if (o.mode && o.mode !== S.mode) setMode(o.mode);
      if (o.params) {
        Object.keys(o.params).forEach(function (m) {
          if (params[m]) {
            for (var k in o.params[m]) params[m][k] = o.params[m][k];
          }
        });
      }
      var p = params[S.mode], touched = false;
      Object.keys(o).forEach(function (k) {
        if (k in p && k !== "mode") {
          p[k] = o[k];
          touched = true;
        }
      });
      if (o.reset) return reset();
      if (cur) cur.apply(p);
      if (touched || o.params) emit("state", reading());
      return reading();
    }

    function viewFor(name) {
      var tbl = cur ? cur.views : { all: [0, 1, 0, 8] };
      var v = tbl[name] || tbl.all;
      g.updateMatrixWorld(true);
      var t = g.localToWorld(new V3(v[0], v[1], v[2]));
      return { target: [t.x, t.y, t.z], dist: v[3] * g.scale.x, pitch: 0.18 };
    }

    function pickPart(raycaster) {
      if (!cur) return null;
      var hits = raycaster.intersectObjects(cur.group.children, true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object, id = o.userData && o.userData.partId, vis = true, q = o;
        while (q) {
          if (q.visible === false) { vis = false; break; }
          q = q.parent;
        }
        if (vis && id && id !== "label" && !(o.material && o.material.opacity < 0.05)) return id;
      }
      return null;
    }

    function update(dt, t) {
      dt = Math.min(dt || 0.016, 0.05) * S.speed;
      S.t += dt;
      if (cur) cur.update(dt, S.t);
      if (hl.length) {
        var k = 0.4 + 0.3 * Math.sin(S.t * 6);
        hl.forEach(function (h) { h.mat.emissiveIntensity = k; });
      }
    }

    attachCompat(g, {}, update, setState);
    g.setMode = setMode;
    g.reading = reading;
    g.reset = reset;
    g.highlight = highlight;
    g.viewFor = viewFor;
    g.pickPart = pickPart;
    g.triangles = function () { return cur ? countTris(cur.group) : 0; };
    g.on = function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); return g; };
    g.params = function () { return params[S.mode]; };
    g.modes = MODE_LIST.slice();

    setMode(startMode);
    return g;
  }

  function makeHighlighter(scene) {
    var saved = [];
    function clear() {
      saved.forEach(function (s) { s.mesh.material = s.orig; });
      saved.length = 0;
    }
    function highlight(name, colorHex) {
      clear();
      if (!name || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === name && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone();
          saved.push({ mesh: o, orig: o.material });
          c.emissive = col.clone();
          c.emissiveIntensity = 0.6;
          o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  global.ProgrammingZoom = {
    create: create,
    makeHighlighter: makeHighlighter,
    model: MODEL,
    defaults: DEFAULTS,
    modes: MODE_LIST,
    version: 1
  };
})(typeof window !== "undefined" ? window : this);
