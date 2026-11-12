/* Lesson 04 · The Simple Pendulum — Restoring Force, Small Angles and T = 2π√(l/g)
   Sort cards, angle-pin explorer, the Bridge steps and the 12 quiz questions
   (03-questions.md § Lesson 04, order and keys unchanged). Every number on the bench and the
   explorer is computed from PendulumKit.model / ShmKinematics2D.model, never typed in. */
(function () {
  "use strict";

  var G = 9.8;
  var PM = window.PendulumKit && window.PendulumKit.model;
  var SM = window.ShmKinematics2D && window.ShmKinematics2D.model;
  var D2R = Math.PI / 180;

  // fallbacks (only if a kit failed to load): the same formulas the kits use
  function agm(a, b) { for (var i = 0; i < 30; i++) { var a1 = (a + b) / 2, b1 = Math.sqrt(a * b); a = a1; b = b1; if (Math.abs(a - b) < 1e-15) break; } return a; }
  function period(l, g, deg) {
    if (PM) return PM.period(l, g, deg, "exact");
    return 2 * Math.PI * Math.sqrt(l / g) / agm(1, Math.cos(deg * D2R / 2));
  }
  function timeFor(n, l, g, deg) {
    if (PM) return PM.timeFor(n, l, g, deg, "exact");
    return Math.round(n * period(l, g, deg) * 100) / 100;
  }
  function lengthFor(T, g) { return PM ? PM.lengthFor(T, g) : g * T * T / (4 * Math.PI * Math.PI); }
  function smallAngle(deg) {
    if (SM) { var p = SM.pendulum(deg, 0.05, 0.5, G, deg); return { rad: p.theta_rad, sin: p.sin, diff: p.diff_pct }; }
    var r = deg * D2R; return { rad: r, sin: Math.sin(r), diff: 100 * (r - Math.sin(r)) / r };
  }
  function periodIncrease(deg) {
    var f = PM ? PM.exactFactor(deg) : 1 / agm(1, Math.cos(deg * D2R / 2));
    return 100 * (f - 1);
  }

  window.L04 = {
    G: G, period: period, timeFor: timeFor, lengthFor: lengthFor, smallAngle: smallAngle, periodIncrease: periodIncrease,

    // ---- 2A sort: does it change the pendulum's period? (9 cards, 02-lesson.md) ----
    bins: {
      changes: "Changes T",
      "no-change": "No change",
      "only-large-angles": "Only at large angles"
    },
    items: [
      { id: "i1", emo: "📏", name: "Doubling the thread length", bin: "changes", why: "T ∝ √l, so a longer thread gives a longer period (×√2 here)." },
      { id: "i2", emo: "🌙", name: "Moving the pendulum to the Moon", bin: "changes", why: "g is far smaller on the Moon and T ∝ 1/√g, so T grows (about ×2.45)." },
      { id: "i3", emo: "🟤", name: "A brass bob instead of wood (same size)", bin: "no-change", why: "Mass cancels: more weight but also more inertia, so the acceleration is the same." },
      { id: "i4", emo: "⚖️", name: "Doubling the bob's mass", bin: "no-change", why: "m appears in both F = mg sin θ and F = ma, so it cancels out of a = −(g/l)x." },
      { id: "i5", emo: "📐", name: "Release at 5° instead of 10°", bin: "no-change", why: "Both are small angles: sin θ ≈ θ, the motion is SHM and T is the same (within 0.15 %)." },
      { id: "i6", emo: "🧵", name: "A thread that stretches less (same length)", bin: "no-change", why: "Only the length matters; a less stretchy thread just keeps that length steady." },
      { id: "i7", emo: "↗️", name: "Release at 45° instead of 10°", bin: "only-large-angles", why: "At 45° sin θ falls below θ, the force is no longer ∝ x, and T grows by about 4 %." },
      { id: "i8", emo: "⛰️", name: "Timing on a hill instead of at sea level", bin: "changes", why: "g is very slightly smaller up a hill, so T is very slightly longer — too small to see with a stopwatch." },
      { id: "i9", emo: "🎨", name: "Painting the bob a different colour", bin: "no-change", why: "Colour has nothing to do with the restoring force or the inertia." }
    ],

    // ---- Make-sense explorer pins (#pos-explorer): why WAEC says "small angle" ----
    pins: [5, 10, 20, 30, 45],

    // ---- The Bridge: Tunde's test + Mrs Okafor's puzzle ----
    bridge: [
      {
        q: "On the bench, the 50 g and the 100 g bobs on the same 0.50 m thread at 10° each take 28.44 s for 20 swings. What does this show?",
        o: ["Mass does not change the period", "The heavier bob is slower", "The lighter bob is slower"],
        a: 0,
        why: "Both give T = 28.44 ÷ 20 = 1.42 s. The mass cancels in a = −(g/l)x, so a heavier bob is not 'steadier' or slower."
      },
      {
        q: "The okada's bounce has T = 0.50 s. Which formula gives the length of a pendulum that keeps the same time?",
        o: ["l = gT² ÷ 4π²", "l = 4π²T² ÷ g", "l = gT ÷ 2π"],
        a: 0,
        why: "Square T = 2π√(l/g): T² = 4π²l/g, so l = gT²/4π². The other two are the upside-down and the unsquared slips."
      },
      {
        q: "Using g = 9.8 m s⁻², how long is Mrs Okafor's okada-matching pendulum?",
        o: ["6.2 cm", "24.5 cm", "1.24 m"],
        a: 0,
        why: "l = 9.8 × 0.25 ÷ 39.5 = 0.062 m = 6.2 cm — exactly the okada's static sag mg/k, because the two periods match when l/g = m/k."
      }
    ]
  };

  // ---- 12 interactive MCQs (03-questions.md § Lesson 04 Part 1) ----
  window.LESSON_QUIZ = [
    {
      q: "A pendulum bob of mass m is pulled aside so its thread makes an angle θ with the vertical. Which force pulls it back towards its lowest point?",
      o: ["mg sin θ, the component of its weight along the arc", "The tension in the thread", "mg cos θ, the component of its weight along the thread", "Its full weight, mg"],
      a: 0,
      e: "The weight splits into mg cos θ along the thread and mg sin θ along the arc. The tension balances the first part (and provides the centripetal pull), so the part left over to drive the bob back to the middle is mg sin θ. B acts along the thread, at right angles to the bob's path, so it cannot push the bob along the arc. C is the component the tension cancels. D acts straight down; only its component along the path restores the bob."
    },
    {
      q: "A simple pendulum is 1.6 m long. What is its period? (Take g = 10 m s⁻².)",
      o: ["0.40 s", "1.0 s", "2.5 s", "15.7 s"],
      a: 2,
      e: "T = 2π√(l/g) = 2π√(1.6 ÷ 10) = 2π√0.16 = 2 × 3.142 × 0.40 = 2.5 s. A forgot the 2π (√0.16). B forgot the square root (2π × 0.16 = 1.0). D turned the fraction upside down (2π√(10 ÷ 1.6) = 2π × 2.5)."
    },
    {
      q: "A pendulum 0.36 m long has a period of 1.2 s. Its thread is lengthened to 0.81 m. What is the new period?",
      o: ["2.7 s", "0.80 s", "1.2 s", "1.8 s"],
      a: 3,
      e: "T ∝ √l, so T₂/T₁ = √(l₂/l₁) = √(0.81 ÷ 0.36) = √2.25 = 1.5, giving T₂ = 1.5 × 1.2 = 1.8 s. A multiplied by 2.25, leaving out the square root. B divided by 1.5, as if a longer thread swung faster. C assumes the length makes no difference; length is the one thing (with g) that does."
    },
    {
      q: "Tunde replaces a 50 g wooden bob with a 100 g brass bob of the same size on the same thread and releases it through the same small angle. What happens to the period?",
      o: ["It doubles, because the brass bob is twice as heavy", "It stays the same, because the period of a simple pendulum does not depend on the mass of the bob", "It becomes √2 times as long, because T ∝ √m", "It halves, because gravity pulls the heavier bob harder"],
      a: 1,
      e: "In a = −(g/l)x the mass has cancelled: doubling m doubles both the restoring force and the inertia, so the acceleration at each point is unchanged and T = 2π√(l/g) stays the same. A and D are the \"heavier changes the rhythm\" myth in both directions. C borrows T ∝ √m from the loaded spring; it does not apply to a pendulum."
    },
    {
      q: "A pendulum has a period of 1.5 s on Earth. What would its period be on the Moon, where g is only one-sixth of its value on Earth?",
      o: ["9.0 s", "0.61 s", "3.7 s", "0.25 s"],
      a: 2,
      e: "T ∝ 1/√g, so T_Moon = T_Earth × √(g_E/g_M) = 1.5 × √6 = 1.5 × 2.45 = 3.7 s. A multiplied by 6, leaving out the square root. B divided by √6, as if weaker gravity made the pendulum swing faster. D divided by 6."
    },
    {
      q: "Why does the WAEC pendulum practical insist that the bob swings through a <strong>small</strong> angle?",
      o: ["Only for small angles is sin θ ≈ θ, so the restoring force is proportional to the displacement and the motion is simple harmonic", "A large angle would make the thread break", "For a small angle the bob's mass no longer matters", "A small angle makes the period shorter, so timing is quicker"],
      a: 0,
      e: "The restoring force is mg sin θ. Only when θ is small (in radians) is sin θ ≈ θ ≈ x/l, which makes the force proportional to x and gives a = −(g/l)x, the SHM condition behind T = 2π√(l/g). B is not the reason (a lab thread copes easily). C is wrong because mass cancels at any angle. D gets it backwards: in the small-angle range the period hardly changes at all."
    },
    {
      q: "A pendulum 0.900 m long makes 20 oscillations in 38.0 s. What value of g does this give?",
      o: ["18.7 m s⁻²", "9.84 m s⁻²", "0.102 m s⁻²", "1.57 m s⁻²"],
      a: 1,
      e: "T = 38.0 ÷ 20 = 1.90 s, so T² = 3.61 s². Rearranging T = 2π√(l/g) gives g = 4π²l/T² = 39.48 × 0.900 ÷ 3.61 = 9.84 m s⁻². A divided by T instead of T² (forgot to square). C is T²/(4π²l), the rearrangement upside down. D used 2π in place of 4π² (2π × 0.900 ÷ 3.61), forgetting that squaring 2π gives 4π²."
    },
    {
      q: "A simple pendulum and a mass on a spring both have a period of 1.0 s on Earth. Both are carried to the Moon. What happens to their periods there?",
      o: ["Both periods become longer", "Both periods stay the same", "The pendulum's period stays the same; the spring's becomes longer", "The pendulum's period becomes longer; the spring's stays the same"],
      a: 3,
      e: "The pendulum's restoring force comes from gravity, so T = 2π√(l/g) grows when g falls. The spring's restoring force comes from its stiffness, and T = 2π√(m/k) contains no g, so its period is unchanged (only its resting stretch changes). A and B treat the two systems alike; C swaps them."
    },
    {
      q: "What length of simple pendulum has a period of 1.20 s? (Take g = 9.8 m s⁻².)",
      o: ["0.30 m", "0.36 m", "2.25 m", "5.80 m"],
      a: 1,
      e: "l = gT²/4π² = 9.8 × (1.20)² ÷ 39.48 = 9.8 × 1.44 ÷ 39.48 = 14.11 ÷ 39.48 = 0.36 m. A forgot to square T (9.8 × 1.20 ÷ 39.48). C divided by 2π instead of 4π². D turned the fraction upside down (4π²T²/g)."
    },
    {
      q: "Zainab releases the same pendulum first at 10° and then at 45°. Which statement is correct?",
      o: ["The period is exactly the same at both angles", "The period at 45° is much shorter because the bob moves faster", "The period at 45° is exactly 4.5 times as long, because the bob goes further", "The period at 45° is slightly longer, because sin θ is then noticeably less than θ and the restoring force is no longer proportional to displacement"],
      a: 3,
      e: "At 45° the motion is no longer quite SHM: the restoring force grows less quickly than the displacement, so the bob takes a little longer (about 4 % here). A is true only within the small-angle range, which 45° is outside. B ignores that the extra distance outweighs the extra speed. C assumes the period grows in proportion to the angle; in fact the change is only a few per cent."
    },
    {
      q: "Pendulum Q is nine times as long as pendulum P, and both swing at the same place. What is the ratio of the frequency of P to the frequency of Q?",
      o: ["3 : 1", "1 : 3", "9 : 1", "1 : 9"],
      a: 0,
      e: "T ∝ √l, so T_Q = √9 × T_P = 3T_P. Frequency is 1/T, so f_P : f_Q = 3 : 1: the shorter pendulum vibrates three times as often. B is the ratio of the periods, not the frequencies. C and D leave out the square root."
    },
    {
      q: "Using data from the pendulum-laws bench, which graph would give a straight line through the origin?",
      o: ["T against l", "T against 1/l", "T against √l", "T² against 1/l"],
      a: 2,
      e: "T = (2π/√g) × √l, so T is directly proportional to √l: plotting T against √l gives a straight line through the origin with gradient 2π/√g. (Equally, T² against l is a straight line through the origin.) A gives a curve that bends over, because T grows more slowly than l. B and D give curves, because T falls as 1/l grows, while the real T increases with l."
    }
  ];
})();
