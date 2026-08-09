"use client";

import Link from "next/link";
import { useState } from "react";
import SideRail from "@/components/SideRail";

const NAV = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/questionnaire", label: "Trouver mon PC" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SideRail />
      <header className="relative z-[5] px-[6%] py-[24px] flex items-center justify-between">
      <Link
        href="/"
        className="font-sora text-[1.35rem] font-extrabold tracking-tight"
        onClick={() => setOpen(false)}
      >
        CAPIE GROUP
        <span className="ml-[3px] inline-block w-[9px] h-[9px] rounded-full bg-lime align-middle"></span>
      </Link>

      <nav className="hidden md:flex items-center gap-9 text-[0.95rem] font-medium text-muted">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="hover:text-ink transition-colors">
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:block">
        <Link
          href="/reserver"
          className="inline-block bg-white border-[1.5px] border-[#16151f1f] text-ink font-semibold text-[0.9rem] px-[26px] py-[11px] rounded-full hover:border-violet transition-colors shadow-[0_8px_20px_-10px_rgba(22,21,31,0.25)]"
        >
          Réserver un PC
        </Link>
      </div>

      <button
        className="md:hidden bg-white border-[1.5px] border-[#16151f1f] text-ink px-3 py-1.5 rounded-full text-base"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Menu"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-[6%] right-[6%] bg-white border border-line rounded-2xl shadow-[0_20px_50px_-20px_rgba(22,21,31,0.3)] px-6 py-5 flex flex-col gap-4">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="text-ink font-medium hover:text-violet transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/reserver"
            onClick={() => setOpen(false)}
            className="text-ink font-semibold hover:text-violet transition-colors"
          >
            Réserver
          </Link>
        </div>
      )}
      </header>
    </>
  );
}