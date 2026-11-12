---
slug: ss2-bio-heart-circulation
subject: Biology
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 7
duration_per_lesson_min: 80
---

# Topic Map: The Human Heart and Blood Circulation

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)

| Board | What candidates must be able to do (paraphrased) |
|---|---|
| **WAEC SSCE** (Transport in animals, SS2) | Give reasons why large many-celled animals cannot rely on diffusion and list what blood carries. Tell open from closed circulation and single from double circulation, with named animals. Draw and label a longitudinal section through a mammalian heart and link each chamber wall, valve and great vessel to its job. Trace blood through the pulmonary, systemic, hepatic portal and coronary routes, including organ-to-organ journeys. Explain the cardiac cycle, the two heart sounds, the pacemaker and conducting tissue, pulse and blood pressure, and what raises or lowers heart rate. Compare arteries, veins and capillaries (usually as a table) and explain how tissue fluid and lymph form. State what blood is made of and what each part does, explain clotting, the ABO groups, the Rhesus factor and safe transfusion, and give the cause and prevention of common circulatory disorders. |
| **WAEC Paper 3** | Identify a sheep, goat or cow heart and its parts, cut it to show the chambers and explain the thicker left ventricle; tell an artery from a vein on a chart or slide by wall and lumen; recognise red and white cells on a smear or chart; read a stethoscope or blood-pressure instrument; draw specimens to examiner rules. |
| **NECO SSCE** | Same content as WAEC. Examiners favour "state five differences" (best answered in a matched two-column table) and "describe the course of blood from X to Y" questions. |
| **JAMB UTME** (Transport) | Quick-recall objective items on the need for transport, the materials carried, the channels (heart, arteries, veins, capillaries) and the media (blood, lymph); open vs closed systems; recognising heart parts on a diagram; pulmonary vessel exceptions; hepatic portal route; pacemaker; heart sounds; blood groups and Rhesus. Plant transport media (cell sap, xylem, phloem) belong to a separate unit and are not taught here. |

Linked areas examiners pull in: blood groups and Rhesus (also under Variation/Genetics), the lymphatic system and immunity, sickle cell and other circulatory disorders (Health). Placement: JAMB *Transport*; WAEC and NECO *Transport in animals* (mammalian circulatory system). Section numbers change between syllabus editions, so none are quoted.

## 2. Unit Mystery Thread & 3D Story Cast

**The case: Three Readings on Health Day at Oja Oba.**
On a free health-screening Saturday at Oja Oba market in Ibadan, **Dr Aisha**, a heart specialist from UCH, sets up a tent with a stethoscope, a blood-pressure cuff and a whiteboard. Three cases end up on her board before noon:
1. **Chidi**, an SS2 student and school footballer, races the length of the market to fetch her a cable. His wrist pulse goes from 68 to 132 beats per minute, and through the stethoscope she hears a pounding "lub-dub". Within five minutes it is almost back to normal.
2. **Mama Bisi**, who sells pepper and stands at her stall from dawn to dusk, has puffy ankles that hold a thumb dent, lumpy blue veins on her calves and a reading of 160/100 mmHg.
3. An **okada rider** is carried in after a crash on the Oyo road, bleeding from a deep gash. His donor card says group **B, Rhesus negative**. The blood-bank cool box that the ambulance brings holds six bags: O+, O−, A−, B+, B− and AB−.

**Baba Sule**, the butcher next to the tent, follows every case with loud opinions that are often wrong ("the thick side of the heart is the right side", "blue blood is in the veins", "AB can give to everybody"). He also supplies a fresh goat heart for dissection. The unit question on Dr Aisha's board: **What keeps blood moving, delivering and safe, and what has gone right or wrong in each of the three cases?**

| Lesson | The piece of the mystery it unlocks |
|---|---|
| 01 | Why Chidi needs a heart and blood at all, when a pond *Amoeba* manages without (SA:V, closed double circulation). |
| 02 | What the pump looks like inside: Baba Sule's goat heart, the thick left ventricle, the valves (and why he has the sides wrong). |
| 03 | The route blood takes: why the okada rider's donated blood must pass the lungs before reaching his brain, and why food from the gut visits the liver first. |
| 04 | Why Chidi's pulse leapt and recovered (pacemaker, cardiac cycle, heart sounds, cardiac output). **Case 1 closed.** |
| 05 | Why Mama Bisi's ankles swell (vessel structure, capillary pressure, tissue fluid, lymph, faulty vein valves). **Case 2 explained.** |
| 06 | Why the rider's wound eventually sealed and what he lost (blood composition, clotting). |
| 07 | **The answer**: which bags are safe for a B Rh− patient, why Mama Bisi's pressure is a danger, and how to keep a heart healthy. **Case 3 closed; whole case file solved.** |

