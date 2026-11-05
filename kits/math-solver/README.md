# StudyMath Service (`kits/math-solver/`)

A 100% offline LaTeX mathematical typesetting and atomic step-by-step calculation & explainer engine for StudyPipe lessons.

## Files
- `math-kit.js` — Exposes `window.StudyMath` (`toLatex`, `tex`, `renderLatex`, `decompose`, `renderSteps`, `explainFormula`, `upgradePage`).
- `math.css` — Typesetting styles for stacked fractions (`.sp-frac`), radical vinculum bars (`.sp-sqrt`), superscripts/subscripts (`.sp-sup`, `.sp-sub`, `.sp-supsub`), boxed final answers (`.sp-boxed`), and step-by-step calculation cards (`.m-calc-wrap`, `.m-step`, `.m-step-eq`, `.m-step-note`, `.m-eq-note`).

## What it does
1. **LaTeX Rendering (`StudyMath.renderLatex(tex, displayMode)`)**:
   Renders standard LaTeX (`\frac{a}{b}`, `\sqrt{x}`, `^{sup}`, `_{sub}`, `\sin`, `\cos`, `\tan`, `\sec`, `\boxed{...}`, Greek symbols) and automatically compiles natural/Unicode math into canonical LaTeX (`data-latex="..."`) with Nigerian English (`en-NG`) speech labels (`aria-label="..."`).
2. **Atomic Step-by-Step Calculation Decomposition (`StudyMath.decompose(chain)`)**:
   Splits any multi-step calculation into individual one-operation-at-a-time steps (all expanded by default), inserting any skipped intermediate trig/square evaluations and generating a plain-English explainer note (`.m-step-note`) directly underneath every single LaTeX equation line.
3. **Automatic Page Upgrade (`StudyMath.upgradePage()`)**:
   Upgrades `.eq` formula banners, `.example` worked examples (`ol.steps-sol > li` and `.answer-line`), `.qexp` quiz explanations, `.dn-a` Do Now flashcards, `.solution .reveal-body` assignment solutions, and Welcome Hub `.f-eq` / `.law-eq` cards.
