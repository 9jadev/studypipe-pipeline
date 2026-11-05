---
slug: ss2-phy-refraction-rectangular-block
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 5
duration_per_lesson_min: 80
---

# 01 — Topic Map: Refraction of Light Through a Rectangular Glass Block (`ss2-phy-refraction-rectangular-block`)

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)
- **Subject & Level:** Senior Secondary 2 (SS2) & SS3 Exam Preparation Physics.
- **WAEC (WASSCE) & NECO Physics Scope:**
  - Physical meaning and wave-speed origin of refraction at plane boundaries; the two laws of refraction and Snell's law ($\sin i / \sin r = \text{constant}$ for a given pair of media).
  - Refractive index expressed across all five physical domains: angles ($\sin i / \sin r$), wave speeds ($c / v$), wavelengths ($\lambda_{\text{air}} / \lambda_{\text{medium}}$ at constant frequency $f$), vertical viewing depths ($\text{real depth} / \text{apparent depth}$), and critical angle ($1 / \sin C$).
  - Ray trajectory through a parallel-sided rectangular glass block (often called a rectangular glass prism in WAEC papers): why the emergent ray is parallel to the incident ray ($e = i$, total angular deviation $= 0^\circ$) while undergoing sideways **lateral displacement** $d = \frac{t\sin(i - r)}{\cos r}$ and far-face shift $EF = t(\tan i - \tan r)$.
  - Real and apparent depth, upward apparent displacement $\Delta d = t(1 - 1/n)$, multi-layer transparent slabs, and the no-parallax search-pin experiment.
  - Critical angle ($C$), total internal reflection (TIR), the two mandatory conditions for TIR, and practical applications (optical fibres, $45^\circ$ prism periscopes/binoculars, diamond brilliance, highway mirages, and cat's-eye reflectors).
  - **Paper 3 (Practical Physics) Four-Pin Ray-Tracing Investigation:** Tracing block outlines, aligning pin bases through the opposite face, tabulating to WAEC decimal rules (lengths to $1\text{ d.p.}$, trig values to $3\text{ d.p.}$), interpreting the **7 official WAEC graph variants** ($\sin i$ vs $\sin r$, $\cos\theta$ vs $MO/NO$, $d$ vs $\tan i - \tan r$, $LE$ vs $LN$, internal-pin $\cos\theta$ vs $\sin i$, block-plus-mirror $\cos(\theta/2)$, and chord-ratio $\mu$), and stating past-tense precautions versus sources of error.
- **JAMB (UTME) Physics Scope:**
  - Velocity, wavelength, and frequency behaviour across media boundaries; relative refractive index (${}_1n_2 = n_2/n_1$) and optical reversibility (${}_gn_a = 1/{}_an_g$).
  - Brewsters/perpendicular reflected-refracted ray geometry ($i + r = 90^\circ \implies n = \tan i$).
  - Quantitative deductions from ray-traced rectangular block diagrams (chord ratios, apparent depth shifts, critical angles between two non-air media $\sin C = n_{\text{less}}/n_{\text{more}}$).

---

## 2. Paraphrasing & Originality Commitment
Every explanation, Nigerian narrative, diagram label, worked example, and assessment item in this unit is **100% originally written and paraphrased**. The uploaded guide (`Refraction_Glass_Block_Exam_Guide.pdf`) has been studied solely for conceptual scope, mathematical relationships, and examiner expectations; all problem scenarios, numbers, and prose are freshly created.

---

## 3. Unit Mystery Thread & 3D Story Cast
- **The Case File:** *The Yaba Optical Workshop & Lekki Aquarium Viewing-Window Triple Mystery*
  - At **Danjuma Precision Optics & Glass Works in Yaba, Lagos**, apprentice **Kemi** and student intern **Chidi** are testing a thick, polished **rectangular crown-glass block ($t = 6.0\text{ cm}, n = 1.50$)** destined for a marine sensor housing at the Lekki Conservation Centre:
    1. **Clue 1 (The Parallel Sideways Jump):** When Kemi shines a narrow alignment laser at $i = 45^\circ$ onto the front face $AB$, the beam emerging from the back face $DC$ travels in the **exact same direction** ($e = 45^\circ$, zero angular turn), yet it misses the receiving photodiode by **$1.98\text{ cm}$ sideways**!
    2. **Clue 2 (The Floating Serial Stamp):** When Chidi looks straight down from above through the $6.0\text{ cm}$ slab at a laser-etched serial mark on the workbench, the mark appears **floating $2.0\text{ cm}$ above the wood** at an apparent depth of only **$4.0\text{ cm}$**!
    3. **Clue 3 (The Invisible Mirror):** When master technician **Engr. Danjuma** places a glowing optical pin inside a groove at the bottom face so light strikes the glass-to-air boundary from inside at **$45^\circ$**, **zero light escapes into the room** — the clear transparent glass suddenly behaves like a $100\%$ perfect mirror!
- **3D Story Cast:**
  - **Engr. Danjuma** — Senior Optical Instrument Technologist at Yaba Tech & Precision Glass Works (`skin: 0x5c361e, shirt: 0x0d9c7e, glasses: true`).
  - **Kemi** — SS2 Physics prefect and optical workshop apprentice (`skin: 0x6b3f26, shirt: 0xd97706, headband: 0x3ee6c4`).
  - **Chidi** — Curious SS2 classmate preparing for WAEC Paper 3 (`skin: 0x7a4b2a, shirt: 0x3b82f6`).

---

## 4. Unit Welcome Hub Specification (`html/index.html`)
- **3D Hero Lab (`#lab-canvas` / `window.StudyLab`):** Interactive 3D Rectangular Glass Block Laser & Four-Pin Ray-Tracing Bench with live controls for angle of incidence $i$ ($0^\circ\text{–}75^\circ$), block refractive index $n$ ($\text{Water } 1.33$, $\text{Crown Glass } 1.50$, $\text{Flint Glass } 1.65$, $\text{Diamond } 2.42$), and mode toggle (*Refraction & Lateral Shift*, *Wavefront Speed Zoom*, *Total Internal Reflection*), plus live readouts of $i, r, e, d$, and $v$.
- **Interactive Concept Explorer (`#explorer`):** 4-tab live SVG curve switcher:
  1. *Snell's Law Sine Ratio ($\sin i = n\sin r$)*
  2. *Lateral Shift Curve ($d = t\sin(i-r)/\cos r$)*
  3. *Apparent Depth & Upward Shift ($d_{\text{app}} = t/n$)*
  4. *Critical Angle & Total Internal Reflection ($\sin C = 1/n$)*
- **6 Calculation Archetypes (`#archetypes`):**
  1. *Five-Way Refractive Index Master Equation* ($n = \frac{\sin i}{\sin r} = \frac{c}{v} = \frac{\lambda_1}{\lambda_2} = \frac{t}{d_{\text{app}}} = \frac{1}{\sin C}$)
  2. *Relative Index, Reversibility & $90^\circ$ Reflected-Refracted Ray* (${}_1n_2 = n_2/n_1$, $n = \tan i$)
  3. *Rectangular Block Lateral Displacement & Far-Face Shift* ($d = \frac{t\sin(i-r)}{\cos r}$, $EF = t(\tan i - \tan r)$)
  4. *Real vs Apparent Depth & Multi-Layer Slabs* ($d_{\text{app}} = \sum \frac{t_k}{n_k}$, $\Delta d = t(1 - 1/n)$)
  5. *Critical Angle & Two-Media TIR Threshold* ($\sin C = \frac{n_{\text{less}}}{n_{\text{more}}}$)
  6. *Decoding the 7 WAEC Paper 3 Graph Slopes* ($\cos\theta = \sin i$, $\phi = MO/NO = \sin r$, $s = n$, $1/n$, or $w$)
- **3 Myth-Buster Flip Cards (`#myths`):**
  - *Myth 1:* "A rectangular glass block bends light permanently through a net angle." → **Truth:** Emergent angle $e = i$; net angular deviation is **$0^\circ$** — the ray is only shifted sideways!
  - *Myth 2:* "When light slows down in glass, its frequency drops." → **Truth:** **Frequency $f$ never changes** on refraction! Speed $v$ and wavelength $\lambda$ decrease in exact proportion ($v = f\lambda$).
  - *Myth 3:* "Total internal reflection happens when a strong ray in air hits glass at a steep angle." → **Truth:** TIR is **impossible from air into glass**; light must travel from an **optically denser to a less dense medium** at $\theta > C$.

---

## 5. Multi-Lesson Breakdown (Lessons 01 to 05)

| Lesson | Title & Driving Question | 3D Practical Bench (`bench.js`) | 3D Concept Zoom (`zoom.js`) | The Bridge Challenge (`#bridge`) | Spaced Retrieval (`#donow`) |
|---|---|---|---|---|---|
| **Lesson 01** | **Refraction at Plane Surfaces, Wavefront Speed & Snell's Law**<br>*Why does a light beam bend when entering glass at an angle, yet pass straight through along the normal?* | **3D Snell's Law Laser & Multi-Media Refraction Bench:** Vary $i$ ($0^\circ\text{–}75^\circ$) and medium ($n = 1.33, 1.50, 1.65, 2.42$); measure $r$, $\sin i$, $\sin r$, surface deviation $\delta = i - r$, and wave speed $v$. | **3D Wavefront Pivoting & Wavelength Compression Zoom:** Animated 3D wavefront planes slowing from $c$ to $v = c/n$ so $\lambda$ shrinks while frequency $f$ stays fixed. | **The $90^\circ$ Reflected–Refracted Brewster Trap:** Find $n$ when reflected and refracted rays are perpendicular ($r = 90^\circ - i \implies n = \tan i$). | 4 prerequisite cards (`from: 0`): wave equation $v = f\lambda$, normal angle definition, sine/cosine rules, speed of light $c$. |
| **Lesson 02** | **Path Through a Rectangular Glass Block, Lateral Displacement & Dispersion**<br>*Why does a ray exit a rectangular glass block parallel to its original path ($e = i$), and what controls its sideways shift $d$?* | **3D Rectangular Glass Block Lateral Shift & Far-Face Bench:** Vary thickness $t$ ($4\text{–}10\text{ cm}$), angle $i$, index $n$, and ray colour (red vs violet); measure $r, e, d = \frac{t\sin(i-r)}{\cos r}$, and $EF = t(\tan i - \tan r)$. | **3D Parallel-Normal Proof & Red/Violet Dispersion Zoom:** Close-up of alternate interior angles ($r_1 = r_2 \implies e = i$) and why violet shifts further sideways than red. | **Kemi's $1.98\text{ cm}$ Sensor Alignment Fix:** Calculate exact lateral shift $d$ and net angular deviation ($0^\circ$) for the Yaba workshop laser. | 4 retrieval cards from Lesson 01 (`from: 1`): Snell's law phrase, invariant $f$, ${}_wn_g$ ratio, single-face deviation $i - r$. |
| **Lesson 03** | **Real & Apparent Depth, Multi-Layer Slabs & The No-Parallax Method**<br>*Why does a stamp under a $6.0\text{ cm}$ glass block appear $2.0\text{ cm}$ higher, and how do we measure refractive index without a protractor?* | **3D No-Parallax Search-Pin & Layered Depth Bench:** Move a 3D reference search pin up/down beside an upright glass block while swaying the camera left/right until parallax vanishes; test single blocks and water-over-glass layers. | **3D Virtual-Image Ray Cone & Paraxial Approximation Zoom:** Diverging rays from bottom object $O$ bending away from normal at the top face and projecting back to virtual image $I$. | **The Two-Sided Air Bubble & Layered Tank Challenge:** Locate a trapped air bubble viewed from opposite faces of a $15\text{ cm}$ glass block. | 4 retrieval cards from Lessons 01–02 (`from: 1, 2`): $e = i$ zero deviation, lateral shift formula, violet vs red shift, grazing incidence $i = 90^\circ$. |
| **Lesson 04** | **Critical Angle, Total Internal Reflection & Optical Fibre Engineering**<br>*How can transparent glass reflect $100\%$ of light without a drop of silver — and why can TIR never happen from air into glass?* | **3D Critical-Angle & Optical-Fibre Core/Cladding Bench:** Sweep internal angle $\theta$ from $10^\circ\text{ to }75^\circ$ across $\theta < C$, $\theta = C$ ($r = 90^\circ$), and $\theta > C$ (TIR) for Crown Glass, Water, Diamond, Glass-to-Water, and Optical Fibre. | **3D $45^\circ$ Prism Periscope vs Silvered Mirror & Highway Mirage Zoom:** Compare ghost reflections in a front-glass mirror against crisp $100\%$ TIR in a prism, plus hot-air mirage ray curving. | **The Adjacent-Face Pin Visibility Mystery:** Explain why a pin on face $AB$ of a glass block ($n = 1.60, C = 38.7^\circ$) cannot be seen through side face $AD$. | 4 retrieval cards from Lessons 01–03 (`from: 1, 2, 3`): upward displacement $t(1-1/n)$, multi-layer depth, paraxial vertical viewing rule, speed in glass. |
| **Lesson 05** | **WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical & The 7 Graph Variants**<br>*How do you score full marks on any WAEC glass-block practical — even when the examiner measures angles from the face or plots chord lengths?* | **3D Four-Pin Optical Ray-Tracing & Graph-Variant Workbench:** Place $P_1, P_2$, look through face $DC$ at eye level to align the **bases** of $P_3, P_4$, lift the block to inspect the trace, and toggle across the **7 official WAEC graph variants**. | **3D Pin-Base vs Pin-Top Parallax & Triangle Decoder Zoom:** Visualise why tilted pin tops ruin alignment and how triangles $NMO$ ($\phi = MO/NO = \sin r$) and $OLN$ ($LE/LN = 1/n$) encode Snell's law. | **The Glancing-Angle ($\theta$ to Face) & Slope-Width Decoder:** Decode whether a practical graph slope equals $n$, $1/n$, or block width $w$. | 4 retrieval cards from Lessons 01–04 (`from: 1, 2, 3, 4`): two TIR conditions, $\sin C = n_2/n_1$, lateral shift factors, apparent depth formula. |

---

## 6. Unit Learning Objectives (with Bloom Levels)
1. **LO1 (Understand):** Explain refraction in terms of wave speed change across an optical boundary, identifying what changes ($v, \lambda$, direction for $i > 0^\circ$) and what remains constant (frequency $f$).
2. **LO2 (Apply):** State the two laws of refraction (including *"for a given pair of media"*) and apply $n = \frac{\sin i}{\sin r} = \frac{c}{v} = \frac{\lambda_{\text{air}}}{\lambda_m}$, relative index ${}_1n_2 = \frac{n_2}{n_1}$, and reversibility ${}_gn_a = \frac{1}{{}_an_g}$.
3. **LO3 (Analyse):** Prove that $e = i$ (zero net angular deviation) for a parallel-sided glass block and calculate lateral displacement $d = \frac{t\sin(i - r)}{\cos r}$ and far-face shift $EF = t(\tan i - \tan r)$.
4. **LO4 (Apply):** Derive and apply $n = \frac{\text{real depth}}{\text{apparent depth}}$ and upward shift $\Delta d = t\left(1 - \frac{1}{n}\right)$ for single and layered media, and describe the no-parallax search-pin method.
5. **LO5 (Analyse):** Define critical angle ($C$) and total internal reflection (TIR), state the two conditions for TIR, compute $\sin C = \frac{n_{\text{less}}}{n_{\text{more}}}$, and explain optical fibres, prism periscopes, diamond sparkle, and mirages.
6. **LO6 (Evaluate / Practical):** Execute the four-pin glass-block ray-tracing practical, decode all 7 WAEC graph variants ($\cos\theta = \sin i$, chord ratios, width slope), record tables to WAEC decimal standards ($1\text{ d.p.}$ lengths, $3\text{ d.p.}$ trig values), and state past-tense precautions versus sources of error.

---

## 7. Transversal Competences (`L1`–`L7`)
- **`L1` Thinking & Learning to Learn:** Testing hypotheses about wave speed, lateral shift, and internal reflection before viewing formal derivations.
- **`L2` Cultural Interaction & Self-Expression:** Connecting optical physics to Nigerian contexts (Yaba optical workshops, Lekki marine aquarium, Lagos subsea fibre-optic landing cables, Kano-Maiduguri road mirages) and writing past-tense WAEC precautions accurately.
- **`L3` Managing Daily Life & Safety:** Recognising why swimming pools and rivers look shallower than their true depth ($d_{\text{real}} = n \times d_{\text{app}}$) to prevent drowning hazards, and handling sharp optical pins safely.
- **`L4` Multiliteracy:** Reading protractor scales, geometric chord ratios ($MO/NO$, $LE/LN$), 3D ray cones, and linear graph slopes ($\Delta y/\Delta x$).
- **`L5` Digital & Simulation Competence:** Manipulating 3D eye-level sighting cameras, virtual search pins, and multi-medium laser benches.
- **`L6` Working-Life Skills & Entrepreneurship:** Precision optical alignment, quality control of glass refractive index, and telecommunications fibre engineering.
- **`L7` Building a Sustainable Future:** Designing daylighting prisms and low-loss optical fibre networks.

---

## 8. Exam Emphasis & Chief Examiner Traps
1. **Missing *"for a given pair of media"* in Snell's law:** Chief Examiner reports repeatedly note that candidates lose the definition mark when this phrase is omitted.
2. **Angle measured from the block face ($\theta$) instead of the normal ($i$):** If $\theta$ is measured from the surface, $i = 90^\circ - \theta$ and $\cos\theta = \sin i$.
3. **Confusing net block deviation with single-surface deviation:** A parallel-sided block gives **$0^\circ$ net angular deviation** ($e = i$); single-surface deviation is $i - r$.
4. **Early rounding of trig values:** WAEC requires $\sin, \cos, \tan$ tabulated to **at least 3 decimal places** (`0.500`, not `0.5`) and lengths in $\text{cm}$ to **1 decimal place** (`6.0 cm`).
5. **Pin placement errors in Paper 3:** Putting all traces on one outline (loses 1 mark), omitting ray arrows (loses $\tfrac{1}{2}$ mark), spacing pins closer than $4\text{ cm}$, or sighting pin tops instead of pin bases.
6. **Evaluating $\cos\theta / 2$ instead of $\cos(\theta / 2)$:** In the mirror-backed block variant, halve the angle $\theta$ *first* before taking the cosine.

---

## 9. Sources Consulted (Paraphrased)
- Uploaded reference guide: `sources/Refraction_Glass_Block_Exam_Guide.pdf` (WAEC/NECO/JAMB syllabus synthesis, 7 official WASSCE Paper 3 practical variants, Chief Examiner report insights, and calculation archetypes — 100% paraphrased).
