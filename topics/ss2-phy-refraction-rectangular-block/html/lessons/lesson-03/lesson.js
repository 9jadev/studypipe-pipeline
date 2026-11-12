/* Lesson 03 · interactions: LessonKit boot, Depth/Shift Sort, Real/Apparent Depth Table, Depth Explorer, and Raised-vs-Apparent Depth Bridge */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l03",
      wonderSeeds: [
        "If an ink mark under a 6.0 cm glass block appears raised by 2.0 cm, why is the apparent depth 4.0 cm instead of 2.0 cm? — Kelechi",
        "Why do light rays leaving the glass into air bend away from the normal so the virtual image forms higher up? — Zainab",
        "How do we find the total apparent depth when a layer of water sits on top of a rectangular glass block? — Halima",
        "What does 'no parallax' mean when aligning a search pin with the virtual image? — Chidi"
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
    // Shared drag-and-drop (assets/js/sort-dnd.js): auto-scrolls to bins below the fold,
    // snaps to the nearest bin, and survives a stray second touch.
    SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
  }


  function checkSort() {
    var placed = 0, right = 0, rows = [];
    var labels = { shm: "Real & Apparent Depth (R, A)", periodic: "Upward Vertical Shift (d_v = R − A)", non: "No-Parallax & Ray Cone Mechanism" };
    D.items.forEach(function (it) {
      var el = document.querySelector('.sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" +
        labels[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the explanations below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join("");
    fb.classList.add("on");
    if (right >= 10) burst(document.getElementById("sort-score"), 20);
    emit("l1:sort-checked", { score: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // 2. Interactive Real & Apparent Depth Table
  var tbody = document.querySelector("#results-table tbody");
  if (tbody) {
    var opt = function (list) {
      return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join("");
    };
    D.trials.forEach(function (trObj, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + trObj.label + "</b></td>" +
        "<td>" + trObj.L.toFixed(1) + "</td>" +
        '<td><select data-k="t" aria-label="Apparent depth A (cm) for trial ' + trObj.label + '">' + opt(D.tOptions) + "</select></td>" +
        '<td><select data-k="T" aria-label="Upward shift d_v (cm) for trial ' + trObj.label + '">' + opt(D.TOptions) + "</select></td>" +
        '<td><select data-k="T2" aria-label="n = R / A for trial ' + trObj.label + '">' + opt(D.T2Options) + "</select></td>";
      tbody.appendChild(tr);

      var saved = window.LessonKit ? window.LessonKit.Store.get("refr-l03-table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("refr-l03-table-" + i, saved);
          s.parentElement.classList.remove("ok", "no");
        });
      });
    });

    document.getElementById("results-check").addEventListener("click", function () {
      var right = 0, filled = 0, total = D.trials.length * 3;
      Array.prototype.forEach.call(tbody.rows, function (tr, i) {
        tr.querySelectorAll("select").forEach(function (s) {
          var k = s.getAttribute("data-k"), exp = D.trials[i][k];
          s.parentElement.classList.remove("ok", "no");
          if (!s.value) return;
          filled++;
          var ok = s.value === exp;
          if (ok) right++;
          s.parentElement.classList.add(ok ? "ok" : "no");
        });
      });
      var out = document.getElementById("results-score");
      if (!filled) { out.textContent = "Fill in at least one row from your 3D No-Parallax readings first."; return; }
      out.textContent = right + " of " + filled + " readings match the Real & Apparent Depth table" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l1:table-checked", { right: right, filled: filled });
    });
  }

  // 3. Apparent Depth & Multi-Layer Explorer
  var track = document.getElementById("ph-track");
  if (track && D.pins) {
    var nums = document.getElementById("ph-nums");
    var labels = ["Water (4/3)", "6 cm Glass", "9 cm Glass", "2-Layer", "Diamond"];
    labels.forEach(function (lb, k) {
      var sp = document.createElement("span");
      sp.textContent = lb;
      sp.style.left = (k / (labels.length - 1) * 100) + "%";
      nums.appendChild(sp);
    });
    nums.style.margin = "8px 10px 0";

    var info = document.getElementById("ph-info");
    var pinEls = [];
    D.pins.forEach(function (pObj, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ph-pin";
      var pct = ((pObj.frac + 1) / 2) * 100;
      btn.style.left = pct + "%";
      if (idx % 2 === 1) btn.classList.add("up");
      btn.innerHTML = '<span aria-hidden="true">' + pObj.emo + "</span>";
      btn.setAttribute("aria-label", pObj.label + ", " + pObj.x);
      btn.addEventListener("click", function () { showPin(idx); });
      track.appendChild(btn);
      pinEls.push(btn);
    });

    var showPin = function (i) {
      var pObj = D.pins[i];
      if (!pObj) return;
      pinEls.forEach(function (el, k) { el.classList.toggle("on", k === i); });
      info.innerHTML =
        "<b>" + pObj.label + " (" + pObj.x + ")</b> · " +
        "<code>" + pObj.v + "</code> · " +
        "<code>" + pObj.a + "</code> · " +
        "Relation: <b>" + pObj.ke + " · " + pObj.pe + "</b><br>" +
        pObj.note;
    };
    window.L01.showPin = showPin;
    showPin(1);
  }

  // 4. Raised-by vs Apparent-Depth Trap Buster Bridge (#vinegar-test in #bridge)
  var vt = document.getElementById("vinegar-test");
  if (vt) {
    var bStep1 = document.getElementById("vt-zobo");
    var bStep2 = document.getElementById("vt-drop1");
    var bStep3 = document.getElementById("vt-drop5");
    var bReset = document.getElementById("vt-reset");
    var status = document.getElementById("vt-status");
    var verdict = document.getElementById("vt-verdict");
    var timeB = document.getElementById("time-b");
    var lenBLabel = document.getElementById("len-b-label");

    bStep1.addEventListener("click", function () {
      bStep1.disabled = true;
      bStep2.disabled = false;
      if (lenBLabel) lenBLabel.textContent = "· Step 1: Identify d_v = 2.0 cm (NOT A!)";
      if (timeB) timeB.textContent = "d_v = 2.0 cm · R = 6.0 cm";
      status.innerHTML = "Step 1: 'Appears raised by 2.0 cm' means upward vertical displacement <strong>d<sub>v</sub> = 2.0 cm</strong>! Never substitute d_v directly as apparent depth A. Now click Step 2.";
    });

    bStep2.addEventListener("click", function () {
      bStep2.disabled = true;
      bStep3.disabled = false;
      if (lenBLabel) lenBLabel.textContent = "· Step 2: Apparent Depth A = R − d_v = 4.0 cm";
      if (timeB) timeB.textContent = "A = 6.0 − 2.0 = 4.0 cm";
      status.innerHTML = "Step 2: Subtract the upward rise from the real thickness: <strong>Apparent Depth A = R − d<sub>v</sub> = 6.0 − 2.0 = 4.0 cm</strong>! Now click Step 3 to compute refractive index n.";
    });

    bStep3.addEventListener("click", function () {
      bStep3.disabled = true;
      if (lenBLabel) lenBLabel.textContent = "· Refractive Index n = R ÷ A = 1.50 ✓";
      if (timeB) timeB.textContent = "n = 6.0 ÷ 4.0 = 1.50 ✓";
      status.innerHTML = "Kelechi's trap is busted — the glass paperweight has n = 1.50, not 3.0!";
      verdict.innerHTML =
        "<strong>Exam Wording Trap Busted!</strong> Always check whether a question states <em>'appears at a depth of y'</em> (<strong>A = y</strong>) or <em>'appears raised by x'</em> (<strong>d<sub>v</sub> = x, so A = R − x</strong>). For Dr Kunle's 6.0 cm block, d<sub>v</sub> = 2.0 cm gives A = 4.0 cm and <strong>n = R ÷ A = 6.0 ÷ 4.0 = 1.50</strong>!";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l1:vinegar-done", { n: 1.50 });
    });

    bReset.addEventListener("click", function () {
      bStep1.disabled = false;
      bStep2.disabled = true;
      bStep3.disabled = true;
      verdict.classList.remove("on");
      if (lenBLabel) lenBLabel.textContent = "· Kelechi's Wrong Guess: n = 6.0 / 2.0 = 3.0?";
      if (timeB) timeB.textContent = "A = ? · n = ?";
      status.innerHTML = "A chart under a 6.0 cm block appears raised by 2.0 cm. Start with Step 1 to fix Kelechi's calculation.";
    });

    window.L01.vt = {
      step1: function () { bStep1.click(); },
      step2: function () { bStep2.click(); },
      step3: function () { bStep3.click(); }
    };
  }
})();
