---
slug: ss1-bio-plant-animal-cell-structure
title: Plant and Animal Cell Structure, Organisation & Microscopy
subject: Biology
class: SS1
exams: [WAEC, NECO, JAMB]
lessons_count: 5
duration_per_lesson_min: 80
version: 2
---

# 02 — Master Multi-Lesson Unit Plan: *Plant and Animal Cell Structure*

All explanations, Nigerian stories, worked examples, data tables, and problem scenarios in this blueprint are **100% originally authored and paraphrased**. Every calculation chain in worked examples, concept formulas, and quiz explanations is structured for **`StudyMath` (`math-kit.js`)** so each equation step renders in offline LaTeX with a plain-English explainer note directly underneath.

---

## Part I · Unit Welcome Hub (`html/index.html`) & Spaced Retrieval Bank (`retrieval-bank.js`)

### 1. Hero Section & Live 3D Hero Lab (`#lab-canvas` / `window.StudyLab`)
- **Eyebrow:** `SS1 Biology · 5-Lesson Inquiry Unit · WAEC · NECO · JAMB`
- **Display Title:** *Plant & Animal Cell Structure, Organisation & Microscopy*
- **Lede:** Step from **Mama Nkechi's *Ugu* Stall at Mile 12 Market** to **LUTH Cytology Lab in Idi-Araba, Lagos**. Slice open studio-lit 3D Plant and Animal Cells, trace how **Hooke, Dujardin, Schleiden, Schwann, and Virchow** built the Cell Theory, test **osmotic turgor vs haemolysis**, and master **WAEC Paper 3 wet-mount microscopy, biological drawing rules, and magnification calculations**.
- **Hero CTAs:**
  - `[data-tour]` **"Start guided tour"** (Nigerian English `en-NG` narrator walkthrough)
  - **"Begin Lesson 1 →"** (`lessons/lesson-01/index.html`)
- **3D Hero Lab (`window.StudyLab`):**
  - **Visuals:** Studio-lit 3D dual cellular stage showing:
    1. A cut-away **3D Plant Palisade Cell** (green rigid hexagonal cellulose cell wall, translucent plasma membrane, large central sap vacuole bounded by a shimmering tonoplast, peripheral nucleus with nucleolus, green chloroplasts with stacked grana, red mitochondria with cristae, rough ER, and Golgi apparatus).
    2. A cut-away **3D Animal Cell** (flexible irregular lipoprotein plasma membrane, central nucleus with nucleolus, pair of perpendicular centrioles, abundant mitochondria, rough/smooth ER, Golgi apparatus, lysosomes, and small temporary vacuoles).
    3. Animated ATP energy particles and water molecules crossing the membranes during the live Tonicity & Microscope test.
  - **Interactive Controls:**
    - Mode buttons: `1. Twin Cells (Plant vs Animal)`, `2. Pure Water Osmosis (Turgid vs Burst)`, `3. Microscope ×400 (Onion vs Cheek)`
    - Tonicity / Zoom slider: `0.0 M (Distilled Water)` to `1.0 M (Concentrated Salt)`
  - **Live Readouts:**
    - `#hud-plant`: `Turgid (Wall resists bursting)` / `Plasmolysed (Protoplasm shrinks)`
    - `#hud-animal`: `Haemolysed (No wall — bursts!)` / `Crenated (Wrinkled)`
    - `#hud-mag`: `×400 (×10 Eyepiece × ×40 Objective)`

### 2. Scrolling Key-Terms Marquee
1. `Cell Theory: Hooke (1665) · Dujardin (1835) · Schleiden (1838) · Schwann (1839) · Virchow (1855)`
2. `Magnification: M = Image Size (I) ÷ Actual Size (A)`
3. `Total Microscope Magnification: M_total = M_eyepiece × M_objective`
4. `Double-Membrane Organelles: Nucleus · Mitochondrion (Cristae) · Chloroplast (Grana)`
5. `Non-Membranous Organelles: Ribosome (Protein Synthesis) · Centrioles (Spindle Fibres)`
6. `Plant Only: Cellulose Cell Wall · Chloroplasts (Plastids) · Large Central Sap Vacuole (Tonoplast)`
7. `Animal Signature: Centrioles (Centrosome) · Glycogen Granules · Irregular Shape`
8. `Hierarchy: Organelle → Cell → Tissue (Hydra) → Organ (Onion Bulb) → System → Organism`
9. `Surface-Area-to-Volume Ratio: SA/V = 6 ÷ L (Why Amoeba Needs No Lungs)`
10. `Hypotonic Water: Plant Cell → Turgid · Red Blood Cell → Haemolysis (Bursts)`
11. `Hypertonic Salt: Plant Cell → Plasmolysis · Red Blood Cell → Crenation`
12. `WAEC Paper 3: Onion Bulb Epidermis Has Zero Chloroplasts (Grows Underground)`

### 3. Section 01 (`#mystery`) — The Unit Mystery Case File & Exam Weight
- **Case File Card:** *Why Did Pure Water Revive Mama Nkechi's Fluted Pumpkin Leaves, Yet Shatter Every Red Blood Cell at LUTH Lab?*
  - **Clue 01:** Sprinkling pure borehole water ($\approx 0.0\text{ M}$ solute) onto limp *ugu* leaves at Mile 12 Market makes every leaf cell swell until its protoplasm presses tightly against the rigid **cellulose cell wall**, restoring crisp **turgidity** without bursting.
  - **Clue 02:** Adding that exact same pure water to a human blood smear at LUTH Idi-Araba causes water to rush in by **osmosis** until the flexible **lipoprotein plasma membrane** stretches past its limit and ruptures (**haemolysis**), because animal cells have **no cell wall**.
  - **Clue 03:** When a student views an iodine-stained **onion bulb epidermis** under a $\times 100$ microscope in WAEC Paper 3 and labels "chloroplasts" and "mitochondria", the examiner deducts marks — because underground onion bulbs lack chloroplasts and mitochondria are too small for a school light microscope!
- **Exam Stats:**
  - `25–35%` of WAEC/NECO Paper 1, Paper 2 & Paper 3 + JAMB Biology marks link to Cell Structure, Organelles, Osmosis & Microscopy
  - `3 Exams`: WAEC WASSCE · NECO SSCE · JAMB UTME
  - `4 Core Equations`: $M = \frac{I}{A}$, $M_{\text{total}} = M_e \times M_o$, $\frac{SA}{V} = \frac{6}{L}$, and $\%\Delta m = \frac{m_f - m_i}{m_i} \times 100\%$

### 4. Section 02 (`#journey`) — The 5-Lesson Inquiry Roadmap
1. **Lesson 01:** *Discovery of the Cell, Cell Theory & Prokaryotes vs Eukaryotes* (`80 min · 3D History & Microscope Stage`)
2. **Lesson 02:** *Inside the Eukaryotic Cell — Organelles & Plant vs Animal Cells* (`80 min · 3D Cell Dissector & Ultrastructure Zoom`)
3. **Lesson 03:** *Forms of Living Cells & Levels of Biological Organisation* (`80 min · 3D Pond Protists & SA/V Scaling Lab`)
4. **Lesson 04:** *The Cell & Its Environment — Diffusion, Osmosis, Turgor & Haemolysis* (`80 min · 3D Osmosis Chamber & Live Osmometry Graph`)
5. **Lesson 05:** *WAEC Paper 3 Practical — Wet-Mount Microscopy & Biological Drawing Clinic* (`80 min · 3D Slide Prep & Examiner Drawing Inspector`)

### 5. Section 03 (`#explorer`) — Interactive Cytology & Osmosis Explorer
- **4 Switchable Tabs:**
  1. `Plant vs Animal Cell` (Cellulose wall + chloroplast + central vacuole vs centrioles + glycogen + flexible membrane)
  2. `Hypotonic Solution (Pure Water)` (Plant cell becomes turgid at $\Psi_w = 0$; Red blood cell swells and bursts — haemolysis)
  3. `Hypertonic Solution (Strong Salt)` (Plant cell protoplasm pulls away from wall — plasmolysis; Red blood cell wrinkles — crenation)
  4. `SA/V Ratio & Complexity` (As cell side length $L$ grows from $0.1\text{ mm}$ to $10\text{ mm}$, $\frac{SA}{V} = \frac{6}{L}$ drops $100\times$, requiring organs & transport systems)

### 6. Section 04 (`#master`) — 6 Calculation Archetypes & 3 Myth-Busters
- **Archetype 1 (Drawing Magnification):** Specimen actual length $A = 1.5\text{ cm}$, biological drawing length $I = 9.0\text{ cm}$:
  $$M = \frac{I}{A} = \frac{9.0}{1.5} = \times 6$$
- **Archetype 2 (Actual Cell Size in $\mu\text{m}$):** Onion cell image length $I = 24\text{ mm} = 24\,000\text{ }\mu\text{m}$ at magnification $M = \times 400$:
  $$A = \frac{I}{M} = \frac{24\,000}{400} = 60\text{ }\mu\text{m}$$
