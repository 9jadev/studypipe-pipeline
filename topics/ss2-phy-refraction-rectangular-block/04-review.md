# 04 — Independent Content Review: `ss2-phy-refraction-rectangular-block` (Round 1)
verdict: PASS

## Blocking issues (must fix)
- None. Zero blocking issues found.

## Minor issues (fix if quick)
- None. All equations, decimal conventions ($1\text{ d.p.}$ for lengths in $\text{cm}$, $3\text{ d.p.}$ for trig values), and past-tense precautions match official WAEC/NECO Chief Examiner standards.

---

## 1. Originality & Copyright Compliance Audit
- **100% Paraphrased & Original:** Every definition, Nigerian workshop narrative (*Danjuma Precision Optics in Yaba & Lekki Conservation Marine Lab*), worked example, and 60-question assessment stem has been independently written in original prose. Zero verbatim sentences or copied past-question stems from `sources/Refraction_Glass_Block_Exam_Guide.pdf`.
- **Zero External National Curriculum Names:** The 5-phase phenomenon-based inquiry structure and Transversal Competences (`L1`–`L7`) are applied naturally with zero reference to any foreign national curriculum.

---

## 2. Independent Calculation Audit
Every numerical example, bridge challenge, and quiz question in `02-lesson.md` and `03-questions.md` was independently recalculated:

### Lesson 01 Calculations
- **Worked Ex 1 ($i = 50^\circ, n = 1.50$):** $\sin r = \sin 50^\circ / 1.50 = 0.7660 / 1.50 = 0.5107 \implies r = 30.7^\circ$; single-surface deviation $\delta = 50.0^\circ - 30.7^\circ = 19.3^\circ$. (**Verified**)
- **Worked Ex 2 ($\lambda_{\text{air}} = 585\text{ nm}, n = 1.50$):** $f = \frac{3.0 \times 10^8}{5.85 \times 10^{-7}} = 5.13 \times 10^{14}\text{ Hz}$; $v = 2.00 \times 10^8\text{ m s}^{-1}$; $\lambda_{\text{glass}} = 585 / 1.50 = 390\text{ nm}$. (**Verified**)
- **Worked Ex 3 (Water $4/3$ to Glass $3/2$):** ${}_wn_g = (3/2)/(4/3) = 9/8 = 1.125$; ${}_gn_w = 8/9 = 0.889$. (**Verified**)
- **Bridge ($90^\circ$ Reflected–Refracted at $i = 58.0^\circ$):** $r = 90^\circ - 58.0^\circ = 32.0^\circ \implies n = \tan 58.0^\circ = 1.600$. (**Verified**)
- **Quiz Q3–Q10:**
  - Q3: Glancing angle $50^\circ \implies i = 40^\circ \implies \sin r = \sin 40^\circ / 1.50 = 0.4285 \implies r = 25.4^\circ$. (**Verified**)
  - Q4: $i = 36.0^\circ, n = 1.60 \implies \sin r = 0.5878 / 1.60 = 0.3674 \implies r = 21.6^\circ \implies \delta = 36.0^\circ - 21.6^\circ = 14.4^\circ$. (**Verified**)
  - Q9: Glass ($1.50$) to water ($1.33$) at $32.0^\circ \implies \sin\theta_2 = 1.50\sin 32.0^\circ / 1.33 = 0.5976 \implies \theta_2 = 36.7^\circ$. (**Verified**)
  - Q10: $t = 9.0\text{ cm} = 0.090\text{ m}$ at $v = 2.0 \times 10^8\text{ m s}^{-1} \implies \Delta t = 4.5 \times 10^{-10}\text{ s}$. (**Verified**)

