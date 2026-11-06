# Multi-Lesson Unit Plan: The Human Heart and Blood Circulation (`ss2-bio-heart-circulation`)

---

## Part I — Unit Welcome Hub (`html/index.html`) & Spaced Retrieval Bank (`retrieval-bank.js`)

### 1. Hero Section & 3D Hero Lab (`welcome-lab.js` / `window.StudyLab`)
- **Eyebrow:** `SS2 BIOLOGY · WAEC · NECO · JAMB · PAPER 3 PRACTICAL CORE`
- **Display Title:** `The Human Heart & Blood Circulation`
- **Lede:** Why can a 16-year-old sprinter at Teslim Balogun Stadium in Surulere boost his cardiac output from $5.0\text{ L/min}$ at rest to $17.5\text{ L/min}$ in seconds, why is the left ventricular wall of a goat heart at Surulere Market three times thicker than the right, and why would transfusing Group A blood into a Group B accident victim at LUTH Idi-Araba clump their red blood cells? Slice open a beating 3D Mammalian Heart, trace every blood vessel, and master WAEC, NECO, and JAMB cardiovascular physiology and Paper 3 practicals.
- **CTAs:**
  - Primary: `Start guided tour (en-NG) ▷` (`data-tour`)
  - Secondary: `Begin Lesson 1 →` (`href="lessons/lesson-01/index.html"`)
- **Hero Meta Strip:** `5 lessons · ~6.5 hrs` · `5 3D Labs + 5 3D Zooms` · `60 MCQs + 150-mk Papers` · `StudyMath LaTeX Step-by-Step`
- **3D Hero Lab (`#lab-canvas`):**
  - Built with `window.HeartKit` + `window.SceneKit`:
    - **View 1 (`heart` — 4-Chamber Cut-Away):** Beating 3D mammalian heart showing Right Atrium, Right Ventricle, Left Atrium, Left Ventricle ($3\times$ thicker myocardium), Septum, Tricuspid & Bicuspid valves with chordae tendineae, Semilunar valves, Venae Cavae, Pulmonary Artery, Pulmonary Veins, and Aorta.
    - **View 2 (`circuit` — Double Circulation):** Animated deoxygenated blue stream ($\text{Vena Cava} \rightarrow \text{RA} \rightarrow \text{RV} \rightarrow \text{Pulmonary Artery} \rightarrow \text{Lungs}$) and oxygenated crimson stream ($\text{Lungs} \rightarrow \text{Pulmonary Vein} \rightarrow \text{LA} \rightarrow \text{LV} \rightarrow \text{Aorta} \rightarrow \text{Body}$).
    - **View 3 (`pace` — Pacemaker & Exercise Sprint):** Golden electrical wave firing from $\text{SAN} \rightarrow \text{AVN} \rightarrow \text{Bundle of His} \rightarrow \text{Purkinje fibres}$, toggling between Resting ($72\text{ bpm}$, $\text{CO} = 5.04\text{ L/min}$) and Surulere Sprint ($160\text{ bpm}$, $\text{CO} = 17.60\text{ L/min}$).

### 2. Scrolling Marquee (12 Key Terms & Equations)
1. $\text{SA}/\text{V} = 6/L$ (Diffusion Limit)
2. Double Circulation (Pulmonary + Systemic)
3. Myogenic Pacemaker ($\text{SAN} \rightarrow \text{AVN} \rightarrow \text{Purkinje}$)
4. Tricuspid (Right, 3 Cusps) vs Bicuspid (Left, 2 Cusps)
5. $\text{CO} = \text{HR} \times \text{SV}$ (Cardiac Output)
6. Left Ventricle Wall $= 3\times$ Right Ventricle
7. Lub ($S_1$: AV Valves Close) · Dub ($S_2$: Semilunar Close)
8. Hepatic Portal Vein (Ileum $\rightarrow$ Liver)
9. $\text{NFP} = P_c - \pi_c$ (Capillary Ultrafiltration)
10. Thromboplastin $\xrightarrow{\text{Ca}^{2+},\text{ Vit K}}$ Thrombin $\rightarrow$ Fibrin
11. Group O = Universal Donor · Group AB = Universal Recipient
12. WAEC Paper 3 Heart Drawing ($M = I / A$)

### 3. Unit Mystery Case File (`#mystery`)
- **Case Narrative:** At Teslim Balogun Stadium in Surulere, Lagos, SS2 sprinter **Chinedu** finishes the 400 m race with a pounding chest ($175\text{ bpm}$, $\text{BP } 155/85\text{ mmHg}$). Across the street at LUTH Idi-Araba, **Dr. Halima** and **Nurse Kemi** must cross-match donor blood for an $\text{Rh}^-$ Group B trauma patient while explaining to **Coach Danjuma** why veins have valves, why arteries spurt under pressure, and how a 4-chambered heart powers every organ without mixing oxygenated and deoxygenated blood.
- **Exam Weight Stats:**
  - `18–25%` of WAEC/NECO SSCE Biology Paper 2 & Paper 3 marks involve transport, heart diagrams, blood vessels, or blood groups.
  - `3–5 MCQs` every year in JAMB UTME Biology test blood pathways, clotting cofactors, heart valves, and ABO/Rhesus genetics.
  - `6 Core Equations` rendered step-by-step in offline LaTeX via `StudyMath`.

### 4. Interactive Explorer (`#explorer`), 6 Calculation Archetypes (`#archetypes`) & 3 Myth Cards (`#myths`)
- **4 Explorer Tabs:**
  1. `Cardiac Cycle (0.80 s)` — Wiggers pressure trace ($P_{\text{LV}}$ peaking at $120\text{ mmHg}$, aortic valve opening at $80\text{ mmHg}$, *"Lub"* and *"Dub"* markers).
  2. `Double Circulation & Portal Route` — Pressure comparison between Pulmonary circuit ($25/10\text{ mmHg}$) and Systemic circuit ($120/80\text{ mmHg}$) plus Hepatic Portal glucose regulation.
  3. `Artery → Capillary → Vein Profile` — Pressure drop from Aorta ($120\text{ mmHg}$) through Arterioles and Capillaries ($35 \rightarrow 15\text{ mmHg}$) to Vena Cava ($2\text{ mmHg}$).
  4. `Clotting & ABO/Rhesus Matrix` — Enzymatic prothrombin $\rightarrow$ thrombin $\rightarrow$ fibrin curve and ABO antigen-antibody agglutination rules.
