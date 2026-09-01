import React, { Suspense, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import Atom3D from "@/components/three/Atom3D";
import elements from "@/data/elements.json";
import { CATEGORY_COLORS, CATEGORY_LABELS, ELEMENT_INFO } from "@/data/chem";

function Stat({ label, value, sub, color }) {
  return (
    <div className="glass rounded-2xl p-3.5 sm:p-4 border border-[rgba(0,245,255,0.14)] relative overflow-hidden">
      <div className="text-[10px] sm:text-[11px] text-[var(--muted)] uppercase tracking-wider font-mono flex items-center justify-between">
        <span>{label}</span>
        {sub && <span className="opacity-50 text-[9px]">{sub}</span>}
      </div>
      <div className="font-display font-black text-lg sm:text-xl mt-1 truncate" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default function ElementProfile() {
  const { number } = useParams();
  const nav = useNavigate();
  const el = useMemo(() => elements.find((e) => e.number === Number(number)), [number]);

  if (!el) {
    return (
      <PageShell title="Element Not Found" accent="#FF3864">
        <div className="text-center py-12">
          <p className="text-[var(--muted)] mb-6 font-mono">The requested atomic number is outside the known 118-element periodic table.</p>
          <Link to="/periodic-galaxy" className="px-6 py-3 rounded-full font-mono text-xs font-semibold bg-[var(--cyan)] text-black">
            RETURN TO PERIODIC GALAXY
          </Link>
        </div>
      </PageShell>
    );
  }

  const color = CATEGORY_COLORS[el.category] || "#00F5FF";
  const info = ELEMENT_INFO[el.symbol];
  const summary = info?.summary || `${el.name} (${el.symbol}) is element number ${el.number}, classified as a ${CATEGORY_LABELS[el.category].toLowerCase()} in period ${el.period}.`;

  return (
    <PageShell testId="element-profile-page" accent={color} title={`${el.name} [${el.symbol}]`} subtitle={`Comprehensive structural spectroscopy and quantum properties for element Z=${el.number}.`}>
      {/* Element Sequence Controller */}
      <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 glass p-2.5 sm:p-3 rounded-2xl border border-[rgba(0,245,255,0.15)]">
        <button
          data-testid="prev-element"
          disabled={el.number <= 1}
          onClick={() => nav(`/element/${el.number - 1}`)}
          className="glass rounded-xl px-4 py-2.5 text-xs font-mono inline-flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer hover:border-[var(--cyan)] hover:text-[#E6F7FF] transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--cyan)]" /> PREV [Z={el.number - 1}]
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)]">
          <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: color, color }} />
          <span className="text-[#E6F7FF] font-semibold">{el.name.toUpperCase()}</span>
          <span className="hidden sm:inline opacity-60">· Z={el.number} / 118</span>
        </div>

        <button
          data-testid="next-element"
          disabled={el.number >= 118}
          onClick={() => nav(`/element/${el.number + 1}`)}
          className="glass rounded-xl px-4 py-2.5 text-xs font-mono inline-flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer hover:border-[var(--cyan)] hover:text-[#E6F7FF] transition-all"
        >
          NEXT [Z={el.number + 1}] <ChevronRight className="w-4 h-4 text-[var(--cyan)]" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* 3D Quantum Bohr Chamber */}
        <div className="glass rounded-3xl overflow-hidden h-[340px] sm:h-[420px] lg:h-[480px] relative border border-[rgba(0,245,255,0.2)] shadow-[0_0_40px_rgba(0,191,255,0.1)]">
          {/* Chamber HUD overlay */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--cyan)]">
                BOHR ATOMIC MODEL
              </span>
            </div>
            <div className="font-display font-black text-6xl sm:text-7xl leading-none" style={{ color, textShadow: `0 0 25px ${color}66` }}>
              {el.symbol}
            </div>
            <div className="text-[var(--muted)] text-xs sm:text-sm mt-1.5 font-mono">
              Shells ({el.shells.length}): <span className="text-[#E6F7FF]">{el.shells.join(" · ")}</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 pointer-events-none text-[10px] font-mono text-[var(--muted)] glass px-3 py-1 rounded-full border border-[rgba(0,245,255,0.12)]">
            DRAG TO ROTATE · SCROLL TO ZOOM
          </div>

          <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
            <Suspense fallback={null}>
              <Atom3D shells={el.shells} color={color} />
              <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Detailed Scientific Analysis Workstation */}
        <div className="flex flex-col gap-4 sm:gap-5 justify-between">
          <div className="glass rounded-3xl p-5 sm:p-7 border border-[rgba(0,245,255,0.16)]">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium border" style={{ background: `${color}18`, borderColor: `${color}55`, color }}>
                {CATEGORY_LABELS[el.category]}
              </span>
              <span className="text-[11px] font-mono text-[var(--muted)]">
                PERIOD {el.period} · GROUP {el.group || "f-block"}
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#E6F7FF]">{el.name}</h2>
            <p className="text-[var(--muted)] mt-3 text-xs sm:text-sm md:text-base leading-relaxed font-sans">{summary}</p>

            {/* Telemetry stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6">
              <Stat label="Atomic Number" value={el.number} sub="Z" color={color} />
              <Stat label="Atomic Mass" value={typeof el.mass === "number" ? el.mass.toFixed(3) : el.mass} sub="u" color={color} />
              <Stat label="Period" value={el.period} sub="Row" color={color} />
              <Stat label="Group" value={el.group || "f"} sub="Col" color={color} />
            </div>
          </div>

          {/* Uses & Discovery */}
          {info && (
            <div className="glass rounded-2xl p-4 sm:p-6 border border-[rgba(0,245,255,0.14)]">
              {info.uses && (
                <div>
                  <div className="text-[11px] text-[var(--cyan)] uppercase tracking-wider mb-2.5 font-mono">
                    INDUSTRIAL & SCIENTIFIC APPLICATIONS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {info.uses.map((u) => (
                      <span key={u} className="px-3 py-1 rounded-lg text-xs font-mono border" style={{ background: `${color}14`, borderColor: `${color}44`, color: "#E6F7FF" }}>
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {info.discovered && (
                <div className="text-xs text-[var(--muted)] mt-4 font-mono pt-3 border-t border-[rgba(0,245,255,0.1)] flex items-center justify-between">
                  <span>DISCOVERED:</span>
                  <span className="text-[#E6F7FF]">{info.discovered}</span>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link
              to="/atom-viewer"
              data-testid="goto-atom-viewer"
              className="flex-1 text-center px-6 py-3.5 rounded-full font-mono text-xs sm:text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)]"
            >
              LAUNCH ATOM VIEWER →
            </Link>
            <Link
              to="/quiz"
              data-testid="goto-quiz"
              className="text-center px-6 py-3.5 rounded-full font-mono text-xs sm:text-sm font-semibold glass border border-[rgba(0,245,255,0.25)] hover:border-[var(--cyan)] text-[#E6F7FF] transition-all hover:bg-white/5"
            >
              TEST IN QUIZ ARENA
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
