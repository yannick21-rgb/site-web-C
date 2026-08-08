"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@prisma/client";
import { splitImages } from "@/lib/format";

const CATEGORIES = [
  { value: "GAMING", label: "Gaming" },
  { value: "BUREAUTIQUE", label: "Bureautique" },
  { value: "CREATION", label: "Création" },
  { value: "DEVELOPPEMENT", label: "Développement" },
] as const;

const IMAGE_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=60",
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=60",
  "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=60",
];

const SECTIONS: { title: string; fields: { name: "cpu" | "gpu" | "ram" | "storage" | "screen" | "connectivity" | "battery" | "weight"; label: string; placeholder?: string }[] }[] = [
  {
    title: "Performance",
    fields: [
      { name: "cpu", label: "CPU", placeholder: "Ryzen 7 7735H" },
      { name: "gpu", label: "GPU", placeholder: "RTX 4060" },
      { name: "ram", label: "RAM", placeholder: "16 Go DDR5" },
      { name: "storage", label: "Stockage", placeholder: "512 Go SSD" },
    ],
  },
  {
    title: "Affichage & connectique",
    fields: [
      { name: "screen", label: "Écran", placeholder: '15.6" QHD 165Hz' },
      { name: "connectivity", label: "Connectique", placeholder: "2x USB-C, 3x USB-A, HDMI" },
      { name: "battery", label: "Batterie", placeholder: "90Wh" },
      { name: "weight", label: "Poids", placeholder: "2.1 kg" },
    ],
  },
];

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<string>(product?.category ?? "BUREAUTIQUE");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [specs, setSpecs] = useState({
    cpu: product?.cpu ?? "",
    gpu: product?.gpu ?? "",
    ram: product?.ram ?? "",
    storage: product?.storage ?? "",
    screen: product?.screen ?? "",
    connectivity: product?.connectivity ?? "",
    battery: product?.battery ?? "",
    weight: product?.weight ?? "",
  });
  const [images, setImages] = useState<string[]>(
    product && splitImages(product.images).length > 0 ? splitImages(product.images) : [...IMAGE_PLACEHOLDERS]
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setSpec = (k: keyof typeof specs, v: string) => setSpecs((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      name: name.trim(),
      category,
      shortDescription: shortDescription.trim(),
      price: Number(price),
      stock: Number(stock),
      ...specs,
      images: images.filter((i) => i.trim()),
    };    try {
      const res = await fetch(isEdit ? `/api/produits/${product!.id}` : "/api/produits", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'enregistrement.");
      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'enregistrement.");
      setSaving(false);
    }
  };

  const setImage = (i: number, v: string) =>
    setImages((prev) => prev.map((x, j) => (j === i ? v : x)));

  return (
    <form onSubmit={submit} className="max-w-[760px]">
      <div className="bg-surface border border-line rounded-[20px] p-7 mb-4">
        <h2 className="text-[0.75rem] font-semibold text-violet-deep uppercase tracking-[1.5px] mb-4">
          {SECTIONS[0].title}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.85rem] mb-2" htmlFor="f-name">Nom *</label>
            <input id="f-name" className="field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[0.85rem] mb-2" htmlFor="f-cat">Catégorie *</label>
            <select id="f-cat" className="field cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[0.85rem] mb-2" htmlFor="f-price">Prix (FCFA) *</label>
            <input id="f-price" className="field mono" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[0.85rem] mb-2" htmlFor="f-stock">Quantité en stock *</label>
            <input id="f-stock" className="field mono" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[0.85rem] mb-2" htmlFor="f-desc">Description courte</label>
            <textarea id="f-desc" className="field min-h-[70px] resize-y" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}></textarea>
          </div>
        </div>
      </div>

      {SECTIONS.map((s) => (
        <div key={s.title} className="bg-surface border border-line rounded-[20px] p-7 mb-4">
          <h2 className="text-[0.75rem] font-semibold text-violet-deep uppercase tracking-[1.5px] mb-4">{s.title}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {s.fields.map((f) => (
              <div key={f.name as string}>
                <label className="block text-[0.85rem] mb-2" htmlFor={`f-${f.name}`}>
                  {f.label}
                </label>
                <input
                  id={`f-${f.name}`}
                  className="field"
                  placeholder={f.placeholder}
                  value={specs[f.name as keyof typeof specs] as string}
                  onChange={(e) => setSpec(f.name as keyof typeof specs, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-surface border border-line rounded-[20px] p-7 mb-4">
        <h2 className="text-[0.75rem] font-semibold text-violet-deep uppercase tracking-[1.5px] mb-2">Photos</h2>
        <p className="text-muted text-[0.8rem] mb-4">
          URL d&apos;images (3 proposées par défaut, modifiables). L&apos;upload de fichiers sera
          branché sur un stockage cloud en V2.
        </p>
        {images.map((img, i) => (
          <input
            key={i}
            className="field mono !text-[0.82rem] mb-2"
            placeholder={`URL image ${i + 1}`}
            value={img}
            onChange={(e) => setImage(i, e.target.value)}
          />
        ))}
      </div>

      {error && <div className="mono text-[0.78rem] text-red mb-4">{error}</div>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Ajouter le produit"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.push("/admin/produits")}>
          Annuler
        </button>
      </div>
    </form>
  );
}
