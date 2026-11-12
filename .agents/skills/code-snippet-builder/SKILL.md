---
name: code-snippet-builder
description: Creates, formats, and validates offline syntax-highlighted code snippets, pseudocode algorithms, and interactive execution traces (Python, BASIC, JavaScript, Pseudocode) with line-by-line pedagogical notes and Nigerian contextual examples for lessons, labs, quizzes, and assignments.
---

# StudyCode Service (`code-snippet-builder`)

Goal: Ensure that **every computer program, pseudocode algorithm, flowchart implementation, worked example, quiz explanation, and assignment solution** in a StudyPipe unit is rendered with **offline, syntax-highlighted code cards** and **broken down step-by-step with plain-English explainer notes and interactive variable tracing**.

## Core Service Files
- `kits/code-snippet/code-kit.js` → copied to `topics/<slug>/html/assets/js/code-kit.js` (exposes `window.StudyCode`)
- `kits/code-snippet/code.css` → copied to `topics/<slug>/html/assets/css/code.css`
- `scripts/apply-code.mjs` → CLI script (`node scripts/apply-code.mjs topics/<slug>`) that installs `code.css` and `code-kit.js` and injects them into `html/index.html` and all `html/lessons/lesson-0X/index.html` pages.

## Non-Negotiable Rules for Code Snippets & Algorithms

1. **Fully Offline & Zero Dependencies**:
   - Never load external syntax highlighters (Prism, Highlight.js, CDN scripts).
   - All tokenization and stepping run via the bundled, self-contained `window.StudyCode` runtime.

2. **Line-by-Line Pedagogical Notes (`.code-step-note`)**:
   - For educational code in lessons, don't just show bare code blocks.
   - Attach clear, student-friendly notes directly below critical statements explaining what happens on that exact line (e.g. variable assignments, conditionals, loop termination, input/output).

3. **Step Execution Tracing (`traceSteps`)**:
   - For algorithms, loops, function calls, and control flow, provide interactive trace steps so students can step forward and backward.
   - Display active line highlights (`.active-line`) and live variable updates in the Variables Watch box (`.study-code-watch`).

4. **Terminal Output Simulation**:
   - Every runnable snippet should include realistic console/terminal output (`.study-terminal-box`), clearly showing prompts (e.g. `>>> ` or `Enter score: `) and resulting program output.

5. **Nigerian Context & Relatable Problem Solving**:
   - Anchor programming tasks in familiar Nigerian scenarios:
     - NEPA / Band A-D prepaid meter unit calculations
     - Okada / Keke Napep trip fare calculation
     - Supermarket or Market POS checkout with VAT
     - JAMB UTME score aggregator and cut-off validator
     - WAEC grading scale converter (A1, B2, B3, C4... F9)

6. **Supported Language Targets**:
   - **Python** (`data-lang="python"`): High-level programming, indentation, clean functions.
   - **BASIC / QBASIC** (`data-lang="basic"`): Line numbers, `INPUT`, `PRINT`, `LET`, `REM`.
   - **Pseudocode** (`data-lang="pseudocode"`): Formal algorithmic conventions (`ALGORITHM`, `BEGIN`, `INPUT`, `IF-THEN-ELSE`, `WHILE`, `END`).
   - **JavaScript / Web** (`data-lang="javascript"`): Modern interactive scripting.

## Usage in Lesson HTML

### Declarative Markup (Auto-Upgraded by `StudyCode.init()`):
```html
<div class="study-code-snippet"
     data-title="jamb_checker.py"
     data-lang="python"
     data-notes='{"1": "Reads candidate UTME aggregate score.", "2": "Checks if score qualifies for university admission cutoff."}'
     data-output="Enter JAMB score: 240\nResult: Eligible for Admission Screening">
  <code>
score = int(input("Enter JAMB score: "))
if score >= 200:
    print("Result: Eligible for Admission Screening")
else:
    print("Result: Below Cut-off Mark")
  </code>
</div>
```

### Programmatic Construction (JavaScript):
```javascript
const card = window.StudyCode.createCard({
  title: "calculate_fare.py",
  language: "python",
  code: pythonSourceCode,
  notes: {
    1: "Base fare for Keke ride is ₦150.",
    2: "Adds ₦50 per kilometre travelled."
  },
  traceSteps: [
    { line: 1, vars: { base: "₦150" }, note: "Initialise base fare" },
    { line: 2, vars: { base: "₦150", distance_km: 4, total: "₦350" }, note: "150 + (4 * 50) = 350" }
  ],
  output: "Total Fare: ₦350"
});
document.getElementById("code-mount").innerHTML = card.html;
window.StudyCode.bindCard(document.getElementById("code-mount").firstElementChild, card.rawCode, card.traceSteps);
```
