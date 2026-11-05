/* Lesson 03 · Live graph — load power P and efficiency η against load resistance R
   for the cell arrays on the bench (cells 2.0 V, 1.5 Ω each):
     3 in series   E = 6.0 V, r = 4.5 Ω     3 in parallel   E = 2.0 V, r = 0.5 Ω     1 cell  E = 2.0 V, r = 1.5 Ω
   P = E²R/(R + r)²  (peaks at R = r, P_max = E²/4r)      η = R/(R + r)  (50 % at R = r)
   Logged readings (bench "Log reading") become dots; the violet marker follows the bench live.
   Resistor-network trials (T1–T3, accumulator / battery supply) are summarised in the stats + note. */
(function () {
  "use strict";
  var el = document.getElementById("pr-graph");
  if (!el || !window.StudyGraph) return;

  var ARR = {
    series3:   { E: 6.0, r: 4.5, name: "3 in series: 6.0 V, r 4.5 Ω",   tone: "crimson" },
    parallel3: { E: 2.0, r: 0.5, name: "3 in parallel: 2.0 V, r 0.5 Ω", tone: "teal" },
    single:    { E: 2.0, r: 1.5, name: "1 cell: 2.0 V, r 1.5 Ω",         tone: "sky", dashed: true }
  };
  function P(a, R) { return a.E * a.E * R / ((R + a.r) * (R + a.r)); }
  function eff(a, R) { return 100 * R / (R + a.r); }
  function pmax(a) { return a.E * a.E / (4 * a.r); }

  var rec = { series3: {}, parallel3: {}, single: {} };
  var tab = "P", live = null, last = null, nLogged = 0;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Load resistance R", unit: "Ω", min: 0, max: 6, step: 1 },
    y: { label: "Load power P", unit: "W", min: 0, max: 2.5, step: 0.5 },
    aria: "Graph of load power against load resistance for series and parallel cell arrays"
  });

  function isCell(m) { return !!ARR[m]; }
  function f2(v) { return v.toFixed(2); }
  function ohm(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? v.toFixed(1) : v.toFixed(2); }
  function yOf(a, R) { return tab === "P" ? P(a, R) : eff(a, R); }
  function pts(m) {
    return Object.keys(rec[m]).map(function (k) { return rec[m][k]; })
      .sort(function (p, q) { return p.R - q.R; })
      .map(function (d) { return [d.R, tab === "P" ? +d.P.toFixed(4) : +d.eff.toFixed(2)]; });
  }
  function count(m) { return Object.keys(rec[m]).length; }
  function has(m, R) { return !!rec[m][R.toFixed(2)]; }

  function paint() {
    var showSingle = count("single") > 0 || (live && live.cellArray === "single");
    var maxR = 6;
    Object.keys(rec).forEach(function (m) { Object.keys(rec[m]).forEach(function (k) { maxR = Math.max(maxR, rec[m][k].R); }); });
    if (live && isCell(live.cellArray)) maxR = Math.max(maxR, live.R);
    var xMax = maxR <= 6 ? 6 : Math.min(30, Math.ceil(maxR / 5) * 5);

    var series = [];
    ["series3", "parallel3", "single"].forEach(function (m) {
      if (m === "single" && !showSingle) return;
      var a = ARR[m], n = count(m);
      series.push({
        id: m, name: a.name, tone: a.tone, dashed: !!a.dashed,
        fn: function (R) { return yOf(a, R); }, fnRange: [0, xMax],
        points: pts(m), note: n ? n + " logged" : ""
      });
    });
    // maximum-power points R = r
    var peaks = [[ARR.parallel3.r], [ARR.series3.r]];
    if (showSingle) peaks.push([ARR.single.r]);
    series.push({
      id: "peak", tone: "amber", shape: "square",
      name: tab === "P" ? "R = r: maximum power E²/4r" : "R = r: η = 50 % at maximum power",
      points: peaks.map(function (p) { return [p[0], tab === "P" ? 2.0 : 50]; })
    });
    if (showSingle && tab === "P") series[series.length - 1].points[2][1] = +pmax(ARR.single).toFixed(4);

    var guides = [
      { axis: "x", value: ARR.parallel3.r, tone: "teal" },
      { axis: "x", value: ARR.series3.r, tone: "crimson" },
      { axis: "y", value: tab === "P" ? 2.0 : 50, tone: "amber" }
    ];

    var marker = null;
    if (live && isCell(live.cellArray) && live.closed) {
      marker = { x: live.R, y: tab === "P" ? live.P : live.eff, tone: "violet",
        label: (live.trial ? live.trial.toUpperCase() + " · " : "Now · ") + (tab === "P" ? f2(live.P) + " W" : live.eff.toFixed(1) + " %") };
    }

    g.set({
      x: { max: xMax, step: xMax <= 6 ? 1 : (xMax <= 10 ? 2 : 5) },
      y: tab === "P"
        ? { label: "Load power P", unit: "W", min: 0, max: 2.5, step: 0.5 }
        : { label: "Efficiency η", unit: "%", min: 0, max: 100, step: 20 },
      aria: tab === "P" ? "Graph of load power P against load resistance R for series and parallel cell arrays"
        : "Graph of efficiency against load resistance R for series and parallel cell arrays",
      series: series, guides: guides, marker: marker
    });

    var title = document.getElementById("pr-title");
    if (title) title.textContent = tab === "P" ? "Load power P against load resistance R" : "Efficiency η against load resistance R";
    var badge = document.getElementById("pr-badge");
    if (badge) { badge.textContent = nLogged + " logged"; badge.classList.toggle("wait", !nLogged); }
    paintStats();
    paintNote();
  }

  function stat(k, v) { return '<div class="gc-stat"><span>' + k + "</span><b>" + v + "</b></div>"; }
  function paintStats() {
    var box = document.getElementById("pr-stats");
    if (!box || !live) return;
    var d = live, h = "";
    if (isCell(d.cellArray)) {
      var a = ARR[d.cellArray];
      h += stat("E, r", a.E.toFixed(1) + " V, " + ohm(a.r) + " Ω");
      h += stat("P here", d.closed ? f2(d.P) + " W" : "key open");
      h += stat("η here", d.closed ? d.eff.toFixed(1) + " %" : "—");
      h += stat("P_max at R = r", f2(pmax(a)) + " W");
    } else {
      h += stat("R_eq", ohm(d.R) + " Ω");
      h += stat("Main I", f2(d.I) + " A");
      h += stat(d.topology === "series" || d.topology === "load" ? "Same I everywhere" : "Split I₁ : I₂",
        d.topology === "series" || d.topology === "load" ? f2(d.I) + " A" : f2(d.I1) + " : " + f2(d.I2) + " A");
      h += stat("Load P", (d.P >= 10 ? d.P.toFixed(1) : f2(d.P)) + " W");
    }
    box.innerHTML = h;
  }

  function paintNote() {
    var note = document.getElementById("pr-note");
    if (!note) return;
    var msg, d = live || {};
    var both15 = has("series3", 1.5) && has("parallel3", 1.5);
    if (d.cellArray && !isCell(d.cellArray)) {
      if (d.trial === "t1") msg = "<b>T1:</b> one path, so the same current flows through both resistors. R_eq = 4 + 12 = <b>16 Ω</b>, I = 12 ÷ 16 = 0.75 A, P = I²R = 0.75² × 16 = <b>9.0 W</b>. The accumulator's r ≈ 0, so η ≈ 100 %.";
      else if (d.trial === "t2") msg = "<b>T2:</b> R_eq = (4 × 12) ÷ (4 + 12) = <b>3.0 Ω</b>, smaller than either resistor. I = 12 ÷ 3 = 4.0 A splits <b>3.0 A : 1.0 A</b>: the smaller resistor takes the larger current. P = 4.0² × 3.0 = <b>48 W</b>.";
      else if (d.trial === "t3") msg = "<b>T3:</b> reduce the parallel pair first (3.0 Ω), then add 3 Ω: R = <b>6.0 Ω</b>. I = 14 ÷ (6 + 1) = 2.0 A, of which the 4 Ω branch takes 1.5 A. P = 2.0² × 6 = <b>24 W</b>, η = 6 ÷ 7 = <b>85.7 %</b>.";
      else msg = "The resistor-network trials (T1–T3) run on an accumulator or battery, so they are summarised in the boxes above rather than on the cell curves. Pick a cell array to see P and η against R.";
    } else if (!nLogged) {
      msg = tab === "P"
        ? "Both curves peak at the <b>same P_max = E²/4r = 2.0 W</b> (6² ÷ (4 × 4.5) = 2² ÷ (4 × 0.5)), but at different loads: <b>R = r</b> = 4.5 Ω for series cells and 0.5 Ω for parallel cells. The curves cross at R = 1.5 Ω: below that, parallel cells give more power. Tap <b>T4–T6</b> and <b>Log reading</b> to put your results on the curves."
        : "η = R ÷ (R + r) climbs towards 100 % as R grows. It is exactly <b>50 % at R = r</b>, the maximum-power point. At any load, the parallel array (smaller r) is more efficient.";
    } else if ((last === "t4" || last === "t5") && both15) {
      msg = tab === "P"
        ? "At R = 1.5 Ω both arrays deliver the <b>same 1.50 W</b> (I = 1.00 A in each). But the series cells waste I²r = 1.00² × 4.5 = <b>4.50 W</b> inside themselves, while the parallel cells waste only <b>0.50 W</b>. (1.5 Ω is exactly where the two curves cross.)"
        : "Same load, same 1.50 W, yet η = 1.5 ÷ (1.5 + 4.5) = <b>25 %</b> for series cells against 1.5 ÷ (1.5 + 0.5) = <b>75 %</b> for parallel cells. Smaller r means less energy lost as heat inside the cells.";
    } else if (last === "t4") {
      msg = "<b>T4 logged:</b> series cells on 1.5 Ω give 1.50 W at η = 25 %, because R (1.5 Ω) is well below r (4.5 Ω). Now log <b>T5</b>: the same cells in parallel on the same load.";
    } else if (last === "t5") {
      msg = "<b>T5 logged:</b> parallel cells on 1.5 Ω give 1.50 W at η = 75 %, because R (1.5 Ω) is above r (0.5 Ω). Now log <b>T4</b> to compare with series cells.";
    } else if (last === "t6") {
      msg = tab === "P"
        ? "<b>T6:</b> the 0.3 Ω starter gets I = 2.0 ÷ (0.3 + 0.5) = <b>2.50 A</b> and P = <b>1.88 W</b> from parallel cells. Series cells would give only 1.25 A and 0.47 W. But R &lt; r, so η is just 37.5 %."
        : "<b>T6:</b> R = 0.3 Ω is below r = 0.5 Ω, so the point sits under the 50 % line: η = 0.3 ÷ 0.8 = <b>37.5 %</b>. Parallel cells suit heavy loads, but much of the energy is still lost inside them.";
    } else if (last && last.R != null) {
      var a = ARR[last.arr], rel = Math.abs(last.R - a.r) < 1e-6 ? "R = r: this is the maximum-power point, P = " + f2(pmax(a)) + " W, and η is only 50 %."
        : last.R < a.r ? "R is below r, so η is under 50 % and P is below its maximum."
        : "R is above r: P is below its maximum but η is over 50 %.";
      msg = "Your reading: R = " + ohm(last.R) + " Ω, P = " + f2(last.P) + " W, η = " + last.eff.toFixed(1) + " %. " + rel;
    } else {
      msg = "Keep logging. Every reading lands exactly on its theory curve, because P = E²R ÷ (R + r)².";
    }
    note.innerHTML = msg;
  }

  document.addEventListener("l3:bench-live", function (e) { live = e.detail || null; paint(); });
  document.addEventListener("l3:bench", function (e) {
    var d = e.detail || {};
    if (!d.closed) return;
    nLogged++;
    if (isCell(d.cellArray)) {
      rec[d.cellArray][d.R.toFixed(2)] = { R: d.R, P: d.P, eff: d.eff };
      last = d.trial || { arr: d.cellArray, R: d.R, P: d.P, eff: d.eff };
    } else {
      last = d.trial || null;
    }
    paint();
  });

  document.querySelectorAll("[data-prtab]").forEach(function (b) {
    b.addEventListener("click", function () {
      tab = b.getAttribute("data-prtab");
      document.querySelectorAll("[data-prtab]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      paint();
    });
  });

  // pick up the bench's state if it computed before this script loaded
  var b = window.StudyScenes && window.StudyScenes.bench;
  if (b && b.state) {
    var s = b.state();
    live = { trial: s.trial, cellArray: s.cellArray, topology: s.topology, closed: s.switchClosed, E: s.E_eq, r: s.r_eq,
      R: s.R_eq, I: s.I_main, I1: s.I1, I2: s.I2, V: s.V_term, P: s.P_load, Plost: s.P_lost, eff: s.eff };
  }
  paint();
})();