- **6 Calculation Archetypes (with `StudyMath` LaTeX chains):**
  1. **Cube Surface-Area-to-Volume Scaling:** $\text{SA} = 6L^2$, $V = L^3$, $\frac{\text{SA}}{V} = \frac{6}{L} = \frac{6}{4\text{ mm}} = 1.50\text{ mm}^{-1}$
  2. **Cardiac Output & Sprint Reserve:** $\text{CO} = \text{HR} \times \text{SV} = 72\text{ bpm} \times 70\text{ mL} = 5040\text{ mL/min} = 5.04\text{ L/min}$
  3. **Stroke Volume & Ejection Fraction:** $\text{SV} = \text{EDV} - \text{ESV} = 125\text{ mL} - 50\text{ mL} = 75\text{ mL}$, $\text{EF} = \frac{75}{125}\times 100\% = 60.0\%$
  4. **Cardiac Cycle Period & Diastole Fraction:** $T = \frac{60\text{ s}}{\text{HR}} = \frac{60}{75\text{ bpm}} = 0.80\text{ s}$
  5. **Pulse Pressure, MAP & Capillary Net Filtration:** $\text{PP} = P_{\text{sys}} - P_{\text{dia}} = 120 - 80 = 40\text{ mmHg}$, $\text{NFP} = P_c - \pi_c = 35 - 25 = +10\text{ mmHg}$
  6. **WAEC Heart Drawing Linear Magnification:** $M = \frac{I}{A} = \frac{135\text{ mm}}{90\text{ mm}} = \times 1.5$

---

## Part II — Detailed 5-Phase Lesson Plans (Lessons 01 to 05)

---

### LESSON 01: Need for Transport — Open vs Closed & Single vs Double Circulation
- **Folder:** `topics/ss2-bio-heart-circulation/html/lessons/lesson-01/`
- **Duration:** 80 min · **Competences:** `L1` (Scientific reasoning), `L4` (Multiliteracy), `L5` (3D simulation)

#### Phase 0 · Warm-up (`#donow` · 5 min) — 4 Prerequisite Cards (`from: 0`)
1. **Simple Diffusion:** What is diffusion and why is it effective inside a microscopic *Amoeba* ($L = 0.1\text{ mm}$)?
   - *Answer:* Diffusion is the net passive movement of particles from a region of higher concentration to a region of lower concentration down a concentration gradient; over micrometer distances ($< 0.1\text{ mm}$), oxygen reaches the cell centre in milliseconds.
2. **Surface-Area-to-Volume Ratio ($\text{SA}/\text{V}$):** Calculate the $\text{SA}/\text{V}$ ratio of a cube of side $L = 1\text{ mm}$ vs $L = 6\text{ mm}$.
   - *Answer:* $\frac{\text{SA}}{V} = \frac{6L^2}{L^3} = \frac{6}{L} = \frac{6}{1\text{ mm}} = 6.00\text{ mm}^{-1}$ for $L = 1\text{ mm}$, dropping to $\frac{\text{SA}}{V} = \frac{6}{6\text{ mm}} = 1.00\text{ mm}^{-1}$ for $L = 6\text{ mm}$.
3. **Aerobic Respiration Demand:** Which two raw materials must reach every active muscle mitochondrion continuously, and which waste gas must be removed?
   - *Answer:* Glucose ($\text{C}_6\text{H}_{12}\text{O}_6$) and oxygen ($\text{O}_2$) must be delivered continuously, while carbon dioxide ($\text{CO}_2$) and heat must be carried away.
4. **Levels of Organisation:** Arrange *Blood, Erythrocyte, Circulatory System, Heart* from lowest to highest level of biological organisation.
   - *Answer:* Erythrocyte (cell) $\rightarrow$ Blood (connective tissue) $\rightarrow$ Heart (organ) $\rightarrow$ Circulatory System (organ system).

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story (`story.js` — 6 beats at Surulere Stadium & LUTH Physiology Lab):**
  - *Beat 1:* Chinedu finishes his 400 m sprint at Surulere Stadium; he asks Nurse Kemi why a pond *Amoeba* needs no heart at all while he is gasping with a racing pulse.
  - *Beat 2:* Coach Danjuma claims that insects like cockroaches and mammals like humans have the exact same kind of blood vessels.
  - *Beat 3:* Nurse Kemi corrects him: a cockroach has an **open circulatory system** where colourless **haemolymph** sloshes slowly at low pressure in a body cavity (**haemocoel**), whereas earthworms, fish, and mammals have a **closed circulatory system** with blood sealed inside vessels!
  - *Beat 4:* Nurse Kemi compares a *Tilapia* fish (**single circulation**, 2-chambered heart where blood passes through the heart once per circuit and loses pressure across gill capillaries) with a human (**double circulation**, 4-chambered heart).
  - *Beat 5:* Why does double circulation give mammals and birds a huge metabolic advantage? Oxygenated and deoxygenated blood never mix, and the left ventricle re-pressurises oxygenated blood from the lungs to $120\text{ mmHg}$!
  - *Beat 6:* At the LUTH Physiology Lab, Dr. Halima invites students to test the 3D SA/V Diffusion & Comparative Circulation Bench.
- **Wonder Wall:** *"If a Tilapia fish's gill capillaries drop blood pressure from 45 mmHg to 12 mmHg before the blood even reaches its swimming muscles, how does a mammal solve this pressure drop?"*

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Interactive Sort Game (9 cards into 3 bins: `Open Circulation`, `Closed Single Circulation`, `Closed Double Circulation`):**
  1. `Blood flows freely inside a body cavity called the haemocoel` $\rightarrow$ `Open Circulation`
  2. `Transport fluid is colourless haemolymph at very low pressure` $\rightarrow$ `Open Circulation`
  3. `Found in cockroach (Periplaneta) and giant land snail (Archachatina)` $\rightarrow$ `Open Circulation`
  4. `Two-chambered heart (1 atrium, 1 ventricle) pumping blood Heart → Gills → Body → Heart` $\rightarrow$ `Closed Single Circulation`
  5. `Blood passes through the heart only ONCE in each complete circuit (e.g., Tilapia)` $\rightarrow$ `Closed Single Circulation`
  6. `Systemic organs receive oxygenated blood at reduced pressure after the gill capillaries` $\rightarrow$ `Closed Single Circulation`
  7. `Blood passes through the heart TWICE per complete circuit (Pulmonary + Systemic loops)` $\rightarrow$ `Closed Double Circulation`
  8. `Four-chambered heart completely separates oxygenated and deoxygenated blood (Man, Pigeon)` $\rightarrow$ `Closed Double Circulation`
  9. `Three-chambered heart (2 atria, 1 ventricle) with partial mixing in amphibians (Toad)` $\rightarrow$ `Closed Double Circulation`
