---
slug: ss2-bio-heart-circulation
title: The Human Heart and Blood Circulation
subject: Biology
class: SS2
exams: [WAEC, NECO, JAMB]
lessons: 7
duration_min: 80
version: 3
---

# Multi-Lesson Unit Plan: The Human Heart and Blood Circulation (`ss2-bio-heart-circulation`)

---

## Part I: Unit Welcome Hub (`html/index.html`)

### 1. Hero & 3D Hero Lab
- **Eyebrow:** `SS2 BIOLOGY · WAEC · NECO · JAMB · PAPER 3 PRACTICAL`
- **Display title:** `The Heart and *the Rivers Inside You*`
- **Lede:** On health day at Oja Oba market in Ibadan, Dr Aisha's whiteboard fills with three puzzles: a footballer's racing pulse, a pepper seller's swollen ankles and an injured okada rider who needs the right blood fast. Open the pump, follow the blood, and solve all three the way a WAEC examiner wants it written.
- **CTAs:** `Start guided tour (en-NG) ▷` (`data-tour`) · `Begin Lesson 1 →` (`lessons/lesson-01/index.html`)
- **Hero meta:** `7 lessons · ~9 h 20 min` · `7 3D labs + 7 3D zooms` · `84 quiz questions + 7 × 30-mark papers` · `Goat-heart dissection clinic`
- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`, `heart-circulation` kit):**
  - `heart`: `HeartKit.heart({ mode: "both" })`; tap any chamber, valve or vessel for its name, what it receives and where it sends blood.
  - `circuit`: `HeartKit.circuitCompare`; buttons *Human (double)* / *Tilapia (single)* / *Cockroach (open)*.
  - `pace`: `HeartKit.heart({ mode: "pace" })`; slider 60–180 bpm; readouts: bpm, cycle time (60 ÷ bpm, s), AV valves open/shut.
  - HUD readouts: mode, bpm, cycle time, current valve state.

### 2. Marquee (12 terms)
SA : V = 6/L · double circulation · tricuspid on the right · bicuspid (mitral) · chordae tendineae · SAN pacemaker · lub = AV valves · dub = semilunar valves · 120/80 mmHg · NFP = Pc − πc · fibrinogen → fibrin · O gives, AB receives

### 3. Unit Mystery Case File (`#mystery`)
- **Narrative:** Health Saturday at Oja Oba. Chidi's pulse jumps from 68 to 132 after a sprint through the market, then settles. Mama Bisi's ankles keep a thumb dent and her cuff reads 160/100. An okada rider from the Oyo road arrives bleeding, group B Rh−, and the cool box holds O+, O−, A−, B+, B− and AB−. Baba Sule the butcher has an answer for everything, and most of them are wrong.
- **Clue cards:** the pulse returned to normal in five minutes · the swelling is worst in the evening, after standing all day · the rider's card says Rh negative · only two of the six bags are a safe first choice · Baba Sule's goat heart has one wall far thicker than the other.
- **Exam-weight stats:** `Regularly` the heart diagram and the course of blood appear in WAEC/NECO theory · `Paper 3`: heart specimens, vessel charts and blood-cell slides recur · `JAMB`: Transport topic, quick-recall items on heart parts, vessels, blood groups.

### 4. Lesson Journey (`#journey`)
Seven cards linking to `lessons/lesson-01/` … `lesson-07/`, each with duration (80 min), tags and a one-line promise (the Part II titles). Thread note: every Do Now pulls cards from earlier lessons, and each lesson closes one piece of the Oja Oba case file.

### 5. Explorer, Archetypes, Myths, Method
- **Explorer tabs (4)** with SVG curve `#combo-curve`:
  - *Surface area : volume*: 6/L for L = 1–30 mm, a falling smooth curve.
  - *Pulse recovery*: Chidi's heart rate against minutes after exercise (132, 116, 96, 80, 72, 68 bpm at 0–5 min), drawn as a smooth curve of best fit.
  - *Pressure along the circuit*: mean pressure from aorta (about 100 mmHg) to venae cavae (about 2 mmHg), steepest fall across the arterioles; a smooth curve (approximate teaching values).
  - *Capillary filtration*: Pc falling from 36 to 16 mmHg along a capillary against a flat πc line at 25 mmHg; the lines cross 55% of the way along.
- **6 calculation archetypes** (StudyMath chains):
  1. SA : V: $\dfrac{6L^2}{L^3} = \dfrac{6}{L} = \dfrac{6}{20\text{ mm}} = 0.30\text{ mm}^{-1}$
  2. Heart rate and cycle time: $18 \times \dfrac{60}{15} = 72\text{ bpm}$; $T = \dfrac{60}{72} = 0.83\text{ s}$
  3. Cardiac output: $68 \times 70\text{ cm}^3 = 4760\text{ cm}^3\text{ min}^{-1} = 4.76\text{ dm}^3\text{ min}^{-1}$
  4. Net filtration pressure: $36 - 25 = +11\text{ mmHg}$ (out) and $16 - 25 = -9\text{ mmHg}$ (in)
  5. Blood speed: $Q = 2.4 \times 35 = 84\text{ cm}^3\text{ s}^{-1}$; $v = \dfrac{84}{2400} = 0.035\text{ cm s}^{-1}$
  6. Red cell count: $\dfrac{480}{0.020\text{ mm}^3} \times 200 = 4.8 \times 10^6\text{ mm}^{-3}$
- **Myth flip cards (3):** see Topic Map § 3.
- **Method (`#method`):** the 5-step inquiry loop · What's inside every lesson (`#kit`) · finale CTA to Lesson 1.

### 6. Spaced Retrieval Bank (`assets/js/retrieval-bank.js`)
`l01` … `l07`, each with `donow` (4 cards, `from`), `quiz` and `recall` arrays, as listed in each lesson's Phase 0 and Phase 5.

---

## Part II: The Seven Lessons

---

### LESSON 01: Why Big Bodies Need a Transport System: Open, Closed, Single and Double Circulation
- **Folder:** `html/lessons/lesson-01/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** An *Amoeba* has no heart, so why does Chidi need one?
- **Objectives:**
  1. **01** · Give four reasons why a large, active animal cannot depend on diffusion alone.
  2. **02** · List the materials carried by blood and name the three parts of a mammalian transport system (pump, channels, medium).
  3. **03** · Calculate SA : V for cubes, converting between mm, cm and m, and relate it to diffusion.
  4. **04** · Compare open and closed circulation, and single and double circulation, with named animals.
  5. **05** · Give two benefits of double circulation.

#### 0. Warm-up · Do Now (5 min, `from: 0`)
1. **Q:** What is diffusion? **A:** The net spreading of particles from a region where they are crowded to a region where they are fewer.
2. **Q:** Which gas does a cell need for aerobic respiration, and which gas does it give off? **A:** It takes in oxygen and gives off carbon dioxide.
3. **Q:** Write SA : V for a cube of side L. **A:** $6L^2 / L^3 = 6/L$.
4. **Q:** Convert 0.40 m to millimetres. **A:** $0.40 \times 1000 = 400\text{ mm}$.

#### 1. Wonder · Story & Wonder Wall (8–10 min)
- **3D Story (`story.js`), set 1 → set 2:**
  1. *Tent*: Dr Aisha (`amaka`) asks Chidi (`cust1`) to fetch a cable from the far end of the market. He sprints off and returns, chest heaving.
  2. *Tent*: She presses two fingers to his wrist and frowns at her watch. "Your heart has nearly doubled its speed. Why should running make it do that?"
  3. *Tent*: Baba Sule (`cust2`) laughs from his stall: "A frog in a gutter has no need to run like that. Small heart, small trouble!"
  4. *Lab*: Dr Aisha shows a jar of pond water under a microscope: an *Amoeba* gliding with no heart and no blood. "This one gets everything by diffusion. Chidi cannot. Today we find out why."
  5. *Lab*: She drops pink agar cubes of four sizes into acid. Invitation to the cube bench.
- **Wonder Wall prompt:** *If oxygen can spread by itself, why bother with a heart and blood at all?*
- **Seed notes:** "Big bodies are too thick for it (Tunde)" · "We move fast, so we use more oxygen (Hauwa)" · "Maybe the skin is too small for the body? (Ifeoma)" · "Animals with no heart have no blood at all (Baba Sule)".

#### 2. Investigate · Sort Game & 3D Practical (25 min)
- **2A Sort (`#sort`):** *How does it move its blood?* Bins: `none` (no transport system: diffusion only) · `open` (open circulation) · `closed-single` (closed, single) · `closed-double` (closed, double). Items (10): *Amoeba* → none · *Paramecium* → none · cockroach → open · garden snail → open · grasshopper → open · tilapia → closed-single · catfish → closed-single · earthworm → closed-single (blood stays in vessels; no separate lung loop) · pigeon → closed-double · Chidi → closed-double. Each item shows a one-line *why* after checking.
- **2B 3D Practical (`bench`, `HeartKit.cube`):** agar-cube diffusion model.
  - **Method cards (4):** (1) Cut cubes of side 5, 10, 20 and 30 mm from agar made with dilute alkali and phenolphthalein (pink). (2) Lower all four into the same beaker of dilute hydrochloric acid at the same moment, using forceps. (3) After 8 minutes, lift each out, blot, cut it in half and measure the depth of the colourless edge. (4) Calculate SA : V and the percentage of each cube's volume that has turned colourless.
  - **Scene parts:** `cube`, `beaker`, `acid`, `forceps`, `ruler`, `tile`, `blade`. **Controls:** cube side 5 / 10 / 20 / 30 mm · *Drop in acid* · *Wait 8 min* · *Cut and measure*. Emits `l1:bench` each cube and `l1:bench-done` after 4 cubes.
  - **Results table (`#results-table`):** Side L (mm) · SA (mm²) · V (mm³) · SA : V (mm⁻¹) · Colourless depth (mm) · Volume still pink (mm³) · % volume colourless.
  - **Expected (`#expected`), acid moved in 3.0 mm on every face:** 5 · 150 · 125 · 1.2 · 3.0 (meets in the middle) · 0 · 100 / 10 · 600 · 1000 · 0.60 · 3.0 · 64 · 93.6 / 20 · 2400 · 8000 · 0.30 · 3.0 · 2744 · 65.7 / 30 · 5400 · 27 000 · 0.20 · 3.0 · 13 824 · 48.8. (The acid went the same depth into every cube, yet the big cube is still half pink in the middle: the same distance serves less of a large body.)
  - **Graph:** % colourless (y) against SA : V (x). The points rise steeply then level off, so draw a **smooth curve of best fit**, not a straight line.
  - **Precautions (past tense):** the cubes were cut on a tile with a sharp blade and checked with a ruler before use · all cubes were placed in the acid at the same moment and lifted out at the same time · the acid fully covered every cube · the cubes were handled with forceps, and eyes were protected from the acid.
  - **Sources of error (with direction):** a cube cut slightly larger than recorded had a real SA : V smaller than the value used, so its % colourless was **too low** for the SA : V plotted · a cube resting flat on the beaker floor had one face shielded from acid, so its % colourless came out **too low** · lifting a cube out late gave the acid extra time, so its % colourless was **too high** · the pale boundary is hard to judge by eye, so the colourless depth may be read **too high or too low** (random error).
  - **Analysis questions (5, locked):** Why was the colourless depth the same in every cube? · Which cube was fully cleared, and why? · What happens to SA : V each time L doubles? (it halves) · What does the pink centre of the 30 mm cube stand for in a large animal? (cells too far from the surface to be supplied in time) · Why does an *Amoeba* not need a heart?

