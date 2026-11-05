/* Lesson 05 · 3D Phenomenon Story ("Case Closed: Engr. Nkechi & Chinedu's Null-Balance Verdict") */
(function () {
  "use strict";
  if (!window.StoryStage || !window.THREE) return;
  var THREE = window.THREE;

  function buildBridgeBoard(group) {
    // Mahogany 100 cm Potentiometer / Metre Bridge Board
    var board = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.14, 1.15),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.72 })
    );
    board.position.set(0.05, 0.45, 0.12);
    board.castShadow = true;
    board.receiveShadow = true;
    group.add(board);

    // Yellow 100 cm scale strip
    var ruler = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.02, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.45 })
    );
    ruler.position.set(0.05, 0.53, 0.42);
    group.add(ruler);

    // Constantan wire
    var wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x3ee6c4, emissiveIntensity: 0.35, metalness: 0.85 })
    );
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0.05, 0.54, 0.28);
    group.add(wire);

    // Sliding Brass Jockey
    var jockey = new THREE.Group();
    var jHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
    );
    jHandle.position.y = 0.22;
    var jTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    jTip.rotation.x = Math.PI;
    jTip.position.y = 0.05;
    jockey.add(jHandle, jTip);
    jockey.position.set(0.05, 0.54, 0.28);
    group.add(jockey);

    // Centre-Zero Galvanometer
    var galv = new THREE.Group();
    galv.position.set(0.05, 0.52, -0.15);
    var gBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.42, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    gBox.position.y = 0.21;
    var gNeedle = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.18, 0.018),
      new THREE.MeshStandardMaterial({ color: 0x2fb344, emissive: 0x2fb344, emissiveIntensity: 0.7 })
    );
    gNeedle.position.set(0, 0.22, 0.16);
    galv.add(gBox, gNeedle);
    group.add(galv);

    return { jockey: jockey, gNeedle: gNeedle };
  }

  var props = null;

  var beats = [
    {
      title: "Beat 1 · Why Even a Good VoltmeterSlightly Under-Reads True EMF",
      sub: "Back in Aba, <strong>Engr. Nkechi</strong> shows <strong>Chinedu</strong> why even a high-resistance voltmeter draws a tiny current <em>I</em>, causing a small internal voltage drop <em>Ir</em>. To measure a cell’s <strong>true EMF with zero current drawn</strong>, we need a <strong>null-balance potentiometer</strong>!",
      badge: "Null Balance Goal: I_g = 0 A · Lost Volts Ir = 0 V!",
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
          props.jockey.position.x = -0.45 + Math.sin(t * 2.0) * 0.35;
          props.gNeedle.rotation.z = (props.jockey.position.x - 0.15) * 0.9;
        }
      },
      bubbles: [
        { who: "right", name: "Engr. Nkechi", text: "When the centre-zero galvanometer reads I_g = 0, zero current leaves the cell — so Ir = 0!" }
      ]
    },
    {
      title: "Beat 2 · Tapping (Never Dragging!) the Jockey to the Null Point!",
      sub: "Chinedu gently <strong>taps</strong> — never drags — the brass jockey along the 100 cm constantan wire until the centre-zero galvanometer pointer stands dead vertical at <strong>I<sub>g</sub> = 0</strong>. First they balance a cell at <strong>l<sub>1</sub> = 75.0 cm</strong> on open circuit, and then at <strong>l<sub>2</sub> = 60.0 cm</strong> when shunted by a load resistor!",
      badge: "Balanced at I_g = 0! · E₁/E₂ = l₁/l₂ · r = R(l₁−l₂)/l₂",
      cam: { x: 0.05, y: 1.38, z: 2.85, tx: 0.05, ty: 0.78, tz: 0.15 },
      pose: function (p, t) {
        StoryStage.poseCharacter(p.left, {
          headYaw: 0.15,
          rShoulderZ: -0.85, rShoulderX: -0.4, rElbow: -0.55,
          smile: 1.15
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.2,
          lShoulderZ: 0.7, lShoulderX: -0.4, lElbow: -0.5,
          smile: 1.2
        });
        if (props) {
          props.jockey.position.x = 0.15;
          props.gNeedle.rotation.z = 0.0; // Dead zero null balance!
        }
      },
      bubbles: [
        { who: "left", name: "Chinedu", text: "Dead zero on the galvanometer! And I tapped the jockey lightly so I didn't scrape the wire!" }
      ]
    },
    {
      title: "Beat 3 · Case Closed: Aba Battery Mystery & WAEC Paper 3 Mastered!",
      sub: "With the <strong>Metre Bridge</strong> (<code>R<sub>1</sub>/R<sub>2</sub> = l/(100−l)</code>) and the <strong>Potentiometer</strong> (<code>E<sub>1</sub>/E<sub>2</sub> = l<sub>1</sub>/l<sub>2</sub></code>), Chinedu verifies his battery’s exact EMF (<strong>12.0 V</strong>) and high internal resistance (<strong>1.2 Ω</strong> from sulphated plates), cleans the terminals, and is 100% ready for WAEC Physics Practical Paper 3!",
      badge: "Unit Mystery Solved! · E = 12.0 V, r = 1.2 Ω · Ready for WAEC!",
      cam: { x: 0.25, y: 1.48, z: 3.3, tx: 0.0, ty: 0.85, tz: 0.0 },
      pose: function (p, t) {
        StoryStage.poseCharacter(p.left, {
          headYaw: 0.12,
          rShoulderZ: -0.95, rShoulderX: -0.45, rElbow: -0.55,
          smile: 1.25
        });
        StoryStage.poseCharacter(p.right, {
          headYaw: -0.15,
          lShoulderZ: 0.9, lShoulderX: -0.45, lElbow: -0.55,
          smile: 1.25
        });
        if (props) {
          props.jockey.position.x = 0.15;
          props.gNeedle.rotation.z = 0.0;
        }
      },
      bubbles: [
        { who: "right", name: "Engr. Nkechi", text: "Case closed, Chinedu! Now let's slide the 3D jockey on the Metre Bridge and Potentiometer bench!" }
      ]
    }
  ];

  StoryStage.wire("story-stage", "story", beats, {
    left: { name: "Chinedu", skin: 0x6b3f26, shirt: 0xe67700, trousers: 0x1e293b, hair: "short" },
    right: { name: "Engr. Nkechi", skin: 0x7a4b2a, shirt: 0x2fb344, trousers: 0x1e2538, hair: "bun", glasses: true, headband: 0xffb23f },
    buildProps: function (g) { props = buildBridgeBoard(g); }
  });
})();
