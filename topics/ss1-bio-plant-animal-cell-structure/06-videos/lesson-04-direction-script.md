# Direction Script: Lesson 04 · Which way does the water go?

## Overview
The video solves the unit mystery: why salty water wilts Mama Ngozi's ugu and why Dr Amaka drips 0.9% saline, never plain water,
into a vein. It teaches diffusion, osmosis and active transport at a membrane, a plant cell and a red cell in three solutions, the
% change in mass of a potato strip, and the isotonic point read from the graph. It opens the lesson's **Make Sense** phase, after
the potato-strip bench. Worked Example 2 (0.8 mol dm⁻³), Worked Example 3's full write-up and the quiz stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 9 minutes, 9 chapters, 58 narration lines |
| Narrator | One teacher voice, Nigerian English |
| Level | SS1 Biology, WAEC / NECO / JAMB |
| Theme | Unit theme (follows the lesson: Editorial Ink); `meta.theme` unset |
| Kits used | `membrane-transport` (**KIT REQUEST**, scenes `membrane`, `cells`, `strip`) · `graph` (built-in) |
| Camera | Wide by default; push-ins on the pore, the pump, the plant cell wall and the red cell; board shots for the sums; graph push-in on the zero crossing |

**Colour roles:**

| Symbol | Meaning | Colour |
| --- | --- | --- |
| water | water molecules and water arrows | sky |
| solute | sugar / salt particles | amber |
| ATP | energy from respiration (active transport) | gold |
| gain | + % change, water in | green |
| loss | − % change, water out | red |
| iso | isotonic point / 0.9% saline | purple |

**Accuracy notes:**
- Definitions are the lesson's own wording (02-lesson.md § Make Sense), spoken in short sentences.
- Osmosis is the movement of **water**, never salt: this is the unit's central misconception (Coach Danjuma, "salt soaked in").
  Water crosses both ways; the video says "more water crosses" and "net", so it stays true.
- Plant cell in isotonic solution: the lesson says "normal / flaccid"; the video says "flaccid, no net change". A plant cell in
  water becomes turgid and **does not burst**; "plasmolysed" is used only for plant cells, "crenated" only for red cells.
- Numbers match the lesson's results table exactly: 0.0 mol dm⁻³ 2.50 → 2.85 g (+14.0%); 0.6 mol dm⁻³ 2.50 → 2.30 g (−8.0%);
  +4.8% at 0.2 and −2.0% at 0.4 mol dm⁻³; isotonic point about 0.34 mol dm⁻³. The 0.6 row is used instead of the lesson's
  Worked Example 2 (0.8 row) so Apply still has a fresh example.
- The graph is drawn as a **smooth curve** through the six points (the lesson forbids a straight regression line); the board
  interpolation between 0.2 and 0.4 is called an estimate, and the curve reading "about 0.34" agrees with it.
- 0.9% saline = 0.9 g of salt in every 100 cm³, so 4.5 g in a 500 cm³ bag (lesson Bridge). Quiz Q12 (250 cm³) and paper b8
  (1000 cm³) are not spoiled: the video uses the 500 cm³ bag only.
- Your-turn numbers (2.40 → 2.10 g) are new; they do not appear in 03-questions.md or the exit ticket (3.00 → 2.70 g).

## Chapter 1: The limp ugu and the drip (hook, about 0 min 50 s)
Pose the mystery the video will answer.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | At Mile 12 Market, Mama Ngozi's nephew washed her ugu in salty water to chase flies. One hour later, the leaves were limp. | Board: "The limp ugu" · Kit: `cells` scene, plant cell only, bath isotonic, labels off · 📷 WIDE | hook |
| 1.2 | Coach Danjuma was sure. The salt soaked into the leaves and made them heavy. Keep that idea in mind. We will test it. | Board: Coach: "salt soaked in" ? | misconception planted |
| 1.3 | That same evening at LUTH, Dr Amaka refused to drip plain water into a thirsty patient. She asked for zero point nine percent saline. | Board: drip: water ✗ · 0.9% saline ✓ | second puzzle |
| 1.4 | By the end of this video, you will explain both, and you will calculate the percentage change in mass of a potato strip. | Board: objectives ☐ three ways in and out ☐ cells in three solutions ☐ % change and isotonic point | objectives |

