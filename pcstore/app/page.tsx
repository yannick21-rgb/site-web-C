import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TerminalPanel from "@/components/TerminalPanel";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await prisma.product.findMany({ take: 3, orderBy: { createdAt: "asc" } });

  return (
    <div className="min-h-screen">
      <Header />

      <div className="relative overflow-hidden border-b border-line">
        <div className="grid-bg"></div>
        <div className="relative z-[2] max-w-[640px] px-[6%] pt-[110px] pb-[100px]">
          <div className="mono text-[0.78rem] text-green tracking-[2px] uppercase mb-[18px] flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-green shadow-[0_0_8px_var(--green)]"></span>
            Stock disponible à Cotonou
          </div>
          <h1 className="text-[2.2rem] sm:text-[3.1rem] leading-[1.08] font-bold mb-[22px] bg-gradient-to-r from-white to-cyan bg-clip-text text-transparent">
            Le bon PC, pas
            <br />
            le PC par défaut.
          </h1>
          <p className="text-muted text-base sm:text-[1.05rem] leading-[1.6] mb-[34px] max-w-[480px]">
            Dis-nous ce que tu veux faire — gaming, montage, cours, business — et on te montre
            les machines qui tiennent vraiment la route pour ça.
          </p>
          <div className="flex gap-[14px] flex-wrap">
            <Link href="/questionnaire" className="btn-primary">
              Trouver mon PC →
            </Link>
            <Link href="/catalogue" className="btn-secondary">
              Voir le catalogue
            </Link>
          </div>
        </div>
        <TerminalPanel />
      </div>

      <section className="px-[6%] py-[90px]">
        <div className="flex justify-between items-end mb-11 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-[1.9rem] font-semibold">Le catalogue</h2>
            <p className="text-muted max-w-[420px] text-[0.95rem] mt-2">
              Une sélection de machines vérifiées, avec les vraies caractéristiques — pas de fiche vague.
            </p>
          </div>
          <Link href="/catalogue" className="btn-secondary text-sm py-3 px-5">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-bg-alt border-y border-line grid lg:grid-cols-2 gap-[60px] items-center px-[6%] py-[90px]">
        <div>
          <h2 className="text-2xl sm:text-[2rem] mb-[18px]">Pas sûr de ce qu&apos;il te faut ?</h2>
          <p className="text-muted mb-[28px] leading-[1.6]">
            Réponds à quelques questions sur ce que tu veux faire avec ton PC — montage, jeux,
            cours, dev — et on classe le catalogue selon ce qui te correspond vraiment, pas selon
            ce qui se vend le plus.
          </p>
          <div className="flex gap-[10px] flex-wrap mb-[30px]">
            {["Gaming", "Montage vidéo", "Bureautique", "Développement", "Design"].map((t) => (
              <span key={t} className="mono text-[0.78rem] px-3.5 py-2 border border-line rounded-full text-muted">
                {t}
              </span>
            ))}
          </div>
          <Link href="/questionnaire" className="btn-primary">
            Commencer le questionnaire →
          </Link>
        </div>
        <div className="bg-surface border border-line rounded-[12px] p-[28px]">
          <div className="mb-[18px]">
            <div className="flex justify-between text-[0.82rem] mb-[7px]">
              <span>Studio Pro X</span>
              <span className="mono text-cyan">94%</span>
            </div>
            <div className="h-[7px] bg-surface-2 rounded overflow-hidden">
              <div className="h-full rounded bg-gradient-to-r from-cyan to-violet" style={{ width: "94%" }}></div>
            </div>
          </div>
          <div className="mb-[18px]">
            <div className="flex justify-between text-[0.82rem] mb-[7px]">
              <span>Aster RX-15</span>
              <span className="mono text-cyan">78%</span>
            </div>
            <div className="h-[7px] bg-surface-2 rounded overflow-hidden">
              <div className="h-full rounded bg-gradient-to-r from-cyan to-violet" style={{ width: "78%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[0.82rem] mb-[7px]">
              <span>Nova Slim 14</span>
              <span className="mono text-cyan">41%</span>
            </div>
            <div className="h-[7px] bg-surface-2 rounded overflow-hidden">
              <div className="h-full rounded bg-gradient-to-r from-cyan to-violet" style={{ width: "41%" }}></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
