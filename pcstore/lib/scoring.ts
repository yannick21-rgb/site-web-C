import type { Product } from "@prisma/client";
import type { Category } from "@/lib/types";

export type Usage = "gaming" | "creation" | "bureautique" | "developpement";
export type Budget = "low" | "mid" | "high" | "ultra";
export type Priority = "autonomie" | "puissance" | "ecran" | "poids";

export interface RecommendationAnswers {
  usage: Usage;
  budget: Budget;
  priorities: Priority[];
}

export interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
}

const USAGE_LABELS: Record<Usage, string> = {
  gaming: "gaming",
  creation: "montage vidéo / design",
  bureautique: "cours / bureautique",
  developpement: "développement",
};

/* Correspondance catégorie produit -> usage déclaré (poids 0..1) */
const USAGE_FIT: Record<Category, Record<Usage, number>> = {
  GAMING: { gaming: 1, developpement: 0.55, creation: 0.4, bureautique: 0.3 },
  BUREAUTIQUE: { bureautique: 1, developpement: 0.45, creation: 0.2, gaming: 0.15 },
  CREATION: { creation: 1, developpement: 0.6, gaming: 0.5, bureautique: 0.35 },
  DEVELOPPEMENT: { developpement: 1, creation: 0.5, bureautique: 0.6, gaming: 0.5 },
};

const BUDGET_RANGES: Record<Budget, { min: number; max: number }> = {
  low: { min: 0, max: 300_000 },
  mid: { min: 300_000, max: 600_000 },
  high: { min: 600_000, max: 1_000_000 },
  ultra: { min: 1_000_000, max: Number.POSITIVE_INFINITY },
};

const PRIORITY_ORDER: Priority[] = ["autonomie", "puissance", "ecran", "poids"];

export function isValidUsage(u: string | null): u is Usage {
  return !!u && ["gaming", "creation", "bureautique", "developpement"].includes(u);
}

export function isValidBudget(b: string | null): b is Budget {
  return !!b && ["low", "mid", "high", "ultra"].includes(b);
}

function parseBatteryWh(battery: string): number | null {
  const m = battery.match(/(\d+(?:\.\d+)?)\s*(Wh|watt)/i);
  return m ? parseFloat(m[1]) : null;
}

function parseWeightKg(weight: string): number | null {
  const m = weight.match(/(\d+(?:\.\d+)?)\s*kg/i);
  return m ? parseFloat(m[1]) : null;
}

function hasDedicatedGpu(gpu: string): boolean {
  return /rtx|gtx|quadro|radeon rx/i.test(gpu);
}

function hasPremiumScreen(screen: string): boolean {
  return /qhd|4k|144\s?hz|165\s?hz|240\s?hz|oled|mini\s?led/i.test(screen);
}

function budgetFit(price: number, budget: Budget): number {
  const { min, max } = BUDGET_RANGES[budget];
  if (budget === "ultra") return price >= 700_000 ? 1 : 0.6;
  if (price <= max && price >= min * 0.85) return 1;
  if (price < min * 0.85) return 0.75; // sous le budget : config plus modeste
  const over = price - max;
  const penalty = over / (max * 1.2);
  return Math.max(0.25, 1 - penalty);
}

function priorityPoints(product: Product, priorities: Priority[]): { points: number; reasons: string[] } {
  let points = 0;
  const reasons: string[] = [];
  const battery = parseBatteryWh(product.battery);
  const weight = parseWeightKg(product.weight);

  if (priorities.includes("autonomie")) {
    if (battery !== null) {
      if (battery >= 60) {
        points += 15;
        reasons.push("Batterie de " + product.battery + " — tient largement la journée");
      } else if (battery >= 45) {
        points += 8;
        reasons.push("Batterie correcte (" + product.battery + ") pour un usage mobile");
      }
    }
  }
  if (priorities.includes("puissance")) {
    if (hasDedicatedGpu(product.gpu)) {
      points += 15;
      reasons.push(product.gpu + " — vraie carte graphique, puissance au-dessus de la moyenne");
    } else if (/\b(9|13|14)\d{4}H\b|\bRyzen 7\b|\bRyzen 9\b/.test(product.cpu)) {
      points += 10;
      reasons.push(product.cpu + " — CPU rapide même sans carte dédiée");
    }
  }
  if (priorities.includes("ecran")) {
    if (hasPremiumScreen(product.screen)) {
      points += 15;
      reasons.push("Écran " + product.screen + " — qualité visuelle nettement au-dessus du standard");
    }
  }
  if (priorities.includes("poids")) {
    if (weight !== null) {
      if (weight <= 1.8) {
        points += 15;
        reasons.push(product.weight + " — machine légère, facile à transporter");
      } else if (weight <= 2.4) {
        points += 8;
        reasons.push(product.weight + " — raisonnablement transportable");
      }
    }
  }
  return { points, reasons };
}

export function scoreProduct(product: Product, answers: RecommendationAnswers): ScoredProduct {
  const usageFit = USAGE_FIT[product.category as Category][answers.usage];
  const bFit = budgetFit(product.price, answers.budget);
  const { points, reasons } = priorityPoints(product, answers.priorities);

  const raw = usageFit * 62 + bFit * 23 + points * 1;
  const score = Math.min(100, Math.round(raw));

  const reasonsOut = [...reasons];

  if (usageFit >= 0.8) {
    reasonsOut.push(`Conçu pour ${USAGE_LABELS[answers.usage]} — exactement ton usage principal`);
  } else if (usageFit >= 0.45) {
    reasonsOut.push(
      `Correct pour ${USAGE_LABELS[answers.usage]}, même si ce n'est pas sa vocation première`
    );
  } else {
    reasonsOut.push(`Pas pensé pour ${USAGE_LABELS[answers.usage]} — il fonctionnera, sans plus`);
  }

  if (bFit >= 0.95) {
    reasonsOut.push("Prix dans ta fourchette de budget");
  } else if (bFit >= 0.6) {
    reasonsOut.push("Un peu au-dessus de ta fourchette de budget");
  } else if (bFit >= 0.35) {
    reasonsOut.push("Nettement au-dessus de ton budget");
  } else {
    reasonsOut.push("Sous ta fourchette — config plus modeste");
  }

  if (hasDedicatedGpu(product.gpu) && answers.usage === "creation") {
    reasonsOut.push(
      `${product.gpu} largement au-dessus du besoin pour du montage fluide`
    );
  }
  if (answers.priorities.includes("puissance") && hasDedicatedGpu(product.gpu)) {
    reasonsOut.push(`${product.gpu} — de quoi encaisser les charges lourdes`);
  }

  return { product, score, reasons: reasonsOut.slice(0, 4) };
}

export function recommend(products: Product[], answers: RecommendationAnswers): ScoredProduct[] {
  return products
    .map((p) => scoreProduct(p, answers))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export { USAGE_LABELS, PRIORITY_ORDER };
