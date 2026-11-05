/* ==========================================================
   StudyPipe — Welcome Hub Guided Tour Narration (en-NG priority)
   Refraction of Light Through a Rectangular Glass Block
   ========================================================== */
window.NARRATION = {
  rate: 0.95,
  pitch: 1.02,

  waits: {
    lab: {
      event: "lab:result",
      timeout: 60000,
      prompt: "Your turn! Tap 'Cycle Angle i' or 'Switch Block Medium' on the 3D optical bench.",
      react: function (d) {
        if (!d) return { say: "No wahala! You can test the 3D glass block bench any time. Let's explore the rest of the unit." };
        return {
          say: "Spot on! At angle of incidence i equal to " + d.iDeg + " degrees in " + d.medium + " of refractive index " + d.n.toFixed(2) + ", the ray refracts to r equal to " + d.rDeg.toFixed(1) + " degrees, emerges parallel at e equal to " + d.eDeg + " degrees, and shifts sideways by " + d.dCm.toFixed(2) + " centimetres!",
          target: "#endpoint-toast",
          sparkle: true,
          cue: "e = i = " + d.eDeg + "° · Shift d = " + d.dCm.toFixed(2) + " cm"
        };
      }
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".hero-title",
          cue: "Refraction Through a Rectangular Glass Block",
          sparkle: true,
          say: "Welcome! In this five-lesson physics unit, we are mastering Refraction of Light Through a Rectangular Glass Block — a cornerstone of WAEC, NECO, and JAMB Optics and one of the most popular WAEC Paper 3 practicals."
        },
        {
          target: ".hero-meta",
          cue: "5 lessons · 10 3D stages",
          say: "You have five progressive lessons, ten interactive 3D optical stages, and all seven WAEC Paper 3 four-pin ray-tracing graph variants — working one hundred percent offline."
        }
      ]
    },
    {
      title: "The 3D Optical Bench",
      steps: [
        {
          target: "#lab",
          cue: "Live 3D Ray-Tracing Bench",
          say: "Right here in the hero is a live 3D rectangular glass block and four-pin ray-tracing bench. Let's inspect each piece of apparatus before you fire the ray."
        },
        {
          target: { part: "block" },
          cue: "Rectangular Glass Block (n = 1.50)",
          say: "In the centre of the white drawing sheet rests a parallel-sided rectangular glass block of width 6 point 0 centimetres and refractive index n equal to 1 point 5 0."
        },
        {
          target: { part: "pinsInc" },
          cue: "Incident Optical Pins P1 & P2",
          say: "Along the amber incident ray are upright optical pins P 1 and P 2, spaced well apart so we can define the incident direction accurately."
        },
        {
          target: { part: "pinsEm" },
          cue: "Emergent Optical Pins P3 & P4",
          say: "Looking through the opposite face at eye level, we align emergent pins P 3 and P 4 with the bases of P 1 and P 2. Notice how the green emergent ray leaves parallel to the incident ray, shifted sideways by lateral displacement d! Now it's your turn to change angle i or switch the glass medium!",
          wait: "lab"
        }
      ]
    },
    {
      title: "The Yaba & Surulere Mystery",
      steps: [
        {
          target: "#mystery .section-title",
          cue: "Yaba & Surulere Optics Mystery",
          sparkle: true,
          say: "Every lesson in this unit connects to a real Nigerian investigation linking Doctor Kunle's Optometry Clinic in Surulere, Tunde's Yaba Fibre-Optic Hub, and Mrs Adebayo's Physics Lab."
        },
        {
          target: ".case-card",
          cue: "Case File #OPT-05",
          say: "Why does a laser beam aimed at 45 degrees into a 6-centimetre glass block emerge parallel to its original path yet shifted sideways by 1 point 9 8 centimetres, while a patient chart underneath appears raised by 2 point 0 centimetres?"
        },
        {
          target: ".stats",
          cue: "High Exam Weight",
          say: "Look at the exam weight: Rectangular Glass Block ray tracing and Snell's law questions appear across WAEC, NECO, and JAMB objectives, theory, and Paper 3 practicals year after year."
        }
      ]
    },
    {
      title: "Your 5-Lesson Journey",
      steps: [
        {
          target: "#journey .section-title",
          cue: "5 progressive lessons",
          say: "We have structured the entire topic into five focused fifty-minute lessons."
        },
        {
          target: '.lesson[data-lesson="1"]',
          cue: "Lesson 1 · Snell's Law & WaveSpeed",
          say: "Lesson 1 covers wavefront slowing, why frequency stays constant while wavelength shrinks in glass, Snell's law n equals sine i over sine r, the glancing-angle trap, and the 90-degree reflected-refracted shortcut n equals tan i."
        },
        {
          target: '.lesson[data-lesson="2"]',
          cue: "Lesson 2 · Lateral Displacement & Dispersion",
          say: "Lesson 2 proves why the emergent ray leaves parallel to the incident ray with zero net angular deviation, derives lateral displacement d equals t sine of i minus r over cos r, and contrasts a rectangular glass block with a triangular prism."
        },
        {
          target: '.lesson[data-lesson="3"]',
          cue: "Lesson 3 · Real & Apparent Depth",
          say: "Lesson 3 masters n equals Real Depth over Apparent Depth, upward vertical shift d v equals R times 1 minus 1 over n, multi-layer slabs, and the no-parallax search-pin method."
        },
        {
          target: '.lesson[data-lesson="4"]',
          cue: "Lesson 4 · Critical Angle & Optical Fibres",
          say: "Lesson 4 explores critical angle sine c equals 1 over n, speed v equals c naught sine c, total internal reflection in 45-degree prisms and Yaba optical fibres, and hot-road mirages."
        },
        {
          target: '.lesson[data-lesson="5"]',
          cue: "Lesson 5 · WAEC Paper 3 & 7 Graph Variants",
          say: "And Lesson 5 puts you in full command of the WAEC four-pin ray-tracing practical, viewing pin bases rather than pin tops, and decoding all seven WAEC graph variants!"
        }
      ]
    },
    {
      title: "Concept Explorer",
      steps: [
        {
          target: "#explorer .section-title",
          cue: "Interactive Graph Explorer",
          say: "Try this four-tab Concept Explorer to preview the signature graphs of Refraction of Light."
        },
        {
          target: "#combo-tabs",
          action: "combo:ohmic",
          cue: "Snell's Law (sin i vs sin r)",
          say: "Plotting sine i on the vertical axis against sine r on the horizontal axis gives a straight line through the origin whose gradient equals the refractive index n."
        },
        {
          target: "#combo-tabs",
          action: "combo:internal",
          cue: "Cosine Graph Trap (cos i vs cos r)",
          say: "Switch to the famous WAEC Cosine Graph Trap: cos i against cos r is curved and has no constant slope, so you read a point on the curve and compute n equals square root of 1 minus cos squared i over 1 minus cos squared r!"
        }
      ]
    },
    {
      title: "Archetypes & Myths",
      steps: [
        {
          target: "#archetypes",
          cue: "6 calculation patterns",
          say: "Here are the six calculation archetypes from your exam guide — covering Snell's law and wave speed, lateral shift, real and apparent depth, critical angle, and the WAEC Paper 3 graph slopes."
        },
        {
          target: "#myths",
          action: "myth:0",
          cue: "Myth #1 busted",
          say: "And never fall for these three exam traps! First: when light enters glass, its frequency f does NOT change — speed v and wavelength lambda decrease together!"
        },
        {
          target: "#myths",
          action: "myth:1",
          cue: "Myth #2 busted",
          say: "Second: a rectangular glass block does NOT fan white light into a wide rainbow like a triangular prism, because its opposite faces are parallel so red and violet rays emerge parallel to each other!"
        }
      ]
    },
    {
      title: "Ready to Begin",
      steps: [
        {
          target: ".finale",
          cue: "Start Lesson 1",
          sparkle: true,
          say: "You are ready! Tap Start Lesson 1 below to step into Doctor Kunle's clinic in Surulere and begin your investigation."
        }
      ]
    }
  ]
};
