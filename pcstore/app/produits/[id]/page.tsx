import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { CATEGORY_LABELS_UPPER, formatPrice } from "@/lib/format";
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
        <span className="inline-block w-[6px] h-[6px] rounded-full bg-green mr-1.5"></span>
        {stock} unité{stock > 1 ? "s" : ""} en stock
      </span>
    );

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-[6%] pt-5 text-[0.8rem] font-medium text-muted">
        <Link href="/catalogue" className="hover:text-violet-deep">
          Catalogue
        </Link>{" "}
        / {CATEGORY_LABELS_UPPER[product.category as Category]} /{" "}
        <span className="text-violet-deep">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-[60px] px-[6%] pt-[32px] pb-[80px] items-start">
        <div>
          <Gallery images={product.images ? product.images.split("\n").filter(Boolean) : []} name={product.name} />
          <div className="flex gap-[10px] mt-5 flex-wrap">
            {stockBadge}
            <span className="badge-pill text-muted border border-line bg-white">Garantie 12 mois</span>
            <span className="badge-pill text-muted border border-line bg-white">Retrait à Cotonou</span>
          </div>
        </div>

        <div>
          <span className="card-tag mb-4 block">{CATEGORY_LABELS_UPPER[product.category as Category]}</span>
          <h1 className="font-sora font-extrabold text-[2.3rem] uppercase tracking-tight mb-[12px]">
            {product.name}
          </h1>
          <p className="text-muted text-[0.98rem] mb-[26px] leading-[1.6] max-w-[460px]">
            {product.shortDescription}
          </p>

          <div className="flex items-baseline gap-[10px] mb-[28px] pb-[26px] border-b border-line">
            <span className="font-sora font-extrabold text-[2rem]">{formatPrice(product.price)}</span>
            <span className="text-muted text-[0.95rem] font-medium">FCFA</span>
          </div>

          <div className="bg-white border border-line rounded-[20px] p-[26px] mb-[30px]">
            {(
              [
                ["Processeur", product.cpu],
                ["Carte graphique", product.gpu],
                ["Mémoire", product.ram],
                ["Stockage", product.storage],
                ["Écran", product.screen],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between py-[12px] border-b border-line last:border-b-0 text-[0.9rem]">
                <span className="text-muted text-[0.85rem]">{k}</span>
                <span className="font-medium text-right">{v}</span>
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

          <div className="bg-white border border-line rounded-[18px] p-[18px_20px] text-[0.85rem] text-muted flex gap-3 items-start leading-[1.6]">
            <div className="w-6 h-6 rounded-full bg-violet-deep/10 text-violet-deep border border-violet-deep/25 text-[0.8rem] font-semibold flex items-center justify-center shrink-0">
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
        <h2 className="font-sora font-bold uppercase text-[1.5rem] mb-[30px]">Fiche technique complète</h2>
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
            <div key={g.title} className="bg-white border border-line rounded-[20px] p-7">
              <div className="font-semibold text-[0.72rem] text-violet-deep uppercase tracking-[1.5px] mb-4">
                {g.title}
              </div>
              {g.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-3 py-[9px] border-b border-line last:border-b-0 text-[0.86rem]"
                >
                  <span className="text-muted">{k}</span>
                  <span className="text-right font-medium">{v}</span>
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