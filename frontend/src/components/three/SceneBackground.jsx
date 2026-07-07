import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Faint slowly-drifting wireframe "molecules" behind everything
function Molecule({ position, color, kind, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.x = t * speed;
      ref.current.rotation.y = t * speed * 0.7;
      ref.current.position.y = position[1] + Math.sin(t * 0.3 + position[0]) * 0.6;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      {kind === "atom" ? (
        <icosahedronGeometry args={[1, 0]} />
      ) : kind === "ring" ? (
        <torusGeometry args={[0.9, 0.16, 8, 6]} />
      ) : (
        <dodecahedronGeometry args={[0.9, 0]} />
      )}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.16} />
    </mesh>
  );
}

const NODES = [
  { position: [-6, 1, -2], color: "#7CFF3C", kind: "atom", speed: 0.15 },
  { position: [5, -1, -3], color: "#B026FF", kind: "ring", speed: 0.12 },
  { position: [-3, -2, -4], color: "#FF9E1B", kind: "poly", speed: 0.1 },
  { position: [4, 2, -1], color: "#1FE3C2", kind: "atom", speed: 0.18 },
  { position: [0, 3, -5], color: "#B026FF", kind: "poly", speed: 0.09 },
  { position: [-5, -3, -2], color: "#7CFF3C", kind: "ring", speed: 0.14 },
];

export default function SceneBackground() {
  return (
    <div className="scene-bg">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Sparkles count={90} scale={[22, 14, 8]} size={2.4} speed={0.25} color="#7CFF3C" opacity={0.45} />
        <Sparkles count={40} scale={[20, 12, 6]} size={3} speed={0.18} color="#B026FF" opacity={0.35} />
        {NODES.map((n, i) => (
          <Molecule key={i} {...n} />
        ))}
      </Canvas>
    </div>
  );
}
