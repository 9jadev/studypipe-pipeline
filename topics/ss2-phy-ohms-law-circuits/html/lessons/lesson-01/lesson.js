/* Lesson 01 · interactions: Ohmic/non-ohmic sort (SortDnD), V–I results table (filled from the bench),
   wire-dimension explorer (#pos-explorer) and the thin-vs-thick jumper-cable bridge.
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Ohmic / non-ohmic sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#ohm-sort .bin"));
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
      var el = document.querySelector('#ohm-sort .sort-item[data-id="' + it.id + '"]');
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
    emit("l1:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. V–I results table (filled from the bench) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  function compShort(c) { return c === "lamp" ? "Filament lamp" : c === "copper" ? "Copper wire" : "Constantan wire"; }
  if (tbody) {
    document.addEventListener("l1:bench", function (e) {
      var d = e.detail || {};
      if (d.I == null) return;
      rcount++;
      var ratio = d.ratio == null ? "–" : d.ratio.toFixed(2);
      var tr = document.createElement("tr"); tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Reading"><b>' + rcount + "</b><span class=\"rc-sub\">" + compShort(d.comp) + "</span></td>" +
        '<td data-label="I / A">' + (d.I).toFixed(2) + "</td>" +
        '<td data-label="V / V">' + (+d.V).toFixed(2) + "</td>" +
        '<td data-label="V÷I / Ω">' + ratio + "</td>";
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1500);
      var sub = tr.querySelector(".rc-sub"); if (sub) sub.addEventListener("click", function () { tr.classList.toggle("open"); });
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Readings recorded: " + rcount;
    });
    document.addEventListener("l1:bench-reset", function () {
      tbody.innerHTML = ""; rcount = 0;
      var line = document.getElementById("results-line"); if (line) line.textContent = "Readings recorded: 0";
    });
  }

  // ============ 3. Wire-dimension explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var A = D.area(p.d), R = D.wireR(p.L, p.d);
      info.innerHTML = "<b>" + p.label + "</b> · L = " + p.L + " cm, d = " + p.d.toFixed(2) + " mm<br>" +
        "A = πd²/4 = <b>" + A.toExponential(2).replace("e", " × 10^").replace("^-", "⁻").replace("^", "") + " m²</b> · " +
        "R = ρL/A = <b>" + R.toFixed(2) + " Ω</b><br>" + p.note;
      if (!quiet) emit("l1:pin", { index: i, L: p.L, d: p.d });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = p.L + " cm<br>" + p.d.toFixed(2) + " mm";
      b.setAttribute("aria-label", p.label + ", length " + p.L + " cm, diameter " + p.d + " mm");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin, true);
  }

  // ============ 4. Bridge: thin vs thick jumper cable (3 reasoning steps) ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "ohm-bq";
      card.innerHTML = "<h4>Step " + (i + 1) + ". " + st.q + '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"), why = card.querySelector(".why");
      st.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text;
        b.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          card.setAttribute("data-done", "1");
          var ok = k === st.a; if (ok) correct++; answered++;
          Array.prototype.forEach.call(opts.children, function (x, j) { x.disabled = true; x.classList.toggle("correct", j === st.a); x.classList.toggle("incorrect", j === k && !ok); });
          why.textContent = (ok ? "Yes. " : "Not quite. ") + st.why; why.classList.add("on");
          if (ok) burst(b, 10);
          if (answered === D.bridge.length) finishBridge();
        });
        opts.appendChild(b);
      });
      bridgeRoot.appendChild(card);
    });
    function finishBridge() {
      verdict.innerHTML = "<strong>Case settled.</strong> The thin cable has 16 times the resistance of the thick one of the same length and metal, so at the same current it burns 16 times the power and runs hot. It is the thin wire, not a 'bad' one. You got " + correct + " of " + D.bridge.length + " first time.";
      verdict.classList.add("on"); burst(verdict, 24);
      var big = document.getElementById("big-idea"); if (big) big.classList.add("reveal", "in");
      emit("l1:bridge", { correct: correct === D.bridge.length, score: correct, total: D.bridge.length });
    }
    D.bridge.solve = function () { Array.prototype.forEach.call(bridgeRoot.children, function (card, i) { if (!card.getAttribute("data-done")) card.querySelectorAll(".opts button")[D.bridge[i].a].click(); }); };
    D.bridgeAnswer = function (step) { var card = bridgeRoot.children[step]; if (card && !card.getAttribute("data-done")) card.querySelectorAll(".opts button")[D.bridge[step].a].click(); };
  }
})();
