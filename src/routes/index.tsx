import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Classification, type ClassificationData } from "@/components/maturity/Classification";
import { Evaluation } from "@/components/maturity/Evaluation";
import { Loading } from "@/components/maturity/Loading";
import { Report } from "@/components/maturity/Report";
import { computeScore, type AnswersMap } from "@/lib/maturity-engine";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EvalitX AI — Évaluation de maturité digitale & data" },
      { name: "description", content: "Plateforme IA d'évaluation de la maturité digitale et data des entreprises tunisiennes. 7 dimensions, 42 questions, rapport de consulting." },
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

  const steps: { key: Step; label: string }[] = [
    { key: "classification", label: "Profil" },
    { key: "evaluation", label: "Évaluation" },
    { key: "report", label: "Rapport" },
  ];
  const activeIdx = step === "loading" ? 1 : steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <img src={logo} alt="EvalitX AI" className="h-10 w-auto drop-shadow-[0_0_18px_rgba(139,92,246,0.35)]" />
          </motion.div>
          <nav className="hidden items-center gap-2 md:flex">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  i === activeIdx ? "bg-gradient-brand text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]" :
                  i < activeIdx ? "bg-white/10 text-white/80" : "text-white/40"
                }`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    i === activeIdx ? "bg-white/25" : i < activeIdx ? "bg-white/20" : "bg-white/10"
                  }`}>{i + 1}</span>
                  {s.label}
                </div>
                {i < steps.length - 1 && <div className="h-px w-6 bg-white/10" />}
              </div>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/40">
        EvalitX AI · AI-powered digital &amp; data maturity assessment
      </footer>
    </div>
  );
}