- **Archetype 3 (Compound Microscope Magnification):** Eyepiece lens $M_e = \times 10$ and high-power objective lens $M_o = \times 40$:
  $$M_{\text{total}} = M_e \times M_o = 10 \times 40 = \times 400$$
- **Archetype 4 (Surface-Area-to-Volume Ratio):** Comparing a unicellular cube of side $L = 0.2\text{ mm}$ ($SA = 6L^2 = 0.24\text{ mm}^2$, $V = L^3 = 0.008\text{ mm}^3$):
  $$\frac{SA}{V} = \frac{6}{L} = \frac{6}{0.2} = 30\text{ mm}^{-1}$$
- **Archetype 5 (Percentage Mass Change in Osmometry):** Yam cylinder initial mass $m_i = 4.00\text{ g}$, final mass in distilled water $m_f = 4.60\text{ g}$:
  $$\%\Delta m = \frac{m_f - m_i}{m_i} \times 100 = \frac{4.60 - 4.00}{4.00} \times 100 = \frac{0.60}{4.00} \times 100 = +15.0\%$$
- **Archetype 6 (Plant Cell Water Potential):** Cell sap solute potential $\Psi_s = -650\text{ kPa}$ and turgor wall pressure $\Psi_p = +450\text{ kPa}$:
  $$\Psi_w = \Psi_s + \Psi_p = -650 + 450 = -200\text{ kPa}$$

---

## Part II · Detailed 5-Phase Lesson Specifications (`Lesson 01` – `Lesson 05`)

---

### LESSON 01 · Discovery of the Cell, Cell Theory & Prokaryotes vs Eukaryotes (`html/lessons/lesson-01/`)

#### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 prerequisite flashcards (`from: 0` in `retrieval-bank.js`):
  1. **Characteristics of Life (`MR NIGER D`):** Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction, Death/Competition.
  2. **Metric Length Conversion for Microscopy:** $1\text{ cm} = 10\text{ mm}$ and $1\text{ mm} = 1000\text{ }\mu\text{m}$, so $1\text{ cm} = 10 \times 1000 = 10\,000\text{ }\mu\text{m}$.
  3. **Simple Ratio / Magnification:** If a $2\text{ cm}$ beetle is drawn $10\text{ cm}$ long, magnification $M = \frac{I}{A} = \frac{10}{2} = \times 5$.
  4. **Hand Lens vs Compound Microscope:** A simple hand lens uses one convex lens ($\times 5\text{–}\times 10$), whereas a compound microscope combines an eyepiece lens and an objective lens ($M_{\text{total}} = M_e \times M_o$).

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story Scene (`story.js` — *History Shown as Scenes: From Mile 12 & 1665 Cork to Modern Cytology*):**
  - **Beat 1 (Mile 12 Market Stall):** Mama Nkechi shows Zainab and Kelechi two baskets — crisp watered *ugu* leaves and a mouldy slice of cork stopper on an old palm-wine gourd. *"Can you believe scientists once thought tiny living things just popped out of mud by magic?"*
  - **Beat 2 (Scene 1 — Robert Hooke, 1665 & Antonie van Leeuwenhoek, 1674):** At the LUTH History of Science display, Dr Halima illuminates a 3D model of **Robert Hooke's 1665 compound microscope** viewing dead oak **cork** chambers (*cellulae*), alongside **Leeuwenhoek's single-lens microscope** revealing swimming pond-water *"animalcules"* (bacteria and protozoa).
  - **Beat 3 (Scene 2 — Félix Dujardin, 1835):** Kelechi inspects the glowing translucent jelly inside a living cell model. *"Hooke only saw empty dead walls! In 1835, **Félix Dujardin** discovered the living active jelly inside cells — first calling it **sarcode**, later named **protoplasm**!"*
  - **Beat 4 (Scene 3 — Matthias Schleiden, 1838 & Theodor Schwann, 1839):** Botanist **Matthias Schleiden (1838)** proves all plant tissues are built of cells; a year later, zoologist **Theodor Schwann (1839)** proves all animal tissues are also built of cells, uniting botany and zoology!
  - **Beat 5 (Scene 4 — Rudolf Virchow, 1855 & The Microscope Challenge):** Physician **Rudolf Virchow (1855)** adds the final pillar: *Omnis cellula e cellula* — every cell arises from a pre-existing cell by division! Dr Halima challenges Zainab and Kelechi to compare a bacterial cell with an onion cell and measure exact magnification on the 3D Microscope Bench.
- **Wonder Wall (`#wonder`):**
  - Prompt: *When Robert Hooke looked at cork in 1665, was he looking at complete living cells — and how does a bacterial cell differ from the cells in your own cheek?*

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Sort Game (`#sort`):** Sort 9 items into **`Cell Theory Pioneers`**, **`Prokaryotic Features (Bacteria)`**, and **`Eukaryotic Features (Plants & Animals)`**:
  1. `Robert Hooke (1665) — Named box-like dead cork spaces "cells"` $\rightarrow$ `Cell Theory Pioneers`
  2. `Félix Dujardin (1835) — Discovered living protoplasm ("sarcode")` $\rightarrow$ `Cell Theory Pioneers`
  3. `Schleiden (1838) & Schwann (1839) — Stated plants and animals are made of cells` $\rightarrow$ `Cell Theory Pioneers`
  4. `Naked circular DNA lying free in the cytoplasm (nucleoid)` $\rightarrow$ `Prokaryotic Features (Bacteria)`
  5. `Smaller 70S ribosomes and no membrane-bound organelles` $\rightarrow$ `Prokaryotic Features (Bacteria)`
  6. `Peptidoglycan (murein) non-cellulose cell wall` $\rightarrow$ `Prokaryotic Features (Bacteria)`
  7. `True nucleus bounded by a double nuclear membrane with pores` $\rightarrow$ `Eukaryotic Features (Plants & Animals)`
  8. `Linear DNA chromosomes bound to histone proteins` $\rightarrow$ `Eukaryotic Features (Plants & Animals)`
  9. `Membrane-bound mitochondria, ER, and Golgi apparatus present` $\rightarrow$ `Eukaryotic Features (Plants & Animals)`
- **3D Virtual Lab Bench (`bench.js` — *3D Historical & Compound Microscope Magnification Bench*):**
  - Switch between 4 historical/modern specimens (`1. Hooke's Cork (×30)`, `2. Pond Bacterium (×1000)`, `3. Onion Epidermis (×100)`, `4. Human Cheek Cell (×400)`) and adjust Eyepiece ($\times 5, \times 10, \times 15$) and Objective ($\times 4, \times 10, \times 40, \times 100$) lenses.
  - Live SVG Graph (`StudyGraph`): Plots **Image Size $I\text{ (mm)}$ vs Magnification $M$** for a cell of actual size $A = 0.06\text{ mm}$ ($60\text{ }\mu\text{m}$), demonstrating a straight line through the origin with slope $\frac{\Delta I}{\Delta M} = A$.
  - Interactive Results Table (`#results-table`): Record $M_e$, $M_o$, $M_{\text{total}} = M_e \times M_o$, actual size $A\text{ (}\mu\text{m)}$, and image size $I\text{ (mm)}$.

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Formal Concepts & Equations:**
  - **Timeline of Cell Discovery & The 3 Tenets of Cell Theory:**
    1. **Robert Hooke (1665):** Examined thin slices of dead oak cork under a crude compound microscope and coined the term **"cell"** for the honey-comb chambers (actually only empty cellulose cell walls).
    2. **Antonie van Leeuwenhoek (1674):** Built high-clarity single-lens microscopes and observed the first **living free-swimming cells** (bacteria, protozoa, spermatozoa, red blood cells).
    3. **Félix Dujardin (1835):** Discovered that living cells are not hollow boxes but contain a viscous, active living substance he called **"sarcode"** (later termed **protoplasm** by Purkinje and von Mohl).
    4. **Matthias Schleiden (1838, German botanist):** Concluded that all plant tissues are composed of cells and that an embryonic plant arises from a single cell.
    5. **Theodor Schwann (1839, German zoologist):** Extended Schleiden's finding to animals, stating that all animal tissues consist of cells and formulating the unified **Cell Theory**.
    6. **Rudolf Virchow (1855, German pathologist):** Established that all cells arise only from the division of **pre-existing living cells** (*Omnis cellula e cellula*), refuting spontaneous generation.
  - **The Three Statements of Modern Cell Theory:**
    1. All living organisms are composed of one or more cells and their products.
    2. The cell is the smallest basic structural and functional unit of life.
    3. All new cells arise from pre-existing living cells by cell division.
    - *Notable Exceptions / Borderline Cases:* **Viruses** (acellular nucleoprotein particles containing DNA or RNA inside a protein capsid; inert crystals outside a host cell), **coenocytic fungal hyphae** (*Rhizopus*, multinucleate without cross-walls), and **striated skeletal muscle fibres** (multinucleate syncytia).
  - **Prokaryotic vs Eukaryotic Cells Table (`.tbl`):** 6-row comparison (Nuclear membrane, DNA structure, Organelles with membranes, Ribosome size, Cell wall composition, Examples: bacteria & cyanobacteria vs protists, fungi, plants, animals).
  - **Microscopy & Magnification Equations (`.eq`):**
    $$M_{\text{total}} = M_{\text{eyepiece}} \times M_{\text{objective}}$$
    $$M = \frac{I}{A} \implies A = \frac{I}{M} \quad \text{and} \quad I = M \times A$$
    where $I$ is the image/drawing size and $A$ is the actual specimen size **in the exact same unit** ($1\text{ cm} = 10\text{ mm} = 10\,000\text{ }\mu\text{m}$).
