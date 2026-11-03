/* Kit: shm-kinematics-2d — 2D SVG/Canvas interactive kit for SHM arrows, circular shadow, v & a graphs, and damping/resonance. */
(function () {
  window.StudyPipeKits = window.StudyPipeKits || {};

  var DEFAULTS = { mode: "arrows", amplitude_m: 0.10, period_s: 2.0 };

  window.StudyPipeKits["shm-kinematics-2d"] = {
    mount: function (container, params, api) {
      var p = Object.assign({}, DEFAULTS, params || {});
      api = api || { emit: function () {} };

      container.classList.add("kit-shm-kinematics-2d");
      container.style.cssText = "position:relative;background:#0e1620;color:#e8eef5;font:13px system-ui;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden";

      var readout = document.createElement("div");
      readout.style.cssText = "padding:6px 10px;background:rgba(20,30,44,.9);border-bottom:1px solid rgba(255,255,255,.1);font-size:12.5px;line-height:1.35;z-index:2";
      container.appendChild(readout);

      var canvas = document.createElement("canvas");
      canvas.style.cssText = "width:100%;height:190px;display:block";
      container.appendChild(canvas);
      var ctx = canvas.getContext("2d");

      var ui = document.createElement("div");
      ui.style.cssText = "padding:6px 8px;display:flex;gap:6px;flex-wrap:wrap;background:rgba(14,22,32,.9);border-top:1px solid rgba(255,255,255,.1);z-index:2";
      container.appendChild(ui);

      function button(label, bg) {
        var b = document.createElement("button");
        b.textContent = label;
        b.style.cssText = "min-height:44px;padding:0 12px;border-radius:22px;border:0;background:" + (bg || "#1f5e8c") + ";color:#fff;font:600 12.5px system-ui;cursor:pointer";
        ui.appendChild(b);
        return b;
      }

      var running = true, t = 0;
      var damping = false, resMode = "damped", ampFactor = 1.0;

      if (p.mode === "arrows") {
        var playBtn = button("Pause / Play", "#1e7d4f");
        var leftBtn = button("Hold at −A", "#1f5e8c");
        var midBtn = button("Hold at O", "#2b4c6f");
        var rightBtn = button("Hold at +A", "#1f5e8c");
        playBtn.onclick = function () { running = !running; api.emit("interacted", { mode: p.mode, action: "toggle" }); };
        leftBtn.onclick = function () { running = false; t = 3 * p.period_s / 4; draw(); };
        midBtn.onclick = function () { running = false; t = 0; draw(); };
        rightBtn.onclick = function () { running = false; t = p.period_s / 4; draw(); };
      } else if (p.mode === "circle") {
        var playC = button("Pause / Play", "#1e7d4f");
        var fastC = button("Speed ×2 (T = 1.0 s)", "#1f5e8c");
        var rstC = button("Reset", "#455a64");
        playC.onclick = function () { running = !running; };
        fastC.onclick = function () {
          p.period_s = p.period_s > 1.5 ? 1.0 : 2.0;
          fastC.textContent = p.period_s > 1.5 ? "Speed ×2 (T = 1.0 s)" : "Normal (T = 2.0 s)";
          api.emit("interacted", { mode: p.mode, action: "speed" });
        };
        rstC.onclick = function () { t = 0; p.period_s = 2.0; running = true; };
      } else if (p.mode === "va") {
        var playVA = button("Pause / Play", "#1e7d4f");
        var maxVBtn = button("Jump to vmax (O)", "#1f5e8c");
        var maxABtn = button("Jump to amax (+A)", "#6a4c93");
        var rstVA = button("Reset", "#455a64");
        playVA.onclick = function () { running = !running; };
        maxVBtn.onclick = function () { running = false; t = 0; draw(); };
        maxABtn.onclick = function () { running = false; t = p.period_s / 4; draw(); };
        rstVA.onclick = function () { t = 0; running = true; };
      } else if (p.mode === "resonance") {
        var dampBtn = button("Damped swing", "#1f5e8c");
        var resBtn = button("Push in time (Resonance!)", "#1e7d4f");
        var bartonBtn = button("Barton's pendulums", "#6a4c93");
        dampBtn.onclick = function () { resMode = "damped"; t = 0; ampFactor = 1.0; running = true; api.emit("interacted", { mode: "resonance", action: "damped" }); };
        resBtn.onclick = function () { resMode = "resonant"; t = 0; ampFactor = 0.25; running = true; api.emit("interacted", { mode: "resonance", action: "resonant" }); };
        bartonBtn.onclick = function () { resMode = "barton"; t = 0; running = true; api.emit("interacted", { mode: "resonance", action: "barton" }); };
      }

      function drawArrow(x1, y1, x2, y2, color, label) {
        var dx = x2 - x1, dy = y2 - y1;
        var len = Math.hypot(dx, dy);
        if (len < 3) return;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        var ang = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 8 * Math.cos(ang - 0.45), y2 - 8 * Math.sin(ang - 0.45));
        ctx.lineTo(x2 - 8 * Math.cos(ang + 0.45), y2 - 8 * Math.sin(ang + 0.45));
        ctx.closePath();
        ctx.fill();
        if (label) {
          ctx.font = "bold 11px system-ui";
          ctx.fillText(label, (x1 + x2) / 2 - 10, y1 - 8);
        }
      }

      function draw() {
        var w = canvas.clientWidth || 340, h = canvas.clientHeight || 210;
        if (canvas.width !== w * 2 || canvas.height !== h * 2) {
          canvas.width = w * 2;
          canvas.height = h * 2;
        }
        ctx.save();
        ctx.scale(2, 2);
        ctx.clearRect(0, 0, w, h);

        var omega = 2 * Math.PI / p.period_s;
        var phase = omega * t;
        var s = Math.sin(phase), c = Math.cos(phase);
        var xVal = p.amplitude_m * s;
        var vVal = p.amplitude_m * omega * c;
        var aVal = -p.amplitude_m * omega * omega * s;

        if (p.mode === "arrows") {
          readout.innerHTML = "<b>SHM Condition: a = −ω²x</b> · Displacement x = <b>" + (xVal * 100).toFixed(1) + " cm</b> · Accel a = <b>" + aVal.toFixed(2) + " m/s²</b>" +
            "<br>Red acceleration arrow always points back to equilibrium <b>O</b>!";
          var cx = w * 0.36, cy = h * 0.48, maxPx = Math.min(w * 0.26, 85);
          var bx = cx + s * maxPx;
          // Track & labels
          ctx.strokeStyle = "#37474f"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cx - maxPx, cy); ctx.lineTo(cx + maxPx, cy); ctx.stroke();
          ctx.fillStyle = "#9fb0c2"; ctx.font = "11px system-ui";
          ctx.fillText("−A", cx - maxPx - 8, cy + 24);
          ctx.fillText("O", cx - 4, cy + 24);
          ctx.fillText("+A", cx + maxPx - 8, cy + 24);
          // Bob
          ctx.fillStyle = "#ffd54f";
          ctx.beginPath(); ctx.arc(bx, cy, 11, 0, Math.PI * 2); ctx.fill();
          // Acceleration arrow pointing to O
          drawArrow(bx, cy - 16, bx - s * maxPx * 0.85, cy - 16, "#ef5350", "a");
          // Mini a vs x graph on the right
          var gx = w * 0.78, gy = h * 0.5, gr = Math.min(w * 0.16, 48);
          ctx.strokeStyle = "#546e7a"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(gx - gr, gy); ctx.lineTo(gx + gr, gy); ctx.moveTo(gx, gy - gr); ctx.lineTo(gx, gy + gr); ctx.stroke();
          ctx.strokeStyle = "#ef5350"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(gx - gr * 0.85, gy - gr * 0.85); ctx.lineTo(gx + gr * 0.85, gy + gr * 0.85); ctx.stroke();
          ctx.fillStyle = "#ffd54f";
          ctx.beginPath(); ctx.arc(gx + s * gr * 0.8, gy + s * gr * 0.8, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#e8eef5"; ctx.font = "10px system-ui";
          ctx.fillText("a vs x (slope = −ω²)", gx - gr, gy - gr - 6);
        } else if (p.mode === "circle") {
          readout.innerHTML = "<b>SHM = Shadow of Uniform Circular Motion</b> · Radius = Amplitude <b>A = " + (p.amplitude_m * 100).toFixed(0) + " cm</b>" +
            "<br>Period T = <b>" + p.period_s.toFixed(1) + " s</b> · Angular frequency ω = 2π/T = <b>" + omega.toFixed(2) + " rad/s</b>";
          var wx = w * 0.32, wy = h * 0.52, R = Math.min(w * 0.2, h * 0.34, 62);
          var px = wx + R * c, py = wy - R * s;
          // Wheel
          ctx.strokeStyle = "#455a64"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(wx, wy, R, 0, Math.PI * 2); ctx.stroke();
          // Radius A
          ctx.strokeStyle = "#90caf9"; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(px, py); ctx.stroke();
          ctx.fillStyle = "#90caf9"; ctx.font = "11px system-ui"; ctx.fillText("A", (wx + px) / 2 + 4, (wy + py) / 2);
          // Projection dashed line
          var sx = w * 0.72;
          ctx.setLineDash([4, 3]); ctx.strokeStyle = "#ffd54f";
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, py); ctx.stroke();
          ctx.setLineDash([]);
          // Peg
          ctx.fillStyle = "#42a5f5"; ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
          // Shadow wall & moving shadow bob
          ctx.strokeStyle = "#78909c"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(sx, wy - R - 10); ctx.lineTo(sx, wy + R + 10); ctx.stroke();
          ctx.fillStyle = "#ffd54f"; ctx.beginPath(); ctx.arc(sx, py, 9, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#e8eef5"; ctx.font = "10.5px system-ui";
          ctx.fillText("Rotating peg", wx - 32, wy + R + 18);
          ctx.fillText("SHM Shadow", sx - 28, wy + R + 18);
        } else if (p.mode === "va") {
          readout.innerHTML = "<b>x = " + (xVal * 100).toFixed(1) + " cm</b> · <span style='color:#66bb6a'><b>v = " + vVal.toFixed(2) + " m/s</b></span> · <span style='color:#ef5350'><b>a = " + aVal.toFixed(2) + " m/s²</b></span>" +
            "<br>At centre O: <b>v is max, a = 0</b>. At ends ±A: <b>v = 0, a is max</b>.";
          var ox = w * 0.5, oy = h * 0.32, span = Math.min(w * 0.34, 105);
          var curX = ox + s * span;
          ctx.strokeStyle = "#37474f"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(ox - span, oy); ctx.lineTo(ox + span, oy); ctx.stroke();
          ctx.fillStyle = "#9fb0c2"; ctx.font = "10px system-ui";
          ctx.fillText("−A", ox - span - 6, oy + 20); ctx.fillText("O", ox - 3, oy + 20); ctx.fillText("+A", ox + span - 6, oy + 20);
          ctx.fillStyle = "#ffd54f"; ctx.beginPath(); ctx.arc(curX, oy, 10, 0, Math.PI * 2); ctx.fill();
          drawArrow(curX, oy - 15, curX + c * span * 0.65, oy - 15, "#66bb6a", "v");
          drawArrow(curX, oy + 15, curX - s * span * 0.65, oy + 15, "#ef5350", "a");
          // Live x-t sine wave below
          var wy0 = h * 0.74, wx0 = 28, wLen = w - 50;
          ctx.strokeStyle = "#455a64"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(wx0, wy0); ctx.lineTo(wx0 + wLen, wy0); ctx.stroke();
          ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 2;
          ctx.beginPath();
          for (var i = 0; i <= 80; i++) {
            var u = i / 80;
            var yy = wy0 - Math.sin(phase - (1 - u) * Math.PI * 2) * 22;
            if (i === 0) ctx.moveTo(wx0 + u * wLen, yy); else ctx.lineTo(wx0 + u * wLen, yy);
          }
          ctx.stroke();
          ctx.fillStyle = "#e8eef5"; ctx.fillText("x–t wave", wx0, wy0 - 26);
        } else if (p.mode === "resonance") {
          if (resMode === "damped") {
            var env = Math.exp(-0.22 * t);
            readout.innerHTML = "<b>Damped Oscillation:</b> Air resistance removes energy → amplitude decays slowly." +
              "<br>Current amplitude: <b>" + Math.round(env * 100) + "%</b> of initial";
            var gx0 = 24, gy0 = h * 0.52, gw = w - 44, gh = h * 0.34;
            ctx.strokeStyle = "#455a64"; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0 + gw, gy0); ctx.stroke();
            // Envelope
            ctx.setLineDash([3, 3]); ctx.strokeStyle = "#ffa726";
            ctx.beginPath();
            for (var j = 0; j <= 80; j++) {
              var u2 = j / 80;
              var e2 = Math.exp(-2.2 * u2) * gh;
              if (j === 0) ctx.moveTo(gx0 + u2 * gw, gy0 - e2); else ctx.lineTo(gx0 + u2 * gw, gy0 - e2);
            }
            ctx.stroke(); ctx.setLineDash([]);
            // Decaying wave
            ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 2;
            ctx.beginPath();
            for (var k = 0; k <= 120; k++) {
              var u3 = k / 120;
              var yw = gy0 - Math.exp(-2.2 * u3) * Math.sin(u3 * Math.PI * 8) * gh;
              if (k === 0) ctx.moveTo(gx0 + u3 * gw, yw); else ctx.lineTo(gx0 + u3 * gw, yw);
            }
            ctx.stroke();
          } else if (resMode === "resonant") {
            var grow = Math.min(1.0, 0.2 + t * 0.14);
            readout.innerHTML = "<b>Resonance (f = f₀):</b> Driving pushes match natural frequency → huge amplitude!" +
              "<br>Amplitude grown to <b>" + Math.round(grow * 100) + "%</b> of scale";
            var rx0 = 24, ry0 = h * 0.52, rw = w - 44, rh = h * 0.36;
            ctx.strokeStyle = "#455a64"; ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(rx0 + rw, ry0); ctx.stroke();
            ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2.2;
            ctx.beginPath();
            for (var m = 0; m <= 120; m++) {
              var um = m / 120;
              var ym = ry0 - (0.15 + 0.85 * um) * Math.sin(um * Math.PI * 8) * rh;
              if (m === 0) ctx.moveTo(rx0 + um * rw, ym); else ctx.lineTo(rx0 + um * rw, ym);
            }
            ctx.stroke();
          } else {
            readout.innerHTML = "<b>Barton's Pendulums:</b> Heavy driver X has length <b>L</b>. Pendulum <b>P2 (also length L)</b> has the same natural frequency, so it resonates with the biggest swing!";
            var topY = 26;
            ctx.strokeStyle = "#90caf9"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(24, topY); ctx.lineTo(w - 24, topY); ctx.stroke();
            var items = [
              { label: "Driver X (L)", x: w * 0.18, len: 78, amp: 18, col: "#ffa726" },
              { label: "P1 (short)", x: w * 0.40, len: 48, amp: 5, col: "#90caf9" },
              { label: "P2 (= L, Resonates!)", x: w * 0.64, len: 78, amp: 32, col: "#66bb6a" },
              { label: "P3 (long)", x: w * 0.86, len: 105, amp: 6, col: "#90caf9" }
            ];
            items.forEach(function (it) {
              var dx = Math.sin(phase) * it.amp;
              var bx2 = it.x + dx, by2 = topY + it.len;
              ctx.strokeStyle = "#cfd8dc"; ctx.lineWidth = 1.5;
              ctx.beginPath(); ctx.moveTo(it.x, topY); ctx.lineTo(bx2, by2); ctx.stroke();
              ctx.fillStyle = it.col;
              ctx.beginPath(); ctx.arc(bx2, by2, it.label.indexOf("Driver") === 0 ? 9 : 7, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = "#e8eef5"; ctx.font = "10px system-ui";
              ctx.fillText(it.label, it.x - 24, by2 + 18);
            });
          }
        }
        ctx.restore();
      }

      var raf = 0, last = performance.now();
      function frame(now) {
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (running) {
          t += dt;
          draw();
        }
        raf = requestAnimationFrame(frame);
      }

      var ro = new ResizeObserver(function () { draw(); });
      ro.observe(container);
      draw();
      raf = requestAnimationFrame(frame);

      return {
        destroy: function () {
          cancelAnimationFrame(raf);
          ro.disconnect();
          container.innerHTML = "";
        }
      };
    }
  };
})();
