import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_CREATE_EMAIL || "admin@pcstore.bj";
// Aucun mot de passe par défaut : il doit être fourni explicitement, sinon
// un mot de passe public se retrouverait dans la base à chaque build.
const ADMIN_PASSWORD = process.env.ADMIN_CREATE_PASSWORD;

async function main() {
  if (!ADMIN_PASSWORD) {
    console.error(
      "[ensure-admin] ADMIN_CREATE_PASSWORD est requis. Aucun mot de passe par défaut n'est utilisé."
    );
    process.exit(1);
  }
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
