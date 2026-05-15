import { useRef } from "react";
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

  const radarData = score.dims.map((d) => ({
    dim: d.code,
    score: Math.round(d.normalized),
    seuil: 50,
  }));

  const sortedDims = [...score.dims].sort((a, b) => a.normalized - b.normalized);
  const lowest3 = sortedDims.slice(0, 3);

  const recos = buildRecommendations(sortedDims);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff" });
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
    pdf.save("rapport-maturite.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <button onClick={onRestart} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          ↺ Nouvelle évaluation
        </button>
        <button onClick={exportPDF} className="rounded-xl bg-[#1F4E79] px-5 py-2.5 font-semibold text-white shadow-md hover:bg-[#2E75B6]">
          📄 Télécharger le rapport PDF
        </button>
      </div>

      <div ref={reportRef} className="mx-auto max-w-5xl space-y-6 bg-white p-6">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-br from-[#1F4E79] to-[#2E75B6] p-8 text-white shadow-lg">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{sectorLabel}</span>
            {classification.size && <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{classification.size}</span>}
          </div>
          <h1 className="text-3xl font-bold">Rapport de Maturité Digitale & Data</h1>
          <div className="mt-6 flex flex-wrap items-end gap-8">
            <div>
              <div className="text-sm uppercase tracking-wide text-white/70">Score Global de Maturité</div>
              <div className="text-6xl font-bold">{Math.round(score.sgm)}<span className="text-2xl font-normal text-white/70"> / 100</span></div>
            </div>
            <div className="rounded-xl bg-white px-5 py-3 text-center shadow-md" style={{ color: score.level.color }}>
              <div className="text-xs font-semibold uppercase">{score.level.level}</div>
              <div className="text-xl font-bold">{score.level.name}</div>
            </div>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SubScore title="Maturité Data" subtitle="D1 → D6 · 88% du modèle" value={score.dataMaturity} />
          <SubScore title="Maturité Digitale" subtitle="D7 · 12% du modèle" value={score.digitalMaturity} />
        </div>

        {/* Radar */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Profil de maturité par dimension</h2>
          <div className="h-96">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="dim" tick={{ fill: "#1F4E79", fontWeight: 600 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#1F4E79" fill="#2E75B6" fillOpacity={0.5} />
                <Radar name="Seuil N3 (50)" dataKey="seuil" stroke="#dc2626" fill="#dc2626" fillOpacity={0.05} strokeDasharray="4 4" />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {score.dims.map((d) => {
            const dimMeta = DIMENSIONS.find((x) => x.code === d.code)!;
            return (
              <div key={d.code} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`${dimMeta.badgeClass} rounded-md px-2.5 py-1 text-xs font-bold text-white`}>{d.code}</span>
                  <h3 className="font-semibold text-slate-800">{d.name}</h3>
                </div>
                <ScoreBar value={d.normalized} />
                <p className="mt-3 text-sm font-medium text-slate-700">{dimensionVerdict(d.normalized)}</p>
                <div className="mt-4">
                  <div className="text-xs font-bold uppercase text-red-600">Lacunes critiques</div>
                  <ul className="mt-2 space-y-1">
                    {d.worstQuestions.map((q) => (
                      <li key={q.id} className="text-xs text-slate-600">
                        <span className="font-mono text-slate-400">{q.id}</span> · niveau {q.value}/5 — {q.text.slice(0, 90)}…
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Recommandations prioritaires</h2>
          <div className="space-y-3">
            {recos.map((r, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${r.priority === "P1" ? "bg-red-600" : r.priority === "P2" ? "bg-orange-500" : "bg-blue-600"}`}>{r.priority}</span>
                  <h4 className="font-semibold text-slate-800">{r.title}</h4>
                </div>
                <p className="text-sm text-slate-600">{r.action}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>📚 {r.ref}</span>
                  <span>⏱ {r.effort}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Feuille de route</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RoadmapCol title="0 - 6 mois" color="#dc2626" items={sortedDims.slice(0, 2).map((d) => RECO_MAP[d.code].title)} />
            <RoadmapCol title="6 - 12 mois" color="#ea580c" items={sortedDims.slice(2, 4).map((d) => RECO_MAP[d.code].title)} />
            <RoadmapCol title="12 - 24 mois" color="#16a34a" items={[
              ...sortedDims.slice(4, 6).map((d) => RECO_MAP[d.code].title),
              RECO_MAP.D7.title,
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SubScore({ title, subtitle, value }: { title: string; subtitle: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="text-xs text-slate-400">{subtitle}</div>
      <div className="mt-2 text-4xl font-bold text-[#1F4E79]">{Math.round(value)}<span className="text-lg text-slate-400"> / 100</span></div>
      <ScoreBar value={value} />
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const color = value < 40 ? "#dc2626" : value < 60 ? "#ea580c" : "#16a34a";
  return (
    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
    </div>
  );
}

function RoadmapCol({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div className="rounded-lg border-t-4 bg-slate-50 p-4" style={{ borderColor: color }}>
      <h4 className="mb-3 font-bold text-slate-800">{title}</h4>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-slate-700">• {it}</li>
        ))}
      </ul>
    </div>
  );
}

function buildRecommendations(sortedDims: ScoreResult["dims"]) {
  const recos: { priority: "P1" | "P2" | "P3"; title: string; action: string; ref: string; effort: string }[] = [];
  // 3 P1 from lowest
  sortedDims.slice(0, 3).forEach((d) => {
    const m = RECO_MAP[d.code];
    recos.push({ priority: "P1", ...m });
  });
  // P2, P3 from next 2
  sortedDims.slice(3, 4).forEach((d) => recos.push({ priority: "P2", ...RECO_MAP[d.code] }));
  sortedDims.slice(4, 5).forEach((d) => recos.push({ priority: "P3", ...RECO_MAP[d.code] }));
  return recos;
}
