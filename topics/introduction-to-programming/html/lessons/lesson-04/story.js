/* Lesson 04 · 3D story beats (Set 2 · Ikogosi Clinic Cold-Chain & SCADA Telemetry Lab).
   Cast: Dr. Folake (clinic doctor), Amina (SS1 lead debugger), Tari (SS1 classmate), Chief Babatunde.
   Props come from the shared microgrid-props kit (window.MicrogridProps) when present. */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var station = null;

  var beats = [
    {
      caption: "Ikogosi Health Clinic Cold-Chain & SCADA Lab. An alarm flashes on the vaccine fridge.",
      shot: [[41.4, 1.75, 1.9], [41.7, 1.1, -1.7]],
      instant: true,
      hold: 5.5,
      who: "folake",
      text: "Amina, Tari! An alarm is sounding at the clinic — the vaccine refrigerator cooling sensor is offline and the cabinet is warming to +9.8 °C!",
      run: function (w) {
        if (w.people.folake) w.people.folake.set("wave");
        if (station && station.setFault) station.setFault("indexerror");
      }
    },
    {
      caption: "Amina checks the clinic telemetry dashboard on the SCADA terminal.",
      shot: [[39.9, 1.65, 1.4], [39.9, 1.15, -1.9]],
      hold: 5.5,
      who: "amina",
      text: "Look at the telemetry log on line 34: 'Fatal Error: IndexError: list index out of range'. The battery scanner crashed mid-cycle!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("point");
        if (w.people.folake) w.people.folake.set("idle");
      }
    },
    {
      caption: "Tari inspects battery_check.py beside the 8-cell lithium rack.",
      shot: [[39.3, 1.65, 1.6], [39.2, 1.1, -1.8]],
      hold: 5.5,
      who: "tari",
      text: "Here is line 34 in battery_check.py: 'for i in range(1, 9): check_cell(battery_cells[i])'. Whoever wrote it counted cells from 1 to 8!",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("talk");
        if (w.people.amina) w.people.amina.set("think");
      }
    },
    {
      caption: "Amina points to the 8-slot lithium battery rack (Index 0 to Index 7).",
      shot: [[38.8, 1.6, 1.5], [38.75, 1.05, -2.0]],
      hold: 5.5,
      who: "amina",
      text: "There are 8 battery cells in the rack! In zero-based indexing, their valid indices are 0 to 7. When i reaches 8, the program crashes!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
        if (w.people.tari) w.people.tari.set("idle");
      }
    },
    {
      caption: "Chief Babatunde looks from Cell 0 to the red Out-of-Bounds marker at Index 8.",
      shot: [[39.8, 2.0, 2.7], [39.8, 1.15, -1.9]],
      hold: 5.5,
      who: "babatunde",
      text: "So the first battery at index 0 was skipped, and asking for index 8 crashed the whole clinic cooling unit! Let us test the array rack on the bench.",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("point");
        if (w.people.amina) w.people.amina.set("idle");
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
      if (window.MicrogridProps) {
        station = MicrogridProps.dressStation(api, { fault: "indexerror" });
      }

      var lab = api.props.lab;
      var sp = (station && station.spots) || {
        amina: [-0.6, 0, -1.25],
        tari: [0.65, 0, -1.25],
        babatunde: [-1.85, 0, -1.1],
        folake: [1.55, 0, -1.15]
      };

      // Alias and position characters inside Set 2 (lab)
      api.people.folake = api.people.amaka;
      api.people.amina = api.people.cust2;
      api.people.tari = api.people.cust1;

      var babatunde = StoryStage.person({
        skin: "#4a2e1f",
        outfit: "#d9a441",
        pants: "#1c2433",
        cap: "#8c2d19"
      });
      api.people.babatunde = babatunde;

      if (lab) {
        if (api.people.amina) {
          lab.add(api.people.amina);
          api.people.amina.position.set(sp.amina[0], 0, sp.amina[2]);
          api.people.amina.rotation.y = 0.15;
          api.people.amina.userData.faceTarget = null;
        }
        if (api.people.tari) {
          lab.add(api.people.tari);
          api.people.tari.position.set(sp.tari[0], 0, sp.tari[2]);
          api.people.tari.rotation.y = -0.15;
          api.people.tari.userData.faceTarget = null;
        }
        if (api.people.folake) {
          lab.add(api.people.folake);
          api.people.folake.position.set(sp.folake[0], 0, sp.folake[2]);
          api.people.folake.rotation.y = -0.35;
        }
        lab.add(babatunde);
        babatunde.position.set(sp.babatunde[0], 0, sp.babatunde[2]);
        babatunde.rotation.y = 0.35;
      }
    },
    onTick: function (api, dt, t) {
      if (station && station.update) station.update(dt, t);
    }
  });
})();
