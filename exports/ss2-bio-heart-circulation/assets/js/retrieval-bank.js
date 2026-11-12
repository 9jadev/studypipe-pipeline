/* ==========================================================
   StudyPipe — Spaced Retrieval Bank · The Human Heart and Blood Circulation (L1–L7)
   Read by LessonKit in lessons/lesson-01 .. lesson-07 (classic script, offline).
   donow  : 4 warm-up cards per lesson (from: 0 = prerequisite, from: N = Lesson N;
            sec = the section id in that earlier lesson the "Revisit" link opens)
   quiz   : 2 review MCQs from earlier lessons (l02 onward), appended after the lesson's own quiz
   recall : blank-page recall prompt + the key points to tick off
   Content matches 02-lesson.md (Do Now and Recall lists), all original wording.
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Why Big Bodies Need a Transport System: Open, Closed, Single and Double Circulation",
    donow: [
      {
        from: 0, sec: "concepts", where: "Diffusion",
        q: "What is diffusion?",
        a: "The net spreading of particles from a region where they are <strong>crowded</strong> to a region where they are <strong>fewer</strong>."
      },
      {
        from: 0, sec: "concepts", where: "Respiration gases",
        q: "Which gas does a cell need for aerobic respiration, and which gas does it give off?",
        a: "It takes in <strong>oxygen</strong> and gives off <strong>carbon dioxide</strong>."
      },
      {
        from: 0, sec: "examples", where: "Surface area : volume",
        q: "Write SA : V for a cube of side L.",
        a: "6L² ÷ L³ = <strong>6/L</strong>."
      },
      {
        from: 0, sec: "examples", where: "Units of length",
        q: "Convert 0.40 m to millimetres.",
        a: "0.40 × 1000 = <strong>400 mm</strong>."
      }
    ],
    quiz: [],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 1, then tick each point below that you wrote, even in your own words:",
      points: [
        "Four reasons a big, active animal cannot depend on diffusion: small SA : V, cells far from the surface, fast use of oxygen and food, and materials made in one organ but used in another.",
        "Nine materials carried: oxygen, carbon dioxide, digestion products, water, mineral salts, hormones, urea, antibodies and heat.",
        "A mammal's transport system: a pump (the heart), channels (arteries, capillaries and veins) and a medium (blood, with lymph as a second fluid).",
        "Open circulation: blood pools in a body cavity at low pressure (cockroach, grasshopper, snail). Closed: blood stays inside vessels (earthworm, tilapia, frog, pigeon, human).",
        "Single circulation: one trip through the heart per circuit (tilapia, catfish). Double: two trips, heart to lungs and heart to body (toad, lizard, pigeon, human).",
        "Two advantages of double circulation: blood reaches the body at high pressure, and with four chambers oxygen-rich and oxygen-poor blood never mix.",
        "SA : V = 6L² ÷ L³ = 6/L: every time the side doubles, the ratio halves."
      ]
    }
  },

  l02: {
    title: "The Heart Up Close: Chambers, Walls, Valves and the Goat-Heart Dissection",
    donow: [
      {
        from: 1, sec: "concepts", where: "Why a transport system",
        q: "Give two reasons why Chidi needs a transport system.",
        a: "Any two of: <strong>small SA : V</strong>; <strong>cells far from the surface</strong>; <strong>high activity and oxygen demand</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Parts of the system",
        q: "Name the pump, the channels and the medium.",
        a: "<strong>Heart</strong>; <strong>blood vessels</strong>; <strong>blood</strong>."
      },
      {
        from: 1, sec: "props-table", where: "Fish heart",
        q: "How many chambers are in a fish heart, and is its circulation single or double?",
        a: "<strong>Two</strong> chambers; <strong>single</strong> circulation."
      },
      {
        from: 1, sec: "concepts", where: "Double circulation",
        q: "State one advantage of double circulation.",
        a: "Blood reaches the body at <strong>high pressure</strong>, or oxygen-rich and oxygen-poor blood <strong>do not mix</strong>."
      }
    ],
    quiz: [
      {
        from: 1,
        q: "What is the SA : V of a cube of side 10 mm?",
        o: ["0.60 mm⁻¹", "6.0 mm⁻¹", "60 mm⁻¹", "0.060 mm⁻¹"],
        a: 0,
        e: "SA : V = 6/L = 6 ÷ 10 = 0.60 mm⁻¹. Check: SA = 6 × 100 = 600 mm² and V = 1000 mm³, and 600 ÷ 1000 = 0.60."
      },
      {
        from: 1,
        q: "Which of these animals has closed, double circulation?",
        o: ["Cockroach", "Tilapia", "Garden snail", "Pigeon"],
        a: 3,
        e: "A pigeon has a four-chambered heart and a separate trip to the lungs. A cockroach and a snail have open circulation, and a tilapia has closed but single circulation."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 2, then tick each point below that you wrote:",
      points: [
        "Heart coverings and wall: pericardium (two-layered sac with slippery fluid), myocardium (thick heart muscle) and endocardium (smooth lining).",
        "Four chambers with in and out: RA (from venae cavae to RV), RV (to lungs by the pulmonary artery), LA (from four pulmonary veins to LV), LV (to the body by the aorta).",
        "The left ventricle wall is the thickest, about three times the right, because it pumps blood to the whole body.",
        "Four valves: tricuspid (RA and RV, three flaps), bicuspid or mitral (LA and LV, two flaps), pulmonary and aortic semilunar valves (three pockets each).",
        "Chordae tendineae anchor the AV flaps to papillary muscles so the flaps are not blown back into the atria; the septum keeps the two sides apart.",
        "Great vessels: superior and inferior venae cavae, pulmonary artery, four pulmonary veins, aorta, and the coronary arteries that feed the heart muscle.",
        "Drawing rules: heart faces you (patient's right on your left), LV wall thicker than RV, ruled label lines without arrowheads, capital-letter title, magnification stated."
      ]
    }
  },

  l03: {
    title: "The Double Circuit: Tracing Blood Around the Body",
    donow: [
      {
        from: 2, sec: "concepts", where: "Left atrium",
        q: "Which chamber receives blood from the pulmonary veins?",
        a: "The <strong>left atrium</strong>."
      },
      {
        from: 2, sec: "props-table", where: "Tricuspid valve",
        q: "Where is the tricuspid valve?",
        a: "<strong>Between the right atrium and the right ventricle.</strong>"
      },
      {
        from: 2, sec: "concepts", where: "Wall thickness",
        q: "Why is the left ventricle the thickest chamber?",
        a: "It pumps blood to the <strong>whole body</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Double circulation",
        q: "Is circulation in a pigeon single or double?",
        a: "<strong>Double.</strong>"
      }
    ],
    quiz: [
      {
        from: 2,
        q: "Which valve lies between the left atrium and the left ventricle?",
        o: ["Bicuspid (mitral) valve", "Tricuspid valve", "Pulmonary semilunar valve", "Aortic semilunar valve"],
        a: 0,
        e: "The bicuspid (mitral) valve, with two flaps, guards the opening from the left atrium to the left ventricle. The tricuspid valve is on the right side."
      },
      {
        from: 2,
        q: "Which statement about the pulmonary veins is correct?",
        o: ["They carry oxygen-poor blood to the lungs", "They carry oxygen-rich blood from the lungs to the left atrium", "They carry oxygen-rich blood from the left ventricle to the body", "They bring oxygen-poor blood into the right atrium"],
        a: 1,
        e: "There are four pulmonary veins, and they return oxygen-rich blood from the lungs to the left atrium. They are veins because they carry blood towards the heart."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 3, then tick each point below that you wrote:",
      points: [
        "The 13-step pathway: venae cavae, right atrium, tricuspid valve, right ventricle, pulmonary semilunar valve, pulmonary artery, lung capillaries, pulmonary veins, left atrium, bicuspid valve, left ventricle, aortic semilunar valve, aorta.",
        "Two loops: pulmonary (RV to lungs to LA) swaps carbon dioxide for oxygen; systemic (LV to body to RA) delivers oxygen and food and collects wastes.",
        "Hepatic portal vein: gut to liver, where glucose is stored as glycogen, surplus amino acids are broken down and poisons are made harmless. A portal vein links two capillary beds.",
        "Coronary arteries branch off the aorta just beyond its valve; a blocked one starves the heart muscle and causes a heart attack.",
        "Organ vessel pairs: lungs (pulmonary artery and veins), brain (carotid and jugular), arm (subclavian), liver (hepatic artery and portal vein in, hepatic vein out), gut, kidney (renal), leg (femoral or iliac), heart muscle (coronary).",
        "Any organ-to-organ route must pass through the lungs; the largest artery is the aorta and the largest vein is the inferior vena cava."
      ]
    }
  },

  l04: {
    title: "The Beating Heart: Cardiac Cycle, Heart Sounds, Pacemaker, Pulse and Blood Pressure",
    donow: [
      {
        from: 2, sec: "concepts", where: "Great vessels",
        q: "Which vessel carries blood from the left ventricle?",
        a: "The <strong>aorta</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Chordae tendineae",
        q: "What do the chordae tendineae do?",
        a: "They hold the AV valve flaps so they <strong>do not turn back into the atria</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Coronary circulation",
        q: "Which vessel supplies the heart muscle?",
        a: "The <strong>coronary artery</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Two loops",
        q: "Name the two loops of the double circulation.",
        a: "<strong>Pulmonary</strong> and <strong>systemic</strong>."
      }
    ],
    quiz: [
      {
        from: 3,
        q: "Blood leaving the stomach and intestines travels to which organ before returning to the heart?",
        o: ["Kidney", "Liver", "Lungs", "Brain"],
        a: 1,
        e: "The hepatic portal vein carries blood from the gut to the liver, where glucose is stored, surplus amino acids are broken down and poisons are made harmless."
      },
      {
        from: 3,
        q: "Blood returning from the lungs enters which chamber of the heart first?",
        o: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"],
        a: 1,
        e: "The four pulmonary veins empty oxygen-rich blood into the left atrium, which then passes it through the bicuspid valve to the left ventricle."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 4, then tick each point below that you wrote:",
      points: [
        "Four stages of the cycle (about 0.8 s at 75 bpm): all relaxed (about 0.4 s), atria contract (about 0.1 s), ventricles contract (about 0.3 s), ventricles relax. Systole is contraction; diastole is relaxation.",
        "Lub is the AV valves closing as the ventricles start to squeeze; dub is the semilunar valves closing as the ventricles relax. A murmur hints at a leaky or narrowed valve.",
        "Control chain: SAN (pacemaker in the right atrium wall), AVN (short delay), bundle of His (down the septum), Purkinje fibres (up both ventricle walls).",
        "Cardiac muscle is myogenic: the beat starts inside the heart. The medulla only adjusts the rate; sympathetic nerves and adrenaline speed it up, the vagus nerve slows it.",
        "Pulse is the bulge and spring-back of an artery wall with each beat; felt at the wrist (radial), neck (carotid), temple and groin. Blood pressure is about 120/80 mmHg, measured with a sphygmomanometer.",
        "Faster: exercise, fear or excitement, fever, high carbon dioxide, caffeine. Slower: sleep and rest, long-term fitness (resting rate), vagus nerve impulses.",
        "Equations: heart rate = beats in t × 60 ÷ t; cycle time T = 60 ÷ heart rate; cardiac output = heart rate × stroke volume; % change = (new − old) ÷ old × 100."
      ]
    }
  },

  l05: {
    title: "Arteries, Veins, Capillaries, Tissue Fluid and Lymph",
    donow: [
      {
        from: 2, sec: "concepts", where: "Wall thickness",
        q: "Why is the LV wall thicker than the RV wall?",
        a: "It pumps blood to the <strong>whole body</strong>, not just the nearby lungs."
      },
      {
        from: 3, sec: "concepts", where: "Hepatic portal vein",
        q: "Which vessel takes blood from the gut to the liver?",
        a: "The <strong>hepatic portal vein</strong>."
      },
      {
        from: 4, sec: "concepts", where: "Pulse",
        q: "What is a pulse?",
        a: "The throb of an artery as its wall <strong>bulges and springs back</strong> after every beat of the left ventricle."
      },
      {
        from: 4, sec: "concepts", where: "Blood pressure",
        q: "What do the two numbers in 120/80 mmHg stand for?",
        a: "The pressure while the ventricles <strong>contract</strong> / while they <strong>relax</strong>."
      }
    ],
    quiz: [
      {
        from: 4,
        q: "The \"dub\" heart sound is made when:",
        o: ["The AV valves close", "The semilunar valves close", "The atria contract", "The SAN fires"],
        a: 1,
        e: "Dub is the shorter, sharper second sound, made as the ventricles relax and the semilunar pockets fill and snap shut. Lub is the AV valves closing."
      },
      {
        from: 4,
        q: "A student counts 20 beats in 15 seconds. What is the heart rate?",
        o: ["35 bpm", "80 bpm", "300 bpm", "5 bpm"],
        a: 1,
        e: "Heart rate = 20 × 60 ÷ 15 = 80 bpm (four lots of 15 s make a minute). Adding the numbers (35) or multiplying them (300) gives wrong values."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 5, then tick each point below that you wrote:",
      points: [
        "Artery, vein and capillary compared on nine rows: direction, usual blood, wall, lumen, valves, pressure, speed, position and what a cut vessel looks like.",
        "Adaptations: artery walls are elastic and muscular and spring back; veins have pocket valves and the leg muscles squeeze them; capillaries have one-cell walls, huge numbers and slow flow.",
        "Tissue fluid in four steps: Pc is greater than πc at the arterial end, so fluid is squeezed out; cells take what they need and add wastes; at the venous end Pc is below πc, so most returns; the rest enters lymph capillaries.",
        "NFP = Pc − πc (+11 mmHg out at 36 against 25; −9 mmHg in at 16 against 25); flow Q = A × v, so the same flow over a bigger total area moves slowly.",
        "Lymph route: lymph capillaries, valved lymphatics, nodes, thoracic or right lymphatic duct, subclavian veins. Four jobs: return fluid and proteins, carry fat from the lacteals, filter germs in nodes, make lymphocytes.",
        "Blood, tissue fluid and lymph compared on red cells, plasma proteins, white cells, fat and where each is found.",
        "Oedema: too much fluid stays in the tissues (high venous pressure, low plasma protein). Elephantiasis: the lymph vessels are blocked, for instance by filarial worms."
      ]
    }
  },

  l06: {
    title: "Blood: Plasma, Cells and Clotting",
    donow: [
      {
        from: 5, sec: "concepts", where: "Lymph return",
        q: "Which vessel returns lymph to the blood?",
        a: "The <strong>subclavian vein</strong>."
      },
      {
        from: 5, sec: "concepts", where: "Tissue fluid",
        q: "What does tissue fluid lack that blood has?",
        a: "<strong>Red cells</strong> and most <strong>plasma proteins</strong>."
      },
      {
        from: 4, sec: "concepts", where: "Heart sounds",
        q: "What does the \"dub\" sound mean?",
        a: "The <strong>semilunar valves closing</strong>."
      },
      {
        from: 3, sec: "props-table", where: "Named vessels",
        q: "Which artery supplies the kidney?",
        a: "The <strong>renal artery</strong>."
      }
    ],
    quiz: [
      {
        from: 5,
        q: "At the arterial end of a capillary, fluid leaves the blood because:",
        o: ["Blood pressure Pc is greater than the pull of plasma proteins πc", "The pull of plasma proteins πc is greater than Pc", "Red cells burst and release water", "The lymph vessels pump it out"],
        a: 0,
        e: "At the arterial end Pc (about 36 mmHg) beats πc (25 mmHg), so net filtration pressure is positive and water with dissolved food is squeezed out."
      },
      {
        from: 5,
        q: "Lymph is finally returned to the blood through the:",
        o: ["Hepatic portal vein", "Subclavian veins", "Pulmonary veins", "Renal veins"],
        a: 1,
        e: "The thoracic duct and the right lymphatic duct empty lymph into the subclavian veins near the neck."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 6, then tick each point below that you wrote:",
      points: [
        "Blood is about 55% plasma and 45% cells; an adult carries roughly 5 to 6 dm³.",
        "Plasma is straw-coloured and about nine-tenths water; it carries food, salts, hormones, urea, most carbon dioxide, proteins (albumin, fibrinogen, prothrombin, antibodies) and heat. Serum is plasma without the clotting proteins.",
        "Red cells, white cells and platelets compared on shape, nucleus, number per mm³, where made, life span and job.",
        "Red cell adaptations: biconcave disc, no nucleus (more haemoglobin), small and bendy, and carbonic anhydrase. Anaemia is too few red cells or too little haemoglobin.",
        "Phagocytes have a lobed or bean-shaped nucleus and swallow germs; lymphocytes have one large round nucleus and make antibodies.",
        "Clotting: thromboplastin turns prothrombin into thrombin (vitamin K and calcium help); thrombin turns fibrinogen into fibrin threads; the net traps red cells and becomes a clot, then a scab.",
        "Blood stays liquid in healthy vessels because the lining is smooth and heparin is present. Haemophilia is an inherited, sex-linked failure of clotting."
      ]
    }
  },

  l07: {
    title: "Blood Groups, Rhesus, Transfusion and Disorders: Closing the Case",
    donow: [
      {
        from: 6, sec: "concepts", where: "Plasma proteins",
        q: "Which plasma proteins defend the body?",
        a: "<strong>Antibodies</strong> (globulins)."
      },
      {
        from: 6, sec: "concepts", where: "Clotting",
        q: "Name the insoluble protein in a clot.",
        a: "<strong>Fibrin.</strong>"
      },
      {
        from: 4, sec: "concepts", where: "Blood pressure",
        q: "What does 120/80 mmHg stand for?",
        a: "Pressure in the arteries while the ventricles <strong>contract</strong> / <strong>relax</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Materials carried",
        q: "List three materials carried by blood.",
        a: "Any three, e.g. <strong>oxygen, glucose, urea</strong> (also carbon dioxide, hormones, antibodies, heat)."
      }
    ],
    quiz: [
      {
        from: 6,
        q: "Which protein forms the insoluble threads of a blood clot?",
        o: ["Fibrinogen", "Fibrin", "Haemoglobin", "Albumin"],
        a: 1,
        e: "Thrombin changes dissolved fibrinogen into solid fibrin threads. Fibrinogen is the soluble form that is already in plasma."
      },
      {
        from: 6,
        q: "Which blood component releases thromboplastin, together with injured tissue, to start clotting?",
        o: ["Red cells", "Phagocytes", "Platelets", "Lymphocytes"],
        a: 2,
        e: "Platelets and damaged tissue release thromboplastin, which starts the chain that ends with a fibrin net."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 7, then tick each point below that you wrote:",
      points: [
        "ABO table: A (antigen A, anti-b), B (antigen B, anti-a), AB (both antigens, no antibodies: universal recipient), O (no antigens, both antibodies: universal donor).",
        "The agglutination rule: look at the donor's antigens and the patient's antibodies; a match makes the cells clump and can block vessels and damage the kidneys.",
        "Rhesus: Rh+ cells carry the D antigen. An Rh− mother carrying an Rh+ baby may make anti-D, which attacks the red cells of a later Rh+ baby (haemolytic disease of the newborn); an anti-D injection after delivery prevents it.",
        "Before a transfusion: type both people, test-mix for clumping, screen the blood (syphilis, HIV, hepatitis B and C) and store it with sodium citrate as the anticoagulant.",
        "Eleven disorders, each with a cause, a sign and one prevention: hypertension, atherosclerosis, coronary heart disease, stroke, thrombosis, varicose veins, anaemia, sickle cell anaemia, leukaemia, haemophilia and hole in the heart.",
        "Healthy-heart habits: regular exercise, little saturated fat, salt or sugar, no smoking, little or no alcohol, managing stress, a healthy weight and regular check-ups.",
        "The three solved cases: Chidi's pulse, Mama Bisi's ankles and the rider's safe bags (O− and B−, the two bags that suit a B Rh− patient)."
      ]
    }
  }
};
