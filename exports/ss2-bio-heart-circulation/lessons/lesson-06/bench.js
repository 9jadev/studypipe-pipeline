/* Lesson 06 · 3D blood bench (window.StudyScenes.bench)
   Wraps BloodCountBench (assets/js/blood-count-bench.js): stained smear at x100 / x400 and a haemocytometer count of 5 squares.
   Every number comes from the kit's model; this file only paints it. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L06;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.BloodCountBench) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }

  var kit = BloodCountBench.create({ mode: "smear", view: 400 });
  var P = kit.parts;
  var HK = window.HeartKit;
  var FINDS = {
    rbc: "Red cell: a pale-centred disc with no nucleus. Most of the field is red cells.",
    phagocyte: "Phagocyte: bigger than a red cell, lobed nucleus joined by thin strands, grainy cytoplasm. It swallows bacteria.",
    lymphocyte: "Lymphocyte: one large round nucleus filling most of the cell. It makes antibodies.",
    platelet: "Platelets: tiny fragments with no nucleus. They start the clotting process."
  };
  var state = { filled: false, found: {}, micro: false, calcDone: false, view: 400, clot: false, sickle: false, hl: null };

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.5, 2.2), pitch: 0.86, yaw: 0, distance: 36, fitWidth: 20, fitHeight: 21,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  var highlighter = null;
  if (stage) {
    stage.rig.add(kit);
    highlighter = HK && HK.makeHighlighter ? HK.makeHighlighter(stage.rig) : null;
    try { stage.scene.environment = BloodCountBench.environment(stage.renderer); } catch (e) {}
    stage.start();
  }
  function frame(dt, t) { kit.update(dt, t); if (highlighter) highlighter.update(dt, t); }

  // ---------- DOM ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var readoutEl = $("#bench-readout"), hint = $("#bench-hint");
  var fillBtn = $("#bench-fill"), nextBtn = $("#bench-next"), resetBtn = $("#bench-reset");
  var clotBtn = $("#bench-clot"), sickBtn = $("#bench-sickle");
  var microBtn = $("#micro-go"), microOut = $("#micro-out");
  var tbody = $("#results-table tbody"), countLine = $("#count-line");
  var findBtns = Array.prototype.slice.call(document.querySelectorAll("[data-find]"));
  var magBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-mag button"));
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function cardNow() {
    var r = kit.reading();
    var done = [
      Object.keys(state.found).length >= 4,
      state.micro,
      r.done,
      state.calcDone
    ];
    var now = -1;
    for (var i = 0; i < 4; i++) { if (!done[i] && now < 0) now = i; }
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", done[i]); c.classList.toggle("now", i === now); });
  }
  function sci(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + " × 10⁶";
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  function thou(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  function buildTable() {
    if (!tbody) return;
    tbody.innerHTML = "";
    for (var i = 1; i <= 5; i++) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-sq", String(i));
      tr.innerHTML = '<td data-label="Square"><strong>Square ' + i + '</strong></td><td class="empty" data-c="n" data-label="Red cells counted">—</td>';
      tbody.appendChild(tr);
    }
    [["total", "Total red cells counted"], ["vol", "Volume counted (mm³)"], ["dil", "Cells per mm³, diluted blood"], ["und", "Cells per mm³, undiluted blood"]].forEach(function (x) {
      var tr = document.createElement("tr");
      tr.className = "calc"; tr.setAttribute("data-calc", x[0]);
      tr.innerHTML = '<td data-label="Calculation">' + x[1] + '</td><td class="empty" data-c="n" data-label="Result">—</td>';
      tbody.appendChild(tr);
    });
  }
  function setCell(sel, txt, empty) {
    var td = tbody && tbody.querySelector(sel + ' [data-c="n"]'); if (!td) return;
    td.textContent = txt; td.classList.toggle("empty", !!empty);
  }
  function paintTable(flash) {
    var r = kit.reading();
    for (var i = 0; i < 5; i++) {
      var has = i < r.counts.length;
      setCell('tr[data-sq="' + (i + 1) + '"]', has ? String(r.counts[i]) : "—", !has);
      var tr = tbody.querySelector('tr[data-sq="' + (i + 1) + '"]');
      if (tr) tr.classList.toggle("fresh", flash === i);
    }
    var show = r.done;
    setCell('tr[data-calc="total"]', show ? String(r.total) : "—", !show);
    setCell('tr[data-calc="vol"]', show ? r.volume_mm3.toFixed(3) : "—", !show);
    setCell('tr[data-calc="dil"]', show ? thou(r.diluted) : "—", !show);
    setCell('tr[data-calc="und"]', show ? sci(r.undiluted) : "—", !show);
    if (countLine) countLine.textContent = show
      ? r.total + " ÷ " + r.volume_mm3.toFixed(3) + " = " + thou(r.diluted) + " per mm³; × " + r.dilution + " = " + sci(r.undiluted) + " per mm³ of whole blood."
      : "Squares counted: " + r.squares + " of 5.";
    if (show && !state.calcDone) { state.calcDone = true; }
    if (hint) hint.innerHTML = !state.filled ? "Fill the chamber first" : (show ? "All 5 squares counted" : "Squares counted: <b>" + r.squares + " of 5</b>");
    return r;
  }
  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading();
    readoutEl.innerHTML =
      "<div><span>Zoom</span><b>×" + r.view + "</b></div>" +
      "<div><span>Field</span><b>" + r.field_um + " µm</b></div>" +
      '<div class="hot"><span>This square</span><b>' + (r.count != null && r.mode === "count" ? r.count : "…") + "</b></div>" +
      "<div><span>Running total</span><b>" + r.total + "</b></div>";
  }
  function repaint(flash) { paintTable(flash); paintReadout(); cardNow(); }

  // ---------- kit events ----------
  kit.onEvent = function (name, detail) {
    if (name === "count") {
      repaint(detail.square);
      toast("Square " + (detail.square + 1) + ": " + detail.count + " red cells.");
      emit("l6:bench", kit.reading());
    } else if (name === "count-done") {
      if (detail && detail.done !== undefined && state.doneSent) return;
      state.doneSent = true;
      if (nextBtn) nextBtn.disabled = true;
      repaint(); toast("All 5 squares counted: " + kit.reading().total + " cells in 0.020 mm³.");
      emit("l6:bench-done", kit.reading());
    }
  };

  // ---------- controls ----------
  function setHighlight(name) {
    state.hl = name || null;
    kit.setState({ focus: name || null });
  }
  function find(name) {
    if (!FINDS[name]) return;
    kit.setState({ mode: "smear", view: 400, focus: name, annotate: name === "phagocyte" || name === "lymphocyte" });
    setView(400, true);
    state.found[name] = true; state.hl = name;
    toast(FINDS[name]);
    findBtns.forEach(function (b) { b.classList.toggle("zobo", !!state.found[b.getAttribute("data-find")]); });
    repaint();
    emit("l6:find", { name: name });
  }
  function setView(v, quiet) {
    state.view = v === 100 ? 100 : 400;
    magBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-view") === state.view)); });
    kit.setState({ view: state.view });
    if (!quiet) toast(state.view === 100 ? "×100: red cells are only dots and white cells are dark purple dots." : "×400: now the cell shapes and nuclei show.");
    paintReadout();
  }
  function fill() {
    if (state.filled) return;
    state.filled = true;
    kit.setState({ mode: "count", focus: "coverslip" });
    kit.settle(2);
    toast("The chamber was filled from the edge of the cover slip, then left for 2 minutes. The cells have settled.");
    if (fillBtn) { fillBtn.disabled = true; fillBtn.classList.remove("zobo"); }
    if (nextBtn) { nextBtn.disabled = false; nextBtn.classList.add("zobo"); }
    setTimeout(function () { if (state.hl === "coverslip") kit.setState({ focus: null }); }, 1800);
    repaint();
  }
  function next() {
    if (!state.filled) { toast("Fill the chamber and wait 2 minutes first."); return null; }
    if (kit.reading().done) return null;
    kit.setState({ focus: null });
    return kit.nextSquare();
  }
  function micro() {
    var M = 2000, imgMm = 15;
    var mm = imgMm / M, um = mm * 1000;
    state.micro = true;
    if (microOut) microOut.innerHTML = "Actual = image ÷ M = " + imgMm + " mm ÷ " + M + " = " + mm + " mm; × 1000 = <b>" + um.toFixed(1) + " µm</b>";
    toast("Real diameter " + um.toFixed(1) + " µm.");
    cardNow();
    emit("l6:micro", { um: um });
  }
  function setClot(on) {
    state.clot = !!on;
    if (clotBtn) clotBtn.setAttribute("aria-pressed", String(state.clot));
    kit.setState({ mode: "smear", clot: state.clot ? 1 : 0 });
    toast(state.clot ? "Clot: platelets gather in clumps and fibrin threads grow between them." : "Clot removed.");
    paintReadout();
  }
  function setSickle(on) {
    state.sickle = !!on;
    if (sickBtn) sickBtn.setAttribute("aria-pressed", String(state.sickle));
    kit.setState({ sickle: state.sickle });
    toast(state.sickle ? "Sickle cells: crescent-shaped red cells. We meet them in Lesson 7." : "Normal discs again.");
  }
  function reset() {
    kit.reset();
    kit.setState({ mode: "smear", view: 400, clot: 0, sickle: false, focus: null, annotate: false });
    state.filled = false; state.found = {}; state.micro = false; state.calcDone = false; state.doneSent = false; state.clot = false; state.sickle = false; state.hl = null;
    if (fillBtn) { fillBtn.disabled = false; fillBtn.classList.add("zobo"); }
    if (nextBtn) { nextBtn.disabled = true; nextBtn.classList.remove("zobo"); }
    if (clotBtn) clotBtn.setAttribute("aria-pressed", "false");
    if (sickBtn) sickBtn.setAttribute("aria-pressed", "false");
    findBtns.forEach(function (b) { b.classList.remove("zobo"); });
    if (microOut) microOut.textContent = "";
    magBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === "400")); });
    buildTable(); repaint();
    emit("l6:bench-reset", {});
  }

  findBtns.forEach(function (b) { b.addEventListener("click", function () { find(b.getAttribute("data-find")); }); });
  magBtns.forEach(function (b) { b.addEventListener("click", function () { setView(+b.getAttribute("data-view")); }); });
  if (fillBtn) fillBtn.addEventListener("click", fill);
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (resetBtn) resetBtn.addEventListener("click", reset);
  if (microBtn) microBtn.addEventListener("click", micro);
  if (clotBtn) clotBtn.addEventListener("click", function () { setClot(!state.clot); });
  if (sickBtn) sickBtn.addEventListener("click", function () { setSickle(!state.sickle); });

  // ---------- scene API for the narrator, the explorer and the tests ----------
  var api = {
    find: find, fill: fill, next: next, micro: micro, reset: reset, view: setView, clot: setClot, sickle: setSickle,
    setMode: function (m) {
      if (m === "smear") { kit.setState({ mode: "smear", focus: null }); }
      else if (m === "count") { kit.setState({ mode: "count", focus: null }); }
      else if (m === "clot") { setClot(true); }
      else if (m === "reset") reset();
    },
    highlight: function (p) { setHighlight(p || null); },
    rect: function (p) {
      if (!stage) return null;
      var o = P[p]; if (!o) o = kit;
      return stage.rectOf(o, 14);
    },
    reading: function () { return kit.reading(); },
    kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  buildTable(); repaint();
})();
