import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    title: "Specs vérifiées",
    desc: "Chaque machine est contrôlée et ses caractéristiques confirmées avant mise en stock.",
    icon: (
      <path d="M3 6h7a4 4 0 0 1 4 4v10M6 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6M6 9h0M9 13h4a2 2 0 0 1 2 2v2M9 9v2m6 8h0" />
    ),
  },
  {
    title: "Réservation sans risque",
    desc: "Aucun paiement en ligne : tu règles en boutique, au moment du retrait.",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Recommandation guidée",
    desc: "Un questionnaire de 3 questions classe le catalogue selon ton vrai usage.",
    icon: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.5" />
      </>
    ),
  },
  {
    title: "Retrait à Cotonou",
    desc: "Viens chercher ta machine en boutique, ou réserver pour l&apos;avoir sous 48h.",
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
];

const STATS = [
  {
    icon: <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 12v3M8 20h8" />,
    value: "{models}",
    label: "Modèles disponibles",
    sub: "en stock à Cotonou",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    value: "48h",
    label: "Réservation bloquée",
    sub: "gratuite, pour chaque PC",
  },
  {
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </>
    ),
    value: "0 F",
    label: "Paiement en ligne",
    sub: "tu règles en boutique, au retrait",
  },
  {
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    value: "12",
    label: "Mois de garantie",
    sub: "sur chaque machine",
  },
];

