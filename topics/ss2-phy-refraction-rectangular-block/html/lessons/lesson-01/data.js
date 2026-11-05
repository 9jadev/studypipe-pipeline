/* Lesson 01 · Data: Refraction at Plane Surfaces, Wavefront Speed & Snell's Law */
window.L01 = {
  items: [
    { id: "v",   emo: "🐢", name: "Wave Speed v in Glass", bin: "shm", why: "Decreases from 3.0 × 10⁸ m s⁻¹ in air to v = c/n = 2.0 × 10⁸ m s⁻¹ in crown glass (n = 1.50)." },
    { id: "lam", emo: "📏", name: "Wavelength λ in Glass", bin: "shm", why: "Compresses by factor n (λ_g = λ_air / n) because the leading wavefront slows while frequency stays fixed." },
    { id: "ang", emo: "📐", name: "Angle with Normal (r < i)", bin: "shm", why: "Decreases when light enters an optically denser medium (bends towards the normal)." },
    { id: "dev", emo: "↗️", name: "Angular Deviation (D = i − r)", bin: "shm", why: "At a single air-to-glass boundary (oblique incidence), the ray deviates towards the normal by D = i − r." },
    { id: "f",   emo: "🎵", name: "Wave Frequency f (Hz)", bin: "periodic", why: "Remains strictly CONSTANT across any boundary because frequency is determined solely by the source." },
    { id: "T",   emo: "⏱️", name: "Wave Period T = 1/f", bin: "periodic", why: "Remains strictly CONSTANT because frequency f does not change on refraction." },
    { id: "col", emo: "🎨", name: "Perceived Colour / Photon Energy hf", bin: "periodic", why: "Remains CONSTANT because photon energy E = hf depends on frequency f, not wavelength." },
    { id: "rat", emo: "⚖️", name: "Snell's Ratio (sin i ÷ sin r)", bin: "periodic", why: "Remains CONSTANT (= n) for a given pair of media and monochromatic wavelength." },
    { id: "gl",  emo: "⚠️", name: "Glancing Angle g Trap", bin: "non", why: "Glancing angle g is measured from the surface, so you MUST convert i = 90° − g before applying Snell's law!" },
    { id: "nrm", emo: "🎯", name: "Normal Incidence (i = 0°)", bin: "non", why: "At i = 0°, r = 0° (zero angular bending), even though wave speed v and wavelength λ still decrease by factor n!" },
    { id: "brw", emo: "⊥",  name: "Reflected ⊥ Refracted (90° Apart)", bin: "non", why: "When reflected and refracted rays are at 90°, i + r = 90° so sin r = cos i and n = tan i!" },
    { id: "rev", emo: "🔄", name: "Reversibility (g_n_a = 1 / a_n_g)", bin: "non", why: "If air-to-glass refractive index is 3/2 (1.50), then glass-to-air refractive index is its reciprocal 2/3 (0.67)." }
  ],

  trials: [
    { label: "A", L: 15, t: "0.259", T: "0.173", T2: "1.50" },
    { label: "B", L: 30, t: "0.500", T: "0.333", T2: "1.50" },
    { label: "C", L: 45, t: "0.707", T: "0.471", T2: "1.50" },
    { label: "D", L: 56.3, t: "0.832", T: "0.555", T2: "1.50" },
    { label: "E", L: 60, t: "0.866", T: "0.577", T2: "1.50" }
  ],
  tOptions:  ["0.259", "0.500", "0.707", "0.832", "0.866", "0.940"],
  TOptions:  ["0.173", "0.333", "0.471", "0.555", "0.577", "0.643"],
  T2Options: ["0.67", "1.33", "1.50", "1.65", "2.42"],

  pins: [
    { frac: -1.0, emo: "💨", label: "Air / Vacuum", x: "n = 1.00", v: "3.00 × 10⁸ m s⁻¹", a: "λ = 600 nm", ke: "i = 45°", pe: "r = 45.0°", note: "Reference medium: no slowing and zero refraction (r = i)." },
    { frac: -0.5, emo: "💧", label: "Pure Water", x: "n = 1.33 (4/3)", v: "2.25 × 10⁸ m s⁻¹", a: "λ = 450 nm", ke: "i = 45°", pe: "r = 32.1°", note: "Wavefronts slow to ¾ of c; at i = 45°, refracted angle r = 32.1°." },
    { frac: 0.0,  emo: "🪟", label: "Crown Glass", x: "n = 1.50 (3/2)", v: "2.00 × 10⁸ m s⁻¹", a: "λ = 400 nm", ke: "i = 45°", pe: "r = 28.1°", note: "Standard WAEC glass block: speed drops to ⅔ of c (2.0 × 10⁸ m s⁻¹) and λ shrinks from 600 nm to 400 nm." },
    { frac: 0.5,  emo: "🔮", label: "Dense Flint Glass", x: "n = 1.65", v: "1.82 × 10⁸ m s⁻¹", a: "λ = 364 nm", ke: "i = 45°", pe: "r = 25.4°", note: "Higher optical density bends the ray closer to the normal (r = 25.4°)." },
    { frac: 1.0,  emo: "💎", label: "Diamond", x: "n = 2.42", v: "1.24 × 10⁸ m s⁻¹", a: "λ = 248 nm", ke: "i = 45°", pe: "r = 17.0°", note: "Extreme slowing (v = 1.24 × 10⁸ m s⁻¹) causes dramatic bending towards the normal (r = 17.0°)." }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "When a beam of monochromatic red light travels from air into a rectangular crown-glass block (n = 1.50), which of the following combinations correctly describes what happens to its speed v, wavelength λ, and frequency f?",
    opts: [
      "Speed v decreases, wavelength λ decreases, and frequency f decreases",
      "Speed v decreases, wavelength λ decreases, and frequency f remains constant",
      "Speed v increases, wavelength λ increases, and frequency f remains constant",
      "Speed v decreases, wavelength λ remains constant, and frequency f decreases"
    ],
    ans: 1,
    exp: "Frequency f is determined solely by the oscillating source and never changes across a boundary. Because v = fλ and speed drops to v = c/n inside glass, wavelength λ = λ_air / n decreases in the exact same proportion while f stays constant."
  },
  {
    q: "A ray of light in air strikes the flat top surface of a rectangular glass block at a glancing angle of 60° with the glass surface. If the angle of refraction inside the glass is 19.5°, what is the refractive index of the glass? (Take sin 30° = 0.500, sin 60° = 0.866, sin 19.5° = 0.333)",
    opts: ["1.15", "1.50", "1.73", "2.60"],
    ans: 1,
    exp: "Angle of incidence i is measured from the normal, not the surface! Given glancing angle g = 60°, i = 90° − 60° = 30°. By Snell's law: n = sin i / sin r = sin 30° / sin 19.5° = 0.500 / 0.333 = 1.50."
  },
  {
    q: "Monochromatic light of frequency 5.0 × 10¹⁴ Hz travels in air at 3.0 × 10⁸ m s⁻¹ and enters a glass block of refractive index 1.50. What is the wavelength of the light inside the glass block?",
    opts: ["2.0 × 10⁻⁷ m (200 nm)", "4.0 × 10⁻⁷ m (400 nm)", "6.0 × 10⁻⁷ m (600 nm)", "9.0 × 10⁻⁷ m (900 nm)"],
    ans: 1,
    exp: "In air, λ_air = c / f = (3.0 × 10⁸) / (5.0 × 10¹⁴) = 6.0 × 10⁻⁷ m (600 nm). Inside glass of n = 1.50, λ_glass = λ_air / n = 600 nm / 1.50 = 400 nm = 4.0 × 10⁻⁷ m."
  },
  {
    q: "A ray of light in air is incident on a plane glass surface at an angle of incidence i = 60°. It is observed that the partially reflected ray and the refracted ray are perpendicular (at 90°) to each other. What is the refractive index n of the glass?",
    opts: ["0.577 (1/√3)", "0.866 (√3/2)", "1.500 (3/2)", "1.732 (√3)"],
    ans: 3,
    exp: "Along the straight normal line, i_reflection + 90° + r = 180°. Since i_reflection = i, we have r = 90° − i. Substituting into Snell's law gives n = sin i / sin(90° − i) = sin i / cos i = tan i = tan 60° = √3 = 1.732."
  },
  {
    q: "Which of the following statements correctly describes what happens when a light ray in air strikes a rectangular glass block along the normal to its surface?",
    opts: [
      "The angle of incidence is 90° and the ray is completely reflected back into the air",
      "The angle of incidence is 0°, the angle of refraction is 0°, and the speed of light remains 3.0 × 10⁸ m s⁻¹ inside the glass",
      "The angle of incidence is 0°, the ray passes straight through without angular deviation (r = 0°), but its speed decreases inside the glass",
      "The ray bends at 45° to the normal because the refractive index of glass is greater than 1"
    ],
    ans: 2,
    exp: "Along the normal, i = 0°, so sin r = (sin 0°)/n = 0 ⇒ r = 0° (zero angular deviation). However, the entire wavefront enters the glass simultaneously and slows down to v = c/n."
  },
  {
    q: "The absolute refractive index of water is 4/3 and that of crown glass is 3/2. What is the refractive index of crown glass with respect to water (w_n_g), and how does a ray behave when passing from water into glass?",
    opts: [
      "w_n_g = 9/8 = 1.125; the ray bends towards the normal",
      "w_n_g = 8/9 = 0.889; the ray bends away from the normal",
      "w_n_g = 2.00; the ray bends towards the normal",
      "w_n_g = 9/8 = 1.125; the ray bends away from the normal"
    ],
    ans: 0,
    exp: "The relative refractive index from water to glass is w_n_g = n_g / n_w = (3/2) ÷ (4/3) = (3/2) × (3/4) = 9/8 = 1.125. Because glass is optically denser than water (n_g > n_w), the ray slows down and bends towards the normal."
  },
  {
    q: "If the refractive index of a rectangular glass block with respect to air (a_n_g) is 1.60, what is the refractive index of air with respect to the glass block (g_n_a)?",
    opts: ["0.400", "0.625", "1.333", "1.600"],
    ans: 1,
    exp: "By the principle of reversibility of light, g_n_a = 1 / a_n_g = 1 / 1.60 = 0.625."
  },
  {
    q: "A light ray travels from air into a glass block of refractive index n = √2 at an angle of incidence of 45°. What is the angle of deviation D = i − r at this single air–glass boundary?",
    opts: ["15°", "30°", "45°", "60°"],
    ans: 0,
    exp: "By Snell's law, sin r = sin 45° / √2 = (1/√2) / √2 = 1/2 = 0.500, so r = 30°. At a single plane boundary, the angular deviation is D = i − r = 45° − 30° = 15°."
  },
  {
    q: "Light travels at 2.25 × 10⁸ m s⁻¹ in liquid X and at 1.80 × 10⁸ m s⁻¹ in glass Y. When a ray passes from liquid X into glass Y with an angle of incidence of 53.1° (sin 53.1° = 0.800), what is the sin of the angle of refraction in glass Y?",
    opts: ["0.480", "0.600", "0.640", "0.750"],
    ans: 2,
    exp: "Since sin θ₁ / sin θ₂ = v₁ / v₂, we have sin r = sin i × (v₂ / v₁) = 0.800 × (1.80 × 10⁸ / 2.25 × 10⁸) = 0.800 × 0.800 = 0.640."
  },
  {
    q: "Which of the following graphs gives a straight line passing through the origin whose gradient equals the refractive index n of the glass block?",
    opts: [
      "Angle of incidence i (vertical) plotted against angle of refraction r (horizontal)",
      "sin r (vertical) plotted against sin i (horizontal)",
      "sin i (vertical) plotted against sin r (horizontal)",
      "cos i (vertical) plotted against cos r (horizontal)"
    ],
    ans: 2,
    exp: "From Snell's law, sin i = n sin r. Comparing with y = mx, plotting y = sin i on the vertical axis against x = sin r on the horizontal axis yields a straight line through (0, 0) with gradient m = n."
  },
  {
    q: "What is the fundamental physical cause of the refraction (bending) of a light wave when it enters a glass block obliquely from air?",
    opts: [
      "A change in the frequency of the light wave at the boundary",
      "A change in the speed of the light wave as different parts of each wavefront cross the boundary at different times",
      "Total reflection of the light wave by the surface atoms of the glass",
      "Gravitational attraction between the glass block and the light photons"
    ],
    ans: 1,
    exp: "When a plane wavefront approaches a glass boundary at an oblique angle, one edge enters the glass first and slows down (v = c/n) while the other edge is still moving faster in air. This speed difference causes the wavefront to pivot."
  },
  {
    q: "An incident ray in air makes an angle of incidence i with the normal to a glass slab of refractive index n = 1.50. If the angle of refraction r is exactly half the angle of incidence (i = 2r), what is the value of cos r?",
    opts: ["0.500", "0.667", "0.750", "0.866"],
    ans: 2,
    exp: "Using Snell's law: n = sin i / sin r = sin(2r) / sin r. Since sin(2r) = 2 sin r cos r, we get n = 2 cos r ⇒ cos r = n / 2 = 1.50 / 2 = 0.750."
  }
];
