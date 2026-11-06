---
slug: ss2-bio-heart-circulation
subject: Biology
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 5
duration_per_lesson_min: 80
---

# Topic Map: The Human Heart and Blood Circulation

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)

This 5-lesson SS2 Biology unit covers **Transport in Mammals (The Human Heart, Blood Vessels, Blood, Lymphatic System, and Circulatory Disorders)** across all three Nigerian examination boards, rewritten in 100% original language:

| Exam Board | Syllabus Section | Core Competencies & Assessment Focus (Paraphrased) |
|---|---|---|
| **WAEC SSCE** | Section B / SS2: Transport in Animals & Mammalian Circulatory System | Explain why multicellular animals require an internal transport system; compare open and closed circulatory systems and single vs double circulation; draw and label the longitudinal section of the mammalian heart; relate chamber wall thickness and valve structure to function; trace the pathway of blood through pulmonary, systemic, coronary, and hepatic portal circuits; tabulate structural and functional differences between arteries, veins, and capillaries; describe the composition and functions of blood, tissue fluid, and lymph; explain the enzymatic blood-clotting cascade, ABO and Rhesus blood group compatibility, and cardiovascular disorders; identify dissected mammalian heart specimens and blood-vessel transverse sections in Paper 3 Practical. |
| **NECO SSCE** | Transport in Animals (Circulatory System in Mammals) | High emphasis on structured tabular comparisons (*"State five differences between an artery and a vein"*, *"Compare blood, tissue fluid, and lymph"*), step-by-step blood pathway tracing from one organ to another (always passing through the heart and lungs), explaining the myogenic heartbeat (SAN, AVN, Bundle of His, Purkinje fibres), and drawing a clean, unshaded longitudinal section of the heart with ruled horizontal label lines. |
| **JAMB UTME** | Transport: Need for Transport, Channels, Media & Mechanisms | Rapid-recall and analytical MCQs on surface-area-to-volume scaling ($\text{SA}/\text{V} = 6/L$), open vs closed systems (cockroach/snail vs earthworm/tilapia/mammal), pulmonary artery and pulmonary vein exceptions, hepatic portal vein routing (ileum $\rightarrow$ liver), cardiac cycle timing ($\text{CO} = \text{HR} \times \text{SV}$), clotting cofactors ($\text{Ca}^{2+}$, Vitamin K, thromboplastin, prothrombin, thrombin, fibrinogen, fibrin), and ABO/Rhesus blood transfusion compatibility. |

---

## 2. Unit Mystery Thread & 3D Story Cast

