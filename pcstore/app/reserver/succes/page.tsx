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
        <div className="w-16 h-16 rounded-full mx-auto mb-[26px] bg-[linear-gradient(135deg,#8b7cf6,#6a5cd8)] flex items-center justify-center text-white text-[1.5rem] font-bold shadow-[0_16px_40px_-14px_rgba(107,91,216,0.7)]">
          ✓
        </div>
        <h1 className="font-sora font-extrabold uppercase text-[1.7rem] mb-[10px]">Demande enregistrée</h1>
        <p className="text-muted mb-[26px] leading-[1.65]">
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
        <div className="bg-white border border-line rounded-[18px] px-[18px] py-4 text-[0.84rem] text-muted text-left leading-[1.65] shadow-[0_14px_40px_-26px_rgba(107,91,216,0.4)]">
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