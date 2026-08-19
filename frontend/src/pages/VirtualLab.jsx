import React, { useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Droplets, RotateCcw } from "lucide-react";
import PageShell from "@/components/PageShell";
import { addProgress } from "@/lib/progress";

const REAGENTS = [
  { id: "hcl", name: "HCl (acid)", color: "#7df9a8" },
  { id: "naoh", name: "NaOH (base)", color: "#00F5FF" },
  { id: "phenol", name: "Phenolphthalein", color: "#e8eefc" },
  { id: "cuso4", name: "CuSO₄", color: "#3b6bff" },
  { id: "agno3", name: "AgNO₃", color: "#cbd5e1" },
  { id: "nacl", name: "NaCl (salt)", color: "#f1f5f9" },
];

const REACTIONS = {
  "naoh+phenol": { color: "#ff3fa4", obs: "The solution turns bright pink — phenolphthalein is pink in a base!" },
  "hcl+phenol": { color: "#e8eefc", obs: "Stays colorless — phenolphthalein is colorless in acid." },
  "hcl+naoh": { color: "#bfe9ff", obs: "Neutralization! Acid + base → salt + water. Heat is released." },
  "cuso4+naoh": { color: "#2b6cff", obs: "A pale-blue precipitate of copper(II) hydroxide forms." },
  "agno3+nacl": { color: "#f8fafc", obs: "A white precipitate of silver chloride (AgCl) crashes out instantly." },
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
      color: "#8ea0c4",
      obs: "The reagents mix without a visible reaction. Try another combination!",
    };
    setResult(r);
    addProgress({ module: "lab", xp: 12, achievement: "First Experiment" }).catch(() => {});
  };

  const reset = () => { setSelected([]); setResult(null); };

  const liquidColor = result ? result.color : selected.length ? "#1e3a5f" : "#0e1830";

  return (
    <PageShell
      testId="virtual-lab-page"
      title="Virtual Lab"
      subtitle="Pick two reagents, mix them in the beaker and observe the reaction — safely."
      accent="#FF3FA4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Beaker Container */}
        <div className="glass rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] sm:min-h-[380px]">
          <div className="absolute inset-0 chem-grid opacity-20" />
          <div className="relative w-36 sm:w-40 h-48 sm:h-52">
            <div className="absolute inset-x-0 bottom-0 h-44 sm:h-48 rounded-b-3xl rounded-t-lg border-2 border-white/20 overflow-hidden bg-white/5">
              <motion.div
                className="absolute inset-x-0 bottom-0"
                animate={{ height: selected.length || result ? "70%" : "12%", backgroundColor: liquidColor }}
                transition={{ duration: 0.8 }}
                style={{ boxShadow: `0 0 40px ${liquidColor}` }}
                data-testid="beaker-liquid"
              >
                {result && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle at 50% 20%, #ffffff33, transparent 60%)` }}
                  />
                )}
              </motion.div>
            </div>
            <Beaker className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-8 sm:h-10 text-white/40" />
          </div>
          <div className="relative mt-5 sm:mt-6 text-center min-h-[50px] px-2">
            {result ? (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[var(--text)] max-w-xs text-sm sm:text-base font-medium" data-testid="lab-observation">
                {result.obs}
              </motion.p>
            ) : (
              <p className="text-[var(--muted)] text-xs sm:text-sm">
                {selected.length === 0 ? "Select two reagents from the shelf" : selected.length === 1 ? "Pick one more reagent…" : "Ready to mix!"}
              </p>
            )}
          </div>
        </div>

        {/* Reagents Shelf & Actions */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3 sm:mb-4 font-mono">Reagent Shelf</div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {REAGENTS.map((r) => (
                <button
                  key={r.id}
                  data-testid={`reagent-${r.id}`}
                  onClick={() => toggle(r.id)}
                  className={`p-3 sm:p-4 rounded-xl text-left transition-all border active:scale-95 cursor-pointer ${
                    selected.includes(r.id) ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                  style={{ borderColor: selected.includes(r.id) ? r.color : "var(--border)" }}
                >
                  <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full mb-1.5 sm:mb-2" style={{ background: r.color, boxShadow: `0 0 12px ${r.color}` }} />
                  <div className="text-xs sm:text-sm font-medium">{r.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              data-testid="mix-button"
              onClick={mix}
              disabled={selected.length < 2 || result}
              className="flex-1 py-3.5 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 disabled:opacity-40 text-sm sm:text-base cursor-pointer"
            >
              <Droplets className="w-4 h-4" /> Mix Reagents
            </button>
            <button
              data-testid="lab-reset"
              onClick={reset}
              className="px-6 py-3.5 rounded-full font-semibold glass hover:border-[var(--cyan)] inline-flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
          <p className="text-xs text-[var(--muted)] px-1">
            Try: NaOH + Phenolphthalein, HCl + NaOH, AgNO₃ + NaCl, CuSO₄ + NaOH.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
