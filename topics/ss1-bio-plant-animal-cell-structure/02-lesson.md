---
slug: ss1-bio-plant-animal-cell-structure
title: Plant and Animal Cells: Structure, Forms and the Cell's Environment
subject: Biology
class: SS1
exams: [WAEC, NECO, JAMB]
lessons: 5
duration_min: 80
version: 2
---

# Multi-Lesson Unit Plan: Plant and Animal Cells (`ss1-bio-plant-animal-cell-structure`)

---

## Part I: Unit Welcome Hub (`html/index.html`)

### 1. Hero & 3D Hero Lab
- **Eyebrow:** `SS1 BIOLOGY · WAEC · NECO · JAMB · PAPER 3 PRACTICAL`
- **Display title:** `The Cell: *Life's Smallest Unit*`
- **Lede:** Why do Mama Ngozi's ugu leaves stay crisp under clean water but wilt in salty water, and why would a doctor at LUTH never drip plain water into a patient's vein? Look inside plant and animal cells, watch water move across their membranes, and learn to draw and measure cells the way a WAEC examiner marks them.
- **CTAs:** `Start guided tour (en-NG) ▷` (`data-tour`) · `Begin Lesson 1 →` (`lessons/lesson-01/index.html`)
- **Hero meta:** `5 lessons · ~6 h 40 min` · `5 3D labs + 5 3D zooms` · `60 quiz questions + 5 × 30-mark papers` · `Paper 3 drawing clinic`
- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`, `cell-bio` kit):**
  - `cells`: a plant cell beside an animal cell; tap an organelle to see its name, membrane count and function.
  - `microscope`: a compound microscope; buttons ×4 / ×10 / ×40 objective (eyepiece ×10); readout shows total magnification ×40 / ×100 / ×400 and the field of view shrinking.
  - `osmosis`: a plant cell and a red cell side by side; buttons *water* / *0.9% saline* / *salty water*; the plant cell goes turgid / normal / plasmolysed, the red cell swells and bursts / stays normal / crenates.
  - HUD readouts: mode, magnification, state of each cell.

### 2. Marquee (12 terms)
cell theory · organelle · ×eyepiece × ×objective · nucleus · mitochondrion · chloroplast · cellulose wall · selectively permeable · *Volvox* colony · SA : V = 6/L · osmosis · isotonic 0.9% saline

### 3. Unit Mystery Case File (`#mystery`)
- **Narrative:** At Mile 12 Market, Mama Ngozi's ugu leaves wilt within an hour of being washed in salty water. The same evening, Dr Amaka at LUTH refuses to drip plain water into a dehydrated patient and asks for 0.9% saline. Chinedu wants to know what links a limp leaf to a hospital drip. Coach Danjuma says "salt soaks into the leaves and makes them heavy", and that "water can't hurt anybody".
- **Clue cards:** the leaf wilts but does not burst · the patient needs water, yet plain water is refused · the saline is exactly 0.9% · under a microscope, both leaf and blood are made of cells.
- **Exam-weight stats:** `Regularly` cell structure appears in WAEC Papers 1, 2 and 3 · `Paper 3`: onion and cheek cell slides and drawings are a recurring practical · `JAMB`: Topic 1 of the syllabus (living organisms, cells and levels of organisation).

### 4. Lesson Journey (`#journey`)
Five cards linking to `lessons/lesson-01/` … `lesson-05/`, each with duration (80 min), tags and a one-line promise (see Part II titles). Thread note: every lesson's Do Now retrieves from earlier lessons.

### 5. Explorer, Archetypes, Myths, Method
- **Explorer tabs (4)** with SVG curve `#combo-curve`: *Magnification* (image size = actual × M for a 0.05 mm cell, M from ×40 to ×400) · *Surface area : volume* (6/L for L = 1–6 mm) · *Osmosis* (smooth curve of % change in mass vs sucrose concentration, crossing zero at about 0.34 mol dm⁻³) · *Levels of organisation* (step chart).
- **6 calculation archetypes** (StudyMath chains):
  1. Total magnification: $M = M_{\text{eyepiece}} \times M_{\text{objective}} = 10 \times 40 = \times 400$
  2. Cell width from field of view: $\frac{0.40\text{ mm}}{8} = 0.050\text{ mm} = 50\ \mu\text{m}$
  3. Actual size: $\frac{\text{image}}{M} = \frac{24\text{ mm}}{400} = 0.060\text{ mm} = 60\ \mu\text{m}$
  4. Drawing magnification: $M = \frac{50\text{ mm}}{0.25\text{ mm}} = \times 200$
  5. SA : V of a cube: $\frac{6L^2}{L^3} = \frac{6}{L} = \frac{6}{2\text{ mm}} = 3.0\text{ mm}^{-1}$
  6. % change in mass: $\frac{2.85 - 2.50}{2.50} \times 100 = +14.0\%$
- **Myth flip cards (3):** see Topic Map § 3.
- **Method (`#method`):** the 5-step inquiry loop · What's inside every lesson (`#kit`) · finale CTA to Lesson 1.

### 6. Spaced Retrieval Bank (`assets/js/retrieval-bank.js`)
`l01` … `l05`, each with `donow` (4 cards, `from`), `quiz` and `recall` arrays, as listed in each lesson's Phase 0 and Phase 5.

---

## Part II: The Five Lessons

---

