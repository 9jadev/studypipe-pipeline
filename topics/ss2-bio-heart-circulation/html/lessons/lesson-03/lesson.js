/* Lesson 03 · interactions: LessonKit boot, Cardiac Cycle & Pacemaker Sort, Heart Rate Table, Conduction Explorer, and LUTH Sphygmomanometer Bridge */
(function () {
  "use strict";
  var D = window.L03;
  if (!D) return;

  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l03",
      wonderSeeds: [
        "Why does an isolated frog or mammalian heart keep beating in warm oxygenated Ringer's solution even when all nerves are cut? — Amaka",
        "Which exact valves slam shut to produce the first sound ('LUB') and the second sound ('DUB')? — Tunde",
        "Why does the AVN delay the electrical impulse by 0.10 second before sending it to the ventricles? — Nurse Chidinma",
        "What do the two numbers 120 and 80 mean in a blood pressure reading of 120/80 mmHg? — Chidi"
      ],
      quiz: window.LESSON_QUIZ || []
    });
  }

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // 1. Cardiac Cycle, Pacemaker & Heart Sounds Sort
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
    var labels = { shm: "Atrial Systole & SAN (0.10 s)", periodic: "Ventricular Systole & 'LUB' (0.30 s)", non: "General Diastole & 'DUB' (0.40 s)" };
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

  // 2. Interactive Cardiac Cycle & Cardiac Output Table
  var tbody = document.querySelector("#results-table tbody");
  if (tbody) {
    var opt = function (list) {
      return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join("");
    };
    D.trials.forEach(function (trObj, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + trObj.label + "</b></td>" +
        "<td>" + trObj.L + " bpm</td>" +
        '<td><select data-k="t" aria-label="Cycle duration T = 60/HR (s) for trial ' + trObj.label + '">' + opt(D.tOptions) + "</select></td>" +
        '<td><select data-k="T" aria-label="Stroke volume SV (mL) for trial ' + trObj.label + '">' + opt(D.TOptions) + "</select></td>" +
        '<td><select data-k="T2" aria-label="Cardiac output CO = HR × SV (L/min) for trial ' + trObj.label + '">' + opt(D.T2Options) + "</select></td>";
      tbody.appendChild(tr);

      var saved = window.LessonKit ? window.LessonKit.Store.get("heart-l03-table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("heart-l03-table-" + i, saved);
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
      if (!filled) { out.textContent = "Fill in at least one row from your 3D Pacemaker Bench readings first."; return; }
      out.textContent = right + " of " + filled + " entries match the WAEC table" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l1:table-checked", { right: right, filled: filled });
    });
  }

  // 3. 0.80 s Cardiac Cycle & Conduction Explorer
  var track = document.getElementById("ph-track");
  if (track && D.pins) {
    var nums = document.getElementById("ph-nums");
    var labels = ["0.0s SAN Fires", "0.1s Atrial + AVN", "0.15s 'LUB' (S1)", "0.3s Ejection", "0.4–0.8s 'DUB' & Rest"];
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
        "Valves: <code>" + pObj.v + "</code> · " +
        "Action: <code>" + pObj.a + "</code> · " +
        "Highlights: <b>" + pObj.ke + " &amp; " + pObj.pe + "</b><br>" +
        pObj.note;
    };
    window.L03.showPin = showPin;
    showPin(2);
  }

  // 4. LUTH Sphygmomanometer & Cardiac Cycle Bridge Solver (#vinegar-test in #bridge)
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
      if (lenBLabel) lenBLabel.textContent = "· T = 60 ÷ 75 = 0.80 s (0.1 + 0.3 + 0.4 s)";
      if (timeB) timeB.textContent = "Cycle T = 0.80 s verified!";
      status.innerHTML = "Step 1: Dividing <strong>60 s by HR = 75 bpm</strong> gives a total cardiac cycle of <strong>T = 0.80 s</strong> (0.10 s atrial systole + 0.30 s ventricular systole + 0.40 s general diastole)! Now click Step 2 to compute Pulse Pressure PP.";
    });

    bStep2.addEventListener("click", function () {
      bStep2.disabled = true;
      bStep3.disabled = false;
      if (lenBLabel) lenBLabel.textContent = "· PP = 120 − 80 = 40 mmHg";
      if (timeB) timeB.textContent = "Pulse Pressure PP = 40 mmHg!";
      status.innerHTML = "Step 2: Subtracting Diastolic Pressure (<strong>80 mmHg</strong>) from Systolic Pressure (<strong>120 mmHg</strong>) gives <strong>Pulse Pressure PP = 40 mmHg</strong>! Now click Step 3 to compute Mean Arterial Pressure MAP.";
    });

    bStep3.addEventListener("click", function () {
      bStep3.disabled = true;
      if (lenBLabel) lenBLabel.textContent = "· MAP = 80 + (40 ÷ 3) = 93.3 mmHg ✓";
      if (timeB) timeB.textContent = "T = 0.80 s · PP = 40 · MAP = 93.3 mmHg ✓";
      status.innerHTML = "Haemodynamic check complete! Mean Arterial Pressure is 93.3 mmHg!";
      verdict.innerHTML =
        "<strong>LUTH Haemodynamics Solved!</strong> At <strong>75 bpm</strong>, each heartbeat lasts <strong>0.80 s</strong> (initiated myogenically by the <strong>SAN</strong>), with <strong>'LUB'</strong> marking AV valve closure at 120 mmHg systole and <strong>'DUB'</strong> marking semilunar valve closure at 80 mmHg diastole (<code>PP = 40 mmHg</code>, <code>MAP = 93.3 mmHg</code>)!";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l1:vinegar-done", { MAP: 93.3 });
    });

    bReset.addEventListener("click", function () {
      bStep1.disabled = false;
      bStep2.disabled = true;
      bStep3.disabled = true;
      verdict.classList.remove("on");
      if (lenBLabel) lenBLabel.textContent = "· HR = 75 bpm · BP = 120/80 mmHg";
      if (timeB) timeB.textContent = "Compute T, PP & MAP";
      status.innerHTML = "Tunde's resting vitals are HR = 75 bpm and BP = 120/80 mmHg. Start with Step 1.";
    });

    window.L03.vt = {
      step1: function () { bStep1.click(); },
      step2: function () { bStep2.click(); },
      step3: function () { bStep3.click(); }
    };
  }
})();
