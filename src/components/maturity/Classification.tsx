import { motion } from "framer-motion";
import { SECTORS, SIZES, IT_FUNCTIONS, REGULATED_DATA, SYSTEMS } from "@/lib/maturity-data";

export interface ClassificationData {
  sector: string;
  size: string;
  itFunction: string;
  regulated: string[];
  systems: string[];
}

interface Props {
  value: ClassificationData;
  onChange: (v: ClassificationData) => void;
  onNext: () => void;
}

export function Classification({ value, onChange, onNext }: Props) {
  const canContinue = value.sector && value.size;

  const toggleMulti = (key: "regulated" | "systems", item: string) => {
    const arr = value[key];
    onChange({ ...value, [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item] });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-brand-pulse" />
          Étape 1 sur 3 · Profil organisation
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-gradient-brand">Profil</span> de votre organisation
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Ces informations permettent d'adapter l'évaluation à votre contexte sectoriel et opérationnel.
        </p>
      </motion.div>

      <div className="space-y-5">
        <Section title="Secteur d'activité principal" required>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SECTORS.map((s) => (
              <Radio key={s.id} name="sector" label={s.label} checked={value.sector === s.id}
                onChange={() => onChange({ ...value, sector: s.id })} />
            ))}
          </div>
        </Section>

        <Section title="Nombre d'employés" required>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SIZES.map((s) => (
              <Radio key={s} name="size" label={s} checked={value.size === s}
                onChange={() => onChange({ ...value, size: s })} />
            ))}
          </div>
        </Section>

        <Section title="Fonction IT identifiée">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {IT_FUNCTIONS.map((s) => (
              <Radio key={s} name="it" label={s} checked={value.itFunction === s}
                onChange={() => onChange({ ...value, itFunction: s })} />
            ))}
          </div>
        </Section>

        <Section title="Données réglementées">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REGULATED_DATA.map((s) => (
              <Check key={s} label={s} checked={value.regulated.includes(s)}
                onChange={() => toggleMulti("regulated", s)} />
            ))}
          </div>
        </Section>

        <Section title="Systèmes d'information utilisés">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SYSTEMS.map((s) => (
              <Check key={s} label={s} checked={value.systems.includes(s)}
                onChange={() => toggleMulti("systems", s)} />
            ))}
          </div>
        </Section>
      </div>

      <div className="flex justify-end pt-2">
        <motion.button
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          disabled={!canContinue}
          onClick={onNext}
          className="group relative overflow-hidden rounded-2xl bg-gradient-brand px-7 py-3.5 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)] transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <span className="relative z-10">Commencer l'évaluation →</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>
      </div>
    </div>
  );
}

function Section({ title, required, children }: { title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-strong rounded-2xl p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80">
        {title}
        {required && <span className="text-accent">*</span>}
      </h3>
      {children}
    </motion.div>
  );
}

function Radio({ name, label, checked, onChange }: { name: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition-all ${
      checked
        ? "border-transparent bg-gradient-brand-soft ring-brand text-white"
        : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.05]"
    }`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
        checked ? "border-accent bg-accent" : "border-white/30"
      }`}>
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span className="font-medium">{label}</span>
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition-all ${
      checked
        ? "border-transparent bg-gradient-brand-soft ring-brand text-white"
        : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.05]"
    }`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border-2 transition ${
        checked ? "border-accent bg-accent" : "border-white/30"
      }`}>
        {checked && <svg viewBox="0 0 12 12" className="h-3 w-3 text-white"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span className="font-medium">{label}</span>
    </label>
  );
}
