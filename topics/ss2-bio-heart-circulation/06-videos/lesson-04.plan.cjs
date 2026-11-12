// Lesson 04 explainer plan: The Beating Heart (from lesson-04-direction-script.md).
// Build + embed: node scripts/apply-video.mjs topics/ss2-bio-heart-circulation --lesson lesson-04
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const HR = s => k('HR', s), SV = s => k('SV', s), CO = s => k('CO', s), T = s => k('T', s), PC = s => k('PC', s);
const H = 'heart';

// Chidi's recovery readings (bench table in 02-lesson.md): minutes after exercise, beats per minute.
const RX = [0, 1, 2, 3, 4, 5], RY = [132, 116, 96, 80, 72, 68];
// Smooth monotone curve through the readings, flat at the resting rate by minute 5.
function smooth(xs, ys, per) {
  const n = xs.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = 0;
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const h = xs[i + 1] - xs[i];
    for (let j = 0; j < per; j++) {
      const t = j / per, t2 = t * t, t3 = t2 * t;
      const y = (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
      out.push([+(xs[i] + t * h).toFixed(3), +y.toFixed(2)]);
    }
  }
  out.push([xs[n - 1], ys[n - 1]]);
  return out;
}
const G = { id: 'recovery', x: [0, 6, 1], y: [60, 140, 20], xlabel: 'time after exercise (min)', ylabel: 'heart rate (bpm)', items: [
  { id: 'rest', type: 'line', from: [0, 68], to: [6, 68], color: 'sky' },
  { id: 'resttxt', type: 'text', at: [3.6, 63.5], text: 'resting rate 68', color: 'sky' },
  { id: 'early', type: 'points', pts: [[0, 132], [1, 116], [2, 96]], labels: ['132', '116', '96'], color: 'HR', pos: 'ne' },
  { id: 'late', type: 'points', pts: [[3, 80], [4, 72], [5, 68]], labels: ['80', '72', '68'], color: 'HR', pos: 'ne' },
  { id: 'curve', type: 'polyline', pts: smooth(RX, RY, 8), color: 'amber' },
  { id: 'rec', type: 'guide', at: [5, 68], color: 'green' },
] };

