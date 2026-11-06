/* =========================================================
   StudyPipe · SceneKit — shared helpers for every 3D lab
   (three.js r149, classic script, fully offline)
   ========================================================= */
(function () {
  "use strict";
  window.StudyScenes = window.StudyScenes || {};

  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function radialTexture(inner, outer, size) {
    var c = document.createElement("canvas");
    c.width = c.height = size || 256;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(c.width / 2, c.height / 2, 0, c.width / 2, c.height / 2, c.width / 2);
    grd.addColorStop(0, inner); grd.addColorStop(1, outer);
    g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  function labelTexture(text, opts) {
    opts = opts || {};
    var c = document.createElement("canvas");
    var fs = opts.size || 56;
    var g = c.getContext("2d");
    g.font = (opts.weight || 700) + " " + fs + "px " + (opts.font || (getComputedStyle(document.documentElement).getPropertyValue("--font-label").trim() || "Manrope, sans-serif"));
    var w = Math.ceil(g.measureText(text).width) + fs;
    c.width = Math.max(64, w); c.height = Math.round(fs * 1.7);
    g = c.getContext("2d");
    if (opts.bg) {
      g.fillStyle = opts.bg;
      var r = c.height / 2;
      g.beginPath();
      g.moveTo(r, 0); g.lineTo(c.width - r, 0); g.arc(c.width - r, r, r, -Math.PI / 2, Math.PI / 2);
      g.lineTo(r, c.height); g.arc(r, r, r, Math.PI / 2, Math.PI * 1.5); g.fill();
    }
    g.font = (opts.weight || 700) + " " + fs + "px " + (opts.font || (getComputedStyle(document.documentElement).getPropertyValue("--font-label").trim() || "Manrope, sans-serif"));
    g.fillStyle = opts.color || "#ffffff";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, c.width / 2, c.height / 2 + 2);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.userData = { aspect: c.width / c.height };
    return t;
  }

  function glowSprite(color, size) {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, color); grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.setScalar(size || 1);
    return s;
  }

  function buildEnvironment(renderer, tint) {
    var envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: tint || 0x141b30, side: THREE.BackSide })));
    function panel(w, h, color, pos, rot) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
      m.position.copy(pos); if (rot) m.rotation.copy(rot); envScene.add(m);
    }
    panel(8, 3, new THREE.Color(4, 4, 4.2), new THREE.Vector3(0, 9.5, 0), new THREE.Euler(Math.PI / 2, 0, 0));
    panel(2.5, 8, new THREE.Color(3, 3.1, 3.4), new THREE.Vector3(-9.5, 2, 2), new THREE.Euler(0, Math.PI / 2, 0));
    panel(2, 7, new THREE.Color(3.2, 0.6, 1.6), new THREE.Vector3(9.5, 1, -2), new THREE.Euler(0, -Math.PI / 2, 0));
    panel(6, 1.5, new THREE.Color(2.6, 1.6, 0.5), new THREE.Vector3(0, 1, -9.5), null);
    panel(5, 4, new THREE.Color(0.9, 1.6, 2.6), new THREE.Vector3(3, 3, 9.5), new THREE.Euler(0, Math.PI, 0));
    var pmrem = new THREE.PMREMGenerator(renderer);
    var tex = pmrem.fromScene(envScene, 0.035).texture;
    pmrem.dispose();
    return tex;
  }

  /**
   * createStage({ root, canvas, fov, target, distance, yaw, onFrame })
   * root: the .stage element (gets .no-webgl if unsupported)
   */
  function createStage(o) {
    if (typeof THREE === "undefined" || !hasWebGL()) {
      if (o.root) o.root.classList.add("no-webgl");
      return null;
    }
    var canvas = o.canvas;
    var holder = canvas.parentElement;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    // the environment map (PMREM) is built lazily on the first visible frame, so pages load fast
    scene.add(new THREE.HemisphereLight(0xc4d6ff, 0x1a0f1e, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(4, 9, 6); scene.add(key);
    var rim = new THREE.DirectionalLight(0x7cc4ff, 0.8); rim.position.set(-5, 6, -6); scene.add(rim);

    var camera = new THREE.PerspectiveCamera(o.fov || 35, 1, 0.1, 200);
    var target = o.target || new THREE.Vector3(0, 1, 0);
    var baseDist = o.distance || 10;
    var rig = new THREE.Group(); scene.add(rig);

    var stage = {
      renderer: renderer, scene: scene, camera: camera, rig: rig, target: target,
      yaw: o.yaw || 0, pitch: o.pitch || 0.18, dist: baseDist, zoom: 1, visible: true, reduceMotion: reduceMotion,
      clock: new THREE.Clock(), fitHeight: o.fitHeight || null, fitWidth: o.fitWidth || null
    };

    // ---- input: one-finger horizontal drag orbits (yaw, clamped); two-finger pinch zooms & pans ----
    var dragging = false, lastX = 0, vel = 0;
    var minYaw = o.minYaw != null ? o.minYaw : -0.9, maxYaw = o.maxYaw != null ? o.maxYaw : 0.9;
    var ZMIN = 0.45, ZMAX = 1.7;
    var pointers = {}, pinch = null;
    function ptrList() { return Object.keys(pointers).map(function (k) { return pointers[k]; }); }
    canvas.addEventListener("pointerdown", function (e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
      var l = ptrList();
      if (l.length === 2) {
        dragging = false;
        pinch = { d: Math.hypot(l[0].x - l[1].x, l[0].y - l[1].y), z: stage.zoom, mx: (l[0].x + l[1].x) / 2, my: (l[0].y + l[1].y) / 2 };
      } else if (l.length === 1 && !o.noOrbit) { dragging = true; lastX = e.clientX; }
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var l = ptrList();
      if (pinch && l.length >= 2) {
        var d = Math.hypot(l[0].x - l[1].x, l[0].y - l[1].y);
        stage.setZoom(pinch.z * pinch.d / Math.max(20, d));
        var mx = (l[0].x + l[1].x) / 2, my = (l[0].y + l[1].y) / 2;
        panBy(mx - pinch.mx, my - pinch.my);
        pinch.mx = mx; pinch.my = my;
        return;
      }
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX; vel = dx * 0.006; stage.yaw += vel;
    });
    function end(e) {
      delete pointers[e.pointerId];
      if (ptrList().length < 2) pinch = null;
      if (!ptrList().length) dragging = false;
    }
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
    // trackpad pinch arrives as ctrl+wheel; a plain wheel keeps scrolling the page
    canvas.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      stage.setZoom(stage.zoom * Math.exp(e.deltaY * 0.01));
    }, { passive: false });

    // pan the look-at point in the camera plane (only meaningful when zoomed in)
    var panRight = new THREE.Vector3(), panUp = new THREE.Vector3();
    function panBy(dxPx, dyPx) {
      var h = holder.clientHeight || 1;
      var worldPerPx = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * stage.dist * stage.zoom / h;
      panRight.setFromMatrixColumn(camera.matrixWorld, 0);
      panUp.setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(panRight, -dxPx * worldPerPx).addScaledVector(panUp, dyPx * worldPerPx);
      clampTarget();
    }
    function clampTarget() {
      if (!stage.fitBox) return;
      var b = stage.fitBox;
      target.x = Math.max(b.min.x, Math.min(b.max.x, target.x));
      target.y = Math.max(b.min.y, Math.min(b.max.y, target.y));
      target.z = Math.max(b.min.z, Math.min(b.max.z, target.z));
    }

    stage.setZoom = function (z) {
      stage.zoom = Math.max(ZMIN, Math.min(ZMAX, z));
      // ease the look-at point back to the framed centre as you zoom out
      if (stage.zoom >= 0.98 && stage.fitTarget) target.lerp(stage.fitTarget, 0.35);
    };
    var homeYaw = stage.yaw, basePitch = stage.pitch;
    stage.recentre = function () {
      stage.zoom = 1; stage.yaw = homeYaw; vel = 0;
      if (stage.fitTarget) target.copy(stage.fitTarget);
    };

    // ---- framing: fit the apparatus (not the table top) into the viewport, whatever the aspect ----
    // Big thin slabs (bench tops, floors) are ignored so the camera frames the kit sitting on them.
    function computeFitBox() {
      var boxes = [], all = new THREE.Box3();
      rig.updateWorldMatrix(true, true);
      (function walk(ob) {
        if (!ob.visible || ob.userData.noFit) return;
        if ((ob.isMesh || ob.isSprite || ob.isLine || ob.isPoints) && ob.geometry) {
          var b = new THREE.Box3().setFromObject(ob);
          if (!b.isEmpty() && isFinite(b.min.x)) { boxes.push(b); all.union(b); }
        }
        ob.children.forEach(walk);
      })(rig);
      if (!boxes.length) return null;
      var allFp = Math.max(1e-6, (all.max.x - all.min.x) * (all.max.z - all.min.z));
      var fit = new THREE.Box3(), sz = new THREE.Vector3();
      boxes.forEach(function (b) {
        b.getSize(sz);
        if (sz.y < 0.35 && sz.x * sz.z > allFp * 0.3) return; // a slab
        fit.union(b);
      });
      return fit.isEmpty() ? all : fit;
    }
    var corner = new THREE.Vector3();
    var ext = { x0: 0, x1: 0, y0: 0, y1: 0 };
    // ov = px covered by caption overlays at the top of the canvas; content is centred in the space below them
    function fits(d, margin, ov, h, ob) {
      camera.position.set(
        target.x + Math.sin(stage.yaw) * Math.cos(stage.pitch) * d,
        target.y + Math.sin(stage.pitch) * d,
        target.z + Math.cos(stage.yaw) * Math.cos(stage.pitch) * d
      );
      camera.lookAt(target); camera.updateMatrixWorld(true);
      var b = stage.fitBox, my = margin.y * (h - ov - ob) / h; // setViewOffset later moves the frame into the band between the overlays
      ext.x0 = ext.y0 = Infinity; ext.x1 = ext.y1 = -Infinity;
      for (var i = 0; i < 8; i++) {
        corner.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera);
        if (corner.z > 1) return false;
        ext.x0 = Math.min(ext.x0, corner.x); ext.x1 = Math.max(ext.x1, corner.x);
        ext.y0 = Math.min(ext.y0, corner.y); ext.y1 = Math.max(ext.y1, corner.y);
        if (Math.abs(corner.x) > margin.x || Math.abs(corner.y) > my) return false;
      }
      return true;
    }
    function autoFitDistance(ov, h, ob) {
      if (!stage.fitBox) return null;
      var lo = 0.4, hi = 80, margin = { x: o.fitMarginX || 0.92, y: o.fitMarginY || 0.9 };
      if (!fits(hi, margin, ov, h, ob)) return null;
      for (var k = 0; k < 28; k++) { var mid = (lo + hi) / 2; if (fits(mid, margin, ov, h, ob)) hi = mid; else lo = mid; }
      fits(hi, margin, ov, h, ob); // leave ext describing the final framing
      return hi;
    }
    function topOverlay(h) {
      var ov = 0;
      Array.prototype.forEach.call(holder.children, function (c) {
        if (c === canvas || c.classList.contains("stage-zoom") || c.classList.contains("stage-toast") || c.classList.contains("stage-fallback")) return;
        var cs = getComputedStyle(c);
        if (cs.position !== "absolute" || cs.display === "none" || cs.visibility === "hidden") return;
        var top = c.offsetTop, bot = top + c.offsetHeight;
        if (top < h * 0.3 && c.offsetWidth > holder.clientWidth * 0.4) ov = Math.max(ov, bot + 6);
      });
      return Math.min(ov, h * 0.35);
    }
    function boostLabels() {
      var k = holder.clientWidth < 560 ? (o.labelBoost || 1.15) : 1;
      rig.traverse(function (ob) {
        if (!ob.isSprite || !ob.material || !ob.material.map || !ob.material.map.userData || !ob.material.map.userData.aspect) return;
        var prev = ob.userData._boost || 1;
        if (prev !== k) { ob.scale.multiplyScalar(k / prev); ob.userData._boost = k; }
      });
    }
    stage.refit = function () {
      if (o.autoFit === false) return;
      boostLabels();
      stage.fitBox = computeFitBox();
      if (!stage.fitBox) return;
      stage.fitTarget = stage.fitBox.getCenter(new THREE.Vector3());
      // keep the author's look-at height if it's inside the kit, otherwise use the kit's centre
      if (o.target && o.target.y >= stage.fitBox.min.y && o.target.y <= stage.fitBox.max.y) stage.fitTarget.y = (stage.fitTarget.y + o.target.y) / 2;
      target.copy(stage.fitTarget);
      resize();
    };

    function resize() {
      var w = holder.clientWidth, h = holder.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.clearViewOffset();
      camera.updateProjectionMatrix();
      // portrait / square phones: look down a little more so the bench's depth fills the height
      var boost = o.portraitPitch != null ? o.portraitPitch : 0.26;
      var t = Math.max(0, Math.min(1, (1.25 - camera.aspect) / 0.5));
      stage.pitch = Math.min(1.15, basePitch + boost * t);
      var vFov = THREE.MathUtils.degToRad(camera.fov);
      var d = baseDist;
      var ov = stage.fitBox ? topOverlay(h) : 0;
      var ob = o.zoomUi !== false ? 46 : 0; // keep the zoom buttons off the apparatus
      var fitD = stage.fitBox ? autoFitDistance(ov, h, ob) : null;
      if (fitD) {
        d = fitD;
        // phones: trim the canvas to the kit's shape so there's no dead band under a wide bench
        if (o.adaptiveHeight !== false && w < 720 && !holder.classList.contains("sk-fixed")) {
          var contentPx = (ext.y1 - ext.y0) / 2 * h;
          var want = Math.round(contentPx / (o.fitMarginY || 0.9) + ov + ob + 8);
          var minH = o.minHeight || 250, maxH = o.maxHeight || Math.max(h, 420);
          want = Math.max(minH, Math.min(maxH, want));
          if (Math.abs(want - h) > 6 && !holder._skLock) {
            holder._skLock = true; // one adjustment per layout, then let the observer settle
            holder.style.height = want + "px";
            setTimeout(function () { holder._skLock = false; }, 300);
            return; // ResizeObserver calls back with the new size
          }
        }
        if (ov || ob) { camera.setViewOffset(w, h, 0, -(ov - ob) / 2, w, h); }
      } else {
        if (stage.fitHeight) d = Math.max(d * 0, (stage.fitHeight / 2) / Math.tan(vFov / 2));
        if (stage.fitWidth) {
          var hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
          d = Math.max(d, (stage.fitWidth / 2) / Math.tan(hFov / 2));
        }
      }
      stage.dist = d;
    }

    // zoom / recentre buttons
    if (o.zoomUi !== false) {
      var zui = document.createElement("div");
      zui.className = "stage-zoom";
      zui.innerHTML =
        '<button type="button" data-z="in" aria-label="Zoom in">+</button>' +
        '<button type="button" data-z="out" aria-label="Zoom out">−</button>' +
        '<button type="button" data-z="home" aria-label="Recentre view"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button>';
      zui.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        var z = b.getAttribute("data-z");
        if (z === "in") stage.setZoom(stage.zoom / 1.25);
        else if (z === "out") stage.setZoom(stage.zoom * 1.25);
        else stage.recentre();
      });
      holder.appendChild(zui);
    }
    stage.resize = resize;
    if (window.ResizeObserver) new ResizeObserver(resize).observe(holder); else window.addEventListener("resize", resize);
    resize();

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (en) { stage.visible = en[0].isIntersecting; }, { threshold: 0.01 }).observe(holder);
    }

    // project an Object3D (or array / Box3) to a viewport rect
    var box = new THREE.Box3(), v = new THREE.Vector3();
    stage.rectOf = function (objs, pad) {
      var cr = canvas.getBoundingClientRect();
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      (Array.isArray(objs) ? objs : [objs]).forEach(function (obj) {
        if (!obj) return;
        if (obj.isVector3) { box.setFromCenterAndSize(obj, new THREE.Vector3(0.01, 0.01, 0.01)); }
        else { obj.updateWorldMatrix(true, true); box.setFromObject(obj); }
        if (box.isEmpty()) return;
        for (var i = 0; i < 8; i++) {
          v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
          var x = cr.left + (v.x * 0.5 + 0.5) * cr.width, y = cr.top + (-v.y * 0.5 + 0.5) * cr.height;
          minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        }
      });
      if (minX === Infinity) return null;
      pad = pad || 0;
      return { left: minX - pad, top: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
    };

    // raycast helper for clicks
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    stage.pick = function (e, objects) {
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      var hit = ray.intersectObjects(objects, true)[0];
      return hit || null;
    };

    function frame() {
      requestAnimationFrame(frame);
      var dt = Math.min(stage.clock.getDelta(), 0.05);
      if (!stage.visible || document.hidden) return;
      if (!stage.envDone) { stage.envDone = true; if (!stage.envOff && !scene.environment) scene.environment = buildEnvironment(renderer); }
      if (!dragging) { vel *= 0.9; stage.yaw += vel; }
      stage.yaw = Math.max(minYaw, Math.min(maxYaw, stage.yaw));
      var d = stage.dist * stage.zoom;
      camera.position.set(
        target.x + Math.sin(stage.yaw) * Math.cos(stage.pitch) * d,
        target.y + Math.sin(stage.pitch) * d,
        target.z + Math.cos(stage.yaw) * Math.cos(stage.pitch) * d
      );
      camera.lookAt(target);
      if (o.onFrame) o.onFrame(dt, stage.clock.elapsedTime);
      renderer.render(scene, camera);
    }
    stage.start = function () {
      // content is built by now, so frame it
      if (o.autoFit !== false) { stage.refit(); homeYaw = stage.yaw; }
      requestAnimationFrame(frame);
    };
    return stage;
  }

  window.SceneKit = {
    hasWebGL: hasWebGL, createStage: createStage, radialTexture: radialTexture,
    labelTexture: labelTexture, glowSprite: glowSprite, reduceMotion: reduceMotion
  };
})();
