/* Lesson 03 · 3D story (Set 1, Ridge Road near Ogbomoso): when exactly do the crates leave the carrier?
   Dayo rides past the ridges at a moderate pace (crates rattle but stay down), Zainab and Tunde argue about
   where in the bounce the crates jump, and Mrs Okafor puts the okada on its centre stand and spins the rear
   wheel: the shadow of a lump of red mud slides to and fro exactly like the bounce.
   Props come from the ridge-road-props kit (window.RidgeRoadProps); without it the stock set stays (never throws). */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var road = null, follow = false;
  // fallback cameras (world [camPos, lookAt]) if the props kit is not loaded
  var WIDE = [[0, 2.6, 10.5], [0, 0.9, 0.3]];
  var ROADSIDE = [[3.4, 1.7, 3.6], [2.6, 1.1, -0.7]];
  var STAND = [[1.6, 0.95, 3.2], [-0.45, 0.45, 0.85]];
  var CARRIER = [[0.2, 1.55, 2.75], [-0.65, 0.95, 0.85]];

  function shot(api, key, fallback) {
    var s = road && road.shots && road.shots[key] ? road.shots[key] : fallback;
    api.shot.apply(null, s);
  }
  // beat 4 camera: from the gate (chain) side, framing the rear tyre with its mud lump, the lump's
  // ground shadow (okada-local z = −0.3) and Mrs Okafor at the tail of the bike (custom, phone portrait)
  var SV = { cam: [0.9, 1.4, -5.2], look: [-0.5, 0.5, 0.3], okafor: [-1.5, 0.4] };
  function standShot() {
    if (!road) return STAND;
    var o = road.okada.position;
    return [[o.x + SV.cam[0], SV.cam[1], o.z + SV.cam[2]], [o.x + SV.look[0], SV.look[1], o.z + SV.look[2]]];
  }
  function placeOkafor(api) {
    var o = road ? road.okada.position : { x: 0.1, z: 0.85 };
    place(api.people.okafor, [o.x + SV.okafor[0], o.z + SV.okafor[1]], [o.x - 0.55, o.z]);
  }
  function place(p, xz, face) {
    if (!p) return;
    p.position.set(xz[0], 0, xz[1]);
    p.userData.faceTarget = new THREE.Vector3(face[0], 0, face[1]);
  }
  // put the okada back on the road with Dayo riding (beat 1–3 state)
  function riding(api, kmh) {
    if (!road) return;
    road.okada.setCentreStand(false); road.okada.setMud(false);
    ["mud", "shadow"].forEach(function (k) { var o = road.okada.parts[k]; if (o) o.scale.setScalar(1); });
    if (road.gate) road.gate.visible = true;
    road.setLoad(200); road.setDamper("leaking");
    if (!road.okada.parts.rider && api.people.dayo) road.mount(api.people.dayo);
    road.ride(kmh, { restart: false });
  }
  // park the okada on its centre stand with the mud lump (beat 4–5 state)
  function parked(api) {
    if (!road) return;
    if (road.gate) road.gate.visible = true;
    road.dismount(); road.park();
    road.okada.setMud(true);
    // enlarged for the camera: the real lump is only ~7 cm across, too small to follow at phone size
    ["mud", "shadow"].forEach(function (k) { var o = road.okada.parts[k]; if (o) o.scale.setScalar(4); });
    var mm = road.okada.parts.mud;
    if (mm && mm.material && !mm.userData.l3) {        // a bright, slightly glowing lump so it reads against the dark tyre
      mm.userData.l3 = mm.material; mm.material = mm.material.clone();
      if (mm.material.color) mm.material.color.set("#ff7a1a");
      if (mm.material.emissive) { mm.material.emissive.set("#ff4a00"); mm.material.emissiveIntensity = 0.55; }
    }
    place(api.people.dayo, [1.25, 1.85], [0.1, 0.85]);
  }

  var beats = [
    {
      caption: "Ridge Road, Ogbomoso. Dayo rides past the ridges at a moderate pace.",
      instant: true, hold: 6, who: "dayo",
      text: "Hear how the crates rattle! The carrier is pumping up and down, but today they are staying on.",
      run: function (api) {
        riding(api, 14);
        follow = !!road;
        if (!road) shot(api, "wide", WIDE);
        api.people.dayo.set("talk");
      }
    },
    {
      caption: "Zainab watches from the roadside with her notebook.",
      hold: 6.5, who: "zainab",
      text: "The crates stay on the carrier while it rises. They only jump when it is at the top and starting down.",
      run: function (api) {
        riding(api, 14); follow = false;
        shot(api, "__none", ROADSIDE);
        api.people.zainab.set("point"); api.people.tunde.set("think");
      }
    },
    {
      caption: "Tunde has his own idea.",
      hold: 5.5, who: "tunde",
      text: "They jump because that is where the bike is moving fastest.",
      run: function (api) {
        riding(api, 14); follow = false;
        shot(api, "__none", ROADSIDE);
        api.people.tunde.set("talk"); api.people.zainab.set("think");
      }
    },
    {
      caption: "Okafor: “Watch the shadow, not the mud.”",
      hold: 7, who: null,
      text: "",
      run: function (api) {
        follow = false; parked(api); placeOkafor(api);
        if (road) road.okada.setCentreStand(true, 1.6);
        if (road && road.gate) road.gate.visible = false;   // the gate bars would stand between this camera and the wheel
        api.shot.apply(null, standShot());
        api.people.okafor.set("point"); api.people.dayo.set("idle");
      }
    },
    {
      caption: "Mrs Okafor presses the carrier down and lets go.",
      hold: 7, who: "okafor",
      text: "At the top of the bounce the carrier is barely moving, but it is accelerating downwards harder than anywhere else. If that downward acceleration beats g, the carrier falls away faster than the crate can.",
      run: function (api) {
        follow = false; parked(api);
        if (road) { road.okada.setCentreStand(false); road.press(0.05); }
        shot(api, "carrier", CARRIER);
        api.people.okafor.set("talk"); api.people.tunde.set("think");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ramatu: "Hajia Ramatu", ngozi: "Hajia Ramatu", dayo: "Dayo", cust1: "Dayo", zainab: "Zainab", tunde: "Tunde", okafor: "Mrs Okafor", amaka: "Mrs Okafor" },
    setup: function (api) {
      var P = api.props, people = api.people, S = window.StoryStage;

      // cast: Ramatu = ngozi, Dayo = cust1; Zainab, Tunde and Mrs Okafor are new people in Set 1
      people.ramatu = people.ngozi;
      people.dayo = people.cust1;
      var zainab = S.person({ skin: "#5a3825", outfit: "#2f7d4a", wrapper: true, hair: "bun" });
      var tunde = S.person({ skin: "#4a2e1f", outfit: "#f1efe8", pants: "#b0956a", hair: "short" });
      var okafor = S.person({ skin: "#6e4630", outfit: "#3b5b8a", pants: "#2a2f3a", coat: true, hair: "bun" });
      P.market.add(zainab); P.market.add(tunde); P.market.add(okafor);
      people.zainab = zainab; people.tunde = tunde; people.okafor = okafor;
      if (people.cust2) people.cust2.visible = false;

      if (window.RidgeRoadProps) {
        road = RidgeRoadProps.dressRoad(api, { tape: false, mass: 200, damper: "leaking", crates: 1 });
      } else if (P.mSign) {
        var s = S.sign("RIDGE ROAD · OGBOMOSO", "rgba(156,74,34,0.95)", "#fff", 0.5);
        s.position.copy(P.mSign.position); P.market.remove(P.mSign); P.market.add(s); P.mSign = s;
      }

      var sp = (road && road.spots) || { ramatu: [0, 0, -1.0], dayo: [-1.05, 0, 1.3], zainab: [2.3, 0, -0.85], tunde: [3.1, 0, -0.55], okafor: [1.55, 0, 1.75] };
      place(people.ramatu, [sp.ramatu[0], sp.ramatu[2]], [0, 2]);
      place(people.dayo, [sp.dayo[0], sp.dayo[2]], [0, 0.85]);
      place(zainab, [sp.zainab[0], sp.zainab[2]], [0, 2]);
      place(tunde, [sp.tunde[0], sp.tunde[2]], [0, 2]);
      if (people.ramatu) people.ramatu.visible = false;  // not in this lesson's cast (she would block the stand shot)
      placeOkafor(api);                                   // at the tail of the bike, gate side, by the rear wheel
    },
    onTick: function (api, dt, t) {
      if (road && road.update) road.update(dt, t);
      if (road && follow) api.shot.apply(null, road.followShot(4.2, 1.6));
    }
  });
})();