const TESTIMONIALS = [
  {
    name: "Kévin A.",
    role: "Montage vidéo",
    text: "J'ai réservé le Studio Pro X le matin, récupéré en boutique l'après-midi. Ils avaient bien vérifié la machine devant moi.",
  },
  {
    name: "Mariam D.",
    role: "Étudiante",
    text: "Le questionnaire m'a évité de payer 500 000 F pour des specs dont je n'avais pas besoin. Prix honnête.",
  },
  {
    name: "Yannick H.",
    role: "Développeur",
    text: "Enfin un vendeur qui parle specs réelles, pas de marketing. La réservation sans prépaiement, c'est un vrai plus.",
  },
];

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  const featured = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden px-[6%] pt-[40px] pb-[70px] lg:pl-[calc(6%+84px)] lg:pt-[60px]">
        <div className="hero-bg"></div>
        <div className="relative z-[2] grid lg:grid-cols-[minmax(0,1fr)_auto] gap-[70px] items-center">
          <div className="max-w-[620px]">
            <h1 className="font-sora font-extrabold uppercase text-[2.4rem] sm:text-[3.2rem] lg:text-[3.7rem] leading-[1.05] tracking-tight mb-[26px]">
              Le bon PC,
              <br />
              pas le PC par{" "}
              <span className="bg-[linear-gradient(135deg,#8b7cf6,#6a5cd8)] bg-clip-text text-transparent">
                défaut
              </span>
              .
            </h1>
            <p className="text-muted text-[1.05rem] leading-[1.65] mb-[38px] max-w-[480px]">
              Dis-nous ce que tu veux faire — gaming, montage, cours, business — et on te montre
              les machines qui tiennent vraiment la route pour ça.
            </p>
            <div className="flex gap-[14px] flex-wrap">
              <Link href="/questionnaire" className="btn-primary">
                Trouver mon PC →
              </Link>
              <Link href="/catalogue" className="btn-secondary">
                Voir le catalogue
              </Link>
            </div>
          </div>
          <div className="relative z-[2]">
            <HeroCarousel products={products} />
          </div>
        </div>
      </section>

      {/* BANDEAU POINTS FORTS */}
      <section className="bg-navy text-white px-[6%] py-[60px] lg:py-[72px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-lime/10 border border-lime/25 flex items-center justify-center text-lime">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-sora font-bold uppercase tracking-[0.5px] text-[1.02rem]">{f.title}</h3>
              <p className="text-white/60 text-[0.92rem] leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOGUE */}
      <section className="px-[6%] py-[80px] lg:py-[100px]">
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <h2 className="font-sora font-bold text-[1.9rem] sm:text-[2.3rem] uppercase">Le catalogue</h2>
            <p className="text-muted max-w-[440px] text-[0.98rem] mt-3">
              Une sélection de machines vérifiées, avec les vraies caractéristiques — pas de fiche vague.
            </p>
          </div>
          <Link href="/catalogue" className="btn-secondary text-sm">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* QUESTIONNAIRE */}
      <section className="px-[6%] pb-[90px] lg:pb-[110px]">
        <div className="bg-white border border-line rounded-[32px] overflow-hidden grid lg:grid-cols-2 items-stretch shadow-[0_30px_70px_-30px_rgba(107,91,216,0.35)]">
          <div className="p-[36px] lg:p-[52px]">
            <h2 className="font-sora font-bold uppercase text-[1.5rem] sm:text-[1.8rem] mb-[16px]">
              Pas sûr de ce qu&apos;il te faut ?
            </h2>
            <p className="text-muted mb-[30px] leading-[1.65]">
              Réponds à quelques questions sur ton usage — montage, jeux, cours, dev — et on classe
              le catalogue selon ce qui te correspond vraiment, pas selon ce qui se vend le plus.
            </p>
            <div className="flex gap-2 flex-wrap mb-[32px]">
              {["Gaming", "Montage vidéo", "Bureautique", "Développement", "Design"].map((t) => (
                <span key={t} className="text-[0.8rem] font-medium text-violet-deep bg-surface-2 border border-line px-4 py-2 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <Link href="/questionnaire" className="btn-primary">
              Commencer le questionnaire →
            </Link>
          </div>
          <div className="bg-[linear-gradient(150deg,#e9e3ff_0%,#f3efff_50%,#ffffff_100%)] p-[clamp(28px,5vw,52px)] flex flex-col justify-center gap-7 border-t lg:border-t-0 lg:border-l border-line">
            {[
              ["Studio Pro X", "94%", "Tu veux faire quoi avec, principalement ?"],
              ["Aster RX-15", "78%", "Ton budget approximatif ?"],
              ["Nova Slim 14", "41%", "Qu'est-ce qui compte le plus pour toi ?"],
            ].map(([name, score, q]) => (
              <div key={name}>
                <div className="flex justify-between items-baseline text-[0.88rem] mb-[8px]">
                  <span className="font-semibold">{name}</span>
                  <span className="font-sora font-bold text-violet-deep">{score}</span>
                </div>
                <div className="h-[8px] bg-white border border-line rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#8b7cf6,#6a5cd8)]"
                    style={{ width: score.replace("%", "") + "%" }}
                  ></div>
                </div>
                <div className="text-[0.75rem] text-muted mt-[6px]">{q}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="bg-[linear-gradient(120deg,#8b7cf6_0%,#6a5cd8_100%)] px-[6%] py-[64px] lg:py-[80px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 text-white">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </div>
              <div className="font-sora font-extrabold text-[1.9rem] leading-none">
                {s.value === "{models}" ? `${products.length}` : s.value}
              </div>
              <div className="font-semibold text-[0.95rem]">{s.label}</div>
              <div className="text-white/70 text-[0.8rem]">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="bg-navy text-white px-[6%] py-[64px] lg:py-[80px]">
        <div className="flex flex-col gap-8">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-navy-2 border border-white/10 rounded-[24px] p-7 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[linear-gradient(135deg,#8b7cf6,#6a5cd8)] flex items-center justify-center font-sora font-bold">
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-[0.95rem]">{t.name}</div>
                    <div className="text-white/50 text-[0.8rem]">{t.role}</div>
                  </div>
                </div>
                <p className="text-white/75 text-[0.9rem] leading-[1.65]">“{t.text}”</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-[24px] p-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-sora font-bold uppercase text-[1.4rem] text-ink mb-3">Ça te parle ?</h2>
              <p className="text-muted text-[0.95rem] leading-[1.6] max-w-[440px]">
                Réserve une machine en 2 minutes. Aucun paiement en ligne, récupération en
                boutique à Cotonou.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/reserver" className="btn-primary">
                Réserver un PC
              </Link>
              <Link href="/questionnaire" className="btn-secondary">
                Trouver mon PC
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}