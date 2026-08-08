import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_CREATE_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_CREATE_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_CREATE_EMAIL et ADMIN_CREATE_PASSWORD sont requis.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 8) {
  console.error("Le mot de passe doit contenir au moins 8 caractères.");
  process.exit(1);
}

async function main() {
  const email = ADMIN_EMAIL?.toLowerCase().trim() ?? "";
  const password = ADMIN_PASSWORD ?? "";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin prêt : ${admin.email}`);
  console.log("Supprime ensuite ADMIN_CREATE_PASSWORD des variables.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());