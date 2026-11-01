/* StudyPipe lesson player — classic script, works offline on file:// in Android WebView. */
(function () {
  "use strict";
  var L = window.LESSON;
  if (!L) { document.body.innerHTML = "<p style='padding:16px'>lesson-data.js missing.</p>"; return; }

  var stage = document.getElementById("stage");
  var idx = 0, active = null;
  var kitEvents = {};

  document.title = L.title;
  document.getElementById("meta").textContent =
    [L.subject, L.class, (L.exams || []).join(" / ")].filter(Boolean).join(" · ");

  // Load kit scripts listed in L.kits, then start.
  function loadKits(done) {
    var list = (L.kits || []).slice();
    var needs3d = !!L.needs3d && !window.THREE;   // set needs3d: true when any 3D kit is used
    var queue = (needs3d ? ["vendor/three-bundle.min.js"] : [])
      .concat(list.map(function (k) { return "kits/" + k + "/kit.js"; }));
    (function next() {
      if (!queue.length) return done();
      var s = document.createElement("script");
      s.src = queue.shift();
      s.onload = next;
      s.onerror = function () { console.error("Failed to load " + s.src); next(); };
      document.head.appendChild(s);
    })();
  }

  // ----- narration (Web Speech API, offline voices on most Android phones)
  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = L.lang || "en-GB"; u.rate = 0.95;
    var voices = window.speechSynthesis.getVoices();
    var v = voices.find(function (x) { return x.lang === u.lang || (u.lang === "en-GB" && /en-NG/i.test(x.lang)); }) ||
            voices.find(function (x) { return x.lang.slice(0, 2) === u.lang.slice(0, 2); });
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }
  function stopSpeech() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }

  // ----- renderers per section kind
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function renderQuiz(card, ids) {
    (ids || []).forEach(function (id, n) {
      var q = (L.questions || {})[id]; if (!q) return;
      var box = el("div", "q");
      box.appendChild(el("p", null, "<b>" + (n + 1) + ".</b> " + q.stem));
      if (q.type === "mcq") {
        Object.keys(q.options).forEach(function (key) {
          var opt = q.options[key];
          var b = el("button", "opt", "<b>" + key + ".</b> " + opt[0]);
          b.onclick = function () {
            box.querySelectorAll(".opt").forEach(function (o) { o.disabled = true; });
            b.classList.add(key === q.answer ? "right" : "wrong");
            if (key !== q.answer) {
              box.querySelectorAll(".opt")[Object.keys(q.options).indexOf(q.answer)].classList.add("right");
            }
            var why = el("div", "why-box", opt[1] + (q.working ? "<br><b>Working:</b> " + q.working : ""));
            box.appendChild(why);
          };
          box.appendChild(b);
        });
      } else {
        var reveal = el("button", "opt", "Show answer");
        reveal.onclick = function () { reveal.replaceWith(el("div", "why-box", q.answer + (q.working ? "<br>" + q.working : ""))); };
        box.appendChild(reveal);
      }
      card.appendChild(box);
    });
  }

  function show(i) {
    stopSpeech();
    if (active && active.destroy) { try { active.destroy(); } catch (e) { console.error(e); } }
    active = null;
    idx = Math.max(0, Math.min(i, L.sections.length - 1));
    var s = L.sections[idx];
    stage.innerHTML = "";
    var card = el("section", "card");
    card.appendChild(el("h2", null, s.title || ""));
    if (s.html && s.kind !== "svg") card.appendChild(el("div", null, s.html));

    if (s.kind === "kit") {
      var host = el("div", "kit-host");
      card.appendChild(host);
      var kit = (window.StudyPipeKits || {})[s.kit];
      if (kit && kit.mount) {
        try {
          active = kit.mount(host, s.params || {}, {
            emit: function (name, data) { (kitEvents[s.id] = kitEvents[s.id] || []).push({ name: name, data: data }); }
          });
        } catch (e) { console.error("Kit " + s.kit + " failed:", e); host.textContent = "This activity could not start."; }
      } else {
        console.error("Kit not loaded: " + s.kit);
        host.textContent = "Activity missing: " + s.kit;
      }
    } else if (s.kind === "svg") {
      card.appendChild(el("div", "svg-host", s.html));
    } else if (s.kind === "steps") {
      (s.steps || []).forEach(function (st, n) {
        var d = el("div", "step", "<b>Step " + (n + 1) + ".</b> " + st.html);
        if (st.why) d.appendChild(el("div", "why", st.why));
        card.appendChild(d);
      });
    } else if (s.kind === "quiz") {
      renderQuiz(card, s.questions);
    }
    stage.appendChild(card);
    stage.scrollTop = 0;
    document.getElementById("bar").style.width = ((idx + 1) / L.sections.length * 100) + "%";
    document.getElementById("prev").disabled = idx === 0;
    document.getElementById("next").textContent = idx === L.sections.length - 1 ? "Finish" : "Next →";
    document.getElementById("speak").disabled = !s.narration;
  }

  document.getElementById("prev").onclick = function () { show(idx - 1); };
  document.getElementById("next").onclick = function () { show(idx + 1); };
  document.getElementById("speak").onclick = function () { speak(L.sections[idx].narration); };
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = function () {};

  window.StudyPipePlayer = { show: show, events: kitEvents };
  loadKits(function () { show(0); });
})();
