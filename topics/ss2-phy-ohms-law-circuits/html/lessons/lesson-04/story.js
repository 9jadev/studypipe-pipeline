/* Lesson 04 · 3D Phenomenon Story ("Mazi Okafor's Onitsha Market Meter Rescue") */
(function () {
  "use strict";
  if (!window.StoryStage || !window.THREE) return;
  var THREE = window.THREE;

  function buildMeterBench(group) {
    var desk = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.16, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 0.8 })
    );
    desk.position.set(0.05, 0.45, 0.12);
    desk.castShadow = true;
    desk.receiveShadow = true;
    group.add(desk);

    // Central Moving-Coil Galvanometer
    var galvGroup = new THREE.Group();
    galvGroup.position.set(0.0, 0.53, 0.12);
    var gCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.56, 0.36),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
    );
    gCase.position.y = 0.28;
    var gFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.36, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    gFace.position.set(0, 0.32, 0.18);
    var needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.22, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.5 })
    );
    needle.position.set(0, 0.28, 0.2);
    galvGroup.add(gCase, gFace, needle);
    group.add(galvGroup);

    // Parallel Copper Shunt Strip (Left/Front)
    var shuntMat = new THREE.MeshStandardMaterial({
      color: 0x3ee6c4,
      emissive: 0x3ee6c4,
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.2
    });
    var shuntMesh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.14), shuntMat);
    shuntMesh.position.set(0.0, 0.58, 0.46);
    group.add(shuntMesh);

    // Series Multiplier Resistor Bobbin (Right)
    var multMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.4,
      metalness: 0.4,
      roughness: 0.35
    });
    var multMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.52, 24), multMat);
    multMesh.rotation.z = Math.PI / 2;
    multMesh.position.set(0.68, 0.65, 0.12);
    group.add(multMesh);

    return { needle: needle, shuntMesh: shuntMesh, multMesh: multMesh, shuntMat: shuntMat, multMat: multMat };
  }

  var props = null;

  var beats = [
    {
      title: "Beat 1 · A Delicate 10 mA Galvanometer Faces a 5.0 A Starter Load!",
      sub: "At Onitsha Head Bridge Electronics Market, instrument technician <strong>Mazi Okafor</strong> holds a sensitive moving-coil galvanometer: coil resistance <strong>R<sub>g</sub> = 20 Ω</strong> and full-scale deflection current <strong>I<sub>g</sub> = 10 mA (0.010 A)</strong>. Passing 5.0 A directly through it would vaporise the hairspring in milliseconds!",
      badge: "Bare Coil: R_g = 20 Ω · I_g = 10 mA · V_g = 0.20 V",
      cam: { x: -0.35, y: 1.5, z: 3.4, tx: 0.0, ty: 0.85, tz: 0.0 },
      pose: function (p, t) {
        p.left.position.x = -1.1;
        p.left.rotation.y = 0.42;
        p.right.position.x = 1.15;
        p.right.rotation.y = -0.42;
        StoryStage.poseCharacter(p.left, {
          headPitch: -0.05,
          rShoulderZ: -0.65, rShoulderX: -0.35, rElbow: -0.5
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.18,
          lShoulderZ: 0.55, lShoulderX: -0.3, lElbow: -0.4
        });
        if (props) {
          props.needle.rotation.z = Math.sin(t * 6.0) * 0.15;
          props.shuntMesh.visible = false;
          props.multMesh.visible = false;
        }
      },
      bubbles: [
        { who: "left", name: "Mazi Okafor", text: "This coil only survives 10 mA (0.010 A) and 0.20 V! How do we measure 5.0 A safely?" }
      ]
    },
    {
      title: "Beat 2 · Parallel Shunt R_s = 0.0401 Ω Turns It into a 5.0 A Ammeter!",
      sub: "Student <strong>Amaka</strong> solders a thick, low-resistance copper <strong>shunt</strong> across the terminals in <strong>parallel</strong>: <strong>R<sub>s</sub> = I<sub>g</sub>R<sub>g</sub> ÷ (I − I<sub>g</sub>) = 0.20 ÷ 4.99 = 0.0401 Ω</strong>. Now <strong>4.99 A</strong> rushes through the shunt while exactly <strong>0.010 A</strong> deflects the pointer to full scale!",
      badge: "Parallel Shunt: R_s = 0.0401 Ω · 4.99 A Bypasses Coil!",
      cam: { x: 0.05, y: 1.38, z: 2.85, tx: 0.0, ty: 0.78, tz: 0.15 },
      pose: function (p, t) {
        StoryStage.poseCharacter(p.left, {
          headYaw: 0.15,
          rShoulderZ: -0.5, rShoulderX: -0.3, rElbow: -0.4,
          smile: 1.1
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.2,
          lShoulderZ: 0.9, lShoulderX: -0.45, lElbow: -0.6,
          smile: 1.2
        });
        if (props) {
          props.shuntMesh.visible = true;
          props.multMesh.visible = false;
          props.needle.rotation.z = -0.58;
          props.shuntMat.emissiveIntensity = 0.5 + 0.3 * Math.sin(t * 5);
        }
      },
      bubbles: [
        { who: "right", name: "Amaka", text: "With a 0.0401 Ω parallel shunt, 4.99 A bypasses the coil and 0.010 A gives full-scale 5.0 A!" }
      ]
    },
    {
      title: "Beat 3 · Series Multiplier R_m = 1480 Ω Turns It into a 15.0 V Voltmeter!",
      sub: "To measure Chinedu’s 12 V–15 V battery voltage instead, Mazi Okafor removes the shunt and connects a high-resistance <strong>multiplier</strong> in <strong>series</strong>: <strong>R<sub>m</sub> = (V ÷ I<sub>g</sub>) − R<sub>g</sub> = (15 ÷ 0.010) − 20 = 1480 Ω</strong> (giving total resistance <strong>1500 Ω</strong>)!",
      badge: "Series Multiplier: R_m = 1480 Ω · R_total = 1500 Ω",
      cam: { x: 0.25, y: 1.48, z: 3.25, tx: 0.15, ty: 0.85, tz: 0.0 },
      pose: function (p, t) {
        StoryStage.poseCharacter(p.left, {
          headYaw: 0.12,
          rShoulderZ: -0.95, rShoulderX: -0.45, rElbow: -0.55,
          smile: 1.2
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.15,
          lShoulderZ: 0.85, lShoulderX: -0.4, lElbow: -0.5,
          smile: 1.2
        });
        if (props) {
          props.shuntMesh.visible = false;
          props.multMesh.visible = true;
          props.needle.rotation.z = -0.58;
          props.multMat.emissiveIntensity = 0.45 + 0.3 * Math.sin(t * 5);
        }
      },
      bubbles: [
        { who: "left", name: "Mazi Okafor", text: "1480 Ω in series drops 14.80 V, leaving 0.20 V across our 20 Ω coil! Let's build both on the 3D bench!" }
      ]
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    left: { name: "Mazi Okafor", skin: 0x6b3f26, shirt: 0xd97706, trousers: 0x1e293b, hair: "short", glasses: true },
    right: { name: "Amaka", skin: 0x7a4b2a, shirt: 0xa855f7, trousers: 0x1e2538, hair: "bun", headband: 0x3ee6c4 },
    buildProps: function (g) { props = buildMeterBench(g); }
  });
})();
