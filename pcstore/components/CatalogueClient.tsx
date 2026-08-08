"use client";

import { useMemo, useState } from "react";
import type { Product } from "@prisma/client";
import ProductCard from "@/components/ProductCard";

type Cat = "all" | "GAMING" | "BUREAUTIQUE" | "CREATION" | "DEVELOPPEMENT";

const CATS: { value: Cat; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "GAMING", label: "Gaming" },
  { value: "BUREAUTIQUE", label: "Bureautique" },
  { value: "CREATION", label: "Création" },
  { value: "DEVELOPPEMENT", label: "Développement" },
];

const PRICE_OPTIONS = [
  { value: "all", label: "Tout budget" },
  { value: "low", label: "< 300 000 F" },
  { value: "mid", label: "300 000 – 600 000 F" },
  { value: "high", label: "600 000 – 1 000 000 F" },
  { value: "top", label: "1 000 000+ F" },
];

export default function CatalogueClient({ products }: { products: Product[] }) {
  const [cat, setCat] = useState<Cat>("all");
  const [price, setPrice] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      let okPrice = true;
      if (price === "low") okPrice = p.price < 300_000;
      else if (price === "mid") okPrice = p.price >= 300_000 && p.price <= 600_000;
      else if (price === "high") okPrice = p.price > 600_000 && p.price < 1_000_000;
      else if (price === "top") okPrice = p.price >= 1_000_000;
      return okCat && okPrice;
    });
  }, [products, cat, price]);

  const reset = () => {
    setCat("all");
    setPrice("all");
  };

  return (
    <div className="min-h-screen">
      <div className="px-[6%] pt-10">
        <h1 className="text-[2rem] mb-[6px]">Le catalogue</h1>
        <p className="text-muted text-[0.95rem] mb-[26px]">
          Toutes les machines disponibles à Cotonou, avec les vraies caractéristiques.
        </p>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            {CATS.map((c) => (
              <button
                key={c.value}
                className={`chip ${cat === c.value ? "active" : ""}`}
                onClick={() => setCat(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select
            className="field !w-auto mono !text-[0.78rem] cursor-pointer"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-label="Filtrer par prix"
          >
            {PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-[6%] pt-7 mono text-[0.78rem] text-muted flex justify-between items-center">
        <span>
          {filtered.length} {filtered.length > 1 ? "machines" : "machine"}
        </span>
        <button className="text-cyan bg-none border-none mono text-[0.78rem] cursor-pointer" onClick={reset}>
          Réinitialiser les filtres
        </button>
      </div>

      <div className="px-[6%] py-6 pb-[90px]">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            <div className="mono text-cyan mb-3">AUCUN RÉSULTAT</div>
            <p className="mb-6">Aucune machine ne correspond aux filtres sélectionnés.</p>
            <button className="btn-primary" onClick={reset}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
