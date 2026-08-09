"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/reservations", label: "Réservations" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="bg-white border-r border-line p-[20px] flex flex-col gap-1 lg:min-h-screen">
      <div className="font-sora font-extrabold text-[1.1rem] px-[12px] mb-8">
        PC<span>Store</span>{" "}
        <span className="text-muted text-[0.68rem] font-semibold uppercase tracking-[2px]">admin</span>
      </div>
      <nav className="flex lg:flex-col gap-1.5">
        {NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[0.9rem] font-medium transition-colors ${
                active
                  ? "bg-violet-deep text-white shadow-[0_10px_24px_-12px_rgba(107,92,216,0.7)]"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${active ? "bg-lime" : "bg-[#d5d1e8]"}`}
              ></span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-[18px] border-t border-line px-4 pb-3 text-[0.8rem] text-muted flex flex-col gap-3">
        {email && <span className="break-all font-medium">{email}</span>}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted hover:text-ink transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Retour au site
        </Link>
        <button
          className="text-left bg-none border-none text-[0.8rem] font-medium text-muted hover:text-red cursor-pointer"
          onClick={logout}
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}