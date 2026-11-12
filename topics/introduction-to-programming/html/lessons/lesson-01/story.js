/* ==========================================================
   Lesson 01 · 3D Story Beats (Ikogosi Smart Solar Microgrid Control Room)
   Cast: Amina (SS1 lead student debugger), Tari (SS1 classmate), Chief Babatunde.
   Props: MicrogridProps.dressStation(api, { fault: "typeerror" }).
   ========================================================== */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var station = null;

  var beats = [
    {
      caption: "Ikogosi Smart Solar Microgrid Control Room, Ekiti State. Rain drums on the roof.",
      shot: [[39.8, 2.1, 2.8], [39.8, 1.2, -2.0]], instant: true, hold: 5.5,
      who: "amina",
      text: "Thunder just rolled over the warm springs, Tari! Let's boot the SCADA maintenance terminal and check the solar array telemetry.",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
        if (station && station.setFault) station.setFault("typeerror");
      }
    },
    {
      caption: "Amina plugs the serial cable into the controller; the SCADA screen flashes a red TypeError.",
      shot: [[40.0, 1.65, 1.3], [40.0, 1.15, -1.9]], hold: 5.5,
      who: "amina",
      text: "Look at the status monitor! The controller tripped with SYSTEM ERROR: TypeError — can only concatenate str to str!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("point");
        if (w.people.tari) w.people.tari.set("think");
        if (station && station.setFault) station.setFault("typeerror");
      }
    },
    {
      caption: "Tari leans closer to read line 12 on the maintenance terminal.",
      shot: [[40.2, 1.6, 1.1], [40.05, 1.15, -2.0]], hold: 5.5,
      who: "tari",
      text: "Wait — line 12 says total_power = \"150\" + 20. How can a modern processor with millions of transistors fail to add 150 and 20?",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("talk");
        if (w.people.amina) w.people.amina.set("think");
      }
    },
    {
      caption: "Amina points at the quotation marks around \"150\" on the terminal.",
      shot: [[39.7, 1.65, 1.3], [39.9, 1.15, -1.9]], hold: 5.5,
      who: "amina",
      text: "Look at the quotes around \"150\"! To the interpreter, quotes mean text characters, not a number. It refuses to add an integer to a string!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("point");
      }
    },
    {
      caption: "Chief Babatunde hurries in by the inverter cabinet holding a multimeter.",
      shot: [[38.8, 1.85, 2.3], [39.1, 1.15, -1.8]], hold: 6.0,
      who: "babatunde",
      text: "Amina! Tari! Has lightning burned out our solar inverter? Do we need to shut down the clinic line?",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("talk");
        if (w.people.amina) w.people.amina.set("wave");
        if (station && station.setFault) station.setFault("normal");
      }
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    names: {
      amina: "Amina",
      cust2: "Amina",
      tari: "Tari",
      cust1: "Tari",
      babatunde: "Chief Babatunde",
      ngozi: "Chief Babatunde",
      folake: "Dr. Folake",
      amaka: "Dr. Folake",
      engr_idris: "Engr. Idris"
    },
    setup: function (api) {
      if (window.MicrogridProps && MicrogridProps.dressStation) {
        station = MicrogridProps.dressStation(api, { fault: "typeerror" });
      }

      var lab = api.props.lab;
      var market = api.props.market;

      // Hide unused default characters
      if (api.people.amaka) api.people.amaka.visible = false;
      if (api.people.ngozi) api.people.ngozi.visible = false;

      // Alias Amina (cust2) and Tari (cust1) and place them in the SCADA control room (lab)
      var amina = api.people.cust2;
      var tari = api.people.cust1;
      var babatunde = StoryStage.person({
        skin: "#4a2e1f",
        outfit: "#d9a441",
        pants: "#1c2433",
        cap: "#8c2d19"
      });

      var sp = (station && station.spots) || {
        amina: [-0.6, 0, -1.25],
        tari: [0.65, 0, -1.25],
        babatunde: [-1.85, 0, -1.1]
      };

      if (lab) {
        if (amina) {
          if (amina.parent) amina.parent.remove(amina);
          amina.position.set(sp.amina[0], 0, sp.amina[2]);
          amina.userData.faceTarget = null;
          amina.rotation.y = 0.15;
          lab.add(amina);
        }
        if (tari) {
          if (tari.parent) tari.parent.remove(tari);
          tari.position.set(sp.tari[0], 0, sp.tari[2]);
          tari.userData.faceTarget = null;
          tari.rotation.y = -0.2;
          lab.add(tari);
        }
        babatunde.position.set(sp.babatunde[0], 0, sp.babatunde[2]);
        babatunde.rotation.y = 0.35;
        lab.add(babatunde);
      } else if (market) {
        babatunde.position.set(1.3, 0, 1.5);
        market.add(babatunde);
      }

      api.people.amina = amina;
      api.people.tari = tari;
      api.people.babatunde = babatunde;
    },
    onTick: function (api, dt, t) {
      if (station && station.update) station.update(dt, t);
    }
  });
})();
