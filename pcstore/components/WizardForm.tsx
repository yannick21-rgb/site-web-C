"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Usage, Budget, Priority } from "@/lib/scoring";

const USAGES: { value: Usage; label: string; desc: string }[] = [
  { value: "gaming", label: "Gaming", desc: "Jeux récents, bonnes performances" },
  { value: "creation", label: "Montage vidéo / design", desc: "Premiere, Photoshop, rendu" },
  { value: "bureautique", label: "Cours / bureautique", desc: "Word, navigation, cours en ligne" },
  { value: "developpement", label: "Développement", desc: "Code, machines virtuelles, IDE" },
];

const BUDGETS: { value: Budget; label: string; range: string }[] = [
  { value: "low", label: "Petit budget", range: "< 300 000 FCFA" },
  { value: "mid", label: "Standard", range: "300 000 – 600 000 FCFA" },
  { value: "high", label: "Confort", range: "600 000 – 1 000 000 FCFA" },
  { value: "ultra", label: "Sans limite", range: "1 000 000+ FCFA" },
];

const PRIORITIES: { value: Priority; label: string; sub: string }[] = [
  { value: "autonomie", label: "Autonomie de la batterie", sub: "mobilité" },
  { value: "puissance", label: "Puissance brute", sub: "performance" },
  { value: "ecran", label: "Écran & confort visuel", sub: "affichage" },
  { value: "poids", label: "Poids & portabilité", sub: "format" },
];

export default function WizardForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  const togglePriority = (p: Priority) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length >= 2 ? prev : [...prev, p]
    );
  };

  const submit = () => {
    if (!usage || !budget) return;
    router.push(`/recommandation?usage=${usage}&budget=${budget}&priorites=${priorities.join(",")}`);
  };

  return (
    <div className="max-w-[680px] mx-auto px-[6%] pt-[50px] pb-[100px]">
      <div className="flex items-center gap-2 mb-[46px]">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-[5px] bg-[#e2dff0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,#8b7cf6,#6a5cd8)] transition-[width] duration-300"
              style={{ width: step > s ? "100%" : step === s ? "50%" : "0%" }}
            ></div>
          </div>
        ))}
        <span className="text-[0.78rem] font-semibold text-muted whitespace-nowrap">
          {step <= 3 ? `Étape ${step}/3` : "Résultat"}
        </span>
      </div>

      {step === 1 && (
        <div>
          <div className="text-[0.75rem] font-semibold text-violet-deep tracking-[2px] uppercase mb-[14px]">
            Question 1
          </div>
          <h2 className="font-sora font-bold text-[1.65rem] mb-[10px]">
            Tu veux faire quoi avec, principalement ?
          </h2>
          <p className="text-muted text-[0.95rem] mb-[36px]">
            Choisis l&apos;usage qui revient le plus souvent — on affinera après.
          </p>
          <div className="grid sm:grid-cols-2 gap-[14px] mb-[40px]">
            {USAGES.map((u, i) => (
              <button
                key={u.value}
                className={`text-left bg-white border rounded-[20px] p-[22px] transition-all ${
                  usage === u.value
                    ? "border-violet-deep shadow-[0_0_0_4px_rgba(139,124,246,0.14)]"
                    : "border-line shadow-[0_8px_24px_-18px_rgba(107,91,216,0.3)]"
                } hover:border-violet hover:shadow-[0_10px_28px_-16px_rgba(107,91,216,0.35)]`}
                onClick={() => setUsage(u.value)}
              >
                <span className="font-sora font-extrabold text-violet-deep text-[1.1rem] mb-[10px] block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="font-semibold mb-1">{u.label}</div>
                <div className="text-[0.82rem] text-muted">{u.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="btn-next" disabled={!usage} onClick={() => setStep(2)}>
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="text-[0.75rem] font-semibold text-violet-deep tracking-[1.5px] uppercase mb-[14px]">
            Question 2
          </div>
          <h2 className="font-sora font-bold text-[1.65rem] mb-[10px]">Ton budget approximatif ?</h2>
          <p className="text-muted text-[0.95rem] mb-[36px]">
            On te montrera surtout des PC dans cette fourchette, avec quelques alternatives proches.
          </p>
          <div className="flex flex-col gap-3 mb-[40px]">
            {BUDGETS.map((b) => (
              <button
                key={b.value}
                className={`bg-white border rounded-[18px] px-[22px] py-[18px] flex justify-between items-center transition-all ${
                  budget === b.value
                    ? "border-violet-deep shadow-[0_0_0_4px_rgba(139,124,246,0.14)]"
                    : "border-line shadow-[0_8px_24px_-18px_rgba(107,91,216,0.3)]"
                } hover:border-violet`}
                onClick={() => setBudget(b.value)}
              >
                <span className="font-medium">{b.label}</span>
                <span className="font-medium text-muted text-[0.85rem]">{b.range}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button className="text-muted text-[0.9rem] font-medium bg-none border-none hover:text-ink" onClick={() => setStep(1)}>
              ← Retour
            </button>
            <button className="btn-next" disabled={!budget} onClick={() => setStep(3)}>
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="text-[0.75rem] font-semibold text-violet-deep tracking-[1.5px] uppercase mb-[14px]">
            Question 3
          </div>
          <h2 className="font-sora font-bold text-[1.65rem] mb-[10px]">
            Qu&apos;est-ce qui compte le plus pour toi ?
          </h2>
          <p className="text-muted text-[0.95rem] mb-[36px]">Coche jusqu&apos;à deux priorités.</p>
          <div className="flex flex-col gap-[10px] mb-[40px]">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                className={`flex items-center gap-[14px] bg-white border rounded-[16px] px-5 py-4 text-left transition-all ${
                  priorities.includes(p.value)
                    ? "border-violet-deep shadow-[0_0_0_4px_rgba(139,124,246,0.14)]"
                    : "border-line shadow-[0_8px_24px_-18px_rgba(107,91,216,0.3)]"
                } hover:border-violet`}
                onClick={() => togglePriority(p.value)}
                aria-pressed={priorities.includes(p.value)}
              >
                <span
                  className={`w-5 h-5 rounded-[6px] border flex items-center justify-center text-[0.75rem] font-bold shrink-0 ${
                    priorities.includes(p.value) ? "border-violet-deep bg-violet-deep text-white" : "border-[#d5d1e8] bg-white"
                  }`}
                >
                  {priorities.includes(p.value) ? "✓" : ""}
                </span>
                <span className="text-[0.95rem]">{p.label}</span>
                <span className="text-[0.78rem] font-medium text-muted ml-auto">{p.sub}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button className="text-muted text-[0.9rem] font-medium bg-none border-none hover:text-ink" onClick={() => setStep(2)}>
              ← Retour
            </button>
            <button className="btn-next" onClick={submit}>
              Voir mes résultats →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}