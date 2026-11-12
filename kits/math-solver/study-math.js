/* ==========================================================================
   StudyPipe · StudyMath v3 (kits/math-solver/study-math.js) — classic script, offline
   --------------------------------------------------------------------------
   Shows calculations as LaTeX step cards. It does NOT parse or guess maths in the
   browser. Every chain on the page is compiled and checked at build time by
     node scripts/compile-math.mjs topics/<slug>
   which parses each chain with a real expression parser (scripts/lib/math-chain.mjs),
   checks every "=" numerically, writes LaTeX + step notes into the page's math.js
   (window.STUDY_MATH) and fails QA on any wrong value. This file only looks those
   entries up and renders them with KaTeX (assets/katex/katex.min.js).
   A chain that is not in STUDY_MATH stays as plain text (and is listed in StudyMath.misses).

   Load order: assets/katex/katex.min.js, ./math.js (per page), this file.
   API: StudyMath.tex(text, display) · renderLatex · upgradePage(root) · collect() · misses
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.STUDY_MATH || {};
  DATA.c = DATA.c || {}; DATA.p = DATA.p || {};
  var misses = [];
  var collecting = null; // build time: { c:{}, p:{}, l:{} }

  // ---------- text key: exactly what the build saw ----------
  function norm(el) {
    var clone = el.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll(".st, .m-calc-wrap, .m-eq-note"), function (n) { n.parentNode.removeChild(n); });
    Array.prototype.forEach.call(clone.querySelectorAll("sup"), function (n) { n.parentNode.replaceChild(document.createTextNode("^{" + n.textContent + "}"), n); });
    Array.prototype.forEach.call(clone.querySelectorAll("sub"), function (n) { n.parentNode.replaceChild(document.createTextNode("_{" + n.textContent + "}"), n); });
    return normStr(clone.textContent);
  }
  function normStr(s) { return String(s || "").replace(/[   ]/g, " ").replace(/\s+/g, " ").trim(); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  // ---------- KaTeX ----------
  function kt(tex, display) {
    if (!window.katex) return '<span class="sp-math-fallback">' + esc(tex) + "</span>";
    try {
      return window.katex.renderToString(tex, { displayMode: !!display, throwOnError: true, output: "html", strict: "ignore" });
    } catch (e) {
      misses.push({ kind: "katex", text: tex, error: String(e.message || e) });
      return '<span class="sp-math-fallback">' + esc(tex) + "</span>";
    }
  }
  function mathSpan(tex, display, label) {
    return '<span class="sp-math' + (display ? " sp-math-display" : "") + '" data-latex="' + esc(tex) + '"' +
      (label ? ' role="img" aria-label="' + esc(label) + '"' : "") + ">" + kt(tex, display) + "</span>";
  }

  function lookup(text) {
    if (collecting) { collecting.c[text] = 1; return null; }
    var e = DATA.c[text];
    if (!e) misses.push({ kind: "chain", text: text });
    return e || null;
  }

  // ---------- step card ----------
  function noteHtml(parts) {
    return parts.map(function (p) { return p[0] === "m" ? kt(p[1], false) : esc(p[1]); }).join("");
  }
  function cardHtml(entry, label) {
    var rows = entry.s.map(function (st, i) {
      return '<div class="m-step">' +
        '<div class="m-step-meta"><span class="m-step-num"><b>' + (i + 1) + "</b> Step " + (i + 1) + '</span><span class="m-step-tag">' + esc(st.g) + "</span></div>" +
        '<div class="m-step-eq">' + mathSpan(st.x, true) + "</div>" +
        (st.n && st.n.length ? '<div class="m-step-note"><i class="m-step-note-icon" aria-hidden="true">💡</i><span>' + noteHtml(st.n) + "</span></div>" : "") +
        "</div>";
    }).join("");
    return '<div class="m-calc-wrap" role="group" aria-label="' + esc("Working: " + label) + '">' +
      '<div class="m-calc-head"><span>Working, step by step</span><span class="m-tex-badge">' + entry.s.length + " steps</span></div>" +
      '<div class="m-step-list">' + rows + "</div></div>";
  }

  // ---------- targets ----------
  function each(root, sel, fn) {
    Array.prototype.forEach.call((root || document).querySelectorAll(sel), function (el) {
      if (!collecting) { if (el.getAttribute("data-math-upgraded")) return; el.setAttribute("data-math-upgraded", "1"); }
      fn(el);
    });
  }

  // a <code> chain inside a worked-example step: becomes a step card when it has steps
  function upgradeStepCodes(root) {
    each(root, "ol.steps-sol > li code", function (code) {
      var text = norm(code), e = lookup(text);
      if (!e) return;
      code.outerHTML = e.s ? cardHtml(e, text) : mathSpan(e.t, false, text);
    });
  }

  // <code> inside solutions / explanations / tables / questions: typeset in line;
  // chains with several steps also get a card at the end of their container
  function upgradeInlineCodes(root) {
    each(root, ".reveal-body code, .qexp code, .dn-a code, .qcard .qt code, .qcard .qopt code, .dn-card .qt code, #ph-info code, .tbl td code, .example p code, .callout code", function (code) {
      if (code.closest("ol.steps-sol")) return;
      var text = norm(code), e = lookup(text);
      if (!e) return;
      var box = code.closest(".reveal-body, .qexp, .dn-a");
      code.outerHTML = mathSpan(e.t, false, text);
      if (box && e.s) box.insertAdjacentHTML("beforeend", cardHtml(e, text));
    });
  }

  // prose with calculations written in sentences (quiz explanations, Do Now answers, solutions)
  function upgradeProse(root) {
    each(root, ".qexp, .dn-a, .solution .reveal-body", function (el) {
      if (el.querySelector("code")) return;
      var text = norm(el);
      if (collecting) { collecting.p[text] = 1; return; }
      var keys = DATA.p[text];
      if (!keys) { if (/=[^=]*\d/.test(text)) misses.push({ kind: "prose", text: text }); return; }
      keys.forEach(function (k) { var e = DATA.c[k]; if (e && e.s) el.insertAdjacentHTML("beforeend", cardHtml(e, k)); });
    });
  }

  // formula banners and hub equation cards: "·"-separated formulas; the note is authored (data-note or .st)
  function upgradeFormulaLines(root) {
    each(root, ".eq, .f-eq, .law-eq", function (el) {
      var side = Array.prototype.map.call(el.querySelectorAll(".st"), function (n) { return normStr(n.textContent); });
      var note = el.getAttribute("data-note") || side.join(" · ");
      var segs = norm(el).split(/\s*·\s*/).filter(Boolean);
      if (collecting) { segs.forEach(function (s) { collecting.c[s] = 1; }); return; }
      var html = segs.map(function (s) {
        var e = DATA.c[s];
        return e ? mathSpan(e.t, false, s) : '<span class="sp-text">' + esc(s) + "</span>";
      }).join('<span class="sp-sep" aria-hidden="true"> · </span>');
      el.innerHTML = '<div class="eq-latex-wrap"><div class="sp-math-display">' + html + "</div>" +
        (note && el.classList.contains("eq") ? '<div class="m-eq-note"><i class="m-step-note-icon" aria-hidden="true">📐</i><span>' + esc(note) + "</span></div>" : "") +
        "</div>";
    });
  }

  // final answers: "(a) T = 0.49 s · (b) f = 2.0 Hz"
  function upgradeAnswers(root) {
    each(root, ".answer-line", function (el) {
      var parts = norm(el).split(/\s*·\s*/).filter(Boolean);
      if (collecting) { parts.forEach(function (p) { collecting.c[p.replace(/^\([a-z]\)\s*/i, "")] = 1; }); return; }
      el.innerHTML = parts.map(function (p) {
        var m = p.match(/^(\([a-z]\)\s*)?([\s\S]+)$/i), lab = m[1] || "", body = m[2], e = DATA.c[body];
        return (lab ? "<strong>" + esc(lab) + "</strong> " : "") +
          (e ? mathSpan("\\boxed{" + e.t + "}", false, body) : esc(body));
      }).join(" &nbsp;·&nbsp; ");
    });
  }

  // authored LaTeX: <span class="sp-math" data-latex="...">
  function upgradeAuthored(root) {
    each(root, ".sp-math[data-latex]", function (el) {
      if (el.children.length) return;
      var tex = el.getAttribute("data-latex");
      if (collecting) { collecting.l[tex] = 1; return; }
      el.innerHTML = kt(tex, el.tagName === "DIV" || el.classList.contains("sp-math-block"));
    });
  }

  var busy = false;
  function upgradePage(root) {
    if (busy) return;
    busy = true;
    try {
      upgradeStepCodes(root);
      upgradeInlineCodes(root);
      upgradeProse(root);
      upgradeFormulaLines(root);
      upgradeAnswers(root);
      upgradeAuthored(root);
    } finally { busy = false; }
  }

  // tex(): natural-notation text the build compiled, or real LaTeX (contains "\")
  function tex(text, display) {
    var t = normStr(text);
    if (collecting) { collecting.c[t] = 1; return ""; }
    var e = DATA.c[t];
    if (e) return mathSpan(e.t, display, t);
    if (/\\/.test(t)) return mathSpan(t, display);
    misses.push({ kind: "tex", text: t });
    return '<span class="sp-text">' + esc(t) + "</span>";
  }

  // build time only: every key this page would look up (no DOM changes)
  function collect() {
    collecting = { c: {}, p: {}, l: {} };
    try {
      upgradePage(document);
      Array.prototype.forEach.call(document.querySelectorAll("[data-tex]"), function (n) { collecting.c[normStr(n.getAttribute("data-tex"))] = 1; });
      return { c: Object.keys(collecting.c), p: Object.keys(collecting.p), l: Object.keys(collecting.l) };
    } finally { collecting = null; }
  }

  function observe() {
    if (typeof MutationObserver === "undefined") return;
    ["quiz-list", "donow-list", "ph-info"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) new MutationObserver(function () { upgradePage(el); }).observe(el, { childList: true });
    });
  }

  window.StudyMath = { tex: tex, renderLatex: tex, upgradePage: upgradePage, collect: collect, norm: norm, misses: misses, version: 3 };

  function boot() {
    if (/[?&]mathcollect\b/.test(location.search)) return; // the build reads the page untouched
    upgradePage(document);
    observe();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
