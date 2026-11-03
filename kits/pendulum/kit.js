/* Reference kit v2: simple pendulum (3D) — supports single, dual, cycle, laws, energy, and lab modes. */
(function () {
  window.StudyPipeKits = window.StudyPipeKits || {};

  var DEFAULTS = {
    mode: "single",
    length_m: 0.8,
    angle_deg: 10,
    g: 9.81,
    mass_g: 50,
    show_energy: false,
    slow_motion: 1.0
  };

  window.StudyPipeKits["pendulum"] = {
    mount: function (container, params, api) {
      var THREE = window.THREE;
      var p = Object.assign({}, DEFAULTS, params || {});
      api = api || { emit: function () {} };

      container.classList.add("kit-pendulum");
      container.style.position = "relative";

      // ---------- UI & Readout
      var readout = document.createElement("div");
      readout.style.cssText = "position:absolute;left:8px;right:8px;top:8px;z-index:2;color:#e8eef5;font:13px/1.35 system-ui;background:rgba(14,22,32,.82);padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.12);pointer-events:none";
      container.appendChild(readout);

      var overlay = document.createElement("div");
      overlay.style.cssText = "position:absolute;right:8px;top:64px;z-index:2;color:#fff;font:11.5px system-ui;pointer-events:auto";
      container.appendChild(overlay);

      var ui = document.createElement("div");
      ui.style.cssText = "position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;align-items:center";
      container.appendChild(ui);

      function button(label, bg) {
        var b = document.createElement("button");
        b.textContent = label;
        b.style.cssText = "min-height:44px;padding:0 11px;border-radius:22px;border:0;background:" + (bg || "#1f5e8c") + ";color:#fff;font:600 12.5px system-ui;cursor:pointer";
        ui.appendChild(b);
        return b;
      }

      // ---------- 3D Scene
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0e1620);
      var camera = new THREE.PerspectiveCamera(45, 1, 0.01, 50);
      camera.position.set(0, -0.22, 3.05);
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, -0.28, 0);
      controls.enablePan = false;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.15));
      var dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(1.5, 2.5, 2.5);
      scene.add(dir);

      // Stand + clamp + split cork + bench
      var steel = new THREE.MeshStandardMaterial({ color: 0x9aa4ad, metalness: 0.6, roughness: 0.35 });
      var wood = new THREE.MeshStandardMaterial({ color: 0xb5835a, roughness: 0.7 });
      var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.75, 16), steel);
      rod.position.set(-0.52, -0.25, -0.08);
      scene.add(rod);
      var arm = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.028, 0.028), steel);
      arm.position.set(-0.18, 0.58, -0.08);
      scene.add(arm);
      var cork = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.08), wood);
      cork.position.set(0, 0.56, 0);
      scene.add(cork);
      var base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 0.55), new THREE.MeshStandardMaterial({ color: 0x2a3440 }));
      base.position.set(0, -1.12, 0);
      scene.add(base);

      // Chalk centre mark on bench
      var chalk = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.008, 0.22), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      chalk.position.set(0, -1.095, 0);
      scene.add(chalk);

      // Primary pendulum (pivot 1)
      var pivot = new THREE.Group();
      pivot.position.set(p.mode === "dual" ? -0.18 : 0, 0.55, 0);
      scene.add(pivot);
      var stringMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      var stringGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -p.length_m, 0)]);
      var stringLine = new THREE.Line(stringGeo, stringMat);
      pivot.add(stringLine);
      var bobMat = new THREE.MeshStandardMaterial({ color: 0xd4a72c, metalness: 0.8, roughness: 0.25 });
      var bob = new THREE.Mesh(new THREE.SphereGeometry(p.mode === "dual" ? 0.07 : 0.055, 28, 16), bobMat);
      bob.position.y = -p.length_m;
      pivot.add(bob);

      // Secondary pendulum for dual mode (light bob on equal string)
      var pivot2 = new THREE.Group();
      pivot2.position.set(0.18, 0.55, 0);
      pivot2.visible = p.mode === "dual";
      scene.add(pivot2);
      var stringGeo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -p.length_m, 0)]);
      pivot2.add(new THREE.Line(stringGeo2, stringMat));
      var bob2 = new THREE.Mesh(new THREE.SphereGeometry(0.038, 24, 14),
        new THREE.MeshStandardMaterial({ color: 0x5aa8e0, metalness: 0.6, roughness: 0.3 }));
      bob2.position.y = -p.length_m;
      pivot2.add(bob2);

      // Floor markers for cycle mode (A, O, B)
      var markersGroup = new THREE.Group();
      markersGroup.visible = p.mode === "cycle";
      scene.add(markersGroup);
      var mMatA = new THREE.MeshBasicMaterial({ color: 0xef5350 });
      var mMatO = new THREE.MeshBasicMaterial({ color: 0x66bb6a });
      var mMatB = new THREE.MeshBasicMaterial({ color: 0x42a5f5 });
      var mA = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), mMatA);
      var mO = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), mMatO);
      var mB = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), mMatB);
      markersGroup.add(mA, mO, mB);

      function updateGeometry() {
        stringGeo.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -p.length_m, 0)]);
        bob.position.y = -p.length_m;
        var scale = p.mass_g > 60 ? 1.25 : (p.mass_g < 35 ? 0.8 : 1.0);
        if (p.mode !== "dual") bob.scale.setScalar(scale);
        var rad = p.angle_deg * Math.PI / 180;
        var yFloor = 0.55 - p.length_m - 0.12;
        mA.position.set(p.length_m * Math.sin(rad), yFloor, 0);
        mO.position.set(0, yFloor, 0);
        mB.position.set(-p.length_m * Math.sin(rad), yFloor, 0);
      }

      // ---------- State
      var theta0 = p.angle_deg * Math.PI / 180;
      var theta = theta0, omega = 0, running = false;
      var watchOn = false, watchT = 0, crossings = 0, lastSign = Math.sign(theta || 1);
      var guessMsg = "";
      var labRows = [];

      function getT() { return 2 * Math.PI * Math.sqrt(p.length_m / p.g); }

      function updateEnergyOverlay() {
        if (!p.show_energy && p.mode !== "energy") return;
        var hMax = p.length_m * (1 - Math.cos(theta0)) || 0.0001;
        var hCur = Math.max(0, p.length_m * (1 - Math.cos(theta)));
        var peFrac = Math.min(1, hCur / hMax);
        var keFrac = Math.max(0, 1 - peFrac);
        overlay.innerHTML =
          "<div style='background:rgba(14,22,32,.85);padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,.15);width:108px'>" +
          "<div style='margin-bottom:4px;font-weight:600'>Energy bars</div>" +
          "<div>PE <span style='float:right'>" + Math.round(peFrac * 100) + "%</span></div>" +
          "<div style='height:8px;background:#263238;border-radius:4px;margin:2px 0 6px'><div style='height:100%;width:" + (peFrac * 100) + "%;background:#42a5f5;border-radius:4px'></div></div>" +
          "<div>KE <span style='float:right'>" + Math.round(keFrac * 100) + "%</span></div>" +
          "<div style='height:8px;background:#263238;border-radius:4px;margin:2px 0 6px'><div style='height:100%;width:" + (keFrac * 100) + "%;background:#ffa726;border-radius:4px'></div></div>" +
          "<div>Total <span style='float:right'>100%</span></div>" +
          "<div style='height:8px;background:#66bb6a;border-radius:4px;margin-top:2px'></div>" +
          "</div>";
      }

      function drawReadout() {
        var osc = Math.floor(crossings / 2);
        var Tcalc = getT();
        if (p.mode === "dual") {
          readout.innerHTML = "<b>Heavy bob (gold, 80 kg)</b> vs <b>Light bob (blue, 25 kg)</b> · l = " + p.length_m.toFixed(2) + " m" +
            "<br>" + (guessMsg || "Step 1: Tap your guess below, then release both swings!") +
            (running ? " &nbsp; <b>Swings: " + osc + " · t = " + watchT.toFixed(2) + " s</b>" : "");
        } else if (p.mode === "cycle") {
          var phase = !running ? "At extreme A (ready)" : (crossings === 0 ? "A → O" : (crossings === 1 ? "O → B (½ cycle at B)" : (crossings === 2 ? "B → O → A (1 full cycle!)" : "Cycle complete: A → O → B → O → A")));
          readout.innerHTML = "<b>One complete oscillation:</b> A (red) → O (green) → B (blue) → O → A" +
            "<br>Stage: <b>" + phase + "</b> · t = " + watchT.toFixed(2) + " s (Period T = " + Tcalc.toFixed(2) + " s)";
        } else if (p.mode === "laws") {
          var place = Math.abs(p.g - 9.81) < 0.5 ? "Earth (g = 9.81 m/s²)" : "Moon (g = 1.60 m/s²)";
          readout.innerHTML = "<b>T = 2π√(l / g)</b> · " + place + " · l = <b>" + p.length_m.toFixed(2) + " m</b> · m = " + p.mass_g + " g" +
            "<br>Period <b>T = " + Tcalc.toFixed(2) + " s</b> &nbsp; (stopwatch: " + watchT.toFixed(2) + " s, " + osc + " swings)";
        } else if (p.mode === "energy" || p.show_energy) {
          var posName = Math.abs(theta) < 0.025 ? "Centre O (KE max, PE min)" : (Math.abs(theta) > theta0 * 0.85 ? "Extreme (PE max, KE = 0)" : "Between O and extreme");
          readout.innerHTML = "<b>Energy interchange in SHM</b> · Position: <b>" + posName + "</b>" +
            "<br>θ = " + (theta * 180 / Math.PI).toFixed(1) + "° · Total E = PE + KE = constant";
        } else if (p.mode === "lab") {
          readout.innerHTML = "<b>WAEC Practical (20 oscillations):</b> l = <b>" + p.length_m.toFixed(2) + " m</b> · t = " + watchT.toFixed(2) + " s (" + osc + "/20)" +
            "<br>Recorded lengths: " + (labRows.length ? labRows.map(function (r) { return r.l.toFixed(2) + "m (T²=" + r.T2.toFixed(2) + ")"; }).join(", ") : "none yet — tap Time 20 swings");
        } else {
          readout.innerHTML = "l = <b>" + p.length_m.toFixed(2) + " m</b> · m = <b>" + p.mass_g + " g</b> · θ₀ = <b>" + p.angle_deg + "°</b>" +
            "<br>Stopwatch: <b>" + watchT.toFixed(2) + " s</b> · Oscillations: <b>" + osc + "</b>" +
            (osc >= 1 ? " · Measured T ≈ <b>" + (watchT / osc).toFixed(2) + " s</b>" : "");
        }
        updateEnergyOverlay();
      }

      function reset() {
        theta0 = p.angle_deg * Math.PI / 180;
        theta = theta0;
        omega = 0;
        running = false;
        watchOn = false;
        watchT = 0;
        crossings = 0;
        lastSign = Math.sign(theta || 1);
        updateGeometry();
        pivot.rotation.z = theta;
        pivot2.rotation.z = theta;
        drawReadout();
      }

      // ---------- Mode-specific Controls
      if (p.mode === "dual") {
        var gBoy = button("Guess: Heavy first", "#2b4c6f");
        var gTogether = button("Guess: Together", "#2b4c6f");
        var relBtn = button("Release both", "#1e7d4f");
        var rstBtn = button("Reset", "#455a64");
        gBoy.onclick = function () {
          guessMsg = "You guessed: Heavy boy first. Now tap <b>Release both</b> to test!";
          api.emit("predicted", { choice: "heavy" });
          drawReadout();
        };
        gTogether.onclick = function () {
          guessMsg = "You guessed: Both cross together! Tap <b>Release both</b> to verify.";
          api.emit("predicted", { choice: "together" });
          drawReadout();
        };
        relBtn.onclick = function () {
          reset();
          running = true;
          watchOn = true;
          guessMsg = "Watch closely: both bobs cross the chalk mark at the exact same instant!";
        };
        rstBtn.onclick = reset;
      } else if (p.mode === "cycle") {
        var playCycle = button("Play 1 slow cycle (A→O→B→O→A)", "#1e7d4f");
        var rstCycle = button("Reset", "#455a64");
        playCycle.onclick = function () {
          reset();
          p.slow_motion = 0.35;
          running = true;
          watchOn = true;
        };
        rstCycle.onclick = reset;
      } else if (p.mode === "laws") {
        var lenBtn = button("l: 0.25 m ↔ 1.00 m (×4)", "#1f5e8c");
        var massBtn = button("Mass: 20 g ↔ 100 g", "#1f5e8c");
        var gravBtn = button("Earth ↔ Moon", "#6a4c93");
        var rstLaws = button("Reset", "#455a64");
        lenBtn.onclick = function () {
          p.length_m = Math.abs(p.length_m - 0.25) < 0.05 ? 1.0 : 0.25;
          reset();
          running = true;
          watchOn = true;
        };
        massBtn.onclick = function () {
          p.mass_g = p.mass_g === 20 ? 100 : 20;
          reset();
          running = true;
          watchOn = true;
        };
        gravBtn.onclick = function () {
          p.g = Math.abs(p.g - 9.81) < 0.5 ? 1.6 : 9.81;
          reset();
          running = true;
          watchOn = true;
        };
        rstLaws.onclick = reset;
      } else if (p.mode === "energy" || p.show_energy) {
        var playEn = button("Play / Pause", "#1e7d4f");
        var stepEnd = button("Jump to Extreme A", "#1f5e8c");
        var stepMid = button("Jump to Centre O", "#1f5e8c");
        var rstEn = button("Reset", "#455a64");
        playEn.onclick = function () { running = !running; drawReadout(); };
        stepEnd.onclick = function () { running = false; theta = theta0; omega = 0; pivot.rotation.z = theta; drawReadout(); };
        stepMid.onclick = function () { running = false; theta = 0; omega = theta0 * Math.sqrt(p.g / p.length_m); pivot.rotation.z = 0; drawReadout(); };
        rstEn.onclick = reset;
      } else if (p.mode === "lab") {
        var nextLenBtn = button("Next l (0.4–0.8 m)", "#1f5e8c");
        var time20Btn = button("Time 20 swings (fast)", "#1e7d4f");
        var plotBtn = button("Plot T² vs l & find g", "#6a4c93");
        var rstLab = button("Clear", "#455a64");
        var labLengths = [0.40, 0.50, 0.60, 0.70, 0.80];
        var lIdx = 0;
        p.length_m = labLengths[0];
        nextLenBtn.onclick = function () {
          lIdx = (lIdx + 1) % labLengths.length;
          p.length_m = labLengths[lIdx];
          reset();
        };
        time20Btn.onclick = function () {
          reset();
          running = true;
          var Ttrue = getT();
          var t20 = +(20 * Ttrue).toFixed(2);
          var Tmeas = +(t20 / 20).toFixed(3);
          var T2 = +(Tmeas * Tmeas).toFixed(3);
          watchT = t20;
          crossings = 40;
          var existing = labRows.findIndex(function (r) { return Math.abs(r.l - p.length_m) < 0.01; });
          var row = { l: p.length_m, t: t20, T: Tmeas, T2: T2 };
          if (existing >= 0) labRows[existing] = row; else labRows.push(row);
          labRows.sort(function (a, b) { return a.l - b.l; });
          api.emit("timed", { oscillations: 20, seconds: t20, expected_period: Tmeas });
          drawReadout();
        };
        plotBtn.onclick = function () {
          if (labRows.length < 2) {
            labRows = labLengths.map(function (L) {
              var Tt = 2 * Math.PI * Math.sqrt(L / p.g);
              return { l: L, t: +(20 * Tt).toFixed(1), T: +Tt.toFixed(2), T2: +(Tt * Tt).toFixed(2) };
            });
          }
          var s = 4 * Math.PI * Math.PI / p.g;
          var gVal = 4 * Math.PI * Math.PI / s;
          api.emit("lab_g", { slope: +s.toFixed(2), g_calculated: +gVal.toFixed(2) });
          overlay.innerHTML =
            "<div style='background:rgba(14,22,32,.92);padding:8px 10px;border-radius:8px;border:1px solid #5aa8e0;width:190px;font-size:11.5px'>" +
            "<b>T² vs l Graph (Slope Triangle)</b>" +
            "<svg viewBox='0 0 170 110' style='width:100%;height:auto;margin-top:4px;background:#101822;border-radius:4px'>" +
            "<line x1='24' y1='92' x2='160' y2='92' stroke='#9fb0c2' stroke-width='1'/>" +
            "<line x1='24' y1='10' x2='24' y2='92' stroke='#9fb0c2' stroke-width='1'/>" +
            "<line x1='24' y1='92' x2='152' y2='16' stroke='#42a5f5' stroke-width='2'/>" +
            "<polygon points='45,79 140,79 140,23' fill='rgba(255,167,38,0.18)' stroke='#ffa726' stroke-dasharray='3,2'/>" +
            "<circle cx='56' cy='73' r='3' fill='#66bb6a'/><circle cx='88' cy='54' r='3' fill='#66bb6a'/>" +
            "<circle cx='120' cy='35' r='3' fill='#66bb6a'/><circle cx='152' cy='16' r='3' fill='#66bb6a'/>" +
            "<text x='85' y='105' fill='#e8eef5' font-size='9' text-anchor='middle'>l (m)</text>" +
            "<text x='8' y='52' fill='#e8eef5' font-size='9'>T²</text>" +
            "<text x='95' y='75' fill='#ffa726' font-size='8'>Δl</text>" +
            "<text x='143' y='55' fill='#ffa726' font-size='8'>ΔT²</text>" +
            "</svg>" +
            "<div style='margin-top:4px'>Slope s = ΔT²/Δl = <b>" + s.toFixed(2) + " s²/m</b><br>g = 4π²/s = <b>" + gVal.toFixed(2) + " m/s²</b></div>" +
            "</div>";
          drawReadout();
        };
        rstLab.onclick = function () { labRows = []; overlay.innerHTML = ""; reset(); };
      } else {
        // Default / single explorer mode (backward-compatible with _example-simple-pendulum)
        var startBtn = button("Release bob", "#1e7d4f");
        var watchBtn = button("Start stopwatch", "#1f5e8c");
        var lenCycleBtn = button("Length: " + p.length_m.toFixed(1) + " m", "#2b4c6f");
        var resetBtn = button("Reset", "#455a64");
        startBtn.onclick = function () { running = true; };
        watchBtn.onclick = function () {
          if (!running) running = true;
          watchOn = !watchOn;
          if (watchOn) {
            watchT = 0;
            crossings = 0;
            watchBtn.textContent = "Stop stopwatch";
          } else {
            watchBtn.textContent = "Start stopwatch";
            api.emit("timed", {
              oscillations: Math.floor(crossings / 2),
              seconds: +watchT.toFixed(2),
              expected_period: +getT().toFixed(3)
            });
          }
          drawReadout();
        };
        lenCycleBtn.onclick = function () {
          var opts = [0.4, 0.8, 1.2];
          var next = opts[(opts.indexOf(+p.length_m.toFixed(1)) + 1) % opts.length] || 0.8;
          p.length_m = next;
          lenCycleBtn.textContent = "Length: " + p.length_m.toFixed(1) + " m";
          reset();
        };
        resetBtn.onclick = function () {
          watchBtn.textContent = "Start stopwatch";
          reset();
        };
      }

      // ---------- Animation Loop
      var raf = 0, last = performance.now();
      function frame(now) {
        var dt = Math.min((now - last) / 1000, 0.05) * (p.slow_motion || 1.0);
        last = now;
        if (running) {
          var steps = 8, h = dt / steps;
          for (var i = 0; i < steps; i++) {
            omega += -(p.g / p.length_m) * Math.sin(theta) * h;
            theta += omega * h;
          }
          if (watchOn) {
            watchT += dt;
            var s = Math.sign(theta);
            if (s !== 0 && s !== lastSign) {
              crossings++;
              lastSign = s;
              if (p.mode === "cycle" && crossings >= 2) {
                theta = theta0;
                omega = 0;
                running = false;
                watchOn = false;
              }
            }
          }
          pivot.rotation.z = theta;
          pivot2.rotation.z = theta;
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
