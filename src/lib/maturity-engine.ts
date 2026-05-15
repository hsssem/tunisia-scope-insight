import { DIMENSIONS, SECTOR_WEIGHTS } from "./maturity-data";

export type AnswersMap = Record<string, number>; // question id -> 1..5

export interface DimensionResult {
  code: string;
  name: string;
  color: string;
  raw: number;
  normalized: number;
  worstQuestions: { id: string; text: string; value: number }[];
}

export interface ScoreResult {
  dims: DimensionResult[];
  byCode: Record<string, DimensionResult>;
  sgm: number;
  dataMaturity: number;
  digitalMaturity: number;
  level: { level: string; name: string; color: string };
}

export function computeScore(answers: AnswersMap, sector: string): ScoreResult {
  const sw = SECTOR_WEIGHTS[sector] ?? SECTOR_WEIGHTS.generic;
  const dims: DimensionResult[] = DIMENSIONS.map((d) => {
    const raw = d.questions.reduce((s, q) => s + (answers[q.id] ?? 0) * q.weight, 0);
    const normalized = ((raw - 1) / 4) * 100;
    const worstQuestions = [...d.questions]
      .map((q) => ({ id: q.id, text: q.text, value: answers[q.id] ?? 0 }))
      .sort((a, b) => a.value - b.value)
      .slice(0, 3);
    return { code: d.code, name: d.name, color: d.color, raw, normalized, worstQuestions };
  });
  const byCode: Record<string, DimensionResult> = {};
  dims.forEach((d) => (byCode[d.code] = d));
  const sgm = dims.reduce((s, d) => s + sw[d.code] * d.normalized, 0);
  // Data = D1..D6 (88%), Digital = D7 (12%)
  const dataDims = ["D1", "D2", "D3", "D4", "D5", "D6"];
  const dataWeightSum = dataDims.reduce((s, c) => s + sw[c], 0);
  const dataMaturity = dataDims.reduce((s, c) => s + (sw[c] / dataWeightSum) * byCode[c].normalized, 0);
  const digitalMaturity = byCode.D7.normalized;
  const level = getMaturityLevel(sgm);
  return { dims, byCode, sgm, dataMaturity, digitalMaturity, level };
}

export function getMaturityLevel(sgm: number) {
  if (sgm <= 20) return { level: "N1", name: "Initial", color: "#dc2626" };
  if (sgm <= 40) return { level: "N2", name: "Géré", color: "#ea580c" };
  if (sgm <= 60) return { level: "N3", name: "Défini", color: "#eab308" };
  if (sgm <= 80) return { level: "N4", name: "Quantifié", color: "#2563eb" };
  return { level: "N5", name: "Optimisé", color: "#16a34a" };
}

export function dimensionVerdict(score: number): string {
  if (score < 30) return "Dimension critique — action immédiate requise";
  if (score < 50) return "Dimension en développement — efforts de formalisation nécessaires";
  if (score < 70) return "Dimension intermédiaire — optimisation recommandée";
  return "Dimension mature — maintenir et améliorer";
}
