import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Flame, Snowflake } from "lucide-react";
import PageShell from "@/components/PageShell";
import { REACTIONS } from "@/data/chem";
import { addProgress } from "@/lib/progress";

function Chip({ label, color }) {
  return (
    <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono font-semibold text-xs sm:text-sm glass" style={{ borderColor: color, color }}>
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

  return (
    <PageShell
      testId="reaction-simulator-page"
      title="Reaction Simulator"
      subtitle="Pick a reaction and watch reactants transform into products with energy flow."
      accent="#1FE3C2"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Reaction Selection list */}
        <div className="glass rounded-2xl p-4 h-fit">
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3 px-1 font-mono">Select Reaction</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
            {REACTIONS.map((r) => (
              <button
                key={r.id}
                data-testid={`reaction-select-${r.id}`}
                onClick={() => { setActive(r); setPhase("idle"); }}
                className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all border cursor-pointer ${
                  active.id === r.id
                    ? "bg-white/10 border-white/30 text-white"
                    : "border-transparent hover:bg-white/5 text-[var(--muted)] hover:text-white"
                }`}
              >
                <div className="font-medium text-xs sm:text-sm">{r.name}</div>
                <div className="font-mono text-[11px] sm:text-xs mt-0.5" style={{ color: r.color }}>{r.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Reaction Stage */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
          <div className="glass rounded-3xl p-6 sm:p-8 min-h-[260px] sm:min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 chem-grid" />
            <div className="relative flex items-center gap-3 sm:gap-6 flex-wrap justify-center px-2">
              <AnimatePresence mode="wait">
                {phase !== "done" ? (
                  <motion.div
                    key="reactants"
                    className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center"
                    animate={phase === "reacting" ? { x: [0, 20, 0], scale: [1, 1.1, 0.9], opacity: [1, 1, 0] } : {}}
                    transition={{ duration: 1.4 }}
                  >
                    {active.reactants.map((r, i) => (
                      <React.Fragment key={i}>
                        <Chip label={r} color={active.color} />
                        {i < active.reactants.length - 1 && <span className="text-xl sm:text-2xl text-[var(--muted)]">+</span>}
                      </React.Fragment>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="products"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center"
                  >
                    {active.products.map((p, i) => (
                      <React.Fragment key={i}>
                        <Chip label={p} color={active.color} />
                        {i < active.products.length - 1 && <span className="text-xl sm:text-2xl text-[var(--muted)]">+</span>}
                      </React.Fragment>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {phase === "reacting" && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 1.4 }}
                style={{ background: `radial-gradient(circle at 50% 50%, ${active.color}44, transparent 60%)` }}
              />
            )}

            <div className="relative mt-6 sm:mt-8 font-mono text-sm sm:text-lg text-center px-2 break-words" data-testid="reaction-equation">
              {active.equation}
            </div>
          </div>

          {/* Controls + Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="glass rounded-2xl p-4 sm:p-5 sm:col-span-2">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                {active.energy === "exothermic" ? (
                  <Flame className="w-4 h-4 text-[var(--orange)]" />
                ) : (
                  <Snowflake className="w-4 h-4 text-[var(--cyan)]" />
                )}
                <span className="text-xs sm:text-sm font-semibold capitalize">{active.energy}</span>
              </div>
              <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed">{active.desc}</p>
            </div>
            <div className="flex sm:flex-col gap-2.5 sm:gap-3">
              <button
                data-testid="run-reaction"
                onClick={run}
                disabled={phase === "reacting"}
                className="flex-1 py-3.5 rounded-2xl font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base cursor-pointer"
              >
                <Play className="w-4 h-4" /> React
              </button>
              <button
                data-testid="reset-reaction"
                onClick={reset}
                className="sm:rounded-2xl rounded-2xl font-semibold glass py-3 px-4 inline-flex items-center justify-center gap-2 hover:border-[var(--cyan)] text-sm sm:text-base cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
