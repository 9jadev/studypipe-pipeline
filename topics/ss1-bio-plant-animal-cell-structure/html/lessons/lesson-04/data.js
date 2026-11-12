/* Lesson 04 · The Cell and Its Environment — sort cards, expected practical table, explorer pins, bridge cases and the 12 quiz questions */
(function () {
  "use strict";

  window.L04 = {
    // ---- 2A. Sort game: which kind of movement? ----
    bins: {
      diffusion: "Diffusion",
      osmosis: "Osmosis",
      active: "Active transport"
    },
    items: [
      { id: "o2", emo: "🫁", name: "Oxygen entering a cheek cell", bin: "diffusion", why: "Oxygen is more crowded outside the cell than inside, so it spreads in down its gradient. No energy is spent." },
      { id: "perfume", emo: "🌸", name: "Perfume spreading across a room", bin: "diffusion", why: "Perfume particles spread from where they are crowded to where they are few until they are even. That is diffusion, and it is not only in cells." },
      { id: "co2", emo: "🍃", name: "Carbon dioxide leaving a leaf cell", bin: "diffusion", why: "The gas is more crowded inside the busy leaf cell than outside, so it moves out passively." },
      { id: "roothair", emo: "🌱", name: "Water entering a root hair from soil", bin: "osmosis", why: "Only water molecules are moving, across a selectively permeable membrane, from the dilute soil water into the more concentrated cell sap." },
      { id: "ugu", emo: "🥬", name: "Water leaving ugu cells in salty water", bin: "osmosis", why: "The salty water is more concentrated than the cell sap, so water leaves through the membrane. This is osmosis, and it is why the leaf wilts." },
      { id: "burst", emo: "🩸", name: "A red cell bursting in distilled water", bin: "osmosis", why: "Water rushes into the red cell from the very dilute surroundings until the membrane gives way (haemolysis). It is osmosis, not a burst caused by salt." },
      { id: "ions", emo: "🌾", name: "Root hairs taking in mineral ions from dilute soil water", bin: "active", why: "The ions are scarcer in the soil than in the root hair, so they move against the gradient. Pumps and ATP from respiration are needed." },
      { id: "glucose", emo: "🔋", name: "Cells taking up glucose against its gradient using ATP", bin: "active", why: "Moving a substance from low to high concentration costs energy, so it is active transport." },
      { id: "iodide", emo: "🌊", name: "A seaweed taking in iodide ions from seawater where they are scarcer than inside its cells", bin: "active", why: "Iodide is scarcer outside than inside, yet it still enters: the cell pumps it in and pays with ATP." }
    ],

    // ---- 2B. Expected results (careful technique), 02-lesson numbers ----
    expected: [
      { c: 0.0, m0: 2.50, m1: 2.85, ch: "+0.35", pct: "+14.0" },
      { c: 0.2, m0: 2.48, m1: 2.60, ch: "+0.12", pct: "+4.8" },
      { c: 0.4, m0: 2.52, m1: 2.47, ch: "−0.05", pct: "−2.0" },
      { c: 0.6, m0: 2.50, m1: 2.30, ch: "−0.20", pct: "−8.0" },
      { c: 0.8, m0: 2.46, m1: 2.16, ch: "−0.30", pct: "−12.2" },
      { c: 1.0, m0: 2.54, m1: 2.12, ch: "−0.42", pct: "−16.5" }
    ],

    // ---- technique cards: what each error does, with direction (02 sources of error) ----
    techniques: {
      careful: { name: "Careful technique", tone: "teal", flag: null },
      unblotted: { name: "Strip not blotted", tone: "pink", flag: "unblotted" },
      overBlotted: { name: "Blotted too hard", tone: "amber", flag: "overBlotted" },
      evaporation: { name: "Left on tile / open tubes", tone: "violet", flag: "evaporation" }
    },
    errors: [
      { key: "unblotted", head: "Surface water left on the strip (poor blotting)", dir: "Final mass too high", text: "A film of solution is weighed with the strip, so a % gain comes out too large and a % loss comes out too small." },
      { key: "overBlotted", head: "Blotting too hard", dir: "Final mass too low", text: "Sap is squeezed out of the cut cells, so every final mass is a little low." },
      { key: "evaporation", head: "Strip left on the tile before weighing", dir: "Final mass too low", text: "Water evaporates from the strip while it waits, so its mass is recorded too low." },
      { key: "evaporation", head: "Evaporation from open tubes over 30 min", dir: "Losses too large, gains too small", text: "Each solution becomes slightly more concentrated, so strips lose more (or gain less) than they should." }
    ],

    // ---- explorer pins: concentration against what happens (states follow the 02 solutions table) ----
    pins: [
      { c: 0.0, tone: "hypotonic", plant: "turgid", rbc: "swells and bursts (haemolysis)", strip: "firm and swollen", note: "Pure water is far more dilute than the cell sap, so water floods in. The wall stops the plant cell bursting; the red cell has no wall." },
      { c: 0.2, tone: "hypotonic", plant: "turgid", rbc: "swells, close to bursting", strip: "a little firmer", note: "Still more dilute than the sap, so water still enters, but more slowly: the gain is smaller (+4.8 %)." },
      { c: 0.4, tone: "hypertonic", plant: "starting to plasmolyse", rbc: "shrinks slightly", strip: "slightly softer", note: "Just past the isotonic point (about 0.34 mol dm⁻³). The solution is now slightly more concentrated than the sap, so a little water leaves." },
      { c: 0.6, tone: "hypertonic", plant: "plasmolysed", rbc: "shrinks and wrinkles (crenation)", strip: "soft and limp", note: "Water leaves by osmosis. The membrane pulls away from the wall and the strip loses 8 % of its mass." },
      { c: 0.8, tone: "hypertonic", plant: "plasmolysed", rbc: "crenated", strip: "limp", note: "Even more water leaves. The loss is larger, but the curve flattens because there is less water left to lose." },
      { c: 1.0, tone: "hypertonic", plant: "plasmolysed", rbc: "badly crenated", strip: "limp and thin", note: "The most concentrated tube gives the biggest loss, about 16.5 %." }
    ],

    // ---- Bridge: three cases, which way does water move? ----
    cases: [
      {
        id: "ugu", emo: "🥬", title: "Ugu in a bowl of salty water",
        sub: "Salty water is more concentrated than the cell sap.",
        right: "out",
        ok: "Water leaves the ugu cells by osmosis, so the cells plasmolyse and lose turgor. The leaf wilts. The salt did not soak in.",
        bad: "Look again: the salty water is more concentrated than the cell sap, so water moves from the cells into the bowl."
      },
      {
        id: "water", emo: "💧", title: "Plain water dripped into a vein",
        sub: "Plain water is more dilute than the inside of a red cell.",
        right: "in",
        ok: "Water rushes into the red cells. With no cell wall to resist, they swell and burst (haemolysis). This is why a drip is never plain water.",
        bad: "Look again: plain water is more dilute than the red cell contents, so water moves into the cells."
      },
      {
        id: "saline", emo: "🩸", title: "A 0.9% saline drip",
        sub: "0.9 g of salt in every 100 cm³ matches blood plasma.",
        right: "none",
        ok: "Water enters and leaves at the same rate, so red cells keep their shape. A 500 cm³ bag holds 4.5 g of salt.",
        bad: "Look again: 0.9% saline is isotonic with blood, so there is no net movement of water."
      }
    ]
  };

  // ---- 12 WAEC / NECO / JAMB quiz questions (03-questions.md § Lesson 04) ----
  window.LESSON_QUIZ = [
    {
      q: "Which of the following best describes <strong>active transport</strong>?",
      o: [
        "The overall spreading of particles from where they are crowded to where they are fewer, until they are evenly spread",
        "The passage of water molecules across a selectively permeable membrane, from the side where water is more plentiful (dilute solution) to the side where it is less plentiful (concentrated solution)",
        "The pumping of molecules or ions by a cell from where they are scarce to where they are already plentiful, which costs energy (ATP) from respiration",
        "Movement of dissolved substances through the fully permeable cellulose cell wall without a membrane"
      ],
      a: 2,
      e: "Active transport moves substances <strong>against</strong> their concentration gradient (from low to high), so the cell must spend energy as ATP from respiration. Option A is diffusion and option B is osmosis; both are passive and use no ATP. Option D is wrong because the cellulose wall does not control entry; the selectively permeable membrane does.",
      src: "WAEC-style"
    },
    {
      q: "Which of these is an example of <strong>active transport</strong> in a living organism?",
      o: [
        "Root hair cells of a maize plant taking in nitrate ions from soil water that is more dilute than the cell sap",
        "Carbon dioxide passing out of a red blood cell into the air spaces of the lungs",
        "Water entering the root hair of a cassava plant from wet soil",
        "The smell of fried akara spreading across a kitchen in Ibadan"
      ],
      a: 0,
      e: "The ions are moving from the dilute soil water (low concentration) into the more concentrated cell sap (high concentration), which is against the gradient, so energy from respiration is needed. Options B and D are diffusion (higher to lower concentration), and option C is osmosis (water moving into the more concentrated cell sap). The commonest wrong choice is C, because it is also &ldquo;uptake by a root&rdquo;, but water uptake is passive.",
      src: "NECO-style"
    },
    {
      q: "At a research farm in Ibadan, roots of tomato seedlings took up potassium ions from a solution that was more dilute than their cell sap. When a chemical that stops respiration was added, potassium uptake stopped almost at once, but water uptake continued. The best conclusion is that",
      o: [
        "potassium ions enter the root cells by osmosis",
        "the chemical made the cell membranes fully permeable",
        "water uptake also needs energy from the mitochondria",
        "potassium uptake is by active transport, which depends on ATP from respiration, while water enters passively by osmosis"
      ],
      a: 3,
      e: "Uptake against a gradient that stops when respiration is blocked is the classic evidence for active transport: no respiration means no ATP, and no ATP means no pumping. Water uptake carried on, so it does not need ATP; it is osmosis. Option A is wrong because osmosis refers only to water molecules, and option C is contradicted by the data (water uptake did not stop).",
      src: "JAMB-style"
    },
    {
      q: "At the LUTH teaching lab, Dr Amaka places a drop of human blood in a 3% sodium chloride solution and views it under the microscope after ten minutes. The red blood cells will appear",
      o: [
        "swollen and then burst, because water has entered them",
        "shrunken with crinkled, wrinkled edges (crenation), because water has left them by osmosis",
        "plasmolysed, with the membrane pulled away from the cell wall",
        "unchanged, because 3% salt is isotonic with blood"
      ],
      a: 1,
      e: "3% NaCl is far more concentrated than blood plasma (which is isotonic with 0.9% NaCl), so the solution is <strong>hypertonic</strong>. Water leaves the red cells by osmosis and they shrink and crenate. Option C is the main trap: &ldquo;plasmolysis&rdquo; applies to plant cells, where the protoplast pulls away from a cell wall; a red cell has no wall, so the correct term is crenation. Option A describes a hypotonic solution and option D confuses 3% with 0.9%.",
      src: "WAEC-style"
    },
    {
      q: "Chinedu adds a drop of blood to each of three test tubes containing salt solutions P, Q and R. Under the microscope: in P the red cells have burst (haemolysis); in Q they keep their normal disc shape; in R they are shrunken and crenated. Which arrangement shows the solutions in order of <strong>increasing</strong> salt concentration?",
      o: ["R, Q, P", "Q, P, R", "P, R, Q", "P, Q, R"],
      a: 3,
      e: "Bursting in P means water rushed in, so P is the most dilute (hypotonic). Q causes no change, so it is isotonic. Shrinking in R means water left the cells, so R is the most concentrated (hypertonic). Increasing concentration is therefore P → Q → R. Option A is the same order reversed, a common slip by candidates who think &ldquo;burst&rdquo; means &ldquo;too much salt&rdquo;.",
      src: "WAEC Practical"
    },
    {
      q: "A yam cube with an initial mass of 4.00 g was left in distilled water for 40 minutes. Its final mass was 4.62 g. What is the percentage change in mass?",
      o: ["+15.5%", "+13.4%", "+0.62%", "−15.5%"],
      a: 0,
      e: "Divide the change by the <strong>initial</strong> mass: <code>%Δm = (4.62 − 4.00) ÷ 4.00 × 100 = 0.62 ÷ 4.00 × 100 = +15.5%</code>. The cube gained mass because water entered the cells by osmosis from the hypotonic distilled water. Option B divides by the <strong>final</strong> mass (0.62 ÷ 4.62 × 100 = 13.4%), which is the most common error. Option C forgets to divide by the initial mass, and D has the wrong sign.",
      src: "WAEC-style"
    },
    {
      q: "A potato strip from Jos with an initial mass of 3.20 g showed a <strong>−7.5%</strong> change in mass after 30 minutes in a sucrose solution. What was its final mass?",
      o: ["3.44 g", "2.96 g", "3.13 g", "2.45 g"],
      a: 1,
      e: "<code>Δm = −7.5 ÷ 100 × 3.20 = −0.24 g</code>, then <code>m₁ = 3.20 − 0.24 = 2.96 g</code>. The strip lost mass, so the sucrose solution was hypertonic to the cell sap. Option A adds the change instead of subtracting it, option C subtracts 0.075 g instead of 7.5% of 3.20 g, and option D subtracts 0.75 g.",
      src: "NECO-style"
    },
    {
      q: "In a potato-strip experiment, a student forgot to blot the strip taken from the 0.0 mol dm⁻³ tube (distilled water) before its final weighing, although all the other strips were blotted properly. How would this error affect the result for that tube?",
      o: [
        "The % gain in mass would be recorded as smaller than its true value",
        "The % change would become negative",
        "It would have no effect, because the extra water is outside the cells",
        "The % gain in mass would be recorded as larger than its true value"
      ],
      a: 3,
      e: "Water clinging to the surface of an unblotted strip is weighed along with the strip, so the final mass is too high. That makes (final − initial) too large, and the calculated % gain is larger than the true gain from osmosis. Option C is the trap: the water is outside the cells, but the balance still weighs it, which is exactly why strips are blotted in the same way before every weighing.",
      src: "WAEC Practical"
    },
    {
      q: "Cocoyam discs were placed in sucrose solutions. Part of the results is shown below.<br><br><table class=\"tbl\"><thead><tr><th>Concentration (mol dm⁻³)</th><th>0.15</th><th>0.25</th><th>0.35</th><th>0.45</th></tr></thead><tbody><tr><td>% change in mass</td><td>+6.2</td><td>+3.0</td><td>−2.0</td><td>−6.4</td></tr></tbody></table><br>Assuming a straight line between neighbouring points, the concentration that is isotonic with the cocoyam cell sap is about",
      o: ["0.31 mol dm⁻³", "0.30 mol dm⁻³", "0.29 mol dm⁻³", "0.35 mol dm⁻³"],
      a: 0,
      e: "The isotonic point is where % change = 0, between 0.25 (+3.0) and 0.35 (−2.0). Let f be the fraction of the gap: <code>f = 3.0 ÷ (3.0 + 2.0) = 3.0 ÷ 5.0 = 0.60</code>, then the isotonic concentration is <code>c = 0.25 + 0.60 × 0.10 = 0.25 + 0.06 = 0.31 mol dm⁻³</code>. Option B simply takes the midpoint, which ignores that +3.0 is further from zero than −2.0. Option C measures 0.06 back from 0.35 (the wrong end), and option D is the first concentration with a loss, not the zero point.",
      src: "WAEC Practical"
    },
    {
      q: "A graph of % change in mass (y-axis) against sucrose concentration (x-axis) for cassava strips is a falling line that crosses the x-axis at 0.45 mol dm⁻³. What would happen to a cassava strip placed in a 0.30 mol dm⁻³ sucrose solution?",
      o: [
        "It would lose mass, because the solution is hypertonic to the cell sap",
        "Its mass would not change, because 0.30 mol dm⁻³ is isotonic with the cell sap",
        "It would gain mass and its cells would become turgid, because the solution is hypotonic to the cell sap",
        "It would gain mass and its cells would burst, because the solution is hypotonic to the cell sap"
      ],
      a: 2,
      e: "The line crosses 0% at 0.45 mol dm⁻³, so the cell sap is equivalent to 0.45 mol dm⁻³. A 0.30 mol dm⁻³ solution is more dilute (hypotonic), so on the graph it lies to the left of the crossing point, above the axis: water enters by osmosis and the strip gains mass. Option D is the main distractor: plant cells become turgid but do <strong>not</strong> burst, because the cellulose cell wall resists further swelling. Option A has the direction reversed.",
      src: "JAMB-style"
    },
    {
      q: "At Mile 12 Market, Mama Ngozi's ugu leaves went limp an hour after being washed in a bowl of strong salt water. Coach Danjuma says, &ldquo;The salt soaked into the leaves and made them heavy.&rdquo; Which is the correct explanation?",
      o: [
        "Salt particles entered the leaf cells by active transport and crushed the vacuoles",
        "The salt water was hypertonic to the cell sap, so water left the leaf cells by osmosis; the cells lost turgor and became plasmolysed, so the leaves wilted",
        "The salt water was hypotonic to the cell sap, so the leaf cells absorbed too much water and burst",
        "Salt dissolved the cellulose cell walls, so the leaves could no longer stand up"
      ],
      a: 1,
      e: "Wilting is caused by <strong>water leaving</strong> the cells, not by salt coming in. The salt water is more concentrated than the cell sap (hypertonic), so water moves out by osmosis through the selectively permeable membrane. The vacuoles shrink, the protoplasts pull away from the walls (plasmolysis), turgor is lost and the leaf droops. Option A repeats Coach Danjuma's misconception that salt moves into the cell; option C has the direction of water movement reversed, and plant cells do not burst.",
      src: "WAEC-style"
    },
    {
      q: "Dr Amaka needs a 250 cm³ bag of 0.9% saline (0.9 g of sodium chloride in every 100 cm³ of solution) for a dehydrated patient at LUTH. What mass of sodium chloride does the bag contain?",
      o: ["0.9 g", "22.5 g", "2.25 g", "9.0 g"],
      a: 2,
      e: "<code>m = 0.9 ÷ 100 × 250 = 0.009 × 250 = 2.25 g</code>. This concentration is isotonic with blood plasma, so red cells neither gain nor lose water and keep their shape. Option A gives the mass in only 100 cm³, option D is the mass in 1000 cm³ (1 dm³), and option B multiplies by 25 instead of 2.5.",
      src: "NECO-style"
    }
  ];
})();
