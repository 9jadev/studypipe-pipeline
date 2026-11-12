/* =========================================================
   StudyPipe · lesson ↔ explainer-video bridge (assets/js/video-embed.js)
   Installed by scripts/apply-video.mjs. Classic script, no modules, works on file://.

   Each video runs in <iframe class="lesson-video-frame"> and talks to this page with
   postMessage({ type: 'studypipe:video', event, ... }). This page:
   - answers 'hello' and offers to speak for the video (speech relay), so the video uses the SAME
     speech path as StudyNarrator. Inside the StudyPipe app that path is the native Flutter TTS shim,
     which is guaranteed in the main frame but not inside iframes.
   - sizes the iframe to the video's content ('size'), portrait or landscape.
   - pauses StudyNarrator and any other video when one plays, and pauses videos when the narrator is used.
   - marks the video watched on 'complete' and scrolls to the next phase on 'continue'.
   ========================================================= */
(function () {
  "use strict";
  var synth = window.speechSynthesis || null, voice = null;

  function frames() { return Array.prototype.slice.call(document.querySelectorAll("iframe.lesson-video-frame")); }
  function frameFor(win) { var f = frames(); for (var i = 0; i < f.length; i++) if (f[i].contentWindow === win) return f[i]; return null; }
  function send(f, msg) { msg.type = "studypipe:video-host"; try { f.contentWindow.postMessage(msg, "*"); } catch (e) {} }
  function pauseAll(except) { frames().forEach(function (f) { if (f !== except) send(f, { cmd: "pause" }); }); }

  // Same voice ranking as narrator.js: Nigerian English first, then British, then any English.
  function pickVoice() {
    if (!synth || !synth.getVoices) return;
    var vs = synth.getVoices() || [], best = null, bestS = -1;
    vs.forEach(function (v) {
      var L = String(v.lang || "").toLowerCase().replace("_", "-"), s = -1;
      if (L === "en-ng" || /nigeria|ezinne|abeo/i.test(v.name || "")) s = 100;
      else if (L === "en-gb") s = 30; else if (L === "en-us") s = 25; else if (L.indexOf("en") === 0) s = 15;
      if (s >= 0 && /natural|neural|online|premium|enhanced/i.test(v.name || "")) s += 12;
      if (s > bestS) { bestS = s; best = v; }
    });
    voice = best;
  }
  if (synth) { pickVoice(); try { synth.onvoiceschanged = pickVoice; } catch (e) {} }

  var current = { frame: null, id: 0 };
  function speak(f, id, text, rate) {
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") { send(f, { cmd: "spoken", id: id }); return; }
    synth.cancel();
    if (!voice) pickVoice();
    var u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "en-NG";
    u.rate = rate || 0.93;
    current = { frame: f, id: id };
    u.onend = u.onerror = function () { if (current.frame === f && current.id === id) send(f, { cmd: "spoken", id: id }); };
    synth.speak(u);
  }

  function narratorPlaying() { var N = window.StudyNarrator; return !!(N && typeof N.isPlaying === "function" && N.isPlaying()); }
  function pauseNarrator() {
    var N = window.StudyNarrator; if (!N) return;
    // Only when it is actually talking: pausing also cancels speech, which would cut the video's own line.
    if (typeof N.isPlaying === "function" ? N.isPlaying() : true) { if (typeof N.pause === "function") N.pause(); }
    if (typeof N.minimize === "function") N.minimize();
  }

  // The narrator dock and the top nav are fixed. On a phone they sit over the video's control bar, so taps meant for
  // pause/next/captions hit the narrator instead. While a video is on screen (and no tour is talking) the dock steps aside,
  // and pressing play brings the whole video into view below the nav.
  var inView = {};
  function updateDock() {
    var any = false; for (var k in inView) if (inView[k]) any = true;
    document.body.classList.toggle("lv-in-view", any && !narratorPlaying());
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { inView[en.target.id || "v"] = en.intersectionRatio >= 0.3; });
      updateDock();
    }, { threshold: [0, 0.3, 0.6, 1] });
    Array.prototype.forEach.call(document.querySelectorAll(".lesson-video"), function (b) { io.observe(b); });
  }
  function navHeight() { var n = document.querySelector(".l-nav, .nav"); if (!n) return 0; var cs = getComputedStyle(n); return cs.position === "fixed" || cs.position === "sticky" ? n.getBoundingClientRect().height : 0; }
  function bringIntoView(f) {
    var r = f.getBoundingClientRect(), top = navHeight() + 8, room = window.innerHeight - top - 8;
    if (r.top >= top - 1 && r.bottom <= window.innerHeight + 1) return;
    var dy = r.height <= room ? r.top - top : r.bottom - window.innerHeight + 8;   // fits: align under the nav; else show the controls
    window.scrollBy({ top: dy, behavior: "smooth" });
  }

  function nextTarget(f, sel) {
    var t = null;
    try { t = sel ? document.querySelector(sel) : null; } catch (e) {}
    if (t) return t;
    // Fallback: the first Apply-phase section after the video (plans need not know section ids).
    var secs = Array.prototype.slice.call(document.querySelectorAll(".l-sec")), after = false;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].contains(f)) { after = true; continue; }
      var ph = secs[i].querySelector(".phase");
      if (after && ph && /apply/i.test(ph.textContent)) return secs[i];
    }
    return null;
  }

  // ---------- fullscreen: the video takes over the whole screen, in landscape ----------
  // Real Fullscreen API + orientation lock where the device allows it; otherwise (app WebViews, iOS) the iframe is pinned
  // over the viewport, and if the phone is upright it is turned sideways with CSS so the video still plays landscape.
  var fs = null;   // { frame, scroll, locked, ancestors: [[el, transform, filter, contain]] }
  function docFsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function layoutFs() {
    if (!fs) return;
    var upright = window.innerHeight > window.innerWidth;
    fs.frame.classList.toggle("lv-rot", upright && !fs.locked);
  }
  function enterFs(f) {
    if (fs) return;
    fs = { frame: f, scroll: window.scrollY, locked: false, ancestors: [] };
    // position:fixed breaks under a transformed/filtered ancestor (reveal animations): neutralise them while fullscreen
    for (var a = f.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      fs.ancestors.push([a, a.style.transform, a.style.filter, a.style.contain, a.style.willChange]);
      a.style.transform = "none"; a.style.filter = "none"; a.style.contain = "none"; a.style.willChange = "auto";
    }
    document.documentElement.classList.add("lv-fs");
    f.classList.add("lv-fs-frame");
    layoutFs();
    try { history.pushState({ lvfs: 1 }, ""); } catch (e) {}   // the phone's Back button leaves fullscreen, not the lesson
    var el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
    var lock = function () {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").then(function () { if (fs) { fs.locked = true; layoutFs(); } }).catch(function () {});
    };
    try { var r = req && req.call(el, { navigationUI: "hide" }); if (r && r.then) r.then(lock).catch(function () {}); else lock(); } catch (e) {}
    send(f, { cmd: "fullscreen", on: true });
  }
  function exitFs(fromHistory) {
    if (!fs) return;
    var f = fs.frame, s = fs.scroll, anc = fs.ancestors;
    fs = null;
    f.classList.remove("lv-fs-frame", "lv-rot");
    document.documentElement.classList.remove("lv-fs");
    anc.forEach(function (x) { x[0].style.transform = x[1]; x[0].style.filter = x[2]; x[0].style.contain = x[3]; x[0].style.willChange = x[4]; });
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
    try { if (docFsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {}
    if (!fromHistory && history.state && history.state.lvfs) { skipPop = true; history.back(); }
    send(f, { cmd: "fullscreen", on: false });
    window.scrollTo(0, s);
  }
  var skipPop = false;
  window.addEventListener("popstate", function () { if (skipPop) { skipPop = false; return; } if (fs) exitFs(true); });
  document.addEventListener("fullscreenchange", function () { if (fs && !docFsEl()) exitFs(false); });
  document.addEventListener("webkitfullscreenchange", function () { if (fs && !docFsEl()) exitFs(false); });
  window.addEventListener("resize", layoutFs);
  window.addEventListener("orientationchange", function () { setTimeout(layoutFs, 120); });
  document.addEventListener("keydown", function (e) { if (fs && e.key === "Escape") exitFs(false); });

  function markDone(box) {
    box.classList.add("is-done");
    try { localStorage.setItem("studypipe:video-done:" + location.pathname + "#" + (box.id || "video"), "1"); } catch (e) {}
    if (window.LessonKit && typeof window.LessonKit.toast === "function") window.LessonKit.toast("Video watched ✓");
    try { box.dispatchEvent(new CustomEvent("studypipe:video-complete", { bubbles: true })); } catch (e) {}
  }

  window.addEventListener("message", function (e) {
    var d = e.data; if (!d || d.type !== "studypipe:video") return;
    var f = frameFor(e.source); if (!f) return;
    var box = f.closest ? f.closest(".lesson-video") : f.parentNode;
    switch (d.event) {
      case "hello": send(f, { cmd: "host", relaySpeech: !!synth }); break;
      case "size": if (!fs && d.height > 80) f.style.height = Math.ceil(d.height) + "px"; break;
      case "fullscreen": if (d.on) enterFs(f); else exitFs(false); break;
      case "play": pauseNarrator(); pauseAll(f); if (box) box.classList.add("is-playing"); if (!fs) bringIntoView(f); updateDock(); break;
      case "pause": if (box) box.classList.remove("is-playing"); if (synth && current.frame === f) synth.cancel(); break;
      case "speak": speak(f, d.id, d.text, d.rate); break;
      case "cancel": if (synth && current.frame === f) synth.cancel(); break;
      case "complete": if (box) markDone(box); break;
      case "continue": var t = nextTarget(f, d.next); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); break;
    }
  });

  // The narrator and a video must never talk over each other.
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".narr-dock")) { pauseAll(null); setTimeout(updateDock, 300); } }, true);

  // Greet every video now and whenever one (re)loads: a video may have said hello before this script ran.
  function greet(f) { send(f, { cmd: "host", relaySpeech: !!synth }); }
  frames().forEach(function (f) { greet(f); f.addEventListener("load", function () { greet(f); }); });

  // Restore "watched" ticks.
  function restore() {
    Array.prototype.forEach.call(document.querySelectorAll(".lesson-video"), function (box) {
      try { if (localStorage.getItem("studypipe:video-done:" + location.pathname + "#" + (box.id || "video"))) box.classList.add("is-done"); } catch (e) {}
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", restore); else restore();
})();