- **Unit Anchor Phenomenon ("The Surulere Stadium Sprint, Coach Danjuma's Stethoscope & LUTH Blood Bank Emergency"):**
  During the Lagos State Inter-Collegiate 400 m final at Teslim Balogun Stadium in Surulere, 16-year-old SS2 sprinter **Chinedu** finishes in $51\text{ s}$. When Sports Physician **Dr. Halima** places her stethoscope on Chinedu's chest and wraps a sphygmomanometer cuff around his arm, his heart rate has jumped from $70\text{ bpm}$ at rest to $175\text{ bpm}$, his blood pressure reads $155/85\text{ mmHg}$, and a loud *"Lub-Dub"* echoes twice every second. Meanwhile, across the road at LUTH Idi-Araba Emergency Ward, a road-traffic accident patient of **Blood Group B ($\text{Rh}^-$)** urgently needs a blood transfusion, while a butcher at Surulere Market shows **Nurse Kemi** a freshly dissected goat heart whose left ventricular wall is three times thicker than its right wall.
  - **Question 1 (Lesson 01):** Why can a tiny pond *Amoeba* get all its oxygen by simple diffusion without a heart or blood, while a cockroach uses low-pressure open haemolymph, a *Tilapia* fish uses a 2-chambered single-circuit heart, and Chinedu needs a high-pressure 4-chambered double-circulation pump moving $17.5\text{ L/min}$ during a sprint?
  - **Question 2 (Lesson 02):** Why is the muscular wall of the left ventricle three times thicker than the right ventricle in the goat and human heart, how do the tricuspid, bicuspid, and semilunar valves (plus chordae tendineae) enforce strictly one-way flow, and why must glucose absorbed in Chinedu's ileum pass through the liver via the hepatic portal vein before reaching his heart?
  - **Question 3 (Lesson 03):** What makes the heart beat on its own even outside the body (myogenic SAN $\rightarrow$ AVN $\rightarrow$ Bundle of His $\rightarrow$ Purkinje fibres), what produces the *"Lub"* and *"Dub"* stethoscope sounds during a $0.8\text{ s}$ cardiac cycle, and how do we calculate Cardiac Output ($\text{CO}$), Pulse Pressure ($\text{PP}$), and Mean Arterial Pressure ($\text{MAP}$)?
  - **Question 4 (Lesson 04):** How do thick-walled elastic arteries, wide-lumened valved veins, and one-cell-thick capillaries work together so hydrostatic pressure ($P_c$) filters plasma into tissue fluid at the arterial end while osmotic pressure ($\pi_c$) and lymphatic vessels return it without causing oedema?
  - **Question 5 (Lesson 05):** How do biconcave anucleate erythrocytes, phagocytes, lymphocytes, and platelets (via the thromboplastin–thrombin–fibrin cascade) keep Chinedu alive, which donor bags at LUTH Blood Bank are safe for a Group B ($\text{Rh}^-$) patient without causing fatal agglutination, and how do we score $10/10$ on a WAEC Paper 3 heart dissection and biological drawing?

- **Recurring 3D Story Cast (`StoryStage`):**
  - **Nurse Kemi (`ngozi`):** Senior Cardiovascular Nurse Educator at Surulere Sports Clinic & Market Outreach.
  - **Chinedu (`cust1`):** Curious SS2 400 m sprinter and Biology student preparing for WAEC and JAMB.
  - **Coach Danjuma (`cust2`):** Veteran athletics coach who holds several common misconceptions about heart chambers, veins, and blood groups.
  - **Dr. Halima (`amaka`):** Consultant Cardiologist & Haematologist at LUTH Idi-Araba Physiology & Blood Bank Lab.

---

## 3. Unit Welcome Hub Specification (`html/index.html`)

- **Hero 3D Lab (`welcome-lab.js` / `window.StudyLab`):**
  - Interactive **3D Beating Mammalian Heart & Double-Circulation Cut-Away Stage** built with `window.HeartKit`:
    - Mode 1: **4-Chamber Heart Cut-Away** (RA, RV, LA, LV with $3\times$ thicker LV wall, interventricular septum, tricuspid & bicuspid valves with chordae tendineae, pulmonary & aortic semilunar valves, venae cavae, pulmonary artery, pulmonary veins, and aortic arch with coronary branches).
    - Mode 2: **Pulmonary vs Systemic Double Circuit** (animated deoxygenated blue RBCs flowing $\text{RA} \rightarrow \text{RV} \rightarrow \text{Lungs}$ and oxygenated crimson RBCs flowing $\text{Lungs} \rightarrow \text{LA} \rightarrow \text{LV} \rightarrow \text{Aorta} \rightarrow \text{Body}$).
    - Mode 3: **Rest ($72\text{ bpm}$) vs Sprint ($160\text{ bpm}$) Pacemaker Wave** (live SAN $\rightarrow$ AVN $\rightarrow$ Purkinje electrical glow + live $\text{HR}$, $\text{SV}$, and $\text{CO}$ readout).
