/* Lesson 03 · interactions: "series or parallel?" bin sort (SortDnD), the load explorer (#pos-explorer)
   and the advise-Emeka bridge. LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L03;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ---------------- 1. Sort: series or parallel behaviour? ----------------
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#net-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function buildSort() {
    if (!tray) return;
    tray.innerHTML = "";
    bins.forEach(function (b) { b.querySelector(".drop").innerHTML = ""; });
    document.getElementById("sort-feedback").classList.remove("on");
    document.getElementById("sort-score").textContent = "";
    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sort-item"; b.setAttribute("data-id", it.id);
      b.textContent = it.name;
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
    bin.addEventListener("click", function (e) { if (e.target.closest(".sort-item")) return; if (picked) place(picked, bin); });
    bin.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && picked) { e.preventDefault(); place(picked, bin); } });
  });
  function checkSort() {
    var placed = 0, right = 0, rows = [];
    var labels = {}; D.bins.forEach(function (b) { labels[b.id] = b.label; });
    D.items.forEach(function (it) {
      var el = document.querySelector('#net-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin"), chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin; if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.name + "</b><span>" + labels[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the notes below.");
    var fb = document.getElementById("sort-feedback"); fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 9) burst(document.getElementById("sort-score"), 20);
    emit("l3:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ---------------- 2. Load explorer (#pos-explorer) ----------------
  var track = document.getElementById("pos-track");
  if (track) {
    var E = D.cell.E, r = D.cell.r;
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var R = p.R, I = E / (R + r), P = I * I * R, eta = 100 * R / (R + r);
      info.innerHTML = "<b>R = " + R.toFixed(1) + " Ω</b> · I = <b>" + I.toFixed(2) + " A</b> · P = <b>" + P.toFixed(2) + " W</b> · η = <b>" + eta.toFixed(1) + " %</b><br>" + p.note;
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc && sc.highlight) sc.highlight("node");
      if (!quiet) emit("l3:pin", { R: R, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.R.toFixed(1) + " Ω";
      b.setAttribute("aria-label", "Load R = " + p.R.toFixed(1) + " ohm");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ---------------- 3. Advise-Emeka bridge ----------------
  var card = document.getElementById("bridge-card");
  if (card) {
    // three identical cells, 1.5 V, r = 2.0 Ω, on a 1.0 Ω pump
    var Ec = 1.5, rc = 2.0, n = 3, Rp = 1.0;
    var Ipar = (Ec) / (Rp + rc / n);                 // 1.5 / (1.0 + 0.667) = 0.90 A
    var Iser = (n * Ec) / (Rp + n * rc);             // 4.5 / (1.0 + 6.0) = 0.64 A
    var ANS = { arr: "parallel", cond: "less" };
    var pickd = {}, verdict = document.getElementById("bridge-verdict");
    var pickOpt = function (q, v) {
      pickd[q] = v;
      Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + q + '"] button'), function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === v)); b.classList.remove("ok", "no");
      });
    };
    Array.prototype.forEach.call(card.querySelectorAll(".bridge-q"), function (qEl) {
      var q = qEl.getAttribute("data-q");
      Array.prototype.forEach.call(qEl.querySelectorAll("button"), function (b) { b.addEventListener("click", function () { pickOpt(q, b.getAttribute("data-v")); }); });
    });
    var check = function () {
      var keys = Object.keys(ANS);
      if (keys.some(function (k) { return !pickd[k]; })) { toast("Answer both questions first."); return; }
      var all = true;
      keys.forEach(function (k) {
        var ok = pickd[k] === ANS[k]; if (!ok) all = false;
        Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + k + '"] button'), function (b) {
          b.classList.toggle("ok", b.getAttribute("data-v") === ANS[k]);
          b.classList.toggle("no", b.getAttribute("data-v") === pickd[k] && !ok);
        });
      });
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      verdict.innerHTML = all
        ? "<strong>Advise: parallel.</strong> Three identical 1.5 V, 2.0 Ω cells give parallel Eₜ = 1.5 V, rₜ = r/n = 0.667 Ω, so I = 1.5 ÷ (1.0 + 0.667) = <b>" + Ipar.toFixed(2) + " A</b>; in series Eₜ = 4.5 V, rₜ = 6.0 Ω, so I = 4.5 ÷ (1.0 + 6.0) = <b>" + Iser.toFixed(2) + " A</b>. Parallel wins because the pump's R (1.0 Ω) is <b>less than</b> one cell's r (2.0 Ω). (Parallel keeps Eₜ = E and rₜ = r/n only for <b>identical</b> cells.)"
        : "<strong>Not quite.</strong> For a low-resistance pump the internal resistance dominates. Parallel gives rₜ = r/n (less), so more current: 0.90 A against 0.64 A in series. Identical cells in parallel beat series exactly when R &lt; r. The green rings show the right answers.";
      if (all) burst(verdict, 24);
      emit("l3:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      pickd = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge = { pick: pickOpt, check: check, solve: function () { pickOpt("arr", "parallel"); pickOpt("cond", "less"); check(); } };
  }
})();
