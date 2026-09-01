import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Zap, Award, CheckCircle2, Flame } from "lucide-react";
import PageShell from "@/components/PageShell";
import { getProgress, getUserId } from "@/lib/progress";
import { MODULES } from "@/data/chem";

function levelFromXp(xp) {
  return Math.floor(xp / 100) + 1;
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getProgress().then(setData).catch(() => setData({ xp: 0, modules: [], achievements: [], quiz: [] }));
  }, []);

  const xp = data?.xp || 0;
  const level = levelFromXp(xp);
  const intoLevel = xp % 100;

  return (
    <PageShell
      testId="dashboard-page"
      title="Research Command Center"
      subtitle="Operational telemetry, clearance level credentials, verified achievements, and simulation module exploration logs."
      accent="#00F5FF"
    >
      {/* Top Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-6 sm:mb-8">
        {/* Total XP Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-5 sm:p-6 border border-[rgba(0,245,255,0.25)] shadow-[0_0_25px_rgba(0,245,255,0.12)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-6 h-6 text-[var(--cyan)]" />
            <span className="text-[10px] font-mono text-[var(--cyan)] uppercase tracking-wider">ENERGY</span>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#E6F7FF]" data-testid="dash-xp">
            {xp} <span className="text-xs font-mono text-[var(--cyan)]">XP</span>
          </div>
          <div className="text-[var(--muted)] text-xs mt-1 font-mono">ACCUMULATED LAB XP</div>
        </motion.div>

        {/* Clearance Level */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass rounded-3xl p-5 sm:p-6 border border-[rgba(0,191,255,0.2)] shadow-[0_0_25px_rgba(0,191,255,0.1)]"
        >
          <div className="flex items-center justify-between mb-3">
            <Trophy className="w-6 h-6 text-[var(--electric)]" />
            <span className="text-[10px] font-mono text-[var(--electric)] uppercase tracking-wider">TIER {level}</span>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#E6F7FF]">
            LVL {level}
          </div>
          <div className="h-2 rounded-full bg-white/5 mt-3 overflow-hidden border border-[rgba(0,191,255,0.15)]">
            <div className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--electric)] shadow-[0_0_8px_var(--cyan)]" style={{ width: `${intoLevel}%` }} />
          </div>
          <div className="text-[var(--muted)] text-[10px] sm:text-xs mt-1.5 font-mono">{intoLevel}/100 XP TO LEVEL {level + 1}</div>
        </motion.div>

        {/* Verified Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="glass rounded-3xl p-5 sm:p-6 border border-[rgba(139,92,246,0.2)] shadow-[0_0_25px_rgba(139,92,246,0.1)]"
        >
          <div className="flex items-center justify-between mb-3">
            <Award className="w-6 h-6 text-[var(--purple)]" />
            <span className="text-[10px] font-mono text-[var(--purple)] uppercase tracking-wider">BADGES</span>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#E6F7FF]">
            {data?.achievements?.length || 0}
          </div>
          <div className="text-[var(--muted)] text-xs mt-1 font-mono">VERIFIED DISCOVERIES</div>
        </motion.div>

        {/* Global Registry Count */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="glass rounded-3xl p-5 sm:p-6 border border-[rgba(0,255,156,0.2)] shadow-[0_0_25px_rgba(0,255,156,0.1)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl">⚛</span>
            <span className="text-[10px] font-mono text-[var(--green)] uppercase tracking-wider">DATABASE</span>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#E6F7FF]">
            118
          </div>
          <div className="text-[var(--muted)] text-xs mt-1 font-mono">ELEMENTS AVAILABLE</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Module Exploration Matrix */}
        <div className="glass rounded-3xl p-5 sm:p-7 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_24px_rgba(5,8,22,0.5)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(0,245,255,0.1)]">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#E6F7FF]">Simulation Modules</h3>
            <span className="text-[10px] font-mono text-[var(--cyan)] uppercase">
              COMPLETED: {data?.modules?.length || 0} / {MODULES.filter((m) => m.id !== "dashboard").length}
            </span>
          </div>
          <div className="space-y-2">
            {MODULES.filter((m) => m.id !== "dashboard").map((m) => {
              const done = data?.modules?.includes(m.id);
              return (
                <Link
                  key={m.id}
                  to={m.path}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl glass hover:bg-white/5 transition-all border border-[rgba(0,245,255,0.1)] hover:border-[var(--cyan)] group"
                >
                  <span className="flex items-center gap-3 text-xs sm:text-sm font-sans text-[#E6F7FF]">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${done ? "text-[var(--green)]" : "text-white/20"}`} />
                    <span className="font-medium group-hover:text-[var(--cyan)] transition-colors">{m.title}</span>
                  </span>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                    done
                      ? "border-[var(--green)]/40 text-[var(--green)] bg-[rgba(0,255,156,0.1)]"
                      : "border-[rgba(0,245,255,0.2)] text-[var(--muted)] group-hover:text-[var(--cyan)]"
                  }`}>
                    {done ? "VERIFIED ✓" : "LAUNCH →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Achievements & Quiz Records */}
        <div className="flex flex-col gap-5 sm:gap-6 justify-between">
          <div className="glass rounded-3xl p-5 sm:p-7 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_24px_rgba(5,8,22,0.5)]">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#E6F7FF] mb-4 pb-3 border-b border-[rgba(0,245,255,0.1)]">
              Accredited Milestones
            </h3>
            {data?.achievements?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.achievements.map((a) => (
                  <span
                    key={a}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono bg-[rgba(139,92,246,0.14)] text-[var(--purple)] inline-flex items-center gap-2 border border-[rgba(139,92,246,0.3)] shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  >
                    <Flame className="w-3.5 h-3.5" /> {a}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[var(--muted)] text-xs sm:text-sm font-mono leading-relaxed">
                No milestone credentials logged. Execute reactions in the Virtual Lab or pass a Certification Quiz to register achievements.
              </p>
            )}
          </div>

          <div className="glass rounded-3xl p-5 sm:p-7 border border-[rgba(0,245,255,0.16)] shadow-[0_4px_24px_rgba(5,8,22,0.5)]">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#E6F7FF] mb-4 pb-3 border-b border-[rgba(0,245,255,0.1)]">
              Evaluation History
            </h3>
            {data?.quiz?.length ? (
              <div className="space-y-2">
                {data.quiz.slice(-5).reverse().map((q, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-2.5 px-3 rounded-xl glass border border-[rgba(0,245,255,0.08)] font-mono">
                    <span className="text-[#E6F7FF]">{q.topic}</span>
                    <span className="text-[var(--cyan)] font-bold">{q.score}/{q.total} CORRECT</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--muted)] text-xs sm:text-sm font-mono">
                No examination transcripts detected. Enter the Quiz Arena to record results.
              </p>
            )}
          </div>

          <div className="px-4 py-3 rounded-2xl glass border border-[rgba(0,245,255,0.12)] flex items-center justify-between text-xs font-mono text-[var(--muted)]">
            <span>OPERATIVE TELEMETRY ID:</span>
            <span className="text-[#E6F7FF] font-semibold">{getUserId()}</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