- **Interactive Concept Explorer (`#explorer`):**
  - 4 interactive tabs with dynamic SVG pressure/volume curve:
    1. *Cardiac Cycle & Valve Timing ($0.80\text{ s}$ at $75\text{ bpm}$)*
    2. *Double Circulation & Organ Pathways (Pulmonary, Systemic & Hepatic Portal)*
    3. *Artery $\rightarrow$ Capillary $\rightarrow$ Vein Pressure & Velocity Profile*
    4. *Blood Clotting Cascade & ABO/Rhesus Compatibility*
- **6 Calculation Archetypes (`#archetypes`):**
  1. Surface-Area-to-Volume Ratio & Diffusion Limit ($\text{SA}/\text{V} = 6/L$)
  2. Cardiac Output & Sprint Reserve ($\text{CO} = \text{HR} \times \text{SV}$)
  3. Cardiac Cycle Period & Phase Durations ($T = 60/\text{HR}$)
  4. Stroke Volume & Ejection Fraction ($\text{SV} = \text{EDV} - \text{ESV}$, $\text{EF} = \frac{\text{SV}}{\text{EDV}}\times 100\%$)
  5. Pulse Pressure, Mean Arterial Pressure & Capillary Filtration ($\text{PP} = P_{\text{sys}} - P_{\text{dia}}$, $\text{NFP} = P_c - \pi_c$)
  6. WAEC Paper 3 Heart Drawing Magnification & Haemocytometer Cell Count ($M = I / A$)
- **3 Myth-Buster Flip Cards (`#myths`):**
  - *Myth 1:* "All arteries carry oxygenated blood and all veins carry deoxygenated blood." $\rightarrow$ **Truth:** Arteries are defined by direction (**away** from the heart) and veins by flow **toward** the heart. The **pulmonary artery** carries deoxygenated blood to the lungs, while the **pulmonary veins** carry oxygenated blood to the left atrium!
  - *Myth 2:* "On a front-view diagram of the heart, the left ventricle is drawn on the left-hand side of your paper." $\rightarrow$ **Truth:** Anatomical diagrams show the patient facing you! The patient's **right atrium and right ventricle** are on the viewer's **left**, and the thick-walled **left ventricle** is on the viewer's **right**.
  - *Myth 3:* "Blood Group AB is the universal donor because it has both A and B antigens." $\rightarrow$ **Truth:** **Blood Group O** is the **universal red-cell donor** because its RBCs carry neither Antigen A nor Antigen B. **Blood Group AB** is the **universal recipient** because its plasma contains neither anti-a nor anti-b antibodies!

---

## 4. Multi-Lesson Breakdown (Lessons 01 to 05)