- **3D Virtual Lab Bench (`bench.js` — 3D SA/V Scaling & Comparative Circulation Bench):**
  - Left side: 3D SA/V Diffusion Cube ($L = 1, 2, 3, 4, 6\text{ mm}$) showing unreached dark core volume when simple diffusion is the only transport mechanism.
  - Right side: 3D Comparative Circulatory Loop switching between **Standard Mammal Double Circuit (`std`)**, **Sprint Exercise $2\times$ Flow (`heavy`)**, and **Single-Circuit Gill Pressure Drop (`wide`)**.
  - **5 Trials (`A`–`E`):** Tissue cube side length $L \in \{1.0, 2.0, 3.0, 4.0, 6.0\}\text{ mm}$, measuring Surface Area $\text{SA} = 6L^2$, Volume $V = L^3$, and $\text{SA}/\text{V} = 6/L$ ($\in \{6.00, 3.00, 2.00, 1.50, 1.00\}\text{ mm}^{-1}$).

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts & Equations (`.eq`):**
  - Equation 1: $\frac{\text{SA}}{V} = \frac{6L^2}{L^3} = \frac{6}{L} = \frac{6}{3.0\text{ mm}} = 2.00\text{ mm}^{-1}$
  - Equation 2: $\text{CO} = \text{HR} \times \text{SV} = 75\text{ bpm} \times 70\text{ mL} = 5250\text{ mL/min} = 5.25\text{ L/min}$
  - Equation 3: $t_{\text{circuit}} = \frac{V_{\text{blood}}}{\text{CO}} = \frac{5250\text{ mL}}{5250\text{ mL/min}} = 1.00\text{ min} = 60.0\text{ s}$
- **Comparison Tables:**
  - Table 1: Open vs Closed Circulatory Systems (Fluid location, Fluid name, Pressure & speed, Regulation of distribution, Examples).
  - Table 2: Single vs Incomplete Double vs Complete Double Circulation (Chambers, Passes through heart per circuit, Mixing of blood, Systemic pressure, Examples: *Tilapia* vs Toad/Lizard vs Man/Pigeon).
- **3D Concept Zoom (`zoom.js`):** Side-by-side 3D animated comparison of **2-Chambered Fish Single Circuit** (Atrium $\rightarrow$ Ventricle $\rightarrow$ Gills $\rightarrow$ Body) vs **4-Chambered Mammalian Double Circuit** (Pulmonary loop + Systemic loop).

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **3 Multi-Step Worked Examples (with atomic `StudyMath` LaTeX steps):**
  - *Example 1:* Comparing $\text{SA}/\text{V}$ ratio and diffusion adequacy for a $0.5\text{ mm}$ flatworm vs a $12\text{ mm}$ tissue block.
  - *Example 2:* Calculating resting vs sprint Cardiac Output ($\text{CO} = \text{HR} \times \text{SV}$) and full-body circulation time ($t = V_{\text{blood}}/\text{CO}$) for Chinedu at Surulere Stadium.
  - *Example 3:* Comparing systemic arterial pressure delivery in a *Tilapia* single circuit ($P_{\text{vent}} = 48\text{ mmHg}$, $65\%$ pressure loss across gill capillaries) vs a human double circuit ($P_{\text{LV}} = 120\text{ mmHg}$).
- **The Bridge (`#bridge`) & 12 Original MCQs (`window.LESSON_QUIZ`).**

#### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + 40 min home)
- Self-assessment rubric (`1–4`), Exit Ticket, Blank-Page Recall, Part A Home Investigation (Comparing pulse rate recovery and observing live earthworm dorsal vessel vs insect movement), Part B 30-mark Written Paper (`b1`–`b8`), and Teacher Notes.

---

### LESSON 02: Structure of the Mammalian Heart & The Complete Double-Circulation Pathway
- **Folder:** `topics/ss2-bio-heart-circulation/html/lessons/lesson-02/`
- **Duration:** 80 min · **Competences:** `L1` (Structure-function analysis), `L4` (Anatomical diagrams), `L5` (3D dissection)

