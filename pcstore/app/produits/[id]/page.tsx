import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { CATEGORY_LABELS_UPPER, formatPrice, splitImages } from "@/lib/format";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  const stock = product.stock;
  const stockBadge =
    stock <= 0 ? (
      <span className="badge-pill stock-out">Rupture</span>
    ) : (
      <span className="badge-pill stock-ok">
        <span className="inline-block w-[6px] h-[6px] rounded-full bg-green shadow-[0_0_6px_var(--green)] mr-1.5"></span>
        {stock} unité{stock > 1 ? "s" : ""} en stock
      </span>
    );

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-[6%] pt-5 mono text-[0.78rem] text-muted">
        <Link href="/catalogue" className="hover:text-cyan">
          Catalogue
        </Link>{" "}
        / {CATEGORY_LABELS_UPPER[product.category as Category]} / <span className="text-cyan">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-[60px] px-[6%] pt-[30px] pb-[80px] items-start">
        <div>
          <Gallery images={splitImages(product.images)} name={product.name} />
          <div className="flex gap-[10px] mt-5 flex-wrap">
            {stockBadge}
            <span className="badge-pill !text-muted !bg-none border border-line">Garantie 12 mois</span>
            <span className="badge-pill !text-muted !bg-none border border-line">Retrait à Cotonou</span>
          </div>
        </div>

        <div>
          <span className="card-tag mb-4">{CATEGORY_LABELS_UPPER[product.category as Category]}</span>
          <h1 className="text-[2.3rem] mb-[10px]">{product.name}</h1>
          <p className="text-muted text-[0.98rem] mb-[26px] leading-[1.55] max-w-[460px]">
            {product.shortDescription}
          </p>

          <div className="flex items-baseline gap-[10px] mb-[28px] pb-[26px] border-b border-line">
            <span className="font-chakra text-[2rem] font-bold">{formatPrice(product.price)}</span>
            <span className="text-muted text-[0.95rem]">FCFA</span>
          </div>

          <div className="mb-[30px]">
            {(
              [
                ["PROCESSEUR", product.cpu],
                ["CARTE GRAPHIQUE", product.gpu],
                ["MÉMOIRE", product.ram],
                ["STOCKAGE", product.storage],
                ["ÉCRAN", product.screen],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between py-[13px] border-b border-line text-[0.9rem]">
                <span className="text-muted mono text-[0.82rem]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-[14px] mb-[30px]">
            <Link
              href={`/reserver?produit=${product.id}`}
              className={`btn-primary flex-1 text-center ${stock <= 0 ? "pointer-events-none opacity-40" : ""}`}
              aria-disabled={stock <= 0}
            >
              Réserver ce PC
            </Link>
          </div>

          <div className="bg-surface border border-line rounded-[10px] p-[16px_18px] text-[0.85rem] text-muted flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full border border-amber text-amber mono text-[0.75rem] flex items-center justify-center shrink-0">
              i
            </div>
            <div>
              La réservation bloque l&apos;unité 48h. Le paiement se fait directement en boutique,
              sur place, au moment du retrait.
            </div>
          </div>
        </div>
      </div>

      <div className="px-[6%] pb-[90px]">
        <h2 className="text-[1.5rem] mb-[30px]">Fiche technique complète</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {(
            [
              {
                title: "Performance",
                rows: [
                  ["CPU", product.cpu],
                  ["GPU", product.gpu],
                  ["RAM", product.ram],
                  ["Stockage", product.storage],
                ],
              },
              {
                title: "Affichage & audio",
                rows: [
                  ["Écran", product.screen],
                  ["Audio", "Haut-parleurs stéréo"],
                  ["Webcam", "HD"],
                ],
              },
              {
                title: "Connectique & autonomie",
                rows: [
                  ["Ports", product.connectivity],
                  ["Batterie", product.battery],
                  ["Poids", product.weight],
                ],
              },
            ] as const
          ).map((g) => (
            <div key={g.title} className="bg-surface border border-line rounded-[12px] p-6">
              <div className="mono text-[0.75rem] text-cyan uppercase tracking-[1px] mb-4">{g.title}</div>
              {g.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-[9px] border-b border-line text-[0.86rem] last:border-b-0"
                >
                  <span className="text-muted">{k}</span>
                  <span className="text-right">{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
