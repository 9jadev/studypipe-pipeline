/* Lesson 03 · 3D cell-array / network bench (window.StudyScenes.bench)
   DcCircuitBench in network-cells mode. The single cell E = 5.0 V, r = 0.5 Ω drives the
   load trials (P–R, η–R); the three 1.5 V, 2.0 Ω cells drive the series vs parallel comparison.
   Every number comes from the kit's physics model (DcCircuitBench.model), never typed in. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L03;
  if (!root || !canvas || !D || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var SINGLE = D.cell;                                // { E: 5.0, r: 0.5 }
  var ARRAY = { E: 1.5, r: 2.0, n: 3 };              // three backup cells, 2.0 Ω each
  var PUMP = 1.0;                                     // low-resistance pump load (Ω) for the comparison

  // ---- fallback physics (used only if the 3D kit cannot start) ----
  function solve(arr, R) {
    var E, r;
    if (arr === "series") { E = ARRAY.E * ARRAY.n; r = ARRAY.r * ARRAY.n; }
    else if (arr === "parallel") { E = ARRAY.E; r = ARRAY.r / ARRAY.n; }
    else { E = SINGLE.E; r = SINGLE.r; }
    var I = E / (R + r);
    return { E_t: E, r_t: r, R_eq: R, I: I, P: I * I * R, eta_pct: 100 * R / (R + r) };
  }

  var state = { arr: "single", load: 0.5, loads: {}, arrDone: {}, last: null };

  // ---- kit + stage ----
  var kit = window.DcCircuitBench ? DcCircuitBench.create({ mode: "network-cells", labels: root.clientWidth >= 560, onEvent: function () {} }) : null;
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0, 0.6, 0), pitch: 0.28, yaw: 0.05, distance: 6.4,
    minYaw: -0.8, maxYaw: 0.8, onFrame: frame
  });
  if (stage && kit) { stage.rig.add(kit); stage.start(); }
  else if (stage) { stage.start(); }
  function frame(dt, t) { if (kit && kit.update) kit.update(dt, t); }

  function applyToKit() {
    if (!kit) return;
    if (state.arr === "single") kit.setState({ cells: "single", net: "load", E: SINGLE.E, r: SINGLE.r, R: state.load, key: true });
    else kit.setState({ cells: state.arr, net: "load", E: ARRAY.E, r: ARRAY.r, n: ARRAY.n, R: PUMP, key: true });
  }

  // reading() always from the kit model when present, else the fallback solver
  function read() {
    if (kit && kit.reading) {
      applyToKit();
      var rd = kit.reading();
      var R = state.arr === "single" ? state.load : PUMP;
      return { arr: state.arr, R_eq: (rd.R_eq != null ? rd.R_eq : R), I: rd.I, P: rd.P, eta_pct: (rd.eta_pct != null ? rd.eta_pct : rd.eta * 100), E_t: rd.E_t, r_t: rd.r_t };
    }
    var R2 = state.arr === "single" ? state.load : PUMP;
    var s = solve(state.arr, R2); s.arr = state.arr; return s;
  }

  // ---- DOM ----
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var tbody = $("#results-table tbody"), lineEl = $("#route-line");
  var arrBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-arr [data-arr]"));
  var loadBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-loads [data-load]"));
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function setupLabel(r) {
    return r.arr === "single" ? "1 cell · R=" + r.R_eq.toFixed(1) + " Ω"
      : r.arr === "series" ? "3 cells · series" : "3 cells · parallel";
  }
  function paintReadout() {
    if (!readoutEl) return;
    var r = state.last || read();
    readoutEl.innerHTML =
      '<div><span>Setup</span><b class="sm">' + setupLabel(r) + "</b></div>" +
      '<div><span>I / A</span><b>' + r.I.toFixed(2) + "</b></div>" +
      '<div class="hot"><span>P / W</span><b>' + r.P.toFixed(2) + "</b></div>" +
      '<div><span>η / %</span><b>' + r.eta_pct.toFixed(1) + "</b></div>";
  }

  function loadCount() { return Object.keys(state.loads).length; }
  function arrCount() { return Object.keys(state.arrDone).length; }
  function allDone() { return loadCount() >= 4 && state.arrDone.series && state.arrDone.parallel; }

  function fillRow(key, r) {
    if (!tbody) return;
    var tr = tbody.querySelector('tr[data-k="' + key + '"]');
    if (!tr) {
      tr = document.createElement("tr"); tr.setAttribute("data-k", key);
      tr.innerHTML = '<td class="setup-cell"><strong></strong><span class="why"></span></td><td data-c="req">—</td><td data-c="i">—</td><td data-c="p">—</td><td data-c="eta">—</td>';
      tr.addEventListener("click", function () { tr.classList.toggle("open"); });
      tbody.appendChild(tr);
    }
    tr.querySelector("strong").textContent = setupLabel(r);
    var why = r.arr === "single"
      ? (Math.abs(r.R_eq - SINGLE.r) < 1e-6 ? "R = r: output power peaks, but η is only 50 %." : "")
      : (r.arr === "series" ? "Eₜ = " + r.E_t.toFixed(1) + " V, rₜ = " + r.r_t.toFixed(1) + " Ω." : "Eₜ = " + r.E_t.toFixed(1) + " V, rₜ = " + r.r_t.toFixed(2) + " Ω.");
    tr.querySelector(".why").textContent = why;
    tr.querySelector('[data-c="req"]').textContent = r.R_eq.toFixed(1);
    tr.querySelector('[data-c="i"]').textContent = r.I.toFixed(2);
    tr.querySelector('[data-c="p"]').textContent = r.P.toFixed(2);
    tr.querySelector('[data-c="eta"]').textContent = r.eta_pct.toFixed(1);
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
  }

  function paintLine() {
    if (lineEl) lineEl.innerHTML = "Trials recorded: <b>" + loadCount() + " of 4 loads</b> · arrays: <b>" + arrCount() + " of 2</b>";
    if (hintEl) {
      hintEl.textContent = state.arr === "single"
        ? "Tap each load to record P and η (do 4)"
        : "Recorded the " + state.arr + " array (pump R = 1.0 Ω)";
    }
  }

  function measure() {
    var r = read(); state.last = r;
    var key, msg;
    if (r.arr === "single") {
      key = "L" + r.R_eq.toFixed(1); state.loads[key] = true;
      msg = "R = " + r.R_eq.toFixed(1) + " Ω → P = " + r.P.toFixed(2) + " W, η = " + r.eta_pct.toFixed(1) + " %";
    } else {
      key = r.arr; state.arrDone[r.arr] = true;
      msg = "3 cells " + r.arr + ": I = " + r.I.toFixed(2) + " A through the 1.0 Ω pump";
    }
    fillRow(key, r); paintReadout(); paintLine();
    cardState(r.arr === "single" ? (loadCount() >= 4 ? 3 : 2) : 3, 2);
    toast(msg);
    emit("l3:bench", r);
    if (allDone()) { cardState(4, -1); toast("All trials in. Power peaks at R = r = 0.5 Ω; parallel wins for the low-R pump."); emit("l3:bench-done", { loads: loadCount() }); }
  }

  function setArr(arr) {
    if (["single", "series", "parallel"].indexOf(arr) < 0) return;
    state.arr = arr;
    arrBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-arr") === arr)); });
    loadBtns.forEach(function (b) { b.disabled = arr !== "single"; });
    applyToKit(); state.last = read(); paintReadout(); paintLine();
    if (arr !== "single") measure();                 // selecting an array measures it at the pump load
    else cardState(1, 1);
  }
  function setLoad(R) {
    state.arr = "single"; state.load = R;
    arrBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-arr") === "single")); });
    loadBtns.forEach(function (b) { b.disabled = false; b.setAttribute("aria-pressed", String(+b.getAttribute("data-load") === R)); });
    applyToKit(); measure();
  }
  function reset() {
    state = { arr: "single", load: 0.5, loads: {}, arrDone: {}, last: null };
    arrBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-arr") === "single")); });
    loadBtns.forEach(function (b) { b.disabled = false; b.setAttribute("aria-pressed", "false"); });
    if (tbody) tbody.innerHTML = "";
    applyToKit(); state.last = read(); paintReadout(); paintLine(); cardState(0, 0);
    emit("l3:bench-reset", {});
    toast("Bench reset. Record four loads, then compare series and parallel.");
  }

  arrBtns.forEach(function (b) { b.addEventListener("click", function () { setArr(b.getAttribute("data-arr")); }); });
  loadBtns.forEach(function (b) { b.addEventListener("click", function () { setLoad(+b.getAttribute("data-load")); }); });
  var mBtn = $("#bench-measure"); if (mBtn) mBtn.addEventListener("click", measure);
  var rBtn = $("#bench-reset"); if (rBtn) rBtn.addEventListener("click", reset);

  // ---- scene API for the narrator and the explorer ----
  var PART_ALIAS = { node: "node", nodeA: "node", pump: "R1", load: "R1", cells: "cellA", cell: "cellA" };
  var api = {
    setMode: function (m) { if (m === "series" || m === "parallel" || m === "single") setArr(m); },
    setLoad: setLoad,
    measure: measure,
    reset: reset,
    highlight: function (p) {
      if (!kit || !kit.highlight) return;
      if (!p) { kit.clearHighlight && kit.clearHighlight(); return; }
      kit.highlight(PART_ALIAS[p] || p);
    },
    rect: function (p) {
      if (!stage) return null;
      var o = kit;
      if (p && kit && kit.parts && kit.parts[PART_ALIAS[p] || p]) o = kit.parts[PART_ALIAS[p] || p];
      return stage.rectOf(o, 12);
    },
    reading: read,
    kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  applyToKit(); state.last = read(); paintReadout(); paintLine(); cardState(0, 0);
})();