### LESSON 01: Discovering the Cell: Microscopes, Cell Theory and Prokaryotes vs Eukaryotes
- **Folder:** `html/lessons/lesson-01/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** Ugu leaves and blood look nothing alike, so what do they share, and how do we see it?
- **Objectives:**
  1. **01** · State the three ideas of the cell theory and the contributions of Hooke, Dujardin, Schleiden and Schwann.
  2. **02** · Define a cell and an organelle.
  3. **03** · Name the parts of a compound microscope and calculate total magnification.
  4. **04** · Calculate actual cell size from a field of view or an image, converting mm to µm.
  5. **05** · Compare prokaryotic and eukaryotic cells in a matched table.

#### 0. Warm-up · Do Now (5 min, `from: 0`)
1. **Q:** List four characteristics that every living thing shows. **A:** Any four of nutrition, respiration, movement, growth, reproduction, excretion, irritability (sensitivity).
2. **Q:** How many micrometres (µm) are in 1 millimetre? **A:** $1\text{ mm} = 1000\ \mu\text{m}$.
3. **Q:** Calculate $0.25 \times 400$ and $24 \div 400$. **A:** $100$ and $0.06$.
4. **Q:** What does a hand lens do to an object's image? **A:** It makes the image appear larger (magnifies it) so we can see detail.

#### 1. Wonder · Story & Wonder Wall (8–10 min)
- **3D Story (`story.js`), set 1 → set 2:**
  1. *Market*: Mama Ngozi (`ngozi`) shows Chinedu (`cust1`) a limp ugu leaf beside a crisp one. "Same leaves, same morning. One was washed in salty water."
  2. *Market*: Coach Danjuma (`cust2`): "The salt soaks in and makes the leaf heavy, simple!" Chinedu isn't convinced.
  3. *Lab*: Dr Amaka (`amaka`) mentions the patient who must not get plain water through a drip. "Leaves and blood obey the same rule. To see why, we start with what they're both made of."
  4. *Lab*: She slides a thin ugu leaf peel and a smear of blood under a microscope. Tiny compartments appear in both.
  5. *Lab*: "In 1665 a man looking at cork named shapes like these. Today you'll see them yourselves." Invitation to the microscope bench.
- **Wonder Wall prompt:** *Before we look: what do you think a leaf and a drop of blood could possibly have in common?*
- **Seed notes:** "Both are wet? (Tolu)" · "Both come from living things (Aisha)" · "Maybe both are made of tiny bricks? (Emeka)" · "Blood is a liquid, so it can't have parts (Coach Danjuma)".

#### 2. Investigate · Sort Game & 3D Practical (25 min)
- **2A Sort game (`#sort`):** *Who discovered what?* Bins: `hooke` (Robert Hooke, 1665) · `dujardin` (Félix Dujardin, 1835) · `schleiden-schwann` (Schleiden 1838 / Schwann 1839). Items (9): named the box-like spaces in cork "cells" → hooke · looked at **dead** cork walls → hooke · used an early compound microscope he improved himself → hooke · first reported the living jelly that fills cells → dujardin · called that jelly "sarcode" → dujardin · showed that cells contain living material, not just walls → dujardin · concluded that every plant is built of cells → schleiden-schwann · extended the idea to every animal → schleiden-schwann · together laid the base of the cell theory → schleiden-schwann. Each item has a one-line *why*.
- **2B 3D Practical (`bench`, `cell-bio` kit, microscope mode):**
  - **Method cards (4):** (1) Start on the ×4 objective and focus with the coarse knob. (2) Centre the specimen, then turn to ×10 and ×40 and focus only with the fine knob. (3) Record eyepiece and objective, then total magnification. (4) Count how many cells lie side by side across the field of view and record the field diameter.
  - **Scene parts:** `eyepiece`, `objective`, `stage`, `mirror`, `coarse`, `fine`, `slide`. **Controls:** objective ×4 / ×10 / ×40 · slide: *cork* / *onion peel* / *blood smear* · *Measure* button. Emits `l1:bench` each measurement and `l1:bench-done` after 3 objectives on any slide.
  - **Results table (`#results-table`):** Objective · Total magnification · Field diameter (mm) · Cells across field · Cell width (mm) · Cell width (µm).
  - **Expected results (`#expected`), onion peel:** ×4 → ×40, field 4.0 mm, 80 cells, 0.050 mm, 50 µm · ×10 → ×100, field 1.6 mm, 32 cells, 0.050 mm, 50 µm · ×40 → ×400, field 0.40 mm, 8 cells, 0.050 mm, 50 µm. (The cell width stays the same at every magnification, a key insight: magnifying changes the image, not the cell.)
  - **Precautions (past tense):** the specimen was found on low power before high power was used · only the fine knob was used at ×40 so the objective did not crush the slide · the slide was held flat on the stage with the clips.
  - **Analysis questions (5, locked):** Why does the cell width stay the same though the image grows? · Why start on the lowest power? · Why is the fine knob used at ×40? · What would you see on a cork slide that differs from onion? (empty walls, no contents) · Calculate total magnification for ×15 eyepiece and ×40 objective (×600).

#### 3. Make Sense (15 min)
- **Concepts (`#concepts`):** a *cell* is the basic unit of life: the smallest part of an organism that is both its building block (structure) and its working unit (function). An *organelle* is a tiny part inside the cytoplasm that is specialised to do one particular job for the cell.
- **Cell theory (`.callout.big`):** (1) every organism consists of one cell or of many cells; (2) organisms are built from cells, and cells carry out their life processes; (3) new cells form only when existing cells divide (Virchow, 1855; useful though not required).
- **Equations (`.eq`):** total magnification $= M_{\text{eyepiece}} \times M_{\text{objective}}$ · actual size $= \dfrac{\text{image size}}{\text{magnification}}$ · cell width $= \dfrac{\text{field diameter}}{\text{number of cells side by side}}$ · $1\text{ mm} = 1000\ \mu\text{m}$.
- **Comparison table (`#props-table`):** prokaryote vs eukaryote: nuclear membrane (absent; DNA free in cytoplasm | present) · membrane-bound organelles (absent | present: mitochondria, ER, Golgi) · ribosomes (smaller | larger) · DNA (circular | linear chromosomes) · size (usually smaller | usually larger) · examples (bacteria, blue-green algae | plants, animals, fungi, protists).
- **Explorer (`#pos-explorer`):** tap objective pins (×4, ×10, ×40) to see image size of a 50 µm cell: 2 mm, 5 mm, 20 mm at ×40, ×100, ×400.
- **3D Zoom (`zoom`):** a bacterium beside a plant cell at the same scale; toggle `nucleus`, `organelles`, `ribosomes`; counters: membrane-bound organelles (0 vs many).

