/* Lesson 04 · interactions: the "does it change the period?" sort, the angle explorer (#pos-explorer)
   and the Bridge (Tunde's test + the 6.2 cm pendulum). LessonKit (shared) runs Do Now, Wonder Wall,
   quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L04;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && window.StudyNarrator.burst && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Sort: does it change the period? ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#pd-sort .bin"));
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
      if (window.SortDnD) SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
      else b.addEventListener("click", function () { pick(b); });
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
      var el = document.querySelector('#pd-sort .sort-item[data-id="' + it.id + '"]');
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
    if (right >= 7) burst(document.getElementById("sort-score"), 20);
    emit("l4:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Angle explorer (#pos-explorer): sin θ vs θ and the true period increase ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var fmtPct = function (x) { return x < 1 ? x.toFixed(2) : x < 2 ? x.toFixed(2) : x.toFixed(1); };
    function show(i, quiet) {
      var deg = D.pins[i]; if (deg == null) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var s = D.smallAngle(deg), inc = D.periodIncrease(deg);
      var verdict = deg <= 10 ? "Small enough: the motion is SHM to well within stopwatch accuracy." : deg <= 20 ? "Borderline: the error is now a few tenths of a per cent in T." : "Too wide for the WAEC practical: the period is measurably longer.";
      info.innerHTML = "<b>θ = " + deg + "°</b> = " + s.rad.toFixed(4) + " rad · sin θ = " + s.sin.toFixed(4) + "<br>" +
        "sin θ is <b>" + fmtPct(s.diff) + " %</b> smaller than θ, so the true period is <b>" + fmtPct(inc) + " %</b> longer than 2π√(l/g).<br>" + verdict +
        '<div class="pos-bar" aria-hidden="true"><i style="width:' + Math.min(100, s.diff * 10).toFixed(0) + '%"></i></div>';
      if (!quiet) emit("l4:pin", { deg: deg, index: i, diff: s.diff, increase: inc });
    }
    D.pins.forEach(function (deg, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = deg + "°"; b.setAttribute("aria-label", "Release angle " + deg + " degrees");
      b.addEventListener("click", function () { show(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = show;
    show(1, true);
  }

  // ============ 3. The Bridge ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0, verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "pd-bq";
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
      var l = D.lengthFor(0.50, D.G), T = D.period(0.5, D.G, 10);
      verdict.innerHTML = "<strong>Verdict:</strong> mass doesn't set a pendulum's rhythm — 50 g and 100 g both give T = " + T.toFixed(2) + " s at 0.50 m. " +
        "And the okada's 0.50 s bounce is the swing of a <strong>" + (100 * l).toFixed(1) + " cm</strong> pendulum: l = gT²/4π² equals the static sag mg/k, because m/k = sag/g. " +
        "You got " + correct + " of " + D.bridge.length + " first time.";
      verdict.classList.add("on");
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
