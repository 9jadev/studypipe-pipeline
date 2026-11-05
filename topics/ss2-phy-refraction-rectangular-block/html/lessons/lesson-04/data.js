/* Lesson 04 · Data: Critical Angle, Total Internal Reflection & Optical Fibre Engineering */
window.L01 = {
  items: [
    { id: "sub", emo: "↗️", name: "Ray Inside Glass at i = 30° (< c = 41.8°)", bin: "shm", why: "Since i < c, the ray refracts out into the air away from the normal (e = 48.6°) with weak partial reflection." },
    { id: "crt", emo: "📏", name: "Ray Inside Glass at i = c = 41.8°", bin: "shm", why: "At the critical angle c, the refracted ray grazes the glass–air boundary at r = 90° (sin c = 1/n)." },
    { id: "air", emo: "🚫", name: "Ray in Air Entering Glass at i = 60°", bin: "shm", why: "Light travelling from less dense (air) to denser (glass) ALWAYS refracts into the glass — TIR can never happen from air to glass!" },
    { id: "spd", emo: "⚡", name: "Wave Speed Shortcut v = c₀ sin c", bin: "shm", why: "Combining sin c = 1/n and v = c₀/n gives the speed of light in the medium directly as v = c₀ sin c." },
    { id: "tir", emo: "🪞", name: "Ray Inside Glass at i = 45° (> c = 41.8°)", bin: "periodic", why: "Both conditions for TIR are met (denser to less dense AND i > c), so 100% of the light reflects internally at 45°!" },
    { id: "cnd", emo: "✅", name: "Two Conditions: n₁ > n₂ AND i > c", bin: "periodic", why: "Total Internal Reflection occurs ONLY when light travels from optically denser to less dense medium at i > c." },
    { id: "law", emo: "📐", name: "Obeys Law of Reflection (θ_refl = i)", bin: "periodic", why: "During Total Internal Reflection, zero light escapes and the angle of internal reflection equals the angle of incidence i." },
    { id: "rel", emo: "🧮", name: "Two-Media Critical Angle sin c = n₂ ÷ n₁", bin: "periodic", why: "At the boundary between denser medium n₁ and less dense medium n₂, sin c = n₂ / n₁ (e.g. glass core into cladding)." },
    { id: "fib", emo: "🌐", name: "Optical Fibre (n_core > n_cladding)", bin: "non", why: "High-index silica core surrounded by lower-index cladding traps laser pulses by repeated TIR at i > c." },
    { id: "prm", emo: "🔭", name: "45°–45°–90° Periscope & Binocular Prisms", bin: "non", why: "Because 45° > 41.8°, glass prisms reflect 100% of light without silvering tarnish or thick-mirror multiple ghost images." },
    { id: "mir", emo: "🛣️", name: "Hot-Asphalt Road Mirage in Afternoon Sun", bin: "non", why: "Rays from the sky bend through hotter, less dense air layers near the road until i > c and undergo upward TIR." },
    { id: "dia", emo: "💎", name: "Diamond Sparkle (n = 2.42, c = 24.4°)", bin: "non", why: "Diamond's tiny critical angle (24.4°) traps almost all entering light by multiple internal reflections before exiting the top facets." }
  ],

  trials: [
    { label: "A", L: 20.0, t: "30.9°",         T: "Refraction (i < c)",        T2: "1.50" },
    { label: "B", L: 30.0, t: "48.6°",         T: "Refraction (i < c)",        T2: "1.50" },
    { label: "C", L: 41.8, t: "90.0° (Graze)", T: "Critical Angle (i = c)",    T2: "1.50" },
    { label: "D", L: 45.0, t: "None (TIR 45°)",T: "Total Internal Refl (i > c)",T2: "1.50" },
    { label: "E", L: 60.0, t: "None (TIR 60°)",T: "Total Internal Refl (i > c)",T2: "1.50" }
  ],
  tOptions:  ["30.9°", "48.6°", "90.0° (Graze)", "None (TIR 45°)", "None (TIR 60°)"],
  TOptions:  ["Refraction (i < c)", "Critical Angle (i = c)", "Total Internal Refl (i > c)"],
  T2Options: ["0.67", "1.33", "1.50", "1.65", "2.42"],

  pins: [
    { frac: -1.0, emo: "💧", label: "Water → Air", x: "n = 1.33 (4/3)", v: "c = 48.6°", a: "v = 2.25 × 10⁸ m s⁻¹", ke: "sin c = 0.750", pe: "TIR for i > 48.6°", note: "Underwater diver's Snell's window: rays hitting the water surface beyond 48.6° reflect totally back down." },
    { frac: -0.5, emo: "🪟", label: "Crown Glass → Air", x: "n = 1.50 (3/2)", v: "c = 41.8°", a: "v = 2.00 × 10⁸ m s⁻¹", ke: "sin c = 0.667", pe: "45° Prism TIR!", note: "Because c = 41.8° < 45°, a ray hitting the hypotenuse of a 45°–45°–90° crown-glass prism at 45° undergoes 100% TIR!" },
    { frac: 0.0,  emo: "🔮", label: "Dense Flint Glass → Air", x: "n = 1.65", v: "c = 37.3°", a: "v = 1.82 × 10⁸ m s⁻¹", ke: "sin c = 0.606", pe: "TIR for i > 37.3°", note: "Higher refractive index lowers the critical angle to 37.3°." },
    { frac: 0.5,  emo: "🌐", label: "Yaba Optical Fibre (Core → Cladding)", x: "n₁ = 1.52, n₂ = 1.42", v: "c = 69.1°", a: "sin c = n₂ / n₁", ke: "sin c = 0.934", pe: "Guided TIR > 69.1°", note: "In an optical fibre, sin c = n_cladding / n_core = 1.42 / 1.52 = 0.9342 ⇒ c = 69.1°." },
    { frac: 1.0,  emo: "💎", label: "Diamond → Air", x: "n = 2.42", v: "c = 24.4°", a: "v = 1.24 × 10⁸ m s⁻¹", ke: "sin c = 0.413", pe: "Brilliant Sparkle!", note: "Diamond has a tiny critical angle of 24.4°, trapping light inside for brilliant sparkle." }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "What are the two mandatory physical conditions required for Total Internal Reflection (TIR) of light to occur at a boundary between two transparent media?",
    opts: [
      "Light must travel from an optically less dense medium to a denser medium, and the angle of incidence must be less than the critical angle",
      "Light must travel from an optically denser medium to an optically less dense medium, and the angle of incidence in the denser medium must exceed the critical angle (i > c)",
      "The angle of incidence must be 0° along the normal, and the two media must have the same refractive index",
      "Light must travel in a vacuum, and its wavelength must be greater than 700 nm"
    ],
    ans: 1,
    exp: "Total Internal Reflection occurs if and only if (1) light travels from an optically denser medium to an optically less dense medium (n₁ > n₂), and (2) the angle of incidence in the denser medium is greater than the critical angle (i > c)."
  },
  {
    q: "Calculate the critical angle c for a rectangular crown-glass block of refractive index n = 1.50 placed in air. (sin 41.8° = 0.667, sin 48.6° = 0.750)",
    opts: ["30.0°", "41.8°", "45.0°", "48.6°"],
    ans: 1,
    exp: "Using sin c = 1 / n = 1 / 1.50 = 0.6667, we get c = sin⁻¹(0.6667) = 41.8°."
  },
  {
    q: "The critical angle for a certain transparent solid in air is 30°. If the speed of light in air is 3.0 × 10⁸ m s⁻¹, what are the refractive index n of the solid and the speed of light v inside the solid?",
    opts: [
      "n = 1.50, v = 2.0 × 10⁸ m s⁻¹",
      "n = 2.00, v = 1.5 × 10⁸ m s⁻¹",
      "n = 2.00, v = 6.0 × 10⁸ m s⁻¹",
      "n = 0.50, v = 1.5 × 10⁸ m s⁻¹"
    ],
    ans: 1,
    exp: "Refractive index n = 1 / sin c = 1 / sin 30° = 1 / 0.50 = 2.00. Speed of light inside the solid is v = c₀ sin c = c₀ / n = (3.0 × 10⁸) × 0.50 = 1.5 × 10⁸ m s⁻¹."
  },
  {
    q: "A step-index optical fibre used in the Yaba telecommunications hub has a glass core of refractive index n₁ = 1.60 surrounded by a glass cladding of refractive index n₂ = 1.44. What is the critical angle c at the core–cladding boundary?",
    opts: ["36.9°", "41.8°", "53.1°", "64.2°"],
    ans: 3,
    exp: "At the boundary between two media n₁ > n₂, sin c = n₂ / n₁ = 1.44 / 1.60 = 0.9000. Therefore c = sin⁻¹(0.9000) = 64.2°."
  },
  {
    q: "Why are right-angled isosceles glass prisms (45°–45°–90°, n = 1.50) preferred over plane silvered mirrors in precision periscopes and prism binoculars?",
    opts: [
      "Glass prisms absorb 50% of the light to protect the observer's eyes",
      "Glass prisms reflect 100% of the light by Total Internal Reflection (since i = 45° > c = 41.8°), do not tarnish like silvered coatings, and do not form multiple ghost images like thick mirrors",
      "Plane mirrors cannot reflect green light",
      "Glass prisms have a critical angle of 90°"
    ],
    ans: 1,
    exp: "In crown glass (c = 41.8°), a ray hitting the hypotenuse internally at i = 45° (> c) undergoes 100% Total Internal Reflection without any metallic absorption, silvering peeling/tarnishing, or front-and-back-surface ghost images."
  },
  {
    q: "A ray of light travelling inside a rectangular crown-glass block (n = 1.50, c = 41.8°) strikes the flat glass–air boundary at an internal angle of incidence of 50°. What happens to the ray?",
    opts: [
      "It refracts out into the air at an angle of 75° to the normal",
      "It travels along the glass surface at 90° to the normal",
      "It undergoes Total Internal Reflection back into the glass at an angle of reflection of 50°",
      "It passes straight into the air undeviated"
    ],
    ans: 2,
    exp: "Because the ray is travelling from glass (denser) towards air (less dense) and i = 50° > c = 41.8°, it undergoes Total Internal Reflection and reflects back into the glass obeying the law of reflection (angle of reflection = 50°)."
  },
  {
    q: "In an optical fibre cable consisting of a central glass core surrounded by a cladding layer, how must the refractive indices of the core and cladding be related?",
    opts: [
      "n_core must be greater than n_cladding (n_core > n_cladding)",
      "n_core must be less than n_cladding (n_core < n_cladding)",
      "n_core must be equal to n_cladding (n_core = n_cladding)",
      "n_core must be less than 1.00"
    ],
    ans: 0,
    exp: "For Total Internal Reflection to trap light inside the core, the core must be optically denser than the surrounding cladding: n_core > n_cladding."
  },
  {
    q: "On a hot sunny afternoon along the Lagos–Ibadan Expressway, a motorist sees what looks like a shimmering pool of water reflecting the sky on the distant tarred road. This optical mirage is caused by:",
    opts: [
      "Actual water condensing on the hot asphalt",
      "Progressive refraction of light from the sky through layers of air of decreasing optical density near the hot road, followed by Total Internal Reflection upward into the driver's eye",
      "Diffraction of sunlight by dust particles",
      "Dispersion of white light by the car windscreen"
    ],
    ans: 1,
    exp: "Air right above the sun-baked road is hotter and optically less dense than cooler air higher up. Downward rays from the sky bend away from the normal through successively warmer layers until i > c, undergoing upward Total Internal Reflection."
  },
  {
    q: "Light travels at speed v₁ = 1.80 × 10⁸ m s⁻¹ in medium P and at speed v₂ = 2.40 × 10⁸ m s⁻¹ in medium Q. What is the critical angle c for light travelling from medium P towards medium Q? (sin 48.6° = 0.750)",
    opts: ["30.0°", "41.8°", "48.6°", "60.0°"],
    ans: 2,
    exp: "Medium P has lower speed so it is optically denser (n_P > n_Q). The critical angle satisfies sin c = n_Q / n_P = v_P / v_Q = 1.80 / 2.40 = 0.750 ⇒ c = 48.6°."
  },
  {
    q: "Why does a cut diamond (n = 2.42) sparkle much more brilliantly than an identically cut piece of crown glass (n = 1.50)?",
    opts: [
      "Diamond generates its own internal light by radioactivity",
      "Diamond has a much smaller critical angle (c = 24.4°) than glass (c = 41.8°), so light entering diamond undergoes many more Total Internal Reflections before emerging through the top facets",
      "Diamond has a larger critical angle (85°) than crown glass",
      "Light travels faster in diamond than in air"
    ],
    ans: 1,
    exp: "Because sin c = 1 / 2.42 = 0.413 ⇒ c = 24.4° is very small, rays entering the diamond hit the pavilion facets at angles greater than 24.4° and undergo repeated Total Internal Reflection."
  },
  {
    q: "A ray of light inside water (n_w = 4/3) strikes a flat horizontal boundary with crown glass (n_g = 3/2) at an angle of incidence of 60°. Will Total Internal Reflection occur at this water–glass boundary?",
    opts: [
      "Yes, because 60° is greater than 48.6°",
      "No, because the ray is travelling from an optically less dense medium (water, n = 1.33) into an optically denser medium (glass, n = 1.50)",
      "Yes, because water is a liquid and glass is a solid",
      "Only if the light is violet"
    ],
    ans: 1,
    exp: "Trap alert! Water (n = 1.33) is optically LESS dense than crown glass (n = 1.50). When light travels from a less dense medium into a denser medium, it refracts towards the normal for every angle of incidence — Total Internal Reflection is impossible!"
  },
  {
    q: "When a right-angled 45°–45°–90° glass prism is used in a periscope to turn a light ray through 90°, the ray enters one short face along the normal (i = 0°), strikes the hypotenuse internally at 45°, and:",
    opts: [
      "Refracts out through the hypotenuse into the air",
      "Reflects totally at 45° (turning through 90°) and exits the second short face along the normal undeviated",
      "Turns through 180° back to the source",
      "Splits into seven rainbow rays inside the periscope"
    ],
    ans: 1,
    exp: "Entering the first short face along the normal (i = 0°), the ray passes undeviated to hit the 45° hypotenuse at internal incidence i = 45° (> c = 41.8°). It reflects totally at 45° (a 90° turn) and exits the second short face along its normal."
  }
];
