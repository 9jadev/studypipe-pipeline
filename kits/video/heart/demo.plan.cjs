// Demo for video kit "heart": every state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/heart/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/heart/demo.html
module.exports = {
  meta: { title: 'Heart kit demo', subtitle: 'Kit demo · heart', subject: 'Kit demo', level: 'QA', theme: 'classic' },
  checks: [['0.8 s cycle at 75 bpm', 60 / 75, 0.8], ['phases add up', 0.1 + 0.3 + 0.4, 0.8]],
  chapters: [
    { title: 'Structure', cues: [
      { say: 'Here is the heart seen from the front, so its right side is on your left.', ops: [{ clear: 'Heart kit' }, { panel: 'heart', s: { beat: 0, flow: 0, conduct: 0, labels: 1, valveLabels: 0, sounds: 0, walls: 0, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{front view}' }] },
      { say: 'The left ventricle wall is about three times thicker than the right.', ops: [{ panel: 'heart', s: { walls: 1, focus: 'LV' } }] },
      { say: 'Four valves keep blood moving one way.', ops: [{ panel: 'heart', s: { walls: 0, focus: null, valveLabels: 1 } }, { camera: 'wide', focus: 'valves' }] },
      { say: 'Deoxygenated blood on the right, oxygenated blood on the left.', ops: [{ panel: 'heart', s: { flow: 1, valveLabels: 0 } }, { camera: 'wide' }] },
    ] },
    { title: 'The cardiac cycle', cues: [
      { say: 'Atrial systole. The atria squeeze and the tricuspid and bicuspid valves are open.', ops: [{ panel: 'heart', s: { phase: 'atrial', flow: 0 } }, { camera: 'wide', focus: 'valves' }] },
      { say: 'Ventricular systole. The A V valves slam shut, lub, and the semilunar valves open.', ops: [{ panel: 'heart', s: { phase: 'ventricular', sounds: 1 } }] },
      { say: 'Diastole. The semilunar valves snap shut, dub, and the chambers fill.', ops: [{ panel: 'heart', s: { phase: 'diastole' } }] },
      { say: 'Now the whole cycle, beating at seventy-five beats per minute.', ops: [{ panel: 'heart', s: { phase: null, beat: 1, hr: 75, flow: 1 } }, { camera: 'wide' }] },
    ] },
    { title: 'Conduction', cues: [
      { say: 'The beat starts in the S A node, travels to the A V node, then down the bundle of His.', ops: [{ panel: 'heart', s: { conduct: 1, flow: 0, sounds: 0 } }, { camera: 'kit', focus: 'conduction' }] },
      { say: 'Close up on the S A node, the pacemaker.', ops: [{ panel: 'heart', s: { focus: 'SAN' } }, { camera: 'kit', focus: 'SAN' }] },
      { say: 'And the tricuspid valve, close up.', ops: [{ panel: 'heart', s: { focus: 'tricuspid', conduct: 0 } }, { camera: 'wide', focus: 'tricuspid' }] },
      { say: 'Back out to the whole heart.', ops: [{ panel: 'heart', s: { focus: null } }, { camera: 'wide' }] },
    ] },
  ],
};