#### 4. Apply (20 min)
- **Worked Example 1 (cell width from field of view):** With a ×10 eyepiece and a ×40 objective, the field of view is 0.40 mm wide and 8 onion cells lie side by side across it. Find the total magnification and the width of one cell in µm.
  1. Total magnification $= 10 \times 40 = \times 400$ (multiply, never add).
  2. Cell width $= \dfrac{0.40\text{ mm}}{8} = 0.050\text{ mm}$.
  3. Convert: $0.050\text{ mm} \times 1000 = 50\ \mu\text{m}$.
  - **Answer:** ×400; $50\ \mu\text{m}$.
- **Worked Example 2 (actual size from an image):** A photomicrograph taken with a ×10 eyepiece and a ×40 objective shows a cheek cell 24 mm long. Find its actual length.
  1. Total magnification $= 10 \times 40 = \times 400$.
  2. Actual $= \dfrac{24\text{ mm}}{400} = 0.060\text{ mm}$.
  3. Convert: $0.060 \times 1000 = 60\ \mu\text{m}$.
  - **Answer:** $60\ \mu\text{m}$.
- **Worked Example 3 (drawing magnification):** An onion cell 0.25 mm long is drawn 50 mm long. (a) Find the magnification of the drawing. (b) How long would the drawing be at ×150?
  1. (a) $M = \dfrac{50\text{ mm}}{0.25\text{ mm}} = \times 200$ (no unit).
  2. (b) Drawing length $= 150 \times 0.25\text{ mm} = 37.5\text{ mm}$.
  - **Answer:** ×200; 37.5 mm.
- **The Bridge (`#bridge`):** two unlabelled slides from the story. Students identify the ugu peel (regular box-shaped cells with walls) and the blood smear (round cells, no walls), then estimate a red cell's size (field 0.40 mm, 50 cells across → 0.008 mm = 8 µm). Unlocks the Big Idea: *both a leaf and blood are made of cells; the leaf cells have walls, the blood cells do not.*
- **Quiz (`#quiz`):** 12 questions from `03-questions.md` § Lesson 01.

#### 5. Reflect & Assignment (10 min + 40 min home)
- **I can (1–4):** state the cell theory · name four scientists and their work · calculate total magnification · find actual size in µm · compare prokaryotes and eukaryotes.
- **Exit ticket (2 marks):** Eyepiece ×10, objective ×10, 20 cells side by side across a 2.0 mm field. Find total magnification and cell width in µm. (×100; 0.10 mm = 100 µm.)
- **Blank-page recall:** the three cell-theory statements · Hooke 1665 cork · Dujardin living jelly · Schleiden plants, Schwann animals · M = eyepiece × objective · actual = image ÷ M · prokaryote: no nucleus.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 01.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences L1 (prediction), L4 (scales), L5 (simulation).

---

### LESSON 02: Inside the Cell: Organelles, Plant vs Animal Cells
- **Folder:** `html/lessons/lesson-02/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** What is inside an ugu cell that a blood cell lacks, and why does that matter for water?
- **Objectives:**
  1. **01** · Describe the structure and state the function of each cell component.
  2. **02** · Classify organelles by membrane: double (nucleus, mitochondrion, chloroplast), single (lysosome, vacuole/tonoplast, ER, Golgi body), none (ribosome, centrioles).
  3. **03** · Compare plant and animal cells, and cell wall and cell membrane, in matched tables.
  4. **04** · Trace the route of a secreted protein: ribosome → rough ER → Golgi body → membrane.
  5. **05** · Explain why ribosomes can never be seen with a light microscope (below its resolving limit) and why mitochondria, ER and Golgi bodies are not visible on a stained school slide.

#### 0. Do Now (`from: 1`)
1. State the three ideas of the cell theory. · 2. Total magnification with eyepiece ×10 and objective ×40? (×400) · 3. Name one structure a prokaryote lacks. (nuclear membrane / membrane-bound organelles) · 4. What did Hooke actually see in cork? (empty walls of dead cells)

#### 1. Wonder
- **Story:** (1) *Lab*: Dr Amaka projects a giant plant cell and a giant animal cell. (2) Coach Danjuma: "A cell is just a bag of water." (3) Chinedu spots a thick outer layer around the ugu cell only. (4) Dr Amaka: "That wall, and a big sap vacuole, will decide what happens to the leaf in salty water. Today we open the cell and meet its workers." (5) Invitation to the organelle dissector.
- **Wonder Wall prompt:** *If the cell is a small factory, which "workers" would it need?* Seeds: "a boss to give orders (Kemi)" · "a power station (Musa)" · "a kitchen to make food, only in plants? (Ada)" · "nothing, it's just water (Coach Danjuma)".

#### 2. Investigate
- **2A Sort (`#sort`):** *How many membranes?* Bins: `double` · `single` · `none`. Items (10): nucleus → double · mitochondrion → double · chloroplast → double · lysosome → single · vacuole with tonoplast → single · endoplasmic reticulum → single · Golgi body → single · ribosome → none · centrioles → none · cell wall → none (it is not a membrane at all: cellulose).
- **2B 3D Practical (`bench`, `cell-bio` kit, cells mode):** organelle dissector. Tap any organelle in the plant or the animal cell; a card shows name, structure, membrane count, function, "plant / animal / both". **Method cards:** (1) Tap each organelle in the plant cell. (2) Repeat for the animal cell. (3) Tick in the table whether each is present in plant, animal or both. (4) Note which you could see on a school slide. **Parts:** `wall`, `membrane`, `nucleus`, `mitochondrion`, `chloroplast`, `vacuole`, `er`, `golgi`, `ribosome`, `lysosome`, `centrioles`. Emits `l2:bench`, `l2:bench-done` after 8 organelles.
  - **Results table:** Organelle · Membranes (2/1/0) · Function · Plant · Animal.
  - **Expected:** as Make Sense table below.
  - **Analysis questions (5, locked):** Which three structures are found only in plant cells? (cellulose wall, chloroplasts, large sap vacuole) · Which two are the safest "animal only" answers? (centrioles, glycogen granules) · Why does a muscle cell have many mitochondria? · Why is the cell wall not a membrane? · Which organelle would you expect many of in a cell that secretes enzymes? (rough ER and Golgi body)

