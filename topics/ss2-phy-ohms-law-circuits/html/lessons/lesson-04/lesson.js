/* Lesson 04 · interactions: the "ammeter / voltmeter / galvanometer" sort, the meter-range
   explorer (#pos-explorer) and the "kit out Nkechi's coil" bridge. LessonKit (shared) runs
   Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L04;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Sort: ammeter / voltmeter / galvanometer truth ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#gv-sort .bin"));
  var picked = null;

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function buildSort() {
    if (!tray) return;
    tray.innerHTML = "";
    bins.forEach(function (b) { b.querySelector(".drop").innerHTML = ""; });
    document.getElementById("sort-feedback").classList.remove("on");
    document.getElementById("sort-score").textContent = "";
    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sort-item"; b.setAttribute("data-id", it.id);
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
    bin.addEventListener("click", function (e) { if (e.target.closest(".sort-item")) return; if (picked) place(picked, bin); });
    bin.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && picked) { e.preventDefault(); place(picked, bin); } });
  });
  function checkSort() {
    var placed = 0, right = 0, rows = [];
    D.items.forEach(function (it) {
      var el = document.querySelector('#gv-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback"); fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l4:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Meter-range explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    function show(i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var amm = p.mode === "ammeter";
      if (amm) {
        var Rs = D.shunt(p.target), Rm = D.rmeterA(p.target), pct = (p.target - D.IG) / p.target * 100;
        info.innerHTML = "<b>" + p.label + "</b> from the 15 mA, 18 Ω coil<br>" +
          "Shunt R<sub>s</sub> = I<sub>g</sub>R<sub>g</sub> ÷ (I − I<sub>g</sub>) = 0.270 ÷ " + D.sf3(p.target - D.IG) + " = <b>" + D.sf3(Rs) + " Ω</b> (in parallel).<br>" +
          "The shunt carries <b>" + pct.toFixed(1) + "%</b> of the line current; the whole ammeter's resistance is only <b>" + D.sf3(Rm) + " Ω</b>.";
      } else {
        var RmV = D.mult(p.target), Rt = D.rtotalV(p.target);
        info.innerHTML = "<b>" + p.label + "</b> from the same coil<br>" +
          "Whole meter R<sub>total</sub> = V ÷ I<sub>g</sub> = " + D.sf3(p.target) + " ÷ 0.015 = <b>" + D.sf3(Rt) + " Ω</b>.<br>" +
          "Multiplier R<sub>m</sub> = R<sub>total</sub> − R<sub>g</sub> = <b>" + D.sf3(RmV) + " Ω</b> (in series) — subtract R<sub>g</sub> to get the resistor you add.";
      }
      if (!quiet) emit("l4:pin", { mode: p.mode, target: p.target, index: i });
    }
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.label; b.setAttribute("aria-label", p.label + " from the 15 milliamp coil");
      b.addEventListener("click", function () { show(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = show;
    show(2, true);   // start on the 3 A ammeter
  }

  // ============ 3. The Bridge: kit out Nkechi's coil, two instruments ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0, verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "gv-bq";
      card.innerHTML = "<h4>Step " + (i + 1) + ". " + st.q + '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"), why = card.querySelector(".why");
      st.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text;
        b.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          card.setAttribute("data-done", "1");
          var ok = k === st.a; if (ok) correct++; answered++;
          Array.prototype.forEach.call(opts.children, function (x, j) {
            x.disabled = true; x.classList.toggle("correct", j === st.a); x.classList.toggle("incorrect", j === k && !ok);
          });
          why.textContent = (ok ? "Yes. " : "Not quite. ") + st.why; why.classList.add("on");
          if (ok) burst(b, 10);
          if (answered === D.bridge.length) finishBridge();
        });
        opts.appendChild(b);
      });
      bridgeRoot.appendChild(card);
    });
    function finishBridge() {
      verdict.innerHTML = "<strong>Both instruments ready.</strong> The same 15 mA, 18 Ω coil becomes a 3.0 A ammeter with a 0.0905 Ω shunt in parallel (goes in series with the line), and a 40 V voltmeter with a 2 650 Ω multiplier in series (goes in parallel across the bank). One movement, two safe meters. You got " + correct + " of " + D.bridge.length + " first time.";
      verdict.classList.add("on"); verdict.classList.toggle("bad", correct < D.bridge.length);
      burst(verdict, 24);
      emit("l4:bridge", { correct: correct, total: D.bridge.length });
    }
    D.solveBridge = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (card.getAttribute("data-done")) return;
        var btns = card.querySelectorAll(".opts button"); if (btns[D.bridge[i].a]) btns[D.bridge[i].a].click();
      });
    };
  }
})();
