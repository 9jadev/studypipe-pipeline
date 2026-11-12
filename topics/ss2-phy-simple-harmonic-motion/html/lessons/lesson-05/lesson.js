/* Lesson 05 · interactions: precaution-or-error sort (SortDnD), the WAEC composite table the learner fills
   (rows arrive from the bench; t̄, T, T² typed and checked; T² accepted within ±0.002 s²), the length explorer
   (#pos-explorer) and the mystery bridge. LessonKit runs Do Now, Wonder Wall, quiz, rating and locked solutions.
   Events: l5:sort, l5:table, l5:row, l5:table-reset, l5:pin, l5:bridge. */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;
  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && window.StudyNarrator.burst && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var FOURPI2 = 4 * Math.PI * Math.PI, G_CLASS = 9.79;

  // ============ 1. Sort: precaution or source of error ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#l05-sort .bin"));
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
      var el = document.querySelector('#l05-sort .sort-item[data-id="' + it.id + '"]');
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
    emit("l5:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. The composite table (#results-table) ============
  var tbody = document.querySelector("#results-table tbody");
  var tableLine = document.getElementById("table-line");
  var working = document.getElementById("table-working");
  var rowsByL = {};      // "0.400" → { l, t1, t2, tmean, T, T2 } from the kit model
  var checked = false;

  function cellInput(key, l, ph) {
    return '<input class="pd-in" inputmode="decimal" autocomplete="off" data-k="' + key + '" aria-label="' + key + " for l = " + l + ' m" placeholder="' + ph + '">';
  }
  function addRow(r) {
    var key = r.l.toFixed(3);
    var fresh = !rowsByL[key];
    rowsByL[key] = r;
    var tr = tbody.querySelector('tr[data-l="' + key + '"]');
    if (!tr) {
      tr = document.createElement("tr"); tr.setAttribute("data-l", key);
      tr.innerHTML = "<td>" + key + "</td><td>" + r.t1.toFixed(2) + "</td><td>" + r.t2.toFixed(2) + "</td>" +
        "<td>" + cellInput("tmean", key, "t̄") + "</td><td>" + cellInput("T", key, "T") + "</td><td>" + cellInput("T2", key, "T²") + "</td>";
      var after = null;
      Array.prototype.forEach.call(tbody.children, function (x) { if (!after && +x.getAttribute("data-l") > r.l) after = x; });
      tbody.insertBefore(tr, after);
      tr.querySelectorAll("input").forEach(function (inp) { inp.addEventListener("input", function () { inp.classList.remove("ok", "bad"); }); });
    } else {
      tr.children[1].textContent = r.t1.toFixed(2); tr.children[2].textContent = r.t2.toFixed(2);
    }
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
    paintLine();
    if (fresh) paintWorking();
  }
  function paintLine() {
    var n = Object.keys(rowsByL).length, ok = tbody.querySelectorAll('input[data-k="T2"].ok').length;
    if (tableLine) tableLine.textContent = "Lengths timed: " + n + " of 5 · T² accepted: " + ok + " of " + n;
  }
  function num(v) { v = String(v || "").replace(/\s/g, "").replace(",", "."); return v === "" || isNaN(+v) ? null : +v; }
  // tolerances: t̄ to 2 d.p. (±0.005 s), T to 3 d.p. (±0.0015 s), T² ±0.002 s² (02-lesson.md)
  var TOL = { tmean: 0.0051, T: 0.0016, T2: 0.0021 };
  function checkTable() {
    var keys = Object.keys(rowsByL);
    if (!keys.length) { toast("Time 20 oscillations twice at a length first. Each length adds a row."); return; }
    var right = 0, total = 0, rowsOk = 0;
    keys.forEach(function (k) {
      var r = rowsByL[k], tr = tbody.querySelector('tr[data-l="' + k + '"]'), allOk = true;
      ["tmean", "T", "T2"].forEach(function (f) {
        var inp = tr.querySelector('input[data-k="' + f + '"]'), v = num(inp.value);
        total++;
        var ok = v != null && Math.abs(v - r[f]) <= TOL[f];
        inp.classList.toggle("ok", ok); inp.classList.toggle("bad", !ok && v != null);
        if (ok) right++; else allOk = false;
        if (f === "T2" && ok) emit("l5:row", { l: r.l, T2: r.T2 });
      });
      if (allOk) rowsOk++;
    });
    checked = true;
    if (working) working.classList.remove("locked");
    paintLine();
    toast(right === total ? "Every cell correct. Your points are on the graph." : right + " of " + total + " cells correct. Red cells need another look; open the working below if you are stuck.");
    if (right === total && keys.length >= 5) burst(document.getElementById("results-table"), 18);
    emit("l5:table", { correct: right, total: total, rows: rowsOk, lengths: keys.length });
  }
  function paintWorking() {
    var body = document.getElementById("table-working-body");
    if (!body) return;
    var keys = Object.keys(rowsByL).sort();
    body.innerHTML = keys.length ? keys.map(function (k) {
      var r = rowsByL[k];
      return "<p><b>l = " + k + " m:</b> <code>t̄ = (" + r.t1.toFixed(2) + " + " + r.t2.toFixed(2) + ") ÷ 2 = " + r.tmean.toFixed(2) + "</code> s · <code>T = " + r.tmean.toFixed(2) + " ÷ 20 = " + r.T.toFixed(3) +
        "</code> s · <code>T² = " + r.T2.toFixed(3) + "</code> s² (squared from the unrounded T; " + r.T.toFixed(3) + "² = " + (Math.round(r.T * 1000) / 1000 * (Math.round(r.T * 1000) / 1000)).toFixed(3) + " is also accepted).</p>";
    }).join("") : "<p>Time a length on the bench first.</p>";
  }
  if (working) {
    working.classList.add("locked");
    working.querySelector("summary").addEventListener("click", function (e) {
      if (!working.open && !checked) { e.preventDefault(); toast("Fill your table and press Check first, then compare with the working."); }
    });
  }
  document.addEventListener("l5:bench", function (e) {
    var d = e.detail || {};
    (d.rows || []).forEach(function (r) {
      if (r.fault !== "none" || r.t1 == null || r.t2 == null) return;
      // T and T² straight from the model (T² from the unrounded T)
      var P = window.PendulumKit ? PendulumKit.model.practical(r.l, { g: G_CLASS }) : null;
      addRow({ l: r.l, t1: r.t1, t2: r.t2, tmean: P ? P.tmean : r.tmean, T: P ? P.T : r.T, T2: P ? P.T2 : r.T2 });
    });
  });
  document.addEventListener("l5:bench-reset", function () {
    rowsByL = {}; checked = false; if (tbody) tbody.innerHTML = "";
    if (working) { working.open = false; working.classList.add("locked"); }
    paintLine(); paintWorking(); emit("l5:table-reset", {});
  });
  var tc = document.getElementById("table-check"); if (tc) tc.addEventListener("click", checkTable);
  paintLine(); paintWorking();
  D.checkTable = checkTable;

  // ============ 3. Length explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), pinEls = [], top = document.getElementById("pos-top");
    var cur = 2, toTop = false;
    var pg = window.StudyGraph && document.getElementById("pos-graph") ? StudyGraph.create(document.getElementById("pos-graph"), {
      theme: "paper", x: { label: "l", unit: "m", min: 0, max: 1.1, step: 0.2, decimals: 1 }, y: { label: "T²", unit: "s²", min: 0, max: 4.5, step: 1, decimals: 0 }, ratio: 0.62,
      aria: "The T squared against l line for g = 9.79, with the chosen length marked"
    }) : null;
    var T2of = function (l) { return FOURPI2 * l / G_CLASS; };
    var showPin = function (i, quiet) {
      var l = D.pins[i]; if (l == null) return;
      cur = i;
      pinEls.forEach(function (el, j) { el.setAttribute("aria-pressed", String(j === i)); });
      var T = window.PendulumKit ? PendulumKit.model.periodSmall(l, G_CLASS) : 2 * Math.PI * Math.sqrt(l / G_CLASS);
      var lRec = toTop ? l - 0.020 : l;
      info.innerHTML = "<b>l = " + l.toFixed(3) + " m</b> · T = 2π√(l/g) = <b>" + T.toFixed(3) + " s</b> · T² = <b>" + (T * T).toFixed(3) + " s²</b>." +
        (toTop ? "<br>Measured to the top of the bob, the point is plotted at l = " + lRec.toFixed(3) + " m: <b>0.020 m to the left</b>. All five shift together, so the line moves left, keeps its slope and misses the origin." : "<br>Every length lands on one straight line through the origin, slope 4π²/g = " + (FOURPI2 / G_CLASS).toFixed(2) + " s² m⁻¹.");
      if (pg) {
        var series = [{ id: "line", name: "T² = (4π²/g) l", tone: "teal", fn: T2of, fnRange: [0, 1.1] }];
        if (toTop) series.push({ id: "top", name: "length to the top", tone: "pink", dashed: true, fn: function (x) { return T2of(x + 0.020); }, fnRange: [0, 1.08], points: D.pins.map(function (p) { return [p - 0.020, +T2of(p).toFixed(3)]; }) });
        pg.set({ series: series, marker: { x: lRec, y: T * T, label: "l " + lRec.toFixed(3), tone: "amber" } });
      }
      if (!quiet) emit("l5:pin", { l: l, index: i, toTop: toTop });
    };
    D.pins.forEach(function (l, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pos-pin"; b.setAttribute("aria-pressed", "false");
      b.textContent = l.toFixed(3);
      b.setAttribute("aria-label", "Length " + l.toFixed(3) + " metres");
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b); pinEls.push(b);
    });
    if (top) top.addEventListener("click", function () { toTop = !toTop; top.setAttribute("aria-pressed", String(toTop)); showPin(cur); });
    D.showPin = showPin;
    showPin(2, true);
  }

  // ============ 4. Mystery bridge (#bridge) ============
  var card = document.getElementById("bridge-card");
  if (card && D.bridge) {
    var qEls = Array.prototype.slice.call(card.querySelectorAll(".l05-bq"));
    var picks = {}, verdict = document.getElementById("bridge-verdict");
    qEls.forEach(function (qEl, qi) {
      var opts = qEl.querySelector(".opts"), stq = D.bridge[qi];
      stq.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text; b.setAttribute("data-v", String(k)); b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          picks[qi] = k;
          Array.prototype.forEach.call(opts.children, function (x) { x.setAttribute("aria-pressed", String(x === b)); x.classList.remove("ok", "no"); });
        });
        opts.appendChild(b);
      });
    });
    var check = function () {
      if (Object.keys(picks).length < D.bridge.length) { toast("Answer all three questions first."); return; }
      var right = 0;
      qEls.forEach(function (qEl, qi) {
        var ok = picks[qi] === D.bridge[qi].a; if (ok) right++;
        Array.prototype.forEach.call(qEl.querySelectorAll(".opts button"), function (x, k) {
          x.classList.toggle("ok", k === D.bridge[qi].a); x.classList.toggle("no", k === picks[qi] && !ok);
        });
      });
      var all = right === D.bridge.length;
      var gUse = (window.L05Graph && window.L05Graph.points().length >= 2) ? FOURPI2 / StudyGraph.leastSquares(window.L05Graph.points(), true).m : G_CLASS;
      var w = 12.57, A = gUse / (w * w);
      verdict.innerHTML = (all ? "<strong>Verdict:</strong> " : "<strong>Not yet (" + right + " of 3).</strong> Look at the green rings. ") +
        "With g = " + gUse.toFixed(2) + " m s⁻² and ω = 12.57 rad s⁻¹, the danger amplitude is A = g ÷ ω² = " + gUse.toFixed(2) + " ÷ 158 = <b>" + (A * 100).toFixed(1) + " cm</b>. " +
        "Our measured g confirms Zainab's danger line: the crates leave the carrier once the bounce amplitude reaches about 6.2 cm." +
        '<br><small class="note">Story numbers are a teaching model, not real measurements.</small>';
      verdict.classList.add("on"); verdict.classList.toggle("bad", !all);
      if (all) burst(verdict, 22);
      emit("l5:bridge", { correct: all, right: right });
    };
    document.getElementById("bridge-check").addEventListener("click", check);
    document.getElementById("bridge-reset").addEventListener("click", function () {
      picks = {}; verdict.classList.remove("on", "bad"); verdict.innerHTML = "";
      card.querySelectorAll(".opts button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.classList.remove("ok", "no"); });
    });
    D.bridgeCheck = check;
  }
})();
