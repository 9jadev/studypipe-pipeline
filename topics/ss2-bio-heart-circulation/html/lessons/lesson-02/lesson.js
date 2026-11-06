/* Lesson 02 · interactions: LessonKit boot, Heart Chambers & Vessels Sort, Wall-Thickness Table, Pathway Explorer, and LUTH Echocardiogram Bridge */
(function () {
  "use strict";
  var D = window.L02;
  if (!D) return;

  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l02",
      wonderSeeds: [
        "Why is the left ventricular wall 3 times thicker than the right ventricular wall even though both pump 70 mL per beat? — Tunde",
        "Why does the pulmonary artery carry deoxygenated blood while the pulmonary vein carries oxygenated blood? — Amaka",
        "What stops the bicuspid and tricuspid valve flaps from turning inside out when the ventricles contract? — Nurse Chidinma",
        "How does the heart muscle receive its own oxygen and glucose if it cannot absorb them from chamber blood? — Chidi"
      ],
      quiz: window.LESSON_QUIZ || []
    });
  }

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // 1. Heart Chambers, Great Vessels & Valves Sort
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
    var labels = { shm: "Right Side / Pulmonary (Deoxygenated)", periodic: "Left Side / Systemic (Oxygenated)", non: "Valves, Chordae & Septum" };
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

  // 2. Interactive Chamber Wall-Thickness & Pressure Table
  var tbody = document.querySelector("#results-table tbody");
  if (tbody) {
    var opt = function (list) {
      return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join("");
    };
    D.trials.forEach(function (trObj, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + trObj.label + "</b></td>" +
        "<td>" + trObj.L.toFixed(1) + " mm</td>" +
        '<td><select data-k="t" aria-label="Heart chamber for trial ' + trObj.label + '">' + opt(D.tOptions) + "</select></td>" +
        '<td><select data-k="T" aria-label="Peak systolic pressure P = 8w (mmHg) for trial ' + trObj.label + '">' + opt(D.TOptions) + "</select></td>" +
        '<td><select data-k="T2" aria-label="Wall ratio w / w_RV for trial ' + trObj.label + '">' + opt(D.T2Options) + "</select></td>";
      tbody.appendChild(tr);

      var saved = window.LessonKit ? window.LessonKit.Store.get("heart-l02-table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("heart-l02-table-" + i, saved);
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
      if (!filled) { out.textContent = "Fill in at least one row from your 3D Heart Dissector readings first."; return; }
      out.textContent = right + " of " + filled + " entries match the WAEC table" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l1:table-checked", { right: right, filled: filled });
    });
  }

  // 3. Double-Circulation Pathway Explorer
  var track = document.getElementById("ph-track");
  if (track && D.pins) {
    var nums = document.getElementById("ph-nums");
    var labels = ["1. RA & Tricuspid", "2. RV & Pulm. Art.", "3. LA & Bicuspid", "4. LV & Aorta", "5. Coronary & Portal"];
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
        "Metrics: <code>" + pObj.v + "</code> · " +
        "Valve/Vessel: <code>" + pObj.a + "</code> · " +
        "Key facts: <b>" + pObj.ke + " &amp; " + pObj.pe + "</b><br>" +
        pObj.note;
    };
    window.L02.showPin = showPin;
    showPin(3);
  }

  // 4. LUTH Echocardiogram Wall & Ejection Fraction Bridge Solver (#vinegar-test in #bridge)
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
      if (lenBLabel) lenBLabel.textContent = "· w_LV ÷ w_RV = 15 mm ÷ 5 mm = 3.0";
      if (timeB) timeB.textContent = "3:1 wall thickness ratio confirmed!";
      status.innerHTML = "Step 1: Dividing Left Ventricular wall thickness (<strong>15 mm</strong>) by Right Ventricular wall thickness (<strong>5 mm</strong>) gives the classic <strong>3 : 1 ratio</strong>! Now click Step 2 to calculate Stroke Volume SV.";
    });

    bStep2.addEventListener("click", function () {
      bStep2.disabled = true;
      bStep3.disabled = false;
      if (lenBLabel) lenBLabel.textContent = "· SV = EDV (120) − ESV (50) = 70 mL";
      if (timeB) timeB.textContent = "Both ventricles eject 70 mL/beat!";
      status.innerHTML = "Step 2: Subtracting End-Systolic Volume (<strong>50 mL</strong>) from End-Diastolic Volume (<strong>120 mL</strong>) gives <strong>SV = 70 mL</strong> for BOTH ventricles! Now click Step 3 to compute Ejection Fraction EF%.";
    });

    bStep3.addEventListener("click", function () {
      bStep3.disabled = true;
      if (lenBLabel) lenBLabel.textContent = "· EF% = (70 ÷ 120) × 100 = 58.3% ✓";
      if (timeB) timeB.textContent = "P_LV = 120 mmHg · EF = 58.3% ✓";
      status.innerHTML = "Echocardiogram analysis complete! Left Ventricle generates 120 mmHg with a 58.3% ejection fraction!";
      verdict.innerHTML =
        "<strong>LUTH Echocardiogram Puzzle Solved!</strong> Both ventricles pump the <strong>exact same 70 mL stroke volume</strong> (<code>EF = 58.3%</code>), but the left ventricular wall is <strong>3× thicker (15 mm vs 5 mm)</strong> so it can generate <strong>120 mmHg</strong> to drive oxygenated blood through the entire systemic circuit!";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l1:vinegar-done", { EF: 58.3 });
    });

    bReset.addEventListener("click", function () {
      bStep1.disabled = false;
      bStep2.disabled = true;
      bStep3.disabled = true;
      verdict.classList.remove("on");
      if (lenBLabel) lenBLabel.textContent = "· w = 15 mm · EDV = 120 mL, ESV = 50 mL";
      if (timeB) timeB.textContent = "120 mmHg systemic pump";
      status.innerHTML = "Tunde's echocardiogram shows w_LV = 15 mm, w_RV = 5 mm, EDV = 120 mL, ESV = 50 mL. Start with Step 1.";
    });

    window.L02.vt = {
      step1: function () { bStep1.click(); },
      step2: function () { bStep2.click(); },
      step3: function () { bStep3.click(); }
    };
  }
})();
