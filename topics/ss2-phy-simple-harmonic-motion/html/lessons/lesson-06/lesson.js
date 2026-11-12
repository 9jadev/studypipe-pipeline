/* Lesson 06 · interactions: the "KE, PE or both?" sort, the position explorer (#pos-explorer, Paper.js
   ShmKinematics2D "energy" scene for the WE1 oscillator) and Mallam Sule's push-test bridge.
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating, recall and locked solutions. */
(function () {
  "use strict";
  var D = window.L06;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // the shared recall box gets the id the build plan names
  var rc = document.querySelector("#reflect .aq.recall"); if (rc && !document.getElementById("recall-box")) rc.id = "recall-box";

  // ============ 1. Sort: KE greatest / PE greatest / KE = PE ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#l6-sort .bin"));
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
      var el = document.querySelector('#l6-sort .sort-item[data-id="' + it.id + '"]');
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
    emit("l6:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Position explorer (#pos-explorer): Paper.js energy scene + pins ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [], ex = null;
    var pc = document.getElementById("pos-canvas");
    if (window.ShmKinematics2D && window.paper && pc) {
      try { ex = ShmKinematics2D.create({ canvas: pc, scene: "energy", k: D.EX.k, m: D.EX.m, A: D.EX.A, view: "x", autoplay: false, labels: true }); }
      catch (e) { ex = null; }
    }
    if (!ex) { var pw = document.getElementById("pos-wrap"); if (pw) pw.classList.add("l6-off"); }
    var mod = window.ShmKinematics2D ? ShmKinematics2D.model : null;
    function energyAt(x) { return mod ? mod.energy(D.EX.k, D.EX.m, D.EX.A, x) : D.energyAt(x); }
    function show(i, quiet) {
      var p = D.pins[i]; if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      var e = energyAt(p.x), w = Math.sqrt(D.EX.k / D.EX.m);
      if (ex) { ex.pause(); ex.setState({ t: Math.asin(Math.max(-1, Math.min(1, p.x / D.EX.A))) / w }); }
      var where = Math.abs(p.x) < 1e-9 ? "the centre: all kinetic" : Math.abs(Math.abs(p.x) - D.EX.A) < 1e-9 ? "an end: all potential" : Math.abs(Math.abs(p.x) - D.EX.A / Math.SQRT2) < 0.001 ? "x = A/√2: KE = PE" : "in between: shared";
      info.innerHTML = "<b>" + p.label + "</b> (" + where + ")<br>" +
        "PE = ½kx² = ½ × 50 × " + (p.x * p.x).toFixed(4) + " = <b>" + e.PE.toFixed(3) + " J</b> · " +
        "KE = E − PE = 0.250 − " + e.PE.toFixed(3) + " = <b>" + e.KE.toFixed(3) + " J</b><br>" +
        "Speed v = √(2KE/m) = <b>" + e.v.toFixed(2) + " m s⁻¹</b> · total always <b>" + e.E.toFixed(3) + " J</b>";
      if (!quiet) emit("l6:pin", { x: p.x, index: i, PE: e.PE, KE: e.KE, v: e.v });
    }
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = p.label;
      b.addEventListener("click", function () { show(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = show;
    D.explorer = ex;
    show(3, true);   // x = 0.06 m (WE1)
  }

  // ============ 3. The Bridge: Mallam Sule's push test ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    // numbers from the kit's model (shock pushes: healthy ζ 0.30, leaking ζ 0.05, 200 kg)
    var M = window.MassSpringKit && MassSpringKit.model, hp = null, lp = null;
    if (M) { hp = M.shockPushes(0.30, 200, 10); lp = M.shockPushes(0.05, 200, 10); }
    if (hp && lp) {
      D.bridge[0].why = "The oil turns most of each push into heat: the peaks go " + hp.slice(0, 4).map(function (v) { return v.toFixed(1); }).join(", ") + " … and settle at " + hp[9].toFixed(1) + " cm.";
      var past = 0; for (var q = 0; q < lp.length; q++) if (lp[q] > 6) { past = q + 1; break; }
      D.bridge[1].why = "Hardly any energy is removed, so each push adds to the last: " + lp.slice(0, 4).map(function (v) { return v.toFixed(1); }).join(", ") + " … " + lp[9].toFixed(1) + " cm — past 6 cm from push " + past + ".";
    }
    var answered = 0, correct = 0, verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l6-bq";
      card.innerHTML = "<h4>Step " + (i + 1) + ". " + st.q + '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"), why = card.querySelector(".why");
      st.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text;
        b.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          card.setAttribute("data-done", "1");
          var ok = k === st.a; if (ok) correct++; answered++;
          Array.prototype.forEach.call(opts.children, function (x, j) { x.disabled = true; x.classList.toggle("correct", j === st.a); x.classList.toggle("incorrect", j === k && !ok); });
          why.textContent = (ok ? "Yes. " : "Not quite. ") + st.why; why.classList.add("on");
          if (ok) burst(b, 10);
          if (answered === D.bridge.length) finishBridge();
        });
        opts.appendChild(b);
      });
      bridgeRoot.appendChild(card);
    });
    function finishBridge() {
      verdict.innerHTML = "<strong>Mallam Sule's verdict:</strong> “A working shock absorber takes energy out each cycle; this leaking one hardly does, so energy put in by the road can pile up — but only if the pushes keep arriving in time with the bounce.” You got " + correct + " of " + D.bridge.length + " first time.";
      verdict.classList.add("on"); verdict.classList.toggle("bad", correct < D.bridge.length);
      burst(verdict, 24);
      emit("l6:bridge", { correct: correct, total: D.bridge.length });
    }
    D.solveBridge = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (card.getAttribute("data-done")) return;
        var btns = card.querySelectorAll(".opts button"); if (btns[D.bridge[i].a]) btns[D.bridge[i].a].click();
      });
    };
    var run = document.getElementById("bridge-run");
    if (run) run.addEventListener("click", function () {
      var z = window.StudyScenes && StudyScenes.zoom;
      var zs = document.getElementById("zoom-stage");
      if (zs) zs.scrollIntoView({ behavior: "smooth", block: "center" });
      if (z) { z.setDamper("healthy"); setTimeout(function () { z.pushTen(); }, 500); }
    });
  }
})();
