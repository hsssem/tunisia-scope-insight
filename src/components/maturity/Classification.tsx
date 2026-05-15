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
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1F4E79]">Profil de votre organisation</h1>
        <p className="mt-2 text-slate-600">
          Ces informations permettent d'adapter l'évaluation à votre contexte
        </p>
      </div>

      <Section title="Secteur d'activité principal">
        {SECTORS.map((s) => (
          <Radio key={s.id} name="sector" label={s.label} checked={value.sector === s.id}
            onChange={() => onChange({ ...value, sector: s.id })} />
        ))}
      </Section>

      <Section title="Nombre d'employés">
        {SIZES.map((s) => (
          <Radio key={s} name="size" label={s} checked={value.size === s}
            onChange={() => onChange({ ...value, size: s })} />
        ))}
      </Section>

      <Section title="Fonction IT identifiée">
        {IT_FUNCTIONS.map((s) => (
          <Radio key={s} name="it" label={s} checked={value.itFunction === s}
            onChange={() => onChange({ ...value, itFunction: s })} />
        ))}
      </Section>

      <Section title="Données réglementées">
        {REGULATED_DATA.map((s) => (
          <Check key={s} label={s} checked={value.regulated.includes(s)}
            onChange={() => toggleMulti("regulated", s)} />
        ))}
      </Section>

      <Section title="Systèmes d'information utilisés">
        {SYSTEMS.map((s) => (
          <Check key={s} label={s} checked={value.systems.includes(s)}
            onChange={() => toggleMulti("systems", s)} />
        ))}
      </Section>

      <div className="flex justify-end">
        <button
          disabled={!canContinue}
          onClick={onNext}
          className="rounded-xl bg-[#1F4E79] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#2E75B6] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Commencer l'évaluation →
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-800">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Radio({ name, label, checked, onChange }: { name: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${checked ? "border-[#2E75B6] bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-[#1F4E79]" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${checked ? "border-[#2E75B6] bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#1F4E79]" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
