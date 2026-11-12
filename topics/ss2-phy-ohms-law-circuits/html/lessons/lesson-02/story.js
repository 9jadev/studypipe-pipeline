/* Lesson 02 · 3D story: the missing 3.6 V at Nkechi's auto-electric workshop (Ngwa Rd, Aba).
   Set 1 (workshop) with the shared auto-workshop props. Cast: Chinedu (apprentice), Tobe (battery seller), Engr. Nkechi. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var shop = null, tobe = null;
  var WIDE = [[0, 2.5, 7.0], [0, 1.3, 0]];

  function face(p, x, z) { if (p) { p.userData.faceTarget = new THREE.Vector3(x, 0, z); } }
  function useShot(api, name) { if (shop && shop.shots && shop.shots[name]) api.shot(shop.shots[name][0], shop.shots[name][1]); }

  var beats = [
    {
      caption: "Nkechi Auto-Electric, Ngwa Rd, Aba. Chinedu clips a voltmeter across the resting keke battery.",
      shot: WIDE, instant: true, hold: 5,
      who: "chinedu",
      text: "12.0 V, boss. It looks normal.",
      run: function (w) {
        useShot(w, "table");
        if (shop && shop.battery) shop.battery.setLoad(null);
        if (shop && shop.meter && shop.meter.setValue) shop.meter.setValue(12.0);
        w.people.chinedu.set("point");
        if (w.people.nkechi) w.people.nkechi.set("idle");
      }
    },
    {
      caption: "He throws the starter switch. The reading drops to 8.4 V and the headlamp dims.",
      shot: (shopShot("battery")) || [[-0.3, 1.9, 4.6], [0.3, 1.2, 0.2]], hold: 5.5,
      who: "chinedu",
      text: "It fell! Where did 3.6 volts go?",
      run: function (w) {
        useShot(w, "battery");
        if (shop && shop.battery) shop.battery.setLoad(2.8);     // 12.0 V, 1.2 Ω on 2.8 Ω → 8.4 V, 3.0 A
        if (shop && shop.meter && shop.meter.setValue) shop.meter.setValue(8.4);
        if (shop && shop.keke && shop.keke.setLamp) shop.keke.setLamp(0.4);
        w.people.chinedu.set("talk");
      }
    },
    {
      caption: "Tobe, the battery seller next door, is quick to judge.",
      shot: (shopShot("wide")) || [[1.2, 2.0, 5.0], [0.4, 1.3, 0.4]], hold: 5,
      who: "tobe",
      text: "The battery is weak, it has lost its voltage. Dump it and buy one from me.",
      run: function (w) { useShot(w, "wide"); if (w.people.tobe) w.people.tobe.set("point"); w.people.chinedu.set("think"); }
    },
    {
      caption: "Engr. Nkechi is not convinced.",
      shot: (shopShot("table")) || [[0.2, 1.8, 3.4], [0.2, 1.3, -0.4]], hold: 6,
      who: "nkechi",
      text: "The EMF has not fallen. Those volts are spent inside the battery when a big current flows. We will measure how much resistance is hiding in there.",
      run: function (w) { useShot(w, "table"); if (w.people.nkechi) w.people.nkechi.set("talk"); }
    },
    {
      caption: "She sets up the cell, key, rheostat and both meters on the test bench.",
      shot: (shopShot("table")) || [[0.6, 1.7, 2.8], [0.2, 1.2, -0.2]], hold: 5.5,
      who: "nkechi",
      text: "Open key: you see the EMF. Closed key: you see what is left after the inside takes its cut. Let us plot V against I.",
      run: function (w) { useShot(w, "table"); if (w.people.nkechi) w.people.nkechi.set("point"); }
    }
  ];

  // resolved lazily — shop is built in setup(), before beats run
  function shopShot(name) { return shop && shop.shots && shop.shots[name] ? shop.shots[name] : null; }

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      nkechi: "Engr. Nkechi", ngozi: "Engr. Nkechi", amaka: "Engr. Nkechi",
      chinedu: "Chinedu", cust1: "Chinedu", tobe: "Tobe", emeka: "Emeka"
    },
    setup: function (api) {
      // signs
      var mSign = StoryStage.sign("NKECHI AUTO-ELECTRIC · NGWA RD, ABA", "rgba(13,156,126,0.95)", "#fff", 0.5);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign); api.props.market.add(mSign); api.props.mSign = mSign;

      // aliases (cast mapping, build plan)
      api.people.nkechi = api.people.ngozi;
      api.people.chinedu = api.people.cust1;
      if (api.people.cust2) api.people.cust2.visible = false;

      // Tobe, the battery seller next door
      tobe = StoryStage.person({ skin: "#8a5a3c", outfit: "#7a3b1d", pants: "#1c2433", hair: "short" });
      api.props.market.add(tobe); api.people.tobe = tobe;

      if (window.AutoWorkshopProps) {
        shop = AutoWorkshopProps.dressWorkshop(api, { tobeStall: true, meterOnBattery: true });
        // place the cast at the workshop spots
        var S = shop.spots || {};
        if (S.chinedu) { api.people.chinedu.position.set(S.chinedu[0], 0, S.chinedu[2]); }
        if (S.nkechi) { api.people.nkechi.position.set(S.nkechi[0], 0, S.nkechi[2]); }
        if (S.tobe) { tobe.position.set(S.tobe[0], 0, S.tobe[2]); } else { tobe.position.set(4.0, 0, 0.6); }
        face(api.people.chinedu, 0.7, 0.9);
        face(api.people.nkechi, 0.7, 0.9);
        face(tobe, 0.5, 0.9);
      } else {
        // graceful fallback: default market props only
        tobe.position.set(1.4, 0, 1.6); tobe.rotation.y = Math.PI * 1.1;
        api.people.chinedu.position.set(-1.0, 0, 1.4);
        api.people.nkechi.position.set(0, 0, -1.0);
      }
    },
    onTick: function (api, dt, t) { if (shop && shop.update) shop.update(dt, t); }
  });
})();
