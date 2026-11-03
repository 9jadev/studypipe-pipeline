---
slug: ss2-phy-simple-harmonic-motion
title: Simple Harmonic Motion & the Simple Pendulum
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
duration_min: 80
version: 2
---

# Simple Harmonic Motion & *the Simple Pendulum*

- **Eyebrow:** Lesson 01 · Practical + inquiry · 80 minutes
- **Guiding Question:** Why does a pendulum keep steady time even as its swing dies down — and how can a piece of string measure gravity in Lagos?
- **Objectives:**
  1. **01** · Classify periodic motions into **simple harmonic motion (SHM)** and non-SHM, and state the defining condition $a = -\omega^2 x$.
  2. **02** · Define **amplitude ($A$)**, **period ($T$)**, **frequency ($f$)** and **angular frequency ($\omega$)**, and use $\omega = 2\pi f = 2\pi / T$.
  3. **03** · Carry out the **simple pendulum practical**, record $t$ for $20$ oscillations to find $T$ and $T^2$, and explain why **length $L$** — not mass or small release angle — controls the period.
  4. **04** · Calculate **displacement, velocity, acceleration, energy** and **acceleration due to gravity ($g$)** from $T = 2\pi\sqrt{L/g}$ and the slope of an $L$–$T^2$ graph.
  5. **05** · State WAEC/NECO **precautions in the past tense** and analyse systematic vs random errors in pendulum timing.

---

## 0. Warm-up · Do Now (5 min)
1. **Define linear acceleration and state its SI unit.**
   → Acceleration is the **rate of change of velocity with time** ($a = \Delta v / t$), measured in **metres per second squared ($\text{m s}^{-2}$)**.
2. **State the formulas for kinetic energy ($\text{KE}$) and gravitational potential energy ($\text{PE}$).**
   → $\text{KE} = \tfrac{1}{2}mv^2$ and $\text{PE} = mgh$, both measured in **joules ($\text{J}$)**.
3. **Convert $80.0\text{ cm}$ into metres and find its square root to 3 significant figures.**
   → $80.0\text{ cm} = \mathbf{0.800\text{ m}}$, and $\sqrt{0.800} = \mathbf{0.894\text{ m}^{1/2}}$.
4. **Why must you keep your line of sight perpendicular to a metre rule scale when taking a reading?**
   → To prevent **parallax error**, which causes readings to be consistently too high or too low.

---

## 1. Wonder · The Story & Wonder Wall (8 min)

