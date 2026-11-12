/* Lesson 03 · interactions: "where does it happen?" sort (SortDnD), the Position Explorer (#pos-explorer)
   and the lift-off bridge. LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L03;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el && window.StudyNarrator.burst) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var M = window.ShmKinematics2D && window.ShmKinematics2D.model;
  var sf = window.ShmKinematics2D ? window.ShmKinematics2D.format.sf : function (v, n) { return Math.abs(v) < 1e-9 ? "0" : String(+v.toPrecision(n)).replace(/-/g, "−"); };

  // ---------------- 1. Sort: where does it happen? ----------------
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#shm-sort .bin"));
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
    var labels = {}; D.bins.forEach(function (b) { labels[b.id] = b.label; });
    D.items.forEach(function (it) {
      var el = document.querySelector('#shm-sort .sort-item[data-id="' + it.id + '"]');
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

  // ---------------- 2. Position Explorer (#pos-explorer): pins on the A = 0.30 m, T = 2.0 s circle ----------------
  var track = document.getElementById("pos-track");
  if (track) {
    var A = D.lab.A, T = D.lab.T;
    var info = document.getElementById("pos-info"), pinEls = [];
    var shm = function (deg) {
      var th = deg * Math.PI / 180;
      if (M) return M.shm(A, T, th);
      var w = 2 * Math.PI / T, x = A * Math.sin(th);
      return { w: w, x: x, v: w * A * Math.cos(th), a: -w * w * x };
    };
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var s = shm(p.deg);
      info.innerHTML = "<b>ωt = " + p.deg + "°</b> · x = <b>" + sf(s.x, 3) + " m</b> · v = <b>" + sf(s.v, 3) + " m/s</b> · a = <b>" + sf(s.a, 3) + " m/s²</b><br>" + p.note;
      if (!quiet) emit("l3:pin", { deg: p.deg, index: i, x: s.x, v: s.v, a: s.a });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.deg + "°";
      b.setAttribute("aria-label", "Phase angle " + p.deg + " degrees");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ---------------- 3. Bridge: do the crates fly, and where? ----------------
  var card = document.getElementById("bridge-card");
  if (card) {
    var ANS = { a3: "stay", a8: "lift", where: "top" };
    var pickd = {}, verdict = document.getElementById("bridge-verdict");
    var zoom = function () { return window.StudyScenes && window.StudyScenes.zoom; };
    Array.prototype.forEach.call(card.querySelectorAll("[data-try]"), function (b) {
      b.addEventListener("click", function () {
        var z = zoom(), cm = +b.getAttribute("data-try");
        var r = z && z.setA ? z.setA(cm) : null;
        var out = document.getElementById("bridge-try");
        var w = D.okada.w, amax = r ? r.a_max : w * w * cm / 100;
        if (out) out.innerHTML = "A = <b>" + cm + " cm</b> → a<sub>max</sub> = ω²A = <b>" + amax.toFixed(1) + " m/s²</b> " + (amax >= D.okada.g ? "&gt; g" : "&lt; g") + ". Look at the zoom above.";
      });
    });
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
      if (keys.some(function (k) { return !pickd[k]; })) { toast("Answer all three questions first."); return; }
      var all = true;
      keys.forEach(function (k) {
        var ok = pickd[k] === ANS[k]; if (!ok) all = false;
        Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + k + '"] button'), function (b) {
          b.classList.toggle("ok", b.getAttribute("data-v") === ANS[k]);
          b.classList.toggle("no", b.getAttribute("data-v") === pickd[k] && !ok);
        });
      });
      var w = D.okada.w, th = D.okada.g / (w * w) * 100;
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      verdict.innerHTML = all
        ? "<strong>Verdict:</strong> the crates fly at the <strong>top</strong> of the bounce, where the carrier's speed is zero but its downward acceleration ω²A is greatest — not where the bike moves fastest. Only gravity pulls the crate down; the carrier can only push up. So once ω²A &gt; g the carrier drops away faster than the crate can fall. At ω ≈ 12.6 rad/s that needs A ≥ g/ω² = <b>" + th.toFixed(1) + " cm</b>. Something on Ridge Road must be pumping the bounce that big."
        : "<strong>Not quite.</strong> At A = 3 cm, a_max = 4.7 m/s² is less than g, so the carrier never falls away faster than the crate. At 8 cm, a_max = 12.6 m/s² is more than g. The crate leaves at the top, where the carrier is still for an instant but accelerating downwards hardest. The green rings show the right answers.";
      if (all) burst(verdict, 24);
      emit("l3:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      pickd = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge = { pick: pickOpt, check: check };
  }
})();
