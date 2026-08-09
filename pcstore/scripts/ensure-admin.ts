import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_CREATE_EMAIL || "admin@pcstore.bj";
const ADMIN_PASSWORD = process.env.ADMIN_CREATE_PASSWORD || "pcstore2026";

async function main() {
  if (ADMIN_PASSWORD.length < 8) {
    console.error("[ensure-admin] Le mot de passe doit contenir au moins 8 caractères.");
    process.exit(1);
  }
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`[ensure-admin] Admin prêt : ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
