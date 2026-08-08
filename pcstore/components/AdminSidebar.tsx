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
    <aside className="bg-surface border-r border-line p-[18px] flex flex-col gap-1 lg:min-h-screen">
      <div className="font-chakra text-lg font-bold px-[10px] mb-8">
        PC<span className="text-cyan">Store</span>{" "}
        <span className="text-muted text-xs font-jetbrains font-normal">admin</span>
      </div>
      <nav className="flex lg:flex-col gap-1">
        {NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.9rem] ${
                active ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-cyan shadow-[0_0_6px_var(--cyan)]" : "bg-line"}`}></span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-[18px] border-t border-line px-2.5 pb-3 mono text-[0.78rem] text-muted flex flex-col gap-3">
        {email && <span className="break-all">{email}</span>}
        <button className="text-left bg-none border-none mono text-[0.78rem] text-muted hover:text-red cursor-pointer" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
