"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </>
    ),
  },
  {
    href: "/catalogue",
    label: "Catalogue",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.5 12h17M12 3.5a15 15 0 0 1 0 17M12 3.5a15 15 0 0 0 0 17" />
      </>
    ),
  },
  {
    href: "/admin/login",
    label: "Compte",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
      </>
    ),
  },
];

export default function SideRail() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 bg-white/90 backdrop-blur border border-line rounded-full px-2.5 py-4 shadow-[0_18px_45px_-18px_rgba(107,91,216,0.45)]">
      {ITEMS.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.label}
            href={it.href}
            aria-label={it.label}
            title={it.label}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              active ? "bg-navy text-lime" : "text-muted hover:text-ink hover:bg-surface-2"
            }`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {it.icon}
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