**StoryStage cast:** `ngozi` = Mama Bisi (pepper seller, Oja Oba) · `cust1` = Chidi (SS2 student and footballer) · `cust2` = Baba Sule (butcher; carries the misconceptions) · `amaka` = Dr Aisha (UCH heart specialist and lab tutor). Sets: the market screening tent (Set 1) and the UCH teaching lab (Set 2).

## 3. Unit Welcome Hub Specification

- **3D Hero Lab (`window.StudyLab`)**, built with the existing `heart-circulation` kit (`HeartKit` v2), three modes:
  - `heart`: `HeartKit.heart({ mode: "both" })`, the four-chamber cut-away with blood flow; tap a part for name and job.
  - `circuit`: `HeartKit.circuitCompare({ mode: "double" })` with a toggle to `single` (fish) and `open` (insect).
  - `pace`: `HeartKit.heart({ mode: "pace" })`, the SAN → AVN → bundle of His → Purkinje spark; slider 60–180 bpm; HUD shows bpm, cycle time (60 ÷ bpm) and valve state.
- **Explorer tabs (4)** with a live SVG curve: *Surface area : volume* (6/L falling as cube side grows) · *Pulse recovery* (smooth curve of heart rate against minutes after exercise) · *Pressure along the circuit* (smooth curve falling from aorta to vena cava) · *Capillary filtration* (Pc falling along a capillary against a flat πc line; the crossing point marks where filtration turns into reabsorption).
- **6 calculation archetypes:**
  1. SA : V of a cube, 6/L, with a unit conversion
  2. Heart rate from a timed pulse count, and cycle time = 60 ÷ heart rate
  3. Cardiac output = heart rate × stroke volume, cm³ → dm³
  4. Net filtration pressure = Pc − πc at both ends of a capillary
  5. Blood speed from flow = area × speed (aorta vs capillary bed)
  6. Red cell count from a haemocytometer, and actual size = image ÷ magnification
