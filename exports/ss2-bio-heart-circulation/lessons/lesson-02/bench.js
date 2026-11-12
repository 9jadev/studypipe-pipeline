/* Lesson 02 · 3D goat-heart dissection bench (window.StudyScenes.bench)
   Wraps DissectionBench (assets/js/dissection-bench.js) on a SceneKit stage. Every number comes from the kit's model. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L02;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.DissectionBench) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var kit = DissectionBench.create({ length_cm: 8 });
  var P = kit.parts;
  var HK = window.HeartKit;
  var COND = {
    fresh: { slantCut: false, papillaryIncluded: false, shrunken: false },
    slant: { slantCut: true, papillaryIncluded: false, shrunken: false },
    papilla: { slantCut: false, papillaryIncluded: true, shrunken: false },
    shrunk: { slantCut: false, papillaryIncluded: false, shrunken: true }
  };
  var COND_NOTE = {
    fresh: "Fresh specimen, clean cut.",
    slant: "Slanting cut: every wall reads too high.",
    papilla: "Ruler placed through a papillary muscle: the ventricle walls read too high.",
    shrunk: "Stored in a fridge for days: the heart has shrunk, so walls read too low."
  };
  var PARTS_TOUR = [
    ["septum", "Septum: the muscle partition between the two halves."],
    ["tricuspid", "Tricuspid valve: three flaps, between the right atrium and right ventricle."],
    ["bicuspid", "Bicuspid (mitral) valve: two flaps, between the left atrium and left ventricle."],
    ["chordae", "Chordae tendineae: cords holding the valve flaps."],
    ["papillary", "Papillary muscles: they anchor the cords to the ventricle wall."],
    ["semilunar", "Semilunar pockets at the exit of the aorta."]
  ];
  var state = { cond: "fresh", cutDone: false, tour: 0, seen: {}, rotate: false, labels: false, hl: null };

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0.5, 0, -0.5), pitch: 0.96, yaw: 0, distance: 30, fitWidth: 24,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  var highlighter = null;
  if (stage) {
    stage.renderer.localClippingEnabled = true;
    DissectionBench.enableClipping(stage.renderer);
    stage.rig.add(kit);
    DissectionBench.lights(stage.scene);
    highlighter = HK && HK.makeHighlighter ? HK.makeHighlighter(stage.rig) : null;
    stage.start();
  }
  var lastT = 0;
  function frame(dt, t) {
    kit.update(dt, t);
    if (highlighter) highlighter.update(dt, t);
    if (state.rotate && stage) { stage.yaw = Math.sin(t * 0.7) * 0.7; }
    lastT = t;
  }

  // ---------- DOM ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var readoutEl = $("#bench-readout"), hint = $("#bench-hint");
  var cutBtn = $("#bench-cut"), partsBtn = $("#bench-parts"), rotBtn = $("#bench-rotate"), labBtn = $("#bench-labels"), resetBtn = $("#bench-reset");
  var measBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-measure [data-region]"));
  var tbody = $("#results-table tbody"), ratioLine = $("#ratio-line");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function cardState(done, now) {
    cards.forEach(function (c, i) {
      if (!c) return;
      c.classList.toggle("done", i < done);
      c.classList.toggle("now", i === now);
    });
  }
  function fmt(v) { return v == null ? "—" : v.toFixed(1); }
  function buildTable() {
    if (!tbody) return;
    tbody.innerHTML = "";
    D.order.forEach(function (k) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-region", k);
      tr.innerHTML = "<td><strong>" + D.names[k] + '</strong></td><td class="empty" data-c="r1">—</td><td class="empty" data-c="r2">—</td><td class="empty" data-c="mean">—</td><td class="empty" data-c="pump">—</td>';
      tbody.appendChild(tr);
    });
  }
  function paintTable(flash) {
    var r = kit.reading();
    r.table.forEach(function (row) {
      var tr = tbody && tbody.querySelector('tr[data-region="' + row.region + '"]'); if (!tr) return;
      var vals = { r1: fmt(row.r1), r2: fmt(row.r2), mean: fmt(row.mean), pump: row.mean != null ? row.pumpsTo : "—" };
      Object.keys(vals).forEach(function (c) {
        var td = tr.querySelector('[data-c="' + c + '"]');
        td.textContent = vals[c]; td.classList.toggle("empty", vals[c] === "—");
      });
      tr.classList.toggle("fresh", flash === row.region);
    });
    var lv = r.table.filter(function (x) { return x.region === "lv"; })[0], rv = r.table.filter(function (x) { return x.region === "rv"; })[0];
    if (ratioLine) ratioLine.textContent = lv.mean != null && rv.mean != null
      ? "LV : RV = " + lv.mean.toFixed(1) + " ÷ " + rv.mean.toFixed(1) + " = " + (lv.mean / rv.mean).toFixed(1)
      : "LV : RV = measure both ventricles twice to find out";
    var done = r.table.filter(function (x) { return x.mean != null; }).length;
    if (hint) hint.innerHTML = state.cutDone ? "Walls measured: <b>" + done + " of 5</b>" : "Cut the heart open first";
    r.table.forEach(function (row) {
      var b = measBtns.filter(function (x) { return x.getAttribute("data-region") === row.region; })[0];
      if (b) b.classList.toggle("zobo", row.mean != null);
    });
    return r;
  }
  function paintReadout(res) {
    if (!readoutEl) return;
    var r = kit.reading();
    if (!res) {
      readoutEl.innerHTML = '<div><span>Cut</span><b>' + Math.round(r.cut * 100) + '%</b></div><div><span>Length</span><b>' + r.length_cm.toFixed(1) + ' cm</b></div><div><span>Specimen</span><b>' + (state.cond === "fresh" ? "fresh" : state.cond) + '</b></div>';
      return;
    }
    readoutEl.innerHTML =
      '<div><span>Region</span><b>' + D.names[res.region].replace(/ \(.*\)/, "") + '</b></div>' +
      '<div class="hot"><span>Reading ' + res.trial + ' / mm</span><b>' + res.value.toFixed(1) + '</b></div>' +
      '<div><span>Mean / mm</span><b>' + (res.mean != null ? res.mean.toFixed(1) : "…") + '</b></div>' +
      '<div><span>Pumps to</span><b style="font-size:.78em">' + (res.mean != null ? res.pumpsTo : "measure again") + '</b></div>';
  }

  // ---------- kit events ----------
  function onCut() {
    state.cutDone = true;
    measBtns.forEach(function (b) { b.disabled = false; });
    partsBtn.disabled = false; cutBtn.disabled = true;
    cardState(2, 2);
    toast("The heart is open. Show the parts, then measure each wall twice.");
    paintTable(); paintReadout();
    emit("l2:cut", {});
  }
  kit.onEvent = function (name, detail) {
    if (name === "cut") onCut();
    else if (name === "measure") {
      var r = paintTable(detail.region); paintReadout(detail);
      cardState(3, 3);
      emit("l2:bench", r);
    } else if (name === "region-done") {
      toast(D.names[detail.region] + ": mean " + detail.mean.toFixed(1) + " mm, pumps to " + detail.pumpsTo + ".");
    } else if (name === "bench-done") {
      cardState(4, -1);
      toast("All five walls measured. LV : RV = " + kit.reading().ratioLVRV.toFixed(1) + ".");
      emit("l2:bench-done", kit.reading());
    } else if (name === "blocked") toast("Cut the heart open first.");
  };

  // ---------- controls ----------
  function doCut() {
    if (state.cutDone) return;
    cardState(1, 1);
    if (stage) { kit.cut(1); toast("The scalpel is cutting from apex to base…"); }
    else { kit.setState({ cut: 1 }); onCut(); }
  }
  function measure(region) {
    var res = kit.measure(region);
    if (res) setHighlight(region);
    return res;
  }
  function setHighlight(name) {
    state.hl = name || null;
    if (highlighter) highlighter.set(name && P[name] ? P[name] : null);
  }
  function tourNext(name) {
    var i = state.tour % PARTS_TOUR.length;
    if (name) for (var k = 0; k < PARTS_TOUR.length; k++) if (PARTS_TOUR[k][0] === name) i = k;
    var it = PARTS_TOUR[i]; state.tour = i + 1; state.seen[it[0]] = true;
    setHighlight(it[0]); toast(it[1]);
    if (Object.keys(state.seen).length >= PARTS_TOUR.length) cardState(3, 3);
  }
  function setCond(c) {
    if (!COND[c]) return;
    state.cond = c;
    kit.setState({ errors: COND[c] });
    Array.prototype.forEach.call(document.querySelectorAll("#bench-cond button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cond") === c)); });
    buildTable(); paintTable(); paintReadout();
    toast(COND_NOTE[c]);
    emit("l2:bench-reset", { cond: c });
  }
  function reset() {
    kit.reset(); kit.setState({ errors: COND.fresh });
    state.cond = "fresh"; state.cutDone = false; state.tour = 0; state.seen = {}; setHighlight(null);
    Array.prototype.forEach.call(document.querySelectorAll("#bench-cond button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cond") === "fresh")); });
    measBtns.forEach(function (b) { b.disabled = true; b.classList.remove("zobo"); });
    partsBtn.disabled = true; cutBtn.disabled = false;
    cardState(0, 0); buildTable(); paintTable(); paintReadout();
    emit("l2:bench-reset", {});
  }

  cutBtn.addEventListener("click", doCut);
  partsBtn.addEventListener("click", function () { tourNext(); });
  rotBtn.addEventListener("click", function () { state.rotate = !state.rotate; rotBtn.setAttribute("aria-pressed", String(state.rotate)); if (!state.rotate && stage) stage.yaw = 0; });
  labBtn.addEventListener("click", function () { state.labels = !state.labels; labBtn.setAttribute("aria-pressed", String(state.labels)); kit.setState({ labels: state.labels }); });
  resetBtn.addEventListener("click", reset);
  measBtns.forEach(function (b) { b.addEventListener("click", function () { measure(b.getAttribute("data-region")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("#bench-cond button"), function (b) {
    b.addEventListener("click", function () { setCond(b.getAttribute("data-cond")); });
  });

  // tap a wall in the 3D section to measure it
  if (stage) {
    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || !state.cutDone) { down = null; return; }
      down = null;
      var map = [["ra", P.raWall], ["la", P.laWall], ["rv", P.rvWall], ["lv", P.lvWall], ["septum", P.septum], ["ra", P.ra], ["la", P.la], ["rv", P.rv], ["lv", P.lv]].filter(function (x) { return x[1]; });
      var hit = stage.pick(e, map.map(function (x) { return x[1]; }));
      if (!hit) return;
      for (var i = 0; i < map.length; i++) {
        var o = hit.object; while (o) { if (o === map[i][1]) { measure(map[i][0]); return; } o = o.parent; }
      }
    });
  }

  // ---------- scene API for the narrator, the explorer and the tests ----------
  var api = {
    cut: doCut, measure: measure, reset: reset, setCond: setCond, tour: tourNext,
    showCut: function () { kit.setState({ cut: 1 }); if (!state.cutDone) onCut(); },
    setMode: function (m) { if (m === "cut" || m === "dissect") doCut(); else if (m === "specimen") reset(); },
    highlight: function (p) { setHighlight(p || null); },
    rect: function (p) {
      if (!stage) return null;
      var o = P[p] || P[D.partFor[p]];
      if (p === "bench" || !o) o = kit;
      return stage.rectOf(o, 14);
    },
    reading: function () { return kit.reading(); },
    kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  buildTable(); paintTable(); paintReadout(); cardState(0, 0);
  setInterval(function () { if (!state.cutDone) paintReadout(); }, 400);
})();