## Chapter 2: Diffusion, spreading out (about 0 min 50 s)
The passive baseline: particles spread from crowded to fewer.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | Start with something you already know. Fry akara in the kitchen, and soon the whole house can smell it. | Board: new board "Diffusion" · Kit: `membrane` scene, mode diffusion, spread 0, flow 0 · 📷 WIDE | everyday hook |
| 2.2 | The smell particles move from where they are crowded to where they are fewer. | Kit: flow on, dots spread (spread → 0.6), arrow crowded → fewer | observation |
| 2.3 | They keep spreading until they are evenly spread. That overall spreading is called diffusion. | Kit: spread → 1, arrow fades · Board: diffusion: crowded → fewer, until even (boxed) | definition |
| 2.4 | Oxygen enters a cheek cell this way, and carbon dioxide leaves a leaf cell this way. No energy is needed. | Board: e.g. O₂ into cells · no energy | examples |

## Chapter 3: Osmosis, water on the move (about 1 min 10 s)
Water, not salt, crosses a selectively permeable membrane.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | Now put a membrane in the middle. On the left, a dilute solution. On the right, a concentrated sugar solution. | Board: new board "Osmosis" · Kit: mode osmosis, level 0, flow 0, labels on (dilute / concentrated) · 📷 WIDE | setup |
| 3.2 | Look closely at a pore. The small water molecules slip through. The big sugar molecules cannot. | Kit: flow on · 📷 WIDE → pore | selectively permeable |
| 3.3 | We call this membrane selectively permeable. It lets some molecules through and stops others. | Board: selectively permeable membrane | term |
| 3.4 | Water crosses both ways, but more water crosses from the dilute side to the concentrated side. Watch the level rise. | Kit: arrows on (water →), level → 1 · 📷 WIDE | net movement |
| 3.5 | That is osmosis. Water moves across a selectively permeable membrane, from a dilute solution to a concentrated one. | Board: osmosis = water, dilute → concentrated, across a selectively permeable membrane (boxed, water colour) | definition |
| 3.6 | Notice what moved. Water. The sugar stayed where it was. So, Coach, salt does not soak in. Water comes out. | Board: water moves, not salt · Kit: pulse sugar dots on the right | misconception answered |

## Chapter 4: Active transport, pumping uphill (about 0 min 50 s)
Movement against the gradient needs ATP.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | Sometimes a cell needs something that is already more plentiful inside than outside. Like root hairs taking in mineral ions from dilute soil water. | Board: new board "Active transport" · Kit: mode active, pump 0, labels on (outside / inside) · 📷 WIDE | problem |
| 4.2 | Diffusion would carry the ions the wrong way. So the cell pumps them in, through a carrier in the membrane. | Kit: pump on, ions carried scarce → plentiful · 📷 WIDE → pump | mechanism |
| 4.3 | Every pump costs energy, as A T P from respiration. That is active transport: from scarce to plentiful, using energy. | Board: active transport: scarce → plentiful, uses ATP (boxed, ATP colour) · Kit: ATP sparks | definition |
| 4.4 | Stop respiration, and the pump stops at once. Diffusion and osmosis would carry on, because they need no energy. | Kit: pump 0 · Board: no respiration → no ATP → no pumping · 📷 WIDE | contrast |

