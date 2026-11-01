/* Reference kit: simple pendulum (3D). Shows the kit contract in practice. */
(function () {
  window.StudyPipeKits = window.StudyPipeKits || {};

  var DEFAULTS = { length_m: 0.8, angle_deg: 10, g: 9.81 };

  window.StudyPipeKits["pendulum"] = {
    mount: function (container, params, api) {
      var THREE = window.THREE;
      var p = Object.assign({}, DEFAULTS, params || {});
      api = api || { emit: function () {} };

      // ---------- UI
      container.classList.add("kit-pendulum");
      container.style.position = "relative";
      var ui = document.createElement("div");
      ui.style.cssText = "position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:8px;flex-wrap:wrap;z-index:2";
      function button(label) {
        var b = document.createElement("button");
        b.textContent = label;
        b.style.cssText = "min-height:44px;padding:0 14px;border-radius:22px;border:0;background:#1f5e8c;color:#fff;font:600 15px system-ui";
        ui.appendChild(b); return b;
      }
      var startBtn = button("Release bob");
      var watchBtn = button("Start stopwatch");
      var resetBtn = button("Reset");
      var readout = document.createElement("div");
      readout.style.cssText = "position:absolute;left:8px;top:8px;z-index:2;color:#fff;font:15px system-ui;background:rgba(0,0,0,.45);padding:6px 10px;border-radius:8px";
      container.appendChild(readout);
      container.appendChild(ui);

      // ---------- scene
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0e1620);
      var camera = new THREE.PerspectiveCamera(45, 1, 0.01, 50);
      camera.position.set(0, -0.2, 3.0);
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, -0.25, 0);
      controls.enablePan = false;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.1));
      var dir = new THREE.DirectionalLight(0xffffff, 1.2); dir.position.set(1, 2, 2); scene.add(dir);

      // stand + clamp
      var steel = new THREE.MeshStandardMaterial({ color: 0x9aa4ad, metalness: 0.6, roughness: 0.35 });
      var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.8, 16), steel);
      rod.position.set(-0.45, -0.3, 0); scene.add(rod);
      var arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.03), steel);
      arm.position.set(-0.2, 0.55, 0); scene.add(arm);
      var base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0x3b4652 }));
      base.position.set(-0.3, -1.2, 0); scene.add(base);

      // pivot, string, bob
      var pivot = new THREE.Group(); pivot.position.set(0, 0.55, 0); scene.add(pivot);
      var stringMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      var stringGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -p.length_m, 0)]);
      pivot.add(new THREE.Line(stringGeo, stringMat));
      var bob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 16),
        new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.8, roughness: 0.25 }));
      bob.position.y = -p.length_m; pivot.add(bob);

      // ---------- physics (small-angle numeric integration of the full equation)
      var theta0 = p.angle_deg * Math.PI / 180;
      var theta = theta0, omega = 0, running = false;
      var watchOn = false, watchT = 0, crossings = 0, lastSign = Math.sign(theta);
      var T = 2 * Math.PI * Math.sqrt(p.length_m / p.g);

      function draw() {
        readout.innerHTML = "l = " + p.length_m.toFixed(2) + " m &nbsp; θ₀ = " + p.angle_deg + "°" +
          "<br>stopwatch: " + watchT.toFixed(2) + " s &nbsp; oscillations: " + Math.floor(crossings / 2);
      }

      function reset() {
        theta = theta0; omega = 0; running = false; watchOn = false; watchT = 0; crossings = 0;
        lastSign = Math.sign(theta); watchBtn.textContent = "Start stopwatch"; draw();
      }
      startBtn.onclick = function () { running = true; };
      watchBtn.onclick = function () {
        if (!running) return;
        watchOn = !watchOn;
        if (watchOn) { watchT = 0; crossings = 0; watchBtn.textContent = "Stop stopwatch"; }
        else {
          watchBtn.textContent = "Start stopwatch";
          api.emit("timed", { oscillations: Math.floor(crossings / 2), seconds: +watchT.toFixed(2), expected_period: +T.toFixed(3) });
        }
        draw();
      };
      resetBtn.onclick = reset;

      // ---------- loop
      var raf = 0, last = performance.now();
      function frame(now) {
        var dt = Math.min((now - last) / 1000, 0.05); last = now;
        if (running) {
          var steps = 8, h = dt / steps;
          for (var i = 0; i < steps; i++) { omega += -(p.g / p.length_m) * Math.sin(theta) * h; theta += omega * h; }
          if (watchOn) {
            watchT += dt;
            var s = Math.sign(theta);
            if (s !== 0 && s !== lastSign) { crossings++; lastSign = s; }
          }
          draw();
        }
        pivot.rotation.z = theta;
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      }

      function resize() {
        var w = container.clientWidth || 360, h = container.clientHeight || 400;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      var ro = new ResizeObserver(resize); ro.observe(container); resize();
      reset();
      raf = requestAnimationFrame(frame);

      return {
        destroy: function () {
          cancelAnimationFrame(raf); ro.disconnect(); controls.dispose();
          scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
          renderer.dispose(); container.innerHTML = "";
        }
      };
    }
  };
})();
