import React, { Suspense, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import Atom3D from "@/components/three/Atom3D";
import elements from "@/data/elements.json";
import { CATEGORY_COLORS, CATEGORY_LABELS, ELEMENT_INFO } from "@/data/chem";

function Stat({ label, value, color }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs text-[var(--muted)] uppercase tracking-wider">{label}</div>
      <div className="font-display font-bold text-lg mt-1" style={{ color }}>{value}</div>
    </div>
  );
}

export default function ElementProfile() {
  const { number } = useParams();
  const nav = useNavigate();
  const el = useMemo(() => elements.find((e) => e.number === Number(number)), [number]);

  if (!el) return <PageShell title="Element not found"><Link to="/periodic-galaxy" className="text-[var(--cyan)]">Back to galaxy</Link></PageShell>;

  const color = CATEGORY_COLORS[el.category];
  const info = ELEMENT_INFO[el.symbol];
  const summary = info?.summary || `${el.name} (${el.symbol}) is element number ${el.number}, classified as a ${CATEGORY_LABELS[el.category].toLowerCase()} in period ${el.period}.`;

  return (
    <PageShell testId="element-profile-page" accent={color}>
      <div className="flex items-center justify-between mb-6">
        <button data-testid="prev-element" disabled={el.number <= 1} onClick={() => nav(`/element/${el.number - 1}`)} className="glass rounded-full px-4 py-2 text-sm inline-flex items-center gap-1 disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <span className="font-mono text-sm text-[var(--muted)]">{el.number} / 118</span>
        <button data-testid="next-element" disabled={el.number >= 118} onClick={() => nav(`/element/${el.number + 1}`)} className="glass rounded-full px-4 py-2 text-sm inline-flex items-center gap-1 disabled:opacity-30">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* 3D atom */}
        <div className="glass rounded-3xl overflow-hidden h-[420px] relative">
          <div className="absolute top-4 left-5 z-10">
            <div className="font-display font-extrabold text-7xl" style={{ color }}>{el.symbol}</div>
            <div className="text-[var(--muted)] text-sm">Bohr model · {el.shells.join(", ")}</div>
          </div>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
            <Suspense fallback={null}>
              <Atom3D shells={el.shells} color={color} />
              <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${color}22`, color }}>
              {CATEGORY_LABELS[el.category]}
            </span>
            <h1 className="font-display font-extrabold text-5xl">{el.name}</h1>
            <p className="text-[var(--muted)] mt-4 leading-relaxed">{summary}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Number" value={el.number} color={color} />
            <Stat label="Mass" value={el.mass} color={color} />
            <Stat label="Period" value={el.period} color={color} />
            <Stat label="Group" value={el.group || "f-block"} color={color} />
          </div>

          {info?.uses && (
            <div className="glass rounded-xl p-5">
              <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Common Uses</div>
              <div className="flex flex-wrap gap-2">
                {info.uses.map((u) => (
                  <span key={u} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: `${color}18`, color }}>{u}</span>
                ))}
              </div>
              {info.discovered && <div className="text-xs text-[var(--muted)] mt-4">Discovered: {info.discovered}</div>}
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/atom-viewer" data-testid="goto-atom-viewer" className="flex-1 text-center px-5 py-3 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all">
              Open in Atom Viewer
            </Link>
            <Link to="/quiz" data-testid="goto-quiz" className="px-5 py-3 rounded-full font-semibold glass hover:border-[var(--cyan)]">
              Quiz
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