### 3D Story (`#story-stage`, scene key: `story`)
- **Beat 1 (Yaba Market Stall):** Kunle points at a tall pendulum wall clock on Mama Ngozi's stall: *"Mama! This regulator clock we bought for our school hall loses eight minutes every single hour!"*
- **Beat 2 (Another opinion):** Mrs Adeyemi chimes in: *"I told them the brass bob is too light! Put a heavier lead weight on it so gravity pulls it faster."*
- **Beat 3 (Mama Ngozi's worry):** Mama Ngozi frowns: *"Or maybe you didn't pull the pendulum wide enough when starting it? I sold Clock A and Clock B from the same workshop!"*
- **Beat 4 (Inspecting Clock A and Clock B):** Mama Ngozi points at the two clock pendulums side by side: *"Look closely: both have the same brass bob, yet Clock B swings noticeably slower than Clock A."*
- **Beat 5 (The puzzle):** Mama Ngozi wonders: *"Could it be the weight of the bob, the starting angle, or the position of the regulating nut on the rod?"*
- **Beat 6 (At the UNILAG Metrology & Physics Lab):** Dr Amaka stands by a retort stand and stopwatch: *"Don't guess — bring both pendulums to the lab bench. With a metre rule and twenty swings, we'll prove what really controls time!"*

### Wonder Wall (`#wonder`)
- **Prompt:** Before we run the experiment, what is *your* prediction? Does changing the **mass of the bob**, the **starting angle**, or the **length of the string** change the time of one swing?
- **Seed notes:**
  - *"I think a heavier bob falls faster, so its period T should be shorter — Kunle"*
  - *"If you pull it to a wider angle, it has further to travel, so maybe it takes longer? — Halima"*
  - *"Wait — if it pulls wider, doesn't it also speed up more on the way down? — Chidi"*
  - *"Why do WAEC practical instructions always tell us to time 20 oscillations instead of just 1? — Zainab"*

---

## 2. Investigate · Motion Sort & 3D Pendulum Lab (25 min)

### 2A. Everyday Motions Sort (`#sort`)
Students sort 12 motions into three bins:
- **Simple Harmonic Motion (`shm`):**
  1. Pendulum bob swinging through $8^\circ$ (`🕰️`)
  2. Mass bouncing gently on a lab spiral spring (`🔩`)
  3. Vibrating prong of a tuning fork (`🎵`)
  4. Loaded test-tube bobbing up and down in water (`🧪`)
- **Periodic, but NOT SHM (`periodic`):**
  5. Ceiling fan blades spinning at constant speed (`🌀`)
  6. Earth orbiting the Sun once every year (`🌍`)
  7. Rubber ball bouncing repeatedly on a concrete floor (`🏀`)
  8. Heartbeat pulse repeating 72 times a minute (`💓`)
- **Not periodic (`non`):**
  9. Mango falling straight from a branch to the ground (`🥭`)
  10. Danfo bus braking to a stop at Ojuelegba (`🚌`)
  11. Stone thrown across a school football field (`🪨`)
  12. Rainwater flowing steadily down a gutter (`🌧️`)

### 2B. 3D Simple Pendulum Practical (`#practical`, scene key: `bench`)
- **4-Step Method Cards:**
  1. **Clamp & measure to the centre of gravity:** Clamp the thread between two split cork halves so the bend point is sharp, and measure length $L$ down to the **centre of the brass bob**.
  2. **Place the fiducial mark at equilibrium:** Set a vertical pointer right at the centre of the swing ($x = 0$) where the bob moves fastest.
  3. **Displace through a small angle ($\theta \le 10^\circ$):** Pull the bob aside slightly and release gently without pushing so it swings in one vertical plane.
  4. **Time $20$ complete oscillations:** Let 2–3 swings settle, then time $N = 20$ full to-and-fro cycles ($A \to B \to A$) and compute $T = t/20$ and $T^2$.
- **3D Pendulum Bench (`#bench-stage`):**
  - Test 5 lengths:
    - Trial A: $L = 0.40\text{ m}$ → $t = 25.38\text{ s}$, $T = 1.27\text{ s}$, $T^2 = 1.61\text{ s}^2$
    - Trial B: $L = 0.60\text{ m}$ → $t = 31.08\text{ s}$, $T = 1.55\text{ s}$, $T^2 = 2.42\text{ s}^2$
    - Trial C: $L = 0.80\text{ m}$ → $t = 35.88\text{ s}$, $T = 1.79\text{ s}$, $T^2 = 3.22\text{ s}^2$
    - Trial D: $L = 1.00\text{ m}$ → $t = 40.12\text{ s}$, $T = 2.01\text{ s}$, $T^2 = 4.02\text{ s}^2$
    - Trial E: $L = 1.20\text{ m}$ → $t = 43.96\text{ s}$, $T = 2.20\text{ s}$, $T^2 = 4.83\text{ s}^2$
  - Includes a **Mass & Angle Myth-Buster toggle** ($50\text{ g}$ vs $100\text{ g}$, and $6^\circ$ vs $10^\circ$) showing immediately that $T$ stays unchanged!
- **Interactive Results Table (`#results-table`)** + **Expected Results & $L$–$T^2$ Slope Box (`#expected`)** + **5 Analysis Questions (`.aq` with locked `.solution`)**.

---

## 3. Make sense · Core Concepts & 3D Vector/Energy Zoom (15 min)

### 3A. Defining Simple Harmonic Motion (`#concepts`)
- **Definition of SHM:** A periodic to-and-fro motion in which the **acceleration $a$ is directly proportional to the displacement $x$ from a fixed equilibrium point, and is always directed towards that point**:
  $$a = -\omega^2 x$$
- **Key Quantities & Equations:**
  - $\omega = 2\pi f = \frac{2\pi}{T}\quad (\text{rad s}^{-1})$
  - $v = \omega\sqrt{A^2 - x^2}\quad\text{and}\quad v_{\max} = \omega A\text{ at }x = 0$
  - $|a| = \omega^2 |x|\quad\text{and}\quad a_{\max} = \omega^2 A\text{ at }x = \pm A$
  - $T = 2\pi\sqrt{\frac{L}{g}}\implies T^2 = \left(\frac{4\pi^2}{g}\right)L$
  - Loaded spiral spring: $T = 2\pi\sqrt{\frac{m}{k}}$
- **Comparison Table (`#props-table`):** Contrasting Equilibrium Centre ($x = 0$), Mid-Swing ($x = \pm 0.5A$), and Extreme Ends ($x = \pm A$) across Displacement, Speed $v$, Acceleration $a$, Restoring Force $F$, Kinetic Energy $\text{KE}$, and Potential Energy $\text{PE}$.
- **Interactive Swing Position Explorer (`#ph-explorer`):** Tap 7 pins from $-A$ to $+A$ along the swing track to see instantaneous values of $x, v, a, \text{KE}, \text{PE}$.

### 3B. 3D Vector & Energy Zoom Stage (`#neutralise`, scene key: `zoom`)
- Interactive 3D close-up of the oscillating bob showing:
  - Live 3D **velocity arrow ($\vec{v}$, teal)** and **restoring acceleration arrow ($\vec{a}$, amber)** attached to the bob.
  - Live 3D **energy columns** ($\text{KE}$, $\text{PE}$, and $E_{\text{total}}$) rising and falling in real time.
  - Mode switcher: **Undamped SHM** | **Freeze at Centre ($x=0$)** | **Freeze at Extreme ($x=+A$)** | **Air Damping ON**.

---

## 4. Apply · Worked Examples, The Bridge & Quiz (20 min)

### 4A. Four Step-by-Step Worked Examples (`#examples`)
- **Example 1:** Finding period $T$, frequency $f$, angular frequency $\omega$, and length $L$ from $20$ oscillations timed in $36.0\text{ s}$ ($g = 9.8\text{ m s}^{-2}$).
- **Example 2:** Calculating maximum speed $v_{\max}$, maximum acceleration $a_{\max}$, and speed at $x = 0.06\text{ m}$ for an oscillator with $A = 0.10\text{ m}$ and $\omega = 4.0\text{ rad s}^{-1}$.
- **Example 3:** Determining acceleration due to gravity $g$ from the slope of an $L$–$T^2$ practical graph ($\Delta L = 0.70\text{ m}$, $\Delta T^2 = 2.84\text{ s}^2 \implies g = 9.73\text{ m s}^{-2}$).
- **Example 4:** Proportional scaling (effect of quadrupling pendulum length $L \to 4L$ on period $T$ and frequency $f$).

### 4B. The Bridge: Cracking Mama Ngozi's Clock Case (`#bridge`)
- Interactive dual-pendulum test (`#vinegar-test`):
  - **Step 1:** Test if adding weight to Clock B's bob fixes the slow swing → *No change! Both still differ.*
  - **Step 2:** Time 10 swings of Clock A ($L = 0.99\text{ m} \to 20.0\text{ s}$, exact $2.00\text{ s}$ period) vs Clock B ($L = 1.15\text{ m} \to 21.5\text{ s}$, losing time!).
  - **Step 3:** Turn the regulating nut to shorten Clock B's effective length from $1.15\text{ m}$ up to $0.99\text{ m}$ → **Case solved!** Both clocks now tick in perfect lockstep.

### 4C. 12-Question WAEC/NECO/JAMB Quiz (`#quiz`)
- Populated from `03-questions.md`.

---

## 5. Reflect & Assignment (10 min + 40 min home)
- **Self-Assessment Rubric (`1–4`):** 5 *"I can…"* statements.
- **Exit Ticket (2 marks):** Why didn't making the clock bob heavier fix Kunle's slow school clock, and what adjustment actually works?
- **Blank-Page Recall** (7 key points) + **Wonder Wall review**.
- **Home Assignment (`#assignment`):** Part A (Home thread-and-stone pendulum investigation) + Part B (30-mark structured exam questions `b1`–`b8` with locked solutions) + **Teacher Notes (`#teacher-notes`)** with 80-minute timetable (including 45–50 min movement break) and Transversal Competences (`L1`, `L4`, `L6`).
