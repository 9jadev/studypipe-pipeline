/* Lesson 04 · 3D story (Set 2, the school physics lab). Tunde holds a brass and a wooden bob and is sure
   the heavy one swings slowly; Zainab thinks a wider swing must take longer; Mrs Okafor asks for fair
   tests and shows a 6.2 cm pendulum that keeps the okada's 0.50 s bounce; two equal pendulums,
   brass and wood, swing in step. Uses RidgeRoadProps.dressLab when present; never throws without it. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var X = 40;                       // the lab set sits at world x = 40
  var lab = null, extra = null, swingT = 0;

  // beat shots (world coordinates); the bench top is at y ≈ 0.99, two test pendulums at lab x ≈ 0.75–1.1
  var WIDE = [[X + 0.4, 2.0, 4.2], [X + 0.3, 1.2, -1.6]];
  var TUNDE = [[X + 0.9, 1.75, 2.9], [X + 1.4, 1.3, -1.0]];
  var ZAINAB = [[X + 0.5, 1.6, 1.5], [X + 0.4, 1.35, -1.2]];
  var PAIR = [[X + 0.95, 1.5, -0.7], [X + 0.95, 1.3, -2.3]];
  var SHORT = [[X - 1.7, 1.55, -0.1], [X - 1.25, 1.2, -2.2]];

  function bobMesh(colour) {
    var pts = [[0.0004, -0.02], [0.012, -0.0175], [0.019, -0.008], [0.02, 0], [0.019, 0.008], [0.012, 0.0175], [0.003, 0.02], [0.003, 0.026], [0.0004, 0.026]]
      .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var m = new THREE.Mesh(new THREE.LatheGeometry(pts, 20), new THREE.MeshStandardMaterial({ color: colour, roughness: 0.45, metalness: colour === 0xc9a227 ? 0.8 : 0.05 }));
    m.scale.setScalar(3);           // visible in a hand at story scale
    return m;
  }

  function place(api) {
    var p = api.people, L = api.props.lab;
    var spots = lab ? lab.spots : { okafor: [-1.0, 0, -1.3], zainab: [0.35, 0, -1.15], tunde: [1.25, 0, -1.0] };
    if (p.okafor) { p.okafor.position.set(spots.okafor[0], 0, spots.okafor[2]); p.okafor.rotation.y = 0.35; }
    if (p.zainab) { if (p.zainab.parent !== L) L.add(p.zainab); p.zainab.position.set(spots.zainab[0], 0, spots.zainab[2]); p.zainab.rotation.y = -0.1; }
    if (p.tunde) { if (p.tunde.parent !== L) L.add(p.tunde); p.tunde.position.set(spots.tunde[0] + 0.35, 0, spots.tunde[2] + 0.2); p.tunde.rotation.y = -0.35; }
  }

  var beats = [
    {
      caption: "School physics lab. Tunde holds up two bobs, brass and wood.",
      shot: TUNDE, instant: true, hold: 6, who: "tunde",
      text: "This heavy one will swing slowly, steady like a loaded lorry. I'm sure.",
      run: function (w) { place(w); if (w.people.tunde) w.people.tunde.set("talk"); if (w.people.zainab) w.people.zainab.set("think"); }
    },
    {
      caption: "Zainab pulls the lab pendulum far back.",
      shot: ZAINAB, hold: 6, who: "zainab",
      text: "And if I pull it back further, it must take longer — it has further to go.",
      run: function (w) { place(w); if (w.people.zainab) w.people.zainab.set("point"); if (lab && lab.pendulum) lab.pendulum.swing(true); }
    },
    {
      caption: "Mrs Okafor sets the rule for the afternoon.",
      shot: WIDE, hold: 6, who: "okafor",
      text: "Two claims, two fair tests. Change one thing at a time and time 20 swings.",
      run: function (w) { place(w); if (w.people.okafor) w.people.okafor.set("talk"); if (w.people.tunde) w.people.tunde.set("idle"); }
    },
    {
      caption: "She points at a pendulum about the length of a finger.",
      shot: SHORT, hold: 7, who: "okafor",
      text: "And here's a puzzle for later. This little pendulum keeps exactly the okada's time. Why that length?",
      run: function (w) { place(w); if (w.people.okafor) w.people.okafor.set("point"); if (extra) extra.short.swing(true); }
    },
    {
      caption: "Zainab hangs two equal pendulums, brass and wood, and lets them go together.",
      shot: PAIR, hold: 7, who: "zainab",
      text: "Tunde… they're together.",
      run: function (w) {
        place(w);
        if (extra) { extra.brass.swing(true); extra.wood.swing(true); }
        if (w.people.zainab) w.people.zainab.set("cheer"); if (w.people.tunde) w.people.tunde.set("think");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { tunde: "Tunde", zainab: "Zainab", okafor: "Mrs Okafor", amaka: "Mrs Okafor", ramatu: "Hajia Ramatu", ngozi: "Hajia Ramatu", dayo: "Dayo", cust1: "Dayo" },
    setup: function (api) {
      var S = window.StoryStage, P = api.props;
      api.people.okafor = api.people.amaka;
      if (api.people.cust2) api.people.cust2.visible = false;

      if (window.RidgeRoadProps) {
        lab = RidgeRoadProps.dressLab(api, {});
        // two equal 0.50 m pendulums (brass, wood) and the 6.2 cm "okada" pendulum on the bench
        var TY = 0.99;
        var brass = RidgeRoadProps.createPendulumStand({ l: 0.50, angle: 0.17 });
        var wood = RidgeRoadProps.createPendulumStand({ l: 0.50, angle: 0.17 });
        var short = RidgeRoadProps.createPendulumStand({ l: 0.062, angle: 0.17 });
        [brass, wood, short].forEach(function (s) { s.rotation.y = Math.PI / 2; });   // swing across the camera, not towards it
        brass.position.set(0.75, TY, -2.3); wood.position.set(1.15, TY, -2.3); short.position.set(-1.32, TY, -2.3);
        if (wood.parts && wood.parts.bob) { wood.parts.bob.material = wood.parts.bob.material.clone(); wood.parts.bob.material.color.setHex(0x9a6a3a); wood.parts.bob.material.metalness = 0.05; wood.parts.bob.material.roughness = 0.7; }
        (lab.set || P.lab).add(brass); (lab.set || P.lab).add(wood); (lab.set || P.lab).add(short);
        extra = { brass: brass, wood: wood, short: short };
        P.brassPendulum = brass; P.woodPendulum = wood; P.shortPendulum = short;
      } else {
        // fallback without the props kit: keep the stock lab and retitle the sign
        if (P.lSign) { var s = S.sign("PHYSICS LABORATORY", "rgba(31,53,80,0.95)", "#fff", 0.42); s.position.copy(P.lSign.position); P.lab.remove(P.lSign); P.lab.add(s); P.lSign = s; }
      }

      // Zainab (school uniform, notebook) and Tunde (white shirt, khaki) join the lab set
      var zainab = S.person({ skin: "#6b4026", outfit: "#2f7d4a", wrapper: true, hair: "bun", pants: "#2f7d4a" });
      var tunde = S.person({ skin: "#4a2c18", outfit: "#f2f2ee", pants: "#b59a6a", hair: "short" });
      P.lab.add(zainab); P.lab.add(tunde);
      api.people.zainab = zainab; api.people.tunde = tunde;
      tunde.hold(bobMesh(0xc9a227), "right");
      var woodBob = bobMesh(0x9a6a3a); var hand = tunde.userData.armL && tunde.userData.armL.userData.hand;
      if (hand) { woodBob.position.set(0, -0.12, 0.06); hand.add(woodBob); }
      P.zainab = zainab; P.tunde = tunde; P.okafor = api.people.okafor;
      place(api);
    },
    onTick: function (api, dt, t) {
      if (lab && lab.update) lab.update(dt, t);
      if (extra) { var d = Math.min(dt || 0, 0.05); extra.brass.update(d, t); extra.wood.update(d, t); extra.short.update(d, t); }
      swingT += dt || 0;
    }
  });
})();