| Lesson | Title | Driving Inquiry Question | 3D Virtual Lab Bench (`bench.js`) | 3D Concept Zoom (`zoom.js`) | Spaced Retrieval (`from`) |
|---|---|---|---|---|---|
| **Lesson 01** | **Need for Transport: Open vs Closed & Single vs Double Circulation** | Why can't large active animals rely on simple diffusion, and why does a 4-chambered double circulation outperform open and single-circuit systems? | **3D Comparative Circulation & SA/V Scaling Bench:** Measure diffusion core starvation across cube sizes $L = 1\text{–}6\text{ mm}$ and compare flow rate & systemic pressure across Cockroach (open), Tilapia (single), and Mammal (double). | **3D Single (2-Chamber Fish) vs Double (4-Chamber Mammal) Circuit Zoom:** Live pressure-drop comparison across gill capillaries vs pulmonary + systemic loops. | Prerequisite foundations (`from: 0`) |
| **Lesson 02** | **Structure of the Mammalian Heart & The Double-Circulation Pathway** | Why is the left ventricle wall three times thicker than the right, how do heart valves prevent backflow, and how does blood travel from the ileum to the brain? | **3D Mammalian Heart Dissector & Chamber Pressure Bench:** Measure wall thickness ($w$) and peak systolic pressure ($P$) across RA, LA, RV, and LV under normal, athletic-hypertrophy, and septal-defect conditions. | **3D Valve & Portal Pathway Zoom:** Tricuspid/Bicuspid chordae tendineae mechanics + live 3D tracer for Pulmonary, Systemic, Coronary, and Hepatic Portal routes. | Pulls 4 cards from **Lesson 01** (`from: 1`) |
| **Lesson 03** | **Working of the Heart: Cardiac Cycle, Pacemaker (SAN/AVN), Heart Sounds & Blood Pressure** | How does the heart generate its own electrical rhythm, what causes the *"Lub-Dub"* sounds, and how do HR and SV control Cardiac Output during exercise? | **3D Cardiac Cycle, Stethoscope & Sphygmomanometer Bench:** Record Heart Rate ($\text{HR}$), Stroke Volume ($\text{SV}$), and Cardiac Output ($\text{CO} = \text{HR}\times\text{SV}$) across 5 activity levels (Sleep $\rightarrow$ Sprint) under normal, sympathetic/adrenaline, and vagal-tone conditions. | **3D Electrical Conduction & Cardiac Cycle Phase Zoom:** Live SAN $\rightarrow$ AVN $\rightarrow$ Bundle of His $\rightarrow$ Purkinje impulse wave + $0.8\text{ s}$ systole/diastole valve timing. | Pulls 4 cards from **Lessons 01–02** (`from: 1, 2`) |
| **Lesson 04** | **Blood Vessels, Capillary Exchange, the Lymphatic System & Cardiovascular Disorders** | How are arteries, veins, and capillaries structurally adapted to their roles, and how does plasma become tissue fluid and lymph without causing oedema? | **3D Blood Vessel Hemodynamics & Capillary Ultrafiltration Bench:** Measure hydrostatic pressure ($P_c$), blood velocity, and net filtration pressure ($\text{NFP} = P_c - \pi_c$) across 5 points from Aorta $\rightarrow$ Vena Cava under normal, hypertensive, and protein-deficient (oedema) conditions. | **3D Artery vs Vein vs Capillary & Lymphatic Bed Zoom:** Tunica media/lumen cross-sections, venous pocket valves + skeletal muscle pump, and capillary-to-lymphatic fluid exchange. | Pulls 4 cards from **Lessons 01–03** (`from: 2, 3`) |
| **Lesson 05** | **Blood Composition, Clotting Cascade, ABO/Rhesus Groups & WAEC Paper 3 Practical Clinic** | How do blood cells, clotting factors, and ABO/Rhesus antigens protect life, and how do we master WAEC Paper 3 heart specimens and biological drawings? | **3D Blood Smear Microscopy, Coagulation & ABO/Rhesus Cross-Match Bench:** Measure drawing magnification ($M = I / A$), test ABO/Rhesus donor-recipient pairs for agglutination, and audit WAEC heart drawings across 5 specimens. | **3D Erythrocyte, Leucocyte, Fibrin Clot & ABO Antigen-Antibody Zoom:** Biconcave RBC $\text{HbO}_2$ loading, thrombin-fibrin mesh formation, and Antigen-Antibody clumping vs safe transfusion. | Pulls 4 cards from **Lessons 01–04** (`from: 1, 2, 3, 4`) |

---

## 5. Unit Learning Objectives (with Bloom Level)

