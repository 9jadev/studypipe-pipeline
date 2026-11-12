/**
 * StudyPipe · StudyCode Service (kits/code-snippet/code-kit.js)
 * Offline syntax highlighter, line explainer, and step execution tracer
 * for Nigerian secondary school Computer Studies & Programming lessons.
 * Exposes window.StudyCode.
 */

(function () {
  "use strict";

  // Keyword sets for target syllabuses (Python, BASIC / QBASIC, Pseudocode, JS)
  var KEYWORDS = {
    python: [
      "def", "return", "if", "elif", "else", "for", "while", "in", "break",
      "continue", "pass", "and", "or", "not", "is", "import", "from", "as",
      "class", "try", "except", "finally", "with", "lambda", "global",
      "nonlocal", "del", "yield", "assert"
    ],
    basic: [
      "LET", "PRINT", "INPUT", "IF", "THEN", "ELSE", "GOTO", "FOR", "TO", "STEP",
      "NEXT", "WHILE", "WEND", "DO", "LOOP", "UNTIL", "DIM", "REM", "END",
      "CLS", "SUB", "FUNCTION", "READ", "DATA", "RESTORE", "GOSUB", "RETURN",
      "SELECT", "CASE", "AS", "INTEGER", "STRING", "SINGLE", "DOUBLE", "MOD"
    ],
    pseudocode: [
      "ALGORITHM", "BEGIN", "END", "INPUT", "OUTPUT", "READ", "WRITE", "PRINT",
      "SET", "LET", "IF", "THEN", "ELSE", "ENDIF", "WHILE", "DO", "ENDWHILE",
      "FOR", "TO", "ENDFOR", "REPEAT", "UNTIL", "FUNCTION", "RETURN", "PROCEDURE",
      "CALL", "DECLARE", "AND", "OR", "NOT", "TRUE", "FALSE"
    ],
    javascript: [
      "function", "return", "var", "let", "const", "if", "else", "for", "while",
      "do", "break", "continue", "switch", "case", "default", "try", "catch",
      "finally", "throw", "new", "this", "typeof", "instanceof", "in", "of",
      "class", "extends", "import", "export", "async", "await", "yield"
    ]
  };

  var BUILTINS = {
    python: ["print", "input", "range", "len", "int", "float", "str", "list", "dict", "sum", "min", "max", "type", "round", "abs"],
    basic: ["ABS", "INT", "RND", "SQR", "SIN", "COS", "TAN", "LEN", "LEFT$", "RIGHT$", "MID$", "STR$", "VAL"],
    pseudocode: ["LENGTH", "ROUND", "SQRT", "MOD", "DIV"],
    javascript: ["console", "log", "alert", "prompt", "parseInt", "parseFloat", "Math", "Array", "String", "Number", "Boolean"]
  };

  var BOOLEANS = ["True", "False", "None", "true", "false", "null", "undefined"];

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Tokenizes a line of code into styled HTML spans.
   */
  function highlightLine(line, lang) {
    var l = (lang || "python").toLowerCase();
    if (l === "py") l = "python";
    if (l === "qbasic") l = "basic";
    if (l === "pseudo") l = "pseudocode";
    if (l === "js") l = "javascript";

    var kwList = KEYWORDS[l] || KEYWORDS.python;
    var fnList = BUILTINS[l] || BUILTINS.python;

    // Check for full line comments first
    var trimmed = line.trim();
    if (
      (l === "python" && trimmed.indexOf("#") === 0) ||
      (l === "basic" && trimmed.toUpperCase().indexOf("REM") === 0) ||
      ((l === "javascript" || l === "pseudocode") && trimmed.indexOf("//") === 0)
    ) {
      return '<span class="tok-com">' + escapeHtml(line) + '</span>';
    }

    var tokens = [];
    var i = 0;
    var len = line.length;

    while (i < len) {
      var ch = line[i];

      // Inline comment check
      if (
        (l === "python" && ch === "#") ||
        ((l === "javascript" || l === "pseudocode") && ch === "/" && line[i + 1] === "/")
      ) {
        var com = line.slice(i);
        tokens.push('<span class="tok-com">' + escapeHtml(com) + '</span>');
        break;
      }

      // Strings (single or double quote)
      if (ch === '"' || ch === "'") {
        var quote = ch;
        var strVal = quote;
        i++;
        while (i < len && line[i] !== quote) {
          if (line[i] === "\\" && i + 1 < len) {
            strVal += line[i] + line[i + 1];
            i += 2;
          } else {
            strVal += line[i];
            i++;
          }
        }
        if (i < len) {
          strVal += line[i];
          i++;
        }
        tokens.push('<span class="tok-str">' + escapeHtml(strVal) + '</span>');
        continue;
      }

      // Numbers
      if (/\d/.test(ch)) {
        var num = "";
        while (i < len && /[\d\.]/.test(line[i])) {
          num += line[i];
          i++;
        }
        tokens.push('<span class="tok-num">' + escapeHtml(num) + '</span>');
        continue;
      }

      // Words (identifiers, keywords, booleans, functions)
      if (/[a-zA-Z_$]/.test(ch)) {
        var word = "";
        while (i < len && /[a-zA-Z0-9_$\-]/.test(line[i])) {
          word += line[i];
          i++;
        }

        // Match case or uppercase for BASIC/pseudocode
        var isKw = false;
        for (var k = 0; k < kwList.length; k++) {
          if (l === "basic" || l === "pseudocode") {
            if (kwList[k].toUpperCase() === word.toUpperCase()) { isKw = true; break; }
          } else {
            if (kwList[k] === word) { isKw = true; break; }
          }
        }

        var isFn = false;
        for (var f = 0; f < fnList.length; f++) {
          if (l === "basic" || l === "pseudocode") {
            if (fnList[f].toUpperCase() === word.toUpperCase()) { isFn = true; break; }
          } else {
            if (fnList[f] === word) { isFn = true; break; }
          }
        }

        var isBool = false;
        for (var b = 0; b < BOOLEANS.length; b++) {
          if (BOOLEANS[b].toLowerCase() === word.toLowerCase()) { isBool = true; break; }
        }

        if (isKw) {
          tokens.push('<span class="tok-kw">' + escapeHtml(word) + '</span>');
        } else if (isBool) {
          tokens.push('<span class="tok-bool">' + escapeHtml(word) + '</span>');
        } else if (isFn || (i < len && line[i] === "(")) {
          tokens.push('<span class="tok-fn">' + escapeHtml(word) + '</span>');
        } else {
          tokens.push('<span class="tok-var">' + escapeHtml(word) + '</span>');
        }
        continue;
      }

      // Operators & punctuation
      if (/[+\-*\/=%<>!&|^~?:;]/.test(ch)) {
        var op = ch;
        i++;
        while (i < len && /[+\-*\/=%<>!&|^~?]/.test(line[i])) {
          op += line[i];
          i++;
        }
        tokens.push('<span class="tok-op">' + escapeHtml(op) + '</span>');
        continue;
      }

      // Whitespace and other characters
      tokens.push(escapeHtml(ch));
      i++;
    }

    return tokens.join("");
  }

  /**
   * Builds an interactive StudyCode card HTML element or string.
   */
  function createCard(options) {
    var title = options.title || "Code Example";
    var lang = (options.language || "python").toLowerCase();
    var code = options.code || "";
    var notes = options.notes || {}; // { 1: "Line 1 note", 2: "Line 2 note" }
    var traceSteps = options.traceSteps || null; // Array of { line: 1, vars: { x: 10 }, note: "..." }
    var output = options.output || null; // Terminal output string or array of strings
    var cardId = "sc-" + Math.random().toString(36).substring(2, 9);

    var rawLines = code.split("\n");
    // Trim initial/trailing empty lines if desired
    if (rawLines.length > 0 && rawLines[0].trim() === "") rawLines.shift();
    if (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === "") rawLines.pop();

    var rowsHtml = [];
    for (var idx = 0; idx < rawLines.length; idx++) {
      var lineNum = idx + 1;
      var rawLine = rawLines[idx];
      var highlighted = highlightLine(rawLine, lang);
      var lineNote = notes[lineNum]
        ? '<div class="code-step-note">' + escapeHtml(notes[lineNum]) + '</div>'
        : "";

      rowsHtml.push(
        '<tr class="study-code-row" data-line="' + lineNum + '">' +
          '<td class="study-code-num">' + lineNum + '</td>' +
          '<td class="study-code-line">' + highlighted + lineNote + '</td>' +
        '</tr>'
      );
    }

    var badgeText = lang.toUpperCase();
    if (lang === "py") badgeText = "PYTHON 3";
    if (lang === "python") badgeText = "PYTHON 3";
    if (lang === "basic" || lang === "qbasic") badgeText = "BASIC";
    if (lang === "pseudo" || lang === "pseudocode") badgeText = "PSEUDOCODE";

    // Trace Controls (if traceSteps provided)
    var controlsHtml = "";
    var watchHtml = "";
    if (traceSteps && traceSteps.length > 0) {
      controlsHtml =
        '<div class="study-code-controls">' +
          '<div class="study-code-btn-group">' +
            '<button type="button" class="study-code-ctrl-btn btn-prev" disabled>&#9664; Step Back</button>' +
            '<button type="button" class="study-code-ctrl-btn primary btn-next">Step Forward &#9654;</button>' +
            '<button type="button" class="study-code-ctrl-btn btn-reset">&#8635; Reset</button>' +
          '</div>' +
          '<span class="study-code-status">Step <span class="step-curr">0</span> of <span class="step-total">' + traceSteps.length + '</span></span>' +
        '</div>';

      watchHtml =
        '<div class="study-code-watch">' +
          '<div class="study-code-watch-title">Variables Watch</div>' +
          '<div class="study-code-watch-grid"></div>' +
        '</div>';
    }

    // Terminal Output Box (if output provided)
    var terminalHtml = "";
    if (output) {
      var outText = Array.isArray(output) ? output.join("\n") : output;
      terminalHtml =
        '<div class="study-terminal-box">' +
          '<div class="study-terminal-header">' +
            '<span class="study-terminal-dot"></span>' +
            '<span>Terminal Output</span>' +
          '</div>' +
          '<div class="study-terminal-output">' + escapeHtml(outText) + '</div>' +
        '</div>';
    }

    var cardHtml =
      '<div class="study-code-card" id="' + cardId + '" data-lang="' + escapeHtml(lang) + '">' +
        '<div class="study-code-header">' +
          '<div class="study-code-title-wrap">' +
            '<div class="study-code-dot-cluster">' +
              '<span class="study-code-dot red"></span>' +
              '<span class="study-code-dot yellow"></span>' +
              '<span class="study-code-dot green"></span>' +
            '</div>' +
            '<span class="study-code-badge">' + badgeText + '</span>' +
            '<span class="study-code-title">' + escapeHtml(title) + '</span>' +
          '</div>' +
          '<button type="button" class="study-code-copy-btn" aria-label="Copy code">&#128203; Copy</button>' +
        '</div>' +
        '<div class="study-code-body">' +
          '<table class="study-code-table"><tbody>' +
            rowsHtml.join("") +
          '</tbody></table>' +
        '</div>' +
        watchHtml +
        controlsHtml +
        terminalHtml +
      '</div>';

    return { id: cardId, html: cardHtml, traceSteps: traceSteps, rawCode: rawLines.join("\n") };
  }

  /**
   * Attaches interactive behaviors (copy button, stepping) to a rendered card.
   */
  function bindCard(cardElem, rawCode, traceSteps) {
    if (!cardElem) return;

    // 1. Copy button
    var copyBtn = cardElem.querySelector(".study-code-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var textToCopy = rawCode;
        if (!textToCopy) {
          var codeLines = [];
          cardElem.querySelectorAll(".study-code-row").forEach(function (r) {
            var lineCell = r.querySelector(".study-code-line");
            if (lineCell) {
              // Extract text excluding .code-step-note
              var clone = lineCell.cloneNode(true);
              var note = clone.querySelector(".code-step-note");
              if (note) note.remove();
              codeLines.push(clone.textContent || "");
            }
          });
          textToCopy = codeLines.join("\n");
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            copyBtn.innerHTML = "&#10003; Copied!";
            copyBtn.classList.add("copied");
            setTimeout(function () {
              copyBtn.innerHTML = "&#128203; Copy";
              copyBtn.classList.remove("copied");
            }, 2000);
          }).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          var ta = document.createElement("textarea");
          ta.value = textToCopy;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            copyBtn.innerHTML = "&#10003; Copied!";
            copyBtn.classList.add("copied");
            setTimeout(function () {
              copyBtn.innerHTML = "&#128203; Copy";
              copyBtn.classList.remove("copied");
            }, 2000);
          } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    }

    // 2. Step tracer binding
    if (traceSteps && traceSteps.length > 0) {
      var currentStep = -1;
      var prevBtn = cardElem.querySelector(".btn-prev");
      var nextBtn = cardElem.querySelector(".btn-next");
      var resetBtn = cardElem.querySelector(".btn-reset");
      var currDisplay = cardElem.querySelector(".step-curr");
      var watchGrid = cardElem.querySelector(".study-code-watch-grid");
      var rows = cardElem.querySelectorAll(".study-code-row");

      function updateStepView() {
        if (currDisplay) currDisplay.textContent = currentStep + 1;
        if (prevBtn) prevBtn.disabled = currentStep <= 0;
        if (nextBtn) nextBtn.disabled = currentStep >= traceSteps.length - 1;

        rows.forEach(function (r) { r.classList.remove("active-line"); });

        if (currentStep >= 0 && currentStep < traceSteps.length) {
          var stepData = traceSteps[currentStep];
          var targetLine = stepData.line;
          var targetRow = cardElem.querySelector('.study-code-row[data-line="' + targetLine + '"]');
          if (targetRow) {
            targetRow.classList.add("active-line");
            targetRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }

          // Update variables
          if (watchGrid) {
            watchGrid.innerHTML = "";
            if (stepData.vars) {
              for (var key in stepData.vars) {
                if (Object.prototype.hasOwnProperty.call(stepData.vars, key)) {
                  var pill = document.createElement("span");
                  pill.className = "study-code-var-pill";
                  pill.innerHTML =
                    '<span class="study-code-var-name">' + escapeHtml(key) + ':</span>' +
                    '<span class="study-code-var-val">' + escapeHtml(stepData.vars[key]) + '</span>';
                  watchGrid.appendChild(pill);
                }
              }
            }
          }
        } else {
          // Reset view
          if (watchGrid) watchGrid.innerHTML = '<span style="color:#64748b;font-style:italic;">Click Step Forward to trace</span>';
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          if (currentStep > 0) {
            currentStep--;
            updateStepView();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          if (currentStep < traceSteps.length - 1) {
            currentStep++;
            updateStepView();
          }
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          currentStep = -1;
          updateStepView();
        });
      }

      // Initial state
      updateStepView();
    }
  }

  /**
   * Scans document for `<div class="study-code-snippet">` or standard `<pre><code class="language-*">`
   * and upgrades them into StudyCode cards.
   */
  function init(root) {
    var container = root || document;
    var snippets = container.querySelectorAll(".study-code-snippet");

    snippets.forEach(function (el) {
      if (el.dataset.studyCodeUpgraded) return;
      el.dataset.studyCodeUpgraded = "true";

      var title = el.getAttribute("data-title") || "Code Example";
      var lang = el.getAttribute("data-lang") || "python";
      var output = el.getAttribute("data-output") || null;
      var codeElem = el.querySelector("code") || el;
      var rawCode = codeElem.textContent.trim();

      // Check for line notes JSON
      var notes = {};
      if (el.getAttribute("data-notes")) {
        try {
          notes = JSON.parse(el.getAttribute("data-notes"));
        } catch (e) {}
      }

      // Check for trace steps JSON
      var traceSteps = null;
      if (el.getAttribute("data-trace")) {
        try {
          traceSteps = JSON.parse(el.getAttribute("data-trace"));
        } catch (e) {}
      }

      var cardObj = createCard({
        title: title,
        language: lang,
        code: rawCode,
        notes: notes,
        traceSteps: traceSteps,
        output: output
      });

      var wrapper = document.createElement("div");
      wrapper.innerHTML = cardObj.html;
      var newCard = wrapper.firstElementChild;
      el.parentNode.replaceChild(newCard, el);
      bindCard(newCard, rawCode, traceSteps);
    });
  }

  // Auto-run on DOMContentLoaded
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { init(); });
    } else {
      init();
    }
  }

  // Export API
  window.StudyCode = {
    createCard: createCard,
    bindCard: bindCard,
    highlightLine: highlightLine,
    init: init
  };
})();
