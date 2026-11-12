/* Lesson 02 · interactions: "Is it simple harmonic?" sort (SortDnD), the position explorer (#pos-explorer: mass pins on
   the 24.5 N m⁻¹ spring + the okada at 200 / 250 kg, numbers from MassSpringKit.model) and the okada bridge.
   LessonKit (loaded earlier) runs Do Now, Wonder Wall, quiz, rating, recall and locked solutions. */
(function () {
  "use strict";
  var D = window.L02;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && window.StudyNarrator.burst && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var TAU = 2 * Math.PI, G = 9.8;
  var M = window.MassSpringKit ? window.MassSpringKit.model : null;
  var K_OKADA = M ? M.STORY.kOkada : 4 * Math.PI * Math.PI * 4 * 200;   // 2.00 Hz at 200 kg (labels: 3.16 × 10⁴ N m⁻¹)

  // recall box (built by LessonKit) goes into #recall-box
  var rb = document.getElementById("recall-box"), rc = document.querySelector("#reflect .aq.recall");
  if (rb && rc) rb.appendChild(rc);

  // ============ 1. Sort (SortDnD bins) ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#shm-sort .bin"));
  var picked = null;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function buildSort() {
    if (!tray) return;
    tray.innerHTML = "";
    bins.forEach(function (b) { b.querySelector(".drop").innerHTML = ""; });
    var fb = document.getElementById("sort-feedback"); if (fb) { fb.classList.remove("on"); fb.innerHTML = ""; }
    var sc = document.getElementById("sort-score"); if (sc) sc.textContent = "";
    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sort-item"; b.setAttribute("data-id", it.id);
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span>" + it.name;
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
    var placed = 0, right = 0, out = [];
    D.items.forEach(function (it) {
      var el = document.querySelector('#shm-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin"), chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin; if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      out.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". Read the reasons below.");
    var fb = document.getElementById("sort-feedback"); fb.innerHTML = out.join(""); fb.classList.add("on");
    if (right >= 9) burst(document.getElementById("sort-score"), 20);
    emit("l2:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Position explorer (#pos-explorer) ============
  function solve(p) {
    if (p.kind === "okada") {
      var w = Math.sqrt(K_OKADA / p.m), T = TAU / w;
      return { kind: "okada", m: p.m, k: K_OKADA, x_cm: p.m * G / K_OKADA * 100, T: T, f: 1 / T, T2: T * T, t20: 20 * T };
    }
    var s = M ? M.spring(p.m, D.k, G) : (function () { var ww = Math.sqrt(D.k / p.m), TT = TAU / ww; return { T: TT, f: 1 / TT, T2: TT * TT, x0: p.m * G / D.k }; })();
    return { kind: "lab", m: p.m, k: D.k, x_cm: s.x0 * 100, T: s.T, f: s.f, T2: s.T2, t20: 20 * s.T };
  }
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var setBar = function (id, frac, txt) {
      var el = document.getElementById(id); if (el) el.style.setProperty("--w", Math.max(0, Math.min(100, frac * 100)) + "%");
      var b = document.querySelector('#pos-bars [data-b="' + id + '"]'); if (b) b.textContent = txt;
    };
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var r = solve(p);
      if (r.kind === "lab") {
        info.innerHTML = "<b>" + Math.round(p.m * 1000) + " g</b> on the k = 24.5 N m⁻¹ spring: extension <b>" + r.x_cm.toFixed(1) + " cm</b>, " +
          "T = 2π√(m/k) = <b>" + r.T.toFixed(3) + " s</b>, f = <b>" + r.f.toFixed(2) + " Hz</b>, T² = <b>" + r.T2.toPrecision(3) + " s²</b>.";
      } else {
        info.innerHTML = "<b>Okada, " + p.m + " kg</b> on k = 3.16 × 10⁴ N m⁻¹ (model): sag <b>" + r.x_cm.toFixed(1) + " cm</b>, " +
          "T₀ = <b>" + r.T.toFixed(2) + " s</b>, f₀ = <b>" + r.f.toFixed(2) + " Hz</b>, 20 bounces in <b>" + r.t20.toFixed(1) + " s</b>. Heavier means slower, not steadier.";
      }
      var bars = document.getElementById("pos-bars"); if (bars) bars.setAttribute("aria-hidden", "false");
      var maxT = r.kind === "lab" ? 0.70 : 0.60, maxF = r.kind === "lab" ? 3.6 : 2.5;
      setBar("pb-T", r.T / maxT, r.T.toFixed(r.kind === "lab" ? 3 : 2) + " s");
      setBar("pb-f", r.f / maxF, r.f.toFixed(2) + " Hz");
      emit("l2:pin", { key: p.key, m: p.m, T: r.T, f: r.f, kind: r.kind });
      if (!quiet) emit("kit:pin", { key: p.key, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin" + (p.kind === "okada" ? " ok-pin" : ""); b.setAttribute("aria-pressed", "false");
      b.textContent = p.label;
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ============ 3. The bridge: heavier is steadier? ============
  var card = document.getElementById("bridge-card");
  if (card) {
    var ANS = D.bridge.answers, pickd = {}, verdict = document.getElementById("bridge-verdict");
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
    var run = function (mass) {
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc && sc.okadaRun) sc.okadaRun(mass);
      else toast("The bench is not available. Model: 20 bounces take 10.0 s (200 kg) and 11.2 s (250 kg).");
      var el = document.getElementById("bench-stage"); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    Array.prototype.forEach.call(card.querySelectorAll("[data-run]"), function (b) { b.addEventListener("click", function () { run(+b.getAttribute("data-run")); }); });
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
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      verdict.innerHTML = all
        ? "<strong>Verdict: Tunde's \"heavier is steadier\" fails.</strong> The spring still gives a restoring force proportional to displacement, so the loaded okada still bounces in SHM. The two extra crates only slow its rhythm: 20 bounces take 10.0 s → 11.2 s, so T goes 0.50 s → 0.56 s and f drops from 2.0 Hz to 1.8 Hz. <span class=\"model-tag\">Story numbers are a teaching model, not real measurements.</span>"
        : "<strong>Not quite.</strong> A heavier load does not stop the bounce: the spring still pulls back with F = −kx. Since T = 2π√(m/k), more mass gives a <em>longer</em> period and a <em>lower</em> frequency (about 1.8 Hz). The green rings show the right answers.";
      if (all) burst(verdict, 24);
      emit("l2:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      pickd = {}; verdict.classList.remove("on", "bad"); verdict.innerHTML = "";
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge.ui = { run: run, check: check, solve: function () { pickOpt("bounce", "still"); pickOpt("period", "longer"); pickOpt("freq", "1_8"); check(); } };
  }
})();
