# `microgrid-props` (`window.MicrogridProps`)

Shared **3D story props** for every `story.js` in the **Introduction to Programming** unit (`introduction-to-programming`): the **Ikogosi Smart Solar Microgrid Courtyard & Smart Meter Kiosk** (`StoryStage` Set 1, `api.market`) and the **Ikogosi SCADA Control Room & Clinic Cold-Chain Corner** (`StoryStage` Set 2, `api.lab`). Reusable for any computing, renewable energy, solar microgrid, SCADA telemetry, or cold-chain clinic story.

Classic script, offline, three.js only (`window.THREE`). Load **after** `three.min.js` and `scene-kit.js` and **before** `story-scene.js` / `story.js` (copy `kits/microgrid-props/kit.js` to `html/assets/js/microgrid-props.js`).

## Quick use in `story.js`

```js
var station = null;
StoryStage.wire("story-stage", "story", beats, {
  names: { ngozi: "Engr. Amina", cust1: "Tari", cust2: "Chief Babatunde", amaka: "Dr. Folake" },
  setup: function (api) {
    if (window.MicrogridProps) {
      station = MicrogridProps.dressStation(api, { fault: "typeerror" });
    }
  },
  onTick: function (api, dt, t) { if (station) station.update(dt, t); }
});
// In a beat:
// run: function (api) { api.shot.apply(null, station.shots.terminal); station.setFault("typeerror"); }
```

`dressStation(api, opts)` also registers every prop in `api.props` (`solarArray`, `inverter`, `batteryRack`, `generator`, `fridge`, `smartMeter`, `terminal`, `floodlight`) and attaches an automatic frame ticker so `api.rect("inverter")` / `api.highlight("fridge")` and live animations work out of the box.

## Fault Modes (`station.setFault(mode)`)

| Mode | Lesson | Phenomenon & Telemetry Driven by `MicrogridProps.model` |
|---|---|---|
| `"typeerror"` | L01 | `total_power = "150" + 20` flashes `TypeError: can only concatenate str to str` on SCADA & inverter OLED; breaker trips (`0.0 kW`). |
| `"logic"` | L02 | Battery sinks to `18%` in rainstorm; diesel generator locked out by `if batt < 20 and grid_online == True`. |
| `"loop"` | L03 | Runaway `while solar_output > 0:` loop drives CPU to `99%`, cooling fans to `4200 RPM`, and scrolls log lines continuously. |
| `"indexerror"` | L04 | `for i in range(1, 9):` triggers `IndexError` on cell `Index 8` (8-slot rack `0..7`); clinic vaccine fridge warms to `+9.8 °C` with flashing beacon. |
| `"scope"` | L05 | Smart meter kiosk shows tariff discrepancy (`VAT 5.0%` vs `7.5%`, `N6069.00` vs `N7713.50`) and local/global `total` scope overwrite. |
| `"recovery"` | L06 | Master parity `0x7E` (`01111110`) unlocks central inverter (`170.0 kW`), starts backup sync, cools fridge to `+3.8 °C`, and lights the town floodlights. |
| `"normal"` | Any | Clean baseline telemetry (`170.0 kW`, `88%` SOC, `+4.1 °C`, `0x7E`). |

## Individual 3D Prop Builders (`MicrogridProps.create*`)

Every builder returns a `THREE.Group` `g` with `g.parts`, `g.reading()`, `g.setState(o)`, `g.update(dt, t)`, and `g.pickPart(raycaster)`:

- `createSolarArray(opts)` — Tilted crystalline PV array on galvanized A-frame struts, bevelled aluminium deck, procedural solar-cell grid texture, junction box LED, and armoured MC4 cable conduit.
- `createInverterCabinet(opts)` — Bevelled industrial hybrid inverter cabinet, procedural OLED telemetry screen, dual spinning axial cooling fans (`fanA`, `fanB`), rotary breaker lever, LED status bar, and cable conduits.
- `createBatteryRack(opts)` — 8-slot LiFePO4 server rack (`cell0`..`cell7` for `Index 0`..`Index 7`), copper busbars, per-slot status LEDs, and boundary alarm header.
- `createDieselGenerator(opts)` — Sound-attenuated canopy generator on steel skid, louvred intake, internal flywheel fan, lathe exhaust muffler with animated rain flap, and PLC auto-start display.
- `createClinicFridge(opts)` — WHO PQS solar direct-drive vaccine refrigerator with glazed inspection window, lathe vaccine vials on shelves, digital `+°C` cold-chain header, and flashing top alarm beacon.
- `createSmartMeter(opts)` — Kiosk board with 3 prepaid household meters (`meter1`..`meter3`), keypads, and shared tariff/VAT LCD readout.
- `createScadaTerminal(opts)` — Rugged engineering workstation with tilted live code/log monitor canvas, keyboard deck, side CPU cooling fan, and spline RS-485 serial cable.

## Shots & Spots Returned by `dressStation`

- **Set 1 (`api.market`) Shots:** `courtyardWide`, `solar`, `generator`, `smartMeter`, `floodlight`
- **Set 2 (`api.lab`) Shots:** `controlWide`, `terminal`, `inverter`, `batteryRack`, `fridge`
- **Character Spots:** `amina`, `tari`, `babatunde`, `folake`, `courtyardAmina`, `courtyardTari`, `courtyardBabatunde`