### Lesson 02 Calculations
- **Worked Ex 1 ($t = 8.0\text{ cm}, n = 1.50, i = 40^\circ$):** $r = 25.4^\circ$; $d = 8.0\sin(14.6^\circ)/\cos(25.4^\circ) = 8.0 \times 0.2521 / 0.9033 = 2.23\text{ cm}$. (**Verified**)
- **Worked Ex 2 ($w = 6.0\text{ cm}, n = 1.50, i = 30^\circ$):** $r = 19.5^\circ$; $EF = 6.0(\tan 30^\circ - \tan 19.5^\circ) = 6.0(0.5774 - 0.3541) = 1.34\text{ cm}$. (**Verified**)
- **Bridge ($t = 6.0\text{ cm}, n = 1.50, i = 45^\circ$):** $r = 28.1^\circ$; $d = 6.0\sin(16.9^\circ)/\cos(28.1^\circ) = 6.0 \times 0.2907 / 0.8821 = 1.98\text{ cm}$. (**Verified**)
- **Quiz Q2–Q12:**
  - Q2: $t = 10.0\text{ cm}, i = 45^\circ, r = 30^\circ \implies d = 10.0\sin 15^\circ / \cos 30^\circ = 2.99\text{ cm}$. (**Verified**)
  - Q8: $t = 5.0\text{ cm}, i = 60^\circ, n = 1.50 \implies r = 35.26^\circ \implies NO = 5.0 / \cos 35.26^\circ = 6.12\text{–}6.13\text{ cm}$. (**Verified**)
  - Q12: $t = 4.0\text{ cm}, i = 60^\circ, n = 1.50 \implies r = 35.3^\circ \implies d = 4.0\sin 24.7^\circ / \cos 35.3^\circ = 2.05\text{ cm}$. (**Verified**)

### Lesson 03 Calculations
- **Worked Ex 1 ($t = 3.6\text{ m}, \Delta d = 0.9\text{ m}$):** $d_{\text{app}} = 2.7\text{ m} \implies n = 3.6 / 2.7 = 1.33$. (**Verified**)
- **Worked Ex 3 ($9.0\text{ cm}$ glass $1.50$ + $12.0\text{ cm}$ water $4/3$):** $d_{\text{app}} = 9.0/1.50 + 12.0/(4/3) = 6.0 + 9.0 = 15.0\text{ cm}$; $\Delta d = 21.0 - 15.0 = 6.0\text{ cm}$. (**Verified**)
- **Worked Ex 4 ($18.0\text{ cm}$ block, $d_{\text{app},1} = 5.0\text{ cm}$):** $d_{\text{real},1} = 7.5\text{ cm} \implies d_{\text{real},2} = 10.5\text{ cm} \implies d_{\text{app},2} = 10.5 / 1.50 = 7.0\text{ cm}$. (**Verified**)
- **Bridge ($t = 10.0\text{ cm}, \Delta d = 4.0\text{ cm}$):** $d_{\text{app}} = 6.0\text{ cm} \implies n = 10.0 / 6.0 = 1.67$. (**Verified**)
- **Quiz Q1–Q12:** All depth, multi-layer ($10/(4/3) + 6/1.5 = 11.5\text{ cm}$), and bubble ($15 - 1.5 \times 4 = 9 \implies 9/1.5 = 6.0\text{ cm}$) questions verified.

### Lesson 04 Calculations
- **Worked Ex 1 ($C = 30^\circ$):** $n = 1/\sin 30^\circ = 2.00 \implies v = 1.50 \times 10^8\text{ m s}^{-1}$. (**Verified**)
- **Worked Ex 2 (Glass $1.50$ to Water $1.33$):** $C = \sin^{-1}(1.33/1.50) = 62.5^\circ$; at $\theta = 50^\circ$, $\sin r = 1.50\sin 50^\circ / 1.33 = 0.8639 \implies r = 59.8^\circ$; at $65^\circ > 62.5^\circ$, TIR occurs. (**Verified**)
- **Worked Ex 3 (Fibre $1.55 / 1.40$):** $C = \sin^{-1}(1.40/1.55) = 64.6^\circ$. (**Verified**)
- **Quiz Q2–Q9:** $\sin^{-1}(1/1.65) = 37.3^\circ$; $\sin^{-1}(1.38/1.50) = 66.9^\circ$; $\sin^{-1}(1/1.60) = 38.7^\circ$. (**Verified**)

### Lesson 05 Calculations
- **Worked Ex 1 ($\cos\theta$ vs $\phi$):** $\Delta(\cos\theta)/\Delta\phi = (0.810 - 0.270)/(0.540 - 0.180) = 0.540 / 0.360 = 1.50 = n$. (**Verified**)
- **Worked Ex 2 ($EF$ vs $V$):** $(3.25 - 0.59)/(0.550 - 0.100) = 2.66 / 0.450 = 5.91\text{ cm} \approx w = 6.0\text{ cm}$ ($1.5\%$ error, well within $\pm 10\%$). (**Verified**)
- **Worked Ex 3 ($LE$ vs $LN$):** $s = \sin r / \sin i = 1/1.50 = 0.667$; $K = 1/s = 1.50$. (**Verified**)
- **Quiz Q7–Q11:** $\cos(38.0^\circ/2) = \cos 19.0^\circ = 0.946$; $10.5 / 7.0 = 1.50$; $(0.836 - 0.228)/(0.550 - 0.150) = 0.608 / 0.400 = 1.52$. (**Verified**)