- **3D Concept Zoom (`zoom.js` — *3D Prokaryotic Bacterium vs Eukaryotic Cell Cut-Away*):**
  - Interactive 3D comparison highlighting the bacterial **nucleoid (circular naked DNA)**, **plasmid**, **70S ribosomes**, **peptidoglycan cell wall**, **slime capsule**, and **flagellum** vs the eukaryotic **double-membrane nucleus**, **mitochondria**, **rough ER**, and **80S ribosomes**.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **Worked Example 1 (Drawing Magnification with Unit Conversion):**
  - *Problem:* A student draws an onion epidermal cell $7.5\text{ cm}$ long in her practical workbook. If the actual length of the onion cell under the microscope is $150\text{ }\mu\text{m}$, calculate the magnification of her drawing.
  - *Step 1 (Convert drawing length $I$ from $\text{cm}$ to $\mu\text{m}$):*
    $$I = 7.5 \times 10\,000 = 75\,000\text{ }\mu\text{m}$$
  - *Step 2 (Calculate drawing magnification $M$):*
    $$M = \frac{I}{A} = \frac{75\,000}{150} = \times 500$$
- **Worked Example 2 (Compound Microscope Total Magnification & Actual Size):**
  - *Problem:* A microscope is fitted with a $\times 10$ eyepiece and a $\times 40$ objective lens. Under this setting, the apparent diameter of a *Chlamydomonas* cell image is $16\text{ mm}$. Calculate: (a) the total magnification of the microscope, and (b) the actual diameter of the cell in micrometres ($\mu\text{m}$).
  - *Step 1 (Total microscope magnification $M_{\text{total}}$):*
    $$M_{\text{total}} = M_e \times M_o = 10 \times 40 = \times 400$$
  - *Step 2 (Convert image size $I$ from $\text{mm}$ to $\mu\text{m}$):*
    $$I = 16 \times 1000 = 16\,000\text{ }\mu\text{m}$$
  - *Step 3 (Actual diameter $A$ of the cell):*
    $$A = \frac{I}{M_{\text{total}}} = \frac{16\,000}{400} = 40\text{ }\mu\text{m}$$
- **Worked Example 3 (Scale Bar & Image Size Calculation):**
  - *Problem:* A rod-shaped bacterium has an actual length of $2.5\text{ }\mu\text{m}$. What will be the length of its photomicrograph image in millimetres ($\text{mm}$) when photographed under an electron microscope at a magnification of $\times 12\,000$?
  - *Step 1 (Image length $I$ in micrometres):*
    $$I = M \times A = 12\,000 \times 2.5 = 30\,000\text{ }\mu\text{m}$$
  - *Step 2 (Convert image length from $\mu\text{m}$ to $\text{mm}$):*
    $$I_{\text{mm}} = \frac{I}{1000} = \frac{30\,000}{1000} = 30\text{ mm}$$
- **The Bridge (`#bridge`):** Identify three mystery microscopic samples at LUTH Lab (Sample X: dead cork wall with zero protoplasm; Sample Y: bacterium with circular naked DNA and 70S ribosomes; Sample Z: living eukaryotic cell with double-membrane nucleus and mitochondria).
- **12 Instant-Feedback Quiz Questions (`#quiz`):** Covering Hooke, Dujardin, Schleiden, Schwann, Virchow, viruses, prokaryotic vs eukaryotic cells, and $M = \frac{I}{A}$ calculations.

---

### LESSON 02 · Inside the Eukaryotic Cell — Organelles & Plant vs Animal Cells (`html/lessons/lesson-02/`)

#### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval cards from Lesson 01 (`from: 1` in `retrieval-bank.js`).

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story Scene (`story.js` — *The Cellular Factory Inside Ugu Leaf & Liver Cells*):**
  - **Beat 1:** At LUTH Cytology Lab, Zainab compares an electron micrograph of a green *ugu* leaf palisade cell with a human liver cell. *"Both cells are packed with tiny compartments — why does a single cell need so many separate rooms?"*
  - **Beat 2:** Dr Halima powers up the 3D Holographic Cell Dissector: *"Those compartments are **organelles**! Just like Lagos Island has power stations, solar panels, assembly lines, post offices, and recycling plants, a cell divides its biochemical work across specialised organelles."*
  - **Beat 3:** Kelechi points at the **mitochondria** and **chloroplasts**: *"Wait — the *ugu* plant cell has green chloroplasts AND red mitochondria! I thought chloroplasts replaced mitochondria in plants?"*
  - **Beat 4:** Dr Halima smiles: *"That's WAEC Trap #1! Chloroplasts trap sunlight to make glucose, but plant cells still need **mitochondria** 24 hours a day to break down glucose into **ATP** energy!"*
  - **Beat 5:** Mama Nkechi asks why her *ugu* leaf cells have thick rectangular walls and a giant central water sac while human cells are soft and rounded with a pair of tiny cylinders (**centrioles**) near the nucleus.
- **Wonder Wall (`#wonder`):**
  - Prompt: *Which organelles have a double membrane, which have a single membrane, and which have NO membrane at all — and why do both plant and animal cells need mitochondria?*

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Sort Game (`#sort`):** Sort 10 cellular structures into **`Plant Cells Only`**, **`Animal Cells (Absent in Flowering Plants)`**, and **`Present in Both Plant & Animal Cells`**:
  1. `Rigid cellulose cell wall (freely permeable)` $\rightarrow$ `Plant Cells Only`
  2. `Chloroplasts with chlorophyll-rich grana & stroma` $\rightarrow$ `Plant Cells Only`
  3. `Large permanent central sap vacuole bounded by a tonoplast` $\rightarrow$ `Plant Cells Only`
  4. `Centrosome containing a pair of cylindrical centrioles` $\rightarrow$ `Animal Cells (Absent in Flowering Plants)`
  5. `Carbohydrate stored as glycogen granules in cytoplasm` $\rightarrow$ `Animal Cells (Absent in Flowering Plants)`
  6. `Selectively permeable lipoprotein plasma membrane` $\rightarrow$ `Present in Both Plant & Animal Cells`
  7. `Mitochondria with folded inner cristae producing ATP` $\rightarrow$ `Present in Both Plant & Animal Cells`
  8. `Nucleus with double nuclear envelope, nucleolus, and DNA chromatin` $\rightarrow$ `Present in Both Plant & Animal Cells`
  9. `Non-membranous ribosomes synthesising proteins` $\rightarrow$ `Present in Both Plant & Animal Cells`
  10. `Endoplasmic reticulum (RER/SER) and Golgi bodies (cisternae)` $\rightarrow$ `Present in Both Plant & Animal Cells`
