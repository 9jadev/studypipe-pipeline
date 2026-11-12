/* Lesson 05 · 3D story: exam week in the Biology lab. Chinedu is proud of his drawings, Coach Danjuma says "label everything",
   Dr Amaka marks 4 out of 10. Characters: cust1 = Chinedu, cust2 = Coach Danjuma, amaka = Dr Amaka. All five beats are in the lab set. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var LAB_WIDE = [[40.3, 2.1, 4.0], [40.3, 1.5, -1.5]];
  var scorePanel, sheet;

  // ---- a paper sheet with Chinedu's onion drawing painted on a canvas (marked = Dr Amaka's red pen) ----
  function drawSheet(marked) {
    var c = document.createElement("canvas");
    c.width = 512; c.height = 384;
    var g = c.getContext("2d");
    g.fillStyle = "#fbf8ef"; g.fillRect(0, 0, 512, 384);
    g.strokeStyle = "#e1d9c3"; g.lineWidth = 1;
    for (var y = 24; y < 384; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
    // two small onion cells (too small: 3 cm)
    g.strokeStyle = "#2b2b2b"; g.lineWidth = 3;
    g.strokeRect(70, 110, 90, 70); g.strokeRect(160, 110, 90, 70);
    g.fillStyle = "rgba(60,60,60,0.55)"; g.fillRect(74, 114, 82, 62);                 // shading
    g.fillStyle = "#2b2b2b"; g.beginPath(); g.arc(205, 128, 9, 0, 6.3); g.fill();      // nucleus
    // guidelines: one with an arrowhead, one crossing
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(250, 120); g.lineTo(340, 100); g.stroke();
    g.beginPath(); g.moveTo(250, 160); g.lineTo(340, 188); g.stroke();
    g.beginPath(); g.moveTo(340, 188); g.lineTo(326, 186); g.lineTo(333, 176); g.closePath(); g.fill();
    g.font = "bold 20px sans-serif"; g.fillStyle = "#2b2b2b";
    g.fillText("Nuclei", 346, 104); g.fillText("mitochondrion", 346, 150); g.fillText("chloroplast", 346, 192);
    g.font = "16px sans-serif"; g.fillText("onion cell drawing", 90, 232); g.fillText("Mag. ×250", 90, 256);
    if (marked) {
      g.strokeStyle = "#d62839"; g.fillStyle = "#d62839"; g.lineWidth = 4;
      g.beginPath(); g.ellipse(120, 146, 76, 52, 0, 0, 6.3); g.stroke();
      g.beginPath(); g.moveTo(340, 130); g.lineTo(480, 130); g.stroke();
      g.font = "bold 74px sans-serif"; g.fillText("4/10", 300, 330);
    }
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    return t;
  }

  function buildSheetProp(marked) {
    var g = new THREE.Group();
    var board = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.8, 0.04), StoryStage.std("#7a5230", 0.7));
    g.add(board);
    var paper = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.735), new THREE.MeshBasicMaterial({ map: drawSheet(marked), toneMapped: false }));
    paper.position.z = 0.023; g.add(paper);
    g.userData.paper = paper;
    // simple easel legs
    var legMat = StoryStage.std("#5b3d22", 0.7);
    [-0.34, 0.34].forEach(function (x) {
      var leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.05), legMat);
      leg.position.set(x, -0.55, -0.08); leg.rotation.x = 0.18; g.add(leg);
    });
    return g;
  }

  // ---- a textbook that Coach Danjuma carries ----
  function buildBook() {
    var g = new THREE.Group();
    var cover = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.045), StoryStage.std("#1e3a5f", 0.6));
    var pages = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.265, 0.036), StoryStage.std("#f4ecd6", 0.8));
    pages.position.x = 0.006;
    g.add(cover, pages);
    g.rotation.set(0.3, 0, 0.1);
    return g;
  }

  // ---- two stained slides on the bench for the last beat ----
  function buildSlides() {
    var g = new THREE.Group();
    function slide(x, stain) {
      var glass = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.09), new THREE.MeshStandardMaterial({ color: 0xdff1ff, roughness: 0.1, transparent: true, opacity: 0.55 }));
      glass.position.x = x;
      var spot = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.014, 20), new THREE.MeshStandardMaterial({ color: stain, roughness: 0.5, transparent: true, opacity: 0.85 }));
      spot.position.set(x + 0.02, 0.006, 0);
      g.add(glass, spot);
    }
    slide(-0.17, 0xc88a2c);
    slide(0.17, 0x3b5cc4);
    return g;
  }

  function placeFor(w, name, x, z, ry) {
    var p = w.people[name];
    if (p.parent !== w.props.lab) { if (p.parent) p.parent.remove(p); w.props.lab.add(p); }
    p.position.set(x, 0, z); p.rotation.y = ry || 0;
    p.userData.target = null; p.userData.state = "idle";
    p.hold(null);
  }

  function settle(w) {
    placeFor(w, "cust1", -0.8, -1.2, 0);
    placeFor(w, "amaka", 0.55, -1.2, 0);
    placeFor(w, "cust2", 1.45, -1.0, 0);
    w.people.cust1.userData.faceTarget = new THREE.Vector3(0.9, 0, 2.6);
    w.people.amaka.userData.faceTarget = new THREE.Vector3(-0.9, 0, 2.6);
    w.people.cust2.userData.faceTarget = new THREE.Vector3(-0.6, 0, 2.6);
    w.props.book.visible = false;
    w.props.scoreMark.visible = false;
    w.props.slides.visible = false;
    w.props.drawingMarked.visible = false;
    w.props.drawing.visible = true;
  }

  var beats = [
    {
      caption: "Exam week. The Biology practical lab, Government Secondary School, Enugu.",
      shot: LAB_WIDE, instant: true, hold: 5.5, who: "cust1",
      text: "Look at my drawings of onion cells and cheek cells, Coach! I worked on them all weekend. I am sure I will score full marks!",
      run: function (w) { settle(w); w.people.cust1.set("cheer"); w.people.amaka.set("idle"); }
    },
    {
      caption: "Coach Danjuma reads from a textbook.",
      shot: [[41.1, 1.9, 2.7], [40.95, 1.4, -1.0]], hold: 5.5, who: "cust2",
      text: "Chinedu, label the mitochondria and the chloroplasts! Examiners love those. More labels, more marks!",
      run: function (w) {
        settle(w);
        w.props.book.visible = true; w.people.cust2.hold(w.props.book, "right");
        w.people.cust2.set("point"); w.people.cust1.set("think");
      }
    },
    {
      caption: "Dr Amaka marks the drawing with her red pen.",
      shot: [[40.0, 2.3, 3.4], [40.0, 1.95, -2.0]], hold: 5.5, who: "amaka",
      text: "I have marked your work, Chinedu. Four out of ten.",
      run: function (w) {
        settle(w);
        w.props.drawing.visible = false; w.props.drawingMarked.visible = true;
        w.props.scoreMark.visible = true;
        w.people.amaka.set("talk"); w.people.cust1.set("sad");
      }
    },
    {
      caption: "“True in the textbook, not on your slide.”",
      shot: [[40.2, 2.05, 3.6], [40.2, 1.6, -1.5]], hold: 6, who: "amaka",
      text: "But Dr Amaka, everything I drew is true! Yes, Chinedu: true in the textbook, but not on your slide. The examiner marks what is on your slide.",
      run: function (w) {
        settle(w);
        w.props.drawing.visible = false; w.props.drawingMarked.visible = true; w.props.scoreMark.visible = true;
        w.people.amaka.set("point"); w.people.cust1.set("think"); w.people.cust2.set("idle");
      }
    },
    {
      caption: "To the slide bench and the drawing audit.",
      shot: [[40.0, 1.75, 2.3], [40.1, 1.15, -2.0]], hold: 6, who: "amaka",
      text: "Come to the slide bench. Prepare an onion slide and a cheek slide yourself, then we will audit your drawings against the nine rules.",
      run: function (w) {
        settle(w);
        w.props.drawing.visible = false; w.props.drawingMarked.visible = true;
        w.props.slides.visible = true;
        w.people.amaka.set("point"); w.people.cust1.set("cheer"); w.people.cust2.set("talk");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Ngozi", cust1: "Chinedu", cust2: "Coach Danjuma", amaka: "Dr Amaka" },
    setup: function (api) {
      var lSign = StoryStage.sign("SS1 BIOLOGY PRACTICAL LAB · ENUGU", "rgba(13,156,126,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      // the chemistry-lab props are not needed in a biology lab
      ["balance", "burette", "flask", "vflask"].forEach(function (k) { if (api.props[k]) api.props[k].visible = false; });

      api.props.drawing = buildSheetProp(false);
      api.props.drawing.position.set(-0.1, 2.4, -3.0); api.props.drawing.scale.setScalar(1.3);
      api.props.lab.add(api.props.drawing);
      api.props.drawingMarked = buildSheetProp(true);
      api.props.drawingMarked.position.copy(api.props.drawing.position); api.props.drawingMarked.rotation.copy(api.props.drawing.rotation); api.props.drawingMarked.scale.copy(api.props.drawing.scale);
      api.props.lab.add(api.props.drawingMarked);

      api.props.scoreMark = StoryStage.sign("4 / 10", "rgba(200,38,74,0.95)", "#fff", 0.3);
      api.props.scoreMark.position.set(1.05, 2.4, -2.98);
      api.props.lab.add(api.props.scoreMark);

      api.props.book = buildBook();
      api.props.slides = buildSlides();
      api.props.slides.position.set(0.0, 1.0, -2.2); api.props.slides.scale.setScalar(2);
      api.props.lab.add(api.props.slides);

      settle(api);
    }
  });
})();