#### 3. Make Sense
- **Organelle table (`#props-table`):** **cell wall**: a stiff outer case of cellulose that lets almost anything through; holds the plant cell's shape · **cell membrane**: a thin living skin of lipid and protein that chooses what enters and leaves · **cytoplasm**: the jelly in which most of the cell's chemical work happens · **nucleus**: wrapped in two membranes with pores, holds the nucleolus and chromatin; directs the cell and carries its inherited instructions · **mitochondrion**: two membranes, the inner one folded into cristae around the matrix; the cell's power station, releasing energy (ATP) in aerobic respiration · **chloroplast** (green plant cells only): two membranes around a stroma with stacks of grana holding chlorophyll; captures light to make food · **endoplasmic reticulum**: a network of membrane channels, rough where ribosomes stud it; carries materials through the cell · **ribosome**: a tiny grain with no membrane at all; assembles proteins (found even in bacteria) · **Golgi body**: a pile of flat membrane pouches; sorts, packs and sends out products, and buds off lysosomes · **lysosome**: one membrane around digestive enzymes; breaks down worn-out parts (common in animal cells, rare in plants) · **centrioles**: a pair of tiny hollow rods near the nucleus; build the spindle when an animal cell divides (flowering plants lack them) · **vacuole**: in plants one large sap-filled space lined by the tonoplast that keeps the cell firm; in animals small and short-lived; in freshwater protozoa such as *Amoeba*, a contractile vacuole pumps out excess water.
- **Plant vs animal (`.tbl`):** wall present | absent · shape regular | irregular · vacuole large central | small or temporary · chloroplasts present | absent · centrioles absent (flowering plants) | present · nucleus at the side | central · food stored as starch | glycogen. Similarities: membrane, cytoplasm, nucleus, mitochondria, ribosomes, ER, Golgi body.
- **Wall vs membrane (`.tbl`):** cellulose | lipoprotein · fully permeable | selectively permeable · rigid | flexible · non-living | living · plants only | all cells.
- **Resolution (`.callout`):** magnification makes an image bigger; *resolution* is the ability to show two close points as separate. A school light microscope cannot separate points closer than about 0.2 µm, so anything smaller (ribosomes, the inner folds of a mitochondrion) stays a blur at any magnification; only an electron microscope shows it. Mitochondria (about 1 µm) are above this limit, but iodine and methylene blue do not stain them, so on a school slide they are not visible.
- **Explorer (`#pos-explorer`):** membrane-count pins: tap 0, 1 or 2 to light up every organelle with that many membranes in both cells.
- **3D Zoom (`zoom`):** inside a mitochondrion (cristae, matrix) and a chloroplast (grana, stroma); then the protein route: ribosome on rough ER → vesicle → Golgi body → out of the membrane.

#### 4. Apply
- **Worked Example 1 (size from an electron micrograph):** An electron micrograph at ×15 000 shows a mitochondrion 30 mm long. Find its actual length in µm.
  1. Actual $= \dfrac{30\text{ mm}}{15\,000} = 0.002\text{ mm}$. 2. Convert: $0.002 \times 1000 = 2\ \mu\text{m}$. **Answer:** $2\ \mu\text{m}$.
- **Worked Example 2 (why ribosomes are invisible on a school slide):** A ribosome is about $0.025\ \mu\text{m}$ across. At ×400, how large is its image, and can the eye see it? (The unaided eye can just make out about 0.1 mm.)
  1. Image $= 0.025\ \mu\text{m} \times 400 = 10\ \mu\text{m}$. 2. Convert: $10\ \mu\text{m} = 0.010\text{ mm}$. 3. Compare: $0.010\text{ mm} < 0.1\text{ mm}$, ten times too small to see. 4. Would more magnification help? No: the light microscope cannot resolve points closer than about 0.2 µm, and a ribosome (≈ 0.025 µm) is about 8 times smaller than that limit ($0.2 / 0.025 = 8$), so at any magnification it stays an unresolved blur. **Answer:** 10 µm; not visible on a light microscope at any magnification (only an electron microscope shows ribosomes), which is why they are never labelled on a Paper 3 drawing.
- **Worked Example 3 (a model table answer):** "State three differences between a plant cell and an animal cell." Model answer in a matched table: cell wall (present | absent) · chloroplasts (present | absent) · vacuole (large, central | small or none). Note: one row per feature, both columns filled.
- **Bridge:** predict which cell in the story can resist bursting in pure water (the ugu cell: its cellulose wall). Big Idea: *plant cells have a wall and a large sap vacuole; animal cells do not; this difference decides what water does to each.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 02.

#### 5. Reflect & Assignment
- **I can (1–4):** give each organelle's function · sort organelles by membranes · compare plant and animal cells in a table · compare wall and membrane · trace a protein from ribosome to secretion.
- **Exit ticket (2 marks):** Name two organelles with a double membrane and one with no membrane. (any two of nucleus, mitochondrion, chloroplast; ribosome)
- **Recall:** 12 organelles and functions · membrane counts · plant-only three · animal-only two · wall vs membrane five rows.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 02.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences L1 (prediction), L4 (tables), L5 (dissector).

---

### LESSON 03: Forms of Cells and Levels of Organisation
- **Folder:** `html/lessons/lesson-03/` · **Duration:** 80 min · **Competences:** L1, L4, L7
- **Guiding question:** Why can an *Amoeba* live alone in a pond while Chinedu needs a heart, lungs and blood?
- **Objectives:**
  1. **01** · Describe free-living, colonial, filamentous and tissue-level forms with named examples.
  2. **02** · Distinguish a colony (*Volvox*) from a tissue (*Hydra*).
  3. **03** · Describe nutrition as a cell property: autotrophic (*Chlamydomonas*, *Spirogyra*, *Euglena* in light), saprophytic (*Euglena* in darkness), holozoic (*Amoeba*, *Paramecium*).
  4. **04** · Arrange organelle → cell → tissue → organ → system → organism with examples.
  5. **05** · Calculate surface area to volume ratio and explain why large organisms need transport systems.