#### Phase 0 · Warm-up (`#donow` · 5 min) — 4 Spaced Retrieval Cards from Lesson 01 (`from: 1`)
1. Why does a mammal require a circulatory system whereas a unicellular *Amoeba* does not?
2. State three differences between an open circulatory system (cockroach) and a closed circulatory system (mammal).
3. Why is double circulation in a 4-chambered heart more efficient than single circulation in a 2-chambered fish heart?
4. Calculate the cardiac output ($\text{CO}$) in $\text{L/min}$ if $\text{HR} = 80\text{ bpm}$ and $\text{SV} = 65\text{ mL}$.

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story (`story.js` — 6 beats at Surulere Market Butcher Stall & LUTH Anatomy Lab):**
  - *Beat 1:* Chinedu and Nurse Kemi inspect a freshly longitudinally sliced goat heart at Surulere Market; Chinedu notices the left ventricular wall is $15\text{ mm}$ thick while the right ventricular wall is only $5\text{ mm}$ thick!
  - *Beat 2:* Coach Danjuma points to the left side of the diagram in his notebook and calls it the "left ventricle", and says all arteries carry oxygenated blood.
  - *Beat 3:* Nurse Kemi corrects both exam traps: in a front (ventral) view, the patient's **right atrium and right ventricle** are on the **viewer's left**, and the **pulmonary artery** is the one artery that carries **deoxygenated** blood (from $\text{RV} \rightarrow \text{Lungs}$)!
  - *Beat 4:* Nurse Kemi tugs the tough white **chordae tendineae** anchored to **papillary muscles**, showing how they stop the **tricuspid** (right, 3 cusps) and **bicuspid/mitral** (left, 2 cusps) valves from turning inside out when the ventricles contract.
  - *Beat 5:* What feeds the heart muscle itself, and where does glucose from Chinedu's pre-race meal go first? **Coronary arteries** from the base of the aorta feed the myocardium, while the **hepatic portal vein** carries nutrient-rich blood from the ileum straight to the **liver** before the heart!
  - *Beat 6:* Dr. Halima welcomes them to the LUTH 3D Heart Dissection & Pathway Tracer Bench.

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Interactive Sort Game (10 cards into 3 bins: `Right Side / Pulmonary Circuit`, `Left Side / Systemic Circuit`, `Protective Coverings, Septum & Valve Anchors`):**
  1. `Receives deoxygenated blood from Superior and Inferior Venae Cavae` $\rightarrow$ `Right Side / Pulmonary Circuit`
  2. `Tricuspid valve (3 cusps) prevents backflow into Right Atrium` $\rightarrow$ `Right Side / Pulmonary Circuit`
  3. `Pumps deoxygenated blood through Pulmonary Semilunar Valve into Pulmonary Artery` $\rightarrow$ `Right Side / Pulmonary Circuit`
  4. `Receives oxygenated blood from the lungs via four Pulmonary Veins` $\rightarrow$ `Left Side / Systemic Circuit`
  5. `Bicuspid (mitral) valve (2 cusps) guards the left atrioventricular opening` $\rightarrow$ `Left Side / Systemic Circuit`
  6. `Thickest myocardial wall (3× right ventricle) pumping blood into the Aorta at 120 mmHg` $\rightarrow$ `Left Side / Systemic Circuit`
  7. `Coronary arteries branching from the base of the Aorta to supply cardiac muscle` $\rightarrow$ `Left Side / Systemic Circuit`
  8. `Pericardium double membrane with pericardial fluid reducing friction during beating` $\rightarrow$ `Protective Coverings, Septum & Valve Anchors`
  9. `Thick muscular interventricular septum preventing mixing of oxygenated and deoxygenated blood` $\rightarrow$ `Protective Coverings, Septum & Valve Anchors`
  10. `Chordae tendineae and papillary muscles stopping AV valve flaps from inverting` $\rightarrow$ `Protective Coverings, Septum & Valve Anchors`
- **3D Virtual Lab Bench (`bench.js` — 3D Mammalian Heart Dissector & Chamber Wall-Pressure Bench):**
  - Interactive 3D cut-away heart specimen measuring myocardial wall thickness $w\ (\text{mm})$ and peak systolic pressure $P\ (\text{mmHg})$ across 5 regions (`Trials A–E`: Right Atrium $w = 2.0\text{ mm}, P = 16\text{ mmHg}$; Left Atrium $w = 3.0\text{ mm}, P = 24\text{ mmHg}$; Right Ventricle Base $w = 5.0\text{ mm}, P = 40\text{ mmHg}$; Left Ventricle Mid-Wall $w = 12.0\text{ mm}, P = 96\text{ mmHg}$; Left Ventricle Apex/Wall $w = 15.0\text{ mm}, P = 120\text{ mmHg}$, giving constant Laplace pressure-to-thickness ratio $P/w = 8.0\text{ mmHg/mm}$).
  - 3 conditions: `std` (Normal Adult Heart, $k = 8.0\text{ mmHg/mm}$), `heavy` (Endurance Athlete Hypertrophy, $k = 10.0\text{ mmHg/mm}$), `wide` (Ischaemic / Septal Defect Heart — reduced pressure efficiency).

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts & Equations (`.eq`):**
  - Equation 1 (Wall-Thickness Ratio): $R_{\text{wall}} = \frac{w_{\text{LV}}}{w_{\text{RV}}} = \frac{15.0\text{ mm}}{5.0\text{ mm}} = 3.0$
  - Equation 2 (Stroke Volume & Ejection Fraction): $\text{SV} = \text{EDV} - \text{ESV} = 120\text{ mL} - 50\text{ mL} = 70\text{ mL}$, $\text{EF} = \frac{\text{SV}}{\text{EDV}}\times 100\% = \frac{70}{120}\times 100\% = 58.3\%$
  - Equation 3 (WAEC Heart Diagram Magnification): $M = \frac{I}{A} = \frac{150\text{ mm}}{100\text{ mm}} = \times 1.5$
- **Complete 9-Step Double-Circulation Pathway & Special Circuits (Coronary & Hepatic Portal):**
  - Detailed tables for the 4 chambers, 4 valves, attached vessels, and organ-to-organ route tracing (Ileum $\rightarrow$ Brain; Liver $\rightarrow$ Kidney; Arm vein $\rightarrow$ Leg muscle).
- **3D Concept Zoom (`zoom.js`):** 3D Atrioventricular Valve & Chordae Tendineae Action + 3D Hepatic Portal & Systemic Route Tracer.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **3 Multi-Step Worked Examples:**
  - *Example 1:* Left vs Right ventricular wall thickness ratio ($w_{\text{LV}}/w_{\text{RV}}$) and peak pressure ratio ($P_{\text{LV}}/P_{\text{RV}}$) in a dissected goat heart.
  - *Example 2:* End-Diastolic Volume ($\text{EDV}$), End-Systolic Volume ($\text{ESV}$), Stroke Volume ($\text{SV}$), and Ejection Fraction ($\text{EF}\%$).
  - *Example 3:* WAEC longitudinal heart drawing magnification ($M = I / A$) and actual septum length calculation.

#### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + 40 min home)
- Self-assessment rubric (`1–4`), Exit Ticket, Blank-Page Recall, Part A Home Investigation (Inspecting a goat/chicken heart from the local market and drawing its longitudinal section), Part B 30-mark Written Paper (`b1`–`b8`), and Teacher Notes.

---

### LESSON 03: Working of the Heart — Cardiac Cycle, Pacemaker (SAN/AVN), Heart Sounds, Pulse & Blood Pressure
- **Folder:** `topics/ss2-bio-heart-circulation/html/lessons/lesson-03/`
- **Duration:** 80 min · **Competences:** `L1` (Quantitative physiology), `L3` (Health & BP monitoring), `L4` (Graph & ECG literacy)

