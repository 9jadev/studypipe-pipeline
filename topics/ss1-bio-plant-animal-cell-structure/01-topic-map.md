---
slug: ss1-bio-plant-animal-cell-structure
subject: Biology
class: SS1
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 5
duration_per_lesson_min: 80
---

# Topic Map: Plant and Animal Cells: Structure, Forms and the Cell's Environment

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)

| Board | What candidates must be able to do (paraphrased) |
|---|---|
| **WAEC SSCE** (Section A, all candidates) | Describe the ways living cells exist: alone (*Amoeba*, *Paramecium*, *Euglena*, *Chlamydomonas*), in colonies (*Volvox*), in filaments (*Spirogyra*), and as part of a larger organism (cheek cells, onion cells, leaf epidermis), and explain dependence vs independence. Name every cell component (wall, membrane, nucleus, cytoplasm, mitochondria, lysosomes, chloroplasts, endoplasmic reticulum, ribosomes, centrosome, Golgi body, chromosomes) and state its function. Compare plant and animal cells, usually in a table. Order the levels of organisation with examples, give the gains and costs of complexity, and link them to surface area to volume ratio. Explain diffusion, osmosis and active transport, and use the terms haemolysis, plasmolysis, turgidity and crenation. Treat nutrition as a property of cells (autotrophic *Euglena*, *Chlamydomonas*, *Spirogyra*; holozoic *Amoeba*, *Paramecium*). Outline the work of Hooke, Dujardin, Schleiden and Schwann (cell theory; Section C for Nigeria). |
| **WAEC Paper 3** | Prepare and examine stained onion epidermis and cheek cells; draw what is seen (title, size, magnification, ruled horizontal labels, no shading); state *observable* differences; calculate magnification. |
| **NECO SSCE** | Same Nigerian senior secondary content and style as WAEC; examiners favour tabulated comparisons and organelle functions. |
| **JAMB UTME** | Topic "Living organisms": identify plant and animal cell structures and their functions, compare plant and animal cells, and trace the five levels of organisation in sequence (cell: *Euglena*, *Paramecium*; tissue: epithelia, *Hydra*; organ: onion bulb; system; organism: *Chlamydomonas*). Diffusion, osmosis, plasmolysis and turgidity are tested under "Transport". |

## 2. Unit Mystery Thread & 3D Story Cast

**The case: The Wilting Ugu and the Saline Drip.**
At Mile 12 Market in Lagos, **Mama Ngozi** keeps her fluted pumpkin (*ugu*) leaves crisp by sprinkling them with clean water. One hot afternoon her nephew washes a basket in a bowl of salty water "to keep flies off", and within an hour the leaves hang limp. That same evening, at the LUTH clinic, **Dr Amaka** refuses to set up a drip of plain water for a dehydrated patient and insists on **0.9% saline** instead. **Chinedu**, an SS1 student who helps at the stall, wants to know why salt can wilt a leaf, and why water, the very thing a thirsty patient needs, could harm blood. **Coach Danjuma**, a market regular, has confident but wrong answers.

| Lesson | The piece of the mystery it unlocks |
|---|---|
| 01 | What are leaves and blood actually made of? Under a microscope, both are made of cells. |
| 02 | What is inside those cells: a wall around the leaf cell but not around the blood cell, a sap vacuole, a selectively permeable membrane. |
| 03 | Why a whole plant or a whole person depends on billions of cooperating cells (levels of organisation; why big bodies need transport). |
| 04 | **The answer**: water moves by osmosis. Salty water draws water out of ugu cells (plasmolysis, wilting); plain water rushing into red cells would make them burst (haemolysis); 0.9% saline is isotonic. |
| 05 | Proving it at the bench: the Paper 3 slides, drawings and magnification that a WAEC examiner expects. |

**StoryStage cast:** `ngozi` = Mama Ngozi (ugu seller, Mile 12 Market) · `cust1` = Chinedu (SS1 student) · `cust2` = Coach Danjuma (holds the misconceptions) · `amaka` = Dr Amaka (LUTH physician and lab tutor). Sets: market stall (Set 1) and the LUTH teaching lab (Set 2).

## 3. Unit Welcome Hub Specification

