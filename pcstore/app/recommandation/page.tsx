import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isValidBudget, isValidUsage, recommend, USAGE_LABELS } from "@/lib/scoring";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RecommandationPage({
  searchParams,
}: {
  searchParams: { usage?: string; budget?: string; priorites?: string };
}) {
  const usage = searchParams.usage ?? "";
  const budget = searchParams.budget ?? "";
  const prioritiesRaw = (searchParams.priorites ?? "").split(",").filter(Boolean);

  const answers =
    isValidUsage(usage) && isValidBudget(budget)
      ? {
          usage,
          budget,
          priorities: prioritiesRaw.filter(
            (p): p is "autonomie" | "puissance" | "ecran" | "poids" =>
              ["autonomie", "puissance", "ecran", "poids"].includes(p)
          ),
        }
      : null;

  let results = null;
  if (answers) {
    const products = await prisma.product.findMany();
    results = recommend(products, answers);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[760px] mx-auto px-[6%] pt-[50px] pb-[100px]">
        {!answers ? (
          <div>
            <div className="text-[0.75rem] font-semibold text-violet-deep tracking-[2px] uppercase mb-[14px]">
              Réponses manquantes
            </div>
            <h2 className="font-sora font-bold text-[1.8rem] mb-[8px]">
              Réponds au questionnaire pour des résultats
            </h2>
            <p className="text-muted mb-[36px]">
              Il faut un usage et un budget pour te recommander des machines.
            </p>
            <Link href="/questionnaire" className="btn-primary">
              Commencer le questionnaire →
            </Link>
          </div>
        ) : (
          <>
            <div className="text-[0.75rem] font-semibold tracking-[2px] uppercase mb-[14px]">
              <span className="w-2 h-2 rounded-full bg-[#16210a] inline-block mr-2"></span>
              Analyse terminée
            </div>
            <h2 className="font-sora font-bold text-[1.8rem] mb-[8px]">
              {results!.length > 0
                ? `${results!.length} PC correspondent à ton profil`
                : "Aucun PC ne correspond à ton profil"}
            </h2>
            <p className="text-muted mb-[36px]">
              Classés selon ce que tu as répondu — {USAGE_LABELS[answers.usage]}, budget{" "}
              {answers.budget}, priorités {answers.priorities.join(", ") || "aucune"}.
            </p>

            <div className="flex flex-col gap-4">
              {results!.map((r, i) => (
                <div
                  key={r.product.id}
                  className={`bg-white border rounded-[22px] p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 ${
                    i === 0
                      ? "border-violet-deep shadow-[0_0_0_4px_rgba(139,124,246,0.12),0_20px_44px_-24px_rgba(107,91,216,0.4)]"
                      : "border-line shadow-[0_10px_34px_-24px_rgba(107,91,216,0.35)]"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:items-start sm:block">
                    <div
                      className={`font-sora font-extrabold text-[1.5rem] w-10 shrink-0 text-center sm:text-left ${
                        i === 0 ? "bg-[linear-gradient(135deg,#8b7cf6,#6a5cd8)] bg-clip-text text-transparent" : "text-[#c9c4e2]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-sora font-bold text-[1.05rem]">{r.product.name}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.82rem] text-muted leading-relaxed">{r.reasons.join(" · ")}</div>
                    <div className="font-semibold text-[0.82rem] text-violet-deep mt-2">
                      {formatPrice(r.product.price)} FCFA
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5 sm:w-[130px] shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
                    <div className="text-right shrink-0">
                      <div className="font-sora font-extrabold text-violet-deep text-[1.1rem] mb-1">
                        {r.score}% match
                      </div>
                      <div className="h-[7px] bg-[#e7e3f7] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#8b7cf6,#6a5cd8)]"
                          style={{ width: `${r.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link
                      href={`/produits/${r.product.id}`}
                      className="bg-white border border-line px-5 py-2.5 rounded-full text-[0.82rem] font-medium shrink-0 hover:border-violet hover:text-violet-deep transition-colors"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-[34px]">
              <Link href="/questionnaire" className="btn-secondary text-sm">
                Refaire le questionnaire
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}