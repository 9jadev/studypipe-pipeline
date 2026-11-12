/* Lesson 05 · interactions: Examiner sort, results table (answers computed from the bench model), magnification explorer,
   nine-rule drawing audit (HTML/SVG), and the bridge (fix both drawings, then see plasmolysis).
   LessonKit (assets/js/lesson-kit.js) boots itself from the page: Do Now, Wonder Wall, quiz, self-rating, locked solutions. */
(function () {
  "use strict";
  var D = window.L05;
  if (!D) return;

  var toast = window.LessonKit ? window.LessonKit.toast : function () {};
  var Store = window.LessonKit ? window.LessonKit.Store : { get: function (k, d) { return d; }, set: function () {} };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var burst = function (el, n) { if (window.StudyNarrator && window.StudyNarrator.burst && el) window.StudyNarrator.burst(el.getBoundingClientRect(), n || 14); };
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  window.L05.api = window.L05.api || {};

  // =========================================================
  // 1. Examiner sort (reward | penalise)
  // =========================================================
  var tray = $("sort-tray");
  var bins = Array.prototype.slice.call(document.querySelectorAll("#sort .bin"));
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
    $("sort-feedback").classList.remove("on");
    $("sort-score").textContent = "";
    shuffle(D.items).forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sort-item"; b.setAttribute("data-id", it.id);
      b.innerHTML = '<span class="emo" aria-hidden="true">' + esc(it.emo) + "</span>" + esc(it.name);
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
    var labels = { reward: "The examiner rewards this", penalise: "The examiner penalises this" };
    D.items.forEach(function (it) {
      var el = document.querySelector('#sort .sort-item[data-id="' + it.id + '"]');
      var bin = el && el.closest(".bin");
      var chosen = bin ? bin.getAttribute("data-bin") : null;
      if (chosen) placed++;
      var ok = chosen === it.bin;
      if (ok) right++;
      if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !!chosen && !ok); }
      rows.push('<div class="fb-row"><span class="' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✗") + "</span><b>" + esc(it.name) + "</b><span>" + labels[it.bin] + ". " + esc(it.why) + "</span></div>");
    });
    if (placed < D.items.length) { toast("Place all " + D.items.length + " cards first. " + (D.items.length - placed) + " still in the tray."); return; }
    $("sort-score").textContent = "You got " + right + " / " + D.items.length + (right === D.items.length ? ". Perfect!" : ". See the reasons below.");
    var fb = $("sort-feedback"); fb.innerHTML = rows.join(""); fb.classList.add("on");
    if (right >= 9) burst($("sort-score"), 20);
    emit("l5:sort", { correct: right, total: D.items.length });
  }
  if (tray) {
    buildSort();
    $("sort-check").addEventListener("click", checkSort);
    $("sort-reset").addEventListener("click", buildSort);
  }

  // =========================================================
  // 2. Results table: Feature | Onion (A) | Cheek (B). The expected answers come from SlidePrepBench.model (via the bench).
  // =========================================================
  function readingOf(spec) {
    var br = window.StudyScenes && window.StudyScenes.bench;
    if (br && br.reading) return br.reading(spec);
    if (window.SlidePrepBench) {
      var p = {}; for (var k in SlidePrepBench.DEFAULTS) p[k] = SlidePrepBench.DEFAULTS[k];
      p.specimen = spec; p.stain = spec === "onion" ? "iodine" : "methylene";
      return SlidePrepBench.model(p);
    }
    return null;
  }
  var FALLBACK = {
    onion: { cellWall: true, nucleusPosition: "side", vacuoleVisible: true, stain_colour: "yellow-brown" },
    cheek: { cellWall: false, nucleusPosition: "central", vacuoleVisible: false, stain_colour: "blue" }
  };
  function expected(rowId, spec) {
    var r = readingOf(spec) || FALLBACK[spec];
    switch (rowId) {
      case "shape": return r.cellWall ? "Regular, box-like" : "Irregular, rounded";
      case "wall": return r.cellWall ? "Present" : "Absent";
      case "nucleus": return r.nucleusPosition === "side" ? "At the side" : "Central";
      case "vacuole": return r.vacuoleVisible ? "Large, visible" : "Not visible";
      case "stain": return r.stain_colour === "yellow-brown" ? "Yellow-brown (iodine)" : "Blue (methylene blue)";
    }
    return "";
  }
  var tbody = document.querySelector("#results-table tbody");
  if (tbody) {
    var saved = Store.get("table", {});
    D.tableRows.forEach(function (row) {
      var tr = document.createElement("tr");
      function sel(spec) {
        var s = '<select data-row="' + row.id + '" data-spec="' + spec + '" aria-label="' + row.feature + ", " + (spec === "onion" ? "onion A" : "cheek B") + '"><option value="">choose…</option>';
        row.a.forEach(function (o) { s += "<option>" + esc(o) + "</option>"; });
        return s + "</select>";
      }
      tr.innerHTML = "<td><b>" + esc(row.feature) + "</b></td><td>" + sel("onion") + "</td><td>" + sel("cheek") + "</td>";
      tbody.appendChild(tr);
      tr.querySelectorAll("select").forEach(function (s) {
        var key = s.getAttribute("data-row") + "-" + s.getAttribute("data-spec");
        if (saved[key]) s.value = saved[key];
        s.addEventListener("change", function () { saved[key] = s.value; Store.set("table", saved); s.parentElement.classList.remove("ok", "no"); });
      });
    });
    $("results-check").addEventListener("click", function () {
      var right = 0, filled = 0, total = D.tableRows.length * 2;
      tbody.querySelectorAll("select").forEach(function (s) {
        s.parentElement.classList.remove("ok", "no");
        if (!s.value) return;
        filled++;
        var ok = s.value === expected(s.getAttribute("data-row"), s.getAttribute("data-spec"));
        if (ok) right++;
        s.parentElement.classList.add(ok ? "ok" : "no");
      });
      var out = $("results-score");
      if (!filled) { out.textContent = "Fill in at least one box from your two slides first."; return; }
      out.textContent = right + " of " + filled + " match what is seen on the slides" + (filled < total ? " (" + (total - filled) + " still blank)." : (right === total ? ". All correct!" : "."));
      emit("l5:table-checked", { right: right, filled: filled, total: total });
    });
    // the "expected" table is painted from the same model
    var ex = document.querySelector("#expected .exp-body");
    if (ex) {
      var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Feature</th><th>Specimen A · onion (iodine)</th><th>Specimen B · cheek (methylene blue)</th></tr></thead><tbody>';
      D.tableRows.forEach(function (row) { h += "<tr><td><b>" + esc(row.feature) + "</b></td><td>" + esc(expected(row.id, "onion")) + "</td><td>" + esc(expected(row.id, "cheek")) + "</td></tr>"; });
      ex.innerHTML = h + "</tbody></table></div>";
    }
  }

  // =========================================================
  // 3. Magnification explorer: a 1.2 cm specimen, instruction "6–8 cm"
  // =========================================================
  var choices = $("mag-choices");
  if (choices) {
    var detail = $("mag-detail");
    var lo = D.band_cm[0], hi = D.band_cm[1];
    function lenOf(M) { return Math.round(M * D.specimen_cm * 10) / 10; }     // drawing length = M x actual length
    D.mags.forEach(function (M) {
      var len = lenOf(M), ok = len >= lo && len <= hi;
      var b = document.createElement("button");
      b.type = "button"; b.className = "ph-choice"; b.setAttribute("data-m", M);
      b.style.setProperty("--pcol", ok ? "var(--ok)" : "var(--pink)");
      b.innerHTML = '<span class="k">×' + M + '</span><span class="n">' + len.toFixed(1) + " cm · " + (ok ? "fits" : (len < lo ? "too small" : "too big")) + "</span>";
      b.addEventListener("click", function () { showMag(M); });
      choices.appendChild(b);
    });
    var showMag = function (M) {
      var len = lenOf(M), ok = len >= lo && len <= hi;
      choices.querySelectorAll(".ph-choice").forEach(function (c) { c.classList.toggle("on", +c.getAttribute("data-m") === M); });
      var pct = Math.min(100, len / 10 * 100);
      detail.innerHTML =
        '<div class="num">' + D.specimen_cm.toFixed(1) + " cm × " + M + " = " + len.toFixed(1) + ' cm<small>' + (ok ? "Inside the 6–8 cm instruction" : (len < lo ? "Too small: below 6 cm" : "Too big: above 8 cm")) + "</small></div>" +
        '<div class="mag-bar" aria-hidden="true"><i class="band" style="left:' + (lo * 10) + "%;width:" + ((hi - lo) * 10) + '%"></i><i class="mk ' + (ok ? "ok" : "no") + '" style="left:' + pct + '%"></i><span style="left:0">0</span><span style="left:60%">6</span><span style="left:80%">8</span><span style="left:100%">10 cm</span></div>' +
        "<p>" + (ok ? "Write <b>Mag. ×" + M + "</b> under the drawing, with no unit." : "Pick another magnification: drawing length = M × actual length, and it must land between 6 and 8 cm.") + "</p>";
      emit("l5:mag", { M: M, length_cm: len, fits: ok });
    };
    window.L05.showMag = showMag;
    showMag(6);
  }

  // =========================================================
  // 4. Drawing audit (HTML/SVG): nine rules, two drawings
  // =========================================================
  var auditRoot = $("audit-root");
  var audit = { cur: "d1", judge: { d1: {}, d2: {} }, checked: { d1: false, d2: false }, fixed: { d1: false, d2: false } };
  function drawingById(id) { return D.drawings.filter(function (d) { return d.id === id; })[0]; }
  function markOf(d, fixed) {
    if (fixed) return 10;
    var m = 0; D.rules.forEach(function (r) { if (d.pass[r.id]) m += r.marks; });
    return m;
  }
  var REGIONS = {
    d1: { r3: [18, 142, 112, 20], r4: [18, 96, 106, 38], r5: [96, 84, 154, 50], r6: [244, 80, 100, 94], r9: [244, 112, 100, 62] },
    d2: { r2: [96, 204, 150, 24], r7: [240, 90, 100, 16], r9: [240, 138, 100, 20] }
  };
  function arrowHead(x, y, dir) {   // small solid arrowhead at (x, y) pointing along dir (dx, dy)
    var l = Math.hypot(dir[0], dir[1]), ux = dir[0] / l, uy = dir[1] / l;
    var bx = x - ux * 10, by = y - uy * 10, px = -uy * 4, py = ux * 4;
    return '<path class="dw-fill" d="M' + x + "," + y + " L" + (bx + px) + "," + (by + py) + " L" + (bx - px) + "," + (by - py) + 'Z"/>';
  }
  function label(x, y, t) { return '<text class="dw-txt" x="' + x + '" y="' + (y + 4) + '">' + esc(t) + "</text>"; }
  function guide(x1, y1, x2, y2) { return '<line class="dw-line thin" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
  function svgDrawing(id, fixed) {
    var s = '<svg class="dw-svg" viewBox="0 0 360 250" role="img" aria-label="' + (id === "d1" ? "Chinedu's drawing of two onion epidermal cells" : "Chinedu's drawing of a cheek cell") + '">';
    s += '<defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" class="dw-hatch"/></pattern></defs>';
    s += '<rect class="dw-paper" x="1" y="1" width="358" height="248" rx="8"/>';
    if (id === "d1") {
      if (!fixed) {
        // small, shaded, two cells with one double wall
        s += '<rect class="dw-line" x="20" y="100" width="50" height="32" fill="url(#hatch)"/><rect class="dw-line" x="73" y="100" width="47" height="32" fill="url(#hatch)"/>';
        s += '<line class="dw-line" x1="70" y1="100" x2="70" y2="132"/><line class="dw-line" x1="73" y1="100" x2="73" y2="132"/>';
        s += '<circle class="dw-line dw-solid" cx="108" cy="112" r="6"/>';
        s += guide(108, 116, 240, 92) + arrowHead(108, 116, [-132, 24]) + guide(100, 104, 240, 128) + guide(86, 126, 240, 164);
        s += label(246, 92, "Nuclei") + label(246, 128, "Mitochondrion") + label(246, 164, "Chloroplast");
        s += '<line class="dw-dim" x1="20" y1="148" x2="120" y2="148"/><text class="dw-note" x="20" y="162">drawn 3 cm long</text>';
        s += '<text class="dw-title" x="20" y="205">Onion epidermal cells</text><text class="dw-txt" x="20" y="224">Mag. ×250</text>';
      } else {
        s += '<rect class="dw-line" x="20" y="60" width="100" height="70"/><rect class="dw-line" x="124" y="60" width="96" height="70"/><line class="dw-line" x1="120" y1="60" x2="120" y2="130"/>';
        s += '<rect class="dw-line thin" x="130" y="76" width="64" height="46" rx="14"/><circle class="dw-line dw-solid" cx="207" cy="92" r="8"/>';
        s += guide(220, 68, 242, 68) + guide(215, 92, 242, 92) + guide(194, 108, 242, 108) + guide(212, 124, 242, 124);
        s += label(248, 68, "Cell wall") + label(248, 92, "Nucleus") + label(248, 108, "Vacuole") + label(248, 124, "Cytoplasm");
        s += '<line class="dw-dim" x1="20" y1="146" x2="220" y2="146"/><text class="dw-note" x="20" y="160">drawn 7 cm long</text>';
        s += '<text class="dw-title" x="20" y="205">Onion epidermal cells</text><text class="dw-txt" x="20" y="224">Mag. ×250</text>';
      }
    } else {
      var blob = "M40,100 C45,60 90,45 130,50 C175,55 195,85 185,115 C178,145 135,155 95,150 C55,145 35,130 40,100 Z";
      s += '<path class="dw-line" d="' + blob + '"/><circle class="dw-line dw-solid" cx="112" cy="100" r="16"/>';
      s += guide(181, 70, 238, 70) + guide(128, 100, 238, 100) + guide(150, 130, 238, 130);
      s += label(244, 70, "Cell membrane") + label(244, 100, fixed ? "Nucleus" : "Nucleous") + label(244, 130, "Cytoplasm");
      if (!fixed) { s += guide(118, 142, 238, 148) + label(244, 148, "Mitochondrion"); }
      s += '<line class="dw-dim" x1="40" y1="170" x2="188" y2="170"/><text class="dw-note" x="40" y="184">drawn ' + (fixed ? "7.2" : "7.2") + " cm long</text>";
      s += '<text class="dw-title" x="40" y="212">Human cheek cell</text>';
      if (fixed) s += '<text class="dw-txt" x="40" y="231">Mag. ×1200</text>';
    }
    return s + "</svg>";
  }
  function renderAudit() {
    if (!auditRoot) return;
    var id = audit.cur, d = drawingById(id), fixed = audit.fixed[id], checked = audit.checked[id], J = audit.judge[id];
    var h = '<div class="audit-tabs" role="group" aria-label="Choose a drawing">';
    D.drawings.forEach(function (x, i) {
      h += '<button type="button" class="vt-btn" data-d="' + x.id + '" aria-pressed="' + (x.id === id) + '">Drawing ' + (i + 1) + " · " + (x.id === "d1" ? "onion" : "cheek") + "</button>";
    });
    h += "</div>";
    h += '<div class="audit-grid"><div class="audit-fig"><h4>' + esc(d.title) + (fixed ? ' <span class="fixed-tag">fixed</span>' : "") + "</h4>" + svgDrawing(id, fixed);
    // numbered fault markers after marking (unfixed only)
    h += "</div><div class=\"audit-rules\">";
    D.rules.forEach(function (r) {
      var truth = fixed ? true : d.pass[r.id], j = J[r.id];
      var cls = "dr-row" + (checked && j ? (j === (truth ? "pass" : "fault") ? " ok" : " no") : "");
      h += '<div class="' + cls + '" data-r="' + r.id + '"><div class="dr-set"><b>' + r.n + ". " + esc(r.name) + (r.marks > 1 ? " (" + r.marks + " marks)" : "") + "</b></div>" +
        '<div class="dr-set"><button type="button" class="dr-chip" data-r="' + r.id + '" data-j="pass" aria-pressed="' + (j === "pass") + '">Pass</button><button type="button" class="dr-chip" data-r="' + r.id + '" data-j="fault" aria-pressed="' + (j === "fault") + '">Fault</button></div>' +
        '<p class="dr-why' + (checked || fixed ? " on" : "") + '">' + (checked || fixed ? (fixed ? "Now correct. " : (truth ? "" : "Fault. ")) + esc(fixed ? "Fixed after re-marking." : d.why[r.id]) : "") + "</p></div>";
    });
    h += "</div></div>";
    var judged = 0; D.rules.forEach(function (r) { var truth = fixed ? true : d.pass[r.id]; if (J[r.id] === (truth ? "pass" : "fault")) judged++; });
    var answered = Object.keys(J).length;
    var mk = markOf(d, fixed);
    h += '<div class="audit-side"><div class="audit-count" aria-live="polite">' +
      (checked ? "You judged <b>" + judged + " / 9</b> rules correctly. Dr Amaka’s mark: <b>" + mk + " / 10</b>." : (answered ? answered + " of 9 rules judged. Tap Mark my audit when you are done." : "Judge each rule: does this drawing pass or break it?")) +
      '</div><div class="audit-btns"><button class="btn btn-primary btn-sm" type="button" data-a="mark">Mark my audit</button>' +
      '<button class="btn btn-ink btn-sm" type="button" data-a="fix">' + (fixed ? "Show the faulty drawing" : "Fix the drawing") + '</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-a="reset">Clear</button></div></div>';
    auditRoot.innerHTML = h;
    // overlay fault boxes after marking
    if (checked && !fixed && REGIONS[id]) {
      var svg = auditRoot.querySelector(".dw-svg"), box = "";
      Object.keys(REGIONS[id]).forEach(function (rid) {
        var g = REGIONS[id][rid], n = rid.slice(1);
        box += '<rect class="dw-hl" x="' + g[0] + '" y="' + g[1] + '" width="' + g[2] + '" height="' + g[3] + '" rx="5"/><circle class="dw-badge" cx="' + (g[0] + 4) + '" cy="' + (g[1] + 2) + '" r="9"/><text class="dw-badge-t" x="' + (g[0] + 4) + '" y="' + (g[1] + 6) + '">' + n + "</text>";
      });
      svg.insertAdjacentHTML("beforeend", box);
    }
  }
  function judgeRule(rid, j) {
    audit.judge[audit.cur][rid] = j;
    audit.checked[audit.cur] = false;
    renderAudit();
  }
  function markAudit(id) {
    id = id || audit.cur;
    var d = drawingById(id), J = audit.judge[id], n = Object.keys(J).length;
    if (n < D.rules.length) { toast("Judge all 9 rules first. " + (D.rules.length - n) + " still to do."); return; }
    audit.checked[id] = true;
    var judged = 0; D.rules.forEach(function (r) { var truth = audit.fixed[id] ? true : d.pass[r.id]; if (J[r.id] === (truth ? "pass" : "fault")) judged++; });
    renderAudit();
    if (judged === 9) burst(auditRoot.querySelector(".audit-count"), 20);
    emit("l5:audit", { drawing: id, judged: judged, total: 9, mark: markOf(d, audit.fixed[id]), outOf: 10 });
    checkBridge();
  }
  function fixDrawing(id) {
    id = id || audit.cur;
    audit.fixed[id] = !audit.fixed[id];
    if (audit.fixed[id]) {
      // fixing means every rule now passes
      D.rules.forEach(function (r) { audit.judge[id][r.id] = "pass"; });
      audit.checked[id] = true;
      emit("l5:audit-fixed", { drawing: id, mark: 10 });
    } else { audit.judge[id] = {}; audit.checked[id] = false; }
    renderAudit();
    checkBridge();
  }
  function selectDrawing(id) { audit.cur = id; renderAudit(); }
  if (auditRoot) {
    auditRoot.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.hasAttribute("data-d")) return selectDrawing(t.getAttribute("data-d"));
      if (t.hasAttribute("data-j")) return judgeRule(t.getAttribute("data-r"), t.getAttribute("data-j"));
      var a = t.getAttribute("data-a");
      if (a === "mark") markAudit();
      else if (a === "fix") fixDrawing();
      else if (a === "reset") { audit.judge[audit.cur] = {}; audit.checked[audit.cur] = false; audit.fixed[audit.cur] = false; renderAudit(); }
    });
    renderAudit();
  }
  window.L05.audit = {
    select: selectDrawing, mark: markAudit, fix: function (id) { if (!audit.fixed[id || audit.cur]) fixDrawing(id); else selectDrawing(id); },
    // for the narrator: pre-fill the true judgements for one drawing and mark them
    demo: function (id) {
      var d = drawingById(id); audit.cur = id; audit.fixed[id] = false;
      D.rules.forEach(function (r) { audit.judge[id][r.id] = d.pass[r.id] ? "pass" : "fault"; });
      markAudit(id);
    }
  };

  // =========================================================
  // 5. The bridge: re-mark, fix both drawings, then see the membrane in a plasmolysed onion cell
  // =========================================================
  var br = { s1: false, s2: false, s3: false };
  var brRoot = $("bridge-test");
  function cellSVG(plasmolysed) {
    var s = '<svg class="dw-svg cell-svg" viewBox="0 0 200 120" role="img" aria-label="' + (plasmolysed ? "Plasmolysed onion cell: the membrane has pulled away from the wall" : "Normal onion cell: the membrane is pressed against the wall") + '">';
    s += '<rect class="cs-wall" x="14" y="12" width="172" height="96" rx="4"/>';
    if (!plasmolysed) {
      s += '<rect class="cs-cyto" x="19" y="17" width="162" height="86" rx="3"/><rect class="cs-vac" x="30" y="28" width="116" height="64" rx="12"/><circle class="cs-nuc" cx="164" cy="60" r="9"/>';
    } else {
      s += '<rect class="cs-gap" x="19" y="17" width="162" height="86" rx="3"/>';
      s += '<rect class="cs-mem" x="46" y="30" width="108" height="60" rx="18"/><rect class="cs-vac" x="54" y="38" width="64" height="44" rx="12"/><circle class="cs-nuc" cx="136" cy="60" r="8"/>';
      s += '<line class="dw-line thin" x1="46" y1="60" x2="14" y2="60" /><text class="dw-note" x="20" y="54">gap</text>';
    }
    return s + "</svg>";
  }
  function paintBridge() {
    if (!brRoot) return;
    var d1 = drawingById("d1"), d2 = drawingById("d2");
    var s1 = $("br-s1"), s2 = $("br-s2");
    if (s1) s1.innerHTML = "Drawing 1 (onion): <b>" + markOf(d1, false) + " / 10</b> → <b>" + (br.s1 ? markOf(d1, true) : "?") + " / 10</b>";
    if (s2) s2.innerHTML = "Drawing 2 (cheek): <b>" + markOf(d2, false) + " / 10</b> → <b>" + (br.s2 ? markOf(d2, true) : "?") + " / 10</b>";
    $("br-1").disabled = br.s1; $("br-2").disabled = !br.s1 || br.s2; $("br-3").disabled = !br.s2 || br.s3;
    var st = $("br-status");
    if (st) st.innerHTML = !br.s1 ? "Chinedu’s drawings scored 4 and 7. Start with Step 1: re-mark and fix drawing 1." :
      !br.s2 ? "Drawing 1 now scores 10 out of 10. Step 2: fix drawing 2." :
      !br.s3 ? "Both drawings are fixed. Step 3: put the onion peel in the strong salty water from Lesson 4." :
      "Mystery closed: the membrane was there all along, and salt made it visible.";
  }
  function checkBridge() {
    paintBridge();
  }
  if (brRoot) {
    var cells = $("br-cells");
    $("br-1").addEventListener("click", function () { br.s1 = true; audit.fixed.d1 = false; fixDrawing("d1"); paintBridge(); });
    $("br-2").addEventListener("click", function () { br.s2 = true; audit.fixed.d2 = false; fixDrawing("d2"); paintBridge(); });
    $("br-3").addEventListener("click", function () {
      br.s3 = true;
      var salt = window.SlidePrepBench ? (function () { var p = {}; for (var k in SlidePrepBench.DEFAULTS) p[k] = SlidePrepBench.DEFAULTS[k]; p.specimen = "onion"; p.stain = "salt"; return SlidePrepBench.model(p); })() : { plasmolysed: true };
      var norm = readingOf("onion") || { plasmolysed: false };
      cells.innerHTML = '<figure>' + cellSVG(false) + "<figcaption><b>Iodine slide</b><br>" + (norm.plasmolysed ? "plasmolysed" : "membrane pressed against the wall: not seen as a separate line") + "</figcaption></figure>" +
        "<figure>" + cellSVG(!!salt.plasmolysed) + "<figcaption><b>Strong salt slide</b><br>" + (salt.plasmolysed ? "plasmolysed: the membrane has pulled away from the wall, so now you can see it" : "") + "</figcaption></figure>";
      cells.classList.add("on");
      var v = $("br-verdict");
      v.innerHTML = "<strong>Case closed.</strong> Salty water pulls water out of the vacuole by osmosis, so the protoplast shrinks away from the cell wall: that is plasmolysis. It is what happened to the ugu leaves at Mile 12, and it is why Dr Amaka will not drip plain water into a vein: red blood cells have no wall, so they burst instead. And it shows the cell membrane is real, even when a school slide cannot show it.";
      v.classList.add("on");
      burst(v, 24);
      paintBridge();
      emit("l5:bridge", { correct: true });
    });
    $("br-reset").addEventListener("click", function () {
      br = { s1: false, s2: false, s3: false }; audit.fixed.d1 = false; audit.fixed.d2 = false;
      audit.judge.d1 = {}; audit.judge.d2 = {}; audit.checked.d1 = false; audit.checked.d2 = false;
      cells.classList.remove("on"); cells.innerHTML = ""; $("br-verdict").classList.remove("on");
      renderAudit(); paintBridge();
    });
    window.L05.bridge = {
      step: function (n) { var b = $("br-" + n); if (b && !b.disabled) b.click(); },
      done: function () { return br.s3; }
    };
    paintBridge();
  }

  // quick helper for the narrator
  window.L05.open = function (sel) { var d = document.querySelector(sel); if (d && d.tagName === "DETAILS") d.open = true; };
})();
