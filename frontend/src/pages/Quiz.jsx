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
    return (
      <PageShell testId="quiz-page" title="Quiz Arena" accent="#FFD23F">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-3xl p-6 sm:p-12 text-center max-w-lg mx-auto">
          <Trophy className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-[var(--orange)] mb-3 sm:mb-4" />
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Quiz Complete!</h2>
          <div className="font-display font-extrabold text-5xl sm:text-7xl grad-text my-4 sm:my-6" data-testid="quiz-score">
            {score}/{questions.length}
          </div>
          <p className="text-[var(--muted)] text-sm sm:text-base">
            You scored {pct}% and earned <span className="text-[var(--cyan)] font-semibold">+{xpGain} XP</span>
          </p>
          <button
            data-testid="quiz-restart"
            onClick={restart}
            className="mt-6 sm:mt-8 px-7 py-3.5 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell testId="quiz-page" title="Quiz Arena" subtitle="Answer to earn XP. 10 XP per correct answer." accent="#FFD23F">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm text-[var(--muted)] font-mono">
          <span>Question {step + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 mb-6 sm:mb-8 overflow-hidden">
          <motion.div className="h-full bg-[var(--cyan)]" animate={{ width: `${((step) / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-display font-bold text-lg sm:text-2xl mb-4 sm:mb-6" data-testid="quiz-question">{q.q}</h3>
            <div className="grid gap-2.5 sm:gap-3">
              {q.options.map((opt, i) => {
                let cls = "glass hover:border-[var(--cyan)]";
                if (picked !== null) {
                  if (i === q.answer) cls = "border-green-400 bg-green-400/10";
                  else if (i === picked) cls = "border-red-400 bg-red-400/10";
                  else cls = "opacity-50 glass";
                }
                return (
                  <button
                    key={i}
                    data-testid={`quiz-option-${i}`}
                    onClick={() => choose(i)}
                    className={`text-left px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] cursor-pointer text-sm sm:text-base ${cls}`}
                  >
                    <span className="pr-3 leading-relaxed">{opt}</span>
                    {picked !== null && i === q.answer && <Check className="w-5 h-5 text-green-400 shrink-0" />}
                    {picked !== null && i === picked && i !== q.answer && <X className="w-5 h-5 text-red-400 shrink-0" />}
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