#### 0. Do Now (`from: 1, 2`)
1. Function of the contractile vacuole? (removes excess water from a protozoan) · 2. Name the three plant-only structures. · 3. Which organelle releases energy in respiration? (mitochondrion) · 4. Actual size of a 30 mm image at ×600? (0.05 mm = 50 µm)

#### 1. Wonder
- **Story:** (1) *Market*: Chinedu scoops green water from a drain beside the market into a jar. (2) Coach Danjuma: "Nothing lives in that, it's just dirty water." (3) *Lab*: under the microscope: a shape-changing blob (*Amoeba*), a slipper covered in hairs (*Paramecium*), a green spindle with a whip (*Euglena*), a hollow green ball (*Volvox*). (4) Dr Amaka: "Each of these is a whole living thing, yet Chinedu is billions of cells working together. Why the difference?" (5) Invitation to the pond survey and the cube bench.
- **Wonder Wall prompt:** *Is a single cell that lives on its own "simpler" or "smarter" than your body?* Seeds: "One cell can't do everything (Bola)" · "It must eat and breathe somehow (Ifeanyi)" · "Big animals need hearts because they are big? (Halima)" · "Volvox has many cells, so it's a tissue (Coach Danjuma)".

#### 2. Investigate
- **2A Sort (`#sort`):** *How does it live?* Bins: `free` (free-living single cell) · `colony-filament` · `tissue`. Items (9): *Amoeba* · *Paramecium* · *Euglena* · *Chlamydomonas* → free · *Volvox* (hollow ball of similar cells) · *Spirogyra* (unbranched chain of cells) → colony-filament · *Hydra* (two cell layers) · epithelium lining the cheek · blood → tissue.
- **2B 3D Practical (`bench`):** two stations.
  - *Pond survey* (`cell-bio` kit, protists): tap each organism to see form, features to draw, and nutrition. Parts: `amoeba`, `paramecium`, `euglena`, `chlamydomonas`, `volvox`, `spirogyra`, `hydra`.
  - *SA:V cube bench:* agar-style cubes L = 1, 2, 3, 4, 6 mm; *Calculate* shows SA = 6L², V = L³, SA:V; a dye-diffusion animation shows the undyed centre growing with L.
  - **Results table:** L (mm) · SA (mm²) · V (mm³) · SA : V (mm⁻¹). **Expected:** 1 · 6 · 1 · 6.0 / 2 · 24 · 8 · 3.0 / 3 · 54 · 27 · 2.0 / 4 · 96 · 64 · 1.5 / 6 · 216 · 216 · 1.0.
  - Emits `l3:bench`, `l3:bench-done` after 4 cubes.
  - **Analysis (5, locked):** What happens to SA:V as L doubles? (halves) · Why does the centre of a large cube stay undyed? · Why can *Amoeba* rely on diffusion? · Why does *Euglena* puzzle classifiers? (chloroplasts and a gullet: plant-like and animal-like) · Why is *Volvox* not a tissue?

#### 3. Make Sense
- **Forms table:** *Amoeba* (free; no fixed shape, pseudopodia, food and contractile vacuoles; holozoic) · *Paramecium* (free; slipper shape, cilia, oral groove, macro- and micronucleus; holozoic) · *Euglena* (free; spindle, flagellum, eyespot, chloroplasts; autotrophic in light, saprophytic in darkness) · *Chlamydomonas* (free; two flagella, cup-shaped chloroplast, cellulose wall; autotrophic) · *Volvox* (colony; hollow sphere of *Chlamydomonas*-like cells linked by strands; autotrophic) · *Spirogyra* (filament; spiral ribbon chloroplasts; autotrophic) · *Hydra* (tissue level; ectoderm and endoderm; holozoic).
- **Colony vs tissue (`.callout`):** *Volvox* cells are copies of one another: each can feed, respire and move by itself, so jobs are hardly shared, and *Spirogyra*'s filament works the same way. In *Hydra*, cells have taken on different jobs (catching food, digesting, covering) and could not survive apart. That sharing of jobs is what makes a tissue.
- **Levels (`.eq` style chain):** organelle → cell (*Euglena*) → tissue (*Hydra*, epithelium, blood) → organ (onion bulb, heart, leaf) → system (digestive, excretory) → organism.
- **Complexity (`.tbl`):** *what Chinedu's body pays for being big:* it must carry water and food to distant cells (blood and a heart, because its SA:V is small), it must eat far more than an *Amoeba*, an injured organ can endanger every cell, and none of its cells could live on their own · *what it gains:* specialised cells each do one job very well, the body can grow large, and it can live in many places (a market, a hot classroom, a cold air-conditioned clinic).
- **SA:V (`.eq`):** $\dfrac{\text{SA}}{V} = \dfrac{6L^2}{L^3} = \dfrac{6}{L}$.
- **Explorer (`#pos-explorer`):** cube-side pins L = 1–6 mm showing SA, V and 6/L, with the undyed centre growing.
- **3D Zoom:** *Volvox* colony beside *Hydra* (two layers, specialised cells); the level ladder animates upward.

#### 4. Apply
- **Worked Example 1:** A cube of side 2 mm. (1) $\text{SA} = 6 \times 2^2 = 24\text{ mm}^2$. (2) $V = 2^3 = 8\text{ mm}^3$. (3) $\text{SA}:V = 24/8 = 3.0\text{ mm}^{-1}$ (check: $6/2 = 3.0$). **Answer:** 3.0 mm⁻¹.
- **Worked Example 2:** Compare cubes of 1 mm and 6 mm. (1) $6/1 = 6.0\text{ mm}^{-1}$. (2) $6/6 = 1.0\text{ mm}^{-1}$. (3) $6.0/1.0 = 6$: the small cube has six times as much surface for each mm³. **Answer:** the 1 mm cube's SA:V is 6 times larger.
- **Worked Example 3:** Model an *Amoeba* as a 0.1 mm cube and a small frog's body as a 30 mm cube. (1) Amoeba: $6/0.1 = 60\text{ mm}^{-1}$. (2) Frog: $6/30 = 0.2\text{ mm}^{-1}$. (3) $60/0.2 = 300$. **Answer:** the *Amoeba*'s SA:V is 300 times larger, so diffusion alone serves it; the frog needs blood and a heart.
- **Bridge:** explain why Dr Amaka's patient needs blood to deliver water at all (low SA:V; billions of cells far from the surface). Big Idea: *large many-celled organisms divide labour among specialised cells and must move materials around.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 03.

