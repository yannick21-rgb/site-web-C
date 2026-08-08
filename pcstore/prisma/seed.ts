import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { Category } from "../lib/types";

const prisma = new PrismaClient();

const PRODUCTS: {
  name: string;
  category: Category;
  shortDescription: string;
  price: number;
  stock: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  screen: string;
  connectivity: string;
  battery: string;
  weight: string;
}[] = [
  {
    name: "Studio Pro X",
    category: "CREATION",
    shortDescription:
      "Pensé pour le montage 4K, le rendu 3D et les sessions multi-applications sans ralentissement. La config la plus puissante du catalogue.",
    price: 1_150_000,
    stock: 3,
    cpu: "Ryzen 9 7940HS",
    gpu: "RTX 4070",
    ram: "32 Go DDR5",
    storage: "1 To SSD",
    screen: '16" QHD+ 165Hz',
    connectivity: "2x USB-C, 3x USB-A, HDMI",
    battery: "90Wh",
    weight: "2.1 kg",
  },
  {
    name: "Aster RX-15",
    category: "GAMING",
    shortDescription:
      "Un vrai GPU dédié pour jouer en conditions, sans exploser le budget. Bonne machine pour le jeu et le développement.",
    price: 720_000,
    stock: 1,
    cpu: "Ryzen 7 7735H",
    gpu: "RTX 4060",
    ram: "16 Go DDR5",
    storage: "512 Go SSD",
    screen: '15.6" FHD 144Hz',
    connectivity: "2x USB-C, 2x USB-A, HDMI",
    battery: "62Wh",
    weight: "2.3 kg",
  },
  {
    name: "Nova Slim 14",
    category: "BUREAUTIQUE",
    shortDescription:
      "Léger, silencieux, endurant : l'essentiel pour les cours, Word, la navigation et les visios, sans surpayer des performances inutiles.",
    price: 265_000,
    stock: 7,
    cpu: "Core i5-1235U",
    gpu: "Intel Iris Xe",
    ram: "8 Go DDR4",
    storage: "256 Go SSD",
    screen: '14" FHD IPS',
    connectivity: "2x USB-C, 1x USB-A, HDMI",
    battery: "56Wh",
    weight: "1.4 kg",
  },
  {
    name: "Dev Edge 13",
    category: "DEVELOPPEMENT",
    shortDescription:
      "16 Go et un écran fin : le compromis idéal pour coder, lancer des conteneurs et tenir la journée sans prise.",
    price: 480_000,
    stock: 0,
    cpu: "Core i7-1360P",
    gpu: "Intel Iris Xe",
    ram: "16 Go DDR4",
    storage: "512 Go SSD",
    screen: '13.3" QHD',
    connectivity: "2x USB-C, 1x USB-A, HDMI",
    battery: "68Wh",
    weight: "1.3 kg",
  },
  {
    name: "Eco Lite 15",
    category: "BUREAUTIQUE",
    shortDescription:
      "Le PC d'entrée de gamme qui fait le travail : bureautique, navigation et vidéos. Simple et fiable.",
    price: 199_000,
    stock: 5,
    cpu: "Ryzen 3 7320U",
    gpu: "AMD Radeon",
    ram: "8 Go DDR4",
    storage: "256 Go SSD",
    screen: '15.6" FHD',
    connectivity: "2x USB-A, HDMI",
    battery: "45Wh",
    weight: "1.8 kg",
  },
  {
    name: "Pixel Grid 16",
    category: "CREATION",
    shortDescription:
      "32 Go pour le design graphique et la vidéo légère, avec un écran fidèle. L'alternative raisonnable au Studio Pro X.",
    price: 890_000,
    stock: 2,
    cpu: "Ryzen 7 7840H",
    gpu: "RTX 4060",
    ram: "32 Go DDR5",
    storage: "1 To SSD",
    screen: '16" QHD 120Hz',
    connectivity: "2x USB-C, 2x USB-A, HDMI",
    battery: "76Wh",
    weight: "2.0 kg",
  },
];

async function main() {
  console.log("Nettoyage de la base...");
  await prisma.reservation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log("Insertion des produits...");
  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        ...p,
        images: [
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=60",
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=60",
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=60",
        ].join("\n"),
      },
    });
  }

  console.log("Création de l'admin par défaut...");
  const passwordHash = await bcrypt.hash("pcstore2026", 10);
  await prisma.adminUser.create({
    data: { email: "admin@pcstore.bj", passwordHash },
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
