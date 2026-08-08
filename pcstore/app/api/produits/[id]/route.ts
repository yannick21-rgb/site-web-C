import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CATEGORIES, type Category } from "@/lib/types";
import { joinImages } from "@/lib/format";

function buildData(body: Record<string, unknown>) {
  const images = Array.isArray(body.images) ? body.images.filter((i): i is string => typeof i === "string") : [];
  return {
    name: body.name as string,
    category: body.category as Category,
    shortDescription: (body.shortDescription as string) || "",
    price: body.price as number,
    stock: body.stock as number,
    cpu: body.cpu as string,
    gpu: body.gpu as string,
    ram: body.ram as string,
    storage: body.storage as string,
    screen: body.screen as string,
    connectivity: body.connectivity as string,
    battery: body.battery as string,
    weight: body.weight as string,
    images: joinImages(images),
  };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  const data = buildData(body);
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) delete (data as Record<string, unknown>)[k];
  }
  if (body.category && !CATEGORIES.includes(body.category as Category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const updated = await prisma.product.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
