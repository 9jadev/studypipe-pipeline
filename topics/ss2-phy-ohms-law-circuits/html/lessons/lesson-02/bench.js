/* Lesson 02 · 3D internal-resistance bench (window.StudyScenes.bench)
   DcCircuitBench in "internal-resistance" mode (lesson cell E = 6.0 V, r = 1.5 Ω) on a SceneKit stage.
   Every I, V and lost-volts reading comes from the kit's physics model (DcCircuitBench.model). */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L02;
  if (!root || !canvas || !D || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var small = root.clientWidth < 560;
  var state = { R: 10.5, key: false };   // key open to begin so the voltmeter shows E

  if (!window.DcCircuitBench) { toast("Circuit bench kit missing — use the table and worked examples."); return; }

  var kit = DcCircuitBench.create({
    mode: "internal-resistance",
    labels: !small,
    onEvent: onKitEvent
  });
  kit.setState({ preset: "lesson-cell" });        // E = 6.0 V, r = 1.5 Ω
  kit.setState({ R: state.R, key: state.key });

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 32,
    target: new THREE.Vector3(0, 0.3, 0.1), pitch: 0.5, yaw: 0.08,
    minYaw: -0.8, maxYaw: 0.8, minHeight: 300, maxHeight: 450,
    portraitPitch: 0.18, onFrame: frame
  });
  if (stage) { stage.rig.add(kit); stage.start(); }
  function frame(dt, t) { kit.update(dt, t); }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint"), rowsLine = $("#rows-line");
  var tbody = $("#results-table tbody");
  var keyBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-key [data-key]"));
  var loadBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-loads [data-r]"));
  var takeBtn = $("#bench-take"), resetBtn = $("#bench-reset");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }

  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading();
    readoutEl.innerHTML =
      '<div><span>EMF E / V</span><b>' + r.E.toFixed(1) + '</b></div>' +
      '<div><span>I / A</span><b>' + r.I.toFixed(2) + '</b></div>' +
      '<div><span>Terminal V / V</span><b>' + r.V.toFixed(2) + '</b></div>' +
      '<div class="hot"><span>Lost Ir / V</span><b>' + r.lost.toFixed(2) + '</b></div>';
  }

  function paintKeyBtns() {
    keyBtns.forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-key") === "closed") === state.key)); });
  }
  function paintLoadBtns() {
    loadBtns.forEach(function (b) { b.classList.toggle("zobo", state.key && +b.getAttribute("data-r") === state.R); });
  }

  // rows come straight from the kit model (reading().rows); R = null is the open-circuit row
  function paintTable(rows) {
    if (!tbody) return;
    tbody.innerHTML = "";
    var closed = 0;
    rows.forEach(function (row, i) {
      if (row.R != null) closed++;
      var tr = document.createElement("tr");
      if (i === rows.length - 1) tr.className = "fresh";
      tr.innerHTML =
        "<td><strong>" + (row.open ? "open" : "#" + (i + 1)) + "</strong></td>" +
        "<td>" + (row.R == null ? "open" : row.R.toFixed(1)) + "</td>" +
        "<td>" + row.I.toFixed(2) + "</td>" +
        "<td>" + row.V.toFixed(2) + "</td>" +
        "<td>" + row.lost.toFixed(2) + "</td>";
      tbody.appendChild(tr);
    });
    if (rowsLine) rowsLine.textContent = "Readings recorded: " + closed + " of 5";
    cardState(closed >= 1 ? (closed >= 5 ? 4 : (state.key ? 2 : 1)) : (state.key ? 1 : 0), closed >= 5 ? -1 : (closed >= 1 ? 2 : (state.key ? 1 : 0)));
    return closed;
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "reading") {
      var r = kit.reading();
      paintTable(r.rows);
      paintReadout();
      emit("l2:bench", r);     // graph.js plots the closed rows; marker from the latest
    } else if (name === "done") {
      toast("Five loads recorded. The straight line gives E (intercept) and r (gradient).");
      emit("l2:bench-done", { count: 5 });
    } else if (name === "key") {
      paintReadout();
    }
  }

  // ---------- controls ----------
  function setKey(closed) {
    state.key = !!closed;
    kit.setState({ key: state.key });
    paintKeyBtns(); paintLoadBtns(); paintReadout();
    if (!state.key) { hintEl.textContent = "Key open: the voltmeter reads the EMF, E."; cardState(0, 0); }
    else hintEl.textContent = "Key closed at " + state.R.toFixed(1) + " Ω. Press Take reading.";
  }
  function setLoad(R) {
    state.R = +R; state.key = true;
    kit.setState({ R: state.R, key: true });
    paintKeyBtns(); paintLoadBtns(); paintReadout();
    hintEl.textContent = "Load " + state.R.toFixed(1) + " Ω set. Press Take reading.";
    cardState(1, 1);
  }
  function take() {
    kit.takeReading();   // records the row and fires the "reading" (and possibly "done") event
    toast("Recorded: " + (state.key ? state.R.toFixed(1) + " Ω" : "open circuit") + ".");
  }
  function resetAll() {
    kit.reset();
    kit.setState({ preset: "lesson-cell" });
    state.R = 10.5; state.key = false;
    kit.setState({ R: state.R, key: false });
    if (tbody) tbody.innerHTML = "";
    if (rowsLine) rowsLine.textContent = "Readings recorded: 0 of 5";
    paintKeyBtns(); paintLoadBtns(); paintReadout();
    hintEl.textContent = "Recorded 0 of 5 readings";
    cardState(0, 0);
    emit("l2:bench-reset", {});
  }

  keyBtns.forEach(function (b) { b.addEventListener("click", function () { setKey(b.getAttribute("data-key") === "closed"); }); });
  loadBtns.forEach(function (b) { b.addEventListener("click", function () { setLoad(b.getAttribute("data-r")); }); });
  if (takeBtn) takeBtn.addEventListener("click", take);
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  // tapping the 3D model names a part
  if (stage) {
    var down = null, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
      down = null;
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray);
      if (id) toast(id.replace(/([A-Z])/g, " $1").toLowerCase());
    });
  }

  // model helper for the load explorer (same physics as solveIR, no recording)
  function model(R) {
    var E = D.cell.E, rr = D.cell.r;
    if (R == null) return { R: null, I: 0, V: E, lost: 0, E: E, r: rr };
    var I = E / (R + rr), lost = I * rr;
    return { R: R, I: I, V: E - lost, lost: lost, E: E, r: rr };
  }

  // ---------- scene API ----------
  var api = {
    setMode: function () {},                 // single mode
    key: setKey,
    load: setLoad,
    take: take,
    reset: resetAll,
    model: model,
    rebuildEmeka: function () {
      kit.setState({ preset: "keke" });      // E = 12.0 V, r = 1.2 Ω
      state.R = 2.8; state.key = true;
      kit.setState({ R: 2.8, key: true });
      paintKeyBtns(); paintLoadBtns(); paintReadout();
      hintEl.textContent = "Emeka's battery on the 2.8 Ω starter: 3.0 A, lost 3.6 V, terminals 8.4 V.";
    },
    demo: function () { setKey(false); },     // show E for the narrator
    highlight: function (p) { if (!p) kit.clearHighlight(); else kit.highlight(p); },
    rect: function (p) {
      if (!stage) return null;
      if (p === "bench" || !p) return stage.rectOf(kit, 14);
      var o = kit.parts && kit.parts[p];
      return stage.rectOf(o || kit, 12);
    },
    reading: function () { return kit.reading(); },
    autoRun: function () { setKey(false); },
    kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  paintKeyBtns(); paintLoadBtns(); paintReadout(); cardState(0, 0);
  setInterval(paintReadout, 400);
})();