- **3D Virtual Lab Bench (`bench.js` — *3D Interactive Plant & Animal Cell Organelle Dissector*):**
  - Toggle between `1. Plant Palisade Cell`, `2. Animal Liver Cell`, `3. ATP & Photosynthesis Flow`, and `4. Protein Secretion Pathway (RER → Golgi → Vesicle)`.
  - Tap or select any organelle to highlight it in 3D, inspect its membrane count (`Double`, `Single`, `None`), structure, and function.
  - Live SVG Graph (`StudyGraph`): Compares **Mitochondrial & Chloroplast Density (organelles per cell)** across 4 specialised cell types (*Palisade mesophyll*, *Human liver/heart muscle*, *Onion bulb epidermis*, *Dead cornified skin cell*), illustrating why metabolically active cells have thousands of mitochondria while dead cornified skin cells have zero.

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Comprehensive Organelle Structure, Membrane Count & Function Guide:**
  1. **Double-Membrane Organelles:**
     - **Nucleus:** Bounded by a double nuclear envelope perforated by nuclear pores; contains nucleoplasm, **nucleolus** (manufactures ribosomal subunits/rRNA), and **chromatin / chromosomes** (linear DNA + histone proteins carrying hereditary genes). Controls all cellular activities and initiates cell division.
     - **Mitochondrion:** Sausage-shaped; smooth outer membrane and highly folded inner membrane forming shelf-like **cristae** (which massively increase surface area for respiratory enzymes) enclosing a fluid **matrix** (containing circular DNA and 70S ribosomes). Site of aerobic cellular respiration releasing **ATP** ("powerhouse of the cell").
     - **Chloroplast (Green Plant Cells):** Biconvex disc with double envelope; contains coin-like stacks of thylakoid membranes called **grana** (singular: *granum*, holding chlorophyll to trap light energy) suspended in a colourless fluid **stroma** (containing Calvin-cycle enzymes and starch grains).
  2. **Single-Membrane Organelles:**
     - **Endoplasmic Reticulum (ER):** Interconnected network of membrane-bound channels (cisternae) continuous with the outer nuclear membrane. **Rough ER (RER)** is studded with ribosomes and transports/folds newly synthesised proteins; **Smooth ER (SER)** lacks ribosomes and synthesises lipids, phospholipids, and steroid hormones while detoxifying drugs/poisons in liver cells.
     - **Golgi Body / Apparatus (Dictyosome in plants):** Stack of flattened, curved membrane sacs (**cisternae**) with secretory vesicles pinching off the edges. Modifies, sorts, packages, and secretes glycoproteins/enzymes; forms **lysosomes**; synthesises non-cellulose cell wall polysaccharides (pectin/hemicellulose) in dividing plant cells.
     - **Lysosome:** Spherical single-membrane sac packed with hydrolytic (digestive) enzymes. Digests engulfed bacteria/food particles (intracellular digestion) and breaks down worn-out organelles or damaged cells (**autolysis** / "suicide bag").
     - **Vacuole:** In mature plant cells, a **single large permanent central vacuole** filled with **cell sap** (water, sugars, mineral salts, pigments, waste) and surrounded by a selectively permeable single membrane called the **tonoplast** — maintains cell **turgidity** and pushes the nucleus and cytoplasm to the periphery. In animal cells, vacuoles are **small and temporary** (e.g., food vacuoles, pinocytic vesicles).
  3. **Non-Membranous Organelles & Boundaries (Exam Favourite!):**
     - **Ribosomes:** Tiny dense ribonucleoprotein granules ($20\text{–}30\text{ nm}$) with **no surrounding membrane**; found free in the cytoplasm or attached to Rough ER. Site of **protein synthesis** (translation of mRNA into polypeptide chains).
     - **Centrosome (Centrioles):** Two small hollow cylinders of microtubules arranged at right angles ($90^\circ$) near the nucleus in **animal cells** (absent in higher flowering plants). Organises **spindle fibres** during mitosis and meiosis; modified centrioles called **basal bodies** anchor and form **cilia and flagella**.
     - **Plastids (Plants Only):** Family of plant organelles comprising **chloroplasts** (green chlorophyll; photosynthesis), **chromoplasts** (carotenoid yellow/orange/red pigments in flower petals and ripe tomato/pepper fruits to attract pollinators and seed dispersers), and **leucoplasts** (colourless plastids in underground roots, yam/potato tubers, and seeds that store starch as *amyloplasts*, oils as *elaioplasts*, or proteins as *aleuroplasts*).
- **Mandatory Comparison Tables (`.tbl`):**
  - **Table 1: Plant Cell vs Animal Cell (8 matching rows):** Cell wall, Shape, Vacuole & Tonoplast, Chloroplasts/Plastids, Centrioles, Nucleus position, Stored carbohydrate (**Starch** vs **Glycogen**), Lysosomes.
  - **Table 2: Cell Wall vs Cell Membrane (5 matching rows):** Chemical composition (**Cellulose** vs **Lipoprotein / Phospholipid bilayer + proteins**), Permeability (**Fully/freely permeable** vs **Selectively/differentially permeable**), Mechanical nature (**Rigid** vs **Flexible**), Living status (**Non-living** vs **Living**), Occurrence (**Plants, fungi, bacteria** vs **All living cells**).
- **3D Concept Zoom (`zoom.js` — *3D Mitochondrion Cristae, Chloroplast Grana & Plasma Membrane Bilayer*):**
  - Interactive 3D close-up comparing the folded **cristae** & **matrix** of a mitochondrion, the stacked **thylakoid grana** & **stroma** of a chloroplast, and the **phospholipid bilayer** pressed against **cellulose microfibrils**.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **Worked Example 1 (Mitochondrial Cristae Surface Area Amplification & ATP Output):**
  - *Problem:* The outer membrane of a liver mitochondrion has a surface area of $A_{\text{outer}} = 12\text{ }\mu\text{m}^2$. Because the inner membrane is extensively folded into cristae, its surface area is $4.5$ times the outer membrane area. If each $1\text{ }\mu\text{m}^2$ of inner cristae membrane produces $2500$ molecules of ATP per second, calculate: (a) the inner cristae surface area $A_{\text{inner}}$, and (b) the total ATP molecules generated by one mitochondrion per second.
  - *Step 1 (Inner cristae membrane surface area $A_{\text{inner}}$):*
    $$A_{\text{inner}} = 4.5 \times A_{\text{outer}} = 4.5 \times 12 = 54\text{ }\mu\text{m}^2$$
  - *Step 2 (Total ATP molecules produced per second):*
    $$N_{\text{ATP}} = 2500 \times A_{\text{inner}} = 2500 \times 54 = 135\,000\text{ ATP s}^{-1}$$
- **Worked Example 2 (Aerobic vs Anaerobic ATP Yield per Glucose Molecule):**
  - *Problem:* Glycolysis in the cytoplasm yields $2\text{ ATP}$ per glucose molecule, whereas complete aerobic respiration inside the mitochondria yields an additional $36\text{ ATP}$ per glucose molecule. Calculate: (a) the total ATP yield per glucose molecule in a cell with active mitochondria, and (b) how many times more efficient aerobic respiration is compared to cytoplasmic glycolysis alone.
  - *Step 1 (Total aerobic ATP yield per glucose):*
    $$\text{ATP}_{\text{total}} = \text{ATP}_{\text{glycolysis}} + \text{ATP}_{\text{mitochondria}} = 2 + 36 = 38\text{ ATP}$$
  - *Step 2 (Efficiency ratio $R$):*
    $$R = \frac{\text{ATP}_{\text{total}}}{\text{ATP}_{\text{glycolysis}}} = \frac{38}{2} = 19\text{ times}$$
- **Worked Example 3 (Vacuolar Volume Fraction in a Mature Plant Cell):**
  - *Problem:* A mature brick-shaped onion epidermal cell has total volume $V_{\text{cell}} = 120\,000\text{ }\mu\text{m}^3$, and its central sap vacuole occupies $V_{\text{vac}} = 96\,000\text{ }\mu\text{m}^3$. Calculate the percentage of the cell's volume occupied by the central vacuole and the remaining volume of the peripheral protoplasm (cytoplasm + nucleus).
  - *Step 1 (Percentage volume occupied by the central vacuole):*
    $$\%V_{\text{vac}} = \frac{V_{\text{vac}}}{V_{\text{cell}}} \times 100 = \frac{96\,000}{120\,000} \times 100 = 0.80 \times 100 = 80\%$$
  - *Step 2 (Volume of peripheral protoplasm $V_{\text{proto}}$):*
    $$V_{\text{proto}} = V_{\text{cell}} - V_{\text{vac}} = 120\,000 - 96\,000 = 24\,000\text{ }\mu\text{m}^3$$
- **The Bridge (`#bridge`):** Match 3 mystery biopsy slides (Palisade leaf cell, Human cardiac muscle cell, Dead cornified epidermis cell) based on organelle counts and carbohydrate storage (starch vs glycogen).

---

### LESSON 03 · Forms of Living Cells & Levels of Biological Organisation (`html/lessons/lesson-03/`)

#### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval cards from Lessons 01–02 (`from: 1, 2` in `retrieval-bank.js`).

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story Scene (`story.js` — *The Ogun River Pond Safari: One Cell Doing Everything vs Specialised Organs*):**
  - **Beat 1:** Zainab and Kelechi collect a jar of green pond water from a slow stream near Mile 12 bridge and bring it to Dr Halima's microscope bench.
  - **Beat 2:** Under the 3D Pond Microscope, they spot *Amoeba* extending finger-like **pseudopodia**, *Paramecium* beating rows of **cilia**, and bright green spindle-shaped *Euglena* whipping its **flagellum** towards the lamp!
  - **Beat 3:** Kelechi is puzzled: *"Wait — *Euglena* swims like an animal with a flagellum, gullet, pellicle, and eyespot, yet it's packed with green chloroplasts like a plant! Is it a plant or an animal?"*
  - **Beat 4:** Next they see a rolling green globe of *Volvox* and silky green threads of *Spirogyra*, alongside a tentacled freshwater *Hydra*. Zainab asks: *"If *Volvox* and *Spirogyra* are made of hundreds of cells joined together, why doesn't WAEC classify them as tissues like *Hydra*?"*
  - **Beat 5:** Dr Halima poses the second big question: *"And why can a tiny *Amoeba* breathe and excrete straight through its cell membrane by simple diffusion, whereas a lizard or human would suffocate in seconds without lungs, heart, and blood vessels?"*
