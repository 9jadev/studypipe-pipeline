/* Lesson 01 · 3D story beats (window.StudyScenes.story).
   Set 1 = Ridge Road outside Ogbomoso (RidgeRoadProps.dressRoad) → Set 2 = the school physics laboratory (dressLab).
   Cast: Hajia Ramatu (= ngozi), Dayo (= cust1), Tunde and Zainab (new), Mrs Okafor (= amaka).
   Without ridge-road-props the stock StoryStage sets are used (clearly marked fallback; never throws). */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var road = null, lab = null, W = null, tray = null;

  // put a person into a set group at a spot, facing yaw
  function putIn(p, group, spot, yaw) {
    if (!p || !group) return;
    if (p.parent !== group) { if (p.parent) p.parent.remove(p); group.add(p); }
    p.userData.target = null; p.userData.state = "idle";
    p.position.set(spot[0], 0, spot[2]); p.rotation.y = yaw || 0;
  }
  function S1(w) { // Set 1 positions (Ridge Road)
    var sp = road ? road.spots : { ramatu: [0, 0, -1.0], dayo: [-1.1, 0, 1.6], zainab: [2.3, 0, -0.85], tunde: [3.1, 0, -0.55] };
    putIn(w.people.zainab, w.props.market, sp.zainab, -0.5);
    putIn(w.people.tunde, w.props.market, sp.tunde, -0.7);
    if (road) road.dismount();
    putIn(w.people.dayo, w.props.market, sp.dayo, Math.PI * 0.85);
  }
  function S2(w) { // Set 2 positions (physics lab)
    var sp = lab ? lab.spots : { okafor: [-1.0, 0, -1.3], zainab: [0.35, 0, -1.15], tunde: [1.25, 0, -1.0] };
    putIn(w.people.zainab, w.props.lab, sp.zainab, -0.4);
    putIn(w.people.tunde, w.props.lab, sp.tunde, -0.6);
    if (lab) { lab.pendulum.swing(true); lab.spring.bounce(true, 0.02); }
  }
  function shot(w, key, fallback) {
    var s = (road && road.shots[key]) || (lab && lab.shots[key]) || fallback;
    w.shot(s[0], s[1], true);
  }

  var beats = [
    {
      caption: "Hajia Ramatu's farm, outside Ogbomoso.",
      hold: 6, who: "ramatu",
      text: "Third time this month, Zainab. Dayo swears he rode carefully.",
      run: function (w) {
        S1(w); shot(w, "gate", [[0, 2.4, 8.0], [0, 1.0, 0]]);
        w.people.ramatu.set("sad");
        if (tray && !tray.parent) w.people.ramatu.hold(tray, "right");
        w.people.zainab.set("think");
      }
    },
    {
      caption: "Dayo on the parked okada.",
      hold: 6.5, who: "dayo",
      text: "Slow, nothing breaks. Fast, nothing breaks. But somewhere in the middle, the back starts to jump like a goat.",
      run: function (w) {
        S1(w); shot(w, "okada", [[4, 1.6, 5], [0, 0.6, 0]]);
        if (road) { road.mount(w.people.dayo); road.press(0.015); }
        w.people.dayo.set("talk");
      }
    },
    {
      caption: "Tunde has a quick answer.",
      hold: 5, who: "tunde",
      text: "Simple. The faster you ride, the more it bounces. Ride slowly every time and finish.",
      run: function (w) {
        S1(w); shot(w, "gate", [[2.5, 2.0, 5.0], [2.6, 1.2, -0.6]]);
        w.people.tunde.set("talk"); w.people.zainab.set("think");
      }
    },
    {
      caption: "Zainab presses the carrier down and lets go.",
      hold: 6.5, who: "zainab",
      text: "Look — it bounces at its own rhythm even when the bike is standing still.",
      run: function (w) {
        S1(w);
        var ox = road ? road.okada.position.x : 0, oz = road ? road.okada.position.z : 0.85;
        putIn(w.people.zainab, w.props.market, [ox - 0.75, 0, oz + 0.75], Math.PI);
        shot(w, "carrier", [[0.2, 1.55, 2.75], [-0.65, 0.95, 0.85]]);
        if (road) road.press(0.04);
        w.people.zainab.set("point");
      }
    },
    {
      caption: "Next day, the school physics laboratory.",
      hold: 6, who: "okafor",
      text: "Before we argue about speed, let's measure that rhythm. Anything that repeats can be timed.",
      run: function (w) {
        S2(w); shot(w, "lab", [[40.3, 2.2, 6.0], [40.3, 1.2, -1.2]]);
        w.people.okafor.set("point");
      }
    },
    {
      caption: "Mrs Okafor beside the pendulum and the loaded spring.",
      hold: 6, who: "okafor",
      text: "Count twenty bounces, not one. Then we'll know how long one takes, and how many happen in a second.",
      run: function (w) {
        S2(w); shot(w, "bench", [[39.1, 1.75, 1.2], [38.9, 1.2, -2.3]]);
        w.people.okafor.set("talk"); w.people.zainab.set("think");
      }
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    names: { ramatu: "Hajia Ramatu", ngozi: "Hajia Ramatu", zainab: "Zainab", tunde: "Tunde", dayo: "Dayo", cust1: "Dayo", okafor: "Mrs Okafor", amaka: "Mrs Okafor" },
    setup: function (api) {
      W = api;
      api.people.ramatu = api.people.ngozi;
      api.people.dayo = api.people.cust1;
      api.people.okafor = api.people.amaka;
      if (api.people.cust2) api.people.cust2.visible = false;

      // new cast
      var zainab = StoryStage.person({ skin: "#6b4a2f", outfit: "#2f7d4a", wrapper: true, hair: "bun" });
      var tunde = StoryStage.person({ skin: "#5a3c26", outfit: "#f4f6f8", pants: "#b59a62", hair: "short" });
      api.props.market.add(zainab); api.props.market.add(tunde);
      api.people.zainab = zainab; api.people.tunde = tunde;

      if (window.RidgeRoadProps) {
        road = RidgeRoadProps.dressRoad(api, { tape: false });
        lab = RidgeRoadProps.dressLab(api, {});
        api.people.ramatu.position.fromArray(road.spots.ramatu);
        if (RidgeRoadProps.createEggTray) tray = RidgeRoadProps.createEggTray({ cracked: 6, seed: 3 });
        if (lab.spots.okafor) { api.people.okafor.position.fromArray(lab.spots.okafor); api.people.okafor.rotation.y = 0.3; }
      } else {
        /* fallback: stock StoryStage sets with new signs */
        var mS = StoryStage.sign("RIDGE ROAD · OGBOMOSO", "rgba(156,74,34,0.95)", "#fff", 0.5);
        if (api.props.mSign) { mS.position.copy(api.props.mSign.position); api.props.market.remove(api.props.mSign); } else mS.position.set(0, 3.6, -1.6);
        api.props.market.add(mS); api.props.mSign = mS;
        var lS = StoryStage.sign("PHYSICS LABORATORY", "rgba(31,53,80,0.95)", "#fff", 0.42);
        if (api.props.lSign) { lS.position.copy(api.props.lSign.position); api.props.lab.remove(api.props.lSign); } else lS.position.set(-1.5, 3.4, -3.05);
        api.props.lab.add(lS); api.props.lSign = lS;
      }
      S1(api);
    },
    onTick: function (api, dt, t) { if (road) road.update(dt, t); if (lab) lab.update(dt, t); }
  });
})();
