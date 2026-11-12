/* Lesson 04 · 3D zoom: (1) an ugu cell (CellKit.plantCell) and a red blood cell (CellKit.rbc) in pure water, isotonic or salty solution;
   (2) the cell membrane (CellKit.bilayer) showing diffusion, osmosis and active transport with particles that follow simple rules. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.CellKit) return;

  var toastEl = document.getElementById("zoom-toast");
  var readEl = document.getElementById("zoom-readout");
  var noteEl = document.getElementById("zoom-note");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }
  function emit(n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); }
  function seeded(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  var SOL = {
    hypo:  { name: "Pure water", tone: "hypotonic", plant: 1, rbc: 1, salt: 0, bath: 0x7dd3fc, plantTxt: "turgid", rbcTxt: "swells and bursts (haemolysis)", flow: "IN",
             note: "Pure water is more dilute than the cell contents, so water enters by osmosis. The wall stops the ugu cell bursting (turgid). The red cell has no wall, so it bursts." },
    iso:   { name: "0.9% saline", tone: "isotonic", plant: 0, rbc: 0, salt: 40, bath: 0xbae6fd, plantTxt: "flaccid", rbcTxt: "normal shape", flow: "in = out",
             note: "The same concentration as the inside, so as much water enters as leaves. The red cell keeps its biconcave shape. This is why a drip is isotonic." },
    hyper: { name: "Salty water", tone: "hypertonic", plant: -1, rbc: -1, salt: 220, bath: 0xe2e8f0, plantTxt: "plasmolysed", rbcTxt: "shrinks and wrinkles (crenation)", flow: "OUT",
             note: "The solution is more concentrated than the cell sap, so water leaves by osmosis. The membrane pulls away from the ugu wall and the leaf wilts. The salt did not soak in." }
  };
  var MEM = {
    diffusion: { name: "Diffusion", moves: "Any small particle", atp: "No energy", topN: 26, botN: 5, lab: ["Many (crowded)", "Few"],
                 note: "Particles spread from where they are crowded to where they are few, passing straight through the membrane. Watch the top count fall and the bottom count rise until they even out. No energy is used." },
    osmosis:   { name: "Osmosis", moves: "Water only", atp: "No energy", topN: 18, botN: 8, lab: ["Dilute (more water)", "Concentrated"],
                 note: "Only water crosses, through the water channel. The big solute particles cannot. More water molecules start on the dilute side, so more cross downwards than upwards. No energy is used." },
    active:    { name: "Active transport", moves: "Ions, by a pump", atp: "Uses ATP", topN: 22, botN: 5, lab: ["Plentiful", "Scarce"],
                 note: "The pump picks up ions from the scarce side and pushes them to the side where they are already plentiful. That is against the gradient, so the cell pays with ATP from respiration. Watch the top count rise." }
  };
  var mode = "hypo", memCounts = { top: 0, bot: 0 }, memStart = null, memT = 0;

  var highlightPart = null;
  var api = { setMode: setMode, rect: function () { return null; }, highlight: function (p) { highlightPart = p || null; },
              reset: function () { setMode("hypo"); }, state: function () { return { mode: mode }; } };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 36, target: new THREE.Vector3(0, 0, 0), pitch: 0.2, yaw: 0.1, distance: 7.2,
    adaptiveHeight: false, onFrame: frame
  });

  var cells, plant, rbc, bath, salt, waterP, waterR, frags, plantLab, rbcLab, burstT = 0;
  var mem, bil, parts = {}, particles = [], memLabels = {}, pumpFx = 0;

  if (stage) build();
  wireButtons();
  setMode("hypo", true);

  // ---------- build ----------
  function build() {
    var scene = stage.rig;
    stage.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));   // keep low-end phones smooth
    stage.resize();

    // ---- group 1: cells in a bath ----
    cells = new THREE.Group(); scene.add(cells);
    plant = CellKit.plantCell({ w: 1.9, h: 1.25, d: 1.1, chloroplasts: 10, tonicity: 0 });
    plant.position.set(-1.4, 0, 0); plant.rotation.set(0.2, 0.4, 0);
    rbc = CellKit.rbc({ size: 1.7 });
    rbc.position.set(1.45, 0, 0);
    cells.add(plant, rbc);
    var bathGeo = new THREE.BoxGeometry(6.0, 2.3, 2.1);
    bath = new THREE.Mesh(bathGeo, CellKit.glass(0x7dd3fc, 0.08));
    bath.renderOrder = -1; cells.add(bath);
    var bathEdges = new THREE.LineSegments(new THREE.EdgesGeometry(bathGeo), new THREE.LineBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: 0.35 }));
    cells.add(bathEdges);
    var sp = [], rr = seeded(5);
    for (var i = 0; i < 220; i++) sp.push((rr() - 0.5) * 5.8, (rr() - 0.5) * 2.1, (rr() - 0.5) * 1.9);
    var saltGeo = new THREE.BufferGeometry(); saltGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    salt = new THREE.Points(saltGeo, new THREE.PointsMaterial({ color: 0xf8fafc, size: 0.05, transparent: true, opacity: 0.9 }));
    cells.add(salt);
    // frame the two cells, not the whole bath, so they fill a phone screen
    bath.userData.noFit = true; bathEdges.userData.noFit = true; salt.userData.noFit = true;
    waterP = makeWater(new THREE.Vector3(-1.4, 0, 0), new THREE.Vector3(0.95, 0.62, 0.55), 18, 11);
    waterR = makeWater(new THREE.Vector3(1.45, 0, 0), new THREE.Vector3(0.85, 0.85, 0.35), 16, 23);
    cells.add(waterP.group, waterR.group);
    plantLab = addLabel(cells, "Ugu cell", -1.4, 1.38, 0);
    rbcLab = addLabel(cells, "Red cell", 1.45, 1.38, 0);
    if (rbc.userData.parts.rbc) rbc.userData.parts.rbc.material.depthWrite = false;
    // membrane fragments that replace a red cell after it bursts
    frags = new THREE.Group();
    var fr = seeded(31);
    var fragMat = new THREE.MeshStandardMaterial({ color: 0xd62839, emissive: 0x5a0a10, emissiveIntensity: 0.3, roughness: 0.5, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    for (var q = 0; q < 14; q++) {
      var a = q / 14 * Math.PI * 2 + fr() * 0.3;
      var piece = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6, 0, 1.2 + fr(), 0, 1.1), fragMat);
      piece.userData.dir = new THREE.Vector3(Math.cos(a), (fr() - 0.5) * 0.8, Math.sin(a) * 0.6);
      piece.rotation.set(fr() * 3, fr() * 3, fr() * 3);
      frags.add(piece);
    }
    frags.position.copy(rbc.position); frags.visible = false; cells.add(frags);

    // ---- group 2: the membrane ----
    mem = new THREE.Group(); mem.visible = false; scene.add(mem);
    bil = CellKit.bilayer({ scale: 1.5 });
    bil.rotation.x = 0.42;
    mem.add(bil);
    var pr = bil.userData.parts;
    parts.bilayer = bil; parts.aquaporin = pr.aquaporin; parts.pump = pr.atpPump;
    if (pr.water) pr.water.visible = false;   // our own particles follow the rules below
    if (pr.ions) pr.ions.visible = false;
    var pmat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.35 });
    var dmat = { gas: new THREE.MeshStandardMaterial({ color: 0xfb923c, emissive: 0xc2410c, emissiveIntensity: 0.5, roughness: 0.3 }),
                 water: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.55, roughness: 0.3 }),
                 solute: new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xb45309, emissiveIntensity: 0.4, roughness: 0.4 }),
                 ion: new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.6, roughness: 0.3 }) };
    var geo = new THREE.SphereGeometry(1, 10, 8);
    var radius = { gas: 0.055, water: 0.05, solute: 0.09, ion: 0.065 };
    ["gas", "water", "solute", "ion"].forEach(function (k) {
      for (var n = 0; n < 40; n++) {
        var m = new THREE.Mesh(geo, dmat[k]); m.scale.setScalar(radius[k]); m.visible = false;
        bil.add(m);
        particles.push({ mesh: m, kind: k, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, on: false, carried: false });
      }
    });
    memLabels.top = addLabel(bil, "Many", -1.0, 1.2, 0.75);
    memLabels.bot = addLabel(bil, "Few", -1.0, -1.2, 0.75);
    memLabels.chan = addLabel(bil, "Water channel", 0, -0.72, 0.75);
    memLabels.pump = addLabel(bil, "ATP pump", 0.9, -0.72, 0.75);
    memLabels.chan.visible = false; memLabels.pump.visible = false;

    api.rect = function (part) {
      ensureStart();
      if (mem.visible) {
        if (part === "aquaporin") return stage.rectOf(parts.aquaporin, 14);
        if (part === "pump") return stage.rectOf(parts.pump, 14);
        return stage.rectOf(bil, 10);
      }
      if (part === "plant") return stage.rectOf(plant, 12);
      if (part === "rbc") return stage.rectOf(rbc, 12);
      if (part === "bath") return stage.rectOf(bath, 6);
      return stage.rectOf(cells, 8);
    };
    // the first frame compiles every shader: wait until the zoom is near the screen so the page opens fast
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (en, ob) { if (en[0].isIntersecting) { ob.disconnect(); ensureStart(); } }, { rootMargin: "500px 0px" }).observe(root);
    } else ensureStart();
  }
  var started = false;
  function ensureStart() { if (started || !stage) return; started = true; stage.start(); }
  function addLabel(group, text, x, y, z) {
    var l = CellKit.label(text, { h: 0.2 });
    l.position.set(x, y, z); group.add(l); return l;
  }
  function makeWater(centre, semi, n, seed) {
    var group = new THREE.Group(), r = seeded(seed), mols = [];
    var mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.55, roughness: 0.3 });
    var geo = new THREE.SphereGeometry(0.045, 10, 8);
    for (var i = 0; i < n; i++) {
      var th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
      var d = new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph) * 0.8, Math.sin(ph) * Math.sin(th));
      var m = new THREE.Mesh(geo, mat);
      m.userData = { d: d.normalize(), ph: r(), alt: i % 2 };
      group.add(m); mols.push(m);
    }
    return { group: group, mols: mols, centre: centre, semi: semi, dir: 0 };
  }

  // ---------- modes ----------
  function setMode(m, silent) {
    if (!SOL[m] && !MEM[m]) return;
    mode = m;
    var isMem = !!MEM[m];
    Array.prototype.forEach.call(root.querySelectorAll("#zoom-sol [data-mode]"), function (b) {
      b.setAttribute("aria-pressed", !isMem && b.getAttribute("data-mode") === m ? "true" : "false");
    });
    Array.prototype.forEach.call(root.querySelectorAll("#zoom-mem [data-mode]"), function (b) {
      b.setAttribute("aria-pressed", isMem && b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (stage) {
      cells.visible = !isMem; mem.visible = isMem;
      if (isMem) startMembrane(m); else applySolution(m);
      stage.refit(); stage.recentre();
    }
    paint();
    if (!silent) {
      toast((isMem ? MEM[m].name : SOL[m].name + " (" + SOL[m].tone + ")") + ": " + (isMem ? MEM[m].note : SOL[m].note).split(". ")[0] + ".");
    }
    emit("l4:zoom", { mode: m });
  }
  function applySolution(m) {
    var d = SOL[m];
    plant.userData.setState({ tonicity: d.plant });
    rbc.userData.setState({ tonicity: d.rbc });
    salt.geometry.setDrawRange(0, d.salt);
    bath.material.color.setHex(d.bath);
    bath.material.opacity = m === "hyper" ? 0.14 : 0.08;
    waterP.dir = d.plant; waterR.dir = d.plant;
    CellKit.setLabelText(plantLab, "Ugu cell: " + d.plantTxt, { h: 0.2 });
    CellKit.setLabelText(rbcLab, "Red cell: " + (m === "hypo" ? "burst" : m === "iso" ? "normal" : "crenated"), { h: 0.2 });
  }

  // ---------- membrane particles: simple rules, real counts ----------
  var SLAB = 0.34, YMAX = 1.25, XMAX = 1.35, ZMAX = 0.55, PUMP = { x: 0.9, r: 0.2 }, CHAN = { x: 0, r: 0.17 };
  function startMembrane(m) {
    var M = MEM[m];
    particles.forEach(function (p) { p.on = false; p.carried = false; p.mesh.visible = false; });
    function spawn(kind, n, top) {
      var k = 0;
      particles.forEach(function (p) {
        if (k >= n || p.kind !== kind || p.on) return;
        p.on = true; k++;
        p.x = (Math.random() * 2 - 1) * XMAX; p.z = (Math.random() * 2 - 1) * ZMAX;
        p.y = (top ? 1 : -1) * (SLAB + 0.08 + Math.random() * (YMAX - SLAB - 0.1));
        p.vx = p.vy = p.vz = 0; p.mesh.visible = true; p.carried = false;
      });
    }
    if (m === "diffusion") { spawn("gas", M.topN, true); spawn("gas", M.botN, false); }
    if (m === "osmosis") { spawn("water", M.topN, true); spawn("water", M.botN, false); spawn("solute", 3, true); spawn("solute", 14, false); }
    if (m === "active") { spawn("ion", M.topN, true); spawn("ion", M.botN, false); }
    bil.setMode(m === "active" ? "active" : m === "osmosis" ? "osmosis" : "diffusion");
    CellKit.setLabelText(memLabels.top, M.lab[0], { h: 0.2 });
    CellKit.setLabelText(memLabels.bot, M.lab[1], { h: 0.2 });
    memLabels.chan.visible = m === "osmosis";
    memLabels.pump.visible = m === "active";
    memStart = null; memT = 0;
  }
  function permeable(p, fromTop, nx, nz) {
    if (mode === "diffusion") return true;
    if (mode === "osmosis") return p.kind === "water" && Math.hypot(nx - CHAN.x, nz) < CHAN.r;
    return false; // active transport: ions never leak through; the pump carries them
  }
  function stepParticles(dt) {
    var kBrown = 7.5, damp = 2.2, vmax = 1.0;
    memCounts.top = 0; memCounts.bot = 0;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!p.on) continue;
      if (p.carried) {
        // the pump lifts the ion through the membrane, then lets it go
        p.x += (PUMP.x - p.x) * Math.min(1, dt * 8); p.z += (0 - p.z) * Math.min(1, dt * 8);
        p.y += 0.85 * dt;
        pumpFx = 1;
        if (p.y > SLAB + 0.04) { p.carried = false; p.vy = 0.2; }
      } else {
        p.vx += (Math.random() - 0.5) * kBrown * dt; p.vy += (Math.random() - 0.5) * kBrown * dt; p.vz += (Math.random() - 0.5) * kBrown * dt;
        p.vx *= 1 - damp * dt; p.vy *= 1 - damp * dt; p.vz *= 1 - damp * dt;
        var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
        if (sp > vmax) { p.vx *= vmax / sp; p.vy *= vmax / sp; p.vz *= vmax / sp; }
        var nx = p.x + p.vx * dt, ny = p.y + p.vy * dt, nz = p.z + p.vz * dt;
        if (nx > XMAX || nx < -XMAX) { p.vx = -p.vx; nx = p.x; }
        if (nz > ZMAX || nz < -ZMAX) { p.vz = -p.vz; nz = p.z; }
        if (ny > YMAX || ny < -YMAX) { p.vy = -p.vy; ny = p.y; }
        var inSlabNow = Math.abs(p.y) < SLAB, inSlabNext = Math.abs(ny) < SLAB;
        if (!inSlabNow && inSlabNext) {
          // trying to enter the membrane from the top (y>0) or the bottom (y<0)
          var fromTop = p.y > 0;
          if (mode === "active" && !fromTop && p.kind === "ion" && Math.hypot(nx - PUMP.x, nz) < PUMP.r) {
            p.carried = true; ny = p.y; nx = p.x; nz = p.z;
          } else if (!permeable(p, fromTop, nx, nz)) { p.vy = -p.vy; ny = p.y; }
        } else if (inSlabNow && mode === "osmosis" && p.kind === "water") {
          // inside the channel, stay in it
          var cx = nx - CHAN.x, d = Math.hypot(cx, nz);
          if (d > CHAN.r) { nx = p.x; nz = p.z; }
        } else if (inSlabNow && !inSlabNext && p.kind === "ion" && mode === "active") {
          p.vy = Math.abs(p.vy) * (ny > 0 ? 1 : -1);
        }
        p.x = nx; p.y = ny; p.z = nz;
      }
      p.mesh.position.set(p.x, p.y, p.z);
      if (mode === "osmosis" && p.kind !== "water") continue;
      if (p.y > 0) memCounts.top++; else memCounts.bot++;
    }
  }

  // ---------- readout ----------
  var lastRead = "";
  function paint() {
    if (!readEl) return;
    var h, key;
    if (MEM[mode]) {
      var M = MEM[mode];
      key = ["m", mode, memCounts.top, memCounts.bot].join("|");
      if (key === lastRead) return; lastRead = key;
      h = '<div><span>Process</span><b>' + M.name + '</b></div>' +
          '<div><span>What moves</span><b>' + M.moves + '</b></div>' +
          '<div><span>Energy</span><b>' + M.atp + '</b></div>' +
          '<div><span>Top side</span><b>' + memCounts.top + '</b></div>' +
          '<div><span>Bottom side</span><b>' + memCounts.bot + '</b></div>';
    } else {
      var d = SOL[mode], pr = plant && plant.userData.reading ? plant.userData.reading() : null;
      var frac = pr ? Math.round(pr.protoplastFraction * 100) + "%" : "–";
      key = ["c", mode, frac, rbc && rbc.userData.isBurst ? rbc.userData.isBurst() : ""].join("|");
      if (key === lastRead) return; lastRead = key;
      h = '<div><span>Solution</span><b>' + d.name + '</b></div>' +
          '<div><span>Versus cell sap</span><b>' + d.tone + '</b></div>' +
          '<div><span>Water moves</span><b>' + d.flow + '</b></div>' +
          '<div><span>Ugu cell</span><b>' + (pr ? pr.state : d.plantTxt) + '</b></div>' +
          '<div><span>Protoplast fills</span><b>' + frac + '</b></div>' +
          '<div><span>Red cell</span><b>' + (mode === "hypo" ? "bursts" : mode === "iso" ? "normal" : "crenated") + '</b></div>';
    }
    readEl.innerHTML = h;
    if (noteEl) noteEl.innerHTML = '<b>' + (MEM[mode] ? MEM[mode].name : SOL[mode].name) + ':</b> ' + (MEM[mode] ? MEM[mode].note : SOL[mode].note);
  }

  function wireButtons() {
    Array.prototype.forEach.call(root.querySelectorAll("[data-mode]"), function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
  }

  // ---------- frame ----------
  var readAcc = 0;
  function frame(dt, t) {
    if (cells && cells.visible) {
      plant.userData.update(dt, t); rbc.userData.update(dt, t);
      animateWater(dt); animateBurst(dt);
    }
    if (mem && mem.visible) {
      bil.userData.update(dt, t);
      stepParticles(dt);
      pumpFx = Math.max(0, pumpFx - dt * 2);
      if (parts.pump && parts.pump.material) parts.pump.material.emissiveIntensity = (mode === "active" ? 0.35 : 0.06) + pumpFx * 0.5;
      if (parts.aquaporin && parts.aquaporin.material) parts.aquaporin.material.emissiveIntensity = (mode === "osmosis" ? 0.5 : 0.1) + (highlightPart === "aquaporin" ? 0.3 * Math.sin(t * 5) : 0);
    }
    readAcc += dt;
    if (readAcc > 0.25) { readAcc = 0; paint(); }
  }
  function animateBurst(dt) {
    var burst = rbc.userData.isBurst && rbc.userData.isBurst();
    var mesh = rbc.userData.parts.rbc;
    if (!burst) { frags.visible = false; burstT = 0; if (mesh) mesh.visible = true; return; }
    burstT += dt;
    if (mesh) mesh.visible = burstT < 0.6;
    frags.visible = true;
    var k = Math.min(1, burstT / 1.6);
    frags.children.forEach(function (p) { p.position.copy(p.userData.dir).multiplyScalar(0.55 + 0.6 * k); p.rotation.y += dt * 0.4; });
  }
  function animateWater(dt) {
    [waterP, waterR].forEach(function (w) {
      w.mols.forEach(function (m) {
        var u = m.userData;
        u.ph = (u.ph + dt * 0.32) % 1;
        var dir = w.dir === 0 ? (u.alt ? 1 : -1) : w.dir;       // isotonic: equal numbers in and out
        var r = dir > 0 ? 1.45 - u.ph * 0.95 : 0.5 + u.ph * 0.95; // >0: entering the cell, <0: leaving it
        m.position.set(w.centre.x + u.d.x * w.semi.x * r, w.centre.y + u.d.y * w.semi.y * r, w.centre.z + u.d.z * w.semi.z * r);
        m.scale.setScalar(Math.sin(u.ph * Math.PI) * 1.1 + 0.05);
      });
    });
  }
})();
