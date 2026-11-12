/* Lesson 02 · interactions: the EMF / terminal p.d. / lost-volts sort (SortDnD), the load explorer
   (#pos-explorer) and the "where did the 3.6 V go?" bridge. LessonKit runs Do Now, Wonder Wall,
   quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L02;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Sort (SortDnD bins) ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#rate-sort .bin"));
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
    var fb = document.getElementById("sort-feedback"); if (fb) fb.classList.remove("on");
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
    var placed = 0, right = 0, rows = [];
    D.items.forEach(function (it) {
      var el = document.querySelector('#rate-sort .sort-item[data-id="' + it.id + '"]');
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
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l2:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Load explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var pbLost = document.getElementById("pb-lost"), pbV = document.getElementById("pb-v");
    var bars = document.getElementById("pos-bars");

    function solve(R) {
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc && sc.model) return sc.model(R);
      var E = D.cell.E, r = D.cell.r;
      if (R == null) return { R: null, I: 0, V: E, lost: 0, E: E, r: r };
      var I = E / (R + r), lost = I * r;
      return { R: R, I: I, V: E - lost, lost: lost, E: E, r: r };
    }
    function setBar(el, val, max) { if (el) el.style.setProperty("--w", Math.max(0, Math.min(100, (val / max) * 100)) + "%"); }

    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var m = solve(p.R), E = D.cell.E;
      info.innerHTML = p.R == null
        ? "<b>Open circuit</b> (I = 0): no current, so no lost volts. The terminals show the full EMF, <b>V = " + E.toFixed(1) + " V</b>."
        : "<b>Load " + p.R + " Ω</b>: I = <b>" + m.I.toFixed(2) + " A</b>. Lost volts Ir = <b>" + m.lost.toFixed(2) + " V</b>. Terminal p.d. V = E − Ir = <b>" + m.V.toFixed(2) + " V</b>.";
      if (bars) bars.setAttribute("aria-hidden", "false");
      setBar(pbLost, m.lost, E); setBar(pbV, m.V, E);
      if (bars) { bars.querySelector('[data-b="lost"]').textContent = m.lost.toFixed(2); bars.querySelector('[data-b="v"]').textContent = m.V.toFixed(2); }
      // drive the bench + graph marker so the point slides down the V–I line
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc) { if (p.R == null) sc.key(false); else sc.load(p.R); }
      emit("l2:pin", { R: p.R, I: m.I, V: m.V, lost: m.lost });
      if (!quiet) emit("kit:pin", { key: p.key, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.label; b.setAttribute("aria-label", p.R == null ? "Open circuit" : "Load " + p.R + " ohms");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ============ 3. The "where did 3.6 V go?" bridge ============
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
    var rebuild = function () {
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc && sc.rebuildEmeka) sc.rebuildEmeka();
      var el = document.getElementById("bench-stage"); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    var rb = document.getElementById("bridge-rebuild"); if (rb) rb.addEventListener("click", rebuild);
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
        ? "<strong>Case settled.</strong> The open-circuit 12.0 V is the EMF — the chemistry is intact. When 3.0 A flows, 3.6 V is dropped inside the battery across its internal resistance (1.2 Ω), leaving 8.4 V at the terminals. The battery is not dead; Tobe is wrong to dump it on the EMF alone."
        : "<strong>Not quite.</strong> The open-circuit reading is the EMF (the chemistry still gives 12.0 V). The missing 3.6 V is dropped <em>inside</em> the cell across r, not in the wires, so the terminals are left at 8.4 V, not 0 V. The green rings show the right answers.";
      if (all) burst(verdict, 24);
      emit("l2:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      pickd = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge.ui = { rebuild: rebuild, check: check, solve: function () { pickOpt("open", "emf"); pickOpt("drop", "inside"); pickOpt("left", "8_4"); check(); } };
  }
})();
