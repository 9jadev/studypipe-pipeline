/* Lesson 04 · interactions: LessonKit boot, Shunt/Multiplier Sort, Conversion Table, Meter Range Explorer, and Multiplier vs Total Resistance Bridge */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l04",
      wonderSeeds: [
        "How can a tiny moving-coil galvanometer that burns out above 10 mA safely measure a 5.0 A starter current? — Amaka",
        "Why do we connect a low-resistance shunt in PARALLEL for an ammeter, yet connect the finished ammeter in SERIES with the load? — Mazi Okafor",
        "What is the difference between the added multiplier resistance R_m and the total resistance of a voltmeter? — Sadiq",
        "What happens if a student accidentally connects an ammeter in parallel across a 12 V battery? — Ifeoma"
      ],
      quiz: window.LESSON_QUIZ || []
    });
  }

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // 1. Sort activity
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll(".bin"));
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
    var sx, sy, dragging = false, ghost = null, pid = null;
    b.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      sx = e.clientX; sy = e.clientY; pid = e.pointerId; dragging = false;
      try { b.setPointerCapture(pid); } catch (er) {}
    });
    b.addEventListener("pointermove", function (e) {
      if (pid !== e.pointerId) return;
      if (!dragging && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
        dragging = true;
        ghost = b.cloneNode(true);
        ghost.style.cssText = "position:fixed;z-index:95;pointer-events:none;margin:0;transform:rotate(-3deg) scale(1.05);box-shadow:0 18px 30px -10px rgba(0,0,0,.6)";
        document.body.appendChild(ghost);
        b.classList.add("dragging");
      }
      if (dragging) {
        ghost.style.left = (e.clientX - ghost.offsetWidth / 2) + "px";
        ghost.style.top = (e.clientY - ghost.offsetHeight / 2) + "px";
        var under = document.elementFromPoint(e.clientX, e.clientY);
        var over = under && under.closest(".bin");
        bins.forEach(function (bn) { bn.classList.toggle("over", bn === over); });
      }
    });
    function end(e) {
      if (pid !== e.pointerId) return;
      pid = null;
      if (dragging) {
        var under = document.elementFromPoint(e.clientX, e.clientY);
        var over = under && under.closest(".bin");
        if (ghost) ghost.remove();
        ghost = null;
        b.classList.remove("dragging");
        if (over) place(b, over);
        else bins.forEach(function (bn) { bn.classList.remove("over"); });
        dragging = false;
      } else if (e.type === "pointerup") pick(b);
    }
    b.addEventListener("pointerup", end);
    b.addEventListener("pointercancel", end);
    b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(b); } });
    b.addEventListener("click", function (e) { e.preventDefault(); });
  }

  function checkSort() {
    var placed = 0, right = 0, rows = [];
    var labels = { shm: "Galvanometer Coil (I_g, R_g, V_g)", periodic: "Ammeter Conversion (Parallel Shunt R_s)", non: "Voltmeter Conversion (Series Multiplier R_m)" };
    D.items.forEach(function (it) {
      var el = document.querySelector('.sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      if (!bin) return;
      placed++;
      var g = bin.getAttribute("data-bin");
      var ok = g === it.group;
      el.classList.toggle("right", ok);
      el.classList.toggle("wrong", !ok);
      if (ok) right++;
      else rows.push("<li><strong>" + it.emo + " " + it.name + "</strong> belongs in <em>" + labels[it.group] + "</em> — " + it.fact + "</li>");
    });
    var fb = document.getElementById("sort-feedback");
    document.getElementById("sort-score").textContent = placed + " placed · " + right + " / " + D.items.length + " correct";
    if (placed === 0) {
      fb.innerHTML = "<strong>Nothing placed yet.</strong> Tap or drag each card into one of the three bins first, then press Check.";
    } else if (right === D.items.length) {
      fb.innerHTML = "<strong>🎉 All 10 right!</strong> You can clearly distinguish galvanometer coil ratings, parallel ammeter shunts, and series voltmeter multipliers.";
      burst(document.getElementById("sort-check"), 22);
    } else {
      fb.innerHTML = "<strong>" + right + " of " + placed + " placed items are in the right bin.</strong>" +
        (placed < D.items.length ? " (" + (D.items.length - placed) + " still in the tray.)" : "") +
        (rows.length ? '<ul style="margin:8px 0 0 18px;padding:0">' + rows.join("") + "</ul>" : "");
    }
    fb.classList.add("on");
    emit("sort:checked", { right: right, placed: placed, total: D.items.length });
  }
  var scBtn = document.getElementById("sort-check");
  var srBtn = document.getElementById("sort-reset");
  if (scBtn) scBtn.addEventListener("click", checkSort);
  if (srBtn) srBtn.addEventListener("click", buildSort);
  buildSort();

  // 2. Results table
  var tbody = document.getElementById("results-body");
  function opts(arr, val) {
    return '<option value="">— pick —</option>' + arr.map(function (o) {
      return '<option value="' + o + '"' + (o === val ? " selected" : "") + ">" + o + "</option>";
    }).join("");
  }
  function buildTable(prefill) {
    if (!tbody) return;
    tbody.innerHTML = D.trials.map(function (r) {
      var p = prefill || {};
      return '<tr data-row="' + r.id + '">' +
        "<td><span class=\"swatch\" style=\"background:" + r.col + "\"></span><strong>" + r.name + "</strong>" + '<span class="given"><b>Given:</b> ' + [r.L, r.m, r.A].join(" · ") + "</span></td>" +
        '<td><select data-f="t" aria-label="R_s or R_m for ' + r.name + '">' + opts(D.tOptions, p[r.id] && p[r.id].t) + "</select></td>" +
        '<td><select data-f="T" aria-label="V_g for ' + r.name + '">' + opts(D.TOptions, p[r.id] && p[r.id].T) + "</select></td>" +
        '<td><select data-f="T2" aria-label="Bypass or Drop Share for ' + r.name + '">' + opts(D.T2Options, p[r.id] && p[r.id].T2) + "</select></td>" +
        '<td class="hint">' + r.g + "</td>" +
        "</tr>";
    }).join("");
    document.getElementById("table-feedback").classList.remove("on");
    document.getElementById("table-score").textContent = "";
  }

  function checkTable() {
    var right = 0, total = D.trials.length * 3;
    D.trials.forEach(function (r) {
      var tr = tbody.querySelector('tr[data-row="' + r.id + '"]');
      ["t", "T", "T2"].forEach(function (f) {
        var s = tr.querySelector('select[data-f="' + f + '"]');
        var ok = s.value === r[f];
        s.classList.toggle("right", ok);
        s.classList.toggle("wrong", !ok);
        if (ok) right++;
      });
    });
    var fb = document.getElementById("table-feedback");
    document.getElementById("table-score").textContent = right + " / " + total + " cells correct";
    if (right === total) {
      fb.innerHTML = "<strong>Spot on!</strong> Every ammeter shunt R_s is tiny (fractions of an ohm in parallel), while every voltmeter multiplier R_m is large (hundreds or thousands of ohms in series)!";
      burst(document.getElementById("table-check"), 20);
    } else {
      fb.innerHTML = "<strong>" + right + " of " + total + " cells right.</strong> Red boxes need another look — use <code>R_s = I_g R_g / (I − I_g)</code> and <code>R_m = (V / I_g) − R_g</code>, or tap <em>Fill from bench</em>.";
    }
    fb.classList.add("on");
    emit("table:checked", { right: right, total: total });
  }

  function fillTable() {
    var map = {};
    D.trials.forEach(function (r) { map[r.id] = { t: r.t, T: r.T, T2: r.T2 }; });
    buildTable(map);
    toast("Filled from the 6 meter conversion designs — press Check my table to verify.");
    emit("table:filled", {});
  }

  var tcBtn = document.getElementById("table-check");
  var tfBtn = document.getElementById("table-fill");
  var trBtn = document.getElementById("table-reset");
  if (tcBtn) tcBtn.addEventListener("click", checkTable);
  if (tfBtn) tfBtn.addEventListener("click", fillTable);
  if (trBtn) trBtn.addEventListener("click", function () { buildTable(); });
  buildTable();

  // 3. Meter Conversion Explorer
  var track = document.getElementById("ph-track");
  var detail = document.getElementById("ph-detail");
  if (track && detail) {
    track.className = "ph-choices";
    D.pins.forEach(function (p, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ph-choice";
      b.style.setProperty("--pcol", p.col);
      b.innerHTML = '<span class="k">' + p.num + '</span><span class="n">' + p.name + "</span>";
      b.setAttribute("aria-label", p.name + ", " + p.num);
      b.addEventListener("click", function () { selectPin(idx, true); });
      track.appendChild(b);
    });
  }
  function selectPin(idx, userTriggered) {
    var p = D.pins[idx];
    if (!p || !track || !detail) return;
    Array.prototype.forEach.call(track.querySelectorAll(".ph-choice"), function (el, i) {
      el.classList.toggle("on", i === idx);
      el.setAttribute("aria-pressed", i === idx ? "true" : "false");
    });
    var badgeCol = p.cat === "shm" ? "var(--amber)" : (p.cat === "periodic" ? "var(--teal)" : "var(--violet)");
    var badgeTxt = p.cat === "shm" ? "Galvanometer Coil" : (p.cat === "periodic" ? "Ammeter Shunt (parallel)" : "Voltmeter Multiplier (series)");
    detail.innerHTML =
      '<div class="num" style="color:' + p.col + '">' + p.num + "<small>" + p.name + "</small></div>" +
      "<div>" +
      '<span class="chip" style="--c:' + badgeCol + ';margin-bottom:6px"><i></i>' + badgeTxt + "</span>" +
      '<p style="margin:4px 0 0;color:#d6deee;font-size:.92rem">' + p.desc + "</p>" +
      "</div>";
    if (userTriggered) emit("ph:select", { index: idx, pin: p });
  }
  selectPin(1, false);

  // 4. Bridge: Added Multiplier R_m vs Total Resistance R_total (#vinegar-test)
  var vBtns = Array.prototype.slice.call(document.querySelectorAll("#vinegar-test [data-v]"));
  var vResult = document.getElementById("vinegar-result");
  var vDrop = document.getElementById("v-drop");
  var vFlaskLiquid = document.getElementById("v-flask-liquid");
  var vLabel = document.getElementById("v-flask-label");

  var vData = {
    "195": {
      col: "#3ee6c4",
      ok: true,
      head: "✅ Correct! Added Series Multiplier R_m = 195 Ω (while Total Resistance = 200 Ω)",
      body: "Step-by-step:<ul><li>Convert <code>I<sub>g</sub> = 50 mA = 0.050 A</code>.</li><li>Total voltmeter resistance required: <code>R<sub>total</sub> = V ÷ I<sub>g</sub> = 10.0 ÷ 0.050 = 200 Ω</code>.</li><li>Subtract the existing galvanometer coil resistance <code>R<sub>g</sub> = 5.0 Ω</code>: <strong>R<sub>m</sub> = 200 − 5.0 = 195 Ω connected in SERIES</strong>!</li></ul>"
    },
    "200": {
      col: "#f59e0b",
      ok: false,
      head: "❌ Careful! 200 Ω is the TOTAL voltmeter resistance (R_g + R_m), not the added multiplier R_m!",
      body: "You calculated <code>V ÷ I<sub>g</sub> = 10.0 ÷ 0.050 = 200 Ω</code>, which is the combined resistance of the coil plus multiplier. Remember to subtract <code>R<sub>g</sub> = 5.0 Ω</code> to get <strong>R<sub>m</sub> = 195 Ω</strong>."
    },
    "205": {
      col: "#fb7185",
      ok: false,
      head: "❌ Watch the sign: subtract R_g from V/I_g, do not add it!",
      body: "Because the galvanometer coil already provides <code>5.0 Ω</code> in series, the external multiplier only needs to supply the remaining <code>200 − 5.0 = 195 Ω</code>."
    },
    "0.025": {
      col: "#f43f5e",
      ok: false,
      head: "❌ That is a parallel SHUNT calculation for an ammeter!",
      body: "To convert a galvanometer into a <strong>voltmeter</strong>, we connect a high-resistance <strong>multiplier in series</strong>: <code>R<sub>m</sub> = (V ÷ I<sub>g</sub>) − R<sub>g</sub></code>."
    }
  };

  vBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-v");
      var d = vData[k];
      if (!d) return;
      vBtns.forEach(function (x) { x.classList.toggle("on", x === b); });
      if (vDrop) {
        vDrop.setAttribute("fill", d.col);
        vDrop.style.transform = "translateY(38px)";
        setTimeout(function () { vDrop.style.transform = "translateY(0)"; }, 450);
      }
      if (vFlaskLiquid) vFlaskLiquid.setAttribute("fill", d.col);
      if (vLabel) vLabel.textContent = "R_m = " + k + " Ω";
      vResult.innerHTML = "<strong style=\"color:" + (d.ok ? "#7cf7d4" : "#ffd88a") + "\">" + d.head + "</strong><div style=\"margin-top:6px\">" + d.body + "</div>";
      vResult.classList.add("on");
      if (d.ok) burst(b, 20);
      emit("vinegar:pick", { value: k, ok: d.ok });
    });
  });
})();
