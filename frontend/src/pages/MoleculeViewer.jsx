import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Molecule3D from "@/components/three/Molecule3D";
import { MOLECULES } from "@/data/chem";

export default function MoleculeViewer() {
  const [id, setId] = useState(MOLECULES[0].id);
  const mol = MOLECULES.find((m) => m.id === id);

  return (
    <PageShell
      testId="molecule-viewer-page"
      title="Molecule Viewer"
      subtitle="Rotate real molecules in 3D ball-and-stick form. Explore geometry, bonds and structure."
      accent="#FF9E1B"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="glass rounded-2xl p-4 h-fit order-2 lg:order-1">
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3 px-2">Molecules</div>
          <div className="space-y-1">
            {MOLECULES.map((m) => (
              <button
                key={m.id}
                data-testid={`molecule-select-${m.id}`}
                onClick={() => setId(m.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  id === m.id ? "bg-[var(--orange)]/15 text-white" : "hover:bg-white/5 text-[var(--muted)]"
                }`}
              >
                <span className="font-medium">{m.name}</span>
                <span className="font-mono text-sm" style={{ color: id === m.id ? "#FF9E1B" : "inherit" }}>{m.formula}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="glass rounded-3xl h-[440px] relative overflow-hidden">
            <div className="absolute top-5 left-6 z-10">
              <div className="font-display font-extrabold text-4xl">{mol.name}</div>
              <div className="font-mono text-xl text-[var(--orange)]">{mol.formula}</div>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs glass">{mol.category}</span>
            </div>
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <Molecule3D molecule={mol} />
                <OrbitControls enableZoom enablePan={false} />
              </Suspense>
            </Canvas>
          </div>
          <motion.div
            key={mol.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mt-5"
          >
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Did you know?</div>
            <p className="text-lg leading-relaxed">{mol.fact}</p>
            <div className="text-sm text-[var(--muted)] mt-4">
              {mol.atoms.length} atoms · {mol.bonds.length} bonds
            </div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
