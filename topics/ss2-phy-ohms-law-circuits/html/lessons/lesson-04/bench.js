/* Lesson 04 · 3D galvanometer-conversion bench (window.StudyScenes.bench)
   DcCircuitBench "galvanometer" mode on one SceneKit stage. Nkechi's coil is fixed at
   I_g = 15 mA, R_g = 18.0 Ω. Every number comes from the kit's model (reading()); nothing is typed. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L04;
  if (!root || !canvas || !D || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  var sf3 = (window.DcCircuitBench && DcCircuitBench.model && DcCircuitBench.model.sf3) || D.sf3;

  var small = window.innerWidth < 560;
  var state = { conv: "ammeter", target: 3.0, built: {} };

  // ---------- kit + stage ----------
  var kit = null;
  if (window.DcCircuitBench) {
    kit = DcCircuitBench.create({
      mode: "galvanometer", labels: !small,
      onEvent: onKitEvent
    });
    kit.setState({ Ig: D.IG, Rg: D.RG, conv: "ammeter", rangeA: 3.0, rangeV: 40, test: 0.8 });
  }

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 38, target: new THREE.Vector3(0, 0.2, 0.1),
    pitch: 0.42, yaw: 0.15, distance: 8.5, minHeight: 330, maxHeight: 460, onFrame: frame
  });
  if (stage && kit) { stage.rig.add(kit); stage.start(); }
  function frame(dt, t) { if (kit) kit.update(dt, t); }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var convBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-conv [data-conv]"));
  var targetWrap = $("#bench-targets"), buildBtn = $("#bench-build"), resetBtn = $("#bench-reset"), labBtn = $("#bench-labels");
  var tbody = $("#results-table tbody"), tallyLine = $("#build-line");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  if (labBtn) labBtn.setAttribute("aria-pressed", String(!small));

  var TARGETS = {
    ammeter: [{ v: 1.0, t: "1.0 A" }, { v: 2.0, t: "2.0 A" }, { v: 3.0, t: "3.0 A" }, { v: 5.0, t: "5.0 A" }],
    voltmeter: [{ v: 5.0, t: "5.0 V" }, { v: 10.0, t: "10 V" }, { v: 40.0, t: "40 V" }, { v: 150.0, t: "150 V" }]
  };

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function buildCount() { return Object.keys(state.built).length; }

  function buildTargets() {
    if (!targetWrap) return;
    targetWrap.innerHTML = "";
    TARGETS[state.conv].forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "gv-btn"; b.setAttribute("data-t", String(o.v));
      b.textContent = o.t;
      b.setAttribute("aria-pressed", String(o.v === state.target));
      b.addEventListener("click", function () { setTarget(o.v); });
      targetWrap.appendChild(b);
    });
  }

  function reading() { return kit ? kit.reading() : null; }

  function paintReadout() {
    if (!readoutEl) return;
    var r = reading();
    var amm = state.conv === "ammeter";
    var add = r ? (amm ? r.R_s : r.R_m) : (amm ? D.shunt(state.target) : D.mult(state.target));
    var meter = r ? (amm ? r.R_meter : r.R_total) : (amm ? D.rmeterA(state.target) : D.rtotalV(state.target));
    var share;
    if (amm) {
      var Ishunt = r ? r.I_shunt : state.target - D.IG;
      var pct = r && r.fraction_coil != null ? (1 - r.fraction_coil) * 100 : (state.target - D.IG) / state.target * 100;
      share = sf3(Ishunt) + " A (" + pct.toFixed(1) + "%)";
    } else {
      share = (D.IG * 1000).toFixed(0) + " mA coil";
    }
    readoutEl.innerHTML =
      '<div><span>Making</span><b class="sm">' + (amm ? state.target.toFixed(1) + " A ammeter" : (state.target < 100 ? state.target.toFixed(0) : state.target) + " V voltmeter") + '</b></div>' +
      '<div class="hot"><span>Add ' + (amm ? "shunt R_s" : "multiplier R_m") + '</span><b class="sm">' + sf3(add) + ' Ω</b></div>' +
      '<div><span>Whole meter R</span><b class="sm">' + sf3(meter) + ' Ω</b></div>' +
      '<div><span>' + (amm ? "Through shunt" : "Coil current") + '</span><b class="sm">' + share + '</b></div>';
  }

  // ---------- results table ----------
  function rowLabel(conv, range) { return (conv === "ammeter" ? range.toFixed(1) + " A ammeter" : (range < 100 ? range.toFixed(0) : range) + " V voltmeter"); }
  function addRow(row) {
    if (!tbody) return;
    var amm = row.conv === "ammeter";
    var key = row.conv;
    var add = (amm ? "R_s " : "R_m ") + sf3(amm ? row.R_s : row.R_m) + " Ω";
    var meter = sf3(row.R_meter) + " Ω";
    var existing = tbody.querySelector('tr[data-k="' + key + '"]');
    var html = '<td data-label="Conversion"><strong>' + rowLabel(row.conv, row.range) + '</strong></td>' +
      '<td data-label="Coil">15 mA · 18 Ω</td>' +
      '<td data-label="Add">' + add + '</td>' +
      '<td data-label="Whole meter R">' + meter + '</td>';
    if (existing) { existing.innerHTML = html; existing.classList.add("fresh"); }
    else {
      var tr = document.createElement("tr");
      tr.setAttribute("data-k", key); tr.className = "fresh"; tr.innerHTML = html;
      tr.addEventListener("click", function () { tr.classList.toggle("open"); });
      tbody.appendChild(tr);
    }
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x.getAttribute("data-k") === key); });
    if (tallyLine) tallyLine.textContent = "Conversions built: " + buildCount() + " of 2 (one ammeter and one voltmeter)";
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "reading") { paintReadout(); emit("l4:bench", reading()); }
    else if (name === "built") {
      var r = reading();
      var row = { conv: r.conv, range: r.conv === "ammeter" ? state.target : state.target, R_s: r.R_s, R_m: r.R_m, R_meter: r.conv === "ammeter" ? r.R_meter : r.R_total };
      state.built[r.conv] = true;
      addRow(row);
      cardState(r.conv === "ammeter" ? 3 : 4, r.conv === "ammeter" ? 2 : -1);
      toast(r.conv === "ammeter" ? "Ammeter built: a tiny shunt diverts most of the current." : "Voltmeter built: a big multiplier drops the extra voltage.");
    } else if (name === "done") { emit("l4:bench-done", { count: buildCount() }); }
  }

  // ---------- controls ----------
  function setConv(c) {
    if (c !== "ammeter" && c !== "voltmeter") return;
    state.conv = c;
    state.target = c === "ammeter" ? 3.0 : 40.0;
    convBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-conv") === c)); });
    if (kit) kit.setState({ conv: c, rangeA: 3.0, rangeV: 40, test: 0.8 });
    buildTargets(); paintReadout();
    cardState(1, c === "ammeter" ? 1 : 2);
    if (hintEl) hintEl.textContent = c === "ammeter" ? "Pick a current range, then Build & test." : "Pick a voltage range, then Build & test.";
  }
  function setTarget(v) {
    state.target = v;
    if (kit) kit.setState(state.conv === "ammeter" ? { rangeA: v, test: 0.8 * v } : { rangeV: v, test: 0.8 * v });
    Array.prototype.forEach.call(targetWrap ? targetWrap.children : [], function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-t") === v)); });
    paintReadout();
  }
  function build() {
    if (kit) kit.build(); else { state.built[state.conv] = true; addRow({ conv: state.conv, range: state.target, R_s: D.shunt(state.target), R_m: D.mult(state.target), R_meter: state.conv === "ammeter" ? D.rmeterA(state.target) : D.rtotalV(state.target) }); if (buildCount() >= 2) emit("l4:bench-done", {}); }
  }
  function resetAll() {
    if (kit) kit.reset();
    state.built = {};
    if (tbody) tbody.innerHTML = "";
    setConv("ammeter");
    if (tallyLine) tallyLine.textContent = "Conversions built: 0 of 2 (one ammeter and one voltmeter)";
    cardState(0, 0);
    emit("l4:bench-reset", {});
  }

  convBtns.forEach(function (b) { b.addEventListener("click", function () { setConv(b.getAttribute("data-conv")); }); });
  if (buildBtn) buildBtn.addEventListener("click", build);
  if (resetBtn) resetBtn.addEventListener("click", resetAll);
  if (labBtn) labBtn.addEventListener("click", function () {
    var on = labBtn.getAttribute("aria-pressed") !== "true";
    labBtn.setAttribute("aria-pressed", String(on)); if (kit) kit.setState({ labels: on });
  });

  // tap a part → name it
  if (stage && kit) {
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), down = null;
    canvas.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) { down = null; return; }
      down = null;
      var rc = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray);
      if (id) { kit.highlight(id); toast(id.replace(/([A-Z])/g, " $1").toLowerCase()); setTimeout(function () { kit.highlight(null); }, 1200); }
    });
  }

  // ---------- scene API for narrator / tests ----------
  var api = {
    setMode: function (m) { if (m === "ammeter" || m === "voltmeter") setConv(m); },
    setConv: setConv, setTarget: setTarget, build: build, reset: resetAll,
    highlight: function (p) { if (!kit) return; kit.highlight(p || null); },
    rect: function (p) {
      if (!stage || !kit) return null;
      var o = (kit.parts && p && kit.parts[p]) || kit;
      return stage.rectOf(o, 14);
    },
    reading: reading, kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  buildTargets(); paintReadout(); cardState(1, 1);
  setInterval(paintReadout, 400);
})();
