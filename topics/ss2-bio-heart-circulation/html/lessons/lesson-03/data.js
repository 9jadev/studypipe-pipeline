/* Lesson 03 · Working of the Heart — Cardiac Cycle, Myogenic Pacemaker, Heart Sounds & Blood Pressure — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L03 = {
    // ---- 1. Cardiac Cycle, Pacemaker & Heart Sounds Sort items (12 cards across 3 bins) ----
    items: [
      { id: "san-ra", name: "Sinoatrial Node (SAN) in upper right atrial wall fires pacemaker impulse", emo: "⚡", bin: "shm", why: "Atrial Systole & SAN (0.10 s): The SAN is the natural pacemaker located in the right atrium that initiates every heartbeat myogenically." },
      { id: "atria-sq", name: "Both atria contract (0.10 s), topping up the ventricles through open AV valves", emo: "⏬", bin: "shm", why: "Atrial Systole & SAN (0.10 s): During atrial systole, tricuspid and bicuspid valves are open while semilunar valves remain closed." },
      { id: "avn-delay", name: "Atrioventricular Node (AVN) delays electrical impulse by ~0.10 s", emo: "⏱️", bin: "shm", why: "Atrial Systole & SAN (0.10 s): The AVN delay ensures the atria finish emptying completely into the ventricles before ventricular contraction begins." },
      { id: "myogenic", name: "Myogenic property — heart beats rhythmically even when nerves are cut", emo: "🔋", bin: "shm", why: "Atrial Systole & SAN (0.10 s): Cardiac muscle originates its own electrical beat inside the SAN without requiring brain nerve impulses to start each beat." },
      { id: "purkinje", name: "Impulse races down Bundle of His and Purkinje fibres from the apex upward", emo: "🌩️", bin: "periodic", why: "Ventricular Systole & 'LUB' (0.30 s): Purkinje fibres spread excitation from the bottom apex upward so ventricles squeeze blood toward the top exits." },
      { id: "lub-av", name: "First heart sound ('LUB') — bicuspid and tricuspid (AV) valves snap shut", emo: "🔊", bin: "periodic", why: "Ventricular Systole & 'LUB' (0.30 s): Rising ventricular pressure slams the AV valves shut, producing the low-pitched 'LUB' sound." },
      { id: "sl-open", name: "Aortic & pulmonary semilunar valves forced open (120 mmHg LV / 25 mmHg RV)", emo: "🚀", bin: "periodic", why: "Ventricular Systole & 'LUB' (0.30 s): High ventricular pressure forces open the semilunar valves and ejects 70 mL of blood into the aorta and pulmonary artery." },
      { id: "sys-bp", name: "Peak arterial systolic pressure (~120 mmHg) & radial wrist pulse wave", emo: "📈", bin: "periodic", why: "Ventricular Systole & 'LUB' (0.30 s): Left ventricular ejection stretches the elastic aorta, creating the 120 mmHg systolic peak and arterial pulse." },
      { id: "dub-sl", name: "Second heart sound ('DUB') — aortic & pulmonary semilunar valves snap shut", emo: "🔔", bin: "non", why: "General Diastole & 'DUB' (0.40 s): As the ventricles relax, arterial back-pressure snaps the semilunar valves shut, producing the sharp 'DUB' sound." },
      { id: "gen-dia", name: "General diastole (0.40 s) — all four chambers relax and refill passively", emo: "😌", bin: "non", why: "General Diastole & 'DUB' (0.40 s): For half of the 0.80 s cycle, both atria and ventricles relax while venous blood flows in from the venae cavae and pulmonary veins." },
      { id: "dia-bp", name: "Diastolic blood pressure (~80 mmHg) maintained by elastic recoil of aorta", emo: "📉", bin: "non", why: "General Diastole & 'DUB' (0.40 s): Elastic fibres in the aortic wall recoil during diastole, keeping arterial pressure around 80 mmHg." },
      { id: "vagus-slow", name: "Vagus nerve (parasympathetic acetylcholine) slows SAN rate during rest", emo: "🧘", bin: "non", why: "General Diastole & 'DUB' (0.40 s): While sympathetic nerves and adrenaline speed up the SAN, the vagus nerve releases acetylcholine to slow heart rate back toward 72 bpm." }
    ],

    // ---- 2. 3D Cardiac Cycle, Pacemaker & Haemodynamics Bench trials (HR in bpm, SV = 75 mL = 0.075 L) ----
    trials: [
      { label: "A", L: 60,  t: "1.00",  T: "75",  T2: "4.50" },
      { label: "B", L: 75,  t: "0.80",  T: "75",  T2: "5.63" },
      { label: "C", L: 100, t: "0.60",  T: "75",  T2: "7.50" },
      { label: "D", L: 120, t: "0.50",  T: "75",  T2: "9.00" },
      { label: "E", L: 150, t: "0.40",  T: "75",  T2: "11.25" }
    ],
    tOptions: ["1.00", "0.80", "0.60", "0.50", "0.40"],
    TOptions: ["50", "75", "90", "110", "125"],
    T2Options: ["4.50", "5.63", "7.50", "9.00", "11.25"],

    // ---- 3. 0.80-Second Cardiac Cycle & Conduction Explorer pins (at 75 bpm) ----
    pins: [
      { frac: -1.0, label: "0.00 s · SAN Fires in Right Atrium (Myogenic Pacemaker)", emo: "⚡", x: "ECG P-Wave Starts", v: "SAN in Upper RA Wall", a: "Myogenic Depolarisation", ke: "Atria Excited First", pe: "No Brain Nerve Needed", note: "The Sinoatrial Node (SAN) in the upper right atrial wall spontaneously depolarises, sending an electrical wave across both atria." },
      { frac: -0.5, label: "0.00–0.10 s · Atrial Systole & AVN 0.10 s Delay", emo: "⏱️", x: "Duration = 0.10 s", v: "AV Valves OPEN · SL CLOSED", a: "AVN Delays Impulse 0.10 s", ke: "Atria Contract", pe: "Ventricles Top Up (EDV)", note: "Both atria contract for 0.10 s to top up the ventricles through open tricuspid and bicuspid valves, while the Atrioventricular Node (AVN) delays the impulse so atria finish emptying before ventricles contract." },
      { frac: 0.0,  label: "0.10–0.15 s · Bundle of His → Purkinje + First Sound ('LUB')", emo: "🔊", x: "ECG QRS Complex · S1 'LUB'", v: "AV Valves SNAP SHUT", a: "Chordae Pulled Taut", ke: "'LUB' = AV Closure", pe: "Apex-Up Contraction", note: "The impulse races down the interventricular septum via the Bundle of His and up the ventricular walls via Purkinje fibres. Ventricular pressure rises above atrial pressure, snapping the bicuspid and tricuspid valves shut ('LUB'!)." },
      { frac: 0.5,  label: "0.15–0.40 s · Ventricular Systole Ejection (120/25 mmHg)", emo: "🚀", x: "Total Vent. Systole = 0.30 s", v: "AV CLOSED · SL FORCED OPEN", a: "P_sys = 120 mmHg (LV)", ke: "70 mL Ejected", pe: "Arterial Pulse Wave", note: "Semilunar valves open as left ventricular pressure reaches 120 mmHg (and right reaches 25 mmHg), ejecting 70 mL of blood into the aorta and pulmonary artery." },
      { frac: 1.0,  label: "0.40–0.80 s · General Diastole + Second Sound ('DUB')", emo: "🔔", x: "Duration = 0.40 s · S2 'DUB'", v: "SL SNAP SHUT · AV OPEN", a: "P_dia = 80 mmHg (Recoil)", ke: "'DUB' = Semilunar Closure", pe: "Passive Refilling", note: "As the ventricles relax, arterial back-pressure snaps the aortic and pulmonary semilunar valves shut ('DUB'!). All four chambers then rest and refill for 0.40 s while aortic elastic recoil sustains 80 mmHg diastolic pressure." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "What is meant by the statement that mammalian cardiac muscle is <strong>myogenic</strong>?",
      o: [
        "It requires a motor nerve impulse from the cerebrum to initiate every single heartbeat",
        "Its rhythmic contraction originates spontaneously within the heart muscle itself (at the sinoatrial node) without requiring external nervous stimulation",
        "It fatigues rapidly whenever lactic acid accumulates",
        "It consists of smooth, unstriated muscle fibres with no mitochondria"
      ],
      a: 1,
      e: "<strong>Myogenic</strong> means the heartbeat originates within the cardiac muscle itself (specifically the <strong>sinoatrial node, SAN</strong>); autonomic nerves and hormones only modify the rate.",
      src: "WAEC-style"
    },
    {
      q: "Where is the natural <strong>pacemaker</strong> (Sinoatrial Node, SAN) of the mammalian heart located?",
      o: [
        "In the muscular wall of the left ventricle near the apex",
        "In the upper wall of the right atrium near the entrance of the superior vena cava",
        "On the cusps of the bicuspid (mitral) valve",
        "Inside the arch of the aorta"
      ],
      a: 1,
      e: "The <strong>Sinoatrial Node (SAN)</strong> is embedded in the upper wall of the <strong>right atrium</strong> close to the opening of the superior vena cava.",
      src: "JAMB-style"
    },
    {
      q: "Which of the following gives the correct sequential pathway of the electrical impulse through the heart’s conduction system?",
      o: [
        "AVN → SAN → Purkinje fibres → Bundle of His",
        "SAN → Atrial myocardium → AVN → Bundle of His → Purkinje fibres → Ventricular myocardium",
        "Bundle of His → SAN → AVN → Purkinje fibres",
        "Purkinje fibres → Bundle of His → AVN → SAN"
      ],
      a: 1,
      e: "The pacemaker wave starts at the <strong>SAN</strong>, spreads across both atria, pauses ~0.10 s at the <strong>AVN</strong>, travels down the septal <strong>Bundle of His</strong>, and fans upward through <strong>Purkinje fibres</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Why does the <strong>Atrioventricular Node (AVN)</strong> delay the electrical impulse by approximately <strong>0.10 second</strong> before passing it to the ventricles?",
      o: [
        "To allow the atria to finish contracting and empty their blood completely into the ventricles before the ventricles begin to contract",
        "To allow blood to flow backward from the aorta into the left ventricle",
        "To give the semilunar valves time to dissolve",
        "To cool down the blood in the lungs"
      ],
      a: 0,
      e: "Without the ~0.10 s <strong>AVN delay</strong>, the atria and ventricles would contract simultaneously, preventing complete ventricular filling.",
      src: "JAMB-style"
    },
    {
      q: "The first heart sound (<strong>'LUB'</strong>) and the second heart sound (<strong>'DUB'</strong>) heard through a stethoscope are caused respectively by the closure of:",
      o: [
        "Semilunar valves ('LUB') and atrioventricular valves ('DUB')",
        "Bicuspid and tricuspid (AV) valves ('LUB') and aortic and pulmonary semilunar valves ('DUB')",
        "Venae cavae ('LUB') and coronary arteries ('DUB')",
        "Pericardial membranes ('LUB') and chordae tendineae ('DUB')"
      ],
      a: 1,
      e: "<strong>'LUB' (S1)</strong> is produced when the <strong>tricuspid and bicuspid (AV) valves</strong> snap shut at the start of ventricular systole; <strong>'DUB' (S2)</strong> is produced when the <strong>semilunar valves</strong> snap shut at the start of ventricular diastole.",
      src: "WAEC-style"
    },
    {
      q: "During the <strong>ventricular systole</strong> phase (0.30 s) of the cardiac cycle, what is the state of the heart valves?",
      o: [
        "Both AV valves and semilunar valves are wide open",
        "Both AV valves and semilunar valves are tightly closed throughout ejection",
        "Bicuspid and tricuspid (AV) valves are closed, while aortic and pulmonary semilunar valves are forced open",
        "Bicuspid and tricuspid (AV) valves are open, while semilunar valves are closed"
      ],
      a: 2,
      e: "During <strong>ventricular systole</strong>, high ventricular pressure holds the <strong>AV valves closed</strong> (preventing backflow into atria) and pushes the <strong>semilunar valves open</strong> (ejecting blood into the aorta and pulmonary artery).",
      src: "NECO-style"
    },
    {
      q: "If a healthy student has a resting heart rate of <strong>75 beats per minute</strong>, what is the total duration of ONE complete cardiac cycle?",
      o: ["0.40 second", "0.80 second", "1.25 seconds", "7.5 seconds"],
      a: 1,
      e: "Cycle duration <code>T = 60 s ÷ HR = 60 ÷ 75 = 0.80 s</code> (comprising <code>0.10 s</code> atrial systole + <code>0.30 s</code> ventricular systole + <code>0.40 s</code> general diastole).",
      src: "JAMB-style"
    },
    {
      q: "In a normal adult blood pressure reading of <strong>120/80 mmHg</strong> measured over the brachial artery with a sphygmomanometer, the number <strong>120</strong> and the number <strong>80</strong> represent respectively:",
      o: [
        "Diastolic pressure (120 mmHg) and systolic pressure (80 mmHg)",
        "Systolic pressure during ventricular contraction (120 mmHg) and diastolic pressure during ventricular relaxation (80 mmHg)",
        "Right atrial pressure (120 mmHg) and left atrial pressure (80 mmHg)",
        "Heart rate (120 bpm) and stroke volume (80 mL)"
      ],
      a: 1,
      e: "<strong>Systolic pressure (120 mmHg)</strong> is the peak arterial pressure during left ventricular contraction; <strong>diastolic pressure (80 mmHg)</strong> is the minimum arterial pressure during ventricular relaxation.",
      src: "WAEC-style"
    },
    {
      q: "A patient’s blood pressure is recorded as <strong>135/90 mmHg</strong>. Calculate the patient’s <strong>Pulse Pressure (PP)</strong> and <strong>Mean Arterial Pressure (MAP = P_dia + PP/3)</strong>.",
      o: [
        "PP = 45 mmHg; MAP = 105 mmHg",
        "PP = 225 mmHg; MAP = 112.5 mmHg",
        "PP = 45 mmHg; MAP = 90 mmHg",
        "PP = 30 mmHg; MAP = 100 mmHg"
      ],
      a: 0,
      e: "Pulse pressure <code>PP = P_sys − P_dia = 135 − 90 = 45 mmHg</code>. Mean arterial pressure <code>MAP = 90 + (45 ÷ 3) = 90 + 15 = 105 mmHg</code>.",
      src: "JAMB-style"
    },
    {
      q: "Why can you feel a rhythmic <strong>pulse</strong> when you press your fingers lightly over the <strong>radial artery</strong> at the wrist, but NOT when you press over a superficial vein on the back of your hand?",
      o: [
        "Veins contain no blood during ventricular systole",
        "Arteries receive high-pressure surges of blood directly from the left ventricle and have elastic walls that expand and recoil with each beat, whereas pressure and pulsatility are damped out in capillaries before blood reaches veins",
        "Veins have thicker muscular walls than arteries",
        "Red blood cells dissolve before entering veins"
      ],
      a: 1,
      e: "The <strong>pulse</strong> is the rhythmic expansion and elastic recoil of an arterial wall following each left ventricular systole; friction in narrow arterioles and capillaries smooths out the pressure wave before veins.",
      src: "WAEC-style"
    },
    {
      q: "Which hormone and autonomic nerve increase heart rate and stroke volume during a 400 m race or sudden fright ('fight-or-flight' response)?",
      o: [
        "Insulin and the vagus nerve",
        "Adrenaline (epinephrine) from the adrenal medulla and sympathetic accelerator nerves",
        "Thyroxine and the optic nerve",
        "Acetylcholine from the parasympathetic vagus nerve"
      ],
      a: 1,
      e: "<strong>Sympathetic nerves</strong> (releasing noradrenaline) and circulating <strong>adrenaline</strong> stimulate the SAN and myocardium; the <strong>parasympathetic vagus nerve</strong> (releasing acetylcholine) slows the heart.",
      src: "JAMB-style"
    },
    {
      q: "Why does the Purkinje fibre network conduct the electrical impulse to the <strong>apex</strong> (bottom tip) of the ventricles first before spreading upward along the ventricular walls?",
      o: [
        "Because the aorta and pulmonary artery exit at the bottom apex of the heart",
        "So that ventricular contraction squeezes blood from the bottom apex upward toward the aortic and pulmonary semilunar exit valves at the top of the ventricles",
        "To force the tricuspid valve open into the right atrium",
        "To stop blood from entering the coronary arteries"
      ],
      a: 1,
      e: "The great arteries (aorta and pulmonary artery) exit from the <strong>superior base (top)</strong> of the ventricles, so contracting from the <strong>inferior apex upward</strong> wrings blood cleanly out into the arteries.",
      src: "WAEC-style"
    }
  ];
})();
