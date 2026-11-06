/* Lesson 05 · interactions: LessonKit boot, Haematology & Paper 3 Sort, Oxygen Capacity Table, Haematology Explorer, and LUTH Finale Bridge */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;

  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l05",
      wonderSeeds: [
        "Why do mature mammalian red blood cells have NO nucleus whereas frog and bird red blood cells still have nuclei? — Tunde",
        "How do platelets, thromboplastin, calcium ions (Ca²⁺), and Vitamin K turn soluble fibrinogen into a solid fibrin clot? — Amaka",
        "Why is Blood Group O⁻ the Universal Donor of red cells while Blood Group AB⁺ is the Universal Recipient? — Nurse Chidinma",
        "How do you orient a dissected goat heart in WAEC Paper 3 and calculate drawing magnification M without losing marks? — Chidi"
      ],
      quiz: window.LESSON_QUIZ || []
    });
  }

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // 1. Haematology, Clotting & Paper 3 Sort
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
    var labels = { shm: "Plasma, RBCs & WBCs", periodic: "Platelets & Clotting Cascade", non: "ABO/Rhesus & WAEC Paper 3" };
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

  // 2. Interactive Oxygen Capacity & Paper 3 Magnification Table
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
        '<td><select data-k="t" aria-label="Oxygen capacity C_O2 (mL/100 mL) for trial ' + trObj.label + '">' + opt(D.tOptions) + "</select></td>" +
        '<td><select data-k="T" aria-label="Total O2 in 5.0 L (mL) for trial ' + trObj.label + '">' + opt(D.TOptions) + "</select></td>" +
        '<td><select data-k="T2" aria-label="WAEC Paper 3 Magnification M for trial ' + trObj.label + '">' + opt(D.T2Options) + "</select></td>";
      tbody.appendChild(tr);

      var saved = window.LessonKit ? window.LessonKit.Store.get("heart-l05-table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("heart-l05-table-" + i, saved);
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
      if (!filled) { out.textContent = "Fill in at least one row from your 3D Haematology & Paper 3 Bench readings first."; return; }
      out.textContent = right + " of " + filled + " entries match the WAEC table" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l1:table-checked", { right: right, filled: filled });
    });
  }

  // 3. Haematology, Clotting, ABO & Paper 3 Explorer
  var track = document.getElementById("ph-track");
  if (track && D.pins) {
    var nums = document.getElementById("ph-nums");
    var labels = ["1. Plasma/Serum", "2. RBC & WBC", "3. Fibrin Clot", "4. ABO & Rh", "5. Paper 3 Mag"];
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
        "Core: <code>" + pObj.v + "</code> · " +
        "Formula/Mechanism: <code>" + pObj.a + "</code> · " +
        "Key facts: <b>" + pObj.ke + " &amp; " + pObj.pe + "</b><br>" +
        pObj.note;
    };
    window.L05.showPin = showPin;
    showPin(2);
  }

  // 4. LUTH Haematology & WAEC Paper 3 Finale Bridge Solver (#vinegar-test in #bridge)
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

    var step1 = function () {
      bStep1.disabled = true;
      bStep2.disabled = false;
      timeB.textContent = "Step 1: C_O₂ = 1.34 × 15.0 = 20.1 mL O₂/dL → 1,005 mL O₂ in 5.0 L";
      status.innerHTML = "Step 1 complete: Healthy haemoglobin (<code>15.0 g/100 mL</code>) binds <code>20.1 mL O₂/100 mL</code>, giving <b>1,005 mL O₂ in 5.0 L (50 dL)</b> of blood! Now tap Step 2.";
    };
    var step2 = function () {
      bStep2.disabled = true;
      bStep3.disabled = false;
      timeB.textContent = "Step 2: Group O⁻ = Universal Donor · Group AB⁺ = Universal Recipient";
      lenBLabel.textContent = "· Safe ABO/Rh & Fibrin Clot Confirmed";
      status.innerHTML = "Step 2 complete: Group O⁻ RBCs have no A, B, or Rh-D antigens; Thromboplastin + Ca²⁺ + Vitamin K → Thrombin → Fibrin clot. Now tap Step 3 to verify the WAEC Paper 3 Heart Magnification.";
    };
    var step3 = function () {
      bStep3.disabled = true;
      timeB.textContent = "M = 120 mm ÷ 80 mm = ×1.5 (Zero Shading, Full Marks!)";
      status.innerHTML = "Step 3 complete: Drawing length <code>120 mm</code> divided by actual goat heart length <code>80 mm</code> = <b>×1.5 magnification</b>!";
      verdict.innerHTML = "<b>Unit Mystery Solved across All 5 Lessons!</b> From <b>SA:V = 6/L</b> (Lesson 1) → <b>4 Chambers, Valves &amp; Double Circulation</b> (Lesson 2) → <b>CO = HR × SV, Myogenic SAN &amp; 120/80 mmHg</b> (Lesson 3) → <b>Arteries, Veins, Starling Ultrafiltration (+10/−10 mmHg) &amp; Lymph</b> (Lesson 4) → <b>Blood Cells, 4-Step Clotting, ABO/Rhesus &amp; WAEC Paper 3 (×1.5)</b> (Lesson 5)!";
      verdict.classList.add("on");
      burst(verdict, 28);
      emit("l1:vinegar-done", {});
    };
    var resetVt = function () {
      bStep1.disabled = false;
      bStep2.disabled = true;
      bStep3.disabled = true;
      timeB.textContent = "[Hb] = 15 g/dL · Specimen = 80 mm · Drawing = 120 mm";
      lenBLabel.textContent = "· O₂ Capacity, ABO/Clotting & Paper 3";
      status.textContent = "Given [Hb] = 15.0 g/100 mL (in 5.0 L blood) and a 120 mm drawing of an 80 mm dissected goat heart, start with Step 1.";
      verdict.classList.remove("on");
      verdict.innerHTML = "";
    };

    bStep1.addEventListener("click", step1);
    bStep2.addEventListener("click", step2);
    bStep3.addEventListener("click", step3);
    bReset.addEventListener("click", resetVt);
    window.L05.vt = { step1: step1, step2: step2, step3: step3, reset: resetVt };
  }
})();