## Chapter 5: Two cells, three solutions (about 1 min 50 s)
Plant cell vs red cell in hypotonic, isotonic and hypertonic solutions.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | Now the real question. What happens to a whole cell in different solutions? Here is a plant cell, and here is a red blood cell. | Kit: `cells` scene, both cells, labels on (cell wall, membrane, vacuole, no wall) · Board: new board "Cells in solutions" · 📷 WIDE | setup |
| 5.2 | Spot the difference. The plant cell has a stiff cellulose wall around its membrane. The red cell has only a membrane. | 📷 WIDE → wall · Board: plant: wall + membrane · red cell: membrane only | key structure |
| 5.3 | First, pure water. It is more dilute than the cell contents, so we call it hypotonic. Water rushes into both cells. | Kit: solution hypo, arrows on (in), progress → 0.5 · Board: hypotonic → water in · 📷 WIDE | prediction |
| 5.4 | The plant cell swells until its membrane presses on the wall. The wall holds it. The cell is firm, or turgid. It does not burst. | Kit: progress → 0.7, terms on · Board: plant → turgid · 📷 WIDE → plant | outcome 1 |
| 5.5 | The red cell has no wall to hold it. It swells and swells, and bursts. That is haemolysis. | Kit: progress → 1, red cell bursts · Board: red cell → bursts (haemolysis) · 📷 WIDE → rbc | outcome 2 |
| 5.6 | Next, a solution with the same concentration as the cells. It is isotonic. Water goes in and out equally, so there is no net change. | Kit: solution iso (fresh), progress 1, arrows both ways · Board: isotonic → no net change · 📷 WIDE | outcome 3 |
| 5.7 | The plant cell stays flaccid, neither firm nor shrunken. The red cell keeps its normal disc shape. | Board: plant → flaccid · red cell → normal | outcome 3 terms |
| 5.8 | Last, a very salty solution, more concentrated than the cells. It is hypertonic. Now water leaves both cells by osmosis. | Kit: solution hyper (fresh), arrows out, progress → 0.5 · Board: hypertonic → water out | prediction |
| 5.9 | In the plant cell, the vacuole shrinks and the membrane pulls away from the wall. The cell is plasmolysed. | Kit: progress → 1 · 📷 WIDE → wall · Board: plant → plasmolysed | outcome 4 |
| 5.10 | The red cell shrinks and its edge wrinkles. That is crenation. Never call a red cell plasmolysed; it has no wall to pull away from. | 📷 WIDE → rbc · Board: red cell → crenated (not plasmolysed) | outcome 5 + exam trap |

## Chapter 6: Measuring osmosis with a potato (about 1 min 20 s)
% change in mass, with two rows from the bench.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | We cannot weigh one cell, but we can weigh millions of them together, in a potato strip. Remember your bench. | Kit: `strip` scene, conc 0.0, mass 2.50, change 0, onBalance 1 · Board: new board "% change in mass" · 📷 WIDE | link to bench |
| 6.2 | The strip in pure water started at two point five zero grams. After thirty minutes, it weighed two point eight five grams. | Kit: onBalance 0 → strip in tube, change → +14, arrows in; then mass 2.85 on the balance · Board: 0.0 mol/dm³: 2.50 g → 2.85 g | givens |
| 6.3 | Strips start at slightly different masses, so we compare them with percentage change. Final minus initial, over initial, times one hundred. | 📷 BOARD SHOT · Board: % change = (final − initial) / initial × 100 (boxed) | formula |
| 6.4 | Step one. Two point eight five minus two point five zero is plus zero point three five grams. | Board: 2.85 − 2.50 = +0.35 g | step |
| 6.5 | Step two. Zero point three five over two point five zero, times one hundred, is plus fourteen point zero percent. | Board: 0.35 / 2.50 × 100 = +14.0% (boxed, gain colour) | step + answer |
| 6.6 | Plus means it gained water. Pure water is hypotonic, so water entered the cells by osmosis. | Board: + → water in (hypotonic) · 📷 WIDE | meaning of sign |
| 6.7 | In the zero point six tube, a strip went from two point five zero to two point three zero grams. Change, minus zero point two zero grams. | Kit: conc 0.6, mass 2.50 → 2.30, change → −8, arrows out · Board: 0.6 mol/dm³: 2.30 − 2.50 = −0.20 g | second row |
| 6.8 | Minus zero point two zero over two point five zero, times one hundred, is minus eight point zero percent. Water left. The cells plasmolysed. | Board: −0.20 / 2.50 × 100 = −8.0% (boxed, loss colour) | answer + meaning |

