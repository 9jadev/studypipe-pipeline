/* Lesson 04 · 3D story: Engr. Nkechi's test bench (Set 2). Chinedu almost pushes 3 A through a
   delicate 15 mA galvanometer; Nkechi shows the shunt (ammeter) and the multiplier (voltmeter).
   Uses the shared auto-workshop-props kit when present, and reads well without it. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  // Lab set lives at world x = 40; shots are in world coordinates.
  var LX = 40;
  var WIDE = [[LX + 0.2, 2.2, 4.8], [LX - 0.4, 1.3, -1.8]];
  var BENCH = [[LX + 0.6, 1.9, 3.2], [LX - 0.3, 1.2, -2.1]];
  var CLOSE = [[LX - 0.2, 1.7, 2.4], [LX - 0.6, 1.1, -2.1]];

  var shop = null;

  function place(api) {
    var p = api.people, lab = api.props.lab;
    // Chinedu (cust1) and Tobe stand at the bench; Engr. Nkechi (amaka) behind it.
    if (p.cust1.parent !== lab) { p.cust1.parent.remove(p.cust1); lab.add(p.cust1); }
    p.cust1.position.set(0.9, 0, -0.9); p.cust1.rotation.y = 0.2;
    p.cust1.userData.faceTarget = new THREE.Vector3(LX - 0.6, 0, -2.2);
    if (p.tobe) { p.tobe.position.set(2.2, 0, -0.7); p.tobe.rotation.y = -0.3; p.tobe.userData.faceTarget = new THREE.Vector3(LX - 0.6, 0, -2.2); }
    p.amaka.position.set(-1.1, 0, -1.7); p.amaka.rotation.y = 0.15; p.amaka.userData.faceTarget = null;
    if (p.ngozi) p.ngozi.visible = false;
    if (p.cust2) p.cust2.visible = false;
  }

  var beats = [
    {
      caption: "Nkechi's test bench. Chinedu reaches for a small galvanometer.",
      shot: BENCH, instant: true, hold: 6, who: "chinedu",
      text: "Let me just clip this little galvanometer onto the 3 A starter line and read it.",
      run: function (w) { place(w); w.people.cust1.set("point"); w.people.amaka.set("point"); if (w.people.tobe) w.people.tobe.set("idle"); }
    },
    {
      caption: "Nkechi stops his hand.",
      shot: CLOSE, hold: 6, who: "nkechi",
      text: "Stop. That coil takes full-scale deflection at only 15 milliamperes. Push 3 amperes through it and it burns out.",
      run: function (w) { place(w); w.people.amaka.set("talk"); w.people.cust1.set("think"); }
    },
    {
      caption: "Tobe shrugs.",
      shot: BENCH, hold: 5, who: "tobe",
      text: "So we just buy a bigger meter?",
      run: function (w) { place(w); if (w.people.tobe) w.people.tobe.set("talk"); w.people.amaka.set("idle"); }
    },
    {
      caption: "Nkechi smiles and holds up a tiny resistor.",
      shot: CLOSE, hold: 6.5, who: "nkechi",
      text: "No. We give most of the current a bypass — a tiny resistor in parallel, the shunt. The same coil then reads amperes.",
      run: function (w) { place(w); w.people.amaka.set("point"); w.people.cust1.set("idle"); }
    },
    {
      caption: "To the design bench.",
      shot: WIDE, hold: 6, who: "nkechi",
      text: "And for voltage we add a big resistor in series, the multiplier, so the coil only ever sees 15 milliamperes. One movement, two instruments. Come and build them.",
      run: function (w) { place(w); w.people.amaka.set("talk"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { nkechi: "Engr. Nkechi", amaka: "Engr. Nkechi", chinedu: "Chinedu", cust1: "Chinedu", tobe: "Tobe" },
    setup: function (api) {
      var P = api.props, S = window.StoryStage;
      // retitle the lab sign to Nkechi's test bench
      if (P.lSign) {
        var s = S.sign("NKECHI TEST BENCH", "rgba(16,42,67,0.95)", "#fff", 0.42);
        s.position.copy(P.lSign.position); P.lab.remove(P.lSign); P.lab.add(s); P.lSign = s;
      }
      // hide the default chemistry props
      ["balance", "burette", "flask", "vflask"].forEach(function (k) { if (P[k]) P[k].visible = false; });

      // cast aliases: Nkechi = amaka (coat + goggles); Chinedu = cust1
      api.people.nkechi = api.people.amaka;
      api.people.chinedu = api.people.cust1;

      // Tobe: a new person at the bench
      var tobe = S.person({ skin: "#5a3620", outfit: "#7a3b1d", pants: "#1c2433", hair: "short" });
      P.lab.add(tobe); api.people.tobe = tobe;

      // dress the bench with the shared workshop props when the kit is present
      if (window.AutoWorkshopProps) {
        shop = AutoWorkshopProps.dressBench(api, { include: ["battery", "meter", "coil"], meterOnBattery: false });
      }
      place(api);
    },
    onTick: function (api, dt, t) { if (shop && shop.update) shop.update(dt, t); }
  });
})();