#### 5. Reflect & Assignment
- **I can (1–4):** name seven specimens with their form · tell a colony from a tissue · describe three kinds of cell nutrition · order the six levels · calculate and use SA:V.
- **Exit ticket (2 marks):** SA:V of a 5 mm cube, and one reason a large animal needs a transport system. (1.2 mm⁻¹; small SA:V / long distances from the surface)
- **Recall:** seven specimens and nutrition · colony vs tissue · six levels · 3 gains, 4 costs · 6/L.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 03.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences L1 (prediction), L4 (tables and graphs), L7 (pond life and clean water).

---

### LESSON 04: The Cell and Its Environment: Diffusion, Osmosis and Active Transport
- **Folder:** `html/lessons/lesson-04/` · **Duration:** 80 min · **Competences:** L1, L3, L4
- **Guiding question:** Why does salty water wilt ugu, and why must a drip be 0.9% saline, not water?
- **Objectives:**
  1. **01** · Define diffusion, osmosis and active transport, and give an example of each in living cells.
  2. **02** · Predict what happens to plant cells and red blood cells in hypotonic, isotonic and hypertonic solutions (turgid, flaccid, plasmolysed; haemolysis, normal, crenation).
  3. **03** · Carry out the potato-strip practical, calculate % change in mass, and plot it against concentration.
  4. **04** · Find the isotonic concentration from the graph.
  5. **05** · Explain the wilting ugu and the 0.9% saline drip.

#### 0. Do Now (`from: 2, 3`)
1. What does "selectively permeable" mean? · 2. Name the membrane around the plant sap vacuole. (tonoplast) · 3. Why can *Amoeba* rely on diffusion? (large SA:V) · 4. Which structure lets a plant cell resist bursting? (cellulose cell wall)

#### 1. Wonder
- **Story:** (1) *Market*: Mama Ngozi's nephew washes ugu in a bowl of salty water "against flies"; an hour later the leaves are limp. (2) Coach Danjuma: "Salt soaked into the leaves and made them heavy." (3) *Lab*: Dr Amaka sets up a drip and reaches for the 0.9% saline, not the plain water. (4) Chinedu: "But the patient is thirsty, why not just water?" (5) Dr Amaka: "Water always moves. Today you'll measure which way, with a potato." Invitation to the bench.
- **Wonder Wall prompt:** *If you put potato strips in pure water and in very salty water, what will happen to their mass?* Seeds: "Both get heavier, they soak it up (Uche)" · "The salty one shrinks? (Amina)" · "Nothing, potatoes are solid (Coach Danjuma)" · "It depends how salty (Tunde)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Which kind of movement?* Bins: `diffusion` · `osmosis` · `active`. Items (9): oxygen entering a cheek cell → diffusion · perfume spreading across a room → diffusion · carbon dioxide leaving a leaf cell → diffusion · water entering a root hair from soil → osmosis · water leaving ugu cells in salty water → osmosis · a red cell bursting in distilled water → osmosis · root hairs taking in mineral ions from dilute soil water → active · cells taking up glucose against its gradient using ATP → active · a seaweed taking in iodide ions from seawater where they are scarcer than inside its cells → active.
- **2B 3D Practical (`bench`):** potato-strip osmometer. Six boiling tubes of sucrose solution 0.0, 0.2, 0.4, 0.6, 0.8, 1.0 mol dm⁻³. **Method cards:** (1) Cut six equal strips with a cork borer, blot, weigh each (initial mass, g, 2 d.p.). (2) Place one strip in each tube for 30 minutes. (3) Remove, blot gently, re-weigh (final mass). (4) Calculate % change in mass and plot it against concentration. **Parts:** `borer`, `strip`, `tube`, `balance`, `tile`, `blotter`. **Controls:** pick tube · *Weigh* · *Leave 30 min* · *Re-weigh*. Emits `l4:bench`, `l4:bench-done` after 6 tubes.
  - **Results table:** Concentration (mol dm⁻³) · Initial mass (g) · Final mass (g) · Change (g) · % change.
  - **Expected:** 0.0 · 2.50 · 2.85 · +0.35 · +14.0 / 0.2 · 2.48 · 2.60 · +0.12 · +4.8 / 0.4 · 2.52 · 2.47 · −0.05 · −2.0 / 0.6 · 2.50 · 2.30 · −0.20 · −8.0 / 0.8 · 2.46 · 2.16 · −0.30 · −12.2 / 1.0 · 2.54 · 2.12 · −0.42 · −16.5.
  - **Graph (`graph.js`):** % change (y) against concentration (x). Draw a **smooth curve** of best fit through the points (the data are curved; do not use a straight regression line). It crosses 0% at about 0.34 mol dm⁻³, between the 0.2 and 0.4 readings: the isotonic point.
  - **Precautions (past tense):** strips were cut to equal size with the same borer · strips were blotted the same way before each weighing · all strips were left for the same time at the same temperature · the balance was zeroed before each weighing.
  - **Sources of error (with direction):** surface water left on a poorly blotted strip made the final mass **too high**, so a % gain was too large and a % loss too small · blotting too hard squeezed sap from cut cells, so the final mass was **too low** · strips left on the tile before weighing lost water by evaporation, so the mass was **too low** · evaporation from open tubes over 30 min made each solution slightly more concentrated, so losses were recorded **too large** and gains **too small**.
  - **Analysis (5, locked):** Why % change and not change in mass? (strips start at different masses) · Why blot? · Which way did water move at 0.0 mol dm⁻³, and why? · What is the isotonic point and what happens there? · Why did no strip burst?

