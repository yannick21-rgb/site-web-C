"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@prisma/client";
import { CATEGORY_LABELS, formatPrice } from "@/lib/format";
import type { Category } from "@/lib/types";

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) return;
    const res = await fetch(`/api/produits/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Impossible de supprimer ce produit.");
    }
  };

  const stockBadge = (stock: number) =>
    stock <= 0 ? (
      <span className="badge-pill stock-out">Rupture</span>
    ) : stock <= 2 ? (
      <span className="badge-pill stock-low">{stock} en stock</span>
    ) : (
      <span className="badge-pill stock-ok">{stock} en stock</span>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-[18px] flex-wrap gap-3">
        <input
          className="field !w-full sm:!w-[280px]"
          placeholder="Rechercher un produit..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Rechercher un produit"
        />
        <Link href="/admin/produits/nouveau" className="btn-primary text-sm py-2.5 px-6">
          + Ajouter un produit
        </Link>
      </div>

      <div className="bg-white border border-line rounded-[18px] overflow-hidden shadow-[0_14px_40px_-28px_rgba(107,91,216,0.5)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Produit", "Catégorie", "Prix", "Stock", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[0.72rem] font-semibold text-muted uppercase tracking-[0.5px] px-5 py-3.5 border-b border-line bg-surface-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-b-0 hover:bg-surface-2/50">
                <td className="px-5 py-4 text-[0.88rem]">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-[0.78rem] text-muted font-medium">
                    {p.cpu} · {p.gpu} · {p.ram}
                  </div>
                </td>
                <td className="px-5 py-4 text-[0.88rem] text-muted">{CATEGORY_LABELS[p.category as Category]}</td>
                <td className="px-5 py-4 font-semibold text-[0.88rem]">{formatPrice(p.price)} F</td>
                <td className="px-5 py-4">{stockBadge(p.stock)}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/produits/${p.id}/modifier`}
                      className="bg-white border border-line rounded-full px-4 py-2 text-[0.78rem] font-medium text-muted hover:border-violet hover:text-violet-deep transition-colors"
                    >
                      Modifier
                    </Link>
                    <button
                      className="bg-white border border-line rounded-full px-4 py-2 text-[0.78rem] font-medium text-muted hover:border-red hover:text-red transition-colors cursor-pointer"
                      onClick={() => remove(p.id, p.name)}
                    >
                      Suppr.
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted text-[0.85rem]">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}