## Chapter 7: Finding the isotonic point (about 1 min 20 s)
Where the curve crosses zero.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 7.1 | Now plot all six results. Percentage change goes up the side. Sucrose concentration goes along the bottom. | Kit: `graph`, axes "% change in mass" vs "sucrose (mol/dm³)", six points · Board: new board "Isotonic point" · 📷 WIDE | graph setup |
| 7.2 | Join them with a smooth curve, not a ruler line. The points do not lie on a straight line. | Graph: smooth curve draws | method |
| 7.3 | Above the zero line, strips gained water. Below it, they lost water. Where the curve crosses zero, the strip neither gained nor lost. | Graph: zero line pulses, labels "gained" / "lost" · 📷 WIDE → crossing | interpretation |
| 7.4 | That crossing is the isotonic point. The solution there has the same concentration as the potato cell sap. | Board: isotonic point: % change = 0 (boxed, iso colour) | definition |
| 7.5 | The curve crosses between zero point two, at plus four point eight, and zero point four, at minus two point zero. | Graph: points (0.2, 4.8) and (0.4, −2.0) pulse · Board: 0.2 → +4.8% · 0.4 → −2.0% | givens |
| 7.6 | To estimate it, find how far along the gap. Four point eight over six point eight is zero point seven one. | 📷 BOARD SHOT · Board: 4.8 / (4.8 + 2.0) = 0.71 | step |
| 7.7 | So the concentration is zero point two plus zero point seven one times zero point two. About zero point three four moles per decimetre cubed. | Board: 0.2 + 0.71 × 0.2 ≈ 0.34 mol/dm³ (boxed, iso colour) | answer |
| 7.8 | Check it on the curve. It crosses zero at about zero point three four. The sum and the graph agree. | Board: curve: about 0.34 · Graph: guide at (0.337, 0) pulses · 📷 WIDE → crossing | check |

## Chapter 8: The mystery, solved (about 1 min)
Back to the ugu and the drip.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 8.1 | Back to Mile 12. The salty water was hypertonic to the ugu cell sap. So water left the leaf cells by osmosis. | Kit: `cells` scene, plant cell only, solution hyper (fresh), progress → 1 · Board: new board "Solved" · salty water = hypertonic · 📷 WIDE | apply |
| 8.2 | The cells plasmolysed, lost their firmness, and the leaves went limp. Salt did not soak in. Water came out. | Board: water out → plasmolysed → limp | answer 1 |
| 8.3 | Now the drip. Plain water is hypotonic to red cells. Water would rush in, and the cells would burst. | Kit: red cell only, solution hypo (fresh), progress → 1 · Board: plain water → haemolysis ✗ · 📷 WIDE → rbc | answer 2 |
| 8.4 | Zero point nine percent saline is isotonic with blood, so red cells keep their shape. | Kit: solution iso (fresh) · Board: 0.9% saline = isotonic ✓ (iso colour) · 📷 WIDE | answer 3 |
| 8.5 | Zero point nine percent means zero point nine grams of salt in every hundred centimetres cubed. A five hundred centimetre cubed bag holds four point five grams. | 📷 BOARD SHOT · Board: 0.9 g per 100 cm³ · 0.9 × 500/100 = 4.5 g | calculation |

