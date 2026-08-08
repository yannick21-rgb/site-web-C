import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, pending, lowStock, monthReservations] = await Promise.all([
    prisma.product.count(),
    prisma.reservation.count({ where: { status: "EN_ATTENTE" } }),
    prisma.product.count({ where: { stock: { lte: 2 } } }),
    prisma.reservation.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const stats = [
    { label: "Produits actifs", value: products, color: "" },
    { label: "Réservations en attente", value: pending, color: "text-amber" },
    { label: "Stock faible", value: lowStock, color: "text-amber" },
    { label: "Réservations ce mois", value: monthReservations, color: "text-green" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-[30px]">
        <div>
          <h1 className="text-[1.5rem]">Tableau de bord</h1>
          <div className="text-muted text-[0.85rem] mt-1">Vue d&apos;ensemble du catalogue et des réservations</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface border border-line rounded-[12px] p-5">
            <div className="mono text-[0.72rem] text-muted uppercase tracking-[0.5px] mb-[10px]">
              {s.label}
            </div>
            <div className={`font-chakra text-[1.7rem] font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
