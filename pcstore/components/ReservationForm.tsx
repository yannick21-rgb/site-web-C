"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";

function ReservationFormInner({ products }: { products: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const preselect = params.get("produit") ?? "";
  const [productId, setProductId] = useState(preselect);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const selected = products.find((p) => p.id === productId) ?? null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selected) {
      setError("Choisis un produit dans la liste.");
      return;
    }
    if (!name.trim()) {
      setError("Renseigne ton nom complet.");
      return;
    }
    if (!/^\+?\d[\d\s]{7,}$/.test(phone.trim())) {
      setError("Renseigne un numéro de téléphone valide (ex. +229 97 00 00 00).");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selected.id,
          clientName: name.trim(),
          clientPhone: phone.trim(),
          comment: comment.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      router.push(
        `/reserver/succes?produit=${selected.id}&nom=${encodeURIComponent(name.trim())}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue, réessaie.");
      setSending(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-[6%] pt-[50px] pb-[100px]">
      <div className="text-[0.75rem] font-semibold text-violet-deep tracking-[2px] uppercase mb-[12px]">
        Réservation
      </div>
      <h1 className="font-sora font-extrabold uppercase text-[2rem] mb-[10px]">Réserver un PC</h1>
      <p className="text-muted text-[0.95rem] mb-[36px] leading-[1.6]">
        Laisse tes coordonnées pour retenir une unité. Ta demande reste{" "}
        <b className="text-ink">en attente</b> jusqu&apos;à validation par notre équipe.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-[22px]">
        <div className="bg-white border border-line rounded-[22px] p-[24px] flex flex-col gap-[20px] shadow-[0_14px_40px_-26px_rgba(107,91,216,0.4)]">
          <div>
            <label htmlFor="produit" className="block text-[0.85rem] font-medium mb-[9px]">
              Produit *
            </label>
            <select
              id="produit"
              className="field cursor-pointer"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">— Choisir un produit —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} — {formatPrice(p.price)} FCFA {p.stock <= 0 ? "(rupture)" : ""}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="bg-surface-2 border border-line rounded-[16px] flex items-center justify-between px-[18px] py-4">
              <div>
                <div className="font-semibold text-[0.95rem]">{selected.name}</div>
                <div className="text-[0.78rem] font-medium text-muted mt-[3px]">
                  {selected.cpu} · {selected.gpu} · {selected.ram}
                </div>
              </div>
              <div className="font-sora font-bold text-violet-deep">{formatPrice(selected.price)} F</div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[0.85rem] font-medium mb-[9px]">
              Nom complet *
            </label>
            <input
              id="name"
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[0.85rem] font-medium mb-[9px]">
              Téléphone * <span className="text-[0.7rem] text-muted font-normal ml-2">+229 ...</span>
            </label>
            <input
              id="phone"
              className="field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+229"
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-[0.85rem] font-medium mb-[9px]">
              Commentaire <span className="text-[0.7rem] text-muted font-normal ml-2">optionnel</span>
            </label>
            <textarea
              id="comment"
              className="field min-h-[90px] resize-y"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="bg-white border border-line rounded-[18px] px-[18px] py-4 text-[0.84rem] text-muted flex gap-3 items-start leading-[1.6]">
          <div className="w-6 h-6 rounded-full bg-violet-deep/10 text-violet-deep border border-violet-deep/25 text-[0.8rem] font-semibold flex items-center justify-center shrink-0">
            i
          </div>
          <div>
            La réservation bloque l&apos;unité 48h. Aucun paiement en ligne : le règlement se
            fait en boutique, sur place, au retrait.
          </div>
        </div>

        {error && <div className="text-[0.82rem] font-medium text-red">{error}</div>}

        <button type="submit" className="btn-primary w-full" disabled={sending}>
          {sending ? "Envoi en cours..." : "Confirmer ma réservation"}
        </button>
      </form>
    </div>
  );
}

export default function ReservationForm({ products }: { products: Product[] }) {
  return (
    <Suspense>
      <ReservationFormInner products={products} />
    </Suspense>
  );
}