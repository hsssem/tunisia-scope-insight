import { useState } from "react";
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

  const setAnswer = (qid: string, val: number) => {
    setAnswers({ ...answers, [qid]: val });
  };

  const next = () => {
    if (isLast) onComplete();
    else {
      setIdx(idx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progress = ((idx + 1) / DIMENSIONS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
          <span>Dimension {idx + 1} / {DIMENSIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-gradient-to-r from-[#1F4E79] to-[#2E75B6] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <span className={`${dim.badgeClass} rounded-md px-3 py-1 text-sm font-bold text-white`}>{dim.code}</span>
          <h2 className="text-2xl font-bold text-slate-800">{dim.name}</h2>
        </div>
        <p className="mb-6 text-xs italic text-slate-500">{dim.normRef}</p>

        <div className="space-y-6">
          {dim.questions.map((q, i) => (
            <div key={q.id} className="border-t border-slate-100 pt-5 first:border-t-0 first:pt-0">
              <div className="mb-3">
                <span className="text-xs font-mono text-slate-400">{q.id}</span>
                <p className="mt-1 font-medium text-slate-800">{i + 1}. {q.text}</p>
              </div>
              <div className="space-y-2">
                {q.options!.map((opt, oi) => {
                  const val = q.type === "binary" ? (oi === 0 ? 1 : 5) : oi + 1;
                  const checked = answers[q.id] === val;
                  return (
                    <label key={opt} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 text-sm transition ${checked ? "border-[#2E75B6] bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="radio" name={q.id} checked={checked} onChange={() => setAnswer(q.id, val)} className="h-4 w-4 accent-[#1F4E79]" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          disabled={idx === 0}
          onClick={() => { setIdx(idx - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          ← Précédent
        </button>
        <button
          disabled={!allAnswered}
          onClick={next}
          className="rounded-xl bg-[#1F4E79] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#2E75B6] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLast ? "Voir mes résultats →" : "Dimension suivante →"}
        </button>
      </div>
    </div>
  );
}