#### 3. Make Sense
- **Definitions (`.callout`):** *diffusion*: the overall spreading of particles from where they are crowded to where they are fewer, until they are evenly spread · *osmosis*: the passage of **water** molecules across a selectively permeable membrane, from the side where water is more plentiful (dilute solution) to the side where it is less plentiful (concentrated solution) · *active transport*: the pumping of molecules or ions by a cell from where they are scarce to where they are already plentiful, which costs energy (ATP) from respiration.
- **Solutions table (`#props-table`):** hypotonic (more dilute than cell sap): plant cell turgid (wall stops bursting) | red cell swells and bursts (haemolysis) · isotonic (same): plant cell flaccid/normal | red cell normal · hypertonic (more concentrated): plant cell plasmolysed (membrane pulls away from wall) | red cell shrinks and wrinkles (crenation).
- **Equation (`.eq`):** $\%\ \text{change} = \dfrac{\text{final} - \text{initial}}{\text{initial}} \times 100$.
- **Explorer:** tap concentration pins (0.0–1.0) to see the potato strip cell and a red cell change in real time.
- **3D Zoom (`zoom`, `cell-bio` kit osmosis mode):** a plant cell and a red cell in each solution: water molecules crossing the membrane, the vacuole swelling or shrinking, the red cell bursting or crenating.

#### 4. Apply
- **Worked Example 1:** The strip in 0.0 mol dm⁻³ went from 2.50 g to 2.85 g. (1) Change $= 2.85 - 2.50 = +0.35\text{ g}$. (2) $\% = \dfrac{0.35}{2.50} \times 100$. (3) $= +14.0\%$. **Answer:** +14.0% (water entered by osmosis).
- **Worked Example 2:** The strip in 0.8 mol dm⁻³ went from 2.46 g to 2.16 g. (1) Change $= 2.16 - 2.46 = -0.30\text{ g}$. (2) $\% = \dfrac{-0.30}{2.46} \times 100$. (3) $= -12.2\%$. **Answer:** −12.2% (water left by osmosis; cells plasmolysed).
- **Worked Example 3 (isotonic point):** % change is +4.8 at 0.2 and −2.0 at 0.4 mol dm⁻³. (1) The line crosses zero between them. (2) Fraction of the way: $\dfrac{4.8}{4.8 + 2.0} = 0.71$. (3) Concentration $= 0.2 + 0.71 \times 0.2 = 0.34\text{ mol dm}^{-3}$. **Answer:** about 0.34 mol dm⁻³, where water enters and leaves equally. (A straight line between the two points gives an estimate; reading the smooth curve gives about 0.33–0.34.)
- **Bridge (the mystery, solved):** salty water is hypertonic to ugu cell sap, so water left by osmosis, the cells plasmolysed and the leaf wilted (salt did not "soak in"). Plain water dripped into a vein is hypotonic to red cells: water rushes in and they burst (haemolysis). 0.9% saline (0.9 g of salt per 100 cm³, so 4.5 g in a 500 cm³ bag) is isotonic with blood, so cells keep their shape. Big Idea: *water moves by osmosis from dilute to concentrated; walls protect plant cells from bursting, but nothing protects a red cell.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 04.

#### 5. Reflect & Assignment
- **I can (1–4):** define the three processes · predict plant and red cell behaviour in three solutions · calculate % change in mass · find the isotonic point · explain the ugu and the drip.
- **Exit ticket (2 marks):** A strip goes from 3.00 g to 2.70 g. Find % change and say which solution it was in. (−10.0%; hypertonic)
- **Recall:** three definitions · six terms (turgid, flaccid, plasmolysed, haemolysis, crenation, isotonic) · % change formula · isotonic point · the mystery's answer.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 04.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences L1 (prediction), L3 (safe drips), L4 (tables and graphs).

---

### LESSON 05: WAEC Paper 3 Clinic: Slides, Biological Drawing and Magnification
- **Folder:** `html/lessons/lesson-05/` · **Duration:** 80 min · **Competences:** L3, L4, L6
- **Guiding question:** Can we prove what we claimed, the way an examiner will mark it?
- **Objectives:**
  1. **01** · Describe how to prepare an iodine-stained onion epidermis slide and a methylene-blue cheek cell slide.
  2. **02** · Apply the nine WAEC drawing rules to a biological drawing.
  3. **03** · State **observable** differences between onion and cheek cells.
  4. **04** · Calculate drawing magnification and actual size from a drawing.
  5. **05** · Explain why onion bulb cells have no chloroplasts and why mitochondria are not labelled on specimen drawings.

#### 0. Do Now (`from: 1, 2, 3, 4`)
1. Actual size of a 36 mm image at ×400? (0.09 mm = 90 µm) · 2. Name two structures only in plant cells. · 3. What is plasmolysis? · 4. Why is *Volvox* not a tissue?

#### 1. Wonder
- **Story:** (1) *Lab*: exam week. Chinedu has drawn onion and cheek cells and is proud of them. (2) Coach Danjuma, reading a textbook: "Label the mitochondria and the chloroplasts, examiners love those!" (3) Dr Amaka marks the drawing: 4 out of 10. (4) Chinedu: "But everything I drew is true!" Dr Amaka: "True in the textbook, not on your slide." (5) Invitation to the slide-preparation bench and the drawing audit.
- **Wonder Wall prompt:** *Why might a "correct" drawing lose marks?* Seeds: "No title? (Ngozi)" · "Too small (Femi)" · "Labels everywhere (Chiamaka)" · "More labels = more marks (Coach Danjuma)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Will the examiner reward it?* Bins: `reward` · `penalise`. Items (10): title under the drawing → reward · magnification stated → reward · ruled horizontal guidelines that touch the part → reward · labels in the singular, in a column → reward · drawing 6–8 cm as instructed → reward · shading to show depth → penalise · guidelines crossing each other → penalise · arrowheads on guidelines → penalise · "mitochondria" labelled on an onion slide drawing → penalise · textbook differences instead of what is on the slide → penalise.
- **2B 3D Practical (`bench`, `cell-bio` kit, slide mode):** prepare an onion epidermis slide (peel the thin inner epidermis, lay flat in a drop of iodine, lower the cover slip at about 45° to avoid air bubbles, view on low then high power) and a cheek cell slide (gentle scrape with a clean spatula, smear, methylene blue, cover slip). **Parts:** `peel`, `iodine`, `coverslip`, `spatula`, `methylene`, `slide`, `stage`. Wrong steps show the consequence (bubbles; folded peel; no stain → nucleus invisible). Emits `l5:bench`, `l5:bench-done`.
  - **Drawing audit:** two of Chinedu's drawings scored live against the 9 rules (title, magnification, size, sharp lines without shading, ruled horizontal non-crossing guidelines that touch, singular labels in a column, correct spelling and capital letters for generic names, double lines for cut surfaces, draw what you see).
  - **Results table:** Feature · Onion (A) · Cheek (B): shape (regular, box-like | irregular) · cell wall (present | absent) · nucleus position (at the side | central) · vacuole (large, visible | not visible) · stain (iodine, yellow-brown | methylene blue).
  - **Precautions (past tense):** the cover slip was lowered gently from one edge to keep air bubbles out · the specimen was viewed on low power before high power · the used spatula was placed in disinfectant and the slides were handled by their edges.
  - **Analysis (5, locked):** Why was a thin inner peel used rather than a slice of onion? · What would you see if the onion peel were mounted in strong salt solution instead of iodine? (plasmolysis: the membrane pulls away from the wall) · Why does methylene blue suit cheek cells better than plain water? · Why is the cell membrane not labelled on an onion cell? (pressed against the wall; only seen if plasmolysed) · How would you tell an air bubble from a cell on your slide?

