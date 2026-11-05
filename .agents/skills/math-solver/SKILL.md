---
name: math-solver
description: Renders all mathematics and physics/chemistry calculations offline in LaTeX using StudyMath (assets/js/math-kit.js & assets/css/math.css) — decomposing every calculation in worked examples, concept derivations, quiz explanations, Do Now cards, and assignment solutions into atomic one-operation-at-a-time LaTeX steps (all expanded by default) with a plain-English explainer note directly underneath every line.
---

# StudyMath Service (`math-solver`)

Goal: ensure **every mathematical formula, derivation, worked example, quiz explanation, Do Now flashcard, and assignment solution** in a StudyPipe unit is rendered with **offline LaTeX typesetting** (`\frac{...}{...}`, `\sqrt{...}`, `^{...}`, `_{...}`, `\boxed{...}`) and **broken down step-by-step (one operation per line, all steps expanded by default) with a plain-English explainer note underneath every single line**.

## Core Service Files
- `kits/math-solver/math-kit.js` → copied to `topics/<slug>/html/assets/js/math-kit.js` (exposes `window.StudyMath`)
- `kits/math-solver/math.css` → copied to `topics/<slug>/html/assets/css/math.css`
- `scripts/apply-math.mjs` → CLI script (`node scripts/apply-math.mjs topics/<slug>`) that installs `math.css` and `math-kit.js` and injects the `<link>` and `<script>` tags into `html/index.html` and all `html/lessons/lesson-0X/index.html` pages.

## Non-Negotiable Rules for Mathematics & Calculations
1. **LaTeX Typesetting Everywhere**:
   - Every formula and calculation step must render via `window.StudyMath` with stacked fractions (`.sp-frac`), true radical bars (`.sp-sqrt`), proper superscripts/subscripts (`.sp-sup`, `.sp-sub`), italic variables (`.sp-var`), upright functions/units (`.sp-fn`, `.sp-unit`), and boxed final answers (`.sp-boxed` / `\boxed{...}`).
2. **All Steps Expanded by Default — One Operation Per Step**:
   - Never collapse calculation steps behind a click or skip intermediate arithmetic.
   - Break every calculation into atomic steps:
     - **Step 1 · Governing Formula** (e.g. `\sin r = \frac{\sin i}{n}`)
     - **Step 2 · Substitute Values** (e.g. `\sin r = \frac{\sin 55.0^\circ}{1.52}`)
     - **Step 3 · Evaluate Function / Powers / Brackets** (e.g. `\sin r = \frac{0.8192}{1.52}`)
     - **Step 4 · Perform Arithmetic (Add / Subtract / Multiply / Divide)** (e.g. `\sin r = 0.5389`)
     - **Step 5 · Final Answer with SI Unit** (e.g. `r = \sin^{-1}(0.5389) = \boxed{32.6^\circ}`)
3. **Plain-English Explainer Note Directly Underneath Every Line (`.m-step-note`)**:
   - Directly below every single LaTeX equation line, display a `.m-step-note` explaining in simple, student-friendly language what operation happened on that line (e.g., if the equation shows `1 + 1 = 2`, the note directly underneath states: *"Adding 1 + 1 gives 2."*; if it shows `\sin r = \frac{0.8192}{1.52} = 0.5389`, the note underneath states: *"Divide the numerator 0.8192 by the denominator 1.52, which gives 0.5389."*).
4. **Concept Formula Banners (`.eq`)**:
   - Every `.eq` banner must include an underneath `.m-eq-note` calculation and symbol guide explaining how to use the equation.
