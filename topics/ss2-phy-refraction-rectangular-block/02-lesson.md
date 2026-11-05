---
slug: ss2-phy-refraction-rectangular-block
title: Refraction of Light Through a Rectangular Glass Block
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
lessons_count: 5
duration_per_lesson_min: 80
version: 2
---

# 02 — Master Multi-Lesson Unit Plan: Refraction of Light Through a *Rectangular Glass Block*

All explanations, Nigerian stories, worked examples, data tables, and problem scenarios in this blueprint are **100% originally authored and paraphrased**.

---

## Part I · Unit Welcome Hub (`html/index.html`) & Spaced Retrieval Bank (`retrieval-bank.js`)

### 1. Hero Section & Live 3D Hero Lab (`#lab-canvas` / `window.StudyLab`)
- **Eyebrow:** `SS2 Physics · 5-Lesson Inquiry Unit · WAEC · NECO · JAMB`
- **Display Title:** *Refraction of Light Through a Rectangular Glass Block*
- **Lede:** Step inside **Danjuma Precision Optics in Yaba, Lagos**. Fire a 3D laser beam into a $6.0\text{ cm}$ crown-glass block, watch wavefronts slow from $3.0 \times 10^8\text{ m s}^{-1}$ to $2.0 \times 10^8\text{ m s}^{-1}$, measure lateral shift $d$, test critical-angle total internal reflection, and master all **7 WAEC Paper 3 ray-tracing graph variants**.
- **Hero CTAs:**
  - `[data-tour]` **"Start guided tour"** (Nigerian English `en-NG` narrator walkthrough)
  - **"Begin Lesson 1 →"** (`lessons/lesson-01/index.html`)
- **3D Hero Lab (`window.StudyLab`):**
  - **Visuals:** Studio-lit 3D optical bench holding a transparent cyan-tinted rectangular crown-glass slab ($ABCD$, width $t = 6.0\text{ cm}$), normal lines $NN'$ and $MM'$, glowing incident laser beam, refracted internal ray, parallel emergent ray, dashed undeviated path showing lateral displacement $d$, four brass optical pins ($P_1, P_2, P_3, P_4$), and animated photon/wavefront pulses.
  - **Interactive Controls:**
    - Mode buttons: `1. Refraction & Lateral Shift (n = 1.50)`, `2. Diamond High-Index Bend (n = 2.42)`, `3. Total Internal Reflection (θ > 41.8°)`
    - Angle of incidence slider $i$: `0°` to `75°` (default `45°`)
  - **Live Telemetry Readout:**
    - `Incident i`: `45.0°` · `Refracted r`: `28.1°` · `Emergent e`: `45.0°` · `Lateral Shift d`: `1.98 cm` · `Wave Speed v`: `2.00 × 10⁸ m/s`

### 2. Scrolling Marquee (12 Core Unit Constants & Equations)
1. `Speed of light in air c = 3.0 × 10⁸ m s⁻¹`
2. `Snell's Law: n = sin i / sin r (for a given pair of media)`
3. `Wave Speed Form: n = c / v = λ_air / λ_medium (frequency f is constant!)`
4. `Parallel-Sided Block: Emergent Angle e = i (Net Angular Deviation = 0°)`
5. `Lateral Displacement: d = t sin(i − r) / cos r`
6. `Far-Face Shift (WAEC 2023): EF = t(tan i − tan r)`
7. `Real & Apparent Depth: n = Real Depth / Apparent Depth`
8. `Upward Apparent Shift: Δd = t(1 − 1/n)`
9. `Critical Angle: sin C = 1 / n (Crown Glass C = 41.8°)`
10. `Two-Media Critical Angle: sin C = n_less / n_more`
11. `Glancing Angle Rule: θ from block face ⇒ i = 90° − θ, so cos θ = sin i`
12. `WAEC Paper 3 Rules: Lengths to 1 d.p. (cm) · Trig Ratios to 3 d.p. · Pin Bases Aligned`

### 3. Section 01 (`#mystery`) · The Yaba Optical Workshop Triple Mystery
- **Narrative Case File:**
  - At **Danjuma Precision Optics in Yaba, Lagos**, apprentice **Kemi** and classmate **Chidi** are calibrating a $6.0\text{ cm}$ thick rectangular crown-glass viewing block ($n = 1.50$) for an underwater camera housing at the Lekki Conservation Centre:
    - **Clue 01 · The Parallel Sideways Jump:** Aiming a green alignment laser at $i = 45^\circ$ into face $AB$, Kemi finds that the beam leaves face $DC$ at $e = 45^\circ$ (zero angular deviation!), yet misses the target sensor by **$1.98\text{ cm}$ sideways**!
    - **Clue 02 · The Floating Serial Stamp:** Looking straight down from above through the $6.0\text{ cm}$ block at a quality-control stamp on the workbench, Chidi sees the stamp floating **$2.0\text{ cm}$ above the wood** at an apparent depth of **$4.0\text{ cm}$**!
    - **Clue 03 · The Instant Mirror Face:** When **Engr. Danjuma** shines the beam from *inside* the glass towards the air boundary at **$45^\circ$**, zero light escapes into the air — the clear glass acts like a $100\%$ silvered mirror!
- **Exam Weight Stat Cards:**
  - **25+ Marks in Paper 3:** Rectangular glass block four-pin ray tracing is one of the three most frequently examined WAEC/NECO Physics practicals.
  - **7 Graph Variants:** Examiners test $\sin i$ vs $\sin r$, $\cos\theta$ vs $MO/NO$, $d$ vs $\tan i - \tan r$, $LE$ vs $LN$, internal rays, and mirror-backed blocks.
  - **3 Core Exams:** High-yield across **WAEC WASSCE** (Papers 1, 2 & 3), **NECO SSCE**, and **JAMB UTME** (Topic 25).

### 4. Section 02 (`#journey`) · The 5-Lesson Progressive Roadmap
1. **Lesson 01:** *Refraction at Plane Surfaces, Wavefront Speed & Snell's Law* (`80 min · 3D Laser & Wavefront Lab`)
2. **Lesson 02:** *Path Through a Rectangular Glass Block, Lateral Displacement & Dispersion* (`80 min · 3D Lateral Shift Bench`)
3. **Lesson 03:** *Real & Apparent Depth, Multi-Layer Slabs & The No-Parallax Method* (`80 min · 3D No-Parallax Pin Lab`)
4. **Lesson 04:** *Critical Angle, Total Internal Reflection & Optical Fibre Engineering* (`80 min · 3D TIR & Fibre Bench`)
5. **Lesson 05:** *WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical & The 7 Graph Variants* (`80 min · 3D 4-Pin Workbench`)

### 5. Section 03 (`#explorer`) · 4-Tab Interactive Concept Explorer
- **Tab 1 (`snell`):** *Snell's Law Linear Sine Graph ($\sin i = n\sin r$)* — shows why plotting $\sin i$ against $\sin r$ gives a straight line through the origin of gradient $n = 1.50$.
- **Tab 2 (`lateral`):** *Lateral Displacement Curve ($d = t\sin(i-r)/\cos r$)* — shows how sideways shift $d$ rises from $0\text{ cm}$ at $i = 0^\circ$ toward block thickness $t$ as $i \to 90^\circ$.
- **Tab 3 (`depth`):** *Real vs Apparent Depth ($d_{\text{app}} = t/n$)* — shows how objects under water ($n = 1.33$) and crown glass ($n = 1.50$) appear raised by $\Delta d = t(1 - 1/n)$.
- **Tab 4 (`tir`):** *Critical Angle & Total Internal Reflection ($\sin C = 1/n$)* — compares $C = 48.8^\circ$ (water), $41.8^\circ$ (crown glass), $37.3^\circ$ (flint glass), and $24.4^\circ$ (diamond).

