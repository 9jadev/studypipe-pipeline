/* ==========================================================
   StudyPipe Kit: programming-bench (v1)
   Parametric 6-mode 3D Computer Science & Programming hardware bench
   for three.js (window.THREE). Classic script, 100% offline, no fetch.

   window.ProgrammingBench.create(opts) -> THREE.Group g with:
     g.group / g.parts / g.userData.parts   named parts of the CURRENT mode (each mesh tagged userData.partId)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(patch)                      mode + mode-specific controls
     g.reading()                            deterministic numbers & state from ProgrammingBench.model
     g.takeReading()                        record a row for the practical results table (emits 'reading', 'done')
     g.step()                               advance one iteration/trace step in loop-stepper / array-rack / trace-console
     g.reset()                              reset current mode to defaults
     g.highlight(part, colorHex)            pulsing emissive highlight (null clears)
     g.clearHighlight()
     g.viewFor(part)                        { target:[x,y,z], dist, yawPortrait, pitch } camera framing
     g.pickPart(raycaster)                  -> partId | null
     g.triangles()                          visible triangle count

   Modes:
     1. "memory-stage"      (Lesson 01: RAM slots 0x01..0x06, CPU/ALU, type casting & precedence)
     2. "logic-switchboard" (Lesson 02: Battery dial, Grid switch, AND/OR/NOT gates, Generator relay)
     3. "loop-stepper"      (Lesson 03: Brass gear stepper, PC/Counter/Accumulator registers, Watchdog)
     4. "array-rack"        (Lesson 04: 8-slot contiguous lithium battery memory rack 0x1000..0x101C, pointer, OOB hazard)
     5. "function-factory"  (Lesson 05: Parameter hopper, One-Way Glass local scope dome, return chute, global pillar)
     6. "trace-console"     (Lesson 06: 8-bit toggle switches b7..b0, Hex 7-seg decoder 0x7E, SCADA dry-run trace & contactor)
   ========================================================== */