module.exports = {
  meta: {
    title: 'The Beating Heart', subtitle: 'Lesson 04 · Cardiac cycle, heart sounds, pulse, cardiac output and recovery', eq: 'CO = HR × SV',
    subject: 'Biology', level: 'SS2 · WAEC / NECO / JAMB', next: '#apply', nextLabel: 'Continue to Apply →',
    roles: { HR: { color: 'gold', name: 'heart rate' }, SV: { color: 'sky', name: 'stroke volume' }, CO: { color: 'green', name: 'cardiac output' }, T: { color: 'pink', name: 'time for one beat' }, PC: { color: 'orange', name: 'percentage change' } },
    captionFixes: { 'S A node': 'SA node', 'A V node': 'AV node', 'A V valves': 'AV valves' },
  },
  checks: [
    ['Chidi 33 beats in 15 s', 33 * (60 / 15), 132],
    ['x4 scale factor', 60 / 15, 4],
    ['cycle T = 60/75', 60 / 75, 0.8],
    ['stages 0.4 + 0.1 + 0.3', 0.4 + 0.1 + 0.3, 0.8, 1e-9],
    ['WE ventricle rest 0.80 - 0.30', 0.8 - 0.3, 0.5, 1e-9],
    ['WE ventricle rest percent', (0.5 / 0.8) * 100, 62.5, 1e-9],
    ['WE1 rest rate 18 x 4', 18 * (60 / 15), 72],
    ['WE1 T = 60/72', 60 / 72, 0.83, 0.005],
    { name: 'WE1 T shown to 2 dp', approx: [[60 / 72, 0.83, 2]] },
    ['WE2 rest CO 68 x 70', 68 * 70, 4760],
    ['WE2 rest CO dm3', 4760 / 1000, 4.76],
    ['WE2 sprint CO 132 x 95', 132 * 95, 12540],
    ['WE2 sprint CO dm3', 12540 / 1000, 12.54],
    { name: 'WE2 ratio 12.54/4.76 shown 2.63', approx: [[12.54 / 4.76, 2.63, 2]] },
    { name: 'WE2 ratio about 2.6', approx: [[12.54 / 4.76, 2.6, 1]] },
    ['WE3 rise 132 - 68', 132 - 68, 64],
    { name: 'WE3 fraction 64/68 shown 0.941', approx: [[64 / 68, 0.941, 3]] },
    { name: 'WE3 percent 94.1', approx: [[(64 / 68) * 100, 94.1, 1]] },
    ['recovery readings, 5 min equals rest', RY[5], 68],
    ['recovery readings, 1 min', RY[1], 116],
    ['recovery readings, 2 min', RY[2], 96],
    ['recovery readings, 3 min', RY[3], 80],
    ['recovery readings, 4 min', RY[4], 72],
    { name: 'recovery curve passes the readings', test: () => { const c = smooth(RX, RY, 8); return RX.every((x, i) => c.some(p => p[0] === x && Math.abs(p[1] - RY[i]) < 0.01)); } },
    { name: 'recovery curve never dips below resting rate', test: () => smooth(RX, RY, 8).every(p => p[1] >= 68 - 1e-9) },
    ['your turn rate 20 x 4', 20 * (60 / 15), 80],
    { name: 'your turn T = 60/80 shown 0.75', approx: [[60 / 80, 0.75, 2]] },
    ['mistake units 4760 cm3 to dm3', 4760 / 1000, 4.76],
    ['blood pressure 120 over 80', 120 - 80, 40],
  ],
  chapters: [
    { title: "Chidi's racing pulse", cues: [
      { say: 'Chidi is back from his sprint, breathless. Dr Aisha holds his wrist and counts his pulse for fifteen seconds. She gets thirty-three beats.', ops: [{ clear: 'After the sprint' }, { panel: H, s: { beat: 1, hr: 132, phase: null, flow: 1, conduct: 0, labels: 1, valveLabels: 0, sounds: 1, walls: 0, focus: null }, fresh: 1 }, { write: 'a1', tex: `${HR('33')}\\ \\text{beats in } 15\\ \\text{s}` }] },
      { say: 'Thirty-three times four is one hundred and thirty-two beats every minute. At rest, he had only sixty-eight.', ops: [{ write: 'a2', tex: `33 \\times 4 = ${HR('132\\ \\text{bpm}')}` }, { write: 'a3', tex: `\\text{at rest: } ${HR('68\\ \\text{bpm}')}`, at: 4 }, { hl: ['HR'], at: 4 }] },
      { say: 'Baba Sule says the brain kicks the heart for every beat, and the noise is the muscle clapping. Dr Aisha says, wait five minutes, and let us see.', ops: [{ write: 'a4', tex: '\\text{brain kicks every beat?}' }, { write: 'a5', tex: '\\text{noise = muscle clapping?}', at: 5 }] },
      { say: 'By the end, you will describe one heartbeat, explain lub and dub, trace the impulse, and calculate rate, output and percentage change.', ops: [{ clear: 'By the end of this video' }, { write: 'o1', tex: '\\square\\ \\text{one heartbeat}' }, { write: 'o2', tex: '\\square\\ \\text{lub and dub}', at: 3 }, { write: 'o3', tex: '\\square\\ \\text{the impulse path}', at: 5 }, { write: 'o4', tex: '\\square\\ \\text{rate, output, \\% change}', at: 7 }] },
      { say: 'First, let us watch one heartbeat slowly.', ops: [{ panel: H, s: { hr: 75, flow: 1, sounds: 0, labels: 1 } }, { camera: 'kit', drift: 0.5 }] },
    ] },
    { title: 'One heartbeat, 0.8 seconds', cues: [
      { say: 'At seventy-five beats per minute, one beat lasts sixty over seventy-five. That is zero point eight zero seconds.', ops: [{ clear: 'One heartbeat' }, { camera: 'board' }, { write: 'b1', tex: `${T('T')} = \\dfrac{60}{${HR('75')}}` }, { write: 'b2', tex: `= ${T('0.80\\ \\text{s}')}`, at: 4 }, { box: 'b2' }] },
      { say: 'Stage one. All chambers are relaxed, for about zero point four seconds. Blood flows in from the veins, fills the atria, and runs through open valves into the ventricles.', ops: [{ clear: 'The stages' }, { panel: H, s: { beat: 0, phase: 'diastole', flow: 1, valveLabels: 1 } }, { camera: 'wide', focus: 'valves' }, { write: 'c1', tex: '1.\\ \\text{all relaxed: } 0.4\\ \\text{s}' }] },
      { say: 'Stage two. The atria contract for about zero point one seconds and top up the ventricles.', ops: [{ panel: H, s: { phase: 'atrial' } }, { write: 'c2', tex: '2.\\ \\text{atria contract: } 0.1\\ \\text{s}' }] },
      { say: 'Stage three. The ventricles contract for about zero point three seconds. The A V valves shut, then the semilunar valves open, and blood surges into the aorta and pulmonary artery.', ops: [{ panel: H, s: { phase: 'ventricular' } }, { write: 'c3', tex: '3.\\ \\text{ventricles contract: } 0.3\\ \\text{s}' }] },
      { say: 'Then the ventricles relax, the semilunar valves snap shut, and the cycle repeats. Contraction is called systole. Relaxation is called diastole.', ops: [{ panel: H, s: { phase: 'diastole' } }, { camera: 'wide' }, { write: 'c4', tex: '\\text{systole = contract}' }, { write: 'c5', tex: '\\text{diastole = relax}', at: 4.5 }] },
      { say: 'Add the stages: zero point four plus zero point one plus zero point three makes zero point eight seconds.', ops: [{ clear: 'Adding up' }, { panel: H, s: { phase: null, beat: 1 } }, { write: 'c6', tex: `0.4 + 0.1 + 0.3 = ${T('0.8\\ \\text{s}')}` }, { box: 'c6' }] },
    ] },
    { title: 'Do the ventricles ever rest?', cues: [
      { say: 'Worked example. At seventy-five beats per minute, ventricular systole lasts zero point three zero seconds. What fraction of each cycle do the ventricles spend relaxing?', ops: [{ clear: 'Ventricle rest time' }, { camera: 'board' }, { write: 'd1', tex: `${HR('75\\ \\text{bpm}')},\\ \\text{systole } 0.30\\ \\text{s}` }, { write: 'd2', tex: '\\text{relaxing fraction?}', at: 6 }] },
      { say: 'Step one. The cycle time is sixty over seventy-five, zero point eight zero seconds.', ops: [{ write: 'd3', tex: `${T('T')} = \\dfrac{60}{75} = ${T('0.80\\ \\text{s}')}` }] },
      { say: 'Step two. The relaxing time is zero point eight zero minus zero point three zero, which is zero point five zero seconds.', ops: [{ clear: 'Relaxing time' }, { write: 'd4', tex: '0.80 - 0.30 = 0.50\\ \\text{s}' }] },
      { say: 'Step three. Divide by the cycle time and multiply by one hundred. Zero point five over zero point eight, times one hundred, is sixty-two point five percent.', ops: [{ write: 'd5', tex: `\\dfrac{0.50}{0.80} \\times 100 = ${PC('62.5\\%')}` }] },
      { say: 'So the ventricles rest for sixty-two point five percent of every beat. That is why heart muscle does not tire.', ops: [{ box: 'd5' }, { camera: 'wide' }, { write: 'd6', tex: '\\text{rest} \\Rightarrow \\text{no tiring}', at: 3 }] },
    ] },
    { title: 'Lub and dub', cues: [
      { say: 'Now the sounds. Watch the valves.', ops: [{ clear: 'Lub and dub' }, { panel: H, s: { phase: 'diastole', sounds: 0, valveLabels: 1, flow: 1, beat: 0 } }, { camera: 'wide', focus: 'valves' }] },
      { say: 'When the ventricles begin to squeeze, the tricuspid and bicuspid valves snap shut. That is the first sound, lub. It is deeper and longer.', ops: [{ panel: H, s: { phase: 'ventricular', sounds: 1 } }, { write: 'e1', tex: '\\text{lub = AV valves close}', note: 'deeper, longer' }] },
      { say: 'When the ventricles relax, the semilunar valves in the aorta and pulmonary artery snap shut. That is dub, shorter and sharper.', ops: [{ panel: H, s: { phase: 'diastole' } }, { write: 'e2', tex: '\\text{dub = semilunar close}', note: 'shorter, sharper' }] },
      { say: 'So lub-dub is valves closing, not muscle clapping. Baba Sule, sorry! An extra swishing sound, a murmur, can hint at a leaky valve.', ops: [{ write: 'e3', tex: '\\text{sounds = valves closing}' }, { box: 'e3' }, { write: 'e4', tex: '\\text{murmur: leaky valve?}', at: 6 }] },
    ] },
    { title: 'Who starts the beat?', cues: [
      { say: 'Who starts the beat? The heart itself. Heart muscle is myogenic. The beat begins at the sinoatrial node, the S A node, in the wall of the right atrium.', ops: [{ clear: 'Who starts the beat?' }, { panel: H, s: { phase: null, beat: 0, flow: 0, conduct: 1, valveLabels: 0, sounds: 0, focus: 'SAN' } }, { camera: 'wide', focus: 'SAN' }, { write: 'f1', tex: '\\text{myogenic: starts in the heart}' }, { write: 'f2', tex: '\\text{SAN = pacemaker}', at: 6 }] },
      { say: 'The impulse spreads over both atria, and they contract.', ops: [{ clear: 'The path of the impulse' }, { panel: H, s: { focus: null, phase: 'atrial' } }, { camera: 'wide', focus: 'conduction' }, { write: 'g1', tex: '1.\\ \\text{SAN} \\to \\text{atria contract}' }] },
      { say: 'At the atrioventricular node, the A V node, it waits briefly, so the atria can finish emptying.', ops: [{ panel: H, s: { focus: 'AVN' } }, { write: 'g2', tex: '2.\\ \\text{AVN: short delay}' }] },
      { say: 'Then it races down the bundle of His, in the septum, and spreads through the Purkinje fibres in both ventricle walls.', ops: [{ panel: H, s: { focus: 'septum' } }, { write: 'g3', tex: '3.\\ \\text{bundle of His}' }, { write: 'g4', tex: '4.\\ \\text{Purkinje fibres}', at: 4.5 }] },
      { say: 'So the ventricles contract from the bottom upward, pushing blood towards the arteries.', ops: [{ panel: H, s: { focus: null, phase: 'ventricular' } }, { camera: 'wide' }] },
      { say: 'Remember the order: S A node, A V node, bundle of His, Purkinje fibres.', ops: [{ clear: 'Remember the order' }, { panel: H, s: { phase: null, beat: 1, flow: 1 } }, { write: 'g5', tex: '\\text{SAN} \\to \\text{AVN} \\to \\text{His} \\to \\text{Purkinje}' }, { box: 'g5' }] },
      { say: 'So what do nerves do? The cardiac centre in the medulla only changes the speed. Sympathetic nerves and adrenaline speed the heart up. The vagus nerve slows it down.', ops: [{ clear: 'What nerves do' }, { panel: H, s: { hr: 68, flow: 0, conduct: 1 } }, { write: 'h1', tex: '\\text{faster: sympathetic, adrenaline}' }, { write: 'h2', tex: '\\text{slower: vagus nerve}', at: 5.5 }] },
      { say: 'But every single beat still starts at the S A node.', ops: [{ panel: H, s: { hr: 132, focus: 'SAN' } }, { camera: 'wide', focus: 'SAN' }, { write: 'h3', tex: '\\text{every beat starts at the SAN}' }, { box: 'h3' }] },
    ] },
    { title: 'Pulse and blood pressure', cues: [
      { say: 'Each time the left ventricle pushes blood into the aorta, the artery wall bulges and springs back. That is your pulse, so pulse rate equals heart rate.', ops: [{ clear: 'Pulse' }, { camera: 'wide' }, { panel: H, s: { hr: 75, focus: null, conduct: 0, flow: 1, beat: 1 } }, { write: 'p1', tex: '\\text{pulse = artery wall bulge}' }, { write: 'p2', tex: `\\text{pulse rate} = ${HR('\\text{heart rate}')}`, at: 6 }] },
      { say: 'You feel it where an artery crosses a bone near the skin: the wrist, the neck, the temple, or the groin. Use two fingers, never the thumb, because the thumb has its own pulse.', ops: [{ write: 'p3', tex: '\\text{wrist, neck, temple, groin}' }, { write: 'p4', tex: '\\text{two fingers, not the thumb}', at: 7 }] },
      { say: 'Blood pressure is the push of blood against vessel walls, measured with a sphygmomanometer. A young adult reads about one hundred and twenty over eighty millimetres of mercury.', ops: [{ clear: 'Blood pressure' }, { write: 'q1', tex: '\\text{BP} \\approx 120/80\\ \\text{mmHg}' }, { box: 'q1' }] },
      { say: 'The first number is when the ventricles contract. The second is when they relax. Pressure is highest in the aorta and falls steadily all the way back to the heart.', ops: [{ write: 'q2', tex: '120 = \\text{contracting}' }, { write: 'q3', tex: '80 = \\text{relaxed}', at: 4 }] },
    ] },
    { title: 'Worked example: pulse to heart rate', cues: [
      { say: "Worked example. At rest, Chidi's pulse gives eighteen beats in fifteen seconds. Find his heart rate and the length of one cycle.", ops: [{ clear: 'Rate and cycle time' }, { panel: null }, { write: 'w1', tex: `${HR('18')}\\ \\text{beats in } 15\\ \\text{s}` }] },
      { say: 'Step one. Scale to one minute. Multiply by sixty over fifteen, which is four.', ops: [{ write: 'w2', tex: `${HR('\\text{HR}')} = 18 \\times \\dfrac{60}{15}` }, { write: 'w3', tex: `= 18 \\times 4 = ${HR('72\\ \\text{bpm}')}`, at: 4.5 }, { box: 'w3' }] },
      { say: 'Step two. The cycle time is sixty over seventy-two.', ops: [{ clear: 'Cycle time' }, { write: 'w4', tex: `${T('T')} = \\dfrac{60}{72}` }] },
      { say: 'That is zero point eight three seconds, close to the textbook zero point eight.', ops: [{ write: 'w5', tex: `\\approx ${T('0.83\\ \\text{s}')}` }, { box: 'w5' }] },
    ] },
    { title: 'Worked example: cardiac output and % rise', cues: [
      { say: "Chidi's stroke volume is seventy centimetres cubed at rest, at sixty-eight beats per minute. After the sprint it is ninety-five, at one hundred and thirty-two. Find each cardiac output.", ops: [{ clear: 'Cardiac output' }, { write: 'x1', tex: `${CO('\\text{CO}')} = ${HR('\\text{HR}')} \\times ${SV('\\text{SV}')}` }, { write: 'x2', tex: `\\text{rest: } ${HR('68')},\\ ${SV('70\\ \\text{cm}^3')}`, at: 6 }, { write: 'x3', tex: `\\text{sprint: } ${HR('132')},\\ ${SV('95\\ \\text{cm}^3')}`, at: 9 }] },
      { say: 'Rest first. Sixty-eight times seventy is four thousand, seven hundred and sixty centimetres cubed per minute.', ops: [{ clear: 'At rest' }, { write: 'x4', tex: `${HR('68')} \\times ${SV('70')} = 4760\\ \\text{cm}^3/\\text{min}` }] },
      { say: 'Divide by a thousand: four point seven six decimetres cubed per minute.', ops: [{ write: 'x5', tex: `= ${CO('4.76\\ \\text{dm}^3/\\text{min}')}` }, { box: 'x5' }] },
      { say: 'After the sprint, one hundred and thirty-two times ninety-five is twelve thousand, five hundred and forty.', ops: [{ clear: 'After the sprint' }, { write: 'x6', tex: `${HR('132')} \\times ${SV('95')} = 12\\,540\\ \\text{cm}^3/\\text{min}` }] },
      { say: 'That is twelve point five four decimetres cubed per minute.', ops: [{ write: 'x7', tex: `= ${CO('12.54\\ \\text{dm}^3/\\text{min}')}` }, { box: 'x7' }] },
      { say: 'How many times more? Divide twelve point five four by four point seven six. That is two point six three, so about two point six times.', ops: [{ clear: 'How many times more?' }, { write: 'x8', tex: '\\dfrac{12.54}{4.76} = 2.63' }, { write: 'x9', tex: '\\approx 2.6\\ \\text{times}', at: 6 }, { box: 'x9' }] },
      { say: 'Now the percentage rise in heart rate, from sixty-eight to one hundred and thirty-two. Percentage change is new minus old, over old, times one hundred.', ops: [{ clear: 'Percentage rise' }, { write: 'y1', tex: `${PC('\\%\\text{ change}')} = \\dfrac{\\text{new} - \\text{old}}{\\text{old}} \\times 100` }] },
      { say: 'Step one. The rise is one hundred and thirty-two minus sixty-eight, which is sixty-four beats per minute.', ops: [{ write: 'y2', tex: '132 - 68 = 64\\ \\text{bpm}' }] },
      { say: 'Step two. Sixty-four over sixty-eight is zero point nine four one. Times one hundred gives ninety-four point one percent.', ops: [{ clear: 'Percentage rise' }, { write: 'y3', tex: `\\dfrac{64}{68} = 0.941` }, { write: 'y4', tex: `0.941 \\times 100 = ${PC('94.1\\%')}`, at: 4.5 }] },
      { say: 'So his heart rate rose by ninety-four point one percent. That is almost double.', ops: [{ box: 'y4' }] },
    ] },
    { title: 'The recovery curve', cues: [
      { say: 'Dr Aisha counted again every minute. Straight after the sprint, one hundred and thirty-two beats per minute. After one minute, one hundred and sixteen. After two minutes, ninety-six.', ops: [{ clear: 'Recovery after the sprint' }, { panel: 'graph', s: { spec: G, show: ['early'] }, fresh: 1 }, { camera: 'wide' }, { write: 'r1', tex: `\\text{peak} = ${HR('132\\ \\text{bpm}')}` }] },
      { say: 'After three minutes, eighty. After four, seventy-two. After five, sixty-eight, back at his resting rate.', ops: [{ panel: 'graph', s: { show: ['early', 'late', 'rest', 'resttxt'] } }, { write: 'r2', tex: `\\text{rest} = ${HR('68\\ \\text{bpm}')}` }] },
      { say: 'Join the points with a smooth curve of best fit, not straight lines. The rate falls steeply at first, then levels off as it nears the resting rate.', ops: [{ panel: 'graph', s: { show: ['early', 'late', 'rest', 'resttxt', 'curve'] } }, { write: 'r3', tex: '\\text{steep fall, then levels off}' }] },
      { say: "Recovery time is where the curve meets the resting rate, about five minutes. The vagus nerve slows the S A node, and Chidi's heart is healthy. An athlete would recover even faster.", ops: [{ panel: 'graph', s: { show: ['early', 'late', 'rest', 'resttxt', 'curve', 'rec'], pulse: 'rec' } }, { camera: 'wide', focus: ['rec'], at: 1 }, { write: 'r4', tex: '\\text{recovery} \\approx 5\\ \\text{min}' }, { box: 'r4' }] },
    ] },
    { title: 'Mistakes, summary and your turn', cues: [
      { say: 'Here are the mistakes that cost marks.', ops: [{ clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' }] },
      { say: 'One. Saying the brain starts each beat. The S A node does. Nerves only change the speed.', ops: [{ write: 'm1', tex: '\\text{1. SAN starts each beat}' }] },
      { say: 'Two. Swapping the sounds. Lub is the A V valves closing. Dub is the semilunar valves.', ops: [{ write: 'm2', tex: '\\text{2. lub = AV, dub = semilunar}' }] },
      { say: 'Three. Forgetting to convert. Four thousand, seven hundred and sixty centimetres cubed is four point seven six decimetres cubed.', ops: [{ write: 'm3', tex: '\\text{3. } 4760\\ \\text{cm}^3 = 4.76\\ \\text{dm}^3' }] },
      { say: 'Four. Dividing by the new value for percentage change. Always divide by the old value.', ops: [{ write: 'm4', tex: '\\text{4. divide by the old value}' }] },
      { say: 'To sum up. At rest, the cycle is zero point four seconds relaxed, zero point one for the atria, and zero point three for the ventricles.', ops: [{ clear: 'Summary' }, { write: 's1', tex: '0.4 + 0.1 + 0.3 = 0.8\\ \\text{s}' }] },
      { say: 'The impulse goes S A node, A V node, bundle of His, Purkinje fibres. Lub is the A V valves, and dub is the semilunar valves.', ops: [{ write: 's2', tex: '\\text{SAN} \\to \\text{AVN} \\to \\text{His} \\to \\text{Purkinje}' }, { write: 's3', tex: '\\text{lub: AV} \\quad \\text{dub: semilunar}', at: 5.5 }] },
      { say: 'And the equations: cycle time is sixty over heart rate, and cardiac output is heart rate times stroke volume.', ops: [{ write: 's4', tex: `${T('T')} = \\dfrac{60}{${HR('\\text{HR}')}}` }, { write: 's5', tex: `${CO('\\text{CO}')} = ${HR('\\text{HR}')} \\times ${SV('\\text{SV}')}`, at: 5 }] },
      { say: 'Your turn. A pulse gives twenty beats in fifteen seconds. Find the heart rate and the cycle time.', hold: 15, ops: [{ clear: 'Your turn' }, { write: 'u1', tex: `${HR('20')}\\ \\text{beats in } 15\\ \\text{s}` }, { write: 'u2', tex: '\\text{Find HR and } T', at: 4 }] },
      { say: 'Twenty times four is eighty beats per minute. The cycle time is sixty over eighty, which is zero point seven five seconds.', ops: [{ write: 'u3', tex: `20 \\times 4 = ${HR('80\\ \\text{bpm}')}` }, { write: 'u4', tex: `${T('T')} = \\dfrac{60}{80} = ${T('0.75\\ \\text{s}')}`, at: 4 }, { box: 'u4' }] },
      { say: 'Well done. Now try the worked examples, and see why a healthy heart always settles back.', ops: [{ write: 'u5', tex: '\\text{the heart sets its own beat}' }, { box: 'u5' }] },
    ] },
  ],
};