- **Wonder Wall (`#wonder`):**
  - Prompt: *What separates a colony (*Volvox*) or filament (*Spirogyra*) from a true tissue (*Hydra*), and why does growing larger force organisms to build complex organ systems?*

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Sort Game (`#sort`):** Sort 10 biological examples into **`Single Free-Living Cell`**, **`Colony or Filament (Independent Cells)`**, and **`Tissue, Organ or System Level (Interdependent)`**:
  1. `Amoeba proteus — Moves by pseudopodia; holozoic nutrition` $\rightarrow$ `Single Free-Living Cell`
  2. `Paramecium caudatum — Slipper-shaped; beats cilia; two contractile vacuoles` $\rightarrow$ `Single Free-Living Cell`
  3. `Euglena viridis — Mixotrophic (chloroplasts in light, saprophytic in dark)` $\rightarrow$ `Single Free-Living Cell`
  4. `Chlamydomonas — Unicellular green alga with cup-shaped chloroplast & two flagella` $\rightarrow$ `Single Free-Living Cell`
  5. `Volvox — Hollow mucilage sphere of biflagellate cells linked by cytoplasmic strands` $\rightarrow$ `Colony or Filament (Independent Cells)`
  6. `Spirogyra — Unbranched chain of cylindrical cells with spiral ribbon chloroplasts` $\rightarrow$ `Colony or Filament (Independent Cells)`
  7. `Hydra — Diploblastic aquatic animal at the tissue level of organisation` $\rightarrow$ `Tissue, Organ or System Level (Interdependent)`
  8. `Blood & Xylem — Specialised cells cooperating to perform one transport function (Tissue)` $\rightarrow$ `Tissue, Organ or System Level (Interdependent)`
  9. `Onion bulb, ginger rhizome, plant leaf & mammalian heart (Organs)` $\rightarrow$ `Tissue, Organ or System Level (Interdependent)`
  10. `Mammalian digestive, excretory & circulatory systems (Organ Systems)` $\rightarrow$ `Tissue, Organ or System Level (Interdependent)`
- **3D Virtual Lab Bench (`bench.js` — *3D Pond Micro-Safari & Surface-Area-to-Volume ($\frac{SA}{V}$) Scaling Bench*):**
  - Inspect interactive 3D models of `1. Euglena & Paramecium`, `2. Volvox Colony vs Spirogyra Filament`, `3. Hydra (Tissue) vs Onion Bulb (Organ)`, and `4. SA/V Cube Scaling Test (L = 1 mm to 10 mm)`.
  - Live SVG Graph (`StudyGraph`): Plots **Surface-Area-to-Volume Ratio ($\frac{SA}{V} = \frac{6}{L}$) vs Cube Side Length $L$**, showing the hyperbolic drop from $6.0\text{ mm}^{-1}$ at $L = 1\text{ mm}$ down to $0.6\text{ mm}^{-1}$ at $L = 10\text{ mm}$.

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts:**
  1. **Four Forms in Which Living Cells Exist:**
     - **As Single Free-Living Unicellular Organisms:** One cell carries out all life processes independently:
       - *Amoeba proteus:* Irregular shape, flexible cell membrane, ectoplasm & endoplasm, **pseudopodia** (false feet for amoeboid locomotion and engulfing prey by phagocytosis), food vacuole, **contractile vacuole** (osmoregulation — expels excess water entering by osmosis in freshwater), **holozoic** nutrition.
       - *Paramecium caudatum:* Fixed slipper shape maintained by a firm flexible **pellicle**, rows of **cilia** arising from **basal bodies**, oral groove leading to cytopharynx (gullet), **macronucleus** (controls metabolism) and **micronucleus** (sexual conjugation), two star-shaped **contractile vacuoles** with radiating canals, anal pore (cytoproct), **holozoic** nutrition.
       - *Euglena viridis:* Spindle-shaped protist sharing **both plant and animal characteristics**. *Animal features:* flexible protein **pellicle** (no cellulose wall), locomotory **flagellum**, gullet/reservoir, light-sensitive **eyespot (stigma)**, contractile vacuole, ability to feed **saprophytically** in darkness. *Plant features:* **chloroplasts** containing chlorophyll for **autotrophic** photosynthesis in light, and paramylum starch granules.
       - *Chlamydomonas:* Oval unicellular green alga with a **cellulose cell wall**, two anterior flagella, eyespot, two anterior contractile vacuoles, and a single large **cup-shaped chloroplast** containing a **pyrenoid** (starchy protein core for starch storage); **autotrophic**.
     - **As a Colony (*Volvox*):** Hollow mucilage sphere of hundreds to thousands of *Chlamydomonas*-like biflagellate cells connected by fine **cytoplasmic strands**, with reproductive **daughter colonies** inside; **autotrophic**.
     - **As a Filament (*Spirogyra*):** Unbranched chain of cylindrical cells joined end-to-end, covered by a slimy **mucilage sheath**, with a cellulose wall, peripheral cytoplasm, central nucleus suspended by cytoplasmic threads, and a characteristic **spiral ribbon-shaped chloroplast** studded with **pyrenoids**; **autotrophic**.
     - **As Part of a Multicellular Living Organism:** Specialised, interdependent cells (e.g., **palisade mesophyll cell** — cylindrical, packed beneath upper leaf epidermis with abundant chloroplasts and thin walls for rapid gas diffusion; **onion epidermal cell**; **human cheek cell**; **red blood cell**; **neurone**).
  2. **Why a Colony (*Volvox*) or Filament (*Spirogyra*) Is NOT a Tissue:**
     - In a **colony or filament**, the constituent cells are structurally identical, each cell carries out almost all life processes independently, and there is minimal division of labour. In a **true tissue** (e.g., *Hydra* ectoderm/endoderm, human epithelium, plant xylem), the cells are structurally **specialised and interdependent**, cooperating to perform a single specific physiological function.
  3. **Levels of Biological Organisation (Simplest $\rightarrow$ Most Complex):**
     $$\text{Organelle} \rightarrow \text{Cell} \rightarrow \text{Tissue} \rightarrow \text{Organ} \rightarrow \text{Organ System} \rightarrow \text{Multicellular Organism}$$
     - *Exam Trap on Plant Storage Organs:* **Onion bulb**, **ginger rhizome**, **cocoyam corm**, and **Irish potato stem tuber** are **ORGANS** (not tissues!), because each consists of several tissues (epidermis, storage parenchyma, vascular bundles of xylem and phloem, and scale leaves/buds) working together.
     - *Exam Comparison — Hydra vs Mammal:* **Hydra** is at the **tissue level** of organisation, **diploblastic** (two body layers: ectoderm and endoderm separated by non-cellular mesoglea), and **radially symmetrical**; a **Mammal** is at the **organ-system level**, **triploblastic** (ectoderm, mesoderm, endoderm), and **bilaterally symmetrical**.
  4. **Surface-Area-to-Volume Ratio ($\frac{SA}{V}$) & Complexity Trade-Offs:**
     $$\text{Surface Area } SA = 6L^2, \quad \text{Volume } V = L^3 \implies \frac{SA}{V} = \frac{6L^2}{L^3} = \frac{6}{L}$$
     - **Why *Amoeba* and *Paramecium* need no lungs or heart:** Their microscopic size gives them a **very large surface-area-to-volume ratio ($\frac{SA}{V}$)** and an extremely short internal diffusion distance, so simple diffusion across the cell membrane supplies enough $\text{O}_2$ and removes metabolic wastes fast enough.
     - **Advantages of Complexity:** Division of labour and high physiological efficiency; larger body size; ability to colonise diverse terrestrial/aquatic habitats; homoeostatic independence.
     - **Disadvantages of Complexity:** Individual specialised cells lose independence and cannot survive alone; damage to one vital organ (e.g., heart) threatens the entire organism; low $\frac{SA}{V}$ requires energy-expensive respiratory and circulatory systems; slower regeneration and higher total food/energy demand.
- **3D Concept Zoom (`zoom.js` — *3D Biological Hierarchy & $\frac{SA}{V}$ Diffusion Path Zoom*):**
  - Interactive 3D zoom from Mitochondrion (Organelle) $\rightarrow$ Muscle Cell $\rightarrow$ Cardiac Muscle Tissue $\rightarrow$ Heart (Organ) $\rightarrow$ Circulatory System $\rightarrow$ Organism.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **Worked Example 1 (Surface-Area-to-Volume Ratio of Unicellular vs Multicellular Cubes):**
  - *Problem:* Model a microscopic *Amoeba* as a cube of side length $L_1 = 0.1\text{ mm}$ and a small multicellular tissue block as a cube of side length $L_2 = 10\text{ mm}$. Calculate: (a) the surface-area-to-volume ratio $\left(\frac{SA}{V}\right)_1$ of the *Amoeba* cube, (b) the surface-area-to-volume ratio $\left(\frac{SA}{V}\right)_2$ of the $10\text{ mm}$ cube, and (c) how many times greater the *Amoeba*'s $\frac{SA}{V}$ ratio is.
  - *Step 1 ($\frac{SA}{V}$ ratio of the $0.1\text{ mm}$ *Amoeba* cube):*
    $$R_1 = \frac{6}{L_1} = \frac{6}{0.1} = 60\text{ mm}^{-1}$$
  - *Step 2 ($\frac{SA}{V}$ ratio of the $10\text{ mm}$ tissue cube):*
    $$R_2 = \frac{6}{L_2} = \frac{6}{10} = 0.6\text{ mm}^{-1}$$
  - *Step 3 (Ratio comparison $F$):*
    $$F = \frac{R_1}{R_2} = \frac{60}{0.6} = 100\text{ times}$$