(function (global) {
  "use strict";
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, V2 = THREE.Vector2, TAU = Math.PI * 2;

  var MODES = [
    "memory-stage",
    "logic-switchboard",
    "loop-stepper",
    "array-rack",
    "function-factory",
    "trace-console"
  ];

  /* ===================================================================
     1. THE DETERMINISTIC COMPUTATIONAL MODEL (ProgrammingBench.model)
     Every number, address, truth value, loop trace, and bill comes from here.
     =================================================================== */

  var TYPE_SIZES = { int: 2, float: 4, str: 7, bool: 1 };

  var DEFAULT_SLOTS = [
    { slot: 1, addr: "0x01", name: "voltage",  type: "int",   value: "230",     bytes: 2 },
    { slot: 2, addr: "0x02", name: "tariff",   type: "float", value: "68.5",    bytes: 4 },
    { slot: 3, addr: "0x03", name: "location", type: "str",   value: "Ikogosi", bytes: 7 },
    { slot: 4, addr: "0x04", name: "active",   type: "bool",  value: "True",    bytes: 1 },
    { slot: 5, addr: "0x05", name: "a",        type: "str",   value: "\"150\"", bytes: 3 },
    { slot: 6, addr: "0x06", name: "b",        type: "int",   value: "20",      bytes: 2 }
  ];

  /* --- Mode 1: memory-stage ---
     s: { exprMode: 'mismatch'|'cast'|'concat'|'precedence'|'bonus', aVal, aType, bVal, bType, slots } */
  function solveMemory(s) {
    s = s || {};
    var slots = (s.slots || DEFAULT_SLOTS).map(function (sl, idx) {
      var t = sl.type || "int";
      var valStr = String(sl.value != null ? sl.value : "");
      var rawClean = valStr.replace(/^["']|["']$/g, "");
      var sz = t === "str" ? Math.max(1, rawClean.length) : (TYPE_SIZES[t] || 2);
      return {
        slot: idx + 1,
        addr: "0x0" + (idx + 1),
        name: sl.name || ("var" + (idx + 1)),
        type: t,
        value: valStr,
        bytes: sz
      };
    });
    var mode = s.exprMode || "cast";
    var aRaw = s.aVal != null ? String(s.aVal) : "150";
    var bRaw = s.bVal != null ? Number(s.bVal) : 20;
    var expr = "", status = "OK", error = null, result = null, resultType = "int", steps = [];

    if (mode === "mismatch") {
      expr = '"150" + 20';
      status = "TypeError";
      error = "TypeError: can only concatenate str (not \"int\") to str";
      result = "ERR";
      resultType = "error";
      steps = ['a = "' + aRaw + '" (str)', "b = " + bRaw + " (int)", "a + b -> TypeError!"];
    } else if (mode === "cast") {
      var aNum = parseInt(aRaw, 10);
      if (isNaN(aNum)) aNum = 150;
      var sum = aNum + bRaw;
      expr = 'int("' + aRaw + '") + ' + bRaw;
      status = "OK";
      result = sum;
      resultType = "int";
      steps = ['int("' + aRaw + '") -> ' + aNum, aNum + " + " + bRaw + " = " + sum];
    } else if (mode === "concat") {
      var joined = String(aRaw) + String(bRaw);
      expr = '"' + aRaw + '" + "' + bRaw + '"';
      status = "OK";
      result = '"' + joined + '"';
      resultType = "str";
      steps = ['"' + aRaw + '" + "' + bRaw + '"', '-> "' + joined + '" (str)'];
    } else if (mode === "precedence") {
      // 12 + 8 * 2 - 6 / 2 = 12 + 16 - 3 = 25
      var p1 = 8 * 2;
      var p2 = 6 / 2;
      var p3 = 12 + p1 - p2;
      expr = "12 + 8 * 2 - 6 / 2";
      status = "OK";
      result = p3;
      resultType = "float";
      steps = ["8 * 2 = 16, 6 / 2 = 3.0", "12 + 16 - 3.0 = 25.0"];
    } else if (mode === "bonus") {
      var rech = 1500, rate = 0.20;
      var bon = rech * rate, tot = rech + bon;
      expr = "1500 + (1500 * 0.20)";
      status = "OK";
      result = tot;
      resultType = "float";
      steps = ["bonus = 1500 * 0.20 = 300", "total = 1500 + 300 = 1800"];
    }

    var totalBytes = slots.reduce(function (acc, x) { return acc + x.bytes; }, 0);
    return {
      exprMode: mode,
      expr: expr,
      status: status,
      error: error,
      result: result,
      resultType: resultType,
      steps: steps,
      slots: slots,
      totalBytes: totalBytes,
      typeError: status === "TypeError"
    };
  }

  /* --- Mode 2: logic-switchboard ---
     s: { battery: 0..100, grid_online: bool, logicMode: 'fixed'|'buggy'|'or_mode' } */
  function solveLogic(s) {
    s = s || {};
    var battery = s.battery != null ? Number(s.battery) : 15;
    var gridOnline = s.grid_online != null ? !!s.grid_online : false;
    var logicMode = s.logicMode || "fixed";
    var lowBat = battery < 20;
    var notGrid = !gridOnline;
    var andOut = false, orOut = lowBat || notGrid, relayOn = false, expr = "";

    if (logicMode === "buggy") {
      andOut = lowBat && gridOnline;
      relayOn = andOut;
      expr = "battery < 20 and grid_online";
    } else if (logicMode === "or_mode") {
      andOut = lowBat && notGrid;
      relayOn = orOut;
      expr = "battery < 20 or not grid_online";
    } else {
      andOut = lowBat && notGrid;
      relayOn = andOut;
      expr = "battery < 20 and not grid_online";
    }

    // Full 4-row truth table for A = (battery < 20), B = grid_online
    var truthTable = [
      { A: false, B: false, notB: true,  buggy: false, fixed: false },
      { A: false, B: true,  notB: false, buggy: false, fixed: false },
      { A: true,  B: false, notB: true,  buggy: false, fixed: true  },
      { A: true,  B: true,  notB: false, buggy: true,  fixed: false }
    ];

    return {
      battery: battery,
      grid_online: gridOnline,
      low_battery: lowBat,
      not_grid: notGrid,
      logicMode: logicMode,
      expr: expr,
      andGate: andOut,
      orGate: orOut,
      notGate: notGrid,
      relay_on: relayOn,
      generator_rpm: relayOn ? 1500 : 0,
      status: relayOn ? "GENERATOR RUNNING" : "STANDBY (OFF)",
      truthTable: truthTable
    };
  }

  /* --- Mode 3: loop-stepper ---
     s: { dataset: 'solar'|'range5'|'infinite', stepIndex: 0..7 } */
  var SOLAR_KWH = [45, 52, 60, 58, 49, 63, 55];
  function solveLoop(s) {
    s = s || {};
    var ds = s.dataset || "solar";
    var stepIdx = Math.max(0, Math.floor(s.stepIndex != null ? s.stepIndex : 0));

    if (ds === "infinite") {
      var ticks = Math.min(stepIdx, 12);
      var watchdogTripped = ticks >= 6;
      return {
        dataset: "infinite",
        loopHeader: "while count < 5: # missing count += 1",
        stepIndex: ticks,
        i: 0,
        currentVal: 0,
        total: 0,
        mean: 0,
        condTrue: true,
        terminated: false,
        watchdog: watchdogTripped,
        pc: watchdogTripped ? "0xFF (HALT)" : ("0x1" + (ticks % 2 === 0 ? "0" : "4")),
        history: [],
        status: watchdogTripped ? "WATCHDOG INTERRUPT: INFINITE LOOP!" : "RUNNING (NO INCREMENT)"
      };
    }

    var arr = ds === "range5" ? [1, 2, 3, 4, 5] : SOLAR_KWH;
    var n = arr.length;
    var clamped = Math.min(stepIdx, n);
    var history = [];
    var runningTotal = 0;
    for (var k = 0; k < clamped; k++) {
      runningTotal += arr[k];
      history.push({
        step: k + 1,
        i: k,
        val: arr[k],
        total: runningTotal,
        cond: k + 1 < n
      });
    }
    var done = clamped >= n;
    var curI = done ? n : (clamped > 0 ? clamped - 1 : 0);
    var curVal = clamped > 0 ? arr[clamped - 1] : arr[0];
    var mean = clamped > 0 ? Math.round((runningTotal / clamped) * 100) / 100 : 0;

    return {
      dataset: ds,
      loopHeader: ds === "range5" ? "for i in range(1, 6):" : "for reading in daily_readings:",
      stepIndex: clamped,
      length: n,
      i: curI,
      currentVal: curVal,
      total: runningTotal,
      mean: mean,
      condTrue: !done,
      terminated: done,
      watchdog: false,
      pc: done ? "0x20 (EXIT)" : ("0x0" + (8 + (clamped % 4) * 2).toString(16).toUpperCase()),
      history: history,
      status: done ? ("COMPLETED (Sum=" + runningTotal + ", Mean=" + mean + ")") : ("STEP " + clamped + "/" + n)
    };
  }

  /* --- Mode 4: array-rack ---
     s: { index: 0..8, cells: [...], scanStep: 0..8, baseAddr: 0x1000, elemSize: 4 } */
  var DEFAULT_CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];
  function solveArray(s) {
    s = s || {};
    var cells = (s.cells && s.cells.length === 8) ? s.cells.slice() : DEFAULT_CELLS.slice();
    var idx = Math.max(0, Math.min(8, Math.floor(s.index != null ? s.index : 0)));
    var base = s.baseAddr || 0x1000;
    var sz = s.elemSize || 4;
    var offset = idx * sz;
    var addrHex = "0x" + (base + offset).toString(16).toUpperCase();
    var oob = idx >= cells.length;
    var val = oob ? null : cells[idx];

    // Linear minimum scan up to scanStep (or full array)
    var scanLimit = s.scanStep != null ? Math.min(cells.length, Math.max(1, s.scanStep)) : cells.length;
    var minVal = cells[0], minIdx = 0;
    for (var i = 0; i < scanLimit; i++) {
      if (cells[i] < minVal) {
        minVal = cells[i];
        minIdx = i;
      }
    }

    return {
      cells: cells,
      length: cells.length,
      maxValidIndex: cells.length - 1,
      index: idx,
      baseAddr: "0x" + base.toString(16).toUpperCase(),
      elemSize: sz,
      offset: offset,
      address: addrHex,
      formula: "0x1000 + (" + idx + " * 4) = " + addrHex,
      value: val,
      outOfBounds: oob,
      error: oob ? "IndexError: list index 8 out of range (valid 0..7)" : null,
      min_voltage: minVal,
      min_index: minIdx,
      weakest_cell: minIdx + 1,
      scanLimit: scanLimit
    };
  }

  /* --- Mode 5: function-factory ---
     s: { units: 85|120|210|45, tariff_rate: 68.0, vat_rate: 0.075, fixed_charge: 1500.0, global_revenue: 50000.0, stage: 'input'|'local'|'return' } */
  function solveFunction(s) {
    s = s || {};
    var units = s.units != null ? Number(s.units) : 85;
    var rate = s.tariff_rate != null ? Number(s.tariff_rate) : 68.0;
    var vatRate = s.vat_rate != null ? Number(s.vat_rate) : 0.075;
    var fixed = s.fixed_charge != null ? Number(s.fixed_charge) : 1500.0;
    var globalRev = s.global_revenue != null ? Number(s.global_revenue) : 50000.0;
    var stage = s.stage || "return";

    var energyCost = Math.round(units * rate * 100) / 100;
    var vatAmount = Math.round(energyCost * vatRate * 100) / 100;
    var totalBill = Math.round((energyCost + vatAmount + fixed) * 100) / 100;

    return {
      units: units,
      tariff_rate: rate,
      vat_rate: vatRate,
      fixed_charge: fixed,
      energy_cost: energyCost,
      vat_amount: vatAmount,
      total_bill: totalBill,
      global_revenue: globalRev,
      local_alive: stage === "local",
      stage: stage,
      signature: "calculate_nepa_bill(" + units + ", " + rate + ", " + vatRate + ")"
    };
  }

  /* --- Mode 6: trace-console ---
     s: { byteVal: 0..255 (default 126 = 0x7E), traceStep: 0..3, readings: [12, 15, 20] } */
  var TRACE_READINGS = [12, 15, 20];
  function solveTrace(s) {
    s = s || {};
    var b = Math.max(0, Math.min(255, Math.floor(s.byteVal != null ? s.byteVal : 126)));
    var bits = [];
    for (var i = 7; i >= 0; i--) bits.push((b >> i) & 1);
    var binStr = bits.join("");
    var hexStr = "0x" + (b < 16 ? "0" : "") + b.toString(16).toUpperCase();
    var authOk = (b === 0x7E);

    var arr = (s.readings && s.readings.length) ? s.readings : TRACE_READINGS;
    var tStep = Math.max(0, Math.min(arr.length, Math.floor(s.traceStep != null ? s.traceStep : 3)));
    var rows = [];
    var total = 0, evenCount = 0;
    for (var k = 0; k < tStep; k++) {
      var v = arr[k];
      var isEven = (v % 2 === 0);
      if (isEven) {
        total += v;
        evenCount++;
      }
      rows.push({
        step: k + 1,
        i: k,
        val: v,
        isEven: isEven,
        total: total,
        count: evenCount
      });
    }
    var traceDone = tStep >= arr.length;
    var contactorClosed = authOk && traceDone;

    return {
      byteVal: b,
      bits: bits,
      binary: binStr,
      hex: hexStr,
      decimal: b,
      authOk: authOk,
      traceStep: tStep,
      traceRows: rows,
      evenSum: total,
      evenCount: evenCount,
      traceDone: traceDone,
      contactorClosed: contactorClosed,
      gridStatus: contactorClosed ? "IKOGOSI MICROGRID ONLINE (50.0 Hz)" : (authOk ? "AUTH OK - RUN TRACE" : "LOCKED (SET 0x7E = 01111110)")
    };
  }

  var model = {
    TYPE_SIZES: TYPE_SIZES,
    DEFAULT_SLOTS: DEFAULT_SLOTS,
    SOLAR_KWH: SOLAR_KWH,
    DEFAULT_CELLS: DEFAULT_CELLS,
    TRACE_READINGS: TRACE_READINGS,
    solveMemory: solveMemory,
    solveLogic: solveLogic,
    solveLoop: solveLoop,
    solveArray: solveArray,
    solveFunction: solveFunction,
    solveTrace: solveTrace
  };

  /* ===================================================================
     2. HIGH-FIDELITY 3D GEOMETRY & PROCEDURAL TEXTURE TOOLKIT
     =================================================================== */

  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function makeCanvas(w, h) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function stdMat(color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial({
      color: color,
      roughness: rough != null ? rough : 0.45,
      metalness: metal != null ? metal : 0.1
    });
    if (extra) {
      for (var k in extra) m[k] = extra[k];
    }
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

  function rrShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    r = Math.min(r || 0.05, w / 2 - 0.002, h / 2 - 0.002);
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  function extrudeSlab(w, d, thick, r, bevel, holeRects) {
    var sh = rrShape(w, d, r || 0.08);
    if (holeRects && holeRects.length) {
      holeRects.forEach(function (hr) {
        var p = new THREE.Path();
        var hx = hr.x - hr.w / 2, hy = hr.y - hr.h / 2;
        p.moveTo(hx, hy);
        p.lineTo(hx + hr.w, hy);
        p.lineTo(hx + hr.w, hy + hr.h);
        p.lineTo(hx, hy + hr.h);
        p.closePath();
        sh.holes.push(p);
      });
    }
    var bv = bevel != null ? bevel : 0.015;
    var geo = new THREE.ExtrudeGeometry(sh, {
      depth: thick,
      bevelEnabled: bv > 0,
      bevelSize: bv,
      bevelThickness: bv,
      bevelSegments: 2,
      curveSegments: 8
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, bv, 0);
    return geo;
  }

  function latheMesh(pts, segs, mat) {
    var v2s = pts.map(function (p) { return new V2(p[0], p[1]); });
    var geo = new THREE.LatheGeometry(v2s, segs || 20);
    return new THREE.Mesh(geo, mat);
  }

  function splineTube(pts, r, segs, radSegs, mat) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (p) {
      return Array.isArray(p) ? new V3(p[0], p[1], p[2]) : p;
    }));
    var geo = new THREE.TubeGeometry(curve, segs || 28, r || 0.03, radSegs || 8, false);
    var m = new THREE.Mesh(geo, mat);
    m.userData.curve = curve;
    return m;
  }

  /* Dynamic canvas screen helper */
  function createScreenPanel(w, h, cw, ch, tiltX) {
    var cv = makeCanvas(cw || 512, ch || 256);
    var ctx = cv.getContext("2d");
    var tex = new THREE.CanvasTexture(cv);
    srgb(tex);
    var g = new THREE.Group();
    var bezelGeo = extrudeSlab(w + 0.14, h + 0.14, 0.08, 0.06, 0.01);
    bezelGeo.rotateX(Math.PI / 2);
    var bezel = new THREE.Mesh(bezelGeo, stdMat(0x16202a, 0.4, 0.5));
    g.add(bezel);
    var scr = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    scr.position.z = 0.115;
    g.add(scr);
    if (tiltX != null) g.rotation.x = tiltX;
    g.userData.canvas = cv;
    g.userData.ctx = ctx;
    g.userData.tex = tex;
    g.userData.draw = function (fn) {
      fn(ctx, cv.width, cv.height);
      tex.needsUpdate = true;
    };
    return g;
  }

  /* Lathe LED beacon with glowing dome */
  function createLedBeacon(radius, colorOff, colorOn) {
    var g = new THREE.Group();
    var base = latheMesh([
      [0, 0], [radius * 1.25, 0], [radius * 1.2, 0.06], [radius * 0.95, 0.08], [0, 0.08]
    ], 16, stdMat(0x2a3441, 0.35, 0.7));
    g.add(base);
    var domeMat = stdMat(colorOff || 0x1d3b2a, 0.2, 0.05, {
      emissive: new THREE.Color(colorOn || 0x22c55e),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.92
    });
    var dome = latheMesh([
      [0, 0.08],
      [radius * 0.9, 0.08],
      [radius * 0.9, 0.08 + radius * 0.7],
      [radius * 0.65, 0.08 + radius * 1.25],
      [radius * 0.3, 0.08 + radius * 1.5],
      [0, 0.08 + radius * 1.58]
    ], 18, domeMat);
    g.add(dome);
    g.userData.domeMat = domeMat;
    g.userData.setColor = function (hex, intensity) {
      domeMat.color.setHex(hex);
      domeMat.emissive.setHex(hex);
      domeMat.emissiveIntensity = intensity != null ? intensity : 0.85;
    };
    return g;
  }

  /* ===================================================================
     3. BUILDERS FOR EACH OF THE 6 MODES
     =================================================================== */

  /* -------------------------------------------------------------------
     MODE 1: "memory-stage" (Lesson 01)
     Parts: pcb, cpu, alu, bus, slot1, slot2, slot3, slot4, slot5, slot6, display, led
     ------------------------------------------------------------------- */
  function buildMemoryStage() {
    var G = new THREE.Group();
    var parts = {};

    // 1. Extruded FR-4 Green PCB with mounting holes & gold edge fingers
    var holes = [
      { x: -2.85, y: -1.75, w: 0.14, h: 0.14 },
      { x:  2.85, y: -1.75, w: 0.14, h: 0.14 },
      { x: -2.85, y:  1.75, w: 0.14, h: 0.14 },
      { x:  2.85, y:  1.75, w: 0.14, h: 0.14 }
    ];
    var pcbGroup = new THREE.Group();
    var pcbBoard = new THREE.Mesh(
      extrudeSlab(6.2, 4.0, 0.12, 0.16, 0.015, holes),
      stdMat(0x0c4a26, 0.55, 0.15)
    );
    pcbGroup.add(pcbBoard);
    var goldMat = stdMat(0xd4af37, 0.25, 0.85);
    for (var gf = 0; gf < 20; gf++) {
      var finger = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.22), goldMat);
      finger.position.set(-2.4 + gf * 0.25, 0.14, 1.9);
      pcbGroup.add(finger);
    }
    G.add(tagPart(pcbGroup, "pcb"));
    parts.pcb = pcbGroup;

    // 2. CPU IC package with metallic gull-wing pins (left front)
    var cpuGroup = new THREE.Group();
    cpuGroup.position.set(-1.95, 0.15, 0.75);
    var cpuBody = new THREE.Mesh(extrudeSlab(1.35, 1.35, 0.22, 0.08, 0.02), stdMat(0x18222d, 0.35, 0.2));
    cpuGroup.add(cpuBody);
    var heatSpreader = new THREE.Mesh(extrudeSlab(0.95, 0.95, 0.04, 0.05, 0.01), stdMat(0xadb5bd, 0.25, 0.85));
    heatSpreader.position.y = 0.23;
    cpuGroup.add(heatSpreader);
    var pinMat = stdMat(0xc0c8d0, 0.3, 0.85);
    for (var p = 0; p < 8; p++) {
      var o = -0.49 + p * 0.14;
      var p1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.16), pinMat);
      p1.position.set(o, 0.05, 0.72);
      var p2 = p1.clone(); p2.position.set(o, 0.05, -0.72);
      var p3 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.05), pinMat);
      p3.position.set(0.72, 0.05, o);
      var p4 = p3.clone(); p4.position.set(-0.72, 0.05, o);
      cpuGroup.add(p1, p2, p3, p4);
    }
    G.add(tagPart(cpuGroup, "cpu"));
    parts.cpu = cpuGroup;

    // 3. ALU Co-processor block (center front, trapezoid-styled arithmetic unit)
    var aluGroup = new THREE.Group();
    aluGroup.position.set(-0.2, 0.15, 0.75);
    var aluSh = new THREE.Shape();
    aluSh.moveTo(-0.55, -0.5);
    aluSh.lineTo(0.55, -0.5);
    aluSh.lineTo(0.38, 0.5);
    aluSh.lineTo(0.12, 0.5);
    aluSh.lineTo(0, 0.25);
    aluSh.lineTo(-0.12, 0.5);
    aluSh.lineTo(-0.38, 0.5);
    aluSh.closePath();
    var aluGeo = new THREE.ExtrudeGeometry(aluSh, { depth: 0.22, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
    aluGeo.rotateX(-Math.PI / 2);
    var aluMesh = new THREE.Mesh(aluGeo, stdMat(0x243447, 0.35, 0.45, { emissive: new THREE.Color(0x0ea5e9), emissiveIntensity: 0.18 }));
    aluGroup.add(aluMesh);
    G.add(tagPart(aluGroup, "alu"));
    parts.alu = aluGroup;

    // 4. Data Bus traces (spline tubes connecting CPU -> ALU -> RAM slots)
    var busGroup = new THREE.Group();
    var traceMat = stdMat(0xf59e0b, 0.3, 0.7, { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.25 });
    var busCurves = [];
    for (var b = 0; b < 4; b++) {
      var zOff = 0.55 + b * 0.11;
      var tm = splineTube([
        [-1.95, 0.16, zOff],
        [-0.2, 0.16, zOff],
        [0.8, 0.16, zOff - 0.3],
        [0.8, 0.16, -0.6],
        [-2.2 + b * 1.2, 0.16, -0.85]
      ], 0.022, 24, 6, traceMat);
      busGroup.add(tm);
      busCurves.push(tm.userData.curve);
    }
    var pulseGeo = new THREE.SphereGeometry(0.055, 10, 10);
    var pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    var pulses = [];
    for (var pb = 0; pb < 8; pb++) {
      var pm = new THREE.Mesh(pulseGeo, pulseMat);
      busGroup.add(pm);
      pulses.push({ mesh: pm, curve: busCurves[pb % busCurves.length], u: (pb / 8) });
    }
    G.add(tagPart(busGroup, "bus"));
    parts.bus = busGroup;

    // 5. 6 RAM Memory Slots (slot1..slot6) along the back row
    var slotMeshes = [];
    for (var sIdx = 0; sIdx < 6; sIdx++) {
      var sg = new THREE.Group();
      var sx = -2.25 + sIdx * 0.9;
      sg.position.set(sx, 0.15, -0.85);

      var sock = new THREE.Mesh(extrudeSlab(0.76, 0.42, 0.14, 0.04, 0.01), stdMat(0x1e293b, 0.5, 0.2));
      sg.add(sock);
      // White ejector latches on both ends
      var latchL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.12), stdMat(0xe2e8f0, 0.4, 0.1));
      latchL.position.set(-0.4, 0.14, 0);
      var latchR = latchL.clone();
      latchR.position.x = 0.4;
      sg.add(latchL, latchR);

      // Vertical RAM card with dynamic canvas label
      var cardCv = makeCanvas(256, 160);
      var cardTex = new THREE.CanvasTexture(cardCv);
      srgb(cardTex);
      var card = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.68, 0.06),
        stdMat(0xffffff, 0.35, 0.1, { map: cardTex })
      );
      card.position.y = 0.46;
      sg.add(card);

      var key = "slot" + (sIdx + 1);
      sg.userData.cardCv = cardCv;
      sg.userData.cardTex = cardTex;
      sg.userData.cardMesh = card;
      G.add(tagPart(sg, key));
      parts[key] = sg;
      slotMeshes.push(sg);
    }

    // 6. OLED Readout Screen (right side)
    var disp = createScreenPanel(2.1, 1.25, 512, 300, -0.35);
    disp.position.set(1.85, 0.92, 0.72);
    G.add(tagPart(disp, "display"));
    parts.display = disp;

    // 7. Status/TypeError LED Beacon (front right corner)
    var led = createLedBeacon(0.18, 0x14532d, 0x22c55e);
    led.position.set(0.58, 0.15, 1.35);
    G.add(tagPart(led, "led"));
    parts.led = led;

    function paintMemory(res) {
      var typeColors = { int: "#2563eb", float: "#0d9488", str: "#d97706", bool: "#9333ea" };
      res.slots.forEach(function (sl, i) {
        var sg = slotMeshes[i];
        if (!sg) return;
        var ctx = sg.userData.cardCv.getContext("2d");
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 256, 160);
        ctx.fillStyle = typeColors[sl.type] || "#2563eb";
        ctx.fillRect(0, 0, 256, 38);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px ui-monospace, monospace";
        ctx.fillText(sl.addr + " [" + sl.type.toUpperCase() + "]", 10, 27);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "18px ui-monospace, monospace";
        ctx.fillText(sl.name + " (" + sl.bytes + "B)", 10, 68);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 28px ui-monospace, monospace";
        ctx.fillText(String(sl.value).slice(0, 10), 10, 118);
        sg.userData.cardTex.needsUpdate = true;
      });

      disp.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = res.typeError ? "#2c0b0e" : "#071926";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = res.typeError ? "#ef4444" : "#10b981";
        ctx.lineWidth = 5;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 20px ui-monospace, monospace";
        ctx.fillText("L01 MEMORY & ALU EVALUATOR", 18, 34);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 26px ui-monospace, monospace";
        ctx.fillText(">>> " + res.expr, 18, 78);

        if (res.typeError) {
          ctx.fillStyle = "#f87171";
          ctx.font = "bold 23px ui-monospace, monospace";
          ctx.fillText("STATUS: TypeError!", 18, 125);
          ctx.font = "18px ui-monospace, monospace";
          ctx.fillText("Cannot add str + int directly.", 18, 160);
          ctx.fillText("Fix: use int(\"150\") + 20", 18, 192);
        } else {
          ctx.fillStyle = "#34d399";
          ctx.font = "bold 26px ui-monospace, monospace";
          ctx.fillText("RESULT = " + res.result + " (" + res.resultType + ")", 18, 130);
          ctx.fillStyle = "#cbd5e1";
          ctx.font = "18px ui-monospace, monospace";
          res.steps.forEach(function (st, idx) {
            ctx.fillText(st, 18, 175 + idx * 32);
          });
        }
        ctx.fillStyle = "#64748b";
        ctx.font = "16px ui-monospace, monospace";
        ctx.fillText("RAM Allocated: " + res.totalBytes + " Bytes across 6 slots", 18, 278);
      });

      if (res.typeError) {
        led.userData.setColor(0xef4444, 1.1);
      } else {
        led.userData.setColor(0x22c55e, 0.85);
      }
    }

    function stepAnim(dt, res) {
      var speed = res && res.typeError ? 0 : 0.65;
      pulses.forEach(function (p) {
        p.u = (p.u + dt * speed) % 1;
        p.curve.getPointAt(p.u, p.mesh.position);
      });
    }

    return { G: G, parts: parts, paint: paintMemory, stepAnim: stepAnim };
  }

  /* -------------------------------------------------------------------
     MODE 2: "logic-switchboard" (Lesson 02)
     Parts: board, batteryDial, gridSwitch, andGate, orGate, notGate, relay, generator, led
     ------------------------------------------------------------------- */
  function buildLogicSwitchboard() {
    var G = new THREE.Group();
    var parts = {};

    // 1. Industrial Switchboard Base
    var boardGroup = new THREE.Group();
    var baseMesh = new THREE.Mesh(extrudeSlab(6.2, 4.0, 0.14, 0.15, 0.02), stdMat(0x1e293b, 0.6, 0.25));
    boardGroup.add(baseMesh);
    G.add(tagPart(boardGroup, "board"));
    parts.board = boardGroup;

    // 2. Battery Level Rotary Sensor Dial (front left)
    var dialGroup = new THREE.Group();
    dialGroup.position.set(-2.2, 0.16, 1.0);
    var dialHousing = latheMesh([
      [0, 0], [0.58, 0], [0.58, 0.14], [0.46, 0.26], [0, 0.26]
    ], 24, stdMat(0x334155, 0.4, 0.5));
    dialGroup.add(dialHousing);
    var knobPivot = new THREE.Group();
    knobPivot.position.y = 0.26;
    var knob = latheMesh([
      [0, 0], [0.32, 0], [0.30, 0.18], [0, 0.18]
    ], 18, stdMat(0x0284c7, 0.35, 0.3));
    var ptrBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.32), stdMat(0xfacc15, 0.2, 0.1));
    ptrBar.position.set(0, 0.19, -0.1);
    knobPivot.add(knob, ptrBar);
    dialGroup.add(knobPivot);
    dialGroup.userData.knobPivot = knobPivot;
    G.add(tagPart(dialGroup, "batteryDial"));
    parts.batteryDial = dialGroup;

    // 3. Mains Grid Status Knife/Toggle Switch (back left)
    var swGroup = new THREE.Group();
    swGroup.position.set(-2.2, 0.16, -0.8);
    var swBase = new THREE.Mesh(extrudeSlab(0.85, 0.95, 0.14, 0.06, 0.01), stdMat(0x273549, 0.4, 0.4));
    swGroup.add(swBase);
    var leverPivot = new THREE.Group();
    leverPivot.position.set(0, 0.2, 0);
    var leverArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 12), stdMat(0xd4d4d8, 0.25, 0.85));
    leverArm.position.y = 0.3;
    var leverHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.22, 14), stdMat(0xdc2626, 0.35, 0.1));
    leverHandle.position.y = 0.62;
    leverPivot.add(leverArm, leverHandle);
    swGroup.add(leverPivot);
    swGroup.userData.leverPivot = leverPivot;
    swGroup.userData.handleMat = leverHandle.material;
    G.add(tagPart(swGroup, "gridSwitch"));
    parts.gridSwitch = swGroup;

    // 4. NOT Gate Module (true triangle + inversion bubble profile)
    var notGroup = new THREE.Group();
    notGroup.position.set(-0.7, 0.16, -0.8);
    var notSh = new THREE.Shape();
    notSh.moveTo(-0.42, -0.36);
    notSh.lineTo(0.32, 0);
    notSh.lineTo(-0.42, 0.36);
    notSh.closePath();
    var notGeo = new THREE.ExtrudeGeometry(notSh, { depth: 0.22, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
    notGeo.rotateX(-Math.PI / 2);
    var notBody = new THREE.Mesh(notGeo, stdMat(0x7c3aed, 0.35, 0.25, { emissive: new THREE.Color(0x7c3aed), emissiveIntensity: 0.2 }));
    var notBubble = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.24, 16), notBody.material);
    notBubble.position.set(0.42, 0.12, 0);
    notGroup.add(notBody, notBubble);
    notGroup.userData.mat = notBody.material;
    G.add(tagPart(notGroup, "notGate"));
    parts.notGate = notGroup;

    // 5. AND Gate Module (true D-shaped IEEE logic gate housing)
    var andGroup = new THREE.Group();
    andGroup.position.set(0.35, 0.16, 0.15);
    var andSh = new THREE.Shape();
    andSh.moveTo(-0.48, -0.42);
    andSh.lineTo(0.05, -0.42);
    andSh.absarc(0.05, 0, 0.42, -Math.PI / 2, Math.PI / 2, false);
    andSh.lineTo(-0.48, 0.42);
    andSh.closePath();
    var andGeo = new THREE.ExtrudeGeometry(andSh, { depth: 0.25, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018 });
    andGeo.rotateX(-Math.PI / 2);
    var andBody = new THREE.Mesh(andGeo, stdMat(0x0284c7, 0.35, 0.25, { emissive: new THREE.Color(0x0284c7), emissiveIntensity: 0.2 }));
    andGroup.add(andBody);
    andGroup.userData.mat = andBody.material;
    G.add(tagPart(andGroup, "andGate"));
    parts.andGate = andGroup;

    // 6. OR Gate Module (curved shield IEEE logic gate housing)
    var orGroup = new THREE.Group();
    orGroup.position.set(0.35, 0.16, 1.25);
    var orSh = new THREE.Shape();
    orSh.moveTo(-0.48, -0.40);
    orSh.quadraticCurveTo(0.05, -0.40, 0.48, 0);
    orSh.quadraticCurveTo(0.05, 0.40, -0.48, 0.40);
    orSh.quadraticCurveTo(-0.22, 0, -0.48, -0.40);
    var orGeo = new THREE.ExtrudeGeometry(orSh, { depth: 0.22, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
    orGeo.rotateX(-Math.PI / 2);
    var orBody = new THREE.Mesh(orGeo, stdMat(0x0d9488, 0.35, 0.25, { emissive: new THREE.Color(0x0d9488), emissiveIntensity: 0.15 }));
    orGroup.add(orBody);
    orGroup.userData.mat = orBody.material;
    G.add(tagPart(orGroup, "orGate"));
    parts.orGate = orGroup;

    // 7. Heavy Contactor Relay with Copper Coil & Moving Armature
    var relayGroup = new THREE.Group();
    relayGroup.position.set(1.65, 0.16, 0.15);
    var relayCoil = latheMesh([
      [0, 0], [0.34, 0], [0.34, 0.06], [0.26, 0.06], [0.26, 0.44], [0.34, 0.44], [0.34, 0.50], [0, 0.50]
    ], 20, stdMat(0xb45309, 0.35, 0.65));
    relayGroup.add(relayCoil);
    var armature = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.22), stdMat(0xd4af37, 0.25, 0.85));
    armature.position.set(0, 0.56, 0);
    relayGroup.add(armature);
    relayGroup.userData.armature = armature;
    G.add(tagPart(relayGroup, "relay"));
    parts.relay = relayGroup;

    // 8. Diesel Generator Starter Unit with Spinning Spoked Flywheel & Truth-Table Screen
    var genGroup = new THREE.Group();
    genGroup.position.set(2.15, 0.16, -0.95);
    var genBody = new THREE.Mesh(extrudeSlab(1.3, 1.1, 0.65, 0.12, 0.02), stdMat(0xb45309, 0.45, 0.35));
    genGroup.add(genBody);
    var flywheel = new THREE.Group();
    flywheel.position.set(0, 0.42, 0.62);
    var rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.055, 12, 24), stdMat(0x94a3b8, 0.25, 0.85));
    flywheel.add(rim);
    for (var sp = 0; sp < 4; sp++) {
      var spoke = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.03), rim.material);
      spoke.rotation.z = (sp * Math.PI) / 4;
      flywheel.add(spoke);
    }
    genGroup.add(flywheel);
    genGroup.userData.flywheel = flywheel;

    var logicScreen = createScreenPanel(1.9, 1.05, 480, 260, -0.35);
    logicScreen.position.set(-0.3, 0.95, -0.35);
    genGroup.add(logicScreen);
    genGroup.userData.screen = logicScreen;
    G.add(tagPart(genGroup, "generator"));
    parts.generator = genGroup;

    // 9. Output Status LED Beacon
    var led = createLedBeacon(0.18, 0x1e293b, 0x22c55e);
    led.position.set(1.65, 0.16, 1.25);
    G.add(tagPart(led, "led"));
    parts.led = led;

    // Connecting signal traces
    var traceMat = stdMat(0x38bdf8, 0.3, 0.5);
    boardGroup.add(
      splineTube([[-2.2, 0.18, 1.0], [-0.8, 0.18, 0.4], [-0.15, 0.18, 0.25]], 0.022, 16, 6, traceMat),
      splineTube([[-2.2, 0.18, -0.8], [-1.15, 0.18, -0.8]], 0.022, 12, 6, traceMat),
      splineTube([[-0.25, 0.18, -0.8], [-0.15, 0.18, -0.05]], 0.022, 12, 6, traceMat),
      splineTube([[0.82, 0.18, 0.15], [1.65, 0.18, 0.15], [2.15, 0.18, -0.45]], 0.025, 16, 6, traceMat)
    );

    function paintLogic(res) {
      dialGroup.userData.knobPivot.rotation.y = (0.5 - res.battery / 100) * 2.2;
      swGroup.userData.leverPivot.rotation.z = res.grid_online ? -0.45 : 0.45;
      swGroup.userData.handleMat.color.setHex(res.grid_online ? 0x22c55e : 0xef4444);

      notGroup.userData.mat.emissiveIntensity = res.notGate ? 0.75 : 0.12;
      andGroup.userData.mat.emissiveIntensity = res.andGate ? 0.85 : 0.12;
      orGroup.userData.mat.emissiveIntensity = res.orGate ? 0.65 : 0.12;
      relayGroup.userData.armature.position.y = res.relay_on ? 0.50 : 0.58;

      led.userData.setColor(res.relay_on ? 0x22c55e : 0xf59e0b, res.relay_on ? 1.0 : 0.25);

      logicScreen.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = "#081420";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = res.relay_on ? "#22c55e" : "#38bdf8";
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 18px ui-monospace, monospace";
        ctx.fillText("L02 GENERATOR DECISION RELAY", 14, 28);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 20px ui-monospace, monospace";
        ctx.fillText("if " + res.expr + ":", 14, 62);

        ctx.fillStyle = res.low_battery ? "#facc15" : "#94a3b8";
        ctx.font = "18px ui-monospace, monospace";
        ctx.fillText("Battery=" + res.battery + "% (<20: " + res.low_battery + ")", 14, 98);
        ctx.fillStyle = res.grid_online ? "#4ade80" : "#f87171";
        ctx.fillText("Grid=" + (res.grid_online ? "ONLINE (True)" : "OFFLINE (False)"), 14, 128);
        ctx.fillStyle = "#c084fc";
        ctx.fillText("NOT Grid=" + res.notGate + " | AND=" + res.andGate, 14, 158);

        ctx.fillStyle = res.relay_on ? "#22c55e" : "#f97316";
        ctx.font = "bold 24px ui-monospace, monospace";
        ctx.fillText("RELAY: " + res.status, 14, 205);
      });
    }

    function stepAnim(dt, res) {
      if (res && res.relay_on) {
        genGroup.userData.flywheel.rotation.z -= dt * 9.0;
      }
    }

    return { G: G, parts: parts, paint: paintLogic, stepAnim: stepAnim };
  }

  /* -------------------------------------------------------------------
     MODE 3: "loop-stepper" (Lesson 03)
     Parts: base, gear, counterReg, accumReg, condDiamond, watchdog, bus, display
     ------------------------------------------------------------------- */
  function buildLoopStepper() {
    var G = new THREE.Group();
    var parts = {};

    // 1. Base Plate
    var baseGroup = new THREE.Group();
    var baseSlab = new THREE.Mesh(extrudeSlab(6.2, 4.0, 0.14, 0.15, 0.02), stdMat(0x18222f, 0.55, 0.25));
    baseGroup.add(baseSlab);
    G.add(tagPart(baseGroup, "base"));
    parts.base = baseGroup;

    // 2. Extruded 16-tooth Brass Stepper Gear with central bore hole
    var gearGroup = new THREE.Group();
    gearGroup.position.set(-1.7, 0.22, 0.4);
    var gearSh = new THREE.Shape();
    var teeth = 16, rOuter = 0.88, rInner = 0.70;
    for (var t = 0; t < teeth * 2; t++) {
      var a = (t / (teeth * 2)) * TAU;
      var r = (t % 2 === 0) ? rOuter : rInner;
      var gx = Math.cos(a) * r, gy = Math.sin(a) * r;
      if (t === 0) gearSh.moveTo(gx, gy);
      else gearSh.lineTo(gx, gy);
    }
    gearSh.closePath();
    var bore = new THREE.Path();
    bore.absarc(0, 0, 0.22, 0, TAU, true);
    gearSh.holes.push(bore);
    var gearGeo = new THREE.ExtrudeGeometry(gearSh, { depth: 0.20, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
    gearGeo.rotateX(-Math.PI / 2);
    var gearWheel = new THREE.Mesh(gearGeo, stdMat(0xd97706, 0.3, 0.8));
    var axle = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.36, 18), stdMat(0x94a3b8, 0.25, 0.85));
    axle.position.y = 0.12;
    gearGroup.add(gearWheel, axle);
    gearGroup.userData.wheel = gearWheel;
    G.add(tagPart(gearGroup, "gear"));
    parts.gear = gearGroup;

    // 3. Loop Counter Register `i` (7-segment style panel)
    var counterReg = createScreenPanel(1.3, 0.72, 280, 150, -0.35);
    counterReg.position.set(-1.7, 0.72, -1.1);
    G.add(tagPart(counterReg, "counterReg"));
    parts.counterReg = counterReg;

    // 4. Accumulator Register `total`
    var accumReg = createScreenPanel(1.5, 0.72, 320, 150, -0.35);
    accumReg.position.set(0.05, 0.72, -1.1);
    G.add(tagPart(accumReg, "accumReg"));
    parts.accumReg = accumReg;

    // 5. Flowchart Condition Diamond (`i < len` / `count < 5`)
    var condGroup = new THREE.Group();
    condGroup.position.set(0.05, 0.22, 0.45);
    var dSh = new THREE.Shape();
    dSh.moveTo(0, -0.62);
    dSh.lineTo(0.78, 0);
    dSh.lineTo(0, 0.62);
    dSh.lineTo(-0.78, 0);
    dSh.closePath();
    var dGeo = new THREE.ExtrudeGeometry(dSh, { depth: 0.18, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
    dGeo.rotateX(-Math.PI / 2);
    var dMesh = new THREE.Mesh(dGeo, stdMat(0x0284c7, 0.35, 0.3, { emissive: new THREE.Color(0x0284c7), emissiveIntensity: 0.3 }));
    condGroup.add(dMesh);
    condGroup.userData.mat = dMesh.material;
    G.add(tagPart(condGroup, "condDiamond"));
    parts.condDiamond = condGroup;

    // 6. Watchdog Timer Alarm Beacon
    var watchdog = createLedBeacon(0.22, 0x3b0764, 0xef4444);
    watchdog.position.set(0.05, 0.16, 1.45);
    G.add(tagPart(watchdog, "watchdog"));
    parts.watchdog = watchdog;

    // 7. Backward Jump Loop Bus Trace
    var busGroup = new THREE.Group();
    var loopTube = splineTube([
      [0.05, 0.2, -0.15],
      [0.05, 0.2, -0.65],
      [-1.7, 0.2, -0.65],
      [-1.7, 0.2, -0.25]
    ], 0.032, 24, 8, stdMat(0x10b981, 0.3, 0.6, { emissive: new THREE.Color(0x10b981), emissiveIntensity: 0.3 }));
    busGroup.add(loopTube);
    G.add(tagPart(busGroup, "bus"));
    parts.bus = busGroup;

    // 8. Main Step Trace Display (right side)
    var disp = createScreenPanel(2.15, 1.35, 512, 320, -0.32);
    disp.position.set(1.9, 0.92, 0.2);
    G.add(tagPart(disp, "display"));
    parts.display = disp;

    var targetGearAngle = 0;

    function paintLoop(res) {
      targetGearAngle = -res.stepIndex * (TAU / 8);
      condGroup.userData.mat.color.setHex(res.watchdog ? 0xef4444 : (res.condTrue ? 0x0284c7 : 0x22c55e));
      condGroup.userData.mat.emissive.setHex(res.watchdog ? 0xef4444 : (res.condTrue ? 0x0284c7 : 0x22c55e));
      watchdog.userData.setColor(res.watchdog ? 0xef4444 : 0x22c55e, res.watchdog ? 1.2 : 0.25);

      counterReg.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = "#091522";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 4;
        ctx.strokeRect(3, 3, w - 6, h - 6);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 20px ui-monospace, monospace";
        ctx.fillText("COUNTER i", 14, 30);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 54px ui-monospace, monospace";
        ctx.fillText("i = " + res.i, 14, 102);
        ctx.fillStyle = "#64748b";
        ctx.font = "16px ui-monospace, monospace";
        ctx.fillText("PC: " + res.pc, 14, 138);
      });

      accumReg.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = "#091914";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.strokeRect(3, 3, w - 6, h - 6);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 20px ui-monospace, monospace";
        ctx.fillText("ACCUMULATOR", 14, 30);
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 46px ui-monospace, monospace";
        ctx.fillText("sum=" + res.total, 14, 100);
        ctx.fillStyle = "#a7f3d0";
        ctx.font = "16px ui-monospace, monospace";
        ctx.fillText("mean=" + res.mean + " kWh", 14, 138);
      });

      disp.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = res.watchdog ? "#2c0b0e" : "#071624";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = res.watchdog ? "#ef4444" : "#38bdf8";
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 19px ui-monospace, monospace";
        ctx.fillText(res.loopHeader, 14, 30);

        if (res.watchdog) {
          ctx.fillStyle = "#f87171";
          ctx.font = "bold 22px ui-monospace, monospace";
          ctx.fillText("WATCHDOG EMERGENCY HALT!", 14, 80);
          ctx.font = "18px ui-monospace, monospace";
          ctx.fillText("count stayed 0 (< 5 forever).", 14, 120);
          ctx.fillText("Fix: add count += 1 in loop body.", 14, 154);
        } else {
          ctx.fillStyle = "#94a3b8";
          ctx.font = "17px ui-monospace, monospace";
          ctx.fillText("Step | i | val | total | cond", 14, 64);
          var startIdx = Math.max(0, res.history.length - 5);
          for (var r = startIdx; r < res.history.length; r++) {
            var row = res.history[r];
            var y = 94 + (r - startIdx) * 30;
            ctx.fillStyle = (r === res.history.length - 1) ? "#38bdf8" : "#cbd5e1";
            ctx.fillText(
              " #" + row.step + "  | " + row.i + " | " + row.val + "  |  " + row.total + "  | " + (row.cond ? "True" : "Exit"),
              14, y
            );
          }
          ctx.fillStyle = "#34d399";
          ctx.font = "bold 19px ui-monospace, monospace";
          ctx.fillText(res.status, 14, 290);
        }
      });
    }

    function stepAnim(dt, res) {
      if (res && res.dataset === "infinite" && !res.watchdog) {
        gearGroup.userData.wheel.rotation.y -= dt * 6.5;
      } else {
        var cur = gearGroup.userData.wheel.rotation.y;
        gearGroup.userData.wheel.rotation.y += (targetGearAngle - cur) * Math.min(1, dt * 8);
      }
    }

    return { G: G, parts: parts, paint: paintLoop, stepAnim: stepAnim };
  }

  /* -------------------------------------------------------------------
     MODE 4: "array-rack" (Lesson 04)
     Parts: rack, pointer, slot0..slot7, oobZone, alarm, display
     ------------------------------------------------------------------- */
  function buildArrayRack() {
    var G = new THREE.Group();
    var parts = {};

    // 1. Contiguous Array Rack Base & Guide Rail
    var rackGroup = new THREE.Group();
    var rackBase = new THREE.Mesh(extrudeSlab(6.5, 3.8, 0.14, 0.14, 0.02), stdMat(0x16222f, 0.55, 0.3));
    rackGroup.add(rackBase);
    var rail = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 5.9, 14), stdMat(0x94a3b8, 0.25, 0.85));
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0.32, 0.85);
    rackGroup.add(rail);
    G.add(tagPart(rackGroup, "rack"));
    parts.rack = rackGroup;

    // 2. 8 Contiguous Lithium Cell Memory Lockers (slot0..slot7)
    var slotGroups = [];
    for (var i = 0; i < 8; i++) {
      var sg = new THREE.Group();
      var sx = -2.65 + i * 0.64;
      sg.position.set(sx, 0.15, -0.15);

      var bay = new THREE.Mesh(extrudeSlab(0.56, 1.05, 0.12, 0.04, 0.01), stdMat(0x1e293b, 0.5, 0.3));
      sg.add(bay);

      // Cylindrical Lithium Cell with Lathe terminal cap
      var cellMat = stdMat(i === 3 ? 0xf59e0b : 0x0ea5e9, 0.3, 0.4);
      var cellBody = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.68, 20), cellMat);
      cellBody.position.set(0, 0.46, -0.1);
      var cap = latheMesh([[0, 0], [0.12, 0], [0.10, 0.08], [0, 0.08]], 16, stdMat(0xd4af37, 0.25, 0.85));
      cap.position.set(0, 0.80, -0.1);
      sg.add(cellBody, cap);

      // Front badge showing Index + Address + Voltage
      var badgeCv = makeCanvas(160, 140);
      var badgeTex = new THREE.CanvasTexture(badgeCv);
      srgb(badgeTex);
      var badge = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.46), new THREE.MeshBasicMaterial({ map: badgeTex }));
      badge.position.set(0, 0.36, 0.42);
      sg.add(badge);

      sg.userData.badgeCv = badgeCv;
      sg.userData.badgeTex = badgeTex;
      sg.userData.cellMat = cellMat;
      var key = "slot" + i;
      G.add(tagPart(sg, key));
      parts[key] = sg;
      slotGroups.push(sg);
    }

    // 3. Index 8 Out-Of-Bounds Hazard Zone (right end of rack)
    var oobGroup = new THREE.Group();
    oobGroup.position.set(-2.65 + 8 * 0.64, 0.15, -0.15);
    var oobSlab = new THREE.Mesh(extrudeSlab(0.58, 1.05, 0.18, 0.04, 0.01), stdMat(0x991b1b, 0.4, 0.2, { emissive: new THREE.Color(0xef4444), emissiveIntensity: 0.35 }));
    var barPost = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.45, 0.08), stdMat(0xef4444, 0.3, 0.2));
    barPost.position.set(0, 0.42, 0);
    oobGroup.add(oobSlab, barPost);
    oobGroup.userData.mat = oobSlab.material;
    G.add(tagPart(oobGroup, "oobZone"));
    parts.oobZone = oobGroup;

    // 4. Motorized Sliding Pointer Carriage with Laser Needle
    var ptrGroup = new THREE.Group();
    ptrGroup.position.set(-2.65, 0.32, 0.85);
    var carriage = new THREE.Mesh(extrudeSlab(0.46, 0.38, 0.24, 0.05, 0.015), stdMat(0x38bdf8, 0.3, 0.5));
    carriage.position.y = -0.12;
    var needle = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.45, 16), stdMat(0xfacc15, 0.2, 0.2, { emissive: new THREE.Color(0xfacc15), emissiveIntensity: 0.5 }));
    needle.rotation.x = -Math.PI / 2;
    needle.position.set(0, 0.08, -0.35);
    ptrGroup.add(carriage, needle);
    G.add(tagPart(ptrGroup, "pointer"));
    parts.pointer = ptrGroup;

    // 5. Out-Of-Bounds Alarm Beacon
    var alarm = createLedBeacon(0.20, 0x3b0764, 0xef4444);
    alarm.position.set(2.55, 0.15, 1.25);
    G.add(tagPart(alarm, "alarm"));
    parts.alarm = alarm;

    // 6. Offset Inspector OLED Screen
    var disp = createScreenPanel(3.4, 0.95, 640, 200, -0.42);
    disp.position.set(-0.3, 0.72, 1.38);
    G.add(tagPart(disp, "display"));
    parts.display = disp;

    var targetPtrX = -2.65;

    function paintArray(res) {
      targetPtrX = -2.65 + res.index * 0.64;
      for (var i = 0; i < 8; i++) {
        var sg = slotGroups[i];
        var v = res.cells[i];
        var selected = (res.index === i);
        var isMin = (i === res.min_index);
        sg.userData.cellMat.emissive = new THREE.Color(selected ? 0x38bdf8 : (isMin ? 0xf59e0b : 0x000000));
        sg.userData.cellMat.emissiveIntensity = selected ? 0.55 : (isMin ? 0.35 : 0);

        var ctx = sg.userData.badgeCv.getContext("2d");
        ctx.fillStyle = selected ? "#0c4a6e" : "#0f172a";
        ctx.fillRect(0, 0, 160, 140);
        ctx.strokeStyle = selected ? "#38bdf8" : "#334155";
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, 156, 136);
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 24px ui-monospace, monospace";
        ctx.fillText("[" + i + "]", 10, 30);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "18px ui-monospace, monospace";
        ctx.fillText("0x" + (0x1000 + i * 4).toString(16).toUpperCase(), 10, 62);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 30px ui-monospace, monospace";
        ctx.fillText(v.toFixed(2) + "V", 10, 112);
        sg.userData.badgeTex.needsUpdate = true;
      }

      alarm.userData.setColor(res.outOfBounds ? 0xef4444 : 0x22c55e, res.outOfBounds ? 1.2 : 0.25);
      oobGroup.userData.mat.emissiveIntensity = res.outOfBounds ? 1.0 : 0.25;

      disp.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = res.outOfBounds ? "#2c0b0e" : "#071827";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = res.outOfBounds ? "#ef4444" : "#38bdf8";
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 22px ui-monospace, monospace";
        ctx.fillText("OFFSET: " + res.formula, 16, 38);

        if (res.outOfBounds) {
          ctx.fillStyle = "#f87171";
          ctx.font = "bold 24px ui-monospace, monospace";
          ctx.fillText(res.error, 16, 88);
          ctx.fillStyle = "#fca5a5";
          ctx.font = "20px ui-monospace, monospace";
          ctx.fillText("Length N=8 -> Max valid index is N-1 = 7!", 16, 132);
        } else {
          ctx.fillStyle = "#34d399";
          ctx.font = "bold 26px ui-monospace, monospace";
          ctx.fillText("cells[" + res.index + "] = " + res.value.toFixed(2) + " V (Slot #" + (res.index + 1) + ")", 16, 90);
          ctx.fillStyle = "#fbbf24";
          ctx.font = "20px ui-monospace, monospace";
          ctx.fillText("Min Scan: " + res.min_voltage.toFixed(2) + " V at Index " + res.min_index + " (Cell " + res.weakest_cell + ")", 16, 140);
        }
      });
    }

    function stepAnim(dt) {
      ptrGroup.position.x += (targetPtrX - ptrGroup.position.x) * Math.min(1, dt * 10);
    }

    return { G: G, parts: parts, paint: paintArray, stepAnim: stepAnim };
  }

  /* -------------------------------------------------------------------
     MODE 5: "function-factory" (Lesson 05)
     Parts: chamber, hopper, localDome, returnChute, globalPillar, display
     ------------------------------------------------------------------- */
  function buildFunctionFactory() {
    var G = new THREE.Group();
    var parts = {};

    // 1. Factory Chamber Base & Pedestal
    var chamberGroup = new THREE.Group();
    var baseSlab = new THREE.Mesh(extrudeSlab(6.2, 4.0, 0.14, 0.15, 0.02), stdMat(0x16202b, 0.55, 0.25));
    var coreRing = latheMesh([
      [0, 0.14], [1.25, 0.14], [1.25, 0.34], [1.05, 0.42], [0, 0.42]
    ], 28, stdMat(0x27374d, 0.4, 0.5));
    coreRing.position.set(-0.45, 0, 0.1);
    chamberGroup.add(baseSlab, coreRing);
    G.add(tagPart(chamberGroup, "chamber"));
    parts.chamber = chamberGroup;

    // 2. Parameter Input Hopper (top-left funnel feeding the function)
    var hopperGroup = new THREE.Group();
    hopperGroup.position.set(-2.1, 0.85, 0.1);
    var funnel = latheMesh([
      [0.18, 0], [0.22, 0.35], [0.62, 0.85], [0.68, 0.95], [0.58, 0.95], [0.16, 0.35], [0.14, 0]
    ], 24, stdMat(0x0284c7, 0.3, 0.45));
    var feedPipe = splineTube([[0, 0.05, 0], [0.65, -0.15, 0], [1.1, -0.25, 0]], 0.11, 16, 10, stdMat(0x38bdf8, 0.3, 0.5));
    hopperGroup.add(funnel, feedPipe);
    G.add(tagPart(hopperGroup, "hopper"));
    parts.hopper = hopperGroup;

    // 3. Translucent "One-Way Glass" Local Scope Dome (center)
    var domeGroup = new THREE.Group();
    domeGroup.position.set(-0.45, 0.42, 0.1);
    var glassMat = stdMat(0x38bdf8, 0.15, 0.1, {
      transparent: true,
      opacity: 0.38,
      emissive: new THREE.Color(0x0ea5e9),
      emissiveIntensity: 0.25
    });
    var glassDome = latheMesh([
      [0.98, 0], [0.98, 0.55], [0.82, 0.95], [0.48, 1.22], [0, 1.32]
    ], 28, glassMat);
    domeGroup.add(glassDome);

    // Internal Local Scope Variable Orbs (energy_cost, vat_amount, fixed_charge)
    var orbGroup = new THREE.Group();
    orbGroup.position.y = 0.48;
    var o1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), stdMat(0xfacc15, 0.2, 0.3, { emissive: new THREE.Color(0xfacc15), emissiveIntensity: 0.4 }));
    o1.position.set(-0.35, 0, 0.2);
    var o2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), stdMat(0x34d399, 0.2, 0.3, { emissive: new THREE.Color(0x34d399), emissiveIntensity: 0.4 }));
    o2.position.set(0.35, 0.15, 0.2);
    var o3 = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), stdMat(0xf472b6, 0.2, 0.3, { emissive: new THREE.Color(0xf472b6), emissiveIntensity: 0.4 }));
    o3.position.set(0, 0.3, -0.3);
    orbGroup.add(o1, o2, o3);
    domeGroup.add(orbGroup);
    domeGroup.userData.orbGroup = orbGroup;
    domeGroup.userData.glassMat = glassMat;
    G.add(tagPart(domeGroup, "localDome"));
    parts.localDome = domeGroup;

    // 4. Return Value Conveyor Chute (exiting right from dome)
    var chuteGroup = new THREE.Group();
    chuteGroup.position.set(0.95, 0.35, 0.1);
    var chuteTrack = new THREE.Mesh(extrudeSlab(1.25, 0.52, 0.10, 0.05, 0.01), stdMat(0x059669, 0.35, 0.4));
    chuteTrack.rotation.z = -0.18;
    var pkgBox = new THREE.Mesh(extrudeSlab(0.38, 0.34, 0.24, 0.04, 0.01), stdMat(0xf59e0b, 0.3, 0.3, { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.35 }));
    pkgBox.position.set(0.1, 0.15, 0);
    chuteGroup.add(chuteTrack, pkgBox);
    chuteGroup.userData.pkgBox = pkgBox;
    G.add(tagPart(chuteGroup, "returnChute"));
    parts.returnChute = chuteGroup;

    // 5. Isolated Global Scope Memory Pillar (back right, shielded from local vars)
    var pillarGroup = new THREE.Group();
    pillarGroup.position.set(2.25, 0.15, -0.95);
    var pillarBody = new THREE.Mesh(extrudeSlab(1.15, 0.95, 1.25, 0.08, 0.02), stdMat(0x312e81, 0.4, 0.4, { emissive: new THREE.Color(0x6366f1), emissiveIntensity: 0.2 }));
    pillarGroup.add(pillarBody);
    G.add(tagPart(pillarGroup, "globalPillar"));
    parts.globalPillar = pillarGroup;

    // 6. Function Scope & Bill Readout Screen (front right)
    var disp = createScreenPanel(2.35, 1.25, 540, 300, -0.35);
    disp.position.set(1.55, 0.85, 0.95);
    G.add(tagPart(disp, "display"));
    parts.display = disp;

    function paintFunction(res) {
      disp.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = "#071726";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 19px ui-monospace, monospace";
        ctx.fillText("def " + res.signature + ":", 14, 32);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "18px ui-monospace, monospace";
        ctx.fillText("  [LOCAL] energy_cost = N" + res.energy_cost.toFixed(2), 14, 68);
        ctx.fillText("  [LOCAL] vat_amount  = N" + res.vat_amount.toFixed(2), 14, 98);
        ctx.fillText("  [LOCAL] fixed_chg   = N" + res.fixed_charge.toFixed(2), 14, 128);

        ctx.fillStyle = "#34d399";
        ctx.font = "bold 24px ui-monospace, monospace";
        ctx.fillText("RETURN total_bill = N" + res.total_bill.toFixed(2), 14, 174);

        ctx.fillStyle = "#a5b4fc";
        ctx.font = "18px ui-monospace, monospace";
        ctx.fillText("[GLOBAL] total_revenue = N" + res.global_revenue.toFixed(2) + " (UNTOUCHED)", 14, 224);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px ui-monospace, monospace";
        ctx.fillText("One-Way Glass: Local vars destroyed on return.", 14, 265);
      });
    }

    function stepAnim(dt) {
      domeGroup.userData.orbGroup.rotation.y += dt * 1.4;
      chuteGroup.userData.pkgBox.position.x = 0.05 + Math.sin( performance.now() * 0.003 ) * 0.22;
    }

    return { G: G, parts: parts, paint: paintFunction, stepAnim: stepAnim };
  }

  /* -------------------------------------------------------------------
     MODE 6: "trace-console" (Lesson 06)
     Parts: console, switches, hexDisplay, traceScreen, contactor, busbar, statusBeacon
     ------------------------------------------------------------------- */
  function buildTraceConsole() {
    var G = new THREE.Group();
    var parts = {};

    // 1. Master SCADA Console Chassis
    var consoleGroup = new THREE.Group();
    var chassis = new THREE.Mesh(extrudeSlab(6.4, 4.0, 0.16, 0.16, 0.02), stdMat(0x131c26, 0.5, 0.35));
    consoleGroup.add(chassis);
    G.add(tagPart(consoleGroup, "console"));
    parts.console = consoleGroup;

    // 2. 8-Bit Silicon Toggle-Switch Register Bank (b7..b0)
    var swBank = new THREE.Group();
    swBank.position.set(-1.35, 0.17, 1.15);
    var bankPlate = new THREE.Mesh(extrudeSlab(3.3, 0.95, 0.10, 0.06, 0.01), stdMat(0x1e293b, 0.45, 0.4));
    swBank.add(bankPlate);
    var bitLevers = [], bitLeds = [];
    for (var b = 0; b < 8; b++) {
      var bx = -1.33 + b * 0.38;
      var slotBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.36), stdMat(0x334155, 0.4, 0.6));
      slotBase.position.set(bx, 0.12, 0.08);
      var piv = new THREE.Group();
      piv.position.set(bx, 0.18, 0.08);
      var bat = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 10), stdMat(0xe2e8f0, 0.2, 0.85));
      bat.position.y = 0.14;
      piv.add(bat);

      var bledMat = stdMat(0x14532d, 0.25, 0.1, { emissive: new THREE.Color(0x22c55e), emissiveIntensity: 0.1 });
      var bled = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), bledMat);
      bled.position.set(bx, 0.14, -0.26);

      swBank.add(slotBase, piv, bled);
      bitLevers.push(piv);
      bitLeds.push(bledMat);
    }
    G.add(tagPart(swBank, "switches"));
    parts.switches = swBank;

    // 3. Hexadecimal Dual 7-Segment Decoder Panel (`0x7E` = `01111110_2` = `126_10`)
    var hexDisp = createScreenPanel(1.75, 0.92, 380, 200, -0.35);
    hexDisp.position.set(-1.95, 0.82, -0.65);
    G.add(tagPart(hexDisp, "hexDisplay"));
    parts.hexDisplay = hexDisp;

    // 4. Master WAEC Dry-Run Trace Terminal Screen
    var traceScr = createScreenPanel(2.35, 1.28, 520, 280, -0.32);
    traceScr.position.set(0.45, 0.92, -0.65);
    G.add(tagPart(traceScr, "traceScreen"));
    parts.traceScreen = traceScr;

    // 5. Heavy Microgrid Contactor Switch (right side)
    var contactorGroup = new THREE.Group();
    contactorGroup.position.set(2.25, 0.17, 0.65);
    var cFrame = new THREE.Mesh(extrudeSlab(1.1, 1.2, 0.42, 0.08, 0.015), stdMat(0x273549, 0.45, 0.45));
    var bridgeBar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 0.28), stdMat(0xd97706, 0.25, 0.85));
    bridgeBar.position.set(0, 0.56, 0);
    contactorGroup.add(cFrame, bridgeBar);
    contactorGroup.userData.bridgeBar = bridgeBar;
    G.add(tagPart(contactorGroup, "contactor"));
    parts.contactor = contactorGroup;

    // 6. Copper Power Busbars
    var busbarGroup = new THREE.Group();
    var busMat = stdMat(0xb45309, 0.28, 0.85, { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.15 });
    var bar1 = splineTube([[0.5, 0.24, 1.15], [1.65, 0.24, 1.15], [2.25, 0.24, 0.65]], 0.045, 18, 8, busMat);
    var bar2 = splineTube([[2.25, 0.24, 0.15], [2.25, 0.24, -0.95]], 0.045, 14, 8, busMat);
    busbarGroup.add(bar1, bar2);
    busbarGroup.userData.busMat = busMat;
    G.add(tagPart(busbarGroup, "busbar"));
    parts.busbar = busbarGroup;

    // 7. System Recovery Status Beacon
    var beacon = createLedBeacon(0.22, 0x14532d, 0x22c55e);
    beacon.position.set(2.25, 0.17, -0.95);
    G.add(tagPart(beacon, "statusBeacon"));
    parts.statusBeacon = beacon;

    function paintTrace(res) {
      for (var i = 0; i < 8; i++) {
        var on = res.bits[i] === 1;
        bitLevers[i].rotation.x = on ? -0.48 : 0.48;
        bitLeds[i].color.setHex(on ? 0x22c55e : 0x1e293b);
        bitLeds[i].emissiveIntensity = on ? 0.95 : 0.08;
      }

      contactorGroup.userData.bridgeBar.position.y = res.contactorClosed ? 0.46 : 0.64;
      busbarGroup.userData.busMat.emissiveIntensity = res.contactorClosed ? 0.65 : 0.1;
      beacon.userData.setColor(res.contactorClosed ? 0x22c55e : (res.authOk ? 0x38bdf8 : 0xf59e0b), res.contactorClosed ? 1.1 : 0.45);

      hexDisp.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = "#081420";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = res.authOk ? "#22c55e" : "#f59e0b";
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, w - 8, h - 8);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 18px ui-monospace, monospace";
        ctx.fillText("8-BIT REGISTER DECODER", 14, 28);
        ctx.fillStyle = res.authOk ? "#4ade80" : "#38bdf8";
        ctx.font = "bold 46px ui-monospace, monospace";
        ctx.fillText(res.hex + " (" + res.decimal + ")", 14, 88);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 24px ui-monospace, monospace";
        ctx.fillText("BIN: " + res.binary.slice(0, 4) + " " + res.binary.slice(4), 14, 134);
        ctx.fillStyle = res.authOk ? "#22c55e" : "#fbbf24";
        ctx.font = "bold 18px ui-monospace, monospace";
        ctx.fillText(res.authOk ? "PARITY 0x7E MATCHED!" : "Target: 0x7E (01111110)", 14, 176);
      });

      traceScr.userData.draw(function (ctx, w, h) {
        ctx.fillStyle = "#071624";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = res.contactorClosed ? "#22c55e" : "#38bdf8";
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, w - 8, h - 8);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 18px ui-monospace, monospace";
        ctx.fillText("DRY-RUN TRACE: readings = [12, 15, 20]", 14, 28);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "17px ui-monospace, monospace";
        ctx.fillText("Step | i | val | val%2==0 | total", 14, 60);
        res.traceRows.forEach(function (r, idx) {
          ctx.fillStyle = r.isEven ? "#34d399" : "#cbd5e1";
          ctx.fillText(
            " #" + r.step + "  | " + r.i + " | " + r.val + "  |  " + (r.isEven ? "True " : "False") + "   |  " + r.total,
            14, 92 + idx * 32
          );
        });
        ctx.fillStyle = res.contactorClosed ? "#4ade80" : "#38bdf8";
        ctx.font = "bold 19px ui-monospace, monospace";
        ctx.fillText("Even Sum = " + res.evenSum + " | " + res.gridStatus, 14, 245);
      });
    }

    return { G: G, parts: parts, paint: paintTrace, stepAnim: function () {} };
  }

  /* ===================================================================
     4. MAIN KIT INSTANCE FACTORY: ProgrammingBench.create(opts)
     =================================================================== */

  var DEFAULTS = {
    "memory-stage": { exprMode: "cast", aVal: "150", bVal: 20 },
    "logic-switchboard": { battery: 15, grid_online: false, logicMode: "fixed" },
    "loop-stepper": { dataset: "solar", stepIndex: 7 },
    "array-rack": { index: 3, scanStep: 8 },
    "function-factory": { units: 85, tariff_rate: 68.0, vat_rate: 0.075, fixed_charge: 1500.0, global_revenue: 50000.0, stage: "return" },
    "trace-console": { byteVal: 126, traceStep: 3 }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function create(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    g.name = "ProgrammingBench";

    var S = {
      mode: null,
      t: 0,
      onEvent: opts.onEvent || null,
      per: {
        "memory-stage": clone(DEFAULTS["memory-stage"]),
        "logic-switchboard": clone(DEFAULTS["logic-switchboard"]),
        "loop-stepper": clone(DEFAULTS["loop-stepper"]),
        "array-rack": clone(DEFAULTS["array-rack"]),
        "function-factory": clone(DEFAULTS["function-factory"]),
        "trace-console": clone(DEFAULTS["trace-console"])
      },
      rows: {
        "memory-stage": [],
        "logic-switchboard": [],
        "loop-stepper": [],
        "array-rack": [],
        "function-factory": [],
        "trace-console": []
      },
      doneSent: {},
      hlSaved: [],
      hlPart: null
    };

    var BUILDERS = {
      "memory-stage": buildMemoryStage,
      "logic-switchboard": buildLogicSwitchboard,
      "loop-stepper": buildLoopStepper,
      "array-rack": buildArrayRack,
      "function-factory": buildFunctionFactory,
      "trace-console": buildTraceConsole
    };

    var SOLVERS = {
      "memory-stage": solveMemory,
      "logic-switchboard": solveLogic,
      "loop-stepper": solveLoop,
      "array-rack": solveArray,
      "function-factory": solveFunction,
      "trace-console": solveTrace
    };

    var built = {};
    var activeParts = {};
    var curReading = {};

    function emit(name, detail) {
      if (typeof S.onEvent === "function") {
        try { S.onEvent(name, detail); } catch (e) {}
      }
    }

    function solveCurrent() {
      var m = S.mode;
      var st = S.per[m];
      curReading = SOLVERS[m](st);
      if (built[m] && built[m].paint) built[m].paint(curReading);
      return curReading;
    }

    function setMode(m) {
      if (MODES.indexOf(m) < 0) m = "memory-stage";
      if (m === S.mode && built[m]) return;
      clearHighlight();
      if (!built[m]) {
        built[m] = BUILDERS[m]();
        g.add(built[m].G);
      }
      for (var k in built) {
        built[k].G.visible = (k === m);
      }
      S.mode = m;
      // Sync active parts dictionary in place so g.parts reference stays live
      for (var oldK in activeParts) delete activeParts[oldK];
      var newP = built[m].parts;
      for (var nk in newP) activeParts[nk] = newP[nk];
      solveCurrent();
      emit("mode", { mode: m });
    }

    function setState(patch) {
      patch = patch || {};
      if (patch.onEvent) S.onEvent = patch.onEvent;
      if (patch.mode && MODES.indexOf(patch.mode) >= 0) {
        setMode(patch.mode);
      }
      if (patch.reset) {
        reset();
        return;
      }
      var st = S.per[S.mode];
      for (var k in patch) {
        if (k === "mode" || k === "onEvent" || k === "reset") continue;
        st[k] = patch[k];
      }
      solveCurrent();
      emit("state", { mode: S.mode, controls: clone(st) });
    }

    function step() {
      var m = S.mode, st = S.per[m];
      if (m === "loop-stepper") {
        var maxS = st.dataset === "infinite" ? 8 : (st.dataset === "range5" ? 5 : 7);
        st.stepIndex = (st.stepIndex + 1) % (maxS + 1);
      } else if (m === "array-rack") {
        st.index = (st.index + 1) % 9;
      } else if (m === "trace-console") {
        st.traceStep = (st.traceStep + 1) % 4;
      } else if (m === "function-factory") {
        var presets = [85, 120, 210, 45];
        var idx = presets.indexOf(st.units);
        st.units = presets[(idx + 1) % presets.length];
      } else if (m === "logic-switchboard") {
        // Cycle through the 4 truth-table states
        var bLow = st.battery < 20;
        var gOn = !!st.grid_online;
        if (bLow && !gOn) { st.battery = 15; st.grid_online = true; }
        else if (bLow && gOn) { st.battery = 85; st.grid_online = false; }
        else if (!bLow && !gOn) { st.battery = 85; st.grid_online = true; }
        else { st.battery = 15; st.grid_online = false; }
      } else if (m === "memory-stage") {
        var ems = ["mismatch", "cast", "concat", "precedence", "bonus"];
        var ei = ems.indexOf(st.exprMode);
        st.exprMode = ems[(ei + 1) % ems.length];
      }
      solveCurrent();
      return takeReading();
    }

    function takeReading() {
      var c = solveCurrent();
      var m = S.mode;
      var rows = S.rows[m];
      var row;
      if (m === "memory-stage") {
        row = { n: rows.length + 1, expr: c.expr, type: c.resultType, result: String(c.result), status: c.status };
      } else if (m === "logic-switchboard") {
        row = { n: rows.length + 1, battery: c.battery + "%", grid: c.grid_online ? "Online" : "Offline", mode: c.logicMode, relay: c.relay_on ? "ON" : "OFF" };
      } else if (m === "loop-stepper") {
        row = { n: rows.length + 1, step: c.stepIndex, i: c.i, val: c.currentVal, total: c.total, mean: c.mean };
      } else if (m === "array-rack") {
        row = { n: rows.length + 1, index: c.index, address: c.address, voltage: c.value != null ? (c.value.toFixed(2) + " V") : "IndexError", minV: c.min_voltage.toFixed(2) + " V" };
      } else if (m === "function-factory") {
        row = { n: rows.length + 1, units: c.units + " kWh", energy: "N" + c.energy_cost.toFixed(2), vat: "N" + c.vat_amount.toFixed(2), bill: "N" + c.total_bill.toFixed(2) };
      } else {
        row = { n: rows.length + 1, hex: c.hex, binary: c.binary, decimal: c.decimal, evenSum: c.evenSum, grid: c.contactorClosed ? "ONLINE" : "LOCKED" };
      }
      rows.push(row);
      var rd = reading();
      emit("reading", rd);
      if (!S.doneSent[m] && rows.length >= 3) {
        S.doneSent[m] = true;
        emit("done", rd);
      }
      return row;
    }

    function reading() {
      var c = solveCurrent();
      var m = S.mode;
      var out = Object.assign({
        mode: m,
        rows: S.rows[m].slice(),
        done: S.rows[m].length >= 3,
        controls: clone(S.per[m])
      }, c);
      return out;
    }

    function reset() {
      var m = S.mode;
      S.per[m] = clone(DEFAULTS[m]);
      S.rows[m] = [];
      S.doneSent[m] = false;
      solveCurrent();
      emit("reset", { mode: m });
    }

    function clearHighlight() {
      for (var i = 0; i < S.hlSaved.length; i++) {
        var h = S.hlSaved[i];
        h.mesh.material = h.orig;
      }
      S.hlSaved.length = 0;
      S.hlPart = null;
    }

    function highlight(partName, colorHex) {
      clearHighlight();
      if (!partName || !activeParts[partName]) return false;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      activeParts[partName].traverse(function (o) {
        if (o.isMesh && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone();
          S.hlSaved.push({ mesh: o, orig: o.material });
          c.emissive = col.clone();
          c.emissiveIntensity = 0.6;
          o.material = c;
        }
      });
      S.hlPart = partName;
      return true;
    }

    function viewFor(partName) {
      g.updateMatrixWorld(true);
      var root = built[S.mode] ? built[S.mode].G : g;
      var obj = (partName && partName !== "all" && partName !== "bench" && activeParts[partName]) ? activeParts[partName] : root;
      var box = new THREE.Box3().setFromObject(obj);
      var c = box.getCenter(new V3());
      var sz = box.getSize(new V3());
      g.worldToLocal(c);
      if (obj === root) {
        var R = Math.max(sz.x, sz.z * 1.25) / 2;
        return { target: [c.x, 0.35, c.z], dist: Math.max(5.8, R * 2.15), pitch: 0.72, yawPortrait: 0 };
      }
      var m = Math.max(sz.x, sz.y, sz.z);
      return { target: [c.x, c.y, c.z], dist: Math.max(2.1, m * 2.0 + 0.8), pitch: 0.65, yawPortrait: 0 };
    }

    function pickPart(raycaster) {
      var root = built[S.mode] ? built[S.mode].G : g;
      var hits = raycaster.intersectObjects(root.children, true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object;
        if (!o.visible) continue;
        var id = o.userData && o.userData.partId;
        if (id && activeParts[id]) return id;
      }
      return null;
    }

    function triangles() {
      var n = 0;
      g.updateMatrixWorld(true);
      g.traverseVisible(function (o) {
        if (!o.isMesh) return;
        var geo = o.geometry;
        var tris = geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3;
        n += o.isInstancedMesh ? tris * o.count : tris;
      });
      return Math.round(n);
    }

    function update(dt, t) {
      dt = Math.min(Math.max(dt || 0.016, 0), 0.1);
      S.t += dt;
      var b = built[S.mode];
      if (b && b.stepAnim) b.stepAnim(dt, curReading);
      if (S.hlSaved.length) {
        var pulse = 0.4 + 0.3 * Math.sin(S.t * 6.5);
        for (var i = 0; i < S.hlSaved.length; i++) {
          S.hlSaved[i].mesh.material.emissiveIntensity = pulse;
        }
      }
      void t;
    }

    // Universal compatibility contract (`attachCompat`)
    g.userData.parts = activeParts;
    g.userData.update = update;
    g.userData.setState = setState;
    g.group = g;
    g.parts = activeParts;
    g.tick = update;
    g.update = update;
    g.setState = setState;
    g.reading = reading;
    g.takeReading = takeReading;
    g.step = step;
    g.reset = reset;
    g.highlight = highlight;
    g.clearHighlight = clearHighlight;
    g.viewFor = viewFor;
    g.pickPart = pickPart;
    g.triangles = triangles;
    g.setMode = function (m) { setState({ mode: m }); };
    g.getMode = function () { return S.mode; };
    g.model = model;

    var initMode = MODES.indexOf(opts.mode) >= 0 ? opts.mode : "memory-stage";
    setMode(initMode);
    var initPatch = Object.assign({}, opts);
    delete initPatch.mode;
    delete initPatch.onEvent;
    if (Object.keys(initPatch).length) setState(initPatch);
    update(0.016, 0);
    return g;
  }

  function makeHighlighter(scene) {
    var saved = [];
    function clear() {
      for (var i = 0; i < saved.length; i++) {
        saved[i].mesh.material = saved[i].orig;
      }
      saved.length = 0;
    }
    function highlight(partName, colorHex) {
      clear();
      if (!partName || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === partName && o.material && !Array.isArray(o.material) && o.material.emissive) {
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

  global.ProgrammingBench = {
    version: 1,
    modes: MODES.slice(),
    model: model,
    create: create,
    makeHighlighter: makeHighlighter
  };
})(window);
