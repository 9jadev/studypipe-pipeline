/* Kit: mass-spring (3D) — vertical helical spring + hanging mass executing SHM. */
(function () {
  window.StudyPipeKits = window.StudyPipeKits || {};

  var DEFAULTS = { mass_kg: 0.5, k_Npm: 50, amplitude_m: 0.12 };

  window.StudyPipeKits["mass-spring"] = {
    mount: function (container, params, api) {
      var THREE = window.THREE;
      var p = Object.assign({}, DEFAULTS, params || {});
      api = api || { emit: function () {} };

      container.classList.add("kit-mass-spring");
      container.style.position = "relative";

      var readout = document.createElement("div");
      readout.style.cssText = "position:absolute;left:8px;right:8px;top:8px;z-index:2;color:#e8eef5;font:13px/1.35 system-ui;background:rgba(14,22,32,.84);padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.12);pointer-events:none";
      container.appendChild(readout);

      var ui = document.createElement("div");
      ui.style.cssText = "position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:6px;flex-wrap:wrap;z-index:2";
      container.appendChild(ui);

      function button(label, bg) {
        var b = document.createElement("button");
        b.textContent = label;
        b.style.cssText = "min-height:44px;padding:0 12px;border-radius:22px;border:0;background:" + (bg || "#1f5e8c") + ";color:#fff;font:600 13px system-ui;cursor:pointer";
        ui.appendChild(b);
        return b;
      }

      var pullBtn = button("Pull & Release", "#1e7d4f");
      var massBtn = button("Mass: " + p.mass_kg.toFixed(1) + " kg", "#1f5e8c");
      var kBtn = button("Spring k: " + p.k_Npm + " N/m", "#2b4c6f");
      var resetBtn = button("Reset", "#455a64");

      // 3D Scene
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0e1620);
      var camera = new THREE.PerspectiveCamera(45, 1, 0.01, 50);
      camera.position.set(0, -0.05, 2.3);
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, -0.05, 0);
      controls.enablePan = false;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.15));
      var dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(1.5, 2, 2);
      scene.add(dir);

      var steel = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.7, roughness: 0.3 });
      var topBeam = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.2), steel);
      topBeam.position.set(0, 0.68, 0);
      scene.add(topBeam);

      // Equilibrium reference line (off to the side so it never covers moving mass)
      var eqGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.38, -0.1, 0), new THREE.Vector3(-0.16, -0.1, 0)]);
      var eqLine = new THREE.Line(eqGeo, new THREE.LineBasicMaterial({ color: 0x66bb6a }));
      scene.add(eqLine);

      // Helical spring line
      var springPts = 140;
      var springGeo = new THREE.BufferGeometry();
      var positions = new Float32Array(springPts * 3);
      springGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      var springLine = new THREE.Line(springGeo, new THREE.LineBasicMaterial({ color: 0x90caf9 }));
      scene.add(springLine);

      // Hanging mass block
      var massMat = new THREE.MeshStandardMaterial({ color: 0xffa726, metalness: 0.5, roughness: 0.35 });
      var massMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.18, 28), massMat);
      scene.add(massMesh);

      var yTop = 0.66, yEq = -0.10;
      var yDisp = -p.amplitude_m, vY = 0, running = false, elapsed = 0;

      function updateSpringAndMass() {
        var yMassTop = yEq + yDisp + 0.09;
        var coils = 10, radius = 0.075;
        for (var i = 0; i < springPts; i++) {
          var frac = i / (springPts - 1);
          var angle = frac * coils * Math.PI * 2;
          var r = (i < 4 || i > springPts - 5) ? 0 : radius;
          positions[i * 3] = Math.cos(angle) * r;
          positions[i * 3 + 1] = yTop - frac * (yTop - yMassTop);
          positions[i * 3 + 2] = Math.sin(angle) * r;
        }
        springGeo.attributes.position.needsUpdate = true;
        massMesh.position.set(0, yEq + yDisp, 0);
        var s = 0.85 + 0.3 * p.mass_kg;
        massMesh.scale.set(s, s, s);
      }

      function getT() { return 2 * Math.PI * Math.sqrt(p.mass_kg / p.k_Npm); }

      function drawReadout() {
        var T = getT();
        var omega = 2 * Math.PI / T;
        readout.innerHTML = "<b>T = 2π√(m / k)</b> · m = <b>" + p.mass_kg.toFixed(2) + " kg</b> · k = <b>" + p.k_Npm + " N/m</b>" +
          "<br>Period <b>T = " + T.toFixed(2) + " s</b> · ω = " + omega.toFixed(1) + " rad/s · " +
          (running ? "t = " + elapsed.toFixed(2) + " s (bouncing in SHM)" : "Tap <b>Pull & Release</b> to start");
      }

      function reset() {
        running = false;
        elapsed = 0;
        yDisp = -p.amplitude_m;
        vY = 0;
        updateSpringAndMass();
        drawReadout();
      }

      pullBtn.onclick = function () {
        yDisp = -p.amplitude_m;
        vY = 0;
        elapsed = 0;
        running = true;
        api.emit("timed", { mass_kg: p.mass_kg, k_Npm: p.k_Npm, period_s: +getT().toFixed(3) });
        drawReadout();
      };
      massBtn.onclick = function () {
        var opts = [0.25, 0.50, 1.00];
        p.mass_kg = opts[(opts.indexOf(p.mass_kg) + 1) % opts.length] || 0.50;
        massBtn.textContent = "Mass: " + p.mass_kg.toFixed(2) + " kg";
        reset();
        running = true;
      };
      kBtn.onclick = function () {
        var opts = [25, 50, 100];
        p.k_Npm = opts[(opts.indexOf(p.k_Npm) + 1) % opts.length] || 50;
        kBtn.textContent = "Spring k: " + p.k_Npm + " N/m";
        reset();
        running = true;
      };
      resetBtn.onclick = reset;

      var raf = 0, last = performance.now();
      function frame(now) {
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (running) {
          var steps = 8, h = dt / steps;
          var omega2 = p.k_Npm / p.mass_kg;
          for (var i = 0; i < steps; i++) {
            vY += -omega2 * yDisp * h;
            yDisp += vY * h;
          }
          elapsed += dt;
          updateSpringAndMass();
          drawReadout();
        }
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      }

      function resize() {
        var w = container.clientWidth || 360, h = container.clientHeight || 360;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      var ro = new ResizeObserver(resize);
      ro.observe(container);
      resize();
      reset();
      raf = requestAnimationFrame(frame);

      return {
        destroy: function () {
          cancelAnimationFrame(raf);
          ro.disconnect();
          controls.dispose();
          scene.traverse(function (o) {
            if (o.geometry) o.geometry.dispose();
            if (o.material) o.material.dispose();
          });
          renderer.dispose();
          container.innerHTML = "";
        }
      };
    }
  };
})();
