/* Lesson 02 · 3D story beats: Chinedu's 12.0 V battery dropping to 8.4 V under starter load in Aba */
(function () {
  "use strict";
  if (!window.StoryStage || typeof THREE === "undefined") return;

  var WIDE = [[0, 2.6, 7.2], [0, 1.3, 0]];

  function buildBatteryRigProp(labelText, voltageText, isLoaded, tagBg) {
    var g = new THREE.Group();
    var darkCase = StoryStage.std("#1e293b", 0.45);
    var brass = new THREE.MeshStandardMaterial({ color: 0xffb23f, roughness: 0.25, metalness: 0.85 });

    var box = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.36, 0.30), darkCase);
    box.position.set(0, 0.18, 0);
    g.add(box);

    var postL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.10, 14), StoryStage.std("#ef4444", 0.4));
    postL.position.set(-0.14, 0.40, 0);
    var postR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.10, 14), StoryStage.std("#3b82f6", 0.4));
    postR.position.set(0.14, 0.40, 0);
    g.add(postL, postR);

    var rCoreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: isLoaded ? 0xef4444 : 0x0d9488,
      emissiveIntensity: isLoaded ? 0.85 : 0.25,
      roughness: 0.3
    });
    var rCore = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.04), rCoreMat);
    rCore.position.set(0, 0.18, 0.16);
    g.add(rCore);
    g.userData.rCoreMat = rCoreMat;
    g.userData.isLoaded = isLoaded;

    var tag = StoryStage.sign(labelText + " · " + voltageText, tagBg || "rgba(13,156,126,0.95)", "#fff", 0.16);
    tag.position.set(0, 0.66, 0.05);
    g.add(tag);
    return g;
  }

  function reset(w) {
    var p = w.people;
    if (p.ngozi.parent !== w.props.market) { p.ngozi.parent.remove(p.ngozi); w.props.market.add(p.ngozi); }
    p.ngozi.userData.target = null; p.ngozi.userData.faceTarget = null; p.ngozi.hold(null);
    p.ngozi.position.set(0, 0, -1.0); p.ngozi.rotation.y = 0;
  }

  var beats = [
    {
      caption: "Chinedu's Auto-Electric Workshop, Aba. The 12.0 V battery mystery.",
      shot: WIDE, instant: true, hold: 5,
      who: "cust1",
      text: "Oga Chinedu! With the switch open, this battery reads a full 12.0 volts. Why does it plunge to 8.4 volts the instant I crank the 2.8-ohm starter?",
      run: function (w) { reset(w); w.people.cust1.set("point"); }
    },
    {
      caption: "Papa Nnamdi thinks the voltmeter is broken.",
      shot: [[-0.4, 2.0, 5.0], [0.2, 1.3, 0.6]], hold: 5,
      who: "cust2",
      text: "A 12-volt battery is a 12-volt battery! Where could 3.6 volts possibly hide? Your digital voltmeter must be faulty!",
      run: function (w) { reset(w); w.people.cust2.set("talk"); w.people.ngozi.set("think"); }
    },
    {
      caption: "Chinedu touches the warm casing of the battery.",
      shot: [[0.3, 1.9, 2.5], [0, 1.6, -1]], hold: 4.8,
      who: "ngozi",
      text: "The meter is fine! Feel the battery casing — it's getting warm because the acid and plates inside have their own internal resistance r!",
      run: function (w) { reset(w); w.people.ngozi.set("talk"); }
    },
    {
      caption: "Open Circuit (I = 0, V = 12.0 V) vs Loaded Circuit (I = 3.0 A, V = 8.4 V, Lost = 3.6 V).",
      shot: [[0.65, 1.65, 1.55], [0.65, 1.35, 0.05]], hold: 5.5,
      who: "ngozi",
      text: "When 3.0 amps flow through r = 1.2 ohms, v = Ir = 3.6 volts are lost inside the battery itself, leaving only 8.4 volts at the terminals!",
      run: function (w) { reset(w); w.people.ngozi.set("point"); }
    },
    {
      caption: "How can we measure r and E without cutting the battery open?",
      shot: [[1.4, 1.75, 2.2], [0.5, 1.35, 0.0]], hold: 5,
      who: "ngozi",
      text: "Even better: by connecting two known resistors R₁ and R₂ one after the other, we can calculate both r and E using algebra or a V–I graph!",
      run: function (w) { reset(w); w.people.ngozi.set("think"); }
    },
    {
      caption: "At the Physics Lab with Engr. Nkechi…",
      shot: [[40.2, 2.3, 3.4], [40.3, 1.4, -1.8]], hold: 5.5,
      who: "amaka",
      text: "Step up to the bench! Let's vary the external load R across five steps, record V and I, and watch the straight line V = −rI + E appear!",
      run: function (w) {
        var a = w.people.amaka;
        a.userData.faceTarget = new THREE.Vector3(0.6, 0, -2.3);
        a.set("point");
      }
    }
  ];

  window.StoryStage.wire("story-stage", "story", beats, {
    names: {
      ngozi: "Oga Chinedu",
      cust1: "Kelechi (Apprentice)",
      cust2: "Papa Nnamdi",
      amaka: "Engr. Nkechi (Physics Lab)"
    },
    setup: function (api) {
      var mSign = StoryStage.sign("CHINEDU AUTO-ELECTRIC · LOST VOLTS CASE", "rgba(13,156,126,0.95)", "#fff", 0.45);
      mSign.position.copy(api.props.mSign.position);
      api.props.market.remove(api.props.mSign);
      api.props.market.add(mSign);
      api.props.mSign = mSign;

      var lSign = StoryStage.sign("INTERNAL RESISTANCE & V–I GRAPH LAB", "rgba(59,108,246,0.95)", "#fff", 0.42);
      lSign.position.copy(api.props.lSign.position);
      api.props.lab.remove(api.props.lSign);
      api.props.lab.add(lSign);
      api.props.lSign = lSign;

      if (api.props.bottleA) api.props.bottleA.visible = false;
      if (api.props.bottleB) api.props.bottleB.visible = false;
      if (api.props.can) api.props.can.visible = false;

      var batOpen = buildBatteryRigProp("Open Key (I=0)", "V = E = 12.0 V", false, "rgba(13,156,126,0.95)");
      batOpen.position.set(0.38, 0.94, 0.08);
      api.props.market.add(batOpen);
      api.props.clockA = batOpen;
      api.props.bottleA = batOpen;

      var batLoad = buildBatteryRigProp("Loaded (I=3A)", "V = 8.4 V (Ir=3.6V)", true, "rgba(200,38,74,0.95)");
      batLoad.position.set(0.92, 0.94, 0.08);
      api.props.market.add(batLoad);
      api.props.clockB = batLoad;
      api.props.bottleB = batLoad;
    },
    onTick: function (api, dt, t) {
      if (api.props.clockB && api.props.clockB.userData.rCoreMat) {
        api.props.clockB.userData.rCoreMat.emissiveIntensity = 0.65 + 0.3 * Math.sin(t * 5);
      }
    }
  });
})();