#### 3. Make Sense (15 min)
- **Concepts (`#concepts`):** a *transport system* is the set of parts that carries materials in bulk between the places they are taken in, made, used and removed. In a mammal it has three parts: a **pump** (the heart), **channels** (arteries, capillaries and veins) and a **medium** (blood, with lymph as a second fluid).
- **Why big animals need one (`.callout.big`):** (1) their SA : V is small, so the surface cannot supply the whole volume; (2) most cells lie far from the surface, and diffusion is far too slow over long distances; (3) active animals burn oxygen and food quickly; (4) materials are made in one organ and used in another (hormones, urea, absorbed food).
- **Materials carried:** oxygen, carbon dioxide, products of digestion (amino acids, glucose, glycerol and fatty acids), water and mineral salts, hormones, urea, antibodies and heat.
- **Comparison tables (`#props-table`):**
  - *Open vs closed:* where the blood is (pools in a body cavity, the haemocoel, bathing organs | kept inside vessels the whole way) · pressure and speed (low, sluggish | high, fast) · name of fluid (haemolymph | blood) · examples (cockroach, grasshopper, snail | earthworm, tilapia, frog, pigeon, human).
  - *Single vs double:* trips through the heart per full circuit (one | two) · chambers (two in fish | three in amphibians and most reptiles, four in birds and mammals) · route (heart → gills → body → heart | heart → lungs → heart, then heart → body → heart) · examples (tilapia, catfish | toad, lizard, pigeon, human).
- **Advantages of double circulation (`.callout`):** blood returning from the lungs is pumped a second time, so it reaches the body at high pressure; and with four chambers, oxygen-rich and oxygen-poor blood never mix.
- **Explorer (`#pos-explorer`):** cube-side pins L = 1, 2, 5, 10, 20, 30 mm; each pin shows SA, V, 6/L and the pink centre left after 8 min (3.0 mm penetration), so students see the cleared share collapse as L grows.
- **3D Zoom (`zoom`, `HeartKit.circuitCompare`):** `open` (haemolymph sloshing round organs) → `single` (pressure lost across the gills before the body) → `double` (pressure restored by the second pump); counters: trips through heart per circuit (1 / 1 / 2), pressure reaching body tissues (low / reduced / high).

#### 4. Apply (20 min)
- **Worked Example 1 (SA : V with a unit change):** Find SA : V for a cube of side 2.0 cm, first in cm⁻¹ and then in mm⁻¹.
  1. Surface area: $\text{SA} = 6L^2 = 6 \times (2.0)^2 = 24\text{ cm}^2$.
  2. Volume: $V = L^3 = (2.0)^3 = 8.0\text{ cm}^3$.
  3. Ratio: $\text{SA} : V = 24 / 8.0 = 3.0\text{ cm}^{-1}$ (check: $6/2.0 = 3.0$).
  4. Convert: 1 cm = 10 mm, so "per cm" is ten times "per mm": $3.0\text{ cm}^{-1} = 3.0 / 10 = 0.30\text{ mm}^{-1}$.
  - **Answer:** $3.0\text{ cm}^{-1} = 0.30\text{ mm}^{-1}$ (the same as the 20 mm bench cube).
- **Worked Example 2 (*Amoeba* vs Chidi):** Treat an *Amoeba* as a cube of side 0.20 mm and Chidi's body as a cube of side 0.40 m. How many times larger is the *Amoeba*'s SA : V?
  1. Same units first: $0.40\text{ m} \times 1000 = 400\text{ mm}$.
  2. *Amoeba*: $6 / 0.20 = 30\text{ mm}^{-1}$.
  3. Chidi: $6 / 400 = 0.015\text{ mm}^{-1}$.
  4. Compare: $30 / 0.015 = 2000$.
  - **Answer:** about 2000 times larger, so diffusion through the surface serves the *Amoeba* but cannot serve Chidi.
- **Worked Example 3 (share of a cube reached by acid):** In the bench, acid moved 3.0 mm into every face of the 20 mm cube. What percentage of the cube turned colourless?
  1. Pink centre side: $20 - (2 \times 3.0) = 14\text{ mm}$.
  2. Pink volume: $14^3 = 2744\text{ mm}^3$; whole cube: $20^3 = 8000\text{ mm}^3$.
  3. Colourless volume: $8000 - 2744 = 5256\text{ mm}^3$.
  4. Percentage: $\dfrac{5256}{8000} \times 100 = 65.7\%$.
  - **Answer:** 65.7% colourless; about a third of the cube was still unreached.
- **Worked Example 4 (a model table answer):** "Give the differences between open and closed circulation." Matched table: location of blood (body cavity | vessels) · pressure (low | high) · example (cockroach | earthworm). One feature per row, both columns filled.
- **The Bridge (`#bridge`):** use the cube results and the circuit zoom to explain Dr Aisha's first clue: Chidi's leg muscles are tens of centimetres from his lungs, his SA : V is tiny, and a sprint multiplies their oxygen demand. Only a closed, double, high-pressure system can deliver fast enough. Big Idea: *size and activity make diffusion too slow, so large animals pump blood through closed vessels, and mammals pump it twice.*
- **Quiz (`#quiz`):** 12 questions from `03-questions.md` § Lesson 01.

#### 5. Reflect & Assignment (10 min + 40 min home)
- **I can (1–4):** give four reasons big animals need transport · list what blood carries · calculate SA : V with unit changes · compare open and closed circulation · compare single and double circulation.
- **Exit ticket (2 marks):** SA : V of a 5.0 mm cube, and one advantage of double circulation. (1.2 mm⁻¹; high pressure to the body / no mixing of oxygenated and deoxygenated blood)
- **Blank-page recall:** four reasons · nine materials carried · pump, channels, medium · open vs closed with examples · single vs double with examples · two advantages of double circulation.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 01.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (predicting the cube results), L4 (tables and the curved graph), L5 (cube and circuit simulations).

---

### LESSON 02: The Heart Up Close: Chambers, Walls, Valves and the Goat-Heart Dissection
- **Folder:** `html/lessons/lesson-02/` · **Duration:** 80 min · **Competences:** L3, L4, L6
- **Guiding question:** Baba Sule says the thick side is the right side. Who is right?
- **Objectives:**
  1. **01** · Describe the position of the heart and its three-layered covering and wall.
  2. **02** · Name the four chambers, state where each receives blood from and sends it to, and explain their wall thicknesses.
  3. **03** · Name and locate the four valves, the septum, the chordae tendineae and the great vessels.
  4. **04** · Carry out (or follow) a goat-heart dissection and measure wall thickness.
  5. **05** · Draw a labelled longitudinal section to WAEC rules and calculate drawing magnification and actual size.

#### 0. Do Now (`from: 1`)
1. **Q:** Give two reasons why Chidi needs a transport system. **A:** Small SA : V; cells far from the surface; high activity and oxygen demand.
2. **Q:** Name the pump, the channels and the medium. **A:** Heart; blood vessels; blood.
3. **Q:** How many chambers in a fish heart, and is its circulation single or double? **A:** Two; single.
4. **Q:** State one advantage of double circulation. **A:** Blood reaches the body at high pressure / no mixing.

#### 1. Wonder
- **Story:** (1) *Tent*: Baba Sule (`cust2`) slaps a goat heart on the table: "One side is thick like my thumb. That is the right side, because right is strong!" (2) Chidi (`cust1`) turns it over: "How do you even know which side is which?" (3) Dr Aisha (`amaka`) points to the groove running down the front and the vessels at the top: "These tell us. We will cut it open properly." (4) *Lab*: on the board she draws a heart facing the class, then asks why the labels "right" and "left" look backwards. (5) Invitation to the dissection bench.
- **Wonder Wall prompt:** *Why might one side of the heart need a thicker wall than the other?*
- **Seed notes:** "The thick side pumps further? (Kemi)" · "It holds more blood (Sani)" · "The thin side is weak or sick (Ngozi)" · "Right is always the stronger side (Baba Sule)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Which side of the heart?* Bins: `right` · `left` · `both`. Items (10): tricuspid valve → right · bicuspid (mitral) valve → left · venae cavae enter here → right · pulmonary veins enter here → left · aorta leaves here → left · pulmonary artery leaves here → right · thickest ventricle wall → left · holds deoxygenated blood → right · chordae tendineae → both · semilunar valve at the exit vessel → both.
- **2B 3D Practical (`bench`, `HeartKit.heart`, `dissect` and `specimen` modes):** goat-heart dissection.
  - **Method cards (4):** (1) Wearing gloves, rinse the heart, lay it front side up (the side with the diagonal groove) and identify the great vessels by feel: the thick, rubbery aorta and the thinner pulmonary artery. (2) With the scalpel blade facing away from you, cut from the apex upwards through both ventricles to expose all four chambers. (3) Find the septum, both atrioventricular valves, the chordae tendineae and papillary muscles, and the semilunar pockets at the exit vessels. (4) At mid-height, measure the wall of each chamber and the septum twice with a ruler held at eye level, and record the mean.
  - **Scene parts:** `ra`, `la`, `rv`, `lv`, `septum`, `tricuspid`, `bicuspid`, `chordae`, `papillary`, `aorta`, `pulmonaryArtery`, `pulmonaryVeins`, `venaeCavae`, `semilunar`, `scalpel`, `ruler`. **Controls:** *Rotate* · *Cut section* · tap a wall to *Measure* · toggle `labels`. Emits `l2:bench` per measurement and `l2:bench-done` after 5 walls.
  - **Results table (`#results-table`):** Region · Reading 1 (mm) · Reading 2 (mm) · Mean (mm) · Pumps blood to.
  - **Expected (`#expected`), simulated specimen readings:** RA · 1.6 · 1.4 · 1.5 · right ventricle / LA · 2.1 · 1.9 · 2.0 · left ventricle / RV · 4.2 · 3.8 · 4.0 · lungs / LV · 12.4 · 11.6 · 12.0 · whole body / septum · 10.8 · 11.2 · 11.0 · (divides the halves). LV : RV = 3.0.
  - **Precautions (past tense):** gloves were worn and hands washed afterwards · the scalpel was used on a dissecting board and cut away from the body · every wall was measured at the same height, midway between base and apex · the ruler was read with the eye level with the mark · each wall was measured twice and the mean taken.
  - **Sources of error (with direction):** a slanting cut exposed the wall at an angle, so its thickness read **too high** · measuring where a papillary muscle joined the wall added muscle that is not wall, so the reading was **too high** · a specimen stored in a fridge for days had shrunk and lost fluid, so walls read **too low** · reading the ruler from above or below the mark (parallax) made each reading **too high or too low** at random.
  - **Analysis questions (5, locked):** Which wall was thickest, and why? · Why are both atrial walls thin? · What stops the AV valve flaps from flipping into the atria? · Why is the septum important? · Using the table, how many times thicker is the LV than the RV?

