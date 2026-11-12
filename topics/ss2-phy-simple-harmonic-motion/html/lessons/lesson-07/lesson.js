/* Lesson 07 · interactions: useful/harmful sort (SortDnD), the speed explorer (#pos-explorer) and the
   mystery-verdict bridge (#bridge). LessonKit runs Do Now, Wonder Wall, quiz, rating and locked solutions.
   Explorer and bridge numbers come from MassSpringKit.model.okada (the same model as the bench). */
(function () {
  "use strict";
  var D = window.L07;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && StudyNarrator.burst && el) StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var MODEL = window.MassSpringKit && MassSpringKit.model && MassSpringKit.model.okada;
  function okada(kmh, mass, leak) { return MODEL ? MODEL(kmh, mass, leak ? 0.05 : 0.30) : null; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }

  // ============ 1. Sort: useful / harmful ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#l07-sort .bin"));
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
    D.items.forEach(function (it) {
      var el = document.querySelector('#l07-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l7:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Speed explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var kmh = D.pins[i]; if (kmh == null) return;
      pinEls.forEach(function (el, j) { el.setAttribute("aria-pressed", String(j === i)); });
      var L = okada(kmh, 200, true), H = okada(kmh, 200, false);
      if (!L) { info.textContent = "The okada model is not available on this device."; return; }
      var thc = L.th * 100;
      info.innerHTML = "<b>" + kmh + " km/h</b> = " + f2(L.v) + " m s⁻¹ → f = v/d = " + f2(L.v) + " ÷ 2.5 = <strong>" + f2(L.f) + " Hz</strong>; f/f₀ = " + f2(L.r) + ". " +
        "A (leaking) = <strong>" + f1(L.A * 100) + " cm</strong> · A (healthy) = " + f1(H.A * 100) + " cm. " +
        "Lift-off threshold g/ω² with the driving ω = 2πf: <strong>" + f1(thc) + " cm</strong> → " +
        (L.lift ? "<b>the crates lift off</b> (resonance: f = f₀)." : "the crates stay on" + (Math.abs(L.r - 1) > 0.3 ? ", because f is far from f₀." : ", but this is close to danger.")) +
        (H.lift ? "" : " With a healthy damper they stay on.");
      if (!quiet) emit("l7:pin", { kmh: kmh, index: i, lift: L.lift });
    };
    D.pins.forEach(function (kmh, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = kmh + " km/h";
      b.setAttribute("aria-label", "Test " + kmh + " kilometres per hour");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(3, true);
  }

  // ============ 3. Mystery-verdict bridge (#bridge) ============
  var card = document.getElementById("bridge-card");
  if (card && D.bridge) {
    var runWrap = document.getElementById("bridge-runs"), runsDone = {};
    D.runs.forEach(function (run) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "vt-btn"; b.setAttribute("data-run", run.id);
      b.innerHTML = run.label + '<span class="l7-res">tap to ride</span>';
      b.addEventListener("click", function () { doRun(run, b); });
      runWrap.appendChild(b);
    });
    function doRun(run, b) {
      var res = b.querySelector(".l7-res"), crack, txt;
      if (run.kmh == null) {
        // healthy damper at every speed: the largest bounce over 5–35 km/h against the threshold at that speed
        var worst = null;
        for (var v = 5; v <= 35; v += 0.5) { var o = okada(v, run.mass, run.leak); if (o && (!worst || o.A > worst.A)) worst = o; }
        var any = false; for (var v2 = 5; v2 <= 35; v2 += 0.5) { var o2 = okada(v2, run.mass, run.leak); if (o2 && o2.lift) any = true; }
        crack = any;
        txt = worst ? "peak " + f1(worst.A * 100) + " cm · " + (any ? "cracks" : "fine everywhere") : "—";
      } else {
        var r = okada(run.kmh, run.mass, run.leak);
        crack = r && r.lift;
        txt = r ? "A " + f1(r.A * 100) + " cm vs " + f1(r.th * 100) + " cm · " + (crack ? "CRACK" : "fine") : "—";
      }
      res.textContent = txt;
      b.classList.toggle("crack", !!crack); b.classList.toggle("fine", !crack);
      runsDone[run.id] = true;
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc && sc.ride) {
        sc.ride(run.kmh == null ? 18 : run.kmh, { mass: run.mass, leak: run.leak });
        if (sc.scrollIntoView) sc.scrollIntoView();
      }
      emit("l7:run", { id: run.id, crack: !!crack, count: Object.keys(runsDone).length });
    }
    D.runBridge = function (id) { var b = runWrap.querySelector('[data-run="' + id + '"]'); var run = D.runs.filter(function (x) { return x.id === id; })[0]; if (b && run) doRun(run, b); };

    var qEls = Array.prototype.slice.call(card.querySelectorAll(".l7-bq"));
    var picks = {}, verdict = document.getElementById("bridge-verdict");
    qEls.forEach(function (qEl, qi) {
      var opts = qEl.querySelector(".opts"), st = D.bridge[qi];
      st.o.forEach(function (text, k2) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text; b.setAttribute("data-v", String(k2)); b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          picks[qi] = k2;
          Array.prototype.forEach.call(opts.children, function (x) { x.setAttribute("aria-pressed", String(+x.getAttribute("data-v") === k2)); x.classList.remove("ok", "no"); });
        });
        opts.appendChild(b);
      });
    });
    var check = function () {
      if (D.bridge.some(function (_, i) { return picks[i] == null; })) { toast("Answer all three questions first."); return; }
      var all = true;
      D.bridge.forEach(function (st, i) {
        var ok = picks[i] === st.a; if (!ok) all = false;
        Array.prototype.forEach.call(qEls[i].querySelector(".opts").children, function (x) {
          var v = +x.getAttribute("data-v");
          x.classList.toggle("ok", v === st.a);
          x.classList.toggle("no", v === picks[i] && !ok);
        });
      });
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      verdict.innerHTML = all
        ? "<p><strong>Case closed.</strong> At 18 km/h the ridges push the rear at f = 5.0 ÷ 2.5 = 2.0 Hz, exactly its natural frequency — <strong>resonance</strong>. With the leaking shock absorber the energy builds until A passes g/ω² = 6.2 cm, and the crates leave the carrier at the top of each bounce. Extra crates lower f₀ to 1.79 Hz, moving the danger to 16 km/h. Tunde's \"faster is worse\" fails: 30 km/h is safe because it is far from resonance.</p>" +
          "<p><strong>Advice to Dayo and Hajia Ramatu:</strong> replace the rear shock absorber (Mallam Sule); until then, cross the ridge stretch at about 10 km/h or below, well under the resonance band, whatever the load.</p>" +
          '<p class="note model-note">Story numbers are a teaching model, not real measurements.</p>'
        : "<p><strong>Not quite.</strong> The danger comes from matching frequencies, not from speed itself: f = v/d equals f₀ = 2.0 Hz at 18 km/h. More load lowers f₀, so the danger speed falls to 16 km/h. The fix is a healthy damper, plus a slow crossing until it is fitted. The green rings show the right answers.</p>" +
          '<p class="note model-note">Story numbers are a teaching model, not real measurements.</p>';
      if (all) burst(verdict, 24);
      emit("l7:bridge", { correct: all });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      picks = {}; runsDone = {}; verdict.classList.remove("on", "bad"); verdict.innerHTML = "";
      Array.prototype.forEach.call(card.querySelectorAll(".l7-bq .opts button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
      Array.prototype.forEach.call(runWrap.children, function (b) { b.classList.remove("crack", "fine"); b.querySelector(".l7-res").textContent = "tap to ride"; });
    });
    D.bridge_api = {
      solve: function () {
        D.bridge.forEach(function (st, i) { var b = qEls[i].querySelector(".opts").children[st.a]; if (b) b.click(); });
        check();
      }
    };
  }
})();
