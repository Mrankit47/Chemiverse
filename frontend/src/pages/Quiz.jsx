import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, RotateCcw } from "lucide-react";
import PageShell from "@/components/PageShell";
import { QUIZ } from "@/data/chem";
import { submitQuiz } from "@/lib/progress";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const questions = useMemo(() => shuffle(QUIZ).slice(0, 8), []);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpGain, setXpGain] = useState(0);

  const q = questions[step];

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 < questions.length) {
        setStep((s) => s + 1);
        setPicked(null);
      } else {
        const finalScore = score + (correct ? 1 : 0);
        setFinished(true);
        submitQuiz({ topic: "General Chemistry", score: finalScore, total: questions.length })
          .then((r) => setXpGain(r.xp_gain))
          .catch(() => {});
      }
    }, 900);
  };

  const restart = () => {
    setStep(0); setPicked(null); setScore(0); setFinished(false); setXpGain(0);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const rank = pct >= 80 ? "SENIOR RESEARCH FELLOW" : pct >= 50 ? "CERTIFIED LAB ANALYST" : "JUNIOR RESEARCH INTERN";
    return (
      <PageShell testId="quiz-page" title="Certification Assessment" subtitle="Evaluation results and laboratory aptitude scoring." accent="#FFE600">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-3xl p-6 sm:p-12 text-center max-w-lg mx-auto border border-[rgba(0,245,255,0.2)] shadow-[0_0_40px_rgba(0,191,255,0.15)]">
          <div className="w-16 h-16 rounded-2xl glass mx-auto grid place-items-center mb-4 border border-[rgba(255,230,0,0.3)] shadow-[0_0_20px_rgba(255,230,0,0.25)]">
            <Trophy className="w-8 h-8 text-[var(--yellow)]" />
          </div>
          <span className="inline-block font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--yellow)] px-3 py-1 rounded-full glass border border-[rgba(255,230,0,0.2)] mb-2">
            {rank}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#E6F7FF]">Assessment Complete</h2>
          <div className="font-display font-black text-6xl sm:text-7xl grad-text my-4 sm:my-6" data-testid="quiz-score">
            {score}/{questions.length}
          </div>
          <p className="text-[var(--muted)] text-xs sm:text-sm font-mono">
            Proficiency Rating: <strong className="text-[#E6F7FF]">{pct}%</strong> · Earned <span className="text-[var(--cyan)] font-semibold">+{xpGain || score * 10} XP</span>
          </p>
          <button
            data-testid="quiz-restart"
            onClick={restart}
            className="mt-6 sm:mt-8 px-8 py-3.5 rounded-full font-mono text-xs sm:text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-[0_0_20px_rgba(0,245,255,0.3)]"
          >
            <RotateCcw className="w-4 h-4" /> RETAKE EVALUATION
          </button>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell testId="quiz-page" title="Quiz Arena" subtitle="Laboratory certification examination. Each verified answer yields +10 Research XP." accent="#FFE600">
      <div className="max-w-2xl mx-auto">
        {/* Telemetry Bar */}
        <div className="flex items-center justify-between mb-3 text-xs text-[var(--muted)] font-mono">
          <span className="text-[var(--cyan)]">ITEM {String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
          <span>SCORE: <strong className="text-[#E6F7FF]">{score}</strong> (+{score * 10} XP)</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 mb-6 sm:mb-8 overflow-hidden border border-[rgba(0,245,255,0.1)]">
          <motion.div className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--yellow)] shadow-[0_0_10px_var(--cyan)]" animate={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-3xl p-5 sm:p-8 border border-[rgba(0,245,255,0.18)] shadow-[0_4px_24px_rgba(5,8,22,0.6)]">
            <div className="text-[10px] font-mono text-[var(--cyan)] uppercase tracking-widest mb-3">
              MULTIPLE-CHOICE QUESTION
            </div>
            <h3 className="font-display font-bold text-lg sm:text-2xl mb-6 text-[#E6F7FF] leading-snug" data-testid="quiz-question">{q.q}</h3>
            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                let cls = "glass border-[rgba(0,245,255,0.14)] hover:border-[var(--cyan)] hover:bg-white/5 text-[#E6F7FF]";
                if (picked !== null) {
                  if (i === q.answer) cls = "border-[var(--green)] bg-[rgba(0,255,156,0.12)] text-[#E6F7FF] shadow-[0_0_15px_rgba(0,255,156,0.25)]";
                  else if (i === picked) cls = "border-[var(--red)] bg-[rgba(255,56,100,0.12)] text-[#E6F7FF] shadow-[0_0_15px_rgba(255,56,100,0.25)]";
                  else cls = "opacity-40 glass border-transparent";
                }
                return (
                  <button
                    key={i}
                    data-testid={`quiz-option-${i}`}
                    onClick={() => choose(i)}
                    className={`text-left px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] cursor-pointer text-xs sm:text-sm font-mono ${cls}`}
                  >
                    <span className="pr-3 leading-relaxed flex items-center gap-3">
                      <span className="w-5 h-5 rounded-md glass grid place-items-center text-[10px] font-bold text-[var(--muted)] border border-[rgba(0,245,255,0.15)]">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {picked !== null && i === q.answer && <Check className="w-5 h-5 text-[var(--green)] shrink-0" />}
                    {picked !== null && i === picked && i !== q.answer && <X className="w-5 h-5 text-[var(--red)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
