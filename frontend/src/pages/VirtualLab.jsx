import React, { useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Droplets, RotateCcw } from "lucide-react";
import PageShell from "@/components/PageShell";
import { addProgress } from "@/lib/progress";

const REAGENTS = [
  { id: "hcl", name: "HCl", tag: "Acid", fullName: "Hydrochloric Acid", color: "#00FF9C" },
  { id: "naoh", name: "NaOH", tag: "Strong Base", fullName: "Sodium Hydroxide", color: "#00F5FF" },
  { id: "phenol", name: "Phenol", tag: "Indicator", fullName: "Phenolphthalein", color: "#E6F7FF" },
  { id: "cuso4", name: "CuSO₄", tag: "Salt Solution", fullName: "Copper(II) Sulfate", color: "#00BFFF" },
  { id: "agno3", name: "AgNO₃", tag: "Metal Salt", fullName: "Silver Nitrate", color: "#C084FC" },
  { id: "nacl", name: "NaCl", tag: "Electrolyte", fullName: "Sodium Chloride", color: "#FFE600" },
];

const REACTIONS = {
  "naoh+phenol": { color: "#FF3864", obs: "The solution turns vivid fluorescent pink — phenolphthalein deprotonates in basic conditions (pH > 8.2)!" },
  "hcl+phenol": { color: "#E6F7FF", obs: "Remains crystal clear — phenolphthalein is completely colorless in acidic media (pH < 7)." },
  "hcl+naoh": { color: "#00BFFF", obs: "Neutralization! HCl + NaOH → NaCl + H₂O. Exothermic enthalpy release detected." },
  "cuso4+naoh": { color: "#0088FF", obs: "A brilliant pale-blue gelatinous precipitate of copper(II) hydroxide [Cu(OH)₂] forms instantly." },
  "agno3+nacl": { color: "#FFFFFF", obs: "A dense white precipitate of silver chloride (AgCl) crashes out immediately via ionic double-displacement." },
};