#### Phase 0 · Warm-up (`#donow` · 5 min) — 4 Spaced Retrieval Cards from Lessons 01–02 (`from: 1, 2`)
1. Which chamber of the mammalian heart has the thickest muscular wall, and why?
2. Distinguish between the tricuspid valve and the bicuspid (mitral) valve in location and number of cusps.
3. Why is the pulmonary artery considered an artery even though it carries deoxygenated blood?
4. Trace the path of a glucose molecule from the ileum to the inferior vena cava.

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story (`story.js` — 6 beats at Surulere Stadium Medical Tent & LUTH Cardiology Lab):**
  - *Beat 1:* After Chinedu's sprint, Dr. Halima listens to his chest with a stethoscope (*"Lub-Dub, Lub-Dub"*) and measures his radial pulse at the wrist ($150\text{ bpm}$) and blood pressure ($150/85\text{ mmHg}$) with a sphygmomanometer.
  - *Beat 2:* Coach Danjuma wonders if the *"Lub-Dub"* sounds are made by cardiac muscle fibres slamming together, and whether the brain sends a nerve signal for every single beat.
  - *Beat 3:* Dr. Halima explains that cardiac muscle is **myogenic**! An isolated frog or mammalian heart continues beating in oxygenated Ringer's solution because the **Sinoatrial Node (SAN)** in the right atrial wall fires electrical impulses on its own!
  - *Beat 4:* Nurse Kemi traces the electrical wave: $\text{SAN} \rightarrow \text{Atria contract} \rightarrow \text{AVN (0.1 s delay)} \rightarrow \text{Bundle of His (in septum)} \rightarrow \text{Purkinje fibres} \rightarrow \text{Ventricles contract from apex upward}$!
  - *Beat 5:* And what makes the *"Lub-Dub"* sounds? **"Lub" ($S_1$)** is the closure of the **tricuspid and bicuspid (AV) valves** when ventricular systole begins; **"Dub" ($S_2$)** is the sharp snap of the **semilunar valves** when ventricular diastole begins!
  - *Beat 6:* Let's step up to the 3D Cardiac Cycle, Stethoscope & Sphygmomanometer Bench!

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Interactive Sort Game (9 cards into 3 bins: `Atrial Systole (0.1 s)`, `Ventricular Systole (0.3 s)`, `Complete Cardiac Diastole (0.4 s)`):**
  1. `Sinoatrial Node (SAN) fires and both atria contract simultaneously` $\rightarrow$ `Atrial Systole (0.1 s)`
  2. `Remaining blood is pushed through open tricuspid and bicuspid valves into ventricles` $\rightarrow$ `Atrial Systole (0.1 s)`
  3. `Impulse travels down Bundle of His and Purkinje fibres; both ventricles contract strongly` $\rightarrow$ `Ventricular Systole (0.3 s)`
  4. `Tricuspid and bicuspid valves slam shut, producing the first heart sound ("Lub")` $\rightarrow$ `Ventricular Systole (0.3 s)`
  5. `Aortic and pulmonary semilunar valves forced open as blood is ejected at high pressure` $\rightarrow$ `Ventricular Systole (0.3 s)`
  6. `Ventricles relax, pressure drops, and semilunar valves snap shut ("Dub")` $\rightarrow$ `Complete Cardiac Diastole (0.4 s)`
  7. `Both atria and ventricles are relaxed while blood flows passively from venae cavae and pulmonary veins` $\rightarrow$ `Complete Cardiac Diastole (0.4 s)`
  8. `Lasts 0.4 s out of every 0.8 s beat at rest, giving the myocardium time to recover and receive coronary blood` $\rightarrow$ `Complete Cardiac Diastole (0.4 s)`
  9. `Impulse pauses briefly (0.1 s) at the Atrioventricular Node (AVN) before ventricular contraction` $\rightarrow$ `Atrial Systole (0.1 s)`
- **3D Virtual Lab Bench (`bench.js` — 3D Cardiac Output, Stethoscope & Sphygmomanometer Bench):**
  - 5 Trials (`A`–`E`) across Heart Rates $\text{HR} \in \{60, 75, 100, 120, 150\}\text{ bpm}$:
    - Condition `std` (Standard Stroke Volume $\text{SV} = 0.070\text{ L} = 70\text{ mL}$): Cardiac Output $\text{CO} = \text{HR} \times \text{SV} \in \{4.20, 5.25, 7.00, 8.40, 10.50\}\text{ L/min}$ and beat period $T = 60/\text{HR} \in \{1.00, 0.80, 0.60, 0.50, 0.40\}\text{ s}$.
    - Condition `heavy` (Adrenaline / Sympathetic Inotropy $\text{SV} = 0.110\text{ L}$): slope rises to $0.110\text{ L/beat}$.
    - Condition `wide` (Dehydrated / Heat-Exhaustion Drop in Venous Return): stroke volume falls at high heart rate.

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts & Equations (`.eq`):**
  - Equation 1 (Cardiac Cycle Period & Phases): $T = \frac{60\text{ s}}{\text{HR}} = \frac{60}{75\text{ bpm}} = 0.80\text{ s} = 0.10\text{ s (atrial systole)} + 0.30\text{ s (ventricular systole)} + 0.40\text{ s (diastole)}$
  - Equation 2 (Cardiac Output): $\text{CO} = \text{HR} \times \text{SV} = 150\text{ bpm} \times 110\text{ mL} = 16{,}500\text{ mL/min} = 16.50\text{ L/min}$
  - Equation 3 (Pulse Pressure & Mean Arterial Pressure): $\text{PP} = P_{\text{sys}} - P_{\text{dia}} = 120 - 80 = 40\text{ mmHg}$, $\text{MAP} = P_{\text{dia}} + \frac{\text{PP}}{3} = 80 + \frac{40}{3} = 93.3\text{ mmHg}$
- **3D Concept Zoom (`zoom.js`):** 3D Heart Electrical Conduction System ($\text{SAN} \rightarrow \text{AVN} \rightarrow \text{Bundle of His} \rightarrow \text{Purkinje Fibres}$) + Live Valve & Heart Sound (*"Lub-Dub"*) Synchroniser.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **3 Multi-Step Worked Examples:**
  - *Example 1:* Cardiac cycle period ($T = 60/\text{HR}$), number of heartbeats per day, and total daily volume pumped by the left ventricle.
  - *Example 2:* Calculating Pulse Pressure ($\text{PP}$) and Mean Arterial Pressure ($\text{MAP}$) from sphygmomanometer readings ($120/80\text{ mmHg}$ vs $165/105\text{ mmHg}$ in hypertension).
  - *Example 3:* Comparing resting vs sprinting Cardiac Output ($\text{CO} = \text{HR} \times \text{SV}$) when sympathetic stimulation and adrenaline increase both $\text{HR}$ and $\text{SV}$.

#### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + 40 min home)
- Self-assessment rubric (`1–4`), Exit Ticket, Blank-Page Recall, Part A Home Investigation (Measuring radial and carotid pulse at rest, immediately after 30 step-ups, and at 1, 2, and 5 minutes of recovery), Part B 30-mark Written Paper (`b1`–`b8`), and Teacher Notes.

---

### LESSON 04: Blood Vessels, Capillary Exchange, the Lymphatic System & Cardiovascular Disorders
- **Folder:** `topics/ss2-bio-heart-circulation/html/lessons/lesson-04/`
- **Duration:** 80 min · **Competences:** `L1` (Systems thinking), `L3` (Cardiovascular health & prevention), `L4` (Histological cross-sections)

#### Phase 0 · Warm-up (`#donow` · 5 min) — 4 Spaced Retrieval Cards from Lessons 02–03 (`from: 2, 3`)
1. List the four structures of the heart's electrical conduction system in the exact order an impulse travels.
2. What causes the first heart sound (*"Lub"*) and the second heart sound (*"Dub"*)?
3. Calculate the duration of one cardiac cycle ($T$) and the cardiac output ($\text{CO}$) when $\text{HR} = 100\text{ bpm}$ and $\text{SV} = 80\text{ mL}$.
4. Name two nerves and one hormone that regulate heart rate, stating where the cardiovascular centre is located in the brain.

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story (`story.js` — 6 beats at Surulere Clinic & LUTH Vascular Lab):**
  - *Beat 1:* At the Surulere Clinic, Chinedu asks why the superficial blue-green vessels on the back of his hand bulge when he lowers his arm, why nurses draw blood from veins instead of arteries, and why his grandmother's ankles swell (oedema) after sitting on a long bus trip from Lagos to Abuja.
  - *Beat 2:* Coach Danjuma guesses that capillaries have thick muscular walls to push blood back to the heart, and that fluid leaked from capillaries is lost forever.
  - *Beat 3:* Nurse Kemi explains the 3-vessel design: **Arteries** have thick elastic and muscular walls with a narrow lumen to withstand high pulsatile pressure; **Capillaries** are a single endothelial cell thick so oxygen and glucose diffuse rapidly; **Veins** have thin walls, wide lumens, and **pocket semilunar valves** aided by contracting skeletal muscles!
  - *Beat 4:* How does tissue fluid form? At the **arterial end** of a capillary bed, hydrostatic blood pressure ($P_c = 35\text{ mmHg}$) exceeds plasma protein osmotic pressure ($\pi_c = 25\text{ mmHg}$), forcing water, glucose, amino acids, and $\text{O}_2$ out as **tissue fluid** while red blood cells and large plasma proteins stay behind!
  - *Beat 5:* At the **venous end** ($P_c = 15\text{ mmHg} < \pi_c = 25\text{ mmHg}$), most fluid re-enters by osmosis, and the remaining $15\%$ drains into blind-ended **lymph capillaries** $\rightarrow$ **lymph nodes** $\rightarrow$ **thoracic duct** $\rightarrow$ **subclavian vein**! If filarial worms (*Wuchereria bancrofti*) block lymph vessels, severe swelling (**elephantiasis**) results!
  - *Beat 6:* Dr. Halima invites them to the 3D Blood Vessel Hemodynamics & Capillary Ultrafiltration Bench.

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Interactive Sort Game (9 cards into 3 bins: `Arteries`, `Veins`, `Capillaries & Lymphatics`):**
  1. `Carry blood AWAY from the heart at high, pulsatile pressure (spurts when cut)` $\rightarrow$ `Arteries`
  2. `Thick muscular and elastic wall (tunica media) with a narrow lumen and no valves (except aorta/pulmonary base)` $\rightarrow$ `Arteries`
  3. `Renal artery (to kidney), Hepatic artery (to liver), Carotid artery (to brain)` $\rightarrow$ `Arteries`
  4. `Carry blood TOWARD the heart at low, steady pressure (flows steadily when cut)` $\rightarrow$ `Veins`
  5. `Thin wall with wide lumen and pocket semilunar valves to prevent backflow against gravity` $\rightarrow$ `Veins`
  6. `Jugular vein (from brain), Hepatic portal vein (ileum to liver), Venae cavae` $\rightarrow$ `Veins`
  7. `Wall is one cell thick (squamous endothelium only); red blood cells squeeze through in single file` $\rightarrow$ `Capillaries & Lymphatics`
  8. `Site of ultrafiltration where hydrostatic pressure forces plasma out to form tissue fluid` $\rightarrow$ `Capillaries & Lymphatics`
  9. `Blind-ended vessels with valves and lymph nodes returning excess tissue fluid to the subclavian vein` $\rightarrow$ `Capillaries & Lymphatics`
- **3D Virtual Lab Bench (`bench.js` — 3D Capillary Ultrafiltration & Starling Pressure Bench):**
  - Left side: 3D Histological Cross-Section comparer of Artery (thick wall, narrow lumen), Vein (thin wall, wide lumen, pocket valve), and Capillary (single-cell endothelium).
  - Right side: 3D Capillary-Tissue-Lymphatic Bed measuring Capillary Hydrostatic Pressure $P_c\ (\text{mmHg})$ and Net Filtration Pressure $\text{NFP} = P_c - \pi_c\ (\text{mmHg})$ across 5 positions along a capillary from Arterial End ($x = 0.0$) to Venous End ($x = 1.0$):
    - `Trials A–E`: $P_c \in \{35.0, 30.0, 25.0, 20.0, 15.0\}\text{ mmHg}$ with colloid osmotic pressure $\pi_c = 25.0\text{ mmHg}$, giving $\text{NFP} = P_c - \pi_c \in \{+10.0, +5.0, 0.0, -5.0, -10.0\}\text{ mmHg}$ (Filtration at A & B, Equilibrium at C, Osmotic Reabsorption at D & E).
    - 3 conditions: `std` (Normal $\pi_c = 25\text{ mmHg}$), `heavy` (Protein Malnutrition / Kwashiorkor $\pi_c = 15\text{ mmHg} \rightarrow$ positive NFP everywhere causing oedema!), `wide` (Venous Hypertension / Filarial Lymphatic Blockage).

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts & Equations (`.eq`):**
  - Equation 1 (Net Filtration Pressure at Arterial vs Venous End): $\text{NFP} = P_c - \pi_c = 35\text{ mmHg} - 25\text{ mmHg} = +10\text{ mmHg (filtration)}$ and at the venous end $\text{NFP} = 15\text{ mmHg} - 25\text{ mmHg} = -10\text{ mmHg (reabsorption)}$.
  - Equation 2 (Continuity / Velocity Slowdown in Capillaries): $v_{\text{cap}} = v_{\text{aorta}} \times \frac{A_{\text{aorta}}}{A_{\text{cap}}} = 300\text{ mm/s} \times \frac{3.0\text{ cm}^2}{1800\text{ cm}^2} = 0.50\text{ mm/s}$
  - Equation 3 (Daily Lymphatic Return Balance): $V_{\text{lymph}} = V_{\text{filtered}} - V_{\text{reabsorbed}} = 20.0\text{ L/day} - 17.0\text{ L/day} = 3.0\text{ L/day}$
