import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ElectronShell({ radius, count, speed, tilt, color }) {
  const group = useRef();
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += speed * dt;
  });
  const electrons = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    [count]
  );
  return (
    <group rotation={[tilt, tilt * 0.6, 0]}>
      {/* orbit ring */}
      <mesh>
        <torusGeometry args={[radius, 0.012, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <group ref={group}>
        {electrons.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Atom3D({ shells = [2], color = "#00F5FF", nucleusScale = 1 }) {
  const nucleus = useRef();
  useFrame((_, dt) => {
    if (nucleus.current) nucleus.current.rotation.y += dt * 0.4;
  });
  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} intensity={120} color={color} />
      <pointLight position={[-6, -4, -4]} intensity={60} color="#8A2BE2" />
      {/* nucleus */}
      <mesh ref={nucleus} scale={nucleusScale}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh scale={nucleusScale}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      {shells.map((count, i) => (
        <ElectronShell
          key={i}
          radius={1.3 + i * 0.85}
          count={count}
          speed={0.9 - i * 0.11}
          tilt={0.5 + i * 0.35}
          color={color}
        />
      ))}
    </group>
  );
}
