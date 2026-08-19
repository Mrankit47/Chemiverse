import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PageShell from "@/components/PageShell";
import Atom3D from "@/components/three/Atom3D";
import elements from "@/data/elements.json";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/chem";

const FEATURED = [1, 2, 6, 7, 8, 11, 13, 17, 26, 29, 79, 92];

export default function AtomViewer() {
  const [num, setNum] = useState(6);
  const el = elements.find((e) => e.number === num) || elements[5];
  const color = CATEGORY_COLORS[el.category];

  return (
    <PageShell
      testId="atom-viewer-page"
      title="Atom Viewer"
      subtitle="Visualize atomic structure with animated electron shells. Drag to rotate, scroll to zoom."
      accent="#B026FF"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* 3D Canvas Card */}
        <div className="lg:col-span-2 glass rounded-3xl h-[340px] sm:h-[440px] lg:h-[520px] relative overflow-hidden">
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-10 pointer-events-none">
            <div className="font-display font-extrabold text-4xl sm:text-6xl" style={{ color }}>{el.symbol}</div>
            <div className="text-lg sm:text-xl font-display">{el.name}</div>
            <div className="text-[var(--muted)] text-xs sm:text-sm mt-0.5 sm:mt-1">
              {el.number} protons · {el.number} electrons
            </div>
          </div>
          <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
            <Suspense fallback={null}>
              <Atom3D shells={el.shells} color={color} />
              <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.4} />
            </Suspense>
          </Canvas>
        </div>

        {/* Side Panels */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Electron Shells */}
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Electron Shells</div>
            <div className="space-y-2">
              {el.shells.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm w-12 sm:w-14 text-[var(--muted)]">n={i + 1}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(c / 32) * 100}%`, background: color }} />
                  </div>
                  <span className="font-mono text-xs sm:text-sm w-6 text-right font-semibold" style={{ color }}>{c}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-[var(--muted)] pt-3 border-t border-[var(--border)]">
              Category: <span className="font-medium" style={{ color }}>{CATEGORY_LABELS[el.category]}</span>
            </div>
          </div>

          {/* Quick Element Picker */}
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Pick an element</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {FEATURED.map((n) => {
                const e = elements.find((x) => x.number === n);
                const c = CATEGORY_COLORS[e.category];
                return (
                  <button
                    key={n}
                    data-testid={`atom-pick-${e.symbol}`}
                    onClick={() => setNum(n)}
                    className="aspect-square rounded-lg font-display font-bold text-sm sm:text-base transition-all active:scale-95 cursor-pointer"
                    style={{
                      background: num === n ? c : `${c}18`,
                      color: num === n ? "#050816" : c,
                      border: `1px solid ${c}55`,
                    }}
                  >
                    {e.symbol}
                  </button>
                );
              })}
            </div>
            <input
              data-testid="atom-slider"
              type="range" min={1} max={118} value={num}
              onChange={(e) => setNum(Number(e.target.value))}
              className="w-full mt-4 accent-[var(--purple)] cursor-pointer"
            />
            <div className="text-center text-xs text-[var(--muted)] mt-1 font-mono">Atomic number: {num}</div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
