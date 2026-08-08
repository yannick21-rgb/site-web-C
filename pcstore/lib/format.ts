import type { Category } from "@/lib/types";

export function formatPrice(fcfa: number): string {
  return new Intl.NumberFormat("fr-FR").format(fcfa);
}

export const CATEGORY_LABELS: Record<Category, string> = {
  GAMING: "Gaming",
  BUREAUTIQUE: "Bureautique",
  CREATION: "Création",
  DEVELOPPEMENT: "Développement",
};

export const CATEGORY_LABELS_UPPER: Record<Category, string> = {
  GAMING: "GAMING",
  BUREAUTIQUE: "BUREAUTIQUE",
  CREATION: "CRÉATION",
  DEVELOPPEMENT: "DÉVELOPPEMENT",
};

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function splitImages(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function joinImages(images: string[]): string {
  return images.filter((i) => i.trim()).join("\n");
}

export function stockLabel(stock: number): string {
  if (stock <= 0) return "Rupture";
  if (stock <= 2) return `${stock} en stock`;
  return `${stock} en stock`;
}