export default function VirtualLab() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const toggle = (id) => {
    if (result) return;
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 2 ? [...s, id] : s
    );
  };

  const mix = () => {
    if (selected.length < 2) return;
    const key1 = selected.join("+");
    const key2 = [...selected].reverse().join("+");
    const r = REACTIONS[key1] || REACTIONS[key2] || {
      color: "#38BDF8",
      obs: "The reagents mix into a stable homogeneous solution without an immediate visible reaction.",
    };
    setResult(r);
    addProgress({ module: "lab", xp: 12, achievement: "First Experiment" }).catch(() => {});
  };

  const reset = () => { setSelected([]); setResult(null); };

  const liquidColor = result ? result.color : selected.length ? "#0B2545" : "#080D1C";

  return (
    <PageShell
      testId="virtual-lab-page"
      title="Virtual Synthesis Lab"
      subtitle="Precision reagent mixing workstation. Select chemical compounds from the shelf, mix in volumetric glassware, and observe instantaneous reactions."
      accent="#00F5FF"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* Volumetric Beaker Containment Chamber */}
        <div className="glass rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-between relative overflow-hidden min-h-[360px] sm:min-h-[440px] border border-[rgba(0,245,255,0.2)] shadow-[0_0_40px_rgba(0,191,255,0.12)]">
          <div className="absolute inset-0 chem-grid opacity-20 pointer-events-none" />

          {/* Chamber Header */}
          <div className="w-full flex items-center justify-between font-mono text-[10px] sm:text-xs text-[var(--muted)] z-10 border-b border-[rgba(0,245,255,0.1)] pb-3">
            <span className="text-[var(--cyan)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] pulsering" />
              BENCH #04 · VOLUMETRIC REACTOR
            </span>
            <span>CAPACITY: 250 mL</span>
          </div>

          {/* Graduated Glass Beaker */}
          <div className="relative w-44 sm:w-52 h-56 sm:h-64 my-auto flex items-end justify-center">
            {/* Beaker Outline with graduation marks */}
            <div className="absolute inset-x-2 bottom-0 h-52 sm:h-60 rounded-b-3xl rounded-t-md border-2 border-[rgba(0,245,255,0.35)] bg-[rgba(11,18,36,0.6)] backdrop-blur-md overflow-hidden shadow-[inset_0_0_20px_rgba(0,245,255,0.15)]">
              {/* Graduation ticks */}
              <div className="absolute left-2 inset-y-4 flex flex-col justify-between text-[8px] font-mono text-[var(--cyan)] opacity-70 pointer-events-none z-20">
                <span>— 200ml</span>
                <span>— 150ml</span>
                <span>— 100ml</span>
                <span>— 50ml</span>
              </div>

              {/* Glowing Liquid Meniscus */}
              <motion.div
                className="absolute inset-x-0 bottom-0 transition-all duration-700"
                animate={{
                  height: result ? "72%" : selected.length === 2 ? "55%" : selected.length === 1 ? "30%" : "12%",
                  backgroundColor: liquidColor,
                }}
                style={{
                  boxShadow: `0 0 50px ${liquidColor}`,
                }}
                data-testid="beaker-liquid"
              >
                {/* Surface Meniscus line */}
                <div className="w-full h-1 bg-white/40 shadow-[0_0_8px_#ffffff]" />
                {/* Subtle bubble sparkles */}
                {result && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle at 50% 25%, #ffffff44, transparent 65%)` }}
                  />
                )}
              </motion.div>
            </div>

            {/* Beaker top glass spout */}
            <Beaker className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 text-[var(--cyan)] opacity-50 pointer-events-none" />
          </div>

          {/* Observation Readout Box */}
          <div className="relative w-full z-10 min-h-[64px] flex items-center justify-center text-center p-3 rounded-2xl glass border border-[rgba(0,245,255,0.15)]">
            {result ? (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[#E6F7FF] text-xs sm:text-sm font-medium font-sans max-w-md leading-relaxed" data-testid="lab-observation">
                <span className="text-[var(--cyan)] font-mono font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                  SPECTROSCOPIC OBSERVATION
                </span>
                {result.obs}
              </motion.p>
            ) : (
              <p className="text-[var(--muted)] text-xs font-mono">
                {selected.length === 0 ? "Select 2 reagents from the shelf to begin synthesis" : selected.length === 1 ? "Select 1 more reagent to mix…" : "Two reagents charged into reactor. Click 'MIX REAGENTS'."}
              </p>
            )}
          </div>
        </div>

        {/* Reagents Shelf & Controls */}
        <div className="flex flex-col gap-4 sm:gap-5 justify-between">
          <div className="glass rounded-3xl p-5 sm:p-7 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_24px_rgba(5,8,22,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[var(--cyan)] uppercase tracking-wider font-mono">
                REAGENT REPOSITORY
              </span>
              <span className="text-xs font-mono text-[var(--muted)]">
                CHARGED: <strong className="text-[var(--cyan)]">{selected.length}</strong>/2
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {REAGENTS.map((r) => {
                const isSelected = selected.includes(r.id);
                return (
                  <button
                    key={r.id}
                    data-testid={`reagent-${r.id}`}
                    onClick={() => toggle(r.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all border active:scale-95 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[rgba(0,245,255,0.14)] border-[var(--cyan)] shadow-[0_0_18px_rgba(0,245,255,0.25)]"
                        : "glass hover:bg-white/5 border-[rgba(0,245,255,0.12)] hover:border-[rgba(0,245,255,0.3)]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ background: r.color, color: r.color }} />
                      <span className="text-[9px] font-mono text-[var(--muted)] uppercase px-1.5 py-0.5 rounded bg-white/5">
                        {r.tag}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-mono font-bold text-[#E6F7FF]">{r.name}</div>
                      <div className="text-[10px] text-[var(--muted)] truncate mt-0.5 font-sans">{r.fullName}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              data-testid="mix-button"
              onClick={mix}
              disabled={selected.length < 2 || result}
              className="flex-1 py-4 rounded-full font-mono text-xs sm:text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.3)]"
            >
              <Droplets className="w-4 h-4" /> MIX REAGENTS ({selected.length}/2)
            </button>
            <button
              data-testid="lab-reset"
              onClick={reset}
              className="px-7 py-4 rounded-full font-mono text-xs sm:text-sm font-semibold glass border border-[rgba(0,245,255,0.2)] hover:border-[var(--cyan)] inline-flex items-center justify-center gap-2 text-[#E6F7FF] cursor-pointer hover:bg-white/5"
            >
              <RotateCcw className="w-4 h-4 text-[var(--cyan)]" /> DRAIN / RESET
            </button>
          </div>

          <p className="text-[11px] font-mono text-[var(--muted)] px-1">
            RECOMMENDED TESTS: NaOH + Phenol (Indicator), HCl + NaOH (Neutralization), AgNO₃ + NaCl (Precipitate).
          </p>
        </div>
      </div>
    </PageShell>
  );
}
