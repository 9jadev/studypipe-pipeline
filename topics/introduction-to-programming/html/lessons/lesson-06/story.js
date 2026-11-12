/* ==========================================================
   StudyPipe — Lesson 06 StoryStage (window.StudyScenes.story)
   The Ikogosi Smart Grid Restoration: decoding 0x7E -> 01111110_2 = 126_10
   ========================================================== */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var station = null;

  var beats = [
    {
      caption: "Ikogosi Microgrid Station, Ekiti · The rain subsides and the SCADA console prompts for reboot.",
      shot: [[0, 2.3, 6.2], [0, 1.1, -0.3]], instant: true, hold: 5.5,
      who: "tari",
      text: "The rainstorm has cleared over Ikogosi! Look at the central console: SYSTEM STATUS: READY FOR REBOOT.",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("point");
        if (station && station.setPower) station.setPower(false);
      }
    },
    {
      caption: "Amina & Tari inspect the five patched modules on the SCADA terminal.",
      shot: [[40.05, 1.45, -0.45], [40.05, 1.15, -2.15]], hold: 5.5,
      who: "amina",
      text: "Every module is patched: int('150') + 20 fixed, boolean gate corrected, loops bounded, arrays indexed 0 to 7, and billing modularized!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
      }
    },
    {
      caption: "Chief Babatunde & Engr. Idris check the central inverter parity lock.",
      shot: [[37.6, 1.45, 0.2], [37.45, 1.0, -2.1]], hold: 5.5,
      who: "babatunde",
      text: "To unlock the central inverter switch, the hardware asks us to decode hex status 0x7E into an 8-bit binary register.",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("talk");
      }
    },
    {
      caption: "Tari works out the 4-bit nibble conversion for 0x7E.",
      shot: [[39.8, 2.1, 2.8], [39.8, 1.2, -2.0]], hold: 5.5,
      who: "tari",
      text: "Hex 7 is 0111 in binary, and hex E is 14, which is 1110! Joining the two nibbles gives byte 01111110 — decimal 126!",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("point");
        if (w.people.amina) w.people.amina.set("think");
      }
    },
    {
      caption: "Amina executes the master boot script — floodlights & clinic cold-chain power up!",
      shot: [[-1.5, 2.2, 4.8], [-2.8, 2.0, 0.8]], hold: 6.0,
      who: "amina",
      text: "Master script verified and authenticated! The 50 Hz relays just clicked on — steady power is back at the clinic and across Ikogosi!",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
        if (station) {
          if (station.setFault) station.setFault("recovery");
          if (station.setPower) station.setPower(true);
        }
      }
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    names: {
      amina: "Amina", cust2: "Amina",
      tari: "Tari", cust1: "Tari",
      babatunde: "Chief Babatunde", ngozi: "Chief Babatunde",
      folake: "Dr. Folake", amaka: "Dr. Folake",
      engr_idris: "Engr. Idris"
    },
    setup: function (api) {
      if (window.MicrogridProps && MicrogridProps.dressStation) {
        station = MicrogridProps.dressStation(api, { fault: "recovery" });
      }

      // Cast mapping per 05-build-plan.md
      api.people.amina = api.people.cust2 || api.people.amaka;
      api.people.tari = api.people.cust1;
      api.people.babatunde = api.people.ngozi;
      api.people.folake = api.people.amaka;

      var idris = StoryStage.person({ skin: "#3d2618", outfit: "#2b6cb0", pants: "#1c2433", cap: "#eab308", hair: "short" });
      idris.position.set(1.5, 0, 1.1);
      idris.rotation.y = -0.5;
      if (api.props && api.props.market) api.props.market.add(idris);
      api.people.engr_idris = idris;

      var sp = station && station.spots;
      if (sp) {
        if (api.people.amina) { api.people.amina.position.set(sp.courtyardAmina[0], 0, sp.courtyardAmina[2]); api.people.amina.rotation.y = 0.15; }
        if (api.people.tari) { api.people.tari.position.set(sp.courtyardTari[0], 0, sp.courtyardTari[2]); api.people.tari.rotation.y = 0.45; }
        if (api.people.babatunde) { api.people.babatunde.position.set(sp.courtyardBabatunde[0], 0, sp.courtyardBabatunde[2]); api.people.babatunde.rotation.y = -0.45; }
      }
    },
    onTick: function (api, dt, t) {
      if (station && station.update) station.update(dt, t);
    }
  });
})();
