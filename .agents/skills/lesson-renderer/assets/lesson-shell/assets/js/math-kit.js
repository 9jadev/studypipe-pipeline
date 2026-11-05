/* =========================================================
   StudyPipe · StudyMath Service (math-kit.js)
   100% Offline LaTeX Parser, Natural-Math-to-LaTeX Compiler,
   Atomic Step-by-Step Calculation Decomposer, and Underneath
   Plain-English Explainer Note Generator.
   Works on file:// in Android WebView with zero CDN links.
   ========================================================= */
(function () {
  "use strict";

  // ---------- 1. Unicode / HTML Math Normalization & Natural-to-LaTeX Compiler ----------
  var SUP_MAP = {
    "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
    "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
    "⁺": "+", "⁻": "-", "ⁿ": "n"
  };
  var SUB_MAP = {
    "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
    "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
    "ₐ": "a", "ₑ": "e", "ₒ": "o", "ₓ": "x", "ₕ": "h",
    "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₚ": "p",
    "ₛ": "s", "ₜ": "t"
  };

  function htmlToMathTokens(html) {
    if (!html) return "";
    var s = String(html);
    // Convert <sub>...</sub> and <sup>...</sup> to LaTeX _{...} and ^{...}
    s = s.replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, function (_, inner) {
      return "_{" + stripTags(inner).trim() + "}";
    });
    s = s.replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, function (_, inner) {
      return "^{" + stripTags(inner).trim() + "}";
    });
    s = stripTags(s);
    s = s.replace(/&nbsp;/g, " ")
         .replace(/&amp;/g, "&")
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
         .replace(/&le;/g, "≤")
         .replace(/&ge;/g, "≥")
         .replace(/&ne;/g, "≠")
         .replace(/&times;/g, "×")
         .replace(/&divide;/g, "÷")
         .replace(/&minus;/g, "−");
    return s.trim();
  }

  function stripTags(str) {
    return String(str || "").replace(/<[^>]+>/g, "");
  }

  function normalizeUnicodeScripts(str) {
    var s = String(str || "");
    // Convert sequences of unicode superscripts like ¹⁴ or ⁻⁷ or ⁻¹
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+/g, function (m) {
      var out = "";
      for (var i = 0; i < m.length; i++) out += SUP_MAP[m.charAt(i)] || m.charAt(i);
      return "^{" + out + "}";
    });
    // Convert sequences of unicode subscripts like ₁ or ₀
    s = s.replace(/[₀₁₂₃₄₅₆₇₈₉ₐₑₒₓₕₖₗₘₙₚₛₜ]+/g, function (m) {
      var out = "";
      for (var i = 0; i < m.length; i++) out += SUB_MAP[m.charAt(i)] || m.charAt(i);
      return "_{" + out + "}";
    });
    return s;
  }

  // Find balanced bracket/paren group backwards or forwards
  function extractNumeratorLeft(s, pos) {
    var i = pos - 1;
    while (i >= 0 && /\s/.test(s.charAt(i))) i--;
    if (i < 0) return { start: pos, text: "" };
    var ch = s.charAt(i);
    if (ch === ")" || ch === "]" || ch === "}") {
      var open = ch === ")" ? "(" : ch === "]" ? "[" : "{";
      var depth = 0;
      var end = i;
      while (i >= 0) {
        var c = s.charAt(i);
        if (c === ch) depth++;
        else if (c === open) {
          depth--;
          if (depth === 0) break;
        }
        i--;
      }
      var startIdx = Math.max(0, i);
      // Include preceding function name or prefix like sin, cos, tan, √, 4ρL
      var pre = startIdx - 1;
      while (pre >= 0 && /[a-zA-Z0-9_^{}\\α-ωΑ-Ω√]/.test(s.charAt(pre))) pre--;
      var fullStart = pre + 1;
      var inner = s.slice(fullStart, end + 1).trim();
      if (fullStart === startIdx && (open === "(" || open === "[")) {
        inner = s.slice(startIdx + 1, end).trim();
      }
      return { start: fullStart, text: inner };
    }
    // Otherwise scan left across a single term (including trig call like "sin 55.0°" or "4ρL" or "3.00 × 10^{8}")
    var endPos = i + 1;
    while (i >= 0 && !/[=+−\-×÷,;|⇒→⇔<>≤≥≈∝]/.test(s.charAt(i))) {
      if (s.charAt(i) === "(" || s.charAt(i) === "[") break;
      i--;
    }
    var st = i + 1;
    return { start: st, text: s.slice(st, endPos).trim() };
  }

  function extractDenominatorRight(s, pos) {
    var n = s.length;
    var i = pos;
    while (i < n && /\s/.test(s.charAt(i))) i++;
    if (i >= n) return { end: pos, text: "" };
    var ch = s.charAt(i);
    if (ch === "(" || ch === "[" || ch === "{") {
      var close = ch === "(" ? ")" : ch === "[" ? "]" : "}";
      var depth = 0;
      var start = i;
      while (i < n) {
        var c = s.charAt(i);
        if (c === ch) depth++;
        else if (c === close) {
          depth--;
          if (depth === 0) break;
        }
        i++;
      }
      var endIdx = Math.min(n, i + 1);
      // Check if followed by exponent like (1.15 - 0.25)^{2}
      while (endIdx < n && (s.charAt(endIdx) === "^" || s.charAt(endIdx) === "_")) {
        endIdx++;
        if (s.charAt(endIdx) === "{") {
          while (endIdx < n && s.charAt(endIdx) !== "}") endIdx++;
          if (endIdx < n) endIdx++;
        } else {
          while (endIdx < n && /[a-zA-Z0-9+\-]/.test(s.charAt(endIdx))) endIdx++;
        }
      }
      var inner = s.slice(start + 1, i).trim();
      if (endIdx > i + 1) {
        inner = "(" + inner + ")" + s.slice(i + 1, endIdx);
      }
      return { end: endIdx, text: inner };
    }
    // Scan right across a single multiplicative/atomic term (e.g., "1.50", "sin 32.6°", "cos r", "2π")
    var st = i;
    // Allow optional function prefix like "sin ", "cos ", "tan ", "sec "
    var fnMatch = s.slice(st).match(/^(sin|cos|tan|sec|csc|cot)\s+/i);
    if (fnMatch) i += fnMatch[0].length;
    while (i < n) {
      var c2 = s.charAt(i);
      if (c2 === "{") {
        var d2 = 0;
        while (i < n) {
          if (s.charAt(i) === "{") d2++;
          else if (s.charAt(i) === "}") { d2--; if (d2 === 0) { i++; break; } }
          i++;
        }
        continue;
      }
      if (/[\s=+−\-×÷/,;|⇒→⇔<>≤≥≈∝)]/.test(c2)) break;
      i++;
    }
    return { end: i, text: s.slice(st, i).trim() };
  }

  /**
   * Converts natural/Unicode/HTML math notation into canonical LaTeX.
   */
  function toLatex(rawInput) {
    if (!rawInput) return "";
    var s = htmlToMathTokens(rawInput);
    s = normalizeUnicodeScripts(s);

    // Replace ½, ¼, ¾
    s = s.replace(/½/g, "\\frac{1}{2}")
         .replace(/¼/g, "\\frac{1}{4}")
         .replace(/¾/g, "\\frac{3}{4}");

    // Convert underscore words like λ_air or n_core or d_v into _{...}
    s = s.replace(/([a-zA-Zα-ωΑ-Ω])_([a-zA-Z0-9]+)/g, "$1_{$2}");
    // Convert leading subscript ratios like 1_n_2 or g_n_a
    s = s.replace(/\b([0-9a-zA-Z])_n_([0-9a-zA-Z])\b/g, "{}_{$1}n_{$2}");

    // Convert √[...] or √(...) or √token into \sqrt{...}
    var guard = 0;
    while (s.indexOf("√") !== -1 && guard++ < 25) {
      var rIdx = s.indexOf("√");
      var after = rIdx + 1;
      while (after < s.length && /\s/.test(s.charAt(after))) after++;
      var nextCh = s.charAt(after);
      if (nextCh === "(" || nextCh === "[" || nextCh === "{") {
        var closeCh = nextCh === "(" ? ")" : nextCh === "[" ? "]" : "}";
        var depth = 0, k = after;
        while (k < s.length) {
          if (s.charAt(k) === nextCh) depth++;
          else if (s.charAt(k) === closeCh) {
            depth--;
            if (depth === 0) break;
          }
          k++;
        }
        var radInner = s.slice(after + 1, k);
        s = s.slice(0, rIdx) + "\\sqrt{" + toLatex(radInner) + "}" + s.slice(k + 1);
      } else {
        var mTok = s.slice(after).match(/^([a-zA-Z0-9._{}^\\]+)/);
        var tok = mTok ? mTok[1] : "";
        s = s.slice(0, rIdx) + "\\sqrt{" + tok + "}" + s.slice(after + tok.length);
      }
    }

    // Convert division "A ÷ B" or "A / B" (when not inside a unit like m/s) into \frac{A}{B}
    guard = 0;
    while (s.indexOf("÷") !== -1 && guard++ < 30) {
      var dIdx = s.indexOf("÷");
      var left = extractNumeratorLeft(s, dIdx);
      var right = extractDenominatorRight(s, dIdx + 1);
      if (!left.text || !right.text) {
        s = s.slice(0, dIdx) + " \\div " + s.slice(dIdx + 1);
        break;
      }
      s = s.slice(0, left.start) + "\\frac{" + left.text + "}{" + right.text + "}" + s.slice(right.end);
    }

    // Also convert slash fractions like "(1 - 0.60^{2}) / (1 - 0.85^{2})" or "sin i / sin r" or "1 / n"
    guard = 0;
    var slashRe = /([^\s=+−\-×,;|⇒→⇔<>≤≥≈∝()]+|\([^()]+\))\s*\/\s*([^\s=+−\-×,;|⇒→⇔<>≤≥≈∝()]+|\([^()]+\))/;
    while (slashRe.test(s) && guard++ < 25) {
      var m = s.match(slashRe);
      if (!m) break;
      var mIdx = m.index;
      var lPart = m[1].trim();
      var rPart = m[2].trim();
      if (lPart.charAt(0) === "(" && lPart.charAt(lPart.length - 1) === ")") lPart = lPart.slice(1, -1).trim();
      if (rPart.charAt(0) === "(" && rPart.charAt(rPart.length - 1) === ")") rPart = rPart.slice(1, -1).trim();
      // Include trig function if immediately before lPart or rPart
      var preStr = s.slice(0, mIdx);
      var trigPre = preStr.match(/(sin|cos|tan|sec)\s+$/i);
      var cutStart = mIdx;
      if (trigPre) {
        lPart = trigPre[1] + " " + lPart;
        cutStart = mIdx - trigPre[0].length;
      }
      var postAfter = mIdx + m[0].length;
      if (/^(sin|cos|tan|sec)$/i.test(rPart)) {
        var argMatch = s.slice(postAfter).match(/^\s*([^\s=+−\-×,;|⇒→⇔<>≤≥≈∝/]+)/);
        if (argMatch) {
          rPart = rPart + " " + argMatch[1];
          postAfter += argMatch[0].length;
        }
      }
      s = s.slice(0, cutStart) + "\\frac{" + lPart + "}{" + rPart + "}" + s.slice(postAfter);
    }

    // Standardize trig & math functions and Greek symbols
    s = s.replace(/\\?(sin|cos|tan|sec|csc|cot|log|ln)\b/g, "\\$1");
    s = s.replace(/°/g, "^\\circ");
    s = s.replace(/×/g, " \\times ")
         .replace(/±/g, " \\pm ")
         .replace(/∓/g, " \\mp ")
         .replace(/⇒/g, " \\Rightarrow ")
         .replace(/→/g, " \\rightarrow ")
         .replace(/⊥/g, " \\perp ")
         .replace(/∥/g, " \\parallel ")
         .replace(/∝/g, " \\propto ")
         .replace(/≈/g, " \\approx ")
         .replace(/≠/g, " \\neq ")
         .replace(/≤/g, " \\le ")
         .replace(/≥/g, " \\ge ")
         .replace(/Δ/g, "\\Delta ")
         .replace(/Ω/g, "\\Omega ")
         .replace(/ω/g, "\\omega ")
         .replace(/λ/g, "\\lambda ")
         .replace(/θ/g, "\\theta ")
         .replace(/ρ/g, "\\rho ")
         .replace(/σ/g, "\\sigma ")
         .replace(/π/g, "\\pi ")
         .replace(/μ/g, "\\mu ")
         .replace(/α/g, "\\alpha ")
         .replace(/β/g, "\\beta ")
         .replace(/γ/g, "\\gamma ")
         .replace(/τ/g, "\\tau ")
         .replace(/ϕ|φ/g, "\\phi ");

    return s.replace(/\s+/g, " ").trim();
  }

  // ---------- 2. Offline LaTeX Parser & HTML Renderer ----------
  var GREEK_HTML = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", Delta: "Δ",
    epsilon: "ε", theta: "θ", Theta: "Θ", lambda: "λ", Lambda: "Λ",
    mu: "μ", pi: "π", Pi: "Π", rho: "ρ", sigma: "σ", Sigma: "Σ",
    tau: "τ", phi: "φ", Phi: "Φ", omega: "ω", Omega: "Ω"
  };

  var OP_HTML = {
    times: "×", div: "÷", pm: "±", mp: "∓", cdot: "·",
    le: "≤", ge: "≥", neq: "≠", approx: "≈", propto: "∝",
    Rightarrow: "⇒", rightarrow: "→", leftarrow: "←", leftrightarrow: "↔",
    perp: "⊥", parallel: "∥", infty: "∞", sum: "∑", int: "∫"
  };

  var FN_NAMES = {
    sin: "sin", cos: "cos", tan: "tan", sec: "sec", csc: "csc", cot: "cot",
    arcsin: "arcsin", arccos: "arccos", arctan: "arctan",
    log: "log", ln: "ln", max: "max", min: "min"
  };

  function readBraced(str, idx) {
    var n = str.length;
    while (idx < n && /\s/.test(str.charAt(idx))) idx++;
    if (idx >= n) return { content: "", next: idx };
    if (str.charAt(idx) !== "{") {
      // Single token or command
      if (str.charAt(idx) === "\\") {
        var j = idx + 1;
        while (j < n && /[a-zA-Z]/.test(str.charAt(j))) j++;
        return { content: str.slice(idx, j), next: j };
      }
      return { content: str.charAt(idx), next: idx + 1 };
    }
    var depth = 0;
    var start = idx + 1;
    var k = idx;
    while (k < n) {
      var c = str.charAt(k);
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return { content: str.slice(start, k), next: k + 1 };
      }
      k++;
    }
    return { content: str.slice(start), next: n };
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseLatexToHtml(tex) {
    var s = String(tex || "").trim();
    var n = s.length;
    var i = 0;
    var out = [];

    while (i < n) {
      var ch = s.charAt(i);

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Braced group { ... }
      if (ch === "{") {
        var grp = readBraced(s, i);
        out.push(parseLatexToHtml(grp.content));
        i = grp.next;
        continue;
      }

      // Superscript / Subscript attached to previous token
      if (ch === "^" || ch === "_") {
        var isSup = ch === "^";
        var subVal = null, supVal = null;
        var g1 = readBraced(s, i + 1);
        if (isSup) supVal = g1.content;
        else subVal = g1.content;
        i = g1.next;

        while (i < n && /\s/.test(s.charAt(i))) i++;
        if (i < n && ((isSup && s.charAt(i) === "_") || (!isSup && s.charAt(i) === "^"))) {
          var g2 = readBraced(s, i + 1);
          if (isSup) subVal = g2.content;
          else supVal = g2.content;
          i = g2.next;
        }

        if (supVal === "\\circ" || supVal === "°") {
          out.push('<span class="sp-num-lit">°</span>');
          if (subVal != null) {
            out.push('<sub class="sp-sub">' + parseLatexToHtml(subVal) + "</sub>");
          }
        } else if (supVal != null && subVal != null) {
          out.push(
            '<span class="sp-supsub">' +
              '<span class="sp-sup-item">' + parseLatexToHtml(supVal) + "</span>" +
              '<span class="sp-sub-item">' + parseLatexToHtml(subVal) + "</span>" +
            "</span>"
          );
        } else if (supVal != null) {
          out.push('<sup class="sp-sup">' + parseLatexToHtml(supVal) + "</sup>");
        } else if (subVal != null) {
          out.push('<sub class="sp-sub">' + parseLatexToHtml(subVal) + "</sub>");
        }
        continue;
      }

      // LaTeX Command \cmd
      if (ch === "\\") {
        var j = i + 1;
        if (j < n && !/[a-zA-Z]/.test(s.charAt(j))) {
          out.push(escapeHtml(s.charAt(j)));
          i = j + 1;
          continue;
        }
        while (j < n && /[a-zA-Z]/.test(s.charAt(j))) j++;
        var cmd = s.slice(i + 1, j);
        i = j;

        if (cmd === "frac" || cmd === "dfrac" || cmd === "tfrac") {
          var numG = readBraced(s, i);
          var denG = readBraced(s, numG.next);
          i = denG.next;
          out.push(
            '<span class="sp-frac">' +
              '<span class="sp-num">' + parseLatexToHtml(numG.content) + "</span>" +
              '<span class="sp-den">' + parseLatexToHtml(denG.content) + "</span>" +
            "</span>"
          );
          continue;
        }

        if (cmd === "sqrt") {
          while (i < n && /\s/.test(s.charAt(i))) i++;
          var rootIdx = "";
          if (i < n && s.charAt(i) === "[") {
            var closeB = s.indexOf("]", i);
            if (closeB !== -1) {
              rootIdx = s.slice(i + 1, closeB);
              i = closeB + 1;
            }
          }
          var radG = readBraced(s, i);
          i = radG.next;
          out.push(
            '<span class="sp-sqrt">' +
              (rootIdx ? '<sup class="sp-sup">' + parseLatexToHtml(rootIdx) + "</sup>" : "") +
              '<span class="sp-rad" aria-hidden="true">√</span>' +
              '<span class="sp-radicand">' + parseLatexToHtml(radG.content) + "</span>" +
            "</span>"
          );
          continue;
        }

        if (cmd === "boxed") {
          var boxG = readBraced(s, i);
          i = boxG.next;
          out.push('<span class="sp-boxed">' + parseLatexToHtml(boxG.content) + "</span>");
          continue;
        }

        if (cmd === "text" || cmd === "mathrm" || cmd === "mathbf" || cmd === "textbf") {
          var txtG = readBraced(s, i);
          i = txtG.next;
          out.push('<span class="sp-text">' + escapeHtml(txtG.content) + "</span>");
          continue;
        }

        if (cmd === "left" || cmd === "right") {
          while (i < n && /\s/.test(s.charAt(i))) i++;
          if (i < n && /[()[\]|.]/.test(s.charAt(i))) {
            if (s.charAt(i) !== ".") out.push('<span class="sp-op">' + escapeHtml(s.charAt(i)) + "</span>");
            i++;
          }
          continue;
        }

        if (cmd === "circ" || cmd === "degree") {
          out.push('<span class="sp-num-lit">°</span>');
          continue;
        }

        if (FN_NAMES[cmd]) {
          out.push('<span class="sp-fn">' + FN_NAMES[cmd] + "</span>");
          continue;
        }

        if (GREEK_HTML[cmd]) {
          var isCap = /^[A-Z]/.test(cmd);
          out.push('<span class="' + (isCap ? "sp-fn" : "sp-var") + '">' + GREEK_HTML[cmd] + "</span>");
          continue;
        }

        if (OP_HTML[cmd]) {
          out.push('<span class="sp-op">' + OP_HTML[cmd] + "</span>");
          continue;
        }

        out.push('<span class="sp-text">' + escapeHtml(cmd) + "</span>");
        continue;
      }

      // Numbers (including decimals)
      if (/[0-9]/.test(ch)) {
        var numM = s.slice(i).match(/^[0-9]+(?:\.[0-9]+)?/);
        var numStr = numM ? numM[0] : ch;
        out.push('<span class="sp-num-lit">' + numStr + "</span>");
        i += numStr.length;
        continue;
      }

      // Operators and punctuation
      if (/[=+−\-*/<>≤≥≠≈∝±×÷·]/.test(ch)) {
        var dispOp = ch === "-" ? "−" : ch === "*" ? "×" : ch;
        out.push('<span class="sp-op">' + escapeHtml(dispOp) + "</span>");
        i++;
        continue;
      }

      if (/[()[\],:|]/.test(ch)) {
        out.push('<span class="sp-text">' + escapeHtml(ch) + "</span>");
        i++;
        continue;
      }

      // Recognized multi-letter words (units or function names without backslash)
      if (/[a-zA-Z]/.test(ch)) {
        var wordM = s.slice(i).match(/^[a-zA-Z]+/);
        var word = wordM ? wordM[0] : ch;
        if (FN_NAMES[word.toLowerCase()]) {
          out.push('<span class="sp-fn">' + word + "</span>");
          i += word.length;
          continue;
        }
        if (/^(cm|mm|nm|km|Hz|THz|kHz|rad|deg|mol|dm|kg|ms|kV|mV|mA|kW|MW|kJ|Slope|Constant|air|glass|water|med|medium|max|min|total|net|eff|core|cladding|refl|real|app)$/i.test(word)) {
          out.push('<span class="sp-unit">' + escapeHtml(word) + "</span>");
          i += word.length;
          continue;
        }
        // Single variable or product of variables (e.g. "IR", "LN", "LE", "EF")
        for (var w = 0; w < word.length; w++) {
          out.push('<span class="sp-var">' + escapeHtml(word.charAt(w)) + "</span>");
        }
        i += word.length;
        continue;
      }

      // Fallback character
      out.push('<span>' + escapeHtml(ch) + "</span>");
      i++;
    }

    return out.join("");
  }

  function latexToSpeech(tex) {
    return String(tex || "")
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1) divided by ($2)")
      .replace(/\\sqrt\{([^{}]+)\}/g, "square root of ($1)")
      .replace(/\\boxed\{([^{}]+)\}/g, "$1")
      .replace(/\^\{2\}/g, " squared")
      .replace(/\^\{3\}/g, " cubed")
      .replace(/\^\{-1\}/g, " inverse")
      .replace(/\^\\circ/g, " degrees")
      .replace(/\\times/g, " times ")
      .replace(/\\div/g, " divided by ")
      .replace(/\\Rightarrow/g, " implies ")
      .replace(/\\Delta/g, " delta ")
      .replace(/\\Omega/g, " ohms ")
      .replace(/\\omega/g, " omega ")
      .replace(/\\lambda/g, " lambda ")
      .replace(/\\theta/g, " theta ")
      .replace(/\\rho/g, " rho ")
      .replace(/\\pi/g, " pi ")
      .replace(/[\\{}]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderLatex(rawOrTex, displayMode) {
    var tex = toLatex(rawOrTex);
    var inner = parseLatexToHtml(tex);
    var cls = displayMode ? "sp-math sp-math-display" : "sp-math";
    var speech = escapeHtml(latexToSpeech(tex));
    return '<span class="' + cls + '" data-latex="' + escapeHtml(tex) + '" aria-label="' + speech + '">' + inner + "</span>";
  }

  // ---------- 3. Step-by-Step Calculation Decomposer & Explainer Engine ----------
  function hasNumbers(str) {
    // True if contains digits outside subscript indices like _1 or _2 or _0
    var cleaned = String(str || "").replace(/_\{?[0-9]+\}?/g, "");
    return /[0-9]/.test(cleaned);
  }

  function hasVariables(str) {
    var cleaned = String(str || "")
      // Strip subscript labels like _{air}, _{glass}, _{total}, _1, _2
      .replace(/_\{?[a-zA-Z0-9]+\}?/g, "")
      // Strip LaTeX commands & standard trig/math function names
      .replace(/\\?(frac|dfrac|sqrt|sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|log|ln|times|div|pm|mp|circ|text|mathrm|mathbf|boxed|Delta|Omega|Rightarrow|pi)\b/gi, "")
      .replace(/π/g, "")
      // Strip units that immediately follow a number (e.g. "55.0 cm", "10^8 m s^-1", "1.50 A", "3.60 Ω")
      .replace(/[0-9°}]\s*(?:cm|mm|nm|km|Hz|THz|kHz|rad|deg|mol|dm|kg|ms|m|s|V|A|W|J|C|N|Ω|K)\b(?:\s*(?:s|m)\^?\{?-?[0-9]+\}?)?/g, "");
    return /[a-zA-Zθλωρσμaβγτφ]/.test(cleaned);
  }

  /**
   * Generates a specific, plain-English calculation explainer note for a transition
   * from prevExpr to currExpr (with lhs variable name).
   */
  function explainTransition(lhs, prevExpr, currExpr, stepIndex, totalSteps) {
    var p = htmlToMathTokens(prevExpr || "").trim();
    var c = htmlToMathTokens(currExpr || "").trim();
    var l = htmlToMathTokens(lhs || "").trim();

    // Case 0: First step (stating formula or direct single-step substitution/arithmetic)
    if (!p) {
      if (!hasVariables(c) && hasNumbers(c)) {
        if (/[÷/]/.test(c)) {
          var d0 = c.split(/÷|\//);
          return "Substitute the given values into the fraction: divide " + d0[0].trim() + " by " + d0.slice(1).join("/").trim() + ".";
        }
        if (/[×*]/.test(c)) return "Substitute the given numerical values to be multiplied: " + c + ".";
        if (/[+]/.test(c)) return "Write down the values to be added: " + c + ".";
        if (/[−\-]/.test(c)) return "Substitute the given values into the subtraction: " + c + ".";
        return "Substitute the given numerical values: " + (l ? l + " = " : "") + c + ".";
      }
      if (/÷|\//.test(c)) {
        var parts = c.split(/÷|\//);
        return "State the governing formula for " + (l || "the quantity") + ": divide " + parts[0].trim() + " by " + parts.slice(1).join("/").trim() + ".";
      }
      if (/√/.test(c)) {
        return "State the governing square-root formula for " + (l || "the quantity") + ": " + (l ? l + " = " : "") + c + ".";
      }
      if (/[×*]/.test(c)) {
        return "State the governing product formula for " + (l || "the quantity") + ": " + (l ? l + " = " : "") + c + ".";
      }
      if (/[−\-]/.test(c)) {
        return "State the governing formula for " + (l || "the quantity") + " by taking the difference: " + (l ? l + " = " : "") + c + ".";
      }
      if (/[+]/.test(c)) {
        return "State the governing sum formula for " + (l || "the quantity") + ": " + (l ? l + " = " : "") + c + ".";
      }
      return "State the governing formula for " + (l || "this calculation") + ": " + (l ? l + " = " : "") + c + ".";
    }

    // Case 1: Symbolic formula -> Numerical substitution
    if (hasVariables(p) && !hasVariables(c) && hasNumbers(c)) {
      return "Substitute the given numerical values into the formula (" + p + " becomes " + c + ").";
    }

    // Case 2: Inverse trig evaluation (sin⁻¹, cos⁻¹, tan⁻¹)
    if (/(sin|cos|tan)[⁻^]\s*\{?-?1\}?/i.test(p) || /(sin|cos|tan)[⁻^]\s*\{?-?1\}?/i.test(l)) {
      var fnInv = (p.match(/(sin|cos|tan)/i) || l.match(/(sin|cos|tan)/i) || ["trig"])[0].toLowerCase();
      return "Take the inverse " + fnInv + " (" + fnInv + "⁻¹) of the ratio to obtain the angle " + (l ? l + " = " : "") + c + ".";
    }
    if (/(sin|cos|tan)[⁻^]\s*\{?-?1\}?/i.test(c)) {
      var fnInv2 = (c.match(/(sin|cos|tan)/i) || ["trig"])[0].toLowerCase();
      return "Apply the inverse " + fnInv2 + " (" + fnInv2 + "⁻¹) to both sides so we can solve for the angle " + (l || "") + ".";
    }

    // Case 3: Trigonometric function evaluation (sin θ, cos θ, tan θ, sec θ -> decimal)
    if (/\b(sin|cos|tan|sec)\s*[0-9.]+/i.test(p) && !/\b(sin|cos|tan|sec)\s*[0-9.]+/i.test(c)) {
      var trigCalls = p.match(/\b(sin|cos|tan|sec)\s*[0-9.]+°?/gi) || [];
      return "Evaluate the trigonometric term" + (trigCalls.length > 1 ? "s" : "") + " (" + trigCalls.join(", ") + ") to get " + c + ".";
    }

    // Case 4: Squaring / power evaluation (e.g. 0.60² -> 0.36)
    if (/(\^\{?2\}?|²)/.test(p) && !/(\^\{?2\}?|²)/.test(c)) {
      return "Evaluate the squared term(s) in " + p + " to simplify the expression to " + c + ".";
    }

    // Case 5: Subtraction & addition inside numerator/denominator before division
    if (/[−\-+]/.test(p) && /[÷/]/.test(p) && /[÷/]/.test(c) && !/[−\-+]/.test(c)) {
      return "Perform the arithmetic inside the numerator and denominator of " + p + " to obtain the simplified fraction " + c + ".";
    }

    // Case 6: Square root evaluation (√X -> number)
    if (/√|\\sqrt/.test(p) && !/√|\\sqrt/.test(c)) {
      return "Take the square root of the value inside the radical (" + p + ") to get " + (l ? l + " = " : "") + c + ".";
    }
    if (/√|\\sqrt/.test(p) && /√|\\sqrt/.test(c)) {
      if (/[−\-+]/.test(p) && !/[−\-+]/.test(c)) {
        return "Simplify the terms inside the square root (" + p + ") to get " + c + ".";
      }
      if (/[÷/]/.test(p) && !/[÷/]/.test(c)) {
        return "Divide the numerator by the denominator inside the square root (" + p + ") to obtain " + c + ".";
      }
    }

    // Case 7: Division evaluation (A ÷ B or A / B -> result)
    if (/[÷/]/.test(p) && !/[÷/]/.test(c)) {
      var dParts = p.split(/÷|\//);
      if (dParts.length === 2) {
        return "Divide the numerator " + dParts[0].trim() + " by the denominator " + dParts[1].trim() + ", which gives " + c + ".";
      }
      return "Carry out the division " + p + " to obtain " + c + ".";
    }

    // Case 8: Multiplication evaluation (A × B -> result)
    if (/[×*]/.test(p) && !/[×*]/.test(c)) {
      var mParts = p.split(/[×*]/);
      if (mParts.length === 2) {
        return "Multiply " + mParts[0].trim() + " by " + mParts[1].trim() + " to get " + c + ".";
      }
      return "Multiply the factors in " + p + " together to obtain " + c + ".";
    }

    // Case 9: Addition evaluation (A + B -> result, e.g. 1 + 1 = 2)
    if (/[+]/.test(p) && !/[+]/.test(c)) {
      return "Adding " + p + " gives " + c + ".";
    }

    // Case 10: Subtraction evaluation (A − B -> result, e.g. 90° − 35° = 55.0°)
    if (/[−\-]/.test(p) && !/[−\-]/.test(c.replace(/^[−\-]/, ""))) {
      return "Subtracting " + p + " gives " + c + ".";
    }

    // Case 11: Unit conversion (e.g. 589 nm = 5.89 × 10⁻⁷ m)
    if (stepIndex === totalSteps - 1) {
      return "Express the final result with its proper SI unit: " + (l ? l + " = " : "") + c + ".";
    }

    return "Simplify " + p + " to obtain " + c + ".";
  }

  function stepTagFor(lhs, prevExpr, currExpr, isFirst, isLast) {
    var p = htmlToMathTokens(prevExpr || "");
    var c = htmlToMathTokens(currExpr || "");
    if (isFirst) {
      return hasVariables(c) ? "Governing Formula" : "Substitute Values";
    }
    if (hasVariables(p) && !hasVariables(c) && hasNumbers(c)) return "Substitute Values";
    if (/(sin|cos|tan)[⁻^]/i.test(p) || /(sin|cos|tan)[⁻^]/i.test(c)) return "Inverse Trig";
    if (/\b(sin|cos|tan|sec)\s*[0-9.]+/i.test(p) && !/\b(sin|cos|tan|sec)\s*[0-9.]+/i.test(c)) return "Evaluate Trig";
    if (/√|\\sqrt/.test(p) && !/√|\\sqrt/.test(c)) return "Square Root";
    if (isLast) return "Final Answer";
    if (/[÷/]/.test(p) && !/[÷/]/.test(c)) return "Division";
    if (/[×*]/.test(p) && !/[×*]/.test(c)) return "Multiplication";
    if (/[+]/.test(p) && !/[+]/.test(c)) return "Addition";
    if (/[−\-]/.test(p)) return "Subtraction";
    return "Step Evaluation";
  }

  /**
   * Automatically inserts missing intermediate arithmetic steps when a chain
   * jumps over a trig evaluation or square evaluation in one step.
   */
  function expandIntermediateParts(parts) {
    if (!parts || parts.length < 2) return parts;
    var out = [parts[0]];
    for (var i = 1; i < parts.length; i++) {
      var prev = parts[i - 1];
      var curr = parts[i];

      // Check if prev has "k × (tan|sin|cos|sec) θ°" and curr is a final single number
      var trigProd = prev.match(/^([0-9.]+)\s*[×*]\s*(sin|cos|tan|sec)\s*([0-9.]+)°?$/i);
      if (trigProd && /^[0-9.]+\s*[a-zA-Z°Ω]*$/.test(curr)) {
        var kVal = parseFloat(trigProd[1]);
        var fn = trigProd[2].toLowerCase();
        var deg = parseFloat(trigProd[3]);
        var rad = deg * Math.PI / 180;
        var fnVal = fn === "sin" ? Math.sin(rad) : fn === "cos" ? Math.cos(rad) : fn === "tan" ? Math.tan(rad) : (1 / Math.cos(rad));
        if (!isNaN(kVal) && !isNaN(fnVal)) {
          out.push(kVal.toFixed(1) + " × " + fnVal.toFixed(4));
        }
      }

      // Check if prev has "√[(1 - a²) / (1 - b²)]" and curr jumps straight to "√(c / d)"
      var sqJump = prev.match(/1\s*[−\-]\s*([0-9.]+)(?:²|\^\{?2\}?).*1\s*[−\-]\s*([0-9.]+)(?:²|\^\{?2\}?)/);
      if (sqJump && !/[−\-]/.test(curr) && /√/.test(curr)) {
        var a = parseFloat(sqJump[1]), b = parseFloat(sqJump[2]);
        if (!isNaN(a) && !isNaN(b)) {
          out.push("√[(1 − " + +(a * a).toFixed(4) + ") ÷ (1 − " + +(b * b).toFixed(4) + ")]");
        }
      }

      out.push(curr);
    }
    return out;
  }

  /**
   * Decomposes an equation chain (including "⇒" implications and "=" chains)
   * into an array of { tag, latex, note } objects.
   */
  function decomposeEquationChain(rawChain) {
    var cleaned = htmlToMathTokens(rawChain).replace(/\.$/, "").trim();
    if (!cleaned || cleaned.indexOf("=") === -1) return [];

    // Split by implication arrows ⇒ or → first
    var clauses = cleaned.split(/\s*(?:⇒|→|\\Rightarrow)\s*/);
    var steps = [];

    clauses.forEach(function (clause, cIdx) {
      var eqParts = clause.split(/\s*=\s*/);
      if (eqParts.length < 2) return;

      var lhs = eqParts[0].trim();
      var rhsList = expandIntermediateParts(eqParts.slice(1).map(function (x) { return x.trim(); }));

      if (rhsList.length === 1) {
        var onlyRhs = rhsList[0];
        var isFinalSingle = (cIdx === clauses.length - 1);
        var texRhs = isFinalSingle && hasNumbers(onlyRhs) ? "\\boxed{" + toLatex(onlyRhs) + "}" : toLatex(onlyRhs);
        var noteSingle = explainTransition(lhs, /[+−\-×*÷/√]/.test(lhs) ? lhs : "", onlyRhs, 0, 1);
        steps.push({
          tag: stepTagFor(lhs, lhs, onlyRhs, cIdx === 0, isFinalSingle),
          latex: toLatex(lhs) + " = " + texRhs,
          note: noteSingle
        });
      } else {
        for (var k = 0; k < rhsList.length; k++) {
          var prev = k === 0 ? "" : rhsList[k - 1];
          var curr = rhsList[k];
          var isLastOverall = (cIdx === clauses.length - 1) && (k === rhsList.length - 1);
          var rhsLatex = (isLastOverall && hasNumbers(curr)) ? "\\boxed{" + toLatex(curr) + "}" : toLatex(curr);
          steps.push({
            tag: stepTagFor(lhs, prev, curr, cIdx === 0 && k === 0, isLastOverall),
            latex: toLatex(lhs) + " = " + rhsLatex,
            note: explainTransition(lhs, prev, curr, k, rhsList.length)
          });
        }
      }
    });

    return steps;
  }

  function renderStepCardHtml(steps, titleText) {
    if (!steps || !steps.length) return "";
    var rows = steps.map(function (st, idx) {
      return (
        '<div class="m-step">' +
          '<div class="m-step-meta">' +
            '<span class="m-step-num"><b>' + (idx + 1) + "</b> Step " + (idx + 1) + "</span>" +
            '<span class="m-step-tag">' + escapeHtml(st.tag || "Calculation") + "</span>" +
          "</div>" +
          '<div class="m-step-eq">' + renderLatex(st.latex, true) + "</div>" +
          '<div class="m-step-note">' +
            '<i class="m-step-note-icon" aria-hidden="true">💡</i>' +
            '<span>' + escapeHtml(st.note) + "</span>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    return (
      '<div class="m-calc-wrap">' +
        '<div class="m-calc-head">' +
          '<span>' + escapeHtml(titleText || "Step-by-Step LaTeX Calculation & Explainer") + "</span>" +
          '<span class="m-tex-badge">LaTeX · ' + steps.length + (steps.length === 1 ? " Step" : " Steps") + "</span>" +
        "</div>" +
        '<div class="m-step-list">' + rows + "</div>" +
      "</div>"
    );
  }

  // ---------- 4. Explain Concept Formula Banners (.eq) ----------
  function explainFormulaBanner(rawText) {
    var t = htmlToMathTokens(rawText);
    if (/sin i.*sin r/i.test(t) && /v_?\{?1\}?/i.test(t)) {
      return "Snell's Law & Wave Speed Chain: Dividing sin i by sin r gives the relative refractive index, which equals the ratio of wave speeds (v₁ ÷ v₂) and wavelengths (λ₁ ÷ λ₂) at constant frequency f.";
    }
    if (/sin c/i.test(t) && /1.*n/i.test(t)) {
      return "Critical Angle Law: The sine of the critical angle c equals the reciprocal of refractive index (1 ÷ n). Multiplying c₀ by sin c gives the wave speed v = c₀ sin c inside the medium.";
    }
    if (/tan i/i.test(t) && /90/i.test(t)) {
      return "Perpendicular Ray Shortcut: When the reflected and refracted rays are 90° apart, r = 90° − i, so sin r = cos i and Snell's law simplifies to n = sin i ÷ cos i = tan i.";
    }
    if (/sin\(i\s*[−\-]\s*r\)/i.test(t)) {
      return "Lateral Displacement Formula: Multiply the glass block thickness t by sin(i − r) and divide by cos r to find the perpendicular sideways shift d of the emergent ray.";
    }
    if (/tan r/i.test(t) && /sec r/i.test(t)) {
      return "Internal Right-Angled Triangle LN₀E: Multiply block width w by tan r to get back-face offset LE, and multiply w by sec r (1 ÷ cos r) to get the internal refracted path length LN.";
    }
    if (/1\s*[−\-]\s*x/i.test(t) && /1\s*[−\-]\s*y/i.test(t)) {
      return "Curved Cosine Graph Formula: Read a point (x₁, y₁) = (cos i, cos r) on the curve, subtract each squared coordinate from 1, divide, and take the square root to find n.";
    }
    if (/R\s*[÷/]\s*A/i.test(t) || /Real.*Apparent/i.test(t) || /1\s*[−\-]\s*1\/n/i.test(t)) {
      return "Apparent Depth & Upward Shift: Divide real depth R by refractive index n to get apparent depth A = R ÷ n; subtract A from R to get the apparent upward shift d_v = t(1 − 1/n).";
    }
    if (/V\s*=\s*I\s*R/i.test(t)) {
      return "Ohm's Law: Potential difference V equals current I multiplied by resistance R (at constant temperature). Dividing V by I gives resistance R in ohms (Ω).";
    }
    if (/ρ\s*L/i.test(t) || /\\rho/i.test(t)) {
      return "Resistivity & Wire Geometry: Multiply resistivity ρ by length L and divide by cross-sectional area A = πd² ÷ 4. Doubling diameter d quadruples area A and cuts resistance R to one-quarter.";
    }
    if (/2\s*π\s*√/i.test(t) || /4\s*π/i.test(t)) {
      return "Simple Pendulum & Harmonic Period: Divide length L by gravity g, take the square root, and multiply by 2π to find period T. Squaring both sides gives T² = (4π² ÷ g)L.";
    }
    if (/ω\^?\{?2\}?\s*x/i.test(t)) {
      return "Defining Law of SHM: Restoring acceleration a equals angular frequency squared (ω²) times displacement x, with the minus sign showing acceleration points back towards equilibrium.";
    }
    if (/Slope/i.test(t)) {
      return "Graph Gradient Calculation: Subtract the two vertical coordinates (Δy) in the numerator, subtract the corresponding horizontal coordinates (Δx) in the denominator, and divide.";
    }
    // Generic fallback explanation based on structure
    var steps = decomposeEquationChain(t);
    if (steps.length > 0) return steps[steps.length - 1].note;
    return "Key relationship: substitute each quantity in standard SI units to evaluate this equation step by step.";
  }

  // ---------- 5. Page-Wide Automatic LaTeX & Step-by-Step Calculation Upgrader ----------
  function upgradeFormulaBanners(root) {
    var eqs = (root || document).querySelectorAll(".eq:not([data-math-upgraded])");
    Array.prototype.forEach.call(eqs, function (el) {
      el.setAttribute("data-math-upgraded", "1");
      var rawHtml = el.innerHTML;
      // Extract any trailing side-note <span class="st">...</span>
      var sideNotes = [];
      var mainHtml = rawHtml.replace(/<span\s+class=["']st["'][^>]*>([\s\S]*?)<\/span>/gi, function (_, inner) {
        sideNotes.push(stripTags(inner).trim());
        return "";
      });

      // Split on multi-formula separators "·" or "and by reversibility:" or "and"
      var segments = mainHtml.split(/\s*(?:·|&middot;)\s*/);
      var renderedSegs = segments.map(function (seg) {
        return renderLatex(seg, false);
      });

      var noteText = explainFormulaBanner(mainHtml);
      if (sideNotes.length) {
        noteText += " (" + sideNotes.join(" · ") + ")";
      }

      el.innerHTML =
        '<div class="eq-latex-wrap">' +
          '<div class="sp-math-display">' + renderedSegs.join('<span class="sp-op" style="padding:0 0.45em">·</span>') + "</div>" +
          '<div class="m-eq-note"><i class="m-step-note-icon" aria-hidden="true">📐</i><span><strong>Calculation &amp; Formula Guide:</strong> ' + escapeHtml(noteText) + "</span></div>" +
        "</div>";
    });
  }

  function upgradeWorkedExamples(root) {
    // 1. Standard .example cards (ol.steps-sol > li)
    var lis = (root || document).querySelectorAll("ol.steps-sol > li:not([data-math-upgraded])");
    Array.prototype.forEach.call(lis, function (li) {
      li.setAttribute("data-math-upgraded", "1");
      var strongEl = li.querySelector("strong");
      var titleText = strongEl ? stripTags(strongEl.innerHTML).replace(/:$/, "").trim() : "Calculation Step";
      var codes = li.querySelectorAll("code");
      if (!codes.length) return;

      var allSteps = [];
      Array.prototype.forEach.call(codes, function (cEl) {
        var rawCode = cEl.innerHTML;
        var st = decomposeEquationChain(rawCode);
        if (st.length) {
          allSteps = allSteps.concat(st);
        } else {
          cEl.outerHTML = renderLatex(rawCode, false);
        }
      });

      if (allSteps.length) {
        li.classList.add("m-upgraded-li");
        // Keep any prose outside <strong> and <code> as context
        var clone = li.cloneNode(true);
        if (clone.querySelector("strong")) clone.querySelector("strong").remove();
        Array.prototype.forEach.call(clone.querySelectorAll("code"), function (c) { c.remove(); });
        var extraProse = stripTags(clone.innerHTML).replace(/^[\s:.,;—–\-]+|[\s.]+$/g, "").trim();
        if (extraProse && allSteps.length > 0 && extraProse.length > 3) {
          allSteps[allSteps.length - 1].note += " (" + extraProse + ")";
        }
        li.innerHTML =
          '<div class="m-subgoal-title">' + escapeHtml(titleText) + "</div>" +
          renderStepCardHtml(allSteps, titleText);
      }
    });

    // 2. Answer lines (.answer-line)
    var ansLines = (root || document).querySelectorAll(".answer-line:not([data-math-upgraded])");
    Array.prototype.forEach.call(ansLines, function (el) {
      el.setAttribute("data-math-upgraded", "1");
      var parts = el.innerHTML.split(/\s*·\s*/);
      el.innerHTML = parts.map(function (p) {
        var m = p.match(/^(\([a-z]\)\s*)([\s\S]+)$/i);
        if (m) return "<strong>" + escapeHtml(m[1]) + "</strong> " + renderLatex("\\boxed{" + toLatex(m[2]) + "}", false);
        return renderLatex("\\boxed{" + toLatex(p) + "}", false);
      }).join(' &nbsp;·&nbsp; ');
    });
  }

  function upgradeProseAndExplanations(root) {
    // Upgrade calculation chains inside Quiz explanations (.qexp), Do Now answers (.dn-a), and Assignment solutions (.reveal-body)
    var targets = (root || document).querySelectorAll(".qexp:not([data-math-upgraded]), .dn-a:not([data-math-upgraded]), .solution .reveal-body:not([data-math-upgraded])");
    Array.prototype.forEach.call(targets, function (el) {
      el.setAttribute("data-math-upgraded", "1");

      // First: upgrade any <code>...</code> inside .reveal-body or .qexp
      var codes = el.querySelectorAll("code");
      var extractedChains = [];
      Array.prototype.forEach.call(codes, function (codeEl) {
        var txt = htmlToMathTokens(codeEl.innerHTML);
        if (txt.indexOf("=") !== -1 && hasNumbers(txt)) {
          var steps = decomposeEquationChain(txt);
          if (steps.length >= 1) {
            extractedChains.push(steps);
          }
        }
        codeEl.outerHTML = renderLatex(txt, false);
      });

      // Second: if plain text in .qexp or .dn-a has an equation calculation (like "n = sin i / sin r = 0.500 / 0.333 = 1.50")
      if (extractedChains.length === 0) {
        var plain = htmlToMathTokens(el.innerHTML);
        var eqRegex = /([a-zA-Z0-9_^{}()[\]\sθλωρσπΔΩ]+=\s*[^.;]+?[0-9][^.;]*)/g;
        var match;
        while ((match = eqRegex.exec(plain)) !== null) {
          var candidate = match[1].trim();
          // Trim leading prose words before the actual LHS symbol
          var lhsClean = candidate.replace(/^(?:Using|From|Since|Therefore|Thus|So|Because|Here|With|And|where|gives|is|at)\s+/i, "");
          var eqSplit = lhsClean.split("=");
          if (eqSplit.length >= 2 && hasNumbers(lhsClean)) {
            // Keep only the last token/expression of LHS before the first '='
            var firstLhs = eqSplit[0].trim();
            var lhsWords = firstLhs.split(/\s+/);
            if (lhsWords.length > 3) {
              firstLhs = lhsWords.slice(-2).join(" ");
            }
            var rebuilt = firstLhs + " = " + eqSplit.slice(1).join(" = ");
            var cSteps = decomposeEquationChain(rebuilt);
            if (cSteps.length >= 1) {
              extractedChains.push(cSteps);
            }
          }
        }
      }

      if (extractedChains.length > 0) {
        var combined = [];
        extractedChains.forEach(function (arr) { combined = combined.concat(arr); });
        el.insertAdjacentHTML("beforeend", renderStepCardHtml(combined, "Step-by-Step LaTeX Calculation & Explainer"));
      }
    });
  }

  function upgradeWelcomeHubEquations(root) {
    var fEqs = (root || document).querySelectorAll(".f-eq:not([data-math-upgraded]), .law-eq:not([data-math-upgraded])");
    Array.prototype.forEach.call(fEqs, function (el) {
      el.setAttribute("data-math-upgraded", "1");
      var raw = el.innerHTML;
      var segs = raw.split(/\s*·\s*/);
      el.innerHTML = segs.map(function (s) { return renderLatex(s, false); }).join(' <span class="sp-op">·</span> ');
    });
  }

  function upgradeInlineCodes(root) {
    var codeEls = (root || document).querySelectorAll(
      ".qcard .qt code:not([data-math-upgraded]), " +
      ".qcard .qopt code:not([data-math-upgraded]), " +
      ".dn-card .qt code:not([data-math-upgraded]), " +
      "#ph-info code:not([data-math-upgraded]), " +
      ".tbl td code:not([data-math-upgraded])"
    );
    Array.prototype.forEach.call(codeEls, function (c) {
      c.setAttribute("data-math-upgraded", "1");
      var txt = htmlToMathTokens(c.innerHTML);
      if (/[=÷/×√²³⁰¹⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇⁸⁹θλωρσπΔΩ]/.test(txt) || /\b(sin|cos|tan|sec)\b/i.test(txt)) {
        c.innerHTML = renderLatex(txt, false);
      }
    });
  }

  var upgrading = false;
  function upgradePage(root) {
    if (upgrading) return;
    upgrading = true;
    try {
      upgradeFormulaBanners(root);
      upgradeWorkedExamples(root);
      upgradeProseAndExplanations(root);
      upgradeWelcomeHubEquations(root);
      upgradeInlineCodes(root);
    } finally {
      upgrading = false;
    }
  }

  function observeDynamicContainers() {
    if (typeof MutationObserver === "undefined") return;
    ["quiz-list", "donow-list", "ph-info"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var mo = new MutationObserver(function () {
        upgradePage(el);
      });
      mo.observe(el, { childList: true });
    });
  }

  // Expose global StudyMath service API
  window.StudyMath = {
    toLatex: toLatex,
    tex: renderLatex,
    renderLatex: renderLatex,
    decompose: decomposeEquationChain,
    renderSteps: renderStepCardHtml,
    explainFormula: explainFormulaBanner,
    upgradePage: upgradePage
  };

  function bootMath() {
    upgradePage(document);
    observeDynamicContainers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMath);
  } else {
    bootMath();
  }
})();