#### 3. Make Sense
- **Position and coverings (`#concepts`):** the heart sits in the chest between the two lungs, tilted a little to the left, shielded by the breastbone and ribs. It is wrapped in the *pericardium*, a two-layered sac with slippery fluid between the layers so the beating heart does not rub. Its wall has a thick central layer of heart muscle, the *myocardium*, which beats rhythmically, never tires and starts each beat itself; inside, the smooth *endocardium* lets blood slide past.
- **Chambers (`#props-table`):** right atrium (gets oxygen-poor blood from both venae cavae; sends it to the right ventricle; thin wall) · right ventricle (from the right atrium; to the lungs through the pulmonary artery; thicker than the atria) · left atrium (gets oxygen-rich blood from the four pulmonary veins; sends it to the left ventricle; thin wall) · left ventricle (from the left atrium; to the whole body through the aorta; thickest, about three times the right).
- **Why the walls differ (`.callout.big`):** a chamber's wall matches the job. The atria only squeeze blood a few centimetres down into the ventricles. The right ventricle pushes blood a short way to the nearby lungs. The left ventricle must drive blood through every organ from scalp to toes, so it needs the most muscle.
- **Valves and supports (`.tbl`):** tricuspid (between RA and RV; three flaps) · bicuspid or mitral (between LA and LV; two flaps) · pulmonary semilunar (at the base of the pulmonary artery; three half-moon pockets) · aortic semilunar (at the base of the aorta; three pockets). *Chordae tendineae* are tough cords anchoring the AV flaps to small papillary muscles that jut from the ventricle wall; when the ventricles squeeze, they hold the flaps so they cannot be blown back into the atria. The *septum* is the muscle partition that keeps right-side and left-side blood apart.
- **Great vessels (`.tbl`):** superior vena cava (from head, neck and arms, into RA) · inferior vena cava (from trunk and legs, into RA) · pulmonary artery (RV → lungs; the one artery with oxygen-poor blood) · pulmonary veins, four (lungs → LA; the veins with oxygen-rich blood) · aorta (LV → body) · coronary arteries (the earliest vessels to branch off the aorta, feeding the heart muscle itself).
- **Drawing rules (`.callout`):** draw the heart facing you, so the patient's right side is on your left · septum down the middle, AV boundary across each side · LV wall clearly thicker than RV · valves and chordae in place · flow arrows inside chambers · title in capitals below, e.g. LONGITUDINAL SECTION OF A MAMMALIAN HEART · ruled horizontal label lines with no arrowheads · magnification stated.
- **Explorer (`#pos-explorer`):** wall pins RA, LA, RV, septum, LV; each pin lights that wall on the 3D section and shows its mean thickness, where it pumps to and the distance blood must travel.
- **3D Zoom (`zoom`, `HeartKit.valve`):** one AV valve with chordae and papillary muscles; slider `open` 0 → 1; `setCusps(3)` vs `setCusps(2)`; *Cut the chordae* toggle shows the flaps inverting and blood leaking back (why the cords matter).

#### 4. Apply
- **Worked Example 1 (wall ratio from readings):** LV readings are 12.4 mm and 11.6 mm; RV readings are 4.2 mm and 3.8 mm. How many times thicker is the LV wall?
  1. Mean LV: $\dfrac{12.4 + 11.6}{2} = 12.0\text{ mm}$.
  2. Mean RV: $\dfrac{4.2 + 3.8}{2} = 4.0\text{ mm}$.
  3. Ratio: $\dfrac{12.0}{4.0} = 3.0$.
  - **Answer:** the LV wall is 3.0 times thicker, matching the "about three times" rule.
- **Worked Example 2 (drawing magnification):** The goat heart is 8.0 cm from base to apex. Chidi draws it 120 mm long. Find the magnification.
  1. Same unit: $120\text{ mm} = 12.0\text{ cm}$.
  2. $M = \dfrac{\text{drawing length}}{\text{actual length}} = \dfrac{12.0\text{ cm}}{8.0\text{ cm}}$.
  3. $M = \times 1.5$ (no unit).
  - **Answer:** ×1.5.
- **Worked Example 3 (actual size from a drawing):** On that ×1.5 drawing the LV wall is 18 mm thick. Find its real thickness in cm.
  1. Rearrange: actual $= \dfrac{\text{drawing size}}{M}$.
  2. Substitute: $\dfrac{18\text{ mm}}{1.5} = 12\text{ mm}$.
  3. Convert: $12\text{ mm} \div 10 = 1.2\text{ cm}$.
  - **Answer:** 1.2 cm, consistent with the 12.0 mm bench reading.
- **Worked Example 4 (functions of three parts):** model answer: septum (keeps oxygen-rich and oxygen-poor blood apart) · tricuspid valve (stops blood flowing back from RV to RA) · aorta (carries oxygen-rich blood from the LV to the body).
- **The Bridge (`#bridge`):** rotate Baba Sule's goat heart, find the thick wall and the vessel leaving it (the aorta), and decide which side it is. Verdict: it is the **left** ventricle; on a diagram facing you it sits on **your right**, which is why Baba Sule mixed the sides. Big Idea: *each part of the heart is shaped for its job: thick where the push is long, valves where backflow must stop.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 02.

