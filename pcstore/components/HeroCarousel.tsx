"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@prisma/client";
import { CATEGORY_LABELS_UPPER, formatPrice, initials } from "@/lib/format";
import type { Category } from "@/lib/types";

const ROTATION_MS = 3500;
const TRANSITION_MS = 620;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

type Slot = { product: Product; leaving: boolean };

function HeroCard({ product, leaving }: { product: Product; leaving: boolean }) {
  const specPills = [product.ram, product.storage, product.screen];

  return (
    <Link
      href={`/produits/${product.id}`}
      className={`block bg-white rounded-[28px] border border-line p-5 shadow-[0_30px_60px_-24px_rgba(107,91,216,0.4)] ${
        leaving ? "animate-hero-leave pointer-events-none" : "animate-hero-in"
      }`}
      aria-label={`Voir la fiche du ${product.name}`}
    >
      <div className="rounded-[20px] aspect-[16/10] relative overflow-hidden bg-[linear-gradient(135deg,#e7e1ff_0%,#f4eaff_55%,#eef0fb_100%)] mb-5 flex items-center justify-center">
        <div className="absolute w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(139,124,246,0.35),transparent_70%)]"></div>
        <span className="relative font-sora font-extrabold text-[3.4rem] text-[#8b7cf6]/50 select-none">
          {initials(product.name)}
        </span>
        <span className="absolute bottom-3 right-4 text-[0.65rem] font-medium uppercase tracking-[2px] text-[#6b6a78]/80">
          {CATEGORY_LABELS_UPPER[product.category as Category]}
        </span>
      </div>

      <div className="px-1 pb-1">
        <span className="card-tag">{CATEGORY_LABELS_UPPER[product.category as Category]}</span>
        <h3 className="font-sora font-bold text-[1.35rem] mt-1 mb-3">{product.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {specPills.map((s) => (
            <span
              key={s}
              className="text-[0.72rem] font-medium text-violet-deep bg-surface-2 border border-line px-3 py-1.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="font-sora font-extrabold text-[1.4rem] leading-none">
            {formatPrice(product.price)}
            <span className="text-[0.78rem] font-semibold text-muted ml-1.5">FCFA</span>
          </div>
          <span className="w-12 h-12 rounded-full bg-lime text-lime-ink flex items-center justify-center shadow-[0_10px_20px_-6px_rgba(198,255,63,0.7)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function SideRail() {
  const pathname = usePathname();

  const items: { href: string; label: string; icon: React.ReactNode }[] = [
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
      href: "/catalogue",
      label: "Catégories",
      icon: (
        <>
          <path d="M4 6h16M4 12h10M4 18h7" />
          <path d="m17 15 3 3-3 3" />
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

  return (
    <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 bg-white/90 backdrop-blur border border-line rounded-full px-2.5 py-4 shadow-[0_18px_45px_-18px_rgba(107,91,216,0.45)]">
      {items.map((it) => {
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

export default function HeroCarousel({ products }: { products: Product[] }) {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  const inStock = useMemo(() => products.filter((p) => p.stock > 0), [products]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const slotsRef = useRef<Slot[]>([]);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    if (slots.length === 0 && inStock.length > 0) {
      setSlots([{ product: inStock[0]!, leaving: false }]);
    }
  }, [inStock, slots.length]);

  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = () => {
    const prev = slotsRef.current;
    if (prev.length === 0 || inStock.length === 0) return;
    const last = prev[prev.length - 1]!;
    const curIdx = inStock.findIndex((p) => p.id === last.product.id);
    const next = inStock[(curIdx + 1) % inStock.length]!;
    setSlots([...prev, { product: next, leaving: false }]);
  };

  useEffect(() => {
    if (paused || reduced || inStock.length === 0) return;
    const t = setInterval(() => advanceRef.current(), ROTATION_MS);
    return () => clearInterval(t);
  }, [paused, reduced, inStock.length]);

  useEffect(() => {
    if (slots.length <= 1) return;
    const timeout = setTimeout(() => {
      setSlots((prev) => prev.slice(1));
    }, TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [slots]);

  if (inStock.length === 0) {
    return (
      <div className="bg-white rounded-[28px] p-8 shadow-[0_30px_60px_-24px_rgba(107,91,216,0.4)] max-w-[360px]">
        <p className="text-muted">Catalogue en cours de réapprovisionnement — reviens vite.</p>
        <Link href="/catalogue" className="btn-secondary text-sm mt-6">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const lastSlot = slots[slots.length - 1];
  const progress = lastSlot
    ? Math.max(0, inStock.findIndex((p) => p.id === lastSlot.product.id))
    : 0;

  const jumpTo = (p: Product) => {
    if (!lastSlot) {
      setSlots([{ product: p, leaving: false }]);
      return;
    }
    if (lastSlot.product.id === p.id) return;
    setSlots([...slots, { product: p, leaving: false }]);
  };

  if (reduced) {
    return (
      <div className="max-w-[360px]">
        <div className="animate-hero-fade-in">
          <HeroCard product={inStock[0]!} leaving={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SideRail />

      <div
        className="relative max-w-[360px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="absolute -top-8 -right-6 z-[1] hidden sm:block">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-[0_16px_36px_-14px_rgba(107,91,216,0.45)] animate-float border border-line">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-muted mb-1">
              Match
            </div>
            <div className="font-sora font-extrabold text-[1.5rem] bg-[linear-gradient(135deg,#8b7cf6,#6a5cd8)] bg-clip-text text-transparent">
              {68 + ((progress * 7) % 30)}%
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 -left-8 z-[5] hidden sm:block">
          <div className="bg-navy rounded-2xl px-4 py-3 text-lime shadow-[0_16px_36px_-14px_rgba(21,19,31,0.7)] animate-float border border-white/10">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[1.5px] text-white/60">
              Stock à Cotonou
            </div>
            <div className="font-sora font-extrabold text-[1.1rem] mt-0.5">
              {inStock.length} PC disponibles
            </div>
          </div>
        </div>

        <div className="relative min-h-[430px]">
          {slots.map((s, i) => (
            <div
              key={s.product.id}
              className={i === slots.length - 1 ? "relative z-[3]" : "absolute inset-0 z-[1]"}
            >
              <HeroCard product={s.product} leaving={i < slots.length - 1} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          {inStock.map((p, i) => (
            <button
              key={p.id}
              aria-label={`PC ${i + 1} : ${p.name}`}
              aria-current={i === progress}
              onClick={() => jumpTo(p)}
              className={`h-2 rounded-full transition-all ${
                i === progress ? "w-6 bg-violet-deep" : "w-2 bg-[#cdc9e4] hover:bg-violet"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}