- **Worked Example 2 (Contractile Vacuole Osmoregulation Pumping Rate in *Paramecium*):**
  - *Problem:* A freshwater *Paramecium* has a cell volume of $V_{\text{cell}} = 150\,000\text{ }\mu\text{m}^3$. Its two contractile vacuoles each expel $V_{\text{drop}} = 5000\text{ }\mu\text{m}^3$ of water every $15\text{ seconds}$. Calculate: (a) the total volume of water expelled per minute by both vacuoles, and (b) how many minutes it takes the *Paramecium* to expel a volume of water equal to its entire body volume.
  - *Step 1 (Water expelled per cycle by both vacuoles):*
    $$V_{\text{cycle}} = 2 \times 5000 = 10\,000\text{ }\mu\text{m}^3$$
  - *Step 2 (Cycles per minute and total water expelled per minute $Q_{\text{min}}$):*
    $$Q_{\text{min}} = 10\,000 \times \frac{60}{15} = 10\,000 \times 4 = 40\,000\text{ }\mu\text{m}^3\text{ min}^{-1}$$
  - *Step 3 (Time $t$ to expel one full body volume):*
    $$t = \frac{V_{\text{cell}}}{Q_{\text{min}}} = \frac{150\,000}{40\,000} = 3.75\text{ min}$$
- **Worked Example 3 (Colony Cell Count & Filament Length in *Volvox* and *Spirogyra*):**
  - *Problem:* A *Spirogyra* filament measures $L_{\text{total}} = 36\text{ mm}$ in length. If each cylindrical cell in the unbranched filament has an actual length of $L_{\text{cell}} = 180\text{ }\mu\text{m}$, calculate how many cells make up the filament.
  - *Step 1 (Convert total filament length from $\text{mm}$ to $\mu\text{m}$):*
    $$L_{\text{total}} = 36 \times 1000 = 36\,000\text{ }\mu\text{m}$$
  - *Step 2 (Number of cells $N$ in the filament):*
    $$N = \frac{L_{\text{total}}}{L_{\text{cell}}} = \frac{36\,000}{180} = 200\text{ cells}$$

---

### LESSON 04 · The Cell & Its Environment — Diffusion, Osmosis, Turgor & Haemolysis (`html/lessons/lesson-04/`)

#### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval cards from Lessons 02–03 (`from: 2, 3` in `retrieval-bank.js`).

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story Scene (`story.js` — *Solving the Mile 12 Ugu Leaf & LUTH Red Blood Cell Mystery*):**
  - **Beat 1:** Back at Mile 12 Market, Mama Nkechi shows two bowls of sliced *ugu* stems: one soaked in fresh borehole water (stems are stiff and curved outward) and one sprinkled with table salt to preserve it (stems are limp sitting in a puddle of drawn-out green water).
  - **Beat 2:** At LUTH Haematology Lab, Dr Halima places three test tubes on the rack: Red blood cells in **$0.0\%$ distilled water** (clear red — cells shattered!), in **$0.9\%$ saline** (intact biconcave discs), and in **$5.0\%$ concentrated salt** (shrunken spiky cells!).
  - **Beat 3:** Zainab exclaims: *"Wait! In distilled water, both the *ugu* cell and the red blood cell take in water by **osmosis** — why did the red blood cell burst (**haemolysis**) while the *ugu* cell became firm (**turgid**) without bursting?"*
  - **Beat 4:** Kelechi points to the plant cell's outer armour: *"The rigid **cellulose cell wall**! As the central vacuole swells, the cell wall pushes back with inward **turgor pressure** until no more net water can enter! A red blood cell only has a thin flexible plasma membrane, so it swells until it pops!"*
  - **Beat 5:** Dr Halima challenges them to run a quantitative **Plant Tissue Osmometry Experiment** on the 3D Bench to find the exact **isotonic concentration** of yam/potato cell sap from the $0\%$ mass-change intercept!
- **Wonder Wall (`#wonder`):**
  - Prompt: *What is the exact difference between plasmolysis and crenation, and how can we find the internal solute concentration of a yam tuber without squeezing out its cell sap?*

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Sort Game (`#sort`):** Sort 9 cellular transport scenarios into **`Diffusion or Active Transport`**, **`Plant Cell Osmotic Responses`**, and **`Animal Cell Osmotic Responses`**:
  1. `Oxygen and carbon dioxide gas exchange across palisade cell walls (Passive down gradient)` $\rightarrow$ `Diffusion or Active Transport`
  2. `Root hair cells absorbing nitrate ions from dilute soil water using ATP energy` $\rightarrow$ `Diffusion or Active Transport`
  3. `Sodium-potassium pump in nerve axons requiring abundant mitochondria` $\rightarrow$ `Diffusion or Active Transport`
  4. `Turgidity — Plant cell in hypotonic water swells until wall pressure balances osmosis` $\rightarrow$ `Plant Cell Osmotic Responses`
  5. `Plasmolysis — Plant protoplasm pulls away from the cellulose wall in hypertonic salt` $\rightarrow$ `Plant Cell Osmotic Responses`
  6. `Flaccidity & Wilting — Plant cells lose turgor pressure when water is scarce` $\rightarrow$ `Plant Cell Osmotic Responses`
  7. `Haemolysis — Red blood cell in distilled water swells and bursts (no cell wall)` $\rightarrow$ `Animal Cell Osmotic Responses`
  8. `Crenation — Red blood cell in hypertonic salt loses water and becomes notched/wrinkled` $\rightarrow$ `Animal Cell Osmotic Responses`
  9. `Isotonic stability — Red blood cells in 0.9% NaCl saline show zero net water movement` $\rightarrow$ `Animal Cell Osmotic Responses`
- **3D Virtual Lab Bench (`bench.js` — *3D Osmosis, Plasmolysis & Haemolysis Chamber + Live Osmometry Graph*):**
  - Switch between `1. Plant Cell (Turgid ↔ Plasmolysed)`, `2. Red Blood Cell (Haemolysis ↔ Crenation)`, and `3. Yam Cylinder Osmometry Curve (0.0 M – 0.8 M)`.
  - Adjust external sucrose molarity $C$ from $0.0\text{ M}$ to $0.8\text{ M}$ and observe 3D vacuole expansion/shrinkage, protoplasm detachment gap, or red blood cell bursting/crenation.
  - Live SVG Graph (`StudyGraph`): Plots **Percentage Mass Change ($\%\Delta m$) vs Sucrose Concentration ($M$)** from $+18.0\%$ at $0.0\text{ M}$ through $0.0\%$ at the **isotonic point ($0.30\text{ M}$)** down to $-20.0\%$ at $0.8\text{ M}$.

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Concepts & Equations:**
  1. **Comparison of Diffusion, Osmosis & Active Transport (`.tbl`):**
     - **Diffusion:** Net passive movement of molecules or ions from a region of higher concentration to a region of lower concentration down a concentration gradient (no ATP required; occurs in gases, liquids, and across permeable membranes).
     - **Osmosis:** Net passive movement of **water molecules** from a dilute solution (higher water potential $\Psi_w$, **hypotonic**) to a more concentrated solution (lower water potential, **hypertonic**) across a **selectively (differentially) permeable membrane** (no ATP required).
     - **Active Transport:** Movement of ions or molecules **against** a concentration gradient (from lower to higher concentration) across a living cell membrane using carrier proteins and metabolic energy from **ATP** (inhibited by respiratory poisons like cyanide or lack of oxygen).
  2. **Plant vs Animal Cells in Three Tonicity Environments (`.tbl`):**
     - **Hypotonic Solution (e.g., Distilled Water):**
       - *Plant Cell:* Water enters vacuole by osmosis $\rightarrow$ vacuole swells $\rightarrow$ protoplasm presses tightly against the rigid **cellulose cell wall** $\rightarrow$ cell becomes **turgid** (wall exerts equal and opposite turgor pressure $\Psi_p$; cell **does not burst**).
       - *Animal Cell (Red Blood Cell):* Water enters by osmosis $\rightarrow$ cell swells unchecked because it has **no cell wall** $\rightarrow$ plasma membrane ruptures $\rightarrow$ **haemolysis**.
     - **Isotonic Solution (e.g., $0.9\%\text{ NaCl}$ for mammalian blood / $0.3\text{ M}$ sucrose for yam tissue):**
       - Water potential outside equals water potential inside $\rightarrow$ no net movement of water $\rightarrow$ cells keep normal volume (**incipient plasmolysis / flaccid** in plants; normal biconcave disc in RBCs).
     - **Hypertonic Solution (e.g., Concentrated Salt/Sugar Solution):**
       - *Plant Cell:* Water leaves the central vacuole by osmosis $\rightarrow$ vacuole shrinks $\rightarrow$ cytoplasm and plasma membrane pull away from the rigid cell wall $\rightarrow$ **plasmolysis** (gap between wall and shrunken protoplasm fills with the external hypertonic solution because the cellulose wall is freely permeable!).
       - *Animal Cell (Red Blood Cell):* Water leaves by osmosis $\rightarrow$ cell shrinks and its membrane becomes scalloped/wrinkled $\rightarrow$ **crenation**.
  3. **Quantitative Osmometry & Water Potential Equations (`.eq`):**
     $$\%\Delta m = \frac{m_f - m_i}{m_i} \times 100\%$$
     $$\Psi_w = \Psi_s + \Psi_p$$
     where $\Psi_w$ is cell water potential (always $\le 0$, with pure water $\Psi_w = 0\text{ kPa}$), $\Psi_s$ is solute/osmotic potential (negative), and $\Psi_p$ is pressure/turgor potential ($\ge 0$ in turgid cells; $0\text{ kPa}$ in plasmolysed/flaccid cells).
