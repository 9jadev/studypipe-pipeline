/* Lesson 03 · 3D story: Set 1, Nkechi's auto-electric workshop on Ngwa Road, Aba.
   Emeka asks how to wire three backup cells; Tobe guesses; Nkechi weighs series against parallel
   and shows why the worn battery runs hot (I²r). Props come from the auto-workshop-props kit when present. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var shop = null;
  // fallback cameras (world [camPos, lookAt]) if the props kit is not loaded
  var WIDE = [[1.2, 2.6, 9.6], [1.2, 1.0, 0.3]];
  var TABLE = [[0.25, 1.75, 2.1], [0.25, 0.98, 0.05]];
  var BATT = [[0.95, 1.3, 0.95], [0.72, 1.02, 0.02]];

  function shot(api, key, fallback) {
    var s = shop && shop.shots && shop.shots[key] ? shop.shots[key] : fallback;
    api.shot.apply(null, s);
  }

  var beats = [
    {
      caption: "Nkechi Auto-Electric, Ngwa Road, Aba.",
      instant: true, hold: 6, who: "emeka",
      text: "My shop needs a backup pump. Should I join these three cells in a line, or side by side?",
      run: function (api) { shot(api, "table", TABLE); api.people.emeka.set("talk"); api.people.nkechi.set("idle"); if (shop && shop.battery) shop.battery.setHeat(0); }
    },
    {
      caption: "Tobe is sure of himself.",
      hold: 5.5, who: "tobe",
      text: "Side by side gives more voltage, obviously. Chinedu is not so sure.",
      run: function (api) { shot(api, "wide", WIDE); api.people.tobe.set("point"); api.people.chinedu.set("think"); }
    },
    {
      caption: "Nkechi weighs the two arrangements.",
      hold: 6.5, who: "nkechi",
      text: "A low-resistance pump pulls a big current. Series gives more voltage but more internal resistance; parallel keeps the voltage but shares the current and lowers r.",
      run: function (api) { shot(api, "table", TABLE); api.people.nkechi.set("talk"); api.people.emeka.set("idle"); }
    },
    {
      caption: "The worn battery is hot after the test.",
      hold: 5.5, who: "chinedu",
      text: "Chinedu touches the old battery. Why does it warm up so much?",
      run: function (api) { shot(api, "battery", BATT); api.people.chinedu.set("point"); if (shop && shop.battery) shop.battery.setHeat(0.9); }
    },
    {
      caption: "To the cell-array bench.",
      hold: 5.5, who: "nkechi",
      text: "Because I squared r is burned inside it. Let us measure which arrangement wastes least and runs coolest.",
      run: function (api) { shot(api, "wide", WIDE); api.people.nkechi.set("talk"); if (shop && shop.battery) shop.battery.setHeat(0.6); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { nkechi: "Engr. Nkechi", ngozi: "Engr. Nkechi", chinedu: "Chinedu", cust1: "Chinedu", tobe: "Tobe", emeka: "Emeka" },
    setup: function (api) {
      var P = api.props, people = api.people, S = window.StoryStage;

      // rename the market sign to Nkechi's workshop
      if (P.mSign) {
        var s = S.sign("NKECHI AUTO-ELECTRIC · NGWA RD, ABA", "rgba(217,138,0,0.95)", "#fff", 0.42);
        s.position.copy(P.mSign.position); P.market.remove(P.mSign); P.market.add(s); P.mSign = s;
      }

      // dress the workshop (keke, worn battery, cables, cells, pump, Tobe's battery stall)
      if (window.AutoWorkshopProps) {
        shop = AutoWorkshopProps.dressWorkshop(api, { tobeStall: true, include: ["keke", "battery", "cablesThick", "cablesThin", "meter", "coil", "bulb", "toolBoard", "cells", "pump"] });
        if (shop && shop.battery) { shop.battery.setState({ E: 12.0, r: 1.2, corrosion: 1 }); shop.battery.setHeat(0); }
        if (shop && shop.cells) shop.cells.setArrangement("parallel", true);
      }

      // aliases: Nkechi = ngozi (Ankara + gele), Chinedu = cust1; build Tobe and Emeka
      people.nkechi = people.ngozi;
      people.chinedu = people.cust1;
      var tobe = S.person({ skin: "#5a3a26", outfit: "#7a3b1d", pants: "#1c2433", hair: "short" });
      var emeka = S.person({ skin: "#4a2e1f", outfit: "#e2b33a", pants: "#27324a", hair: "short" });
      P.market.add(tobe); P.market.add(emeka);
      people.tobe = tobe; people.emeka = emeka;

      // hide cast members not in this lesson
      if (people.cust2) people.cust2.visible = false;
      if (people.amaka) people.amaka.visible = false;

      // place everyone on the workshop floor (market-group coordinates)
      var sp = (shop && shop.spots) || { nkechi: [0.1, 0, -0.95], chinedu: [1.0, 0, 0.95], tobe: [3.6, 0, -0.25], emeka: [1.75, 0, 2.45] };
      function put(p, pos, face) {
        if (!p) return;
        p.position.set(pos[0], 0, pos[2]);
        p.userData.faceTarget = new THREE.Vector3(face[0], 0, face[2]);
      }
      var centre = [1.0, 0, 0.2];
      put(people.nkechi, sp.nkechi, centre);
      put(people.chinedu, sp.chinedu, centre);
      put(people.tobe, sp.tobe, centre);
      put(people.emeka, sp.emeka, centre);
    },
    onTick: function (api, dt, t) {
      if (shop && shop.update) shop.update(dt, t);
    }
  });
})();
