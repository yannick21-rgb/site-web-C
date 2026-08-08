import Link from "next/link";
import type { Product } from "@prisma/client";
import { CATEGORY_LABELS_UPPER, formatPrice, initials } from "@/lib/format";
import type { Category } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const stock = product.stock;
  const stockClass = stock <= 0 ? "stock-out" : stock <= 2 ? "stock-low" : "stock-ok";
  const stockText = stock <= 0 ? "Rupture" : `${stock} en stock`;

  return (
    <div className="card p-[26px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="card-tag">{CATEGORY_LABELS_UPPER[product.category as Category]}</span>
        <span className={`badge-pill ${stockClass}`}>{stockText}</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface-2 border border-line flex items-center justify-center font-chakra font-bold text-line text-xl shrink-0">
          {initials(product.name)}
        </div>
        <h3 className="text-lg">{product.name}</h3>
      </div>
      <div className="flex-1">
        <div className="spec-row">
          <span className="k">CPU</span>
          <span className="text-right text-ink">{product.cpu}</span>
        </div>
        <div className="spec-row">
          <span className="k">GPU</span>
          <span className="text-right text-ink">{product.gpu}</span>
        </div>
        <div className="spec-row">
          <span className="k">RAM</span>
          <span className="text-right text-ink">{product.ram}</span>
        </div>
        <div className="spec-row">
          <span className="k">Stockage</span>
          <span className="text-right text-ink">{product.storage}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div className="font-chakra text-xl font-bold">
          {formatPrice(product.price)} <span className="text-sm text-muted font-normal">FCFA</span>
        </div>
        <Link
          href={`/reserver?produit=${product.id}`}
          className="bg-surface-2 border border-line px-4 py-2 rounded-md text-[0.82rem] hover:border-cyan hover:text-cyan transition-colors"
        >
          Réserver
        </Link>
      </div>
    </div>
  );
}