- **3D Concept Zoom (`zoom.js` — *3D Semi-Permeable Bilayer: Aquaporin Osmosis vs ATP Active Transport Pump*):**
  - Shows water molecules moving down their water-potential gradient through aquaporin channels alongside an ATP-driven carrier protein pumping $\text{K}^+$ and $\text{NO}_3^-$ ions uphill into a root hair cell.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **Worked Example 1 (Percentage Mass Change in Yam Strip Osmometry):**
  - *Problem:* In a WAEC practical investigation, two identical yam cylinders each of initial mass $m_i = 5.00\text{ g}$ are immersed for $45\text{ minutes}$: Cylinder A in distilled water ($0.0\text{ M}$) reaches a final mass of $m_{fA} = 5.85\text{ g}$, while Cylinder B in $0.6\text{ M}$ sucrose solution reaches a final mass of $m_{fB} = 4.20\text{ g}$. Calculate the percentage change in mass for both cylinders and state the osmotic process in each.
  - *Step 1 (Mass change and percentage change for Cylinder A in distilled water):*
    $$\%\Delta m_A = \frac{m_{fA} - m_i}{m_i} \times 100 = \frac{5.85 - 5.00}{5.00} \times 100 = \frac{0.85}{5.00} \times 100 = +17.0\%$$
  - *Step 2 (Mass change and percentage change for Cylinder B in $0.6\text{ M}$ sucrose):*
    $$\%\Delta m_B = \frac{m_{fB} - m_i}{m_i} \times 100 = \frac{4.20 - 5.00}{5.00} \times 100 = \frac{-0.80}{5.00} \times 100 = -16.0\%$$
- **Worked Example 2 (Water Potential & Turgor Pressure in a Plant Cell):**
  - *Problem:* A mesophyll cell in a wilted *ugu* leaf has a solute potential $\Psi_s = -800\text{ kPa}$ and turgor pressure $\Psi_p = 150\text{ kPa}$. (a) Calculate its water potential $\Psi_w$. (b) When the leaf is placed in pure water ($\Psi_w = 0\text{ kPa}$), water enters until the cell is fully turgid at $\Psi_w = 0\text{ kPa}$ (assuming $\Psi_s$ becomes $-720\text{ kPa}$). What is the final turgor pressure $\Psi_p$?
  - *Step 1 (Initial water potential $\Psi_w$ of the wilted cell):*
    $$\Psi_w = \Psi_s + \Psi_p = -800 + 150 = -650\text{ kPa}$$
  - *Step 2 (Final turgor pressure $\Psi_p$ at full turgidity where $\Psi_w = 0\text{ kPa}$):*
    $$\Psi_p = \Psi_w - \Psi_s = 0 - (-720) = +720\text{ kPa}$$
- **Worked Example 3 (Direction of Water Flow Between Two Adjacent Plant Cells):**
  - *Problem:* Cell X has solute potential $\Psi_{sX} = -500\text{ kPa}$ and turgor pressure $\Psi_{pX} = +300\text{ kPa}$. Adjacent Cell Y has solute potential $\Psi_{sY} = -900\text{ kPa}$ and turgor pressure $\Psi_{pY} = +450\text{ kPa}$. Calculate $\Psi_{wX}$ and $\Psi_{wY}$ and determine the direction of net water movement by osmosis.
  - *Step 1 (Water potential of Cell X):*
    $$\Psi_{wX} = \Psi_{sX} + \Psi_{pX} = -500 + 300 = -200\text{ kPa}$$
  - *Step 2 (Water potential of Cell Y):*
    $$\Psi_{wY} = \Psi_{sY} + \Psi_{pY} = -900 + 450 = -450\text{ kPa}$$
  - *Step 3 (Water potential difference $\Delta\Psi_w$ from X to Y):*
    $$\Delta\Psi_w = \Psi_{wX} - \Psi_{wY} = -200 - (-450) = +250\text{ kPa}$$
    *(Water flows from higher/less negative water potential **Cell X ($-200\text{ kPa}$)** to lower/more negative water potential **Cell Y ($-450\text{ kPa}$)**).*

---

### LESSON 05 · WAEC Paper 3 Practical — Wet-Mount Microscopy & Biological Drawing Clinic (`html/lessons/lesson-05/`)

#### Phase 0 · Warm-up (`#donow` · 5 min)
- 4 spaced-retrieval cards from Lessons 01–04 (`from: 1, 2, 3, 4` in `retrieval-bank.js`).

#### Phase 1 · Wonder (`#story` & `#wonder` · 8 min)
- **3D Story Scene (`story.js` — *Inside the WAEC Paper 3 Practical Examination Hall*):**
  - **Beat 1:** Dr Halima sets out the WAEC Paper 3 Practical tray: **Specimen A** (fleshy onion bulb scale leaf + dropper bottle of iodine solution) and **Specimen B** (sterile wooden cheek-scraping spatula + dropper bottle of methylene blue).
  - **Beat 2:** Kelechi prepares his onion slide by dropping the coverslip flat from above — trapping three huge black-ringed circles in the field of view! He shouts: *"Dr Halima, I found giant round nuclei in the onion!"*
  - **Beat 3:** Dr Halima laughs: *"Those thick dark rings are **trapped air bubbles**, Kelechi! That's why you must always lower the coverslip gently at a **$45^\circ$ angle** using a mounting needle!"*
  - **Beat 4:** Next, Zainab inspects a past candidate's drawing of Specimen A that lost $8$ out of $10$ marks: the student shaded the vacuole with a blunt pencil, crossed two label guidelines with arrowheads, forgot the title and magnification, and labelled **"Chloroplasts"** and **"Mitochondria"** on an onion bulb cell!
  - **Beat 5:** Dr Halima reveals the **9 WAEC Chief Examiner Biological Drawing Rules** and challenges Zainab and Kelechi to prepare flawless wet mounts and audit every Paper 3 trap on the 3D Slide & Drawing Inspector Bench.
- **Wonder Wall (`#wonder`):**
  - Prompt: *Why are there zero chloroplasts in an onion bulb epidermal cell, why can't you label the cell membrane separately in a normal unplasmolysed onion cell, and what are the 9 Chief Examiner rules for a full-mark biological drawing?*

#### Phase 2 · Investigate (`#sort` & `#practical` · 25 min)
- **Sort Game (`#sort`):** Sort 10 practical actions & features into **`Specimen A (Onion Epidermis — Iodine)`**, **`Specimen B (Cheek Cell — Methylene Blue)`**, and **`WAEC Paper 3 Drawing Penalties (Faults to Avoid)`**:
  1. `Peel translucent inner epidermis from fleshy scale leaf; stain with iodine solution` $\rightarrow$ `Specimen A (Onion Epidermis — Iodine)`
  2. `Observable features: brick-shaped cellulose cell wall, large central vacuole, peripheral nucleus` $\rightarrow$ `Specimen A (Onion Epidermis — Iodine)`
  3. `Zero chloroplasts present because the onion bulb grows underground without sunlight` $\rightarrow$ `Specimen A (Onion Epidermis — Iodine)`
  4. `Gently scrape inside of cheek with sterile spatula; stain with methylene blue` $\rightarrow$ `Specimen B (Cheek Cell — Methylene Blue)`
  5. `Observable features: irregular shape, thin outer cell membrane, central nucleus, granular cytoplasm` $\rightarrow$ `Specimen B (Cheek Cell — Methylene Blue)`
  6. `Labelling chloroplasts, mitochondria, ER, or ribosomes on a ×100 light-microscope drawing` $\rightarrow$ `WAEC Paper 3 Drawing Penalties (Faults to Avoid)`
  7. `Shading, stippling, colouring, or using woolly/sketchy pencil lines` $\rightarrow$ `WAEC Paper 3 Drawing Penalties (Faults to Avoid)`
  8. `Crossing label guidelines, adding arrowheads, or failing to touch the structure` $\rightarrow$ `WAEC Paper 3 Drawing Penalties (Faults to Avoid)`
  9. `Omitting the drawing title or leaving out the magnification (e.g. ×100)` $\rightarrow$ `WAEC Paper 3 Drawing Penalties (Faults to Avoid)`
  10. `Writing plural labels on a single guideline or starting a genus name with a small letter` $\rightarrow$ `WAEC Paper 3 Drawing Penalties (Faults to Avoid)`
