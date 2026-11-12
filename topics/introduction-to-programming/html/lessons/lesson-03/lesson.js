/* ==========================================================
   StudyPipe — Lesson 03 Interactions (lesson.js)
   1. FOR vs WHILE Sort Game (SortDnD)
   2. Iterative Loop Stepper Results Table (#results-table)
   3. Loop Range & Syntax Explorer (#pos-explorer)
   4. Bridge Challenge: Repairing solar_monitor.py (#bridge-steps)
   LessonKit (shared) runs Do Now, Wonder Wall, Quiz, Reflect & Locked Solutions.
   ========================================================== */
(function () {
  "use strict";
  var D = window.L03;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. FOR vs WHILE Sort Game (SortDnD) ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#loop-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildSort() {
    if (!tray) return;
    tray.innerHTML = "";
    bins.forEach(function (b) { b.querySelector(".drop").innerHTML = ""; });
    var fb = document.getElementById("sort-feedback");
    if (fb) fb.classList.remove("on");
    var sc = document.getElementById("sort-score");
    if (sc) sc.textContent = "";

    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sort-item";
      b.setAttribute("data-id", it.id);
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span>" + it.name;
      if (window.SortDnD && SortDnD.attach) {
        SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
      }
      tray.appendChild(b);
    });
  }

  function pick(b) {
    if (picked) picked.classList.remove("picked");
    picked = picked === b ? null : b;
    if (picked) picked.classList.add("picked");
    bins.forEach(function (bn) { bn.classList.toggle("ready", !!picked); });
  }

  function place(b, bin) {
    b.classList.remove("picked", "right", "wrong");
    bin.querySelector(".drop").appendChild(b);
    picked = null;
    bins.forEach(function (bn) { bn.classList.remove("ready", "over"); });
  }

  bins.forEach(function (bin) {
    bin.addEventListener("click", function (e) {
      if (e.target.closest(".sort-item")) return;
      if (picked) place(picked, bin);
    });
    bin.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && picked) {
        e.preventDefault();
        place(picked, bin);
      }
    });
  });

  function checkSort() {
    var placed = 0, right = 0, rows = [];
    D.items.forEach(function (it) {
      var el = document.querySelector('#loop-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) {
        el.classList.toggle("right", ok);
        el.classList.toggle("wrong", !!chosen && !ok);
      }
      rows.push(
        '<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") +
        "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>"
      );
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    var sc = document.getElementById("sort-score");
    if (sc) sc.textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the explanations below.");
    var fb = document.getElementById("sort-feedback");
    if (fb) { fb.innerHTML = rows.join(""); fb.classList.add("on"); }
    if (right >= 7 && sc) burst(sc, 20);
    emit("l03:sort", { correct: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    var btnCheck = document.getElementById("sort-check");
    var btnReset = document.getElementById("sort-reset");
    if (btnCheck) btnCheck.addEventListener("click", checkSort);
    if (btnReset) btnReset.addEventListener("click", buildSort);
  }

  // ============ 2. Results Table (filled from #bench-stage) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;

  function dsShort(ds) {
    if (ds === "range5") return "range(1, 6)";
    if (ds === "infinite") return "while < 5";
    return "solar [7d]";
  }

  if (tbody) {
    document.addEventListener("l03:bench", function (e) {
      var d = e.detail || {};
      rcount++;
      var ds = d.dataset || "solar";
      var unit = ds === "solar" ? " kWh" : "";
      var stepNum = d.stepIndex != null ? d.stepIndex : rcount;
      var iVal = ds === "infinite" ? "count=1" : ("i=" + (d.i != null ? d.i : 0) + (ds === "solar" ? " (+" + d.currentVal + ")" : " (+" + d.currentVal + ")"));
      var accumVal = ds === "infinite" ? "0 (stuck)" : (d.total + unit);
      var condVal = d.watchdog ? "WATCHDOG HALT" : (d.terminated ? "False (Exit)" : "True (Loop)");

      var tr = document.createElement("tr");
      tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Step"><b>#' + stepNum + '</b><span class="rc-sub">' + dsShort(ds) + "</span></td>" +
        '<td data-label="Counter">' + iVal + "</td>" +
        '<td data-label="Accumulator">' + accumVal + "</td>" +
        '<td data-label="Condition">' + condVal + "</td>";
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1400);
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Iterations recorded: " + rcount;

      // Update method card highlights
      var m1 = document.getElementById("m1"), m2 = document.getElementById("m2"), m3 = document.getElementById("m3"), m4 = document.getElementById("m4");
      if (m1 && m2 && m3 && m4) {
        if (rcount >= 1) { m1.classList.add("done"); m1.classList.remove("now"); m2.classList.add("now"); }
        if (rcount >= 5) { m2.classList.add("done"); m2.classList.remove("now"); m3.classList.add("now"); }
        if (d.watchdog) { m3.classList.add("done"); m3.classList.remove("now"); m4.classList.add("done", "now"); }
      }
    });

    document.addEventListener("l03:bench-reset", function () {
      tbody.innerHTML = "";
      rcount = 0;
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Iterations recorded: 0";
    });
  }

  // ============ 3. Loop Range & Syntax Explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info");
    var pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i];
      if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      if (info) {
        info.innerHTML =
          "<b>" + p.label + "</b> · Python: <code>" + p.code + "</code> &nbsp;|&nbsp; BASIC: <code>" + p.basic + "</code><br>" +
          "Sequence generated: <b>[" + p.seq + "]</b> · Iterations: <b>" + p.iters + "</b> · Accumulator sum: <b>" + p.sum + "</b><br>" +
          p.note;
      }
      if (!quiet) emit("l03:pin", { index: i, label: p.label });
    };

    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pos-pin";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = p.label + "<br><small>" + p.iters + " steps · Σ=" + p.sum + "</small>";
      b.setAttribute("aria-label", p.label + ", " + p.iters + " iterations, sum " + p.sum);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b);
      pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin || 0, true);
  }

  // ============ 4. Bridge Challenge: Repairing solar_monitor.py ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l3-bq";
      card.innerHTML = "<h4>Step " + (i + 1) + ". " + st.q + '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"), why = card.querySelector(".why");
      st.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = text;
        b.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          card.setAttribute("data-done", "1");
          var ok = k === st.a;
          if (ok) correct++;
          answered++;
          Array.prototype.forEach.call(opts.children, function (x, j) {
            x.disabled = true;
            x.classList.toggle("correct", j === st.a);
            x.classList.toggle("incorrect", j === k && !ok);
          });
          why.textContent = (ok ? "Correct! " : "Not quite. ") + st.why;
          why.classList.add("on");
          if (ok) burst(b, 10);
          if (answered === D.bridge.length) finishBridge();
        });
        opts.appendChild(b);
      });
      bridgeRoot.appendChild(card);
    });

    function finishBridge() {
      if (verdict) {
        verdict.innerHTML =
          "<strong>Ikogosi Solar Monitor Repaired!</strong> Replacing the runaway <code>while solar_output &gt; 0:</code> loop with a bounded <code>for reading in daily_readings:</code> accumulator safely sums all 7 logs (<b>total_kwh = 382 kWh</b>, <b>average_kwh = 54.57 kWh</b>) and exits cleanly at 24% CPU. You got " +
          correct + " of " + D.bridge.length + " on the first try.";
        verdict.classList.add("on");
        burst(verdict, 24);
      }
      var big = document.getElementById("big-idea");
      if (big) big.classList.add("reveal", "in");
      emit("l03:bridge", { correct: correct === D.bridge.length, score: correct, total: D.bridge.length });
    }

    D.bridge.solve = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (!card.getAttribute("data-done")) card.querySelectorAll(".opts button")[D.bridge[i].a].click();
      });
    };
  }
})();
