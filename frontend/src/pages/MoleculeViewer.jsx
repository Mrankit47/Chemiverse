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
      title="Molecular Structure Viewer"
      subtitle="Interactive 3D ball-and-stick stereochemistry workstation. Analyze atomic geometry, covalent bonding, and spatial symmetry."
      accent="#00BFFF"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Molecule Selector Sidebar */}
        <div className="glass rounded-3xl p-4 sm:p-5 h-fit order-2 lg:order-1 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_20px_rgba(5,8,22,0.5)]">
          <div className="flex items-center justify-between text-xs text-[var(--cyan)] uppercase tracking-wider mb-4 px-1 font-mono">
            <span>MOLECULE REGISTRY</span>
            <span className="text-[10px] text-[var(--muted)]">{MOLECULES.length} MODELS</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {MOLECULES.map((m) => {
              const active = id === m.id;
              return (
                <button
                  key={m.id}
                  data-testid={`molecule-select-${m.id}`}
                  onClick={() => setId(m.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                    active
                      ? "bg-[rgba(0,191,255,0.14)] border-[var(--cyan)] text-[#E6F7FF] font-semibold shadow-[0_0_15px_rgba(0,245,255,0.25)]"
                      : "border-[rgba(0,245,255,0.1)] hover:bg-white/5 text-[var(--muted)] hover:text-white"
                  }`}
                >
                  <div className="flex flex-col truncate mr-2">
                    <span className="text-xs sm:text-sm truncate text-[#E6F7FF]">{m.name}</span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">{m.category}</span>
                  </div>
                  <span
                    className="font-mono text-xs sm:text-sm shrink-0 px-2 py-0.5 rounded glass"
                    style={{ color: active ? "#00F5FF" : "inherit" }}
                  >
                    {m.formula}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Viewport + Molecular Analytics */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-4 sm:gap-5">
          <div className="glass rounded-3xl h-[340px] sm:h-[420px] lg:h-[480px] relative overflow-hidden border border-[rgba(0,245,255,0.2)] shadow-[0_0_40px_rgba(0,191,255,0.12)]">
            {/* Viewport HUD */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[var(--cyan)] pulsering" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--cyan)]">
                  3D STEREOCHEMISTRY
                </span>
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-4xl text-[#E6F7FF]">{mol.name}</div>
              <div className="font-mono text-xl sm:text-2xl text-[var(--cyan)] font-bold text-glow">{mol.formula}</div>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono glass border border-[rgba(0,245,255,0.2)] text-[var(--muted)]">
                {mol.category.toUpperCase()} COMPOUND
              </span>
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 pointer-events-none text-[10px] font-mono text-[var(--muted)] glass px-3 py-1 rounded-full border border-[rgba(0,245,255,0.12)]">
              INTERACTIVE ROTATION ACTIVE
            </div>

            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
              <Suspense fallback={null}>
                <Molecule3D molecule={mol} />
                <OrbitControls enableZoom enablePan={false} />
              </Suspense>
            </Canvas>
          </div>

          {/* Molecular Analytics / Did You Know Card */}
          <motion.div
            key={mol.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-5 sm:p-7 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_24px_rgba(5,8,22,0.5)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--cyan)] uppercase tracking-wider font-mono">
                MOLECULAR INSIGHT & STEREOCHEMISTRY
              </span>
              <div className="flex gap-2 font-mono text-xs text-[var(--muted)]">
                <span className="px-2 py-0.5 rounded glass border border-[rgba(0,245,255,0.15)] text-[#E6F7FF]">
                  {mol.atoms.length} Atoms
                </span>
                <span className="px-2 py-0.5 rounded glass border border-[rgba(0,245,255,0.15)] text-[#E6F7FF]">
                  {mol.bonds.length} Bonds
                </span>
              </div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-[#E6F7FF] font-sans">{mol.fact}</p>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
