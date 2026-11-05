/* Lesson 03 · Data: Real & Apparent Depth, Multi-Layer Slabs & The No-Parallax Method */
window.L01 = {
  items: [
    { id: "real", emo: "📏", name: "Actual Thickness R = 6.0 cm of Slab", bin: "shm", why: "Real depth R is the true physical thickness of the medium or actual distance from the top surface to object O." },
    { id: "app",  emo: "👁️", name: "Apparent Depth A = R ÷ n = 4.0 cm", bin: "shm", why: "Apparent depth A is the distance from the top surface to the virtual image I when viewed vertically from above." },
    { id: "rat",  emo: "⚖️", name: "Refractive Index n = R ÷ A", bin: "shm", why: "At near-normal viewing, sin i / sin r ≈ tan i / tan r = R / A, so n = Real Depth ÷ Apparent Depth." },
    { id: "mlt",  emo: "🥞", name: "Multi-Layer Depth A_total = Σ(t_i ÷ n_i)", bin: "shm", why: "For immiscible transparent layers (e.g. glass + water), total apparent depth is the sum of individual apparent depths." },
    { id: "shf",  emo: "⬆️", name: "Upward Vertical Shift d_v = R − A", bin: "periodic", why: "Vertical displacement d_v is how far the object appears raised towards the surface: d_v = R − A." },
    { id: "frm",  emo: "📐", name: "Shift Formula d_v = R(1 − 1/n)", bin: "periodic", why: "Substituting A = R/n into d_v = R − A gives d_v = R(1 − 1/n), independent of how far below the slab the object sits." },
    { id: "trp",  emo: "⚠️", name: "Exam Phrase: 'Appears Raised by 2.0 cm'", bin: "periodic", why: "'Appears raised by 2.0 cm' gives upward shift d_v = 2.0 cm (so A = R − 2.0 cm), NOT apparent depth A!" },
    { id: "mic",  emo: "🔬", name: "Travelling Microscope Raise Δh = d_v", bin: "periodic", why: "When a glass block of thickness R is placed over an ink mark, the microscope must be raised by d_v = R(1 − 1/n) to refocus." },
    { id: "pin",  emo: "📍", name: "No-Parallax Search Pin Alignment", bin: "non", why: "When the search pin on the retort stand is at height d_v above the board, it coincides with virtual image I." },
    { id: "swy",  emo: "↔️", name: "Zero Relative Shift on Head Sway", bin: "non", why: "No-parallax means the virtual image and the search pin move together with zero relative motion when the eye moves side to side." },
    { id: "ray",  emo: "🔺", name: "Rays Refract AWAY from Normal into Air", bin: "non", why: "Rays from object O travel from denser (glass/water) to less dense (air), bending away from the normal so backward extensions meet higher up at I." },
    { id: "par",  emo: "📈", name: "Graph of Real Depth R vs Apparent Depth A", bin: "non", why: "Plotting R (vertical) against A (horizontal) gives a straight line through the origin with slope = refractive index n." }
  ],

  trials: [
    { label: "A", L: 3.0,  t: "2.00", T: "1.00", T2: "1.50" },
    { label: "B", L: 6.0,  t: "4.00", T: "2.00", T2: "1.50" },
    { label: "C", L: 9.0,  t: "6.00", T: "3.00", T2: "1.50" },
    { label: "D", L: 12.0, t: "8.00", T: "4.00", T2: "1.50" },
    { label: "E", L: 15.0, t: "10.00", T: "5.00", T2: "1.50" }
  ],
  tOptions:  ["1.50", "2.00", "4.00", "6.00", "8.00", "10.00"],
  TOptions:  ["1.00", "2.00", "3.00", "4.00", "5.00", "6.00"],
  T2Options: ["0.67", "1.33", "1.50", "1.65", "2.00"],

  pins: [
    { frac: -1.0, emo: "💧", label: "Water Beaker (R = 8.0 cm, n = 4/3)", x: "n = 1.33", v: "Apparent A = 6.00 cm", a: "Raised d_v = 2.00 cm", ke: "A = ¾ R", pe: "d_v = ¼ R", note: "In water (n = 4/3), apparent depth is ¾ of real depth, so the bottom appears raised by ¼ R = 2.00 cm." },
    { frac: -0.5, emo: "🪟", label: "Surulere Glass Slab (R = 6.0 cm, n = 1.50)", x: "n = 1.50", v: "Apparent A = 4.00 cm", a: "Raised d_v = 2.00 cm", ke: "A = ⅔ R", pe: "d_v = ⅓ R", note: "Dr Kunle's 6.0 cm crown-glass paperweight: the eye chart underneath appears at A = 4.00 cm (raised by d_v = 2.00 cm)." },
    { frac: 0.0,  emo: "🧱", label: "Thick Crown Glass (R = 9.0 cm, n = 1.50)", x: "n = 1.50", v: "Apparent A = 6.00 cm", a: "Raised d_v = 3.00 cm", ke: "A = 6.00 cm", pe: "d_v = 3.00 cm", note: "Increasing glass thickness to 9.0 cm increases apparent depth to 6.00 cm and upward shift to 3.00 cm." },
    { frac: 0.5,  emo: "🥞", label: "2-Layer Tank (6 cm Glass + 8 cm Water)", x: "n₁ = 1.50, n₂ = 4/3", v: "A = 4.0 + 6.0 = 10.0 cm", a: "Raised d_v = 4.00 cm", ke: "R_tot = 14.0 cm", pe: "A_tot = 10.0 cm", note: "Add apparent depths layer by layer: A_total = (6.0/1.50) + (8.0/1.333) = 4.0 + 6.0 = 10.0 cm!" },
    { frac: 1.0,  emo: "💎", label: "Diamond Slab (R = 4.84 cm, n = 2.42)", x: "n = 2.42", v: "Apparent A = 2.00 cm", a: "Raised d_v = 2.84 cm", ke: "A = R / 2.42", pe: "d_v = 0.587 R", note: "High refractive index makes the bottom appear less than half its real depth!" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "A rectangular glass block of thickness 9.0 cm and refractive index 1.50 is placed flat over an ink mark on a white sheet of paper. When viewed vertically from above, what are (i) the apparent depth A of the ink mark and (ii) the distance d_v through which the ink mark appears raised?",
    opts: [
      "(i) A = 3.0 cm, (ii) d_v = 6.0 cm",
      "(i) A = 6.0 cm, (ii) d_v = 3.0 cm",
      "(i) A = 6.0 cm, (ii) d_v = 9.0 cm",
      "(i) A = 13.5 cm, (ii) d_v = 4.5 cm"
    ],
    ans: 1,
    exp: "Apparent depth A = Real depth R ÷ n = 9.0 ÷ 1.50 = 6.0 cm. Upward vertical displacement (apparent rise) d_v = R − A = 9.0 − 6.0 = 3.0 cm."
  },
  {
    q: "A coin at the bottom of a swimming pool appears to be raised by 0.60 m when viewed vertically from above. If the refractive index of water is 4/3, what is the actual (real) depth R of the swimming pool?",
    opts: ["0.80 m", "1.80 m", "2.40 m", "3.20 m"],
    ans: 2,
    exp: "Watch the wording! 'Appears to be raised by 0.60 m' gives the vertical displacement d_v = 0.60 m (NOT apparent depth A!). Using d_v = R(1 − 1/n): 0.60 = R(1 − 3/4) = R / 4 ⇒ R = 4 × 0.60 = 2.40 m."
  },
  {
    q: "A travelling microscope is focused on a fine chalk mark on a laboratory bench and its vernier scale reads 2.15 cm. A rectangular glass block of refractive index 1.50 is then placed over the mark, and the microscope must be raised to 4.35 cm to refocus clearly on the mark. What is the real thickness R of the glass block?",
    opts: ["2.20 cm", "3.30 cm", "4.40 cm", "6.60 cm"],
    ans: 3,
    exp: "The distance through which the microscope is raised equals the vertical displacement d_v = 4.35 − 2.15 = 2.20 cm. Since d_v = R(1 − 1/n) = R(1 − 2/3) = R/3, the real thickness of the block is R = 3 × 2.20 = 6.60 cm."
  },
  {
    q: "A vessel contains a 6.0 cm layer of crown glass (n = 1.50) at the bottom, covered by an 8.0 cm layer of water (n = 4/3), which is topped by a 4.2 cm layer of olive oil (n = 1.40). What is the total apparent depth of a scratch at the bottom of the glass when viewed vertically from above?",
    opts: ["10.0 cm", "12.2 cm", "13.0 cm", "18.2 cm"],
    ans: 2,
    exp: "For multiple immiscible transparent layers, A_total = (t₁/n₁) + (t₂/n₂) + (t₃/n₃) = (6.0 / 1.50) + (8.0 / (4/3)) + (4.2 / 1.40) = 4.0 + 6.0 + 3.0 = 13.0 cm."
  },
  {
    q: "Why does an object at the bottom of a rectangular glass block appear closer to the top surface when viewed from the air above?",
    opts: [
      "Light rays from the object bend towards the normal when leaving the glass into the air",
      "Light rays from the object travel from an optically denser medium (glass) into a less dense medium (air) and bend AWAY from the normal, so their backward extensions intersect above the real object",
      "The glass block physically lifts the object upward by electrostatic attraction",
      "Total internal reflection prevents any light rays from leaving the top surface of the glass"
    ],
    ans: 1,
    exp: "Rays leaving the object travel from glass (optically denser) into air (optically less dense) and refract away from the normal (e > r). To the observer's eye in air, these diverging rays appear to originate from a virtual image I located higher up at depth A = R/n."
  },
  {
    q: "In an experiment to determine the refractive index of a rectangular glass block by the method of no-parallax, how does the student confirm that the search pin clamped on the retort stand is at the exact position of the virtual image?",
    opts: [
      "The search pin touches the bottom of the drawing board",
      "When the student moves the eye from side to side while looking from above, the virtual image of the object pin and the search pin remain aligned together with zero relative motion",
      "The search pin casts a shadow twice as long as the glass block",
      "The angle of incidence equals 90°"
    ],
    ans: 1,
    exp: "No-parallax occurs when two objects lie at the exact same distance from the observer: moving the head side to side produces zero relative displacement between the search pin and the virtual image seen through the block."
  },
  {
    q: "In a WAEC practical on real and apparent depth using glass blocks of different thicknesses, a student plots Real Depth R on the vertical axis against Apparent Depth A on the horizontal axis. What is the physical meaning of the slope of the graph?",
    opts: [
      "The critical angle c of the glass",
      "The reciprocal of the refractive index (1/n)",
      "The refractive index n of the glass",
      "The vertical displacement d_v of the block"
    ],
    ans: 2,
    exp: "Since n = R / A ⇒ R = n A, plotting R (vertical) against A (horizontal) gives a straight line through the origin with slope ΔR / ΔA = n."
  },
  {
    q: "An air bubble is trapped inside a solid rectangular glass paperweight (n = 1.50) of total thickness 10.0 cm. When viewed vertically from the top face, the bubble appears to be at a depth of 4.0 cm. When viewed vertically from the bottom face, what is its apparent depth?",
    opts: ["2.67 cm", "4.00 cm", "6.00 cm", "6.67 cm"],
    ans: 0,
    exp: "From the top face, apparent depth A₁ = 4.0 cm, so real depth from the top face is R₁ = n A₁ = 1.50 × 4.0 = 6.0 cm. Since total thickness is 10.0 cm, real distance from the bottom face is R₂ = 10.0 − 6.0 = 4.0 cm. Viewed from the bottom face, apparent depth A₂ = R₂ / n = 4.0 / 1.50 = 2.67 cm."
  },
  {
    q: "A stamp lies on a table and a rectangular glass block of thickness 6.0 cm and refractive index 1.50 is held 5.0 cm above the stamp (with air in between). Through what vertical distance does the stamp appear raised when viewed vertically through the glass block?",
    opts: ["1.67 cm", "2.00 cm", "3.67 cm", "4.00 cm"],
    ans: 1,
    exp: "The upward vertical shift d_v = t(1 − 1/n) depends ONLY on the thickness t and refractive index n of the glass slab, NOT on the air gap beneath it! Thus d_v = 6.0 × (1 − 1/1.50) = 6.0 × (1/3) = 2.00 cm."
  },
  {
    q: "If the refractive index of a liquid is 1.25 and a pin at the bottom of a beaker containing the liquid appears to be at a depth of 12.0 cm when viewed vertically from above, how far has the image of the pin been displaced upward from the bottom?",
    opts: ["2.4 cm", "3.0 cm", "9.6 cm", "15.0 cm"],
    ans: 1,
    exp: "Given apparent depth A = 12.0 cm and n = 1.25, real depth R = n A = 1.25 × 12.0 = 15.0 cm. Upward vertical displacement d_v = R − A = 15.0 − 12.0 = 3.0 cm."
  },
  {
    q: "A fish is at a real depth of 1.20 m below the calm surface of a Lagos lagoon (n = 4/3). A kingfisher bird is hovering vertically above the fish at a height of 1.80 m above the water surface. At what apparent distance below the water surface does the bird see the fish?",
    opts: ["0.30 m", "0.90 m", "1.20 m", "1.60 m"],
    ans: 1,
    exp: "Light travels from the fish in water (n = 4/3) into air where the bird is looking: apparent depth below the water surface is A = R / n = 1.20 ÷ (4/3) = 1.20 × (3/4) = 0.90 m. (So total apparent distance from the bird is 1.80 + 0.90 = 2.70 m)."
  },
  {
    q: "In deriving the formula n = Real Depth / Apparent Depth for an object viewed vertically through a rectangular glass block, which small-angle trigonometric approximation is used for rays close to the normal?",
    opts: [
      "sin θ ≈ cos θ",
      "sin θ ≈ tan θ (for small angles θ near 0°)",
      "tan θ ≈ 1 / sin θ",
      "cos θ ≈ 0"
    ],
    ans: 1,
    exp: "For paraxial rays very close to the normal (small i and r), cos θ ≈ 1 so sin θ ≈ tan θ. Thus n = sin e / sin r ≈ tan e / tan r = (x / A) ÷ (x / R) = R / A."
  }
];
