/* Lesson 02 · 3D story beats (Set 1 · Ikogosi Smart Solar Microgrid Control Station, Ekiti).
   Cast: Amina (SS1 lead student debugger), Tari (SS1 classmate), Chief Babatunde (village council chairman).
   Props come from the shared microgrid-props kit (`MicrogridProps.dressStation(api, { fault: "logic" })`). */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var station = null;

  var beats = [
    {
      caption: "Ikogosi-Ekiti. Storm clouds darken the sky; battery voltage sinks to 18%.",
      shot: [[0, 2.3, 6.2], [0, 1.1, -0.3]], instant: true, hold: 5.5,
      who: "babatunde",
      text: "The rainstorm has blocked the sun for hours and our battery bank is down to 18 percent!",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("point");
        if (station && station.setFault) station.setFault("logic");
      }
    },
    {
      caption: "Tari checks the silent diesel backup generator in the courtyard.",
      shot: [[2.4, 1.5, 3.4], [2.6, 0.7, 0.5]], hold: 5.5,
      who: "tari",
      text: "Battery is below 20%, yet the diesel backup generator is completely silent! Why hasn't the relay cranked it?",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("point");
      }
    },
    {
      caption: "Amina opens generator_control.py on the maintenance laptop.",
      shot: [[-0.4, 1.7, 3.4], [0.0, 1.2, -0.8]], hold: 5.5,
      who: "amina",
      text: "Look at line 14 of generator_control.py: if battery_level < 20 and grid_power_active == True: start_generator().",
      run: function (w) {
        if (w.people.amina) w.people.amina.set("talk");
      }
    },
    {
      caption: "Tari spots the inverted boolean condition.",
      shot: [[-1.1, 1.7, 3.6], [-0.4, 1.2, 0.2]], hold: 5.5,
      who: "tari",
      text: "It only starts if the grid power is active! But in a blackout, the main grid is down — so grid_power_active is False!",
      run: function (w) {
        if (w.people.tari) w.people.tari.set("talk");
        if (w.people.amina) w.people.amina.set("think");
      }
    },
    {
      caption: "Chief Babatunde points to the flickering clinic cold-chain lights.",
      shot: [[0.2, 1.9, 4.4], [0, 1.2, -0.4]], hold: 5.5,
      who: "babatunde",
      text: "The health clinic lights are flickering! Invert that condition with NOT on the logic switchboard right away!",
      run: function (w) {
        if (w.people.babatunde) w.people.babatunde.set("talk");
        if (w.people.amina) w.people.amina.set("point");
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
      if (window.MicrogridProps) {
        station = MicrogridProps.dressStation(api, { fault: "logic" });
      }

      // Cast mapping (05-build-plan.md)
      api.people.amina = api.people.cust2 || api.people.ngozi;
      api.people.tari = api.people.cust1;
      api.people.babatunde = api.people.ngozi;

      var sp = station && station.spots;
      if (api.people.amina) {
        api.people.amina.visible = true;
        api.people.amina.position.set(sp ? sp.courtyardAmina[0] : 0, 0, sp ? sp.courtyardAmina[2] : -1.0);
        api.people.amina.rotation.y = 0;
      }
      if (api.people.tari) {
        api.people.tari.visible = true;
        api.people.tari.position.set(sp ? sp.courtyardTari[0] : -1.1, 0, sp ? sp.courtyardTari[2] : 1.4);
        api.people.tari.rotation.y = 0.35;
      }
      if (api.people.babatunde) {
        api.people.babatunde.visible = true;
        api.people.babatunde.position.set(sp ? sp.courtyardBabatunde[0] : 1.3, 0, sp ? sp.courtyardBabatunde[2] : 1.5);
        api.people.babatunde.rotation.y = -0.45;
      }
    },
    onTick: function (api, dt, t) {
      if (station && station.update) station.update(dt, t);
    }
  });
})();
