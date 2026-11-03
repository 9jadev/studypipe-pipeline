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
    g.font = (opts.weight || 700) + " " + fs + "px " + (opts.font || "Manrope, sans-serif");
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
    g.font = (opts.weight || 700) + " " + fs + "px " + (opts.font || "Manrope, sans-serif");
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

    // drag to orbit (yaw only, clamped)
    var dragging = false, lastX = 0, vel = 0;
    var minYaw = o.minYaw != null ? o.minYaw : -0.9, maxYaw = o.maxYaw != null ? o.maxYaw : 0.9;
    canvas.addEventListener("pointerdown", function (e) { if (o.noOrbit) return; dragging = true; lastX = e.clientX; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} });
    canvas.addEventListener("pointermove", function (e) { if (!dragging) return; var dx = e.clientX - lastX; lastX = e.clientX; vel = dx * 0.006; stage.yaw += vel; });
    function end() { dragging = false; }
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);

    function resize() {
      var w = holder.clientWidth, h = holder.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      var vFov = THREE.MathUtils.degToRad(camera.fov);
      var d = baseDist;
      if (stage.fitHeight) d = Math.max(d * 0, (stage.fitHeight / 2) / Math.tan(vFov / 2));
      if (stage.fitWidth) {
        var hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        d = Math.max(d, (stage.fitWidth / 2) / Math.tan(hFov / 2));
      }
      stage.dist = d;
      camera.updateProjectionMatrix();
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
    stage.start = function () { requestAnimationFrame(frame); };
    return stage;
  }

  window.SceneKit = {
    hasWebGL: hasWebGL, createStage: createStage, radialTexture: radialTexture,
    labelTexture: labelTexture, glowSprite: glowSprite, reduceMotion: reduceMotion
  };
})();
