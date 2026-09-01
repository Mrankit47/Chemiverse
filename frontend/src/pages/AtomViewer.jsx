import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PageShell from "@/components/PageShell";
import Atom3D from "@/components/three/Atom3D";
import elements from "@/data/elements.json";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/chem";

const FEATURED = [1, 2, 6, 7, 8, 11, 13, 17, 26, 29, 79, 92];
const SHELL_NAMES = ["K (n=1)", "L (n=2)", "M (n=3)", "N (n=4)", "O (n=5)", "P (n=6)", "Q (n=7)"];

export default function AtomViewer() {
  const [num, setNum] = useState(6);
  const el = elements.find((e) => e.number === num) || elements[5];
  const color = CATEGORY_COLORS[el.category] || "#00F5FF";

  return (
    <PageShell
      testId="atom-viewer-page"
      title="Atom Quantum Viewer"
      subtitle="Interactive 3D Bohr model analyzer with animated orbital shells and real-time quantum electron distribution."
      accent="#8B5CF6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* 3D Quantum Containment Chamber */}
        <div className="lg:col-span-2 glass rounded-3xl h-[360px] sm:h-[460px] lg:h-[540px] relative overflow-hidden border border-[rgba(0,245,255,0.2)] shadow-[0_0_40px_rgba(139,92,246,0.12)]">
          {/* Chamber HUD Readout */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] pulsering" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--cyan)]">
                ORBITAL SPECTROSCOPY
              </span>
            </div>
            <div className="font-display font-black text-5xl sm:text-7xl leading-none" style={{ color, textShadow: `0 0 20px ${color}66` }}>
              {el.symbol}
            </div>
            <div className="text-lg sm:text-xl font-display text-[#E6F7FF] mt-1">{el.name}</div>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)] mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded glass border border-[rgba(0,245,255,0.15)] text-[#E6F7FF]">
                {el.number}p⁺
              </span>
              <span className="px-2 py-0.5 rounded glass border border-[rgba(0,245,255,0.15)] text-[#E6F7FF]">
                {el.number}e⁻
              </span>
              <span className="px-2 py-0.5 rounded glass border border-[rgba(0,245,255,0.15)] text-[var(--cyan)]">
                Valence: {el.shells[el.shells.length - 1]}e⁻
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 pointer-events-none text-[10px] font-mono text-[var(--muted)] glass px-3 py-1 rounded-full border border-[rgba(0,245,255,0.12)]">
            DRAG TO ROTATE · SCROLL TO ZOOM
          </div>

          <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
            <Suspense fallback={null}>
              <Atom3D shells={el.shells} color={color} />
              <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.4} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side Panels: Quantum Shells & Controls */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Electron Shell Energy Distribution */}
          <div className="glass rounded-2xl p-5 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_20px_rgba(5,8,22,0.5)]">
            <div className="flex items-center justify-between text-xs text-[var(--cyan)] uppercase tracking-wider mb-4 font-mono">
              <span>ELECTRON SHELL LEVELS</span>
              <span className="text-[10px] text-[var(--muted)]">{el.shells.length} ORBITS</span>
            </div>
            <div className="space-y-3">
              {el.shells.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-[11px] sm:text-xs w-20 text-[var(--muted)] shrink-0">
                    {SHELL_NAMES[i] || `n=${i + 1}`}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-[rgba(0,245,255,0.1)]">
                    <div
                      className="h-full rounded-full transition-all duration-300 shadow-[0_0_8px_currentColor]"
                      style={{ width: `${Math.min(100, (c / 32) * 100)}%`, background: color, color }}
                    />
                  </div>
                  <span className="font-mono text-xs w-8 text-right font-bold" style={{ color }}>
                    {c} <span className="text-[9px] font-normal text-[var(--muted)]">e⁻</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 text-xs font-mono text-[var(--muted)] pt-3 border-t border-[rgba(0,245,255,0.1)] flex items-center justify-between">
              <span>CLASSIFICATION:</span>
              <span className="font-semibold" style={{ color }}>{CATEGORY_LABELS[el.category]}</span>
            </div>
          </div>

          {/* Quick Element Selector & Slider */}
          <div className="glass rounded-2xl p-5 border border-[rgba(0,245,255,0.16)]">
            <div className="text-xs text-[var(--cyan)] uppercase tracking-wider mb-3 font-mono">
              SELECT KEY ELEMENT
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {FEATURED.map((n) => {
                const e = elements.find((x) => x.number === n);
                const c = CATEGORY_COLORS[e.category] || "#00F5FF";
                const isSelected = num === n;
                return (
                  <button
                    key={n}
                    data-testid={`atom-pick-${e.symbol}`}
                    onClick={() => setNum(n)}
                    className="aspect-square rounded-xl font-display font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center border"
                    style={{
                      background: isSelected ? c : `${c}15`,
                      color: isSelected ? "#050816" : c,
                      borderColor: isSelected ? "#FFFFFF" : `${c}44`,
                      boxShadow: isSelected ? `0 0 16px ${c}` : "none",
                    }}
                  >
                    <span>{e.symbol}</span>
                    <span className="text-[7px] font-mono leading-none opacity-80 mt-0.5">{n}</span>
                  </button>
                );
              })}
            </div>

            {/* Atomic slider */}
            <div className="mt-5 pt-4 border-t border-[rgba(0,245,255,0.1)]">
              <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)] mb-2">
                <span>ATOMIC SLIDER</span>
                <span className="text-[#E6F7FF] font-semibold">Z = {num}</span>
              </div>
              <input
                data-testid="atom-slider"
                type="range"
                min={1}
                max={118}
                value={num}
                onChange={(e) => setNum(Number(e.target.value))}
                className="w-full accent-[var(--cyan)] cursor-pointer h-1.5 bg-white/10 rounded-full"
              />
              <div className="flex justify-between text-[9px] font-mono text-[var(--muted)] mt-1.5">
                <span>1 (H)</span>
                <span className="text-[var(--cyan)]">{el.name} [{el.symbol}]</span>
                <span>118 (Og)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
