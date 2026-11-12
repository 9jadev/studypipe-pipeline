/* Lesson 05 · 3D story (Set 2): Engr. Nkechi's test bench. She balances Emeka's battery on a potentiometer,
   drawing no current, to read its true EMF of 12.0 V — proving the EMF is unchanged and the internal resistance has risen.
   Shared workshop props come from auto-workshop-props (dressBench); the story still reads without them. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var shop = null;
  // world-space fallback shots near the lab set (x = 40)
  var BENCH = [[40.0, 2.3, 3.4], [39.8, 1.5, -2.1]];
  var CLOSE = [[39.4, 1.9, 2.4], [39.6, 1.4, -2.1]];

  function reset(w) {
    var p = w.people, lab = w.props.lab;
    // Nkechi = amaka (coat + goggles), already in the lab; Chinedu = cust1, reparented into the lab for Set 2
    if (p.amaka.parent !== lab) { p.amaka.parent.remove(p.amaka); lab.add(p.amaka); }
    if (p.cust1.parent !== lab) { p.cust1.parent.remove(p.cust1); lab.add(p.cust1); }
    var nk = (shop && shop.spots && shop.spots.nkechi) || [-1.1, 0, -1.4];
    var ch = (shop && shop.spots && shop.spots.chinedu) || [0.9, 0, -0.9];
    p.amaka.position.set(nk[0], 0, nk[2]); p.amaka.rotation.y = 0.2; p.amaka.userData.faceTarget = new THREE.Vector3(-0.5, 0, -2.3);
    p.cust1.position.set(ch[0], 0, ch[2]); p.cust1.rotation.y = -0.2; p.cust1.userData.faceTarget = new THREE.Vector3(-0.5, 0, -2.3);
    if (p.cust2) p.cust2.visible = false;
    if (p.ngozi) p.ngozi.visible = false;
  }

  var beats = [
    {
      caption: "Nkechi's test bench. Emeka's battery lies beside a 100 cm slide wire.",
      shot: BENCH, instant: true, hold: 6, who: "amaka",
      text: "The voltmeter lied under load. Let us ask the battery without taking any current from it.",
      run: function (w) { reset(w); w.people.amaka.set("point"); w.people.cust1.set("idle"); if (shop && shop.battery) shop.battery.setLoad(null); }
    },
    {
      caption: "Chinedu slides the jockey along the wire.",
      shot: CLOSE, hold: 5.5, who: "cust1",
      text: "I am sliding the jockey. The galvanometer swings one way, then the other.",
      run: function (w) { reset(w); w.people.cust1.set("point"); w.people.amaka.set("talk"); }
    },
    {
      caption: "Nkechi sets the driver.",
      shot: BENCH, hold: 6, who: "amaka",
      text: "At the null point no current flows, so no lost volts. To balance twelve volts I use a twenty-four volt driver, set so the wire carries zero point one five zero volts per centimetre.",
      run: function (w) { reset(w); w.people.amaka.set("talk"); w.people.cust1.set("think"); }
    },
    {
      caption: "The needle settles at 80.0 cm.",
      shot: CLOSE, hold: 6.5, who: "amaka",
      text: "There: eighty point zero centimetres. E equals k l, zero point one five zero times eighty, is twelve point zero volts. The EMF is unchanged. What has risen is the internal resistance: sulphate crust and corroded terminals.",
      run: function (w) { reset(w); w.people.amaka.set("point"); w.people.cust1.set("idle"); }
    },
    {
      caption: "Nkechi clips an unknown coil into the metre bridge.",
      shot: BENCH, hold: 5.5, who: "amaka",
      text: "Same idea, different question. On the metre bridge we find a resistance exactly, by where the galvanometer reads zero. Come to the bench and balance it yourself.",
      run: function (w) { reset(w); w.people.amaka.set("talk"); w.people.cust1.set("think"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { amaka: "Engr. Nkechi", cust1: "Chinedu" },
    setup: function (api) {
      var P = api.props, S = window.StoryStage;
      // retitle the lab sign to Nkechi's test bench
      if (P.lSign) {
        var s = S.sign("NKECHI TEST BENCH", "rgba(59,108,246,0.95)", "#fff", 0.42);
        s.position.copy(P.lSign.position); P.lab.remove(P.lSign); P.lab.add(s); P.lSign = s;
      }
      // dress the bench with the shared workshop props (keeps the look across all five lessons)
      if (window.AutoWorkshopProps && AutoWorkshopProps.dressBench) {
        try { shop = AutoWorkshopProps.dressBench(api, { meterOnBattery: true }); } catch (e) { shop = null; }
      }
      if (api.people.cust2) api.people.cust2.visible = false;
      if (api.people.ngozi) api.people.ngozi.visible = false;
    },
    onTick: function (api, dt, t) { if (shop && shop.update) shop.update(dt, t); }
  });
})();