- **Comprehensive Tables:**
  1. Five-point WAEC/NECO table: Artery vs Vein vs Capillary.
  2. Major Named Blood Vessels Table (Lungs, Brain, Arms, Liver, Gut/Ileum, Kidneys, Legs, Heart Muscle).
  3. Blood vs Tissue Fluid vs Lymph comparison table.
  4. Cardiovascular Disorders Table (Hypertension, Atherosclerosis, Coronary Thrombosis, Stroke, Varicose Veins, Hole in the Heart, Anaemia, Sickle-Cell Anaemia, Leukaemia, Haemophilia).
- **3D Concept Zoom (`zoom.js`):** 3D Artery, Vein (with Pocket Valves & Skeletal Muscle Pump) & Capillary Ultrafiltration / Lacteal Zoom.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **3 Multi-Step Worked Examples:**
  - *Example 1:* Calculating Net Filtration Pressure ($\text{NFP} = P_c - \pi_c$) at the arterial and venous ends of a capillary bed in a healthy student vs a patient with low plasma albumin (kwashiorkor oedema).
  - *Example 2:* Calculating capillary blood flow velocity from total cross-sectional area ($v_2 = v_1 A_1 / A_2$) and transit time across a $0.75\text{ mm}$ capillary.
  - *Example 3:* Calculating daily lymphatic drainage volume ($V_{\text{lymph}} = V_{\text{filt}} - V_{\text{reabs}}$) and hourly thoracic duct flow rate.

#### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + 40 min home)
- Self-assessment rubric (`1–4`), Exit Ticket, Blank-Page Recall, Part A Home Investigation (Observing venous valves on the forearm and interviewing family members on hypertension prevention), Part B 30-mark Written Paper (`b1`–`b8`), and Teacher Notes.

---

### LESSON 05: Composition of Blood, Clotting Cascade, ABO/Rhesus Blood Groups & WAEC Paper 3 Practical Clinic
- **Folder:** `topics/ss2-bio-heart-circulation/html/lessons/lesson-05/`
- **Duration:** 80 min · **Competences:** `L3` (Blood safety, genotype & Rhesus awareness), `L4` (Paper 3 drawing & microscopy), `L6` (Clinical laboratory skills)

#### Phase 0 · Warm-up (`#donow` · 5 min) — 4 Spaced Retrieval Cards from Lessons 01–04 (`from: 1, 2, 3, 4`)
1. State four structural differences between an artery and a vein.
2. Which blood vessel carries nutrient-rich blood from the ileum to the liver, and which vessel carries blood from the liver to the inferior vena cava?
3. How does tissue fluid form at the arterial end of a capillary, and how does lymph re-enter the blood circulation?
4. Distinguish between atherosclerosis and coronary thrombosis, and state two lifestyle measures that prevent them.

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story (`story.js` — 6 beats at LUTH Haematology & Blood Bank Lab):**
  - *Beat 1:* At LUTH Idi-Araba Emergency Blood Bank, Chinedu watches Dr. Halima spin a blood sample in a centrifuge: $55\%$ pale-yellow **plasma** rises to the top while $45\%$ **blood cells** settle at the bottom!
  - *Beat 2:* Coach Danjuma says that red blood cells have large nuclei to help them live forever, and that anyone with Blood Group AB can donate blood to any patient in an emergency.
  - *Beat 3:* Dr. Halima corrects him immediately! Mature mammalian **erythrocytes (red blood cells)** have **NO nucleus** and a **biconcave disc shape** so they can pack $280\text{ million}$ haemoglobin molecules and squeeze through narrow capillaries for $120\text{ days}$!
  - *Beat 4:* Nurse Kemi explains **blood clotting (coagulation)**: when skin is cut, platelets and damaged tissue release **thromboplastin**, which uses **$\text{Ca}^{2+}$ ions** and **Vitamin K** to convert inactive **prothrombin** into active **thrombin**; thrombin then converts soluble **fibrinogen** into an insoluble **fibrin** mesh!
  - *Beat 5:* And in the Blood Bank: **Group O** has neither Antigen A nor Antigen B on its red cells, making it the **universal red-cell donor**, whereas **Group AB** has no anti-a or anti-b antibodies in its plasma, making it the **universal recipient**! Plus, an **$\text{Rh}^-$ mother** carrying an **$\text{Rh}^+$ baby** needs an **anti-D injection** after birth to prevent **erythroblastosis foetalis**!
  - *Beat 6:* Let's step up to the 3D Blood Smear, Coagulation & WAEC Paper 3 Practical Clinic Bench!

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Interactive Sort Game (10 cards into 3 bins: `Erythrocytes & Plasma`, `Leucocytes & Immunity`, `Platelets, Clotting & ABO/Rhesus`):**
  1. `Biconcave disc lacking a nucleus in mature mammals; ~5,000,000 per mm³ of blood` $\rightarrow$ `Erythrocytes & Plasma`
  2. `Contains haemoglobin which reversibly binds oxygen in the lungs to form bright-red oxyhaemoglobin` $\rightarrow$ `Erythrocytes & Plasma`
  3. `Pale-yellow fluid (55% of blood volume) transporting glucose, amino acids, urea, hormones, and HCO₃⁻` $\rightarrow$ `Erythrocytes & Plasma`
  4. `Phagocytes (neutrophils and monocytes) with lobed nuclei that engulf bacteria by phagocytosis` $\rightarrow$ `Leucocytes & Immunity`
  5. `Lymphocytes with a large round nucleus that secrete specific antibodies (antitoxins and agglutinins)` $\rightarrow$ `Leucocytes & Immunity`
  6. `Nucleated cells numbering about 7,000–8,000 per mm³; overproduction in bone marrow causes leukaemia` $\rightarrow$ `Leucocytes & Immunity`
  7. `Tiny non-nucleated cell fragments (~250,000 per mm³) that release thromboplastin when a vessel is cut` $\rightarrow$ `Platelets, Clotting & ABO/Rhesus`
  8. `Thrombin converts soluble plasma fibrinogen into insoluble fibrin threads in the presence of Ca²⁺ and Vitamin K` $\rightarrow$ `Platelets, Clotting & ABO/Rhesus`
  9. `Blood Group O red cells lack Antigens A and B (universal donor); Group AB plasma lacks anti-a and anti-b (universal recipient)` $\rightarrow$ `Platelets, Clotting & ABO/Rhesus`
  10. `Haemolytic disease of the newborn (erythroblastosis foetalis) when an Rh⁻ mother carries a subsequent Rh⁺ foetus` $\rightarrow$ `Platelets, Clotting & ABO/Rhesus`
