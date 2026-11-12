/* Lesson 07 · 3D story: Ridge Road (Set 1) → physics lab (Set 2) → Ridge Road.
   Dayo rides the ridges at 10, 30 and 18 km/h (only 18 throws the crates); Tunde drops "faster is worse";
   Mrs Okafor shows Barton's pendulums; Hajia Ramatu asks for the verdict.
   Cast keys used for the speech bubble: cust1 = Dayo, ngozi = Hajia Ramatu, amaka = Mrs Okafor, tunde (new).
   Aliases (dayo, ramatu, okafor) are registered in api.props so narration can target them without
   double-animating the StoryStage people. Ride physics come from RidgeRoadProps (dressRoad → ride()). */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var road = null, lab = null, follow = false, apiRef = null;
  var GATE = [[0.5, 2.0, 5.4], [0, 1.25, -1.2]];
  var LABW = [[43.4, 1.65, 2.2], [43.4, 1.35, -1.7]];

  function moveTo(p, group, xyz) {
    if (!p) return;
    if (p.parent !== group) { if (p.parent) p.parent.remove(p); group.add(p); }
    p.position.set(xyz[0], 0, xyz[2]);
    p.visible = true;
  }
  function ride(w, kmh) {
    if (!road) return;
    var p = w.people;
    try { road.dismount(); } catch (e) { /* not mounted */ }
    road.setLoad(200); road.setDamper("leaking");
    road.mount(p.cust1);
    road.ride(kmh, { mass: 200, damper: "leaking" });
    follow = true;
  }
  function park(w) {
    follow = false;
    if (road) { try { road.dismount(); } catch (e) { /* not mounted */ } road.park(); }
  }

  var beats = [
    {
      caption: "Ridge Road, about 10 km/h.",
      shot: [[6, 2.0, 6], [0, 0.5, 0]], instant: true, hold: 6, who: "cust1",
      text: "Slow and steady today. The carrier jolts at every ridge, but the crates stay put.",
      run: function (w) { if (w.people.tunde) w.people.tunde.visible = false; ride(w, 10); }
    },
    {
      caption: "Ridge Road, about 30 km/h.",
      shot: [[6, 2.0, 6], [0, 0.5, 0]], hold: 6, who: "cust1",
      text: "Now I am flying! The ridges blur and the back hardly moves. The crates are fine.",
      run: function (w) { ride(w, 30); }
    },
    {
      caption: "Ridge Road, 18 km/h.",
      shot: [[6, 2.0, 6], [0, 0.5, 0]], hold: 8, who: "cust1",
      text: "Each ridge comes just as the last bounce returns. It is pumping higher and higher… Ah! The crate! Not again!",
      run: function (w) { ride(w, 18); }
    },
    {
      caption: "Tunde rethinks his theory.",
      shot: GATE, instant: true, hold: 5.5, who: "tunde",
      text: "So it's not 'faster is worse' after all. Thirty was smooth, eighteen was a disaster.",
      run: function (w) {
        park(w);
        if (road) moveTo(w.people.cust1, w.props.market, road.spots.dayo);
        if (w.people.tunde) { moveTo(w.people.tunde, w.props.market, road ? road.spots.tunde : [3.1, 0, -0.55]); w.people.tunde.set("think"); }
        w.people.cust1.set("sad");
        w.shot(GATE[0], GATE[1], true);
      }
    },
    {
      caption: "School physics lab: Barton's pendulums.",
      shot: LABW, instant: true, hold: 8, who: "amaka",
      text: "Watch. Only the paper cone as long as the heavy driver swings wide. Pushes that arrive at a system's own rhythm add up. That has a name: resonance.",
      run: function (w) {
        park(w);
        if (lab) {
          moveTo(w.people.amaka, w.props.lab, lab.spots.okaforBarton);
          if (w.people.tunde) moveTo(w.people.tunde, w.props.lab, lab.spots.tundeBarton);
          w.shot(lab.shots.barton[0], lab.shots.barton[1], true);
          if (lab.barton) { if (lab.barton.setDriverLength) lab.barton.setDriverLength(0.60); if (lab.barton.start) lab.barton.start(); }
        }
        w.people.amaka.set("point");
      }
    },
    {
      caption: "Back at the farm gate.",
      shot: GATE, instant: true, hold: 6, who: "ngozi",
      text: "Then tell Dayo the speed to avoid, and what to fix.",
      run: function (w) {
        park(w);
        if (road) { moveTo(w.people.cust1, w.props.market, road.spots.dayo); moveTo(w.people.ngozi, w.props.market, road.spots.ramatu); }
        if (w.people.tunde && road) moveTo(w.people.tunde, w.props.market, road.spots.tunde);
        w.people.ngozi.set("talk"); w.people.cust1.set("idle");
        w.shot(GATE[0], GATE[1], true);
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Hajia Ramatu", cust1: "Dayo", amaka: "Mrs Okafor", tunde: "Tunde" },
    setup: function (api) {
      apiRef = api;
      var S = window.StoryStage;
      if (api.people.cust2) api.people.cust2.visible = false;
      if (window.RidgeRoadProps) {
        try { road = RidgeRoadProps.dressRoad(api, { tape: false }); } catch (e) { road = null; }
        try { lab = RidgeRoadProps.dressLab(api, {}); } catch (e) { lab = null; }
      }
      // Tunde: white shirt, khaki trousers, short hair
      var tunde = S.person({ skin: "#6b4226", outfit: "#f4f6f8", pants: "#b59a6a", hair: "short" });
      tunde.position.set(3.1, 0, -0.55); tunde.visible = false; api.props.market.add(tunde);
      api.people.tunde = tunde;
      // narration aliases (props, not people, so nobody is animated twice per frame)
      api.props.dayo = api.people.cust1; api.props.ramatu = api.people.ngozi; api.props.okafor = api.people.amaka;
      if (road) {
        api.people.ngozi.position.fromArray(road.spots.ramatu);
        api.people.cust1.position.fromArray(road.spots.dayo);
      }
    },
    onTick: function (api, dt, t) {
      if (road) road.update(dt, t);
      if (lab) lab.update(dt, t);
      if (follow && road && road.followShot) { var s = road.followShot(4.6, 1.7); api.shot(s[0], s[1]); }
    }
  });
})();