- **3D Hero Lab (`window.StudyLab`)**, built with the existing `cell-bio` kit: three modes. `cells` (a plant cell beside an animal cell, organelles labelled on tap) · `microscope` (a compound microscope; switch ×4 / ×10 / ×40 objectives and see total magnification and field of view change) · `osmosis` (a plant cell and a red cell side by side in hypotonic / isotonic / hypertonic solution).
- **Explorer tabs (4)** with a live SVG curve: *Magnification* (image size against magnification for a fixed specimen) · *Surface area : volume* (SA/V = 6/L falling with cube size) · *Osmosis* (% change in mass against solution concentration, crossing zero at the isotonic point) · *Levels of organisation* (a step chart, cell → organism).
- **6 calculation archetypes:**
  1. Drawing magnification M = drawing length ÷ actual length
  2. Microscope magnification = eyepiece × objective
  3. Actual size = image size ÷ magnification, with mm ↔ µm conversion
  4. Cell size from a field of view (cells across a known field width)
  5. Surface area : volume of a cube, SA/V = 6/L
  6. Percentage change in mass of potato strips, and the isotonic point
- **3 myth-buster flip cards:** "Hooke discovered living cells" (he saw the empty walls of dead cork) · "The cell wall is a membrane" (it is fully permeable cellulose; the membrane is the selective barrier) · "Onion cells are green because they are plant cells" (bulb scale cells grow without light and have no chloroplasts).

## 4. Multi-Lesson Breakdown

| Lesson | Title | Driving question | 3D bench (`bench.js`) | 3D zoom (`zoom.js`) | Bridge | Retrieval |
|---|---|---|---|---|---|---|
| **01** | **Discovering the Cell: Microscopes, Cell Theory and Prokaryotes vs Eukaryotes** | Ugu leaves and blood look nothing alike, so what do they share, and how do we see it? | Compound microscope bench: change objectives (×4, ×10, ×40), eyepiece ×10; view cork, onion and blood; total magnification and field of view update | Prokaryote (bacterium) beside eukaryote (plant cell): nucleus, membrane-bound organelles, ribosome size | Identify which slide came from the ugu leaf and which from the blood sample | from: 0 (JSS cells, measurement) |
| **02** | **Inside the Cell: Organelles, Plant vs Animal Cells** | What is inside the ugu cell that a blood cell lacks, and why does that matter for water? | Organelle dissector: tap organelles in a plant and an animal cell; membrane count (double / single / none) and function | Mitochondrion (cristae, matrix) and chloroplast (grana, stroma); protein route ribosome → ER → Golgi | Predict which cell can resist bursting (the one with a wall) | from: 1 |
| **03** | **Forms of Cells and Levels of Organisation** | Why can an *Amoeba* live alone in a pond while Chinedu needs a heart, lungs and blood? | Pond-water survey under the microscope (*Amoeba*, *Paramecium*, *Euglena*, *Chlamydomonas*, *Volvox*, *Spirogyra*, *Hydra*) + SA:V cube bench (L = 1–6 mm) | Colony (*Volvox*) vs tissue (*Hydra*, two layers); the ladder organelle → organism | Explain why the patient's body needs blood to deliver water at all | from: 1, 2 |
| **04** | **The Cell and Its Environment: Diffusion, Osmosis and Active Transport** | Why does salty water wilt ugu, and why must a drip be 0.9% saline, not water? | Potato-strip osmosis practical: 6 sucrose solutions (0.0–1.0 mol dm⁻³); initial and final mass; % change; graph; isotonic point | Plant cell and red cell in hypotonic / isotonic / hypertonic solution: turgid, flaccid, plasmolysed; haemolysis, crenation | **Solve the mystery**: wilting = plasmolysis; water drip = haemolysis risk; 0.9% saline = isotonic | from: 2, 3 |
| **05** | **WAEC Paper 3 Clinic: Slides, Biological Drawing and Magnification** | Can we prove what we claimed, the way an examiner will mark it? | Slide-preparation bench: onion epidermis (iodine) and cheek cells (methylene blue); cover slip at 45°; low then high power; drawing audit against the 9 examiner rules | What is truly visible at ×100 and ×400 (no mitochondria, ER or Golgi on a school slide) | Mark Chinedu's two drawings like an examiner and fix them | from: 1, 2, 3, 4 |

## 5. Unit Learning Objectives

1. **LO1 (Remember, Understand):** State the cell theory and the contributions of Hooke, Dujardin, Schleiden and Schwann; define a cell and an organelle.
2. **LO2 (Apply):** Calculate microscope magnification, drawing magnification and actual size, converting between mm and µm.
3. **LO3 (Understand):** Describe the structure and give the function of each cell component, and classify organelles by membrane (double, single, none).
4. **LO4 (Analyse):** Compare plant and animal cells, cell wall and cell membrane, and prokaryotic and eukaryotic cells in matched tables.
5. **LO5 (Understand, Analyse):** Describe free-living, colonial, filamentous and tissue-level forms; distinguish a colony from a tissue; describe autotrophic, holozoic and saprophytic nutrition in cells.
6. **LO6 (Analyse):** Arrange the levels of organisation in sequence with examples; explain the gains and costs of complexity using surface area to volume ratio.
7. **LO7 (Apply, Analyse):** Explain diffusion, osmosis and active transport; predict plasmolysis, turgidity, haemolysis and crenation; find the isotonic concentration from % mass change data.
8. **LO8 (Apply, Evaluate):** Prepare and examine onion and cheek cell slides, draw them to WAEC standard, and state observable differences.

