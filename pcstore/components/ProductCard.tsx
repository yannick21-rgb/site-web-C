import Link from "next/link";
import type { Product } from "@prisma/client";
import { CATEGORY_LABELS_UPPER, formatPrice, initials } from "@/lib/format";
import type { Category } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const stock = product.stock;
  const stockClass = stock <= 0 ? "stock-out" : stock <= 2 ? "stock-low" : "stock-ok";
  const stockText = stock <= 0 ? "Rupture" : `${stock} en stock`;

  return (
    <div className="card p-[22px] flex flex-col relative">
      <Link
        href={`/produits/${product.id}`}
        className="absolute inset-0 z-[1] rounded-[20px]"
        aria-label={`Voir la fiche du ${product.name}`}
      />
      <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden bg-[linear-gradient(135deg,#e7e1ff_0%,#f4eaff_55%,#eef0fb_100%)] mb-[18px] flex items-center justify-center">
        <div className="absolute w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(139,124,246,0.3),transparent_70%)]"></div>
        <span className="relative font-sora font-extrabold text-[2.6rem] text-[#8b7cf6]/45 select-none">
          {initials(product.name)}
        </span>
        <span className={`badge-pill absolute top-3 right-3 ${stockClass}`}>{stockText}</span>
      </div>

      <span className="card-tag mb-[6px]">{CATEGORY_LABELS_UPPER[product.category as Category]}</span>
      <h3 className="font-sora font-bold text-[1.15rem] mb-[10px]">{product.name}</h3>

      <div className="flex gap-x-4 gap-y-1 flex-wrap text-[0.78rem] font-medium text-muted mb-5">
        <span>{product.cpu}</span>
        <span>·</span>
        <span>{product.ram}</span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="font-sora font-extrabold text-[1.25rem] leading-none">
          {formatPrice(product.price)}
          <span className="text-[0.72rem] font-semibold text-muted ml-1">FCFA</span>
        </div>
        <Link
          href={`/reserver?produit=${product.id}`}
          className={`relative z-[2] w-11 h-11 rounded-full bg-lime text-lime-ink flex items-center justify-center shadow-[0_10px_20px_-6px_rgba(198,255,63,0.65)] transition-transform hover:scale-110 ${
            stock <= 0 ? "pointer-events-none opacity-40 grayscale" : ""
          }`}
          aria-label={`Réserver le ${product.name}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}