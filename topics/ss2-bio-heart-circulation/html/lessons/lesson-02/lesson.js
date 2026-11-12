/* Lesson 02 · interactions: Which-side sort, wall explorer (#pos-explorer) and the Baba Sule bridge. LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L02;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ---------------- 1. Which side of the heart? (sort) ----------------
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#side-sort .bin"));
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
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span>" + it.name;
      attachDrag(b);
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
  function attachDrag(b) {
    // Shared drag-and-drop (assets/js/sort-dnd.js): auto-scrolls to reach bins that
    // sit below the fold, snaps to the nearest bin, and survives a stray second touch.
    SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
  }

  function checkSort() {
    var placed = 0, right = 0, rows = [];
    var labels = { right: "Right side", left: "Left side", both: "Both sides" };
    D.items.forEach(function (it) {
      var el = document.querySelector('#side-sort .sort-item[data-id="' + it.id + '"]');
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
    emit("l2:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ---------------- 2. Wall explorer (#pos-explorer) ----------------
  var track = document.getElementById("pos-track");
  if (track) {
    var M = window.DissectionBench ? DissectionBench.model({}) : null;       // means come from the bench model, not typed text
    var maxMean = 12.0, info = document.getElementById("pos-info"), barsEl = document.getElementById("wall-bars");
    var pinEls = [], barEls = {};
    D.pins.forEach(function (p) {
      var mean = M && M[p.key] ? M[p.key].mean : null;
      var bar = document.createElement("div");
      bar.className = "wb";
      bar.innerHTML = "<span>" + p.key.toUpperCase().replace("SEPTUM", "Septum") + "</span><i style=\"--w:" + (mean ? Math.max(4, mean / maxMean * 100) : 4) + '%"></i><b>' + (mean != null ? mean.toFixed(1) + " mm" : "") + "</b>";
      barsEl.appendChild(bar); barEls[p.key] = bar;
    });
    var lastPin = null;
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      lastPin = i;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      Object.keys(barEls).forEach(function (k) { barEls[k].classList.toggle("on", k === p.key); });
      var mean = M && M[p.key] ? M[p.key].mean : null;
      info.innerHTML = "<b>" + p.label + "</b> · mean wall <b>" + (mean != null ? mean.toFixed(1) + " mm" : "n/a") + "</b><br>Pumps to: " + p.pumps + ".<br>Distance: " + p.trip + ".<br>" + p.why +
        (p.key === "lv" && M ? "<br>LV : RV = " + (M.lv.mean / M.rv.mean).toFixed(1) + "." : "");
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc) { sc.showCut(); sc.highlight(p.key); }
      if (!quiet) emit("l2:pin", { key: p.key, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.key === "septum" ? "Septum" : p.key.toUpperCase();
      b.setAttribute("aria-label", p.label);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ---------------- 3. Baba Sule bridge ----------------
  var card = document.getElementById("bridge-card");
  if (card) {
    var ANS = { wall: "lv", vessel: "aorta", side: "right" };
    var chosen = {}, verdict = document.getElementById("bridge-verdict");
    function pickOpt(q, v) {
      chosen[q] = v;
      Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + q + '"] button'), function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === v)); b.classList.remove("ok", "no");
      });
    }
    Array.prototype.forEach.call(card.querySelectorAll(".bridge-q"), function (qEl) {
      var q = qEl.getAttribute("data-q");
      Array.prototype.forEach.call(qEl.querySelectorAll("button"), function (b) { b.addEventListener("click", function () { pickOpt(q, b.getAttribute("data-v")); }); });
    });
    function check() {
      var keys = Object.keys(ANS);
      if (keys.some(function (k) { return !chosen[k]; })) { toast("Answer all three questions first."); return; }
      var all = true;
      keys.forEach(function (k) {
        var ok = chosen[k] === ANS[k]; if (!ok) all = false;
        Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + k + '"] button'), function (b) {
          b.classList.toggle("ok", b.getAttribute("data-v") === ANS[k]);
          b.classList.toggle("no", b.getAttribute("data-v") === chosen[k] && !ok);
        });
      });
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      verdict.innerHTML = all
        ? "<strong>Case closed.</strong> The thick wall is the <strong>left</strong> ventricle, and the aorta leaves it. On a diagram facing you it sits on <strong>your right</strong>, which is why Baba Sule mixed up the sides."
        : "<strong>Not quite.</strong> Look again: the thick wall pushes blood round the whole body through the aorta, so it is the left ventricle. Facing you, the patient's left is on your right. The green ring shows the right answers.";
      if (all) burst(verdict, 24);
      emit("l2:bridge", { correct: all });
    }
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      chosen = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge = { pick: pickOpt, check: check, solve: function () { pickOpt("wall", "lv"); pickOpt("vessel", "aorta"); pickOpt("side", "right"); check(); } };
  }
})();