- **3D Virtual Lab Bench (`bench.js` — 3D Blood Smear Microscopy, ABO Cross-Match & WAEC Paper 3 Magnification Bench):**
  - 5 Trials (`A`–`E`): Actual specimen size $A = 80\text{ mm}$ (goat heart specimen drawing at magnifications $M \in \{1.0, 1.25, 1.50, 1.75, 2.00\}$ giving drawing length $I = M \times A \in \{80, 100, 120, 140, 160\}\text{ mm}$, and simultaneously testing 5 clinical blood samples `A`, `B`, `AB`, `O`, and `Rh⁻ Cross-Match`).
  - 3 conditions: `std` (WAEC Compliant Heart Drawing & Safe Cross-Match: $A = 80\text{ mm}$), `heavy` (Large Adult Human Heart Specimen: $A = 120\text{ mm}$), `wide` (Incompatible Transfusion Agglutination / Shaded Drawing Penalty).

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts & Equations (`.eq`):**
  - Equation 1 (Oxygen-Carrying Capacity of Blood): $C_{\text{O}_2} = [\text{Hb}] \times 1.34\text{ mL O}_2/\text{g} = 15\text{ g/dL} \times 1.34 = 20.1\text{ mL O}_2\text{ per }100\text{ mL blood}$
  - Equation 2 (RBC : WBC : Platelet Numerical Ratio): $\text{Ratio}_{\text{RBC}:\text{WBC}} = \frac{5{,}000{,}000\text{ mm}^{-3}}{8{,}000\text{ mm}^{-3}} = 625 : 1$
  - Equation 3 (WAEC Paper 3 Drawing Magnification): $M = \frac{I}{A} = \frac{120\text{ mm}}{80\text{ mm}} = \times 1.5$
- **Comprehensive Tables:**
  1. Red Blood Cells vs White Blood Cells vs Platelets (Shape, Nucleus, Number per $\text{mm}^3$, Site of production, Lifespan, Function).
  2. Complete 4-Stage Enzymatic Blood Clotting Cascade + Anticoagulants (Heparin, Sodium Citrate, Warfarin) & Haemophilia.
  3. Complete ABO Blood Group & Rhesus Compatibility Matrix (Antigen on RBC, Antibody in Plasma, Safe Donors, Safe Recipients).
  4. WAEC Paper 3 Practical Checklist (Heart Dissection Specimen, Artery vs Vein Slide, Blood Smear Slide, and 10-Point Drawing Rubric).
- **3D Concept Zoom (`zoom.js`):** 3D Erythrocyte Biconcave Disc, Fibrin Mesh Coagulation & ABO Antigen-Antibody Agglutination Stage.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **3 Multi-Step Worked Examples:**
  - *Example 1:* Calculating total red blood cells in $5.0\text{ L}$ of adult blood and comparing the $\text{RBC}:\text{Platelet}:\text{WBC}$ ratio.
  - *Example 2:* Calculating total oxygen volume bound by haemoglobin in $5.0\text{ L}$ of normal blood ($[\text{Hb}] = 15\text{ g/dL}$) vs severe anaemia ($[\text{Hb}] = 7.5\text{ g/dL}$).
  - *Example 3:* WAEC Paper 3 longitudinal heart drawing magnification ($M = I / A$) and actual erythrocyte diameter from a photomicrograph ($\times 2500$).

#### Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + 40 min home)
- Self-assessment rubric (`1–4`), Exit Ticket, Blank-Page Recall, Part A Home Investigation (Family ABO/Rhesus & Hb genotype awareness survey + practice 10-minute unshaded longitudinal heart drawing), Part B 30-mark Written & Practical Paper (`b1`–`b8`), and Teacher Notes.

---

## Part III — Nigerian English (`en-NG`) Narrator Choreography Plan

- **Voice Priority:** `en-NG` (Nigerian English) ranked `#1`, followed by `en-GH`, `en-KE`, `en-ZA`, `en-GB`.
- **Welcome Hub (`welcome-narration.js`):** 11-step guided tour spotlighting the Hero Title, 3D Beating Heart Lab (switching between `heart`, `circuit`, and `pace` modes), Unit Mystery, 5-Lesson Journey cards, Interactive Wiggers/Circulation Explorer, Calculation Archetypes, Myth-Busters, and Inquiry Loop.
- **Lessons 01–05 (`narration.js`):** 26–28 steps per lesson guiding the student through the Hero, Do Now flashcards, 3D StoryStage playback, Wonder Wall, Interactive Sort Game (with `"Your turn!"` pause), 3D Lab Bench trials (`bench.setCond`, `bench.test`, `"Your turn!"` wait for `lX:bench-done`), Live Graph, Core Concepts, StudyMath LaTeX equations, 3D Zoom stage (`zoom.setMode`, `zoom.add`), Worked Examples, The Bridge, Interactive Quiz (with dynamic score reaction), Reflection, and Assignment.
