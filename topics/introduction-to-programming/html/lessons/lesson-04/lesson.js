/* Lesson 04 · interactions: Array operations sort (SortDnD), Contiguous Array Locker Rack results table,
   Memory Offset & Index Explorer (#pos-explorer), and the Ikogosi Clinic battery_check.py Bridge.
   LessonKit (shared) runs Do Now, Wonder Wall, quiz, rating, recall, and locked solutions. */
(function () {
  "use strict";
  var D = window.L04;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var emit = function (n, d) {
    document.dispatchEvent(new CustomEvent(n, { detail: d || {} }));
  };
  var burst = function (el, n) {
    if (window.StudyNarrator && el)
      window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14);
  };

  // ============ 1. Array operations sort (Read/Query vs Mutate/Update) ============
  var tray = document.getElementById("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#arr-sort .bin"));
  var picked = null;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function buildSort() {
    if (!tray) return;
    tray.innerHTML = "";
    bins.forEach(function (b) {
      b.querySelector(".drop").innerHTML = "";
    });
    var fb = document.getElementById("sort-feedback");
    if (fb) fb.classList.remove("on");
    var sc = document.getElementById("sort-score");
    if (sc) sc.textContent = "";
    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sort-item";
      b.setAttribute("data-id", it.id);
      b.innerHTML = '<span class="emo" aria-hidden="true">' + it.emo + "</span>" + it.name;
      SortDnD.attach(b, { bins: bins, onDrop: place, onTap: pick });
      tray.appendChild(b);
    });
  }

  function pick(b) {
    if (picked) picked.classList.remove("picked");
    picked = picked === b ? null : b;
    if (picked) picked.classList.add("picked");
    bins.forEach(function (bn) {
      bn.classList.toggle("ready", !!picked);
    });
  }

  function place(b, bin) {
    b.classList.remove("picked", "right", "wrong");
    bin.querySelector(".drop").appendChild(b);
    picked = null;
    bins.forEach(function (bn) {
      bn.classList.remove("ready", "over");
    });
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
    var placed = 0,
      right = 0,
      rows = [];
    D.items.forEach(function (it) {
      var el = document.querySelector('#arr-sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) {
        el.classList.toggle("right", ok);
        el.classList.toggle("wrong", !!chosen && !ok);
      }
      rows.push(
        '<div class="fb-row"><span class="' +
          (ok ? "ok" : "no") +
          '">' +
          (ok ? "✓" : "✗") +
          "</span><b>" +
          it.emo +
          " " +
          it.name +
          "</b><span>" +
          D.bins[it.bin] +
          ". " +
          it.why +
          "</span></div>"
      );
    });
    if (placed < D.items.length) {
      toast(
        "Place all " +
          D.items.length +
          " cards first. " +
          (D.items.length - placed) +
          " still in the tray."
      );
      return;
    }
    var sc = document.getElementById("sort-score");
    if (sc) {
      sc.textContent =
        "You got " +
        right +
        " / " +
        D.items.length +
        (right === D.items.length ? ". Perfect!" : ". See the explanations below.");
    }
    var fb = document.getElementById("sort-feedback");
    if (fb) {
      fb.innerHTML = rows.join("");
      fb.classList.add("on");
    }
    if (right >= 6 && sc) burst(sc, 20);
    emit("l04:sort", { correct: right, total: D.items.length });
  }

  if (tray) {
    buildSort();
    var chk = document.getElementById("sort-check");
    if (chk) chk.addEventListener("click", checkSort);
    var rst = document.getElementById("sort-reset");
    if (rst) rst.addEventListener("click", buildSort);
  }

  // ============ 2. Array Locker Rack results table (filled from the bench) ============
  var tbody = document.querySelector("#results-table tbody");
  var rcount = 0;
  function ordinalPos(idx) {
    if (idx >= 8) return "Out of Bounds";
    var s = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
    return (s[idx] || idx + 1 + "th") + " cell";
  }

  if (tbody) {
    document.addEventListener("l04:bench", function (e) {
      var d = e.detail || {};
      if (d.index == null) return;
      rcount++;
      var oob = !!d.outOfBounds;
      var valStr = oob ? "IndexError" : d.value != null ? d.value.toFixed(2) + " V" : "–";
      var statStr = oob
        ? "IndexError (OOB)"
        : d.index === 3
        ? "WEAK (Cell 4)"
        : "Healthy";
      var tr = document.createElement("tr");
      tr.className = "fresh";
      tr.innerHTML =
        '<td data-label="Index"><b>[' +
        d.index +
        ']</b><span class="rc-sub">' +
        ordinalPos(d.index) +
        "</span></td>" +
        '<td data-label="Address">' +
        (d.address || D.hexAddr(d.index)) +
        " (+" +
        (d.offset != null ? d.offset : d.index * 4) +
        "B)</td>" +
        '<td data-label="Reading"><b>' +
        valStr +
        "</b></td>" +
        '<td data-label="Status">' +
        statStr +
        "</td>";
      tbody.appendChild(tr);
      setTimeout(function () {
        tr.classList.remove("fresh");
      }, 1500);
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Readings recorded: " + rcount;
    });

    document.addEventListener("l04:bench-reset", function () {
      tbody.innerHTML = "";
      rcount = 0;
      var line = document.getElementById("results-line");
      if (line) line.textContent = "Readings recorded: 0";
    });
  }

  // ============ 3. Memory Offset & Index Explorer (#pos-explorer) ============
  var track = document.getElementById("pos-track");
  if (track && D.pins) {
    var info = document.getElementById("pos-info"),
      pinEls = [];
    var showPin = function (i, quiet) {
      var p = D.pins[i];
      if (!p) return;
      pinEls.forEach(function (el, k) {
        el.setAttribute("aria-pressed", String(k === i));
      });
      var idx = p.idx;
      var addr = D.hexAddr(idx);
      var offset = idx * D.ELEM_SIZE;
      var inBounds = idx >= 0 && idx < D.CELLS.length;
      var negIdx = inBounds ? "cells[" + (idx - D.CELLS.length) + "]" : "N/A (Out of range)";
      var valText = inBounds ? D.CELLS[idx].toFixed(2) + " V" : "IndexError: list index out of range";
      info.innerHTML =
        "<b>" +
        p.label +
        "</b> · Address = <code>0x1000 + (" +
        idx +
        " × 4) = " +
        addr +
        "</code> (+" +
        offset +
        " bytes)<br>" +
        "0-based: <code>cells[" +
        idx +
        "]</code> · Negative index: <code>" +
        negIdx +
        "</code> · Value: <b>" +
        valText +
        "</b><br>" +
        p.note;
      if (!quiet) emit("l04:pin", { index: i, arrayIndex: idx, address: addr });
    };
    D.pins.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pos-pin";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = "cells[" + p.idx + "]<br>" + D.hexAddr(p.idx);
      b.setAttribute("aria-label", p.label + ", address " + D.hexAddr(p.idx));
      b.addEventListener("click", function () {
        showPin(i);
      });
      track.appendChild(b);
      pinEls.push(b);
    });
    D.showPin = showPin;
    showPin(D.refPin || 0, true);
  }

  // ============ 4. Bridge: Patching battery_check.py for the Ikogosi Clinic Fridge ============
  var bridgeRoot = document.getElementById("bridge-steps");
  if (bridgeRoot && D.bridge) {
    var answered = 0,
      correct = 0;
    var verdict = document.getElementById("bridge-verdict");
    D.bridge.forEach(function (st, i) {
      var card = document.createElement("div");
      card.className = "l04-bq";
      card.innerHTML =
        "<h4>Step " +
        (i + 1) +
        ". " +
        st.q +
        '</h4><div class="opts"></div><p class="why"></p>';
      var opts = card.querySelector(".opts"),
        why = card.querySelector(".why");
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
          why.textContent = (ok ? "Correct. " : "Not quite. ") + st.why;
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
        "<strong>Clinic Cold-Chain Restored (+4.1 °C)!</strong> By replacing <code>range(1, 9)</code> with <code>range(len(battery_cells))</code>, the loop inspects all 8 cells at indices <code>0..7</code>, flags weak Cell 4 (<code>cells[3] = 2.95 V</code>), and never touches out-of-bounds index 8. You got " +
        correct +
        " of " +
        D.bridge.length +
        " first time.";
      verdict.classList.add("on");
      burst(verdict, 24);
      var big = document.getElementById("big-idea");
      if (big) big.classList.add("reveal", "in");
      emit("l04:bridge", {
        correct: correct === D.bridge.length,
        score: correct,
        total: D.bridge.length
      });
    }

    D.bridge.solve = function () {
      Array.prototype.forEach.call(bridgeRoot.children, function (card, i) {
        if (!card.getAttribute("data-done"))
          card.querySelectorAll(".opts button")[D.bridge[i].a].click();
      });
    };
    D.bridgeAnswer = function (step) {
      var card = bridgeRoot.children[step];
      if (card && !card.getAttribute("data-done"))
        card.querySelectorAll(".opts button")[D.bridge[step].a].click();
    };
  }
})();
