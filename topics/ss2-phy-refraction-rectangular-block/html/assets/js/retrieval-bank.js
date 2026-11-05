/* ==========================================================
   StudyPipe — Spaced Retrieval Bank for Refraction of Light Through a Rectangular Glass Block (L1–L5)
   Used by LessonKit across lessons/lesson-01 .. lesson-05
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Refraction at Plane Surfaces, Wavefront Speed & Snell's Law",
    donow: [
      {
        from: 0, sec: "concepts", where: "Rectilinear Propagation & Speed of Light",
        q: "How does light travel in a uniform medium, and what is its speed c in air or vacuum?",
        a: "Light travels in <strong>straight lines</strong> in a homogeneous medium at <strong>c = 3.0 × 10<sup>8</sup> m s<sup>−1</sup></strong> in air or vacuum."
      },
      {
        from: 0, sec: "concepts", where: "Wave Equation",
        q: "Write the fundamental wave equation connecting wave speed v, frequency f, and wavelength λ.",
        a: "<strong>v = f λ</strong>, where v is in m s<sup>−1</sup>, f is in hertz (Hz), and λ is in metres (m)."
      },
      {
        from: 0, sec: "practical", where: "Measuring Angles from the Normal",
        q: "If an incident ray makes a glancing angle of 35° with a plane glass surface, what is the angle of incidence i?",
        a: "Angles in optics are always measured <strong>between the ray and the normal</strong>: <strong>i = 90° − 35° = 55°</strong>."
      },
      {
        from: 0, sec: "concepts", where: "Law of Reflection",
        q: "When part of an incident ray reflects at a boundary at angle of incidence i = 40°, what is the angle of reflection?",
        a: "By the law of reflection, the angle of reflection equals the angle of incidence: <strong>40°</strong>."
      }
    ],
    recall: {
      prompt: "Without looking back at the notes, tick off every core idea from Lesson 1 you can state from memory:",
      points: [
        "Refraction is caused by a change in the speed of light as wavefronts cross a boundary at an oblique angle.",
        "When light enters glass, speed v and wavelength λ decrease by factor n, while frequency f remains strictly constant.",
        "Snell's law states that n₁ sin θ₁ = n₂ sin θ₂, or n = sin i ÷ sin r = c ÷ v = λ_air ÷ λ_medium.",
        "A ray entering an optically denser medium bends towards the normal (r < i); at normal incidence (i = 0°), r = 0° with zero angular deviation.",
        "When the reflected and refracted rays are perpendicular (90° apart), r = 90° − i and n = sin i ÷ cos i = tan i."
      ]
    }
  },

  l02: {
    title: "Path Through a Rectangular Glass Block, Lateral Displacement & Dispersion",
    donow: [
      {
        from: 1, sec: "concepts", where: "Speed & Wavelength in Glass",
        q: "Light of wavelength 600 nm in air enters crown glass of refractive index n = 1.50. Find its speed v, wavelength λg, and whether frequency changes.",
        a: "<strong>v = c ÷ n = 2.0 × 10<sup>8</sup> m s<sup>−1</sup></strong>; <strong>λ<sub>g</sub> = 600 ÷ 1.50 = 400 nm</strong>; <strong>frequency f remains unchanged</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Glancing Angle Trap",
        q: "A ray in air strikes a plane glass block (n = 1.50) at a glancing angle g = 60° to the surface. What is the angle of incidence i and angle of refraction r?",
        a: "<strong>i = 90° − 60° = 30°</strong>. Then sin r = sin 30° ÷ 1.50 = 0.50 ÷ 1.50 = 0.3333 ⇒ <strong>r = 19.5°</strong>."
      },
      {
        from: 1, sec: "examples", where: "Perpendicular Reflected & Refracted Rays",
        q: "At what angle of incidence i on glass of refractive index n = 1.50 are the reflected and refracted rays perpendicular (90° apart)?",
        a: "When reflected ⊥ refracted, <strong>n = tan i = 1.50 ⇒ i = tan<sup>−1</sup>(1.50) = 56.3°</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Normal Incidence",
        q: "What happens to the direction and speed of a light ray striking a rectangular glass block along the normal (i = 0°)?",
        a: "It passes <strong>straight through undeviated (r = 0°)</strong>, but its speed still slows from 3.0 × 10<sup>8</sup> m s<sup>−1</sup> to c ÷ n."
      }
    ],
    recall: {
      prompt: "Without scrolling up, write down the core rectangular glass block and lateral displacement rules from Lesson 2 and tick what you remembered:",
      points: [
        "Because opposite faces of a rectangular glass block are parallel, r₁ = i₂ and the emergent ray leaves at e = i (strictly parallel to the incident ray).",
        "Net angular deviation through a parallel-sided rectangular glass block is zero (D_net = 0°).",
        "Lateral displacement d = t sin(i − r) ÷ cos r, which increases with block thickness t, angle of incidence i, and refractive index n.",
        "In a rectangular glass block, violet light has a higher refractive index than red (n_v > n_r) and shifts laterally further, but both colours emerge parallel to the original ray.",
        "Far-face shift EF = t tan r, where t is the perpendicular width of the block."
      ]
    }
  },

  l03: {
    title: "Real & Apparent Depth, Multi-Layer Slabs & The No-Parallax Method",
    donow: [
      {
        from: 2, sec: "concepts", where: "Emergent Angle & Net Deviation",
        q: "A ray enters a parallel-sided rectangular glass block at i = 48°. What are the angle of emergence e and the net angular deviation?",
        a: "<strong>Angle of emergence e = i = 48°</strong>, and <strong>net angular deviation = 0°</strong> because the opposite faces are parallel."
      },
      {
        from: 2, sec: "examples", where: "Lateral Displacement Formula",
        q: "Calculate the lateral displacement d for a glass block of thickness t = 6.0 cm when i = 60° and r = 35.3°.",
        a: "<strong>d = t sin(i − r) ÷ cos r = 6.0 × sin(24.7°) ÷ cos(35.3°) = 6.0 × 0.4179 ÷ 0.8161 = 3.07 cm</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Rectangular Block vs Triangular Prism",
        q: "Why does white light entering a rectangular glass block not spread into a diverging fan of colours on a distant screen like a triangular prism?",
        a: "Because the opposite faces are parallel, each colour's second refraction cancels its first angular deviation, so <strong>all emergent colours leave parallel to one another</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Snell's Law",
        q: "State the two laws of refraction of light at a plane boundary.",
        a: "(1) The incident ray, refracted ray, and normal at the point of incidence all lie in the same plane. (2) <strong>sin i ÷ sin r = constant (n)</strong> for a given pair of media."
      }
    ],
    recall: {
      prompt: "Close your notes and recall the core rules for real depth, apparent depth, vertical displacement, and no-parallax:",
      points: [
        "Refractive index from depth: n = Real Depth (R) ÷ Apparent Depth (A), so Apparent Depth A = R ÷ n.",
        "Vertical upward shift (apparent rise) d_v = R − A = R(1 − 1/n) = t(1 − 1/n).",
        "Exam trap: 'appears raised by x cm' gives vertical shift d_v = x, whereas 'appears to be at depth y cm' gives apparent depth A = y.",
        "For multiple immiscible transparent layers: Total Apparent Depth A_total = (t₁ ÷ n₁) + (t₂ ÷ n₂) + …",
        "In the no-parallax method, a search pin matches the virtual image depth when the pin and image move together with zero relative shift as the observer moves the eye side to side."
      ]
    }
  },

  l04: {
    title: "Critical Angle, Total Internal Reflection & Optical Fibre Engineering",
    donow: [
      {
        from: 3, sec: "examples", where: "Apparent Depth & Vertical Shift",
        q: "A rectangular glass block of thickness 9.0 cm and refractive index 1.50 rests over an ink mark. Find (a) the apparent depth A and (b) how much the ink mark appears raised.",
        a: "(a) <strong>A = R ÷ n = 9.0 ÷ 1.50 = 6.0 cm</strong>; (b) <strong>Upward shift d<sub>v</sub> = 9.0 − 6.0 = 3.0 cm</strong>."
      },
      {
        from: 3, sec: "examples", where: "Multi-Layer Apparent Depth",
        q: "A beaker holds 6.0 cm of glass (n = 1.50) topped by 8.0 cm of water (n = 4/3). What is the total apparent depth of the bottom?",
        a: "<strong>A<sub>total</sub> = (6.0 ÷ 1.50) + (8.0 ÷ (4/3)) = 4.0 + 6.0 = 10.0 cm</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Far-Face Shift EF",
        q: "In a rectangular glass block of width w = 6.0 cm, if the refracted ray makes r = 30° with the normal, how far along the opposite face (EF) does it strike?",
        a: "<strong>EF = w tan r = 6.0 × tan 30° = 6.0 × 0.5774 = 3.46 cm</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Reversibility of Light",
        q: "If the refractive index of glass with respect to air is 3/2, what is the refractive index of air with respect to glass?",
        a: "By the principle of reversibility of light, <strong><sub>g</sub>n<sub>a</sub> = 1 ÷ <sub>a</sub>n<sub>g</sub> = 2/3 = 0.67</strong>."
      }
    ],
    recall: {
      prompt: "Without looking back, recall the critical angle, total internal reflection, and optical fibre rules from Lesson 4:",
      points: [
        "Critical angle c is the angle of incidence in the optically denser medium for which the angle of refraction in the less dense medium is 90°: sin c = 1 ÷ n (or sin c = n₂ ÷ n₁).",
        "Two mandatory conditions for Total Internal Reflection (TIR): (1) light must travel from optically denser to optically less dense medium, and (2) angle of incidence i must exceed the critical angle (i > c).",
        "Combining v = c₀ ÷ n and sin c = 1 ÷ n gives speed in medium v = c₀ sin c.",
        "In an optical fibre, core refractive index must exceed cladding refractive index (n_core > n_cladding) so rays strike the boundary at i > c.",
        "Right-angled 45°–45°–90° glass prisms (c ≈ 41.8° < 45°) outperform silvered mirrors because TIR reflects 100% of light with no tarnishing and no thick-mirror multiple ghost images."
      ]
    }
  },

  l05: {
    title: "WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical & The 7 Graph Variants",
    donow: [
      {
        from: 4, sec: "concepts", where: "Critical Angle & Speed",
        q: "Find the critical angle c for crown glass (n = 1.50) in air, and state the formula linking wave speed v in a medium to c₀ and sin c.",
        a: "<strong>sin c = 1 ÷ 1.50 = 0.6667 ⇒ c = 41.8°</strong>. Speed in medium <strong>v = c₀ sin c</strong>."
      },
      {
        from: 4, sec: "concepts", where: "Two Conditions for TIR",
        q: "State the two compulsory conditions for Total Internal Reflection (TIR) to occur.",
        a: "(1) Light must travel from an <strong>optically denser to an optically less dense medium</strong>; (2) the <strong>angle of incidence must exceed the critical angle (i > c)</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Real Depth from Upward Shift",
        q: "A coin under a rectangular glass slab (n = 1.50) appears raised by 2.5 cm. What is the real thickness R of the slab?",
        a: "Using d<sub>v</sub> = R(1 − 1/n): <strong>2.5 = R(1 − 2/3) = R ÷ 3 ⇒ R = 7.5 cm</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Lateral Displacement Factors",
        q: "State three factors that increase the lateral displacement d of a ray passing through a rectangular glass block.",
        a: "(1) Greater <strong>thickness t</strong> of the block; (2) larger <strong>angle of incidence i</strong>; (3) higher <strong>refractive index n</strong> (or shorter wavelength λ)."
      }
    ],
    recall: {
      prompt: "Without scrolling up, write down the WAEC Paper 3 four-pin ray-tracing rules and graph slope decoders from Lesson 5:",
      points: [
        "Always view the bases (feet) of optical pins P₁, P₂, P₃, P₄ where they enter the board, because a tilted pin's top does not lie over its base.",
        "Space adjacent optical pins at least 4 cm to 5 cm apart and keep pins strictly vertical to minimise angular alignment error.",
        "Slope decoders: sin i vs sin r has slope = n; sin r vs sin i has slope = 1/n; cos i vs cos r has no constant slope so evaluate n = √((1 − x₁²)/(1 − y₁²)).",
        "Right-triangle decoders: LE = w tan r and LN = w sec r, so plotting LE vs tan r or LN vs sec r gives slope = block width w; plotting sin i vs LE/LN (= sin r) gives slope = n.",
        "WAEC decimal-place convention: angles in degrees to 1 d.p., lengths in cm to 1 or 2 d.p., and trigonometric ratios (sin, cos, tan) to 3 d.p."
      ]
    }
  }
};
