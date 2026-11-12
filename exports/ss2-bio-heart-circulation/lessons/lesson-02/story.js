/* Lesson 02 · 3D story: Baba Sule's goat heart at the Oja Oba health tent, then Dr Aisha's board drawing in the UCH teaching lab */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];
  var TABLE = [[0.5, 1.75, 2.9], [0.45, 1.0, 0.1]];
  var CLOSE = [[0.95, 1.5, 1.95], [0.45, 0.98, 0.1]];
  var HEART_AT = new THREE.Vector3(0.45, 0.96, 0.12);

  // Dr Aisha's board: a front-view heart, with the labels that confuse people (R on the reader's left)
  function boardTexture() {
    var c = document.createElement("canvas"); c.width = 512; c.height = 300;
    var x = c.getContext("2d");
    x.fillStyle = "#f7f6f1"; x.fillRect(0, 0, 512, 300);
    x.strokeStyle = "#1b1813"; x.lineWidth = 6; x.lineJoin = "round";
    x.beginPath();
    x.moveTo(256, 276);
    x.bezierCurveTo(130, 210, 90, 150, 100, 100);
    x.bezierCurveTo(112, 50, 180, 36, 256, 90);
    x.bezierCurveTo(332, 36, 400, 50, 412, 100);
    x.bezierCurveTo(422, 150, 382, 210, 256, 276);
    x.stroke();
    x.lineWidth = 4;
    x.beginPath(); x.moveTo(256, 92); x.lineTo(256, 262); x.stroke();      // septum
    x.beginPath(); x.moveTo(120, 150); x.lineTo(256, 150); x.moveTo(256, 150); x.lineTo(396, 150); x.stroke(); // AV boundary
    x.fillStyle = "#c8264a"; x.font = "bold 44px sans-serif"; x.textAlign = "center";
    x.fillText("R", 176, 208); x.fillStyle = "#1f5bb4"; x.fillText("L", 336, 208);
    x.fillStyle = "#1b1813"; x.font = "bold 26px sans-serif";
    x.fillText("why backwards?", 256, 36);
    var t = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    return t;
  }

  function reset(w) {
    var p = w.people, mk = w.props.market, lab = w.props.lab;
    // Dr Aisha lives in the lab; she visits the tent only in scene 3
    if (p.amaka.parent !== lab) { p.amaka.parent.remove(p.amaka); lab.add(p.amaka); p.amaka.position.set(-1.0, 0, -1.3); p.amaka.rotation.y = 0; }
    if (p.ngozi.parent !== mk) { p.ngozi.parent.remove(p.ngozi); mk.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.position.set(0, 0, -1.0); p.ngozi.rotation.y = 0;
    p.amaka.userData.faceTarget = null;
  }
  function toTent(w) {
    var a = w.people.amaka, mk = w.props.market;
    if (a.parent !== mk) { a.parent.remove(a); mk.add(a); }
    a.position.set(-0.45, 0, 0.95); a.userData.faceTarget = new THREE.Vector3(HEART_AT.x, 0, HEART_AT.z);
  }
  function heartTo(w, where) {
    var h = w.props.goatHeart; if (!h) return;
    var tgt = where === "lab" ? w.props.lab : w.props.market;
    if (h.parent !== tgt) { h.parent.remove(h); tgt.add(h); }
    if (where === "lab") h.position.set(-0.1, 1.0, -2.1); else h.position.copy(HEART_AT);
  }

  var beats = [
    {
      caption: "The Oja Oba health-day tent. Baba Sule has a goat heart.",
      shot: TABLE, instant: true, hold: 5.5, who: "cust2",
      text: "One side is thick like my thumb. That is the right side, because right is strong!",
      run: function (w) { reset(w); heartTo(w, "tent"); w.props.heartSpin = 0.3; w.props.heartHop = 1; w.people.cust2.set("point"); w.people.cust1.set("think"); }
    },
    {
      caption: "Chidi turns it over.",
      shot: CLOSE, hold: 5, who: "cust1",
      text: "How do you even know which side is which?",
      run: function (w) { reset(w); heartTo(w, "tent"); w.props.heartSpin = Math.PI + 0.3; w.people.cust1.set("talk"); w.people.cust2.set("think"); }
    },
    {
      caption: "Dr Aisha points to the groove down the front and the vessels at the top.",
      shot: CLOSE, hold: 6, who: "amaka",
      text: "These tell us. The groove runs down the front and the thick vessels come out at the top. We will cut it open properly.",
      run: function (w) { reset(w); heartTo(w, "tent"); toTent(w); w.props.heartSpin = 0.3; w.people.amaka.set("point"); }
    },
    {
      caption: "UCH teaching lab. Dr Aisha draws a heart facing the class.",
      shot: [[39.7, 2.3, 2.7], [39.2, 1.8, -2.6]], instant: true, hold: 6, who: "amaka",
      text: "I draw the heart facing you, like a person facing you. So why do my labels R and L look backwards?",
      run: function (w) { reset(w); heartTo(w, "lab"); var a = w.people.amaka; a.position.set(-0.7, 0, -1.7); a.userData.faceTarget = new THREE.Vector3(40 - 0.9, 0, -3.5); a.set("point"); }
    },
    {
      caption: "To the dissection bench.",
      shot: [[40.9, 2.2, 3.6], [40.1, 1.3, -2.1]], hold: 5, who: "amaka",
      text: "Let us stop arguing and measure. To the bench: scalpel, ruler, and two readings for every wall.",
      run: function (w) { reset(w); heartTo(w, "lab"); w.people.amaka.userData.faceTarget = new THREE.Vector3(40 - 0.1, 0, -2.1); w.people.amaka.set("talk"); }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: { ngozi: "Mama Bisi", cust1: "Chidi", cust2: "Baba Sule", amaka: "Dr Aisha" },
    setup: function (api) {
      var P = api.props;
      function retitle(group, oldSign, text, bg, h) {
        var s = StoryStage.sign(text, bg, "#fff", h);
        s.position.copy(oldSign.position); group.remove(oldSign); group.add(s); return s;
      }
      P.mSign = retitle(P.market, P.mSign, "OJA OBA HEALTH DAY · SATURDAY", "rgba(200,38,74,0.95)", 0.46);
      P.lSign = retitle(P.lab, P.lSign, "UCH TEACHING LAB · BIOLOGY", "rgba(59,108,246,0.95)", 0.42);
      ["bottleA", "bottleB", "can", "balance", "burette", "flask", "vflask"].forEach(function (k) { if (P[k]) P[k].visible = false; });
      (P.jars || []).forEach(function (j) { j.visible = false; });

      // cool box under the tent table
      var box = new THREE.Group();
      var body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.38), StoryStage.std("#2b6cb0", 0.6));
      body.position.y = 0.19; box.add(body);
      var lid = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.06, 0.42), StoryStage.std("#f4f6f8", 0.55));
      lid.position.y = 0.41; box.add(lid);
      box.position.set(1.7, 0, 0.25); box.rotation.y = -0.3; P.market.add(box);

      // the goat heart: HeartKit v2 specimen, front side toward the viewer
      if (window.HeartKit) {
        var holder = new THREE.Group();
        var hk = HeartKit.heart({ mode: "specimen", labels: false });
        hk.scale.setScalar(0.27); hk.rotation.x = -0.9; hk.position.y = 0.08;
        holder.add(hk); holder.position.copy(HEART_AT);
        // a small board it lies on
        var plate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.025, 28), StoryStage.std("#f1efe8", 0.5));
        plate.position.y = -0.0125; holder.add(plate);
        P.market.add(holder); P.goatHeart = holder; P.goatHeartKit = hk;
        if (hk.userData.update) hk.userData.update(0.016, 0);
      }
      P.heartSpin = 0.3; P.heartHop = 0;

      // Dr Aisha's whiteboard on the lab wall
      var bd = new THREE.Group();
      var frame = new THREE.Mesh(new THREE.BoxGeometry(2.66, 1.56, 0.05), StoryStage.std("#4a4f5a", 0.5));
      var face = new THREE.Mesh(new THREE.PlaneGeometry(2.56, 1.46), new THREE.MeshBasicMaterial({ map: boardTexture() }));
      face.position.z = 0.03; bd.add(frame, face);
      bd.position.set(-0.9, 2.1, -3.07); P.lab.add(bd); P.board = bd;
    },
    onTick: function (api, dt, t) {
      var h = api.props.goatHeart; if (!h) return;
      var k = Math.min(1, dt * 4);
      h.rotation.y += (api.props.heartSpin - h.rotation.y) * k;
      if (api.props.heartHop > 0) {                     // Baba Sule slaps it on the table
        api.props.heartHop = Math.max(0, api.props.heartHop - dt * 1.6);
        h.position.y = HEART_AT.y + Math.abs(Math.sin(api.props.heartHop * 9)) * 0.1 * api.props.heartHop;
      }
    }
  });
})();