1. **LO1 (Understand & Apply):** Explain why large multicellular animals require a specialised transport system using surface-area-to-volume ratio ($\text{SA}/\text{V} = 6/L$), and compare open vs closed and single vs double circulatory systems with named Nigerian animal examples.
2. **LO2 (Understand & Analyse):** Identify the external and internal structures of the mammalian heart (pericardium, myocardium, endocardium, septum, 4 chambers, 4 valves, chordae tendineae, papillary muscles, and attached great vessels) and relate wall-thickness differences to pressure requirements.
3. **LO3 (Apply & Analyse):** Trace the complete step-by-step pathway of blood through the pulmonary, systemic, coronary, and hepatic portal circulations between any two named body organs.
4. **LO4 (Understand & Apply):** Describe the myogenic electrical conduction system of the heart ($\text{SAN} \rightarrow \text{AVN} \rightarrow \text{Bundle of His} \rightarrow \text{Purkinje fibres}$), the phases of the $0.8\text{ s}$ cardiac cycle, the origin of *"Lub"* and *"Dub"* heart sounds, and calculate Cardiac Output ($\text{CO} = \text{HR} \times \text{SV}$), cardiac period ($T = 60/\text{HR}$), Ejection Fraction ($\text{EF}$), and Pulse Pressure ($\text{PP}$).
5. **LO5 (Analyse):** Compare the structure and function of arteries, veins, and capillaries, identify the major named arteries and veins supplying key organs, explain tissue fluid formation by ultrafiltration and lymphatic return, and analyse the causes and prevention of major cardiovascular disorders.
6. **LO6 (Apply & Evaluate):** Describe the composition and functions of mammalian blood (plasma, erythrocytes, phagocytes, lymphocytes, platelets), explain the 4-stage enzymatic blood-clotting cascade, predict ABO and Rhesus blood transfusion compatibility, and produce WAEC-compliant biological drawings and magnification calculations ($M = I / A$).

---

## 6. Prerequisites & Spaced Retrieval Matrix

| Target Lesson | Prerequisite / Earlier Lesson Retrieved (`retrieval-bank.js`) | Key Retrieval Concepts |
|---|---|---|
| **Lesson 01** | SS1 Cell Structure & Diffusion (`from: 0`) | Diffusion definition, selective permeability, cell-to-system hierarchy, aerobic respiration demand for $\text{O}_2$ and glucose. |
| **Lesson 02** | Lesson 01 (`from: 1`) | $\text{SA}/\text{V} = 6/L$ scaling, open vs closed circulation (haemocoel vs vessels), single vs double circulation, $\text{CO} = \text{HR} \times \text{SV}$. |
| **Lesson 03** | Lessons 01–02 (`from: 1, 2`) | Left vs right ventricle wall thickness, tricuspid vs bicuspid valves & chordae tendineae, pulmonary artery/vein exception, hepatic portal vein route. |
| **Lesson 04** | Lessons 02–03 (`from: 2, 3`) | $\text{SAN} \rightarrow \text{AVN} \rightarrow \text{Bundle of His} \rightarrow \text{Purkinje}$ pathway, *"Lub"* vs *"Dub"* valve closures, $\text{CO} = \text{HR} \times \text{SV}$, systolic/diastolic blood pressure ($120/80\text{ mmHg}$). |
| **Lesson 05** | Lessons 01–04 (`from: 1, 2, 3, 4`) | Artery vs vein vs capillary structure, renal/hepatic/carotid vessels, capillary ultrafiltration & lymph return to subclavian vein, hypertension & sickle-cell anaemia. |

---

## 7. Transversal Competences (`L1`–`L7`)

- **L1 (Thinking and learning to learn):** Connecting physical scaling laws ($\text{SA}/\text{V} = 6/L$, pressure-flow mechanics, and net filtration pressure $\text{NFP} = P_c - \pi_c$) to biological anatomy.
- **L3 (Managing daily life and safety):** First-aid bleeding control, blood pressure awareness ($120/80\text{ mmHg}$), genotype/Rhesus counselling before marriage and childbirth, and safe screened blood transfusion practices.
- **L4 (Multiliteracy):** Reading ECG/pacemaker waves, Wiggers pressure curves, ABO cross-match matrices, vessel histological cross-sections, and WAEC biological drawing conventions.
- **L5 (Digital and simulation competence):** Manipulating 3D interactive heart chambers, valve cycles, capillary beds, and haemocytometer slides across 5 virtual lab benches.
- **L6 (Working-life skills and entrepreneurship):** Connecting secondary-school Biology to clinical careers in cardiology, nursing, medical laboratory science, and haematology at Nigerian teaching hospitals (LUTH, UCH, UNTH, ABUTH).

