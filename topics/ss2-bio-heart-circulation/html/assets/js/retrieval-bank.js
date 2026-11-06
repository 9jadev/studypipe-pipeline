/* ==========================================================
   StudyPipe — Spaced Retrieval Bank for The Human Heart & Blood Circulation (L1–L5)
   Used by LessonKit across lessons/lesson-01 .. lesson-05
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Need for Transport — Open vs Closed & Single vs Double Circulation",
    donow: [
      {
        from: 0, sec: "concepts", where: "Simple Diffusion & Concentration Gradient",
        q: "What is diffusion, and why is it fast only over microscopic distances (less than 0.1 mm)?",
        a: "<strong>Diffusion</strong> is the passive net movement of particles from higher to lower concentration. Diffusion time increases with the <strong>square of the distance</strong>, so it is far too slow across thick multicellular tissues."
      },
      {
        from: 0, sec: "concepts", where: "Surface-Area-to-Volume Ratio of a Cube",
        q: "For a cube of side length L, write the formulas for surface area (SA), volume (V), and the simplified SA/V ratio.",
        a: "<code>SA = 6L²</code>, <code>V = L³</code>, and therefore <code>SA / V = 6 ÷ L</code> (which drops rapidly as L increases)."
      },
      {
        from: 0, sec: "concepts", where: "Aerobic Cellular Respiration",
        q: "Which two raw materials must reach every human muscle cell for aerobic respiration, and which two waste products must be carried away?",
        a: "<strong>Oxygen (O₂) and glucose</strong> must be delivered; <strong>carbon dioxide (CO₂) and water / metabolic heat / urea</strong> must be removed."
      },
      {
        from: 0, sec: "practical", where: "Levels of Biological Organisation",
        q: "At what level of organisation is the human heart classified, and what level is the entire cardiovascular apparatus?",
        a: "The <strong>heart</strong> is an <strong>organ</strong> (cardiac muscle, connective, nervous, and epithelial tissues), while the heart + blood vessels + blood form an <strong>organ system</strong>."
      }
    ],
    recall: {
      prompt: "Without looking back at the notes, tick off every core idea from Lesson 1 you can state from memory:",
      points: [
        "As an organism's linear dimension L increases, its surface-area-to-volume ratio (SA/V = 6/L) drops hyperbolically and diffusion distance increases, requiring a mass-flow circulatory system.",
        "Open circulation (arthropods like cockroach/grasshopper) pumps colourless haemolymph (no haemoglobin, so it does not carry O₂) into an open haemocoel via dorsal ostia at low pressure.",
        "Closed circulation (earthworm, fish, amphibians, reptiles, birds, mammals) keeps blood inside continuous vessels at high pressure with rapid flow and ultrafiltration.",
        "Fish have single circulation (2-chamber heart: 1 atrium, 1 ventricle; blood passes through the heart once per circuit and loses pressure at the gill capillaries), whereas mammals and birds have complete double circulation (4 chambers, zero mixing, high systemic pressure)."
      ]
    }
  },

  l02: {
    title: "Structure of the Mammalian Heart & The Double-Circulation Pathway",
    donow: [
      {
        from: 1, sec: "concepts", where: "Surface-Area-to-Volume Ratio",
        q: "How many times larger is the SA/V ratio (6/L) of a 0.2 mm protozoan cube compared to a 100 mm mammal cube?",
        a: "<code>R₁ = 6 ÷ 0.2 = 30 mm⁻¹</code> and <code>R₂ = 6 ÷ 100 = 0.06 mm⁻¹</code>. Ratio <code>F = 30 ÷ 0.06 = 500 times</code> larger!"
      },
      {
        from: 1, sec: "concepts", where: "Cockroach Haemolymph vs Mammalian Blood",
        q: "Why does a cockroach's haemolymph NOT transport oxygen even though it circulates through the haemocoel?",
        a: "Cockroach haemolymph <strong>lacks haemoglobin</strong> (respiratory pigment); oxygen is delivered directly to tissues by the <strong>tracheal system</strong> (spiracles and tracheoles)."
      },
      {
        from: 1, sec: "concepts", where: "Single vs Double Circulation",
        q: "Why is systemic arterial blood pressure much lower in a bony fish (tilapia) than in a human?",
        a: "In fish <strong>single circulation</strong>, blood passes from the ventricle through narrow <strong>gill capillaries</strong> first, losing most of its pressure before reaching body organs."
      },
      {
        from: 1, sec: "examples", where: "Cardiac Output & Circulation Time",
        q: "At HR = 80 bpm and stroke volume SV = 75 mL, what is the cardiac output CO in L/min?",
        a: "<code>CO = 80 × 75 = 6000 mL/min = 6.0 L/min</code>."
      }
    ],
    recall: {
      prompt: "Close your notes and recall the heart membranes, wall-thickness hierarchy, four valves, and complete pathway:",
      points: [
        "The heart sits in the thoracic mediastinum enclosed by a double-walled pericardium filled with pericardial fluid that reduces friction and prevents over-expansion.",
        "Wall-thickness hierarchy: Left Ventricle (~15 mm, 120 mmHg systemic) > Right Ventricle (~5 mm, 25 mmHg pulmonary) > Left & Right Atria (~2 mm); the interventricular septum prevents any mixing.",
        "Four one-way valves: Tricuspid (3 flaps, RA→RV), Bicuspid/Mitral (2 flaps, LA→LV) anchored by chordae tendineae to papillary muscles, plus Pulmonary and Aortic Semilunar valves.",
        "The Pulmonary Artery carries deoxygenated blood (RV→lungs), the Pulmonary Vein carries oxygenated blood (lungs→LA), the Coronary Artery branches off the base of the aorta to feed cardiac muscle, and the Hepatic Portal Vein links gut capillaries to liver capillaries."
      ]
    }
  },

  l03: {
    title: "Working of the Heart — Cardiac Cycle, Pacemaker, Heart Sounds & Blood Pressure",
    donow: [
      {
        from: 2, sec: "concepts", where: "Ventricular Wall Thickness Ratio",
        q: "Why is the muscular wall of the left ventricle about 3 times thicker than the wall of the right ventricle?",
        a: "The <strong>left ventricle</strong> must generate high pressure (<strong>~120 mmHg</strong>) to pump blood through the long <strong>systemic circuit</strong> around the whole body, whereas the right ventricle pumps only to the nearby lungs (<strong>~25 mmHg</strong>)."
      },
      {
        from: 2, sec: "concepts", where: "The Great Vessel Exception",
        q: "Name the ONLY artery in an adult mammal that carries deoxygenated blood and the ONLY vein that carries oxygenated blood.",
        a: "<strong>Pulmonary artery</strong> (carries deoxygenated blood from RV to lungs) and <strong>pulmonary vein</strong> (carries oxygenated blood from lungs to LA)."
      },
      {
        from: 2, sec: "concepts", where: "Heart Valves & Chordae Tendineae",
        q: "What is the exact function of the chordae tendineae and papillary muscles attached to the bicuspid and tricuspid valves?",
        a: "They hold the AV valve cusps taut during ventricular contraction so the flaps <strong>do not invert (turn inside out) into the atria</strong>, preventing backflow."
      },
      {
        from: 1, sec: "concepts", where: "Vertebrate Heart Chambers",
        q: "How many heart chambers do bony fish, amphibians (toad), and mammals have, and which reptile is the 4-chamber exception?",
        a: "<strong>Fish:</strong> 2 chambers · <strong>Amphibians:</strong> 3 chambers · <strong>Mammals & birds:</strong> 4 chambers · <strong>Crocodile:</strong> reptile exception with a complete 4-chambered heart."
      }
    ],
    recall: {
      prompt: "Without looking back, recall the myogenic conduction pathway, cardiac cycle phases, Lub-Dub sounds, and blood pressure:",
      points: [
        "Cardiac muscle is myogenic: the Sinoatrial Node (SAN) in the upper right atrial wall sets the pace → atria contract → Atrioventricular Node (AVN) delays the impulse by ~0.10 s so ventricles fill → Bundle of His → Purkinje fibres sweep upward from the apex.",
        "At 75 bpm, one cardiac cycle lasts T = 60 ÷ 75 = 0.80 s: Atrial Systole (0.10 s, AV open, SL closed) → Ventricular Systole (0.30 s, AV snap shut = 'LUB', SL forced open) → General Diastole (0.40 s, SL snap shut = 'DUB').",
        "First heart sound ('LUB') is caused by simultaneous closure of the tricuspid and bicuspid (AV) valves at the start of ventricular systole; second sound ('DUB') is caused by closure of the aortic and pulmonary semilunar valves at the start of ventricular diastole.",
        "Normal adult blood pressure is 120/80 mmHg measured with a sphygmomanometer over the brachial artery (Pulse Pressure PP = 40 mmHg, MAP = 80 + 40/3 = 93.3 mmHg)."
      ]
    }
  },

  l04: {
    title: "Blood Vessels, Capillary Exchange, the Lymphatic System & Cardiovascular Disorders",
    donow: [
      {
        from: 3, sec: "concepts", where: "Heart Sounds ('Lub-Dub')",
        q: "Which exact valves close to produce the first heart sound ('LUB') and which valves close to produce the second heart sound ('DUB')?",
        a: "<strong>'LUB' (S1):</strong> closure of the <strong>bicuspid and tricuspid (AV) valves</strong> at ventricular systole. <strong>'DUB' (S2):</strong> closure of the <strong>aortic and pulmonary semilunar valves</strong> at ventricular diastole."
      },
      {
        from: 3, sec: "concepts", where: "Myogenic Conduction & AVN Delay",
        q: "Where is the sinoatrial node (SAN) located, and why does the AVN delay the electrical impulse by ~0.10 s?",
        a: "The <strong>SAN</strong> is in the upper wall of the <strong>right atrium</strong>. The 0.10 s AVN delay lets the <strong>atria finish emptying into the ventricles</strong> before ventricular contraction begins."
      },
      {
        from: 3, sec: "examples", where: "Pulse Pressure & Mean Arterial Pressure",
        q: "For a patient with blood pressure 135/90 mmHg, calculate the pulse pressure (PP) and mean arterial pressure (MAP).",
        a: "<code>PP = 135 − 90 = 45 mmHg</code>. Then <code>MAP = 90 + (45 ÷ 3) = 90 + 15 = 105 mmHg</code>."
      },
      {
        from: 2, sec: "concepts", where: "Coronary Circulation",
        q: "From which major vessel do the coronary arteries branch off, and what happens if one is blocked by a thrombus?",
        a: "They branch off the <strong>base of the aorta</strong> just above the aortic semilunar valve; blockage starves cardiac muscle of oxygen, causing a <strong>myocardial infarction (heart attack)</strong>."
      }
    ],
    recall: {
      prompt: "Close your notes and recall the artery-vein-capillary differences, Starling capillary exchange, and lymphatic drainage:",
      points: [
        "Arteries have thick elastic and muscular walls, a narrow lumen, high pulsatile pressure, and no valves (except semilunar valves at the heart base); veins have thin walls, a wide lumen, low non-pulsatile pressure, and pocket valves assisted by the skeletal muscle pump.",
        "Capillaries have a one-cell-thick squamous endothelium and huge total cross-sectional area (~4,500 cm²), slowing blood velocity (v = Q/A ≈ 0.03 cm/s) for rapid diffusion.",
        "At the arterial end of a capillary (P_c = 35 mmHg > π_c = 25 mmHg, NFP = +10 mmHg), ultrafiltration forms tissue fluid (which lacks RBCs, platelets, and large plasma proteins).",
        "At the venous end (P_c = 15 mmHg < π_c = 25 mmHg, NFP = −10 mmHg), ~85% of fluid is reabsorbed and the remaining ~15% drains into blind-ended lymphatic vessels (returning to the subclavian veins, absorbing fats via lacteals, and producing lymphocytes)."
      ]
    }
  },

  l05: {
    title: "Composition of Blood, Clotting Cascade, ABO/Rhesus Groups & WAEC Paper 3 Clinic",
    donow: [
      {
        from: 4, sec: "concepts", where: "Artery vs Vein Structure",
        q: "Why do veins require pocket semilunar valves along their length whereas arteries do not?",
        a: "Blood in <strong>veins</strong> flows at <strong>very low pressure</strong> (often uphill against gravity), so valves prevent backflow; <strong>arteries</strong> carry blood under <strong>high ventricular pressure</strong> that drives it forward continuously."
      },
      {
        from: 4, sec: "examples", where: "Starling Net Filtration Pressure",
        q: "At the arterial end of a capillary, P_c = 36 mmHg and π_c = 25 mmHg. What is the Net Filtration Pressure and direction of fluid movement?",
        a: "<code>NFP = P_c − π_c = 36 − 25 = +11 mmHg</code> (positive ⇒ <strong>ultrafiltration outward</strong> into tissue spaces)."
      },
      {
        from: 4, sec: "concepts", where: "Blood vs Tissue Fluid vs Lymph",
        q: "Which three components of whole blood cannot pass through capillary walls into normal tissue fluid?",
        a: "<strong>Red blood cells (erythrocytes)</strong>, <strong>platelets (thrombocytes)</strong>, and <strong>large plasma proteins</strong> (albumin, fibrinogen)."
      },
      {
        from: 2, sec: "concepts", where: "Double-Circulation Pathway",
        q: "Name the two valves that blood passes through in sequence when travelling from the right atrium to the pulmonary artery.",
        a: "First the <strong>tricuspid valve</strong> (RA → RV), then the <strong>pulmonary semilunar valve</strong> (RV → pulmonary artery)."
      }
    ],
    recall: {
      prompt: "Without looking back, recall blood components, the 4-step clotting cascade, ABO/Rhesus compatibility, and WAEC Paper 3 heart rules:",
      points: [
        "Whole blood consists of 55% straw-coloured plasma (water, albumin, fibrinogen, antibodies, glucose, urea, CO₂ as HCO₃⁻) and 45% cellular elements: biconcave enucleate erythrocytes (RBCs, haemoglobin, 120-day lifespan), nucleated leucocytes (phagocytes with lobed nuclei + lymphocytes making antibodies), and thrombocytes (platelets).",
        "4-step blood clotting cascade: Damaged platelets/tissue release Thromboplastin → converts Prothrombin to active Thrombin (requires Ca²⁺ ions and Vitamin K) → Thrombin converts soluble Fibrinogen into insoluble Fibrin threads → traps RBCs to form a clot (Serum = Plasma minus Fibrinogen).",
        "Agglutination occurs when donor RBC antigen meets matching recipient plasma antibody: Group O (no A/B antigens) is universal RBC donor; Group AB (no anti-A/anti-B antibodies) is universal recipient; Rhesus incompatibility (Rh⁻ mother + Rh⁺ foetuses) causes erythroblastosis fetalis.",
        "WAEC Paper 3 Heart Drawing Rules: Identify anterior/ventral view by the diagonal coronary sulcus and thicker left ventricle on the right of the page; draw double lines for chamber walls showing the 3:1 LV:RV thickness ratio; use sharp HB unshaded lines, horizontal parallel guidelines, and state M = I ÷ A."
      ]
    }
  }
};
