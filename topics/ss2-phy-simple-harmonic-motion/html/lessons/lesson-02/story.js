/* Lesson 02 · 3D story: two extra crates on the okada (Set 1, Ridge Road) → Mrs Okafor's loaded spring (Set 2, lab).
   Cast (05-build-plan.md): dayo = cust1, okafor = amaka, zainab + tunde = new StoryStage people.
   Props come from RidgeRoadProps (dressRoad / dressLab); without it the stock sets stay and nothing throws. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var road = null, lab = null, zainab = null, tunde = null;
  var loadTimer = null;
  var WIDE1 = [[3.5, 1.8, 5.5], [0, 0.7, 0]];
  var WIDE2 = [[40.3, 2.2, 6.0], [40.3, 1.2, -1.2]];

  function shotOf(set, name, fallback) { return set && set.shots && set.shots[name] ? set.shots[name] : fallback; }
  function place(p, parent, spot, fx, fz) {
    if (!p || !parent) return;
    parent.add(p);
    if (spot) p.position.set(spot[0], 0, spot[2]);
    p.userData.target = null; p.userData.state = "idle";
    if (fx != null) p.userData.faceTarget = new THREE.Vector3(fx, 0, fz);
  }
  function toRoad(w) {
    var M = w.props.market, S = road ? road.spots : null;
    place(zainab, M, S ? S.zainab : [1.6, 0, 1.2], 0, 0.9);
    place(tunde, M, S ? S.tunde : [2.4, 0, 1.0], 0, 0.9);
  }
  function toLab(w) {
    var L = w.props.lab, S = lab ? lab.spots : null;
    place(zainab, L, S ? S.zainab : [0.35, 0, -1.15], -0.75, -2.35);
    place(tunde, L, S ? S.tunde : [1.25, 0, -1.0], -0.75, -2.35);
  }
  // framing around the parked okada (the props' "carrier" close-up is too tight on a portrait phone)
  function okShot(far) {
    var o = road && road.okada ? road.okada.position : { x: 0.1, z: 0.85 };
    return far ? [[o.x + 3.4, 1.9, o.z + 4.4], [o.x + 0.6, 0.85, o.z - 0.4]] : [[o.x + 2.2, 1.6, o.z + 3.6], [o.x - 0.35, 0.75, o.z]];
  }
  function stopLoading() { if (loadTimer) { clearInterval(loadTimer); loadTimer = null; } }

  var beats = [
    {
      caption: "Ridge Road, Ogbomoso. Dayo straps two extra crates of eggs onto the okada's carrier.",
      shot: WIDE1, instant: true, hold: 6,
      who: "dayo",
      text: "Hajia wants more eggs today. Heavier load, steadier ride — that's what my oga used to say.",
      run: function (w) {
        stopLoading(); toRoad(w);
        if (road) { road.park(); road.setLoad(250); w.shot.apply(null, okShot(false)); }
        w.people.dayo.set("talk");
      }
    },
    {
      caption: "Tunde nods. He is sure a heavy okada cannot bounce.",
      shot: WIDE1, hold: 5,
      who: "tunde",
      text: "Exactly. Heavy things don't bounce.",
      run: function (w) {
        toRoad(w);
        if (road) w.shot.apply(null, okShot(true));
        if (tunde) tunde.set("point");
      }
    },
    {
      caption: "Zainab presses the loaded carrier down, lets go and times it. The bounce looks lazier.",
      shot: WIDE1, hold: 6,
      who: "zainab",
      text: "It's still bouncing — just slower.",
      run: function (w) {
        toRoad(w);
        if (road) { w.shot.apply(null, okShot(false)); road.press(0.04); }
        if (zainab) zainab.set("think");
      }
    },
    {
      caption: "School physics lab. Mrs Okafor hangs 50 g slotted masses on a spiral spring, one at a time.",
      shot: WIDE2, instant: true, hold: 7,
      who: "okafor",
      text: "Every extra 50 grams pulls it down by the same amount. That even pull-back is the secret.",
      run: function (w) {
        toLab(w);
        if (lab) {
          w.shot.apply(null, shotOf(lab, "spring", WIDE2));
          var n = 1; lab.spring.bounce(false); lab.spring.setLoad(n);
          stopLoading();
          loadTimer = setInterval(function () { n++; lab.spring.setLoad(n); if (n >= 5) stopLoading(); }, 1100);
        }
        w.people.okafor.set("point");
      }
    },
    {
      caption: "She pulls the hanger down and lets go. The spring pulls it back towards the middle, again and again.",
      shot: WIDE2, hold: 7,
      who: "okafor",
      text: "The further you pull, the harder the spring pulls back — always towards the middle. That is what makes the motion simple harmonic.",
      run: function (w) {
        toLab(w); stopLoading();
        if (lab) { w.shot.apply(null, shotOf(lab, "spring", WIDE2)); lab.spring.setLoad(4); lab.spring.bounce(true, 0.03); }
        w.people.okafor.set("talk");
        if (zainab) zainab.set("think");
      }
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    names: {
      ramatu: "Hajia Ramatu", ngozi: "Hajia Ramatu", dayo: "Dayo", cust1: "Dayo",
      zainab: "Zainab", tunde: "Tunde", sule: "Mallam Sule", okafor: "Mrs Okafor", amaka: "Mrs Okafor"
    },
    setup: function (api) {
      api.people.ramatu = api.people.ngozi;
      api.people.dayo = api.people.cust1;
      api.people.okafor = api.people.amaka;
      if (api.people.cust2) api.people.cust2.visible = false;

      zainab = StoryStage.person({ skin: "#6b4430", outfit: "#2f7d4a", wrapper: true, hair: "bun" });
      tunde = StoryStage.person({ skin: "#7a4a2e", outfit: "#f2f2ee", pants: "#a08a5c", hair: "short" });
      api.props.market.add(zainab); api.props.market.add(tunde);
      api.people.zainab = zainab; api.people.tunde = tunde;

      if (window.RidgeRoadProps) {
        try {
          road = RidgeRoadProps.dressRoad(api, { tape: false });
          lab = RidgeRoadProps.dressLab(api, {});
          var ox = road.okada.position; api.people.dayo.position.set(ox.x - 1.35, 0, ox.z - 0.75);
          api.people.ramatu.position.fromArray(road.spots.ramatu);
          var ok = api.people.okafor, s = lab.spots.okafor; ok.position.set(s[0], 0, s[2]);
        } catch (e) { road = null; lab = null; }
      }
      toRoad(api);
    },
    onTick: function (api, dt, t) {
      if (road && road.update) road.update(dt, t);
      if (lab && lab.update) lab.update(dt, t);
    }
  });
})();
