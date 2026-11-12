/* ==========================================================
   Lesson 01 · Interactions (lesson.js)
   1. High-Level / Translator / Low-Level Sort (SortDnD)
   2. Memory & Type Allocation Results Table (filled from bench)
   3. Data Type & Operator Precedence Explorer (#pos-explorer)
   4. Bridge Challenge: Patching sensor_log.py (3 debugging steps)
   LessonKit (shared) runs Do Now, Wonder Wall, Quiz, Rubric & Locked Solutions.
   ========================================================== */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Programming Language & Translator Sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#prog-sort .bin"));
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
      SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
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
      var el = document.querySelector('#prog-sort .sort-item[data-id="' + it.id + '"]');
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
    if (sc) {
      sc.textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the explanations below.");
    }
    var fb = document.getElementById("sort-feedback");
    if (fb) {
      fb.innerHTML = rows.join("");
      fb.classList.add("on");
    }
    if (right >= 7 && sc) burst(sc, 20);
    emit("l01:sort", { correct: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    var chk = document.getElementById("sort-check");
    if (chk) chk.addEventListener("click", checkSort);
    var rst = document.getElementById("sort-reset");
    if (rst) rst.addEventListener("click", buildSort);
  }

  // ============ 2. Memory & Expression Results Table ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  if (tbody) {
    document.addEventListener("l01:bench", function (e) {
      var d = e.detail || {};
      rcount++;
      var tr = document.createElement("tr");
      tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Variable / Expr"><b>' + (d.varName || d.expr || ("Trial " + rcount)) + '</b><span class="rc-sub">' + (d.addr || "RAM") + "</span></td>" +
        '<td data-label="Type"><code>' + (d.type || d.resultType || "int") + "</code></td>" +
        '<td data-label="Value"><code>' + (d.rawVal || d.result || "–") + "</code></td>" +
        '<td data-label="Size / Status">' + (d.bytes ? (d.bytes + " B · ") : "") + (d.status || "OK") + "</td>";
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1500);
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Memory steps recorded: " + rcount;
    });

    document.addEventListener("l01:bench-reset", function () {
      tbody.innerHTML = "";
      rcount = 0;
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Memory steps recorded: 0";
    });
  }

  // ============ 3. Data Type & Operator Precedence Explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i];
      if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      if (info) {
        info.innerHTML =
          "<b>" + p.label + "</b> · Expression: <code>" + p.code + "</code><br>" +
          "Evaluated Result: <b>" + p.result + "</b> · Data Type: <code>" + p.type + "</code> · Memory: <b>" + p.bytes + "</b><br>" +
          p.note;
      }
      if (!quiet) emit("l01:pin", { index: i, code: p.code, type: p.type, result: p.result });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pos-pin";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = p.code + "<br><small>" + p.type + "</small>";
      b.setAttribute("aria-label", p.label + ": " + p.code);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b);
      pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin || 0, true);
  }

  // ============ 4. Bridge Challenge: Patching sensor_log.py (3 Steps) ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l1-bq";
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
          "<strong>Ikogosi Telemetry Restored!</strong> By renaming <code>2nd_panel_kw</code> to <code>panel_2_kw</code>, casting <code>int(panel_2_kw) + 20</code> to get <code>170</code>, and formatting output with <code>str(total_power)</code>, Amina and Tari cleared the TypeError and kept the solar inverter online. You got " +
          correct + " of " + D.bridge.length + " on your first try.";
        verdict.classList.add("on");
        burst(verdict, 24);
      }
      var big = document.getElementById("big-idea");
      if (big) big.classList.add("reveal", "in");
      emit("l01:bridge", { correct: correct === D.bridge.length, score: correct, total: D.bridge.length });
    }

    D.bridge.solve = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (!card.getAttribute("data-done")) {
          card.querySelectorAll(".opts button")[D.bridge[i].a].click();
        }
      });
    };
  }
})();
