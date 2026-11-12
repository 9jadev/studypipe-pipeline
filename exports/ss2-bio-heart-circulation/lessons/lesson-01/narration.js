/* Lesson 01 · Choreographed StudyNarrator script: Why big bodies need a transport system (Nigerian English, en-NG ranked first) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us test your idea on the cubes."; }
    },
    sort: {
      event: "l1:sort",
      prompt: "Sort all ten animals into the four bins, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.correct === d.total) return "Ten out of ten! You sorted open, closed single and closed double like a real biologist.";
        if (d.correct >= 7) return "Nice work, " + d.correct + " out of " + d.total + ". Read the reasons below for any card that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the reasons below. The earthworm and the pigeon are the classic traps.";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Drop the cubes in the acid, wait, then cut and measure all four cubes",
      react: function () { return "All four cubes measured. Look at how the share of colourless volume falls as the cube gets bigger."; }
    },
    pin: {
      event: "l1:pin",
      prompt: "Tap any pin on the cube-side explorer",
      react: function (d) {
        if (d && d.L >= 20) return "See that? The acid went the same distance, yet a big cube keeps a large pink core.";
        return "Good. A small cube is cleared right through.";
      }
    },
    bridge: {
      event: "l1:bridge",
      prompt: "Answer the three steps of Dr Aisha's first clue",
      react: function (d) {
        if (d && d.correct === d.total) return "Clue one solved, all three steps right!";
        return "Clue one solved. Read the reasons again if a step surprised you.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all twelve quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding, " + d.score + " out of " + d.total + "!";
        if (d.score >= 7) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the bench and the circuit zoom, then retry.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && window.StudyScenes.story) window.StudyScenes.story.beat(parseInt(arg, 10) || 0); },
    bench: function (arg) {
      var b = window.StudyScenes && window.StudyScenes.bench;
      if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "drop") b.drop();
      else if (p[0] === "skip") b.skip();
      else if (p[0] === "select") b.select(p[1]);
      else if (p[0] === "measure") b.measure(p[1] ? +p[1] : undefined);
      else if (p[0] === "reset") b.reset();
    },
    zoom: function (arg) { if (window.StudyScenes && window.StudyScenes.zoom) window.StudyScenes.zoom.setMode(String(arg)); },
    pin: function (arg) { if (window.L01 && window.L01.showPin) window.L01.showPin(parseInt(arg, 10) || 0); },
    open: function (sel) { var d = document.querySelector(sel); if (d && d.tagName === "DETAILS") d.open = true; }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 1 · Why big bodies need a heart",
          sparkle: true,
          say: "Welcome to Lesson 1 of The Human Heart and Blood Circulation! Today we find out why a big, active body like Chidi needs a heart and blood vessels, when a tiny Amoeba needs neither."
        },
        {
          target: "#objectives",
          cue: "Our guiding question and goals",
          say: "Our guiding question is: an Amoeba has no heart, so why does Chidi need one? By the end you will give four reasons, calculate S A to V with unit changes, and compare open, closed, single and double circulation."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage", action: "story:0", cue: "Oja Oba health-day tent",
          say: "We are at the Oja Oba health-day tent. Dr Aisha sends Chidi on a sprint across the market to fetch a cable, and he comes back with his chest heaving."
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:1", cue: "Two fingers on the wrist",
          say: "Dr Aisha presses two fingers on his wrist and checks her watch. His heart has nearly doubled its speed. Why should running do that?"
        },
        {
          target: { scene: "story", part: "cust2" }, action: "story:2", cue: "Baba Sule's frog",
          say: "Baba Sule laughs. A frog in a gutter has no need to run like that, he says. Small heart, small trouble!"
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:3", cue: "An Amoeba in pond water",
          say: "Now in the lab, Dr Aisha shows an Amoeba under the microscope. It has no heart and no blood. It gets everything by diffusion. Chidi cannot. Today we find out why."
        },
        {
          target: { scene: "story", part: "cubeBeaker" }, action: "story:4", cue: "Pink cubes in acid",
          say: "She drops four pink agar cubes of different sizes into acid. Watch how far the colour fades from the edge. That is our bench."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Before the bench, pin your prediction. If oxygen can spread by itself, why bother with a heart and blood at all?"
        }
      ]
    },
    {
      title: "Circulation Sort",
      steps: [
        {
          target: "#circ-sort", cue: "Four bins, ten animals", wait: "sort",
          say: "Sort all ten animals: no system, open, closed single, or closed double. The earthworm and the pigeon are the classic traps. Then tap Check my sorting."
        }
      ]
    },
    {
      title: "Agar-Cube Bench",
      steps: [
        {
          target: "#method-cards", cue: "Four method cards",
          say: "Here are the four steps. Cut four cubes of side 5, 10, 20 and 30 millimetres. Drop them all into the acid at the same moment. After 8 minutes, blot, cut and measure. Then calculate S A to V and the percentage that turned colourless."
        },
        {
          target: { scene: "bench", part: "cube" }, action: "bench:select:30", cue: "Four pink cubes",
          say: "These are the four cubes, cut open so you can see inside. Pink means the acid has not reached it. Colourless means it has. Right now they are all pink."
        },
        {
          target: { scene: "bench", part: "beaker" }, action: "bench:drop", cue: "Into the dilute acid",
          say: "In go all four cubes, together, held with forceps. Watch the clock and the colourless rim creep inwards from every face. After 8 minutes the acid has moved in 3 millimetres on every face of every cube."
        },
        {
          target: "#bench-stage", action: "bench:skip", cue: "Your turn on the bench", wait: "bench",
          say: "Your turn. Pick each cube and tap Cut and measure. Notice that the acid went the same depth in each, yet the big cube is still pink in the middle."
        },
        {
          target: "#graph-card", cue: "A smooth curve, not a straight line",
          say: "Your results land on the graph. The share of colourless volume climbs steeply and then levels off at 100 percent, so draw a smooth curve of best fit, never a straight line. Then complete the table."
        },
        {
          target: "#expected", action: "open:#expected", cue: "Expected results and errors",
          say: "Compare with the expected table. For example, the 30 millimetre cube is only 48.8 percent colourless. And note the sources of error: lifting a cube late makes the reading too high, and a cube lying flat makes it too low."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#why-four", cue: "Four reasons",
          say: "Four reasons big animals need a transport system. One, a small S A to V. Two, cells far from the surface, and diffusion is too slow over long distances. Three, active animals burn oxygen and food fast. Four, materials are made in one organ and used in another."
        },
        {
          target: "#props-table", cue: "Open vs closed, single vs double",
          say: "Learn these two tables. Open: blood pools in the haemocoel at low pressure, as in the cockroach. Closed: blood stays in vessels. Single: one trip through the heart per circuit, as in tilapia. Double: two trips, as in the pigeon and in Chidi."
        },
        {
          target: "#pos-explorer", action: "pin:5", cue: "Cube-side explorer", wait: "pin",
          say: "Try the cube-side explorer. Tap a pin, and see how S A to V halves each time the side doubles."
        }
      ]
    },
    {
      title: "Circuit Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "pump" }, action: "zoom:open", cue: "Open: low pressure",
          say: "Zoom in. In open circulation, haemolymph is pumped into the body cavity and sloshes round the organs. One trip, low pressure."
        },
        {
          target: { scene: "zoom", part: "pump" }, action: "zoom:single", cue: "Single: pressure lost at the gills",
          say: "In closed single circulation, the blood goes heart, gills, body, heart. Pressure is lost across the fine gill capillaries, so it reaches the body reduced."
        },
        {
          target: { scene: "zoom", part: "pump" }, action: "zoom:double", cue: "Double: pumped twice",
          say: "In closed double circulation, the blood returns to the heart after the lungs and is pumped a second time. Two trips through the heart, and it reaches the body at high pressure with no mixing."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#ex1", cue: "SA : V with a unit change",
          say: "Example one. A cube of side 2.0 centimetres. Surface area is 6 times 2.0 squared, 24 square centimetres. Volume is 8.0 cubic centimetres. The ratio is 3.0 per centimetre, which is 0.30 per millimetre."
        },
        {
          target: "#ex3", cue: "Share of a cube reached by acid",
          say: "Example three. In the 20 millimetre cube the acid moved in 3.0 millimetres from every face. The pink centre is 20 minus 6, which is 14 millimetres, so its volume is 2744 cubic millimetres. The cube is 8000, so the colourless share is 65.7 percent."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#bridge-steps", cue: "Dr Aisha's first clue", wait: "bridge",
          say: "Now solve Dr Aisha's first clue in three steps: Chidi's tiny S A to V, the oxygen demand of a sprint, and the design that can keep up."
        }
      ]
    },
    {
      title: "Quiz and Reflect",
      steps: [
        {
          target: "#quiz", cue: "12 exam-style questions", wait: "quiz",
          say: "Test yourself on these twelve questions. Read the explanation for every option, not only the one you picked."
        },
        {
          target: "#reflect", cue: "Rate yourself, then the assignment",
          say: "Finally, rate your confidence from one to four, write your exit ticket, and do Part A and Part B of the assignment at home. Well done on Lesson 1!"
        }
      ]
    }
  ]
};
