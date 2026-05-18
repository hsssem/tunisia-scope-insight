import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-10">
      <div className="relative h-32 w-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-primary"
          style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.5))" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border-2 border-transparent border-b-primary border-l-accent opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-gradient-brand animate-brand-pulse" />
        </div>
      </div>

      <div className="space-y-3 text-center">
        {MESSAGES.slice(0, shown).map((m, i) => (
          <motion.div
            key={m}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-base font-medium text-white/85"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-[10px] text-white">
              ✓
            </span>
            <span>{m}</span>
            {i === shown - 1 && i < MESSAGES.length - 1 && (
              <span className="ml-1 inline-flex gap-1">
                <span
                  className="h-1 w-1 animate-bounce rounded-full bg-accent"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-1 w-1 animate-bounce rounded-full bg-accent"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1 w-1 animate-bounce rounded-full bg-accent"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
