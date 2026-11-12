# `02-lesson.md` Template

Write `topics/<slug>/02-lesson.md` following this exact structure so `lesson-renderer` and `narration-choreographer` can build the complete interactive editorial page, 3D scenes, and spotlight narration script.

````markdown
---
slug: ss2-phy-simple-harmonic-motion
title: Simple Harmonic Motion & the Simple Pendulum
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
duration_min: 80
version: 2
---

# Simple Harmonic Motion & *the Simple Pendulum*

- **Eyebrow:** Lesson 01 · Practical + inquiry · 80 minutes
- **Guiding Question:** Why does a pendulum keep steady time even as its swing dies down — and how can a piece of string measure gravity in Lagos?
- **Objectives:**
  1. **01** · Classify periodic motions into **simple harmonic motion (SHM)** and non-SHM, and state the defining condition $a = -\omega^2 x$.
  2. **02** · Define **amplitude ($A$)**, **period ($T$)**, **frequency ($f$)** and **angular frequency ($\omega$)**, and use $\omega = 2\pi f = 2\pi / T$.
  3. **03** · Carry out the **simple pendulum practical**, record $t$ for $20$ oscillations to find $T$ and $T^2$, and explain why **length $L$** — not mass or small release angle — controls the period.
  4. **04** · Calculate **displacement, velocity, acceleration, energy** and **acceleration due to gravity ($g$)** from $T = 2\pi\sqrt{L/g}$ and the slope of a $L$–$T^2$ graph.
  5. **05** · State WAEC/NECO **precautions in the past tense** and analyse systematic vs random errors in pendulum timing.

---

## 0. Warm-up · Do Now (5 min)
Four spaced-retrieval flashcards answered from memory before revealing:
1. **Q:** Define linear acceleration and state its SI unit.
   **A:** Acceleration is the **rate of change of velocity with time** ($a = \Delta v / t$), measured in **$\text{m s}^{-2}$**.
2. **Q:** State the formula for kinetic energy and gravitational potential energy.
   **A:** $\text{KE} = \tfrac{1}{2}mv^2$ and $\text{PE} = mgh$, both measured in **joules ($\text{J}$)**.
3. **Q:** Convert $80.0\text{ cm}$ to metres and find its square root to 3 significant figures.
   **A:** $80.0\text{ cm} = \mathbf{0.800\text{ m}}$; $\sqrt{0.800} = \mathbf{0.894\text{ m}^{1/2}}$.
4. **Q:** Why do we read a metre rule with our eye directly perpendicular to the scale mark?
   **A:** To avoid **parallax error**, which makes readings systematically too high or too low.

---

## 1. Wonder · The Story & Wonder Wall (8–10 min)

### 3D Story Scene (`#story-stage`, scene key: `story`)
- **Cast & Setting:**
  - `ngozi` → **Mama Ngozi** (or **Baba Tunde**, clock repairer at Yaba Market, Lagos)
  - `cust1` → **Chinedu** (customer / apprentice)
  - `amaka` → **Dr Amaka** (Physics lecturer at the University of Lagos Quality & Metrology Lab)
- **Story Beats (5–6 beats):**
  1. `shot: [[0, 2.6, 7.2], [0, 1.3, 0]]`, `who: "cust1"`, `text: "..."`, `caption: "..."`
  2. ...
- **Collapsible Text Transcript (`#story-text`):** Full dialogue for offline low-end fallback.

### Wonder Wall (`#wonder`)
- **Prompt:** Before we touch any apparatus: what do *you* think controls the time of one swing of a pendulum — the mass of the bob, the starting angle, or the length of the thread?
- **Seed Notes (4 sticky notes):**
  - *"Does a heavier brass bob swing faster than a lighter one? — Tolu"*
  - ...

---

## 2. Investigate · Sort Game & 3D Virtual Practical (25 min)

### 2A. Interactive Sort Game (`#sort`)
- **Title & Intro:** Everyday motions: which ones are truly Simple Harmonic?
- **Bins (3):** `shm` (*Simple Harmonic Motion*), `periodic` (*Periodic, but NOT SHM*), `non` (*Not periodic*)
- **Items (9–12):** Each with `id`, `name`, `emo`, `bin`, and `why` explanation shown after checking.

### 2B. 3D Virtual Practical (`#practical`, scene key: `bench`)
- **Apparatus & 4-Step Method Cards (`.method`):**
  1. **Measure $L$ to the centre of the bob** ...
  2. **Displace through a small angle ($\theta \le 10^\circ$)** ...
  3. **Time $N = 20$ complete oscillations from the centre mark** ...
  4. **Vary $L$, tabulate $t$, $T$ and $T^2$, and plot $L$ against $T^2$** ...
- **3D Scene Specification (`bench`):**
  - Built with `SceneKit.createStage`.
  - Named spotlight/highlight parts for `StudyNarrator`: `bob`, `string`, `clamp`, `fiducial`, `ruler`, `stand`.
  - Controls: Length $L$ presets (`0.40 m`, `0.60 m`, `0.80 m`, `1.00 m`, `1.20 m`), Mass toggle (`50 g` vs `100 g`), Release Angle (`8°` vs `12°`), **Release & Time 20 swings** button, **Reset** button.
  - Emits `l1:bench` on each run and `l1:bench-done` when 4+ lengths have been timed.
