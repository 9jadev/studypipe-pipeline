/* ==========================================================
   StudyPipe — Lesson 05 Interactions (`lesson.js`)
   1. Function Anatomy Sort (`#fn-sort`, `SortDnD`, emits `l05:sort`)
   2. Function Factory Results Table (`#results-table`, listens `l05:bench`)
   3. One-Way Scope & Tariff Pin Explorer (`#pos-explorer`, emits `l05:pin`)
   4. Bridge Challenge: Refactor `billing.py` (`#bridge-steps`, emits `l05:bridge`)
   ========================================================== */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) {
    if (window.StudyNarrator && window.StudyNarrator.burst && el) {
      window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14);
    }
  };

  function naira(v) {
    return "₦" + Number(v || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ============ 1. Anatomy of a Function Sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#fn-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
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
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span><code>" + it.name + "</code>";
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
      var el = document.querySelector('#fn-sort .sort-item[data-id="' + it.id + '"]');
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
        "</span><b>" + it.emo + " <code>" + it.name + "</code></b><span>" +
        D.bins[it.bin] + ". " + it.why + "</span></div>"
      );
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    var sc = document.getElementById("sort-score");
    if (sc) {
      sc.textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    }
    var fb = document.getElementById("sort-feedback");
    if (fb) {
      fb.innerHTML = rows.join("");
      fb.classList.add("on");
    }
    if (right >= 6) burst(sc, 20);
    emit("l05:sort", { correct: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    var btnCheck = document.getElementById("sort-check");
    var btnReset = document.getElementById("sort-reset");
    if (btnCheck) btnCheck.addEventListener("click", checkSort);
    if (btnReset) btnReset.addEventListener("click", buildSort);
  }

  // ============ 2. Function Factory Results Table (#results-table) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  if (tbody) {
    document.addEventListener("l05:bench", function (e) {
      var d = e.detail || {};
      if (d.units == null) return;
      rcount++;
      var tr = document.createElement("tr");
      tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Call"><b>#' + rcount + '</b><span class="rc-sub"><code>calc_bill(' + d.units + ')</code></span></td>' +
        '<td data-label="Local Energy + VAT">' + naira(d.energy_cost) + ' + ' + naira(d.vat_amount) + '</td>' +
        '<td data-label="Return Value"><b>' + naira(d.total_bill) + '</b></td>' +
        '<td data-label="Global Scope">Safe (' + naira(d.global_revenue) + ')</td>';
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1500);
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Function calls recorded: " + rcount;
    });
    document.addEventListener("l05:bench-reset", function () {
      tbody.innerHTML = "";
      rcount = 0;
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Function calls recorded: 0";
    });
  }

  // ============ 3. One-Way Scope & Tariff Pin Explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info");
    var pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i];
      if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var c = D.calcBill(p.units);
      if (info) {
        info.innerHTML =
          "<b>" + p.label + "</b> · Call: <code>calculate_nepa_bill(" + p.units + ")</code><br>" +
          "Local frame: <code>energy_cost = " + naira(c.energy) + "</code> · <code>vat_amount = " + naira(c.vat) + "</code> · " +
          "Return value: <b>" + naira(c.total) + "</b><br>" + p.scopeNote;
      }
      if (!quiet) emit("l05:pin", { index: i, units: p.units, total: c.total });
    };
    D.pins.forEach(function (p, i) {
      var c = D.calcBill(p.units);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pos-pin";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = p.units + " kWh<br>" + naira(c.total);
      b.setAttribute("aria-label", p.label + ", " + p.units + " kWh, bill " + naira(c.total));
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b);
      pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin || 0, true);
  }

  // ============ 4. Bridge: Refactor billing.py (3 steps) ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l5-bq";
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
          why.textContent = (ok ? "Yes. " : "Not quite. ") + st.why;
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
          "<strong>Billing Engine Refactored!</strong> Replacing the 12 copy-pasted tariff blocks with a single <code>calculate_nepa_bill(units, tariff_rate=68.0, vat_rate=0.075)</code> function guarantees every household pays the exact 7.5% VAT rate (₦7,713.50 for 85 kWh; ₦16,851.00 for 210 kWh) while local stack-frame isolation protects the global revenue counter. You got " +
          correct + " of " + D.bridge.length + " first time.";
        verdict.classList.add("on");
        burst(verdict, 24);
      }
      var big = document.getElementById("big-idea");
      if (big) big.classList.add("reveal", "in");
      emit("l05:bridge", { correct: correct === D.bridge.length, score: correct, total: D.bridge.length });
    }
    D.bridge.solve = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (!card.getAttribute("data-done")) card.querySelectorAll(".opts button")[D.bridge[i].a].click();
      });
    };
  }
})();
