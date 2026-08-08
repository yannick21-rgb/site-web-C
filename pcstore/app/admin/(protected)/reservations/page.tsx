import { prisma } from "@/lib/db";
import ReservationsTable from "@/components/ReservationsTable";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-[1.5rem] mb-6">Réservations</h1>
      <ReservationsTable reservations={reservations} />
    </div>
  );
}
