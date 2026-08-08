import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationForm from "@/components/ReservationForm";

export const dynamic = "force-dynamic";

export default async function ReserverPage() {
  const products = await prisma.product.findMany({ orderBy: { price: "asc" } });

  return (
    <div className="min-h-screen">
      <Header />
      <ReservationForm products={products} />
      <Footer />
    </div>
  );
}
