import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CATEGORIES, type Category } from "@/lib/types";
import { joinImages } from "@/lib/format";

function validateProduct(body: Record<string, unknown>) {
  const errors: string[] = [];
  if (!body.name || typeof body.name !== "string") errors.push("nom");
  if (!CATEGORIES.includes(body.category as Category)) errors.push("catégorie");
  if (typeof body.price !== "number" || body.price <= 0) errors.push("prix");
  if (typeof body.stock !== "number" || body.stock < 0) errors.push("stock");
  for (const f of ["cpu", "gpu", "ram", "storage", "screen", "connectivity", "battery", "weight"]) {
    if (typeof body[f] !== "string") errors.push(f);
  }
  return errors;
}

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

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }
  const errors = validateProduct(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: `Champs obligatoires manquants : ${errors.join(", ")}.` }, { status: 400 });
  }
  const product = await prisma.product.create({ data: buildData(body) });
  return NextResponse.json(product, { status: 201 });
}
