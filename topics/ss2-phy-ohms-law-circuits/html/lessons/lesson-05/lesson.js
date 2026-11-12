/* Lesson 05 · interactions: the null-method sort (SortDnD), the length explorer (#pos-explorer),
   and the mystery-verdict bridge (#bridge). LessonKit runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Sort: metre bridge / potentiometer / both ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#l05-sort .bin"));
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
      SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
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
      var el = document.querySelector('#l05-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l5:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Length explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var k = D.k;                      // 0.0200 V cm⁻¹
    // internal-resistance demo values (02-lesson): l1 = 75.0 (open), l2 = 60.0 (loaded), R = 3.0 Ω
    var IR = { l1: 75.0, l2: 60.0, R: 3.0 };
    IR.r = IR.R * (IR.l1 - IR.l2) / IR.l2;
    var showPin = function (i, quiet) {
      var l = D.pins[i]; if (l == null) return;
      pinEls.forEach(function (el, j) { el.setAttribute("aria-pressed", String(j === i)); });
      var v = k * l;
      var extra = "";
      if (l === IR.l1) extra = "<br>This is the <b>open-circuit</b> balance (l₁ = 75.0 cm) for the internal-resistance test.";
      else if (l === IR.l2) extra = "<br>This is the <b>loaded</b> balance (l₂ = 60.0 cm, R = 3.0 Ω): r = R(l₁ − l₂)/l₂ = 3.0 × 15.0/60.0 = <b>0.75 Ω</b>.";
      info.innerHTML = "<b>l = " + l.toFixed(0) + " cm</b> · V_AJ = k l = 0.0200 × " + l.toFixed(0) + " = <b>" + v.toFixed(2) + " V</b>. The p.d. rises in step with the length, so V ∝ l." + extra;
      if (!quiet) emit("l5:pin", { l: l, index: i });
    };
    D.pins.forEach(function (l, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = l + " cm";
      b.setAttribute("aria-label", "Jockey at " + l + " centimetres");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(3, true);                 // start on 75 cm, quietly
  }

  // ============ 3. Mystery-verdict bridge (#bridge) ============
  var card = document.getElementById("bridge-card");
  if (card && D.bridge) {
    var qEls = Array.prototype.slice.call(card.querySelectorAll(".l05-bq"));
    var picks = {}, verdict = document.getElementById("bridge-verdict");
    qEls.forEach(function (qEl, qi) {
      var opts = qEl.querySelector(".opts"), st = D.bridge[qi];
      st.o.forEach(function (text, k2) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text; b.setAttribute("data-v", String(k2));
        b.addEventListener("click", function () {
          picks[qi] = k2;
          Array.prototype.forEach.call(opts.children, function (x) { x.setAttribute("aria-pressed", String(+x.getAttribute("data-v") === k2)); x.classList.remove("ok", "no"); });
        });
        opts.appendChild(b);
      });
    });
    var balanceOnBench = function () {
      var sc = window.StudyScenes && window.StudyScenes.bench;
      if (sc && sc.balanceKeke) sc.balanceKeke();
      var el = document.getElementById("bench-stage");
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("Emeka's battery is balancing on the 24 V driver — watch it settle at 80.0 cm = 12.0 V.");
    };
    var check = function () {
      if (D.bridge.some(function (_, i) { return picks[i] == null; })) { toast("Answer all three questions first."); return; }
      var all = true;
      D.bridge.forEach(function (st, i) {
        var ok = picks[i] === st.a; if (!ok) all = false;
        var opts = qEls[i].querySelector(".opts");
        Array.prototype.forEach.call(opts.children, function (x) {
          var v = +x.getAttribute("data-v");
          x.classList.toggle("ok", v === st.a);
          x.classList.toggle("no", v === picks[i] && !ok);
        });
      });
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      verdict.innerHTML = all
        ? "<strong>Case closed.</strong> At the null point no current flows, so the 80.0 cm balance reads the <strong>true EMF, 12.0 V</strong>. The chemistry is healthy — the <strong>internal resistance has risen</strong>, dropping 3.6 V under the 3.0 A starter and sagging the terminals to 8.4 V. Clean, recharge and re-test; replace only if r stays high."
        : "<strong>Not quite.</strong> At balance the galvanometer reads zero, so no current is drawn and the balance length gives the true EMF (12.0 V), not the loaded reading. The fault is a risen internal resistance, not a fallen EMF. The green rings show the right answers.";
      if (all) burst(verdict, 24);
      emit("l5:bridge", { correct: all });
    };
    var balBtn = document.getElementById("bridge-balance");
    if (balBtn) balBtn.addEventListener("click", balanceOnBench);
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      picks = {}; verdict.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".l05-bq .opts button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
    });
    D.bridge_api = {
      balance: balanceOnBench,
      solve: function () {
        D.bridge.forEach(function (st, i) {
          var opts = qEls[i].querySelector(".opts"); var b = opts.children[st.a]; if (b) b.click();
        });
        check();
      }
    };
  }
})();
