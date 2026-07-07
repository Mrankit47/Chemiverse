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
      title="Progress Hub"
      subtitle="Your journey through the ChemiVerse — XP, achievements and explored modules."
      accent="#B026FF"
    >
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 glow-purple">
          <Zap className="w-7 h-7 text-[var(--cyan)] mb-3" />
          <div className="font-display font-extrabold text-4xl" data-testid="dash-xp">{xp}</div>
          <div className="text-[var(--muted)] text-sm">Total XP</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass rounded-2xl p-6">
          <Trophy className="w-7 h-7 text-[var(--orange)] mb-3" />
          <div className="font-display font-extrabold text-4xl">Lv {level}</div>
          <div className="h-1.5 rounded-full bg-white/5 mt-3 overflow-hidden">
            <div className="h-full bg-[var(--orange)]" style={{ width: `${intoLevel}%` }} />
          </div>
          <div className="text-[var(--muted)] text-xs mt-1">{intoLevel}/100 to next level</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass rounded-2xl p-6">
          <Award className="w-7 h-7 text-[var(--purple)] mb-3" />
          <div className="font-display font-extrabold text-4xl">{data?.achievements?.length || 0}</div>
          <div className="text-[var(--muted)] text-sm">Achievements</div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Modules explored */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-4">Modules Explored</h3>
          <div className="space-y-2">
            {MODULES.filter((m) => m.id !== "dashboard").map((m) => {
              const done = data?.modules?.includes(m.id);
              return (
                <Link key={m.id} to={m.path} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${done ? "text-green-400" : "text-white/20"}`} />
                    {m.title}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{done ? "Explored" : "Try it →"}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Achievements + quiz history */}
        <div className="flex flex-col gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Achievements</h3>
            {data?.achievements?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.achievements.map((a) => (
                  <span key={a} className="px-3 py-2 rounded-xl text-sm bg-[var(--purple)]/15 text-[var(--purple)] inline-flex items-center gap-2">
                    <Flame className="w-4 h-4" /> {a}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[var(--muted)] text-sm">No achievements yet — complete a quiz or experiment to earn some!</p>
            )}
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Recent Quizzes</h3>
            {data?.quiz?.length ? (
              <div className="space-y-2">
                {data.quiz.slice(-5).reverse().map((q, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-[var(--border)] last:border-0">
                    <span>{q.topic}</span>
                    <span className="font-mono text-[var(--cyan)]">{q.score}/{q.total}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--muted)] text-sm">Take the quiz to see your history here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-[var(--muted)] mt-6 font-mono">Explorer ID: {getUserId()}</div>
    </PageShell>
  );
}
