/* Lesson 02 · interactions: membrane sort, results table, membrane-count explorer and the "which cell resists bursting" bridge */
(function () {
  "use strict";
  var D = window.L02;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var Store = window.LessonKit ? window.LessonKit.Store : { get: function (k, d) { return d; }, set: function () {} };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  function bench() { return window.StudyScenes && window.StudyScenes.bench; }

  /* ================= 1. Membrane sort ================= */
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#membrane-sort .bin"));
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
      b.type = "button";
      b.className = "sort-item";
      b.setAttribute("data-id", it.id);
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
      var el = document.querySelector('#membrane-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.binLabels[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the explanations below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join("");
    fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l2:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  /* ================= 2. Results table (answers computed from the model) ================= */
  var PA = [["", "choose…"], ["yes", "Present"], ["no", "Absent"], ["small", "Small or rare"]];
  var paText = { yes: "Present", no: "Absent", small: "Small or rare" };
  var MEM = [["", "choose…"], ["2", "2"], ["1", "1"], ["0", "0"]];
  var SL = [["", "choose…"], ["yes", "Yes"], ["no", "No"]];
  function opts(list) { return list.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join(""); }

  var tbody = document.querySelector("#results-table tbody");
  var fnCells = {};
  if (tbody) {
    D.rows.forEach(function (row, i) {
      var m = D.modelFor(row.k);
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + m.short + "</b></td>" +
        '<td><select data-k="mem" aria-label="Membranes around ' + m.short + '">' + opts(MEM) + "</select></td>" +
        '<td class="fn-cell" data-fn="' + row.k + '"><span class="td-v">tap it on the dissector</span></td>' +
        '<td><select data-k="P" aria-label="' + m.short + ' in a plant cell">' + opts(PA) + "</select></td>" +
        '<td><select data-k="A" aria-label="' + m.short + ' in an animal cell">' + opts(PA) + "</select></td>" +
        '<td><select data-k="S" aria-label="' + m.short + ' visible on a school slide">' + opts(SL) + "</select></td>";
      tbody.appendChild(tr);
      fnCells[row.k] = tr.querySelector(".fn-cell");
      var saved = Store.get("table-" + i, {});
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k] != null) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value; Store.set("table-" + i, saved);
          s.parentElement.classList.remove("ok", "no");
        });
      });
    });
    var tappedFn = Store.get("fn-shown", {});
    function showFn(k) {
      if (k === "vacuoleA") k = "vacuole";
      var c = fnCells[k];
      if (!c) return;
      c.innerHTML = '<span class="td-v">' + D.modelFor(k).job + "</span>";
      tappedFn[k] = true; Store.set("fn-shown", tappedFn);
    }
    Object.keys(tappedFn).forEach(function (k) { if (tappedFn[k]) { var c = fnCells[k]; if (c) c.innerHTML = '<span class="td-v">' + D.modelFor(k).job + "</span>"; } });
    document.addEventListener("l2:bench", function (e) { if (e.detail && e.detail.key) showFn(e.detail.key); });

    /* on a phone the function sits on a second line, clamped to one line: tap it to open the whole sentence */
    tbody.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest(".fn-cell") : null;
      if (!c || !tbody.contains(c)) return;
      c.parentElement.classList.toggle("open");
    });

    document.getElementById("results-check").addEventListener("click", function () {
      var right = 0, filled = 0, total = D.rows.length * 4;
      Array.prototype.forEach.call(tbody.rows, function (tr, i) {
        var row = D.rows[i], m = D.modelFor(row.k);
        var exp = { mem: String(m.membranes), P: row.P, A: row.A, S: m.slideVisible ? "yes" : "no" };
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
      if (!filled) { out.textContent = "Fill in at least one row from your dissector results first."; return; }
      out.textContent = right + " of " + filled + " answers match" + (filled < total ? " (" + (total - filled) + " still blank)." : (right === total ? ". Perfect table!" : "."));
      emit("l2:table-checked", { right: right, filled: filled });
    });
  }
  var exp = document.querySelector("#expected-table tbody");
  if (exp) {
    D.rows.forEach(function (row) {
      var m = D.modelFor(row.k);
      var tr = document.createElement("tr");
      tr.innerHTML = "<td><b>" + m.short + "</b></td><td>" + m.membranes + "</td><td>" + m.job + "</td><td>" + paText[row.P] + "</td><td>" + paText[row.A] + "</td><td>" + (m.slideVisible ? "Yes" : "No") + "</td>";
      exp.appendChild(tr);
    });
  }

  /* ================= 3. Membrane-count explorer ================= */
  var pinsEl = document.getElementById("mem-pins");
  var infoEl = document.getElementById("mem-info");
  var litNow = null;
  var WORD = { 0: "no membrane", 1: "one membrane", 2: "two membranes" };
  function showPin(n) {
    litNow = n;
    var p = D.pins[n];
    if (pinsEl) pinsEl.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-n") === n ? "true" : "false"); });
    var chips = p.list.map(function (k) { return "<span>" + D.ORG[k].name + "</span>"; }).join("");
    var extra = n === 0
      ? "The cell wall is on this list because it is not a membrane at all: it is cellulose."
      : n === 1
        ? "The cell membrane that wraps the whole cell is also one membrane."
        : "Each of these is wrapped by an outer membrane and an inner membrane.";
    if (infoEl) infoEl.innerHTML = "<b>" + p.list.length + " parts with " + WORD[n] + "</b>" + '<div class="mem-list">' + chips + "</div><p style=\"margin:10px 0 0\">" + extra + "</p>";
    var b = bench();
    if (b && b.lightMembranes) b.lightMembranes(n);
    emit("l2:explore", { n: n, list: p.list });
  }
  if (pinsEl) {
    D.pins.forEach(function (p) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "mem-pin"; btn.setAttribute("data-n", p.n); btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = "<b>" + p.n + "</b><span>" + (p.n === 1 ? "membrane" : "membranes") + "</span>";
      btn.addEventListener("click", function () { showPin(p.n); });
      pinsEl.appendChild(btn);
    });
  }
  window.L02.showPin = showPin;

  /* ================= 4. Bridge: which cell resists bursting in pure water? ================= */
  var pickEl = document.getElementById("bridge-pick");
  var outEl = document.getElementById("bridge-out");
  if (pickEl) {
    var answered = false;
    pickEl.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () { answer(btn.getAttribute("data-cell")); });
    });
    var answer = function (cell) {
      if (answered) return;
      answered = true;
      var ok = cell === "ugu";
      pickEl.querySelectorAll("button").forEach(function (b) {
        var c = b.getAttribute("data-cell");
        b.disabled = true;
        b.classList.toggle("right", c === "ugu");
        b.classList.toggle("wrong", c === cell && !ok);
      });
      outEl.innerHTML = ok
        ? "<strong>Correct.</strong> Water enters the ugu cell by osmosis and the cell swells, but its <strong>cellulose wall</strong> pushes back, so the cell becomes firm (turgid) and does not burst. The red blood cell has only a flexible membrane and no wall, so in pure water it swells until it bursts."
        : "<strong>Not this one.</strong> The red blood cell has only a flexible membrane, so in pure water it swells until it bursts. The <strong>ugu cell</strong> has a cellulose wall that pushes back, so it becomes firm and survives.";
      outEl.classList.add("on");
      if (ok) burst(outEl, 22);
      emit("l2:bridge", { correct: ok });
    };
    window.L02.bridge = function (cell) { answer(cell || "ugu"); };
  }
})();
