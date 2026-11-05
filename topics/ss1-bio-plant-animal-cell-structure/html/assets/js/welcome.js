/* ==========================================================
   StudyPipe — Welcome Hub UI interactions (Plant & Animal Cell Structure)
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
  function fmt(t) { return esc(t).replace(/([A-Za-zΨ%Δ])_([A-Za-z]+)/g, "$1<sub>$2</sub>"); }
  // SVG graph text cannot hold <sub>; drop the underscore there (Ψ_p -> Ψp)
  function plain(t) { return String(t).replace(/([A-Za-zΨ])_([A-Za-z]+)/g, "$1$2"); }
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
    magnification: {
      x: { label: "Magnification M", unit: "×", min: 0, max: 1000, step: 200 },
      y: { label: "Image size I", unit: "mm", min: 0, max: 65, step: 10 },
      range: [50, 950], slide: "Magnification M (×)",
      f: function (M) { return 0.06 * M; },
      series: function () {
        return [{ id: "m", name: "Onion cell (A = 60 μm = 0.06 mm)", tone: "teal", fn: this.f, fnRange: [0, 1000] }];
      },
      read: function (M, I) {
        return [["Mag M", "×" + Math.round(M)], ["Image I", I.toFixed(1) + " mm"], ["Actual A = I÷M", "60 μm"]];
      }
    },
    osmometry: {
      x: { label: "Sucrose conc. C", unit: "M", min: 0, max: 0.8, step: 0.2 },
      y: { label: "Mass change %Δm", unit: "%", min: -25, max: 25, step: 10 },
      range: [0, 0.78], slide: "Sucrose molarity C (M)",
      f: function (C) { return 18 - 60 * C; },
      guides: [{ axis: "y", value: 0, tone: "lime" }, { axis: "x", value: 0.30, tone: "amber" }],
      series: function () {
        return [
          { id: "o", name: "Yam strip %Δm (Isotonic = 0.30 M)", tone: "sky", fn: this.f, fnRange: [0, 0.8] },
          { id: "z", name: "Isotonic line (0% mass change)", tone: "lime", fn: function () { return 0; }, dashed: true }
        ];
      },
      read: function (C, dm) {
        var st = Math.abs(C - 0.30) < 0.025 ? "Isotonic" : C < 0.30 ? "Turgid (+H₂O)" : "Plasmolysed (−H₂O)";
        return [["Conc C", C.toFixed(2) + " M"], ["%Δm", (dm >= 0 ? "+" : "") + dm.toFixed(1) + "%"], ["State", st]];
      }
    },
    tonicity: {
      x: { label: "Turgor pressure Ψ_p", unit: "kPa", min: 0, max: 800, step: 200 },
      y: { label: "Water potential Ψ_w", unit: "kPa", min: -800, max: 50, step: 200 },
      range: [0, 750], slide: "Turgor pressure Ψ_p (kPa)",
      f: function (Yp) { return -750 + Yp; },
      guides: [{ axis: "y", value: 0, tone: "teal" }],
      series: function () {
        return [
          { id: "w", name: "Ψ_w = Ψ_s + Ψ_p (Ψ_s = −750 kPa)", tone: "teal", fn: this.f, fnRange: [0, 750] },
          { id: "p", name: "Full turgor (Ψ_w = 0 kPa)", tone: "pink", fn: function () { return 0; }, dashed: true }
        ];
      },
      read: function (Yp, Yw) {
        return [["Ψ_s", "−750 kPa"], ["Ψ_p", "+" + Math.round(Yp) + " kPa"], ["Ψ_w = Ψ_s + Ψ_p", Math.round(Yw) + " kPa"]];
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
        return [["Side L", L.toFixed(2) + " mm"], ["SA/V = 6÷L", r.toFixed(2) + " mm⁻¹"], ["Transport", L < 0.6 ? "Diffusion only" : "Needs organs"]];
      }
    }
  };

  var graphEl = document.getElementById("combo-graph");
  var slider = document.getElementById("combo-slider");
  var readEl = document.getElementById("combo-read");
  var slideLabel = document.getElementById("combo-slide-label");
  var graph = graphEl && window.StudyGraph ? StudyGraph.create(graphEl, { theme: "dark", x: GRAPHS.magnification.x, y: GRAPHS.magnification.y, ratio: 0.7 }) : null;
  var gKey = "magnification";

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

  // ---------- Lesson progress (reads what each lesson's LessonKit saved on this device) ----------
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

  // the hero has its own "Start guided tour" button, so keep the floating pill away until the hero is scrolled past
  var hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    document.body.classList.add("hero-tour-visible");
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle("hero-tour-visible", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(hero);
  }
})();
