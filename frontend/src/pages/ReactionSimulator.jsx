import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Flame, Snowflake } from "lucide-react";
import PageShell from "@/components/PageShell";
import { REACTIONS } from "@/data/chem";
import { addProgress } from "@/lib/progress";

function Chip({ label, color, status }) {
  return (
    <span
      className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl font-formula chem-formula font-bold text-base sm:text-lg glass border transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      style={{
        borderColor: status === "product" ? "#00FF9C" : color,
        color: status === "product" ? "#00FF9C" : "#E6F7FF",
        boxShadow: `0 0 20px ${status === "product" ? "#00FF9C44" : `${color}33`}`,
      }}
    >
      {label}
    </span>
  );
}

export default function ReactionSimulator() {
  const [active, setActive] = useState(REACTIONS[0]);
  const [phase, setPhase] = useState("idle"); // idle | reacting | done

  const run = () => {
    setPhase("reacting");
    setTimeout(() => {
      setPhase("done");
      addProgress({ module: "reaction", xp: 15 }).catch(() => {});
    }, 1600);
  };
  const reset = () => setPhase("idle");

  const isExo = active.energy === "exothermic";
  const energyColor = isExo ? "#FFE600" : "#00F5FF";

  return (
    <PageShell
      testId="reaction-simulator-page"
      title="Reaction Simulator"
      subtitle="High-energy chemical kinetics simulation chamber. Inspect molecular bond breaking, exothermic enthalpy changes, and balanced stoichiometry."
      accent="#00FF9C"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Reaction Selection Sidebar */}
        <div className="glass rounded-3xl p-4 sm:p-5 h-fit border border-[rgba(0,245,255,0.16)] shadow-[0_4px_20px_rgba(5,8,22,0.5)]">
          <div className="flex items-center justify-between text-xs text-[var(--cyan)] uppercase tracking-wider mb-4 px-1 font-mono">
            <span>REACTION REGISTRY</span>
            <span className="text-[10px] text-[var(--muted)]">{REACTIONS.length} PRESETS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {REACTIONS.map((r) => {
              const activeReaction = active.id === r.id;
              return (
                <button
                  key={r.id}
                  data-testid={`reaction-select-${r.id}`}
                  onClick={() => { setActive(r); setPhase("idle"); }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all border cursor-pointer ${
                    activeReaction
                      ? "bg-[rgba(0,255,156,0.12)] border-[var(--green)] text-[#E6F7FF] font-medium shadow-[0_0_15px_rgba(0,255,156,0.2)]"
                      : "border-[rgba(0,245,255,0.1)] hover:bg-white/5 text-[var(--muted)] hover:text-white"
                  }`}
                >
                  <div className="font-medium text-xs sm:text-sm text-[#E6F7FF]">{r.name}</div>
                  <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs mt-1">
                    <span style={{ color: r.color }}>{r.type}</span>
                    <span className="capitalize opacity-75 text-[var(--muted)]">{r.energy}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reaction Chamber Stage */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
          <div className="glass rounded-3xl p-6 sm:p-10 min-h-[300px] sm:min-h-[360px] flex flex-col items-center justify-between relative overflow-hidden border border-[rgba(0,245,255,0.2)] shadow-[0_0_40px_rgba(0,255,156,0.1)]">
            <div className="absolute inset-0 opacity-20 chem-grid pointer-events-none" />

            {/* Chamber Status Header */}
            <div className="w-full flex items-center justify-between font-mono text-[10px] sm:text-xs text-[var(--muted)] z-10 border-b border-[rgba(0,245,255,0.1)] pb-3">
              <span className="text-[var(--cyan)] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--cyan)] pulsering" />
                CHAMBER #01 · {active.name.toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border ${
                phase === "reacting"
                  ? "border-[var(--yellow)] text-[var(--yellow)] animate-pulse"
                  : phase === "done"
                  ? "border-[var(--green)] text-[var(--green)]"
                  : "border-[rgba(0,245,255,0.2)] text-[var(--muted)]"
              }`}>
                {phase === "reacting" ? "REACTION IN PROGRESS" : phase === "done" ? "EQUILIBRIUM ACHIEVED" : "STANDBY // READY"}
              </span>
            </div>

            {/* Kinetic Transformation Stage */}
            <div className="relative my-auto py-6 flex items-center gap-4 sm:gap-6 flex-wrap justify-center px-2 z-10">
              <AnimatePresence mode="wait">
                {phase !== "done" ? (
                  <motion.div
                    key="reactants"
                    className="flex flex-col items-center gap-3"
                    animate={phase === "reacting" ? { scale: [1, 1.08, 0.85], opacity: [1, 0.8, 0] } : {}}
                    transition={{ duration: 1.4 }}
                  >
                    <span className="text-[10px] font-mono tracking-widest text-[var(--cyan)] uppercase">
                      REACTANTS
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                      {active.reactants.map((r, i) => (
                        <React.Fragment key={i}>
                          <Chip label={r} color={active.color} status="reactant" />
                          {i < active.reactants.length - 1 && <span className="text-xl sm:text-2xl text-[var(--cyan)] font-mono">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="products"
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-[10px] font-mono tracking-widest text-[var(--green)] uppercase">
                      SYNTHESIZED PRODUCTS
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                      {active.products.map((p, i) => (
                        <React.Fragment key={i}>
                          <Chip label={p} color={active.color} status="product" />
                          {i < active.products.length - 1 && <span className="text-xl sm:text-2xl text-[var(--green)] font-mono">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Energy flash effect */}
            {phase === "reacting" && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 1.4 }}
                style={{ background: `radial-gradient(circle at 50% 50%, ${active.color}66, transparent 65%)` }}
              />
            )}

            {/* Stoichiometric Equation Bar */}
            <div
              className="relative w-full z-10 font-formula chem-formula font-semibold text-sm sm:text-lg text-center px-5 py-3 rounded-2xl glass border border-[rgba(0,245,255,0.22)] break-words text-[#E6F7FF] shadow-[0_0_20px_rgba(0,245,255,0.1)]"
              data-testid="reaction-equation"
            >
              {active.equation}
            </div>
          </div>

          {/* Controls & Thermodynamic Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="glass rounded-2xl p-4 sm:p-5 sm:col-span-2 border border-[rgba(0,245,255,0.15)] flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                {isExo ? (
                  <Flame className="w-4 h-4 text-[var(--yellow)]" />
                ) : (
                  <Snowflake className="w-4 h-4 text-[var(--cyan)]" />
                )}
                <span className="text-xs sm:text-sm font-lab font-bold uppercase tracking-wider" style={{ color: energyColor }}>
                  {active.energy} ENTHALPY
                </span>
              </div>
              <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed font-sans">{active.desc}</p>
            </div>

            <div className="flex sm:flex-col gap-2.5 sm:gap-3">
              <button
                data-testid="run-reaction"
                onClick={run}
                disabled={phase === "reacting"}
                className="flex-1 py-3.5 rounded-2xl font-lab text-xs sm:text-sm font-bold uppercase tracking-wider bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              >
                <Play className="w-4 h-4" /> IGNITE REACTION
              </button>
              <button
                data-testid="reset-reaction"
                onClick={reset}
                className="sm:rounded-2xl rounded-2xl font-lab text-xs sm:text-sm font-bold uppercase tracking-wider glass py-3 px-4 inline-flex items-center justify-center gap-2 hover:border-[var(--cyan)] text-[#E6F7FF] cursor-pointer border border-[rgba(0,245,255,0.2)] hover:bg-white/5"
              >
                <RotateCcw className="w-4 h-4 text-[var(--cyan)]" /> PURGE CHAMBER
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