## Chapter 9: Mistakes, summary and your turn (about 1 min 40 s)

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 9.1 | Here are the mistakes that cost marks. | Board: new board "Common mistakes" · Kit off · 📷 WIDE | transition |
| 9.2 | One. Saying salt or sugar moves in osmosis. Only water moves across the membrane. | Board: ✗ salt moves in · ✓ water moves | mistake 1 |
| 9.3 | Two. Dividing by the final mass. Zero point three five over two point eight five gives twelve point three, which is wrong. Always divide by the initial mass. | Board: ✗ 0.35 / 2.85 × 100 = 12.3% · ✓ ÷ initial → +14.0% | mistake 2 |
| 9.4 | Three. Saying a plant cell bursts in water. Its wall makes it turgid. Only the red cell bursts. | Board: ✗ plant cell bursts · ✓ turgid | mistake 3 |
| 9.5 | To sum up. Osmosis moves water from dilute to concentrated. Diffusion needs no energy. Active transport uses A T P. | Board: summary line 1 (three processes) | summary |
| 9.6 | Percentage change is final minus initial, over initial, times one hundred. Where it is zero, the solution is isotonic. | Board: summary line 2 (formula + isotonic) | summary |
| 9.7 | Your turn. A yam strip went from two point four zero grams to two point one zero grams in a sugar solution. Find the percentage change, and name the solution. | Board: yam strip 2.40 g → 2.10 g · % change? · which solution? · pause 15 s | practice |
| 9.8 | Change is minus zero point three zero grams. Over two point four zero, times one hundred, is minus twelve point five percent. It lost water, so the solution was hypertonic. | Board: −0.30 / 2.40 × 100 = −12.5% (boxed, loss colour) · hypertonic | solution |
| 9.9 | Well done. Now try the worked examples in Apply, starting with the strip in the zero point eight tube. | End card: Continue to Apply → | close |

## Build checks and kit gaps

| Check | Expected |
| --- | --- |
| 0.0 tube change: 2.85 − 2.50 | +0.35 g |
| 0.0 tube %: 0.35 / 2.50 × 100 | +14.0% |
| 0.6 tube change: 2.30 − 2.50 | −0.20 g |
| 0.6 tube %: −0.20 / 2.50 × 100 | −8.0% |
| Table rows on the graph: 0.12/2.48, −0.05/2.52, −0.30/2.46, −0.42/2.54 (× 100) | +4.8, −2.0, −12.2, −16.5% |
| Gap: 4.8 + 2.0 | 6.8 |
| Fraction: 4.8 / 6.8 | 0.71 (0.706) |
| Isotonic: 0.2 + 0.71 × 0.2 | 0.34 mol dm⁻³ (0.342) |
| Smooth curve passes within 0.3% of each of the six points and crosses 0 between 0.335 and 0.34 | true |
| Saline in 500 cm³: 0.9 × 500 / 100 | 4.5 g |
| Wrong-divisor mistake: 0.35 / 2.85 × 100 | 12.3% |
| Your turn change: 2.10 − 2.40 | −0.30 g |
| Your turn %: −0.30 / 2.40 × 100 | −12.5% |

**Kits:** `graph` (built-in) for the % change curve. **KIT REQUEST `membrane-transport`**
(`06-videos/kit-requests/membrane-transport.md`): scenes `membrane` (diffusion / osmosis / active), `cells` (plant cell and red
cell in hypo / iso / hyper) and `strip` (potato strip, tube, balance). Built on the fly by the video-kit-engineer; the plan is
written once it exists, using the state names in its README.
Fallback if the kit cannot be built: chapters 2–6 and 8 run on the board with the `graph` kit only (the core visuals, water
crossing a membrane and the two cells changing, would be lost, so the fallback is not recommended).

## Changes made while writing the plan

- **7.8:** the graph curve is a smooth monotone (PCHIP) curve through the six points, crossing zero at 0.337, so the line says "about zero point three four", matching the unit and the sum.
- Long definitions (osmosis, active transport) split into 2–4 short board lines; the mistake board for 9.3 uses 12.3%.
- Plan: `lesson-04.plan.cjs`, builds standalone (58 lines, ~9.5 min). Kit `membrane-transport`.
