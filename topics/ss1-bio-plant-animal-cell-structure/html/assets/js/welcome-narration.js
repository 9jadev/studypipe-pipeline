/* ==========================================================
   StudyPipe — Welcome Hub guided tour · Plant and Animal Cells
   Nigerian English (en-NG) first. Read by assets/js/narrator.js (window.NARRATION).
   3D targets use { lab: "<part>" } → window.StudyLab.rect()/highlight() (welcome-lab.js);
   highlighting a part also switches the lab to that part's mode.
   ========================================================== */
window.NARRATION = {
  rate: 0.95,
  pitch: 1.02,

  actions: {
    labmode: function (m) { if (window.StudyLab) window.StudyLab.setMode(m); },
    pick: function (k) { if (window.StudyLab) window.StudyLab.select(k); },
    objective: function (i) { if (window.StudyLab) window.StudyLab.objective(parseInt(i, 10) || 0); },
    solution: function (s) { if (window.StudyLab) window.StudyLab.solution(s); },
    myth: function (i) {
      var cards = document.querySelectorAll("#myths .myth-card");
      var n = parseInt(i, 10);
      cards.forEach(function (c, k) {
        var on = k === n;
        c.classList.toggle("is-flipped", on);
        c.setAttribute("aria-expanded", on ? "true" : "false");
      });
    }
  },

  waits: {
    cells: {
      event: "lab:result", timeout: 60000,
      prompt: "Your turn! Tap any organelle in the plant cell or the animal cell.",
      filter: function (d) { return d.mode === "cells" && !!d.part; },
      react: function (d) {
        if (!d) return { say: "No wahala. You can tap the cells any time. Let's look at the microscope next." };
        return {
          say: "Good one! You found the " + d.name + ". " + d.memSay + ". Where is it found? " + d.where + ". You will meet every organelle like this in Lesson 2.",
          target: "#lab-readouts", sparkle: true, cue: d.name
        };
      }
    },
    scope: {
      event: "lab:result", timeout: 60000,
      prompt: "Your turn! Tap a different objective lens and watch the eyepiece view.",
      filter: function (d) { return d.mode === "microscope" && !!d.M; },
      react: function (d) {
        if (!d) return { say: "That's fine. Remember: multiply the eyepiece by the objective, never add them." };
        return {
          say: "See it? With the times " + d.objective + " objective, ten times " + d.objective + " gives a total magnification of times " + d.M + ". " + d.cells + " onion cells fit across the field, and each one is still " + d.width_um + " micrometres wide. The image grows, but the cell does not.",
          target: "#lab-readouts", sparkle: true, cue: "×" + d.M
        };
      }
    },
    osmo: {
      event: "lab:result", timeout: 75000,
      prompt: "Your turn! Put both cells in pure water or in salty water.",
      filter: function (d) { return d.mode === "osmosis" && !!d.solution; },
      react: function (d) {
        if (!d) return { say: "No problem. We will solve this properly in Lesson 4. Let's open the case file." };
        if (d.solution === "water") return { say: "Look! In pure water, water rushes into both cells. The ugu cell swells until its wall pushes back, so it becomes turgid. But the red cell has no wall, so it bursts. That is haemolysis, and that is why plain water never goes into a vein.", target: { lab: "rbc" }, sparkle: true, cue: "Haemolysis!" };
        if (d.solution === "salt") return { say: "Look! In salty water, water leaves both cells. The ugu cell's membrane pulls away from its wall. That is plasmolysis, and that is why the leaves wilted. Coach Danjuma was wrong: the salt did not soak in. The water came out.", target: { lab: "plantO" }, sparkle: true, cue: "Plasmolysis!" };
        return { say: "In zero point nine percent saline, water goes in and out at the same rate, so both cells keep their shape. That solution is isotonic with blood.", target: "#lab-readouts", cue: "Isotonic" };
      }
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".hero-title", cue: "The Cell", sparkle: true,
          say: "Welcome! In this five-lesson unit we are going inside the cell, life's smallest unit. It is one of the most tested topics in WAEC, NECO and JAMB Biology, and it is a regular Paper 3 practical." },
        { target: ".hero-meta", cue: "5 lessons · 5 labs · 5 zooms",
          say: "You have five lessons of about eighty minutes each, five 3D practical benches, five 3D zooms inside the cell, sixty quiz questions and five thirty-mark papers. Everything works offline." }
      ]
    },
    {
      title: "The 3D Lab",
      steps: [
        { target: "#lab", action: "labmode:cells", cue: "Live 3D lab",
          say: "This is your live 3D lab. It has three modes: cells, microscope and osmosis. Drag sideways to turn it." },
        { target: { lab: "plant" }, cue: "Plant cell",
          say: "On the left is a plant cell, like a cell from an ugu leaf. See the stiff box-shaped cell wall, the green chloroplasts gliding round the edge, and the big blue sap vacuole in the middle." },
        { target: { lab: "animal" }, cue: "Animal cell",
          say: "On the right is an animal cell, like a cheek cell. No wall, no chloroplasts, no big vacuole. Its shape is irregular and its nucleus sits near the centre." },
        { target: "#lab", cue: "Tap an organelle",
          say: "Now you try. Tap any organelle in either cell, and the lab will tell you its name, how many membranes wrap it, and where it is found.",
          wait: "cells" }
      ]
    },
    {
      title: "The Microscope",
      steps: [
        { target: { lab: "microscope" }, action: "objective:0", cue: "Compound microscope",
          say: "Switch to the microscope. Light passes up through an onion peel on the stage, then through the objective lens and the eyepiece to your eye." },
        { target: { lab: "eyepiece" }, cue: "Eyepiece ×10",
          say: "The eyepiece magnifies ten times. The objective lenses below magnify four, ten or forty times. To find the total magnification, you multiply them. Never add!" },
        { target: "#lab-fov", cue: "Eyepiece view",
          say: "This circle is what you would see down the eyepiece. On times four, about eighty onion cells fit across the field of view.",
          wait: "scope" }
      ]
    },
    {
      title: "Osmosis Preview",
      steps: [
        { target: { lab: "osmosis" }, action: "solution:saline", cue: "Osmosis mode",
          say: "Now the big one. Here is an ugu leaf cell and a red blood cell in zero point nine percent saline. The little blue balls are water molecules crossing the membranes." },
        { target: "#ctrl-osmosis", cue: "Change the solution",
          say: "Change the solution and watch which way the water moves. This is the secret behind the whole mystery.",
          wait: "osmo" }
      ]
    },
    {
      title: "The Mystery",
      steps: [
        { target: "#mystery .section-title", cue: "The case", sparkle: true,
          say: "Every lesson adds a clue to one case: the wilting ugu and the saline drip." },
        { target: ".mystery-narrative", cue: "Mile 12 Market & LUTH",
          say: "At Mile 12 Market, Mama Ngozi's ugu leaves went limp after a wash in salty water. That same evening at LUTH, Doctor Amaka refused to drip plain water into a thirsty patient and asked for zero point nine percent saline. Coach Danjuma says the salt soaked into the leaves. Is he right?" },
        { target: ".case-card", cue: "Case File #CELL-01",
          say: "The case opens in Lesson 1, you solve it in Lesson 4, and you prove it at the Paper 3 bench in Lesson 5." },
        { target: "#mystery .stats", cue: "Exam weight",
          say: "And look at the exam weight. Cell structure comes up regularly in WAEC Papers 1, 2 and 3, the onion and cheek cell slide is a recurring practical, and it is topic one of the JAMB syllabus." }
      ]
    },
    {
      title: "Your Lesson Journey",
      steps: [
        { target: '.lesson[data-lesson="1"]', cue: "Lesson 1 · Discovering the cell",
          say: "Lesson 1: the microscope and the cell theory. You will look at cork, onion and blood, multiply eyepiece by objective, and measure a cell in micrometres." },
        { target: '.lesson[data-lesson="2"]', cue: "Lesson 2 · Inside the cell",
          say: "Lesson 2: inside the cell. You will dissect a plant cell and an animal cell, organelle by organelle, and sort them by how many membranes they have." },
        { target: '.lesson[data-lesson="3"]', cue: "Lesson 3 · Forms & levels",
          say: "Lesson 3: Amoeba, Euglena, Volvox and Hydra from a jar of drain water, the levels of organisation, and why surface area to volume ratio means big bodies need blood." },
        { target: '.lesson[data-lesson="4"]', cue: "Lesson 4 · Osmosis",
          say: "Lesson 4: diffusion, osmosis and active transport. You will weigh potato strips in six sugar solutions, find the isotonic point, and solve the mystery." },
        { target: '.lesson[data-lesson="5"]', cue: "Lesson 5 · Paper 3 clinic",
          say: "Lesson 5: the Paper 3 clinic. Prepare onion and cheek slides, draw them the way examiners mark, and calculate drawing magnification." },
        { target: ".thread-note", cue: "Spaced Do Now",
          say: "Every lesson starts with a Do Now warm-up from earlier lessons, so nothing is forgotten." }
      ]
    },
    {
      title: "Explorer",
      steps: [
        { target: "#combo-tabs", action: "combo:magnification", cue: "Magnification",
          say: "Try the explorer. First, magnification: the image of a fifty micrometre cell grows in a straight line as magnification rises, but the cell itself never changes." },
        { target: "#combo-svg", action: "combo:osmosis", cue: "Osmosis curve",
          say: "Now osmosis. Potato strips gain mass in dilute solutions and lose mass in concentrated ones. Where the curve crosses zero, at about zero point three four moles per decimetre cubed, the solution is isotonic." },
        { target: "#combo-slider", cue: "Slide along",
          say: "Move the slider to read any point on the graph. You will draw this exact graph from your own results in Lesson 4." }
      ]
    },
    {
      title: "What You Will Master",
      steps: [
        { target: "#master .outcomes", cue: "8 outcomes",
          say: "Here is everything you will master, from the cell theory to the Paper 3 slide." },
        { target: "#archetypes", cue: "6 calculation types",
          say: "Almost every number question on cells is one of these six types: total magnification, cell width from the field of view, actual size, drawing magnification, surface area to volume ratio, and percentage change in mass. Every step has a note under it." }
      ]
    },
    {
      title: "Three Myths",
      steps: [
        { target: "#myths", action: "myth:0", cue: "Myth 1 busted",
          say: "First myth: Hooke discovered living cells. No! His cork was dead. He saw only the empty walls." },
        { target: "#myths", action: "myth:1", cue: "Myth 2 busted",
          say: "Second myth: the cell wall controls what enters the cell. No! The cellulose wall lets almost anything through. The cell membrane is the selective barrier." },
        { target: "#myths", action: "myth:2", cue: "Myth 3 busted",
          say: "Third myth: every plant cell has chloroplasts. No! Onion bulb cells grow without light, so they have none. Never label chloroplasts on an onion drawing." }
      ]
    },
    {
      title: "Ready to Begin",
      steps: [
        { target: "#method .loop", cue: "How every lesson works",
          say: "Every lesson follows the same loop: wonder, investigate, make sense, apply, then reflect. And there is a movement break at forty-five minutes." },
        { target: ".finale", cue: "Start Lesson 1", sparkle: true,
          say: "You are ready! Tap Start Lesson 1 to switch on the microscope and see your first cells." }
      ]
    }
  ]
};
