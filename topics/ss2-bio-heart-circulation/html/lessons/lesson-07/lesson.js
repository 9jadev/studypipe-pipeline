/* Lesson 07 · interactions: Safe-to-give sort, donor-patient explorer (#pos-explorer) and the case-file bridge. LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating and locked solutions. */
(function () {
  "use strict";
  var D = window.L07;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  var ABT = window.AboTypingBench;

  // ---------------- 1. Safe to give? (sort) ----------------
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#abo-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
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
      b.type = "button"; b.className = "sort-item"; b.setAttribute("data-id", it.id);
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span>" + it.name + " <small>" + it.to + "</small>";
      attachDrag(b);
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
    bin.addEventListener("click", function (e) { if (e.target.closest(".sort-item")) return; if (picked) place(picked, bin); });
    bin.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && picked) { e.preventDefault(); place(picked, bin); } });
  });
  function attachDrag(b) {
    // Shared drag-and-drop (assets/js/sort-dnd.js): auto-scrolls to reach bins that
    // sit below the fold, snaps to the nearest bin, and survives a stray second touch.
    SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
  }

  function checkSort() {
    var placed = 0, right = 0, rows = [];
    var labels = { safe: "Safe", unsafe: "Unsafe" };
    D.items.forEach(function (it) {
      var el = document.querySelector('#abo-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin"), chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin; if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + it.name + " " + it.to + "</b><span>" + labels[it.bin] + ". " + it.why + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    document.getElementById("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the notes below.");
    var fb = document.getElementById("sort-feedback"); fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 7) burst(document.getElementById("sort-score"), 20);
    emit("l7:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    document.getElementById("sort-check").addEventListener("click", checkSort);
    document.getElementById("sort-reset").addEventListener("click", buildSort);
  }

  // ---------------- 2. Donor and patient explorer (#pos-explorer) ----------------
  var grid = document.getElementById("abo-grid");
  if (grid && ABT) {
    var info = document.getElementById("pos-info");
    var rhD = "-", rhP = "-", sel = null, pinCount = 0, pins = {};
    var rhTxt = function (r) { return r === "+" ? "Rh+" : "Rh−"; };
    function antiList(abo) { return D.antibodies[abo]; }
    function verdict(d, p) {
      var c = ABT.compat({ abo: p, rh: rhP }, { abo: d, rh: rhD });
      var abo = c.aboOK ? "no donor antigen meets a matching antibody" : c.reason.split("; ").filter(function (x) { return x.indexOf("antigen") === 0; }).join("; ");
      var rh = c.rhOK ? (rhD === "+" ? "both are Rh+, so Rhesus is fine" : "no D antigen to worry about") : "the patient is Rh− and the donor Rh+, so the donor's D antigen would sensitise the patient";
      return { safe: c.safe, abo: abo, rh: rh, aboOK: c.aboOK, rhOK: c.rhOK };
    }
    function paintPins() {
      D.abo.forEach(function (d) { D.abo.forEach(function (p) {
        var v = verdict(d, p), b = pins[d + p];
        b.classList.toggle("safe", v.safe); b.classList.toggle("clash", !v.safe);
        b.textContent = v.safe ? "safe" : "clumps";
        b.setAttribute("aria-label", "Donor " + d + " to patient " + p + ": " + (v.safe ? "safe" : "clumps"));
      }); });
    }
    function showPair(d, p, quiet) {
      sel = { d: d, p: p };
      Object.keys(pins).forEach(function (k) { pins[k].setAttribute("aria-pressed", String(k === d + p)); });
      var v = verdict(d, p);
      info.innerHTML = "<b>Donor " + d + " " + rhTxt(rhD) + "</b> cells meet <b>patient " + p + " " + rhTxt(rhP) + "</b> plasma.<br>" +
        "Donor antigens: " + D.antigens[d] + (rhD === "+" ? " and D" : "") + ". Patient antibodies: " + antiList(p) + ".<br>" +
        "<b>" + (v.safe ? "Safe." : "Clumps.") + "</b> ABO: " + v.abo + ". Rhesus: " + v.rh + ".";
      var z = window.StudyScenes && window.StudyScenes.zoom;
      if (z) z.mix({ abo: d, rh: rhD }, { abo: p, rh: rhP });
      if (!quiet) { pinCount++; emit("l7:pin", { donor: d, patient: p, safe: v.safe, count: pinCount }); }
    }
    var corner = document.createElement("div"); corner.className = "hd"; corner.textContent = "";
    grid.appendChild(corner);
    D.abo.forEach(function (p) { var h = document.createElement("div"); h.className = "hd"; h.textContent = "to " + p; grid.appendChild(h); });
    D.abo.forEach(function (d) {
      var h = document.createElement("div"); h.className = "hd row"; h.textContent = d + " gives"; grid.appendChild(h);
      D.abo.forEach(function (p) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "abo-pin"; b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () { showPair(d, p); });
        grid.appendChild(b); pins[d + p] = b;
      });
    });
    function bindRh(id, setter) {
      Array.prototype.forEach.call(document.querySelectorAll("#" + id + " button"), function (b) {
        b.addEventListener("click", function () {
          setter(b.getAttribute("data-rh"));
          Array.prototype.forEach.call(document.querySelectorAll("#" + id + " button"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          paintPins(); if (sel) showPair(sel.d, sel.p, true);
        });
      });
    }
    bindRh("rh-donor", function (v) { rhD = v; });
    bindRh("rh-patient", function (v) { rhP = v; });
    paintPins();
    D.showPair = showPair;
    D.setRh = function (donorRh, patientRh) {
      rhD = donorRh; rhP = patientRh;
      [["rh-donor", donorRh], ["rh-patient", patientRh]].forEach(function (x) {
        Array.prototype.forEach.call(document.querySelectorAll("#" + x[0] + " button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-rh") === x[1])); });
      });
      paintPins(); if (sel) showPair(sel.d, sel.p, true);
    };
  }

  // ---------------- 3. The case-file bridge ----------------
  var card = document.getElementById("bridge-card");
  if (card) {
    var casesEl = document.getElementById("bridge-cases"), chosen = {}, verdictEl = document.getElementById("bridge-verdict");
    D.cases.forEach(function (c) {
      var q = document.createElement("div"); q.className = "bridge-q"; q.setAttribute("data-q", c.key);
      q.innerHTML = "<p>" + c.who + "</p><div class=\"opts\">" + c.opts.map(function (o, i) { return '<button type="button" data-v="' + i + '">' + o[1] + "</button>"; }).join("") + "</div>";
      casesEl.appendChild(q);
    });
    function pickOpt(q, v) {
      chosen[q] = String(v);
      Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + q + '"] button'), function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === String(v))); b.classList.remove("ok", "no");
      });
    }
    Array.prototype.forEach.call(card.querySelectorAll(".bridge-q"), function (qEl) {
      var q = qEl.getAttribute("data-q");
      Array.prototype.forEach.call(qEl.querySelectorAll("button"), function (b) { b.addEventListener("click", function () { pickOpt(q, b.getAttribute("data-v")); }); });
    });
    function rightIndex(c) { for (var i = 0; i < c.opts.length; i++) if (c.opts[i][0] === c.ans) return i; return -1; }
    function check() {
      if (D.cases.some(function (c) { return chosen[c.key] == null; })) { toast("Answer all three cases first."); return; }
      var all = true, notes = [];
      D.cases.forEach(function (c) {
        var ri = rightIndex(c), ok = chosen[c.key] === String(ri); if (!ok) all = false;
        Array.prototype.forEach.call(card.querySelectorAll('[data-q="' + c.key + '"] button'), function (b) {
          b.classList.toggle("ok", b.getAttribute("data-v") === String(ri));
          b.classList.toggle("no", b.getAttribute("data-v") === chosen[c.key] && !ok);
        });
        notes.push("<p><strong>" + c.who.split(" · ")[0] + (ok ? " ✓" : " ✗") + ":</strong> " + c.fix + "</p>");
      });
      verdictEl.classList.add("on"); verdictEl.classList.toggle("bad", !all);
      verdictEl.innerHTML = (all ? "<p><strong>Case closed.</strong> All three Oja Oba cases are solved.</p>" : "<p><strong>Not quite.</strong> The green rings show the right answers.</p>") + notes.join("");
      if (all) burst(verdictEl, 24);
      emit("l7:bridge", { correct: all });
    }
    document.getElementById("bridge-check").addEventListener("click", check);
    // Baba Sule's seven claims
    var cl = document.getElementById("claims"), cnt = document.getElementById("claim-count"), flipped = 0;
    function paintCount() { cnt.textContent = flipped + " of " + D.claims.length + " flipped"; }
    D.claims.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "claim"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<b>' + c.n + '</b><span class="said">“' + c.said + '”</span><span class="fix"><strong>Evidence:</strong> ' + c.fix + "</span>";
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(on)); flipped += on ? 1 : -1; paintCount();
        if (flipped === D.claims.length) { burst(cnt, 20); emit("l7:claims", { flipped: flipped }); }
      });
      cl.appendChild(b);
    });
    paintCount();
    document.getElementById("bridge-reset").addEventListener("click", function () {
      chosen = {}; verdictEl.classList.remove("on", "bad");
      Array.prototype.forEach.call(card.querySelectorAll(".bridge-q button"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("ok", "no"); });
      Array.prototype.forEach.call(cl.querySelectorAll(".claim"), function (b) { b.setAttribute("aria-pressed", "false"); });
      flipped = 0; paintCount();
    });
    function flipAll() { Array.prototype.forEach.call(cl.querySelectorAll(".claim"), function (b) { if (b.getAttribute("aria-pressed") !== "true") b.click(); }); }
    D.bridge = {
      pick: pickOpt, check: check, flipAll: flipAll,
      solve: function () { D.cases.forEach(function (c) { pickOpt(c.key, rightIndex(c)); }); check(); }
    };
  }
})();
