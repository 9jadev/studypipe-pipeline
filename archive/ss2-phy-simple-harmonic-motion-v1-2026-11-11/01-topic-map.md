---
slug: ss2-phy-simple-harmonic-motion
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
duration_min: 80
---

# Topic Map: Simple Harmonic Motion & the Simple Pendulum

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)
- **WAEC (WASSCE Physics — Oscillatory Motion & Mechanics Practical):**
  - Meaning and physical condition of simple harmonic motion ($a = -\omega^2 x$); definitions and calculations of amplitude ($A$), period ($T$), frequency ($f$), and angular frequency ($\omega$).
  - Equations relating displacement ($x$), velocity ($v = \omega\sqrt{A^2 - x^2}$), and acceleration ($a = -\omega^2 x$); continuous interchange between kinetic and potential energy; damping and forced resonance.
  - Paper 3 Practical: determining acceleration due to gravity ($g$) with a simple pendulum by timing $20$ oscillations across multiple string lengths $L$, plotting $L$ against $T^2$ (or $T^2$ against $L$), calculating the slope, and stating experimental precautions in the past tense.
- **NECO (SSCE Physics):**
  - Distinguishing simple harmonic oscillators from general periodic systems; calculating $T = 2\pi\sqrt{L/g}$ for a simple pendulum and $T = 2\pi\sqrt{m/k}$ for a loaded spiral spring; identifying positions of maximum speed and maximum restoring force.
- **JAMB (UTME Physics):**
  - Proportional scaling problems (e.g. how period changes when length is quadrupled or when a pendulum clock is moved to a different gravitational field); maximum speed $v_{\max} = \omega A$ and maximum acceleration $a_{\max} = \omega^2 A$; energy conservation in undamped oscillations.

## 2. Anchor Phenomenon & 3D Story Cast
- **Setting:** Yaba Market Clock & Instrument Stall, Lagos (`x ≈ 0`), and the UNILAG Metrology & Physics Laboratory (`x ≈ 40`).
- **Characters:**
  - **Mama Ngozi:** Seasoned clock & school-instrument trader at Yaba Market.
  - **Kunle:** Secondary school prefect complaining that the mechanical pendulum wall clock bought for their assembly hall loses 8 minutes every hour, and blaming the light brass bob.
  - **Mrs Adeyemi:** Second customer wondering if pulling the pendulum wider will make it swing faster to catch up.
  - **Dr Amaka:** Physics metrologist at the University Lab who challenges them to test mass, starting angle, and pendulum length on a precision 3D timing bench.
- **Mystery Resolution (The Bridge):** Comparing Clock Pendulum A (calibrated to $L = 0.994\text{ m}$, giving $T = 2.00\text{ s}$ per cycle) against the faulty Clock Pendulum B ($L = 1.150\text{ m}$, giving $T = 2.15\text{ s}$ because its regulating nut slipped down the rod). Shortening $L$ — not swapping the bob — fixes the clock.

## 3. Learning Objectives (with Bloom level)
1. **[Understand]** Classify everyday motions into **simple harmonic motion (SHM)**, non-SHM periodic motion, and non-periodic motion, and state the defining condition $a = -\omega^2 x$.
2. **[Apply]** Define **amplitude ($A$)**, **period ($T$)**, **frequency ($f$)**, and **angular frequency ($\omega$)**, and use $\omega = 2\pi f = 2\pi / T$ in calculations.
3. **[Apply]** Carry out the **simple pendulum practical**, record time $t$ for $20$ complete oscillations across five lengths $L$, calculate $T$ and $T^2$, and demonstrate that **length $L$** (and $g$), not bob mass or small release angle ($\theta \le 10^\circ$), determines the period.
4. **[Analyse]** Calculate instantaneous velocity $v = \omega\sqrt{A^2 - x^2}$, acceleration $a = -\omega^2 x$, energy interchange ($\text{KE} \leftrightarrow \text{PE}$), and **acceleration due to gravity ($g$)** from $T = 2\pi\sqrt{L/g}$ and the gradient of an $L$–$T^2$ graph.
5. **[Evaluate]** State WAEC/NECO practical **precautions in the past tense** and determine how specific experimental errors affect the measured period $T$ and calculated value of $g$.

## 4. 5-Phase Inquiry Arc & Sub-topics
- **0. Do Now (5 min):** Spaced retrieval of linear acceleration, kinetic/potential energy formulas, metre conversions, and parallax error.
- **1. Wonder (8 min):** 3D Story at Yaba Market & UNILAG Lab + *Wonder Wall* predictions on whether mass, angle, or length controls pendulum time.
- **2. Investigate (25 min):**
  - *Motion Sort Game:* Sorting 12 everyday Nigerian motions into *SHM*, *Periodic (not SHM)*, and *Not periodic*.
  - *3D Simple Pendulum Lab Bench:* Testing lengths $0.40\text{ m}$ to $1.20\text{ m}$ (plus mass & angle comparison), recording $t$, $T$, and $T^2$ in an interactive table, and answering locked analysis questions.