#### 5. Reflect & Assignment
- **I can:** locate the heart and name its three layers · state what each chamber receives and sends · explain the wall thicknesses · name the four valves and their sides · draw and label the heart and find its magnification.
- **Exit ticket (2 marks):** Name the valve guarding the opening from the left atrium into the left ventricle, and the vessel that leaves the right ventricle. (bicuspid/mitral; pulmonary artery)
- **Recall:** pericardium, myocardium, endocardium · four chambers with in/out · four valves with sides and cusps · chordae tendineae job · six great vessels · drawing rules.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 02.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L3 (scalpel and specimen hygiene), L4 (front-view diagrams and drawing rules), L6 (butcher's and medical laboratory work). Preparation: buy a fresh goat or sheep heart with vessels intact; keep it cold and use it the same day.

---

### LESSON 03: The Double Circuit: Tracing Blood Around the Body
- **Folder:** `html/lessons/lesson-03/` · **Duration:** 80 min · **Competences:** L1, L3, L4
- **Guiding question:** How does the rider's donated blood reach his brain, and why does food from the gut go to the liver first?
- **Objectives:**
  1. **01** · Describe the full path of blood starting in the venae cavae and ending where it began, in the right atrium, naming every chamber, valve and vessel.
  2. **02** · Distinguish the pulmonary and systemic circulations.
  3. **03** · Describe the hepatic portal system and the coronary circulation and explain why each matters.
  4. **04** · Name the artery to and vein from the lungs, brain, arms, liver, gut, kidneys, legs and heart muscle.
  5. **05** · Trace any organ-to-organ route, always including the lungs.

#### 0. Do Now (`from: 1, 2`)
1. **Q:** Which chamber receives blood from the pulmonary veins? **A:** Left atrium.
2. **Q:** Where is the tricuspid valve? **A:** Between the right atrium and right ventricle.
3. **Q:** Why is the left ventricle the thickest chamber? **A:** It pumps blood to the whole body.
4. **Q:** Single or double circulation in a pigeon? **A:** Double.

#### 1. Wonder
- **Story:** (1) *Tent*: the okada rider is laid down; a drip line goes into a vein in his forearm. (2) Chidi (`cust1`): "The arm is close to the head. Will the new blood reach his brain in a second?" (3) Baba Sule (`cust2`): "Of course. Vein to brain, straight up!" (4) *Lab*: Dr Aisha (`amaka`) traces the route on a glowing 3D body: "It has a much longer journey, and it must pass one organ you have forgotten." (5) Invitation to the route-tracer bench.
- **Wonder Wall prompt:** *Starting in a vein of the arm, which organs must blood pass before it reaches the brain?*
- **Seed notes:** "Straight to the head (Bola)" · "Through the heart first (Musa)" · "The lungs, to get oxygen? (Adaeze)" · "Veins go straight to the brain (Baba Sule)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Put the journey in order.* Drag 13 cards into one sequence: venae cavae → right atrium → tricuspid valve → right ventricle → pulmonary semilunar valve → pulmonary artery → lung capillaries → pulmonary veins → left atrium → bicuspid valve → left ventricle → aortic semilunar valve → aorta. (One distractor card, "hepatic portal vein", belongs to no step and must be left out.)
- **2B 3D Practical (`bench`, `HeartKit.heart`, `both` mode, plus body map):** route tracer.
  - **Method cards (4):** (1) Pick a start and an end organ. (2) Tap each vessel, chamber and valve in the order blood meets them. (3) A red-blue tracer particle follows correct taps and turns red in the lungs. (4) Record the route and count the valves passed.
  - **Scene parts:** all heart parts from Lesson 02, plus `lungs`, `liver`, `gut`, `kidney`, `brain`, `arm`, `leg`, `hepaticPortal`, `hepaticVein`, `carotid`, `jugular`, `subclavianA`, `subclavianV`, `renalA`, `renalV`, `femoralA`, `femoralV`, `coronary`. **Controls:** route presets (arm → brain, ileum → brain, liver → kidney, lungs → heart muscle) · *Free trace*. Emits `l3:bench` per completed route and `l3:bench-done` after 3 routes.
  - **Results table (`#results-table`):** Route · Vessels in order · Valves passed · Passes through lungs? (yes/no).
  - **Expected (`#expected`):** arm → brain: forearm vein · subclavian vein · SVC · RA · tricuspid valve · RV · pulmonary semilunar valve · pulmonary artery · lung capillaries · pulmonary vein · LA · bicuspid valve · LV · aortic semilunar valve · aorta · carotid artery · brain (4 heart valves; yes). Ileum → brain: hepatic portal vein · liver (glucose stored) · hepatic vein · IVC · heart and lungs as above · aorta · carotid (4; yes). Liver → kidney: hepatic vein · IVC · RA and RV · lung capillaries · LA and LV · aorta · renal artery (4; yes). Lungs → heart muscle: pulmonary vein · LA · bicuspid valve · LV · aortic semilunar valve · aorta · coronary artery (2; starts in lungs).
  - **Analysis questions (5, locked):** Why must every body-to-body route pass through the lungs? · What changes in the blood in the lung capillaries? · Why does gut blood go to the liver first? · What makes the hepatic portal vein different from other veins? (it starts and ends in capillaries) · Why can't heart muscle feed on the blood inside its chambers?

#### 3. Make Sense
- **Two loops (`.callout.big`):** in one complete circuit, blood goes through the heart two times. The **pulmonary circulation** runs right ventricle → pulmonary artery → capillaries of the lungs → pulmonary veins → left atrium, and swaps carbon dioxide for oxygen. The **systemic circulation** runs left ventricle → aorta → every body organ → venae cavae → right atrium, and delivers oxygen and food while collecting wastes.
- **Within the body (`.eq` chain):** heart → arteries → arterioles → capillaries → venules → veins → heart.
- **Hepatic portal system (`.callout`):** blood leaving the stomach and intestines is rich in absorbed food and any swallowed poisons. Instead of returning straight to the heart, it travels in the hepatic portal vein to reach the liver. There, extra glucose is stored as glycogen, surplus amino acids are broken down (making urea) and poisons are made harmless. Only then does blood leave by the hepatic vein for the inferior vena cava. Any vein that links two capillary beds is called a portal vein.
- **Coronary circulation:** the coronary arteries branch off the aorta just beyond its valve and spread over the heart surface; coronary veins return blood into the right atrium. If a coronary artery is blocked, the muscle beyond it is starved of oxygen and dies: a heart attack.
- **Named vessels (`#props-table`, organ: in by · out by):** lungs: in by the pulmonary artery · out by the pulmonary veins | brain and head: in by a carotid · out by a jugular | arm: in by a subclavian artery · out by a subclavian vein | liver: in by the hepatic artery (and hepatic portal vein) · out by the hepatic vein | gut: in by a mesenteric artery · out by the hepatic portal vein, which goes to the liver | kidney: in by a renal artery · out by a renal vein | leg: in by an iliac/femoral artery · out by an iliac/femoral vein | heart muscle: in by the coronary arteries · out by coronary veins. Largest artery: aorta; largest vein: inferior vena cava.
- **Explorer (`#pos-explorer`):** organ pins (brain, arm, lungs, liver, gut, kidney, leg, heart muscle); tapping one shows its artery in and vein out and lights them on the 3D body.
- **3D Zoom (`zoom`):** gut capillaries → hepatic portal vein → liver capillaries → hepatic vein (glucose particles stored as glycogen granules on the way); then the aorta root with the coronary arteries; *Block* toggle greys out the muscle beyond a blockage.

#### 4. Apply
- **Worked Example 1 (arm drip → brain):** List the path, naming valves.
  1. Into the heart: forearm vein → subclavian vein → superior vena cava (SVC) → right atrium → tricuspid valve → right ventricle.
  2. To the lungs and back: pulmonary semilunar valve → pulmonary artery → lung capillaries (CO₂ out, O₂ in) → pulmonary veins → left atrium.
  3. Out to the brain: bicuspid valve → left ventricle → aortic semilunar valve → aorta → carotid artery → brain.
  - **Answer:** as above; four heart valves are passed, and the lungs cannot be skipped.
- **Worked Example 2 (glucose from ileum to a leg muscle):**
  1. Gut to liver: capillaries of the ileum wall → hepatic portal vein → liver (sugar stored) → hepatic vein → IVC.
  2. Right side and lungs: right atrium → tricuspid valve → right ventricle → pulmonary semilunar valve → pulmonary artery → lung capillaries → pulmonary veins.
  3. Left side and out: left atrium → bicuspid valve → left ventricle → aortic semilunar valve → aorta → femoral artery → leg muscle.
  - **Answer:** as above; the liver comes first, the lungs second.
- **Worked Example 3 (urea from liver to kidney):**
  1. Liver → hepatic vein → IVC (inferior vena cava) → RA → tricuspid valve → RV.
  2. → pulmonary semilunar valve → pulmonary artery → lung capillaries → pulmonary veins → left atrium → bicuspid valve → left ventricle.
  3. → aortic semilunar valve → aorta → renal artery → kidney.
  - **Answer:** as above.
- **Worked Example 4 (oxygen from lungs to heart muscle):** lung capillaries → pulmonary vein → left atrium → bicuspid valve → left ventricle → aortic semilunar valve → aorta → coronary artery → heart muscle. Note: only two valves; the right side is not involved.
- **The Bridge (`#bridge`):** trace the rider's drip route on the 3D body. Verdict: arm vein → right half of the heart → lung capillaries → left half → aorta → carotid → brain. Baba Sule was wrong: veins lead to the heart, not the brain. Big Idea: *blood makes two loops through two pumps; every body-to-body trip passes the lungs, and gut blood visits the liver first.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 03.

#### 5. Reflect & Assignment
- **I can:** trace the full pathway from venae cavae to aorta · distinguish pulmonary and systemic loops · explain the hepatic portal system · explain coronary supply and a heart attack · name the vessels for eight organs.
- **Exit ticket (2 marks):** Name the vessel that carries blood from the intestine to the liver, and the vessel that carries blood from the liver towards the heart. (hepatic portal vein; hepatic vein)
- **Recall:** the 13-step pathway · two loops · hepatic portal jobs (glycogen, deamination, detoxification) · coronary arteries · eight organ vessel pairs.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 03.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (predicting the route before tracing it), L3 (why drips go into veins), L4 (reading body maps and flow diagrams).

---

### LESSON 04: The Beating Heart: Cardiac Cycle, Heart Sounds, Pacemaker, Pulse and Blood Pressure
- **Folder:** `html/lessons/lesson-04/` · **Duration:** 80 min · **Competences:** L1, L3, L4
- **Guiding question:** Why did Chidi's pulse leap to 132 and then settle again?
- **Objectives:**
  1. **01** · Describe the stages of the cardiac cycle with approximate timings and the state of each valve.
  2. **02** · Explain the causes of the "lub" and "dub" sounds.
  3. **03** · Describe how the SAN, AVN, bundle of His and Purkinje fibres control the beat, and how nerves and adrenaline change its rate.
  4. **04** · Measure pulse rate before and after exercise, and calculate heart rate, cycle time, cardiac output and percentage change.
  5. **05** · Define pulse and blood pressure, and list factors that raise or lower heart rate.

#### 0. Do Now (`from: 1, 2, 3`)
1. **Q:** Which vessel carries blood from the left ventricle? **A:** Aorta.
2. **Q:** What do the chordae tendineae do? **A:** Hold the AV valve flaps so they do not turn back into the atria.
3. **Q:** Which vessel supplies the heart muscle? **A:** Coronary artery.
4. **Q:** Name the two loops of the double circulation. **A:** Pulmonary and systemic.

#### 1. Wonder
- **Story:** (1) *Tent*: Chidi (`cust1`) is back, breathless; Dr Aisha (`amaka`) counts his pulse for 15 seconds: 33 beats. (2) She hands him the stethoscope; he hears "lub-dub, lub-dub" racing. (3) Baba Sule (`cust2`): "That is his brain kicking the heart. And the noise is the heart muscle clapping." (4) Dr Aisha: "Five minutes from now it will be back near 68. Let's see why, and what that knocking really is." (5) Invitation to the pulse bench.
- **Wonder Wall prompt:** *What makes the "lub" and the "dub", and who tells the heart to beat faster?*
- **Seed notes:** "The chambers squeezing (Femi)" · "Valves snapping shut? (Zainab)" · "Adrenaline, like when you are scared (Obinna)" · "The brain sends every single beat (Baba Sule)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Speeds it up or slows it down?* Bins: `faster` · `slower`. Items (10): exercise · fear or excitement (adrenaline) · fever · high carbon dioxide in the blood · strong coffee (caffeine) → faster · sleep · rest after exercise · long-term athletic fitness (resting rate) · impulses in the vagus nerve · lying still and calm → slower.
- **2B 3D Practical (`bench`, `HeartKit.heart`, `pace` mode, beside a wrist model):** pulse rate and exercise.
  - **Method cards (4):** (1) Sit quietly for five minutes, then find the radial pulse with the index and middle fingers. (2) Count beats for 15 s three times and take the mean; multiply by 4. (3) Do step-ups for 2 minutes, then count for 15 s at once and at the start of each minute for 5 minutes. (4) Tabulate beats per 15 s and beats per minute; plot heart rate against time after exercise.
  - **Scene parts:** `wrist`, `radialArtery`, `fingers`, `stopwatch`, `step`, `heart`, `san`, `avn`, `his`, `purkinje`. **Controls:** *Rest count* · *Exercise 2 min* · *Count now* · *Next minute*. The 3D heart beats at the live rate. Emits `l4:bench` each count and `l4:bench-done` after 6 post-exercise counts.
  - **Results table (`#results-table`):** Time after exercise (min) · Beats in 15 s · Heart rate (beats min⁻¹).
  - **Expected (`#expected`):** rest · 17 · 68 / 0 · 33 · 132 / 1 · 29 · 116 / 2 · 24 · 96 / 3 · 20 · 80 / 4 · 18 · 72 / 5 · 17 · 68.
  - **Graph:** heart rate (y) against time after exercise (x). The rate falls steeply for the first 2–3 minutes and then levels off as it nears the resting rate, so draw a **smooth curve of best fit** and draw the resting rate (68) as a dashed line; recovery time is where the curve meets it (about 5 min).
  - **Precautions (past tense):** the pulse was felt with two fingers, not the thumb, which has its own pulse · the subject rested for five minutes before the resting count · each resting count was repeated three times and averaged · the stopwatch was started on a beat counted as "zero".
  - **Sources of error (with direction):** counting the first beat as "one" at the moment the watch started added a beat, making the rate **too high** (by 4 bpm after multiplying) · a short delay before the first post-exercise count let the heart slow, so the peak rate was **too low** · a 15 s count multiplied by 4 turns one missed or extra beat into ±4 bpm, so any reading may be **too high or too low** (random) · pressing too hard on the artery could block the pulse and cause missed beats, so the rate read **too low**.
  - **Analysis questions (5, locked):** What was the peak rate and how long did recovery take? · Why did the rate rise during exercise? · Why is the graph a curve and not a straight line? · Why would a trained athlete recover faster? · Why use fingers and not the thumb?

#### 3. Make Sense
- **Cardiac cycle (`.callout.big`, at about 75 beats per minute, one cycle ≈ 0.8 s):**
  1. *All chambers relaxed* (about 0.4 s): blood flows in from the venae cavae and pulmonary veins, fills the atria and runs on through the open AV valves into the ventricles; the semilunar valves are shut.
  2. *Atria contract* (about 0.1 s): both atria squeeze together and top up the ventricles.
  3. *Ventricles contract* (about 0.3 s): pressure in the ventricles rises above that in the atria and the AV valves slam shut (**lub**); it then passes the pressure in the arteries, the semilunar valves open and blood surges into the aorta and pulmonary artery.
  4. *Ventricles relax*: pressure inside them falls below the arteries, blood starts to fall back, and the semilunar pockets fill and snap shut (**dub**). The cycle repeats.
  *Systole* means contraction; *diastole* means relaxation.
- **Heart sounds (`.tbl`):** lub (first sound; AV valves closing as the ventricles start to squeeze; deeper and longer) · dub (second sound; semilunar valves closing as the ventricles relax; shorter and sharper). A *murmur*, an extra swishing sound, hints at a leaky or narrowed valve.
- **Control of the beat (`.eq` chain):** SAN (pacemaker, in the right atrium wall) → both atria contract → AVN (short delay so the atria finish emptying) → bundle of His (down the septum) → Purkinje fibres (spreading through both ventricle walls, so contraction starts at the apex and moves upward). Cardiac muscle is **myogenic**: the beat begins inside the heart. The cardiac centre in the medulla oblongata only adjusts the rate: sympathetic nerves and the hormone adrenaline raise the rate, while impulses along the vagus nerve lower it.
- **Pulse and blood pressure (`.callout`):** a *pulse* is the rhythmic bulge and spring-back of an artery's wall that follows every push of the left ventricle into the aorta, so the pulse rate equals the heart rate. It is felt where an artery crosses a bone near the skin: wrist (radial), neck (carotid), temple, groin. *Blood pressure* is the push of blood against vessel walls, measured with a sphygmomanometer; a typical young adult reads about 120/80 mmHg (ventricles contracting / relaxed). It peaks in the aorta and drops steadily all the way back to the heart.
- **Equations (`.eq`):** heart rate $= \text{beats in } t \times \dfrac{60}{t}$ · cycle time $T = \dfrac{60}{\text{heart rate}}$ · cardiac output $= \text{heart rate} \times \text{stroke volume}$ · % change $= \dfrac{\text{new} - \text{old}}{\text{old}} \times 100$.
- **Explorer (`#pos-explorer`):** cycle-time pins at 0.0, 0.1, 0.2, 0.4, 0.6, 0.8 s; each pin freezes the 3D heart (`hold`) and shows which chambers are contracting, which valves are open or shut, and whether lub or dub has just sounded.
- **3D Zoom (`zoom`, `HeartKit.heart` `pace` then `sys` modes):** the SAN spark spreading over the atria, pausing at the AVN, racing down the septum and up the ventricle walls; then valves opening and closing in slow motion with LUB and DUB captions; counters: bpm, cycle time, phase.

#### 4. Apply
- **Worked Example 1 (heart rate and cycle time):** At rest, Chidi's pulse gives 18 beats in 15 s. Find his heart rate and the length of one cycle.
  1. Scale to one minute: $18 \times \dfrac{60}{15} = 18 \times 4 = 72\text{ beats min}^{-1}$.
  2. Cycle time: $T = \dfrac{60\text{ s}}{72}$.
  3. $T = 0.833\ldots \approx 0.83\text{ s}$.
  - **Answer:** 72 bpm; about 0.83 s per cycle (close to the textbook 0.8 s).
- **Worked Example 2 (cardiac output at rest and after the sprint):** Stroke volume is 70 cm³ at rest (68 bpm) and 95 cm³ just after the sprint (132 bpm). Find each cardiac output in dm³ min⁻¹ and how many times it rose.
  1. Rest: $68 \times 70 = 4760\text{ cm}^3\text{ min}^{-1}$.
  2. Convert: $4760 \div 1000 = 4.76\text{ dm}^3\text{ min}^{-1}$.
  3. After sprint: $132 \times 95 = 12\,540\text{ cm}^3\text{ min}^{-1} = 12.54\text{ dm}^3\text{ min}^{-1}$.
  4. Ratio: $12.54 / 4.76 = 2.63 \approx 2.6$.
  - **Answer:** 4.76 → 12.5 dm³ min⁻¹, about 2.6 times more blood each minute.
- **Worked Example 3 (percentage rise):** By what percentage did Chidi's heart rate rise from 68 to 132 bpm?
  1. Rise: $132 - 68 = 64\text{ bpm}$.
  2. Fraction: $64 / 68 = 0.941$.
  3. Percentage: $0.941 \times 100 = 94.1\%$.
  - **Answer:** a 94.1% rise (almost double).
- **Worked Example 4 (how long the ventricles rest):** At 75 bpm, ventricular systole lasts 0.30 s. What fraction of each cycle do the ventricles spend relaxing?
  1. Cycle time: $60 / 75 = 0.80\text{ s}$.
  2. Relaxing time: $0.80 - 0.30 = 0.50\text{ s}$.
  3. Fraction: $0.50 / 0.80 \times 100 = 62.5\%$.
  - **Answer:** 62.5% of every cycle is rest, which is why heart muscle does not tire.
- **The Bridge (`#bridge`, Case 1 closed):** match Chidi's readings to causes. During the sprint his muscles made more carbon dioxide and his body released adrenaline; the cardiac centre and adrenaline pushed the SAN to fire faster, and each beat pushed more blood, so cardiac output rose about 2.6 times. Afterwards vagus impulses slowed the SAN and the rate glided back to 68 in about 5 minutes: a healthy heart. The lub-dub is valves shutting, not muscle clapping, and the brain does not start each beat. Big Idea: *the heart sets its own beat; nerves and hormones only turn the speed up or down.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 04.

#### 5. Reflect & Assignment
- **I can:** describe the four stages of the cardiac cycle · explain lub and dub · trace the impulse SAN → Purkinje · calculate heart rate, cycle time, cardiac output and % change · list factors changing heart rate.
- **Exit ticket (2 marks):** A pulse gives 21 beats in 15 s. Find the heart rate and the cycle time. (84 bpm; 60/84 = 0.71 s)
- **Recall:** four stages with times · lub vs dub · five-step conduction chain · myogenic · pulse sites · 120/80 · five factors up, three down · four equations.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 04.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (predicting recovery), L3 (exercise and heart health; excuse any learner with a known heart or asthma condition from the step-ups), L4 (plotting and reading the recovery curve).

---

### LESSON 05: Arteries, Veins, Capillaries, Tissue Fluid and Lymph
- **Folder:** `html/lessons/lesson-05/` · **Duration:** 80 min · **Competences:** L1, L3, L4
- **Guiding question:** Why do Mama Bisi's ankles swell after a day of standing?
- **Objectives:**
  1. **01** · Compare arteries, veins and capillaries in a matched table and link each feature to its job.
  2. **02** · Explain how vein valves and muscle squeezing return blood against gravity.
  3. **03** · Explain how tissue fluid forms and returns, using net filtration pressure (NFP = Pc − πc).
  4. **04** · Use flow = area × speed to explain why blood is slowest in capillaries.
  5. **05** · Describe the lymphatic system and its functions, and compare blood, tissue fluid and lymph.

#### 0. Do Now (`from: 2, 3, 4`)
1. **Q:** Why is the LV wall thicker than the RV wall? **A:** It pumps blood to the whole body, not just the nearby lungs.
2. **Q:** Which vessel takes blood from the gut to the liver? **A:** Hepatic portal vein.
3. **Q:** What is a pulse? **A:** The throb of an artery as its wall bulges and springs back after every beat of the left ventricle.
4. **Q:** What do the two numbers in 120/80 mmHg stand for? **A:** Pressure while the ventricles contract / while they relax.

#### 1. Wonder
- **Story:** (1) *Tent*: Mama Bisi (`ngozi`) props her feet on a stool. Dr Aisha (`amaka`) presses her ankle: the thumb dent stays. Blue knotted veins wind up her calves. (2) Mama Bisi: "In the morning they are fine. By evening my sandals are tight." (3) Baba Sule (`cust2`): "Too much water in the blood. Stop drinking water!" (4) *Lab*: Dr Aisha zooms into a single capillary between leg muscle cells: "The answer lies in a tube one cell thick, and in two pressures fighting inside it." (5) Invitation to the vessel and capillary benches.
- **Wonder Wall prompt:** *If blood stays inside vessels, where does the fluid in a swollen ankle come from?*
- **Seed notes:** "It leaks out of the blood vessels? (Yemi)" · "Gravity pulls it down (Aliyu)" · "Her veins are weak (Chinwe)" · "She drinks too much water (Baba Sule)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Artery, vein or capillary?* Bins: `artery` · `vein` · `capillary`. Items (11): thick wall with much muscle and elastic tissue → artery · pocket valves along its length → vein · wall only one cell thick → capillary · blood spurts out bright red when cut → artery · dark red blood flows out steadily when cut → vein · red cells squeeze through one at a time → capillary · narrow lumen, high pressure, a pulse → artery · wide lumen, low pressure, no pulse → vein · site of exchange with tissues → capillary · carries blood away from the heart → artery · pulmonary vein → vein (oxygenated, yet still a vein).
- **2B 3D Practical (`bench`, two stations):**
  - **Station 1, vessel cross-sections (`HeartKit.vessels`):** method: (1) view a prepared slide of an artery and vein side by side at low power; (2) calibrate the eyepiece graticule against a stage micrometer; (3) measure wall thickness and lumen width of each at their narrowest diameter; (4) find a capillary and note its single-cell wall. Expected (real sizes after graticule calibration): artery wall 0.90 mm, lumen 2.2 mm · vein wall 0.40 mm, lumen 4.0 mm · capillary wall one flat cell, lumen about one red cell wide.
  - **Station 2, capillary pressure probe (`HeartKit.capillaryBed`, `normal` mode):** method: slide the `probe` (0 → 1) from the arterial end to the venous end and record Pc at five points; πc stays at 25 mmHg. Emits `l5:bench` per reading and `l5:bench-done` after both stations.
  - **Scene parts:** `artery`, `vein`, `capillary`, `valve`, `tunicaMedia`, `lumen`, `probe`, `tissueCells`, `tissueFluid`, `lymphCapillary`. **Controls:** station switch · probe slider · mode `normal` / `congest` / `kwash` / `blocked`.
  - **Results table (`#results-table`):** Position along capillary · Pc (mmHg) · πc (mmHg) · NFP = Pc − πc (mmHg) · Direction.
  - **Expected (`#expected`), skeletal-muscle bed (approximate textbook teaching values; tissue-fluid pressures taken as near zero):** 0.00 · 36 · 25 · +11 · out / 0.25 · 31 · 25 · +6 · out / 0.50 · 26 · 25 · +1 · out (barely) / 0.75 · 21 · 25 · −4 · in / 1.00 · 16 · 25 · −9 · in. In this teaching model Pc falls evenly along the capillary, so these points lie on a straight line; NFP reaches zero 55% of the way along.
  - **Precautions (past tense):** the graticule was calibrated before any measurement · the slide was viewed on low power before high power · each vessel was measured across its narrowest diameter, at right angles to the wall · the readings were repeated in two places on each vessel.
  - **Sources of error (with direction):** a vessel cut at a slant appeared oval, so its wall read **too high** · a vein collapsed during slide preparation, so its lumen read **too low** · forgetting to calibrate (treating one graticule division as a fixed size) made every measurement **too high or too low** by the same factor (systematic).
  - **Analysis questions (5, locked):** Why does the artery wall need so much elastic tissue? · Why do veins need valves but arteries (beyond the heart) do not? · At which end of the capillary does fluid leave, and why? · What would happen to NFP at the venous end if Pc there rose to 30 mmHg? · Why are red cells and most plasma proteins kept inside?

#### 3. Make Sense
- **Vessel comparison (`#props-table`):** direction (from the heart | to the heart | joins arterioles to venules) · usual blood (oxygen-rich, apart from the pulmonary artery | oxygen-poor, apart from the pulmonary veins | gives up oxygen here) · wall (thick, muscular, elastic | thinner, less muscle and elastic | a single layer of flat cells) · lumen (narrow | wide | about one red cell wide) · valves (none, except at the heart exits | pocket valves | none) · pressure (high, pulsing | low, no pulse | falling, low) · speed (fast, in surges | slow, steady | slowest) · position (mostly deep | many near the surface | in every tissue) · cut vessel (bright red and spurting | dark red, steady stream | slow ooze). Deoxygenated blood is dark red; veins only look blue through the skin.
- **Adaptations (`.callout`):** arteries: elastic, muscular walls take the surge from the ventricle and spring back, which keeps blood moving (felt as the pulse) · veins: pocket valves let blood move only towards the heart, and contracting leg muscles squeeze the veins between them (the muscle pump) · capillaries: walls one cell thick give a short diffusion path; their huge number gives a vast surface; slow flow gives time for exchange.
- **Tissue fluid (`.callout.big`):** near the start of a capillary (its arterial end), the pressure of the blood (Pc) is greater than the inward pull of plasma proteins (πc), so water with dissolved oxygen, glucose, amino acids and salts is squeezed out between the cells as *tissue fluid*; red cells and large proteins stay behind. Cells absorb what they need and add carbon dioxide and wastes. At the venous end Pc has fallen below πc, so most of the fluid is drawn back in by osmosis. The rest seeps into lymph capillaries, which are closed at one end; once inside, it is known as *lymph*.
- **Equations (`.eq`):** $\text{NFP} = P_c - \pi_c$ (tissue-side pressures treated as near zero) · flow $Q = A \times v$, so $v = \dfrac{Q}{A}$: the same flow spread over a far larger total area moves far more slowly.
- **Lymphatic system (`.tbl`):** route: lymph capillaries → larger lymphatics fitted with valves → nodes along the way → the thoracic duct (left) or right lymphatic duct → subclavian veins near the neck. Movement: no pump; skeletal muscles and breathing squeeze it along, valves stop backflow. Jobs: returns surplus tissue fluid and leaked proteins to the blood · carries fat absorbed by the lacteals of the ileum · lymph nodes filter out bacteria and debris and make lymphocytes (they swell when fighting infection) · the spleen, tonsils and thymus are also lymphoid organs.
- **Blood vs tissue fluid vs lymph (`.tbl`):** red cells (in blood only) · plasma proteins (many | very few | few) · white cells (plenty | a scattering | rich in lymphocytes) · fat (little | little | rich after a fatty meal) · found in (heart and blood vessels | the spaces around cells | lymphatic vessels and nodes).
- **Pressure along the circuit (graph):** mean pressure from aorta (~100 mmHg) through arteries, arterioles (largest fall), capillaries (~35 → ~15), veins, to the venae cavae (~2 mmHg); plotted as a **smooth curve** (approximate teaching values).
- **Explorer (`#pos-explorer`):** probe pins at 0, 0.25, 0.5, 0.75, 1.0 along the capillary; each pin shows Pc, πc and NFP, arrows out or in, and the length of each arrow scaled to NFP; a mode switch repeats the pins for Mama Bisi's congested leg (venous-end Pc 30 mmHg).
- **3D Zoom (`zoom`, `HeartKit.capillaryBed`):** `normal` (fluid out at the arterial end, back in at the venous end, small surplus into the lymph capillary) → `congest` (raised venous pressure: fluid keeps leaving, tissue swells) → `kwash` (low plasma protein, small πc: oedema) → `blocked` (lymph blocked, as when filarial worms cause elephantiasis).

#### 4. Apply
- **Worked Example 1 (NFP at both ends of a skeletal-muscle capillary):** Pc is 36 mmHg at the arterial end and 16 mmHg at the venous end; πc is 25 mmHg along the whole length. Find NFP at each end and where it becomes zero.
  1. Formula: $\text{NFP} = P_c - \pi_c$.
  2. Arterial end: $36 - 25 = +11\text{ mmHg}$ (outward: filtration).
  3. Venous end: $16 - 25 = -9\text{ mmHg}$ (inward: reabsorption).
  4. Zero point: Pc must equal 25, a fall of $36 - 25 = 11$ out of $36 - 16 = 20$; $11/20 = 0.55$.
  - **Answer:** +11 mmHg out, −9 mmHg in; filtration turns to reabsorption 55% of the way along.
- **Worked Example 2 (why capillary blood is so slow):** Blood leaves the aorta (cross-section 2.4 cm²) at 35 cm s⁻¹. All capillaries together have a cross-section of about 2400 cm². Find the speed in the capillaries.
  1. Flow: $Q = A_1 v_1 = 2.4 \times 35 = 84\text{ cm}^3\text{ s}^{-1}$.
  2. Check it is sensible: $84 \times 60 = 5040\text{ cm}^3\text{ min}^{-1} \approx 5.0\text{ dm}^3\text{ min}^{-1}$, a resting cardiac output.
  3. Capillary speed: $v_2 = \dfrac{Q}{A_2} = \dfrac{84}{2400} = 0.035\text{ cm s}^{-1}$ (0.35 mm s⁻¹).
  4. Compare: $35 / 0.035 = 1000$.
  - **Answer:** about 0.035 cm s⁻¹, about a thousand times slower than in the aorta, which gives time for exchange. (textbooks quote about 0.03 cm s⁻¹)
- **Worked Example 3 (Mama Bisi's leg):** After hours of standing, with faulty vein valves, Pc at the venous end of her ankle capillaries rises to 30 mmHg (arterial end still 36). πc is 25 mmHg.
  1. Arterial end: $36 - 25 = +11\text{ mmHg}$ (out).
  2. Venous end: $30 - 25 = +5\text{ mmHg}$ (still out).
  3. Conclusion: NFP is positive along the whole capillary, so there is no reabsorption zone; all the extra fluid must leave by lymph, which cannot keep up.
  - **Answer:** fluid collects in the tissues: oedema.
- **Worked Example 4 (lymph flow):** About 20 dm³ of fluid is filtered from capillaries each day (outside the kidneys) and about 17 dm³ is reabsorbed (approximate textbook values). Find the lymph flow in cm³ per hour.
  1. Left over: $20 - 17 = 3\text{ dm}^3$ per day.
  2. Convert: $3\text{ dm}^3 = 3000\text{ cm}^3$.
  3. Per hour: $3000 / 24 = 125\text{ cm}^3\text{ h}^{-1}$.
  - **Answer:** about 125 cm³ h⁻¹ (15% of what is filtered).
- **The Bridge (`#bridge`, Case 2 explained):** switch the capillary zoom from `normal` to `congest` and compare NFP arrows. Verdict: standing all day, and leaky valves in her varicose veins, let blood pool in Mama Bisi's lower legs; venous-end pressure rose, so fluid kept leaving the capillaries and outran the lymph. Drinking water was not the cause, so Baba Sule's advice is wrong. Remedies: raise the feet, walk about to work the muscle pump, and have her high blood pressure treated (Lesson 07). Big Idea: *tissue fluid forms where blood pressure beats protein pull, returns where it does not, and lymph mops up the rest.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 05.

#### 5. Reflect & Assignment
- **I can:** tabulate five artery–vein differences · explain vein return against gravity · explain tissue fluid formation with NFP · explain why capillary flow is slow · compare blood, tissue fluid and lymph.
- **Exit ticket (2 marks):** Pc = 34 mmHg and πc = 25 mmHg at one point. Find NFP and the direction fluid moves. (+9 mmHg; out of the capillary)
- **Recall:** nine-row vessel table · three adaptations · tissue fluid in four steps · NFP and Q = Av · lymph route and four jobs · blood/tissue fluid/lymph table · oedema and elephantiasis.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 05.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (predicting NFP), L3 (varicose veins, long standing and foot care), L4 (cross-sections, tables and the pressure curve).

---

### LESSON 06: Blood: Plasma, Cells and Clotting
- **Folder:** `html/lessons/lesson-06/` · **Duration:** 80 min · **Competences:** L3, L4, L6
- **Guiding question:** The rider's cut finally stopped oozing. What sealed it, and what did he lose?
- **Objectives:**
  1. **01** · State the composition of blood and the contents of plasma; distinguish plasma from serum.
  2. **02** · Compare red cells, white cells and platelets (shape, nucleus, number, origin, life span, function).
  3. **03** · Explain how red cells are adapted for carrying oxygen, and name two kinds of white cell.
  4. **04** · Describe the clotting sequence and explain why blood does not clot inside healthy vessels.
  5. **05** · Calculate a red cell count from a haemocytometer and a cell's actual size from a micrograph.

#### 0. Do Now (`from: 3, 4, 5`)
1. **Q:** Which vessel returns lymph to the blood? **A:** Subclavian vein.
2. **Q:** What does tissue fluid lack that blood has? **A:** Red cells and most plasma proteins.
3. **Q:** What does the "dub" sound mean? **A:** The semilunar valves closing.
4. **Q:** Which artery supplies the kidney? **A:** Renal artery.

#### 1. Wonder
- **Story:** (1) *Tent*: Dr Aisha (`amaka`) presses a pad on the rider's gash; after some minutes the bleeding slows to a seep, then stops. (2) Chidi (`cust1`): "Nobody stitched it yet. What closed it?" (3) Baba Sule (`cust2`): "Blood dries in the air like palm oil. Rub some salt in." (4) *Lab*: Dr Aisha places a drop of blood under the microscope: discs, a few large cells with odd nuclei, tiny specks. "Each of these did a job at that wound." (5) Invitation to the smear and haemocytometer bench.
- **Wonder Wall prompt:** *What do you think turns runny blood into a solid plug?*
- **Seed notes:** "The air dries it (Ijeoma)" · "Something in the blood makes threads? (Danjuma)" · "White cells fight the germs (Bisola)" · "Salt seals it (Baba Sule)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Which part of blood?* Bins: `plasma` · `rbc` · `wbc` · `platelets`. Items (12): pale yellow liquid, mostly water → plasma · carries urea and hormones → plasma · fibrinogen and prothrombin dissolved here → plasma · biconcave disc, no nucleus → rbc · full of haemoglobin → rbc · lives about 120 days → rbc · engulfs bacteria → wbc · makes antibodies → wbc · has a nucleus and can change shape → wbc · tiny cell fragments → platelets · start the clotting process → platelets · about 250 000 in each mm³ → platelets.
- **2B 3D Practical (`bench`, `HeartKit.bloodSmear`):** stained blood smear and haemocytometer.
  - **Method cards (4):** (1) Examine a prepared, stained smear at ×100 then ×400; identify red cells, a lobed-nucleus phagocyte, a lymphocyte and platelets. (2) Measure one red cell on a micrograph of known magnification. (3) Fill a haemocytometer with blood diluted 1 in 200, wait 2 minutes for the cells to settle, and count red cells in 5 medium squares (each 0.2 mm × 0.2 mm, depth 0.1 mm). (4) Calculate the count per mm³ of undiluted blood.
  - **Scene parts:** `rbc`, `phagocyte`, `lymphocyte`, `platelet`, `fibrin`, `slide`, `haemocytometer`, `grid`, `coverslip`. **Controls:** magnification ×100 / ×400 · *Next square* · *Count* · `clot` slider · `sickle` toggle (preview for Lesson 07). Emits `l6:bench` each square and `l6:bench-done` after 5 squares.
  - **Results table (`#results-table`):** Square · Red cells counted. Then: total, volume counted (mm³), cells per mm³ diluted, cells per mm³ undiluted.
  - **Expected (`#expected`):** squares 1–5: 98 · 92 · 101 · 95 · 94; total 480; volume 0.020 mm³; 24 000 per mm³ diluted; 4.8 × 10⁶ per mm³ undiluted.
  - **Precautions (past tense):** the chamber was filled from the edge of the cover slip in one smooth flow, without air bubbles · the cells were left to settle for 2 minutes before counting · cells touching the top and left lines were counted, but those touching the bottom and right lines were not · the count was repeated with a second filling and the mean taken.
  - **Sources of error (with direction):** counting cells on all four boundary lines counted some twice, so the count was **too high** · an air bubble or overfilled chamber changed the depth from 0.1 mm; a deeper layer held more cells, so the count was **too high** (a bubble taking up space made it **too low**) · too much diluting fluid drawn into the pipette made the blood weaker than 1 in 200, so the count was **too low** · counting before the cells settled missed cells out of focus, so the count was **too low**.
  - **Analysis questions (5, locked):** Why are red cells so much more numerous than white cells? · Why does a mature red cell lack a nucleus? · How can you tell a phagocyte from a lymphocyte? · Why was the blood diluted? · Why must cells on two of the four boundary lines be left out?

#### 3. Make Sense
- **Composition (`.callout.big`):** blood is a liquid connective tissue. About 55% is *plasma* and about 45% is cells; an adult carries roughly 5–6 dm³. Plasma is a straw-coloured liquid, about nine-tenths water, carrying dissolved food (amino acids, glucose, glycerol, fatty acids), salts, hormones, urea, most of the carbon dioxide (as hydrogencarbonate), plasma proteins (albumin, fibrinogen, prothrombin, antibodies) and heat. *Serum* is what remains when fibrinogen and the other clotting proteins have been removed.
- **Cells (`#props-table`):** red cells or erythrocytes (biconcave disc · no nucleus in mammals · about 5 million per mm³ · produced in red bone marrow · about 120 days, then broken down in liver and spleen · carry oxygen as oxyhaemoglobin and some carbon dioxide) · white cells or leucocytes (no fixed shape · nucleus present · about 7000–8000 per mm³ · bone marrow, with lymphocytes also from lymph nodes, spleen and thymus · days to years · defence) · platelets or thrombocytes (small cell fragments · no nucleus · about 250 000 per mm³ · red bone marrow · about 7–10 days · clotting).
- **Red cell adaptations (`.callout`):** the dimpled disc shape gives a large surface for oxygen to enter and leave · the missing nucleus frees space for extra haemoglobin · the cells are small and bendy enough to squeeze through capillaries in single file · they carry the enzyme carbonic anhydrase, which speeds carbon dioxide carriage. A shortage of red cells or of haemoglobin is called *anaemia*; lack of iron is a frequent cause.
- **White cells (`.tbl`):** phagocytes (neutrophils, monocytes; lobed or bean-shaped nucleus; swallow and digest bacteria) · lymphocytes (one large round nucleus filling most of the cell; make antibodies: antitoxins, agglutinins, lysins).
- **Clotting (`.eq` chain):** injured tissue and platelets release *thromboplastin* (thrombokinase) → helped by vitamin K and calcium ions, it turns inactive *prothrombin* into active *thrombin* → thrombin changes dissolved *fibrinogen* into solid *fibrin* threads → the fibrin net snares red cells, and the tangle becomes a clot that later dries into a scab. Clotting stops blood loss and keeps germs out. Inside healthy vessels blood stays liquid because the lining is smooth and the anticoagulant *heparin* is present. In *haemophilia*, an inherited sex-linked condition, clotting fails.
- **Functions of blood:** transport (gases, food, hormones, urea, heat) · protection against germs (engulfing them, antibodies) · sealing wounds by clotting · spreading heat to keep body temperature steady · helping keep pH and water content steady.
- **Explorer (`#pos-explorer`):** composition pins over a 5.0 dm³ blood "bottle": plasma 55% (2.75 dm³) and cells 45% (2.25 dm³), then each cell type with its count per mm³ and life span; tapping a pin highlights that cell on the 3D smear.
- **3D Zoom (`zoom`, `HeartKit.bloodSmear`, `clot` 0 → 1):** a cut vessel edge: platelets gather, thromboplastin glow, prothrombin → thrombin sparks, fibrin threads weave across and trap red cells; a calcium-removed toggle (sodium citrate) shows the threads failing to form.

#### 4. Apply
- **Worked Example 1 (haemocytometer count):** 480 red cells were counted in 5 squares, each 0.2 mm × 0.2 mm × 0.1 mm deep, from blood diluted 1 in 200. Find the count per mm³ of whole blood.
  1. One square's volume: $0.2 \times 0.2 \times 0.1 = 0.004\text{ mm}^3$.
  2. Five squares: $5 \times 0.004 = 0.020\text{ mm}^3$.
  3. Diluted count: $480 / 0.020 = 24\,000\text{ cells mm}^{-3}$.
  4. Undo the dilution: $24\,000 \times 200 = 4\,800\,000 = 4.8 \times 10^6\text{ cells mm}^{-3}$.
  - **Answer:** 4.8 million per mm³, within the normal range of about 5 million.
- **Worked Example 2 (real size of a red cell):** On a micrograph at ×2000, a red cell measures 15 mm across. Find its real diameter in µm.
  1. Actual $= \dfrac{\text{image}}{M} = \dfrac{15\text{ mm}}{2000}$.
  2. $= 0.0075\text{ mm}$.
  3. Convert: $0.0075 \times 1000 = 7.5\ \mu\text{m}$.
  - **Answer:** 7.5 µm.
- **Worked Example 3 (red cells in the whole body):** With 5.0 × 10⁶ red cells per mm³ and 5.0 dm³ of blood, how many red cells are there?
  1. Convert volume: $1\text{ dm}^3 = 10^6\text{ mm}^3$, so $5.0\text{ dm}^3 = 5.0 \times 10^6\text{ mm}^3$.
  2. Multiply: $(5.0 \times 10^6) \times (5.0 \times 10^6)$.
  3. $= 25 \times 10^{12} = 2.5 \times 10^{13}$.
  - **Answer:** about 2.5 × 10¹³ red cells.
- **Worked Example 4 (model clotting answer):** "Explain how blood clots at a cut." Four numbered points: thromboplastin released by platelets and damaged tissue · with Ca²⁺ and vitamin K it converts prothrombin to thrombin · thrombin changes fibrinogen (dissolved) into fibrin (solid threads) · the fibrin net snares red cells, giving a clot.
- **The Bridge (`#bridge`):** play the clot zoom on the rider's gash. Verdict: platelets and torn tissue started the thromboplastin → thrombin → fibrin chain; the fibrin mesh trapped cells and sealed the wound. It was not "drying in the air", and salt would only sting and contaminate. But he had already lost about 1.5 dm³ of his 5.0 dm³: $1.5 / 5.0 \times 100 = 30\%$ of his blood, so red cells (oxygen carriers) must be replaced by transfusion. Big Idea: *blood is plasma plus three kinds of cell, and a chain of plasma proteins turns it solid where it must stop flowing.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 06.

#### 5. Reflect & Assignment
- **I can:** state the make-up of blood and plasma · compare the three cell types · explain four red cell adaptations · describe the four clotting steps · calculate a haemocytometer count and a real cell size.
- **Exit ticket (2 marks):** Name the soluble protein that becomes fibrin, and the mineral ion needed for clotting. (fibrinogen; calcium)
- **Recall:** 55/45 · plasma contents · plasma vs serum · six-row cell table · four red cell adaptations · phagocyte vs lymphocyte · four clotting steps · heparin · haemophilia.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 06.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L3 (first aid for bleeding; never share lancets; prepared smears only in class), L4 (micrographs, grids and tables), L6 (medical laboratory science careers). Preparation: use prepared stained smears; no student blood sampling is needed for this lesson.

---

### LESSON 07: Blood Groups, Rhesus, Transfusion and Disorders: Closing the Case
- **Folder:** `html/lessons/lesson-07/` · **Duration:** 80 min · **Competences:** L2, L3, L7
- **Guiding question:** Which of the six bags can save a B Rh− rider, and how great a danger is Mama Bisi's 160/100?
- **Objectives:**
  1. **01** · State the antigens and antibodies of the four ABO groups and predict safe donors and recipients.
  2. **02** · Explain agglutination and why donor and patient blood are typed and test-mixed before any transfusion.
  3. **03** · Explain the Rhesus factor and how haemolytic disease of the newborn arises and is prevented.
  4. **04** · Give the cause, a sign and a prevention for common circulatory disorders.
  5. **05** · Bring Lessons 01–06 together to solve the three Oja Oba cases.

#### 0. Do Now (`from: 1, 4, 5, 6`)
1. **Q:** Which plasma proteins defend the body? **A:** Antibodies (globulins).
2. **Q:** Name the insoluble protein in a clot. **A:** Fibrin.
3. **Q:** What does 120/80 mmHg stand for? **A:** Pressure in the arteries while the ventricles contract / relax.
4. **Q:** List three materials carried by blood. **A:** Any three, e.g. oxygen, glucose, urea.

#### 1. Wonder
- **Story:** (1) *Tent*: the cool box opens: O+, O−, A−, B+, B−, AB−. The rider's card reads B, Rh negative. (2) Baba Sule (`cust2`): "Take the AB! It has both letters, so it suits everybody." (3) Chidi (`cust1`): "Blood is blood. Won't any bag do?" (4) Dr Aisha (`amaka`): "The wrong bag can kill him faster than the crash. We test first." Meanwhile Mama Bisi (`ngozi`) asks whether her 160/100 is "just tiredness". (5) Invitation to the typing tile bench.
- **Wonder Wall prompt:** *What could go wrong if the rider receives the wrong bag of blood?*
- **Seed notes:** "His body will fight the new blood? (Tobi)" · "The blood will clump up (Hadiza)" · "Any blood works in an emergency (Chidi)" · "AB suits everybody (Baba Sule)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Safe to give to a group A patient?* Bins: `safe` · `unsafe`. Items (8): group A red cells → safe · group O red cells → safe · group B red cells → unsafe (antigen B meets his anti-b) · group AB red cells → unsafe (carries antigen B) · then *Safe to give to a group AB patient?*: A → safe · B → safe · AB → safe · O → safe.
- **2B 3D Practical (`bench`, typing tile, `HeartKit.bloodSmear` for the clumped vs free view):** ABO and Rhesus typing.
  - **Method cards (4):** (1) On a clean white tile, place one drop each of anti-A, anti-B and anti-D serum in three labelled wells for each sample. (2) Add a small drop of the sample to each well and mix with a fresh stirrer for every well. (3) Rock the tile gently and wait 2 minutes. (4) Look for clumping (agglutination) and decide the group.
  - **Scene parts:** `tile`, `antiA`, `antiB`, `antiD`, `stirrer`, `lancet`, `sharpsBin`, `wells`. **Controls:** sample *Rider* / *Donor 1–4* · *Add sample* · *Rock 2 min* · *Read*. Emits `l7:bench` per sample and `l7:bench-done` after 5 samples.
  - **Results table (`#results-table`):** Sample · Anti-A · Anti-B · Anti-D · ABO group · Rhesus · Safe for rider?
  - **Expected (`#expected`):** Rider · − · + · − · B · Rh− · (patient) / Donor 1 · − · − · − · O · Rh− · yes / Donor 2 · + · − · − · A · Rh− · no / Donor 3 · − · + · + · B · Rh+ · no (Rh+ cells could sensitise him) / Donor 4 · + · + · − · AB · Rh− · no.
  - **Precautions (past tense):** a separate clean stirrer was used for each well · wells were labelled before any serum was added · (teacher only) the lancet was sterile, used once and dropped in a sharps bin · gloves were worn and the tile was disinfected after use · every result was read after the full 2 minutes.
  - **Sources of error (with direction):** reading before 2 minutes missed weak clumping, so a positive well was read as negative (a **false negative**) · reusing one stirrer carried cells and serum between wells and could cause clumping that does not belong there (a **false positive**) · a drying drop at the edge of a well can look grainy and be mistaken for clumping (a **false positive**).
  - **Analysis questions (5, locked):** Why does group B blood clump in anti-B serum? · Why is Donor 4 unsafe though it contains the B antigen the rider already has? · Which donor is the universal ABO donor, and why? · Why is Rh+ blood avoided for an Rh− patient? · Why are fresh stirrers needed?

#### 3. Make Sense
- **ABO table (`#props-table`):** group A (antigen A on cells · anti-b in plasma · gives to A, AB · gets from A, O) · group B (antigen B · anti-a · gives to B, AB · gets from B, O) · group AB (antigens A and B · neither antibody · gives to AB only · gets from all four: universal recipient) · group O (no A or B antigen · anti-a and anti-b · gives to all four: universal donor · gets from O only).
- **Agglutination (`.callout.big`):** if donor red cells carry an antigen that matches an antibody in the patient's plasma, the antibodies link the cells into clumps. The clumps can block small vessels and the burst cells can damage the kidneys, which can be fatal. The rule: look at the **donor's antigens** and the **patient's antibodies**. Hospitals therefore test the group of both people and mix samples to check for clumping before any transfusion, and screen donated blood for syphilis, HIV and hepatitis B and C, storing it with an anticoagulant such as sodium citrate.
- **Rhesus (`.callout`):** people whose red cells carry the Rhesus (D) antigen are Rh+ (the majority); those without it are Rh−. An Rh− person makes anti-D only after meeting Rh+ cells. If an Rh− mother carries an Rh+ baby, baby cells can enter her blood at birth and sensitise her; in a later Rh+ pregnancy, her anti-D crosses the placenta and attacks the red cells of the unborn child, a condition called haemolytic disease of the newborn. An anti-D injection given to the mother soon after each delivery prevents this.
- **Disorders (`.tbl`, cause · sign · prevention):** hypertension (pressure stays high; risk rises with stress, obesity, salt, smoking, alcohol and family history · headaches, often no sign at all · less salt, exercise, weight control, regular checks, prescribed drugs) · atherosclerosis (fatty deposits narrow and stiffen arteries · chest pain on effort · avoid smoking, eat less saturated fat, stay active) · coronary heart disease and heart attack (blocked coronary artery; muscle dies · crushing chest pain · as atherosclerosis, urgent care) · stroke (part of the brain loses its blood supply or a vessel bursts · sudden weakness on one side, slurred speech · control blood pressure) · thrombosis (a clot forms inside a vessel · painful swollen limb · keep moving on long journeys, anticoagulants) · varicose veins (failed vein valves · swollen twisting leg veins · avoid standing still for hours, exercise) · anaemia (a shortage of red cells or of haemoglobin, from iron lack, malaria, hookworm or blood loss · tiredness, pale palms · iron-rich food, deworming and malaria treatment) · sickle cell anaemia (inherited HbS; cells bend into sickles and jam in capillaries · painful crises · genotype testing and counselling before marriage) · leukaemia (cancer of white cells · repeated infections · hospital treatment) · haemophilia (inherited, sex-linked clotting failure · prolonged bleeding · avoid injury, clotting factor) · hole in the heart (an opening in the septum present from birth; blood mixes · breathlessness, poor feeding and growth, a heart murmur; a bluish tinge only in severe cases · surgery).
- **Healthy heart habits:** regular exercise, meals with little saturated fat, salt or sugar, no smoking, little or no alcohol, managing stress, keeping a healthy weight, regular check-ups.
- **Explorer (`#pos-explorer`):** donor–patient grid pins (4 × 4 ABO, then Rh toggle); tapping a pin mixes donor cells into patient plasma on the 3D smear and shows "clumps" or "safe" with the antigen–antibody reason.
- **3D Zoom (`zoom`, `HeartKit.bloodSmear`):** antibodies (Y shapes) bridging group B cells in anti-B serum until they clump, beside free-floating cells in a compatible mix; a second scene shows Rh sensitisation over two pregnancies as a staged animation.

#### 4. Apply
- **Worked Example 1 (reading a tile):** A sample clumps with anti-A and anti-D but not with anti-B. Find the group.
  1. Clumps with anti-A → antigen A present.
  2. No clumping with anti-B → antigen B absent; so ABO group A.
  3. Clumps with anti-D → Rhesus antigen present.
  - **Answer:** A Rh+.
- **Worked Example 2 (choosing bags for the rider):** Patient B Rh−. Bags: O+, O−, A−, B+, B−, AB−.
  1. ABO: his plasma holds anti-a, so reject bags with antigen A (A−, AB−); B and O cells are acceptable.
  2. Rhesus: he is Rh−; reject Rh+ bags (O+, B+) so he is not sensitised.
  3. Left: B− (exact match, first choice) and O−.
  - **Answer:** B− first, O− as the alternative.
- **Worked Example 3 (Mama Bisi's reading):** Her pressure is 160/100 mmHg. Hypertension is diagnosed when readings on two different days are 140 mmHg or more systolic, or 90 mmHg or more diastolic.
  1. Systolic: 160 ≥ 140, above the line.
  2. Diastolic: 100 ≥ 90, above the line.
  3. Pulse pressure: $160 - 100 = 60\text{ mmHg}$, compared with $120 - 80 = 40$ normally, a stiffer, harder-worked arterial system.
  - **Answer:** both numbers are high; she needs repeat checks and treatment, not rest alone.
- **Worked Example 4 (Rhesus pregnancy):** An Rh− woman's first baby is Rh+. Explain the risk to her second Rh+ baby in steps: baby cells enter her blood at the first birth → she makes anti-D → in the second pregnancy anti-D crosses the placenta → baby's red cells are destroyed. Prevention: anti-D injection soon after the first delivery.
- **The Bridge (`#bridge`, whole case file solved):** students fill in Dr Aisha's whiteboard. Case 1 (Chidi): healthy SAN-driven rise and recovery; nothing wrong. Case 2 (Mama Bisi): long standing and leaky varicose-vein valves → raised venous-end capillary pressure → oedema (solved in Lesson 05); separately, her 160/100 is hypertension, which risks stroke, heart attack and kidney damage; less salt, regular checks, raise and exercise the legs. Case 3 (rider): clotting sealed the wound; 30% blood lost; give B−, or O− if B− runs out; never AB− or Rh+ bags. Baba Sule's seven wrong claims are flipped one by one. Big Idea: *a working circulation needs a healthy pump, sound vessels, the right pressure and the right blood, and each can be tested and protected.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 07.

#### 5. Reflect & Assignment
- **I can:** state antigens and antibodies for each ABO group · pick safe donors · explain agglutination · explain haemolytic disease of the newborn · give cause and prevention of four disorders.
- **Exit ticket (2 marks):** Which group is the universal recipient, and why? (AB; its plasma has neither anti-a nor anti-b)
- **Recall:** ABO table · donor antigen + patient antibody rule · Rhesus and anti-D · screening and citrate · eleven disorders with one prevention each · healthy-heart habits · the three solved cases.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 07.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–40 Investigate (25 min) · 40–45 tidy-up and share results · 45–50 movement break · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L2 (discussing genotype and blood donation in Nigerian families respectfully), L3 (sterile lancets, transfusion safety, blood-pressure checks), L7 (voluntary blood donation and community screening). Use commercial typing kits with the teacher's own or donated, screened samples; never let students share lancets.

---

## 6. Narrator Choreography Blueprint (`window.NARRATION`)
- **Welcome Hub (12 steps):** hero title → 3D Hero Lab `heart` mode (spotlight `lv`, `septum`) → `circuit` mode (double vs single) → `pace` mode (slider wait) → mystery case file → clue cards → journey cards → explorer tabs (wait `tab`) → archetypes → myths (wait `flip`) → method → finale CTA.
- **Each lesson (26–30 steps):** hero → Do Now (wait `donow`) → story playback (`story:0`–`story:4`) → Wonder Wall (wait `note`) → sort (wait `sort`) → bench (`bench.setMode`, spotlight named parts, wait `lX:bench-done`) → results, expected and graph → concepts and `.eq` → explorer (wait `pin`) → zoom (`zoom.setMode`) → worked examples (StudyMath step reveals) → explainer video (Lessons 04, 05, 06 under the cap) → Bridge (wait `bridge`) → quiz (wait `quiz`) → reflect → assignment. Nigerian English (`en-NG`) voice ranked first.
- **Spotlight cues worth scripting:** L02 `lv` vs `rv` thickness callouts; L04 `san` → `avn` → `his` → `purkinje` glow with LUB/DUB captions; L05 `probe` stops at 0 and 1 with NFP arrows; L06 `fibrin` weave; L07 anti-B well clumping.

---

## 7. Explainer Video Plan
video_cap: 3

| lesson | score | recommend | reasons | video would cover |
|---|---|---|---|---|
| lesson-01 | 7 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception | meets the bar; dropped by the cap. If raised: SA:V with unit changes, Amoeba vs Chidi, open/single/double circuits side by side · kits: graph; KIT GAP: circulation-types (on the fly) |
| lesson-02 | 2 | no | +3 multi-step calculations · +2 frequently examined · +2 misconception · −3 practical-led · −2 recall or revision | — the dissection bench and labelling already teach this hands-on |
| lesson-03 | 7 | yes | +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 staged process | meets the bar; dropped by the cap. If raised: a tracer drop following arm → brain and ileum → liver → brain, lungs never skipped · kits: heart (flow) |
| lesson-04 | 11 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 graph reading · +1 staged process | the cardiac cycle with valves and LUB/DUB timing, SAN → AVN → His → Purkinje, heart rate from a pulse count, cardiac output example, the recovery curve · kits: heart, graph |
| lesson-05 | 10 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 graph reading | artery/vein/capillary walls, tissue fluid out at the arterial end and back at the venous end, NFP example (36/16 against 25), speed example (0.035 cm/s), Mama Bisi's oedema, lymph return · kits: capillary-bed, graph |
| lesson-06 | 10 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 staged process | blood in a tube (55/45), the three cell types, haemocytometer count example, the clotting cascade on a cut vessel · kits: blood |
| lesson-07 | 5 | yes | +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 staged process · −2 recall or revision | meets the bar; dropped by the cap. If raised: ABO cross-match with clumping, the rider's bag choice, Rhesus over two pregnancies · kits: blood (ABO scene) |
