/* Lesson 04 · interactions: "speeds it up or slows it down?" sort, cycle-time explorer (#pos-explorer) and the Chidi bridge.
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L04;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var BINS = { faster: "Speeds it up", slower: "Slows it down" };

  // ============ 1. Sort ============
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
    D.items.forEach(function (it) {
      var el = document.querySelector('#rate-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + BINS[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l4:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Cycle explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var tick = function (ok) { return ok ? "✓" : "✗"; };
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var d = D.describe ? D.describe(p.ph) : null;
      if (d) {
        info.innerHTML = "<b>At " + p.label + ": " + d.stage + "</b><br>" +
          "Atria: <b>" + (d.aSys ? "contracting" : "relaxed") + "</b> · Ventricles: <b>" + (d.vSys ? "contracting" : "relaxed") + "</b><br>" +
          "AV valves (tricuspid, bicuspid): <b>" + (d.avClosed ? "shut" : "open") + "</b> · Semilunar valves: <b>" + (d.slOpen ? "open" : "shut") + "</b><br>" +
          (d.sound ? "Sound: <b>" + d.sound + "</b> has just been heard." : "No heart sound at this moment.");
      } else info.textContent = p.label;
      var z = window.StudyScenes && window.StudyScenes.zoom;
      if (z) { z.setMode("sys"); z.hold(p.ph); }
      if (!quiet) emit("l4:pin", { t: p.t, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.label; b.setAttribute("aria-label", "Freeze the heart at " + p.label);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    var jump = document.getElementById("pos-jump");
    if (jump) jump.addEventListener("click", function () { var s = document.getElementById("zoom-stage"); if (s && s.scrollIntoView) s.scrollIntoView({ behavior: "smooth", block: "center" }); });
    var run = document.getElementById("pos-run");
    if (run) run.addEventListener("click", function () {
      pinEls.forEach(function (el) { el.setAttribute("aria-pressed", "false"); });
      info.textContent = "The heart is beating freely again. Tap a time to freeze it.";
      var z = window.StudyScenes && window.StudyScenes.zoom; if (z) z.hold(null);
    });
    D.showPin = showPin;
  }

  // ============ 3. Chidi's bridge ============
  var card = document.getElementById("bridge-card");
  if (card) {
    var ANS = { rise: "adr", lub: "av", fall: "vagus" };
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
    var replay = function () {
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc) sc.all();
      var el = document.getElementById("bench-stage"); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    var replayBtn = document.getElementById("bridge-replay"); if (replayBtn) replayBtn.addEventListener("click", replay);
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
        ? "<strong>Case 1 closed.</strong> Carbon dioxide and adrenaline pushed the SAN faster, so the rate leapt from 68 to 132 beats per minute and the heart pumped about 2.6 times more blood each minute. The <em>lub</em> is the AV valves shutting, not muscle clapping. Afterwards the vagus nerve slowed the SAN and the rate glided back to 68 in about 5 minutes. The heart sets its own beat; nerves and hormones only turn the speed up or down."
        : "<strong>Not quite.</strong> Remember: the beat starts inside the heart at the SAN (it is myogenic), so the brain does not send each beat. Adrenaline and the cardiac centre speed it up, the vagus nerve slows it down, and the lub is the AV valves closing. The green ring shows the right answers.";
      if (all) burst(verdict, 24);
      emit("l4:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      pickd = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge = { pick: pickOpt, check: check, replay: replay, solve: function () { pickOpt("rise", "adr"); pickOpt("lub", "av"); pickOpt("fall", "vagus"); check(); } };
  }
})();
