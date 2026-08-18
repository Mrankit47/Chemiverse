import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Lightweight particle field replacing heavy Sparkles + multiple meshes
function ParticleField({ count = 60, spread = [18, 12, 6], color = "#7CFF3C" }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
    }
    return pos;
  }, [count, spread]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.06} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// Single slowly-rotating wireframe shape
function FloatingShape({ position, color, kind, speed }) {
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
        <torusGeometry args={[0.9, 0.16, 6, 6]} />
      ) : (
        <dodecahedronGeometry args={[0.9, 0]} />
      )}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.12} />
    </mesh>
  );
}

const NODES = [
  { position: [-6, 1, -2], color: "#7CFF3C", kind: "atom", speed: 0.15 },
  { position: [5, -1, -3], color: "#B026FF", kind: "ring", speed: 0.12 },
  { position: [-3, -2, -4], color: "#FF9E1B", kind: "poly", speed: 0.1 },
  { position: [4, 2, -1], color: "#1FE3C2", kind: "atom", speed: 0.18 },
];

export default function SceneBackground() {
  // Detect if the device is likely low-powered (mobile or low-memory)
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Disable on devices with < 4GB RAM or when page is hidden
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      setVisible(false);
    }
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!visible) return null;

  return (
    <div className="scene-bg">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        frameloop="always"
      >
        <ParticleField count={50} color="#7CFF3C" />
        <ParticleField count={20} spread={[16, 10, 5]} color="#B026FF" />
        {NODES.map((n, i) => (
          <FloatingShape key={i} {...n} />
        ))}
      </Canvas>
    </div>
  );
}
