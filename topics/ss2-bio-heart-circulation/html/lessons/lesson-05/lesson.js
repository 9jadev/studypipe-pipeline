/* Lesson 05 · interactions: vessel sort, station 1 and 2 results tables, expected table, capillary probe explorer, bridge */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var Store = window.LessonKit ? window.LessonKit.Store : { get: function (k, d) { return d; }, set: function () {} };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Vessel sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#vessel-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
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
      var el = document.querySelector('#vessel-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join("");
    fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l5:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Results tables ============
  // station 1: calibrated wall and lumen, filled from the bench
  var vt = document.getElementById("vessel-table");
  function vcell(tr, f, v, bad) { var c = tr.querySelector('[data-f="' + f + '"]'); if (c) { c.textContent = v; c.classList.remove("pend"); c.classList.toggle("no", !!bad); } }
  document.addEventListener("l5:bench", function (e) {
    var d = e.detail || {};
    if (d.station !== 1 || !vt || (d.part !== "artery" && d.part !== "vein")) return;
    var tr = vt.querySelector('tr[data-v="' + d.part + '"]');
    if (!tr) return;
    var bad = !d.good;
    vcell(tr, "wall", d.wall_mm.toFixed(2), bad); vcell(tr, "lumen", d.lumen_mm.toFixed(1), bad); vcell(tr, "ratio", (d.wall_mm / d.lumen_mm).toFixed(2), bad);
  });
  // station 2: Pc and pi c from the probe, NFP and direction chosen by the student
  var tbody = document.querySelector("#results-table tbody");
  function expectedFor(x) {
    var n = D.nfp(x, "normal");
    return { nfp: D.sgn(n), dir: D.dirText(n) };
  }
  function opt(list) { return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join(""); }
  if (tbody) {
    D.POSITIONS.forEach(function (x) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-x", x);
      tr.innerHTML =
        '<td data-label="Position"><b>' + x.toFixed(2) + "</b></td>" +
        '<td class="pend" data-f="pc">?</td>' +
        '<td class="pend" data-f="pi">?</td>' +
        '<td data-label="NFP (mmHg)"><select data-k="nfp" aria-label="NFP in mmHg at position ' + x.toFixed(2) + '">' + opt(D.nfpOptions) + "</select></td>" +
        '<td><select data-k="dir" aria-label="Direction of fluid movement at position ' + x.toFixed(2) + '">' + opt(D.dirOptions) + "</select></td>";
      tbody.appendChild(tr);
      var saved = Store.get("table-" + x, {});
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value; Store.set("table-" + x, saved);
          s.parentElement.classList.remove("ok", "no");
        });
      });
    });
    document.addEventListener("l5:bench", function (e) {
      var d = e.detail || {};
      if (d.station !== 2 || d.pos == null) return;
      var tr = tbody.querySelector('tr[data-x="' + d.pos + '"]');
      if (!tr) return;
      [["pc", d.pc], ["pi", d.pi]].forEach(function (p) { var c = tr.querySelector('[data-f="' + p[0] + '"]'); if (c) { c.textContent = p[1]; c.classList.remove("pend"); } });
    });
    document.addEventListener("l5:bench-reset", function (e) {
      var d = e.detail || {};
      if (d.station === 1) {
        if (vt) Array.prototype.forEach.call(vt.querySelectorAll("tr[data-v]"), function (tr) {
          if (tr.getAttribute("data-v") === "capillary") return;
          ["wall", "lumen", "ratio"].forEach(function (f) { var c = tr.querySelector('[data-f="' + f + '"]'); if (c) { c.textContent = "?"; c.classList.add("pend"); c.classList.remove("no"); } });
        });
        return;
      }
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        ["pc", "pi"].forEach(function (f) { var c = tr.querySelector('[data-f="' + f + '"]'); if (c) { c.textContent = "?"; c.classList.add("pend"); } });
      });
    });
    document.getElementById("results-check").addEventListener("click", function () {
      var right = 0, filled = 0, total = D.POSITIONS.length * 2;
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        var x = +tr.getAttribute("data-x"), exp = expectedFor(x);
        tr.querySelectorAll("select").forEach(function (s) {
          var k = s.getAttribute("data-k");
          s.parentElement.classList.remove("ok", "no");
          if (!s.value) return;
          filled++;
          var ok = s.value === exp[k];
          if (ok) right++;
          s.parentElement.classList.add(ok ? "ok" : "no");
        });
      });
      var out = document.getElementById("results-score");
      if (!filled) { out.textContent = "Fill in at least one row from your probe readings first."; return; }
      out.textContent = right + " of " + filled + " values match the expected table" + (filled < total ? " (" + (total - filled) + " still blank)." : (right === total ? ". Excellent!" : "."));
      emit("l5:table-checked", { right: right, filled: filled });
    });
  }

  // expected table, computed from the same model
  var eb = document.getElementById("expected-body");
  if (eb) {
    eb.innerHTML = D.POSITIONS.map(function (x) {
      var n = D.nfp(x, "normal");
      return "<tr><td>" + x.toFixed(2) + "</td><td>" + D.pc(x, "normal") + "</td><td>" + D.PI + "</td><td>" + D.sgn(n) + "</td><td>" + D.dir(n) + (n === 1 ? " (barely)" : "") + "</td></tr>";
    }).join("");
  }

  // ============ 3. Capillary probe explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var info = document.getElementById("pos-info"), bars = document.getElementById("pos-bars"), arrow = document.getElementById("pos-arrow");
    var pinEls = [], cur = 2, exMode = "normal";
    D.pins.forEach(function (x, idx) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "l05-pin";
      btn.style.left = (4 + x * 92) + "%";
      btn.innerHTML = "<span>" + x.toFixed(2) + "</span>";
      btn.setAttribute("aria-label", "Position " + x.toFixed(2) + " along the capillary");
      btn.addEventListener("click", function () { show(idx); emit("l5:pin", { x: x, index: idx, mode: exMode }); });
      track.appendChild(btn); pinEls.push(btn);
    });
    function bar(label, cls, val, text) {
      return '<div class="l05-bar"><span>' + label + '</span><div class="rail"><div class="fill ' + cls + '" style="width:' + Math.min(100, Math.abs(val) / 40 * 100).toFixed(1) + '%"></div></div><b>' + text + "</b></div>";
    }
    function show(i) {
      cur = i;
      var x = D.pins[i], k = D.mode(exMode), p = D.pc(x, exMode), n = D.nfp(x, exMode);
      pinEls.forEach(function (el, j) { el.classList.toggle("on", j === i); });
      bars.innerHTML = bar("Pc", "", p, p + " mmHg") + bar("πc", "pi", k.pi, k.pi + " mmHg") + bar("NFP", n >= 0 ? "out" : "in", n, D.sgn(n) + " mmHg");
      arrow.innerHTML = '<span class="ar ' + (n < 0 ? "in" : "") + '">' + (n > 0 ? "↑" : n < 0 ? "↓" : "↔") + "</span>" + (n > 0 ? "fluid pushed OUT" : n < 0 ? "fluid drawn IN" : "balanced") + " · arrow length scaled to NFP";
      info.innerHTML = "<b>Position " + x.toFixed(2) + "</b> (" + k.label + ") · Pc = <b>" + p + " mmHg</b> · πc = <b>" + k.pi + " mmHg</b> · NFP = " + p + " − " + k.pi + " = <b>" + D.sgn(n) + " mmHg</b>: " + D.dirText(n) + "." +
        (exMode === "congest" && x === 1 ? " No reabsorption zone: even the venous end pushes fluid out, so Mama Bisi's ankle swells." : "");
    }
    function setExMode(m) {
      exMode = m;
      document.querySelectorAll("#pos-mode [data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false"); });
      show(cur);
    }
    document.querySelectorAll("#pos-mode [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setExMode(b.getAttribute("data-mode")); emit("l5:pin", { x: D.pins[cur], index: cur, mode: exMode, modeSwitch: true }); });
    });
    window.L05.showPin = show;
    window.L05.setExplorerMode = setExMode;
    show(0);
  }

  // ============ 4. Bridge: three reasoning steps ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l05-bq";
      card.innerHTML = "<h4>Step " + (i + 1) + ". " + st.q + '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"), why = card.querySelector(".why");
      st.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = text;
        b.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          card.setAttribute("data-done", "1");
          var ok = k === st.a;
          if (ok) correct++;
          answered++;
          Array.prototype.forEach.call(opts.children, function (x, j) {
            x.disabled = true;
            x.classList.toggle("correct", j === st.a);
            x.classList.toggle("incorrect", j === k && !ok);
          });
          why.textContent = (ok ? "Yes. " : "Not quite. ") + st.why;
          why.classList.add("on");
          if (ok) burst(b, 10);
          if (answered === D.bridge.length) finishBridge();
        });
        opts.appendChild(b);
      });
      bridgeRoot.appendChild(card);
    });
    function finishBridge() {
      verdict.innerHTML = "<strong>Case 2 solved.</strong> Standing all day, and leaky valves in her varicose veins, let blood pool in Mama Bisi's lower legs; the venous-end pressure rose, so fluid kept leaving the capillaries and outran the lymph. Drinking water was not the cause, so Baba Sule's advice is wrong. Remedies: raise the feet, walk about to work the muscle pump, and have her high blood pressure treated (Lesson 7). You got " + correct + " of " + D.bridge.length + " steps first time.";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l5:bridge", { correct: correct, total: D.bridge.length });
    }
    window.L05.bridgeAnswer = function (step) {
      var card = bridgeRoot.children[step];
      if (!card || card.getAttribute("data-done")) return;
      card.querySelectorAll(".opts button")[D.bridge[step].a].click();
    };
  }
})();