- **Interactive Results Table (`#results-table`):**
  - Columns: Trial, $L\text{ (m)}$, Time $t_1\text{ (s)}$ for 20 swings, Period $T = t/20\text{ (s)}$, $T^2\text{ (s}^2\text{)}$.
- **Expected Results & Graph Box (`#expected`):**
  - Completed WAEC standard table (`2 d.p.` for $t$, `3 s.f.` for $T$ and $T^2$) + slope calculation yielding $g = 4\pi^2 \times (\Delta L / \Delta T^2) \approx 9.81\text{ m s}^{-2}$.
- **Analysis Questions (`.aq` with locked `.solution`):**
  - 5 questions testing why mass and small angle didn't change $T$, why 20 swings were timed, why the fiducial mark is placed at the centre, and how $g$ is found from the slope.

---

## 3. Make sense · Core Concepts & 3D Vector/Energy Zoom (15 min)

### 3A. Formal Definitions, Equations & Comparison Table (`#concepts`)
- **Defining Equation of SHM:** $a = -\omega^2 x$ (explain the minus sign and proportionality).
- **Kinematic Equations (`.eq` blocks):**
  - $\omega = 2\pi f = \frac{2\pi}{T}$
  - $v = \omega\sqrt{A^2 - x^2}$ and $v_{\max} = \omega A$
  - $a = -\omega^2 x$ and $a_{\max} = \omega^2 A$
  - $T = 2\pi\sqrt{\frac{L}{g}}$ and $T = 2\pi\sqrt{\frac{m}{k}}$
- **Comparison Table (`#props-table`):** Position ($x = 0$ Equilibrium vs $x = \pm A$ Extremes) across Displacement, Velocity, Acceleration, Restoring Force, Kinetic Energy, and Potential Energy.
- **Interactive Position Explorer (`#ph-explorer` / `#pos-explorer`):** Tap pins along the swing from $-A$ to $+A$ to inspect exact values of $x, v, a, \text{KE}, \text{PE}$.

### 3B. 3D Phase, Vector & Energy Zoom Stage (`#neutralise` / `#zoom`, scene key: `zoom`)
- **3D Scene Specification (`zoom`):**
  - Shows a close-up 3D oscillator (pendulum bob + mass-spring side by side, or 3D bob with live 3D velocity arrow $\vec{v}$ in teal and restoring acceleration arrow $\vec{a}$ in amber, plus 3D energy bars $\text{KE}$, $\text{PE}$, $E_{\text{total}}$).
  - Live readout counters in `.stage-bar`.

---

## 4. Apply · Worked Examples, The Bridge & Quiz (20 min)

### 4A. Step-by-Step Worked Examples (`#examples`)
4 graded worked examples (`#ex1` to `#ex4`), each with `.tag-ex`, problem `.q`, numbered reasoning steps `ol.steps-sol`, and `.answer-line`.

### 4B. The Bridge: Solving the Anchor Mystery (`#bridge`)
- Interactive mini-challenge where the student tests the two clock pendulums / samples from the opening story, diagnoses the exact fault, and unlocks the `.vt-verdict` + `.callout.big` (*The Big Idea*).

### 4C. 12-Question WAEC/NECO/JAMB Quiz (`#quiz`)
- Rendered from `03-questions.md` (`window.LESSON_QUIZ`).

---

## 5. Reflect & Assignment (10 min + 40 min home)

### 5A. Self-Assessment Rubric (`#reflect`)
- 5 *"I can…"* statements rated `1` (*Not yet*) to `4` (*I could teach it*).
- **Exit Ticket (`.aq` · 2 marks)** with locked solution.
- **Blank-Page Recall** checklist (6–7 points) + **Wonder Wall review**.

### 5B. Home Assignment (`#assignment`)
- **Part A · Practical Home Investigation:** (e.g. build a thread-and-stone pendulum at home, time 20 swings for two lengths, and estimate local $g$).
- **Part B · Written Exam Questions (30 marks):** 8 structured WAEC/NECO theory & practical questions (`b1`–`b8`) with mark allocations and locked-until-attempted model solutions + examiner marking notes.
- **For Teachers (`#teacher-notes`):** Collapsible 80-minute lesson timetable (including the **45–50 min active movement break**), preparation notes, Support/Stretch differentiation, and **Transversal Competences (`L1`–`L7`)**.

---

## 6. Narrator Choreography Blueprint (`window.NARRATION`)
List the chapters (`Welcome`, `Do Now`, `The Story`, `Wonder Wall`, `Sort Game`, `Virtual Lab`, `Make Sense`, `Vector & Energy Zoom`, `Worked Examples`, `Solving the Mystery`, `Quiz & Reflection`) and key `wait` triggers (`note`, `sort`, `bench`, `bridge`, `quiz`) for `narration.js`.

---

## 7. Explainer Video Plan
video_cap: 3

Score every lesson with `references/video-criteria.md`. A lesson is recommended at ≥ 5 points, top `video_cap` only.

| lesson | score | recommend | reasons | video would cover |
|---|---|---|---|---|
| lesson-01 | 2 | no | +2 invisible mechanism · +1 graph reading · −3 practical-led · +2 misconception | — the pendulum bench already shows it live |
| lesson-02 | 8 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 graph reading | T = 2π√(l/g), finding g from a T²–l graph, two worked examples · kits: graph |
````
