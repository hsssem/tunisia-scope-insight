import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIMENSIONS } from "@/lib/maturity-data";
import type { AnswersMap } from "@/lib/maturity-engine";

interface Props {
  answers: AnswersMap;
  setAnswers: (a: AnswersMap) => void;
  onComplete: () => void;
}

export function Evaluation({ answers, setAnswers, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const dim = DIMENSIONS[idx];
  const allAnswered = dim.questions.every((q) => answers[q.id]);
  const isLast = idx === DIMENSIONS.length - 1;

  const setAnswer = (qid: string, val: number) => setAnswers({ ...answers, [qid]: val });

  const next = () => {
    if (isLast) onComplete();
    else {
      setIdx(idx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progress = ((idx + 1) / DIMENSIONS.length) * 100;
  const answeredCount = dim.questions.filter((q) => answers[q.id]).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Progress */}
      <div className="glass-strong rounded-2xl p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <span className="font-bold text-gradient-brand">Dimension {idx + 1}</span>
            <span className="text-white/40">/ {DIMENSIONS.length}</span>
          </div>
          <span className="font-mono text-xs text-white/50">{Math.round(progress)}% complété</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-brand shadow-[0_0_12px_rgba(139,92,246,0.6)]"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DIMENSIONS.map((d, i) => (
            <button
              key={d.code}
              onClick={() => { setIdx(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                i === idx ? "bg-gradient-brand text-white" :
                d.questions.every((q) => answers[q.id]) ? "bg-white/15 text-white/80" : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >{d.code}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={dim.code}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-strong rounded-2xl p-6 md:p-8"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-gradient-brand px-3 py-1 text-xs font-bold tracking-wider text-white shadow-[0_0_18px_rgba(139,92,246,0.4)]">{dim.code}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{dim.name}</h2>
            <span className="ml-auto text-xs text-white/50">{answeredCount}/{dim.questions.length} répondues</span>
          </div>
          <p className="mb-8 text-xs italic text-white/40">{dim.normRef}</p>

          <div className="space-y-7">
            {dim.questions.map((q, i) => (
              <div key={q.id} className="border-t border-white/5 pt-6 first:border-t-0 first:pt-0">
                <div className="mb-4 flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 font-mono text-xs font-bold text-white/60">{i + 1}</span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">{q.id}</span>
                    <p className="mt-0.5 font-medium text-white/90">{q.text}</p>
                  </div>
                </div>
                <div className="ml-10 space-y-1.5">
                  {q.options!.map((opt, oi) => {
                    const val = q.type === "binary" ? (oi === 0 ? 1 : 5) : oi + 1;
                    const checked = answers[q.id] === val;
                    return (
                      <label key={opt} className={`group flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-all ${
                        checked
                          ? "border-transparent bg-gradient-brand-soft ring-brand text-white"
                          : "border-white/8 bg-white/[0.015] text-white/65 hover:border-white/15 hover:bg-white/[0.04]"
                      }`}>
                        <input type="radio" name={q.id} checked={checked} onChange={() => setAnswer(q.id, val)} className="sr-only" />
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          checked ? "border-accent bg-accent" : "border-white/25"
                        }`}>
                          {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap justify-between gap-3">
        <button
          disabled={idx === 0}
          onClick={() => { setIdx(idx - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/10 disabled:opacity-30"
        >
          ← Précédent
        </button>
        <motion.button
          whileHover={allAnswered ? { scale: 1.02 } : {}}
          whileTap={allAnswered ? { scale: 0.98 } : {}}
          disabled={!allAnswered}
          onClick={next}
          className="group relative overflow-hidden rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)] transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <span className="relative z-10">{isLast ? "Voir mes résultats ✨" : "Dimension suivante →"}</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>
      </div>
    </div>
  );
}
