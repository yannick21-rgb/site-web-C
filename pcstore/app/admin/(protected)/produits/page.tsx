import { prisma } from "@/lib/db";
import ProductsTable from "@/components/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-[1.5rem] mb-6">Produits</h1>
      <ProductsTable products={products} />
    </div>
  );
}