#### 3. Make Sense
- **The nine drawing rules (`.callout.big`)** as listed in the audit.
- **Observable differences (`.tbl`):** the results table above, contrasted with textbook-only differences (mitochondria, ER, Golgi: not visible on a school slide).
- **Magnification (`.eq`):** drawing $M = \dfrac{\text{drawing length}}{\text{actual length}}$ · actual $= \dfrac{\text{drawing length}}{M}$ · state M under the drawing, with no unit.
- **Explorer (`#pos-explorer`):** magnification pins ×4 to ×7 for a 1.2 cm specimen, showing whether the drawing fits a 6–8 cm instruction.
- **3D Zoom (`zoom`):** the onion slide at ×100 and ×400 compared with a textbook diagram; items that are not visible fade out.

#### 4. Apply
- **Worked Example 1:** A *Spirogyra* filament segment 0.40 mm long is drawn 8.0 cm long. (1) Convert to the same unit: $8.0\text{ cm} = 80\text{ mm}$. (2) $M = 80 / 0.40$. (3) $= \times 200$. **Answer:** ×200.
- **Worked Example 2:** A specimen 2.5 cm long must be drawn between 6 and 8 cm. Chinedu draws it 7.5 cm long. (1) $M = 7.5 / 2.5$. (2) $= \times 3.0$. (3) Check the size rule: 7.5 cm lies between 6 and 8 cm. **Answer:** ×3.0, size rule met.
- **Worked Example 3:** A drawing labelled ×1500 shows a cell 60 mm long. (1) Actual $= 60 / 1500$. (2) $= 0.04\text{ mm}$. (3) $= 40\ \mu\text{m}$. **Answer:** 40 µm.
- **Bridge:** re-mark Chinedu's drawings with the rules, fix them, and use a plasmolysed onion cell (salty water from Lesson 04) to finally show the membrane pulled away from the wall, closing the unit's mystery under the microscope. Big Idea: *draw what you see, label what you can see, and prove your claims with evidence.*
- **Quiz:** 12 questions, `03-questions.md` § Lesson 05.

#### 5. Reflect & Assignment
- **I can (1–4):** prepare both slides · apply the nine drawing rules · state three observable differences · calculate drawing magnification and actual size · explain what can and cannot be labelled.
- **Exit ticket (2 marks):** A 0.5 mm specimen drawn 50 mm long: find M. (×100)
- **Recall:** slide steps for both specimens · nine rules · observable differences · M = drawing ÷ actual.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 05.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences L3 (stain and glass safety), L4 (drawing conventions), L6 (laboratory careers).

---

## 6. Narrator Choreography Blueprint (`window.NARRATION`)
- **Welcome Hub:** 11 steps: hero title → 3D Hero Lab (`cells`, `microscope`, `osmosis` modes) → mystery case file → journey cards → explorer tabs → archetypes → myths → method → finale.
- **Each lesson (26–28 steps):** hero → Do Now (wait `donow`) → story playback (`story:0`–`story:4`) → Wonder Wall (wait `note`) → sort (wait `sort`) → bench (`bench.setMode`, wait `lX:bench-done`) → results and graph → concepts and `.eq` → explorer → zoom (`zoom.setMode`) → worked examples → explainer video (Lesson 01, 03, 04) → Bridge (wait `bridge`) → quiz (wait `quiz`) → reflect → assignment. Nigerian English (`en-NG`) voice first.

---

## 7. Explainer Video Plan
video_cap: 3

| lesson | score | recommend | reasons | video would cover |
|---|---|---|---|---|
| lesson-01 | 7 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception | how a microscope magnifies (eyepiece × objective, never +), finding cell size in µm from a field of view and an image, Hooke's dead cork vs living cells · kits: graph; KIT GAP: microscope (on the fly) |
| lesson-02 | 5 | yes | +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 staged process · −2 recall or revision | meets the bar; dropped by the cap (lowest score, tied with 05). If the cap is raised: inside the cell, membrane counts, the protein route ribosome → ER → Golgi |
| lesson-03 | 8 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 staged process | SA:V = 6/L with the 2 mm, 1 vs 6 mm and Amoeba vs frog examples, colony vs tissue, the level ladder · kits: graph (6/L curve); KIT GAP: organisms/levels (on the fly) |
| lesson-04 | 10 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 graph reading | osmosis at the membrane, plant cell vs red cell in three solutions, % change in mass, the isotonic point on the graph, the ugu and 0.9% saline answer · kits: graph; KIT GAP: osmosis cells (on the fly) |
| lesson-05 | 5 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 staged process · −3 practical-led | meets the bar; dropped by the cap. The slide bench and live drawing audit already teach this hands-on |
