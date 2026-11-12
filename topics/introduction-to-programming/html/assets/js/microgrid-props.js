/* =========================================================
   StudyPipe · Kit: microgrid-props (window.MicrogridProps)
   Reusable 3D story & phenomenon props for the Ikogosi Smart Solar
   Microgrid Station & Health Clinic Cold-Chain (Lessons 01–06).
   Classic script, offline, three.js (window.THREE).
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  // ---------- Parametric Telemetry & Fault Model ----------
  var DEFAULT_CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];
  var FAULT_SPECS = {
    normal: {
      code: "NORMAL", title: "SYSTEM ONLINE · 0x7E", err: "0 FAULTS · GRID STABLE",
      line: "status = check_grid(0x7E) # OK",
      solarKw: 170.0, batteryPct: 88, cpuPct: 24, fanRpm: 900,
      genRunning: false, gridOnline: true, fridgeTempC: 4.1,
      cellIndex: 3, indexAlarm: false, vatRate: 0.075, scopeBug: false,
      hexCode: "0x7E", bits: [0, 1, 1, 1, 1, 1, 1, 0], powerOn: true, alarm: false
    },
    typeerror: {
      code: "L01 · TYPEERROR", title: "SYSTEM ERROR: TypeError", err: "can only concatenate str to str",
      line: 'total_power = "150" + 20  # TypeError!',
      solarKw: 0.0, batteryPct: 62, cpuPct: 45, fanRpm: 1100,
      genRunning: false, gridOnline: false, fridgeTempC: 5.4,
      cellIndex: 0, indexAlarm: false, vatRate: 0.075, scopeBug: false,
      hexCode: "0x00", bits: [0, 0, 0, 0, 0, 0, 0, 0], powerOn: false, alarm: true
    },
    logic: {
      code: "L02 · LOGIC BUG", title: "LOW BATTERY · GEN LOCKED", err: "grid_online == True (FALSE IN BLACKOUT)",
      line: "if batt < 20 and grid_online == True:",
      solarKw: 12.4, batteryPct: 18, cpuPct: 32, fanRpm: 850,
      genRunning: false, gridOnline: false, fridgeTempC: 6.2,
      cellIndex: 3, indexAlarm: false, vatRate: 0.075, scopeBug: false,
      hexCode: "0x12", bits: [0, 0, 0, 1, 0, 0, 1, 0], powerOn: false, alarm: true
    },
    loop: {
      code: "L03 · INFINITE LOOP", title: "CPU 99% · RUNAWAY WHILE", err: "Checking solar array 1... (x1,000,000)",
      line: 'while solar_output > 0: print("Active")',
      solarKw: 145.0, batteryPct: 54, cpuPct: 99, fanRpm: 4200,
      genRunning: false, gridOnline: true, fridgeTempC: 4.6,
      cellIndex: 1, indexAlarm: false, vatRate: 0.075, scopeBug: false,
      hexCode: "0xFF", bits: [1, 1, 1, 1, 1, 1, 1, 1], powerOn: true, alarm: true
    },
    indexerror: {
      code: "L04 · INDEXERROR", title: "Fatal: IndexError at line 34", err: "list index 8 out of range (len=8, 0..7)",
      line: "for i in range(1, 9): check(cells[i])",
      solarKw: 132.0, batteryPct: 71, cpuPct: 60, fanRpm: 1600,
      genRunning: false, gridOnline: true, fridgeTempC: 9.8,
      cellIndex: 8, indexAlarm: true, vatRate: 0.075, scopeBug: false,
      hexCode: "0xE8", bits: [1, 1, 1, 0, 1, 0, 0, 0], powerOn: false, alarm: true
    },
    scope: {
      code: "L05 · SCOPE / DRY BUG", title: "TARIFF MISMATCH · VAT 5% vs 7.5%", err: "Global total_revenue overwritten by local!",
      line: "def calc_bill(u, rate=68.0, vat=0.075):",
      solarKw: 160.0, batteryPct: 82, cpuPct: 38, fanRpm: 1050,
      genRunning: false, gridOnline: true, fridgeTempC: 4.2,
      cellIndex: 2, indexAlarm: false, vatRate: 0.05, scopeBug: true,
      hexCode: "0x5A", bits: [0, 1, 0, 1, 1, 0, 1, 0], powerOn: true, alarm: true
    },
    recovery: {
      code: "L06 · SYSTEM RECOVERY", title: "PARITY UNLOCKED · 0x7E = 01111110", err: "ALL 5 MODULES PATCHED · TOWN POWER ON",
      line: "unlock_inverter(0x7E) # 01111110b -> ON",
      solarKw: 170.0, batteryPct: 96, cpuPct: 21, fanRpm: 1200,
      genRunning: true, gridOnline: true, fridgeTempC: 3.8,
      cellIndex: 7, indexAlarm: false, vatRate: 0.075, scopeBug: false,
      hexCode: "0x7E", bits: [0, 1, 1, 1, 1, 1, 1, 0], powerOn: true, alarm: false
    }
  };

  function calcBill(units, tariff, vatRate, fixed) {
    var energy = units * (tariff || 68.0);
    var vat = energy * (vatRate == null ? 0.075 : vatRate);
    return Math.round((energy + vat + (fixed == null ? 1500.0 : fixed)) * 100) / 100;
  }

  function stationState(mode, powerOverride) {
    var m = FAULT_SPECS[mode] ? mode : "normal";
    var s = FAULT_SPECS[m];
    var pOn = powerOverride != null ? !!powerOverride : s.powerOn;
    var billGood = calcBill(85, 68.0, 0.075, 1500.0); // 7713.5
    var billBug = calcBill(85, 68.0, 0.05, 0.0);      // 6069.0 (copied snippet missing fixed & old 5% VAT)
    return {
      mode: m, code: s.code, title: s.title, err: s.err, line: s.line,
      solarKw: pOn ? s.solarKw : (m === "typeerror" ? 0 : s.solarKw),
      batteryPct: s.batteryPct, cpuPct: s.cpuPct, fanRpm: s.fanRpm,
      genRunning: s.genRunning, gridOnline: s.gridOnline, fridgeTempC: s.fridgeTempC,
      cells: DEFAULT_CELLS.slice(), cellIndex: s.cellIndex, indexAlarm: s.indexAlarm,
      vatRate: s.vatRate, scopeBug: s.scopeBug,
      bill101: s.scopeBug ? billBug : billGood,
      bill102: calcBill(210, 68.0, 0.075, 1500.0),
      hexCode: s.hexCode, bits: s.bits.slice(), powerOn: pOn, alarm: s.alarm && !pOn ? true : s.alarm
    };
  }

  var model = {
    stationState: stationState,
    calcBill: calcBill,
    FAULT_SPECS: FAULT_SPECS,
    DEFAULT_CELLS: DEFAULT_CELLS
  };

  // ---------- Geometry & Material Helpers ----------
  function mat(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.55 : rough, metalness: metal == null ? 0.15 : metal };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }

  function roundedRectShape(w, h, r) {
    var s = new THREE.Shape(), hw = w / 2, hh = h / 2;
    r = Math.min(r || 0.03, hw * 0.4, hh * 0.4);
    s.moveTo(-hw + r, -hh);
    s.lineTo(hw - r, -hh); s.quadraticCurveTo(hw, -hh, hw, -hh + r);
    s.lineTo(hw, hh - r); s.quadraticCurveTo(hw, hh, hw - r, hh);
    s.lineTo(-hw + r, hh); s.quadraticCurveTo(-hw, hh, -hw, hh - r);
    s.lineTo(-hw, -hh + r); s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    return s;
  }

  function bevelBox(w, h, d, r, bevel, material) {
    var b = bevel == null ? 0.015 : bevel;
    var geo = new THREE.ExtrudeGeometry(roundedRectShape(w - b * 2, h - b * 2, r || 0.03), {
      depth: Math.max(0.01, d - b * 2), bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: b, bevelThickness: b
    });
    geo.center();
    return new THREE.Mesh(geo, material);
  }

  function fanWheel(radius, blades, material) {
    var g = new THREE.Group();
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, 0.025, 14), material);
    hub.rotation.x = Math.PI / 2; g.add(hub);
    var bShape = new THREE.Shape();
    bShape.moveTo(0, -0.008); bShape.lineTo(radius * 0.88, -0.018);
    bShape.quadraticCurveTo(radius * 0.96, 0, radius * 0.88, 0.018);
    bShape.lineTo(0, 0.008); bShape.closePath();
    var bGeo = new THREE.ExtrudeGeometry(bShape, { depth: 0.005, bevelEnabled: false });
    var n = blades || 7;
    for (var i = 0; i < n; i++) {
      var bm = new THREE.Mesh(bGeo, material);
      bm.rotation.z = (i * Math.PI * 2) / n;
      bm.rotation.x = 0.38;
      g.add(bm);
    }
    return g;
  }

  function cableSpline(pts, radius, color) {
    var vectors = pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    var curve = new THREE.CatmullRomCurve3(vectors);
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 20, radius || 0.016, 8, false), mat(color || 0x1b222c, 0.45, 0.1));
  }

  function tagPart(root, mesh, partId) {
    root.parts = root.parts || {};
    root.userData.parts = root.parts;
    root.parts[partId] = mesh;
    mesh.traverse(function (c) { c.userData.partId = partId; });
    return mesh;
  }

  function attachPropApi(g, readingFn, setStateFn, updateFn) {
    g.parts = g.parts || {};
    g.userData.parts = g.parts;
    g.reading = readingFn || function () { return {}; };
    g.setState = setStateFn || function () {};
    g.update = g.tick = updateFn || function () {};
    g.pickPart = function (raycaster) {
      var hits = raycaster.intersectObject(g, true);
      return hits.length ? (hits[0].object.userData.partId || null) : null;
    };
    return g;
  }

  // ---------- 1. Solar Array (createSolarArray) ----------
  function solarCellTexture() {
    var c = document.createElement("canvas"); c.width = 256; c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = "#0d2342"; g.fillRect(0, 0, 256, 256);
    for (var y = 0; y < 6; y++) for (var x = 0; x < 4; x++) {
      var px = x * 64 + 3, py = y * 42 + 3;
      g.fillStyle = "#123466"; g.fillRect(px, py, 58, 36);
      g.strokeStyle = "rgba(180,220,255,0.35)"; g.lineWidth = 1;
      g.strokeRect(px, py, 58, 36);
      g.fillStyle = "rgba(210,235,255,0.45)";
      g.fillRect(px + 18, py, 1.5, 36); g.fillRect(px + 38, py, 1.5, 36);
    }
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  function createSolarArray(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = { solarKw: opts.solarKw != null ? opts.solarKw : 170.0, tilt: 0.42 };
    var steel = mat(0x9aa5b4, 0.35, 0.75);
    var darkSteel = mat(0x2b3542, 0.5, 0.6);

    // Extruded mounting legs & A-frame struts
    var legGroup = new THREE.Group();
    [-0.95, 0.95].forEach(function (x) {
      var base = bevelBox(0.18, 0.05, 0.9, 0.01, 0.006, darkSteel);
      base.position.set(x, 0.025, 0); legGroup.add(base);
      var frontPost = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, 1.05, 12), steel);
      frontPost.position.set(x, 0.52, 0.32); legGroup.add(frontPost);
      var rearPost = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, 1.65, 12), steel);
      rearPost.position.set(x, 0.82, -0.32); legGroup.add(rearPost);
      var brace = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.88, 8), steel);
      brace.position.set(x, 0.95, 0); brace.rotation.x = 0.62; legGroup.add(brace);
    });
    g.add(tagPart(g, legGroup, "frame"));

    // Tilted bevelled solar panel deck
    var deck = new THREE.Group();
    deck.position.set(0, 1.34, 0); deck.rotation.x = state.tilt;
    var frameMesh = bevelBox(2.35, 0.06, 1.32, 0.02, 0.01, steel);
    deck.add(frameMesh);
    var glassMat = mat(0xffffff, 0.15, 0.25, { map: solarCellTexture() });
    var cellsMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.22, 1.20), glassMat);
    cellsMesh.rotation.x = -Math.PI / 2; cellsMesh.position.y = 0.032;
    deck.add(cellsMesh);
    g.add(tagPart(g, deck, "panels"));

    // Junction box + armoured conduit
    var jbox = bevelBox(0.24, 0.18, 0.12, 0.02, 0.008, darkSteel);
    jbox.position.set(0, 0.85, -0.28);
    var led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), mat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 0.9 }));
    led.position.set(0.06, 0.03, 0.062); jbox.add(led);
    var conduit = cableSpline([[0, 0.85, -0.28], [0.25, 0.4, -0.32], [0.65, 0.03, -0.2]], 0.022, 0x1f2937);
    var jGroup = new THREE.Group(); jGroup.add(jbox); jGroup.add(conduit);
    g.add(tagPart(g, jGroup, "junctionBox"));

    return attachPropApi(g,
      function () { return { solarKw: state.solarKw, active: state.solarKw > 0 }; },
      function (o) { if (o && o.solarKw != null) state.solarKw = o.solarKw; },
      function (dt, t) {
        var on = state.solarKw > 0.5;
        led.material.color.setHex(on ? 0x22c55e : 0xef4444);
        led.material.emissive.setHex(on ? 0x22c55e : 0xef4444);
        led.material.emissiveIntensity = on ? 0.8 + 0.2 * Math.sin(t * 4) : 0.4;
      }
    );
  }

  // ---------- 2. Inverter Cabinet (createInverterCabinet) ----------
  function createInverterCabinet(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = stationState(opts.mode || "normal");

    // Bevelled cabinet body
    var bodyMat = mat(0x0f766e, 0.42, 0.35);
    var darkMat = mat(0x1e293b, 0.5, 0.4);
    var cab = bevelBox(0.82, 1.56, 0.46, 0.04, 0.018, bodyMat);
    cab.position.y = 0.82;
    var plinth = bevelBox(0.86, 0.08, 0.50, 0.02, 0.008, darkMat);
    plinth.position.y = 0.04;
    var bodyGroup = new THREE.Group(); bodyGroup.add(cab); bodyGroup.add(plinth);
    g.add(tagPart(g, bodyGroup, "cabinet"));

    // Procedural OLED Telemetry Screen
    var scCanvas = document.createElement("canvas"); scCanvas.width = 320; scCanvas.height = 180;
    var scCtx = scCanvas.getContext("2d");
    var scTex = new THREE.CanvasTexture(scCanvas);
    var screenFrame = bevelBox(0.56, 0.34, 0.03, 0.02, 0.008, darkMat);
    screenFrame.position.set(0, 1.24, 0.235);
    var screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.50, 0.28), new THREE.MeshBasicMaterial({ map: scTex }));
    screenMesh.position.z = 0.017; screenFrame.add(screenMesh);
    g.add(tagPart(g, screenFrame, "screen"));

    // Dual axial cooling fans behind grilles
    var fansGroup = new THREE.Group();
    var fanBladeMat = mat(0x94a3b8, 0.3, 0.6);
    var fanA = fanWheel(0.11, 7, fanBladeMat); fanA.position.set(-0.18, 0.82, 0.232);
    var fanB = fanWheel(0.11, 7, fanBladeMat); fanB.position.set(0.18, 0.82, 0.232);
    [-0.18, 0.18].forEach(function (fx) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.012, 10, 24), darkMat);
      ring.position.set(fx, 0.82, 0.235); fansGroup.add(ring);
    });
    fansGroup.add(fanA); fansGroup.add(fanB);
    g.add(tagPart(g, fansGroup, "fans"));

    // Rotary breaker handle + LED status strip + conduits
    var breakerGroup = new THREE.Group();
    var breakerBase = bevelBox(0.16, 0.20, 0.04, 0.015, 0.006, darkMat);
    breakerBase.position.set(0.22, 0.48, 0.235);
    var lever = bevelBox(0.04, 0.11, 0.04, 0.008, 0.004, mat(0xef4444, 0.35, 0.2));
    lever.position.set(0, 0.02, 0.025); breakerBase.add(lever);
    breakerGroup.add(breakerBase);
    var conduitA = cableSpline([[-0.22, 0.35, 0.22], [-0.28, 0.15, 0.25], [-0.45, 0.03, 0.1]], 0.024, 0xd97706);
    var conduitB = cableSpline([[0.22, 0.28, -0.22], [0.35, 0.12, -0.25], [0.55, 0.03, -0.15]], 0.024, 0x1e293b);
    breakerGroup.add(conduitA); breakerGroup.add(conduitB);
    g.add(tagPart(g, breakerGroup, "breaker"));

    var statusLed = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.028, 0.02), mat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 0.9 }));
    statusLed.position.set(0, 1.46, 0.235);
    g.add(tagPart(g, statusLed, "statusLed"));

    function paintScreen(blink) {
      var err = state.alarm;
      scCtx.fillStyle = err ? "#2a0a10" : "#071c24";
      scCtx.fillRect(0, 0, 320, 180);
      scCtx.fillStyle = err ? "#ef4444" : "#10b981";
      scCtx.fillRect(0, 0, 320, 30);
      scCtx.fillStyle = "#ffffff";
      scCtx.font = "bold 14px ui-monospace, monospace";
      scCtx.fillText("IKOGOSI INVERTER · " + state.code, 10, 20);
      scCtx.fillStyle = err ? (blink ? "#fca5a5" : "#f87171") : "#6ee7b7";
      scCtx.font = "bold 15px ui-monospace, monospace";
      scCtx.fillText(state.title.slice(0, 30), 10, 58);
      scCtx.fillStyle = "#e2e8f0";
      scCtx.font = "13px ui-monospace, monospace";
      scCtx.fillText(state.line.slice(0, 34), 10, 88);
      scCtx.fillStyle = err ? "#fbbf24" : "#38bdf8";
      scCtx.fillText(state.err.slice(0, 34), 10, 116);
      scCtx.fillStyle = "#94a3b8";
      scCtx.fillText("OUT: " + state.solarKw.toFixed(1) + " kW  REG: " + state.hexCode + "  FAN: " + state.fanRpm + " RPM", 10, 156);
      scTex.needsUpdate = true;
    }
    paintScreen(false);

    var lastBlink = false;
    return attachPropApi(g,
      function () { return state; },
      function (o) {
        if (typeof o === "string") state = stationState(o);
        else if (o) state = stationState(o.mode || state.mode, o.powerOn);
        lever.rotation.z = state.powerOn ? 0 : -0.65;
        paintScreen(false);
      },
      function (dt, t) {
        var speed = (state.fanRpm / 600) * dt * 5;
        fanA.rotation.z += speed;
        fanB.rotation.z -= speed;
        var bl = Math.floor(t * 3) % 2 === 0;
        if (bl !== lastBlink) { lastBlink = bl; paintScreen(bl); }
        var col = state.alarm ? (bl ? 0xef4444 : 0xf59e0b) : 0x22c55e;
        statusLed.material.color.setHex(col);
        statusLed.material.emissive.setHex(col);
      }
    );
  }

  // ---------- 3. Battery Rack (createBatteryRack) ----------
  function createBatteryRack(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = stationState(opts.mode || "normal");
    var rackMat = mat(0x1e293b, 0.5, 0.6);
    var cellMat = mat(0x334155, 0.4, 0.45);
    var copperMat = mat(0xd97706, 0.25, 0.85);

    // Outer steel cabinet frame
    var frame = new THREE.Group();
    var back = bevelBox(0.76, 1.54, 0.06, 0.02, 0.01, rackMat); back.position.set(0, 0.77, -0.18); frame.add(back);
    [-0.35, 0.35].forEach(function (x) {
      var side = bevelBox(0.06, 1.54, 0.42, 0.015, 0.008, rackMat);
      side.position.set(x, 0.77, 0); frame.add(side);
    });
    var top = bevelBox(0.78, 0.10, 0.44, 0.02, 0.01, rackMat); top.position.set(0, 1.52, 0); frame.add(top);
    // Copper busbars on sides
    [-0.29, 0.29].forEach(function (x) {
      var bus = new THREE.Mesh(new THREE.BoxGeometry(0.022, 1.22, 0.018), copperMat);
      bus.position.set(x, 0.75, 0.17); frame.add(bus);
    });
    g.add(tagPart(g, frame, "rackFrame"));

    // 8 contiguous LiFePO4 battery cells (Index 0 to Index 7)
    var cellsGroup = new THREE.Group();
    var cellLeds = [];
    for (var i = 0; i < 8; i++) {
      var y = 1.32 - i * 0.155;
      var slot = bevelBox(0.54, 0.125, 0.34, 0.015, 0.006, cellMat);
      slot.position.set(0, y, 0);
      var lMat = mat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 0.8 });
      var led = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 0.015), lMat);
      led.position.set(-0.18, 0, 0.172);
      slot.add(led);
      cellLeds.push(led);
      cellsGroup.add(slot);
      tagPart(g, slot, "cell" + i);
    }
    g.add(tagPart(g, cellsGroup, "cells"));

    // Header badge for Index 0..7 & boundary alarm beacon
    var hCanvas = document.createElement("canvas"); hCanvas.width = 256; hCanvas.height = 64;
    var hCtx = hCanvas.getContext("2d");
    var hTex = new THREE.CanvasTexture(hCanvas);
    var header = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.08), new THREE.MeshBasicMaterial({ map: hTex }));
    header.position.set(0, 1.52, 0.222);
    g.add(tagPart(g, header, "header"));

    function paintHeader() {
      hCtx.fillStyle = state.indexAlarm ? "#7f1d1d" : "#0f172a";
      hCtx.fillRect(0, 0, 256, 64);
      hCtx.fillStyle = state.indexAlarm ? "#fca5a5" : "#38bdf8";
      hCtx.font = "bold 15px ui-monospace, monospace";
      var txt = state.indexAlarm ? "ERR: INDEX 8 OUT OF RANGE" : "CELLS[0..7] SOC: " + state.batteryPct + "%";
      hCtx.fillText(txt, 10, 38);
      hTex.needsUpdate = true;
    }
    paintHeader();

    return attachPropApi(g,
      function () { return { batteryPct: state.batteryPct, cells: state.cells, cellIndex: state.cellIndex, indexAlarm: state.indexAlarm }; },
      function (o) {
        if (typeof o === "string") state = stationState(o);
        else if (o) state = stationState(o.mode || state.mode, o.powerOn);
        paintHeader();
      },
      function (dt, t) {
        var pulse = Math.floor(t * 4) % 2 === 0;
        for (var i = 0; i < 8; i++) {
          var c = 0x22c55e;
          if (state.indexAlarm) c = pulse ? 0xef4444 : 0x7f1d1d;
          else if (state.batteryPct < 25) c = pulse ? 0xf59e0b : 0xef4444;
          else if (i === state.cellIndex) c = 0x38bdf8;
          cellLeds[i].material.color.setHex(c);
          cellLeds[i].material.emissive.setHex(c);
        }
      }
    );
  }

  // ---------- 4. Diesel Generator (createDieselGenerator) ----------
  function createDieselGenerator(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = stationState(opts.mode || "normal");

    var skidMat = mat(0x1f2937, 0.6, 0.5);
    var canopyMat = mat(0xd97706, 0.45, 0.25);
    var darkMetal = mat(0x334155, 0.4, 0.7);

    // Heavy steel skid base
    var skid = bevelBox(1.52, 0.14, 0.78, 0.02, 0.01, skidMat);
    skid.position.y = 0.07;
    g.add(tagPart(g, skid, "skid"));

    // Acoustic canopy housing
    var canopyGroup = new THREE.Group();
    var canopy = bevelBox(1.42, 0.86, 0.70, 0.04, 0.02, canopyMat);
    canopy.position.y = 0.56; canopyGroup.add(canopy);
    // Louvred air intake grille + internal flywheel fan
    var louvre = bevelBox(0.46, 0.52, 0.03, 0.015, 0.005, darkMetal);
    louvre.position.set(-0.36, 0.56, 0.35); canopyGroup.add(louvre);
    var genFan = fanWheel(0.16, 8, mat(0x94a3b8, 0.3, 0.6));
    genFan.position.set(0.68, 0.56, 0); genFan.rotation.y = Math.PI / 2;
    canopyGroup.add(genFan);

    // Lathe exhaust stack + rain cap
    var pts = [[0, 0], [0.055, 0], [0.055, 0.34], [0.038, 0.38], [0.038, 0.52]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var exhaust = new THREE.Mesh(new THREE.LatheGeometry(pts, 16), darkMetal);
    exhaust.position.set(-0.42, 0.98, -0.12);
    var flap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 14), darkMetal);
    flap.position.set(0, 0.53, 0); exhaust.add(flap);
    canopyGroup.add(tagPart(g, exhaust, "exhaust"));
    g.add(tagPart(g, canopyGroup, "canopy"));

    // Auto-start PLC control panel
    var pCanvas = document.createElement("canvas"); pCanvas.width = 256; pCanvas.height = 128;
    var pCtx = pCanvas.getContext("2d");
    var pTex = new THREE.CanvasTexture(pCanvas);
    var panel = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.22), new THREE.MeshBasicMaterial({ map: pTex }));
    panel.position.set(0.32, 0.64, 0.355);
    g.add(tagPart(g, panel, "controlPanel"));

    function paintPanel() {
      var run = state.genRunning;
      var lock = state.mode === "logic";
      pCtx.fillStyle = lock ? "#450a0a" : (run ? "#064e3b" : "#0f172a");
      pCtx.fillRect(0, 0, 256, 128);
      pCtx.fillStyle = lock ? "#f87171" : (run ? "#34d399" : "#38bdf8");
      pCtx.font = "bold 15px ui-monospace, monospace";
      pCtx.fillText(run ? "GENSET: RUNNING" : (lock ? "LOCKOUT: LOGIC BUG" : "GENSET: STANDBY"), 10, 32);
      pCtx.fillStyle = "#e2e8f0";
      pCtx.font = "13px ui-monospace, monospace";
      pCtx.fillText("BATT: " + state.batteryPct + "%  GRID: " + (state.gridOnline ? "ON" : "OFF"), 10, 66);
      pCtx.fillStyle = "#fbbf24";
      pCtx.fillText(lock ? "if batt<20 and grid==True" : "AUTO-TRANSFER READY", 10, 102);
      pTex.needsUpdate = true;
    }
    paintPanel();

    return attachPropApi(g,
      function () { return { running: state.genRunning, batteryPct: state.batteryPct, gridOnline: state.gridOnline, mode: state.mode }; },
      function (o) {
        if (typeof o === "string") state = stationState(o);
        else if (o) {
          state = stationState(o.mode || state.mode, o.powerOn);
          if (o.running != null) state.genRunning = !!o.running;
        }
        paintPanel();
      },
      function (dt, t) {
        if (state.genRunning) {
          genFan.rotation.x += dt * 18;
          canopyGroup.position.x = Math.sin(t * 45) * 0.003;
          flap.rotation.z = 0.35 + Math.sin(t * 16) * 0.08;
        } else {
          canopyGroup.position.x = 0;
          flap.rotation.z = 0;
        }
      }
    );
  }

  // ---------- 5. Clinic Vaccine Fridge (createClinicFridge) ----------
  function createClinicFridge(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = stationState(opts.mode || "normal");

    var whiteMat = mat(0xf1f5f9, 0.35, 0.1);
    var medBlue = mat(0x0284c7, 0.4, 0.2);

    // Bevelled medical refrigerator body
    var body = bevelBox(0.74, 1.58, 0.62, 0.035, 0.016, whiteMat);
    body.position.y = 0.79;
    var headerBox = bevelBox(0.75, 0.22, 0.64, 0.025, 0.01, medBlue);
    headerBox.position.y = 1.48;
    var cabGroup = new THREE.Group(); cabGroup.add(body); cabGroup.add(headerBox);
    g.add(tagPart(g, cabGroup, "cabinet"));

    // Glazed vaccine inspection window + lathe vaccine vials inside
    var winGroup = new THREE.Group();
    var glass = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.78), mat(0xbae6fd, 0.1, 0.1, { transparent: true, opacity: 0.45 }));
    glass.position.set(0, 0.82, 0.312); winGroup.add(glass);
    var handle = bevelBox(0.035, 0.38, 0.05, 0.01, 0.005, medBlue);
    handle.position.set(0.29, 0.82, 0.33); winGroup.add(handle);

    var vialPts = [[0, 0], [0.022, 0], [0.022, 0.055], [0.012, 0.065], [0.016, 0.08]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var vialGeo = new THREE.LatheGeometry(vialPts, 10);
    var vialMat = mat(0x38bdf8, 0.2, 0.1);
    [-0.12, 0.12].forEach(function (sy, rIdx) {
      var shelf = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.018, 0.24), medBlue);
      shelf.position.set(0, 0.70 + rIdx * 0.24, 0.16); winGroup.add(shelf);
      for (var v = 0; v < 4; v++) {
        var vial = new THREE.Mesh(vialGeo, vialMat);
        vial.position.set(-0.15 + v * 0.10, 0.71 + rIdx * 0.24, 0.16);
        winGroup.add(vial);
      }
    });
    g.add(tagPart(g, winGroup, "door"));

    // Digital temperature display + top alarm beacon
    var tCanvas = document.createElement("canvas"); tCanvas.width = 256; tCanvas.height = 80;
    var tCtx = tCanvas.getContext("2d");
    var tTex = new THREE.CanvasTexture(tCanvas);
    var disp = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.14), new THREE.MeshBasicMaterial({ map: tTex }));
    disp.position.set(0, 1.48, 0.322);
    g.add(tagPart(g, disp, "display"));

    var beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.09, 14), mat(0x22c55e, 0.2, 0, { emissive: 0x22c55e, emissiveIntensity: 0.9 }));
    beacon.position.set(0, 1.63, 0);
    g.add(tagPart(g, beacon, "beacon"));

    function paintTemp() {
      var hot = state.fridgeTempC > 8.0 || state.indexAlarm;
      tCtx.fillStyle = hot ? "#7f1d1d" : "#082f49";
      tCtx.fillRect(0, 0, 256, 80);
      tCtx.fillStyle = hot ? "#fca5a5" : "#7dd3fc";
      tCtx.font = "bold 18px ui-monospace, monospace";
      tCtx.fillText("COLD-CHAIN: +" + state.fridgeTempC.toFixed(1) + " C", 10, 34);
      tCtx.fillStyle = "#ffffff";
      tCtx.font = "13px ui-monospace, monospace";
      tCtx.fillText(hot ? "ALARM: SENSOR / CELL 8" : "WHO VACCINE SAFE (+2..+8C)", 10, 62);
      tTex.needsUpdate = true;
    }
    paintTemp();

    return attachPropApi(g,
      function () { return { tempC: state.fridgeTempC, alarm: state.fridgeTempC > 8.0 || state.indexAlarm }; },
      function (o) {
        if (typeof o === "string") state = stationState(o);
        else if (o) {
          state = stationState(o.mode || state.mode, o.powerOn);
          if (o.tempC != null) state.fridgeTempC = o.tempC;
        }
        paintTemp();
      },
      function (dt, t) {
        var hot = state.fridgeTempC > 8.0 || state.indexAlarm;
        var col = hot ? (Math.floor(t * 5) % 2 ? 0xef4444 : 0xf59e0b) : 0x22c55e;
        beacon.material.color.setHex(col);
        beacon.material.emissive.setHex(col);
      }
    );
  }

  // ---------- 6. Smart Meter Kiosk Board (createSmartMeter) ----------
  function createSmartMeter(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = stationState(opts.mode || "normal");

    var boardMat = mat(0x334155, 0.55, 0.3);
    var meterMat = mat(0xe2e8f0, 0.4, 0.15);

    // Kiosk backing board on tabletop stand
    var stand = bevelBox(0.78, 0.62, 0.06, 0.02, 0.01, boardMat);
    stand.position.set(0, 0.34, 0);
    var base = bevelBox(0.82, 0.05, 0.32, 0.015, 0.008, boardMat);
    base.position.set(0, 0.025, 0);
    var bGroup = new THREE.Group(); bGroup.add(stand); bGroup.add(base);
    g.add(tagPart(g, bGroup, "board"));

    // 3 Household prepaid meter enclosures + cables
    var metersGroup = new THREE.Group();
    [-0.24, 0, 0.24].forEach(function (mx, idx) {
      var mBox = bevelBox(0.20, 0.30, 0.09, 0.015, 0.006, meterMat);
      mBox.position.set(mx, 0.38, 0.055);
      var kpad = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.10), mat(0x1e293b, 0.4, 0.2));
      kpad.position.set(0, -0.05, 0.048); mBox.add(kpad);
      metersGroup.add(mBox);
      tagPart(g, mBox, "meter" + (idx + 1));
    });
    g.add(tagPart(g, metersGroup, "meters"));

    // Shared Tariff / VAT Billing Telemetry LCD
    var mCanvas = document.createElement("canvas"); mCanvas.width = 320; mCanvas.height = 110;
    var mCtx = mCanvas.getContext("2d");
    var mTex = new THREE.CanvasTexture(mCanvas);
    var lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.18), new THREE.MeshBasicMaterial({ map: mTex }));
    lcd.position.set(0, 0.13, 0.04);
    g.add(tagPart(g, lcd, "display"));

    function paintLcd() {
      var bug = state.scopeBug;
      mCtx.fillStyle = bug ? "#451a03" : "#064e3b";
      mCtx.fillRect(0, 0, 320, 110);
      mCtx.fillStyle = bug ? "#fcd34d" : "#6ee7b7";
      mCtx.font = "bold 15px ui-monospace, monospace";
      mCtx.fillText(bug ? "BILLING BUG: VAT 5% vs 7.5%" : "DRY FUNCTION · VAT 7.5% OK", 10, 28);
      mCtx.fillStyle = "#ffffff";
      mCtx.font = "14px ui-monospace, monospace";
      mCtx.fillText("M101(85u): N" + state.bill101.toFixed(2), 10, 58);
      mCtx.fillText("M102(210u): N" + state.bill102.toFixed(2), 10, 88);
      mTex.needsUpdate = true;
    }
    paintLcd();

    return attachPropApi(g,
      function () { return { vatRate: state.vatRate, scopeBug: state.scopeBug, bill101: state.bill101, bill102: state.bill102 }; },
      function (o) {
        if (typeof o === "string") state = stationState(o);
        else if (o) state = stationState(o.mode || state.mode, o.powerOn);
        paintLcd();
      }
    );
  }

  // ---------- 7. SCADA Maintenance Terminal (createScadaTerminal) ----------
  function createScadaTerminal(opts) {
    opts = opts || {};
    var g = new THREE.Group();
    var state = stationState(opts.mode || "normal");

    var chassisMat = mat(0x1e293b, 0.38, 0.55);
    var keyMat = mat(0x0f172a, 0.5, 0.25);

    // Bevelled laptop/workstation base + keyboard deck
    var base = bevelBox(0.56, 0.035, 0.38, 0.02, 0.008, chassisMat);
    base.position.set(0, 0.02, 0);
    var keys = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.20), keyMat);
    keys.rotation.x = -Math.PI / 2; keys.position.set(0, 0.04, -0.02);
    base.add(keys);
    g.add(tagPart(g, base, "keyboard"));

    // Tilted rugged display lid + procedural live code canvas
    var lid = bevelBox(0.56, 0.36, 0.028, 0.02, 0.008, chassisMat);
    lid.position.set(0, 0.20, -0.17); lid.rotation.x = -0.18;
    var cCanvas = document.createElement("canvas"); cCanvas.width = 360; cCanvas.height = 220;
    var cCtx = cCanvas.getContext("2d");
    var cTex = new THREE.CanvasTexture(cCanvas);
    var mon = new THREE.Mesh(new THREE.PlaneGeometry(0.50, 0.30), new THREE.MeshBasicMaterial({ map: cTex }));
    mon.position.z = 0.016; lid.add(mon);
    g.add(tagPart(g, lid, "monitor"));

    // Side processor cooling fan + RS-485 serial cable
    var cpuFan = fanWheel(0.06, 7, mat(0x38bdf8, 0.3, 0.5));
    cpuFan.position.set(-0.29, 0.08, -0.12); cpuFan.rotation.y = Math.PI / 2;
    g.add(tagPart(g, cpuFan, "cpuFan"));

    var serialCable = cableSpline([[0.28, 0.02, -0.10], [0.42, 0.02, -0.05], [0.52, 0.08, 0.12]], 0.012, 0x0284c7);
    g.add(tagPart(g, serialCable, "serialCable"));

    var scrollTick = 0;
    function paintTerminal(scrollOffset) {
      cCtx.fillStyle = "#090d16"; cCtx.fillRect(0, 0, 360, 220);
      cCtx.fillStyle = state.alarm ? "#dc2626" : "#059669";
      cCtx.fillRect(0, 0, 360, 28);
      cCtx.fillStyle = "#ffffff";
      cCtx.font = "bold 13px ui-monospace, monospace";
      cCtx.fillText("IKOGOSI SCADA · " + state.code + " · CPU " + state.cpuPct + "%", 8, 19);

      cCtx.fillStyle = "#38bdf8";
      cCtx.font = "13px ui-monospace, monospace";
      cCtx.fillText(">>> " + state.line, 8, 56);

      cCtx.fillStyle = state.alarm ? "#f87171" : "#34d399";
      cCtx.font = "bold 13px ui-monospace, monospace";
      cCtx.fillText(state.title, 8, 84);
      cCtx.fillStyle = "#fde047";
      cCtx.font = "12px ui-monospace, monospace";
      cCtx.fillText(state.err, 8, 108);

      if (state.mode === "loop") {
        cCtx.fillStyle = "#94a3b8";
        for (var r = 0; r < 4; r++) {
          cCtx.fillText("[LOG #" + (scrollOffset + r * 128) + "] Checking solar array 1... Active", 8, 136 + r * 18);
        }
      } else {
        cCtx.fillStyle = "#cbd5e1";
        cCtx.fillText("REG: " + state.hexCode + " [" + state.bits.join("") + "]  BATT: " + state.batteryPct + "%", 8, 144);
        cCtx.fillText("SOLAR: " + state.solarKw.toFixed(1) + " kW   FRIDGE: +" + state.fridgeTempC.toFixed(1) + " C", 8, 170);
        cCtx.fillText("BILL M101: N" + state.bill101.toFixed(2) + " (VAT " + (state.vatRate * 100).toFixed(1) + "%)", 8, 196);
      }
      cTex.needsUpdate = true;
    }
    paintTerminal(0);

    return attachPropApi(g,
      function () { return state; },
      function (o) {
        if (typeof o === "string") state = stationState(o);
        else if (o) state = stationState(o.mode || state.mode, o.powerOn);
        paintTerminal(scrollTick);
      },
      function (dt, t) {
        cpuFan.rotation.x += (state.fanRpm / 500) * dt * 6;
        if (state.mode === "loop") {
          var nextTick = Math.floor(t * 12);
          if (nextTick !== scrollTick) { scrollTick = nextTick; paintTerminal(scrollTick); }
        }
      }
    );
  }

  // ---------- 8. Town Floodlight Pole (for L06 Recovery) ----------
  function createFloodlight() {
    var g = new THREE.Group();
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 3.2, 12), mat(0x475569, 0.4, 0.7));
    pole.position.y = 1.6; g.add(pole);
    var head = bevelBox(0.46, 0.24, 0.12, 0.02, 0.008, mat(0x1e293b, 0.4, 0.5));
    head.position.set(0, 3.22, 0.08); head.rotation.x = 0.35;
    var lampMat = mat(0xfef08a, 0.1, 0, { emissive: 0xfef08a, emissiveIntensity: 1.0 });
    var lens = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.16), lampMat);
    lens.position.z = 0.062; head.add(lens);
    g.add(tagPart(g, head, "lamp"));
    var power = true;
    return attachPropApi(g,
      function () { return { powerOn: power }; },
      function (on) {
        power = typeof on === "object" ? !!on.powerOn : !!on;
        lampMat.emissiveIntensity = power ? 1.2 : 0.05;
        lampMat.color.setHex(power ? 0xfef08a : 0x334155);
      }
    );
  }

  // ---------- Highlighter & Triangle Counter ----------
  function makeHighlighter(scene) {
    var active = [];
    function clear() {
      active.forEach(function (item) {
        if (item.mesh.material && item.mesh.material.emissive) {
          item.mesh.material.emissive.setHex(item.emissive);
          item.mesh.material.emissiveIntensity = item.intensity;
        }
      });
      active = [];
    }
    function highlight(partId) {
      clear();
      if (!partId || !scene) return;
      scene.traverse(function (o) {
        if (o.isMesh && o.userData.partId === partId && o.material && o.material.emissive) {
          if (o.material.userData && !o.material.userData._clonedForHl) {
            o.material = o.material.clone();
            o.material.userData._clonedForHl = true;
          }
          active.push({ mesh: o, emissive: o.material.emissive.getHex(), intensity: o.material.emissiveIntensity || 0 });
          o.material.emissive.setHex(0xf59e0b);
          o.material.emissiveIntensity = 0.65;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  function triangles(obj) {
    var count = 0;
    if (!obj) return 0;
    obj.traverse(function (o) {
      if (o.isMesh && o.geometry) {
        var idx = o.geometry.index;
        count += idx ? idx.count / 3 : (o.geometry.attributes.position ? o.geometry.attributes.position.count / 3 : 0);
      }
    });
    return Math.round(count);
  }

  // ---------- dressStation(api, opts) for StoryStage Set 1 & Set 2 ----------
  function dressStation(api, opts) {
    opts = opts || {};
    var props = api.props || (api.props = {});
    var market = api.market || props.market;
    var lab = api.lab || props.lab;
    api.market = market;
    api.lab = lab;

    if (!opts.keepMarketProps) {
      if (props.jars) props.jars.forEach(function (j) { j.visible = false; });
      if (props.bottleA) props.bottleA.visible = false;
      if (props.bottleB) props.bottleB.visible = false;
      if (props.can) props.can.visible = false;
    }
    if (!opts.keepLabProps) {
      ["balance", "burette", "flask", "vflask"].forEach(function (k) { if (props[k]) props[k].visible = false; });
    }

    // Update signs if SceneKit is loaded
    if (window.StoryStage && StoryStage.sign) {
      if (props.mSign && market) {
        props.mSign.visible = false;
        var s1 = StoryStage.sign("IKOGOSI SMART SOLAR MICROGRID", "rgba(15,118,110,0.95)", "#fff", 0.52);
        s1.position.set(0, 3.6, -1.6); market.add(s1);
      }
      if (props.lSign && lab) {
        props.lSign.visible = false;
        var s2 = StoryStage.sign("SCADA CONTROL & CLINIC COLD-CHAIN", "rgba(2,132,199,0.95)", "#fff", 0.42);
        s2.position.set(-0.5, 3.4, -3.05); lab.add(s2);
      }
    }

    var mode = opts.fault || opts.mode || "normal";
    var solarArray = createSolarArray(opts.solarArray);
    var generator = createDieselGenerator({ mode: mode });
    var smartMeter = createSmartMeter({ mode: mode });
    var floodlight = createFloodlight();
    var inverter = createInverterCabinet({ mode: mode });
    var batteryRack = createBatteryRack({ mode: mode });
    var fridge = createClinicFridge({ mode: mode });
    var terminal = createScadaTerminal({ mode: mode });

    if (market) {
      solarArray.position.set(-2.6, 0, -1.5); solarArray.rotation.y = 0.25; market.add(solarArray);
      generator.position.set(2.6, 0, 0.5); generator.rotation.y = -0.35; market.add(generator);
      smartMeter.position.set(0.35, 0.94, 0.05); market.add(smartMeter);
      floodlight.position.set(-3.2, 0, 1.2); market.add(floodlight);
    }
    if (lab) {
      inverter.position.set(-2.55, 0, -2.1); inverter.rotation.y = 0.18; lab.add(inverter);
      batteryRack.position.set(-1.35, 0, -2.15); lab.add(batteryRack);
      terminal.position.set(0.05, 0.99, -2.15); lab.add(terminal);
      fridge.position.set(2.15, 0, -2.0); fridge.rotation.y = -0.22; lab.add(fridge);
    }

    props.solarArray = solarArray;
    props.generator = generator;
    props.smartMeter = smartMeter;
    props.floodlight = floodlight;
    props.inverter = inverter;
    props.batteryRack = batteryRack;
    props.fridge = fridge;
    props.terminal = terminal;

    var allProps = [solarArray, generator, smartMeter, floodlight, inverter, batteryRack, fridge, terminal];
    var currentState = stationState(mode);

    function setFault(newMode) {
      currentState = stationState(newMode);
      inverter.setState(currentState);
      batteryRack.setState(currentState);
      generator.setState(currentState);
      fridge.setState(currentState);
      smartMeter.setState(currentState);
      terminal.setState(currentState);
      solarArray.setState({ solarKw: currentState.solarKw });
      floodlight.setState(currentState.powerOn);
    }

    function setPower(on) {
      currentState = stationState(currentState.mode, !!on);
      inverter.setState(currentState);
      solarArray.setState({ solarKw: currentState.solarKw });
      floodlight.setState(!!on);
    }

    var lastTime = -1;
    function update(dt, t) {
      if (t != null && Math.abs(t - lastTime) < 0.0005) return;
      if (t != null) lastTime = t;
      var d = dt || 0.016, now = t != null ? t : performance.now() * 0.001;
      for (var i = 0; i < allProps.length; i++) allProps[i].update(d, now);
    }

    // Hook api.onTick if present + attach automatic frame ticker mesh
    var prevTick = api.onTick;
    api.onTick = function (a, dt, t) {
      if (prevTick) prevTick(a, dt, t);
      update(dt, t);
    };
    if (api.world) {
      var ticker = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ visible: false }));
      ticker.frustumCulled = false;
      ticker.onBeforeRender = function () { update(0.016, performance.now() * 0.001); };
      api.world.add(ticker);
    }

    var shots = {
      courtyardWide: [[0, 2.3, 6.2], [0, 1.1, -0.3]],
      solar: [[-2.3, 1.8, 2.2], [-2.6, 1.0, -1.4]],
      generator: [[2.4, 1.5, 3.4], [2.6, 0.7, 0.5]],
      smartMeter: [[0.35, 1.45, 2.1], [0.35, 1.15, 0.05]],
      floodlight: [[-1.5, 2.2, 4.8], [-2.8, 2.0, 0.8]],
      controlWide: [[39.8, 2.1, 2.8], [39.8, 1.2, -2.0]],
      terminal: [[40.05, 1.45, -0.45], [40.05, 1.15, -2.15]],
      inverter: [[37.6, 1.45, 0.2], [37.45, 1.0, -2.1]],
      batteryRack: [[38.65, 1.4, 0.1], [38.65, 0.95, -2.15]],
      fridge: [[42.0, 1.45, 0.3], [42.15, 0.95, -2.0]]
    };

    var spots = {
      courtyardAmina: [0, 0, -1.0],
      courtyardTari: [-1.1, 0, 1.4],
      courtyardBabatunde: [1.3, 0, 1.5],
      amina: [-0.6, 0, -1.25],
      tari: [0.65, 0, -1.25],
      babatunde: [-1.85, 0, -1.1],
      folake: [1.55, 0, -1.15]
    };

    setFault(mode);

    return {
      solarArray: solarArray,
      inverter: inverter,
      batteryRack: batteryRack,
      generator: generator,
      fridge: fridge,
      smartMeter: smartMeter,
      terminal: terminal,
      floodlight: floodlight,
      shots: shots,
      spots: spots,
      setFault: setFault,
      setPower: setPower,
      update: update,
      reading: function () { return currentState; }
    };
  }

  window.MicrogridProps = {
    model: model,
    createSolarArray: createSolarArray,
    createInverterCabinet: createInverterCabinet,
    createBatteryRack: createBatteryRack,
    createDieselGenerator: createDieselGenerator,
    createClinicFridge: createClinicFridge,
    createSmartMeter: createSmartMeter,
    createScadaTerminal: createScadaTerminal,
    createFloodlight: createFloodlight,
    dressStation: dressStation,
    makeHighlighter: makeHighlighter,
    triangles: triangles
  };
})();
