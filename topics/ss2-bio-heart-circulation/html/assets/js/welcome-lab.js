/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab · The Human Heart and Blood Circulation
   Built from the catalog kit `heart-circulation` (assets/js/heart-kit.js, window.HeartKit v2).
   Three modes:
     heart    live four-chamber cut-away with blood flow; tap a chamber, valve or vessel → what it receives and sends
     circuit  HeartKit.circuitCompare: human (double) · tilapia (single) · cockroach (open)
     pace     SAN → AVN → His → Purkinje wave; slider 60–180 bpm → cycle time = 60 ÷ bpm, valve state
   Exposes window.StudyLab for StudyNarrator:
     rect(part) · highlight(part) · setMode(m) · select(key) · circuit(c) · bpm(n) · state() · reset()
   Emits CustomEvent "lab:result" with { mode, ... } after every learner action.
   Classic script, no modules, fully offline.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("lab-canvas");
  var labRoot = document.getElementById("lab");
  if (!canvas || !labRoot) return;

  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    k1: $("hud-k1"), v1: $("hud-v1"), k2: $("hud-k2"), v2: $("hud-v2"), k3: $("hud-k3"), v3: $("hud-v3"),
    info: $("lab-info"), toast: $("endpoint-toast"), legend: $("lab-legend"), fallback: $("lab-fallback"),
    bpm: $("lab-bpm"), bpmOut: $("lab-bpm-out")
  };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function emit(detail) { document.dispatchEvent(new CustomEvent("lab:result", { detail: detail })); }
  function setHud(k1, v1, k2, v2, k3, v3) {
    ui.k1.textContent = k1; ui.v1.textContent = v1;
    ui.k2.textContent = k2; ui.v2.textContent = v2;
    ui.k3.textContent = k3; ui.v3.textContent = v3;
  }
  var toastTimer = null;
  function toast(html) {
    if (!ui.toast) return;
    ui.toast.innerHTML = html;
    ui.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast.classList.remove("show"); }, 4200);
  }

  /* ---------------- facts shown in the HUD (from 02-lesson.md, Lessons 02 to 04) ---------------- */
  var INFO = {
    ra:  { name: "Right atrium", recv: "Oxygen-poor blood from the two venae cavae", send: "Right ventricle, through the tricuspid valve", say: "It receives oxygen-poor blood from the venae cavae and sends it to the right ventricle", job: "A thin-walled collecting chamber: it only has to squeeze blood a few centimetres down into the right ventricle." },
    rv:  { name: "Right ventricle", recv: "From the right atrium", send: "Lungs, through the pulmonary artery", say: "It receives blood from the right atrium and pumps it to the lungs through the pulmonary artery", job: "Pushes oxygen-poor blood a short way to the nearby lungs, so its wall is thicker than an atrium's but thinner than the left ventricle's." },
    la:  { name: "Left atrium", recv: "Oxygen-rich blood from the four pulmonary veins", send: "Left ventricle, through the bicuspid valve", say: "It receives oxygen-rich blood from the pulmonary veins and sends it to the left ventricle", job: "A thin-walled collecting chamber for blood returning fresh from the lungs." },
    lv:  { name: "Left ventricle", recv: "From the left atrium", send: "Whole body, through the aorta", say: "It receives blood from the left atrium and pumps it to the whole body through the aorta", job: "Drives blood through every organ from scalp to toes, so it has the thickest wall, about three times the right ventricle's." },
    lvWall: { name: "Left ventricle wall", recv: "Squeezes the blood in the left ventricle", send: "Pushes it into the aorta", say: "It is the thickest wall in the heart, about three times as thick as the right ventricle wall, because it must push blood all round the body", job: "About three times as thick as the right ventricle wall, because the left side must push blood round the whole body." },
    rvWall: { name: "Right ventricle wall", recv: "Squeezes the blood in the right ventricle", send: "Pushes it to the lungs", say: "It is thinner than the left wall, because the lungs are close by", job: "Thinner than the left wall, because the lungs are close by." },
    septum: { name: "Septum", recv: "Nothing: it is a wall of heart muscle", send: "Keeps the two sides apart", say: "It is the muscle partition that stops oxygen-rich and oxygen-poor blood from mixing", job: "The muscle partition between the right and left sides: oxygen-poor and oxygen-rich blood never mix." },
    tricuspid: { name: "Tricuspid valve", recv: "Right atrium side", send: "Opens to the right ventricle", say: "It sits between the right atrium and the right ventricle and has three flaps", job: "Three flaps held by chordae tendineae. It lets blood go down into the right ventricle and shuts so it cannot return." },
    bicuspid: { name: "Bicuspid (mitral) valve", recv: "Left atrium side", send: "Opens to the left ventricle", say: "It sits between the left atrium and the left ventricle and has two flaps", job: "Two flaps held by chordae tendineae. It lets blood go down into the left ventricle and shuts so it cannot return." },
    aorticValve: { name: "Aortic semilunar valve", recv: "Left ventricle side", send: "Opens into the aorta", say: "It has three half-moon pockets at the base of the aorta", job: "Three half-moon pockets at the base of the aorta. They snap shut when the ventricle relaxes and make the second sound, dub." },
    pulmValve: { name: "Pulmonary semilunar valve", recv: "Right ventricle side", send: "Opens into the pulmonary artery", say: "It has three half-moon pockets at the base of the pulmonary artery", job: "Three half-moon pockets at the base of the pulmonary artery. They stop blood falling back into the right ventricle." },
    aorta: { name: "Aorta", recv: "From the left ventricle", send: "To the whole body", say: "It leaves the left ventricle and carries oxygen-rich blood to the whole body", job: "The largest artery. The coronary arteries are the first branches to leave it." },
    pulmonaryArtery: { name: "Pulmonary artery", recv: "From the right ventricle", send: "To the lungs", say: "It leaves the right ventricle and carries oxygen-poor blood to the lungs. It is the one artery with oxygen-poor blood", job: "The only artery that carries oxygen-poor blood." },
    pulmonaryVeins: { name: "Pulmonary veins (four)", recv: "From the lungs", send: "Into the left atrium", say: "There are four of them. They bring oxygen-rich blood from the lungs to the left atrium. They are the veins with oxygen-rich blood", job: "The veins with oxygen-rich blood." },
    venaCava: { name: "Venae cavae", recv: "From the head, arms, trunk and legs", send: "Into the right atrium", say: "The superior vena cava and the inferior vena cava bring oxygen-poor blood from the body into the right atrium", job: "Superior vena cava from head, neck and arms; inferior vena cava from trunk and legs." },
    coronary: { name: "Coronary arteries", recv: "From the aorta, just beyond its valve", send: "Over the heart muscle", say: "They branch from the aorta and feed the heart muscle itself", job: "Feed the heart muscle itself. A blockage starves the muscle beyond it: a heart attack." },
    san: { name: "SAN (pacemaker)", recv: "Starts every beat by itself", send: "A wave over both atria", say: "It is the pacemaker, in the wall of the right atrium. It starts each beat and sends a wave over both atria", job: "In the wall of the right atrium. It starts each beat inside the heart, so cardiac muscle is myogenic." },
    avn: { name: "AVN", recv: "The wave from the atria", send: "A short pause, then the bundle of His", say: "It holds the wave for a moment so the atria can finish emptying before the ventricles squeeze", job: "Holds the wave for a moment so the atria finish emptying before the ventricles contract." }
  };
  var CIRC = {
    double: { name: "Human (double)", trips: "2 trips through the heart", pressure: "High at the body",
      info: "<b>Human: double circulation.</b> In one full circuit blood passes through the heart <b>twice</b>: heart to lungs and back, then heart to body and back. The second push keeps the pressure high, and four chambers keep oxygen-rich and oxygen-poor blood apart.",
      say: "The human heart pushes blood twice in every circuit: once to the lungs and once to the body. The second push keeps the pressure high at the body, and the four chambers keep the two kinds of blood apart." },
    single: { name: "Tilapia (single)", trips: "1 trip through the heart", pressure: "Reduced at the body",
      info: "<b>Tilapia: single circulation.</b> The two-chambered heart pumps blood to the gills, then on round the body. Blood passes through the heart <b>once</b> per circuit and loses pressure across the gills, so it reaches the body slowly.",
      say: "A tilapia has a two-chambered heart and blood passes through it only once per circuit. The pressure drops across the gills, so the blood reaches the body at a reduced pressure." },
    open: { name: "Cockroach (open)", trips: "Tubular heart, no closed loop", pressure: "Low at the organs",
      info: "<b>Cockroach: open circulation.</b> A tubular heart pushes haemolymph into the body cavity, where it simply bathes the organs at low pressure before returning. It is not kept inside vessels the whole way.",
      say: "A cockroach has open circulation. A tubular heart pushes haemolymph into the body cavity, where it bathes the organs slowly at low pressure. It is not kept inside vessels." }
  };

  var state = { mode: "heart", circ: "double", bpm: 72, picked: null, picks: {}, circs: {}, bpms: {} };

  /* ---------------- UI wiring (works even without WebGL) ---------------- */
  var modeTabs = labRoot.querySelectorAll(".lab-modes [data-mode]");
  var ctrls = labRoot.querySelectorAll(".lab-ctrl");
  modeTabs.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode"), true); }); });
  labRoot.querySelectorAll("[data-pick]").forEach(function (b) { b.addEventListener("click", function () { select(b.getAttribute("data-pick"), true); }); });
  labRoot.querySelectorAll("[data-circ]").forEach(function (b) { b.addEventListener("click", function () { setCirc(b.getAttribute("data-circ"), true); }); });
  if (ui.bpm) {
    ui.bpm.addEventListener("input", function () { setBpm(+ui.bpm.value, false); });
    ui.bpm.addEventListener("change", function () { setBpm(+ui.bpm.value, true); });
  }

  /* ---------------- 3D setup ---------------- */
  var gl = typeof THREE !== "undefined" && window.HeartKit && window.SceneKit && SceneKit.hasWebGL();
  var renderer, scene, camera, groups = {}, parts = {}, hiNarr, hiPick, heartObj, circObj;
  var view = { yaw: 0.0, pitch: 0.2, dist: 6, target: null, lastTouch: -1e9 };
  var visible = true;

  if (gl) {
    try { build3D(); } catch (err) { gl = false; if (window.console) console.warn("StudyLab: 3D disabled", err); }
  }
  if (!gl && ui.fallback) { ui.fallback.hidden = false; canvas.style.visibility = "hidden"; }

  function build3D() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    canvas.style.touchAction = "pan-y";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1.6, 0.1, 100);
    view.target = new THREE.Vector3();
    scene.add(new THREE.HemisphereLight(0xdfeaff, 0x1a1424, 0.9));
    var key = new THREE.DirectionalLight(0xfff4e2, 1.25); key.position.set(3, 6, 5); scene.add(key);
    var rim = new THREE.DirectionalLight(0x7cc4ff, 0.7); rim.position.set(-4, 3, -4); scene.add(rim);
    var fill = new THREE.PointLight(0xffd8b0, 0.6, 20); fill.position.set(0, 1.5, 4); scene.add(fill);

    /* one heart serves the "heart" and "pace" modes */
    var gH = new THREE.Group(); scene.add(gH);
    heartObj = HeartKit.heart({ bpm: 72, mode: "both", labels: false });
    gH.add(heartObj);
    var gC = new THREE.Group(); scene.add(gC);
    circObj = HeartKit.circuitCompare({ mode: "double" });
    gC.add(circObj);
    groups.heart = gH; groups.pace = gH; groups.circuit = gC;

    var P = heartObj.userData.parts;
    // generic shells first, specific parts last, so the most specific tag wins when parts overlap
    tag(P.ra, "ra"); tag(P.rv, "rv"); tag(P.la, "la"); tag(P.lv, "lv");
    tag(P.rvWall, "rvWall"); tag(P.lvWall, "lvWall"); tag(P.septum, "septum");
    tag(P.aorta, "aorta"); tag(P.pulmonaryArtery, "pulmonaryArtery"); tag(P.pulmonaryVeins, "pulmonaryVeins"); tag(P.venaCava, "venaCava");
    tag(P.coronary, "coronary");
    tag(P.aorticValve, "aorticValve"); tag(P.pulmValve, "pulmValve");
    tag(P.tricuspid, "tricuspid"); tag(P.bicuspid, "bicuspid");
    tag(P.san, "san"); tag(P.avn, "avn");
    ["ra", "rv", "la", "lv", "septum", "lvWall", "rvWall", "tricuspid", "bicuspid", "aorticValve", "pulmValve", "aorta", "pulmonaryArtery",
      "pulmonaryVeins", "venaCava", "coronary", "san", "avn", "his", "purkinje"].forEach(function (k) { reg(k, P[k]); });
    reg("heart", gH); reg("pace", gH); reg("circuit", gC); reg("pump", circObj.userData.parts.pump);

    hiNarr = HeartKit.makeHighlighter(scene);
    hiPick = HeartKit.makeHighlighter(scene);

    // pointer: horizontal drag turns the view; a tap picks a part
    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY, yaw: view.yaw, drag: false }; view.lastTouch = performance.now(); });
    canvas.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.drag && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) down.drag = true;
      if (down.drag) { view.yaw = Math.max(-0.95, Math.min(0.95, down.yaw - dx * 0.008)); view.lastTouch = performance.now(); }
    });
    function up(e) {
      if (!down) return;
      var wasDrag = down.drag || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8;
      down = null;
      if (!wasDrag && e.type === "pointerup") pickAt(e);
    }
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", function () { if (down && down.drag) down = null; });

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
    window.addEventListener("resize", resize);
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
    resize();
    requestAnimationFrame(frame);
  }

  function reg(name, obj) { if (obj) parts[name] = obj; }
  function tag(obj, key) { if (obj) obj.traverse(function (o) { o.userData.pk = key; }); }

  /* ---------------- camera framing ---------------- */
  var fitBox = null;
  function deepVisible(o) { for (; o; o = o.parent) if (!o.visible) return false; return true; }
  function refit() {
    var g = groups[state.mode]; if (!g) return;
    var box = new THREE.Box3();
    g.updateWorldMatrix(true, true);
    g.traverse(function (o) {
      if (o.isMesh && o.geometry && !(o.userData && o.userData.isLabel) && deepVisible(o) && !(o.material && o.material.visible === false)) {
        o.geometry.computeBoundingBox();
        var b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
        box.union(b);
      }
    });
    if (box.isEmpty()) return;
    fitBox = box;
    resize();
  }
  function resize() {
    if (!renderer) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (!fitBox) return;
    var size = fitBox.getSize(new THREE.Vector3()), c = fitBox.getCenter(new THREE.Vector3());
    var vFov = THREE.MathUtils.degToRad(camera.fov), hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    var dH = (size.y / 2 + 0.25) / Math.tan(vFov / 2), dW = (size.x / 2 + 0.2) / Math.tan(hFov / 2);
    view.dist = Math.max(dH, dW) * 1.06 + size.z * 0.5;
    view.target.copy(c);
  }

  /* ---------------- picking ---------------- */
  var ray = typeof THREE !== "undefined" ? new THREE.Raycaster() : null, ndc = typeof THREE !== "undefined" ? new THREE.Vector2() : null;
  var PRIORITY = ["san", "avn", "tricuspid", "bicuspid", "aorticValve", "pulmValve", "coronary", "aorta", "pulmonaryArtery", "pulmonaryVeins", "venaCava", "septum", "lvWall", "rvWall", "lv", "rv", "la", "ra"];
  function pickAt(e) {
    if (state.mode === "circuit") return;
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObject(groups.heart, true).filter(function (h) { return h.object.userData.pk && deepVisible(h.object); });
    if (!hits.length) return;
    var best = null, bp = 99;
    hits.forEach(function (h) { var p = PRIORITY.indexOf(h.object.userData.pk); if (p >= 0 && p < bp) { bp = p; best = h; } });
    if (!best) return;
    showPick(best.object.userData.pk, true);
  }

  function showPick(key, fromLearner) {
    var f = INFO[key]; if (!f) return;
    state.picked = key; state.picks[key] = true;
    var count = Object.keys(state.picks).length;
    setHud("Selected part", f.name, "Receives from", f.recv, "Sends to", f.send);
    ui.info.innerHTML = "<b>" + f.name + "</b><br>" + f.job;
    if (gl && hiPick) hiPick.set(parts[key] || null);
    if (fromLearner) {
      toast("<b>" + f.name + "</b><span class=\"mono\">" + f.recv + " → " + f.send + "</span>");
      emit({ mode: "heart", part: key, name: f.name, recv: f.recv, send: f.send, say: f.say, count: count });
    }
  }

  // select(): buttons + narrator
  function select(key, fromLearner) {
    if (state.mode !== "heart") setMode("heart", false);
    showPick(key, !!fromLearner);
  }

  /* ---------------- modes ---------------- */
  var LEGEND = {
    heart: '<span><i class="sw sw-blue"></i>Oxygen-poor blood</span><span><i class="sw sw-red"></i>Oxygen-rich blood</span>',
    circuit: '<span><i class="sw sw-blue"></i>Oxygen-poor blood</span><span><i class="sw sw-red"></i>Oxygen-rich blood</span>',
    pace: '<span><i class="sw sw-spark"></i>Pacemaker wave</span><span><i class="sw sw-red"></i>Left side</span><span><i class="sw sw-blue"></i>Right side</span>'
  };
  function setMode(m, fromLearner) {
    if (!LEGEND[m]) return;
    state.mode = m;
    modeTabs.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m ? "true" : "false"); });
    ctrls.forEach(function (c) { c.hidden = c.getAttribute("data-for") !== m; });
    if (ui.legend) ui.legend.innerHTML = LEGEND[m];
    if (ui.toast) ui.toast.classList.remove("show");
    if (gl) {
      groups.heart.visible = m !== "circuit";
      groups.circuit.visible = m === "circuit";
      if (hiPick) hiPick.set(null);
      if (m === "heart") heartObj.userData.setState({ mode: "both", bpm: 72 });
      if (m === "pace") heartObj.userData.setState({ mode: "pace", bpm: state.bpm });
      refit();
    }
    if (m === "heart") {
      setHud("Mode", "Section with blood flow", "Selected part", "Tap a part", "Receives from → sends to", "—");
      ui.info.innerHTML = "Tap a chamber, valve or vessel (or a button) to see what it receives and where it sends blood. The heart on screen faces you, so the patient's right side is on your <b>left</b>.";
      state.picked = null;
    } else if (m === "circuit") {
      setCirc(state.circ, false);
    } else {
      setBpm(state.bpm, false);
    }
    if (fromLearner) emit({ mode: m, switched: true });
  }

  function setCirc(c, fromLearner) {
    var d = CIRC[c]; if (!d) return;
    state.circ = c; state.circs[c] = true;
    if (state.mode !== "circuit") setMode("circuit", false);
    labRoot.querySelectorAll("[data-circ]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-circ") === c ? "true" : "false"); });
    setHud("Circulation", d.name, "Trips through the heart", d.trips, "Pressure", d.pressure);
    ui.info.innerHTML = d.info;
    if (gl) { circObj.userData.setState({ mode: c }); refit(); }
    if (fromLearner) {
      toast("<b>" + d.name + "</b><span class=\"mono\">" + d.trips + " · " + d.pressure + "</span>");
      emit({ mode: "circuit", circ: c, name: d.name, trips: d.trips, pressure: d.pressure, say: d.say, count: Object.keys(state.circs).length });
    }
  }

  function cycleText(b) { return (60 / b).toFixed(2) + " s"; }
  function setBpm(b, fromLearner) {
    b = Math.max(60, Math.min(180, Math.round(b) || 72));
    state.bpm = b; state.bpms[b] = true;
    if (state.mode !== "pace") setMode("pace", false);
    if (ui.bpm) ui.bpm.value = b;
    if (ui.bpmOut) ui.bpmOut.textContent = b + " bpm";
    if (gl) heartObj.userData.setState({ mode: "pace", bpm: b });
    setHud("Heart rate", b + " beats per minute", "Cycle time = 60 ÷ " + b, cycleText(b), "Valves", valveText());
    ui.info.innerHTML = "The SAN starts every beat, the AVN holds the wave briefly, then the bundle of His and Purkinje fibres carry it up the ventricle walls. One cycle lasts <b>60 ÷ " + b + " = " + (60 / b).toFixed(2) + " s</b>. Faster beats mean a shorter cycle.";
    if (fromLearner) {
      var fast = b >= 120;
      emit({ mode: "pace", bpm: b, cycle: +(60 / b).toFixed(2), fast: fast, count: Object.keys(state.bpms).length });
    }
  }
  function valveText() {
    if (!gl) return "AV valves open, then shut";
    var bt = heartObj.userData.beat;
    if (bt.avOpen > 0.5) return "AV valves open (filling)";
    if (bt.slOpen > 0.5) return "AV shut, exits open";
    return "All valves shut";
  }

  /* ---------------- frame loop ---------------- */
  var clock = typeof THREE !== "undefined" ? new THREE.Clock() : null, hudT = 0;
  function frame() {
    requestAnimationFrame(frame);
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (!visible || document.hidden) return;
    var o = state.mode === "circuit" ? circObj : heartObj;
    if (o && o.userData.update) o.userData.update(reduceMotion ? 0 : dt, t);
    if (state.mode === "pace") { hudT += dt; if (hudT > 0.2) { hudT = 0; ui.v3.textContent = valveText(); } }
    // gentle sway when the learner is not touching the lab
    if (!reduceMotion && performance.now() - view.lastTouch > 4000) view.yaw += (Math.sin(t * 0.25) * 0.28 - view.yaw) * Math.min(1, dt * 0.6);
    var d = view.dist, T = view.target;
    camera.position.set(T.x + Math.sin(view.yaw) * Math.cos(view.pitch) * d, T.y + Math.sin(view.pitch) * d, T.z + Math.cos(view.yaw) * Math.cos(view.pitch) * d);
    camera.lookAt(T);
    hiNarr.update(dt, t); hiPick.update(dt, t);
    renderer.render(scene, camera);
  }

  /* ---------------- narrator hooks ---------------- */
  var HEART_PARTS = { heart: 1, ra: 1, rv: 1, la: 1, lv: 1, septum: 1, lvWall: 1, rvWall: 1, tricuspid: 1, bicuspid: 1, aorticValve: 1, pulmValve: 1, aorta: 1, pulmonaryArtery: 1, pulmonaryVeins: 1, venaCava: 1, coronary: 1 };
  var PACE_PARTS = { pace: 1, san: 1, avn: 1, his: 1, purkinje: 1 };
  function modeOf(part) { return HEART_PARTS[part] ? "heart" : PACE_PARTS[part] ? "pace" : (part === "circuit" || part === "pump") ? "circuit" : null; }
  function rect(part) {
    var cr = canvas.getBoundingClientRect();
    var whole = { left: cr.left, top: cr.top, width: cr.width, height: cr.height };
    if (!gl || !part || !parts[part]) return whole;
    var obj = parts[part];
    obj.updateWorldMatrix(true, true);
    var b = new THREE.Box3().setFromObject(obj);
    if (b.isEmpty()) return whole;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, v = new THREE.Vector3();
    for (var i = 0; i < 8; i++) {
      v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera);
      var x = cr.left + (v.x * 0.5 + 0.5) * cr.width, y = cr.top + (-v.y * 0.5 + 0.5) * cr.height;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    minX = Math.max(cr.left, minX - 8); minY = Math.max(cr.top, minY - 8);
    maxX = Math.min(cr.right, maxX + 8); maxY = Math.min(cr.bottom, maxY + 8);
    if (maxX - minX < 40) { var cx = (minX + maxX) / 2; minX = cx - 20; maxX = cx + 20; }
    if (maxY - minY < 40) { var cy = (minY + maxY) / 2; minY = cy - 20; maxY = cy + 20; }
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
  }
  function highlight(part) {
    if (!part) { if (hiNarr) hiNarr.set(null); return; }
    var m = modeOf(part);
    if (m && m !== state.mode) setMode(m, false);
    if (gl && hiNarr && part !== "heart" && part !== "pace" && part !== "circuit") hiNarr.set(parts[part] || null);
    else if (hiNarr) hiNarr.set(null);
  }

  window.StudyLab = {
    rect: rect,
    highlight: highlight,
    setMode: function (m) { setMode(m, false); },
    select: function (k) { select(k, false); },
    circuit: function (c) { setCirc(c, false); },
    bpm: function (b) { setBpm(b, false); },
    state: function () { return { mode: state.mode, circ: state.circ, bpm: state.bpm, picked: state.picked, picks: Object.keys(state.picks).length, phase: "run" }; },
    reset: function () { state.picks = {}; state.circs = {}; state.bpms = {}; state.circ = "double"; state.bpm = 72; setMode("heart", false); },
    openTapFor: function () {}
  };

  setMode("heart", false);
})();
