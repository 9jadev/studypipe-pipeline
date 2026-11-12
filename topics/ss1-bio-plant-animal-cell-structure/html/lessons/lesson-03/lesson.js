/* Lesson 03 · interactions: form sort, results table, cube explorer, level ladder and the scale-up bridge.
   LessonKit (Do Now, Wonder Wall, quiz, self-rating, locked solutions) starts itself from lesson-kit.js. */
(function () {
  "use strict";
  var D = window.L03;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  function f1(x) { return (+x).toFixed(1); }
  function pct(x) { return (x * 100).toFixed(1).replace(/\.0$/, ""); }

  // ---------- 1. How does it live? sort ----------
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#form-sort .bin"));
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
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span><span>" + it.name + "</span>";
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
      var el = document.querySelector('.sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the notes below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l3:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ---------- 2. Results table (answers come from the model) ----------
  var tbody = document.querySelector("#results-table tbody");
  function expectedRow(L) {
    var m = D.model(L);
    return { SA: String(m.SA), V: String(m.V), R: f1(m.ratio) };
  }
  if (tbody) {
    var opt = function (list) { return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join(""); };
    D.cubes.forEach(function (L, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + L + "</b></td>" +
        '<td><select data-k="SA" aria-label="Surface area for L = ' + L + ' mm">' + opt(D.SAoptions) + "</select></td>" +
        '<td><select data-k="V" aria-label="Volume for L = ' + L + ' mm">' + opt(D.Voptions) + "</select></td>" +
        '<td><select data-k="R" aria-label="SA to V ratio for L = ' + L + ' mm">' + opt(D.RatioOptions) + "</select></td>";
      tbody.appendChild(tr);
      var saved = window.LessonKit ? window.LessonKit.Store.get("table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("table-" + i, saved);
          s.parentElement.classList.remove("ok", "no");
        });
      });
    });
    document.getElementById("results-check").addEventListener("click", function () {
      var right = 0, filled = 0, total = D.cubes.length * 3;
      Array.prototype.forEach.call(tbody.rows, function (tr, i) {
        var exp = expectedRow(D.cubes[i]);
        tr.querySelectorAll("select").forEach(function (s) {
          s.parentElement.classList.remove("ok", "no");
          if (!s.value) return;
          filled++;
          var ok = s.value === exp[s.getAttribute("data-k")];
          if (ok) right++;
          s.parentElement.classList.add(ok ? "ok" : "no");
        });
      });
      var out = document.getElementById("results-score");
      if (!filled) { out.textContent = "Fill in at least one row from the cube readouts first."; return; }
      out.textContent = right + " of " + filled + " entries match" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l3:table-checked", { right: right, filled: filled });
    });
  }
  var ebody = document.querySelector("#expected-table tbody");
  if (ebody) D.cubes.forEach(function (L) {
    var e = expectedRow(L), tr = document.createElement("tr");
    tr.innerHTML = "<td>" + L + "</td><td>" + e.SA + "</td><td>" + e.V + "</td><td>" + e.R + "</td>";
    ebody.appendChild(tr);
  });

  // ---------- 3. Cube explorer ----------
  var choices = document.getElementById("ex-choices"), detail = document.getElementById("ex-detail");
  var pinEls = [];
  function showPin(i) {
    var L = D.pins[i]; if (L == null) return;
    var m = D.model(L);
    pinEls.forEach(function (el, k) { el.classList.toggle("on", k === i); });
    var outer = Math.round(22 + 14 * L), core = Math.round(outer * m.core_mm / L);
    detail.innerHTML =
      '<div class="mini-row"><div class="cube-mini" aria-hidden="true"><div class="outer" style="width:' + outer + 'px;height:' + outer + 'px">' +
      (core > 0 ? '<div class="core" style="width:' + core + 'px;height:' + core + 'px"></div>' : "") + '</div></div>' +
      '<div><div class="num" style="color:var(--teal)">L = ' + L + ' mm<small>SA : V = 6 ÷ ' + L + ' = ' + f1(m.ratio) + ' mm⁻¹</small></div>' +
      '<p>SA = ' + m.SA + ' mm² · V = ' + m.V + ' mm³</p>' +
      '<p>' + (m.core_mm < 0.01 ? "Fully dyed: no undyed centre." : "Undyed centre " + m.core_mm.toFixed(1) + " mm wide (" + pct(m.undyedFraction) + " % of the volume).") + '</p></div></div>';
    emit("l3:pin", { L: L });
  }
  if (choices && detail) {
    D.pins.forEach(function (L, i) {
      var m = D.model(L), b = document.createElement("button");
      b.type = "button"; b.className = "ph-choice";
      b.innerHTML = '<span class="k">L = ' + L + ' mm</span><span class="n">SA : V = ' + f1(m.ratio) + '</span>';
      b.addEventListener("click", function () { showPin(i); });
      choices.appendChild(b); pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(2);
  }

  // ---------- 4. Level ladder ----------
  var ladderEl = document.getElementById("ladder-list"), ladderTimers = [];
  function ladderClear() { ladderTimers.forEach(clearTimeout); ladderTimers = []; }
  function ladderReset() {
    ladderClear();
    if (ladderEl) Array.prototype.forEach.call(ladderEl.children, function (li) { li.classList.remove("on"); });
  }
  function ladderClimb() {
    if (!ladderEl) return;
    ladderReset();
    var n = ladderEl.children.length;
    Array.prototype.forEach.call(ladderEl.children, function (li, i) {
      ladderTimers.push(setTimeout(function () {
        li.classList.add("on");
        if (i === n - 1) emit("l3:ladder", { levels: n });
      }, 450 + i * 650));
    });
  }
  if (ladderEl) {
    D.levels.forEach(function (lv, i) {
      var li = document.createElement("li");
      li.innerHTML = "<b>" + (i + 1) + "</b><span><strong>" + lv.k + "</strong>" + lv.eg + "</span>";
      ladderEl.appendChild(li);
    });
    document.getElementById("ladder-climb").addEventListener("click", ladderClimb);
    document.getElementById("ladder-reset").addEventListener("click", ladderReset);
    document.addEventListener("l3:zoom", function (e) { if (e.detail && e.detail.mode === "ladder") ladderClimb(); else ladderReset(); });
    D.ladder = { climb: ladderClimb, reset: ladderReset };
  }

  // ---------- 5. Bridge: scale a cube up, then explain ----------
  var sizeRow = document.getElementById("size-row"), sizeOut = document.getElementById("size-out");
  function showSize(i) {
    var s = D.bridgeSizes[i]; if (!s) return;
    Array.prototype.forEach.call(sizeRow.children, function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    var ratio = 6 / s.L, d = s.L / 2;
    sizeOut.innerHTML =
      '<div><span>Body</span><b>' + s.name + '</b></div><div><span>Side L</span><b>' + s.L + ' mm</b></div>' +
      '<div><span>SA : V</span><b>' + (ratio >= 10 ? ratio.toFixed(0) : f1(ratio)) + ' mm⁻¹</b></div>' +
      '<div><span>Surface to centre</span><b>' + (d < 1 ? d.toFixed(2) : d.toFixed(d < 10 ? 1 : 0)) + ' mm</b></div>';
  }
  if (sizeRow && sizeOut) {
    D.bridgeSizes.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "vt-btn"; b.setAttribute("aria-pressed", "false");
      b.textContent = s.name + " · " + s.L + " mm";
      b.addEventListener("click", function () { showSize(i); });
      sizeRow.appendChild(b);
    });
    showSize(0);
    D.bridgeScale = showSize;
  }
  var bq = document.getElementById("bridge-qtext"), bo = document.getElementById("bridge-opts"), bf = document.getElementById("bridge-fb");
  if (bq && bo) {
    bq.textContent = D.bridge.q;
    var LET = ["A", "B", "C", "D"], answered = false;
    D.bridge.o.forEach(function (txt, k) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "qopt";
      b.innerHTML = "<b>" + LET[k] + "</b><span>" + txt + "</span>";
      b.addEventListener("click", function () {
        var ok = k === D.bridge.a;
        Array.prototype.forEach.call(bo.children, function (c, j) { c.classList.toggle("correct", j === D.bridge.a && (ok || answered)); c.classList.toggle("incorrect", j === k && !ok); });
        bf.className = "bridge-fb on" + (ok ? "" : " bad");
        bf.textContent = ok ? D.bridge.why : "Not quite. Scale the cube up above and watch SA : V and the distance from the surface to the centre, then try again.";
        if (ok) { answered = true; burst(bf, 18); }
        emit("l3:bridge", { correct: ok });
      });
      bo.appendChild(b);
    });
    D.bridgeAnswer = function (k) { var c = bo.children[k]; if (c) c.click(); };
  }
})();
