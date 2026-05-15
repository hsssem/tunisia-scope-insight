import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Classification, type ClassificationData } from "@/components/maturity/Classification";
import { Evaluation } from "@/components/maturity/Evaluation";
import { Loading } from "@/components/maturity/Loading";
import { Report } from "@/components/maturity/Report";
import { computeScore, type AnswersMap } from "@/lib/maturity-engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaturityScope — Évaluation de maturité digitale & data" },
      { name: "description", content: "Évaluez la maturité digitale et data de votre organisation tunisienne sur 7 dimensions et obtenez un rapport de consulting détaillé." },
    ],
  }),
  component: App,
});

type Step = "classification" | "evaluation" | "loading" | "report";

function App() {
  const [step, setStep] = useState<Step>("classification");
  const [classification, setClassification] = useState<ClassificationData>({
    sector: "services",
    size: "",
    itFunction: "",
    regulated: [],
    systems: [],
  });
  const [answers, setAnswers] = useState<AnswersMap>({});

  const score = step === "report" || step === "loading" ? computeScore(answers, classification.sector) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1F4E79] to-[#2E75B6] font-bold text-white">M</div>
            <div>
              <div className="font-bold text-[#1F4E79]">MaturityScope</div>
              <div className="text-xs text-slate-500">DataMatur TN</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Évaluation maturité digitale & data</div>
        </div>
      </header>

      <main className="px-4 py-8">
        {step === "classification" && (
          <Classification value={classification} onChange={setClassification} onNext={() => setStep("evaluation")} />
        )}
        {step === "evaluation" && (
          <Evaluation answers={answers} setAnswers={setAnswers} onComplete={() => setStep("loading")} />
        )}
        {step === "loading" && <Loading onDone={() => setStep("report")} />}
        {step === "report" && score && (
          <Report score={score} classification={classification} onRestart={() => {
            setAnswers({});
            setStep("classification");
          }} />
        )}
      </main>
    </div>
  );
}
