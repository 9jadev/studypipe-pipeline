/* Lesson 02 · interactions: True/False boolean sort (SortDnD), truth-table results table
   (filled from the logic switchboard bench), JAMB/NEPA multi-way branching explorer (#pos-explorer),
   and the 3-step Ikogosi generator failover bridge challenge.
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L02;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };

  // ============ 1. Boolean True / False sort ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#bool-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildSort() {
    if (!tray) return;
    tray.innerHTML = "";
    bins.forEach(function (b) { b.querySelector(".drop").innerHTML = ""; });
    document.getElementById("sort-feedback").classList.remove("on");
    document.getElementById("sort-score").textContent = "";
    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sort-item";
      b.setAttribute("data-id", it.id);
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span><code>" + it.name + "</code>";
      SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
      tray.appendChild(b);
    });
  }

  function pick(b) {
    if (picked) picked.classList.remove("picked");
    picked = picked === b ? null : b;
    if (picked) picked.classList.add("picked");
    bins.forEach(function (bn) { bn.classList.toggle("ready", !!picked); });
  }

  function place(b, bin) {
    b.classList.remove("picked", "right", "wrong");
    bin.querySelector(".drop").appendChild(b);
    picked = null;
    bins.forEach(function (bn) { bn.classList.remove("ready", "over"); });
  }

  bins.forEach(function (bin) {
    bin.addEventListener("click", function (e) {
      if (e.target.closest(".sort-item")) return;
      if (picked) place(picked, bin);
    });
    bin.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && picked) {
        e.preventDefault();
        place(picked, bin);
      }
    });
  });

  function checkSort() {
    var placed = 0, right = 0, rows = [];
    D.items.forEach(function (it) {
      var el = document.querySelector('#bool-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) {
        el.classList.toggle("right", ok);
        el.classList.toggle("wrong", !!chosen && !ok);
      }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.emo + " <code>" + it.name + "</code></b><span>" + D.bins[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) {
      toast("Place all " + D.items.length + " expressions first. " + (D.items.length - placed) + " still in the tray.");
      return;
    }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = document.getElementById("sort-feedback");
    fb.innerHTML = rows.join("");
    fb.classList.add("on");
    if (right >= 7) burst(document.getElementById("sort-score"), 20);
    emit("l02:sort", { correct: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ============ 2. Truth-table results table (filled from the bench) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  function gateShort(m) {
    if (m === "buggy") return "AND (Buggy)";
    if (m === "or_mode") return "OR";
    return "AND NOT";
  }
  if (tbody) {
    document.addEventListener("l02:bench", function (e) {
      var d = e.detail || {};
      var cur = d.current || d;
      if (cur.battery == null) return;
      rcount++;
      var tr = document.createElement("tr");
      tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Trial"><b>' + rcount + '</b><span class="rc-sub">' + gateShort(cur.logicMode) + "</span></td>" +
        '<td data-label="Battery">' + cur.battery + "%</td>" +
        '<td data-label="Grid Online">' + (cur.grid_online ? "True (Online)" : "False (Offline)") + "</td>" +
        '<td data-label="Relay Output"><strong>' + (cur.relay_on ? "True (ON)" : "False (OFF)") + "</strong></td>";
      tbody.appendChild(tr);
      setTimeout(function () { tr.classList.remove("fresh"); }, 1500);
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Trials recorded: " + rcount;
    });
    document.addEventListener("l02:bench-reset", function () {
      tbody.innerHTML = "";
      rcount = 0;
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Trials recorded: 0";
    });
  }

  // ============ 3. Multi-way Branching Explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info"), pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i];
      if (!p) return;
      pinEls.forEach(function (el, k) { el.setAttribute("aria-pressed", String(k === i)); });
      info.innerHTML =
        "<b>" + p.label + "</b> · Matched: <b>" + p.branch + "</b> → <code>" + p.cat + "</code><br>" +
        p.note;
      if (!quiet) emit("l02:pin", { index: i, score: p.score, hours: p.hours });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pos-pin";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = "JAMB " + p.score + "<br>" + p.hours + " hrs/day";
      b.setAttribute("aria-label", p.label + ", category " + p.cat);
      b.addEventListener("click", function () { showPin(i); });
      track.appendChild(b);
      pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin, true);
  }

  // ============ 4. Bridge: Repair generator_control.py (3 reasoning steps) ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0, correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l2-bq";
      card.innerHTML = "<h4>Step " + (i + 1) + ". " + st.q + '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"), why = card.querySelector(".why");
      st.o.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = text;
        b.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          card.setAttribute("data-done", "1");
          var ok = k === st.a;
          if (ok) correct++;
          answered++;
          Array.prototype.forEach.call(opts.children, function (x, j) {
            x.disabled = true;
            x.classList.toggle("correct", j === st.a);
            x.classList.toggle("incorrect", j === k && !ok);
          });
          why.textContent = (ok ? "Yes! " : "Not quite. ") + st.why;
          why.classList.add("on");
          if (ok) burst(b, 10);
          if (answered === D.bridge.length) finishBridge();
        });
        opts.appendChild(b);
      });
      bridgeRoot.appendChild(card);
    });
    function finishBridge() {
      verdict.innerHTML =
        "<strong>Generator Restored!</strong> By writing <code>if battery_level &lt; 20 and not grid_online: start_generator()</code>, the emergency diesel generator starts immediately when the battery drops to 18% during a blackout, keeping the Ikogosi clinic vaccine fridge cold. You got " +
        correct + " of " + D.bridge.length + " first time.";
      verdict.classList.add("on");
      burst(verdict, 24);
      var big = document.getElementById("big-idea");
      if (big) big.classList.add("reveal", "in");
      emit("l02:bridge", { correct: correct === D.bridge.length, score: correct, total: D.bridge.length });
    }
    D.bridge.solve = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (!card.getAttribute("data-done")) card.querySelectorAll(".opts button")[D.bridge[i].a].click();
      });
    };
  }
})();