- **3. Make sense (15 min):** Defining SHM ($a = -\omega^2 x$), kinematic equations, comparison table of equilibrium ($x = 0$) vs extremes ($x = \pm A$), interactive Swing Position Explorer (`-A` to `+A`), and a **3D Vector & Energy Zoom Stage** showing live $\vec{v}$, $\vec{a}$, $\text{KE}$, and $\text{PE}$.
- **4. Apply (20 min):** 4 graded Worked Examples → *The Bridge* (fixing Mama Ngozi's two clock pendulums by timing 10 swings and adjusting the regulating nut) → 12 WAEC/NECO/JAMB interactive MCQs.
- **5. Reflect & Assignment (10 min + 40 min home):** Self-rating rubric (`1–4`), Exit Ticket, Blank-Page Recall, Part A Home Pendulum Investigation, and Part B 30-mark structured exam paper (`b1`–`b8`).

## 5. Prerequisites (Do Now Retrieval Bank)
1. Definition and unit of linear acceleration ($a = \Delta v / t$, $\text{m s}^{-2}$).
2. Mechanical energy formulas ($\text{KE} = \tfrac{1}{2}mv^2$, $\text{PE} = mgh$).
3. Converting centimetres to metres ($80.0\text{ cm} = 0.800\text{ m}$) and taking square roots.
4. Avoiding parallax error when reading a metre rule.

## 6. Transversal Competences (L1–L7)
- **L1 · Thinking and learning to learn:** Forming testable predictions about mass, angle, and length on the Wonder Wall, then revising beliefs using timing evidence.
- **L4 · Multiliteracy:** Translating between 3D physical oscillations, vector arrows, tabular readings ($L, t, T, T^2$), linear graphs, and algebraic equations.
- **L6 · Working-life skills and entrepreneurship:** Understanding horological calibration, metrology standards, and why precision timing matters in workshops and laboratories.

## 7. Visual & Interactive Specifications
- **3D Story (`story.js`):** 6 camera beats across Yaba Market Stall (with two pendulum wall clocks A & B on display) and UNILAG Metrology Lab.
- **Sort Game (`lesson.js`):** 12 motions sorted into `shm`, `periodic`, and `non`.
- **3D Pendulum Lab (`bench.js`):** Studio-lit 3D retort stand, split cork clamp, inextensible string, brass bob, vertical metre rule, and centre fiducial pointer. Spotlightable parts: `bob`, `clamp`, `fiducial`, `ruler`, `stand`.
- **3D Vector & Energy Zoom (`zoom.js`):** Close-up 3D harmonic oscillator with real-time 3D velocity vector ($\vec{v}$, teal), restoring acceleration vector ($\vec{a}$, amber), and 3D $\text{KE}/\text{PE}/E_{\text{tot}}$ pillars, plus a Damping toggle.
- **Bridge Challenge (`lesson.js`):** Side-by-side interactive clock pendulum comparator (Clock A vs Clock B).

## 8. Exam Emphasis & Common Pitfalls
- Forgetting to divide total time $t$ by the number of oscillations $N = 20$ to find $T$.
- Measuring string length to the top of the bob instead of its **centre of gravity**.
- Confusing the conditions at the equilibrium centre ($x=0$: maximum $v$, zero $a$) with the extreme ends ($x=\pm A$: zero $v$, maximum $a$).
- Writing precautions in the imperative (*"Avoid conical oscillation"*) instead of the **past tense** (*"Conical oscillation was avoided by ensuring the bob swung in a single vertical plane"*).

## 9. Known Misconceptions
- *"Heavier bobs swing faster"* → refuted directly on the 3D lab bench by toggling $50\text{ g}$ vs $100\text{ g}$.
- *"Pulling the bob slightly wider ($10^\circ$ vs $5^\circ$) makes the period much longer"* → refuted by showing isochronism for small angles (faster speed compensates for the longer arc).
- *"Acceleration is greatest when speed is greatest"* → refuted in the 3D Vector Zoom stage where the amber $\vec{a}$ arrow shrinks to zero right at the centre as the teal $\vec{v}$ arrow peaks.

## 10. Sources Consulted (paraphrased)
- `topics/ss2-phy-simple-harmonic-motion/sources/studypipe-module3-simple-pendulum-notes.pdf` (conceptual reference only; all text and examples newly authored).
- `topics/ss2-phy-simple-harmonic-motion/sources/links.md` (pendulum practical reference).
- WAEC, NECO, and JAMB Physics syllabus specifications (paraphrased).
