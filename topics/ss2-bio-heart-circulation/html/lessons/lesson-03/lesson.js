/* Lesson 03 · interactions: "put the journey in order" sequence sort, organ explorer (#pos-explorer) and the rider's-drip bridge.
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L03;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ---------------- 1. Put the journey in order ----------------
  var tray = document.getElementById("seq-tray"), line = document.getElementById("seq-line");
  var chosen = [];           // ids placed in the sequence, in order
  var cards = D.steps.concat([D.distractor]);

  function shuffled() {
    var a = cards.slice(), s = 11;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345 + Math.floor(Math.random() * 1000)) & 0x7fffffff; var j = s % (i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function cardEl(c) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "seq-card"; b.setAttribute("data-id", c.id); b.textContent = c.name;
    b.addEventListener("click", function () { toggle(c.id); });
    return b;
  }
  var order = [];
  function render() {
    tray.innerHTML = ""; line.innerHTML = "";
    order.forEach(function (c) { if (chosen.indexOf(c.id) < 0) tray.appendChild(cardEl(c)); });
    chosen.forEach(function (id) {
      var c = cards.filter(function (x) { return x.id === id; })[0];
      line.appendChild(cardEl(c));
    });
    if (!chosen.length) { var p = document.createElement("span"); p.className = "stage-hint"; p.style.color = "var(--paper-muted)"; p.textContent = "Tap cards above to build the journey here."; line.appendChild(p); }
  }
  function toggle(id) {
    var i = chosen.indexOf(id);
    if (i >= 0) chosen.splice(i, 1); else chosen.push(id);
    render();
  }
  function reset() {
    chosen = []; order = shuffled(); render();
    document.getElementById("sort-feedback").classList.remove("on");
    document.getElementById("sort-score").textContent = "";
  }
  function check() {
    if (chosen.length < D.steps.length) { toast("Build the whole journey first. " + (D.steps.length - chosen.length) + " more card" + (D.steps.length - chosen.length === 1 ? "" : "s") + " needed (and one card does not belong)."); return; }
    var correct = 0, rows = [], usedDistractor = chosen.indexOf(D.distractor.id) >= 0;
    D.steps.forEach(function (s, i) {
      var ok = chosen[i] === s.id; if (ok) correct++;
      var el = line.children[i]; if (el && el.classList) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + (i + 1) + ". " + s.name + "</b></div>");
    });
    var fb = document.getElementById("sort-feedback");
    var note = usedDistractor
      ? "<p><b>The hepatic portal vein does not belong here.</b> It carries gut blood to the liver, which is a side trip, not a step of the heart's own double loop.</p>"
      : "<p>Good: you left out the <b>hepatic portal vein</b>. It carries gut blood to the liver and is not one of the 13 steps.</p>";
    fb.innerHTML = rows.join("") + note; fb.classList.add("on");
    var score = correct - (usedDistractor ? 0 : 0);
    document.getElementById("sort-score").textContent = "In the right place: " + correct + " / " + D.steps.length + (correct === D.steps.length && !usedDistractor ? ". Perfect!" : ". See the correct order below.");
    if (correct === D.steps.length && !usedDistractor) burst(document.getElementById("sort-score"), 20);
    emit("l3:sort", { correct: usedDistractor && correct === D.steps.length ? D.steps.length - 1 : score, total: D.steps.length, distractor: usedDistractor });
  }
  if (tray && line) {
    reset();
    document.getElementById("sort-check").addEventListener("click", check);
    document.getElementById("sort-reset").addEventListener("click", reset);
  }

  // ---------------- 2. Organ explorer (#pos-explorer) ----------------
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      info.innerHTML = "<b>" + p.label + "</b><br>Blood in by <b>" + p.inV + "</b>.<br>Blood out by <b>" + p.outV + "</b>.<br>" + p.note;
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc) sc.lit(p.lit);
      if (!quiet) emit("l3:pin", { key: p.key, index: i });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.key === "heart" ? "Heart" : p.key.charAt(0).toUpperCase() + p.key.slice(1);
      b.setAttribute("aria-label", p.label);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
  }

  // ---------------- 3. The rider's drip bridge ----------------
  var card = document.getElementById("bridge-card");
  if (card) {
    var ANS = { first: "ra", organ: "lungs", last: "carotid" };
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
    var traceDrip = function () { var sc = window.StudyScenes && window.StudyScenes.bench; if (sc) sc.trace("armBrain"); };
    document.getElementById("bridge-trace").addEventListener("click", function () {
      traceDrip(); var el = document.getElementById("bench-stage"); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    var check2 = function () {
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
        ? "<strong>Case closed.</strong> Arm vein → right half of the heart → lung capillaries → left half → aorta → carotid artery → brain. Baba Sule was wrong: veins lead <strong>to the heart</strong>, not to the brain."
        : "<strong>Not quite.</strong> Veins carry blood towards the heart, so the drip enters the right atrium first. It cannot reach the left side without crossing the lungs, and the carotid artery (not the jugular vein) takes it up to the brain. The green ring shows the right answers.";
      if (all) burst(verdict, 24);
      emit("l3:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check2);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      pickd = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge = { pick: pickOpt, check: check2, trace: traceDrip, solve: function () { pickOpt("first", "ra"); pickOpt("organ", "lungs"); pickOpt("last", "carotid"); check2(); } };
  }
})();
