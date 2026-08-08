import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RESERVATION_STATUSES, type ReservationStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const status = body.status as ReservationStatus;
  if (!RESERVATION_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const existing = await prisma.reservation.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const updated = await prisma.reservation.update({
    where: { id: params.id },
    data: { status },
    include: { product: true },
  });

  return NextResponse.json(updated);
}
