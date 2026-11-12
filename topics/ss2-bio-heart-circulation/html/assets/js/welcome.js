/* ==========================================================
   StudyPipe — Welcome Hub UI interactions
   - Scroll-triggered reveal for .reveal blocks
   - Interactive Explorer tabs (window.WELCOME_COMBOS)
   - Myth-buster flip cards (.myth-card)
   ========================================================== */
(function () {
  "use strict";

  // 1. Scroll reveal
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

  // 2. Interactive Concept Explorer tabs
  var combos = window.WELCOME_COMBOS || {
    "strong-strong": {
      title: "Strong acid + Strong base",
      example: "e.g. HCl against NaOH",
      jump: "pH 3.0 → 10.5",
      eq: "pH 7.0 (neutral)",
      ind: "Methyl orange OR phenolphthalein",
      indClass: "ind-both",
      why: "The vertical jump at equivalence is huge (over 7 pH units), so both indicators change colour inside the same single drop.",
      path: "M 56 172 C 130 171, 200 168, 224 160 L 228 52 C 252 44, 330 40, 416 38",
      markerY: 105,
      zoneY: 48, zoneH: 114
    }
  };

  var tabs = document.querySelectorAll(".combo-tab");
  var fields = {
    title: document.getElementById("combo-title"),
    example: document.getElementById("combo-example"),
    jump: document.getElementById("combo-jump"),
    eq: document.getElementById("combo-eq"),
    ind: document.getElementById("combo-ind"),
    why: document.getElementById("combo-why"),
    curve: document.getElementById("combo-curve"),
    marker: document.getElementById("combo-marker"),
    zone: document.getElementById("combo-zone")
  };

  function selectCombo(key) {
    var d = combos[key];
    if (!d) return;
    tabs.forEach(function (t) {
      var active = t.getAttribute("data-combo") === key;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (fields.title && d.title !== undefined) fields.title.textContent = d.title;
    if (fields.example && d.example !== undefined) fields.example.textContent = d.example;
    if (fields.jump && d.jump !== undefined) fields.jump.textContent = d.jump;
    if (fields.eq && d.eq !== undefined) fields.eq.textContent = d.eq;
    if (fields.ind && d.ind !== undefined) {
      fields.ind.textContent = d.ind;
      if (d.indClass) fields.ind.className = "combo-pill " + d.indClass;
    }
    if (fields.why && d.why !== undefined) fields.why.textContent = d.why;
    if (fields.curve && d.path) fields.curve.setAttribute("d", d.path);
    if (fields.marker) {
      if (d.markerX !== undefined) fields.marker.setAttribute("cx", d.markerX);
      if (d.markerY !== undefined) fields.marker.setAttribute("cy", d.markerY);
    }
    if (fields.zone && d.zoneY !== undefined) {
      fields.zone.setAttribute("y", d.zoneY);
      fields.zone.setAttribute("height", d.zoneH);
    }
    // Generic data-combo-field support
    document.querySelectorAll("[data-combo-field]").forEach(function (el) {
      var f = el.getAttribute("data-combo-field");
      if (d[f] !== undefined) el.textContent = d[f];
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      selectCombo(t.getAttribute("data-combo"));
    });
  });

  // 3. Myth flip cards
  var myths = document.querySelectorAll(".myth-card");
  myths.forEach(function (card) {
    card.addEventListener("click", function () {
      var open = card.classList.toggle("is-flipped");
      card.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // 4. Whole-card click for live lessons
  document.querySelectorAll(".lesson.is-live").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var a = card.querySelector("h3 a, a");
      if (a && a.href) window.location.href = a.href;
    });
  });
})();