- **3 myth-buster flip cards:** "Arteries carry oxygenated blood, veins carry deoxygenated blood" (direction from the heart decides; the pulmonary pair breaks the oxygen rule) · "On a heart diagram the left ventricle is on your left" (the drawing faces you, so the patient's left is on your right) · "AB is the universal donor" (O gives to all four ABO groups; AB receives from all four).

## 4. Multi-Lesson Breakdown

| Lesson | Title | Driving question | 3D bench (`bench.js`) | 3D zoom (`zoom.js`) | Bridge | Retrieval |
|---|---|---|---|---|---|---|
| **01** | **Why Big Bodies Need a Transport System: Open, Closed, Single and Double Circulation** | An *Amoeba* has no heart, so why does Chidi need one? | Agar-cube diffusion practical: phenolphthalein-alkali agar cubes (5, 10, 20, 30 mm) in dilute acid; % volume cleared after 8 min against SA:V (`HeartKit.cube`) | `circuitCompare`: open (cockroach) → single (tilapia) → double (human); flow and pressure shown | Explain why Chidi's sprint would be impossible on diffusion or on a fish-style circuit | from: 0 (SS1 cells, diffusion, SA:V) |
| **02** | **The Heart Up Close: Chambers, Walls, Valves and the Goat-Heart Dissection** | Baba Sule says the thick side is the right side. Who is right? | Goat-heart dissection bench (`heart`, `dissect` mode): cut, identify, measure wall thickness of RA, LA, RV, LV, septum | Valve close-up (`HeartKit.valve`): cusps opening, chordae tendineae stopping inversion; 3 vs 2 cusps | Label the goat heart correctly and settle the "thick side" argument | from: 1 |
| **03** | **The Double Circuit: Tracing Blood Around the Body** | How does the rider's donated blood reach his brain, and why does food from the gut go to the liver first? | Route-tracer bench: tap vessels and valves in order on the 3D heart and body map (`heart`, `both` mode); wrong taps flash | Hepatic portal and coronary zoom: gut → liver capillaries → hepatic vein; aorta → coronary arteries → heart muscle | Trace drip in the rider's arm → brain, naming every valve and vessel | from: 1, 2 |
| **04** | **The Beating Heart: Cardiac Cycle, Heart Sounds, Pacemaker, Pulse and Blood Pressure** | Why did Chidi's pulse leap to 132 and then settle again? | Pulse-rate practical: 15 s counts at rest and each minute for 5 min after 2 min of step-ups; plot recovery curve | Conduction and cycle zoom (`heart`, `pace` and `sys` modes): SAN spark, AV delay, valves opening and shutting with LUB and DUB | **Case 1 closed**: explain Chidi's readings | from: 1, 2, 3 |
| **05** | **Arteries, Veins, Capillaries, Tissue Fluid and Lymph** | Why do Mama Bisi's ankles swell after a day of standing? | Two stations: vessel cross-section slides measured with an eyepiece graticule (`vessels`); capillary pressure probe at 5 points (`capillaryBed`) | Capillary bed: filtration out at the arterial end, return at the venous end, blind-ended lymph capillary, oedema mode | **Case 2 explained**: raised venous-end pressure and faulty valves → oedema | from: 2, 3, 4 |
| **06** | **Blood: Plasma, Cells and Clotting** | The rider's cut finally stopped oozing. What sealed it, and what did he lose? | Blood smear and haemocytometer bench (`bloodSmear`): identify cells at ×400, count red cells in 5 squares, measure a red cell | Clotting cascade zoom (`bloodSmear` with `clot`): thromboplastin → thrombin → fibrin mesh trapping red cells | Explain the sealed wound and why the rider still needs a transfusion | from: 3, 4, 5 |
| **07** | **Blood Groups, Rhesus, Transfusion and Disorders: Closing the Case** | Which of the six bags can save a B Rh− rider, and how great a danger is Mama Bisi's 160/100? | ABO and Rhesus typing tile: anti-A, anti-B, anti-D sera on the rider's and four donors' samples; read clumping | Antigen–antibody zoom (video kit `blood`, ABO scene, as reference; 3D: `bloodSmear` clumped vs free cells) | **Whole case file solved**: safe bags (O−, B−), hypertension advice, healthy-heart plan | from: 1, 4, 5, 6 |

## 5. Unit Learning Objectives

1. **LO1 (Understand, Apply):** Explain why large active animals need a transport system, using SA:V calculations, and list the materials blood carries.
2. **LO2 (Analyse):** Compare open and closed, and single and double, circulation with named animals, and state the advantages of double circulation.
3. **LO3 (Remember, Understand):** Name and locate the coverings, chambers, septum, valves, chordae tendineae and great vessels of the mammalian heart, and relate wall thickness to the distance blood is pumped.
4. **LO4 (Apply):** Draw and label a longitudinal section of the heart to WAEC rules and calculate drawing magnification and actual size.
5. **LO5 (Apply, Analyse):** Trace the pulmonary, systemic, hepatic portal and coronary routes, and any organ-to-organ journey, naming every valve and vessel.
6. **LO6 (Understand, Apply):** Describe the cardiac cycle, the heart sounds and the conducting system; calculate heart rate, cycle time and cardiac output; explain pulse, blood pressure and factors changing heart rate.
7. **LO7 (Analyse):** Tabulate differences between arteries, veins and capillaries; explain tissue fluid formation with net filtration pressure, and the roles of the lymphatic system.
8. **LO8 (Understand, Apply):** Describe the composition of blood, the structure and functions of each cell type and the clotting sequence; calculate cell counts and sizes.
9. **LO9 (Apply, Evaluate):** Predict ABO and Rhesus compatibility, explain haemolytic disease of the newborn, and give cause, symptom and prevention for major circulatory disorders.

## 6. Prerequisites & Spaced Retrieval Matrix

| Lesson | Retrieves from | Key retrieval points |
|---|---|---|
| 01 | Prerequisites (from: 0) | Diffusion and what drives it; SA:V = 6/L from SS1; aerobic respiration needs oxygen and glucose; mm ↔ cm ↔ m. |
| 02 | Lesson 01 | Why diffusion fails in big bodies; open vs closed; single vs double; what blood carries. |
| 03 | Lessons 01–02 | Four chambers and what each receives and sends; four valves and their sides; thick LV and why. |
| 04 | Lessons 01–03 | Pulmonary and systemic routes; the pulmonary vessel exceptions; valve positions; chordae tendineae. |
| 05 | Lessons 02–04 | Why the LV is thick; pulse as the artery's stretch and recoil; 120/80 mmHg; hepatic portal vein. |
| 06 | Lessons 03–05 | Capillaries as the exchange site; tissue fluid lacks red cells and most proteins; lymph returns to the subclavian vein; route questions. |
| 07 | Lessons 01, 04–06 | Plasma proteins (antibodies); clotting vs clumping; blood pressure and heart rate; functions of blood. |

## 7. Transversal Competences (L1–L7)

- **L1** thinking and learning to learn: predicting pulse, cube and filtration results before testing them; correcting Baba Sule's claims with evidence.
- **L3** managing daily life and safety: safe dissection and lancet use, first aid for bleeding, blood screening, healthy heart habits, genotype and Rhesus awareness.
- **L4** multiliteracy: heart diagrams in front view, cross-sections, pulse and pressure graphs, typing tiles, examiner drawing rules.
- **L5** digital and simulation competence: 3D heart, valve, capillary and blood benches.
- **L6** working-life skills: careers in nursing, medical laboratory science, cardiology and blood banking at Nigerian teaching hospitals.
- **L7** building a sustainable future: voluntary blood donation, community screening days, salt-light diets.

## 8. Exam Emphasis & Chief Examiner Traps

1. **Sides on the diagram.** In front view the patient's right is on the reader's left. The right atrium and right ventricle are drawn on the left of the page; the thick left ventricle is on the right.
2. **Valve names.** Tricuspid on the right (memory hook "tRi = Right"), bicuspid (mitral) on the left, semilunar valves at the bases of the aorta and pulmonary artery. Swapping them is the commonest lost mark.
3. **Artery and vein defined by direction**, not oxygen. A full answer names the exceptions: the pulmonary artery carries deoxygenated blood; the pulmonary veins carry oxygenated blood.
4. **Route questions must pass the lungs.** Any journey from one body organ to another goes right half of the heart → lungs → left half. Blood from the gut goes to the liver by the hepatic portal vein first, never straight to the heart.
5. **"Differences" questions** are answered in a matched two-column table, one feature per row, both columns filled.
6. **Universal donor and recipient.** O is the universal donor; AB is the universal recipient. Rhesus trouble in pregnancy needs an Rh− mother and an Rh+ baby.
7. **Clotting is not clumping.** Clotting turns fibrinogen into fibrin threads at a wound; agglutination is red cells clumping when an antigen meets the antibody that fits it.
8. **Heart sounds.** "Lub" is the atrioventricular valves closing; "dub" is the semilunar valves closing. Neither is the sound of a chamber contracting.
9. **Drawing rules.** Title in capitals, at least half a page, clean unshaded lines, ruled horizontal label lines without arrowheads, thicker left ventricle wall, flow arrows only inside the heart.

## 9. Known Misconceptions

| Misconception | What the unit teaches instead |
|---|---|
| Arteries carry oxygenated blood and veins carry deoxygenated blood. | Direction from the heart decides; the pulmonary artery and veins break the oxygen pattern. |
| Blood in veins is blue. | Deoxygenated blood is dark red; veins look blue through skin because of how light passes through tissue. |
| The brain starts every heartbeat. | Heart muscle is myogenic: the SAN starts each beat; nerves and adrenaline only change the rate. |
| The heart muscle feeds on the blood inside its chambers. | It is supplied by the coronary arteries, the first branches of the aorta. |
| The right side of the heart is thicker because it does more work. | The left ventricle is about three times thicker because it pumps to the whole body; the right only pumps to the lungs. |
| Fish blood goes round the heart two times per lap. | Fish have single circulation: heart → gills → body → heart. |
| Tissue fluid, lymph and plasma are the same thing. | Tissue fluid and lymph lack red cells and most plasma proteins; lymph carries many lymphocytes and, after a meal, fats. |
| AB is the universal donor. | O is the universal donor; AB is the universal recipient. |
| An Rh+ mother with an Rh− baby is at risk. | The risk is an Rh− mother carrying an Rh+ baby, usually in a later pregnancy. |

## 10. Sources Consulted (paraphrased)

- `sources/The Human Heart and Blood Circulation — WAEC, NECO & JAMB Study Guide.pdf`: syllabus summary for the three boards, core notes, a recurring-question bank and JAMB-style items. Read for scope and examiner expectations only; nothing is copied, and every scenario, number and question in this unit is new.
- Standard physiology teaching values not in the source (capillary flow speed about 0.03–0.04 cm/s, roughly a thousand times slower than in the aorta; capillary hydrostatic pressures near 35 → 15 mmHg against a plasma protein osmotic pressure near 25 mmHg). The exact figures used (0.035 cm/s; 36 and 16 mmHg for a skeletal-muscle bed) are approximate textbook teaching values.
