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
    { label: "Produits actifs", value: products, color: "text-violet-deep" },
    { label: "Réservations en attente", value: pending, color: "text-amber" },
    { label: "Stock faible", value: lowStock, color: "text-amber" },
    { label: "Réservations ce mois", value: monthReservations, color: "text-[#1a9a5c]" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-[30px]">
        <div>
          <h1 className="font-sora font-extrabold text-[1.5rem] uppercase tracking-tight">
            Tableau de bord
          </h1>
          <div className="text-muted text-[0.88rem] mt-1">Vue d&apos;ensemble du catalogue et des réservations</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-line rounded-[18px] p-5 shadow-[0_12px_34px_-24px_rgba(107,91,216,0.45)]">
            <div className="text-[0.72rem] font-semibold text-muted uppercase tracking-[0.5px] mb-[10px]">
              {s.label}
            </div>
            <div className={`font-sora font-extrabold text-[1.7rem] ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}