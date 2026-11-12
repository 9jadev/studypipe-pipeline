/* Lesson 04 · interactions: movement sort, results table, expected table, concentration explorer, mystery bridge.
   LessonKit (shared) boots itself: Do Now, Wonder Wall, quiz, ratings, locked solutions. */
(function () {
  "use strict";
  var D = window.L04;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var Store = window.LessonKit ? window.LessonKit.Store : { get: function (k, d) { return d; }, set: function () {} };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var MINUS = "−";
  function signed(v, d) { return (v > 0 ? "+" : v < 0 ? MINUS : "") + Math.abs(v).toFixed(d); }

  // ===== 1. Movement sort =====
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#kitchen-sort .bin"));
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
      var el = document.querySelector('#kitchen-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the explanations below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join("");
    fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l4:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ===== 2. Results table (checked against the bench readings) =====
  var KEYS = ["m0", "m1", "ch", "pct"];
  var tbody = document.querySelector("#results-table tbody");
  function num(s) {
    s = String(s == null ? "" : s).replace(/−/g, "-").replace(/,/g, ".").replace(/[+\s%g]/g, "");
    if (s === "" || s === "-" || s === ".") return NaN;
    return parseFloat(s);
  }
  function benchRows() {
    var b = window.StudyScenes && window.StudyScenes.bench;
    return b && b.reading ? b.reading().rows : null;
  }
  if (tbody) {
    D.expected.forEach(function (row, i) {
      var tr = document.createElement("tr");
      var saved = Store.get("table-" + i, {});
      var h = "<td><b>" + row.c.toFixed(1) + "</b></td>";
      var labels = { m0: "Initial mass in grams", m1: "Final mass in grams", ch: "Change in grams", pct: "Percentage change" };
      KEYS.forEach(function (k) {
        h += '<td><input class="rt-in" type="text" inputmode="decimal" autocomplete="off" data-k="' + k + '" aria-label="' + labels[k] + ", tube " + (i + 1) + '"></td>';
      });
      tr.innerHTML = h;
      tbody.appendChild(tr);
      tr.querySelectorAll("input").forEach(function (inp) {
        var k = inp.getAttribute("data-k");
        if (saved[k] != null) inp.value = saved[k];
        inp.addEventListener("input", function () {
          saved[k] = inp.value; Store.set("table-" + i, saved);
          inp.parentElement.classList.remove("ok", "no");
        });
      });
    });

    document.getElementById("results-fill").addEventListener("click", function () {
      var rows = benchRows(), n = 0;
      if (!rows) { toast("The 3D bench is not running on this device. Use the expected table to practise."); return; }
      Array.prototype.forEach.call(tbody.rows, function (tr, i) {
        var r = rows[i];
        if (!r || !r.done) return;
        var saved = Store.get("table-" + i, {});
        saved.m0 = r.m0.toFixed(2); saved.m1 = r.m1.toFixed(2);
        Store.set("table-" + i, saved);
        tr.querySelector('[data-k="m0"]').value = saved.m0;
        tr.querySelector('[data-k="m1"]').value = saved.m1;
        n++;
      });
      toast(n ? "Copied the masses for " + n + " tube" + (n > 1 ? "s" : "") + ". Now work out the change and the % change." : "Re-weigh at least one tube on the bench first.");
    });

    document.getElementById("results-check").addEventListener("click", function () {
      var rows = benchRows(), right = 0, filled = 0, noBench = 0;
      Array.prototype.forEach.call(tbody.rows, function (tr, i) {
        var r = rows && rows[i];
        tr.querySelectorAll("input").forEach(function (inp) {
          var k = inp.getAttribute("data-k"), v = num(inp.value);
          inp.parentElement.classList.remove("ok", "no");
          if (isNaN(v)) return;
          if (!r || !r.done) { noBench++; return; }
          filled++;
          var exp = k === "m0" ? r.m0 : k === "m1" ? r.m1 : k === "ch" ? r.change_g : r.pct;
          var tol = k === "pct" ? 0.11 : 0.006;
          var ok = Math.abs(v - exp) <= tol;
          if (ok) right++;
          inp.parentElement.classList.add(ok ? "ok" : "no");
        });
      });
      var out = document.getElementById("results-score");
      if (!filled) out.textContent = noBench ? "Re-weigh those tubes on the 3D bench first, then check." : "Type some of your readings first.";
      else out.textContent = right + " of " + filled + " entries match your bench readings" + (right === filled ? ". Well done!" : ". Recheck the red ones: change = final − initial, then ÷ initial × 100.");
      emit("l4:table-checked", { right: right, filled: filled });
    });
  }

  // expected table (careful technique)
  var ebody = document.querySelector("#expected-table tbody");
  if (ebody) D.expected.forEach(function (r) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + r.c.toFixed(1) + "</td><td>" + r.m0.toFixed(2) + "</td><td>" + r.m1.toFixed(2) + "</td><td>" + r.ch + "</td><td>" + r.pct + "</td>";
    ebody.appendChild(tr);
  });

  // ===== 3. Concentration explorer (strip, ugu cell, red cell) =====
  function pctModel(c) {
    if (window.OsmometerKit && OsmometerKit.model && OsmometerKit.model.pct) return OsmometerKit.model.pct(c);
    var xs = [0, .2, .4, .6, .8, 1], ys = [14, 4.8, -2, -8, -12.2, -16.5], k = Math.max(0, Math.min(4, Math.floor(c / 0.2)));
    return ys[k] + (ys[k + 1] - ys[k]) * (c - xs[k]) / 0.2;
  }
  function svgStrip(s) {
    var h = 76 * (1 + 0.16 * s), w = 30 * (1 + 0.09 * s), cx = 60, cy = 56;
    return '<svg viewBox="0 0 120 110" role="img" aria-label="Potato strip">' +
      '<rect class="xp-ref" x="' + (cx - 15) + '" y="' + (cy - 38) + '" width="30" height="76" rx="6"/>' +
      '<rect class="xp-strip" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="6" ' + (s < -0.3 ? 'transform="rotate(' + (-s * 7) + " " + cx + " " + (cy + h / 2) + ')"' : "") + "/></svg>";
  }
  function svgPlant(s) {
    var W = 84, H = 64, x0 = 18, y0 = 22, cx = x0 + W / 2, cy = y0 + H / 2;
    var f = s >= 0 ? 0.86 + 0.13 * s : 0.86 + 0.52 * s;   // protoplast size: fills the wall when turgid, shrinks when plasmolysed
    var pw = (W - 8) * f, ph = (H - 8) * f, rx = 10 + (s < 0 ? 16 * -s : 0);
    return '<svg viewBox="0 0 120 110" role="img" aria-label="Ugu cell">' +
      '<rect class="xp-wall" x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" rx="8"/>' +
      '<rect class="xp-proto" x="' + (cx - pw / 2) + '" y="' + (cy - ph / 2) + '" width="' + pw + '" height="' + ph + '" rx="' + rx + '"/>' +
      (s < -0.2 ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + Math.max(5, ph * 0.18) + '" style="fill:rgba(var(--ink-950-rgb), .35)"/>' : '<circle cx="' + cx + '" cy="' + cy + '" r="' + (9 + 5 * Math.max(0, s)) + '" style="fill:rgba(var(--ink-950-rgb), .25)"/>') + "</svg>";
  }
  function svgRbc(s) {
    var cx = 60, cy = 55, R = s > 0 ? 26 * (1 + 0.35 * s) : 26 * (1 + 0.3 * s);
    if (s > 0.9) {
      var bits = "";
      for (var i = 0; i < 9; i++) {
        var a = i / 9 * Math.PI * 2, r1 = 34 + (i % 3) * 5;
        bits += '<path class="xp-rbc" d="M' + (cx + Math.cos(a) * r1) + " " + (cy + Math.sin(a) * r1 * 0.8) + " q" + (Math.cos(a + 1.4) * 8) + " " + (Math.sin(a + 1.4) * 8) + " " + (Math.cos(a + 0.5) * 9) + " " + (Math.sin(a + 0.5) * 9) + '" style="fill:none;stroke-width:3.5"/>';
      }
      return '<svg viewBox="0 0 120 110" role="img" aria-label="Burst red cell">' + bits + '<circle cx="' + cx + '" cy="' + cy + '" r="7" style="fill:rgba(var(--crimson-rgb), .5)"/></svg>';
    }
    var pts = [], spike = Math.max(0, -s) * 0.4, N = 72;
    for (var k = 0; k < N; k++) {
      var th = k / N * Math.PI * 2, rr = R * (1 + spike * Math.max(0, Math.sin(th * 11)));
      pts.push((cx + Math.cos(th) * rr).toFixed(1) + "," + (cy + Math.sin(th) * rr * (s > 0 ? 1 : 0.92)).toFixed(1));
    }
    var dimple = s < 0.35 ? '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (R * 0.5) + '" ry="' + (R * 0.28) + '" style="fill:rgba(var(--ink-950-rgb), .35)"/>' : "";
    return '<svg viewBox="0 0 120 110" role="img" aria-label="Red cell"><polygon class="xp-rbc" points="' + pts.join(" ") + '"/>' + dimple + "</svg>";
  }
  var choices = document.getElementById("xp-choices");
  var vis = document.getElementById("xp-visual");
  var detail = document.getElementById("xp-detail");
  var pinBtns = [];
  function showPin(i) {
    var d = D.pins[i];
    if (!d || !vis) return;
    pinBtns.forEach(function (b, k) { b.classList.toggle("on", k === i); });
    var p = pctModel(d.c), s = p > 0 ? p / 14 : p / 16.5;
    s = Math.max(-1, Math.min(1, s));
    vis.innerHTML =
      "<figure>" + svgStrip(s) + "<figcaption><b>Potato strip</b>" + d.strip + "</figcaption></figure>" +
      "<figure>" + svgPlant(s) + "<figcaption><b>Ugu cell</b>" + d.plant + "</figcaption></figure>" +
      "<figure>" + svgRbc(d.c === 0 ? 1 : s) + "<figcaption><b>Red cell</b>" + d.rbc + "</figcaption></figure>";
    var pr = Math.round(p * 10) / 10;
    detail.style.setProperty("--pcol", d.tone === "hypotonic" ? "var(--teal)" : "var(--amber)");
    detail.innerHTML = '<div class="num">' + d.c.toFixed(1) + " mol dm⁻³: " + signed(pr, 1) + ' %<small>' + (d.tone === "hypotonic" ? "more dilute than the cell sap (hypotonic)" : "more concentrated than the cell sap (hypertonic)") + "</small></div><p>" + d.note + "</p>";
    emit("l4:pin", { i: i, c: d.c, pct: pr });
  }
  if (choices && D.pins) {
    D.pins.forEach(function (d, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "ph-choice";
      b.style.setProperty("--pcol", d.tone === "hypotonic" ? "var(--teal)" : "var(--amber)");
      b.innerHTML = '<span class="k">' + d.c.toFixed(1) + ' <small>mol dm⁻³</small></span><span class="n">' + (d.c === 0 ? "pure water" : d.tone) + "</span>";
      b.addEventListener("click", function () { showPin(i); });
      choices.appendChild(b); pinBtns.push(b);
    });
    showPin(0);
  }

  // ===== 4. The mystery, solved =====
  var grid = document.getElementById("case-grid");
  var solved = {}, firstTry = {}, verdict = document.getElementById("bridge-verdict");
  var OPT = [["in", "Water goes in"], ["out", "Water goes out"], ["none", "No net movement"]];
  if (grid && D.cases) {
    D.cases.forEach(function (c) {
      var card = document.createElement("div");
      card.className = "case-card"; card.setAttribute("data-case", c.id);
      var h = '<h4>' + c.emo + " " + c.title + '</h4><p class="sub">' + c.sub + '</p><div class="opts">';
      OPT.forEach(function (o) { h += '<button class="vt-btn" type="button" data-o="' + o[0] + '" aria-pressed="false">' + o[1] + "</button>"; });
      h += '</div><div class="fb" aria-live="polite"></div>';
      card.innerHTML = h;
      grid.appendChild(card);
      card.querySelectorAll(".opts button").forEach(function (b) {
        b.addEventListener("click", function () {
          if (solved[c.id]) return;
          var o = b.getAttribute("data-o"), ok = o === c.right, fb = card.querySelector(".fb");
          if (firstTry[c.id] == null) firstTry[c.id] = ok;
          b.setAttribute("aria-pressed", "true");
          b.classList.add(ok ? "right" : "wrong");
          fb.innerHTML = ok ? c.ok : c.bad;
          fb.classList.add("on");
          if (ok) {
            solved[c.id] = true; card.classList.add("done");
            burst(card, 12);
            checkBridge();
          } else setTimeout(function () { b.classList.remove("wrong"); b.setAttribute("aria-pressed", "false"); }, 900);
        });
      });
    });
  }
  function checkBridge() {
    var n = Object.keys(solved).length;
    if (n < D.cases.length) return;
    var correct = D.cases.filter(function (c) { return firstTry[c.id]; }).length;
    if (verdict) {
      verdict.innerHTML = "<strong>Mystery solved!</strong> Salty water is <strong>hypertonic</strong> to ugu cell sap, so water left by osmosis, the cells plasmolysed and the leaf wilted: the salt did not soak in. Plain water dripped into a vein is <strong>hypotonic</strong> to red cells, so water rushes in and they burst (haemolysis). 0.9% saline is <strong>isotonic</strong> with blood, so the cells keep their shape.";
      verdict.classList.add("on");
      burst(verdict, 24);
    }
    emit("l4:bridge", { correct: correct, total: D.cases.length });
  }
  var sIn = document.getElementById("saline-in");
  if (sIn) document.getElementById("saline-check").addEventListener("click", function () {
    var v = num(sIn.value), fb = document.getElementById("saline-fb");
    if (isNaN(v)) { fb.textContent = " Type a number first."; return; }
    // 0.9 g per 100 cm3 x 500 cm3 = 4.5 g
    fb.textContent = Math.abs(v - 4.5) < 0.005 ? " Correct: 0.9 ÷ 100 × 500 = 4.5 g." : v === 0.9 ? " That is the mass in only 100 cm³. A 500 cm³ bag holds five times as much." : " Not quite: find the mass in 1 cm³ first (0.9 ÷ 100), then multiply by 500.";
  });
  var bridgeApi = {
    solveAll: function () { D.cases.forEach(function (c) { var card = grid.querySelector('[data-case="' + c.id + '"]'); var b = card && card.querySelector('[data-o="' + c.right + '"]'); if (b) b.click(); }); }
  };

  // StudyMath writes a generic guide under the equation banner; replace it with one that matches this formula
  window.addEventListener("load", function () {
    var n = document.querySelector("#eq-pct .m-eq-note span");
    if (n) n.innerHTML = "<strong>Calculation &amp; Formula Guide:</strong> Subtract the initial mass from the final mass to get the change, divide by the initial mass, then multiply by 100. A loss gives a negative answer.";
  });

  // ===== narrator helpers =====
  D.showPin = showPin;
  D.bridge = bridgeApi;
  D.method = function (n) {
    document.querySelectorAll("#method-cards .method").forEach(function (m, i) { m.classList.toggle("now", i === n - 1); });
  };
})();
