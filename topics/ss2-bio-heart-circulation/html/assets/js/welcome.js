/* ==========================================================
   StudyPipe — Welcome Hub UI interactions (The Human Heart & Blood Circulation)
   - Scroll-triggered reveal for .reveal blocks
   - Interactive Explorer tabs (window.WELCOME_COMBOS + StudyGraph)
   - Myth-buster flip cards (.myth-card)
   ========================================================== */
(function () {
  "use strict";

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var combos = window.WELCOME_COMBOS || {};
  var tabs = document.querySelectorAll(".combo-tab");
  var fields = {
    title: document.getElementById("combo-title"),
    example: document.getElementById("combo-example"),
    jump: document.getElementById("combo-jump"),
    eq: document.getElementById("combo-eq"),
    ind: document.getElementById("combo-ind"),
    why: document.getElementById("combo-why")
  };

  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(t) { return esc(t).replace(/([A-Za-zπP%Δ])_([A-Za-z]+)/g, "$1<sub>$2</sub>"); }
  function plain(t) { return String(t).replace(/([A-Za-zπP])_([A-Za-z]+)/g, "$1$2"); }
  var panel = document.getElementById("combo-panel");

  function selectCombo(key) {
    var d = combos[key];
    if (!d) return;
    tabs.forEach(function (t) {
      var active = t.getAttribute("data-combo") === key;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
      t.setAttribute("tabindex", active ? "0" : "-1");
      if (active && panel) panel.setAttribute("aria-labelledby", t.id);
    });
    if (fields.title && d.title !== undefined) fields.title.innerHTML = fmt(d.title);
    if (fields.example && d.example !== undefined) fields.example.innerHTML = fmt(d.example);
    if (fields.jump && d.jump !== undefined) fields.jump.innerHTML = fmt(d.jump);
    if (fields.eq && d.eq !== undefined) fields.eq.innerHTML = fmt(d.eq);
    if (fields.ind && d.ind !== undefined) {
      fields.ind.innerHTML = fmt(d.ind);
      if (d.indClass) fields.ind.className = "combo-pill " + d.indClass;
    }
    if (fields.why && d.why !== undefined) fields.why.innerHTML = fmt(d.why);
  }

  var GRAPHS = {
    output: {
      x: { label: "Heart rate HR", unit: "bpm", min: 50, max: 190, step: 20 },
      y: { label: "Cardiac output CO", unit: "L/min", min: 0, max: 22, step: 4 },
      range: [55, 185], slide: "Heart rate HR (bpm)",
      f: function (hr) {
        var sv = hr <= 90 ? 0.070 : Math.min(0.115, 0.070 + (hr - 90) * 0.0005);
        return hr * sv;
      },
      guides: [{ axis: "y", value: 5.04, tone: "lime" }],
      series: function () {
        return [
          { id: "co", name: "Cardiac output CO = HR × SV (L/min)", tone: "teal", fn: this.f, fnRange: [50, 190] },
          { id: "rest", name: "Resting baseline (5.04 L/min at 72 bpm)", tone: "lime", fn: function () { return 5.04; }, dashed: true }
        ];
      },
      read: function (hr, co) {
        var T = (60 / hr).toFixed(2);
        return [["HR", Math.round(hr) + " bpm"], ["CO = HR×SV", co.toFixed(2) + " L/min"], ["Cycle T = 60÷HR", T + " s"]];
      }
    },
    pressure: {
      x: { label: "Circuit distance (LV → Vena Cava)", unit: "%", min: 0, max: 100, step: 20 },
      y: { label: "Blood pressure P", unit: "mmHg", min: 0, max: 135, step: 25 },
      range: [0, 100], slide: "Position along systemic circuit (%)",
      f: function (u) {
        if (u < 35) return 120 - u * 0.45;
        if (u < 65) return 104 - (u - 35) * 2.3;
        return Math.max(2, 35 - (u - 65) * 0.95);
      },
      guides: [{ axis: "y", value: 25, tone: "amber" }],
      series: function () {
        return [
          { id: "sys", name: "Systolic/Mean pressure profile (mmHg)", tone: "pink", fn: this.f, fnRange: [0, 100] },
          { id: "pulm", name: "Right-ventricle pulmonary peak (25 mmHg)", tone: "amber", fn: function () { return 25; }, dashed: true }
        ];
      },
      read: function (u, p) {
        var v = u < 30 ? "Aorta / Artery" : u < 60 ? "Arteriole" : u < 80 ? "Capillary" : "Vein / Vena Cava";
        return [["Vessel zone", v], ["Pressure P", Math.round(p) + " mmHg"], ["Valves?", u >= 80 ? "Semilunar valves" : "None (high P)"]];
      }
    },
    starling: {
      x: { label: "Distance along capillary", unit: "%", min: 0, max: 100, step: 20 },
      y: { label: "Pressure", unit: "mmHg", min: 10, max: 40, step: 5 },
      range: [0, 100], slide: "Position along capillary bed (%)",
      f: function (u) { return 35 - 0.20 * u; },
      guides: [{ axis: "y", value: 25, tone: "sky" }, { axis: "x", value: 50, tone: "amber" }],
      series: function () {
        return [
          { id: "pc", name: "Hydrostatic pressure P_c (35 → 15 mmHg)", tone: "pink", fn: this.f, fnRange: [0, 100] },
          { id: "pi", name: "Colloid osmotic pressure π_c (25 mmHg)", tone: "sky", fn: function () { return 25; }, dashed: true }
        ];
      },
      read: function (u, pc) {
        var nfp = pc - 25;
        var dir = Math.abs(nfp) < 0.5 ? "Equilibrium" : nfp > 0 ? "Ultrafiltration (out)" : "Reabsorption (in)";
        return [["P_c", pc.toFixed(1) + " mmHg"], ["NFP = P_c − 25", (nfp >= 0 ? "+" : "") + nfp.toFixed(1) + " mmHg"], ["Net flow", dir]];
      }
    },
    sav: {
      x: { label: "Cube side length L", unit: "mm", min: 0, max: 10, step: 2 },
      y: { label: "SA/V ratio (6/L)", unit: "mm⁻¹", min: 0, max: 32, step: 8 },
      range: [0.2, 9.8], slide: "Organism side length L (mm)",
      f: function (L) { return 6 / L; },
      series: function () {
        return [{ id: "s", name: "SA/V = 6 ÷ L (hyperbolic drop)", tone: "amber", fn: this.f, fnRange: [0.2, 10] }];
      },
      read: function (L, r) {
        return [["Side L", L.toFixed(2) + " mm"], ["SA/V = 6÷L", r.toFixed(2) + " mm⁻¹"], ["Transport", L < 0.6 ? "Diffusion only" : "Heart + vessels"]];
      }
    }
  };

  var graphEl = document.getElementById("combo-graph");
  var slider = document.getElementById("combo-slider");
  var readEl = document.getElementById("combo-read");
  var slideLabel = document.getElementById("combo-slide-label");
  var graph = graphEl && window.StudyGraph ? StudyGraph.create(graphEl, { theme: "dark", x: GRAPHS.output.x, y: GRAPHS.output.y, ratio: 0.7 }) : null;
  var gKey = "output";

  function drawGraph() {
    var G = GRAPHS[gKey];
    if (!graph || !G) return;
    var u = slider ? +slider.value / 1000 : 0.5;
    var x = G.range[0] + (G.range[1] - G.range[0]) * u, y = G.f(x);
    var pt = { x: x, y: y };
    var ser = G.series(pt).map(function (z) { var o = {}; for (var k in z) o[k] = z[k]; o.name = plain(z.name); return o; });
    var ax = function (a) { var o = {}; for (var k in a) o[k] = a[k]; o.label = plain(a.label); return o; };
    graph.set({
      x: ax(G.x), y: ax(G.y), series: ser, guides: G.guides || [], marker: { x: x, y: y, tone: "amber" },
      aria: plain((combos[gKey] && combos[gKey].title || "Graph") + ": " + G.y.label + " against " + G.x.label)
    });
    if (readEl) readEl.innerHTML = G.read(x, y).map(function (r) { return "<div><span>" + fmt(r[0]) + "</span><b>" + fmt(r[1]) + "</b></div>"; }).join("");
    if (slideLabel) slideLabel.innerHTML = "Slide to change " + fmt(G.slide);
  }

  if (slider) slider.addEventListener("input", function () { requestAnimationFrame(drawGraph); });
  var baseSelect = selectCombo;
  selectCombo = function (key) {
    baseSelect(key);
    if (GRAPHS[key]) { gKey = key; if (slider) slider.value = 500; drawGraph(); }
  };
  drawGraph();

  var tabArr = Array.prototype.slice.call(tabs);
  tabArr.forEach(function (t, i) {
    t.setAttribute("tabindex", t.classList.contains("is-active") ? "0" : "-1");
    t.addEventListener("click", function () {
      selectCombo(t.getAttribute("data-combo"));
    });
    t.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % tabArr.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + tabArr.length) % tabArr.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabArr.length - 1;
      if (j === null) return;
      e.preventDefault();
      tabArr[j].focus();
      selectCombo(tabArr[j].getAttribute("data-combo"));
    });
  });

  var myths = document.querySelectorAll(".myth-card");
  myths.forEach(function (card) {
    card.addEventListener("click", function () {
      var open = card.classList.toggle("is-flipped");
      card.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.querySelectorAll(".lesson.is-live").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var a = card.querySelector("h3 a, a");
      if (a && a.href) window.location.href = a.href;
    });
  });

  function readStore(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  var QUIZ_TOTAL = 12, firstOpen = null;
  document.querySelectorAll(".lesson[data-lesson]").forEach(function (card) {
    var n = card.getAttribute("data-lesson"), id = "l0" + n;
    var seen = readStore("sp-" + id + "-seen"), quiz = readStore("sp-" + id + "-quiz");
    var parts = seen ? Object.keys(seen).length : 0, answered = quiz ? Object.keys(quiz).length : 0;
    var state = answered >= QUIZ_TOTAL ? "done" : (parts || answered) ? "started" : "new";
    var time = card.querySelector(".lesson-time");
    if (time) {
      time.textContent = "80 min · " + (state === "done" ? "Quiz done ✓" : state === "started" ? "In progress" : "Not started");
      time.classList.add("is-" + state);
    }
    card.classList.add("progress-" + state);
    if (firstOpen === null && state !== "done") firstOpen = { n: n, state: state };
  });
  var cont = document.querySelector("[data-continue]");
  if (cont && firstOpen && (firstOpen.n !== "1" || firstOpen.state === "started")) {
    cont.setAttribute("href", "lessons/lesson-0" + firstOpen.n + "/index.html");
    cont.textContent = (firstOpen.state === "started" ? "Continue" : "Begin") + " Lesson " + firstOpen.n + " →";
  }

  var hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    document.body.classList.add("hero-tour-visible");
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle("hero-tour-visible", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(hero);
  }
})();
