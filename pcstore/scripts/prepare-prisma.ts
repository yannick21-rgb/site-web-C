/**
 * Bascule prisma/schema.prisma vers le bon provider selon DATABASE_URL :
 *  - "file:..."  → sqlite (dev local)
 *  - "postgres…" → postgresql (Vercel / prod)
 *
 * S'exécute automatiquement avant `npm run dev`, `npm run build` et
 * lors de chaque commande `prisma` via les scripts npm.
 */
import { copyFileSync, readFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const env = readFileSync(join(root, ".env"), "utf8");
    const m = env.match(/^DATABASE_URL=(.*)$/m);
    return m ? m[1]!.replace(/^["']|["']$/g, "").trim() : "";
  } catch {
    return "";
  }
}

const url = resolveDatabaseUrl();
const provider = url.startsWith("file:") ? "sqlite" : "postgresql";

copyFileSync(join(root, `prisma/schema.${provider}.prisma`), join(root, "prisma/schema.prisma"));
console.log(`[prisma] provider sélectionné : ${provider}`);