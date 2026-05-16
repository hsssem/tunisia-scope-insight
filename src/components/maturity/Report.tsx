import { useRef } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ScoreResult } from "@/lib/maturity-engine";
import { dimensionVerdict } from "@/lib/maturity-engine";
import { DIMENSIONS, RECO_MAP, SECTORS } from "@/lib/maturity-data";
import type { ClassificationData } from "./Classification";

interface Props {
  score: ScoreResult;
  classification: ClassificationData;
  onRestart: () => void;
}

export function Report({ score, classification, onRestart }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const sectorLabel = SECTORS.find((s) => s.id === classification.sector)?.label ?? classification.sector;

  const radarData = score.dims.map((d) => ({ dim: d.code, score: Math.round(d.normalized), seuil: 50 }));
  const sortedDims = [...score.dims].sort((a, b) => a.normalized - b.normalized);
  const recos = buildRecommendations(sortedDims);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#0a0e27" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    let position = 0;
    let remaining = h;
    const pageH = pdf.internal.pageSize.getHeight();
    while (remaining > 0) {
      pdf.addImage(img, "PNG", 0, position, w, h);
      remaining -= pageH;
      position -= pageH;
      if (remaining > 0) pdf.addPage();
    }
    pdf.save("rapport-evalitx-ai.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <button onClick={onRestart} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10">
          ↺ Nouvelle évaluation
        </button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={exportPDF}
          className="group relative overflow-hidden rounded-xl bg-gradient-brand px-5 py-2.5 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)]">
          <span className="relative z-10">📄 Télécharger le rapport PDF</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>
      </div>

      <div ref={reportRef} className="mx-auto max-w-6xl space-y-6" style={{ background: "#0a0e27" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white"
          style={{ background: "linear-gradient(135deg, #1a1f5c 0%, #4338ca 50%, #8b5cf6 100%)" }}>
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="relative">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">{sectorLabel}</span>
              {classification.size && <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">{classification.size}</span>}
              <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">EvalitX AI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Rapport de Maturité Digitale &amp; Data</h1>
            <div className="mt-8 flex flex-wrap items-end gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/60">Score Global de Maturité</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                    className="text-7xl font-bold tabular-nums">{Math.round(score.sgm)}</motion.span>
                  <span className="text-2xl font-light text-white/60">/ 100</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/95 px-5 py-3 text-center shadow-xl" style={{ color: score.level.color }}>
                <div className="text-xs font-bold uppercase tracking-wider opacity-70">{score.level.level}</div>
                <div className="text-xl font-bold">{score.level.name}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sub-scores */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SubScore title="Maturité Data" subtitle="D1 → D6 · 88% du modèle" value={score.dataMaturity} delay={0.1} />
          <SubScore title="Maturité Digitale" subtitle="D7 · 12% du modèle" value={score.digitalMaturity} delay={0.2} />
        </div>

        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Profil de maturité par dimension</h2>
          <div className="h-96">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="dim" tick={{ fill: "#e2e8f0", fontWeight: 700, fontSize: 13 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                <Radar name="Votre score" dataKey="score" stroke="#a855f7" fill="#8b5cf6" fillOpacity={0.45} strokeWidth={2} />
                <Radar name="Seuil N3 (50)" dataKey="seuil" stroke="#f87171" fill="#f87171" fillOpacity={0.05} strokeDasharray="4 4" strokeWidth={1.5} />
                <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dimension cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {score.dims.map((d, i) => {
            const dimMeta = DIMENSIONS.find((x) => x.code === d.code)!;
            return (
              <motion.div key={d.code} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                className="glass-strong rounded-2xl p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-gradient-brand px-2.5 py-1 text-xs font-bold tracking-wider text-white shadow-[0_0_14px_rgba(139,92,246,0.4)]">{d.code}</span>
                  <h3 className="font-semibold text-white">{dimMeta.name}</h3>
                  <span className="ml-auto tabular-nums text-sm font-bold text-white/90">{Math.round(d.normalized)}%</span>
                </div>
                <ScoreBar value={d.normalized} />
                <p className="mt-3 text-sm font-medium text-white/75">{dimensionVerdict(d.normalized)}</p>
                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">⚠ Lacunes critiques</div>
                  <ul className="mt-2 space-y-1.5">
                    {d.worstQuestions.map((q) => (
                      <li key={q.id} className="text-xs text-white/55">
                        <span className="font-mono text-white/30">{q.id}</span> · niv. {q.value}/5 — {q.text.slice(0, 90)}…
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Recommandations prioritaires</h2>
          <div className="space-y-3">
            {recos.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${
                    r.priority === "P1" ? "bg-red-500" : r.priority === "P2" ? "bg-orange-500" : "bg-blue-500"
                  }`}>{r.priority}</span>
                  <h4 className="font-semibold text-white">{r.title}</h4>
                </div>
                <p className="text-sm text-white/70">{r.action}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/45">
                  <span>📚 {r.ref}</span>
                  <span>⏱ {r.effort}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Feuille de route</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RoadmapCol title="0 - 6 mois" color="#f87171" items={sortedDims.slice(0, 2).map((d) => RECO_MAP[d.code].title)} />
            <RoadmapCol title="6 - 12 mois" color="#fb923c" items={sortedDims.slice(2, 4).map((d) => RECO_MAP[d.code].title)} />
            <RoadmapCol title="12 - 24 mois" color="#a855f7" items={[
              ...sortedDims.slice(4, 6).map((d) => RECO_MAP[d.code].title),
              RECO_MAP.D7.title,
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SubScore({ title, subtitle, value, delay }: { title: string; subtitle: string; value: number; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass-strong rounded-2xl p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/60">{title}</div>
      <div className="text-xs text-white/40">{subtitle}</div>
      <div className="mt-2 text-5xl font-bold tabular-nums text-gradient-brand">
        {Math.round(value)}<span className="text-lg font-light text-white/40"> / 100</span>
      </div>
      <ScoreBar value={value} />
    </motion.div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const gradient =
    value < 40 ? "linear-gradient(90deg, #ef4444, #f87171)" :
    value < 60 ? "linear-gradient(90deg, #f97316, #fb923c)" :
    "linear-gradient(90deg, #8b5cf6, #a855f7)";
  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/8">
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-full rounded-full" style={{ background: gradient, boxShadow: `0 0 12px ${value >= 60 ? "rgba(139,92,246,0.5)" : "rgba(248,113,113,0.4)"}` }} />
    </div>
  );
}

function RoadmapCol({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div className="rounded-xl border-t-4 bg-white/[0.03] p-4" style={{ borderColor: color }}>
      <h4 className="mb-3 font-bold text-white">{title}</h4>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-white/75">• {it}</li>
        ))}
      </ul>
    </div>
  );
}

function buildRecommendations(sortedDims: ScoreResult["dims"]) {
  const recos: { priority: "P1" | "P2" | "P3"; title: string; action: string; ref: string; effort: string }[] = [];
  sortedDims.slice(0, 3).forEach((d) => recos.push({ priority: "P1", ...RECO_MAP[d.code] }));
  sortedDims.slice(3, 4).forEach((d) => recos.push({ priority: "P2", ...RECO_MAP[d.code] }));
  sortedDims.slice(4, 5).forEach((d) => recos.push({ priority: "P3", ...RECO_MAP[d.code] }));
  return recos;
}
