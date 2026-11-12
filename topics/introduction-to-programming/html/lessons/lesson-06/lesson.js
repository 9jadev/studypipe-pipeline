/* ==========================================================
   StudyPipe — Lesson 06 Controller
   1. Bug Taxonomy Sort (SortDnD)
   2. WAEC Dry-Run Trace & Recovery Table (#results-table)
   3. Hexadecimal & Binary Status Byte Explorer (#pos-explorer)
   4. Master Reboot Bridge Challenge (#bridge-steps)
   ========================================================== */
(function () {
  "use strict";
  var D = window.L06;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Bug Taxonomy Sort (Syntax, Run-Time, Logic) ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#bug-sort .bin"));
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
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + '</span><span class="sort-lbl">' + it.name + "</span>";
      if (window.SortDnD) SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
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
      var el = document.querySelector('#bug-sort .sort-item[data-id="' + it.id + '"]');
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
      toast("Place all " + D.items.length + " bug cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    var sc = document.getElementById("sort-score");
    if (sc) sc.textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    if (fb) { fb.innerHTML = rows.join(""); fb.classList.add("on"); }
    if (right >= 8 && sc) burst(sc, 20);
    emit("l06:sort", { correct: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    var chk = document.getElementById("sort-check");
    if (chk) chk.addEventListener("click", checkSort);
    var rst = document.getElementById("sort-reset");
    if (rst) rst.addEventListener("click", buildSort);
  }

  // ============ 2. WAEC Dry-Run Trace Table (#results-table) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  if (tbody) {
    document.addEventListener("l06:bench", function (e) {
      var d = e.detail || {};
      if (d.step == null) return;
      rcount++;
      var tr = document.createElement("tr");
      tr.className = "fresh";
      var condTxt = d.val + " % 2 == 0 → " + (d.isEven ? "True" : "False");
      var stateTxt = d.contactorClosed
        ? "0x7E · ONLINE"
        : (d.isEven ? "Added (" + d.hex + ")" : "Skipped (" + d.hex + ")");
      tr.innerHTML =
        '<td data-label="Step"><b>#' + d.step + '</b><span class="rc-sub">i = ' + d.i + " · v = " + d.val + "</span></td>" +
        '<td data-label="Condition"><code>' + condTxt + "</code></td>" +
        '<td data-label="sum_even"><b>' + d.total + "</b> (cnt " + d.count + ")</td>" +
        '<td data-label="State">' + stateTxt + "</td>";
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1500);
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Trace rows recorded: " + rcount + " (target: 4 steps on [14, 7, 22, 9] with 0x7E)";
    });
    document.addEventListener("l06:bench-reset", function () {
      tbody.innerHTML = "";
      rcount = 0;
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Trace rows recorded: 0";
    });
  }

  // ============ 3. Hexadecimal & Binary Status Byte Explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i];
      if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      if (info) {
        info.innerHTML =
          "<b>" + p.hex + " · " + p.label + "</b><br>" +
          "Upper nibble: <code>" + p.hiHex + "₁₆ = " + p.hiBin + "₂ (" + p.hiDec + ")</code> · " +
          "Lower nibble: <code>" + p.loHex + "₁₆ = " + p.loBin + "₂ (" + p.loDec + ")</code><br>" +
          "8-bit binary: <b>" + p.bin.slice(0, 4) + " " + p.bin.slice(4) + "₂</b> · " +
          "Decimal: <b>(" + p.hiDec + " × 16) + " + p.loDec + " = " + p.byteVal + "₁₀</b> (" + p.weights + ")<br>" +
          p.note;
      }
      if (!quiet) emit("l06:pin", { index: i, hex: p.hex, byteVal: p.byteVal });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pos-pin";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = p.hex + "<br>" + p.bin;
      b.setAttribute("aria-label", p.hex + " (" + p.byteVal + "), binary " + p.bin);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b);
      pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin || 0, true);
  }

  // ============ 4. Bridge: Final Master Reboot Verification (#bridge-steps) ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "prog-bq";
      card.innerHTML = "<h4>" + st.q + '</h4><div class="opts"></div><p class="why"></p>';
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
          why.textContent = (ok ? "Yes! " : "Not quite. ") + st.why;
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
          "<strong>Ikogosi Smart Solar Microgrid Fully Restored!</strong> Master parity register <code>0x7E = 01111110₂ = 126₁₀</code> is authenticated, the dry-run filter confirmed <code>sum_even = 36</code> (<code>count = 2</code>), and all 5 software modules are running cleanly at 50.0 Hz. You got " +
          correct + " of " + D.bridge.length + " on the first try.";
        verdict.classList.add("on");
        burst(verdict, 24);
      }
      var big = document.getElementById("big-idea");
      if (big) big.classList.add("reveal", "in");
      emit("l06:bridge", { correct: correct === D.bridge.length, score: correct, total: D.bridge.length });
    }

    D.bridge.solve = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (!card.getAttribute("data-done")) card.querySelectorAll(".opts button")[D.bridge[i].a].click();
      });
    };
  }

  // ============ 5. Hydrate .sp-math[data-latex] containers via StudyMath ============
  function renderDeferredMath() {
    if (!window.StudyMath || !StudyMath.tex) return;
    document.querySelectorAll(".sp-math[data-latex]").forEach(function (el) {
      if (el.children.length || el.textContent.trim()) return;
      var tex = el.getAttribute("data-latex");
      if (!tex) return;
      el.outerHTML = StudyMath.tex(tex, el.tagName === "DIV");
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderDeferredMath);
  } else {
    renderDeferredMath();
  }
  window.addEventListener("load", renderDeferredMath);
})();
