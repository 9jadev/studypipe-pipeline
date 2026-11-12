/* StudyPipe Studio · shared drag-and-drop for the sort game (window.SortDnD)
   ---------------------------------------------------------------------------
   Why this exists (human report, 2026-11-08: "the drag and drop gets frozen,
   especially when you drag it at the edge of two particular groups"):

   1. On a 360px phone the tray of items and the drop bins are far apart — the
      bins routinely sit several hundred px below the fold. `.sort-item` carries
      `touch-action: none` (it must, or the browser steals the gesture), so the
      page cannot scroll while a finger is down. The learner dragged downwards,
      hit the bottom of the screen and the item simply stuck to the finger with
      nowhere to drop: the "freeze".
   2. The old per-lesson code dropped only when `elementFromPoint` landed inside
      a `.bin`. The gap between two bins is not a bin, so releasing on the seam
      between two groups silently did nothing and the item snapped back.
   3. A second finger (or a palm) overwrote the drag's pointer id, orphaning the
      floating ghost so it stayed on screen for good.

   This module fixes all three: it auto-scrolls the page while a drag nears a
   viewport edge, snaps to the nearest bin within SNAP px, and ignores any extra
   pointer while a drag is live. Keyboard and tap-to-pick behaviour is unchanged.

   Usage from a lesson's lesson.js:
     SortDnD.attach(itemEl, { bins: bins, onDrop: place, onTap: pick });
   where place(item, bin) moves the item and pick(item) toggles tap-selection.  */
(function () {
  "use strict";

  var EDGE = 96;     // px from a viewport edge where auto-scroll starts
  var MAX_STEP = 24; // px per frame at the very edge
  var SNAP = 72;     // px outside a bin that still counts as a drop on it
  var THRESH = 8;    // px of movement before a press becomes a drag

  var live = null;   // the one drag in progress, or null

  function binUnder(bins, x, y) {
    var best = null, bestD = Infinity;
    for (var i = 0; i < bins.length; i++) {
      var r = bins[i].getBoundingClientRect();
      if (!r.width && !r.height) continue;            // hidden bin
      var dx = x < r.left ? r.left - x : (x > r.right ? x - r.right : 0);
      var dy = y < r.top ? r.top - y : (y > r.bottom ? y - r.bottom : 0);
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestD) { bestD = d; best = bins[i]; }
    }
    return bestD <= SNAP ? best : null;               // 0 = inside, <=SNAP = near
  }

  function scroller() {
    // the page itself scrolls on these lessons; keep it simple and robust
    return document.scrollingElement || document.documentElement;
  }

  // A timer, not requestAnimationFrame: rAF is throttled or paused by some Android
  // WebViews (and by headless Chromium) exactly when the finger is held still at the
  // edge — which is the moment the learner most needs the page to keep scrolling.
  function step() {
    if (!live || !live.dragging) return;
    var y = live.y, h = window.innerHeight, dy = 0;
    // Stop as soon as a bin is within reach, so holding at the edge cannot scroll
    // straight past the groups the learner was aiming for.
    if (live.binNear()) { live.highlight(); return; }
    if (y < EDGE) dy = -MAX_STEP * (1 - y / EDGE);
    else if (y > h - EDGE) dy = MAX_STEP * (1 - (h - y) / EDGE);
    if (dy) {
      var el = scroller(), before = el.scrollTop;
      el.scrollTop = before + dy;
      if (el.scrollTop !== before) live.highlight();   // the bins moved under the finger
    }
  }

  function attach(item, cfg) {
    var bins = cfg.bins || [];
    var onDrop = cfg.onDrop || function () {};
    var onTap = cfg.onTap || function () {};

    function clearOver() {
      for (var i = 0; i < bins.length; i++) bins[i].classList.remove("over");
    }

    item.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (live) return;                                // a drag is already running
      live = {
        item: item, pid: e.pointerId, sx: e.clientX, sy: e.clientY,
        x: e.clientX, y: e.clientY, dragging: false, ghost: null, raf: 0,   /* setInterval id */
        highlight: function () {
          var b = binUnder(bins, live.x, live.y);
          for (var i = 0; i < bins.length; i++) bins[i].classList.toggle("over", bins[i] === b);
        },
        binNear: function () { return !!binUnder(bins, live.x, live.y); }
      };
      try { item.setPointerCapture(e.pointerId); } catch (err) {}
    });

    item.addEventListener("pointermove", function (e) {
      if (!live || live.item !== item || live.pid !== e.pointerId) return;
      live.x = e.clientX; live.y = e.clientY;
      if (!live.dragging) {
        var moved = Math.abs(e.clientX - live.sx) + Math.abs(e.clientY - live.sy);
        if (moved <= THRESH) return;
        live.dragging = true;
        var g = item.cloneNode(true);
        g.style.cssText = "position:fixed;z-index:95;pointer-events:none;margin:0;" +
          "transform:rotate(-3deg) scale(1.05);box-shadow:0 18px 30px -10px rgba(0,0,0,.6)";
        document.body.appendChild(g);
        live.ghost = g;
        item.classList.add("dragging");
      }
      // Revive the auto-scroll loop on every move, so a dropped frame can never
      // leave a live drag with no way to reach a bin below the fold.
      if (!live.raf) live.raf = setInterval(step, 16);
      live.ghost.style.left = (live.x - live.ghost.offsetWidth / 2) + "px";
      live.ghost.style.top = (live.y - live.ghost.offsetHeight / 2) + "px";
      live.highlight();
    });

    function end(e) {
      if (!live || live.item !== item || live.pid !== e.pointerId) return;
      var was = live;
      live = null;                                     // before any DOM move
      if (was.raf) clearInterval(was.raf);
      try { item.releasePointerCapture(was.pid); } catch (err) {}
      if (was.ghost) was.ghost.remove();
      item.classList.remove("dragging");
      if (!was.dragging) {
        if (e.type === "pointerup") onTap(item);
        clearOver();
        return;
      }
      var bin = binUnder(bins, was.x, was.y);
      clearOver();
      if (bin && e.type !== "pointercancel") onDrop(item, bin);
    }

    item.addEventListener("pointerup", end);
    item.addEventListener("pointercancel", end);
    item.addEventListener("lostpointercapture", function (e) {
      // Some engines drop capture mid-gesture; finish cleanly instead of freezing.
      if (live && live.item === item && live.pid === e.pointerId && live.dragging) end(e);
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(item); }
    });
    item.addEventListener("click", function (e) { e.preventDefault(); });
  }

  window.SortDnD = { attach: attach, SNAP: SNAP };
})();