### 6. Section 04 (`#master`, `#archetypes`, `#myths`) · Outcomes, 6 Archetypes & 3 Flip Myths
- **6 Outcomes (`01`–`06`):** Wavefront speed & constant frequency; Snell's law & relative index; Parallel emergence ($e=i$) & lateral shift $d$; Real/apparent depth & layered slabs; Critical angle & TIR applications; Paper 3 four-pin ray tracing & 7 graph variants.
- **6 Worked Calculation Archetypes:**
  1. *Archetype 1 (Wave Speed & Wavelength):* Light of $\lambda_{\text{air}} = 600\text{ nm}$ enters crown glass ($n = 1.50$) $\implies v = 2.0 \times 10^8\text{ m s}^{-1}$, $\lambda_{\text{glass}} = 400\text{ nm}$, $f = 5.0 \times 10^{14}\text{ Hz}$ (unchanged).
  2. *Archetype 2 (Perpendicular Reflected & Refracted Rays):* Reflected and refracted rays are $90^\circ$ apart at $i = 56.3^\circ \implies r = 90^\circ - 56.3^\circ = 33.7^\circ \implies n = \tan 56.3^\circ = 1.50$.
  3. *Archetype 3 (Lateral Displacement & Far-Face Shift):* Block thickness $t = 6.0\text{ cm}$, $n = 1.50$, $i = 45^\circ \implies r = 28.1^\circ$, $d = 6.0\sin(16.9^\circ)/\cos(28.1^\circ) = 1.98\text{ cm}$, $EF = 6.0(\tan 45^\circ - \tan 28.1^\circ) = 2.80\text{ cm}$.
  4. *Archetype 4 (Multi-Layer Apparent Depth):* $8.0\text{ cm}$ of water ($n = 4/3$) above a $4.5\text{ cm}$ glass slab ($n = 1.50$) $\implies d_{\text{app}} = 8.0/(4/3) + 4.5/1.5 = 6.0 + 3.0 = 9.0\text{ cm}$ (raised by $3.5\text{ cm}$).
  5. *Archetype 5 (Two-Media Critical Angle):* Optical fibre core $n_1 = 1.50$, cladding $n_2 = 1.35 \implies C = \sin^{-1}(1.35/1.50) = 64.2^\circ$.
  6. *Archetype 6 (Glancing-Angle Practical Slope):* Angle $\theta$ measured from face $AB$ gives $\cos\theta = \sin i$, and chord ratio $\phi = MO/NO = \sin r \implies$ graph of $\cos\theta$ vs $\phi$ has slope $s = n = 1.50$.

### 7. Spaced Retrieval Bank (`html/assets/js/retrieval-bank.js`)
- `from: 0` (Prerequisites for Lesson 01):
  1. Wave speed equation $v = f\lambda$ and SI units.
  2. Speed of light in vacuum/air $c = 3.0 \times 10^8\text{ m s}^{-1}$.
  3. How angle of incidence $i$ is defined (between ray and **normal**, so $i = 90^\circ - \theta_{\text{surface}}$).
  4. Exact values of $\sin 30^\circ = 0.500$, $\sin 45^\circ = 0.707$, $\sin 60^\circ = 0.866$.
- `from: 1` (Lesson 01 cards):
  1. Complete WAEC wording of Snell's law (*"for a given pair of media"*).
  2. Why frequency $f$ stays constant while speed $v$ and wavelength $\lambda$ decrease in glass.
  3. Relative refractive index ${}_1n_2 = n_2/n_1$ and reversibility ${}_gn_a = 1/{}_an_g$.
  4. Single-surface angular deviation $\delta = |i - r|$ and perpendicular reflected-refracted rule $n = \tan i$.
- `from: 2` (Lesson 02 cards):
  1. Why emergent angle $e = i$ and net angular deviation $= 0^\circ$ for a parallel-sided glass block.
  2. Lateral displacement formula $d = \frac{t\sin(i-r)}{\cos r}$ and three factors ($t, i, n$).
  3. Why violet light undergoes a larger lateral displacement than red light in the same block.
  4. Far-face distance $EF = t(\tan i - \tan r)$ and grazing incidence ($i = 90^\circ \implies r = C$).
- `from: 3` (Lesson 03 cards):
  1. Real and apparent depth formula $n = \frac{\text{real depth}}{\text{apparent depth}}$ and upward shift $\Delta d = t(1 - 1/n)$.
  2. Why $n = \text{real}/\text{apparent}$ holds only when viewing vertically from directly above.
  3. Multi-layer apparent depth rule $d_{\text{app}} = t_1/n_1 + t_2/n_2$.
  4. How the no-parallax search-pin method locates the virtual image beside a glass block.
- `from: 4` (Lesson 04 cards):
  1. Definition of critical angle $C$ and $\sin C = 1/n$ ($C = 41.8^\circ$ for $n = 1.50$).
  2. The two mandatory WAEC conditions for total internal reflection (TIR).
  3. Why a $45^\circ$ prism periscope produces brighter, sharper images than a silvered mirror.
  4. Two-media critical angle $\sin C = n_{\text{less}}/n_{\text{more}}$ for glass-in-water or optical fibres.

---

## Part II · Detailed 5-Phase Lesson Plans (`Lesson 01` to `Lesson 05`)

---

# Lesson 01: Refraction at Plane Surfaces, Wavefront Speed & *Snell's Law* (`lessons/lesson-01/`)

- **Eyebrow:** `SS2 Physics · Lesson 1 of 5 · 80 minutes`
- **Driving Question:** *Why does a laser beam bend towards the normal when entering glass at an angle, yet pass straight through without bending along the normal?*
- **Learning Objectives:**
  1. **01** · Define **refraction** and explain why a change in wave speed ($c \to v$) causes an oblique wavefront to pivot at an optical boundary.
  2. **02** · Distinguish **optical density** from mass density, and identify what changes ($v, \lambda$, direction) versus what remains **constant (frequency $f$)** during refraction.
  3. **03** · State the **two laws of refraction** (including *"for a given pair of media"*) and apply $n = \frac{\sin i}{\sin r} = \frac{c}{v} = \frac{\lambda_{\text{air}}}{\lambda_{\text{medium}}}$.
  4. **04** · Calculate **relative refractive index** (${}_1n_2 = \frac{n_2}{n_1}$), apply **reversibility** (${}_gn_a = \frac{1}{{}_an_g}$), and solve the $90^\circ$ reflected–refracted ray condition ($n = \tan i$).
  5. **05** · State the **three WAEC-accepted physical meanings** of the statement *"the refractive index of crown glass is $1.50$"*.

### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 prerequisite flashcards from `retrieval-bank.js` (`from: 0`).

### Phase 1 · Wonder (`#story` & `#wonder` · 10 min)
- **3D Story Scene (`story.js` — "Kemi's Yaba Laser Bench Surprise"):**
  - **Beat 1:** At Danjuma Precision Optics in Yaba, Kemi shines a green laser ($540\text{ nm}$) straight down along the normal ($i = 0^\circ$) into a crown-glass slab ($n = 1.50$). The beam enters without any change in direction ($r = 0^\circ$), even though its speed drops from $3.0 \times 10^8\text{ m s}^{-1}$ to $2.0 \times 10^8\text{ m s}^{-1}$.
  - **Beat 2:** Chidi tilts the laser to $i = 45^\circ$ from the normal. Inside the glass, the beam swings sharply **towards the normal** to $r = 28.1^\circ$ (deviating by $\delta = i - r = 16.9^\circ$ at the top boundary)!
  - **Beat 3:** Engr. Danjuma challenges them: *"Why did the beam bend at $45^\circ$ when it didn't bend at $0^\circ$? And if the light slowed down by a factor of $1.5$, why didn't its green colour (frequency) change?"*
- **Wonder Wall (`#wonder`):**
  - Seeds: *"Why does frequency stay constant when light slows down in glass?"*, *"Is optical density the same as mass density?"*, *"Why must we say 'for a given pair of media' in Snell's law?"*, *"How do we find $n$ if the reflected and refracted rays are $90^\circ$ apart?"*

### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **2A. Interactive Sort Game (`#sort`):**
  - Classify 10 cards into 3 bins:
    1. `shm` → **Invariant / Unchanged on Refraction** (Wave frequency $f$, Wave period $T = 1/f$, Ratio $\sin i / \sin r$ for a fixed media pair, Direction of a ray along the normal $i = 0^\circ$)
    2. `periodic` → **Decreases When Entering Denser Medium ($\text{Air} \to \text{Glass}$)** (Wave speed $v = c/n$, Wavelength $\lambda = \lambda_{\text{air}}/n$, Angle to the normal $r < i$)
    3. `non` → **Relative Index & Direction Rules** (Bends *away* from normal going $\text{Glass} \to \text{Air}$, Reversibility ${}_gn_a = 1/{}_an_g$, Paraffin/kerosene is less mass-dense than water but *optically denser*)
- **2B. 3D Virtual Practical (`bench.js` — 3D Snell's Law Laser & Multi-Media Refraction Bench):**
  - **Controls:**
    - Medium selector (`Water n = 1.33`, `Crown Glass n = 1.50`, `Flint Glass n = 1.65`, `Diamond n = 2.42`)
    - Angle of incidence slider $i$ (`0°` to `75°`, step `5°`)
    - Ray reversal toggle (`Air → Medium` vs `Medium → Air` reversibility check)
  - **Live Readouts:** `Angle i`, `Refracted r`, `sin i / sin r (= n)`, `Single-Face Deviation δ = |i − r|`, `Speed v in Medium`.
  - **Interactive Lab Notebook Table (`#results-table`):** 6 trials across angles and media where students match $\sin i$, $\sin r$, $r$, and speed $v$.

### Active Movement Break (`#movement-break` · 2 min at 45-min mark)
- **The Marching Wavefront Soldier Drill:** Stand up with two arms outstretched like a wavefront! Walk forward in air; let your right shoulder cross an imaginary boundary into glass first and slow down while your left shoulder keeps moving at air speed for one more step — feel your whole body pivot **towards the normal**!

### Phase 3 · Make Sense (`#concepts` & `#neutralise` · 15 min)
- **4 Core Concept Cards:**
  1. *Wavefront Cause & Invariant Frequency:* Why oblique wavefronts pivot; $v = f\lambda$ with $f$ fixed by the source so $n = \frac{c}{v} = \frac{\lambda_{\text{air}}}{\lambda_{\text{medium}}}$.
  2. *The Two Laws of Refraction & Examiner Warning:* Coplanar rays/normal + Snell's law ($\frac{\sin i}{\sin r} = \text{constant}$ **for a given pair of media**).
  3. *Relative Refractive Index & Reversibility:* ${}_1n_2 = \frac{n_2}{n_1} = \frac{v_1}{v_2} = \frac{\lambda_1}{\lambda_2}$ and ${}_gn_a = \frac{1}{{}_an_g}$ (plus why $n$ is dimensionless).
  4. *Three WAEC-Accepted Meanings of "$n = 1.50$":* Speed ratio ($c/v = 1.50$), sine ratio ($\sin i_{\text{air}}/\sin r_{\text{glass}} = 1.50$), and wavelength ratio ($\lambda_{\text{air}}/\lambda_{\text{glass}} = 1.50$).
- **Interactive Pin Explorer (`#ph-track`):** 6 pins across optical media (`Air 1.00`, `Water 1.33`, `Kerosene 1.44`, `Crown Glass 1.50`, `Flint Glass 1.65`, `Diamond 2.42`).
- **3D Concept Zoom (`zoom.js` — 3D Marching Wavefront & Wavelength Compression Stage):**
  - Modes: `1. Oblique Wavefront Pivot (i = 45°)`, `2. Normal Incidence (i = 0°, No Bend)`, `3. Wavelength Compression (600 nm → 400 nm at Fixed f)`.

### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **4 Step-by-Step Worked Examples:**
  1. *Snell's Law & Single-Surface Deviation:* Ray in air strikes glass ($n = 1.50$) at $i = 50^\circ$ — find $r$ ($30.7^\circ$) and single-face deviation $\delta = i - r$ ($19.3^\circ$).
  2. *Wave Speed, Wavelength & Unchanged Frequency:* Monochromatic light of $\lambda_{\text{air}} = 585\text{ nm}$ enters glass ($n = 1.50$) — find $f$ ($5.13 \times 10^{14}\text{ Hz}$), $v_{\text{glass}}$ ($2.00 \times 10^8\text{ m s}^{-1}$), and $\lambda_{\text{glass}}$ ($390\text{ nm}$).
  3. *Relative Refractive Index Between Water and Glass:* Given ${}_an_w = 4/3$ and ${}_an_g = 3/2$, find ${}_wn_g = 9/8 = 1.125$, ${}_gn_w = 8/9 = 0.889$, and refraction angle when light goes from water into glass at $35^\circ$.
  4. *Glancing Angle vs Normal Angle Trap:* A ray makes $30^\circ$ with the **surface** of a block of $n = 1.50$ — find $i = 90^\circ - 30^\circ = 60^\circ$ and $r = 35.3^\circ$.
- **The Bridge (`#bridge` — The $90^\circ$ Reflected–Refracted Brewster Trap):**
  - Challenge: A laser beam in air strikes a glass block at $i = 58.0^\circ$ such that the reflected ray and the refracted ray are **perpendicular ($90^\circ$ apart)**. Since $i + 90^\circ + r = 180^\circ \implies r = 90^\circ - i$, so $n = \frac{\sin i}{\sin(90^\circ - i)} = \tan i = \tan 58.0^\circ = \mathbf{1.60}$!
- **12-Question Instant-Feedback Quiz (`#quiz`):** Rendered from `03-questions.md` (Lesson 01 bank).

### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + home)
- 5 self-rating statements (`1–4`) covering competences `L1, L4, L5`.
- 30-Mark Locked Assignment (3 structured 10-mark tasks: Laws of Refraction & 3 Meanings of $n$; Speed, Wavelength & Time-of-Flight across a Slab; Relative Index & Perpendicular Reflection–Refraction).

---

# Lesson 02: Path Through a Rectangular Glass Block, Lateral Displacement & *Dispersion* (`lessons/lesson-02/`)

- **Eyebrow:** `SS2 Physics · Lesson 2 of 5 · 80 minutes`
- **Driving Question:** *Why does a light ray emerge from a parallel-sided glass block completely parallel to its original path ($e = i$), and what controls how far sideways ($d$) it is shifted?*
- **Learning Objectives:**
  1. **01** · Trace the path of a ray through a **parallel-sided rectangular glass block** and prove algebraically using Snell's law and alternate interior angles that **$e = i$** (net angular deviation $= 0^\circ$).
  2. **02** · Distinguish **single-surface angular deviation** ($\delta_1 = i - r$) from **total angular deviation** across a parallel-sided block ($0^\circ$).
  3. **03** · Define **lateral displacement ($d$)**, derive $d = \frac{t\sin(i - r)}{\cos r}$ and the WAEC 2023 far-face shift $EF = t(\tan i - \tan r)$, and solve numerical problems.
  4. **04** · Explain the **three factors** that increase lateral displacement ($t, i, n$) and explain why **violet light is displaced further sideways than red light**.
  5. **05** · Sketch and calculate the ray path at **normal incidence ($i = 0^\circ$)** and **grazing incidence ($i = 90^\circ \implies r = C = 41.8^\circ$)**.

### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval flashcards from Lesson 01 (`from: 1`).

### Phase 1 · Wonder (`#story` & `#wonder` · 10 min)
- **3D Story Scene (`story.js` — "Kemi's $1.98\text{ cm}$ Sideways Laser Shift"):**
  - **Beat 1:** Kemi aligns her green laser directly with a photodiode detector $30\text{ cm}$ away. When she places the $6.0\text{ cm}$ thick crown-glass block ($n = 1.50$) squarely in the path ($i = 0^\circ$), the beam hits the bullseye with zero shift ($d = 0$).
  - **Beat 2:** She rotates the block so $i = 45^\circ$. The emergent ray leaves the back face at $e = 45^\circ$ — parallel to the incoming beam! — yet misses the photodiode bullseye by **$1.98\text{ cm}$ sideways**!
  - **Beat 3:** When Chidi switches the laser from red ($650\text{ nm}$) to violet ($405\text{ nm}$) at the same $45^\circ$ angle, the violet spot lands even further sideways than the red spot!
- **Wonder Wall (`#wonder`):**
  - Seeds: *"How can a ray bend twice yet have $0^\circ$ total angular deviation?"*, *"Why does $d = t\sin(i-r)/\cos r$ contain $\cos r$ in the denominator?"*, *"Why does violet light shift more sideways than red light?"*, *"What happens if a ray skims the top face at $i = 90^\circ$?"*

### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **2A. Interactive Sort Game (`#sort`):**
  - Classify 10 cards into 3 bins:
    1. `shm` → **Parallel Emergence & Deviation Rules** (Emergent angle $e = i$, Net angular deviation across parallel-sided block $= 0^\circ$, Deviation at first face alone $= i - r$, Proof: $\frac{\sin i}{\sin r} \times \frac{\sin r}{\sin e} = n \times \frac{1}{n} = 1$)
    2. `periodic` → **Lateral Displacement ($d$) & Far-Face Shift ($EF$)** (Perpendicular distance $d = \frac{t\sin(i-r)}{\cos r}$, Internal ray path length $NO = \frac{t}{\cos r}$, Distance along far face $EF = t(\tan i - \tan r)$)
    3. `non` → **Factors Increasing Shift & Limiting Angles** (Thicker block $t$, Larger angle $i$, Higher index $n$ so Violet $>$ Red, Normal incidence $i = 0^\circ \implies d = 0$, Grazing incidence $i = 90^\circ \implies r = C$ and $d \to t$)
- **2B. 3D Virtual Practical (`bench.js` — 3D Rectangular Glass Block Lateral Shift & Far-Face Bench):**
  - **Controls:**
    - Block width $t$ slider (`4.0 cm` to `10.0 cm`, default `6.0 cm`)
    - Incidence angle $i$ slider (`0°` to `80°`, default `45°`)
    - Wavelength / Material selector (`Crown Glass Red n=1.50`, `Crown Glass Violet n=1.53`, `Flint Glass n=1.65`)
  - **Live Readouts:** `Refracted r & Emergent e`, `Internal Path NO = t/cos r`, `Lateral Shift d`, `Far-Face Shift EF = t(tan i − tan r)`, `Net Angular Deviation (0.0°)`.
  - **Interactive Lab Notebook Table (`#results-table`):** 6 configurations matching $r$, $d$, and $EF = t(\tan i - \tan r)$ (modelling WASSCE 2023 Alternative A).

### Active Movement Break (`#movement-break` · 2 min at 45-min mark)
- **The Parallel Side-Step ("Bend In, Walk Across, Bend Back"):** Stand facing the front wall! Turn $20^\circ$ right as you step onto a rug (Face 1: bend towards normal), take two straight steps across the rug, then turn $20^\circ$ left as you step off the rug (Face 2: bend away from normal). You are facing the exact same direction as when you started ($e = i$), shifted sideways by $d$!

### Phase 3 · Make Sense (`#concepts` & `#neutralise` · 15 min)
- **4 Core Concept Cards:**
  1. *Proof of Parallel Emergence ($e = i$):* Alternate interior angles between parallel normals ($r_2 = r_1 = r$) and $\frac{\sin i}{\sin r}\cdot\frac{\sin r}{\sin e} = n\cdot\frac{1}{n} = 1 \implies e = i$ (zero net angular deviation).
  2. *Derivation of Lateral Displacement ($d$):* In right-angled $\triangle NMO$, internal hypotenuse $NO = \frac{t}{\cos r}$; in right-angled $\triangle NOP$, $d = NO\sin(i - r) = \frac{t\sin(i - r)}{\cos r}$.
  3. *WAEC 2023 Far-Face Distance ($EF$):* On the bottom face $DC$, $MF = t\tan i$ and $ME = t\tan r \implies EF = MF - ME = t(\tan i - \tan r)$. Plotting $EF$ against $V = \tan i - \tan r$ has **slope $= t$ (block width)**.
  4. *Colour Dispersion & Grazing Incidence ($i = 90^\circ$):* Since $n_{\text{violet}} > n_{\text{red}}$, $r_{\text{violet}} < r_{\text{red}}$, making $(i - r)$ and $d$ larger for violet. At $i = 90^\circ$, $r = C = 41.8^\circ$ and $e = 90^\circ$.
- **Interactive Pin Explorer (`#ph-track`):** 6 pins tracing $i = 0^\circ, 20^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$ through a $6.0\text{ cm}$ block.
- **3D Concept Zoom (`zoom.js` — 3D Triangles $NMO$/$NOF$ & Red-vs-Violet Dispersion Zoom):**
  - Modes: `1. Triangle Geometry (d vs EF)`, `2. Red vs Violet Sideways Split`, `3. Grazing Incidence (i = 90° → r = 41.8°)`.

### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **4 Step-by-Step Worked Examples:**
  1. *Calculating Lateral Displacement $d$:* Block thickness $t = 8.0\text{ cm}$, $n = 1.50$, $i = 40^\circ \implies r = 25.4^\circ$, $d = 8.0\sin(14.6^\circ)/\cos(25.4^\circ) = 2.23\text{ cm}$.
  2. *WAEC 2023 Far-Face Shift $EF$ & Graph Slope:* Block width $w = 6.0\text{ cm}$, $n = 1.50$, $i = 30^\circ \implies r = 19.5^\circ$, $V = \tan 30^\circ - \tan 19.5^\circ = 0.223$, $EF = 6.0 \times 0.223 = 1.34\text{ cm}$; slope of $EF$ vs $V$ equals $6.0\text{ cm}$.
  3. *JAMB Angular Deviation Distractor Trap:* Ray strikes a parallel-sided glass block ($n = 1.50$) at $i = 35^\circ$. Find the angle of deviation at the *first surface* ($35^\circ - 22.5^\circ = 12.5^\circ$) versus the *total angular deviation of the emergent ray* ($0^\circ$).
  4. *Time Taken for Oblique Ray Inside the Block:* For $t = 6.0\text{ cm}, n = 1.50, i = 45^\circ \implies r = 28.1^\circ$, path length $NO = 6.0/\cos 28.1^\circ = 6.80\text{ cm}$, time $t_{\text{flight}} = 0.0680 / (2.0 \times 10^8) = 3.40 \times 10^{-10}\text{ s}$.
- **The Bridge (`#bridge` — Solving Kemi's $1.98\text{ cm}$ Sensor Alignment Shift):**
  - Challenge: Calculate the exact lateral displacement $d$ when Kemi's laser strikes the $t = 6.0\text{ cm}$ glass block ($n = 1.50$) at $i = 45^\circ$ ($r = 28.1^\circ \implies d = \mathbf{1.98\text{ cm}}$).
- **12-Question Instant-Feedback Quiz (`#quiz`):** Lesson 02 bank.

### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + home)
- 5 self-rating statements (`1–4`) covering competences `L1, L4, L6`.
- 30-Mark Locked Assignment (Proof of $e = i$ & Derivation of $d$; Numerical Calculation of $d$, $NO$, and $EF$; Dispersion & Grazing Incidence Analysis).

---

# Lesson 03: Real & Apparent Depth, Multi-Layer Slabs & *The No-Parallax Method* (`lessons/lesson-03/`)

- **Eyebrow:** `SS2 Physics · Lesson 3 of 5 · 80 minutes`
- **Driving Question:** *Why does a stamp under a $6.0\text{ cm}$ glass block appear floating $2.0\text{ cm}$ above the table, and how can two pins measure refractive index without any protractor?*
- **Learning Objectives:**
  1. **01** · Explain with a ray diagram why a submerged object viewed vertically from above appears **raised** at a virtual image $I$ higher than the real object $O$.
  2. **02** · Derive (using small-angle paraxial geometry $\sin\theta \approx \tan\theta$) and apply $n = \frac{\text{Real depth } (t)}{\text{Apparent depth } (d_{\text{app}})}$ and explain why the formula requires **vertical viewing**.
  3. **03** · Derive and apply **apparent upward displacement** $\Delta d = t - d_{\text{app}} = t\left(1 - \frac{1}{n}\right)$.
  4. **04** · Calculate total apparent depth across **multi-layer transparent media** ($d_{\text{app}} = \frac{t_1}{n_1} + \frac{t_2}{n_2}$) and locate an air bubble viewed from opposite faces of a glass block.
  5. **05** · Describe and execute the **no-parallax search-pin experiment** to determine the refractive index of a glass block or liquid.

### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval flashcards from Lessons 01–02 (`from: 1, 2`).

### Phase 1 · Wonder (`#story` & `#wonder` · 10 min)
- **3D Story Scene (`story.js` — "Chidi's Floating Serial Stamp & The Lekki Fish Pool"):**
  - **Beat 1:** At the Yaba workshop, Chidi looks straight down through the $6.0\text{ cm}$ crown-glass block ($n = 1.50$) at an engraved serial cross on the table. When he reaches his finger along the outside of the block to touch the level of the cross, his finger stops **$2.0\text{ cm}$ above the table** ($4.0\text{ cm}$ below the top surface)!
  - **Beat 2:** Kemi holds a brass search pin horizontally beside the block and moves her head left and right. At $4.0\text{ cm}$ below the top face, the search pin and the virtual image of the cross stay locked together with **zero parallax**!
  - **Beat 3:** Engr. Danjuma warns them: *"This same illusion makes a $2.4\text{ m}$ deep pond look only $1.8\text{ m}$ deep from above — and what happens when we pour a layer of water on top of a glass floor?"*
- **Wonder Wall (`#wonder`):**
  - Seeds: *"Why do rays from a submerged coin bend away from the normal at the top surface?"*, *"Why does $n = \text{real}/\text{apparent}$ fail if you look from the side?"*, *"How do we add apparent depths when water sits on top of glass?"*, *"What does 'no parallax' mean when moving your head sideways?"*

### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **2A. Interactive Sort Game (`#sort`):**
  - Classify 10 cards into 3 bins:
    1. `shm` → **Real vs Apparent Depth & Upward Shift** ($n = \text{Real depth} \div \text{Apparent depth}$, Upward shift $\Delta d = t(1 - 1/n)$, Virtual image $I$ lies directly above object $O$, Valid only for vertical viewing where $\sin\theta \approx \tan\theta$)
    2. `periodic` → **Multi-Layer Slabs & Trapped Bubbles** (Multi-layer rule $d_{\text{app}} = t_1/n_1 + t_2/n_2$, Bubble real depths from opposite faces add to total block thickness $t = d_{\text{real,1}} + d_{\text{real,2}}$, Looking from air into glass makes $d_{\text{app}} < d_{\text{real}}$)
    3. `non` → **No-Parallax Search-Pin Practical** (Hold search pin beside block and move head left/right until image and pin do not separate, Measure $d_{\text{app}}$ from **top face** down to search pin, Plot $d_{\text{real}}$ vs $d_{\text{app}}$ to get slope $= n$)
- **2B. 3D Virtual Practical (`bench.js` — 3D No-Parallax Search-Pin & Layered-Tank Depth Bench):**
  - **Controls:**
    - Setup selector (`Crown Glass Block t=6.0cm, n=1.50`, `Thick Glass Block t=12.0cm, n=1.50`, `Water Tank t=16.0cm, n=1.33`, `Layered: 8cm Water + 6cm Glass`)
    - Search-pin depth slider $z_{\text{pin}}$ from top surface (`1.0 cm` to `15.0 cm`)
    - Observer head-sway slider (`Left −15°` to `Right +15°`) to visually test parallax shift between the search pin and the virtual image!
    - **"🎯 Snap Pin to No-Parallax Point"** button
  - **Live Readouts:** `Real Depth t`, `Search Pin Depth`, `Parallax Error Gap`, `True Apparent Depth d_app`, `Upward Shift Δd = t − d_app`.
  - **Interactive Lab Notebook Table (`#results-table`):** 6 depth & layered-slab trials.

### Active Movement Break (`#movement-break` · 2 min at 45-min mark)
- **The Two-Finger Parallax Check:** Hold your left index finger $20\text{ cm}$ in front of your nose and your right index finger $40\text{ cm}$ away. Sway your head left and right — see them split apart (parallax)! Now bring both fingers to the exact same distance and sway your head — they move together with **zero parallax**!

### Phase 3 · Make Sense (`#concepts` & `#neutralise` · 15 min)
- **4 Core Concept Cards:**
  1. *Paraxial Derivation of $n = \text{Real} / \text{Apparent}$:* Rays leaving denser medium bend away from normal ($\sin i / \sin r = n$, with $i$ in air and $r$ in medium). For vertical viewing ($i, r$ small), $\sin i \approx \tan i = x/AI$ and $\sin r \approx \tan r = x/AO \implies n = AO/AI = \text{real depth}/\text{apparent depth}$.
  2. *Apparent Displacement (Upward Shift $\Delta d$):* $\Delta d = t - d_{\text{app}} = t - \frac{t}{n} = t\left(1 - \frac{1}{n}\right)$. Exam trap: always check whether the question gives $d_{\text{app}}$ or $\Delta d$!
  3. *Multi-Layer Transparent Media & Internal Air Bubbles:* For immiscible layers, $d_{\text{app}} = \frac{t_1}{n_1} + \frac{t_2}{n_2} + \dots$; for an air bubble inside a block of thickness $t$, $d_{\text{real,AB}} + d_{\text{real,DC}} = n(d_{\text{app,AB}} + d_{\text{app,DC}}) = t$.
  4. *The No-Parallax Pin Experiment:* Step-by-step WAEC procedure and why $d_{\text{app}}$ is measured from the **top surface** down to the search pin.
- **Interactive Pin Explorer (`#ph-track`):** 6 depth scenarios (`6cm Glass`, `12cm Glass`, `2.4m Pool`, `130cm Tank`, `Water+Glass Layer`, `15cm Bubble Block`).
- **3D Concept Zoom (`zoom.js` — 3D Virtual-Image Ray Cone & Backward Extension Stage):**
  - Modes: `1. Vertical Viewing (Rays Converge at Virtual Image I)`, `2. Multi-Layer Double Bend (Water + Glass)`, `3. Oblique Viewing Breakdown`.

### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **4 Step-by-Step Worked Examples:**
  1. *Upward Shift Given (WAEC Classic):* The bottom of a tank $3.6\text{ m}$ deep appears raised by $0.9\text{ m}$ when viewed vertically — find $d_{\text{app}} = 3.6 - 0.9 = 2.7\text{ m}$ and $n = 3.6/2.7 = 1.33$.
  2. *Apparent Displacement of a Coin:* A coin lies at the bottom of a beaker containing liquid ($n = 1.60$) to a depth of $24.0\text{ cm}$ — find $d_{\text{app}} = 15.0\text{ cm}$ and upward displacement $\Delta d = 9.0\text{ cm}$.
  3. *Composite Water-Over-Glass Layer:* A mark lies beneath a $9.0\text{ cm}$ crown-glass slab ($n = 1.50$) covered by $12.0\text{ cm}$ of water ($n = 4/3$) — find total apparent depth ($9.0/1.5 + 12.0/(4/3) = 6.0 + 9.0 = 15.0\text{ cm}$) and total upward shift ($21.0 - 15.0 = 6.0\text{ cm}$).
  4. *Air Bubble Inside a $18.0\text{ cm}$ Glass Block ($n = 1.50$):* Viewed from face $AB$, a trapped bubble appears $5.0\text{ cm}$ deep — find its true distance from $AB$ ($7.5\text{ cm}$) and its apparent depth when viewed from the opposite face $DC$ ($(18.0 - 7.5)/1.50 = 7.0\text{ cm}$).
- **The Bridge (`#bridge` — The Raised vs Apparent Depth Exam Trap):**
  - Challenge: A rectangular glass block is $10.0\text{ cm}$ thick, and a mark underneath appears **raised by $4.0\text{ cm}$** when viewed from directly above. What is the refractive index $n$ of the glass? (Students must compute $d_{\text{app}} = 10.0 - 4.0 = 6.0\text{ cm} \implies n = 10.0/6.0 = \mathbf{1.67}$, avoiding the trap $10.0/4.0 = 2.50$!).
- **12-Question Instant-Feedback Quiz (`#quiz`):** Lesson 03 bank.

### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + home)
- 5 self-rating statements (`1–4`) covering competences `L1, L3, L4`.
- 30-Mark Locked Assignment (Paraxial Derivation of $n = \text{real}/\text{apparent}$; Multi-Layer & Air-Bubble Calculations; No-Parallax Experiment Design & Precautions).

---

# Lesson 04: Critical Angle, Total Internal Reflection & *Optical Fibre Engineering* (`lessons/lesson-04/`)

- **Eyebrow:** `SS2 Physics · Lesson 4 of 5 · 80 minutes`
- **Driving Question:** *How can clear transparent glass reflect $100\%$ of a laser beam without any silver coating — and why can total internal reflection never occur when light goes from air into glass?*
- **Learning Objectives:**
  1. **01** · Define **critical angle ($C$)** and **total internal reflection (TIR)**, and state the **two mandatory WAEC conditions** for TIR.
  2. **02** · Derive and apply $\sin C = \frac{1}{n}$ (medium to air), $\sin C = \frac{v_{\text{medium}}}{c}$, and $\sin C = \frac{n_{\text{less}}}{n_{\text{more}}}$ (between any two media such as glass and water or optical fibre core and cladding).
  3. **03** · Explain why TIR is **impossible when light travels from a less dense to a denser medium** (e.g. air to glass) and why a pin on face $AB$ of a glass block ($n = 1.60$) cannot be seen through adjacent face $AD$.
  4. **04** · Explain the physics and advantages of **$45^\circ$ prism periscopes/binoculars** over silvered mirrors, **telecommunication optical fibres**, **diamond sparkle ($C = 24.4^\circ$)**, and **hot-road mirages**.

### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval flashcards from Lessons 01–03 (`from: 1, 2, 3`).

### Phase 1 · Wonder (`#story` & `#wonder` · 10 min)
- **3D Story Scene (`story.js` — "Engr. Danjuma's Mirror-Glass & The Lagos Subsea Fibre Cable"):**
  - **Beat 1:** Engr. Danjuma aims a laser from *inside* the crown-glass block ($n = 1.50$) towards the top glass-to-air face at $\theta = 30^\circ$. The beam escapes into the air, bending sharply away from the normal to $e = 48.6^\circ$.
  - **Beat 2:** Kemi increases the internal angle to exactly $\theta = 41.8^\circ$. Suddenly the emergent ray skims right along the glass surface at $90^\circ$ to the normal ($r = 90^\circ$ — the **critical angle $C$**)!
  - **Beat 3:** At $\theta = 45^\circ$, zero light escapes into the air — $100\%$ of the beam reflects back inside the block! Engr. Danjuma holds up a strand of optical fibre carrying high-speed internet into Lagos: *"That exact same trap guides laser pulses thousands of kilometres under the Atlantic Ocean!"*
- **Wonder Wall (`#wonder`):**
  - Seeds: *"What are the two exact conditions WAEC requires for TIR?"*, *"Why can't TIR happen when light goes from air into glass?"*, *"How do we find the critical angle between glass ($1.50$) and water ($1.33$)?"*, *"Why does a $45^\circ$ glass prism beat a silvered mirror in a periscope?"*

### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **2A. Interactive Sort Game (`#sort`):**
  - Classify 10 cards into 3 bins:
    1. `shm` → **Critical Angle ($C$) & Two-Media Formula** (Angle in denser medium where $r = 90^\circ$, $\sin C = 1/n$ for medium to air, Crown glass $n = 1.50 \implies C = 41.8^\circ$, Two-media rule $\sin C = n_{\text{less}}/n_{\text{more}}$)
    2. `periodic` → **Mandatory Conditions for Total Internal Reflection** (Condition 1: Light must travel from optically **denser to less dense** medium, Condition 2: Angle of incidence in denser medium must **exceed $C$** ($\theta > C$), Impossible from air into glass because $r < i < 90^\circ$)
    3. `non` → **Engineering & Natural Applications of TIR** (Optical fibre with $n_{\text{core}} > n_{\text{cladding}}$, $45^\circ$ prism periscope with $100\%$ reflection and zero ghost images, Hot-road mirage where warm air near asphalt has lower $n$ than cool air above)
- **2B. 3D Virtual Practical (`bench.js` — 3D Critical-Angle & Optical-Fibre Core/Cladding Bench):**
  - **Controls:**
    - Boundary selector (`Crown Glass (1.50) → Air`, `Water (1.33) → Air`, `Flint Glass (1.65) → Air`, `Diamond (2.42) → Air`, `Glass (1.50) → Water (1.33)`, `Optical Fibre Core (1.50) → Cladding (1.38)`)
    - Internal incidence angle $\theta$ slider (`5°` to `75°`, step `0.5°`)
    - **"🎯 Snap to Critical Angle C"** button
  - **Live Readouts:** `Boundary n₁ → n₂`, `Critical Angle C`, `Current Angle θ`, `Refracted / Reflected Angle`, `Optical Regime (Refraction / Grazing / 100% TIR)`.
  - **Interactive Lab Notebook Table (`#results-table`):** 6 boundary and angle trials.

### Active Movement Break (`#movement-break` · 2 min at 45-min mark)
- **The Three-Angle Arm Sweep ($\theta < C$, $\theta = C$, $\theta > C$):** Stand up! Raise your right arm at $30^\circ$ to the vertical normal and point your left arm higher out into the air ($\theta < C$: refraction). Now set your right arm to $41.8^\circ$ and stretch your left arm horizontally along your desk ($\theta = C$: grazing emergence at $90^\circ$). Now tilt your right arm to $50^\circ$ and snap your left arm downward at $50^\circ$ inside the glass ($\theta > C$: Total Internal Reflection)!

### Phase 3 · Make Sense (`#concepts` & `#neutralise` · 15 min)
- **4 Core Concept Cards:**
  1. *Critical Angle & $\sin C = n_{\text{less}}/n_{\text{more}}$:* At $\theta = C$, Snell's law $n_1\sin C = n_2\sin 90^\circ = n_2 \implies \sin C = \frac{n_2}{n_1}$ (or $\frac{1}{n}$ into air, and $\sin C = \frac{v}{c}$).
  2. *The Two Mandatory WAEC Conditions for TIR:* (1) Light must travel from an optically denser medium to an optically less dense medium; (2) The angle of incidence in the denser medium must be greater than the critical angle ($\theta > C$).
  3. *Why $45^\circ$ Prism Periscopes Beat Silvered Mirrors:* In crown glass ($C = 41.8^\circ$), a ray hitting a $45^\circ$ hypotenuse strikes at $45^\circ > 41.8^\circ$, giving $100\%$ reflection with no silvering to tarnish/peel and no multiple faint ghost images from front-surface reflection.
  4. *Optical Fibres, Diamonds & Highway Mirages:* Core ($n_1$) vs cladding ($n_2 < n_1$); diamond's tiny $C = 24.4^\circ$; hot road air (lower $n$) beneath cool air (higher $n$) bending sky rays upward by TIR.
- **Interactive Pin Explorer (`#ph-track`):** 6 critical-angle benchmarks (`Diamond 24.4°`, `Flint 37.3°`, `Crown 41.8°`, `Water 48.8°`, `Glass→Water 62.5°`, `Fibre Core→Cladding 66.9°`).
- **3D Concept Zoom (`zoom.js` — 3D $45^\circ$ Prism Periscope vs Ghost-Image Mirror & Highway Mirage Zoom):**
  - Modes: `1. 45° Prism Periscope (100% Clean TIR)`, `2. Thick Silvered Mirror (Multiple Ghost Reflections)`, `3. Hot Nigerian Highway Mirage`.

### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **4 Step-by-Step Worked Examples:**
  1. *Critical Angle & Wave Speed from $C$:* A transparent medium has critical angle $C = 30^\circ$ in air — find $n = 1/\sin 30^\circ = 2.00$ and speed of light in the medium $v = 3.0 \times 10^8 / 2.00 = 1.50 \times 10^8\text{ m s}^{-1}$.
  2. *Glass-to-Water Interface Test ($50^\circ, 60^\circ, 65^\circ$):* Light inside glass ($n_1 = 1.50$) strikes a boundary with water ($n_2 = 1.33$). Find $C = \sin^{-1}(1.33/1.50) = 62.5^\circ$, refraction angle at $\theta = 50^\circ$ ($r = 59.8^\circ$), and explain why $\theta = 65^\circ$ undergoes TIR.
  3. *Optical Fibre Core & Cladding:* An optical fibre has core index $n_{\text{core}} = 1.55$ and cladding index $n_{\text{clad}} = 1.40$ — find the critical angle at the core–cladding wall ($C = \sin^{-1}(1.40/1.55) = 64.6^\circ$).
  4. *Adjacent-Face Pin Visibility in a Rectangular Block:* A pin is placed against the midpoint of face $AB$ of a glass block ($n = 1.60, C = 38.7^\circ$) and viewed through the perpendicular side face $AD$ — prove that rays hitting $AD$ meet it at $\theta > 38.7^\circ$ and undergo TIR so the pin cannot be seen through $AD$.
- **The Bridge (`#bridge` — Solving Engr. Danjuma's $45^\circ$ Internal Beam & Adjacent-Face Mystery):**
  - Challenge: A ray inside a rectangular glass block ($n = 1.50$) strikes the glass–air boundary at an angle of incidence of $45.0^\circ$. Pick the exact outcome and critical angle ($C = 41.8^\circ$; since $45.0^\circ > 41.8^\circ$, **Total Internal Reflection** occurs at $45.0^\circ$!).
- **12-Question Instant-Feedback Quiz (`#quiz`):** Lesson 04 bank.

### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + home)
- 5 self-rating statements (`1–4`) covering competences `L1, L5, L6, L7`.
- 30-Mark Locked Assignment (Conditions for TIR & Critical Angle Calculations; Optical Fibre & Two-Media TIR; Prism Periscopes, Mirages & Adjacent-Face Block Proof).

---

# Lesson 05: WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical & *The 7 Graph Variants* (`lessons/lesson-05/`)

- **Eyebrow:** `SS2 Physics · Lesson 5 of 5 (Unit Finale!) · 80 minutes`
- **Driving Question:** *How do you score full marks on any WAEC or NECO glass-block practical — even when the examiner measures angles from the block face or asks you to plot chord lengths?*
- **Learning Objectives:**
  1. **01** · Execute the **10-step four-pin rectangular glass block practical** ($P_1, P_2, P_3, P_4$), aligning the **bases** of the pins and using a **separate outline for each trace** with arrows on all rays.
  2. **02** · Apply the **Glancing-Angle Key Rule**: when an angle $\theta$ is measured from the **face** of the block instead of the normal, $i = 90^\circ - \theta$ so **$\cos\theta = \sin i$**.
  3. **03** · Decode all **7 official WAEC Paper 3 graph variants** ($\sin i$ vs $\sin r \implies s = n$; $\cos\theta$ vs $\phi = MO/NO \implies s = n$; $d$ vs $V = \tan i - \tan r \implies s = w$; $LE$ vs $LN \implies K = 1/s = n$; internal-ray $\cos\theta$ vs $\sin i \implies s = n$; mirror-backed block $\cos(\theta/2)$; triangle ratio $\mu = BC/AC$).
  4. **04** · Format composite practical tables to **WAEC marking standards** (units in every column header, lengths in $\text{cm}$ to **1 d.p.**, trig ratios to **3 d.p.**) and calculate slope from a large triangle.
  5. **05** · Distinguish acceptable **past-tense precautions** (*"I ensured the optical pins were vertical"*, *"I spaced the pins $4\text{ to }5\text{ cm}$ apart"*) from **sources of error**.

### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval flashcards from Lessons 01–04 (`from: 1, 2, 3, 4`).

### Phase 1 · Wonder (`#story` & `#wonder` · 10 min)
- **3D Story Scene (`story.js` — "Paper 3 Dress Rehearsal & Closing the Yaba Case File"):**
  - **Beat 1:** It is the eve of the WAEC Physics Paper 3 practical exam. Chidi shows Engr. Danjuma his practice sheet: he drew all five ray traces inside a single block outline, spaced pins $P_1$ and $P_2$ only $1.5\text{ cm}$ apart, lined up the *tops* of tilted pins, and rounded $\sin i$ to $1\text{ d.p.}$!
  - **Beat 2:** Kemi spots a second trap on the question paper: the examiner gave the incident angle $\theta = 60^\circ$ measured **from the face $AB$** (so $i = 30^\circ$ and $\cos\theta = \sin i = 0.500$) and asked candidates to plot $\cos\theta$ against $\phi = MO/NO$!
  - **Beat 3:** Together with Engr. Danjuma, they fix every practical mistake, align the **bases** of $P_3$ and $P_4$ through the 3D block at $5\text{ cm}$ spacing, and close all three parts of the Yaba Optical Workshop mystery!
- **Wonder Wall (`#wonder`):**
  - Seeds: *"Why does WAEC deduct marks if all traces are drawn in one outline?"*, *"Why should we line up the bases of the pins instead of their tops?"*, *"How does $\cos\theta$ equal $\sin i$ when $\theta$ is measured from the block face?"*, *"Why must angles inside the block stay below $40^\circ$ in the 2017 practical variant?"*

### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **2A. Interactive Sort Game (`#sort`):**
  - Classify 10 cards into 3 bins:
    1. `shm` → **WAEC Graph Variant Slope Decoders** (Plot $\sin i$ vs $\sin r \implies \text{Slope } s = n$, Plot $\cos\theta$ vs $\phi = MO/NO \implies \text{Slope } s = n$, Plot $EF$ vs $V = \tan i - \tan r \implies \text{Slope } s = \text{block width } w$, Plot $LE$ vs $LN \implies \text{Slope } s = 1/n$ so $K = 1/s = n$)
    2. `periodic` → **Acceptable Past-Tense Precautions (2 Marks)** (*"I ensured the optical pins were vertical (erect)"*, *"I spaced adjacent optical pins 4 cm to 5 cm apart"*, *"I avoided parallax error when reading the protractor and metre rule"*, *"I used a sharp pencil to draw neat traces on separate outlines"*)
    3. `non` → **Mark-Wiping Mistakes & Sources of Error** (Drawing all 5 traces inside one outline or omitting pinholes/arrows, Recording $\sin i$ or $\cos\theta$ to 1 d.p. instead of 3 d.p., Evaluating $(\cos\theta)/2$ instead of $\cos(\theta/2)$ in the mirror variant)
- **2B. 3D Virtual Practical (`bench.js` — 3D Four-Pin Optical Ray-Tracing & Graph-Variant Workbench):**
  - **Controls:**
    - WAEC Practical Variant selector:
      - `Variant 1 & 2: Standard / Glancing Angle (cos θ vs φ = MO/NO → Slope = n = 1.50)`
      - `Variant 3 (WASSCE 2023): Far-Face Shift d = EF vs V = tan i − tan r (Slope = Width w = 6.0 cm)`
      - `Variant 4 (WASSCE 2010B): Perpendiculars LE vs LN (Slope s = 1/n = 0.667, K = 1/s = 1.50)`
      - `Variant 5 (WASSCE 2017B): Internal Ray P₁P₂ (i = 5°–25° < C, cos θ vs sin i → Slope = n)`
    - Trial angle $i$ slider (`15°` to `55°`, with corresponding glancing angle $\theta = 90^\circ - i$)
    - Sighting Pin $P_3\text{–}P_4$ lateral alignment slider (or **"🎯 Align Pin Bases & Lift Block"** button)
    - Camera view toggle (`Top Drawing-Board View` vs `Eye-Level Through Face DC Sighting View`)
  - **Live Readouts:** `Normal i / Glancing θ`, `Refracted r / Chord MO & NO`, `sin i (= cos θ) [3 d.p.]`, `sin r (= MO/NO) [3 d.p.]`, `Variant Graph Slope s`.
  - **Interactive Lab Notebook Table (`#results-table`):** 5 complete WAEC Paper 3 traces for a $w = 6.0\text{ cm}, n = 1.50$ block ($i = 15^\circ, 25^\circ, 35^\circ, 45^\circ, 55^\circ$, i.e. $\theta = 75^\circ, 65^\circ, 55^\circ, 45^\circ, 35^\circ$), checking $MO\text{ (cm, 1 d.p.)}$, $NO\text{ (cm, 1 d.p.)}$, $\phi = MO/NO\text{ (3 d.p.)}$, and $\cos\theta\text{ (3 d.p.)}$.

### Active Movement Break (`#movement-break` · 2 min at 45-min mark)
- **The Eye-Level Pin-Base Sighting Squat:** Stand up, then crouch so your eyes are level with your desk surface! Hold two pens upright $5\text{ cm}$ apart and close one eye so the front pen's **base** hides the back pen's **base**. Say aloud in the past tense: *"I ensured the optical pins were vertical and spaced 5 cm apart, and I aligned their bases to avoid parallax error!"*

### Phase 3 · Make Sense (`#concepts` & `#neutralise` · 15 min)
- **4 Core Concept Cards:**
  1. *The Glancing-Angle Key Rule ($\cos\theta = \sin i$):* Whenever WAEC measures $\theta$ between the ray and the **block face**, the angle to the normal is $90^\circ - \theta$, so $\cos\theta = \sin(90^\circ - \theta) = \sin i$ (or $\sin e$ for an emergent glancing angle).
  2. *Right-Angled Triangle Chord Ratios ($\phi = MO/NO$ and $LE/LN$):* In $\triangle NMO$ inside a block of width $NM = w$, $\sin r = \frac{MO}{NO} = \phi$; in $\triangle OLN$ and $\triangle OLE$ with fixed $OL$, $\frac{LE}{LN} = \frac{OL\sin r}{OL\sin i} = \frac{1}{n}$.
  3. *Internal-Ray (2017) & Mirror-Backed (2010A) Variants:* When pins $P_1, P_2$ define a ray *inside* the glass, $i$ must stay small ($5^\circ\text{–}25^\circ < 41.8^\circ$) or TIR prevents any emergent ray! In the mirror-backed block, always halve $\theta$ **before** taking cosine: $\cos(\theta/2)$.
  4. *WAEC Paper 3 Marking Scheme & Past-Tense Precautions:* 10 marks for 5 separate traces with pinholes, arrows, and 1 d.p. / 3 d.p. composite table; 6 marks for graph; 2 marks for large slope triangle; 2 marks for past-tense precautions.
- **Interactive Pin Explorer (`#ph-track`):** 7 pins — one for each official WAEC Paper 3 practical variant (`Variant 1` through `Variant 7`).
- **3D Concept Zoom (`zoom.js` — 3D Pin-Base Alignment vs Tilted-Pin Error & Variant Triangle Decoder):**
  - Modes: `1. Pin Bases vs Tilted Pin Tops`, `2. Variant 2 & 3 Triangles (MO/NO & EF)`, `3. Variant 4 & 5 Geometry (LE/LN & Internal Ray)`.

### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **4 Step-by-Step Worked Examples:**
  1. *WASSCE 2011 Variant ($\cos\theta$ against $\phi = MO/NO$):* Using points $(0.180, 0.270)$ and $(0.540, 0.810)$ from the line of best fit, calculate the slope $s = \frac{0.810 - 0.270}{0.540 - 0.180} = \frac{0.540}{0.360} = 1.50 = n$ and find the critical angle $C = 41.8^\circ$.
  2. *WASSCE 2023 Variant ($d = EF$ against $V = \tan i - \tan r$):* Given $w = 6.0\text{ cm}$ and points $(0.100, 0.59\text{ cm})$ and $(0.550, 3.25\text{ cm})$ on the line of best fit, find the slope $s = \frac{3.25 - 0.59}{0.550 - 0.100} = 5.91\text{ cm}$ and verify it is within $10\%$ of the measured block width $6.0\text{ cm}$.
  3. *WASSCE 2010B Variant ($LE$ against $LN$, $K = 1/s$):* With $OL = 5.0\text{ cm}$ fixed on the normal, at $i = 45^\circ$ ($r = 28.1^\circ$), find $LN = 5.0\sin 45^\circ = 3.54\text{ cm}$, $LE = 5.0\sin 28.1^\circ = 2.36\text{ cm}$, slope $s = LE/LN = 0.667$, and $K = 1/s = 1.50$.
  4. *WASSCE 2017B Internal-Ray Variant & $\cos(\theta/2)$ Trap:* Explain why internal angles $5^\circ\text{–}25^\circ$ are used, and compare $\cos(36^\circ/2) = \cos 18^\circ = 0.951$ against the common candidate error $(\cos 36^\circ)/2 = 0.405$.
- **The Bridge (`#bridge` — The WAEC Graph-Slope Master Decoder):**
  - Challenge: In a WASSCE Physics practical using a rectangular glass block of width $w = 6.0\text{ cm}$ and refractive index $n = 1.50$, a candidate plots perpendicular intercept **$LE$ (proportional to $\sin r$) on the vertical axis** against **$LN$ (proportional to $\sin i$) on the horizontal axis**. What is the numerical value of the **slope $s$** of the graph? ($s = \frac{\sin r}{\sin i} = \frac{1}{n} = \frac{1}{1.50} = \mathbf{0.667}$, while $K = 1/s = 1.50$!).
- **12-Question Instant-Feedback Quiz (`#quiz`):** Lesson 05 bank (including unit-wide synthesis).

### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + home)
- 5 self-rating statements (`1–4`) covering competences `L1, L2, L4, L6`.
- 30-Mark Locked Assignment (Full Paper 3 Composite Table Completion & Slope Deduction; Decoding the 7 WAEC Variants; Past-Tense Precautions vs Sources of Error & Complete Unit Mystery Resolution).

---

## Part III · Nigerian English (`en-NG`) Narrator Choreography Plan
- **`welcome-narration.js` (Welcome Hub):** 6 chapters guiding the student through the 3D Hero Glass Block Lab, the Yaba Optical Workshop mystery clues, the 5-lesson roadmap, the 4-tab Concept Explorer, and the 3 Myth-Buster flip cards.
- **`lessons/lesson-01/narration.js` to `lessons/lesson-05/narration.js`:** 5 chaptered Nigerian English (`en-NG`) scripts spotlighting the *Do Now* cards, 3D Story characters (`Engr. Danjuma`, `Kemi`, `Chidi`), Wonder Wall, Sort Game (with `"Your turn!"` wait and dynamic score reaction), 3D Practical Bench, 3D Concept Zoom, Worked Examples, Bridge challenge, and 12-question Quiz.
