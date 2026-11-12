/* ==========================================================
   PlaneGeometryKit — 2D Paper.js Plane Geometry & Triangle Engine
   Canonical 2D Vector Kit for WAEC/NECO/JAMB Mathematics.
   100% Offline via window.paper (kits/_vendor/paper-core.min.js).
   ========================================================== */
(function (global) {
  "use strict";

  if (!global.paper) {
    console.warn("PlaneGeometryKit: window.paper is required. Load paper-core.min.js first.");
  }

  function create(opts) {
    opts = opts || {};
    var container = typeof opts.container === "string" ? document.getElementById(opts.container) : opts.container;
    if (!container) throw new Error("PlaneGeometryKit: valid container element is required");

    // Create or reuse canvas
    var canvas = container.querySelector("canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = opts.width || container.clientWidth || 360;
      canvas.height = opts.height || container.clientHeight || 320;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.touchAction = "none";
      container.appendChild(canvas);
    }

    var paperScope = new global.paper.PaperScope();
    paperScope.setup(canvas);

    var mode = opts.mode || "triangle"; // 'triangle' | 'pythagoras' | 'circle'
    var state = {
      A: new paperScope.Point(opts.A || [60, 240]),
      B: new paperScope.Point(opts.B || [300, 240]),
      C: new paperScope.Point(opts.C || [180, 70]),
      showAngles: opts.showAngles !== false,
      showSides: opts.showSides !== false,
      showGrid: opts.showGrid !== false,
      draggable: opts.draggable !== false,
      color: opts.color || "#6366f1",
      accent: opts.accent || "#06b6d4"
    };

    var layers = {
      grid: new paperScope.Layer(),
      shapes: new paperScope.Layer(),
      annotations: new paperScope.Layer(),
      handles: new paperScope.Layer()
    };

    function dist(p1, p2) {
      return p1.getDistance(p2);
    }

    // Interior angle at vertex B between BA and BC (degrees)
    function calcAngle(vA, vB, vC) {
      var vBA = vA.subtract(vB);
      var vBC = vC.subtract(vB);
      var dot = vBA.dot(vBC);
      var mBA = vBA.length;
      var mBC = vBC.length;
      if (mBA === 0 || mBC === 0) return 0;
      var cosTheta = Math.max(-1, Math.min(1, dot / (mBA * mBC)));
      return Math.round(Math.acos(cosTheta) * (180 / Math.PI));
    }

    function renderGrid() {
      layers.grid.removeChildren();
      layers.grid.activate();
      if (!state.showGrid) return;

      var step = 40;
      var w = paperScope.view.size.width;
      var h = paperScope.view.size.height;

      for (var x = step; x < w; x += step) {
        var lineX = new paperScope.Path.Line(new paperScope.Point(x, 0), new paperScope.Point(x, h));
        lineX.strokeColor = "rgba(255, 255, 255, 0.04)";
        lineX.strokeWidth = 1;
      }
      for (var y = step; y < h; y += step) {
        var lineY = new paperScope.Path.Line(new paperScope.Point(0, y), new paperScope.Point(w, y));
        lineY.strokeColor = "rgba(255, 255, 255, 0.04)";
        lineY.strokeWidth = 1;
      }
    }

    function renderTriangle() {
      layers.shapes.removeChildren();
      layers.annotations.removeChildren();

      layers.shapes.activate();

      // Main triangle ABC
      var tri = new paperScope.Path();
      tri.add(state.A, state.B, state.C);
      tri.closed = true;
      tri.strokeColor = state.color;
      tri.strokeWidth = 2.5;
      tri.fillColor = "rgba(99, 102, 241, 0.08)";

      // Pythagoras mode: draw squares on sides
      if (mode === "pythagoras") {
        renderPythagorasSquares();
      }

      layers.annotations.activate();

      var angleA = calcAngle(state.B, state.A, state.C);
      var angleB = calcAngle(state.A, state.B, state.C);
      var angleC = calcAngle(state.A, state.C, state.B);

      // Vertex Labels
      drawVertexLabel(state.A, "A (" + angleA + "\u00B0)", new paperScope.Point(-16, 18));
      drawVertexLabel(state.B, "B (" + angleB + "\u00B0)", new paperScope.Point(10, 18));
      drawVertexLabel(state.C, "C (" + angleC + "\u00B0)", new paperScope.Point(0, -18));

      // Side length labels
      if (state.showSides) {
        var abMid = state.A.add(state.B).divide(2);
        var bcMid = state.B.add(state.C).divide(2);
        var caMid = state.C.add(state.A).divide(2);

        drawSideLabel(abMid.add([0, 14]), "c = " + Math.round(dist(state.A, state.B)));
        drawSideLabel(bcMid.add([16, 0]), "a = " + Math.round(dist(state.B, state.C)));
        drawSideLabel(caMid.add([-16, 0]), "b = " + Math.round(dist(state.C, state.A)));
      }

      // Draw interior angle arc for vertex C
      drawAngleArc(state.C, state.A, state.B, 22);
      drawAngleArc(state.A, state.B, state.C, 22);
      drawAngleArc(state.B, state.C, state.A, 22);
    }

    function drawVertexLabel(pt, text, offset) {
      var t = new paperScope.PointText(pt.add(offset));
      t.content = text;
      t.fillColor = "#f3f4f6";
      t.fontFamily = "Plus Jakarta Sans, sans-serif";
      t.fontWeight = "bold";
      t.fontSize = 11;
      t.justification = "center";
    }

    function drawSideLabel(pt, text) {
      var t = new paperScope.PointText(pt);
      t.content = text;
      t.fillColor = "#9ca3af";
      t.fontFamily = "JetBrains Mono, monospace";
      t.fontSize = 10;
      t.justification = "center";
    }

    function drawAngleArc(center, p1, p2, radius) {
      var v1 = p1.subtract(center).normalize(radius);
      var v2 = p2.subtract(center).normalize(radius);
      var mid = v1.add(v2).normalize(radius);

      var arc = new paperScope.Path.Arc(center.add(v1), center.add(mid), center.add(v2));
      arc.strokeColor = "rgba(6, 182, 212, 0.6)";
      arc.strokeWidth = 1.5;
    }

    function renderPythagorasSquares() {
      // Draw perpendicular squares outward from AB, BC, CA
      drawSideSquare(state.A, state.B, "c\u00B2");
    }

    function drawSideSquare(p1, p2, label) {
      var v = p2.subtract(p1);
      var perp = new paperScope.Point(-v.y, v.x);
      var p3 = p2.add(perp);
      var p4 = p1.add(perp);

      var sq = new paperScope.Path();
      sq.add(p1, p2, p3, p4);
      sq.closed = true;
      sq.strokeColor = "rgba(6, 182, 212, 0.4)";
      sq.strokeWidth = 1.5;
      sq.fillColor = "rgba(6, 182, 212, 0.06)";
      sq.dashArray = [4, 4];

      var center = p1.add(p2).add(p3).add(p4).divide(4);
      var txt = new paperScope.PointText(center);
      txt.content = label;
      txt.fillColor = "#06b6d4";
      txt.fontFamily = "JetBrains Mono, monospace";
      txt.fontWeight = "bold";
      txt.fontSize = 12;
      txt.justification = "center";
    }

    function renderHandles() {
      layers.handles.removeChildren();
      if (!state.draggable) return;

      layers.handles.activate();

      var pts = [
        { key: "A", pt: state.A },
        { key: "B", pt: state.B },
        { key: "C", pt: state.C }
      ];

      pts.forEach(function (h) {
        var circle = new paperScope.Path.Circle(h.pt, 9);
        circle.fillColor = "#fff";
        circle.strokeColor = state.color;
        circle.strokeWidth = 2.5;

        circle.onMouseDrag = function (evt) {
          state[h.key] = evt.point;
          circle.position = evt.point;
          renderTriangle();
          if (typeof opts.onChange === "function") {
            opts.onChange(reading());
          }
        };

        circle.onMouseEnter = function () {
          canvas.style.cursor = "grab";
          circle.scale(1.2);
        };
        circle.onMouseLeave = function () {
          canvas.style.cursor = "default";
          circle.scale(1 / 1.2);
        };
      });
    }

    function render() {
      renderGrid();
      renderTriangle();
      renderHandles();
      paperScope.view.draw();
    }

    render();

    function reading() {
      var a = dist(state.B, state.C);
      var b = dist(state.C, state.A);
      var c = dist(state.A, state.B);
      var s = (a + b + c) / 2;
      var area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

      return {
        sideA: Math.round(a),
        sideB: Math.round(b),
        sideC: Math.round(c),
        angleA: calcAngle(state.B, state.A, state.C),
        angleB: calcAngle(state.A, state.B, state.C),
        angleC: calcAngle(state.A, state.C, state.B),
        area: Math.round(area),
        perimeter: Math.round(a + b + c)
      };
    }

    function setState(nextState) {
      if (nextState.mode) mode = nextState.mode;
      if (nextState.A) state.A = new paperScope.Point(nextState.A);
      if (nextState.B) state.B = new paperScope.Point(nextState.B);
      if (nextState.C) state.C = new paperScope.Point(nextState.C);
      if (nextState.showAngles !== undefined) state.showAngles = nextState.showAngles;
      if (nextState.showSides !== undefined) state.showSides = nextState.showSides;
      render();
    }

    return {
      paperScope: paperScope,
      reading: reading,
      setState: setState,
      render: render,
      destroy: function () {
        paperScope.project.remove();
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  global.PlaneGeometryKit = {
    create: create,
    version: 1
  };

})(typeof window !== "undefined" ? window : this);
