import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Lathe profiles: [radius, height] revolved around Y axis
const PROFILES = {
  erlenmeyer: [[0, 0], [0.62, 0], [0.62, 0.09], [0.55, 0.13], [0.2, 1.15], [0.19, 1.62], [0.23, 1.68]],
  florence: [[0, 0], [0.5, 0.06], [0.72, 0.38], [0.74, 0.64], [0.6, 0.94], [0.32, 1.16], [0.17, 1.4], [0.16, 2.15], [0.2, 2.28]],
  tube: [[0, 0], [0.09, 0.02], [0.18, 0.16], [0.18, 1.55], [0.2, 1.62]],
  beaker: [[0, 0], [0.52, 0], [0.52, 1.15], [0.5, 1.15], [0.5, 0.06]],
};

function toVec2(pts) {
  return pts.map((p) => new THREE.Vector2(p[0], p[1]));
}

// Build a filled-liquid profile up to fill height then cap to the axis
function liquidVec2(pts, fill) {
  const res = [];
  for (let i = 0; i < pts.length; i++) {
    const [r, y] = pts[i];
    if (y <= fill) {
      res.push(new THREE.Vector2(r * 0.92, y));
    } else {
      const [pr, py] = pts[i - 1] || [0, 0];
      const t = (fill - py) / (y - py || 1);
      const rf = (pr + (r - pr) * t) * 0.92;
      res.push(new THREE.Vector2(rf, fill));
      break;
    }
  }
  res.push(new THREE.Vector2(0, fill));
  return res;
}

function Flask({ type, color, position = [0, 0, 0], fill = 0.8, scale = 1 }) {
  const profile = PROFILES[type];
  const glassGeo = useMemo(() => new THREE.LatheGeometry(toVec2(profile), 24), [profile]);
  const liquidGeo = useMemo(() => new THREE.LatheGeometry(liquidVec2(profile, fill), 24), [profile, fill]);
  const topY = profile[profile.length - 1][1] * scale;
  const midY = fill * 0.5 * scale;

  return (
    <group position={position} scale={scale}>
      {/* glass shell */}
      <mesh geometry={glassGeo}>
        <meshPhysicalMaterial
          color="#dff5ec"
          transparent
          opacity={0.16}
          roughness={0.05}
          metalness={0}
          transmission={0.6}
          thickness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* glowing liquid */}
      <mesh geometry={liquidGeo}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.2}
          roughness={0.2}
          transparent
          opacity={0.96}
        />
      </mesh>
      {/* neon glow light from the liquid */}
      <pointLight position={[0, midY + 0.15, 0]} color={color} intensity={9} distance={6} decay={1.5} />
      {/* contact glow on the bench */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[profile.reduce((m, p) => Math.max(m, p[0]), 0) * 1.6, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* bubbles inside liquid */}
      <Sparkles count={4} scale={[0.6, fill * 0.7, 0.6]} position={[0, fill * 0.4, 0]} size={2.5} speed={0.6} color={color} opacity={0.9} />
      {/* rising smoke / vapour from the mouth */}
      <Sparkles count={8} scale={[0.5, 1.4, 0.5]} position={[0, topY + 0.7, 0]} size={5} speed={0.35} color={color} opacity={0.45} />
    </group>
  );
}

const FLASKS = [
  { type: "erlenmeyer", color: "#00F5FF", position: [-2.6, 0, 0.3], fill: 0.95, scale: 1.05 },
  { type: "florence", color: "#00BFFF", position: [-0.95, 0, -0.35], fill: 0.60, scale: 0.98 },
  { type: "florence", color: "#8B5CF6", position: [0.75, 0, 0.25], fill: 0.75, scale: 1.12 },
  { type: "beaker", color: "#00FF9C", position: [2.55, 0, -0.2], fill: 0.85, scale: 1.15 },
];

const TUBES = [
  { color: "#FF3864", x: -0.05 },
  { color: "#FFE600", x: 0.32 },
];

export default function LabScene() {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = Math.sin(t * 0.15) * 0.25;
      group.current.position.y = Math.sin(t * 0.5) * 0.04 - 0.9;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.32} />
      <directionalLight position={[3, 6, 4]} intensity={0.65} color="#E6F7FF" />
      <spotLight position={[0, 8, 3]} angle={0.5} penumbra={0.8} intensity={0.8} color="#00F5FF" />

      {/* Futuristic lab workstation bench */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#080D1C" roughness={0.45} metalness={0.55} />
      </mesh>

      {FLASKS.map((f, i) => (
        <Flask key={i} {...f} />
      ))}

      {/* test-tube rack */}
      <group position={[3.7, 0, 0.5]} scale={0.85}>
        {TUBES.map((t, i) => (
          <Flask key={i} type="tube" color={t.color} position={[t.x, 0, 0]} fill={1.1} scale={1} />
        ))}
      </group>

      {/* ambient floating lab particles */}
      <Sparkles count={18} scale={[12, 5, 5]} position={[0, 2.5, 0]} size={2} speed={0.25} color="#00F5FF" opacity={0.5} />
    </group>
  );
}