---

## 3. Syllabus & Objective Coverage Matrix

| Objective | Taught In | Tested By (`03-questions.md`) |
|---|---|---|
| **LO1:** Wavefront speed cause of refraction & invariant frequency $f$ | Lesson 01 (`#story`, `#concepts`, `#neutralise`) | L01 Q1, Q5, Q8, Q10, Q11 + L01 Tasks 1 & 2 |
| **LO2:** Snell's law (*"for a given pair of media"*), relative index ${}_1n_2$, reversibility, $n = \tan i$ | Lesson 01 (`#practical`, `#concepts`, `#examples`, `#bridge`) | L01 Q2, Q3, Q4, Q6, Q7, Q9, Q12 + L01 Tasks 1 & 3 |
| **LO3:** Parallel emergence ($e = i$, $0^\circ$ net deviation), lateral displacement $d$, far-face shift $EF$, dispersion | Lesson 02 (`#story`, `#practical`, `#concepts`, `#neutralise`, `#bridge`) | L02 Q1–Q12 + L02 Tasks 1, 2 & 3 |
| **LO4:** Real & apparent depth, upward shift $\Delta d = t(1-1/n)$, multi-layer slabs, air bubbles, no-parallax method | Lesson 03 (`#story`, `#practical`, `#concepts`, `#neutralise`, `#bridge`) | L03 Q1–Q12 + L03 Tasks 1, 2 & 3 |
| **LO5:** Critical angle $C$, two mandatory TIR conditions, $\sin C = n_2/n_1$, optical fibres, $45^\circ$ prisms, mirages | Lesson 04 (`#story`, `#practical`, `#concepts`, `#neutralise`, `#bridge`) | L04 Q1–Q12 + L04 Tasks 1, 2 & 3 |
| **LO6:** Paper 3 four-pin practical procedure, 7 official WAEC graph variants, decimal rules, past-tense precautions | Lesson 05 (`#story`, `#practical`, `#concepts`, `#neutralise`, `#bridge`) | L05 Q1–Q12 + L05 Tasks 1, 2 & 3 |

---

## 4. Confirmed 3D & Interactive Scenes for Renderer (`Step 5` & `Step 6`)

| Unit / Lesson | Scene ID | Engine | Target Parts / Controls & Narrator Events |
|---|---|---|---|
| **Welcome Hub** | `#lab-canvas` | `StudyLab` (`three.js`) | 3D Rectangular Glass Block Laser & 4-Pin Ray Bench; angle $i$ slider, 3 mode toggles, live $i, r, e, d, v$ HUD |
| **Lesson 01** | `story`, `bench`, `zoom` | `StoryStage` + `SceneKit` | `story.js` (Yaba laser bench); `bench.js` (3D Snell's Law Multi-Media Refraction Bench); `zoom.js` (3D Wavefront Pivoting & Wavelength Compression Zoom) |
| **Lesson 02** | `story`, `bench`, `zoom` | `StoryStage` + `SceneKit` | `story.js` ($1.98\text{ cm}$ lateral shift mystery); `bench.js` (3D Lateral Displacement $d$ & Far-Face Shift $EF$ Bench); `zoom.js` (3D Triangles $NMO/NOF$ & Red/Violet Dispersion Zoom) |
| **Lesson 03** | `story`, `bench`, `zoom` | `StoryStage` + `SceneKit` | `story.js` (Floating stamp & Lekki pond); `bench.js` (3D No-Parallax Search-Pin & Multi-Layer Depth Bench with head-sway parallax check); `zoom.js` (3D Virtual-Image Ray Cone Zoom) |
| **Lesson 04** | `story`, `bench`, `zoom` | `StoryStage` + `SceneKit` | `story.js` (Mirror-glass TIR & Lagos subsea fibre); `bench.js` (3D Critical-Angle & Optical-Fibre Core/Cladding Bench); `zoom.js` (3D $45^\circ$ Prism Periscope vs Ghost-Mirror & Highway Mirage Zoom) |
| **Lesson 05** | `story`, `bench`, `zoom` | `StoryStage` + `SceneKit` | `story.js` (Paper 3 dress rehearsal); `bench.js` (3D Four-Pin Sighting Workbench with eye-level pin-base view & 7 WAEC Graph Variant switcher); `zoom.js` (3D Pin-Base vs Tilted-Pin Top & Variant Triangle Decoder) |
