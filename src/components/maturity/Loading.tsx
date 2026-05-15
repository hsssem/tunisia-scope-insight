import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyse des réponses en cours...",
  "Calcul des scores par dimension...",
  "Application des pondérations sectorielles...",
  "Génération du rapport de consulting...",
];

export function Loading({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<number>(0);

  useEffect(() => {
    const timers: number[] = [];
    MESSAGES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), 800 * (i + 1)));
    });
    timers.push(window.setTimeout(onDone, 3500));
    return () => timers.forEach((t) => clearTimeout(t));
  }, [onDone]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-[#1F4E79]" />
      <div className="space-y-3 text-center">
        {MESSAGES.slice(0, shown).map((m) => (
          <p key={m} className="animate-in fade-in text-lg font-medium text-slate-700">
            {m}
          </p>
        ))}
      </div>
    </div>
  );
}
