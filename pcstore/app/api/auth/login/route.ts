import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe obligatoires." }, { status: 400 });
  }

  const loginEmail = email.toLowerCase().trim();
  const defaultEmail = (process.env.ADMIN_CREATE_EMAIL || "admin@pcstore.bj").toLowerCase().trim();
  const defaultPassword = process.env.ADMIN_CREATE_PASSWORD || "pcstore2026";

  if (loginEmail === defaultEmail && password === defaultPassword) {
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await prisma.adminUser.upsert({
      where: { email: defaultEmail },
      update: { passwordHash },
      create: { email: defaultEmail, passwordHash },
    });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: loginEmail } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const token = await createSession(admin.email);
  setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
