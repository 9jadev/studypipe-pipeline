/* =========================================================
   StudyPipe · Narrator — guided, spoken tour of the welcome page
   Uses the browser's built-in Web Speech API (speechSynthesis).
   Works offline with the voices installed on the device; if no
   voice is available it falls back to timed captions.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var synth = window.speechSynthesis || null;
  var speechOK = !!(synth && window.SpeechSynthesisUtterance);

  // ---------------------------------------------------------
  // 1. THE SCRIPT  (say = spoken + captioned text)
  //    target: CSS selector | [selectors] (union) | {lab:"part"}
  //    cue: short label pointing at the target
  //    sparkle: burst of sparkles when the step starts
  //    action: something the page does while the narrator speaks
  //    wait: "lab" pauses the tour until the learner finishes a titration
  // ---------------------------------------------------------
  var CFG = window.NARRATION || { script: [] };
  var SCRIPT = CFG.script;
  if (!SCRIPT.length) return;
  // lessons with a Do Now warm-up (retrieval-bank.js) get a chapter for it after "Welcome"
  if (document.getElementById("donow-list") && !SCRIPT.some(function (c) { return c.title === "Do Now"; })) {
    SCRIPT.splice(1, 0, { title: "Do Now", steps: [
      { say: "Before the story, a quick warm-up. These questions come from earlier lessons. Answer each one from memory first, then reveal the answer and mark yourself honestly.", target: "#donow-list", cue: "Do Now", sparkle: true },
      { say: "Your turn. Reveal and mark each question. I'll carry on when you've marked them all, or you can press Next.", target: "#donow-list", wait: "donow" }
    ] });
  }

  // ---------------------------------------------------------
  // 2. DOM: dock, spotlight, cue, sparkle layer
  // ---------------------------------------------------------
  var ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6h2v12H7zM10.5 12l8.5 6V6z"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 6h2v12h-2zM13.5 12L5 18V6z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    minimize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
  };

  var totalSteps = SCRIPT.reduce(function (n, c) { return n + c.steps.length; }, 0);
  var minutes = Math.max(1, Math.round(SCRIPT.reduce(function (n, c) {
    return n + c.steps.reduce(function (m, s) { return m + s.say.split(/\s+/).length; }, 0);
  }, 0) / 150));

  var dock = document.createElement("div");
  dock.className = "narr-dock";
  dock.innerHTML =
    '<button class="narr-pill" type="button" data-act="start" aria-label="Play the guided, narrated tour">' +
      '<span class="narr-avatar">' + ICON.mic + '</span>' +
      '<span class="txt">' + (CFG.pillTitle || "Play guided tour") + '<small>Your narrator · about ' + minutes + ' min</small></span>' +
    '</button>' +
    '<div class="narr-mini" role="region" aria-label="Narrator (minimised)">' +
      '<button class="narr-mini-open" type="button" data-act="expand" aria-label="Expand narrator">' +
        '<span class="narr-avatar" aria-hidden="true">' + ICON.mic + '</span>' +
        '<span class="txt"><b class="mini-title">Welcome</b><small class="mini-count"></small></span>' +
      '</button>' +
      '<button class="narr-btn primary" type="button" data-act="toggle" aria-label="Pause">' + ICON.pause + '</button>' +
      '<button class="narr-btn" type="button" data-act="expand" aria-label="Expand narrator">' + ICON.expand + '</button>' +
    '</div>' +
    '<div class="narr-panel" role="region" aria-label="Narrator">' +
      '<button class="narr-grip" type="button" data-act="minimize" aria-label="Minimise narrator"></button>' +
      '<div class="narr-top">' +
        '<span class="narr-avatar" aria-hidden="true">' + ICON.mic + '</span>' +
        '<div class="narr-body">' +
          '<div class="narr-chapter"><span class="title">Welcome</span><span class="count"></span></div>' +
          '<p class="narr-caption" aria-live="polite"></p>' +
          '<div class="narr-wait"><i></i><span class="wait-text">Your turn!</span></div>' +
        '</div>' +
        '<div class="narr-win">' +
          '<button class="narr-btn narr-close" type="button" data-act="minimize" aria-label="Minimise narrator (keeps playing)" title="Minimise (keeps playing)">' + ICON.minimize + '</button>' +
          '<button class="narr-btn narr-close" type="button" data-act="close" aria-label="Close narrator" title="Close">' + ICON.close + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="narr-controls">' +
        '<button class="narr-btn" type="button" data-act="prev" aria-label="Previous">' + ICON.prev + '</button>' +
        '<button class="narr-btn primary" type="button" data-act="toggle" aria-label="Pause">' + ICON.pause + '</button>' +
        '<button class="narr-btn" type="button" data-act="next" aria-label="Next">' + ICON.next + '</button>' +
        '<button class="narr-btn" type="button" data-act="replay" aria-label="Replay this line">' + ICON.replay + '</button>' +
        '<span class="narr-spacer"></span>' +
        '<select class="narr-speed" aria-label="Speaking speed"><option value="0.85">0.85×</option><option value="0.95" selected>1×</option><option value="1.1">1.15×</option><option value="1.25">1.3×</option></select>' +
        '<button class="narr-btn" type="button" data-act="settings" aria-label="Voice settings" aria-expanded="false">' + ICON.gear + '</button>' +
      '</div>' +
      '<div class="narr-settings">' +
        '<label>Voice <select class="narr-voice" aria-label="Narrator voice"></select></label>' +
        '<span class="narr-note"></span>' +
      '</div>' +
      '<div class="narr-track" role="group" aria-label="Chapters"></div>' +
    '</div>';
  document.body.appendChild(dock);

  var spot = document.createElement("div"); spot.className = "narr-spot"; spot.setAttribute("aria-hidden", "true");
  var cue = document.createElement("div"); cue.className = "narr-cue"; cue.setAttribute("aria-hidden", "true");
  cue.innerHTML = '<span class="hand"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M5 13l7 7 7-7"/></svg></span><span class="label"></span>';
  var sparkLayer = document.createElement("div"); sparkLayer.className = "sparkle-layer"; sparkLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(spot); document.body.appendChild(cue); document.body.appendChild(sparkLayer);

  var el = {
    title: dock.querySelector(".narr-chapter .title"),
    count: dock.querySelector(".narr-chapter .count"),
    caption: dock.querySelector(".narr-caption"),
    wait: dock.querySelector(".narr-wait"),
    waitText: dock.querySelector(".narr-wait .wait-text"),
    toggles: dock.querySelectorAll('[data-act="toggle"]'),
    miniTitle: dock.querySelector(".mini-title"),
    miniCount: dock.querySelector(".mini-count"),
    mini: dock.querySelector(".narr-mini"),
    next: dock.querySelector('[data-act="next"]'),
    settingsBtn: dock.querySelector('[data-act="settings"]'),
    settings: dock.querySelector(".narr-settings"),
    voice: dock.querySelector(".narr-voice"),
    note: dock.querySelector(".narr-note"),
    speed: dock.querySelector(".narr-speed"),
    track: dock.querySelector(".narr-track")
  };

  SCRIPT.forEach(function (ch, i) {
    var b = document.createElement("button");
    b.type = "button"; b.title = ch.title; b.setAttribute("aria-label", "Chapter " + (i + 1) + ": " + ch.title);
    b.addEventListener("click", function () { go(i, 0, true); });
    el.track.appendChild(b);
  });

  // ---------------------------------------------------------
  // 3. Voices (Nigerian English en-NG strictly prioritised #1)
  // ---------------------------------------------------------
  var voices = [], voice = null;
  function isNigerianVoice(v) {
    if (!v) return false;
    var n = (v.name || "").toLowerCase(), l = (v.lang || "").toLowerCase();
    return /^en[_-]ng\b/.test(l) || /nigeria|nigerian|abeo|ezinne/.test(n);
  }
  function rankVoice(v) {
    var s = 0, n = (v.name || "").toLowerCase(), l = (v.lang || "").toLowerCase();
    if (isNigerianVoice(v)) s += 500;                   // #1 top priority: Nigerian English (en-NG)
    else if (/^en[_-](gh|ke|za|tz|ug|rw)\b/.test(l) || /ghana|kenya|south africa|asante|chilemba|leah|luke|thando|zuri/.test(n)) s += 200; // #2: African English
    else if (/^en[_-]gb\b/.test(l)) s += 60;            // #3: British English (WAEC standard)
    else if (/^en[_-]us\b/.test(l)) s += 15;
    if (v.localService) s += 100;                       // works offline
    if (l.indexOf("en") === 0) s += 50;
    if (/natural|neural|premium|enhanced/.test(n)) s += 15;
    if (/abeo|ezinne|daniel|serena|samantha|karen|moira|aria|jenny|libby|sonia|zira|hazel|susan/.test(n)) s += 10;
    if (/compact|novelty|whisper|bells|bad news|albert|zarvox|trinoids/.test(n)) s -= 60;
    return s;
  }
  function loadVoices() {
    if (!speechOK) return;
    var all = synth.getVoices() || [];
    var en = all.filter(function (v) { return /^en/i.test(v.lang) || isNigerianVoice(v); });
    voices = (en.length ? en : all).slice().sort(function (a, b) { return rankVoice(b) - rankVoice(a); });
    var saved = null, manual = null;
    try {
      saved = localStorage.getItem("sp-narrator-voice");
      manual = localStorage.getItem("sp-narrator-voice-manual");
    } catch (e) {}
    var savedMatch = voices.filter(function (v) { return v.name === saved; })[0];
    if (voices[0] && isNigerianVoice(voices[0]) && (!savedMatch || (!isNigerianVoice(savedMatch) && !manual))) {
      voice = voices[0];
    } else {
      voice = savedMatch || voices[0] || null;
    }
    el.voice.innerHTML = "";
    voices.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.name;
      var ngTag = isNigerianVoice(v) ? " ★ Nigerian English" : "";
      o.textContent = v.name + " (" + v.lang + ")" + ngTag + (v.localService ? " · offline" : " · needs internet");
      if (voice && v.name === voice.name) o.selected = true;
      el.voice.appendChild(o);
    });
    var hasNG = voices.some(isNigerianVoice);
    el.note.textContent = voices.length
      ? (hasNG ? "Nigerian English (en-NG) voice active · offline voices marked." : "Nigerian English (en-NG) prioritised · install en-NG in device TTS settings for local accent.")
      : "No voice found on this device. Captions will play on their own.";
  }
  if (speechOK) {
    loadVoices();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", loadVoices);
    else synth.onvoiceschanged = loadVoices;
  } else {
    el.note.textContent = "This browser can't speak aloud. Captions will play on their own.";
  }
  el.voice.addEventListener("change", function () {
    voice = voices.filter(function (v) { return v.name === el.voice.value; })[0] || voice;
    try {
      localStorage.setItem("sp-narrator-voice", voice ? voice.name : "");
      localStorage.setItem("sp-narrator-voice-manual", "1");
    } catch (e) {}
    if (state.playing) playStep();
  });
  var rate = 0.95;
  try { var r = parseFloat(localStorage.getItem("sp-narrator-rate")); if (r) { rate = r; el.speed.value = String(r); } } catch (e) {}
  el.speed.addEventListener("change", function () {
    rate = parseFloat(el.speed.value) || 0.95;
    try { localStorage.setItem("sp-narrator-rate", String(rate)); } catch (e) {}
    if (state.playing) playStep();
  });

  // ---------------------------------------------------------
  // 4. Engine
  // ---------------------------------------------------------
  var state = { ch: 0, st: 0, playing: false, open: false, mini: false, token: 0, waiting: false, transient: null };
  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function current() { return state.transient || SCRIPT[state.ch].steps[state.st]; }
  function stepNumber() {
    var n = 0;
    for (var i = 0; i < state.ch; i++) n += SCRIPT[i].steps.length;
    return n + state.st + 1;
  }

  function open() {
    if (state.open) return;
    state.open = true;
    dock.classList.add("open");
    document.body.classList.add("narr-active");
  }

  function close() {
    stopSpeech();
    state.playing = false; state.open = false; state.waiting = false; state.transient = null;
    setMini(false);
    dock.classList.remove("open", "speaking");
    document.body.classList.remove("narr-active");
    setTarget(null);
    clearSceneHighlights();
    detachWait();
    setWaiting(false);
  }

  // minimised: keeps talking, but frees the screen (no dimming, no auto-scroll)
  function setMini(m) {
    state.mini = m;
    dock.classList.toggle("mini", m);
    document.body.classList.toggle("narr-minimised", m);
  }
  function minimize() {
    if (!state.open || state.mini) return;
    setMini(true);
    spot.classList.remove("on"); cue.classList.remove("on");
    el.mini.querySelector(".narr-mini-open").focus({ preventScroll: true });
  }
  function expand() {
    if (!state.mini) return;
    setMini(false);
    var step = state.open && current();
    if (step) { scrollToTarget(step.target); setTarget(step.target, { cue: step.cue }); }
    dock.querySelector('.narr-win [data-act="minimize"]').focus({ preventScroll: true });
  }

  function setPlaying(p) {
    state.playing = p;
    Array.prototype.forEach.call(el.toggles, function (t) {
      t.innerHTML = p ? ICON.pause : ICON.play;
      t.setAttribute("aria-label", p ? "Pause" : "Play");
    });
    if (!p) dock.classList.remove("speaking");
  }

  function setWaiting(on) {
    el.wait.classList.toggle("on", on);
    el.next.classList.toggle("pulse-next", on);
    dock.classList.toggle("waiting", on);
    if (on) el.miniCount.textContent = "Your turn!";
    else if (state.open) updateChrome();
  }

  function stopSpeech() {
    state.token++;
    clearTimers();
    if (speechOK) { try { synth.cancel(); } catch (e) {} }
    stopWordTimer();
  }

  function go(ch, st, autoplay) {
    open();
    stopSpeech();
    state.transient = null; state.waiting = false; detachWait();
    state.ch = Math.max(0, Math.min(SCRIPT.length - 1, ch));
    setWaiting(false);
    state.st = Math.max(0, Math.min(SCRIPT[state.ch].steps.length - 1, st));
    if (autoplay !== false) setPlaying(true);
    playStep();
  }

  function next() {
    if (state.transient) { state.transient = null; }
    var c = SCRIPT[state.ch];
    if (state.st < c.steps.length - 1) go(state.ch, state.st + 1, state.playing);
    else if (state.ch < SCRIPT.length - 1) go(state.ch + 1, 0, state.playing);
    else finish();
  }
  function prev() {
    if (state.st > 0) go(state.ch, state.st - 1, state.playing);
    else if (state.ch > 0) go(state.ch - 1, SCRIPT[state.ch - 1].steps.length - 1, state.playing);
    else go(0, 0, state.playing);
  }
  function finish() {
    stopSpeech();
    setPlaying(false);
    renderCaption(CFG.finishText || "That's the end. Press play to hear it again.");
    el.title.textContent = el.miniTitle.textContent = "Tour complete";
    el.count.textContent = el.miniCount.textContent = "";
    el.mini.style.setProperty("--prog", 1);
    setTarget(null);
    clearSceneHighlights();
    state.ch = 0; state.st = 0;
    if (CFG.onFinish) CFG.onFinish();
  }

  function updateChrome() {
    var c = SCRIPT[state.ch];
    el.title.textContent = c.title;
    el.count.textContent = "· " + stepNumber() + "/" + totalSteps;
    el.miniTitle.textContent = c.title;
    if (!state.waiting) el.miniCount.textContent = "Step " + stepNumber() + " of " + totalSteps;
    el.mini.style.setProperty("--prog", stepNumber() / totalSteps);
    Array.prototype.forEach.call(el.track.children, function (b, i) {
      var p = i < state.ch ? 1 : i > state.ch ? 0 : (state.st + 1) / c.steps.length;
      b.style.setProperty("--p", p);
      b.setAttribute("aria-current", i === state.ch ? "step" : "false");
    });
  }

  function playStep() {
    var step = current();
    var token = ++state.token;
    clearTimers();
    stopWordTimer();
    if (speechOK) { try { synth.cancel(); } catch (e) {} }
    updateChrome();
    applyVisuals(step);
    renderCaption(step.say);
    if (!state.playing) return;

    var done = function () {
      if (token !== state.token) return;
      dock.classList.remove("speaking");
      markAllSaid();
      if (step.wait && !state.transient) { startWait(step.wait); return; }
      later(function () { if (token === state.token && state.playing) next(); }, 650);
    };

    var est = estimateMs(step.say);
    if (speechOK && voices.length) {
      // small delay after cancel() — some engines drop an utterance spoken immediately after it
      later(function () {
        if (token !== state.token) return;
        var sp = speakMap(step.say);
        var u = new SpeechSynthesisUtterance(sp.text);
        if (voice) { u.voice = voice; u.lang = voice.lang || "en-NG"; } else { u.lang = "en-NG"; }
        u.rate = rate; u.pitch = 1.02; u.volume = 1;
        var gotBoundary = false;
        u.onstart = function () {
          if (token !== state.token) return;
          dock.classList.add("speaking");
          startWordTimer(step.say, est, function () { return gotBoundary; });
        };
        u.onboundary = function (e) {
          if (token !== state.token) return;
          if (e.name && e.name !== "word") return;
          gotBoundary = true; stopWordTimer();
          highlightAt(sp.map ? (sp.map[e.charIndex] != null ? sp.map[e.charIndex] : e.charIndex) : e.charIndex);
        };
        u.onend = done;
        u.onerror = function (e) {
          if (token !== state.token) return;
          if (e && (e.error === "interrupted" || e.error === "canceled")) return;
          // fall back to captions for this line
          dock.classList.add("speaking");
          startWordTimer(step.say, est, function () { return false; });
          later(done, est);
        };
        synth.speak(u);
        // watchdog: some engines never fire onend
        later(function () { if (token === state.token) done(); }, est * 1.8 + 5000);
      }, 80);
    } else {
      dock.classList.add("speaking");
      startWordTimer(step.say, est, function () { return false; });
      later(done, est + 300);
    }
  }

  function estimateMs(text) {
    var words = text.split(/\s+/).length;
    return Math.round((words / (2.55 * (rate / 0.95))) * 1000) + 400;
  }

  // ---------- "your turn" waits ----------
  function speakNumber(n) { return n.toFixed(2).replace(".", " point "); }
  var BUILTIN_WAITS = {
    lab: {
      event: "lab:result", timeout: 75000,
      prompt: "Your turn! Try the lab. I'll continue when you reach the end-point, or press Next.",
      react: function (d) {
        if (!d) return { say: "No rush. You can come back to the lab any time. Let's keep going." };
        if (d.phase === "endpoint") return { say: "Brilliant! You stopped right at the end-point, at " + speakNumber(d.titre) + " cubic centimetres. That's exactly what a careful chemist does.", target: "#endpoint-toast", sparkle: true, cue: "Nailed it" };
        return { say: "Oops, you went past the end-point to " + speakNumber(d.titre) + " cubic centimetres. That's why we slow down near the end. Press reset and try again later.", target: "#endpoint-toast", cue: "Overshot" };
      }
    }
  };
  BUILTIN_WAITS.donow = {
    event: "kit:donow", timeout: 300000,
    prompt: "Your turn! Answer and mark each Do Now question. I'll continue when they're all marked.",
    filter: function (d) { return d.done === d.total; },
    already: function () {
      var cards = document.querySelectorAll("#donow-list .dn-card");
      var got = document.querySelectorAll('#donow-list .dn-card[data-m="2"]').length;
      return cards.length && document.querySelectorAll("#donow-list .dn-card[data-m]").length === cards.length ? { done: cards.length, got: got, total: cards.length } : null;
    },
    react: function (d) {
      if (!d) return { say: "No problem. You can come back to the Do Now at any time. Let's carry on." };
      if (d.got === d.total) return { say: "All " + d.total + " from memory. Brilliant! Now, the story.", target: "#donow-list", sparkle: true, cue: "Full marks" };
      return { say: "You remembered " + d.got + " out of " + d.total + ". That's useful to know. Use the revisit links for the others after the lesson. Now, the story.", target: "#donow-list", cue: d.got + " of " + d.total };
    }
  };
  var activeWait = null, waitHandler = null;
  function waitDef(name) { return (CFG.waits && CFG.waits[name]) || BUILTIN_WAITS[name] || null; }
  function detachWait() {
    if (activeWait && waitHandler) document.removeEventListener(activeWait.event, waitHandler);
    activeWait = null; waitHandler = null;
  }
  function startWait(name) {
    var w = waitDef(name);
    if (!w) { later(function () { if (state.playing) next(); }, 400); return; }
    detachWait();
    activeWait = w;
    state.waiting = true;
    el.waitText.textContent = w.prompt || "Your turn! Press Next when you're ready.";
    setWaiting(true);
    waitHandler = function (e) {
      if (!state.waiting) return;
      if (w.filter && !w.filter(e.detail || {})) return; // keep waiting until the learner gets it right
      resolveWait(e.detail || {});
    };
    document.addEventListener(w.event, waitHandler);
    var token = state.token;
    if (w.timeout) later(function () { if (token === state.token && state.waiting) resolveWait(null); }, w.timeout);
    // already done before the narrator got here?
    if (w.already) { var pre = w.already(); if (pre) later(function () { if (token === state.token && state.waiting) resolveWait(pre); }, 600); }
  }
  function resolveWait(detail) {
    var w = activeWait;
    detachWait();
    state.waiting = false;
    setWaiting(false);
    var r = w && w.react ? w.react(detail) : null;
    if (!r) { setPlaying(true); next(); return; }
    if (typeof r === "string") r = { say: r, target: current() && current().target };
    state.transient = r;
    setPlaying(true);
    playStep();
  }
  function clearSceneHighlights() {
    if (window.StudyLab) window.StudyLab.highlight(null);
    if (window.StudyScenes) Object.keys(window.StudyScenes).forEach(function (k) {
      var sc = window.StudyScenes[k]; if (sc && sc.highlight) sc.highlight(null);
    });
  }

  // ---------------------------------------------------------
  // 5. Captions with word-by-word highlight
  // ---------------------------------------------------------
  var words = [], wordTimer = null;
  function renderCaption(text) {
    el.caption.innerHTML = "";
    el.caption.scrollTop = 0;
    words = [];
    var re = /\S+/g, m, last = 0;
    while ((m = re.exec(text))) {
      if (m.index > last) el.caption.appendChild(document.createTextNode(text.slice(last, m.index)));
      var s = document.createElement("span");
      s.className = "w"; s.textContent = m[0];
      el.caption.appendChild(s);
      words.push({ start: m.index, end: m.index + m[0].length, el: s });
      last = m.index + m[0].length;
    }
    if (last < text.length) el.caption.appendChild(document.createTextNode(text.slice(last)));
  }
  // read subscript shorthand aloud the way a teacher would: "I_g" → "I g", "r_eq" → "r equivalent",
  // "I_main" → "I main", "V_AJ" → "V A J". map[] points each spoken character back to the caption text.
  function speakMap(s) {
    if (!s || s.indexOf("_") < 0) return { text: s, map: null };
    var RE = /([A-Za-zηρΔ])_(\{([^}]+)\}|[A-Za-z0-9]+)/g, out = "", map = [], last = 0, m, i;
    while ((m = RE.exec(s))) {
      for (i = last; i <= m.index; i++) { map.push(i); out += s[i]; }
      var k = m[3] || m[2];
      var w = " " + (k === "eq" ? "equivalent" : (/^[a-z]{3,}$/.test(k) ? k : k.split("").join(" "))) + " ";
      for (i = 0; i < w.length; i++) map.push(m.index + 1);
      out += w;
      last = m.index + m[0].length;
    }
    for (i = last; i < s.length; i++) { map.push(i); out += s[i]; }
    return { text: out, map: map };
  }

  function highlightAt(ci) {
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      w.el.classList.toggle("said", w.end <= ci);
      var now = ci >= w.start && ci < w.end;
      w.el.classList.toggle("now", now);
      if (now) keepInView(w.el);
    }
  }
  // long lines scroll inside the caption box (small phones show ~3 lines)
  function keepInView(span) {
    var cap = el.caption, top = span.offsetTop, h = span.offsetHeight;
    if (top < cap.scrollTop || top + h > cap.scrollTop + cap.clientHeight) cap.scrollTop = Math.max(0, top - h);
  }
  function markAllSaid() { words.forEach(function (w) { w.el.classList.add("said"); w.el.classList.remove("now"); }); }
  function startWordTimer(text, ms, hasBoundary) {
    stopWordTimer();
    var startT = performance.now();
    var lens = words.map(function (w) { return w.end - w.start + 2; });
    var total = lens.reduce(function (a, b) { return a + b; }, 0);
    wordTimer = setInterval(function () {
      if (hasBoundary()) { stopWordTimer(); return; }
      var k = (performance.now() - startT) / ms, acc = 0;
      for (var i = 0; i < words.length; i++) {
        acc += lens[i] / total;
        if (k < acc) { highlightAt(words[i].start); return; }
      }
      markAllSaid();
    }, 90);
  }
  function stopWordTimer() { if (wordTimer) { clearInterval(wordTimer); wordTimer = null; } }

  // ---------------------------------------------------------
  // 6. Visuals: scroll, spotlight, cue, actions, sparkles
  // ---------------------------------------------------------
  var target = null, spotRect = null;

  function navH() { return 80; }
  function dockH() { return state.open ? dock.getBoundingClientRect().height + 24 : 24; }

  function resolveRect(t) {
    if (!t) return null;
    if (t.lab) {
      return window.StudyLab ? window.StudyLab.rect(t.lab) : rectOf("#lab");
    }
    if (t.scene) {
      var sc = window.StudyScenes && window.StudyScenes[t.scene];
      return sc && sc.rect ? sc.rect(t.part) : null;
    }
    var sels = Array.isArray(t) ? t : [t];
    var r = null;
    sels.forEach(function (s) {
      var n = typeof s === "string" ? document.querySelector(s) : s;
      if (!n) return;
      var b = n.getBoundingClientRect();
      if (!b.width && !b.height) return;
      r = r ? {
        left: Math.min(r.left, b.left), top: Math.min(r.top, b.top),
        right: Math.max(r.right, b.right), bottom: Math.max(r.bottom, b.bottom)
      } : { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
    });
    if (!r) return null;
    return { left: r.left, top: r.top, width: r.right - r.left, height: r.bottom - r.top };
  }
  function rectOf(sel) { var n = document.querySelector(sel); if (!n) return null; var b = n.getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height }; }

  function scrollToTarget(t) {
    var r = resolveRect(t);
    if (!r) return;
    var top = navH(), bottom = window.innerHeight - dockH();
    var avail = bottom - top;
    var delta;
    if (r.height <= avail - 40) delta = (r.top + r.height / 2) - (top + avail / 2);
    else delta = r.top - top - 16;
    if (Math.abs(delta) < 24) return;
    window.scrollBy({ top: delta, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function setTarget(t, opts) {
    target = t;
    opts = opts || {};
    if (!t) { spot.classList.remove("on"); cue.classList.remove("on"); return; }
    cue.querySelector(".label").textContent = opts.cue || "";
    cue.classList.toggle("on", !!opts.cue);
  }

  function applyVisuals(step) {
    // lab glow
    clearSceneHighlights();
    if (window.StudyLab) window.StudyLab.highlight(step.target && step.target.lab ? step.target.lab : null);
    if (step.target && step.target.scene && window.StudyScenes && window.StudyScenes[step.target.scene]) {
      var sc = window.StudyScenes[step.target.scene];
      if (sc.highlight) sc.highlight(step.target.part);
    }
    // actions
    if (step.action) runAction(step.action);
    if (state.mini) { setTarget(null); return; } // the learner is browsing; expand() restores the spotlight
    // scroll then spotlight
    scrollToTarget(step.target);
    setTarget(step.target, { cue: step.cue });
    if (step.sparkle && !reduceMotion) {
      later(function () { var r = resolveRect(step.target); if (r) burst(r, 22); }, 650);
    }
  }

  function runAction(a) {
    var parts = a.split(":"), kind = parts[0], arg = parseInt(parts[1], 10);
    if (CFG.actions && CFG.actions[kind]) { CFG.actions[kind](parts.slice(1).join(":"), later); return; }
    if (kind === "labDemo" && window.StudyLab) {
      var s = window.StudyLab.state();
      if (s.phase !== "run") window.StudyLab.reset();
      later(function () { window.StudyLab.openTapFor(2600); }, 700);
    } else if (kind === "combo") {
      var key = parts.slice(1).join(":");
      var tab = document.querySelector('.combo-tab[data-combo="' + key + '"], .combo[data-combo="' + key + '"]');
      if (tab) tab.click();
    } else if (kind === "flip") {
      document.querySelectorAll(".myth").forEach(function (m, i) {
        if (i === arg) m.setAttribute("aria-pressed", "true");
        if (arg === -1) m.setAttribute("aria-pressed", "false");
      });
    }
  }

  // spotlight follow loop
  function loop() {
    requestAnimationFrame(loop);
    if (!state.open || state.mini || !target) return;
    var r = resolveRect(target);
    if (!r) { spot.classList.remove("on"); return; }
    var pad = 14;
    var vw = window.innerWidth, vh = window.innerHeight;
    var t = { left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2 };
    // clamp to the viewport (very tall targets)
    var top = Math.max(t.top, 6), bottom = Math.min(t.top + t.height, vh - 6);
    var left = Math.max(t.left, 6), right = Math.min(t.left + t.width, vw - 6);
    var visible = bottom - top > 30 && right - left > 30;
    spot.classList.toggle("on", visible);
    if (!visible) { cue.classList.remove("on"); return; }
    t = { left: left, top: top, width: right - left, height: bottom - top };
    if (!spotRect) spotRect = t;
    var k = reduceMotion ? 1 : 0.18;
    spotRect = {
      left: spotRect.left + (t.left - spotRect.left) * k,
      top: spotRect.top + (t.top - spotRect.top) * k,
      width: spotRect.width + (t.width - spotRect.width) * k,
      height: spotRect.height + (t.height - spotRect.height) * k
    };
    spot.style.left = spotRect.left + "px"; spot.style.top = spotRect.top + "px";
    spot.style.width = spotRect.width + "px"; spot.style.height = spotRect.height + "px";
    // cue placement: above if room, otherwise below
    if (cue.querySelector(".label").textContent) {
      var cw = cue.offsetWidth || 120, chh = cue.offsetHeight || 32;
      var cx = Math.min(Math.max(spotRect.left + 8, 8), vw - cw - 8);
      var above = spotRect.top - chh - 12 > navH();
      var cy = above ? spotRect.top - chh - 10 : Math.min(spotRect.top + spotRect.height + 10, vh - chh - dockH());
      cue.style.left = cx + "px"; cue.style.top = cy + "px";
      cue.classList.toggle("below", !above);
      cue.classList.add("on");
    }
  }
  requestAnimationFrame(loop);

  // ---------- Sparkles ----------
  var STAR = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c.6 5.6 2.6 9.4 12 12-9.4 2.6-11.4 6.4-12 12-.6-5.6-2.6-9.4-12-12 9.4-2.6 11.4-6.4 12-12z"/></svg>';
  var COLORS = ["#ffd36b", "#ffb23f", "#ff8cbc", "#ff3d8b", "#3ee6c4", "#ffffff", "#7cc4ff"];
  function spawn(x, y, opts) {
    var s = document.createElement("span");
    s.className = "sparkle" + (opts.twinkle ? " twinkle" : "");
    var size = opts.size || (8 + Math.random() * 14);
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.setProperty("--s", size + "px");
    s.style.setProperty("--c", COLORS[(Math.random() * COLORS.length) | 0]);
    s.style.setProperty("--dx", (opts.dx || 0) + "px");
    s.style.setProperty("--dy", (opts.dy || 0) + "px");
    s.style.setProperty("--dur", (opts.dur || 0.9 + Math.random() * 0.6) + "s");
    s.innerHTML = STAR;
    sparkLayer.appendChild(s);
    setTimeout(function () { s.remove(); }, ((opts.dur || 1.5) + 0.2) * 1000);
  }
  // burst from the edges of a viewport rect
  function burst(r, n) {
    if (reduceMotion) return;
    var sx = window.scrollX || window.pageXOffset, sy = window.scrollY || window.pageYOffset;
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < (n || 18); i++) {
      var edge = Math.random();
      var px = r.left + Math.random() * r.width, py = r.top + Math.random() * r.height;
      if (edge < 0.25) py = r.top; else if (edge < 0.5) py = r.top + r.height; else if (edge < 0.75) px = r.left; else px = r.left + r.width;
      var ang = Math.atan2(py - cy, px - cx), dist = 30 + Math.random() * 70;
      spawn(px + sx, py + sy, { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, dur: 0.9 + Math.random() * 0.7 });
    }
  }
  function twinkleOn(node) {
    var b = node.getBoundingClientRect();
    var sx = window.scrollX || window.pageXOffset, sy = window.scrollY || window.pageYOffset;
    for (var i = 0; i < 3; i++) {
      var x = b.left + (Math.random() < 0.5 ? -6 : b.width + 6) * (Math.random() < 0.3 ? 0.5 : 1);
      x = b.left + Math.random() * b.width;
      var y = b.top + (Math.random() < 0.5 ? 0 : b.height);
      spawn(x + sx, y + sy, { twinkle: true, size: 10 + Math.random() * 10, dur: 1.4 + Math.random() * 0.6 });
    }
  }

  // hooks: burst + glint when they first enter view, then gentle twinkles
  var hooks = Array.prototype.slice.call(document.querySelectorAll("[data-hook]"));
  var inView = new Set();
  if ("IntersectionObserver" in window && !reduceMotion) {
    var seen = new WeakSet();
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          inView.add(e.target);
          if (!seen.has(e.target)) {
            seen.add(e.target);
            setTimeout(function () {
              burst(e.target.getBoundingClientRect(), 16);
              e.target.classList.remove("hook-glint"); void e.target.offsetWidth; e.target.classList.add("hook-glint");
            }, 500);
          }
        } else inView.delete(e.target);
      });
    }, { threshold: 0.35 });
    hooks.forEach(function (h) { hio.observe(h); });
    setInterval(function () {
      if (document.hidden || !inView.size) return;
      var arr = Array.from(inView);
      twinkleOn(arr[(Math.random() * arr.length) | 0]);
    }, 1800);
  }

  // ---------------------------------------------------------
  // 7. Wiring
  // ---------------------------------------------------------
  dock.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "start") { go(state.ch, state.st, true); }
    else if (act === "close") close();
    else if (act === "minimize") minimize();
    else if (act === "expand") expand();
    else if (act === "toggle") {
      if (state.playing) { stopSpeech(); setPlaying(false); markAllSaid(); }
      else { setPlaying(true); if (state.waiting) { resolveWait(null); } else playStep(); }
    }
    else if (act === "next") { if (state.waiting) resolveWait(null); else next(); }
    else if (act === "prev") prev();
    else if (act === "replay") { setPlaying(true); playStep(); }
    else if (act === "settings") {
      var on = !el.settings.classList.contains("on");
      el.settings.classList.toggle("on", on);
      b.setAttribute("aria-expanded", on ? "true" : "false");
    }
  });
  document.querySelectorAll("[data-tour]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); setMini(false); go(0, 0, true); });
  });
  // touch: swipe the panel down to minimise, swipe the mini bar up to expand
  var touchY = null, touchX = null;
  dock.addEventListener("touchstart", function (e) {
    if (e.target.closest("select, .narr-track, .narr-caption")) { touchY = null; return; }
    touchY = e.touches[0].clientY; touchX = e.touches[0].clientX;
  }, { passive: true });
  dock.addEventListener("touchend", function (e) {
    if (touchY == null) return;
    var dy = e.changedTouches[0].clientY - touchY, dx = Math.abs(e.changedTouches[0].clientX - touchX);
    touchY = null;
    if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return;
    if (dy > 0 && !state.mini) minimize();
    else if (dy < 0 && state.mini) expand();
  }, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.open) close();
  });
  // stop talking if the tab is hidden; Chrome otherwise queues odd speech
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && state.playing) { stopSpeech(); setPlaying(false); }
  });
  window.addEventListener("pagehide", function () { if (speechOK) synth.cancel(); });

  // a gentle invitation once the page settles
  setTimeout(function () {
    if (state.open || reduceMotion) return;
    var pill = dock.querySelector(".narr-pill");
    burst(pill.getBoundingClientRect(), 14);
  }, 2200);

  window.StudyNarrator = {
    start: function () { setMini(false); go(0, 0, true); },
    goTo: function (ch, st) { setMini(false); go(ch, st || 0, true); },
    close: close, minimize: minimize, expand: expand, burst: burst
  };
})();
