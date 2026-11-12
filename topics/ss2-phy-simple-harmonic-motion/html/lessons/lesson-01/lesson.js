/* Lesson 01 · interactions: oscillation / periodic / non-repeating sort (SortDnD), timing results table
   (filled from the bench, learner types f and it is checked to ±0.001 Hz), Position Explorer (#pos-explorer, pins along
   one swing + Paper.js phase-strip), and the Bridge (hand-timing 1 vs 20 okada bounces).
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating, recall and locked solutions. */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el && window.StudyNarrator.burst) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  function sf(x, n) { if (!isFinite(x)) return "–"; return Number(x.toPrecision(n)).toString(); }

  // ============ 1. Sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#rep-sort .bin"));
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
      var el = document.querySelector('#rep-sort .sort-item[data-id="' + it.id + '"]');
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

  // ============ 2. Results table (from the bench) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  function rigLabel(r) { return r === "pendulum" ? "Pendulum" : r === "spring" ? "Spring" : "Okada"; }
  if (tbody) {
    document.addEventListener("l1:bench", function (e) {
      var d = e.detail || {};
      if (!d.n || !d.t) return;
      rcount++;
      var Tr = Number((d.T * (1 + 1e-9)).toPrecision(3));
      var how = d.how === "hand"
        ? "by hand · start late " + d.delayStart.toFixed(2) + " s, stop late " + (d.delayStop != null ? d.delayStop.toFixed(2) : "–") + " s"
        : "kit stopwatch from the rest mark";
      var tr = document.createElement("tr"); tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Rig · n"><b>' + rigLabel(d.rig) + " · " + d.n + '</b><span class="rc-sub">' + how + "</span></td>" +
        '<td data-label="t / s">' + d.t.toFixed(2) + "</td>" +
        '<td data-label="T / s">' + (d.T * (1 + 1e-9)).toPrecision(3) + "</td>" +
        '<td data-label="f / Hz"><input class="shm-fin" type="number" inputmode="decimal" step="0.001" placeholder="1/T" aria-label="Your frequency for row ' + rcount + '"><span class="shm-fok"></span></td>' +
        '<td data-label="ω / rad s⁻¹" class="shm-w">?</td>';
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1500);
      var inp = tr.querySelector(".shm-fin"), ok = tr.querySelector(".shm-fok"), wcell = tr.querySelector(".shm-w"), tries = 0;
      inp.addEventListener("change", function () {
        var v = parseFloat(inp.value); if (!isFinite(v)) return;
        tries++;
        var good = Math.abs(v - 1 / d.T) <= 0.001 + 1e-9 || Math.abs(v - 1 / Tr) <= 0.001 + 1e-9;
        if (good || tries >= 2) {
          ok.textContent = good ? " ✓" : " → " + sf(1 / d.T, 3);
          ok.className = "shm-fok " + (good ? "ok" : "no");
          wcell.textContent = sf(d.w, 3);
          if (good) burst(inp, 8);
        } else { ok.textContent = " ✗ 1 ÷ T"; ok.className = "shm-fok no"; }
      });
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Timings recorded: " + rcount;
    });
    document.addEventListener("l1:bench-reset", function () {
      tbody.innerHTML = ""; rcount = 0;
      var line = document.getElementById("results-line"); if (line) line.textContent = "Timings recorded: 0";
    });
  }

  // ============ 3. Position Explorer (#pos-explorer) ============
  var Tpend = (window.PendulumKit && PendulumKit.model) ? PendulumKit.model.period(0.80, 9.8, 10, "small") : 2 * Math.PI * Math.sqrt(0.80 / 9.8);
  var strip = null;
  var stripCanvas = document.getElementById("pos-canvas");
  if (stripCanvas && window.paper && window.ShmKinematics2D) {
    try {
      strip = ShmKinematics2D.create({ canvas: stripCanvas, scene: "phase-strip", T: Tpend, A: 0.10, l: 0.80, autoplay: true, labels: true, surface: "ink" });
    } catch (err) { strip = null; }
  }
  if (!strip && stripCanvas) { var sw = stripCanvas.closest(".shm-strip"); if (sw) sw.style.display = "none"; }
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var t = p.frac * Tpend;
      info.innerHTML = "<b>" + p.at + " · t = " + t.toFixed(2) + " s</b> · " + p.label + "<br>Cycle completed: <b>" + p.cycle + "</b><br>The bob is " + p.dir + ".";
      if (strip) strip.setState({ t: t, playing: false });
      if (!quiet) emit("l1:pin", { index: i, at: p.at, t: t });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = p.at + "<br>" + (p.frac * Tpend).toFixed(2) + " s";
      b.setAttribute("aria-label", p.label + " at " + (p.frac * Tpend).toFixed(2) + " seconds");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
    D.strip = strip;
    var play = document.getElementById("pos-play");
    if (play) play.addEventListener("click", function () { if (strip) strip.setState({ playing: true }); pinEls.forEach(function (el) { el.setAttribute("aria-pressed", "false"); }); });
  }

  // ============ 4. Bridge: hand-time 1 bounce vs 20 bounces ============
  var bRoot = document.getElementById("bridge-steps");
  if (bRoot) {
    var list1 = document.getElementById("br-one"), list20 = document.getElementById("br-twenty");
    var c1 = 0, c20 = 0, answered = false;
    var qBox = document.getElementById("br-q"), verdict = document.getElementById("bridge-verdict");
    function trial(n) {
      var B = window.StudyScenes && StudyScenes.bench && StudyScenes.bench.handTimeOkada ? StudyScenes.bench.handTimeOkada(n) : null;
      if (!B) { toast("The okada model is not loaded on this device."); return; }
      var li = document.createElement("li");
      li.innerHTML = "t = <b>" + B.t.toFixed(2) + " s</b> → T = <b>" + (B.t / n).toFixed(n === 1 ? 2 : 3) + " s</b>";
      (n === 1 ? list1 : list20).appendChild(li);
      if (n === 1) c1++; else c20++;
      if (c1 >= 2 && c20 >= 2 && qBox) qBox.hidden = false;
    }
    var b1 = document.getElementById("br-time1"), b20 = document.getElementById("br-time20");
    if (b1) b1.addEventListener("click", function () { trial(1); });
    if (b20) b20.addEventListener("click", function () { trial(20); });
    if (qBox && D.bridgeQ) {
      var q = D.bridgeQ, opts = qBox.querySelector(".opts"), why = qBox.querySelector(".why");
      qBox.querySelector("h4").textContent = q.q;
      q.o.forEach(function (text, k) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = text;
        b.addEventListener("click", function () {
          if (answered) return; answered = true;
          var ok = k === q.a;
          Array.prototype.forEach.call(opts.children, function (x, j) { x.disabled = true; x.classList.toggle("correct", j === q.a); x.classList.toggle("incorrect", j === k && !ok); });
          why.textContent = (ok ? "Yes. " : "Not quite. ") + q.why; why.classList.add("on");
          if (verdict) { verdict.classList.add("on"); burst(verdict, 24); }
          var big = document.getElementById("big-idea"); if (big) big.classList.add("in");
          emit("l1:bridge", { correct: ok });
        });
        opts.appendChild(b);
      });
    }
    D.bridgeSolve = function () {
      while (c1 < 2) trial(1); while (c20 < 2) trial(20);
      if (!answered && qBox) qBox.querySelectorAll(".opts button")[D.bridgeQ.a].click();
    };
    D.bridgeTrial = trial;
  }

  // ============ 5. Move the bank's blank-page recall into #recall-box ============
  var rcBox = document.getElementById("recall-box"), rc = document.querySelector("#reflect .aq.recall");
  if (rcBox && rc) { rcBox.innerHTML = ""; rcBox.appendChild(rc); }
})();
