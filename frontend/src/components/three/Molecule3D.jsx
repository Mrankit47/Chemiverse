import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ATOM_STYLE } from "@/data/chem";

function Bond({ start, end, order }) {
  const mid = useMemo(() => [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ], [start, end]);
  const { len, quat } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(e, s);
    const length = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { len: length, quat: q };
  }, [start, end]);

  const offsets = order === 2 ? [-0.12, 0.12] : order === 3 ? [-0.16, 0, 0.16] : [0];
  return (
    <group position={mid} quaternion={quat}>
      {offsets.map((o, i) => (
        <mesh key={i} position={[o, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, len, 16]} />
          <meshStandardMaterial color="#8ea0c4" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function Molecule3D({ molecule, autoRotate = true }) {
  const group = useRef();
  useFrame((_, dt) => {
    if (autoRotate && group.current) group.current.rotation.y += dt * 0.35;
  });
  if (!molecule) return null;
  return (
    <group ref={group}>
      <ambientLight intensity={0.7} />
      <pointLight position={[8, 8, 8]} intensity={160} />
      <pointLight position={[-8, -6, -4]} intensity={70} color="#B026FF" />
      {molecule.atoms.map((a, i) => {
        const style = ATOM_STYLE[a.el] || { color: "#94a3b8", r: 0.5 };
        return (
          <mesh key={i} position={a.pos}>
            <sphereGeometry args={[style.r, 32, 32]} />
            <meshStandardMaterial color={style.color} roughness={0.25} metalness={0.35} emissive={style.color} emissiveIntensity={0.15} />
          </mesh>
        );
      })}
      {molecule.bonds.map((b, i) => (
        <Bond key={i} start={molecule.atoms[b[0]].pos} end={molecule.atoms[b[1]].pos} order={b[2]} />
      ))}
    </group>
  );
}
