/* Lesson 05 · 3D story (Set 2, the school physics lab): Mrs Okafor wants the class's own g;
   Tunde measures only to the top of the bob and counts "one!" as he starts the stopwatch. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var X = 40;
  var lab = null, tunde = null, zainab = null, ruler = null;
  // fallback shots (02-lesson.md) are replaced by dressLab's framed shots when ridge-road-props is present
  var SHOT = {
    lab: [[X + 0.0, 2.2, 6.0], [X + 0.0, 1.3, 0]],
    pendulum: [[X - 1.9, 2.0, 2.7], [X - 1.9, 1.15, -2.2]],
    bench: [[X - 1.5, 2.2, 3.4], [X - 1.6, 1.1, -2.0]]
  };
  function shot(k) { return (k === "lab" && lab && lab.shots && lab.shots.lab) || SHOT[k]; }   // close shots are our own so nobody blocks the pendulum

  function place(w) {
    var p = w.people, L = w.props.lab;
    [p.amaka, tunde, zainab].forEach(function (person) { if (person && person.parent !== L) { person.parent.remove(person); L.add(person); } });
    var sp = (lab && lab.spots) || { okafor: [-1.0, 0, -1.3], zainab: [0.35, 0, -1.15], tunde: [1.25, 0, -1.0] };
    p.amaka.position.set(-0.45, 0, -1.2); void sp;
    if (zainab) zainab.position.set(-2.55, 0, -1.5);
    if (tunde) tunde.position.set(-1.25, 0, -1.5);
    var look = new THREE.Vector3(-1.9, 0, -2.35);
    [p.amaka, tunde, zainab].forEach(function (person) { if (person) { person.userData.target = null; person.userData.faceTarget = look; } });
    if (tunde && tunde.hold) tunde.hold(null, "right");
    if (lab && lab.pendulum && lab.pendulum.swing) lab.pendulum.swing(false);
  }

  // the speaker turns towards the class (camera side), the others keep watching the pendulum
  function face(person) { if (person) person.userData.faceTarget = new THREE.Vector3(person.position.x + 0.6, 0, 4); }

  var beats = [
    {
      caption: "The school physics laboratory, Ogbomoso. A pendulum hangs from a split cork.",
      shot: SHOT.lab, instant: true, hold: 6, who: "amaka",
      text: "The lift-off rule needs g. Textbooks say 9.8. Let's measure our own, here in Ogbomoso.",
      run: function (w) { place(w); w.shot.apply(null, shot("lab").concat([true])); face(w.people.amaka); w.people.amaka.set("talk"); if (tunde) tunde.set("idle"); if (zainab) zainab.set("think"); }
    },
    {
      caption: "Tunde lays the metre rule along the thread and stops at the top of the bob.",
      shot: SHOT.pendulum, hold: 5.5, who: "tunde",
      text: "Eighty centimetres. Done.",
      run: function (w) { place(w); w.shot.apply(null, shot("pendulum")); if (tunde) { tunde.set("point"); if (ruler && tunde.hold) tunde.hold(ruler, "right"); } }
    },
    {
      caption: "Zainab points to the middle of the brass bob.",
      shot: SHOT.pendulum, hold: 6, who: "zainab",
      text: "The bob's centre is lower. The pendulum swings from the cork to the centre of the bob.",
      run: function (w) { place(w); w.shot.apply(null, shot("pendulum")); if (zainab) zainab.set("point"); if (tunde) tunde.set("think"); }
    },
    {
      caption: "Tunde lets go, presses the stopwatch and shouts \"one!\". Mrs Okafor stops him.",
      shot: SHOT.bench, hold: 6, who: "tunde",
      text: "One! Two! Three…",
      run: function (w) {
        place(w); w.shot.apply(null, shot("bench"));
        if (lab && lab.pendulum && lab.pendulum.swing) lab.pendulum.swing(true);
        if (tunde) tunde.set("cheer"); w.people.amaka.set("point");
      }
    },
    {
      caption: "Mrs Okafor: do it the examiner's way.",
      shot: SHOT.lab, hold: 6.5, who: "amaka",
      text: "Small slips like these are exactly where WAEC candidates lose marks. Let's do it the examiner's way and see how much each slip costs.",
      run: function (w) { place(w); w.shot.apply(null, shot("lab")); face(w.people.amaka); w.people.amaka.set("talk"); if (zainab) zainab.set("idle"); if (tunde) tunde.set("sad"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { amaka: "Mrs Okafor", okafor: "Mrs Okafor", zainab: "Zainab", tunde: "Tunde", ngozi: "Hajia Ramatu", cust1: "Dayo" },
    setup: function (api) {
      var S = window.StoryStage, P = api.props;
      if (window.RidgeRoadProps) {
        try { lab = RidgeRoadProps.dressLab(api, { l: 0.80 }); } catch (e) { lab = null; }
      }
      if (!lab && P.lSign) {
        // stock lab set (fallback): just retitle it
        var s = S.sign("PHYSICS LABORATORY", "rgba(31,53,80,0.95)", "#fff", 0.42);
        s.position.copy(P.lSign.position); P.lab.remove(P.lSign); P.lab.add(s); P.lSign = s;
      }
      zainab = S.person({ skin: "#6b4430", outfit: "#2f7d4f", wrapper: true, hair: "bun" });
      tunde = S.person({ skin: "#4f3322", outfit: "#f4f6f8", pants: "#9c8a5a", hair: "short" });
      P.lab.add(zainab); P.lab.add(tunde);
      api.people.zainab = zainab; api.people.tunde = tunde;
      P.okafor = api.people.amaka;                // narrator target alias (not a second person, so it is not animated twice)
      ruler = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.006), S.std("#e3c46b", 0.6));
      ruler.position.set(0, -0.2, 0.04);
      api.people.cust1.visible = false; api.people.cust2.visible = false;
    },
    onTick: function (api, dt, t) { if (lab && lab.update) lab.update(dt, t); }
  });
})();
