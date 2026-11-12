/* Lesson 01 · interactions: circulation sort, bench results table, expected table, cube-side explorer, bridge */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var Store = window.LessonKit ? window.LessonKit.Store : { get: function (k, d) { return d; }, set: function () {} };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Circulation sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#circ-sort .bin"));
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
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span>" + (it.id === "amoeba" || it.id === "paramecium" ? "<i>" + it.name + "</i>" : it.name);
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
      var el = document.querySelector('#circ-sort .sort-item[data-id="' + it.id + '"]');
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
    emit("l1:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Results table (filled from the bench, answers chosen by the student) ============
  var tbody = document.querySelector("#results-table tbody");
  var measuredInfo = {};   // L -> bench reading
  function expectedFor(L) {
    var m = D.model(L);
    return { ratio: D.fmtRatio(m.ratio), pink: D.fmtInt(m.pink), pct: D.fmtPct(m.pct) };
  }
  function opt(list) { return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join(""); }
  if (tbody) {
    D.SIDES.forEach(function (L) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-L", L);
      // short data-labels keep the phone card layout to one line per heading (LessonKit only stamps cells without one)
      tr.innerHTML =
        '<td data-label="Cube L /mm"><b>' + L + "</b></td>" +
        '<td class="pend" data-label="SA /mm²" data-f="SA">?</td>' +
        '<td class="pend" data-label="V /mm³" data-f="V">?</td>' +
        '<td data-label="SA : V /mm⁻¹"><select data-k="ratio" aria-label="SA : V in mm⁻¹ for the ' + L + ' mm cube">' + opt(D.ratioOptions) + "</select></td>" +
        '<td class="pend" data-label="Moved /mm" data-f="moved">?</td>' +
        '<td data-label="Pink /mm³"><select data-k="pink" aria-label="Volume still pink in mm³ for the ' + L + ' mm cube">' + opt(D.pinkOptions) + "</select></td>" +
        '<td data-label="% clear"><select data-k="pct" aria-label="Percentage of volume colourless for the ' + L + ' mm cube">' + opt(D.pctOptions) + "</select></td>";
      tbody.appendChild(tr);
      var saved = Store.get("table-" + L, {});
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value; Store.set("table-" + L, saved);
          s.parentElement.classList.remove("ok", "no");
        });
      });
    });
    document.addEventListener("l1:bench", function (e) {
      var d = e.detail || {};
      if (d.L_mm == null) return;
      measuredInfo[d.L_mm] = d;
      var tr = tbody.querySelector('tr[data-L="' + d.L_mm + '"]');
      if (!tr) return;
      var moved = d.acidDepth_mm * Math.sqrt(d.t_min / 8);
      var set = function (f, v) { var c = tr.querySelector('[data-f="' + f + '"]'); if (c) { c.textContent = v; c.classList.remove("pend"); } };
      set("SA", D.fmtInt(d.SA)); set("V", D.fmtInt(d.V)); set("moved", moved.toFixed(1));
    });
    document.addEventListener("l1:bench-reset", function () {
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        ["SA", "V", "moved"].forEach(function (f) { var c = tr.querySelector('[data-f="' + f + '"]'); if (c) { c.textContent = "?"; c.classList.add("pend"); } });
      });
      measuredInfo = {};
    });
    document.getElementById("results-check").addEventListener("click", function () {
      var right = 0, filled = 0, total = D.SIDES.length * 3;
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        var L = +tr.getAttribute("data-L"), exp = expectedFor(L);
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
      if (!filled) { out.textContent = "Fill in at least one row from your bench readings first."; return; }
      out.textContent = right + " of " + filled + " values match the expected table" + (filled < total ? " (" + (total - filled) + " still blank)." : (right === total ? ". Excellent!" : "."));
      emit("l1:table-checked", { right: right, filled: filled });
    });
  }

  // expected table, computed from the same model
  var eb = document.getElementById("expected-body");
  if (eb) {
    eb.innerHTML = D.SIDES.map(function (L) {
      var m = D.model(L);
      return "<tr><td>" + L + "</td><td>" + D.fmtInt(m.SA) + "</td><td>" + D.fmtInt(m.V) + "</td><td>" + D.fmtRatio(m.ratio) + "</td><td>" +
        m.moved.toFixed(1) + (L === 5 ? " (meets in the middle)" : "") + "</td><td>" + D.fmtInt(m.pink) + "</td><td>" + D.fmtPct(m.pct) + "</td></tr>";
    }).join("");
  }

  // ============ 3. Cube-side explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track) {
    var nums = document.getElementById("pos-nums"), info = document.getElementById("pos-info"), cubeBox = document.getElementById("pos-cube");
    var pinEls = [];
    var maxL = D.pins[D.pins.length - 1];
    function frac(L) { return Math.log(L) / Math.log(maxL); }   // log spacing keeps 1, 2, 5 apart
    D.pins.forEach(function (L, idx) {
      var m = D.model(L);
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "l01-pin" + (idx % 2 ? " up" : "");
      btn.style.left = (4 + frac(L) * 92) + "%";
      btn.innerHTML = "<span>L = " + L + "</span>";
      btn.setAttribute("aria-label", "Cube side " + L + " millimetres, SA to V " + D.fmtRatio(m.ratio) + " per millimetre");
      btn.addEventListener("click", function () { show(idx); emit("l1:pin", { L: L, index: idx }); });
      track.appendChild(btn); pinEls.push(btn);
    });
    function show(i) {
      var L = D.pins[i], m = D.model(L);
      pinEls.forEach(function (el, k) { el.classList.toggle("on", k === i); });
      var core = m.core;
      info.innerHTML =
        "<b>L = " + L + " mm</b> · SA = 6L² = <b>" + D.fmtInt(m.SA) + " mm²</b> · V = L³ = <b>" + D.fmtInt(m.V) + " mm³</b> · SA : V = 6 ÷ " + L + " = <b>" + D.fmtRatio(m.ratio) + " mm⁻¹</b><br>" +
        (core > 0
          ? "After 8 minutes the acid has moved in 3.0 mm from every face, so the pink centre is <b>" + core + " mm</b> wide (" + D.fmtInt(m.pink) + " mm³ still pink): <b>" + D.fmtPct(m.pct) + " %</b> of the cube is colourless."
          : "The 3.0 mm fronts meet in the middle: the cube is <b>100 % colourless</b>, nothing is left pink.");
      var px = 120 * Math.sqrt(L / maxL) + 18;
      cubeBox.innerHTML = '<div class="cb" style="width:' + px.toFixed(0) + 'px;height:' + px.toFixed(0) + 'px"><i style="width:' + (px * core / L).toFixed(0) + 'px;height:' + (px * core / L).toFixed(0) + 'px"></i></div>' +
        "<small>pink square = the centre the acid has not reached</small>";
    }
    window.L01.showPin = show;
    show(3);
  }

  // ============ 4. Bridge: three reasoning steps ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l01-bq";
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
      verdict.innerHTML = "<strong>Clue one solved.</strong> Chidi's leg muscles are tens of centimetres from his lungs, his SA : V is tiny, and a sprint multiplies their oxygen demand. Only a closed, double, high-pressure system can deliver fast enough, which is why his pulse nearly doubled. You got " + correct + " of " + D.bridge.length + " steps first time.";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l1:bridge", { correct: correct, total: D.bridge.length });
    }
    window.L01.bridgeAnswer = function (step) {
      var card = bridgeRoot.children[step];
      if (!card || card.getAttribute("data-done")) return;
      card.querySelectorAll(".opts button")[D.bridge[step].a].click();
    };
  }
})();
