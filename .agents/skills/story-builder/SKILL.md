---
name: story-builder
description: Builds the opening 3D animated Nigerian phenomenon story (story.js) using StoryStage (assets/js/story-scene.js) — configuring characters, custom 3D props, camera shots, animations, and speech bubbles.
---

# Story Builder (`StoryStage`)

Goal: bring every lesson's opening **Anchor Phenomenon** to life as a 5–6 beat animated 3D story set in Nigeria (`story.js`), driven by both the student's **Play story** bar and the **StudyNarrator** (`action: "story:0"` … `"story:5"`).

## How `StoryStage` Works (`assets/js/story-scene.js`)
`window.StoryStage.wire(rootId, sceneKey, beats, opts)` creates a studio-lit 3D world with two built-in sets:
- **Set 1 (`x ≈ 0`, `api.props.market`):** Outdoor Nigerian market / workshop stall with Ankara canopy, wooden table, jars, jerrycan, bottles `bottleA` and `bottleB`, surrounding stalls, and street buildings. Sign sprite `api.props.mSign`.
- **Set 2 (`x ≈ 40`, `api.props.lab`):** Indoor Quality & Metrology Laboratory with tiled floor, window, lab bench (`api.props.bench`), electronic balance, retort stand, flasks, and sign sprite `api.props.lSign`.
- **Built-in Characters (`api.people`):**
  - `ngozi`: Nigerian woman in Ankara wrapper and gele (at `x = 0, z = -1.0` in `market`).
  - `cust1`: Young man in shirt and trousers (at `x = -1.1, z = 1.6` in `market`).
  - `cust2`: Woman in purple/teal Ankara wrapper and bun (at `x = 0.9, z = 1.7` in `market`).
  - `amaka`: Scientist/lecturer in white lab coat and safety goggles (at `x = -1.0, z = -1.3` in `lab`, i.e. world `x ≈ 39`).

## Customising the Set & Characters for Any Subject (`opts`)
Pass `opts = { names, setup, onTick }` as the 4th argument to `StoryStage.wire("story-stage", "story", beats, opts)`:
1. **`opts.names`:** Override character display names in the speech bubble for the topic:
   ```js
   names: {
     ngozi: "Mama Ngozi",
     cust1: "Kunle (Apprentice)",
     cust2: "Mrs Adeyemi",
     amaka: "Dr Amaka (Physics Lab)"
   }
   ```
2. **`opts.setup(api)`:** Customize signs and add topic-specific 3D props to `api.props.market` or `api.props.lab`:
   ```js
   setup: function (api) {
     // Replace market sign & lab sign for a Physics or Biology topic
     var mSign = StoryStage.sign("YABA CLOCK & INSTRUMENT STALL · LAGOS", "rgba(13,156,126,0.95)", "#fff", 0.5);
     mSign.position.copy(api.props.mSign.position);
     api.props.market.remove(api.props.mSign);
     api.props.market.add(mSign);

     var lSign = StoryStage.sign("UNILAG METROLOGY & PHYSICS LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
     lSign.position.copy(api.props.lSign.position);
     api.props.lab.remove(api.props.lSign);
     api.props.lab.add(lSign);

     // Add custom 3D props (e.g. two pendulum clocks or retort stand) to api.props
   }
   ```
3. **`opts.onTick(api, dt, t)`:** Animate custom props every frame (e.g. swinging clock pendulums at different periods!).

## Character Animation States (`person.set(state)`)
- `"idle"`: gentle breathing bob
- `"talk"`: animated mouth + expressive right-arm gesture + head nod
- `"point"`: points right arm forward while speaking
- `"think"`: hand on chin, tilted head
- `"sad"`: head bowed down
- `"wave"`: raised waving hand
- `"cheer"`: both arms raised celebrating
- `person.walkTo(x, z, afterState)`: walks smoothly to `(x, z)` with swinging legs/arms
- `person.hold(meshOrNull, "right" | "left")`: attaches a 3D prop to the character's hand

## Beat Format
```js
var beats = [
  {
    caption: "Yaba Market, Lagos. Customers gather at the clock & instrument stall.",
    shot: [[0, 2.6, 7.2], [0, 1.3, 0]], // [cameraPos, lookAtTarget]
    instant: true,
    hold: 5,
    who: "cust1",
    text: "Mama! This wall clock you sold our school runs ten minutes slow every single hour!",
    run: function (w) {
      w.people.cust1.set("point");
    }
  }
  // 5–6 beats total, ending at the Lab (x ≈ 40) where Dr Amaka proposes an experiment
];
```

## Rules
- Always include a `<details class="reveal-box" id="story-text">` transcript right below `#story-stage` so students on ultra-low-end devices without WebGL can read the full dialogue.
- Wire every beat to the first chapter of `narration.js` using `action: "story:0"`, `"story:1"`, etc., and spotlight characters with `target: { scene: "story", part: "ngozi" }`.
