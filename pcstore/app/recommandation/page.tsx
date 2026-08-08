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
      <div className="max-w-[720px] mx-auto px-[6%] pt-[60px] pb-[100px]">
        {!answers ? (
          <div>
            <div className="mono text-[0.75rem] text-green mb-[14px]">RÉPONSES MANQUANTES</div>
            <h2 className="text-[1.8rem] mb-[8px]">Réponds au questionnaire pour des résultats</h2>
            <p className="text-muted mb-[36px]">Il faut un usage et un budget pour te recommander des machines.</p>
            <Link href="/questionnaire" className="btn-primary">
              Commencer le questionnaire →
            </Link>
          </div>
        ) : (
          <>
            <div className="mono text-[0.75rem] text-green mb-[14px]">✓ ANALYSE TERMINÉE</div>
            <h2 className="text-[1.8rem] mb-[8px]">
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
                  className={`bg-surface border rounded-[14px] p-6 flex gap-5 items-center ${
                    i === 0 ? "border-cyan" : "border-line"
                  }`}
                >
                  <div className={`font-chakra font-bold text-[1.6rem] w-9 shrink-0 ${i === 0 ? "text-cyan" : "text-line"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[1.05rem] mb-1">{r.product.name}</div>
                    <div className="text-[0.82rem] text-muted leading-relaxed">{r.reasons.join(" · ")}</div>
                    <div className="mono text-[0.78rem] text-muted mt-2">
                      {formatPrice(r.product.price)} FCFA
                    </div>
                  </div>
                  <div className="text-right w-[130px] shrink-0">
                    <div className="mono text-cyan text-[1.1rem] mb-1">{r.score}% match</div>
                    <div className="h-[6px] bg-surface-2 rounded overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-r from-cyan to-violet"
                        style={{ width: `${r.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={`/produits/${r.product.id}`}
                    className="bg-surface-2 border border-line px-4 py-2.5 rounded-md text-[0.82rem] shrink-0 hover:border-cyan hover:text-cyan transition-colors"
                  >
                    Voir
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-[30px]">
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