## 6. Prerequisites & Spaced Retrieval Matrix

| Lesson | Retrieves from | Key retrieval points |
|---|---|---|
| 01 | Prerequisites (from: 0) | Living vs non-living characteristics; mm, µm and unit conversion; multiplying and dividing decimals; parts of a hand lens. |
| 02 | Lesson 01 | The three statements of cell theory; magnification = eyepiece × objective; prokaryote vs eukaryote; Hooke and cork. |
| 03 | Lessons 01–02 | Functions of nucleus, mitochondrion, chloroplast and contractile vacuole; plant-only structures; cell wall vs membrane. |
| 04 | Lessons 02–03 | Selective permeability of the membrane; the sap vacuole and tonoplast; SA:V and why *Amoeba* relies on diffusion. |
| 05 | Lessons 01–04 | Actual size = image ÷ magnification; plant vs animal observable differences; why onion cells have no chloroplasts; plasmolysis in a stained onion cell. |

## 7. Transversal Competences (L1–L7)

- **L1** thinking and learning to learn: predicting, then testing predictions on the microscope and potato benches.
- **L3** managing daily life and safety: why drips must be isotonic, safe handling of slides, cover slips, iodine and methylene blue.
- **L4** multiliteracy: reading microscope scales, % change tables and graphs, and drawing to examiner conventions.
- **L5** digital and simulation competence: 3D microscope, organelle dissector, potato-strip bench.
- **L6** working-life skills: market produce care (ugu freshness), laboratory careers (medical laboratory science, pathology).
- **L7** building a sustainable future: storing vegetables without wasteful salting; clean water and hygiene.

## 8. Exam Emphasis & Chief Examiner Traps

1. **Observable vs textbook differences (Paper 3).** "State observable differences between specimens A and B" means what can be seen on the slides in front of you, not a memorised table. Writing "A has mitochondria" for an onion slide scores zero.
2. **Drawing faults penalised every year:** no title, no magnification, wrong size, unruled or crossing guidelines, labels not horizontal, plural labels on one guideline, shading, blunt-pencil lines, cut surfaces not shown with double lines.
3. **Magnification:** total magnification is eyepiece **×** objective (never +); drawing magnification has no unit; actual size needs consistent units (mm vs µm).
4. **Membranes:** ribosomes have **no** membrane; mitochondria, chloroplasts and the nucleus have **two**; lysosomes and the tonoplast have **one**; the cell wall is **not** a membrane.
5. **Plant vs animal:** answer in a matched table ("cell wall: present | absent"). Safest animal-only answers: centrioles and glycogen granules. Plant-only: cellulose wall, chloroplasts, large sap vacuole with tonoplast.
6. **Osmosis definitions:** water moves from a dilute solution (high water potential) to a more concentrated one, through a **selectively permeable** membrane. A plant cell in water becomes turgid but does not burst (the wall); a red cell bursts (haemolysis).
7. **Unreliable answer keys:** several popular online past-question keys are wrong (e.g. mitosis gives two cells; cilia and flagella arise from basal bodies, not mitochondria). Our keys are worked out from the biology.

## 9. Known Misconceptions

| Misconception | What the unit teaches instead |
|---|---|
| Hooke discovered living cells. | He named the empty box-like walls of dead cork; Dujardin later described the living contents. |
| The cell wall controls what enters a plant cell. | The wall is fully permeable cellulose; the membrane is selectively permeable and controls entry and exit. |
| All plant cells have chloroplasts. | Cells that grow without light (onion bulb scales, root cells) have none. |
| *Volvox* is a tissue because it has many cells. | In a colony every cell is alike and nearly self-sufficient; in a tissue cells are specialised and depend on one another. |
| In osmosis, salt moves into the cell. | It is **water** that moves across the membrane, from the more dilute side to the more concentrated side. |
| A plant cell in pure water bursts like a red cell. | The cellulose wall resists the swelling, so the cell becomes turgid, not burst. |

## 10. Sources Consulted (paraphrased)

- `sources/Biology_Cell_Structure_WAEC_NECO_JAMB.pdf`: syllabus summaries (WAEC, NECO, JAMB), core notes, specimen list, Paper 3 rules and a past-question bank with flagged faulty keys. Read for scope and examiner expectations only; nothing is copied. Every scenario, number and question in this unit is new.
- WAEC Chief Examiners' reports (Biology Paper 3) as summarised in that source: the recurring drawing and "observable difference" faults listed in § 8.
