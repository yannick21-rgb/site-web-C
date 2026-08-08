"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/questionnaire", label: "Trouver mon PC" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-line px-[6%] py-[22px] relative z-[5]">
      <Link href="/" className="font-chakra text-lg font-bold tracking-wide" onClick={() => setOpen(false)}>
        PC<span className="text-cyan">Store</span>
      </Link>

      <nav className="hidden md:flex gap-8 text-[0.92rem] text-muted">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="hover:text-ink transition-colors">
            {n.label}
          </Link>
        ))}
        <Link href="/reserver" className="hover:text-ink transition-colors">
          Réserver
        </Link>
      </nav>

      <Link href="/reserver" className="hidden md:inline-block bg-cyan text-[#04121a] font-semibold text-sm px-[18px] py-[9px] rounded-md">
        Réserver
      </Link>

      <button
        className="md:hidden bg-none border border-line text-ink px-3 py-1.5 rounded-md text-sm"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Menu"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-line px-[6%] py-4 flex flex-col gap-3">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-muted hover:text-ink">
              {n.label}
            </Link>
          ))}
          <Link href="/reserver" onClick={() => setOpen(false)} className="text-cyan">
            Réserver
          </Link>
        </div>
      )}
    </header>
  );
}
