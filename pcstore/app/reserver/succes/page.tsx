import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ReservationSuccesPage({
  searchParams,
}: {
  searchParams: { produit?: string; nom?: string };
}) {
  const product = searchParams.produit
    ? await prisma.product.findUnique({ where: { id: searchParams.produit } })
    : null;
  const nom = searchParams.nom ?? "";

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[560px] mx-auto px-[6%] pt-[60px] pb-[100px] text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-[26px] border border-green flex items-center justify-center text-green mono text-[1.4rem]">
          ✓
        </div>
        <h1 className="text-[1.7rem] mb-[10px]">Demande enregistrée</h1>
        <p className="text-muted mb-[26px] leading-[1.6]">
          {nom && <>Merci {nom}. </>}Ta réservation est bien notée
          {product && (
            <>
              {" "}
              pour le <b className="text-ink">{product.name}</b>
            </>
          )}
          . On te rappelle rapidement pour confirmer le retrait.
        </p>
        <span className="badge-pill status-pending mb-[26px]">STATUT : EN ATTENTE</span>
        <div className="bg-surface border border-line rounded-[10px] px-[18px] py-4 text-[0.84rem] text-muted text-left">
          La validation se fait en boutique, au moment du retrait à Cotonou. L&apos;unité est
          réservée pour toi pendant 48h.
        </div>
        <Link href="/catalogue" className="btn-primary mt-[30px] inline-block">
          Retour au catalogue
        </Link>
      </div>
      <Footer />
    </div>
  );
}
