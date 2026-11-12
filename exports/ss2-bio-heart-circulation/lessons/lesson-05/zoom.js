/* Lesson 05 · 3D capillary zoom (HeartKit.capillaryBed): normal → congest → kwash → blocked.
   Counters: NFP at the arterial end, NFP at the venous end (from the lesson model) and the result. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var D = window.L05;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  var noteEl = document.getElementById("zoom-note");
  var ORDER = ["normal", "congest", "kwash", "blocked"];
  var RESULT = { normal: "fluid returns", congest: "no return: oedema", kwash: "no return: oedema", blocked: "lymph blocked" };
  var ALIAS = { tissueFluid: "fluid", lymphCapillary: "lymph", tissueCells: "tissueCells", capillary: "capillary", probe: "probe" };
  var state = { mode: "normal" };
  var highlightPart = null;

  var api = {
    setMode: setMode, next: next, reset: function () { setMode("normal", true); },
    rect: function () { return null; },
    highlight: function (p) { highlightPart = p || null; },
    probe: function (x) { if (kit) kit.userData.setState({ probe: x == null ? null : +x, nfp: x == null ? 0 : D.nfp(+x, state.mode) }); },
    state: function () { return { mode: state.mode }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0.1, 0), pitch: 0.1, yaw: 0.05,
    distance: 5.4, minYaw: -0.7, maxYaw: 0.7, onFrame: frame
  });

  var kit = null, glow = null;
  if (stage && window.HeartKit && window.HeartKit.capillaryBed) build();
  wire();
  paint();

  function build() {
    kit = window.HeartKit.capillaryBed({ labels: root.clientWidth >= 560 });
    stage.rig.add(kit);
    glow = SceneKit.glowSprite("rgba(255,178,63,0.9)", 1.2);
    glow.material.opacity = 0; glow.userData.noFit = true; stage.rig.add(glow);
    api.rect = function (part) {
      var obj = kit.userData.parts && kit.userData.parts[ALIAS[part] || part];
      return stage.rectOf(obj || kit, 12);
    };
    stage.start();
  }

  function setMode(m, silent) {
    if (ORDER.indexOf(m) < 0) return;
    state.mode = m;
    if (kit) kit.userData.setState({ mode: m, probe: null });
    if (stage) stage.refit();
    paint();
    if (!silent) {
      var a = D.nfp(0, m), v = D.nfp(1, m);
      toast(D.mode(m).label + ": NFP " + D.sgn(a) + " mmHg at the arterial end, " + D.sgn(v) + " mmHg at the venous end.");
    }
    emit("l5:zoom", { mode: m });
  }
  function next() { setMode(ORDER[(ORDER.indexOf(state.mode) + 1) % ORDER.length]); }

  function wire() {
    root.querySelectorAll("#zoom-seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var nx = document.getElementById("zoom-next");
    if (nx) nx.addEventListener("click", next);
  }

  function paint() {
    root.querySelectorAll("#zoom-seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    var a = root.querySelector('[data-c="nfpA"]'), v = root.querySelector('[data-c="nfpV"]'), r = root.querySelector('[data-c="res"]');
    if (a) a.textContent = D.sgn(D.nfp(0, state.mode));
    if (v) v.textContent = D.sgn(D.nfp(1, state.mode));
    if (r) r.textContent = RESULT[state.mode];
    if (noteEl) noteEl.textContent = D.zooms[state.mode].note;
  }

  var tmpBox, tmpV;
  function frame(dt, t) {
    if (!kit) return;
    kit.userData.update(dt, t);
    if (glow) {
      var target = highlightPart && kit.userData.parts ? kit.userData.parts[ALIAS[highlightPart] || highlightPart] : null;
      if (target) {
        tmpBox = tmpBox || new THREE.Box3(); tmpV = tmpV || new THREE.Vector3();
        tmpBox.setFromObject(target); tmpBox.getCenter(glow.position);
        stage.rig.worldToLocal(glow.position);
        glow.scale.setScalar(Math.max(0.5, tmpBox.getSize(tmpV).length() * 0.8));
      }
      glow.material.opacity += ((target ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 8);
    }
  }
})();
