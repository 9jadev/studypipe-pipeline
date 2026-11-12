/* Lesson 01 · interactions: who-discovered-what sort, objective explorer (image size of a 50 µm cell), and the two-slide bridge */
(function () {
  "use strict";
  var D = window.L01;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  /* ---------------- 1. Sort: who discovered what? ---------------- */
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#hist-sort .bin"));
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
      var el = document.querySelector('.sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " " + it.name + "</b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 8) burst(document.getElementById("sort-score"), 20);
    emit("l1:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  /* ---------------- 2. Explorer: image size of a 50 µm cell at each power ---------------- */
  var choices = document.getElementById("ex-choices"), detail = document.getElementById("ex-detail");
  var cellMm = D.cellWidthMm.onion;                       /* 0.050 mm = 50 µm */
  var pinEls = [];
  function fmt(n) { return (Math.round(n * 100) / 100).toString(); }
  function showPin(i) {
    var p = D.pins[i]; if (!p || !detail) return;
    var M = D.eyepiece * p.obj, img = cellMm * M, field = D.fieldConstant / M, cells = Math.round(field / cellMm);
    pinEls.forEach(function (el, k) { el.classList.toggle("on", k === i); });
    detail.innerHTML =
      '<div class="num">×' + M + '<small>' + D.eyepiece + " × " + p.obj + " = " + M + "</small></div>" +
      "<p>A 50 µm cell (" + fmt(cellMm) + " mm) looks <b>" + fmt(img) + " mm</b> wide in the image: " + fmt(cellMm) + " mm × " + M + " = " + fmt(img) + " mm. " +
      "The field is " + fmt(field) + " mm across, so about <b>" + cells + " cells</b> fit side by side.</p>" +
      "<p>" + p.note + "</p>";
    emit("l1:pin", { index: i, M: M, image_mm: img });
  }
  if (choices && D.pins) {
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "ph-choice"; b.style.setProperty("--pcol", ["var(--amber)", "var(--teal)", "var(--pink)"][i]);
      b.innerHTML = '<span class="k">×' + p.obj + '</span><span class="n">objective</span>';
      b.addEventListener("click", function () { showPin(i); });
      choices.appendChild(b); pinEls.push(b);
    });
    showPin(0);
    D.showPin = showPin;
  }

  /* ---------------- 3. Bridge: which slide is the ugu peel, and how big is a red cell? ---------------- */
  var bt = document.getElementById("bridge-test");
  if (bt) {
    var B = D.bridge, step = 1, wrong = 0, doneFired = false;
    B.slides.forEach(function (s) {
      var cv = document.getElementById("bridge-" + s.id.toLowerCase());
      if (!cv) return;
      var c = cv.getContext("2d");
      if (window.MicroscopeBench && MicroscopeBench.renderView) {
        MicroscopeBench.renderView(c, cv.width, { slide: s.slide, objective: 2, eyepiece: 10, blur: 0, brightness: 1, guide: false });
      } else {
        c.fillStyle = "#222"; c.fillRect(0, 0, cv.width, cv.height);
        c.fillStyle = "#fff"; c.font = "20px sans-serif"; c.fillText("Slide " + s.id, 20, 40);
      }
    });
    var qText = document.getElementById("bridge-qtext"), opts = document.getElementById("bridge-opts"), fb = document.getElementById("bridge-fb");
    var big = document.getElementById("big-idea");
    var showQ = function () {
      var q = step === 1 ? B.q1 : B.q2;
      qText.textContent = (step === 1 ? "Question 1 of 2. " : "Question 2 of 2. ") + q.text;
      opts.innerHTML = "";
      q.opts.forEach(function (t, i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "vt-btn"; b.textContent = t;
        b.addEventListener("click", function () { answer(i, b); });
        opts.appendChild(b);
      });
    };
    var answer = function (i, btn) {
      var q = step === 1 ? B.q1 : B.q2;
      if (i === q.a) {
        fb.className = "bridge-fb on";
        var extra = "";
        if (step === 2) extra = " Working: " + B.q2.fieldMm.toFixed(2) + " mm ÷ " + B.q2.cells + " = " + (B.q2.fieldMm / B.q2.cells).toFixed(3) + " mm = " + Math.round(B.q2.fieldMm / B.q2.cells * 1000) + " µm.";
        fb.innerHTML = "<b>Correct.</b> " + q.why + extra;
        burst(fb, 14);
        if (step === 1) { step = 2; setTimeout(showQ, 900); }
        else {
          opts.innerHTML = ""; qText.textContent = "Both answered. Read the big idea below.";
          if (big) big.classList.add("unlocked");
          if (!doneFired) { doneFired = true; emit("l1:bridge", { correct: wrong === 0, wrong: wrong }); }
        }
      } else {
        wrong++;
        if (btn) btn.disabled = true;
        fb.className = "bridge-fb on bad";
        fb.innerHTML = "<b>Not quite.</b> Look at the slides again and try another answer.";
      }
    };
    showQ();
    D.bridgeApi = { solve: function () { answer(step === 1 ? B.q1.a : B.q2.a); } };
  }
})();
