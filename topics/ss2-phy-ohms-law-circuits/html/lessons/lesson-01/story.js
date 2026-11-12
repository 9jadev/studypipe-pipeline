/* Lesson 01 · 3D story beats (Set 1 · Nkechi's auto-electric workshop, Ngwa Road, Aba).
   Cast: Emeka (keke rider), Chinedu (apprentice), Tobe (battery seller), Engr. Nkechi.
   Props come from the shared auto-workshop-props kit when present, else StoryStage's built-ins. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var shop = null;

  var beats = [
    {
      caption: "Aba, Ngwa Road. Nkechi Auto-Electric.",
      shot: [[0, 2.4, 7.0], [0, 1.2, 0]], instant: true, hold: 5.5,
      who: "emeka",
      text: "My keke starts fine, but once I switch on the headlamp and rev, the light goes weak.",
      run: function (w) {
        w.people.emeka.set("talk");
        if (shop && shop.keke && shop.keke.setLamp) shop.keke.setLamp(0.4);
      }
    },
    {
      caption: "Chinedu touches the two jumper cables after a test run.",
      shot: [[-0.3, 1.9, 4.6], [0.4, 1.2, 0.3]], hold: 5.5,
      who: "chinedu",
      text: "The thin cable is hot, the thick one is cool. The same current went through both. Why is only the thin one hot?",
      run: function (w) {
        w.people.chinedu.set("point");
        if (shop) {
          if (shop.cablesThin && shop.cablesThin.setHeat) shop.cablesThin.setHeat(0.85);
          if (shop.cablesThick && shop.cablesThick.setHeat) shop.cablesThick.setHeat(0.12);
        }
      }
    },
    {
      caption: "Tobe gives his verdict from the next stall.",
      shot: [[1.2, 1.9, 4.4], [0.6, 1.2, 0.4]], hold: 5,
      who: "tobe",
      text: "The thin wire is just bad quality. Throw it away.",
      run: function (w) { w.people.tobe.set("talk"); w.people.chinedu.set("think"); }
    },
    {
      caption: "Nkechi holds up a coil of resistance wire and a filament bulb.",
      shot: [[-0.2, 1.8, 3.4], [0.2, 1.3, -0.4]], hold: 5.5,
      who: "nkechi",
      text: "Current, voltage and resistance decide everything here. Before we judge any wire, we measure.",
      run: function (w) { w.people.nkechi.set("point"); }
    },
    {
      caption: "She sets a cell, key, ammeter, voltmeter and rheostat on the bench.",
      shot: [[0.2, 1.8, 3.2], [0.1, 1.2, -0.3]], hold: 5.5,
      who: "nkechi",
      text: "Change the voltage, read the current, and let the graph tell us the resistance.",
      run: function (w) { w.people.nkechi.set("talk"); }
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    names: {
      emeka: "Emeka", chinedu: "Chinedu", tobe: "Tobe", nkechi: "Engr. Nkechi",
      ngozi: "Engr. Nkechi", cust1: "Chinedu"
    },
    setup: function (api) {
      // Workshop signage
      var mSign = StoryStage.sign("NKECHI AUTO-ELECTRIC · NGWA RD, ABA", "rgba(13,156,126,0.95)", "#fff", 0.5);
      if (api.props.mSign) { mSign.position.copy(api.props.mSign.position); api.props.market.remove(api.props.mSign); }
      else mSign.position.set(0, 3.6, -1.6);
      api.props.market.add(mSign); api.props.mSign = mSign;

      // Dress the workshop with the shared props (keke, battery, jumper cables, bulb, coil, tool board)
      if (window.AutoWorkshopProps) {
        shop = AutoWorkshopProps.dressWorkshop(api, { tobeStall: true });
      }

      // Cast aliases (build-plan mapping): Nkechi = ngozi, Chinedu = cust1, hide the spare customer
      api.people.nkechi = api.people.ngozi;
      api.people.chinedu = api.people.cust1;
      if (api.people.cust2) api.people.cust2.visible = false;

      // Emeka (keke rider) and Tobe (battery seller) are new characters
      var emeka = StoryStage.person({ skin: "#6b4a2f", outfit: "#e2b33a", pants: "#1c2433", hair: "short" });
      var tobe = StoryStage.person({ skin: "#7a5230", outfit: "#7a3b1d", pants: "#1c2433", hair: "short" });
      var sp = shop && shop.spots;
      emeka.position.set(sp ? sp.emeka[0] : 2.6, 0, sp ? sp.emeka[2] : 1.4); emeka.rotation.y = -0.5;
      tobe.position.set(sp ? sp.tobe[0] : 4.0, 0, sp ? sp.tobe[2] : 1.3); tobe.rotation.y = -0.7;
      api.props.market.add(emeka); api.props.market.add(tobe);
      api.people.emeka = emeka; api.people.tobe = tobe;

      // Place Nkechi and Chinedu on their marks if the kit gave spots
      if (sp) {
        api.people.nkechi.position.set(sp.nkechi[0], 0, sp.nkechi[2]); api.people.nkechi.rotation.y = 0;
        api.people.chinedu.position.set(sp.chinedu[0], 0, sp.chinedu[2]); api.people.chinedu.rotation.y = Math.PI * 0.95;
      }
    },
    onTick: function (api, dt, t) { if (shop && shop.update) shop.update(dt, t); }
  });
})();
