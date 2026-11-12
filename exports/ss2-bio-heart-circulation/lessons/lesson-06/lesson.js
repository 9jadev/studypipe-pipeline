/* Lesson 06 · interactions: Which-part-of-blood sort, composition explorer (#pos-explorer) and the rider's-gash bridge. LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L06;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ---------------- 1. Which part of blood? (sort) ----------------
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#blood-sort .bin"));
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
    var labels = D.binNames;
    D.items.forEach(function (it) {
      var el = document.querySelector('#blood-sort .sort-item[data-id="' + it.id + '"]');
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
    emit("l6:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ---------------- 2. Composition explorer (#pos-explorer) ----------------
  var track = document.getElementById("pos-track");
  if (track) {
    // volumes come from the stated 55 : 45 split of a 5.0 dm3 bottle
    var total = D.total_dm3, pl = D.plasma_pct, plasmaV = total * pl / 100, cellV = total - plasmaV;
    var glass = document.getElementById("bottle-glass"), key = document.getElementById("bottle-key");
    if (glass) {
      glass.querySelector('[data-seg="plasma"]').style.height = pl + "%";
      glass.querySelector('[data-seg="cells"]').style.height = (100 - pl) + "%";
    }
    if (key) key.innerHTML = "<span><b>Plasma</b> " + pl + "% = " + plasmaV.toFixed(2) + " dm³</span><span><b>Cells</b> " + (100 - pl) + "% = " + cellV.toFixed(2) + " dm³</span><span>Total " + total.toFixed(1) + " dm³</span>";
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      if (glass) Array.prototype.forEach.call(glass.querySelectorAll("i"), function (seg) {
        var on = (p.key === "plasma" && seg.getAttribute("data-seg") === "plasma") || (p.key !== "plasma" && seg.getAttribute("data-seg") === "cells");
        seg.classList.toggle("on", on);
      });
      var share = p.key === "plasma" ? pl + "% of the bottle, " + plasmaV.toFixed(2) + " dm³" : p.key === "rbc" ? "nearly all of the " + cellV.toFixed(2) + " dm³ of cells" : "under 1% of the volume";
      info.innerHTML = "<b>" + p.label + "</b><br>Share: " + share + ".<br>Count: " + p.count + ".<br>Life span: " + p.life + ".<br>" + p.job;
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc) { sc.view(400); sc.find ? (p.focus ? sc.find(p.focus) : sc.highlight(null)) : null; }
      if (!quiet) emit("l6:pin", { key: p.key, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.label;
      b.setAttribute("aria-label", p.label);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ---------------- 3. The rider's gash bridge ----------------
  var card = document.getElementById("bridge-card");
  if (card) {
    var lostPct = String(Math.round(1.5 / 5.0 * 100));          // 1.5 / 5.0 x 100 = 30
    var ANS = { seal: "fibrin", protein: "fibrinogen", lost: lostPct };
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
        ? "<strong>Case closed.</strong> Platelets and torn tissue started the thromboplastin, thrombin, fibrin chain, and the fibrin mesh trapped red cells and sealed the wound. It was not drying in the air, and salt would only sting and carry in germs. But he had already lost about 1.5 dm³ of his 5.0 dm³: 1.5 ÷ 5.0 × 100 = <strong>30%</strong> of his blood, so he still needs a transfusion."
        : "<strong>Not quite.</strong> Look again at the clot zoom: dissolved fibrinogen became solid fibrin threads that trapped red cells. He lost 1.5 dm³ of 5.0 dm³, which is 1.5 ÷ 5.0 × 100 = 30%. The green ring shows the right answers.";
      if (all) burst(verdict, 24);
      emit("l6:bridge", { correct: all });
    }
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      chosen = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    var playBtn = document.getElementById("bridge-play");
    if (playBtn) playBtn.addEventListener("click", function () {
      var z = window.StudyScenes && window.StudyScenes.zoom; if (z) z.play();
      var zs = document.getElementById("zoom-stage"); if (zs && zs.scrollIntoView) zs.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    D.bridge = { pick: pickOpt, check: check, solve: function () { pickOpt("seal", "fibrin"); pickOpt("protein", "fibrinogen"); pickOpt("lost", lostPct); check(); } };
  }
})();
