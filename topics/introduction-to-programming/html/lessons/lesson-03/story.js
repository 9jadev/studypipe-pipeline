/* ==========================================================
   StudyPipe — Lesson 03 StoryStage (Set 1 & Set 2 · Ikogosi Microgrid)
   The Ikogosi Runaway Loop (`while solar_output > 0:`)
   Cast: Amina, Tari, Chief Babatunde
   Props from shared MicrogridProps kit (`fault: "loop"`).
   ========================================================== */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var station = null;

  var beats = [
    {
      caption: "Ikogosi Microgrid Control Room. The terminal cooling fans scream at 4200 RPM.",
      shot: [[39.8, 2.1, 2.8], [39.8, 1.2, -2.0]], instant: true, hold: 5.5,
      who: "amina",
      text: "Listen to the SCADA terminal fans spinning at maximum speed! System CPU and memory usage just hit 99%!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("point");
        if (station && station.setFault) station.setFault("loop");
      }
    },
    {
      caption: "Tari inspects the scrolling log console on the maintenance monitor.",
      shot: [[40.05, 1.45, -0.45], [40.05, 1.15, -2.15]], hold: 5.5,
      who: "tari",
      text: "Look at the log console! It is scrolling millions of identical messages: 'Checking solar array 1... Checking solar array 1...'.",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("point");
      }
    },
    {
      caption: "Amina opens solar_monitor.py at line 22 on the rugged terminal.",
      shot: [[39.5, 1.55, 0.6], [39.9, 1.15, -2.0]], hold: 5.5,
      who: "amina",
      text: "Here is the culprit in solar_monitor.py line 22: while solar_output > 0: print('Active').",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
        if (w.people.tari) w.people.tari.set("think");
      }
    },
    {
      caption: "Tari spots why the condition never turns False.",
      shot: [[40.2, 1.55, 0.8], [39.8, 1.15, -1.8]], hold: 5.5,
      who: "tari",
      text: "The variable solar_output never changes inside the loop! In daytime sun it stays positive forever — it is stuck in an infinite cycle!",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("talk");
      }
    },
    {
      caption: "Chief Babatunde asks how to guarantee clean termination across all solar logs.",
      shot: [[38.8, 1.85, 2.2], [39.4, 1.15, -1.4]], hold: 5.8,
      who: "babatunde",
      text: "How do we make the computer check each solar panel or daily reading once, accumulate the total kWh, and stop cleanly?",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("talk");
        if (w.people.amina) w.people.amina.set("Wave");
        if (station && station.setFault) station.setFault("normal");
      }
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    names: {
      amina: "Amina", cust2: "Amina",
      tari: "Tari", cust1: "Tari",
      babatunde: "Chief Babatunde", ngozi: "Chief Babatunde"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("IKOGOSI SMART SOLAR MICROGRID · EKITI", "rgba(16,185,129,0.95)", "#fff", 0.5);
      if (api.props.mSign) {
        mSign.position.copy(api.props.mSign.position);
        api.props.market.remove(api.props.mSign);
      } else {
        mSign.position.set(0, 3.6, -1.6);
      }
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("COMPUTER STUDIES & TELEMETRY LAB", "rgba(16,185,129,0.95)", "#fff", 0.46);
      if (api.props.lSign && api.props.lab) {
        lSign.position.copy(api.props.lSign.position);
        api.props.lab.remove(api.props.lSign);
        api.props.lab.add(lSign);
        api.props.lSign = lSign;
      }

      if (window.MicrogridProps) {
        station = MicrogridProps.dressStation(api, { fault: "loop" });
      }

      // Cast mapping for Set 2 (Telemetry Lab at x_offset = 40)
      var labGroup = api.props.lab || api.props.market;
      var amina = StoryStage.person({ skin: "#5a3825", outfit: "#0d9c7e", pants: "#1c2433", hair: "bun" });
      var tari = StoryStage.person({ skin: "#4a2e1f", outfit: "#2563eb", pants: "#1c2433", hair: "short" });
      var babatunde = StoryStage.person({ skin: "#4a2e1f", outfit: "#d97706", pants: "#1c2433", cap: "#8c2d19" });

      var sp = station && station.spots;
      amina.position.set(sp ? sp.amina[0] : -0.6, 0, sp ? sp.amina[2] : -1.25);
      amina.rotation.y = 0.25;
      tari.position.set(sp ? sp.tari[0] : 0.65, 0, sp ? sp.tari[2] : -1.25);
      tari.rotation.y = -0.35;
      babatunde.position.set(sp ? sp.babatunde[0] : -1.85, 0, sp ? sp.babatunde[2] : -1.1);
      babatunde.rotation.y = 0.45;

      labGroup.add(amina);
      labGroup.add(tari);
      labGroup.add(babatunde);

      api.people.amina = amina;
      api.people.tari = tari;
      api.people.babatunde = babatunde;

      if (api.people.amaka) api.people.amaka.visible = false;
    },
    onTick: function (api, dt, t) {
      if (station && station.update) station.update(dt, t);
    }
  });
})();
