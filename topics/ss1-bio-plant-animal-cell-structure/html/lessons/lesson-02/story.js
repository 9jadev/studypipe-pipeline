/* Lesson 02 · 3D story beats: Dr Amaka, Coach Danjuma and Chinedu in the LUTH teaching lab, with a giant plant cell and animal cell on the screen */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  // everything happens in the lab set, which sits at world x = 40
  var LX = 40;
  var WIDE = [[LX - 1.5, 2.9, 3.9], [LX - 1.5, 2.3, -3.0]];

  var plantCell = null, animalCell = null;

  function reset(w) {
    var p = w.people;
    p.amaka.userData.faceTarget = new THREE.Vector3(-1.2, 0, -3);
    p.cust1.userData.faceTarget = new THREE.Vector3(-1.2, 0, -3);
    p.cust2.userData.faceTarget = new THREE.Vector3(-1.2, 0, -3);
  }

  var beats = [
    {
      caption: "The LUTH teaching lab. Dr Amaka projects two giant cells.",
      shot: WIDE, instant: true, hold: 5.2,
      who: "amaka",
      text: "Today we look inside the cell. On the left is a plant cell from an ugu leaf, on the right an animal cell from a cheek.",
      run: function (w) { reset(w); w.people.amaka.set("point"); }
    },
    {
      caption: "Coach Danjuma is not impressed.",
      shot: [[LX + 0.5, 2.1, 2.5], [LX - 0.1, 1.6, -1.0]], hold: 4.8,
      who: "cust2",
      text: "A cell is just a bag of water, Doctor. What else is in there?",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.amaka.set("think"); }
    },
    {
      caption: "Chinedu spots a thick outer layer around the plant cell only.",
      shot: [[LX - 2.7, 2.4, 1.8], [LX - 2.1, 2.3, -2.8]], hold: 5,
      who: "cust1",
      text: "Madam, the ugu cell has a thick layer all around the outside. The cheek cell does not.",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Dr Amaka: that wall and the sap vacuole decide what water does.",
      shot: [[LX - 1.3, 2.6, 3.4], [LX - 1.3, 2.2, -2.5]], hold: 5.8,
      who: "amaka",
      text: "Exactly. That wall, and the big sap vacuole, will decide what happens to a leaf in salty water. Today we open the cell and meet its workers.",
      run: function (w) { reset(w); w.people.amaka.set("talk"); }
    },
    {
      caption: "The organelle dissector is ready.",
      shot: [[LX - 0.9, 2.4, 3.2], [LX - 1.1, 2.0, -2.0]], hold: 5,
      who: "amaka",
      text: "Come to the dissector. Tap each part of the cell, and find out what each worker does.",
      run: function (w) { reset(w); w.people.amaka.set("wave"); w.people.cust1.set("cheer"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Ngozi", cust1: "Chinedu", cust2: "Coach Danjuma", amaka: "Dr Amaka" },
    setup: function (api) {
      var lab = api.props.lab, P = api.people;

      // bring the three speakers into the lab
      [["amaka", -1.0, -1.7], ["cust1", -2.4, -0.7], ["cust2", -0.2, -0.6]].forEach(function (a) {
        var pr = P[a[0]];
        if (pr.parent) pr.parent.remove(pr);
        lab.add(pr);
        pr.position.set(a[1], 0, a[2]);
        pr.rotation.y = 0;
      });
      P.ngozi.visible = false;

      // retitle the lab sign
      var lSign = StoryStage.sign("LUTH CELL BIOLOGY TEACHING LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.set(3.9, 3.65, -3.05);
      lab.remove(api.props.lSign); lab.add(lSign); api.props.lSign = lSign;

      // projector screen with the two giant cells in front of it
      var screenMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
      var screen = new THREE.Mesh(new THREE.BoxGeometry(3.7, 1.9, 0.06), screenMat);
      screen.position.set(-1.6, 2.75, -3.0);
      lab.add(screen);
      var frame = new THREE.Mesh(new THREE.BoxGeometry(3.82, 2.02, 0.04), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }));
      frame.position.set(-1.6, 2.75, -3.04);
      lab.add(frame);

      if (window.CellKit) {
        plantCell = CellKit.plantCell({ w: 2.2, h: 1.45, d: 1.25, chloroplasts: 12, tonicity: 1 });
        plantCell.scale.setScalar(0.55);
        plantCell.position.set(-2.3, 2.7, -2.7);
        plantCell.rotation.set(0.14, 0.34, 0);
        animalCell = CellKit.animalCell({ r: 0.95, seed: 9 });
        animalCell.scale.setScalar(0.6);
        animalCell.position.set(-0.9, 2.7, -2.7);
        animalCell.rotation.set(0.2, -0.28, 0);
        lab.add(plantCell, animalCell);
        var l1 = CellKit.label("Plant cell", { h: 0.2 }); l1.position.set(-2.3, 3.55, -2.7); lab.add(l1);
        var l2 = CellKit.label("Animal cell", { h: 0.2 }); l2.position.set(-0.9, 3.55, -2.7); lab.add(l2);
      }
      // hide the unrelated bench clutter that would hide the screen
      ["balance", "burette", "flask", "vflask"].forEach(function (k) { if (api.props[k]) api.props[k].visible = false; });
    },
    onTick: function (api, dt, t) {
      if (plantCell && plantCell.userData.update) plantCell.userData.update(dt, t);
      if (animalCell && animalCell.userData.update) animalCell.userData.update(dt, t);
    }
  });
})();
