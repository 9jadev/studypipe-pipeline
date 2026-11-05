/* Lesson 02 · Data: Path Through a Rectangular Glass Block, Lateral Displacement & Dispersion */
window.L01 = {
  items: [
    { id: "par", emo: "🛤️", name: "Emergent Ray Parallel to Incident (e = i)", bin: "shm", why: "Opposite faces of a rectangular glass block are parallel, so alternate angles r₁ = i₂ and e = i." },
    { id: "ndv", emo: "0️⃣", name: "Zero Net Angular Deviation (D_net = 0°)", bin: "shm", why: "Clockwise deviation at entry (i − r) is exactly cancelled by anticlockwise deviation (e − r) at exit." },
    { id: "col", emo: "🌈", name: "Red & Violet Emerge Parallel (No Rainbow Fan)", bin: "shm", why: "In a parallel-sided slab, both colours return to e = i in air and emerge parallel to the original ray." },
    { id: "alt", emo: "📐", name: "Parallel Normals (r₁ = i₂ inside Slab)", bin: "shm", why: "Normals to opposite parallel faces are parallel, making the internal refracted ray a transversal with r₁ = i₂." },
    { id: "thk", emo: "📏", name: "Doubling Block Thickness t", bin: "periodic", why: "Since d = t sin(i − r) / cos r, lateral displacement d is directly proportional to thickness t." },
    { id: "ang", emo: "📈", name: "Increasing Angle of Incidence i", bin: "periodic", why: "Larger i increases sin(i − r) / cos r, increasing the sideways shift d (up to d → t as i → 90°)." },
    { id: "idx", emo: "💎", name: "Using Higher Refractive Index n", bin: "periodic", why: "Higher n bends the internal ray closer to the normal (smaller r), increasing sin(i − r) and lateral shift d." },
    { id: "vio", emo: "🟣", name: "Switching from Red to Violet Light", bin: "periodic", why: "Violet has shorter wavelength λ and higher refractive index (n_v > n_r), so violet suffers larger lateral shift (d_v > d_r)." },
    { id: "prs", emo: "🔺", name: "Triangular 60° Glass Prism", bin: "non", why: "Non-parallel inclined faces bend the ray towards the base at BOTH surfaces, producing net angular deviation and a rainbow fan." },
    { id: "nrm", emo: "🎯", name: "Normal Incidence (i = 0°)", bin: "non", why: "At i = 0°, r = 0° and sin(i − r) = 0, so lateral displacement d = 0 cm (no sideways shift at all)." },
    { id: "ef",  emo: "📐", name: "Far-Face Shift EF = t tan r", bin: "non", why: "Distance along the opposite face from the normal foot to emergence point N is t tan r (different from perpendicular shift d!)." },
    { id: "hyp", emo: "📏", name: "Internal Ray Path Length ON = t / cos r", bin: "non", why: "The hypotenuse of the internal right triangle is ON = t sec r = √(t² + EF²), used to derive d = ON sin(i − r)." }
  ],

  trials: [
    { label: "A", L: 15, t: "9.9°",  T: "0.55", T2: "1.05" },
    { label: "B", L: 30, t: "19.5°", T: "1.16", T2: "2.12" },
    { label: "C", L: 45, t: "28.1°", T: "1.98", T2: "3.21" },
    { label: "D", L: 60, t: "35.3°", T: "3.07", T2: "4.24" },
    { label: "E", L: 75, t: "40.1°", T: "4.49", T2: "5.06" }
  ],
  tOptions:  ["9.9°", "19.5°", "28.1°", "35.3°", "40.1°", "45.0°"],
  TOptions:  ["0.00", "0.55", "1.16", "1.98", "3.07", "4.49"],
  T2Options: ["1.05", "2.12", "3.21", "4.24", "5.06", "6.00"],

  pins: [
    { frac: -1.0, emo: "🎯", label: "Normal Incidence (i = 0°)", x: "t = 6.0 cm, n = 1.50", v: "r = 0.0°, e = 0.0°", a: "d = 0.00 cm", ke: "EF = 0.00 cm", pe: "D_net = 0°", note: "At i = 0°, the ray passes straight along the normal with zero lateral displacement (d = 0)." },
    { frac: -0.5, emo: "🔦", label: "Small Oblique (i = 30°)", x: "t = 6.0 cm, n = 1.50", v: "r = 19.5°, e = 30.0°", a: "d = 1.16 cm", ke: "EF = 2.12 cm", pe: "D_net = 0°", note: "Moderate sideways shift d = 6.0 sin(10.5°)/cos(19.5°) = 1.16 cm." },
    { frac: 0.0,  emo: "✨", label: "Surulere Laser (i = 45°)", x: "t = 6.0 cm, n = 1.50", v: "r = 28.1°, e = 45.0°", a: "d = 1.98 cm", ke: "EF = 3.21 cm", pe: "D_net = 0°", note: "Dr Kunle's clinic benchmark: emergent ray is parallel (e = 45°) and shifted sideways by d = 1.98 cm!" },
    { frac: 0.5,  emo: "📐", label: "Steep Oblique (i = 60°)", x: "t = 6.0 cm, n = 1.50", v: "r = 35.3°, e = 60.0°", a: "d = 3.07 cm", ke: "EF = 4.24 cm", pe: "D_net = 0°", note: "Steeper angle of incidence increases lateral displacement to 3.07 cm." },
    { frac: 1.0,  emo: "🧱", label: "Double Thickness (t = 12.0 cm, i = 45°)", x: "t = 12.0 cm, n = 1.50", v: "r = 28.1°, e = 45.0°", a: "d = 3.96 cm", ke: "EF = 6.41 cm", pe: "D_net = 0°", note: "Doubling slab thickness t from 6.0 cm to 12.0 cm doubles lateral displacement d from 1.98 cm to 3.96 cm!" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "A ray of light in air strikes one face of a parallel-sided rectangular glass block at an angle of incidence of 48°. What are the angle of emergence e into the air at the opposite face and the net angular deviation of the ray?",
    opts: [
      "e = 30°, net angular deviation = 18°",
      "e = 48°, net angular deviation = 0°",
      "e = 48°, net angular deviation = 96°",
      "e = 90°, net angular deviation = 42°"
    ],
    ans: 1,
    exp: "Because opposite faces of a rectangular glass block are parallel, the internal angle of refraction r₁ equals the second angle of incidence i₂. By Snell's law, sin e = n sin r₁ = sin i ⇒ e = i = 48°. Since the emergent ray is parallel to the incident ray, the net angular deviation is 0°."
  },
  {
    q: "A ray of light enters a rectangular glass block of thickness t = 6.0 cm at an angle of incidence i = 60°. If the angle of refraction inside the block is r = 35.3°, what is the lateral displacement d of the emergent ray? (sin 24.7° = 0.418, cos 35.3° = 0.816)",
    opts: ["1.98 cm", "2.51 cm", "3.07 cm", "4.24 cm"],
    ans: 2,
    exp: "Using d = t sin(i − r) / cos r: here i − r = 60° − 35.3° = 24.7°, so d = 6.0 × sin 24.7° / cos 35.3° = 6.0 × 0.418 / 0.816 = 3.07 cm."
  },
  {
    q: "Which of the following changes will NOT increase the lateral displacement d of a monochromatic light ray passing through a rectangular glass block?",
    opts: [
      "Increasing the thickness t of the glass block",
      "Increasing the angle of incidence i (for 0° < i < 90°)",
      "Replacing the block with a glass of higher refractive index n",
      "Decreasing the angle of incidence i towards 0° (normal incidence)"
    ],
    ans: 3,
    exp: "Decreasing the angle of incidence i towards 0° reduces (i − r) towards zero, causing lateral displacement d = t sin(i − r) / cos r to decrease to zero at normal incidence."
  },
  {
    q: "When a narrow beam of white light enters a rectangular glass block obliquely from air, how do the red and violet components behave inside the block and after emerging into the air?",
    opts: [
      "Violet bends more than red inside the block, and they emerge into the air diverging at a wide angle",
      "Red bends more than violet inside the block, and they emerge parallel to each other",
      "Violet bends more than red inside the block (n_v > n_r), and both emerge into the air parallel to the original incident ray",
      "Red and violet travel along the exact same path inside the glass block without any separation"
    ],
    ans: 2,
    exp: "Violet light has a shorter wavelength and a slightly higher refractive index in glass than red light (n_v > n_r), so violet refracts closer to the normal (r_v < r_r) and suffers slightly greater lateral displacement. Because opposite faces are parallel, both emerge at e = i (parallel to each other)."
  },
  {
    q: "A ray of light is incident at i = 30° on a rectangular glass block of thickness t = 6.0 cm. If the refracted ray strikes the opposite parallel face at a distance EF = 2.0 cm from the foot of the normal, what is the refractive index n of the glass block?",
    opts: ["1.38", "1.45", "1.50", "1.58"],
    ans: 3,
    exp: "From the right-angled triangle inside the block, hypotenuse ON = √(t² + EF²) = √(6.0² + 2.0²) = √40 = 6.325 cm. Therefore sin r = EF / ON = 2.0 / 6.325 = 0.3162. By Snell's law: n = sin 30° / sin r = 0.500 / 0.3162 = 1.58."
  },
  {
    q: "What is the maximum theoretical limit approached by the lateral displacement d of a light ray passing through a rectangular glass block of thickness t as the angle of incidence i approaches 90° (grazing incidence)?",
    opts: ["Zero (0)", "Half the thickness (t / 2)", "The full thickness of the block (t)", "Infinite displacement (∞)"],
    ans: 2,
    exp: "Using d = t sin(i − r) / cos r = t(sin i cos r − cos i sin r)/cos r = t(sin i − cos i tan r). As i → 90°, sin i → 1 and cos i → 0, so d → t."
  },
  {
    q: "Why does a 60° triangular glass prism produce a wide angular spectrum from white light whereas a parallel-sided rectangular glass block does not?",
    opts: [
      "A triangular prism is made of glass with zero refractive index",
      "In a rectangular block, opposite faces are parallel so the second refraction cancels the angular deviation of the first; in a prism, the inclined faces add angular deviations towards the base",
      "White light cannot enter a rectangular glass block",
      "Total internal reflection destroys all colours except green inside a rectangular block"
    ],
    ans: 1,
    exp: "In a parallel-sided block, the two refractions bend the ray by equal and opposite angles (D_net = 0°). In a triangular prism, the two refracting surfaces are inclined at prism angle A, so both refractions bend the ray towards the base and amplify angular dispersion."
  },
  {
    q: "A light ray passes through a rectangular glass block of thickness 8.0 cm at an angle of incidence i = 45° and angle of refraction r = 30°. Calculate the length of the path ON travelled by the light inside the glass block. (cos 30° = 0.866)",
    opts: ["6.93 cm", "8.00 cm", "9.24 cm", "11.31 cm"],
    ans: 2,
    exp: "In the right-angled triangle formed with the normal of length t = 8.0 cm, cos r = t / ON ⇒ ON = t / cos r = 8.0 / cos 30° = 8.0 / 0.866 = 9.24 cm."
  },
  {
    q: "In Question 8 above (t = 8.0 cm, i = 45°, r = 30°, internal path ON = 9.24 cm), what is the lateral displacement d of the emergent ray? (sin 15° = 0.259)",
    opts: ["1.52 cm", "2.07 cm", "2.39 cm", "4.00 cm"],
    ans: 2,
    exp: "Lateral displacement d = ON sin(i − r) = 9.24 × sin(45° − 30°) = 9.24 × sin 15° = 9.24 × 0.259 = 2.39 cm."
  },
  {
    q: "A ray of light enters a rectangular glass block at an angle of incidence i = 50° and refracts at r = 30.7°. What is the angle of incidence i₂ at the second (bottom) parallel face inside the glass?",
    opts: ["19.3°", "30.7°", "50.0°", "59.3°"],
    ans: 1,
    exp: "Because the normals to the two parallel faces are parallel lines and the internal ray is a transversal intersecting both normals, the alternate interior angles are equal: i₂ = r₁ = 30.7°."
  },
  {
    q: "Two rectangular blocks P and Q of the exact same crown glass (n = 1.50) have thicknesses t_P = 4.0 cm and t_Q = 10.0 cm. If identical rays enter both blocks at i = 40°, what is the ratio of their lateral displacements d_P : d_Q?",
    opts: ["2 : 5", "5 : 2", "4 : 25", "1 : 1"],
    ans: 0,
    exp: "At the same angle of incidence i and same refractive index n, the factor sin(i − r)/cos r is identical for both blocks. Thus d is directly proportional to thickness t: d_P / d_Q = t_P / t_Q = 4.0 / 10.0 = 2 : 5."
  },
  {
    q: "Inside a rectangular glass block of perpendicular width w = 5.0 cm, a refracted ray makes an angle r = 36.9° with the normal (tan 36.9° = 0.750). How far from the foot of the normal along the opposite face does the ray emerge?",
    opts: ["3.00 cm", "3.75 cm", "4.00 cm", "6.25 cm"],
    ans: 1,
    exp: "From the right-angled triangle inside the block, tan r = EF / w ⇒ EF = w tan r = 5.0 × 0.750 = 3.75 cm."
  }
];
