import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Molecule3D from "@/components/three/Molecule3D";
import { MOLECULES } from "@/data/chem";

export default function MoleculeViewer() {
  const [id, setId] = useState(MOLECULES[0].id);
  const mol = MOLECULES.find((m) => m.id === id) || MOLECULES[0];

  return (
    <PageShell
      testId="molecule-viewer-page"
      title="Molecule Viewer"
      subtitle="Rotate real molecules in 3D ball-and-stick form. Explore geometry, bonds and structure."
      accent="#FF9E1B"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Molecule Selector (Side on Desktop, Top touch-grid/carousel on Mobile) */}
        <div className="glass rounded-2xl p-4 h-fit order-2 lg:order-1">
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3 px-1 font-mono">
            Select Molecule
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 sm:gap-2">
            {MOLECULES.map((m) => (
              <button
                key={m.id}
                data-testid={`molecule-select-${m.id}`}
                onClick={() => setId(m.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                  id === m.id
                    ? "bg-[var(--orange)]/15 border-[var(--orange)] text-white font-medium"
                    : "border-transparent hover:bg-white/5 text-[var(--muted)] hover:text-white"
                }`}
              >
                <span className="text-xs sm:text-sm truncate mr-2">{m.name}</span>
                <span className="font-mono text-xs shrink-0" style={{ color: id === m.id ? "#FF9E1B" : "inherit" }}>
                  {m.formula}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Canvas + Fact Card */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-4 sm:gap-5">
          <div className="glass rounded-3xl h-[300px] sm:h-[380px] lg:h-[440px] relative overflow-hidden">
            <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-10 pointer-events-none">
              <div className="font-display font-extrabold text-2xl sm:text-4xl">{mol.name}</div>
              <div className="font-mono text-lg sm:text-xl text-[var(--orange)]">{mol.formula}</div>
              <span className="inline-block mt-1 sm:mt-2 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs glass">
                {mol.category}
              </span>
            </div>
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
              <Suspense fallback={null}>
                <Molecule3D molecule={mol} />
                <OrbitControls enableZoom enablePan={false} />
              </Suspense>
            </Canvas>
          </div>

          <motion.div
            key={mol.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 font-mono">Did you know?</div>
            <p className="text-base sm:text-lg leading-relaxed">{mol.fact}</p>
            <div className="text-xs sm:text-sm text-[var(--muted)] mt-3 sm:mt-4 font-mono">
              {mol.atoms.length} atoms · {mol.bonds.length} bonds
            </div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
