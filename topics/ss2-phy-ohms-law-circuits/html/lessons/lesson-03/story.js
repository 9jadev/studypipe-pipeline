/* Lesson 03 · 3D Phenomenon Story ("Tunde's Surulere Solar-Inverter Battery Bank Puzzle") */
(function () {
  "use strict";
  if (!window.StoryStage || !window.THREE) return;
  var THREE = window.THREE;

  function buildSolarWorkshop(group) {
    var desk = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.16, 1.25),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 })
    );
    desk.position.set(0.05, 0.45, 0.12);
    desk.castShadow = true;
    desk.receiveShadow = true;
    group.add(desk);

    // Three 2V solar cells
    var cellMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.35 });
    var topMat = new THREE.MeshStandardMaterial({ color: 0x2fb344, roughness: 0.35, metalness: 0.2 });
    var cells = [];
    for (var i = 0; i < 3; i++) {
      var cg = new THREE.Group();
      var body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.28), cellMat);
      body.position.y = 0.17;
      var cap = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.06, 0.29), topMat);
      cap.position.y = 0.34;
      cg.add(body, cap);
      cg.position.set(-0.55 + i * 0.42, 0.53, 0.12);
      group.add(cg);
      cells.push(cg);
    }

    // Parallel Copper Busbars (glowing green when parallel selected)
    var busMat = new THREE.MeshStandardMaterial({
      color: 0x3ee6c4,
      emissive: 0x3ee6c4,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.2
    });
    var busBar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.04), busMat);
    busBar.position.set(-0.13, 0.92, 0.12);
    group.add(busBar);

    // Low-resistance DC water pump motor
    var motorGroup = new THREE.Group();
    var mCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.44, 24),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.65, roughness: 0.3 })
    );
    mCyl.rotation.z = Math.PI / 2;
    mCyl.position.set(0.75, 0.72, 0.14);
    var fan = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.34, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffb23f, emissive: 0xffb23f, emissiveIntensity: 0.4 })
    );
    fan.position.set(0.98, 0.72, 0.14);
    motorGroup.add(mCyl, fan);
    group.add(motorGroup);

    return { cells: cells, busMat: busMat, fan: fan };
  }

  var props = null;

  var beats = [
    {
      title: "Beat 1 · Series Cells Choke on a Heavy Pump Load!",
      sub: "In Surulere, solar technician <strong>Tunde</strong> connects three aged 2.0 V cells (each with internal resistance <em>r = 1.5 Ω</em>) in <strong>series</strong> to spin a low-resistance 0.3 Ω DC pump. Total EMF rises to 6.0 V, yet their internal resistances also add up to <strong>r<sub>eq</sub> = 4.5 Ω</strong> — choking current to just 1.25 A!",
      badge: "Series: E_eq = 6.0 V, r_eq = 4.5 Ω · I = 1.25 A",
      cam: { x: -0.35, y: 1.52, z: 3.45, tx: 0.0, ty: 0.88, tz: 0.0 },
      pose: function (p, t) {
        p.left.position.x = -1.1;
        p.left.rotation.y = 0.42;
        p.right.position.x = 1.15;
        p.right.rotation.y = -0.42;
        StoryStage.poseCharacter(p.left, {
          headPitch: -0.05,
          rShoulderZ: -0.65, rShoulderX: -0.35, rElbow: -0.5,
          lShoulderZ: 0.2
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.18,
          lShoulderZ: 0.55, lShoulderX: -0.3, lElbow: -0.4
        });
        if (props) {
          props.busMat.color.setHex(0xf43f5e);
          props.busMat.emissive.setHex(0xf43f5e);
          props.busMat.emissiveIntensity = 0.35;
          props.fan.rotation.x = t * 2.5;
        }
      },
      bubbles: [
        { who: "left", name: "Tunde", text: "6.0 V in series, yet 4.5 Ω of internal resistance chokes our 0.3 Ω pump to 1.25 A!" }
      ]
    },
    {
      title: "Beat 2 · Rewiring the 3 Cells in Parallel!",
      sub: "Apprentice <strong>Damilola</strong> reconnects the same three cells in <strong>parallel</strong>: all positive terminals share one copper busbar and all negative terminals share another. Now <strong>E<sub>eq</sub> = E = 2.0 V</strong>, while internal resistance plunges three-fold to <strong>r<sub>eq</sub> = r ÷ 3 = 0.5 Ω</strong>!",
      badge: "Parallel: E_eq = 2.0 V, r_eq = 0.5 Ω · I = 2.50 A!",
      cam: { x: 0.1, y: 1.4, z: 2.95, tx: 0.1, ty: 0.8, tz: 0.1 },
      pose: function (p, t) {
        StoryStage.poseCharacter(p.left, {
          headYaw: 0.15,
          rShoulderZ: -0.5, rShoulderX: -0.3, rElbow: -0.4
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.2,
          lShoulderZ: 0.9, lShoulderX: -0.5, lElbow: -0.65,
          rShoulderZ: -0.45,
          smile: 1.15
        });
        if (props) {
          props.busMat.color.setHex(0x3ee6c4);
          props.busMat.emissive.setHex(0x3ee6c4);
          props.busMat.emissiveIntensity = 0.65;
          props.fan.rotation.x = t * 11.0;
        }
      },
      bubbles: [
        { who: "right", name: "Damilola", text: "In parallel, r_eq drops to 1.5 ÷ 3 = 0.5 Ω! Current doubles to 2.50 A and the pump roars!" }
      ]
    },
    {
      title: "Beat 3 · Current Divider & Cell Efficiency η = R ÷ (R + r)",
      sub: "When resistors or cells split into parallel branches, current divides inversely with resistance: <strong>I<sub>1</sub> = I<sub>total</sub> × R<sub>2</sub> ÷ (R<sub>1</sub> + R<sub>2</sub>)</strong>. And whenever internal resistance drops from 4.5 Ω to 0.5 Ω on a 1.5 Ω load, efficiency leaps from <strong>25% to 75%</strong>!",
      badge: "Efficiency η = [R ÷ (R + r)] × 100%",
      cam: { x: 0.25, y: 1.48, z: 3.3, tx: 0.0, ty: 0.88, tz: 0.0 },
      pose: function (p, t) {
        StoryStage.poseCharacter(p.left, {
          headYaw: 0.12,
          rShoulderZ: -0.95, rShoulderX: -0.45, rElbow: -0.55,
          smile: 1.15
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.15,
          lShoulderZ: 0.85, lShoulderX: -0.4, lElbow: -0.5,
          smile: 1.2
        });
        if (props) {
          props.fan.rotation.x = t * 10.0;
        }
      },
      bubbles: [
        { who: "left", name: "Tunde", text: "Let’s test series-parallel resistor networks, cell arrays, and power ratios on the 3D bench!" }
      ]
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    left: { name: "Tunde", skin: 0x6b3f26, shirt: 0x0284c7, trousers: 0x1e293b, hair: "short", glasses: true },
    right: { name: "Damilola", skin: 0x7a4b2a, shirt: 0x2fb344, trousers: 0x1e2538, hair: "bun", headband: 0xffb23f },
    buildProps: function (g) { props = buildSolarWorkshop(g); }
  });
})();
