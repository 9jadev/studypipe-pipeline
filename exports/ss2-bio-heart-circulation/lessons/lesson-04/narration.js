/* Lesson 04 · StudyNarrator choreography (en-NG): The Beating Heart */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us sort the things that change the heart rate."; }
    },
    sort: {
      event: "l4:sort",
      prompt: "Sort all ten cards into speeds it up or slows it down, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort! Check the notes under the bins.";
        if (d.correct === d.total) return "Ten out of ten! You know what drives the heart rate up and what pulls it down.";
        if (d.correct >= 8) return "Nice work! " + d.correct + " out of " + d.total + ". Read the notes for the ones that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes: working muscles and adrenaline speed the heart, the vagus nerve and rest slow it.";
      }
    },
    bench: {
      event: "l4:bench-done",
      prompt: "Take three rest counts, press Exercise 2 minutes, then count at the start of each minute for five minutes. Tap Run it for me if you want the whole practical done for you",
      already: function () { var s = window.StudyScenes && window.StudyScenes.bench && window.StudyScenes.bench.state(); return s && s.done ? { count: s.counts } : null; },
      react: function () { return "Well done! All six counts are in. Chidi's pulse fell from thirty-three beats in fifteen seconds back to seventeen. Now look at the table and the graph."; }
    },
    pin: {
      event: "l4:pin",
      prompt: "Tap a time on the cycle explorer to freeze the heart at that moment",
      react: function () { return "See which chambers are squeezing and which valves are shut at that exact moment. Try the other times too."; }
    },
    bridge: {
      event: "l4:bridge",
      prompt: "Answer the three questions to close Case 1",
      filter: function (d) { return !!d.correct; },
      react: function () { return "Exactly! The heart sets its own beat. Nerves and hormones only turn the speed up or down, and the lub is a valve, not a clap."; }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all the quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Outstanding! " + d.score + " out of " + d.total + ". You have mastered the beating heart.";
        if (d.score >= Math.round(d.total * 0.6)) return "Well done! " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the pulse bench and the zoom, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { var s = window.StudyScenes && window.StudyScenes.story; if (s) s.beat(parseInt(arg, 10) || 0); },
    open: function (arg) { var d = document.querySelector(arg); if (d && d.tagName === "DETAILS") d.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && window.StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "view") b.setMode(p[1]);
      else if (p[0] === "rest") b.rest();
      else if (p[0] === "exercise") b.exercise();
      else if (p[0] === "count") b.count();
      else if (p[0] === "next") b.next();
      else if (p[0] === "bp") b.bp();
      else if (p[0] === "hl") b.highlight(p[1] || null);
      else if (p[0] === "speed") b.speed(+p[1] || 2);
    },
    zoom: function (arg) { var z = window.StudyScenes && window.StudyScenes.zoom; if (z) z.setMode(arg); },
    pin: function (arg) { if (window.L04 && window.L04.showPin) window.L04.showPin(parseInt(arg, 10) || 0, true); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display", cue: "Lesson 4 · The beating heart", sparkle: true,
          say: "Welcome to Lesson 4! Why did Chidi's pulse leap to one hundred and thirty-two beats a minute after his sprint, and then settle again? Today we count pulses, listen to lub and dub, and meet the heart's own pacemaker. We follow the timetable on the page, with a movement break at forty-five minutes."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list", cue: "Wake up Lessons 1 to 3", sparkle: true,
          say: "Start with four quick questions on the aorta, the chordae tendineae, the coronary artery and the two loops of the double circulation. Answer each in your head before you flip the card."
        },
        {
          target: "#donow-list", wait: "donow",
          say: "Your turn. Reveal and mark each card. I will carry on when all four are marked."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: { scene: "story", part: "amaka" }, action: "story:0", cue: "Oja Oba health tent",
          say: "Chidi is back at the Oja Oba health tent, breathless after his sprint. Doctor Aisha holds his wrist and counts for fifteen seconds. Thirty-three beats."
        },
        {
          target: { scene: "story", part: "cust1" }, action: "story:1", cue: "Lub-dub, lub-dub",
          say: "She hands him the stethoscope. Lub-dub, lub-dub, racing in his ears."
        },
        {
          target: { scene: "story", part: "cust2" }, action: "story:2", cue: "Baba Sule's theory",
          say: "Baba Sule says it is his brain kicking the heart, and that the noise is the heart muscle clapping."
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:3", cue: "Back to 68?",
          say: "Doctor Aisha says that in five minutes his pulse will be back near sixty-eight. Let us find out why, and what that knocking really is."
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:4", cue: "To the pulse bench",
          say: "In the lab, a model heart beats on the bench. We will count, run, count again, and watch the heart behind every beat."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Before we investigate, pin your idea. What makes the lub and the dub, and who tells the heart to beat faster?"
        }
      ]
    },
    {
      title: "Sort",
      steps: [
        {
          target: "#rate-sort", cue: "Faster or slower?", wait: "sort",
          say: "Activity one. Ten things change the heart rate. Sort each card into speeds it up or slows it down, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: "#method-cards", cue: "Four method cards",
          say: "Now the practical. Card one: sit quietly, then find the radial pulse with the index and middle fingers. Card two: count for fifteen seconds, three times, and multiply the mean by four. Card three: step up and down for two minutes, then count at once and at the start of each minute. Card four: tabulate and plot."
        },
        {
          target: { scene: "bench", part: "fingers" }, action: "bench:view:wrist", cue: "Two fingers, never the thumb", sparkle: true,
          say: "Here is the wrist. The radial artery runs just under the skin, and you feel it with two fingers, never the thumb, because the thumb has its own pulse. Each bulge is one heartbeat."
        },
        {
          target: { scene: "bench", part: "san" }, action: "bench:view:heart", cue: "The heart behind the pulse",
          say: "Behind every bulge is the heart on the right. Remember it faces you, so the patient's right side is on your left. At rest it beats sixty-eight times a minute. After the step-ups it will speed up, and you will see it and feel it."
        },
        {
          target: "#bench-stage", cue: "Your turn on the bench!", wait: "bench",
          say: "Now it is your turn. Take three rest counts, press Exercise two minutes, then count at the start of every minute for five minutes."
        },
        {
          target: ["#graph-card", "#results-table"], cue: "Table and graph",
          say: "Look at the table. Thirty-three beats in fifteen seconds is one hundred and thirty-two beats a minute, falling to sixty-eight. On the graph the points fall on a smooth curve, steep at first and then levelling off, so we draw a curve of best fit and not a straight line. Recovery is where the curve meets the dashed resting line, about five minutes. Watch for the sources of error: a late first count makes the peak too low, and one missed beat becomes four beats a minute."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#cycle-callout", cue: "Four stages · about 0.8 s", sparkle: true,
          say: "Now we make sense of it. At about seventy-five beats a minute, one cycle lasts about point eight of a second. All chambers relax for about point four, the atria contract for point one, and the ventricles contract for about point three. Then the ventricles relax and it begins again."
        },
        {
          target: "#sounds-table", cue: "Lub and dub", sparkle: true,
          say: "Lub is the A V valves shutting as the ventricles start to squeeze. Dub is the semilunar valves shutting as the ventricles relax. Not muscle clapping. An extra swish is called a murmur, and hints at a leaky or narrowed valve."
        },
        {
          target: "#control-chain", cue: "SAN to Purkinje", sparkle: true,
          say: "The beat starts at the S A N, the pacemaker in the right atrium wall. The atria contract, the A V N holds the signal for a moment, then the bundle of His carries it down the septum and the Purkinje fibres spread it up both ventricle walls. Heart muscle is myogenic: the beat starts inside the heart. The brain only turns the speed up or down."
        },
        {
          target: ["#pulse-bp", "#eq-block"], cue: "Pulse, pressure, equations",
          say: "A pulse is the bulge and spring-back of an artery wall after every push of the left ventricle. Blood pressure is about one hundred and twenty over eighty millimetres of mercury. And remember the four equations: heart rate, cycle time sixty over heart rate, cardiac output, and percentage change."
        },
        {
          target: "#pos-explorer", action: "pin:3", cue: "Freeze the cycle", wait: "pin",
          say: "In the explorer, tap a time. The three D heart in the zoom freezes at that moment, and we read which chambers are squeezing and which valves are shut."
        }
      ]
    },
    {
      title: "3D Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "san" }, action: "zoom:pace", cue: "The spark of the SAN",
          say: "In the zoom, watch the spark start at the S A N, spread over both atria, pause at the A V N, race down the septum and up the ventricle walls. The pause lets the atria finish emptying."
        },
        {
          target: { scene: "zoom", part: "heart" }, action: "zoom:sys", cue: "LUB and DUB",
          say: "Now the valves, in slow motion. Lub, the A V valves shut. Dub, the semilunar valves shut. Tap Slow motion to catch each one."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#examples", cue: "Four examples",
          say: "In the worked examples, eighteen beats in fifteen seconds is seventy-two beats a minute, a cycle of point eight three seconds. Cardiac output rises from four point seven six to twelve point five cubic decimetres a minute, about two point six times more. The heart rate rose ninety-four percent. And at seventy-five beats a minute the ventricles rest for sixty-two point five percent of every cycle."
        }
      ]
    },
    {
      title: "Explainer Video",
      steps: [
        {
          target: ["#lesson-video", "#concepts h2"], cue: "Explainer video",
          say: "At the start of Make Sense there is a short explainer video that shows the cardiac cycle, the lub and the dub, and the pacemaker in motion. Watch it any time you want a second look."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#bridge-card", cue: "Close Case 1", wait: "bridge",
          say: "Back to Chidi. Answer the three questions: what pushed his rate up, what makes the lub, and what slowed it down again. You can replay his recovery on the bench first."
        }
      ]
    },
    {
      title: "Quiz",
      steps: [
        {
          target: "#quiz-list", cue: "Twelve questions", wait: "quiz",
          say: "Now the quiz, in WAEC, NECO and JAMB style. Pick an option for instant feedback and read every explanation."
        }
      ]
    },
    {
      title: "Reflect and Assignment",
      steps: [
        {
          target: ["#rate-list", "#assignment"], cue: "Rate yourself 1 to 4",
          say: "Rate yourself from one to four on each goal, and try the exit ticket: twenty-one beats in fifteen seconds. For your assignment, do Part A and Part B from the questions file for Lesson 4. Well done today!"
        }
      ]
    }
  ]
};