---

## 8. Exam Emphasis & Chief Examiner Traps

1. **Right vs Left on Heart Diagrams:** In a ventral (front) view of the mammalian heart, the right atrium and right ventricle are on the **left side of the page**, and the left atrium and left ventricle are on the **right side of the page**. Swapping them loses all label marks.
2. **Tricuspid vs Bicuspid ("Right = tRi"):** Candidates frequently swap the atrioventricular valves. **Tricuspid** is on the **right** ($\text{RA} \rightarrow \text{RV}$); **Bicuspid (Mitral)** is on the **left** ($\text{LA} \rightarrow \text{LV}$).
3. **Defining Arteries and Veins:** Never define an artery as *"a vessel that carries oxygenated blood"*. Define an **artery** as a vessel that carries blood **away from the heart**, and a **vein** as a vessel that carries blood **toward the heart**, then state the pulmonary exceptions.
4. **Skipping the Lungs or Liver in Pathway Questions:** Any blood pathway from one systemic organ (e.g., ileum or kidney) to another systemic organ (e.g., brain or leg) **must** pass through the right side of the heart $\rightarrow$ **lungs** $\rightarrow$ left side of the heart. Blood leaving the stomach/intestines **must** first pass through the **hepatic portal vein** to the **liver** before entering the hepatic vein and inferior vena cava.
5. **Clotting vs Agglutination:** Blood **clotting** (coagulation) is the conversion of soluble plasma **fibrinogen** into insoluble **fibrin** threads via thromboplastin, $\text{Ca}^{2+}$, Vitamin K, and thrombin. **Agglutination** is the antigen-antibody clumping of red blood cells in an incompatible blood transfusion. Never confuse the two!
6. **WAEC Paper 3 Drawing Rules:** Drawings must have a capitalised title underneath (e.g., *DIAGRAM OF THE LONGITUDINAL SECTION OF THE MAMMALIAN HEART*), continuous sharp pencil outlines, zero shading, horizontal ruled label lines that never cross and have **no arrowheads**, a visibly thicker left ventricular wall, and stated magnification ($M = \times 1\text{ to }\times 2$).

---

## 9. Known Misconceptions

| Student Misconception | Scientific Reality Taught in Unit |
|---|---|
| "The heart muscle gets its oxygen directly from the blood inside its four chambers." | The myocardium is too thick for diffusion from the chambers; it receives oxygenated blood via the **coronary arteries** branching off the base of the aorta. |
| "The brain initiates every single heartbeat via nerves." | Cardiac muscle is **myogenic** — the **Sinoatrial Node (SAN)** initiates each beat autonomously; nerves and adrenaline only speed up or slow down the rate. |
| "Tissue fluid, lymph, and blood plasma are identical." | Red blood cells and most large plasma proteins remain inside capillaries; tissue fluid and lymph lack erythrocytes and have very low plasma protein concentration. |
| "An $\text{Rh}^+$ mother carrying an $\text{Rh}^-$ baby causes haemolytic disease of the newborn." | Erythroblastosis foetalis occurs when an **$\text{Rh}^-$ mother** is sensitised by an **$\text{Rh}^+$ foetus** and produces anti-Rh (anti-D) antibodies that cross the placenta in a subsequent $\text{Rh}^+$ pregnancy. |

---

## 10. Sources Consulted (Paraphrased)

- Uploaded study guide in `topics/ss2-bio-heart-circulation/sources/` (*The Human Heart and Blood Circulation — WAEC, NECO & JAMB Study Guide*, read for syllabus scope and recurring question patterns only; 100% paraphrased).
- Official WAEC SSCE, NECO SSCE, and JAMB UTME Biology syllabuses and Chief Examiners' Reports on mammalian transport, heart anatomy, blood vessels, blood groups, and Paper 3 practical conventions.
