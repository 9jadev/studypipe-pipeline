/* Lesson 01 · interactions: LessonKit boot, Motion Sort, Pendulum Results Table, Swing Position Explorer, and Clock Bridge Test */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  // Boot shared LessonKit (Progress Rail, Do Now, Wonder Wall, Quiz, Self-Rating, Locked Solutions)
  if (window.LessonKit && window.LessonKit.boot) {
    window.LessonKit.boot({
      lessonId: "l01",
      wonderSeeds: [
        "I think a heavier brass bob falls faster, so its period T should be shorter — Kunle",
        "If you pull the bob to a wider angle, it has further to travel, so maybe it takes longer? — Halima",
        "Wait — if you pull it wider, doesn't it also speed up more on the way down? — Chidi",
        "Why do WAEC practical instructions always ask us to time 20 oscillations instead of just 1? — Zainab"
      ],
      quiz: window.LESSON_QUIZ || []
    });
  }

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // =========================================================
  // 1. Everyday Motion Sort (drag on desktop, tap-tap on mobile)
  // =========================================================
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
    var labels = { shm: "Simple Harmonic (SHM)", periodic: "Periodic (not SHM)", non: "Not periodic" };
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
      toast("Place all " + D.items.length + " motions first. " + (D.items.length - placed) + " still in the tray.");
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

  // =========================================================
  // 2. Interactive WAEC Pendulum Results Table
  // =========================================================
  var tbody = document.querySelector("#results-table tbody");
  if (tbody) {
    var opt = function (list) {
      return '<option value="">choose…</option>' + list.map(function (o) { return "<option>" + o + "</option>"; }).join("");
    };
    D.trials.forEach(function (trObj, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><b>" + trObj.label + "</b></td>" +
        "<td>" + trObj.L.toFixed(2) + "</td>" +
        '<td><select data-k="t" aria-label="Time t for 20 swings at L = ' + trObj.L.toFixed(2) + ' m">' + opt(D.tOptions) + "</select></td>" +
        '<td><select data-k="T" aria-label="Period T at L = ' + trObj.L.toFixed(2) + ' m">' + opt(D.TOptions) + "</select></td>" +
        '<td><select data-k="T2" aria-label="T squared at L = ' + trObj.L.toFixed(2) + ' m">' + opt(D.T2Options) + "</select></td>";
      tbody.appendChild(tr);

      var saved = window.LessonKit ? window.LessonKit.Store.get("shm-table-" + i, {}) : {};
      tr.querySelectorAll("select").forEach(function (s) {
        var k = s.getAttribute("data-k");
        if (saved[k]) s.value = saved[k];
        s.addEventListener("change", function () {
          saved[k] = s.value;
          if (window.LessonKit) window.LessonKit.Store.set("shm-table-" + i, saved);
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
      if (!filled) { out.textContent = "Fill in at least one row from your 3D timings first."; return; }
      out.textContent = right + " of " + filled + " readings match the WAEC table" + (filled < total ? " (" + (total - filled) + " still blank)." : "!");
      emit("l1:table-checked", { right: right, filled: filled });
    });
  }

  // =========================================================
  // 3. Swing Position Explorer (-A to +A)
  // =========================================================
  var track = document.getElementById("ph-track");
  if (track && D.pins) {
    var nums = document.getElementById("ph-nums");
    var labels = ["−A", "−0.5A", "0", "+0.5A", "+A"];
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
      btn.setAttribute("aria-label", pObj.label + ", displacement " + pObj.x);
      btn.addEventListener("click", function () { showPin(idx); });
      track.appendChild(btn);
      pinEls.push(btn);
    });

    var showPin = function (i) {
      var pObj = D.pins[i];
      if (!pObj) return;
      pinEls.forEach(function (el, k) { el.classList.toggle("on", k === i); });
      info.innerHTML =
        "<b>Position " + pObj.label + " (x = " + pObj.x + ")</b> · " +
        "Speed <code>|v| = " + pObj.v + "</code> · " +
        "Acceleration <code>a = " + pObj.a + "</code> · " +
        "Energy: <b>KE " + pObj.ke + " / PE " + pObj.pe + "</b><br>" +
        pObj.note;
    };
    window.L01.showPin = showPin;
    showPin(3); // default highlight x = 0 centre
  }

  // =========================================================
  // 4. Two-Clock Mystery Solver (#vinegar-test in #bridge)
  // =========================================================
  var vt = document.getElementById("vinegar-test");
  if (vt) {
    var bStep1 = document.getElementById("vt-zobo");
    var bStep2 = document.getElementById("vt-drop1");
    var bStep3 = document.getElementById("vt-drop5");
    var bReset = document.getElementById("vt-reset");
    var status = document.getElementById("vt-status");
    var verdict = document.getElementById("vt-verdict");
    var rodB = document.getElementById("rod-b");
    var bobB = document.getElementById("bob-b");
    var timeB = document.getElementById("time-b");
    var lenBLabel = document.getElementById("len-b-label");

    bStep1.addEventListener("click", function () {
      bStep1.disabled = true;
      bStep2.disabled = false;
      if (bobB) bobB.style.transform = "scale(1.28)";
      status.innerHTML = "We clipped a heavy lead weight onto Clock B's bob… and its period is <strong>still 2.15 s!</strong> Mrs Adeyemi's theory is busted: mass does not change the period. Now try Step 2 (shorten the length L).";
      emit("l1:clock-mass-tested", {});
    });

    bStep2.addEventListener("click", function () {
      bStep2.disabled = true;
      bStep3.disabled = false;
      if (rodB) {
        rodB.style.height = "114px";
        rodB.style.animationDuration = "1.038s";
      }
      if (lenBLabel) lenBLabel.textContent = "· L = 1.070 m";
      if (timeB) timeB.textContent = "2.08 s";
      status.innerHTML = "Aha! Screwing the regulating nut UP shortened L from 1.150 m to 1.070 m, and the period dropped to <strong>2.08 s</strong>! Now click Step 3 to bring L to 0.994 m.";
    });

    bStep3.addEventListener("click", function () {
      bStep3.disabled = true;
      if (rodB) {
        rodB.style.height = "105px";
        rodB.style.animationDuration = "1.0s";
      }
      if (lenBLabel) lenBLabel.textContent = "· L = 0.994 m (Calibrated!)";
      if (timeB) timeB.textContent = "2.00 s ✓";
      status.innerHTML = "Both pendulums now swing in <strong>perfect 2.00 s lockstep!</strong>";
      verdict.innerHTML =
        "<strong>Case solved!</strong> Clock B was running slow because its regulating nut had slipped down the rod, lengthening L from <strong>0.994 m</strong> to <strong>1.150 m</strong> (increasing T from 2.00 s to 2.15 s). Because <strong>T = 2π√(L/g)</strong> depends on <strong>length L</strong> and not mass, screwing the nut upward by <strong>15.6 cm</strong> restored exact timekeeping!";
      verdict.classList.add("on");
      burst(verdict, 24);
      emit("l1:vinegar-done", { L: 0.994, T: 2.00 });
    });

    bReset.addEventListener("click", function () {
      bStep1.disabled = false;
      bStep2.disabled = true;
      bStep3.disabled = true;
      verdict.classList.remove("on");
      if (bobB) bobB.style.transform = "scale(1)";
      if (rodB) {
        rodB.style.height = "124px";
        rodB.style.animationDuration = "1.075s";
      }
      if (lenBLabel) lenBLabel.textContent = "· L = 1.150 m";
      if (timeB) timeB.textContent = "2.15 s";
      status.innerHTML = "Clock A ticks with T = 2.00 s, while Clock B is dragging at T = 2.15 s. Start with Step 1.";
    });

    window.L01.vt = {
      step1: function () { bStep1.click(); },
      step2: function () { bStep2.click(); },
      step3: function () { bStep3.click(); }
    };
  }
})();
