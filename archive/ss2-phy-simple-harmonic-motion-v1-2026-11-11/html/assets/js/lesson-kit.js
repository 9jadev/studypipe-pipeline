/* =========================================================
   StudyPipe · LessonKit — shared behaviour for every lesson page
   nav, progress rail, reveals, wonder wall, quiz engine,
   self-assessment, assignment answer boxes + locked solutions,
   print, toasts. No dependencies; works offline.
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LESSON = document.body.getAttribute("data-lesson") || "lesson";

  // ---------- storage (per-device convenience only) ----------
  var Store = {
    get: function (k, d) { try { var v = localStorage.getItem("sp-" + LESSON + "-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("sp-" + LESSON + "-" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); }

  // ---------- toast ----------
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  // ---------- retrieval: Do Now starter + blank-page recall (content in retrieval-bank.js) ----------
  var BANK = (window.RETRIEVAL_BANK || {})[LESSON] || {};
  function lessonLink(it) { return "../lesson-" + (it.from < 10 ? "0" : "") + it.from + "/index.html#" + it.sec; }

  var donowRoot = document.getElementById("donow-list");
  if (donowRoot && BANK.donow) {
    var dnMarks = Store.get("donow", {});
    var dnScore = document.querySelector("[data-donow-score]");
    var dnTotal = BANK.donow.length;
    var dnUpdate = function () {
      var done = 0, got = 0;
      BANK.donow.forEach(function (_, i) { if (dnMarks[i] != null) { done++; if (dnMarks[i] === 2) got++; } });
      if (dnScore) dnScore.innerHTML = "Remembered <b>" + got + " / " + dnTotal + "</b> <span>" +
        (done < dnTotal ? (dnTotal - done) + " to go" : got === dnTotal ? "Brilliant memory. On to the story!" : (done - got) + " to revisit: follow the links above") + "</span>";
      return { done: done, got: got };
    };
    var dnBuild = function () {
      donowRoot.innerHTML = "";
      BANK.donow.forEach(function (it, i) {
        var card = document.createElement("div");
        card.className = "dn-card";
        card.innerHTML =
          '<div class="qn"></div><p class="qt"></p>' +
          '<button class="btn btn-ink btn-sm dn-reveal" type="button">I\'ve got my answer · show me</button>' +
          '<div class="dn-ans" hidden><div class="dn-a"></div>' +
            '<div class="dn-mark" role="group" aria-label="Did you remember it?"><span>Did you remember it?</span>' +
              '<button type="button" data-m="2" aria-pressed="false">Got it</button>' +
              '<button type="button" data-m="1" aria-pressed="false">Partly</button>' +
              '<button type="button" data-m="0" aria-pressed="false">Not yet</button>' +
            '</div>' +
            '<a class="dn-revisit"></a>' +
          '</div>';
        card.querySelector(".qn").textContent = (it.from ? "FROM LESSON " + it.from : "PREREQUISITE") + " · " + it.where.toUpperCase();
        card.querySelector(".qt").innerHTML = it.q;
        card.querySelector(".dn-a").innerHTML = it.a;
        var link = card.querySelector(".dn-revisit");
        if (it.from) {
          link.href = lessonLink(it);
          link.textContent = "Revisit Lesson " + it.from + ": " + it.where + " →";
        } else {
          link.style.display = "none";
        }
        var btn = card.querySelector(".dn-reveal"), ans = card.querySelector(".dn-ans");
        function reveal() { btn.remove(); ans.hidden = false; }
        function paint(m) {
          card.setAttribute("data-m", m);
          card.querySelectorAll(".dn-mark button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-m") === String(m) ? "true" : "false"); });
        }
        btn.addEventListener("click", function () { reveal(); ans.querySelector(".dn-mark button").focus({ preventScroll: true }); });
        card.querySelectorAll(".dn-mark button").forEach(function (b) {
          b.addEventListener("click", function () {
            var m = +b.getAttribute("data-m");
            dnMarks[i] = m; Store.set("donow", dnMarks); paint(m);
            var r = dnUpdate();
            if (m === 2 && window.StudyNarrator && window.StudyNarrator.burst) window.StudyNarrator.burst(b.getBoundingClientRect(), 10);
            emit("kit:donow", { index: i, mark: m, done: r.done, got: r.got, total: dnTotal });
          });
        });
        if (dnMarks[i] != null) { reveal(); paint(dnMarks[i]); }
        donowRoot.appendChild(card);
      });
      dnUpdate();
    };
    dnBuild();
    var dnReset = document.querySelector("[data-donow-reset]");
    if (dnReset) dnReset.addEventListener("click", function () { dnMarks = {}; Store.set("donow", dnMarks); dnBuild(); });
  }

  var reflectSec = document.getElementById("reflect");
  if (reflectSec && BANK.recall) {
    var rc = BANK.recall;
    var rcBox = document.createElement("div");
    rcBox.className = "aq recall";
    rcBox.setAttribute("data-answer", "recall");
    rcBox.innerHTML =
      '<div class="aq-top"><h4>Blank-page recall</h4><span class="marks">' + rc.points.length + ' key points</span></div>' +
      '<p class="recall-prompt"></p>' +
      '<p class="recall-tip">Close your notes and don\'t scroll up. Getting it out of your memory is the exercise, even if it feels hard.</p>' +
      '<textarea class="l-textarea" aria-label="Blank-page recall"></textarea>' +
      '<details class="reveal-box solution"><summary>Key-point checklist <small>unlocks after you try</small></summary><div class="reveal-body">' +
        '<p>Tick each point you wrote down, even in your own words.</p><ul class="recall-list"></ul><p class="recall-score" aria-live="polite"></p>' +
      '</div></details>';
    rcBox.querySelector(".recall-prompt").textContent = rc.prompt;
    var rcTicks = Store.get("recall-ticks", {});
    var rcList = rcBox.querySelector(".recall-list"), rcScore = rcBox.querySelector(".recall-score");
    var rcUpdate = function () {
      var n = rc.points.filter(function (_, i) { return rcTicks[i]; }).length;
      rcScore.textContent = n === rc.points.length
        ? "You recalled all " + n + " points. Excellent!"
        : "You recalled " + n + " of " + rc.points.length + ". The unticked points are your revision list for next time.";
    };
    rc.points.forEach(function (p, i) {
      var li = document.createElement("li"), label = document.createElement("label"), cb = document.createElement("input");
      cb.type = "checkbox"; cb.setAttribute("data-tick", ""); cb.checked = !!rcTicks[i];
      cb.addEventListener("change", function () { rcTicks[i] = cb.checked; Store.set("recall-ticks", rcTicks); rcUpdate(); });
      label.appendChild(cb); label.appendChild(document.createTextNode(p));
      li.appendChild(label); rcList.appendChild(li);
    });
    rcUpdate();
    var exitBox = reflectSec.querySelector('[data-answer="exit"]');
    if (exitBox) exitBox.parentNode.insertBefore(rcBox, exitBox); else reflectSec.appendChild(rcBox);
  }

  // ---------- nav + scroll progress ----------
  var nav = document.getElementById("nav");
  var bar = document.querySelector(".progress");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- reveal ----------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  // ---------- progress rail ----------
  var railLinks = Array.prototype.slice.call(document.querySelectorAll(".l-rail a[href^='#']"));
  var secs = railLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var seen = Store.get("seen", {});
  var railFill = document.querySelector(".rail-progress i");
  var railNote = document.querySelector(".l-rail small");
  function paintRail() {
    var n = 0;
    railLinks.forEach(function (a) { var id = a.getAttribute("href").slice(1); var d = !!seen[id]; a.classList.toggle("done", d && !a.classList.contains("active")); if (d) n++; });
    if (railFill) railFill.style.width = Math.round((n / railLinks.length) * 100) + "%";
    if (railNote) railNote.textContent = n + " of " + railLinks.length + " parts visited";
  }
  function updateRail() {
    var mid = window.innerHeight * 0.35, active = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= mid) active = i; });
    railLinks.forEach(function (a, i) { a.classList.toggle("active", i === active); });
    if (active >= 0) {
      var id = railLinks[active].getAttribute("href").slice(1);
      if (!seen[id]) { seen[id] = true; Store.set("seen", seen); }
      var act = railLinks[active];
      if (act.scrollIntoView && window.innerWidth <= 1060) {
        var ol = act.parentElement.parentElement;
        ol.scrollLeft = act.offsetLeft - 20;
      }
    }
    paintRail();
  }
  window.addEventListener("scroll", updateRail, { passive: true });
  updateRail();

  // ---------- wonder wall ----------
  var wallRenderers = {};
  document.querySelectorAll("[data-wall]").forEach(function (wrap) {
    var key = "wall-" + wrap.getAttribute("data-wall");
    (wallRenderers[key] = wallRenderers[key] || []).push(function () { notes = Store.get(key, []); render(); });
    var list = wrap.querySelector(".wall");
    var form = wrap.querySelector(".wall-form");
    var input = form.querySelector("input");
    var notes = Store.get(key, []);
    var COLORS = (getComputedStyle(document.documentElement).getPropertyValue("--wall-notes").trim() || "#ffe58a,#ffc7d9,#bff0e1,#cfe3ff,#ffd8b0").split(",").map(function (s) { return s.trim(); });
    function render() {
      list.innerHTML = "";
      notes.forEach(function (t, i) {
        var n = document.createElement("div");
        n.className = "note";
        n.style.setProperty("--nc", COLORS[i % COLORS.length]);
        n.style.setProperty("--r", ((i * 37) % 7 - 3) + "deg");
        n.textContent = t;
        var x = document.createElement("button");
        x.type = "button"; x.textContent = "remove"; x.setAttribute("aria-label", "Remove note");
        x.addEventListener("click", function () { notes.splice(i, 1); Store.set(key, notes); syncAll(); });
        n.appendChild(x);
        list.appendChild(n);
      });
    }
    function add(t) {
      t = (t || "").trim();
      if (!t) return;
      notes = Store.get(key, []); notes.push(t.slice(0, 160)); Store.set(key, notes); syncAll();
      emit("kit:note", { text: t, count: notes.length });
      if (window.StudyNarrator && window.StudyNarrator.burst) window.StudyNarrator.burst(list.lastChild.getBoundingClientRect(), 12);
    }
    function syncAll() { wallRenderers[key].forEach(function (fn) { fn(); }); }
    form.addEventListener("submit", function (e) { e.preventDefault(); add(input.value); input.value = ""; });
    wrap.querySelectorAll(".seed-qs button").forEach(function (b) { b.addEventListener("click", function () { add(b.textContent); }); });
    render();
  });

  // ---------- quiz engine ----------
  function buildQuiz(root, data) {
    var answered = Store.get("quiz", {});
    var scoreEl = root.parentElement.querySelector("[data-quiz-score]");
    var LET = ["A", "B", "C", "D"];
    function update() {
      var n = 0, c = 0;
      data.forEach(function (q, i) { if (answered[i] != null) { n++; if (answered[i] === q.a) c++; } });
      if (scoreEl) scoreEl.innerHTML = "Score <b>" + c + " / " + data.length + "</b> <span>" + (n < data.length ? (data.length - n) + " to go" : (c === data.length ? "Perfect score!" : "Read the explanations, then retry")) + "</span>";
      return { n: n, c: c };
    }
    data.forEach(function (q, i) {
      var card = document.createElement("div");
      card.className = "qcard";
      card.innerHTML = '<div class="qn">QUESTION ' + (i + 1) + (q.src ? " · " + q.src : "") + '</div><p class="qt"></p><div class="qopts"></div><div class="qexp"></div>';
      card.querySelector(".qt").innerHTML = q.q;
      var opts = card.querySelector(".qopts"), exp = card.querySelector(".qexp");
      exp.innerHTML = q.e;
      q.o.forEach(function (o, k) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "qopt";
        b.innerHTML = "<b>" + LET[k] + "</b><span>" + o + "</span>";
        b.addEventListener("click", function () { choose(k); });
        opts.appendChild(b);
      });
      function choose(k, silent) {
        answered[i] = k; Store.set("quiz", answered);
        Array.prototype.forEach.call(opts.children, function (b, j) {
          b.disabled = true;
          b.classList.toggle("correct", j === q.a);
          b.classList.toggle("incorrect", j === k && k !== q.a);
        });
        exp.classList.add("on");
        exp.insertAdjacentHTML("afterbegin", "");
        var r = update();
        if (!silent) {
          if (k === q.a && window.StudyNarrator && window.StudyNarrator.burst) window.StudyNarrator.burst(opts.children[k].getBoundingClientRect(), 10);
          if (r.n === data.length) emit("kit:quiz-done", { score: r.c, total: data.length });
        }
      }
      if (answered[i] != null) choose(answered[i], true);
      root.appendChild(card);
    });
    var reset = root.parentElement.querySelector("[data-quiz-reset]");
    if (reset) reset.addEventListener("click", function () {
      answered = {}; Store.set("quiz", answered); root.innerHTML = ""; buildQuiz(root, data);
      root.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
    update();
  }
  var quizRoot = document.getElementById("quiz-list");
  // review questions from earlier lessons go after the lesson's own, so saved answers keep their index
  var reviewQs = (BANK.quiz || []).map(function (q) { return { q: q.q, o: q.o, a: q.a, e: q.e, src: "REVIEW FROM LESSON " + q.from }; });
  if (quizRoot && window.LESSON_QUIZ) buildQuiz(quizRoot, window.LESSON_QUIZ.concat(reviewQs));

  // ---------- self-assessment ----------
  document.querySelectorAll("[data-rate]").forEach(function (row) {
    var id = row.getAttribute("data-rate");
    var ratings = Store.get("rate", {});
    var btns = row.querySelectorAll(".rate-btns button");
    function paint(v) { btns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-v") === String(v) ? "true" : "false"); }); }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        ratings = Store.get("rate", {}); ratings[id] = +b.getAttribute("data-v"); Store.set("rate", ratings); paint(ratings[id]);
        emit("kit:rated", { id: id, value: ratings[id], count: Object.keys(ratings).length });
      });
    });
    if (ratings[id]) paint(ratings[id]);
  });

  // ---------- answer boxes (saved) + locked solutions ----------
  document.querySelectorAll("[data-answer]").forEach(function (box) {
    var id = box.getAttribute("data-answer");
    var saved = Store.get("ans-" + id, "");
    var ta = box.querySelector("textarea");
    var sol = box.querySelector("details.solution");
    var chk = box.querySelector("input[type=checkbox]:not([data-tick])");
    if (ta) ta.value = saved;
    function unlocked() { return (ta && ta.value.trim().length >= 12) || (chk && chk.checked); }
    function paint() { if (sol) sol.classList.toggle("locked", !unlocked()); }
    if (ta) ta.addEventListener("input", function () { Store.set("ans-" + id, ta.value); paint(); });
    if (chk) {
      chk.checked = !!Store.get("try-" + id, false);
      chk.addEventListener("change", function () { Store.set("try-" + id, chk.checked); paint(); });
    }
    if (sol) {
      sol.querySelector("summary").addEventListener("click", function (e) {
        if (!sol.open && !unlocked()) {
          e.preventDefault();
          toast("Have a go first! Write your answer (or tick “I've attempted this”), then compare.");
          if (ta) ta.focus();
        } else if (!sol.open) emit("kit:solution", { id: id });
      });
    }
    paint();
  });

  // ---------- print ----------
  document.querySelectorAll("[data-print]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("details.reveal-box:not(.solution)").forEach(function (d) { d.open = true; });
      window.print();
    });
  });

  window.LessonKit = { Store: Store, toast: toast, emit: emit };
})();
