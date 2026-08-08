"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Reservation, Product } from "@prisma/client";

type ResWithProduct = Reservation & { product: Product };
type Status = "TOUS" | "EN_ATTENTE" | "CONFIRMEE" | "REFUSEE";

const FILTERS: { value: Status; label: string }[] = [
  { value: "TOUS", label: "Toutes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "CONFIRMEE", label: "Confirmées" },
  { value: "REFUSEE", label: "Refusées" },
];

function badge(status: string) {
  if (status === "EN_ATTENTE") return <span className="badge-pill status-pending">En attente</span>;
  if (status === "CONFIRMEE") return <span className="badge-pill status-confirmed">Confirmée</span>;
  return <span className="badge-pill status-refused">Refusée</span>;
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}

export default function ReservationsTable({ reservations }: { reservations: ResWithProduct[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Status>("TOUS");

  const filtered = reservations.filter((r) => filter === "TOUS" || r.status === filter);

  const setStatus = async (id: string, status: "CONFIRMEE" | "REFUSEE") => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <div className="flex gap-2 mb-[18px] flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`chip ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-[12px] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Client", "Produit", "Contact", "Date", "Statut", ""].map((h) => (
                <th
                  key={h}
                  className="text-left mono text-[0.72rem] text-muted uppercase tracking-[0.5px] px-5 py-3.5 border-b border-line bg-surface-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-b-0">
                <td className="px-5 py-4">
                  <div className="font-semibold text-[0.88rem]">{r.clientName}</div>
                  {r.comment && (
                    <div className="text-[0.75rem] text-muted max-w-[200px] truncate" title={r.comment}>
                      💬 {r.comment}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-[0.88rem]">{r.product.name}</td>
                <td className="px-5 py-4 mono text-[0.85rem]">{r.clientPhone}</td>
                <td className="px-5 py-4 mono text-[0.8rem] text-muted">{formatDate(r.createdAt)}</td>
                <td className="px-5 py-4">{badge(r.status)}</td>
                <td className="px-5 py-4">
                  {r.status === "EN_ATTENTE" ? (
                    <div className="flex gap-2">
                      <button
                        className="border border-green text-green rounded-md px-3 py-1.5 text-[0.78rem] hover:bg-green/10 cursor-pointer"
                        onClick={() => setStatus(r.id, "CONFIRMEE")}
                      >
                        Valider
                      </button>
                      <button
                        className="border border-red text-red rounded-md px-3 py-1.5 text-[0.78rem] hover:bg-red/10 cursor-pointer"
                        onClick={() => setStatus(r.id, "REFUSEE")}
                      >
                        Refuser
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted text-[0.78rem] mono">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted mono text-[0.85rem]">
                  Aucune réservation avec ce statut.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
