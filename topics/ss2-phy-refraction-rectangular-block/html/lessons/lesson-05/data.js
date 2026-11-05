/* Lesson 05 · Data: WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical & The 7 Graph Variants */
window.L01 = {
  items: [
    { id: "sinisinr",  emo: "📈", name: "Plot sin i vs sin r → Slope = n",                bin: "shm",      why: "Variant A: From sin i = n sin r, plotting sin i (vertical) against sin r (horizontal) gives a straight line through the origin with slope S = n." },
    { id: "sinrsini",  emo: "📉", name: "Plot sin r vs sin i → Slope = 1/n",              bin: "shm",      why: "Variant B: Rearranging to sin r = (1/n) sin i gives a straight line through the origin with slope S = 1/n, so n = 1/S." },
    { id: "sini_leln", emo: "📐", name: "Plot sin i vs LE / LN → Slope = n",              bin: "shm",      why: "Variant G: In right-angled triangle LN₀E, LE/LN = sin r. Thus plotting sin i against LE/LN is identical to sin i vs sin r, giving slope S = n." },
    { id: "le_ln_fix", emo: "📏", name: "Plot LE vs LN at fixed i → Slope = sin r",       bin: "shm",      why: "Variant F: Since LE = LN sin r, plotting LE against LN for blocks of varying width at fixed incidence i yields a straight line with slope S = sin r." },
    { id: "le_tanr",   emo: "🧱", name: "Plot LE vs tan r → Slope = w (Block Width)",     bin: "periodic", why: "Variant D: In internal right-angled triangle LN₀E, tan r = LE/w, so LE = w tan r. The slope of LE against tan r equals the block width w." },
    { id: "ln_secr",   emo: "📐", name: "Plot LN vs sec r → Slope = w (Block Width)",     bin: "periodic", why: "Variant E: In internal right-angled triangle LN₀E, cos r = w/LN, so LN = w sec r. Plotting LN against sec r (1/cos r) gives slope S = w." },
    { id: "tri_id",    emo: "🔺", name: "Pythagoras Identity LN² = LE² + w²",            bin: "periodic", why: "In the internal right-angled triangle LN₀E, the refracted path length LN inside the glass satisfies LN² = LE² + w²." },
    { id: "w_calc",    emo: "🧮", name: "At w = 6.0 cm & r = 19.5°, LE = w tan r = 2.12 cm", bin: "periodic", why: "For a glass block of width w = 6.0 cm and refracted angle r = 19.5°, the back-face displacement is LE = 6.0 tan 19.5° = 2.12 cm." },
    { id: "pin_base",  emo: "📍", name: "Align Pin Bases (Feet) of P₃ & P₄ with P₁ & P₂", bin: "non",      why: "If an optical pin tilts slightly, its top shifts off the light path while its base (where it pierces the paper) stays on the true ray path." },
    { id: "pin_space", emo: "↔️", name: "Space Optical Pins at Least 4 cm – 5 cm Apart", bin: "non",      why: "Wide pin separation (≥ 4 cm) minimises angular alignment error when joining pin-pricks with a sharp pencil and ruler." },
    { id: "pin_vert",  emo: "⬆️", name: "Keep Optical Pins Strictly Vertical in Board",   bin: "non",      why: "Vertical pins prevent alignment errors when viewing through the opposite face of the glass block." },
    { id: "cos_curve", emo: "〰️", name: "Plot cos i vs cos r → Curved (Read Point x₁, y₁)", bin: "non",    why: "Variant C: Because sin²θ + cos²θ = 1, cos i vs cos r is a non-linear curve. Read a point (x₁, y₁) on the curve and compute n = √[(1 − x₁²)/(1 − y₁²)]." }
  ],

  trials: [
    { label: "A", L: 20.0, r: 13.2, t: "1.40 cm", T: "6.16 cm", T2: "0.228" },
    { label: "B", L: 30.0, r: 19.5, t: "2.12 cm", T: "6.36 cm", T2: "0.333" },
    { label: "C", L: 40.0, r: 25.4, t: "2.85 cm", T: "6.64 cm", T2: "0.429" },
    { label: "D", L: 50.0, r: 30.7, t: "3.56 cm", T: "6.98 cm", T2: "0.511" },
    { label: "E", L: 60.0, r: 35.3, t: "4.24 cm", T: "7.35 cm", T2: "0.577" }
  ],
  tOptions:  ["1.40 cm", "2.12 cm", "2.85 cm", "3.56 cm", "4.24 cm"],
  TOptions:  ["6.16 cm", "6.36 cm", "6.64 cm", "6.98 cm", "7.35 cm"],
  T2Options: ["0.228", "0.333", "0.429", "0.511", "0.577"],

  pins: [
    { frac: -1.0, emo: "📈", label: "Variants A & B · sin i vs sin r", x: "Linear through (0, 0)", v: "Slope A = n", a: "Slope B = 1 / n", ke: "sin i = n sin r", pe: "n = S or 1/S", note: "Plotting sin i (vertical) vs sin r (horizontal) gives slope S = n; reversing axes (sin r vs sin i) gives slope S = 1/n." },
    { frac: -0.5, emo: "〰️", label: "Variant C · cos i vs cos r", x: "Non-linear Curve!", v: "Read Point (x₁, y₁)", a: "sin θ = √(1 − cos²θ)", ke: "Never take linear slope", pe: "n = √[(1 − x₁²)/(1 − y₁²)]", note: "Because sin²θ + cos²θ = 1, cos i vs cos r is a curve. Read a point (x₁, y₁) on the curve and compute n = √[(1 − x₁²)/(1 − y₁²)]." },
    { frac: 0.0,  emo: "🧱", label: "Variants D & E · LE & LN", x: "Triangle LN₀E (w = 6.0 cm)", v: "LE = w tan r", a: "LN = w sec r", ke: "Slope = w (Width)", pe: "LN² = LE² + w²", note: "Both LE vs tan r and LN vs sec r (1/cos r) are straight lines through the origin whose gradient equals the block width w!" },
    { frac: 0.5,  emo: "📐", label: "Variants F & G · Ratio LE / LN", x: "LE / LN = sin r", v: "Slope (LE vs LN) = sin r", a: "Slope (sin i vs LE/LN) = n", ke: "Opp / Hyp = sin r", pe: "n = sin i / (LE/LN)", note: "In right-angled triangle LN₀E, LE/LN = sin r. Thus plotting sin i against LE/LN gives slope S = n!" },
    { frac: 1.0,  emo: "📍", label: "Paper 3 Precautions", x: "Four-Pin Ray Tracing", v: "Align Pin Bases (Feet)", a: "Spacing ≥ 4–5 cm", ke: "Keep pins vertical", pe: "Sharp pencil lines", note: "If a pin tilts slightly, its top moves off the line of sight while its base on the paper stays on the true optical ray path!" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "In a WAEC Physics Paper 3 rectangular glass block experiment, why must a student view and align the bases (feet) of the optical pins rather than their tops?",
    opts: [
      "The bases of the pins are brighter than the tops",
      "If a pin is slightly tilted from the vertical, its base on the paper still lies on the true optical ray path whereas its top is displaced",
      "The glass block only refracts light near the bottom surface",
      "Aligning the tops increases the refractive index of the glass block"
    ],
    ans: 1,
    exp: "Where the pin enters the drawing sheet is the fixed point you circle with your pencil. If a pin tilts, its top shifts sideways off the line of sight while its base remains accurately on the ray path."
  },
  {
    q: "Why should consecutive optical pins (P₁ and P₂, or P₃ and P₄) be placed at least 4 cm to 5 cm apart during a ray-tracing practical?",
    opts: [
      "To increase the lateral displacement of the glass block",
      "To minimise the angular error when drawing a straight line through the pin-pricks",
      "To prevent total internal reflection inside the glass block",
      "To make the angle of incidence equal to the critical angle"
    ],
    ans: 1,
    exp: "Two points very close together (e.g. 1 cm apart) magnify any small positional error into a large angular error when extended with a ruler. Spacing pins ≥ 4 cm apart ensures accurate ray lines."
  },
  {
    q: "A student plots sin r on the vertical axis against sin i on the horizontal axis in a rectangular glass block experiment and obtains a straight line of gradient S = 0.65. What is the refractive index n of the glass block?",
    opts: ["0.65", "1.30", "1.54", "2.15"],
    ans: 2,
    exp: "Since sin r = (1/n) sin i, the slope of sin r against sin i is S = 1/n. Therefore n = 1 / 0.65 = 1.538 ≈ 1.54."
  },
  {
    q: "In the internal right-angled triangle LN₀E inside a rectangular glass block of width w, where LN₀ = w is the normal, LE is the offset along the back face, and LN is the refracted ray length inside the glass, which pair of equations is correct?",
    opts: [
      "LE = w sin r and LN = w cos r",
      "LE = w tan r and LN = w sec r",
      "LE = w cot r and LN = w sin r",
      "LE = w cos r and LN = w tan r"
    ],
    ans: 1,
    exp: "In right-angled triangle LN₀E (right-angled at N₀), adjacent = LN₀ = w, opposite = LE, and hypotenuse = LN. Thus tan r = LE/w ⇒ LE = w tan r, and cos r = w/LN ⇒ LN = w sec r."
  },
  {
    q: "A student plots LE (in cm) on the vertical axis against tan r on the horizontal axis for a rectangular glass block. What physical quantity is represented by the gradient of the graph?",
    opts: [
      "The refractive index n of the glass block",
      "The critical angle c of the glass block",
      "The width w of the rectangular glass block",
      "The sine of the angle of incidence sin i"
    ],
    ans: 2,
    exp: "Because LE = w tan r, comparing with y = mx shows that the gradient m of LE against tan r is the width w of the rectangular glass block."
  },
  {
    q: "In a WAEC Paper 3 practical, a student measures the internal refracted path length LN and plots LN against sec r (where sec r = 1/cos r). If the slope of the line is 6.2 cm, what does 6.2 cm represent?",
    opts: [
      "The lateral displacement d at i = 90°",
      "The width w of the rectangular glass block",
      "The focal length of the glass block",
      "The apparent depth of the block at i = 60°"
    ],
    ans: 1,
    exp: "From LN = w sec r, the slope of LN against sec r equals the perpendicular width w of the rectangular glass block (6.2 cm)."
  },
  {
    q: "Within the internal right-angled triangle LN₀E of a rectangular glass block, what does the ratio LE / LN equal?",
    opts: ["tan r", "cos r", "sin r", "n"],
    ans: 2,
    exp: "In right-angled triangle LN₀E, LE is the side opposite angle r and LN is the hypotenuse. Therefore LE / LN = opposite / hypotenuse = sin r."
  },
  {
    q: "A student plots sin i on the vertical axis against the ratio LE / LN on the horizontal axis. What is the gradient of the resulting straight line?",
    opts: [
      "The width w of the block",
      "The refractive index n of the glass",
      "The reciprocal of refractive index 1/n",
      "The critical angle c"
    ],
    ans: 1,
    exp: "Because LE / LN = sin r, a plot of sin i against LE / LN is identical to a plot of sin i against sin r. By Snell's law (sin i = n sin r), the gradient equals the refractive index n."
  },
  {
    q: "What is the shape of a graph of cos i plotted against cos r for a rectangular glass block, and how is the refractive index n determined from it?",
    opts: [
      "A straight line through the origin; n equals the gradient",
      "A non-linear curve; read a point (x₁, y₁) = (cos i, cos r) on the curve and calculate n = √[(1 − x₁²) / (1 − y₁²)]",
      "A parabola through the origin; n equals the y-intercept",
      "A horizontal line; n equals the area under the graph"
    ],
    ans: 1,
    exp: "Because sin²θ + cos²θ = 1, the relation √(1 − cos²i) = n √(1 − cos²r) is non-linear in cos i and cos r. You must read a coordinate pair (x₁, y₁) on the curve and compute n = √[(1 − x₁²)/(1 − y₁²)]."
  },
  {
    q: "On a graph of cos i (horizontal axis x) against cos r (vertical axis y), a student reads the point (x₁, y₁) = (0.60, 0.85) on the curve. What is the refractive index n of the glass block?",
    opts: ["1.25", "1.33", "1.52", "1.70"],
    ans: 2,
    exp: "Using n = √[(1 − x₁²) / (1 − y₁²)] = √[(1 − 0.60²) / (1 − 0.85²)] = √[(1 − 0.36) / (1 − 0.7225)] = √(0.64 / 0.2775) = √2.3063 ≈ 1.52."
  },
  {
    q: "For a rectangular glass block of width w = 6.0 cm and refractive index n = 1.50, a ray enters at an angle of incidence i = 30° (so r = 19.5°). What are the values of LE = w tan r and LN = w sec r?",
    opts: [
      "LE = 2.00 cm, LN = 6.00 cm",
      "LE = 2.12 cm, LN = 6.36 cm",
      "LE = 3.00 cm, LN = 6.93 cm",
      "LE = 3.46 cm, LN = 5.20 cm"
    ],
    ans: 1,
    exp: "At r = 19.5°, tan 19.5° = 0.3536 and sec 19.5° = 1 / cos 19.5° = 1.0608. Thus LE = 6.0 × 0.3536 = 2.12 cm and LN = 6.0 × 1.0608 = 6.36 cm."
  },
  {
    q: "In a WAEC Paper 3 practical where i is kept constant at 30° across rectangular blocks of different widths, a student plots LE on the vertical axis against LN on the horizontal axis and finds a gradient S = 0.333. What is the refractive index n of the glass?",
    opts: ["1.33", "1.50", "1.67", "2.00"],
    ans: 1,
    exp: "Since LE = LN sin r, the slope of LE against LN at constant i is S = sin r = 0.333. With i = 30° (sin 30° = 0.500), n = sin i / sin r = 0.500 / 0.333 = 1.50."
  }
];
