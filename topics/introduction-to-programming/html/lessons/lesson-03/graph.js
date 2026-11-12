/* ==========================================================
   StudyPipe — Lesson 03 Live Accumulator Graph (graph.js)
   Plots cumulative solar generation `total_kwh` (45, 97, 157, 215, 264, 327, 382 kWh)
   across days 1..7, and `range(1, 6)` sum (1, 3, 6, 10, 15) across steps 1..5.
   ========================================================== */
(function () {
  "use strict";
  var el = document.getElementById("graph-canvas");
  if (!el || !window.StudyGraph) return;

  var SERIES_META = {
    solar: { name: "7-Day Solar Total (kWh)", tone: "teal" },
    range5: { name: "range(1, 6) Sum", tone: "amber" }
  };

  var rec = { solar: {}, range5: {} };
  var active = "solar";
  var lastMarker = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Iteration / Day", unit: "step", min: 0, max: 7, step: 1 },
    y: { label: "Cumulative Total", unit: "kWh / sum", min: 0, max: 400, auto: true },
    aria: "Graph of cumulative accumulator total (vertical) against loop iteration step (horizontal)"
  });

  function pts(ds) {
    return Object.keys(rec[ds])
      .map(Number)
      .sort(function (a, b) { return a - b; })
      .map(function (k) { return rec[ds][k]; });
  }

  function count(ds) { return Object.keys(rec[ds]).length; }

  function paint() {
    var series = [];
    ["solar", "range5"].forEach(function (ds) {
      var p = pts(ds);
      if (!p.length && ds !== active) return;
      var s = {
        id: ds,
        name: SERIES_META[ds].name,
        tone: SERIES_META[ds].tone,
        points: [[0, 0]].concat(p),
        join: true
      };
      if (p.length >= 2) {
        var latest = p[p.length - 1];
        s.note = ds === "solar" ? ("Total = " + latest[1] + " kWh") : ("Sum = " + latest[1]);
      }
      series.push(s);
    });

    g.set({
      series: series,
      marker: lastMarker ? { x: lastMarker.x, y: lastMarker.y, label: lastMarker.label, tone: "amber" } : null
    });

    var totalPts = count("solar") + count("range5");
    var badge = document.getElementById("loop-graph-badge");
    if (badge) {
      badge.textContent = totalPts + (totalPts === 1 ? " step plotted" : " steps plotted");
      badge.classList.toggle("wait", !totalPts);
    }

    var note = document.getElementById("loop-graph-note");
    if (note) {
      if (!totalPts) {
        note.innerHTML = "Tap <b>Step iteration</b> on the bench above. Each iteration adds the current reading to the running accumulator and plots <code>(step, total)</code>.";
      } else if (active === "solar" && count("solar") >= 7) {
        note.innerHTML = "All 7 daily solar readings accumulated: <b>45 → 97 → 157 → 215 → 264 → 327 → 382 kWh</b> (average = <b>54.57 kWh/day</b>).";
      } else if (active === "range5" && count("range5") >= 5) {
        note.innerHTML = "<code>range(1, 6)</code> triangular accumulator curve complete: <b>1 → 3 → 6 → 10 → 15</b>, then the loop exits cleanly when <code>i = 6</code>.";
      } else {
        note.innerHTML = "Notice how the curve rises monotonically because <code>total += reading</code> adds each step's value onto the previous running sum.";
      }
    }
  }

  document.addEventListener("l03:bench", function (e) {
    var d = e.detail || {};
    var ds = d.dataset || "solar";
    if (ds === "infinite") {
      var note = document.getElementById("loop-graph-note");
      if (note) {
        note.innerHTML = d.watchdog
          ? "<b>Watchdog Emergency Interrupt!</b> In an infinite loop without increment, the program counter cycles endlessly until hardware protection halts it."
          : "Runaway <code>while count &lt; 5</code>: counter is stuck and accumulator never advances!";
      }
      return;
    }
    var step = d.stepIndex != null ? d.stepIndex : d.step;
    if (!step || step <= 0 || !rec[ds]) return;
    rec[ds][step] = [step, d.total];
    active = ds;
    lastMarker = {
      x: step,
      y: d.total,
      label: ds === "solar" ? (d.total + " kWh") : ("sum=" + d.total)
    };
    paint();
  });

  document.addEventListener("l03:bench-reset", function () {
    rec = { solar: {}, range5: {} };
    active = "solar";
    lastMarker = null;
    paint();
  });

  // Pre-seed Day 1 on boot so the canvas immediately shows live accumulator geometry, and clears/updates as user steps
  paint();
})();