- **3D Virtual Lab Bench (`bench.js` — *3D Wet-Mount Slide Preparation & WAEC Drawing Inspector Bench*):**
  - Step-by-step interactive 3D wet-mount simulator:
    1. Switch between `1. Specimen A: Onion Epidermis (Iodine ×100)`, `2. Specimen B: Cheek Epithelium (Methylene Blue ×400)`, and `3. Drawing Fault Inspector (Audit 6 Examiner Rules)`.
    2. Adjust Coverslip Lowering Angle ($0^\circ$ flat drop $\rightarrow$ traps dark air bubbles vs $45^\circ$ needle lower $\rightarrow$ zero air bubbles) and Objective Lens ($\times 4 \rightarrow \times 10 \rightarrow \times 40$).
  - Live SVG Graph (`StudyGraph`): Plots **Field-of-View Diameter $D_{\text{FOV}}\text{ (}\mu\text{m)}$ vs Total Magnification $M_{\text{total}}$** ($D_{\text{FOV}} = \frac{180\,000}{M_{\text{total}}}$), showing why high power ($\times 400$, $D_{\text{FOV}} = 450\text{ }\mu\text{m}$) views fewer cells in greater detail than low power ($\times 100$, $D_{\text{FOV}} = 1800\text{ }\mu\text{m}$).

#### Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min)
- **Core Practical Concepts:**
  1. **Wet-Mount Slide Preparation Protocols:**
     - **Specimen A (Onion Bulb Epidermis):** Peel the thin, transparent inner epidermis from the concave surface of a fleshy onion scale leaf using forceps. Mount flat in a drop of water on a clean glass slide, add a drop of **iodine solution** (stains the nucleus yellowish-brown and makes the cell wall distinct), and lower the coverslip at a **$45^\circ$ angle** with a mounting needle to exclude air bubbles. Blot excess stain with filter paper and focus under **low power first** before switching to high power.
     - **Specimen B (Human Cheek Squamous Cells):** Gently scrape the inner lining of the washed cheek with a clean sterile wooden spatula, smear in a drop of physiological saline on a slide, add a drop of **methylene blue** (stains the central nucleus dark blue), lower the coverslip at $45^\circ$, and view under $\times 400$.
  2. **Crucial WAEC Paper 3 Rule — Observable vs Theoretical Differences (`.tbl`):**
     - **Why you must NOT label the cell membrane in a normal onion cell:** In a turgid/normal onion cell, the thin plasma membrane is pressed tightly against the inner surface of the thick cellulose cell wall and cannot be resolved separately under a light microscope (only visible if the cell is plasmolysed).
     - **Why you must NOT label chloroplasts in an onion bulb cell:** The onion bulb is an underground storage organ that grows in darkness and does not photosynthesise; only green aerial leaves contain chloroplasts.
     - **Why you must NOT label mitochondria, ER, ribosomes, or Golgi bodies in Paper 3:** These sub-cellular structures require an electron microscope (or specialized vital staining at $\times 1000$ oil immersion for tiny mitochondrial dots) and are not clearly visible in a standard school practical.
     - **Table of Observable Differences (Specimen A vs Specimen B):**
       1. **Cell wall:** Present (double line) in Specimen A | Absent in Specimen B.
       2. **Shape:** Regular, rectangular/brick-shaped in A | Irregular, rounded/flattened in B.
       3. **Vacuole:** Large central vacuole clearly visible in A | Absent / not visible in B.
       4. **Position of nucleus:** Pushed to the periphery/side in A | Located centrally in B.
       5. **Arrangement:** Cells joined tightly edge-to-edge in a sheet in A | Cells often seen singly or in loose clusters in B.
  3. **The 9 WAEC Chief Examiner Biological Drawing Rules:**
     1. **Clear Title:** Below or above the drawing (e.g., *"Diagram of Specimen A (Iodine-Stained Onion Epidermal Cells) as Seen Under the Light Microscope"*).
     2. **Magnification:** Written below the title/drawing with a multiplication sign and no units (e.g., $\text{Mag. } \times 100$ or $\times 4$).
     3. **Correct Size:** Draw within the length range specified by the question (typically $6\text{–}8\text{ cm}$ or $8\text{–}10\text{ cm}$ long).
     4. **Sharp HB Pencil Lines:** Clean, single, continuous, sharp lines; **never shade, stipple, or colour**; never use woolly/sketchy overlapping strokes.
     5. **Double Lines for Cut Surfaces & Cell Walls:** Always represent the thickness of a plant cell wall or cut stem/fruit wall with **double lines**.
     6. **Ruled Horizontal Guidelines:** Draw label lines with a ruler; keep them **horizontal and parallel**; they **must touch** the exact part labelled, **must never cross** each other, and **must have no arrowheads**.
     7. **Singular Labels:** Write every label in the **singular** (`"nucleus"`, `"cell wall"`, not `"nuclei"`) when one guideline points to one structure.
     8. **Correct Spelling & Taxonomy Capitalisation:** Spell all biological terms accurately (`cytoplasm`, `chloroplast`, `mitochondrion`, `vacuole`) and start generic (genus) names with a capital letter (*Spirogyra*, *Amoeba*, *Euglena*).
     9. **Fidelity to Specimen:** Draw only what is observable in the specimen provided, never a memorised textbook diagram.
- **3D Concept Zoom (`zoom.js` — *3D Light Microscope vs Electron Microscope Resolution & Drawing Guideline Audit*):**
  - Interactive 3D comparison showing why light microscopy ($\lambda \approx 500\text{ nm}$, resolution $\approx 200\text{ nm}$) resolves cell walls, nuclei, and vacuoles while electron microscopy ($\lambda \approx 0.005\text{ nm}$, resolution $\approx 0.2\text{ nm}$) resolves ribosomes, cristae, and lipid bilayers.

#### Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min)
- **Worked Example 1 (Paper 3 Drawing Magnification from Millimetres & Centimetres):**
  - *Problem:* In a WAEC Paper 3 examination, Specimen A (a ginger rhizome vascular bundle section) has an actual length of $A = 4.0\text{ mm}$. A candidate draws the specimen with a length of $I = 8.0\text{ cm}$. Calculate the magnification of the candidate's drawing.
  - *Step 1 (Convert drawing length $I$ from $\text{cm}$ to $\text{mm}$):*
    $$I = 8.0 \times 10 = 80.0\text{ mm}$$
  - *Step 2 (Calculate drawing magnification $M$):*
    $$M = \frac{I}{A} = \frac{80.0}{4.0} = \times 20$$
- **Worked Example 2 (Estimating Cell Length from Microscope Field of View):**
  - *Problem:* At low power ($\times 100$), the circular field of view of a school microscope has a diameter of $D_{\text{FOV}} = 1.8\text{ mm}$. When viewing an iodine-stained onion epidermis slide, $6$ brick-shaped cells placed end-to-end stretch completely across the diameter of the field of view. (a) Calculate the actual length $A$ of one onion cell in micrometres ($\mu\text{m}$). (b) If the student draws one onion cell $9.0\text{ cm}$ long, what is the magnification of the drawing?
  - *Step 1 (Convert field-of-view diameter $D_{\text{FOV}}$ from $\text{mm}$ to $\mu\text{m}$):*
    $$D_{\text{FOV}} = 1.8 \times 1000 = 1800\text{ }\mu\text{m}$$
  - *Step 2 (Actual length $A$ of one onion cell):*
    $$A = \frac{D_{\text{FOV}}}{N} = \frac{1800}{6} = 300\text{ }\mu\text{m}$$
  - *Step 3 (Convert drawing length $I = 9.0\text{ cm}$ to $\mu\text{m}$ and compute drawing magnification $M$):*
    $$I = 9.0 \times 10\,000 = 90\,000\text{ }\mu\text{m}$$
    $$M = \frac{I}{A} = \frac{90\,000}{300} = \times 300$$
- **Worked Example 3 (High-Power Field-of-View Scaling Ratio):**
  - *Problem:* A microscope has a field-of-view diameter of $D_{\text{low}} = 2000\text{ }\mu\text{m}$ when using the $\times 10$ objective lens ($M_{\text{low}} = \times 100$). When the student rotates the nosepiece to the $\times 40$ objective lens ($M_{\text{high}} = \times 400$), calculate the new field-of-view diameter $D_{\text{high}}$ and how many $250\text{ }\mu\text{m}$ cells can fit end-to-end across the high-power field.
  - *Step 1 (Magnification ratio $R_M$):*
    $$R_M = \frac{M_{\text{high}}}{M_{\text{low}}} = \frac{400}{100} = 4$$
  - *Step 2 (High-power field-of-view diameter $D_{\text{high}}$):*
    $$D_{\text{high}} = \frac{D_{\text{low}}}{R_M} = \frac{2000}{4} = 500\text{ }\mu\text{m}$$
  - *Step 3 (Number of $250\text{ }\mu\text{m}$ cells fitting across $D_{\text{high}}$):*
    $$N_{\text{high}} = \frac{D_{\text{high}}}{A} = \frac{500}{250} = 2\text{ cells}$$
