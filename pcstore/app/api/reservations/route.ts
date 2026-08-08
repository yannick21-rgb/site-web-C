import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAdminReservation } from "@/lib/mail";

export async function GET() {
  const reservations = await prisma.reservation.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  let body: { productId?: string; clientName?: string; clientPhone?: string; comment?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { productId, clientName, clientPhone, comment } = body;
  if (!productId || !clientName || !clientPhone) {
    return NextResponse.json({ error: "Produit, nom et téléphone sont obligatoires." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  if (product.stock <= 0) {
    return NextResponse.json({ error: "Ce produit est en rupture de stock." }, { status: 409 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      productId,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      comment: comment?.trim() || null,
    },
  });

  await notifyAdminReservation({
    reservationId: reservation.id,
    clientName: reservation.clientName,
    clientPhone: reservation.clientPhone,
    comment: reservation.comment,
    productName: product.name,
  });

  return NextResponse.json(
    { id: reservation.id, status: reservation.status },
    { status: 201 }
  );
}
