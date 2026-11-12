/* Lesson 06 · 3D story: Mallam Sule's roadside shed (Set 1) → the school physics lab (Set 2).
   Sule unbolts the weeping rear shock, pushes the new and old dampers side by side, Zainab wonders
   where the energy goes, and Mrs Okafor sets up the energy-bar lesson. Uses RidgeRoadProps when present;
   without it the stock StoryStage sets are used (never throws). */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var road = null, lab = null;
  var SHED = [[-4.6, 1.95, 4.4], [-5.6, 1.3, -0.9]];
  var SHOCK = [[-6.2, 1.5, 0.45], [-6.45, 0.95, -1.75]];
  var LAB = [[39.1, 1.75, 1.6], [39.0, 1.2, -2.3]];

  function face(p, x, z) { if (p) p.userData.faceTarget = new THREE.Vector3(x, 0, z); }
  function moveTo(p, group, x, z) {
    if (!p) return;
    if (group && p.parent !== group) { if (p.parent) p.parent.remove(p); group.add(p); }
    p.position.set(x, 0, z);
  }

  // where everyone stands for Set 1 (shed) or Set 2 (lab)
  function place(api, set) {
    var P = api.props, pp = api.people;
    if (set === 1) {
      moveTo(pp.sule, P.market, -6.6, -0.2); face(pp.sule, -4.6, 0.8);
      moveTo(pp.dayo, P.market, -4.7, 0.7); face(pp.dayo, -6.4, -0.6);
      moveTo(pp.zainab, P.market, -4.0, 0.15); face(pp.zainab, -6.4, -0.6);
      if (pp.zainab) pp.zainab.visible = true;
    } else {
      var sp = lab ? lab.spots : { okafor: [-1.0, 0, -1.3], zainab: [0.35, 0, -1.15] };
      moveTo(pp.okafor, P.lab, sp.okafor[0], sp.okafor[2]); face(pp.okafor, 40.6, 1.5);
      moveTo(pp.zainab, P.lab, sp.zainab[0], sp.zainab[2] + 0.4); face(pp.zainab, 39.0, -2.3);
    }
    if (pp.ramatu) pp.ramatu.visible = false;
    if (pp.cust2) pp.cust2.visible = false;
  }

  var beats = [
    {
      caption: "Mallam Sule's shed on Ridge Road. The rear shock absorber is off the okada.",
      shot: road ? null : SHOCK, instant: true, hold: 6.5, who: "sule",
      text: "See this? It is weeping. The oil inside is what kills the bounce.",
      run: function (w) {
        place(w, 1);
        if (road) w.shot.apply(null, road.shots.shock || SHOCK);
        w.people.sule.set("point"); w.people.dayo.set("idle"); w.people.zainab.set("idle");
        if (road && road.shed && road.shed.pushDampers) road.shed.pushDampers(false);
      }
    },
    {
      caption: "Dayo is not convinced.",
      shot: SHED, hold: 5, who: "dayo",
      text: "Kills the bounce? The spring is still strong.",
      run: function (w) { place(w, 1); w.people.dayo.set("talk"); w.people.sule.set("think"); }
    },
    {
      caption: "Sule pushes the new and the old damper side by side.",
      shot: SHOCK, hold: 8, who: "sule",
      text: "A spring stores the energy and gives it back. The oil turns it to heat. Without oil, nothing takes the energy away.",
      run: function (w) {
        place(w, 1);
        if (road) w.shot.apply(null, road.shots.shock || SHOCK);
        w.people.sule.set("talk");
        if (road && road.shed && road.shed.pushDampers) road.shed.pushDampers(true);
      }
    },
    {
      caption: "Zainab thinks about the bike on the ridges.",
      shot: SHED, hold: 6, who: "zainab",
      text: "So every time the bike bounces, the energy just keeps going round and round?",
      run: function (w) { place(w, 1); w.people.zainab.set("think"); w.people.sule.set("idle"); w.people.dayo.set("idle"); }
    },
    {
      caption: "The physics lab. Mrs Okafor releases a pendulum and a bouncing spring.",
      shot: LAB, hold: 7, who: "okafor",
      text: "Let's watch where the energy is at every point, and what happens when we make it work through water.",
      run: function (w) {
        place(w, 2);
        if (lab) {
          w.shot.apply(null, lab.shots.bench || LAB);
          if (lab.pendulum && lab.pendulum.swing) lab.pendulum.swing(true);
          if (lab.spring && lab.spring.bounce) lab.spring.bounce(true);
        }
        w.people.okafor.set("point"); w.people.zainab.set("idle");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { sule: "Mallam Sule", dayo: "Dayo", cust1: "Dayo", zainab: "Zainab", okafor: "Mrs Okafor", amaka: "Mrs Okafor", ramatu: "Hajia Ramatu", ngozi: "Hajia Ramatu" },
    setup: function (api) {
      var S = window.StoryStage, P = api.props, pp = api.people;
      // cast aliases from the stock people
      pp.dayo = pp.cust1; pp.okafor = pp.amaka; pp.ramatu = pp.ngozi;
      // new people (added before the sets are dressed so they are never hidden)
      pp.sule = S.person({ skin: "#4a2e1f", outfit: "#e9e1cf", pants: "#d8cfb8", cap: true });
      P.market.add(pp.sule);
      pp.zainab = S.person({ skin: "#6e4630", outfit: "#2f7d4f", wrapper: true, hair: "bun" });
      P.market.add(pp.zainab);
      if (window.RidgeRoadProps) {
        try {
          road = RidgeRoadProps.dressRoad(api, { tape: false });
          lab = RidgeRoadProps.dressLab(api, {});
        } catch (e) { road = road || null; lab = lab || null; }
      }
      place(api, 1);
    },
    onTick: function (api, dt, t) { if (road) road.update(dt, t); if (lab) lab.update(dt, t); }
  });
})();
