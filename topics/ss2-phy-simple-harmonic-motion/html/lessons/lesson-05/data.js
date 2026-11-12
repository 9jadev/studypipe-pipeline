/* Lesson 05 · WAEC Practical — Determining g with a Simple Pendulum.
   window.L05 holds the sort cards, the length-explorer pins and the mystery bridge questions.
   window.LESSON_QUIZ = the 12 MCQs of 03-questions.md § Lesson 05 Part 1 (order and keys unchanged).
   Every bench / zoom / graph number comes from PendulumKit.model, never from this file. */
(function () {
  "use strict";

  window.L05 = {
    // ---- 2A sort: precaution (past tense, something you did) or source of error ----
    bins: { precaution: "Precaution", error: "Source of error" },
    items: [
      { id: "angle",    bin: "precaution", name: "I ensured the bob swung through a small angle", why: "Something done to keep T = 2π√(l/g) valid, written in the past tense." },
      { id: "parallax", bin: "precaution", name: "I avoided parallax when reading the metre rule", why: "An action that improved the length reading, in the past tense." },
      { id: "restmark", bin: "precaution", name: "I started timing as the bob passed the rest mark", why: "The bob is fastest there, so the start and stop are sharpest." },
      { id: "plane",    bin: "precaution", name: "I ensured the bob swung in a vertical plane, not in a circle", why: "A conical path has a shorter period, so this was done to avoid it." },
      { id: "cork",     bin: "precaution", name: "I ensured the cork was tightly clamped", why: "A firm cork keeps the point of suspension fixed." },
      { id: "reaction", bin: "error",      name: "Reaction time in starting the stopwatch", why: "It spoils the timing; it is not something you did." },
      { id: "draught",  bin: "error",      name: "Air draughts in the room", why: "They push the bob and disturb its swing." },
      { id: "support",  bin: "error",      name: "The support moving slightly", why: "A moving support changes the effective length." },
      { id: "stretch",  bin: "error",      name: "Stretching of the thread", why: "A longer thread makes the recorded l too short." },
      { id: "miscount", bin: "error",      name: "Miscounting the oscillations", why: "A wrong n gives a wrong T, for example counting from one." }
    ],

    // ---- Position explorer (#pos-explorer): preset lengths, m ----
    pins: [0.400, 0.550, 0.700, 0.850, 1.000],

    // ---- the mystery bridge (#bridge) ----
    bridge: [
      {
        q: "Our class graph has a slope of 4.03 s² m⁻¹. What is g?",
        o: ["4.03 m s⁻²", "9.79 m s⁻²", "39.5 m s⁻²"],
        a: 1,
        why: "g = 4π² ÷ slope = 39.48 ÷ 4.03 = 9.79 m s⁻²."
      },
      {
        q: "The crates leave the carrier when the carrier's greatest acceleration…",
        o: ["ω²A reaches g", "ωA reaches g", "A reaches g"],
        a: 0,
        why: "The greatest acceleration in SHM is ω²A; once it reaches g the carrier drops away faster than a free crate falls."
      },
      {
        q: "With ω = 12.57 rad s⁻¹, the danger amplitude A = g ÷ ω² is about…",
        o: ["0.78 m", "6.2 cm", "16 m"],
        a: 1,
        why: "A = 9.79 ÷ 158 = 0.062 m = 6.2 cm."
      }
    ]
  };

  window.LESSON_QUIZ = [
    {
      src: "WAEC PRACTICAL · APPLY",
      q: "The thread of a pendulum measures 0.850 m from where it leaves the split cork down to the top of the bob. The bob's diameter is 3.0 cm. What is the effective length l?",
      o: ["0.880 m", "0.850 m", "0.865 m", "0.835 m"],
      a: 2,
      e: "The effective length runs from the point of suspension to the <em>centre</em> of the bob, so add the radius: <code>l = 0.850 + 0.015 = 0.865 m</code>. A added the whole diameter, measuring to the bottom of the bob. B is Tunde's slip of stopping at the top of the bob. D subtracted the radius instead of adding it."
    },
    {
      src: "WAEC PRACTICAL · APPLY",
      q: "A candidate's graph of T² (vertical) against l (horizontal) has a slope of 4.00 s² m⁻¹. What value of g does it give?",
      o: ["0.101 m s⁻²", "9.87 m s⁻²", "158 m s⁻²", "1.57 m s⁻²"],
      a: 1,
      e: "T² = (4π²/g) l, so slope = 4π²/g and <code>g = 4π²/slope = 39.48 ÷ 4.00 = 9.87</code> m s⁻². A is slope ÷ 4π², the rearrangement turned over. C multiplied the slope by 4π². D used 2π instead of 4π² (6.283 ÷ 4.00)."
    },
    {
      src: "WAEC PRACTICAL · ANALYSE",
      q: "Why does the WAEC pendulum practical ask candidates to plot T² against l rather than T against l?",
      o: [
        "T² values are larger and so easier to plot",
        "Squaring T removes the reaction-time error",
        "The T–l graph would have a negative slope",
        "T² is directly proportional to l, so the graph is a straight line through the origin whose slope, 4π²/g, gives g"
      ],
      a: 3,
      e: "Squaring T = 2π√(l/g) gives T² = (4π²/g) l, the form y = mx. A straight line is easy to draw as a best fit and its slope is easy to measure. A is not a reason examiners accept. B is false: squaring cannot remove an error, and it actually doubles the percentage error in T. C is false: T increases with l, but along a curve, not a straight line."
    },
    {
      src: "WAEC PRACTICAL · ANALYSE",
      q: "Throughout an experiment, Tunde measured every length to the <strong>top</strong> of the bob instead of its centre. How does this affect his T²–l graph?",
      o: [
        "The line no longer passes through the origin, but its slope, and so the value of g, is unaffected",
        "The slope becomes larger, so g comes out too small",
        "The slope becomes smaller, so g comes out too large",
        "The points scatter widely about the line"
      ],
      a: 0,
      e: "Every length is too short by the same amount, the radius r, so every point shifts left by r. The line keeps the same slope but now cuts the T² axis above zero (at T² = 4π²r/g). Because g comes from the slope, it is unaffected; this is one reason the graph method beats a single reading. B and C would need an error that grows with length. D describes a random error; a constant mistake on every reading moves the line, not the scatter."
    },
    {
      src: "WAEC PRACTICAL · ANALYSE",
      q: "Tunde starts the stopwatch and says \"one\" as he does so, then stops at \"twenty\". How does this affect his period and his value of g?",
      o: ["T is too large, so g is too small", "T and g are both unaffected", "T is too large, so g is too large", "T is too small, so g is too large"],
      a: 3,
      e: "Counting \"one\" at the start means only 19 oscillations have passed when he says \"twenty\", but he still divides the time by 20. So T is too small (by the factor 19/20) and g = 4π²l/T² comes out too large, by about 11 %. A has the direction reversed. B ignores the miscount. C pairs a larger T with a larger g, which the formula rules out, since g ∝ 1/T²."
    },
    {
      src: "WAEC PRACTICAL · UNDERSTAND",
      q: "Which of these is correctly written as a <strong>precaution</strong> for the pendulum experiment?",
      o: [
        "Ensure that the angle of swing is small",
        "I ensured that the bob swung through a small angle",
        "Reaction time when starting the stopwatch",
        "I was careful when taking all my readings"
      ],
      a: 1,
      e: "A precaution states something that <em>was done</em> to improve the result, in the past tense, and it is specific. A is an instruction (a command), which examiners do not credit. C is a source of error, not a precaution. D is too vague: it does not say what was done."
    },
    {
      src: "WAEC PRACTICAL · APPLY",
      q: "For one length, Zainab's two timings of 20 oscillations were 31.62 s and 31.70 s. What value should she enter in the T² column, to 3 decimal places?",
      o: ["1.583 s²", "2.500 s²", "2.506 s²", "0.632 s²"],
      a: 2,
      e: "Mean time <code>t̄ = (31.62 + 31.70) ÷ 2 = 31.66</code> s; <code>T = 31.66 ÷ 20 = 1.583</code> s; <code>T² = 1.583² = 2.506</code> s². A is T itself, not squared. B used only the first timing ((31.62 ÷ 20)²), ignoring the repeat. D is 1/T."
    },
    {
      src: "WAEC PRACTICAL · ANALYSE",
      q: "The ceiling was too high to reach, so a class measured the height y of the bob's centre above the floor instead. Their graph of T² against y is a straight line of slope −4.04 s² m⁻¹ that cuts the horizontal axis (where T² = 0) at y = 3.10 m. What are g and the height H of the point of suspension?",
      o: ["g = 9.77 m s⁻², H = 3.10 m", "g = −9.77 m s⁻², H = 3.10 m", "g = 9.77 m s⁻², H = 4.04 m", "g = 0.102 m s⁻², H = 3.10 m"],
      a: 0,
      e: "Here l = H − y, so T² = (4π²/g)(H − y): the slope is −4π²/g and the line cuts the horizontal axis (T² = 0) at y = H. Then <code>g = 4π²/|slope| = 39.48 ÷ 4.04 = 9.77</code> m s⁻² and H = 3.10 m. B keeps the minus sign; g cannot be negative, since the sign only shows that T² falls as y rises. C takes the slope's size as the height. D is |slope| ÷ 4π², the rearrangement upside down."
    },
    {
      src: "WAEC-STYLE · APPLY",
      q: "A thread is 0.580 m long from the cork to the top of a bob of radius 2.0 cm. Twenty oscillations take 31.20 s. What value of g does this single reading give?",
      o: ["9.73 m s⁻²", "9.41 m s⁻²", "15.2 m s⁻²", "0.024 m s⁻²"],
      a: 0,
      e: "<code>l = 0.580 + 0.020 = 0.600</code> m; <code>T = 31.20 ÷ 20 = 1.560</code> s; T² = 2.434 s²; <code>g = 39.48 × 0.600 ÷ 2.434 = 9.73</code> m s⁻². B left out the radius (l = 0.580 m). C divided by T instead of T². D used the whole time for 20 oscillations as if it were the period."
    },
    {
      src: "WAEC PRACTICAL · UNDERSTAND",
      q: "When finding the slope of the T²–l line, why should the candidate use a large triangle?",
      o: [
        "A large triangle makes the slope come out larger",
        "Examiners award marks only for the size of the drawing",
        "The readings of ΔT² and Δl are then large, so the small uncertainty in reading the graph is a small percentage of each",
        "A large triangle forces the line through the origin"
      ],
      a: 2,
      e: "Each value read from the graph carries roughly the same small reading uncertainty (about half a small square). Over a large Δ that uncertainty is a tiny fraction, so the slope is more accurate. A is false: the slope of a straight line is the same for any triangle drawn on it. B misses the physics. D is false: the triangle cannot change where the line goes."
    },
    {
      src: "WAEC PRACTICAL · ANALYSE",
      q: "Tunde released the bob through a wide angle of about 40° for every length. How did this most likely affect his value of g?",
      o: [
        "No effect, because the period does not depend on the amplitude at any angle",
        "g came out slightly too small, because each period was slightly too long",
        "g came out slightly too large, because each period was slightly too short",
        "g came out much too large, because the bob moved faster"
      ],
      a: 1,
      e: "At 40° the restoring force is no longer proportional to displacement, so each period is a little longer (about 3 %) than 2π√(l/g). A longer T in g = 4π²l/T² gives a smaller g. A applies the small-angle rule outside its range. C has the direction reversed. D ignores that the bob also has further to travel; the overall effect is a slightly <em>longer</em> period."
    },
    {
      src: "WAEC-STYLE · APPLY",
      q: "The class's value is g = 9.79 m s⁻², and the okada's rear bounces with ω = 12.57 rad s⁻¹. What is the smallest bounce amplitude that makes the crates leave the carrier?",
      o: ["0.78 m", "2.4 m", "16 m", "6.2 cm"],
      a: 3,
      e: "Lift-off when ω²A ≥ g, so <code>A = g/ω² = 9.79 ÷ 158 = 0.062</code> m = 6.2 cm. A divided by ω instead of ω². B divided by f² (2.0² = 4) instead of ω². C is ω²/g, the ratio upside down."
    }
  ];
})();
