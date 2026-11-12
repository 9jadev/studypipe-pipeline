/* ==========================================================
   StudyPipe — Lesson 05 StoryStage (`window.StudyScenes.story`)
   The Ikogosi Smart Meter Billing Discrepancy (5 beats)
   Cast: Amina, Tari, Chief Babatunde, Engr. Idris
   Props: MicrogridProps (`fault: "scope"` -> `"normal"`)
   ========================================================== */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var station = null;

  var beats = [
    {
      caption: "Ikogosi Microgrid Station · Village elders gather at the smart meter kiosk.",
      shot: [[0, 2.3, 6.2], [0, 1.1, -0.3]],
      instant: true,
      hold: 5.5,
      who: "babatunde",
      text: "Amina, Tari! Households on the same street used 85 units of power, yet their smart meters deducted different bills!",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("talk");
        if (station && station.setFault) station.setFault("scope");
      }
    },
    {
      caption: "Inside the control room, Amina opens billing.py on the SCADA terminal.",
      shot: [[39.8, 2.1, 2.8], [39.8, 1.2, -2.0]],
      hold: 5.5,
      who: "amina",
      text: "Look at billing.py — the exact same 15-line tariff calculation was copy-pasted 12 different times across the file!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("point");
        if (station && station.setFault) station.setFault("scope");
      }
    },
    {
      caption: "Tari compares two of the copy-pasted tariff blocks side by side.",
      shot: [[40.05, 1.45, -0.45], [40.05, 1.15, -2.15]],
      hold: 5.5,
      who: "tari",
      text: "In one copy, the VAT rate is set to 7.5%, giving ₦7,713.50, but in three other copies an old 5% rate was left untouched!",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("point");
      }
    },
    {
      caption: "Amina spots a variable collision corrupting the station's global revenue.",
      shot: [[0.35, 1.45, 2.1], [0.35, 1.15, 0.05]],
      hold: 5.5,
      who: "amina",
      text: "And worse: a variable named total inside the calculation ran in global scope and overwrote our global total_revenue counter!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
        if (w.people.engr_idris) w.people.engr_idris.set("think");
      }
    },
    {
      caption: "Amina proposes a single modular function with isolated local scope.",
      shot: [[0, 2.3, 6.2], [0, 1.1, -0.3]],
      hold: 6.0,
      who: "amina",
      text: "We need one clean function, calculate_nepa_bill(), with isolated local scope. Update it once, and all 250 meters are fixed!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("wave");
        if (w.people.babatunde) w.people.babatunde.set("talk");
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
        station = MicrogridProps.dressStation(api, { fault: "scope" });
        if (station && station.shots) {
          beats[0].shot = station.shots.courtyardWide;
          beats[1].shot = station.shots.controlWide;
          beats[2].shot = station.shots.terminal;
          beats[3].shot = station.shots.smartMeter;
          beats[4].shot = station.shots.courtyardWide;
        }
      }

      // Cast mapping (05-build-plan.md)
      api.people.amina = api.people.cust2;
      api.people.tari = api.people.cust1;

      var babatunde = StoryStage.person({
        skin: "#4a2e1f",
        outfit: "#d9a441",
        pants: "#1c2433",
        hair: "short"
      });
      babatunde.position.set(1.3, 0, 1.5);
      babatunde.rotation.y = -0.55;
      if (api.props.market) api.props.market.add(babatunde);
      if (api.people.ngozi) api.people.ngozi.visible = false;
      api.people.babatunde = babatunde;

      var idris = StoryStage.person({
        skin: "#3d2618",
        outfit: "#2b6cb0",
        pants: "#1c2433",
        hair: "short"
      });
      idris.position.set(-1.6, 0, 1.1);
      idris.rotation.y = 0.45;
      if (api.props.market) api.props.market.add(idris);
      api.people.engr_idris = idris;

      // Also place lab counterparts near the SCADA terminal (x≈40) so Set 2 shots show characters
      if (api.props.lab) {
        var aminaLab = StoryStage.person({
          skin: "#7a5236",
          pattern: StoryStage.ankara("#7b4dd8", "#3ee6c4", "#fff"),
          wrapper: true,
          hair: "bun"
        });
        aminaLab.position.set(-0.6, 0, -1.25);
        aminaLab.rotation.y = 0.25;
        api.props.lab.add(aminaLab);

        var tariLab = StoryStage.person({
          skin: "#4a2e1f",
          outfit: "#2b6cb0",
          pants: "#1c2433",
          hair: "short"
        });
        tariLab.position.set(0.65, 0, -1.25);
        tariLab.rotation.y = -0.25;
        api.props.lab.add(tariLab);
        if (api.people.amaka) api.people.amaka.position.set(1.55, 0, -1.15);
      }
    },
    onTick: function (api, dt, t) {
      if (station && station.update) station.update(dt, t);
    }
  });
})();
