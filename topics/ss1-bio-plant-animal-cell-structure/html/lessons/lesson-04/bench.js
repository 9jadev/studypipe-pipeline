/* Lesson 04 · 3D potato-strip osmometer bench (OsmometerKit): cork borer, potato, six boiling tubes, top-pan balance, tile and blotter.
   Every mass is computed by the kit's model; this file only drives the kit, the HTML controls and the readout. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.OsmometerKit) return;

  var CONCS = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  var TECH = window.L04 ? window.L04.techniques : {};
  var tech = "careful";
  var rowTech = [];         // technique in force when each tube was re-weighed
  var doneEmitted = false;
  var queue = [];           // taps wait here while the strips are still moving
  var viewMode = root.clientWidth < 560 ? "follow" : "all";
  var goal = null;

  var toastEl = document.getElementById("bench-toast");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  function emit(n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); }
  function fmt2(v) { return v == null ? "–" : v.toFixed(2); }
  function signed(v, d) { return v == null ? "–" : (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(d); }

  var kit = OsmometerKit.create({ onEvent: onKit });
  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.7, 0.35), pitch: 0.34, yaw: 0, distance: 6.6,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  var hl = null;
  if (stage) {
    // the kit is lit by the stage's own lights: skip the reflection map and cap the pixel ratio, so low-end phones stay smooth
    stage.envOff = true;
    stage.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    stage.resize();
    stage.rig.add(kit);
    hl = OsmometerKit.makeHighlighter(stage.scene);
    // the first frame compiles every shader: wait until the practical is near the screen so the page opens fast
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (en, ob) { if (en[0].isIntersecting) { ob.disconnect(); ensureStart(); } }, { rootMargin: "500px 0px" }).observe(root);
    } else ensureStart();
  } else {
    // no WebGL: the practical still works from the buttons and the table
    setInterval(function () { kit.update(0.05, Date.now() / 1000); }, 50);
  }

  var started = false;
  function ensureStart() { if (started || !stage) return; started = true; stage.start(); }

  // ---------- kit events ----------
  function onKit(name, d) {
    if (name === "select") { paintTubes(); paintReadout(true); }
    else if (name === "weighed") {
      toast("Tube " + (d.i + 1) + " (" + d.conc.toFixed(1) + " mol dm⁻³): initial mass " + d.mass_g.toFixed(2) + " g");
      autoSelect("ready");
      paintTubes(); paintReadout(true);
    } else if (name === "soak-start") {
      toast("Strips are in the tubes. The clock runs: 30 minutes.");
    } else if (name === "soaked") {
      toast("30 minutes are up. Re-weigh each strip, blotting them all in the same way.");
      autoSelect("soaked");
    } else if (name === "reweighed") {
      rowTech[d.i] = tech;
      var rd = reading();
      toast("Tube " + (d.i + 1) + ": " + fmt2(d.m1) + " g, change " + signed(d.change_g, 2) + " g, " + signed(d.pct, 1) + " %");
      emit("l4:bench", rd);
      paintTubes(); paintReadout(true);
      if (rd.nDone === 6 && !doneEmitted) {
        doneEmitted = true;
        if (viewMode === "follow") focus("all");
        emit("l4:bench-done", rd);
      }
    } else if (name === "reset") {
      paintTubes(); paintReadout(true);
    }
  }
  function reading() {
    var r = kit.reading();
    r.tech = rowTech.slice();
    r.technique = tech;
    return r;
  }
  function autoSelect(state) {
    var r = kit.reading();
    for (var k = 0; k < r.rows.length; k++) if (r.rows[k].state === state) { kit.select(k); return; }
  }

  // ---------- UI ----------
  var tubesEl = document.getElementById("bench-tubes");
  var btnWeigh = document.getElementById("b-weigh");
  var btnLeave = document.getElementById("b-leave");
  var btnRe = document.getElementById("b-reweigh");
  var btnAuto = document.getElementById("b-auto");
  var btnReset = document.getElementById("bench-reset");
  var hint = document.getElementById("bench-hint");
  var readoutEl = document.getElementById("bench-readout");

  if (tubesEl) CONCS.forEach(function (c, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("data-i", i);
    b.textContent = c.toFixed(1);
    b.setAttribute("aria-label", "Tube " + (i + 1) + ", " + c.toFixed(1) + " mol dm per cubic decimetre");
    b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    b.addEventListener("click", function () { kit.select(i); });
    tubesEl.appendChild(b);
  });

  function paintTubes() {
    if (!tubesEl) return;
    var r = kit.reading();
    Array.prototype.forEach.call(tubesEl.children, function (b, i) {
      var row = r.rows[i];
      b.setAttribute("aria-pressed", i === r.selected ? "true" : "false");
      b.classList.toggle("wt", row.state === "weighed" || row.state === "soaking" || row.state === "soaked");
      b.classList.toggle("dn", row.state === "done");
    });
  }

  var lastKey = "";
  function paintReadout(force) {
    var r = kit.reading();
    var key = JSON.stringify([r.rows.map(function (x) { return [x.state, x.m1, x.firmness]; }), r.selected, r.balance_g, r.elapsed_min, r.busy, r.errors]);
    if (!force && key === lastKey) return;
    lastKey = key;
    var row = r.rows[r.selected] || r.rows[0];
    var shown = row.weighed || row.inTube || row.done;
    if (readoutEl) readoutEl.innerHTML =
      '<div><span>Tube</span><b>' + (row.i + 1) + ': ' + row.conc.toFixed(1) + '</b></div>' +
      '<div><span>Balance g</span><b>' + r.balance_g + '</b></div>' +
      '<div><span>Initial g</span><b>' + (shown ? row.m0.toFixed(2) : "–") + '</b></div>' +
      '<div><span>Final g</span><b>' + fmt2(row.m1) + '</b></div>' +
      '<div><span>Change g</span><b>' + signed(row.change_g, 2) + '</b></div>' +
      '<div class="' + (row.pct != null && row.pct < 0 ? "hot" : "") + '"><span>% change</span><b>' + signed(row.pct, 1) + '</b></div>' +
      '<div><span>Time min</span><b>' + Math.round(r.elapsed_min) + ' / ' + r.minutes + '</b></div>' +
      '<div><span>Strip</span><b>' + (row.firmness || (shown ? "cut" : "–")) + '</b></div>';
    var soaking = r.soaking ? " · soaking " + Math.round(r.elapsed_min) + " of " + r.minutes + " min" : r.soaked && !r.allDone ? " · 30 min up, re-weigh" : "";
    if (hint) hint.innerHTML = "Weighed <b>" + r.nWeighed + " of 6</b> · re-weighed <b>" + r.nDone + " of 6</b>" + soaking;
    // button states
    var started = r.soaking || r.soaked || r.rows.some(function (x) { return x.inTube || x.done; });
    var anyReady = r.rows.some(function (x) { return x.state === "ready"; });
    var anySoaked = r.rows.some(function (x) { return x.state === "soaked"; });
    if (btnWeigh) btnWeigh.disabled = started || !anyReady;
    if (btnLeave) btnLeave.disabled = started || r.nWeighed === 0;
    if (btnRe) btnRe.disabled = !(r.soaked && anySoaked);
  }

  // ---------- action queue: a tap during an animation waits for the strip to finish ----------
  function pump() {
    if (!queue.length) return;
    if (kit.reading().busy) return;
    var fn = queue.shift();
    fn();
  }
  function firstState(r, state) {
    if (r.rows[r.selected] && r.rows[r.selected].state === state) return r.selected;
    for (var k = 0; k < r.rows.length; k++) if (r.rows[k].state === state) return k;
    return null;
  }
  function doWeigh(i) {
    queue.push(function () {
      var r = kit.reading(), k = i != null ? i : firstState(r, "ready");
      if (k == null) return;
      if (viewMode === "follow") focus("balance");
      kit.weigh(k);
    });
  }
  function doLeave() {
    var r = kit.reading();
    if (r.nWeighed < 6) { toast("Weigh all six strips first, so that every tube gets a strip."); return; }
    queue.push(function () { if (viewMode === "follow") focus("rack"); kit.leave(30); });
  }
  function doReweigh(i) {
    queue.push(function () {
      var r = kit.reading(), k = i != null ? i : firstState(r, "soaked");
      if (k == null) return;
      if (viewMode === "follow") focus("balance");
      kit.reweigh(k);
    });
  }
  function doAuto() {
    queue.length = 0; rowTech = []; doneEmitted = false;
    emit("l4:bench-reset", { auto: true });
    kit.runAll();
    if (viewMode === "follow") focus("all");
  }
  function doReset() {
    queue.length = 0; rowTech = []; doneEmitted = false;
    kit.reset();
    if (viewMode === "follow") focus("all");
    emit("l4:bench-reset", {});
    toast("Bench reset. Weigh each tube again.");
  }

  if (btnWeigh) btnWeigh.addEventListener("click", function () { doWeigh(); });
  if (btnLeave) btnLeave.addEventListener("click", doLeave);
  if (btnRe) btnRe.addEventListener("click", function () { doReweigh(); });
  if (btnAuto) btnAuto.addEventListener("click", doAuto);
  if (btnReset) btnReset.addEventListener("click", doReset);

  // ---------- technique (error modes) ----------
  var TECH_MSG = {
    careful: "Careful technique: blot every strip the same way, weigh at once, tubes covered.",
    unblotted: "Not blotted: a film of solution stays on the strip and is weighed too, so the final mass reads too high.",
    overBlotted: "Blotted too hard: sap is squeezed out of the cut cells, so the final mass reads too low.",
    evaporation: "Left on the tile and tubes left open: water evaporates, so masses read too low and the solutions get more concentrated."
  };
  function setTech(t) {
    if (!TECH[t]) return;
    tech = t;
    var f = TECH[t].flag;
    kit.setState({ errors: { unblotted: f === "unblotted", overBlotted: f === "overBlotted", evaporation: f === "evaporation" } });
    var seg = document.getElementById("bench-tech");
    if (seg) Array.prototype.forEach.call(seg.querySelectorAll("[data-tech]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-tech") === t ? "true" : "false");
    });
    toast(TECH_MSG[t] + (kit.reading().soaking || kit.reading().soaked ? "" : " (Applies when you re-weigh.)"));
    emit("l4:bench-tech", { tech: t });
    paintReadout(true);
  }
  var techSeg = document.getElementById("bench-tech");
  if (techSeg) techSeg.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tech]");
    if (b) setTech(b.getAttribute("data-tech"));
  });

  // ---------- camera ----------
  function focus(name) {
    if (!stage) return;
    var all = kit.viewFor("all");
    if (!name || name === "all") {
      goal = { target: (stage.fitTarget || stage.target).clone(), zoom: 1 };
    } else {
      var v = kit.viewFor(name);
      goal = { target: new THREE.Vector3().fromArray(v.target), zoom: Math.max(0.3, Math.min(1.4, v.dist / all.dist)) };
    }
  }
  var viewSeg = document.getElementById("bench-view");
  function paintView() {
    if (!viewSeg) return;
    Array.prototype.forEach.call(viewSeg.querySelectorAll("[data-view]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-view") === viewMode ? "true" : "false");
    });
  }
  if (viewSeg) {
    viewSeg.addEventListener("click", function (e) {
      var b = e.target.closest("[data-view]");
      if (!b) return;
      viewMode = b.getAttribute("data-view");
      paintView();
      if (viewMode !== "follow") focus(viewMode);
    });
    paintView();
  }

  // ---------- tap to pick a tube / learn a part ----------
  var INFO = {
    borer: "Cork borer: it cuts every strip the same width, so each one starts with the same shape.",
    potato: "Potato: one tuber for every strip, so the cell sap is the same in all six.",
    balance: "Top-pan balance: zero it before each weighing and read to 2 decimal places.",
    tile: "Tile: strips rest here. Leave them too long and water evaporates, so the mass is too low.",
    blotter: "Blotting paper: blot each strip gently and in the same way, so only the strip is weighed."
  };
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), downAt = null;
  canvas.addEventListener("pointerdown", function (e) { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", function (e) {
    if (!downAt || !stage) return;
    var moved = Math.abs(e.clientX - downAt[0]) + Math.abs(e.clientY - downAt[1]);
    downAt = null;
    if (moved > 8) return;
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, stage.camera);
    var id = kit.pickPart(ray);
    if (!id) return;
    var m = /^(tube|strip)(\d)$/.exec(id);
    if (m) { kit.select(+m[2]); if (hl) { hl.highlight(id); setTimeout(function () { hl.clear(); }, 700); } return; }
    if (INFO[id]) { toast(INFO[id]); if (hl) { hl.highlight(id); setTimeout(function () { hl.clear(); }, 900); } }
  });

  // ---------- scene API (narrator + tests) ----------
  var narrHl = null;
  var api = {
    rect: function (part) {
      if (!stage) return null;
      ensureStart();
      var o = (part && kit.parts && kit.parts[part]) || kit;
      return stage.rectOf(o, 12);
    },
    highlight: function (p) {
      narrHl = p || null;
      if (p) ensureStart();
      if (hl) hl.highlight(p || null);
      if (p) { if (kit.parts && kit.parts[p]) focus(p === "tube" ? "rack" : p); }
    },
    setMode: function (m) { focus(m); },
    focus: focus,
    select: function (i) { kit.select(+i); },
    weigh: function (i) { doWeigh(i == null || i === "" ? null : +i); },
    leave: doLeave,
    reweigh: function (i) { doReweigh(i == null || i === "" ? null : +i); },
    runAll: doAuto,
    setTech: setTech,
    reset: doReset,
    reading: reading,
    kit: kit
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  // ---------- frame loop ----------
  var acc = 0;
  function frame(dt, t) {
    kit.update(dt, t);
    if (goal) {
      var k = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, k);
      stage.zoom += (goal.zoom - stage.zoom) * k;
      if (stage.target.distanceTo(goal.target) < 0.004 && Math.abs(stage.zoom - goal.zoom) < 0.004) goal = null;
    }
    acc += dt;
    if (acc > 0.12) { acc = 0; pump(); paintReadout(false); paintTubes(); }
  }

  paintTubes();
  paintReadout(true);
  if (!stage) setInterval(function () { pump(); paintReadout(false); paintTubes(); }, 150);
})();
