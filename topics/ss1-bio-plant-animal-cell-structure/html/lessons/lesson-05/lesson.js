/* Lesson 05 · interactions: LessonKit boot, Staining & Drawing Rule Sort, FOV Calibration Table, Microscopy Explorer, and WAEC Paper 3 Drawing Clinic Bridge */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;

  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l05",
      wonderSeeds: [
        "Why did dropping my coverslip flat trap giant black-rimmed circles on my onion slide? — Tunde",
        "Why do WAEC examiners deduct marks if I shade the nucleus or put arrowheads on my label lines? — Alhaji Musa",
        "Why do we stain onion cells with iodine solution but human cheek cells with methylene blue? — Halima",
        "How do I calculate cell length A if 6 onion cells fit across a 450 µm field of view? — Chidi"
      ],
      quiz: window.LESSON_QUIZ || []
    });
  }

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // 1. Cytological Staining & WAEC Drawing Rule Sort
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
    var labels = { shm: "Wet-Mount & Staining Protocol", periodic: "WAEC Biological Drawing Rule", non: "Disallowed WAEC Fault" };
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
    emit("l5:sort-checked", { score: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // 2. Interactive WAEC Field-of-View Calibration Results Table
  var tbody = document.querySelector("#results-table tbody");
  if (tbody) {
    var opt = function (list) {
      return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join("");
    };
    D.trials.forEach(function (trObj, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + trObj.label + "</b></td>" +
        "<td>×" + trObj.L + "</td>" +
        '<td><select data-k="t" aria-label="FOV diameter D (µm) for trial ' + trObj.label + '">' + opt(D.tOptions) + "</select></td>" +
        '<td><select data-k="T" aria-label="Number of onion cells N across diameter for trial ' + trObj.label + '">' + opt(D.TOptions) + "</select></td>" +
        '<td><select data-k="T2" aria-label="Calculated cell length A = D/N (µm) for trial ' + trObj.label + '">' + opt(D.T2Options) + "</select></td>";
      tbody.appendChild(tr);

      var saved = window.LessonKit ? window.LessonKit.Store.get("bio-l05-table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("bio-l05-table-" + i, saved);
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
      if (!filled) { out.textContent = "Fill in at least one row from your 3D FOV calibration readings first."; return; }
      out.textContent = right + " of " + filled + " entries match the WAEC table" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l5:table-checked", { right: right, filled: filled });
    });
  }

  // 3. Wet-Mount, Staining & Microscopy Explorer
  var track = document.getElementById("ph-track");
  if (track && D.pins) {
    var nums = document.getElementById("ph-nums");
    var labels = ["1. 45° Slip", "2. Stains", "3. FOV Math", "4. WAEC Rules", "5. Light vs EM"];
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
        "Rule 1: <code>" + pObj.v + "</code> · " +
        "Rule 2: <code>" + pObj.a + "</code> · " +
        "Exam tip: <b>" + pObj.ke + " &amp; " + pObj.pe + "</b><br>" +
        pObj.note;
    };
    window.L05.showPin = showPin;
    showPin(3);
  }

  // 4. WAEC Paper 3 Drawing Clinic Bridge Solver (#vinegar-test in #bridge)
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
      if (lenBLabel) lenBLabel.textContent = "· Sharp HB single lines + Double wall (CL ✓)";
      if (timeB) timeB.textContent = "Score: 6 / 10 (Shading removed!)";
      status.innerHTML = "Step 1: Erased all pencil shading and sketchy strokes! Redrew with a <strong>sharp HB pencil</strong> using continuous single lines and a <strong>double line for the cellulose cell wall</strong> (+3 CL marks). Now click Step 2.";
    });

    bStep2.addEventListener("click", function () {
      bStep2.disabled = true;
      bStep3.disabled = false;
      if (lenBLabel) lenBLabel.textContent = "· Horizontal ruled guidelines, no arrows (NL ✓)";
      if (timeB) timeB.textContent = "Score: 8 / 10 (Labels fixed!)";
      status.innerHTML = "Step 2: Replaced crossed arrow-headed lines with <strong>horizontal ruler-drawn guidelines without arrowheads</strong> touching Cell Wall, Nucleus, Cytoplasm, and Sap Vacuole (+2 NL marks). Now click Step 3.";
    });

    bStep3.addEventListener("click", function () {
      bStep3.disabled = true;
      if (lenBLabel) lenBLabel.textContent = "· Title + Magnification ×1200 below (10 / 10 ✓)";
      if (timeB) timeB.textContent = "Score: 10 / 10 Full WAEC Marks! ✓";
      status.innerHTML = "Tunde's biological drawing now earns 10 out of 10 on the WAEC Paper 3 marking scheme!";
      verdict.innerHTML =
        "<strong>WAEC Paper 3 Drawing Clinic Complete!</strong> To score full marks: (1) Lower the coverslip at <strong>45°</strong> to avoid air bubbles, (2) Use <strong>sharp HB single continuous lines</strong> (double line for plant cell wall, zero shading), (3) Rule <strong>horizontal uncrossed label lines without arrowheads</strong>, and (4) Write the <strong>Title and Magnification (M = I ÷ A = 90,000 µm ÷ 75 µm = ×1200)</strong> below!";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l5:vinegar-done", { score: 10 });
    });

    bReset.addEventListener("click", function () {
      bStep1.disabled = false;
      bStep2.disabled = true;
      bStep3.disabled = true;
      verdict.classList.remove("on");
      if (lenBLabel) lenBLabel.textContent = "· Shaded nucleus, feathery lines, arrows";
      if (timeB) timeB.textContent = "Score: 3 / 10 (Penalised!)";
      status.innerHTML = "Audit Tunde's draft drawing (90 mm long for a 75 µm onion cell) and upgrade it to 10/10. Start with Step 1.";
    });

    window.L05.vt = {
      step1: function () { bStep1.click(); },
      step2: function () { bStep2.click(); },
      step3: function () { bStep3.click(); }
    };
  }
})();
