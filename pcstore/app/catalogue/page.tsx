import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogueClient from "@/components/CatalogueClient";

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const products = await prisma.product.findMany({ orderBy: { price: "asc" } });

  return (
    <div className="min-h-screen">
      <Header />
      <CatalogueClient products={products} />
      <Footer />
    </div>
  );
}
